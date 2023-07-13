export const calculateDiscountPercent = (price: number, discountPrice: number) => {
  if (price < discountPrice) {
    return null;
  }

  const discountPercent = 100 - Math.round(discountPrice / price * 100);
  return discountPercent;
}