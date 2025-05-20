import { X } from "lucide-react";
import { useState } from "react";
import { QRCodeCanvas } from 'qrcode.react';

interface WalletModalProps {
    address: string;
    onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ address, onClose }) => {

    const [copied, setCopied] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>

            {/* MODAL */}
            <div className="relative z-10 w-[400px] bg-white rounded-xl p-6 shadow-xl">
                {/* Close button */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    <X />
                </button>

                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Wallet Address</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        You can deposit crypto or NFTs into your account via this Ethereum wallet address:
                    </p>

                    <div className="bg-slate-100 p-4">
                        <QRCodeCanvas value={address} size={192} className="mx-auto mb-4" />

                        <div className="bg-gray-100 p-2 ml-8 mr-8 rounded flex items-center justify-between">
                            <span className="text-sm font-mono text-gray-700">{address.slice(0, 18)}...{address.slice(-4)}</span>
                            <button
                                className="text-blue-500 text-sm cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText(address)
                                    setCopied(true)
                                    setTimeout(() => setCopied(false), 2000)
                                }}
                            >
                                {copied ? "copied" : "Copy"}
                            </button>
                        </div>

                        <div className="text-xs text-gray-400 mt-2">
                            Only send crypto to this address via the Sepolia network.
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            className="bg-white border border-gray-300 text-sm px-4 py-2 rounded-lg shadow hover:bg-gray-100"
                            onClick={() => window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank")}
                        >
                            View On SepoliaScan
                        </button>
                        <button
                            className="bg-white border border-gray-300 text-sm px-6 py-2 rounded-lg shadow hover:bg-gray-100"
                            onClick={onClose}
                        >
                            Done
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WalletModal;
