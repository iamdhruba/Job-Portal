import { Apply } from "../model/apply.model.js";

export const createApplication = async (data) => {
    try {
        const application = new Apply(data);
        return await application.save();
    } catch (error) {
        console.error("Error creating application:", error);
        throw error;
    }
};
export const getAllApplications = async () => {
    try {
        return await Apply.find().populate("user job");
    } catch (error) {
        console.error("Error fetching applications:", error);
        throw error;
    }
};
export const getApplicationById = async (id) => {
    try {
        return await Apply.findById(id).populate("user job");
    } catch (error) {
        console.error("Error fetching application by ID:", error);
        throw error;
    }
};
export const updateApplication = async (id, data) => {
    try {
        return await Apply.findByIdAndUpdate(id, data, { new: true }).populate("user job");
    } catch (error) {
        console.error("Error updating application:", error);
        throw error;
    }
};

export const deleteApplication = async (id) => {
    try {
        return await Apply.findByIdAndDelete(id);
    } catch (error) {
        console.error("Error deleting application:", error);
        throw error;
    }
};
