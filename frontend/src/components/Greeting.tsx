function Greeting({ image, name }: {
    image: string | undefined, name: string | undefined
}) {

    console.log(name, image);
    return <div className="flex mb-10">
        <img src={image} className="w-10 h-10 rounded-full mr-4 border-2 border-gray-300" alt="icon" />
        <div className="text-xl font-semibold flex flex-col justify-center">
            Welcome back, {name}
        </div>
    </div>
}

export { Greeting };