# router

## 项目初始化

```
ng new my-app-router --routing --style=scss
自动生成 app-routing.module.ts 文件
app.module.ts 会自动导入 AppRoutingModule模块 
```
## 路由相关对象
> Routes
- 定义
```
路由配置，保存着哪个URL对应展示哪个组件，以及在哪个RouterOutler中展示组件
```
- 配置
```javascript

```

> RouterOutlet (`插座`)
- 定义
```
在html中标记路由内容呈现位置的占位符指令
```
- 配置
```javascript

```
> Router
- 定义
```
负责在运行时执行路由的对象，可以通过调用其navigate()和navigateByUrl()方法来导航到另一个指定的路由。
```
- 配置
```javascript

```
> RouterLink
- 定义
```
在Html中声明路由导航用的指令。
```
- 配置
  * html
  ```html
  <a [routerLink] = "['/']">主页</a>
  <!-- 访问子路由 使用 './' -->
  <a [routerLink]="['/stock']">股票详情</a>
  <!-- 使用js方法控制路由跳转,调用router的 this.router.navigate(['/stock']); -->
  <!-- click 调用方法不写小括号没发调用 -->
  <input type="button" value="股票详情" (click)="toStockDetail()">
  <router-outlet></router-outlet>
  ```

  * TS
  ```javascript
  import { Router } from '@angular/router';

  toStockDetail() {
    // 调用router的navigate方法实现跳转
    this.router.navigate(['/stock']);
  }
  ```
  * app-routing.module
  ```javascript
  import { HomeComponent } from './home/home.component';
  import { StockComponent } from './stock/stock.component';
  import { Code404Component } from './code404/code404.component';

  const routes: Routes = [
    {path: '', component: HomeComponent},  // 不需要加  '/', 默认写法
    {path: 'stock', component: StockComponent},
    {path: '**', component: Code404Component},  // 通配符路由,其它不存在的跳转到404
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  ```
> ActivatedRoute (路由时传递数据)
- 定义
```
当前激活的路由对象，保存这当前路由的信息，如路由地址，路由参数等。
```
- 配置
```javascript

```
- 在查询参数中传递数据
```bash
传递   =>  获取
/product?id=1&name=2   =>   ActivatedRoute.queryParams[id]
```

- 在路由路径中传递数据
```bash
传递   =>  获取
{path:/produce/:id}  => /product/1  =>  ActivatedRoute.queryParams[id]
```

- 在路由配置中传递数据
```javascript
{
    path: /product,
    component: ProductComponent,
    data: [{
        isProd: true
    }]
}                                  // 定义   
=>
ActivatedRoute.data[0][isProd]     // 获取
```
## 路由配置

```

```
