import { Directive, OnChanges, Input, SimpleChanges, ElementRef } from '@angular/core';
declare const lenovoPublic;
// 用于监听class或样式的变化进行修改
@Directive({ selector: '[appWatchChange]' })
export class WatchChangeDirective implements OnChanges {
    // appWatchChange[0] ------type类型
    // appWatchChange[1] ------监听的参数变化
    // appWatchChange[2] ------要执行的函数
    // appWatchChange[3] ------this指向

    // #### 0 -----监听某个样式或变量或className的变化执行函数
    @Input() appWatchChange: [number, string, any, any] = [0, 'null', function () { }, {}];
    constructor(
        private ele: ElementRef
    ) { }
    ngOnChanges(changes: SimpleChanges): void {
        const [type, changeParam, fun, that] = [this.appWatchChange[0], this.appWatchChange[1], this.appWatchChange[2], this.appWatchChange[3]];
        if (type === 0) {
            // lenovoPublic.selfLog2(()=>console.log([type, changeParam, fun, that]));
            fun(changeParam, this.ele.nativeElement, that);
        }
    }
}
