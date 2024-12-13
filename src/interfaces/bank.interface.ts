export interface IVietinbankResponse {
  requestId: string;
  sessionId: string;
  error: boolean;
  systemDate: string;
  status: string;
  customerNumber: string;
  ipayId: string;
  unreadMessages: any[];
  addField2: string;
  addField3: string;
  tokenId: string;
  customerEkyc: string;
}
