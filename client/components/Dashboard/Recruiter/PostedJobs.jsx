import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../../../src/context/DataContexts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Briefcase, DollarSign, CalendarDays, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_META = {
  open: { label: 'Open', className: 'bg-green-100 text-green-800' },
  closed: { label: 'Closed', className: 'bg-gray-200 text-gray-800' },
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', className: 'bg-red-100 text-red-800' },
};

export default function PostedJobs() {
  const { data, deleteItem } = useContext(DataContext);
  const recruiterId = 2; // mock recruiter

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const recruiterJobs = useMemo(() => data.jobs.filter(job => job.postedBy === recruiterId), [data.jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recruiterJobs.filter(job => {
      const matchQuery = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || (job.location||'').toLowerCase().includes(q);
      const normalizedStatus = (job.status || '').toLowerCase();
      const matchStatus = status === 'all' || normalizedStatus === status;
      return matchQuery && matchStatus;
    });
  }, [recruiterJobs, query, status]);

  const statuses = ['all', 'open', 'closed', 'active', 'inactive'];

  const onDelete = (job) => {
    const confirmed = window.confirm(`Delete ${job.title}?`);
    if (!confirmed) return;
    deleteItem('jobs', job.id);
  };

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
          {filtered.map((job) => (
            <motion.div key={job.id} whileHover={{ y: -2 }}>
              <Card className="hover:shadow-soft transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-tight truncate">{job.title}</CardTitle>
                      <div className="text-xs text-muted-foreground truncate">{job.company}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_META[(job.status||'').toLowerCase()]?.className || 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_META[(job.status||'').toLowerCase()]?.label || job.status || '—'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                    {job.location && <div className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</div>}
                    {job.jobType && <div className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.jobType}</div>}
                    {job.salary && <div className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary} {job.salaryPeriod||''}</div>}
                    {job.postedDate && <div className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {job.postedDate}</div>}
                  </div>

                  {job.description && (
                    <div className="text-sm text-slate-700 line-clamp-3">{job.description}</div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(job.tags || []).slice(0,4).map((t, i) => (
                        <span key={i} className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-700">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1"><Edit className="h-3.5 w-3.5" /> Edit</Button>
                      <Button size="sm" variant="destructive" className="gap-1" onClick={() => onDelete(job)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
