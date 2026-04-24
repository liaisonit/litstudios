import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Globe, Zap, X, Menu, 
  Code, PenTool, LayoutTemplate, Smartphone,
  MapPin, ArrowUpRight, ChevronRight, Quote,
  MousePointer2, Plus, Minus,
  Cpu, MessageSquare, Server, BarChart, 
  Database, Network, BookOpen, Fingerprint
} from 'lucide-react';

// --- STYLING, ANIMATION & FONT INJECTION ---
const StyleInjector = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;700;900&family=Poppins:wght@300;400;500;600&display=swap');
    
    :root {
      --bg-dark: #030303;
      --glass-border: rgba(255, 255, 255, 0.06);
      --glass-bg: rgba(255, 255, 255, 0.01);
      --text-main: #ffffff;
      --text-muted: #777777;
    }
    
    html, body {
      background-color: var(--bg-dark) !important;
      color: var(--text-main) !important;
      font-family: 'Poppins', sans-serif;
      margin: 0;
      overflow-x: hidden;
      cursor: none; /* Custom cursor takes over */
    }

    /* Noise Overlay */
    body::before {
      content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 9999;
    }

    h1, h2, h3, h4, h5, h6, .font-display { font-family: 'Montserrat', sans-serif; }

    .glass-panel {
      background: var(--glass-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
    }

    .grid-editorial { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 2rem; }

    /* Scroll Reveal Animations */
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
    .delay-100 { transition-delay: 100ms; } .delay-200 { transition-delay: 200ms; } .delay-300 { transition-delay: 300ms; }

    /* Image Treatments */
    .img-monochrome { filter: grayscale(100%) contrast(120%) brightness(80%); transition: filter 0.7s ease, transform 1s ease; }
    .group:hover .img-monochrome, .hover-trigger:hover .img-monochrome { filter: grayscale(100%) contrast(100%) brightness(100%); transform: scale(1.03); }

    /* Page Enter Animations */
    .page-enter { animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(30px); }
    .stagger-1 { animation-delay: 0.1s; } .stagger-2 { animation-delay: 0.2s; } .stagger-3 { animation-delay: 0.3s; }
    @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(40px); filter: blur(5px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }

    /* Outline Text Effect */
    .text-outline { color: transparent; -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3); transition: all 0.5s ease; }
    .text-outline:hover, .group:hover .text-outline { color: #ffffff; -webkit-text-stroke: 1px transparent; }

    /* Marquee Animation */
    @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
    @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
    .animate-marquee { display: inline-block; white-space: nowrap; animation: marquee 40s linear infinite; }
    .animate-marquee-reverse { display: inline-block; white-space: nowrap; animation: marquee-reverse 50s linear infinite; }

    /* Custom Scroll Indicator Animation */
    @keyframes scrollLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
    @keyframes dataPulse { 0% { opacity: 0.1; } 50% { opacity: 0.5; } 100% { opacity: 0.1; } }

    /* Custom Cursor */
    .custom-cursor {
      position: fixed; top: 0; left: 0; width: 20px; height: 20px; border-radius: 50%;
      background: white; mix-blend-mode: difference; pointer-events: none; z-index: 10000;
      transform: translate(-50%, -50%); transition: width 0.3s, height 0.3s, background-color 0.3s;
    }
    .custom-cursor.hovering { width: 60px; height: 60px; background: rgba(255,255,255,1); }

    /* Floating Image Reveal (Journal/Work) */
    .hover-reveal-img {
      position: fixed; pointer-events: none; z-index: 50; opacity: 0; transform: translate(-50%, -50%) scale(0.8);
      transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      width: 400px; height: 280px; object-fit: cover; border-radius: 8px; filter: grayscale(100%) contrast(120%);
    }
    .hover-reveal-img.visible { opacity: 1; transform: translate(-50%, -50%) scale(1); }

    /* Leaflet Overrides */
    .leaflet-container { background: var(--bg-dark) !important; font-family: 'Poppins', sans-serif; cursor: none !important; }
    .leaflet-control-zoom { border: 1px solid var(--glass-border) !important; background: var(--glass-bg) !important; backdrop-filter: blur(10px); }
    .leaflet-control-zoom a { background: transparent !important; color: #fff !important; border-bottom: 1px solid var(--glass-border) !important; cursor: none !important; }
    .leaflet-control-attribution { display: none !important; }
    
    .pulse-marker { width: 14px; height: 14px; background: #fff; border-radius: 50%; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); animation: pulse 2s infinite cubic-bezier(0.66, 0, 0, 1); border: 2px solid var(--bg-dark); transition: transform 0.4s ease; }
    .pulse-marker:hover { transform: scale(1.8); }
    @keyframes pulse { 100% { box-shadow: 0 0 0 24px rgba(255, 255, 255, 0); } }

    /* Inputs */
    input, textarea { background: transparent; border: none; border-bottom: 1px solid var(--glass-border); color: white; font-family: 'Poppins', sans-serif; padding: 16px 0; transition: border-color 0.4s ease; border-radius: 0; cursor: none; }
    input:focus, textarea:focus { outline: none; border-bottom-color: white; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg-dark); border-left: 1px solid rgba(255,255,255,0.02); }
    ::-webkit-scrollbar-thumb { background: #444; }
    
    /* Interactive Grid Hover */
    .tech-grid:hover .tech-item { opacity: 0.2; filter: blur(2px); }
    .tech-grid .tech-item:hover { opacity: 1; filter: blur(0px); transform: scale(1.05); border-color: rgba(255,255,255,0.5); z-index: 10; background: rgba(255,255,255,0.05); }
    
    /* Utility */
    .interactive { cursor: none !important; }
    a, button { cursor: none !important; }
  `}} />
);

// --- CUSTOM HOOKS ---
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = ev => setMousePosition({ x: ev.clientX, y: ev.clientY });
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

// --- DATA ARRAYS ---
const LOCATIONS = [
  { id: 'us', name: 'New York', country: 'United States', coords: [40.7128, -74.0060], desc: 'The heartbeat of our global data operations. Where strategy meets the skyline.', team: 12 },
  { id: 'uk', name: 'London', country: 'United Kingdom', coords: [51.5074, -0.1278], desc: 'Our European hub for cutting-edge MarTech and immersive digital ecosystems.', team: 8 },
  { id: 'ca', name: 'Toronto', country: 'Canada', coords: [43.6510, -79.3470], desc: 'Driving technological innovation and robust ITES platform engineering.', team: 10 },
  { id: 'au', name: 'Sydney', country: 'Australia', coords: [-33.8688, 151.2093], desc: 'Setting the trend for the APAC region with automated communications.', team: 5 }
];

const SERVICES = [
  { id: '01', title: 'Marketing Technology', desc: 'Architecting scalable MarTech stacks, CDP integrations, and automated marketing pipelines.', icon: Cpu, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop' },
  { id: '02', title: 'Strategic MarComms', desc: 'Data-driven brand narratives, algorithmic PR, and targeted global communication campaigns.', icon: MessageSquare, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
  { id: '03', title: 'IT Enabled Services', desc: 'Robust infrastructure management, technical support, and global business process outsourcing.', icon: Server, img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' },
  { id: '04', title: 'Data Intelligence', desc: 'Advanced AI Overviews (AIO), consumer insights, and predictive modeling across platforms.', icon: Network, img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
];

const CASE_STUDIES = [
  { id: '01', title: "Aura Global", metric: "+340% ROI", type: "MarTech Stack Rebuild", year: "2025", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", desc: "Consolidated 14 disparate marketing tools into a unified Snowflake-backed intelligence engine." },
  { id: '02', title: "Nexus Systems", metric: "2M+ Queries", type: "ITES Infrastructure", year: "2024", img: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1974&auto=format&fit=crop", desc: "Deployed a global tier-1 support infrastructure utilizing advanced LLM routing." },
  { id: '03', title: "Eos Analytics", metric: "Zero Downtime", type: "Data Architecture", year: "2023", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", desc: "Built a headless commerce analytics dashboard processing billions of secure data points." },
  { id: '04', title: "Zenith Corp", metric: "AIO Optimized", type: "Semantic SEO & MarComms", year: "2022", img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2069&auto=format&fit=crop", desc: "Restructured digital presence to dominate AI Overviews (SGE) for the fintech sector." },
  { id: '05', title: "Vanguard", metric: "-40% CAC", type: "Automated Marketing", year: "2021", img: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop", desc: "Engineered a closed-loop algorithmic bidding system integrated directly with CRM data." }
];

const BRANDS = ["SALESFORCE", "HUBSPOT", "SNOWFLAKE", "AWS", "ZENDESK", "MARKETO", "TABLEAU", "DATADOG"];
const TECH_STACK = ["Salesforce CRM", "HubSpot", "Marketo", "AWS Lambda", "Tableau", "Snowflake CDP", "Zendesk Suite", "Vercel Edge"];

const MEGA_FAQS = [
  { category: "Methodology", items: [
    { q: "How do you handle legacy MarTech integrations?", a: "We utilize an agile 'strangler fig' pattern—auditing your existing monolithic stack, wrapping it with modern APIs, and systematically migrating data to platforms like HubSpot or Salesforce with zero operational downtime." },
    { q: "What is your approach to AIO (AI Overview) compliance?", a: "We architect content using strict semantic HTML, rich schema.org markup, and entity-relationship models. This ensures your brand is interpreted correctly by LLMs and Google's SGE (Search Generative Experience)." },
  ]},
  { category: "Operations (ITES)", items: [
    { q: "Can you scale support infrastructure globally?", a: "Yes. Our ITES division deploys 'follow-the-sun' models. We implement LLM-assisted triage routing connected to Zendesk/ServiceNow, ensuring human agents only handle high-value escalations." },
    { q: "How is data compliance handled across GEOs?", a: "We build localized data lakes (AWS/Snowflake) ensuring strict adherence to GDPR, CCPA, and regional data sovereignty laws, routing traffic based on explicit GEO-IP requirements." },
  ]},
  { category: "Partnership", items: [
    { q: "What is the typical engagement duration?", a: "Enterprise architectural rebuilds span 4-6 months. We then shift to an SLA-backed continuous optimization retainer to scale the deployed ecosystem." },
    { q: "Do you provide white-label BPO services?", a: "Yes. Our ITES and data processing teams operate seamlessly as extensions of your internal operations under strict NDAs." }
  ]}
];

// --- 20 DYNAMIC ARTICLES FOR JOURNAL ---
const ALL_ARTICLES = [
  { id: 1, type: "Blog", title: "The Fallacy of Infinite Scroll in Modern UI", date: "Oct 12, 2025", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000" },
  { id: 2, type: "White Paper", title: "Architecting Headless Commerce for Scale", date: "Sep 28, 2025", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000" },
  { id: 3, type: "Research", title: "LLM Hallucinations in Automated Customer Support", date: "Aug 15, 2025", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000" },
  { id: 4, type: "News", title: "Liaisonit Studios Expands Toronto Hub", date: "Jul 04, 2025", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000" },
  { id: 5, type: "Blog", title: "Semantic SEO: Preparing for AI Overviews (SGE)", date: "Jun 22, 2025", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000" },
  { id: 6, type: "Research", title: "Data Sovereignty: Managing Multi-Region CDPs", date: "May 10, 2025", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000" },
  { id: 7, type: "Blog", title: "The Evolution of CRM: From Database to Intelligence Engine", date: "Apr 18, 2025", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000" },
  { id: 8, type: "White Paper", title: "Zero-Trust Architecture in ITES BPO Models", date: "Mar 30, 2025", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000" },
  { id: 9, type: "News", title: "Anant Mishra Keynotes at MarTech Global 2025", date: "Feb 14, 2025", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000" },
  { id: 10, type: "Blog", title: "Why We Abandoned Monolithic CMS Architectures", date: "Jan 05, 2025", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000" },
  { id: 11, type: "Research", title: "Predictive Analytics in B2B Lead Scoring", date: "Dec 12, 2024", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000" },
  { id: 12, type: "Blog", title: "Minimalism in Complex Data Visualization", date: "Nov 22, 2024", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000" },
  { id: 13, type: "White Paper", title: "Migrating from Marketo to Custom Snowflake Pipelines", date: "Oct 08, 2024", img: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000" },
  { id: 14, type: "News", title: "Liaisonit Achieves ISO 27001 Certification", date: "Sep 19, 2024", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000" },
  { id: 15, type: "Blog", title: "Building Resilient APIs for Multi-Tenant MarComms", date: "Aug 02, 2024", img: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2000" },
  { id: 16, type: "Research", title: "Consumer Trust Index in Algorithmic Targeting", date: "Jul 14, 2024", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000" },
  { id: 17, type: "Blog", title: "Spatial Interfaces: Beyond the 2D Screen", date: "Jun 20, 2024", img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2000" },
  { id: 18, type: "News", title: "New ITES Command Center Opens in Sydney", date: "May 05, 2024", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000" },
  { id: 19, type: "White Paper", title: "The Economics of Algorithmic Pricing Models", date: "Apr 11, 2024", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000" },
  { id: 20, type: "Blog", title: "Scaling Global Support Operations", date: "Mar 01, 2024", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000" }
];


// --- COMPONENTS ---

const SectionHeader = ({ title, kicker, className = "" }) => (
  <header className={`col-span-12 md:col-span-4 reveal ${className}`}>
    <div className="sticky top-32">
      <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#777] flex items-center gap-4">
        <span className="w-8 h-[1px] bg-[#777]"></span> {kicker}
      </h4>
      {title && <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter mt-6 leading-none">{title}</h2>}
    </div>
  </header>
);

const InstructionTag = ({ text, icon: Icon }) => (
  <div className="inline-flex items-center gap-2 border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-none text-[8px] font-mono uppercase tracking-widest text-[#aaa]">
    {Icon && <Icon size={10} />}
    [{text}]
  </div>
);

// SVG Abstract Background Component
const NeuralBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03]">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <circle cx="20%" cy="30%" r="300" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 12" className="animate-[spin_100s_linear_infinite]" />
      <circle cx="80%" cy="70%" r="400" fill="none" stroke="white" strokeWidth="0.5" className="animate-[spin_150s_linear_infinite_reverse]" />
    </svg>
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
      <div ref={mapRef} className="w-full h-full grayscale-[1] contrast-125 brightness-75 interactive" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(3,3,3,1)] z-10"></div>
      <div className="absolute top-6 left-6 z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <InstructionTag text="GEO-TARGETED INFRASTRUCTURE" icon={MousePointer2} />
      </div>
    </div>
  );
};

// --- PAGES ---

const HomePage = ({ setActiveLocation, activeLocation, navigateTo }) => {
  useScrollReveal();
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <article className="flex flex-col w-full">
      
      {/* SECTION 1: HERO */}
      <section className="flex flex-col gap-8 items-start pt-24 md:pt-32 min-h-[90vh] justify-center border-b border-white/5 pb-16 relative overflow-hidden">
        <NeuralBackground />

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 px-5 py-2 rounded-none text-[9px] font-semibold uppercase tracking-[0.3em] text-[#aaa] page-enter stagger-1 mb-6">
            <Database size={10} className="text-white" /> Global Data Architecture
          </div>
          
          <h1 className="font-display text-[4rem] md:text-[8rem] leading-[0.85] font-black uppercase tracking-tighter page-enter stagger-2 w-full text-white">
            We Build <br/>
            <span className="text-outline block ml-0 md:ml-24 mt-2 md:mt-0">The Future.</span>
          </h1>
          
          <div className="grid-editorial w-full mt-16 page-enter stagger-3">
            <div className="col-span-12 md:col-span-5 hidden md:block relative group">
               <div className="w-full h-48 overflow-hidden border border-white/10 glass-panel p-2">
                 <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Data Architecture" className="w-full h-full object-cover img-monochrome" />
               </div>
               <div className="absolute bottom-4 left-4"><InstructionTag text="AIO COMPLIANT DATA LAKES" /></div>
            </div>
            <div className="col-span-12 md:col-start-7 md:col-span-6 flex flex-col items-start justify-end">
              <p className="text-[#888] text-xl md:text-2xl font-light leading-relaxed">
                A premium monochromatic experience bridging MarTech, MarComms, and ITES since 2019. Optimized for scalable intelligence.
              </p>
              <button onClick={() => navigateTo('contact')} className="mt-8 pb-3 border-b border-white text-sm uppercase tracking-[0.2em] font-bold hover:text-[#555] hover:border-[#555] transition-colors inline-flex items-center gap-3 group interactive">
                Initiate Project <ArrowRight size={16} className="group-hover:translate-x-3 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 hidden md:flex flex-col items-center gap-4 opacity-50">
          <span className="text-[8px] uppercase tracking-[0.4em] text-[#888] font-bold" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Scroll</span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-full bg-white animate-[scrollLine_2s_ease-in-out_infinite]"></div></div>
        </div>
      </section>

      {/* SECTION 2: MARQUEE */}
      <section aria-hidden="true" className="relative w-full overflow-hidden border-b border-white/5 py-10 reveal bg-white/5">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-dark)] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-dark)] to-transparent z-10"></div>
        <div className="animate-marquee opacity-80">
          <div className="flex gap-20 items-center pr-20">
            {BRANDS.map((brand, idx) => (
              <span key={idx} className="font-display text-4xl font-black uppercase tracking-widest text-outline">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: PHILOSOPHY */}
      <section className="grid-editorial w-full py-24 md:py-40 border-b border-white/5 relative">
        <SectionHeader kicker="Philosophy" />
        <div className="col-span-12 md:col-span-8 flex flex-col gap-12 reveal delay-100">
          <h2 className="font-display text-4xl md:text-[5rem] leading-[0.9] font-black uppercase tracking-tighter">
            We eliminate the noise. <br />
            <span className="text-[#444]">We amplify the signal.</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-12 mt-8">
            <div className="w-full md:w-5/12 relative group overflow-hidden border border-white/10 p-2 glass-panel">
              <img src="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070" alt="Server Infrastructure" className="w-full aspect-square object-cover img-monochrome" />
            </div>
            <div className="w-full md:w-7/12 flex flex-col justify-end gap-6">
              <InstructionTag text="CORE DIRECTIVE" icon={Fingerprint} />
              <p className="text-xl md:text-2xl text-[#888] font-light leading-relaxed border-l border-white/20 pl-6">
                In an ecosystem defined by algorithmic chaos, true luxury is clarity. We architect strict, zero-latency digital infrastructures that command both human attention and machine intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SERVICES */}
      <section className="py-24 md:py-40 border-b border-white/5 reveal">
        <div className="grid-editorial mb-16 items-end">
          <SectionHeader kicker="Expertise" title="Capabilities" />
          <div className="col-span-12 md:col-span-8 flex justify-start md:justify-end mt-6 md:mt-0 flex-col md:flex-row gap-4 md:items-end">
            <button onClick={() => navigateTo('services')} className="text-[10px] uppercase tracking-[0.3em] text-[#888] hover:text-white transition-colors flex items-center gap-2 interactive">
              Explore All Protocols <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {SERVICES.map((srv, idx) => (
            <div key={srv.id} className="relative flex flex-col gap-8 p-10 bg-[var(--bg-dark)] hover:bg-white/[0.03] transition-all duration-500 group overflow-hidden min-h-[380px] interactive" onClick={() => navigateTo('services')}>
              <img src={srv.img} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 img-monochrome transition-all duration-700 pointer-events-none" alt="" />
              <div className="flex justify-between items-start relative z-10">
                <srv.icon className="text-[#555] group-hover:text-white transition-colors" size={28} />
                <span className="text-[10px] font-mono text-[#555] group-hover:text-white transition-colors">[{srv.id}]</span>
              </div>
              <div className="mt-auto relative z-10 transform group-hover:-translate-y-4 transition-transform duration-500">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight leading-snug">{srv.title}</h3>
                <p className="text-sm text-[#777] leading-relaxed mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute w-full">{srv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: ARSENAL */}
      <section className="py-24 md:py-40 border-b border-white/5 reveal">
        <div className="grid-editorial mb-16 items-end">
          <SectionHeader kicker="Arsenal" title="The Tech Stack" />
          <div className="col-span-12 md:col-span-8 flex justify-start md:justify-end">
             <InstructionTag text="ENTERPRISE INTEGRATIONS" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 tech-grid">
          {TECH_STACK.map((tech, idx) => (
             <div key={idx} className="tech-item bg-[var(--bg-dark)] p-10 md:p-16 border border-transparent transition-all duration-500 flex items-center justify-center relative interactive">
               <h4 className="font-display text-xl md:text-3xl font-black uppercase tracking-tighter text-[#444] transition-colors duration-500 text-center">{tech}</h4>
             </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FAQ / AIO OPTIMIZED */}
      <section className="py-24 md:py-40 border-b border-white/5 reveal" itemScope itemType="https://schema.org/FAQPage">
        <div className="grid-editorial mb-16 items-start">
           <SectionHeader kicker="Operations" title="Intelligence FAQ" />
           <div className="col-span-12 md:col-span-8 flex flex-col gap-16">
              {MEGA_FAQS.map((category, catIdx) => (
                <div key={catIdx} className="flex flex-col gap-6">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#555] font-bold">{category.category}</h3>
                  <div className="border-t border-white/10">
                    {category.items.map((faq, idx) => {
                      const absoluteIdx = catIdx * 10 + idx;
                      return (
                        <div key={idx} className="border-b border-white/10 overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                          <button onClick={() => setActiveFaq(activeFaq === absoluteIdx ? null : absoluteIdx)} className="w-full py-8 flex justify-between items-center text-left hover:text-white text-[#ccc] transition-colors interactive">
                            <h4 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight pr-8" itemProp="name">{faq.q}</h4>
                            <div className="flex-shrink-0 text-[#555]">{activeFaq === absoluteIdx ? <Minus size={20} /> : <Plus size={20} />}</div>
                          </button>
                          <div className="transition-all duration-500 ease-in-out" style={{ maxHeight: activeFaq === absoluteIdx ? '300px' : '0px', opacity: activeFaq === absoluteIdx ? 1 : 0 }} itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                            <p className="pb-8 text-[#888] font-light leading-relaxed max-w-3xl text-lg" itemProp="text">{faq.a}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 7: GLOBAL MAP */}
      <section className="py-24 md:py-40 border-b border-white/5 reveal relative">
        <div className="grid-editorial mb-16 items-end">
          <SectionHeader kicker="GEO-Data" title="Global Hubs" />
          <div className="col-span-12 md:col-span-8 flex flex-wrap gap-4 mt-6 md:mt-0 md:justify-end">
            {LOCATIONS.map(loc => (
              <button key={loc.id} onClick={() => setActiveLocation(loc)} className={`px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 border interactive ${activeLocation?.id === loc.id ? 'bg-white text-black border-white' : 'border-white/20 text-[#888] hover:border-white/50 hover:text-white'}`}>
                {loc.name}
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
          <GlobalMap onLocationSelect={setActiveLocation} activeLocation={activeLocation} />
          
          <aside className={`absolute top-6 right-6 md:top-10 md:right-10 w-[85%] max-w-sm glass-panel p-8 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 ${activeLocation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
            {activeLocation && (
              <>
                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                  <Globe size={28} className="text-[#555]" />
                  <button onClick={() => setActiveLocation(null)} className="p-2 hover:text-white text-[#555] transition-colors interactive"><X size={20} /></button>
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#aaa] font-bold">{activeLocation.country}</p>
                  <h3 className="font-display text-4xl font-black uppercase mt-2 text-outline">{activeLocation.name}</h3>
                  <p className="text-sm text-[#888] leading-relaxed mt-6 font-light">{activeLocation.desc}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                   <span className="text-[10px] uppercase tracking-[0.3em] text-[#666]">Active Engineers</span>
                   <span className="font-display text-xl font-bold">{activeLocation.team}</span>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>

      {/* SECTION 8: CTA */}
      <section className="py-24 md:py-40 reveal">
        <div className="flex flex-col items-center justify-center text-center gap-12 py-32 glass-panel group hover:bg-white transition-colors duration-1000 relative overflow-hidden interactive" onClick={() => navigateTo('contact')}>
          <div className="absolute inset-0 bg-white scale-0 group-hover:scale-150 rounded-full transition-transform duration-[1.2s] ease-in-out z-0 origin-center pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <InstructionTag text="INITIATE PROTOCOL" />
            <h2 className="font-display text-6xl md:text-[9rem] font-black uppercase tracking-tighter leading-none group-hover:text-black transition-colors duration-1000 mt-10">
              Let's <br /> <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.3)] group-hover:text-black group-hover:[-webkit-text-stroke:0px] transition-all duration-1000">Talk.</span>
            </h2>
            <div className="w-20 h-20 rounded-full border border-white/20 group-hover:border-black group-hover:bg-black text-white flex items-center justify-center transition-all duration-1000 mt-16">
               <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

const CaseStudiesPage = ({ navigateTo, mousePos }) => {
  useScrollReveal();
  const [hoveredWork, setHoveredWork] = useState(null);

  return (
    <div className="flex flex-col pt-24 md:pt-32 page-enter pb-24 w-full relative">
      {/* Floating Image Cursor Reveal */}
      <img src={hoveredWork} className={`hover-reveal-img ${hoveredWork ? 'visible' : ''}`} style={{ left: mousePos.x, top: mousePos.y }} alt="" />

      <section className="grid-editorial mb-20">
        <SectionHeader kicker="Case Studies" />
        <div className="col-span-12 md:col-span-8 reveal delay-100 flex flex-col gap-6">
          <InstructionTag text="PROVEN ARCHITECTURES" />
          <h1 className="font-display text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-none">
            Digital <br/> <span className="text-outline">Triumphs.</span>
          </h1>
          <p className="text-2xl text-[#888] font-light leading-relaxed max-w-2xl mt-8">
             Deep dives into how we re-engineered global MarTech stacks and ITES pipelines to deliver absolute clarity and massive scale.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 reveal delay-200">
        <div className="flex flex-col">
          {CASE_STUDIES.map((item, index) => (
            <article 
              key={item.id} 
              onMouseEnter={() => setHoveredWork(item.img)}
              onMouseLeave={() => setHoveredWork(null)}
              className={`group flex flex-col lg:flex-row justify-between lg:items-center py-16 md:py-24 border-b border-white/5 interactive transition-all duration-500 hover:bg-white/[0.02] hover:px-8 reveal delay-${(index % 3) * 100}`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-20 w-full lg:w-auto">
                <span className="text-lg font-mono text-[#444] group-hover:text-white transition-colors">[{item.id}]</span>
                <div>
                  <h3 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#ddd] group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-[#777] mt-4 max-w-md font-light text-sm">{item.desc}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between lg:justify-end gap-12 mt-12 lg:mt-0 w-full lg:w-auto border-t lg:border-t-0 border-white/10 pt-8 lg:pt-0">
                <div className="flex flex-col gap-1 text-left lg:text-right">
                   <span className="text-[10px] uppercase tracking-widest text-[#555]">{item.type}</span>
                   <span className="font-display text-3xl font-bold text-white">{item.metric}</span>
                </div>
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all bg-[var(--bg-dark)] shrink-0">
                  <ArrowUpRight size={24} className="transform group-hover:scale-110 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

const JournalPage = ({ navigateTo, mousePos }) => {
  useScrollReveal();
  const [activeTab, setActiveTab] = useState('All');
  const [hoveredImg, setHoveredImg] = useState(null);

  const TABS = ['All', 'Blog', 'White Paper', 'Research', 'News'];
  const filteredArticles = activeTab === 'All' ? ALL_ARTICLES : ALL_ARTICLES.filter(a => a.type === activeTab);

  return (
    <div className="flex flex-col pt-24 md:pt-32 page-enter pb-24 w-full relative">
      {/* Floating Image Cursor Reveal */}
      <img src={hoveredImg} className={`hover-reveal-img ${hoveredImg ? 'visible' : ''}`} style={{ left: mousePos.x, top: mousePos.y }} alt="" />

      <section className="grid-editorial mb-16">
        <SectionHeader kicker="Insights" />
        <div className="col-span-12 md:col-span-8 reveal delay-100 flex flex-col gap-6">
          <InstructionTag text="AIO & SEO OPTIMIZED REPOSITORY" icon={BookOpen} />
          <h1 className="font-display text-5xl md:text-[7rem] font-black uppercase tracking-tighter leading-none">
            The <br/> <span className="text-outline">Journal.</span>
          </h1>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex flex-wrap gap-4 mb-16 reveal delay-200 border-b border-white/10 pb-8">
        {TABS.map(tab => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full transition-all duration-300 interactive ${activeTab === tab ? 'bg-white text-black' : 'border border-white/20 text-[#888] hover:border-white/50 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </section>

      <section className="flex flex-col reveal delay-300">
        {filteredArticles.map((insight, idx) => (
           <article 
             key={insight.id} 
             onMouseEnter={() => setHoveredImg(insight.img)}
             onMouseLeave={() => setHoveredImg(null)}
             className="group grid-editorial items-center py-10 md:py-14 border-b border-white/10 interactive hover:bg-white/[0.02] hover:px-6 transition-all duration-500"
           >
             <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
               <span className="text-[10px] font-mono text-[#555] uppercase">{insight.date}</span>
               <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#888] group-hover:text-white transition-colors">{insight.type}</span>
             </div>
             <div className="col-span-12 md:col-span-7">
               <h3 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight group-hover:text-white text-[#ccc] transition-colors">{insight.title}</h3>
             </div>
             <div className="col-span-12 md:col-span-2 flex justify-start md:justify-end mt-6 md:mt-0 items-center gap-4 text-[10px] uppercase tracking-widest text-[#777] group-hover:text-white transition-colors">
                Read <ArrowUpRight size={20} className="transform group-hover:scale-125 transition-transform" />
             </div>
           </article>
        ))}
      </section>
    </div>
  );
};

const AboutPage = () => { /* Remains similar, minimal edits needed */
  useScrollReveal();
  return (
    <div className="flex flex-col gap-24 pt-24 md:pt-32 page-enter pb-24 w-full">
      <section className="grid-editorial gap-y-10">
        <SectionHeader kicker="Identity" />
        <div className="col-span-12 md:col-span-8 reveal delay-100">
          <InstructionTag text="ESTABLISHED 2019" />
          <h1 className="font-display text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-none mb-12 mt-6">
            The <br/> <span className="text-outline">Agency.</span>
          </h1>
          <div className="mb-16 w-full h-[50vh] border border-white/10 glass-panel p-2 overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover img-monochrome" alt="Office space" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
               <InstructionTag text="LONDON HQ" />
            </div>
          </div>
          <p className="text-3xl md:text-5xl text-[#fff] font-light leading-tight">
            Liaisonit Studios is a collective of marketing and operations architects. We strip away the noise to build focused, high-performance MarTech and ITES ecosystems. 
          </p>
        </div>
      </section>
    </div>
  );
};

const ServicesPage = () => {
  useScrollReveal();
  return (
    <div className="flex flex-col pt-24 md:pt-32 page-enter pb-24 w-full">
      <section className="grid-editorial mb-20">
        <SectionHeader kicker="Expertise" />
        <div className="col-span-12 md:col-span-8 reveal delay-100">
          <InstructionTag text="WHAT WE DO" />
          <h1 className="font-display text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-none mt-6">
            Our <br/> <span className="text-outline">Capabilities.</span>
          </h1>
        </div>
      </section>
      <div className="flex flex-col border-t border-white/10 reveal delay-200">
        {SERVICES.map((srv, idx) => (
          <div key={srv.id} className="group grid-editorial py-16 md:py-24 border-b border-white/10 interactive hover:bg-white/[0.02] transition-colors items-center reveal relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none hidden lg:block mask-image-gradient">
              <img src={srv.img} className="w-full h-full object-cover img-monochrome" alt="" />
            </div>
            <div className="col-span-12 md:col-span-2 flex items-center mb-6 md:mb-0 relative z-10">
              <span className="font-display text-5xl md:text-7xl text-[#333] group-hover:text-white transition-colors">{srv.id}</span>
            </div>
            <div className="col-span-12 md:col-span-5 mb-4 md:mb-0 relative z-10">
              <h3 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight transition-all duration-500 text-outline group-hover:text-white group-hover:[-webkit-text-stroke:0px]">
                {srv.title}
              </h3>
            </div>
            <div className="col-span-12 md:col-span-4 relative z-10">
              <p className="text-lg text-[#888] leading-relaxed">{srv.desc}</p>
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
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] pointer-events-none z-0 overflow-hidden flex flex-wrap">
        {Array(24).fill(0).map((_, i) => (<div key={i} className="w-32 h-32 border border-white/50 relative"><div className="absolute top-0 left-0 w-2 h-2 border-r border-b border-white/50"></div></div>))}
      </div>
      <section className="grid-editorial mb-20 relative z-10">
        <SectionHeader kicker="Initiate" />
        <div className="col-span-12 md:col-span-8 reveal delay-100">
           <InstructionTag text="SECURE CONNECTION ESTABLISHED" />
           <h1 className="font-display text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-none mt-6">
             Start A <br/><span className="text-outline">Project.</span>
           </h1>
        </div>
      </section>
      <section className="grid-editorial pt-12 border-t border-white/10 reveal delay-200 relative z-10">
        <div className="col-span-12 md:col-span-7 pr-0 md:pr-12 mb-20 md:mb-0">
          <form className="flex flex-col gap-12" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-4 reveal">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#888] font-medium flex items-center gap-2">[01] Your Name</label>
              <input type="text" placeholder="John Doe" className="w-full text-2xl md:text-3xl focus:bg-white/[0.02] px-4 interactive" />
            </div>
            <div className="flex flex-col gap-4 reveal delay-100">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#888] font-medium flex items-center gap-2">[02] Email Address</label>
              <input type="email" placeholder="john@company.com" className="w-full text-2xl md:text-3xl focus:bg-white/[0.02] px-4 interactive" />
            </div>
            <div className="flex flex-col gap-4 reveal delay-200">
              <label className="text-[10px] uppercase tracking-[0.4em] text-[#888] font-medium flex items-center gap-2">[03] Project Details</label>
              <textarea placeholder="Tell us about your vision..." rows={3} className="w-full text-2xl md:text-3xl resize-none focus:bg-white/[0.02] px-4 interactive" />
            </div>
            <button className="mt-10 pb-6 border-b-2 border-white hover:border-[#777] text-white hover:text-[#777] transition-colors flex items-center justify-between font-display text-2xl font-bold uppercase tracking-widest reveal delay-300 group interactive">
              Submit Inquiry <ArrowRight className="group-hover:translate-x-4 transition-transform" size={28} />
            </button>
          </form>
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-9 flex flex-col gap-24 reveal delay-300">
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#777] flex items-center gap-4"><span className="w-8 h-[1px] bg-[#777]"></span> Direct Email</h4>
            <a href="mailto:hello@liaisonit.com" className="font-display text-3xl md:text-4xl font-black text-outline hover:text-white transition-colors interactive">
              hello@<br/>liaisonit.com
            </a>
          </div>
          <div className="flex flex-col gap-8">
             <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#777] flex items-center gap-4"><span className="w-8 h-[1px] bg-[#777]"></span> Global Hubs</h4>
             <div className="flex flex-col gap-6">
               {LOCATIONS.map(loc => (
                 <div key={loc.id} className="flex items-start justify-between border-b border-white/10 pb-6 group interactive">
                   <div>
                     <p className="text-xl font-bold uppercase tracking-widest text-white group-hover:text-[#aaa] transition-colors">{loc.name}</p>
                     <p className="text-[10px] text-[#777] uppercase tracking-wider mt-2">{loc.country}</p>
                   </div>
                   <MapPin size={20} className="text-[#555] group-hover:text-white transition-colors" />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- CUSTOM CURSOR COMPONENT ---
const CustomCursor = ({ mousePos }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.closest('.interactive') || e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'a') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <div 
      className={`custom-cursor hidden md:block ${isHovering ? 'hovering' : ''}`} 
      style={{ left: mousePos.x, top: mousePos.y }}
    />
  );
};

// --- MAIN APP (ROUTER) ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeLocation, setActiveLocation] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const mousePos = useMousePosition();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'services', label: 'Services' },
    { id: 'journal', label: 'Insights' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative bg-[#030303] text-white selection:bg-white selection:text-black flex flex-col font-poppins font-light">
      <StyleInjector />
      <CustomCursor mousePos={mousePos} />

      {/* Structural Architectural Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 max-w-[1800px] mx-auto w-full mix-blend-overlay opacity-20">
        <div className="w-[1px] h-full bg-white"></div>
        <div className="w-[1px] h-full bg-white hidden md:block"></div>
        <div className="w-[1px] h-full bg-white hidden lg:block"></div>
        <div className="w-[1px] h-full bg-white"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 md:px-12 flex justify-between items-center bg-[#030303]/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => navigateTo('home')} className="font-display font-black text-xl md:text-2xl tracking-tighter uppercase flex items-center gap-4 hover:opacity-70 transition-opacity interactive">
          <div className="w-6 h-6 bg-white" /> LIAISONIT
        </button>
        
        <div className="hidden md:flex gap-12 items-center">
          {navLinks.map(link => (
            <button 
              key={link.id} onClick={() => navigateTo(link.id)}
              className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative group interactive ${currentPage === link.id ? 'text-white' : 'text-[#777] hover:text-white'}`}
            >
              {link.label}
              <span className={`absolute -bottom-4 left-0 h-[2px] bg-white transition-all duration-500 ease-out ${currentPage === link.id ? 'w-full' : 'w-0 group-hover:w-1/2'}`}></span>
            </button>
          ))}
        </div>

        <button className="md:hidden text-white p-2 interactive" onClick={() => setNavOpen(!navOpen)}>
          {navOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-40 bg-[#030303] flex flex-col items-center justify-center gap-12 md:hidden">
          {navLinks.map((link, idx) => (
            <button key={link.id} onClick={() => navigateTo(link.id)} className={`font-display text-5xl font-black uppercase tracking-tighter page-enter interactive ${currentPage === link.id ? 'text-white' : 'text-outline'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Router */}
      <main className="relative z-10 px-6 md:px-12 pt-24 max-w-[1800px] w-full mx-auto flex-grow flex flex-col">
        {currentPage === 'home' && <HomePage setActiveLocation={setActiveLocation} activeLocation={activeLocation} navigateTo={navigateTo} />}
        {currentPage === 'case-studies' && <CaseStudiesPage navigateTo={navigateTo} mousePos={mousePos} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'journal' && <JournalPage navigateTo={navigateTo} mousePos={mousePos} />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 pb-12 mt-auto max-w-[1800px] w-full mx-auto">
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-[#777] uppercase tracking-[0.3em] font-bold">
          <p>© 2019–2026 LIAISONIT STUDIOS.</p>
        </div>
      </footer>
    </div>
  );
}
