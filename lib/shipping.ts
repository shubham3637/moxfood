/**
 * Calculate packaging & handling fee based on package weight (grams) and location (Gujarat vs Out of Gujarat).
 *
 * Rates:
 * All over Gujarat: ₹40 per kg (kg * 40)
 * Out of Gujarat: ₹50 per kg (kg * 50)
 */
export function calculateShippingFee(totalWeightGrams: number, isGujarat: boolean): number {
  const kg = Math.max(1, Math.ceil(totalWeightGrams / 1000));

  if (isGujarat) {
    return kg * 40; // ₹40 per kg
  } else {
    return kg * 50; // ₹50 per kg
  }
}
