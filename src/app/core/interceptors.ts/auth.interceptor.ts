import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthHelper } from '../helpers/auth.helper';
import { environment } from '../../../environments/environment.development';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const authHelper = inject(AuthHelper);

  const isApi = req.url.includes(environment.apiDeslandes);

  const token = authHelper.get()?.accessToken;

  // 🚨 NÃO envia Authorization se não tiver token válido
  const hasToken = token && token !== 'null' && token !== 'undefined';

  if (isApi && hasToken) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};