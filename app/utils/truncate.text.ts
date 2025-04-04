export function truncateText(text: string, maxLength: number, options?: { wordBoundary?: boolean; ellipsis?: string }): string {
  const { wordBoundary = false, ellipsis = "…" } = options || {};

  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);

  if (wordBoundary) {
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 0) {
      return truncated.slice(0, lastSpace) + ellipsis;
    }
  }

  return truncated + ellipsis;
}
