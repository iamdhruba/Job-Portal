import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, ClipboardList, LineChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Users", value: 1245, icon: Users, color: "bg-blue-500" },
  { label: "Jobs Posted", value: 342, icon: Briefcase, color: "bg-green-500" },
  { label: "Applications", value: 1210, icon: ClipboardList, color: "bg-yellow-500" },
  { label: "Active Recruiters", value: 89, icon: LineChart, color: "bg-purple-500" },
];

const chartData = [
  { month: "Jan", jobs: 40, applications: 240 },
  { month: "Feb", jobs: 30, applications: 221 },
  { month: "Mar", jobs: 20, applications: 229 },
  { month: "Apr", jobs: 27, applications: 200 },
  { month: "May", jobs: 18, applications: 218 },
  { month: "Jun", jobs: 23, applications: 250 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-slate-50 to-white">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ scale: 1.05 }}>
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <div className={`p-2 rounded-full text-white ${s.color}`}>
                  <s.icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <Badge variant="secondary">+12% growth</Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Jobs vs Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
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
