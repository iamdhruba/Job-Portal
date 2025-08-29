import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, ClipboardList, LineChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const base = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem('token');
        const res = await fetch(`${base}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        setStats(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = stats ? [
    { label: "Users", value: stats.users, icon: Users, color: "bg-blue-500" },
    { label: "Jobs Posted", value: stats.jobs, icon: Briefcase, color: "bg-green-500" },
    { label: "Applications", value: stats.applications, icon: ClipboardList, color: "bg-yellow-500" },
    { label: "Active Recruiters", value: stats.recruiters, icon: LineChart, color: "bg-purple-500" },
  ] : [];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="text-xs text-gray-500">{new Date().toLocaleString()}</div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 text-sm border border-red-200">{error}</div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-md" />
          ))
        ) : (
          cards.map((s, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }}>
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                  <div className={`p-2 rounded-full text-white ${s.color}`}>
                    <s.icon className="size-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <Badge variant="secondary">Updated</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Chart */}
      <div className="mt-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Jobs vs Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.chart || []}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="applications" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
