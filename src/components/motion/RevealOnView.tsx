import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right" | "scale";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  duration?: number;
  once?: boolean;
};

const getInitial = (direction: Direction, prefersReduced: boolean | null) => {
  if (prefersReduced) return { opacity: 0 };
  switch (direction) {
    case "up":    return { opacity: 0, y: 32 };
    case "down":  return { opacity: 0, y: -24 };
    case "left":  return { opacity: 0, x: -36 };
    case "right": return { opacity: 0, x: 36 };
    case "scale": return { opacity: 0, scale: 0.9 };
    default:      return { opacity: 0, y: 32 };
  }
};

export function RevealOnView({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.7,
  once = true,
}: Props) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={getInitial(direction, prefersReduced)}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: prefersReduced ? 0.01 : duration,
        delay: prefersReduced ? 0 : delay,
        ease: EASE_OUT_EXPO,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
