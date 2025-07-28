export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  // This will return: "18 Jul 2025"
};

// Simple date range formatter
export const formatDateRange = (startTimestamp, endTimestamp) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12 || 12;
    const time = minutes === 0 ? `${hours} ${ampm}` : `${hours}.${minutes.toString().padStart(2, '0')} ${ampm}`;
    
    return `${day} ${month} ${year} ${time}`;
  };

  return `${formatDate(startTimestamp)} - ${formatDate(endTimestamp)}`;
};

// Format single date for separate display
// Usage:
// formatDateRange(startTimestamp, endTimestamp) - "15 Jul 2025 8 pm - 30 Jul 2025 5.30 pm"
// formatSingleDate(timestamp) - "15 Jul 2025 8 pm"
export const formatSingleDate = (timestamp) => {
  if (!timestamp) return "N/A";
  
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  
  hours = hours % 12 || 12;
  const time = minutes === 0 ? `${hours} ${ampm}` : `${hours}.${minutes.toString().padStart(2, '0')} ${ampm}`;
  
  return `${day} ${month} ${year} ${time}`;
};



