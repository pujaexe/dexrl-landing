import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// lock timezone
dayjs.tz.setDefault('Asia/Bangkok'); // GMT+7

export const formatDaily = (date: string) => dayjs(date).format("ddd");

export const formatWeeklyISO = (date: string) =>
    `Week ${dayjs(date).isoWeek()}`;

export const formatMonthly = (date: string) => dayjs(date).format("MMM");

export const formatYearly = (date: string) => dayjs(date).format("YYYY");

export default dayjs;
