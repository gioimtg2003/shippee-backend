import { phone as validPhone } from 'phone';

export function formatPhoneNumber(phone: string) {
  const { phoneNumber } = validPhone(phone, {
    country: 'VN',
  });
  return phoneNumber;
}
