/**
 * Formats a number as a currency string with a "K" suffix for thousands.
 * Example: 1000 -> 1K, 1500 -> 1.5K, 500 -> 500
 * @param {number} value - The amount to format
 * @returns {string} - The formatted string
 */
export const formatCurrency = (value) => {
  if (!value) return '0';
  if (value > 999) {
    return (value / 1000).toFixed(1).replace('.0', '') + 'K';
  }
  return value.toString();
};
