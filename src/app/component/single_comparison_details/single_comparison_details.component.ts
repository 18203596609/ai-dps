import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { GetJsonService } from '../../shared/service/getJson.service';
import { UpdataSubjectService } from '../../shared/service/updata_subject.service';
import { LoadingService } from '../../shared/service/loading.service';
import { SideBarService } from '../../shared/service/sidebar.service';
import { TooltipBoxService } from '../../shared/service/tooltipBox.service';
import { DataManageService } from '../../shared/service/data_manage.service';
import { InterfaceParamModelService } from '../../shared/service/interfaceParamModel.service';
import { SwiperFun } from './swiper_fun';
import { SingleComparisonDiagramParameterComponent } from './single_comparison_diagram_parameter/single_comparison_diagram_parameter.component';
import { Router, ActivatedRoute } from '@angular/router';
declare const $, Swiper, lenovoPublic;
@Component({
    selector: 'app-single-comparison-details',
    templateUrl: './single_comparison_details.component.html',
    styleUrls: ['./single_comparison_details.component.scss']
})

export class SingleComparisonDetailsComponent implements OnInit, OnDestroy, OnChanges {
    // param_yang----start
    dataIndexCurZu = 'fenlei'; // 指标列表中的分类结果和当前结果
    @Input() btnList: any = []; // 从单组预测详情页面传过来的pnlist列表
    @Output() returnToPredictionDetails = new EventEmitter(); // 返回事件
    selectListLi = [];
    curParamData: object[] = []; // 当前的所有数据
    isShowSearchBox = false; // 是否显示添加对比组的搜索框
    swiperIndex = 0; // 当前轮播的下标
    slidesPerView = 3; // 当前swiper可以显示的个数
    swiperFun = null; // 实例化swiper方法组件
    swiper = null; // swiper 组件轮播面板
    routeParam: any = {};
    // param_yang----end
    AINum = [];


    @ViewChild(SingleComparisonDiagramParameterComponent)
    private singleComparisonDiagramParameterComponent: SingleComparisonDiagramParameterComponent;

    constructor(
        private getJsonService: GetJsonService,
        private updataSubjectService: UpdataSubjectService,
        private loadingService: LoadingService,
        public sideBarService: SideBarService,
        private dataManageService: DataManageService,
        private tooltipBoxService: TooltipBoxService,
        private interfaceParamModelService: InterfaceParamModelService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.swiperFun = new SwiperFun();
    }
    intervalCollect = {};
    ngOnInit() {
        this.intervalCollect['timer'] = setInterval(() => {
            // lenovoPublic.selfLog2(()=>console.log(this.dataManageService.getSingleCurGroupUnionCode()));
            if (this.dataManageService.getSingleCurGroupUnionCode()) {
                // lenovoPublic.selfLog2(()=>console.log(1111111111111));
                this.dataManageService.updateComparisonPnListManage(() => {
                    const pnList = this.dataManageService.getLengthComparisonPnListManage() > 0 ? this.getAllPnList(this.dataManageService.getComparisonPnListManageData()) : this.getAllPnList(this.dataManageService.getSaveSingleOrBatchPnList());

                    this.btnList = pnList ? pnList : this.btnList;

                    this.watchAddEventlistener();

                    if (this.dataManageService.getLengthComparisonPnListManage() > 0) {
                        this.getAllDataApply(this.btnList, this.getAllDataApplyCallbackSuccess, this.getAllDataApplyCallbackErr);
                    } else {
                        this.getSingleData(this.btnList[0]);
                    }
                });
                clearInterval(this.intervalCollect['timer']);
            }
        }, 100);
        this.route.params.subscribe(x => {
            this.routeParam = x;
        });
    }

    ngOnChanges(changes: SimpleChanges) { }
    ngOnDestroy() {
        document.querySelector('.swiper-button-next').removeEventListener('click', this.swiperNextClick);
        document.querySelector('.swiper-button-prev').removeEventListener('click', this.swiperPrevClick);
        window.removeEventListener('resize', this.swiperResize);

        lenovoPublic.publicClearTimeout('all');
        // tslint:disable-next-line:forin
        for (const i in this.intervalCollect) {
            clearInterval(this.intervalCollect[i]);
        }
    }

