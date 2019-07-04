import { Component, OnInit } from '@angular/core';
import { TooltipBoxService } from '../../../shared/service';
declare const lenovoPublic;
@Component({
    selector: 'app-tooltip-box',
    templateUrl: './tooltipBox.component.html',
    styleUrls: ['./tooltipBox.component.scss'],
})

export class TooltipBoxComponent implements OnInit {
    constructor(
        public tooltipBoxService: TooltipBoxService
    ) { }
    ngOnInit() {
        // lenovoPublic.selfLog2(()=>console.log(this.tooltipBoxService.getTooltipBoxInfo()));
    }
}
