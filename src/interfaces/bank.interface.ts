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

export interface IVietinbankTransactions
  extends Pick<IVietinbankResponse, 'requestId' | 'sessionId' | 'error'> {
  accountNo: string;
  currentPage: number;
  nextPage: number;
  pageSize: number;
  totalRecords: number;
  transactions: Array<{
    currency: string;
    remark: string;
    amount: string;
    balance: string;
    trxId: string;
    processDate: string;
    dorC: string;
    refType: string;
    refId: string;
    tellerId: string | null;
    corresponsiveAccount: string;
    corresponsiveName: string;
    channel: string;
    serviceBranchId: string;
    serviceBranchName: string;
    pmtType: string;
    sendingBankId: string;
    sendingBranchId: string;
    sendingBranchName: string;
    receivingBankId: string;
    receivingBranchId: string;
    receivingBranchName: string;
  }>;
}
