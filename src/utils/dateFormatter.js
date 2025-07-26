export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  // This will return: "18 Jul 2025"
};
