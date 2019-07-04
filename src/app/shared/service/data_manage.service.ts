import { Injectable } from '@angular/core';
import { CodebaseService } from './codebase.service';
import { LoadingService } from './loading.service';
import { GetJsonService } from './getJson.service';
import { TooltipBoxService } from './tooltipBox.service';
import { InterfaceParamModelService } from './interfaceParamModel.service';
import { Router } from '@angular/router';
declare const lenovoPublic;
@Injectable()
export class DataManageService {
    constructor(
        private codebaseService: CodebaseService,
        private getJsonService: GetJsonService,
        private loadingService: LoadingService,
        private tooltipBoxService: TooltipBoxService,
        private interfaceParamModelService: InterfaceParamModelService,
        private router: Router
    ) {
        this.init();
        // setInterval(() => {
        //     lenovoPublic.selfLog2(()=>console.log(JSON.stringify(this.singleComparisonPnListManage)));
        // }, 300);
    }
    // pnList 列表管理--------start
    singleComparisonPnListManage: object[] = []; // 对比组pnlist管理
    AIComparisonPnListManage: object[] = []; // 对比组pnlist管理
    humanComparisonPnListManage: object[] = []; // 对比组pnlist管理
    batchComparisonPnListManage: object[] = []; // 对比组pnlist管理

    private init() {
        // lenovoPublic.selfLog2(()=>console.log(this.codebaseService.operatorSessionStroage.getSessionStroage('singleComparisonPnListManage')));
        // this.singleComparisonPnListManage = this.codebaseService.operatorSessionStroage.getSessionStroage('singleComparisonPnListManage') || this['singleComparisonPnListManage'];
        // this.batchComparisonPnListManage = this.codebaseService.operatorSessionStroage.getSessionStroage('batchComparisonPnListManage') || this['batchComparisonPnListManage'];
    }

    // 添加pnList数据
    public setComparisonPnListManage(pn: object) {
        const setData = (singleOrBatch) => {
            lenovoPublic.selfLog2(() => console.log(pn));
            const aa = new Set(this[singleOrBatch]);
            this[singleOrBatch] = Array.from(aa);
            const obj = Object.assign({}, {
                id: pn['id'],
                pnList: pn['pnList']
            });

            this[singleOrBatch][this[singleOrBatch].length] = obj;
            // this.codebaseService.operatorSessionStroage.setSessionStroage(singleOrBatch, this[singleOrBatch]);
        };
        this.comparisonPnListManageSetDataApply(setData);
    }
    // 获取pnList数据长度
    public getLengthComparisonPnListManage() {
        lenovoPublic.selfLog2(() => console.log(this.getComparisonPnListManageData()));
        return this.getComparisonPnListManageData().length;
    }
    // 修改pnList列表
    public changeComparisonPnListManageData(id, obj, callback) {
        lenovoPublic.selfLog2(() => console.log(obj, id));
        const setData = (singleOrBatch) => {
            // lenovoPublic.selfLog2(()=>console.log(this.singleComparisonPnListManage));
            // if (this.getComparisonPnListManageData().some((item) => {
            //     return item['pnList'].length !== 0 && obj['pnList'].length !== 0 && item['pnList'].sort().toString() === obj['pnList'].sort().toString() && id !== item.id;
            // })) {
            //     alert(JSON.stringify({ data: '当前修改的pn已存在，不能重复添加', id: 140 }));
            //     return;
            // }
            lenovoPublic.isShowGetJsonLoading.call(this, true);
            this.getJsonService.updataCompareGroupInfo(
                this.interfaceParamModelService.updataCompareGroupInfo({
                    codesList: [...obj['pnList']],
                    id: id,
                }),
                (data) => {
                    lenovoPublic.selfLog2(() => console.log(data));
                    // this[singleOrBatch] = [];

                    // obj['pnList'].map((item) => {
                    //     this[singleOrBatch].push(item);
                    // });

                    this[singleOrBatch].map((item, itemIndex) => {
                        if (item['id'] === id) {
                            for (const [key, value] of Object.entries(obj)) {
                                this[singleOrBatch][itemIndex][key] = value;
                            }
                        }
                    });

                    // tslint:disable-next-line:no-unused-expression
                    callback && callback();
                    lenovoPublic.selfLog2(() => console.log('删除成功'));
                    // this.codebaseService.operatorSessionStroage.setSessionStroage(singleOrBatch, this[singleOrBatch]);
                    lenovoPublic.isShowGetJsonLoading.call(this);
                },
                (err) => {
                    lenovoPublic.selfLog2(() => console.log(err));
                });
            // this.codebaseService.operatorSessionStroage.setSessionStroage(singleOrBatch, this[singleOrBatch]);
        };
        this.comparisonPnListManageSetDataApply(setData);
    }
    // 获取pnList数据
    public getComparisonPnListManageData() {
        let data = null;
        const setData = (singleOrBatch) => {
            // return this.codebaseService.operatorSessionStroage.getSessionStroage(singleOrBatch) || this[singleOrBatch];
            return this[singleOrBatch];
        };
        data = this.comparisonPnListManageSetDataApply(setData);
        return data;
    }

