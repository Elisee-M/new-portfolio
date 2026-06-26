import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'portfolio_data';

const defaultData = {
  projects: [
    { id: 1, title: "Arduino Smart Weight Scale", desc: "HX711 load cell amplifier with LCD display, real-time calibration.", tech: "Arduino, C++, HX711" },
    { id: 2, title: "Keypad-Controlled Servo Gate", desc: "4x4 matrix keypad interface with servo actuator for gate control.", tech: "Arduino, Servo, Matrix" },
    { id: 3, title: "IoT Sensor Network", desc: "Multi-sensor data collection with wireless transmission and cloud dashboard.", tech: "ESP32, MQTT, Node.js" },
    { id: 4, title: "Smart Home Dashboard", desc: "Real-time monitoring and control interface for connected home devices.", tech: "React, WebSockets, Chart.js" }
  ],
  experiences: [
    { id: 1, title: "Full-Stack Developer", org: "Freelance", period: "2023 - Present", desc: "Building scalable web applications and embedded systems solutions." },
    { id: 2, title: "Hardware Engineer", org: "Tech Innovations Lab", period: "2022 - 2023", desc: "Designed and prototyped IoT devices, optimized sensor integration." },
    { id: 3, title: "Junior Developer", org: "Digital Solutions Inc.", period: "2021 - 2022", desc: "Developed responsive web applications and contributed to APIs." }
  ],
  skills: [
    { cat: "Frontend", items: ["React", "JavaScript", "TypeScript", "GSAP", "Tailwind CSS"] },
    { cat: "Backend", items: ["Node.js", "Python", "REST APIs", "MongoDB", "PostgreSQL"] },
    { cat: "Hardware", items: ["Arduino", "IoT Systems", "PCB Design", "Sensors & ADC"] },
    { cat: "Tools", items: ["Git", "Docker", "Linux", "Figma", "VS Code"] }
  ],
  certifications: [
    { id: 1, title: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2024", desc: "Associate-level certification for developing on AWS." },
    { id: 2, title: "Google IT Support", issuer: "Google", date: "2023", desc: "Professional certificate in IT support fundamentals." },
    { id: 3, title: "Meta Front-End Developer", issuer: "Meta", date: "2023", desc: "Professional certificate in front-end development." }
  ]
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultData, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load portfolio data from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(defaultData));
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save portfolio data:', e);
  }
}

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const resetData = useCallback(() => {
    setData(JSON.parse(JSON.stringify(defaultData)));
  }, []);

  const updateProjects = useCallback((projects) => {
    setData(prev => ({ ...prev, projects }));
  }, []);

  const addProject = useCallback((project) => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: Date.now() }]
    }));
  }, []);

  const updateProject = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  }, []);

  const deleteProject = useCallback((id) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  }, []);

  const updateExperiences = useCallback((experiences) => {
    setData(prev => ({ ...prev, experiences }));
  }, []);

  const addExperience = useCallback((exp) => {
    setData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { ...exp, id: Date.now() }]
    }));
  }, []);

  const updateExperience = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  }, []);

  const deleteExperience = useCallback((id) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }));
  }, []);

  const updateSkills = useCallback((skills) => {
    setData(prev => ({ ...prev, skills }));
  }, []);

  const addSkillCategory = useCallback((category) => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { cat: category, items: [] }]
    }));
  }, []);

  const updateSkillCategory = useCallback((index, updates) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map((s, i) => i === index ? { ...s, ...updates } : s)
    }));
  }, []);

  const deleteSkillCategory = useCallback((index) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  }, []);

  const updateCertifications = useCallback((certifications) => {
    setData(prev => ({ ...prev, certifications }));
  }, []);

  const addCertification = useCallback((cert) => {
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...cert, id: Date.now() }]
    }));
  }, []);

  const updateCertification = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  }, []);

  const deleteCertification = useCallback((id) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  }, []);

  const value = {
    data,
    resetData,
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

export { defaultData };
