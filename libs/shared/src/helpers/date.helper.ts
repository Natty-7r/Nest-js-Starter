import { TimeFrameParams, TimeUnit } from '../types/shared.type';

export const calculatePackageExpireDate = (monthCount: number): Date => {
  const packageDuration = monthCount * 30;

  const expireDate = new Date(new Date().setDate(new Date().getDate() + packageDuration));
  return expireDate;
};

export const calculatePackageStartDate = (previousPackageEndDate?: Date): Date => {
  if (!previousPackageEndDate) return new Date();

  return new Date(previousPackageEndDate.getTime());
};

export const calculateTimeFrame = ({ startDate, timeFrame, timeUnit }: TimeFrameParams): Date[] => {
  const initialDate = startDate || new Date();
  const endDate = new Date(initialDate);

  switch (timeUnit) {
    case TimeUnit.d:
      endDate.setDate(endDate.getDate() + timeFrame);
      break;
    case TimeUnit.w:
      endDate.setMonth(endDate.getDate() + 7 * timeFrame);
      break;
    case TimeUnit.m:
      endDate.setMonth(endDate.getMonth() + timeFrame);
      break;
    case TimeUnit.y:
      endDate.setFullYear(endDate.getFullYear() + timeFrame);
      break;
    case TimeUnit.h:
      endDate.setHours(endDate.getHours() + timeFrame);
      break;
    default:
  }
  return [initialDate, endDate];
};

export const createDateFromString = (dateString: string): Date => new Date(dateString);

/**
 * Compares two Date objects.
 *
 * @param date1 - The first date to compare.
 * @param date2 - The second date to compare.
 * @returns
 *  1 if date1 is greater than date2,
 * -1 if date1 is less than date2,
 *  0 if both dates are equal.
 */
export const compareDates = (date1: Date, date2: Date): 1 | -1 | 0 => {
  // Compare years
  if (date1.getFullYear() > date2.getFullYear()) {
    return 1;
  }
  if (date1.getFullYear() < date2.getFullYear()) {
    return -1;
  }

  // Compare months
  if (date1.getMonth() > date2.getMonth()) {
    return 1;
  }
  if (date1.getMonth() < date2.getMonth()) {
    return -1;
  }

  // Compare dates
  if (date1.getDate() > date2.getDate()) {
    return 1;
  }
  if (date1.getDate() < date2.getDate()) {
    return -1;
  }

  // Compare hours
  if (date1.getHours() > date2.getHours()) {
    return 1;
  }
  if (date1.getHours() < date2.getHours()) {
    return -1;
  }

  // All components are equal
  return 0;
};
