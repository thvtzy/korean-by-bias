import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = "default", size = "md", loading, children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs rounded-xl",
      md: "px-6 py-3 text-sm rounded-xl",
      lg: "px-8 py-4 text-sm rounded-2xl",
    };

    const variantClasses = {
      default:
        "bg-gradient-to-r from-accent-pink to-accent-lavender text-white font-semibold hover:opacity-90 active:scale-[0.98]",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg",
      outline:
        "bg-transparent text-text-primary border border-border-soft hover:border-accent-pink/50 hover:text-accent-pink",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold",
          "transition-all duration-200",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

NeoButton.displayName = "NeoButton";
export { NeoButton };
