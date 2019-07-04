import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, AfterViewInit } from '@angular/core';
import { GetJsonService } from '../../shared/service';
import { DataManageService } from '../../shared/service/data_manage.service';
import { CodebaseService } from '../../shared/service/codebase.service';
import { TooltipBoxService } from '../../shared/service/tooltipBox.service';
import { LoadingService } from '../../shared/service/loading.service';
import { Router, Route } from '@angular/router';
declare var $: any, lenovoPublic;
// import { fromEvent } from 'rxjs/observable/fromEvent';
// import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
    selector: 'app-single-search',
    templateUrl: './single_search.component.html',
    styleUrls: ['./single_search.component.scss']
})

export class SingleSearchComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() parentDataObj; // 遍历循环时的父组件的传值
    @Input() curIndex; // 遍历循环时避免id重复，下标拼接
    @Input() applyMode = ''; // 使用组件的模型，额外定义样式
    @Input() isAllowChange = false; // 对比组管理时判断当前是否允许修改和删除操作
    @Input() isAmeng; // 判断是否启用input的操作
    getCodeBySearch$; // 获取值
    // @Output() startPredictionBtn = new EventEmitter();
    @Output() comparisonDetailsClosePredictionClick = new EventEmitter();
    @Output() comparisonDetailsStartPredictionClick = new EventEmitter();
    @Output() batchDetailsClosePredictionClick = new EventEmitter();
    @Output() batchDetailsStartPredictionClick = new EventEmitter();
    // tslint:disable-next-line:no-output-rename
    @Output('exportEvent') singlePredictionSearchExportEvent = new EventEmitter();
    // tslint:disable-next-line:no-output-rename
    @Output('startPredictionEvent') singlePredictionSearchStartPredictionEvent = new EventEmitter();
    @Output() batchManageBtnList = new EventEmitter();

    @Output() batchSearchWatchPnArrAndPnindexAndChangeOr = new EventEmitter();

    saveCurBtnList; // 保存当前点击的是哪一个pn----在clickBtn中使用
    showPNList = false;
    searchName;
    keyWord;
    pnIndex = 0;
    btnList = [];

    pnArr: any = [];
    pnList: any = [];
    clickTimeId; // 定时器
    numTimer;
    showNum = false;
    notNum = false;
    singleBJ;
    singleBJIndex;
    changeOr;
    clearAllsetTime: any;
    btnClickHistory = [];
    focusTime;
    constructor(
        private getJson: GetJsonService,
        private dataManageService: DataManageService,
        private codebaseService: CodebaseService,
        private tooltipBoxService: TooltipBoxService,
        private loadingService: LoadingService,
        private router: Router,
    ) { }
    ngOnInit() {
        {
            // 获取到当前是在AI预测还是人工预测
            if (!this.applyMode && this.dataManageService.curSingleOrBatchOrHistory() === 'AIPrediction') {
                this.applyMode = 'AIPrediction';
            } else if (!this.applyMode && this.dataManageService.curSingleOrBatchOrHistory() === 'humanPrediction') {
                this.applyMode = 'humanPrediction';
            }
        }
        lenovoPublic.selfLog2(x => console.log(this.applyMode));

        lenovoPublic.selfLog2(() => console.log(this.isAllowChange, this.isAmeng, 'oninit'));
        this.btnList = this.parentDataObj ? this.parentDataObj['pnList'] : this.btnList;
        this.addeventListener();

        {
            // 从缓存中获取pn列表
            if ((!this.applyMode ||
                this.applyMode === 'AIPrediction' ||
                this.applyMode === 'humanPrediction' ||
                this.applyMode === 'singlePredictionDetailsSearch' ||
                this.applyMode === 'AIPredictionDetailsSearch' ||
                this.applyMode === 'humanPredictionDetailsSearch') &&
                this.dataManageService.getSaveSingleOrBatchPnList()) {
                this.btnList = [];
                for (let i = 0; i < this.dataManageService.getSaveSingleOrBatchPnList().length; i++) {
                    this.btnList.push(this.dataManageService.getSaveSingleOrBatchPnList()[i]);
                }
            }
        }
    }

    // 判断当前btnList是否为空,用于监听预测按钮的样式
    private btnListIsExist() {
        return this.parentDataObjIsExist() ? Array.from(document.querySelector(`#${this.parentDataObjIsExist()}`).querySelectorAll('input[type=button]')).length : Array.from(document.querySelector(`#searchSelf`).querySelectorAll('input[type=button]')).length;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setInputFocus();
        }, 500);
    }

    ngOnChanges(change): void {
        const vm = this;
        lenovoPublic.selfLog2(() => console.log(change));

        // 判断从外部导入pn列表时是否存在并进行设置
        (function (changes) {
            setTimeout(() => {
                if (changes.parentDataObj) {
                    [changes.parentDataObj.currentValue].map((item) => {
                        if (item.isExist && document.querySelector(`#${vm.parentDataObjIsExist()}`)) {
                            // lenovoPublic.selfLog2(() => console.log(document.querySelector(`#${vm.parentDataObjIsExist()}`), vm.parentDataObjIsExist()));
                            const ipt = document.querySelector(`#${vm.parentDataObjIsExist()}`).querySelectorAll('input');
                            item.isExist.map((cont) => {
                                Array.from(ipt).map((param) => {
                                    if (lenovoPublic.trim(cont.code) === param.value && !cont.bExist) {
                                        lenovoPublic.selfLog2(() => console.log(cont.code, param.value, cont.bExist));
                                        param.setAttribute('exist', 'false');
                                        if (param.getAttribute('exist') && param.getAttribute('exist') === 'false') {
                                            param.style.color = '#FF834E';
                                            param.setAttribute('type', 'text');
                                            param.classList.add('btnSearch');
                                            param.classList.remove('btnBg');
                                        }
                                    }
                                });
                            });
                            lenovoPublic.selfLog2(() => console.log(ipt));
                        }
                    });
                }
            }, 100);
        })(change);
    }

    // 从批量预测输入框导入时如果导入了不存在的编号并且进行了修改需要设置exist参数为true
    setExist(searchCode) {
        if (searchCode.getAttribute('exist') && searchCode.getAttribute('exist') === 'false') {
            searchCode.setAttribute('exist', 'true');
        }
    }

    // 当前是否有父级组件传入数据
    private parentDataObjIsExist() {
        if (!this.parentDataObj) {
            return false;
        } else if (this.parentDataObj) {
            return this.applyMode + this.curIndex;
        }
    }

    private resize() {
        return () => {
            if (this.saveCurBtnList) {
                setTimeout(() => {
                    this.clickBtn(this.saveCurBtnList, null, null);
                }, 100);
            }
        };
    }



    addeventListener() {
        window.addEventListener('resize', this.resize());
    }
    removeeventListener() {
        window.removeEventListener('resize', this.resize());
    }

    // 设置input的自动focus事件
    setInputFocus() {
        const inputFocus: any = document.querySelector('#searchCode');
        inputFocus.focus();
        inputFocus.focus();
        inputFocus.focus();
        inputFocus.focus();
        inputFocus.focus();
        lenovoPublic.selfLog2(() => console.log(inputFocus, 'input的focus'));
    }

    // tslint:disable-next-line:member-ordering
    codeArr = Array.from(new Set([]));
    // codeArr = new Set([16, 18, 93, 32, 91, 17]);
    /**
     * 监听输入框的变化
     * @param value 预测的输入框的值
     */
    inputChanges(searchCode, code, index?) {
        console.log(event);
        if (event && (event.type === 'paste' || event.type === 'onpaste')) {

        }
        if (searchCode.type === 'button') {
            return;
        }

        lenovoPublic.selfLog2(x => console.log(searchCode, code, index));
        // lenovoPublic.selfLog2(() => console.log(searchCode.value.length, 5555555));
        if (this.codeArr.some((item) => +code === +item)) {
            lenovoPublic.selfLog2(() => console.log('不触发'));
            return;
        }


        this.changeOr = searchCode;
        this.showNum = false;
        this.notNum = false;
        searchCode.style.color = '#3F4659';
        this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .forecast`).attr({ 'disabled': false }) : $('.forecast').attr({ 'disabled': false });
        lenovoPublic.selfLog2(() => console.log(this.btnList));
        // $('.forecast').removeClass('disForcast');
        // 判断当前点击的是否是上下方向键，控制是否进行上下选择
        {
            const isAllowSearch = this.searchInput38Or40(searchCode, code);
            if (!isAllowSearch) {
                return;
            }
        }
        // input框为空时
        if (searchCode.value.length === 0) {
            this.pnArr = [];
            return;
        }

        // 输入;号时  按下回车键时
        if (code === 186 || code === 13) {
            this.pnArr = [];
            this.click186(searchCode, index, code);
            return;
        }

        this.keyWord = searchCode.value; // 标记当前输入的值是多少
        lenovoPublic.selfLog2(() => console.log(this.keyWord));
        // 获取code数据
        // lenovoPublic.isShowGetJsonLoading.call(this, true);
        this.getCodeBySearch$ = this.getJson.getCodeBySearch(searchCode.value, (data) => {
            this.pnArr = data.data;
            // lenovoPublic.isShowGetJsonLoading.call(this);
        }, (err) => {
            // lenovoPublic.isShowGetJsonLoading.call(this);
            lenovoPublic.selfLog2(() => console.log(err));
        });
    }

    // 复制粘贴事件
    pasteChanges(searchCode, code, event, index?) {
        lenovoPublic.publicSetTimeout('timeoutPasteEvent', 50, () => {
            const target = event.target;

            if (target.type === 'button') {
                return;
            }

            lenovoPublic.selfLog2(x => console.log(target, code, index));
            // lenovoPublic.selfLog2(() => console.log(target.value.length, 5555555));
            if (this.codeArr.some((item) => +code === +item)) {
                lenovoPublic.selfLog2(() => console.log('不触发'));
                return;
            }


            this.changeOr = target;
            this.showNum = false;
            this.notNum = false;
            target.style.color = '#3F4659';
            this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .forecast`).attr({ 'disabled': false }) : $('.forecast').attr({ 'disabled': false });
            lenovoPublic.selfLog2(() => console.log(this.btnList));
            // $('.forecast').removeClass('disForcast');
            // 判断当前点击的是否是上下方向键，控制是否进行上下选择
            {
                const isAllowSearch = this.searchInput38Or40(target, code);
                if (!isAllowSearch) {
                    return;
                }
            }
            // input框为空时
            if (target.value.length === 0) {
                this.pnArr = [];
                return;
            }

            // 输入;号时  按下回车键时
            if (code === 186 || code === 13) {
                this.pnArr = [];
                this.click186(target, index, code);
                return;
            }

            this.keyWord = target.value; // 标记当前输入的值是多少
            lenovoPublic.selfLog2(() => console.log(this.keyWord));
            // 获取code数据
            // lenovoPublic.isShowGetJsonLoading.call(this, true);
            this.getCodeBySearch$ = this.getJson.getCodeBySearch(target.value, (data) => {
                this.pnArr = data.data;
                // lenovoPublic.isShowGetJsonLoading.call(this);
            }, (err) => {
                // lenovoPublic.isShowGetJsonLoading.call(this);
                lenovoPublic.selfLog2(() => console.log(err));
            });
        });

    }

    btnFocus(val, box) {
        lenovoPublic.selfLog2(() => console.log(val));

        // const txt = box.createTextRange();
        // txt.moveStart('character', val.value.length);
        // txt.collapse(true);
        // txt.select();
        // lenovoPublic.selfLog2(() => console.log(txt, val.value.length));

    }

    searchBlur(event) {
        // const iptList = document.querySelector('#searchBtnBox').querySelectorAll('input');
        // this.btnList = [];
        // this.btnList = Array.from(iptList).filter((item, itemIndex) => {
        // lenovoPublic.selfLog2(() => console.log(item.value));
        //     return !item.value;
        // });
        // lenovoPublic.selfLog2(() => console.log(this.btnList));
        // Array.from(btnBox)
    }

    setSearFocus() {
        const btnSear = document.querySelector('.btnSearch');
        const inputSear = this.parentDataObjIsExist() ? document.querySelector(`#${this.parentDataObjIsExist()}`).querySelector('.searchInput') : document.querySelector('.searchInput');
        if (!btnSear) {
            setTimeout(() => {
                inputSear['focus']();
            }, 50);
        }
        lenovoPublic.selfLog2(() => console.log(btnSear, inputSear));
    }

    // search框focus事件
    searchFocus() {
        clearTimeout(this.focusTime);
        this.showNum = false;
        const btnSearch: any = this.parentDataObjIsExist() ? document.querySelector(`#${this.parentDataObjIsExist()}`).querySelectorAll('.btnSearch') : document.querySelectorAll('.btnSearch');

        if (btnSearch.length > 0) {
            this.focusTime = setTimeout(() => {
                this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .btnBg`).eq(this.btnClickHistory[this.btnClickHistory.length - 1].index).val(this.btnClickHistory[this.btnClickHistory.length - 1].value) : $('.btnBg').eq(this.btnClickHistory[this.btnClickHistory.length - 1].index).val(this.btnClickHistory[this.btnClickHistory.length - 1].value);
                this.pnArr = [];
            }, 10);
            this.singleBJ.type = 'button';
            this.singleBJ.classList.remove('bgTf', 'btnSearch');
            this.singleBJ.classList.add('btnBg');
            this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .btnBg`).css('color', '#3F4659') : $('.btnBg').css('color', '#3F4659');

            this.notNum = false;
        }
        lenovoPublic.selfLog2(() => console.log(btnSearch, 'focus', this.btnList));
        this.batchManageBtnList.emit(this.btnList);
    }

    // tslint:disable-next-line:member-ordering
    isContinuousCalls = false; // 是否允许连续调用接口
    // 点击分号执行
    click186(searchCode, index, code?) {
        // lenovoPublic.selfLog2(() => console.log(typeof searchCode.value[searchCode.value.length - 1], 67676));
        if (this.isContinuousCalls) {
            return;
        }
        this.isContinuousCalls = true;
        let searValue = '';
        if (searchCode.value[searchCode.value.length - 1] === ';' || code === 186) {
            searValue = searchCode.value.slice(0, searchCode.value.length - 1);
        } else {
            searValue = searchCode.value;
        }
        // lenovoPublic.selfLog2(() => console.log(searchCode, this.btnList, searValue));
        // 输入分号判断是否有该编号，没有则改变颜色
        // lenovoPublic.isShowGetJsonLoading.call(this, true);
        this.getCodeBySearch$ = this.getJson.getCodeBySearch(searValue, (data) => {
            lenovoPublic.selfLog2(() => console.log(data.data.length, 9999999));
            const dataArr = data.data;
            let findIndex = false;
            for (const item of dataArr) {
                if (searValue === item.code) {
                    // alert('true');
                    findIndex = true;
                }
            }
            if (!findIndex) {
                this.notNum = true;
                searchCode.style.color = '#FF834E';

                this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .forecast`).attr({ 'disabled': true }) : $('.forecast').attr({ 'disabled': true });
                // $('.forecast').addClass('disForcast');
            } else {
                this.notNum = false;
                if (searchCode.type === 'search') {
                    this.btnList.push(searValue);
                    this.setExist(searchCode);
                    searchCode.value = '';
                } else {
                    this.btnList[index] = searValue;
                    searchCode.type = 'button';
                    searchCode.value = searValue;
                    searchCode.classList.remove('btnSearch');
                    searchCode.classList.add('btnBg');

                    this.setExist(searchCode);
                }
            }
            lenovoPublic.selfLog2(() => console.log(this.btnList, 44444));
            this.isContinuousCalls = false;
            // lenovoPublic.isShowGetJsonLoading.call(this);
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log(err));
            this.isContinuousCalls = false;
            // lenovoPublic.isShowGetJsonLoading.call(this);
        });
        this.batchManageBtnList.emit(this.btnList);
        this.setSearFocus();
    }

    // click li get code
    getCode(searchCode, code, curIndex?) {
        // lenovoPublic.selfLog2(() => console.log(searchCode, code, curIndex, this.curIndex));
        const codeChild = code.parentNode.children;
        Array.from(codeChild, (item) => {
            item['classList'].remove('bg');
        });
        code.classList.add('bg');

        this.keyWord = searchCode.value;
        if (searchCode.type === 'search') {
            this.btnList.push(code.innerHTML);
            this.setExist(searchCode);
            searchCode.value = '';
        } else {
            this.btnList[this.singleBJIndex] = code.innerHTML;
            searchCode.type = 'button';
            searchCode.value = code.innerHTML;
            searchCode.classList.remove('btnSearch');
            searchCode.classList.add('btnBg');
            this.setExist(searchCode);
        }
        this.pnArr = [];
        this.batchManageBtnList.emit(this.btnList);
        this.setSearFocus();
    }


    // btn单击事件
    clickBtn(btn, event, index) {
        clearTimeout(this.clickTimeId);
        clearTimeout(this.focusTime);

        const btnSearch: any = this.parentDataObjIsExist() ? document.querySelector(`#${this.parentDataObjIsExist()}`).querySelectorAll('.btnSearch') : document.querySelectorAll('.btnSearch');
        lenovoPublic.selfLog2(() => console.log(this.btnList, 'dfjkgi', btnSearch));
        if (btn.type === 'button') {
            if (btnSearch.length > 0) {
                // 如果没有选择或者为空  让btn的value为改变前的
                this.focusTime = setTimeout(() => {
                    this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .btnBg`).eq(this.btnClickHistory[this.btnClickHistory.length - 1].index).val(this.btnClickHistory[this.btnClickHistory.length - 1].value) : $('.btnBg').eq(this.btnClickHistory[this.btnClickHistory.length - 1].index).val(this.btnClickHistory[this.btnClickHistory.length - 1].value);
                    this.pnArr = [];
                }, 10);
                // 把btn全部改为button
                for (const item of btnSearch) {
                    if (!item.getAttribute('exist') || item.getAttribute('exist') === 'true') {
                        item.type = 'button';
                        item.setAttribute('class', 'btnBg');
                    }
                }
            }
            this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .btnBg`).css('color', '#3F4659') : $('.btnBg').css('color', '#3F4659');

            this.notNum = false;
        }
        const [pagex, pagey] = [event.clientX, event.clientY];
        const [btnX, btnY, btnW, btnH] = [btn.offsetLeft, btn.offsetTop, btn.offsetWidth, btn.offsetHeight];
        this.saveCurBtnList = btn;
        const htmlFontSize = parseFloat(document.getElementsByTagName('html')[0].style.fontSize);
        const btnNumW = $(document.querySelector('.btnNum')).width();
        // const [btnW, btnH] = [parseFloat($(btn).css('width')), parseFloat($(btn).css('height'))];
        this.clickTimeId = setTimeout(() => {
            // lenovoPublic.selfLog2(() => console.log(btn.$evnet, '单击事件'));
            // const btnNum = document.querySelector('.btnNum');
            const btnNum = this.parentDataObjIsExist() ? document.querySelector(`#${this.parentDataObjIsExist()}`).querySelector('.btnNum') : document.querySelector('.btnNum');

            const scrollbarStyle = this.parentDataObjIsExist() ? document.querySelector(`#${this.parentDataObjIsExist()}`).querySelector('.scrollbarStyle') : document.querySelector('.scrollbarStyle');

            const scrollL = scrollbarStyle.scrollLeft;

            const appBody = document.querySelector('#appBody');
            const [appBodyScrollH, appBodyScrollW] = [appBody['scrollHeight'], appBody['scrollWidth']];

            const isHScroll = () => {
                return appBodyScrollH > window.innerHeight;
            };
            const isWScroll = () => {
                return appBodyScrollW > window.innerWidth;
            };
            setTimeout(() => {
                if (btn.type === 'button') {
                    this.showNum = !this.showNum;
                    this.singleBJ = btn;
                    this.singleBJIndex = index;
                    this.btnClickHistory.push({ 'index': index, 'value': btn.value }); // 记录点击过btn的value
                    if (this.btnClickHistory.length > 2) { // 最多只记录两个btn的value
                        this.btnClickHistory.splice(0, 1);
                    }
                }
                lenovoPublic.selfLog2(() => console.log(isHScroll(), isWScroll()));

                if (this.showNum) {
                    btn.classList.add('bgTf');
                } else {
                    btn.classList.remove('bgTf');
                }

                console.log(btnNumW);
                // 定位位置相当于当前按钮的  左边距 + 按钮宽度 - 下拉箭头的右边距 - 下拉箭头宽度的1/2 - 浮框的1/2 = 浮框定位左边距
                btnNum['style'].cssText += `left:${btnX + btnW - scrollL - 11 - 0.4 * htmlFontSize - (btnNumW / 2)}px;top:${btnY + btnH + 9}px;`;
            }, 0);


        }, 250);
    }

    // btn双击事件
    dbClickBtn(btn, index) {
        if (btn.type !== 'button') {
            return;
        }
        clearTimeout(this.clickTimeId);
        this.showNum = false;
        this.setBtnType(btn, index);
        this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .btnBg`).css('color', '#3F4659') : $('.btnBg').css('color', '#3F4659');

        this.notNum = false;
        // lenovoPublic.selfLog2(() => console.log('双击事件'));
        btn.type = 'text';
        btn.classList.remove('btnBg', 'bgTf');
        btn.classList.add('btnSearch');
        const value = btn.value;
        btn.value = '';
        lenovoPublic.selfLog2(() => console.log(value, btn.value));
        btn.focus();
        btn.value = value;
    }

    // 编辑编号
    bjNum() {
        clearTimeout(this.clearAllsetTime);
        this.showNum = false;
        this.clearAllsetTime = setTimeout(() => {
            this.singleBJ.type = 'text';
            this.singleBJ.classList.remove('btnBg', 'bgTf');
            this.singleBJ.classList.add('btnSearch');
            const value = this.singleBJ.value;
            this.singleBJ.value = '';
            lenovoPublic.selfLog2(() => console.log(value, this.singleBJ.value));
            this.singleBJ.focus();
            this.singleBJ.value = value;
        }, 100);
    }

    // 设置btn编辑时所有都变为button
    setBtnType(btn, index) {
        clearTimeout(this.focusTime);
        this.singleBJ = btn;
        this.singleBJIndex = index;
        this.btnClickHistory.push({ 'index': index, 'value': btn.value }); // 记录点击过btn的value
        if (this.btnClickHistory.length > 2) { // 最多只记录两个btn的value
            this.btnClickHistory.splice(0, 1);
        }

        const btnSearch: any = this.parentDataObjIsExist() ? document.querySelector(`#${this.parentDataObjIsExist()}`).querySelectorAll('.btnSearch') : document.querySelectorAll('.btnSearch');

        this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .btn`).removeClass('bgTf') : $('.btn').removeClass('bgTf');

        if (btnSearch.length > 0) {
            // 如果没有选择或者为空  让btn的value为改变前的
            this.focusTime = setTimeout(() => {
                this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .btnBg`).eq(this.btnClickHistory[0].index).val(this.btnClickHistory[0].value) : $('.btnBg').eq(this.btnClickHistory[0].index).val(this.btnClickHistory[0].value);
                this.pnArr = [];
            }, 10);
            // 把btn全部改为button
            for (const item of btnSearch) {
                if (!item.getAttribute('exist') || item.getAttribute('exist') === 'true') {
                    item.type = 'button';
                    item.setAttribute('class', 'btnBg');
                }
            }
        }
        lenovoPublic.selfLog2(() => console.log(btnSearch, 'dgfh'));

    }

    // 复制编号
    copyNum() {
        this.showNum = false;
        this.singleBJ.classList.remove('bgTf');
        // const cont = document.querySelector(this.singleBJ);
        lenovoPublic.selfLog2(() => console.log(this.singleBJ));
        this.singleBJ.type = 'text';
        this.singleBJ.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        this.singleBJ.type = 'button';
        lenovoPublic.selfLog2(() => console.log('已复制好，可贴粘。'));
    }

    // 移除编号
    delNum() {
        this.showNum = false;
        this.singleBJ.classList.remove('bgTf');
        this.btnList.splice(this.singleBJIndex, 1);
    }


    /**
     * 单组预测首页的搜索pn号预测按钮点击时间，点击开始预测按钮，调用父级方法
     */
    public startPrediction(forecast) {
        lenovoPublic.selfLog2(() => console.log(this.btnList.length));
        if (this.btnList.length === 0) {
            return;
        }

        this.dataManageService.clearSaveSingleOrBatchPnList();
        this.dataManageService.setSaveSingleOrBatchPnList(this.btnList);
        forecast.style.background = '#278eb3';
        lenovoPublic.selfLog2(x => console.log(this.applyMode));

        const obj = {
            AIPrediction: './AIPrediction/AIDetailsComponent',
            humanPrediction: './humanPrediction/humanDetailsComponent'
        };
        if (this.applyMode) {
            this.router.navigate([obj[this.applyMode]]);
        }
    }

    // 上下箭头选择时禁止光标跑到前边
    public confirm(event, searchCode) {
        // lenovoPublic.selfLog2(() => console.log(searchCode, 'confirm'));

        const key_num = event.keyCode;
        if (38 === key_num) {
            event.preventDefault();
            return false;
        }
        lenovoPublic.selfLog2(() => console.log(searchCode.value.length));

        // if (key_num === 8 && searchCode.classList.contains('btnSearch') && searchCode.value.length === 1 && this.applyMode === 'batchSearchMode') {
        // lenovoPublic.selfLog2(() => console.log(searchCode));
        //     const index = parseInt(searchCode.getAttribute('iptBtnCurIndex'), 10);
        //     this.btnList.splice(index, 1);
        //     this.parentDataObjIsExist() ? $(`#${this.parentDataObjIsExist()} .searchInput`).focus() : $(`.searchInput`).focus();
        //     return;
        // }

        // 如果input的内容为空，不发送请求
        if (searchCode.value.length === 0) {
            // 按删除键直接删除btn
            if (key_num === 8) {
                lenovoPublic.selfLog2(() => console.log(searchCode));
                if (searchCode.classList.contains('btnSearch')) {
                    this.btnList.splice(this.singleBJIndex, 1);
                } else {
                    this.btnList.splice(this.btnList.length - 1, 1);
                }
            }
        }
    }

    // 如果当前是方向键则进入开始上下选择
    private searchInput38Or40(searchCode, code) {
        lenovoPublic.selfLog2(() => console.log(this.pnArr.length));
        if (this.pnArr.length <= 0) {
            this.pnIndex = 0;
            return 'nonePnArr';
        }
        const pnContDom = document.querySelectorAll('.pnCont');
        // const pnContDom = this.parentDataObjIsExist() ? document.querySelector(`#${this.parentDataObjIsExist()}`).querySelectorAll('.pnCont') : document.querySelectorAll('.pnCont');

        if (code !== 40 && code !== 38) {
            this.pnIndex = 0;
            return true;
        }
        if (code === 40) {
            this.pnIndex++;
            if (this.pnIndex >= pnContDom.length) {
                this.pnIndex = 0;

            }
            lenovoPublic.selfLog2(() => console.log(this.pnIndex));
        } else if (code === 38) {
            this.pnIndex--;
            if (this.pnIndex <= -1) {
                this.pnIndex = pnContDom.length - 1;
            }
            lenovoPublic.selfLog2(() => console.log(this.pnIndex));
        }

        Array.from(pnContDom, (item, itemIndex) => {
            // item['classList'].remove('bg');
            if (itemIndex === this.pnIndex) {
                // item['classList'].add('bg');
                searchCode.value = this.codebaseService.cbDo.trim(pnContDom[this.pnIndex].innerHTML, 1);
                lenovoPublic.selfLog2(() => console.log(pnContDom[this.pnIndex]));
            }
        });

        if (code === 38 || code === 40) {
            return false;
        }
    }


    ngOnDestroy() {
        this.removeeventListener();
        if (this.getCodeBySearch$) {
            this.getCodeBySearch$.unsubscribe();
        }
    }

    // 对比组详情事件------------start
    // 关闭组件
    public comparisonDetailsClosePrediction() {
        this.comparisonDetailsClosePredictionClick.emit(false);
    }
    // 对比组详情页面的添加对比组中的预测按钮点击
    public comparisonDetailsStartPrediction() {
        this.comparisonDetailsStartPredictionClick.emit(this.btnList);
    }
    // 对比组详情事件------------end


    // 批量预测添加预测组详情事件------------start
    // 关闭组件
    public batchDetailsClosePrediction() {
        this.batchDetailsClosePredictionClick.emit(false);
    }
    // 批量预测添加预测组开始预测按钮事件
    public batchDetailsStartPrediction() {
        this.batchDetailsStartPredictionClick.emit(this.btnList);
    }
    // 对比组详情事件------------end


    // 对比组管理页面--------------------start
    // tslint:disable-next-line:member-ordering
    @Output() singleComparisonManageDelEmit = new EventEmitter();
    // tslint:disable-next-line:member-ordering
    @Output() singleComparisonManageChangeEmit = new EventEmitter();
    // tslint:disable-next-line:member-ordering
    @Output() singleComparisonManageCancelEmit = new EventEmitter();
    // tslint:disable-next-line:member-ordering
    singleComparisonManageIsEditIng: string | boolean = true; // 当前是否正在修改状态
    //  对比组管理编辑按钮操作
    public singleComparisonManageEdit() {
        if (this.isAllowChange) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '当前为默认项，不允许修改',
                    style: {}
                }]
            }, 'alert');
            // alert(JSON.stringify({ data: '当前为默认项，不允许修改', id: 150 }));
            return;
        }
        this.singleComparisonManageIsEditIng = null;
        this.showNum = false;
    }
    //  对比组管理删除数据
    public singleComparisonManageDel(id) {
        if (this.isAllowChange) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '当前为默认项，不允许修改',
                    style: {}
                }]
            }, 'alert');
            // alert(JSON.stringify({ data: '当前为默认项，不允许修改', id: 150 }));
            return;
        }
        this.singleComparisonManageDelEmit.emit([id]);
    }

    //  对比组管理完成操作
    public singleComparisonManageComplete(id) {
        const obj = { 'pnList': [...this.btnList], 'btnList': [...this.btnList].join(';') };

        if (lenovoPublic.pnListIsRepeat(this.dataManageService.getComparisonPnListManageData(), Object.assign(obj, { id }))) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: '当前修改的pn已存在，不能重复添加',
                    style: {}
                }]
            }, 'alert');
            // alert(JSON.stringify({ data: '当前修改的pn已存在，不能重复添加', id: 140 }));
            return;
        }

        // if (this.dataManageService.getComparisonPnListManageData().some((item) => {
        //     return item['pnList'].length !== 0 && obj['pnList'].length !== 0 && item['pnList'].sort().toString() === obj['pnList'].sort().toString() && id !== item.id;
        // })) {
        //     alert(JSON.stringify({ data: '当前修改的pn已存在，不能重复添加', id: 140 }));
        //     return;
        // }

        this.singleComparisonManageIsEditIng = true;
        this.showNum = false;
        lenovoPublic.selfLog2(() => console.log(this.btnList));
        this.singleComparisonManageChangeEmit.emit([id, { 'pnList': [...this.btnList], 'btnList': [...this.btnList].join(';') }]);
    }
    //  对比组管理取消操作
    public singleComparisonManageCancel() {
        this.singleComparisonManageIsEditIng = true;
        this.showNum = false;
        this.singleComparisonManageCancelEmit.emit('refresh');

    }
    // 对比组管理页面--------------------end


    // 单组预测详情页面的预测按钮事件和导出按钮事件--------start
    // 单组预测详情页面的点击预测事件
    singlePredictionDetailsSearch() {
        this.singlePredictionSearchStartPredictionEvent.emit(this.btnList);
    }
    // 单组预测详情页面的导出事件
    singlePredictionDetailsSearchExport() {
        this.singlePredictionSearchExportEvent.emit();
    }
    // 单组预测详情页面的预测按钮事件和导出按钮事件--------end

    // 在批量预测的搜索框页面时把联想框放到父组件中，监听参数的变化传给父组件------start
    public watchPnArrAndPnIndexAndChangeOrAndKeyWordIsChange(param, dom, that) {
        lenovoPublic.selfLog2(() => console.log(param, dom, that));
        that.batchSearchWatchPnArrAndPnindexAndChangeOr.emit({ pnArr: that.pnArr, pnIndex: that.pnIndex, changeOr: that.changeOr, keyWord: that.keyWord, curIndex: that.curIndex });
    }
    // 在批量预测的搜索框页面时把联想框放到父组件中，监听参数的变化传给父组件------end

}
