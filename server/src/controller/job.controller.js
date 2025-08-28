import Job from "../model/job.model.js";
import { Apply } from "../model/apply.model.js";
import { User } from "../model/user.model.js";
import { getFromCache, setInCache, deleteFromCache } from "../../utils/cache.js";
import mongoose from "mongoose";
// import User from "../model/user.model.js"; // Assuming you'll link jobs to users

// Helper function to parse tags input and convert into an object
const parseTagsInput = (tagsInput) => {
    if (!tagsInput) {
        return {}; // Return empty object for falsy input
    }

    let processedTags = [];

    if (typeof tagsInput === "string") {
        try {
            // Attempt to parse the string as JSON
            const parsed = JSON.parse(tagsInput);
            processedTags = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            // If JSON.parse fails, assume comma-separated values
            processedTags = tagsInput.split(",");
        }
    } else if (Array.isArray(tagsInput)) {
        processedTags = tagsInput;
    } else {
        processedTags = [tagsInput];
    }

    // Final cleanup: ensure all tags are strings, trimmed, and non-empty,
    // then convert the array to an object where the key/value are the tag.
    const tagsObject = {};
    processedTags
        .map((tag) => String(tag).trim())
        .filter((tag) => tag !== "")
        .forEach((tag) => {
            tagsObject[tag] = tag;
        });
    return tagsObject;
};

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     description: Create a new job posting
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer
 *               company:
 *                 type: string
 *                 example: Tech Corp
 *               jobType:
 *                 type: string
 *                 enum: [Full Time, Part Time, Contract, Internship, Remote]
 *               location:
 *                 type: string
 *                 example: New York
 *               jobDescription:
 *                 type: string
 *                 example: Develop amazing software
 *             required:
 *               - title
 *               - company
 *               - jobType
 *               - location
 *               - jobDescription
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
// Create a new job
export const createJob = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['title', 'company', 'jobType', 'location', 'jobDescription'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    status: false,
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
                });
            }
        }
        
        // Validate job type
        const validJobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Remote"];
        if (!validJobTypes.includes(req.body.jobType)) {
            return res.status(400).json({
                status: false,
                message: "Invalid job type",
            });
        }
        
        // Validate experience format (if provided)
        if (req.body.experience && !/^\d+\s*(?:Year|Years|yr|yrs)$/i.test(req.body.experience)) {
            return res.status(400).json({
                status: false,
                message: "Experience must be in format 'X Year(s)' or 'X yr(s)'",
            });
        }
        
        // Validate openings (if provided)
        if (req.body.openings && (isNaN(req.body.openings) || req.body.openings <= 0)) {
            return res.status(400).json({
                status: false,
                message: "Openings must be a positive number",
            });
        }
        
        // Validate applicationEnds (if provided)
        if (req.body.applicationEnds) {
            const applicationEndDate = new Date(req.body.applicationEnds);
            if (isNaN(applicationEndDate.getTime())) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid application end date format",
                });
            }
            
            if (applicationEndDate < new Date()) {
                return res.status(400).json({
                    status: false,
                    message: "Application end date must be in the future",
                });
            }
        }

        // postedBy from token
        const recruiterId = req.user?.id;
        const newJobData = { ...req.body };
        if (recruiterId) {
            newJobData.postedBy = recruiterId;
        }

        // Process tags using the helper function
        newJobData.tags = parseTagsInput(newJobData.tags);

        const newJob = new Job(newJobData);
        await newJob.save();
        
        // Clear the jobs cache when a new job is created
        await deleteFromCache('all_jobs');
        
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Error creating job", error: error.message });
    }
};

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Retrieve all job postings with optional filtering and pagination
 *     responses:
 *       200:
 *         description: A list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
// Get all jobs (with optional filtering/pagination)
export const getAllJobs = async (req, res) => {
    try {
        // Check if jobs are cached
        const cachedJobs = await getFromCache('all_jobs');
        if (cachedJobs) {
            return res.status(200).json(cachedJobs);
        }
        
        // TODO: Implement pagination, filtering (by tags, location, type, etc.), and sorting
        const jobs = await Job.find().populate("postedBy", "companyName email"); // Example of populating recruiter info
        
        // Cache jobs for 5 minutes
        await setInCache('all_jobs', jobs, 300);
        
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     description: Retrieve a specific job posting by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the job to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A job object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid job ID format
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
// Get a single job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        // Check if job is cached
        const cacheKey = `job_${jobId}`;
        const cachedJob = await getFromCache(cacheKey);
        if (cachedJob) {
            return res.status(200).json(cachedJob);
        }
        
        const job = await Job.findById(jobId).populate("postedBy", "companyName email");
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        // Cache job for 10 minutes
        await setInCache(cacheKey, job, 600);
        
        res.status(200).json(job);
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid job ID format" });
        }
        res.status(500).json({ message: "Error fetching job", error: error.message });
    }
};

