import React from 'react';
import Sidebar from '../Sidebar';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, Users, CalendarCheck, PlusCircle, FileText, ListChecks } from 'lucide-react';
import jobService from '@/services/jobService';

const statsData = [
  { label: 'Jobs Posted', value: 12, icon: Briefcase },
  { label: 'Applications Received', value: 58, icon: Users },
  { label: 'Open Positions', value: 5, icon: CalendarCheck },
];

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isRoot = location.pathname === '/dashboard/recruiter';
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await jobService.listAll();
        const mine = all.filter(j => j.postedBy && (j.postedBy === user?.id || j.postedBy?._id === user?.id));
        setJobs(mine);
      } finally { setLoading(false); }
    };
    load();
  }, [user?.id]);

  const kpis = {
    posted: jobs.length,
    open: jobs.filter(j => !j.applicationEnds || new Date(j.applicationEnds) > new Date()).length,
    applications: 0, // Placeholder unless you wire applications by job
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar userType="recruiter" />

      <main className="flex-1"><div className="mx-auto max-w-6xl container-px py-6 lg:py-8">
        {isRoot && (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Welcome, {user?.name || 'Recruiter'}</h1>
              <p className="text-sm text-muted-foreground">Monitor your hiring performance and manage postings.</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Jobs Posted', value: kpis.posted, icon: Briefcase },
                { label: 'Open Positions', value: kpis.open, icon: CalendarCheck },
                { label: 'Applications Received', value: kpis.applications, icon: Users },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.03 }}
                  className="shadow-soft rounded-xl bg-white"
                >
                  <Card>
                    <CardHeader className="p-4 flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <stat.icon className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 text-2xl font-bold">{stat.value}</CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Link to="/dashboard/recruiter/post-job" className="group">
                <div className="rounded-xl bg-primary text-primary-foreground p-4 shadow-soft flex items-center justify-between transition-transform group-hover:-translate-y-0.5">
                  <div>
                    <div className="text-sm opacity-90">Create</div>
                    <div className="text-lg font-semibold">Post a Job</div>
                  </div>
                  <PlusCircle className="h-6 w-6" />
                </div>
              </Link>
              <Link to="/dashboard/recruiter/applications" className="group">
                <div className="rounded-xl bg-white p-4 ring-1 ring-gray-200 shadow-sm flex items-center justify-between transition-transform group-hover:-translate-y-0.5">
                  <div>
                    <div className="text-sm text-muted-foreground">Review</div>
                    <div className="text-lg font-semibold">Applications</div>
                  </div>
                  <FileText className="h-6 w-6 text-gray-700" />
                </div>
              </Link>
              <Link to="/dashboard/recruiter/posted-jobs" className="group">
                <div className="rounded-xl bg-white p-4 ring-1 ring-gray-200 shadow-sm flex items-center justify-between transition-transform group-hover:-translate-y-0.5">
                  <div>
                    <div className="text-sm text-muted-foreground">Manage</div>
                    <div className="text-lg font-semibold">Posted Jobs</div>
                  </div>
                  <ListChecks className="h-6 w-6 text-gray-700" />
                </div>
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Recent Jobs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-4 text-sm text-muted-foreground">Loading...</div>
                  ) : jobs.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No jobs posted yet.</div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {jobs.slice(0, 5).map((job) => (
                        <li key={job._id} className="p-4 flex items-center justify-between">
                          <span className="truncate pr-4">{job.title}</span>
                          <span className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Posted Jobs Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-4 text-sm text-muted-foreground">Loading...</div>
                  ) : jobs.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No jobs to show.</div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {jobs.slice(0, 5).map((job) => (
                        <li key={job._id} className="p-4 flex items-center justify-between">
                          <span className="truncate pr-4">{job.title}</span>
                          <span className="text-xs rounded-full bg-green-100 text-green-800 px-2 py-0.5">{(!job.applicationEnds || new Date(job.applicationEnds) > new Date()) ? 'Open' : 'Closed'}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Nested routes */}
        <div className="mt-8">
          <Outlet />
        </div>
      </div></main>
    </div>
  );
};

export default RecruiterDashboard;
