import { connection, SUPPORTED_TOKENS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from 'axios';
import { quoteAndLogSwap, quoterContract } from "../utils/SwapToken.js";
import { ethers } from "ethers";

export const getQuote = async (req, res) => {

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
