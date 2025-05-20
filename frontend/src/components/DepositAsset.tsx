import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AssestSelector } from "./AssestSelector";
import { TokenBalances, TokenBalancesWithUSD } from "../hooks/useTokenBalance";
import { PrimaryButton } from "./Button";
import { useWalletClient } from "wagmi";
import { parseEther } from "viem";

const DepositAsset = ({ publicKey, tokenBalances, setDepositAmountModal, refetch }: {
    publicKey: string,
    tokenBalances: TokenBalancesWithUSD | undefined,
    setDepositAmountModal: Dispatch<SetStateAction<boolean>>,
    refetch: () => void,

}) => {

    const [selectedToken, setSelectedToken] = useState<TokenBalances>()
    const [selectedAmount, setSelectedAmount] = useState<string>()
    const [amountToSend, setAmountToSend] = useState<string>()

    const presets = ["1", "2", "5"]

    useEffect(() => {
        setSelectedToken(tokenBalances?.tokens[0]);
    }, [selectedToken, tokenBalances])

    const { data: walletClient } = useWalletClient();

    const depositFund = async () => {

        if (!walletClient) {
            console.error('Wallet not connected');
            return;
        }

        const [account] = await walletClient.getAddresses();
        console.log("amountToSend : ", amountToSend);
        console.log(publicKey);
        const txHash = await walletClient.sendTransaction({
            account,
            to: publicKey as `0x${string}`,
            value: parseEther(amountToSend || '0'),
        });

        console.log('Transaction hash:', txHash);
        alert(`Transaction hash:${txHash}`)
        refetch();

    }

    return <div>
        <div className="text-md text-slate-600">
            Specify asset and amount:
        </div>
        <div>
            <AssestSelector
                selectedToken={selectedToken}
                allTokens={tokenBalances?.tokens}
                onSelect={(token: TokenBalances) => { setSelectedToken(token) }}
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
                            setAmountToSend(String(Number(e.target.value) / (selectedToken?.usdPrice ?? 0)))
                            console.log(e.target.value)
                        }
                        else {
                            setSelectedAmount("")
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
                        onClick={() => setSelectedAmount(amount)}
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
                <button
                    className="bg-white border border-gray-400 text-md px-6 py-2 mt-4 rounded-lg shadow hover:bg-gray-100"
                    onClick={() => setDepositAmountModal(false)}
                >
                    back
                </button>
            </div>
            <div className="mt-4">
                <PrimaryButton onClick={depositFund} >Deposit</PrimaryButton>
            </div>
        </div>
    </div>
}

export { DepositAsset };