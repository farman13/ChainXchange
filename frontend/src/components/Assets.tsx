import { useEffect, useState } from "react";
import { useGetUserWallet } from "../utils/useGetUserWallet";
import { TertiaryButton } from "./Button";

function Assets() {

    const [copied, setCopied] = useState(false);

    const publicKey = useGetUserWallet();

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
                <div>

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
