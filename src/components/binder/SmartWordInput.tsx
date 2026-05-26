"use client";

import { useState, useRef } from "react";

interface SmartWordInputProps {
  onDetected: (word: string, meaning: string) => void;
  onWordOnly: (word: string) => void;
}

const SEPARATORS = /[=—:\-–]+/;

export function SmartWordInput({ onDetected, onWordOnly }: SmartWordInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const parts = trimmed.split(SEPARATORS, 2);
    const word = parts[0]?.trim();
    const meaning = parts[1]?.trim();

    if (word && meaning) {
      onDetected(word, meaning);
    } else if (word) {
      onWordOnly(word);
    }

    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder='사랑해 = I love you'
        className="flex-1 px-4 py-3 bg-bg rounded-xl border border-border-soft
                   text-text-primary placeholder:text-text-muted/50
                   focus:outline-none focus:border-accent-pink focus:ring-2 focus:ring-accent-pink/15
                   transition-all text-sm"
        autoFocus
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="px-4 py-3 bg-gradient-to-r from-accent-pink to-accent-lavender
                   text-white font-semibold text-sm rounded-xl
                   hover:opacity-90 disabled:opacity-40 transition-all active:scale-95 shrink-0"
      >
        Add
      </button>
    </div>
  );
}

export function parseSmartInput(input: string): {
  word: string;
  meaning: string | null;
} | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(SEPARATORS, 2);
  const word = parts[0]?.trim();
  const meaning = parts[1]?.trim();

  if (word) {
    return { word, meaning: meaning || null };
  }
  return null;
}
