import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400); // Short delay before unmounting
          return 100;
        }
        // Random increment for a more realistic loading feel
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -40,
        filter: "blur(10px)",
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center justify-center z-10 w-full max-w-md px-8">
        {/* Animated Glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute w-48 h-48 bg-primary/20 rounded-full blur-[80px]"
        />
        
        {/* Brand Text */}
        <div className="overflow-hidden mb-12">
          <motion.h1 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-foreground relative z-10 uppercase flex items-center"
          >
            GEN<span className="text-primary text-gradient-red ml-2">-</span>Z
          </motion.h1>
        </div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-center gap-4 w-full"
        >
          <div className="h-[2px] w-full bg-border rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-primary glow-red"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between w-full text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              System Initialization
            </motion.span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </motion.div>
      </div>
      
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')", opacity: 0.15 }} />
    </motion.div>
  );
};
