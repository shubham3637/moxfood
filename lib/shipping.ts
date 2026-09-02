/**
 * Calculate packaging & handling fee based on package weight (grams).
 *
 * Rate:
 * All over India: Flat ₹10 per kg (kg * 10)
 */
export function calculateShippingFee(totalWeightGrams: number, isGujarat?: boolean): number {
  const kg = Math.max(1, Math.ceil(totalWeightGrams / 1000));
  return kg * 10; // ₹10 per kg all over India
}
