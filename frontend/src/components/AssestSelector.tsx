import { TokenBalances } from "../hooks/useTokenBalance"

const AssestSelector = ({ selectedToken, allTokens, onSelect }: {
    selectedToken: TokenBalances | undefined,
    allTokens: TokenBalances[] | undefined
    onSelect: (assest: TokenBalances) => void
}) => {
    return <div className="mt-2">
        <select onChange={(e) => {
            const selectedtoken = allTokens?.find(x => x.name === e.target.value);
            if (selectedtoken) {
                onSelect(selectedtoken);
            }
        }}

            id="tokens" className="bg-gray-50 border border-gray-300 text-gray-900 text-ssm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            {allTokens &&
                allTokens.map(token => <option selected={selectedToken?.name === token.name}><img src={token.image} className="w-10" /> {token.name}</option>)}
        </select>
    </div>
}

export { AssestSelector }