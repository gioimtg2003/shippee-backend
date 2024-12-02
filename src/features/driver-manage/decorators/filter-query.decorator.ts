import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FilterDriverOptionsDto } from '../dto';

export const FilterQuery = createParamDecorator(
  (data, context: ExecutionContext) => {
    const result = new FilterDriverOptionsDto();
    const req = context.switchToHttp().getRequest();
    result.name = req.query?.name;
    result.createdAt = req.query?.createdAt;
    result.verifyAt = req.query?.verifyAt;

    return result;
  },
);
