import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { DataManageService, GetJsonService, LoadingService, TooltipBoxService } from '../../shared/service';
import { SingleSearchComponent } from '../single_search/single_search.component';
import { enableProdMode } from '@angular/core';

enableProdMode();
declare const $, lenovoPublic;

@Component({
    selector: 'app-batch-search',
    templateUrl: './batch_search.component.html',
    styleUrls: ['./batch_search.component.scss']
})

export class BatchSearchComponent implements OnInit {
    pnListDetailsData: any = [
        { 'pnList': [] },
        { 'pnList': [] }
    ];
    // @ViewChild(SingleSearchComponent) singleSearchComponent: SingleSearchComponent;
    @ViewChildren(SingleSearchComponent) singleSearchComponent: QueryList<SingleSearchComponent>;
    constructor(
        private router: Router,
        private dataManageService: DataManageService,
        private getJsonService: GetJsonService,
        private tooltipBoxService: TooltipBoxService,
        private loadingService: LoadingService,
    ) { }
    ngOnInit() {
        const pnList = this.dataManageService.getSaveSingleOrBatchPnList();
        if (pnList) {
            const pnListLen = pnList.length;
            if (pnList && pnListLen !== 0) {
                this.pnListDetailsData.length = 0;
                if (pnListLen <= 1) {
                    this.pnListDetailsData.push(...[pnList[0], { pnList: [] }]);
                } else {
                    this.pnListDetailsData.push(...pnList);
                }
            }
        }
    }

    // 添加预测组
    public addPrediction() {
        this.pnListDetailsData.push({ 'pnList': [] });
    }

