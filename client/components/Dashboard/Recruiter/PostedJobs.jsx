import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Briefcase, DollarSign, CalendarDays, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import jobService from '@/services/jobService';

const STATUS_META = {
  open: { label: 'Open', className: 'bg-green-100 text-green-800' },
  closed: { label: 'Closed', className: 'bg-gray-200 text-gray-800' },
};

// Constants and helpers for editing jobs
const jobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Remote"];
const salaryPeriods = ["/ Monthly", "/ Yearly", "/ Hourly"];

function normalizeTags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === 'object') return Object.values(input);
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return input.split(',').map(t => t.trim()).filter(Boolean);
    }
  }
  return [];
}

function toDateInputValue(val) {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

export default function PostedJobs() {
  const { user } = useAuth();

  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('all');

  // Edit modal state
  const emptyForm = {
    title: '',
    company: '',
    logo: '',
    tags: '',
    timeLeft: '',
    jobType: '',
    salary: '',
    salaryPeriod: '/ Monthly',
    location: '',
    experience: '',
    level: '',
    openings: 1,
    jobDescription: '',
    locationDetail: '',
    companyAbout: '',
    companyLocation: '',
    companyAddress: '',
    applicationInstruction: '',
    applicationEnds: '',
  };
  const [editing, setEditing] = React.useState(null); // job or null
  const [formData, setFormData] = React.useState(emptyForm);
  const [editTags, setEditTags] = React.useState([]);
  const [tagInput, setTagInput] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');
  const [saveMessage, setSaveMessage] = React.useState('');

  const openEdit = (job) => {
    const fd = {
      title: job.title || '',
      company: job.company || (job.postedBy?.companyName || ''),
      logo: job.logo || '',
      tags: '',
      timeLeft: job.timeLeft || '',
      jobType: job.jobType || '',
      salary: job.salary || '',
      salaryPeriod: job.salaryPeriod || '/ Monthly',
      location: job.location || '',
      experience: job.experience || '',
      level: job.level || '',
      openings: job.openings ?? 1,
      jobDescription: job.jobDescription || '',
      locationDetail: job.locationDetail || '',
      companyAbout: job.companyAbout || '',
      companyLocation: job.companyLocation || '',
      companyAddress: job.companyAddress || '',
      applicationInstruction: job.applicationInstruction || '',
      applicationEnds: toDateInputValue(job.applicationEnds),
    };
    setFormData(fd);
    setEditTags(normalizeTags(job.tags));
    setTagInput('');
    setSaveError('');
    setSaveMessage('');
    setEditing(job);
  };

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = (val) => {
    const t = val.trim();
    if (!t) return;
    setEditTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
  };

  const removeTag = (t) => setEditTags((prev) => prev.filter((x) => x !== t));

  const onTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setSaveError('');
    setSaveMessage('');
    try {
      const payload = { ...formData, tags: editTags };
      const id = editing._id || editing.id;
      const res = await jobService.update(id, payload);
      const updated = res?.job || res;
      setJobs((prev) => prev.map((j) => ((j._id || j.id) === id ? { ...j, ...updated } : j)));
      setSaveMessage('Job updated successfully');
      setEditing(null);
    } catch (err) {
      console.error(err);
      setSaveError(err?.response?.data?.message || err.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const all = await jobService.listAll();
        const uid = user?._id || user?.id;
        const mine = (all || []).filter(j => {
          const pb = j.postedBy;
          const pbId = typeof pb === 'string' ? pb : (pb?._id || pb?.id);
          return pbId === uid;
        });
        setJobs(mine);
      } catch (e) {
        console.error(e);
        setError('Failed to load posted jobs.');
      } finally {
        setLoading(false);
      }
    };
    if (user?._id || user?.id) load();
  }, [user?._id, user?.id]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return (jobs || []).filter(job => {
      const isOpen = !job.applicationEnds || new Date(job.applicationEnds) > new Date();
      const stat = isOpen ? 'open' : 'closed';
      const matchStatus = status === 'all' || status === stat;
      const company = job.company || job.postedBy?.companyName || '';
      const matchQuery = !q || job.title?.toLowerCase().includes(q) || company.toLowerCase().includes(q) || (job.location||'').toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [jobs, query, status]);

  const statuses = ['all', 'open', 'closed'];

  const onDelete = async (job) => {
    const confirmed = window.confirm(`Delete ${job.title}? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await jobService.remove(job._id || job.id);
      setJobs(prev => prev.filter(j => (j._id || j.id) !== (job._id || job.id)));
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl container-px py-6">
        <div className="p-4 text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl container-px py-6">
        <Card className="border-dashed">
          <CardContent className="p-8 text-sm text-red-700">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl container-px py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Posted Jobs</h1>
          <p className="text-sm text-muted-foreground">Manage your active postings and keep them up to date.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, company, location"
              className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-input rounded-md px-3 py-2"
          >
            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            {query || status !== 'all' ? 'No jobs match your filters.' : 'You have not posted any jobs yet.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((job) => {
            const isOpen = !job.applicationEnds || new Date(job.applicationEnds) > new Date();
            const company = job.company || job.postedBy?.companyName || '—';
            const tagsArray = job.tags && typeof job.tags === 'object' && !Array.isArray(job.tags)
              ? Object.keys(job.tags)
              : Array.isArray(job.tags) ? job.tags : [];

            return (
              <motion.div key={job._id || job.id} whileHover={{ y: -2 }}>
                <Card className="hover:shadow-soft transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-base leading-tight truncate">{job.title}</CardTitle>
                        <div className="text-xs text-muted-foreground truncate">{company}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_META[isOpen ? 'open' : 'closed'].className}`}>
                        {STATUS_META[isOpen ? 'open' : 'closed'].label}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-3">
                    <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                      {job.location && <div className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</div>}
                      {job.jobType && <div className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.jobType}</div>}
                      {job.salary && <div className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary} {job.salaryPeriod||''}</div>}
                      {job.createdAt && <div className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString()}</div>}
                    </div>

                    {job.jobDescription && (
                      <div className="text-sm text-slate-700 line-clamp-3">{job.jobDescription}</div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(tagsArray || []).slice(0,4).map((t, i) => (
                          <span key={i} className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-700">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(job)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                        <Button size="sm" variant="destructive" className="gap-1" onClick={() => onDelete(job)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    {editing && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Edit Job</h3>
          <form onSubmit={onSubmitEdit} className="space-y-6">
            {/* Top: Title and Company */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Job Title<span className="text-red-600"> *</span></label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
                  placeholder="e.g. Mid, Senior"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="applicationEnds"
                  value={formData.applicationEnds}
                  onChange={onFieldChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Left</label>
                <input
                  name="timeLeft"
                  value={formData.timeLeft}
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
                  placeholder="e.g. Rs 50000 - 70000"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select
                  name="salaryPeriod"
                  value={formData.salaryPeriod}
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
                  placeholder="e.g. Lalitpur"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </section>

            {/* Tags */}
            <section>
              <label className="block text-sm font-medium mb-1">Skills / Tags</label>
              <div className="flex flex-wrap items-center gap-2 border border-input rounded-md px-3 py-2">
                {editTags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {t}
                    <button type="button" className="ml-1 text-primary/70 hover:text-primary" onClick={() => removeTag(t)}>×</button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKeyDown}
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
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
                  placeholder="City"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Company Address</label>
                <input
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
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
                  onChange={onFieldChange}
                  placeholder="e.g. Submit portfolio link in the application"
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>

            {saveMessage && <div className="text-center text-sm text-green-700">{saveMessage}</div>}
            {saveError && <div className="text-center text-sm text-red-700">{saveError}</div>}
          </form>
        </div>
      </div>
    )}
    </div>
  );
}
