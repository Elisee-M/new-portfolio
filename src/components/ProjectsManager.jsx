import React, { useState, useRef } from 'react';
import { usePortfolioData } from '../data/portfolioData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ProjectsManager() {
  const { data, addProject, updateProject, deleteProject } = usePortfolioData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', desc: '', tech: '', image: '', demo: '', source: '' });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const resetForm = () => setForm({ title: '', desc: '', tech: '', image: '', demo: '', source: '' });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('portfolio_token')}` },
        body: fd
      });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setForm(p => ({ ...p, image: url }));
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addProject({
      title: form.title,
      desc: form.desc,
      tech: form.tech,
      image: form.image,
      demo: form.demo,
      source: form.source
    });
    resetForm();
  };

  const handleEdit = (project) => {
    setEditing(project._id || project.id);
    setForm({
      title: project.title || '',
      desc: project.desc || '',
      tech: project.tech || '',
      image: project.image || '',
      demo: project.demo || '',
      source: project.source || ''
    });
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    updateProject(editing, form);
    setEditing(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditing(null);
    resetForm();
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-100 mb-4">
          {editing ? 'Edit Project' : 'Add New Project'}
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Project title"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.desc}
              onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Tech stack (comma separated)"
              value={form.tech}
              onChange={e => setForm(p => ({ ...p, tech: e.target.value }))}
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
            <div className="flex-1 min-w-[200px] flex gap-2">
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={form.image}
                onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-3 py-2.5 bg-slate-700 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-slate-600 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Demo URL (optional)"
              value={form.demo}
              onChange={e => setForm(p => ({ ...p, demo: e.target.value }))}
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
            <input
              type="text"
              placeholder="Source Code URL (optional)"
              value={form.source}
              onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div>
            {editing ? (
              <>
                <button onClick={handleSave} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors mr-3">Save</button>
                <button onClick={handleCancel} className="px-5 py-2.5 border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl font-medium transition-colors">Cancel</button>
              </>
            ) : (
              <button onClick={handleAdd} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Add</button>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {data.projects.map(p => (
          <div key={p._id || p.id} className="flex items-start gap-4 bg-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/30">
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="w-20 h-20 rounded-lg object-cover shrink-0 border border-white/10"
                onError={e => { e.target.style.display = 'none' }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-blue-300 font-semibold">{p.title}</h4>
              <p className="text-gray-400 text-sm mt-1">{p.desc}</p>
              {p.tech && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tech.split(', ').map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/20 rounded text-xs text-blue-400/80">{t}</span>
                  ))}
                </div>
              )}
              {(p.demo || p.source) && (
                <div className="flex gap-2 mt-2">
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-600/20 border border-blue-400/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      Demo
                    </a>
                  )}
                  {p.source && (
                    <a href={p.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-700/50 border border-white/20 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      Source
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(p)} className="px-3 py-1.5 text-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">Edit</button>
              <button onClick={() => deleteProject(p._id || p.id)} className="px-3 py-1.5 text-sm border border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {data.projects.length === 0 && (
          <p className="text-gray-500 text-center py-8">No projects yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
