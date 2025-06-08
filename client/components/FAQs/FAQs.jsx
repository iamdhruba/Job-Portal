import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
    {
        id: 1,
        question: "Can I upload a CV?",
        answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitant morbi faucibus in iaculis lectus. Nisi enim feugiat enim volutpat. Sem quis viverra viverra odio mauris nunc.",
    },
    {
        id: 2,
        question: "How long will the recruitment process take?",
        answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitant morbi faucibus in iaculis lectus. Nisi enim feugiat enim volutpat. Sem quis viverra viverra odio mauris nunc.",
    },
    {
        id: 4,
        question: "Do you recruit for Graduates, Apprentices and Students?",
        answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitant morbi faucibus in iaculis lectus. Nisi enim feugiat enim volutpat. Sem quis viverra viverra odio mauris nunc.",
    },
    {
        id: 3,
        question: "What does the recruitment and selection process involve?",
        answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitant morbi faucibus in iaculis lectus. Nisi enim feugiat enim volutpat. Sem quis viverra viverra odio mauris nunc.",
    },
    {
        id: 5,
        question: "Can I receive notifications for any future jobs that may interest me?",
        answer: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum. Habitant morbi faucibus in iaculis lectus. Nisi enim feugiat enim volutpat. Sem quis viverra viverra odio mauris nunc.",
    },
];

const FAQSection = () => {
    const [activeId, setActiveId] = useState(1);

    const toggle = (id) => {
        setActiveId((prevId) => (prevId === id ? null : id));
    };

    return (
        <section className="w-[90%] max-w-4xl mx-auto my-20">
            <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
            <p className="text-center text-gray-500 mb-8">At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.</p>
            <div className="border rounded-xl divide-y">
                {faqs.map((faq, index) => (
                    <div key={faq.id} className={`p-5 ${activeId === faq.id ? "bg-emerald-50" : "bg-white"}`}>
                        <div className="flex justify-between items-start cursor-pointer" onClick={() => toggle(faq.id)}>
                            <div className="flex gap-3">
                                <span className="font-bold text-emerald-600">{String(faq.id).padStart(2, "0")}</span>
                                <p className="font-medium">{faq.question}</p>
                            </div>
                            <div>{activeId === faq.id ? <X className="text-emerald-600" size={20} /> : <Plus className="text-emerald-600" size={20} />}</div>
                        </div>
                        {activeId === faq.id && faq.answer && <p className="mt-4 text-sm text-gray-600">{faq.answer}</p>}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
