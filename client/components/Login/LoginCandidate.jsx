import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginCandidate = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("http://localhost:5000/api/users/login/candidate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Login successful!");
                // You can redirect or set user context here, e.g.:
                // localStorage.setItem("token", data.token);
                // window.location.href = "/dashboard";
            } else {
                setError(data.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        }
    };

    return (
        <div className="py-16">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                <div
                    className="hidden lg:block lg:w-1/2 bg-cover"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
                    }}
                ></div>
                <div className="w-full p-8 lg:w-1/2">
                    <div className="text-2xl font-semibold text-gray-700 text-center">
                        <span className=" font-bold text-3xl tracking-tight text-red-600">Jobhire</span>
                    </div>
                    <p className="text-xl text-black text-center font-bold">Login as Candidate</p>
                    {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none placeholder:text-sm"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your Email"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none placeholder:text-sm"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your Password"
                                required
                            />
                        </div>
                        <div className="mt-8">
                            <button type="submit" className="bg-red-600 text-white font-bold py-2 px-4 w-full rounded hover:bg-red-500">
                                Login
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 flex items-center justify-center space-x-2">
                        <span className="border-b w-full"></span>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                            Don't have an account?&nbsp;
                            <Link to="/register/candidate" className="text-red-600 hover:underline">
                                Register
                            </Link>
                        </span>
                        <span className="border-b w-full"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCandidate;
