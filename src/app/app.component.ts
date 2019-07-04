import { Component, OnInit, OnDestroy } from '@angular/core';
import { LenovoPublic } from '../lenovoPublic';
import { Router } from '@angular/router';
import { LoadingService, DataManageService } from './shared/service';
declare const $, Swiper, lenovoPublic;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SSCDF';
  lenovoPublic;
  constructor(
    public loadingService: LoadingService,
    public dataManageService: DataManageService,
    public router: Router
  ) {
    this.lenovoPublic = new LenovoPublic(this.loadingService);
  }

  ngOnInit() {
    window['lenovoPublic'] = this.lenovoPublic;

    // const obj = new XMLHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据
    // obj.open('POST', 'http://10.110.147.37:8014/machine-learning/1.0/app/project/getProjectByCodes', true);
    // obj.onreadystatechange = function () {
    // lenovoPublic.selfLog2(() => console.log(obj));
    //   if (obj.readyState === 4 && obj.status === 200 || obj.status === 304) { // readyState == 4说明请求已完成
    //     // fn.call(this, obj.responseText);  // 从服务器获得数据
    //   }
    // };
    // obj.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    // obj.setRequestHeader('Authorization', 'Bearer 153853e9-5cc2-4910-91ef-46c9a7f94808');
    // obj.send(JSON.stringify({
    //   'forcastModel': {
    //     'forcastCodes': ['B0740122'],
    //     'forcastParams': {
    //       'last_time_buy': '',
    //       'flRaByMounth': 0,
    //       'flWarranty': 0.05
    //     }
    //   },
    //   'version': '1.0',
    //   'pageCont': 0,
    //   'pageIndex': 0,
    //   'userId': ''
    // }));
  }
  // tslint:disable-next-line:member-ordering
  data = 0;
  changeData(param) {
    // console.log(param);
  }
}
