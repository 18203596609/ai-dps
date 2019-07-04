import { Component, OnInit, Input, HostListener, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
declare const lenovoPublic;

@Component({
    selector: 'app-timer-select',
    templateUrl: 'timerSelect.component.html',
    styleUrls: ['timerSelect.component.scss'],
})

export class TimerSelectComponent implements OnInit, OnChanges {
    @Input() timerBegin = '2010-05'; // 开始时间
    @Input() timerEnd = '2040-12'; // 结束时间
    @Input() curTimeString = ''; // 当前时间默认为今天
    @Input() curIndex = 0;
    @Output() exportCurTime = new EventEmitter();

    curTimeObj = {}; // 当前时间对象
    curYear = ''; // 当前年份
    curMonth = ''; // 当前月份

    yearSelected = ''; // 已经选择的年份
    monthSelected = ''; // 已经选择的月份

    isShowTimeSelect = false; // 是否显示时间下拉框进行选择

    // 所有的时间数据
    allTimeData: { year: object, month: object[] }[] = [{
        year: {},
        month: [{}]
    }];

    constructor() { }
    ngOnInit() {
        this.setShowCurDate();
        this.setTimer();
        this.setAllYearMonthData();
        this.setCurTimeObj(this.curYear);
        console.log(this.curTimeString, this.timerBegin, this.timerEnd);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // lenovoPublic.selfLog2(()=>console.log(changes));
        // console.log(changes);
        const arr = ['curTimeString', 'timerBegin', 'timerEnd', 'curIndex'];
        arr.map(x => {
            if (changes[x] &&
                (changes[x]['currentValue'] ||
                    String(changes[x]['currentValue']) === 'false' ||
                    changes[x]['currentValue'] === 0 ||
                    changes[x]['currentValue'] === '')) {
                this[x] = changes[x]['currentValue'];
            }
        });
        if (changes.curTimeString) {
            this.setShowCurDate();
        }

        this.ngOnInit();
    }

    // 是否显示当前时间下拉列表
    public isShowTimeSelectClick(param) {
        this[param] = !this[param];
    }

    // 设置显示当前时间
    private setShowCurDate() {
        const date = new Date();
        const curYear = date.getFullYear();
        let curMonth: string | number = date.getMonth() + 1;
        if (curMonth < 10) {
            curMonth = '0' + curMonth;
        }

        if (!this.curTimeString) {
            this.curTimeString = curYear.toString() + '-' + curMonth.toString();
        }

        [this.curYear, this.curMonth] = [(this.curTimeString.split('-')[0]).toString(), (this.curTimeString.split('-')[1]).toString()];
        [this.yearSelected, this.monthSelected] = [this.curYear, this.curMonth];
        this.curTimeString = this.yearSelected.toString() + '-' + this.monthSelected.toString();
        // lenovoPublic.selfLog2(()=>console.log(this.curTimeString));
    }

    // 向前翻阅年份
    public prevOver() {
        if (Number(this.curYear) <= Number(this.allTimeData[0]['year']['yearNum'])) {
            alert('已经是第一页了');
            return;
        }
        this.curYear = (Number(this.curYear) - 1).toString();
        this.setCurTimeObj(this.curYear);
    }

    // 向后翻阅年份
    public nextOver() {
        if (Number(this.curYear) >= Number(this.allTimeData[this.allTimeData.length - 1]['year']['yearNum'])) {
            alert('已经是最后一页了');
            return;
        }
        this.curYear = (Number(this.curYear) + 1).toString();
        this.setCurTimeObj(this.curYear);
    }


    // 选择当前月份
    public getMonth(event) {
        this.curTimeString = this.curYear + '-' + event.target.getAttribute('month');
        this.setShowCurDate();
        this.exportCurTime.emit([this.curTimeString, this.curIndex]);
        // lenovoPublic.selfLog2(()=>console.log(this.curTimeString));
    }



    // 抽出当前时间的函数对象----避免遍历显示几百个dom元素
    private setCurTimeObj(curYear) {
        this.curTimeObj = this.allTimeData.find((item) => item.year['yearNum'] === curYear) || {};
    }



    // 设置时间数组
    private setTimer() {
        // console.log(this.timerBegin, this.timerEnd);
        const [timerBeginYear, timerBeginMonth, timerEndYear, timerEndMonth] = [Number(this.timerBegin.split('-')[0]), Number(this.timerBegin.split('-')[1]), Number(this.timerEnd.split('-')[0]), Number(this.timerEnd.split('-')[1])];
        const centerYear = timerEndYear - timerBeginYear; // 计算出中间的时间段
        for (let i = 0; i <= centerYear; i++) {
            const year = timerBeginYear + i;

            this.allTimeData[i] = { year: {}, month: [{}] };

            const obj = Object.assign({}, { yearNum: year.toString() });
            this.allTimeData[i]['year'] = obj;
            if (year !== timerBeginYear && year !== timerEndYear) {
                for (let m = 0; m < 12; m++) {
                    let time: string | number = 0;
                    time = m + 1 < 10 ? '0' + (m + 1) : (m + 1).toString();
                    const obj1 = Object.assign({}, { monthNum: time });
                    this.allTimeData[i]['month'][m] = obj1;
                }
            } else if (year === timerBeginYear) {
                for (let k = 0; k < 12 - (timerBeginMonth - 1); k++) {
                    const curIndex = (timerBeginMonth) + k;
                    let time: string | number = 0;
                    time = curIndex < 10 ? '0' + (curIndex) : (curIndex).toString();
                    const obj1 = Object.assign({}, { monthNum: time });
                    this.allTimeData[i]['month'][k] = obj1;
                }
            } else if (year === timerEndYear) {
                for (let k = 0; k < timerEndMonth; k++) {
                    const curIndex = k + 1;
                    let time: string | number = 0;
                    time = curIndex < 10 ? '0' + (curIndex) : (curIndex).toString();
                    const obj1 = Object.assign({}, { monthNum: time });
                    this.allTimeData[i]['month'][k] = obj1;
                }
            }
        }
        // lenovoPublic.selfLog2(()=>console.log(this.allTimeData));
    }

    @HostListener('document:click', ['$event.target'])
    isContains(target) {
        // setTimeout(() => {
        const btnTimer = document.querySelector(`#timerContent${this.curIndex}`);
        const operatorYear = document.querySelector(`#operatorYear${this.curIndex}`);
        if (operatorYear && operatorYear.contains(target)) {
            this.isShowTimeSelect = true;
        } else if (btnTimer && !btnTimer.contains(target)) {
            this.isShowTimeSelect = false;
        }
        // }, 0)
    }








    // **************************⚠️

    // 下边方法仅针对固定年月的下拉框，不支持左右点击选择进行切换年份月份，仅仅是一个单独的列表

    // tslint:disable-next-line:member-ordering
    @Input() isShowMounth = true; // 是否显示月份选择器-----或者显示月份固定然后年份可以选择
    // tslint:disable-next-line:member-ordering
    yearMonthSelected = '';
    // 下拉框中显示固定年份和月份进行选择--------start
    // tslint:disable-next-line:member-ordering
    allYearMonthData = [{
        id: String(Math.random()),
        yearMonthNum: ''
    }]; // 所有的年月的列表
    public setAllYearMonthData() {
        this.allYearMonthData.length = 0;
        const beginTimer = this.timerBegin;
        const endTimer = this.timerEnd;
        // tslint:disable-next-line:prefer-const
        let [beginTimerYear, beginTimerMonth]: any = [Number(beginTimer.split('-')[0]), Number(beginTimer.split('-')[1])];
        // tslint:disable-next-line:prefer-const
        let [endTimerYear, endTimerMonth]: any = [Number(endTimer.split('-')[0]), Number(endTimer.split('-')[1])];
        const yearSpacing = endTimerYear - beginTimerYear; // 获取年时间跨度
        const monthSpacing = endTimerMonth - beginTimerMonth; // 获取月时间跨度

        beginTimerMonth = beginTimerMonth < 10 ? '0' + beginTimerMonth : beginTimerMonth; // 拼接0
        endTimerMonth = endTimerMonth < 10 ? '0' + endTimerMonth : endTimerMonth; // 拼接0

        for (let i = 0; i <= yearSpacing; i++) {
            let obj;
            obj = {
                id: String(Math.random()),
                yearMonthNum: i !== yearSpacing ?
                    `${(beginTimerYear + i)}-${beginTimerMonth}` :
                    monthSpacing <= 0 ?
                        `${(beginTimerYear + i)}-${endTimerMonth}` :
                        `${(beginTimerYear + i)}-${beginTimerMonth}`
            };

            this.allYearMonthData.push(obj);

            if (i === yearSpacing && monthSpacing > 0) {
                this.allYearMonthData.push({
                    id: String(Math.random()),
                    yearMonthNum: `${(beginTimerYear + i)}-${endTimerMonth}`
                });
            }
        }
        // console.log(this.allYearMonthData);
    }

    // 点击选项时获取选择的时间
    public getYearMonthData(event, data) {
        this.curTimeString = data.yearMonthNum;
        this.setShowCurDate();
        this.exportCurTime.emit([this.curTimeString, this.curIndex]);
    }




    // 下拉框中显示固定年份和月份进行选择--------end


    // **************************⚠️

}
