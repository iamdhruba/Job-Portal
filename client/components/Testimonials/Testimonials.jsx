import React from "react";

const testimonials = [
    {
        rating: 5,
        title: "Amazing services",
        text: "Metus faucibus sed turpis lectus feugiat tincidunt. Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis",
        name: "Marco Kihn",
        role: "Happy Client",
        avatar: "/path/to/avatar1.jpg",
    },
    {
        rating: 5,
        title: "Everything simple",
        text: "Mus etiam et vestibulum venenatis viverra ut. Elit morbi bibendum ullamcorper augue faucibus",
        name: "Kristin Hester",
        role: "Happy Client",
        avatar: "/path/to/avatar2.jpg",
    },
    {
        rating: 5,
        title: "Awesome, thank you!",
        text: "Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis viverra ut. Elit morbi bibendum ullamcorper augue faucibus. Nulla et tempor montes",
        name: "Zion Cisneros",
        role: "Happy Client",
        avatar: "/path/to/avatar3.jpg",
    },
];

const Testimonials = () => {
    return (
        <div className="bg-blue-50 py-12 px-4">
            <div className="w-[85%] mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">Testimonials from Our Customers</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum id.</p>
            </div>

            <div className="w-[85%] mx-auto grid md:grid-cols-3 gap-6">
                {testimonials.map((t, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-md p-6 text-left">
                        <div className="text-yellow-400 mb-2">
                            {Array.from({ length: t.rating }).map((_, i) => (
                                <span key={i}>★</span>
                            ))}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{t.title}</h3>
                        <p className="text-gray-600 italic mb-4">{t.text}</p>
                        <div className="flex items-center mt-6">
                            <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
                            <div>
                                <p className="font-semibold">{t.name}</p>
                                <p className="text-sm text-gray-500">{t.role}</p>
                            </div>
                            <div className="ml-auto text-red-500 text-2xl">“</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
