import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react"

export const useTokenBalance = (publicKey: string) => {

    const [tokenBalances, setTokenBalances] = useState();
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

    return { tokenBalances, loading };
}