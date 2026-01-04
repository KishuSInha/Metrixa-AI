import { Check, X } from 'lucide-react';

const ComparisonTable = () => {
    const features = [
        { name: "Inference Latency", cloud: "2-5s (Network)", metrixa: "<100ms (Native)" },
        { name: "Data Privacy", cloud: "Cloud Storage", metrixa: "100% Local-only" },
        { name: "Context Window", cloud: "Limited (Tokens)", metrixa: "Infinite (Screen)" },
        { name: "GUI Control", cloud: "Browser Only", metrixa: "System-wide (Any App)" },
        { name: "Cost Model", cloud: "Per Token API", metrixa: "One-time Purchase" },
    ];

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-200">
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-400">Feature</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-400">Cloud Agents</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#C4F582] bg-slate-900">Metrixa AI</th>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature, index) => (
                        <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6 font-medium text-slate-900">{feature.name}</td>
                            <td className="py-4 px-6 text-slate-500">{feature.cloud}</td>
                            <td className="py-4 px-6 font-bold text-slate-900 bg-slate-900/5">{feature.metrixa}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComparisonTable;
