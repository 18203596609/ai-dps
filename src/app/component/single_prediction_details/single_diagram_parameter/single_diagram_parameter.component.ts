import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, TemplateRef, HostListener } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
import { GetJsonService } from '../../../shared/service/getJson.service';
import { LoadingService } from '../../../shared/service/loading.service';
import { CodebaseService } from '../../../shared/service/codebase.service';
import { DataManageService } from '../../../shared/service/data_manage.service';
import { TooltipBoxService } from '../../../shared/service/tooltipBox.service';
import { InterfaceParamModelService } from '../../../shared/service/interfaceParamModel.service';

declare const $: any, lenovoPublic;

@Component({
    selector: 'app-single-diagram-parameter',
    templateUrl: './single_diagram_parameter.component.html',
    styleUrls: ['./single_diagram_parameter.component.scss']
})
export class SingleDiagramParameterComponent implements OnInit, OnDestroy {

    // param_yang----start
    @Output() selectContent = new EventEmitter();
    @Output() setEditDataClick = new EventEmitter();
    @Output() editCalculateClick = new EventEmitter();
    @Output() editSaveLinesClick = new EventEmitter();
    @Output() editChangeLastTimeBuy = new EventEmitter();
    @Output() cancelEditEvent = new EventEmitter();
    @Output() isShowPopEmit = new EventEmitter();
    @Output() updatePlaceHolderEmit = new EventEmitter();
    @Output() setDiagramParameterToShowDataEmit = new EventEmitter();
    getEditLines: any = {}; // 获取当前获取线接口的所有线的数据
    last_time_buy: any = ''; // 时间
    curIsEditIng: boolean = false; // 当前是否是处于编辑状态
    curSingleAIOrHuman = '';

    curPageAllLineLastTimeBuy: any = new Set(); // 保存当前页面有多少个last_time_buy 即当前页面有多少根不重合的线
    getLineWithGroupUnionCode$; // 订阅获取线的事件
    isShowSavePop: boolean = false; // 是否显示当前提示框
    // savePreLastTimeBuy = this.last_time_buy; // 保存前一个lasttimebuy，在保存时判断当前last_time_buy是否已经存在
    // param_yang----end


    diagramParameter$;
    allData;
    // 添加选择框列表
    selectListLi = [
        // {
        //     'color': 'rgba(255,160,4,0.8)',
        //     value: '默认预测1'
        // }
    ];

    singlePrediction: any = {
        customAi: null, // 自定义月需求率
        aiInwarrantyRate: '-', // 延保率
        ai: '-', // 月需求率
        standardWarrantyPeriod: null // 标准保修期
    };
    // AIPrediction: any = {
    //     customAi: null, // 自定义月需求率
    //     aiInwarrantyRate: '-', // 延保率
    //     ai: '-', // 月需求率
    //     standardWarrantyPeriod: '-' // 标准保修期
    // };
    // humanPrediction: any = {
    //     customAi: '-', // 自定义月需求率
    //     ai: null, // 月需求率
    //     aiInwarrantyRate: '-', // 延保率
    //     standardWarrantyPeriod: '-' // 标准保修期
    // };

    curData = {
        'aiUsageRaByMounth': '-',
        'aiInwarrantyRate': '-',
        'timeBegin': '-',
        'timeEnd': '-',
        'huInwarrantyRate': '-',
        'demandRate': '-'
    };

    // AICurData = {
    //     'aiUsageRaByMounth': '-',
    //     'aiInwarrantyRate': '-',
    //     'timeBegin': '-',
    //     'timeEnd': '-',
    //     'huInwarrantyRate': '-',
    //     'demandRate': '-'
    // };
    // humanCurData = {
    //     'aiUsageRaByMounth': '-',
    //     'aiInwarrantyRate': '-',
    //     'timeBegin': '-',
    //     'timeEnd': '-',
    //     'huInwarrantyRate': '-',
    //     'demandRate': '-'
    // };

    constructor(
        private updataSubjectService: UpdataSubjectService,
        private getJsonService: GetJsonService,
        private loadingService: LoadingService,
        private codebaseService: CodebaseService,
        private dataManageService: DataManageService,
        private tooltipBoxService: TooltipBoxService,
        private interfaceParamModelService: InterfaceParamModelService,
    ) { }

    ngOnInit() {
        this.curSingleAIOrHuman = lenovoPublic.curAIOrHumanOrSingle();
        lenovoPublic.selfLog2(x => console.log(lenovoPublic.curAIOrHumanOrSingle()));
        this.setLastTimeBuy(this.codebaseService.dateTransform.formatDateToString(new Date(), '-'));
        window.addEventListener('click', this.eventListenerWindowClick);
        this.getData();
    }

    public changeLastTimeBuy(time) {
        this.setLastTimeBuy(time);
    }

