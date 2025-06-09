import React from "react";

const Card = () => {
    return (
        <div className="w-[90%] max-w-7xl mx-auto my-10 rounded-2xl overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-2 bg-black text-white">
            {/* Left Section */}
            <div className="p-20 flex flex-col justify-center bg-black bg-opacity-80">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    Create A Better <br /> Future For Yourself
                </h2>
                <p className="mb-10 text-gray-300">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id nesciunt delectus nemo quo aperiam enim cupiditate fugit quae esse architecto!</p>
                <button className="w-fit px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition">Search Job</button>
            </div>

            {/* Right Section with Image */}
            <div className="relative h-full w-full">
                <img
                    src="https://imgs.search.brave.com/jfRp5H9ZMpD9eto3oFqGxI4EUYb1dTmNd8xVlnlitCY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9FbXBs/b3ltZW50LVBORy1J/bWFnZXMucG5n"
                    alt="Professional people"
                    className="w-full h-full object-cover"
                />
                {/* Optional: Blur Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
            </div>
        </div>
    );
};

export default Card;
