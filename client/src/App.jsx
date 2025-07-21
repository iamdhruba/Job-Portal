import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Copyright from "../components/Copyright/Copyright";
import Routing from "../routes/Routing";
import AdminDashboard from "../components/Dashboard/Admin/AdminDashboard";
import CandidateDashboard from "../components/Dashboard/Candidate/CandidateDashboard";
import RecruiterDashboard from "../components/Dashboard/Recruiter/RecruiterDashboard";

const App = () => {
    return (
        <>
            <AdminDashboard />
            <CandidateDashboard />
            <RecruiterDashboard />
            <Navbar />
            <main>
                <Routing />
            </main>
            <Footer />
            <Copyright />
        </>
    );
};

export default App;
