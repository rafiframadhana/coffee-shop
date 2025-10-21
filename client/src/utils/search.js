/**
 * Filter items by search term across multiple fields
 * @param {Array} items - Array of items to filter
 * @param {string} searchTerm - Search term to filter by
 * @param {Array<string>} searchFields - Fields to search in (supports nested fields with dot notation)
 * @returns {Array} Filtered items
 *
 * @example
 * filterBySearch(products, 'coffee', ['item', 'description', 'contain'])
 * filterBySearch(users, 'john', ['displayName', 'username', 'email'])
 */
export const filterBySearch = (items, searchTerm, searchFields) => {
  if (!searchTerm || !searchTerm.trim()) return items;
  if (!Array.isArray(items)) return [];

  const lower = searchTerm.toLowerCase().trim();

  return items.filter((item) =>
    searchFields.some((field) => {
      // Support nested fields with dot notation (e.g., 'user.name')
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return String(value || '').toLowerCase().includes(lower);
    })
  );
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 *
 * @example
 * truncateText('This is a very long description', 20)
 * // Returns: 'This is a very long...'
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Highlight search term in text
 * @param {string} text - Text to highlight in
 * @param {string} searchTerm - Term to highlight
 * @returns {string} Text with highlighted term (for use with dangerouslySetInnerHTML)
 *
 * @example
 * highlightSearch('Java and JavaScript', 'java')
 * // Returns: '<mark>Java</mark> and <mark>Java</mark>Script'
 */
export const highlightSearch = (text, searchTerm) => {
  if (!text || !searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Debounce search input to reduce API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 *
 * @example
 * const debouncedSearch = debounceSearch(handleSearch, 300);
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export const debounceSearch = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
