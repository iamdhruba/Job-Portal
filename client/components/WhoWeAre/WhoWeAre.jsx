import React from "react";

const WhoWeAre = () => {
    return (
        <section className="px-6 py-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Content */}
                <div>
                    <h4 className="text-red-600 font-semibold uppercase tracking-wide mb-2">Who We Are</h4>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        We're a highly skilled and
                        <br /> professionals team.
                    </h2>
                    <p className="text-gray-600 mb-4">
                        ClickJob is a vibrant platform dedicated to empowering and guiding interns on their journey towards professional success. We understand the pivotal role internships play in
                        shaping careers, and we are committed to providing comprehensive resources and support to interns across diverse fields and industries.
                    </p>
                    <p className="text-gray-600">
                        We believe in connecting talent with opportunity, ensuring that every individual finds meaningful work, and every employer discovers exceptional talent. With a passion for
                        excellence, we strive to make the job market accessible, transparent, and rewarding for all. Join us on this journey as we shape the future of employment.
                    </p>
                </div>

                {/* Right Content - Images Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <img src="../../assests/jobsearch.jpeg" alt="Team discussion" className="rounded-lg w-full h-52 object-cover" />
                    <img src="../../assests/work.jpg" alt="Meeting room" className="rounded-lg w-full h-52 object-cover" />
                    <img src="../../assests/team.jpg" alt="Laptop work" className="rounded-lg w-full h-52 object-cover col-span-2" />
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;
