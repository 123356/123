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
                        return h('div', {
                            attrs: {
                                class: 'orderNum',
                                style: 'width: 18px;height:18px;border-radius:50%;color:#fff;background:#9d9d9d;text-align:center;line-height:18px;margin:0 auto;font-size:1rem',

                            },
                            on: {
                                click: () => {
                                }
                            }
                        }, index)
                    }

                }

            },
            {
                title: '名称',
                align: 'left',
                tooltip: true,
                key: 'EName',
                render: (h, params) => {
                    return h('span',
                        {
                            attrs: {
                                style: 'color:#6d6d6f',
                            },
                        }, params.row.EName)
                }
            },
            {
                title: '百分比',
                align: 'center',
                key: 'Proportion'
            },
            {
                title: '类型',
                width: 35,
                align: 'center',
                key: 'COName'
            },
            {
                title: '时间',
                tooltip: true,
                align: 'center',
                key: 'RecordTime',
                render: (h, params) => {
                    var time = params.row.RecordTime
                    var date = new Date(parseInt(time.replace(/\/Date\((-?\d+)\)\//, '$1')));
                    var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                    return h('span',
                        {
                            attrs: {
                                style: 'color:#6d6d6f',
                            },
                        }, d)
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
                    var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
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
                key: 'CName'
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
        curTime:null,
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
                     uid:that.uid
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
                        that.curCID = data[0].CID
                        that.curSelectID = data[0].ID
                        that.getTableList(data[0].ID)
                        that.getBarData(data[0].CID)
                        that.getLineData(data[0].CID)
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
                    cids: cids,
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
                    cids: cids,
                }
            })
                .then(function (res) {
                    if (res.data) {
                        if (res.data.shijivalue.length > 0) {
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
                    selection.splice(1,1)
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
                if (selection[0].index > selection[1].index) {
                    this.curTime = selection[1].RecordTime
                } else {
                    this.curTime = selection[0].RecordTime
                }
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
                    this.curCID += selection[i].CID + ""
                } else {
                    this.curSelectID += selection[i].ID + ","
                    this.curCID += selection[i].CID + ","
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
            this.curTime = row.RecordTime
            if (!this.switchState) {
                this.curSelectID = row.ID
                this.curCID = row.CID
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
            var legend = []
            barAndLineChart = echarts.init(document.getElementById('barAndLine'));
            var legend = []
            var seriesData = new Array()
            legend.push("温度")
            var yName = "kW·h"
            if (this.curEntype != 1) {
                yName = "m³"
            }
            var color = ['#53bda9', '#7fc4e1', '#3ea19c',]
            if (data.name.length > 0) {
                legend = data.name
                for (var i = 0; i < data.list_line.length; i++) {
                    var tempData = data.list_line[i].list
                    var dataArray = new Array()
                    for (var j = 0; j < tempData.length; j++) {
                        dataArray.push(tempData[j].value)
                    }
                    var temp = {
                        name: data.list_line[i].name,
                        type: 'bar',
                        barMaxWidth: '15',
                        color: color[i],
                        data: dataArray
                    }
                    seriesData.push(temp)
                }
                seriesData.push(
                    {
                        name: '温度',
                        type: 'line',
                        yAxisIndex: 1,
                        smooth: true,
                        symbol: 'none',//节点样式
                        lineStyle: {
                            color: '#53bda9',
                            width: 1,

                        },
                        data: data.tianqi
                    }
                )
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
                        max: 25,
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

            var option = option = {

                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['实时', '预测'],
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
                series: [

                    {
                        name: '实时',
                        type: 'line',
                        smooth: true,
                        symbol: 'none',//节点样式
                        lineStyle: {
                            color: '#53bda9',
                            width: 1,

                        },
                        data: data.shijivalue
                    },
                    {
                        name: '预测',
                        type: 'line',
                        symbol: 'none',//节点样式
                        smooth: true,

                        lineStyle: {
                            color: '#fa8033',
                            width: 1,

                        },

                        data: data.budgetList
                    }
                ],
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
        }
    },
    beforeMount: function () {
        this.uid = $.cookie("enUID")
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
