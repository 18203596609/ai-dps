import { Component, OnInit, Output, EventEmitter, DoCheck, OnDestroy } from '@angular/core';
import { DataManageService, LoadingService, GetJsonService } from '../../../shared/service';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
declare const lenovoPublic;
@Component({
    selector: 'app-single-comparison',
    templateUrl: './single_comparison.component.html',
    styleUrls: ['./single_comparison.component.scss']
})
export class SingleComparisonComponent implements OnInit, DoCheck, OnDestroy {
    comparisonData: object[] = [];
    @Output() turnToComparison = new EventEmitter();
    constructor(
        private dataManageService: DataManageService,
        private loadingService: LoadingService,
        private getJsonService: GetJsonService,
        private updataSubjectService: UpdataSubjectService,
    ) { }

    intervalCollect = {};
    getSinglePredictionComparisonSubject$;
    ngDoCheck() { }
    ngOnInit() {
        if (!this.getSinglePredictionComparisonSubject$) {
            this.getSinglePredictionComparisonSubject$ = this.updataSubjectService.getSinglePredictionComparisonSubject().subscribe(() => {
                this.dataManageService.updateComparisonPnListManage(() => {
                    this.comparisonData = this.dataManageService.getComparisonPnListManageData();
                    this.loadingService.hideLoading();
                }); // 保存当前的groupUnionCode
            });
        }
    }
    ngOnDestroy() {
        // tslint:disable-next-line:forin
        for (const i in this.intervalCollect) {
            clearInterval(this.intervalCollect[i]);
        }
        // lenovoPublic.selfLog2(()=>console.log(this.getSinglePredictionComparisonSubject$, 1));
        if (this.getSinglePredictionComparisonSubject$) {
            this.getSinglePredictionComparisonSubject$.unsubscribe();
        }

    }

    public turnToComparisonDetails() {
        this.turnToComparison.emit(true);
    }
}
