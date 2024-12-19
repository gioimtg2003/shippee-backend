import { WalletPaginateDto } from '@features/driver-wallet/dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FilterWallet = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const {
      endTime,
      fromAmt,
      startTime,
      toAmt,
      walletStatus,
      actionType,
      take,
      skip,
    } = req.query;

    const result = new WalletPaginateDto();
    result.endTime = endTime;
    result.fromAmt = fromAmt;
    result.startTime = startTime;
    result.toAmt = toAmt;
    result.walletStatus = walletStatus;
    result.actionType = actionType;
    result.take = take;
    result.skip = skip;

    return result;
  },
);
