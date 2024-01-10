const getPriceUnit = (price: string | number): string => {
  let floatValue: number = typeof price === 'string' ? parseFloat(price) : price as number;
  return floatValue >= 1000 ? "billion" : 'million';
};

export default getPriceUnit;