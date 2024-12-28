export class VerifyEmailCustomerEvent {
  constructor(
    public readonly email: string,
    public readonly otp: string,
  ) {}
}
