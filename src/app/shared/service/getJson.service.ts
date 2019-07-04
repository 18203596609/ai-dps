import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { CodebaseService } from './codebase.service';
import { LoadingService } from './loading.service';
import { TooltipBoxService } from './tooltipBox.service';
import { LoginRegister, GetProjectByCodes, GetProjectById, GetProjectIdList, UpdataCurrentGroupByProjectId, GetLineWithGroupUnionCode, SaveLines2Project, SetLineIsUsed, GetCompareGroupWithGroupUnionCode, AddGroup2CompareGroup, GetCompareGroupList, RemoveGroup2CompareGroup, UpdataCompareGroupInfo, Export, DoBatchForcast, ExportBatch, DoArtificialForcast, DoArtificialLineWithParam } from '../interface/getjson.interface';

import { SelfFun, ProjectService, ProjectLineService, ElasticsearchService, ProjectCompareGroupService, ExportService, BatchForcastService, Artificial } from '../interface/getjson.interface';

import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/timeout';
import { map } from 'rxjs/operators';
declare const lenovoPublic;

@Injectable()
export class GetJsonService implements ProjectService, ProjectLineService, ElasticsearchService, SelfFun, ProjectCompareGroupService, ExportService, BatchForcastService, Artificial {
    constructor(
        private http: HttpClient,
        private codebaseService: CodebaseService,
        private loadingService: LoadingService,
        private tooltipBoxService: TooltipBoxService,
    ) { }
    devHostLogin = 'http://10.110.147.33:8015'; // 开发时login登录的域名，仅仅端口号不一样

    // devHost = 'http://10.122.61.170:8014'; // 开发时所有接口的域名
    devHost = environment.apiUrl; // 开发时所有接口的域名
    productHost = environment.apiUrl; // 生产所有接口的域名

    token = null; // 获取并保存token

