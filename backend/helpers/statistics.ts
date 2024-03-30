import { startOfDay, startOfMonth, startOfYear, subDays, subMonths, subYears } from "date-fns";


export const parseTimeUnit = (timeRangeStr: string): { timeRangeStr: string; unit: string | undefined } => {
  const arrayTimeUnit = timeRangeStr.split('-');
  const timeRange = parseInt(arrayTimeUnit[0]);
  const unit = arrayTimeUnit[1] && ['days', 'months', 'years'].includes(arrayTimeUnit[1]) ? arrayTimeUnit[1] : undefined;
  return { timeRangeStr: timeRange.toString(), unit };
}

export const calculateTimeBefore = (unit: string, timeRange: number): Date => {
  const today = new Date();
  if (unit === 'days') {
    return subDays(startOfDay(today), timeRange);
  } else if (unit === 'months') {
    return subMonths(startOfMonth(today), timeRange);
  } else {
    return subYears(startOfYear(today), timeRange);
  }
}

export const aggregateDailySums = (data: any[], unit: string): { createdAt: string; amount: number }[] =>  {
  return data.reduce((acc, item) => {
    const dateString = item.createdAt.toLocaleDateString('en-US', {
      day: unit === 'days' ? '2-digit' : undefined,
      month: unit !== 'years' ? '2-digit' : undefined,
      year: unit !== 'days' ? '2-digit': undefined
    });

    const existingSum = acc.find((entry: any) => entry.createdAt === dateString);
    if (existingSum) {
      existingSum.amount += item.amount;
    } else {
      acc.push({ createdAt: dateString, amount: item.amount });
    }

    return acc;
  }, []);
}

