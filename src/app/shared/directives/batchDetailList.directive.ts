import { Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[batchDetailList]'
})
export class BatchDetailListDirective implements OnChanges {
    @Input() batchDetailList;
    constructor(private el: ElementRef) { }

    ngOnChanges() {

    }
    // ${@Input() defaultColor: string;}
    // ${@Input('myHighlight') highlightColor: string;}
    // ${@HostListener('mouseenter') onMouseEnter() {}
    // ${this.highlight(this.highlightColor || this.defaultColor || 'red');}
    // ${}}
    // ${@HostListener('mouseleave') onMouseLeave() {}
    // ${this.highlight(null);}
    // ${}}
    // ${private highlight(color: string) {}
    // ${this.el.nativeElement.style.backgroundColor = color;}
    // ${}}
}
