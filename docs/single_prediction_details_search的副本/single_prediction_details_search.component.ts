// import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
// import { GetJsonService } from '../../../shared/service';
// declare const $;
// @Component({
//     selector: 'app-single-prediction-details-search',
//     templateUrl: './single_prediction_details_search.component.html',
//     styleUrls: ['./single_prediction_details_search.component.scss']
// })

// export class SinglePredictionDetailsSearchComponent implements OnInit, OnDestroy {
//     timeCollection = {}; // // setTimeout 集合
//     getCodeBySearch$: any; // 保存订阅的接口

//     searchHistory: any = []; // 保存已经成为按钮态的列表

//     saveCurBtnDom; // 保存当前点击的是哪一个btn的pn号码
//     savePreIpt; // 保存上一个编辑的input文本框

//     keyWord; // 保存输入的内容

//     pnList: any = []; // 联想出来的5个pn
//     pnIndex = 0; // 联想出来的5个pn轮播时的下标备注

//     @Output() getAllDataEventEmitter = new EventEmitter();
//     constructor(
//         private getJson: GetJsonService
//     ) { }
//     ngOnInit() {
//         this.inputChanges({ value: '' }, { keyCode: 10000000000 });
//     }

//     // 键盘的输入事件
//     public inputChanges(searchDom, event) {
//         const code = event.keyCode;
//         this.keyCodeEvent(code, event);
//         {
//             const isAllowSearch = this.searchInput38Or40(searchDom, code);
//             if (!isAllowSearch) {
//                 return;
//             }
//         }
//         this.keyWord = searchDom.value; // 标记当前输入的值是多少

//         if (!searchDom.value) {
//             return;
//         }
//         // 获取code数据
//         this.getCodeBySearch$ = this.getJson.getCodeBySearch(searchDom.value, (data) => {
//             console.log(data);
//             this.pnList = data.data;
//         }, (err) => {
//             console.log(err);
//         });
//     }

//     // input 输入事件时的键盘事件
//     private keyCodeEvent(code, event) {
//         {
//             if (event.target) {
//                 let value = event.target.value;
//                 // 遇到分号变成按钮态
//                 if (code === 186 && value && (value !== ';' || value !== '；')) {
//                     value = value.substring(0, value.length - 1);
//                     event.target.value = value;
//                     this.addHistory(this.saveCurBtnDom, event.target);
//                 }
//             }
//         }
//     }

//     // 将已经变成按钮态的内容添加到数组里
//     public addHistory(searchDom, id) {
//         console.log(id);
//         if (id) {
//             const num = id.getAttribute('num');
//             console.log(num, 'asdfasdf;asd;fa;sdf;a;sdf;asdfasdf=a=sdf=as=df=as=df=ad=f++++++++++++++++');
//             if (num) {
//                 console.log(num);
//                 const curIpt = this.searchHistory.find((item) => item.id === num); // 根据id查找元素
//                 console.log(num, curIpt);
//                 curIpt.value = id.value; // 赋值
//                 curIpt.curShowIptOrBtn = 'btn'; // 显示btn
//                 this.pnList.length = 0;
//                 return;
//             }
//         }
//         const obj = { id: String(new Date().getTime()), value: String(searchDom.value), curShowIptOrBtn: 'btn' };
//         if (!searchDom.value) {
//             return;
//         }
//         this.searchHistory.push(obj);
//         searchDom.value = '';
//         this.pnList.length = 0;
//     }

//     // 如果当前是方向键则进入开始上下选择
//     private searchInput38Or40(searchCode, code) {
//         const pnContDom = document.querySelectorAll('.pnCont');
//         if (code !== 40 && code !== 38) {
//             this.pnIndex = 0;
//             return true;
//         }
//         if (code === 40) {
//             this.pnIndex++;
//             if (this.pnIndex >= pnContDom.length) {
//                 this.pnIndex = 0;
//             }
//             console.log(this.pnIndex);
//         } else if (code === 38) {
//             this.pnIndex--;
//             if (this.pnIndex <= -1) {
//                 this.pnIndex = pnContDom.length - 1;
//             }
//             console.log(this.pnIndex);
//         }

//         Array.from(pnContDom, (item, itemIndex) => {
//             item['classList'].remove('bg');
//             if (itemIndex === this.pnIndex) {
//                 item['classList'].add('bg');
//                 searchCode.value = pnContDom[this.pnIndex].innerHTML;
//             }
//         });

//         if (code === 38 || code === 40) {
//             return false;
//         }
//     }

//     // click li get code
//     public getCode(searchDom, code) {
//         const codeChild = code.parentNode.children;
//         Array.from(codeChild, (item) => {
//             item['classList'].remove('bg');
//         });
//         code.classList.add('bg');
//         searchDom.value = code.innerHTML;
//         this.keyWord = searchDom.value;
//         this.pnList.length = 0;
//         this.addHistory(searchDom, this.saveCurBtnDom);
//     }

//     // 已成为按钮态的单机事件
//     public btnClick(event) {
//         this.saveCurBtnDom = event.target;
//         clearTimeout(this.timeCollection['clickOrDblClick']);
//         this.timeCollection['clickOrDblClick'] = setTimeout(() => {
//             this.showOrHideEditBox(true);
//             this.setEditBoxPosition(event);
//             console.log('asdf');
//         }, 300);
//     }

