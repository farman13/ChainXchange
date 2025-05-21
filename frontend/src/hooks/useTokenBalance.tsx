import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react"

export type TokenBalances = {
    name: string,
    balance: number,
    usdPrice: number,
    usdBalance: number,
    image: string,
    native: boolean,
    address: string
}

export type TokenBalancesWithUSD = {
    tokens: TokenBalances[],
    totalUSDBalance: number
}

export const useTokenBalance = (publicKey: string) => {

    const [tokenBalances, setTokenBalances] = useState<TokenBalancesWithUSD>();
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();

    const fetchToken = async () => {

        const token = await getAccessTokenSilently();
        const response = await axios.get(`http://localhost:3000/api/v1/user/balance?address=${publicKey}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        setTokenBalances(response.data);
        setLoading(false);
    }

    useEffect(() => {
        if (!publicKey) return;
        fetchToken();
    }, [publicKey])

    return { tokenBalances, loading, refetch: fetchToken };
}