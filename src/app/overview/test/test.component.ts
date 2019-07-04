import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { LenovoPublic } from '../../../lenovoPublic';
declare const $, lenovoPublic;
const symbolSize = 20;


const data = [{
    name: '01',
    value: 15,
    symbolSize: '0',
},
{
    name: '02',
    value: 50,
    symbolSize: '0',
},
{
    name: '03',
    value: 56.5,
    symbolSize: '20',
},
{
    name: '04',
    value: 46.5,
    symbolSize: '20',
},
{
    name: '05',
    value: 22.1,
    symbolSize: '20',
}];


@Component({
    selector: 'app-test',
    templateUrl: 'test.component.html',
    styleUrls: ['./test.component.scss']
})

export class TestComponent implements OnInit, AfterViewInit, OnDestroy {
    oldPosition = [];
    isHide = false; // 是否允许冒泡到document上后隐藏掉输入框
    saveIndex = 0; // 保存当前点击的是哪一个点
    isMouseDown = false; // 判断当前是否鼠标按下中
    dragW: number = 0; // 获取到当前拖拽元素的宽
    dragH: number = 0; // 获取到当前拖拽元素的高


    malfunctionOptions = {
        title: {
            text: 'Try Dragging these Points'
        },
        tooltip: {
            triggerOn: 'click|mousemove',
            formatter: function (params) {
                if (params.data[0]) {
                    return `<span>${params.value.toFixed(2)}</span>`;
                } else {
                    return `<span>${params.value.toFixed(2)}</span>`;
                }
            }
        },
        grid: {
        },
        xAxis: {
            type: 'category',
            axisLine: { onZero: false },
            data: [
                { value: '周一' },
                { value: '周二' },
                { value: '周三' },
                { value: '周四' },
                { value: '周五' },
                { value: '周六' },
                { value: '周七' },
            ]
        },
        yAxis: {
            min: -100,
            max: 200,
            type: 'value',
            axisLine: { onZero: false },
        },
        series: [
            {
                id: 'a',
                type: 'line',
                smooth: true,
                symbolSize: symbolSize,
                hoverAnimation: false,
                data: data
            },
            {
                id: 'b',
                type: 'line',
                smooth: true,
                symbolSize: symbolSize,
                hoverAnimation: false,
                // data: [20, -50, -56.5, -46.5, -22.1]
            },
        ]
    };
    constructor() { }
    ngOnInit() { }
    ngAfterViewInit(): void {
        this.afterviewInit();
    }

    /**
     * 初始化输入框的change事件
     */
    private afterviewInit() {
        this.dragW = document.querySelector('#draggable')['offsetWidth'] / 2; // 获取到当前拖拽元素的宽
        this.dragH = document.querySelector('#draggable')['offsetHeight'] / 2; // 获取到当前拖拽元素的高
        const vm = this;
        $('#changeRaNum').change(function (event) {
            console.log(event.target.value.length, 'change');
            if (event.target.value.length > 0) {
                data[vm.saveIndex]['value'] = Number(event.target.value);
                vm.echartsInstance_mf.setOption({
                    series: [{
                        id: 'a',
                        data: data
                    }]
                });
            }
        });
        document.addEventListener('click', this.changeRaNumWatchClick.bind(this, event));
        document.addEventListener('mouseup', this.changeRaNumWatchMouseup.bind(this));
    }

    /**
     * addEventListener 监听冒泡到document时是否隐藏显示出来的输入框
     * @param param 无效参数，传入进来的参数为undefined
     * @param event 当前点击的元素
     */
    private changeRaNumWatchClick(param, event) {
        const vm = this;
        lenovoPublic.selfLog2(x => console.log(param, event));
        const changeRaNum = document.querySelector('#changeRaNum');
        if (changeRaNum && !vm.isHide && event.target !== changeRaNum) {
            vm.saveIndex = -1;
            $('#changeRaNum').hide();
        }
    }
    /**
     * 监听document上鼠标的的弹起事件
     */
    private changeRaNumWatchMouseup() {
        const vm = this;
        if (vm.isMouseDown || String(vm.isMouseDown) === 'false') {
            vm.isMouseDown = false;
            vm.saveIndex = -1;
        }
    }



