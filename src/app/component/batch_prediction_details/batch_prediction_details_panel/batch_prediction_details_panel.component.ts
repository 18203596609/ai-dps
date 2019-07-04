import { Component, OnInit, Input, AfterViewInit, HostListener, EventEmitter, Output, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataManageService } from '../../../shared/service';
declare const $, lenovoPublic;
@Component({
    selector: 'app-batch-prediction-details-panel',
    templateUrl: './batch_prediction_details_panel.component.html',
    styleUrls: ['./batch_prediction_details_panel.component.scss']
})

export class BatchPredictionDetailsPanelComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() allData: any = [{}];
    @Output() changeParentData = new EventEmitter();
    getCurActivePanelIndex = {
        diagram: -1, // 当前预览的是哪一个图表
        moreInfo: -1, // 当前展开的是哪一个的详情
    };
    showMoreInfoData = []; // 显示详情的信息的数据  // 记录当前点击的是哪一个panel标签

    isShowChart = false; // 是否显示预览图表
    chartData;
    allTimeout = [];

    constructor(
        private router: Router,
        private dataManageService: DataManageService,
    ) { }


    ngOnInit() {
        window.addEventListener('click', this.eventListenerWindowClick);
    }

    ngOnChanges(changes): void {
        lenovoPublic.selfLog2(() => console.log(changes));
    }

    ngAfterViewInit(): void {
        this.sortable();
        this.resize();
    }

    // 初始化时设置默认预测曲线
    public initSetDefPredLine() {
        lenovoPublic.selfLog2(() => console.log(this.allData));
        this.allData.map((item, itemIndex) => {
            lenovoPublic.selfLog2(() => console.log(item));
            if (item.projectModelIsNull) {
                let curClickNum = 0;
                const curItem = item.fcSelect.find((cont, contIndex) => {
                    curClickNum = contIndex;
                    lenovoPublic.selfLog2(() => console.log(item.currentPredLineId, cont.id));
                    return item.currentPredLineId === cont.id;
                });
                lenovoPublic.selfLog2(() => console.log(curClickNum));
                // this.changeParentData.emit({ type: 'setDefPredictionLine', data: { curItem: curItem } });
                this.getCurValue(document.querySelector('#bgcolor' + itemIndex), document.querySelector('#selectValue' + itemIndex), 'selectOptionLiId' + itemIndex + curClickNum, 0, curItem, null, false);
            }
        });
    }

    // 拖拽排序
    private sortable() {
        const vm = this;
        const batchPredictionPanelBody = document.querySelector('#batchPredictionPanelBody');

        let isUpdate = false; // 设置是否需要进行排序，即当前是否鼠标划回了拖拽元素
        let [pageX, pageY, eleLeft, eleTop, eleRight, eleBottom, parentScrollTop] = [0, 0, 0, 0, 0, 0, 0]; // 初始化位置
        let sideBarW;
        let htmlFontSize;


        $('.sortable').sortable({
            containment: '#batchPredictionPanelBody',
            cursor: 'move',
            opacity: 0.5,
            tolerance: 'pointer',
            items: '.panel-waper',
            helper: function (event, ele) {
                lenovoPublic.selfLog2(() => console.log(event, ele));
                const _original = ele.children();
                const _helper = ele.clone();
                // _helper.children().each(function (index) {
                //   $(this).width(_original.eq(index).width());
                // });
                return _helper;
            },
            placeholder: 'ui-sortable-placeholder-hide', // 是否显示占位符，显示占位符后容易出现问题，无法解决

            // placeholder: 'ui-sortable-placeholder',
            out() {
                lenovoPublic.selfLog2(() => console.log('out'));
            },
            start(event, ui) {
                vm.setMoreInfoData('clear', undefined);
                const ele = document.querySelector(`#${ui.helper[0].id}`);
                const eleChild = document.querySelector(`#${ui.helper[0].id}`).children[0];
                sideBarW = parseInt(document.querySelector('#batchPrediction').querySelector('.left')['style'].width, 10);
                htmlFontSize = parseFloat(document.querySelector('html').style.fontSize);

                lenovoPublic.setCss(ele, {
                    display: 'block',
                    border: '2px dashed #4ECEFF',
                    opacity: 0.7,
                    boxShadow: '0 1px 11px 0 rgba(204,214,223,0.22)',
                    borderRadius: '8px'
                });
                lenovoPublic.setCss(eleChild, {
                    display: 'none',
                    background: '#F5F6F9'
                });

                // 初始化参数位置等
                [pageX, pageY, eleLeft, eleTop, eleRight, eleBottom, parentScrollTop] = [event.pageX, event.PageY, ele['offsetLeft'], ele['offsetTop'], ele['offsetLeft'] + ele['offsetWidth'], ele['offsetTop'] + ele['offsetHeight'], batchPredictionPanelBody.scrollTop];

                lenovoPublic.selfLog2(() => console.log('start'));
            },
            sort(event, ui) {
                isUpdate = true;
                // 更新滚轮的top值
                [pageX, pageY, parentScrollTop] = [event.pageX, event.pageY, batchPredictionPanelBody.scrollTop];

                if (pageX > eleLeft + sideBarW * htmlFontSize && pageX < eleRight + sideBarW * htmlFontSize) {
                    if (pageY + parentScrollTop > eleTop && pageY + parentScrollTop < eleBottom) {
                        lenovoPublic.selfLog2(() => console.log('落在里边了12'));
                        isUpdate = false;
                    }
                }
                lenovoPublic.selfLog2(() => console.log('sort'));
            },
            // change(event, ui) {
            //     lenovoPublic.selfLog2(() => console.log('change'));
            // },
            // beforeStop(event, ui) {
            //     lenovoPublic.selfLog2(() => console.log(event, ui));
            //     lenovoPublic.selfLog2(() => console.log('beforeStop'));
            // },
            stop(event, ui) {
                lenovoPublic.selfLog2(() => console.log(isUpdate));
                if (!isUpdate) {
                    lenovoPublic.selfLog2(() => console.log('进来了'));
                    $(this).sortable('cancel');
                }

                const ele = document.querySelector(`#${ui.item[0].id}`);
                const eleChild = document.querySelector(`#${ui.item[0].id}`).children[0];

                lenovoPublic.setCss(ele, {
                    empty: true
                });
                lenovoPublic.setCss(eleChild, {
                    empty: true
                });
                lenovoPublic.selfLog2(() => console.log('stop'));
                vm.getSortedData();
            },
            update() {
                lenovoPublic.selfLog2(() => console.log('update'));
            },
        });
        $('.sortable').disableSelection();
    }


    // 在拖拽面板排序后进行数据排序并保存，以在切换list时显示已经排序完成的数据
    private getSortedData() {
        const cloneParentData = [];
        this.allData.map((item, itemIndex) => {
            cloneParentData[cloneParentData.length] = Object.assign({}, item);
            cloneParentData[cloneParentData.length - 1]['originSort'] = itemIndex;
        });

        const panelArr = document.querySelector('#batchPredictionPanelBody').querySelectorAll('.panel-waper');

        Array.from(panelArr).map((item, itemIndex) => {
            const num = Number(item.id.split('sortableChild')[1]);
            cloneParentData[num]['sortId'] = itemIndex;
        });

        lenovoPublic.selfLog2(() => console.log(cloneParentData));
        this.changeParentData.emit({ type: 'getSortedDataOriginPanel', data: cloneParentData });
    }

    // 点击复选框选择面板
    selectPanel(item) {
        item.isChecked = !item.isChecked;
        if (!item.isChecked) {
            this.changeParentData.emit({ type: 'isAllSelect', data: false });
        }
        if (!this.allData.some((cont) => !cont['isChecked'])) {
            this.changeParentData.emit({ type: 'isAllSelect', data: true });
        }
    }


    // pnCode号码详情是否显示
    public pnCodeDetailsIsShow(event, isShow) {
        const ele = event.target;
        const className = ele.className;
        if (isShow) {
            className.includes('pnCode-title') ? lenovoPublic.setCss(ele, {
                display: 'block',
            }) : lenovoPublic.setCss(ele.nextElementSibling, { display: 'block' });
        } else {
            className.includes('pnCode-title') ? lenovoPublic.setCss(ele, {
                display: 'none',
            }) : lenovoPublic.setCss(ele.nextElementSibling, { display: 'none' });
        }
    }

    // 动态设置历史面板、指标等参数面板的top值
    // public getPanelParamTop(i) {
    //     if (document.querySelector(`#sortableChild${i}`)) {
    //         const eleOffsetTop = document.querySelector(`#sortableChild${i}`)['offsetTop'];
    //         const htmlFontSize = parseFloat(document.querySelector('html').style.fontSize);
    //         return {
    //             top: (eleOffsetTop / htmlFontSize + 212 / 20 + 23 / 20) + 'rem'
    //         };
    //     } else {
    //         return { top: '0rem' };
    //     }
    // }

    resize() {
        window.addEventListener('resize', () => {
            lenovoPublic.publicClearTimeout('detailsDataPanelResize');
            lenovoPublic['detailsDataPanelResize'] = setTimeout(() => {
                this.getPanelParamTop();
            }, 200);
        });
    }

    public getPanelParamTop() {
        if (!this.getCurActivePanelIndex) {
            return {};
        }
        if (!this.getCurActivePanelIndex.moreInfo && this.getCurActivePanelIndex.moreInfo !== 0) {
            return {};
        }
        const i = this.getCurActivePanelIndex.moreInfo;
        if (document.querySelector(`#sortableChild${i}`)) {
            const eleOffsetTop = document.querySelector(`#sortableChild${i}`)['offsetTop'];
            const htmlFontSize = parseFloat(document.querySelector('html').style.fontSize);
            const paramAreaEle = document.querySelector('.param-area');
            const top = (eleOffsetTop / htmlFontSize + 212 / 20 + 23 / 20) + 'rem';
            // tslint:disable-next-line:no-unused-expression
            if (paramAreaEle && paramAreaEle['style']) {
                paramAreaEle['style'].top = top;
            }
            return {
                top
            };
        } else {
            return {};
        }
    }

    // 显示更多信息
    public showMoreInfo(item, index) {
        if (!item.projectModelIsNull && !item.isShowMoreInfo) {
            if (confirm('当前无详情信息，是否继续查看？？？？')) {

            } else {
                return;
            }
        }
        this.setMoreInfoData('clear', undefined);
        this.allData.map((cont, contIndex) => {
            // tslint:disable-next-line:no-unused-expression
            if (item.id === cont['id']) {
                if (item['isShowMoreInfo']) {
                    cont['isShowMoreInfo'] = false;
                    this.setMoreInfoData(contIndex, undefined);
                } else {
                    cont['isShowMoreInfo'] = true;
                    this.setMoreInfoData(contIndex, cont);
                }
            } else {
                cont['isShowMoreInfo'] = false;
                this.setMoreInfoData(contIndex, undefined);
            }
        });
        this.setCurActivePanelIndex(undefined, index);
    }


    // 鼠标滑上panel事件
    mouseoverPanel(index) {
        // this.setCurActivePanelIndex(index, index);
    }

    // 鼠标滑出panel事件
    mouseoutPanel(index) {
        // this.setCurActivePanelIndex(index, index);
    }

    // 鼠标划上预览  显示图表
    private previewChartShow(event, data) {
        clearTimeout(this.allTimeout['chart']);
        this.isShowChart = true;
        $('.chart_box').addClass('chart_box_show');
        this.chartData = data;
        lenovoPublic.selfLog2(() => console.log(event, data));
        this.allTimeout['chart'] = setTimeout(() => {
            $('.chart_box').css({ 'top': (event.clientY - 43) + 'px', 'left': (event.clientX / 2.5) + 'px' });
            $('.chart_box').show();
        }, 10);
    }

    // 鼠标移出预览 隐藏图表
    private previewChartNot(event) {
        this.isShowChart = false;
    }

    // 点击修改按钮执行跳转到详情页面
    public modifiCurGroup(item) {
        lenovoPublic.selfLog2(() => console.log([...item.pnList]));
        this.dataManageService.setSaveSingleOrBatchPnList([...item.pnList], 'saveBatchSingleDetailsPnList');
        this.router.navigate(['/batchPrediction/batchSingleDetails']);
    }


    // 显示保存预测线弹框
    public isHideSavePop(event, isShow) {
        if (isShow) {
            // const arr = Array.from(this.curPageAllLineLastTimeBuy);
            // if (arr.includes(this.last_time_buy)) {
            //     alert('当前last_time_buy已存在，请重新获取');
            //     return;
            // }
            const curIndex = parseInt(event.target.getAttribute('index'), 10);
            const name = lenovoPublic.trim(document.querySelector(`#selectValue${curIndex}`).innerHTML, 1);
            this.changeParentData.emit({ type: 'changePlaceHolder', data: { name } });
            // this.setDiagramParameterToShowData({ type: 'updateSaveLinesPlaceHolder', data: { index: this.curIndex }, isPush: true });
            const saveLineBtns = document.querySelectorAll('.batchSaveLineBtn');
            Array.from(saveLineBtns).map((item) => {
                item.setAttribute('batchSaveLineBtn', 'false');
            });
            event.target.setAttribute('batchSaveLineBtn', 'true');
        }

        this.changeParentData.emit({ type: 'isShowSaveLinePop', data: { isShow } });
    }



















    // 动态修改icon
    private changeSelectIcon(isBlock, element) {
        if ($(element).parents('.dropdown').find('.select-option').css('display') !== 'block') {
            element.classList.remove('icon-top');
        } else if ($(element).parents('.dropdown').find('.select-option').css('display') === 'block' || $(event.target).parents('.dropdown').find('.select-option').css('display') === 'inline-block') {
            element.classList.add('icon-top');
        }
    }

    // 动态修改选择框内的色块值
    private changeSelectColor(id) {
        const dom = document.querySelector(`#${id}`);
        if (dom) {
            dom['style']['backgroundColor'] = dom['getAttribute']('bgcolor');
        }
    }

    // 是否显示当前下啦选择框
    public showCurPredictionLineSelect(event) {
        if ($(event.target).parents('.dropdown').find('.select-option').css('display') !== 'none') {
            $(event.target).parents('.dropdown').find('.select-option').hide();
        } else {
            $('.select-option').hide();
            $(event.target).parents('.dropdown').find('.select-option').show();
        }
    }



    // 获取到当前选择的值
    /**
     * @param selectColorArea 颜色值
     * @param selectValue 显示文字
     * @param curId 当前点击的id
     * @param index 点击的下标
     * @param cont 参数
     * @param pn pn号
     * @param isShowList 是否显示list列表
     */
    public getCurValue(selectColorArea, selectValue, curId, index, cont, pn, isShowList) {

        const getEle = document.querySelector('#' + curId);
        if (!getEle) {
            return;
        }
        const [selectColorAreaTag, selectValueTag] = [getEle.children[0], getEle.children[1]];
        selectColorArea.setAttribute('bgcolor', selectColorAreaTag.getAttribute('bgcolor'));
        selectValue.innerHTML = selectValueTag.innerHTML;
        if (isShowList) {
            this.showCurPredictionLineSelect({ target: document.querySelector(`#${curId}`) });
        }
        // const setParam = [selectValueTag.innerHTML, index, id, pn];
        // this.setSelectValue.emit(setParam);
        this.changeParentData.emit({ type: 'setDefPredictionLine', data: { curItem: cont } });
    }




    // tslint:disable-next-line:member-ordering
    leftpos = 0;
    // tslint:disable-next-line:member-ordering
    toppos = 0;
    @HostListener('document:mousemove', ['$event'])
    mousePos(event) {
        this.leftpos = event.pageX;
        this.toppos = event.pageY;
    }



    // 监听window的click事件
    private eventListenerWindowClick() {
        $('.select-option').hide();
    }

    ngOnDestroy() {
        window.removeEventListener('click', this.eventListenerWindowClick);
        for (const item of this.allTimeout) {
            clearTimeout(item);
        }
    }



    //  设置当前活跃的是哪一个面板
    private setCurActivePanelIndex(diagramIndex, moreInfoIndex) {
        if (diagramIndex || diagramIndex === 0) {
            this.getCurActivePanelIndex.diagram = diagramIndex;
        }
        if (moreInfoIndex || moreInfoIndex === 0) {
            this.getCurActivePanelIndex.moreInfo = moreInfoIndex;
        }
    }


    // 设置更多信息
    private setMoreInfoData(itemIndex: any, data?) {
        if (typeof itemIndex !== 'string') {
            this.showMoreInfoData[itemIndex] = data;
            this.showMoreInfoData = this.showMoreInfoData.filter((param) => {
                return param;
            });
        }
        if (itemIndex === 'clear') {
            this.showMoreInfoData.length = 0;
        }
    }

























































































































}
