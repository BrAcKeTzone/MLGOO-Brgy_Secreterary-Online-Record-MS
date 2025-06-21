/**
 * Safely converts a value to a number.
 * Returns the number if conversion is successful, or null if it fails.
 * 
 * @param {*} value - The value to convert
 * @returns {number|null} - The converted number or null
 */
exports.convertToNumber = (value) => {
  if (value === null || value === undefined) return null;
  
  const num = Number(value);
  return isNaN(num) ? null : num;
};