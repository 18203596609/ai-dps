
/**
 * 登陆接口
 * @param client_id
 * @param client_secret
 * @param grant_type
 * @param scope
 * @param username 输入的账号
 * @param password 输入的密码
 */
export interface LoginRegister {
    client_id: string;
    client_secret: string;
    grant_type: string;
    scope: string;
    username: string;
    password: string;
}


/**
 * 利用输入的code码组创建一个项目
 * @param forcastModel 输入的code码组
 */
export interface GetProjectByCodes {
    forcastModel: {
        forcastCodes: string[],
        forcastParams: {
            // calculateType: string,
            // flRaByMounth: string,
            // flWarranty: string,
            // last_time_buy: string,
            // raByYear: string,
            // scaleFactor: string

            standerWarrantyLength: string,
            raByMounth: string,
            extendWarranty: string,
            last_time_buy: string,
            scaleFactors: object[],
            raByYear: string,
            calculateType: string
        }
    };
    type: number;
    isusedsdk: boolean;
    userId: string;
}

/**
 * 通过创建的项目id获取项目数据内容
 * @param projectId 项目id
 */
export interface GetProjectById {
    projectId: string;
}

/**
 * 获取历史预测的项目id列表
 * @param pageCont 获取预测的历史预测的几条数据
 * @param pageIndex 从第几条开始获取
 */
export interface GetProjectIdList {
    pageCont: number;
    pageIndex: number;
    userId?: string;
}

/**
 * 单组预测更新数据内容
 */
export interface UpdataCurrentGroupByProjectId {
    bNotChangeGroupCode: true;
    currentGroupId: string;
    last_time_buy: string;
    mlForcastCodeList: [
        {
            codeType: number;
            forcastCode: string
        }
    ];
    pageCont: number;
    pageIndex: number;
    projectId: string;
    userId: string;
}

/**
 * 创建线的接口
 * @param groupId 当前组的id
 * @param last_time_buy 时间
 * @param pageCont 分页
 * @param pageIndex 分页
 * @param projectId 工程id
 * @param userId 用户Id
 */
export interface GetLineWithGroupUnionCode {
    groupUnionCode: string;
    forcastParams: {
        // flRaByMounth: number,
        // flWarranty: number,
        // last_time_buy: string

        standerWarrantyLength: string,
        raByMounth: string,
        extendWarranty: string,
        last_time_buy: string,
        scaleFactors: object[],
        raByYear: string,
        calculateType: string
    };
    pageCont: number;
    pageIndex: number;
    userId: string;
    bsave: boolean;
    buse: boolean;
    name: string;
}

/**
 * 保存线的接口
 * @param diagramLine 创建线的数据对象
 * @param  groupId: 当前组的id;
 * @param pageCont: 分页;
 * @param pageIndex: 分页;
 * @param projectId: 工程id;
 * @param userId: 用户Id;
 */
export interface SaveLines2Project {
    diagramLines: {
        bUsed: boolean;
        dataBatchDate: string;
        dataBatchId: string;
        forcastParams: {
            // flRaByMounth: number,
            // flWarranty: number,
            // last_time_buy: string

            standerWarrantyLength: string,
            raByMounth: string,
            extendWarranty: string,
            last_time_buy: string,
            scaleFactors: object[],
            raByYear: string,
            calculateType: string
        };
        groupUnionCode: string,
        last_time_buy: string,
        lineId: string,
        lineName: string,
        lineType: string,
        lineValue: string,
        pnsMd5: string,
        projectId: string,
        timeLine: string[],
        value: string[]
    }[];
    groupUnionCode: string;
    pageCont: number;
    pageIndex: number;
    projectId: string;
    userId: string;
}

/**
 * 设置线是否使用
 * @param lineId 设置的线的Id
 * @param used 设置是否使用
 */
export interface SetLineIsUsed {
    lineId: string;
    used: boolean;
}


/**
 * 批量预测时更新名字
 * @param lineId 设置的线的Id
 * @param isUsed 设置是否使用
 * @param lineName line 名称
 */
