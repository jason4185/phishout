import { createClient } from 'genlayer-js'
import { testnetBradbury } from 'genlayer-js/chains'

export const PHISHOUT_CONTRACT = '0xf5E68861Fcf61141190bf3d5383795E207337436'

// Read client — no wallet needed for reads and receipt polling
export const genLayerClient = createClient({
  chain: testnetBradbury,
})
