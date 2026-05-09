/**
 * Formats a date string or object to DD/MM/YYYY in GMT+5 timezone.
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  
  // Format to DD/MM/YYYY using en-GB locale (which uses this format)
  // and force Asia/Karachi (GMT+5) timezone
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Karachi'
  });
};

/**
 * Formats a date string or object to DD/MM/YYYY HH:mm in GMT+5 timezone.
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return 'N/A';
  
  const date = new Date(dateInput);
  
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi'
  });
};
