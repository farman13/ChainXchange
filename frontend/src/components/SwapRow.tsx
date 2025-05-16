import { ReactNode } from "react"
import { TokenBalances } from "../hooks/useTokenBalance"
import { AssestSelector } from "./AssestSelector"

const SwapRow = ({ onSelect, selectedToken, allTokens, title, subtitle, topBorderEnabled, bottomBorderEnabled, amount, onChangeAmount }:
    {
        onSelect: (assets: TokenBalances) => void,
        selectedToken: TokenBalances | undefined,
        allTokens: TokenBalances[] | undefined
        title: string,
        subtitle?: ReactNode
        topBorderEnabled: boolean,
        bottomBorderEnabled: boolean,
        amount?: string,
        onChangeAmount?: (amount: string) => void
    }

) => {

    return <div className={`border flex justify-between p-6 ${topBorderEnabled ? "rounded-t-xl" : ""} ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}>
        <div>
            <div className="font-semibold">{title}</div>
            <AssestSelector selectedToken={selectedToken} allTokens={allTokens} onSelect={onSelect} />
            {subtitle}
        </div>
        <div>
            <input
                type="text"
                placeholder="0"
                className="outline-none text-4xl p-4"
                dir="rtl"
                value={amount}
                onChange={(e) => onChangeAmount && onChangeAmount(e.target.value)}
            />
        </div>
    </div>
}

export { SwapRow }