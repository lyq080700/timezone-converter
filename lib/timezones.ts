export interface TimezoneInfo {
  value: string;
  label: string;
  offset: string;
  region: string;
}

export const popularTimezones: TimezoneInfo[] = [
  { value: 'America/New_York', label: 'New York', offset: 'UTC-5', region: 'Americas' },
  { value: 'America/Los_Angeles', label: 'Los Angeles', offset: 'UTC-8', region: 'Americas' },
  { value: 'America/Chicago', label: 'Chicago', offset: 'UTC-6', region: 'Americas' },
  { value: 'America/Denver', label: 'Denver', offset: 'UTC-7', region: 'Americas' },
  { value: 'America/Toronto', label: 'Toronto', offset: 'UTC-5', region: 'Americas' },
  { value: 'America/Vancouver', label: 'Vancouver', offset: 'UTC-8', region: 'Americas' },
  { value: 'America/Sao_Paulo', label: 'São Paulo', offset: 'UTC-3', region: 'Americas' },
  { value: 'America/Mexico_City', label: 'Mexico City', offset: 'UTC-6', region: 'Americas' },
  { value: 'Europe/London', label: 'London', offset: 'UTC+0', region: 'Europe' },
  { value: 'Europe/Paris', label: 'Paris', offset: 'UTC+1', region: 'Europe' },
  { value: 'Europe/Berlin', label: 'Berlin', offset: 'UTC+1', region: 'Europe' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam', offset: 'UTC+1', region: 'Europe' },
  { value: 'Europe/Madrid', label: 'Madrid', offset: 'UTC+1', region: 'Europe' },
  { value: 'Europe/Rome', label: 'Rome', offset: 'UTC+1', region: 'Europe' },
  { value: 'Europe/Moscow', label: 'Moscow', offset: 'UTC+3', region: 'Europe' },
  { value: 'Asia/Dubai', label: 'Dubai', offset: 'UTC+4', region: 'Asia' },
  { value: 'Asia/Shanghai', label: 'Shanghai', offset: 'UTC+8', region: 'Asia' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 'UTC+8', region: 'Asia' },
  { value: 'Asia/Tokyo', label: 'Tokyo', offset: 'UTC+9', region: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore', offset: 'UTC+8', region: 'Asia' },
  { value: 'Asia/Seoul', label: 'Seoul', offset: 'UTC+9', region: 'Asia' },
  { value: 'Asia/Kolkata', label: 'Mumbai', offset: 'UTC+5:30', region: 'Asia' },
  { value: 'Asia/Bangkok', label: 'Bangkok', offset: 'UTC+7', region: 'Asia' },
  { value: 'Australia/Sydney', label: 'Sydney', offset: 'UTC+11', region: 'Australia' },
  { value: 'Australia/Melbourne', label: 'Melbourne', offset: 'UTC+11', region: 'Australia' },
  { value: 'Pacific/Auckland', label: 'Auckland', offset: 'UTC+13', region: 'Pacific' },
];

export function getTimezoneOffset(timezone: string): string {
  const date = new Date();
  const tzString = date.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' });
  const match = tzString.match(/GMT([+-]\d+)/);
  return match ? `UTC${match[1]}` : 'UTC+0';
}

export function detectUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatTimeInTimezone(date: Date, timezone: string): string {
  if (!timezone || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDateInTimezone(date: Date, timezone: string): string {
  if (!timezone || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
