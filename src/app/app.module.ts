// 模块引入
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, en_US, zh_CN } from 'ng-zorro-antd';
registerLocaleData(zh);
// 服务引入

// 组件引入
import { AppComponent } from './app.component';
import { Page404Component } from './page404/page404.component';
import { COMPONENTS } from './public_export/component';
import { OVERVIEWCOMPONENTS } from './public_export/view';

// 指令引入
import { DIRECTIVES } from './public_export/directive';

// 管道引入
import { PIPES } from './public_export/pipe';



// 服务引入
import { httpInterceptorProviders } from '../app/shared/interceptor';
import { IsLoginedAuthGuard, CanDeactivateGuard } from '../app/shared/auth';
import { SERVICES } from './public_export/service';
import { OVERVIEWSERVICES } from './public_export/view';


const component = [...OVERVIEWCOMPONENTS, ...COMPONENTS];
const directives = [...DIRECTIVES];
const pipes = [...PIPES];
const services = [...SERVICES, ...OVERVIEWSERVICES, httpInterceptorProviders, IsLoginedAuthGuard, CanDeactivateGuard];

const modules = [
  NgZorroAntdModule,
  FormsModule,
  ReactiveFormsModule
];


@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    ...[component],
    ...[directives],
    ...[pipes]
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxEchartsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ...modules,
    NgbModule.forRoot()
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, ...services],
  bootstrap: [AppComponent]
})
export class AppModule { }
