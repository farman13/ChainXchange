import { TokenBalances } from "../hooks/useTokenBalance";

export const TokenRow = ({ token }: { token: TokenBalances }) => {

    console.log("IMGGGGG", token.image)
    return <div className="flex justify-between">
        <div className="flex">
            <div>
                <img src={token.image} className="h-10 w-10 rounded-full pr-2" />
            </div>
            <div>
                <div className="font-bold">
                    {token.name}
                </div>
                <div className="font-slim">
                    1 {token.name} = ~${token.usdPrice.toFixed(6)}
                </div>
            </div>
        </div>
        <div>
            <div>
                <div className="font-bold">
                    {token.balance.toFixed(2)}
                </div>
                <div className="font-slim">
                    ~${token.usdBalance.toFixed(1)}
                </div>
            </div>
        </div>
    </div>
}