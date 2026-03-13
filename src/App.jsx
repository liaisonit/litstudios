import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { 
  Menu, X, ArrowRight, MapPin, Phone, Mail, ArrowUpRight, Instagram, Linkedin, Plus, Minus, Play
} from 'lucide-react';

// --- CONTEXT FOR CUSTOM CURSOR ---
const CursorContext = createContext();

// --- CUSTOM CSS (Injected) ---
const ultraModernStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap');

  :root {
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1);
  }
  
  html, body {
    cursor: none; /* Hide default cursor for desktop */
    scroll-behavior: smooth;
    font-family: 'Urbanist', sans-serif;
  }

  /* Clip Path Unveil Animation */
  .clip-hidden {
    clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
  }
  .clip-visible {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
  .clip-transition {
    transition: clip-path 1.5s var(--ease-in-out-quint);
  }

  /* Hide scrollbar for clean look */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #fafafa; }
  ::-webkit-scrollbar-thumb { background: #e4e4e7; }
  ::-webkit-scrollbar-thumb:hover { background: #d4d4d8; }

  @media (max-width: 768px) {
    html, body { cursor: auto; }
    #custom-cursor { display: none !important; }
  }

  /* Hollow Text Effect */
  .text-hollow {
    color: transparent;
    -webkit-text-stroke: 1px #09090b; /* zinc-950 */
  }
  .text-hollow-white {
    color: transparent;
    -webkit-text-stroke: 1px #ffffff;
  }
  @media (min-width: 768px) {
    .text-hollow { -webkit-text-stroke: 2px #09090b; }
    .text-hollow-white { -webkit-text-stroke: 2px #ffffff; }
  }

  /* Marquee Animation */
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  .animate-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 25s linear infinite;
  }
`;

// --- INTERACTIVE COMPONENTS ---

// 1. Custom Smooth Cursor
const CustomCursor = () => {
  const { isHovering } = useContext(CursorContext);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      id="custom-cursor"
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] mix-blend-difference flex items-center justify-center transition-transform duration-300 ease-out"
      style={{ transform: `translate(${position.x - 16}px, ${position.y - 16}px)` }}
    >
      <div 
        className={`bg-white rounded-full transition-all duration-300 ${
          isHovering ? 'w-16 h-16 opacity-100' : (isClicking ? 'w-2 h-2 opacity-50' : 'w-4 h-4 opacity-100')
        }`}
      />
    </div>
  );
};

// 2. Interactive Link (Triggers Cursor Expansion)
const Interactive = ({ children, className = '', onClick }) => {
  const { setIsHovering } = useContext(CursorContext);
  return (
    <div 
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// 3. Viewport Detection Hook
const useOnScreen = (options) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, { threshold: 0.1, ...options });

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [options]);

  return [ref, isVisible];
};

// 4. Premium Clip Unveil Image
const UnveilImage = ({ src, alt, className = '' }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover clip-transition ${isVisible ? 'clip-visible scale-100' : 'clip-hidden scale-110'} transition-transform duration-[2s] ease-out`}
      />
    </div>
  );
};

// 5. Staggered Text Reveal
const RevealText = ({ text, className = '', delay = 0 }) => {
  const [ref, isVisible] = useOnScreen();
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div 
        className={`transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[100%] opacity-0'}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {text}
      </div>
    </div>
  );
};

// 6. Split Hero Text (Solid on Left, Hollow on Right)
const SplitHeroText = ({ line1, line2 }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <div ref={ref} className="relative w-full pointer-events-none mt-12 md:mt-24 z-10">
      {/* Hollow Layer (Visible on right side over image) */}
      <div className="text-[18vw] md:text-[17vw] leading-[0.85] tracking-tighter font-thin uppercase text-hollow flex flex-col pl-6 md:pl-12">
        <div className="overflow-hidden pb-2 md:pb-4"><div className={`transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0' : 'translate-y-[100%]'}`}>{line1}</div></div>
        <div className="overflow-hidden pb-2 md:pb-4"><div className={`transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${isVisible ? 'translate-y-0' : 'translate-y-[100%]'}`}>{line2}</div></div>
      </div>
      {/* Solid Layer (Clipped strictly to the left 50% white background) */}
      <div className="absolute top-0 left-0 w-full h-full text-[18vw] md:text-[17vw] leading-[0.85] tracking-tighter font-thin uppercase text-zinc-950 flex flex-col pl-6 md:pl-12 hidden md:flex" style={{ clipPath: 'inset(0 50vw 0 0)' }}>
        <div className="overflow-hidden pb-2 md:pb-4"><div className={`transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0' : 'translate-y-[100%]'}`}>{line1}</div></div>
        <div className="overflow-hidden pb-2 md:pb-4"><div className={`transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${isVisible ? 'translate-y-0' : 'translate-y-[100%]'}`}>{line2}</div></div>
      </div>
      {/* Mobile Solid Layer (No clipping needed, background is fully white) */}
      <div className="absolute top-0 left-0 w-full h-full text-[18vw] md:text-[17vw] leading-[0.85] tracking-tighter font-thin uppercase text-zinc-950 flex flex-col pl-6 md:pl-12 md:hidden">
        <div className="overflow-hidden pb-2 md:pb-4"><div className={`transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0' : 'translate-y-[100%]'}`}>{line1}</div></div>
        <div className="overflow-hidden pb-2 md:pb-4"><div className={`transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${isVisible ? 'translate-y-0' : 'translate-y-[100%]'}`}>{line2}</div></div>
      </div>
    </div>
  );
};

// 7. Accordion Component
const Accordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-200">
      <Interactive>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="w-full py-8 flex justify-between items-center text-left focus:outline-none"
        >
          <span className="text-xl md:text-3xl font-light text-zinc-950">{question}</span>
          <span className="ml-4 flex-shrink-0 text-zinc-400">
            {isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </span>
        </button>
      </Interactive>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-lg md:text-xl font-light text-zinc-500 max-w-3xl leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

// --- DUMMY CMS DATA ---
const projectsData = [
  { id: 1, title: 'Hobsonville Col.', location: 'Auckland', status: 'Completed', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80' },
  { id: 2, title: 'Epsom Arch.', location: 'Auckland', status: 'Completed', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80' },
  { id: 3, title: 'Peninsula Terraces', location: 'Te Atatu', status: 'Selling Now', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80' },
  { id: 4, title: 'Remuera Modern', location: 'Remuera', status: 'In Progress', image: 'https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&w=1600&q=80' }
];

const servicesData = [
  { 
    title: 'Development', 
    desc: 'From identifying great locations to thoughtfully planned residential communities. Full lifecycle management.', 
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
    features: ['Site Acquisition', 'Feasibility Studies', 'Resource Consents', 'Community Planning']
  },
  { 
    title: 'Construction', 
    desc: 'Reliable, high-quality construction with absolute attention to detail, timelines, and cost control.', 
    image: 'https://images.unsplash.com/photo-1541888086925-0c13bb4229f7?auto=format&fit=crop&w=1000&q=80',
    features: ['Fixed-Price Contracts', 'Rigorous Quality Assurance', 'Timely Execution', 'Health & Safety Compliance']
  },
  { 
    title: 'Custom Homes', 
    desc: 'Standalone homes tailored to modern lifestyles, combining smart architectural design with long-term value.', 
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    features: ['Bespoke Architectural Design', 'Premium Material Sourcing', 'Interior Design Consulting', 'Turnkey Solutions']
  },
  { 
    title: 'Project Management', 
    desc: 'From planning to subdivision, compliance, and completion, we handle every stage of the journey.', 
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
    features: ['Timeline Management', 'Budget Control', 'Contractor Coordination', 'Final Certification']
  }
];

const valuesData = [
  { num: '01', title: 'Architectural Integrity', desc: 'We never compromise on design. Every home is built with a focus on spatial flow, natural light, and premium materials.' },
  { num: '02', title: 'Transparent Process', desc: 'From day one, our clients have full visibility into costs, timelines, and construction progress. No surprises.' },
  { num: '03', title: 'Enduring Quality', desc: 'We build homes that last generations. Our rigorous quality assurance guarantees excellence at every phase.' }
];

const processData = [
  { step: '01', title: 'Discovery', desc: 'We begin with a deep dive into your vision, site potential, and feasibility. We establish clear parameters for success.' },
  { step: '02', title: 'Architecture', desc: 'Our design team translates your brief into conceptual frameworks, managing all local council compliance and resource consents.' },
  { step: '03', title: 'Construction', desc: 'Execution with precision. Our experienced project managers and builders bring the architectural plans to life.' },
  { step: '04', title: 'Handover', desc: 'Rigorous quality assurance, final certifications, and the moment we hand over the keys to your completed property.' }
];

const faqData = [
  { q: "Do you handle both design and construction?", a: "Yes. Pillar Properties operates as an end-to-end partner. We manage the entire lifecycle from initial architectural concepts and council consents through to the final build and interior finishing." },
  { q: "What areas of Auckland do you service?", a: "We primarily operate across the greater Auckland region, with a strong focus on the central suburbs, North Shore, and emerging developments in the West and South." },
  { q: "Do you work with investors for multi-unit developments?", a: "Absolutely. A large portion of our portfolio consists of high-yield townhouse and terraced home developments tailored for property investors and syndicates." },
  { q: "How do you ensure projects stay on budget?", a: "We provide fixed-price contracts and highly detailed initial scoping. Our transparent procurement process and tight project management eliminate unexpected variations." }
];

const teamData = [
  { name: 'James Carter', role: 'Managing Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Elena Rostova', role: 'Head of Architecture', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Marcus Chen', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80' }
];

const insightsData = [
  { category: 'Architecture', date: 'March 2026', title: 'The Rise of Minimalist Concrete in Auckland Homes' },
  { category: 'Market Update', date: 'February 2026', title: 'Navigating Resource Consents for Multi-Unit Builds' },
  { category: 'Sustainability', date: 'January 2026', title: 'Integrating Passive Heating into Luxury Designs' }
];

const futureProjectsData = [
  { title: 'The Parnell Ascend', location: 'Parnell, Auckland', expected: 'Q3 2026' },
  { title: 'Orakei Basin Villas', location: 'Orakei, Auckland', expected: 'Q4 2026' },
  { title: 'Grey Lynn Urban', location: 'Grey Lynn, Auckland', expected: 'Q1 2027' }
];

const signatureDetails = [
  { title: "Bespoke Joinery", desc: "Custom cabinetry and shelving designed to blend seamlessly into the architectural form, eliminating visual clutter.", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80" },
  { title: "Polished Concrete", desc: "Thermal mass heating meets industrial elegance with our signature poured and ground floors.", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80" },
  { title: "Spatial Harmony", desc: "Double-height voids and floor-to-ceiling glazing engineered to capture and maximize natural Auckland light.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" }
];

// --- AI HELPER FUNCTION ---
const generateAIBrief = async (userPrompt) => {
  const apiKey = "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const systemInstruction = `You are an expert architectural consultant for Pillar Properties, a premium residential developer in Auckland, New Zealand. 
The user will describe their dream home or investment project. 
Respond with a highly professional, minimalist, and structured architectural brief containing exactly these three sections:
CONCEPT SUMMARY: A 2-sentence sophisticated summary of the vision.
DESIGN DIRECTION: Recommended materials, architectural style, and spatial flow.
PROJECTED TIMELINE: A realistic high-level timeline for Auckland (e.g., Feasibility, Consent, Build).
Keep the tone ultra-premium, confident, and concise. Use simple plain text with capital letters for section headers. Do not use asterisks or markdown styling.`;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  const delays = [1000, 2000, 4000, 8000, 16000];
  let lastError = null;

  for (let i = 0; i <= delays.length; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No brief generated. Please try again.";
    } catch (error) {
      lastError = error;
      if (i < delays.length) {
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
  }
  return "We are currently experiencing high demand. Please contact us directly to discuss your vision.";
};

// --- PAGES ---

const HomePage = ({ navigate }) => {
  const [hoveredProject, setHoveredProject] = useState(projectsData[0].image);
  const [activeDetail, setActiveDetail] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="animate-in fade-in duration-1000 bg-[#fafafa]">
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex flex-col w-full overflow-hidden">
        {/* 50/50 Split Background */}
        <div className="absolute inset-0 flex z-0">
          <div className="w-[100%] md:w-[50%] h-full bg-white"></div>
          <div className="hidden md:block w-[50%] h-full relative overflow-hidden bg-zinc-100">
            <UnveilImage 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80" 
              alt="Hero Architecture" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Giant Split Text Component */}
        <div className="flex-1 flex flex-col justify-center">
          <SplitHeroText line1="PILLAR" line2="PROPERTIES" />
        </div>

        {/* Subtext and Explore Button */}
        <div className="w-full px-6 md:px-12 z-20 flex flex-col md:flex-row justify-between items-start md:items-end pb-12">
          <RevealText delay={300} text="01 \'97 Shaping the future of Auckland's residential landscape." className="text-lg md:text-xl font-light text-zinc-600 max-w-sm mb-8 md:mb-0" />
          <Interactive onClick={() => navigate('projects')} className="group flex items-center gap-4 cursor-pointer text-zinc-950 md:text-white md:mix-blend-difference">
            <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:bg-white group-hover:text-zinc-950 transition-colors duration-500">
              <ArrowRight className="w-5 h-5 transition-colors duration-500" />
            </div>
            <span className="uppercase tracking-[0.2em] text-sm font-semibold">Explore Portfolio</span>
          </Interactive>
        </div>
      </section>

      {/* Statement Section */}
      <section className="py-32 md:py-40 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-3xl md:text-5xl lg:text-7xl font-light leading-tight tracking-tight text-zinc-950">
            <RevealText text="We don't just build houses." />
            <RevealText text="We design, develop, and manage" delay={100} className="text-zinc-400" />
            <RevealText text="high-quality homes tailored" delay={200} />
            <RevealText text="to modern lifestyles." delay={300} />
          </div>
          
          {/* Trust/Conversion Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 md:mt-32 border-t border-zinc-200 pt-12">
            {[
              { num: '600+', label: 'Homes Delivered' },
              { num: '07', label: 'Years Experience' },
              { num: '100%', label: 'Auckland Owned' },
              { num: '15+', label: 'Active Sites' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <RevealText text={stat.num} delay={i * 100} className="text-4xl md:text-5xl font-light text-zinc-950 mb-2" />
                <RevealText text={stat.label} delay={i * 100 + 50} className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-zinc-400 font-semibold" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Marquee Section */}
      <section className="py-8 bg-zinc-950 text-white overflow-hidden flex border-y border-zinc-800">
        <div className="animate-marquee whitespace-nowrap flex text-[10px] md:text-sm tracking-[0.3em] uppercase font-semibold text-zinc-400">
          <span className="mx-8">Residential Developers</span> <span className="mx-8 opacity-30">\'95</span>
          <span className="mx-8">Architectural Builders</span> <span className="mx-8 opacity-30">\'95</span>
          <span className="mx-8">Project Managers</span> <span className="mx-8 opacity-30">\'95</span>
          <span className="mx-8">Investment Partners</span> <span className="mx-8 opacity-30">\'95</span>
          <span className="mx-8">Residential Developers</span> <span className="mx-8 opacity-30">\'95</span>
          <span className="mx-8">Architectural Builders</span> <span className="mx-8 opacity-30">\'95</span>
          <span className="mx-8">Project Managers</span> <span className="mx-8 opacity-30">\'95</span>
          <span className="mx-8">Investment Partners</span> <span className="mx-8 opacity-30">\'95</span>
        </div>
      </section>

      {/* Process Section (Conversion Factor: Transparency) */}
      <section className="py-32 md:py-40 px-6 md:px-12 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <RevealText text="METHODOLOGY" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-20" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {processData.map((process, idx) => (
              <div key={idx} className="border-t border-zinc-200 pt-8 group">
                <RevealText text={process.step} delay={idx * 100} className="text-5xl font-thin text-zinc-300 mb-8 group-hover:text-zinc-950 transition-colors duration-500" />
                <RevealText text={process.title} delay={idx * 100 + 50} className="text-2xl font-light text-zinc-950 mb-4" />
                <RevealText text={process.desc} delay={idx * 100 + 100} className="text-zinc-500 font-light leading-relaxed text-sm md:text-base" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Details (Interactive Hover Gallery) */}
      <section className="py-32 md:py-40 px-6 md:px-12 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <RevealText text="SIGNATURE FINISHES" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-12" />
            <div className="flex flex-col gap-8">
              {signatureDetails.map((detail, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => setActiveDetail(idx)}
                  className="cursor-pointer group border-b border-zinc-100 pb-8 last:border-0"
                >
                  <h3 className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-tight transition-colors duration-500 ${activeDetail === idx ? 'text-zinc-950' : 'text-zinc-300 group-hover:text-zinc-400'}`}>
                    {detail.title}
                  </h3>
                  <div className={`overflow-hidden transition-all duration-500 ease-out ${activeDetail === idx ? 'max-h-40 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-zinc-500 font-light max-w-sm leading-relaxed">{detail.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-[500px] md:h-[700px] overflow-hidden relative bg-zinc-100 rounded-sm">
            {signatureDetails.map((detail, idx) => (
              <img 
                key={idx}
                src={detail.image} 
                alt={detail.title} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeDetail === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Project Roster */}
      <section className="py-32 px-6 md:px-12 bg-zinc-950 text-white relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 flex justify-between items-end">
            <RevealText text="SELECTED WORKS" className="text-xs tracking-[0.3em] uppercase text-zinc-500 font-semibold" />
            <Interactive onClick={() => navigate('projects')} className="hidden md:flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white transition-colors">
              <span className="text-xs tracking-[0.2em] uppercase font-semibold">View Full Portfolio</span>
            </Interactive>
          </div>

          <div className="border-t border-zinc-800">
            {projectsData.map((project, idx) => (
              <Interactive key={project.id} onClick={() => navigate('projects')}>
                <div 
                  className="group flex flex-col md:flex-row justify-between items-start md:items-center py-10 md:py-16 border-b border-zinc-800 cursor-pointer relative"
                  onMouseEnter={() => setHoveredProject(project.image)}
                >
                  {/* Hover Image Reveal for Mobile (Smoothly Animated) */}
                  <div className="md:hidden w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 group-hover:mb-6">
                    <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
                  </div>

                  <RevealText text={`0${idx + 1}`} className="text-sm tracking-[0.2em] text-zinc-600 mb-4 md:mb-0 md:w-24" />
                  
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between w-full">
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight transform group-hover:translate-x-4 transition-all duration-500 ease-out text-zinc-300 group-hover:text-white inline-block">{project.title}</h3>
                    <div className="flex items-center gap-8 mt-4 md:mt-0 text-zinc-500 group-hover:text-zinc-300 transition-colors duration-500">
                      <span className="text-[10px] md:text-xs tracking-widest uppercase font-semibold">{project.location}</span>
                      <ArrowUpRight className="w-6 h-6 opacity-0 -translate-y-4 translate-x-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500 ease-out hidden md:block" />
                    </div>
                  </div>
                </div>
              </Interactive>
            ))}
          </div>
        </div>

        {/* Floating Desktop Image Follower (Bulletproof Crossfade) */}
        <div className="hidden md:block absolute top-1/2 right-24 -translate-y-1/2 w-[35vw] max-w-[500px] h-[60vh] max-h-[700px] pointer-events-none overflow-hidden rounded-sm z-0">
          {projectsData.map((proj) => (
            <img 
              key={proj.id}
              src={proj.image} 
              alt={proj.title} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${hoveredProject === proj.image ? 'opacity-80' : 'opacity-0'}`}
            />
          ))}
        </div>
      </section>

      {/* Hollow Font Full-Width Parallax Break (Aesthetic Upgrade) */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-zinc-950">
        <div 
          className="absolute inset-0 opacity-40 mix-blend-luminosity"
          style={{ transform: `translateY(${(scrollY - 1500) * 0.15}px)` }} // Simple CSS parallax
        >
          <img src="https://images.unsplash.com/photo-1541888086925-0c13bb4229f7?auto=format&fit=crop&w=2000&q=80" alt="Construction detail" className="w-full h-[120%] object-cover" />
        </div>
        <div className="relative z-10 text-center px-4 w-full">
           <h2 className="text-[10vw] md:text-[8vw] font-thin tracking-tighter text-hollow-white uppercase leading-none">
             Enduring <br/> Quality
           </h2>
        </div>
      </section>

      {/* Services Minimal */}
      <section className="py-32 md:py-40 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <RevealText text="EXPERTISE" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-20" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
            {servicesData.map((service, idx) => (
              <Interactive key={idx} onClick={() => navigate('services')} className="group cursor-pointer flex flex-col h-full">
                <div className="w-full aspect-[4/5] md:h-[450px] overflow-hidden mb-8 bg-zinc-100">
                  <img src={service.image} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out" alt={service.title} />
                </div>
                <RevealText text={service.title} className="text-2xl font-light mb-4 text-zinc-950 border-b border-zinc-200 pb-4 flex justify-between items-center group-hover:border-zinc-950 transition-colors duration-500">
                   {service.title}
                   <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </RevealText>
                <RevealText text={service.desc} delay={100} className="text-zinc-500 font-light leading-relaxed text-sm md:text-base" />
              </Interactive>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section (Social Proof) */}
      <section className="py-32 md:py-40 px-6 md:px-12 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-5xl mx-auto text-center">
          <RevealText text="CLIENT PERSPECTIVE" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-16" />
          <RevealText text="\'93Pillar Properties delivered our architectural build flawlessly. Their transparency regarding costs and absolute refusal to compromise on finish quality set them apart in the Auckland market.\'94" className="text-2xl md:text-4xl lg:text-5xl font-light text-zinc-950 leading-snug tracking-tight mb-12" delay={100} />
          <div className="flex flex-col items-center">
             <RevealText text="Sarah & James T." className="text-sm tracking-widest uppercase font-semibold text-zinc-950 mb-1" delay={200} />
             <RevealText text="Epsom Custom Build" className="text-xs tracking-widest uppercase text-zinc-400" delay={300} />
          </div>
        </div>
      </section>

      {/* Cinematic Video Teaser */}
      <section className="py-12 md:py-24 px-6 md:px-12 bg-[#fafafa]">
        <div className="max-w-[1400px] mx-auto relative h-[60vh] md:h-[80vh] overflow-hidden group rounded-sm bg-zinc-950">
          <UnveilImage 
            src="https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&w=2000&q=80" 
            alt="Cinematic View" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3s] ease-out"
          />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Interactive>
              <button className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/30 backdrop-blur-md flex flex-col items-center justify-center group-hover:bg-white text-white group-hover:text-zinc-950 transition-all duration-500 hover:scale-110">
                <Play className="w-6 h-6 md:w-8 md:h-8 mb-1 ml-1" fill="currentColor" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold mt-1">Play Reel</span>
              </button>
            </Interactive>
          </div>
          <div className="absolute bottom-10 left-6 md:left-12 z-10 pointer-events-none">
            <RevealText text="THE PILLAR DIFFERENCE" className="text-xs tracking-[0.3em] uppercase text-white/70 font-semibold mb-3" />
            <RevealText text="Watch our brand film." className="text-2xl md:text-3xl font-light text-white" delay={100} />
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section (Conversion Factor: Objection Handling) */}
      <section className="py-32 md:py-40 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <RevealText text="FREQUENTLY ASKED" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-16" />
          <div className="border-t border-zinc-200">
            {faqData.map((faq, idx) => (
              <Accordion key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Insights / Journal Section */}
      <section className="py-32 md:py-40 px-6 md:px-12 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <RevealText text="JOURNAL & INSIGHTS" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold" />
            <Interactive className="hidden md:flex items-center gap-2 cursor-pointer text-zinc-950 hover:opacity-50 transition-opacity">
              <span className="text-xs tracking-[0.2em] uppercase font-semibold">Read All</span>
            </Interactive>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {insightsData.map((insight, idx) => (
              <Interactive key={idx} className="group cursor-pointer border-t border-zinc-200 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <RevealText text={insight.category} delay={idx * 100} className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400" />
                  <RevealText text={insight.date} delay={idx * 100 + 50} className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400" />
                </div>
                <RevealText text={insight.title} delay={idx * 100 + 100} className="text-2xl font-light text-zinc-950 group-hover:text-zinc-500 transition-colors duration-500 pr-8" />
              </Interactive>
            ))}
          </div>
        </div>
      </section>

      {/* Massive CTA Section */}
      <section className="py-40 md:py-64 px-6 md:px-12 bg-[#fafafa] flex flex-col items-center text-center border-t border-zinc-200">
        <RevealText text="START YOUR PROJECT" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-8" />
        <Interactive onClick={() => navigate('contact')}>
          <h2 className="text-6xl md:text-8xl lg:text-[10vw] font-light tracking-tighter cursor-pointer hover:opacity-50 transition-opacity duration-500 text-zinc-950 mb-12 leading-none">
            Let's Talk.
          </h2>
        </Interactive>
        <p className="text-zinc-500 text-lg md:text-xl font-light max-w-md">Schedule a complimentary consultation to discuss your land, vision, or investment strategy.</p>
      </section>
    </div>
  );
};

// ... other pages (Projects, Contact) remain unchanged but use the same styling ...

const AboutPage = () => (
  <div className="animate-in fade-in duration-1000 bg-white min-h-screen pt-40 px-6 md:px-12 pb-32">
    <div className="max-w-7xl mx-auto">
      <RevealText text="OUR STORY" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-8" />
      <RevealText text="Building foundations" className="text-5xl md:text-7xl font-light tracking-tight text-zinc-950" />
      <RevealText text="for the future." className="text-5xl md:text-7xl font-light tracking-tight text-zinc-950 mb-24" delay={100} />

      <div className="grid lg:grid-cols-2 gap-16 items-start mb-32">
        <div>
          <RevealText text="Pillar Properties Ltd is a premier residential development and construction company based in the heart of Auckland." className="text-2xl font-light text-zinc-950 leading-relaxed mb-8" />
          <RevealText text="While our brand name is new to the market, the foundation of our company is built on extensive industry experience. For over seven years, our dedicated team has been instrumental in delivering more than 600 homes across the region." className="text-lg text-zinc-500 font-light leading-relaxed mb-8" delay={100} />
          <RevealText text="We don't just build houses; we design, develop, build, and manage high-quality homes that cater to modern lifestyles. Our core philosophy ensures that every project we undertake is functional, aesthetically pleasing, and above all, affordable without compromising on the premium feel." className="text-lg text-zinc-500 font-light leading-relaxed" delay={200} />
        </div>
        <div className="w-full h-[400px] md:h-[600px]">
          <UnveilImage src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80" alt="Architectural Structure" className="w-full h-full object-cover" />
        </div>
      </div>

      <RevealText text="CORE PHILOSOPHY" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-16" />
      <div className="grid md:grid-cols-3 gap-12 border-t border-zinc-200 pt-16">
        {valuesData.map((val, idx) => (
          <div key={idx}>
            <RevealText text={val.num} className="text-4xl font-thin text-zinc-300 mb-6" />
            <RevealText text={val.title} className="text-2xl font-light text-zinc-950 mb-4" />
            <RevealText text={val.desc} className="text-zinc-500 font-light leading-relaxed" />
          </div>
        ))}
      </div>

      {/* Leadership Team Section */}
      <div className="mt-40">
        <RevealText text="LEADERSHIP" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-16" />
        <div className="grid md:grid-cols-3 gap-12 border-t border-zinc-200 pt-16">
          {teamData.map((member, idx) => (
            <Interactive key={idx} className="group">
              <div className="w-full aspect-[3/4] overflow-hidden mb-6 bg-zinc-100">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
              </div>
              <RevealText text={member.name} className="text-2xl font-light text-zinc-950 mb-1" />
              <RevealText text={member.role} className="text-xs tracking-widest uppercase text-zinc-400 font-semibold" delay={100} />
            </Interactive>
          ))}
        </div>
      </div>

      {/* Sustainability Section */}
      <div className="mt-40 bg-zinc-950 text-white p-12 md:p-24 flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2">
          <RevealText text="SUSTAINABILITY" className="text-xs tracking-[0.3em] uppercase text-zinc-500 font-semibold mb-8" />
          <RevealText text="Building for the next century." className="text-4xl md:text-6xl font-light tracking-tight mb-8 text-zinc-200" />
          <RevealText text="Our commitment extends beyond aesthetics. We integrate passive heating, solar readiness, and ethically sourced timber into our standard specifications, ensuring a minimal footprint and maximum efficiency." className="text-lg text-zinc-400 font-light leading-relaxed mb-8" delay={100} />
        </div>
        <div className="w-full md:w-1/2 h-[400px]">
           <UnveilImage src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80" alt="Sustainable details" className="w-full h-full object-cover opacity-80" />
        </div>
      </div>

    </div>
  </div>
);

const ServicesPage = () => (
  <div className="animate-in fade-in duration-1000 bg-[#fafafa] min-h-screen pt-40 px-6 md:px-12 pb-32">
    <div className="max-w-7xl mx-auto">
      <RevealText text="OUR EXPERTISE" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-8" />
      <RevealText text="End-to-end" className="text-5xl md:text-7xl font-light tracking-tight text-zinc-950" />
      <RevealText text="development." className="text-5xl md:text-7xl font-light tracking-tight text-zinc-950 mb-32" delay={100} />

      <div className="space-y-32">
        {servicesData.map((service, idx) => (
          <div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>
            <div className="w-full lg:w-1/2 h-[400px] md:h-[500px]">
              <UnveilImage src={service.image} alt={service.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-full lg:w-1/2">
              <RevealText text={`0${idx + 1}`} className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-6" />
              <RevealText text={service.title} className="text-4xl md:text-5xl font-light text-zinc-950 mb-6" />
              <RevealText text={service.desc} className="text-xl text-zinc-500 font-light leading-relaxed mb-8" />
              <ul className="space-y-4 border-t border-zinc-200 pt-8">
                {service.features?.map((item, i) => (
                   <li key={i} className="flex items-center text-zinc-600 font-light">
                      <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full mr-4"></span>
                      <RevealText text={item} delay={i * 50} />
                   </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* The Pillar Advantage */}
      <div className="mt-40 border-t border-zinc-200 pt-32">
        <RevealText text="THE PILLAR ADVANTAGE" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-16" />
        <div className="grid md:grid-cols-2 gap-24">
          <div>
             <RevealText text="Why partner with us." className="text-4xl md:text-6xl font-light tracking-tight text-zinc-950 mb-8" />
             <RevealText text="We eliminate the friction typically associated with property development. By consolidating design, consent, and construction under one roof, we drastically reduce timelines and mitigate financial risk." className="text-xl text-zinc-500 font-light leading-relaxed" delay={100} />
          </div>
          <div className="space-y-12">
            {[
              { label: 'Single Point of Contact', desc: 'No more juggling architects, engineers, and builders.' },
              { label: 'Fixed Price Certainty', desc: 'Comprehensive scoping means no unexpected variations.' },
              { label: 'Speed to Market', desc: 'Parallel processing of consents and procurement saves months.' }
            ].map((adv, idx) => (
              <div key={idx} className="border-b border-zinc-200 pb-8">
                <RevealText text={adv.label} className="text-2xl font-light text-zinc-950 mb-2" delay={idx * 100} />
                <RevealText text={adv.desc} className="text-zinc-500 font-light" delay={idx * 100 + 50} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who We Work With */}
      <div className="mt-40 bg-zinc-50 p-12 md:p-24 border border-zinc-200">
        <RevealText text="OUR PARTNERS" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-16 text-center" />
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {[
            { title: 'Private Homebuyers', desc: 'Families looking for bespoke, architectural standalone homes.' },
            { title: 'Property Investors', desc: 'Individuals seeking high-yield, low-maintenance townhouses.' },
            { title: 'Landowners', desc: 'Owners looking to unlock the equity in their land via subdivision.' }
          ].map((type, idx) => (
             <div key={idx}>
               <RevealText text={type.title} className="text-2xl font-light text-zinc-950 mb-4" />
               <RevealText text={type.desc} className="text-zinc-500 font-light leading-relaxed" />
             </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

const ProjectsPage = () => (
  <div className="animate-in fade-in duration-1000 bg-[#fafafa] min-h-screen pt-40 px-6 md:px-12 pb-32">
    <div className="max-w-7xl mx-auto">
      <RevealText text="PORTFOLIO" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-8" />
      <RevealText text="Selected Works." className="text-5xl md:text-7xl font-light tracking-tight text-zinc-950 mb-24" />

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
        {projectsData.map((project, idx) => (
          <Interactive key={project.id} className="group cursor-pointer">
            <div className={`w-full ${idx % 2 === 1 ? 'md:mt-32' : ''}`}>
              <UnveilImage src={project.image} alt={project.title} className="w-full aspect-[4/5] md:aspect-[3/4] mb-8" />
              <div className="flex justify-between items-start border-t border-zinc-200 pt-6">
                <div>
                  <h3 className="text-2xl font-light text-zinc-950 mb-2">{project.title}</h3>
                  <p className="text-zinc-500 text-sm">{project.location}</p>
                </div>
                <span className="text-xs tracking-widest uppercase text-zinc-400 font-semibold">{project.status}</span>
              </div>
            </div>
          </Interactive>
        ))}
      </div>

      {/* Future Developments Section */}
      <div className="mt-40 pt-32 border-t border-zinc-200">
        <RevealText text="ON THE HORIZON" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-16" />
        <RevealText text="Future Developments." className="text-4xl md:text-6xl font-light tracking-tight text-zinc-950 mb-16" />
        
        <div className="flex flex-col">
          {futureProjectsData.map((proj, idx) => (
            <div key={idx} className="group flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-zinc-200 hover:bg-zinc-50 transition-colors px-4 -mx-4 cursor-default">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 w-full">
                <RevealText text={proj.title} delay={idx * 50} className="text-2xl md:text-3xl font-light text-zinc-950" />
                <RevealText text={proj.location} delay={idx * 50 + 50} className="text-sm tracking-widest uppercase text-zinc-500 font-semibold" />
              </div>
              <div className="mt-4 md:mt-0 flex-shrink-0">
                <RevealText text={`Expected ${proj.expected}`} delay={idx * 50 + 100} className="text-xs tracking-[0.2em] uppercase text-zinc-400 font-semibold bg-white border border-zinc-200 px-4 py-2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

const ContactPage = () => {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'ai'
  const [enquiryMessage, setEnquiryMessage] = useState('');
  
  // AI State
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsGenerating(true);
    setAiOutput('');
    const result = await generateAIBrief(aiInput);
    setAiOutput(result);
    setIsGenerating(false);
  };

  const attachToEnquiry = () => {
    setEnquiryMessage(`AI GENERATED BRIEF:\n${aiOutput}\n\nNOTES:`);
    setActiveTab('direct');
  };

  return (
    <div className="animate-in fade-in duration-1000 bg-white min-h-screen pt-40 px-6 md:px-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24">
          
          {/* Left Column: Info & Tab Toggles */}
          <div>
            <RevealText text="CONTACT" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-8" />
            <RevealText text="Start the" className="text-5xl md:text-7xl font-light tracking-tight text-zinc-950" />
            <RevealText text="conversation." className="text-5xl md:text-7xl font-light tracking-tight text-zinc-950 mb-16" delay={100} />
            
            <div className="flex gap-8 border-b border-zinc-200 mb-12">
              <Interactive>
                <button 
                  onClick={() => setActiveTab('direct')}
                  className={`pb-4 text-xs tracking-[0.2em] uppercase font-semibold transition-colors relative ${activeTab === 'direct' ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  Direct Enquiry
                  {activeTab === 'direct' && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-950"></span>}
                </button>
              </Interactive>
              <Interactive>
                <button 
                  onClick={() => setActiveTab('ai')}
                  className={`pb-4 text-xs tracking-[0.2em] uppercase font-semibold transition-colors relative flex items-center gap-2 ${activeTab === 'ai' ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                   AI Architect
                  {activeTab === 'ai' && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-950"></span>}
                </button>
              </Interactive>
            </div>

            <div className="space-y-12">
              {[
                { label: 'Visit', val: '123 Architecture Way\CBD 1010' },
                { label: 'Call', val: '+64 9 123 4567' },
                { label: 'Email', val: 'info@pillarproperties.co.nz' }
              ].map((item, idx) => (
                <div key={idx} className="border-t border-zinc-200 pt-6">
                  <RevealText text={item.label} className="text-xs tracking-[0.2em] uppercase text-zinc-400 font-semibold mb-4" />
                  <RevealText text={item.val} className="text-xl md:text-2xl font-light text-zinc-950 whitespace-pre-line" delay={100} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Form / AI Interface */}
          <div className="lg:mt-32 bg-[#fafafa] p-8 md:p-16 border border-zinc-100 min-h-[600px] flex flex-col">
            
            {activeTab === 'direct' ? (
              <form className="space-y-12 animate-in fade-in duration-500" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <input type="text" placeholder="Name" required className="w-full bg-transparent border-b border-zinc-300 py-4 text-xl font-light text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition-colors" />
                </div>
                <div className="relative">
                  <input type="email" placeholder="Email Address" required className="w-full bg-transparent border-b border-zinc-300 py-4 text-xl font-light text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition-colors" />
                </div>
                <div className="relative">
                  <select defaultValue="" className="w-full bg-transparent border-b border-zinc-300 py-4 text-xl font-light text-zinc-400 focus:outline-none focus:border-zinc-950 focus:text-zinc-950 transition-colors appearance-none cursor-pointer">
                    <option value="" disabled>Nature of Enquiry</option>
                    <option value="buy">Buying a Home</option>
                    <option value="dev">Development Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="relative">
                  <textarea 
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Project Details" 
                    rows={4} 
                    required 
                    className="w-full bg-transparent border-b border-zinc-300 py-4 text-xl font-light text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition-colors resize-none"
                  ></textarea>
                </div>
                <Interactive>
                  <button type="submit" className="w-full bg-zinc-950 text-white py-6 text-sm tracking-[0.2em] uppercase font-semibold hover:bg-zinc-800 transition-colors">
                    Submit Enquiry
                  </button>
                </Interactive>
              </form>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <h3 className="text-2xl font-light text-zinc-950 mb-4">Vision to Reality.</h3>
                <p className="text-zinc-500 font-light mb-8">Describe your ideal property, lifestyle requirements, or investment goals. Our AI Architect will instantly draft a preliminary project brief tailored to Auckland.</p>
                
                <textarea 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="e.g. A 4-bedroom minimalist home in Epsom with a pool, focusing on natural light and concrete materials..." 
                  rows={4} 
                  className="w-full bg-transparent border-b border-zinc-300 py-4 text-xl font-light text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition-colors resize-none mb-8"
                ></textarea>
                
                {!aiOutput && !isGenerating && (
                  <Interactive>
                    <button 
                      onClick={handleGenerate}
                      className="w-full bg-zinc-100 text-zinc-950 border border-zinc-200 py-6 text-sm tracking-[0.2em] uppercase font-semibold hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2"
                    >
                       Generate Brief
                    </button>
                  </Interactive>
                )}

                {isGenerating && (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin"></div>
                    <span className="ml-4 text-xs tracking-widest uppercase text-zinc-400 font-semibold animate-pulse">Consulting Architect...</span>
                  </div>
                )}

                {aiOutput && !isGenerating && (
                  <div className="flex-1 flex flex-col animate-in fade-in duration-700">
                    <div className="flex-1 bg-white p-6 border border-zinc-200 overflow-y-auto mb-8">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-600 leading-relaxed">
                        {aiOutput}
                      </pre>
                    </div>
                    <Interactive>
                      <button 
                        onClick={attachToEnquiry}
                        className="w-full bg-zinc-950 text-white py-6 text-sm tracking-[0.2em] uppercase font-semibold hover:bg-zinc-800 transition-colors flex justify-center items-center gap-2"
                      >
                        Attach to Enquiry <ArrowRight className="w-4 h-4" />
                      </button>
                    </Interactive>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* What Happens Next Section */}
        <div className="mt-40 border-t border-zinc-200 pt-32 max-w-5xl mx-auto">
          <RevealText text="THE PROCESS" className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-semibold mb-16 text-center" />
          <RevealText text="What happens next?" className="text-4xl md:text-5xl font-light tracking-tight text-zinc-950 mb-20 text-center" />
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-[1px] bg-zinc-200 -z-10"></div>
            
            {[
              { step: '01', title: 'Review', desc: 'Our architecture and development team reviews your enquiry and initial requirements within 24 hours.' },
              { step: '02', title: 'Consultation', desc: 'We schedule a complimentary 45-minute discovery call to discuss site feasibility and your architectural vision.' },
              { step: '03', title: 'Proposal', desc: 'We present a high-level conceptual brief, projected timelines, and a structural fee estimate.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white relative flex flex-col items-center text-center px-6">
                <div className="w-12 h-12 bg-[#fafafa] border border-zinc-200 rounded-full flex items-center justify-center text-xs tracking-widest font-semibold text-zinc-950 mb-8">
                  <RevealText text={item.step} delay={idx * 100} />
                </div>
                <RevealText text={item.title} className="text-2xl font-light text-zinc-950 mb-4" delay={idx * 100 + 50} />
                <RevealText text={item.desc} className="text-sm text-zinc-500 font-light leading-relaxed" delay={idx * 100 + 100} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// Fallback pages
const PlaceholderPage = ({ title }) => (
  <div className="animate-in fade-in duration-1000 bg-white min-h-screen pt-40 px-6 md:px-12 flex items-center justify-center">
    <h1 className="text-5xl font-light tracking-tight text-zinc-950">{title} - Coming Soon</h1>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // Global cursor state

  useEffect(() => {
    // Inject CSS
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = ultraModernStyles;
    document.head.appendChild(styleSheet);
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.head.removeChild(styleSheet);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setIsMenuOpen(false);
  }, [currentPage]);

  const navLinks = ['home', 'about', 'services', 'projects', 'contact'];

  return (
    <CursorContext.Provider value={{ isHovering, setIsHovering }}>
      <div className="min-h-screen flex flex-col font-sans text-zinc-950 selection:bg-zinc-950 selection:text-white bg-[#fafafa] overflow-x-hidden relative">
        
        <CustomCursor />

        {/* Minimal Header */}
        <header className={`fixed w-full z-50 transition-all duration-700 ease-out ${scrolled ? 'py-2 md:py-4 bg-white/95 backdrop-blur-sm shadow-sm text-zinc-950' : 'py-4 md:py-6 text-zinc-950'}`}>
          <div className="flex justify-between items-center w-full px-6 md:px-12">
            
            {/* Logo constrained to left 50vw to align with white bg split */}
            <Interactive onClick={() => setCurrentPage('home')} className="md:w-[50vw]">
              <img 
                src="https://static.wixstatic.com/media/548938_1509800225e542a4a2d4144aa68163e9~mv2.png" 
                alt="Pillar Properties" 
                className={`w-auto cursor-pointer object-contain transition-all duration-700 ${scrolled ? 'h-6 md:h-8' : 'h-8 md:h-12'}`}
              />
            </Interactive>

            {/* Desktop Nav - Aligned right half, matching image split */}
            <div className="hidden md:flex gap-8 lg:gap-12 items-center justify-start flex-1 md:pl-12">
              {navLinks.map((link) => (
                <Interactive key={link} onClick={() => setCurrentPage(link)}>
                  <span className="text-[10px] lg:text-xs tracking-[0.2em] uppercase font-semibold cursor-pointer relative group">
                    {link}
                    <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Interactive>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <Interactive className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 -mr-2">
                <Menu className="w-6 h-6" />
              </button>
            </Interactive>
          </div>
        </header>

        {/* Fullscreen Overlay Menu (Mobile) */}
        <div className={`fixed inset-0 bg-zinc-950 z-[100] flex flex-col justify-center px-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-6 text-white p-2">
            <X className="w-8 h-8" />
          </button>
          
          <div className="flex flex-col gap-8 mt-20">
            {navLinks.map((link, i) => (
              <div 
                key={link} 
                onClick={() => setCurrentPage(link)} 
                className={`text-4xl font-light tracking-tight text-white uppercase cursor-pointer transition-all duration-700 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {link}
              </div>
            ))}
          </div>
        </div>

        {/* Persistent Floating CTA (Conversion Factor) */}
        {scrolled && currentPage !== 'contact' && (
           <Interactive className="fixed bottom-8 right-6 md:right-12 z-40 animate-in slide-in-from-bottom-10 fade-in duration-500 hidden md:block">
              <button 
                onClick={() => setCurrentPage('contact')} 
                className="bg-zinc-950 text-white px-8 py-4 text-xs tracking-[0.2em] uppercase font-semibold rounded-full shadow-2xl hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                Inquire Now <ArrowUpRight className="w-4 h-4" />
              </button>
           </Interactive>
        )}

        {/* Dynamic Page Rendering */}
        <main className="flex-grow z-10 bg-[#fafafa]">
          {currentPage === 'home' && <HomePage navigate={setCurrentPage} />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'services' && <ServicesPage />}
          {currentPage === 'projects' && <ProjectsPage />}
          {currentPage === 'contact' && <ContactPage />}
          {currentPage === 'gallery' && <PlaceholderPage title="Gallery" />}
        </main>

        {/* Architectural Footer */}
        <footer className="bg-zinc-950 text-zinc-400 py-24 px-6 md:px-12 relative z-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start border-b border-zinc-800 pb-20">
              <div className="mb-12 md:mb-0">
                <Interactive onClick={() => setCurrentPage('home')}>
                  <img 
                    src="https://static.wixstatic.com/media/548938_7808033ca9fd4a2c9b9240e3e3f945e2~mv2.png" 
                    alt="Pillar Properties" 
                    className="h-12 md:h-16 w-auto mb-6 cursor-pointer object-contain" 
                  />
                </Interactive>
                <div className="flex gap-6 mt-12">
                  <Interactive><Instagram className="w-5 h-5 text-zinc-500 hover:text-white transition-colors cursor-pointer" /></Interactive>
                  <Interactive><Linkedin className="w-5 h-5 text-zinc-500 hover:text-white transition-colors cursor-pointer" /></Interactive>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 md:gap-32">
                <div>
                  <h4 className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold text-zinc-600 mb-8">Navigation</h4>
                  <ul className="space-y-4 text-sm md:text-base">
                    {navLinks.map(link => (
                      <li key={link}>
                        <Interactive onClick={() => setCurrentPage(link)}>
                          <span className="hover:text-white transition-colors capitalize cursor-pointer font-light">{link}</span>
                        </Interactive>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold text-zinc-600 mb-8">Contact</h4>
                  <ul className="space-y-4 font-light text-sm md:text-base">
                    <li>Auckland CBD</li>
                    <li>+64 9 123 4567</li>
                    <li>info@pillarproperties.co.nz</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase font-semibold text-zinc-600">
              <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} PILLAR PROPERTIES</p>
              <div className="flex gap-8">
                <Interactive><span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy</span></Interactive>
                <Interactive><span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms</span></Interactive>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </CursorContext.Provider>
  );
}