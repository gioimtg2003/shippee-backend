import { WALLET_STATUS_ENUM } from '@constants';
interface IProps {
  id: number;
  status: WALLET_STATUS_ENUM;
}
export class UpdateWalletEvent {
  constructor(public data: IProps) {}
}
