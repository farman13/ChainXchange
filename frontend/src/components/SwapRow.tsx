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

    return (
        <div
            className={`bg-white flex justify-between items-center px-6 py-5 shadow-sm border ${topBorderEnabled ? "rounded-t-2xl" : ""
                } ${bottomBorderEnabled ? "rounded-b-2xl" : ""}`}
        >
            <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-slate-600">{title}</div>
                <div className="w-28">
                    <AssestSelector
                        selectedToken={selectedToken}
                        allTokens={allTokens}
                        onSelect={onSelect}
                    />
                </div>
                {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
            </div>

            <div>
                <input
                    disabled={inputDisable}
                    type="text"
                    placeholder="0"
                    className="text-right text-3xl font-semibold text-slate-800 bg-transparent outline-none w-40"
                    value={amount}
                    onChange={(e) => debounce(e.target.value)}
                />
            </div>
        </div>
    );

}

export { SwapRow }