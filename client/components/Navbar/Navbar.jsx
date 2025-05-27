import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLoginCandidateClick, onLoginRecruiterClick, onCandidateClick, onRecruiterClick }) => {
    const [registerOpen, setRegisterOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const registerRef = useRef(null);
    const loginRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (registerRef.current && !registerRef.current.contains(event.target)) {
                setRegisterOpen(false);
            }
            if (loginRef.current && !loginRef.current.contains(event.target)) {
                setLoginOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="w-[85%] mx-auto sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm bg-white border-b border-gray-100">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-yellow-300 to-green-500 shadow-md" />
                <span className="font-bold text-3xl tracking-tight text-gray-800">Jobhire</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6 text-md text-gray-700 font-medium">
                <Link to="/" className="hover:text-yellow-500 transition-colors">
                    Home
                </Link>
                <Link to="/Internship" className="hover:text-yellow-500 transition-colors">
                    Internship
                </Link>
                <Link to="/jobs" className="hover:text-yellow-500 transition-colors">
                    Jobs
                </Link>
                <Link to="/about" className="hover:text-yellow-500 transition-colors">
                    About us
                </Link>
                <Link to="/post-job" className="hover:text-yellow-500 transition-colors">
                    Post a Job
                </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 relative">
                {/* Login Dropdown */}
                <div className="relative" ref={loginRef}>
                    <button
                        className="px-4 py-1 bg-yellow-300 rounded-full text-md font-medium hover:bg-yellow-400 shadow transition-colors flex items-center space-x-1"
                        onClick={() => setLoginOpen((prev) => !prev)}
                        type="button"
                    >
                        Login
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {loginOpen && (
                        <div className="absolute right-0 bg-white shadow-lg mt-2 rounded-md min-w-[180px] transition-all duration-200 z-50">
                            <button
                                type="button"
                                onClick={() => {
                                    setLoginOpen(false);
                                    if (onLoginRecruiterClick) onLoginRecruiterClick();
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition-colors text-gray-800"
                            >
                                Login as Recruiter
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoginOpen(false);
                                    if (onLoginCandidateClick) onLoginCandidateClick();
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition-colors text-gray-800"
                            >
                                Login as Candidate
                            </button>
                        </div>
                    )}
                </div>

                {/* Register Dropdown */}
                <div className="relative" ref={registerRef}>
                    <button
                        className="px-4 py-1 bg-yellow-300 rounded-full text-md font-medium hover:bg-yellow-400 shadow transition-colors flex items-center space-x-1"
                        onClick={() => setRegisterOpen((prev) => !prev)}
                        type="button"
                    >
                        Register
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {registerOpen && (
                        <div className="absolute right-0 bg-white shadow-lg mt-2 rounded-md min-w-[180px] transition-all duration-200 z-50">
                            <button
                                type="button"
                                onClick={() => {
                                    setRegisterOpen(false);
                                    if (onRecruiterClick) onRecruiterClick();
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition-colors text-gray-800"
                            >
                                Register as a Recruiter
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setRegisterOpen(false);
                                    if (onCandidateClick) onCandidateClick();
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-yellow-50 transition-colors text-gray-800"
                            >
                                Register as a Candidate
                            </button>
                        </div>
                    )}
                </div>
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
