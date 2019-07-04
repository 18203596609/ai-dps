import { Directive, OnChanges, Input, SimpleChanges, ElementRef, OnDestroy } from '@angular/core';
declare const $, lenovoPublic;
// js控制多行文本溢出显示省略号，在浏览器屏幕缩小时会有一行文字都显示不开的情况会出没有文字显示的问题,设置最小高度也不好用
@Directive({ selector: '[appEllipsisMultiline]' })
export class EllipsisMultilineDirective implements OnChanges, OnDestroy {
    timerr: any = '';
    @Input() appEllipsisMultiline: any = '';
    constructor(
        private ele: ElementRef
    ) { }
    ngOnChanges(changes: SimpleChanges): void {
        const isScroll = () => {
            $(this.ele.nativeElement).scrollTop(1); // 控制滚动条下移10px
            if ($(this.ele.nativeElement).scrollTop() > 0) {
                $(this.ele.nativeElement).scrollTop(0); // 滚动条返回顶部
                return true;
            } else {
                return false;
            }
        };

        const setEllipsis = () => {
            this.timerr = setTimeout(() => {
                let aa = '';
                const pHtml = this.appEllipsisMultiline;
                if (!pHtml) {
                    return;
                }
                for (let i = 0; i < pHtml.length; i++) {
                    if (!isScroll()) {
                        aa += pHtml[i];
                        // lenovoPublic.selfLog2(()=>console.log(aa));
                        $(this.ele.nativeElement).html(aa);
                    } else {
                        aa = aa.slice(0, aa.length - 4);
                        aa += '.';
                        aa += '.';
                        aa += '.';
                        // lenovoPublic.selfLog2(()=>console.log(aa.length));
                        // lenovoPublic.selfLog2(()=>console.log(aa));

                        $(this.ele.nativeElement).html(aa);
                        break;
                    }
                }
            }, 300);
        };
        setEllipsis();

        window.removeEventListener('resize', setEllipsis);
        window.addEventListener('resize', setEllipsis);
    }

    ngOnDestroy(): void {
        clearTimeout(this.timerr);
    }
}
