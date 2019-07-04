import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataManageService, TooltipBoxService, LoadingService, GetJsonService, InterfaceParamModelService, UpdataSubjectService } from '../../shared/service';
import { Router } from '@angular/router';
import { batchPredictionData } from './data';
import { BatchPredictionDetailsPanelComponent } from './batch_prediction_details_panel/batch_prediction_details_panel.component';
declare const $: any, lenovoPublic;

@Component({
    selector: 'app-batch-prediction-details',
    templateUrl: './batch_prediction_details.component.html',
    styleUrls: ['./batch_prediction_details.component.scss']
})

export class BatchPredictionDetailsComponent implements OnInit {
    // yangjun----------param---start
    batchPredictionDetailsPnlist = []; // 当前的所有pn code 的列表
    batchPredictionDetailsData = []; // 当前的所有数据的列表
    isShowSearchBox = false; // 是否显示添加预测组搜索框
    isAllSelect = false; // 是否显示添加预测组搜索框
    isShowSavePop = false; // 是否显示保存线的弹框的逻辑
    saveLinePopPlaceHolder = ''; // 保存线的弹框的占位符placeholder
    refreshPage = true;
    @ViewChild(BatchPredictionDetailsPanelComponent) batchPredictionDetailsPanel;
    // yangjun----------param---end

    showPanelOrList = this.dataManageService.getShowPanelOrList(); // 当前显示面板还是列表
    constructor(
        private dataManageService: DataManageService,
        private loadingService: LoadingService,
        private getJsonService: GetJsonService,
        private tooltipBoxService: TooltipBoxService,
        private interfaceParamModelService: InterfaceParamModelService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private updataSubjectService: UpdataSubjectService
    ) { }
    ngOnInit() {
        {
            // 优先获取保存在缓存中的排序后的数据，如果没有再进行通过pnList调用接口获取数据，------避免当前页面刷新
            // if (!this.setCurDataToSortedData()) {
            lenovoPublic.selfLog2(() => console.log(this.showPanelOrList));
            this.batchPredictionDetailsPnlist = this.dataManageService.getSaveSingleOrBatchPnList();
            // lenovoPublic.selfLog2(()=>console.log(this.batchPredictionDetailsPnlist));
            // batchPredictionData.map((item) => {
            //     this.batchPredictionDetailsData.push(item);
            //     this.batchPredictionDetailsData.push(item);
            //     this.batchPredictionDetailsData.push(item);
            //     this.batchPredictionDetailsData.push(item);
            //     this.batchPredictionDetailsData.push(item);
            //     this.batchPredictionDetailsData.push(item);
            //     this.batchPredictionDetailsData.push(item);
            // });
            this.getData(this.batchPredictionDetailsPnlist, 'push');
            // lenovoPublic.selfLog2(()=>console.log(this.batchPredictionDetailsData));
            // }
        }
    }


    // 通过pn获取批量预测的详细数据
    getData(pnList, pushOrShift) {
        lenovoPublic.isShowGetJsonLoading(true);
        // 设置参数列表
        const param = { batchList: [] };
        pnList
            .filter((item) => {
                return item.pnList.length > 0;
            })
            .map((item) => {
                const obj = Object.assign({}, {
                    forcastCodes: [...item.pnList],
                    forcastParams: {
                        // flRaByMounth: 0,
                        // flWarranty: 0.05,
                        // last_time_buy: ''

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
                    }
                });
                param.batchList[param.batchList.length] = obj;
            });

        const doBatchForcastParam = this.interfaceParamModelService.doBatchForcast(param);
        this.getJsonService.doBatchForcast(doBatchForcastParam,
            (data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (data) {
                    data.data.projectModelList.map((item) => {
                        this.batchPredictionDetailsData[pushOrShift]({ data: item });
                    });
                    this.initSetbatchPredictionDetailsData(pushOrShift, data.data.projectModelList);
                }

                lenovoPublic.isShowGetJsonLoading();
            }, (err) => {
                console.error(err);
                lenovoPublic.isShowGetJsonLoading();
            });
    }

