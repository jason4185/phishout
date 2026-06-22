"use client"

import { useState, useCallback, useEffect } from 'react'
import { genLayerClient } from '@/lib/phishout'

type EthAddress = `0x${string}`

// Minimal window.ethereum shape used here
interface EIP1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on: (event: string, handler: (...args: unknown[]) => void) => void
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider
  }
}

export interface UseWalletReturn {
  address: EthAddress | null
  connect: () => Promise<void>
  disconnect: () => void
  isConnecting: boolean
}

export function useWallet(): UseWalletReturn {
  const [address, setAddress] = useState<EthAddress | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    // Restore already-connected account without prompting
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        const list = accounts as string[]
        if (list[0]) setAddress(list[0] as EthAddress)
      })
      .catch(() => {})

    // Keep in sync when the user switches or disconnects in MetaMask
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[]
      setAddress(accounts[0] ? (accounts[0] as EthAddress) : null)
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet detected. Please install MetaMask.')
    }
    setIsConnecting(true)
    try {
      // Request accounts — triggers MetaMask popup if not already connected
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[]
      const addr = accounts[0] as EthAddress

      // Add testnetBradbury to MetaMask and install the GenLayer snap
      try {
        await genLayerClient.connect('testnetBradbury')
      } catch {
        // snap install may fail on non-Flask MetaMask; chain switch still works
      }

      setAddress(addr)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
  }, [])

  return { address, connect, disconnect, isConnecting }
}
