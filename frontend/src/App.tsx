import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Cpu, MousePointer2, ShieldCheck, ArrowRight, Laptop, Layers, Activity } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

const Logo = ({ className = "" }) => (
  <svg
    viewBox="0 0 40 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 32V8L20 20L32 8V32"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="square"
    />
  </svg>
);

const MetrixaAILanding = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#0A0A0A] font-sans selection:bg-[#0A0A0A] selection:text-white overflow-x-hidden">

      {/* 1. AMBIENT BACKGROUND TEXTURE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-100/50 blur-[140px] rounded-full"></div>
      </div>

      {/* 2. GHOST-STYLE MINIMAL NAV */}
      <nav className={`fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center transition-all duration-700 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/5' : ''}`}>
        <div className="flex items-center gap-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group cursor-pointer flex items-center gap-3"
          >
            <Logo className="h-6 w-auto text-black transition-transform duration-500 group-hover:scale-110" />
            <span className="text-xl font-black uppercase tracking-[-0.05em] transition-all duration-500 group-hover:tracking-[0.05em]">
              MetrixaAI
            </span>
          </motion.div>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
            <a href="#engine" className="hover:text-black transition-colors">Engine</a>
            <a href="#vision" className="hover:text-black transition-colors">Vision</a>
            <a href="#security" className="hover:text-black transition-colors">Security</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-black/30">Stable Build 2.0.4</span>
          <button className="px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
            Get Started
          </button>
        </div>
      </nav>

      {/* 3. HERO: THE AGENTIC LAYER FOR MAC */}
      <section className="relative pt-44 pb-24 px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded">Enterprise AI</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Universal MacBook Action Model</span>
            </div>

            <h1 className="text-[12vw] md:text-[11rem] font-[1000] uppercase tracking-[-0.06em] leading-[0.8] mb-12">
              The Agentic<br />
              <span className="text-transparent bg-clip-text bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center italic">Layer for Mac</span>
            </h1>

            <div className="grid md:grid-cols-2 gap-20 items-end">
              <p className="text-2xl md:text-4xl font-medium tracking-tight leading-tight max-w-xl text-black/80">
                Metrixa is a <span className="text-black">Universal Action Layer</span> that bridges the gap between static software and autonomous execution. One brain for every app.
              </p>

              <div className="flex flex-col gap-6 items-start md:items-end">
                <a href="/Metrixa-AI.dmg" download className="flex items-center gap-6 group">
                  <span className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1">Download for macOS</span>
                  <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <Download size={18} />
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. THE GHOST BENTO GRID */}
      <section id="engine" className="py-24 px-8 z-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-1 mb-1 bg-black/5 border border-black/5">

            {/* Feature 1 */}
            <div className="md:col-span-7 bg-[#FBFBF9] p-12 flex flex-col justify-between min-h-[500px] group overflow-hidden relative">
              <div className="relative z-10">
                <Layers className="mb-8 h-8 w-auto text-black" />
                <h3 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">Cross-App<br />Orchestration</h3>
                <p className="max-w-xs text-black/50 text-sm font-medium leading-relaxed">Metrixa utilizes computer vision and accessibility drivers to navigate any macOS interface, from legacy ERPs to modern creative suites.</p>
              </div>
              <div className="relative z-10 flex gap-4">
                <div className="px-4 py-2 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest">Low Latency</div>
                <div className="px-4 py-2 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest">Apple Silicon</div>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] w-80 h-80 bg-black/[0.02] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            </div>

            {/* Feature 2 */}
            <div className="md:col-span-5 bg-[#FBFBF9] p-12 flex flex-col justify-between hover:bg-black hover:text-white transition-all duration-500 cursor-pointer">
              <MousePointer2 size={32} className="opacity-20" />
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Autonomous Operation</h3>
                <p className="text-sm opacity-60">Hand over the mouse. Metrixa performs clicks, drag-and-drops, and complex UI navigations natively across all local windows.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="md:col-span-5 bg-[#FBFBF9] p-12 flex flex-col justify-between group">
              <div className="w-full aspect-square bg-black/[0.03] rounded-3xl p-8 flex items-center justify-center mb-8">
                <Cpu size={64} className="opacity-10 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">On-Device Inference</h3>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-7 bg-[#FBFBF9] p-12 flex flex-col justify-between overflow-hidden relative">
              <h3 className="text-7xl font-black uppercase tracking-tighter leading-none opacity-[0.03] absolute top-10 right-0 select-none">SOVEREIGN</h3>
              <div>
                <ShieldCheck className="mb-8" size={32} />
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Privacy Sovereignty</h3>
                <p className="max-w-md text-black/50 font-medium">Metrixa operates in a "Zero-Cloud" environment. Your screen data never leaves the hardware boundary of your MacBook.</p>
              </div>
              <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] mt-8 group">
                Read Manifesto <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIQUID STATS SECTION */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto border-t-2 border-black pt-12">
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { label: "Execution Speed", val: "0.4ms" },
              { label: "Security Level", val: "E2EE" },
              { label: "App Support", val: "Global" },
              { label: "Neural Engine", val: "Native" }
            ].map((stat, i) => (
              <div key={i}>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-2 block">{stat.label}</span>
                <span className="text-5xl font-black uppercase tracking-tighter italic">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL REDESIGNED FOOTER SECTION */}
      <footer className="relative bg-black text-white pt-32 pb-12 px-8 overflow-hidden">
        {/* Ambient Glow Background for Footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.12),transparent_50%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: 40, opacity: 0 }}
            className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[3rem] md:rounded-[5rem] p-12 md:p-24 mb-20 flex flex-col items-center text-center"
          >

            <motion.div
              whileInView={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Logo className="h-16 md:h-20 w-auto text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-10 max-w-3xl leading-[0.9]">
              Ready to transcend the <span className="text-white/30 italic">standard interface?</span>
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <button className="group relative px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                  Access The Core <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

              <div className="flex items-center gap-4 md:pl-10 md:border-l border-white/10 h-auto md:h-14">
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Architecture</span>
                  <div className="flex items-center gap-2">
                    <Laptop size={16} className="text-white/60" />
                    <span className="text-base font-bold uppercase tracking-tight italic">macOS Native</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 gap-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>© 2026 MetrixaAI Laboratory — ZMJ INC.</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">Documentation</a>
              <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">Privacy</a>
              <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">Twitter</a>
            </div>
          </div>
        </div>
      </footer>

      {/* GLOBAL OVERRIDES */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default MetrixaAILanding;