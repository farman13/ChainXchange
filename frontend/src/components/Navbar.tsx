import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { useEffect } from "react";
import { PrimaryButton } from "./Button"
import { useAccount, useDisconnect } from "wagmi";

const Navbar = () => {

    const { loginWithRedirect, user, isAuthenticated, logout, getAccessTokenSilently } = useAuth0();
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    async function storeDetails() {

        if (!isAuthenticated) {
            return;
        }
        try {
            const token = await getAccessTokenSilently();
            const username = user?.name;
            const email = user?.email;
            const picture = user?.picture;
            const sub = user?.sub;
            console.log("token", token)
            console.log("User : ", user);
            console.log(username, email);
            console.log("token", token);

            const response = await axios.post('http://localhost:3000/api/v1/user/signup',
                {
                    username,
                    email,
                    picture,
                    sub
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            console.log(response.data);
        } catch (e) {
            console.log("error while signUp :", e)
        }
    }

    useEffect(() => {

        storeDetails();
    }, [isAuthenticated, user])

    return (
        <div className="flex justify-between px-2 py-2 shadow ">
            <div className="px-5 py-2 font-medium">
                DCEX
            </div>
            <div className="flex">
                <div className="mr-2">
                    {
                        isConnected && (
                            <PrimaryButton onClick={() => disconnect()}>
                                Disconnect wallet
                            </PrimaryButton>
                        )
                    }
                </div>
                <div>
                    {!isAuthenticated ?
                        <PrimaryButton onClick={() => loginWithRedirect({
                            authorizationParams: {
                                connection: 'google-oauth2'
                            }
                        })}>Log In</PrimaryButton> :
                        <PrimaryButton onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log out</PrimaryButton>
                    }
                </div>
            </div>
        </div>
    )
}

export { Navbar }