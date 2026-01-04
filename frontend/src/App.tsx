import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Shield, ArrowRight, Zap, Cpu, Terminal } from 'lucide-react';

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

  const downloadUrl = "https://github.com/KishuSInha/Metrixa-AI/releases/download/v0.1.1/Metrixa.AI-0.1.1-arm64.dmg";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased overflow-x-hidden">

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 group cursor-pointer">
              <Logo className="h-8 w-8 text-slate-900" />
              <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Metrixa AI</span>
            </div>
            <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <a href="#orchestration" className="hover:text-slate-900 transition-colors">Orchestration</a>
              <a href="#sovereignty" className="hover:text-slate-900 transition-colors">Sovereignty</a>
              <a href="#core" className="hover:text-white hover:bg-slate-900 px-3 py-1 rounded transition-all">The Core</a>
            </div>
          </div>

          <a
            href={downloadUrl}
            download
            className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          >
            <span>Initialize</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center px-6 md:px-12 overflow-hidden bg-slate-900"
      >
        {/* Local Background Asset from Desktop App */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `url('/bg1.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.1) brightness(0.9)'
          }}
        />

        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent"></div>

        <div className="relative z-10 max-w-5xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >

            <h1 className="text-6xl md:text-[7.5rem] font-bold text-white mb-8 leading-[0.85] tracking-tighter">
              Bridging Human Intent <br />
              <span className="text-white/40 italic font-light">& Native Execution.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 mb-12 font-medium max-w-2xl leading-relaxed">
              The first sovereign agentic layer that orchestrates native applications through on-device computer vision and zero-latency accessibility drivers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href={downloadUrl}
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-[#C4F582] text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#B4E572] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(196,245,130,0.3)]"
              >
                <Download className="w-5 h-5" />
                Deploy for macOS
              </a>

              <div className="hidden lg:flex items-center gap-4 px-8 border-l border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Target Arch</span>
                  <span className="text-xs font-mono text-white/70">arm64-darwin-23.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Core Visualization */}
        <motion.div
          className="absolute bottom-20 right-20 hidden xl:block"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="relative group">
            {/* Ambient Glows */}
            <div className="absolute inset-0 bg-[#C4F582]/10 blur-3xl rounded-full scale-150 group-hover:bg-[#C4F582]/20 transition-colors"></div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer Ring */}
              <div className="absolute inset-0 border border-white/5 rounded-full"></div>

              {/* Middle Octagon */}
              <div className="absolute inset-8 border border-white/10 rounded-[2rem] rotate-45"></div>

              {/* Inner Core */}
              <motion.div
                className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C4F582]"></div>
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="w-2 h-2 rounded-full bg-[#C4F582]"></div>
                </div>
              </motion.div>

              {/* Orbital Nodes */}
              {[0, 90, 180, 270].map((angle, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/40 rounded-full"
                  style={{
                    top: `${50 + 40 * Math.sin(angle * Math.PI / 180)}%`,
                    left: `${50 + 40 * Math.cos(angle * Math.PI / 180)}%`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sovereignty Section */}
      <section id="sovereignty" className="py-32 px-6 md:px-12 bg-[#F6F6F4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-24">
            <div>
              <div className="inline-block px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded mb-6">Security Context</div>
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-[0.9]">
                Sovereign Intelligence. <br />
                <span className="text-slate-400">Localized Privacy.</span>
              </h2>
            </div>
            <p className="text-xl text-slate-500 max-w-xl pb-2 leading-relaxed font-medium">
              Metrixa operates within a strictly defined hardware boundary. Your screen data is processed in-memory and discarded post-inference—never persisting, never leaking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-1">
            {/* Encapsulation */}
            <div className="bg-white p-12 border border-slate-100 hover:z-10 hover:shadow-2xl hover:border-transparent transition-all duration-500">
              <Terminal className="w-8 h-8 text-slate-300 mb-8" />
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Zero-Cloud Inference</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Autonomous logic executed entirely on local Neural Engines. No external API calls for core decision-making pipelines.
              </p>
            </div>

            {/* Verification */}
            <div className="bg-white p-12 border border-slate-100 hover:z-10 hover:shadow-2xl hover:border-transparent transition-all duration-500">
              <Shield className="w-8 h-8 text-slate-300 mb-8" />
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">E2E Integrity</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Full-spectrum encryption for local databases and IPC channels, ensuring system-level resistance to lateral data exfiltration.
              </p>
            </div>

            {/* Control */}
            <div className="bg-white p-12 border border-slate-100 hover:z-10 hover:shadow-2xl hover:border-transparent transition-all duration-500">
              <Cpu className="w-8 h-8 text-slate-300 mb-8" />
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">On-Device VLM</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                High-fidelity screen parsing using optimized Vision Language Models natively compiled for Apple Silicon performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orchestration Section */}
      <section id="orchestration" className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 order-2 lg:order-1">
              <div
                className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 border-[12px] border-slate-50"
                style={{ aspectRatio: '16/10' }}
              >
                <img src="/bg1.png" alt="Contextual Awareness" className="absolute inset-0 w-full h-full object-cover opacity-60" />

                {/* Simulated IDE / System Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">active_session.sh</span>
                    </div>
                    <div className="space-y-4 font-mono">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 mb-1">$ metrixa --task</p>
                        <p className="text-sm text-slate-800 font-bold italic">
                          "Sync my local dev logs to the Jira ticketing system and close the active sprint."
                        </p>
                      </div>
                      <div className="bg-[#C4F582]/20 rounded-xl p-4 border border-[#C4F582]/30">
                        <p className="text-xs text-emerald-700/60 mb-1">METRIXA_CORE :: SUCCESS</p>
                        <ul className="text-[11px] text-slate-900 space-y-1">
                          <li>→ Parsed 14 logs from ~/logs</li>
                          <li>→ Authenticated via JIRA API (local key)</li>
                          <li>→ Sprint [0.1.0] closed.</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="flex-1 order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-[#C4F582] text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded mb-6">Autonomous Drivers</div>
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-[0.9]">
                Deep Context. <br />
                Native Actions.
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed mb-10 font-medium">
                Metrixa doesn't just read code—it reads pixels. By leveraging advanced OCR and element detection, it navigates any GUI with the precision of a power user.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Multi-App Context", desc: "Correlate data across Browser, Terminal, and Design tools simultaneously." },
                  { title: "Atomic Execution", desc: "Native mouse/keyboard events delivered via low-level system drivers." },
                  { title: "Dynamic Recovery", desc: "Automatically handles layout shifts and unexpected system dialogs." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Initialize Terminal */}
      <section
        className="relative py-40 px-6 md:px-12 overflow-hidden bg-slate-950"
        id="core"
      >
        <div
          className="absolute inset-0 opacity-20 grayscale brightness-50"
          style={{
            backgroundImage: `url('/bg1.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Logo className="h-16 w-16 text-[#C4F582] mx-auto mb-10" />
            <h2 className="text-5xl md:text-[6rem] font-bold text-white mb-10 tracking-tighter leading-none">
              Initialize <br />
              <span className="text-[#C4F582]">The Agentic Era.</span>
            </h2>

            <div className="flex flex-col items-center gap-8">
              <a
                href={downloadUrl}
                download
                className="group inline-flex items-center gap-4 bg-white text-slate-900 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_80px_rgba(255,255,255,0.1)]"
              >
                <Download className="w-6 h-6" />
                Download Binary
              </a>

              <div className="flex items-center gap-10 mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
                <a href="#" className="hover:text-[#C4F582] transition-colors">Documentation</a>
                <a href="#" className="hover:text-[#C4F582] transition-colors">Manifesto</a>
                <a href="#" className="hover:text-[#C4F582] transition-colors">X.com</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terminal Style Copyright */}
      <footer className="bg-slate-950 text-white/20 py-8 px-6 md:px-12 pt-0">
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px]">
          <div className="flex items-center gap-4">
          </div>
          <p>© 2026 METRIXA AI — ALL RIGHTS RESERVED_</p>
        </div>
      </footer>

      {/* Global CSS Injection */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300..700&display=swap');
        body { font-family: 'Spline Sans', sans-serif; letter-spacing: -0.01em; }
        ::selection { background: #C4F582; color: #1A1A1A; }
      `}} />
    </div>
  );
};

export default MetrixaAILanding;