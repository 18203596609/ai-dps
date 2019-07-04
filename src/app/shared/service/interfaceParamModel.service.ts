import { Injectable } from '@angular/core';

@Injectable()
export class InterfaceParamModelService {

    constructor() { }
    loginRegister(param) {
        return {
            client_id: 'dps-china',
            client_secret: 'dps-china',
            grant_type: 'password',
            scope: 'read',
            username: param.username,
            password: param.password
        };
    }
    getProjectByCodes(param) {
        return {
            forcastModel: {
                forcastCodes: param.forcastCodes,
                forcastParams: {
                    // flRaByMounth: param.flRaByMounth || 0,
                    // flWarranty: param.flWarranty || 0.05,
                    // last_time_buy: param.last_time_buy || '',
                    // scaleFactor: param.scaleFactor || '1',
                    // raByYear: param.raByYear || '1',
                    // calculateType: param.calculateType || '2'

                    standerWarrantyLength: param.standerWarrantyLength || '',
                    raByMounth: param.raByMounth || '0',
                    extendWarranty: param.extendWarranty || '0.05',
                    last_time_buy: param.last_time_buy || '',
                    scaleFactors: param.scaleFactors || [
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
                    ],
                    raByYear: param.raByYear || '1',
                    calculateType: param.calculateType || '5'

                }
            },
            type: param.type || 1,
            isusedsdk: true,
            userId: param.userId || '',
        };
    }

    getProjectIdList(param) {
        return {
            pageCont: param.pageCont || 0,
            pageIndex: param.pageIndex || 0,
            userId: param.userId || '',
        };
    }

    updataCurrentGroupByProjectId(param) {
        return {
            bNotChangeGroupCode: true,
            currentGroupId: param.currentGroupId,
            last_time_buy: param.last_time_buy,
            mlForcastCodeList: param.mlForcastCodeList,
            pageCont: param.pageCont || 0,
            pageIndex: param.pageIndex || 0,
            projectId: param.projectId || '',
            userId: param.userId || '',
        };
    }

    getLineWithGroupUnionCode(param) {
        return {
            forcastParams: {
                // flRaByMounth: param.flRaByMounth,
                // flWarranty: param.flWarranty,
                // last_time_buy: param.last_time_buy

                standerWarrantyLength: param.standerWarrantyLength || '',
                raByMounth: param.raByMounth || '0',
                extendWarranty: param.extendWarranty || '0.05',
                last_time_buy: param.last_time_buy || '',
                scaleFactors: param.scaleFactors || [
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
                ],
                raByYear: param.raByYear || '1',
                calculateType: param.calculateType || '5'

            },
            groupUnionCode: param.groupUnionCode,
            pageCont: param.pageCont,
            pageIndex: param.pageIndex,
            userId: param.userId || '',
            name: param.name,
            bsave: param.bSave || false,
            buse: param.bUsed || false
        };
    }

    saveLines2Project(param) {
        return {
            diagramLines: param.diagramLines,
            groupUnionCode: param.groupUnionCode || '',
            pageCont: param.pageCont || 0,
            pageIndex: param.pageIndex || 0,
            projectId: param.projectId || '',
            userId: param.userId || '',
            bSave: true,
            bUsed: param.bUsed || false
        };
    }

    setLineNameLineById(param) {
        return {
            lineId: param.lineId || '',
            lineName: param.lineName || '',
            isUsed: param.isUsed || false
        };
    }

    getCompareGroupWithGroupUnionCode(param) {
        return {
            groupUnionCode: param.groupUnionCode || '',
            projectId: param.projectId || '',
        };
    }

    addGroup2CompareGroup(param) {
        return {
            forcastModel: {
                forcastCodes: param.forcastCodes,
                forcastParams: {
                    // flRaByMounth: param.flRaByMounth,
                    // flWarranty: param.flWarranty,
                    // last_time_buy: param.last_time_buy

                    standerWarrantyLength: param.standerWarrantyLength || '',
                    raByMounth: param.raByMounth || '0',
                    extendWarranty: param.extendWarranty || '0.05',
                    last_time_buy: param.last_time_buy || '',
                    scaleFactors: param.scaleFactors || [
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
                    ],
                    raByYear: param.raByYear || '1',
                    calculateType: param.calculateType || '5'


                }
            },
            pageCont: param.pageCont || 0,
            pageIndex: param.pageIndex || 0,
            srcGroupUnionCode: param.srcGroupUnionCode || '',
            userId: param.userId || '',
        };
    }

    getCompareGroupList(param) {
        return {
            groupUnionCode: param.groupUnionCode || '',
        };
    }

