import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  interview: 'bg-indigo-100 text-indigo-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function MyApplications() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [apps, setApps] = React.useState([]);
  const [filter, setFilter] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewJob, setViewJob] = React.useState(null);
  const [viewLoading, setViewLoading] = React.useState(false);
  const [viewError, setViewError] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [appsRes, jobsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apply/getallapplies`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`),
        ]);
        const allApps = await appsRes.json();
        const allJobs = await jobsRes.json();
        const byId = new Map((allJobs || []).map(j => [j._id || j.id, j]));
        const mine = (allApps || []).filter(a => a.candidateId === user?.id || a.user === user?.id || a.userId === user?.id);
        const joined = mine.map(a => {
          const job = byId.get(a.jobId || a.job);
          return {
            id: a._id || a.id,
            jobId: job?._id || job?.id || a.jobId || a.job,
            jobTitle: job?.title || a.jobTitle || '—',
            company: job?.company || a.company || '—',
            appliedDate: a.appliedDate || a.createdAt || new Date().toISOString(),
            status: (a.status || 'pending').toLowerCase(),
          };
        });
        setApps(joined);
      } catch (e) {
        console.error(e);
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const statuses = ['all', 'pending', 'reviewed', 'interview', 'accepted', 'rejected'];

  const filtered = apps.filter(a => {
    const q = query.trim().toLowerCase();
    const matchQuery = !q || a.jobTitle.toLowerCase().includes(q) || a.company.toLowerCase().includes(q);
    const matchStatus = filter === 'all' || a.status === filter;
    return matchQuery && matchStatus;
  });

  const counts = apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  const openView = async (jobId) => {
    setViewOpen(true);
    setViewLoading(true);
    setViewError('');
    setViewJob(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${jobId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load job');
      setViewJob(data);
    } catch (e) {
      setViewError(e.message || 'Failed to load job');
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => { setViewOpen(false); setViewJob(null); setViewError(''); };

  const unapply = async (applicationId) => {
    const confirmed = window.confirm('Are you sure you want to unapply for this job?');
    if (!confirmed) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/apply/${applicationId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to unapply');
      }
      setApps(prev => prev.filter(a => a.id !== applicationId));
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to unapply');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl container-px py-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
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
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Applications</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            placeholder="Search jobs or companies"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 sm:w-64 border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-input rounded-md px-3 py-2"
          >
            {statuses.map(s => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}{s !== 'all' ? ` (${counts[s] || 0})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-sm text-muted-foreground">No applications match your criteria.</CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white shadow-sm rounded-xl ring-1 ring-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Job Title', 'Company', 'Applied Date', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.jobTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{app.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(app.appliedDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[app.status] || 'bg-gray-100 text-gray-800'}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <motion.button whileTap={{ scale: 0.97 }} className="text-primary text-sm hover:underline" onClick={() => openView(app.jobId)}>View</motion.button>
                      <Button size="sm" variant="destructive" onClick={() => unapply(app.id)}>Unapply</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    {viewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div className="text-sm font-semibold">Applied Job Details</div>
              <button onClick={closeView} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <div className="p-5 space-y-3">
              {viewLoading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : viewError ? (
                <div className="text-sm text-red-700">{viewError}</div>
              ) : viewJob ? (
                <>
                  <div className="flex items-start gap-3">
                    {viewJob.logo && <img src={viewJob.logo} className="h-12 w-12 rounded" alt="logo" />}
                    <div>
                      <div className="text-lg font-semibold">{viewJob.title}</div>
                      <div className="text-sm text-muted-foreground">{viewJob.company}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Type: </span>{viewJob.jobType || '—'}</div>
                    <div><span className="text-muted-foreground">Location: </span>{viewJob.location || viewJob.companyLocation || '—'}</div>
                    <div><span className="text-muted-foreground">Salary: </span>{viewJob.salary ? `${viewJob.salary} ${viewJob.salaryPeriod||''}` : '—'}</div>
                    <div><span className="text-muted-foreground">Openings: </span>{viewJob.openings ?? '—'}</div>
                  </div>
                  {viewJob.jobDescription && (
                    <div>
                      <div className="text-sm font-medium mb-1">Description</div>
                      <div className="text-sm text-slate-700 whitespace-pre-line">{viewJob.jobDescription}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No details available.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
