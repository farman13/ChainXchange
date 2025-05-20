export const SUPPORTED_TOKENS = [
    {
        name: 'SepoliaETH',
        decimals: 18,
        image: "https://insidebitcoins.com/wp-content/uploads/2024/12/ethereum-eth-logo-300x300.png",
        address: "",
        native: true
    },
    {
        name: 'USDT',
        address: '0x65D96C8e428595a174ad6926fFfB4E2365820918',
        ETHAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',  // to get the mainnet price of usdt
        decimals: 18,
        image: "https://www.coinpass.com/media/images/MR-4735-Coinpass-.format-webp.webpquality-90.height-752.webp",
        native: false
    },
    {
        name: 'USDC',
        address: '0x46e75BB06dDF1DCA6A9C25AF8a1557aEe07c5616',
        ETHAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 18,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBMfDxr1PrxlKVnOBktTGlNgXSVYUT0LB7Q&s",
        native: false
    }

]

import { JsonRpcProvider } from 'ethers'

export const connection = new JsonRpcProvider(process.env.SEPOLIA_PROVIDER);

export const DB_NAME = "DCEX";