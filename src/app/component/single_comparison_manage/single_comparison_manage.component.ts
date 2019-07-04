import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CodebaseService } from '../../shared/service/codebase.service';
import { DataManageService, GetJsonService, LoadingService } from '../../shared/service';
declare const lenovoPublic;
@Component({
    selector: 'app-single-comparison-manage',
    templateUrl: 'single_comparison_manage.component.html',
    styleUrls: ['single_comparison_manage.component.scss']
})

export class SingleComparisonManageComponent implements OnInit, OnDestroy {
    pnListDetailsData: any = [];
    routeParam: any = {};
    constructor(
        private changeRef: ChangeDetectorRef,
        private router: Router,
        private dataManageService: DataManageService,
        private getJsonService: GetJsonService,
        private loadingService: LoadingService,
        private route: ActivatedRoute
    ) { }
    intervalCollect = {};
    ngOnInit() {
        this.intervalCollect['timer'] = setInterval(() => {
            if (this.dataManageService.getSingleCurGroupUnionCode()) {

                clearInterval(this.intervalCollect['timer']);
                this.dataManageService.updateComparisonPnListManage(() => {
                    this.dataManageService.getComparisonPnListManageData().map((item, itemIndex) => {
                        const obj = Object.assign({}, {
                            id: item.id,
                        });
                        const pnList = [];
                        item.pnList.map((cont) => {
                            pnList[pnList.length] = cont;
                        });
                        obj['pnList'] = pnList;
                        this.pnListDetailsData[itemIndex] = obj;
                    });
                    this.loadingService.hideLoading();
                });
                clearInterval(this.intervalCollect['timer']);
            }
        }, 100);
        this.route.params.subscribe(x => {
            this.routeParam = x;
        });
    }
    ngOnDestroy() {
        // tslint:disable-next-line:forin
        for (const i in this.intervalCollect) {
            clearInterval(this.intervalCollect[i]);
        }
    }

    //  更新当前数据列表
    private refreshPnListDetailsData(operatoyType, param?) {
        // this.pnListDetailsData = this.dataManageService.getComparisonPnListManageData();
        this.pnListDetailsData = [];
        this.dataManageService.getComparisonPnListManageData().map((item, itemIndex) => {
            const pnList = [];
            item.pnList.map((cont) => {
                pnList[pnList.length] = cont;
            });
            // lenovoPublic.selfLog2(()=>console.log(pnList));
            this.pnListDetailsData[itemIndex] = {};
            this.pnListDetailsData[itemIndex]['id'] = item.id;
            this.pnListDetailsData[itemIndex]['pnList'] = pnList;

            // lenovoPublic.selfLog2(()=>console.log(JSON.stringify(this.pnListDetailsData)));
        });

        if (operatoyType === 'del') {
            this.pnListDetailsData.map((item, itemIndex) => {
                if (param.id === item.id) {
                    this.pnListDetailsData.splice(itemIndex, 1);
                }
            });
        }
    }

    // 对比组管理的删除操作
    private singleComparisonManageDel(param) {
        const [id] = [param[0]];
        this.dataManageService.delComparisonPnListManage(id, () => {
            this.refreshPnListDetailsData('del', { id: id });
        });
    }

    // 对比组管理的修改操作点击完成按钮时执行
    private singleComparisonManageChange(param) {
        const [id, obj] = [param[0], param[1]];
        // lenovoPublic.selfLog2(()=>console.log(id, obj));
        this.dataManageService.changeComparisonPnListManageData(id, obj, () => {
            this.refreshPnListDetailsData('change');
        });
    }

    // 对比组管理的取消按钮执行
    private singleComparisonManageCancel(param) {
        this.refreshPnListDetailsData('cancel');
    }

    // 跳转回至对比组详情页面
    public turnToSingleCompariseDetails() {
        if (!this.routeParam.originPage) {
            this.router.navigate(['./singlePrediction/singleComparisonDetails', this.routeParam]);
            return;
        }

        const obj = {
            'AIPredictionDetails': './AIPrediction/AIComparisonDetails',
            'humanPredictionDetails': './humanPrediction/humanComparisonDetails',
            'batchPredictionDetails': './batchPrediction/batchComparisonDetails',
            'batchDetails': './batchPrediction/batchComparisonDetails',
        };
        this.router.navigate([obj[this.routeParam.originPage], this.routeParam]);
    }
}
