new Vue({
    el: "#app",
    data: {
        uid: null,
        uName: null,
        deartmentName: '',
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
        noDataText: "暂无数据",
        DepBudget: 0,//饼图预算
    },
    methods: {
        toMoney: function (num) {
            //num = num.toFixed(2);
            num = parseFloat(num)
            num = num.toLocaleString();
            return num;//返回的是字符串23,245.12保留2位小数
        },
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
                },
            })
                .then(function (res) {
                    if (res.data.list.length > 0) {
                        that.pieShow = true
                        that.createPieChart(res.data)

                    } else {
                        that.pieShow = false
                    }
                    that.DepBudget = res.data.DepBudget

                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
                .finally(function () {
                    that.loading = false
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


                        var temp = {
                            title: data.TitleList[i].Name + '(元)',
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
                                                sessionStorage.setItem("curDepartName", params.row.Name)
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
                    that.loading = false
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
                        dataView: {
                            show: true,
                            readOnly: false,
                            optionToContent: function (opt) {
                                var axisData = opt.xAxis[0].data;
                                var series = opt.series;
                                var tdHeads = '<td  style="padding:0 10px">日期</td>';
                                series.forEach(function (item) {
                                    tdHeads += '<td style="padding: 0 10px">' + item.name + '</td>';
                                });
                                var table = '<table border="1" style="width:100%;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>' + tdHeads + '</tr>';
                                var tdBodys = '';
                                for (var i = 0, l = axisData.length; i < l; i++) {
                                    for (var j = 0; j < series.length; j++) {
                                        if (typeof (series[j].data[i]) == 'object') {
                                            tdBodys += '<td>' + series[j].data[i].value + '</td>';
                                        } else {
                                            tdBodys += '<td>' + series[j].data[i] + '</td>';
                                        }
                                    }
                                    table += '<tr><td style="padding: 0 10px">' + axisData[i] + '</td>' + tdBodys + '</tr>';
                                    tdBodys = '';
                                }
                                table += '</tbody></table>';
                                return table;
                            }
                        },
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
                    bottom: '6%',
                    left: 40,
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
                        name: '元',
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
                    //{
                    //    type: 'value',
                    //    name: '昨日',
                    //    min: 0,
                    //    max: 25,
                    //    interval: 5,
                    //    show: false,
                    //    axisLabel: {
                    //        formatter: '{value} °C'
                    //    },
                    //    axisLine: {
                    //        lineStyle: {
                    //            color: '#cdcdcd',//x轴线颜色
                    //            width: '0.7'
                    //        },
                    //    },
                    //    axisTick: {
                    //        show: false
                    //    },
                    //    splitLine: {
                    //        show: false
                    //    },
                    //    axisLabel: { //调整y轴的lable  
                    //        textStyle: {
                    //            fontSize: 10,// 让字体变大
                    //            color: '#9f9d9d'
                    //        }
                    //    },

                    //}
                ],
                series: [

                    {
                        name: legendData[0],
                        type: 'bar',
                        color: "#53bda9",
                        data: serData1,

                    },
                    {
                        name: legendData[1],
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
        createPieChart: function (par) {
            var data = par.list
           
            piechart = echarts.init(document.getElementById('piechart'));
            var str = ''
            var sumTotal = 0
            for (var i = 0; i < data.length; i++) {
                str += data[i].name
                sumTotal += parseFloat(data[i].value)
            }
            var that = this
            var option = {
                title: {
                    text: this.deartmentName + '(' + str + ')',
                    subtext: '预算(万)：' + this.toMoney(par.DepBudget) + '，总能耗(元)：' + this.toMoney(sumTotal),
                    x: 'center',
                    textStyle: {
                        fontSize: 13,
                        fontWeight: 'normal'
                    },
                    subtextStyle: {
                        fontSize: 12,
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params, ticket, callback) {
                        return params.name + "：" + that.toMoney(params.value)
                    },
                },
                color: ['#60b7a4', '#e0c389', '#86d2df'],

                series: [
                    {
                        name: '能耗(元)',
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
        },
        getUnitData: function () {
            var unitData = JSON.parse(localStorage.getItem("UnitData"))
            if (unitData) {
                this.uid = unitData.enUID
                this.Uname = unitData.enName
            }
        }
    },
    beforeMount: function () {
        var isParent = sessionStorage.getItem("isParent")
        if (isParent == "false") {
            this.noDataText = "无子项数据"
        }
        sessionStorage.getItem("isParent", true)
        this.deartmentName = sessionStorage.getItem("parentDepartName")
        this.departmentID = window.location.search.split("=")[1]
        this.getUnitData()
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
