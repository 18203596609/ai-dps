import { Component, OnInit } from '@angular/core';

import { SideBarService } from '../../shared/service/sidebar.service';
declare const lenovoPublic;
@Component({
    selector: 'app-single-prediction',
    templateUrl: 'single_prediction.component.html',
    styleUrls: ['./single_prediction.component.scss']
})

export class SinglePredictionComponent implements OnInit {
    isActive1 = true;
    isPredictioned = true;
    projectId = [];
    constructor(
        public sideBarService: SideBarService
    ) { }
    ngOnInit() {
    }

    /**
     * 点击开始预测按钮时的方法
     * @param param 点击后隐藏搜索栏跳转到详情页面
     */
    startPrediction(param) {
        lenovoPublic.selfLog2(() => console.log('start'));
    }
}
