import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Shield, ArrowRight, Zap, Cpu, Terminal, ChevronLeft, ChevronRight, ArrowUp, Plus, Minus } from 'lucide-react';
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

const AnimatedTestimonials = ({ testimonials, autoplay = true }) => {
    const [active, setActive] = useState(0);

    const handleNext = () => {
        setActive((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const isActive = (index) => {
        return index === active;
    };

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoplay, active]);

    const randomRotateY = () => {
        return Math.floor(Math.random() * 21) - 10;
    };

    return (
        <div className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-20">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
                <div>
                    <div className="relative h-80 w-full">
                        <AnimatePresence>
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.src}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: -100,
                                        rotate: randomRotateY(),
                                    }}
                                    animate={{
                                        opacity: isActive(index) ? 1 : 0.7,
                                        scale: isActive(index) ? 1 : 0.95,
                                        z: isActive(index) ? 0 : -100,
                                        rotate: isActive(index) ? 0 : randomRotateY(),
                                        zIndex: isActive(index)
                                            ? 999
                                            : testimonials.length + 2 - index,
                                        y: isActive(index) ? [0, -80, 0] : 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: 100,
                                        rotate: randomRotateY(),
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: 'easeInOut',
                                    }}
                                    className="absolute inset-0 origin-bottom"
                                >
                                    <img
                                        src={testimonial.src}
                                        alt={testimonial.name}
                                        width={500}
                                        height={500}
                                        draggable={false}
                                        className="h-full w-full rounded-3xl object-cover object-center"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex justify-between flex-col py-4">
                    <motion.div
                        key={active}
                        initial={{
                            y: 20,
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        exit={{
                            y: -20,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: 'easeInOut',
                        }}
                    >
                        <h3 className="text-2xl font-bold text-slate-100">
                            {testimonials[active].name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-2">
                            {testimonials[active].designation}
                        </p>
                        <motion.p className="text-lg text-slate-300 mt-8 leading-relaxed">
                            {testimonials[active].quote.split(' ').map((word, index) => (
                                <motion.span
                                    key={index}
                                    initial={{
                                        filter: 'blur(10px)',
                                        opacity: 0,
                                        y: 5,
                                    }}
                                    animate={{
                                        filter: 'blur(0px)',
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        ease: 'easeInOut',
                                        delay: 0.02 * index,
                                    }}
                                    className="inline-block"
                                >
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                        </motion.p>
                    </motion.div>
                    <div className="flex gap-4 pt-12 md:pt-0">
                        <button
                            onClick={handlePrev}
                            className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group/button hover:bg-[#C4F582] transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5 text-slate-200 group-hover/button:text-slate-900 transition-colors" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group/button hover:bg-[#C4F582] transition-colors"
                        >
                            <ChevronRight className="h-5 w-5 text-slate-200 group-hover/button:text-slate-900 transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// FAQ Component
const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10 py-6">
            <button
                className="flex items-center justify-between w-full text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="text-xl font-medium text-slate-200 group-hover:text-white transition-colors">{question}</h4>
                <div className="ml-4 flex-shrink-0 text-slate-400">
                    {isOpen ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pt-4 text-slate-400 leading-relaxed font-light">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const Landing = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const downloadUrl = "https://github.com/KishuSInha/Metrixa-AI/releases/download/v0.1.1/Metrixa.AI-0.1.1-arm64.dmg";

    const faqs = [
        {
            question: "Does Metrixa AI send my screen data to the cloud?",
            answer: "No. Metrixa operates within a strictly defined hardware boundary. Your screen data is processed in-memory using localized VLM models and discarded post-inference—never persisting, never leaking."
        },
        {
            question: "Which apps are supported?",
            answer: "Metrixa works out-of-the-box with any application you can see on your screen. Because it navigates using vision context (OCR and element detection) rather than specific APIs, it naturally scales to browsers, design tools, terminals, and legacy software."
        },
        {
            question: "Is it available on Windows or Linux?",
            answer: "Currently, Metrixa is heavily optimized for macOS (Apple Silicon arm64) to take full advantage of native Neural Engine execution. Windows and Linux support are on the roadmap for late 2026."
        },
        {
            question: "Do I need a paid API key from OpenAI or Anthropic?",
            answer: "No external API calls are required for core decision-making pipelines. Metrixa relies on Zero-Cloud inference using models running locally on your hardware."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans antialiased overflow-x-hidden selection:bg-[#C4F582] selection:text-[#050505]">

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/95 backdrop-blur-md shadow-sm py-4 border-b border-white/5' : 'bg-transparent py-6'
                }`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                            <Logo className="h-8 w-8 text-white" />
                            <span className="text-xl font-bold tracking-tight text-white uppercase">Metrixa AI</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            <a href="#engine" className="hover:text-white transition-colors">Engine</a>
                            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
                            <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
                            <a href="#sovereign-node" className="hover:text-white transition-colors">Sovereign Node</a>
                        </div>
                    </div>

                    <Link
                        to="/documentation"
                        className="group flex items-center gap-2 bg-white/10 text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <span>Deep Dive</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section
                className="relative min-h-screen flex items-center px-6 md:px-12 overflow-hidden bg-slate-900"
            >
                {/* Local Background Asset */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `url('/bg1.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'contrast(1.2) brightness(0.7)'
                    }}
                />

                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/40 to-transparent"></div>

                <div className="relative z-10 max-w-5xl mx-auto pt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >

                        <h1 className="text-6xl md:text-[7rem] font-bold text-white mb-8 leading-[0.9] tracking-tighter">
                            Put AI to work across every Mac app.
                        </h1>

                        <p className="mx-auto text-xl md:text-2xl text-white/50 mb-12 font-light max-w-3xl leading-relaxed">
                            Metrixa uses local vision to control your native software. No APIs, no plugins—just instant, sovereign automation across your entire workspace.
                        </p>

                        <div className="flex flex-col items-start gap-4">
                            <a
                                href={downloadUrl}
                                download
                                className="inline-flex flex-col items-center justify-center gap-1 bg-[#C4F582] text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#B4E572] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(196,245,130,0.15)] min-w-[280px]"
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

            {/* Engineered Feature 1: All your apps */}
            <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl w-full p-12 md:p-20 flex flex-col md:flex-row gap-20 items-center overflow-hidden relative shadow-2xl">
                    <div className="w-full md:w-1/3 relative z-10">
                        <div className="inline-block px-3 py-1 bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded mb-6 backdrop-blur-md">Universal Access</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                            All your apps. One Metrixa.
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed font-light">
                            Metrixa works across 30+ apps out of the box. It writes code, builds tools, moves data between apps, and extends itself when it needs to learn something new. If you can do it on your computer, Metrixa can too.
                        </p>
                    </div>

                    <div className="w-full md:w-2/3 max-w-4xl h-[400px] bg-slate-900/50 rounded-2xl relative flex items-center justify-center border border-white/10 backdrop-blur-xl">
                        {/* Abstract graphical representation of apps */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 via-transparent to-transparent"></div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="absolute bottom-12 flex items-center justify-center w-full z-20"
                        >
                            <div className="bg-[#1a1a1a] border border-white/10 rounded-full px-6 py-4 shadow-2xl flex items-center gap-4 w-[400px] backdrop-blur-md">
                                <span className="flex-1 text-sm text-slate-300 font-medium font-mono">"Pull last week's meeting notes. Create a to-do list."</span>
                                <div className="w-8 h-8 rounded-full bg-[#C4F582] flex items-center justify-center flex-shrink-0">
                                    <ArrowUp className="w-4 h-4 text-slate-900" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Engineered Feature 2: Photographic memory */}
            <section className="pb-32 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl w-full p-12 md:p-20 flex flex-col-reverse md:flex-row gap-20 items-center overflow-hidden relative shadow-2xl">
                    <div className="w-full md:w-2/3 max-w-4xl h-[400px] bg-slate-900/50 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-white/10 backdrop-blur-xl">

                        {/* Mock UI Background */}
                        <div className="absolute left-10 top-16 w-[60%] h-[70%] bg-[#1a1a1a] rounded-xl p-10 border border-white/10 shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">Launch Plan — Q3</h3>
                            <ul className="space-y-4 text-slate-400 text-sm font-mono">
                                <li className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-[#C4F582]/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-[#C4F582]"></div></div> Finalize auth logic</li>
                                <li className="flex items-center gap-3"><div className="w-4 h-4 rounded border border-slate-600"></div> Optimize local inference</li>
                                <li className="flex items-center gap-3"><div className="w-4 h-4 rounded border border-slate-600"></div> Ship v1.0.0</li>
                            </ul>
                        </div>

                        {/* Mock Chat Input */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="absolute right-10 bottom-12 bg-[#222222] border border-white/10 rounded-2xl w-[350px] shadow-2xl flex flex-col pt-8"
                        >
                            <div className="flex-1 flex items-end justify-end p-6 pb-2">
                                <div className="bg-[#C4F582] text-slate-900 px-4 py-3 rounded-2xl rounded-br-sm text-sm font-medium">
                                    Revise these tasks based on my latest slack thread.
                                </div>
                            </div>
                            <div className="p-4 pt-2 flex justify-end">
                                <div className="text-[10px] text-slate-500 font-mono uppercase">Analyzing Context...</div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="w-full md:w-1/3 relative z-10">
                        <div className="inline-block px-3 py-1 bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded mb-6 backdrop-blur-md">Persistent Context</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Photographic memory.<br />Zero Effort.
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed font-light">
                            Metrixa remembers everything you've worked on, talked about, and saved across your apps. It keeps context, tracks patterns, and gets better the longer you use it. Nothing to re-explain.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sovereign Node Section */}
            <section id="sovereign-node" className="py-24 px-6 md:px-12 bg-[#0a0a0a] border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-end mb-24">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-[0.9] text-white">
                                Sovereign Intelligence. <br />
                                <span className="text-slate-600">Localized Privacy.</span>
                            </h2>
                        </div>
                        <p className="text-xl text-slate-400 max-w-xl pb-2 leading-relaxed font-light">
                            Metrixa operates within a strictly defined hardware boundary. Your screen data is processed in-memory and discarded post-inference—never persisting, never leaking.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Encapsulation */}
                        <div className="bg-[#111] p-12 rounded-3xl border border-white/5 hover:bg-[#151515] hover:border-white/10 transition-all duration-500">
                            <Terminal className="w-8 h-8 text-slate-500 mb-8" />
                            <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">Zero-Cloud Inference</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Autonomous logic executed entirely on local Neural Engines. No external API calls for core decision-making pipelines.
                            </p>
                        </div>

                        {/* Verification */}
                        <div className="bg-[#111] p-12 rounded-3xl border border-white/5 hover:bg-[#151515] hover:border-white/10 transition-all duration-500">
                            <Shield className="w-8 h-8 text-slate-500 mb-8" />
                            <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">E2E Integrity</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Full-spectrum encryption for local databases and IPC channels, ensuring system-level resistance to lateral data exfiltration.
                            </p>
                        </div>

                        {/* Control */}
                        <div className="bg-[#111] p-12 rounded-3xl border border-white/5 hover:bg-[#151515] hover:border-white/10 transition-all duration-500">
                            <Cpu className="w-8 h-8 text-slate-500 mb-8" />
                            <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-white">On-Device VLM</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                High-fidelity screen parsing using optimized Vision Language Models natively compiled for Apple Silicon performance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faqs" className="py-32 px-6 md:px-12 bg-[#050505]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter text-white">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-slate-400 font-light">Everything you need to know about the product and capabilities.</p>
                    </div>

                    <div className="mx-auto max-w-3xl border-t border-white/10">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 px-6 md:px-12 bg-[#0a0a0a] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-[0.9] text-white">
                            What People Are Saying
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                            Join the community of developers and teams transforming their workflow with Metrixa AI.
                        </p>
                    </div>

                    <AnimatedTestimonials testimonials={[
                        {
                            quote: "Finally, an AI agent that actually understands my Mac workflow. Metrixa automated my entire morning routine—email triage, calendar sync, and Slack updates—without me touching a single API.",
                            name: "Alex Rivera",
                            designation: "Senior DevOps Engineer at Stripe",
                            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        },
                        {
                            quote: "I was skeptical about local-only AI until I tried Metrixa. It's faster than cloud solutions and I never worry about sensitive client data leaving my machine. Game changer for legal tech.",
                            name: "Dr. Priya Sharma",
                            designation: "Founder & CEO at LegalOS",
                            src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        },
                        {
                            quote: "Metrixa handles cross-app workflows that would take me hours to script manually. It navigates Figma, exports assets, and updates our design system in Notion—all from a single prompt.",
                            name: "Jordan Lee",
                            designation: "Lead Product Designer at Notion",
                            src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        },
                        {
                            quote: "The vision-based approach is brilliant. Metrixa works with legacy enterprise software that has zero API support. It's like having a junior engineer who never gets tired of clicking through UIs.",
                            name: "Marcus Chen",
                            designation: "VP of Engineering at Databricks",
                            src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        },
                        {
                            quote: "Privacy-first automation that actually works. We're using Metrixa for internal ops at our security startup and it's passed every audit. On-device inference is the future.",
                            name: "Sofia Andersson",
                            designation: "CTO at Wiz Security",
                            src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3461&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        },
                    ]} />
                </div>
            </section>

            {/* Expanded Footer */}
            <footer className="bg-[#050505] text-slate-400 py-20 px-6 md:px-12 border-t border-white/5">
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
                    </div>
                    <p className="text-slate-600">© 2026 METRIXA AI · Powering Autonomous Intelligence</p>
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
