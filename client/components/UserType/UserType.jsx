import React from "react";

const UserType = () => {
    const data = [
        {
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
            name: "For Candidate",
            description: "Unlock endless opportunities and connect with top employers.Let your skills shine and land your dream job.",
            button: "Upload your CV",
        },
        {
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
            name: "For employee or company",
            description: "Access a pool of skilled candidates and streamline your hiring process.Find the best talent for your company's success.",
            button: "Start Hiring",
        },
    ];
    return (
        <>
            <div className="flex flex-col items-center justify-center w-full h-full bg-zinc-100">
                <div className="flex items-center justify-center w-[70%] mt-10 gap-10">
                    {data.map((elem, index) => (
                        <div key={index} className="flex bg-zinc-200 rounded-md shadow-lg">
                            <div className="p-10 flex flex-col justify-between">
                                <h2 className="font-bold text-xl">{elem.name}</h2>
                                <p className="text-xs mt-3 mb-4">{elem.description}</p>
                                <button className="px-3 py-2 bg-red-500 rounded-md text-white text-sm cursor-pointer self-start">{elem.button}</button>
                            </div>
                            <div className="flex w-full h-full bg-zinc-300 ">
                                <img src={elem.image} alt={elem.name} className=" w-full h-full object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UserType;
