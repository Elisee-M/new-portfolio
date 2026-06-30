import React, { useState } from 'react';
import { usePortfolioData } from '../data/portfolioData';

export default function SkillsManager() {
  const { data, addSkillCategory, updateSkillCategory, deleteSkillCategory } = usePortfolioData();
  const [newCat, setNewCat] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ cat: '', items: '' });

  const handleAddCat = () => {
    if (!newCat.trim()) return;
    addSkillCategory(newCat.trim());
    setNewCat('');
  };

  const startEdit = (index) => {
    const s = data.skills[index];
    setEditing(index);
    setEditForm({ cat: s.cat, items: s.items.join(', ') });
  };

  const saveEdit = () => {
    if (!editForm.cat.trim()) return;
    updateSkillCategory(editing, {
      cat: editForm.cat.trim(),
      items: editForm.items.split(',').map(s => s.trim()).filter(Boolean)
    });
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-100 mb-4">Add Skill Category</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Category name (e.g. Frontend)"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
          <button onClick={handleAddCat} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">Add</button>
        </div>
      </div>
      <div className="space-y-4">
        {data.skills.map((skill, i) => (
          <div key={i} className="bg-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/30">
            {editing === i ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.cat}
                  onChange={e => setEditForm(f => ({ ...f, cat: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  placeholder="Category"
                />
                <input
                  type="text"
                  value={editForm.items}
                  onChange={e => setEditForm(f => ({ ...f, items: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  placeholder="Skills (comma separated)"
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
                  <button onClick={() => setEditing(null)} className="px-4 py-2 border border-white/10 text-gray-300 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-blue-300 font-semibold mb-2">{skill.cat}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.items.map((item, si) => (
                      <span key={si} className="px-2 py-1 bg-blue-500/10 border border-blue-400/20 rounded text-xs text-blue-300">{item}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(i)} className="px-3 py-1.5 text-sm border border-blue-400/30 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">Edit</button>
                  <button onClick={() => deleteSkillCategory(i)} className="px-3 py-1.5 text-sm border border-red-400/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {data.skills.length === 0 && (
          <p className="text-gray-500 text-center py-8">No skill categories yet.</p>
        )}
      </div>
    </div>
  );
}
