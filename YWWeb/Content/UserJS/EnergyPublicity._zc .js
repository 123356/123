new Vue({
    el: "#app",
    data: {
        listWidth: 0,
        chartHeight: 0,
        tableHeight: 0,
        dateType:0,
        tableCol: [
            
            {
                title: '科室',
                align: 'center',
                key: 'department',
            },
            {
                title: '能耗费用',
                align: 'center',
                key: 'money',
                sortable: true
            },
            {
                title: '面积',
                align: 'center',
                key: 'area',
                sortable: true
            },
            {
                title: '人员',
                align: 'center',
                key: 'people',
                sortable: true
            },
            {
                title: '人均能耗值',
                align: 'center',
                key: 'average',
                sortable: true
            },
            
        ],
        tableData: [
            { department: '内科1', money: 100,area: 123.4,people:12,average:1.2},
            { department: '内科2', money: 345, area: 34.4, people: 62, average: 1.62 },
            { department: '内科3', money: 222, area: 45.4, people: 162, average: 1.02 },
        ],
        barChart: null,
    },
    methods: {

        createBarChart: function () {
            barChart = echarts.init(document.getElementById("barChart"));
            var option = {
                title: {
                    text: '12月电费能让消耗图(万元)',
                    show:false,
                    left: 'center',
                    textStyle: {
                        color: '#757575',
                        fontWeight: 'normal',
                        fontSize: 10,
                    },
                    top: 0
                },
                color: ['#57b9a3'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    position: ['50%', '50%']
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
                    itemGap: 1,
                    right: 20,
                },
                grid: {
                    top: 60,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['口腔科','中医内科','外科','行政楼','肾脏科','眼科','妇科','急诊','皮肤科','骨科','外科','五官科','心理','手术室','门诊','儿科','肠胃科'],

                        axisLine: {
                            lineStyle: {
                                color: '#57b9a3',//x轴线颜色
                                width: '0.7'
                            },
                        },
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        },

                        axisLabel: { //调整y轴的lable  
                            textStyle: {
                                fontSize: 9,// 让字体变大
                                color: '#9f9d9d'
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '万元',
                        axisLine: {
                            lineStyle: {
                                color: '#57b9a3',//x轴线颜色
                                width: '0.7'
                            },
                        },
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        },

                        axisLabel: { //调整y轴的lable  
                            textStyle: {
                                fontSize: 10,// 让字体变大
                                color: '#9f9d9d'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#ededed'
                            }
                        },
                    }
                ],
                series: [
                    {
                        name: '能耗费用(万)',
                        type: 'bar',
                        barWidth: '50%',
                        data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390, 330, 220, 10, 52, 200]
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ]
            };
            barChart.setOption(option)
            var that = this
            window.addEventListener("resize", () => {
                barChart.resize();
               
            });
        },
       
        









        setHeight: function () {
            this.tableHeight = $(".main-item").height() - 35
            console.log("height")
        }
    },
    beforeMount: function () {
        var that = this
        this.setHeight()
        setInterval(function () {
            that.tableHeight = $(".main-item .con").height() 
        }, 100)
    },
    mounted: function () {
        var that = this
       this.createBarChart()
        
    }
})


$(function () {


    
})
