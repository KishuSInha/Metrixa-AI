import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingTerminal = () => {
    const [text, setText] = useState('');
    const fullText = `> metrixa --active-task
> Analyzing current workspace context...
> Detected: VS Code (Debugging), Terminal (Server Log)
> Action: Cross-referencing error logs with stack trace.
> Suggestion: Memory leak in 'worker_threads' detected.
> Executing fix...
> Status: RESOLVED.`;

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 30); // Typing speed

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#1e1e1e] rounded-xl p-6 font-mono text-xs md:text-sm text-gray-300 shadow-2xl border border-white/10 w-full h-full min-h-[300px] overflow-hidden relative">
            <div className="flex gap-2 mb-4 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="whitespace-pre-wrap leading-relaxed">
                {text}
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-[#C4F582] ml-1 align-middle"
                />
            </div>
        </div>
    );
};

export default TypingTerminal;
