import { SUPPORTED_TOKENS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from 'axios';

export const getQuote = async (req, res) => {

    const srctokenName = req.query.srctoken;
    const desttokenName = req.query.desttoken;
    const amount = req.query.amount;

    const srctoken = SUPPORTED_TOKENS.find(t => t.name == srctokenName);
    const desttoken = SUPPORTED_TOKENS.find(t => t.name == desttokenName);

    console.log(srctoken);
    console.log(desttoken);

    const response = await axios.get('https://apiv5.paraswap.io/prices', {
        params: {
            srcToken: srctoken.ETHAddress,
            destToken: desttoken.ETHAddress,
            amount: amount * (10 ** 6),  //srctoken.decimals
            srcDecimals: 6, //srctoken.decimals
            destDecimals: 6, //desttoken.decimals
            side: 'SELL',
            network: 1
        }
    });

    const destAmount = (response.data.priceRoute.destAmount / (10 ** 6)).toFixed(4) //desttoken.decimals


    return res.status(200).json(
        new ApiResponse(200, destAmount, "quote fetched successfully")
    )

}
