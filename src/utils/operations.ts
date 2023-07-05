import mongoose, { Types } from "mongoose";

/**
 * Calculate the value over the percentage.
 * @param total Total value.
 * @param percent Percentage to be calculated.
 * @returns Number represeting the result.
 */
export function calculateDiscountedValue(
  total: number,
  percent: number
): number {
  return total - (percent * total) / 100;
}

/**
 * Check if a string is a valid MongoDB ObjectID.
 * @param str String to check.
 * @returns True if is valid, false if not.
 */
export function checkIfValidId(str: string | Types.ObjectId): boolean {
  return mongoose.Types.ObjectId.isValid(str);
}

/**
 * Get an array of products and return the total price.
 * @param products Array of products.
 * @returns Total price.
 */
export function getTotalFromProducts(products: CartItem[]) {
  const total = 0;
  return products
    .map(({ price, quantity }) => price * quantity)
    .reduce((acc, value) => acc + value, total);
}
