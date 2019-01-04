new Vue({
    el: "#app",
    data: {
        analysisTableHeight: 0,
       
        analysisColumns: [
            {
                title: '名称',
                align: 'center',
                key: 'name'
            },
            {
                title: '水(m³)',
                align: 'center',
                key: 'water'
            },
            {
                title: '电(kW·h)',
                align: 'center',
                key: 'power'
            },
            {
                title: '冷热(m³)',
                align: 'center',
                key: 'heat'
            },
            {
                title: '详情',
                align: 'center',
                key: 'departID',
                render: (h, params) => {
                    var that = this
                    return h('div', [
                        h('a', {
                            attrs: {
                                href:'/EnergyEfficiency/RoomDataMonitoring'
                            },
                            style: {
                                textDecoration: 'none',
                                color: '#60b8a2',
                                fontSize:'12px'
                            },
                            on: {
                                click: () => {
                                    
                                }
                            }
                        }, '查看'),
                    ]);
                }
            },
            
           
        ],
        analysisData: [
            { departID: 0, name: '内科诊室1', water: '25(50%)', power: '40(50%)', heat:'40(30%)' },
            { departID: 1, name: '内科诊室2', water: '25(50%)', power: '40(50%)', heat: '40(30%)' },
            { departID: 2, name: '内科诊室3', water: '25(50%)', power: '40(50%)', heat: '40(30%)' },
            { departID: 3, name: '内科诊室4', water: '25(50%)', power: '40(50%)', heat: '40(30%)' },
        ],
        barChart: null,
        dateType: 0,
        piechart:null
        
    },
    methods: {
        selectChange: function (res) {
            console.log(res[0].id)
        },
      
        createbarChart: function () {
            barChart = echarts.init(document.getElementById('barChart'));
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
                    x: 'center',
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
                        color: "#53bda9",
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3, 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                        
                    },
                    {
                        name: '昨日',
                        type: 'bar',
                        color: "#80c5e2",
                        data: [1.6, 5.0, 9.5, 20.4, 24.7, 60.7, 165.6, 132.2, 58.7, 28.8, 3.0, 3.3, 5.6, 8.9, 6.0, 36.4, 20.7, 50.7, 110.6, 152.2, 28.7, 58.8, 66.0, 55.3],
                       
                    },
                   
                ]
            };
            barChart.setOption(option)
            
        },
        createPieChart: function () {
            piechart = echarts.init(document.getElementById('piechart'));
            var option = {
                title: {
                    text: '分项用水、电、冷热量',
                    subtext:'预算：10万',
                    x: 'center',
                    textStyle: {
                        fontSize: 10,
                        fontWeight:'normal'
                    },
                    subtextStyle: {
                        fontSize: 10,
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                color: ['#60b7a4', '#e0c389', '#86d2df'],

                series: [
                    {
                        name: '能耗(万元)',
                        type: 'pie',
                        radius: '68%',
                        center: ['50%', '60%'],
                        data: [
                            { value: 335, name: '电' },
                            { value: 310, name: '水' },
                            { value: 234, name: '冷热' },
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
            piechart.setOption(option)


        },


        setHeight: function () {
            this.analysisTableHeight = $(".top .right-top-left .con").height()
        }
    },
    beforeMount: function () {
        var that = this
        setInterval(function () {
            //setWidth2()
            that.setHeight()
        }, 100)
        
       
       
    },
    mounted: function () {
        this.createPieChart()
        this.createbarChart()
        /*this.createBarAndLine()*/
        window.addEventListener("resize", () => {
            piechart.resize();
            barChart.resize()
        });
    }
})

