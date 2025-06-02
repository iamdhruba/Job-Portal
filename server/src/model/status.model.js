import mongoose from "mongoose";

const appStatusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        status: {
            type: String,
            enum: ["applied", "offered", "rejected"],
            default: "applied",
        },
    },
    {
        timestamps: true,
    }
);

export const AppStatus = mongoose.model("AppStatus", appStatusSchema);