    getData() {
        if (!this.diagramParameter$) {
            this.diagramParameter$ = this.updataSubjectService.getDiagramTopSubject().subscribe((data) => {
                this.curIsEditIng = false;
                lenovoPublic.selfLog2(() => console.log(data));
                this.allData = data;
                if (this.allData.data.projectModel.diagramModel) {
                    this.curData = this.allData.data.projectModel.diagramModel;
                }

                this.setLastTimeBuy(this.codebaseService.dateTransform.formatDateToString(new Date(), '-'));

                this.singlePrediction.ai = Number(this.curData.aiUsageRaByMounth);
                this.singlePrediction.aiInwarrantyRate = Number(this.curData.aiInwarrantyRate);

                this.singlePrediction.standardWarrantyPeriod = this.allData.data.projectModel.standerWarranty ? this.allData.data.projectModel.standerWarranty : '0';

                lenovoPublic.selfLog2(() => console.log(this.singlePrediction.ai));

                // 修改last_time_buy
                this.allData.data.projectModel.diagramLines.map((item) => {
                    this.curPageAllLineLastTimeBuy.add(item.last_time_buy);
                });
                // } else {
                //     this.getEditLines['data'] = {};
                //     this.getEditLines['data']['diagramLines'] = data;
                //     lenovoPublic.selfLog2(()=>console.log(data, this.getEditLines));
                // }


                const getToday = lenovoPublic.formatDateToString(new Date()).slice(0, 7);
                this.demandRatesList[0].startBar.timerBegin = this.getIbStartTimeAndEndTime(this.allData).ibStartTime;
                this.demandRatesList[0].startBar.timerEnd = this.getIbStartTimeAndEndTime(this.allData).ibEndTime;
                // this.demandRatesList[0].startBar.curTime = this.getIbStartTimeAndEndTime(this.allData).ibStartTime;
                this.demandRatesList[0].startBar.curTime = getToday;

                this.demandRatesList[0].endBar.timerBegin = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(getToday))['year']) + 1), (Number((lenovoPublic.getYearMonthDate(getToday))['month']) - 1));

