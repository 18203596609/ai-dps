import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
declare const lenovoPublic;
@Component({
    selector: 'app-detailsdata-panel',
    templateUrl: 'detailsData_panel.component.html',
    styleUrls: ['detailsData_panel.component.scss']
})

export class DetailsdataPanelComponent implements OnInit, OnChanges, AfterViewInit {
    dataIndexCurZu = 'fenlei';
    @Input() panelData = [];
    @Input() allData = [];
    @Input() curIndex = -1;
    constructor() { }

    ngOnInit() {
        // lenovoPublic.selfLog2(() => console.log(this.allData, this.panelData));
    }
    ngAfterViewInit() {
        this.resize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // lenovoPublic.selfLog2(() => console.log(changes));
    }

    resize() {
        window.addEventListener('resize', () => {
            lenovoPublic.publicClearTimeout('detailsDataPanelResize');
            lenovoPublic['detailsDataPanelResize'] = setTimeout(() => {
                this.calculateAngleLeft();
            }, 200);
        });
    }

    // 计算三角的位置
    public calculateAngleLeft() {
        const detailsDataPanelAngleEle = document.querySelector('.details-data-panel-angle');
        if (!detailsDataPanelAngleEle) {
            return;
        }
        if (this.curIndex || this.curIndex === 0) {
            const i = this.curIndex;
            if (document.querySelector(`#sortableChild${i}`)) {
                const ele = document.querySelector(`#sortableChild${i}`);
                const eleOffsetLeft = ele['offsetLeft'];
                const eleoffsetWidth = ele['offsetWidth'];
                const htmlFontSize = parseFloat(document.querySelector('html').style.fontSize);
                const left = ((eleOffsetLeft / htmlFontSize) - (82 / htmlFontSize) + (eleoffsetWidth * 0.8 / htmlFontSize)) + 'rem';
                detailsDataPanelAngleEle['style'].left = left;
                return {
                    left
                };
            }
        } else {
            return {};
        }
    }

    // 切换本组和分类
    public toogleFenZu(param) {
        this.dataIndexCurZu = param;
    }

    // 平均月需求 的高中低
    private nAverageMounthIsHighOrLow(num, element) {
        if (Number(num) < 8) {
            element.innerHTML = '低';
        } else if (Number(num) >= 8 && Number(num) < 40) {
            element.innerHTML = '中';
        } else {
            element.innerHTML = '高';
        }
    }

    // 成本价 的高中低
    private nCoustIsHighOrLow(num, element) {
        if (Number(num) < 100) {
            element.innerHTML = '低';
        } else if (Number(num) >= 100 && Number(num) < 450) {
            element.innerHTML = '中';
        } else {
            element.innerHTML = '高';
        }
    }
}
