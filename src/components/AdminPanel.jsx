import React, { useState } from 'react';
import { usePortfolioData } from '../data/portfolioData';
import ProjectsManager from './ProjectsManager';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import CertificationsManager from './CertificationsManager';

const ADMIN_PASSWORD = 'admin123';

export default function AdminPanel({ onClose }) {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('portfolio_admin') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('projects');
  const { data, resetData } = usePortfolioData();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('portfolio_admin', 'true');
      setLoggedIn(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('portfolio_admin');
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-blue-500/50"
                autoFocus
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
    { id: 'certifications', label: 'Certifications' }
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
      </div>
    </div>
  );
}
