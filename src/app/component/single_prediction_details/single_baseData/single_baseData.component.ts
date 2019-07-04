import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
declare const $, lenovoPublic;
@Component({
    selector: 'app-single-basedata',
    templateUrl: './single_baseData.component.html',
    styleUrls: ['./single_baseData.component.scss']
})

export class SingleBaseDataComponent implements OnInit, OnDestroy {
    getBaseDataSubject$;
    materieList = [];
    allData;
    curData = {
        'groupCode': '-',
        'groupName': '-',
        'productLine': '-',
        'planClass': '-',
        'includePNs': []
    };

    constructor(
        private updataSubjectService: UpdataSubjectService
    ) { }
    ngOnInit() {
        this.getData();
    }

    // 获取panel数据
    getData() {
        if (!this.getBaseDataSubject$) {
            this.getBaseDataSubject$ = this.updataSubjectService.getBaseDataSubject().subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                this.materieList = [];
                this.allData = data;
                this.curData = this.allData.data.projectModel.basicModel;
                this.getMaterieList(data);
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err));
            });
        }
    }

    // 获取查看列表数组
    private getMaterieList(data) {
        const curId = data.data.projectModel.basicModel.currentGroupUnionCode;

        const includePNs = data.data.projectModel.groupModel;
        // lenovoPublic.selfLog2(()=>console.log(includePNs));
        if (includePNs) {
            includePNs.includePNs.map((item) => {
                this.materieList.push(item);
            });
        }
    }

    drawPanel() { }

    ngOnDestroy(): void {
        this.getBaseDataSubject$.unsubscribe();
    }
}
