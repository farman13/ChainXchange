import { ethers } from "ethers";
import { connection } from "../constants.js";


export const SendEth = async (userPublicKey) => {

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, connection);

    const tx = await signer.sendTransaction({
        to: userPublicKey,
        value: ethers.parseEther("0.0001"), // Sends 0.01 ETH
    });

    console.log(`User account Funded  with 0.0001ETh ,Tx Hash: ${tx.hash}`);

}

