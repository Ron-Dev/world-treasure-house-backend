// interceptors/success-response.interceptor.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../types/api-response';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((payload: T): ApiResponse<T> => {
        const isObject = typeof payload === 'object' && payload !== null;

        const message =
          isObject && 'message' in payload
            ? (payload as Record<string, unknown>).message
            : 'Request successful';

        const data =
          isObject && 'data' in payload ? (payload as Record<string, unknown>).data : payload;

        return {
          success: true,
          message: typeof message === 'string' ? message : 'Request successful',
          data: data as T,
        };
      }),
    );
  }
}
