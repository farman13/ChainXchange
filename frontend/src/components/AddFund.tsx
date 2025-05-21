import { useState } from "react";
import { AddFundOptions } from "./AddFundOptions";
import { ConnectWalletAccount } from "./ConnectWalletAccount";
import { DepositAsset } from "./DepositAsset";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { useAccount } from "wagmi";

const AddFund = ({ publicKey, refetchUser }: {
    publicKey: string,
    refetchUser: () => void,
}) => {

    const [externalAccount, setExternalAccount] = useState<boolean>(false)
    const [depositAmountModal, setDepositAmountModal] = useState<boolean>(false)

    const { address } = useAccount();

    const { tokenBalances, refetch } = useTokenBalance(address || '0')


    return <div className="p-2 mt-4">
        {!externalAccount ?
            <div>
                <div className="text-3xl text-slate-600 font-bold p-3 pt-4">
                    Add Funds
                </div>
                <AddFundOptions publicKey={publicKey} setExternalAccount={setExternalAccount} />
            </div>
            :
            !depositAmountModal ?
                <div>
                    <div className="text-2xl text-slate-600 font-bold p-3 pt-4">
                        Deposit from External Account/Wallet
                    </div>
                    <ConnectWalletAccount setExternalAccount={setExternalAccount} setDepositAmountModal={setDepositAmountModal} >Deposit assets from your wallet</ConnectWalletAccount>
                </div>
                :
                <div>
                    <div className="text-2xl text-slate-600 font-bold p-3 pt-4">
                        Deposit via connected wallet
                    </div>
                    <DepositAsset publicKey={publicKey} setDepositAmountModal={setDepositAmountModal} refetchUser={refetchUser} refetchConnectedWallet={refetch} tokenBalances={tokenBalances} />
                </div>
        }
    </div>
}

export { AddFund }