import { Directive, ElementRef, HostListener, Input, OnChanges, AfterViewInit } from '@angular/core';
import { directive } from '@angular/core/src/render3/instructions';
declare const $, lenovoPublic;

/**
 *监听当前当前预测曲线框是否存在
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[forecastBoxShow]'
})
export class ForecastBoxShowDirective implements OnChanges {
    @Input() forecastBoxShow;
    constructor(private el: ElementRef) { }

    ngOnChanges() {
        if (this.forecastBoxShow[2] && this.forecastBoxShow[3]) {
            $('.nowFcLocation').css('display', 'block');
        } else {
            $('.nowFcLocation').css('display', 'none');
        }
    }
}

/**
 *单组预测页监听确字的出现
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[showEnsure]'
})
export class ShowEnsureDirective implements OnChanges {
    @Input() showEnsure;
    constructor(private el: ElementRef) { }

    ngOnChanges() {
        if (this.showEnsure[1]) {
            setTimeout(() => {
                $(`.ensure${this.showEnsure[0]}`).css('display', 'inline-block');
            }, 10);
        }

    }
}

/**
 * 对比组监听确字的出现
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[comparisonShowEnsure]'
})
export class ComparisonShowEnsureDirective implements OnChanges {
    @Input() comparisonShowEnsure;
    constructor(private el: ElementRef) { }

    ngOnChanges() {
        if (this.comparisonShowEnsure[0]) {
            setTimeout(() => {
                $(`.ensure${this.comparisonShowEnsure[1]}${this.comparisonShowEnsure[2]}`).css('display', 'inline-block');
            }, 10);
        }

    }
}


/**
 * 监听‘当前预测曲线’的resize
 *  */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[forecastNowResize]'
})
export class ForecastNowResizeDirective implements OnChanges, AfterViewInit {
    @Input() forecastNowResize;
    constructor() { }
    ngOnChanges() {
        lenovoPublic.selfLog2(() => console.log('fgdr'));

        this.forecastNowResize[0].call(this.forecastNowResize[4], this.forecastNowResize[1], this.forecastNowResize[2], this.forecastNowResize[3]);
    }
    ngAfterViewInit() {
    }
}

/**
 * 监听‘编辑中曲线’的resize
 *  */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[forecastNowEditResize]'
})
export class ForecastNowEditResizeDirective implements OnChanges, AfterViewInit {
    @Input() forecastNowEditResize;
    constructor() { }
    ngOnChanges() {
        this.forecastNowEditResize[0].call(this.forecastNowEditResize[2], this.forecastNowEditResize[1]);
    }
    ngAfterViewInit() {
    }
}
