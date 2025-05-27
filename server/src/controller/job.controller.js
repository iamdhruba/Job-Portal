import Job from "../model/job.model.js";
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

// Create a new job
export const createJob = async (req, res) => {
    try {
        // TODO: Add validation for req.body to ensure it matches jobSchema
        // For now, assuming req.user.id contains the ID of the logged-in recruiter
        // const recruiterId = req.user.id; // This needs to come from your auth middleware

        // For testing without auth, you might hardcode or omit postedBy
        const newJobData = { ...req.body };
        // if (recruiterId) {
        //     newJobData.postedBy = recruiterId;
        // }

        // Process tags using the helper function
        newJobData.tags = parseTagsInput(newJobData.tags);

        const newJob = new Job(newJobData);
        await newJob.save();
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Error creating job", error: error.message });
    }
};

// Get all jobs (with optional filtering/pagination)
export const getAllJobs = async (req, res) => {
    try {
        // TODO: Implement pagination, filtering (by tags, location, type, etc.), and sorting
        const jobs = await Job.find().populate("postedBy", "companyName email"); // Example of populating recruiter info
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("postedBy", "companyName email");
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
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
        // TODO: Add validation for req.body
        // TODO: Add authorization: ensure only the recruiter who posted the job can update it
        // const recruiterId = req.user.id;
        // const jobToUpdate = await Job.findById(jobId);
        // if (!jobToUpdate) {
        //     return res.status(404).json({ message: "Job not found" });
        // }
        // if (jobToUpdate.postedBy.toString() !== recruiterId) {
        //     return res.status(403).json({ message: "User not authorized to update this job" });
        // }

        const updateData = { ...req.body };

        // Process tags for update using the helper function
        if (updateData.hasOwnProperty("tags")) {
            updateData.tags = parseTagsInput(updateData.tags);
        }

        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true, runValidators: true });
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found for update" });
        }
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
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid job ID format" });
        }
        res.status(500).json({ message: "Error deleting job", error: error.message });
    }
};

// TODO: Add more specific controllers if needed, e.g.:
// - getJobsByRecruiter
// - searchJobs (more advanced than basic filtering in getAllJobs)
// - applyToJob (if candidates can apply through the system)
