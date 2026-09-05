"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MotionSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Lightweight client animation wrapper for individual profile sections.
 * Allows inner sections to remain Server Components while receiving
 * smooth, non-distracting staggered entrance animations.
 */
export function MotionSection({
  children,
  delay = 0,
  className = "",
}: MotionSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
