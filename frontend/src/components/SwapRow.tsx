import { ReactNode } from "react"
import { TokenBalances } from "../hooks/useTokenBalance"
import { AssestSelector } from "./AssestSelector"
import { useDebounce } from "../hooks/useDebounce"

const SwapRow = ({ onSelect, selectedToken, allTokens, title, subtitle, topBorderEnabled, bottomBorderEnabled, amount, onChangeAmount, inputDisable }:
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
        inputDisable?: boolean
    }) => {

    const debounce = useDebounce((val) => {
        onChangeAmount?.(val);
    }, 600);

    return <div className={`border flex justify-between p-6 ${topBorderEnabled ? "rounded-t-xl" : ""} ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}>
        <div>
            <div className="font-semibold">{title}</div>
            <div className="w-22">
                <AssestSelector selectedToken={selectedToken} allTokens={allTokens} onSelect={onSelect} />
            </div>
            {subtitle}
        </div>
        <div>
            <input
                disabled={inputDisable}
                type="text"
                placeholder="0"
                className="outline-none text-4xl p-4 text-right"
                value={amount}
                //  onChange={(e) => onChangeAmount && onChangeAmount(e.target.value)}
                onChange={(e) => debounce(e.target.value)}
            />
        </div>
    </div>
}

export { SwapRow }