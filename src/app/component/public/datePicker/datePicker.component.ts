import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
// import * as getISOWeek from 'date-fns/get_iso_week';
// import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd';
import { TestBed } from '@angular/core/testing';
declare const lenovoPublic;
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nz-demo-date-picker-basic',
    templateUrl: './datePicker.component.html',
    styleUrls: ['./datePicker.component.scss']
})

export class NzDemoDatePickerBasicComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() date = '2019-05-09';
    @Input() type = 'default';
    @Input() curIndex = 0;
    @Output() getDatePickerDate = new EventEmitter();
    dateRange = []; // [ new Date(), addDays(new Date(), 3) ];
    isEnglish = true;

    // 样式
    dataPickerInputStyle = {
        // background: 'purple'
    };

    // 样式
    dataPickerPopupStyle = {
        background: 'gray',
    };



    public disabledDate(current: Date): boolean {
        // lenovoPublic.selfLog2(() => console.log(current, (differenceInCalendarDays(current, '2015'))));
        // return (differenceInCalendarDays(current, '2010') < 0) || (differenceInCalendarDays(current, '2020') > 0);
        return false;
    }

    constructor(private i18n: NzI18nService) { }

    ngOnInit() {
        this.date = this.formatDateToString(this.date);
        this.changeLanguage();
    }
    ngAfterViewInit() {
        this.watchEventListener();
        // this.inputFocus();
    }

    private watchEventListener() {
        lenovoPublic.selfLog2(x => console.log(document.querySelector(`#datePicker${this.curIndex}${this.type}`)));
        document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker-input').addEventListener('focus', this.inputFocus.bind(this));
        // document.addEventListener('click', this.inputBlur.bind(this));
    }

    private removeWatchEventListener() {
        document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker-input').removeEventListener('focus', this.inputFocus.bind(this));
        // document.querySelector(`#datePicker${this.curIndex}${this.type}`).removeEventListener('click', this.inputBlur.bind(this));
    }


    private inputFocus() {
        lenovoPublic.selfLog2(x => console.log(123123123123123));
        document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker-input+span').classList.add('input-icon');
        lenovoPublic.setCss(document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker-input'), {
            border: '1px solid rgb(63, 70, 89)'
        });


    }

    private inputBlur(event) {
        if (!document.querySelector(`#datePicker${this.curIndex}${this.type}`)) {
            return;
        }
        if (!document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker')) {
            return;
        }
        const children = document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker').children;

        const dateInputAllEle = [document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker'), ...Array.from(children)];
        if (!dateInputAllEle.includes(event.target)) {

            document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker-input+span').classList.remove('input-icon');

            lenovoPublic.setCss(document.querySelector(`#datePicker${this.curIndex}${this.type}`).querySelector('.ant-calendar-picker-input'), {
                border: '1px solid rgba(92, 92, 92, 0.2)'
            });
        }
    }

    public onChange(result: Date): void {
        lenovoPublic.selfLog2(() => console.log('onChange: ', result));
        const date = this.formatDateToString(result);
        this.getDatePickerDate.emit(date);
    }

    public getWeek(result: Date): void {
        // lenovoPublic.selfLog2(() => console.log('week: ', getISOWeek(result)));
    }

    private changeLanguage(): void {
        this.i18n.setLocale(this.isEnglish ? zh_CN : en_US);
        this.isEnglish = !this.isEnglish;
    }

    ngOnDestroy() {
        this.removeWatchEventListener();
    }



    private formatDateToString(date) {
        return lenovoPublic.formatDateToString(date);
    }

    @HostListener('document:click', ['$event.target'])
    test(event) {
        const dateShadow = document.querySelector('.cdk-overlay-backdrop-showing');
        if (!dateShadow) {
            this.inputBlur({ target: event });
        }
    }
}

