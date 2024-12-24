import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // For timezone support
import utc from 'dayjs/plugin/utc'; // For UTC support

dayjs.extend(utc);
dayjs.extend(timezone);

export function getEndOfDay(dateStr: string) {
  const date = dayjs(dateStr);
  return date.endOf('day');
}

export const formatDateToUTCString = (date: string): string => {
  return dayjs(date).utc().format('YYYY-MM-DD HH:mm:ssZ');
};

export const getStartAndEndOfMonth = (date: dayjs.Dayjs) => ({
  start: date.startOf('month').toDate(),
  end: date.endOf('month').toDate(),
});
