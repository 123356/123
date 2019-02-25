new Vue({
    el: "#app",
    data: {
        loading:true,
        UID: null,
        UName:null,
        listWidth: 0,
        chartHeight: 0,
        tableHeight: 0,
        dateType:0,
        tableCol: [
            
            {
                title: '科室',
                align: 'center',
                key: 'Name',
            },
            {
                title: '能耗费用(万元)',
                align: 'center',
                key: 'DValue',
                sortable: true
            },
            {
                title: '面积(㎡)',
                align: 'center',
                key: 'unit_area',
                sortable: true
            },
            {
                title: '人员(人)',
                align: 'center',
                key: 'unit_people',
                sortable: true
            },
            {
                title: '人均能耗值',
                align: 'center',
                key: 'avgV',
                sortable: true
            },
            
        ],
        tableData: [],
        barChart: null,
        time:new Date()
    },
    methods: {
        //获取数据
        getEneryView: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryView',
                method: 'post',
                body: {
                    uid: that.UID,
                    time: that.formaterDate()
                }
            })
            .then(function (res) {
                that.tableData = res.data
                that.createBarChart(res.data)
                that.loading = false
            })
            .catch(function (e) {
                that.loading = false
                throw new ReferenceError(e.message)
            })
        },
        dateChange: function () {
            this.loading = true
            this.getEneryView()
        },
        formaterDate: function () {
            var date = new Date(this.time)
           date= date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            return date
        },
        createBarChart: function (data) {
            var xData = []
            var yData = []
            for (var i = 0; i < data.length; i++) {
                xData.push(data[i].Name)
                yData.push(data[i].DValue)
            }
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
                    bottom: 10,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xData,

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
                        data: yData
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
        this.UID = $.cookie("enUID")
        this.UName = $.cookie("enUName")
        this.getEneryView()
        var that = this
        this.setHeight()
        setInterval(function () {
            that.tableHeight = $(".main-item .con").height() 
        }, 100)
    },
    mounted: function () {
     
        
    }
})


$(function () {


    
})
