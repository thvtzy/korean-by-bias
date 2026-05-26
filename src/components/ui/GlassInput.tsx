import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-white/60">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-white/[0.03] backdrop-blur-sm border border-border-glass rounded-xl",
            "text-white placeholder:text-white/20",
            "transition-all duration-200",
            "focus:outline-none focus:border-accent-pink/50 focus:ring-1 focus:ring-accent-pink/20 focus:bg-white/[0.05]",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-white/60">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-white/[0.03] backdrop-blur-sm border border-border-glass rounded-xl",
            "text-white placeholder:text-white/20 resize-none",
            "transition-all duration-200",
            "focus:outline-none focus:border-accent-pink/50 focus:ring-1 focus:ring-accent-pink/20 focus:bg-white/[0.05]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

GlassTextarea.displayName = "GlassTextarea";

interface GlassSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-white/60">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-white/[0.03] backdrop-blur-sm border border-border-glass rounded-xl",
            "text-white appearance-none cursor-pointer",
            "transition-all duration-200",
            "focus:outline-none focus:border-accent-pink/50 focus:ring-1 focus:ring-accent-pink/20",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-bg-elevated">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

GlassSelect.displayName = "GlassSelect";

export { GlassInput, GlassTextarea, GlassSelect };
