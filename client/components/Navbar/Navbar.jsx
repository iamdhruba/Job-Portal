import React from "react";

const Navbar = () => {
    return (
        <nav className=" w-[85%] mx-auto sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm bg-white border-b border-gray-100">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-yellow-300 to-green-500 shadow-md" />
                <span className="font-bold text-3xl tracking-tight text-gray-800">Jobhire</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6 text-md text-gray-700 font-medium">
                <a href="#" className="hover:text-yellow-500 transition-colors">
                    Home
                </a>
                <a href="/Internship" className="hover:text-yellow-500 transition-colors">
                    Internship
                </a>
                <a href="/jobs" className="hover:text-yellow-500 transition-colors">
                    Jobs
                </a>
                <a href="/about" className="hover:text-yellow-500 transition-colors">
                    About us
                </a>
                <div className="relative group">
                    <button className="hover:text-yellow-500 flex items-center space-x-1 transition-colors">
                        <span>Event</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute left-0 hidden group-hover:block bg-white shadow-lg mt-2 rounded-md min-w-[120px] transition-all duration-200">
                        <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-50 transition-colors">
                            Page 1
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm hover:bg-yellow-50 transition-colors">
                            Page 2
                        </a>
                    </div>
                </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
                <button className="px-4 py-1 border border-black rounded-full text-md font-medium hover:bg-gray-100 transition-colors">Login</button>
                <button className="px-4 py-1 bg-yellow-300 rounded-full text-md font-medium hover:bg-yellow-400 shadow transition-colors">Register</button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden flex items-center p-2 rounded hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </nav>
    );
};

export default Navbar;
