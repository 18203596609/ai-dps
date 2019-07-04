import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { GetJsonService } from '../../shared/service/getJson.service';
import { CodebaseService } from '../../shared/service/codebase.service';
import { DataManageService } from '../../shared/service/data_manage.service';
import { Router } from '@angular/router';

declare const $, lenovoPublic;
@Component({
    selector: 'app-edit-password',
    templateUrl: './edit_password.component.html',
    styleUrls: ['./edit_password.component.scss']
})

export class EditPasswordComponent implements OnInit, OnDestroy, AfterViewInit {
    timerCollect = {};
    isChangePWPage = true;
    // 当前输入框是否处于focus中
    isFocus = {
        curpassword: false,
        newpassword: false,
        reIptNewpassword: false,
    };
    constructor(
        private getJson: GetJsonService,
        private codebaseService: CodebaseService,
        private router: Router,
        private dataManageService: DataManageService,
    ) { }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    // 输入框的鼠标focus事件
    accountFocus(dom) {
        dom.removeAttribute('readonly');
        const isFocusType = dom.getAttribute('isFocusType');
        this.isFocus[isFocusType] = true;
    }

    // 输入框的鼠标blur事件
    accountBlur(dom) {
        // tslint:disable-next-line:forin
        for (const i in this.isFocus) {
            this.isFocus[i] = false;
        }
    }

    // 是否显示当前密码
    showPassword(dom) {
        let obj = { 'password': 'text', 'text': 'password' };
        dom.type = obj[dom.getAttribute('type')];
        obj = null;
    }

    // 显示密码提示框
    showTipsPassword(dom, event) {
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
        lenovoPublic.selfLog2(() => console.log(dom.value));
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

    // 返回上一个路由
    public returnPage() {
        this.dataManageService.setIsShowEditPassword(false);
    }

    // 监听重新输入密码的键盘抬起事件
    reIptNewpasswordKeyUp(reIptNewPW) {
        const passWordErrorPop = document.querySelector('.password-error');
        const reIptNewpasswordInput = document.querySelector('.reIptNewpassword-input');
        lenovoPublic.setCss(reIptNewpasswordInput, { color: '#000' });
        lenovoPublic.setCss(passWordErrorPop, { display: 'none' });
    }
    // 不显示修改密码框
    confirmEdit(newPW, reIptNew) {
        if (newPW.value !== reIptNew.value) {
            const passWordErrorPop = document.querySelector('.password-error');
            const reIptNewpasswordInput = document.querySelector('.reIptNewpassword-input');
            lenovoPublic.setCss(reIptNewpasswordInput, { color: 'orange' });
            lenovoPublic.setCss(passWordErrorPop, { display: 'inline-block' });
        } else {

        }


        setTimeout(() => {
            this.dataManageService.setIsShowEditPassword(false);
        }, 1000);
    }
}
