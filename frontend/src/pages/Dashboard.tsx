import { useAuth0 } from "@auth0/auth0-react"
import { Navbar } from "../components/Navbar"
import { Assets } from "../components/Assets";

export const Dashboard = () => {

    const { user, isLoading } = useAuth0();

    return (
        <>
            <Navbar />
            {isLoading ?
                <div>Loading....</div>
                :
                <div className="pt-8 flex justify-center">
                    <div className="max-w-4xl bg-white rounded shadow w-full p-12">
                        <Greeting image={user?.picture} name={user?.name} />
                        <Assets />
                    </div>
                </div>
            }
        </>
    )
}

function Greeting({ image, name }: {
    image: string | undefined, name: string | undefined
}) {

    console.log(name, image);
    return <div className="flex">
        <img src={image} className="w-13 h-13 rounded-full mr-4" alt="icon" />
        <div className="text-xl font-semibold flex flex-col justify-center">
            Welcome back, {name}
        </div>
    </div>
}