    // 根据id删除其中的一条数据
    public delComparisonPnListManage(id, callback) {
        const setData = (singleOrBatch) => {
            lenovoPublic.isShowGetJsonLoading.call(this, true);
            this.getJsonService.removeGroup2CompareGroup(
                this.interfaceParamModelService.removeGroup2CompareGroup({
                    id: id
                }),
                // { id: id },
                (data) => {
                    lenovoPublic.selfLog2(() => console.log(data));
                    this[singleOrBatch].map((item, itemIndex) => {
                        if (item['id'] === id) {
                            this[singleOrBatch].splice(itemIndex, 1);
                        }
                    });
                    // tslint:disable-next-line:no-unused-expression
                    callback && callback();
                    // this.codebaseService.operatorSessionStroage.setSessionStroage(singleOrBatch, this[singleOrBatch]);
                    lenovoPublic.isShowGetJsonLoading.call(this);
                },
                (err) => {
                    lenovoPublic.selfLog2(() => console.log(err));
                });
        };
        this.comparisonPnListManageSetDataApply(setData);
    }

    // 更新ComparisonPnListManage
    public updateComparisonPnListManage(callback) {
        lenovoPublic.isShowGetJsonLoading.call(this, true);
        lenovoPublic.selfLog2(() => console.log(123 + '123123123123'));
        const groupUnionCode = this.getSingleCurGroupUnionCode();
        this.getJsonService.getCompareGroupList(
            this.interfaceParamModelService.getCompareGroupList({
                groupUnionCode
            }),
            // { groupUnionCode: this.getSingleCurGroupUnionCode() },
            (data) => {
                this.clearPnList();
                data.data.compareGroups.map((item) => {
                    const obj = Object.assign({}, {
                        pnList: [...item.codeList],
                        id: item.compareModelId
                    });
                    // if (this.getComparisonPnListManageData().some((cont) => {
                    //     return cont.compareModelId === item.compareModelId;
                    // })) {
                    //     lenovoPublic.selfLog2(()=>console.log('有重复的pn,将不显示'));
                    // } else {
                    this.setComparisonPnListManage(obj);
                    // }
                });
                // tslint:disable-next-line:no-unused-expression
                callback && callback(data);
            },
            (err) => {
                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: `${err}`,
                        style: {}
                    }]
                }, 'alert');
                // alert(err);
                console.error(err);
            });
    }

    // 清除pnList列表
    public clearPnList() {
        const setData = (singleOrBatch) => {
            this[singleOrBatch].length = 0;
            this.codebaseService.operatorSessionStroage.delSessionStroage(singleOrBatch);
        };
        this.comparisonPnListManageSetDataApply(setData);
    }

    // 抽出使得简化函数的调用
    private comparisonPnListManageSetDataApply(callback) {
        let data = null;
        const obj = {
            single: 'singleComparisonPnListManage',
            AIPrediction: 'AIComparisonPnListManage',
            humanPrediction: 'humanComparisonPnListManage',
            batch: 'batchComparisonPnListManage',
        };
        // 简化函数，根据路由判断当前要使用哪一个对比组的管理的数组
        data = callback(obj[this.curSingleOrBatchOrHistory()]);
        return data;
    }
    // pnList 列表管理--------end


    // 单组预测的输入pnlist列表进行保存，以在点击返回时进行重新获取---------start
    // tslint:disable-next-line:member-ordering
    saveSinglePnList = [];
    // tslint:disable-next-line:member-ordering
    saveAISinglePnList = [];
    // tslint:disable-next-line:member-ordering
    saveHumanSinglePnList = [];
    // tslint:disable-next-line:member-ordering
    saveBatchPnList = [];
    // tslint:disable-next-line:member-ordering
    saveBatchSingleDetailsPnList = []; // 保存批量预测跳转到单组预测详情页面的pn列表
    // tslint:disable-next-line:member-ordering
    saveHistorySingleDetailsPnList = []; // 保存历史记录跳转到单组预测详情页面的pn列表
    setSaveSingleOrBatchPnList(pnlist, key?) {
        lenovoPublic.selfLog2(() => console.log(key, pnlist));
        const setData = (singleOrBatch) => {
            this[key || singleOrBatch] = [...pnlist];
            this.codebaseService.operatorSessionStroage.setSessionStroage(key || singleOrBatch, this[key || singleOrBatch]);
        };
        this.savePnlistApply(setData);
    }
    getSaveSingleOrBatchPnList() {
        const setData = (singleOrBatch) => {
            return this[singleOrBatch].length !== 0 ? this[singleOrBatch] : this.codebaseService.operatorSessionStroage.getSessionStroage(singleOrBatch);
        };
        return this.savePnlistApply(setData);
    }
    clearSaveSingleOrBatchPnList() {
        const setData = (singleOrBatch) => {
            this[singleOrBatch].length = 0;
            this.codebaseService.operatorSessionStroage.delSessionStroage(singleOrBatch);
        };
        this.savePnlistApply(setData);
    }
    savePnlistApply(callback) {
        let data: any = [];

        if (this.curRouter().indexOf('batchSingleDetails') !== -1) {
            data = callback('saveBatchSingleDetailsPnList');
        } else if (this.curRouter().indexOf('batchComparisonDetails') !== -1) {
            data = callback('saveBatchSingleDetailsPnList');
        } else if (this.curRouter().indexOf('historySingleDetails') !== -1) {
            data = callback('saveHistorySingleDetailsPnList');
        } else if (this.curRouter().indexOf('historyComparisonDetails') !== -1) {
            data = callback('saveHistorySingleDetailsPnList');
        } else if (this.curSingleOrBatchOrHistory() === 'single') {
            data = callback('saveSinglePnList');
        } else if (this.curSingleOrBatchOrHistory() === 'AIPrediction') {
            data = callback('saveAISinglePnList');
        } else if (this.curSingleOrBatchOrHistory() === 'humanPrediction') {
            data = callback('saveHumanSinglePnList');
        } else if (this.curSingleOrBatchOrHistory() === 'batch') {
            data = callback('saveBatchPnList');
        }
        return data;
    }
    // 单组预测的输入pnlist列表进行保存，以在点击返回时进行重新获取---------end



    // 单组预测的当前currentGroupUnionCode------------start
    // tslint:disable-next-line:member-ordering
    singleCurGroupUnionCode = '';
    // tslint:disable-next-line:member-ordering
    aiCurGroupUnionCode = '';
    // tslint:disable-next-line:member-ordering
    humanCurGroupUnionCode = '';
    // tslint:disable-next-line:member-ordering
    batchCurGroupUnionCode = '';
    // tslint:disable-next-line:member-ordering
    historyCurGroupUnionCode = '';
    setSingleCurGroupUnionCode(param) {
        lenovoPublic.selfLog2(() => console.log(param));
        const setData = (singleOrBatch) => {
            this[singleOrBatch] = param;
            this.codebaseService.operatorSessionStroage.setSessionStroage(singleOrBatch, this[singleOrBatch]);
        };

        this.saveCurGroupUnionCodeApply(setData);
        // this.singleCurGroupUnionCode = param;
        // lenovoPublic.selfLog2(()=>console.log(param));
        // this.codebaseService.operatorSessionStroage.setSessionStroage('singleCurGroupUnionCode', this.singleCurGroupUnionCode);
    }
    getSingleCurGroupUnionCode() {
        const setData = (singleOrBatch) => {
            return this[singleOrBatch].length !== 0 ? this[singleOrBatch] : this.codebaseService.operatorSessionStroage.getSessionStroage(singleOrBatch);
        };
        return this.saveCurGroupUnionCodeApply(setData);
    }
    clearSingleCurGroupUnionCode() {
        const setData = (singleOrBatch) => {
            this[singleOrBatch].length = 0;
            this.codebaseService.operatorSessionStroage.delSessionStroage(singleOrBatch);
        };
        this.saveCurGroupUnionCodeApply(setData);
        // this.singleCurGroupUnionCode = '';
        // this.codebaseService.operatorSessionStroage.delSessionStroage('singleCurGroupUnionCode');
    }

    saveCurGroupUnionCodeApply(callback) {
        let data: any = [];
        if (this.curSingleOrBatchOrHistory() === 'single') {
            data = callback('singleCurGroupUnionCode');
        } else if (this.curSingleOrBatchOrHistory() === 'AIPrediction') {
            data = callback('aiCurGroupUnionCode');
        } else if (this.curSingleOrBatchOrHistory() === 'humanPrediction') {
            data = callback('humanCurGroupUnionCode');
        } else if (this.curSingleOrBatchOrHistory() === 'batch') {
            data = callback('batchCurGroupUnionCode');
        }


        if (this.curRouter().indexOf('batchSingleDetails') !== -1) {
            data = callback('batchCurGroupUnionCode');
        }

        if (this.curRouter().indexOf('historySingleDetails') !== -1) {
            data = callback('historyCurGroupUnionCode');
        }
        return data;
    }
    // 单组预测的当前currentGroupUnionCode------------end


    // 页面的路由保存，点击侧边栏跳转路由时，需记录大路由下的页面，点击回来时，回到离开时的页面-----------------------start
    // tslint:disable-next-line:member-ordering
    historyRoute = {
        singlePrediction: '/singlePrediction',
        AIPrediction: '/AIPrediction',
        humanPrediction: '/humanPrediction',
        batchPrediction: '/batchPrediction',
        predictionHistory: '/predictionHistory',
        warningHistory: '/warningHistory',

    };
    setHistoryRoute(param, hash) {
        this.historyRoute[param] = hash;
    }
    getHistoryRoute(param) {
        return this.historyRoute[param];
    }
    // 页面的路由保存，点击侧边栏跳转路由时，需记录大路由下的页面，点击回来时，回到离开时的页面-----------------------end


    // 判断当前是否登陆-------start
    // tslint:disable-next-line:member-ordering
    isLogined = false;
    setLogined(isLogined) {
        this.isLogined = isLogined;
        this.codebaseService.operatorSessionStroage.setSessionStroage('isLogined', isLogined);
    }
    getLogined() {
        return this.isLogined || this.codebaseService.operatorSessionStroage.getSessionStroage('isLogined');
    }
    clearLoginInfo() {
        this.isLogined = false;
        this.codebaseService.operatorSessionStroage.delSessionStroage('isLogined');
    }
    // 判断当前是否登陆-------end

    // 单组预测详情页面图表参数区域是否正在编辑中---------start
    // 组件的嵌套层次过深，无法获取状态，使用服务同步数据
    // tslint:disable-next-line:member-ordering
    curIsEditIng: boolean = false;
    setCurIsEditIng(isTrue) {
        this.curIsEditIng = isTrue;
    }
    getCurIsEditIng() {
        return this.curIsEditIng;
    }
    // 单组预测详情页面图表参数区域是否正在编辑中---------end


    // 批量预测当前是显示panel面板还是list列表---------start
    // tslint:disable-next-line:member-ordering
    showPanelOrList = false;
    setShowPanelOrList(param) {
        this.showPanelOrList = param;
        this.codebaseService.operatorSessionStroage.setSessionStroage('showPanelOrList', param);
    }
    getShowPanelOrList() {
        // lenovoPublic.selfLog2(()=>console.log(!this.codebaseService.operatorSessionStroage.getSessionStroage('showPanelOrList') && String(this.codebaseService.operatorSessionStroage.getSessionStroage('showPanelOrList')) === 'false'));
        // lenovoPublic.selfLog2(()=>console.log(typeof this.codebaseService.operatorSessionStroage.getSessionStroage('showPanelOrList'), String(this.codebaseService.operatorSessionStroage.getSessionStroage('showPanelOrList')) === 'false'));
        if (String(this.codebaseService.operatorSessionStroage.getSessionStroage('showPanelOrList')) === 'false') {
            return false;
        } else if (String(this.codebaseService.operatorSessionStroage.getSessionStroage('showPanelOrList')) === 'true') {
            return true;
        } else {
            return this.showPanelOrList;
        }
    }
    // 批量预测当前是显示panel面板还是list列表---------end


    // 批量预测保存排序后的数据--------start
    // tslint:disable-next-line:member-ordering
    saveBatchSortedData: any[] = [];
    setSaveBatchSortedData(param) {
        this.saveBatchSortedData = [];
        this.saveBatchSortedData.length = 0;
        param.map((item) => {
            this.saveBatchSortedData[this.saveBatchSortedData.length] = Object.assign({}, item);
        });
        this.codebaseService.operatorSessionStroage.setSessionStroage('saveBatchSortedData', param);
    }
    getSaveBatchSortedData() {
        return this.saveBatchSortedData.length !== 0 ? this.saveBatchSortedData : this.codebaseService.operatorSessionStroage.getSessionStroage('saveBatchSortedData');
    }
    delSaveBatchSortedData() {
        this.saveBatchSortedData.length = 0;
        this.codebaseService.operatorSessionStroage.delSessionStroage('saveBatchSortedData');
    }
    // 批量预测保存排序后的数据--------end


    // 是否显示修改密码页------------start
    // 记录从哪里点击修改密码过来的，点击返回回到原来的页面
    // tslint:disable-next-line:member-ordering
    recordRouter = '';
    setIsShowEditPassword(isShow) {
        if (isShow) {
            this.recordRouter = (window.location.hash).split('#')[1];
            this.codebaseService.operatorSessionStroage.setSessionStroage('recordRouter', this.recordRouter);
            this.router.navigate(['./editPassword']);
        } else {
            this.recordRouter = this.recordRouter || this.codebaseService.operatorSessionStroage.getSessionStroage('recordRouter');
            let router = this.recordRouter || '/';
            const paramObj = {};
            if (router.indexOf(';') !== -1) {
                router = router.split(';')[0];
                const paramArr = router.split(';');
                for (let i = 1; i < paramArr.length; i++) {
                    paramObj[paramArr[i].split('=')[0]] = paramArr[i].split('=')[1];
                }
            }
            if (JSON.stringify(paramObj) === '{}') {
                this.router.navigate(['.' + router]);
            } else {
                this.router.navigate(['.' + router, paramObj]);
            }
        }
    }
    // 是否显示修改密码页------------end



    // 初始化参数--------start
    reInit() {
        this.singleComparisonPnListManage = [];
        this.AIComparisonPnListManage = []; // 对比组pnlist管理
        this.humanComparisonPnListManage = []; // 对比组pnlist管理
        this.batchComparisonPnListManage = [];

        this.saveSinglePnList = [];
        this.saveBatchPnList = [];
        this.saveAISinglePnList = [];
        this.saveHumanSinglePnList = [];
        this.saveBatchSingleDetailsPnList = [];
        this.saveHistorySingleDetailsPnList = [];

        this.aiCurGroupUnionCode = '';
        this.humanCurGroupUnionCode = '';
        this.singleCurGroupUnionCode = '';
        this.batchCurGroupUnionCode = '';
        this.historyCurGroupUnionCode = '';

        this.historyRoute = {
            singlePrediction: '/singlePrediction',
            AIPrediction: '/AIPrediction',
            humanPrediction: '/humanPrediction',
            batchPrediction: '/batchPrediction',
            predictionHistory: '/predictionHistory',
            warningHistory: '/warningHistory',
        };

        this.isLogined = false;
        this.curIsEditIng = false;
        this.showPanelOrList = false;
        this.saveBatchSortedData = [];
        this.recordRouter = '';
        this.tooltipBoxService.clearToolTipBoxInfo();
    }
    // 初始化参数--------end



    // 是否放大图表区域-----仅限于AI和人工预测的详情预测页面，如果是批量预测跳转过去的，根据实际需求进行传值修改
    // tslint:disable-next-line:member-ordering
    isScaleChart = {
        AIPrediction: false, // AI预测的单组预测的图标区域放大
        humanPrediction: false // 人工预测的单组预测的
    };
    // 设置图表放大或缩小
    setScaleChart(param, isBig) {
        this.isScaleChart[param] = isBig;
    }
    // 获取图表放大或缩小
    getScaleChart(param) {
        return this.isScaleChart[param];
    }















































    public curRouter() {
        return window.location.hash;
    }

    // 判断当前是哪一个路由
    public curSingleOrBatchOrHistory() {
        let curRouter = '';
        const url = window.location.hash;
        if (url.indexOf('batchPrediction') !== -1) {
            curRouter = 'batch';
        } else if (url.indexOf('predictionHistory') !== -1) {
            curRouter = 'history';
        } else if (url.indexOf('singlePrediction') !== -1) {
            curRouter = 'single';
        } else if (url.indexOf('AIPrediction') !== -1) {
            curRouter = 'AIPrediction';
        } else if (url.indexOf('humanPrediction') !== -1) {
            curRouter = 'humanPrediction';
        } else {
            curRouter = 'login';
        }
        return curRouter;
    }
}
