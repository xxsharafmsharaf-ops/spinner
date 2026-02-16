/**
 * Generate a unique coupon code
 */
export function generateCouponCode(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SPIN-${random}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format Egyptian phone numbers
  if (digits.startsWith('0')) {
    return digits.replace(/^0/, '+20 ');
  }
  if (digits.startsWith('20')) {
    return `+${digits}`;
  }
  if (digits.startsWith('+20')) {
    return digits;
  }
  
  return phone;
}
