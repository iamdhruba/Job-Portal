import { AppStatus } from "../model/status.model.js";

export const getAppStatus = async (data) => {
    try {
        const { userId, jobId } = data;
        const appStatus = await AppStatus.findOne({ user: userId, job: jobId });
        if (!appStatus) {
            // Let the controller handle the 404 response
            const error = new Error("Application status not found");
            error.statusCode = 404;
            throw error;
        }
        return appStatus;
    } catch (error) {
        console.error("Error fetching application status in viewmodel:", error);
        // Re-throw the error to be caught by the controller
        throw error;
    }
};

export const updateAppStatus = async (data) => {
    try {
        const { userId, jobId, status } = data;
        const appStatus = await AppStatus.findOneAndUpdate({ user: userId, job: jobId }, { status }, { new: true });
        if (!appStatus) {
            // Let the controller handle the 404 response
            const error = new Error("Application status not found");
            error.statusCode = 404;
            throw error;
        }
        return appStatus;
    } catch (error) {
        console.error("Error updating application status in viewmodel:", error);
        // Re-throw the error to be caught by the controller
        throw error;
    }
};

export const getApplicationsByUserId = async (userId) => {
    try {
        const applications = await AppStatus.find({ user: userId })
            .populate("job", "title companyName description location jobType salary") // Populate specific fields from the Job model
            .sort({ createdAt: -1 }); // Sort by creation date, newest first

        if (!applications || applications.length === 0) {
            // It's okay to return an empty array if no applications are found
            return [];
        }
        return applications;
    } catch (error) {
        console.error("Error fetching applications by user ID in viewmodel:", error);
        // Re-throw the error to be caught by the controller
        // Consider if a specific status code is needed here or if 500 is okay from controller
        throw error;
    }
};

export const getApplicationsByJobId = async (jobId) => {
    try {
        // Ensure jobId is a valid ObjectId if necessary, though find usually handles string conversion.
        // For consistency, you could add: const jobObjectId = new mongoose.Types.ObjectId(jobId);
        // And then use { job: jobObjectId } in the find query.
        // However, Mongoose's find often casts strings to ObjectIds automatically for query conditions.

        const applications = await AppStatus.find({ job: jobId })
            .populate("user", "firstName lastName email otherRelevantUserFields") // Populate user details. Adjust 'otherRelevantUserFields' as needed.
            .sort({ createdAt: -1 }); // Sort by application date, newest first

        if (!applications) {
            // AppStatus.find returns [] if not found, not null, so this check might be redundant if an empty array is acceptable.
            // It's okay to return an empty array if no applications are found for this job.
            return [];
        }
        return applications;
    } catch (error) {
        console.error("Error fetching applications by job ID in viewmodel:", error);
        // Re-throw the error to be caught by the controller
        throw error;
    }
};

export const updateApplicationStatusById = async (applicationId, newStatus) => {
    try {
        // Optional: Validate newStatus against the enum defined in AppStatus model if not handled by Mongoose schema validation upstream
        // const allowedStatuses = ["applied", "interviewing", "offered", "rejected"];
        // if (!allowedStatuses.includes(newStatus)) {
        //     const error = new Error("Invalid application status provided.");
        //     error.statusCode = 400; // Bad Request
        //     throw error;
        // }

        const updatedApplication = await AppStatus.findByIdAndUpdate(
            applicationId,
            { status: newStatus },
            { new: true } // Returns the modified document rather than the original
        );

        if (!updatedApplication) {
            const error = new Error("Application status not found for the given ID.");
            error.statusCode = 404;
            throw error;
        }
        return updatedApplication;
    } catch (error) {
        console.error("Error updating application status by ID in viewmodel:", error);
        // Re-throw the error to be caught by the controller, preserving statusCode if set
        throw error;
    }
};
