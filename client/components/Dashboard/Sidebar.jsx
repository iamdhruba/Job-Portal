import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userType }) => {
  const adminLinks = (
    <>
      <Link to="/dashboard/admin/users" className="block py-2 px-4 hover:bg-gray-700">Manage Users</Link>
      <Link to="/dashboard/admin/jobs" className="block py-2 px-4 hover:bg-gray-700">Manage Jobs</Link>
    </>
  );

  const recruiterLinks = (
    <>
      <Link to="/dashboard/recruiter/post-job" className="block py-2 px-4 hover:bg-gray-700">Post a Job</Link>
      <Link to="/dashboard/recruiter/posted-jobs" className="block py-2 px-4 hover:bg-gray-700">Posted Jobs</Link>
      <Link to="/dashboard/recruiter/applications" className="block py-2 px-4 hover:bg-gray-700">Applications</Link>
    </>
  );

  const candidateLinks = (
    <>
      <Link to="/dashboard/candidate/applications" className="block py-2 px-4 hover:bg-gray-700">My Applications</Link>
      <Link to="/dashboard/candidate/profile" className="block py-2 px-4 hover:bg-gray-700">My Profile</Link>
    </>
  );

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <nav>
        {userType === 'admin' && adminLinks}
        {userType === 'recruiter' && recruiterLinks}
        {userType === 'candidate' && candidateLinks}
      </nav>
    </div>
  );
};

export default Sidebar;