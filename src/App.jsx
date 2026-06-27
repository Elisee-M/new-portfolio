import React, { useEffect, useRef, useMemo, useState } from 'react';
import { PortfolioDataProvider, usePortfolioData } from './data/portfolioData';
import AdminPanel from './components/AdminPanel';
import CertificationsSection from './components/CertificationsSection';
import Typewriter from './components/Typewriter';

/* global gsap, ScrollTrigger */

const navLinks = [
  { id: 'hero', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'about', label: 'About', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'skills', label: 'Skills', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'projects', label: 'Projects', icon: 'M21 13.255A23.93 23.93 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'experience', label: 'Experience', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: 'certifications', label: 'Certifications', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
];

const loaderSteps = [
  { text: 'Initializing environment...', done: 15 },
  { text: 'Connecting to database...', done: 30 },
  { text: 'Fetching portfolio data...', done: 50 },
  { text: 'Optimizing assets...', done: 70 },
  { text: 'Rendering components...', done: 90 },
  { text: 'Portfolio ready!', done: 100 }
];

const sectionMeta = [
  { id: 'hero', side: 'right' },
  { id: 'about', side: 'left' },
  { id: 'skills', side: 'left' },
  { id: 'projects', side: 'right' },
  { id: 'experience', side: 'right' },
  { id: 'certifications', side: 'left' },
  { id: 'contact', side: 'left' }
];

const PortfolioWebsite = () => {
  const { data } = usePortfolioData();
  const [showAdmin, setShowAdmin] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingName, setRatingName] = useState('');
  const [ratingEmail, setRatingEmail] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [heroPhase, setHeroPhase] = useState(0);
  const [nameDone, setNameDone] = useState(false);
  const [subtitleDone, setSubtitleDone] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0);
  const [photoVisible, setPhotoVisible] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [projectRatingStates, setProjectRatingStates] = useState({});
  // projectRatingStates shape: { [key]: { rating: number, name: string, submitted: boolean } }
  const [projectRatingNameInputs, setProjectRatingNameInputs] = useState({});

  useEffect(() => { window.scrollTo(0, 0); window.history.scrollRestoration = 'manual'; }, []);

  useEffect(() => {
    if (!photoVisible || !photoRef.current) return;
    const el = photoRef.current;
    el.style.transition = 'opacity 0.8s ease';
    el.style.opacity = '1';
  }, [photoVisible]);

  useEffect(() => {
    if (loadingStep >= loaderSteps.length) return;
    const timer = setTimeout(() => {
      setLoadingProgress(loaderSteps[loadingStep].done);
      setLoadingStep((s) => s + 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [loadingStep]);

  useEffect(() => {
    if (loadingStep === loaderSteps.length) {
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [loadingStep]);

  // Hero entrance sequence
  useEffect(() => {
    if (loading) return;
    setHeroPhase(1); // show Hello
  }, [loading]);

  useEffect(() => {
    if (heroPhase !== 1) return;
    const t = setTimeout(() => { setHeroPhase(2); setPhotoVisible(true); }, 500); // show name + photo
    return () => clearTimeout(t);
  }, [heroPhase]);

  useEffect(() => {
    if (heroPhase !== 2 || !nameDone) return;
    const t = setTimeout(() => setHeroPhase(3), 1000); // after name done + 1s, show subtitle
    return () => clearTimeout(t);
  }, [heroPhase, nameDone]);

  useEffect(() => {
    if (heroPhase !== 3 || !subtitleDone) return;
    const t = setTimeout(() => setHeroPhase(4), 500); // after subtitle done + 0.5s, show desc
    return () => clearTimeout(t);
  }, [heroPhase, subtitleDone]);

  useEffect(() => {
    if (heroPhase !== 4) return;
    const t = setTimeout(() => setHeroPhase(5), 1000); // 1s later, show buttons
    return () => clearTimeout(t);
  }, [heroPhase]);

  useEffect(() => {
    if (heroPhase !== 5) return;
    const t = setTimeout(() => setSidebarKey((k) => k + 1), 500); // 0.5s after buttons, animate sidebar
    return () => clearTimeout(t);
  }, [heroPhase]);

  const photoRef = useRef(null);
  const contentRef = useRef(null);
  const progressRef = useRef(null);
  const sectionRefs = useRef([]);
  const currentSection = useRef(0);

  const sections = useMemo(() => [
    {
      id: 'hero', side: 'right',
      content: (
        <div className="hero-section">
          <p className="text-blue-400 font-mono text-xs sm:text-sm mb-4 tracking-[0.2em] uppercase" style={{ opacity: heroPhase >= 1 ? 1 : 0, transform: heroPhase >= 1 ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>Hello ✌, I'm</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent min-h-[1.2em]" style={{ opacity: heroPhase >= 2 ? 1 : 0, transform: heroPhase >= 2 ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
            {heroPhase >= 2 && <Typewriter words={['Elisee']} loop={false} typeSpeed={80} showCursor={false} startDelay={200} onFirstDone={() => setNameDone(true)} />}
          </h1>
          <p className="text-lg md:text-xl text-blue-200/80 mb-6 font-light min-h-[1.5em]" style={{ opacity: heroPhase >= 3 ? 1 : 0, transform: heroPhase >= 3 ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>{heroPhase >= 3 && <Typewriter startDelay={200} onFirstDone={() => setSubtitleDone(true)} />}</p>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-md" style={{ opacity: heroPhase >= 4 ? 1 : 0, transform: heroPhase >= 4 ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>I craft seamless digital experiences and bridge the gap between hardware and software through innovative solutions.</p>
          <div className="flex gap-3 sm:gap-4 flex-wrap" style={{ opacity: heroPhase >= 5 ? 1 : 0, transform: heroPhase >= 5 ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
            <a href="#about" className="cta-primary">Explore My Work</a>
            <a href="#contact" className="cta-secondary">Contact Me</a>
            <a
              href={data.cvUrl || '#'}
              download={data.cvUrl ? 'Elisee_CV.pdf' : undefined}
              onClick={data.cvUrl ? undefined : (e) => { e.preventDefault(); alert('CV not available yet.'); }}
              className="cta-secondary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download CV
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'about', side: 'left',
      content: (
        <div>
          <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">About</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">About Me</h2>
          <div className="space-y-4">
            <p className="animate-in text-gray-300 leading-relaxed">I'm a full-stack developer passionate about embedded systems, hardware prototyping, and creating seamless digital experiences. With expertise in Arduino, IoT, and modern web technologies, I bridge the gap between hardware and software.</p>
            <p className="animate-in text-gray-400 leading-relaxed">Based in Rwanda, I thrive on solving complex problems and turning ideas into functional, beautiful products.</p>
            <p className="animate-in text-gray-400 leading-relaxed">When I'm not coding, you'll find me exploring new technologies, contributing to open-source, or mentoring aspiring developers.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="cta-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.93 23.93 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              View My Projects
            </a>
            <a href="#contact" className="cta-secondary">Let's Connect</a>
          </div>
        </div>
      )
    },
    {
      id: 'skills', side: 'left',
      content: (
        <div>
          <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Expertise</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">Skills & Technologies</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.skills.map((group, gi) => (
              <div key={gi} className="card-in backdrop-blur-2xl bg-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/30">
                <h3 className="text-blue-400 font-semibold mb-2 text-xs tracking-wider uppercase">{group.cat}</h3>
                <div className="flex flex-wrap gap-1.5">{group.items.map((s, si) => <span key={si} className="px-2 py-1 bg-blue-500/10 border border-blue-400/20 rounded text-xs text-blue-300">{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'projects', side: 'right',
      content: (
        <div>
          <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Portfolio</p>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-100">Projects</h2>
            <button onClick={() => setShowAllProjects(true)} className="cta-primary">
              <span>View All</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
          <div className="space-y-3">
            {data.projects.map((p, i) => {
              const isExpanded = expandedProjects[i] || false;
              const rs = projectRatingStates[i] || {};
              return (
                <div key={p._id || p.id || i} className="card-in group backdrop-blur-2xl bg-slate-900/80 border border-white/10 rounded-xl p-5 hover:bg-blue-500/10 hover:border-blue-400/40 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-blue-300 mb-1 group-hover:text-blue-200">{p.title}</h3>
                      <p className="text-sm text-gray-400 mb-2 leading-relaxed">{p.desc}</p>
                      <div className="flex items-center gap-2">
                        {p.demo && (
                          <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600/20 border border-blue-400/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedProjects(prev => ({ ...prev, [i]: !prev[i] }))}
                      className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/80 border border-blue-400/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/60 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all"
                    >
                      <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-3">
                      {p.image && (
                        <img src={p.image} alt={p.title} className="w-full h-40 object-cover rounded-lg border border-white/10" onError={e => { e.target.style.display = 'none' }} />
                      )}
                      {p.tech && <div className="flex flex-wrap gap-1.5">{p.tech.split(', ').map((t, ti) => <span key={ti} className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/20 rounded text-xs text-blue-400/80">{t}</span>)}</div>}
                      {p.source && (
                        <a href={p.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-700/50 border border-white/20 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                          Source
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5">
                    {rs.submitted ? (
                      <p className="text-xs text-blue-400/80 italic">Thank you, {rs.name}! Rated {rs.rating}/5</p>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => {
                                if (!rs.rating) {
                                  setProjectRatingStates(prev => ({ ...prev, [i]: { rating: star, name: '', submitted: false } }));
                                }
                              }}
                              className={`text-lg transition-all ${rs.rating ? (star <= rs.rating ? 'text-yellow-400 scale-110' : 'text-gray-600') : 'text-gray-600 hover:text-yellow-400 hover:scale-125'}`}
                            >
                              ★
                            </button>
                          ))}
                          {rs.rating > 0 && !rs.submitted && (
                            <span className="text-xs text-gray-500 ml-1">({rs.rating}/5)</span>
                          )}
                        </div>
                        {rs.rating > 0 && !rs.submitted && (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="text"
                              placeholder="Your name"
                              value={projectRatingNameInputs[i] || ''}
                              onChange={e => setProjectRatingNameInputs(prev => ({ ...prev, [i]: e.target.value }))}
                              className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                            />
                            <button
                              onClick={() => {
                                const name = (projectRatingNameInputs[i] || '').trim();
                                if (!name) return;
                                setProjectRatingStates(prev => ({ ...prev, [i]: { ...prev[i], name, submitted: true } }));
                              }}
                              className="px-3 py-1.5 text-xs bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors"
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowAllProjects(true)} className="sm:hidden mt-4 w-full cta-primary justify-center">
            <span>View All Projects</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>

          {/* Rating */}
          <div className="mt-8 p-5 backdrop-blur-2xl bg-slate-900/80 border border-white/10 rounded-xl">
            <p className="text-sm text-gray-300 mb-3">Rate my work</p>
            {ratingSubmitted ? (
              <p className="text-sm text-blue-400">Thank you for your feedback!</p>
            ) : (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => { setRating(star); setShowRatingModal(true); }}
                    className="text-2xl transition-colors"
                  >
                    <span className={star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rating Modal */}
          {showRatingModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRatingModal(false)}>
              <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                <p className="text-blue-400 font-mono text-xs mb-1 tracking-[0.2em] uppercase">Feedback</p>
                <h3 className="text-lg font-semibold text-blue-100 mb-4">You rated {rating} / 5</h3>
                <input
                  type="text"
                  placeholder="Your name *"
                  value={ratingName}
                  onChange={(e) => setRatingName(e.target.value)}
                  className="w-full mb-3 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
                <input
                  type="email"
                  placeholder="Your email (optional)"
                  value={ratingEmail}
                  onChange={(e) => setRatingEmail(e.target.value)}
                  className="w-full mb-4 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowRatingModal(false); setRating(0); }}
                    className="flex-1 px-4 py-2.5 border border-white/10 rounded-lg text-gray-400 text-sm hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!ratingName.trim()) return;
                      setRatingSubmitted(true);
                      setShowRatingModal(false);
                      setRatingName('');
                      setRatingEmail('');
                    }}
                    className="flex-1 px-4 py-2.5 bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-300 text-sm hover:bg-blue-500/30"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'experience', side: 'right',
      content: (
        <div>
          <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Career</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">Experience</h2>
          <div className="timeline relative pl-8 border-l-2 border-blue-500/30">
            <div className="timeline-line absolute left-0 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500 origin-top"></div>
            {data.experiences.map((exp, i) => (
              <div key={exp._id || exp.id || i} className="timeline-item relative mb-8 last:mb-0">
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-950"></div>
                <div className="backdrop-blur-2xl bg-slate-900/80 border border-white/10 rounded-xl p-4 hover:border-blue-500/30">
                  <p className="text-xs text-blue-400/60 mb-1 font-mono">{exp.period}</p>
                  <h3 className="text-base font-semibold text-blue-300 mb-1">{exp.title}</h3>
                  <p className="text-xs text-blue-400/70 mb-1">{exp.org}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a href="#contact" className="cta-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Hire Me
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'certifications', side: 'left',
      content: <CertificationsSection onViewAll={() => setShowAllCertifications(true)} />
    },
    {
      id: 'contact', side: 'left',
      content: (
        <div>
          <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Connect</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-100">Let's Work Together</h2>
          <p className="text-gray-400 mb-8 leading-relaxed max-w-md">Have a project in mind? I'd love to hear from you.</p>
          <div className="animate-in flex flex-col sm:flex-row gap-3">
            <a href="mailto:hello@elisee.dev" className="cta-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email Me
            </a>
            <a href="https://github.com/elisee" target="_blank" rel="noopener noreferrer" className="cta-secondary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              GitHub
            </a>
            <a href="https://linkedin.com/in/elisee" target="_blank" rel="noopener noreferrer" className="cta-secondary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              LinkedIn
            </a>
          </div>
        </div>
      )
    }
  ], [data, rating, hoverRating, showRatingModal, ratingName, ratingEmail, ratingSubmitted, heroPhase, expandedProjects, projectRatingStates, projectRatingNameInputs]);

  const navPositions = useMemo(() => {
    const r = 95;
    const centerRight = 16;
    const centerY = typeof window !== 'undefined' ? window.innerHeight * 0.45 : 500;
    return navLinks.map((link, i) => {
      const angle = 270 + i * 30;
      const rad = angle * Math.PI / 180;
      return {
        link,
        right: centerRight + Math.cos(rad) * r - 16,
        top: centerY + Math.sin(rad) * r - 16
      };
    });
  }, []);

  useEffect(() => {
    let mm = null;

    const loadGSAP = () => {
      const s1 = document.createElement('script');
      s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      s1.async = true;
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
      s2.async = true;
      s1.onload = () => { document.body.appendChild(s2); s2.onload = () => { gsap.registerPlugin(ScrollTrigger); init(); }; };
      document.body.appendChild(s1);
    };

    const init = () => {
      if (!window.gsap) return;
      const photo = photoRef.current;
      const content = contentRef.current;
      const progress = progressRef.current;
      const secs = sectionRefs.current.filter(Boolean);
      const total = secs.length;
      const photoLeft = 15;
      const photoRight = 75;

      if (mm) mm.revert();
      mm = ScrollTrigger.matchMedia();

      mm.add('(max-width: 1023px)', () => {
        const photoInner = photo.querySelector('.rounded-full.overflow-hidden');
        const photoGlow = photo.querySelector('.rounded-full.absolute');

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        gsap.set(photo, { xPercent: -50, yPercent: 0, left: '50%', top: '70%' });
        gsap.set(photoInner, { position: 'absolute', top: '50%', left: '50%', xPercent: -50, yPercent: -50 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: content, start: 'top top', end: '+=1000', scrub: 1.5 }
        });
        tl.to(photo, { top: '50%', yPercent: -50, ease: 'power2.inOut' }, 0);
        tl.to(photoInner, { borderRadius: '0%', width: vw, height: vh, ease: 'power2.inOut' }, 0);
        tl.to(photoGlow, { opacity: 0, ease: 'power2.inOut' }, 0);

        ScrollTrigger.create({
          trigger: content,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const p = self.progress;

            const sw = 1 / total;
            const cs = Math.min(Math.floor(p / sw), total - 1);
            if (cs !== currentSection.current) {
              currentSection.current = cs;
              document.querySelectorAll('.mob-nav-btn').forEach((el, i) => el.classList.toggle('active', i === cs));
            }

            if (progress) progress.style.width = `${p * 100}%`;
          }
        });
      });

      mm.add('(min-width: 1024px)', () => {
        const target = sectionMeta[0]?.side === 'right' ? photoRight : photoLeft;
        gsap.set(photo, { xPercent: -50, yPercent: -50, left: `${target}%` });
        const setPhotoY = gsap.quickSetter(photo, 'y', 'px');

        ScrollTrigger.create({
          trigger: content,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const p = self.progress;
            const sw = 1 / total;
            const cs = Math.min(Math.floor(p / sw), total - 1);

            if (cs !== currentSection.current) {
              currentSection.current = cs;
              document.querySelectorAll('.sidebar-btn').forEach((el, i) => el.classList.toggle('active', i === cs));
              document.querySelectorAll('.mob-nav-btn').forEach((el, i) => el.classList.toggle('active', i === cs));
              const target = sectionMeta[cs]?.side === 'right' ? photoRight : photoLeft;
              gsap.to(photo, { left: `${target}%`, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
            }

            setPhotoY(Math.sin(p * Math.PI * 3) * 12);

            if (progress) progress.style.width = `${p * 100}%`;
          }
        });
      });

      ScrollTrigger.refresh();
    };

    loadGSAP();
    return () => {
      if (mm) mm.revert();
      if (window.ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Smooth scroll on sidebar / mobile nav clicks
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Loader overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950" style={{ transition: 'opacity 0.4s' }}>
          <div className="w-full max-w-xs mx-6">
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <p className="text-sm text-gray-400 font-mono">
                {loaderSteps[Math.min(loadingStep, loaderSteps.length - 1)]?.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-50">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '0%' }}></div>
      </div>

      {/* ===== FIXED PHOTO ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 md:w-[500px] aspect-square bg-blue-500/8 rounded-full blur-[120px]"></div>
        </div>
        <div ref={photoRef} className="absolute top-1/2 will-change-transform">
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 60px rgba(59,130,246,0.3), 0 0 120px rgba(59,130,246,0.15)', width: 'calc(100% + 16px)', height: 'calc(100% + 16px)', top: '-8px', left: '-8px' }}></div>
          <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-full overflow-hidden">
            <img src="/image.png" alt="Elisee" className="w-full h-full object-cover object-top brightness-110" />
          </div>
        </div>
      </div>

      {/* ===== ADMIN BUTTON ===== */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-slate-900/80 border border-white/10 text-gray-400 hover:text-blue-300 hover:border-blue-400/50 hover:scale-110 hover:shadow-[0_0_16px_rgba(59,130,246,0.3)] transition-all backdrop-blur-sm"
        title="Admin"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      {/* ===== ALL PROJECTS MODAL ===== */}
      {showAllProjects && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAllProjects(false)}>
          <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
              <div>
                <p className="text-blue-400 font-mono text-xs mb-1 tracking-[0.2em] uppercase">Portfolio</p>
                <h3 className="text-xl font-semibold text-blue-100">All Projects ({data.projects.length})</h3>
              </div>
              <button onClick={() => setShowAllProjects(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-white/10 text-gray-400 hover:text-blue-300 hover:border-blue-400/50 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 pt-4 grid gap-4 md:grid-cols-2">
              {data.projects.map((p, i) => {
                const key = `modal-${i}`;
                const isExpanded = expandedProjects[key] || false;
                const rs = projectRatingStates[key] || {};
                return (
                  <div key={p._id || p.id || i} className="backdrop-blur-2xl bg-slate-800/80 border border-white/10 rounded-xl p-5 hover:border-blue-400/40 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-blue-300 mb-1">{p.title}</h4>
                        <p className="text-sm text-gray-400 mb-2 leading-relaxed">{p.desc}</p>
                        <div className="flex items-center gap-2">
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600/20 border border-blue-400/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedProjects(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/80 border border-blue-400/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/60 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all"
                      >
                        <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                      <div className="space-y-3">
                        {p.image && (
                          <img src={p.image} alt={p.title} className="w-full h-36 object-cover rounded-lg border border-white/10" onError={e => { e.target.style.display = 'none' }} />
                        )}
                        {p.tech && <div className="flex flex-wrap gap-1.5">{p.tech.split(', ').map((t, ti) => <span key={ti} className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/20 rounded text-xs text-blue-400/80">{t}</span>)}</div>}
                        {p.source && (
                          <a href={p.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-700/50 border border-white/20 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            Source
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5">
                      {rs.submitted ? (
                        <p className="text-xs text-blue-400/80 italic">Thank you, {rs.name}! Rated {rs.rating}/5</p>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => {
                                  if (!rs.rating) {
                                    setProjectRatingStates(prev => ({ ...prev, [key]: { rating: star, name: '', submitted: false } }));
                                  }
                                }}
                                className={`text-lg transition-all ${rs.rating ? (star <= rs.rating ? 'text-yellow-400 scale-110' : 'text-gray-600') : 'text-gray-600 hover:text-yellow-400 hover:scale-125'}`}
                              >
                                ★
                              </button>
                            ))}
                            {rs.rating > 0 && !rs.submitted && (
                              <span className="text-xs text-gray-500 ml-1">({rs.rating}/5)</span>
                            )}
                          </div>
                          {rs.rating > 0 && !rs.submitted && (
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="text"
                                placeholder="Your name"
                                value={projectRatingNameInputs[key] || ''}
                                onChange={e => setProjectRatingNameInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                              />
                              <button
                                onClick={() => {
                                  const name = (projectRatingNameInputs[key] || '').trim();
                                  if (!name) return;
                                  setProjectRatingStates(prev => ({ ...prev, [key]: { ...prev[key], name, submitted: true } }));
                                }}
                                className="px-3 py-1.5 text-xs bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors"
                              >
                                Submit
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {data.projects.length === 0 && <p className="text-gray-500 text-center py-12 col-span-2">No projects yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===== ALL CERTIFICATIONS MODAL ===== */}
      {showAllCertifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAllCertifications(false)}>
          <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
              <div>
                <p className="text-blue-400 font-mono text-xs mb-1 tracking-[0.2em] uppercase">Credentials</p>
                <h3 className="text-xl font-semibold text-blue-100">All Certifications ({data.certifications.length})</h3>
              </div>
              <button onClick={() => setShowAllCertifications(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-white/10 text-gray-400 hover:text-blue-300 hover:border-blue-400/50 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 pt-4 space-y-3">
              {data.certifications.map((c, i) => (
                <div key={c._id || c.id} className="backdrop-blur-2xl bg-slate-800/80 border border-white/10 rounded-xl p-5 hover:border-blue-400/40 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-blue-300 mb-1">{c.name}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">{c.date}</span>
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
                    <svg className="w-8 h-8 shrink-0 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              ))}
              {data.certifications.length === 0 && <p className="text-gray-500 text-center py-12">No certifications yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===== CIRCULAR NAV (Desktop) ===== */}
      {sidebarKey > 0 && navPositions.map(({ link, right, top }, i) => (
        <a key={`${link.id}-${sidebarKey}`} href={`#${link.id}`}
          className="sidebar-btn group fixed z-40 hidden lg:flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-blue-300 transition-all duration-200 ease-out hover:scale-[1.65] hover:border-blue-400/70 hover:text-blue-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:bg-blue-500/10 active:scale-95 sidebar-enter"
          style={{ right: `${right}px`, top: `${top}px`, animationDelay: `${0.1 + i * 0.12}s` }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
          </svg>
          <span className="absolute right-full mr-3 px-2.5 py-1 bg-black/70 text-blue-300 italic font-serif text-[11px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {link.label}
          </span>
        </a>
      ))}

      {/* ===== BOTTOM NAV (Mobile) ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around bg-slate-950/90 backdrop-blur-md border-t border-white/10 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="mob-nav-btn flex flex-col items-center gap-0 px-3 py-1.5 rounded-lg transition-all duration-200 text-white/40 hover:text-blue-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
            </svg>
            <span className="text-[9px]">{link.label}</span>
          </a>
        ))}
      </div>

      {/* ===== SCROLLING CONTENT ===== */}
      <div ref={contentRef} className="relative z-10">
        {sections.map((sec, i) => (
          <section
            key={sec.id}
            id={sec.id}
            ref={(el) => (sectionRefs.current[i] = el)}
            className="min-h-screen flex items-center px-6 md:px-12 py-20 pb-28 lg:pb-20 bg-slate-950/60"
          >
            <div className={`w-full ${sec.side === 'right' ? 'lg:w-1/2 lg:pr-24' : 'lg:w-1/2 lg:pl-24 lg:ml-auto'}`}>
              <div className="max-w-lg">
                {sec.content}
              </div>
            </div>
          </section>
        ))}
        <footer className="px-6 md:px-12 py-8 text-center">
          <p className="text-gray-500 text-sm">© 2024 Elisee. Built with React, GSAP & Tailwind CSS.</p>
        </footer>
      </div>

      <style>{`
        .sidebar-btn.active {
          border-color: #60a5fa !important;
          color: #93c5fd !important;
          background: rgba(59,130,246,0.15);
          transform: scale(1.65) !important;
          box-shadow: 0 0 24px rgba(59,130,246,0.4);
        }
        .mob-nav-btn.active {
          color: #60a5fa !important;
        }
        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          color: #fff;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 14px rgba(59,130,246,0.4);
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          text-decoration: none;
        }
        .cta-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.55);
        }
        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.625rem 1.25rem;
          border: 1px solid rgba(59,130,246,0.5);
          color: #93c5fd;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          cursor: pointer;
          background: transparent;
          text-decoration: none;
        }
        .cta-secondary:hover {
          background: rgba(59,130,246,0.1);
          border-color: #60a5fa;
          color: #bfdbfe;
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <PortfolioDataProvider>
      <PortfolioWebsite />
    </PortfolioDataProvider>
  );
}
