import React, { useState } from 'react';
import { usePortfolioData } from '../data/portfolioData';

export default function ExperienceManager() {
  const { data, addExperience, updateExperience, deleteExperience } = usePortfolioData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', org: '', period: '', desc: '' });

  const resetForm = () => setForm({ title: '', org: '', period: '', desc: '' });

  const handleAdd = () => {
    if (!form.title.trim() || !form.org.trim()) return;
    addExperience(form);
    resetForm();
  };

  const handleEdit = (exp) => {
    setEditing(exp._id || exp.id);
    setForm({ title: exp.title, org: exp.org, period: exp.period, desc: exp.desc });
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.org.trim()) return;
    updateExperience(editing, form);
    setEditing(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditing(null);
    resetForm();
  };

  const fields = [
    { key: 'title', placeholder: 'Job title' },
    { key: 'org', placeholder: 'Organization' },
    { key: 'period', placeholder: 'Period (e.g. 2023 - Present)' },
    { key: 'desc', placeholder: 'Description' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-100 mb-4">
          {editing ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        <div className="flex flex-wrap gap-3">
          {fields.map(f => (
            <input
              key={f.key}
              type="text"
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="flex-1 min-w-[180px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          ))}
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
        {data.experiences.map(e => (
          <div key={e._id || e.id} className="flex items-start gap-4 bg-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/30">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-400/60 mb-1 font-mono">{e.period}</p>
              <h4 className="text-blue-300 font-semibold">{e.title}</h4>
              <p className="text-xs text-blue-400/70 mt-0.5">{e.org}</p>
              <p className="text-gray-400 text-sm mt-1">{e.desc}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(e)} className="px-3 py-1.5 text-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">Edit</button>
              <button onClick={() => deleteExperience(e._id || e.id)} className="px-3 py-1.5 text-sm border border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {data.experiences.length === 0 && (
          <p className="text-gray-500 text-center py-8">No experience entries yet.</p>
        )}
      </div>
    </div>
  );
}