    removeGroup2CompareGroup(param) {
        return {
            id: param.id,
            pageCont: param.pageCont || 0,
            pageIndex: param.pageIndex || 0,
            userId: param.userId || 0,
        };
    }

    updataCompareGroupInfo(param) {
        return {
            codesList: param.codesList,
            id: param.id || '',
            pageCont: param.pageCont || 0,
            pageIndex: param.pageIndex || 0,
            userId: param.userId || '',
        };
    }

    getGroupByCodes(param) {
        return {
            mlForcastCodeList: param.mlForcastCodeList,
            pageCont: param.pageCont || 0,
            pageIndex: param.pageIndex || 0,
            userId: param.userId || '',
        };
    }


    doBatchForcast(param) {
        const cont = [];
        param.batchList.map((item) => {
            const obj = {};

            obj['forcastCodes'] = item['forcastCodes'];
            obj['forcastParams'] = {};

            obj['forcastParams']['standerWarrantyLength'] = '';
            obj['forcastParams']['raByMounth'] = item['forcastParams'].raByMounth || '0';
            obj['forcastParams']['extendWarranty'] = item['forcastParams'].extendWarranty || '0.05';
            obj['forcastParams']['last_time_buy'] = item['forcastParams'].last_time_buy || '';
            obj['forcastParams']['scaleFactors'] = item['forcastParams'].scaleFactors || [];
            obj['forcastParams']['raByYear'] = item['forcastParams'].raByYear || '1';
            obj['forcastParams']['calculateType'] = item['forcastParams'].calculateType || '5';

            cont[cont.length] = obj;

        });
        return {
            batchList: cont || [] || param.batchList,
            pageCont: param.pageCont || '',
            pageIndex: param.pageIndex || '',
            userId: param.userId || ''
        };
    }

    export(param) {
        return {
            forcastCodes: param.forcastCodes,
            forcastParams: {
                // flRaByMounth: param.flRaByMounth,
                // flWarranty: param.flWarranty,
                // last_time_buy: param.last_time_buy

                standerWarrantyLength: param.standerWarrantyLength || '',
                raByMounth: param.raByMounth || '0',
                extendWarranty: param.extendWarranty || '0.05',
                last_time_buy: param.last_time_buy || '',
                scaleFactors: param.scaleFactors || [
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
                ],
                raByYear: param.raByYear || '1',
                calculateType: param.calculateType || '5'
            }
        };
    }

    exportBatch(param) {
        return {
            batchList: param.batchList,
            pageCont: param.pageCont || 0,
            pageIndex: param.pageIndex || 0,
            userId: param.userId || ''
        };
    }

    doArtificialForcast(param: any) {
        return {
            forcastModel: {
                forcastCodes: param.forcastCodes,
                forcastParams: {
                    standerWarrantyLength: param.standerWarrantyLength || '',
                    raByMounth: param.raByMounth || '0',
                    extendWarranty: param.extendWarranty || '0.05',
                    last_time_buy: param.last_time_buy || '',
                    scaleFactors: param.scaleFactors || [
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
                    ],
                    raByYear: param.raByYear || '1',
                    calculateType: param.calculateType || '5'

                    // flRaByMounth: param.flRaByMounth || 0,
                    // flWarranty: param.flWarranty || 0.05,
                    // last_time_buy: param.last_time_buy || '',
                    // scaleFactor: param.scaleFactor || '1',
                    // raByYear: param.raByYear || '1',
                    // calculateType: param.calculateType || '2'
                }
            },
            type: param.type || 2,
            isusedsdk: false
        };
    }

    doArtificialLineWithParam(param: any) {
        return {
            forcastParams: {
                // flRaByMounth: param.param || 0,
                // flWarranty: param.flWarranty === 0 ? param.flWarranty : 0.05,
                // last_time_buy: param.last_time_buy || '',
                // scaleFactor: param.scaleFactor || '1',
                // raByYear: param.raByYear || '1',
                // calculateType: param.calculateType || '3'

                standerWarrantyLength: param.standerWarrantyLength || '',
                raByMounth: param.raByMounth || '0',
                extendWarranty: param.extendWarranty || '0.05',
                last_time_buy: param.last_time_buy || '',
                scaleFactors: param.scaleFactors || [
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
                ],
                raByYear: param.raByYear || '1',
                calculateType: param.calculateType || '1'
            },
            groupUnionCode: param.groupUnionCode || '',
            bsave: param.bSave,
            buse: param.bUsed,
            type: param.type,
            name: param.name
        };
    }
}
