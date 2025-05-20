// SendEth.ts
import { getWalletClient } from 'wagmi/actions';
import { parseEther } from 'viem';

export async function SendEth() {
    const walletClient = await getWalletClient();

    if (!walletClient) {
        console.error('Wallet not connected');
        return;
    }

    const [account] = await walletClient.getAddresses();

    const txHash = await walletClient.sendTransaction({
        account,
        to: '0xRecipientAddressHere', // Replace with actual address
        value: parseEther('0.01'),
    });

    console.log('Transaction hash:', txHash);
}
