export const convertTemp = (temp: number, unit: 'C' | 'F'): number => {
  if (unit === 'F') return Math.round(temp * 9 / 5 + 32);
  return Math.round(temp);
}; 