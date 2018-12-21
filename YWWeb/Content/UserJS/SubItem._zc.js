new Vue({
    el: "#app",
    data: {
        listWidth: 0,
        listHeight: 0,
        analysisTableHeight:0,
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
                width: 60,
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
        treeData: [
            {
                title: '医院总部楼',
                expand: true,
                children: [
                    {
                        title: '门诊部',
                        expand: true,
                        children: [
                            {
                                title: '内科',
                                expand: true,
                                children: [
                                    {
                                        title:'内科诊室一'
                                    },
                                    {
                                        title: '内科诊室二'
                                    }
                                ]
                            }
                            
                        ]
                    },
                    {
                        title: '急诊部',
                    },
                    {
                        title: '收费室',
                    },
                    {
                        title: '放射科',
                    },
                    {
                        title: '后勤科',
                    },
                    {
                        title: 'B超室',
                    },
                    {
                        title: '住院部',
                    }
                ]
            }
        ]
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
                    data: ['今日', '昨日'],
                    left: 0,
                    textStyle: {
                        fontSize: 10,
                        color: '#666'
                    }
                },
                color: ['#53bda9'],
                grid: {
                    bottom: '10%',
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
                        name: '昨日',
                        min: 0,
                        max: 25,
                        interval: 5,
                        show:false,
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
                        name: '作日',
                        type: 'bar',
                        barMaxWidth: '10',
                        color: "#80c5e2",
                        data: [1.6, 5.0, 9.5, 20.4, 24.7, 60.7, 165.6, 132.2, 58.7, 28.8, 3.0, 3.3, 5.6, 8.9, 6.0, 36.4, 20.7, 50.7, 110.6, 152.2, 28.7, 58.8, 66.0, 55.3]
                    },
                    {
                        name: '近日',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        symbol: 'none',//节点样式
                        lineStyle: {
                            color: '#53bda9',
                            width: 1,

                        },
                        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2, 2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    },
                    {
                        name: '昨日',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        symbol: 'none',//节点样式
                        lineStyle: {
                            color: '#80c5e2',
                            width: 1,

                        },
                        data: [1.0, 3.2, 3.1, 2.5, 3.3, 4.2, 10.3, 18.4, 13.0, 11.5, 22.0, 16.2, 12.0, 22.2, 23.3, 14.5, 16.3, 20.2, 10.3, 13.4, 16.0, 20.5, 22.0, 16.2]
                    }
                ]
            };
            barAndLineChart.setOption(option)
            
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
           // this.listHeight = $(".left .list").height() - 21
            this.analysisTableHeight = $(".right .bottom").height()-40
        }
    },
    beforeMount: function () {
        var that = this
       /*function setWidth2() {
            var isScroll = $(".ivu-table-overflowY").length
            if (isScroll > 0) {
                var width = $(".left .list").width()
                that.listWidth = width + 32 
            }
        }
      
        setWidth2()
        */
        setInterval(function () {
            //setWidth2()
            that.setHeight()
        }, 100)
        
       
       
    },
    mounted: function () {
        this.createBarAndLine()
        window.addEventListener("resize", () => {
            barAndLineChart.resize();
        });
    }
})

function setScroll() {
    var scroll = $(".left .treeList").scrollTop()
    if (scroll == 1) {
        $(".left .treeList").scrollTop(0)
    } else {
        $(".left .treeList").scrollTop(1)
    }
    $(".left .treeList").scroll(function () {
        var width = $(".left .treeList").width()
        $(this).width(width + 32)
        $(".left .treeList").css("padding-right", "15px")
    })
}
$(function () {
   
    setScroll()
    window.onresize = function () {
        setScroll()
    };

    
})
