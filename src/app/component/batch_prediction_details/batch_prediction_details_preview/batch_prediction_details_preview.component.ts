import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
declare const $: any, lenovoPublic;

@Component({
    selector: 'app-batch-prediction-details-preview',
    templateUrl: './batch_prediction_details_preview.component.html',
    styleUrls: ['./batch_prediction_details_preview.component.scss']
})

export class BatchPredictionDetailsPreviewComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() allData: any = {};
    chartOption = {};
    optionSeries = [];
    optionData;
    num;
    maxYValue: any = 0;
    maxMfYValue: any = 0;
    timeXfc;
    fcCheckBox = [];
    fcColor = ['rgba(34,188,6,0.83)', 'rgba(2,128,241,0.6)',
        'rgba(255,160,4,0.88)', '#00BEDB', 'rgba(236,0,6,0.7)'
    ];
    constructor() {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this.getData();
        lenovoPublic.selfLog2(() => console.log(this.allData, '展示图表区', this.chartOption));

    }

    getData() {
        this.optionData = this.allData;
        this.setOption(this.optionData);
    }

    /**
    * 计算this.num  在保量的倍数
    * this.maxYValue  fc图表左边Y轴的最大值
    *  */
    setMaxY(option) {
        const data = [];
        for (const item of option) {
            if (item.lineType.includes('keDiagramLineType_long_term_pred') || item.lineType.includes('keDiagramLineType_usage') || item.lineType.includes('keDiagramLineType_ib')) {
                data.push(item);
            }
        }

        const options = { 'usageLength': 0, 'ibLength': 0, 'forecastLength': 0 };
        for (const item of data) {
            // 取usage数据的最大值  需求量
            if (item.lineName === '需求量') {
                options.usageLength = Math.max.apply(null, item.value);
            }
            // 取ib数据的最大值  在保量
            if (item.lineName === '在保量') {
                options.ibLength = Math.max.apply(null, item.value);
            }
            if (item.lineName === '预测') {
                options.forecastLength = Math.max.apply(null, item.value);
            }
        }

        // 获取需求量 和预测的最大值
        const fcOrUsage = Math.max(options.forecastLength, options.usageLength);
        this.num = Math.ceil(options.ibLength / fcOrUsage); // 在保量的倍数

        for (const item of data) {
            if (item.lineName === '在保量') {
                if (Math.max.apply(null, item.value) / Number(this.num) > this.maxYValue) {
                    this.maxYValue = Math.max.apply(null, item.value) / Number(this.num);
                }
                continue;
            } else if (Math.max.apply(null, item.value) > this.maxYValue) {
                this.maxYValue = Math.max.apply(null, item.value);
            }
        }

        lenovoPublic.selfLog2(() => console.log(data, this.num, this.maxYValue, options.usageLength, options.ibLength, options.forecastLength));

    }

    // 设置需求率的Y轴
    setMfMaxY(option) {
        const data = [];
        for (const item of option) {
            if (item.lineType.includes('keDiagramLineType_ProductLineRa') || item.lineType.includes('keDiagramLineType_ra')) {
                data.push(item);
            }
        }

        for (const item of data) {
            const num = (Number(Math.max.apply(null, item.value)) * 100).toFixed(4);
            if (num > this.maxMfYValue) {
                this.maxMfYValue = num;
            }
        }
        lenovoPublic.selfLog2(() => console.log(this.maxMfYValue, 'dfdtrg', data));
    }

    /**
     * 设置图表的option
     */
    setOption(option) {
        // const allFcLines = {
        //     all: [], // 所有预测的线
        //     bUsed: [], // 预测中所有确认使用的线
        //     default: {}, // 要使用的默认预测线
        //     num: '0'
        // };
        // // 过滤所有预测的线
        // allFcLines.all = option.diagramLines.filter((item) => {
        //     if (item.lineType === 'keDiagramLineType_long_term_pred') {
        //         return item;
        //     }
        // });
        // // 过滤所有确认使用的线
        // allFcLines.bUsed = allFcLines.all.filter((item) => {
        //     return item['bUsed'];
        // });
        // if (allFcLines.bUsed.length > 0) { // 判断是否有确认使用的线
        //     allFcLines.bUsed.map((item) => {
        //         // 所有确认使用的线选择时间最靠近当前时间的
        //         if (item.forcastParams.last_time_buy > allFcLines.num) {
        //             allFcLines.default = item;
        //             allFcLines.num = item.forcastParams.last_time_buy;
        //         }
        //     });
        // } else {
        //     // 所有预测的线选择时间最靠近当前时间的
        //     allFcLines.all.map((item) => {
        //         if (item.forcastParams.last_time_buy > allFcLines.num) {
        //             allFcLines.default = item;
        //             allFcLines.num = item.forcastParams.last_time_buy;
        //         }
        //     });
        // }

        const allLines = [option.previewLineData];
        option.diagramLines.map((item, index) => {
            if (item.lineType !== 'keDiagramLineType_long_term_pred' && item.lineType !== 'keDiagramLineType_ra') {
                allLines.push(item);
            }
            if (item.lineParmUnionCode === allLines[0]['lineParmUnionCode'] && item.lineType === 'keDiagramLineType_ra') {
                allLines.push(item);
            }
        });

        lenovoPublic.selfLog2(() => console.log(allLines, '所有线', option));

        this.timeXfc = option.groupModel.baseTimeLine; // X轴时间
        this.setMaxY(allLines); // 左边Y轴最大值
        this.setMfMaxY(allLines); // 右边Y轴最大值
        for (let i = 0; i < allLines.length; i++) {
            this.fcCheckBox.push({
                content: allLines[i]['name'],
                id: allLines[i]['lineId'],
                num: i,
                isShow: false
            });
            this.setLineSeries(allLines[i], i, allLines);
        }
        const that = this;
        this.chartOption = {
            title: {
                text: `在保量（/${this.num}）/需求量/预测`,
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
                    // lenovoPublic.selfLog2(()=>console.log(params));
                    let res = '<p class="tooltip_fctimes tooltip_times">' + params[0].name + '</p><div class="tooltip_box">';
                    for (let i = 0; i < params.length; i++) {
                        if (params[i].value === '') {
                            params[i].value = '-';
                        } else {
                            if (params[i].color.onlyName.includes('需求率')) {
                                params[i].value = Number(params[i].value).toFixed(4) + '%';
                            } else if (params[i].color.onlyName.includes('在保量')) {
                                params[i].value = Number(params[i].value) * that.num;
                            } else if (params[i].color.onlyName.includes('需求量')) {
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
                // data: option.lineName, // 全部按钮名字
                textStyle: {    // 图例文字的样式
                    color: 'red',
                },
            },
            grid: {
                left: '1.5%',
                right: '2',
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
                data: option.groupModel.baseTimeLine
            }],
            yAxis: [{
                // name: '在保量/需求量/预测',
                id: 'ForecastL',
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
                        if (value < 0) {
                            return value.toFixed(2);
                        } else if (value >= 0) {
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
                // name: '在保量/需求量/预测',
                id: 'forecastR',
                type: 'value',
                show: true,
                nameGap: 8,
                nameLocation: 'end',
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
            series: this.optionSeries
        };
    }

    // 设置线的series
    setLineSeries(line, index, data) {
        let YIndex = 0;
        if (line.lineType === 'keDiagramLineType_ProductLineRa' || line.lineType === 'keDiagramLineType_ra') {
            YIndex = 1;
        }
        this.optionSeries.push({
            id: line.lineId,
            name: line.lineId,
            yAxisIndex: YIndex,
            type: 'line',
            smooth: true,
            symbol: 'none',
            showSymbol: false, // 是否显示symbol
            lineStyle: {
                color: this.fcColor[index % 5],
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
                            offset: 0, color: this.fcColor[index % 5] // 0% 处的颜色
                        }, {
                            offset: 1, color: this.fcColor[index % 5] // 100% 处的颜色
                        }],
                        global: false, // 缺省为 false
                        onlyName: line.name
                    },
                    borderColor: this.fcColor[index % 5],
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
        // 将每条线的data转为和时间轴一样长的数组
        for (let j = 0; j < optiondata[index].timeLine.length; j++) {
            for (let i = 0; i < this.timeXfc.length; i++) {
                if (this.timeXfc[i] === optiondata[index].timeLine[j]) {
                    // 处理ib的数据
                    if (optiondata[index].lineName.includes('在保量')) {
                        opts[i] = usageArr[j];

                    } else if (optiondata[index].lineName.includes('需求率')) {
                        opts[i] = Number(optiondata[index].value[j]) * 100;

                    } else {
                        opts[i] = optiondata[index].value[j];

                    }
                }
            }
        }
        return opts;
    }

    ngOnDestroy() { }
}
