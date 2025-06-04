import React, { useState, useEffect } from "react";
import { Search, Briefcase, Clock, MapPin, ChevronRight, DollarSign, BarChart3, Users } from "lucide-react";

// InfoCard Component
const InfoCard = ({ icon, label, value, period }) => (
    <div className="text-center p-2">
        {icon}
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-sm">{value}</p>
        {period && <p className="text-xs text-gray-500">{period}</p>}
    </div>
);

// Section Component
const Section = ({ title, content }) => (
    <div className="mb-6">
        <h4 className="font-semibold text-md mb-2">{title}</h4>
        <div className="text-gray-700 text-sm">{Array.isArray(content) ? <ul className="list-disc ml-6 space-y-1">{content}</ul> : <p>{content}</p>}</div>
    </div>
);

// JobCard Component
const JobCard = ({ job, onSelectJob, isSelected, onApply }) => {
    const tagsArray = Array.isArray(job.tags) ? job.tags : job.tags ? Object.values(job.tags) : [];

    return (
        <div className={`p-4 border rounded-lg mb-4 cursor-pointer hover:shadow-md ${isSelected ? "border-red-500 shadow-md" : "border-gray-200"}`} onClick={() => onSelectJob(job)}>
            <div className="flex items-start">
                <img src={job.logo} alt={`${job.company} logo`} className="w-10 h-10 mr-4 mt-1 rounded" />
                <div className="flex-grow">
                    <h3 className="font-semibold text-lg">
                        {job.title} - {job.id}
                    </h3>
                    <p className="text-sm text-red-500">{job.company}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {tagsArray.map((tag, index) => (
                            <span key={`${tag}-${index}`} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-300">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>{job.timeLeft}</span>
                </div>
                <div className="flex items-center text-red-500 font-medium">
                    <span>View Details</span>
                    <ChevronRight size={16} className="ml-1" />
                </div>
            </div>
        </div>
    );
};

// JobDetails Component
const JobDetails = ({ job, onApply }) => {
    if (!job) {
        return <div className="p-6 text-gray-500">Select a job to see details.</div>;
    }

    const tagsArray = Array.isArray(job.tags) ? job.tags : job.tags ? Object.values(job.tags) : [];

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm h-full overflow-y-auto">
            <div className="flex items-start mb-4">
                <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 mr-4 rounded" />
                <div>
                    <h2 className="text-xl font-semibold">
                        {job.title} - {job.id}
                    </h2>
                    <p className="text-red-500">{job.company}</p>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{job.companyLocation}</span>
                        <span className="mx-2">|</span>
                        <Briefcase size={14} className="mr-1" />
                        <span>{job.jobType}</span>
                    </div>
                </div>
                <div className="ml-auto text-right">
                    <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-150" onClick={onApply}>
                        Apply Now
                    </button>
                    <a href="#" className="mt-2 text-red-500 text-xs flex items-center justify-end hover:underline">
                        View on full page <ChevronRight size={14} className="ml-0.5" />
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 p-4 bg-red-50 rounded-lg">
                <InfoCard icon={<DollarSign size={24} />} label="Offered Salary" value={job.salary} period={job.salaryPeriod} />
                <InfoCard icon={<MapPin size={24} />} label="Location" value={job.location} />
                <InfoCard icon={<Briefcase size={24} />} label="Experience" value={job.experience} />
                <InfoCard icon={<BarChart3 size={24} />} label="Level" value={job.level} />
                <InfoCard icon={<Users size={24} />} label="Openings" value={job.openings} />
            </div>

            <Section title="Job Description:" content={job.jobDescription} />

            <Section
                title="Responsibilities of the Candidate:"
                content={job.responsibilities.map((resp, index) => (
                    <div key={index} className="mb-3">
                        {resp.title && <p className="text-sm text-gray-800 font-medium">{`${index + 1}. ${resp.title}`}</p>}
                        <ul className="list-disc list-outside ml-5 mt-1 text-sm text-gray-700 space-y-1">
                            {resp.points.map((point, pIndex) => (
                                <li key={pIndex}>{point}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            />

            <Section
                title="Requirements:"
                content={job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                ))}
            />

            <Section
                title="Bonus Skills"
                content={job.bonusSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            />

            {job.applicationInstruction && <p className="text-sm text-gray-700 my-6">{job.applicationInstruction}</p>}

            {job.requiredSkillsChips && job.requiredSkillsChips.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-md mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {job.requiredSkillsChips.map((skill, index) => (
                            <span key={`${skill}-${index}`} className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md border border-gray-300">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {tagsArray.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-md mb-2 mt-6">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {tagsArray.map((tag, index) => (
                            <span key={`${tag}-${index}`} className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md border border-gray-300">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <hr className="my-6" />

            <div className="mb-8">
                <h4 className="font-semibold text-md mb-2">About Company</h4>
                <p className="text-red-500 font-medium mb-1">{job.company}</p>
                <p className="text-sm text-gray-600 mb-1">
                    <MapPin size={14} className="inline mr-1" /> Location: {job.companyLocation}
                </p>
                <p className="text-sm text-gray-600 mb-1">Address: {job.companyAddress}</p>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{job.companyAbout}</p>
                <a href="#" className="text-red-500 font-medium text-sm flex items-center hover:underline">
                    View Company Profile <ChevronRight size={16} className="ml-1" />
                </a>
            </div>

            <div>
                <h4 className="font-semibold text-md mb-2">Are you interested in this Job?</h4>
                <p className="text-sm text-gray-500 mb-4">Application ends: {new Date(job.applicationEnds).toLocaleDateString()}</p>
                <div className="flex gap-4">
                    <button onClick={onApply} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-150">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Jobs Component
const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/jobs");
                const data = await response.json();
                const formatted = data.map((job) => {
                    let processedTags = [];
                    if (job.tags) {
                        if (typeof job.tags === "object" && !Array.isArray(job.tags)) {
                            processedTags = Object.values(job.tags);
                        } else if (Array.isArray(job.tags)) {
                            processedTags = job.tags;
                        } else if (typeof job.tags === "string") {
                            processedTags = job.tags.split(",").map((tag) => tag.trim());
                        }
                    }
                    return { ...job, id: job._id || job.id, tags: processedTags };
                });
                setJobs(formatted);
                if (formatted.length > 0) setSelectedJob(formatted[0]);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, []);

    const handleApply = async (jobId, jobTitle) => {
        const userId = getUserIdFromToken();
        if (!userId) {
            alert("You must be logged in to apply. Please login or register.");
            window.location.href = "/login";
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, jobId }),
            });

            if (response.ok) {
                alert(`Successfully applied to ${jobTitle}`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error applying for the job. Please try again later.");
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const q = search.toLowerCase();
        return job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.tags.some((tag) => tag.toLowerCase().includes(q));
    });

    return (
        <div className="flex flex-col md:flex-row p-4 max-w-7xl mx-auto gap-6">
            <div className="md:w-1/3 max-h-[80vh] overflow-y-auto">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search by Job title, Company, or Tags"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => <JobCard key={job.id} job={job} onSelectJob={setSelectedJob} isSelected={selectedJob?.id === job.id} onApply={() => handleApply(job.id, job.title)} />)
                ) : (
                    <p className="text-gray-500">No jobs found.</p>
                )}
            </div>

            <div className="md:w-2/3">
                <JobDetails job={selectedJob} onApply={() => selectedJob && handleApply(selectedJob.id, selectedJob.title)} />
            </div>
        </div>
    );
};

export default Jobs;
