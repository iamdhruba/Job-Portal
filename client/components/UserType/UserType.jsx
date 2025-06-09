import React from "react";

const UserType = () => {
    const data = [
        {
            image: "../../assests/team.jpg",
            name: "For Candidate",
            description: "Unlock endless opportunities and connect with top employers.Let your skills shine and land your dream job.",
            button: "Upload your CV",
        },
        {
            image: "../../assests/work.jpg",
            name: "For employee or company",
            description: "Access a pool of skilled candidates and streamline your hiring process.Find the best talent for your company's success.",
            button: "Start Hiring",
        },
    ];

    return (
        <>
            <div className="w-full flex items-center justify-center">
                <div className="w-[85%] flex items-center justify-center  h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%] mt-10">
                        {data.map((elem, index) => (
                            <div key={index} className="flex w-full h-[250px] bg-white rounded-lg shadow-lg overflow-hidden">
                                {/* Text Section */}
                                <div className="w-1/2 bg-zinc-100 p-8 flex flex-col justify-between">
                                    <div>
                                        <h2 className="font-bold text-xl text-zinc-900">{elem.name}</h2>
                                        <p className="text-sm mt-4 text-zinc-700">{elem.description}</p>
                                    </div>
                                    <button className="mt-6 w-max px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">{elem.button}</button>
                                </div>

                                {/* Image Section */}
                                <div className="w-1/2 h-full">
                                    <img src={elem.image} alt={elem.name} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserType;
