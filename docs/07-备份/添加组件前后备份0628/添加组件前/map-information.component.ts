import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxEchartsService } from 'ngx-echarts';
// import { URLSearchParams } from '@angular/http';
import { GetjsonService } from '../../service/getjson.service';
import { MyNewService } from '../../service/my-new.service';
import { HttpParams } from '@angular/common/http';

@Component({
selector: 'app-map-information',
templateUrl: './map-information.component.html',
styleUrls: ['./map-information.component.scss'],
})
export class MapInformationComponent implements OnInit, AfterViewInit {
  constructor(
    private nes: NgxEchartsService,
    private myNewService: MyNewService,
    private getJsonService: GetjsonService,
  ) { }
  // 地图
  // world country data
  WWHUBPrice = '98K';
  // 下拉框初始的data数据
  selectData: any = {
    geo: ['GLOBAL', 'WW HUB', 'AP', 'EMEA', 'NA', 'LAS'],
    geoActive: 'GLOBAL',
    region: {
      active: [
        'WW HUB', 'INDIA', 'HKTW', 'ASEAN', 'JAPAN', 'ANZ',
        'AP RH', 'EU', 'MEA', 'TR', 'RUCIS', 'ANZ', 'NA RH'
      ],
      regionGlobal: [
        'REGION', 'WW HUB', 'INDIA', 'HKTW', 'ASEAN', 'JAPAN', 'ANZ',
        'AP RH', 'EU', 'MEA', 'TR', 'RUCIS', 'ANZ', 'NA RH'
      ],
      regionWW: ['WW HUB'],
      regionApList: ['INDIA', 'HKTW', 'ASEAN', 'JAPAN', 'ANZ', 'AP RH'],
      regionEmeaList: ['EU', 'MEA', 'TR', 'RUCIS', 'ANZ'],
      regionLasList: ['LAS-LBG', 'LAS-TBG'],
      regionNaList: ['NA RH', 'NA-LBG', 'NA-TBG']
    },
    regionActive: 'REGION'
  };
  // 世界国家json数据
  worldCityData: any = [
    { name: 'Afghanistan', value: 28397.812 },
    { name: 'Angola', value: 19549.124 },
    { name: 'Albania', value: 3150.143 },
    { name: 'United Arab Emirates', value: 8441.537 },
    { name: 'Argentina', value: 40374.224 },
    { name: 'Armenia', value: 2963.496, },
    { name: 'French Southern and Antarctic Lands', value: 268.065 },
    { name: 'Australia', value: 22404.488 },
    { name: 'Austria', value: 8401.924 },
    { name: 'Azerbaijan', value: 9094.718 },
    { name: 'Burundi', value: 9232.753 },
    { name: 'Belgium', value: 10941.288 },
    { name: 'Benin', value: 9509.798 },
    { name: 'Burkina Faso', value: 15540.284 },
    { name: 'Bangladesh', value: 151125.475 },
    { name: 'Bulgaria', value: 7389.175 },
    { name: 'The Bahamas', value: 66402.316 },
    { name: 'Bosnia and Herz.', value: 3845.929 },
    { name: 'Belarus', value: 9491.07 },
    { name: 'Belize', value: 308.595 },
    { name: 'Bermuda', value: 64.951 },
    { name: 'Bolivia', value: 716.939 },
    { name: 'Brazil', value: 195210.154 },
    { name: 'Brunei', value: 27.223 },
    { name: 'Bhutan', value: 716.939 },
    { name: 'Botswana', value: 1969.341 },
    { name: 'Central African Republic', value: 4349.921 },
    { name: 'Canada', value: 34126.24 },
    { name: 'Switzerland', value: 7830.534 },
    { name: 'Chile', value: 17150.76 },
    { name: 'China', value: 1359821.465 },
    { name: 'Ivory Coast', value: 60508.978 },
    { name: 'Cameroon', value: 20624.343 },
    { name: 'Democratic Republic of the Congo', value: 62191.161 },
    { name: 'Republic of the Congo', value: 3573.024 },
    { name: 'Colombia', value: 46444.798 },
    { name: 'Costa Rica', value: 4669.685 },
    { name: 'Cuba', value: 11281.768 },
    { name: 'Northern Cyprus', value: 1.468 },
    { name: 'Cyprus', value: 1103.685 },
    { name: 'Czech Republic', value: 10553.701 },
    { name: 'Germany', value: 83017.404 },
    { name: 'Djibouti', value: 834.036 },
    { name: 'Denmark', value: 5550.959 },
    { name: 'Dominican Republic', value: 10016.797 },
    { name: 'Algeria', value: 37062.82 },
    { name: 'Ecuador', value: 15001.072 },
    { name: 'Egypt', value: 78075.705 },
    { name: 'Eritrea', value: 5741.159 },
    { name: 'Spain', value: 46182.038 },
    { name: 'Estonia', value: 1298.533 },
    { name: 'Ethiopia', value: 87095.281 },
    { name: 'Finland', value: 5367.693 },
    { name: 'Fiji', value: 860.559 },
    { name: 'Falkland Islands', value: 49.581 },
    { name: 'France', value: 63230.866 },
    { name: 'Gabon', value: 1556.222 },
    { name: 'United Kingdom', value: 62066.35 },
    { name: 'Georgia', value: 4388.674 },
    { name: 'Ghana', value: 24262.901 },
    { name: 'Guinea', value: 10876.033 },
    { name: 'Gambia', value: 1680.64 },
    { name: 'Guinea Bissau', value: 10876.033 },
    { name: 'Equatorial Guinea', value: 696.167 },
    { name: 'Greece', value: 11109.999 },
    { name: 'Greenland', value: 56.546 },
    { name: 'Guatemala', value: 14341.576 },
    { name: 'French Guiana', value: 231.169 },
    { name: 'Guyana', value: 786.126 },
    { name: 'Honduras', value: 7621.204 },
    { name: 'Croatia', value: 4338.027 },
    { name: 'Haiti', value: 9896.4 },
    { name: 'Hungary', value: 10014.633 },
    { name: 'Indonesia', value: 240676.485 },
    { name: 'India', value: 1205624.648 },
    { name: 'Ireland', value: 4467.561 },
    { name: 'Iran', value: 240676.485 },
    { name: 'Iraq', value: 30962.38 },
    { name: 'Iceland', value: 318.042 },
    { name: 'Israel', value: 7420.368 },
    { name: 'Italy', value: 60508.978 },
    { name: 'Jamaica', value: 2741.485 },
    { name: 'Jordan', value: 6454.554 },
    { name: 'Japan', value: 127352.833 },
    { name: 'Kazakhstan', value: 15921.127 },
    { name: 'Kenya', value: 40909.194 },
    { name: 'Kyrgyzstan', value: 5334.223 },
    { name: 'Cambodia', value: 14364.931 },
    { name: 'South Korea', value: 51452.352 },
    { name: 'Kosovo', value: 97.743 },
    { name: 'Kuwait', value: 2991.58 },
    { name: 'Laos', value: 6395.713 },
    { name: 'Lebanon', value: 4341.092 },
    { name: 'Liberia', value: 3957.99 },
    { name: 'Libya', value: 6040.612 },
    { name: 'Sri Lanka', value: 20758.779 },
    { name: 'Lesotho', value: 2008.921 },
    { name: 'Lithuania', value: 3068.457 },
    { name: 'Luxembourg', value: 507.885 },
    { name: 'Latvia', value: 2090.519 },
    { name: 'Morocco', value: 31642.36 },
    { name: 'Moldova', value: 103.619 },
    { name: 'Madagascar', value: 21079.532 },
    { name: 'Mexico', value: 117886.404 },
    { name: 'Macedonia', value: 507.885 },
    { name: 'Mali', value: 13985.961 },
    { name: 'Myanmar', value: 51931.231 },
    { name: 'Montenegro', value: 620.078 },
    { name: 'Mongolia', value: 2712.738 },
    { name: 'Mozambique', value: 23967.265 },
    { name: 'Mauritania', value: 3609.42 },
    { name: 'Malawi', value: 15013.694 },
    { name: 'Malaysia', value: 28275.835 },
    { name: 'Namibia', value: 2178.967 },
    { name: 'New Caledonia', value: 246.379 },
    { name: 'Niger', value: 15893.746 },
    { name: 'Nigeria', value: 159707.78 },
    { name: 'Nicaragua', value: 5822.209 },
    { name: 'Netherlands', value: 16615.243 },
    { name: 'Norway', value: 4891.251 },
    { name: 'Nepal', value: 26846.016 },
    { name: 'New Zealand', value: 4368.136 },
    { name: 'Oman', value: 2802.768 },
    { name: 'Pakistan', value: 173149.306 },
    { name: 'Panama', value: 3678.128 },
    { name: 'Peru', value: 29262.83 },
    { name: 'Philippines', value: 93444.322 },
    { name: 'Papua New Guinea', value: 6858.945 },
    { name: 'Poland', value: 38198.754 },
    { name: 'Puerto Rico', value: 3709.671 },
    { name: 'North Korea', value: 1.468 },
    { name: 'Portugal', value: 10589.792 },
    { name: 'Paraguay', value: 6459.721 },
    { name: 'Qatar', value: 1749.713 },
    { name: 'Romania', value: 21861.476 },
    { name: 'Russia', value: 1359821.465 },
    { name: 'Rwanda', value: 10836.732 },
    { name: 'Western Sahara', value: 514.648 },
    { name: 'Saudi Arabia', value: 27258.387 },
    { name: 'Sudan', value: 35652.002 },
    { name: 'South Sudan', value: 9940.929 },
    { name: 'Senegal', value: 12950.564 },
    { name: 'Solomon Islands', value: 526.447 },
    { name: 'Sierra Leone', value: 5751.976 },
    { name: 'El Salvador', value: 6218.195 },
    { name: 'Somaliland', value: 9636.173 },
    { name: 'Somalia', value: 9636.173 },
    { name: 'Serbia', value: 3573.024 },
    { name: 'Suriname', value: 524.96 },
    { name: 'Slovakia', value: 5433.437 },
    { name: 'Slovenia', value: 2054.232 },
    { name: 'Sweden', value: 9382.297 },
    { name: 'Swaziland', value: 1193.148 },
    { name: 'Syria', value: 7830.534 },
    { name: 'Chad', value: 11720.781 },
    { name: 'Togo', value: 6306.014 },
    { name: 'Thailand', value: 66402.316 },
    { name: 'Tajikistan', value: 7627.326 },
    { name: 'Turkmenistan', value: 5041.995 },
    { name: 'East Timor', value: 10016.797 },
    { name: 'Trinidad and Tobago', value: 1328.095 },
    { name: 'Tunisia', value: 10631.83 },
    { name: 'Turkey', value: 72137.546 },
    { name: 'United Republic of Tanzania', value: 44973.33 },
    { name: 'Uganda', value: 33987.213 },
    { name: 'Ukraine', value: 46050.22 },
    { name: 'Uruguay', value: 3371.982 },
    { name: 'United States', value: 312247.116 },
    { name: 'Uzbekistan', value: 27769.27 },
    { name: 'Venezuela', value: 236.299 },
    { name: 'Vietnam', value: 89047.397 },
    { name: 'Vanuatu', value: 236.299 },
    { name: 'West Bank', value: 13.565 },
    { name: 'Yemen', value: 22763.008 },
    { name: 'South Africa', value: 51452.352 },
    { name: 'Zambia', value: 13216.985 },
    { name: 'Zimbabwe', value: 13076.978 },
  ];
  // 四大区域国家数据
  areaData: any = {
    WWHUB: ['China'],
    AP: ['India', 'Pakistan', 'Nepal', 'Afghanistan', 'Iran', 'Turkmenistan'],
    EMEA: [
      'Ukraine', 'Belarus', 'Poland', 'Latvia', 'Estonia', 'Finland',
      'Sweden', 'Norway', 'Denmark', 'Germany', 'Slovakia', 'Hungary',
      'Croatia', 'Serbia', 'Bulgari', 'Romania', 'Macedonia', 'Albania',
      'Bosnia and Herz.', 'Italy', 'Switzerland', 'France'
    ],
    LAS: [
      'Colombia', 'Venezuela', 'Guyana', 'Suriname',
      'Ecuador', 'Peru', 'Bolivia', 'Brazil', 'Chile', 'Argentina',
      'Paraguay', 'Uruguay', 'Falkland Islands', 'Islas Malvinas',
    ],
    NA: ['Canada', 'United States', 'Mexico', 'Cuba', 'Greenland'],
  };
  // 四大区域于WWHUB的movelines数据
  replenlshMoveLines: any = [
    {
      fromName: 'WWHUB',
      toName: 'AP',
      'coords': [
        [121.47, 31.21],
        [77.21, 28.61]
      ]
    }, {
      fromName: 'WWHUB',
      toName: 'EMEA',
      'coords': [
        [121.47, 31.21],
        [5.80, 51.78]
      ]
    }, {
      fromName: 'WWHUB',
      toName: 'LAS',
      'coords': [
        [121.47, 31.21],
        [-61.87, -3.86]
      ]
    }, {
      fromName: 'WWHUB',
      toName: 'NA',
      'coords': [
        [121.47, 31.21],
        [-90.04, 35.14]
      ]
    }
  ];
  // 飞机矢量icon
  planePath: any = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
  private timer;
  // 左侧边栏的初始化数据
  sideBarLData: any = [
    {
      title: 'Inventory($)',
      iconCircle: true,
      iconArrow: true,
      compareVal: '2%',
      total: '249.67M'
    },
    {
      title: 'Consumption($)',
      iconCircle: false,
      iconArrow: false,
      compareVal: '1%',
      total: '11.88M'
    },
    {
      title: 'Part available level(%)',
      iconCircle: false,
      iconArrow: false,
      compareVal: '2%',
      total: '95.47'
    },
    {
      title: 'Week of Inventory(weeks)',
      iconCircle: true,
      iconArrow: false,
      compareVal: '4%',
      total: '19.85'
    }
  ];
  // 右侧边栏的初始化数据
  sideBarRData: any = [
    {
      title: 'Miss',
      iconCircle: false,
      iconArrow: false,
      compareVal: '2%',
      total: '3.9K'
    },
    {
      title: 'Replenish',
      iconCircle: false,
      iconArrow: false,
      compareVal: '1%',
      total: '80K'
    },
    {
      title: 'Transfer',
      iconCircle: false,
      iconArrow: false,
      compareVal: '2%',
      total: '4.2K'
    },
    {
      title: 'Reverse',
      iconCircle: false,
      iconArrow: false,
      compareVal: '4%',
      total: '1.4K'
    }
  ];
  // 五大区域散点图初始化数据
  fiveAreaDataTotal: any = [
    '123.12K', '123.12K', '123.12K', '123.12K', '123.12K'
  ];
  // 五大区域初始化数据信息(含坐标)
  fiveAreaData: any = [
    { name: 'WW hub', value: [121.47, 31.21, '100K'], },
    { name: 'AP', value: [77.21, 28.61, '6.36K'], },
    { name: 'EMEA', value: [5.80, 51.78, '123.12K'], },
    { name: 'LAS', value: [-61.87, -3.86, '93.32K'], },
    { name: 'NA', value: [-90.04, 35.14, '23.02K'], }
  ];
  // 五大区域个分区数组fiveAreaDataScatter图初始化数据
  fiveAreaDataScatter: any = {
    WWHUB: [{ name: 'WW hub', value: [121.47, 31.21], total: '100K' }],
    AP: [{ name: 'AP', value: [77.21, 28.61], total: '6.36K' }],
    EMEA: [{ name: 'EMEA', value: [5.80, 51.78], total: '123.12K' }],
    LAS: [{ name: 'LAS', value: [-61.87, -3.86], total: '93.32K' }],
    NA: [{ name: 'NA', value: [-90.04, 35.14], total: '93.32K' }]
  };

