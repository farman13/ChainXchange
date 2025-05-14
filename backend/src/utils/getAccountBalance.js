import { Contract } from "ethers"
import { connection } from "./Constants.js"
import { abi } from "../ABI/tokenABI.js"


export const getAccountBalance = async (token, address) => {

    const contract = new Contract(token.address, abi, connection);
    const balance = await contract.balanceOf(address);
    return balance;
}