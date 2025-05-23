import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { PrimaryButton } from "./Button"
import { TokenBalances, TokenBalancesWithUSD } from "../hooks/useTokenBalance"
import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"
import { AssestSelector } from "./AssestSelector"

const SendAsset = ({ publicKey, setIsEmailModalOpen, refetchUser, tokenBalances }: {
    publicKey: string,
    setIsEmailModalOpen: Dispatch<SetStateAction<boolean>>,
    refetchUser: () => void,
    tokenBalances: TokenBalancesWithUSD | undefined,

}) => {
    const [selectedToken, setSelectedToken] = useState<TokenBalances>()
    const [selectedAmount, setSelectedAmount] = useState<string>()
    const [amountToSend, setAmountToWithdraw] = useState<string>()
    const [sending, setSending] = useState(false)
    const [emailAddress, setEmailAddress] = useState<string>()

    const presets = ["1", "2", "5"]

    useEffect(() => {
        setSelectedToken(tokenBalances?.tokens[0]);
    }, [tokenBalances])

    console.log("tokenbalances", tokenBalances);

    const { getAccessTokenSilently } = useAuth0();

    const sendFund = async () => {
        setSending(true);

        try {

            if (!amountToSend) {
                alert("Amount must be greater than zero.");
                setSending(false);
                return;
            }

            if (!emailAddress) {
                alert("Please enter an email address.");
                setSending(false);
                return;
            }

            const token = await getAccessTokenSilently();

            const response = await axios.post("http://localhost:3000/api/v1/user/send", {
                publicKey,
                recipient: emailAddress,
                amountToSend,
                selectedToken,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            alert(`Transaction hash: ${response.data.data.hash}`);
            refetchUser();
        } catch (error: any) {
            const message = error?.response?.data?.message || "Something went wrong.";
            alert(message);
        } finally {
            setSending(false);
        }
    };



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

                            console.log(amountToSend);
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
                            console.log(amountToSend);
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
        <div>
            <input type="text" placeholder={"Enter Email Address"} className="text-xl text-center w-full border mt-2 border-slate-300 rounded p-1" onChange={(e) => {
                setEmailAddress(e.target.value)
                console.log(emailAddress)
            }} />
        </div>
        <div className="flex justify-between">
            <div>
                <button
                    className="bg-white border border-gray-400 text-md px-6 py-2 mt-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsEmailModalOpen(false)}
                >
                    back
                </button>
            </div>
            <div className="mt-4">
                <PrimaryButton onClick={sendFund} disabled={sending} >{sending ? "sending..." : "send"}</PrimaryButton>
            </div>
        </div>
    </div>
}

export { SendAsset };