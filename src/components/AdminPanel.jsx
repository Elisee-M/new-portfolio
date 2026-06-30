import React, { useState, useRef, useEffect } from 'react';
import { usePortfolioData } from '../data/portfolioData';
import ProjectsManager from './ProjectsManager';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import CertificationsManager from './CertificationsManager';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function AdminPanel({ onClose }) {
  const [loggedIn, setLoggedIn] = useState(() => !!sessionStorage.getItem('portfolio_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('projects');
  const { data, ratings, resetData, updateCvUrl, fetchRatings } = usePortfolioData();
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState('');
  const cvFileRef = useRef(null);

  useEffect(() => {
    if (loggedIn) fetchRatings();
  }, [loggedIn, fetchRatings]);

  useEffect(() => {
    if (loggedIn && tab === 'ratings') fetchRatings();
  }, [tab, loggedIn, fetchRatings]);

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvError('');
    setCvUploading(true);
    const fd = new FormData();
    fd.append('cv', file);
    try {
      const res = await fetch(`${API_URL}/cv/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('portfolio_token')}` },
        body: fd
      });
      if (!res.ok) {
        let errMsg;
        try {
          const errData = await res.json();
          errMsg = errData.error || `Server error (${res.status})`;
        } catch {
          const text = await res.text();
          errMsg = text || `Server error (${res.status})`;
        }
        throw new Error(errMsg);
      }
      const { url } = await res.json();
      updateCvUrl(url);
      setCvError('');
      alert('CV uploaded successfully!');
    } catch (err) {
      setCvError(err.message);
    } finally {
      setCvUploading(false);
      if (cvFileRef.current) cvFileRef.current.value = '';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        setError('Invalid email or password');
        return;
      }
      const { token } = await res.json();
      sessionStorage.setItem('portfolio_token', token);
      setLoggedIn(true);
    } catch {
      setError('Could not connect to server');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('portfolio_token');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-blue-100 mb-2">Admin Access</h2>
            <p className="text-gray-400 text-sm mb-6">Enter password to manage portfolio content.</p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-blue-500/50"
                autoFocus
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-blue-500/50"
              />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
                  Login
                </button>
                <button type="button" onClick={onClose} className="px-6 py-3 border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl font-medium transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'ratings', label: 'Ratings' },
    { id: 'cv', label: 'CV / Resume' }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-blue-100">Portfolio Admin</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={resetData}
            className="px-4 py-2 text-sm border border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border border-white/10 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
          >
            Logout
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b border-white/5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.id
                ? 'bg-blue-600/20 text-blue-300 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'projects' && <ProjectsManager />}
        {tab === 'skills' && <SkillsManager />}
        {tab === 'experience' && <ExperienceManager />}
        {tab === 'certifications' && <CertificationsManager />}
        {tab === 'ratings' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-100 mb-4">Star Ratings</h3>
            {ratings.length === 0 ? (
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <p className="text-gray-400 text-sm">No ratings yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-left">
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Type</th>
                      <th className="pb-3 pr-4 font-medium">Project</th>
                      <th className="pb-3 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((r, i) => (
                      <tr key={r._id || i} className="border-b border-white/5 text-gray-300 hover:bg-white/5">
                        <td className="py-3 pr-4 whitespace-nowrap text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 pr-4 font-medium">{r.name}</td>
                        <td className="py-3 pr-4 text-gray-400">{r.email || '—'}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-0.5 rounded text-xs ${r.type === 'overall' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                            {r.type === 'overall' ? 'Overall' : 'Project'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-400">{r.projectTitle || '—'}</td>
                        <td className="py-3">
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-400">{'★'.repeat(r.rating)}</span>
                            <span className="text-gray-600">{'★'.repeat(5 - r.rating)}</span>
                            <span className="text-gray-500 ml-1">({r.rating}/5)</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === 'cv' && (
          <div>
            <h3 className="text-lg font-semibold text-blue-100 mb-4">CV / Resume</h3>
            <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-4">
                {data.cvUrl
                  ? 'A CV PDF is currently uploaded. You can replace it below.'
                  : 'No CV uploaded yet. Upload a PDF file below.'}
              </p>
              {data.cvUrl && (
                <div className="mb-4">
                  <a
                    href={data.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    View Current CV
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input
                  ref={cvFileRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleCvUpload}
                  className="hidden"
                />
                <button
                  onClick={() => cvFileRef.current?.click()}
                  disabled={cvUploading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {cvUploading ? 'Uploading...' : data.cvUrl ? 'Replace CV' : 'Upload CV'}
                </button>
                {cvUploading && <span className="text-sm text-blue-400">Uploading...</span>}
              </div>
              {cvError && <p className="text-sm text-red-400 mt-3">{cvError}</p>}
              <p className="text-xs text-gray-500 mt-3">Only PDF files up to 10MB are accepted.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
