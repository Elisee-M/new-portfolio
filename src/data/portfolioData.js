import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  return sessionStorage.getItem('portfolio_token');
}

function headers(extra = {}) {
  const h = { 'Content-Type': 'application/json', ...extra };
  const t = getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
}

const defaultProjects = [
  { title: "Arduino Smart Weight Scale", desc: "HX711 load cell amplifier with LCD display, real-time calibration.", tech: "Arduino, C++, HX711", image: "https://picsum.photos/seed/arduino/400/300", demo: "https://example.com/demo1", source: "https://github.com/elisee/arduino-scale" },
  { title: "Keypad-Controlled Servo Gate", desc: "4x4 matrix keypad interface with servo actuator for gate control.", tech: "Arduino, Servo, Matrix", image: "https://picsum.photos/seed/keypad/400/300", demo: "https://example.com/demo2", source: "https://github.com/elisee/servo-gate" },
  { title: "IoT Sensor Network", desc: "Multi-sensor data collection with wireless transmission and cloud dashboard.", tech: "ESP32, MQTT, Node.js", image: "https://picsum.photos/seed/iot/400/300", demo: "https://example.com/demo3", source: "https://github.com/elisee/iot-network" },
  { title: "Smart Home Dashboard", desc: "Real-time monitoring and control interface for connected home devices.", tech: "React, WebSockets, Chart.js", image: "https://picsum.photos/seed/smarthome/400/300", demo: "https://example.com/demo4", source: "https://github.com/elisee/smart-home" }
];

const defaultExperiences = [
  { title: "Full-Stack Developer", org: "Freelance", period: "2023 - Present", desc: "Building scalable web applications and embedded systems solutions." },
  { title: "Hardware Engineer", org: "Tech Innovations Lab", period: "2022 - 2023", desc: "Designed and prototyped IoT devices, optimized sensor integration." },
  { title: "Junior Developer", org: "Digital Solutions Inc.", period: "2021 - 2022", desc: "Developed responsive web applications and contributed to APIs." }
];

const defaultSkills = [
  { cat: "Frontend", items: ["React", "JavaScript", "TypeScript", "GSAP", "Tailwind CSS"] },
  { cat: "Backend", items: ["Node.js", "Python", "REST APIs", "MongoDB", "PostgreSQL"] },
  { cat: "Hardware", items: ["Arduino", "IoT Systems", "PCB Design", "Sensors & ADC"] },
  { cat: "Tools", items: ["Git", "Docker", "Linux", "Figma", "VS Code"] }
];

