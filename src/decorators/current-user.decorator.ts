import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  NotFoundException,
} from '@nestjs/common';

type Props = {
  disableError?: boolean;
};

export const CurrentUser = createParamDecorator(
  async (data: Props, context: ExecutionContext) => {
    const logger = new Logger(CurrentUser.name);
    logger.debug('Start getting current user');
    const req = context.switchToHttp().getRequest();
    const user = await req.user;
    logger.debug('User: ' + JSON.stringify(user));

    if (!user?.id && !data?.disableError) {
      logger.error('User not found');
      throw new NotFoundException('User not found');
    }

    return user;
  },
);