  // map Series data
  seriesData: any = {
    replenishLine: {
      name: '线路',
      type: 'lines',
      coordinateSystem: 'geo',
      zlevel: 4,
      large: true,
      effect: {
        show: true,
        constantSpeed: 30,
        symbol: this.planePath, // ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        symbolSize: 35,
        color: '#c13067',
        trailLength: 0,
      },
      label: {
        show: false,
        position: 'middle',
        formatter: function () {
          return 'AK47';
        }
      },
      emphasis: {
        label: {
          show: true
        }
      },
      lineStyle: {
        normal: {
          // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //   offset: 0,
          //   color: 'yellow'
          // }, {
          //   offset: 1,
          //   color: 'red'
          // }], false),
          color: '#ccc',
          width: 3,
          opacity: 0.6,
          curveness: 0.2
        }
      },
      data: this.replenlshMoveLines
    },
    replenishLineShadow: {
      name: '线路尾线',
      type: 'lines',
      zlevel: 1,  // 值太大时,飞机会虚线
      effect: {
        show: true,
        constantSpeed: 30,
        period: 6,
        trailLength: 0.9,
        color: '#45adf0',
        symbolSize: 3
      },
      lineStyle: {
        normal: {
          color: '#000',
          width: 0,
          opacity: 0.8,
          curveness: 0.2
        }
      },
      data: this.replenlshMoveLines
    },
  };
  // rank data
  rankData: any = [
    {
      title: 'Group by lifecyle',
      value: [
        { text: 'REG', num: 11, tip: '70.3K' },
        { text: 'LTBD', num: 12, tip: '70.3K' },
        { text: 'NPID', num: 13, tip: '70.3K' },
        { text: 'EOL', num: 14, tip: '70.3K' },
        { text: 'EOS', num: 15, tip: '70.3K' }
      ]

    },
    {
      title: 'Group by productSeri',
      value: [
        { text: 'TK', num: 21, tip: '70.3L' },
        { text: 'SD', num: 22, tip: '70.3L' },
        { text: 'SS', num: 23, tip: '70.3L' },
        { text: 'TM', num: 24, tip: '70.3L' },
        { text: 'EF', num: 25, tip: '70.3L' }
      ]
    },
    {
      title: 'Group by commodity',
      value: [
        { text: 'MX', num: 31, tip: '70.3B' },
        { text: 'OT ', num: 32, tip: '70.3B' },
        { text: 'HH', num: 33, tip: '70.3B' },
        { text: 'BT', num: 34, tip: '70.3B' },
        { text: 'SK', num: 35, tip: '70.3B' }
      ]
    },
    {
      title: 'Highest topmost PN',
      value: [
        { text: '04X440', num: 41, tip: '70.3T' },
        { text: '04X440', num: 42, tip: '70.3T' },
        { text: '04X440', num: 43, tip: '70.3T' },
        { text: '04X440', num: 44, tip: '70.3T' },
        { text: '04X440', num: 45, tip: '70.3T' }
      ]
    }
  ];
  rankName: any = 'avi';
  rankShow: any = false;
  checkboxShow: any = false;
  isLoading = false;

  // sidebar 添加active样式
  sidebarlCurrent: any = 0;
  sidebarrCurrent: any = 'true';
  sidebarData: any = [1, 2, 3, 4];

  // 示例图
  echartsInstance_map: any;
  echartsInstance_inv: any;
  echartsInstance_pal: any;
  echartsInstance_woi: any;
  echartsInstance_cpt: any;
  options: any = {};

  // hover地图选中
  options_map: any = {};
  options_bar_inv: any = {};
  options_line_pal: any = {};
  options_line_woi: any = {};
  options_line_cpt: any = {};

  kpiData: any = {
    invData: {
      xAxisData: ['2012-05-01', '2012-05-02', '2012-05-03', '2012-05-04', '2012-05-05', '2012-05-06'],
      seriesData: [120, 132, 101, 134, 90, 230]
    },
    palData: {
      xAxisData: ['2012-05-01', '2012-05-02', '2012-05-03', '2012-05-04', '2012-05-05', '2012-05-06'],
      seriesData: [120, 132, 101, 134, 90, 230]
    },
    woiData: {
      xAxisData: ['2012-05-01', '2012-05-02', '2012-05-03', '2012-05-04', '2012-05-05', '2012-05-06'],
      seriesData: [120, 132, 101, 134, 90, 230]
    },
    cptData: {
      xAxisData: ['2012-05-01', '2012-05-02', '2012-05-03', '2012-05-04', '2012-05-05', '2012-05-06'],
      seriesData: [120, 132, 101, 134, 90, 230]
    },
  };

