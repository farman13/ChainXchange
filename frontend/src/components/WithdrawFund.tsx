import { useState } from "react"
import { ConnectWalletAccount } from "./ConnectWalletAccount"
import { WithdrawFundOptions } from "./WithdrawFundOptions"
import { TokenBalancesWithUSD } from "../hooks/useTokenBalance"
import { WithdrawAsset } from "./WithdrawAsset"

const WithdrawFund = ({ publicKey, tokenBalances, refetch }: {
    publicKey: string,
    tokenBalances: TokenBalancesWithUSD | undefined
    refetch: () => void,
}) => {

    const [externalAccount, setExternalAccount] = useState<boolean>(false)
    const [depositAmountModal, setDepositAmountModal] = useState<boolean>(false)


    return <div className="p-2 mt-4">
        {!externalAccount ?
            <div>
                <div className="text-3xl text-slate-600 font-bold p-3 pt-4">
                    Withdraw Funds
                </div>
                <WithdrawFundOptions publicKey={publicKey} setExternalAccount={setExternalAccount} tokenBalances={tokenBalances} refetch={refetch} />
            </div>
            :
            !depositAmountModal ?
                <div>
                    <div className="text-2xl text-slate-600 font-bold p-3 pt-4">
                        Withdraw to External Account/Wallet
                    </div>
                    <ConnectWalletAccount setExternalAccount={setExternalAccount} setDepositAmountModal={setDepositAmountModal} >withdraw assets to your wallet</ConnectWalletAccount>
                </div>
                :
                <div>
                    <div className="text-2xl text-slate-600 font-bold p-3 pt-4">
                        Withdraw to connected wallet
                    </div>
                    <WithdrawAsset publicKey={publicKey} setDepositAmountModal={setDepositAmountModal} refetchUser={refetch} tokenBalances={tokenBalances} toAddress={false} />
                </div>
        }
    </div>
}

export { WithdrawFund }