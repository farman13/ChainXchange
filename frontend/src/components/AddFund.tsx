import { useState } from "react";
import { TokenBalancesWithUSD } from "../hooks/useTokenBalance"
import { AddFundOptions } from "./AddFundOptions";
import { ConnectWalletAccount } from "./ConnectWalletAccount";
import { DepositAsset } from "./DepositAsset";

const AddFund = ({ tokenBalances, publicKey }: {
    tokenBalances: TokenBalancesWithUSD | undefined,
    publicKey: string
}) => {

    const [externalAccount, setExternalAccount] = useState<boolean>(false)
    const [depositAmountModal, setDepositAmountModal] = useState<boolean>(false)


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
                    <ConnectWalletAccount setExternalAccount={setExternalAccount} setDepositAmountModal={setDepositAmountModal} />
                </div>
                :
                <div>
                    <div className="text-2xl text-slate-600 font-bold p-3 pt-4">
                        Deposit from External Account/Wallet
                    </div>
                    <DepositAsset setDepositAmountModal={setDepositAmountModal} />
                </div>
        }
    </div>
}

export { AddFund }