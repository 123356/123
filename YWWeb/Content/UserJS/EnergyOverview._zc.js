new Vue({
    el: "#EnergyOverview",
    data: {
        loading: true,
        info: {},
        uid: null,
        Uname: '',
        curDate: null,
        month: null,
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
            CollTypeID: null,
            EnerUserTypeID: null,
        },
        rules: {
            CollTypeID: [
                { required: true, type: 'number', message: '请选择能源类型', trigger: 'change' }
            ],
            EnerUserTypeID: [
                { required: true, type: 'number', message: '请选择科室', trigger: 'change' }
            ],
        },
        typeList: [],
        departMentList: [],
        comList: [],
        sumBudget: 0,
        left_viewIsShow: true,
        zduibi: null,
        Peozhanbi: null,
        LPeozhanbi: null,
        zongBudget: null,
    },
    methods: {
<<<<<<< HEAD
        toAreaTree: function () {
            $.cookie('UnitData', JSON.stringify({ UnitID: this.uid, UnitName: this.Uname, PDRList: null }), { expires: 7, path: '//EnergyManage/EMSetting/AreaTree' });
=======
        toAreaTree: function() {
            console.log("跳转")
>>>>>>> d085dcc9c92a551559cd0960bb6a96d4b521ac3f
            location.href = '/EnergyManage/EMSetting/AreaTree'
        },
        //类型下拉框
        getCollectDevTypeList: function() {
            var that = this

            this.$http({
                url: '/energyManage/EMHome/GetCollectDevTypeList',
                method: 'get',
            }).then(function(res) {
                that.typeList = res.data
            }).catch(function(e) {
                throw new ReferenceError(e.message)
            })


        },
        //科室下拉框
        getDepartMentList: function() {
            var that = this

            //wwn 2019 02 22
            //this.$http({
            //    url: '/energyManage/EMSetting/GetHistoryList',
            //    method: 'get',
            //}).then(function(res) {
            //    that.departMentList = res.data
            //}).catch(function(e) {
            //    throw new ReferenceError(e.message)
            //})
            this.$http({
                url: "/energyManage/EMSetting/GetHistoryList",
                method: "post",
                body: {
                    unitID: parseInt(that.uid),
                    item_type: 2
                }
            }).then(function (res) {
                console.log(res.data);
                that.departMentList = res.data;
            }).catch(function(e) {
            throw new ReferenceError(e.message)
        })
    },

    //删除能源
    deleteConfig: function(id) {
        var that = this

        this.$http({
                url: '/energyManage/EMHome/DeleteConfig',
                method: 'post',
                params: {
                    ID: id
                }
            })
            .then(function(res) {
                if (res.data > 0) {
                    that.$Message.success('删除成功');
                    that.getEneryOverView()
                } else {
                    that.$Message.warning('删除失败');
                }
            })
            .catch(function(e) {
                throw new ReferenceError(e.message)
            })


    },
    //添加能源
    addConfig: function() {
        var that = this

        this.$http({
                url: '/energyManage/EMHome/AddConfig',
                method: 'post',
                params: {
                    CollTypeID: this.addForm.CollTypeID,
                    EnerUserTypeID: this.addForm.EnerUserTypeID,
                    UID: this.uid,

                }
<<<<<<< HEAD
            });
        },
        modalVisableChange: function (e) {
            if (!e) {
                this.$refs['addForm'].resetFields()
            }
        },
        //添加提交
        addEnergy: function () {
            var that = this
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    that.addConfig()
                    
=======
            })
            .then(function(res) {
                if (res.data > 0) {
                    that.$Message.success('添加成功');
                    that.addModal1Visable = false

                    that.getEneryOverView()
>>>>>>> d085dcc9c92a551559cd0960bb6a96d4b521ac3f
                } else {
                    that.$Message.warning('添加失败');
                }
            })
            .catch(function(e) {

                that.$Message.error('请求失败');
                throw new ReferenceError(e.message)
            })


    },
    //数据加载
    getEneryOverView: function() {
        var that = this
        this.loading = true
        var time = new Date(this.curDate)
        var month = time.getMonth() + 1
        if (month < 10) {
            month = "0" + month
        }
        time = time.getFullYear() + "-" + month


        this.$http({
                url: '/energyManage/EMHome/GetEneryOverView',
                method: 'post',
                params: {
                    uid: this.uid,
                    time: time

                }
            })
            .then(function(res) {
                if (res.data) {


                    for (var i = 0; i < res.data.list.length; i++) {
                        res.data.list[i].pieChart = "pie" + i
                        res.data.list[i].barChart = "bar" + i
                        res.data.list[i].rate = res.data.list[i].rate.toFixed(2)
                        res.data.list[i].energyConsumption = res.data.list[i].energyConsumption.toFixed(2)
                        res.data.list[i].budget = res.data.list[i].budget.toFixed(2)
                    }
                    this.info = res.data
                    this.sumBudget = res.data.list_zong.zongBudget
                    this.zduibi = res.data.list_zong.zduibi
                    this.Peozhanbi = res.data.list_bottom.Peozhanbi
                    this.LPeozhanbi = res.data.list_bottom.LPeozhanbi
                    this.zongBudget = res.data.list_bottom.zongBudget
                    this.bottomInfo = res.data.list_bottom
                    that.creatPowerChart(res.data)
                    if (res.data.left_view.length > 0) {
                        this.creatEnergyMoneyChart(res.data)
                        this.left_viewIsShow = true
                    } else {
                        this.left_viewIsShow = false
                    }


                    var temp = res.data.list
                    if (temp.length > 0) {
                        var timer = setInterval(function() {
                            if ($("#" + temp[0].pieChart).length > 0) {
                                for (var i = 0; i < temp.length; i++) {
                                    if (temp[i].keyValuePairs.length > 0) {
                                        that.createModulePieChart(temp[i].pieChart, temp[i])
                                    }
                                    if (temp[i].keyValuePairs_Time.length > 0) {
                                        that.createModuleBarChart(temp[i].barChart, temp[i])
                                    }

                                }
                                clearInterval(timer)
                            }
                        }, 100)
                    }
<<<<<<< HEAD
                ]
            };
            energyMoneyChart.clear()
            energyMoneyChart.setOption(option)
            window.addEventListener("resize", () => {
                energyMoneyChart.resize();
            });
        },
        createModulePieChart: function (chart, data) {
            for (var i = 0; i < data.keyValuePairs.length; i++) {
                data.keyValuePairs[i].value = data.keyValuePairs[i].value.toFixed(2)
=======
                }
                this.loading = false
            })
            .catch(function(e) {

                that.$Message.error('请求失败');
                this.loading = false
                throw new ReferenceError(e.message)
            })




    },
    closeModule: function(id) {
        var that = this
        this.$Modal.confirm({
            title: '信息提示',
            content: '确定要删除吗？',
            onOk: () => {
                that.deleteConfig(id)
            },
            onCancel: () => {

>>>>>>> d085dcc9c92a551559cd0960bb6a96d4b521ac3f
            }
        });
    },
    modalVisableChange: function(e) {
        if (!e) {
            this.$refs['addForm'].resetFields()
        }
    },
    //添加提交
    addEnergy: function() {
        var that = this
        this.$refs['addForm'].validate((valid) => {
            if (valid) {
                console.log("success")
                that.addConfig()

            } else {
                console.log("error")
            }
        })
    },
    creatPowerChart: function(data) {
        powerChart = echarts.init(document.getElementById('powerChart'));
        var rate = data.list_zong.zongRate.toFixed(2)
        var budget = data.list_zong.zongBudget.toFixed(2)
        var serData = null
        var color = null
        if (rate == 0) {
            serData = [
                { value: budget, name: '预算剩余' },
            ]
            color = ['#f9b88c']
        } else {
            serData = [
                { value: budget, name: '预算剩余' },
                { value: (budget - rate), name: '已用费用' },

            ]
            color = ['#f9b88c', '#58b9a3']
        }


        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}: <br/>{c}万<br/> ({d}%)"
            },
            color: color,
            series: [{
                name: '电量',
                type: 'pie',
                center: ['48%', '52%'],
                radius: ['85%', '62%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,

                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: [
                            '{a|总费用}',
                            '{b|' + rate + '}'
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
                                fontSize: 18,
                            }
                        },

                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: serData
            }]
        };
        powerChart.clear()
        powerChart.setOption(option)
        window.addEventListener("resize", () => {
            powerChart.resize();
        });
    },
    creatEnergyMoneyChart: function(data) {
        energyMoneyChart = echarts.init(document.getElementById('energyMoneyChart'));
        var legend = new Array()
        for (var i = 0; i < data.left_view.length; i++) {
            data.left_view[i].value = data.left_view[i].value.toFixed(2)
            legend.push(data.left_view[i].name)
        }
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c}万<br/> ({d}%)"
            },
            color: ['#4c5661', '#38a6cf', '#58b9a3', '#fab98c', '#d0747c'],
            legend: {
                orient: 'horizontal',
                x: 'center',
                bottom: '5%',
                data: legend,
                itemWidth: 13,
                textStyle: {
                    fontSize: 10
                },
                borderRadius: 0

            },

            series: [{
                name: '费用比例',
                type: 'pie',
                center: ['48%', '44%'],
                radius: ['66%', '48%'],
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
                data: data.left_view
            }]
        };
        energyMoneyChart.clear()
        energyMoneyChart.setOption(option)
        window.addEventListener("resize", () => {
            energyMoneyChart.resize();
        });
    },
    createModulePieChart: function(chart, data) {
        console.log(data)
        for (var i = 0; i < data.keyValuePairs.length; i++) {
            data.keyValuePairs[i].value = data.keyValuePairs[i].value.toFixed(2)
        }
        chart = echarts.init(document.getElementById(chart));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}: <br/>{c} <br/>({d}%)",
                position: ['left', 'top']
            },
            color: ['#f9b88c', '#58b9a3', '#d0737b'],
            series: [{
                name: data.name,
                type: 'pie',
                radius: ['90%', '60%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: function(arg) {
                            var html = data.rate;
                            return html
                        },
                        textStyle: {
                            color: '#525252',
                            fontSize: 13,
                            fontFamily: "sans-serif",
                            fontWeight: 100
                        }

                    },


<<<<<<< HEAD
                            axisLabel: { //调整y轴的lable  
                                textStyle: {
                                    fontSize: 9,// 让字体变大
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
                            name: '能耗费用',
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
            chart.setOption(option)
            window.addEventListener("resize", () => {
                chart.resize();
                
            });
        },
        datePicekChange: function (e) {
            var time = e.substring(0, 7)
            this.month = time.split("-")[1]
            this.curDate = time
            this.getEneryOverView()
=======
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data.keyValuePairs
            }]
        };
        chart.setOption(option)
        window.addEventListener("resize", () => {
            chart.resize();

        });
    },
    createModuleBarChart: function(data, data) {
        var chart = data.barChart
        var xData = new Array()
        var yData = new Array()
        for (var i = 0; i < data.keyValuePairs_Time.length; i++) {
            xData.push(data.keyValuePairs_Time[i].name.split(" ")[0].split("/")[2])
            yData.push(data.keyValuePairs_Time[i].value)
>>>>>>> d085dcc9c92a551559cd0960bb6a96d4b521ac3f
        }
        chart = echarts.init(document.getElementById(chart));
        var option = {
            title: {
                text: this.month + '月' + data.name + '消耗图(万元)',
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
                formatter: "{a}: <br/>" + this.month + "-{b}:{c}",
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
                itemSize: 9,
                itemGap: 1,
                right: 20
            },
            grid: {
                top: 25,
                left: '3%',
                right: 0,
                bottom: 0,
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xData,

                axisLine: {
                    lineStyle: {
                        color: '#57b9a3', //x轴线颜色
                        width: '0.7'
                    },
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true
                },

                axisLabel: { //调整y轴的lable  
                    textStyle: {
                        fontSize: 9, // 让字体变大
                        color: '#9f9d9d'
                    }
                },
            }],
            yAxis: [{
                type: 'value',
                name: 'kW·h',
                axisLine: {
                    lineStyle: {
                        color: '#57b9a3', //x轴线颜色
                        width: '0.7'
                    },
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true
                },

                axisLabel: { //调整y轴的lable  
                    textStyle: {
                        fontSize: 9, // 让字体变大
                        color: '#9f9d9d'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ededed'
                    }
                },
            }],
            series: [{
                name: '能耗费用',
                type: 'bar',
                barWidth: '50%',
                data: yData
            }],
            dataZoom: [{
                type: 'inside'
            }]
        };
        chart.setOption(option)
        window.addEventListener("resize", () => {
            chart.resize();

        });
    },
