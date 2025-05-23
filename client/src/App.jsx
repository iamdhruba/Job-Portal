import React, { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import LandingPage from "../components/LandingPage/LandingPage";
import Routing from "../routes/Routing";
import UserType from "../components/UserType/UserType";
import ApplyNow from "../components/ApplyNow/ApplyNow";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";

const App = () => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <Navbar onLoginClick={() => setShowLogin(true)} />
            <LandingPage />
            <UserType />
            <ApplyNow />
            {/* <Login /> */}
            {/* <Routing /> */}
            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="relative bg-none shadow-lg w-full max-w-4xl p-0">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowLogin(false)}>
                            &times;
                        </button>
                        <Login />
                    </div>
                </div>
            )}
            <Register />
        </>
    );
};

export default App;
