import React, { useEffect, useRef, useMemo } from 'react';

/* global gsap, ScrollTrigger */

const projects = [
  {
    title: "Arduino Smart Weight Scale",
    desc: "HX711 load cell amplifier with LCD display, real-time calibration.",
    tech: "Arduino, C++, HX711"
  },
  {
    title: "Keypad-Controlled Servo Gate",
    desc: "4×4 matrix keypad interface with servo actuator for gate control.",
    tech: "Arduino, Servo, Matrix"
  },
  {
    title: "IoT Sensor Network",
    desc: "Multi-sensor data collection with wireless transmission and cloud dashboard.",
    tech: "ESP32, MQTT, Node.js"
  },
  {
    title: "Smart Home Dashboard",
    desc: "Real-time monitoring and control interface for connected home devices.",
    tech: "React, WebSockets, Chart.js"
  }
];

const experiences = [
  { title: "Full-Stack Developer", org: "Freelance", period: "2023 - Present", desc: "Building scalable web applications and embedded systems solutions." },
  { title: "Hardware Engineer", org: "Tech Innovations Lab", period: "2022 - 2023", desc: "Designed and prototyped IoT devices, optimized sensor integration." },
  { title: "Junior Developer", org: "Digital Solutions Inc.", period: "2021 - 2022", desc: "Developed responsive web applications and contributed to APIs." }
];

