new Vue({
    el: "#app",
    data: {
        listWidth: 0,
        listHeight: 0,
        analysisTableHeight: 0,
        dateType:0,
        listColumns: [
            {
                type: 'selection',
                width: 20,
                align: 'center'
            },
            {
                title: '排名',
                align: 'center',
                key: 'order',
                render: (h, params) => {
                    if (params.row.order <= 3) {
                        return h('img', {
                            attrs: {
                                src: '/Content/images/energyDifficiency/order' + params.row.order + '.png',
                                style: 'width: 18px;height:24px;',
                                class:'iconImg'
                            },
                            on: {
                                click: () => {
                                }
                            }
                        })
                    } else {
                        return h('div', {
                            attrs: {
                                class:'orderNum',
                                style: 'width: 18px;height:18px;border-radius:50%;color:#fff;background:#9d9d9d;text-align:center;line-height:18px;margin:0 auto;font-size:1rem',

                            },
                            on: {
                                click: () => {
                                }
                            }
                        }, params.row.order)
                    }
                    
                }
            
            },
            {
                title: '名称',
                align: 'center',
                key: 'name',
                render: (h, params) => {
                    return h('span',
                        {
                            attrs: {
                                style: 'color:#6d6d6f',
                            },
                        }, params.row.name)
                }
            },
            {
                title: '总比例',
                align: 'center',
                key: 'proportion'
            },
            {
                title: '类型',
                align: 'center',
                key: 'type'
            },
            {
                title: '时间',
                align: 'center',
                key: 'dateTime'
            }
        ],
        listData: [
            { order: 1, name: '内科室02', proportion: '20%', type: '电', dateTime:'2018-12-02'},
            { order: 2, name: '内科室03', proportion: '30%', type: '电', dateTime: '2018-12-02'},
            { order: 1, name: '内科室02', proportion: '20%', type: '电', dateTime: '2018-12-02' },
            { order: 2, name: '内科室03', proportion: '30%', type: '电', dateTime: '2018-12-02' },
            { order: 1, name: '内科室02', proportion: '20%', type: '电', dateTime: '2018-12-02'},
            { order: 2, name: '内科室03', proportion: '30%', type: '电', dateTime: '2018-12-02'},
            { order: 1, name: '内科室02', proportion: '20%', type: '电', dateTime: '2018-12-02' },
            { order: 2, name: '内科室03', proportion: '30%', type: '电', dateTime: '2018-12-02' },
            { order: 1, name: '内科室02', proportion: '20%', type: '电', dateTime: '2018-12-02' },
            { order: 2, name: '内科室03', proportion: '30%', type: '电', dateTime: '2018-12-02' },
            { order: 1, name: '内科室02', proportion: '20%', type: '电', dateTime: '2018-12-02' },
            { order: 2, name: '内科室03', proportion: '30%', type: '电', dateTime: '2018-12-02' },
            { order: 1, name: '内科室02', proportion: '20%', type: '电', dateTime: '2018-12-02' },
            { order: 2, name: '内科室03', proportion: '30%', type: '电', dateTime: '2018-12-02' },
            { order: 1, name: '内科室02', proportion: '20%', type: '电', dateTime: '2018-12-02' },
        ],
        analysisColumns: [
            {
                title: '时间',
                align: 'center',
                key: 'time',
                sortable: true
            },
            {
                title: '科室',
                align: 'center',
                key: 'department'
            },
            {
                title: '电量(kW·h)',
                align: 'center',
                key: 'power',
                sortable: true
            },
            {
                title: '温度(°C)',
                align: 'center',
                width:80,
                key: 'temperature',
                sortable: true
            },
            {
                title: '人流量',
                align: 'center',
                width: 100,
                key: 'visitorsFlowrate',
                sortable: true
            },
            {
                title: '建筑面积(㎡)',
                align: 'center',
                width: 100,
                key: 'area',
                sortable: true
            },
            {
                title: '用途',
                align: 'center',
                key: 'usage'
            },
            {
                title: '结论',
                align: 'center',
                key: 'result'
            },
        ],
        analysisData: [
            { time: '2018-12-22 12:35:00', department:'内科', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
            { time: '2018-12-24 12:35:00', department: '外科', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
            { time: '2018-12-21 12:35:00', department: '内科2',power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
            { time: '2018-12-23 12:35:00', department: '内科', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
            { time: '2018-12-22 12:35:00', department: '内科', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
        ],
        barAndLineChart: null,
        lineChart:null
    },
    methods: {

        //用电趋势图
        createBarAndLine: function () {
            barAndLineChart = echarts.init(document.getElementById('barAndLine'));
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true },
                    },
                    itemSize: 10,
                    itemGap:1
                    
                },
                legend: {
                    data: ['能耗', '温度'],
                    x: 'center',
                    textStyle: {
                        fontSize: 10,
                        color: '#666'
                    }
                },
                color: ['#53bda9'],
                grid: {
                    bottom: 30,
                    left: 30,
                    right: 20
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#cdcdcd',//x轴线颜色
                                width: '0.7'
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: { //调整y轴的lable  
                            textStyle: {
                                fontSize: 10,// 让字体变大
                                color: '#9f9d9d'
                            }
                        },

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'kW·h',
                        min: 0,
                        max: 250,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#cdcdcd',//x轴线颜色
                                width: '0.7'
                            },
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#ededed'
                            }
                        },
                        axisLabel: { //调整y轴的lable  
                            textStyle: {
                                fontSize: 10,// 让字体变大
                                color: '#9f9d9d'
                            }
                        },
                    },
                    {
                        type: 'value',
                        name: '温度',
                        min: 0,
                        max: 25,
                        interval: 5,
                        axisLabel: {
                            formatter: '{value} °C'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#cdcdcd',//x轴线颜色
                                width: '0.7'
                            },
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: { //调整y轴的lable  
                            textStyle: {
                                fontSize: 10,// 让字体变大
                                color: '#9f9d9d'
                            }
                        },

                    }
                ],
                series: [

                    {
                        name: '能耗',
                        type: 'bar',
                        barMaxWidth: '10',
                        color: "#53bda9",
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3, 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name: '温度',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        symbol: 'none',//节点样式
                        lineStyle: {
                            color: '#53bda9',
                            width: 1,

                        },
                        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2, 2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    }
                ]
            };
            barAndLineChart.setOption(option)
            
        },
        createEnergyConLine: function () {
            lineChart = echarts.init(document.getElementById('energyConLine'));
            var option = option = {

                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['实际供能', '预测供能'],
                    x: 'center',
                    textStyle: {
                        fontSize: 10,
                        color: '#666'
                    }
                },
                color: ['#53bda9', '#fa8033'],
                grid: {

                    left: 35,
                    right: 5,
                    bottom: 70,
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { readOnly: false },
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    },
                    itemSize: 10,
                    itemGap:1
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#cdcdcd',//x轴线颜色
                            width: '0.7'
                        },
                    },
                    axisTick: {
                        show: false
                    },

                    axisLabel: { //调整y轴的lable  
                        textStyle: {
                            fontSize: 10,// 让字体变大
                            color: '#9f9d9d'
                        }
                    },
                    data: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
                },
                yAxis: {
                    name:'kW·h',
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#cdcdcd',//x轴线颜色
                            width: '0.7'
                        },
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#ededed'
                        }
                    },
                    axisLabel: { //调整y轴的lable  
                        textStyle: {
                            fontSize: 8,// 让字体变大
                            color: '#9f9d9d'
                        }
                    },
                },
                series: [

                    {
                        name: '实际供能',
                        type: 'line',
                        smooth: true,
                        symbol: 'none',//节点样式
                        lineStyle: {
                            color: '#53bda9',
                            width: 1,

                        },
                        data: [320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390, 330, 320, 320, 332, 301, 334, 390, 330, 320, 330, 320, 334]
                    },
                    {
                        name: '预测供能',
                        type: 'line',
                        symbol: 'none',//节点样式
                        smooth: true,

                        lineStyle: {
                            color: '#fa8033',
                            width: 1,

                        },

                        data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 1290, 1330, 1320]
                    }
                ]
            };
            lineChart.setOption(option)

        },
        









     
        setHeight: function () {
            this.listHeight = $(".left .list").height() - 21
            this.analysisTableHeight = $(".right .bottom").height()-40
        }
    },
    beforeMount: function () {
        var that = this
       function setWidth2() {
            var isScroll = $(".ivu-table-overflowY").length
            if (isScroll > 0) {
                var width = $(".left .list").width()
                that.listWidth = width + 16
            }
        }
      
        setWidth2()
        
        setInterval(function () {
            setWidth2()
            that.setHeight()
        }, 100)
        
       
       
    },
    mounted: function () {
        this.createBarAndLine()
        this.createEnergyConLine()
        window.addEventListener("resize", () => {
            barAndLineChart.resize();
            lineChart.resize()
        });
    }
})

$(function () {


    
})
