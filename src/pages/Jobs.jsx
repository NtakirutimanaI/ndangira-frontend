import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Building2, ExternalLink, Tag } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const res = await api.get('/jobs'); setJobs(res.data?.data || []); }
      catch { setError('Failed to load job opportunities'); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-green-400 text-sm font-medium tracking-wide uppercase mb-2">Careers & Opportunities</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Open Positions</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">Browse published opportunities from Ndangira and our partners across Rwanda.</p>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

        {loading ? (
          <div className="py-16 flex justify-center"><LoadingSpinner /></div>
        ) : jobs.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">No published job opportunities at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <article key={job._id} className="group rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-green-500/50 hover:bg-slate-900 transition flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-white leading-tight truncate">{job.title}</h2>
                      <p className="text-sm text-slate-400 inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {job.company}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">{job.type}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mb-3">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                  <span className="inline-flex items-center gap-1"><Tag className="h-4 w-4" /> {job.category || 'General'}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-4 flex-1">{job.description}</p>
                <a
                  href={job.applyUrl || `mailto:${job.applyEmail || 'info@ndangira.com'}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                  target={job.applyUrl ? '_blank' : undefined}
                  rel={job.applyUrl ? 'noreferrer' : undefined}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 hover:bg-green-500 text-white px-4 py-2.5 text-sm font-medium transition"
                >
                  Apply Now <ExternalLink className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
