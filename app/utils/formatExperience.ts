export function formatExperience(months: number): string {
  if (!months || months <= 0) return 'No experience';

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (remainingMonths > 0) parts.push(`${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`);

  return parts.join(' ');
}
