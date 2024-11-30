export class WebhookDto {
  gateway: string;
  transactionDate: Date;
  accountNumber: string;
  subAccount: string | null;
  code: string;
  content: string;
  transferType: 'in';
  description: string;
  transferAmount: number;
  referenceCode: string;
  accumulated: number;
  id: number;
}
