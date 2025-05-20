import { Dispatch, SetStateAction } from "react"
import { ArrowIcon } from "./ArrowIcon"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

const ConnectWalletAccount = ({ setExternalAccount, setDepositAmountModal }: {
    setExternalAccount: Dispatch<SetStateAction<boolean>>
    setDepositAmountModal: Dispatch<SetStateAction<boolean>>

}) => {

    const { address, isConnected } = useAccount();

    return <div>
        <div className="flex justify-between text-slate-600 mt-4 p-3 border border-gray-400 bg-white">
            <div className="text-xl">
                {!isConnected ?
                    <div>
                        <ConnectButton.Custom>
                            {({ openConnectModal }) => (
                                <button
                                    onClick={openConnectModal}
                                    type="button"
                                    className="bg-white text- font-semibold py-2 rounded pr-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Connect Wallet
                                </button>
                            )}
                        </ConnectButton.Custom>
                        <div className="text-sm text-slate-400">
                            Deposit assets from your wallet
                        </div>
                    </div>
                    :
                    <div onClick={() => setDepositAmountModal(true)} className="cursor-pointer">
                        <div>wallet connected : {address?.slice(0, 18)}...{address?.slice(-4)} </div>
                        <div className="text-sm text-slate-400">
                            Deposit assets from your wallet
                        </div>
                    </div>
                }
            </div>
            {isConnected &&
                <div className="pt-3 pr-2 cursor-pointer" onClick={() => setDepositAmountModal(true)}>
                    <ArrowIcon />
                </div>
            }
        </div>
        <div>
            <button
                className="bg-white border border-gray-400 text-md px-6 py-2 mt-4 rounded-lg shadow hover:bg-gray-100"
                onClick={() => setExternalAccount(false)}
            >
                back
            </button>
        </div>
    </div>
}

export { ConnectWalletAccount }