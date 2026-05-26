export function calculateStreak(
  lastOpenDate: string | null,
  currentStreak: number,
  longestStreak: number
): { currentStreak: number; longestStreak: number; lastOpenDate: string } {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  if (!lastOpenDate) {
    return { currentStreak: 1, longestStreak: Math.max(1, longestStreak), lastOpenDate: todayStr };
  }

  const lastDate = new Date(lastOpenDate);
  const diffDays = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return { currentStreak, longestStreak, lastOpenDate: todayStr };
  }

  if (diffDays === 1) {
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
      lastOpenDate: todayStr,
    };
  }

  return { currentStreak: 1, longestStreak, lastOpenDate: todayStr };
}
