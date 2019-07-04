import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetJsonService, DataManageService, CodebaseService, InterfaceParamModelService, LoadingService } from '../../../shared/service';
declare const $, lenovoPublic;
@Component({
    selector: 'app-single-prediction-details-search',
    templateUrl: './single_prediction_details_search.component.html',
    styleUrls: ['./single_prediction_details_search.component.scss']
})

export class SinglePredictionDetailsSearchComponent implements OnInit, OnDestroy {
    getCodeBySearch$; // 获取值
    @Output() startPredictionBtn = new EventEmitter();
    @Output() getAllData = new EventEmitter();
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
        private interfaceParamModelService: InterfaceParamModelService,
        private codebaseService: CodebaseService,
        private loadingService: LoadingService,
        private router: Router
    ) { }
    ngOnInit() {
        this.addeventListener();
        const pnList = this.dataManageService.getSaveSingleOrBatchPnList();
        lenovoPublic.selfLog2(() => console.log(pnList));
        this.btnList = pnList ? pnList : [];
    }

    // 是否显示当前搜索框
    isShowSearch(curRoute) {
        if (!lenovoPublic.isArray(curRoute)) {
            curRoute = [curRoute];
        }
        return curRoute.some(x => (window.location.hash).indexOf(x) !== -1);
    }

    resize() {
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


    // tslint:disable-next-line:member-ordering
    codeArr = new Set([16, 18, 93, 32, 91, 17]);
    /**
     * 监听输入框的变化
     * @param value 预测的输入框的值
     */
    inputChanges(searchCode, code, index?) {
        if (Array.from(this.codeArr).some((item) => +code === +item)) {
            lenovoPublic.selfLog2(() => console.log('不触发'));
            return;
        }
        this.changeOr = searchCode;
        this.showNum = false;
        this.notNum = false;
        searchCode.style.color = '#3F4659';
        $('.forecast').attr({ 'disabled': false });
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
            this.click186(searchCode, index);
            return;
        }

        this.keyWord = searchCode.value; // 标记当前输入的值是多少

        // 获取code数据
        this.getCodeBySearch$ = this.getJson.getCodeBySearch(searchCode.value, (data) => {
            // lenovoPublic.selfLog2(()=>console.log(data, 9999999));
            this.pnArr = data.data;
            // lenovoPublic.selfLog2(()=>console.log(this.pnArr));
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log(err));
        });

    }

    // search框focus事件
    searchFocus() {
        clearTimeout(this.focusTime);
        this.showNum = false;
        if (this.btnList.length > 0) {
            for (let i = 0; i < this.btnList.length; i++) {
                if (i === this.singleBJIndex && this.btnList[i].includes(this.singleBJ.value) && this.singleBJ.value.length > 0) {
                    lenovoPublic.selfLog2(() => console.log(i === this.singleBJIndex && this.btnList[i].includes(this.singleBJ.value) && this.singleBJ.value.length > 0));
                    lenovoPublic.selfLog2(() => console.log(i === this.singleBJIndex && this.btnList[i].includes(this.singleBJ.value) && this.singleBJ.value.length > 0));
                    this.focusTime = setTimeout(() => {
                        lenovoPublic.selfLog2(() => console.log(this.btnClickHistory[this.btnClickHistory.length - 1].value));
                        $('.btnBg').eq(this.btnClickHistory[this.btnClickHistory.length - 1].index).val(this.btnClickHistory[this.btnClickHistory.length - 1].value);
                        this.pnArr = [];
                    }, 10);
                    this.singleBJ.type = 'button';
                    this.singleBJ.classList.remove('bgTf', 'btnSearch');
                    this.singleBJ.classList.add('btnBg');
                }
            }
        }
    }

    // tslint:disable-next-line:member-ordering
    isContinuousCalls = false; // 是否允许连续调用接口
    // 点击分号执行
    click186(searchCode, index) {
        // lenovoPublic.selfLog2(()=>console.log(typeof searchCode.value[searchCode.value.length - 1], 67676));
        if (this.isContinuousCalls) {
            return;
        }
        this.isContinuousCalls = true;
        // tslint:disable-next-line:no-unused-expression
        let searValue = '';
        if (searchCode.value[searchCode.value.length - 1] === ';') {
            searValue = searchCode.value.slice(0, searchCode.value.length - 1);
        } else {
            searValue = searchCode.value;
        }
        // lenovoPublic.selfLog2(()=>console.log(searchCode, this.btnList, searValue));
        // 输入分号判断是否有该编号，没有则改变颜色
        this.getCodeBySearch$ = this.getJson.getCodeBySearch(searValue, (data) => {
            lenovoPublic.selfLog2(() => console.log(data.data.length, 9999999));
            const dataArr = data.data;
            let findIndex = false;
            for (const item of dataArr) {
                if (searValue === item.code) {
                    findIndex = true;
                }
            }
            if (!findIndex) {
                this.notNum = true;
                searchCode.style.color = '#FF834E';
                $('.forecast').attr({ 'disabled': true });
                // $('.forecast').addClass('disForcast');
            } else {
                this.notNum = false;
                if (searchCode.type === 'search') {
                    this.btnList.push(searValue);
                    searchCode.value = '';
                } else {
                    this.btnList[index] = searValue;
                    searchCode.type = 'button';
                    searchCode.value = searValue;
                    searchCode.classList.remove('btnSearch');
                    searchCode.classList.add('btnBg');
                }
            }
            lenovoPublic.selfLog2(() => console.log(this.btnList, 44444));
            this.isContinuousCalls = false;
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log(err));
            this.isContinuousCalls = false;
        });
    }

    // click li get code
    getCode(searchCode, code) {
        const codeChild = code.parentNode.children;
        Array.from(codeChild, (item) => {
            item['classList'].remove('bg');
        });
        code.classList.add('bg');

        this.keyWord = searchCode.value;
        if (searchCode.type === 'search') {
            this.btnList.push(code.innerHTML);
            searchCode.value = '';
        } else {
            this.btnList[this.singleBJIndex] = code.innerHTML;
            searchCode.type = 'button';
            searchCode.value = code.innerHTML;
            searchCode.classList.remove('btnSearch');
            searchCode.classList.add('btnBg');
        }
        this.pnArr = [];
    }


    // btn单击事件
    clickBtn(btn, event, index) {
        clearTimeout(this.clickTimeId);
        clearTimeout(this.focusTime);

        const btnSearch: any = document.querySelectorAll('.btnSearch');
        lenovoPublic.selfLog2(() => console.log(this.btnList, 'dfjkgi', btnSearch));
        if (btn.type === 'button') {
            if (btnSearch.length > 0) {
                // 如果没有选择或者为空  让btn的value为改变前的
                this.focusTime = setTimeout(() => {
                    $('.btnBg').eq(this.btnClickHistory[this.btnClickHistory.length - 1].index).val(this.btnClickHistory[this.btnClickHistory.length - 1].value);
                    this.pnArr = [];
                }, 10);
                // 把btn全部改为button
                for (const item of btnSearch) {
                    item.type = 'button';
                    item.setAttribute('class', 'btnBg');
                }
            }
        }
        const [pagex, pagey] = [event.clientX, event.clientY];
        const [btnX, btnY] = [btn.offsetLeft, btn.offsetTop];
        this.saveCurBtnList = btn;
        // const [btnX, btnY] = [btn.offsetLeft, btn.offsetTop];
        const [btnW, btnH] = [parseFloat($(btn).css('width')), parseFloat($(btn).css('height'))];
        this.clickTimeId = setTimeout(() => {

            const btnNum = document.querySelector('.btnNum');
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
                btnNum['style'].cssText += `left:${btnX + btnW}px;top:${btnY + btnH + 9}px;`;
            }, 0);


        }, 250);
    }

    // btn双击事件
    dbClickBtn(btn, index) {
        this.showNum = false;
        this.setBtnType(btn, index);
        clearTimeout(this.clickTimeId);
        // lenovoPublic.selfLog2(()=>console.log('双击事件'));
        btn.type = 'text';
        btn.classList.remove('btnBg', 'bgTf');
        btn.classList.add('btnSearch');
    }

    // 编辑编号
    bjNum() {
        clearTimeout(this.clearAllsetTime);
        this.showNum = false;
        this.clearAllsetTime = setTimeout(() => {
            this.singleBJ.type = 'text';
            this.singleBJ.classList.remove('btnBg', 'bgTf');
            this.singleBJ.classList.add('btnSearch');
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

        const btnSearch: any = document.querySelectorAll('.btnSearch');
        $('.btn').removeClass('bgTf');
        if (btnSearch) {
            // 如果没有选择或者为空  让btn的value为改变前的
            this.focusTime = setTimeout(() => {
                $('.btnBg').eq(this.btnClickHistory[0].index).val(this.btnClickHistory[0].value);
                this.pnArr = [];
            }, 10);
            // 把btn全部改为button
            for (const item of btnSearch) {
                item.type = 'button';
                item.setAttribute('class', 'btnBg');
            }
        }
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
     * 点击开始预测按钮，调用父级方法
     */
    public startPrediction(pnList) {
        console.log(pnList);
        lenovoPublic.selfLog2(() => console.log(pnList));
        this.btnList = pnList;
        lenovoPublic.selfLog2(() => console.log(this.btnList.length));
        if (this.btnList.length === 0) {
            return;
        }
        // this.dataManageService.setSaveSingleOrBatchPnList(this.btnList);
        lenovoPublic.selfLog2(() => console.log(this.dataManageService.getCurIsEditIng()));
        if (this.dataManageService.getCurIsEditIng()) {
            if (confirm('当前正在编辑中， 跳转后当前正在编辑的状态将不被保存，是否仍然要跳转？？？')) {
                // this.dataManageService.clearSaveSingleOrBatchPnList();
                this.dataManageService.setSaveSingleOrBatchPnList(this.btnList);
                this.getAllData.emit(this.btnList);
            }
        } else {
            // this.dataManageService.clearSaveSingleOrBatchPnList();
            lenovoPublic.selfLog2(() => console.log(this.btnList));
            this.dataManageService.setSaveSingleOrBatchPnList(this.btnList);
            this.getAllData.emit(this.btnList);
        }
    }

    // 上下箭头选择时禁止光标跑到前边
    public confirm(event, searchCode) {
        const key_num = event.keyCode;
        if (38 === key_num) {
            event.preventDefault();
            return false;
        }

        // 如果input的内容为空，不发送请求
        if (searchCode.value.length === 0) {
            // 按删除键直接删除btn
            if (key_num === 8) {
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
        lenovoPublic.selfLog2(() => console.log('as;dlfkjas;dlfja;lskdjf;alskdjf'));
        const pnContDom = document.querySelectorAll('.pnCont');
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
            }
        });

        if (code === 38 || code === 40) {
            return false;
        }
    }

    public export() {
        lenovoPublic.selfLog2(() => console.log('export 什么'));
        lenovoPublic.selfLog2(() => console.log(this.btnList));
        const request = () => {
            lenovoPublic.selfLog2(() => console.log(this.getJson.getToken()));
            const param = this.interfaceParamModelService.export({
                forcastCodes: this.btnList,
                // flRaByMounth: 0.0001,
                // flWarranty: 0.01,
                // last_time_buy: ''

                standerWarrantyLength: '',
                raByMounth: '0',
                extendWarranty: '0.05',
                last_time_buy: '',
                scaleFactors: lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction' ? [
                    {
                        scaleFactor: '0.7',
                        beginTime: '2019-06',
                        endTime: '2020-07'
                    },
                    {
                        scaleFactor: '0.8',
                        beginTime: '2020-8',
                        endTime: '2021-8'
                    }
                ] : [],
                raByYear: '1',
                calculateType: '5',
            });
            lenovoPublic.isShowGetJsonLoading.call(this, true);
            this.getJson.export(param,
                (data) => {
                    lenovoPublic.isShowGetJsonLoading.call(this);
                    const elink = document.createElement('a');
                    elink.download = `${this.btnList[0]}-${new Date()}.xlsx`;
                    elink.style.display = 'none';
                    const blob = new Blob([data]);
                    elink.href = URL.createObjectURL(blob);
                    console.log(elink);
                    document.body.appendChild(elink);
                    elink.click();
                    document.body.removeChild(elink);
                }, (err) => {
                    lenovoPublic.isShowGetJsonLoading.call(this);
                    lenovoPublic.selfLog2(() => console.log(err));
                });
        };
        request();
    }

    // 跳转页面至批量预测详情页面
    public turnToBatchDetails() {
        // if (this.dataManageService.getCurIsEditIng()) {
        //     if (confirm('当前正在编辑中， 跳转后当前正在编辑的状态将不被保存，是否仍然要跳转？？？')) {
        //         this.router.navigate(['/batchPrediction/batchDetails']);
        //     }
        // } else {
        this.router.navigate(['/batchPrediction/batchDetails']);
        // }
    }


    // 返回单组预测的搜索页面
    public returnSearchPage() {
        ['AIPrediction', 'humanPrediction', 'singlePrediction'].map(x => {
            if (lenovoPublic.urlHash().indexOf(x) !== -1) {
                this.router.navigate([`/${x}`]);
            }
        });
    }




    ngOnDestroy() {
        this.removeeventListener();
        if (this.getCodeBySearch$) {
            this.getCodeBySearch$.unsubscribe();
        }
    }

}
