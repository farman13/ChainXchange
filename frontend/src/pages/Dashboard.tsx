import { useAuth0 } from "@auth0/auth0-react"
import { Navbar } from "../components/Navbar"
import { Assets } from "../components/Assets";
import { useGetUserWallet } from "../hooks/useGetUserWallet";
import { TabButton } from "../components/Button";
import { useState } from "react";

type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw"

export const Dashboard = () => {

    const [selectedTab, setSelectedTab] = useState<Tab>();

    const { user, isLoading } = useAuth0();
    const publicKey = useGetUserWallet();

    const tabs: { id: Tab, name: string }[] = [
        { id: "tokens", name: "Tokens" },
        { id: "send", name: "Send" },
        { id: "add_funds", name: "Add funds" },
        { id: "withdraw", name: "Withdraw" },
        { id: "swap", name: "Swap" },

    ]

    return (
        <>
            <Navbar />
            {isLoading ?
                <div>Loading....</div>
                :
                <div className="pt-8 flex justify-center">
                    <div className="max-w-4xl bg-white rounded shadow w-full p-12">
                        <Greeting image={user?.picture} name={user?.name} />
                        <div>
                            {
                                tabs.map(tab => <TabButton active={tab.id === selectedTab} onClick={() => {
                                    setSelectedTab(tab.id)
                                }}>{tab.name}</TabButton>)
                            }
                        </div>
                        {<div className={`${selectedTab == "tokens" ? "visible" : "hidden"}`}>
                            <Assets publicKey={publicKey || ""} />
                        </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}

function Greeting({ image, name }: {
    image: string | undefined, name: string | undefined
}) {

    console.log(name, image);
    return <div className="flex mb-10">
        <img src={image} className="w-13 h-13 rounded-full mr-4" alt="icon" />
        <div className="text-xl font-semibold flex flex-col justify-center">
            Welcome back, {name}
        </div>
    </div>
}
