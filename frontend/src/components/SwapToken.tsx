import { useEffect, useState } from "react"
import { TokenBalances, TokenBalancesWithUSD } from "../hooks/useTokenBalance";
import { SwapRow } from "./SwapRow";
import { SwapIcon } from "./SwapIcon";
import axios from "axios";
import { PrimaryButton } from "./Button";
import { GetTokenSilentlyOptions } from "@auth0/auth0-react";

const SwapToken = ({ publicKey, tokenBalances, loading, refetch, getAccessTokenSilently }:
    {
        publicKey: string,
        tokenBalances: TokenBalancesWithUSD | undefined,
        loading: boolean,
        refetch: () => void,
        getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>;
    }
) => {

    const [baseAsset, setBaseAsset] = useState<TokenBalances>();
    const [quoteAsset, setQuoteAsset] = useState<TokenBalances>();
    const [baseAmount, setBaseAmount] = useState<string>();
    const [quoteAmount, setQuoteAmount] = useState<string>();
    const [isSwapping, setisSwapping] = useState<boolean>(false);

    useEffect(() => {
        setBaseAsset(tokenBalances?.tokens[1])
        setQuoteAsset(tokenBalances?.tokens[2])
    }, [loading, tokenBalances])

    useEffect(() => {
        if (baseAmount == "" || baseAmount == undefined || baseAmount == "0") {
            console.log("inside if")
            setQuoteAmount("0");
            return;
        }
        console.log(typeof (baseAmount))
        console.log(baseAmount)

        const fetchQuote = async () => {
            const response = await axios.get(`http://localhost:3000/api/v1/token/quote?srctoken=${baseAsset?.name}&desttoken=${quoteAsset?.name}&amount=${baseAmount}&publicKey=${publicKey}`)
            setQuoteAmount(response.data.data);
        }

        fetchQuote();

    }, [baseAmount, baseAsset, quoteAsset])

    console.log("from swaptoken : token", tokenBalances);

    const initiateSwap = async () => {

        setisSwapping(true)
        const token = await getAccessTokenSilently();

        const response = await axios.post("http://localhost:3000/api/v1/user/swap", {
            baseAsset,
            quoteAsset,
            baseAmount,
            publicKey
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
        console.log(response.data);
        setQuoteAmount("0");
        setBaseAmount("0");
        setisSwapping(false);
        alert(`tokens swapped`)
        refetch();

    }

    return <div className="p-12">
        <div className="text-2xl font-bold pb-4">
            Swap Tokens
        </div>
        <SwapRow
            onSelect={(asset: TokenBalances) => {
                setBaseAsset(asset)
                console.log("ssesststst", asset);
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
            inputDisable={true}
            subtitle={<div className="text-slate-500 text-sm">{`Current balance : ${quoteAsset?.balance.toFixed(2)} ${quoteAsset?.name}`}</div>}
        />
        <div className="flex justify-end mt-3">
            <PrimaryButton onClick={initiateSwap} >
                {isSwapping ? (
                    <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Swapping...
                    </div>
                ) : (
                    "Swap"
                )}
            </PrimaryButton>

        </div>
    </div>
}

export { SwapToken }