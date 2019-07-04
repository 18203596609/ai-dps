import { Component, ElementRef, HostListener, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { DataManageService } from '../../../shared/service/data_manage.service';
import { GetJsonService } from '../../../shared/service/getJson.service';
import { TooltipBoxService } from '../../../shared/service/tooltipBox.service';
import { Router } from '@angular/router';
import { BatchPredictionDetailsComponent } from '../../batch_prediction_details/batch_prediction_details.component';
declare const $: any, lenovoPublic;

@Component({
    selector: 'app-batch-prediction-details-list',
    templateUrl: './batch_prediction_details_list.component.html',
    styleUrls: ['./batch_prediction_details_list.component.scss']
})

export class BatchPredictionDetailsListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() allData: any;
    tableHead = ['', '替换组编号', '替换组名称', '需求预测总量', '时间跨度', '平均月需求（件）', '成本价（人民币）', '操作', '状态', '更多'];
    isChecked = false;
    isShowMore = false;
    isShowChart = false;
    isAllChecked = false;
    chartData;
    allTimeout = [];
    trWidth;
    replaceValue;
    showMoreInfoData = []; // 显示详情的信息的数据  // 记录当前点击的是哪一个list标签
    saveSingle = {
        index: 0,
        ifSaveName: false,
        placeholderName: ''
    };
    constructor(
        private router: Router,
        private dataManageService: DataManageService,
        private getJsonService: GetJsonService,
        private tooltipBoxService: TooltipBoxService,
        private batchPredictionDetailsComponent: BatchPredictionDetailsComponent,
        private el: ElementRef
    ) { }
    ngOnInit() { }

    ngAfterViewInit() {
        lenovoPublic.selfLog2(() => console.log(this.allData, 'afterinit'));
        window.addEventListener('resize', () => {
            this.setHeadWidth();
        });
        this.isEnsure(); // 设置 确 字

        setTimeout(() => {
            this.setHeadWidth(); // 拖动表时设置宽度
            // $(function () {
            $('#batch_table_box').colResizable({
                liveDrag: true,
                // resizeMode: 'flex'
            });
            // });
        }, 1000);

    }

    /**
     * 拖动表时设置宽度
     */
    setHeadWidth() {
        clearTimeout(this.allTimeout['0']);
        this.allTimeout['0'] = setTimeout(() => {
            this.tableHead.map((item, i) => {
                $(`.table_cont_td${i}`).css('width', $(`.tHead_td${i}`).width() + 'px');
            });
        }, 1000);
    }

    // 点击上移
    moveUp(index, cont) {
        if (cont === 'up') {
            const arr = [...this.allData];
            if (index < 1) {
                return;
            } else {
                for (let i = 0; i < this.allData.length; i++) {
                    this.allData[index] = arr[index - 1];
                    this.allData[index - 1] = arr[index];
                }
            }
        } else {
            const arr = [...this.allData];
            if (index === this.allData.length - 1) {
                return;
            } else {
                for (let i = 0; i < this.allData.length; i++) {
                    this.allData[index] = arr[index + 1];
                    this.allData[index + 1] = arr[index];
                }
            }
        }
        lenovoPublic.selfLog2(() => console.log(index, this.allData));
    }

    // // 点击下移
    // moveDown(index) {

    // }

    /**
     * 鼠标hover在编号上时
     */
    public showTopOrBottom(event, dom, index) {
        $(`.part_number${index}`).css('display', 'none');
        $(`.toggle_top_bottom${index}`).css('display', 'inline-block');
        // $(`.part_cont_one${index} li`).css('background', 'rgba(148,158,182,0.2)');
        this.tableTrSort();
    }

    // 拖拽换行
    tableTrSort() {
        $('#batch_table_box').sortable({
            // containment: '#batch_prediction_box',
            delay: 1000,
            items: '.table_contTr',
            cursor: 'move',
            tolerance: 'pointer',
            // placeholder: 'ui-state-highlight'
            over(event, ui) {

            },
            sort(event, ui) {

            },
            stop(event, ui) {
                lenovoPublic.selfLog2(() => console.log(event, ui, 'stop'));


            }
        });
    }




    // 鼠标离开编号
    public hideTopOrBottom(index) {
        $(`.part_number${index}`).css('display', 'inline-block');
        $(`.toggle_top_bottom${index}`).css('display', 'none');
        $(`.part_cont_one${index} li`).css('background', '#fff');
    }

    /**
     *显示替换组编号详情
     */
    public showReplaceNum(event, index, dom, cont) {
        if (typeof cont === 'string') {
            this.replaceValue = cont.split(',').join(', ');
        } else {
            this.replaceValue = cont.join('; ');
        }
        $(`.${dom}`).hide();
        const top = $(`.${dom}`).parent().offset().top;
        const left = $(`.${dom}`).parent().offset().left;
        // tslint:disable-next-line:radix
        const height = parseInt($(`.table_cont`).css('height')) / 2;
        const x = $(`.${dom}`).parent().width();
        const y = $(`.${dom}`).parent().height();
        lenovoPublic.selfLog2(() => console.log(event, index, top, left, height, x, y, dom, cont, this.replaceValue));
        $(`.table_cont${index} td`).addClass('table_cont_hover');
        $(`.${dom}`).css({ 'display': 'block', 'top': (event.clientY - height) + 'px', 'left': (event.clientX + 15) + 'px' });
        // $(`.repNum_hover${index}`).css({ 'display': 'block', 'top': event.clientY, 'left': event.clientX });
        lenovoPublic.selfLog2(() => console.log($(`.repNum_hover${index}`).parent()[0].scrollTop));
        lenovoPublic.selfLog2(() => console.log($(`.repNum_hover${index}`).parent()[0].offsetTop));
        lenovoPublic.selfLog2(() => console.log(this.replaceValue));
    }

    /**
    *隐藏替换组编号详情
    */
    public hideReplaceNum(dom) {
        $(`.${dom}`).hide();
        $(`.table_cont td`).removeClass('table_cont_hover');
    }

    // 鼠标划上预览  显示图表
    private previewChartShow(event, data) {
        clearTimeout(this.allTimeout['chart']);
        clearTimeout(this.allTimeout['showChart']);
        this.isShowChart = false;
        if (data.projectModelIsNull) {
            this.chartData = data;
            this.allTimeout['showChart'] = setTimeout(() => {
                this.isShowChart = true;
            }, 10);
            lenovoPublic.selfLog2(() => console.log(event, data));
            this.allTimeout['chart'] = setTimeout(() => {
                $('.chart_box').css({ 'top': (event.clientY + 8) + 'px', 'left': (event.clientX / 2) + 'px' });
            }, 100);
        }
    }

    // 鼠标移出预览 隐藏图表
    private previewChartNot(event) {
        this.isShowChart = false;
        // $('.chart_box').css({ 'top': 0 + 'px', 'left': 0 + 'px' });
    }

    // 点击修改
    modifiCurGroup(item) {
        lenovoPublic.selfLog2(() => console.log([...item.pnList]));
        this.dataManageService.setSaveSingleOrBatchPnList([...item.pnList], 'saveBatchSingleDetailsPnList');
        this.router.navigate(['/batchPrediction/batchSingleDetails']);
    }


    // 点击单个保存

    clickSaveName(index) {
        this.saveSingle.index = index;
        this.saveSingle.ifSaveName = true;
        this.saveSingle.placeholderName = this.allData[index].curPredLineData.name;
    }

    // 保存线的名称
    getSaveName(param) {
        lenovoPublic.selfLog2(() => console.log(param));
        this.saveSingle.ifSaveName = false;
        if (!param) {
            return;
        } else {
            const params = {
                lineId: this.allData[this.saveSingle.index].curPredLineData.lineId,
                lineName: param.lineName,
                isUsed: param.isRecordLtbTime
            };
            this.getJsonService.setLineNameLineById(params, (data) => {
                lenovoPublic.selfLog2(() => console.log(data, '成功'));
            }, (err) => {
                lenovoPublic.selfLog2(() => console.log(err, '失败'));
            });
        }
    }

    // 显示更多信息
    public showMoreInfo(event, item, index) {
        clearTimeout(this.allTimeout['moreList']);
        const parentLeft = $('#batch_prediction_box').css('paddingLeft');

        $(`.select_down`).css('display', 'inline-block');
        $(`.select_up`).css('display', 'none');
        this.setMoreInfoData('clear', undefined);
        this.allData.map((cont, contIndex) => {
            // tslint:disable-next-line:no-unused-expression
            if (item.id === cont['id']) {
                if (item['isShowMoreInfo']) {
                    cont['isShowMoreInfo'] = false;
                    this.setMoreInfoData(contIndex, undefined);
                    this.isShowMore = false;
                    $(`.select_down${index}`).css('display', 'inline-block');
                    $(`.select_up${index}`).css('display', 'none');
                } else {
                    cont['isShowMoreInfo'] = true;
                    this.setMoreInfoData(contIndex, cont);
                    this.isShowMore = true;
                    $(`.select_down${index}`).css('display', 'none');
                    $(`.select_up${index}`).css('display', 'inline-block');

                    this.allTimeout['moreList'] = setTimeout(() => {
                        $('.moreList').css({ 'width': this.trWidth + 'px', 'top': (event.layerY + 50) + 'px', 'left': parentLeft });
                    }, 100);
                }
            } else {
                cont['isShowMoreInfo'] = false;
                this.setMoreInfoData(contIndex, undefined);
            }
        });
        // this.setCurActivePanelIndex(undefined, index);
        lenovoPublic.selfLog2(() => console.log(event, 'more'));

    }

    // 设置更多信息
    private setMoreInfoData(itemIndex: any, data?) {
        if (typeof itemIndex !== 'string') {
            this.showMoreInfoData[itemIndex] = data;
            this.showMoreInfoData = this.showMoreInfoData.filter((param) => {
                lenovoPublic.selfLog2(() => console.log(param, 'fhfgj'));
                return param;
            });
        }
        if (itemIndex === 'clear') {
            this.showMoreInfoData.length = 0;
        }
        lenovoPublic.selfLog2(() => console.log(this.showMoreInfoData, 'fhfgj'));
    }

    /**
     * 是否显示‘确’字
     */
    isEnsure() {
        clearTimeout(this.allTimeout['ensure']);
        this.allTimeout['ensure'] = setTimeout(() => {
            for (let i = 0; i < this.allData.length; i++) {
                for (const item of this.allData[i].projectModel.diagramLines) {
                    if (item.lineType.includes('keDiagramLineType_long_term_pred')) {
                        if (item.bUsed) {
                            $(`.batch_ensure${i}`).css('display', 'inline-block');
                        }
                    }

                }
            }
        }, 1000);
    }

    /**
     * 单击勾选单个
     */
    // tslint:disable-next-line:member-ordering
    checkNum = 0;
    clickChecked(data, index, isShow) {
        this.isAllChecked = false;
        // 判断是否一个都没选中
        if (!isShow) {
            this.checkNum++;
        } else {
            this.checkNum--;
        }
        if (this.checkNum === this.allData.length) {
            this.isAllChecked = true;
        }

        lenovoPublic.selfLog2(() => console.log(this.checkNum));
    }

    /**
     * 勾选全选
     */
    allChecked() {
        lenovoPublic.selfLog2(() => console.log(this.allData, '列表页全部数据'));
        this.allData.map((item) => {
            if (this.isAllChecked) {
                item.isChecked = false;
                this.checkNum = 0;
            } else {
                item.isChecked = true;
                this.checkNum = this.allData.length;
            }

        });
    }


    /**
     * 点击对比  进入对比页面
     */
    toComparisonPage(cont) {
        if (this.checkNum < 1) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '当前没有选中可对比组',
                    style: {}
                }]
            }, 'alert');
            // alert('当前没有选中可对比组');
        } else {
            if (cont === '对比') {
                this.batchPredictionDetailsComponent.startContrast();
            }
            // this.router.navigate(['/singlePrediction/singleComparisonDetails']);
        }
    }


    // 平均月需求 的高中低
    private nAverageMounthIsHighOrLow(num, element) {
        if (Number(num) < 8) {
            element.innerHTML = '低';
        } else if (Number(num) >= 8 && Number(num) < 40) {
            element.innerHTML = '中';
        } else {
            element.innerHTML = '高';
        }
    }

    // 成本价 的高中低
    private nCoustIsHighOrLow(num, element) {
        if (Number(num) < 100) {
            element.innerHTML = '低';
        } else if (Number(num) >= 100 && Number(num) < 450) {
            element.innerHTML = '中';
        } else {
            element.innerHTML = '高';
        }
    }

    ngOnDestroy() { }
    @HostListener('document:click', ['$event.target'])
    tableTdLine(target) {
        if (target.className === 'CRZ') {
            this.tableHead.map((item, i) => {
                $(`.table_cont_td${i}`).css('width', $(`.tHead_td${i}`).width() + 'px');
            }); // 拖动表时设置宽度
        }
    }
}
