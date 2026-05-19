/**
 * Converts a Celsius temperature to the target unit.
 * @param temp - Temperature in Celsius.
 * @param unit - Target unit ('C' or 'F').
 * @returns Rounded temperature in the target unit.
 */
export const convertTemp = (temp: number, unit: 'C' | 'F'): number => {
  if (unit === 'F') return Math.round(temp * 9 / 5 + 32);
  return Math.round(temp);
}; 