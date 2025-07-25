import { useEffect, useState } from "react"
import { TokenBalances, TokenBalancesWithUSD } from "../../hooks/useTokenBalance";
import { SwapRow } from "./SwapRow";
import { SwapIcon } from "./SwapIcon";
import axios from "axios";
import { PrimaryButton } from "../Button";
import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import { toast } from 'react-hot-toast';

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
        // console.log(typeof (baseAmount))
        // console.log(baseAmount)

        const fetchQuote = async () => {
            const response = await axios.get(`https://chain-xchange.vercel.app/api/v1/token/quote?srctoken=${baseAsset?.name}&desttoken=${quoteAsset?.name}&amount=${baseAmount}&publicKey=${publicKey}`)
            setQuoteAmount(response.data.data);
        }

        fetchQuote();

    }, [baseAmount, baseAsset, quoteAsset])

    // console.log("from swaptoken : token", tokenBalances);

    const initiateSwap = async () => {

        if (baseAmount) {
            if (!baseAsset || parseFloat(baseAmount) >= baseAsset?.balance) {
                toast.error("Insufficient Assets");
                setisSwapping(false);
                return;
            }
        }

        try {
            setisSwapping(true)
            const token = await getAccessTokenSilently();

            const response = await axios.post("https://chain-xchange.vercel.app/api/v1/user/swap", {
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
            // console.log(response.data);
            setQuoteAmount("0");
            setBaseAmount("");
            setisSwapping(false);
            toast.success(`Tokens Swapped successfully\nTransaction hash: ${response.data.data}`);
            refetch();
        } catch (error: any) {
            const message = error?.response?.data?.message || "Swap failed.";
            toast.error(message);
        } finally {
            setisSwapping(false)

        }
    }

    return <div className="p-6">
        <div className="text-3xl text-slate-600 font-bold pt-2 mb-7">
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
            subtitle={<div className="text-slate-500 text-xs">{`Current balance : ${baseAsset?.balance.toFixed(4)} ${baseAsset?.name}`}</div>}
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
            subtitle={<div className="text-slate-500 text-xs">{`Current balance : ${quoteAsset?.balance.toFixed(4)} ${quoteAsset?.name}`}</div>}
        />
        <div className="flex justify-end mt-3">
            <PrimaryButton onClick={initiateSwap} disabled={isSwapping}>
                {isSwapping ? "Swapping" : "Swap"}
            </PrimaryButton>

        </div>
    </div>
}

export { SwapToken }