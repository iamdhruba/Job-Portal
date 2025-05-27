import mongoose from "mongoose";

const responsibilitySchema = new mongoose.Schema(
    {
        title: String,
        points: [String],
    },
    { _id: false }
);

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        company: { type: String, required: true }, // Could be a ref to a Company model later
        logo: { type: String }, // URL to company logo
        tags: {
            type: Map,
            of: String,
            default: {},
        },
        timeLeft: { type: String }, // Or Date, depending on how you want to calculate this
        jobType: { type: String, enum: ["Full Time", "Part Time", "Contract", "Internship", "Remote"] },
        salary: { type: String }, // e.g., "Rs 50000 - 70000" or "Negotiable"
        salaryPeriod: { type: String }, // e.g., "/ Monthly"
        location: { type: String }, // For the overview card, e.g., "Onsite", "Remote"
        experience: { type: String }, // e.g., "3 Year", "0-1 Year"
        level: { type: String }, // e.g., "Mid", "Entry", "Senior"
        openings: { type: Number },
        jobDescription: { type: String, required: true },
        locationDetail: { type: String }, // For the job description section, e.g., "Lalitpur"
        responsibilities: [responsibilitySchema],
        requirements: [{ type: String }],
        bonusSkills: [{ type: String }],
        applicationInstruction: { type: String },
        requiredSkillsChips: [{ type: String }],
        companyLocation: { type: String }, // For About Company section
        companyAddress: { type: String },
        companyAbout: { type: String },
        applicationEnds: { type: Date }, // Storing as Date for potential filtering/sorting
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assuming jobs are posted by users (recruiters)
        // Consider adding:
        // status: { type: String, enum: ["Open", "Closed", "Draft"], default: "Open" },
        // applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Users who applied
    },
    { timestamps: true }
);

// Indexing for frequently queried fields
jobSchema.index({ title: "text", company: "text" }); // Text index for searching
jobSchema.index({ tags: 1 }); // Index for filtering by tags
jobSchema.index({ location: 1 }); // Index for filtering by location
jobSchema.index({ jobType: 1 }); // Index for filtering by job type

const Job = mongoose.model("Job", jobSchema);

export default Job;
