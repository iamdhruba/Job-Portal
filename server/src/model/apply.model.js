import mongoose from "mongoose";

const applySchema = new mongoose.Schema(
    {
        // The user who applied for the job
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // The job for which the application is made
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        // Status of the application
        status: {
            type: String,
            enum: ["applied", "interviewing", "offered", "rejected"],
            default: "applied",
        },
    },
    { timestamps: true }
);

export const Apply = mongoose.model("Apply", applySchema);
// Exporting the Apply model to be used in other parts of the application
