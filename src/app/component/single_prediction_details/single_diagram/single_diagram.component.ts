import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';

import { SinglePredictionShowComponent } from '../single_prediction_show/single_prediction_show.component';
import { SingleDiagramParameterComponent } from '../single_diagram_parameter/single_diagram_parameter.component';
declare const lenovoPublic;
@Component({
    selector: 'app-single-diagram',
    templateUrl: './single_diagram.component.html',
    styleUrls: ['./single_diagram.component.scss']
})

export class SingleDiagramComponent implements OnInit, OnDestroy {
    getDiagramSubject$;
    allData;
    curData = {};
    fcBgTime;
    @ViewChild(SinglePredictionShowComponent)
    public singlePredictionShowComponent: SinglePredictionShowComponent;
    @ViewChild(SingleDiagramParameterComponent)
    public singleDiagramParameterComponent: SingleDiagramParameterComponent;
    constructor(
        public updataSubjectService: UpdataSubjectService
    ) { }
    ngOnInit() {
        this.getData();
    }
    // 获取创建工程时的所有数据
    getData() {
        if (!this.getDiagramSubject$) {
            this.getDiagramSubject$ = this.updataSubjectService.getBaseDataSubject().subscribe((data) => {
                // lenovoPublic.selfLog2(()=>console.log(data));
                this.allData = data;
                this.curData = this.allData.data.projectModel.basicModel;
                this.setData(data);
            }, (err) => {
                lenovoPublic.selfLog2(()=>console.log(err));
            });
        }
    }

    // 设置创建工程时发送的数据
    setData(data) {
        this.updataSubjectService.emitDiagramTopInfo(data);
        this.updataSubjectService.emitDiagramBottomInfo(data);
    }

    // 鼠标划过'在保平稳时间'时把时间传给图表区，显示背景区域
    getFcBgTime(param) {
        this.singlePredictionShowComponent.setFcBgTime(param);
    }
    ngOnDestroy(): void {
        this.getDiagramSubject$.unsubscribe();
    }

    // 鼠标划入历史数据时调用图表区域的函数使得图表区域进行高亮等操作
    public hightLightDiagram(event) {
        this.singlePredictionShowComponent.hightLightDiagram();
    }




    // 保存线方法-------start
    /**
     *
     * @param param  保存线的传参
     */
    public editSaveLines(param) {
        this.singleDiagramParameterComponent.editSaveLines(param);
    }

    /**
     *
     * @@param isShow 显示还是隐藏当前保存线的弹框
     */
    public isHideSavePop(isShow) {
        this.singleDiagramParameterComponent.isHideSavePop(isShow);
    }


    // tslint:disable-next-line:member-ordering
    isShowSavePop = false; // 是否显示当前弹框

    /**
     * @param isShow 是否显示保存线的弹框
     */
    public isShowPop(show) {
        this.isShowSavePop = show;
    }
    // 保存线方法-------end

    // tslint:disable-next-line:member-ordering
    placeholder = '预测0';
    /**
     * @param isShow 是否显示保存线的弹框
     */
    public updateSavePlaceHolder(name) {
        this.placeholder = name;
        // lenovoPublic.selfLog2(()=>console.log(name, 'placehold'));

    }
    // 保存线方法-------end
}
