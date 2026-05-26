"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { GlassInput, GlassTextarea, GlassSelect } from "@/components/ui/GlassInput";
import { NeoButton } from "@/components/ui/NeoButton";
import { LANGUAGES, LanguageCode } from "@/types";

interface WordFormProps {
  onSubmit: (word: { word: string; meaning: string; example: string; source: string; language: string }) => Promise<unknown>;
  onCancel?: () => void;
}

export function WordForm({ onSubmit, onCancel }: WordFormProps) {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [source, setSource] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("ko");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setWord("");
    setMeaning("");
    setExample("");
    setSource("");
    setLanguage("ko");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) return;

    setSubmitting(true);
    await onSubmit({ word: word.trim(), meaning: meaning.trim(), example, source, language });
    setSubmitting(false);
    reset();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassInput
          label="Word *"
          placeholder="사랑해"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          autoFocus
        />
        <GlassInput
          label="Meaning *"
          placeholder="I love you"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
        />
      </div>

      <GlassTextarea
        label="Example sentence"
        placeholder='사랑해, 너만을...'
        value={example}
        onChange={(e) => setExample(e.target.value)}
        rows={2}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassInput
          label="Source"
          placeholder="BTS — I Need U"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <GlassSelect
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <NeoButton type="submit" loading={submitting} disabled={!word.trim() || !meaning.trim()}>
          <Plus size={18} />
          Add Word
        </NeoButton>
        {onCancel && (
          <NeoButton type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </NeoButton>
        )}
        <span className="ml-auto text-[10px] text-white/25">
          Ctrl+Enter to submit
        </span>
      </div>
    </motion.form>
  );
}
