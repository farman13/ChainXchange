import { User } from "../models/user.model.js";
import { EthWallet } from "../models/EthWallet.model.js";
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
import { parseEther, Wallet, parseUnits, Contract, isAddress } from "ethers"

const signupUser = async (req, res) => {
    console.log("Start")
    const { username, email, picture, sub } = req.body

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        return res.status(409).json(new ApiResponse(409, null, "User already exists"));
    }

    const user = await User.create({
        username, email, picture, provider: "Google", sub
    })

    const ethWallet = generateEthWallet();
    // console.log("ethwallet : ", ethWallet);
    const encryptedKey = encrypt(ethWallet.privateKey);
    //  console.log("Encrypted key :", encryptedKey);

    const ethwallet = await EthWallet.create({
        publicKey: ethWallet.publicKey,
        privateKey: encryptedKey.encryptedData,
        userId: user._id,
        iv: encryptedKey.iv
    })


    await User.findByIdAndUpdate(user._id, {
        EthWalletId: ethwallet._id,
    })


    if (!user) {
        throw new ApiError(500, "somethong went wrong while registering user");
    }

    SendEth(ethWallet.publicKey)

    res.status(201).json(
        new ApiResponse(201, user.username, "User Signedup successfully")
    )
}

const getUserWallet = async (req, res) => {
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

    console.log(userWallet);

    res.status(200).json(
        new ApiResponse(200, userWallet.publicKey, "sent user wallet successfully")
    )
}

const getUserBalance = async (req, res) => {
    const address = req.query.address;

    if (!address || !isAddress(address)) {
        return res.json(
            new ApiResponse(400, null, "Invalid public key")
        )
    }

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

    res.json(
        new ApiResponse(200, { tokens, totalUSDBalance }, "Success")
    );

}

const swapTokens = async (req, res) => {

    const { baseAsset, quoteAsset, baseAmount, publicKey } = req.body;

    const wallet = await EthWallet.findOne({ publicKey })
    console.log(wallet);

    const privateKey = decrypt(wallet.privateKey, wallet.iv);
    console.log(baseAsset, baseAmount);
    const hash = await SwapToken(baseAsset, quoteAsset, baseAmount, privateKey);

    if (!hash) {
        res.status(500).json(
            new ApiResponse(500, null, "Failed to swap tokens")
        )
    }

    res.status(200).json(
        new ApiResponse(200, hash, "Swap tokens successfully")
    )
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

    if (!tx) {
        res.status(400).json(
            new ApiResponse(400, null, "withdraw failed")
        )
    }

    res.status(200).json(
        new ApiResponse(200, tx, "withdraw successfully")
    )
}

const sendAsset = async (req, res) => {
    const { publicKey, recipient, amountToSend, selectedToken } = req.body;

    const userWallet = await EthWallet.findOne({ publicKey })

    const privateKey = decrypt(userWallet.privateKey, userWallet.iv);
    const wallet = new Wallet(privateKey, connection);
    console.log(wallet);

    const recipientAccount = await User.findOne({ email: recipient });

    if (!recipientAccount) {
        return res.status(404).json(
            new ApiResponse(404, null, "Recipient address not exist")
        )
    }

    const recipientWallet = await EthWallet.findById(recipientAccount.EthWalletId)
    console.log("recipient : ", recipientWallet);

    const recipientPublicKey = recipientWallet.publicKey
    console.log("recipientPublicKey : ", recipientPublicKey);

    let tx;
    if (selectedToken.native) {
        tx = await wallet.sendTransaction({
            to: recipientPublicKey,
            value: parseEther(amountToSend), // amount in ETH
        });

        console.log("Transaction hash:", tx.hash);
        await tx.wait(); // Wait for confirmation
        console.log("Transaction confirmed");
    } else {
        const amount = parseUnits(amountToSend, 18);
        const tokenContract = new Contract(selectedToken.address, TOKEN_IN_ABI, wallet);
        tx = await tokenContract.transfer(recipientPublicKey, amount);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("Transfer confirmed");
    }

    if (!tx) {
        res.status(400).json(
            new ApiResponse(400, null, "Send failed")
        )
    }

    res.status(200).json(
        new ApiResponse(200, tx, "sent successfully")
    )

}

export { signupUser, getUserWallet, getUserBalance, swapTokens, withdrawAsset, sendAsset };