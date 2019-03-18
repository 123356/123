new Vue({
    el: "#app",
    data: {
        uid: null,
        uName: null,
        loading: true,
        departmentID: null,
        analysisTableHeight: 0,
        analysisColumns: [],
        analysisData: [],
        barChart: null,
        dateType: '1',
        piechart: null,
        typeList: [],
        curType: null,
        curDate: '',
        pieShow: true,
        barShow: true,
        loading: true,
        noDataText:"暂无数据",
    },
    methods: {
        //获取能源类型
        getCollectDevTypeList: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetCollectDevTypeList',
                method: 'get',
            }).then(function (res) {
                that.typeList = res.data
                if (res.data.length > 0) {
                    that.curType = res.data[0].ID
                    that.getBarData()
                }
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        typeTabClick: function (name) {
            this.curType = name
            this.getBarData()
        },
        dateTypeChange: function (res) {
            this.dateType = res
            this.getBarData()
        },
        //饼图数据
        GetEneryAnalysisPie: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryAnalysis',
                method: 'post',
                body: {
                    uid: that.uid,
                    time: that.curDate,
                    DepartmentID: that.departmentID
                }
            })
                .then(function (res) {
                    if (res.data.length > 0) {
                        that.pieShow = true
                        that.createPieChart(res.data)
                    } else {
                        that.pieShow = false
                    }

                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //表格数据
        getTableData: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryTable',
                method: 'post',
                body: {
                    uid: that.uid,
                    DepartmentID: that.departmentID,
                    time: that.curDate,

                }
            })
                .then(function (res) {
                    var data = res.data
                    var title = [
                        {
                            title: '名称',
                            align: 'center',
                            key: 'Name'
                        }
                    ]
                    for (var i = 0; i < data.TitleList.length; i++) {
                        var dw = 'kW·h'
                        if (data.TitleList[i].Type != 1) {
                            dw = 'm³'
                        }
                        var temp = {
                            title: data.TitleList[i].Name + '(' + dw + ')',
                            align: 'center',
                            key: data.TitleList[i].Type
                        }
                        title.push(temp)
                    }
                    title.push(
                        {
                            title: '详情',
                            align: 'center',
                            key: 'departID',
                            render: (h, params) => {
                                var that = this
                                var tempdate = new Date(that.curDate)
                                var month = tempdate.getMonth() + 1
                                if (month < 10) {
                                    month = "0" + month
                                }
                                return h('div', [

                                    h('a', {
                                        attrs: {
                                            href: '/EnergyEfficiency/RoomDataMonitoring?departmentID=' + params.row.ID + "&time=" + (tempdate.getFullYear() + "-" + month)
                                        },
                                        style: {
                                            textDecoration: 'none',
                                            color: '#60b8a2',
                                            fontSize: '12px'
                                        },
                                        on: {
                                            click: () => {

                                            }
                                        }
                                    }, '查看'),
                                ]);
                            }
                        }
                    )
                    that.analysisColumns = title
                    var tempTable = new Array()
                    for (var i = 0; i < data.table.length; i++) {
                        tempTable.push(data.table[i].value)
                    }
                    that.analysisData = tempTable
                   

                })
                .catch(function (e) {

                    throw new ReferenceError(e.message)
                })
                .finally(function () {
                    that.loading = false
                })
        },
        //柱状图数据
        getBarData: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryLine',
                method: 'post',
                body: {
                    uid: that.uid,
                    DepartmentID: that.departmentID,
                    type: that.curType,
                    TypeTime: parseInt(that.dateType),
                    time: that.curDate,
                }
            })
                .then(function (res) {
                    var data = res.data
                    if (data) {
                        if (data.list_r.list_this.length > 0 || data.list_r.list_last.length > 0) {
                            that.barShow = true
                            that.createbarChart(data)
                        } else {
                            that.barShow = false
                        }
                    } else {
                        that.barShow = false
                    }
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        dateChange: function (e) {
            this.curDate = e
            this.GetEneryAnalysisPie()
            this.getTableData()

        },
        selectChange: function (res) {
        },
        createbarChart: function (data) {
            barChart = echarts.init(document.getElementById('barChart'));
            var legendData = new Array()
            if (this.dateType == '1') {
                legendData = ['今日', '昨日']
            } else if (this.dateType == '2') {
                legendData = ['本月', '上月']
            } else {
                legendData = ['今年', '去年']
            }
            var yName = 'kW·h';
            if (this.curType != '1') {
                yName = 'm³';
            }
            var serData1 = new Array()
            for (var i = 0; i < data.list_r.list_this.length; i++) {
                serData1.push(data.list_r.list_this[i].value)

            }
            var serDataLast = new Array()
            for (var i = 0; i < data.list_r.list_last.length; i++) {
                serDataLast.push(data.list_r.list_last[i].value)

            }
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
                    itemGap: 1

                },
                legend: {
                    data: legendData,
                    x: 'center',
                    textStyle: {
                        fontSize: 10,
                        color: '#666'
                    }
                },
                color: ['#53bda9'],
                grid: {
                    bottom: '5%',
                    left: 30,
                    right: 20,
                    top: '17%'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.x,
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
                        name: yName,
                        min: 0,


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
                        show: false,
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
                        data: serData1,

                    },
                    {
                        name: '昨日',
                        type: 'bar',
                        color: "#80c5e2",
                        data: serDataLast,

                    },

                ],
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ]
            };
            barChart.clear()
            barChart.setOption(option)
            window.addEventListener("resize", () => {
                barChart.resize()
            });

        },
        createPieChart: function (data) {
            piechart = echarts.init(document.getElementById('piechart'));
            var str = ''
            for (var i = 0; i < data.length; i++) {
                str += data[i].name
            }

            var option = {
                title: {
                    text: '分项用' + str,
                    subtext: '预算：10万',
                    x: 'center',
                    textStyle: {
                        fontSize: 10,
                        fontWeight: 'normal'
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
                        data: data,
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
            window.addEventListener("resize", () => {
                piechart.resize();
            });

        },


        setHeight: function () {
            this.analysisTableHeight = $(".top .right-top-left .con").height()
        }
    },
    beforeMount: function () {
        var isParent = sessionStorage.getItem("isParent")
        if (isParent == "false") {
            this.noDataText = "无子项数据"
        }
        sessionStorage.getItem("isParent",true)
        this.departmentID = window.location.search.split("=")[1]
        this.uid = $.cookie("enUID")
        this.uName = $.cookie("enUName")
        var that = this
        setInterval(function () {
            //setWidth2()
            that.setHeight()
        }, 100)
        var date = new Date()
        var month = date.getMonth() + 1
        if (month < 10) {
            month = "0" + month
        }
        this.curDate = date.getFullYear() + "-" + month
        this.getCollectDevTypeList()
        this.GetEneryAnalysisPie()
        this.getTableData()
    },
    mounted: function () {
        //this.createbarChart()
        /*this.createBarAndLine()*/

    }
})

