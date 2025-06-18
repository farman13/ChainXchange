const HowItWorks = () => {
    return (
        <div className="py-4 bg-gradient-to-b mb-15">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-16">How It Works ?</h2>
                <div className="grid md:grid-cols-4 gap-10">
                    {[
                        "Login with Google",
                        "Custodial wallet created instantly",
                        "Send & receive crypto in USD values",
                        "Swap tokens seamlessly",
                    ].map((step, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                        >
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-sky-500 text-white text-lg font-bold">
                                {index + 1}
                            </div>
                            <p className="text-gray-700 text-lg">{step}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export { HowItWorks };