import React, { useState, useRef } from 'react';
import { usePortfolioData } from '../data/portfolioData';
import ProjectsManager from './ProjectsManager';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import CertificationsManager from './CertificationsManager';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminPanel({ onClose }) {
  const [loggedIn, setLoggedIn] = useState(() => !!sessionStorage.getItem('portfolio_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('projects');
  const { data, resetData, updateCvUrl } = usePortfolioData();
  const [cvUploading, setCvUploading] = useState(false);
  const cvFileRef = useRef(null);

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }
    setCvUploading(true);
    const fd = new FormData();
    fd.append('cv', file);
    try {
      const res = await fetch(`${API_URL}/cv/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('portfolio_token')}` },
        body: fd
      });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      updateCvUrl(url);
      alert('CV uploaded successfully!');
    } catch {
      alert('Failed to upload CV');
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
              <p className="text-xs text-gray-500 mt-3">Only PDF files up to 10MB are accepted.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
