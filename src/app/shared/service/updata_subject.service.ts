import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UpdataSubjectService {

    constructor() { }

    // prediction---details-------start
    // 不同组件之间的数据传递（emit发送和get获取）
    // 先实例化
    private updataBaseDataSubject: Subject<any> = new Subject<any>();
    private updataCurPredictionSubject: Subject<any> = new Subject<any>();
    private updataDataIndexSubject: Subject<any> = new Subject<any>();
    private updataDiagramSubject: Subject<any> = new Subject<any>();
    private upHistoryDataSubject: Subject<any> = new Subject<any>();
    private updataDiagramTopSubject: Subject<any> = new Subject<any>();
    private updataDiagramBottomSubject: Subject<any> = new Subject<any>();

    private updataSinglePredictionComparison: Subject<any> = new Subject<any>(); // 刷新单组预测详情中的对比组列表
    // prediction---details-------end
    // comparison---details-------start
    private updataComparisonDiagramParamterSubject: Subject<any> = new Subject<any>(); // 图表参数区域获取消息
    private updataComparisonDiagramShowSubject: Subject<any> = new Subject<any>(); // 图表展示区域获取消息
    // comparison---details-------end

    // BathComparisonManage 批量预测管理预测
    private updataBathComparisonManage: Subject<any> = new Subject<any>();



    // diagramBottomEmit给singleBase的panel发送数据
    public getSinglePredictionComparisonSubject(): Observable<any> {
        return this.updataSinglePredictionComparison;
    }
    public emitSinglePredictionComparisoninfo(msg: any): void {
        if (msg) {
            this.updataSinglePredictionComparison.next(msg);
        }
    }


    // diagramBottomEmit给singleBase的panel发送数据
    public getDiagramBottomSubject(): Observable<any> {
        return this.updataDiagramBottomSubject;
    }
    public emitDiagramBottomInfo(msg: any): void {
        if (msg) {
            this.updataDiagramBottomSubject.next(msg);
        }
    }

    // diagramTop给singleBase的panel发送数据
    public getDiagramTopSubject(): Observable<any> {
        return this.updataDiagramTopSubject;
    }
    public emitDiagramTopInfo(msg: any): void {
        if (msg) {
            this.updataDiagramTopSubject.next(msg);
        }
    }

    // singleBaseDataEmit给singleBase的panel发送数据
    public getBaseDataSubject(): Observable<any> {
        return this.updataBaseDataSubject;
    }
    public emitBaseDataInfo(msg: any): void {
        if (msg) {
            this.updataBaseDataSubject.next(msg);
        }
    }

    // singleCurPredictionEmit给的panel发送数据
    public getCurPredictionSubject(): Observable<any> {
        return this.updataCurPredictionSubject;
    }
    public emitCurPredictionInfo(msg: any): void {
        if (msg) {
            this.updataCurPredictionSubject.next(msg);
        }
    }

    // singleDataIndexEmit给的panel发送数据
    public getDataIndexSubject(): Observable<any> {
        return this.updataDataIndexSubject;
    }
    public emitDataIndexInfo(msg: any): void {
        if (msg) {
            this.updataDataIndexSubject.next(msg);
        }
    }

    // singleDataDiagramEmit给的panel发送数据
    public getDataDiagramSubject(): Observable<any> {
        return this.updataDiagramSubject;
    }
    public emitDataDiagramInfo(msg: any): void {
        if (msg) {
            this.updataDiagramSubject.next(msg);
        }
    }

    // singleHistoryDataEmit给的panel发送数据
    public getHistoryDataSubject(): Observable<any> {
        return this.upHistoryDataSubject;
    }
    public emitHistoryDataInfo(msg: any): void {
        if (msg) {
            this.upHistoryDataSubject.next(msg);
        }
    }


    // 获取消息
    public getComparisonDiagramParamterSubject(): Observable<any> {
        return this.updataComparisonDiagramParamterSubject;
    }
    // 发送消息
    public emitComparisonDiagramParamterInfo(msg: any): void {
        if (msg) {
            this.updataComparisonDiagramParamterSubject.next(msg);
        }
    }

    // 获取消息
    public getComparisonDiagramShowSubject(): Observable<any> {
        return this.updataComparisonDiagramShowSubject;
    }
    // 发送消息
    public emitComparisonDiagramShowInfo(msg: any): void {
        if (msg) {
            this.updataComparisonDiagramShowSubject.next(msg);
        }
    }

    public getBathComparisonManageSubject(): Observable<any> {
        return this.updataBathComparisonManage;
    }

    public emitBathComparisonManage(msg: any): void {
        if (msg) {
            this.updataBathComparisonManage.next(msg);
        }
    }
}