<<<<<<< HEAD
    beforeMount: function () {
        var that = this
        var id = $.cookie("enUID")
        if (id!=null) {
            this.uid = id
            this.Uname = $.cookie("enUName")
        }
        var date = new Date()
        this.month = (date.getMonth() + 1)
        var month = (date.getMonth() + 1)
        if (month < 10) {
            month = "0"+month
        }
        this.curDate = date.getFullYear() + "-" + month
        this.getCollectDevTypeList()
        this.getDepartMentList()
=======
    datePicekChange: function(e) {
        var time = e.substring(0, 7)
        this.month = time.split("-")[1]
        console.log(time)
        this.curDate = time
>>>>>>> d085dcc9c92a551559cd0960bb6a96d4b521ac3f
        this.getEneryOverView()
    }







},
beforeMount: function() {
    var that = this
    var id = $.cookie("enUID")
    if (id != null) {
        this.uid = id
        this.Uname = $.cookie("enUName")
        window.localStorage.setItem('UnitData', JSON.stringify({ UnitID: this.uid, UnitName: this.Uname }))
    }
    var date = new Date()
    this.month = (date.getMonth() + 1)
    var month = (date.getMonth() + 1)
    if (month < 10) {
        month = "0" + month
    }
    this.curDate = date.getFullYear() + "-" + month
    this.getCollectDevTypeList()
    this.getDepartMentList()
    this.getEneryOverView()
},
mounted: function() {



}
})