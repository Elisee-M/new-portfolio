import React, { useState } from 'react';
import { usePortfolioData } from '../data/portfolioData';

export default function CertificationsManager() {
  const { data, addCertification, updateCertification, deleteCertification } = usePortfolioData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', issuer: '', date: '', desc: '' });

  const resetForm = () => setForm({ title: '', issuer: '', date: '', desc: '' });

  const handleAdd = () => {
    if (!form.title.trim() || !form.issuer.trim()) return;
    addCertification(form);
    resetForm();
  };

  const handleEdit = (cert) => {
    setEditing(cert.id);
    setForm({ title: cert.title, issuer: cert.issuer, date: cert.date, desc: cert.desc });
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.issuer.trim()) return;
    updateCertification(editing, form);
    setEditing(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditing(null);
    resetForm();
  };

  const fields = [
    { key: 'title', placeholder: 'Certification title' },
    { key: 'issuer', placeholder: 'Issuing organization' },
    { key: 'date', placeholder: 'Year obtained (e.g. 2024)' },
    { key: 'desc', placeholder: 'Description' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-100 mb-4">
          {editing ? 'Edit Certification' : 'Add New Certification'}
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
        {data.certifications.map(c => (
          <div key={c.id} className="flex items-start gap-4 bg-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/30">
            <div className="flex-1 min-w-0">
              <h4 className="text-blue-300 font-semibold">{c.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-blue-400/70">{c.issuer}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{c.date}</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">{c.desc}</p>
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
