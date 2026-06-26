import React, { useEffect, useRef, useState } from 'react';

const PortfolioWebsite = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const imageContainerRef = useRef(null);
  const portraitRef = useRef(null);
  const sectionsRef = useRef(null);
  const [imageSequence, setImageSequence] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const currentImageIndex = useRef(0);
  const rotationDegrees = useRef(0);

  useEffect(() => {
    // Load GSAP and ScrollTrigger from CDN
    const loadGSAP = async () => {
      const script1 = document.createElement('script');
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      script1.async = true;

      const script2 = document.createElement('script');
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
      script2.async = true;

      script1.onload = () => {
        document.body.appendChild(script2);
        script2.onload = () => {
          gsap.registerPlugin(ScrollTrigger);
          initializeScrollAnimations();
          preloadImages();
        };
      };

      document.body.appendChild(script1);
    };

    const preloadImages = () => {
      // Generate array of image paths (0, 15, 30, ... 360)
      const angles = [];
      for (let i = 0; i <= 360; i += 15) {
        angles.push(i);
      }

      // Create image paths - adjust this path to where your images are stored
      const images = angles.map(angle => ({
        angle,
        src: `/portfolio-images/image_${String(angle).padStart(3, '0')}.webp`,
        fallback: null
      }));

      // Fallback: if images don't exist, we'll use CSS transforms with the single image
      Promise.all(
        images.map(img => {
          return new Promise((resolve) => {
            const testImg = new Image();
            testImg.src = img.src;
            testImg.onload = () => {
              img.fallback = false;
              resolve(img);
            };
            testImg.onerror = () => {
              img.fallback = true;
              resolve(img);
            };
          });
        })
      ).then(loadedImages => {
        setImageSequence(loadedImages);
      });
    };

    const initializeScrollAnimations = () => {
      if (!window.gsap || !window.ScrollTrigger) return;

      const hero = heroRef.current;
      const imageContainer = imageContainerRef.current;
      const sections = sectionsRef.current;

      // Pin the hero section
      gsap.to(hero, {
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom center',
          pin: true,
          pinSpacing: true,
          markers: false,
          onUpdate: (self) => {
            handleRotationScroll(self.progress);
          }
        }
      });

      // Slide up sections after image completes rotation
      gsap.fromTo(
        sections,
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: hero,
            start: 'center center+=200px',
            end: 'center center+=400px',
            scrub: 1,
            markers: false
          }
        }
      );

      // Fade, blur, and scale the image during final phase
      gsap.to(imageContainer, {
        filter: 'blur(20px)',
        opacity: 0,
        scale: 0.8,
        scrollTrigger: {
          trigger: hero,
          start: 'center center+=400px',
          end: 'center center+=600px',
          scrub: 1,
          markers: false
        }
      });
    };

    const handleRotationScroll = (progress) => {
      // Map scroll progress to rotation
      // 0-0.5 progress = 360 rotation
      const rotationProgress = Math.min(progress / 0.5, 1);
      const targetDegrees = rotationProgress * 360;

      // Calculate which image to show
      const imageIndex = Math.round(rotationProgress * (imageSequence.length - 1));
      currentImageIndex.current = Math.min(imageIndex, imageSequence.length - 1);

      if (portraitRef.current && imageSequence.length > 0) {
        const img = imageSequence[currentImageIndex.current];

        if (!img.fallback && portraitRef.current.src !== img.src) {
          portraitRef.current.src = img.src;
        } else if (img.fallback) {
          // Use CSS transform rotation as fallback
          portraitRef.current.style.transform = `rotate(${targetDegrees}deg)`;
        }
      }

      rotationDegrees.current = targetDegrees;
      setIsScrolling(true);
    };

    loadGSAP();

    return () => {
      if (window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, [imageSequence]);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative w-full h-screen flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Image Container */}
        <div ref={imageContainerRef} className="relative z-10">
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border border-blue-400/20" style={{
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.3), inset 0 0 40px rgba(59, 130, 246, 0.1)'
            }}></div>

            {/* Portrait Image */}
            <img
              ref={portraitRef}
              src="/portfolio-images/image_000.webp"
              alt="Portfolio"
              className="w-full h-full rounded-full object-cover shadow-2xl will-change-transform"
              style={{
                boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>
        </div>

        {/* Title and description */}
        <div className="absolute inset-x-0 bottom-16 text-center z-5 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Elisee
          </h1>
          <p className="text-xl text-blue-200/60">Creative Developer & Hardware Enthusiast</p>
          <p className="text-sm text-blue-300/40 mt-2">Scroll to explore</p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Portfolio Sections */}
      <div ref={sectionsRef} className="relative z-20 w-full pt-20 pb-20">
        {/* About Section */}
        <section className="px-4 md:px-12 py-16 max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-colors">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">About Me</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              I'm a full-stack developer passionate about embedded systems, hardware prototyping, and creating seamless digital experiences. With expertise in Arduino, IoT, and modern web technologies, I bridge the gap between hardware and software innovation.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Based in Rwanda, I thrive on solving complex problems and turning ideas into functional, beautiful products. Whether it's building a smart scale with load cell sensors or crafting responsive web applications, I'm committed to excellence.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section className="px-4 md:px-12 py-16 max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-colors">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-300">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-blue-400">Hardware & Embedded</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Arduino & Microcontrollers</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>IoT Systems & Sensors</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>PCB Design & Prototyping</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Load Cells & ADC Integration</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-blue-400">Software & Web</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>React & Modern JavaScript</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>GSAP & Advanced Animations</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Tailwind CSS & UI Design</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Full-Stack Web Development</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="px-4 md:px-12 py-16 max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-colors">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-300">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Arduino Smart Weight Scale",
                  desc: "HX711 load cell amplifier with LCD display, real-time calibration, and ADC saturation detection."
                },
                {
                  title: "Keypad-Controlled Servo Gate",
                  desc: "4×4 matrix keypad interface with servo actuator for automated gate control and access management."
                },
                {
                  title: "IoT Sensor Network",
                  desc: "Multi-sensor data collection system with wireless transmission and cloud-based analytics dashboard."
                },
                {
                  title: "Premium Portfolio Website",
                  desc: "Cinematic scroll animations with GSAP, glassmorphism design, and optimized image sequences."
                }
              ].map((project, idx) => (
                <div key={idx} className="backdrop-blur-lg bg-blue-500/5 border border-blue-400/20 rounded-xl p-6 hover:border-blue-400/40 transition-all hover:bg-blue-500/10">
                  <h3 className="text-xl font-semibold text-blue-300 mb-3">{project.title}</h3>
                  <p className="text-gray-400">{project.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="px-4 md:px-12 py-16 max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-colors">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-300">Experience</h2>
            <div className="space-y-8">
              <div className="border-l-2 border-blue-400/50 pl-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-1">Full-Stack Developer</h3>
                <p className="text-sm text-blue-300/60 mb-2">2023 - Present</p>
                <p className="text-gray-400">Building scalable web applications and embedded systems solutions with a focus on performance and user experience.</p>
              </div>
              <div className="border-l-2 border-blue-400/50 pl-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-1">Hardware Engineer</h3>
                <p className="text-sm text-blue-300/60 mb-2">2022 - 2023</p>
                <p className="text-gray-400">Designed and prototyped IoT devices, optimized sensor integration, and troubleshot complex electrical systems.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 md:px-12 py-16 max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-colors text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">Let's Connect</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Have a project in mind or want to discuss embedded systems and web development? I'd love to hear from you.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="mailto:hello@elisee.dev" className="px-8 py-3 bg-blue-500/20 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 transition-all text-blue-300 font-semibold">
                Email Me
              </a>
              <a href="#" className="px-8 py-3 bg-blue-500/20 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 transition-all text-blue-300 font-semibold">
                GitHub
              </a>
              <a href="#" className="px-8 py-3 bg-blue-500/20 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 transition-all text-blue-300 font-semibold">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 md:px-12 py-8 text-center text-gray-400 text-sm">
        <p>© 2024 Elisee. All rights reserved. Built with React, Tailwind CSS, and GSAP.</p>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }

        img {
          -webkit-user-drag: none;
          user-select: none;
          pointer-events: none;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default PortfolioWebsite;
