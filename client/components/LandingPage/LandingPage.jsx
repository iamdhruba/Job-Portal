import React, { useState } from "react";
import CompanyStats from "../CompanyStats/CompanyStats";
import HowWeWork from "../HowWeWork/HowWeWork";
import FAQs from "../FAQs/FAQs";
import Testimonials from "../Testimonials/Testimonials";

const options = [
    { value: "internships", label: "Internships" },
    { value: "jobs", label: "Jobs" },
    { value: "companies", label: "Companies" },
];
const LandingPage = () => {
    const [selected, setSelected] = useState(options[0].value);
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search logic here
        alert(`Searching for "${query}" in ${selected}`);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Join the most popular and trusted&nbsp;<br></br>
                        <span className="text-red-700  bg-clip-text">internship and companies</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        We've helped over <span className="font-semibold text-red-700">2,500 freshers</span> to get into the most popular internships and jobs
                    </p>
                </div>
            </div>
            {/* Search with dropdown */}
            <form className="flex flex-col md:flex-row items-center justify-center gap-4" onSubmit={handleSearch}>
                <div className="relative">
                    <select
                        className="bg-red-700 text-white font-semibold rounded-full p-3 pr-10 focus:outline-none shadow transition-all duration-200 appearance-none"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {/* Dropdown Icon */}
                    <span className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </div>
                <input
                    type="text"
                    className="border border-gray-300 rounded-full px-80 py-3 focus:outline-none "
                    placeholder={`Search ${selected}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="text-white bg-red-700 font-semibold px-5 py-2 rounded-full shadow transition-colors">
                    Search
                </button>
            </form>
            <CompanyStats />
            <HowWeWork />
            <FAQs />
            <Testimonials />
        </>
    );
};

export default LandingPage;
