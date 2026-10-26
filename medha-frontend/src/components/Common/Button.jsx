import React from "react";
import { motion } from "framer-motion";
import { Button as ShadcnButton, buttonVariants } from "@/components/UI/button";
import { cn } from "@/lib/utils";

/**
 * Backward-compatible Button wrapper around shadcn Button.
 * Maps legacy variant names (primary, danger, success, gradient) to shadcn variants.
 * Keeps framer-motion animations for interactive feedback.
 */

const variantMap = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  danger: "destructive",
  success: "default",
  gradient: "default",
};

const sizeMap = {
  sm: "sm",
  md: "default",
  lg: "lg",
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  className = "",
  fullWidth = false,
  type = "button",
  ...props
}) => {
  const mappedVariant = variantMap[variant] || "default";
  const mappedSize = sizeMap[size] || "default";

  // Extra styles for non-standard variants
  const extraStyles = cn(
    variant === "success" && "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20",
    variant === "gradient" && "bg-gradient-to-r from-primary to-[var(--accent-secondary)] text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90",
    variant === "danger" && "shadow-lg shadow-destructive/20",
    fullWidth && "w-full",
  );

  return (
    <motion.div
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={fullWidth ? "w-full" : "inline-block"}
    >
      <ShadcnButton
        type={type}
        variant={mappedVariant}
        size={mappedSize}
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          "font-bold tracking-tight cursor-pointer",
          extraStyles,
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
      </ShadcnButton>
    </motion.div>
  );
};

export default Button;
// Also export the raw shadcn Button for direct usage in new code
export { ShadcnButton, buttonVariants };
