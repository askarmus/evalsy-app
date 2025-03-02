import { format, toZonedTime } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";
class DateFormatter {
  private static readonly DEFAULT_FORMAT = "MMM dd, yyyy HH:mm"; // Consistent format with time
  private static readonly DATE_ONLY_FORMAT = "MMM dd, yyyy"; // Format without time

  /**
   * Formats the given date according to the user's time zone.
   * @param date - The date to be formatted (can be Date, string, or number).
   * @param ignoreTime - If true, the time part will be ignored. Defaults to false.
   * @returns Formatted date string.
   */
  public static formatDate(date: Date | string | number, ignoreTime: boolean = false): string {
    if (!date) return "";

    // Detect the user's time zone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Convert the date to the user's time zone
    const zonedDate = toZonedTime(new Date(date), timeZone);

    // Choose the format based on the ignoreTime flag
    const formatString = ignoreTime ? this.DATE_ONLY_FORMAT : this.DEFAULT_FORMAT;

    // Format the date consistently
    return format(zonedDate, formatString, { timeZone });
  }

  public static timeAgo(date: Date | string | number): string {
    if (!date) return "";

    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
}

export default DateFormatter;