export interface SetLineNameLineById {
    lineId: string;
    lineName: string;
    isUsed: boolean;
}

/**
 * @param groupUnionCode 组编号
 * @param projectId 工程id
 */
export interface GetCompareGroupWithGroupUnionCode {
    groupUnionCode: string;
    projectId: string;
}

/**
 * @param forcastModel 添加pnlist列表的pn数组
 * @param pageCont
 * @param pageIndex
 * @param srcGroupUnionCode
 * @param userId
 */
export interface AddGroup2CompareGroup {
    forcastModel: {
        forcastCodes: string[],
        forcastParams: {
            // flRaByMounth: number,
            // flWarranty: number,
            // last_time_buy: string

            standerWarrantyLength: string,
            raByMounth: string,
            extendWarranty: string,
            last_time_buy: string,
            scaleFactors: object[],
            raByYear: string,
            calculateType: string
        }
    };
    pageCont?: number;
    pageIndex?: number;
    srcGroupUnionCode: string;
    userId?: string;

}

export interface GetCompareGroupList {
    groupUnionCode: string;
}

/**
 * @param id 删除对比组id
 * @param pageCont
 * @param pageIndex
 * @param userId
 */
export interface RemoveGroup2CompareGroup {
    id: string;
    pageCont?: number;
    pageIndex?: number;
    userId?: string;
}

/**
 * @param codesList 更新的pnlist列表
 * @param id 更新的id
 * @param pageCont
 * @param pageIndex
 * @param userId
 */
export interface UpdataCompareGroupInfo {
    codesList: string[];
    id: string;
    pageCont?: number;
    pageIndex?: number;
    userId?: string;
}




/**
 * 通过pnCode码组获取对比组
 * @param mlForcastCodeList 输入的code码组
 */
export interface GetGroupByCodes {
    mlForcastCodeList: { forcastCode: string, codeType: number }[];
    pageCont?: number;
    pageIndex?: number;
    userId?: string;
}


export interface DoBatchForcast {
    batchList: [
        {
            forcastCodes: string[],
            forcastParams: {
                // flRaByMounth: string,
                // flWarranty: string,
                // last_time_buy: string
                standerWarrantyLength: string,
                raByMounth: string,
                extendWarranty: string,
                last_time_buy: string,
                scaleFactors: object[],
                raByYear: string,
                calculateType: string
            }
        }
    ];
    pageCont: number;
    pageIndex: number;
    userId: string;
}
/**
 * 对比组导出
 * @param mlForcastCodeList 输入的code码组
 */
export interface ExportBatch {
    batchList: {
        forcastCodes: [
            string
        ],
        forcastParams: {
            flRaByMounth: string,
            flWarranty: string,
            last_time_buy: string
        }
    }[];
    pageCont?: number;
    pageIndex?: number;
    userId?: string;
}

/**
 * 对比组导出
 * @param mlForcastCodeList 输入的code码组
 */
export interface Export {
    forcastCodes: string[];
    forcastParams: {
        // flRaByMounth: number,
        // flWarranty: number,
        // last_time_buy: string

        standerWarrantyLength: string,
        raByMounth: string,
        extendWarranty: string,
        last_time_buy: string,
        scaleFactors: object[],
        raByYear: string,
        calculateType: string
    };
}

/**
 * 人工预测获取forecast数据
 * @param forcastModel 参数
 * @param type 类型，1是AI预测2是人工预测
 * @param isusedsdk 不知道，默认false
 */
export interface DoArtificialForcast {
    forcastModel: {
        forcastCodes: string[],
        forcastParams: {
            // flRaByMounth: number,
            // flWarranty: number,
            // last_time_buy: string,
            // scaleFactor: string,
            // raByYear: string,
            // calculateType: string

            standerWarrantyLength: string,
            raByMounth: string,
            extendWarranty: string,
            last_time_buy: string,
            scaleFactors: object[],
            raByYear: string,
            calculateType: string
        }
    };
    type: number;
    isusedsdk: boolean;
}
/**
 *
 * @param forcastModel 参数
 * @param groupUnionCode 类型，1是AI预测2是人工预测
 * @param bsave 不知道，默认false
 * @param buse 不知道，默认false
 * @param name 不知道，默认false
 */