// Update a job by ID
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        // TODO: Add authorization: ensure only the recruiter who posted the job can update it
        // const recruiterId = req.user.id;
        // const jobToUpdate = await Job.findById(jobId);
        // if (!jobToUpdate) {
        //     return res.status(404).json({ message: "Job not found" });
        // }
        // if (jobToUpdate.postedBy.toString() !== recruiterId) {
        //     return res.status(403).json({ message: "User not authorized to update this job" });
        // }

        // Validate job type (if provided)
        if (req.body.jobType) {
            const validJobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Remote"];
            if (!validJobTypes.includes(req.body.jobType)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid job type",
                });
            }
        }
        
        // Validate experience format (if provided)
        if (req.body.experience && !/^\d+\s*(?:Year|Years|yr|yrs)$/i.test(req.body.experience)) {
            return res.status(400).json({
                status: false,
                message: "Experience must be in format 'X Year(s)' or 'X yr(s)'",
            });
        }
        
        // Validate openings (if provided)
        if (req.body.openings && (isNaN(req.body.openings) || req.body.openings <= 0)) {
            return res.status(400).json({
                status: false,
                message: "Openings must be a positive number",
            });
        }
        
        // Validate applicationEnds (if provided)
        if (req.body.applicationEnds) {
            const applicationEndDate = new Date(req.body.applicationEnds);
            if (isNaN(applicationEndDate.getTime())) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid application end date format",
                });
            }
            
            if (applicationEndDate < new Date()) {
                return res.status(400).json({
                    status: false,
                    message: "Application end date must be in the future",
                });
            }
        }

        const updateData = { ...req.body };

        // Process tags for update using the helper function
        if (updateData.hasOwnProperty("tags")) {
            updateData.tags = parseTagsInput(updateData.tags);
        }

        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true, runValidators: true });
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found for update" });
        }
        
        // Clear the jobs cache when a job is updated
        await deleteFromCache('all_jobs');
        
        res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid job ID format" });
        }
        res.status(500).json({ message: "Error updating job", error: error.message });
    }
};

// Delete a job by ID
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        // TODO: Add authorization: ensure only the recruiter who posted the job can delete it
        // const recruiterId = req.user.id;
        // const jobToDelete = await Job.findById(jobId);
        // if (!jobToDelete) {
        //     return res.status(404).json({ message: "Job not found" });
        // }
        // if (jobToDelete.postedBy.toString() !== recruiterId) {
        //     return res.status(403).json({ message: "User not authorized to delete this job" });
        // }

        const deletedJob = await Job.findByIdAndDelete(jobId);
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found for deletion" });
        }
        
        // Clear the jobs cache when a job is deleted
        await deleteFromCache('all_jobs');
        
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid job ID format" });
        }
        res.status(500).json({ message: "Error deleting job", error: error.message });
    }
};

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     summary: Apply to a job
 *     description: Submit an application for a specific job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the job to apply to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 60f7b0f0f0f0f0f0f0f0f0f0
 *             required:
 *               - userId
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error or user already applied
 *       404:
 *         description: Job or user not found
 *       500:
 *         description: Internal server error
 */
// Apply to a job
export const applyToJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { userId } = req.body;
        
        // Validate required fields
        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "User ID is required",
            });
        }
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid user ID format",
            });
        }
        
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid job ID format",
            });
        }
        
        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                status: false,
                message: "Job not found",
            });
        }
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }
        
        // Check if user has already applied to this job
        const existingApplication = await Apply.findOne({ user: userId, job: jobId });
        if (existingApplication) {
            return res.status(400).json({
                status: false,
                message: "You have already applied to this job",
            });
        }
        
        // Create application
        const application = new Apply({
            user: userId,
            job: jobId,
            status: "applied",
        });
        
        await application.save();
        
        res.status(201).json({
            status: true,
            message: "Application submitted successfully",
            data: application,
        });
    } catch (error) {
        console.error("Error applying to job:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid job ID format" });
        }
        res.status(500).json({ message: "Error applying to job", error: error.message });
    }
};

// TODO: Add more specific controllers if needed, e.g.:
// - getJobsByRecruiter
// - searchJobs (more advanced than basic filtering in getAllJobs)
