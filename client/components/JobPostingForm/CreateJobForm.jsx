import React, { useState } from "react";

const initialState = {
    title: "",
    company: "",
    logo: "",
    tags: "",
    timeLeft: "",
    jobType: "",
    salary: "",
    salaryPeriod: "/ Monthly",
    location: "",
    experience: "",
    level: "",
    openings: 1,
    jobDescription: "",
    locationDetail: "",
    companyAbout: "",
    companyLocation: "",
    companyAddress: "",
    applicationInstruction: "",
    applicationEnds: "",
};

const CreateJobForm = () => {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // Prepare data to be sent, processing tags into an array
            const tagsArray = formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "");

            const payload = {
                ...formData,
                tags: tagsArray,
            };

            const response = await fetch("http://localhost:5000/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Server responded with:", data);
                throw new Error("Failed to post job");
            }

            setMessage("Job posted successfully!");
            setFormData(initialState);
        } catch (err) {
            console.error("Error creating job:", err);
            setMessage("Failed to post job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Post a New Job</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Title" name="title" value={formData.title} onChange={handleChange} />
                <Input label="Company" name="company" value={formData.company} onChange={handleChange} />
                <Input label="Logo URL" name="logo" value={formData.logo} onChange={handleChange} />
                <Input label="Tags" name="tags" value={formData.tags} onChange={handleChange} />
                <Input label="Time Left" name="timeLeft" value={formData.timeLeft} onChange={handleChange} />
                <Input label="Job Type" name="jobType" value={formData.jobType} onChange={handleChange} />
                <Input label="Salary" name="salary" value={formData.salary} onChange={handleChange} />
                <Input label="Salary Period" name="salaryPeriod" value={formData.salaryPeriod} onChange={handleChange} />
                <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
                <Input label="Experience" name="experience" value={formData.experience} onChange={handleChange} />
                <Input label="Level" name="level" value={formData.level} onChange={handleChange} />
                <Input label="Openings" name="openings" value={formData.openings} onChange={handleChange} type="number" />
            </div>

            <TextArea label="Job Description" name="jobDescription" value={formData.jobDescription} onChange={handleChange} />
            <TextArea label="Location Detail" name="locationDetail" value={formData.locationDetail} onChange={handleChange} />
            <TextArea label="Company About" name="companyAbout" value={formData.companyAbout} onChange={handleChange} />
            <Input label="Company Location" name="companyLocation" value={formData.companyLocation} onChange={handleChange} />
            <Input label="Company Address" name="companyAddress" value={formData.companyAddress} onChange={handleChange} />
            <Input label="Application Instruction" name="applicationInstruction" value={formData.applicationInstruction} onChange={handleChange} />
            <Input label="Application Deadline" name="applicationEnds" type="date" value={formData.applicationEnds} onChange={handleChange} />

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
                {loading ? "Posting..." : "Post Job"}
            </button>

            {message && <div className="text-center text-sm text-gray-700 mt-4">{message}</div>}
        </form>
    );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
    <label className="block">
        <span className="text-gray-700">{label}</span>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </label>
);

const TextArea = ({ label, name, value, onChange }) => (
    <label className="block">
        <span className="text-gray-700">{label}</span>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={4}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </label>
);

export default CreateJobForm;
