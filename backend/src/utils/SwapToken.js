import { ethers } from 'ethers';
import { FACTORY_ABI } from '../ABI/factory.js';
import { QUOTER_ABI } from '../ABI/quoter.js';
import { SWAP_ROUTER_ABI } from '../ABI/swaprouter.js';
import { POOL_ABI } from '../ABI/pool.js';
import { TOKEN_IN_ABI } from '../ABI/token.js';


// Deployment Addresses
const POOL_FACTORY_CONTRACT_ADDRESS = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
const QUOTER_CONTRACT_ADDRESS = '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3';
const SWAP_ROUTER_CONTRACT_ADDRESS = '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E';
const privateKey = 'd52107d0e2cc2e8107074dcab2a7da9fac0522081e01682b84bcc840d2009633';

// Provider, Contract & Signer Instances
const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/QI_q9umXYDJqeAqM-dSGtKZS9_KjmO4Q");
const factoryContract = new ethers.Contract(POOL_FACTORY_CONTRACT_ADDRESS, FACTORY_ABI, provider);
const quoterContract = new ethers.Contract(QUOTER_CONTRACT_ADDRESS, QUOTER_ABI, provider);
const signer = new ethers.Wallet(privateKey, provider);

// Token Configuration
const USDT = {
    chainId: 11155111,
    address: '0x65D96C8e428595a174ad6926fFfB4E2365820918',
    decimals: 18,
    name: 'USDT',
    isToken: true,
    isNative: false,
};

const USDC = {
    chainId: 11155111,
    address: '0x46e75BB06dDF1DCA6A9C25AF8a1557aEe07c5616',
    decimals: 18,
    name: 'USDC',
    isToken: true,
    isNative: false,
};

async function approveToken(tokenAddress, tokenABI, amount, wallet) {
    try {
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);

        const approveTransaction = await tokenContract.approve.populateTransaction(
            SWAP_ROUTER_CONTRACT_ADDRESS,
            ethers.parseEther(amount.toString())
        );

        const transactionResponse = await wallet.sendTransaction(approveTransaction);
        console.log(`-------------------------------`);
        console.log(`Sending Approval Transaction...`);
        console.log(`-------------------------------`);
        console.log(`Transaction Sent: ${transactionResponse.hash}`);
        console.log(`-------------------------------`);
        const receipt = await transactionResponse.wait();
        console.log(`Approval Transaction Confirmed! https://sepolia.etherscan.io/txn/${receipt.hash}`);
    } catch (error) {
        console.error("An error occurred during token approval:", error);
        throw new Error("Token approval failed");
    }
}

async function getPoolInfo(factoryContract, tokenIn, tokenOut) {
    const poolAddress = await factoryContract.getPool(tokenIn.address, tokenOut.address, 3000);
    if (!poolAddress || poolAddress === ethers.ZeroAddress) {
        throw new Error("Failed to get pool address");
    }
    console.log("1 PoolAdrress :", poolAddress);

    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
    const [token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
    ]);
    return { poolContract, token0, token1, fee };
}

async function quoteAndLogSwap(quoterContract, fee, signer, amountIn, baseAsset, quoteAsset) {
    const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall({
        tokenIn: baseAsset.address,
        tokenOut: quoteAsset.address,
        fee: fee,
        recipient: signer.address,
        deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
        amountIn: amountIn,
        sqrtPriceLimitX96: 0,
    });
    console.log(`-------------------------------`);
    console.log("2 quoterAmount", quotedAmountOut)
    console.log(`Token Swap will result in: ${ethers.formatUnits(quotedAmountOut[0].toString(), quoteAsset.decimals)} ${quoteAsset.name} for ${ethers.formatEther(amountIn)} ${baseAsset.name}`);
    const amountOut = ethers.formatUnits(quotedAmountOut[0], quoteAsset.decimals);
    return amountOut;
}

async function prepareSwapParams(poolContract, signer, amountIn, amountOut, baseAsset, quoteAsset) {
    return {
        tokenIn: baseAsset.address,
        tokenOut: quoteAsset.address,
        fee: await poolContract.fee(),
        recipient: signer.address,
        amountIn: amountIn,
        amountOutMinimum: ethers.parseUnits(amountOut.toString(), quoteAsset.decimals),
        sqrtPriceLimitX96: 0,
    };
}

async function executeSwap(swapRouter, params, signer) {
    const transaction = await swapRouter.exactInputSingle.populateTransaction(params);
    const receipt = await signer.sendTransaction(transaction);
    console.log(`-------------------------------`);
    console.log(`Receipt: https://sepolia.etherscan.io/tx/${receipt.hash}`);
    console.log(`-------------------------------`);
    await receipt.wait();
    return receipt.hash;
}

async function SwapToken(baseAsset, quoteAsset, baseAmount) {
    const inputAmount = baseAmount;
    const amountIn = ethers.parseUnits(inputAmount.toString(), 18);

    try {
        await approveToken(baseAsset.address, TOKEN_IN_ABI, inputAmount, signer);
        const { poolContract, fee } = await getPoolInfo(factoryContract, baseAsset, quoteAsset);
        console.log(`-------------------------------`);
        console.log(`Fetching Quote for: ${baseAsset.name} to ${quoteAsset.name}`);
        console.log(`-------------------------------`);
        console.log(`Swap Amount: ${ethers.formatEther(amountIn)}`);

        const quotedAmountOut = await quoteAndLogSwap(quoterContract, fee, signer, amountIn, baseAsset, quoteAsset);

        const params = await prepareSwapParams(poolContract, signer, amountIn, quotedAmountOut, baseAsset, quoteAsset);
        const swapRouter = new ethers.Contract(SWAP_ROUTER_CONTRACT_ADDRESS, SWAP_ROUTER_ABI, signer);
        const hash = await executeSwap(swapRouter, params, signer);

        return hash;

    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

export { SwapToken }; 
