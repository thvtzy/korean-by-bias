interface SrsResult {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReview: Date;
}

export function sm2(
  quality: number,
  prevEaseFactor: number,
  prevIntervalDays: number,
  prevRepetitions: number
): SrsResult {
  let easeFactor = prevEaseFactor;
  let intervalDays = prevIntervalDays;
  let repetitions = prevRepetitions;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.ceil(intervalDays * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return { easeFactor, intervalDays, repetitions, nextReview };
}
