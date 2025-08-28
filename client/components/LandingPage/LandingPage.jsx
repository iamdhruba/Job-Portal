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
            <section className="container mx-auto container-px flex flex-col items-center justify-center min-h-[45vh] text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                    Join the most popular and trusted
                    <br />
                    <span className="text-primary">internship and companies</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                    We've helped over <span className="font-semibold text-primary">2,500 freshers</span> to get into the most popular internships and jobs
                </p>
            </section>
            {/* Search with dropdown */}
            <form className="container mx-auto container-px -mt-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3" onSubmit={handleSearch}>
                <div className="relative w-full md:w-auto">
                    <select
                        className="bg-primary text-primary-foreground font-semibold rounded-full pl-4 pr-10 py-3 focus:outline-none shadow-soft transition-all duration-200 appearance-none w-full md:w-auto"
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
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </div>
                <div className="flex-1 w-full max-w-3xl">
                    <input
                        type="text"
                        className="w-full border border-input rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder={`Search ${selected}...`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <button type="submit" className="text-primary-foreground bg-primary font-semibold px-6 py-3 rounded-full shadow-soft hover:bg-primary/90 transition-colors">
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
