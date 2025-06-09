import React from 'react';

const WhyChooseClickJob = () => {
    return (
        <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12">
                    Why choose <span className="text-red-500">ClickJob</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="flex flex-col items-center text-center space-y-4 px-4">
                        <img
                            src="../../assests/creative-team.png" // Replace with local emoji or SVG if needed
                            alt="Top Talent"
                            className="w-16 h-16"
                        />
                        <h3 className="text-lg font-semibold">Access to Top Talent</h3>
                        <p className="text-gray-600">
                            ClickJob attracts a diverse pool of ambitious and talented interns from leading educational institutions across various disciplines.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col items-center text-center space-y-4 px-4">
                        <img
                            src="../../assests/saving.png" // Change to match hand & coin emoji
                            alt="Cost Effective"
                            className="w-16 h-16"
                        />
                        <h3 className="text-lg font-semibold">Cost-Effective Solutions</h3>
                        <p className="text-gray-600">
                            Hiring interns through ClickJob provides a cost-effective solution for your talent acquisition needs.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col items-center text-center space-y-4 px-4">
                        <img
                            src="../../assests/rocket.png"
                            alt="Brand Visibility"
                            className="w-16 h-16"
                        />
                        <h3 className="text-lg font-semibold">Brand Visibility and Engagement</h3>
                        <p className="text-gray-600">
                            Partnering with ClickJob enhances your brand visibility among the next generation of professionals.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseClickJob;