    public startPredicton(id) {
        const btnSearchArr = [...Array.from(document.querySelectorAll('input[searchbtnortext=true]'))];
        const ele = document.querySelector(`#${id}`);
        if (ele.className.includes('active')) {
            const notExist = new Set();
            const arr = [...Array.from(document.querySelectorAll('.searchInput')), ...Array.from(document.querySelectorAll('.btnSearch')), ...Array.from(document.querySelectorAll('.btnBg'))];

            if (arr.some((item) => ((item.getAttribute('exist') && item.getAttribute('exist') === 'false') && lenovoPublic.trim(item['value'], 1).length !== 0))) {
                arr.map((item) => {
                    if ((item.getAttribute('exist') && item.getAttribute('exist') === 'false') && lenovoPublic.trim(item['value'], 1).length !== 0) {
                        notExist.add(lenovoPublic.trim(item['value'], 1));
                    }
                });

                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: `当前存在输入不正确的编号，先进行修改${Array.from(notExist).join(';')}`,
                        style: {}
                    }]
                }, 'alert');
                // alert('当前存在输入不正确的编号，先进行修改' + Array.from(notExist).join(';'));
                return;
            }


            if (btnSearchArr.every((item) => !lenovoPublic.trim(item['value']))) {
                this.tooltipBoxService.setTooltipBoxInfo({
                    message: [{
                        text: `请输入编号`,
                        style: {}
                    }]
                }, 'alert');
                // alert('请输入编号');
                return;
            }


            let addUpPnCodeIndex = 0;
            this.pnListDetailsData
                .map((cont, contIndex) => {
                    cont.pnList.map((param, paramIndex) => {
                        if (lenovoPublic.trim(btnSearchArr[addUpPnCodeIndex]['value'], 1).length === 0) {
                            cont.pnList.splice(paramIndex, 1, '');
                        }
                        addUpPnCodeIndex++;
                    });

                    cont.pnList = cont.pnList.filter((param, paramIndex) => {
                        return param;
                    });

                });

            this.pnListDetailsData = this.pnListDetailsData.filter((item, itemIndex) => {
                return item.pnList.length;
            });

            // if (lenovoPublic.findSelfPnListIsRepeat(this.pnListDetailsData)) {
            //     alert('当前pn存在重复，请更改');
            //     return;
            // }
            this.dataManageService.setSaveSingleOrBatchPnList(this.pnListDetailsData);
            this.dataManageService.delSaveBatchSortedData();
            this.router.navigate(['/batchPrediction/batchDetails']);
        } else {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: `请输入编号`,
                    style: {}
                }]
            }, 'alert');
            // alert('请输入编号');
        }
        // router
    }

    // 判断当前是否显示提示信息编号不存在
    public numNotExitsIsShow() {
        const arr = [...Array.from(document.querySelectorAll('.searchInput')), ...Array.from(document.querySelectorAll('.btnSearch'))];
        return {
            'display': arr.some((item) => ((lenovoPublic.trim(item['style'].color, 1) === lenovoPublic.trim('rgb(255, 131, 78)', 1)) || (lenovoPublic.trim(item['style'].color, 1) === lenovoPublic.trim('#FF834E', 1)))) ? 'inline-block' : 'none',
        };
    }

    // 是否允许点击预测按钮
    public isDisabledStartPrediction() {
        lenovoPublic.publicSetTimeout('isDisabledStartPrediction', 300, () => {
            const id = 'batchStartPrediction';
            const ele = document.querySelector(`#${id}`);
            const btnSearchArr = [...Array.from(document.querySelectorAll('input[searchbtnortext=true]'))];
            const isAllowPrediction = this.pnListDetailsData.reduce((total, curValue, curIndex, arr2) => [...total, ...curValue.pnList], []).length >= 1 && btnSearchArr.some((item) => (lenovoPublic.trim(item['value']) && item['type'] === 'button'));
            if (ele) {
                if (isAllowPrediction) {
                    ele.classList.add('active');
                } else {
                    ele.classList.remove('active');
                }
            }
            lenovoPublic.publicClearTimeout('isDisabledStartPrediction');
            if (id) {
                return {};
            }
        });
    }

    // tslint:disable-next-line:member-ordering
    fileList = [];
    // tslint:disable-next-line:member-ordering
    isShowUploadComponent = false; // 显示拖拽上传组件
    getFile() {
        this.isShowUploadComponent = true; // 显示拖拽上传组件
        // lenovoPublic.getFile(this.uploadExcel, this);
    }

    uploadExcel(vm, callback) {
        const form = document.forms.namedItem('fileinfo');
        const oData = new FormData(form);
        oData.append('file', vm.fileList[0]);
        lenovoPublic.isShowGetJsonLoading(true);
        vm.getJsonService.getBatchForcastByFile(oData,
            (data) => {
                lenovoPublic.selfLog2(() => console.log(data));
                if (data) {
                    data = data.data;
                    data.map((item) => {
                        const arr = [];
                        const isExist = [];
                        item.forcastCodes.map((cont) => {
                            arr.push(cont.code);
                            isExist.push(cont);
                        });

                        // lenovoPublic.selfLog2(() => console.log(vm.pnListDetailsData.every((param) => {
                        //     return param.pnList.length !== 0;
                        // })));
                        if (vm.pnListDetailsData.every((param) => param.pnList.length !== 0)) {
                            vm.pnListDetailsData.push({ pnList: [...arr], isExist });
                        } else {
                            for (let i = 0; i < vm.pnListDetailsData.length; i++) {
                                if (vm.pnListDetailsData[i].pnList.length === 0) {
                                    vm.pnListDetailsData.splice(i, 1, { pnList: [...arr], isExist });
                                    break;
                                }
                            }
                        }
                    });
                    lenovoPublic.isShowGetJsonLoading();
                }
                // tslint:disable-next-line:no-unused-expression
                callback && callback();
                this.closeDragUpload(); // 隐藏拖拽上传组件
                lenovoPublic.selfLog2(() => console.log(vm.pnListDetailsData));
            },
            (error) => {
                lenovoPublic.isShowGetJsonLoading();
                // tslint:disable-next-line:no-unused-expression
                callback && callback();
                this.closeDragUpload(); // 隐藏拖拽上传组件
                lenovoPublic.selfLog2(() => console.log(error));
            });
    }
    // 拖拽上传drop事件
    private dropedEvent(param) {
        this.fileList = param[0];
        const callback = param[1];
        this.uploadExcel(this, callback);
    }
    // 关闭拖拽上传组件
    private closeDragUpload() {
        this.isShowUploadComponent = false; // 是否显示拖拽上传组件
    }


    // 抽出子组件的联想框到父组件中-------start
    // tslint:disable-next-line:member-ordering
    pnArr: Array<string> = [];
    // tslint:disable-next-line:member-ordering
    pnIndex = 0;
    // tslint:disable-next-line:member-ordering
    changeOr: HTMLInputElement;
    // tslint:disable-next-line:member-ordering
    keyWord: HTMLInputElement;
    // tslint:disable-next-line:member-ordering
    curIndex: number = 0; // 当前联想的是哪一个输入框的内容
    getCode(changeOr, pnCont) {
        this.singleSearchComponent['_results'][this.curIndex].getCode(this.changeOr, pnCont);
    }

    batchSearchWatchPnArrAndPnindexAndChangeOr(param) {
        [this.pnArr, this.pnIndex, this.changeOr, this.keyWord, this.curIndex] = [param.pnArr, param.pnIndex, param.changeOr, param.keyWord, param.curIndex];

        if (lenovoPublic.isArray(this.pnArr) && this.pnArr.length !== 0) {
            document.querySelector('#searchArea')['style'].overflowY = 'hidden';
        } else {
            document.querySelector('#searchArea')['style'].overflowY = 'auto';
        }
    }
    // 抽出子组件的联想框到父组件中-------end
}
