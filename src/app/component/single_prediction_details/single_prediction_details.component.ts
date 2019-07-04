import { Component, OnInit, Input, OnDestroy, ViewChild, ViewChildren } from '@angular/core';
import { GetJsonService } from '../../shared/service/getJson.service';
import { UpdataSubjectService } from '../../shared/service/updata_subject.service';
import { LoadingService } from '../../shared/service/loading.service';
import { CodebaseService } from '../../shared/service/codebase.service';
import { DataManageService } from '../../shared/service/data_manage.service';
import { InterfaceParamModelService } from '../../shared/service/interfaceParamModel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SingleDiagramComponent } from './single_diagram';
declare const lenovoPublic;
@Component({
    selector: 'app-single-prediction-details',
    templateUrl: './single_prediction_details.component.html',
    styleUrls: ['./single_prediction_details.component.scss']
})

export class SinglePredictionDetailsComponent implements OnInit, OnDestroy {
    @Input() projectId = [];
    isShowDetails = true;
    isShowComparisonDetails = false;
    constructor(
        private getJsonService: GetJsonService,
        private updataSubjectService: UpdataSubjectService,
        private loadingService: LoadingService,
        private dataManageService: DataManageService,
        private interfaceParamModelService: InterfaceParamModelService,
        private router: Router
    ) { }
    @ViewChild(SingleDiagramComponent) public singleDiagramComponent: SingleDiagramComponent;

    ngOnInit() {
        this.projectId = this.dataManageService.getSaveSingleOrBatchPnList();
        lenovoPublic.selfLog2(x => console.log(this.projectId));
        // lenovoPublic.selfLog2(()=>console.log(this.projectId));
        this.getAllData(this.projectId);

        window.addEventListener('onunload', () => {
            lenovoPublic.selfLog2(() => console.log('onunload'));
        });
    }

    // 设置createObject请求的参数
    private setCreateProjectParam(projectId) {
        let paramData;
        const arr = [];
        projectId.map((item) => {
            arr.push(item);
        });
        paramData = this.interfaceParamModelService.getProjectByCodes({
            forcastCodes: arr,

            standerWarrantyLength: '',
            raByMounth: '0',
            extendWarranty: '0.05',
            last_time_buy: '',
            scaleFactors: lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction' ? [
                {
                    scaleFactor: '1',
                    beginTime: '2019-06',
                    endTime: '2020-07'
                }
            ] : [],
            raByYear: '1',
            calculateType: '5',

            version: '1.0',
            type: lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction' ? 2 : 1,
            isusedsdk: false
        });
        if (lenovoPublic.curAIOrHumanOrSingle() === 'humanPrediction') {
            return Object.assign({}, paramData, { aiOrHumanPrediction: 'artificial' });
        } else {
            return Object.assign({}, paramData);
        }
    }

    // 获取所有数据
    // tslint:disable-next-line:member-ordering
    getProjectByCodes$;
    getAllData(projectId) {
        lenovoPublic.isShowGetJsonLoading.call(this, true);

        // 发送请求
        this.getProjectByCodes$ = this.getJsonService.getProjectByCodes(this.setCreateProjectParam(projectId),
            (data) => {
                this.isShowDetails = false;
                setTimeout(() => {
                    this.isShowDetails = true;
                    setTimeout(() => {
                        this.dataManageService.setSingleCurGroupUnionCode(data.data.projectModel.basicModel.currentGroupUnionCode); // 保存当前的groupUnionCode
                        this.setData(data);
                        lenovoPublic.isShowGetJsonLoading.call(this);
                    }, 0);
                }, 0);
            },
            (err) => {
                lenovoPublic.isShowGetJsonLoading.call(this);
                console.error(err);
            });
    }

    // emit data to panel
    setData(data) {
        this.updataSubjectService.emitHistoryDataInfo(data);
        this.updataSubjectService.emitCurPredictionInfo(data);
        this.updataSubjectService.emitBaseDataInfo(data);
        this.updataSubjectService.emitDataIndexInfo(data);
        this.updataSubjectService.emitSinglePredictionComparisoninfo(data);
        this.updataSubjectService.emitDataDiagramInfo(data);
    }

    public turnToPage(param, btnList) {
        this.dataManageService.setSaveSingleOrBatchPnList(btnList);
        lenovoPublic.selfLog2(() => console.log(btnList));

        const obj = {
            singlePrediction: {
                route: './singlePrediction/singleComparisonDetails',
                routeParam: null,
            },
            AIPrediction: {
                route: './AIPrediction/AIComparisonDetails',
                routeParam: {
                    id: 'AIPredictionDetails',
                    originPage: 'AIPredictionDetails'
                }
            },
            humanPrediction: {
                route: './humanPrediction/humanComparisonDetails',
                routeParam: {
                    id: 'humanPredictionDetails',
                    originPage: 'humanPredictionDetails'
                }
            },
            batchPrediction: {
                route: './batchPrediction/batchComparisonDetails',
                routeParam: {
                    id: 'batchPredictionDetails',
                    originPage: 'batchPredictionDetails'
                }
            },
        };
        for (const [key, value] of Object.entries(obj)) {
            if (lenovoPublic.urlHash().indexOf(key) !== -1) {
                if (value.routeParam) {
                    this.router.navigate([value.route, value.routeParam]);
                } else {
                    this.router.navigate([value.route]);
                }
                break;
            }
        }

        // lenovoPublic.selfLog2(()=>console.log('turnToComparisonDetails', param));
    }

    ngOnDestroy(): void {
        lenovoPublic.isShowGetJsonLoading.call(this);
        // lenovoPublic.selfLog2(()=>console.log(this.getProjectByCodes$));
        if (this.getProjectByCodes$) {
            this.getProjectByCodes$.unsubscribe();
        }

    }

    // 获取图表参数区是否正在编辑中
    public getDiagramParamterIsEditIng() {
        return this.singleDiagramComponent['singleDiagramParameterComponent']['curIsEditIng'];
    }
}
