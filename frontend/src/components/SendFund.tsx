import { useState } from "react";
import { TokenBalancesWithUSD } from "../hooks/useTokenBalance";
import { WithdrawAsset } from "./WithdrawAsset";
import { ArrowIcon } from "./ArrowIcon";
import { SendAsset } from "./SendAsset";

const SendFund = ({ publicKey, tokenBalances, refetch }: {
    publicKey: string,
    tokenBalances: TokenBalancesWithUSD | undefined
    refetch: () => void,
}) => {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
    const [isExternalModalOpen, setIsExternalModalOpen] = useState<boolean>(false);


    return <div className="m-4">
        <div className="text-3xl text-slate-600 font-bold mb-7 pt-4">
            Send
        </div>
        {(!isEmailModalOpen && !isExternalModalOpen) ?
            <div>
                <div className="flex justify-between text-slate-600 mt-4 p-3 border border-gray-400 bg-white cursor-pointer hover:bg-slate-100" onClick={() => setIsEmailModalOpen(true)}>
                    <div className="text-xl">
                        To Email
                        <div className="text-sm text-slate-400">
                            Asset will be sent to existing account of DCEX
                        </div>
                    </div>
                    <div className="p-2">
                        <ArrowIcon />
                    </div>
                </div>
                <div className="flex justify-between text-slate-600 p-3 pb-4 border border-t-0 border-gray-400 bg-white cursor-pointer hover:bg-slate-100" onClick={() => setIsExternalModalOpen(true)}>
                    <div className="text-xl">
                        To Ethereum Wallet Address
                        <div className="text-sm text-slate-400">
                            Assets will be sent to a Ethereum address that you specify
                        </div>
                    </div>
                    <div className="p-2">
                        <ArrowIcon />
                    </div>
                </div>
            </div>
            :
            isEmailModalOpen ?
                <SendAsset publicKey={publicKey} setIsEmailModalOpen={setIsEmailModalOpen} refetchUser={refetch} tokenBalances={tokenBalances} />
                :
                <WithdrawAsset publicKey={publicKey} setDepositAmountModal={setIsExternalModalOpen} refetchUser={refetch} tokenBalances={tokenBalances} toAddress={true} text={"Send"} />
        }
    </div>
}

export { SendFund };