import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jobService from "@/services/jobService";

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

const jobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Remote"];
const salaryPeriods = ["/ Monthly", "/ Yearly", "/ Hourly"];

const CreateJobForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = (val) => {
    const t = val.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...formData,
        tags,
      };

      await jobService.create(payload);
      setMessage("Job posted successfully!");
      setFormData(initialState);
      setTags([]);
      setTagInput("");
    } catch (err) {
      console.error("Error creating job:", err);
      setError(err?.response?.data?.message || err.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setTags([]);
    setTagInput("");
    setMessage("");
    setError("");
  };

  return (
    <div className="mx-auto max-w-4xl container-px py-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Post a Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top: Title and Company */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Job Title<span className="text-red-600"> *</span></label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior React Developer"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company<span className="text-red-600"> *</span></label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Tech Corp"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </section>

            {/* Job details */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50">
              <div>
                <label className="block text-sm font-medium mb-1">Job Type<span className="text-red-600"> *</span></label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none"
                  required
                >
                  <option value="" disabled>Select type</option>
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <input
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  placeholder="e.g. Mid, Senior"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3 Years"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Openings</label>
                <input
                  type="number"
                  min={1}
                  name="openings"
                  value={formData.openings}
                  onChange={handleChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="applicationEnds"
                  min={today}
                  value={formData.applicationEnds}
                  onChange={handleChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Left</label>
                <input
                  name="timeLeft"
                  value={formData.timeLeft}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </section>

            {/* Compensation & Location */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50">
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <input
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. Rs 50000 - 70000"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select
                  name="salaryPeriod"
                  value={formData.salaryPeriod}
                  onChange={handleChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none"
                >
                  {salaryPeriods.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location<span className="text-red-600"> *</span></label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote, Onsite"
                  required
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Location Detail</label>
                <input
                  name="locationDetail"
                  value={formData.locationDetail}
                  onChange={handleChange}
                  placeholder="e.g. Lalitpur"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </section>

            {/* Tags */}
            <section>
              <label className="block text-sm font-medium mb-1">Skills / Tags</label>
              <div className="flex flex-wrap items-center gap-2 border border-input rounded-md px-3 py-2">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {t}
                    <button type="button" className="ml-1 text-primary/70 hover:text-primary" onClick={() => removeTag(t)}>×</button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type and press Enter"
                  className="flex-1 min-w-[160px] outline-none"
                />
              </div>
            </section>

            {/* Company */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">About Company</label>
                <textarea
                  name="companyAbout"
                  value={formData.companyAbout}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell candidates about your company"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo URL</label>
                <input
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {formData.logo ? (
                  <div className="mt-2 h-16 w-16 rounded-md overflow-hidden ring-1 ring-gray-200">
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img src={formData.logo} alt="Company logo preview" className="h-full w-full object-cover" />
                  </div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Location</label>
                <input
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Company Address</label>
                <input
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  placeholder="Street, Building, etc."
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </section>

            {/* Description & Instruction */}
            <section className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Description<span className="text-red-600"> *</span></label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Describe the role, responsibilities and requirements"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Application Instruction</label>
                <input
                  name="applicationInstruction"
                  value={formData.applicationInstruction}
                  onChange={handleChange}
                  placeholder="e.g. Submit portfolio link in the application"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>Reset</Button>
              <Button type="submit" disabled={loading}>{loading ? "Posting..." : "Post Job"}</Button>
            </div>

            {message && <div className="text-center text-sm text-green-700">{message}</div>}
            {error && <div className="text-center text-sm text-red-700">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJobForm;