    /**
    * 创建项目
    * 单个预测single_search通过search后 点击预测 跳转时调用
    */
    getProjectByCodes(param: GetProjectByCodes, callback: Function, errCallback: Function) {
        const aiOrHumanPrediction = param['aiOrHumanPrediction'] || 'project'; // 根据传递的路由判断当前是Ai预测还是人工预测，如果没有参数时默认是Ai预测
        if (param['aiOrHumanPrediction']) {
            delete param['aiOrHumanPrediction'];
        }
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/${aiOrHumanPrediction}/getProjectByCodes`, param, this.setHeaders())
            .map((res) => {
                lenovoPublic.selfLog2(() => console.log(res));
                return res;
            })
            .subscribe((data) => {
                const isError = this.handleError(data, 1);
                if (!isError) {
                    return;
                }
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    this.splitToFixedNum(data, true);
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 通过id获取项目
     * 预测历史时调用 通过项目id获取单个预测的内容
     */
    getProjectById(param: GetProjectById, callback: Function, errCallback: Function) {
        return this.http.get(`${this.devHost}/machine-learning/1.0/app/project/getProjectById?projectId=${param}`, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 2);
                if (!isError) {
                    return;
                }
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 获取所有预测历史列表页面
     */
    getProjectIdList(param: GetProjectIdList, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/getProjectIdList`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 3);
                if (!isError) {
                    return;
                }
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }


    /**
    * 编辑创建当前预测曲线
    */
    getLineWithGroupUnionCode(param: GetLineWithGroupUnionCode, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project-line/getLineWithGroupUnionCode`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 4);
                if (!isError) {
                    return;
                }
                if (callback) {
                    this.splitToFixedNum(data, true);
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 保存当前预测曲线
     */
    saveLines2Project(param: SaveLines2Project, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project-line/saveLines2Project`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 18);
                if (!isError) {
                    return;
                }
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 设置线是否使用
     */
    setLineIsUsed(param: SetLineIsUsed, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project-line/setLineIsUsed`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 5);
                if (!isError) {
                    return;
                }
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 设置线是否使用
     */
    setLineNameLineById(param, callback: Function, errCallback: Function) {
        return this.http.get(`${this.devHost}/machine-learning/1.0/app/project-line/setLineNameLineById?lineId=${param.lineId}&lineName=${param.lineName}&isUsed=${param.isUsed}`, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 5);
                if (!isError) {
                    return;
                }
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 删除曲线
     */
    deletLineByIds(param: any, callback: Function, errCallback: Function) {
        return this.http.delete(`${this.devHost}/machine-learning/1.0/app/project-line/deletLineByIds`, this.setHeaders(Array.isArray(param) ? JSON.stringify(param) : JSON.stringify([param])))
            .subscribe((data) => {
                const isError = this.handleError(data, 6);
                if (!isError) {
                    return;
                }
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }

    // 设置默认预测曲线并调取接口记录
    /**
     * @param param  id
     * @param callback
     * @param errCallback
     */
    getNowForecastLine(param, callback, errCallback) {
        return this.http.get(`${this.devHost}/machine-learning/1.0/app/project-line/setDefaultPredLineById?lineId=${param}`)
            .subscribe((data) => {
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 单个预测联想获取code编码，每次联想最多只返回5个
     * single_search 搜索时调用
     */
    getCodeBySearch(param: string, callback: Function, errCallback: Function) {
        param = param.toUpperCase();
        return this.http.get(`${this.devHost}/machine-learning/1.0/app/es/getCodeBySearch?code=${param}`, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 7);
                if (!isError) {
                    return;
                }
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 用groupUnionCode获取对比组数据
     * @param param 参数对象
     * @param callback 成功回调
     * @param errCallback 失败回调
     */
    getCompareGroupWithGroupUnionCode(param: GetCompareGroupWithGroupUnionCode, callback: Function, errCallback: Function) {
        return this.http.get(`${this.devHost}/machine-learning/1.0/app/compare-group/getCompareGroupWithGroupUnionCode?groupUnionCode=${param.groupUnionCode}&projectId=${param.projectId}`, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 8);
                if (!isError) {
                    return;
                }
                if (callback) {
                    this.splitToFixedNum(data, true);
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }
    /**
     * 添加单组预测的对比组
     * @param param
     * @param callback
     * @param errCallback
     */
    addGroup2CompareGroup(param: AddGroup2CompareGroup, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/compare-group/addGroup2CompareGroup`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 9);
                if (!isError) {
                    return;
                }
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    this.splitToFixedNum(data, true);
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }
    /**
    * 获取单组预测的对比组codelist列表
     * @param param
     * @param callback
     * @param errCallback
     */
    getCompareGroupList(param: GetCompareGroupList, callback: Function, errCallback: Function) {
        return this.http.get(`${this.devHost}/machine-learning/1.0/app/compare-group/getCompareGroupList?groupUnionCode=${param.groupUnionCode}`, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 10);
                if (!isError) {
                    return;
                }
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }
    /**
     * 删除单组预测的对比组
     * @param param
     * @param callback
     * @param errCallback
     */
    removeGroup2CompareGroup(param: RemoveGroup2CompareGroup, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/compare-group/removeGroup2CompareGroup`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 11);
                if (!isError) {
                    return;
                }
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }
    /**
     * 更新单组预测的对比组
     * @param param
     * @param callback
     * @param errCallback
     */
    updataCompareGroupInfo(param: UpdataCompareGroupInfo, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/compare-group/updataCompareGroupInfo`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 12);
                if (!isError) {
                    return;
                }
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }
    /**
     *  单组预测导出
     * @param param
     * @param callback
     * @param errCallback
     */
    export(param: Export, callback: Function, errCallback: Function) {
        const newHeaders: object = Object.assign({}, this.setHeaders(), { responseType: 'blob' });
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/report/export`, param, newHeaders)
            .subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     *  单组预测导出
     * @param param
     * @param callback
     * @param errCallback
     */
    exportBatch(param: ExportBatch, callback: Function, errCallback: Function) {
        const newHeaders: object = Object.assign({}, this.setHeaders(), { responseType: 'blob' });
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/report/exportBatch`, param, newHeaders)
            .subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }



    // 批量预测
    doBatchForcast(param: DoBatchForcast, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/batch/doBatchForcast`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 14);
                if (!isError) {
                    return;
                }
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    this.splitToFixedNum(data, true);
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }

    // 批量预测
    getBatchForcastByFile(param: any, callback: Function, errCallback: Function) {

        // 监听文件的上传进度
        const newHeaders: object = Object.assign({}, this.setHeaders(), { reportProgress: true });
        const req = new HttpRequest('POST', `${this.devHost}/machine-learning/1.0/app/batch/getBatchForcastByFile`, param, newHeaders);

        return this.http.request(req).pipe(
            map(event => this.getEventMessage(event, (data) => { }))
        )
            .subscribe((data) => {
                const isError = this.handleError(data, 15);
                if (!isError) {
                    return;
                }
                lenovoPublic.selfLog2(() => console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }


    // 获取人工预测的单组预测的内容
    doArtificialForcast(param: DoArtificialForcast, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/artificial/doArtificialForcast`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 15);
                if (!isError) {
                    return;
                }
                lenovoPublic.selfLog2(() => console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }

    // 保存人工预测曲线预测曲线
    doArtificialLineWithParam(param: DoArtificialLineWithParam, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/artificial/doArtificialLineWithParam`, param, this.setHeaders())
            .subscribe((data) => {
                const isError = this.handleError(data, 15);
                if (!isError) {
                    return;
                }
                lenovoPublic.selfLog2(() => console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
      * @param param
      * @param callback
      * @param errCallback
      */
    dataExport(param, callback, errCallback) {
        const newHeaders: object = Object.assign({}, this.setHeaders(), { responseType: 'blob' });
        // return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/data/export`, param, newHeaders)
        // return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/data/export?groupUnionCode=${param}`, {}, newHeaders).pipe(
        //     map((event: any) => {
        //         this.getEventMessage(event, (data) => {
        //             console.log(data);
        //             console.log('chenggongle');
        //         });
        //     })
        // )
        //     .subscribe((data) => {
        //         console.log(data);
        //         // lenovoPublic.selfLog2(()=>console.log(data));
        //         if (callback) {
        //             callback(data);
        //         }
        //     }, (err) => {
        //         lenovoPublic.selfLog2(() => console.log(err));
        //         if (errCallback) {
        //             errCallback();
        //         }
        //     });
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/data/export?groupUnionCode=${param}`, {}, newHeaders).subscribe((data) => {
            console.log(data);
            // lenovoPublic.selfLog2(()=>console.log(data));
            if (callback) {
                callback(data);
            }
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log(err));
            if (errCallback) {
                errCallback();
            }
        });
    }

    private getEventMessage(event: HttpEvent<any>, fn: Function) {
        // console.log(event);
        // console.log(HttpEventType);
        // console.log(event.type);
        // console.log(HttpEventType.Sent);
        // console.log(HttpEventType.UploadProgress);
        // console.log(HttpEventType.Response);
        switch (event.type) {
            case HttpEventType.Sent:
                // return `开始上传文件`;
                break;
            // 正在上传
            case HttpEventType.UploadProgress:
                const percentDone = Math.round(100 * event['loaded'] / event['total']);
                // console.log(percentDone);
                break;
            // return `${percentDone}%`;
            // 上传完毕
            case HttpEventType.Response:
                // 回调
                fn(event.body);
                return event.body;
            default:
                break;
            // return `文件上传`;
        }

    }

    /**
      * @param param
      * @param callback
      * @param errCallback
      */
    dataImport(param, callback, errCallback) {
        const newHeaders: object = Object.assign({}, this.setHeaders(), {});
        // return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/data/export`, param, newHeaders)
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/data/import`, param, newHeaders).subscribe((data) => {
            // lenovoPublic.selfLog2(()=>console.log(data));
            if (callback) {
                callback(data);
            }
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log(err));
            if (errCallback) {
                errCallback();
            }
        });
    }

    /**
     * 修正在保量的上传
     */
    public uploadCustomModifyWarranty(param, callback, errCallback) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/data/uploadCustomModifyWarranty`, param, this.setHeaders())
            .subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 修正图表点击完成按钮时触发获取线
     * @param param
     * @param callback
     * @param errCallback
     */
    modifyRaByLineId(param, callback, errCallback) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project-line/modifyRaByLineId`, param, this.setHeaders())
            .subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }

    /**
     * 上传修正信息
     * @param param 参数
     * @param callback 成功回调
     * @param errCallback 失败回调
     */
    public uploadCustomModifyInfo(param, callback, errCallback) {
        return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/data/uploadCustomModifyInfo`, param, this.setHeaders())
            .subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (callback) {
                    callback(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
                if (errCallback) {
                    errCallback();
                }
            });
    }






    // 保存token
    setToken(token) {
        this.token = token;
        this.codebaseService.operatorSessionStroage.setSessionStroage('login_token_china', this.token);
    }
    // 获取token
    getToken() {
        if (this.codebaseService.operatorSessionStroage.getSessionStroage('login_token_china')) {
            this.token = this.codebaseService.operatorSessionStroage.getSessionStroage('login_token_china');
        }
        return this.token;
    }

    // 设置请求头
    setHeaders(body?) {
        const obj = {
            // headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`)
            //     .set('Content-Type', 'application/json;charset=UTF-8'),
            // withCredentials: true,
        };
        if (body) {
            obj['body'] = body;
        }
        return obj;
    }



    /**
     * login登录
     * 登录时调用
     */
    loginRegister(param: LoginRegister, callback: Function, errCallback: Function) {
        return this.http.post(`${this.devHostLogin}/oauth/rest_token`, param)
            .subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data);

                if (data) {
                    if (callback) {
                        callback(data);
                    }
                    this.setToken(data['access_token']);
                    this.codebaseService.operatorSessionStroage.setSessionStroage('login_token_china', this.token);
                } else {
                    this.tooltipBoxService.setTooltipBoxInfo({
                        message: [{
                            text: `账号或密码错误，请重新输入`,
                            style: {}
                        }]
                    }, 'alert');
                    // alert('账号或密码错误，请重新输入');
                    console.error('出錯了');
                }
            }, (err) => {
                if (errCallback) {
                    errCallback();
                }
            });
    }


    /**
     * 单组预测时用于更新数据
     */
    // updataCurrentGroupByProjectId(param: UpdataCurrentGroupByProjectId, callback, errCallback) {
    //     return this.http.post(`${this.devHost}/machine-learning/1.0/app/project/updataCurrentGroupByProjectId`, param, this.setHeaders())
    //         .subscribe((data) => {
    //             if (data) {
    //                 if (callback) {
    //                     callback(data);
    //                 }
    //             } else {
    //                 console.error('出錯了');
    //             }
    //         }, (err) => {
    //             if (errCallback) {
    //                 errCallback();
    //             }
    //         });
    // }


    handleError(data, num) {
        if (!data) {
            return false;
        }
        if (data.returnCode !== 0 && data.returnCode !== 200 && data.returnCode !== 304) {
            lenovoPublic.selfLog2(() => console.log(num));
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: data.msg,
                    style: {}
                }]
            }, 'alert');
            // alert(JSON.stringify({ data: data.msg, id: num }));
            this.loadingService.hideLoading();
            return false;
        }
        return true;
    }

    // 保留parameter参数区域的小数位数
    splitToFixedNum(data, isPercentage) {
        if (Array.isArray(data)) {
            data.map((item) => {
                this.splitToFixedNum(item, isPercentage);
            });
        } else if (typeof data === 'object') {
            // tslint:disable-next-line:forin
            for (const mm in data) {
                if (isPercentage) {
                    if (mm === 'flRaByMounth' || mm === 'aiUsageRaByMounth') {
                        data[mm] = Number(lenovoPublic.toFixedNum({ value: data[mm], num: 4, param: mm, isPercentage: isPercentage }));
                    } else if (mm === 'aiInwarrantyRate' || mm === 'flWarranty') {
                        data[mm] = Number(lenovoPublic.toFixedNum({ value: data[mm], num: 2, param: mm, isPercentage: isPercentage }));
                    }
                } else {
                    if (mm === 'flRaByMounth' || mm === 'aiUsageRaByMounth') {
                        data[mm] = lenovoPublic.toFixedNum({ value: data[mm], num: 4, param: mm, isPercentage: isPercentage });
                    } else if (mm === 'aiInwarrantyRate' || mm === 'flWarranty') {
                        data[mm] = lenovoPublic.toFixedNum({ value: data[mm], num: 2, param: mm, isPercentage: isPercentage });
                    }
                }

                // if (mm === 'baseTimeLine') {
                //     data[mm].map((x, xIndex) => {
                //         data[mm][xIndex] = x.length === 7 ? x + '-01' : x;
                //     });
                //     data[mm] = Array.from(new Set(data[mm]));
                // }

                this.splitToFixedNum(data[mm], isPercentage);
            }
        } else if (typeof data === 'string') {

        }
    }
}
