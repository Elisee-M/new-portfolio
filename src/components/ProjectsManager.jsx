import React, { useState } from 'react';
import { usePortfolioData } from '../data/portfolioData';

export default function ProjectsManager() {
  const { data, addProject, updateProject, deleteProject } = usePortfolioData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', desc: '', tech: '' });

  const resetForm = () => setForm({ title: '', desc: '', tech: '' });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addProject({ title: form.title, desc: form.desc, tech: form.tech });
    resetForm();
  };

  const handleEdit = (project) => {
    setEditing(project.id);
    setForm({ title: project.title, desc: project.desc, tech: project.tech });
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
          <input
            type="text"
            placeholder="Tech (comma separated)"
            value={form.tech}
            onChange={e => setForm(p => ({ ...p, tech: e.target.value }))}
            className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
          {editing ? (
            <>
              <button onClick={handleSave} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Save</button>
              <button onClick={handleCancel} className="px-5 py-2.5 border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl font-medium transition-colors">Cancel</button>
            </>
          ) : (
            <button onClick={handleAdd} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Add</button>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {data.projects.map(p => (
          <div key={p.id} className="flex items-start gap-4 bg-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/30">
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
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(p)} className="px-3 py-1.5 text-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">Edit</button>
              <button onClick={() => deleteProject(p.id)} className="px-3 py-1.5 text-sm border border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
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
