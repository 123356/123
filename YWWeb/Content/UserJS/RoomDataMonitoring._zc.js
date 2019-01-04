new Vue({
    el: "#app",
    data: {
       
        analysisTableHeight:0,
        analysisColumns: [
            {
                title: '时间',
                align: 'center',
                key: 'time'
            },
            {
                title: '用水(m³)',
                align: 'center',
                key: 'water'
            },
            {
                title: '用电(kW·h)',
                align: 'center',
                key: 'power'
            },
            {
                title: '用热(m³)',
                align: 'center',
                key: 'heat'
            },
            {
                title: '温度(°C)',
                align: 'center',
                width: 60,
                key: 'temperature'
            },
            {
                title: '人流量(人)',
                align: 'center',
                width: 100,
                key: 'visitorsFlowrate'
            },
            {
                title: '建筑面积(㎡)',
                align: 'center',
                width: 100,
                key: 'area'
            },
           
        ],
        analysisData: [
            { time: '2018-12-22 12:35:00', water:123,  power: 124, heat:344,  temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
            { time: '2018-12-22 12:35:00', water: 123, power: 124, heat: 344, temperature: 23, visitorsFlowrate: 140, area: 123 },
        ],
        barAndLineChart: null,
        dateType:0,
       
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
                    x:'center',
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
                        name: '万元',
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
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3, 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name: '昨日',
                        type: 'bar',
                        color: "#80c5e2",
                        data: [1.6, 5.0, 9.5, 20.4, 24.7, 60.7, 165.6, 132.2, 58.7, 28.8, 3.0, 3.3, 5.6, 8.9, 6.0, 36.4, 20.7, 50.7, 110.6, 152.2, 28.7, 58.8, 66.0, 55.3]
                    },
                   
                ]
            };
            barAndLineChart.setOption(option)
            
        },

        userBtnClick: function (e) {
            this.activeIndex = e
            console.log(this.userMneus[e].url)
            this.frameSrc = this.userMneus[e].url

        },
        setHeight: function () {
            this.analysisTableHeight = $(".right .bottom").height()-40
        }
    },
    beforeMount: function () {
        var that = this
        setInterval(function () {
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

