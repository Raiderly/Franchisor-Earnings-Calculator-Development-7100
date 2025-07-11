/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number with commas
 * @param {number} number - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(Math.round(number));
};

/**
 * Format a decimal as a percentage
 * @param {number} decimal - Decimal value (e.g. 0.15)
 * @returns {string} - Formatted percentage (e.g. "15.0%")
 */
export const formatPercentage = (decimal) => {
  return `${(decimal * 100).toFixed(1)}%`;
};

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};