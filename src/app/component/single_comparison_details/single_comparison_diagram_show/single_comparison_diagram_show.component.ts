import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
import { GetJsonService, DataManageService, TooltipBoxService } from '../../../shared/service';
import { padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
declare const $: any, lenovoPublic;

@Component({
    selector: 'app-single-comparison-diagram-show',
    templateUrl: './single_comparison_diagram_show.component.html',
    styleUrls: ['./single_comparison_diagram_show.component.scss']
})
export class SingleComparisonDiagramShowComponent implements OnInit, AfterViewInit, OnDestroy {
    // param_yang---start
    @Output() setChangeDataTosaveLinePopEmit = new EventEmitter(); // 点击保存时修改保存线的弹框的属性或内容
    @Output() changeParentData = new EventEmitter(); // 修改父组件的数据
    @Output() updatePlaceHolderEmit = new EventEmitter(); // 用于修改保存弹框的placeholder
    // param_yang---end
    @Output() default_forecastName = new EventEmitter();
    @Output() clickDefFc = new EventEmitter();
    @Output() isShowPopEmit = new EventEmitter();
    @Output() fcLineOne_time = new EventEmitter();

    predictionShow$;
    placehole_name = [];
    allData;
    curData;
    isLoading = true;
    echartsInstance_fc;
    echartsInstance_mf;
    // detachAndMerge = ['拆出需求率和故障率', '合并所有曲线'];
    detachAndMerge = ['拆出需求率和产品线大类需求率', '合并所有曲线'];
    dmValue;
    optionData;
    timeXfc;
    timeXmf;
    dIndex;
    forecastOptions = {};

    malfunctionOptions = {};
    fcCheckBox = [];
    mlCheckBox = [];
    // [{
    //     content: '默认预测需求率',
    //     isShow: true,
    //     num: 0
    // }];
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
    setTimeoutArr = {};
    ibMaxNum;
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
    delLineIndex = [];
    defaultForecast = [];
    defForecastId = [];
    fcColor = [
        ['rgba(34,188,6,0.83)',
            'rgba(2,128,241,0.6)',
            'rgba(255,160,4,0.8)',
            'rgba(30,139,102,0.88)'],
        ['rgba(193,185,8,0.83)',
            'rgba(144,103,0,0.6)',
            'rgba(4,97,255,0.88)',
            'rgba(30,139,102,0.88)'
        ],
        ['rgba(38,6,188,0.83)',
            'rgba(0,38,72,0.6)',
            'rgba(207,4,255,0.88)',
            'rgba(30,139,102,0.88)'
        ]
    ];
    mfColor = [
        ['#00BEDB',
            'rgba(226,0,6,0.7)',
            'rgba(199,203,0,1)'],
        ['#7B466C',
            'rgba(150,9,91,0.7)',
            'rgba(199,203,0,1)',
        ],
        ['#009C3B',
            'rgba(99,149,0,0.7)',
            'rgba(199,203,0,1)',
        ]
    ];
    fcLinsData = [];
    mfLinsData = [];
    timeoutShowLine1;
    timeoutPositionNowBj;
    dataOption = {
        diagramLines: [],
        baseTimeLine: []
    };
    timeArr = [];
    sendDefaultFc = [];
    forecastName_length = 1;
    edit_allData;
    save_allData;
    fcStartTime = [];
    def_fcArr;
    legendTimeout;
    allLines = [];
    maxYValue = -1;
    maxMfYValue = -1;
    last_time_buy = '2011-11-11';
    lastTimeBuyBUsed = [];
    nowTime;
    todayTime;
    markPoint_name;
    fc_markPoint_time;
    ibNum = 1;
    mouseData = {
        'fc': {}, // 记录fc图表鼠标移入当前线的数据
        'mf': {}
    };
    ibAllLines = []; // 所有在保量曲线
    isShowOne = false; // 日期后面是否拼接-01
    constructor(
        private updataSubjectService: UpdataSubjectService,
        private http: HttpClient,
        private getJsonService: GetJsonService,
        private dataManageService: DataManageService,
        private tooltipBoxService: TooltipBoxService,
        private elementRef: ElementRef
    ) {

    }

    ngOnInit() {
        this.getData();
        this.dmValue = this.detachAndMerge[0];
        this.getDiagramData();
        // const fcId = [
        //     '5c8ee56a1a250d2102fe3f30',
        //     '5c8b800e1a250d2102fe3f0f',
        //     '5c8b782b1a250d2102fe3f02',
        //     '5c8b780c1a250d2102fe3f00',
        //     '5c8b731b1a250d63ad7de997'
        // ];
        // this.getJsonService.deletLineByIds(fcId, (data) => {

        // }, (err) => {
        //     // lenovoPublic.selfLog2(()=>console.log('error'));
        // });
    }

    ngAfterViewInit() {
        clearTimeout(this.setTimeoutArr['0']);
        window.addEventListener('resize', () => {
            this.setTimeoutArr['0'] = setTimeout(() => {
                this.timePosition();
                // // lenovoPublic.selfLog2(()=>console.log(this.echartsInstance_fc.getHeight(), 111111));
            }, 100);
        });
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

    // 合并图表
    margeChart(mg) {
        clearTimeout(this.setTimeoutArr['1']);
        $('.dmValue').removeClass('dmValue1');
        $('.dmUl').removeClass('dmUl1');
        if (mg.innerHTML === '合并所有曲线') {
            if ($('#chartTwo').css('display') === 'none') {
                return;
            }
            $('#chartTwo').css('display', 'none');
            for (let i = 0; i < this.mlCheckBox.length; i++) {
                // this.mlCheckBox[i].num = this.fcCheckBox.length;
                this.fcCheckBox.push(this.mlCheckBox[i]);
                this.forecastOptions['series'].push({
                    name: this.mlCheckBox[i].pnCont[0].content,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    showSymbol: false, // 是否显示symbol
                    lineStyle: {
                        color: this.fcColor[(this.fcCheckBox.length - 1) % 7],
                        width: 2,
                        opacity: 0.7,
                    },
                    itemStyle: { // 拐折点样式
                        normal: {
                            color: this.fcColor[(this.fcCheckBox.length - 1) % 7],
                            borderColor: this.fcColor[(this.fcCheckBox.length - 1) % 7],
                            borderWidth: 8
                        }
                    },
                    connectNulls: true,
                    yAxisIndex: 1,
                    data: this.opt([], i, this.mfLinsData)
                });
            }

            this.clickFclegend(0, 0);
            this.forecastOptions = Object.assign({}, this.forecastOptions);
            this.setTimeoutArr['1'] = setTimeout(() => {
                // this.clickFclegend(0, 0);
            }, 10);
        } else {
            if ($('#chartTwo').css('display') === 'block') {
                return;
            }
            $('#chartTwo').css('display', 'block');
            this.forecastOptions['series'].splice(this.fcCheckBox.length - this.mlCheckBox.length, this.mlCheckBox.length);
            this.fcCheckBox.splice(this.fcCheckBox.length - this.mlCheckBox.length, this.mlCheckBox.length);
            this.clickFclegend(0, 0);
            this.forecastOptions = Object.assign({}, this.forecastOptions);
            for (let i = 0; i < this.mlCheckBox.length; i++) {
                this.mlCheckBox[i].num = i;
            }
            this.setTimeoutArr['1'] = setTimeout(() => {
                // this.clickFclegend(0, 0);
            }, 10);
        }

    }

    // 调用是否选中曲线的方法
    clickFclegend(fcNum, mfNum) {

        const fcLegendSelectedObj = {};
        for (let i = 0; i < this.fcCheckBox.length; i++) {
            for (let m = 0; m < this.fcCheckBox[i].pnCont.length; m++) {
                fcLegendSelectedObj[this.fcCheckBox[i].pnCont[m].legendName] = this.fcCheckBox[i].pnCont[m].isShow;
            }
        }
        const mfLegendSelectedObj = {};
        for (let j = 0; j < this.mlCheckBox.length; j++) {
            for (let q = 0; q < this.mlCheckBox[j].pnCont.length; q++) {
                mfLegendSelectedObj[this.fcCheckBox[j].pnCont[q].legendName] = this.fcCheckBox[j].pnCont[q].isShow;
            }
        }
        this.forecastOptions['legend']['selected'] = fcLegendSelectedObj;
        this.malfunctionOptions['legend']['selected'] = mfLegendSelectedObj;

        // for (let i = fcNum; i < this.fcCheckBox.length; i++) {
        //     console.log('asdfasdfasdaaadfsfsdf');
        //     for (let m = 0; m < this.fcCheckBox[i].pnCont.length; m++) {
        //         console.log('asdfasdfaaaa', this.fcCheckBox);
        //         this.fcLegendClick(this.en, 'fc', !this.fcCheckBox[i].pnCont[m].isShow, i, m, this.fcCheckBox[i].pnCont[m].legendName);
        //     }
        // }
        // for (let j = mfNum; j < this.mlCheckBox.length; j++) {
        //     for (let q = 0; q < this.mlCheckBox[j].pnCont.length; q++) {
        //         this.fcLegendClick(this.en, 'mf', !this.mlCheckBox[j].pnCont[q].isShow, j, q, this.mlCheckBox[j].pnCont[q].legendName);
        //     }
        // }
    }

    // forecast的初始化
    forecastChartInit(ec) {
        this.echartsInstance_fc = ec;
        this.echartsInstance_fc.getZr().on('mousemove', param => {
            this.dIndex = this.echartsInstance_fc.convertFromPixel({ seriesIndex: 0 }, [param.offsetX, param.offsetY])[0];
            // // lenovoPublic.selfLog2(()=>console.log(this.echartsInstance_fc, this.dIndex,this.echartsInstance_fc.convertFromPixel({ seriesIndex: 0 }, [param.offsetX, param.offsetY])));

            const sIndex = 2;
            const dIndex = this.dIndex;
            this.echartsInstance_fc.setOption({
                xAxis: {
                    axisPointer: {
                        show: true
                    }
                }
            });
            this.setTooltipFc(sIndex, this.dIndex);
            // 关联故障图表显示 判断故障图表显示再关联
            this.echartsInstance_mf.setOption({
                xAxis: {
                    axisPointer: {
                        show: true
                    }
                }
            });
            this.setTooltipMf(0, this.dIndex);

        });
        this.echartsInstance_fc.getZr().on('globalout', param => {
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

    }

    // malfunction初始化
    malfunctionChartInit(ec) {
        this.echartsInstance_mf = ec;
        this.echartsInstance_mf.getZr().on('mousemove', param => {
            this.dIndex = this.echartsInstance_mf.convertFromPixel({ seriesIndex: 0 }, [param.offsetX, param.offsetY])[0];
            const sIndex = 1;
            this.echartsInstance_mf.setOption({
                xAxis: {
                    axisPointer: {
                        show: true
                    }
                }
            });
            this.setTooltipMf(sIndex, this.dIndex);
            // 关联预测图表
            this.echartsInstance_fc.setOption({
                xAxis: {
                    axisPointer: {
                        show: true
                    }
                }
            });
            this.setTooltipFc(2, this.dIndex);
        });
        this.echartsInstance_mf.getZr().on('globalout', param => {
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

    // tslint:disable-next-line:member-ordering
    getOptFc;
    // tslint:disable-next-line:member-ordering
    getOptMf;
    // 显示设置当前预测框
    showSetChart(event, cont, mIndex, wIndex, id, pn, data) {
        clearTimeout(this.legendTimeout);
        const parent = document.querySelector('.fc-check-box');
        this.getOptFc = this.echartsInstance_fc.getOption();
        [this.mouseData.fc['pn'], this.mouseData.fc['data'], this.mouseData.fc['mIndex'], this.mouseData.fc['nIndex']] = [pn, data, wIndex, mIndex];
        $('.setChartBtn,.nowChart,.conSave,.confirmChart,.delChart').hide();
        if (cont === 'keDiagramLineType_long_term_pred') {
            $('.setChartBtn,.nowChart').show();
            $('.setChartBtn').css({ 'top': (event.target.offsetTop + 25 + parent.scrollTop) + 'px', 'left': parent['offsetLeft'] + 'px' });
            // $('.setChartBtn' + wIndex + mIndex).css('display', 'block');
            // 是否显示保存按钮
            for (let i = 0; i < this.fcCheckBox[wIndex].pnCont.length; i++) {
                if (!this.fcCheckBox[wIndex].pnCont[mIndex]['save']) {
                    $(`.conSave,.delChart`).show();
                    // $(`.delChart${wIndex}${mIndex}`).show();
                }
                if (!this.fcCheckBox[wIndex].pnCont[mIndex]['ensure'] && this.fcCheckBox[wIndex].pnCont[mIndex]['save']) {
                    $(`.confirmChart`).show();
                }
            }
        }
        this.echartsInstance_fc.setOption({
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

    // 移入fc图表的操作框时取消框的隐藏
    setFcOperation() {
        clearTimeout(this.legendTimeout);
    }

    // 隐藏当前预测框
    hideSetChart(id?) {
        clearTimeout(this.legendTimeout);
        id = id ? id : this.mouseData.fc['data'].legendName;
        let lineItemStyle: any = '';
        this.legendTimeout = setTimeout(() => {
            $('.setChartBtn').hide();
        }, 100);
        if (this.getOptFc) {
            lineItemStyle = this.getOptFc.series.find((item) => item.name === id);
        } else {
            this.getOptFc = this.echartsInstance_fc.getOption();
            lineItemStyle = this.getOptFc.series.find((item) => item.name === id);
        }
        // this.forecastOptions = Object.assign({}, this.forecastOptions);
        if (lineItemStyle) {
            this.echartsInstance_fc.setOption({
                series: [{
                    name: id,
                    lineStyle: lineItemStyle.lineStyle,
                }]
            });
        }

    }

    // mf图表高亮
    mfShowSetChart(id) {
        this.getOptMf = this.echartsInstance_mf.getOption();
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
    mfHideSetChart(id) {

        this.echartsInstance_mf.setOption({
            series: [{
                name: id,
                lineStyle: {
                    width: 2,
                    shadowBlur: 0,
                    shadowColor: 'rgba(10,29,30,0)',
                    shadowOffsetY: 0,
                    opacity: 0.8
                },
            }]
        });
    }

    // 重新设置forecastOption时更新图表
    updateOption() {
        clearTimeout(this.setTimeoutArr['2']);
        this.clickFclegend(0, 0);
        this.forecastOptions = Object.assign({}, this.forecastOptions);
        this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
    }

    // 点击设置当前预测曲线
    clickNowChart() {
        // console.log(this.mouseData);
        $('.setChartBtn').hide();
        this.def_fcArr = { // 设置默认预测曲线的参数
            pn: this.mouseData.fc['pn'],
            id: this.mouseData.fc['data'].id,
            value: this.mouseData.fc['data'].content,
            kIndex: this.mouseData.fc['mIndex'],
            mIndex: this.mouseData.fc['nIndex']
        };
        this.defForecastLine(this.def_fcArr);
    }


    // 点击保存
    clickSave() {
        const code = this.mouseData.fc['data'].lineCode,
            name = this.mouseData.fc['data'].content,
            index = this.mouseData.fc['mIndex'];
        this.isShowPopEmit.emit(true);
        const arr = [];
        for (const item of this.edit_allData) {
            if (code === item.lineParmUnionCode) {
                arr.push(item);
            }
        }
        this.placehole_name[index] = name;
        this.updatePlaceHolderEmit.emit(this.placehole_name[index]);
        this.setShowDataToDiagramParameter({ type: 'updataLineArrToSave', data: arr, isPush: false });
        this.setChangeDataTosaveLinePop({ type: 'saveLinesCurIndex', data: index });
    }

    // 点击确认使用
    clickConfirmUse() {
        const id = this.mouseData.fc['data'].id,
            index = this.mouseData.fc['mIndex'],
            kIndex = this.mouseData.fc['nIndex'];
        $('.confirmUseBox').show();
        const arr = [];
        for (const item of this.save_allData) {
            if (id === item.lineId) {
                this.last_time_buy = item.timeLine[0];
                arr[0] = true;
                arr[1] = 'keDiagramLineType_long_term_pred';
                arr[2] = item.timeLine;
                arr[3] = index;
                this.lastTimeBuyBUsed.push(...arr);
            }
        }
        this.updataEnsure(id);
        this.fcCheckBox[index].pnCont[kIndex].ensure = true;
        $(`ensure${index}${kIndex}`).css('display', 'inline-block');
    }


    // 点击确认使用发送请求
    updataEnsure(id) {
        this.getJsonService.setLineIsUsed({ lineId: id, used: true }, (data) => {
            this.changeParentData.emit({ type: 'clickConfirmUse', data: this.lastTimeBuyBUsed });
            this.lastTimeBuyBUsed = [];
        }, (err) => {
            // lenovoPublic.selfLog2(()=>console.log(err));
        });
    }

    // 关闭确认使用时间选择框
    clickClock() {
        $('.confirmUseBox').hide();
    }

    // 点击删除曲线
    clickDelLine() {
        const lineCode = this.mouseData.fc['data'].lineCode,
            index = this.mouseData.fc['mIndex'],
            mIndex = this.mouseData.fc['nIndex'];
        this.fcCheckBox[index].pnCont.splice(mIndex, 1);
        this.mlCheckBox[index].pnCont.map((item, kIndex) => {
            if (item.lineCode === lineCode) {
                this.mlCheckBox[index].pnCont.splice(kIndex, 1);
                return;
            }
        });
        this.forecastOptions['series'].map((item, kIndex) => {
            if (item.name === lineCode) {
                this.forecastOptions['series'].splice(kIndex, 1);
                return;
            }
        });
        this.malfunctionOptions['series'].map((item, kIndex) => {
            if (item.name === lineCode) {
                this.malfunctionOptions['series'].splice(kIndex, 1);
                return;
            }
        });
        this.defForecastLine(this.def_fcArr);
        lenovoPublic.selfLog2(() => console.log(this.malfunctionOptions, this.forecastOptions, this.mlCheckBox, this.fcCheckBox));

        // $('.delLineBox').show();
        // this.delLineIndex[0] = index;
        // this.delLineIndex[1] = mIndex;
        // this.delLineIndex[2] = cont;

        // // lenovoPublic.selfLog2(()=>console.log(this.forecastOptions['series'], '所有series曲线'));
    }

    // 确认删除曲线
    confirmDelLine() {
        const fcId = [];

        for (const item of this.forecastOptions['series']) {
            // 如果为第一条默认预测线则不能删除
            if (this.delLineIndex[2].includes('预测0')) {
                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: `该曲线不可删除`,
                        style: {}
                    }]
                }, 'alert');
                // alert('该曲线不可删除');
                this.updateOption();
                $('.delLineBox,.setChartBtn').hide();
                return;
            }
            // 获取到要删除的fc的id
            if (item.name === this.delLineIndex[2]) {
                fcId.push(item.id);
            }
        }
        // 根据fc的id获取mf的last_time_buy,再获取id
        let last_time_buy = '';
        for (const item of this.allData[this.delLineIndex[0]].projectModel.diagramLines) {
            if (item.lineId === fcId[0]) {
                last_time_buy = item.last_time_buy;
            }
        }
        for (const item of this.allData[this.delLineIndex[0]].projectModel.diagramLines) {
            if (item.last_time_buy === last_time_buy && item.lineName === '故障') {
                fcId.push(item.lineId);
            }
        }
        // 删除曲线
        this.getJsonService.deletLineByIds(fcId, (data) => {

        }, (err) => {
            // lenovoPublic.selfLog2(()=>console.log('error'));
        });

        // 删除fc图表区的线
        for (const [key, item] of Object.entries(this.forecastOptions['series'])) {
            if (item['name'].includes(this.delLineIndex[2])) {
                this.forecastOptions['series'].splice(Number(key), 1);
            }
        }
        let mfName = '';
        for (const [key, item] of Object.entries(this.malfunctionOptions['series'])) {
            if (item['id'] === fcId[1]) {
                this.malfunctionOptions['series'].splice(Number(key), 1);
                mfName = item['name'];
            }
        }
        let mfKey = -1;
        for (const [key, item] of Object.entries(this.mlCheckBox[this.delLineIndex[0]].pnCont)) {
            if (item['content'].includes(mfName)) {
                mfKey = Number(key);
            }
        }
        this.fcCheckBox[this.delLineIndex[0]].pnCont.splice(this.delLineIndex[1], 1);
        this.mlCheckBox[this.delLineIndex[0]].pnCont.splice(mfKey, 1);
        this.updateOption();
        $('.delLineBox,.setChartBtn').hide();
    }


    // 取消删除曲线
    countermandLine() {
        $('.delLineBox,.setChartBtn').hide();
    }

    // fc选择开始的日期
    clickStartNum(num, nn) {
        let timeIndex = 0;
        const bfc = 100 / this.timeXfc.length;
        // if (nn.includes('mf')) {
        //     this.mfStartNum = num;
        //     for (let i = 0; i < this.timeXfc.length; i++) {
        //         if (this.mfStartNum === this.timeXfc[i].slice(0, 7)) {
        //             timeIndex = i;
        //         }
        //     }
        //     this.echartsInstance_mf.dispatchAction({
        //         type: 'dataZoom',
        //         start: bfc * timeIndex,
        //     });
        //     this.defTimeList(this.timeData, this.mfStartNum, this.mfEndNum, nn);
        // } else {
        this.startNum = num;
        for (let i = 0; i < this.timeXfc.length; i++) {
            if (this.startNum === this.timeXfc[i].slice(0, 7)) {
                timeIndex = i;
            }
        }
        this.echartsInstance_fc.dispatchAction({
            type: 'dataZoom',
            start: bfc * timeIndex,
        });
        this.echartsInstance_mf.dispatchAction({
            type: 'dataZoom',
            start: bfc * timeIndex,
        });
        this.defTimeList(this.timeData, this.startNum, this.endNum);
        // }
    }

    // fc选择结束的日期
    clickEndNum(num, nn) {
        const bfc = 100 / this.timeXfc.length;
        let timeIndex = 0;
        // if (nn.includes('mf')) {
        //     this.mfEndNum = num;
        //     for (let i = 0; i < this.timeXfc.length; i++) {
        //         if (this.mfEndNum === this.timeXfc[i].slice(0, 7)) {
        //             timeIndex = i;
        //         }
        //     }
        //     this.echartsInstance_mf.dispatchAction({
        //         type: 'dataZoom',
        //         end: bfc * timeIndex,
        //     });
        //     this.defTimeList(this.timeData, this.mfStartNum, this.mfEndNum, nn);
        // } else {
        this.endNum = num;
        for (let i = 0; i < this.timeXfc.length; i++) {
            if (this.endNum === this.timeXfc[i].slice(0, 7)) {
                timeIndex = i;
            }
        }
        this.echartsInstance_fc.dispatchAction({
            type: 'dataZoom',
            end: bfc * timeIndex,
        });
        this.echartsInstance_mf.dispatchAction({
            type: 'dataZoom',
            end: bfc * timeIndex,
        });
        this.defTimeList(this.timeData, this.startNum, this.endNum);
        // }
    }

    fcLegendClick(event: any, chartType: any, status: any, index: any, k, lgName) {
        // 加className判断,防止line显示没有动画, label标签点击事件执行两次
        // if ((event.target.className.includes('label_checkbox') || event.target.className.includes('show_box')) && this.echartsInstance_fc ||
        //     (event.target.className.includes('label_checkbox') || event.target.className.includes('show_box')) && this.echartsInstance_mf) {
        // 判断是哪个
        if (this.optionData) {
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

        }

        if (event.type !== 'click') {
            return;
        }

        for (const item of this.fcCheckBox[index].pnCont) {
            if (item.legendName === lgName) {
                item.isShow = !status;
            }
        }
        for (const item of this.mlCheckBox[index].pnCont) {
            if (item.legendName === lgName) {
                item.isShow = !status;
            }
        }
    }

    // 稳定legend的name名称
    gDLgName(index) {
        for (const item of this.fcCheckBox[index].pnCont) {
            this.hideSetChart(item.legendName);
        }
        for (const item of this.mlCheckBox[index].pnCont) {
            this.mfHideSetChart(item.legendName);
        }
    }

    // 计算fc图表的Y轴最大值
    countFcY() {
        const options: any = [{ 'usageLength': 0, 'ibLength': 0, 'fcLength': 0 },
        { 'usage': [], 'ib': [], 'fc': [] }];
        const fcYArr = [];
        for (const item of this.edit_allData) {
            if (item.lineType.includes('keDiagramLineType_long_term_pred') || item.lineType.includes('keDiagramLineType_usage') || item.lineType.includes('keDiagramLineType_ib')) {
                fcYArr.push(item);
            }
        }

        for (const line of fcYArr) {
            if (line.lineType === 'keDiagramLineType_usage') {
                options[1].usage.push(Math.max.apply(null, line.value));
            }
            // 取ib数据的最大值  在保量
            if (line.lineType === 'keDiagramLineType_ib') {
                options[1].ib.push(Math.max.apply(null, line.value));
            }
            if (line.lineType === 'keDiagramLineType_long_term_pred') {
                options[1].fc.push(Math.max.apply(null, line.value));
            }
        }
        options[0].usageLength = Math.max.apply(null, options[1].usage);
        options[0].ibLength = Math.max.apply(null, options[1].ib);
        options[0].fcLength = Math.max.apply(null, options[1].fc);
        const maxNum = Math.max(options[0].usageLength, options[0].fcLength);
        this.ibMaxNum = Math.ceil(options[0].ibLength / maxNum); // 计算this.num
        for (const line of fcYArr) {
            if (line.lineType === 'keDiagramLineType_ib') {
                if ((Math.max.apply(null, line.value) / Number(this.ibMaxNum)) > this.maxYValue) {
                    this.maxYValue = Math.max.apply(null, line.value) / Number(this.ibMaxNum);
                }
                continue;
            }
            if (Math.max.apply(null, line.value) > this.maxYValue) {
                this.maxYValue = Math.max.apply(null, line.value);
            }
        }
    }

    // 计算mf图表的Y轴最大值
    countMfY() {
        const fcYArr = [];
        for (const item of this.edit_allData) {
            if (item.lineType.includes('keDiagramLineType_ProductLineRa') || item.lineType.includes('keDiagramLineType_ra')) {
                fcYArr.push(item);
            }
        }

        for (const line of fcYArr) {
            const max = Number(Math.max.apply(null, line.value)) * 100;
            if (max > this.maxMfYValue) {
                this.maxMfYValue = max;
            }
        }
    }

    // forecast获取option
    setForecastOptions(option) {
        clearTimeout(this.setTimeoutArr['3']);
        clearTimeout(this.setTimeoutArr['4']);
        this.fcLinsData[0] = [];
        this.defaultForecast[0] = [];
        for (const item of option.data.projectModel.diagramLines) {
            if (item.lineType.includes('keDiagramLineType_ib')) {
                this.fcLinsData[0].push(item);
            }
        }
        for (const item of option.data.projectModel.diagramLines) {
            if (item.lineType.includes('keDiagramLineType_usage')) {
                this.fcLinsData[0].push(item);
            }
        }
        option.data.projectModel.diagramLines.map((item, eIndex) => {
            if (item.lineType.includes('keDiagramLineType_long_term_pred')) {
                this.fcLinsData[0].push(item);
                this.defaultForecast[0][0] = option.data.projectModel.diagramLines[eIndex]; // 保存当前默认预测线的数据
            } else if (item.lineType.includes('keDiagramLineType_ra')) {
                this.defaultForecast[0][1] = option.data.projectModel.diagramLines[eIndex]; // 保存当前默认预测线的数据
            }
        });

        this.sendDefaultFc[0] = {
            'pn': option.btnList,
            'selectArr': []
        };

        this.showtimeBox = true;
        this.startNum = this.timeXfc[0].slice(0, 7);
        this.endNum = this.timeXfc[this.timeXfc.length - 1].slice(0, 7);
        this.mfStartNum = this.timeXfc[0].slice(0, 7);
        this.mfEndNum = this.timeXfc[this.timeXfc.length - 1].slice(0, 7);
        // 获取X轴截取至月的所有日期
        for (const item of this.timeXfc) {
            this.timeData.push(item.slice(0, 7));
        }
        this.startIndex = this.timeXfc.length;
        this.endIndex = 0;
        this.defTimeList(this.timeData);

        this.countFcY(); // 获取Y轴的最大值 和this.num
        const that = this;
        let showIb = true;
        if (showIb && this.ibNum) {
            this.ibNum = this.ibMaxNum; // 获取IB的倍数值
            showIb = false;
        }

        // 设置forecast的option
        this.forecastOptions = {
            title: {
                text: `在保量（/${this.ibMaxNum}）·需求量·预测`,
                textStyle: {
                    fontFamily: 'MicrosoftYaHeiUI',
                    fontSize: '14/20+rem',
                    color: '#3F4659',
                },
                left: '1%',
                top: '20/20+rem',
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
                    let res = '<p class="tooltip_fctimes tooltip_times">' + params[0].name + '</p><div class="tooltip_box">';
                    for (let i = 0; i < params.length; i++) {
                        if (params[i].value === '') {
                            params[i].value = '-';
                        } else {
                            if (params[i].color.lineType.includes('keDiagramLineType_long_term_pred')) {
                                params[i].value = Number(params[i].value).toFixed(1);
                            }
                            if (params[i].color.lineType.includes('keDiagramLineType_ra') || params[i].color.lineType.includes('keDiagramLineType_ProductLineRa')) {
                                params[i].value = Number(params[i].value).toFixed(4) + '%';
                            }
                            if (params[i].color.lineType.includes('keDiagramLineType_ib')) {
                                params[i].value = Number(params[i].value) * that.ibNum;
                            }
                        }
                        res += '<p class="tooltip_line"><span class="tooltip_name">' + params[i].color.onlyName + '</span><span class="tooltip_value">' + params[i].value + '</span></p>';
                    }
                    res += '</div>';
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
            grid: {
                left: '1.5%',
                right: '3%',
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
                // name: '在保量·需求量·预测',
                id: 'ForecastY',
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
                    formatter: function (param) {
                        // if (this.maxYValue < 10) {
                        // }
                        if (param > 10) {
                            param = Math.ceil(param);
                        } else if (param > 0 && param < 10) {
                            param = param.toFixed(2);
                        }
                        return param;
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(148,158,182,0.2)'
                    }
                },
                position: 'left',
                min: 0,
                max: this.maxYValue,
                interval: (this.maxYValue - 0) / 5
            },
            {
                // name: '在保量·需求量·预测',
                type: 'value',
                nameGap: 8,
                nameLocation: 'end',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                },
                position: 'rigth'
            }
            ],
            dataZoom: [{
                type: 'inside',
                show: false,
                start: 0,
                end: 100,
            }],
            series: []
        };
        let defFcIndex = -1;
        this.fcCheckBox[0] = {
            pnNum: option.btnList,
            pnCont: [],
            long: -1
        };
        for (let i = 0; i < this.fcLinsData[0].length; i++) {
            if (this.fcLinsData[0][i].lineType.includes('keDiagramLineType_long_term_pred')) {
                defFcIndex = i;
                this.fcCheckBox[0].long++;

                this.fcCheckBox[0].pnCont.push({
                    content: this.fcLinsData[0][i].name,
                    isShow: true,
                    num: i,
                    lineCode: this.fcLinsData[0][i].lineParmUnionCode,
                    save: true,
                    id: this.fcLinsData[0][i].lineId,
                    ensure: this.fcLinsData[0][i].bUsed,
                    legendName: this.fcLinsData[0][i].lineParmUnionCode,
                    lineType: this.fcLinsData[0][i].lineType,
                });
                this.fcSetSeries(this.fcLinsData[0], this.fcLinsData[0][i], this.fcLinsData[0][i].name, i, option, 0, this.fcLinsData[0][i].lineParmUnionCode);
            } else if (this.fcLinsData[0][i].lineType.includes('keDiagramLineType_usage')) {
                // 需求量添加了‘今’的markpoint
                this.fcCheckBox[0].pnCont.push({
                    content: this.fcLinsData[0][i].name,
                    isShow: true,
                    num: i,
                    lineCode: this.fcLinsData[0][i].lineParmUnionCode,
                    save: true,
                    id: this.fcLinsData[0][i].lineId,
                    ensure: this.fcLinsData[0][i].bUsed,
                    legendName: this.fcLinsData[0][i].lineId,
                    lineType: this.fcLinsData[0][i].lineType,
                });

                this.forecastOptions['series'].push({
                    id: this.fcLinsData[0][i].lineId,
                    name: this.fcLinsData[0][i].lineId,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    showSymbol: false, // 是否显示symbol
                    lineStyle: {
                        opacity: 0.8,
                        color: this.fcColor[0 % 3][i % 4],
                        width: 2,
                        linePn: option.btnList,
                        shadowBlur: 0,
                        shadowColor: 'rgba(10,29,30,0)',
                        shadowOffsetY: 0,
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
                                    offset: 0, color: this.fcColor[0 % 3][i % 4] // 0% 处的颜色
                                }, {
                                    offset: 1, color: this.fcColor[0 % 3][i % 4] // 100% 处的颜色
                                }],
                                global: false, // 缺省为 false
                                onlyName: this.fcLinsData[0][i].name,
                                lineType: this.fcLinsData[0][i].lineType,
                            },
                            borderColor: this.fcColor[0 % 3][i % 4],
                            borderWidth: 8
                        }
                    },
                    connectNulls: true,
                    markLine: {
                        type: 'dotted',
                        symbol: 'none',
                        data: [{
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
                            name: '今',
                            coord: [this.nowTime, Math.ceil(this.maxYValue)],
                            // symbol: 'none',
                            symbolSize: 20,
                            itemStyle: {
                                color: '#fff',
                            },
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
                    data: this.opt([], i, this.fcLinsData[0])
                });
            } else if (this.fcLinsData[0][i].lineType.includes('keDiagramLineType_ib')) {
                this.fcCheckBox[0].pnCont.push({
                    content: this.fcLinsData[0][i].name,
                    isShow: true,
                    num: i,
                    lineCode: this.fcLinsData[0][i].lineParmUnionCode,
                    save: true,
                    id: this.fcLinsData[0][i].lineId,
                    ensure: this.fcLinsData[0][i].bUsed,
                    legendName: this.fcLinsData[0][i].lineId,
                    lineType: this.fcLinsData[0][i].lineType,
                });
                this.fcSetSeries(this.fcLinsData[0], this.fcLinsData[0][i], this.fcLinsData[0][i].name, i, option, 0, this.fcLinsData[0][i].lineId);
            }
        }

        this.placehole_name[0] = `预测${this.fcCheckBox[0].long + 1}`;
        this.default_forecastName.emit(this.sendDefaultFc[0]);
        this.fcStartTime[0] = {
            data: this.fcLinsData[0][defFcIndex].forcastParams,
            index: 0
        };
        this.fcLineOne_time.emit(this.fcStartTime[0]); // 发送算法参数
        this.defForecastId[0] = option.data.projectModel.currentPredLineId;
        this.setForecastLine(this.defForecastId[0], this.fcCheckBox[0].pnCont, option.btnList, 0);
        // this.def_fcArr = { // 设置默认预测曲线的参数
        //     pn: option.btnList,
        //     id: this.fcLinsData[0][defFcIndex].lineId,
        //     value: this.fcCheckBox[0].pnCont[defFcIndex].content,
        //     kIndex: 0,
        //     mIndex: defFcIndex
        // };
        // this.forecastOptions['series'][defFcIndex].lineStyle.width = 6; // 设置默认预测曲线为加粗
        this.setFcMarkPoint('fc', defFcIndex, 0, defFcIndex, this.defForecastId[0]);
        this.setTimeoutArr['4'] = setTimeout(() => {
            this.timePosition(); // 定位自定义下拉时间框的位置
            this.positionNowFc(defFcIndex); // 定位当前预测曲线的位置
            this.linesTen();
            this.gDLgName(0);
        }, 1);

    }

    setForecastLine(fcId, fcBox, pn, index) {
        let mIndex = -1;
        let value = '';
        for (let i = 0; i < fcBox.length; i++) {
            if (fcId === fcBox[i].id) {
                value = fcBox[i].value;
                mIndex = i;
            }
        }
        this.def_fcArr = { // 设置默认预测曲线的参数
            pn: pn,
            id: fcId,
            value: value,
            kIndex: index,
            mIndex: mIndex
        };
    }

    // 设置fc的series
    fcSetSeries(data, fcLinsData, name, i, option, index, lgName) {
        this.forecastOptions['series'].push({
            id: fcLinsData.lineId,
            name: lgName,
            type: 'line',
            smooth: true,
            symbol: 'none',
            showSymbol: false, // 是否显示symbol
            lineStyle: {
                color: this.fcColor[index % 3][i % 4],
                width: 2,
                linePn: option.btnList,
                opacity: 0.8,
                shadowBlur: 0,
                shadowColor: 'rgba(10,29,30,0)',
                shadowOffsetY: 0,
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
                            offset: 0, color: this.fcColor[index % 3][i % 4] // 0% 处的颜色
                        }, {
                            offset: 1, color: this.fcColor[index % 3][i % 4] // 100% 处的颜色
                        }],
                        global: false, // 缺省为 false
                        onlyName: name,
                        lineType: data[i].lineType,
                    },
                    borderColor: this.fcColor[index % 3][i % 4],
                    borderWidth: 8
                }
            },
            connectNulls: true,
            markLine: {},
            markPoint: {},
            data: this.opt([], i, data)
        });
        lenovoPublic.selfLog2(() => console.log(this.fcCheckBox, index, i));
        if (this.fcCheckBox[index].pnCont[i].lineType) {
            if (!this.fcCheckBox[index].pnCont[i].lineType.includes('keDiagramLineType_usage') && !this.fcCheckBox[index].pnCont[i].lineType.includes('keDiagramLineType_ib')) {
                this.sendDefaultFc[index].selectArr.push({
                    'color': this.fcColor[index % 3][i % 4],
                    value: this.fcCheckBox[index].pnCont[i].content,
                    id: fcLinsData.lineId
                });
            }
        }
    }

    // malfunction获取option
    setMalfunctionOptions(option) {
        this.mfLinsData[0] = [];
        for (const item of option.data.projectModel.diagramLines) {
            if (item.lineType.includes('keDiagramLineType_ProductLineRa') || item.lineType.includes('keDiagramLineType_ra')) {
                this.mfLinsData[0].push(item);
            }
        }
        // for (const item of option.data.projectModel.diagramLines) {
        //     if (item.lineType.includes('keDiagramLineType_ra')) {
        //         this.mfLinsData[0].push(item);
        //     }
        // }
        this.countMfY(); // 设置Y轴的最大值

        this.mfDataArr.push(this.opt([], 3, this.optionData.projectModel.diagramLines));
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
                        res += '<p class="tooltip_line"><span class="tooltip_nameMf">' + params[i].color.onlyName + '</span><span class="tooltip_value">' + params[i].value + '</span></p>';
                    }
                    res += '</div>';
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
                    formatter: function (param) {
                        if (param > 0) {
                            param = param.toFixed(4);
                        }
                        return param;
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(148,158,182,0.2)'
                    }
                },
                min: 0,
                max: this.maxMfYValue,
                interval: (this.maxMfYValue - 0) / 5
            }],
            series: []
        };
        this.mlCheckBox[0] = {
            pnNum: option.btnList,
            pnCont: []
        };
        let defFcIndex = -1;
        for (let i = 0; i < this.mfLinsData[0].length; i++) {
            if (this.mfLinsData[0][i].lineType.includes('keDiagramLineType_ProductLineRa')) {
                this.mlCheckBox[0].pnCont.push({
                    content: this.mfLinsData[0][i].name,
                    isShow: true,
                    num: i,
                    lineCode: this.mfLinsData[0][i].lineParmUnionCode,
                    id: this.mfLinsData[0][i].lineId,
                    legendName: this.mfLinsData[0][i].lineId
                });
                this.malfunctionOptions['series'].push({
                    // name: '故障',
                    id: this.mfLinsData[0][i].lineId,
                    name: this.mfLinsData[0][i].lineId,
                    type: 'line',
                    smooth: false,
                    symbol: 'none',
                    showSymbol: false, // 是否显示symbol
                    lineStyle: {
                        color: this.mfColor[0 % 3][i % 3],
                        width: 2,
                        opacity: 0.7,
                        linePn: option.btnList,
                        shadowBlur: 0,
                        shadowColor: 'rgba(10,29,30,0)',
                        shadowOffsetY: 0,
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
                                    offset: 0, color: this.mfColor[0 % 3][i % 3] // 0% 处的颜色
                                }, {
                                    offset: 1, color: this.mfColor[0 % 3][i % 3] // 100% 处的颜色
                                }],
                                global: false, // 缺省为 false
                                onlyName: this.mfLinsData[0][i].name,
                                markName: '需求今'
                            },
                            borderColor: this.mfColor[0 % 3][i % 3],
                            borderWidth: 8
                        }
                    },
                    markLine: {
                        type: 'dotted',
                        symbol: 'none',
                        data: [{
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
                            name: '需求今',
                            coord: [this.nowTime, this.maxMfYValue],
                            // symbol: 'none',
                            symbolSize: 20,
                            itemStyle: {
                                color: '#fff',
                            },
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
                    connectNulls: true,
                    data: this.opt([], i, this.mfLinsData[0])
                });
                // this.mfSetSeries(this.mfLinsData[0], this.mfLinsData[0][i], this.mfLinsData[0][i].name, 0, i, option);
            } else {
                defFcIndex = i;
                this.mfSetSeries(this.mfLinsData[0], this.mfLinsData[0][i], this.mfLinsData[0][i].name, 0, i, option, this.mfLinsData[0][i].lineParmUnionCode);
            }
        }

        this.setFcMarkPoint('mf', defFcIndex, 0, defFcIndex, this.defForecastId[0]);
    }

    // 设置mf的series
    mfSetSeries(allData, data, name, index, mIndex, option, lgName) {
        this.mlCheckBox[index].pnCont.push({
            content: name,
            isShow: true,
            num: mIndex,
            lineCode: data.lineParmUnionCode,
            id: data.lineId,
            legendName: lgName
        });
        this.malfunctionOptions['series'].push({
            // name: '故障',
            id: data.lineId,
            name: lgName,
            type: 'line',
            smooth: false,
            symbol: 'none',
            showSymbol: false, // 是否显示symbol
            lineStyle: {
                color: this.mfColor[index % 3][mIndex % 3],
                width: 2,
                opacity: 0.7,
                linePn: option.btnList,
                shadowBlur: 0,
                shadowColor: 'rgba(10,29,30,0)',
                shadowOffsetY: 0,
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
                            offset: 0, color: this.mfColor[index % 3][mIndex % 3] // 0% 处的颜色
                        }, {
                            offset: 1, color: this.mfColor[index % 3][mIndex % 3] // 100% 处的颜色
                        }],
                        global: false, // 缺省为 false
                        onlyName: name
                    },
                    borderColor: this.mfColor[index % 3][mIndex % 3],
                    borderWidth: 8
                }
            },
            markLine: {},
            markPoint: {},
            connectNulls: true,
            data: this.opt([], mIndex, allData)
        });
    }

    // 展示线数据的长度处理
    opt(opts, index, optiondata) {
        const usageArr = [];
        for (const item of optiondata[index].value) {
            // 转换ib展示的数据
            usageArr.push(Number(item) / this.ibNum);
        }

        for (let i = 0; i < this.timeXfc.length; i++) {
            opts.push('');
        }
        // 将每条线的data转为和时间轴一样长的数组
        for (let j = 0; j < optiondata[index].timeLine.length; j++) {
            for (let i = 0; i < this.timeXfc.length; i++) {
                if (this.timeXfc[i] === optiondata[index].timeLine[j]) {
                    // 处理ib的数据
                    if (optiondata[index].name.includes('在保量')) {
                        opts[i] = usageArr[j];

                    } else if (optiondata[index].name.includes('需求率')) {
                        opts[i] = Number(optiondata[index].value[j]) * 100;

                    } else {
                        opts[i] = optiondata[index].value[j];
                    }
                }
            }
        }
        return opts;
    }

    // fc多组预测数据时将数据push进series中
    fcArrFunction(option, index) {
        clearTimeout(this.setTimeoutArr['5']);
        this.sendDefaultFc[index] = {
            'pn': option.btnList,
            'selectArr': []
        };
        this.defaultForecast[index] = [];


        this.fcLinsData[index] = [];
        for (const item of option.data.projectModel.diagramLines) {
            if (item.lineType.includes('keDiagramLineType_ib')) {
                this.fcLinsData[index].push(item);
            }
        }
        option.data.projectModel.diagramLines.map((item) => {
            if (item.lineType.includes('keDiagramLineType_usage')) {
                this.fcLinsData[index].push(item);
            }
        });
        option.data.projectModel.diagramLines.map((item, eIndex) => {
            if (item.lineType.includes('keDiagramLineType_long_term_pred')) {
                this.fcLinsData[index].push(item);
                this.defaultForecast[index][0] = option.data.projectModel.diagramLines[eIndex]; // 保存当前默认预测线的数据
            } else if (item.lineType.includes('keDiagramLineType_ra')) {
                this.defaultForecast[index][1] = option.data.projectModel.diagramLines[eIndex]; // 保存当前默认预测线的数据
            }
        });
        this.fcCheckBox[index] = {
            pnNum: option.btnList,
            pnCont: [],
            long: -1
        };
        let defFcId = '';
        let defFcIndex = -1;
        for (let i = 0; i < this.fcLinsData[index].length; i++) {
            if (this.fcLinsData[index][i].lineType.includes('keDiagramLineType_long_term_pred')) {
                defFcId = this.fcLinsData[index][i].lineId;
                this.fcCheckBox[index].long++;
                defFcIndex = i;
                this.fcCheckBox[index].pnCont.push({
                    content: this.fcLinsData[index][i].name,
                    isShow: false,
                    num: i,
                    lineCode: this.fcLinsData[index][i].lineParmUnionCode,
                    save: true,
                    id: this.fcLinsData[index][i].lineId,
                    ensure: this.fcLinsData[index][i].bUsed,
                    legendName: this.fcLinsData[index][i].lineParmUnionCode
                });
                this.fcSetSeries(this.fcLinsData[index], this.fcLinsData[index][i], this.fcLinsData[index][i].name, i, option, index, this.fcLinsData[index][i].lineParmUnionCode);
            } else {
                this.fcCheckBox[index].pnCont.push({
                    content: this.fcLinsData[index][i].name,
                    isShow: false,
                    num: i,
                    lineCode: this.fcLinsData[index][i].lineParmUnionCode,
                    save: true,
                    id: this.fcLinsData[index][i].lineId,
                    ensure: this.fcLinsData[index][i].bUsed,
                    legendName: this.fcLinsData[index][i].lineId
                });
                this.fcSetSeries(this.fcLinsData[index], this.fcLinsData[index][i], this.fcLinsData[index][i].name, i, option, index, this.fcLinsData[index][i].lineId);
            }
        }
        this.fcCheckBox[index].pnCont[defFcIndex].isShow = true;
        let sIndex = -1;
        for (const [key, item] of Object.entries(this.forecastOptions['series'])) {
            if (item['id'] === defFcId) {
                sIndex = Number(key);
            }
        }
        // 设置默认预测曲线的参数
        this.defForecastId[index] = option.data.projectModel.currentPredLineId;
        this.setForecastLine(this.defForecastId[index], this.fcCheckBox[index].pnCont, option.btnList, index);

        this.setFcMarkPoint('fc', sIndex, index, defFcIndex, this.defForecastId[index]); // 设置默认预测的markPoint
        this.placehole_name[index] = `预测${this.fcCheckBox[index].long + 1}`;
        this.default_forecastName.emit(this.sendDefaultFc[index]);
        this.fcStartTime[index] = {
            data: this.fcLinsData[index][defFcIndex].forcastParams,
            index: index
        };
        this.fcLineOne_time.emit(this.fcStartTime[index]); // 发送算法参数
        // this.def_fcArr = { // 设置默认预测曲线的参数
        //     pn: option.btnList,
        //     id: this.fcLinsData[index][defFcIndex].lineId,
        //     value: this.fcCheckBox[index].pnCont[defFcIndex].content,
        //     kIndex: index,
        //     mIndex: defFcIndex
        // };
        this.setTimeoutArr['5'] = setTimeout(() => {
            this.clickFclegend(0, 0);
            this.linesTen();
            this.gDLgName(index);
        }, 10);
    }

    // mf多组预测数据时将数据push进series中
    mfArrFunction(option, index) {
        clearTimeout(this.setTimeoutArr['6']);
        this.mfLinsData[index] = [];
        for (const item of option.data.projectModel.diagramLines) {
            if (item.lineType.includes('keDiagramLineType_ProductLineRa') || item.lineType.includes('keDiagramLineType_ra')) {
                this.mfLinsData[index].push(item);
            }
        }
        this.mlCheckBox[index] = {
            pnNum: option.btnList,
            pnCont: []
        };
        let defFcIndex = -1;
        for (let i = 0; i < this.mfLinsData[index].length; i++) {
            if (this.mfLinsData[index][i].lineType.includes('keDiagramLineType_ra')) {
                defFcIndex = i;
                this.mfSetSeries(this.mfLinsData[index], this.mfLinsData[index][i], this.mfLinsData[index][i].name, index, i, option, this.mfLinsData[index][i].lineParmUnionCode);
            } else {
                this.mfSetSeries(this.mfLinsData[index], this.mfLinsData[index][i], this.mfLinsData[index][i].name, index, i, option, this.mfLinsData[index][i].lineId);
            }
        }
        this.setFcMarkPoint('mf', defFcIndex, index, defFcIndex, this.defForecastId[index]);
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
    }

    // X轴自定义时间的位置
    timePosition() {
        // alert(typeof nn);
        clearTimeout(this.setTimeoutArr['7']);
        if (this.echartsInstance_fc) {
            this.fcWidth = this.echartsInstance_fc && this.echartsInstance_fc.getWidth && this.echartsInstance_fc.getWidth();
            this.fcHeight = this.echartsInstance_fc && this.echartsInstance_fc.getHeight && this.echartsInstance_fc.getHeight();
        }
        this.setTimeoutArr['7'] = setTimeout(() => {
            const fctimeStartWidth = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.isShowOne ? this.startNum + '-01' : this.startNum);
            const fctimeEndWidth = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.isShowOne ? this.endNum + '-01' : this.endNum);
            $('.timeStart').css({ 'top': this.fcHeight - 23, 'left': fctimeStartWidth - 18 });
            $('.timeEnd').css({ 'top': this.fcHeight - 23, 'left': fctimeEndWidth - 18 });
        }, 100);
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
        const month_1 = new Date().getMonth() - 2 < 10 ? '0' + (new Date().getMonth() - 2) : new Date().getMonth() - 2;
        const month_2 = new Date().getMonth() + 4 < 10 ? '0' + (new Date().getMonth() + 4) : new Date().getMonth() + 4;
        const date = new Date().getDate() < 10 ? ('0' + new Date().getDate()) : (new Date().getDate());
        // this.nowTime = year + '-' + month;
        // this.nowTime = year + '-' + month + '-01';
        this.todayTime = year + '-' + month;
        if (!this.predictionShow$) {
            this.predictionShow$ = this.updataSubjectService.getDiagramBottomSubject().subscribe((data) => {
                if (data) {
                    this.optionData = data[0].data;
                    this.allData = data;
                    for (const item of data) {
                        for (const lines of item.data.projectModel.diagramLines) {
                            this.allLines.push(lines);
                        }
                    }
                    this.edit_allData = [...this.allLines]; // 保存所有曲线，包含未保存的
                    this.save_allData = [...this.allLines]; // 保存所有保存过的曲线
                    this.setDataOption(data);
                    this.isLoading = false;
                }
                // this.fcCheckBox[0].pnNum = data[0].btnList;
            }, (err) => {
                // lenovoPublic.selfLog2(()=>console.log(err));
            });
        }
    }

    getForecastLine(id) {
        this.getJsonService.getNowForecastLine(id, (data) => {
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
            // lenovoPublic.selfLog2(()=>console.log(err));
        });
    }

    // 处理对比多组getData返回的option数据
    setDataOption(arr) {
        console.log(arr);
        // if (item.data.projectModel.currentPredLineId) {

        // }
        $('.nowFcLocation').show();
        // 处理X轴的数据
        for (const item of arr) {
            this.timeArr.push(...item.data.projectModel.groupModel.baseTimeLine);
        }
        for (let item of this.timeArr) {
            item = new Date(item).getTime();
            this.timeArr.sort();
            item = new Date(item).getFullYear() + '-' + (new Date(item).getMonth() + 1 < 10 ? '0' + new Date(item).getMonth() + 1 : new Date(item).getMonth() + 1) + (new Date(item).getDate() < 10 ? '0' + new Date(item).getDate() : new Date(item).getDate());
        }
        this.timeXfc = Array.from(new Set(this.timeArr)); // X轴的时间
        this.isShowOne = this.timeXfc[0].length > 7 ? true : false;
        this.nowTime = this.isShowOne ? this.todayTime + '-01' : this.todayTime;

        this.setForecastOptions(arr[0]);
        this.setMalfunctionOptions(arr[0]);

        if (arr.length < 2) {
            return;
        }
        $('.nowFcLocation').hide();
        for (let i = 1; i < arr.length; i++) {
            this.fcArrFunction(arr[i], i);
            this.mfArrFunction(arr[i], i);
        }
        this.forecastOptions = Object.assign({}, this.forecastOptions);
        // // lenovoPublic.selfLog2(()=>console.log(this.timeXfc, this.forecastOptions, 'X轴的时间'));
        this.setTimeoutArr['8'] = setTimeout(() => {
        }, 300);
    }

    /***
     * 设置默认预测曲线
     * param{} =  pn: pn号,
        id: id,
        value: 名称,
        kIndex: 外层的下标,
        mIndex: 内层pncont的下标
     *  */
    defForecastLine(param) {
        // console.log(param);
        // alert(1);
        clearTimeout(this.setTimeoutArr['9']);
        this.defaultForecast[param.kIndex][0] = this.edit_allData.find((item) => item.lineId === param.id); // 保存当前默认预测线的数据
        // lenovoPublic.selfLog2(()=>console.log(this.defaultForecast, 'fgr', this.edit_allData));
        this.defaultForecast[param.kIndex][1] = this.edit_allData.find((item) => {
            if (item.lineParmUnionCode === this.defaultForecast[param.kIndex][0].lineParmUnionCode && item.lineType.includes('keDiagramLineType_ra')) {
                return item;
            }
        }); // 保存当前默认预测线的数据

        this.fcStartTime[param.kIndex] = {
            data: this.defaultForecast[param.kIndex][0].forcastParams,
            index: param.kIndex
        };
        this.fcLineOne_time.emit(this.fcStartTime[param.kIndex]); // 发送算法参数
        let index = 0;
        for (const [key, item] of Object.entries(this.forecastOptions['series'])) {
            if (item['lineStyle'].linePn === param.pn) {
                item['lineStyle'].width = 2;
                if (!item['itemStyle'].normal.color.lineType.includes('keDiagramLineType_usage')) {
                    item['markLine'] = {};
                    item['markPoint'] = {};
                }
            }
            if (item['id'] === param.id) {
                index = Number(key);
            }
        }
        // this.malfunctionOptions['series'].map((item) => {
        //     if (!item['itemStyle'].normal.color.onlyName.includes('产品大类需求率')) {
        //         item['markLine'] = {};
        //         item['markPoint'] = {};
        //     }
        // });
        this.setFcMarkPoint('all', index, param.kIndex, param.mIndex, param.id, param.pn); // 设置默认预测的markpoint

        this.clickFclegend(0, 0);
        this.forecastOptions = Object.assign({}, this.forecastOptions);
        this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);


        lenovoPublic.selfLog2(() => console.log(this.forecastOptions));
        this.setTimeoutArr['9'] = setTimeout(() => {
            // this.clickFclegend(0, 0);
        }, 100);
        this.clickDefFc.emit({
            'color': this.fcColor[param.kIndex % 3][param.mIndex % 4],
            'value': param.value,
            'id': param.id
        });
        this.positionNowFc(index);
        // this.changeParentData.emit({ type: 'setDefForecastLine', data: [this.edit_allData, param.value, param.kIndex, param.mIndex, param.id, this.defaultForecast] });
        // 点击默认预测曲线时修改数据方法
        this.changeParentData.emit({ type: 'setDefForecastLine', data: [{ allData: this.edit_allData, lineName: param.value, kIndex: param.kIndex, mIndex: param.mIndex, lineId: param.id, defaultForecast: this.defaultForecast }] }); // 点击默认预测曲线时修改数据方法

        // 如果当前曲线已保存再调取接口
        const fcBox = this.fcCheckBox[param.kIndex].pnCont.find((item) => item.id === param.id);
        if (fcBox.save) {
            this.getForecastLine(param.id); // 调用接口设置记录默认预测曲线
        }
        console.log(this.forecastOptions, this.malfunctionOptions);
    }

    /**
     * 设置默认预测的markLine  markPoint  lineStyle
     *  */
    setFcMarkPoint(type, sIndex, kIndex, mIndex, id, pn?) {
        const vm = this;
        const line = this.forecastOptions['series'].find((item) => item.id === id);
        lenovoPublic.selfLog2(() => console.log(type, line, sIndex, kIndex, mIndex, this.defaultForecast, this.forecastOptions, this.malfunctionOptions));
        // console.log(type, sIndex, kIndex, mIndex, id, pn);
        if (type === 'fc') {
            line.lineStyle.width = 8;
            // 设置默认预测的markLine
            this.forecastOptions['series'][sIndex].markLine.type = 'dotted';
            this.forecastOptions['series'][sIndex].markLine.symbol = 'none';
            this.forecastOptions['series'][sIndex].markLine.data = [];
            this.forecastOptions['series'][sIndex].markLine.data[0] = {};
            this.forecastOptions['series'][sIndex].markLine.data[0].name = '预测';
            this.forecastOptions['series'][sIndex].markLine.data[0].xAxis = this.defaultForecast[kIndex][0].timeLine[0];
            this.forecastOptions['series'][sIndex].markLine.data[0].symbol = 'none';
            this.forecastOptions['series'][sIndex].markLine.data[0].lineStyle = {};
            this.forecastOptions['series'][sIndex].markLine.data[0].label = {};
            this.forecastOptions['series'][sIndex].markLine.data[0].label.formatter = '';
            this.forecastOptions['series'][sIndex].markLine.data[0].lineStyle.color = this.fcColor[kIndex % 3][mIndex % 4];
            // 设置默认预测的markPoint
            this.forecastOptions['series'][sIndex].markPoint.data = [];
            this.forecastOptions['series'][sIndex].markPoint.data[0] = {};
            this.forecastOptions['series'][sIndex].markPoint.data[0].name = '预';
            this.forecastOptions['series'][sIndex].markPoint.data[0].coord = [this.defaultForecast[kIndex][0].timeLine[0], Math.ceil(this.maxYValue)];
            this.forecastOptions['series'][sIndex].markPoint.data[0].symbolSize = 26;
            this.forecastOptions['series'][sIndex].markPoint.data[0].itemStyle = {};
            this.forecastOptions['series'][sIndex].markPoint.data[0].itemStyle.color = '#fff';
            this.forecastOptions['series'][sIndex].markPoint.data[0].label = {};
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.show = true;
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.color = '#fff';
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.formatter = '预';
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.backgroundColor = this.fcColor[kIndex % 3][mIndex % 4];
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.padding = 4;
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.borderRadius = 20;
        } else if (type === 'mf') {
            let nIndex = -1;
            this.malfunctionOptions['series'].map((item, key) => {
                if (line.name === item.name) {
                    nIndex = key;
                }
            });
            const mfNum = this.mlCheckBox[kIndex].pnCont.filter((item) => {
                return line.name === item.lineCode;
            });
            lenovoPublic.selfLog2(() => console.log(nIndex, mfNum));
            // 需求率markLine
            this.malfunctionOptions['series'][nIndex].markLine.type = 'dotted';
            this.malfunctionOptions['series'][nIndex].markLine.symbol = 'none';
            this.malfunctionOptions['series'][nIndex].markLine.data = [];
            this.malfunctionOptions['series'][nIndex].markLine.data[0] = {};
            this.malfunctionOptions['series'][nIndex].markLine.data[0].name = '真实';
            this.malfunctionOptions['series'][nIndex].markLine.data[0].xAxis = this.defaultForecast[kIndex][1].timeLine[0];
            this.malfunctionOptions['series'][nIndex].markLine.data[0].symbol = 'none';
            this.malfunctionOptions['series'][nIndex].markLine.data[0].lineStyle = {};
            this.malfunctionOptions['series'][nIndex].markLine.data[0].label = {};
            this.malfunctionOptions['series'][nIndex].markLine.data[0].label.formatter = '';
            this.malfunctionOptions['series'][nIndex].markLine.data[0].lineStyle.color = this.mfColor[kIndex % 3][mfNum[0].num % 3];
            // 设置需求率的markPoint
            this.malfunctionOptions['series'][nIndex].markPoint.data = [];
            this.malfunctionOptions['series'][nIndex].markPoint.data[0] = {};
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].name = '需求真';
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].coord = [this.defaultForecast[kIndex][1].timeLine[0], this.maxMfYValue];
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].symbolSize = 26;
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].itemStyle = {};
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].itemStyle.color = '#fff';
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label = {};
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.show = true;
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.color = '#fff';
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.formatter = '预';
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.backgroundColor = this.mfColor[kIndex % 3][mfNum[0].num % 3];
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.padding = 4;
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.borderRadius = 20;
        } else {
            line.lineStyle.width = 8;
            // 设置默认预测的markLine
            this.forecastOptions['series'][sIndex].markLine.type = 'dotted';
            this.forecastOptions['series'][sIndex].markLine.data = [];
            this.forecastOptions['series'][sIndex].markLine.data[0] = {};
            this.forecastOptions['series'][sIndex].markLine.data[0].name = '预测';
            this.forecastOptions['series'][sIndex].markLine.data[0].xAxis = this.defaultForecast[kIndex][0].timeLine[0];
            this.forecastOptions['series'][sIndex].markLine.data[0].symbol = 'none';
            this.forecastOptions['series'][sIndex].markLine.data[0].lineStyle = {};
            this.forecastOptions['series'][sIndex].markLine.data[0].label = {};
            this.forecastOptions['series'][sIndex].markLine.data[0].label.formatter = '';
            this.forecastOptions['series'][sIndex].markLine.data[0].lineStyle.color = this.fcColor[kIndex % 3][mIndex % 4];
            // 设置默认预测的markPoint
            this.forecastOptions['series'][sIndex].markPoint.data = [];
            this.forecastOptions['series'][sIndex].markPoint.data[0] = {};
            this.forecastOptions['series'][sIndex].markPoint.data[0].name = '预';
            this.forecastOptions['series'][sIndex].markPoint.data[0].coord = [this.defaultForecast[kIndex][0].timeLine[0], Math.ceil(this.maxYValue)];
            this.forecastOptions['series'][sIndex].markPoint.data[0].symbolSize = 26;
            this.forecastOptions['series'][sIndex].markPoint.data[0].itemStyle = {};
            this.forecastOptions['series'][sIndex].markPoint.data[0].itemStyle.color = '#fff';
            this.forecastOptions['series'][sIndex].markPoint.data[0].label = {};
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.show = true;
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.color = '#fff';
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.formatter = '预';
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.backgroundColor = this.fcColor[kIndex % 3][mIndex % 4];
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.padding = 4;
            this.forecastOptions['series'][sIndex].markPoint.data[0].label.borderRadius = 20;
            let nIndex = -1;
            this.malfunctionOptions['series'].map((item, key) => {
                if (line.name === item.name) {
                    nIndex = key;
                }
                if (item['lineStyle'].linePn === pn) {
                    if (item['itemStyle'].normal.color.lineType === 'keDiagramLineType_ra') {
                        item['markLine'] = {};
                        item['markPoint'] = {};
                    }
                }
            });
            const mfNum = this.mlCheckBox[kIndex].pnCont.filter((item) => {
                return line.name === item.lineCode;
            });
            lenovoPublic.selfLog2(() => console.log(nIndex, mfNum, 'all'));

            // 需求率markLine
            this.malfunctionOptions['series'][nIndex].markLine.type = 'dotted';
            this.malfunctionOptions['series'][nIndex].markLine.data = [];
            this.malfunctionOptions['series'][nIndex].markLine.data[0] = {};
            this.malfunctionOptions['series'][nIndex].markLine.data[0].name = '真实';
            this.malfunctionOptions['series'][nIndex].markLine.data[0].xAxis = this.defaultForecast[kIndex][1].timeLine[0];
            this.malfunctionOptions['series'][nIndex].markLine.data[0].symbol = 'none';
            this.malfunctionOptions['series'][nIndex].markLine.data[0].lineStyle = {};
            this.malfunctionOptions['series'][nIndex].markLine.data[0].label = {};
            this.malfunctionOptions['series'][nIndex].markLine.data[0].label.formatter = '';
            this.malfunctionOptions['series'][nIndex].markLine.data[0].lineStyle.color = this.mfColor[kIndex % 3][mfNum[0].num % 3];
            // 设置需求率的markPoint
            this.malfunctionOptions['series'][nIndex].markPoint.data = [];
            this.malfunctionOptions['series'][nIndex].markPoint.data[0] = {};
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].name = '需求真';
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].coord = [this.defaultForecast[kIndex][1].timeLine[0], this.maxMfYValue];
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].symbolSize = 26;
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].itemStyle = {};
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].itemStyle.color = '#fff';
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label = {};
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.show = true;
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.color = '#fff';
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.formatter = '预';
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.backgroundColor = this.mfColor[kIndex % 3][mfNum[0].num % 3];
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.padding = 4;
            this.malfunctionOptions['series'][nIndex].markPoint.data[0].label.borderRadius = 20;
        }
        console.log(this.nowTime, this.forecastOptions, this.malfunctionOptions);
    }

    // 鼠标移入 出现markPoint的显示框
    onChartEventOver(event) {
        lenovoPublic.selfLog2(() => console.log(event));

        if (event.componentType === 'markPoint' && event.data.name === '预') {
            this.markPoint_name = '预测';
            // const line = this.edit_allData.find((item) => item.lineParmUnionCode === event.seriesName && item.lineType === 'keDiagramLineType_long_term_pred');
            this.fc_markPoint_time = event.data.coord[0].slice(0, 7);
            $('.fcMarkpoint').show();
            $('.fcMarkpoint').css({ 'top': -this.fcHeight + 36, 'left': event.event.offsetX - 110 });
        } else if (event.componentType === 'markPoint' && event.data.name === '今') {
            this.markPoint_name = '当前';
            this.fc_markPoint_time = this.todayTime;
            $('.fcMarkpoint').show();
            $('.fcMarkpoint').css({ 'top': -this.fcHeight + 36, 'left': event.event.offsetX - 110 });
        } else if (event.componentType === 'markPoint' && event.data.name === '需求真') {
            $('.mfMarkpoint').show();
            $('.mfMarkpoint').css({ 'top': -this.fcHeight + 36, 'left': event.event.offsetX - 110 });
            this.markPoint_name = '预测';
            this.fc_markPoint_time = event.data.coord[0].slice(0, 7);
        } else if (event.componentType === 'markPoint' && event.data.name === '需求今') {
            $('.mfMarkpoint').show();
            $('.mfMarkpoint').css({ 'top': -this.fcHeight + 36, 'left': event.event.offsetX - 110 });
            this.markPoint_name = '当前';
            this.fc_markPoint_time = this.todayTime;
        }
    }

    // 鼠标移出  markPoint提示框消失
    onChartEventOut(event) {
        if (event) {
            setTimeout(() => {
                $('.fcMarkpoint').hide();
                $('.mfMarkpoint').hide();
            }, 500);
        }
    }

    // 定位当前默认预测曲线框的位置
    positionNowFc(index) {
        clearTimeout(this.setTimeoutArr['10']);
        this.setTimeoutArr['10'] = setTimeout(() => {
            const noNull = this.forecastOptions['series'][index].data.filter(a => a);
            let noNullIndex: any = -1;
            for (const [key, item] of Object.entries(this.forecastOptions['series'][index].data)) {
                if (item) {
                    noNullIndex = Number(key);
                    break;
                }
            }
            const nowFcX = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, this.timeXfc[noNullIndex]);
            const nowFcY = this.echartsInstance_fc.convertToPixel({ yAxisId: 'ForecastY' }, noNull[0]);
            $('.nowFcLocation').css({ 'left': nowFcX, 'top': nowFcY - 38 + 'px', 'background': this.forecastOptions['series'][index].lineStyle.color });
        }, 10);
    }

    // 定位编辑中曲线框的位置
    positionNowBj(data) {
        clearTimeout(this.setTimeoutArr['11']);
        this.setTimeoutArr['11'] = setTimeout(() => {
            $('.nowBjLocation').show();
            const nowFcX = this.echartsInstance_fc.convertToPixel({ xAxisId: 'Forecast' }, data[0].timeLine[0]);
            const nowFcY = this.echartsInstance_fc.convertToPixel({ yAxisId: 'ForecastY' }, data[0].value[0]);
            $('.nowBjLocation').css({ 'left': nowFcX, 'top': nowFcY - 38 + 'px' });
        }, 10);
    }


    /***
     * 下拉框选择默认预测曲线
     * param 为数组
     * 0：content  1:index  2:id
     *  */
    getFcContent(param) {
        // lenovoPublic.selfLog2(()=>console.log(param, '接收的值'));
        let index = -1;
        let kIndex = -1;
        for (const [key, item] of Object.entries(this.fcCheckBox)) {
            if (item['pnNum'] === param[3]) {
                index = Number(key);
            }
        }
        for (const [key, item] of Object.entries(this.fcCheckBox[index].pnCont)) {
            if (item['content'] === param[0]) {
                kIndex = Number(key);
            }
        }
        this.def_fcArr = { // 设置默认预测曲线的参数
            pn: param[3],
            id: param[2],
            value: param[0],
            kIndex: index,
            mIndex: kIndex
        };
        this.defForecastLine(this.def_fcArr);
    }

    // 图表的双击事件
    dbClickFc(event) {
        // lenovoPublic.selfLog2(()=>console.log(event));
        if (event.seriesName.includes('在保量') || event.seriesName.includes('需求量') || event.seriesName.includes('需求率')) {
            return;
        }
        // this.findFcNum(event.seriesName);
    }

    // 根据预测线的名称获取下标
    findFcNum(name, index?, id?) {
        let kIndex = -1;
        let mIndex = -1;
        for (const [key, item] of Object.entries(this.fcCheckBox)) {
            for (const [j, value] of Object.entries(this.fcCheckBox[key].pnCont)) {
                if (value['id'] === id) {
                    kIndex = Number(key);
                    mIndex = Number(j);
                }
            }
        }
        this.def_fcArr = { // 设置默认预测曲线的参数
            pn: this.fcCheckBox[kIndex].pnNum,
            id: id,
            value: name,
            kIndex: kIndex,
            mIndex: mIndex
        };
        this.defForecastLine(this.def_fcArr);
    }


    // 图表的滚轮事件
    dataZoomFc(event) {
        if (event.batch) {
            // 获取当前滚动的起始和结束时间
            const indexS = Math.round(event.batch[0].start / (100 / this.timeXfc.length));
            const indexE = Math.round(event.batch[0].end / (100 / this.timeXfc.length));
            // if (nn === 'mf') {
            //     // 重新定义起始和结束时间及下拉数据
            //     this.mfStartNum = this.timeXfc[indexS] ? this.timeXfc[indexS].slice(0, 7) : this.timeXfc[0].slice(0, 7);
            //     this.mfEndNum = this.timeXfc[indexE] ? this.timeXfc[indexE].slice(0, 7) : this.timeXfc[this.timeXfc.length - 1].slice(0, 7);
            //     this.defTimeList(this.timeData, this.mfStartNum, this.mfEndNum, nn);
            // } else {
            // 重新定义起始和结束时间及下拉数据
            this.startNum = this.timeXfc[indexS] ? this.timeXfc[indexS].slice(0, 7) : this.timeXfc[0].slice(0, 7);
            this.endNum = this.timeXfc[indexE] ? this.timeXfc[indexE].slice(0, 7) : this.timeXfc[this.timeXfc.length - 1].slice(0, 7);
            this.defTimeList(this.timeData, this.startNum, this.endNum);
            this.echartsInstance_fc.dispatchAction({
                type: 'dataZoom',
                start: event.batch[0].start,
                end: event.batch[0].end
            });
            this.echartsInstance_mf.dispatchAction({
                type: 'dataZoom',
                start: event.batch[0].start,
                end: event.batch[0].end
            });
            // 计算X轴在滚动中的长度
            const xAxisLength = this.timeXfc.length - indexS - (this.timeXfc.length - indexE);

            this.echartsInstance_fc.setOption({
                xAxis: [{
                    id: 'Forecast',
                    axisLabel: {
                        interval: (index, value) => {
                            // // lenovoPublic.selfLog2(()=>console.log(index, value, xAxisLength));
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
                            // // lenovoPublic.selfLog2(()=>console.log(index, value, xAxisLength));
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
        }

    }


    ngOnDestroy(): void {
        // tslint:disable-next-line:forin
        for (const i in this.setTimeoutArr) {
            clearTimeout(this.setTimeoutArr[i]);
        }
        this.predictionShow$.unsubscribe();
        this.getComparisonDiagramParamterSubject$.unsubscribe();
    }

    // 编辑状态下绘制图表
    trimBj(value, bol, ensure, index, pn, oneIndex?, twoIndex?, name?, lines?, mfName?) {
        // lenovoPublic.selfLog2(()=>console.log(value, bol, ensure, index, pn, name, lines));
        if (value === '编辑') {
            // 设置控制线是否显示的数组
            this.fcCheckBox[index].pnCont.push({
                content: '编辑中曲线',
                id: '编辑中曲线',
                isShow: true,
                num: this.fcCheckBox[index].pnCont.length,
                save: bol,
                ensure: ensure,
                legendName: '编辑中曲线',
                lineCode: '编辑中曲线',
                lineType: this.defaultForecast[index][0].lineType
            });
            this.mlCheckBox[index].pnCont.push({
                content: `编辑中需求率`,
                id: `编辑中需求率`,
                isShow: true,
                num: this.mlCheckBox[index].pnCont.length,
                legendName: '编辑中曲线',
                lineCode: '编辑中曲线',
                lineType: this.defaultForecast[index][1].lineType
            });
            this.forecastOptions['series'].push({
                id: '编辑中曲线',
                name: '编辑中曲线',
                type: 'line',
                smooth: true,
                symbol: 'none',
                showSymbol: false, // 是否显示symbol
                lineStyle: {
                    type: 'dotted',
                    color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4],
                    width: 8,
                    opacity: 0.8,
                    linePn: pn,
                    shadowBlur: 0,
                    shadowColor: 'rgba(10,29,30,0)',
                    shadowOffsetY: 0,
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
                                offset: 0, color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: '编辑中曲线',
                            lineType: this.defaultForecast[index][0].lineType
                        },
                        borderColor: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4],
                        borderWidth: 12
                    }
                },
                markPoint: {},
                markLine: {},
                connectNulls: true,
                data: this.opt([], 0, this.defaultForecast[index])
            });
            this.malfunctionOptions['series'].push({
                id: `编辑中需求率`,
                name: `编辑中曲线`,
                type: 'line',
                smooth: true,
                symbol: 'none',
                showSymbol: false, // 是否显示symbol
                lineStyle: {
                    type: 'dotted',
                    color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3],
                    width: 2,
                    opacity: 0.8,
                    linePn: pn,
                    shadowBlur: 0,
                    shadowColor: 'rgba(10,29,30,0)',
                    shadowOffsetY: 0,
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
                                offset: 0, color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: '编辑中需求率',
                            lineType: this.defaultForecast[index][1].lineType
                        },
                        borderColor: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3],
                        borderWidth: 6
                    }
                },
                connectNulls: true,
                data: this.opt([], 1, this.defaultForecast[index])
            });
        } else if (value === '计算') {
            this.fcCheckBox[index].pnCont.push({
                content: name,
                isShow: true,
                num: this.fcCheckBox[index].pnCont.length,
                lineCode: lines[oneIndex].lineParmUnionCode,
                save: bol,
                id: lines[oneIndex].lineId,
                ensure: lines[oneIndex].bUsed,
                legendName: lines[oneIndex].lineParmUnionCode,
                lineType: lines[oneIndex].lineType
            });
            this.forecastOptions['series'].push({
                // name: '故障',
                id: lines[oneIndex].lineId,
                name: lines[oneIndex].lineParmUnionCode,
                type: 'line',
                smooth: false,
                symbol: 'none',
                showSymbol: false, // 是否显示symbol
                lineStyle: {
                    color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4],
                    width: 2,
                    opacity: 0.7,
                    linePn: pn,
                    shadowBlur: 0,
                    shadowColor: 'rgba(10,29,30,0)',
                    shadowOffsetY: 0,
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
                                offset: 0, color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: name,
                            lineType: lines[0].lineType
                        },
                        borderColor: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4],
                        borderWidth: 8
                    }
                },
                markPoint: {},
                markLine: {},
                connectNulls: true,
                data: this.opt([], oneIndex, lines)
            });


            this.mlCheckBox[index].pnCont.push({
                content: `${name}需求率`,
                isShow: true,
                num: this.mlCheckBox[index].pnCont.length,
                lineCode: lines[twoIndex].lineParmUnionCode,
                id: lines[twoIndex].lineId,
                legendName: lines[twoIndex].lineParmUnionCode,
                lineType: lines[twoIndex].lineType
            });
            this.malfunctionOptions['series'].push({
                // name: '故障',
                id: lines[twoIndex].lineId,
                name: lines[twoIndex].lineParmUnionCode,
                type: 'line',
                smooth: false,
                symbol: 'none',
                showSymbol: false, // 是否显示symbol
                lineStyle: {
                    color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3],
                    width: 2,
                    opacity: 0.7,
                    linePn: pn,
                    shadowBlur: 0,
                    shadowColor: 'rgba(10,29,30,0)',
                    shadowOffsetY: 0,
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
                                offset: 0, color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: `${name}需求率`,
                            lineType: lines[twoIndex].lineType
                        },
                        borderColor: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3],
                        borderWidth: 8
                    }
                },
                connectNulls: true,
                data: this.opt([], twoIndex, lines)
            });
        } else if (value === '保存') {
            this.fcCheckBox[index].pnCont.push({
                content: name,
                isShow: true,
                num: this.fcCheckBox[index].pnCont.length,
                lineCode: lines[oneIndex].lineParmUnionCode,
                save: bol,
                id: lines[oneIndex].lineId,
                ensure: lines[oneIndex].bUsed,
                legendName: lines[oneIndex].lineParmUnionCode,
                lineType: lines[oneIndex].lineType
            });
            this.forecastOptions['series'].push({
                // name: '故障',
                id: lines[oneIndex].lineId,
                name: lines[oneIndex].lineParmUnionCode,
                type: 'line',
                smooth: false,
                symbol: 'none',
                showSymbol: false, // 是否显示symbol
                lineStyle: {
                    color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4],
                    width: 2,
                    opacity: 0.7,
                    linePn: pn,
                    shadowBlur: 0,
                    shadowColor: 'rgba(10,29,30,0)',
                    shadowOffsetY: 0,
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
                                offset: 0, color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: name,
                            lineType: lines[oneIndex].lineType
                        },
                        borderColor: this.fcColor[index][(this.fcCheckBox[index].pnCont.length - 1) % 4],
                        borderWidth: 8
                    }
                },
                markPoint: {},
                markLine: {},
                connectNulls: true,
                data: this.opt([], oneIndex, lines)
            });


            this.mlCheckBox[index].pnCont.push({
                content: mfName,
                isShow: true,
                num: this.mlCheckBox[index].pnCont.length,
                lineCode: lines[twoIndex].lineParmUnionCode,
                id: lines[twoIndex].lineId,
                legendName: lines[twoIndex].lineParmUnionCode,
                lineType: lines[twoIndex].lineType
            });
            this.malfunctionOptions['series'].push({
                // name: '故障',
                id: lines[twoIndex].lineId,
                name: lines[twoIndex].lineParmUnionCode,
                type: 'line',
                smooth: false,
                symbol: 'none',
                showSymbol: false, // 是否显示symbol
                lineStyle: {
                    color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3],
                    width: 2,
                    opacity: 0.7,
                    linePn: pn,
                    shadowBlur: 0,
                    shadowColor: 'rgba(10,29,30,0)',
                    shadowOffsetY: 0,
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
                                offset: 0, color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3] // 0% 处的颜色
                            }, {
                                offset: 1, color: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3] // 100% 处的颜色
                            }],
                            global: false, // 缺省为 false
                            onlyName: mfName,
                            lineType: lines[twoIndex].lineType
                        },
                        borderColor: this.mfColor[index][(this.mlCheckBox[index].pnCont.length - 1) % 3],
                        borderWidth: 8
                    }
                },
                connectNulls: true,
                data: this.opt([], twoIndex, lines)
            });
        }

    }

    // 点击编辑区域状态的 编辑按钮时执行操作
    setEditData(param) {
        // lenovoPublic.selfLog2(()=>console.log(param, '编辑状态下'));
        clearTimeout(this.setTimeoutArr['12']);
        // 设置控制线是否显示的数组
        // this.setTimeoutArr['12'] = setTimeout(() => {
        //     this.clickFclegend(0, 0);
        // }, 1);
        this.trimBj('编辑', false, false, param[1], this.fcCheckBox[param[1]].pnNum);
        this.fcCheckBox[param[1]].long = 0;
        // this.forecastOptions = Object.assign({}, this.forecastOptions);
        // this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        this.defForecastLine(this.def_fcArr);
        this.positionNowBj(this.defaultForecast[param[1]]);
    }


    // 点击编辑区域状态的 计算按钮时执行操作
    editCalculate(param) {
        clearTimeout(this.setTimeoutArr['13']);
        // lenovoPublic.selfLog2(()=>console.log(param, 'dfdfeg', this.forecastOptions['series']));
        let lineOne = -1, lineTwo = -1;
        param[0].data.diagramLines.find((item, index) => {
            if (item.lineType === 'keDiagramLineType_long_term_pred') {
                lineOne = index;
            } else {
                lineTwo = index;
            }
        });
        // 判断是否有相同曲线
        for (const item of this.edit_allData) {
            if (param[0].data.diagramLines[lineOne].lineParmUnionCode === item.lineParmUnionCode) {
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
        // 如果没有相同曲线 则绘制图表
        for (const item of param[0].data.diagramLines) {
            this.edit_allData.push(item);
        }

        this.countFcY(); // 获取Y轴的最大值 和this.num
        this.countMfY();
        this.againFcOption(this.ibMaxNum, this.maxYValue, this.maxMfYValue);
        // lenovoPublic.selfLog2(()=>console.log(this.maxYValue, this.ibMaxNum));
        const bjLine = this.fcCheckBox[param[1]].pnCont.some((item) => {
            return item.content === '编辑中曲线';
        });
        this.fcCheckBox[param[1]].long++;
        if (bjLine) {
            this.fcCheckBox[param[1]].pnCont.splice(this.fcCheckBox[param[1]].pnCont.length - 1, 1);
            this.mlCheckBox[param[1]].pnCont.splice(this.mlCheckBox[param[1]].pnCont.length - 1, 1);
            this.forecastOptions['series'].splice(this.forecastOptions['series'].length - 1, 1);
            this.malfunctionOptions['series'].splice(this.malfunctionOptions['series'].length - 1, 1);
        }
        this.forecastName_length = this.fcCheckBox[param[1]].pnCont.length - 2;
        this.trimBj('计算', false, param[0].data.diagramLines[lineOne].bUsed, param[1], this.fcCheckBox[param[1]].pnNum, lineOne, lineTwo, `预测${this.forecastName_length}`, param[0].data.diagramLines);
        this.placehole_name[param[1]] = `预测${this.forecastName_length + 1}`;
        // 计算时添加下拉列表默认选择曲线
        // 发送默认预测曲线的名称和颜色
        this.sendDefaultFc[param[1]].selectArr.push({
            'color': this.fcColor[param[1]][(this.fcCheckBox[param[1]].pnCont.length - 1) % 4],
            value: `预测${this.forecastName_length}`,
            id: param[0].data.diagramLines[lineOne].lineId
        });
        this.fcStartTime[param[1]] = {
            data: param[0].data.diagramLines[lineOne].forcastParams,
            index: param[1]
        };
        this.default_forecastName.emit(this.sendDefaultFc[param[1]]); // 发送下拉选择框的内容
        this.fcLineOne_time.emit(this.fcStartTime[param[1]]); // 发送算法参数
        // lenovoPublic.selfLog2(()=>console.log(this.sendDefaultFc[param[1]].selectArr, this.fcStartTime[param[1]]));

        this.def_fcArr = { // 设置默认预测曲线的参数
            pn: this.fcCheckBox[param[1]].pnNum,
            id: param[0].data.diagramLines[lineOne].lineId,
            value: `预测${this.forecastName_length}`,
            kIndex: param[1],
            mIndex: this.fcCheckBox[param[1]].pnCont.length - 1
        };

        // this.forecastOptions = Object.assign({}, this.forecastOptions);
        this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        // lenovoPublic.selfLog2(()=>console.log(this.forecastOptions['series'], '计算中', this.forecastOptions));
        // 编辑预测线起名时添加数字区分多条预测线
        this.positionNowBj(param[0].data.diagramLines);
        this.setTimeoutArr['13'] = setTimeout(() => {
            // 设置默认预测曲线
            this.defForecastLine(this.def_fcArr); // 设置默认预测曲线

            this.linesTen();
        }, 10);
    }

    // 点击编辑区域状态的 保存按钮时执行操作
    editSaveLines(param) {
        // lenovoPublic.selfLog2(()=>console.log(param, '保存时', this.mlCheckBox, this.edit_allData));
        clearTimeout(this.setTimeoutArr['13']);
        let lineOne = -1, lineTwo = -1;
        param[0].lines.find((item, index) => {
            if (item.lineType === 'keDiagramLineType_long_term_pred') {
                lineOne = index;
            } else {
                lineTwo = index;
            }
        });
        // 判断是否有相同曲线
        for (const item of this.save_allData) {
            if (param[0].lines[lineOne].lineParmUnionCode === item.lineParmUnionCode) {
                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: `已有相同曲线`,
                        style: {}
                    }]
                }, 'alert');
                // alert('已有相同曲线');
                const isBjLine = this.forecastOptions['series'].find((series) => series.itemStyle.normal.color.onlyName.includes('编辑中曲线'));
                if (isBjLine) {
                    this.fcCheckBox[param[1]].pnCont.splice(this.fcCheckBox[param[1]].pnCont.length - 1, 1);
                    this.mlCheckBox[param[1]].pnCont.splice(this.mlCheckBox[param[1]].pnCont.length - 1, 1);
                    this.forecastOptions['series'].splice(this.forecastOptions['series'].length - 1, 1);
                    this.malfunctionOptions['series'].splice(this.malfunctionOptions['series'].length - 1, 1);
                }
                return;
            }
        }

        const lineFind = this.edit_allData.find((items) => items.lineId === param[0].lines[lineOne].lineId);
        const series_one = this.forecastOptions['series'].find((k) => k.id === param[0].lines[lineOne].lineId);
        const series_two = this.malfunctionOptions['series'].find((j) => j.id === param[0].lines[lineTwo].lineId);
        const fc_one = this.fcCheckBox[param[1]].pnCont.find((q) => q.id === param[0].lines[lineOne].lineId);
        const mf_one = this.mlCheckBox[param[1]].pnCont.find((p) => p.id === param[0].lines[lineTwo].lineId);
        // lenovoPublic.selfLog2(()=>console.log(lineFind, series_one, series_two, fc_one, mf_one));

        if (lineFind) { // 只保存
            for (const item of param[0].lines) {
                this.save_allData.push(item);
            }
            // lenovoPublic.selfLog2(()=>console.log('执行保存中的计算'));
            [fc_one.content, fc_one.save, fc_one.ensure] = [param[0].lines[lineOne].name, true, param[0].isRecordLtbTime];
            mf_one.content = param[0].lines[lineTwo].name;
            series_one.itemStyle.normal.color.onlyName = param[0].lines[lineOne].name;
            series_two.itemStyle.normal.color.onlyName = param[0].lines[lineTwo].name;
            let fc_index = -1;
            for (const [key, item] of Object.entries(this.fcCheckBox[param[1]].pnCont)) {
                if (fc_one.id === item['id']) {
                    fc_index = Number(key);
                }
            }
            const fcLineId = this.sendDefaultFc[param[1]].selectArr.find((item) => item.id === param[0].lines[lineOne].lineId);
            if (fcLineId) {
                fcLineId.value = param[0].lines[lineOne].name;
            } else {
                // 发送默认预测曲线的名称和颜色
                this.sendDefaultFc[param[1]].selectArr.push({
                    'color': this.fcColor[param[1]][fc_index % 4],
                    value: param[0].lines[lineOne].name,
                    id: param[0].lines[lineOne].lineId
                });
            }

            this.def_fcArr = { // 设置默认预测曲线的参数
                pn: this.fcCheckBox[param[1]].pnNum,
                id: param[0].lines[lineOne].lineId,
                value: param[0].lines[lineOne].name,
                kIndex: param[1],
                mIndex: fc_index
            };
            this.changeParentData.emit({ type: 'setDefForecastLine', data: [{ allData: this.save_allData, lineName: param[0].lines[lineOne].name, kIndex: param[1], mIndex: fc_index, lineId: param[0].lines[lineOne].lineId, defaultForecast: param[0].lines }] }); // 点击默认预测曲线时修改数据方法
        } else { // 计算并保存
            // lenovoPublic.selfLog2(()=>console.log('执行保存中保存'));
            for (const item of param[0].lines) {
                this.edit_allData.push(item);
                this.save_allData.push(item);
            }

            this.countFcY(); // 获取Y轴的最大值 和this.num
            this.countMfY();
            this.againFcOption(this.ibMaxNum, this.maxYValue, this.maxMfYValue);

            // 发送默认预测曲线的名称和颜色
            this.sendDefaultFc[param[1]].selectArr.push({
                'color': this.fcColor[param[1]][(this.fcCheckBox[param[1]].pnCont.length - 1) % 4],
                value: param[0].lines[lineOne].name,
                id: param[0].lines[lineOne].lineId
            });
            const bjLine = this.fcCheckBox[param[1]].pnCont.some((item) => {
                return item.content === '编辑中曲线';
            });
            this.fcCheckBox[param[1]].long++;
            if (bjLine) {
                this.fcCheckBox[param[1]].pnCont.splice(this.fcCheckBox[param[1]].pnCont.length - 1, 1);
                this.mlCheckBox[param[1]].pnCont.splice(this.mlCheckBox[param[1]].pnCont.length - 1, 1);
                this.forecastOptions['series'].splice(this.forecastOptions['series'].length - 1, 1);
                this.malfunctionOptions['series'].splice(this.malfunctionOptions['series'].length - 1, 1);
            }
            this.trimBj('保存', true, param[0].isRecordLtbTime, param[1], this.fcCheckBox[param[1]].pnNum, lineOne, lineTwo, param[0].lines[lineOne].name, param[0].lines, param[0].lines[lineTwo].name);
            this.def_fcArr = { // 设置默认预测曲线的参数
                pn: this.fcCheckBox[param[1]].pnNum,
                id: param[0].lines[lineOne].lineId,
                value: param[0].lines[lineOne].name,
                kIndex: param[1],
                mIndex: this.fcCheckBox[param[1]].pnCont.length - 1
            };
            this.changeParentData.emit({ type: 'setDefForecastLine', data: [{ allData: this.save_allData, lineName: param[0].lines[lineOne].name, kIndex: param[1], mIndex: this.fcCheckBox[param[1]].pnCont.length - 1, lineId: param[0].lines[lineOne].lineId, defaultForecast: param[0].lines }] }); // 点击默认预测曲线时修改数据方法
        }
        // 确认使用调用接口
        if (param[0].isRecordLtbTime) {
            const arr = [];
            this.last_time_buy = param[0].lines[lineOne].timeLine[0];
            arr[0] = true;
            arr[1] = 'keDiagramLineType_long_term_pred';
            arr[2] = param[0].lines[lineOne].timeLine;
            arr[3] = param[1];
            this.lastTimeBuyBUsed.push(...arr);
            this.updataEnsure(param[0].lines[lineOne].lineId);
        }
        $('.nowBjLocation').hide();
        this.fcStartTime[param[1]] = {
            data: param[0].lines[lineOne].forcastParams,
            index: param[1]
        };
        this.default_forecastName.emit(this.sendDefaultFc[param[1]]); // 发送下拉选择框的内容
        this.fcLineOne_time.emit(this.fcStartTime[param[1]]); // 发送算法参数
        this.defaultForecast[param[1]][0] = param[0].lines[lineOne]; // 保存当前默认预测线的数据
        this.defaultForecast[param[1]][1] = param[0].lines[lineTwo]; // 保存当前默认预测线的数据

        this.forecastOptions = Object.assign({}, this.forecastOptions);
        this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        this.setTimeoutArr['13'] = setTimeout(() => {
            // 设置默认预测曲线
            this.defForecastLine(this.def_fcArr); // 设置默认预测曲线

            this.linesTen();
        }, 10);
    }


    // 计算曲线的重新设置Y轴的最大值和ib的倍数
    againFcOption(ibNum, maxFcNum, maxMfNum) {
        this.forecastOptions['title'].text = `在保量(/${ibNum})·需求量·预测`;
        this.forecastOptions['yAxis'][0].max = Math.ceil(maxFcNum);
        this.forecastOptions['yAxis'][0].interval = (Math.ceil(maxFcNum) - 0) / 5;
        this.forecastOptions['yAxis'][1].max = maxMfNum;
        this.forecastOptions['yAxis'][1].interval = (maxMfNum - 0) / 5;
        this.malfunctionOptions['yAxis'][0].max = maxMfNum;
        this.malfunctionOptions['yAxis'][0].interval = (maxMfNum - 0) / 5;
        const fcLine = this.forecastOptions['series'].find((item) => item.itemStyle.normal.color.lineType === 'keDiagramLineType_usage');
        const mfLine = this.malfunctionOptions['series'].find((item) => item.itemStyle.normal.color.markName === '需求今');
        lenovoPublic.selfLog2(() => console.log(fcLine, mfLine, this.malfunctionOptions, this.forecastOptions['series']));

        fcLine.markPoint.data[0].coord = [this.nowTime, Math.ceil(maxFcNum)];
        mfLine.markPoint.data[0].coord = [this.nowTime, maxMfNum];
    }

    // 设置新增预测线的配置
    setLineOption(dataObj, id, name, data, index) {
        // lenovoPublic.selfLog2(()=>console.log(dataObj, 'fgdsdfgf'));
        dataObj.type = 'line';
        dataObj.id = id;
        dataObj.name = id;
        dataObj.itemStyle.normal.color.onlyName = name;
        dataObj.data = this.opt([], index, data);
        dataObj.lineStyle.type = 'solid';
        // dataObj.lineStyle.width = 6;
    }

    // 取消编辑事件
    cacelEdit(param) {
        clearTimeout(this.setTimeoutArr['14']);
        $('.nowBjLocation').hide();
        const isBjLine = this.forecastOptions['series'].find((item) => item.itemStyle.normal.color.onlyName.includes('编辑中曲线'));
        if (!isBjLine) {
            // 如果没有编辑中曲线的名称，则不删除曲线
            return;
        }

        // 预测线
        this.forecastOptions['series'].splice(this.forecastOptions['series'].length - 1, 1);
        this.fcCheckBox[param[1]].pnCont.splice(this.fcCheckBox[param[1]].pnCont.length - 1, 1);

        this.malfunctionOptions['series'].splice(this.malfunctionOptions['series'].length - 1, 1);
        this.mlCheckBox[param[1]].pnCont.splice(this.mlCheckBox[param[1]].pnCont.length - 1, 1);

        this.clickFclegend(0, 0);
        // 需求率
        this.forecastOptions = Object.assign({}, this.forecastOptions);
        this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);

        this.setTimeoutArr['14'] = setTimeout(() => {
            // this.clickFclegend(0, 0);
        }, 10);
    }

    // 曲线超过10根弹窗提醒
    linesTen() {
        if (this.forecastOptions['series'].length > 10) {
            $('.exceedTenLine').show();
        } else if (this.forecastOptions['series'].length > 15) {
            $('.exceedTenLine').show();
        } else if (this.forecastOptions['series'].length > 20) {
            $('.exceedTenLine').show();
        } else if (this.forecastOptions['series'].length > 25) {
            $('.exceedTenLine').show();
        } else if (this.forecastOptions['series'].length > 30) {
            $('.exceedTenLine').show();
        }
    }

    // 超过10根弹窗消失
    useIsYes() {
        $('.exceedTenLine').hide();
    }


    // 鼠标划入历史数据时进行操作
    public hightLightDiagram() {
        // lenovoPublic.selfLog2(()=>console.log('鼠标划入历史数据时进行操作', 123333333));
    }

    // tslint:disable-next-line:member-ordering
    fcLines;
    // tslint:disable-next-line:member-ordering
    mfLine;
    // 鼠标划上参数面板时高亮曲线等操作
    private diagramParameterMouseenter(param) {
        this.getOptFc = this.echartsInstance_fc.getOption();
        this.getOptMf = this.echartsInstance_mf.getOption();

        this.fcLines = this.forecastOptions['series'].filter((item) => {
            if (item.lineStyle.linePn === param.btnList) {
                return item;
            }
        });
        this.mfLine = this.malfunctionOptions['series'].filter((item) => {
            if (item.lineStyle.linePn === param.btnList) {
                return item;
            }
        });
        // const lines = [...fcLines, ...mfLine];
        // lenovoPublic.selfLog2(()=>console.log(param, 'diagramParameterMouseenter', this.forecastOptions));
        const echartsInstance_fcSeries = [];

        for (const item of this.fcLines) {
            echartsInstance_fcSeries.push({
                name: item.name,
                lineStyle: {
                    width: 8,
                    shadowBlur: 10,
                    shadowColor: 'rgba(10,29,30,0.63)',
                    shadowOffsetY: 4,
                    // opacity: 0.56
                },
            });
        }
        this.echartsInstance_fc.setOption({
            series: echartsInstance_fcSeries
        });
        const echartsInstance_mfSeries = [];
        for (const item of this.mfLine) {
            echartsInstance_mfSeries.push({
                name: item.name,
                lineStyle: {
                    width: 8,
                    shadowBlur: 10,
                    shadowColor: 'rgba(10,29,30,0.63)',
                    shadowOffsetY: 4,
                    // opacity: 0.56
                },
            });
        }
        this.echartsInstance_mf.setOption({
            series: echartsInstance_mfSeries
        });
    }
    private diagramParameterMouseLeave(param) {
        lenovoPublic.selfLog2(() => console.log(param, this.fcLines, this.mfLine));

        // // lenovoPublic.selfLog2(()=>console.log(item, 'diagramParameterMouseLeave'));
        clearTimeout(this.legendTimeout);
        // this.forecastOptions = Object.assign({}, this.forecastOptions);
        // this.malfunctionOptions = Object.assign({}, this.malfunctionOptions);
        // this.legendTimeout = setTimeout(() => {
        //     this.defForecastLine(this.def_fcArr);
        // }, 10);

        const echartsInstance_fcSeries = [];
        for (const item of this.fcLines) {
            echartsInstance_fcSeries.push({
                name: item.name,
                lineStyle: item.lineStyle,
            });
        }
        this.echartsInstance_fc.setOption({
            series: echartsInstance_fcSeries
        });
        const echartsInstance_mfSeries = [];
        for (const item of this.mfLine) {
            echartsInstance_mfSeries.push({
                name: item.name,
                lineStyle: item.lineStyle,
            });
        }
        this.echartsInstance_mf.setOption({
            series: echartsInstance_mfSeries
        });
        lenovoPublic.selfLog2(() => console.log(this.fcLines, this.mfLine, this.getOptFc, this.getOptMf));
    }

    // 向diagramParameter发送数据
    private setShowDataToDiagramParameter({ type, data, isPush }) {
        // lenovoPublic.selfLog2(()=>console.log('woshi show wo fa songle'));
        this.updataSubjectService.emitComparisonDiagramParamterInfo({ type, data, isPush });
        // this.setShowDataToDiagramParameterEmit.emit({ type, data, isPush });
    }

    // tslint:disable-next-line:member-ordering
    getComparisonDiagramParamterSubject$;
    // 接收parameter 发送过来的数据
    private getDiagramData() {
        if (!this.getComparisonDiagramParamterSubject$) {
            this.getComparisonDiagramParamterSubject$ = this.updataSubjectService.getComparisonDiagramShowSubject().subscribe((param) => {
                // lenovoPublic.selfLog2(()=>console.log('woshi show wo shoudaole'));
                const [type, data, isPush] = [param.type, param.data, param.isPush];
                if (isPush && type === 'updateSaveLinesPlaceHolder') {
                    this.setShowDataToDiagramParameter({ type: 'updateSaveLinesPlaceHolder', data: this.placehole_name[data.index], isPush: false });
                    return;
                }
                // // lenovoPublic.selfLog2(()=>console.log(param));
            });
        }
    }

    // 给保存线的弹框发送数据-----start
    private setChangeDataTosaveLinePop({ type, data }) {
        // // lenovoPublic.selfLog2(()=>console.log({ type, data }));
        this.setChangeDataTosaveLinePopEmit.emit({ type, data });
    }
    // 给保存线的弹框发送数据-----end
}
