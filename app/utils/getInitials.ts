export function getInitials(fullName: string): string {
  if (!fullName) return "";

  const nameParts = fullName.trim().split(" ");

  const initials = nameParts
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials;
}
