import { Wallet } from "ethers";

export function generateEthWallet() {
    const wallet = Wallet.createRandom();
    return {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
    };
}
