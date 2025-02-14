export const formatPrice = (price: number): string => {
  if (isNaN(price)) {
    return 'Invalid price';
  }
  return `${price.toLocaleString('vi-VN')}`;
};
