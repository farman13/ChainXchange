import { TokenBalances } from "../../hooks/useTokenBalance"
import { TokenRow } from "./TokenRow"

export const TokenList = ({ tokens }: {
    tokens: TokenBalances[]
}) => {

    return <div>
        {tokens.map(t => <TokenRow token={t} />)}
    </div>
}
