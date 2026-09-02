/**
 * Calculate packaging & handling fee based on package weight (grams).
 *
 * Rate:
 * All over India: Flat ₹20 per kg (kg * 20)
 */
export function calculateShippingFee(totalWeightGrams: number, isGujarat?: boolean): number {
  const kg = Math.max(1, Math.ceil(totalWeightGrams / 1000));
  return kg * 20; // ₹20 per kg all over India
}
