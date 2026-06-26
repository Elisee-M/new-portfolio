import React, { useState } from 'react';
import { usePortfolioData } from '../data/portfolioData';

export default function CertificationsManager() {
  const { data, addCertification, updateCertification, deleteCertification } = usePortfolioData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', date: '', credentialUrl: '' });

  const resetForm = () => setForm({ name: '', date: '', credentialUrl: '' });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addCertification({ name: form.name, date: form.date, credentialUrl: form.credentialUrl });
    resetForm();
  };

  const handleEdit = (cert) => {
    setEditing(cert.id);
    setForm({
      name: cert.name || '',
      date: cert.date || '',
      credentialUrl: cert.credentialUrl || ''
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    updateCertification(editing, form);
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
          {editing ? 'Edit Certification' : 'Add New Certification'}
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Certification name"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
            <input
              type="text"
              placeholder="Date obtained (e.g. 2024)"
              value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="flex-1 min-w-[180px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Credential URL (optional)"
              value={form.credentialUrl}
              onChange={e => setForm(p => ({ ...p, credentialUrl: e.target.value }))}
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
            <div className="flex items-center gap-3">
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
        </div>
      </div>
      <div className="space-y-3">
        {data.certifications.map(c => (
          <div key={c.id} className="flex items-start gap-4 bg-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/30">
            <div className="flex-1 min-w-0">
              <h4 className="text-blue-300 font-semibold">{c.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{c.date}</span>
                {c.credentialUrl && (
                  <>
                    <span className="text-xs text-gray-600">•</span>
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400/70 hover:text-blue-300 underline underline-offset-2">
                      View Credential
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(c)} className="px-3 py-1.5 text-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">Edit</button>
              <button onClick={() => deleteCertification(c.id)} className="px-3 py-1.5 text-sm border border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        ))}
        {data.certifications.length === 0 && (
          <p className="text-gray-500 text-center py-8">No certifications yet.</p>
        )}
      </div>
    </div>
  );
}
