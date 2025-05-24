import { Contract, formatEther } from "ethers"
import { connection } from "../constants.js"
import { TOKEN_IN_ABI } from "../ABI/token.js"


export const getAccountBalance = async (token, address) => {

    let balance;

    if (!token.native) {
        const contract = new Contract(token.address, TOKEN_IN_ABI, connection);
        balance = await contract.balanceOf(address);
        balance = formatEther(balance, 18);
    }
    else {
        balance = await connection.getBalance(address);
        balance = formatEther(balance);
    }
    return balance;
}