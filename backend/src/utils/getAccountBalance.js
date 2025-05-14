import { Contract, formatEther } from "ethers"
import { connection } from "./Constants.js"
import { abi } from "../ABI/tokenABI.js"


export const getAccountBalance = async (token, address) => {

    const contract = new Contract(token.address, abi, connection);
    let balance = await contract.balanceOf(address);
    balance = formatEther(balance, 18);
    return balance;
}