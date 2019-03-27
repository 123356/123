new Vue({
    el: "#app",
    data: {
        uid: null,
        departmentID: null,
        departName:null,
        analysisTableHeight:0,
        analysisColumns: [
            {
                title: '时间',
                align: 'center',
                key: 'time'
            },
            {
                title: '人数(人)',
                align: 'center',
                width: 100,
                key: 'people'
            },
            {
                title: '建筑面积(㎡)',
                align: 'center',
                width: 100,
                key: 'area'
            },
           
        ],
        analysisData: [],
        barChart: null,
        dateType: '1',
        curType: null,
        typeList: [],
        curTime: '',
        barShow: true,
        loading:true
       
    },
    methods: {
        typeTabClick: function (name) {
            this.curType = name
            this.getBarData()
        },
        dateTypeChange: function (res) {
            this.dateType = res
            this.getBarData()
        },
        //获取table数据
        getTableData: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetChildItemData',
                method: 'post',
                params: {
                    uid: that.uid,
                    DepartmentID: that.departmentID,
                    time: that.curTime
                }
            })
            .then(function (res) {
                var data = res.data
                
                for (var i = 0; i < data.TitleList.length; i++) {
                    if (data.TitleList[i].Type.length > 1) {
                        this.analysisColumns.push(
                            {
                                title: data.TitleList[i].Name,
                                align: 'center',
                                key: data.TitleList[i].Type
                            }
                        )
                    } else {
                        this.analysisColumns.push(
                            {
                                title: data.TitleList[i].Name + '(元)',
                                align: 'center',
                                key: data.TitleList[i].Type
                            }
                        )
                    }
                   
                    
                }
                var tempTable = new Array()
                for (var i = 0; i < data.table.length; i++) {
                    tempTable.push(data.table[i].value)
                }
                that.analysisData = tempTable
                that.loading = false
            })
            .catch(function (e) {
                console.log(e)
                that.loading = false
            })
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
                console.log(e)
            })
        },
        //柱状图数据
        getBarData: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryLine',
                method: 'post',
                params: {
                    uid: that.uid,
                    DepartmentID: that.departmentID,
                    type: that.curType,
                    TypeTime: parseInt(that.dateType),
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
                    console.log(e)
                })
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
                    bottom: '7%',
                    left: 40,
                    right: 20,
                    top: '25%'
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

        userBtnClick: function (e) {
            this.activeIndex = e
            this.frameSrc = this.userMneus[e].url

        },
        setHeight: function () {
            this.analysisTableHeight = $(".right .bottom").height()-40
        },
        getParURl: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    },
    beforeMount: function () {
        this.uid = $.cookie("enUID")
        this.departmentID = this.getParURl("departmentID")
        this.curTime = this.getParURl("time")
        this.departName = sessionStorage.getItem("curDepartName")
        var that = this
        setInterval(function () {
            that.setHeight()
        }, 100)
       this.getTableData()
       this.getCollectDevTypeList()
       
    },
    mounted: function () {
        
    }
})

