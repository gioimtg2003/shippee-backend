export * from './verify-email.event';

export enum CUSTOMER_AUTH_EVENTS {
  VERIFY_EMAIL = 'customer-auth.verify-email',
  RESET_PASSWORD = 'customer-auth.reset-password',
}
