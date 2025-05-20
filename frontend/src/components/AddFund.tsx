import { useState } from "react";
import { TokenBalancesWithUSD } from "../hooks/useTokenBalance"
import { AddFundOptions } from "./AddFundOptions";
import { ConnectWalletAccount } from "./ConnectWalletAccount";

const AddFund = ({ tokenBalances, publicKey }: {
    tokenBalances: TokenBalancesWithUSD | undefined,
    publicKey: string
}) => {

    const [externalAccountOption, setExternalAccountOption] = useState<boolean>(false)

    return <div className="p-2 mt-4">
        <div className="text-3xl text-slate-600 font-bold p-3 pt-4">
            Add Funds
        </div>
        {!externalAccountOption ?
            <AddFundOptions publicKey={publicKey} setExternalAccountOption={setExternalAccountOption} />
            :
            <ConnectWalletAccount setExternalAccountOption={setExternalAccountOption} />
        }
    </div>
}

export { AddFund }