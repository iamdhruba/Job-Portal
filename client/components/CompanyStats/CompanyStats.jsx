import React from "react";

function CompanyStats() {
    const stats = [
        {
            number: "12k+",
            title: "Clients Worldwide",
            description: "At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...",
        },
        {
            number: "20k+",
            title: "Active Resumes",
            description: "At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...",
        },
        {
            number: "18k+",
            title: "Companies",
            description: "At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum...",
        },
    ];

    return (
        <section className="w-[90%] max-w-7xl mx-auto my-16 text-center">
            <h1 className="text-3xl font-bold mb-10">Key Statistics</h1>
            <div className="grid gap-8 md:grid-cols-3">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-white rounded-lg shadow-md text-gray-800 hover:shadow-lg transition duration-300">
                        <h2 className="text-4xl font-extrabold text-emerald-600 mb-2">{stat.number}</h2>
                        <p className="text-lg font-semibold mb-2">{stat.title}</p>
                        <p className="text-sm text-gray-600">{stat.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CompanyStats;
