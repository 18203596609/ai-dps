import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
declare const lenovoPublic;
@Component({
    selector: 'app-single-cur-prediction',
    templateUrl: './single_cur_prediction.component.html',
    styleUrls: ['./single_cur_prediction.component.scss']
})

export class SingleCurPredictionComponent implements OnInit, OnDestroy {
    getCurPredictionSubject$;
    allData;
    curData: any = {
        ltotalFocast: '-',
        forcastPeriod: '-'
    }; // 当前总量

    constructor(
        private updataSubjectService: UpdataSubjectService
    ) { }
    ngOnInit() {
        this.getData();
    }
    getData() {
        if (!this.getCurPredictionSubject$) {
            this.getCurPredictionSubject$ = this.updataSubjectService.getCurPredictionSubject().subscribe((data) => {
                if (data.returnCode || data.returnCode === 0) {
                    this.allData = data;
                    this.curData = this.allData.data.projectModel;
                } else {
                    this.resetCurData(data);
                }
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
            });
        }
    }

    // 设置默认预测曲线时联动参数
    resetCurData(cont) {
        this.curData['ltotalFocast'] = 0;
        this.curData['forcastPeriod'] = 0;
        cont.value.map((item) => {
            this.curData['ltotalFocast'] += (+item);
        });
        this.curData['ltotalFocast'] = parseInt(this.curData['ltotalFocast'], 10).toFixed(0);

        // 计算月份相差
        const getIntervalMonth = (startDate, endDate) => {
            const startMonth = startDate.getMonth();
            const endMonth = endDate.getMonth();
            const intervalMonth = (startDate.getFullYear() * 12 + startMonth) - (endDate.getFullYear() * 12 + endMonth);
            return intervalMonth;
        };

        this.curData['forcastPeriod'] = (getIntervalMonth(new Date(cont.timeLine[cont.timeLine.length - 1]), new Date(cont.timeLine[0]))).toFixed(0);
        // lenovoPublic.selfLog2(()=>console.log(this.curData['forcastPeriod']));

    }

    drawPanel() { }

    ngOnDestroy(): void {
        this.getCurPredictionSubject$.unsubscribe();
    }
}
