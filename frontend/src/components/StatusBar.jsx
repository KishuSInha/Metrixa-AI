import { motion } from 'framer-motion';

const StatusBar = () => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-[#C4F582] text-slate-900 text-[10px] font-bold font-mono py-1 px-4 flex justify-between items-center z-[60] relative"
        >
            <div className="flex gap-4">
                <span>SYSTEM_STATUS :: <span className="text-emerald-800">ONLINE</span></span>
                <span className="hidden sm:inline">VERSION :: 0.1.1-stable</span>
            </div>
            <div className="flex gap-4">
                <span className="hidden sm:inline">NEURAL_ENGINE :: OPTIMIZED</span>
                <span>UPTIME :: 99.9%</span>
            </div>
        </motion.div>
    );
};

export default StatusBar;
