import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800); // Slightly longer delay to show 100% and finish spin
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05,
        filter: "blur(10px)",
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        
        {/* Outer Circle (Slow Spin, Counter Clockwise) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full border border-white/10 border-t-white/40 border-l-white/20"
        />

        {/* Inner Circle (Fast Spin, Clockwise) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] rounded-full border border-white/5 border-b-white text-white/50 border-r-white/30"
        />

        {/* Central Logo */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <motion.img 
            src="/logo.png"
            alt="GEN-Z Logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="w-24 sm:w-32 md:w-40 object-contain select-none"
          />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute -bottom-8 text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/50 font-light"
          >
            {Math.min(progress, 100).toString().padStart(3, '0')}%
          </motion.div>
        </div>
      </div>
      
      {/* Subtle Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} 
      />
    </motion.div>
  );
};
