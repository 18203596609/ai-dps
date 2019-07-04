import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    CanDeactivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { SingleDiagramParameterComponent } from '../../component/single_prediction_details/single_diagram_parameter';
import { SingleComparisonDetailsComponent } from '../../component/single_comparison_details';
declare const lenovoPublic;
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<SingleDiagramParameterComponent> {
    constructor() { }

    canDeactivate(
        component: SingleDiagramParameterComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        // 单组详情页面的编辑状态，使用路由判断当前页面是否是单组详情页面
        const singlePredictionEditingArr = ['/AIPrediction/AIDetailsComponent', '/humanPrediction/humanDetailsComponent', '/singlePrediction/singleDetailsComponent', '/batchPrediction/batchSingleDetails'];
        // 对比组页面的编辑状态，使用路由判断当前页面是否是对比组页面
        const comparisonEditingArr = ['/AIPrediction/AIComparisonDetails', '/humanPrediction/humanComparisonDetails', '/singlePrediction/singleComparisonDetails', '/batchPrediction/batchComparisonDetails'];
        // lenovoPublic.selfLog2(()=>console.log(state.url));
        // lenovoPublic.selfLog2(()=>console.log(component));
        if (singlePredictionEditingArr.some(x => state.url.indexOf(x) !== -1)) {
            // 单组预测详情页面如果正在编辑中提示
            if (component['getDiagramParamterIsEditIng']()) {
                return confirm('当前正在编辑中， 跳转后当前正在编辑的状态将不被保存，是否仍然要跳转？？？');
            }
        } else if (comparisonEditingArr.some(x => state.url.indexOf(x) !== -1)) {
            // 单组预测对比组详情页面如果正在编辑中提示
            // lenovoPublic.selfLog2(()=>console.log(component));
            if (component['curParamData'].some((item) => item.curIsEditIng)) {
                return confirm('当前存在正在编辑中的选项卡， 跳转后当前正在编辑的状态将不被保存，是否仍然要跳转？？？');
            }
        } else {
            // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
            // if (!component.crisis || component.crisis.name === component.editName) {
            //     return true;
            // }
            // Otherwise ask the user with the dialog service and return its
            // observable which resolves to true or false when the user decides
            // return component.dialogService.confirm('Discard changes?');
        }
        return true;

    }
}