const defaultCertifications = [
  { name: "AWS Certified Developer", date: "2024", credentialUrl: "https://aws.amazon.com/certification/" },
  { name: "Google IT Support", date: "2023", credentialUrl: "https://www.coursera.org/professional-certificates/google-it-support" },
  { name: "Meta Front-End Developer", date: "2023", credentialUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer" }
];

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const [ratings, setRatings] = useState([]);
  const [data, setData] = useState({
    projects: defaultProjects,
    experiences: defaultExperiences,
    skills: defaultSkills,
    certifications: defaultCertifications,
    cvUrl: null
  });
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [projects, certs, exps, skills, cvRes] = await Promise.all([
          fetch(`${API_URL}/projects`).then(r => r.json()),
          fetch(`${API_URL}/certifications`).then(r => r.json()),
          fetch(`${API_URL}/experiences`).then(r => r.json()),
          fetch(`${API_URL}/skills`).then(r => r.json()),
          fetch(`${API_URL}/cv`).then(r => r.ok ? r.json() : { url: null }),
        ]);
        setData({
          projects: Array.isArray(projects) && projects.length ? projects : defaultProjects,
          certifications: Array.isArray(certs) && certs.length ? certs : defaultCertifications,
          experiences: Array.isArray(exps) && exps.length ? exps : defaultExperiences,
          skills: Array.isArray(skills) && skills.length ? skills : defaultSkills,
          cvUrl: cvRes.url || null
        });
      } catch (e) {
        console.warn('API unavailable, using default data:', e);
      } finally {
        setApiReady(true);
      }
    }
    load();
  }, []);

  const updateProjects = useCallback((projects) => {
    setData(prev => ({ ...prev, projects }));
  }, []);

  const addProject = useCallback(async (project) => {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST', headers: headers(), body: JSON.stringify(project)
    });
    if (!res.ok) return;
    const saved = await res.json();
    setData(prev => ({ ...prev, projects: [...prev.projects, saved] }));
  }, []);

  const updateProject = useCallback(async (id, updates) => {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(updates)
    });
    if (!res.ok) return;
    const saved = await res.json();
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p._id === id || p.id === id ? saved : p)
    }));
  }, []);

  const deleteProject = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE', headers: headers()
    });
    if (!res.ok) return;
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p._id !== id && p.id !== id)
    }));
  }, []);

  const updateExperiences = useCallback((experiences) => {
    setData(prev => ({ ...prev, experiences }));
  }, []);

  const addExperience = useCallback(async (exp) => {
    const res = await fetch(`${API_URL}/experiences`, {
      method: 'POST', headers: headers(), body: JSON.stringify(exp)
    });
    if (!res.ok) return;
    const saved = await res.json();
    setData(prev => ({ ...prev, experiences: [...prev.experiences, saved] }));
  }, []);

  const updateExperience = useCallback(async (id, updates) => {
    const res = await fetch(`${API_URL}/experiences/${id}`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(updates)
    });
    if (!res.ok) return;
    const saved = await res.json();
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e._id === id || e.id === id ? saved : e)
    }));
  }, []);

  const deleteExperience = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/experiences/${id}`, {
      method: 'DELETE', headers: headers()
    });
    if (!res.ok) return;
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e._id !== id && e.id !== id)
    }));
  }, []);

  const updateSkills = useCallback((skills) => {
    setData(prev => ({ ...prev, skills }));
  }, []);

  const addSkillCategory = useCallback(async (category) => {
    const res = await fetch(`${API_URL}/skills`, {
      method: 'POST', headers: headers(), body: JSON.stringify({ cat: category, items: [] })
    });
    if (!res.ok) return;
    const saved = await res.json();
    setData(prev => ({ ...prev, skills: [...prev.skills, saved] }));
  }, []);

  const updateSkillCategory = useCallback(async (index, updates) => {
    const skill = data.skills[index];
    const id = skill._id;
    const res = await fetch(`${API_URL}/skills/${id}`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(updates)
    });
    if (!res.ok) return;
    const saved = await res.json();
    setData(prev => ({
      ...prev,
      skills: prev.skills.map((s, i) => i === index ? saved : s)
    }));
  }, [data.skills]);

  const deleteSkillCategory = useCallback(async (index) => {
    const skill = data.skills[index];
    const id = skill._id;
    const res = await fetch(`${API_URL}/skills/${id}`, {
      method: 'DELETE', headers: headers()
    });
    if (!res.ok) return;
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  }, [data.skills]);

  const updateCertifications = useCallback((certifications) => {
    setData(prev => ({ ...prev, certifications }));
  }, []);

  const addCertification = useCallback(async (cert) => {
    const res = await fetch(`${API_URL}/certifications`, {
      method: 'POST', headers: headers(), body: JSON.stringify(cert)
    });
    if (!res.ok) return;
    const saved = await res.json();
    setData(prev => ({ ...prev, certifications: [...prev.certifications, saved] }));
  }, []);

  const updateCertification = useCallback(async (id, updates) => {
    const res = await fetch(`${API_URL}/certifications/${id}`, {
      method: 'PUT', headers: headers(), body: JSON.stringify(updates)
    });
    if (!res.ok) return;
    const saved = await res.json();
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c._id === id || c.id === id ? saved : c)
    }));
  }, []);

  const deleteCertification = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/certifications/${id}`, {
      method: 'DELETE', headers: headers()
    });
    if (!res.ok) return;
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c._id !== id && c.id !== id)
    }));
  }, []);

  const resetData = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    const delAll = async (url) => {
      const items = await fetch(url).then(r => r.json());
      for (const item of items) {
        await fetch(`${url}/${item._id}`, { method: 'DELETE', headers: headers() });
      }
    };

    await delAll(`${API_URL}/projects`);
    await delAll(`${API_URL}/experiences`);
    await delAll(`${API_URL}/skills`);
    await delAll(`${API_URL}/certifications`);

    const [projects, exps, skills, certs] = await Promise.all([
      Promise.all(defaultProjects.map(p => fetch(`${API_URL}/projects`, { method: 'POST', headers: headers(), body: JSON.stringify(p) }).then(r => r.json()))),
      Promise.all(defaultExperiences.map(e => fetch(`${API_URL}/experiences`, { method: 'POST', headers: headers(), body: JSON.stringify(e) }).then(r => r.json()))),
      Promise.all(defaultSkills.map(s => fetch(`${API_URL}/skills`, { method: 'POST', headers: headers(), body: JSON.stringify(s) }).then(r => r.json()))),
      Promise.all(defaultCertifications.map(c => fetch(`${API_URL}/certifications`, { method: 'POST', headers: headers(), body: JSON.stringify(c) }).then(r => r.json()))),
    ]);

    setData({ projects, experiences: exps, skills, certifications: certs });
  }, []);

  const updateCvUrl = useCallback((url) => {
    setData(prev => ({ ...prev, cvUrl: url }));
  }, []);

  const value = {
    data,
    apiReady,
    resetData,
    updateCvUrl,
    updateProjects, addProject, updateProject, deleteProject,
    updateExperiences, addExperience, updateExperience, deleteExperience,
    updateSkills, addSkillCategory, updateSkillCategory, deleteSkillCategory,
    updateCertifications, addCertification, updateCertification, deleteCertification
  };

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error('usePortfolioData must be used within PortfolioDataProvider');
  return ctx;
}
