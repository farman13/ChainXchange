import { FaWallet, FaGoogle, FaDollarSign, FaExchangeAlt, FaPaperPlane, FaKey } from "react-icons/fa";

const features = [
    { icon: <FaWallet size={28} />, title: "Custodial Wallet", desc: "No private key worries. We manage your wallet securely." },
    { icon: <FaGoogle size={28} />, title: "Google Login", desc: "Start your crypto journey with just your Gmail." },
    { icon: <FaDollarSign size={28} />, title: "Transact in USD", desc: "Transact in dollars value" },
    { icon: <FaPaperPlane size={28} />, title: "Send Crypto Easily", desc: "Send $10 in ETH — no confusing amounts." },
    { icon: <FaExchangeAlt size={28} />, title: "Swap Tokens", desc: "Instantly convert between tokens in-app." },
    { icon: <FaKey size={28} />, title: "Own Your Wallet", desc: "Each user has their own wallet. Not a central pot." },
];

const Features = () => {

    return (
        <div className="py-20 bg-white mt-2">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-14">Why Choose Us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                        >
                            <div className="flex items-center justify-center text-sky-600 mb-4">{f.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                            <p className="text-gray-600">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { Features };