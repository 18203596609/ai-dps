# CSS 采坑

## 父组件给子组件设置样式不起作用?
```css
// 使用  /deep/
    .item_val{
        width: 130px;
        ngb-progressbar{
            /deep/ .progress{
                margin-top: 9px;
                border-radius: 0;
                .progress-bar{
                    background-color:#80d8d0;
                }
            }
        } 
    }
```

## assets 背景图片无法访问
```css
   //  下面方法任选一
   background: url('../../../assets/team.png') no-repeat 0 0;
   background-image: url('/assets/team.png');
```