                this.demandRatesList[0].endBar.timerEnd = this.getIbStartTimeAndEndTime(this.allData).ibEndTime;
                this.demandRatesList[0].endBar.curTime = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(getToday))['year']) + 1), (Number((lenovoPublic.getYearMonthDate(getToday))['month']) - 1));

            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
            });
        }
    }

    // 是否显示当前下啦选择框
    public showCurPredictionLineSelect() {
        if ($('.select-option').css('display') !== 'none') {
            $('.select-option').hide();
        } else {
            $('.select-option').show();
        }
    }
    // 获取到当前选择的值
    public getCurValue(selectColorArea, selectValue, cont, curId) {
        const getEle = document.querySelector('#' + curId);
        const [selectColorAreaTag, selectValueTag] = [getEle.children[0], getEle.children[1]];
        selectColorArea.setAttribute('bgcolor', selectColorAreaTag.getAttribute('bgcolor'));
        selectValue.innerHTML = selectValueTag.innerHTML;
        this.showCurPredictionLineSelect();
        this.selectContent.emit(cont);
    }

    bjOneTime(param) {
        lenovoPublic.selfLog2(() => console.log(param));
        this.singlePrediction.ai = param.flRaByMounth;
        this.singlePrediction.aiInwarrantyRate = param.flWarranty;
        // console.log(param);
        // if (param.last_time_buy.length === 7) {
        //     param.last_time_buy = param.last_time_buy + '-01';
        // }
        this.setLastTimeBuy(param.last_time_buy);

    }

    /**
     * 点击编辑当前预测曲线创建一根预测的曲线
     */
    public editCurLine() {
        this.setEditDataClick.emit('编辑状态');
        if (this.curIsEditIng) {
            return;
        }
        this.curIsEditIng = true;
    }

    // 点击计算按钮时执行
    public editCalculate() {
        this.getLineWithGroupUnionCode(true);
    }

    // 显示保存预测线弹框
    public isHideSavePop(isShow) {
        if (isShow) {
            const arr = Array.from(this.curPageAllLineLastTimeBuy);
            // if (arr.includes(this.last_time_buy)) {
            //     alert('当前last_time_buy已存在，请重新获取');
            //     return;
            // }
            this.setDiagramParameterToShowData({ type: 'updateSaveLinesPlaceHolder', data: '', isPush: true });
        }
        // if (!this.getEditLines) {
        //     alert('请计算后再进行保存操作');
        //     return;
        // }
        this.isShowSavePop = isShow;
        this.isShowPopEmit.emit(this.isShowSavePop);

    }

    // 点击保存按钮时执行
    // tslint:disable-next-line:member-ordering
    saveLines2Project$;
    // tslint:disable-next-line:member-ordering
    setLineIsUsed$;
    public editSaveLines(param) {
        lenovoPublic.isShowGetJsonLoading.call(this, true);
        // 设置参数
        const setParam = (cont) => {
            const array = [];
            // tslint:disable-next-line:no-unused-expression
            this.getEditLines.data && this.getEditLines.data.diagramLines.map((item, itemIndex) => {
                item.last_time_buy = this.last_time_buy;
                item.name = cont.lineName;
                array.push(item);
            });

            const params = this.interfaceParamModelService.saveLines2Project({
                diagramLines: array,
                groupUnionCode: this.allData.data.projectModel.basicModel.currentGroupUnionCode,
                pageCont: 0,
                pageIndex: 0,
                projectId: this.allData.data.projectModel.projectId,
                userId: this.allData.data.projectModel.userId,
                bSave: true,
                bUsed: cont.isRecordLtbTime
            });

            params.diagramLines.map((item) => {
                if (item.lineValue === '8') {
                    item.name = cont.lineName + '需求率';
                } else {
                    item.name = cont.lineName;
                }
            });

            lenovoPublic.selfLog2(() => console.log(params));
            return params;
        };

        const getLineWithGroupUnionCodeParam = (cont) => {
            const setScaleFactors = [];

            this.demandRatesList.map(x => {
                setScaleFactors.push({
                    scaleFactor: x.scale,
                    beginTime: x.startBar.curTime,
                    endTime: x.endBar.curTime
                });
            });
            const lineParam = this.interfaceParamModelService.getLineWithGroupUnionCode({
                groupUnionCode: this.allData.data.projectModel.basicModel.currentGroupUnionCode,

                standerWarrantyLength: String(this.singlePrediction.standardWarrantyPeriod || ''),
                raByYear: String(this.singlePrediction.customAi || '1'),
                raByMounth: this.singlePrediction.ai || this.singlePrediction.ai === 0 ? String(Number(this.singlePrediction.ai) / 100) : '0',

                extendWarranty: this.singlePrediction.aiInwarrantyRate || this.singlePrediction.aiInwarrantyRate === 0 ? String(Number(this.singlePrediction.aiInwarrantyRate) / 100) : '0.05',

                last_time_buy: this.last_time_buy,

                scaleFactors: setScaleFactors,
                calculateType: this.curPredictionFunList.find(x => this.curPredictionFunListDetails === x.content).type || 2,
                // flRaByMounth: (Number(this.singlePrediction.ai) || Number(this.singlePrediction.ai) === 0) ? Number(this.singlePrediction.ai) / 100 : 0.0001,
                // flWarranty: (Number(this.singlePrediction.aiInwarrantyRate) || Number(this.singlePrediction.aiInwarrantyRate) === 0) ? Number(this.singlePrediction.aiInwarrantyRate) / 100 : 0.01,

                pageCont: 0,
                pageIndex: 0,
                projectId: this.allData.data.projectModel.projectId,
                userId: this.allData.data.projectModel.userId,
                name: cont.lineName,
                bSave: true,
                bUsed: cont.isRecordLtbTime
            });

            if (lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction') {
                lineParam['type'] = this.curPredictionFunList.find(x => this.curPredictionFunListDetails === x.content).type;
            }
            console.log(lineParam);

            return lineParam;
        };

        // 确定保存当前lines
        const saveSure = (cont) => {

            // lenovoPublic.selfLog2(()=>console.log(param));
            if (this.getEditLines.data && this.getEditLines.data.diagramLines) {
                this.saveLines2Project$ = this.getJsonService.saveLines2Project(setParam(cont),
                    (data) => {
                        this.curIsEditIng = false;
                        this.curPageAllLineLastTimeBuy.add(this.last_time_buy); // 保存成功后添加记录last_time_buy

                        const mergeParam = Object.assign(param, {
                            lines: setParam(param).diagramLines
                        }); // 添加保存的线一起发送用于更新数据
                        lenovoPublic.selfLog2(() => console.log(mergeParam));
                        this.editSaveLinesClick.emit(mergeParam);

                        this.isHideSavePop(false); // 关闭提示框
                        this.getEditLines = {};  // 点击保存时清空上次保存的线
                        lenovoPublic.isShowGetJsonLoading.call(this);
                    }, (err) => {
                        console.error(err);
                    });
            } else {

                const curSingleAIOrHuman = {
                    AIPrediction: 'getLineWithGroupUnionCode',
                    singlePrediction: 'getLineWithGroupUnionCode',
                    // humanPrediction: 'getLineWithGroupUnionCode',
                    humanPrediction: 'doArtificialLineWithParam',
                }[lenovoPublic.curAIOrHumanOrSingle()];

                this.getLineWithGroupUnionCode$ = this.getJsonService[curSingleAIOrHuman](getLineWithGroupUnionCodeParam(cont),
                    (data) => {
                        lenovoPublic.selfLog2(() => console.log(data));
                        if (data.returnCode === 200 || data.returnCode === 0 || data.returnCode === 304) {
                            this.getEditLines = data; // 获取当前编辑的线数据
                        } else if (data.returnCode === 4) {
                            this.tooltipBoxService.setTooltipBoxInfo({
                                message: [{
                                    text: `请输入有效last_time_buy`,
                                    style: {}
                                }]
                            }, 'alert');
                            // alert('请输入有效last_time_buy');
                            lenovoPublic.isShowGetJsonLoading.call(this);
                            return;
                        }

                        this.curIsEditIng = false;
                        this.curPageAllLineLastTimeBuy.add(this.last_time_buy); // 保存成功后添加记录last_time_buy

                        const mergeParam = Object.assign(param, {
                            lines: setParam(param).diagramLines
                        }); // 添加保存的线一起发送用于更新数据
                        lenovoPublic.selfLog2(() => console.log(mergeParam));
                        this.editSaveLinesClick.emit(mergeParam);

                        this.isHideSavePop(false); // 关闭提示框

                        this.getEditLines = {};  // 点击保存时清空上次保存的线
                        lenovoPublic.isShowGetJsonLoading.call(this);
                    },
                    (err) => {
                        console.error(err);
                    });
            }
        };

        saveSure(param);
    }

    //  取消编辑功能
    public cacelEdit() {
        if (this.getLineWithGroupUnionCode$) {
            this.getLineWithGroupUnionCode$.unsubscribe();
        }
        this.curIsEditIng = false;
        this.cancelEditEvent.emit(false);
    }

    // change last_time_buy 事件
    public lastTimeBuyChange(event) {
        // clearTimeout(this.setTimeoutCollect['lastTimeBuyChangeTimer']);
        // this.setTimeoutCollect['lastTimeBuyChangeTimer'] = setTimeout(() => {
        // if (this.savePreLastTimeBuy !== this.last_time_buy) {
        // this.savePreLastTimeBuy = this.last_time_buy;
        // }
        // }, 1000);
    }

    // 动态修改icon
    private changeSelectIcon(isBlock, element) {
        if (isBlock !== 'block') {
            // element.classList.add('icon-top');
            element.classList.remove('icon-top');
        } else if (isBlock) {
            // element.classList.remove('icon-top');
            element.classList.add('icon-top');
        }
    }

    // 动态修改选择框内的色块值
    private changeSelectColor(color, element) {
        element.style.backgroundColor = color;
    }

    // 根据last_time_buy获取线
    private getLineWithGroupUnionCode(isChange) {
        lenovoPublic.isShowGetJsonLoading.call(this, true);

        const setScaleFactors = [];

        this.demandRatesList.map(x => {
            setScaleFactors.push({
                scaleFactor: x.scale,
                beginTime: x.startBar.curTime,
                endTime: x.endBar.curTime
            });
        });

        const param = this.interfaceParamModelService.getLineWithGroupUnionCode({
            groupUnionCode: this.allData.data.projectModel.basicModel.currentGroupUnionCode,

            standerWarrantyLength: String(this.singlePrediction.standardWarrantyPeriod || ''),
            raByYear: String(this.singlePrediction.customAi || '1'),
            raByMounth: this.singlePrediction.ai || this.singlePrediction.ai === 0 ? String(Number(this.singlePrediction.ai) / 100) : '0',
            extendWarranty: this.singlePrediction.aiInwarrantyRate || this.singlePrediction.aiInwarrantyRate === 0 ? String(Number(this.singlePrediction.aiInwarrantyRate) / 100) : '0.05',
            last_time_buy: this.last_time_buy,

            scaleFactors: setScaleFactors,
            calculateType: this.curPredictionFunList.find(x => this.curPredictionFunListDetails === x.content).type || '2',

            // flRaByMounth: (Number(this.singlePrediction.ai) || Number(this.singlePrediction.ai) === 0) ? Number(this.singlePrediction.ai) / 100 : 0.0001,
            // flWarranty: (Number(this.singlePrediction.aiInwarrantyRate) || Number(this.singlePrediction.aiInwarrantyRate) === 0) ? Number(this.singlePrediction.aiInwarrantyRate) / 100 : 0.01,
            // last_time_buy: this.last_time_buy,
            pageCont: 0,
            pageIndex: 0,
            projectId: this.allData.data.projectModel.projectId,
            userId: this.allData.data.projectModel.userId,
            bSave: false,
        });

        if (lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction') {
            param['type'] = this.curPredictionFunList.find(x => this.curPredictionFunListDetails === x.content).type;
        }

        const curSingleAIOrHuman = {
            AIPrediction: 'getLineWithGroupUnionCode',
            singlePrediction: 'getLineWithGroupUnionCode',
            // humanPrediction: 'getLineWithGroupUnionCode',
            humanPrediction: 'doArtificialLineWithParam',
        }[lenovoPublic.curAIOrHumanOrSingle()];

        this.getLineWithGroupUnionCode$ = this.getJsonService[curSingleAIOrHuman](param,
            (data) => {
                if (data.returnCode === 200 || data.returnCode === 0) {
                    // this.getEditLines = data; // 获取当前编辑的线数据
                    // tslint:disable-next-line:no-unused-expression
                    this.curIsEditIng ? this.editCalculateClick.emit(data) : null;
                } else if (data.returnCode === 4) {
                    this.tooltipBoxService.setTooltipBoxInfo({
                        message: [{
                            text: `请输入有效last_time_buy`,
                            style: {}
                        }]
                    }, 'alert');
                    // alert('请输入有效last_time_buy');
                }
                lenovoPublic.isShowGetJsonLoading.call(this);
            },
            (err) => {
                console.error(err);
            });
    }

    // 监听window的click事件
    private eventListenerWindowClick() {
        $('.select-option').hide();
    }

    // 点击日期时更新last_time_buy
    private getDatePickerDate(param) {
        this.setLastTimeBuy(param[0]);
    }

    // 更新last_time_buy 时间
    private setLastTimeBuy(param?) {
        if (param) {
            // console.log(param);
            const newDate = param.slice(0, 7);
            this.last_time_buy = newDate;
        }
        return this.last_time_buy;
    }


    // 添加默认预测线后selectListLi里该条线信息
    setForecast(param) {
        this.selectListLi = param;
        lenovoPublic.selfLog2(() => console.log(this.selectListLi, '下拉框的选择'));

        $('.select-color-area').css('background', param[param.length - 1] ? param[param.length - 1].color : 'orange');
        $('.select-value').html(param[param.length - 1] ? param[param.length - 1].value : 0);
    }

    // 双击可点击改变默认预测曲线时，同时改变下拉框对应的默认预测名称
    getSeleValue(param) {
        lenovoPublic.selfLog2(() => console.log(param, 678987678));
        $('.select-color-area').css('background', param.color);
        $('.select-value').html(param.value);
    }
    ngOnDestroy(): void {
        this.diagramParameter$.unsubscribe();
        window.removeEventListener('click', this.eventListenerWindowClick);
        if (this.getLineWithGroupUnionCode$) {
            this.getLineWithGroupUnionCode$.unsubscribe();
        }
        if (this.saveLines2Project$) {
            this.saveLines2Project$.unsubscribe();
        }
        if (this.setLineIsUsed$) {
            this.setLineIsUsed$.unsubscribe();
        }
    }



    // 向predictionShow发送数据
    /**
     *
     * @param type type 当前执行的事件类型-----用分类用
     * @param data data 传递的数据
     * @param isPush isPush 当前是要发送数据给show还是向show要数据，通过get调用把要要的数据拿回来
     */
    private setDiagramParameterToShowData({ type, data, isPush }) {
        this.setDiagramParameterToShowDataEmit.emit({ type, data, isPush });
    }
    // 接收show发送过来的数据
    private getShowData(param) {
        lenovoPublic.selfLog2(() => console.log(param));
        const [type, data, isPush] = [param.type, param.data, param.isPush];
        // if (isPush) {
        //     this.setDiagramParameterToShowData({ type, data, isPush });
        //     return;
        // }

        // 保存线时如果是已经计算过的线则需要拿到线然后传回去用id过滤不必再划线了
        if (type === 'updataLineArrToSave') {
            // 点击保存按钮时获取到当前保存的线
            this.getEditLines['data'] = {};
            this.getEditLines['data']['diagramLines'] = [];
            data.map((item) => {
                this.getEditLines['data']['diagramLines'].push(item);
            });
            lenovoPublic.selfLog2(() => console.log(data, this.getEditLines));
            return this.getEditLines;
        }

        // 保存线时向prediction 要下一个要保存的线是什么名字
        if (type === 'updateSaveLinesPlaceHolder') {
            this.updatePlaceHolderEmit.emit(data);
            return data.name;
        }

        if (type === 'getParamterParamToClickCompleteEvent') {
            const setData = {
                singlePredictionParam: this.singlePrediction,
                curAIOrHumanOrSingle: this.curSingleAIOrHuman,
                demandRatesList: this.demandRatesList,
                last_time_buy: this.last_time_buy
            };
            this.setDiagramParameterToShowData({ type: 'getParamterParamToClickCompleteEvent', data: setData, isPush: false });
        }
    }


    /**
     *
     */
    public inputChange() {
        console.log('触发了');
        const iptNumbers = Array.from(document.querySelectorAll('input[type=number]'));
        iptNumbers.map(x => {
            x['blur']();
        });
    }







    // tslint:disable-next-line:member-ordering
    demandRatesList: any = [
        {
            id: '00',
            scale: '1',
            notDel: true, // 当前项是否不能删除
            startBar: {
                timerBegin: '',
                timerEnd: '',
                curTime: '2016-01',
            },
            endBar: {
                timerBegin: '2016-01',
                timerEnd: '',
                curTime: '2016-01',
            }
        }
    ];

    // 监听demandRates的list列表详情li的leftoffsetLeft值，控制是否显示最左侧的竖线分界线
    watchIsShowCutOffLine(offsetL, ele, that) {
        if (offsetL > 300) {
            if (parseInt(lenovoPublic.getStyle(ele, 'marginLeft'), 10) !== 0) {
                return;
            }
            lenovoPublic.setCss(ele, { marginLeft: '0.5rem' });
            lenovoPublic.setCss(ele.querySelector('.cutOff-line'), { display: 'block' });
        } else {
            if (parseInt(lenovoPublic.getStyle(ele, 'marginLeft'), 10) === 0) {
                return;
            }
            lenovoPublic.setCss(ele, { marginLeft: '0px' });
            lenovoPublic.setCss(ele.querySelector('.cutOff-line'), { display: 'none' });
        }
    }

    // 接收改变后的时间
    demandRatesGetDatePickerDate(data) {
        const [date, index] = [data[0], data[1]];
        const demandRatesList = this.demandRatesList; // 获取到当前修改的数据，避免多处使用this
        const demandRatesListLen = this.demandRatesList.length; // 获取当前数据的length

        const curDemandRatesListIndex = Math.floor(index / 2); // 获取到当前操作的是数据列表中的第几项
        const isStartEnd = index % 2 === 0 ? 'startBar' : 'endBar'; // 获取到当前操作的列表是开始时间还是结束时间控件
        const curData = this.demandRatesList[curDemandRatesListIndex]; // 获取到当前修改的项的数据
        const changeYearNum = Number((lenovoPublic.getYearMonthDate(date))['year']) - Number((lenovoPublic.getYearMonthDate(curData[isStartEnd].curTime))['year']); // 修改的年度差
        const changeMonthNum = Number((lenovoPublic.getYearMonthDate(date))['month']) - Number((lenovoPublic.getYearMonthDate(curData[isStartEnd].curTime))['month']); // 修改的月度差;
        const lastTimeString = this.getIbStartTimeAndEndTime(this.allData).ibEndTime; // 获取到结束时间
        const firstTimeString = this.getIbStartTimeAndEndTime(this.allData).ibStartTime; // 获取到结束时间
        const lastTime = new Date((lastTimeString + '-01')).getTime(); // 获取结束时间的毫秒数


        if (curData[isStartEnd].curTime === date) {
            return;
        }

        console.log('operator--index====' + curDemandRatesListIndex);
        if (isStartEnd === 'startBar') {
            if (new Date((date + '-01')).getTime() > lastTime) {
                for (let i = curDemandRatesListIndex; i < demandRatesListLen; i++) {
                    if (curDemandRatesListIndex === 0) {
                        this.tooltipBoxService.setTooltipBoxInfo({
                            message: [{
                                text: '时间超出范围，请重新编辑',
                                style: {}
                            }]
                        }, 'alert');
                        break;
                    }
                    demandRatesList[i] = '';
                }
                this.demandRatesList = demandRatesList.filter(x => x);
                return;
            }


            console.log('%c ' + Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year']) + '--' + (Number((lenovoPublic.getYearMonthDate(date))['month']) - 1) + '--', 'color:#f00;font-size:18px;');


            // 如果修改的是开始时间栏，那么先修改结束时间栏
            curData['endBar'].timerBegin = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].timerBegin))['year']) + changeYearNum), (Number((lenovoPublic.getYearMonthDate(curData['endBar'].timerBegin))['month']) + changeMonthNum));
            curData['endBar'].curTime = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year']) + changeYearNum), (Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['month']) + changeMonthNum));


            // const curDateEndBarCurTimeYear = Number(lenovoPublic.getYearMonthDate(curData['endBar'].curTime)['year']);
            // const curDateEndBarCurTimeMonth = Number(lenovoPublic.getYearMonthDate(curData['endBar'].curTime)['month']);

            // const dateEndBarCurTimeYear = Number(lenovoPublic.getYearMonthDate(date)['year']);
            // const dateEndBarCurTimeMonth = Number(lenovoPublic.getYearMonthDate(date)['month']);

            // const aa = Number((lenovoPublic.getYearMonthDate(date))['month']) <= 1 ? 12 : (Number((lenovoPublic.getYearMonthDate(date))['month']) - 1);
            // console.log(curData['endBar'].curTime, date, aa);
            // console.log((curDateEndBarCurTimeYear - dateEndBarCurTimeYear) * 12 + (curDateEndBarCurTimeMonth - dateEndBarCurTimeMonth));

            // if (aa !== 12 && (curDateEndBarCurTimeYear - dateEndBarCurTimeYear) * 12 + (curDateEndBarCurTimeMonth - dateEndBarCurTimeMonth) < 11) {
            //     curData['endBar'].timerBegin = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year']) + 1), aa);
            //     curData['endBar'].curTime = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year']) + 1), aa);
            // } else {
            //     curData['endBar'].timerBegin = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year'])), aa);
            //     curData['endBar'].curTime = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year'])), aa);
            // }

            // console.log(curData['endBar'].curTime, date, aa);

            // 如果开始时间小于结束时间栏而且终止时间大于结束时间那么直接修改为结束
            ['timerBegin', 'timerEnd', 'curTime'].map(x => {
                const curTime = new Date((curData['endBar'][x] + '-01')).getTime();
                if (curTime >= lastTime) {
                    curData['endBar'][x] = lastTimeString;
                }
            });

            curData['endBar'].timerEnd = lastTimeString;
            curData['startBar'].timerEnd = lastTimeString;

        }

        // 遍历修改后边的时间栏
        const timerBarArr = ['startBar', 'endBar']; // 定义到当前修改的开始栏和结束栏变量
        const timerTimeArr = ['timerBegin', 'timerEnd', 'curTime']; // 定义到当前修改的是开始时间结束时间还是当前时间
        for (let i = curDemandRatesListIndex + 1; i < demandRatesListLen; i++) {
            const currentData = demandRatesList[i];

            timerBarArr.map((m, mIndex) => {
                timerTimeArr.map((n, nIndex) => {
                    currentData[m][n] = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(currentData[m][n]))['year']) + changeYearNum), (Number((lenovoPublic.getYearMonthDate(currentData[m][n]))['month']) + changeMonthNum));
                    const curTimerEnd = new Date((currentData[m][n] + '-01')).getTime();

                    // console.log(isStartEnd === 'startBar' && m === 'endBar');
                    // if (isStartEnd === 'startBar' && m === 'endBar') {
                    //     const curDateEndBarCurTimeYear = Number(lenovoPublic.getYearMonthDate(curData['endBar'].curTime)['year']);
                    //     const curDateEndBarCurTimeMonth = Number(lenovoPublic.getYearMonthDate(curData['endBar'].curTime)['month']);

                    //     const dateEndBarCurTimeYear = Number(lenovoPublic.getYearMonthDate(date)['year']);
                    //     const dateEndBarCurTimeMonth = Number(lenovoPublic.getYearMonthDate(date)['month']);

                    //     const aa = Number((lenovoPublic.getYearMonthDate(date))['month']) <= 1 ? 12 : (Number((lenovoPublic.getYearMonthDate(date))['month']) - 1);
                    //     console.log(currentData[m][n], date);

                    //     console.log((curDateEndBarCurTimeYear - dateEndBarCurTimeYear) * 12 + (curDateEndBarCurTimeMonth - dateEndBarCurTimeMonth) < 11);

                    //     if (aa !== 12 && (curDateEndBarCurTimeYear - dateEndBarCurTimeYear) * 12 + (curDateEndBarCurTimeMonth - dateEndBarCurTimeMonth) < 11) {
                    //         curData['endBar'].timerBegin = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year']) + 1), aa);
                    //         curData['endBar'].curTime = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year']) + 1), aa);
                    //     } else {
                    //         curData['endBar'].timerBegin = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year'])), aa);
                    //         curData['endBar'].curTime = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(curData['endBar'].curTime))['year'])), aa);
                    //     }
                    // }

                    currentData[m][n] = curTimerEnd >= lastTime ? lastTimeString : currentData[m][n];
                    currentData[m]['timerEnd'] = lastTimeString;
                });
            });

            const curStartBarTime = new Date((currentData.startBar.curTime + '-01')).getTime(); // 获取当前开始时间的毫秒数
            const curEndBarTime = new Date((currentData.endBar.curTime + '-01')).getTime(); // 获取当前结束时间的毫秒数
            // 如果开始时间没有超出范围，而结束时间超出了范围，那么自动控制时间为结束时间
            if (curStartBarTime < lastTime && curEndBarTime > lastTime) {
                ['timerBegin', 'timerEnd', 'curTime'].map(x => {
                    demandRatesList[i]['endBar'][x] = lastTimeString;
                });
            } else if (curStartBarTime >= lastTime) {
                // 控制如果时间超出了时间范围，则自动删除
                demandRatesList[i] = '';
            }
        }

        this.demandRatesList = demandRatesList.filter(x => x);

        curData[isStartEnd].curTime = date; // 将当前修改的时间设置为数据结构里边的当前时间

        {
            // 处理添加和删除按钮的隐藏与显示
            const add = document.querySelector('.operator-demandRates-list').querySelector('.add-icon');
            const subtract = document.querySelector('.operator-demandRates-list').querySelector('.subtract-icon');
            ['startBar', 'endBar'].map((x) => {
                if (this.demandRatesList[this.demandRatesList.length - 1][x]['curTime'] >= lastTimeString) {
                    lenovoPublic.setCss(add, { visibility: 'hidden' });
                } else {
                    lenovoPublic.setCss(add, { visibility: 'visible' });
                }
            });
            if (this.demandRatesList.length > 1) {
                lenovoPublic.setCss(subtract, { visibility: 'visible' });
            } else {
                lenovoPublic.setCss(subtract, { visibility: 'hidden' });
            }
        }

        console.log(this.demandRatesList);
    }
    // 添加需求率列表
    addDemandRates() {
        const demandRatesList = this.demandRatesList;
        const demandRatesListLast = demandRatesList[demandRatesList.length - 1];

        const startBarCurTime = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(demandRatesListLast['endBar'].curTime))['year'])), (Number((lenovoPublic.getYearMonthDate(demandRatesListLast['endBar'].curTime))['month']) + 1));
        const startBarTimerEnd = this.getIbStartTimeAndEndTime(this.allData)['ibEndTime'];

        console.log(demandRatesList);

        let endBarCurTime = lenovoPublic.joinYearMonthDate((Number((lenovoPublic.getYearMonthDate(demandRatesListLast['endBar'].curTime))['year']) + 1), (Number((lenovoPublic.getYearMonthDate(demandRatesListLast['endBar'].curTime))['month'])));
        const endBarTimerEnd = this.getIbStartTimeAndEndTime(this.allData)['ibEndTime'];

        const lastTime = new Date(this.getIbStartTimeAndEndTime(this.allData).ibEndTime + '-01').getTime(); // 获取到在保量的结束时间
        const lastTimeString = this.getIbStartTimeAndEndTime(this.allData).ibEndTime;
        const endBarCurTimeGetTime = new Date((endBarCurTime) + '-01').getTime();
        const startBarCurTimeGetTime = new Date((startBarCurTime) + '-01').getTime();

        if (startBarCurTimeGetTime <= lastTime && endBarCurTimeGetTime >= lastTime) {
            endBarCurTime = lastTimeString;
        } else if (startBarCurTimeGetTime > lastTime) {
            // alert('当前时间已经超出了');
        }


        const startBar = {
            timerBegin: startBarCurTime,
            timerEnd: startBarTimerEnd,
            curTime: startBarCurTime
        };
        const endBar = {
            timerBegin: endBarCurTime,
            timerEnd: endBarTimerEnd,
            curTime: endBarCurTime
        };

        const obj = {
            id: String('0' + this.demandRatesList.length),
            scale: '1',
            notDel: true,
            startBar: startBar,
            endBar: endBar
        };

        console.log(obj);

        this.demandRatesList.push(obj);

        {
            // 处理添加和删除按钮的隐藏与显示
            const add = document.querySelector('.operator-demandRates-list').querySelector('.add-icon');
            ['startBar', 'endBar'].map((x) => {
                if (obj[x]['curTime'] === lastTimeString) {
                    lenovoPublic.setCss(add, { visibility: 'hidden' });
                } else {
                    lenovoPublic.setCss(add, { visibility: 'visible' });
                }
            });
            const subtract = document.querySelector('.operator-demandRates-list').querySelector('.subtract-icon');
            console.log(subtract);
            lenovoPublic.setCss(subtract, { visibility: 'visible' });
        }

    }
    // 删除需求率列表
    subtractDemandRates() {
        // tslint:disable-next-line:curly
        if (this.demandRatesList.length > 1) {
            this.demandRatesList.pop();

            {
                // 处理添加和删除按钮的隐藏与显示
                if (this.demandRatesList.length <= 1) {
                    const subtract = document.querySelector('.operator-demandRates-list').querySelector('.subtract-icon');
                    lenovoPublic.setCss(subtract, { visibility: 'hidden' });
                }
                const add = document.querySelector('.operator-demandRates-list').querySelector('.add-icon');
                lenovoPublic.setCss(add, { visibility: 'visible' });
            }
        }
    }




    // tslint:disable-next-line:member-ordering
    curPredictionFunList = [
        {
            content: '上月需求率*季节因子',
            type: '2',
            bouncedBox: {
                content: [
                    // 'By 运作产线大类计算产线大类维度的需求率',
                    // '基于产线大类需求率逐月计算上一年的季节因子',
                    // '利用上月的真实需求率，基于去年对应月份的季节因子计算未来12个月的需求率',
                    '季节因子(by 月依次计算)=预测月上年对应月的产品线大类需求率／上年对应前一月产品线大类需求率)',
                    '月需求率(依次计算未来12个月)=本组上月真实需求率*预测月对应月份的季节因子',
                    '预测月需求量=预测月在保量*月需求率(默认方法，最常使用)'
                ]
            }
        },
        {
            content: '去年同期月需求率',
            type: '3',
            bouncedBox: {
                content: [
                    '取本组去年同期的月需求率(没有历史数据时设为0)',
                    '预测月需求量=预测月在保量*去年同期月需求率'
                ]
            }
        },
        {
            content: '产线大类月需求率',
            type: '4',
            bouncedBox: {
                content: [
                    '取本组对应产线大类去年同期的月需求率(没有历史数据时设为0)',
                    '预测月需求量=预测月在保量*产线大类月需求率'
                ]
            }
        },
        {
            content: '历史平均需求率',
            type: '5',
            bouncedBox: {
                content: [
                    '历史需求率=本组预测月之前发生的历史需求总和／本组预测月之前总在保量'
                ]
            }
        },
        {
            content: '自定义需求率',
            type: '6',
            bouncedBox: {
                content: []
            }
        }
    ];

    // tslint:disable-next-line:member-ordering
    showBouncedBoxContent = {
        title: '上月需求率*季节因子',
        content: [
            'By 运作产线大类计算产线大类维度的需求率4',
            '基于产线大类需求率逐月计算上一年的季节因子',
            '利用上月的真实需求率，基于去年对应月份的季节因子计算未来12个月的需求率'
        ]
    }; // 当前显示的浮框内容
    // tslint:disable-next-line:member-ordering
    curPredictionFunListDetails = '上月需求率*季节因子';
    // 获取点击人工预测中的预测方法的下拉列表中的内容
    getPredictionFunListDetails(content) {
        this.curPredictionFunListDetails = content;
    }

    // 是否显示人工预测中的预测方法的下拉列表----isShow===true => 隐藏掉下拉框
    public isShowPredictionFunList(isShow?) {
        const predictionFunList = document.querySelector('.predictionFun-list');
        if (!predictionFunList) {
            return;
        }
        if (isShow && predictionFunList) {
            lenovoPublic.setCss(predictionFunList, { display: 'none' });
            return;
        }
        if (lenovoPublic.getStyle(predictionFunList, 'display') !== 'none') {
            lenovoPublic.setCss(predictionFunList, { display: 'none' });
        } else {
            lenovoPublic.setCss(predictionFunList, { display: 'block' });
        }
    }


    // 人工预测中显示答疑信息
    public showDoubts(event, isShow, item) {
        let [eleLeft, eleTop, eleWidth, eleHeight] = [event.target.offsetLeft, event.target.offsetTop, event.target.offsetWidth, event.target.offsetHeight];

        // 鼠标划入下拉列表的选项时更新计算位置
        const selectList: any = document.querySelector('#selectList');
        if (selectList && selectList.contains(event.target)) {
            const [selectListL, selectListT, selectListW, selectListH] = [selectList.offsetLeft, selectList.offsetTop, selectList.offsetWidth, selectList.offsetHeight];
            const [parentL, parentT] = [event.target.parentElement.offsetLeft, event.target.parentElement.offsetTop];
            [eleLeft, eleTop, eleWidth, eleHeight] = [eleLeft + selectListL - 15, eleTop + selectListT + parentT, eleWidth, eleHeight];
        }

        const doubtsContent = document.querySelector('#doubtsContent');
        const doubtsContentSanJiao: any = document.querySelector('#doubtsContentSanJiao');

        const [spanJiaoLeft, spanJiaoTop, spanJiaoWidth, spanJiaoHeight] = [doubtsContentSanJiao.offsetLeft, doubtsContentSanJiao.offsetTop, doubtsContentSanJiao.offsetWidth, doubtsContentSanJiao.offsetHeight];
        lenovoPublic.selfLog2(x => console.log(spanJiaoLeft, spanJiaoTop, spanJiaoWidth, spanJiaoHeight));

        {
            // 设置浮框显示的内容----如果当前鼠标划上的是下拉列表内容
            if (item && item.bouncedBox.content) {
                this.showBouncedBoxContent = Object.assign({}, item.bouncedBox, { title: item.content });
            } else if (event.target.className && event.target.className.includes('doubts-icon')) {
                // 如果当前鼠标划上的是下拉列表右边的问号
                this.showBouncedBoxContent = Object.assign({}, this.curPredictionFunList.find(x => x.content === this.curPredictionFunListDetails).bouncedBox, { title: this.curPredictionFunListDetails });
            }

            if (this.showBouncedBoxContent.title === '自定义需求率') {
                console.log('%c 产品没给自定义需求率的浮框文本', 'color:red');
                return;
            }
        }

        lenovoPublic.setCss(doubtsContent, {
            left: eleLeft + eleWidth + (spanJiaoWidth / 2) + 6 + 'px',
            top: eleTop + (eleHeight / 2) - spanJiaoTop - (spanJiaoHeight / 2) + 'px',
            zIndex: [-999, 99][+isShow]
        });
    }



    // 人工预测中获取在保量的起始时间和终止时间
    private getIbStartTimeAndEndTime(data) {
        const ibLine = data.data.projectModel.diagramLines.find(x => x.lineType === 'keDiagramLineType_ib');
        const ibStartTime = ibLine.timeLine[0];
        let ibEndTime = lenovoPublic.formatDateToString(new Date());

        // ibStartTime = lenovoPublic.formatDateToString(new Date()).slice(0, 7);

        for (let i = 0; i < ibLine.value.length; i++) {
            if (ibLine.value[i] < 1) {
                ibEndTime = ibLine.timeLine[i];
                break;
            }
        }

        return {
            ibStartTime,
            ibEndTime
        };
    }





























































    // 同步修改当前是否正在编辑中，如果在编辑中，则离开当前页面进行提示----用在点击详情页面的搜索按钮时，和点击返回按钮时
    syncCurIsEditIngService(isCurIsEditIng, ele, that) {
        that.dataManageService.setCurIsEditIng(isCurIsEditIng);
    }

    @HostListener('document:click', ['$event.target'])
    isContains(target) {
        lenovoPublic.selfLog2(x => console.log(target));
        const predictionListBtn = document.querySelector('.predictionFun-btn');
        if (predictionListBtn && !predictionListBtn.contains(target)) {
            this.isShowPredictionFunList(true);
        }
    }
}

