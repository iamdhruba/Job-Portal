import React from "react";
import Sidebar from "../Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Briefcase, CalendarCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [apps, setApps] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apply/getallapplies`);
        const data = await res.json();
        const mine = data.filter(a => a.candidateId === user?.id || a.user === user?.id || a.userId === user?.id);
        setApps(mine);
      } catch (_) { /* ignore for now */ }
      finally { setLoading(false); }
    };
    load();
  }, [user?.id]);

  const kpis = {
    applied: apps.length,
    interviews: apps.filter(a => a.status === 'interview' || a.status === 'reviewed').length,
    views: 0, // placeholder without a tracking system
  };

  // Build last 4 weeks chart data
  const chartData = (() => {
    const weeks = ["Week 1","Week 2","Week 3","Week 4"];
    const now = new Date();
    const byWeek = [0,0,0,0];
    apps.forEach(a => {
      const d = new Date(a.appliedDate || a.createdAt || now);
      const diffDays = Math.floor((now - d) / (1000*60*60*24));
      const index = Math.min(3, Math.max(0, Math.floor(diffDays / 7)));
      byWeek[3-index] += 1; // recent week at end
    });
    return weeks.map((name, i) => ({ name, applications: byWeek[i] }));
  })();

  const location = useLocation();
  const isRoot = location.pathname === '/dashboard/candidate';

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar userType="candidate" className="w-64" />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {isRoot && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { id: 1, title: "Jobs Applied", value: kpis.applied, icon: Briefcase, gradient: "from-orange-500 to-rose-500" },
                { id: 2, title: "Interviews Scheduled", value: kpis.interviews, icon: CalendarCheck, gradient: "from-indigo-500 to-blue-500" },
                { id: 3, title: "Profile Views", value: kpis.views, icon: Users, gradient: "from-emerald-500 to-teal-500" },
              ].map((stat) => (
                <motion.div key={stat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
                  <div className={`relative overflow-hidden rounded-xl text-white shadow-soft bg-gradient-to-r ${stat.gradient}`}>
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-white/10" />
                    <div className="relative p-5 flex items-center justify-between">
                      <div>
                        <div className="text-sm/relaxed opacity-90">{stat.title}</div>
                        <div className="mt-1 text-3xl font-semibold">{loading ? '—' : stat.value}</div>
                      </div>
                      <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        {React.createElement(stat.icon, { className: "h-5 w-5 text-white" })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Application Graph */}
            <Card className="mb-6 shadow-sm ring-1 ring-gray-100">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Applications Over Time</CardTitle>
                  <div className="text-xs text-muted-foreground">Last 4 weeks</div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Nested Routes */}
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;
