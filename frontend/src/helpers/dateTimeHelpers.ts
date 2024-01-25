import { message } from "antd";

export const differenceInTime = (expirationDate?: Date | string): string => {
  try {
    if (!expirationDate) {
      return "0 days";
    }

    const expirationDateObject = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;

    if (!(expirationDateObject instanceof Date && !isNaN(expirationDateObject.getTime()))) {
      throw new Error('Invalid date format');
    }

    const currentDate = new Date();
    const timeDifferenceInMilliseconds = expirationDateObject.getTime() - currentDate.getTime();

    // Convert milliseconds to seconds, minutes, hours, days
    const seconds = Math.floor(timeDifferenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;

    if (days >= 30) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return `${months} month${months !== 1 ? 's' : ''}, ${remainingDays} day${remainingDays !== 1 ? 's' : ''}, ${remainingHours} hours, ${remainingMinutes} minutes`;
    } else if (days >= 7) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return `${weeks} week${weeks !== 1 ? 's' : ''}, ${remainingDays} day${remainingDays !== 1 ? 's' : ''}, ${remainingHours} hours, ${remainingMinutes} minutes`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''}, ${remainingHours} hours, ${remainingMinutes} minutes`;
    }

  } catch (error) {
    message.error("Error occurred", 3);
    return "0 days";
  }
};
