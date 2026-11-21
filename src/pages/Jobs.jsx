import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Building2, ExternalLink, Tag, X, Mail, Globe } from '../components/icons';
import api from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';
import SidebarTopPosts from '../components/SidebarTopPosts';
import { resolveMediaUrl } from '../utils/media';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const res = await api.get('/jobs'); setJobs(res.data?.data || []); }
      catch { setError(t('jobs.failed')); }
      finally { setLoading(false); }
    })();
  }, [t]);

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="mb-10 border-b border-slate-800 pb-6">
            <p className="text-green-400 text-sm font-medium tracking-wide uppercase mb-2">{t('jobs.careers')}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('jobs.openPositions')}</h1>
            <p className="text-slate-400 mt-2 max-w-2xl">{t('jobs.subtitle')}</p>
          </div>

          {error && <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          {loading ? (
            <div className="py-16 flex justify-center"><LoadingSpinner /></div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">{t('jobs.none')}</div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {jobs.map((job) => (
                <article key={job._id} className="group rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden hover:border-green-500/50 hover:bg-slate-900 transition flex flex-col sm:flex-row">
                  <div className="sm:w-44 md:w-52 shrink-0 bg-slate-800 flex items-center justify-center min-h-[140px] sm:min-h-0 border-b sm:border-b-0 sm:border-r border-slate-800 overflow-hidden">
                    {job.image ? (
                      <img src={resolveMediaUrl(job.image)} alt={job.title} className="w-full h-full object-cover min-h-[140px] sm:min-h-[160px]" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-green-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-white leading-tight truncate">{job.title}</h2>
                        <p className="text-sm text-slate-400 inline-flex items-center gap-1 mt-0.5"><Building2 className="h-3.5 w-3.5" /> {job.company}</p>
                      </div>
                      <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">{job.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mb-3">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                      <span className="inline-flex items-center gap-1"><Tag className="h-4 w-4" /> {job.category || t('jobs.general')}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3 flex-1">{job.description}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start rounded-lg bg-green-600 hover:bg-green-500 text-white px-4 py-2.5 text-sm font-medium transition"
                    >
                      {t('jobs.viewJob')} <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <div className="w-full lg:w-96 shrink-0">
          <SidebarTopPosts accent="slate" />
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[115px] bg-black/60 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 px-5 py-4 border-b border-slate-700 flex items-start justify-between gap-3 z-10">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white">{selectedJob.title}</h2>
                <p className="text-sm text-slate-400 mt-0.5 inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {selectedJob.company}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(selectedJob.applyUrl || selectedJob.applyEmail) && (
                  <a
                    href={selectedJob.applyUrl || `mailto:${selectedJob.applyEmail}?subject=${encodeURIComponent(`Application: ${selectedJob.title} - ${selectedJob.company}`)}`}
                    target={selectedJob.applyUrl ? '_blank' : undefined}
                    rel={selectedJob.applyUrl ? 'noreferrer' : undefined}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {t('jobs.applyNow')} <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button onClick={() => setSelectedJob(null)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white" aria-label={t('jobs.close')}><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="p-5 space-y-5">
              {selectedJob.image && (
                <img src={resolveMediaUrl(selectedJob.image)} alt={selectedJob.title} className="w-full max-h-64 object-cover rounded-lg border border-slate-700" />
              )}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">{selectedJob.type}</span>
                <span className="inline-flex items-center gap-1 text-slate-400"><MapPin className="h-4 w-4" /> {selectedJob.location}</span>
                <span className="inline-flex items-center gap-1 text-slate-400"><Tag className="h-4 w-4" /> {selectedJob.category || t('jobs.general')}</span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">{t('dash.description')}</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">{t('jobs.applyNow')}</h3>
                <p className="text-sm text-slate-300 mb-4">{t('jobs.handledByEmployer')}</p>

                {selectedJob.applyUrl && (
                  <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4 mb-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {t('jobs.employerWebsite')}</p>
                    <p className="text-sm text-slate-300 mb-3">{t('jobs.openWebsiteDesc')}</p>
                    <a href={selectedJob.applyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
                      {t('jobs.openForm')} <ExternalLink className="h-4 w-4" />
                    </a>
                    <p className="text-xs text-slate-500 mt-2 break-all">{selectedJob.applyUrl}</p>
                  </div>
                )}

                {selectedJob.applyEmail && (
                  <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4 mb-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {t('jobs.applyByEmail')}</p>
                    <p className="text-sm text-slate-300 mb-3">{t('jobs.emailDesc')}</p>
                    <a href={`mailto:${selectedJob.applyEmail}?subject=${encodeURIComponent(`Application: ${selectedJob.title} - ${selectedJob.company}`)}`} className="inline-flex items-center gap-2 border border-green-500/40 text-green-400 hover:bg-green-500/10 px-4 py-2.5 rounded-lg text-sm font-medium">
                      {t('jobs.emailEmployer')} <Mail className="h-4 w-4" />
                    </a>
                    <p className="text-xs text-slate-400 mt-2 break-all">{selectedJob.applyEmail}</p>
                  </div>
                )}

                {!selectedJob.applyUrl && !selectedJob.applyEmail && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                    {t('jobs.noInfo', { company: selectedJob.company })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
