export const SUPPORTED_TOKENS = [
    {
        name: 'USDT',
        address: '0x65D96C8e428595a174ad6926fFfB4E2365820918',
        image: "https://www.coinpass.com/media/images/MR-4735-Coinpass-.format-webp.webpquality-90.height-752.webp",
    },
    {
        name: 'USDC',
        address: '0x46e75BB06dDF1DCA6A9C25AF8a1557aEe07c5616',
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBMfDxr1PrxlKVnOBktTGlNgXSVYUT0LB7Q&s",
    },

]

import { JsonRpcProvider } from 'ethers'

export const connection = new JsonRpcProvider(process.env.SEPOLIA_PROVIDER);

export const DB_NAME = "DCEX";