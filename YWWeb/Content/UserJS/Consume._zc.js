new Vue({
    el: "#app",
    data: {
        loading: true,
        uid: null,
        listWidth: 0,
        listHeight: 0,
        analysisTableHeight: 0,
        dateType: '1',
        listColumns: [
            //{
            //    type: 'selection',
            //    width: 20,
            //    align: 'center',
            //},
            {
                title: '排名',
                align: 'center',
                key: 'index',
                width: 50,
                render: (h, params) => {
                    var index = params.index + 1
                    if (index <= 3) {
                        return h('img', {
                            attrs: {
                                src: '/Content/images/energyDifficiency/order' + index + '.png',
                                style: 'width: 18px;height:24px;',
                                class: 'iconImg'
                            },
                            on: {
                                click: () => {
                                }
                            }
                        })
                    } else {
                        return h('Badge', {
                            attrs: {
                                type: 'normal',
                                count: index,
                                overflowCount: 1000
                            },
                            on: {
                                click: () => {
                                }
                            }
                        })

                    }

                }

            },
            {
                title: '详细',
                align: 'left',
                tooltip: true,
                key: 'EName',
                render: (h, params) => {
                    var time = params.row.RecordTime
                    var date = new Date(parseInt(time.replace(/\/Date\((-?\d+)\)\//, '$1')));
                    var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
                    return h('div', [
                        h('p', [
                             h('span',  '名称：' + params.row.EName),
                              h('span', { attrs: { class: 'labelName' } }, '类型：' + params.row.COName),
                        ]),
                        h('p', [
                             h('span', '偏差率：' + (params.row.Proportion - 100).toFixed(2) + '%')
                        ]),
                        h('p', [
                            
                             h('span', '时间：' +d )
                        ])

                    ]);
                }
            }
        ],
        listData: [],
        analysisColumns: [
            {
                title: '时间',
                align: 'center',
                sortable: true,
                key: 'RecordTime',
                render: (h, params) => {
                    var time = params.row.RecordTime
                    var date = new Date(parseInt(time.replace(/\/Date\((-?\d+)\)\//, '$1')));
                    var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
                    return h('span',
                        {
                            attrs: {
                                style: 'color:#6d6d6f',
                            },
                        }, d)
                }
            },
            {
                title: '区域',
                align: 'center',
                key: 'EName'
            },
            {
                title: '预测电量(kW·h)',
                align: 'center',
                key: 'BudgetEnergy'
            },
            {
                title: '实际电量(kW·h)',
                align: 'center',
                key: 'ActualEnergy'
            },
            {
                title: '偏差率',
                align: 'center',
                key: 'Proportion',
                render: (h, params) => {
                    return h('span',
                        {
                        }, (params.row.Proportion - 100).toFixed(2) + '%')
                }
            },
            {
                title: '电量(kW·h)',
                align: 'center',
                key: 'ActualEnergy',
                sortable: true,

            },
            {
                title: '温度(°C)',
                align: 'center',
                width: 80,
                key: 'Temperature',
                sortable: true
            },
            {
                title: '人流量',
                align: 'center',
                width: 100,
                key: 'People',
                sortable: true
            },
            {
                title: '建筑面积(㎡)',
                align: 'center',
                width: 100,
                key: 'Area',
                sortable: true
            },
            {
                title: '用途',
                align: 'center',
                key: 'Purpose'
            },
            /* {
                 title: '结论',
                 align: 'center',
                 key: 'result'
             },*/
        ],
        analysisData: [],
        barAndLineChart: null,
        lineChart: null,
        tableSelection: [],
        uid: null,
        curSelectID: '',
        curCID: '',
        curEntype: 1,
        barShow: true,
        lineShow: true,
        rowClickSelection: [],
        switchState: false,
        curTime: null,
    },
    methods: {
        //异常列表
        getLeftList: function () {
            var that = this
            this.loading = true
            this.$http({
                url: '/energyManage/EMHome/GetExTable',
                method: 'post',
                body: {
                    uid: that.uid
                }
            })
                .then(function (res) {
                    var data = res.data
                    if (data.length > 0) {
                        that.curTime = data[0].RecordTime
                        for (var i = 0; i < data.length; i++) {
                            if (i == 0) {
                                data[i]._checked = true
                            } else {
                                data[i]._checked = false
                            }
                            data[i]._disabled = false
                            data[i].index = i
                        }
                        var id = data[0].ID
                        that.curCID = data[0].PID + "-" + data[0].CID
                        that.curSelectID = data[0].ID
                        that.getTableList(data[0].ID)
                        that.getBarData(data[0].PID + "-" + data[0].CID)
                        that.getLineData(data[0].PID + "-" + data[0].CID)
                    } else {
                        that.barShow = false
                        that.lineShow = false
                    }
                    that.listData = data
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
                .finally(function () {
                    that.loading = false
                    $(".ivu-table-tbody .ivu-table-row:eq(0)").addClass("ivu-table-row-highlight")
                })
        },
        switchChange: function (e) {
            this.switchState = e
            if (e) {
                this.listColumns.unshift({
                    type: 'selection',
                    width: 20,
                    align: 'center',
                })
                this.getLeftList()
            } else {
                this.listColumns.splice(0, 1)
                $(".ivu-table-tbody .ivu-table-row:eq(0)").addClass("ivu-table-row-highlight")

            }
        },
        //异常分析表格
        getTableList: function (id) {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetbugTable',
                method: 'post',
                body: {
                    id: id
                }
            })
                .then(function (res) {
                    if (res.data != "") {
                        that.analysisData = res.data
                    }
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        //柱状图数据
        getBarData: function (cids) {
            this.loading = true
            var that = this
            var time = this.curTime
            var date = new Date(parseInt(time.replace(/\/Date\((-?\d+)\)\//, '$1')));
            var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            this.$http({
                url: '/energyManage/EMHome/GetExData',
                method: 'post',
                body: {
                    cpids: cids,
                    type: that.curEntype,
                    TypeTime: that.dateType,
                    uid: that.uid,
                    time: d
                }
            })
                .then(function (res) {
                    if (res.data) {
                        if (res.data.name) {
                            that.barShow = true
                        } else {
                            that.barShow = false
                        }
                    } else {
                        that.barShow = false
                    }
                    that.createBarAndLine(res.data)
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
                .finally(function () {
                    that.loading = false
                })
        },
        //折线图数据
        getLineData: function (cids) {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetBudgetData',
                method: 'post',
                body: {
                    cpids: cids,
                }
            })
                .then(function (res) {
                    if (res.data) {
                        if (res.data.x.length > 0) {
                            that.lineShow = true
                            that.createEnergyConLine(res.data)
                        } else {

                            that.lineShow = false
                        }
                    } else {

                        that.lineShow = false
                    }
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        tableSelectChange: function (selection) {
            this.tableSelect(selection)
        },
        tableSelect: function (selection) {
            this.curSelectID = ''
            this.curCID = ''
            if (selection.length == 0) {
                barAndLineChart.clear()
                lineChart.clear()
                this.analysisData = []
                //this.barShow = false
                this.lineShow = false
                return
            }
            this.curEntype = selection[0].CODID
            if (selection.length > 1) {
                if (selection[1].CODID != selection[0].CODID) {
                    this.$Message.warning({
                        content: '请选择相同能源类型进行对比',
                        duration: 10,
                        closable: true
                    });
                    this.listData[selection[1].index]._checked = false
                    selection.splice(1, 1)
                }
            }
            if (selection.length <= 2) {
                this.tableSelection = selection


            }

            if (this.tableSelection.length == 2) {
                //this.$Modal.warning({
                //    title: '信息提示',
                //    content: '最多只能选择两项进行对比'
                //});
                //if (selection[0].index > selection[1].index) {
                //    this.curTime = selection[1].RecordTime
                //} else {
                //    this.curTime = selection[0].RecordTime
                //}
                this.curTime = selection[0].RecordTime
                this.setSelectState(true)
            } else {
                this.setSelectState(false)
            }
            //判断表头
            if (selection[0].CODID == 1) {
                this.analysisColumns[2].title = "电量(kW·h)"
            } else if (selection[0].CODID == 2) {
                this.analysisColumns[2].title = "水(m³)"
            } else if (selection[0].CODID == 3) {
                this.analysisColumns[2].title = "燃气(m³)"
            }
            for (var i = 0; i < selection.length; i++) {
                if ((i + 1) == selection.length) {
                    this.curSelectID += selection[i].ID + ""
                    this.curCID += (selection[i].PID + "-" + selection[i].CID)
                } else {
                    this.curSelectID += selection[i].ID + ","
                    this.curCID += (selection[i].PID + "-" + selection[i].CID) + ","
                }
            }
            this.getTableList(this.curSelectID)
            this.getBarData(this.curCID)
            this.getLineData(this.curCID)
        },
        dateTypeChange: function (e) {
            this.dateType = e
            this.getBarData(this.curCID)
        },
        onSelect: function (selection, row) {
            if (this.tableSelection.length < 3) {
                this.listData[row.index]._checked = true
            }
        },
        onSelectCancel: function (selection, row) {

            this.listData[row.index]._checked = false
        },
        rowCLick: function (row, index) {
            //this.listData[index]._checked = !this.listData[index]._checked
            $(".ivu-table-tbody .ivu-table-row").removeClass("ivu-table-row-highlight")
            $(".ivu-table-tbody .ivu-table-row:eq(" + index + ")").addClass("ivu-table-row-highlight")
            this.curTime = row.RecordTime
            if (!this.switchState) {
                this.curSelectID = row.ID
                this.curCID = row.PID + "-" + row.CID
                this.curEntype = row.CODID
                this.getTableList(this.curSelectID)
                this.getBarData(this.curCID)
                this.getLineData(this.curCID)
            }

        },
        setSelectState: function (isDisable) {
            for (var i = 0; i < this.listData.length; i++) {
                if (isDisable) {
                    if (!this.listData[i]._checked) {
                        this.listData[i]._disabled = true
                    }
                } else {
                    this.listData[i]._disabled = false
                }
            }
        },
        //用电趋势图
        createBarAndLine: function (data) {

            barAndLineChart = echarts.init(document.getElementById('barAndLine'));
            var legend = []
            var seriesData = new Array()

            var yName = "kW·h"
            if (this.curEntype != 1) {
                yName = "m³"
            }
            var color = ['#53bda9', '#7fc4e1', ]
            if (data.name.length > 0) {
                legend = data.name
                for (var i = 0; i < data.list_line.length; i++) {
                    var tempData = data.list_line[i].list
                    var dataArray = new Array()
                    for (var j = 0; j < tempData.length; j++) {
                        dataArray.push(tempData[j].value)
                    }
                    var yc = []
                    for (var j in data.list_line[i].list_budget) {
                        yc.push(data.list_line[i].list_budget[j].value)
                    }
                    var temp = {
                        name: data.list_line[i].name[i],
                        type: 'bar',
                        barMaxWidth: '15',
                        color: color[i],
                        data: dataArray
                    }
                    var index = parseInt(i + 1)
                    seriesData.push(temp)
                    seriesData.push({
                        name: data.list_line[i].name[index],
                        type: 'bar',
                        barMaxWidth: '15',
                        color: '#fb8134',
                        data: yc
                    })
                }
                seriesData.push(
                    {
                        name: '温度',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: false,
                        symbol: 'none',//节点样式
                        lineStyle: {
                            color: '#53bda9',
                            width: 1,

                        },
                        data: data.listweather
                    }
                )
            }
            legend.push("温度")
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
                    itemSize: 8,
                    itemGap: 1

                },
                legend: {
                    data: legend,
                    x: 'center',
                    textStyle: {
                        fontSize: 10,
                        color: '#666'
                    }
                },
                color: ['#53bda9'],
                grid: {
                    bottom: 50,
                    left: 40,
                    right: 20
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
                        //interval: 50,
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
                        name: '温度℃',
                        min: 0,

                        interval: 5,
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
                series: seriesData,
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ]
            };
            barAndLineChart.clear()
            barAndLineChart.setOption(option)
            window.addEventListener("resize", () => {
                barAndLineChart.resize();
            });

        },
        createEnergyConLine: function (data) {
            lineChart = echarts.init(document.getElementById('energyConLine'));
            var width = $(window).width()

            var yName = "kW·h"
            if (this.curEntype != 1) {
                yName = "m³"
            }
            var seriesData = []
            for (var i in data.list_line) {
                var sj = []
                var yc = []
                for (var j in data.list_line[i].list) {
                    sj.push(data.list_line[i].list[j].value)
                }
                for (var j in data.list_line[i].list_budget) {
                    yc.push(data.list_line[i].list_budget[j].value)
                }

                seriesData.push({
                    name: data.name[i],
                    type: 'line',
                    smooth: false,
                    symbol: 'none',//节点样式
                    lineStyle: {
                        color: '#53bda9',
                        width: 1,

                    },
                    data: sj
                })
                var index = parseInt(i + 1)
                seriesData.push({
                    name: data.name[index],
                    type: 'line',
                    smooth: false,
                    symbol: 'none',//节点样式
                    lineStyle: {
                        color: '#fa8033',
                        width: 1,

                    },
                    data: yc
                })

            }
            var option = option = {

                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: data.name,
                    x: 'center',
                    textStyle: {
                        fontSize: 10,
                        color: '#666'
                    }
                },
                color: ['#53bda9', '#fa8033'],
                grid: {
                    top: 50,
                    left: 35,
                    right: 5,
                    bottom: 50,
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
                    itemSize: 8,
                    itemGap: 1
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
                    data: data.x
                },
                yAxis: {
                    name: yName,
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
                series: seriesData,
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ]
            };
            lineChart.clear()
            lineChart.setOption(option)
            window.addEventListener("resize", () => {
                lineChart.resize()
            });
        },
        setHeight: function () {
            this.listHeight = $(".left .list").height() - 21
            this.analysisTableHeight = $(".right .bottom").height() - 40
        },
        getUnitData: function () {
            var unitData = JSON.parse(localStorage.getItem("UnitData"))
            if (unitData) {
                this.uid = unitData.enUID
                // this.Uname = unitData.enName
            }
        }
    },
    beforeMount: function () {
        this.getUnitData()
        //this.uid = $.cookie("enUID")
        var that = this
        function setWidth2() {
            var isScroll = $(".ivu-table-overflowY").length
            if (isScroll > 0) {
                var width = $(".left .list").width()
                that.listWidth = width + 17
            }
        }
        setWidth2()
        setInterval(function () {
            setWidth2()
            that.setHeight()
        }, 100)
        this.getLeftList()


    },
    mounted: function () {
        //用能列表默认第一行选中
        //this.$refs.tableSelect.$refs.tbody.objData[0]._isChecked = true
    }
})
