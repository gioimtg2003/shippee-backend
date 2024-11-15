import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response {
  data: any;
}

export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    console.log('Interceptor', statusCode);

    return next.handle().pipe(
      map((data) => {
        const builderStatus = data?.status;
        console.log(data);
        let success = statusCode >= 200 && statusCode <= 207;
        if (builderStatus !== undefined) {
          success = builderStatus >= 200 && builderStatus <= 207;
          response.status(builderStatus);
        }

        return {
          code: statusCode,
          success: success,
          message: data?.message,
          data: data,
          timeStamp: new Date().toISOString(),
        };
      }),
    );
  }
}
