import React from "react";
import { Routes, Route } from "react-router-dom";
import Jobs from "../components/Jobs/Jobs";
import Internship from "../components/Internship/Internship";
import About from "../components/AboutUs/About";
import LandingPage from "../components/LandingPage/LandingPage";
import ContactUs from "../components/ContactUs/ContactUs";
import RegisterCandidate from "../components/Register/RegisterCandidate"; // <-- Add this
import RegisterRecruiter from "../components/Register/RegisterRecruiter"; // <-- Add this
import LoginCandidate from "../components/Login/LoginCandidate";
import LoginRecruiter from "../components/Login/LoginRecruiter";
import CreateJob from "../components/Job/CreateJob";
import AdminDashboard from "../components/Dashboard/Admin/AdminDashboard";
import RecruiterDashboard from "../components/Dashboard/Recruiter/RecruiterDashboard";
import CandidateDashboard from "../components/Dashboard/Candidate/CandidateDashboard";
import ManageUsers from "../components/Dashboard/Admin/ManageUsers";
import ManageJobs from "../components/Dashboard/Admin/ManageJobs";
import PostJob from "../components/Dashboard/Recruiter/PostJob";
import PostedJobs from "../components/Dashboard/Recruiter/PostedJobs";
import Applications from "../components/Dashboard/Recruiter/Applications";
import MyApplications from "../components/Dashboard/Candidate/MyApplications";
import MyProfile from "../components/Dashboard/Candidate/MyProfile";

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/post-job" element={<CreateJob />} />
            <Route path="/internship" element={<Internship />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login/recruiter" element={<LoginRecruiter />} />
            <Route path="/login/candidate" element={<LoginCandidate />} />
            <Route path="/register/recruiter" element={<RegisterRecruiter />} />
            <Route path="/register/candidate" element={<RegisterCandidate />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />}>
                <Route path="users" element={<ManageUsers />} />
                <Route path="jobs" element={<ManageJobs />} />
            </Route>
            <Route path="/dashboard/recruiter" element={<RecruiterDashboard />}>
                <Route path="post-job" element={<PostJob />} />
                <Route path="posted-jobs" element={<PostedJobs />} />
                <Route path="applications" element={<Applications />} />
            </Route>
            <Route path="/dashboard/candidate" element={<CandidateDashboard />}>
                <Route path="applications" element={<MyApplications />} />
                <Route path="profile" element={<MyProfile />} />
            </Route>
        </Routes>
    );
};

export default Routing;
