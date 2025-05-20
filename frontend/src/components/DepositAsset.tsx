import { Dispatch, SetStateAction } from "react";

const DepositAsset = ({ setDepositAmountModal }: {
    setDepositAmountModal: Dispatch<SetStateAction<boolean>>
}) => {
    return <div>
        deposit your crypto
        <div>
            <button
                className="bg-white border border-gray-400 text-md px-6 py-2 mt-4 rounded-lg shadow hover:bg-gray-100"
                onClick={() => setDepositAmountModal(false)}
            >
                back
            </button>
        </div>
    </div>
}

export { DepositAsset };