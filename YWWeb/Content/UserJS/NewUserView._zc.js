
new Vue({
    el: '#userView',
    data: {
        loading: true,
        pieYearChart: null,
        elecUsageChart: null,
        lineChart: null,
        unitList: [],
        UnitID: null,
        StationStateInfo: {},//运行状态
        orderList: [],
        alarmList: [],
        proInfo: {},
        PDFList: [],
        PID: null,
        BYQList: [],
        activeIndex: null,
        otherInfo: {},
        Sumload: null,
        RatedCapacity: null
    },
    methods: {
        //用户下拉框
        getUnitListData: function () {
            var that = this
            this.$http({
                url: '/Home/UnitListData',
                method: 'post'
            })
                .then(function (res) {
                    if ($.cookie("unitId") != null) {
                        that.UnitID = parseInt($.cookie("unitId"))
                    } else {
                        if (res.data.length > 0) {
                            that.UnitID = res.data[0].UnitID
                        }
                    }
                    that.unitList = res.data
                    that.getStationState()
                    that.getThisDayPower()
                    that.getLastMonthPower()
                    that.getThisYearPower()
                    that.getUseEl()
                    that.getMessage()
                    that.getProInfo()
                    that.getPDF()
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
        },
        selectChange: function (e) {
            $.cookie('unitId', e, { expires: 7, path: '/' });
            this.loading = true
            this.PID = null
            this.activeIndex = null
            this.getStationState()
            this.getThisDayPower()
            this.getLastMonthPower()
            this.getThisYearPower()
            this.getUseEl()
            this.getMessage()
            this.getProInfo()
            this.getPDF()
        },
        //获取运行情况
        getStationState: function () {
            var that = this
            this.$http({
                url: '/Home/GetStationState',
                method: 'post',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                that.StationStateInfo = res.data
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                that.loading = false
            })
        },
        //获取当日累计电量
        getThisDayPower: function () {
            var that = this
            this.$http({
                url: '/Home/GetThisDayPower',
                method: 'post',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                if (res.data) {
                    that.StationStateInfo.thisDayPower = res.data.thisDayPower
                    that.StationStateInfo.thisDayOccupation = res.data.thisDayOccupation
                }
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                that.loading = false
            })
        },
        //获取上月用电
        getLastMonthPower: function () {
            var that = this
            this.$http({
                url: '/Home/GetLastMonthPower',
                method: 'post',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                if (res.data) {
                    that.StationStateInfo.thisMonthPower = res.data.thisMonthPower
                    that.StationStateInfo.thisMonthOccupation = res.data.thisMonthOccupation
                }
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                that.loading = false
            })
        },
        //获取当年累计电量
        getThisYearPower: function () {
            var that = this
            this.$http({
                url: '/Home/GetThisYearPower',
                method: 'post',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                var data = null
                if (res.data) {
                    data = res.data.thisPowerLastYear
                }
                that.createPieYearChart(data)

            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            .finally(function () {
                that.loading = false
            })
        },
        //消息通知
        getMessage: function () {
            var that = this
            this.$http({
                url: '/Home/AlarmManager',
                method: 'post',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                var data = res.data
                if (data) {
                    var tempOrder = new Array()
                    var tempAlarm = new Array()
                    for (var i = 0; i < data.order.length; i++) {
                        tempOrder.push(data.order[i])
                        if (tempOrder.length == 3) {
                            break
                        }
                    }
                    for (var i = 0; i < data.Alarm.length; i++) {
                        tempAlarm.push(data.Alarm[i])
                        if (tempAlarm.length == 3) {
                            break
                        }
                    }
                    that.orderList = tempOrder
                    that.alarmList = tempAlarm
                }
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //项目信息
        getProInfo: function () {
            var that = this
            this.$http({
                url: '/Home/GetProjectInfo',
                method: 'post',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                that.proInfo = res.data
            })
            .catch(function (e) {

            })
        },
        //获取配电房
        getPDF: function () {
            var that = this
            this.$http({
                url: '/Home/GetPDF',
                method: 'POST',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                that.PDFList = res.data
                if (res.data.length > 0) {
                    that.PID = res.data[0].PID
                }
                that.getBYQ()
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        tabChange: function (name) {
            console.log(name)
            this.PID = name
            this.getBYQ()
        },
        //获取变压器
        getBYQ: function () {
            var that = this
            this.$http({
                url: '/Home/getBianyaqi',
                method: 'POST',
                body: {
                    pid: this.PID
                }
            })
            .then(function (res) {
                that.BYQList = res.data
                if (res.data.length > 0) {
                    that.activeIndex = res.data[0].C
                }
                that.getLineData()
                var timeset;
                clearInterval(timeset);
                timeset = setInterval(function () {
                    that.getLineData()
                    that.getStationState()
                    that.getThisDayPower()
                    that.getUseEl()
                    that.getLastMonthPower()
                    that.getThisYearPower()
                    //that.getLXData()
                }, 60000)
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //用电概况
        getUseEl: function () {
            var that = this
            this.$http({
                url: '/Home/ViewLoop',
                method: 'post',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                if (res.data) {
                    that.Sumload = res.data.Sumload
                    that.RatedCapacity = res.data.RatedCapacity
                    that.createElecUsageChart(res.data)
                }
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //轮询数据
        getLXData: function () {
            var that = this
            this.$http({
                url: '/Home/ViewLoop',
                method: 'post',
                body: {
                    uid: this.UnitID
                }
            })
            .then(function (res) {
                if (res.data) {
                    that.StationStateInfo.thisDayPower = res.data.thisDayPower
                    that.StationStateInfo.thisDayOccupation = res.data.thisDayOccupation
                    that.StationStateInfo.thisMonthPower = res.data.thisMonthPower
                    that.StationStateInfo.thisMonthOccupation = res.data.thisMonthOccupation
                    that.Sumload = res.data.thisMonthOccupation
                    that.RatedCapacity = res.data.RatedCapacity
                    that.createElecUsageChart(res.data)
                }
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },

        barMenuClick: function (e) {
            this.activeIndex = e
            this.getLineData()
        },
        //获取曲线数据
        getLineData: function () {
            var that = this
            this.$http({
                url: '/Home/LoadCurve',
                method: 'POST',
                body: {
                    pid: this.PID,
                    did: this.activeIndex,
                    cid: null
                }
            })
            .then(function (res) {
                if (res.data.model) {
                    that.otherInfo = res.data.model
                }
                that.createLineChart(res.data)
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        toPDFDetail: function () {
            $.cookie('cookiepid', this.PID, { expires: 7, path: '/' });
            $("#main_frame", parent.document.body).attr("src", "/PowerQuality/Index?mid=21");
        },
        score: function () {
            window.open("/Es/Score", "_blank",
                "left=100px,top=50px,resizable=no, toolbar=no, location=no,fullscreen=no,channelmode=no, directories=no, status=no, menubar=no, scrollbars=yes, copyhistory=no, width=1000, height=500")
        },
        msgDetail: function (type) {
            if (type == 0) {
                location.href = '/AlarmManage/Index?pid=0'

            } else {
                location.href = '/Orderinfo/OrderList'
            }
        },
        //当年累计电量pie
        createPieYearChart: function (data) {
            //var data = this.StationStateInfo.thisPowerLastYear
            pieYearChart = echarts.init(document.getElementById('pieYearChart'));
            var option = {
                title: {
                    text: '占去年用电' + data + '%',
                    bottom: 0,
                    x: 'center',
                    textStyle: {  //标题文字设置
                        fontSize: '11',
                        fontWeight: 'normal',
                        color: '#666'
                    }
                },
                color: ['#3ab094', '#f3f2f0'],
                series: [
                    {
                        name: '累计电量',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '40%'],
                        hoverAnimation: false,
                        silent: true,
                        data: [
                            { value: data, name: '当年累计' },
                            { value: (100 - data).toFixed(2), name: '去年累计' }
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false   //隐藏标示文字
                                },
                                labelLine: {
                                    show: false   //隐藏标示线
                                }
                            }
                        }
                    }
                ]
            };
            pieYearChart.clear()
            pieYearChart.setOption(option)
            window.addEventListener("resize", () => {
                pieYearChart.resize();
            });
        },
        //总负载率比例
        createElecUsageChart: function (data) {
            elecUsageChart = echarts.init(document.getElementById('elecUsageChart'));
            //var data = this.StationStateInfo
            var seriesData = new Array()
            var syzb = 0.0
            if (data.fuzaiView) {
                for (var i = 0; i < data.fuzaiView.length; i++) {
                    var color = ''
                    if (data.fuzaiView[i].zhanbiEvery < 75) {
                        color = '#3ab094'
                    } else if (data.fuzaiView[i].zhanbiEvery >= 75 && data.fuzaiView[i].zhanbiEvery < 80) {
                        color = '#e0d21f'
                    } else if (data.fuzaiView[i].zhanbiEvery >= 80 && data.fuzaiView[i].zhanbiEvery < 85) {
                        color = '#ef7200'
                    } else {
                        color = '#cc0d0d'
                    }
                    var temp = {
                        value: (data.fuzaiView[i].zhanbiEvery).toFixed(2),
                        name: data.fuzaiView[i].CName,
                        itemStyle: {
                            color: color
                        }
                    }
                    syzb += parseFloat(data.fuzaiView[i].zhanbiEvery)
                    seriesData.push(temp)
                }
                seriesData.push({
                    value: (100 - syzb).toFixed(2),
                    name: '可用容量',
                    itemStyle: {
                        color: '#f5f5f5'
                    }
                })
            }
            var option = {
                title: {
                    text: '负载率比例',
                    x: 'center',
                    bottom: 0,
                    textStyle: {  //标题文字设置
                        fontSize: '11',
                        fontWeight: 'normal',
                        color: '#666'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} :<br/> {c}%",
                    textStyle: {
                        fontSize: 10
                    },
                    position: ['0', '50%']
                },
                color: ['#45a790', '#f3763c', '#f3f2f0'],
                series: [
                    {
                        name: '负载率比例',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '40%'],
                        data: seriesData,
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false   //隐藏标示文字
                                },
                                labelLine: {
                                    show: false   //隐藏标示线
                                }
                            }
                        }
                    }
                ]
            };
            elecUsageChart.clear()
            elecUsageChart.setOption(option)
            window.addEventListener("resize", () => {
                elecUsageChart.resize();
            });
        },
        //趋势图
        createLineChart: function (data) {
            lineChart = echarts.init(document.getElementById('lineChart'));
            var xAxis = data.result.xAxis
            for (var i = 0; i < xAxis.length; i++) {
                xAxis[i] = xAxis[i].split(" ")[1]
            }
            var series = new Array();
            for (var i = 0; i < data.result.CName.length; i++) {
                var yData = data.result.yData[i].y
                var item = {
                    name: data.result.CName[i],
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    symbol: 'none',  //这句就是去掉点的  
                    smooth: true,  //这句就是让曲线变平滑的
                    data: yData,//[0, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 0],
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                        ]
                    },
                }
                series.push(item)
            }
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    posoition: ['50%', '50%'],
                    extraCssText: 'width:400px;'
                },
                color: ["#3ab094", "#c3a7cd", "#88a5cf"],
                legend: {
                    data: data.result.CName,//['最大负荷', '最小负荷', '平均负荷'],
                    textStyle: {
                        color: '#a3a3a3',
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    realtime: true,
                }],
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { readOnly: false },
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    },
                    right: '-3px',
                    itemSize: [10],
                    top: 35,
                    orient: 'vertical'
                },
                grid: {
                    top: 50,
                    left: '1%',
                    right: '26px',
                    bottom: 60,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxis,//['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#706d6e',
                                fontSize: '10'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#e9e9e9',

                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        name: 'kW',
                        type: 'value',
                        splitNumber: 5,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#706d6e',
                                fontSize: '10'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#e9e9e9',

                            }
                        }
                    }
                ],
                series: series
            };
            lineChart.clear()
            lineChart.setOption(option)
            window.addEventListener("resize", () => {
                lineChart.resize();
            });
        },

        initSwiper: function () {
            //轮播
            var swiper = new Swiper('.swiper1', {
                //spaceBetween: 3000,
                loop: true,
                autoplay: true,//可选选项，自动滑动
                delay: 5000,
                speed: 1500,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        },
        setWidth: function () {
            $(".ivu-menu-light").scrollTop(1)
            var w = $(".leftMenu").width()
            $(".ivu-menu-light").scroll(function () {
                if ($(".ivu-menu-light").scrollTop() > 0) {
                    $(".ivu-menu-light").width(w + 16)
                }
            });
        }
    },
    beforeMount: function () {
        this.getUnitListData()
    },
    mounted: function () {
        this.setWidth()
        var that = this
        $(window).resize(function () {
            that.setWidth()
        });
        this.initSwiper()
    },
    created: function () {
    }
})