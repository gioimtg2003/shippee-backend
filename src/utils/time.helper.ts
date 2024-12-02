import dayjs from 'dayjs';

export function getEndOfDay(dateStr: string) {
  const date = dayjs(dateStr);
  return date.endOf('day');
}
