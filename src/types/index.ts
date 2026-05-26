export interface Word {
  id: string;
  user_id: string;
  word: string;
  meaning: string;
  example?: string;
  source?: string;
  language: string;
  created_at: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_reviewed?: string;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  last_open_date: string;
  longest_streak: number;
}

export interface UserProfile {
  id: string;
  email?: string;
}

export interface StatsData {
  totalWords: number;
  wordsThisWeek: number;
  dueForReview: number;
  currentStreak: number;
  weeklyGoal: number;
}

export type LanguageCode = "ko" | "ja" | "zh" | "other";

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "ko", label: "Korean" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Mandarin" },
  { code: "other", label: "Other" },
];

export interface ReviewSessionState {
  cards: Word[];
  currentIndex: number;
  isFlipped: boolean;
  isComplete: boolean;
  results: ReviewResult[];
}

export interface ReviewResult {
  wordId: string;
  quality: number;
  word: string;
}
