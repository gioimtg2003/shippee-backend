import { phone as validPhone } from 'phone';

/**
 * Formats a given phone number to a standard format.
 *
 * @param phone - The phone number to be formatted.
 * @returns The formatted phone number.
 */
export function formatPhoneNumber(phone: string) {
  const { phoneNumber } = validPhone(phone, {
    country: 'VN',
  });
  return phoneNumber;
}
