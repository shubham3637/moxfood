/**
 * Calculate shipping charges based on package weight (grams) and location (Gujarat vs Out of Gujarat).
 *
 * Rates:
 * Gujarat:
 * - 1 kg: ₹40
 * - 2 kg: ₹60
 * - 3 kg: ₹100
 * - 4-5 kg: ₹140
 * - >5 kg: ₹40 * kg
 *
 * Out of Gujarat:
 * - 1 kg: ₹60
 * - 2 kg: ₹90
 * - 3 kg: ₹120
 * - 4-5 kg: ₹180
 * - >5 kg: ₹60 * kg
 */
export function calculateShippingFee(totalWeightGrams: number, isGujarat: boolean): number {
  const kg = Math.max(1, Math.ceil(totalWeightGrams / 1000));

  if (isGujarat) {
    if (kg <= 1) return 40;
    if (kg === 2) return 60;
    if (kg === 3) return 100;
    if (kg <= 5) return 140; // 4 kg & 5 kg
    return kg * 40; // > 5 kg
  } else {
    if (kg <= 1) return 60;
    if (kg === 2) return 90;
    if (kg === 3) return 120;
    if (kg <= 5) return 180; // 4 kg & 5 kg
    return kg * 60; // > 5 kg
  }
}
