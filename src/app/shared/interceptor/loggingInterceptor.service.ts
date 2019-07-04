// 拦截器记录日志，监听请求的返回时间成功还是失败------摘抄自官网
import { Injectable, ViewChildren } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
window['messenger'] = [];
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { CodebaseService } from '../service/codebase.service';
import { GetJsonService } from '../service/getJson.service';
import { DataManageService } from '../service/data_manage.service';
import { SingleDiagramParameterComponent } from '../../component/single_prediction_details/single_diagram_parameter';
declare const lenovoPublic;
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    devHost = this.getJsonService.devHost;
    devHostLogin = this.getJsonService.devHostLogin;
    filterNoHeadersUrlArr = [`${this.devHostLogin}/oauth/rest_token`]; // 排除不需要验证登陆的接口
    filterIsAllowCall = [`${this.devHost}/machine-learning/1.0/app/project/getProjectByCodes`];
    @ViewChildren(SingleDiagramParameterComponent) public singleDiagramParameterComponent: SingleDiagramParameterComponent;
    constructor(
        private codebaseService: CodebaseService,
        private router: Router,
        private getJsonService: GetJsonService,
        private dataManageService: DataManageService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const started = Date.now();
        let res: any;

        // extend server response observable with logging
        return next.handle(req)
            .pipe(
                tap(
                    // Succeeds when there is a response; ignore other events
                    (event) => {
                        // lenovoPublic.selfLog2(()=>console.log(event));
                        return res = event instanceof HttpResponse ? event : event;
                    },
                    // Operation failed; error is an HttpErrorResponse
                    (error) => {
                        // lenovoPublic.selfLog2(()=>console.log(error));
                        // lenovoPublic.selfLog2(()=>console.log(error.Response));
                        // lenovoPublic.selfLog2(()=>console.log(error.response));

                        return res = error;
                    }
                ),
                // Log when response observable either completes or errors
                finalize(() => {
                    lenovoPublic.selfLog2(() => console.log(res));
                    // const elapsed = Date.now() - started;
                    // const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
                    // window['messenger'].push(msg);
                    // lenovoPublic.selfLog2(() => console.log(window['messenger']));
                    this.checkLoginIn(req, res);
                })
            );
    }

    checkLoginIn(req, res) {
        if (!this.filterNoHeadersUrlArr.includes(req.url)) {
            // if (res.status === 401 && res.error.error_description) {
            //     alert(res.error.error_description);
            //     this.router.navigate(['/login']);
            // }
            // const isLogined = this.dataManageService.getLogined();
            // if (!isLogined && (window.location.hash).indexOf('login') === -1 && window.location.hash !== '#/') {
            //     alert('登陆信息失效，即将回到登陆页面');
            //     this.router.navigate(['/login']);
            // }
        }
    }
}
