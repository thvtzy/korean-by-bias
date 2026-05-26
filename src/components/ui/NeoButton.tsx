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
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-6 py-3 text-sm rounded-xl",
      lg: "px-8 py-4 text-base rounded-xl",
    };

    const variantClasses = {
      default:
        "bg-gradient-to-r from-accent-pink to-accent-purple text-white font-semibold shadow-neo-sm border-2 border-neo-black hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95",
      ghost:
        "bg-transparent text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent",
      outline:
        "bg-transparent text-white border-2 border-white/20 hover:border-accent-pink/50 hover:text-accent-pink",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium",
          "transition-all duration-200",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-neo-sm disabled:hover:translate-x-0 disabled:hover:translate-y-0",
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
