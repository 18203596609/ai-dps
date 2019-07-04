import { Injectable } from '@angular/core';
import { formattedError } from '@angular/compiler';
declare function escape(s: string): string;
declare function unescape(s: string): string;
declare const LenovoEncrypt;

@Injectable()
export class CodebaseService {
  isNeedEncrypt = false; // 是否使用base64 加密
  constructor() { }
  // codebase, 公共的方法对象
  cbDo: any = {
    // 去除空格  type 1-所有空格  2-前后空格  3-前空格 4-后空格
    // ecDo.trim('  1235asd',1)
    trim: function (str: string, type: number) {
      switch (type) {
        case 1:
          return str.replace(/\s+/g, '');
        case 2:
          return str.replace(/(^\s*)|(\s*$)/g, '');
        case 3:
          return str.replace(/(^\s*)/g, '');
        case 4:
          return str.replace(/(\s*$)/g, '');
        default:
          return str;
      }
    }
  };

  operatorCookie: any = {
    isNeedEncrypt: this.isNeedEncrypt,
    // 给设置的cookie设置过期时间
    getsec(str) {
      const str1 = str.substring(1, str.length) * 1;
      const str2 = str.substring(0, 1);
      if (str2 === 's') {
        return str1 * 1000;
      } else if (str2 === 'h') {
        return str1 * 60 * 60 * 1000;
      } else if (str2 === 'd') {
        return str1 * 24 * 60 * 60 * 1000;
      }
    },
    // 设置cookie
    setCookie(name, value, time) {
      const strsec = this.getsec(time);
      const exp = new Date();
      exp.setTime(exp.getTime() + strsec * 1);
      if (this.isNeedEncrypt) {
        document.cookie = LenovoEncrypt.encode(name) + '=' + LenovoEncrypt.encode(value) + ';expires=' + exp['toGMTString']();
      } else {
        document.cookie = name + '=' + value + ';expires=' + exp['toGMTString']();
      }
    },

    // 获取cookie
    getCookie(name) {
      let arr, reg;
      if (this.isNeedEncrypt) {
        reg = new RegExp('(^| )' + LenovoEncrypt.encode(name) + '=([^;]*)(;|$)');
      } else {
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
      }

      if (arr = document.cookie.match(reg)) {
        if (this.isNeedEncrypt && LenovoEncrypt.decode(arr[2])) {
          return LenovoEncrypt.decode(arr[2]);
        } else if (!this.isNeedEncrypt && arr[2]) {
          return arr[2];
        } else {
          return '';
        }
      } else {
        return '';
      }
    },
    // 删除cookie
    delCookie(name) {
      if (this.isNeedEncrypt) {
        name = LenovoEncrypt.encode(name);
      }
      const exp = new Date();
      exp.setTime(exp.getTime() - 1);
      const cval = this.getCookie(name);
      if (cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + exp['toGMTString']();
      }
    }
  };

  operatorSessionStroage = {
    isNeedEncrypt: this.isNeedEncrypt,
    // 设置sessionStroage
    setSessionStroage(name: string, value: any) {
      if (this.isNeedEncrypt) {
        name = LenovoEncrypt.encode(name);
      }
      value = typeof value === 'string' ? value : JSON.stringify(value);
      if (this.isNeedEncrypt) {
        value = LenovoEncrypt.encode(value);
      } else {
        value = value;
      }
      localStorage.setItem(name, value);
    },

    // 获取sessionStroage
    getSessionStroage(name): any {
      if (this.isNeedEncrypt) {
        name = LenovoEncrypt.encode(name);
      }
      let value = localStorage.getItem(name);
      if (value) {
        if (this.isNeedEncrypt) {
          value = LenovoEncrypt.decode(value);
        } else {
          value = value;
        }
      }
      if (value && (value.indexOf('[') !== -1 || value.indexOf('{') !== -1)) {
        value = JSON.parse(value);
      }
      return value;
    },
    // 删除sessionStroage
    delSessionStroage(name) {
      if (this.isNeedEncrypt) {
        name = LenovoEncrypt.encode(name);
      }
      localStorage.removeItem(name);
    }
  };

  // project codebase, 项目公共的方法对象
  pcbDo: any = {
  };

  /**
   * @param curDate 当前时间
   * @param format 日期分割符号
   */
  dateTransform: any = {
    formatDateToString(curDate, format) {
      if (typeof curDate === 'object') {
        const year = String(curDate.getFullYear()), month = (curDate.getMonth() + 1) < 10 ? '0' + String((curDate.getMonth() + 1)) : String((curDate.getMonth() + 1)), date = curDate.getDate() < 10 ? '0' + String(curDate.getDate()) : String(curDate.getDate());
        curDate = year + format + month + format + date;
        return curDate;

      } else if (typeof curDate === 'string') {

        return curDate;
      }
    }
  };
}