    ngOnDestroy(): void {
        {
            // 取消事件的监听
            document.removeEventListener('click', this.changeRaNumWatchClick.bind(this, event));
            document.removeEventListener('mouseup', this.changeRaNumWatchMouseup.bind(this, event));
        }
    }

    /**
     * 隐藏或显示tooltip
     * @param dataIndex 显示toolTip的下标
     */
    private isShowTooltip(dataIndex?) {
        const vm = this;
        if (dataIndex || dataIndex === 0) {
            vm.echartsInstance_mf.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: dataIndex
            });
        } else {
            vm.echartsInstance_mf.dispatchAction({
                type: 'hideTip'
            });
        }
    }


    // tslint:disable-next-line:member-ordering
    echartsInstance_mf: any;
    /**
     * 初始化图表事件
     * @param ec 当前图表的event
     */
    public malfunctionChartInit(ec) {
        this.echartsInstance_mf = ec;
        const vm = this;
        /**
         * 元素的点击事件，只有点击在图表的拐点的圈上时才会触发
         */
        vm.echartsInstance_mf.on('click', function (param) {
            console.log(param);
            vm.isHide = true;
            // console.log(this);
            // console.log(param, 123);
            // console.log(param.event.offsetX, param.event.offsetY);
            // console.log(vm.echartsInstance_mf.convertFromPixel('grid', [param.event.offsetX, param.event.offsetY]));
            vm.saveIndex = vm.echartsInstance_mf.convertFromPixel('grid', [param.event.offsetX, param.event.offsetY])[0];

            $('#changeRaNum').show().val('');
            $('#changeRaNum').css({ left: param.event.offsetX - vm.dragW, top: param.event.offsetY - vm.dragW });
            setTimeout(() => { vm.isHide = false; }, 100);
        });

        /**
         * 图表的点击事件，点击在图表上任意位置都触发
         */
        vm.echartsInstance_mf.getZr().on('click', function (param) {
            setTimeout(() => {
                if (!vm.isHide) {
                    console.log(param);
                }
            }, 0);
        });

        /**
         * 图表的mousedown事件，只有按在圈上时才会触发
         */
        vm.echartsInstance_mf.on('mousedown', function (param) {
            console.log('mousedown', param);
            vm.isMouseDown = true;
            vm.saveIndex = vm.echartsInstance_mf.convertFromPixel('grid', [param.event.offsetX, param.event.offsetY])[0];
        });

        /**
         * 图表的mousemove事件，鼠标滑在图表的任意位置都可以生效
         */
        vm.echartsInstance_mf.getZr().on('mousemove', function (param) {
            const dIndex = vm.echartsInstance_mf.convertFromPixel('grid', [param.event.offsetX, param.event.offsetY])[0];
            vm.isShowTooltip(dIndex);
            if (vm.isMouseDown) {
                $('#draggable').css({ top: param.offsetY - vm.dragH });
                const position = vm.echartsInstance_mf.convertFromPixel('grid', [param.event.offsetX, param.offsetY - vm.dragH + 10]);
                data[vm.saveIndex]['value'] = position[1];

                vm.echartsInstance_mf.setOption({
                    series: [{
                        id: 'a',
                        data: data
                    }]
                });
                // console.log(data);
            }
        });

        /**
         * 图表的globalout事件
         */
        vm.echartsInstance_mf.getZr().on('globalout', function (param) {
            // console.log('globalout');
            vm.isShowTooltip();
        });

        /**
         * 图表的鼠标抬起mouseup事件
         */
        vm.echartsInstance_mf.getZr().on('mouseup', function (param) {
            vm.isMouseDown = false;
            vm.saveIndex = -1;
            console.log(data);
            // console.log('mouseup');
        });
    }


}
