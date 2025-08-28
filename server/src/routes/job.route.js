import express from "express";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, applyToJob } from "../controller/job.controller.js";
import { verifyToken } from "../../utils/jwtUtils.js";
import { isRecruiter } from "../middlewares/statusauth.middleware.js";

const jobRouter = express.Router();

// Public routes
jobRouter.get("/", getAllJobs); // Get all jobs (e.g., for candidates to view)
jobRouter.get("/:id", getJobById); // Get a specific job by ID

// Recruiter routes
jobRouter.post("/", verifyToken, isRecruiter, createJob);
jobRouter.put("/:id", verifyToken, isRecruiter, updateJob);
jobRouter.delete("/:id", verifyToken, isRecruiter, deleteJob);
jobRouter.post("/:id/apply", applyToJob);

export default jobRouter;
