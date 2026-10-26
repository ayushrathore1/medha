import React from "react";
import { motion } from "framer-motion";
import { Card as ShadcnCard, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/UI/card";
import { cn } from "@/lib/utils";

/**
 * Backward-compatible Card wrapper around shadcn Card.
 * Keeps framer-motion animations and glass-card styling.
 */
const Card = ({ children, className = "", hoverEffect = true, noPadding = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={
        hoverEffect
          ? {
              y: -4,
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
            }
          : {}
      }
    >
      <ShadcnCard
        className={cn(
          "glass-card overflow-hidden text-[var(--text-primary)] border-[var(--border-default)]",
          noPadding ? "py-0" : "",
          className
        )}
        {...props}
      >
        {noPadding ? children : <CardContent className="p-6">{children}</CardContent>}
      </ShadcnCard>
    </motion.div>
  );
};

export default Card;
// Re-export shadcn Card parts for new code
export { ShadcnCard, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
