import express from "express";
import { applicationRateLimiterMiddleware } from "../middlewares/rateLimiter.js";

const applyRouter = express.Router();

import { createApply, getAllApplies, getApplyById, updateApply, deleteApply } from "../controller/apply.controller.js";

// Public routes
applyRouter.get("/getallapplies", getAllApplies); // Get all applications (e.g., for recruiters to view)
applyRouter.get("/getapplybyid/:id", getApplyById); // Get a specific application by ID
// Recruiter routes (assuming authentication and role check)
applyRouter.post("/", applicationRateLimiterMiddleware, createApply); // Create a new application
applyRouter.put("/:id", updateApply); // Update an application
applyRouter.delete("/:id", deleteApply); // Delete an application

export default applyRouter;
