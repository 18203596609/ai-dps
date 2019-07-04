import { Component, OnInit, Input, Output, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
declare const lenovoPublic;
@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit, AfterViewInit {
    // @Input() modelId = 'self';
    @Input() type = 'number';
    @Input() max;
    @Input() min;
    @Input() step = 1;
    @Input() data = 0;
    @Output('changeData') changeData = new EventEmitter();
    transformPrecision = 100000000000000;
    constructor() { }
    ngOnInit() {
        console.log(this.type, this.data, this.max);
    }
    ngAfterViewInit(): void {
        const vm = this;
        document.querySelector('#iptNumber').addEventListener('focus', () => {
            // document.querySelector('#iptNumber').classList.add('hide-arrow');
            console.log('focus');
        });
        document.querySelector('#iptNumber').addEventListener('change', function () {
            console.log('change');
        });
        document.querySelector('#iptNumber').addEventListener('blur', function () {
            // document.querySelector('#iptNumber').classList.add('hide-arrow');
            console.log('blur');
        });
    }

    // 点击加号按钮
    add() {
        if (typeof this.max !== 'undefined' && this.data >= this.max) {
            this.data = this.max;
            return;
        }
        // 按照步长递增
        this.data = lenovoPublic.getSum(this.getPrecisionNum(this.data, this.transformPrecision), this.getPrecisionNum(this.step, this.transformPrecision)) / this.transformPrecision;
    }
    // 点击减号按钮
    substract() {
        if (typeof this.min !== 'undefined' && this.data <= this.min) {
            return;
        }
        if (this.data >= this.max) {
            this.data = this.max;
        }
        // 按照步长递减
        this.data = lenovoPublic.getDifferenceVal(this.getPrecisionNum(this.data, this.transformPrecision), this.getPrecisionNum(this.step, this.transformPrecision)) / this.transformPrecision;
    }

    // 监听输入oninput事件
    inputChange() {
        console.log('触发了');
        document.querySelector('#iptNumber')['blur']();
    }

    // 使用指令监听data值的变化
    watchData(param, ele, that) {
        // console.log(param, ele, that);
        that.changeData.emit(that.data);
    }

    // 获取精度数值，在进行加减计算时不出现精度计算问题
    private getPrecisionNum(num, precision) {
        return Math.round(Number(num * precision));
    }
}
