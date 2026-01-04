import { motion } from 'framer-motion';

const BoundingBoxOverlay = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Moving scanner line */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-[#C4F582]/50 shadow-[0_0_20px_#C4F582] z-20"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            />

            {/* Simulated detected elements */}
            <motion.div
                className="absolute border-2 border-[#C4F582]/30 bg-[#C4F582]/5 rounded top-[20%] left-[10%] w-[15%] h-[8%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
                <div className="absolute -top-4 left-0 text-[8px] font-mono text-[#C4F582] bg-slate-900 px-1">BTN_SUBMIT</div>
            </motion.div>

            <motion.div
                className="absolute border-2 border-[#C4F582]/30 bg-[#C4F582]/5 rounded bottom-[30%] right-[20%] w-[25%] h-[40%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            >
                <div className="absolute -top-4 left-0 text-[8px] font-mono text-[#C4F582] bg-slate-900 px-1">TXT_EDITOR_MAIN</div>
            </motion.div>
        </div>
    );
};

export default BoundingBoxOverlay;
