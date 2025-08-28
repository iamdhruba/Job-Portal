import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";
import logo from "../../assests/clickjob.png";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const Navbar = () => {
    const [registerOpen, setRegisterOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const registerRef = useRef(null);
    const loginRef = useRef(null);
    const userRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const apiBase = import.meta.env.VITE_API_BASE_URL || "";
    const avatarSrc = user?.avatarUrl ? (user.avatarUrl.startsWith("http") ? user.avatarUrl : `${apiBase}${user.avatarUrl}`) : undefined;

    // Theme toggle (light/dark)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (registerRef.current && !registerRef.current.contains(event.target)) {
                setRegisterOpen(false);
            }
            if (loginRef.current && !loginRef.current.contains(event.target)) {
                setLoginOpen(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setUserDropdownOpen(false);
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-gray-200/60">
            <div className="container mx-auto container-px flex items-center justify-between py-3">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="ClickJob" className="h-10 w-auto" />
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link to="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
                    <Link to="/about" className="hover:text-primary transition-colors">About us</Link>
                    {user?.role === "recruiter" && (
                        <Link to="/post-job" className="hover:text-primary transition-colors">Post a Job</Link>
                    )}
                </div>

                {/* Auth + Theme */}
                <div className="flex items-center gap-3 relative">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Toggle theme"
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.7.7a1 1 0 01-1.42 1.42l-.7-.7a1 1 0 010-1.42zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm12.66-4.08a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM17 9a1 1 0 100 2h1a1 1 0 100-2h-1zm-2.78 5.78a1 1 0 010 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7a1 1 0 011.42 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM6.34 14.08a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.293 13.293a8 8 0 11-10.586-10.586A8.001 8.001 0 1017.293 13.293z" />
                            </svg>
                        )}
                    </button>
                    {user ? (
                        // User dropdown when logged in
                        <div className="relative" ref={userRef}>
                            <button
                                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex items-center"
                                onClick={() => setUserDropdownOpen((prev) => !prev)}
                                type="button"
                                aria-haspopup="menu"
                                aria-expanded={userDropdownOpen}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={avatarSrc} alt={user?.name || user?.email} />
                                    <AvatarFallback>{(user?.name || user?.email || 'U').slice(0,1).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {userDropdownOpen && (
                                <div className="absolute right-0 bg-white shadow-lg mt-2 rounded-md min-w-[200px] ring-1 ring-gray-200 z-50">
                                    <Link
                                        to={
                                            user.role === "candidate" ? "/dashboard/candidate" :
                                            user.role === "recruiter" ? "/dashboard/recruiter" :
                                            "/dashboard/admin"
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-800"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-800"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Login Dropdown */}
                            <div className="relative" ref={loginRef}>
                                <button
                                    className="px-4 py-2 rounded-full text-sm font-semibold bg-accent text-accent-foreground hover:brightness-95 shadow-soft transition-colors flex items-center"
                                    onClick={() => setLoginOpen((prev) => !prev)}
                                    type="button"
                                >
                                    Login
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {loginOpen && (
                                    <div className="absolute right-0 bg-white shadow-lg mt-2 rounded-md min-w-[200px] ring-1 ring-gray-200 z-50">
                                        <Link
                                            to="/login/recruiter"
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-800"
                                            onClick={() => setLoginOpen(false)}
                                        >
                                            Login as Recruiter
                                        </Link>
                                        <Link
                                            to="/login/candidate"
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-800"
                                            onClick={() => setLoginOpen(false)}
                                        >
                                            Login as Candidate
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Register Dropdown */}
                            <div className="relative" ref={registerRef}>
                                <button
                                    className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft transition-colors flex items-center"
                                    onClick={() => setRegisterOpen((prev) => !prev)}
                                    type="button"
                                >
                                    Register
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {registerOpen && (
                                    <div className="absolute right-0 bg-white shadow-lg mt-2 rounded-md min-w-[200px] ring-1 ring-gray-200 z-50">
                                        <Link
                                            to="/register/recruiter"
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-800"
                                            onClick={() => setRegisterOpen(false)}
                                        >
                                            Register as a Recruiter
                                        </Link>
                                        <Link
                                            to="/register/candidate"
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-800"
                                            onClick={() => setRegisterOpen(false)}
                                        >
                                            Register as a Candidate
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden flex items-center p-2 rounded hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
