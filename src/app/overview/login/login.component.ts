import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { GetJsonService } from '../../shared/service/getJson.service';
import { CodebaseService } from '../../shared/service/codebase.service';
import { DataManageService } from '../../shared/service/data_manage.service';
import { TooltipBoxService } from '../../shared/service/tooltipBox.service';
import { InterfaceParamModelService } from '../../shared/service/interfaceParamModel.service';
import { Router } from '@angular/router';

declare const $, lenovoPublic;
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
    timerCollect = {};
    isChangePWPage = false;
    constructor(
        private getJson: GetJsonService,
        private codebaseService: CodebaseService,
        private router: Router,
        private dataManageService: DataManageService,
        private tooltipBoxService: TooltipBoxService,
        private interfaceParamModelService: InterfaceParamModelService,
    ) { }

    ngOnInit() { }

    ngAfterViewInit() {
        this.setAccountAndPassword();
    }

    // 设置账号密码
    setAccountAndPassword() {
        const account = document.querySelector('.account-input');
        const password = document.querySelector('.password-input');
        const isSavePassword = document.querySelector('.remember-password').querySelector('input[type=checkbox]');
        if (this.codebaseService.operatorCookie.getCookie('isRMPassword')) {
            account.removeAttribute('readonly');
            password.removeAttribute('readonly');
            // $('.account-input')[0].removeAttribute('readonly');
            // $('.password-input')[0].removeAttribute('readonly');
            account.setAttribute('value', this.codebaseService.operatorCookie.getCookie('account'));
            password.setAttribute('value', this.codebaseService.operatorCookie.getCookie('password'));
            $(isSavePassword).attr('checked', true);
        }
    }

    // 输入框的鼠标focus事件
    accountFocus(dom) {
        const pre1 = dom.parentNode.children[0];
        pre1.style.cssText = `height:auto;display:inline-block;`;
        dom.style.cssText = `height:50%;`;
        dom.setAttribute('placeholder', '');
        dom.removeAttribute('readonly');
    }

    // 输入框的鼠标blur事件
    accountBlur(dom) {
        if (!dom.value) {
            const pre1 = dom.parentNode.children[0];
            pre1.style.cssText = `height:auto;display:none;`;
            dom.style.cssText = `height:100%;`;
            if ((dom.className).includes('account')) {
                dom.setAttribute('placeholder', 'IT code');
            } else if ((dom.className).includes('password')) {
                dom.setAttribute('placeholder', '密码');
            }
        }
    }

    // 登录按钮事件
    register(account, password) {
        const isSavePassword = document.querySelector('.remember-password').querySelector('input[type=checkbox]');
        const param = this.interfaceParamModelService.loginRegister({ username: account.value, password: password.value });

        if (!account.value) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: `账号不能为空`,
                    style: {}
                }]
            }, 'alert');
            // alert('账号不能为空');
        } else if (!password.value) {
            this.tooltipBoxService.setTooltipBoxInfo({
                message: [{
                    text: `密码不能为空`,
                    style: {}
                }]
            }, 'alert');
            // alert('密码不能为空');
        }

        this.getJson.loginRegister(param, (data) => {
            localStorage.clear(); // 清除记录
            this.dataManageService.reInit(); // 清除记录

            lenovoPublic.selfLog2(() => console.log(data, account.value, '登录成功'));
            if ($(isSavePassword).is(':checked')) {
                this.codebaseService.operatorCookie.setCookie('account', account.value, 'd7');
                this.codebaseService.operatorCookie.setCookie('password', password.value, 'd7');
                this.codebaseService.operatorCookie.setCookie('isRMPassword', true, 'd7');
            } else {
                this.codebaseService.operatorCookie.setCookie('isRMPassword', '', 'd7');
            }
            this.dataManageService.setLogined(true);

            this.codebaseService.operatorSessionStroage.setSessionStroage('userName', account.value);
            this.router.navigate(['/AIPrediction']);
        }, (err) => {
            lenovoPublic.selfLog2(() => console.log(isSavePassword));
            lenovoPublic.selfLog2(() => console.log(isSavePassword.getAttribute('checked')));
            // alert('登录出错了');
            console.error('出错了', err);
        });
    }

    // 登录按钮的点击态，点击后保持住
    changeStyle(btnRegister) {
        lenovoPublic.selfLog2(() => console.log(123111));
        btnRegister.style.backgroundColor = '#00AFEF';
    }

    // 是否显示当前密码
    showPassword(dom) {
        let obj = { 'password': 'text', 'text': 'password' };
        dom.type = obj[dom.getAttribute('type')];
        obj = null;
    }

    // 显示密码提示框
    showTipsPassword(dom, event) {
        this.dataManageService.setIsShowEditPassword(true);
        return;
    }

    // copyPhone复制信息
    copyPhone(isCopySuccessDom) {
        lenovoPublic.publicClearTimeout('copyPhone');
        const oInput = document.createElement('input');
        oInput.id = 'loginInputCopyPhone';
        oInput.value = '18610103464';
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        isCopySuccessDom.innerHTML = '复制成功';

        lenovoPublic.publicSetTimeout('copyPhone', 1000, () => {
            isCopySuccessDom.innerHTML = '复制联系方式';
        });
    }


    forgetPassWordEnter() {
        lenovoPublic.publicClearTimeout('forgetPasswordTimer');
        this.forgetPasswordIsEnter = true;
    }


    // tslint:disable-next-line:member-ordering
    forgetPasswordTimer = null; // 定时器
    // tslint:disable-next-line:member-ordering
    forgetPasswordIsEnter = false; // 控制是否显示密码提示框参数

    forgetPassWordLeave() {
        lenovoPublic.publicClearTimeout('forgetPasswordTimer');
        lenovoPublic.publicSetTimeout('forgetPasswordTimer', 100, () => {
            this.forgetPasswordIsEnter = false;
        });
    }

    // password替换为星号
    replaceXing(dom) {
        // const value = dom.value;
        // dom.value = value.replace(/./g, '*');
        // lenovoPublic.selfLog2(()=>console.log(dom.value));
    }

    ngOnDestroy(): void {
        {
            // 删除手动创建的input框
            const copePhoneDom = document.querySelector('#loginInputCopyPhone');
            if (copePhoneDom) {
                copePhoneDom.parentNode.removeChild(copePhoneDom);
            }
        }
    }
}
