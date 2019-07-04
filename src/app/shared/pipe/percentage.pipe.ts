import { Pipe, PipeTransform } from '@angular/core';
declare const lenovoPublic;
@Pipe({ name: 'appPercentage' })
// 可传入参数为两个，boolean值是否转换成百分比，number保留几位小数，可不传入参数，默认不转换百分比，保留所有小数，不限制顺序
/**
 * @param args[0] boolean值是否转换成百分比
 * @param args[1] number保留几位小数
 * @param args[2] 是否强制转换成保留小数位数的，无论是否为整数
 */
export class PercentagePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        // lenovoPublic.selfLog2(()=>console.log(typeof value, value, args));

        // 如果返回的是字符串格式，那么转化成数值
        if (lenovoPublic.isNumber(parseFloat(value))) {
            value = parseFloat(value);
        } else if (typeof value === 'string' && value.indexOf('-') >= 0) {
            return '-';
        }

        let pointNum, ispercentage;
        const isConstraintTransform = args[2];
        if (args.length === 0) {
            return value;
        } else if (args.length === 1) {
            if (typeof args[0] === 'boolean') {
                ispercentage = args[0];
                pointNum = 0;
            } else if (typeof args[0] === 'number') {
                ispercentage = false;
                pointNum = args[0];
            }
        } else if (args.length === 2 || args.length === 3) {
            if (typeof args[0] === 'boolean') {
                ispercentage = args[0];
                pointNum = args[1];
            } else if (typeof args[0] === 'number') {
                ispercentage = args[1];
                pointNum = args[0];
            }
        }

        // lenovoPublic.selfLog2(()=>console.log(pointNum, String(value).indexOf('.') >= 0 || isConstraintTransform));
        // 是否转换成百分比
        if (ispercentage) {
            value = (value * 100).toFixed(pointNum) + '%';
        } else if (pointNum || pointNum === 0) {
            if (String(value).indexOf('.') >= 0 || isConstraintTransform) {
                value = (+value).toFixed(pointNum);
                // lenovoPublic.selfLog2(()=>console.log(value));
            } else {
                value = (+value).toFixed(0);
            }
        }

        return value;
    }
}
