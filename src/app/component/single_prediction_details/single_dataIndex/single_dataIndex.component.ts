import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
declare const lenovoPublic;
@Component({
    selector: 'app-single-dataindex',
    templateUrl: './single_dataIndex.component.html',
    styleUrls: ['./single_dataIndex.component.scss']
})

export class SingleDataIndexComponent implements OnInit, OnDestroy {
    dataIndexCurZu = 'fenlei';
    // dataIndexCurZu = 'benzu';
    getDataIndex$;
    allData;
    @Input() curData: any = {
        'selfGroupModel': {
            'accuracyRate': '-',
            'hitRate': '-',
            'coverageRatio': '-',
            'lostCount': '-',
            'overCount': '-',
            'overrunCost': '-'
        },
        'separateModel': {
            'accuracyRate': '-',
            'hitRate': '-',
            'coverageRatio': '-',
            'lostCount': '-',
            'overCount': '-',
            'overrunCost': '-'
        }
    };

    constructor(
        private updataSubjectService: UpdataSubjectService
    ) { }
    ngOnInit() {
        this.getData();
    }
    getData() {
        if (!this.getDataIndex$) {
            this.getDataIndex$ = this.updataSubjectService.getDataIndexSubject().subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                if (data.returnCode || data.returnCode === 0) {
                    this.allData = data;
                    this.curData = this.allData.data.projectModel.indicateModel;
                    this.setSeparateModel(this.allData.data.projectModel.diagramLines);
                } else {
                    this.setSeparateModel([data]);
                }
            }, (err) => {
                lenovoPublic.selfLog2(()=>console.log(err));
            });
        }
    }

    // 设置本组数据
    setSeparateModel(param) {
        // lenovoPublic.selfLog2(()=>console.log(param));
        if (param.every((item) => !item['selfGroupModel'])) {
            this.curData['selfGroupModel'] = {
                accuracyRate: '-',
                hitRate: '-',
                coverageRatio: '-',
                lostCount: '-',
                overCount: '-',
                overrunCost: '-'
            };
        } else {
            for (let i = 0, data = param; i < data.length; i++) {
                // lenovoPublic.selfLog2(()=>console.log(data[i].selfGroupModel));
                if (data[i].selfGroupModel) {
                    this.curData['selfGroupModel'] = data[i]['selfGroupModel'];
                    break;
                }
            }
        }
    }

    toogleFenZu(param) {
        this.dataIndexCurZu = param;
    }
    drawPanel() { }

    ngOnDestroy(): void {
        this.getDataIndex$.unsubscribe();
    }
}