export interface DoArtificialLineWithParam {
    forcastParams: {
        // flRaByMounth: boolean,
        // flWarranty: boolean,
        // last_time_buy: string,
        // scaleFactor: string,
        // raByYear: string,
        // calculateType: string

        standerWarrantyLength: string,
        raByMounth: string,
        extendWarranty: string,
        last_time_buy: string,
        scaleFactors: object[],
        raByYear: string,
        calculateType: string
    };
    groupUnionCode: string;
    bsave: boolean;
    buse: boolean;
    type: string;
    name: string;
}























/**
 * @param getProjectByCodes 利用输入的code码组创建一个项目
 * @param getProjectById 通过创建的项目id获取项目数据内容
 * @param getProjectIdList 获取历史预测的项目id列表
 */
export interface ProjectService {
    // deleteProjectyIds();
    // getPnInfoByProjectIdWithGroups();
    getProjectByCodes(T: GetProjectByCodes, M: Function, N: Function);
    getProjectById(T: GetProjectById, M: Function, N: Function);
    getProjectIdList(T: GetProjectIdList, M: Function, N: Function);
}

/**
 * @param deletLineByIds 删除曲线
 * @param getLineWithGroupUnionCode 创建线的接口
 * @param saveLines2Project 保存线的接口
 */
export interface ProjectLineService {
    deletLineByIds(T: string, M: Function, N: Function);
    // getDiagramLineList(T: getDiagramLineList, M: Function, N: Function);
    getLineWithGroupUnionCode(T: GetLineWithGroupUnionCode, M: Function, N: Function);
    saveLines2Project(T: SaveLines2Project, M: Function, N: Function);
    setLineIsUsed(T: SetLineIsUsed, M: Function, N: Function);
    setLineNameLineById(T: SetLineNameLineById, M: Function, N: Function);

}
/**
 * 页面中自定义的方法
 *@param setToken 设置token
 *@param getToken 获取token
 *@param setHeaders 设置请求头
 *@param loginRegister 登陆方法
 */
export interface SelfFun {
    setToken(T: string);
    getToken();
    setHeaders();
    loginRegister(T: LoginRegister, M: Function, N: Function);
}

/**
 * 搜索方法
 * @param getCodeBySearch 输入pn号用于联想显示下拉列表
 */
export interface ElasticsearchService {
    getCodeBySearch(T: string, M: Function, N: Function);
}

/**
 * 对比组接口
 * @param getCompareGroupWithGroupUnionCode 用groupUnionCode 获取对比组
 * @param addGroup2CompareGroup 对比组的pnlist添加
 * @param getCompareGroupList 对比组的pnlist列表获取
 * @param removeGroup2CompareGroup 对比组的移除
 * @param updataCompareGroupInfo 对比组的更新
 */
export interface ProjectCompareGroupService {
    getCompareGroupWithGroupUnionCode(T: GetCompareGroupWithGroupUnionCode, M: Function, N: Function);
    addGroup2CompareGroup(T: AddGroup2CompareGroup, M: Function, N: Function);
    getCompareGroupList(T: GetCompareGroupList, M: Function, N: Function);
    removeGroup2CompareGroup(T: RemoveGroup2CompareGroup, M: Function, N: Function);
    updataCompareGroupInfo(T: UpdataCompareGroupInfo, M: Function, N: Function);
}

export interface BatchForcastService {
    doBatchForcast(T: DoBatchForcast, M: Function, N: Function);
    exportBatch(T: ExportBatch, M: Function, N: Function);
}


export interface ExportService {
    export(T: Export, M: Function, N: Function);
}

export interface Artificial {
    doArtificialForcast(T: DoArtificialForcast, M: Function, N: Function);
    doArtificialLineWithParam(T: DoArtificialLineWithParam, M: Function, N: Function);
}
