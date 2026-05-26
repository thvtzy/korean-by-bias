"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { SmartWordInput } from "./SmartWordInput";
import { LANGUAGES, LanguageCode } from "@/types";
import { cn } from "@/lib/utils";

interface AddWordSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    word: string;
    meaning: string;
    example: string;
    source: string;
    language: string;
  }) => Promise<void>;
}

const SOURCE_CHIPS = [
  { emoji: "🎵", label: "Song", value: "song" },
  { emoji: "📺", label: "Show", value: "drama" },
  { emoji: "💬", label: "Live", value: "live" },
  { emoji: "💜", label: "Other", value: "other" },
];

export function AddWordSheet({ isOpen, onClose, onSubmit }: AddWordSheetProps) {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [source, setSource] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("ko");
  const [showDetails, setShowDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setWord("");
      setMeaning("");
      setExample("");
      setSource("");
      setLanguage("ko");
      setShowDetails(false);
    }
  }, [isOpen]);

  const handleDetected = (w: string, m: string) => {
    setWord(w);
    setMeaning(m);
    handleSubmit(w, m);
  };

  const handleWordOnly = (w: string) => {
    setWord(w);
    setShowDetails(true);
    // Focus the meaning field after a delay
    setTimeout(() => {
      const meaningInput = document.getElementById("meaning-input");
      meaningInput?.focus();
    }, 100);
  };

  const handleSourceChip = (src: string) => {
    setSource((prev) => (prev === src ? "" : src));
  };

  const handleSubmit = async (w: string = word, m: string = meaning) => {
    if (!w.trim() || !m.trim()) return;
    setSubmitting(true);
    await onSubmit({
      word: w.trim(),
      meaning: m.trim(),
      example: example.trim(),
      source: source.trim(),
      language,
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl
                       shadow-soft-lg max-h-[80vh] overflow-y-auto px-5 pt-5 pb-8"
          >
            {/* Handle + Close */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-1 bg-border-soft rounded-full" />
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-bg text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Smart input */}
            <h2 className="font-display font-bold text-lg text-text-primary mb-3">
              Tambah kata baru ✦
            </h2>

            {!showDetails ? (
              <>
                <SmartWordInput
                  onDetected={handleDetected}
                  onWordOnly={handleWordOnly}
                />
                <p className="text-[10px] text-text-muted mt-2 px-1">
                  Ketik <code className="bg-bg px-1 py-0.5 rounded">kata = arti</code> buat langsung simpen
                </p>
              </>
            ) : (
              /* Full form */
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                    Word
                  </label>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="사랑해"
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-border-soft
                               text-text-primary placeholder:text-text-muted/50 text-sm
                               focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/15"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                    Meaning
                  </label>
                  <input
                    id="meaning-input"
                    type="text"
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    placeholder="I love you"
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-border-soft
                               text-text-primary placeholder:text-text-muted/50 text-sm
                               focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/15"
                  />
                </div>

                {/* Source chips */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-2">
                    Source
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SOURCE_CHIPS.map((chip) => (
                      <button
                        key={chip.value}
                        onClick={() => handleSourceChip(chip.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                          "border border-border-subtle",
                          source === chip.value
                            ? "bg-accent-pink/15 border-accent-pink text-accent-pink"
                            : "bg-white text-text-secondary hover:bg-bg"
                        )}
                      >
                        {chip.emoji} {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Example */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                    Example
                  </label>
                  <input
                    type="text"
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    placeholder="사랑해, 너만을"
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-border-soft
                               text-text-primary placeholder:text-text-muted/50 text-sm
                               focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/15"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                    className="w-full px-4 py-3 bg-bg rounded-xl border border-border-soft
                               text-text-primary text-sm appearance-none cursor-pointer
                               focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/15"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <button
                  onClick={() => handleSubmit()}
                  disabled={!word.trim() || !meaning.trim() || submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-accent-pink to-accent-lavender
                             text-white font-semibold text-sm rounded-xl
                             hover:opacity-90 disabled:opacity-40 transition-all active:scale-[0.98]"
                >
                  {submitting ? "Adding..." : "Simpan ✦"}
                </button>
              </div>
            )}

            {/* Toggle details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-4 flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary mx-auto transition-colors"
            >
              {showDetails ? "Quick add" : "More details"}
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
