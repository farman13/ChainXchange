import { EthWallet, InrWallet, User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { connection, SUPPORTED_TOKENS } from "../constants.js";
import { decrypt, encrypt } from "../utils/EncryptDecrypt.js";
import { generateEthWallet } from "../utils/generateWallet.js";
import { getAccountBalance } from "../utils/getAccountBalance.js";
import axios from 'axios';
import { SwapToken } from "../utils/SwapToken.js";
import { SendEth } from "../utils/SendEth.js";
import { TOKEN_IN_ABI } from "../ABI/token.js";
import { parseEther, Wallet, parseUnits, Contract } from "ethers"

const signupUser = async (req, res) => {
    const { username, email, picture, sub } = req.body

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(500, "User already exist")
    }

    const user = await User.create({
        username, email, picture, provider: "Google", sub
    })

    const ethWallet = generateEthWallet();
    console.log("ethwallet : ", ethWallet);
    const encryptedKey = encrypt(ethWallet.privateKey);
    console.log("Encrypted key :", encryptedKey);

    const ethwallet = await EthWallet.create({
        publicKey: ethWallet.publicKey,
        privateKey: encryptedKey.encryptedData,
        userId: user._id,
        iv: encryptedKey.iv
    })

    const inrWallet = await InrWallet.create({
        balance: 0,
        userId: user._id
    })

    await User.findByIdAndUpdate(user._id, {
        EthWalletId: ethwallet._id,
        InrWalletId: inrWallet._id
    })


    if (!user) {
        throw new ApiError(500, "somethong went wrong while registering user");
    }

    SendEth(ethWallet.publicKey)

    return res.status(200).json(
        new ApiResponse(200, user.username, "User Signedup successfully")
    )
}

const getUserWallet = async (req, res) => {
    const { sub } = req.body;

    const user = await User.findOne({
        sub
    })
    if (!user) {
        throw new ApiError(500, "something went wrong while fetching wallet")
    }
    console.log(user);

    const ethwalletId = user.EthWalletId

    const userWallet = await EthWallet.findOne({
        _id: ethwalletId
    })

    console.log(userWallet);

    return res.status(200).json(
        new ApiResponse(200, userWallet.publicKey, "sent user wallet successfully")
    )
}

const getUserBalance = async (req, res) => {
    const address = req.query.address;

    const tokenUSDPrice = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=USDT,USDC,ETH', {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
        }
    })

    const prices = {
        USDC: tokenUSDPrice.data.data.USDC.quote.USD.price,
        USDT: tokenUSDPrice.data.data.USDT.quote.USD.price,
        SepoliaETH: tokenUSDPrice.data.data.ETH.quote.USD.price
    };

    const tokens = await Promise.all(
        SUPPORTED_TOKENS.map(async (token) => {
            const raw = await getAccountBalance(token, address);
            return {
                name: token.name,
                balance: parseFloat(raw),
                usdPrice: prices[token.name],
                usdBalance: parseFloat(raw) * prices[token.name],
                image: token.image,
                address: token.address,
                native: token.native
            }

        })
    )
    let totalUSDBalance = tokens.reduce((acc, token) => {
        return acc + (parseFloat(token.balance) * token.usdPrice);
    }, 0);

    res.json({
        tokens,
        totalUSDBalance
    })
}

const swapTokens = async (req, res) => {

    const { baseAsset, quoteAsset, baseAmount, publicKey } = req.body;

    const wallet = await EthWallet.findOne({ publicKey })
    console.log(wallet);

    const privateKey = decrypt(wallet.privateKey, wallet.iv);

    const hash = await SwapToken(baseAsset, quoteAsset, baseAmount, privateKey);

    res.json({
        hash
    })
}

const withdrawAsset = async (req, res) => {

    const { publicKey, recipient, amountToWithdraw, selectedToken } = req.body;

    const userWallet = await EthWallet.findOne({ publicKey })

    const privateKey = decrypt(userWallet.privateKey, userWallet.iv);
    const wallet = new Wallet(privateKey, connection);
    console.log(wallet);

    let tx;
    if (selectedToken.native) {
        tx = await wallet.sendTransaction({
            to: recipient,
            value: parseEther(amountToWithdraw), // amount in ETH
        });

        console.log("Transaction hash:", tx.hash);
        await tx.wait(); // Wait for confirmation
        console.log("Transaction confirmed");
    } else {
        const amount = parseUnits(amountToWithdraw, 18);
        const tokenContract = new Contract(selectedToken.address, TOKEN_IN_ABI, wallet);
        tx = await tokenContract.transfer(recipient, amount);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("Transfer confirmed");
    }

    res.json({
        tx
    })
}

export { signupUser, getUserWallet, getUserBalance, swapTokens, withdrawAsset };