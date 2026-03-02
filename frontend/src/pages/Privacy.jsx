import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, ArrowRight, Globe } from 'lucide-react';

const Privacy = () => {
    const downloadUrl = "https://github.com/KishuSInha/Metrixa-AI/releases/download/v0.1.1/Metrixa.AI-0.1.1-arm64.dmg";

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-[#74D4FB] selection:text-black antialiased relative">
            
            <nav className="fixed top-0 w-full z-50 py-8 bg-white/80 backdrop-blur-xl border-b border-black/5">
                <div className="max-w-[1400px] mx-auto px-10 md:px-16 flex justify-between items-center text-black">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img src="/icon.png" alt="Metrixa" className="w-8 h-8" />
                        <span className="text-[22px] font-bold tracking-tight">Metrixa</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link to="/manifesto" className="text-[14px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors hidden md:block">
                            Manifesto
                        </Link>
                        <Link to="/" className="text-[14px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors border border-black/10 px-6 py-2 rounded-full">
                            Close
                        </Link>
                    </div>
                </div>
            </nav>

            <header className="relative z-10 pt-72 pb-32 px-10 md:px-16 max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-7xl md:text-[110px] font-semibold tracking-[-0.05em] leading-[0.9] mb-12">
                        The Privacy <br /> Invariant.
                    </h1>
                    <p className="text-2xl md:text-[34px] text-black/40 font-medium leading-tight max-w-3xl">
                        A commitment to sovereign execution. Data security isn't a setting—it's the only way we build.
                    </p>
                </motion.div>
            </header>

            <main className="relative z-10 px-10 md:px-16 py-32 max-w-[1400px] mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-32">
                    <div className="md:col-span-12 lg:col-span-4 sticky lg:top-48 h-fit mb-12 lg:mb-0">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">Zero-Knowledge <br/> Orchestration</h2>
                    </div>
                    <div className="md:col-span-12 lg:col-span-8 space-y-48">
                        
                        <section className="space-y-10 group">
                            <span className="text-sm font-bold uppercase tracking-[0.4em] text-[#74D4FB]">Protocol 01</span>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Neural Edge Processing</h3>
                            <p className="text-2xl text-black/40 font-medium leading-relaxed">
                                Metrixa leverages the Apple Silicon Neural Engine to process all intent on-device. Your screen and data are tokenized in volatile memory and instantly purged. We have zero visibility into your digital session.
                            </p>
                        </section>

                        <section className="space-y-10 group">
                            <span className="text-sm font-bold uppercase tracking-[0.4em] text-[#74D4FB]">Protocol 02</span>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Sovereign Inference</h3>
                            <p className="text-2xl text-black/40 font-medium leading-relaxed">
                                By utilizing Unified Memory Execution, Metrixa avoids the cloud leakage inherent in API-based assistants. Your reasoning engine lives in your physical hardware, ensuring total isolation from centralized data silos.
                            </p>
                        </section>

                        <section className="space-y-10 group">
                            <span className="text-sm font-bold uppercase tracking-[0.4em] text-[#74D4FB]">Protocol 03</span>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Contextual Ownership</h3>
                            <p className="text-2xl text-black/40 font-medium leading-relaxed">
                                Your vector history and memory graphs are stored in a local encrypted node. You maintain absolute root authority over your intelligence stack. Your context is restricted to your machine—forever.
                            </p>
                        </section>

                    </div>
                </div>
            </main>

            <section className="px-10 md:px-16 max-w-[1400px] mx-auto pb-8">
              <div className="w-full bg-[#74D4FB] rounded-[40px] py-32 px-12 md:px-24 relative overflow-hidden group">
                 <div className="relative z-10 max-w-4xl">
                    <h3 className="text-6xl md:text-[90px] font-semibold tracking-[-0.05em] leading-[0.9] mb-16 text-black">
                      Secure your <br /> Autonomy.
                    </h3>
                    <a 
                      href={downloadUrl}
                      className="inline-block px-12 py-5 bg-[#101820] text-white text-xl font-bold rounded-full hover:bg-black transition-all active:scale-95 shadow-xl"
                    >
                      Download Metrixa
                    </a>
                 </div>
                 <div className="absolute right-12 md:right-24 bottom-12 md:bottom-24 w-40 h-40 md:w-56 md:h-56 bg-[#101820] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <img src="/icon.png" className="w-[60%] h-[60%] brightness-0 invert" alt="Metrixa" />
                 </div>
              </div>
            </section>

            <footer className="bg-[#101820] text-white py-32 px-10 md:px-16">
              <div className="max-w-[1400px] mx-auto">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-16 border-b border-white/5 pb-24 mb-16">
                    <div className="w-full md:w-1/3">
                       <Link to="/" className="flex items-center gap-3">
                          <img src="/icon.png" alt="Metrixa" className="w-8 h-8 brightness-0 invert" />
                          <span className="text-4xl font-bold tracking-tight">Metrixa</span>
                       </Link>
                       <p className="mt-8 text-white/40 text-lg font-medium max-w-xs leading-relaxed">
                         The sovereign intelligence layer for on-device neural orchestration.
                       </p>
                    </div>
                    <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-12 text-[16px] font-bold">
                       <div className="space-y-6">
                          <span className="text-[11px] uppercase tracking-[0.4em] text-white/20 block mb-4">Foundation</span>
                          <Link to="/privacy" className="block text-white hover:text-[#74D4FB] transition-colors">Privacy Model</Link>
                          <a href="mailto:hello@metrixa.ai" className="block text-white hover:text-[#74D4FB] transition-colors">Contact</a>
                       </div>
                       <div className="space-y-6">
                          <span className="text-[11px] uppercase tracking-[0.4em] text-white/20 block mb-4">Social</span>
                          <a href="https://x.com" className="block text-white hover:text-[#74D4FB] transition-colors">X</a>
                          <a href="https://linkedin.com" className="block text-white hover:text-[#74D4FB] transition-colors">LinkedIn</a>
                       </div>
                       <div className="space-y-6">
                          <span className="text-[11px] uppercase tracking-[0.4em] text-white/20 block mb-4">Legal</span>
                          <span className="block text-white/40">Terms of Use</span>
                          <span className="block text-white/40">©2026 METRIXA</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.5em] text-white/10 mt-8">
                    <span>Optimized for Apple Silicon</span>
                    <span>Sovereign Intelligence Unit</span>
                 </div>
              </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    body {
                        font-family: 'Inter', sans-serif;
                        background-color: white;
                    }
                    h1, h2, h3, h4 { letter-spacing: -0.05em; }
                `
            }} />
        </div>
    );
};

export default Privacy;
