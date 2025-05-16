import { useEffect, useState } from "react"
import { TokenBalances, useTokenBalance } from "../hooks/useTokenBalance";
import { SwapRow } from "./SwapRow";
import { SwapIcon } from "./SwapIcon";

const SwapToken = ({ publicKey }:
    { publicKey: string }
) => {

    const [baseAsset, setBaseAsset] = useState<TokenBalances>();
    const [quoteAsset, setQuoteAsset] = useState<TokenBalances>();
    const [baseAmount, setBaseAmount] = useState<string>();
    const [quoteAmount, setQuoteAmount] = useState<string>();

    const { tokenBalances, loading } = useTokenBalance(publicKey);

    useEffect(() => {
        setBaseAsset(tokenBalances?.tokens[0])
        setQuoteAsset(tokenBalances?.tokens[1])
    }, [loading])

    useEffect(() => {
        if (!baseAmount) {
            return
        }

        // fetch the quote fro quote Asset

    }, [baseAmount, baseAsset, quoteAsset])

    console.log("from swaptoken : token", tokenBalances);

    return <div className="p-12">
        <div className="text-2xl font-bold pb-4">
            Swap Tokens
        </div>
        <SwapRow
            onSelect={(asset: TokenBalances) => {
                setBaseAsset(asset)
            }}
            selectedToken={baseAsset}
            allTokens={tokenBalances?.tokens}
            title="You pay :"
            topBorderEnabled={true}
            bottomBorderEnabled={false}
            subtitle={<div className="text-slate-500 text-sm">{`Current balance : ${baseAsset?.balance.toFixed(2)} ${baseAsset?.name}`}</div>}
            amount={baseAmount}
            onChangeAmount={(value: string) => setBaseAmount(value)}
        />

        <div className="flex justify-center">
            <div className="cursor-pointer flex items-center justify-center rounded-full w-10 h-10 border absolute mt-[-20px] bg-white" onClick={() => {
                let temp = baseAsset;
                setBaseAsset(quoteAsset)
                setQuoteAsset(temp)
            }}>
                <SwapIcon />
            </div>
        </div>

        <SwapRow
            onSelect={(asset: TokenBalances) => {
                setQuoteAsset(asset)
            }}
            selectedToken={quoteAsset}
            allTokens={tokenBalances?.tokens}
            title="You receive :"
            topBorderEnabled={false}
            bottomBorderEnabled={true}
            amount={quoteAmount}
        />
    </div>
}

export { SwapToken }