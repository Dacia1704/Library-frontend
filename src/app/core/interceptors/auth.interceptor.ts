import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';


// về sau tìm hiểu thêm về BehaviorSubject
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isAuthUrl = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

  const withToken = (token: string | null) =>
    token && !isAuthUrl ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(withToken(auth.accessToken)).pipe(
    catchError(err => {
      if (err.status === 401 && !isAuthUrl && auth.refreshToken) {
        return auth.refresh().pipe(
          switchMap(() => next(withToken(auth.accessToken))),
          catchError(e => { auth.clearSession(); return throwError(() => e); })
        );
      }
      return throwError(() => err);
    })
  );
};