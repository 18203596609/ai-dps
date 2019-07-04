import { Directive, OnChanges, SimpleChanges, Input, ElementRef } from '@angular/core';
declare const lenovoPublic;
// tslint:disable-next-line:directive-selector
@Directive({ selector: '[filterunit]' })
export class FilterUnitDirective implements OnChanges {
    @Input() filterunit = { value: '', unit: [] };
    constructor(
        private ele: ElementRef
    ) { }
    ngOnChanges(changes: SimpleChanges): void {
        // lenovoPublic.selfLog2(()=>console.log(this.filterunit));
        for (let i = 0; i < this.filterunit.unit.length; i++) {
            const reg = new RegExp(this.filterunit.unit[i], 'g');
            this.filterunit.value = String(this.filterunit.value).replace(reg, '');
        }
        this.ele.nativeElement.innerHTML = this.filterunit.value;
    }
}
