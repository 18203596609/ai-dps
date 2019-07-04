import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, TemplateRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
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

interface ParentData {
    id: string;
    data: any;
    btnList: string;
    curIsEditIng: any;
    groupUnionCode: string;
    projectModel: any;
    isShowDetails: boolean;
}

@Component({
    selector: 'app-single-comparison-diagram-parameter',
    templateUrl: './single_comparison_diagram_parameter.component.html',
    styleUrls: ['./single_comparison_diagram_parameter.component.scss']
})
export class SingleComparisonDiagramParameterComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    // param_yang----start
    @Input() parentData: ParentData = { id: '', data: {}, btnList: '', curIsEditIng: '', groupUnionCode: '', projectModel: {}, isShowDetails: false };
    @Input() parentAllData = [{ id: '', data: {}, btnList: '', curIsEditIng: false, groupUnionCode: '', projectModel: {} }];
    @Input() curIndex = 0; // 当前对比组的下标
    @Input() getAINum;
    @Input() fcSelect = [{ color: '', value: '', id: '' }];
    @Output() setChangeDataTosaveLinePopEmit = new EventEmitter();
    @Output() updatePlaceHolderEmit = new EventEmitter();
    @Output() setEditDataClick = new EventEmitter();
    @Output() editCalculateClick = new EventEmitter();
    @Output() editSaveLinesClick = new EventEmitter();
    @Output() editChangeLastTimeBuy = new EventEmitter();
    @Output() cancelEditEvent = new EventEmitter();
    @Output() isShowDetails = new EventEmitter();
    @Output() isShowPopEmit = new EventEmitter();
    @Output() setSelectValue = new EventEmitter();
    @Output() mouseenterPanelEvent = new EventEmitter();
    @Output() mouseleavePanelEvent = new EventEmitter();
    getEditLines: any = {}; // 获取当前获取线接口的所有线的数据
    last_time_buy: any = ''; // 时间
    ai: any = '-'; // 时间
    aiInwarrantyRate: any = '-'; // 时间
    curPageAllLineLastTimeBuy: any = new Set(); // 保存当前页面有多少个last_time_buy 即当前页面有多少根不重合的线

    getLineWithGroupUnionCode$; // 订阅获取线的事件

    isShowSavePop: boolean = false; // 是否显示当前提示框

    savePreLastTimeBuy = '';
    // param_yang----end


    diagramParameter$;
    allData;
    // 添加选择框列表
    selectListLi = [
        {
            'color': 'blue',
            value: '默认预测1',
            id: ''
        }
    ];
    curData = {
        'ai': '-',
        'aiInwarrantyRate': '-',
        'timeBegin': '-',
        'timeEnd': '-',
        'huInwarrantyRate': '-',
        'demandRate': '-'
    };
    fcSelect_value;
    fcSelect_color;
    constructor(
        private updataSubjectService: UpdataSubjectService,
        private getJsonService: GetJsonService,
        private loadingService: LoadingService,
        private codebaseService: CodebaseService,
        private interfaceParamModelService: InterfaceParamModelService,
        private dataManageService: DataManageService,
        private tooltipBoxService: TooltipBoxService,
    ) {

    }

    ngOnInit() {
        const time = new Date('2015-08-08');
        // this.setLastTimeBuy(this.codebaseService.dateTransform.formatDateToString(time, '-'));
        this.setLastTimeBuy('2015-08-08');
        window.addEventListener('click', this.eventListenerWindowClick);
        this.getShowData();
        // if (this.fcSelect) {
        //     $('.select-color-area').css('background', this.fcSelect[this.fcSelect.length - 1].color);
        // }
        // lenovoPublic.selfLog2(()=>console.log(this.fcSelect, 'parameter中的下拉列表', this.getAINum));
        // if (this.fcSelect.length > 0) {
        //     this.fcSelect_value = this.fcSelect[this.fcSelect.length - 1].value;
        //     this.fcSelect_color = this.fcSelect[this.fcSelect.length - 1].color;
        // }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // lenovoPublic.selfLog2(()=>console.log(changes));
        this.getData();
    }

    ngAfterViewInit() {
    }

    getData() {
        this.allData = this.parentData;
        // lenovoPublic.selfLog2(()=>console.log(this.parentData));
        // tslint:disable-next-line:no-unused-expression
        this.parentData && this.parentData.projectModel.diagramLines.map((item) => {
            if (item.lineValue === '6') {
                // this.last_time_buy = item.last_time_buy;
            }
            this.curPageAllLineLastTimeBuy.add(item.last_time_buy);
        });
        // this.ai = this.parentData.projectModel.diagramModel.ai;
        // this.aiInwarrantyRate = this.parentData.projectModel.diagramModel.aiInwarrantyRate;
        if (this.getAINum) {
            this.ai = this.getAINum.flRaByMounth;
            this.aiInwarrantyRate = this.getAINum.flWarranty;
            this.last_time_buy = this.getAINum.last_time_buy;
        }
    }

    public isShowDetailsClick() {
        this.isShowDetails.emit(this.parentData.id);
    }

    // 是否显示当前下啦选择框
    public showCurPredictionLineSelect(event) {
        if ($(event.target).parents('.dropdown').find('.select-option').css('display') !== 'none') {
            $(event.target).parents('.dropdown').find('.select-option').hide();
        } else {
            $('.select-option').hide();
            $(event.target).parents('.dropdown').find('.select-option').show();
        }
    }
    // 获取到当前选择的值
    public getCurValue(selectColorArea, selectValue, curId, index, id, pn) {
        const getEle = document.querySelector('#' + curId);
        const [selectColorAreaTag, selectValueTag] = [getEle.children[0], getEle.children[1]];
        selectColorArea.setAttribute('bgcolor', selectColorAreaTag.getAttribute('bgcolor'));
        selectValue.innerHTML = selectValueTag.innerHTML;
        this.showCurPredictionLineSelect({ target: document.querySelector(`#${curId}`) });
        const setParam = [selectValueTag.innerHTML, index, id, pn];
        this.setSelectValue.emit(setParam);
    }

    /**
     * 点击编辑当前预测曲线创建一根预测的曲线
     */
    public editCurLine() {
        if (this.parentData['curIsEditIng']) {
            return;
        }

        for (let i = 0; i < this.parentAllData.length; i++) {
            if (this.parentAllData[i]['curIsEditIng']) {
                this.cacelEdit(this.parentData, i);
                break;
            }
        }

        this.parentAllData.map((item) => {
            item.curIsEditIng = false;
        });
        this.setEditDataClick.emit(['正在编辑中', this.curIndex]);
        this.parentData['curIsEditIng'] = true;
        // lenovoPublic.selfLog2(()=>console.log(this.parentData));
        // lenovoPublic.selfLog2(()=>console.log(this.parentAllData));
        // this.getLineWithGroupUnionCode(false);
    }

    // 点击计算按钮时执行
    public editCalculate() {
        this.getLineWithGroupUnionCode(true);
    }

    // 显示保存预测线弹框
    public isHideSavePop(isShow) {
        if (isShow) {
            // const arr = Array.from(this.curPageAllLineLastTimeBuy);
            // if (arr.includes(this.last_time_buy)) {
            //     alert('当前last_time_buy已存在，请重新获取');
            //     return;
            // }
            this.setChangeDataTosaveLinePop({ type: 'saveLinesCurIndex', data: this.curIndex });
            this.setDiagramParameterToShowData({ type: 'updateSaveLinesPlaceHolder', data: { index: this.curIndex }, isPush: true });
        }

        this.isShowSavePop = isShow;
        this.isShowPopEmit.emit(this.isShowSavePop);
    }

    // 给保存线的弹框发送数据-----start
    private setChangeDataTosaveLinePop({ type, data }) {
        this.setChangeDataTosaveLinePopEmit.emit({ type, data });
    }
    // 给保存线的弹框发送数据-----end

    // 点击保存按钮时执行
    // tslint:disable-next-line:member-ordering
    saveLines2Project$;
    // tslint:disable-next-line:member-ordering
    setLineIsUsed$;
    public editSaveLines(param) {
        lenovoPublic.isShowGetJsonLoading.call(this, true);
        // lenovoPublic.selfLog2(()=>console.log(this.setLastTimeBuy()));
        // lenovoPublic.selfLog2(()=>console.log(this.last_time_buy));
        // 设置参数
        const setParam = (cont) => {
            const array = [];
            // lenovoPublic.selfLog2(()=>console.log(this.getEditLines.data));
            // tslint:disable-next-line:no-unused-expression
            this.getEditLines.data && this.getEditLines.data.diagramLines.map((item, itemIndex) => {
                item.last_time_buy = this.last_time_buyArr[this.curIndex].lastTimeBuy;
                item.name = cont.lineName;
                array.push(item);
            });
            // lenovoPublic.selfLog2(()=>console.log(array));
            // const params = Object.assign({}, {
            //     diagramLines: array,
            //     groupUnionCode: this.parentData.projectModel.basicModel.currentGroupUnionCode,
            //     pageCont: 0,
            //     pageIndex: 0,
            //     projectId: this.parentData.projectModel.projectId,
            //     userId: this.parentData.projectModel.userId,
            //     bSave: true
            // });

            const params = this.interfaceParamModelService.saveLines2Project({
                diagramLines: array,
                groupUnionCode: this.parentData.projectModel.basicModel.currentGroupUnionCode,
                pageCont: 0,
                pageIndex: 0,
                projectId: this.parentData.projectModel.projectId,
                userId: this.parentData.projectModel.userId,
                bSave: true
            });

            params.diagramLines.map((item) => {
                if (item.lineValue === '8') {
                    item.name = cont.lineName + '需求率';
                } else {
                    item.name = cont.lineName;
                }
            });

            // lenovoPublic.selfLog2(()=>console.log(params));
            return params;
        };


        // const lineParam = {
        //     groupUnionCode: this.allData.data.projectModel.basicModel.currentGroupUnionCode,
        //     forcastParams: {
        //         flRaByMounth: (Number(this.ai) || Number(this.ai) === 0) ? Number(this.ai) / 100 : 0.0001,
        //         flWarranty: (Number(this.aiInwarrantyRate) || Number(this.aiInwarrantyRate) === 0) ? Number(this.aiInwarrantyRate) / 100 : Number(0.01),
        //         last_time_buy: this.last_time_buy
        //     },
        //     pageCont: 0,
        //     pageIndex: 0,
        //     projectId: this.allData.data.projectModel.projectId,
        //     userId: this.allData.data.projectModel.userId,
        //     bSave: true
        // };

        // lenovoPublic.selfLog2(()=>console.log(this.last_time_buy));

        // 确定保存当前lines
        const saveSure = (cont) => {
            const lineParam = this.interfaceParamModelService.getLineWithGroupUnionCode({
                groupUnionCode: this.allData.data.projectModel.basicModel.currentGroupUnionCode,

                standerWarrantyLength: '',
                raByMounth: this.ai ? String(Number(this.ai) / 100) : '0',
                extendWarranty: this.aiInwarrantyRate ? String(Number(this.aiInwarrantyRate) / 100) : '0.05',
                last_time_buy: this.last_time_buy,
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

                // flRaByMounth: (Number(this.ai) || Number(this.ai) === 0) ? Number(this.ai) / 100 : 0.0001,
                // flWarranty: (Number(this.aiInwarrantyRate) || Number(this.aiInwarrantyRate) === 0) ? Number(this.aiInwarrantyRate) / 100 : Number(0.01),
                pageCont: 0,
                pageIndex: 0,
                name: cont.lineName,
                projectId: this.allData.data.projectModel.projectId,
                userId: this.allData.data.projectModel.userId,
                bSave: true

            });

            if (this.getEditLines.data && this.getEditLines.data.diagramLines) {
                this.saveLines2Project$ = this.getJsonService.saveLines2Project(setParam(param),
                    (data) => {
                        this.parentData.curIsEditIng = false;
                        this.curPageAllLineLastTimeBuy.add(this.last_time_buy); // 保存成功后添加记录last_time_buy

                        const mergeParam = Object.assign(param, {
                            lines: setParam(param).diagramLines
                        }); // 添加保存的线一起发送用于更新数据
                        this.editSaveLinesClick.emit([mergeParam, this.curIndex]);
                        this.isShowSavePop = false;
                        this.isHideSavePop(this.isShowSavePop);
                        lenovoPublic.isShowGetJsonLoading.call(this);
                        this.getEditLines = {};
                    }, (err) => {
                        this.getEditLines = {};
                        console.error(err);
                    });
            } else {
                this.getLineWithGroupUnionCode$ = this.getJsonService.getLineWithGroupUnionCode(lineParam,
                    (data) => {
                        // lenovoPublic.selfLog2(()=>console.log(data));
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
                            return;
                        }


                        this.parentData.curIsEditIng = false;
                        this.curPageAllLineLastTimeBuy.add(this.last_time_buy); // 保存成功后添加记录last_time_buy

                        const mergeParam = Object.assign(param, {
                            lines: setParam(param).diagramLines
                        }); // 添加保存的线一起发送用于更新数据
                        this.editSaveLinesClick.emit([mergeParam, this.curIndex]);
                        this.getEditLines = {};  // 点击保存时清空上次保存的线
                        lenovoPublic.isShowGetJsonLoading.call(this);
                        this.isShowSavePop = false;
                        this.isHideSavePop(this.isShowSavePop);
                    },
                    (err) => {
                        this.getEditLines = {};
                        console.error(err);
                    });
            }
        };

        // const mymessage = confirm('你确定要保存么');
        // if (mymessage) {
        saveSure(param);
        // } else {
        // console.dir('不保存');
        // }
    }


    //  取消编辑功能
    public cacelEdit(curParentData, curIndex) {
        // lenovoPublic.selfLog2(()=>console.log(curIndex));
        this.parentData.curIsEditIng = false;
        if (this.getLineWithGroupUnionCode$) {
            this.getLineWithGroupUnionCode$.unsubscribe();
        }
        this.cancelEditEvent.emit([false, curIndex]);
    }



    // change last_time_buy 事件
    public lastTimeBuyChange(event) {
        // clearTimeout(this.setTimeoutCollect['lastTimeBuyChangeTimer']);
        // this.setTimeoutCollect['lastTimeBuyChangeTimer'] = setTimeout(() => {
        // if (this.savePreLastTimeBuy !== this.last_time_buy) {
        // this.getLineWithGroupUnionCode(true);
        // this.savePreLastTimeBuy = this.last_time_buy;
        // }
        // }, 1000);
    }

    // 点击日期时更新last_time_buy
    private getDatePickerDate(param) {
        this.setLastTimeBuy(param);
    }

    // tslint:disable-next-line:member-ordering
    last_time_buyArr = [];

    // 更新last_time_buy 时间
    private setLastTimeBuy(param?) {
        if (param) {
            this.last_time_buy = param;
        }
        this.last_time_buyArr[this.curIndex] = {};
        this.last_time_buyArr[this.curIndex].lastTimeBuy = this.last_time_buy;
        // lenovoPublic.selfLog2(()=>console.log(this.last_time_buyArr));
        return this.last_time_buyArr[this.curIndex].lastTimeBuy;
    }

    // 动态修改icon
    public changeSelectIcon(isBlock, element) {
        if ($(element).parents('.dropdown').find('.select-option').css('display') !== 'block') {
            element.classList.remove('icon-top');
        } else if ($(element).parents('.dropdown').find('.select-option').css('display') === 'block' || $(event.target).parents('.dropdown').find('.select-option').css('display') === 'inline-block') {
            element.classList.add('icon-top');
        }
    }

    // 动态修改选择框内的色块值
    public changeSelectColor(id) {
        const dom = document.querySelector(`#${id}`);
        if (dom) {
            dom['style'].backgroundColor = dom.getAttribute('bgcolor');
        }
    }

    // 根据last_time_buy获取线
    private getLineWithGroupUnionCode(isChange) {
        lenovoPublic.isShowGetJsonLoading.call(this, true);
        // lenovoPublic.selfLog2(()=>console.log(this.last_time_buy));

        const param = this.interfaceParamModelService.getLineWithGroupUnionCode({
            groupUnionCode: this.parentData.projectModel.basicModel.currentGroupUnionCode,

            standerWarrantyLength: '',
            raByMounth: this.ai ? String(Number(this.ai) / 100) : '0',
            extendWarranty: this.aiInwarrantyRate ? String(Number(this.aiInwarrantyRate) / 100) : '0.05',
            last_time_buy: this.last_time_buy,
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

            pageCont: 0,
            pageIndex: 0,
            projectId: this.parentData.projectModel.projectId,
            userId: this.parentData.projectModel.userId,
            bSave: false,
            // flRaByMounth: (Number(this.ai) || Number(this.ai) === 0) ? Number(this.ai) / 100 : 0.0001,
            // flWarranty: (Number(this.aiInwarrantyRate) || Number(this.aiInwarrantyRate) === 0) ? Number(this.aiInwarrantyRate) / 100 : Number(0.01),
            // last_time_buy: this.last_time_buy
        });

        this.getLineWithGroupUnionCode$ = this.getJsonService.getLineWithGroupUnionCode(param,
            (data) => {
                if (data.returnCode === 200 || data.returnCode === 0) {
                    // this.getEditLines = data; // 获取当前编辑的线数据
                    // lenovoPublic.selfLog2(()=>console.log(this.getEditLines, '5654rfrref'));

                    // tslint:disable-next-line:no-unused-expression
                    this.parentData.curIsEditIng ? this.editCalculateClick.emit([data, this.curIndex]) : null;
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


    ngOnDestroy(): void {
        window.removeEventListener('click', this.eventListenerWindowClick);
        // this.diagramParameter$.unsubscribe();
        if (this.getLineWithGroupUnionCode$) {
            this.getLineWithGroupUnionCode$.unsubscribe();
        }
        if (this.saveLines2Project$) {
            this.saveLines2Project$.unsubscribe();
        }
        if (this.setLineIsUsed$) {
            this.setLineIsUsed$.unsubscribe();
        }
        if (this.getComparisonDiagramShowSubject$) {
            this.getComparisonDiagramShowSubject$.unsubscribe();
        }
    }



    // 向predictionShow发送数据
    /**
     * @param type type 当前执行的事件类型-----用分类用
     * @param data data 传递的数据
     * @param isPush isPush 当前是要发送数据给show还是向show要数据，通过get调用把要要的数据拿回来
     */
    private setDiagramParameterToShowData({ type, data, isPush }) {
        // lenovoPublic.selfLog2(()=>console.log('diagramparamter----show'));
        this.updataSubjectService.emitComparisonDiagramShowInfo({ type, data, isPush });
    }

    // tslint:disable-next-line:member-ordering
    getComparisonDiagramShowSubject$;
    // 接收show发送过来的数据
    private getShowData() {
        if (!this.getComparisonDiagramShowSubject$) {
            this.getComparisonDiagramShowSubject$ = this.updataSubjectService.getComparisonDiagramParamterSubject().subscribe((param) => {
                // lenovoPublic.selfLog2(()=>console.log('woshidiagramparamter -----woshoudaole'));
                const [type, data, isPush] = [param.type, param.data, param.isPush];
                if (isPush) {
                    this.setDiagramParameterToShowData({ type, data, isPush });
                    return;
                }

                // 保存线时如果是已经计算过的线则需要拿到线然后传回去用id过滤不必再划线了
                if (type === 'updataLineArrToSave') {
                    // 点击保存按钮时获取到当前保存的线
                    this.getEditLines['data'] = {};
                    this.getEditLines['data']['diagramLines'] = [];
                    data.map((item) => {
                        this.getEditLines['data']['diagramLines'].push(item);
                    });
                    // lenovoPublic.selfLog2(()=>console.log(data, this.getEditLines));
                    return this.getEditLines;
                }

                // 保存线时向prediction 要下一个要保存的线是什么名字
                if (type === 'updateSaveLinesPlaceHolder') {
                    // lenovoPublic.selfLog2(()=>console.log(data, 'fgdsfg ', this.curIndex));

                    this.updatePlaceHolderEmit.emit(data);
                    this.setChangeDataTosaveLinePop({ type: 'updateSaveLinesPlaceHolder', data: data });
                    return data;
                }

                if (type === 'editSaveLines') {
                    if (this.curIndex === data.curIndex) {
                        this.editSaveLines(data.data);
                    }
                }
            });
        }
    }


    // 鼠标划入面板
    mouseenterPanel() {
        const forecastParameter = document.getElementsByClassName('forecastParameter' + this.curIndex)[0];
        forecastParameter.classList.add('forecastParameterActive');
        setTimeout(() => {
            this.mouseenterPanelEvent.emit('asdf');
        }, 0);
    }
    // 鼠标离开面板
    mouseleavePanel() {
        const forecastParameter = document.getElementsByClassName('forecastParameter' + this.curIndex)[0];
        forecastParameter.classList.remove('forecastParameterActive');
        setTimeout(() => {
            this.mouseleavePanelEvent.emit('asdf');
        }, 0);

    }
}
