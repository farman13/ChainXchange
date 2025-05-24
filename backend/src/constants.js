export const SUPPORTED_TOKENS = [
    {
        name: 'SepoliaETH',
        decimals: 18,
        image: "https://insidebitcoins.com/wp-content/uploads/2024/12/ethereum-eth-logo-300x300.png",
        address: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14',  // uniswap weth address
        native: true
    },
    {
        name: 'USDT',
        address: '0x65D96C8e428595a174ad6926fFfB4E2365820918',
        ETHAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',  // to get the mainnet price of usdt
        decimals: 18,
        image: "https://cdn3d.iconscout.com/3d/premium/thumb/tether-usdt-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--cryptocurrency-pack-science-technology-icons-6044470.png",
        native: false
    },
    {
        name: 'USDC',
        address: '0x46e75BB06dDF1DCA6A9C25AF8a1557aEe07c5616',
        ETHAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 18,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrmDVXsmOdAgVsCgbjR71LJ83geUNrdvjh5yL8sOIaV7H3Atn2RFr5pA0wviTVAezjJc0&usqp=CAU",
        native: false
    }

]

import { JsonRpcProvider } from 'ethers'

export const connection = new JsonRpcProvider(process.env.SEPOLIA_PROVIDER);

export const DB_NAME = "DCEX";