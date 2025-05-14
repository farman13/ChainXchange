import { useEffect, useState } from "react";
import { TertiaryButton } from "./Button";
import { useTokenBalance } from "../hooks/useTokenBalance";

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

            <div className="flex justify-between">
                <div className="flex">
                    <div className="text-5xl font-bold text-black">
                        {loading ? "Loading......" :
                            // @ts-ignore
                            <div>
                                ${tokenBalances?.totalUSDBalance}
                            </div>
                        }
                    </div>
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
        </div>
    );
}

export { Assets };
