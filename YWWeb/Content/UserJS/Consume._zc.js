new Vue({
    el: "#app",
    data: {
        listWidth: 0,
        listHeight: 0,
        analysisTableHeight:0,
        listColumns: [
            {
                type: 'selection',
                width: 30,
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
            }
        ],
        listData: [
            {order: 1,name: '内科室02',proportion: '20%'},
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 5, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 1, name: '内科室02', proportion: '20%' },
            { order: 2, name: '内科室03', proportion: '30%' },
            { order: 15, name: '内科室03', proportion: '30%' },
        ],
        analysisColumns: [
            {
                title: '时间',
                align: 'center',
                key: 'time'
            },
            {
                title: '电量(kW·h)',
                align: 'center',
                key: 'power'
            },
            {
                title: '温度(°C)',
                align: 'center',
                width:60,
                key: 'temperature'
            },
            {
                title: '人流量',
                align: 'center',
                width: 100,
                key: 'visitorsFlowrate'
            },
            {
                title: '建筑面积',
                align: 'center',
                width: 100,
                key: 'area'
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
            { time: '2018-12-22 12:35:00', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
            { time: '2018-12-22 12:35:00', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
            { time: '2018-12-22 12:35:00', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
            { time: '2018-12-22 12:35:00', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
            { time: '2018-12-22 12:35:00', power: 124, temperature: 23, visitorsFlowrate: 140, area: 123, usage: '照明、空调', result: '偏差异常' },
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
                    data: ['今日', '温度'],
                    left: 0,
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
                        name: '今日',
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
                        name: '今日',
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
                    data: ['实时供能', '预测供能'],
                    left: 0,
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
                        name: '实时供能',
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
        









        setWidth: function () {
            var that = this
            var isScroll = $(".ivu-table-overflowY").length
            if (isScroll > 0) {
                var width = $(".left .list").width()
                that.leftWidth = width + 52
            }
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
                that.listWidth = width + 32 
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

function setScroll() {
    if ($(".left .list .ivu-table").scrollTop() != 1) {
        $(".left .list .ivu-table").scrollTop(1)
    } else {
        $(".left .list .ivu-table").scrollTop(0)
    }

    $(".left .list .ivu-table").scroll(function () {
        var width = $(".left .list").width()
        $(this).width(width + 32)
        $(".left .list .ivu-table").css("margin-right", "15px")
    })
}
$(function () {


    
})