    // show页面发送的下拉框内容
    setfcSelect(param) {
        // this.selectListLi.push(param);
        for (const item of this.selectListLi) {
            if (item.pn.includes(param.pn)) {
                item.selectArr = param.selectArr;
                return;
            }
        }
        this.selectListLi.push(param);
        // lenovoPublic.selfLog2(()=>console.log(param, this.selectListLi, 'selecgLi'));
    }

    // show页面发送的AI算法参数
    setAINum(param) {
        this.AINum[param['index']] = param.data;
        // lenovoPublic.selfLog2(()=>console.log(param, 'Ai算法参数', this.AINum));
    }

    // 获取当前的pnlist列表
    private getAllPnList(data) {
        const pnList = [];
        if (data[0] && typeof data[0] === 'string') {
            pnList[0] = data;
        } else if (data[0] && typeof data[0] === 'object') {
            data.map((item) => {
                pnList.push(item.pnList);
            });
        }
        return pnList;
    }

    // 获取所有数据
    private getAllData(projectId) {
        return new Promise((resolve, reject) => {
            // 发送请求
            this.getJsonService.getProjectByCodes(this.setCreateProjectParam(projectId),
                (data) => {
                    data['pnList'] = projectId;
                    this.setCurParamData(data, projectId);
                    resolve(data);
                },
                (err) => {
                    console.error(err);
                    reject(new Error(err));
                });
        });
    }

    // 调用getAllData获取数据---不会触发添加对比组的函数，不会添加新组
    private getAllDataApply(param, successCallback, errCallback) {
        // tslint:disable-next-line:no-unused-expression
        this.swiper && this.swiperFun.saveCurIndex(this.swiper);
        lenovoPublic.isShowGetJsonLoading.call(this, true);
        const promises = [...param].map((item) => {
            return this.getAllData(item);
        });

        Promise.all(promises).then((data) => {
            // tslint:disable-next-line:no-unused-expression
            successCallback && successCallback.call(this, data);
        }).catch((err) => {
            console.error(err);
            // tslint:disable-next-line:no-unused-expression
            errCallback && errCallback.call(this, err);
        });
    }

