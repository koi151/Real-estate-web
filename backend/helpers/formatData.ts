export const parseToValidNumber = (value?: string | null | undefined): number | undefined => {
  return value ? parseFloat(value) || undefined : undefined;
};

export const formattedPermissions = (name: string): string => {
  return name.replace(/[-_](\w)/g, (_, letter) => letter.toUpperCase());
};  