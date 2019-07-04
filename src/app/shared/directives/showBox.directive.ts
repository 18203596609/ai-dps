import { Directive, OnChanges, Input, SimpleChanges, ElementRef, HostListener, OnInit } from '@angular/core';
declare const lenovoPublic;

// 用于监听class或样式的变化进行修改
@Directive({ selector: '[appShowTitle]' })
export class ShowTitleDirective implements OnChanges, OnInit {
    @Input() appShowTitle: string;
    constructor(
        private ele: ElementRef
    ) { }
    ngOnInit() {
        if (!lenovoPublic['timerShowBox']) {
            lenovoPublic['timerShowBox'] = {};
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        // lenovoPublic.selfLog2(()=>console.log(changes, 'asdfasdfasd'));
        // lenovoPublic.selfLog2(()=>console.log(this.appShowTitle));
    }
    @HostListener('mouseenter')
    funEnter() {
        // lenovoPublic.selfLog2(()=>console.log(this.appShowTitle, 'enter'));
        this.clearTimeoutFun();
        const ShowTitleEle = document.querySelector(`#${this.appShowTitle}`);
        if (ShowTitleEle) {
            ShowTitleEle['style'].display = 'block';
        }
    }
    @HostListener('mouseleave')
    funLeave() {
        // lenovoPublic.selfLog2(()=>console.log(this.appShowTitle, 'leave'));
        this.clearTimeoutFun();
        lenovoPublic['timerShowBox'][this.appShowTitle] = setTimeout(() => {
            const ShowTitleEle = document.querySelector(`#${this.appShowTitle}`);
            if (ShowTitleEle) {
                ShowTitleEle['style'].display = 'none';
            }
        }, 100);
    }

    clearTimeoutFun() {
        // tslint:disable-next-line:forin
        for (const mm in lenovoPublic['timerShowBox']) {
            clearTimeout(lenovoPublic['timerShowBox'][mm]);
        }
    }
}
