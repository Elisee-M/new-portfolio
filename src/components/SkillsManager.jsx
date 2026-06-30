import React, { useState } from 'react';
import { usePortfolioData } from '../data/portfolioData';

export default function SkillsManager() {
  const { data, addSkillCategory, updateSkillCategory, deleteSkillCategory } = usePortfolioData();
  const [newCat, setNewCat] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ cat: '', items: [] });

  const handleAddCat = () => {
    if (!newCat.trim()) return;
    addSkillCategory(newCat.trim());
    setNewCat('');
  };

  const startEdit = (index) => {
    const s = data.skills[index];
    setEditing(index);
    setEditForm({
      cat: s.cat,
      items: s.items.map(item =>
        typeof item === 'string'
          ? { name: item, level: 80 }
          : { name: item.name || '', level: item.level ?? 80 }
      )
    });
  };

  const saveEdit = () => {
    if (!editForm.cat.trim()) return;
    updateSkillCategory(editing, {
      cat: editForm.cat.trim(),
      items: editForm.items.map(item => ({
        name: item.name.trim(),
        level: Math.min(100, Math.max(0, Number(item.level) || 80))
      })).filter(item => item.name)
    });
    setEditing(null);
  };

  const updateItem = (index, field, value) => {
    setEditForm(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setEditForm(prev => ({
      ...prev,
      items: [...prev.items, { name: '', level: 80 }]
    }));
  };

  const removeItem = (index) => {
    setEditForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const getLevelColor = (level) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 75) return 'bg-blue-500';
    if (level >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
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
                <div className="space-y-2">
                  {editForm.items.map((item, si) => (
                    <div key={si} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateItem(si, 'name', e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                        placeholder="Skill name"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={item.level}
                        onChange={e => updateItem(si, 'level', Number(e.target.value))}
                        className="w-24 accent-blue-500"
                      />
                      <span className="text-xs font-mono text-blue-400 w-9 text-right">{item.level}%</span>
                      <button onClick={() => removeItem(si)} className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-500/10 border border-red-400/30 text-red-400 hover:bg-red-500/20 text-sm">&times;</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={addItem} className="px-3 py-1.5 text-xs border border-dashed border-blue-400/40 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">+ Add Skill</button>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
                  <button onClick={() => setEditing(null)} className="px-4 py-2 border border-white/10 text-gray-300 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-blue-300 font-semibold mb-3">{skill.cat}</h4>
                  <div className="space-y-2">
                    {skill.items.map((item, si) => {
                      const name = typeof item === 'string' ? item : item.name;
                      const level = typeof item === 'string' ? 80 : (item.level ?? 80);
                      return (
                        <div key={si}>
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-xs text-gray-300">{name}</span>
                            <span className="text-[10px] font-mono text-blue-400/70">{level}%</span>
                          </div>
                          <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${getLevelColor(level)}`} style={{ width: `${level}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 pt-1">
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
