import { Component, OnInit } from '@angular/core';
import { SideBarService } from '../../shared/service/sidebar.service'

@Component({
    selector: 'app-prediction-history',
    templateUrl: 'prediction_history.component.html',
    styleUrls: ['./prediction_history.component.scss']
})

export class PredictionHistoryComponent implements OnInit {
    constructor(
        public sideBarService: SideBarService
    ) { }

    ngOnInit() { }
}
