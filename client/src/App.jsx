import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import LandingPage from "../components/LandingPage/LandingPage";
import UserType from "../components/UserType/UserType";
import RegisterCandidate from "../components/Register/RegisterCandidate";
import RegisterRecruiter from "../components/Register/RegisterRecruiter";
import LoginCandidate from "../components/Login/LoginCandidate";
import LoginRecruiter from "../components/Login/LoginRecruiter";
import Jobs from "../components/Jobs/Jobs";
import JobForm from "../components/JobPostingForm/CreateJobForm";
import Copyright from "../components/Copyright/Copyright";
import Footer from "../components/Footer/Footer";
import Card from "../components/Card/Card";
import CompanyStats from "../components/CompanyStats/CompanyStats";
import HowWeWork from "../components/HowWeWork/HowWeWork";
import FAQs from "../components/FAQs/FAQs";
import Testimonials from "../components/Testimonials/Testimonials";
import JobSeekerDashboard from "../components/JobSeekerDashboard/JobSeekerDashboard";
import Dashboard from "../components/JobSeekerDashboard/JobSeekerDashboard";

import WhoWeAre from "../components/WhoWeAre/WhoWeAre";
import StatsSection from "../components/AboutUs/StatsSection";

const App = () => {
    const [showLogin, setShowLogin] = useState(null); // "candidate" or "recruiter" or null
    const [showRegister, setShowRegister] = useState(null); // "candidate" or "recruiter" or null

    return (
        <>
            <Navbar
                onLoginCandidateClick={() => setShowLogin("candidate")}
                onLoginRecruiterClick={() => setShowLogin("recruiter")}
                onCandidateClick={() => setShowRegister("candidate")}
                onRecruiterClick={() => setShowRegister("recruiter")}
            />
            <LandingPage />
            <UserType />
            {/* <JobForm /> */}

            {/* <Jobs /> */}

            {showLogin && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="relative bg-white shadow-lg w-full max-w-4xl p-0 rounded">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowLogin(null)}>
                            &times;
                        </button>
                        {showLogin === "candidate" && <LoginCandidate />}
                        {showLogin === "recruiter" && <LoginRecruiter />}
                    </div>
                </div>
            )}

            {showRegister && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="relative bg-white shadow-lg w-full max-w-4xl p-0 rounded">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowRegister(null)}>
                            &times;
                        </button>
                        {showRegister === "candidate" && <RegisterCandidate />}
                        {showRegister === "recruiter" && <RegisterRecruiter />}
                    </div>
                </div>
            )}
            <JobSeekerDashboard />
            <Dashboard />
            <HowWeWork />
            <FAQs />
            <CompanyStats />
            <Card />
            <WhoWeAre />
            <StatsSection />
            <Testimonials />
            <Footer />
            <Copyright />
        </>
    );
};

export default App;
