import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TestComponent } from './overview/test';
import { LoginComponent } from './overview/login';
import { SinglePredictionComponent } from './overview/single_prediction';
import { BatchPredictionComponent } from './overview/batch_prediction';
import { PredictionHistoryComponent } from './overview/prediction_history';
import { SinglePredictionDetailsComponent } from '../app/component/single_prediction_details/single_prediction_details.component';
import { SingleComparisonDetailsComponent } from '../app/component/single_comparison_details/single_comparison_details.component';
import { SingleSearchComponent } from '../app/component/single_search/single_search.component';
import { SingleComparisonManageComponent } from '../app/component/single_comparison_manage';
import { IsLoginedAuthGuard } from '../app/shared/auth';
import { CanDeactivateGuard } from '../app/shared/auth';

import { BatchSearchComponent } from '../app/component/batch_search';
import { BatchPredictionDetailsComponent } from '../app/component/batch_prediction_details';
import { BatchPredictionManageComponent } from '../app/component/batch_prediction_manage';

import { WarningHistoryComponent } from '../app/overview/warning_history';

import { EditPasswordComponent } from '../app/component/edit_password';
import { PredictionHistoryDetailsComponent } from '../app/component/prediction_history_details/prediction_history_details.component';




const routes: Routes = [
  { path: '', component: LoginComponent },  // 不需要加  '/', 默认写法
  {
    canActivate: [IsLoginedAuthGuard],
    path: 'singlePrediction',
    component: SinglePredictionComponent,
    children: [
      {
        path: '',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleSearchComponent
      },
      {
        path: 'singleSearch',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleSearchComponent
      },
      {
        path: 'singleDetailsComponent',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: SinglePredictionDetailsComponent
      },
      {
        path: 'singleComparisonDetails',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: SingleComparisonDetailsComponent
      },
      {
        path: 'singleComparisonManage',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleComparisonManageComponent
      },
    ]
  },
  {
    canActivate: [IsLoginedAuthGuard],
    path: 'AIPrediction',
    component: SinglePredictionComponent,
    children: [
      {
        path: '',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleSearchComponent
      },
      {
        path: 'AISearch',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleSearchComponent
      },
      {
        path: 'AIDetailsComponent',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: SinglePredictionDetailsComponent
      },
      {
        path: 'AIComparisonDetails',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: SingleComparisonDetailsComponent
      },
      {
        path: 'AIComparisonManage',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleComparisonManageComponent
      }
    ]
  },
  {
    canActivate: [IsLoginedAuthGuard],
    path: 'humanPrediction',
    component: SinglePredictionComponent,
    children: [
      {
        path: '',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleSearchComponent
      },
      {
        path: 'humanSearch',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleSearchComponent
      },
      {
        path: 'humanDetailsComponent',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: SinglePredictionDetailsComponent
      },
      {
        path: 'humanComparisonDetails',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: SingleComparisonDetailsComponent
      },
      {
        path: 'humanComparisonManage',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleComparisonManageComponent
      },
    ]
  },
  {
    path: 'batchPrediction',
    canActivate: [IsLoginedAuthGuard],
    component: BatchPredictionComponent,
    children: [
      {
        path: '',
        canActivateChild: [IsLoginedAuthGuard],
        component: BatchSearchComponent
      },
      {
        path: 'batchSearch',
        canActivateChild: [IsLoginedAuthGuard],
        component: BatchSearchComponent
      },
      {
        path: 'batchDetails',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: BatchPredictionDetailsComponent
      },
      {
        path: 'batchSingleDetails',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: SinglePredictionDetailsComponent
      },
      {
        path: 'batchComparisonManage',
        canActivateChild: [IsLoginedAuthGuard],
        component: SingleComparisonManageComponent
      },
      {
        path: 'batchComparisonDetails',
        canActivateChild: [IsLoginedAuthGuard],
        canDeactivate: [CanDeactivateGuard],
        component: SingleComparisonDetailsComponent
      },
      {
        path: 'batchPredictionManage',
        canActivateChild: [IsLoginedAuthGuard],
        component: BatchPredictionManageComponent
      },
    ]
  },
  {
    path: 'predictionHistory',
    canActivate: [IsLoginedAuthGuard],
    component: PredictionHistoryComponent,
    children: [
      {
        path: '',
        canActivateChild: [IsLoginedAuthGuard],
        component: PredictionHistoryDetailsComponent
      },
      {
        path: 'predictionHistoryDetails',
        canActivateChild: [IsLoginedAuthGuard],
        component: PredictionHistoryDetailsComponent
      }
    ]
  },
  {
    path: 'editPassword',
    // canActivate: [IsLoginedAuthGuard],
    component: EditPasswordComponent
  },
  {
    path: 'warningHistory',
    canActivate: [IsLoginedAuthGuard],
    component: WarningHistoryComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'test',
    component: TestComponent
  },
  // { path: 'singlePredictionDetails', component: SinglePredictionDetailsComponent },
  { path: '**', component: LoginComponent },  // 通配符路由,其它不存在的跳转到404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule { }
