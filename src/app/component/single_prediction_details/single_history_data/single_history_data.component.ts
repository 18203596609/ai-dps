import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
declare const $, lenovoPublic;
@Component({
    selector: 'app-single-history-data',
    templateUrl: './single_history_data.component.html',
    styleUrls: ['./single_history_data.component.scss']
})

export class SingleHistoryDataComponent implements OnInit, OnDestroy {
    @Output() hightLightDiagram = new EventEmitter();
    @Output() setFcBgTime = new EventEmitter();
    getHistoryDataSubject$;
    showLtbList = 'keDiagramLineType_long_term_pred';
    ltbList = [];
    allData;
    FcBgTime;
    @Input() curData: any = {
        'nAverageMounth': '-',
        'nCoust': '-',
        'nHistoryUsage': '-',
        'futureTotalIB': '-',
        'demandStartTime': '-',
        'averageIBTime': '-',
        'demandDeclineTime': '-',
        'stationaryKeepTime': '-',
        'eos': '-',
        'LTBTime': []
    };

    constructor(
        public updataSubjectService: UpdataSubjectService
    ) { }
    ngOnInit() {
        this.getData();
    }
    // 获取panel数据
    getData() {
        if (!this.getHistoryDataSubject$) {
            this.getHistoryDataSubject$ = this.updataSubjectService.getHistoryDataSubject().subscribe((data) => {
                console.log(data);
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (data.type && data.type === 'nAverageMounth') {
                    // if (lenovoPublic.curAIOrHumanOrSingle() !== 'humanPrediction') {
                    this.curData.nAverageMounth = data.data.selfGroupModel ? data.data.selfGroupModel.nAverageMounth : 0;
                    // }
                    return;
                }
                if (data.returnCode || data.returnCode === 0) {
                    // lenovoPublic.selfLog2(()=>console.log(data));
                    this.ltbList = [];
                    this.allData = data;
                    this.curData = this.allData.data.projectModel.historyModel;
                    this.FcBgTime = [this.allData.data.projectModel.historyModel.demandStationaryTime, this.allData.data.projectModel.historyModel.demandDeclineTime];
                    this.curData.stationaryKeepTime = parseInt(this.curData.stationaryKeepTime, 10);
                }
                this.getLtbList(data);
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
            });
        }
    }

    private getLtbList(data) {
        if (data.returnCode || data.returnCode === 0) {
            data = data.data.projectModel.diagramLines;
        }
        // lenovoPublic.selfLog2(()=>console.log(data));
        data.map((item) => {
            if (item.bUsed && item.lineType === 'keDiagramLineType_long_term_pred') {
                this.ltbList.push(item.timeLine[0]);
            }
        });
    }

    //  历史数据的鼠标划上使得图表相应区域高亮显示
    public setMouseEnterEvent(event) {
        this.hightLightDiagram.emit('aasdf');
    }

    // 鼠标划过'在保平稳时间'时把时间传给图表区，显示背景区域
    setFcBg() {
        this.setFcBgTime.emit(this.FcBgTime);
    }

    // 鼠标离开‘在保平稳时间’  背景区域消失
    nullFcBg() {
        this.setFcBgTime.emit([0, 0]);
    }
    drawPanel() { }

    ngOnDestroy(): void {
        this.getHistoryDataSubject$.unsubscribe();
    }





















    // 平均月需求 的高中低
    public nAverageMounthIsHighOrLow(num, element) {
        if (Number(num) < 8) {
            element.innerHTML = '低';
        } else if (Number(num) >= 8 && Number(num) < 40) {
            element.innerHTML = '中';
        } else {
            element.innerHTML = '高';
        }
    }

    // 成本价 的高中低
    public nCoustIsHighOrLow(num, element) {
        if (Number(num) < 100) {
            element.innerHTML = '低';
        } else if (Number(num) >= 100 && Number(num) < 450) {
            element.innerHTML = '中';
        } else {
            element.innerHTML = '高';
        }
    }



}
