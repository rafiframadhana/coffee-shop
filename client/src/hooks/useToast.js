import { useState, useEffect, useCallback } from 'react';
import { MESSAGE_DISPLAY_DURATION } from '../constants/config';

/**
 * Toast notification hook for displaying temporary messages
 * @param {number} duration - Duration in milliseconds (default: 3000ms)
 * @returns {object} Toast state and control functions
 *
 * @example
 * const { message, type, showSuccess, showError, showInfo } = useToast();
 *
 * // Show success message
 * showSuccess('Product added to cart!');
 *
 * // Show error message
 * showError('Failed to update cart');
 *
 * // Render toast
 * {message && (
 *   <div className={`toast toast-${type}`}>
 *     {message}
 *   </div>
 * )}
 */
export const useToast = (duration = MESSAGE_DISPLAY_DURATION) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('info'); // 'success' | 'error' | 'info' | 'warning'

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const showSuccess = useCallback((msg) => {
    setMessage(msg);
    setType('success');
  }, []);

  const showError = useCallback((msg) => {
    setMessage(msg);
    setType('error');
  }, []);

  const showInfo = useCallback((msg) => {
    setMessage(msg);
    setType('info');
  }, []);

  const showWarning = useCallback((msg) => {
    setMessage(msg);
    setType('warning');
  }, []);

  const hideToast = useCallback(() => {
    setMessage(null);
  }, []);

  return {
    message,
    type,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
  };
};
