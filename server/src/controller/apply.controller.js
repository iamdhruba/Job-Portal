import { createApplication, getAllApplications, getApplicationById, updateApplication, deleteApplication } from "../view/apply.viewmodel.js";
import { getFromCache, setInCache, deleteFromCache } from "../../utils/cache.js";

// Create a new application
export const createApply = async (req, res) => {
    try {
        const application = await createApplication(req.body);
        
        // Clear the applications cache when a new application is created
        await deleteFromCache('all_applications');
        
        res.status(201).json(application);
    } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all applications
export const getAllApplies = async (req, res) => {
    try {
        // Check if applications are cached
        const cachedApplications = await getFromCache('all_applications');
        if (cachedApplications) {
            return res.status(200).json(cachedApplications);
        }
        
        const applications = await getAllApplications();
        
        // Cache applications for 5 minutes
        await setInCache('all_applications', applications, 300);
        
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get application by ID
export const getApplyById = async (req, res) => {
    try {
        const application = await getApplicationById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        res.status(200).json(application);
    } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update application
export const updateApply = async (req, res) => {
    try {
        const updatedApplication = await updateApplication(req.params.id, req.body);
        if (!updatedApplication) {
            return res.status(404).json({ message: "Application not found" });
        }
        
        // Clear the applications cache when an application is updated
        await deleteFromCache('all_applications');
        
        res.status(200).json(updatedApplication);
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete application
export const deleteApply = async (req, res) => {
    try {
        const deletedApplication = await deleteApplication(req.params.id);
        if (!deletedApplication) {
            return res.status(404).json({ message: "Application not found" });
        }
        
        // Clear the applications cache when an application is deleted
        await deleteFromCache('all_applications');
        
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Export all functions for use in routes
export default {
    createApply,
    getAllApplies,
    getApplyById,
    updateApply,
    deleteApply,
};
