﻿new Vue({
    el: "#app",
    data: {
        loading: true,
        UID: null,
        UName: null,
        listWidth: 0,
        chartHeight: 0,
        tableHeight: 0,
        dateType: 0,
        tableCol: [

            {
                title: '区域',
                align: 'center',
                key: 'Name',
            },
            {
                title: '能耗费用(元)',
                align: 'center',
                key: 'DValue',
                sortable: true,
                sortType: "desc"
            },
            {
                title: '建筑面积(㎡)',
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
        time: new Date(),
        DID: null,//科室ID
        isUnitSelect: 0,
        departName: null,
        treeData: [],
        userButtons: [],
        EneryUserTypeID: []
    },
    methods: {
        //设置树下拉框
        getSelectTree: function () {
            var arr = []
            arr.push(this.treeData)
            var that = this
            $("#leftmenuSpace").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding'><input data-options='lines:true' style='width: 200px; height: 30px;' id='StationID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
            $('#StationID').combotree({
                data: arr,
                multiple: true,
                editable: false,
                panelMinHeight: 300,
                onBeforeSelect: function (node) {
                    if (!$(this).tree('isLeaf', node.target)) {
                        $('#StationID').combotree('tree').tree("expand", node.target); //展开
                        return false;
                    }
                },
                onClick: function (node) {
                    if (!$(this).tree('isLeaf', node.target)) {
                        $('#StationID').combo('showPanel');

                    } else {
                        that.isUnitSelect = node.id
                    }
                    
                },
                onChange: function (newvla, oldval) {
                    that.EneryUserTypeID = newvla
                    
                },

                onLoadSuccess: function (node, data) {
                    console.log(that.EneryUserTypeID)
                    if (that.EneryUserTypeID.length>0) {
                        $("#StationID").combotree("setValue", that.EneryUserTypeID);
                    } else {
                        var arr = []
                        for (var j in data) {
                            arr.push(data[j].id)
                        }
                        $("#StationID").combotree("setValues", arr);
                        var tree =$('#StationID').combotree('tree')
                        var nodes = tree.tree('getChecked');
                        var nodeArr = []
                        for (var j in nodes) {
                            nodeArr.push(nodes[j].id)
                        }
                        that.EneryUserTypeID = nodeArr
                    }
                    that.getEneryView()


                }
            })
        },
        //遍历树
        foreachTree: function (node) {
            if (!node) {
                return;
            }
            node.text = node.name
            node.children = node.Children
            node.id = node.ID
            if (node.Children && node.Children.length > 0) {
                for (var i = 0; i < node.Children.length; i++) {
                    if (!node.Children[i].Children) {
                        node.Children[i].text = node.Children[i].name
                        node.Children[i].children = node.Children[i].Children
                        node.Children[i].id = node.Children[i].ID
                    }
                    this.foreachTree(node.Children[i]);
                }
            } else {
                if (node.ID != 0 && this.isUnitSelect == 0) {
                    this.isUnitSelect = node.ID
                    this.departName = node.name
                }
            }
        },
        // 区域树
        getTreeData: function () {
            var that = this
            var par = {
                UnitID: that.UID,
                ItemType: 2,
                UnitName: that.UName
            }
            getEnergyTreeAPI(par).then(function (res) {
                var data = res.data[0]
                that.foreachTree(data)
                that.treeData = data
                that.getSelectTree()
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            
                
        },
        //显示数据
        showInfo: function () {
            this.getEneryView()
        },
        //获取数据
        getEneryView: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetEneryView',
                method: 'post',
                body: {
                    uid: that.UID,
                    time: that.formaterDate(),
                    depids: [...that.EneryUserTypeID].join(',')
                }
            })
                .then(function (res) {
                    that.tableData = res.data
                    that.createBarChart(res.data)
                })
                .catch(function (e) {

                    throw new ReferenceError(e.message)
                })
                .finally(function () {
                    that.loading = false
                })
        },
        dateChange: function () {
            this.loading = true
            this.getEneryView()
        },
        formaterDate: function () {
            var date = new Date(this.time)
            date = date.toLocaleDateString().replace(/\//g, "-") + " "
            return date
        },
        //创建图表
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
                    text: '12月电费能让消耗图(元)',
                    show: false,
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
                        dataView: {
                            show: true,
                            readOnly: false,
                            optionToContent: function (opt) {
                                var axisData = opt.xAxis[0].data;
                                var series = opt.series;
                                var tdHeads = '<td  style="padding:0 10px">区域</td>';
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
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    },
                    itemSize: 10,
                    itemGap: 1,
                    right: 20,
                },
                grid: {
                    top: 30,
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
                            },
                            rotate: 50
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '元',
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
                        name: '能耗费用(元)',
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
        },
        //操作按钮
        getUserBtn: function () {
            var that = this
            var url = window.location.pathname;
            getUserBtnAPI(url).then(function (res) {
                that.userButtons = res.data
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
            
        },
        userBtnClick: function (method) {
            switch (method) {
                case "SaveForm()":
                    this.save()
                    break
            }
        },
        //保存权限
        save: function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/AddOrUpdateLookConfig',
                method: 'POST',
                body: {
                    UID: this.UID,
                    EneryUserTypeID: [...this.EneryUserTypeID].join(',')
                }
            })
            .then(function (res) {
                that.$Message.success('保存成功');
                that.getEneryView()
            })
            .catch(function (e) {
                that.$Message.success('保存失败');
                throw new ReferenceError(e.message)
            })
        },
        //获取权限
        getLookEneryConfig : function () {
            var that = this
            this.$http({
                url: '/energyManage/EMHome/GetLookEneryConfig',
                method: 'POST',
                body: {
                    uid: this.UID,
                }
            })
                .then(function (res) {
                    if (res.data) {
                        if (res.data.EneryUserTypeID) {
                            that.EneryUserTypeID = res.data.EneryUserTypeID.split(',')
                        }
                    }
                    that.getTreeData()
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        getUnitData: function () {
            var unitData = JSON.parse(localStorage.getItem("UnitData"))
            if (unitData) {
                this.UID = unitData.enUID
                this.UName = unitData.enName
            }
        }
    },
    beforeMount: function () {
        this.getUnitData()
      //  this.getEneryView()
        var that = this
        this.setHeight()
        setInterval(function () {
            that.tableHeight = $(".main-item .con").height()
        }, 100)
        this.getLookEneryConfig()
    },
    mounted: function () {
       
        this.getUserBtn()
    }
})
