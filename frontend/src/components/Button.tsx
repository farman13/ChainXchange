
export const PrimaryButton = ({
    children,
    onClick,
    disabled,
}: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
        ${disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-black cursor-pointer focus:ring-4 focus:ring-gray-100 border-gray-300 focus:outline-none"
                }`}
        >
            <div className="flex items-center gap-2 justify-center">
                {disabled && (
                    <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                )}
                {children}
            </div>
        </button>
    );
};


export const SecondaryButton = ({ children, onClick }: {
    children: React.ReactNode,
    onClick: () => void
}) => {
    return (
        <>
            <button type="button" onClick={onClick} className="text-white bg-sky-700 hover:bg-sky-800 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >{children}</button >
        </>
    )
}

export const TertiaryButton = ({ children, onClick }: {
    children: React.ReactNode,
    onClick: () => void
}) => {
    return (
        <>
            <button type="button" onClick={onClick} className="text-slate-600 bg-slate-300 border border-gray-300 focus:outline-none hover:bg-slate-400 font-bold rounded-full text-xs px-5 py-2.5 me-1 mb-1"
            >{children}</button >
        </>
    )
}

export const TabButton = ({ active, children, onClick }: {
    children: React.ReactNode,
    onClick: () => void,
    active: boolean
}) => {
    return (
        <>
            <button type="button" onClick={onClick} className={` focus:ring-1 font-semibold rounded-lg text-sm px-5 py-2.5 me-1 mb-2 ${active ? "bg-sky-600 text-slate-100 hover:bg-sky-700" : "text-sky-600 bg-slate-200 hover:bg-slate-300"}`}
            >{children}</button >
        </>
    )
}

export const BackButton = ({ children, onClick }: {
    children: React.ReactNode,
    onClick: () => void,
}) => {
    return (
        <>
            <button
                className="bg-white border border-gray-400 text-md px-6 py-2 mt-4 rounded-lg shadow hover:bg-gray-100"
                onClick={onClick}
            >
                {children}
            </button>
        </>
    )
}