"use client"

import { useState, useCallback } from 'react'
import { createClient } from 'genlayer-js'
import { testnetBradbury } from 'genlayer-js/chains'
import { TransactionStatus } from 'genlayer-js/types'
import { genLayerClient, PHISHOUT_CONTRACT } from '@/lib/phishout'
import { useWallet } from './useWallet'
import type { TransactionHash } from 'genlayer-js/types'

export type LoadingPhase = 'consensus'

export interface UsePhishoutReturn {
  checkUrl: (url: string) => Promise<void>
  loading: boolean
  loadingPhase: LoadingPhase | null
  txHash: string | null
  result: number | null
  isCached: boolean
  error: string | null
  reset: () => void
}

export function usePhishout(): UsePhishoutReturn {
  const { address } = useWallet()
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [result, setResult] = useState<number | null>(null)
  const [isCached, setFromCache] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setLoading(false)
    setLoadingPhase(null)
    setTxHash(null)
    setResult(null)
    setFromCache(false)
    setError(null)
  }, [])

  const checkUrl = useCallback(async (url: string) => {
    if (!address) {
      setError('Please connect your wallet to check a website.')
      return
    }

    setLoading(true)
    setLoadingPhase('consensus')
    setTxHash(null)
    setResult(null)
    setFromCache(false)
    setError(null)

    try {
      const writeClient = createClient({
        chain: testnetBradbury,
        account: address,
        provider: typeof window !== 'undefined' ? window.ethereum : undefined,
      })

      const hash = (await writeClient.writeContract({
        address: PHISHOUT_CONTRACT,
        functionName: 'check_url',
        args: [url],
        value: BigInt(0),
      })) as TransactionHash

      setTxHash(hash)

      const receipt = await (writeClient as any).waitForTransactionReceipt({
        hash,
        status: TransactionStatus.ACCEPTED,
        retries: 200,
        pollingInterval: 5000,
      })

      if (receipt.txExecutionResultName !== 'FINISHED_WITH_RETURN') {
        setError('Verification could not be completed — please try again.')
        return
      }

      // Retry loop — gives storage time to propagate after ACCEPTED
      let phishingSite: number | null = null
      for (let i = 0; i < 4; i++) {
        try {
          const resultValue = await genLayerClient.readContract({
            address: PHISHOUT_CONTRACT,
            functionName: 'get_storage',
            args: [url],
            stateStatus: 'accepted',
          })
          const n = Number(resultValue)
          if (n === 0 || n === 1) {
            phishingSite = n
            break
          }
        } catch {}
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      if (phishingSite === 0 || phishingSite === 1) {
        setResult(phishingSite)
        setFromCache(false)
      } else {
        setError('Verification could not be completed — please try again.')
      }

    } catch (err) {
      console.error('[phishout] error:', err)
      setError('Verification could not be confirmed — please try again')
    } finally {
      setLoading(false)
      setLoadingPhase(null)
    }
  }, [address])

  return { checkUrl, loading, loadingPhase, txHash, result, isCached, error, reset }
}
