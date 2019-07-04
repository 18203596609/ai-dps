import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare const $: any, lenovoPublic;

@Component({
    selector: 'app-time-select',
    templateUrl: './time_select.component.html',
    styleUrls: ['./time_select.component.scss']
})
export class TimeSelectComponent implements OnInit, OnChanges {
    @Input() timeList;
    @Input() className;
    @Input() chartName;
    @Output() fcData = new EventEmitter();
    @Output() mfData = new EventEmitter();
    monthList = [];
    yearList = [];
    moveIndex = 0;
    timeData;
    constructor() {

    }
    ngOnInit() {
    }

    ngOnChanges() {
        this.clickYear();
    }
    // 处理年、月的数据
    clickYear() {
        this.monthList = [];
        this.yearList = [];
        this.moveIndex = 0;
        for (let i = 0; i < this.timeList.length; i++) {
            this.yearList.push(this.timeList[i].slice(0, 4));
            this.yearList = Array.from(new Set(this.yearList));
            if (this.yearList.includes(this.timeList[i].slice(0, 4))) {
                const index = this.yearList.indexOf(this.timeList[i].slice(0, 4));
                if (!this.monthList[index]) {
                    this.monthList[index] = [];
                }
                this.monthList[index].push(Number(this.timeList[i].slice(5, 7)) + '月');
                this.monthList[index] = Array.from(new Set(this.monthList[index]));
            }
        }
        this.moveYear();
    }


    // 选择日期时的左右滑动
    moveYear(index?) {
        // tslint:disable-next-line:no-unused-expression
        index ? '' : $('.left_move').addClass('none_left_move');
        const yearLi = document.getElementsByClassName('yearLi' + this.className + this.chartName);
        const month_List = document.getElementsByClassName('month_List' + this.className + this.chartName);
        setTimeout(() => {
            for (let i = 0; i < yearLi.length; i++) {
                yearLi[i]['style'].left = index ? (index + i) * 88 / 20 + 'rem' : i * 88 / 20 + 'rem';
                month_List[i]['style'].left = index ? (index + i) * 88 / 20 + 'rem' : i * 88 / 20 + 'rem';
            }
        }, 0);
    }

    // 向左选择日期
    leftMove(index) {
        $('.right_move').removeClass('none_right_move');
        this.moveIndex++;
        if (index === 1) {
            $('.left_move').addClass('none_left_move');
        }
        if (index === 0) {
            this.moveIndex = 0;
        }
        this.moveYear(this.moveIndex);
    }

    // 向右选择日期
    rightMove(index) {
        $('.left_move').removeClass('none_left_move');
        this.moveIndex--;
        if (index === (this.yearList.length - 2)) {
            $('.right_move').addClass('none_right_move');
        }
        if (index === (this.yearList.length - 1)) {
            this.moveIndex = -index;
        }
        this.moveYear(this.moveIndex);
    }

    // 选择开始的日期
    clickStartNum(num, index, chartName) {
        const mon = num.slice(0, num.length - 1) < 10 ? '0' + num.slice(0, num.length - 1) : num.slice(0, num.length - 1);
        this.timeData = this.yearList[index] + '-' + mon;
        lenovoPublic.selfLog2(() => console.log(this.timeData));
        if (chartName.includes('mf')) {
            this.mfData.emit(this.timeData);
        } else {
            this.fcData.emit(this.timeData);
        }
    }
}
