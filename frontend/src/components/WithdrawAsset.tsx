import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TokenBalances, TokenBalancesWithUSD } from "../hooks/useTokenBalance"
import { useAccount } from "wagmi"
import { AssestSelector } from "./AssestSelector";
import { PrimaryButton } from "./Button";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const WithdrawAsset = ({ publicKey, setDepositAmountModal, refetchUser, tokenBalances, toAddress }: {
    publicKey: string,
    setDepositAmountModal: Dispatch<SetStateAction<boolean>>,
    refetchUser: () => void,
    tokenBalances: TokenBalancesWithUSD | undefined,
    toAddress: boolean

}) => {
    const [selectedToken, setSelectedToken] = useState<TokenBalances>()
    const [selectedAmount, setSelectedAmount] = useState<string>()
    const [amountToWithdraw, setAmountToWithdraw] = useState<string>()
    const [withdrawing, setWithdrawing] = useState(false)
    const [Address, setAddress] = useState<string>()

    const presets = ["1", "2", "5"]

    useEffect(() => {
        setSelectedToken(tokenBalances?.tokens[0]);
    }, [tokenBalances])

    console.log("tokenbalances", tokenBalances);

    const { address } = useAccount();
    const { getAccessTokenSilently } = useAuth0();

    const withdrawFund = async () => {

        setWithdrawing(true);

        console.log("amountToWithdraw : ", amountToWithdraw);
        console.log(publicKey);

        let recipient;

        if (Address)
            recipient = Address;
        else {
            recipient = address
        }

        const token = await getAccessTokenSilently();
        console.log("inside withdawr")
        console.log(selectedToken)
        const response = await axios.post("http://localhost:3000/api/v1/user/withdraw", {
            publicKey, recipient, amountToWithdraw, selectedToken,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        console.log(response.data)
        alert(`Transaction hash:${response.data}`)
        refetchUser();
        setWithdrawing(false);

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
                            setAmountToWithdraw(String(Number(e.target.value) / (selectedToken?.usdPrice ?? 0)))
                            console.log(amountToWithdraw);
                        }
                        else {
                            setSelectedAmount("")
                            setAmountToWithdraw('0');
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
                            setAmountToWithdraw(String(Number(amount) / (selectedToken?.usdPrice ?? 0)))
                            console.log(amountToWithdraw);
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
        {toAddress &&
            <div>
                <input type="text" placeholder="Enter Ethereum wallet address " className="text-xl text-center w-full border mt-2 border-slate-300 rounded p-1" onChange={(e) => {
                    setAddress(e.target.value)
                    console.log(Address)
                }} />
            </div>
        }
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
                <PrimaryButton onClick={withdrawFund} >{withdrawing ? "withdrawing..." : "withdraw"}</PrimaryButton>
            </div>
        </div>
    </div>
}

export { WithdrawAsset }