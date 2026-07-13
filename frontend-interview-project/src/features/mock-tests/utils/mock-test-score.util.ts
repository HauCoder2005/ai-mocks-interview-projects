export function getAnsweredCount(selectedAnswers: Record<number, number>) {
  return Object.keys(selectedAnswers).length;
}
