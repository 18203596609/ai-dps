import { Component, OnInit } from '@angular/core';
import { SideBarService } from '../../shared/service/sidebar.service'
@Component({
    selector: 'app-warning-history',
    templateUrl: './warning_history.component.html',
    styleUrls: ['./warning_history.component.scss']
})

export class WarningHistoryComponent implements OnInit {
    constructor(
        public sideBarService:SideBarService
    ) { }

    ngOnInit() { }
}
