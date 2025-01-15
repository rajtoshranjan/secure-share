/**
 * Format date to human readable string
 * @param date - Date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string (e.g., "Jan 1, 2024")
 */
export const formatDate = (
  date: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
): string => {
  return new Date(date).toLocaleDateString('en-US', options);
};
