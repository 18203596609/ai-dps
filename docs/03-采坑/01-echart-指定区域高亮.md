# 指定区域高亮
```
1. 鼠标hover时对当前的区域进行判断
2. 从新setOption 让其它区域同时高亮(data里面设置参数selected: true,)
3. ngx-echarts 判断事件名字
export class MapInformationComponent implements OnInit, AfterViewInit {
  lastEvent: any = {};
  // ....
  
  private onChartEvent(event: any, type: string) {
    console.log('chart event:', type, event);
    // add these codes:
    if (this.lastEvent.name === event.name && this.lastEvent.type === type) {
      return;
    } else {
      this.lastEvent.name = event.name;
      this.lastEvent.type = type;
    }
```