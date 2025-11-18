import { HttpInterceptorFn } from '@angular/common/http';

export const reidPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const prefix = '/reid';

  // Skip full URLs (external APIs)
  if (req.url.startsWith('http')) {
    return next(req);
  }

  // Clone the request with the new URL
  const updatedReq = req.clone({
    url: `${prefix}${req.url}`
  });

  return next(updatedReq);
};
