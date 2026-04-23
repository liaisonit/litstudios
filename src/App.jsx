import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Globe, Zap, X, Menu, 
  Code, PenTool, LayoutTemplate, Smartphone,
  MapPin, ArrowUpRight, ChevronRight, Quote,
  MousePointer2, Plus, Minus,
  Cpu, MessageSquare, Server, BarChart
} from 'lucide-react';

// --- STYLING, ANIMATION & FONT INJECTION ---
const StyleInjector = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&family=Poppins:wght@300;400;500;600&display=swap');
    
    :root {
      --bg-dark: #050505;
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-bg: rgba(255, 255, 255, 0.02);
      --text-main: #ffffff;
      --text-muted: #777777;
    }
    
    html, body {
      background-color: var(--bg-dark) !important;
      color: var(--text-main) !important;
      font-family: 'Poppins', sans-serif;
      margin: 0;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9999;
    }

    h1, h2, h3, h4, h5, h6, .font-display { font-family: 'Montserrat', sans-serif; }

    .glass-panel {
      background: var(--glass-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
    }

    /* Modern Editorial Grid */
    .grid-editorial {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 2rem;
    }

    /* Scroll Reveal Animations */
    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.active { opacity: 1; transform: translateY(0); }
    .delay-100 { transition-delay: 100ms; }
    .delay-200 { transition-delay: 200ms; }
    .delay-300 { transition-delay: 300ms; }

    /* Image Treatments */
    .img-monochrome {
      filter: grayscale(100%) contrast(120%) brightness(80%);
      transition: filter 0.5s ease, transform 0.7s ease;
    }
    .group:hover .img-monochrome {
      filter: grayscale(100%) contrast(100%) brightness(100%);
      transform: scale(1.02);
    }

    /* Page Enter Animations */
    .page-enter { animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(40px); filter: blur(5px); }
      100% { opacity: 1; transform: translateY(0); filter: blur(0); }
    }

    /* Outline Text Effect */
    .text-outline {
      color: transparent;
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
      transition: all 0.5s ease;
    }
    .text-outline:hover, .group:hover .text-outline {
      color: #ffffff;
      -webkit-text-stroke: 1px transparent;
    }

    /* Marquee Animation */
    @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
    .animate-marquee { display: inline-block; white-space: nowrap; animation: marquee 40s linear infinite; }

    /* Leaflet Overrides */
    .leaflet-container { background: var(--bg-dark) !important; font-family: 'Poppins', sans-serif; }
    .leaflet-control-zoom { border: 1px solid var(--glass-border) !important; background: var(--glass-bg) !important; backdrop-filter: blur(10px); }
    .leaflet-control-zoom a { background: transparent !important; color: #fff !important; border-bottom: 1px solid var(--glass-border) !important; }
    .leaflet-control-zoom a:hover { background: rgba(255,255,255,0.1) !important; }
    .leaflet-bar { box-shadow: none !important; }
    .leaflet-control-attribution { display: none !important; }
    
    .pulse-marker {
      width: 14px; height: 14px;
      background: #fff; border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
      animation: pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
      cursor: pointer; border: 2px solid var(--bg-dark); transition: transform 0.4s ease;
    }
    .pulse-marker:hover { transform: scale(1.8); }
    @keyframes pulse { 100% { box-shadow: 0 0 0 24px rgba(255, 255, 255, 0); } }

    /* Inputs */
    input, textarea {
      background: transparent; border: none; border-bottom: 1px solid var(--glass-border);
      color: white; font-family: 'Poppins', sans-serif; padding: 16px 0; transition: border-color 0.4s ease;
      border-radius: 0;
    }
    input:focus, textarea:focus { outline: none; border-bottom-color: white; }
    input::placeholder, textarea::placeholder { color: var(--text-muted); }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg-dark); border-left: 1px solid rgba(255,255,255,0.05); }
    ::-webkit-scrollbar-thumb { background: #333; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }
    
    /* Interactive Grid Hover */
    .tech-grid:hover .tech-item { opacity: 0.3; }
    .tech-grid .tech-item:hover { opacity: 1; transform: scale(1.05); border-color: rgba(255,255,255,0.5); z-index: 10; background: rgba(255,255,255,0.05); }
  `}} />
);

// --- CUSTOM HOOKS ---
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);
};

// --- DATA ---
const LOCATIONS = [
  { id: 'us', name: 'New York', country: 'United States', coords: [40.7128, -74.0060], desc: 'The heartbeat of our global creative operations. Where strategy meets the skyline.', team: 12 },
  { id: 'uk', name: 'London', country: 'United Kingdom', coords: [51.5074, -0.1278], desc: 'Our European hub for cutting-edge design and immersive digital experiences.', team: 8 },
  { id: 'ca', name: 'Toronto', country: 'Canada', coords: [43.6510, -79.3470], desc: 'Driving technological innovation and robust platform engineering.', team: 10 },
  { id: 'au', name: 'Sydney', country: 'Australia', coords: [-33.8688, 151.2093], desc: 'Setting the trend for the APAC region with bold brand narratives.', team: 5 }
];

const SERVICES = [
  { id: '01', title: 'Marketing Technology', desc: 'Architecting scalable MarTech stacks, CRM integrations, and automated marketing pipelines.', icon: Cpu, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop' },
  { id: '02', title: 'Strategic MarComms', desc: 'Data-driven brand narratives, digital PR, and targeted global communication campaigns.', icon: MessageSquare, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
  { id: '03', title: 'IT Enabled Services', desc: 'Robust infrastructure management, technical support, and global business process outsourcing.', icon: Server, img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' },
  { id: '04', title: 'Data & Intelligence', desc: 'Advanced analytics, consumer insights, and performance tracking across the digital ecosystem.', icon: BarChart, img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
];

const WORK = [
  { id: '01', title: "Project Nebula", type: "Digital Platform", year: "2025", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" },
  { id: '02', title: "Aura System", type: "Brand Identity", year: "2024", img: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1974&auto=format&fit=crop" },
  { id: '03', title: "Void Space", type: "Immersive Web", year: "2022", img: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop" },
  { id: '04', title: "Zenith App", type: "Mobile Ecosystem", year: "2021", img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2069&auto=format&fit=crop" }
];

const BRANDS = ["LVMH", "TESLA", "APPLE", "NIKE", "POLESTAR", "RICHEMONT", "SONY", "LVMH", "TESLA", "APPLE", "NIKE"];

const PROCESS_STEPS = [
  { title: "Audit", desc: "We evaluate your existing marketing stack, comms logic, and operational bottlenecks." },
  { title: "Architecture", desc: "Structuring the ideal data pipelines, CRM workflows, and ITES strategies." },
  { title: "Integration", desc: "Executing with precision to seamlessly connect disparate IT and marketing systems." },
  { title: "Scale", desc: "Rigorous performance monitoring, scalable BPO, and continuous process optimization." }
];

const TECH_STACK = [
  "Salesforce", "HubSpot", "Marketo", "AWS Analytics", "Tableau", "Snowflake", "Zendesk", "Adobe Cloud"
];

const FAQS = [
  { q: "How do you handle MarTech integrations?", a: "We operate on an agile model to audit, map, and integrate your CRM, CDP, and marketing automation platforms with zero downtime." },
  { q: "What ITES support do you provide?", a: "We offer global, scalable operations ranging from technical support infrastructure to complex data processing and BPO." },
  { q: "Do you offer post-deployment optimization?", a: "Absolutely. We provide continuous architectural scaling, iterative campaign improvements, and SLA-backed engineering support for all our enterprise deployments." }
];

const INSIGHTS = [
  { date: "Oct 12, 2025", title: "The Fallacy of Infinite Scroll in Modern UI" },
  { date: "Sep 28, 2024", title: "Architecting Headless Commerce for Scale" },
  { date: "Aug 15, 2022", title: "Spatial Interfaces: Beyond the 2D Screen" }
];

// --- COMPONENTS ---

const SectionHeader = ({ title, kicker, className = "" }) => (
  <div className={`col-span-12 md:col-span-4 reveal ${className}`}>
    <div className="sticky top-32">
      <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#777] flex items-center gap-4">
        <span className="w-8 h-[1px] bg-[#777]"></span> {kicker}
      </h4>
      {title && <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight mt-6 leading-none">{title}</h2>}
    </div>
  </div>
);

const InstructionTag = ({ text, icon: Icon }) => (
  <div className="inline-flex items-center gap-2 border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-none text-[8px] font-mono uppercase tracking-widest text-[#aaa]">
    {Icon && <Icon size={10} />}
    [{text}]
  </div>
);

const GlobalMap = ({ onLocationSelect, activeLocation }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.L) { setIsLoaded(true); return; }
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
    const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (!mapInstance.current) {
      const map = window.L.map(mapRef.current, { center: [20, 0], zoom: 2, zoomControl: false, worldCopyJump: true });
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);
      
      LOCATIONS.forEach(loc => {
        const icon = window.L.divIcon({ className: '', html: `<div class="pulse-marker"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
        window.L.marker(loc.coords, { icon }).addTo(map).on('click', () => {
          onLocationSelect(loc);
          map.setView(loc.coords, 5, { animate: true, pan: { duration: 1.5 }});
        });
      });
      mapInstance.current = map;
    }
    if (activeLocation && mapInstance.current) {
       mapInstance.current.setView(activeLocation.coords, 5, { animate: true, pan: { duration: 1.5 }});
    }
  }, [isLoaded, activeLocation]);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden glass-panel border-y border-white/10 group">
      {!isLoaded && <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>}
      <div ref={mapRef} className="w-full h-full grayscale-[1] contrast-125 brightness-75" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(5,5,5,1)] z-10"></div>
      
      {/* UI Instruction Overlay */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <InstructionTag text="DRAG TO EXPLORE / CLICK MARKERS" icon={MousePointer2} />
      </div>
    </div>
  );
};

