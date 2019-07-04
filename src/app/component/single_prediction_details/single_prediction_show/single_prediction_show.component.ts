import { Component, NgZone, OnInit, AfterViewInit, OnDestroy, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
import { GetJsonService, DataManageService, TooltipBoxService, LoadingService } from '../../../shared/service';
declare const $: any, lenovoPublic;

@Component({
    selector: 'app-single-prediction-show',
    templateUrl: './single_prediction_show.component.html',
    styleUrls: ['./single_prediction_show.component.scss']
})
export class SinglePredictionShowComponent implements OnInit, AfterViewInit, OnDestroy {
    // param_yang---start
    list = [
        {
            reason: [],
            method: [],
            lineType: 'ib'
        },
        {
            reason: [],
            method: [],
            lineType: 'ra'
        }
    ];

    chartAreaIsScale = false; // 区分当前图表是否处于放大
    curAIOrHumanOrSingle = 'AIPrediction'; // 区分当前是AI预测还是人工预测还是单组预测
    isCurEditIng = false; // 当前图表是否正在编辑
    isPausIng = false; // 当前是否是暂停中
    isShowRecordBox: string | boolean = false; // installBase=显示在保量编辑框，demandRates=显示修改需求率，false=都不显示框，all=两个修改框同时显示 点击暂停时显示记录框记录修正原因
    recordInputData = {
        installBase: [
            {
                id: String(Math.random()),
                type: 'reason',
                value: '',

            }, {
                id: String(Math.random()),
                type: 'method',
                value: '',
            }
        ],
        demandRates: [
            {
                id: String(Math.random()),
                type: 'reason',
                value: '',
            },
            {
                id: String(Math.random()),
                type: 'method',
                value: '',
            },
        ]
    };
    checkAmendRecord = false; // 是否显示修正记录
    amendRecordData = { // xi修正记录内容
        amendReasons: [
            {
                content: '拉什科独家发售多浪费空间啊善良的咖啡机阿斯利康的肌肤',
                id: String(Math.random())
            },
            {
                content: '拉什科独家发售多浪费空间啊善良的咖啡机阿斯利康的肌肤',
                id: String(Math.random())
            },
            {
                content: '拉什科独家发售多浪费空间啊善良的咖啡机阿斯利康的肌肤',
                id: String(Math.random())
            }
        ],
        amendMethods: [
            {
                content: '拉什科独家发售多浪费空间啊善良的咖啡机阿斯利康的肌肤',
                id: String(Math.random())
            },
            {
                content: '拉什科独家发售多浪费空间啊善良的咖啡机阿斯利康的肌肤',
                id: String(Math.random())
            },
            {
                content: '拉什科独家发售多浪费空间啊善良的咖啡机阿斯利康的肌肤',
                id: String(Math.random())
            }
        ],
        operatorHuman: ''
    };
    isShowUploadComponent = false; // 是否显示上传文件框
    fileList = []; // 上传文件保存文件信息

    isShowChangeNum = false; // 是否允许冒泡到document上后隐藏掉输入框
    isMouseDown = false; // 判断当前是否鼠标按下中
    curDragSeriesInfo = {}; // 保存当前拖拽的点的信息

    @Output() setShowDataToDiagramParameterEmit = new EventEmitter();
    @Output() updatePlaceHolderEmit = new EventEmitter();

    // param_yang---end


    @Output() default_forecastName = new EventEmitter();
    @Output() clickDefFc = new EventEmitter();
    @Output() fcLineOne_time = new EventEmitter();
    @Output() isShowPopEmit = new EventEmitter();
    predictionShow$;
    allData;
    curData = [];
    isLoading = true;
    echartsInstance_fc;
    echartsInstance_mf;
    // detachAndMerge = ['拆出需求率和故障率', '合并所有曲线'];
    detachAndMerge = ['拆出需求率和产品线大类需求率', '合并所有曲线'];
    dmValue;
    optionData;
    timeXfc;
    timeXmf;
    forecastOptions = {};

    malfunctionOptions = {};
    fcCheckBox = [];
    mlCheckBox = [];
    timeData = [];
    timeStartList = [];

    timeEndList = [];

    startNum;
    mfStartNum;
    endNum;
    mfEndNum;

    fcWidth;
    fcHeight;
    showStartTime = false;
    showEndTime = false;
    showtimeBox = false;
    startIndex;
    endIndex;
    setTimeoutArr = [];
    num: any = 1;
    // num: any = [1];
    setTime0;
    moveIndex = 0;
    forecastNameList = 0;
    timeoutShowLine;
    mfDataArr = [];
    showSetChartBtn = false;
    en = {
        'target': {
            'className': 'label_checkbox'
        }
    };
    delLineIndex = -1;
    defaultForecast = [];
    fcColor = [
        'rgba(34,188,6,0.83)',
        'rgba(2,128,241,0.6)',
        'rgba(255,160,4,0.8)',
        'rgba(30,139,102,0.88)',
        'rgba(12,63,191,0.7)',
        'rgba(251,83,160,0.93)',
        'rgba(88,40,241,0.7)'
    ];
    mfColor = [
        'rgba(0,190,219,1)',
        'rgba(199,203,0,0.95)',
        'rgba(148,148,171,0.77)',
        'rgba(4,44,155,0.88)',
        'rgba(78,102,255,0.87)',
        'rgba(236,0,6,0.7)'
    ];
    fcLinsData = [];
    mfLinsData = [];
    timeoutShowLine1;
    timeoutPositionNowBj;
    allLinesData;
    nowFcSeries;
    selectList = [];
    maxYValue = 0;
    maxMfYValue: any = 0;
    fcStartTime;
    nowTime;
    todayTime;
    forecastName_length = -1;
    edit_allData;
    last_time_buy = '2016-09-09';
    lastTimeBuyBUsed = [];
    legendTimeout;
    placehole_name;
    dIndex;
    markPoint_name;
    fc_markPoint_time: any;
    def_fcId; // 默认曲线的id
    position_Index = 0;
    forecastLineId;
    ibRatioNum = 1;
    fcSeries = [];
    isCalculate = false;
    mouseData = {
        'fc': {}, // 记录fc图表鼠标移入当前线的数据
        'mf': {}
    };
    ibAllLines = []; // 所有在保量曲线
    isShowOne = false; // 日期后面是否拼接-01
    onOff = {
        showDelLine: false, // 删除曲线确认框
        showExceedTenLine: false, // 超过10根曲线提示框
        chartBtn: false,
        diffChart: ''
    };
    editDataLine;
    displayBox = {
        edit: false
    };
    constructor(
        public updataSubjectService: UpdataSubjectService,
        public http: HttpClient,
        public getJsonService: GetJsonService,
        public dataManageService: DataManageService,
        public tooltipBoxService: TooltipBoxService,
        public loadingService: LoadingService,
        public zone: NgZone,
        public elementRef: ElementRef,
    ) {

    }

    ngOnInit() {

        {
            // 初始化图表是否是放大状态及获取当前是AI预测还是人工预测还是单组预测-----start
            this.curAIOrHumanOrSingle = lenovoPublic.curAIOrHumanOrSingle() || 'singlePrediction'; // 获取当前是AI预测还是人工预测还是单组预测
            const obj = {
                AIPrediction: 'AIPrediction',
                humanPrediction: 'humanPrediction',
                default: 'singlePrediction'
            };
            // 设置图表区域及参数区是否放大
            this.chartAreaIsScale = this.dataManageService.getScaleChart(obj[this.curAIOrHumanOrSingle || 'default']);
            lenovoPublic.setCss(document.querySelector('.detail-parameter>.left'), { display: ['block', 'none'][+this.chartAreaIsScale] });
            // 初始化图表是否是放大状态及获取当前是AI预测还是人工预测还是单组预测-----end
        }

        this.getData();
        this.dmValue = this.detachAndMerge[0];
        lenovoPublic.selfLog2(() => console.log('ngoninit'));

        setTimeout(() => {
            // console.log(this.malfunctionOptions);

        }, 5000);

    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit');
        clearTimeout(this.setTimeoutArr[1]);
        window.addEventListener('resize', () => {
            this.setTimeoutArr[1] = setTimeout(() => {
                this.timePosition(this.position_Index);
                lenovoPublic.selfLog2(() => console.log(this.echartsInstance_fc.getHeight(), 111111));
            }, 100);
        });
        this.afterviewInit();

    }

    clickDmValue() {
        if ($('.dmValueBg').hasClass('dmValue1Bg')) {
            $('.dmUl').hide();
            $('.dmValueBg').removeClass('dmValue1Bg');
        } else {
            $('.dmValueBg').addClass('dmValue1Bg');
            $('.dmUl').show();
        }

    }

    @HostListener('document:mouseenter', ['$event.target'])
    insideClick(targetElement: any) {
        // lenovoPublic.selfLog2(() => console.log(targetElement, 7878787));
    }
    // 合并图表
    margeChart(mg) {
        clearTimeout(this.timeoutShowLine);
        $('.dmValue').removeClass('dmValue1');
        $('.dmUl').removeClass('dmUl1');
        this.dmValue = mg.innerHTML;
        if (mg.innerHTML === '合并所有曲线') {
            if ($('#chartTwo').css('display') === 'none') {
                return;
            }
            $('#chartTwo').css('display', 'none');
            for (let i = 0; i < this.mlCheckBox.length; i++) {
                this.mlCheckBox[i].num = this.fcCheckBox.length;
                this.fcCheckBox.push(this.mlCheckBox[i]);
                this.forecastOptions['series'].push({
                    id: this.mlCheckBox[i].id,
                    name: this.mlCheckBox[i].legendName,
                    type: 'line',
                    smooth: true,
                    // symbol: 'none',
                    showSymbol: false, // 是否显示symbol
                    hoverAnimation: false,
                    lineStyle: {
                        color: this.mlCheckBox[i].color,
                        width: 2,
                        opacity: 0.7,
                    },
                    itemStyle: { // 拐折点样式
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: this.fcColor[(this.fcCheckBox.length - 1) % 7] // 0% 处的颜色
                                }, {
                                    offset: 1, color: this.fcColor[(this.fcCheckBox.length - 1) % 7] // 100% 处的颜色
                                }],
                                global: false, // 缺省为 false
                                onlyName: this.mlCheckBox[i].content,
                                useLineType: this.mlCheckBox[i].lineType,
                            },
                            borderColor: this.fcColor[(this.fcCheckBox.length - 1) % 7],
                            borderWidth: 8
                        }
                    },
                    connectNulls: true,
                    yAxisIndex: 1,
                    data: this.opt([], i, this.mfLinsData)
                });
                this.forecastOptions['yAxis'][1].show = true;
                this.forecastOptions = Object.assign({}, this.forecastOptions);
            }
            this.timeoutShowLine = setTimeout(() => {
                for (let i = 0; i < this.fcCheckBox.length; i++) {
                    this.fcLegendClick(this.en, 'fc', !this.fcCheckBox[i].isShow, i, this.fcCheckBox[i].legendName);
                }
            }, 10);
        } else {
            if ($('#chartTwo').css('display') === 'block') {
                return;
            }
            $('#chartTwo').css('display', 'block');
            this.forecastOptions['series'].splice(this.fcCheckBox.length - this.mlCheckBox.length, this.mlCheckBox.length);
            this.fcCheckBox.splice(this.fcCheckBox.length - this.mlCheckBox.length, this.mlCheckBox.length);
            this.forecastOptions['yAxis'][1].show = false;
            this.forecastOptions = Object.assign({}, this.forecastOptions);
            this.echartsInstance_fc.setOption({
                yAxis: [
                    {
                        id: 'forecastR',
                        show: false
                    }
                ]
            });
            for (let i = 0; i < this.mlCheckBox.length; i++) {
                this.mlCheckBox[i].num = i;
            }
            this.timeoutShowLine = setTimeout(() => {
                for (let i = 0; i < this.fcCheckBox.length; i++) {
                    this.fcLegendClick(this.en, 'fc', !this.fcCheckBox[i].isShow, i, this.fcCheckBox[i].legendName);
                }
                for (let i = 0; i < this.mlCheckBox.length; i++) {
                    this.fcLegendClick(this.en, 'mf', !this.mlCheckBox[i].isShow, i, this.mlCheckBox[i].legendName);
                }
            }, 10);
        }
        this.defForecastLine(this.forecastLineId);
    }

    // forecast的初始化
    forecastChartInit(ec) {
        this.echartsInstance_fc = ec;
        this.echartsInstance_fc.getZr().on('mousemove', param => {
            this.dIndex = this.echartsInstance_fc.convertFromPixel({ seriesIndex: 0 }, [param.offsetX, param.offsetY])[0];
            const sIndex = 2;
            const dIndex = this.dIndex;
            this.setTooltipFc(sIndex, this.dIndex);
            this.setTooltipMf(0, this.dIndex);
            if (this.isMousemove) {
                return;
            }
            this.isMousemove = true;
            this.echartsInstance_fc.setOption({
                xAxis: {
                    axisPointer: {
                        show: true
                    }
                }
            });

            // 关联故障图表显示 判断故障图表显示再关联
            this.echartsInstance_mf.setOption({
                xAxis: {
                    axisPointer: {
                        show: true
                    }
                }
            });


        });
        this.echartsInstance_fc.getZr().on('globalout', param => {
            this.isMousemove = false;
            this.dIndex = this.echartsInstance_fc.convertFromPixel({ seriesIndex: 0 }, [param.offsetX, param.offsetY])[0];
            const sIndex = 0;
            const dIndex = this.dIndex;
            this.hideTooltipDom();
            this.echartsInstance_fc.setOption({
                xAxis: {
                    axisPointer: {
                        show: false
                    }
                }
            });
            // 关联故障图表关闭 判断故障图表显示再关联
            this.echartsInstance_mf.setOption({
                xAxis: {
                    axisPointer: {
                        show: false
                    }
                }
            });
        });
        // this.echartsInstance_fc.getZr().on('datazoom', param => {
        //     alert(333);
        //     this.defTimeList(this.timeData, this.startNum, this.endNum);
        // });
    }

    // tslint:disable-next-line:member-ordering
    isMousemove = false;
    // malfunction初始化
    malfunctionChartInit(ec) {
        this.echartsInstance_mf = ec;
        const vm = this;
        /**
         * 元素的点击事件，只有点击在图表的拐点的圈上时才会触发
         */
        vm.echartsInstance_mf.on('click', function (param, event) {
            if (!vm.isCurEditIng) {
                // 如果不在编辑状态
                // lenovoPublic.selfLog2(x => console.log('当前图表不在编辑状态'));
                return;
            }
            console.log(param);
            vm.isShowChangeNum = true;
            vm.curDragSeriesInfo = param;


            const position = vm.echartsInstance_mf.convertFromPixel('grid', [param.event.offsetX, param.event.offsetY]);
            const [x, y] = vm.echartsInstance_mf.convertToPixel('grid', position);
            const htmlFontSize = parseFloat(document.getElementsByTagName('html')[0].style.fontSize);
            const iptH = $('#changeRaNum2').height();
            console.log(position, x, y);

            $('#changeRaNum2').show().val('');
            $('#changeRaNum2').css({ left: x + 3.999999 + 0.9 * htmlFontSize, top: y - (iptH / 2) });

            setTimeout(() => {
                lenovoPublic.selfLog2((xx) => console.log('hide'));
                vm.isShowChangeNum = false;
            }, 100);
        });

        /**
         * 图表的点击事件，点击在图表上任意位置都触发
         */
        vm.echartsInstance_mf.getZr().on('click', function (param) {
            // setTimeout(() => {
            //     if (!vm.isShowChangeNum) {
            //         // console.log(param);
            //     }
            // }, 0);
        });

        /**
         * 图表的mousedown事件，只有按在圈上时才会触发
         */
        vm.echartsInstance_mf.on('mousedown', function (param) {
            if (!vm.isCurEditIng) {
                // 如果不在编辑状态
                lenovoPublic.selfLog2(x => console.log('当前图表不在编辑状态'));
                return;
            }
            console.log('mousedown', param, vm.echartsInstance_mf.getOption());
            vm.curDragSeriesInfo = param;
            vm.isMouseDown = true;
        });

        this.echartsInstance_mf.getZr().on('mousemove', param => {
            {
                // ra需求率线的拖拽操作
                if (vm.isMouseDown && vm.curDragSeriesInfo['seriesName']) {
                    $('#draggable').css({ top: param.offsetY - 3.999999 });
                    const position = vm.echartsInstance_mf.convertFromPixel('grid', [param.event.offsetX, param.offsetY - 3.999999 + 10]);
                    const curDragSeriesInfo = vm.curDragSeriesInfo;
                    const curSeries = vm.malfunctionOptions['series'].find(x => x.name === curDragSeriesInfo['seriesName'] && x.id === curDragSeriesInfo['seriesId']);
                    const dataIndex = curDragSeriesInfo['dataIndex'], id = curDragSeriesInfo['seriesId'], name = curDragSeriesInfo['seriesName'];

                    if (curSeries) {
                        curSeries.data[dataIndex]['value'] = position[1];
                        vm.echartsInstance_mf.setOption({
                            series: [{
                                id: id,
                                name: name,
                                type: 'line',
                                data: curSeries.data
                            }]
                        });
                    } else {
                        lenovoPublic.selfLog2(x => console.log('当前没有拖拽的元素'));
                    }
                }

                if (vm.isMouseDown && vm.curDragSeriesInfo['seriesName']) {
                    return;
                }
            }


            this.dIndex = this.echartsInstance_mf.convertFromPixel({ seriesIndex: 0 }, [param.offsetX, param.offsetY])[0];
            const sIndex = 1;
            this.setTooltipMf(sIndex, this.dIndex);
            this.setTooltipFc(2, this.dIndex);


            if (this.isMousemove) {
                // 限制下边的事件仅在mousemove时执行一次
                return;
            }
            this.isMousemove = true;
            this.echartsInstance_mf.setOption({
                xAxis: {
                    axisPointer: {
                        show: true
                    }
                }
            });
            // 关联预测图表
            this.echartsInstance_fc.setOption({
                xAxis: {
                    axisPointer: {
                        show: true
                    }
                }
            });
        });

        /**
         * 图表的鼠标抬起mouseup事件
         */
        vm.echartsInstance_mf.getZr().on('mouseup', function (param) {
            vm.isMouseDown = false;
        });

        this.echartsInstance_mf.getZr().on('globalout', param => {
            this.isMousemove = false;
            this.dIndex = this.echartsInstance_mf.convertFromPixel({ seriesIndex: 0 }, [param.offsetX, param.offsetY])[0];
            const sIndex = 0;
            const dIndex = this.dIndex;
            this.hideTooltipDom();
            this.echartsInstance_mf.setOption({
                xAxis: {
                    axisPointer: {
                        show: false
                    }
                }
            });
            // 关联预测图表关闭
            this.echartsInstance_fc.setOption({
                xAxis: {
                    axisPointer: {
                        show: false
                    }
                }
            });
        });
        this.echartsInstance_mf.getZr().on('datazoom', param => {
            this.defTimeList(this.timeData, this.startNum, this.endNum);
        });
    }

    // 隐藏tooltipDom
    public hideTooltipDom() {
        const toolTipDom1 = this.elementRef.nativeElement.querySelector('.tooltip_times');
        if (this.echartsInstance_fc.getOption().series[0].data.length > 0 && toolTipDom1) {
            toolTipDom1.parentNode.style.display = 'none';
        }
        const toolTipDom2 = this.elementRef.nativeElement.querySelector('.tooltip_mftimes');
        if (this.echartsInstance_mf.getOption().series[0].data.length > 0 && toolTipDom2) {
            toolTipDom2.parentNode.style.display = 'none';
        }
    }

    // 显示tooltip
    private setTooltipFc(sIndex: any, dIndex: any) {
        if (this.echartsInstance_fc) {
            this.echartsInstance_fc.dispatchAction({
                type: 'showTip',
                seriesIndex: sIndex,
                dataIndex: dIndex
            });
        }
    }

    // 显示提示框
    private setTooltipMf(sIndex: any, dIndex: any) {
        if (this.echartsInstance_mf) {
            // 显示tooltip
            this.echartsInstance_mf.dispatchAction({
                type: 'showTip',
                seriesIndex: sIndex,
                dataIndex: dIndex
            });
        }
    }

    // 显示设置当前预测框
    showSetChart(event, cont, num, id, data) {
        clearTimeout(this.legendTimeout);
        lenovoPublic.selfLog2(() => console.log(event, cont, num, id));
        const parentLeft = document.querySelector('.fc-chart-checkBox');
        // console.log('移入事件', event, event.target.offsetTop, parentLeft['offsetLeft'], parentLeft.scrollTop, cont, num, id);
        this.mouseData.fc = data;
        $('.fcOperation').hide();
        $('.conChart,.isEnsure,.amendChart,.nowChart,.delChart').hide();
        if (cont && (cont === 'keDiagramLineType_Custom_Upload_Warranty' || cont === 'keDiagramLineType_Custom_Define_Pred')) {
            $('.fcOperation').show();
            $(`.fcOperation,.delChart,.amendChart`).show();
        } else if (cont && cont.includes('keDiagramLineType_long_term_pred')) {
            // } else if (cont && !cont.includes('keDiagramLineType_ib') && !cont.includes('keDiagramLineType_usage') && !cont.includes('keDiagramLineType_ra') && !cont.includes('keDiagramLineType_ProductLineRa')) {
            $('.fcOperation').show();
            $(`.nowChart`).show();
            // 是否出现保存按钮
            for (let i = 0; i < this.fcCheckBox.length; i++) {
                if (!this.fcCheckBox[num]['save']) {
                    $(`.conChart`).show();
                    $(`.delChart`).show();
                }
                if (!this.fcCheckBox[num]['ensure'] && this.fcCheckBox[num]['save']) {
                    lenovoPublic.selfLog2(() => console.log('是否确认时间', this.fcCheckBox[num]['ensure']));
                    $(`.isEnsure`).show();
                }
            }
        }

        $('.fcOperation').css({ 'top': (event.target.offsetTop - parentLeft.scrollTop + 25) + 'px', 'left': parentLeft['offsetLeft'] });

        this.echartsInstance_fc.setOption({
            series: [{
                type: 'line',
                id: id,
                lineStyle: {
                    width: 8,
                    shadowBlur: 10,
                    shadowColor: 'rgba(10,29,30,0.63)',
                    shadowOffsetY: 4,
                    // opacity: 0.56
                },
            }]
        });
        lenovoPublic.selfLog2(() => console.log(this.fcCheckBox));
        event.preventDefault();
    }

    // 鼠标移入操作框中
    showChartBtn() {
        // console.log('鼠标进入操作框');
        clearTimeout(this.legendTimeout);
    }

    // 隐藏当前预测框  fc图表取消高亮
    hideSetChart(id?) {
        clearTimeout(this.legendTimeout);
        id = id ? id : this.mouseData.fc['id'];
        // console.log(this.mouseData.fc, id, '鼠标移出事件');
        this.legendTimeout = setTimeout(() => {
            $('.fcOperation').hide();
        }, 100);
        if (this.forecastLineId === id) {
            this.echartsInstance_fc.setOption({
                series: [{
                    type: 'line',
                    id: id,
                    lineStyle: {
                        width: 8,
                        shadowBlur: 0,
                        shadowColor: 'rgba(10,29,30,0)',
                        shadowOffsetY: 0,
                        opacity: 1
                    },
                }]
            });
        } else {
            this.echartsInstance_fc.setOption({
                series: [{
                    type: 'line',
                    id: id,
                    lineStyle: {
                        width: 2,
                        shadowBlur: 0,
                        shadowColor: 'rgba(10,29,30,0)',
                        shadowOffsetY: 0,
                        opacity: 1
                    },
                }]
            });
        }
    }

    // mf图表高亮
    mfShowSetChart(event, id, data) {
        clearTimeout(this.legendTimeout);
        $('.mfOperation,.mf-nowChart,.mf-conChart,.mf-isEnsure,.mf-amendChart,.mf-delChart').hide();
        this.mouseData.mf = data;
        const parentLength = document.querySelector('.mf-chart-checkBox');
        // console.log(event.target.offsetTop, parentLength['offsetLeft'], parentLength['scrollTop'], (event.target.offsetTop - parent['scrollTop'] + 25) + 'px');
        // if (this.mouseData.mf['lineType'] === 'keDiagramLineType_ProductLineRa') {
        if (this.mouseData.mf['lineType'] === 'keDiagramLineType_Custom_Upload_Ra') {
            $('.mfOperation,.mf-amendChart,.mf-delChart').show();
            $('.mfOperation').css({ 'top': (event.target.offsetTop - parentLength['scrollTop'] + 25) + 'px', 'left': parentLength['offsetLeft'] + 'px' });
        }
        this.echartsInstance_mf.setOption({
            series: [{
                name: id,
                lineStyle: {
                    width: 8,
                    shadowBlur: 10,
                    shadowColor: 'rgba(10,29,30,0.63)',
                    shadowOffsetY: 4,
                    // opacity: 0.56
                },
            }]
        });
        event.preventDefault();
    }

    /// mf图表取消高亮
    mfHideSetChart(name?) {
        clearTimeout(this.legendTimeout);
        name = name ? name : this.mouseData.mf['legendName'];
        this.legendTimeout = setTimeout(() => {
            $('.mfOperation').hide();
        }, 100);
        this.echartsInstance_mf.setOption({
            series: [{
                name: name,
                lineStyle: {
                    width: 2,
                    shadowBlur: 0,
                    shadowColor: 'rgba(10,29,30,0)',
                    shadowOffsetY: 0,
                    opacity: 1
                },
            }]
        });
    }


    // 重新设置forecastOption时更新图表
    updateOption() {
        clearTimeout(this.timeoutShowLine);
        this.forecastOptions = Object.assign({}, this.forecastOptions);
        this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        this.timeoutShowLine = setTimeout(() => {
            for (const [key, item] of Object.entries(this.fcCheckBox)) {
                item.num = key;
                this.fcLegendClick(this.en, 'fc', !item.isShow, item.num, item.legendName);
            }
            for (const [key, item] of Object.entries(this.mlCheckBox)) {
                item.num = key;
                this.fcLegendClick(this.en, 'mf', !item.isShow, item.num, item.legendName);
            }
            lenovoPublic.selfLog2(() => console.log(this.fcCheckBox, '删除后'));
        }, 1);
    }

    // 点击设置当前预测曲线
    clickNowChart() {
        $('.fcOperation').hide();
        this.forecastLineId = this.mouseData.fc['id'];
        this.defForecastLine(this.forecastLineId);
    }


    // 点击保存
    clickSave() {
        this.isCalculate = true;
        this.isShowPopEmit.emit(true);
        this.placehole_name = this.mouseData.fc['content'];
        const arr = [];
        for (const item of this.edit_allData) {
            if (this.mouseData.fc['lineCode'] === item.lineParmUnionCode) {
                arr.push(item);
            }
        }
        this.setShowDataToDiagramParameter({ type: 'updataLineArrToSave', data: arr, isPush: false });
        this.updatePlaceHolderEmit.emit(this.placehole_name);
        lenovoPublic.selfLog2(() => console.log(arr, '保存时的缓存'));
    }

    // 点击确认使用
    clickConfirmUse() {
        let mIndex = -1;
        const id = this.mouseData.fc['id'];
        this.fcCheckBox.map((item, index) => {
            if (item.id === id) {
                mIndex = index;
                return;
            }
        });
        $('.confirmUseBox').show();
        const obj = {};
        for (const item of this.edit_allData) {
            if (id === item.lineId) {
                this.last_time_buy = item.timeLine[0];
                obj['bUsed'] = true;
                obj['lineType'] = 'keDiagramLineType_long_term_pred';
                obj['timeLine'] = item.timeLine;
                this.lastTimeBuyBUsed.push(obj);
            }
        }
        this.updataEnsure(id);
        this.fcCheckBox[mIndex].ensure = true;
        $(`ensure${mIndex}`).css('display', 'inline-block');
    }

    // 点击确认使用发送请求
    updataEnsure(id) {
        this.getJsonService.setLineIsUsed({ lineId: id, used: true }, (data) => {
            this.updataSubjectService.emitHistoryDataInfo(this.lastTimeBuyBUsed);
            lenovoPublic.selfLog2(() => console.log(this.lastTimeBuyBUsed));
            this.lastTimeBuyBUsed = [];
            lenovoPublic.selfLog2(() => console.log(data));
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log(err));
        });
    }


    // 关闭确认使用时间选择框
    clickClock() {
        $('.confirmUseBox').hide();
    }

    // private getDatePickerDate(param) {
    //     this.setLastTimeBuy(param);
    // }

    // // 更新last_time_buy 时间
    // private setLastTimeBuy(param?) {
    //     if (param) {
    //         this.last_time_buy = param;
    //         $('.confirmUseBox').hide();
    //     }
    //     return this.last_time_buy;
    // }

    // 点击删除曲线
    clickDelLine(val) {
        this.onOff.showDelLine = true;
        this.onOff.diffChart = val;
    }

    // 确认删除曲线
    confirmDelLine() {
        // if (this.delLineIndex < 1) {
        //     $('.delLineBox,.fcOperation').hide();
        //     this.tooltipBoxService.setTooltipBoxInfo({
        //         message: [{
        //             text: `该曲线不可删除`,
        //             style: {}
        //         }]
        //     }, 'alert');
        //     // alert('该曲线不可删除');
        //     return;
        // }
        let checkBox = this.fcCheckBox, chartData = this.mouseData.fc, useSeries = this.forecastOptions['series'];
        if (this.onOff.diffChart === 'fc') {
            checkBox = this.fcCheckBox, chartData = this.mouseData.fc, useSeries = this.forecastOptions['series'];
        } else if (this.onOff.diffChart === 'mf') {
            checkBox = this.mlCheckBox, chartData = this.mouseData.mf, useSeries = this.malfunctionOptions['series'];
        }

        let yIndex = -1;
        const useId = chartData['id'];
        checkBox.map((item, index) => {
            if (item.id === useId) {
                yIndex = index;
            }
        });
        checkBox.splice(yIndex, 1);

        useSeries.map((item, fIndex) => {
            if (item.id === useId) {
                useSeries.splice(fIndex, 1);
                return;
            }
        });

        this.getJsonService.deletLineByIds([useId], (data) => {
            $('.fcOperation,.mfOperation').hide();
            this.onOff.showDelLine = false;
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log('error'));
        });
        this.defForecastLine(this.forecastLineId);
        lenovoPublic.selfLog2(() => console.log(useId, this.mouseData, checkBox, useSeries));
    }


    // 取消删除曲线
    countermandLine() {
        $('.fcOperation').hide();
        this.onOff.showDelLine = false;
    }

    // fc选择开始的日期
    clickStartNum(num, nn) {
        let timeIndex = 0;
        const bfc = 100 / this.timeXfc.length;
        // if (nn.includes('mf')) {
        this.startNum = num;
        for (let i = 0; i < this.timeXfc.length; i++) {
            if (this.startNum === this.timeXfc[i].slice(0, 7)) {
                timeIndex = i;
            }
        }
        this.echartsInstance_mf.dispatchAction({
            type: 'dataZoom',
            start: bfc * timeIndex,
        });
        this.echartsInstance_fc.dispatchAction({
            type: 'dataZoom',
            start: bfc * timeIndex,
        });
        this.defTimeList(this.timeData, this.startNum, this.endNum);
        this.nowFcXZ = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.dataTimeX);
        this.nowFcYZ = this.echartsInstance_fc.convertToPixel({ yAxisId: 'ForecastL' }, this.dataTimeY);
        this.positionNowBj(this.editDataLine);
        // } else {
        //     this.startNum = num;
        //     for (let i = 0; i < this.timeXfc.length; i++) {
        //         if (this.startNum === this.timeXfc[i].slice(0, 7)) {
        //             timeIndex = i;
        //         }
        //     }
        //     this.defTimeList(this.timeData, this.startNum, this.endNum, nn);
        // }
    }

    // fc选择结束的日期
    clickEndNum(num, nn) {
        const bfc = 100 / this.timeXfc.length;
        let timeIndex = 0;
        // if (nn.includes('mf')) {
        this.endNum = num;
        for (let i = 0; i < this.timeXfc.length; i++) {
            if (this.endNum === this.timeXfc[i].slice(0, 7)) {
                timeIndex = i;
            }
        }
        this.echartsInstance_mf.dispatchAction({
            type: 'dataZoom',
            end: bfc * timeIndex,
        });
        this.echartsInstance_fc.dispatchAction({
            type: 'dataZoom',
            end: bfc * timeIndex,
        });
        this.defTimeList(this.timeData, this.startNum, this.endNum);
        this.nowFcXZ = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.dataTimeX);
        this.nowFcYZ = this.echartsInstance_fc.convertToPixel({ yAxisId: 'ForecastL' }, this.dataTimeY);
        this.positionNowBj(this.editDataLine);
        // } else {
        //     this.endNum = num;
        //     for (let i = 0; i < this.timeXfc.length; i++) {
        //         if (this.endNum === this.timeXfc[i].slice(0, 7)) {
        //             timeIndex = i;
        //         }
        //     }
        //     this.defTimeList(this.timeData, this.startNum, this.endNum, nn);
        // }
    }

    fcLegendClick(event: any, chartType: any, status: any, index: any, lgName) {
        lenovoPublic.selfLog2(() => console.log(status, lgName));

        // 加className判断,防止line显示没有动画, label标签点击事件执行两次
        // if ((event.target.className.includes('label_checkbox') || event.target.className.includes('show_box')
        //     || event.target.className.includes('check_one_Box') || event.target.className.includes('check_box_right') || event.target.className.includes('check_value')) && this.echartsInstance_fc
        //     && this.echartsInstance_mf) {
        for (let i = 0; i < this.fcCheckBox.length; i++) {
            if (lgName === this.fcCheckBox[i].legendName) {
                this.fcCheckBox[i].isShow = !status;
            }
        }
        for (let i = 0; i < this.mlCheckBox.length; i++) {
            if (lgName === this.mlCheckBox[i].legendName) {
                this.mlCheckBox[i].isShow = !status;
            }
        }

        // 判断是哪个
        lenovoPublic.selfLog2(() => console.log('是否执行', status, this.echartsInstance_mf, this.malfunctionOptions, this.forecastOptions, this.fcCheckBox, this.mlCheckBox));
        if (this.optionData) {

            // if (chartType === 'fc') {
            if (status) {
                this.echartsInstance_fc.dispatchAction({
                    type: 'legendUnSelect',
                    name: lgName
                });
                this.echartsInstance_mf.dispatchAction({
                    type: 'legendUnSelect',
                    name: lgName
                });
            } else {
                this.echartsInstance_fc.dispatchAction({
                    type: 'legendSelect',
                    name: lgName
                });
                this.echartsInstance_mf.dispatchAction({
                    type: 'legendSelect',
                    name: lgName
                });
            }
            //     return;
            // } else if (chartType === 'mf') {
            //     if (status) {
            //         this.echartsInstance_mf.dispatchAction({
            //             type: 'legendUnSelect',
            //             name: this.mlCheckBox[index].id
            //         });
            //     } else {
            //         this.echartsInstance_mf.dispatchAction({
            //             type: 'legendSelect',
            //             // id: this.mlCheckBox[index].id
            //             name: this.mlCheckBox[index].id
            //         });
            //     }
            //     return;
            // }
        }
        // }
    }

    // 更新曲线的legend
    clickFclegend(fcNum, mfNum) {
        for (let i = fcNum; i < this.fcCheckBox.length; i++) {
            this.fcLegendClick(this.en, 'fc', !this.fcCheckBox[i].isShow, i, this.fcCheckBox[i].legendName);
        }
        for (let j = mfNum; j < this.mlCheckBox.length; j++) {
            this.fcLegendClick(this.en, 'mf', !this.mlCheckBox[j].isShow, j, this.mlCheckBox[j].legendName);
        }
    }

    /**
     * 计算this.num  在保量的倍数
     * this.maxYValue  fc图表左边Y轴的最大值
     *  */
    setMaxY(option) {
        const data = [];
        for (const item of option) {
            if (item.lineType.includes('keDiagramLineType_long_term_pred') || item.lineType.includes('keDiagramLineType_usage') || item.lineType.includes('keDiagramLineType_ib') || item.lineType.includes('keDiagramLineType_Custom_Upload_Warranty') || item.lineType.includes('keDiagramLineType_Custom_Define_Pred')) {
                data.push(item);
            }
        }

        const options = { 'usageLength': 0, 'ibLength': 0, 'forecastLength': 0, 'xzIb': 0, 'xzFc': 0 };
        for (const item of data) {
            // 取usage数据的最大值  需求量
            if (item.lineType === 'keDiagramLineType_usage') {
                options.usageLength = Math.max.apply(null, item.value);
            }
            // 取ib数据的最大值  在保量
            if (item.lineType === 'keDiagramLineType_ib') {
                options.ibLength = Math.max.apply(null, item.value);
            }
            if (item.lineType === 'keDiagramLineType_long_term_pred') {
                options.forecastLength = Math.max.apply(null, item.value);
            }
            if (item.lineType === 'keDiagramLineType_Custom_Upload_Warranty') {
                options.xzIb = Math.max.apply(null, item.value);
            }
            if (item.lineType === 'keDiagramLineType_Custom_Define_Pred') {
                options.xzFc = Math.max.apply(null, item.value);
            }
        }

        // 获取需求量 和预测的最大值
        const fcOrUsage = Math.max(options.forecastLength, options.usageLength, options.xzFc);
        const ibOrXzIb = Math.max(options.ibLength, options.xzIb);
        // this.num = 1; // 在保量的倍数
        this.num = Math.ceil(ibOrXzIb / fcOrUsage); // 在保量的倍数
        this.maxYValue = ibOrXzIb / this.num;
        // for (const item of data) {
        //     if (item.lineType === 'keDiagramLineType_ib') {
        //         if (Math.max.apply(null, item.value) / Number(this.num) > this.maxYValue) {
        //             this.maxYValue = Math.max.apply(null, item.value) / Number(this.num);
        //         }
        //         continue;
        //     } else if (item.lineType === 'keDiagramLineType_Custom_Upload_Warranty') {
        //         if (Math.max.apply(null, item.value) / Number(this.num) > this.maxYValue) {
        //             this.maxYValue = Math.max.apply(null, item.value) / Number(this.num);
        //         }
        //         continue;
        //     } else if (Math.max.apply(null, item.value) > this.maxYValue) {
        //         this.maxYValue = Math.max.apply(null, item.value);
        //     }
        // }
        console.log(data, this.num, this.maxYValue, options);
        lenovoPublic.selfLog2(() => console.log(data, this.num, this.maxYValue, options));

    }

    // mf图表的最大值
    setMfMaxY(option) {
        const data = [];
        for (const item of option) {
            if (item.lineType.includes('keDiagramLineType_ProductLineRa') || item.lineType.includes('keDiagramLineType_ra')) {
                data.push(item);
            }
        }

        for (const item of data) {
            // const num = Number(Math.max.apply(null, item.value));
            const num = (Number(Math.max.apply(null, item.value)) * 100).toFixed(4);
            if (num > this.maxMfYValue) {
                this.maxMfYValue = num;
            }
        }
        lenovoPublic.selfLog2(() => console.log(this.maxMfYValue, 'dfdtrg', data));
        console.log(this.maxMfYValue, 'dfdtrg', data);
    }

    // forecast获取option
    setForecastOptions(option) {
        this.fcLinsData = [];
        this.forecastName_length = -1;
        this.fcCheckBox = [];
        this.timeData = [];
        // this.allLinesData = [];
        this.selectList = [];
        this.maxYValue = 0;
        let ibShow = true;
        // lenovoPublic.selfLog2(()=>console.log(this.forecastNameList, '判断是第几次点击计算'));

        // this.allLinesData.push(option.diagramLines);
        for (let i = 0; i < option.diagramLines.length; i++) {
            if (option.diagramLines[i].lineType === 'keDiagramLineType_ib') {
                this.fcLinsData.push(option.diagramLines[i]);
                break;
            }
        }
        option.diagramLines.map((item, index) => {
            if (item.lineType === 'keDiagramLineType_ib') {
                this.ibAllLines.push(item);
            }
            if (item.lineType === 'keDiagramLineType_Custom_Upload_Warranty') {
                this.fcLinsData.push(item);
            }
        });
        option.diagramLines.map((item, index) => {
            if (item.lineType === 'keDiagramLineType_usage') {
                this.fcLinsData.push(item);
            }
        });
        option.diagramLines.map((item, index) => {
            if (item.lineType === 'keDiagramLineType_long_term_pred' || item.lineType === 'keDiagramLineType_Custom_Define_Pred') {
                this.fcLinsData.push(item);
            }
            if (item.lineType === 'keDiagramLineType_long_term_pred') {
                this.defaultForecast[0] = item;
            }
        });

        clearTimeout(this.setTimeoutArr[0]);
        this.showtimeBox = true;
        // 获取X轴截取至月的所有日期
        for (const item of this.timeXfc) {
            this.timeData.push(item.slice(0, 7));
        }
        this.startIndex = this.timeXfc.length;
        this.endIndex = 0;
        this.defTimeList(this.timeData);

        this.setMaxY(option.diagramLines);

        const ibMultiple = this.num;
        const that = this;
        if (this.num && ibShow) {
            this.ibRatioNum = this.num;
            ibShow = false;
        }

        let defFcIndex = -1;
        this.fcSeries = [];
        for (let i = 0; i < this.fcLinsData.length; i++) {
            if (this.fcLinsData[i].lineType === 'keDiagramLineType_long_term_pred') {
                // if (this.fcLinsData[i].timeLine.length < 1) {
                //     this.fcLinsData[i].timeLine = [this.timeXfc[0]];
                // }
                // if (this.fcLinsData[i].value.length < 1) {
                //     this.fcLinsData[i].value = [''];
                // }
                this.forecastName_length++;
                defFcIndex = i;
                this.setFcSeries(this.fcLinsData[i].lineParmUnionCode, this.fcLinsData[i].lineParmUnionCode, this.fcLinsData[i].lineId, this.fcLinsData[i].bUsed, this.fcLinsData[i].name, i, this.fcLinsData);

                this.selectList.push({ // 给下拉选择框发送预测线的名称
                    'color': this.fcColor[i % 7],
                    value: this.fcCheckBox[i].content,
                    id: this.fcCheckBox[i].id
                });
            } else {
                this.setFcSeries(this.fcLinsData[i].lineId, this.fcLinsData[i].lineParmUnionCode, this.fcLinsData[i].lineId, this.fcLinsData[i].bUsed, this.fcLinsData[i].name, i, this.fcLinsData);
            }

        }

        const legendN = [];
        this.fcCheckBox.map((iten, index) => {
            legendN.push({ name: iten.legendName });
        });
        // this.forecastOptions['legend'].data = legendN;
        // lenovoPublic.selfLog2(()=>console.log(legendN));
        const htmlFontSize = parseFloat(document.getElementsByTagName('html')[0].style.fontSize);
        // 设置forecast的option
        this.forecastOptions = {
            // title: {
            //     text: `在保量（/${this.num}）/需求量/预测`,
            //     textStyle: {
            //         fontFamily: 'MicrosoftYaHeiUI',
            //         fontSize: '14/20+rem',
            //         color: '#3F4659',
            //     },
            //     left: '1%',
            //     top: '20/20+rem',
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(83,89,114,0.64)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(83,89,114,0.61)' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        },
                        width: 2,
                    },
                    label: {
                        show: false,
                    }
                },
                position: function (point, params, dom, rect, size) {
                    if (point[0] > (size.viewSize[0] / 2)) {
                        return [point[0] - dom.offsetWidth, '12%'];
                    } else {
                        return [point[0] + 5, '12%'];
                    }
                },
                formatter: function (params) {
                    // console.log(params);
                    let res = '<p class="tooltip_fctimes tooltip_times">' + params[0].name + '</p><div class="tooltip_box">';
                    for (let i = 0; i < params.length; i++) {
                        if (params[i].value === '') {
                            params[i].value = '-';
                        } else {
                            if (params[i].color.useLineType.includes('keDiagramLineType_ra') || params[i].color.useLineType.includes('keDiagramLineType_ProductLineRa')) {
                                params[i].value = Number(params[i].value).toFixed(4) + '%';
                            } else if (params[i].color.useLineType.includes('keDiagramLineType_ib') || params[i].color.useLineType.includes('keDiagramLineType_Custom_Upload_Warranty')) {
                                params[i].value = Number(params[i].value) * that.num;
                            } else if (params[i].color.useLineType.includes('keDiagramLineType_usage')) {
                                params[i].value = params[i].value;
                            } else {
                                params[i].value = Number(params[i].value).toFixed(1);
                            }
                        }
                        res += '<p><span class="tooltip_name">' + params[i].color.onlyName + '</span><span class="tooltip_value">' + params[i].value + '</span></p>';
                    }
                    res += '</div>';
                    return res;
                },
                backgroundColor: 'rgba(50,50,50,0)'
            },
            legend: {
                show: false,
                // data: [], // 全部按钮名字
                textStyle: {    // 图例文字的样式
                    color: 'red',
                },
            },
            grid: {
                left: '1.5%',
                right: '0',
                bottom: '1%',
                containLabel: true
            },
            xAxis: [{
                id: 'Forecast',
                type: 'category',
                nameTextStyle: {
                    color: 'rgba(63,70,89,0.75)',
                    // opacity: 0.75;
                    fontFamily: 'Gotham- Book',
                    fontSize: 12 / 20 + 'rem',
                },
                axisLabel: {
                    margin: 15,
                    formatter: function (value, index) {
                        if (value) {
                            const date = value.slice(0, 7);
                            return date;

                        }
                    },
                    interval: (index, value) => {
                        // lenovoPublic.selfLog2(()=>console.log(index, value, this.timeXfc.length));
                        if (this.timeXfc.length > 8) {
                            if (index % (Math.ceil(this.timeXfc.length / 8)) !== 0) {
                                return false;
                            } else {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                },
                axisTick: {
                    show: false,
                },
                axisPointer: {

                },
                boundaryGap: true,  // 两边留白策略(图形超出坐标范围)，
                data: this.timeXfc,
            }],
            yAxis: [{
                name: `在保量（/${this.num}）∙ 需求量 ∙ 预测`,
                id: 'ForecastL',
                type: 'value',
                nameGap: 22,
                nameLocation: 'end',
                nameTextStyle: {
                    fontFamily: 'MicrosoftYaHeiUI',
                    // fontSize: '14/20+rem',
                    color: '#3F4659',
                    padding: [0, 0, 0, 110]
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    formatter: function (value, index) {
                        if (that.maxYValue < 10) {
                            return value.toFixed(2);
                        } else {
                            return value.toFixed(0);
                        }
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(148,158,182,0.2)'
                    }
                },
                position: 'left',
                min: 0,
                max: Math.ceil(this.maxYValue),
                interval: (Math.ceil(this.maxYValue) - 0) / 5
                // splitNumber: 6
            },
            {
                name: '需求率·产品线大类需求率（%）',
                nameLocation: 'end',
                id: 'forecastR',
                type: 'value',
                show: false,
                nameGap: 22,
                nameTextStyle: {
                    fontFamily: 'MicrosoftYaHeiUI',
                    // fontSize: '14/20+rem',
                    color: '#3F4659',
                    padding: [0, 80, 0, 0]
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                },
                position: 'right',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value < 0) {
                            return value.toFixed(4);
                        } else if (value >= 0) {
                            return value.toFixed(4);
                        }
                    }
                },
                min: 0,
                max: this.maxMfYValue,
                interval: ((this.maxMfYValue) - 0) / 5
                // splitNumber: 6
            }
            ],
            dataZoom: [{
                type: 'inside',
                show: false,
                start: 0,
                end: 100,
            }],
            series: this.fcSeries
        };


        this.placehole_name = `预测${this.forecastOptions['series'].length - 2}`;
        this.default_forecastName.emit(this.selectList);


        if (defFcIndex > -1) { // 后台未返回预测曲线
            this.forecastLineId = this.forecastOptions['series'][defFcIndex].id;
            // tslint:disable-next-line:no-unused-expression
            this.fcCheckBox[defFcIndex] && (this.fcCheckBox[defFcIndex].def = true);

            this.defForecastLine(this.forecastLineId); // 设置默认预测曲线为加粗
            this.fcStartTime = this.fcLinsData[defFcIndex].forcastParams;

            this.fcLineOne_time.emit(this.fcStartTime); // 发送算法参数
            this.position_Index = defFcIndex;
        }

        this.setTimeoutArr[0] = setTimeout(() => {
            this.timePosition(); // 定位自定义下拉时间框的位置
            if (defFcIndex > -1) {
                this.positionNowFc(this.position_Index); // 定位当前预测曲线的位置
            }
            this.linesTen();
            lenovoPublic.selfLog2(() => console.log(this.maxYValue, '最大值', this.selectList));
            for (const item of this.fcCheckBox) {
                this.hideSetChart(item.id);
            }
            for (const item of this.mlCheckBox) {
                this.mfHideSetChart(item.id);
            }
            // lenovoPublic.selfLog2(()=>console.log(this.fcCheckBox));
            // debugger;
        }, 1);
        // console.log(this.forecastOptions, this.echartsInstance_fc.getOption());
        lenovoPublic.selfLog2(() => console.log(this.forecastOptions));
    }

    // 设置fc图表的series
    setFcSeries(lGName, unCode, id, bused, name, index, data) {
        lenovoPublic.selfLog2(() => console.log(this.fcCheckBox, this.fcSeries, lGName));
        this.fcCheckBox.push({
            content: name,
            isShow: true,
            color: this.fcColor[index % 7],
            num: index,
            lineCode: unCode,
            save: true, // 是否保存
            id: id,
            ensure: bused, // 是否出现'确'字
            def: false, // 是否为前预测曲线
            legendName: lGName, // 控制曲线出现隐藏的name
            lineType: data.find(x => x.lineId === id).lineType,
        });
        this.fcSeries.push({
            id: id,
            name: lGName,
            type: 'line',
            smooth: true,
            // symbol: 'none',
            showSymbol: false, // 是否显示symbol
            hoverAnimation: false,
            lineStyle: {
                color: this.fcColor[index % 7],
                width: 2,
            },
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: this.fcColor[index % 7] // 0% 处的颜色
                        }, {
                            offset: 1, color: this.fcColor[index % 7] // 100% 处的颜色
                        }],
                        global: false, // 缺省为 false
                        onlyName: name,
                        useLineType: data[index].lineType,
                    },
                    borderColor: this.fcColor[index % 7],
                    borderWidth: 8
                }
            },
            connectNulls: true,
            data: this.opt([], index, data)
        });
    }

    // 计算需求率图表中 组类 月年的值
    private groupClassMonthYear(data) {
        /**
         *  monthNum  by月的值  yearNum  by年的值
         * raAdd 需求率的1年值的和  productAdd产品线大类1年值的和
         * raValue  当前需求率的线的数据  productValue当前产品线的数据
         *  */
        let monthNum = 0, yearNum = 0, raAdd = 0, productAdd = 0, raValue = [], productValue = [];
        this.mfLinsData.map((item, index) => {
            if (item.lineType === 'keDiagramLineType_ra' && this.defaultForecast[1].lineParmUnionCode) {
                raValue = this.opt([], index, this.mfLinsData);
            } else if (item.lineType === 'keDiagramLineType_ProductLineRa') {
                productValue = this.opt([], index, this.mfLinsData);
            }
        });
        // console.log(monthNum, data, raValue, productValue, 999, yearNum, raAdd, productAdd);
        this.timeXfc.map((item, index) => {
            if (data === item) {
                if (Number(raValue[index].value) === 0 || Number(productValue[index].value) === 0 || !raValue[index].value || !productValue[index].value) {
                    monthNum = 0;
                } else {
                    monthNum = Number(raValue[index].value) / Number(productValue[index].value);
                }
                for (let k = 0; k < 12; k++) {
                    if (raValue[index - k]) {
                        raAdd = raAdd + Number(raValue[index - k].value);
                    } else {
                        raAdd = raAdd + 0;
                    }
                    if (productValue[index - k]) {
                        productAdd = productAdd + Number(productValue[index - k].value);
                    } else {
                        productAdd = productAdd + 0;
                    }
                }
                if (!raAdd || !productAdd) {
                    yearNum = 0;
                } else {
                    yearNum = raAdd / productAdd;
                }
            }
        });
        monthNum = monthNum === 0 ? 0 : Number(monthNum.toFixed(6));
        yearNum = yearNum === 0 ? 0 : Number(yearNum.toFixed(6));
        // console.log(monthNum, data, raValue, productValue, 999, yearNum, raAdd, productAdd);
        return [monthNum, yearNum];
    }

    // malfunction获取option
    setMalfunctionOptions(option) {
        this.mfLinsData = [];
        this.mlCheckBox = [];
        this.maxMfYValue = 0;
        const that = this;
        for (const item of option.diagramLines) {
            if (item.lineType.includes('keDiagramLineType_ProductLineRa') || item.lineType.includes('keDiagramLineType_ra') || item.lineType.includes('keDiagramLineType_Custom_Upload_Ra')) {
                this.mfLinsData.push(item);
            }
            if (item.lineType === 'keDiagramLineType_ra') {
                this.defaultForecast[1] = item; // 保存当前默认预测线的数据
            }
        }
        // for (const item of option.diagramLines) {
        //     if (item.lineType.includes('keDiagramLineType_ra')) {
        //         this.mfLinsData.push(item);
        //     }
        // }
        this.setMfMaxY(option.diagramLines);
        // for (let i = 0; i < this.mfLinsData.length; i++) {
        //     this.setMfMaxY(Math.max.apply(null, this.mfLinsData[i].value));
        // }

        // this.mfDataArr.push(this.opt([], 3, this.optionData.projectModel.diagramLines));
        this.timeXmf = option.groupModel.baseTimeLine;
        const options = option.diagramLines;
        // lenovoPublic.selfLog2(()=>console.log(this.timeXmf));
        this.malfunctionOptions = {
            // backgroundColor: '#394056',
            title: {
                text: '需求率·产品线大类需求率(%)',
                textStyle: {
                    fontFamily: 'MicrosoftYaHeiUI',
                    fontSize: '14/20+rem',
                    color: '#3F4659',
                },
                left: '1%',
                top: '18/20+rem',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(83,89,114,0.64)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(83,89,114,0.61)' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        },
                        width: 2,
                    },
                    label: {
                        show: false,
                    }
                },
                position: function (point, params, dom, rect, size) {
                    if (point[0] > (size.viewSize[0] / 2)) {
                        return [point[0] - dom.offsetWidth, '12%'];
                    } else {
                        return [point[0] + 5, '12%'];
                    }
                },
                formatter: function (params) {
                    let res = '<p class="tooltip_times tooltip_mftimes">' + params[0].name + '</p><div class="tooltip_box">';
                    for (let i = 0; i < params.length; i++) {
                        if (params[i].value === '') {
                            params[i].value = '-';
                        } else {
                            params[i].value = Number(params[i].value).toFixed(4) + '%';
                        }
                        res += '<p><span class="tooltip_nameMf">' + params[i].color.onlyName + '</span><span class="tooltip_value">' + params[i].value + '</span></p>';
                    }
                    const groupValue = that.groupClassMonthYear(params[0].name);
                    res += '<div class="tooltip_groupBox"><p><span class="tooltip_nameMf">组/类（by月）</span><span class="tooltip_value">' + groupValue[0] + '</span></p><p><span class="tooltip_nameMf">组/类（by年）</span><span class="tooltip_value">' + groupValue[1] + '</span></p></div></div>';
                    // res += '';
                    return res;
                },
                backgroundColor: 'rgba(50,50,50,0)'
            },
            legend: {
                show: false,
                // data: option.lineName, // 全部按钮名字
                textStyle: {    // 图例文字的样式
                    color: 'red',
                },
            },
            dataZoom: [{
                type: 'inside',
                show: false,
                start: 0,
                end: 100,
            }],
            grid: {
                left: '1.5%',
                right: '3%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: [{
                id: 'malfunction',
                type: 'category',
                nameTextStyle: {
                    color: 'rgba(63,70,89,0.75)',
                    // opacity: 0.75;
                    fontFamily: 'Gotham- Book',
                    fontSize: 12 / 20 + 'rem',
                },
                axisLabel: {
                    margin: 15,
                    formatter: function (value, index) {
                        if (value) {
                            const date = value.slice(0, 7);
                            return date;
                        }
                    },
                    interval: (index, value) => {
                        // lenovoPublic.selfLog2(()=>console.log(index, value, this.timeXfc.length));
                        if (this.timeXfc.length > 8) {
                            if (index % (Math.ceil(this.timeXfc.length / 8)) !== 0) {
                                return false;
                            } else {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                },
                axisTick: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                boundaryGap: true,  // 两边留白策略(图形超出坐标范围)
                data: this.timeXfc
            }],
            yAxis: [{
                type: 'value',
                nameGap: 8,
                nameLocation: 'end',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    formatter: function (value, index) {
                        if (value === 0) {
                            return value.toFixed(0);
                        } else if (value > 0) {
                            return value.toFixed(4);
                        }
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(148,158,182,0.2)'
                    }
                },
                min: 0,
                max: this.maxMfYValue,
                interval: ((this.maxMfYValue - 0) / 5)
            }],
            series: []
        };

        for (let i = 0; i < this.mfLinsData.length; i++) {
            if (this.mfLinsData[i].lineType.includes('keDiagramLineType_ProductLineRa') || this.mfLinsData[i].lineType.includes('keDiagramLineType_Custom_Upload_Ra')) {
                this.setMfSeries(this.mfLinsData[i].lineId, this.mfLinsData[i].lineParmUnionCode, this.mfLinsData[i].lineId, this.mfLinsData[i].name, i, this.mfLinsData);
            } else {
                this.setMfSeries(this.mfLinsData[i].lineParmUnionCode, this.mfLinsData[i].lineParmUnionCode, this.mfLinsData[i].lineId, this.mfLinsData[i].name, i, this.mfLinsData);
            }
        }
    }

    // 设置mf图表的series
    setMfSeries(lGName, unCode, id, name, index, data) {
        this.mlCheckBox.push({
            content: name,
            isShow: true,
            color: this.mfColor[index % 6],
            num: index,
            lineCode: unCode,
            id: id,
            legendName: lGName,
            lineType: data[index].lineType,
        });

        this.malfunctionOptions['series'].push({
            id: id,
            name: lGName,
            type: 'line',
            smooth: false,
            // symbol: 'none',
            showSymbol: false, // 是否显示symbol
            hoverAnimation: false,
            lineStyle: {
                color: this.mfColor[index % 6],
                width: 2,
                opacity: 0.7,
            },
            itemStyle: { // 拐折点样式
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: this.mfColor[index % 6] // 0% 处的颜色
                        }, {
                            offset: 1, color: this.mfColor[index % 6] // 100% 处的颜色
                        }],
                        global: false, // 缺省为 false
                        onlyName: name,
                        useLineType: data[index].lineType,
                    },
                    borderColor: this.mfColor[index % 6],
                    borderWidth: 8
                }
            },
            connectNulls: true,
            data: this.opt([], index, data)
        });
    }

    // 展示线数据的长度处理
    opt(opts, index, optiondata) {
        const usageArr = [];
        for (const item of optiondata[index].value) {
            // 转换ib展示的数据
            usageArr.push(Number(item) / this.num);
        }
        // lenovoPublic.selfLog2(()=>console.log(num.toString().replace(/,/g, '')));
        for (let i = 0; i < this.timeXfc.length; i++) {
            opts.push('');
        }

        let deltaTime = 0;
        // 将每条线的data转为和时间轴一样长的数组
        for (let j = 0; j < optiondata[index].timeLine.length; j++) {
            for (let i = 0; i < this.timeXfc.length; i++) {
                if (this.timeXfc[i] === optiondata[index].timeLine[j] || this.timeXfc[i].slice(0, 7) === optiondata[index].timeLine[j].slice(0, 7)) {
                    // 处理ib的数据
                    if (optiondata[index].lineType && (optiondata[index].lineType === 'keDiagramLineType_ib' || optiondata[index].lineType === 'keDiagramLineType_Custom_Upload_Warranty')) {
                        opts[i] = {
                            name: this.timeXfc[i],
                            symbolSize: '0',
                            value: usageArr[j],
                            itemStyle: {
                                borderWidth: 1,
                                borderColor: 'red',
                            }
                        };
                        // opts[i] = usageArr[j];

                    } else if (optiondata[index].lineType && (optiondata[index].lineType === 'keDiagramLineType_ra' || optiondata[index].lineType === 'keDiagramLineType_ProductLineRa' || optiondata[index].lineType === 'keDiagramLineType_Custom_Upload_Ra')) {
                        let timeXfcCurDate = '';
                        // timeXfcCurDate = this.timeXfc[i];
                        timeXfcCurDate = this.timeXfc[i].length === 7 ? this.timeXfc[i] + '-01' : this.timeXfc[i];
                        // timeXfcCurDate = this.isShowOne ? this.timeXfc[i] + '-01' : this.timeXfc[i];
                        const curDateTime = new Date().getTime();
                        const timeXfcCurDateTime = new Date(timeXfcCurDate).getTime();


                        // console.log(this.mfColor[index % 6]);

                        opts[i] = {
                            name: this.timeXfc[i],
                            symbol: 'circle',
                            value: Number(optiondata[index].value[j]) * 100,
                            itemStyle: {
                                borderWidth: 2,
                                borderColor: this.mfColor[index % 6],
                            }
                        };
                        if (timeXfcCurDateTime >= curDateTime && deltaTime < 12) {
                            opts[i]['symbolSize'] = '8';
                            deltaTime++;
                        } else {
                            opts[i]['symbolSize'] = '0';
                        }

                        if (
                            optiondata[index].lineType === 'keDiagramLineType_Custom_Upload_Ra' ||
                            optiondata[index].lineType === 'keDiagramLineType_ProductLineRa'
                        ) {
                            opts[i]['symbolSize'] = '0';
                        }

                        // opts[i] = Number(optiondata[index].value[j]) * 100;
                    } else {
                        opts[i] = {
                            name: this.timeXfc[i],
                            symbolSize: '0',
                            value: optiondata[index].value[j],
                            itemStyle: {
                                borderWidth: 1,
                                borderColor: 'red',
                            }
                        };
                        // opts[i] = optiondata[index].value[j];

                    }

                }
            }
        }
        // console.log(this.num, optiondata, index, this.ibRatioNum, opts, optiondata[index].name);
        return opts;
    }


    // 定义timeStartList和timeEndList数组
    defTimeList(data, start?, end?) {
        const dataLength = data.length;
        for (const [index, item] of Object.entries(data)) {
            if (start === item) {
                this.endIndex = Number(index);
            } else if (end === item) {
                this.startIndex = Number(index);
            }
        }
        if (this.startIndex === data.length) {
            this.startIndex = data.length - 1;
        }
        this.timeStartList = data.slice(0, this.startIndex);
        this.timeEndList = data.slice(this.endIndex + 1, dataLength);
        this.timePosition();
        // lenovoPublic.selfLog2(()=>console.log(data, start, end, this.endIndex, this.startIndex, this.timeStartList, this.timeEndList, 333333));
    }

    // X轴自定义时间的位置
    timePosition(nn?) {
        // alert(typeof nn);
        clearTimeout(this.setTime0);
        if (this.echartsInstance_fc) {
            lenovoPublic.selfLog2(() => console.log(this.echartsInstance_fc));
            this.fcWidth = this.echartsInstance_fc && this.echartsInstance_fc.getWidth && this.echartsInstance_fc.getWidth();
            this.fcHeight = this.echartsInstance_fc && this.echartsInstance_fc.getHeight && this.echartsInstance_fc.getHeight();
        }
        this.setTime0 = setTimeout(() => {

            const htmlFontSize = parseFloat(document.getElementsByTagName('html')[0].style.fontSize);
            // const fctimeStartWidth = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.startNum);
            // const fctimeEndWidth = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.endNum);
            const fctimeStartWidth = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.isShowOne ? this.startNum + '-01' : this.startNum);
            const fctimeEndWidth = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.isShowOne ? this.endNum + '-01' : this.endNum);

            $('#chartOne .timeStart').css({ 'top': this.fcHeight - 22 + htmlFontSize, 'left': fctimeStartWidth - 18 });
            $('#chartOne .timeEnd').css({ 'top': this.fcHeight - 22 + htmlFontSize, 'left': fctimeEndWidth - 18 });

            $('#chartTwo .timeStart').css({ 'top': this.fcHeight - 22, 'left': fctimeStartWidth - 18 });
            $('#chartTwo .timeEnd').css({ 'top': this.fcHeight - 22, 'left': fctimeEndWidth - 18 });
        }, 100);
        // }
    }

    // 显示开始的选择时间
    fcClickStn() {
        $('.timeBoxstartfc').toggle();
    }
    // 显示结束的选择时间
    fcClickEtn() {
        $('.timeBoxendfc').toggle();
    }
    // 显示开始的选择时间
    mfClickStn() {
        $('.timeBoxstartmf').toggle();
    }
    // 显示结束的选择时间
    mfClickEtn() {
        $('.timeBoxendmf').toggle();
    }

    // 获取返回数据
    getData() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
        // let month_1 = new Date().getMonth() - 2 < 10 ? '0' + (new Date().getMonth() - 2) : new Date().getMonth() - 2;
        const month_2 = new Date().getMonth() + 4 < 10 ? '0' + (new Date().getMonth() + 4) : new Date().getMonth() + 4;
        const date = new Date().getDate() < 10 ? ('0' + new Date().getDate()) : (new Date().getDate());
        this.todayTime = year + '-' + month;
        if (!this.predictionShow$) {
            this.predictionShow$ = this.updataSubjectService.getDiagramBottomSubject().subscribe((data) => {
                this.allData = data.data.projectModel.diagramLines;
                this.edit_allData = [...this.allData];
                this.optionData = data.data;
                lenovoPublic.selfLog2(x => console.log(this.optionData, data));

                this.forecastLineId = this.optionData.projectModel.currentPredLineId;
                this.timeXfc = this.optionData.projectModel.groupModel.baseTimeLine;
                this.isShowOne = this.timeXfc[0].length > 7 ? true : false;
                this.nowTime = this.isShowOne ? year + '-' + month + '-01' : year + '-' + month;
                this.setMalfunctionOptions(data.data.projectModel);
                this.setForecastOptions(data.data.projectModel);
                this.startNum = data.data.projectModel.groupModel.baseTimeLine[0].slice(0, 7);
                this.endNum = data.data.projectModel.groupModel.baseTimeLine[data.data.projectModel.groupModel.baseTimeLine.length - 1].slice(0, 7);
                this.mfStartNum = data.data.projectModel.groupModel.baseTimeLine[0].slice(0, 7);
                this.mfEndNum = data.data.projectModel.groupModel.baseTimeLine[data.data.projectModel.groupModel.baseTimeLine.length - 1].slice(0, 7);
                this.isLoading = false;
                $('#chartTwo').css('display', 'block');
                // 记录默认预测曲线的id
                // this.setForecastLine(this.forecastLineId);
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
            });
        }
    }

    // 设置默认预测曲线并调取接口记录
    setForecastLine(id) {
        console.log('接口保存默认预测id', id);
        this.getJsonService.getNowForecastLine(id, (data) => {
            lenovoPublic.selfLog2(() => console.log(data));
            if (data.returnCode !== 0) {
                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: `${data.msg}`,
                        style: {}
                    }]
                }, 'alert');
                // alert(data.msg);
            }
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log(err));
        });
    }

    // 默认曲线变化时在保量曲线发生变化
    setDefIbLine(fcId) {
        const warrantyUnionCode = this.edit_allData.find((item) => item.lineId === fcId).warrantyUnionCode;
        if (!warrantyUnionCode) {
            return;
        }
        const ibLine = this.ibAllLines.find((item) => item.warrantyUnionCode === warrantyUnionCode);
        let ibIndex = -1, warrantyIndex = -1;
        this.fcLinsData.map((item, index) => {
            if (item.lineType === 'keDiagramLineType_ib') {
                ibIndex = index;
                this.fcLinsData[ibIndex] = ibLine;
            }
            if (item.lineType === 'keDiagramLineType_Custom_Upload_Warranty') {
                warrantyIndex = index;
            }
        });
        this.fcCheckBox.map((item, index) => {
            if (item.lineType === 'keDiagramLineType_ib') {
                [this.fcCheckBox[index].content, this.fcCheckBox[index].lineCode, this.fcCheckBox[index].id, this.fcCheckBox[index].legendName, this.fcCheckBox[index].lineType] = [ibLine.name, ibLine.lineParmUnionCode, ibLine.lineId, ibLine.lineId, ibLine.lineType];
            }
        });

        // ib曲线发生变化时Y轴的最大值需重新计算
        this.setMaxY(this.fcLinsData);
        this.setMfMaxY(this.mfLinsData);
        this.againFcOption(this.num, this.maxYValue, this.maxMfYValue);

        this.forecastOptions['series'].map((item, index) => {
            if (item.itemStyle.normal.color.useLineType === 'keDiagramLineType_ib') {
                [this.forecastOptions['series'][index]['id'], this.forecastOptions['series'][index].name, this.forecastOptions['series'][index].itemStyle.normal.color.onlyName, this.forecastOptions['series'][index].data] = [ibLine.lineId, ibLine.lineId, ibLine.name, this.opt([], ibIndex, this.fcLinsData)];
            }
            if (item.itemStyle.normal.color.useLineType === 'keDiagramLineType_Custom_Upload_Warranty') {
                this.forecastOptions['series'][index].data = this.opt([], warrantyIndex, this.fcLinsData);
            }
        });
        this.malfunctionOptions['series'].map((item, index) => {
            this.malfunctionOptions['series'][index].data = this.opt([], index, this.mfLinsData);
        });
        // console.log(warrantyIndex, warrantyUnionCode, this.ibAllLines, ibLine,
        //     ibIndex, this.fcLinsData, this.fcCheckBox,
        //     this.forecastOptions['series']);
    }

    // 选择默认预测曲线
    defForecastLine(id) {
        if (!id) {
            return;
        }
        clearTimeout(this.setTimeoutArr[2]);
        clearTimeout(this.timeoutShowLine1);
        let index = 0;
        let jlSeriesId = '';
        const fcDef = this.fcCheckBox.find((item) => item.id === id);
        fcDef.def = true;

        for (const [key, item] of Object.entries(this.forecastOptions['series'])) {
            item['lineStyle'].width = 2;
            if (item['id'].includes(id)) {
                index = Number(key);
                jlSeriesId = item['id'];
                this.nowFcSeries = item;
            }
        }

        // 设置默认预测对应的ib曲线
        this.setDefIbLine(id);
        // this.fcCheckBox[index].isShow = true;
        this.forecastOptions = Object.assign({}, this.forecastOptions);
        this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        console.log(this.forecastOptions, '设置默认预测曲线中', this.malfunctionOptions);
        // 获取默认预测曲线的数据  发送默认线的时间
        this.defaultForecast[0] = this.edit_allData.find((item) => item.lineId === jlSeriesId);
        this.fcStartTime = this.defaultForecast[0].forcastParams;

        this.defaultForecast[1] = this.edit_allData.find((item) => {
            if (item.lineParmUnionCode === this.defaultForecast[0].lineParmUnionCode && item.lineType.includes('keDiagramLineType_ra')) {
                return item;
            }
        });

        let mf_echartIndex: any = -1;

        for (const [key, item] of Object.entries(this.malfunctionOptions['series'])) {
            if (this.defaultForecast[1].lineId === item['id']) {
                mf_echartIndex = key;
            }
        }

        // 设置默认预测曲线的样式
        this.timeoutShowLine1 = setTimeout(() => {
            // 获取修改默认预测曲线的name
            const name = this.forecastOptions['series'].find((param) => param.id === id).name;
            // lenovoPublic.selfLog2(()=>console.log(name, id));

            this.echartsInstance_fc.setOption({
                series: [
                    {
                        type: 'line',
                        name: name,
                        lineStyle: {
                            width: 8,
                        },
                        markLine: {
                            type: 'dotted',
                            symbol: 'none',
                            data: [{
                                name: '预测',
                                xAxis: this.defaultForecast[0].timeLine[0],
                                symbol: 'none',
                                label: {
                                    formatter: ''
                                },
                                lineStyle: {
                                    color: this.fcColor[index % 7],
                                },
                            }, {
                                name: '今',
                                xAxis: this.nowTime,
                                // symbol: 'none'
                                symbol: 'none',
                                label: {
                                    formatter: ''
                                },
                                lineStyle: {
                                    color: 'rgba(148,158,182,0.85)',
                                },
                            }]
                        },
                        markPoint: {
                            data: [{
                                name: '预',
                                coord: [this.defaultForecast[0].timeLine[0], Math.ceil(this.maxYValue)],
                                // symbol: 'none',
                                symbolSize: 20,
                                itemStyle: {
                                    color: '#fff',
                                },
                                value: '预测预',
                                label: {
                                    show: true,
                                    color: '#fff',
                                    formatter: '预',
                                    backgroundColor: this.fcColor[index % 7],
                                    padding: 4,
                                    borderRadius: 20,
                                }
                            }, {
                                name: '今',
                                coord: [this.nowTime, Math.ceil(this.maxYValue)],
                                // symbol: 'none',
                                symbolSize: 20,
                                itemStyle: {
                                    color: '#fff',
                                },
                                value: '预测今',
                                label: {
                                    show: true,
                                    color: '#fff',
                                    formatter: '今',
                                    backgroundColor: 'rgba(148,158,182,0.85)',
                                    padding: 4,
                                    borderRadius: 20,
                                }
                            }]
                        },
                    }]
            });
            this.echartsInstance_mf.setOption({
                series: [{
                    type: 'line',
                    name: this.defaultForecast[1].lineId,
                    markLine: {
                        type: 'dotted',
                        symbol: 'none',
                        data: [{
                            name: '真实',
                            xAxis: this.defaultForecast[0].timeLine[0],
                            // symbol: 'none'
                            symbol: 'none',
                            label: {
                                formatter: ''
                            },
                            lineStyle: {
                                color: this.mfColor[mf_echartIndex % 6],
                            },
                        }, {
                            name: '今',
                            xAxis: this.nowTime,
                            // symbol: 'none'
                            symbol: 'none',
                            label: {
                                formatter: ''
                            },
                            lineStyle: {
                                color: 'rgba(148,158,182,0.85)',
                            },
                        }]
                    },
                    markPoint: {
                        data: [{
                            name: '预',
                            coord: [this.defaultForecast[0].timeLine[0], this.maxMfYValue],
                            // symbol: 'none',
                            symbolSize: 20,
                            itemStyle: {
                                color: '#fff',
                            },
                            value: '需求真',
                            label: {
                                show: true,
                                color: '#fff',
                                formatter: '预',
                                backgroundColor: this.mfColor[mf_echartIndex % 6],
                                padding: 4,
                                borderRadius: 20,
                            }
                        }, {
                            name: '今',
                            coord: [this.nowTime, this.maxMfYValue],
                            // symbol: 'none',
                            symbolSize: 20,
                            itemStyle: {
                                color: '#fff',
                            },
                            value: '需求今',
                            label: {
                                show: true,
                                color: '#fff',
                                formatter: '今',
                                backgroundColor: 'rgba(148,158,182,0.85)',
                                padding: 4,
                                borderRadius: 20,
                            }
                        }]
                    },
                }]
            });
            this.clickFclegend(0, 0);
        }, 1);
        this.clickDefFc.emit({
            'color': this.fcColor[index % 7],
            'value': this.fcCheckBox[index].content,
            'id': id
        });

        this.fcLineOne_time.emit(this.fcStartTime);
        this.position_Index = index;
        this.positionNowFc(this.position_Index);
        this.fc_markPoint_time = this.defaultForecast[0].timeLine[0].slice(0, 7);

        // yang-----设置当前预测曲线时，修改指标数据
        // for (let i = 0; i < this.allData.length; i++) {
        // lenovoPublic.selfLog2(()=>console.log(this.allData[i].lineId, this.nowFcSeries, this.defaultForecast[0], this.nowFcSeries.id));
        // if (this.allData[i].lineId === this.nowFcSeries.id) {
        // lenovoPublic.selfLog2(()=>console.log(this.allData[i], this.nowFcSeries));
        // lenovoPublic.selfLog2(()=>console.log(this.allData[i]));
        this.updataSubjectService.emitDataIndexInfo(this.defaultForecast[0]);
        this.updataSubjectService.emitCurPredictionInfo(this.defaultForecast[0]);
        this.updataSubjectService.emitHistoryDataInfo({ type: 'nAverageMounth', data: this.defaultForecast[0] });

        // break;
        // }
        // }
        // yang-----设置当前预测曲线时，修改指标数据
        this.setTimeoutArr[2] = setTimeout(() => {
        }, 50);
        lenovoPublic.selfLog2(() => console.log(this.edit_allData, this.nowFcSeries, this.fcCheckBox));

        if (fcDef.save) { // 如果当前曲线已保存再调取接口
            // 调用记录默认预测曲线的接口记录该线
            this.forecastLineId = id;
            this.setForecastLine(this.forecastLineId);
        }
        this.setEchartsShowSymbol(true, id);
    }

    // 定位当前默认预测曲线框的位置
    // tslint:disable-next-line:member-ordering
    dataTimeX;
    // tslint:disable-next-line:member-ordering
    dataTimeY;
    // tslint:disable-next-line:member-ordering
    nowFcXZ;
    // tslint:disable-next-line:member-ordering
    nowFcYZ;
    // tslint:disable-next-line:member-ordering
    nowFcColor;
    positionNowFc(index) {
        clearTimeout(this.timeoutShowLine);
        this.timeoutShowLine = setTimeout(() => {
            const noNull = this.forecastOptions['series'][index].data.filter(a => a);
            let noNullIndex: any = -1;
            for (const [key, item] of Object.entries(this.forecastOptions['series'][index].data)) {
                if (item) {
                    noNullIndex = Number(key);
                    break;
                }
            }
            this.dataTimeX = this.timeXfc[noNullIndex];
            this.dataTimeY = noNull[0].value;
            this.nowFcXZ = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.dataTimeX);
            this.nowFcYZ = this.echartsInstance_fc.convertToPixel({ yAxisId: 'ForecastL' }, this.dataTimeY);
            this.nowFcColor = this.forecastOptions['series'][index].lineStyle.color;
            this.positionNow(this.nowFcXZ, this.nowFcYZ, this.nowFcColor);
            // console.log(index, this.nowFcXZ, this.nowFcYZ, this.nowFcColor, noNull, this.forecastOptions['series'], index);
            lenovoPublic.selfLog2(() => console.log(index, this.nowFcXZ, this.nowFcYZ, this.nowFcColor, this.forecastOptions['series']));
        }, 100);
    }

    public positionNow(X, Y, color) {
        const abc = this.fcCheckBox.length > 0 ? !this.fcCheckBox[this.position_Index].isShow : false;
        if (this.nowFcXZ < 0 || this.nowFcXZ > this.fcWidth || abc) {
            $('.nowFcLocation').css('display', 'none');
        } else if (this.edit_allData && this.edit_allData.some(x => x.lineType === 'keDiagramLineType_long_term_pred')) {
            $('.nowFcLocation').css({ 'display': 'block', 'left': X, 'top': Y - 38 + 'px', 'background': color });
        }
    }


    // 定位编辑中曲线框的位置
    positionNowBj(data) {
        // $('.nowBjLocation').show();
        clearTimeout(this.timeoutPositionNowBj);
        if (this.displayBox.edit) {
            const predLine = data.find(item => item.lineType === 'keDiagramLineType_long_term_pred');
            if (predLine.timeLine[0] < this.startNum || predLine.timeLine[0] > this.endNum) {
                $('.nowBjLocation').css('display', 'none');
            } else {
                this.displayBox.edit = true;
                this.timeoutPositionNowBj = setTimeout(() => {
                    const nowFcX = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, predLine.timeLine[0]);
                    const nowFcY = this.echartsInstance_fc.convertToPixel({ yAxisId: 'ForecastL' }, predLine.value[0]);
                    $('.nowBjLocation').css({ 'display': 'block', 'left': nowFcX, 'top': nowFcY - 38 + 'px' });
                }, 100);
            }
        }
    }


    // 下拉框选择默认预测曲线
    setFcContent(cont) {
        this.forecastLineId = cont.id;
        this.defForecastLine(cont.id);
    }

    clickmmm(event) {
        lenovoPublic.selfLog2(() => console.log(event));
    }
    // 图表的双击事件
    dbClickFc(event) {
        lenovoPublic.selfLog2(() => console.log(event, 'dgreggh'));
        if (event.seriesName.includes('在保量') || event.seriesName.includes('需求量') || event.seriesName.includes('需求率')) {
            return;
        }
        this.forecastLineId = event.seriesId;
        this.defForecastLine(event.seriesId);
    }

    public onChartClick(event) {
        alert(8989);
    }


    // 图表的滚轮事件
    dataZoomFc(event) {
        if (event.batch) {
            this.nowFcXZ = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.dataTimeX);
            this.nowFcYZ = this.echartsInstance_fc.convertToPixel({ yAxisId: 'ForecastL' }, this.dataTimeY);
            // 获取当前滚动的起始和结束时间
            const indexS = Math.round(event.batch[0].start / (100 / this.timeXfc.length));
            const indexE = Math.round(event.batch[0].end / (100 / this.timeXfc.length));
            // if (nn === 'mf') {
            //     // 重新定义起始和结束时间及下拉数据
            //     this.mfStartNum = this.timeXfc[indexS] ? this.timeXfc[indexS].slice(0, 7) : this.timeXfc[0].slice(0, 7);
            //     this.mfEndNum = this.timeXfc[indexE] ? this.timeXfc[indexE].slice(0, 7) : this.timeXfc[this.timeXfc.length - 1].slice(0, 7);
            lenovoPublic.selfLog2(() => console.log(this.nowFcXZ, this.nowFcYZ, indexS, indexE, this.timeXfc.length));
            lenovoPublic.selfLog2(() => console.log(typeof indexS, indexE, this.timeXfc.length));
            //     this.defTimeList(this.timeData, this.mfStartNum, this.mfEndNum, nn);
            // } else {
            // 重新定义起始和结束时间及下拉数据
            this.startNum = this.timeXfc[indexS] ? this.timeXfc[indexS].slice(0, 7) : this.timeXfc[0].slice(0, 7);
            this.endNum = this.timeXfc[indexE] ? this.timeXfc[indexE].slice(0, 7) : this.timeXfc[this.timeXfc.length - 1].slice(0, 7);
            this.defTimeList(this.timeData, this.startNum, this.endNum);
            this.echartsInstance_mf.dispatchAction({
                type: 'dataZoom',
                start: event.batch[0].start,
                end: event.batch[0].end,
            });
            this.echartsInstance_fc.dispatchAction({
                type: 'dataZoom',
                start: event.batch[0].start,
                end: event.batch[0].end,
            });

            // 计算X轴在滚动中的长度
            const xAxisLength = this.timeXfc.length - indexS - (this.timeXfc.length - indexE);

            this.echartsInstance_fc.setOption({
                xAxis: [{
                    id: 'Forecast',
                    axisLabel: {
                        interval: (index, value) => {
                            // lenovoPublic.selfLog2(()=>console.log(index, value, xAxisLength));
                            if (xAxisLength > 8) {
                                if (index % (Math.ceil(xAxisLength / 8)) !== 0) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                    }
                }]
            });
            this.echartsInstance_mf.setOption({
                xAxis: [{
                    id: 'malfunction',
                    axisLabel: {
                        interval: (index, value) => {
                            // lenovoPublic.selfLog2(()=>console.log(index, value, xAxisLength));
                            if (xAxisLength > 8) {
                                if (index % (Math.ceil(xAxisLength / 8)) !== 0) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                    }
                }]
            });

            this.positionNowBj(this.editDataLine);
            // }
        }
    }

    // MouseOver事件  显示markpoint的提示框
    onChartEventOver(event) {
        lenovoPublic.selfLog2(() => console.log(event, 'MouseOver'));
        if (event.componentType === 'markPoint' && event.data.value === '预测预') {
            this.markPoint_name = '预测';
            this.fc_markPoint_time = this.defaultForecast[0].timeLine[0].slice(0, 7);
            $('.fcMarkpoint').show();
            $('.fcMarkpoint').css({ 'top': -this.fcHeight + 36, 'left': event.event.offsetX - 110 });
        } else if (event.componentType === 'markPoint' && event.data.value === '预测今') {
            this.markPoint_name = '当前';
            this.fc_markPoint_time = this.todayTime;
            $('.fcMarkpoint').show();
            $('.fcMarkpoint').css({ 'top': -this.fcHeight + 36, 'left': event.event.offsetX - 110 });
        } else if (event.componentType === 'markPoint' && event.data.value === '需求真') {
            this.markPoint_name = '真实';
            this.fc_markPoint_time = this.defaultForecast[1].timeLine[0].slice(0, 7);
            $('.mfMarkpoint').show();
            $('.mfMarkpoint').css({ 'top': -this.fcHeight + 36, 'left': event.event.offsetX - 110 });
        } else if (event.componentType === 'markPoint' && event.data.value === '需求今') {
            this.markPoint_name = '当前';
            this.fc_markPoint_time = this.todayTime;
            $('.mfMarkpoint').show();
            $('.mfMarkpoint').css({ 'top': -this.fcHeight + 36, 'left': event.event.offsetX - 110 });
        }
    }

    // markpoint的提示框消失
    onChartEventOut(event) {
        lenovoPublic.selfLog2(() => console.log(event, 'out'));
        if (event) {
            $('.fcMarkpoint').hide();
            $('.mfMarkpoint').hide();
        }
    }


    ngOnDestroy(): void {
        this.predictionShow$.unsubscribe();
        console.log('ngOnDestroy');
        lenovoPublic.publicClearTimeout('all');
    }




    // 计算曲线的重新设置Y轴的最大值和ib的倍数
    againFcOption(ibNum, maxFcNum, maxMfNum) {
        // this.forecastOptions['title'].text = `在保量(/${ibNum})/需求量/预测`;
        this.forecastOptions['yAxis'][0].name = `在保量(/${ibNum})·需求量·预测`;
        this.forecastOptions['yAxis'][0].max = Math.ceil(maxFcNum);
        this.forecastOptions['yAxis'][0].interval = (Math.ceil(maxFcNum) - 0) / 5;
        this.forecastOptions['yAxis'][1].max = maxMfNum;
        this.forecastOptions['yAxis'][1].interval = (maxMfNum - 0) / 5;
        this.malfunctionOptions['yAxis'][0].max = maxMfNum;
        this.malfunctionOptions['yAxis'][0].interval = (maxMfNum - 0) / 5;
        lenovoPublic.selfLog2(() => console.log(this.forecastOptions, this.malfunctionOptions, '222222'));
    }


    /**
     *  this.forecastName_length 判断是第几根预测线
     * 点击编辑区域状态的 编辑按钮时执行操作
     * */
    setEditData(param) {
        this.isCalculate = false;
        this.editDataLine = this.defaultForecast;
        clearTimeout(this.timeoutShowLine);
        this.forecastNameList = 0;
        if (this.fcCheckBox.length > 3) {
            this.timeoutShowLine = setTimeout(() => {
                for (let i = 2; i < this.fcCheckBox.length - 1; i++) {
                    this.fcLegendClick(this.en, 'fc', !this.fcCheckBox[i].isShow, this.fcCheckBox[i].num, this.fcCheckBox[i].legendName);
                }
                for (let i = 0; i < this.mlCheckBox.length - 1; i++) {
                    this.fcLegendClick(this.en, 'mf', !this.mlCheckBox[i].isShow, this.mlCheckBox[i].num, this.mlCheckBox[i].legendName);
                }
            }, 100);
        }

        this.trimBj('编辑', false, false);
        this.forecastOptions = Object.assign({}, this.forecastOptions);
        this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        this.displayBox.edit = true;
        this.positionNowBj(this.editDataLine);
    }


    // 编辑状态下绘制两个图表
    trimBj(value, bol, ensure, oneIndex?, twoIndex?, name?, lines?, mfName?) {
        const fcIndex = this.fcCheckBox.length, mfIndex = this.mlCheckBox.length;
        if (value === '编辑') {
            this.forecastOptions['series'].push({
                id: '编辑中曲线',
                name: '编辑中曲线',
                type: 'line',
                smooth: true,
                // symbol: 'none',
                showSymbol: false, // 是否显示symbol
                hoverAnimation: false,
                lineStyle: {
                    type: 'dotted',
                    color: this.fcColor[fcIndex % 7],
                    width: 8,
                    opacity: 0.8,
                },
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: this.fcColor[fcIndex % 7] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.fcColor[fcIndex % 7] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: '编辑中曲线',
                            useLineType: this.defaultForecast[0].lineType,
                        },
                        borderColor: this.fcColor[fcIndex % 7],
                        borderWidth: 12
                    }
                },
                connectNulls: true,
                data: this.opt([], 0, this.defaultForecast)
            });
            this.malfunctionOptions['series'].push({
                id: `编辑中需求率`,
                name: `编辑中曲线`,
                type: 'line',
                smooth: true,
                // symbol: 'none',
                showSymbol: false, // 是否显示symbol
                hoverAnimation: false,
                lineStyle: {
                    type: 'dotted',
                    color: this.mfColor[mfIndex % 6],
                    width: 2,
                    opacity: 0.8,
                },
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: this.mfColor[mfIndex % 6] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.mfColor[mfIndex % 6] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: '编辑中需求率',
                            useLineType: this.defaultForecast[1].lineType,
                        },
                        borderColor: this.mfColor[mfIndex % 6],
                        borderWidth: 6
                    }
                },
                connectNulls: true,
                data: this.opt([], 1, this.defaultForecast)
            });
            // 设置控制线是否显示的数组
            this.fcCheckBox.push({
                content: '编辑中曲线',
                id: '编辑中曲线',
                isShow: true,
                color: this.fcColor[fcIndex % 7],
                num: this.fcCheckBox.length,
                save: bol,
                ensure: ensure,
                def: false,
                legendName: '编辑中曲线',
                lineCode: '编辑中曲线',
                lineType: this.defaultForecast[0].lineType
            });
            this.mlCheckBox.push({
                content: `编辑中需求率`,
                id: `编辑中需求率`,
                isShow: true,
                color: this.mfColor[mfIndex % 6],
                num: this.mlCheckBox.length,
                legendName: '编辑中曲线',
                lineCode: '编辑中曲线',
                lineType: this.defaultForecast[1].lineType
            });
        } else if (value === '计算') {
            this.forecastOptions['series'].push({
                // name: '故障',
                id: lines[oneIndex].lineId,
                name: lines[twoIndex].lineParmUnionCode,
                type: 'line',
                smooth: false,
                // symbol: 'none',
                showSymbol: false, // 是否显示symbol
                hoverAnimation: false,
                lineStyle: {
                    color: this.fcColor[fcIndex % 7],
                    width: 2,
                    opacity: 0.7,
                },
                itemStyle: { // 拐折点样式
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: this.fcColor[fcIndex % 7] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.fcColor[fcIndex % 7] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: name,
                            useLineType: lines[oneIndex].lineType,
                        },
                        borderColor: this.fcColor[fcIndex % 7],
                        borderWidth: 8
                    }
                },
                connectNulls: true,
                data: this.opt([], oneIndex, lines)
            });

            this.fcCheckBox.push({
                content: name,
                isShow: true,
                color: this.fcColor[fcIndex % 7],
                num: this.fcCheckBox.length,
                lineCode: lines[oneIndex].lineParmUnionCode,
                save: bol,
                id: lines[oneIndex].lineId,
                ensure: lines[oneIndex].bUsed,
                def: false,
                legendName: lines[oneIndex].lineParmUnionCode,
                lineType: lines[oneIndex].lineType,
            });

            this.malfunctionOptions['series'].push({
                // name: '故障',
                id: lines[twoIndex].lineId,
                name: lines[twoIndex].lineParmUnionCode,
                type: 'line',
                smooth: false,
                // symbol: 'none',
                showSymbol: false, // 是否显示symbol
                hoverAnimation: false,
                lineStyle: {
                    color: this.mfColor[mfIndex % 6],
                    width: 2,
                    opacity: 0.7,
                },
                itemStyle: { // 拐折点样式
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: this.mfColor[mfIndex % 6] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.mfColor[mfIndex % 6] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: `${name}需求率`,
                            useLineType: lines[twoIndex].lineType,
                        },
                        borderColor: this.mfColor[mfIndex % 6],
                        borderWidth: 8
                    }
                },
                connectNulls: true,
                data: this.opt([], twoIndex, lines)
            });
            this.mlCheckBox.push({
                content: `${name}需求率`,
                isShow: true,
                color: this.mfColor[mfIndex % 6],
                num: this.mlCheckBox.length,
                lineCode: lines[twoIndex].lineParmUnionCode,
                id: lines[twoIndex].bUsed,
                legendName: lines[twoIndex].lineParmUnionCode,
                lineType: lines[twoIndex].lineType,
            });
        } else if (value === '保存') {
            this.forecastOptions['series'].push({
                // name: '故障',
                id: lines[oneIndex].lineId,
                name: lines[oneIndex].lineParmUnionCode,
                type: 'line',
                smooth: false,
                // symbol: 'none',
                showSymbol: false, // 是否显示symbol
                hoverAnimation: false,
                lineStyle: {
                    color: this.fcColor[fcIndex % 7],
                    width: 2,
                    opacity: 0.7,
                },
                itemStyle: { // 拐折点样式
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: this.fcColor[fcIndex % 7] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.fcColor[fcIndex % 7] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: name,
                            useLineType: lines[oneIndex].lineType,
                        },
                        borderColor: this.fcColor[fcIndex % 7],
                        borderWidth: 8
                    }
                },
                connectNulls: true,
                data: this.opt([], oneIndex, lines)
            });
            this.fcCheckBox.push({
                content: name,
                isShow: true,
                color: this.fcColor[fcIndex % 7],
                num: this.fcCheckBox.length,
                lineCode: lines[oneIndex].lineParmUnionCode,
                save: bol,
                id: lines[oneIndex].lineId,
                ensure: lines[oneIndex].bUsed,
                def: false,
                legendName: lines[oneIndex].lineParmUnionCode,
                lineType: lines[oneIndex].lineType,
            });

            this.malfunctionOptions['series'].push({
                // name: '故障',
                id: lines[twoIndex].lineId,
                name: lines[twoIndex].lineParmUnionCode,
                type: 'line',
                smooth: false,
                // symbol: 'none',
                showSymbol: false, // 是否显示symbol
                hoverAnimation: false,
                lineStyle: {
                    color: this.mfColor[mfIndex % 6],
                    width: 2,
                    opacity: 0.7,
                },
                itemStyle: { // 拐折点样式
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: this.mfColor[mfIndex % 6] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.mfColor[mfIndex % 6] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: mfName,
                            useLineType: lines[twoIndex].lineType,
                        },
                        borderColor: this.mfColor[mfIndex % 6],
                        borderWidth: 8
                    }
                },
                connectNulls: true,
                data: this.opt([], twoIndex, lines)
            });
            this.mlCheckBox.push({
                content: mfName,
                isShow: true,
                color: this.mfColor[mfIndex % 6],
                num: this.mlCheckBox.length,
                lineCode: lines[twoIndex].lineParmUnionCode,
                id: lines[twoIndex].lineId,
                legendName: lines[twoIndex].lineParmUnionCode,
                lineType: lines[twoIndex].lineType,
            });
        }
    }

    /**
     *  this.forecastNameList 判断是当前pn下第几次点击计算
     *  this.edit_allData 记录所有曲线（包含计算时的曲线）
     * 点击编辑区域状态的 计算按钮时执行操作
     * */
    editCalculate(param) {
        console.log(param, '计算');
        lenovoPublic.selfLog2(() => console.log(param, '计算'));
        this.editDataLine = param.data.diagramLines;
        let lineOne = -1, lineTwo = -1;
        param.data.diagramLines.find((item, index) => {
            if (item.lineType === 'keDiagramLineType_long_term_pred') {
                lineOne = index;
            } else if (item.lineType === 'keDiagramLineType_ra') {
                lineTwo = index;
            }
        });

        // for (const item of param.data.diagramLines) {
        //     this.allLinesData[0].push(item);
        // }
        // 判断是否有相同曲线
        for (const item of this.edit_allData) {
            if (lineOne > 0 && param.data.diagramLines[lineOne].lineParmUnionCode === item.lineParmUnionCode) {
                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: `已有相同曲线`,
                        style: {}
                    }]
                }, 'alert');
                // alert('已有相同曲线');
                return;
            }
        }
        const bjline = this.fcCheckBox.some((item) => {
            return item.content === '编辑中曲线';
        });


        // 如果没有相同曲线 则绘制图表
        for (const item of param.data.diagramLines) {
            this.edit_allData.push(item);
            if (item.lineType === 'keDiagramLineType_long_term_pred') {
                this.fcLinsData.push(item);
            } else if (item.lineType === 'keDiagramLineType_ra') {
                this.mfLinsData.push(item);
            } else if (item.lineType === 'keDiagramLineType_ib') {
                this.ibAllLines.push(item);
            }
        }

        // // 重新计算Y的最大值 和 this.num
        // this.setMaxY(this.edit_allData);
        // this.setMfMaxY(this.edit_allData);
        // this.againFcOption(this.num, this.maxYValue, this.maxMfYValue);

        this.forecastNameList++;

        if (bjline) {
            this.forecastName_length = this.fcCheckBox.length - 3; // 保证预测名称不重复
            [this.fcCheckBox[this.fcCheckBox.length - 1].content, this.fcCheckBox[this.fcCheckBox.length - 1].id, this.fcCheckBox[this.fcCheckBox.length - 1].lineCode, this.fcCheckBox[this.fcCheckBox.length - 1].legendName] = [`预测${this.forecastName_length}`, param.data.diagramLines[lineOne].lineId, param.data.diagramLines[lineOne].lineParmUnionCode, param.data.diagramLines[lineOne].lineParmUnionCode];
            [this.mlCheckBox[this.mlCheckBox.length - 1].content, this.mlCheckBox[this.mlCheckBox.length - 1].id, this.mlCheckBox[this.mlCheckBox.length - 1].lineCode, this.mlCheckBox[this.mlCheckBox.length - 1].legendName] = [`预测${this.forecastName_length}需求率`, param.data.diagramLines[lineTwo].lineId, param.data.diagramLines[lineTwo].lineParmUnionCode, param.data.diagramLines[lineTwo].lineParmUnionCode];
            // 点击计算时预测变为实线，同时改变名称
            this.setLineOption(this.forecastOptions['series'][this.fcCheckBox.length - 1], `预测${this.forecastName_length}`, param.data.diagramLines[lineOne].lineId, param.data.diagramLines[lineOne].lineParmUnionCode, param.data.diagramLines, lineOne);
            this.setLineOption(this.malfunctionOptions['series'][this.mlCheckBox.length - 1], `预测${this.forecastName_length}需求率`, param.data.diagramLines[lineTwo].lineId, param.data.diagramLines[lineTwo].lineParmUnionCode, param.data.diagramLines, lineTwo);
        } else {
            this.forecastName_length = this.fcCheckBox.length - 2;
            this.trimBj('计算', false, param.data.diagramLines[lineOne].bUsed, lineOne, lineTwo, `预测${this.forecastName_length}`, param.data.diagramLines);
        }
        lenovoPublic.selfLog2(() => console.log(this.fcCheckBox, this.mlCheckBox, this.forecastNameList, '计算2', this.forecastOptions, this.forecastOptions['series'], this.allData));
        this.placehole_name = `预测${this.forecastName_length + 1}`;
        this.selectList.push({
            'color': this.fcColor[(this.fcCheckBox.length - 1) % 7],
            value: `预测${this.forecastName_length}`,
            id: param.data.diagramLines[lineOne].lineId
        });
        this.default_forecastName.emit(this.selectList); // 发送下拉列表数据
        this.fcStartTime = param.data.diagramLines[lineOne].forcastParams;

        this.fcLineOne_time.emit(this.fcStartTime); // 发送算法参数数据
        // 编辑预测线起名时添加数字区分多条预测线
        // this.forecastOptions = Object.assign({}, this.forecastOptions);
        // this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        this.positionNowBj(this.editDataLine);
        $('.conChart').show();
        this.defForecastLine(param.data.diagramLines[lineOne].lineId); // 设置默认预测曲线
    }

    // 点击编辑区域状态的 保存按钮时执行操作
    editSaveLines(param) {
        clearTimeout(this.timeoutShowLine);
        console.log(param, '保存时', this.allData, this.forecastOptions['series'], this.malfunctionOptions['series']);
        this.editDataLine = param.lines;
        lenovoPublic.selfLog2(() => console.log(param, '保存时', this.allData, this.forecastOptions['series'], this.malfunctionOptions['series']));
        let lineOne = -1, lineTwo = -1;
        param.lines.find((item, index) => {
            if (item.lineType === 'keDiagramLineType_long_term_pred') {
                lineOne = index;
            } else if (item.lineType === 'keDiagramLineType_ra') {
                lineTwo = index;
            }
        });
        const lineFind = this.edit_allData.find((items) => items.lineId === param.lines[lineOne].lineId);
        const series_one = this.forecastOptions['series'].find((k) => k.id === param.lines[lineOne].lineId);
        const series_two = this.malfunctionOptions['series'].find((j) => j.id === param.lines[lineTwo].lineId);
        const fc_one = this.fcCheckBox.find((q) => q.id === param.lines[lineOne].lineId);
        const mf_one = this.mlCheckBox.find((p) => p.id === param.lines[lineTwo].lineId);
        lenovoPublic.selfLog2(() => console.log(lineFind, series_one, series_two, fc_one, mf_one));
        // console.log(lineFind, series_one, series_two, fc_one, mf_one);
        // console.log(this.edit_allData, this.forecastOptions['series'], this.malfunctionOptions['series'], this.fcCheckBox, this.mlCheckBox);

        const bjline = this.fcCheckBox.some((item) => {
            return item.content === '编辑中曲线';
        });

        if (bjline) {
            this.forecastOptions['series'].splice(this.forecastOptions['series'].length - 1, 1);
            this.fcCheckBox.splice(this.fcCheckBox.length - 1, 1);
            // 需求率
            this.malfunctionOptions['series'].splice(this.malfunctionOptions['series'].length - 1, 1);
            this.mlCheckBox.splice(this.mlCheckBox.length - 1, 1);
        }

        if (lineFind && this.isCalculate) {
            // 只保存
            [fc_one.content, fc_one.save, fc_one.ensure, fc_one.legendName] = [param.lines[lineOne].name, true, param.isRecordLtbTime, param.lines[lineOne].lineParmUnionCode];
            [mf_one.content, mf_one.legendName] = [param.lines[lineTwo].name, param.lines[lineTwo].lineParmUnionCode];
            series_one.itemStyle.normal.color.onlyName = param.lines[lineOne].name;
            series_two.itemStyle.normal.color.onlyName = param.lines[lineTwo].name;
            let fc_index = -1;
            for (const [key, item] of Object.entries(this.fcCheckBox)) {
                if (fc_one.id === item['id']) {
                    fc_index = Number(key);
                }
            }
            // 判断发送的下拉列表数据中是否有该数据
            const selectId = this.selectList.find((item) => item.id === param.lines[lineOne].lineId);
            if (selectId) {
                selectId.value = param.lines[lineOne].name;
            } else {
                this.selectList.push({
                    'color': this.fcColor[fc_index % 7],
                    value: param.lines[lineOne].name,
                    id: param.lines[lineOne].lineId
                });
            }
            // this.positionNowFc(fc_index);
        } else if (lineFind) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: `已有相同曲线`,
                    style: {}
                }]
            }, 'alert');
            this.defForecastLine(this.forecastLineId); // 设置默认预测曲线
            // alert('已有相同曲线');
            return;
        } else {
            this.forecastName_length = this.fcCheckBox.length - 2;
            // 计算并保存
            this.defaultForecast[0] = param.lines[lineOne]; // 保存当前默认预测线的数据
            this.defaultForecast[1] = param.lines[lineTwo]; // 保存当前默认预测线的数据

            for (const item of param.lines) {
                // 把所的线保存在一个数组中
                this.edit_allData.push(item);
                if (item.lineType === 'keDiagramLineType_long_term_pred') {
                    this.fcLinsData.push(item);
                } else if (item.lineType === 'keDiagramLineType_ra') {
                    this.mfLinsData.push(item);
                } else if (item.lineType === 'keDiagramLineType_ib') {
                    this.ibAllLines.push(item);
                }
            }
            // // 重新计算Y的最大值 和 this.num
            // this.setMaxY(this.fcLinsData);
            // this.setMfMaxY(this.mfLinsData);
            // this.againFcOption(this.num, this.maxYValue, this.maxMfYValue);

            this.mfDataArr.push(this.opt([], 1, param.lines));
            // 发送默认预测曲线的名称和颜色
            this.selectList.push({
                'color': this.fcColor[(this.fcCheckBox.length - 1) % 7],
                value: param.lines[lineOne].name,
                id: param.lines[lineOne].lineId
            });
            this.forecastNameList++;
            this.trimBj('保存', true, param.isRecordLtbTime, lineOne, lineTwo, param.lines[lineOne].name, param.lines, param.lines[lineTwo].name);
        }

        this.placehole_name = `预测${this.forecastName_length + 1}`;

        // 确认使用
        if (param.isRecordLtbTime) {
            const obj = {};
            for (const item of this.edit_allData) {
                if (param.lines[lineOne].lineId === item.lineId) {
                    this.last_time_buy = item.timeLine[0];
                    obj['bUsed'] = true;
                    obj['lineType'] = 'keDiagramLineType_long_term_pred';
                    obj['timeLine'] = item.timeLine;
                    this.lastTimeBuyBUsed.push(obj);
                }
            }

            this.updataEnsure(param.lines[lineOne].lineId);
        }

        this.defaultForecast = param.lines;
        this.fcStartTime = param.lines[lineOne].forcastParams;

        this.fcLineOne_time.emit(this.fcStartTime); // 发送算法参数数据
        this.default_forecastName.emit(this.selectList);
        // this.forecastOptions = Object.assign({}, this.forecastOptions);
        // this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        this.timeoutShowLine = setTimeout(() => {
            // $('.nowBjLocation').hide();
            this.displayBox.edit = false;
            this.forecastLineId = param.lines[lineOne].lineId;
            this.defForecastLine(this.forecastLineId); // 设置默认预测曲线
        }, 100);
        lenovoPublic.selfLog2(() => console.log(param));
    }

    // 设置新增预测线的配置
    setLineOption(dataObj, name, id, lineCode, data, index) {
        dataObj.type = 'line';
        dataObj.id = id;
        dataObj.name = lineCode;
        dataObj.itemStyle.normal.color.onlyName = name;
        dataObj.data = this.opt([], index, data);
        dataObj.lineStyle.type = 'solid';
    }

    // 取消编辑事件
    cacelEdit(param) {
        // $('.nowBjLocation').hide();
        this.displayBox.edit = false;

        const isBjLine = this.forecastOptions['series'].find((item) => item.id && item.id.includes('编辑中曲线'));
        lenovoPublic.selfLog2(() => console.log(this.forecastOptions['series'], isBjLine));
        if (!isBjLine) {
            // 如果没有编辑中曲线的名称，则不删除曲线
            return;
        }
        // 预测线
        if (this.nowFcSeries) {
            this.nowFcSeries.lineStyle.width = 6;
        }
        this.forecastOptions['series'].splice(this.forecastOptions['series'].length - 1, 1);
        this.fcCheckBox.splice(this.fcCheckBox.length - 1, 1);
        // this.forecastOptions = Object.assign({}, this.forecastOptions);
        // 需求率
        this.malfunctionOptions['series'].splice(this.malfunctionOptions['series'].length - 1, 1);
        this.mlCheckBox.splice(this.mlCheckBox.length - 1, 1);
        // this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        this.defForecastLine(this.forecastLineId); // 设置默认预测曲线
    }

    // 曲线超过10根弹窗提醒
    linesTen() {
        if (this.fcCheckBox.length > 10) {
            this.onOff.showExceedTenLine = true;
        }
    }

    // 超过10根弹窗消失
    useIsYes() {
        this.onOff.showExceedTenLine = false;
    }


    // 鼠标划入历史数据时进行操作
    public hightLightDiagram() {
        lenovoPublic.selfLog2(() => console.log('鼠标划入历史数据时进行操作', 123333333));
    }

    // 鼠标划过'在保平稳时间'时把时间传给图表区，显示背景区域
    setFcBgTime(time) {
        this.echartsInstance_fc.setOption({
            series: [{
                type: 'line',
                name: '在保量',
                markArea: {
                    itemStyle: {
                        normal: {
                            color: 'rgba(148,158,182,0.36)'
                        }
                    },
                    data: [
                        [{
                            xAxis: time[0],
                        }, {
                            xAxis: time[1],
                        }]
                    ],
                },
            }]
        });
    }

    // 向diagramParameter发送数据
    private setShowDataToDiagramParameter({ type, data, isPush }) {
        this.setShowDataToDiagramParameterEmit.emit({ type, data, isPush });
    }

    // 接收parameter 发送过来的数据
    private getDiagramData(param) {
        const [type, data, isPush] = [param.type, param.data, param.isPush];
        if (isPush && type === 'updateSaveLinesPlaceHolder') {
            this.setShowDataToDiagramParameter({ type: 'updateSaveLinesPlaceHolder', data: this.placehole_name, isPush: false });
            return;
        } else if (type === 'getParamterParamToClickCompleteEvent') {
            this.getParamterParam = param.data;
        }

        lenovoPublic.selfLog2(() => console.log(param));
    }












    /**
     * @param isScaleBig 是否是放大图表区域
     */
    public scaleBigChart(isScaleBig) {

        this.dataManageService.setScaleChart(this.curAIOrHumanOrSingle, isScaleBig);
        this.chartAreaIsScale = this.dataManageService.getScaleChart(this.curAIOrHumanOrSingle);

        lenovoPublic.setCss(document.querySelector('.detail-parameter>.left'), { display: ['block', 'none'][+this.chartAreaIsScale] });
        lenovoPublic.selfLog2(x => console.log(this.chartAreaIsScale));
    }

    /**
    * 设置隐藏或显示showSymbol
    * @param isShow 是否显示symbol
    */
    private setEchartsShowSymbol(isShow, id?) {
        // 如果图表当前正在编辑状态
        if (!this.isCurEditIng) {
            console.log('当前不在编辑状态');
            return;
        }

        let lineParmUnionCode = '', defRaLineId = ''; // 线标识；默认预测曲线ra线的id
        if (isShow) {
            lineParmUnionCode = this.edit_allData.find(x => x.lineId === id).lineParmUnionCode;
            defRaLineId = this.edit_allData.find(x => x.lineParmUnionCode === lineParmUnionCode && x.lineId !== id && x.lineType === 'keDiagramLineType_ra').lineId;
        }

        console.log(id, defRaLineId);
        setTimeout(() => {
            const arr = ['echartsInstance_mf', 'echartsInstance_fc'];
            ['malfunctionOptions', 'forecastOptions'].map((m, mIndex) => {
                this[m]['series'].map((x) => {
                    this[arr[mIndex]].setOption({
                        series: [{
                            id: x.id,
                            name: x.name,
                            type: 'line',
                            showSymbol: isShow && defRaLineId === x.id ? true : false,
                            showAllSymbol: isShow && defRaLineId === x.id ? true : false,
                            symbol: isShow && defRaLineId === x.id ? 'emptyCircle' : 'none',
                        }]
                    });
                });
                console.log(this[m]['series']);
            });
            console.log(isShow, defRaLineId);
        }, 50);

    }

    // 点击修正图表操作-----仅限于人工预测中存在
    public amendChart() {
        this.isCurEditIng = true;
        this.setEchartsShowSymbol(true, this.forecastLineId);
    }
    // 修正图表的取消编辑
    public amendChartCancelEdit() {
        this.setEchartsShowSymbol(false);
        this.isCurEditIng = false;
        this.curDragSeriesInfo = {};
        console.log(this.isCurEditIng);
    }

    // tslint:disable-next-line:member-ordering
    getParamterParam = {
        demandRatesList: [], // 存放缩放因子的数组
        // 存放需求率等参数
        singlePredictionParam: {
            customAi: null, // 自定义月需求率
            aiInwarrantyRate: '-', // 延保率
            ai: '-', // 月需求率
            standardWarrantyPeriod: null // 标准保修期
        },
        last_time_buy: '',
        curAIOrHumanOrSingle: '' // 当前是AI预测还是人工预测

    }; // 获取到图表参数编辑区域的参数


    // 修正图表的编辑完成
    public amendChartEditComplete() {
        const vm = this;
        this.setEchartsShowSymbol(false);
        this.isCurEditIng = false;
        const id = vm.curDragSeriesInfo['seriesId'];
        console.log(id);

        if (id) {
            //  从参数区域组件获取参数区域数据-----------start
            this.setShowDataToDiagramParameterEmit.emit({ type: 'getParamterParamToClickCompleteEvent', data: 'getData', isPush: true });

            const scaleFactors = [];
            this.getParamterParam['demandRatesList'].map(x => {
                scaleFactors.push({
                    scaleFactor: x.scale,
                    beginTime: x.startBar.curTime,
                    endTime: x.endBar.curTime
                });
            });

            const standerWarrantyLength: string = this.getParamterParam.singlePredictionParam.standardWarrantyPeriod;
            const flRaByMounth: string | number = this.getParamterParam.singlePredictionParam.ai;
            const flWarranty: string | number = this.getParamterParam.singlePredictionParam.aiInwarrantyRate;
            const last_time_buy: string = this.getParamterParam.last_time_buy;
            const customAi = this.getParamterParam.singlePredictionParam.customAi;
            //  从参数区域组件获取参数区域数据-----------end

            this.amendChartEditPause(null);

            const timeLine = this.edit_allData.find(x => x.lineId === id).timeLine;
            const data = this.malfunctionOptions['series'].find(x => x.id === id).data;

            const oData = new FormData();
            const param = {};
            const value = [];

            this.timeXfc.map((m, mIndex) => {
                const timeM = m.slice(0, 7);
                timeLine.map(x => {
                    const timeX = x.slice(0, 7);
                    if (timeM === timeX) {
                        value.push(typeof data[mIndex] === 'string' ? String(Number(data[mIndex]) / 100) : String(Number(data[mIndex].value) / 100));
                    }
                });
            });

            param['groupUnionCode'] = this.edit_allData[0].groupUnionCode;
            param['lineId'] = vm.curDragSeriesInfo['seriesId'];
            param['forcastParams'] = {
                last_time_buy,
                flRaByMounth: flRaByMounth ? flRaByMounth : '0',
                flWarranty: flWarranty ? flWarranty : '0.05',
                raByYear: customAi || '1',
                calculateType: 'keCalculateType_Artifical_HistoryAverageRa',
                standerWarrantyLength: standerWarrantyLength || '',
                scaleFactors: scaleFactors
            };
            param['date'] = timeLine;
            param['value'] = value;

            oData.append('projectRequestParam', JSON.stringify(param));
            vm.getJsonService.modifyRaByLineId(oData, (res) => {
                lenovoPublic.isShowGetJsonLoading.call(vm);
                if (res.data) {
                    // res.data.diagramLines.map((iten) => {
                    //     if (iten.lineType === 'keDiagramLineType_Custom_Upload_Ra') {
                    //         this.mfLinsData.push(iten);

                    //     }
                    // });
                    this.setRaLine(res.data.diagramLines);
                }
                // this.mfLinsData.push();
                // this.setMfSeries();
            }, (err) => {
                lenovoPublic.isShowGetJsonLoading.call(vm);
                lenovoPublic.selfLog2(() => console.log(err));
            });
        }
        vm.curDragSeriesInfo = {};

    }


    // 添加修正需求率的曲线
    setRaLine(lines) {
        lines.map(((item) => {
            // 修正需求率
            if (item.lineType === 'keDiagramLineType_Custom_Upload_Ra') {
                this.setUseIbLine(item, 'keDiagramLineType_Custom_Upload_Ra', this.mfLinsData, this.mlCheckBox, this.malfunctionOptions, 'mf');
            } else {
                // 修正预测
                this.setUseIbLine(item, 'keDiagramLineType_Custom_Define_Pred', this.fcLinsData, this.fcCheckBox, this.forecastOptions, 'fc');
            }
        }));

        // const raLine = this.mfLinsData.filter((item) => {
        //     return item.lineType === 'keDiagramLineType_Custom_Upload_Ra';
        // });
        // const forecastLine = this.fcLinsData.filter((item) => {
        //     return item.lineType === 'keDiagramLineType_Custom_Define_Pred';
        // });

        // if (raLine.length > 1) {

        // } else {
        //     lines.map(((item) => {
        //         if (item.lineType === 'keDiagramLineType_Custom_Upload_Ra') {
        //             this.mfLinsData.push(item);
        //         }
        //     }));
        //     const index = this.mfLinsData.length - 1;
        //     const data = this.mfLinsData[index];
        //     this.setMfSeries(data.lineId, data.lineParmUnionCode, data.lineId, data.name, index, this.mfLinsData);
        //     this.defForecastLine(this.forecastLineId);
        // }

        // console.log(raLine, forecastLine);


        // this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        // this.forecastOptions = Object.assign({}, this.forecastOptions);
    }

    /**
     * 修正图表的编辑暂停
     * @param showBox 对于是否显示在保量框还是需求率框还是都不显示或者都显示
     */
    public amendChartEditPause(showBox) {
        this.recordInputData = {
            installBase: [
                {
                    id: String(Math.random()),
                    type: 'reason',
                    value: '',

                }, {
                    id: String(Math.random()),
                    type: 'method',
                    value: '',
                }
            ],
            demandRates: [
                {
                    id: String(Math.random()),
                    type: 'reason',
                    value: '',
                },
                {
                    id: String(Math.random()),
                    type: 'method',
                    value: '',
                },
            ]
        };
        this.isPausIng = true; // 当前处于暂停中
        if (this.curDragSeriesInfo['seriesId']) {
            this.isShowRecordBox = 'demandRates'; // 点击暂停时显示记录框记录修正原因
        }
        if (showBox) {
            this.isShowRecordBox = showBox; // 点击暂停时显示记录框记录修正原因
        }
    }

    /**
     * 编辑在保量
     * @param item 当前项
     */
    public editInEnsuring(item) {
        console.log(this.edit_allData);
        const groupUnionCode = this.edit_allData.find(x => x.lineType === 'keDiagramLineType_ib').groupUnionCode;
        lenovoPublic.isShowGetJsonLoading.call(this, true);
        this.getJsonService.dataExport(groupUnionCode, (data) => {
            lenovoPublic.isShowGetJsonLoading.call(this);
            const elink = document.createElement('a');
            elink.download = `人工预测IB数据.xls`;
            elink.style.display = 'none';
            const blob = new Blob([data]);
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
            this.isShowUploadComponent = true;
        }, (err) => {
            lenovoPublic.isShowGetJsonLoading.call(this);
            lenovoPublic.selfLog2(() => console.log(err));
        });
        // console.log(item);
    }

    // 上传修正在保量文件后成功的回调函数
    private uploadExcelSuccess() {
        console.log(this);

        lenovoPublic.publicSetTimeout('showChangeIbLineComplete', 800, () => {
            lenovoPublic.setCss(document.querySelector('#changeIbLineComplete'), { display: 'block' }); // 显示在保量修正完成弹框
        });
        lenovoPublic.publicSetTimeout('showChangeReasonPop', 2500, () => {
            this.amendChartEditPause('installBase');
        });
    }


    /**
     * 文件上传drop事件
     * @param param 上传文件的文件详情信息，以及回调函数
     */
    public dropedEvent(param) {
        this.fileList = param[0];
        const callback = param[1];
        this.uploadExcel(this, callback);
    }


    /**
     * 上传文件事件
     * @param vm this指针
     * @param callback 回调函数，用于取消掉上传完成后上传弹出框的样式，因为此处上传完成后直接关闭了，无需调用
     */
    public uploadExcel(vm, callback) {
        const oData = new FormData();
        const groupUnionCode = vm.edit_allData[0].groupUnionCode;
        oData.append('multipartFile', vm.fileList[0]);
        oData.append('groupUnionCode', groupUnionCode);
        vm.getJsonService.uploadCustomModifyWarranty(oData, (res) => {
            console.log(res);
            console.log(res.returnCode);
            if (String(res.returnCode) === '401') {
                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: res.data,
                        style: {}
                    }]
                }, 'alert');
                console.log(callback());
                // tslint:disable-next-line:no-unused-expression
                callback && callback();
                return;
            }
            this.setUseIbLine(res.data, 'keDiagramLineType_Custom_Upload_Warranty', this.fcLinsData, this.fcCheckBox, this.forecastOptions, 'fc');
            // tslint:disable-next-line:no-unused-expression
            // callback && callback(); // 添加上传文件后的回调，后台会返回一根修正在保量的线，进行绘制
            vm.closeDragUpload(); // 关闭组件
            lenovoPublic.isShowGetJsonLoading.call(vm);
            lenovoPublic.publicSetTimeout('timeoutUploadExcelSuccess01', 10, () => {
                vm.uploadExcelSuccess(); // 上传修正在保量文件后成功的回调函数
            });
        }, (err) => {
            lenovoPublic.isShowGetJsonLoading.call(vm);
            lenovoPublic.selfLog2(() => console.log(err));
        });
    }

    /**
     * 添加修正在保量的曲线
     * ibLine：接口中返回的数据
     * lineTye：lineType类型
     * linsData：fc或者mf所有的曲线
     * checkbox:fc或者mf的右侧选择框
     * option:图表的options
     * type:是哪个图表重绘fc 或 mf
     */

    setUseIbLine(ibLine, lineTye, linsData, checkbox, option, type) {
        const lineTy = lineTye;
        const ibArr = linsData.filter((item) => {
            return item.lineType === lineTy;
        });
        let index = -1, data: any = '';

        if (ibArr.length > 0) {
            linsData.map((item, kindex) => {
                if (item.lineType === lineTy) {
                    linsData[kindex] = ibLine;
                    index = kindex;
                    data = linsData[kindex];
                }
            });
            checkbox.map((item, kindex) => {
                if (item.lineType === lineTy) {
                    checkbox.splice(kindex, 1);
                    return;
                }
            });
            option['series'].map((item, kindex) => {
                if (item.itemStyle.normal.color.useLineType === lineTy) {
                    option['series'].splice(kindex, 1);
                    return;
                }
            });
        } else {
            linsData.push(ibLine);
            index = linsData.length - 1;
            data = linsData[index];
        }
        if (type === 'fc') {
            // this.setMaxY(linsData);
            this.setFcSeries(data.lineId, data.lineParmUnionCode, data.lineId, data.bused, data.name, index, linsData);
        } else {
            // this.setMfMaxY(linsData);
            this.setMfSeries(data.lineId, data.lineParmUnionCode, data.lineId, data.name, index, this.mfLinsData);
        }
        this.forecastOptions['series'] = this.fcSeries;
        // this.againFcOption(this.num, this.maxYValue, this.maxMfYValue);
        this.defForecastLine(this.forecastLineId);
        // console.log(ibLine, lineTye, linsData, checkbox, option, type);
        // console.log(ibArr, this.fcLinsData, this.mfLinsData, index, data, this.forecastOptions);
        // this.forecastOptions = Object.assign({}, this.forecastOptions);
    }



    // 关闭拖拽上传组件
    public closeDragUpload() {
        this.isShowUploadComponent = false;
    }


    // 记录修正原因中的输入框focus事件
    public recordIptFocus(event) {
        // 添加延时器防止点击触发focus之后触发blur
        lenovoPublic.publicSetTimeout('olListDelayedFocus', 15, () => {
            event.target.placeholder = '';
            lenovoPublic.setCss(document.querySelector('.record-table-parent .tips'), { visibility: 'hidden' });
            lenovoPublic.setCss(event.target.parentElement.querySelector('.ol-list'), { display: 'block' });
        });
    }
    // 记录修正原因中的输入框Blur事件
    public recordIptBlur(event) {
        // 添加延时器防止点击选填内容事件不会触发，先触发blur就不会执行ol的点击事件了
        lenovoPublic.publicSetTimeout('olListDelayedBlur', 10, () => {
            const oldPlaceHoleder = event.target.getAttribute('placeholderOld');
            event.target.placeholder = oldPlaceHoleder;
            lenovoPublic.setCss(Array.from(document.querySelectorAll('.record-table-parent .ol-list')), { display: 'none' });
        });
    }

    // 点击添加选填的内容进行选择
    public getRecordContent(event) {
        const parentLi = lenovoPublic.getParentEle(event.target, 'li');
        const content = lenovoPublic.trim(event.target.innerHTML, 1);
        const ratesOrBase = parentLi.getAttribute('ratesOrBase');
        const dataId = parentLi.getAttribute('dataId');
        this.recordInputData[ratesOrBase].find(x => x.id === dataId).value = content;
        console.log(this.recordInputData);
    }
    // 记录修正信息的取消操作
    public cancelRecord() {
        this.isPausIng = false;
        this.isShowRecordBox = false; // 点击暂停时显示记录框记录修正原因
    }
    // 记录修正信息的完成操作
    public completeRecord() {
        const iptAll = Array.from(document.querySelector('.record-table-parent').querySelectorAll('input[type=text]'));
        console.log(iptAll.find(x => {
            console.log(x['value']);
            return !x['value'];
        }));
        if (iptAll.find(x => !x['value'])) {
            lenovoPublic.setCss(document.querySelector('.record-table-parent .tips'), { visibility: 'visible' });
            return;
        }

        const param = [];
        const oData = new FormData();

        if (this.isShowRecordBox === 'installBase') {
            const obj = {
                reason: [],
                method: [],
                lineType: 'keDiagramLineType_Inwarranty'
            };
            this.recordInputData['installBase'].map(x => {
                obj[x.type].push(x.value);
            });

            const ibLineId = this.edit_allData.find(x => x.lineType === 'keDiagramLineType_ib').lineId;
            oData.append('lineId', ibLineId);
            oData.append('modifyList', JSON.stringify(param));
        }
        if (this.isShowRecordBox === 'demandRates') {
            const obj = {
                reason: [],
                method: [],
                lineType: 'keDiagramLineType_DemandCount'
            };
            this.recordInputData['demandRates'].map(x => {
                obj[x.type].push(x.value);
            });
        }

        if (this.isShowRecordBox === 'all') {
            const obj = {
                reason: [],
                method: [],
                lineType: 'keDiagramLineType_Inwarranty'
            };
            const obj2 = {
                reason: [],
                method: [],
                lineType: 'keDiagramLineType_DemandCount'
            };
            this.recordInputData['installBase'].map(x => {
                obj[x.type].push(x.value);
            });
            this.recordInputData['demandRates'].map(x => {
                obj2[x.type].push(x.value);
            });
        }

        lenovoPublic.isShowGetJsonLoading.call(this, true);
        this.getJsonService.uploadCustomModifyInfo(oData,
            (data) => {
                lenovoPublic.selfLog2(x => console.log(data));
                lenovoPublic.isShowGetJsonLoading.call(this);
            }, (err) => {
                console.log(err);
                lenovoPublic.isShowGetJsonLoading.call(this);
            });


        this.isShowRecordBox = false; // 点击暂停时显示记录框记录修正原因
        lenovoPublic.selfLog2(x => console.log(this.recordInputData));
    }

    // 添加方法还是原因输入框
    public addRecordOrMethod(event) {
        const parentLi = lenovoPublic.getParentEle(event.target, 'li');
        const ratesOrBase = parentLi.getAttribute('ratesOrBase');
        const type = parentLi.getAttribute('type');

        const obj = {
            id: String(Math.random()),
            type,
            value: ''
        };
        this.recordInputData[ratesOrBase].push(obj);
        console.log(this.recordInputData[ratesOrBase]);
    }


    // 关闭查看修正记录
    public closeCheckAmendRecord() {
        this.checkAmendRecord = false;
    }


    // 隐藏在保量修正完成提示框-----使用指令监听如果提示框变为了显示状态那么2s后消失
    public hideInstallBaseTip(param, ele, that) {
        lenovoPublic.publicClearTimeout('closeInstallBaseTip');
        if (param !== 'none') {
            lenovoPublic.publicSetTimeout('closeInstallBaseTip', 2000, () => {
                lenovoPublic.setCss(ele, { display: 'none' });
            });
        }
    }


    /**
     * 初始化输入框的change事件
     */
    private afterviewInit() {
        const vm = this;
        $('.changeRaNum').change(function (event) {
            console.log(event.target.value.length, 'change');
            if (event.target.value.length > 0) {
                {

                    // ra需求率线的拖拽操作
                    if (vm.curDragSeriesInfo['seriesName']) {
                        const curDragSeriesInfo = vm.curDragSeriesInfo;
                        const curSeries = vm.malfunctionOptions['series'].find(x => x.name === curDragSeriesInfo['seriesName'] && x.id === curDragSeriesInfo['seriesId']);
                        const dataIndex = curDragSeriesInfo['dataIndex'], id = curDragSeriesInfo['seriesId'], name = curDragSeriesInfo['seriesName'];
                        if (curSeries) {
                            curSeries.data[dataIndex]['value'] = Number(event.target.value);
                            vm.echartsInstance_mf.setOption({
                                series: [{
                                    id: id,
                                    name: name,
                                    type: 'line',
                                    data: curSeries.data
                                }]
                            });
                        }
                    }

                    if (vm.curDragSeriesInfo['seriesName']) {
                        return;
                    }
                }
            }
        });
    }

    /**
     * addEventListener 监听冒泡到document时是否隐藏显示出来的输入框
     * @param param 无效参数，传入进来的参数为undefined
     * @param event 当前点击的元素
     */
    @HostListener('document:click', ['$event.target'])
    eventListenerClick(target) {
        const vm = this;
        lenovoPublic.selfLog2(x => console.log(target, target));
        const changeRaNum2 = document.querySelector('#changeRaNum2');
        const changeRaNum = document.querySelector('#changeRaNum');
        if (changeRaNum2 && !vm.isShowChangeNum && (target !== changeRaNum2 && target !== changeRaNum)) {
            vm.isMouseDown = false;
            // vm.curDragSeriesInfo = {};
            $('.changeRaNum').hide();
        }
    }

    /**
     * 监听document上鼠标的的弹起事件
     */
    @HostListener('document:mouseup', ['$event.target'])
    eventListenerMouseUp(target) {
        const vm = this;
        if (vm.isMouseDown || String(vm.isMouseDown) === 'false') {
            vm.isMouseDown = false;
            // vm.curDragSeriesInfo = {};
        }
    }


}
