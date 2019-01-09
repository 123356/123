new Vue({
    el: "#app",
    data: {
        barChart: null,
        gaugeChart: null,
        pieChart: null,
    },
    methods: {
        createPie: function () {
            pieChart = echarts.init(document.getElementById('pieChart'));
            var option = {
                title: {
                    text: '能源分项消耗',
                    x: 'center',
                    top: '15%',
                    textStyle: {
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x: 'center',
                    y: '20%',
                    data: ['rose1', 'rose2', 'rose3']
                },
                
                calculable: true,
                series: [

                    {
                        name: '分项消耗',
                        type: 'pie',
                        radius: [25, 150],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        labelLine: {
                            length: 10,
                            length2: 5
                        },
                        data: [
                            { value: 10, name: 'rose1' },
                            { value: 5, name: 'rose2' },
                            { value: 15, name: 'rose3' },
                            { value: 25, name: 'rose4' },
                            
                        ]
                    }
                ]
            };

            pieChart.setOption(option)
            
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
        









     
    },
    beforeMount: function () {
       
       
       
    },
    mounted: function () {
        this.createPie()
        window.addEventListener("resize", () => {
            pieChart.resize();
        });
    }
})

$(function () {


    
})
