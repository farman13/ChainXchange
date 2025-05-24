import { TokenBalances } from "../hooks/useTokenBalance";

export const TokenRow = ({ token }: { token: TokenBalances }) => {

    console.log("IMGGGGG", token.image)
    return <div className="flex justify-between">
        <div className="flex">
            <div className="w-10 h-10 mr-3">
                <img
                    src={token.image}
                    alt={token.name}
                    className="w-full h-full rounded-full object-contain"
                />
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
                <div className="font-bold ml-3">
                    {token.balance.toFixed(2)}
                </div>
                <div className="font-slim">
                    ~${token.usdBalance.toFixed(1)}
                </div>
            </div>
        </div>
    </div>
}