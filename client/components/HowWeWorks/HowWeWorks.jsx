import React from "react";
import { UserPlus, FileText, Briefcase, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: <UserPlus size={32} className="text-emerald-600 mb-4" />,
        title: "Create Account",
        description: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus",
    },
    {
        icon: <FileText size={32} className="text-emerald-600 mb-4" />,
        title: "Upload Resume",
        description: "Felis eu ultrices a sed massa. Commodo fringilla sed tempor",
    },
    {
        icon: <Briefcase size={32} className="text-emerald-600 mb-4" />,
        title: "Find Jobs",
        description: "Commodo fringilla sed tempor risus laoreet ultricies ipsum",
    },
    {
        icon: <CheckCircle size={32} className="text-emerald-600 mb-4" />,
        title: "Apply Job",
        description: "Nisi enim feugiat enim volutpat. Sem quis viverra",
    },
];

const HowItWorks = () => {
    return (
        <section className="w-[90%] max-w-7xl mx-auto my-20 text-center">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-12">At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum id scelerisque rhoncus...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                    <div key={index} className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
                        {step.icon}
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
