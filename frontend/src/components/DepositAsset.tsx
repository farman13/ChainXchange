import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AssestSelector } from "./AssestSelector";
import { TokenBalances, TokenBalancesWithUSD } from "../hooks/useTokenBalance";
import { BackButton, PrimaryButton } from "./Button";
import { usePublicClient, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import tokenAbi from "../Abi/tokenAbi.json";

const DepositAsset = ({ publicKey, setDepositAmountModal, refetchUser, refetchConnectedWallet, tokenBalances }: {
    publicKey: string,
    setDepositAmountModal: Dispatch<SetStateAction<boolean>>,
    refetchUser: () => void,
    refetchConnectedWallet: () => void,
    tokenBalances: TokenBalancesWithUSD | undefined

}) => {

    const [selectedToken, setSelectedToken] = useState<TokenBalances>()
    const [selectedAmount, setSelectedAmount] = useState<string>()
    const [amountToAdd, setAmountToAdd] = useState<string>()
    const [depositing, setDepositing] = useState(false)

    const presets = ["1", "2", "5"]

    useEffect(() => {
        setSelectedToken(tokenBalances?.tokens[0]);
    }, [tokenBalances])

    console.log("tokenbalances", tokenBalances);

    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient()

    const depositFund = async () => {

        setDepositing(true);
        let txHash;

        if (!walletClient || !publicClient) {
            console.error('Wallet not connected');
            return;
        }

        if (!amountToAdd) {
            alert("Amount must be greater than zero.");
            setDepositing(false);
            return;
        }

        try {

            const [account] = await walletClient.getAddresses();
            console.log("amountToAdd : ", amountToAdd);
            console.log(publicKey);

            if (selectedToken?.native) {
                txHash = await walletClient.sendTransaction({
                    account,
                    to: publicKey as `0x${string}`,
                    value: parseEther(amountToAdd || '0'),
                });
            } else {
                console.log("Addr :", selectedToken?.address)
                console.log("amount:", amountToAdd)
                txHash = await walletClient.writeContract({
                    account,
                    address: selectedToken?.address as `0x${string}`,
                    abi: tokenAbi.abi as any, // or as Abi if you have the type from viem
                    functionName: 'transfer',
                    args: [publicKey, parseEther(amountToAdd || '0')],
                });
            }
            console.log('Transaction hash:', txHash);
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

            console.log("Transaction confirmed", receipt);
            alert(`Transaction hash:${txHash}`)

            refetchConnectedWallet();
            refetchUser();
        } catch (error: any) {
            console.error("Deposit failed:", error);
            alert(error?.message || "Deposit failed. Please try again.");
        } finally {
            setDepositing(false);
        }

    }

    return <div>
        <div className="text-md text-slate-600">
            Specify asset and amount:
        </div>
        <div>
            <AssestSelector
                selectedToken={selectedToken}
                allTokens={tokenBalances?.tokens}
                onSelect={(asset: TokenBalances) => {
                    setSelectedToken(asset)
                    console.log("ssesststst", asset);
                }}
            />
        </div>
        <div className="text-sm text-slate-500 text-center mt-2">
            Your available {selectedToken?.name} : {selectedToken?.balance.toFixed(3)}  (approx : ${selectedToken?.usdBalance.toFixed(3)})
        </div>
        <div className="border border-slate-300 rounded-xl p-4 shadow-sm bg-white mt-2">
            <div className="text-center">
                <input
                    type="text"
                    value={selectedAmount}
                    onChange={(e) => {
                        if (e.target.value) {
                            console.log("hiii")
                            setSelectedAmount(e.target.value)
                            setAmountToAdd(String(Number(e.target.value) / (selectedToken?.usdPrice ?? 0)))
                            console.log(amountToAdd);
                        }
                        else {
                            setSelectedAmount("")
                            setAmountToAdd('0');
                        }
                    }}
                    className="text-2xl font-semibold text-center w-full outline-none"
                    placeholder="$0 USD"
                />
                <div className="text-sm text-gray-500 mt-1">
                    ~{selectedAmount ? (Number(selectedAmount) / (selectedToken?.usdPrice ?? 0)).toFixed(5) : 0} {selectedToken?.name}
                </div>
            </div>

            <div className="flex mt-4">
                {presets.map((amount) => (
                    <button
                        key={amount}
                        onClick={() => {
                            setSelectedAmount(amount)
                            setAmountToAdd(String(Number(amount) / (selectedToken?.usdPrice ?? 0)))
                            console.log(amountToAdd);
                        }}
                        className={`flex-1 pt-2 pb-2 text-sm font-medium border border-slate-300 cursor-pointer ${selectedAmount === amount
                            ? "bg-gray-300"
                            : "hover:bg-gray-50"
                            }`}
                    >
                        ${amount}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex justify-between">
            <div>
                <BackButton onClick={() => setDepositAmountModal(false)} >back</BackButton>
            </div>
            <div className="mt-4">
                <PrimaryButton onClick={depositFund} disabled={depositing} >{depositing ? "Depositing..." : "Deposit"}</PrimaryButton>
            </div>
        </div>
    </div>
}

export { DepositAsset };