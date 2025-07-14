import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TokenBalances, TokenBalancesWithUSD } from "../hooks/useTokenBalance"
import { useAccount } from "wagmi"
import { AssestSelector } from "./AssestSelector";
import { BackButton, PrimaryButton } from "./Button";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'react-hot-toast';

const WithdrawAsset = ({ publicKey, setDepositAmountModal, refetchUser, tokenBalances, toAddress, text }: {
    publicKey: string,
    setDepositAmountModal: Dispatch<SetStateAction<boolean>>,
    refetchUser: () => void,
    tokenBalances: TokenBalancesWithUSD | undefined,
    toAddress: boolean,
    text?: string

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

    // console.log("tokenbalances", tokenBalances);

    const { address } = useAccount();
    const { getAccessTokenSilently } = useAuth0();

    const withdrawFund = async () => {

        setWithdrawing(true);

        // console.log(publicKey);
        let recipient;

        if (!amountToWithdraw) {
            toast.error("Amount must be greater than zero.");
            setWithdrawing(false);
            return;
        }
        // console.log("amountToWithdraw : ", amountToWithdraw);
        // console.log("seletoken", selectedToken?.balance);

        if (!selectedToken || parseFloat(amountToWithdraw) > selectedToken.balance) {
            toast.error("Insufficient Assets");
            setWithdrawing(false);
            return;
        }

        if (toAddress && Address == null) {
            toast.error("Please enter ethereum address.");
            setWithdrawing(false);
            return;
        }

        try {

            if (Address)
                recipient = Address;
            else {
                recipient = address
            }

            const token = await getAccessTokenSilently();
            // console.log("inside withdraw")
            // console.log(selectedToken)
            const response = await axios.post("https://chain-xchange.vercel.app/api/v1/user/withdraw", {
                publicKey, recipient, amountToWithdraw, selectedToken,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            // console.log(response.data)
            toast.success(`Withdraw successfully\n Transaction hash: ${response.data.data.hash}`);
            refetchUser();
        } catch (error: any) {
            const message = error?.response?.data?.message || "Something went wrong.";
            toast.error(message);
        }
        finally {
            setWithdrawing(false);
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
                            let formatedAmount = (Number(e.target.value) / (selectedToken?.usdPrice ?? 0)).toFixed(18)
                            setAmountToWithdraw(String(formatedAmount))

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
                            let formatedAmount = (Number(amount) / (selectedToken?.usdPrice ?? 0)).toFixed(18)
                            setAmountToWithdraw(String(formatedAmount))
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
                <input type="text" placeholder={"Enter Ethereum wallet Address"} className="text-xl text-center w-full border mt-2 border-slate-300 rounded p-1" onChange={(e) => {
                    setAddress(e.target.value)
                    console.log(Address)
                }} />
            </div>
        }
        <div className="flex justify-between">
            <div>
                <BackButton onClick={() => setDepositAmountModal(false)} >back</BackButton>
            </div>
            <div className="mt-4">
                <PrimaryButton onClick={withdrawFund} disabled={withdrawing} >{withdrawing ? `${text}ing...` : text}</PrimaryButton>
            </div>
        </div>
    </div>
}

export { WithdrawAsset }