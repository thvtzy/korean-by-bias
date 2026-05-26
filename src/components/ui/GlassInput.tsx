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
          <label className="block text-xs font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-bg border border-border-soft rounded-xl",
            "text-text-primary placeholder:text-text-muted/50 text-sm",
            "transition-all duration-200",
            "focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/15",
            error && "border-red-300 focus:border-red-400 focus:ring-red-200",
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
          <label className="block text-xs font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-bg border border-border-soft rounded-xl",
            "text-text-primary placeholder:text-text-muted/50 text-sm resize-none",
            "transition-all duration-200",
            "focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/15",
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
          <label className="block text-xs font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-bg border border-border-soft rounded-xl",
            "text-text-primary text-sm appearance-none cursor-pointer",
            "transition-all duration-200",
            "focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/15",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
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
