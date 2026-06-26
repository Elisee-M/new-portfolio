import React from 'react';
import { usePortfolioData } from '../data/portfolioData';

export default function CertificationsSection() {
  const { data } = usePortfolioData();

  return (
    <div>
      <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Credentials</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">Certifications</h2>
      <div className="space-y-3">
        {data.certifications.map((c, i) => (
          <div key={c.id} className="card-in group backdrop-blur-2xl bg-slate-900/80 border border-white/10 rounded-xl p-5 hover:bg-blue-500/10 hover:border-blue-400/40 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-blue-300 mb-1 group-hover:text-blue-200">{c.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-blue-400/70">{c.issuer}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">{c.date}</span>
                </div>
                {c.desc && (
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">{c.desc}</p>
                )}
              </div>
              <svg className="w-8 h-8 shrink-0 text-blue-400/30 group-hover:text-blue-400/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
