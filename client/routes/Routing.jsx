import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Jobs from "../components/Jobs/Jobs";
import Internship from "../components/Internship/Internship";
import About from "../components/AboutUs/About";
import LandingPage from "../components/LandingPage/LandingPage";
import ContactUs from "../components/ContactUs/ContactUs";
import RegisterCandidate from "../components/Register/RegisterCandidate";
import RegisterRecruiter from "../components/Register/RegisterRecruiter";
import LoginCandidate from "../components/Login/LoginCandidate";
import LoginRecruiter from "../components/Login/LoginRecruiter";
import LoginAdmin from "../components/Login/LoginAdmin";
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
import Settings from "../components/Dashboard/Candidate/Settings";

// Import the protected route components from a shared module to avoid circular deps
import { ProtectedRoute, RoleBasedRoute } from "../src/routes/Guards.jsx";

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const Routing = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Page><LandingPage /></Page>} />
                <Route path="/jobs" element={<Page><Jobs /></Page>} />
                <Route path="/post-job" element={<Page><CreateJob /></Page>} />
                <Route path="/internship" element={<Page><Internship /></Page>} />
                <Route path="/about" element={<Page><About /></Page>} />
                <Route path="/contact" element={<Page><ContactUs /></Page>} />
                <Route path="/login/recruiter" element={<Page><LoginRecruiter /></Page>} />
                <Route path="/login/candidate" element={<Page><LoginCandidate /></Page>} />
                <Route path="/login/admin" element={<Page><LoginAdmin /></Page>} />
                <Route path="/register/recruiter" element={<Page><RegisterRecruiter /></Page>} />
                <Route path="/register/candidate" element={<Page><RegisterCandidate /></Page>} />
                <Route path="/dashboard/admin" element={
                    <RoleBasedRoute allowedRoles={["admin"]}>
                        <Page><AdminDashboard /></Page>
                    </RoleBasedRoute>
                }>
                    <Route path="users" element={<Page><ManageUsers /></Page>} />
                    <Route path="jobs" element={<Page><ManageJobs /></Page>} />
                </Route>
                <Route path="/dashboard/recruiter" element={
                    <RoleBasedRoute allowedRoles={["recruiter"]}>
                        <Page><RecruiterDashboard /></Page>
                    </RoleBasedRoute>
                }>
                    <Route path="post-job" element={<Page><PostJob /></Page>} />
                    <Route path="posted-jobs" element={<Page><PostedJobs /></Page>} />
                    <Route path="applications" element={<Page><Applications /></Page>} />
                    <Route path="profile" element={<Page><MyProfile /></Page>} />
                    <Route path="settings" element={<Page><Settings /></Page>} />
                </Route>
                <Route path="/dashboard/candidate" element={
                    <RoleBasedRoute allowedRoles={["candidate"]}>
                        <Page><CandidateDashboard /></Page>
                    </RoleBasedRoute>
                }>
                    <Route path="applications" element={<Page><MyApplications /></Page>} />
                    <Route path="profile" element={<Page><MyProfile /></Page>} />
                    <Route path="settings" element={<Page><Settings /></Page>} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

export default Routing;
