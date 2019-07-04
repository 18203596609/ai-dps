import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
declare const lenovoPublic;

@Component({
    selector: 'app-dragupload',
    templateUrl: './dragUpload.component.html',
    styleUrls: ['./dragUpload.component.scss']
})

export class DragUploadComponent implements OnInit {
    @Input() textContent = {
        titleText: '导入修正后在保量',
        descriptionText: '将修改后的Excel文件拖放至此处'
    };
    @Output() dragOverEvent = new EventEmitter(); // 拖拽文件上传文件触发dropover时的回调事件
    @Output() dragLeaveEvent = new EventEmitter(); // 拖拽文件上传文件触发dropleave时的回调事件
    @Output() dropedEvent = new EventEmitter(); // 拖拽文件上传文件触发drop时的回调事件
    @Output() closeComponent = new EventEmitter(); // 关闭当前组件-----销毁当前组件
    fileList = []; // 上传的文件内容
    fileName = ''; // 上传文件的名称
    constructor() { }
    ngOnInit() { }

    // 拖拽文件到指定位置的over事件
    public ondragoverEvent(event) {
        const loading1 = document.querySelector('.overShadow .loading1');
        if (lenovoPublic.getStyle(loading1, 'display') !== 'none') {
            return;
        }
        this.setOverStyle(true);
        this.setGetFileBtnIndex(0);
        this.dragOverEvent.emit('dragover');
        // console.log(event, 'over');
    }
    // 拖拽放置事件，可触发回调
    public ondropEvent(event) {
        const loading1 = document.querySelector('.overShadow .loading1');
        if (lenovoPublic.getStyle(loading1, 'display') !== 'none') {
            return;
        }
        this.fileList = [];
        this.fileList.length = 0;
        const files = event.dataTransfer.files[0];
        lenovoPublic.selfLog2(x => console.log(files));
        this.fileList.push(files);
        this.upload(this);
    }

    // 拖拽离开时执行
    public ondragleaveEvent(event) {
        const loading1 = document.querySelector('.overShadow .loading1');
        if (lenovoPublic.getStyle(loading1, 'display') !== 'none') {
            return;
        }
        this.setOverStyle(false);
        this.setGetFileBtnIndex(10);
        this.dragLeaveEvent.emit('dragleave');
    }

    // 点击选择文件事件执行
    public getFile() {
        this.fileList = [];
        this.fileList.length = 0;
        lenovoPublic.getFile(this.upload, this);
    }

    // 关闭上传文件组件
    closeUpload() {
        this.closeComponent.emit(false);
    }

    // 处理文件上传
    private upload(vm) {
        console.log(vm.fileList);
        lenovoPublic.selfLog2(x => console.log(vm.fileList));
        vm.uploadBefore();
        vm.dropedEvent.emit([vm.fileList, vm.uploadCallBack()]);
    }

    // 设置上传文件之前的回调事件
    private uploadBefore() {
        this.fileName = this.fileList[0].name;
        lenovoPublic.setCss(document.querySelector('.overShadow .loading1'), { display: 'block' });
        this.setOverStyle(true);
        this.setGetFileBtnIndex(0);
    }
    // 设置上传文件完成的回调事件
    private uploadCallBack() {
        return () => {
            console.log(this);
            lenovoPublic.setCss(document.querySelector('.overShadow .loading1'), { display: 'none' });
            this.setOverStyle(false);
            this.setGetFileBtnIndex(10);
            console.log('quxiao');
        };
    }

    // 文件over或leave时设置样式
    private setOverStyle(isOver) {
        const overShadow = document.querySelector('.overShadow');
        lenovoPublic.setCss(overShadow, { backgroundColor: ['rgba(100, 187, 255, 0)', 'rgba(100, 187, 255, 0.87)'][+isOver] });
    }

    // 修改获取文件按钮的层级，避免拖拽文件时会腿拽到按钮上出现问题
    private setGetFileBtnIndex($number) {
        const getFile = document.querySelector('.getfile');
        lenovoPublic.setCss(getFile, { zIndex: $number });
    }
}
