import { getAppStatus, updateAppStatus, getApplicationsByUserId, getApplicationsByJobId, updateApplicationStatusById } from "../view/status.viewmodel.js";

export const getJobSeekerApplicationsController = async (req, res) => {
    try {
        const userId = req.user._id; // From auth middleware
        const applications = await getApplicationsByUserId(userId);
        res.status(200).json(applications);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getRecruiterJobApplicationsController = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await getApplicationsByJobId(jobId);
        res.status(200).json(applications);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const updateApplicationStatusController = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const updated = await updateApplicationStatusById(applicationId, status);
        res.status(200).json(updated);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
