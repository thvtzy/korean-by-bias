"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
}

interface ToastContextType {
  addToast: (message: string, undoLabel?: string, onUndo?: () => void) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, undoLabel?: string, onUndo?: () => void) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, undoLabel, onUndo }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "bg-white border border-border-soft rounded-xl px-4 py-3",
                "shadow-soft-lg flex items-center gap-3"
              )}
            >
              <p className="text-sm text-text-primary flex-1">{toast.message}</p>
              {toast.undoLabel && toast.onUndo && (
                <button
                  onClick={() => {
                    toast.onUndo?.();
                    removeToast(toast.id);
                  }}
                  className="text-sm font-semibold text-accent-pink hover:text-accent-lavender transition-colors shrink-0"
                >
                  {toast.undoLabel}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-muted/50 hover:text-text-muted transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