  // checkbox group
  disStatus: any = true;
  checkStatus: any = false;
  options_map1: any = {};
  // checkbox nameData
  cekNameData: any = {
    BU: ['TBG', 'TBG'],
    IHSP: ['Inhouse', 'Service Provider'],
    Lifecycle: ['NPI', 'REG', 'EOS', 'EOL', 'LTBD'],
    Commodity: [
      'MX', 'OT', 'HH', 'IN', 'BT', 'BP',
      'HP', 'FD', 'OO', 'PX', 'SK',
    ]
  };
  // checkbox statue
  cekStatus: any = {
    time: 'WEEK',
    geo: 'global',
    Region: 'REGION',
    ckbDetails: true,
    CC: 'COMMODITYCODE',
    TopmostPN: 'DEFAULT',
    ckbStatusTbg: false,
    ckbStatusLbg: false,
    ckbStatusIh: false,
    ckbStatusSp: false,
    ckbStatusNpi: false,
    ckbStatusReg: false,
    ckbStatusEos: false,
    ckbStatusEol: false,
    ckbStatusLtb: false,
    ckbStatusPl: false,
    ckbStatusMa: false,
    ckbStatusCo: false,
    ckbStatusMm: false,
    ckbStatusHd: false,
    ckbStatusSd: false,
    ckbStatusLplf: false,
    ckbStatusKikb: false,
    ckbStatusOthers: false,
    submitStatus: false,
  };
  mapData: any = {
    InvData: {
      fiveAreaData: [
        { name: 'WW hub', value: [121.47, 31.21, '100Ki'], },
        { name: 'AP', value: [77.21, 28.61, '6.36Ki'], },
        { name: 'EMEA', value: [5.80, 51.78, '123.12Ki'], },
        { name: 'LAS', value: [-61.87, -3.86, '93.32Ki'], },
        { name: 'NA', value: [-90.04, 35.14, '23.02Ki'], }
      ],
      fiveAreaDataScatter: {
        WWHUB: [{ name: 'WW hub', value: [121.47, 31.21] }],
        AP: [{ name: 'AP', value: [77.21, 28.61] }],
        EMEA: [{ name: 'EMEA', value: [5.80, 51.78] }],
        LAS: [{ name: 'LAS', value: [-61.87, -3.86] }],
        NA: [{ name: 'NA', value: [-90.04, 35.14] }]
      },
      scatterFormat: {
        WWHUB: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        AP: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        EMEA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        LAS: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        NA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        }
      },
      replenlshMoveLines: [],
    },
    CspData: {
      fiveAreaData: [
        { name: 'WW hub', value: [121.47, 31.21, '100Kc'], },
        { name: 'AP', value: [77.21, 28.61, '6.36Kc'], },
        { name: 'EMEA', value: [5.80, 51.78, '123.12Kc'], },
        { name: 'LAS', value: [-61.87, -3.86, '93.32Kc'], },
        { name: 'NA', value: [-90.04, 35.14, '23.02Kc'], }
      ],
      fiveAreaDataScatter: {
        WWHUB: [{ name: 'WW hub', value: [121.47, 31.21] }],
        AP: [{ name: 'AP', value: [77.21, 28.61] }],
        EMEA: [{ name: 'EMEA', value: [5.80, 51.78] }],
        LAS: [{ name: 'LAS', value: [-61.87, -3.86] }],
        NA: [{ name: 'NA', value: [-90.04, 35.14] }]
      },
      scatterFormat: {
        WWHUB: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        AP: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        EMEA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        LAS: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        NA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        }
      },
      replenlshMoveLines: [],
    },
    PalData: {
      fiveAreaData: [
        { name: 'WW hub', value: [121.47, 31.21, '100Kp'], },
        { name: 'AP', value: [77.21, 28.61, '6.36Kp'], },
        { name: 'EMEA', value: [5.80, 51.78, '123.12Kp'], },
        { name: 'LAS', value: [-61.87, -3.86, '93.32Kp'], },
        { name: 'NA', value: [-90.04, 35.14, '23.02Kp'], }
      ],
      fiveAreaDataScatter: {
        WWHUB: [{ name: 'WW hub', value: [121.47, 31.21] }],
        AP: [{ name: 'AP', value: [77.21, 28.61] }],
        EMEA: [{ name: 'EMEA', value: [5.80, 51.78] }],
        LAS: [{ name: 'LAS', value: [-61.87, -3.86] }],
        NA: [{ name: 'NA', value: [-90.04, 35.14] }]
      },
      scatterFormat: {
        WWHUB: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        AP: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        EMEA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        LAS: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        NA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        }
      },
      replenlshMoveLines: [],
    },
    WoiData: {
      fiveAreaData: [
        { name: 'WW hub', value: [121.47, 31.21, '100Kw'], },
        { name: 'AP', value: [77.21, 28.61, '6.36Kw'], },
        { name: 'EMEA', value: [5.80, 51.78, '123.12Kw'], },
        { name: 'LAS', value: [-61.87, -3.86, '93.32Kw'], },
        { name: 'NA', value: [-90.04, 35.14, '23.02Kw'], }
      ],
      fiveAreaDataScatter: {
        WWHUB: [{ name: 'WW hub', value: [121.47, 31.21] }],
        AP: [{ name: 'AP', value: [77.21, 28.61] }],
        EMEA: [{ name: 'EMEA', value: [5.80, 51.78] }],
        LAS: [{ name: 'LAS', value: [-61.87, -3.86] }],
        NA: [{ name: 'NA', value: [-90.04, 35.14] }]
      },
      scatterFormat: {
        WWHUB: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        AP: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        EMEA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        LAS: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        NA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        }
      },
      replenlshMoveLines: [],
    },
    MisData: {
      fiveAreaData: [
        { name: 'WW hub', value: [121.47, 31.21, '100Km', 120], },
        { name: 'AP', value: [77.21, 28.61, '6.36Km', 80]},
        { name: 'EMEA', value: [5.80, 51.78, '123.12Km', 40]},
        { name: 'LAS', value: [-61.87, -3.86, '93.32Km', 100]},
        { name: 'NA', value: [-90.04, 35.14, '23.02Km', 50]}
      ],
      fiveAreaDataScatter: {
        WWHUB: [{ name: 'WW hub', value: [121.47, 31.21] }],
        AP: [{ name: 'AP', value: [77.21, 28.61] }],
        EMEA: [{ name: 'EMEA', value: [5.80, 51.78] }],
        LAS: [{ name: 'LAS', value: [-61.87, -3.86] }],
        NA: [{ name: 'NA', value: [-90.04, 35.14] }]
      },
      scatterFormat: {
        WWHUB: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        AP: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        EMEA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        LAS: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        NA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        }
      },
      replenlshMoveLines: [],
    },
    RpiData: {
      fiveAreaData: [
        { name: 'WW hub', value: [121.47, 31.21, '100Kr'], },
        { name: 'AP', value: [77.21, 28.61, '6.36Kr'], },
        { name: 'EMEA', value: [5.80, 51.78, '123.12Kr'], },
        { name: 'LAS', value: [-61.87, -3.86, '93.32Kr'], },
        { name: 'NA', value: [-90.04, 35.14, '23.02Kr'], }
      ],
      fiveAreaDataScatter: {
        WWHUB: [{ name: 'WW hub', value: [121.47, 31.21] }],
        AP: [{ name: 'AP', value: [77.21, 28.61] }],
        EMEA: [{ name: 'EMEA', value: [5.80, 51.78] }],
        LAS: [{ name: 'LAS', value: [-61.87, -3.86] }],
        NA: [{ name: 'NA', value: [-90.04, 35.14] }]
      },
      scatterFormat: {
        WWHUB: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        AP: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        EMEA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        LAS: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        NA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        }
      },
      replenlshMoveLines: [
        {
          fromName: 'WWHUB',
          toName: 'AP',
          'coords': [
            [121.47, 31.21],
            [78.39, 24.36]
          ]
        }, {
          fromName: 'WWHUB',
          toName: 'EMEA',
          'coords': [
            [121.47, 31.21],
            [5.80, 51.78]
          ]
        }, {
          fromName: 'WWHUB',
          toName: 'LAS',
          'coords': [
            [121.47, 31.21],
            [-61.87, -3.86]
          ]
        }, {
          fromName: 'WWHUB',
          toName: 'NA',
          'coords': [
            [121.47, 31.21],
            [-97.38, 55.57]
          ]
        }
      ]
    },
    TsfData: {
      fiveAreaData: [
        { name: 'WW hub', value: [121.47, 31.21, '100Kt'] },
        { name: 'AP', value: [77.21, 28.61, '6.36Kt'] },
        { name: 'EMEA', value: [5.80, 51.78, '123.12Kt'] },
        { name: 'LAS', value: [-61.87, -3.86, '93.32Kt'] },
        { name: 'NA', value: [-90.04, 35.14, '23.02Kt'] }
      ],
      fiveAreaDataScatter: {
        WWHUB: [{ name: 'WW hub', value: [121.47, 31.21] }],
        AP: [{ name: 'AP', value: [77.21, 28.61] }],
        EMEA: [{ name: 'EMEA', value: [5.80, 51.78] }],
        LAS: [{ name: 'LAS', value: [-61.87, -3.86] }],
        NA: [{ name: 'NA', value: [-90.04, 35.14] }]
      },
      scatterFormat: {
        WWHUB: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        AP: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        EMEA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        LAS: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        NA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        }
      },
      replenlshMoveLines: []
    },
    RvsData: {
      fiveAreaData: [
        { name: 'WW hub', value: [121.47, 31.21, '100Kr'] },
        { name: 'AP', value: [77.21, 28.61, '6.36Kr'] },
        { name: 'EMEA', value: [5.80, 51.78, '123.12Kr'] },
        { name: 'LAS', value: [-61.87, -3.86, '93.32Kr'] },
        { name: 'NA', value: [-90.04, 35.14, '23.02Kr'] }
      ],
      fiveAreaDataScatter: {
        WWHUB: [{ name: 'WW hub', value: [121.47, 31.21] }],
        AP: [{ name: 'AP', value: [77.21, 28.61] }],
        EMEA: [{ name: 'EMEA', value: [5.80, 51.78] }],
        LAS: [{ name: 'LAS', value: [-61.87, -3.86] }],
        NA: [{ name: 'NA', value: [-90.04, 35.14] }]
      },
      scatterFormat: {
        WWHUB: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        AP: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        EMEA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        LAS: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        },
        NA: {
          title: '93.32K',
          iconArrow1: '↑',
          rate1: '%2',
          value1: 'Consumption',
          iconArrow2: '↑',
          rate2: '%3',
          value2: 'Quantity',
          quantity: '12.21K'
        }
      },
      replenlshMoveLines: []
    }
  };
  ngOnInit() {
    this.setOptMap();

    // 首次加载获取sidebarData
    this.getSidebarTitData({tFlag: 'default'});

    // 首次加载获取sideBar Invdata
    this.setMapListLiftTotal(0);

    // 首次加载获取kpi图表数据
    this.getKpiData();
  }
  ngAfterViewInit() {
    // this.timer = setTimeout(() => {
    //   const echarts = this.nes.echarts;
    //   const chartElement1 = document.getElementById('echart_pal');
    //   const myChart = echarts.init(chartElement1);
    //   console.log(myChart._api.dispatchAction({
    //     type: 'showTip',
    //     seriesIndex: 0,
    //     dataIndex: 3
    //   }));

    // }, 1000);

    // 初始化四个图表
    this.setTooltipInv(0, 1);
    this.setTooltipPal(0, 1);
    this.setTooltipWoi(0, 1);
    this.setTooltipCpt(0, 1);
  }
  // 初始化世界地图实例
  private initChartMap(ec) {
    this.echartsInstance_map = ec;
  }
  // 从新setOption
  private setOptMap() {
    this.options_map = {
      tooltip: {  //  鼠标放上去提示框文字
        show: false,
        trigger: 'item',
        formatter: function (params) {
          // console.log(params,'aaaaaaaaaaaaaa');
          let value: any;
          value = (params.value + '').split('.');
          value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
            + '.' + value[1];
          return params.seriesName + '<br/>' + params.name + ' : ' + value;
        },

      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { readOnly: false },
        }
      },
      geo: {
        show: true,
        map: 'world',
        // roam: true, // 是否开启缩放
        center: [20.97, 25.71],
        aspectScale: 0.9,
        zoom: 1.3,
        label: {
          show: false,
          color: '#fff',
        },
        itemStyle: {
          // label 地图上的字
          areaColor: '#323a52',
          color: 'red',
          borderWidth: 0,
          borderColor: '#131a33'
        },
        emphasis: {
          label: {
            show: true,
            color: '#fff',
          },
          itemStyle: {
            areaColor: '#2f82aa',
            borderWidth: 0
          },
        },
        data: this.worldCityData
      },
      series: [
        // map 配置
        {
          name: 'SSC',
          type: 'map',
          mapType: 'world',
          roam: true,
          zoom: 1.9,
          geoIndex: 0,
          label: {
            show: true,
            color: '#fff',
          },
          itemStyle: {
            // label 地图上的字
            areaColor: '#323a52',
            color: 'red',
            borderWidth: 0,
            borderColor: '#131a33'
          },
          emphasis: {
            label: {
              show: false,
              color: '#fff',
            },
            itemStyle: {
              areaColor: '#2f82aa',
              borderWidth: 0
            },
          },
          aspectScale: 0.9,
          data: this.worldCityData
        },
        // 散点图五大区总量配置
        {
          name: '散点五大区域',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: this.fiveAreaData,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 40,
          symbolKeepAspect: true,
          label: {
            normal: {
              position: 'right',
              formatter: [
                '{a|{b}}',
                '{b|{@[2]}}'
              ].join('\n'),
              rich: {
                a: {
                  color: '#fff',
                  fontSize: 18,
                  lineHeight: 18,
                  padding: [0, 0, 25, 20],
                },
                b: {
                  color: '#fff',
                  fontSize: 30,
                  lineHeight: 30,
                  padding: [0, 0, 45, -45],
                  fontFamily: 'Gotham-Light',
                },
                x: {
                  fontSize: 18,
                  fontFamily: 'Microsoft YaHei',
                  borderColor: '#449933',
                  borderRadius: 4
                },
              },
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            color: 'red'
          }
        },
        // 散点图LAS区域Inv总量配置
        {
          name: '散点五大区域LAS',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: this.fiveAreaDataScatter.LAS,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: [
              '{title|93.32K}{abg1|}',
              '{iconArrow1|↑}{rate1|%2}{value1|(Consumption)}',
              '{iconArrow2|↑}{rate2|%2}{value2|(Quantity)}{number|12.21K}{abg|}',
            ].join('\n'),
            // borderColor: '#777',
            // borderWidth: 1,
            // borderRadius: 4,
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          }
        },
        // 散点图NA区域NA总量配置
        {
          name: '散点五大区域NA',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: this.fiveAreaDataScatter.NA,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: [
              '{title|94.32K}{abg1|}',
              '{iconArrow1|↑}{rate1|%2}{value1|(Consumption)}',
              '{iconArrow2|↑}{rate2|%2}{value2|(Quantity)}{number|12.21K}{abg|}',
            ].join('\n'),
            // borderColor: '#777',
            // borderWidth: 1,
            // borderRadius: 4,
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          }
        },
        // 散点图EMEA区域EMEA总量配置
        {
          name: '散点五大区域EMEA',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: this.fiveAreaDataScatter.EMEA,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: [
              '{title|94.32K}{abg1|}',
              '{iconArrow1|↑}{rate1|%2}{value1|(Consumption)}',
              '{iconArrow2|↑}{rate2|%2}{value2|(Quantity)}{number|12.21K}{abg|}',
            ].join('\n'),
            // borderColor: '#777',
            // borderWidth: 1,
            // borderRadius: 4,
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          }
        },
        // 散点图AP区域AP总量配置
        {
          name: '散点五大区域AP',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: this.fiveAreaDataScatter.AP,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: [
              '{title|94.32K}{abg1|}',
              '{iconArrow1|↑}{rate1|%2}{value1|(Consumption)}',
              '{iconArrow2|↑}{rate2|%2}{value2|(Quantity)}{number|12.21K}{abg|}',
            ].join('\n'),
            // borderColor: '#777',
            // borderWidth: 1,
            // borderRadius: 4,
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          }
        },
        // 散点图WWHUB区域WWHUB总量配置
        {
          name: '散点五大区域WWHUB',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: this.fiveAreaDataScatter.WWHUB,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: [
              '{title|' + this.WWHUBPrice + '}{abg1|}',
              '{iconArrow1|↑}{rate1|%2}{value1|(Consumption)}',
              '{iconArrow2|↑}{rate2|%2}{value2|(Quantity)}{number|12.21K}{abg|}',
            ].join('\n'),
            // borderColor: '#777',
            // borderWidth: 1,
            // borderRadius: 4,
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          },
        },
        // replenlsh movelines 图
        // this.seriesData.replenishLine,
        // 飞机后面的动态线
        // this.seriesData.replenishLineShadow
      ]
    };
  }
  // map 鼠标hover事件
  private onChartEvent(event: any, type: string) {
    // console.log('chart event:', type, event);
    const arrLAS = this.areaData.LAS; // LAS区域的国家数组
    const nameItemLAS = event.name;
    // 判断鼠标移入状态
    if (type === 'chartMouseOver') {
      // 遍历五大区域的国家json
      for (const key in this.areaData) {
        if (this.areaData.hasOwnProperty(key)) {
          const element = this.areaData[key];
          for (let index = 0; index < element.length; index++) {
            // 判断是LAS大区
            if (key === 'LAS' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              if (this.sidebarlCurrent && this.sidebarrCurrent === 1) {
                this.echartsInstance_map.setOption({
                  series: [
                    {
                      name: '散点五大区域LAS',
                      label: {
                        normal: {
                          show: true,
                        },
                      },
                    },
                    // replenlsh movelines 图
                    this.seriesData.replenishLine,
                    // 飞机后面的动态线
                    // this.seriesData.replenishLineShadow
                  ]
                });
              } else {
                this.echartsInstance_map.setOption({
                  series: [
                    {
                      name: '散点五大区域LAS',
                      label: {
                        normal: {
                          show: true,
                        },
                      },
                    },
                    // replenlsh movelines 图
                    // this.seriesData.replenishLine,
                    // 飞机后面的动态线
                    // this.seriesData.replenishLineShadow
                  ]
                });
              }
              // 从新设置map的属性，让地图取消高亮
              this.echartsInstance_map.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: [4, 29, 22, 166, 132, 21, 125, 35, 46, 148, 68, 169]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            } else if (key === 'NA' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              this.echartsInstance_map.setOption({
                series: [
                  {
                    name: '散点五大区域NA',
                    label: {
                      normal: {
                        show: true,
                      },
                    },
                  },
                  // replenlsh movelines 图
                  // this.seriesData.replenishLine,
                  // 飞机后面的动态线
                  // this.seriesData.replenishLineShadow
                ]
              });
              // 从新设置map的属性，让地图高亮
              this.echartsInstance_map.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: [27, 167, 103, 65]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            } else if (key === 'AP' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              this.echartsInstance_map.setOption({
                series: [
                  {
                    name: '散点五大区域AP',
                    label: {
                      normal: {
                        show: true,
                      },
                    },
                  },
                  // replenlsh movelines 图
                  // this.seriesData.replenishLine,
                  // 飞机后面的动态线
                  // this.seriesData.replenishLineShadow
                ]
              });
              // 从新设置map的属性，让地图高亮
              this.echartsInstance_map.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: [74, 123, 0, 158, 76, 120]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            } else if (key === 'EMEA' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              this.echartsInstance_map.setOption({
                series: [
                  {
                    name: '散点五大区域EMEA',
                    label: {
                      normal: {
                        show: true,
                      },
                    },
                  },
                  // replenlsh movelines 图
                  // this.seriesData.replenishLine,
                  // 飞机后面的动态线
                  // this.seriesData.replenishLineShadow
                ]
              });
              // 从新设置map的属性，让地图高亮
              this.echartsInstance_map.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: [
                  165, 18, 128, 99, 50, 52, 151, 119, 43, 41, 149, 72,
                  70, 147, 15, 134, 104, 2, 17, 80, 55, 28
                ]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            } else if (key === 'WWHUB' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              this.echartsInstance_map.setOption({
                series: [
                  {
                    name: '散点五大区域WWHUB',
                    label: {
                      normal: {
                        show: true,
                      },
                    },
                  },
                  // replenlsh movelines 图
                  // this.seriesData.replenishLine,
                  // 飞机后面的动态线
                  // this.seriesData.replenishLineShadow
                ]
              });
              // 从新设置map的属性，让地图高亮
              this.echartsInstance_map.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: [30]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            }
          }
        }
      }
    } else if (type === 'chartMouseOut') {  // 鼠标移出状态
      for (const key in this.areaData) {
        if (this.areaData.hasOwnProperty(key)) {
          const element = this.areaData[key];
          for (let index = 0; index < element.length; index++) {
            // 判断是LAS大区
            if (key === 'LAS' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              if (this.sidebarlCurrent && this.sidebarrCurrent === 1) {
                this.echartsInstance_map.setOption({
                  series: [
                    {
                      name: '散点五大区域LAS',
                      label: {
                        normal: {
                          show: false,
                        },
                      },
                    },
                    // replenlsh movelines 图
                    this.seriesData.replenishLine,
                    // 飞机后面的动态线
                    // this.seriesData.replenishLineShadow
                  ]
                });
              } else {
                this.echartsInstance_map.setOption({
                  series: [
                    {
                      name: '散点五大区域LAS',
                      label: {
                        normal: {
                          show: false,
                        },
                      },
                    },
                    // replenlsh movelines 图
                    // this.seriesData.replenishLine,
                    // 飞机后面的动态线
                    // this.seriesData.replenishLineShadow
                  ]
                });
              }
              // 从新设置map的属性，让地图取消高亮
              this.echartsInstance_map.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: [4, 29, 22, 166, 132, 21, 125, 35, 46, 148, 68, 169]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            } else if (key === 'NA' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              this.echartsInstance_map.setOption({
                series: [
                  {
                    name: '散点五大区域NA',
                    label: {
                      normal: {
                        show: false,
                      },
                    },
                  },
                  // replenlsh movelines 图
                  // this.seriesData.replenishLine,
                  // 飞机后面的动态线
                  // this.seriesData.replenishLineShadow
                ]
              });
              // 从新设置map的属性，让地图取消高亮
              this.echartsInstance_map.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: [27, 167, 103, 65]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            } else if (key === 'AP' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              this.echartsInstance_map.setOption({
                series: [
                  {
                    name: '散点五大区域AP',
                    label: {
                      normal: {
                        show: false,
                      },
                    },
                  },
                  // replenlsh movelines 图
                  // this.seriesData.replenishLine,
                  // 飞机后面的动态线
                  // this.seriesData.replenishLineShadow
                  // 从新设置map的属性，让地图取消高亮
                ]
              });
              this.echartsInstance_map.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: [74, 123, 0, 158, 76, 120]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            } else if (key === 'EMEA' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              this.echartsInstance_map.setOption({
                series: [
                  {
                    name: '散点五大区域EMEA',
                    label: {
                      normal: {
                        show: false,
                      },
                    },
                  },
                  // replenlsh movelines 图
                  // this.seriesData.replenishLine,
                  // 飞机后面的动态线
                  // this.seriesData.replenishLineShadow
                ]
              });
              // 从新设置map的属性，让地图取消高亮
              this.echartsInstance_map.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: [
                  165, 18, 128, 99, 50, 52, 151, 119, 43, 41, 149, 72,
                  70, 147, 15, 134, 104, 2, 17, 80, 55, 28
                ]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            } else if (key === 'WWHUB' && nameItemLAS === element[index] && this.echartsInstance_map) {
              // 显示散点五大区域LAS
              this.echartsInstance_map.setOption({
                series: [
                  {
                    name: '散点五大区域WWHUB',
                    label: {
                      normal: {
                        show: false,
                      },
                    },
                  },
                  // replenlsh movelines 图
                  // this.seriesData.replenishLine,
                  // 飞机后面的动态线
                  // this.seriesData.replenishLineShadow
                ]
              });
              // 从新设置map的属性，让地图取消高亮
              this.echartsInstance_map.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: [30]
              });
              // const testPx = this.echartsInstance_map._api.getDevicePixelRatio({geoIndex: 1}, [128.3324, 89.5344]);
              // console.log(testPx);
              break;
            }
          }
        }
      }
      // this.setOptMap(this.LAS_state);
      // console.log(event.name);
    }
  }
  // map 鼠标点击事件
  private onChartEventclick(event: any, type: string) {
    const arrLAS = this.areaData.LAS;
    const nameItemLAS = event.name;
    for (let index = 0; index < arrLAS.length; index++) {
      if (nameItemLAS === arrLAS[index]) {
        // this.LAS_state = false;
        break;
      }
    }
    // this.setOptMap(this.LAS_state);
  }
  // sidebar 点击动态切换数据
  private setSidebarlCurrent(param: any) {
    this.sidebarrCurrent = 'true';
    this.sidebarlCurrent = param;
  }
  private setSidebarrCurrent(param: any) {
    this.sidebarlCurrent = 'true';
    this.sidebarrCurrent = param;
  }
  private setMapListLiftTotal(param: any) {
    const sidebarrCurrent = this.sidebarrCurrent;
    if (this.sidebarrCurrent) {
      switch (param) {
        case 0:
          // 1. 发送ajax请求, 给Inventory的Data 赋值
          this.getSidebarData({tFlag: 'invdata'});
          // 2. 调用 setInvOption方法
          break;
        case 1:
          // 1. 发送ajax请求, 给Consumption的Data 赋值
          this.getSidebarData({tFlag: 'cspdata'});
          break;
        case 2:
          // 1. 发送ajax请求, 给Part available level的Data 赋值
          this.getSidebarData({tFlag: 'paldata'});
          break;
        case 3:
          // 1. 发送ajax请求, 给week of Inventory的Data 赋值
          this.getSidebarData({tFlag: 'woidata'});
          break;
      }
    }
  }
  private setMapListRightTotal(param: any) {
    const sidebarlCurrent = this.sidebarlCurrent;
    let name = 'default';
    const data = this.mapData;
    if (this.sidebarlCurrent) {
      switch (param) {
        case 0:
          console.log('Mis');
          this.getSidebarData({tFlag: 'misdata'});
          break;
        case 1:
          console.log('Rpi');
          this.getSidebarData({tFlag: 'rpidata'});
          break;
        case 2:
          console.log('Tsf');
          this.getSidebarData({tFlag: 'tsfdata'});
          break;
        case 3:
          console.log('Rvs');
          name = 'Rvs';
          this.getSidebarData({tFlag: 'rvsdata'});
          break;
      }
    }
  }
  // 设置options_map 绘制地图
  public setOptionsMap(optData: any, name: any) {
    console.log(optData);
    console.log(optData.scatterFormat);
    if (name === 'Pal') {
      this.options_map = {};
      this.options_map = {
        tooltip: {  //  鼠标放上去提示框文字
          show: false,
          trigger: 'item',
          formatter: function (params) {
            let value: any;
            value = (params.value + '').split('.');
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
              + '.' + value[1];
            return params.seriesName + '<br/>' + params.name + ' : ' + value;
          },

        },
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        geo: {
          show: true,
          map: 'world',
          center: [20.97, 25.71],
          aspectScale: 0.9,
          zoom: 1.3,
          label: {
            show: false,
            color: '#fff',
          },
          itemStyle: {
            // label 地图上的字
            areaColor: '#323a52',
            color: 'red',
            borderWidth: 0,
            borderColor: '#131a33'
          },
          emphasis: {
            label: {
              show: true,
              color: '#fff',
            },
            itemStyle: {
              areaColor: '#2f82aa',
              borderWidth: 0
            },
          },
          data: this.worldCityData
        },
        series: [
          // map 配置
          {
            name: 'SSC',
            type: 'map',
            mapType: 'world',
            roam: true,
            geoIndex: 0,
            label: {
              show: true,
              color: '#fff',
            },
            itemStyle: {
              // label 地图上的字
              areaColor: '#323a52',
              color: 'red',
              borderWidth: 0,
              borderColor: '#131a33'
            },
            emphasis: {
              label: {
                show: false,
                color: '#fff',
              },
              itemStyle: {
                areaColor: '#2f82aa',
                borderWidth: 0
              },
            },
            aspectScale: 0.9,
            zoom: 1.5,
            data: this.worldCityData
          },
          // 散点图五大区总量配置
          {
            name: '散点五大区域',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaData,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 40,
            symbolKeepAspect: true,
            label: {
              normal: {
                position: 'right',
                formatter: [
                  '{a|{b}}',
                  '{b|{@[2]}}'
                ].join('\n'),
                rich: {
                  a: {
                    color: '#fff',
                    fontSize: 18,
                    lineHeight: 18,
                    padding: [0, 0, 25, 20],
                  },
                  b: {
                    color: '#fff',
                    fontSize: 30,
                    lineHeight: 30,
                    padding: [0, 0, 45, -45],
                    fontFamily: 'Gotham-Light',
                  },
                  x: {
                    fontSize: 18,
                    fontFamily: 'Microsoft YaHei',
                    borderColor: '#449933',
                    borderRadius: 4
                  },
                },
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              color: 'red'
            }
          },
          // 散点图LAS区域Inv总量配置
          {
            name: '散点五大区域LAS',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.LAS,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.LAS.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.LAS.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.LAS.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.LAS.rate1 + '}{value1|' + optData.scatterFormat.LAS.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.LAS.rate2 + '}{value2|' + optData.scatterFormat.LAS.value2 + '}{number|' + optData.scatterFormat.LAS.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图NA区域Inv总量配置
          {
            name: '散点五大区域NA',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.NA,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.NA.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.NA.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.NA.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.NA.rate1 + '}{value1|' + optData.scatterFormat.NA.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.NA.rate2 + '}{value2|' + optData.scatterFormat.NA.value2 + '}{number|' + optData.scatterFormat.NA.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图EMEA区域EMEA总量配置
          {
            name: '散点五大区域EMEA',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.EMEA,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.EMEA.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.EMEA.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.EMEA.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.EMEA.rate1 + '}{value1|' + optData.scatterFormat.EMEA.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.EMEA.rate2 + '}{value2|' + optData.scatterFormat.EMEA.value2 + '}{number|' + optData.scatterFormat.EMEA.quantity + '}{abg|}'
                ].join('\n');
              },
              // borderColor: '#777',
              // borderWidth: 1,
              // borderRadius: 4,
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图AP区域AP总量配置
          {
            name: '散点五大区域AP',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.AP,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.AP.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.AP.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.AP.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.AP.rate1 + '}{value1|' + optData.scatterFormat.AP.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.AP.rate2 + '}{value2|' + optData.scatterFormat.AP.value2 + '}{number|' + optData.scatterFormat.AP.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          }
        ]
      };
      return false;
    } else if (name === 'Rpi') {
      this.options_map = {};
      this.options_map = {
        tooltip: {  //  鼠标放上去提示框文字
          show: false,
          trigger: 'item',
          formatter: function (params) {
            let value: any;
            value = (params.value + '').split('.');
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
              + '.' + value[1];
            return params.seriesName + '<br/>' + params.name + ' : ' + value;
          },

        },
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        geo: {
          show: true,
          map: 'world',
          center: [20.97, 25.71],
          aspectScale: 0.9,
          zoom: 1.3,
          label: {
            show: false,
            color: '#fff',
          },
          itemStyle: {
            // label 地图上的字
            areaColor: '#323a52',
            color: 'red',
            borderWidth: 0,
            borderColor: '#131a33'
          },
          emphasis: {
            label: {
              show: true,
              color: '#fff',
            },
            itemStyle: {
              areaColor: '#2f82aa',
              borderWidth: 0
            },
          },
          data: this.worldCityData
        },
        series: [
          // map 配置
          {
            name: 'SSC',
            type: 'map',
            mapType: 'world',
            roam: true,
            geoIndex: 0,
            label: {
              show: true,
              color: '#fff',
            },
            itemStyle: {
              // label 地图上的字
              areaColor: '#323a52',
              color: 'red',
              borderWidth: 0,
              borderColor: '#131a33'
            },
            emphasis: {
              label: {
                show: false,
                color: '#fff',
              },
              itemStyle: {
                areaColor: '#2f82aa',
                borderWidth: 0
              },
            },
            aspectScale: 0.9,
            zoom: 1.5,
            data: this.worldCityData
          },
          // 散点图五大区总量配置
          {
            name: '散点五大区域',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaData,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 40,
            symbolKeepAspect: true,
            label: {
              normal: {
                position: 'right',
                formatter: [
                  '{a|{b}}',
                  '{b|{@[2]}}'
                ].join('\n'),
                rich: {
                  a: {
                    color: '#fff',
                    fontSize: 18,
                    lineHeight: 18,
                    padding: [0, 0, 25, 20],
                  },
                  b: {
                    color: '#fff',
                    fontSize: 30,
                    lineHeight: 30,
                    padding: [0, 0, 45, -45],
                    fontFamily: 'Gotham-Light',
                  },
                  x: {
                    fontSize: 18,
                    fontFamily: 'Microsoft YaHei',
                    borderColor: '#449933',
                    borderRadius: 4
                  },
                },
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              color: 'red'
            }
          },
          // 散点图LAS区域Inv总量配置
          {
            name: '散点五大区域LAS',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.LAS,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.LAS.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.LAS.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.LAS.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.LAS.rate1 + '}{value1|' + optData.scatterFormat.LAS.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.LAS.rate2 + '}{value2|' + optData.scatterFormat.LAS.value2 + '}{number|' + optData.scatterFormat.LAS.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图NA区域Inv总量配置
          {
            name: '散点五大区域NA',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.NA,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.NA.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.NA.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.NA.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.NA.rate1 + '}{value1|' + optData.scatterFormat.NA.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.NA.rate2 + '}{value2|' + optData.scatterFormat.NA.value2 + '}{number|' + optData.scatterFormat.NA.quantity + '}{abg|}'
                ].join('\n');
              },
              // borderColor: '#777',
              // borderWidth: 1,
              // borderRadius: 4,
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图EMEA区域EMEA总量配置
          {
            name: '散点五大区域EMEA',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.EMEA,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.EMEA.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.EMEA.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.EMEA.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.EMEA.rate1 + '}{value1|' + optData.scatterFormat.EMEA.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.EMEA.rate2 + '}{value2|' + optData.scatterFormat.EMEA.value2 + '}{number|' + optData.scatterFormat.EMEA.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图AP区域AP总量配置
          {
            name: '散点五大区域AP',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.AP,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.AP.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.AP.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.AP.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.AP.rate1 + '}{value1|' + optData.scatterFormat.AP.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.AP.rate2 + '}{value2|' + optData.scatterFormat.AP.value2 + '}{number|' + optData.scatterFormat.AP.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图WWHUB区域WWHUB总量配置
          {
            name: '散点五大区域WWHUB',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.WWHUB,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.WWHUB.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.WWHUB.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.WWHUB.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.WWHUB.rate1 + '}{value1|' + optData.scatterFormat.WWHUB.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.WWHUB.rate2 + '}{value2|' + optData.scatterFormat.WWHUB.value2 + '}{number|' + optData.scatterFormat.WWHUB.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            },
          },
          // replenlsh movelines 图
          {
            name: '线路',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 4,
            large: true,
            effect: {
              show: true,
              constantSpeed: 30,
              symbol: this.planePath, // ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
              symbolSize: 35,
              color: '#c13067',
              trailLength: 0,
            },
            label: {
              show: false,
              position: 'middle',
              formatter: function () {
                return 'AK47';
              }
            },
            emphasis: {
              label: {
                show: true
              }
            },
            lineStyle: {
              normal: {
                color: '#ccc',
                width: 3,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: optData.replenlshMoveLines,
            largeThreshold: 8000,
            animationThreshold: 8000,
            animationDuration: 8000,
            animationDelay: 200
          }
          // 飞机后面的动态线
          // optData.RpiData.seriesData.replenishLineShadow
        ]
      };
      return false;
    } else if (name === 'Mis') {
      this.options_map = {};
      this.options_map = {
        tooltip: {  //  鼠标放上去提示框文字
          show: false,
          trigger: 'item',
          formatter: function (params) {
            let value: any;
            value = (params.value + '').split('.');
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
              + '.' + value[1];
            return params.seriesName + '<br/>' + params.name + ' : ' + value;
          },

        },
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        geo: {
          show: true,
          map: 'world',
          center: [20.97, 25.71],
          aspectScale: 0.9,
          zoom: 1.3,
          label: {
            show: false,
            color: '#fff',
          },
          itemStyle: {
            // label 地图上的字
            areaColor: '#323a52',
            color: 'red',
            borderWidth: 0,
            borderColor: '#131a33'
          },
          emphasis: {
            label: {
              show: true,
              color: '#fff',
            },
            itemStyle: {
              areaColor: '#2f82aa',
              borderWidth: 0
            },
          },
          data: this.worldCityData
        },
        series: [
          // map 配置
          {
            name: 'SSC',
            type: 'map',
            mapType: 'world',
            roam: true,
            geoIndex: 0,
            label: {
              show: true,
              color: '#fff',
            },
            itemStyle: {
              // label 地图上的字
              areaColor: '#323a52',
              color: 'red',
              borderWidth: 0,
              borderColor: '#131a33'
            },
            emphasis: {
              label: {
                show: false,
                color: '#fff',
              },
              itemStyle: {
                areaColor: '#2f82aa',
                borderWidth: 0
              },
            },
            aspectScale: 0.9,
            zoom: 1.5,
            data: this.worldCityData
          },
          // 散点图LAS区域Inv总量配置
          {
            name: '散点五大区域LAS',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.LAS,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.LAS.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.LAS.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.LAS.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.LAS.rate1 + '}{value1|' + optData.scatterFormat.LAS.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.LAS.rate2 + '}{value2|' + optData.scatterFormat.LAS.value2 + '}{number|' + optData.scatterFormat.LAS.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图NA区域Inv总量配置
          {
            name: '散点五大区域NA',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.NA,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.NA.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.NA.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.NA.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.NA.rate1 + '}{value1|' + optData.scatterFormat.NA.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.NA.rate2 + '}{value2|' + optData.scatterFormat.NA.value2 + '}{number|' + optData.scatterFormat.NA.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图EMEA区域Inv总量配置
          {
            name: '散点五大区域EMEA',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.EMEA,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.EMEA.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.EMEA.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.EMEA.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.EMEA.rate1 + '}{value1|' + optData.scatterFormat.EMEA.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.EMEA.rate2 + '}{value2|' + optData.scatterFormat.EMEA.value2 + '}{number|' + optData.scatterFormat.EMEA.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图AP区域AP总量配置
          {
            name: '散点五大区域AP',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 5,
            data: optData.fiveAreaDataScatter.AP,
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: 38,
            symbolKeepAspect: true,
            label: {
              show: false,
              width: 185,
              height: 123,
              position: [0, 35],
              backgroundColor: '#14224D',
              formatter: function () {
                const icon1 = optData.scatterFormat.AP.iconArrow1 ? '↑' : '↓';
                const icon2 = optData.scatterFormat.AP.iconArrow2 ? '↑' : '↓';
                return [
                  '{title|' + optData.scatterFormat.AP.title + '}{abg1|}',
                  '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.AP.rate1 + '}{value1|' + optData.scatterFormat.AP.value1 + '}',
                  '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.AP.rate2 + '}{value2|' + optData.scatterFormat.AP.value2 + '}{number|' + optData.scatterFormat.AP.quantity + '}{abg|}'
                ].join('\n');
              },
              rich: {
                title: {
                  width: 173,
                  height: 49,
                  backgroundColor: '#14224D',
                  borderRadius: [4, 4, 0, 0],
                  color: '#F4F6FF',
                  fontSize: 30,
                  fontFamily: 'Gotham-Medium',
                  lineHeight: 43,
                  align: 'left',
                  padding: [0, 0, 0, 12],
                },
                abg: {
                  backgroundColor: '#7992F5',
                  width: '100%',
                  align: 'right',
                  height: 35,
                  borderRadius: [0, 0, 4, 4],
                },
                iconArrow1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  lineHeight: 35,
                  padding: [0, 0, 0, 10]
                },
                rate1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45,
                  padding: [0, 0, 0, 6]
                },
                value1: {
                  height: 45,
                  align: 'left',
                  backgroundColor: '#14224D',
                  color: '#50E3C2',
                  fontSize: 17,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 45
                },
                iconArrow2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35,
                  padding: [0, 5, 0, 0]
                },
                rate2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  lineHeight: 35,
                  padding: [0, 0, 0, 0]
                },
                value2: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'Gotham-Book',
                  lineHeight: 35
                },
                number: {
                  height: 35,
                  align: 'center',
                  // backgroundColor: '#7992F5',
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Gotham-Bold',
                  lineHeight: 35,
                  padding: [0, 0, 0, 5]
                }
              },
              emphasis: {
                show: true,
                position: [0, 35],
              }
            },
            itemStyle: {
              color: 'red',
              opacity: 1
            }
          },
          // 散点图五大区总量配置mis
          {
            name: '气泡五大区域',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            data: optData.fiveAreaData,
            symbol: 'circle',
            // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
            // symbol: 'image://./assets/viewinfor/inv_icon1.png',
            symbolSize: function (val: any, params: any) {
              return val[3];
            },
            symbolKeepAspect: true,
            label: {
              show: false,
              normal: {
                position: 'right',
                formatter: [
                  '{a|{b}}',
                  '{b|{@[2]}}'
                ].join('\n'),
                rich: {
                  a: {
                    color: '#fff',
                    fontSize: 18,
                    lineHeight: 18,
                    padding: [0, 0, 25, 20],
                  },
                  b: {
                    color: '#fff',
                    fontSize: 30,
                    lineHeight: 30,
                    padding: [0, 0, 45, -45],
                    fontFamily: 'Gotham-Light',
                  },
                  x: {
                    fontSize: 18,
                    fontFamily: 'Microsoft YaHei',
                    borderColor: '#449933',
                    borderRadius: 4
                  },
                },
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              color: {
                type: 'radial',
                x: 1,
                y: 1,
                r: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(255,202,229,1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(206,192,255,1)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              },
              borderColor: '#8b7e9a',
              // opacity: 0.6
              // borderWidth: 20,
            },
          },
        ]
      };
      return false;
    }
    this.options_map = {};
    this.options_map = {
      tooltip: {  //  鼠标放上去提示框文字
        show: false,
        trigger: 'item',
        formatter: function (params) {
          let value: any;
          value = (params.value + '').split('.');
          value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
            + '.' + value[1];
          return params.seriesName + '<br/>' + params.name + ' : ' + value;
        },

      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { readOnly: false },
        }
      },
      geo: {
        show: true,
        map: 'world',
        center: [20.97, 25.71],
        aspectScale: 0.9,
        zoom: 1.5,
        label: {
          show: false,
          color: '#fff',
        },
        itemStyle: {
          // label 地图上的字
          areaColor: '#323a52',
          color: 'red',
          borderWidth: 0,
          borderColor: '#131a33'
        },
        emphasis: {
          label: {
            show: true,
            color: '#fff',
          },
          itemStyle: {
            areaColor: '#2f82aa',
            borderWidth: 0
          },
        },
        data: this.worldCityData
      },
      series: [
        // map 配置
        {
          name: 'SSC',
          type: 'map',
          mapType: 'world',
          roam: true,
          geoIndex: 0,
          label: {
            show: true,
            color: '#fff',
          },
          itemStyle: {
            // label 地图上的字
            areaColor: '#323a52',
            color: 'red',
            borderWidth: 0,
            borderColor: '#131a33'
          },
          emphasis: {
            label: {
              show: false,
              color: '#fff',
            },
            itemStyle: {
              areaColor: '#2f82aa',
              borderWidth: 0
            },
          },
          aspectScale: 0.9,
          zoom: 1.5,
          data: this.worldCityData
        },
        // 散点图五大区总量配置
        {
          name: '散点五大区域',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: optData.fiveAreaData,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 40,
          symbolKeepAspect: true,
          label: {
            normal: {
              position: 'right',
              formatter: [
                '{a|{b}}',
                '{b|{@[2]}}'
              ].join('\n'),
              rich: {
                a: {
                  color: '#fff',
                  fontSize: 18,
                  lineHeight: 18,
                  padding: [0, 0, 25, 20],
                },
                b: {
                  color: '#fff',
                  fontSize: 30,
                  lineHeight: 30,
                  padding: [0, 0, 45, -45],
                  fontFamily: 'Gotham-Light',
                },
                x: {
                  fontSize: 18,
                  fontFamily: 'Microsoft YaHei',
                  borderColor: '#449933',
                  borderRadius: 4
                },
              },
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            color: 'red'
          }
        },
        // 散点图LAS区域Inv总量配置
        {
          name: '散点五大区域LAS',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: optData.fiveAreaDataScatter.LAS,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: function () {
              const icon1 = optData.scatterFormat.LAS.iconArrow1 ? '↑' : '↓';
              const icon2 = optData.scatterFormat.LAS.iconArrow2 ? '↑' : '↓';
              return [
                '{title|' + optData.scatterFormat.LAS.title + '}{abg1|}',
                '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.LAS.rate1 + '}{value1|' + optData.scatterFormat.LAS.value1 + '}',
                '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.LAS.rate2 + '}{value2|' + optData.scatterFormat.LAS.value2 + '}{number|' + optData.scatterFormat.LAS.quantity + '}{abg|}'
              ].join('\n');
            },
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          }
        },
        // 散点图NA区域Inv总量配置
        {
          name: '散点五大区域NA',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: optData.fiveAreaDataScatter.NA,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: function () {
              const icon1 = optData.scatterFormat.NA.iconArrow1 ? '↑' : '↓';
              const icon2 = optData.scatterFormat.NA.iconArrow2 ? '↑' : '↓';
              return [
                '{title|' + optData.scatterFormat.NA.title + '}{abg1|}',
                '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.NA.rate1 + '}{value1|' + optData.scatterFormat.NA.value1 + '}',
                '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.NA.rate2 + '}{value2|' + optData.scatterFormat.NA.value2 + '}{number|' + optData.scatterFormat.NA.quantity + '}{abg|}'
              ].join('\n');
            },
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          }
        },
        // 散点图EMEA区域Inv总量配置
        {
          name: '散点五大区域EMEA',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: optData.fiveAreaDataScatter.EMEA,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: function () {
              const icon1 = optData.scatterFormat.EMEA.iconArrow1 ? '↑' : '↓';
              const icon2 = optData.scatterFormat.EMEA.iconArrow2 ? '↑' : '↓';
              return [
                '{title|' + optData.scatterFormat.EMEA.title + '}{abg1|}',
                '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.EMEA.rate1 + '}{value1|' + optData.scatterFormat.EMEA.value1 + '}',
                '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.EMEA.rate2 + '}{value2|' + optData.scatterFormat.EMEA.value2 + '}{number|' + optData.scatterFormat.EMEA.quantity + '}{abg|}'
              ].join('\n');
            },
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          }
        },
        // 散点图AP区域AP总量配置
        {
          name: '散点五大区域AP',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: optData.fiveAreaDataScatter.AP,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: function () {
              const icon1 = optData.scatterFormat.AP.iconArrow1 ? '↑' : '↓';
              const icon2 = optData.scatterFormat.AP.iconArrow2 ? '↑' : '↓';
              return [
                '{title|' + optData.scatterFormat.AP.title + '}{abg1|}',
                '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.AP.rate1 + '}{value1|' + optData.scatterFormat.AP.value1 + '}',
                '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.AP.rate2 + '}{value2|' + optData.scatterFormat.AP.value2 + '}{number|' + optData.scatterFormat.AP.quantity + '}{abg|}'
              ].join('\n');
            },
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          }
        },
        // 散点图WWHUB区域WWHUB总量配置
        {
          name: '散点五大区域WWHUB',
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          data: optData.fiveAreaDataScatter.WWHUB,
          // symbol: 'image://../../../assets/viewinfor/inv_icon1.png',
          symbol: 'image://./assets/viewinfor/inv_icon1.png',
          symbolSize: 38,
          symbolKeepAspect: true,
          label: {
            show: false,
            width: 185,
            height: 123,
            position: [0, 35],
            backgroundColor: '#14224D',
            formatter: function () {
              const icon1 = optData.scatterFormat.WWHUB.iconArrow1 ? '↑' : '↓';
              const icon2 = optData.scatterFormat.WWHUB.iconArrow2 ? '↑' : '↓';
              return [
                '{title|' + optData.scatterFormat.WWHUB.title + '}{abg1|}',
                '{iconArrow1|' + icon1 + '}{rate1|' + optData.scatterFormat.WWHUB.rate1 + '}{value1|' + optData.scatterFormat.WWHUB.value1 + '}',
                '{iconArrow2|' + icon2 + '}{rate2|' + optData.scatterFormat.WWHUB.rate2 + '}{value2|' + optData.scatterFormat.WWHUBNA.value2 + '}{number|' + optData.scatterFormat.WWHUB.quantity + '}{abg|}'
              ].join('\n');
            },
            rich: {
              title: {
                width: 173,
                height: 49,
                backgroundColor: '#14224D',
                borderRadius: [4, 4, 0, 0],
                color: '#F4F6FF',
                fontSize: 30,
                fontFamily: 'Gotham-Medium',
                lineHeight: 43,
                align: 'left',
                padding: [0, 0, 0, 12],
              },
              abg: {
                backgroundColor: '#7992F5',
                width: '100%',
                align: 'right',
                height: 35,
                borderRadius: [0, 0, 4, 4],
              },
              iconArrow1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                lineHeight: 35,
                padding: [0, 0, 0, 10]
              },
              rate1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45,
                padding: [0, 0, 0, 6]
              },
              value1: {
                height: 45,
                align: 'left',
                backgroundColor: '#14224D',
                color: '#50E3C2',
                fontSize: 17,
                fontFamily: 'Gotham-Book',
                lineHeight: 45
              },
              iconArrow2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35,
                padding: [0, 5, 0, 0]
              },
              rate2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                lineHeight: 35,
                padding: [0, 0, 0, 0]
              },
              value2: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Gotham-Book',
                lineHeight: 35
              },
              number: {
                height: 35,
                align: 'center',
                // backgroundColor: '#7992F5',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Gotham-Bold',
                lineHeight: 35,
                padding: [0, 0, 0, 5]
              }
            },
            emphasis: {
              show: true,
              position: [0, 35],
            }
          },
          itemStyle: {
            color: 'red',
            opacity: 1
          },
        },
        // replenlsh movelines 图
        // replenlsh movelines 图
        {
          name: '线路',
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel: 4,
          large: true,
          effect: {
            show: true,
            constantSpeed: 30,
            symbol: 'none', // ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
            symbolSize: 35,
            color: '#c13067',
            trailLength: 0,
          },
          label: {
            show: false,
            position: 'middle',
            formatter: function () {
              return 'AK47';
            }
          },
          emphasis: {
            label: {
              show: true
            }
          },
          lineStyle: {
            normal: {
              color: '#ccc',
              width: 3,
              opacity: 0.6,
              curveness: 0.2
            }
          },
          data: optData.replenlshMoveLines,
          largeThreshold: 8000,
          animationThreshold: 8000,
          animationDuration: 8000,
          animationDelay: 200
        }
        // 飞机后面的动态线
        // optData.RpiData.seriesData.replenishLineShadow
      ]
    };
  }
  /**
   * setOptionsList方法,设置sidebar点击的data
   */
  public setOptionsList(name: any) {
    console.log(name);
    let optData = {};
    switch (name) {
      case 'Inv':
        optData = this.mapData.InvData;
        console.log(optData);
        this.setOptionsMap(optData, name);
        break;
      case 'Cons':
        optData = this.mapData.CspData;
        this.setOptionsMap(optData, name);
        break;
      case 'Pal':
        optData = this.mapData.PalData;
        this.setOptionsMap(optData, name);
        break;
      case 'Woi':
        optData = this.mapData.WoiData;
        this.setOptionsMap(optData, name);
        break;
      case 'Mis':
        optData = this.mapData.MisData;
        this.setOptionsMap(optData, name);
        break;
      case 'Rpi':
        optData = this.mapData.RpiData;
        this.setOptionsMap(optData, name);
        break;
      case 'Tsf':
        optData = this.mapData.TsfData;
        this.setOptionsMap(optData, name);
        break;
      case 'Rvs':
        optData = this.mapData.RvsData;
        this.setOptionsMap(optData, name);
        break;
    }
  }
  // 显示rank组件
  private openRank() {
    this.rankShow = true;
  }
  // 隐藏rank组件
  private closeRank() {
    this.rankShow = false;
  }
  // geo下拉框点击事件
  private geoLiClick(param: string) {
    this.selectData.geoActive = param;
    this.selectData.regionActive = 'REGION';
    switch (param) {
      case 'GLOBAL':
        this.selectData.region.active = this.selectData.region.regionGlobal;
        break;
      case 'WW HUB':
        this.selectData.region.active = this.selectData.region.regionWW;
        break;
      case 'AP':
        this.selectData.region.active = this.selectData.region.regionApList;
        break;
      case 'EMEA':
        this.selectData.region.active = this.selectData.region.regionEmeaList;
        break;
      case 'NA':
        this.selectData.region.active = this.selectData.region.regionNaList;
        break;
      case 'LAS':
        this.selectData.region.active = this.selectData.region.regionLasList;
        break;
    }
  }
  // region下拉框点击事件
  private regionLiClick(param: string) {
    this.selectData.regionActive = param;
    if (param === 'WW HUB') {
      this.selectData.geoActive = 'WW HUB';
    } else if (param === 'EU' || param === 'MEA' || param === 'TR' || param === 'RUCIS') {
      this.selectData.geoActive = 'EMEA';
    } else if (param === 'INDIA' || param === 'HKTW' || param === 'ASEAN' || param === 'JAPAN' || param === 'ANZ' || param === 'AP RH') {
      this.selectData.geoActive = 'AP';
    } else if (param === 'LAS-TBG' || param === 'LAS-LBG') {
      this.selectData.geoActive = 'LAS';
    } else if (param === 'NA RH' || param === 'NA-TBG' || param === 'NA-LBG') {
      this.selectData.geoActive = 'NA';
    }
  }
  // 显示/隐藏detail 多选框group组件
  private CheckBoxToggle(state) {
    this.checkboxShow = !this.checkboxShow;
  }
  private checkBoxClose() {
    this.checkboxShow = false;
    console.log('detail 失去焦点');
  }
  public clearCheckBox() {
    this.cekStatus.ckbStatusLbg = false;
    this.cekStatus.ckbStatusIh = false;
    this.cekStatus.ckbStatusTbg = false;
    this.cekStatus.ckbStatusSp = false;
    this.cekStatus.ckbStatusNpi = false;
    this.cekStatus.ckbStatusReg = false;
    this.cekStatus.ckbStatusEos = false;
    this.cekStatus.ckbStatusEol = false;
    this.cekStatus.ckbStatusLtb = false;
    this.cekStatus.ckbStatusMx = false;
    this.cekStatus.ckbStatusOt = false;
    this.cekStatus.ckbStatusHh = false;
    this.cekStatus.ckbStatusIn = false;
    this.cekStatus.ckbStatusBt = false;
    this.cekStatus.ckbStatusBp = false;
    this.cekStatus.ckbStatusHp = false;
    this.cekStatus.ckbStatusFd = false;
    this.cekStatus.ckbStatusOo = false;
    this.cekStatus.ckbStatusPx = false;
    this.cekStatus.ckbStatusSk = false;
  }
  public submitDetail() {
    this.cekStatus.submitDisable = true;
    // 发送ajax请求
  }
  public submitSelect() {
    this.cekStatus.submitStatus = true;
    // 发送ajax请求
    this.getKpiData();
  }
  // 初始化bar图表 Inv
  private onChartInitInv(ec) {
    this.echartsInstance_inv = ec;
  }
  // 初始化bar图表 Inv的 tooltip
  private setTooltipInv(sIndex: any, dIndex: any) {
    if (this.echartsInstance_inv) {
      this.echartsInstance_inv.dispatchAction({
        type: 'showTip',
        seriesIndex: sIndex,
        dataIndex: dIndex
      });
    }
  }
  // 初始化line图表 Pal
  private onChartInitPal(ec) {
    this.echartsInstance_pal = ec;
  }
  // 初始化bar图表 Pal的 tooltip
  private setTooltipPal(sIndex: any, dIndex: any) {
    if (this.echartsInstance_pal) {
      this.echartsInstance_pal.dispatchAction({
        type: 'showTip',
        seriesIndex: sIndex,
        dataIndex: dIndex
      });
    }
  }
  // 初始化line图表 Woi
  private onChartInitWoi(ec) {
    this.echartsInstance_woi = ec;
  }
  // 初始化图表 Woi的 tooltip
  private setTooltipWoi(sIndex: any, dIndex: any) {
    if (this.echartsInstance_woi) {
      this.echartsInstance_woi.dispatchAction({
        type: 'showTip',
        seriesIndex: sIndex,
        dataIndex: dIndex
      });
    }
  }
  // 初始化line图表 Cpt
  private onChartInitCpt(ec) {
    this.echartsInstance_cpt = ec;
  }
  // 初始化图表 Cpt的 tooltip
  private setTooltipCpt(sIndex: any, dIndex: any) {
    if (this.echartsInstance_cpt) {
      this.echartsInstance_cpt.dispatchAction({
        type: 'showTip',
        seriesIndex: sIndex,
        dataIndex: dIndex
      });
    }
  }
  // 点击 kpi图表 事件
  public onChartClickInv(event: any, rankName: string) {
    const sIndex = event.seriesIndex;
    const dIndex = event.dataIndex;
    const date = event.name;
    const name = 'INV';
    console.log(date, name);
    console.log(event);
    this.setTooltipPal(sIndex, dIndex);
    this.setTooltipWoi(sIndex, dIndex);
    this.setTooltipCpt(sIndex, dIndex);
    // 显示rank 模块
    this.rankShow = true;
    this.rankName = rankName;
    const params = {
      date: date,
      tFlag: name
    };
    // 获取rankData数据
    this.getRankData(params);
  }
  public onChartClickPal(event: any, rankName: string) {
    const sIndex = event.seriesIndex;
    const dIndex = event.dataIndex;
    const date = event.name;
    const name = 'PAL';
    console.log(sIndex, dIndex);
    this.setTooltipInv(sIndex, dIndex);
    this.setTooltipWoi(sIndex, dIndex);
    this.setTooltipCpt(sIndex, dIndex);
    console.log(rankName);
    // 显示rank 模块
    this.rankShow = true;
    this.rankName = rankName;
    const params = {
      date: date,
      tFlag: name
    };
    // 获取rankData数据
    this.getRankData(params);
  }
  public onChartClickWoi(event: any, rankName: string) {
    const sIndex = event.seriesIndex;
    const dIndex = event.dataIndex;
    const date = event.name;
    const name = 'WOI';
    console.log(sIndex, dIndex);
    this.setTooltipPal(sIndex, dIndex);
    this.setTooltipInv(sIndex, dIndex);
    this.setTooltipCpt(sIndex, dIndex);
    // 显示rank 模块
    this.rankShow = true;
    this.rankName = rankName;
    const params = {
      date: date,
      tFlag: name
    };
    // 获取rankData数据
    this.getRankData(params);
  }
  public onChartClickCpt(event: any, rankName: string) {
    const sIndex = event.seriesIndex;
    const dIndex = event.dataIndex;
    const date = event.name;
    const name = 'CONS';
    console.log(sIndex, dIndex);
    this.setTooltipPal(sIndex, dIndex);
    this.setTooltipWoi(sIndex, dIndex);
    this.setTooltipInv(sIndex, dIndex);
    // 显示rank 模块
    this.rankShow = true;
    this.rankName = rankName;
    const params = {
      date: date,
      tFlag: name
    };
    // 获取rankData数据
    this.getRankData(params);
  }

  private setOptionsInv(xAxisData: any, SeriesData: any) {
    this.options_bar_inv = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        triggerOn: 'click',       // 提示框出发类型
        backgroundColor: '#D3DFE0',
        textStyle: {
          color: '#45ADF0',
          fontFamily: 'Gotham-Bold',
          fontSize: 24,
          lineHeight: 24
        },
        alwaysShowContent: true,  // 点击后一直显示提示框
        position: function (point, params, dom, rect, size) {
          console.log(point);
          // 固定在顶部
          return [point[0] + 3, '10%'];
        }
      },
      legend: {
        show: false,
        data: ['Inv']
      },
      grid: {
        top: '60px',
        left: '0',
        right: '5',
        bottom: '25px',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          nameTextStyle: {
            color: 'rgba(255,255,255,0.5)'
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.5)'
          },
          axisPointer: {
            value: '2012-05-09',
            snap: false,
            lineStyle: {
              color: 'rgba(242,253,254,0.48)',
              width: 2
            },
            label: {
              show: false,
              margin: -180,
              // padding:[0,0,0,60],
              // formatter: function (params) {
              //   return this.options_line_pal.format.formatTime('yyyy-MM-dd', params.value);
              // },
              backgroundColor: 'transparent'
            },
            handle: {
              show: true,
              color: '#131a33',
              shadowBlur: 0
            }
          },
          boundaryGap: true,  // 两边留白策略(图形超出坐标范围)
          data: xAxisData
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.5)'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255, 0.1)',
            },
          },
        }
      ],
      series: [
        {
          name: 'Inv',
          type: 'bar',
          // stack: 'counts', // 配置相同的值可以让数据堆叠
          // label:{
          //   show:true
          // },
          // 折现拐点标记样式
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: 'rgba(121,150,249,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(91,252,231,1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            barBorderRadius: [52, 52, 0, 0],
            borderColor: '#979797',
          },
          // line的样式
          lineStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: 'rgba(121,150,249,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(91,252,231,1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
          },
          // hover时的样式
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(211,221,255,1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(205,240,255,1)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              },
              barBorderRadius: [52, 52, 0, 0],
              borderColor: '#979797',
              borderWidth: 2,
            }
          },
          // 开启平滑曲线
          smooth: true,
          data: SeriesData,
          label: {
            show: false,  // line 上面点的提示文字
          },
          largeThreshold: 8000,
          animationThreshold: 8000,
          animationDuration: 8000,
          animationDelay: 200
        }
      ]
    };
  }
  private setOptionsPal(xAxisData: any, SeriesData: any, minPal: any, maxPal: any) {
    this.options_line_pal = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        triggerOn: 'click',       // 提示框出发类型
        backgroundColor: 'rgba(255,255,255,0.6)',
        textStyle: {
          color: '#9A2A54',
          fontFamily: 'Gotham-Bold',
          fontSize: 24,
          lineHeight: 24
        },
        alwaysShowContent: true,  // 点击后一直显示提示框
        position: function (point, params, dom, rect, size) {
          // 固定在顶部
          return [point[0] + 3, '10%'];
        },
        // 显示的文字
        // formatter: function (params) {
        //   return 'aaa';
        // }
      },
      legend: {
        show: false,
        data: ['Pal']
      },
      grid: {
        top: '60px',
        left: '0',
        right: '5px',
        bottom: '25px',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          nameTextStyle: {
            color: 'rgba(255,255,255,0.5)'
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.5)'
          },
          axisPointer: {
            value: '2012-05-11',
            snap: false,
            lineStyle: {
              color: 'rgba(242,253,254,0.48)',
              width: 2
            },
            label: {
              show: false,
              margin: -180,
              // padding:[0,0,0,60],
              // formatter: function (params) {
              //   return this.options_line_pal.format.formatTime('yyyy-MM-dd', params.value);
              // },
              backgroundColor: 'transparent'
            },
            handle: {
              show: true,
              color: '#131a33',
              shadowBlur: 0
            }
          },
          boundaryGap: true,  // 两边留白策略(图形超出坐标范围)
          data: xAxisData
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.5)'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255, 0.1)',
            },
          },
          min: minPal,
          max: maxPal
        }
      ],
      series: [
        {
          name: 'Pal',
          type: 'line',
          // symbol: 'none',
          // stack: 'counts', // 配置相同的值可以让数据堆叠
          // label:{
          //   show:true
          // },
          // 折现拐点标记样式
          itemStyle: {
            color: {
              type: 'radial',
              x: 1,
              y: 1,
              r: 1,
              colorStops: [{
                offset: 0, color: 'rgba(255,202,229,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(206,192,255,1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            borderColor: '#8b7e9a',
            // borderWidth: 20,
          },
          // line的样式
          lineStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: 'rgba(255,171,205,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(255,188,160,1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
          },
          // line的区域样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: 'rgba(255,171,205,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(255,188,160,1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            opacity: 0.17
          },
          // hover时的样式
          emphasis: {
            itemStyle: {
              borderWidth: 10,
            }
          },
          // 开启平滑曲线
          smooth: true,
          data: SeriesData,
          label: {
            show: false,  // line 上面点的提示文字
          }
        }
      ]
    };
  }
  private setOptionsWoi(xAxisData: any, SeriesData: any, minWoi: any, maxWoi: any) {
    this.options_line_woi = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        triggerOn: 'click',       // 提示框出发类型
        backgroundColor: 'rgba(255,255,255,0.6)',
        textStyle: {
          color: '#056283',
          fontFamily: 'Gotham-Bold',
          fontSize: 24,
          lineHeight: 24
        },
        alwaysShowContent: true,  // 点击后一直显示提示框
        position: function (point, params, dom, rect, size) {
          // 固定在顶部
          return [point[0] + 3, '10%'];
        },
        // formatter: function (params) {
        //   return 'aaa';
        // }
      },
      legend: {
        show: false,
        data: ['Pal']
      },
      grid: {
        top: '60px',
        left: '0',
        right: '5px',
        bottom: '25px',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          nameTextStyle: {
            color: 'rgba(255,255,255,0.5)'
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.5)'
          },
          axisPointer: {
            value: '2012-05-10',
            snap: false,
            lineStyle: {
              color: 'rgba(242,253,254,0.48)',
              width: 2
            },
            label: {
              show: false,
              margin: -180,
              // padding:[0,0,0,60],
              // formatter: function (params) {
              //   return this.options_line_pal.format.formatTime('yyyy-MM-dd', params.value);
              // },
              backgroundColor: 'transparent'
            },
            handle: {
              show: true,
              color: '#131a33',
              shadowBlur: 0
            }
          },
          boundaryGap: true,
          data: xAxisData
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.5)'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255, 0.1)',
            },
          },
          min: minWoi,
          max: maxWoi
        }
      ],
      series: [
        {
          name: 'Woi',
          type: 'line',
          // symbol: 'none',
          step: true,
          // stack: 'counts', // 配置相同的值可以让数据堆叠
          // label:{
          //   show:true
          // },
          // 折现拐点标记样式
          itemStyle: {
            color: {
              type: 'radial',
              x: 1,
              y: 1,
              r: 1,
              colorStops: [{
                offset: 0, color: 'rgba(146,225,255,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(158,252,255,1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            borderColor: '#457593',
            // borderWidth: 20,
          },
          // line的样式
          lineStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: 'rgba(159,222,251,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(143,242,245,1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
          },
          // line的区域样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: 'rgba(123,147,223,0.49)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(6,151,202,0.3)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            opacity: 0.17
          },
          // hover时的样式
          emphasis: {
            itemStyle: {
              borderWidth: 10,
            }
          },
          // 开启平滑曲线
          smooth: false,
          data: SeriesData,
          label: {
            show: false,  // line 上面点的提示文字
          }
        }
      ]
    };
  }
  private setOptionsCpt(xAxisData: any, SeriesData: any, minCpt: any, maxCpt: any) {
    this.options_line_cpt = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        triggerOn: 'click',       // 提示框出发类型
        backgroundColor: 'rgba(236,234,235,0.6)',
        textStyle: {
          color: '#05541F',
          fontFamily: 'Gotham-Bold',
          fontSize: 24,
          lineHeight: 24
        },
        alwaysShowContent: true,  // 点击后一直显示提示框
        position: function (point, params, dom, rect, size) {
          // 固定在顶部
          return [point[0] + 3, '10%'];
        },
        // formatter: function (params) {
        //   return 'aaa';
        // }
      },
      legend: {
        show: false,
        data: ['Pal']
      },
      grid: {
        top: '60px',
        left: '0',
        right: '5px',
        bottom: '25px',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          nameTextStyle: {
            color: 'rgba(255,255,255,0.5)'
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.5)'
          },
          axisPointer: {
            value: '2012-05-10',
            snap: false,
            lineStyle: {
              color: 'rgba(242,253,254,0.48)',
              width: 2
            },
            label: {
              show: false,
              margin: -180,
              // padding:[0,0,0,60],
              // formatter: function (params) {
              //   return this.options_line_pal.format.formatTime('yyyy-MM-dd', params.value);
              // },
              backgroundColor: 'transparent'
            },
            handle: {
              show: true,
              color: '#131a33',
              shadowBlur: 0
            }
          },
          boundaryGap: true,
          data: xAxisData,
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLabel: {
            color: 'rgba(255,255,255,0.5)'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255, 0.1)',
            },
          },
          min: minCpt,
          max: maxCpt
        }
      ],
      series: [
        {
          name: 'Cpt',
          type: 'line',
          // stack: 'counts', // 配置相同的值可以让数据堆叠
          // label:{
          //   show:true
          // },
          // 折现拐点标记样式
          itemStyle: {
            color: {
              type: 'radial',
              x: 1,
              y: 1,
              r: 1,
              colorStops: [{
                offset: 0, color: 'rgba(222,250,232,1)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(237,255,201,1)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            borderColor: '#bbdaae',
            // borderWidth: 20,
          },
          // line的样式
          lineStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: 'rgba(35,142,74,0.99)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(176,210,122,0.56)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
          },
          // line的区域样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: 'rgba(35,142,74,0.99)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(176,210,122,0.56)' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            opacity: 0.17
          },
          // hover时的样式
          emphasis: {
            itemStyle: {
              borderWidth: 10,
            }
          },
          // 开启平滑曲线
          smooth: true,
          data: SeriesData,
          label: {
            show: false,  // line 上面点的提示文字
          }
        }
      ]
    };
  }

  // 点击按钮ajax请求数据
  private kpiPublickAjax(time: any, type: any, typesCld: any, ckbStatusDtl: any, pLVal: any, searchTmpnIpt: any, checkboxObj: any) {
    // typesCld == '' ? typesCld='DEFAULT':typesCld=typesCld;
    // pLVal == '' ? pLVal='DEFAULT':pLVal=pLVal;
    // searchTmpnIpt == '' ? searchTmpnIpt='DEFAULT':searchTmpnIpt=searchTmpnIpt;
    // const params = new URLSearchParams();
    const paramsData = {
      time: time,
      geo: type,
      Region: typesCld,
      ckbDetails: ckbStatusDtl,
      CC: pLVal,
      TopmostPN: searchTmpnIpt,
      ckb_IHSP_INHOUSE: false,
      ckb_IHSP_SP: false,
      ckb_BU_TBG: false,
      ckb_BU_LBG: false,
      ckb_LC_NPI: false,
      ckb_LC_REG: false,
      ckb_LC_LTB: false,
      ckbInhouseDetails: false,
    };
    // 发送http请求 然后从新渲染图表
    this.getJsonService.apiGet('http://10.100.208.221:8280/DJGDemo/viewinfo/getinfo', paramsData).subscribe((res: any) => {
      console.log(res);
      this.rankData = res;
      if (res.code === '200') {
        this.cekStatus.submitStatus = false;
        const xAxisData = res.options1.date;
        const invSeriesData = res.options1.dataBar[1].map((v, i) => {
          return Math.floor( v * 100) / 100;  // 保留两位小数
        });
        const palSeriesData = res.options1.dataLine[0].map((v, i) => {
          return Math.floor( v * 100) / 100;
        });
        const cptSeriesData = res.options2.dataLine1[0].map((v, i) => {
          return Math.floor( v * 100) / 100;
        });
        const woiSeriesData = res.options2.dataLine2[0].map((v, i) => {
          return Math.floor( v * 100) / 100;
        });
        console.log(cptSeriesData);
        console.log(woiSeriesData);
        const minPal = Math.floor( Math.min.apply(null, palSeriesData));
        const maxPal = Math.ceil( Math.max.apply(null, palSeriesData));
        const minCpt = Math.floor( Math.min.apply(null, cptSeriesData));
        const maxCpt = Math.ceil( Math.max.apply(null, cptSeriesData));
        const minWoi = Math.floor( Math.min.apply(null, woiSeriesData));
        const maxWoi = Math.ceil( Math.max.apply(null, woiSeriesData));
        this.setOptionsInv(xAxisData, invSeriesData);
        this.setOptionsPal(xAxisData, palSeriesData, minPal, maxPal);
        this.setOptionsWoi(xAxisData, woiSeriesData, minWoi, maxWoi);
        this.setOptionsCpt(xAxisData, cptSeriesData, minCpt, maxCpt);
      }
    });
  }
  // 获取图表数据
  private getKpiData() {
    // ajax获取数据
    this.kpiPublickAjax(
      'WEEK', this.selectData.geoActive, this.selectData.regionActive, 'true', 'COMMODITYCODE', 'DEFAULT', {
        ckbStatusIh: this.cekStatus.ckbStatusIh,
        ckbStatusSp: this.cekStatus.ckbStatusSp,
        ckbStatusTbg: this.cekStatus.ckbStatusTbg,
        ckbStatusLbg: this.cekStatus.ckbStatusLbg,
        ckbStatusNpi: this.cekStatus.ckbStatusNpi,
        ckbStatusReg: this.cekStatus.ckbStatusReg,
        ckbStatusLtb: this.cekStatus.ckbStatusLtb,
        ckbStatusIhd: this.cekStatus.ckbStatusIhd,
      }
    );
  }
  // 获取图表点击时对应的rankData的数据
  private getRankData(params: any) {
    this.rankPublickAjax(
      'WEEK', this.selectData.geoActive, this.selectData.regionActive, 'true', 'COMMODITYCODE', 'DEFAULT', {
        ckbStatusIh: this.cekStatus.ckbStatusIh,
        ckbStatusSp: this.cekStatus.ckbStatusSp,
        ckbStatusTbg: this.cekStatus.ckbStatusTbg,
        ckbStatusLbg: this.cekStatus.ckbStatusLbg,
        ckbStatusNpi: this.cekStatus.ckbStatusNpi,
        ckbStatusReg: this.cekStatus.ckbStatusReg,
        ckbStatusLtb: this.cekStatus.ckbStatusLtb,
        ckbStatusIhd: this.cekStatus.ckbStatusIhd,
      }, params.date, params.tFlag
    );
  }
  private rankPublickAjax(time: any, type: any, typesCld: any, ckbStatusDtl: any, pLVal: any,
    searchTmpnIpt: any, checkboxObj: any, date: any, tFlag: any) {
    // typesCld == '' ? typesCld='DEFAULT':typesCld=typesCld;
    // pLVal == '' ? pLVal='DEFAULT':pLVal=pLVal;
    // searchTmpnIpt == '' ? searchTmpnIpt='DEFAULT':searchTmpnIpt=searchTmpnIpt;
    // const params = new URLSearchParams();
    const paramsData = {
      time: time,
      geo: type,
      Region: typesCld,
      ckbDetails: ckbStatusDtl,
      CC: pLVal,
      TopmostPN: searchTmpnIpt,
      ckb_IHSP_INHOUSE: false,
      ckb_IHSP_SP: false,
      ckb_BU_TBG: false,
      ckb_BU_LBG: false,
      ckb_LC_NPI: false,
      ckb_LC_REG: false,
      ckb_LC_LTB: false,
      ckbInhouseDetails: false,
      date: date,
      tFlag: tFlag
    };
    // 发送http请求 然后从新渲染图表
    this.getJsonService.apiGet('http://10.100.208.221:8280/DJGDemo/viewinfo/getWeekinfo', paramsData).subscribe((res: any) => {
      console.log(res);
      this.rankData = res;
    });
  }
  // 首次加载获取sidebar的标题数据
  private getSidebarTitData(paramsData: any) {
    this.getJsonService.apiGet('http://10.100.208.221:8280/DJGDemo/viewinfo/getTitle', paramsData).subscribe((res: any) => {
      this.sideBarLData = res.sideBarLData;
      this.sideBarRData = res.sideBarRData;
    });
  }

  // 获取点击sidebar时的数据
  private getSidebarData(paramsData: any) {
    this.getJsonService.apiGet('http://10.100.208.221:8280/DJGDemo/viewinfo/getSampleinfo', paramsData).subscribe((res: any) => {
      console.log(res);
      const params = paramsData.tFlag;
      let name = 'default';
      console.log(params);
      switch (params) {
        case 'invdata':
          this.mapData.InvData = res;
          name = 'Inv';
          this.setOptionsList(name);
          break;
        case 'cspdata':
          this.mapData.CspData = res;
          name = 'Cons';
          this.setOptionsList(name);
          break;
        case 'paldata':
          this.mapData.PalData = res;
          name = 'Pal';
          this.setOptionsList(name);
          break;
        case 'woidata':
          this.mapData.WoiData = res;
          name = 'Woi';
          this.setOptionsList(name);
          break;
        case 'misdata':
          this.mapData.MisData = res;
          name = 'Mis';
          this.setOptionsList(name);
          break;
        case 'rpidata':
          this.mapData.RpiData = res;
          name = 'Rpi';
          this.setOptionsList(name);
          break;
        case 'tsfdata':
          this.mapData.TsfData = res;
          name = 'Tsf';
          this.setOptionsList(name);
          break;
        case 'rvsdata':
          this.mapData.RvsData = res;
          name = 'Rvs';
          this.setOptionsList(name);
          break;
      }
    });
  }
}
