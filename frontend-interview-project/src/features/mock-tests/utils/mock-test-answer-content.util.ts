export function normalizeAnswerContent(content: string) {
  return content.replace(/^[A-D][.):-]\s*/i, "").trim();
}
