import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../../../src/context/DataContexts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const STATUS_META = {
  all: { label: 'All', className: 'bg-gray-100 text-gray-800' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  reviewed: { label: 'Reviewed', className: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
};

export default function Applications() {
  const { data, updateItem } = useContext(DataContext);
  const [filterStatus, setFilterStatus] = useState('all');
  const [query, setQuery] = useState('');
  const recruiterId = 2; // mock recruiter id from sample context data

  // Applications for this recruiter (based on jobs they posted)
  const recruiterApplications = useMemo(() => {
    return data.applications.filter(app => {
      const job = data.jobs.find(j => j.id === app.jobId);
      return job && job.postedBy === recruiterId;
    });
  }, [data.applications, data.jobs]);

  // Status counts
  const statusCounts = useMemo(() => {
    return recruiterApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
  }, [recruiterApplications]);

  // Filter + search
  const filteredApplications = useMemo(() => {
    const list = filterStatus === 'all'
      ? recruiterApplications
      : recruiterApplications.filter(app => app.status === filterStatus);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(app =>
      app.candidateName.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      app.candidateEmail.toLowerCase().includes(q)
    );
  }, [recruiterApplications, filterStatus, query]);

  const setStatus = (appId, newStatus) => updateItem('applications', appId, { status: newStatus });

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
                          {app.candidateName?.slice(0,1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{app.candidateName}</div>
                          <div className="text-xs text-muted-foreground truncate">{app.candidateEmail}</div>
                        </div>
                        <Badge variant="secondary" className="ml-2">{app.jobTitle}</Badge>
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
