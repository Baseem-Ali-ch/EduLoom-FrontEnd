// auth.interceptor.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const studentAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }else{
    console.log('no token');
    
  }
  
  return next(req);
};