const sections = [
  {
    id: 'hero', label: 'Home', side: 'right',
    content: (
      <div>
        <p className="text-blue-400 font-mono text-sm mb-4 tracking-[0.2em] uppercase">Hello, I'm</p>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Elisee</h1>
        <p className="text-lg md:text-xl text-blue-200/80 mb-6 font-light">Full-Stack Developer & Hardware Enthusiast</p>
        <p className="text-gray-400 leading-relaxed mb-8 max-w-md">I craft seamless digital experiences and bridge the gap between hardware and software through innovative solutions.</p>
        <div className="flex gap-4">
          <a href="#about" className="px-6 py-3 bg-blue-500/20 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 text-blue-300 font-medium text-sm">Explore My Work</a>
          <a href="#contact" className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 text-gray-300 font-medium text-sm">Contact Me</a>
        </div>
      </div>
    )
  },
  {
    id: 'about', label: 'About', side: 'left',
    content: (
      <div>
        <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">About</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">About Me</h2>
        <div className="space-y-4">
          <p className="animate-in text-gray-300 leading-relaxed">I'm a full-stack developer passionate about embedded systems, hardware prototyping, and creating seamless digital experiences. With expertise in Arduino, IoT, and modern web technologies, I bridge the gap between hardware and software.</p>
          <p className="animate-in text-gray-400 leading-relaxed">Based in Rwanda, I thrive on solving complex problems and turning ideas into functional, beautiful products.</p>
          <p className="animate-in text-gray-400 leading-relaxed">When I'm not coding, you'll find me exploring new technologies, contributing to open-source, or mentoring aspiring developers.</p>
        </div>
      </div>
    )
  },
  {
    id: 'skills', label: 'Skills', side: 'right',
    content: (
      <div>
        <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Expertise</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">Skills & Technologies</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { cat: "Frontend", items: ["React", "JavaScript", "TypeScript", "GSAP", "Tailwind CSS"] },
            { cat: "Backend", items: ["Node.js", "Python", "REST APIs", "MongoDB", "PostgreSQL"] },
            { cat: "Hardware", items: ["Arduino", "IoT Systems", "PCB Design", "Sensors & ADC"] },
            { cat: "Tools", items: ["Git", "Docker", "Linux", "Figma", "VS Code"] }
          ].map((group, gi) => (
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
    id: 'projects', label: 'Projects', side: 'left',
    content: (
      <div>
        <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Portfolio</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">Projects</h2>
        <div className="space-y-3">
          {projects.map((p, i) => (
            <div key={i} className="card-in group backdrop-blur-2xl bg-slate-900/80 border border-white/10 rounded-xl p-5 hover:bg-blue-500/10 hover:border-blue-400/40 transition-all">
              <h3 className="text-base font-semibold text-blue-300 mb-1 group-hover:text-blue-200">{p.title}</h3>
              <p className="text-sm text-gray-400 mb-2 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">{p.tech.split(', ').map((t, ti) => <span key={ti} className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/20 rounded text-xs text-blue-400/80">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'experience', label: 'Experience', side: 'right',
    content: (
      <div>
        <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Career</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-100">Experience</h2>
        <div className="timeline relative pl-8 border-l-2 border-blue-500/30">
          <div className="timeline-line absolute left-0 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500 origin-top"></div>
          {experiences.map((exp, i) => (
            <div key={i} className="timeline-item relative mb-8 last:mb-0">
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
      </div>
    )
  },
  {
    id: 'contact', label: 'Contact', side: 'left',
    content: (
      <div>
        <p className="text-blue-400 font-mono text-sm mb-2 tracking-[0.2em] uppercase">Connect</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-100">Let's Work Together</h2>
        <p className="text-gray-400 mb-8 leading-relaxed max-w-md">Have a project in mind? I'd love to hear from you.</p>
        <div className="animate-in flex flex-col sm:flex-row gap-3">
          {[
            { href: "mailto:hello@elisee.dev", label: "Email", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", cls: "bg-blue-500/20 border-blue-400/50 text-blue-300 hover:bg-blue-500/30" },
            { href: "https://github.com/elisee", label: "GitHub", icon: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z", cls: "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10" },
            { href: "https://linkedin.com/in/elisee", label: "LinkedIn", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", cls: "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10" }
          ].map((link, i) => (
            <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-5 py-3 border rounded-lg text-sm font-medium transition-all ${link.cls}`}>
              <svg className="w-4 h-4" fill={link.label === "Email" ? "none" : "currentColor"} stroke={link.label === "Email" ? "currentColor" : "none"} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} /></svg>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    )
  }
];

const navLinks = [
  { id: 'hero', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'about', label: 'About', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'skills', label: 'Skills', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'projects', label: 'Projects', icon: 'M21 13.255A23.93 23.93 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'experience', label: 'Experience', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
];

const PortfolioWebsite = () => {
  const photoRef = useRef(null);
  const contentRef = useRef(null);
  const progressRef = useRef(null);
  const sectionRefs = useRef([]);
  const currentSection = useRef(0);
  const navPositions = useMemo(() => {
    const r = 120;
    const centerRight = 30;
    const centerY = typeof window !== 'undefined' ? window.innerHeight * 0.5 : 500;
    return navLinks.map((link, i) => {
      const angle = 290 + i * 28;
      const rad = angle * Math.PI / 180;
      return {
        link,
        right: centerRight + Math.cos(rad) * r - 16,
        top: centerY + Math.sin(rad) * r - 16
      };
    });
  }, []);

  useEffect(() => {
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

    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const init = () => {
      if (!window.gsap) return;
      const photo = photoRef.current;
      const content = contentRef.current;
      const progress = progressRef.current;
      const secs = sectionRefs.current.filter(Boolean);
      const total = secs.length;

      gsap.set(photo, { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0 });

      ScrollTrigger.create({
        trigger: content,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;
          const sw = 1 / total;
          const cs = Math.min(Math.floor(p / sw), total - 1);
          const lp = (p - cs * sw) / sw;

          if (cs !== currentSection.current) {
            currentSection.current = cs;
            document.querySelectorAll('.sidebar-btn').forEach((el, i) => el.classList.toggle('active', i === cs));
            document.querySelectorAll('.mob-nav-btn').forEach((el, i) => el.classList.toggle('active', i === cs));
          }

          const earlyLp = Math.min(lp / 0.25, 1);
          const ps = ease(earlyLp);
          const photoLeft = 25;
          const photoRight = 75;
          const prevCs = Math.max(cs - 1, 0);
          const prevTarget = sections[prevCs]?.side === 'right' ? photoRight : photoLeft;
          const currentTarget = sections[cs]?.side === 'right' ? photoRight : photoLeft;
          const leftPos = prevTarget + (currentTarget - prevTarget) * ps;

          const yOffset = Math.sin(p * Math.PI * 3) * 12;
          const rot = (cs % 2 === 0 ? 1 : -1) * ps * 2;
          const sc = 1 + Math.sin(p * Math.PI * 2) * 0.04;

          photo.style.left = `${leftPos}%`;
          photo.style.transform = `translate(-50%, -50%) translateY(${yOffset}px) scale(${sc}) rotate(${rot}deg)`;

          if (progress) progress.style.width = `${p * 100}%`;
        }
      });

      secs.forEach((section, i) => {
        const items = section.querySelectorAll('.animate-in');
        if (items.length) {
          gsap.fromTo(items, { x: sections[i]?.side === 'left' ? 40 : -40, opacity: 0 }, {
            x: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', toggleActions: 'play none none reverse' }
          });
        }
        const cards = section.querySelectorAll('.card-in');
        if (cards.length) {
          gsap.fromTo(cards, { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 35%', toggleActions: 'play none none reverse' }
          });
        }
      });

      const tl = document.querySelector('.timeline-line');
      if (tl) {
        gsap.fromTo(tl, { scaleY: 0 }, {
          scaleY: 1, duration: 1, ease: 'power2.out', immediateRender: false,
          scrollTrigger: { trigger: '.timeline', start: 'top 75%', end: 'top 30%', toggleActions: 'play none none reverse' }
        });
      }
      document.querySelectorAll('.timeline-item').forEach((item) => {
        gsap.fromTo(item, { x: -30, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.5, ease: 'power2.out', immediateRender: false,
          scrollTrigger: { trigger: item, start: 'top 80%', end: 'top 40%', toggleActions: 'play none none reverse' }
        });
      });

      ScrollTrigger.refresh();
    };

    loadGSAP();
    return () => { if (window.ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-50">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '0%' }}></div>
      </div>

      {/* ===== FIXED PHOTO ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px]"></div>
        </div>
        <div ref={photoRef} className="absolute top-1/2 will-change-transform" style={{ left: '75%', transform: 'translate(-50%, -50%)' }}>
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 50px rgba(59,130,246,0.15)', width: 'calc(100% + 12px)', height: 'calc(100% + 12px)', top: '-6px', left: '-6px' }}></div>
          <img src="/image.png" alt="Elisee" className="w-64 h-64 md:w-72 md:h-72 rounded-full object-cover" style={{ backfaceVisibility: 'hidden' }} />
        </div>
      </div>

      {/* ===== CIRCULAR NAV (Desktop - right side, close to edge) ===== */}
      {navPositions.map(({ link, right, top }) => (
        <a key={link.id} href={`#${link.id}`}
          className="sidebar-btn group fixed z-40 hidden lg:flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-blue-300 transition-all duration-300 ease-out hover:scale-110 hover:border-blue-400/50 hover:text-blue-200 active:scale-95"
          style={{ right: `${right}px`, top: `${top}px` }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
          </svg>
          <span className="absolute right-full mr-3 px-2.5 py-1 bg-black/70 text-white text-[11px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {link.label}
          </span>
        </a>
      ))}

      {/* ===== BOTTOM NAV (Mobile) ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around bg-slate-950/90 backdrop-blur-md border-t border-white/10 px-2 py-1.5">
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
            className="min-h-screen flex items-center px-6 md:px-12 py-20 bg-slate-950/60"
          >
            <div className={`w-full ${sec.side === 'right' ? 'lg:w-1/2 lg:pr-12' : 'lg:w-1/2 lg:pl-12 lg:ml-auto'}`}>
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

      {/* Nav active style */}
      <style>{`
        .sidebar-btn.active {
          border-color: #60a5fa !important;
          color: #93c5fd !important;
          background: rgba(59,130,246,0.15);
          transform: scale(1.15);
          box-shadow: 0 0 16px rgba(59,130,246,0.25);
        }
        .mob-nav-btn.active {
          color: #60a5fa !important;
        }
      `}</style>
    </div>
  );
};

export default PortfolioWebsite;
