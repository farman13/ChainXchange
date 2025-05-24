import { useState } from "react";
import { PrimaryButton } from "../Button";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const RequestToken = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    // Simulate a request call (replace with your API or smart contract call)
    const handleRequest = async () => {
        console.log("inside handle request")
        setLoading(true);
        setMessage("");

        const sub = user?.sub;
        const token = await getAccessTokenSilently();

        try {
            const response = await axios.post("http://localhost:3000/api/v1/token/requestToken", {
                sub
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                })

            console.log(response.data.data.tx)
            setMessage("20 USDT tokens sent successfully!");
        } catch (err) {
            setMessage("Failed to request tokens. Please try again after login.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-white text-center p-2">
            <div className="flex justify-between">
                <div className="ml-26">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-7">
                        Request USDT Tokens after Login
                    </h2>
                    <p className="mb-6 text-gray-600">
                        Click the button to request some test USDT tokens for trying out the app.
                    </p>
                </div>
                <div className="mt-7 mr-22">
                    <PrimaryButton onClick={handleRequest} disabled={loading || !isAuthenticated}>
                        {loading ? "Requesting..." : "Request USDT"}
                    </PrimaryButton>
                </div>
            </div>
            <div>
                {message && (
                    <p className="mb-1 text-sm text-green-600 font-medium">{message}</p>
                )}
            </div>
        </div>
    );
};

export { RequestToken };
