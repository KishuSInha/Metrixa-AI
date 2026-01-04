import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Book, Command, Download, Settings, Zap, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group mt-4 mb-6">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-md text-white/70 hover:text-white transition-colors"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <pre className="bg-[#1E1E1E] text-slate-300 p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed border border-slate-800 shadow-xl">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const Documentation = () => {
    const location = useLocation();

    // Smooth scroll handler
    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
                    </Link>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Book className="w-4 h-4 text-slate-400" />
                        <span>Metrixa<span className="text-slate-400">Docs</span></span>
                    </div>
                </div>
            </nav>

            <div className="pt-32 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16">

                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-32 h-fit mb-12 md:mb-0">
                    <nav className="space-y-10">
                        <div>
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Getting Started</h4>
                            <ul className="space-y-1">
                                <li>
                                    <a href="#installation" className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border-l-2 border-transparent hover:border-[#C4F582]">Installation</a>
                                </li>
                                <li>
                                    <a href="#setup" className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border-l-2 border-transparent hover:border-[#C4F582]">Initial Setup</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Core Concepts</h4>
                            <ul className="space-y-1">
                                <li>
                                    <a href="#analysis" className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border-l-2 border-transparent hover:border-[#C4F582]">Screen Analysis</a>
                                </li>
                                <li>
                                    <a href="#hotkeys" className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border-l-2 border-transparent hover:border-[#C4F582]">Global Hotkeys</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 pb-32 min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Documentation</h1>
                        <p className="text-xl text-slate-500 mb-16 leading-relaxed max-w-2xl">
                            Everything you need to install, configure, and master the Metrixa AI agentic environment.
                        </p>

                        <div className="space-y-24">

                            {/* Installation */}
                            <section id="installation" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#C4F582] flex items-center justify-center shadow-lg shadow-[#C4F582]/20">
                                        <Download className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Installation</h2>
                                </div>
                                <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                                    <p>Metrixa AI is distributed as a signed Apple Disk Image (<code>.dmg</code>) natively optimized for Apple Silicon (M1/M2/M3) chips.</p>

                                    <div className="my-8 pl-6 border-l-4 border-slate-200">
                                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">System Requirements</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm">
                                            <li>macOS Sonoma 14.0 or later</li>
                                            <li>Apple Silicon (M1/M2/M3/M4)</li>
                                            <li>8GB Unified Memory (16GB recommended)</li>
                                        </ul>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Quick Start</h3>
                                    <p>Download the latest stable release via terminal or browser:</p>

                                    <CodeBlock code={`# Homebrew Cask (Coming Soon)
brew install --cask metrixa-ai

# Direct Download
curl -L https://metrixa.ai/download/latest -o Metrixa.dmg`} />

                                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 flex gap-4 mt-8">
                                        <div className="shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-amber-900 text-sm mb-1">Public Beta Notice</h5>
                                            <p className="text-xs text-amber-800/80 leading-relaxed">
                                                You may need to allow the application in <strong>System Settings &gt; Privacy & Security</strong> if macOS Gatekeeper flags the developer signature during the beta period.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Setup */}
                            <section id="setup" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                                        <Settings className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Initial Setup</h2>
                                </div>
                                <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                                    <p>Metrixa operates by "watching" your screen and "acting" as a user. This requires specific macOS permissions.</p>

                                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                                        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-[#C4F582] transition-colors">
                                            <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                Screen Recording
                                            </div>
                                            <p className="text-sm text-slate-500">Required for the Vision Model to analyze UI elements and text on your screen.</p>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-[#C4F582] transition-colors">
                                            <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                Accessibility
                                            </div>
                                            <p className="text-sm text-slate-500">Required for generating synthetic mouse clicks and keystrokes to execute tasks.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Hotkeys */}
                            <section id="hotkeys" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#C4F582]/20 flex items-center justify-center border border-[#C4F582]">
                                        <Command className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Global Hotkeys</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
                                        <div>
                                            <div className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Summon Assistant</div>
                                            <p className="text-sm text-slate-500 max-w-md">Instantly opens the analysis panel over your active window, ready for voice or text commands.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <kbd className="px-3 py-2 bg-slate-100 rounded-lg font-mono font-bold text-slate-700 border-b-2 border-slate-300">⌘</kbd>
                                            <kbd className="px-3 py-2 bg-slate-100 rounded-lg font-mono font-bold text-slate-700 border-b-2 border-slate-300">K</kbd>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
                                        <div>
                                            <div className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Panic / Cancel</div>
                                            <p className="text-sm text-slate-500 max-w-md">Immediately halts any active agentic loop and releases control of your mouse/keyboard.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <kbd className="px-3 py-2 bg-slate-100 rounded-lg font-mono font-bold text-slate-700 border-b-2 border-slate-300">Esc</kbd>
                                            <kbd className="px-3 py-2 bg-slate-100 rounded-lg font-mono font-bold text-slate-700 border-b-2 border-slate-300">Esc</kbd>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Documentation;
