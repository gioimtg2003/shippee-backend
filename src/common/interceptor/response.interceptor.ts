import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
  timeStamp: string;
}

@Injectable()
export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        const success = statusCode >= 200 && statusCode <= 299;

        return {
          code: statusCode,
          success: success,
          message: data?.message || 'Request was successful',
          data: data,
          timeStamp: new Date().toISOString(),
        };
      }),
      catchError((error) => {
        console.log('Error at here: ', error);
        let errorMessage =
          error?.response?.message || error?.message || 'Internal Server Error';

        let status = error?.status || 400;
        if (errorMessage.includes('duplicate key value')) {
          errorMessage = 'Data already exists';
          status = 400;
        }

        response.status(status);

        return throwError(
          () =>
            new HttpException(
              {
                code: status,
                success: false,
                message: errorMessage,
                data: null,
                timeStamp: new Date().toISOString(),
              },
              status,
            ),
        );
      }),
    );
  }
}
