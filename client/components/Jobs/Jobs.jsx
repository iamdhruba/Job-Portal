import React, { useState, useEffect, useContext } from "react";
import { Search, Briefcase, Clock, MapPin, ChevronRight, DollarSign, BarChart3, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { DataContext } from "../../src/context/DataContexts";

// InfoCard Component
const InfoCard = ({ icon, label, value, period }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm text-center">
    <div className="flex items-center justify-center mb-2">
      {React.cloneElement(icon, { className: "text-red-500", size: 24 })}
    </div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-sm">{value}</p>
    {period && <p className="text-xs text-gray-500">{period}</p>}
  </div>
);

// Section Component
const Section = ({ title, content }) => (
  <div className="mb-6">
    <h4 className="font-semibold text-md mb-2">{title}</h4>
    <div className="text-gray-700 text-sm">
      {Array.isArray(content) ? (
        <ul className="list-disc ml-6 space-y-1">{content}</ul>
      ) : (
        <p>{content}</p>
      )}
    </div>
  </div>
);

// JobCard Component
const JobCard = ({ job, onSelectJob, isSelected, onApply, saved = false, onToggleSave }) => {
  const tagsArray = Array.isArray(job.tags) ? job.tags : job.tags ? Object.values(job.tags) : [];
  const statusBadge = job.jobType ? (
    <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 whitespace-nowrap">{job.jobType}</span>
  ) : null;

  return (
    <div
      className={`p-4 border rounded-xl mb-4 cursor-pointer transition-shadow hover:shadow-md ${
        isSelected ? "border-red-500 shadow-md" : "border-gray-200"
      }`}
      onClick={() => onSelectJob(job)}
    >
      <div className="flex items-start">
        {job.logo ? (
          <img src={job.logo} alt={`${job.company} logo`} className="w-10 h-10 mr-4 mt-1 rounded" />
        ) : (
          <div className="w-10 h-10 mr-4 mt-1 rounded bg-gray-100 grid place-items-center text-xs text-gray-500">
            {job.company?.slice(0,2).toUpperCase()}
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">{job.title}</h3>
              <p className="text-xs text-red-500 truncate">{job.company}</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleSave(job.id); }}
              title={saved ? "Unsave" : "Save"}
              className={`p-1 rounded hover:bg-gray-100 ${saved ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart size={16} fill={saved ? 'currentColor' : 'transparent'} />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap text-xs text-gray-600">
            {statusBadge}
            {job.location && (
              <span className="inline-flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
            )}
            {job.timeLeft && (
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {job.timeLeft}</span>
            )}
          </div>
          {tagsArray.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tagsArray.slice(0, 4).map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center text-xs">
        <div className="flex items-center text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>{job.applicationEnds ? `Ends ${new Date(job.applicationEnds).toLocaleDateString()}` : (job.timeLeft || '—')}</span>
        </div>
        <div className="flex items-center text-red-500 font-medium">
          <span className="text-sm">View Details</span>
          <ChevronRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

// JobDetails Component
const JobDetails = ({ job, onApply, canApply = true }) => {
  if (!job) return <div className="p-6 text-gray-500">Select a job to see details.</div>;

  const tagsArray = Array.isArray(job.tags) ? job.tags : job.tags ? Object.values(job.tags) : [];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm h-full overflow-y-auto ring-1 ring-gray-100">
      <div className="flex items-start mb-4">
        {job.logo ? (
          <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 mr-4 rounded" />
        ) : (
          <div className="w-12 h-12 mr-4 rounded bg-gray-100 grid place-items-center text-sm text-gray-500">
            {job.company?.slice(0,2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold truncate">{job.title}</h2>
          <p className="text-red-500 truncate">{job.company}</p>
          <div className="text-sm text-gray-500 flex items-center mt-1 gap-2 flex-wrap">
            {job.companyLocation && (<span className="inline-flex items-center gap-1"><MapPin size={14} /> {job.companyLocation}</span>)}
            {job.jobType && (<span className="inline-flex items-center gap-1"><Briefcase size={14} /> {job.jobType}</span>)}
          </div>
        </div>
        <div className="ml-auto text-right">
          {canApply ? (
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-150"
              onClick={onApply}
            >
              Apply Now
            </button>
          ) : (
            <div className="text-xs text-gray-500">Log in as a candidate to apply.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 p-4 bg-red-50 rounded-lg">
        <InfoCard icon={<DollarSign />} label="Offered Salary" value={job.salary || '—'} period={job.salaryPeriod} />
        <InfoCard icon={<MapPin />} label="Location" value={job.location || '—'} />
        <InfoCard icon={<Briefcase />} label="Experience" value={job.experience || '—'} />
        <InfoCard icon={<BarChart3 />} label="Level" value={job.level || '—'} />
        <InfoCard icon={<Users />} label="Openings" value={job.openings ?? '—'} />
      </div>

      <Section title="Job Description:" content={job.jobDescription} />

      <Section
        title="Responsibilities of the Candidate:"
        content={(job.responsibilities || []).map((resp, index) => (
          <div key={index} className="mb-3">
            {resp.title && <p className="text-sm text-gray-800 font-medium">{`${index + 1}. ${resp.title}`}</p>}
            <ul className="list-disc list-outside ml-5 mt-1 text-sm text-gray-700 space-y-1">
              {(resp.points || []).map((point, pIndex) => (
                <li key={pIndex}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      />

      {Array.isArray(job.requirements) && job.requirements.length > 0 && (
        <Section title="Requirements:" content={job.requirements.map((req, index) => <li key={index}>{req}</li>)} />
      )}
      {Array.isArray(job.bonusSkills) && job.bonusSkills.length > 0 && (
        <Section title="Bonus Skills" content={job.bonusSkills.map((skill, index) => <li key={index}>{skill}</li>)} />
      )}

      {job.applicationInstruction && <p className="text-sm text-gray-700 my-6">{job.applicationInstruction}</p>}

      {Array.isArray(job.requiredSkillsChips) && job.requiredSkillsChips.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-md mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkillsChips.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md border border-gray-300"
              >
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
              <span
                key={`${tag}-${index}`}
                className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md border border-gray-300"
              >
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
          <MapPin size={14} className="inline mr-1" /> Location: {job.companyLocation || job.location || '—'}
        </p>
        {job.companyAddress && <p className="text-sm text-gray-600 mb-1">Address: {job.companyAddress}</p>}
        {job.companyAbout && <p className="text-sm text-gray-600 mb-4 leading-relaxed">{job.companyAbout}</p>}
      </div>

      {job.applicationEnds && (
        <div>
          <h4 className="font-semibold text-md mb-2">Are you interested in this Job?</h4>
          <p className="text-sm text-gray-500 mb-4">Application ends: {new Date(job.applicationEnds).toLocaleDateString()}</p>
          {canApply && (
            <div className="flex gap-4">
              <button
                onClick={onApply}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-150"
              >
                Apply Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Jobs Component
const Jobs = () => {
  const { addItem } = useContext(DataContext);
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState([]);
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('saved_jobs');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  const jobTypeOptions = ["Full Time","Part Time","Contract","Internship","Remote"];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`);
        if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.status}`);
        const data = await response.json();
        const formatted = data.map((job) => {
          let processedTags = [];
          if (job.tags) {
            if (typeof job.tags === "object" && !Array.isArray(job.tags)) processedTags = Object.values(job.tags);
            else if (Array.isArray(job.tags)) processedTags = job.tags;
            else if (typeof job.tags === "string") processedTags = job.tags.split(",").map((tag) => tag.trim());
          }
          return { ...job, id: job._id || job.id, tags: processedTags };
        });
        setJobs(formatted);
        if (formatted.length > 0) setSelectedJob(formatted[0]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.message || "Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('saved_jobs', JSON.stringify(Array.from(saved)));
    } catch {}
  }, [saved]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleApply = async (jobId, jobTitle) => {
    if (!user) {
      alert("You must be logged in as a candidate to apply.");
      window.location.href = "/login/candidate";
      return;
    }
    if (user.role !== 'candidate') {
      alert("Only candidates can apply for jobs.");
      return;
    }
    const userId = getUserIdFromToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        alert(`Successfully applied to ${jobTitle}`);
        // Optional: trigger re-fetch of applications if needed
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
    const matchesQuery = (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.tags.some((tag) => tag.toLowerCase().includes(q))
    );
    const matchesType = (typeFilter.length === 0 || typeFilter.includes(job.jobType));
    return matchesQuery && matchesType;
  });

  const toggleType = (t) => setTypeFilter((prev) => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const clearFilters = () => { setSearch(""); setTypeFilter([]); };
  const toggleSave = (id) => setSaved(prev => {
    const next = new Set(Array.from(prev));
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-4 grid md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-150"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row p-4 max-w-7xl mx-auto gap-6">
      <div className="md:w-1/3 max-h-[80vh] md:sticky top-4 overflow-y-auto">
        <div className="space-y-3 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, company, or tags"
              className="w-full pl-10 pr-3 py-2 border border-input rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {jobTypeOptions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${typeFilter.includes(t) ? 'bg-primary text-primary-foreground border-primary' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                {t}
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              disabled={!search && typeFilter.length === 0}
              className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
          <div className="text-xs text-muted-foreground">Showing {filteredJobs.length} of {jobs.length} jobs</div>
        </div>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <motion.div key={job.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <JobCard
                job={job}
                onSelectJob={setSelectedJob}
                isSelected={selectedJob?.id === job.id}
                onApply={() => handleApply(job.id, job.title)}
                saved={saved.has(job.id)}
                onToggleSave={toggleSave}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No jobs found.</p>
        )}
      </div>

      <div className="md:w-2/3">
        <JobDetails job={selectedJob} canApply={user?.role === 'candidate'} onApply={() => selectedJob && handleApply(selectedJob.id, selectedJob.title)} />
      </div>
    </div>
  );
};

export default Jobs;
