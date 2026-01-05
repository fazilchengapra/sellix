export const formatPrice = (price) => {
  const amount = Number(price);
  if (isNaN(amount)) return '';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};
