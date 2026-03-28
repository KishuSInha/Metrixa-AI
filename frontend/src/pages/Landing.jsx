import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight, ChevronRight, Download, Shield, Cpu, Zap, Globe, Mail, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const SKY_BLUE = '#74D4FB';
const OFF_WHITE = '#F7F7F2';
const TEXT_DARK = '#1a1a1a';

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <img src="/logo.svg" alt="Metrixa" className="w-8 h-8" />
    <span className="text-[22px] font-bold tracking-tight text-black">Metrixa</span>
  </div>
);

const NavLink = ({ to, children, href }) => {
  const classes = "text-[14px] font-semibold text-black/50 hover:text-black transition-colors tracking-tight";
  if (href) return <a href={href} className={classes}>{children}</a>;
  return <Link to={to} className={classes}>{children}</Link>;
};

const FeatureSection = ({ title, description, children, reversed = false }) => (
  <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-32 py-24`}>
    <div className="w-full md:w-[45%] space-y-8">
      <h2 className="text-4xl md:text-5xl font-bold text-black leading-[1.05] tracking-tight">
        {title}
      </h2>
      <p className="text-[19px] text-black/40 font-medium leading-relaxed max-w-lg">
        {description}
      </p>
    </div>
    <div className="w-full md:w-[55%] bg-[#EAEDE7] bg-[#E8EBEE] rounded-[24px] aspect-[16/10] relative overflow-hidden p-6 md:p-10 flex items-center justify-center shadow-inner">
       <div className="absolute inset-0 bg-black/5 opacity-40 pointer-events-none" />
       {children}
    </div>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/5 py-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-2xl font-semibold text-black/80 group-hover:text-black transition-colors">{question}</span>
        <div className="text-black/20 group-hover:text-black transition-all">
          {isOpen ? <Minus className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-8 text-xl text-black/40 font-medium leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroCursorAnimation = () => {
  // Use a fixed generic path or rely on relative viewport positioning to prevent hydration mismatch/errors
  return (
    <motion.div
      initial={{ x: 800, y: 100 }}
      animate={{
        x: [800, 400, 150, 600, 500],
        y: [100, 50, 200, 80, 150]
      }}
      transition={{
        duration: 10,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className="absolute top-0 left-0 z-50 pointer-events-none flex flex-col items-start hidden md:flex"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg drop-shadow-white/20">
        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L5.5 3.21z" fill="black" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="mt-2 ml-4 px-3 py-1.5 bg-black/80 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#74D4FB] animate-[pulse_1.5s_ease-in-out_infinite]" />
        <span className="text-white text-[11px] font-semibold tracking-wider uppercase">Metrixa Executing</span>
      </div>
    </motion.div>
  );
};

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const downloadUrl = "https://github.com/KishuSInha/Metrixa-AI/releases/download/v0.1.1/Metrixa.AI-0.1.1-arm64.dmg";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#74D4FB] selection:text-black antialiased relative overflow-x-hidden">
      
      {/* Background Subtle Grid & Fade */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03]" />
        <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-[#74D4FB]/5 to-transparent" />
      </div>

      {/* Nav - Ghost Perfect */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1400px] mx-auto px-10 md:px-16 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-14">
            <div className="hidden md:flex items-center gap-12">
              <NavLink to="/privacy">Privacy</NavLink>
              <NavLink href="mailto:hello@metrixa.ai">Contact Us</NavLink>
            </div>
            <a 
              href={downloadUrl}
              className="px-8 py-3 bg-[#74D4FB] text-black text-[15px] font-bold rounded-full hover:opacity-80 transition-all active:scale-95 shadow-sm shadow-[#74D4FB]/10"
            >
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero - Centered & Spacious */}
      <header className="relative z-10 pt-72 pb-48 px-10 md:px-16 max-w-[1400px] mx-auto text-center overflow-hidden">
        <HeroCursorAnimation />
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="relative"
        >
          {/* Silicon Valley Badge */}
          <div className="flex justify-center mb-10">
            <div className="px-4 py-1.5 bg-[#EAEDE7] rounded-full flex items-center gap-2 border border-black/5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#74D4FB] animate-pulse" />
              <span className="text-[13px] font-bold text-black/70 tracking-tight">Metrixa Beta v0.1.1</span>
            </div>
          </div>
          
          <h1 className="text-7xl md:text-[110px] font-semibold leading-[0.9] tracking-[-0.05em] mb-12">
            Say hello to <br /> Metrixa.
          </h1>
          <p className="text-2xl md:text-[34px] text-black/50 font-medium mb-16 max-w-2xl mx-auto leading-tight">
            On-device neural orchestration for the digital elite. Metrixa executes where you live—within your private hardware boundary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <a 
              href={downloadUrl}
              className="px-12 py-5 bg-[#74D4FB] text-black text-xl font-bold rounded-full hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              Download
            </a>
            <Link to="/manifesto" className="text-lg font-bold text-black/40 hover:text-black transition-colors flex items-center gap-2 group">
              Read our Manifesto <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Main Content - Feature blocks matching Ghost images */}
      <main className="relative z-10 px-10 md:px-16 max-w-[1400px] mx-auto pt-32 space-y-8 pb-48">
        
        <FeatureSection 
          title="Unified Application Orchestration."
          description="Metrixa bridges the gap between fragmented silos. Command your entire software stack through a single, local neural interface."
        >
          <div className="w-full h-full bg-[#1a1a1a] relative overflow-hidden">
             <img 
               src="/Users/utkarshsinha/.gemini/antigravity/brain/2473a2c6-4795-4f1d-b6bf-37792aafef49/metrixa_feature_apps_mockup_1772471101232.png" 
               className="w-full h-full object-cover opacity-90 shadow-2xl select-none pointer-events-none"
               alt="Metrixa Apps Mockup"
             />
          </div>
        </FeatureSection>

        <FeatureSection 
          title="Sovereign Contextual Memory."
          description="A persistence layer that never leaves your metal. Metrixa builds a high-fidelity vector graph of your work, accessible only by you."
          reversed
        >
          <div className="w-full h-full bg-[#1a1a1a] relative overflow-hidden">
             <img 
               src="/Users/utkarshsinha/.gemini/antigravity/brain/2473a2c6-4795-4f1d-b6bf-37792aafef49/metrixa_feature_memory_mockup_1772471119417.png" 
               className="w-full h-full object-cover opacity-90 shadow-2xl select-none pointer-events-none"
               alt="Metrixa Memory Mockup"
             />
          </div>
        </FeatureSection>

        <FeatureSection 
          title="Autonomous Edge Automation."
          description="Execute complex web workflows without cloud leakage. Metrixa operates the browser at the edge, ensuring your intent remains your property."
        >
          <div className="w-full h-full bg-[#1a1a1a] relative overflow-hidden">
             <img 
               src="/Users/utkarshsinha/.gemini/antigravity/brain/2473a2c6-4795-4f1d-b6bf-37792aafef49/metrixa_feature_web_automation_mockup_1772471732474.png" 
               className="w-full h-full object-cover opacity-90 shadow-2xl select-none pointer-events-none"
               alt="Metrixa Web Automation Mockup"
             />
          </div>
        </FeatureSection>
      </main>

      {/* Get Metrixa CTA - Ghost style */}
      <section className="px-10 md:px-16 max-w-[1400px] mx-auto pb-8">
        <div className="w-full bg-[#74D4FB] rounded-[32px] py-32 px-12 md:px-24 relative overflow-hidden group">
           <div className="relative z-10 max-w-4xl">
              <h3 className="text-6xl md:text-[110px] font-semibold tracking-[-0.05em] leading-[0.9] mb-16">
                Get your <br /> Metrixa.
              </h3>
              <a 
                href={downloadUrl}
                className="inline-block px-10 py-4 bg-[#101820] text-white text-lg font-bold rounded-full hover:bg-black transition-all active:scale-95 shadow-xl"
              >
                Download
              </a>
           </div>
           {/* Ghost-style floating icon */}
           <div className="absolute right-12 md:right-24 bottom-12 md:bottom-24 w-32 h-32 md:w-48 md:h-48 bg-[#101820] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <img src="/logo.svg" className="w-[60%] h-[60%]" alt="Metrixa" />
           </div>
        </div>
      </section>

      {/* FAQ Area - Ghost Perfect Two Column */}
      <section className="px-10 md:px-16 max-w-[1400px] mx-auto pb-64">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-32">
          <div className="md:col-span-4">
            <h3 className="text-5xl md:text-[80px] font-semibold leading-none tracking-tighter">FAQs</h3>
          </div>
          <div className="md:col-span-8">
            <FAQItem question="What can Metrixa do for me?" answer="Metrixa handles digital tasks natively. From managing your calendar and drafting emails to automating complex data workflows across your native apps. It behaves as a digital companion that executes labor for you." />
            <FAQItem question="Does Metrixa take actions on its own?" answer="Only when strictly instructed by you. It can operate autonomously within parameters you set, ensuring you remain the ultimate authority while it handles the execution." />
            <FAQItem question="How does Metrixa handle my data?" answer="Locally. Metrixa operates within the 'Sovereign Node' architecture. Your data never leaves your hardware boundary, ensuring complete privacy from the ground up." />
            <FAQItem question="Is Metrixa free?" answer="Metrixa is currently in Deployment Beta 0.1.1. It is free to use during this phase as we gather community feedback on local intelligence orchestration." />
            <FAQItem question="How is Metrixa different from ChatGPT, Claude, or Gemini?" answer="Cloud-based models have limited access to your local tools. Metrixa lives on your machine, sees your screen, and uses your actual software exactly like you do." />
          </div>
        </div>
      </section>

      {/* New Ghost Master Footer */}
      <footer className="bg-[#101820] text-white py-24 px-10 md:px-16">
        <div className="max-w-[1400px] mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-start gap-16">
              
              {/* Logo area */}
              <div className="w-full md:w-1/3">
                 <Link to="/" className="flex items-center gap-3">
                    <img src="/logo.svg" alt="Metrixa" className="w-8 h-8" />
                    <span className="text-3xl font-bold tracking-tight">Metrixa</span>
                 </Link>
              </div>

              {/* Link Columns matching image */}
              <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-12 text-[15px] font-medium">
                 
                 <div className="space-y-4">
                    <Link to="/privacy" className="block text-white/50 hover:text-white transition-colors">Privacy</Link>
                    <a href="mailto:hello@metrixa.ai" className="block text-white/50 hover:text-white transition-colors">Contact Us</a>
                 </div>

                 <div className="space-y-4">
                    <a href="https://x.com" className="block text-white/50 hover:text-white transition-colors">X</a>
                    <a href="https://linkedin.com" className="block text-white/50 hover:text-white transition-colors">LinkedIn</a>
                 </div>

                 <div className="space-y-4">
                    <span className="block text-white/50">Terms of Use</span>
                    <span className="block text-white/50">©2026 METRIXA, Inc</span>
                 </div>

              </div>

           </div>
        </div>
      </footer>

      {/* Global CSS for Refining */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            background-color: white;
            color: black;
          }

          h1, h2, h3, h4 {
            letter-spacing: -0.045em;
          }

          ::selection {
            background: #74D4FB;
            color: black;
          }

          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-track {
            background: white;
          }
          ::-webkit-scrollbar-thumb {
            background: #F1F5F9;
            border-radius: 5px;
            border: 2px solid white;
          }
        `
      }} />
    </div>
  );
};

export default Landing;
