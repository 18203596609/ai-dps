// 拦截器修改请求头添加token--------摘抄自官网
import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GetJsonService, TooltipBoxService } from '../service';
import { finalize, tap } from 'rxjs/operators';
const filterNoHeadersUrlArr = [
    'http://10.110.147.33:8015/oauth/rest_token',
    'http://10.110.147.37:8015/oauth/rest_token',
    'http://10.122.61.170:8015/oauth/rest_token'
];
const formData = [
    'http://10.110.147.33:8014/machine-learning/1.0/app/batch/getBatchForcastByFile',
    'http://10.110.147.37:8014/machine-learning/1.0/app/batch/getBatchForcastByFile',
    'http://10.122.61.170:8014/machine-learning/1.0/app/batch/getBatchForcastByFile',

    'http://10.112.38.97:8014/machine-learning/1.0/app/project/data/uploadCustomModifyWarranty',
    'http://10.110.147.33:8014/machine-learning/1.0/app/project/data/uploadCustomModifyWarranty',
    'http://10.110.147.37:8014/machine-learning/1.0/app/project/data/uploadCustomModifyWarranty',
    'http://10.122.61.170:8014/machine-learning/1.0/app/project/data/uploadCustomModifyWarranty',

    'http://10.112.38.97:8014/machine-learning/1.0/app/project/data/uploadCustomModifyInfo',
    'http://10.110.147.33:8014/machine-learning/1.0/app/project/data/uploadCustomModifyInfo',
    'http://10.110.147.37:8014/machine-learning/1.0/app/project/data/uploadCustomModifyInfo',
    'http://10.122.61.170:8014/machine-learning/1.0/app/project/data/uploadCustomModifyInfo',

    'http://10.112.38.97:8014/machine-learning/1.0/app/project-line/modifyRaByLineId',
    'http://10.110.147.33:8014/machine-learning/1.0/app/project-line/modifyRaByLineId',
    'http://10.110.147.37:8014/machine-learning/1.0/app/project-line/modifyRaByLineId',
    'http://10.122.61.170:8014/machine-learning/1.0/app/project-line/modifyRaByLineId'
];
declare const lenovoPublic;
/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptorService implements HttpInterceptor {
    constructor(
        private getJsonService: GetJsonService,
        private tooltipBoxService: TooltipBoxService,
        private router: Router
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // lenovoPublic.selfLog2(()=>console.log(req, next));
        let res: any;
        let authReq = req;
        // 排除设置Authorization等属性的接口，可能这类接口不允许设置这类字段
        if (!filterNoHeadersUrlArr.includes(req.url)) {
            if (!formData.includes(req.url)) {
                authReq = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${this.getJsonService.getToken()}`).set('Content-Type', 'application/json;charset=UTF-8'),
                    // headers: req.headers.set('Authorization', `Bearer null`).set('Content-Type', 'application/json;charset=UTF-8'),
                    withCredentials: true,
                });
            } else {
                authReq = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${this.getJsonService.getToken()}`),
                    // headers: req.headers.set('Authorization', `Bearer null`),
                    withCredentials: true,
                });
            }
        }
        // lenovoPublic.selfLog2(()=>console.log(req));
        return next.handle(authReq).pipe(
            tap(
                (event) => {
                    // lenovoPublic.selfLog2(()=>console.log(event));
                    return res = event instanceof HttpResponse ? event : event;
                },
                (error) => {
                    // lenovoPublic.selfLog2(()=>console.log(error));
                    return res = error;
                }
            ),
            finalize(() => {
                if (res.status === 401 && res.statusText === 'Unauthorized' && res.error.error_description) {
                    this.tooltipBoxService.setTooltipBoxInfo({
                        message: [{
                            text: `${res.error.error_description}`,
                            style: {}
                        }]
                    }, 'alert');
                    // alert(res.error.error_description);
                    this.router.navigate(['/login']);
                }
                // lenovoPublic.selfLog2(()=>console.log(res));
            })
        );
    }
}