// --- PAGES ---

const HomePage = ({ setActiveLocation, activeLocation, navigateTo }) => {
  useScrollReveal();
  const [hoveredWork, setHoveredWork] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* SECTION 1: HERO */}
      <section className="flex flex-col gap-8 items-start pt-24 md:pt-32 min-h-[85vh] justify-center border-b border-white/5 pb-16 relative overflow-hidden">
        
        {/* Abstract Hero Background Illustration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 pointer-events-none z-0">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse" style={{ animationDuration: '8s' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.2" strokeDasharray="2,2" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="0.1" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="0.1" />
          </svg>
        </div>

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 px-5 py-2 rounded-none text-[9px] font-semibold uppercase tracking-[0.3em] text-[#aaa] page-enter stagger-1 mb-6">
            <Zap size={10} className="text-white" /> Global Architectural Studio
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] font-black uppercase tracking-tighter page-enter stagger-2 w-full text-white">
            We Build <br/>
            <span className="text-outline block ml-0 md:ml-20 mt-1 md:mt-0">The Future.</span>
          </h1>
          
          <div className="grid-editorial w-full mt-12 page-enter stagger-3">
            <div className="col-span-12 md:col-span-5 hidden md:block">
               {/* Hero Supporting Image */}
               <div className="w-full h-40 overflow-hidden border border-white/10 glass-panel p-2">
                 <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" alt="Architecture" className="w-full h-full object-cover img-monochrome" />
               </div>
            </div>
            <div className="col-span-12 md:col-start-7 md:col-span-6 flex flex-col items-start justify-end">
              <p className="text-[#888] text-lg md:text-xl font-light leading-relaxed">
                A premium monochromatic experience bridging MarTech, MarComms, and ITES since 2019.
              </p>
              <button onClick={() => navigateTo('contact')} className="mt-8 pb-2 border-b border-white text-xs uppercase tracking-[0.2em] font-bold hover:text-[#888] hover:border-[#888] transition-colors inline-flex items-center gap-2 group">
                Initiate Project <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Instruction */}
        <div className="absolute bottom-8 left-6 hidden md:block animate-bounce">
          <InstructionTag text="SCROLL TO DISCOVER" />
        </div>
      </section>

      {/* SECTION 2: CLIENT MARQUEE */}
      <section className="relative w-full overflow-hidden border-b border-white/5 py-8 reveal">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[var(--bg-dark)] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[var(--bg-dark)] to-transparent z-10 pointer-events-none"></div>
        <div className="animate-marquee opacity-60 hover:opacity-100 transition-opacity duration-700">
          <div className="flex gap-16 items-center pr-16">
            {BRANDS.map((brand, idx) => (
              <span key={idx} className="font-display text-2xl md:text-3xl font-black uppercase tracking-widest text-outline">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: PHILOSOPHY */}
      <section className="grid-editorial w-full py-20 md:py-28 border-b border-white/5 relative">
        <SectionHeader kicker="Philosophy" />
        
        <div className="col-span-12 md:col-span-8 flex flex-col gap-8 mt-12 md:mt-0 reveal delay-100 relative z-10">
          <h2 className="font-display text-3xl md:text-5xl leading-[1.1] font-bold uppercase tracking-tight">
            We eliminate the noise. <br />
            <span className="text-[#555]">We amplify the signal.</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-8 mt-6">
            <div className="w-full md:w-1/3">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" alt="Office Minimal" className="w-full aspect-[4/5] object-cover img-monochrome border border-white/10" />
            </div>
            <div className="w-full md:w-2/3 flex items-end">
              <p className="text-lg md:text-xl text-[#888] font-light leading-relaxed border-l-2 border-white/20 pl-6">
                In a world of digital clutter, true luxury is clarity. We craft uncompromised digital experiences that are stark, beautiful, and devastatingly effective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SERVICES */}
      <section className="py-20 md:py-28 border-b border-white/5 reveal">
        <div className="grid-editorial mb-12 items-end">
          <SectionHeader kicker="Expertise" title="Capabilities" />
          <div className="col-span-12 md:col-span-8 flex justify-start md:justify-end mt-6 md:mt-0 flex-col md:flex-row gap-4 md:items-end">
            <InstructionTag text="HOVER TO REVEAL DETAILS" />
            <button onClick={() => navigateTo('services')} className="text-[10px] uppercase tracking-[0.2em] text-[#888] hover:text-white transition-colors flex items-center gap-2">
              View All Services <ChevronRight size={12} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 relative overflow-hidden">
          {SERVICES.map((srv, idx) => (
            <div key={srv.id} className="relative flex flex-col gap-6 p-8 bg-[var(--bg-dark)] hover:bg-white/[0.03] transition-all duration-500 group cursor-pointer overflow-hidden min-h-[320px]" onClick={() => navigateTo('services')}>
              {/* Background Abstract Hover Image */}
              <img src={srv.img} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 img-monochrome transition-all duration-700 pointer-events-none" alt="" />
              
              <div className="flex justify-between items-start relative z-10">
                <srv.icon className="text-[#555] group-hover:text-white transition-colors" size={24} />
                <span className="text-[10px] font-mono text-[#555] group-hover:text-white transition-colors">{srv.id}</span>
              </div>
              <div className="mt-auto relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight leading-snug">{srv.title}</h3>
                <p className="text-sm text-[#777] leading-relaxed mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute">{srv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW SECTION 5: INTERACTIVE ARSENAL */}
      <section className="py-20 md:py-28 border-b border-white/5 reveal">
        <div className="grid-editorial mb-12 items-end">
          <SectionHeader kicker="Arsenal" title="The Stack" />
          <div className="col-span-12 md:col-span-8 flex justify-start md:justify-end mt-6 md:mt-0 flex-col md:flex-row gap-4 md:items-end">
            <InstructionTag text="INTERACTIVE COMPONENT GRID" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 tech-grid">
          {TECH_STACK.map((tech, idx) => (
             <div key={idx} className="tech-item bg-[var(--bg-dark)] p-8 md:p-12 border border-transparent transition-all duration-500 flex items-center justify-center relative cursor-default">
               <h4 className="font-display text-xl md:text-3xl font-bold uppercase tracking-tighter text-[#666] transition-colors duration-500 hover:text-white text-center">
                 {tech}
               </h4>
             </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: METHODOLOGY */}
      <section className="py-20 md:py-28 border-b border-white/5 reveal">
        <div className="grid-editorial mb-12 items-end">
          <SectionHeader kicker="Methodology" title="Our Process" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={idx} className="bg-[var(--bg-dark)] p-10 flex flex-col gap-6 group hover:bg-white/[0.03] transition-colors">
              <span className="text-[10px] font-mono text-[#555] group-hover:text-white transition-colors border-b border-white/10 pb-4">0{idx + 1}</span>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">{step.title}</h3>
              <p className="text-sm text-[#777] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: SELECTED WORK */}
      <section className="py-20 md:py-28 border-b border-white/5 reveal">
        <div className="grid-editorial mb-12 items-end">
          <SectionHeader kicker="Archive" title="Selected Work" />
          <div className="col-span-12 md:col-span-8 flex justify-start md:justify-end mt-6 md:mt-0 gap-4 flex-col md:flex-row md:items-end">
            <InstructionTag text="INTERACT FOR PREVIEW" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#555]">
              2019 — 2026
            </span>
          </div>
        </div>
        
        <div className="flex flex-col border-t border-white/10 relative">
          {/* Dynamic Image Preview Background (Desktop only) */}
          <div className="absolute right-8 top-0 bottom-0 w-[300px] pointer-events-none z-0 hidden lg:flex items-center justify-center">
             {hoveredWork && (
               <img 
                 src={hoveredWork} 
                 alt="Project Preview" 
                 className="w-full aspect-[4/3] object-cover img-monochrome opacity-40 rounded-lg shadow-2xl transition-all duration-500" 
                 style={{ animation: 'slideUpFade 0.4s ease-out forwards' }}
               />
             )}
          </div>

          {WORK.map((item, index) => (
            <div 
              key={item.id} 
              onMouseEnter={() => setHoveredWork(item.img)}
              onMouseLeave={() => setHoveredWork(null)}
              className={`group flex flex-col md:flex-row justify-between md:items-center py-8 md:py-12 border-b border-white/10 cursor-pointer transition-all duration-500 hover:bg-white/[0.02] hover:pl-6 pr-6 reveal delay-${(index % 3) * 100} relative z-10`}
            >
              <div className="flex items-center gap-6 md:gap-16 w-full md:w-auto">
                <span className="text-sm font-mono text-[#555] group-hover:text-white transition-colors">{item.id}</span>
                <h3 className="font-display text-2xl md:text-4xl font-black uppercase tracking-tight text-outline group-hover:text-white transition-all">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-8 mt-6 md:mt-0 w-full md:w-auto">
                <span className="text-[10px] uppercase tracking-widest text-[#777]">{item.year} // {item.type}</span>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all bg-[var(--bg-dark)]">
                  <ArrowUpRight size={18} className="transform group-hover:scale-110 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: STATS */}
      <section className="grid-editorial py-20 md:py-28 border-b border-white/5 reveal relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none flex items-center justify-center">
           <svg viewBox="0 0 200 200" className="w-[100%] h-[100%]">
             <path d="M0 100 L200 100 M100 0 L100 200 M0 0 L200 200 M0 200 L200 0" stroke="white" strokeWidth="0.5" />
             <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="0.5" />
           </svg>
        </div>

        {[
          { num: "7", label: "Years Active", suffix: "y" },
          { num: "4", label: "Global Hubs", suffix: "x" },
          { num: "99", label: "Client Retention", suffix: "%" },
          { num: "0", label: "Compromises", suffix: ".0" }
        ].map((stat, idx) => (
          <div key={idx} className="col-span-6 md:col-span-3 flex flex-col gap-4 reveal relative z-10" style={{transitionDelay: `${idx * 100}ms`}}>
            <p className="font-display text-5xl md:text-6xl leading-none font-black text-outline">{stat.num}<span className="text-2xl text-[#444] ml-2">{stat.suffix}</span></p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#777] border-t border-white/10 pt-4 w-full font-medium">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* NEW SECTION 9: LEADERSHIP (SINGLE PROFILE) */}
      <section className="py-20 md:py-28 border-b border-white/5 reveal">
        <div className="grid-editorial mb-16 items-end">
          <SectionHeader kicker="Leadership" title="The Architect" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          <div className="col-span-12 md:col-span-5 md:col-start-2 w-full aspect-[4/5] overflow-hidden bg-white/5 border border-white/10 relative group reveal">
             <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover img-monochrome opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Anant Mishra" />
          </div>
          <div className="col-span-12 md:col-span-5 reveal delay-100 flex flex-col gap-6">
             <InstructionTag text="FOUNDER & PRINCIPAL" />
             <h3 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mt-4">Anant Mishra</h3>
             <p className="text-[10px] uppercase tracking-[0.3em] text-[#777] border-b border-white/10 pb-6 mb-2">Since 2019</p>
             <p className="text-lg text-[#888] font-light leading-relaxed">
               Leading a global team of digital architects, Anant ensures that every platform integration, communication strategy, and IT service aligns with our philosophy of radical minimalism and uncompromising operational excellence.
             </p>
             <button onClick={() => navigateTo('about')} className="mt-4 pb-2 border-b border-white text-xs uppercase tracking-[0.2em] font-bold hover:text-[#888] hover:border-[#888] transition-colors inline-flex items-center gap-2 group w-max">
                Read Full Story <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </div>
      </section>

      {/* SECTION 10: INTERACTIVE FAQ */}
      <section className="py-20 md:py-28 border-b border-white/5 reveal">
        <div className="grid-editorial mb-12 items-start">
           <SectionHeader kicker="Operations" title="FAQ" />
           <div className="col-span-12 md:col-span-8 flex flex-col border-t border-white/10">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border-b border-white/10 overflow-hidden reveal" style={{transitionDelay: `${idx * 100}ms`}}>
                  <button 
                    onClick={() => toggleFaq(idx)} 
                    className="w-full py-8 flex justify-between items-center text-left hover:text-[#aaa] transition-colors focus:outline-none"
                  >
                    <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight">{faq.q}</h3>
                    <div className="ml-4 flex-shrink-0 text-[#555]">
                      {activeFaq === idx ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>
                  <div 
                    className="transition-all duration-500 ease-in-out"
                    style={{ maxHeight: activeFaq === idx ? '200px' : '0px', opacity: activeFaq === idx ? 1 : 0 }}
                  >
                    <p className="pb-8 text-[#888] font-light leading-relaxed max-w-2xl">{faq.a}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 11: GLOBAL MAP */}
      <section className="py-20 md:py-28 border-b border-white/5 reveal relative">
        <div className="grid-editorial mb-12 items-end">
          <SectionHeader kicker="Locations" title="Global Presence" />
          <div className="col-span-12 md:col-span-8 flex flex-wrap gap-3 mt-6 md:mt-0 md:justify-end">
            {LOCATIONS.map(loc => (
              <button 
                key={loc.id} onClick={() => setActiveLocation(loc)}
                className={`px-6 py-3 text-[9px] uppercase tracking-[0.3em] font-bold transition-all duration-500 border ${
                  activeLocation?.id === loc.id ? 'bg-white text-black border-white' : 'border-white/20 text-[#888] hover:border-white/50 hover:text-white'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
          <GlobalMap onLocationSelect={setActiveLocation} activeLocation={activeLocation} />
          
          <div className={`absolute top-6 right-6 md:top-10 md:right-10 w-[85%] max-w-sm glass-panel p-8 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 ${
            activeLocation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          }`}>
            {activeLocation && (
              <>
                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                  <Globe size={24} className="text-[#555]" />
                  <button onClick={() => setActiveLocation(null)} className="p-2 hover:bg-white/10 transition-colors pointer-events-auto"><X size={18} /></button>
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#888] font-bold">{activeLocation.country}</p>
                  <h3 className="font-display text-3xl font-black uppercase mt-3 text-outline">{activeLocation.name}</h3>
                  <p className="text-sm text-[#aaa] leading-relaxed mt-6 font-light">{activeLocation.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                   <span className="text-[10px] uppercase tracking-[0.3em] text-[#666]">Team Members</span>
                   <span className="font-display text-xl font-bold">{activeLocation.team}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 12: INSIGHTS/JOURNAL */}
      <section className="py-20 md:py-28 border-b border-white/5 reveal">
        <div className="grid-editorial mb-12 items-end">
           <SectionHeader kicker="Journal" title="Latest Insights" />
           <div className="col-span-12 md:col-span-8 flex justify-start md:justify-end mt-6 md:mt-0 gap-4 flex-col md:flex-row md:items-end">
            <button className="text-[10px] uppercase tracking-[0.2em] text-[#888] hover:text-white transition-colors flex items-center gap-2">
              Read All Articles <ChevronRight size={12} />
            </button>
          </div>
        </div>
        <div className="flex flex-col border-t border-white/10">
          {INSIGHTS.map((insight, idx) => (
             <div key={idx} className="group flex flex-col md:flex-row justify-between md:items-center py-6 md:py-8 border-b border-white/10 cursor-pointer hover:bg-white/[0.02] hover:px-6 transition-all duration-500 reveal" style={{transitionDelay: `${idx * 100}ms`}}>
               <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto">
                 <span className="text-[10px] font-mono text-[#555] uppercase">{insight.date}</span>
                 <h3 className="font-display text-lg md:text-2xl font-bold uppercase tracking-tight group-hover:text-white text-[#ccc] transition-colors">{insight.title}</h3>
               </div>
               <div className="mt-4 md:mt-0 flex items-center gap-4 text-[10px] uppercase tracking-widest text-[#777] group-hover:text-white transition-colors">
                  Read Article <ArrowUpRight size={14} className="transform group-hover:scale-125 transition-transform" />
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* SECTION 13: TESTIMONIAL */}
      <section className="grid-editorial py-20 md:py-28 border-b border-white/5 reveal relative overflow-hidden">
        {/* Quote Abstract Background */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
          <Quote size={400} />
        </div>

        <div className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col items-center text-center relative z-10">
          <InstructionTag text="CLIENT FEEDBACK" />
          <h3 className="font-display text-2xl md:text-4xl font-light italic leading-relaxed text-white mt-12">
            "Liaisonit doesn't just build websites; they architect digital ecosystems. Their obsession with minimalism completely transformed our platform."
          </h3>
          <p className="mt-12 text-[10px] uppercase tracking-[0.4em] font-bold text-[#888]">
            — Executive Director, <span className="text-white">LVMH Digital</span>
          </p>
        </div>
      </section>

      {/* SECTION 14: CTA */}
      <section className="py-20 md:py-28 reveal">
        <div className="flex flex-col items-center justify-center text-center gap-10 py-24 glass-panel group cursor-pointer hover:bg-white transition-colors duration-1000 relative overflow-hidden" onClick={() => navigateTo('contact')}>
          {/* Hover Expanding Circle Illustration */}
          <div className="absolute inset-0 bg-white scale-0 group-hover:scale-150 rounded-full transition-transform duration-[1.2s] ease-in-out z-0 origin-center pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            <InstructionTag text="INITIATE PROTOCOL" />
            <h2 className="font-display text-5xl md:text-[6rem] font-black uppercase tracking-tighter leading-none group-hover:text-black transition-colors duration-1000 mt-8">
              Let's <br /> <span className="text-outline group-hover:text-black group-hover:[-webkit-text-stroke:0px] transition-all duration-1000">Talk.</span>
            </h2>
            <div className="w-16 h-16 rounded-full border border-white/20 group-hover:border-black group-hover:bg-black text-white flex items-center justify-center transition-all duration-1000 mt-12">
               <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const AboutPage = () => {
  useScrollReveal();
  return (
    <div className="flex flex-col gap-24 pt-24 md:pt-32 page-enter pb-24 w-full">
      <section className="grid-editorial gap-y-10">
        <SectionHeader kicker="Identity" />
        <div className="col-span-12 md:col-span-8 reveal delay-100">
          <InstructionTag text="ESTABLISHED 2019" />
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-12 mt-6">
            The <br/> <span className="text-outline">Agency</span>
          </h1>
          
          <div className="mb-12 w-full h-[40vh] border border-white/10 glass-panel p-2 overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover img-monochrome" alt="Office space" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
               <InstructionTag text="LONDON HQ" />
            </div>
          </div>

          <p className="text-2xl md:text-3xl text-[#fff] font-light leading-relaxed">
            Liaisonit Studios is a collective of marketing and operations architects. We strip away the noise to build focused, high-performance MarTech and ITES ecosystems that command attention. 
          </p>
          <p className="text-lg text-[#888] font-light leading-relaxed mt-8 max-w-2xl border-l-2 border-white/20 pl-6">
            Black and white isn't just a color palette; it's a philosophy of absolute clarity.
          </p>
        </div>
      </section>

      <section className="grid-editorial border-t border-white/10 pt-20 reveal">
         <SectionHeader kicker="Principles" />
         <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="reveal delay-100 flex flex-col gap-6">
               <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-white stroke-1 fill-none opacity-50">
                 <rect x="20" y="20" width="60" height="60" />
                 <line x1="50" y1="20" x2="50" y2="80" />
                 <line x1="20" y1="50" x2="80" y2="50" />
               </svg>
               <div>
                 <h3 className="font-display text-xl font-bold uppercase mb-4 text-outline">01. Radical Minimalism</h3>
                 <p className="text-sm text-[#888] leading-relaxed">We believe every element on a screen must justify its existence. By removing the superfluous, we amplify the core message.</p>
               </div>
            </div>
            <div className="reveal delay-200 flex flex-col gap-6">
               <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-white stroke-1 fill-none opacity-50">
                 <circle cx="50" cy="50" r="30" />
                 <circle cx="50" cy="50" r="10" />
                 <path d="M50 0 L50 20 M50 80 L50 100 M0 50 L20 50 M80 50 L100 50" />
               </svg>
               <div>
                 <h3 className="font-display text-xl font-bold uppercase mb-4 text-outline">02. Engineering Excellence</h3>
                 <p className="text-sm text-[#888] leading-relaxed">Design is only as good as its execution. We build on modern, robust architectures ensuring blazing fast performance.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

const ServicesPage = () => {
  useScrollReveal();
  return (
    <div className="flex flex-col pt-24 md:pt-32 page-enter pb-24 w-full">
      <section className="grid-editorial mb-16">
        <SectionHeader kicker="Expertise" />
        <div className="col-span-12 md:col-span-8 reveal delay-100">
          <InstructionTag text="WHAT WE DO" />
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mt-6">
            Our <br/> <span className="text-outline">Capabilities</span>
          </h1>
        </div>
      </section>
      
      <div className="flex flex-col border-t border-white/10 reveal delay-200">
        {SERVICES.map((srv, idx) => (
          <div key={srv.id} className="group grid-editorial py-12 md:py-16 border-b border-white/10 cursor-pointer hover:bg-white/[0.02] transition-colors items-center reveal relative overflow-hidden">
            
            {/* Background Hover Image Reveal */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none hidden lg:block mask-image-gradient">
              <img src={srv.img} className="w-full h-full object-cover img-monochrome" alt="" />
            </div>

            <div className="col-span-12 md:col-span-2 flex items-center mb-6 md:mb-0 relative z-10">
              <span className="font-display text-4xl md:text-5xl text-[#444] group-hover:text-white transition-colors">{srv.id}</span>
            </div>
            <div className="col-span-12 md:col-span-5 mb-4 md:mb-0 relative z-10">
              <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight transition-all duration-500 text-outline group-hover:text-white group-hover:[-webkit-text-stroke:0px]">
                {srv.title}
              </h3>
            </div>
            <div className="col-span-12 md:col-span-4 relative z-10">
              <p className="text-base text-[#888] leading-relaxed">{srv.desc}</p>
            </div>
            <div className="col-span-12 md:col-span-1 flex justify-start md:justify-end mt-6 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
               <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white">
                  <ArrowRight size={24} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => {
  useScrollReveal();
  return (
    <div className="flex flex-col pt-24 md:pt-32 page-enter pb-24 w-full relative">
      
      {/* Background Architectural Blueprint */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] pointer-events-none z-0 overflow-hidden flex flex-wrap">
        {Array(20).fill(0).map((_, i) => (
          <div key={i} className="w-24 h-24 border border-white/50 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-r border-b border-white/50"></div>
          </div>
        ))}
      </div>

      <section className="grid-editorial mb-16 relative z-10">
        <SectionHeader kicker="Initiate" />
        <div className="col-span-12 md:col-span-8 reveal delay-100">
           <InstructionTag text="SECURE CONNECTION ESTABLISHED" />
           <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mt-6">
             Start A <br/><span className="text-outline">Project</span>
           </h1>
        </div>
      </section>
      
      <section className="grid-editorial pt-12 border-t border-white/10 reveal delay-200 relative z-10">
        <div className="col-span-12 md:col-span-7 pr-0 md:pr-12 mb-20 md:mb-0">
          <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-4 reveal">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#888] font-medium flex items-center gap-2">
                [01] Your Name
              </label>
              <input type="text" placeholder="John Doe" className="w-full text-xl md:text-2xl focus:bg-white/[0.02] px-4" />
            </div>
            <div className="flex flex-col gap-4 reveal delay-100">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#888] font-medium flex items-center gap-2">
                [02] Email Address
              </label>
              <input type="email" placeholder="john@company.com" className="w-full text-xl md:text-2xl focus:bg-white/[0.02] px-4" />
            </div>
            <div className="flex flex-col gap-4 reveal delay-200">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#888] font-medium flex items-center gap-2">
                [03] Project Details
              </label>
              <textarea placeholder="Tell us about your vision..." rows={3} className="w-full text-xl md:text-2xl resize-none focus:bg-white/[0.02] px-4" />
            </div>
            <button className="mt-8 pb-4 border-b border-white hover:border-[#777] text-white hover:text-[#777] transition-colors flex items-center justify-between font-display text-xl font-bold uppercase tracking-widest reveal delay-300 group">
              Submit Inquiry
              <ArrowRight className="group-hover:translate-x-3 transition-transform" size={24} />
            </button>
          </form>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-9 flex flex-col gap-20 reveal delay-300">
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#777] flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#777]"></span> Direct Email
            </h4>
            <a href="mailto:hello@liaisonit.com" className="font-display text-2xl md:text-3xl font-black text-outline hover:text-white transition-colors">
              hello@<br/>liaisonit.com
            </a>
          </div>
          
          <div className="flex flex-col gap-8">
             <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#777] flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#777]"></span> Global Hubs
            </h4>
             <div className="flex flex-col gap-6">
               {LOCATIONS.map(loc => (
                 <div key={loc.id} className="flex items-start justify-between border-b border-white/10 pb-4 group cursor-pointer">
                   <div>
                     <p className="text-lg font-bold uppercase tracking-widest text-white group-hover:text-[#aaa] transition-colors">{loc.name}</p>
                     <p className="text-[10px] text-[#777] uppercase tracking-wider mt-1">{loc.country}</p>
                   </div>
                   <MapPin size={18} className="text-[#555] group-hover:text-white transition-colors" />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- MAIN APP (ROUTER) ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeLocation, setActiveLocation] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative bg-[#050505] text-white selection:bg-white selection:text-black flex flex-col font-poppins font-light">
      <StyleInjector />

      {/* Structural Architectural Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 max-w-[1800px] mx-auto w-full mix-blend-overlay opacity-20">
        <div className="w-[1px] h-full bg-white"></div>
        <div className="w-[1px] h-full bg-white hidden md:block"></div>
        <div className="w-[1px] h-full bg-white hidden lg:block"></div>
        <div className="w-[1px] h-full bg-white"></div>
      </div>

      {/* Modern Pointer Glow */}
      <div 
        className="fixed w-[800px] h-[800px] rounded-full pointer-events-none blur-[150px] transition-transform duration-[1.5s] ease-out z-0 hidden md:block mix-blend-screen"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 60%)',
          transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)` 
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 md:px-12 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => navigateTo('home')} className="font-display font-black text-xl md:text-2xl tracking-tighter uppercase flex items-center gap-4 hover:opacity-70 transition-opacity">
          <div className="w-6 h-6 bg-white" />
          Liaisonit
        </button>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-12 items-center">
          {navLinks.map(link => (
            <button 
              key={link.id} 
              onClick={() => navigateTo(link.id)}
              className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative group
                ${currentPage === link.id ? 'text-white' : 'text-[#777] hover:text-white'}`}
            >
              {link.label}
              <span className={`absolute -bottom-4 left-0 h-[2px] bg-white transition-all duration-500 ease-out ${currentPage === link.id ? 'w-full' : 'w-0 group-hover:w-1/2'}`}></span>
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setNavOpen(!navOpen)}>
          {navOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center gap-12 md:hidden">
          {navLinks.map((link, idx) => (
            <button 
              key={link.id} 
              onClick={() => navigateTo(link.id)}
              className={`font-display text-5xl font-black uppercase tracking-tighter page-enter ${currentPage === link.id ? 'text-white' : 'text-outline'}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Router */}
      <main className="relative z-10 px-6 md:px-12 pt-24 max-w-[1800px] w-full mx-auto flex-grow flex flex-col">
        {currentPage === 'home' && <HomePage setActiveLocation={setActiveLocation} activeLocation={activeLocation} navigateTo={navigateTo} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 pb-12 mt-auto max-w-[1800px] w-full mx-auto">
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-[#777] uppercase tracking-[0.3em] font-bold">
          <p>© 2019–2026 LIAISONIT STUDIOS.</p>
          {/* Social icons removed per user request */}
        </div>
      </footer>
    </div>
  );
}