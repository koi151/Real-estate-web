const getPriceUnit = (price: string | number): string => {
  let floatValue: number = typeof price === 'string' ? parseFloat(price) : price as number;
  return floatValue >= 1000 ? "billion" : 'million';
};

export default getPriceUnit;

export const calculatePricePerUnitArea = (price: number, length: number, width: number): string | null => {
  if (!price || !length || !width) return null;

  const pricePerUnitArea = price / (length * width);

  return pricePerUnitArea >= 1000
    ? `${(pricePerUnitArea / 1000).toFixed(2)} billion`
    : `${pricePerUnitArea.toFixed(2)} million`;
};