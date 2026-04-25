import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError, tap } from 'rxjs';

const AUTH_URL = 'http://localhost:4000/api/auth';
const API_URL = 'http://localhost:4000/api';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const authReq = req.clone({
    setHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      if (!refreshToken) {
        window.location.href = '/login';
        return throwError(() => error);
      }

      return doRefreshToken(refreshToken).pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken || response.token);
        }),
        switchMap((response) => {
          const newAccessToken = response.accessToken || response.token;
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` },
          });
          return next(retryReq);
        }),
        catchError((refreshError) => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};

function doRefreshToken(refreshToken: string) {
  const http = inject(HttpClient);

  return http.post<{ accessToken: string; token: string }>(
    `${AUTH_URL}/refresh`,
    {},
    {
      headers: { Authorization: `Bearer ${refreshToken}` },
    },
  );
}
