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
    // Optional profile fields
    title: { type: String },
    location: { type: String },
    rate: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    about: { type: String },
    avatarUrl: { type: String },
    coverUrl: { type: String },
    portfolio: [
        {
            title: { type: String, required: true },
            description: { type: String },
            link: { type: String },
            imageUrl: { type: String },
            createdAt: { type: Date, default: Date.now },
        }
    ],
    experiences: [
        {
            title: { type: String, required: true },
            company: { type: String },
            location: { type: String },
            startDate: { type: Date },
            endDate: { type: Date },
            current: { type: Boolean, default: false },
            description: { type: String },
        }
    ],
    education: [
        {
            school: { type: String, required: true },
            degree: { type: String },
            field: { type: String },
            startYear: { type: Number },
            endYear: { type: Number },
            grade: { type: String },
            description: { type: String },
        }
    ],
    qualifications: [
        {
            title: { type: String, required: true },
            issuer: { type: String },
            date: { type: Date },
            description: { type: String },
        }
    ],
    certifications: [
        {
            title: { type: String, required: true },
            issuer: { type: String },
            date: { type: Date },
            credentialId: { type: String },
            credentialUrl: { type: String },
            imageUrl: { type: String },
        }
    ],
}, { timestamps: true });

// Indexing for frequently queried fields
userSchema.index({ role: 1 }); // Index for filtering by role

export const User = mongoose.model("User", userSchema);
