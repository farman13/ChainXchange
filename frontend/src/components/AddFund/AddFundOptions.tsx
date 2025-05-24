import { Dispatch, SetStateAction, useState } from "react";
import { ArrowIcon } from "../ArrowIcon"
import AddressModal from "../AddressModal";

const AddFundOptions = ({ publicKey, setExternalAccount }: {
    publicKey: string,
    setExternalAccount: Dispatch<SetStateAction<boolean>>
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return <div className="m-4">
        <div className="flex justify-between text-slate-600 mt-4 p-3 border border-gray-400 bg-white cursor-pointer hover:bg-slate-100" onClick={() => setExternalAccount(true)}>
            <div className="text-xl">
                From External Account/Wallet
                <div className="text-sm text-slate-400">
                    Deposit assets from your connected wallet
                </div>
            </div>
            <div className="p-2">
                <ArrowIcon />
            </div>
        </div>
        <div className="flex justify-between text-slate-600 p-3 pb-4 border border-t-0 border-gray-400 bg-white cursor-pointer hover:bg-slate-100" onClick={() => setIsModalOpen(true)}>
            <div className="text-xl">
                To This Ethereum Wallet Address
                <div className="text-sm text-slate-400">
                    Deposit assets via this Ethereum wallet address
                </div>
            </div>
            <div className="p-2">
                <ArrowIcon />
            </div>
        </div>
        {isModalOpen && (
            <AddressModal address={publicKey}
                onClose={() => setIsModalOpen(false)} />
        )}
    </div>
}

export { AddFundOptions }