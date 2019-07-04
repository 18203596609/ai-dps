import { Injectable } from '@angular/core';
import { SideBarService } from './sidebar.service';

@Injectable()
export class LoadingService {

    constructor(
        public sideBarService: SideBarService
    ) { }

    // 隐藏loading
    hideLoading() {
        const singlePredictionShadow = document.querySelector('.single-prediction-loading');
        if (singlePredictionShadow) {
            singlePredictionShadow['style'].display = 'none';
            return;
        }
    }
    // 显示loading
    showLoading() {
        const singlePredictionShadow = document.querySelector('.single-prediction-loading');
        const sideBarIsFold = this.sideBarService.isFold;
        const isExistSideBar = document.querySelector('#sideBar');
        const spinner = document.querySelector('#loading .spinner');

        if (singlePredictionShadow) {
            spinner['style'].display = 'none';

            if (sideBarIsFold && isExistSideBar) {
                spinner['style'].marginLeft = sideBarIsFold ? '4.5rem' : '1.5rem';
            } else {
                spinner['style'].marginLeft = '0rem';
            }

            spinner['style'].display = 'block';
            singlePredictionShadow['style'].display = 'block';
            return;
        }
    }
}
