import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, FileText } from 'lucide-react';

const Legal = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8 md:p-20">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-12">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Return to Base</span>
            </Link>

            <div className="max-w-3xl mx-auto space-y-20">
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <Shield className="w-8 h-8 text-slate-900" />
                        <h1 className="text-4xl font-bold">Legal & Privacy</h1>
                    </div>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Metrixa AI is designed with a "Local-First" architecture. We do not collect, store, or transmit your screen data, keystrokes, or personal information to any cloud servers.
                    </p>
                </section>

                <div className="grid gap-12">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-emerald-600">
                            <Lock className="w-5 h-5" />
                            <h3 className="font-bold uppercase tracking-widest text-xs">Privacy Policy</h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            All "Vision" processing happens on your device's Neural Engine. No images leave your machine.
                            We collect anonymous usage telemetry (app crashes, feature usage) via Vercel Analytics to improve the product, which you can opt-out of in Settings.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-slate-900">
                            <FileText className="w-5 h-5" />
                            <h3 className="font-bold uppercase tracking-widest text-xs">Terms of Service</h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            By downloading and using Metrixa AI, you agree that you are responsible for the actions the Agent performs on your behalf.
                            The software is provided "as is" without warranty of any kind.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Legal;
