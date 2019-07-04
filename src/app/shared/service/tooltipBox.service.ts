import { Injectable } from '@angular/core';
declare const lenovoPublic;
@Injectable()
export class TooltipBoxService {
    constructor() { }


    // 公共提示框的显示内容，用于提示信息，仅限于样式相同的提示---------start
    // tslint:disable-next-line:member-ordering
    tooltipBoxInfo: {
        message: object[],
        btnTextParentStyles: any,
        btnText: object[]
    } = {
            message: [],
            btnTextParentStyles: function () {
                return {};
            },
            btnText: []
        };
    // 格式模版
    // {
    //     message: [
    //       {
    //         text: '您确定要退出么？',
    //         style: {}
    //       }
    //     ],
    //     btnText: [
    //       {
    //         text: '退出',
    //         className: 'confirm',
    //         callback: () => {
    //           lenovoPublic.selfLog2(()=>console.log('确定'));
    //         }
    //       },
    //       {
    //         text: '取消',
    //         className: 'cancel',
    //         callback: () => {
    //           lenovoPublic.selfLog2(()=>console.log('取消'));
    //         }
    //       }
    //     ]
    //   }
    setTooltipBoxInfo(param, type?) {
        if (type === 'alert') {
            // 仅用于提示的提示性文本框，代替alert
            this.tooltipBoxInfo = Object.assign({}, {
                message: param.message,
                btnTextParentStyles: function () {
                    return {
                        textAlign: 'center',
                    };
                },
                btnText: [{
                    text: '确定',
                    className: 'confirm',
                    callback: () => {
                        this.clearToolTipBoxInfo();
                    }

                }]
            });
        } else {
            // 自定义文本框
            this.tooltipBoxInfo = Object.assign({}, {
                message: param.message,
                btnTextParentStyles: param.btnTextParentStyles,
                btnText: param.btnText
            });
        }
    }
    getTooltipBoxInfo() {
        return this.tooltipBoxInfo;
    }
    clearToolTipBoxInfo() {
        this.tooltipBoxInfo = Object.assign({}, {
            message: [],
            btnTextParentStyles: function () {
                return {};
            },
            btnText: [],
        });
    }
    // 公共提示框的显示内容，用于提示信息，仅限于样式相同的提示---------start
}
