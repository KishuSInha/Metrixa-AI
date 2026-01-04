import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';

const Manifesto = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans antialiased overflow-x-hidden selection:bg-[#C4F582] selection:text-slate-900">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 py-6 mix-blend-difference">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Return to Base</span>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <header className="relative pt-40 pb-20 px-6 md:px-12 border-b border-white/10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[#C4F582] text-[10px] font-bold uppercase tracking-widest mb-8">
                            <Terminal className="w-3 h-3" />
                            <span>System Manifesto v1.0</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-none">
                            Protocol <br />
                            <span className="text-white/20">Sovereignty.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl leading-relaxed">
                            We are building the agentic layer for a post-cloud world. Where intelligence is local, privacy is absolute, and execution is native.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Content */}
            <main className="px-6 md:px-12 py-20">
                <div className="max-w-4xl mx-auto space-y-32">

                    {/* Section 1 */}
                    <motion.section
                        className="grid md:grid-cols-[200px_1fr] gap-10"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-xs font-mono text-[#C4F582] uppercase tracking-widest sticky top-32 h-fit">01 // The Axiom</div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold tracking-tight">Intelligence Must Be Local.</h2>
                            <p className="text-lg text-white/50 leading-relaxed">
                                The current AI paradigm relies on shipping user context to centralized inference clusters. This is fundamentally insecure and inherently latent. Metrixa posits that for an AI agent to be truly useful, it must live where the work happens: on the metal.
                            </p>
                            <p className="text-lg text-white/50 leading-relaxed">
                                By optimizing Vision Language Models for Apple Silicon's Neural Engine, we achieve high-fidelity screen understanding without a single pixel leaving your device's memory buffer.
                            </p>
                        </div>
                    </motion.section>

                    {/* Section 2 */}
                    <motion.section
                        className="grid md:grid-cols-[200px_1fr] gap-10"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-xs font-mono text-[#C4F582] uppercase tracking-widest sticky top-32 h-fit">02 // The Method</div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold tracking-tight">Agents That Act, Not Just Suggest.</h2>
                            <p className="text-lg text-white/50 leading-relaxed">
                                Chat interfaces are a skeuomorphic bridge. The future is not talking to a bot—it's having a silent partner that manipulates the GUI alongside you. Metrixa bypasses the limitations of API integrations by seeing what you see and clicking what you click.
                            </p>
                        </div>
                    </motion.section>

                    {/* Section 3 */}
                    <motion.section
                        className="grid md:grid-cols-[200px_1fr] gap-10"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-xs font-mono text-[#C4F582] uppercase tracking-widest sticky top-32 h-fit">03 // The Promise</div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold tracking-tight">Total Digital Sovereignty.</h2>
                            <p className="text-lg text-white/50 leading-relaxed">
                                Your data is your property. Metrixa is designed with an "air-gap by default" architecture. We don't train on your usage. We don't store your logs. We build the tools that empower you to orchestrate your digital environment without compromise.
                            </p>
                        </div>
                    </motion.section>

                </div>
            </main>

            <footer className="py-20 border-t border-white/5 px-6 md:px-12">
                <div className="max-w-4xl mx-auto text-center">
                    <Link to="/" className="text-sm font-bold uppercase tracking-widest text-white/30 hover:text-[#C4F582] transition-colors">
                        Initialize Metrixa AI
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default Manifesto;
