import express from "express";
import { verifyToken } from "../../utils/jwtUtils.js";
import { User } from "../model/user.model.js";
import Job from "../model/job.model.js";
import { Apply } from "../model/apply.model.js";

const router = express.Router();

// Simple isAdmin middleware
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Forbidden: Admin only" });
}

// GET /api/admin/stats -> { users, jobs, applications, recruiters }
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const [users, jobs, applications, recruiters] = await Promise.all([
      User.countDocuments({}),
      Job.countDocuments({}),
      Apply.countDocuments({}),
      User.countDocuments({ role: "recruiter" }),
    ]);

    // Last 6 months jobs and applications
    const since = new Date();
    since.setMonth(since.getMonth() - 5);
    since.setDate(1);

    const jobsAgg = await Job.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const appsAgg = await Apply.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Normalize to [{ month, jobs, applications }]
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({ key, month: d.toLocaleString("default", { month: "short" }) });
    }

    const jobMap = Object.fromEntries(jobsAgg.map(j => [j._id, j.count]));
    const appMap = Object.fromEntries(appsAgg.map(a => [a._id, a.count]));

    const chart = months.map(m => ({ month: m.month, jobs: jobMap[m.key] || 0, applications: appMap[m.key] || 0 }));

    res.json({ users, jobs, applications, recruiters, chart });
  } catch (e) {
    res.status(500).json({ message: "Failed to load stats" });
  }
});

export default router;
