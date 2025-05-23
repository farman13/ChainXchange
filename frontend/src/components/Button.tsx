
export const PrimaryButton = ({ children, onClick, disabled }: {
    children: React.ReactNode,
    onClick: () => void,
    disabled?: boolean
}) => {
    return (
        <>
            <button type="button" onClick={onClick} disabled={disabled} className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
        ${disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-black cursor-pointer focus:ring-4 focus:ring-gray-100 border-gray-300 focus:outline-none"}
      `}
            >{children}</button>
        </>
    )
}

export const SecondaryButton = ({ children, onClick }: {
    children: React.ReactNode,
    onClick: () => void
}) => {
    return (
        <>
            <button type="button" onClick={onClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
            <button type="button" onClick={onClick} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
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
            <button type="button" onClick={onClick} className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${active ? "bg-blue-700" : "bg-blue-300"}`}
            >{children}</button >
        </>
    )
}
