export const formatCurrency = (amount = 0, currency = 'PKR') => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currency || 'PKR',
    maximumFractionDigits: 0
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
