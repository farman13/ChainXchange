import { useEffect, useState } from "react";
import { TertiaryButton } from "./Button";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { TokenList } from "./TokenList";

function Assets({ publicKey }: {
    publicKey: string
}
) {

    const [copied, setCopied] = useState(false);
    console.log("AASSSPub", publicKey)
    const { tokenBalances, loading } = useTokenBalance(publicKey);

    useEffect(() => {
        if (copied) {
            let timeout = setTimeout(() => {
                setCopied(false)
            }, 2000)
            return () => {
                clearTimeout(timeout);
            }
        }
    }, [copied])

    return (
        <div className="text-slate-500 mt-4">
            Account assets
            <br />

            <div className="flex justify-between m-2">
                <div className="flex">
                    {loading ? "Loading......" :
                        <div className="text-5xl font-bold text-black">
                            ${tokenBalances?.totalUSDBalance}
                        </div>
                    }
                    <div className="text-slate-500 text-3xl flex flex-col font-semibold justify-end  pl-2">
                        USD
                    </div>
                </div>
                <div>
                    <TertiaryButton onClick={() => {
                        setCopied(true);
                        navigator.clipboard.writeText(publicKey ?? "")

                    }
                    }>{copied ? "Copied" : "Your wallet address"}</TertiaryButton>
                </div>
            </div>
            <div className="mt-15 bg-slate-100 p-4">
                <TokenList tokens={tokenBalances?.tokens || []} />
            </div>
        </div>
    );
}

export { Assets };
