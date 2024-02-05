// export const parseToValidNumber = (value?: string | null): number | undefined => {
//   const parsedValue = parseFloat(value || '');
//   return isNaN(parsedValue) ? undefined : parsedValue;
// };

export const parseToValidNumber = (value?: string | null | undefined): number | undefined => {
  return value ? parseFloat(value) || undefined : undefined;
};
