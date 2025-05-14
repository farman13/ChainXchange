import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"
import { useEffect, useState } from "react";

const useGetUserWallet = () => {

    const [userPublicKey, setUserPublicKey] = useState();

    const { user, getAccessTokenSilently } = useAuth0();

    const getUserWallet = async () => {

        const sub = user?.sub;
        const token = await getAccessTokenSilently();
        console.log("sub", sub);
        console.log("token", token);

        if (!sub) {
            return null;
        }
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/getwallet", {
                sub
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                })
            console.log(response.data);
            setUserPublicKey(response.data.data);
        } catch (e) {
            console.log("Error while fetching wallet", e);
        }
    }

    useEffect(() => {
        getUserWallet();
    }, [])

    return userPublicKey;

}

export { useGetUserWallet };

