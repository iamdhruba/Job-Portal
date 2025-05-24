import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // For candidate: name is full name, for recruiter: name is company name
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // Role distinguishes between candidate and recruiter
    role: {
        type: String,
        enum: ["candidate", "recruiter"],
        required: true,
    },
});

export const User = mongoose.model("User", userSchema);
