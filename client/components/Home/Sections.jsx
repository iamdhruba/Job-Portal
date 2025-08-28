import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';

export function FeaturedJobs() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');
        const formatted = (data || []).map((job) => ({
          ...job,
          id: job._id || job.id,
          tags: Array.isArray(job.tags)
            ? job.tags
            : job.tags
            ? typeof job.tags === 'object'
              ? Object.values(job.tags)
              : String(job.tags).split(',').map((t) => t.trim())
            : [],
        }));
        setJobs(formatted.slice(0, 6));
      } catch (e) {
        setError(e.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="container-px mx-auto max-w-6xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Featured Jobs</h2>
        <Link to="/jobs" className="text-primary text-sm hover:underline flex items-center gap-1">
          Browse all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-sm text-red-700">{error}</CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-sm text-muted-foreground">No jobs available right now.</CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-soft transition-shadow">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base leading-tight">
                  {job.title}
                </CardTitle>
                <div className="text-xs text-muted-foreground">{job.company}</div>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-3">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  {job.location && (<span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>)}
                  {job.jobType && (<span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.jobType}</span>)}
                </div>
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.slice(0, 4).map((t, i) => (
                      <span key={i} className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-700">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export function Categories() {
  const cats = [
    'Engineering', 'Design', 'Marketing', 'Sales', 'Finance',
    'Healthcare', 'Education', 'Product', 'Operations', 'Remote',
  ];
  return (
    <section className="container-px mx-auto max-w-6xl py-10">
      <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <Link
            key={c}
            to={`/jobs?category=${encodeURIComponent(c)}`}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {c}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TopCompanies() {
  const [companies, setCompanies] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');
        const counts = (data || []).reduce((acc, j) => {
          const name = j.company || 'Unknown';
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});
        const arr = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);
        setCompanies(arr);
      } catch {
        setCompanies([]);
      }
    };
    load();
  }, []);

  return (
    <section className="container-px mx-auto max-w-6xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Top Companies</h2>
        <Link to="/jobs" className="text-primary text-sm hover:underline flex items-center gap-1">
          Explore jobs <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {companies.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-sm text-muted-foreground">No data to show.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map((c) => (
            <Card key={c.name} className="hover:shadow-soft transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {c.name.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.count} open role{c.count>1?'s':''}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export function HomeCTA() {
  return (
    <section className="container-px mx-auto max-w-6xl py-12">
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Ready to level up your career?</h3>
            <p className="text-sm/relaxed opacity-90">Discover curated opportunities and apply in minutes.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/jobs">
              <Button className="bg-white text-gray-900 hover:bg-white/90">Browse Jobs</Button>
            </Link>
            <Link to="/register/recruiter">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">Post a Job</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
