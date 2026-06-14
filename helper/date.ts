import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';


// Setup dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.locale('id');

export const date = (time?: string | Date) => dayjs(time)

export const formatDate = (date: Date): string => {
  const formatted = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatted.replace(",", " -");
};

/**
 * Format date menggunakan dayjs
 * @param date - Date object, string, atau number (timestamp)
 * @param format - Format string (default: "DD MMMM YYYY")
 * @returns String tanggal yang diformat
 */
export const formatDateV2 = (
  date: Date | string | number | null | undefined,
  format: string = 'DD MMMM YYYY'
): string => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

export const formatElapsedTime = (ms: number): string => {
  let totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
};

export function formatDuration(ms: number) {
  let totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  const parts: string[] = [];

  if (days > 0) parts.push(pad(days));
  if (days > 0 || hours > 0) parts.push(pad(hours));
  parts.push(pad(minutes));
  parts.push(pad(seconds));

  return parts.join(":");
}

export function normalizeTxDate(s?: string): Date {
  if (!s) return new Date();
  return new Date(s.replace(" ", "T") + "Z");
}