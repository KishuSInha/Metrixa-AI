import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Shield, ArrowRight, Zap, Cpu, Terminal, AppWindow, Code, MessageSquare, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const Landing = () => {
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
                        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                            <Logo className="h-8 w-8 text-slate-900" />
                            <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Metrixa AI</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            <a href="#engine" className="hover:text-slate-900 transition-colors">Engine</a>
                            <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
                            <a href="#sovereign-node" className="hover:text-slate-900 transition-colors">Sovereign Node</a>
                        </div>
                    </div>

                    <Link
                        to="/documentation"
                        className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                    >
                        <span>View Documentation</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
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


                        <h1 className="text-6xl md:text-[7rem] font-bold text-white mb-8 leading-[0.9] tracking-tighter">
                            Put AI to work across every Mac app.
                        </h1>

                        <p className="mx-auto text-center text-xl md:text-2xl text-white/60 mb-12 font-light max-w-3xl leading-relaxed">
                              Metrixa uses local vision to control your native software. No APIs, no plugins—just instant, sovereign automation across your entire workspace.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <a
                                href={downloadUrl}
                                download
                                className="inline-flex flex-col items-center justify-center gap-1 bg-[#C4F582] text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#B4E572] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(196,245,130,0.3)] min-w-[280px]"
                            >
                                <div className="flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    <span>Download for macOS</span>
                                </div>
                                <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest">arm64-apple-darwin</span>
                            </a>
                        </div>
                    </motion.div>
                </div>


            </section>

            {/* Sovereign Node Section */}
            <section id="sovereign-node" className="py-32 px-6 md:px-12 bg-[#F6F6F4]">
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

            {/* Engine Section (formerly Orchestration) */}
            <section id="engine" className="py-32 px-6 md:px-12 bg-white">
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



            {/* Expanded Footer */}
            <footer className="bg-slate-950 text-slate-400 py-20 px-6 md:px-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Logo className="h-6 w-6 text-white" />
                            <span className="text-sm font-bold text-white uppercase tracking-widest">Metrixa AI</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
                            Orchestrating the future of local-first computing. Built for those who demand sovereignty and speed.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://x.com/metrixaAI" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#C4F582] transition-colors"><span className="sr-only">X (Twitter)</span><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
                            <a href="https://github.com/KishuSInha/Metrixa-AI" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#C4F582] transition-colors"><span className="sr-only">GitHub</span><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Product</h4>
                        <ul className="space-y-3 text-xs font-medium">
                            <li><a href={downloadUrl} className="hover:text-[#C4F582] transition-colors">Download Beta</a></li>
                            <li><Link to="/documentation" className="hover:text-[#C4F582] transition-colors">Documentation</Link></li>
                            <li><Link to="/manifesto" className="hover:text-[#C4F582] transition-colors">Manifesto</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Resources</h4>
                        <ul className="space-y-3 text-xs font-medium">
                            <li><a href="https://github.com/KishuSInha/Metrixa-AI/discussions" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4F582] transition-colors">Community</a></li>
                            <li><a href="https://github.com/KishuSInha/Metrixa-AI/releases" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4F582] transition-colors">Changelog</a></li>
                            <li><a href="/logo.svg" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4F582] transition-colors">Brand Kit</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Legal</h4>
                        <ul className="space-y-3 text-xs font-medium">
                            <li><Link to="/legal" className="hover:text-[#C4F582] transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/legal" className="hover:text-[#C4F582] transition-colors">Terms of Service</Link></li>
                            <li><Link to="/legal" className="hover:text-[#C4F582] transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-emerald-500/80">ALL SYSTEMS OPERATIONAL</span>
                    </div>
                    <p className="text-slate-600">© 2026 METRIXA AI — ENGINEERED FOR SOVEREIGNTY_</p>
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

export default Landing;
