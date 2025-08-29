import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const STATUS_META = {
  all: { label: 'All', className: 'bg-gray-100 text-gray-800' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  reviewed: { label: 'Reviewed', className: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
};

// Map backend Apply.status -> UI status
const apiToUiStatus = (s) => ({
  applied: 'pending',
  interviewing: 'reviewed',
  offered: 'accepted',
  rejected: 'rejected',
}[String(s || '').toLowerCase()] || 'pending');

// Map UI status -> backend Apply.status
const uiToApiStatus = (s) => ({
  pending: 'applied',
  reviewed: 'interviewing',
  accepted: 'offered',
  rejected: 'rejected',
}[String(s || '').toLowerCase()] || 'applied');

export default function Applications() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const base = import.meta.env.VITE_API_BASE_URL;
        // Fetch all applications and jobs
        const [appsRes, jobsRes] = await Promise.all([
          fetch(`${base}/api/apply/getallapplies`),
          fetch(`${base}/api/jobs`),
        ]);
        const apps = await appsRes.json();
        const jobs = await jobsRes.json();

        // Determine jobs posted by this recruiter
        const isMine = (job) => {
          const postedBy = job?.postedBy;
          const postedById = typeof postedBy === 'string' ? postedBy : postedBy?._id || postedBy?.id;
          const uid = user?._id || user?.id;
          return postedById === uid;
        };
        const myJobIds = new Set((jobs || []).filter(isMine).map(j => (j._id || j.id)?.toString()))

        // Keep applications for recruiter's jobs
        const mine = (apps || []).filter(a => {
          const job = a.job;
          const jobId = (typeof job === 'string') ? job : job?._id || job?.id;
          const jobPostedBy = (typeof job === 'object') ? (typeof job.postedBy === 'string' ? job.postedBy : job.postedBy?._id || job.postedBy?.id) : null;
          const uid = user?._id || user?.id;
          return myJobIds.has(String(jobId)) || jobPostedBy === uid;
        });

        const normalized = mine.map(a => ({
          id: a._id || a.id,
          jobId: (typeof a.job === 'string') ? a.job : a.job?._id || a.job?.id,
          jobTitle: (typeof a.job === 'object') ? (a.job?.title || '—') : '—',
          candidateName: (typeof a.user === 'object') ? (a.user?.name || '—') : '—',
          candidateEmail: (typeof a.user === 'object') ? (a.user?.email || '—') : '—',
          status: apiToUiStatus(a.status),
          appliedDate: a.createdAt || new Date().toISOString(),
          coverLetter: a.coverLetter || '',
        }));

        setApplications(normalized);
      } catch (e) {
        console.error(e);
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    if (user?._id || user?.id) load();
  }, [user?._id, user?.id]);

  const statusCounts = useMemo(() => {
    return applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
  }, [applications]);

  // Filter + search
  const filteredApplications = useMemo(() => {
    const list = filterStatus === 'all'
      ? applications
      : applications.filter(app => app.status === filterStatus);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(app =>
      (app.candidateName || '').toLowerCase().includes(q) ||
      (app.jobTitle || '').toLowerCase().includes(q) ||
      (app.candidateEmail || '').toLowerCase().includes(q)
    );
  }, [applications, filterStatus, query]);

  const setStatus = async (appId, newUiStatus) => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${base}/api/apply/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: uiToApiStatus(newUiStatus) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      // Update local state
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newUiStatus } : a));
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to update status');
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
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="text-sm text-muted-foreground">Review and manage candidates for your job postings.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, email, job"
            className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" className="mb-4">
        <TabsList className="flex flex-wrap w-full overflow-x-auto gap-2 p-1">
          {Object.keys(STATUS_META).map((s) => (
            <TabsTrigger key={s} value={s} onClick={() => setFilterStatus(s)}>
              <div className="flex items-center gap-2">
                <span>{STATUS_META[s].label}</span>
                {s !== 'all' && (
                  <span className="text-xs text-muted-foreground">{statusCounts[s] || 0}</span>
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredApplications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            {query ? 'No applications match your search.' : 'No applications to review.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((app) => (
            <motion.div key={app.id} whileHover={{ scale: 1.01 }}>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                          {(app.candidateName || 'C').slice(0,1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{app.candidateName || '—'}</div>
                          <div className="text-xs text-muted-foreground truncate">{app.candidateEmail || '—'}</div>
                        </div>
                        <Badge variant="secondary" className="ml-2">{app.jobTitle || '—'}</Badge>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                      <Badge className={`${STATUS_META[app.status]?.className || 'bg-gray-100 text-gray-800'}`}>
                        {STATUS_META[app.status]?.label || app.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground">Applied {new Date(app.appliedDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Body */}
                  {app.coverLetter && (
                    <div className="mt-3 text-sm text-slate-700 line-clamp-3">{app.coverLetter}</div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setStatus(app.id, 'reviewed')}>Mark Reviewed</Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(app.id, 'accepted')}>Accept</Button>
                    <Button size="sm" variant="destructive" onClick={() => setStatus(app.id, 'rejected')}>Reject</Button>
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
