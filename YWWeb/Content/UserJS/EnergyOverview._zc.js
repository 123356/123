new Vue({
    el: "#app",
    data: {
        uid:null,
        curDate: '2018-12',
        powerChart: null,
        energyMoneyChart: null,
        electricPieChart: null,
        electricBarChart: null,
        waterPieChart: null,
        waterBarChart: null,
        gasPieChart: null,
        gasBarChart: null,
        heatPieChart: null,
        heatBarChart: null,
        addModal1Visable: false,
        addForm: {
            Type: null,
            DepartmentID: null,
        },
        rules: {
            Type: [
                { required: true, message: '请选择能源类型', trigger: 'change' }
            ],
            DepartmentID: [
                { required: true, message: '请选择科室', trigger: 'change' }
            ],
        },
        typeList: [],
        departMentList: [],
        comList:[]
    },
    methods: {
        //类型下拉框
        getCollectDevTypeList: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetCollectDevTypeList',
                method: 'get',
            }).then(function (res) {
               // console.log(res.data)
                that.typeList = res.data
            }).catch(function (e) {
                console.log(e)
            })
        },
        //科室下拉框
        getDepartMentList: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetComobxList',
                method: 'get',
            }).then(function (res) {
                console.log(res.data)
                that.departMentList = res.data
            }).catch(function (e) {
                console.log(e)
            })
        },
        //单位下拉框
        getUnitComobxList: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetUnitComobxList',
                method: 'get',
            }).then(function (res) {
                console.log(res.data)
                that.comList = res.data
            }).catch(function (e) {
                console.log(e)
            })
        },

        //删除能源
        deleteConfig: function (id) {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/DeleteConfig',
                method: 'post',
                params: {
                    id: ID
                }
            })
            .then(function (res) {
                if (res.data > 0) {
                    that.$Message.success('删除成功');
                } else {
                    that.$Message.warning('删除失败');
                }
            })
            .catch(function (e) {
                console.log(e)
                that.$Message.error('请求失败');
            })
        },
        //添加能源
        addConfig: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/AddConfig',
                method: 'post',
                params: {
                    Type: this.addForm.Type,
                    DepartmentID: this.addForm.DepartmentID,
                    UID: this.uid
                }
            })
            .then(function (res) {
                if (res.data > 0) {
                    that.$Message.success('添加成功');
                } else {
                    that.$Message.warning('添加失败');
                }
            })
            .catch(function (e) {
                console.log(e)
                that.$Message.error('请求失败');
            })
        },
        //数据加载
        getEneryOverView: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryOverView',
                method: 'post',
                params: {
                    UID: this.uid
                }
            })
            .then(function (res) {
                
            })
            .catch(function (e) {
                console.log(e)
                that.$Message.error('请求失败');
            })
        },
        closeModule: function () {
            this.$Modal.confirm({
                title: '信息提示',
                content: '<p>确定要关闭吗？</p>',
                onOk: () => {
                    this.$Message.info('删除成功');
                },
                onCancel: () => {
                    
                }
            });
        },
        modalVisableChange: function (e) {
            if (!e) {
                this.$refs['addForm'].resetFields()
            }
        },
        addEnergy: function () {
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    console.log("success")

                } else {
                    console.log("error")
                }
            })
        },
        creatPowerChart: function () {
            powerChart = echarts.init(document.getElementById('powerChart'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: <br/>{c} ({d}%)"
                },
                color: ['#f9b88c', '#58b9a3'],
                series: [
                    {
                        name: '电量',
                        type: 'pie',
                        center: ['48%', '52%'],
                        radius: ['90%', '62%'],
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        
                        label: {
                            normal: {
                                show: true,
                                position: 'center',
                                formatter: [
                                    '{a|总费用}',
                                    '{b|728.4}'
                                ].join('\n'),
                                rich: {
                                    a: {
                                        color: '#525252',
                                        lineHeight: 20,
                                        fontSize: 14,
                                    },
                                    b: {
                                        color: '#525252',
                                        lineHeight: 30,
                                        fontSize: 20,
                                    }
                                },

                            },
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            { value: 300, name: '未用费用' },
                            { value: 600, name: '已用费用' },
                            
                        ]
                    }
                ]
            };
            powerChart.setOption(option)
        },
        creatEnergyMoneyChart: function () {
            energyMoneyChart = echarts.init(document.getElementById('energyMoneyChart'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                color: ['#4c5661', '#38a6cf', '#58b9a3', '#fab98c', '#d0747c'],
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    bottom:'5%',
                    data: ['电', '水', '气', '油', '热'],
                    itemWidth: 13,
                    textStyle: {
                        fontSize: 10
                    },
                    borderRadius:0

                },
               
                series: [
                    {
                        name: '费用比例',
                        type: 'pie',
                        center: ['48%', '44%'],
                        radius: ['70%', '48%'],
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '25',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            { value: 335, name: '电' },
                            { value: 310, name: '水' },
                            { value: 234, name: '气' },
                            { value: 135, name: '油' },
                            { value: 150, name: '热' },
                        ]
                    }
                ]
            };
            energyMoneyChart.setOption(option)
        },
        createModulePieChart: function (chart) {
            chart = echarts.init(document.getElementById(chart));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: <br/>{c} ({d}%)",
                    position: ['left', 'top']
                },
                color: ['#f9b88c', '#58b9a3', '#d0737b'],
                series: [
                    {
                        name: '电量',
                        type: 'pie',
                        radius: ['90%', '60%'],
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'center',
                                formatter: function (arg) {
                                    var html = '245.7';
                                    return html
                                },
                                textStyle: {
                                    color: '#525252',
                                    fontSize: 15,
                                    fontFamily: "sans-serif",
                                    fontWeight:100
                                }

                            },


                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            { value: 335, name: '直接访问' },
                            { value: 310, name: '邮件营销' },
                            { value: 234, name: '联盟广告' },
                            { value: 135, name: '视频广告' },
                        ]
                    }
                ]
            };
            chart.setOption(option)
            window.addEventListener("resize", () => {
                chart.resize();

            });
        },
        createModuleBarChart: function (chart) {
            chart = echarts.init(document.getElementById(chart));
            var  option = {
                    title: {
                        text: '12月电费能让消耗图(万元)',
                        left: 'center',
                        textStyle: {
                            color: '#757575',
                            fontWeight: 'normal',
                            fontSize: 10,
                        },
                        top:0
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
                        right:20
                    },
                grid: {
                        top:25,
                        left: '3%',
                        right: 0,
                        bottom: 0,
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 39, 30, 31],

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
                                    fontSize: 8,// 让字体变大
                                    color: '#9f9d9d'
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: 'kW·h',
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
                                    fontSize: 8,// 让字体变大
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
                            name: '直接访问',
                            type: 'bar',
                            barWidth: '50%',
                            data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390, 330, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390, 330]
                        }
                    ],
                    dataZoom: [
                        {
                            type: 'inside'
                        }
                    ]
            };
            chart.setOption(option)
            window.addEventListener("resize", () => {
                chart.resize();
                
            });
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
        },
        
       
    },
    beforeMount: function () {
        var that = this
        var id = $.cookie("enUID")
        if (id) {
            this.uid = id
        }
        this.getUnitComobxList()
        this.getCollectDevTypeList()
        this.getDepartMentList()
       
       
    },
    mounted: function () {
        this.creatPowerChart()
        this.creatEnergyMoneyChart()
        this.createModulePieChart("electricPieChart")
        this.createModuleBarChart("electricBarChart")
        this.createModulePieChart("waterPieChart")
        this.createModuleBarChart("waterBarChart")
        this.createModulePieChart("gasPieChart")
        this.createModuleBarChart("gasBarChart")
        //this.createModulePieChart("heatPieChart")
        //this.createModuleBarChart("heatBarChart")
        
        window.addEventListener("resize", () => {
            powerChart.resize();
            energyMoneyChart.resize()
           // electricPieChart.resize()
            //electricBarChart.resize()
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
   
    /*setScroll()
    window.onresize = function () {
        setScroll()
    };*/

    
})
