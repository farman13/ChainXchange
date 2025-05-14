export const SUPPORTED_TOKENS = [
    {
        name: 'USDT',
        address: '0x65D96C8e428595a174ad6926fFfB4E2365820918',
    },
    {
        name: 'USDC',
        address: '0x46e75BB06dDF1DCA6A9C25AF8a1557aEe07c5616'
    }
]

import { JsonRpcProvider } from 'ethers'

export const connection = new JsonRpcProvider(process.env.SEPOLIA_PROVIDER);