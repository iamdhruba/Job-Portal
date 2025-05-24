import React from "react";
import { Routes, Route } from "react-router-dom";
import Jobs from "../components/Jobs/Jobs";
import Internship from "../components/Internship/Internship";
import About from "../components/AboutUs/About";
import LandingPage from "../components/LandingPage/LandingPage";
import ContactUs from "../components/ContactUs/ContactUs";
import RegisterCandidate from "../components/Register/RegisterCandidate"; // <-- Add this
import RegisterRecruiter from "../components/Register/RegisterRecruiter"; // <-- Add this
import LoginRecruiter from "../components/Login/LoginCandidate";
import LoginRecruiter from "../components/Login/LoginRecruiter";

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/internship" element={<Internship />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            {/* <Route path="/login/recruiter" element={<LoginRecruiter />} />
            <Route path="/login/candidate" element={<LoginCandidate />} />
            <Route path="/register/recruiter" element={<RegisterRecruiter />} />
            <Route path="/register/candidate" element={<RegisterCandidate />} /> */}
        </Routes>
    );
};

export default Routing;
