import { connection, SUPPORTED_TOKENS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from 'axios';
import { quoteAndLogSwap, quoterContract } from "../utils/SwapToken.js";
import { Contract, ethers, parseUnits, Wallet } from "ethers";
import { EthWallet, User } from "../models/user.model.js";
import { TOKEN_IN_ABI } from "../ABI/token.js";

const getQuote = async (req, res) => {

    const srctokenName = req.query.srctoken;
    const desttokenName = req.query.desttoken;
    const amount = req.query.amount;
    const user = {
        publicKey: req.query.publicKey
    };

    const srctoken = SUPPORTED_TOKENS.find(t => t.name == srctokenName);
    const desttoken = SUPPORTED_TOKENS.find(t => t.name == desttokenName);

    console.log(srctoken);
    console.log(desttoken);

    if (!srctoken || !desttoken) {
        throw new ApiError(400, "Unsupported token selected.");
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        res.json({
            message: "Invalid amount"
        })
        throw new ApiError(400, "Invalid amount provided.");
    }

    const amountIn = ethers.parseUnits(amount.toString(), 18);
    const quoteAmount = await quoteAndLogSwap(quoterContract, 3000, user, amountIn, srctoken, desttoken)
    console.log("quote amount by uniswap ", quoteAmount)
    const quoteAmountFormatted = Number(quoteAmount).toFixed(4)

    return res.status(200).json(
        new ApiResponse(200, Number(quoteAmountFormatted), "quote fetched successfully")
    )

    // const response = await axios.get('https://apiv5.paraswap.io/prices', {
    //     params: {
    //         srcToken: srctoken.ETHAddress,
    //         destToken: desttoken.ETHAddress,
    //         amount: amount * (10 ** 6),  //srctoken.decimals
    //         srcDecimals: 6, //srctoken.decimals
    //         destDecimals: 6, //desttoken.decimals
    //         side: 'SELL',
    //         network: 1
    //     }
    // });
    // console.log(response.data.priceRoute.destAmount);

    // const destAmount = (response.data.priceRoute.destAmount / (10 ** 6)).toFixed(4) //desttoken.decimals
}

const requestToken = async (req, res) => {

    const { sub } = req.body;

    const user = await User.findOne({
        sub
    })
    if (!user) {
        throw new ApiError(404, "something went wrong while fetching wallet")
    }
    console.log(user);

    const ethwalletId = user.EthWalletId

    const userWallet = await EthWallet.findOne({
        _id: ethwalletId
    })

    const recipient = userWallet.publicKey

    const wallet = new Wallet(process.env.PRIVATE_KEY, connection);

    const tokenContract = new Contract("0x65D96C8e428595a174ad6926fFfB4E2365820918", TOKEN_IN_ABI, wallet)

    const tx = await tokenContract.transfer(recipient, parseUnits('20', 18));
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transfer confirmed");

    if (!tx) {
        res.status(500).json(
            new ApiResponse(500, tx, "Failed to send 20 USDT tokens")
        )
        throw new ApiError(500, "Failed to send 20 USDT tokens, Txn failed !")
    }

    res.status(200).json(
        new ApiResponse(200, tx, "20 USDT Tokens sent successfully")
    )

}

export { getQuote, requestToken }
