import { ethers } from 'ethers';
import { FACTORY_ABI } from '../ABI/factory.js';
import { QUOTER_ABI } from '../ABI/quoter.js';
import { SWAP_ROUTER_ABI } from '../ABI/swaprouter.js';
import { POOL_ABI } from '../ABI/pool.js';
import { TOKEN_IN_ABI } from '../ABI/token.js';


// Deployment Addresses
const POOL_FACTORY_CONTRACT_ADDRESS = process.env.POOL_FACTORY_CONTRACT_ADDRESS;
const QUOTER_CONTRACT_ADDRESS = process.env.QUOTER_CONTRACT_ADDRESS;
const SWAP_ROUTER_CONTRACT_ADDRESS = process.env.SWAP_ROUTER_CONTRACT_ADDRESS;

// Provider, Contract & Signer Instances
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_PROVIDER);
const factoryContract = new ethers.Contract(POOL_FACTORY_CONTRACT_ADDRESS, FACTORY_ABI, provider);
export const quoterContract = new ethers.Contract(QUOTER_CONTRACT_ADDRESS, QUOTER_ABI, provider);
// const signer = new ethers.Wallet(privateKey, provider);



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

export async function quoteAndLogSwap(quoterContract, fee, signer, amountIn, baseAsset, quoteAsset) {
    const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall({
        tokenIn: baseAsset.address,
        tokenOut: quoteAsset.address,
        fee: fee,
        recipient: signer.address,
        deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
        amountIn: amountIn,
        sqrtPriceLimitX96: 0,
    });
    console.log("FSKJDFSJDF", amountIn, baseAsset, quoteAsset);
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

async function SwapToken(baseAsset, quoteAsset, baseAmount, privateKey) {
    const inputAmount = baseAmount;
    const amountIn = ethers.parseUnits(inputAmount.toString(), 18);
    const signer = new ethers.Wallet(privateKey, provider);

    try {
        await approveToken(baseAsset.address, TOKEN_IN_ABI, inputAmount, signer);
        const { poolContract, fee } = await getPoolInfo(factoryContract, baseAsset, quoteAsset);
        console.log(`-------------------------------`);
        console.log(`Fetching Quote for: ${baseAsset.name} to ${quoteAsset.name} and ${fee}`);
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
