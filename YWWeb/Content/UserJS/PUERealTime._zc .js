new Vue({
    el: "#app",
    data: {
        pieChart: null,
        gaugeChart: null,
        lineChart: null,
        barChart:null
    },
    methods: {
        //实时趋势
        createLine: function () {
            lineChart = echarts.init(document.getElementById('lineChart'));
            var  option = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: 35,
                    right: 35,
                    bottom: 25,
                },
                xAxis: {
                        boundaryGap: false,
                        data: ['01-06 12:00', '01-06 13:00', '01-06 14:00', '01-06 15:00', '01-06 16:00', '01-06 17:00', '01-06 18:00', '01-06 19:00', '01-06 20:00', '01-06 21:00', '01-06 22:00', '01-06 23:00', '01-06 24:00', '01-07 01:00', '01-07 02:00', '01-07 03:00', '01-07 04:00', '01-07 05:00',]
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        }
                    },
                    
                toolbox: {
                    right:35,
                    show: true,
                    itemSize: 12,
                    itemGap: 5,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { readOnly: false },
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                    dataZoom: [{
                        type: 'inside',
                        realtime: true,
                    }],
                    visualMap: {
                        top: 10,
                        left: 'center',
                        orient:'horizontal',
                        pieces: [{
                            gt: 0,
                            lte: 2,
                            color: '#54ab88'
                        }, {
                            gt: 2,
                            lte: 5,
                                color: '#ca9a5c'
                        }, {
                            gt: 5,
                            lte: 6,
                            color: '#cd574b'
                        }],
                        outOfRange: {
                            color: '#999'
                        }
                    },
                    series: {
                        name: 'Beijing AQI',
                        type: 'line',
                        data: [1, 2, 3, 4, 5, 3, 6, 5, 4, 5, 3, 6, 5, 4, 2, 3, 4, 1],
                        areaStyle: {},
                        smooth: true,
                        symbol: 'none',
                        markLine: {
                            silent: true,
                            data: [{
                                yAxis: 2,
                                lineStyle: {
                                    color: '#54ab88'
                                }
                            }, {
                                yAxis: 5,
                                lineStyle: {
                                    color: '#ca9a5c'
                                }
                            }, {
                                yAxis: 6,
                                lineStyle: {
                                    color: '#ce584c'
                                }
                            }]
                        }
                    }
                };


            lineChart.clear()
            lineChart.setOption(option)
            
        },
        //仪表盘
        createGauge: function () {
            gaugeChart = echarts.init(document.getElementById('gaugeChart'));
            var option ={
                    backgroundColor: '#fff',
                    tooltip: {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
               
                    color: ['#32b194'],
                    series: [
                        {
                            radius: '95%',
                            type: 'gauge',
                            min: 1,
                            max: 6,
                            splitNumber: 5,
                            detail: {
                                formatter: '{value}',
                                textStyle: {
                                    fontSize: 30,
                                    color: '#32b194'
                                }
                            },
                           
                            title: {
                                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                color: '#32b195'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: [[0.2, '#32b194'], [0.8, '#cc9c50'], [1, '#d15642']],
                                    width: 18
                                }
                            },
                            splitLine: {
                                length: 18
                            },
                            data: [
                                {
                                    value: 3,
                                    name: 'PUE',
                                    fontSize: 30,
                                },

                            ]
                        }
                    ]
                };

            gaugeChart.clear()
            gaugeChart.setOption(option)

        },
        //柱状图排名
        createBar: function () {
            barChart = echarts.init(document.getElementById('barChart'));
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                grid: {
                    left: '1%',
                    right: '5%',
                    bottom: '3%',
                    top:'5%',
                    containLabel: true
                },
                color: ['#56646f'],
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLabel: {
                        
                        color: '#666',
                        fontSize: 12
                    },
                },
                yAxis: {
                    type: 'category',
                    axisLabel: {
                        rotate: 30,
                        color: '#666',
                        fontSize:12
                    },
                    data: ['空调1', '空调2', '空调3', '空调4', '空调5', '空调6', '空调7', '空调8', '空调9', '空调10']
                },
                series: [

                    {
                        name: '2012年',
                        type: 'bar',
                        data: [ 23438, 31000, 121594, 134141, 19325, 281807, 381807, 481807, 581807, 681807]
                    }
                ]
            };


            barChart.clear()
            barChart.setOption(option)

        },
        //饼图
         createPie: function () {
             pieChart = echarts.init(document.getElementById('pieChart'));
             var option = {
                 tooltip: {
                     trigger: 'item',
                     formatter: "{a} <br/>{b} : {c} ({d}%)"
                 },
                 color: ['#576570', '#94c5af', '#769e86', '#c78338', '#bca39c'],
                 series: [
                     {
                         name: '访问来源',
                         type: 'pie',
                         radius: '70%',
                         center: ['50%', '50%'],
                         data: [
                             { value: 12, name: '精密空调' },
                             { value: 34, name: '新风系统' },
                             { value: 11, name: '通讯负载' },
                             { value: 23, name: '其它' },
                             { value: 32, name: 'IT负载' },
                         ],
                         itemStyle: {
                             emphasis: {
                                 shadowBlur: 10,
                                 shadowOffsetX: 0,
                                 shadowColor: 'rgba(0, 0, 0, 0.5)'
                             }
                         }
                     }
                 ]
             };


             pieChart.clear()
             pieChart.setOption(option)

        },

     
    },
    beforeMount: function () {
       
       
       
    },
    mounted: function () {
        this.createLine()
        this.createGauge()
        this.createBar()
        this.createPie()
       window.addEventListener("resize", () => {
           lineChart.resize();
           gaugeChart.resize();
           barChart.resize();
           pieChart.resize()
        });
    }
})

$(function () {


    
})
