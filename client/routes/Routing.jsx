import React from "react";
import { Routes, Route } from "react-router-dom";
import Jobs from "../components/Jobs/Jobs";
import About from "../components/AboutUs/About";
import LandingPage from "../components/LandingPage/LandingPage";
import ContactUs from "../components/ContactUs/ContactUs";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
};

export default Routing;
