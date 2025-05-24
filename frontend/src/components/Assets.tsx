import { TokenBalancesWithUSD } from "../hooks/useTokenBalance";
import { TokenList } from "./TokenList";

function Assets({ tokenBalances }: {
    tokenBalances: TokenBalancesWithUSD | undefined,
}
) {

    return (
        <div className="text-slate-500">
            <div className="mt-5 bg-slate-100 p-4">
                <TokenList tokens={tokenBalances?.tokens || []} />
            </div>
        </div>
    );
}

export { Assets };
