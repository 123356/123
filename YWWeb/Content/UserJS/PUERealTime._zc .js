new Vue({
    el: "#app",
    data: {
        pieChart: null,
        gaugeChart: null,
        lineChart: null,
        barChart: null,
        lineShow: true,
        gaugeSHow: true,
        barShow: true,
        pieShow:true

    },
    methods: {
        //获取数据
        getRealTimePUEData: function () {
            var that = this
            this.$http({
                url: '/Home/GetRealTimePUEData',
                method: 'POST',
                
            })
             .then(function (res) {
                 
                 if (res.data) {
                     if (res.data.list_top && res.data.list_top.length > 0) {
                         that.lineShow = true
                         that.createLine(res.data.list_top)
                     } else {
                         that.lineShow = false
                     }
                     if (res.data.RealValue) {
                         that.gaugeSHow = true
                         this.createGauge(res.data.RealValue)
                         
                     } else {
                         that.gaugeSHow = false
                     }
                     if (res.data.list_le && res.data.list_le.length > 0) {
                         that.barShow = true
                         that.pieShow = true
                         this.createBar(res.data.list_le)
                         this.createPie(res.data.list_le)
                     } else {
                         that.barShow = false
                         that.pieShow = false
                     }
                    
                     
                     
                     
                 }
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //实时趋势
        createLine: function (data) {
            var x = new Array()
            var y = new Array()
            for (var i = 0; i < data.length; i++) {
                x.push(data[i].name)
                y.push(data[i].value)
            }
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
                    data: x
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
                            lte: 1.8,
                            color: '#54ab88'
                        }, {
                            gt: 1.8,
                            lte: 2.6,
                                color: '#ca9a5c'
                        }, {
                            gt: 2.6,
                            lte: 5,
                            color: '#cd574b'
                        }],
                        outOfRange: {
                            color: '#cd574b'
                        }
                    },
                    series: {
                        name: 'PUE统计',
                        type: 'line',
                        data: y,
                        areaStyle: {},
                        smooth: true,
                        symbol: 'none',
                        markLine: {
                            silent: true,
                            data: [{
                                yAxis: 1.8,
                                lineStyle: {
                                    color: '#54ab88'
                                }
                            }, {
                                yAxis: 2.6,
                                lineStyle: {
                                    color: '#ca9a5c'
                                }
                            }, {
                                yAxis: 5,
                                lineStyle: {
                                    color: '#ce584c'
                                }
                            }]
                        }
                    }
                };


            lineChart.clear()
            lineChart.setOption(option)
            window.addEventListener("resize", () => {
                lineChart.resize();
            });
            
        },
        //仪表盘
        createGauge: function (data) {
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
                            max: 5,
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
                                    color: [[0.2, '#32b194'], [0.4, '#cc9c50'], [1, '#d15642']],
                                    width: 18
                                }
                            },
                            splitLine: {
                                length: 18
                            },
                            data: [
                                {
                                    value: data,
                                    name: 'PUE',
                                    fontSize: 30,
                                },

                            ]
                        }
                    ]
                };

            gaugeChart.clear()
            gaugeChart.setOption(option)
            window.addEventListener("resize", () => {
                gaugeChart.resize();
            });

        },
        //柱状图排名
        createBar: function (data) {
            var x = new Array()
            var y = new Array()
            for (var i = 0; i < data.length; i++) {
                x.push(data[i].name)
                y.push(data[i].value)
            }
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
                    data: x
                },
                series: [

                    {
                        name: '2012年',
                        type: 'bar',
                        data: y
                    }
                ]
            };


            barChart.clear()
            barChart.setOption(option)
            window.addEventListener("resize", () => {
                barChart.resize();
            });

        },
        //饼图
         createPie: function (data) {
             pieChart = echarts.init(document.getElementById('pieChart'));
             var option = {
                 tooltip: {
                     trigger: 'item',
                     formatter: "{a} <br/>{b} : {c} ({d}%)"
                 },
                 color: ['#576570', '#94c5af', '#769e86', '#c78338', '#bca39c'],
                 series: [
                     {
                         name: '能耗',
                         type: 'pie',
                         radius: '70%',
                         center: ['50%', '50%'],
                         data:data,
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
             window.addEventListener("resize", () => {
                 pieChart.resize()
             });

        },

     
    },
    beforeMount: function () {
        this.getRealTimePUEData()
       
       
    },
    mounted: function () {
        
       
    }
})

$(function () {


    
})
