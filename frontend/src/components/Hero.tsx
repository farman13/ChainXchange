import { useAuth0 } from "@auth0/auth0-react";
import { SecondaryButton } from "./Button";
import { useNavigate } from "react-router-dom";

const Hero = () => {

    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    return (
        <div>
            <div className="text-5xl font-medium pt-15 flex justify-center">
                <span>The Indian Cryptocurrency</span>
                <span className="text-blue-500 pl-2">Revolution</span>
            </div>
            <div className="flex justify-center pt-4 text-2xl font-semimedium text-slate-500">
                Create a frictionless wallet with just a Google account
            </div>
            <div className="flex justify-center pt-2 text-xl text-slate-500">
                Convert your INR into Cryptocurrency
            </div>
            {!isAuthenticated ?
                <div className="pt-4 flex justify-center">
                    <SecondaryButton onClick={() => {
                        loginWithRedirect({
                            authorizationParams: {
                                connection: 'google-oauth2'
                            }
                        });
                    }}>Login with Google</SecondaryButton>
                </div> :
                <div className="pt-4 flex justify-center">
                    <SecondaryButton onClick={() => navigate('/dashboard')}>Dashboard</SecondaryButton>
                </div>
            }
        </div >
    )
}

export { Hero };