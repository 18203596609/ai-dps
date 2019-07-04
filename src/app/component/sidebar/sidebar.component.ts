import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarService } from '../../shared/service/sidebar.service';
import { CodebaseService } from '../../shared/service/codebase.service';
import { DataManageService } from '../../shared/service/data_manage.service';
import { TooltipBoxService } from '../../shared/service/tooltipBox.service';
declare const $, lenovoPublic;

@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
    userName;
    constructor(
        public sideBarService: SideBarService,
        public codebaseService: CodebaseService,
        public dataManageService: DataManageService,
        public tooltipBoxService: TooltipBoxService,
        public router: Router
    ) { }
    ngOnInit() {
        this.getUserName();
        this.setBarStyle();
    }

    // 防止点击浏览器按钮后退时修改侧边栏按钮的样式
    private setBarStyle() {
        this.sideBarService.changeBarActive(this.dataManageService.curRouter().split('#')[1].split('/')[1]);
    }

    // 动态绑定当前显示的路由添加class名称
    changeSidebarStyle(param) {
        return ((window.location.hash).split('#')[1]).indexOf(param) !== -1;
    }

    // 获取登录时保存的用户名
    getUserName() {
        this.userName = this.codebaseService.operatorSessionStroage.getSessionStroage('userName') || '请登陆';
    }

    // 路由跳转，跳转路由时跳转到大路由下的上一次保存的页面
    routeTurn(event, route) {
        const curHash = (window.location.hash).split('#')[1];
        const curHashObj = {
            'singlePrediction': 'singlePrediction',
            'AIPrediction': 'AIPrediction',
            'humanPrediction': 'humanPrediction',
            'batchPrediction': 'batchPrediction',
            'predictionHistory': 'predictionHistory',
            'warningHistory': 'warningHistory',
        };
        for (const [key, value] of Object.entries(curHashObj)) {
            if (curHash.indexOf(key) !== -1) {
                this.dataManageService.setHistoryRoute(value, curHash);
            }
        }
        const targetRoute = this.dataManageService.getHistoryRoute(curHashObj[route]);
        const routeParam = {};
        let curRoute = targetRoute;
        if (targetRoute.indexOf(';') !== -1) {
            const curAllHash = targetRoute.split(';');
            curRoute = curAllHash[0];
            curAllHash.map((item, itemIndex) => {
                if (itemIndex > 0) {
                    const [key, value] = [item.split('=')[0], item.split('=')[1]];
                    routeParam[key] = value;
                }
            });
        }
        this.sideBarService.changeBarActive(route);
        // lenovoPublic.selfLog2(()=>console.log(targetRoute, curRoute, routeParam));
        this.router.navigate([curRoute, routeParam]);
    }


    // 缩小或打开侧边栏
    closeSideBar(target) {
        this.sideBarService.isFold = !this.sideBarService.isFold;
        this.sideBarService.watchIsFoldFun(this.sideBarService.isFold);
    }

    public turnToEditPassword() {
        this.dataManageService.setIsShowEditPassword(true);
    }
    // 显示退出框
    public showExitPop() {
        this.tooltipBoxService.setTooltipBoxInfo(
            {
                message: [
                    {
                        text: '您确定要退出么？',
                        style: {}
                    }
                ],
                btnTextParentStyles: () => { },
                btnText: [
                    {
                        text: '退出',
                        className: 'confirm',
                        callback: () => {
                            this.router.navigate(['./login']);
                            this.tooltipBoxService.clearToolTipBoxInfo();
                            setTimeout(() => {
                                localStorage.clear();
                                location.reload();
                            }, 10);
                        }
                    },
                    {
                        text: '取消',
                        className: 'cancel',
                        callback: () => {
                            // lenovoPublic.selfLog2(()=>console.log('取消'));
                            this.tooltipBoxService.clearToolTipBoxInfo();
                        }
                    }
                ]
            });
    }
    // 是否显示设置按钮栏
    public showSetting() {
        this.sideBarService.isShowSetting = !this.sideBarService.isShowSetting;
    }

    // 展开还是关闭列表项
    public openOrCloseChildList(event, bar) {
        this.sideBarService.isBarActive[bar].isShow = !this.sideBarService.isBarActive[bar].isShow;
    }
}
