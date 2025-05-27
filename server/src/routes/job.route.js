import express from "express";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob } from "../controller/job.controller.js";
// import { isAuthenticated, isRecruiter } from "../middlewares/auth.middleware.js"; // Assuming you have auth middleware

const jobRouter = express.Router();

// Public routes
jobRouter.get("/", getAllJobs); // Get all jobs (e.g., for candidates to view)
jobRouter.get("/:id", getJobById); // Get a specific job by ID

// Recruiter routes (assuming authentication and role check)
// TODO: Uncomment and use auth middleware when ready
// jobRouter.post("/", isAuthenticated, isRecruiter, createJob); // Create a new job
// jobRouter.put("/:id", isAuthenticated, isRecruiter, updateJob); // Update a job
// jobRouter.delete("/:id", isAuthenticated, isRecruiter, deleteJob); // Delete a job

// For testing without auth middleware initially:
jobRouter.post("/", createJob);
jobRouter.put("/:id", updateJob);
jobRouter.delete("/:id", deleteJob);

export default jobRouter;
