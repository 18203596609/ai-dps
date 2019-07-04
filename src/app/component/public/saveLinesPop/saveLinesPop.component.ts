import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UpdataSubjectService } from '../../../shared/service/updata_subject.service';
declare const lenovoPublic;
@Component({
    selector: 'app-save-line-pop',
    templateUrl: './saveLinesPop.component.html',
    styleUrls: ['./saveLinesPop.component.scss']
})

export class SaveLinesPopComponent implements OnInit, OnDestroy, OnChanges {
    @Input() isShowSavePop = false;
    @Input() placeholder = '预测0';
    @Output() editSaveLinesEmit = new EventEmitter();
    @Output() isHideSavePopEmit = new EventEmitter();
    curDate = '2019-09-09';
    curChangeIndex = undefined;
    constructor(
        private updataSubjectService: UpdataSubjectService
    ) { }
    ngOnInit() {
        this.curDate = lenovoPublic.formatDateToString(new Date());
        // lenovoPublic.selfLog2(()=>console.log(this.curDate, this.placeholder));
    }

    ngOnChanges(changes: SimpleChanges): void {
        // lenovoPublic.selfLog2(()=>console.log(changes));
        if (!changes.isShowSavePop.currentValue) {
            localStorage.removeItem('curIndexSave');
        }
    }

    private getChangeData(param) {
        // lenovoPublic.selfLog2(()=>console.log(param));
        if (param.type === 'saveLinesCurIndex') {
            this.curChangeIndex = param.data;
        }
        if (param.type === 'updateSaveLinesPlaceHolder') {
            this.placeholder = param.data;
        }
    }

    public editSaveLines(param) {
        if (typeof param.lineLtbTime === 'object') {
            const year = String(param.lineLtbTime.getFullYear()), month = (param.lineLtbTime.getMonth() + 1) < 10 ? '0' + String((param.lineLtbTime.getMonth() + 1)) : String((param.lineLtbTime.getMonth() + 1)), date = param.lineLtbTime.getDate() < 10 ? '0' + String(param.lineLtbTime.getDate()) : String(param.lineLtbTime.getDate());
            const curDate = year + '-' + month + '-' + date;
            param.lineLtbTime = curDate;
        }
        if (
            (window.location.href).indexOf('singlePrediction/singleComparisonDetails') !== -1 ||
            (window.location.href).indexOf('AIPrediction/AIComparisonDetails') !== -1 ||
            (window.location.href).indexOf('humanPrediction/AIComparisonDetails') !== -1
        ) {
            const curIndex = this.curChangeIndex;
            this.updataSubjectService.emitComparisonDiagramParamterInfo({ type: 'editSaveLines', data: { data: param, curIndex: curIndex }, isPush: false });

        } else if ((window.location.href).indexOf('singlePrediction/singleDetailsComponent') !== -1 ||
            (window.location.href).indexOf('AIPrediction/AIDetailsComponent') !== -1 ||
            (window.location.href).indexOf('humanPrediction/humanDetailsComponent') !== -1 ||
            (window.location.href).indexOf('batchPrediction/batchSingleDetails') !== -1 ||
            (window.location.href).indexOf('batchPrediction/batchDetails') !== -1) {
            this.editSaveLinesEmit.emit(param);
        }

    }

    public isHideSavePop(isShow) {
        this.isHideSavePopEmit.emit(isShow);
    }
    ngOnDestroy(): void {
    }
}
