export const getRaisedAmount = (
  raised: number,
  offerAmount: number,
): number => {
  const totalAmount = raised + offerAmount;

  const roundedResult = totalAmount.toFixed(2);

  return Number(roundedResult);
};
