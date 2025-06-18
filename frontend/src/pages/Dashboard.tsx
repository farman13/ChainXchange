import { useAuth0 } from "@auth0/auth0-react"
import { Navbar } from "../components/Navbar"
import { Assets } from "../components/Assest/Assets";
import { useGetUserWallet } from "../hooks/useGetUserWallet";
import { TabButton, TertiaryButton } from "../components/Button";
import { useEffect, useState } from "react";
import { SwapToken } from "../components/SwapToken/SwapToken";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { AddFund } from "../components/AddFund/AddFund";
import { WithdrawFund } from "../components/WithdrawFund/WithdrawFund";
import { SendFund } from "../components/SendAsset/SendFund";
import { Greeting } from "../components/Greeting";

type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw"

export const Dashboard = () => {

    const [selectedTab, setSelectedTab] = useState<Tab>();

    const { user, isLoading, getAccessTokenSilently } = useAuth0();
    const { publicKey, refetchWallet } = useGetUserWallet();
    const { tokenBalances, loading, refetch } = useTokenBalance(publicKey || "");

    const tabs: { id: Tab, name: string }[] = [
        { id: "tokens", name: "Tokens" },
        { id: "send", name: "Send" },
        { id: "add_funds", name: "Add Funds" },
        { id: "withdraw", name: "Withdraw" },
        { id: "swap", name: "Swap" },
    ]

    const [copied, setCopied] = useState(false);
    console.log("AASSSPub", publicKey)

    useEffect(() => {
        if (copied) {
            let timeout = setTimeout(() => {
                setCopied(false)
            }, 2000)
            return () => {
                clearTimeout(timeout);
            }
        }
    }, [copied])

    useEffect(() => {
        refetchWallet();         //  swaped the fucntion calls 
        refetch();
    }, [publicKey, isLoading])

    return (
        <div className="bg-slate-100 min-h-screen">
            <Navbar />
            {isLoading ?
                <div>Loading....</div>
                :
                <div className="pt-8 flex justify-center">
                    <div className="max-w-xl bg-white rounded-2xl shadow-lg w-full p-10 border border-gray-200">
                        <Greeting image={user?.picture} name={user?.name} />
                        <div className="text-slate-500 mt-4 bg-slate-100 p-4">
                            Account assets
                            <br />

                            <div className="flex justify-between m-2">
                                <div className="flex">
                                    {loading ? "Loading......" :
                                        <div className="text-4xl font-bold text-black">
                                            ${tokenBalances?.totalUSDBalance.toFixed(3)}
                                        </div>
                                    }
                                    <div className="text-slate-500 text-2xl flex flex-col font-semibold justify-end pl-1 pb-2">
                                        USD
                                    </div>
                                </div>
                                <div>
                                    <TertiaryButton onClick={() => {
                                        setCopied(true);
                                        navigator.clipboard.writeText(publicKey ?? "")
                                    }}>
                                        {copied ? "Copied" : "Your wallet address"}
                                    </TertiaryButton>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            {
                                tabs.map(tab => <span className="ml-1" key={tab.id}>
                                    <TabButton active={tab.id === selectedTab} onClick={() => {
                                        setSelectedTab(tab.id)
                                    }}>{tab.name}</TabButton>
                                </span>)
                            }
                        </div>
                        <div className={`${selectedTab == "tokens" ? "visible" : "hidden"}`}>
                            <Assets tokenBalances={tokenBalances} />
                        </div>
                        <div className={`${selectedTab == "send" ? "visible" : "hidden"}`}>
                            <SendFund publicKey={publicKey || ""} tokenBalances={tokenBalances} refetch={refetch} />
                        </div>
                        <div className={`${selectedTab == "add_funds" ? "visible" : "hidden"}`}>
                            <AddFund publicKey={publicKey || ""} refetchUser={refetch} />
                        </div>
                        <div className={`${selectedTab == "withdraw" ? "visible" : "hidden"}`}>
                            <WithdrawFund publicKey={publicKey || ""} tokenBalances={tokenBalances} refetch={refetch} />
                        </div>
                        <div className={`${selectedTab == "swap" ? "visible" : "hidden"}`}>
                            <SwapToken publicKey={publicKey || ""} tokenBalances={tokenBalances} loading={loading} refetch={refetch} getAccessTokenSilently={getAccessTokenSilently} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

