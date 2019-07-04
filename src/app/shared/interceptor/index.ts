/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NoopInterceptorService } from './interceptor.service';
import { LoggingInterceptor } from './loggingInterceptor.service';
// import { CachingInterceptorService } from './cacheInterceptor.service';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    // { provide: HTTP_INTERCEPTORS, useClass: UploadInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptorService, multi: true },
];
