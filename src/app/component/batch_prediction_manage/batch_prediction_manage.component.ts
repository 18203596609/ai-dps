import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UpdataSubjectService } from '../../shared/service/updata_subject.service';
import { DataManageService } from '../.../../../shared/service/data_manage.service';
import { TooltipBoxService } from '../.../../../shared/service/tooltipBox.service';
import { Router } from '@angular/router';
declare const $: any, lenovoPublic;
@Component({
    selector: 'app-batch-prediction-manage',
    templateUrl: './batch_prediction_manage.component.html',
    styleUrls: ['./batch_prediction_manage.component.scss']
})

export class BatchPredictionManageComponent implements OnInit, AfterViewInit, OnDestroy {
    getBathComparisonManage$; // 接收预测页面发送的数据
    isAllChecked = false;
    allTimeout = [];
    allData;
    isAmeng = false;
    pnListData;
    amendBtnList: any = false;
    AmengOrFinish = [];
    isChecked = [];
    delAmount = 0;
    constructor(
        private updataSubjectService: UpdataSubjectService,
        private dataManageService: DataManageService,
        private tooltipBoxService: TooltipBoxService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getData();


    }

    ngAfterViewInit() {
        this.setHeadWidth();
        window.addEventListener('resize', () => {
            this.setHeadWidth();
        });

    }

    /**
     * 设置表头的宽度
     */
    setHeadWidth() {
        clearTimeout(this.allTimeout['0']);
        this.allTimeout['0'] = setTimeout(() => {
            const trWidth = $('.details_del_table ul').width();
            const tableHeadW = $('.details_table_head').width();
            $('.details_table_head').css('width', trWidth + 'px');
            lenovoPublic.selfLog2(() => console.log(trWidth, tableHeadW));
        }, 50);

    }

    /**
     * 修改编号
     */
    amengNum(index) {
        $(`.replace_num`).css('z-index', 10);
        this.AmengOrFinish[index] = false;
        $(`.replace_num${index}`).css('z-index', 15);
    }

    // 完成修改
    finishAmend(index) {
        this.AmengOrFinish[index] = true;
        if (!this.amendBtnList) {
            return;
        } else {
            this.pnListData[index].pnList = this.amendBtnList;
            this.dataManageService.setSaveSingleOrBatchPnList(this.pnListData);
            this.amendBtnList = false;
        }
        lenovoPublic.selfLog2(() => console.log(this.pnListData, this.amendBtnList));

    }

    // 取消操作
    cancel(index) {
        this.AmengOrFinish[index] = true;
    }

    /**
     * 获取从列表或图表中发送的数据
     *  */
    getData() {
        // 获取所有数据
        if (!this.getBathComparisonManage$) {
            this.getBathComparisonManage$ = this.updataSubjectService.getBathComparisonManageSubject().subscribe(data => {
                this.allData = data;
                lenovoPublic.selfLog2(() => console.log(data));
            });
        }

        // 获取缓存里的pnList
        this.pnListData = this.dataManageService.getSaveSingleOrBatchPnList();
        for (let i = 0; i < this.pnListData.length; i++) {
            this.AmengOrFinish[i] = true;
            this.isChecked[i] = false;
        }
        lenovoPublic.selfLog2(() => console.log(this.pnListData, this.AmengOrFinish));

    }

    // 从search组件获取修改后的pnList
    getBtnListS(param) {
        this.amendBtnList = param; // 获取所有修改过的pnList
        lenovoPublic.selfLog2(() => console.log(param, 'btnList'));

    }

    // 单个选中
    singleCheck(index, bol) {
        this.isAllChecked = false;
        if (bol) {
            this.delAmount--;
        } else {
            this.delAmount++;
        }
        if (this.delAmount === this.pnListData.length) {
            this.isAllChecked = true;
        }
        lenovoPublic.selfLog2(() => console.log(this.delAmount, bol));
    }

    /**
     * 全选按钮
     */
    allChecked() {
        for (let i = 0; i < this.isChecked.length; i++) {
            if (this.isAllChecked) {
                this.isChecked[i] = false;
                this.delAmount = 0;
            } else {
                this.isChecked[i] = true;
                this.delAmount = this.isChecked.length;
            }
        }
        lenovoPublic.selfLog2(() => console.log(this.isAllChecked, this.isChecked));
    }

    /**
     * @param bol 判断是否有选中删除项
     * @param index 判断是表格的内的删除还是表格下的
     */
    clickDel(bol?, index?) {
        // 单击表格下面的删除
        if (!bol && index < 0 && this.delAmount > 0) {
            lenovoPublic.selfLog2(() => console.log(this.isChecked));
            const arr = [];
            for (let i = 0; i < this.isChecked.length; i++) {
                if (this.isChecked[i]) {
                    this.pnListData[i] = this.isChecked[i] = this.AmengOrFinish[i] = '';
                }
            }
            this.pnListData = this.pnListData.filter((item) => {
                return item !== '';
            });
            this.isChecked = this.isChecked.filter((item) => {
                return item !== '';
            });
            this.AmengOrFinish = this.AmengOrFinish.filter((item) => {
                return item !== '';
            });
            this.delAmount = 0;
            this.isAllChecked = false;
        } else if (!bol && index < 0) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '未选中可删除的项',
                    style: {}
                }]
            }, 'alert');
            // alert('未选中可删除的项');
            return;
        } else if (bol && index > -1) { // 单击表格行内的删除
            this.pnListData.splice(index, 1);
            this.isChecked.splice(index, 1);
            this.AmengOrFinish.splice(index, 1);
            this.delAmount--;
        }
        this.dataManageService.setSaveSingleOrBatchPnList(this.pnListData);
        lenovoPublic.selfLog2(() => console.log(index, this.pnListData, this.isChecked, this.AmengOrFinish));

        // 如果全部删除则跳至搜索页
        if (this.pnListData.length < 1) {
            this.router.navigate(['/batchPrediction']);
        }
    }


    /**
     * 返回上一页
     */
    goBack() {
        history.go(-1);
    }


    ngOnDestroy() {
        for (const item of this.allTimeout) {
            clearTimeout(item);
        }
        if (this.getBathComparisonManage$) {
            this.getBathComparisonManage$.unsubscribe();
        }
    }
}