    // 返回数据后设置物料查看列表，LTB查看列表，以及应该显示的指标中的本组数据
    private initSetbatchPredictionDetailsData(pushOrShift, newData) {
        // lenovoPublic.selfLog2(()=>console.log(this.batchPredictionDetailsData));
        this.batchPredictionDetailsData.map((item, itemIndex) => {
            // lenovoPublic.selfLog2(()=>console.log(item));
            let obj: any = {};
            if (!item.pnList) {
                const projectModel = item.data.projectModel;
                if (!projectModel) {
                    item.data.projectModel = {
                        'projectId': '-',
                        'userId': null,
                        'lTotalFocast': '-',
                        'forcastPeriod': '-',
                        'basicModel': {
                            'currentGroupUnionCode': '-',
                            'groupCode': '-',
                            'groupName': '-',
                            'productLine': '-',
                            'planClass': '-'
                        },
                        'historyModel': {
                            'nAverageMounth': '-',
                            'nCoust': '-',
                            'nHistoryUsage': '-',
                            'averageIBTime': '-',
                            'futureTotalIB': '-',
                            'demandStartTime': '-',
                            'demandStationaryTime': '-',
                            'demandDeclineTime': '-',
                            'ibBgeinTime': '-',
                            'stationaryKeepTime': '-',
                            'eos': '-'
                        },
                        'indicateModel': {
                            'selfGroupModel': null,
                            'separateModel': {
                                'accuracyRate': '-',
                                'hitRate': '-',
                                'coverageRatio': '-',
                                'lostCount': '-',
                                'overCount': '-',
                                'overrunCost': '-'
                            }
                        },
                        'diagramModel': {
                            'aiUsageRaByMounth': '-',
                            'aiInwarrantyRate': '-',
                            'last_time_buy': '',
                            'humanInwarrantyRate': '-',
                            'humanDemandRate': '-'
                        },
                        'diagramLines': [],
                        'groupModel': {
                            'includePNs': [],
                            'groupUnionCode': '',
                            'baseTimeLine': [],
                            'groupName': '-'
                        },
                        'currentPredLineId': null
                    };
                }



                obj = Object.assign({}, item, {
                    id: String(Math.random() * 10) + String(itemIndex), // 数据的唯一id，使用随机数拼接下标
                    projectModelIsNull: projectModel ? true : false, // 判断当前后台返回的projectModel数据是否为空---防止后期需要给projectModel写入默认值
                    pnList: [...item.data.codes], // 当前数据的pnList
                    btnList: item.data.codes.join(';'), // 当前数据的pnList
                    fcSelect: [], // 参数区的下拉选择框
                    isShowMoreInfo: false, // 是否显示更多信息的详情
                    projectModel: item.data.projectModel, // 后台返回的当前项的数据
                    currentGroupUnionCode: projectModel ? projectModel.basicModel.currentGroupUnionCode : null, // 当前预测曲线的id
                    currentPredLineId: projectModel ? projectModel.currentPredLineId : null, // 当前预测曲线的id
                    curPredLineIsUsed: false, // 当前预测曲线是否使用过
                    curPredLineData: null, // 当前预测曲线的当前线的数据
                    previewLineData: null,
                    basicModel: projectModel ? projectModel.basicModel : {}, // 基础数据
                    diagramLines: projectModel ? projectModel.diagramLines : [], // 所有的线的数据
                    diagramModel: projectModel ? projectModel.diagramModel : {}, // 图表参数区域的参数
                    groupModel: projectModel ? projectModel.groupModel : {},
                    historyModel: projectModel ? projectModel.historyModel : {}, // 历史数据的详情
                    indicateModel: projectModel ? projectModel.indicateModel : {},
                    projectId: projectModel ? projectModel.projectId : '', // 项目id
                    materieList: [], // 当前的查看列表显示物料号的等信息
                    ltbList: [], // 当前该显示的ltb时间信息
                    curPrediction: {
                        lTotalFocast: projectModel ? projectModel.lTotalFocast : '-',
                        forcastPeriod: projectModel ? projectModel.forcastPeriod : '-'
                    }, // 当前预测曲线的数值
                    dataIndex: {
                        selfGroupModel: {
                            accuracyRate: '-',
                            hitRate: '-',
                            coverageRatio: '-',
                            lostCount: '-',
                            overCount: '-',
                            overrunCost: '-'
                        },
                        separateModel: projectModel ? projectModel.indicateModel['separateModel'] : {
                            accuracyRate: '-',
                            hitRate: '-',
                            coverageRatio: '-',
                            lostCount: '-',
                            overCount: '-',
                            overrunCost: '-'
                        }
                    }, // 指标
                    forcastParams: {
                        last_time_buy: '-',
                        flRaByMounth: '-',
                        flWarranty: '-',
                        huInwarrantyRate: '-',
                        demandRate: '-'
                    }// 当前预测曲线中的图表参数区域的参数
                });


                // 设置当前的多选框是否选中了------start
                if (lenovoPublic.isUndefined(obj['isChecked'])) {
                    obj['isChecked'] = false;
                }
                // 设置当前的多选框是否选中了------end

                if (obj.projectModelIsNull) {
                    // 设置物料列表---------start
                    const includePNs = obj['projectModel'].groupModel;
                    if (includePNs) {
                        // const pnList = new Set();
                        includePNs.includePNs.map((cont) => {
                            // pnList.add(cont.groupCode);
                            obj['materieList'].push(cont);
                        });
                        // obj['pnList'] = Array.from(pnList);
                        // obj['btnList'] = (Array.from(pnList)).join(';');
                    }
                    // 设置物料列表---------end

                    // 设置LTB---------start
                    const timeline = obj['projectModel'].diagramLines;
                    const allFcLines = {
                        all: [], // 所有预测的线
                        bUsed: [], // 预测中所有确认使用的线
                        default: {}, // 要使用的默认预测线
                        num: '0'
                    };


                    if (timeline) {
                        timeline.map((cont) => {
                            if (cont.bUsed && cont.lineType === 'keDiagramLineType_long_term_pred') {
                                // lenovoPublic.selfLog2(()=>console.log(obj));
                                obj['ltbList'].push(cont.timeLine[0]);
                            }
                            let max = '0', min = '9999-99-99', add = 0;
                            cont['timeLine'].map((num) => {
                                if (num > max) {
                                    max = num;
                                }
                                if (num < min) {
                                    min = num;
                                }
                            });
                            cont['value'].map((num) => {
                                add += Number(num);
                            });
                            // 设置每条线的需求预测总量
                            cont['forcastPeriod'] = (Number(max.slice(0, 4)) - Number(min.slice(0, 4))) * 12 + (Number(max.slice(5, 7)) - Number(min.slice(5, 7)));
                            // 设置每条线的时间跨度
                            cont['lTotalFocast'] = Math.floor(add);

                        });

                        timeline.map((cont) => {
                            if (cont.selfGroupModel) {
                                obj['dataIndex']['selfGroupModel'] = cont['selfGroupModel'];
                            }
                        });

                        // 过滤所有预测的线
                        allFcLines.all = timeline.filter((cont) => {
                            if (cont.lineType === 'keDiagramLineType_long_term_pred') {
                                return cont;
                            }
                        });
                        // 过滤所有确认使用的线
                        allFcLines.bUsed = allFcLines.all.filter((cont) => {
                            return cont['bUsed'];
                        });
                        if (allFcLines.bUsed.length > 0) { // 判断是否有确认使用的线
                            allFcLines.bUsed.map((cont) => {
                                // 所有确认使用的线选择时间最靠近当前时间的
                                if (cont.forcastParams.last_time_buy > allFcLines.num) {
                                    allFcLines.default = cont;
                                    allFcLines.num = cont.forcastParams.last_time_buy;
                                }
                            });
                        } else {
                            // 所有预测的线选择时间最靠近当前时间的
                            allFcLines.all.map((cont) => {
                                if (cont.forcastParams.last_time_buy > allFcLines.num) {
                                    allFcLines.default = cont;
                                    allFcLines.num = cont.forcastParams.last_time_buy;
                                }
                            });
                        }
                        obj['previewLineData'] = allFcLines.default;
                    }
                    // 设置LTB---------end

                    // 设置默认预测曲线setDefPredictionLine--------start
                    timeline.map((cont) => {
                        if (!obj['currentPredLineId']) {
                            const lastPred = timeline.filter((param) => {
                                return param.lineType === 'keDiagramLineType_long_term_pred';
                            });
                            obj['currentPredLineId'] = lastPred.length > 0 ? lastPred[lastPred.length - 1].lineId : null;
                        }

                        if (cont.lineId === obj['currentPredLineId']) {
                            Object.assign(obj['forcastParams'], cont.forcastParams);
                            obj['curPredLineData'] = cont;
                        }
                    });
                    // 设置默认预测曲线setDefPredictionLine--------end

                    // 根据默认预测曲线设置fcSelect数组--------start
                    if (timeline) {
                        obj.fcSelect = [];
                        timeline.map((cont) => {
                            if (cont.lineType === 'keDiagramLineType_long_term_pred') {
                                const fcSelectObj = Object.assign({}, {
                                    color: 'transparent',
                                    value: cont.name,
                                    id: cont.lineId,
                                    onlyId: obj.id
                                });
                                obj.fcSelect[obj.fcSelect.length] = fcSelectObj;
                            }
                        });
                    }
                    // 根据默认预测曲线设置fcSelect数组--------end
                }
                // lenovoPublic.selfLog2(()=>console.log(obj, itemIndex));
                this.batchPredictionDetailsData[itemIndex] = obj;
            }
            // else {
            //     // this.batchPredictionDetailsData[itemIndex]['id'] = String(+new Date()) + String(itemIndex);
            // }

            if (pushOrShift === 'unshift') {
                this.startPredictionGetDataCallback();
            }
        });

        // lenovoPublic.selfLog2(()=>console.log(this.batchPredictionDetailsData));
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
            // 调用完数据设置当前默认预测曲线
            // tslint:disable-next-line:no-unused-expression
            this.batchPredictionDetailsPanel && this.batchPredictionDetailsPanel.initSetDefPredLine();
        }, 100);
    }

    // 显示list页面
    public showPanelOrListToggle(isPanelOrList) {
        if (this.showPanelOrList !== isPanelOrList) {
            // this.setCurDataToSortedData();
            this.showPanelOrList = isPanelOrList;
            this.dataManageService.setShowPanelOrList(this.showPanelOrList); // 保存当前显示的是面板还是列表
            setTimeout(() => {
                // 调用完数据设置当前默认预测曲线
                // tslint:disable-next-line:no-unused-expression
                this.batchPredictionDetailsPanel && this.batchPredictionDetailsPanel.initSetDefPredLine();
            }, 16);

            this.batchPredictionDetailsData.map((item) => {
                item.isChecked = false;
            });
        }
    }

    // 设置已经排序过的数据为当前数据
    private setCurDataToSortedData() {
        const getSaveBatchSortedData = this.dataManageService.getSaveBatchSortedData();
        // lenovoPublic.selfLog2(()=>console.log(getSaveBatchSortedData));
        if (getSaveBatchSortedData && getSaveBatchSortedData.length !== 0) {
            getSaveBatchSortedData.map((item, itemIndex) => {
                this.batchPredictionDetailsData[itemIndex] = Object.assign(this.batchPredictionDetailsData[itemIndex], {
                    sortId: item.sortId,
                    originSort: item.originSort
                });
            });
            this.batchPredictionDetailsData = this.batchPredictionDetailsData.sort(function (a, b) {
                return a.sortId - b.sortId;
            });
            // this.changeDetectorRef.detectChanges();
            // lenovoPublic.selfLog2(()=>console.log(this.batchPredictionDetailsData));
        }
        return getSaveBatchSortedData && getSaveBatchSortedData.length !== 0;
    }

    public changeParentData({ type, data }) {
        if (type === 'getSortedDataOriginPanel') {
            this.dataManageService.setSaveBatchSortedData(data);
            this.setCurDataToSortedData();
        }
        if (type === 'isAllSelect') {
            this.isAllSelect = data;
        }
        if (type === 'setDefPredictionLine') {
            // lenovoPublic.selfLog2(()=>console.log('setDefPredictionLine', data));
            let curEditItem;
            if (!data.curItemData) {
                curEditItem = this.batchPredictionDetailsData.find((item) => {
                    return item.id === data.curItem.onlyId;
                });
            } else {
                curEditItem = data.curEditItem;
            }

            if (!curEditItem.projectModelIsNull) {
                return;
            }

            const curLine = curEditItem.projectModel.diagramLines.find((item) => {
                return item.lineId === data.curItem.id;
            });


            curEditItem.currentPredLineId = curLine.lineId;
            curEditItem.curPredLineData = curLine;

            // 修改selfGroupModel数据-----start
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
            curEditItem['dataIndex']['selfGroupModel'] = selfGroupModel;
            // 修改selfGroupModel数据-----end

            // 修改默认预测曲线时修改-----修改月平均需求率-------start
            curEditItem['projectModel']['historyModel']['nAverageMounth'] = selfGroupModel['nAverageMounth'];
            // 修改默认预测曲线时修改-----修改月平均需求率-------end

            // 修改当前预测曲线的数值-------start
            if (curLine['value']) {
                curEditItem['curPrediction']['lTotalFocast'] = 0;
                curLine['value'].map((item) => {
                    curEditItem['curPrediction']['lTotalFocast'] += (+item);
                });
            }

            curEditItem['curPrediction']['lTotalFocast'] = parseInt(curEditItem['curPrediction']['lTotalFocast'], 10).toFixed(0);


            // 计算月份相差
            const getIntervalMonth = (startDate, endDate) => {
                const startMonth = startDate.getMonth();
                const endMonth = endDate.getMonth();
                const intervalMonth = (startDate.getFullYear() * 12 + startMonth) - (endDate.getFullYear() * 12 + endMonth);
                return intervalMonth;
            };

            curEditItem['curPrediction']['forcastPeriod'] = (getIntervalMonth(new Date(curLine.timeLine[curLine.timeLine.length - 1]), new Date(curLine.timeLine[0]))).toFixed(0);
            // lenovoPublic.selfLog2(()=>console.log(curEditItem['curPrediction']));
            // 修改当前预测曲线的数值-------end

            // 修改forcastParams参数--------start
            Object.assign(curEditItem['forcastParams'], curLine['forcastParams']);
            // 修改forcastParams参数--------end

            // 设置当前默认预测曲线是否确认使用过------start
            curEditItem.curPredLineIsUsed = curLine.bUsed;
            // 设置当前默认预测曲线是否确认使用过------end

            // lenovoPublic.selfLog2(()=>console.log(this.batchPredictionDetailsData));
        }

        if (type === 'isShowSaveLinePop') {
            this.isShowSavePop = data.isShow;
        }

        if (type === 'changePlaceHolder') {
            this.saveLinePopPlaceHolder = data.name;
        }
    }

    // 全选
    public allSelect() {
        this.batchPredictionDetailsData.map((item) => {
            if (!this.isAllSelect) {
                item.isChecked = true;
            } else {
                item.isChecked = false;
            }
        });
    }



    // 添加预测组方法------------start
    // is显示添加预测组
    public showSearchBox(param) {
        this.isShowSearchBox = param;
    }

    // 开始预测点击添加时执行，获取pn号
    public startPrediction(param) {
        lenovoPublic.isShowGetJsonLoading.call(this, true);
        if (lenovoPublic.pnListIsRepeat(this.batchPredictionDetailsPnlist, Object.assign({}, { pnList: param }))) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '当前pn已存在，请重新输入',
                    style: {}
                }]
            }, 'alert');
            // alert('当前pn已存在，请重新输入');
            this.closeSearchBox(false);
            lenovoPublic.isShowGetJsonLoading.call(this);
            return;
        }
        this.getData([{ pnList: [...param] }], 'unshift'); // 点击开始预测时获取数据

        this.dataManageService.setSaveSingleOrBatchPnList([{ pnList: [...param] }, ...this.dataManageService.getSaveSingleOrBatchPnList()]);


    }
    // 点击添加预测组开始预测时执行获取数据，成功之后的回调
    public startPredictionGetDataCallback() {
        this.closeSearchBox(false);
        // tslint:disable-next-line:no-unused-expression
        this.batchPredictionDetailsPanel && this.batchPredictionDetailsPanel.setMoreInfoData('clear'); // 关闭掉当前显示更多信息，因为如果向前插入，会影响排序，会造成更多信息对应不准确
        lenovoPublic.isShowGetJsonLoading.call(this);
    }

    // 关闭添加预测组搜索框
    public closeSearchBox(param) {
        this.showSearchBox(param);
    }
    // 添加预测组方法------------end


    /**
     *点击进入管理预测组页面
    */
    enterManageGroup() {
        this.router.navigate(['/batchPrediction/batchPredictionManage']);
        setTimeout(() => {
            this.updataSubjectService.emitBathComparisonManage(this.batchPredictionDetailsData);
        }, 500);
    }

    // 当前是否允许对比按钮的显示高亮
    public contrastIsAllow() {
        const isAllow = this.batchPredictionDetailsData.some((item) => {
            return item.isChecked;
        });
        if (!isAllow) {
            return {
                opacity: 0.4,
                background: '#949EB6',
                color: '#3F4659',
                cursor: 'pointer'
            };
        } else {
            return {
                cursor: 'pointer'
            };
        }
    }

    // tslint:disable-next-line:member-ordering
    fileList = []; // 保存当前添加的文件列表
    // 批量导入
    /**
     * @param callback 选择文件成功后的回调函数
     * @param vm
     */
    public getFile() {
        this.fileList = [];
        this.fileList.length = 0;
        lenovoPublic.getFile(this.uploadExcel, this);
    }
    // 上传文件
    public uploadExcel(vm) {
        const form = document.forms.namedItem('fileinfo');
        const oData = new FormData(form);
        oData.append('file', vm.fileList[0]);
        lenovoPublic.isShowGetJsonLoading(true);
        vm.getJsonService.getBatchForcastByFile(oData,
            (data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (data) {
                    data = data.data;
                    const newPnList = [];
                    data.map((item) => {
                        const arr = [];
                        const isExist = [];
                        item.forcastCodes.map((cont) => {
                            arr.push(cont.code);
                            isExist.push(cont);
                        });
                        newPnList.push({ pnList: [...arr], isExist });
                        vm.dataManageService.setSaveSingleOrBatchPnList([{ pnList: [...arr], isExist }, ...vm.dataManageService.getSaveSingleOrBatchPnList()]);
                    });
                    vm.getData(newPnList, 'unshift');

                    lenovoPublic.isShowGetJsonLoading();
                }
                // lenovoPublic.selfLog2(()=>console.log(this.pnListDetailsData));
            },
            (error) => {
                lenovoPublic.isShowGetJsonLoading();
                lenovoPublic.selfLog2(() => console.log(error));
            });
    }



    // 批量导出
    public exportBatch() {
        // lenovoPublic.selfLog2(()=>console.log('export 什么'));
        if (this.batchPredictionDetailsData.every((item) => !item.isChecked)) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '当前没有勾选进行导出的预测组，请先进行勾选',
                    style: {}
                }]
            }, 'alert');
            // alert('当前没有勾选进行导出的预测组，请先进行勾选');
            return;
        }
        const request = () => {
            // lenovoPublic.selfLog2(()=>console.log(this.getJsonService.getToken()));

            const batchList = [];
            this.batchPredictionDetailsData.map((item) => {
                if (item.isChecked) {
                    batchList.push({
                        forcastCodes: [...item.pnList],
                        forcastParams: {
                            flRaByMounth: 0,
                            flWarranty: 0.05,
                            last_time_buy: ''
                        }
                    });
                }
            });

            const param = this.interfaceParamModelService.exportBatch({ batchList });
            lenovoPublic.isShowGetJsonLoading.call(this, true);
            this.getJsonService.exportBatch(param,
                (data) => {
                    lenovoPublic.isShowGetJsonLoading.call(this);
                    const elink = document.createElement('a');
                    elink.download = `批量预测-${new Date()}.xlsx`;
                    elink.style.display = 'none';
                    const blob = new Blob([data]);
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    document.body.removeChild(elink);
                }, (err) => {
                    lenovoPublic.isShowGetJsonLoading.call(this);
                    lenovoPublic.selfLog2(() => console.log(err));
                });
        };
        request();
    }

    public editSaveLines(param) {
        // lenovoPublic.selfLog2(()=>console.log(param));
        let batchSaveLineBtns: NodeListOf<Element>; // 获取面板页面所有的保存按钮
        let curItemDataIndex = 0; // 保存当前点击的是哪一个面板的保存按钮的下标，及操作的数据的下标
        let curDefPredLineId: object; // 当前的默认预测曲线
        let lineDetails: object; // 参数详情

        {
            // 设置获取当前点击的是哪一个面板的保存按钮，及应该操作哪一个数据
            batchSaveLineBtns = document.querySelectorAll('.batchSaveLineBtn');
            for (const [key, value] of Object.entries(batchSaveLineBtns)) {
                // lenovoPublic.selfLog2(()=>console.log(key, value));
                if (value.getAttribute('batchSaveLineBtn') === 'true') {
                    curItemDataIndex = parseInt(value.getAttribute('index'), 10);
                    break;
                }
            }
            // 找到当前的显示的默认预测曲线的id
            curDefPredLineId = this.batchPredictionDetailsData[curItemDataIndex]['currentPredLineId'];

            // 设置参数详情
            lineDetails = this.interfaceParamModelService.setLineNameLineById({
                lineId: curDefPredLineId,
                lineName: param.lineName,
                isUsed: param.isRecordLtbTime
            });
        }

        lenovoPublic.isShowGetJsonLoading.call(this, true);
        this.getJsonService.setLineNameLineById(lineDetails,
            (data2) => {
                // lenovoPublic.selfLog2(()=>console.log(data2));
                // 修改当前显示的名称
                this.batchPredictionDetailsData[curItemDataIndex].fcSelect.find((item) => item.id === curDefPredLineId).value = param.lineName;
                this.batchPredictionDetailsData[curItemDataIndex].curPredLineIsUsed = param.isRecordLtbTime;

                // 递归修改lineId和lineName参数
                const editLinesData = (data) => {
                    if (Array.isArray(data)) {
                        data.map((item) => {
                            editLinesData(item);
                        });
                    } else if (typeof data === 'object') {
                        // tslint:disable-next-line:forin
                        for (const mm in data) {
                            if (mm === 'id' && data[mm] === curDefPredLineId) {
                                data.value = param.lineName;
                                data.bUsed = param.isRecordLtbTime;
                            } else if (mm === 'lineId' && data[mm] === curDefPredLineId) {
                                data.lineName = param.lineName;
                                data.bUsed = param.isRecordLtbTime;
                            }
                            editLinesData(data[mm]);
                        }
                    } else if (typeof data === 'string') {

                    }
                };
                // lenovoPublic.selfLog2(()=>console.log(curItemDataIndex));
                editLinesData(this.batchPredictionDetailsData[curItemDataIndex]);
                // this.dataManageService.setSaveBatchSortedData(this.batchPredictionDetailsData);
                setTimeout(() => {
                    // tslint:disable-next-line:no-unused-expression
                    this.batchPredictionDetailsPanel && this.batchPredictionDetailsPanel.initSetDefPredLine();
                    this.isShowSavePop = false;

                    lenovoPublic.isShowGetJsonLoading.call(this);
                }, 100);
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
            });
    }

    // 关闭保存线的pop
    public isHideSavePop(param) {
        this.isShowSavePop = false;
        // lenovoPublic.selfLog2(()=>console.log(param));
    }

    // 返回批量预测搜索页面
    public reBatchSearPage() {
        this.router.navigate(['./batchPrediction']);
    }

    // 执行对比按钮事件
    public startContrast() {
        if (this.batchPredictionDetailsData.every((item) => !item.isChecked)) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '当前没有勾选进行对比的对比组',
                    style: {}
                }]
            }, 'alert');
            // alert('当前没有勾选进行对比的对比组');
            return;
        }

        if (this.batchPredictionDetailsData.some((item) => {
            return !item.projectModelIsNull && item.isChecked;
        })) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '当前存在预测失败的选项，不能进行对比!!!!',
                    style: {}
                }]
            }, 'alert');
            // alert('当前存在预测失败的选项，不能进行对比!!!!');
            return;
        }

        const pnListArr = [];
        this.batchPredictionDetailsData.map((item) => {
            if (item.isChecked) {
                pnListArr.push(item.pnList);
            }
        });

        const allPnlistCompasionList = [];
        const groupUnionCode = this.dataManageService.getSingleCurGroupUnionCode();

        const getAllData = (projectId) => {
            return new Promise((resolve, reject) => {
                // 发送请求
                const srcGroupUnionCode = this.dataManageService.getSingleCurGroupUnionCode();
                this.getJsonService.addGroup2CompareGroup(
                    this.interfaceParamModelService.addGroup2CompareGroup({
                        forcastCodes: projectId,
                        // flRaByMounth: 0.0001,
                        // flWarranty: 0.01,

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
                        resolve(data);
                    },
                    (err) => {
                        console.error(err);
                        reject(new Error(err));
                    });
            });
        };

        // 调用getAllData获取数据---不会触发添加对比组的函数，不会添加新组
        const getAllDataApply = (cont, successCallback, errCallback) => {
            lenovoPublic.isShowGetJsonLoading.call(this, true);
            const promises = [...cont].map((item) => {
                if (allPnlistCompasionList.every((param) => {
                    return param.pnList.toString() !== item.toString();
                })) {
                    // lenovoPublic.selfLog2(()=>console.log(item));
                    return getAllData(item);
                }
            });

            Promise.all(promises).then((data) => {
                // tslint:disable-next-line:no-unused-expression
                successCallback && successCallback.call(this, data);
            }).catch((err) => {
                console.error(err);
                // tslint:disable-next-line:no-unused-expression
                errCallback && errCallback.call(this, err);
            });
        };


        this.getJsonService.getCompareGroupList(
            this.interfaceParamModelService.getCompareGroupList({ groupUnionCode }),
            (data) => {
                data.data.compareGroups.map((item) => {
                    const obj = Object.assign({}, {
                        pnList: [...item.codeList],
                        id: item.compareModelId
                    });
                    allPnlistCompasionList.push(obj);
                });

                getAllDataApply(pnListArr,
                    (data2) => {
                        // lenovoPublic.selfLog2(()=>console.log(data2));
                        lenovoPublic.isShowGetJsonLoading.call(this);

                        const param = this.batchPredictionDetailsData.find((item) => item.isChecked);
                        this.dataManageService.setSaveSingleOrBatchPnList([...param.pnList], 'saveBatchSingleDetailsPnList');
                        this.dataManageService.setSingleCurGroupUnionCode(param.currentGroupUnionCode);
                        this.router.navigate(['./batchPrediction/batchComparisonDetails', { id: 'batchDetails', originPage: 'batchDetails' }]);

                    }, (err) => {
                        lenovoPublic.selfLog2(() => console.log(err));
                    });
            },
            (err) => {
                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: JSON.stringify({ data: err, id: 180 }),
                        style: {}
                    }]
                }, 'alert');
                // alert(JSON.stringify({ data: err, id: 180 }));
                console.error(err);
            });



    }
    // 执行保存按钮事件
    public allSave() {
        this.tooltipBoxService.setTooltipBoxInfo({
            message: [{
                text: '功能未开发',
                style: {}
            }]
        }, 'alert');

        // if (this.batchPredictionDetailsData.every((item) => !item.isChecked)) {
        //     alert('当前没有勾选进行对比的对比组');
        // }
    }

}
