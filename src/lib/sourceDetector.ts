export type SourceCategory = "song" | "drama" | "live" | "other";

export function detectCategory(source: string): SourceCategory {
  const lower = source.toLowerCase();
  if (/song|track|album|mv|music|ost|title|lyric|노래|음악/i.test(lower)) return "song";
  if (/drama|variety|show|episode|weverse|vlive|running|man|방탄|예능|드라마|런닝맨/i.test(lower)) return "drama";
  if (/live|stream|concert|팬미팅|무대|공연/i.test(lower)) return "live";
  return "other";
}

export const SOURCE_STICKERS: Record<SourceCategory, { emoji: string; label: string }> = {
  song: { emoji: "🎵", label: "Song" },
  drama: { emoji: "📺", label: "Show" },
  live: { emoji: "💬", label: "Live" },
  other: { emoji: "💜", label: "Other" },
};

export const SOURCE_COLORS: Record<SourceCategory, string> = {
  song: "bg-sleeve-song",
  drama: "bg-sleeve-drama",
  live: "bg-sleeve-live",
  other: "bg-sleeve-other",
};
