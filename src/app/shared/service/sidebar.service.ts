import { Injectable } from '@angular/core';
import { CodebaseService } from './codebase.service';

@Injectable()
export class SideBarService {
    public isFold = true; // 是否打开侧边栏
    public isShowSetting = false; // 是否显示设置项内容
    public isBarActive =
        { // 当前菜单是否处于激活状态
            singlePrediction: {
                active: true, // 当前路由是否激活
                isShow: false, // 当前子菜单是否展开
                child: {
                    AIPrediction: {
                        active: true
                    },
                    humanPrediction: {
                        active: false
                    },
                }
            },
            batchPrediction: {
                active: false,
                isShow: false,
            },
            predictionHistory: {
                active: false,
                isShow: false,
            },
            warningHistory: {
                active: false,
                isShow: false,
            }
        };
    constructor(
        public codebaseService: CodebaseService
    ) {
        if (this.codebaseService.operatorSessionStroage.getSessionStroage('isBarActive')) {
            this.isBarActive = this.codebaseService.operatorSessionStroage.getSessionStroage('isBarActive');
        }
    }
    watchIsFoldObj: object = {};
    public watchIsFoldAdd(param, fun) {
        this.watchIsFoldObj[param] = fun;
    }
    public watchIsFoldFun(isFold) {
        // tslint:disable-next-line:forin
        for (const i in this.watchIsFoldObj) {
            this.watchIsFoldObj[i](isFold);
        }
    }

    // 改变当前活动的路由，需要根据当前活动的路由改变侧边栏的样式
    public changeBarActive(bar) {
        for (const key of Object.keys(this.isBarActive)) {
            this.isBarActive[key].active = key === bar ? true : false;
            if (!this.isBarActive[key].child) {
                continue;
            }
            for (const childKey of Object.keys(this.isBarActive[key].child)) {
                this.isBarActive[key].child[childKey].active = childKey === bar ? true : false;
                if (childKey === bar) {
                    this.isBarActive[key].active = true;
                }
            }
        }
        this.codebaseService.operatorSessionStroage.setSessionStroage('isBarActive', JSON.stringify(this.isBarActive));
    }
}
