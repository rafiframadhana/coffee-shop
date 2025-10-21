import { LOCALE, CURRENCY } from '../config/constants';

/**
 * Format price to Indonesian Rupiah
 * @param {number} price - Price to format
 * @param {string} locale - Locale code (default: id-ID)
 * @param {string} currency - Currency code (default: IDR)
 * @returns {string} Formatted price
 *
 * @example
 * formatCurrency(15000) // 'Rp 15.000'
 */
export const formatCurrency = (price, locale = LOCALE, currency = CURRENCY) => {
  if (typeof price !== 'number') return 'Rp 0';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale code (default: id-ID)
 * @returns {string} Formatted date
 *
 * @example
 * formatDate('2024-01-15') // '15 Januari 2024'
 */
export const formatDate = (date, locale = LOCALE) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // '1 hour ago'
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 *
 * @example
 * capitalize('hello world') // 'Hello World'
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