    // 调用getAllData接口获取数据
    private getAllDataApplyCallbackSuccess(data) {
        if (data.some((item) => item.returnCode !== 0 && item.returnCode !== 200 && item.returnCode !== 304)) {
            // lenovoPublic.selfLog2(()=>console.log(data));
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: `请求错误`,
                    style: {}
                }]
            }, 'alert');
            // alert('请求错误');
            lenovoPublic.isShowGetJsonLoading.call(this);
            return;
        }

        if (!this.swiper) {
            this.newSwiper();
            this.swiperResize(null);
        }

        this.updataSubjectService.emitDiagramBottomInfo(this.curParamData);
        this.swiperFun.setCurIndex(this.swiper);
        lenovoPublic.isShowGetJsonLoading.call(this);
    }

    // 获取所有数据失败回调
    private getAllDataApplyCallbackErr(err) {
        this.tooltipBoxService.setTooltipBoxInfo({
            message: [{
                text: `${JSON.stringify(err)}`,
                style: {}
            }]
        }, 'alert');
        // alert(JSON.stringify(err));
        console.error(err);
    }


    // 单组预测对比组添加新组
    private getSingleData(projectId) {
        lenovoPublic.isShowGetJsonLoading.call(this, true);
        // lenovoPublic.selfLog2(()=>console.log(this.dataManageService.getSingleCurGroupUnionCode()));
        // lenovoPublic.selfLog2(()=>console.log(projectId));
        if (lenovoPublic.pnListIsRepeat(this.curParamData, Object.assign({}, { 'pnList': projectId }))) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: `当前修改的pn已存在，不能重复添加`,
                    style: {}
                }]
            }, 'alert');
            // alert(JSON.stringify({ data: '当前修改的pn已存在，不能重复添加', id: 130 }));
            lenovoPublic.isShowGetJsonLoading.call(this);
            return;
        }
        // if (this.curParamData.some((item) => item['pnList'].sort().toString() === projectId.sort().toString())) {
        //     alert(JSON.stringify({ data: '当前pn已存在，不能重复添加', id: 130 }));
        //     lenovoPublic.isShowGetJsonLoading.call(this);
        //     return;
        // }

        const srcGroupUnionCode = this.dataManageService.getSingleCurGroupUnionCode();
        this.getJsonService.addGroup2CompareGroup(
            this.interfaceParamModelService.addGroup2CompareGroup({
                forcastCodes: projectId,
                // flRaByMounth: 0.0001,
                // flWarranty: 0.01,
                // last_time_buy: '',

                standerWarrantyLength: '',
                raByMounth: '0',
                extendWarranty: '0.05',
                last_time_buy: '',
                scaleFactors: lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction' ? [
                    {
                        scaleFactor: '0.7',
                        beginTime: '2019-06',
                        endTime: '2020-07'
                    },
                    {
                        scaleFactor: '0.8',
                        beginTime: '2020-8',
                        endTime: '2021-8'
                    }
                ] : [],
                raByYear: '1',
                calculateType: '5',

                srcGroupUnionCode,
            }),
            (data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (!this.swiper) {
                    this.newSwiper();
                    this.swiperResize(null);
                }

                data['pnList'] = projectId;
                this.setCurParamData(data, projectId);

                this.updataSubjectService.emitDiagramBottomInfo(this.curParamData);
                this.swiperFun.setCurIndex(this.swiper);
                lenovoPublic.isShowGetJsonLoading.call(this);

            },
            (err) => {
                console.error(err);
            });
    }

    // 点击设置默认预测曲线时修改父组件数据---设置默认预测曲线时联动参数
    public changeParentData(cont) {
        const type = cont.type;
        const param = cont.data;
        // lenovoPublic.selfLog2(()=>console.log(cont));
        if (type === 'setDefForecastLine') {
            // lenovoPublic.selfLog2(()=>console.log(param));
            // 修改selfGroupModel数据-----start
            // tslint:disable-next-line:prefer-const
            let { allData, lineName, kIndex, mIndex, lineId, defaultForecast } = param[0];

            let onlyId = '';
            allData.map((item) => {
                onlyId = item.onlyId ? item.onlyId : '';
            });

            for (let i = 0; i < this.curParamData.length; i++) {
                if (this.curParamData[i]['onlyId'] === onlyId) {
                    kIndex = i;
                    break;
                }
            }
            // let curLine: any;
            // if (Array.isArray(defaultForecast[0])) {
            //     if (!Array.isArray(defaultForecast[0][0])) {
            //         curLine = Array.isArray(defaultForecast[0][0]);
            //     }
            // } else {
            //     curLine = defaultForecast[0];
            // }

            const curLine = Array.isArray(defaultForecast[0]) ? Array.isArray(defaultForecast[0][0]) ? alert('还是数组') : defaultForecast[0][0] : defaultForecast[0];
            // lenovoPublic.selfLog2(()=>console.log(curLine));
            let selfGroupModel = curLine['selfGroupModel'];

            if (!selfGroupModel) {
                selfGroupModel = {
                    accuracyRate: '-',
                    hitRate: '-',
                    coverageRatio: '-',
                    lostCount: '-',
                    overCount: '-',
                    overrunCost: '-'
                };
            }
            this.curParamData[kIndex]['dataIndex']['selfGroupModel'] = selfGroupModel;
            // 修改selfGroupModel数据-----end

            // 修改默认预测曲线时修改-----修改月平均需求率-------start
            this.curParamData[kIndex]['projectModel']['historyModel']['nAverageMounth'] = selfGroupModel['nAverageMounth'];
            // 修改默认预测曲线时修改-----修改月平均需求率-------end

            // 修改当前预测曲线的数值-------start
            if (curLine['value']) {
                this.curParamData[kIndex]['curPrediction']['lTotalFocast'] = 0;
                curLine['value'].map((item) => {
                    this.curParamData[kIndex]['curPrediction']['lTotalFocast'] += (+item);
                });
            }

            this.curParamData[kIndex]['curPrediction']['lTotalFocast'] = parseInt(this.curParamData[kIndex]['curPrediction']['lTotalFocast'], 10).toFixed(0);

            // 计算月份相差
            const getIntervalMonth = (startDate, endDate) => {
                const startMonth = startDate.getMonth();
                const endMonth = endDate.getMonth();
                const intervalMonth = (startDate.getFullYear() * 12 + startMonth) - (endDate.getFullYear() * 12 + endMonth);
                return intervalMonth;
            };

            this.curParamData[kIndex]['curPrediction']['forcastPeriod'] = (getIntervalMonth(new Date(curLine.timeLine[curLine.timeLine.length - 1]), new Date(curLine.timeLine[0]))).toFixed(0);
            // lenovoPublic.selfLog2(()=>console.log(this.curParamData[kIndex]['curPrediction']));
            // 修改当前预测曲线的数值-------end
        }

        if (type === 'clickConfirmUse') {
            const [bUsed, lineType, timeLine, kIndex] = [param[0], param[1], param[2], param[3]];
            this.curParamData[kIndex]['ltbList'].push(timeLine[0]);
        }

    }

    // 设置添加本页面的参数到数组中
    private setCurParamData(data, projectId) {

        const obj = Object.assign({}, {
            id: new Date().getTime() + data.data.projectModel.groupModel.groupUnionCode,
            data: data.data,
            msg: data.msg,
            process: data.process,
            returnCode: data.returnCode,
            projectModel: data.data.projectModel,
            btnList: projectId.join(';'),
            pnList: projectId, // pnList 数组列表
            curIsEditIng: false, // 当前是否在编辑状态
            isShowDetails: false, // 当前是否显示详情
            groupUnionCode: data.data.projectModel.groupModel.groupUnionCode,
            selectList: this.selectListLi, // 当前的颜色列表
            materieList: [], // 当前的查看列表显示物料号的等信息
            ltbList: [], // 当前该显示的ltb时间信息
            curPrediction: {
                lTotalFocast: data.data.projectModel.lTotalFocast,
                forcastPeriod: data.data.projectModel.forcastPeriod
            },
            dataIndex: {
                selfGroupModel: {
                    accuracyRate: '-',
                    hitRate: '-',
                    coverageRatio: '-',
                    lostCount: '-',
                    overCount: '-',
                    overrunCost: '-'
                },
                separateModel: data.data.projectModel.indicateModel['separateModel']
            }
        });

        const setGroupUnionCode = (cont) => {
            if (Array.isArray(cont)) {
                cont.map((item) => {
                    setGroupUnionCode(item);
                });
            } else if (lenovoPublic.isObject(cont)) {
                // tslint:disable-next-line:forin
                for (const aa in cont) {
                    if (aa === 'diagramLines') {
                        cont[aa].map((item) => {
                            item.onlyId = obj.id;
                        });
                    }
                    setGroupUnionCode(cont[aa]);
                }
            }
        };

        setGroupUnionCode(obj.data);
        setGroupUnionCode(obj.projectModel);


        // obj['curPrediction']['forcastPeriod'] = parseInt(obj['curPrediction']['forcastPeriod'], 10);
        obj['projectModel']['historyModel']['stationaryKeepTime'] = parseInt(obj['projectModel']['historyModel']['stationaryKeepTime'], 10);

        // 获取查看列表数组
        const includePNs = obj.projectModel.groupModel;
        if (includePNs) {
            includePNs.includePNs.map((item) => {
                obj['materieList'].push(item);
            });
        }

        const timeline = obj.projectModel.diagramLines;
        if (timeline) {
            timeline.map((item) => {
                if (item.bUsed && item.lineType === 'keDiagramLineType_long_term_pred') {
                    obj.ltbList.push(item.timeLine[0]);
                }
            });

            timeline.map((item) => {
                if (item.selfGroupModel) {
                    obj['dataIndex']['selfGroupModel'] = item['selfGroupModel'];
                }
            });
        }


        if (lenovoPublic.pnListIsRepeat(this.curParamData, Object.assign({}, { 'pnList': projectId }))) {
            // lenovoPublic.selfLog2(()=>console.log(this.curParamData));
            // lenovoPublic.selfLog2(()=>console.log(data.data.projectModel.groupModel.groupUnionCode));
            // alert(JSON.stringify({ data: '当前修改的pn已存在，不能重复添加', id: 110 }));
            // return;
        } else {
            this.curParamData.push(obj);
        }

        // if (this.curParamData.some((item) => item['groupUnionCode'] === data.data.projectModel.groupModel.groupUnionCode)) {
        //     lenovoPublic.selfLog2(()=>console.log(this.curParamData));
        //     lenovoPublic.selfLog2(()=>console.log(data.data.projectModel.groupModel.groupUnionCode));
        //     alert(JSON.stringify({ data: '当前pn已存在groupUnionCode==' + data.data.projectModel.groupModel.groupUnionCode + '++++pnList==' + projectId, id: 110 }));
        // } else {
        //     this.curParamData.push(obj);
        // }
    }


    // 是否显示当前搜索框进行添加对比组
    public showSingleSearch(event) {
        this.isShowSearchBox = true;
    }

    // 跳转到对比组管理页面
    public turnToComparisonManage() {
        if (!this.routeParam.originPage) {
            this.router.navigate(['./singlePrediction/singleComparisonManage', this.routeParam]);
            return;
        }
        const obj = {
            'AIPredictionDetails': './AIPrediction/AIComparisonManage',
            'humanPredictionDetails': './humanPrediction/humanComparisonManage',
            'batchPredictionDetails': './batchPrediction/batchComparisonManage',
            'batchDetails': './batchPrediction/batchComparisonManage',
        };
        this.router.navigate([obj[this.routeParam.originPage], this.routeParam]);
    }

    // 是否显示详情参数的外框
    public isShowDetailsParamCenter() {
        return this.curParamData.some((item) => item['isShowDetails']);
    }

    // 是否显示参数详情
    private isShowDetails(param) {
        this.curParamData.map((item) => {
            if (item['id'] === param) {
                if (item['isShowDetails']) {
                    item['isShowDetails'] = false;
                } else {
                    this.dataIndexCurZu = 'fenlei';
                    item['isShowDetails'] = true;
                }
            } else {
                item['isShowDetails'] = false;
            }
        });
    }


    // parse getProjectByCodes 的参数
    private setCreateProjectParam(projectId) {
        // lenovoPublic.selfLog2(()=>console.log(projectId));
        const arr = [];
        projectId.map((item) => {
            arr.push(item);
        });
        const paramData = this.interfaceParamModelService.getProjectByCodes({
            forcastCodes: arr,

            standerWarrantyLength: '',
            raByMounth: '0',
            extendWarranty: '0.05',
            last_time_buy: '',
            scaleFactors: lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction' ? [
                {
                    scaleFactor: '0.7',
                    beginTime: '2019-06',
                    endTime: '2020-07'
                },
                {
                    scaleFactor: '0.8',
                    beginTime: '2020-8',
                    endTime: '2021-8'
                }
            ] : [],
            raByYear: '1',
            calculateType: '5',

            version: '1.0',
            type: lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction' ? 2 : 1,
            isusedsdk: false
        });

        if (lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction') {
            return Object.assign({}, paramData, { aiOrHumanPrediction: 'artificial' });
        } else {
            return Object.assign({}, paramData);
        }
    }

    // 返回到预测详情页面
    public returnToPredictionDetailsPage() {
        if (!this.routeParam.originPage) {
            this.router.navigate(['./singlePrediction/singleDetailsComponent']);
            return;
        }

        const obj = {
            'AIPredictionDetails': './AIPrediction/AIDetailsComponent',
            'humanPredictionDetails': './humanPrediction/humanDetailsComponent',
            'batchPredictionDetails': './batchPrediction/batchSingleDetails',
            'batchDetails': './batchPrediction/batchDetails',
        };
        this.router.navigate([obj[this.routeParam.originPage]]);
    }



    // 预测搜索框时间----------start
    // 关闭搜索栏事件
    public closeSearchBox(param) {
        this.isShowSearchBox = param;
    }

    // 预测按钮事件
    public startPrediction(param) {
        this.getSingleData(param);
        this.isShowSearchBox = false;
    }
    // 预测搜索框时间----------end


    // dataIndex 指标栏的切换
    public toogleFenZu(param) {
        this.dataIndexCurZu = param;
    }


    // swiper操作方法------------start
    private newSwiper() {
        this.swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            centeredSlides: false,
            spaceBetween: 23,
            loop: false,
            observer: true,
            noSwiping: true,
            // observeParents: true,
            // observeSlideChildren: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            // on: {
            //     touchStart: function (event) {
            //         lenovoPublic.selfLog2(()=>console.log('事件触发了', event));
            //     },
            //     touchEnd: function (event) {
            //         lenovoPublic.selfLog2(()=>console.log('guole', event));
            //     },
            // }
        });
    }

    // resize事件----swiper在resize时触发
    private swiperResize(param) {
        if (this.swiper) {
            lenovoPublic.publicClearTimeout('comparisonDetailsTimeout');
            lenovoPublic.publicSetTimeout('comparisonDetailsTimeout', 100, () => {
                let slidesPreviewNum = 0;
                const $panelDetails = $('.panel-details');
                const $panelDetailsW = parseInt($panelDetails.css('width'), 10);
                if ($panelDetailsW >= 1520) {
                    // if ($panelDetailsW >= 1680) {
                    slidesPreviewNum = this.swiperFun.updateSlidesPerView(this.swiper, 4);
                } else {
                    slidesPreviewNum = this.swiperFun.updateSlidesPerView(this.swiper, 3);
                }
                this.slidesPerView = slidesPreviewNum;
            });
        }
    }

    // 点击左右按钮时刷新swiper
    private swiperPrevClick() {
        this.swiperFun.update(this.swiper);
    }
    // 点击左右按钮时刷新swiper
    private swiperNextClick() {
        this.swiperFun.update(this.swiper);
    }
    // swiper操作方法------------end

    // 保存线方法-------start
    /**
     *
     * @param param  保存线的传参
     */
    public editSaveLines(param) {
        this.singleComparisonDiagramParameterComponent.editSaveLines(param);
    }

    /**
     *
     * @@param isShow 显示还是隐藏当前保存线的弹框
     */
    public isHideSavePop(isShow) {
        this.singleComparisonDiagramParameterComponent.isHideSavePop(isShow);
    }

    // tslint:disable-next-line:member-ordering
    isShowSavePop = false; // 是否显示当前弹框

    /**
     * @param isShow 是否显示保存线的弹框
     */
    public isShowPop(isShow) {
        this.isShowSavePop = isShow;
    }
    // 保存线方法-------end

    // tslint:disable-next-line:member-ordering
    placeholder = false; // 是否显示当前弹框

    /**
     * @param isShow 是否显示保存线的弹框
     */
    public updateSavePlaceHolder(name) {
        this.placeholder = name;
    }
    // 保存线方法-------end



    private watchAddEventlistener() {
        document.querySelector('.swiper-button-next').addEventListener('click', this.swiperNextClick.bind(this));
        document.querySelector('.swiper-button-prev').addEventListener('click', this.swiperPrevClick.bind(this));
        window.addEventListener('resize', this.swiperResize.bind(this));

        this.sideBarService.watchIsFoldAdd('watchSwiperResize', (param) => {
            return this.swiperResize(param);
        });
    }


    // 平均月需求 的高中低
    private nAverageMounthIsHighOrLow(num, element) {
        if (Number(num) < 8) {
            element.innerHTML = '低';
        } else if (Number(num) >= 8 && Number(num) < 40) {
            element.innerHTML = '中';
        } else {
            element.innerHTML = '高';
        }
    }

    // 成本价 的高中低
    private nCoustIsHighOrLow(num, element) {
        if (Number(num) < 100) {
            element.innerHTML = '低';
        } else if (Number(num) >= 100 && Number(num) < 450) {
            element.innerHTML = '中';
        } else {
            element.innerHTML = '高';
        }
    }
}