//     // 设置edit-box编辑框的宽和高
//     private setEditBoxPosition(event) {
//         const inputHistoryScrollL = $('.input-history')[0].scrollLeft;
//         const inputHistoryL = $('.input-history')[0].offsetLeft;
//         const inputHistoryW = parseFloat($('.input-history').css('width'));
//         const [btnX, btnY] = [event.target.offsetLeft, event.target.offsetTop];
//         const [btnW, btnH] = [parseFloat($(event.target).css('width')), parseFloat($(event.target).css('height'))];
//         const editBox = document.querySelector('.edit-box-ul');

//         console.log(inputHistoryScrollL, btnX);
//         console.log(inputHistoryScrollL + inputHistoryW + inputHistoryL, btnX + btnW);
//         // 判断当前点击的是否是在滚动条的最右边且没有完全显示
//         if (inputHistoryScrollL + inputHistoryW + inputHistoryL > btnX + btnW) {
//             console.log('>');
//             editBox['style'].cssText += `left:${btnX + btnW - inputHistoryScrollL}px;top:${btnY + btnH + 9}px;`;
//         } else {
//             console.log('<');
//             editBox['style'].cssText += `left:${btnX - inputHistoryScrollL}px;top:${btnY + btnH + 9}px;`;
//         }

//     }

//     // 已成为按钮态的双机事件
//     public btnDblClick() {
//         clearTimeout(this.timeCollection['clickOrDblClick']);
//         this.editNumber(this.saveCurBtnDom);
//     }

//     // 是否显示当前的编辑框
//     private showOrHideEditBox(isBlock) {
//         const editBox = document.querySelector('.edit-box');
//         isBlock ? editBox['style'].display = 'block' : editBox['style'].display = 'none';
//     }

//     // input框focus时执行
//     public iptFocus(event) {
//         this.showOrHideEditBox(false);
//         let num;
//         num = event.target.getAttribute('num');
//         // 聚焦时如果是修改框，就让其他的修改框都变成为btn，当前的显示为ipt
//         if (num) {
//             this.searchHistory.map((item) => {
//                 if (num && item.id === num) {

//                 } else {
//                     item.curShowIptOrBtn = 'btn';
//                 }
//             });
//         }
//         // 避免在输入框中聚焦时还有其他的修改框是不显示btn状态
//         if (!event.target.getAttribute('num')) {
//             this.searchHistory.map((item) => {
//                 item.curShowIptOrBtn = 'btn';
//             });
//         } else {

//         }
//         console.log(event);
//         this.saveCurBtnDom = event.target;
//         this.inputChanges(this.saveCurBtnDom, { keyCode: 1999919999 });
//         console.log(this.saveCurBtnDom);
//     }

//     // input框blur时执行
//     public iptBlur() {
//         setTimeout(() => {
//             this.pnList.length = 0;
//             this.getCodeBySearch$.unsubscribe();
//         }, 50);
//     }

//     // 编辑框的编辑编号行为
//     public editNumber(curEditBtn) {
//         console.log(curEditBtn);
//         const id = (curEditBtn.id).substring(3, (curEditBtn.id).length);
//         console.log(id);
//         this.searchHistory.find((item) => item.id === id).curShowIptOrBtn = 'ipt';
//         setTimeout(() => {
//             const ipt = document.querySelector(`#ipt${id}`);
//             ipt['focus']();
//             ipt['value'] = '';
//             ipt['value'] = curEditBtn.innerHTML;
//             this.inputChanges(ipt, { keyCode: 1999919999 });
//         }, 10);

//         this.showOrHideEditBox(false);
//     }

//     // 编辑框的拷贝编号行为
//     public copyNumber(curEditBtn) {
//         this.showOrHideEditBox(false);

//         {
//             // 删除手动创建的input框
//             const copeIptValueDom = document.querySelector('#searchDetailsCopyValue');
//             if (copeIptValueDom) {
//                 copeIptValueDom.parentNode.removeChild(copeIptValueDom);
//             }
//             // 拷贝编号
//             const oInput = document.createElement('input');
//             oInput.id = 'searchDetailsCopyValue';
//             oInput.value = curEditBtn.innerHTML;
//             document.body.appendChild(oInput);
//             oInput.select(); // 选择对象
//             document.execCommand('Copy'); // 执行浏览器复制命令
//             oInput.className = 'oInput';
//             oInput.style.display = 'none';
//         }

//     }

//     // 编辑框的移除编号行为
//     public removeNumber(curEditBtn) {
//         this.showOrHideEditBox(false);
//         console.log(curEditBtn);
//         const num = curEditBtn.getAttribute('num');
//         for (const [key, value] of Object.entries(this.searchHistory)) {
//             console.log(value['id'], num, value['id'] === num);
//             if (value['id'] === num) {
//                 this.searchHistory.splice(Number(key), 1);
//                 break;
//             }
//         }
//     }



//     // 禁止输入框的keydown事件
//     private confirm(event) {
//         const code = event.keyCode;
//         {
//             // 当内部元素是空时再删除则删除历史数组的最后一项
//             if (code === 8 && !event.target.value) {
//                 this.searchHistory.pop();
//             }
//         }

//         if (38 === code) {
//             event.preventDefault();
//             return false;
//         }
//     }


//     startPrediction() { }
//     parentGetAllData() {
//         this.getAllDataEventEmitter.emit('');
//     }

//     ngOnDestroy(): void {
//         if (this.getCodeBySearch$) {
//             this.getCodeBySearch$.unsubscribe();
//         }
//         {
//             // 删除手动创建的input框
//             const copeIptValueDom = document.querySelector('#searchDetailsCopyValue');
//             if (copeIptValueDom) {
//                 copeIptValueDom.parentNode.removeChild(copeIptValueDom);
//             }
//         }
//     }
// }
