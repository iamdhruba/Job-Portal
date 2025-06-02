import express from "express";
import { getJobSeekerApplicationsController, getRecruiterJobApplicationsController, updateApplicationStatusController } from "../controller/status.controller.js";
import { isAuthenticated, isRecruiter, isJobSeeker } from "../middlewares/statusauth.middleware.js";

const router = express.Router();

router.get("/job-seeker", getJobSeekerApplicationsController);
router.get("/recruiter/:jobId", getRecruiterJobApplicationsController);
router.put("/:applicationId/status", updateApplicationStatusController);

export default router;
