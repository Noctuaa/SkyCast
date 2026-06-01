export const isValidCoords = (lat: string, lon: string): boolean => {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  return !isNaN(latNum) && !isNaN(lonNum) &&
    latNum >= -90 && latNum <= 90 &&
    lonNum >= -180 && lonNum <= 180;
};