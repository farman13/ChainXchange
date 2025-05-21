import { Dispatch, SetStateAction, useState } from "react";
import { ArrowIcon } from "./ArrowIcon"
import WalletModal from "./WalletModal";

const WithdrawFundOptions = ({ publicKey, setExternalAccount }: {
    publicKey: string,
    setExternalAccount: Dispatch<SetStateAction<boolean>>
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return <div className="m-4">
        <div className="flex justify-between text-slate-600 mt-4 p-3 border border-gray-400 bg-white cursor-pointer hover:bg-slate-100" onClick={() => setExternalAccount(true)}>
            <div className="text-xl">
                To External Account/Wallet
                <div className="text-sm text-slate-400">
                    Asset will be sent to connected wallet
                </div>
            </div>
            <div className="p-2">
                <ArrowIcon />
            </div>
        </div>
        <div className="flex justify-between text-slate-600 p-3 pb-4 border border-t-0 border-gray-400 bg-white cursor-pointer hover:bg-slate-100" onClick={() => setIsModalOpen(true)}>
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
        {isModalOpen && (
            <WalletModal address={publicKey}
                onClose={() => setIsModalOpen(false)} />
        )}
    </div>
}

export { WithdrawFundOptions }