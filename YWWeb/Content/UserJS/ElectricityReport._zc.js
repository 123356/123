var vm = new Vue({
    el: "#app",
    data: {
        lineLoading: true,
        pie1Loading: true,
        pie2Loading: true,
        pie3Loading: true,
        bar1Loading: true,
        tableLoading: true,
        UID: null,
        UName: null,
        isUnitAreaSelect: [],//当前选中区域IDs
        isUnitElecSubSelect: [],//当前选中用电分项IDs
        dateType: 1,//日期类型
        bindDateType: 'date',//控件绑定日期类型
        time: null,
        labelData: [],//标签
        label: [],
        typeList: [],//能源类型
        CollTypeID: null,//能源类型
        lineChart: null,
        lineChartType: '1',//总趋势类型,
        daterangeShow: false,
        barChart: null,
        curTimeStr: null,
        times: [],//报表时间col
        list_item: null,//分项报表数据
        list_area: null,//区域报表数据
        itemHJ: [],
        itemTotal: 0,
        areaHJ: [],
        areaTotal: 0,
        lineImg: null,
        pie1Chart: null,
        pie2Chart: null,
        pie3Chart: null,
        modalVisable: false,
        userBtn: [],
        zongRate: null,
        zongBudget: null,
        zduibi: null,
        Peozhanbi: null,
        LPeozhanbi: null,
        titleMonth: null,
        dateRange: [],
        moduleTitle: '昨天用电',
        areaOrItem: '1',
        enTypeName:'电',
    },
    filters: {
        isnull: function (e) {
            if (!e) {
                return '--'
            } else {
                return e
            }
        },
        toMoney: function (num) {
            if (num == null || num == undefined) {
                return '--'
            }
            num = parseFloat(num).toFixed(2)
            num = num.toLocaleString();
            return num;//返回的是字符串23,245.12保留2位小数
        },
    },
    methods: {
        toMoney: function (num) {
            if (num == null || num == undefined) {
                return '--'
            }
            num = parseFloat(num).toFixed(2)
            num = num.toLocaleString();
            return num;//返回的是字符串23,245.12保留2位小数
        },
        //设置组织区域树树下拉框
        getSelectTree: function (type) {
            var arr = []
            var that = this
            var id = ""
            if (type == 1) {
                arr.push(this.elecSubItemTree)
                id = "elecID"
                $("#ElecSubTree").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding' ><input data-options='lines:true' style='width: 200px; height: 30px;' id='elecID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
            } else {
                arr.push(this.areaTree)
                id = "DID"
                $("#areaTree").html("<div class='leftmenu' id='leftmenu2'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding' ><input data-options='lines:true' style='width: 200px; height: 30px;' id='DID' /></div><div><ul class='one' id='menuinfo2'></ul></div></div></div>");
            }
            $('#' + id).combotree({
                data: arr,
                multiple: true,
                editable: true,
                panelMinHeight: 300,
                onBeforeSelect: function (node) {
                    if (!$(this).tree('isLeaf', node.target)) {
                        $('#' + id).combotree('tree').tree("expand", node.target); //展开
                        return false;
                    }
                },
                onClick: function (node) {
                    if (!$(this).tree('isLeaf', node.target)) {
                        $('#' + id).combo('showPanel');

                    } else {
                    }
                },
                onLoadSuccess: function (node, data) {
                    
                    if (type == 1) {
                        var tree = $('#elecID').combotree('tree');
                        var root = tree.tree('getRoot');
                        var children = tree.tree('getChildren', root.target);
                        var arr = []
                        for (var i in children) {
                            if (i < 10) {
                                arr.push(children[i].ID)
                            } else {
                                break
                            }
                        }
                        $("#elecID").combotree("setValues", arr);
                        that.isUnitElecSubSelect = arr
                       

                    } else {
                        var tree = $('#DID').combotree('tree');
                        var root = tree.tree('getRoot');
                        var children = tree.tree('getChildren', root.target);
                        var arr = []
                        for (var i in children) {
                            if (i < 10) {
                                arr.push(children[i].ID)
                            } else {
                                break
                            }
                        }
                        $("#DID").combotree("setValues", arr);
                        that.isUnitAreaSelect = arr
                    }
                    if (that.isUnitAreaSelect.length > 0 && that.isUnitElecSubSelect.length > 0) {
                        vm.initPowerQualityData()
                        //vm.getZongData()
                        //vm.getReport()
                    }
                },
                onChange: function (newval, oldval) {
                    if (type == 1) {
                        that.isUnitElecSubSelect = newval
                    } else {
                        that.isUnitAreaSelect = newval
                    }
                }
            })
        },
        dateChange: function () {
            this.getTableData()
        },
        //遍历树
        foreachTree: function (node, type) {
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
                    this.foreachTree(node.Children[i], type);
                }
            } else {
                var val = 0
                if (type == 1) {
                    val = this.isUnitElecSubSelect.length
                } else {
                    val = this.isUnitAreaSelect.length
                }

                if (node.id != 0 && val == 0) {
                    if (type == 1) {
                        //this.isUnitElecSubSelect.push(node.id)
                    } else {
                        // this.isUnitAreaSelect.push(node.id)
                    }

                    this.departName = node.name
                }
            }
        },
        // 组织区域/用电分项树
        getTreeData: function (type) {
            this.treeType = type
            var params = {
                UnitID: this.UID,
                ItemType: type,
                UnitName: this.UName
            }
            getEnergyTreeAPI(params)
            .then(function (res) {
                var data = res.data[0]
                vm.foreachTree(data, type)
                if (type == 1) {
                    vm.elecSubItemTree = data
                } else {
                    vm.areaTree = data
                }
                vm.getSelectTree(type)
            }).catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //标签下拉框
        getLabelData: function () {
            var params = {
                uid: this.UID
            }
            getLabelListAPI(params).then(function (res) {
                vm.labelData = res.data
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        //类型下拉框
        getCollectDevTypeList: function () {
            getCollectDevTypeListAPI().then(function (res) {
                vm.typeList = res.data
                if (res.data.length > 0) {
                    vm.CollTypeID = res.data[0].ID
                    vm.enTypeName = res.data[0].Name
                }
               
            }).catch(function (e) { throw new ReferenceError(e.message) })
        },

        //总趋势chart
        createLineChart: function (data) {
            var legend = data.CName
            var xAxis = data.xAxis.split(',')
            var series = []
            for (var i in data.yData) {
                series.push({
                    name: legend[i],
                    type: 'bar',
                   
                    stack: '总趋势',
                    areaStyle: {},
                    data: data.yData[i].split(','),
                    smooth: true,
                    //markPoint: {
                    //    data: [
                    //        { type: 'max', name: '最大值' },
                    //        { type: 'min', name: '最小值' }
                    //    ]
                    //},
                })
            }
            var yName = ''
            switch (this.CollTypeID) {
                case 1:
                    yName = 'kW·h'
                    break
                default:
                    yName = 'm³'
                    break
                
            }
            lineChart = echarts.init(document.getElementById('lineChart'));
            var option = {

                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: legend,
                    textStyle: {
                        color: "rgb(0, 0, 0)"
                    },
                    padding:[0,10,0,150],
                    borderColor: "#ccc",
                    type: 'scroll',
                    top: '10'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none',
                            title: { back: '' },
                            icon: { back: 'image://' }
                        },
                        restore: {
                            show: true
                        },
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: true
                        },
                        magicType: {
                            show: true,
                            type: ["line", "bar", "stack", "tiled"]
                        },

                        saveAsImage: {
                            show: true
                        }

                    },
                    top: "50",
                    right: "10",
                    orient: "vertical",

                    showTitle: true,
                    optionToContent: function (opt) {
                        let axisData = opt.xAxis[0].data; //坐标数据
                        let series = opt.series; //折线图数据
                        let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                        let tdBodys = ''; //数据
                        series.forEach(function (item) {
                            //组装表头
                            tdHeads += '<td style="padding: 0 10px">' + item.name + '</td>';
                        });
                        let table = '<div style="  display: block; width: 100%; overflow: auto; height: 270px;overflow-x:hidden"><table border="1" style="border-collapse:collapse;font-size:14px;text-align:center;width:100%"><tbody><tr>' + tdHeads + ' </tr>';
                        for (let i = 0, l = axisData.length; i < l; i++) {
                            for (let j = 0; j < series.length; j++) {
                                //组装表数据
                                tdBodys += '<td>' + series[j].data[i] + '</td>';
                            }
                            table += '<tr><td style="padding: 0 10px">' + axisData[i] + '</td>' + tdBodys + '</tr>';
                            tdBodys = '';
                        }
                        table += '</tbody></table></div>';
                        return table;
                    }
                },
                color: ['#54ab88', '#ca9a5c', '#cd574b', '#b8a875'],
                grid: {
                    left: 40,
                    right: 50,
                    bottom: 80,
                    top: 50,
                    borderWidth: 0
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: xAxis,
                        axisLabel: {
                            rotate: 30
                        },
                    }
                ],
                yAxis: [
                    {
                        name: yName,
                        type: 'value'
                    }
                ],
                series: series,
                dataZoom: [{
                    type: 'inside',
                    filterMode: 'filter'
                }],
            };
            lineChart.clear()
            lineChart.setOption(option)
            lineImg = new Image()
            this.lineImg = lineChart.getDataURL()
            window.addEventListener("resize", () => {
                lineChart.resize();
            });
        },
        //饼图
        createPie1Chart: function (data) {
            pie1Chart = echarts.init(document.getElementById("pie1Chart"))
            var subtext = 'kW·h'
            switch (this.CollTypeID) {
                case 1:
                    subtext = 'kW·h'
                    break
                default:
                    subtext = 'm³'
                    break
            }
            var option = {
                title: {
                    text: parseFloat(data.total).toFixed(2),
                    subtext: subtext,
                    x: 'center',
                    y: '48%',
                    textStyle: {
                        color: '#525252',
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params, ticket, callback) {
                        return params.name + "：<br/>" + vm.toMoney(params.value)
                    },
                },
                color: ['#f9b88c', '#58b9a3', '#d0737b'],
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    bottom: 0,
                    data: data.yAxis,
                    itemWidth: 13,
                    textStyle: {
                        fontSize: 10
                    },
                    borderRadius: 0,
                    type: 'scroll'
                },
                series: [{
                    name: this.moduleTitle +'分项统计',
                    type: 'pie',
                    center: ['50%', '55%'],
                    radius: ['55%', '78%'],
                    hoverAnimation: false,


                    data: data.series1
                }]
            };
            pie1Chart.clear()
            pie1Chart.setOption(option)
            window.addEventListener("resize", () => {
                pie1Chart.resize();
            });

        },
        createPie2: function (data) {
            pie2Chart = echarts.init(document.getElementById('pie2Chart'));
            var rate = data.list_zong.zongRate
            var budget = data.list_zong.zongBudget
            var serData = null
            var color = null
           
            if (rate == 0) {
                serData = [
                    { value: budget, name: '预算剩余' },
                ]
                color = ['#e0e0e0']

            } else if (budget - rate < 0) {
                serData = [
                    { value: rate, name: '已用费用' },
                ]
                color = ['#ca9a5c']
            }
            else {
                serData = [
                    { value: rate, name: '已用费用' },
                    { value: budget - rate, name: '预算剩余' },

                ]
                color = ['#ca9a5c', '#e0e0e0']
            }
            
            var that = this
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params, ticket, callback) {
                        return params.name + "：<br/>" + that.toMoney(params.value)
                    },
                },
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    bottom: 0,

                    data: ['预算剩余', '已用费用'],
                    itemWidth: 13,
                    textStyle: {
                        fontSize: 10
                    },
                    borderRadius: 0
                },
                color: color,
                series: [{
                    name: '电量',
                    type: 'pie',
                    center: ['50%', '43%'],
                    radius: ['60%', '82%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: [
                                '{a|总预算(万元)}',
                                '{b|' + this.toMoney(budget) + '}'
                            ].join('\n'),
                            rich: {
                                a: {
                                    color: '#525252',
                                    lineHeight: 20,
                                    fontSize: 16,
                                },
                                b: {
                                    color: '#525252',
                                    lineHeight: 30,
                                    fontSize: 16,
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
            pie2Chart.clear()
            pie2Chart.setOption(option)
            window.addEventListener("resize", () => {
                pie2Chart.resize();
            });
        },
        createPie3: function (data) {
            pie3Chart = echarts.init(document.getElementById('pie3Chart'));
            var legend = new Array()
            var sumTotal = 0
            for (var i = 0; i < data.left_view.length; i++) {
                sumTotal += parseFloat(data.left_view[i].value)
                legend.push(data.left_view[i].name)
            }
            var that = this
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params, ticket, callback) {
                        return params.name + "：<br/>" + that.toMoney(params.value)
                    },
                },
                color: ['#4c5661', '#38a6cf', '#58b9a3', '#fab98c', '#d0747c'],
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    bottom: 0,
                    data: legend,
                    itemWidth: 13,
                    textStyle: {
                        fontSize: 10
                    },
                    borderRadius: 0,
                    type: 'scroll'
                },
                series: [{
                    name: '费用比例',
                    type: 'pie',
                    center: ['50%', '43%'],
                    radius: ['60%', '82%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: [
                        '{a|总费用(万元)}',
                        '{b|' + this.toMoney(sumTotal) + '}'
                            ].join('\n'),
                            rich: {
                                a: {
                                    color: '#525252',
                                    lineHeight: 20,
                                    fontSize: 16,
                                },
                                b: {
                                    color: '#525252',
                                    lineHeight: 30,
                                    fontSize: 16,
                                }
                            },
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data.left_view
                }]
            };
            pie3Chart.clear()
            pie3Chart.setOption(option)
            window.addEventListener("resize", () => {
                pie3Chart.resize();
            });
        },
        //柱状图
        createBarChart: function (data) {
            var yAxis = []
            var series = []
            var legend = []
            switch (parseInt(this.dateType)) {
                case 1:
                    legend = ['昨天', '上月同期']
                    break
                case 2:
                    legend = ['上月', '去年同期']
                    break
                case 3:
                    legend = ['去年', '去年同期']
                    break
              
            }
            yAxis = data.yAxis.split(',')
            series.push(
                {
                    name: legend[0],
                    type: 'bar',
                    data: data.series1.split(',')
                }
            )
            series.push(
                {
                    name: legend[1],
                    type: 'bar',
                    data: data.series2.split(',')
                }
            )
            var yName = ''
            switch (this.CollTypeID) {
                case 1:
                    yName = 'kW·h'
                    break
                default:
                    yName = 'm³'
                    break

            }
            barChart = echarts.init(document.getElementById('barChart'));
            var option = option = {

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    top: 0,
                    data: legend,
                    itemWidth: 13,
                    textStyle: {
                        fontSize: 10
                    },
                    borderRadius: 0,
                    type: 'scroll'
                },
                color: ['#54ab88', '#ca9a5c', '#cd574b', '#b8a875'],
                grid: {
                    left: '3%',
                    right: '50',
                    bottom: '3%',
                    top: 30,
                    containLabel: true
                },
                xAxis: {
                    name: yName,
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    name: '回路',
                    type: 'category',
                    data: yAxis
                },
                series: series,

            };

            barChart.clear()
            barChart.setOption(option)
            window.addEventListener("resize", () => {
                barChart.resize();
            });

        },

        getTimes: function () {
            var arr = []
            switch (this.dateType) {
                case 1:
                    for (var i = 1; i < 25; i++) {
                        if (i < 10) {
                            arr.push("0" + i + ":00")
                        } else {
                            arr.push(i + ":00")
                        }
                    }
                    this.times = arr
                    break
                case 2:
                    var temp = new Date(this.time)
                    temp = new Date(temp.getFullYear(), (temp.getMonth() + 1), 0)
                    var col = temp.getDate()
                    for (var i = 1; i <= col; i++) {
                        arr.push(i)
                    }
                    this.times = arr
                    break
                case 3:
                    for (var i = 1; i < 13; i++) {
                        arr.push(i)
                    }
                    this.times = arr
                    break
            }

        },

        //总用数据
        getPowerQualityData: function (type) {
            switch (parseInt(this.dateType)) {
                case 1:
                    this.moduleTitle = '昨天用' + (this.enTypeName == null ? '--' : this.enTypeName)
                    break
                case 2:
                    this.moduleTitle = '上月用' +( this.enTypeName == null ? '--' : this.enTypeName)
                    break
                case 3:
                    this.moduleTitle = '去年用' + (this.enTypeName == null ? '--' : this.enTypeName)
                    break
            }
            var url = ''
            switch (type) {
                case 'pie':
                    url = '/ReportForms/GetElectricityConsumptionReport_FX'
                    break
                case 'bar':
                    url = '/ReportForms/GetElectricityConsumptionReport_PM'
                    break
                case 'line':
                    url = '/ReportForms/GetElectricityConsumptionReport_SSQX '
                    break
            }
            this.$http({
                url: url,
                method: 'post',
                body: {
                    itemids: this.isUnitElecSubSelect.join(','),
                    areaids: this.isUnitAreaSelect.join(','),
                    TimeDate: this.formaterDate(),
                    TimeType: this.dateType,
                    type: this.areaOrItem,
                    uid: this.UID,
                    labels: this.label.join(','),
                    coType:this.CollTypeID
                   
                }
            })
            .then(function (res) {
                switch (type) {
                    case 'pie':
                        vm.createPie1Chart(res.data)
                        vm.pie1Loading = false
                        break
                    case 'bar':
                        vm.createBarChart(res.data)
                        vm.bar1Loading = false
                        break
                    case 'line':
                        vm.createLineChart(res.data)
                        vm.lineLoading = false
                        break
                }

            })
            .catch(function () {
                switch (type) {
                    case 'pie':
                        vm.pie1Loading = false
                        break
                    case 'bar':
                        vm.bar1Loading = false
                        break
                    case 'line':
                        vm.lineLoading = false
                        break
                }
            }).finally(function () {
                if (vm.pie1Loading == false&&vm.bar1Loading == false&&vm.lineLoading ==false){
                    vm.getZongData()
                    vm.getReport()
                }
                
            })

        },
        setLoading: function () {

        },
        enTypeChange:function(e){
            this.enTypeName = e.label
        },
        //能源总览饼图数据
        getZongData: function () {
            this.$http({
                url: '/energyManage/EMHome/GetZongData',
                method: 'POST',
                body: {
                    uid: this.UID,
                    time: this.formaterDate()
                }
            }).then(function (res) {
                try {
                    vm.zongRate = res.data.list_zong.zongRate
                    //vm.zongBudget =res.data.list_zong.zongBudget
                    vm.zduibi = res.data.list_zong.zduibi
                    vm.Peozhanbi = res.data.list_bottom.Peozhanbi
                    vm.LPeozhanbi = res.data.list_bottom.LPeozhanbi
                } catch (err) { }

                vm.createPie2(res.data)
                vm.createPie3(res.data)
            })
            .finally(function () {
                vm.pie2Loading = false
            })
        },
        //报表数据
        getReport: function () {
            var that = this
            var params = {
                uid: this.UID,
                itemids: [...this.isUnitElecSubSelect].join(','),
                areaids: [...this.isUnitAreaSelect].join(','),
                type: this.dateType,
                time: this.formaterDate(),
                lables: [...this.label].join(',')
            }
            getBuildReportAPI(params).then(function (res) {
                var data = res.data
                for (var i in data.list_item) {
                    var count = 0
                    for (var j in data.list_item[i].Value) {
                        count += isNaN(parseFloat(data.list_item[i].Value[j])) ? 0 : parseFloat(data.list_item[i].Value[j])
                    }
                    data.list_item[i].count = count.toFixed(2)
                }
                for (var i in data.list_area) {
                    var count = 0
                    for (var j in data.list_area[i].Value) {
                        count += isNaN(parseFloat(data.list_area[i].Value[j])) ? 0 : parseFloat(data.list_area[i].Value[j])
                    }
                    data.list_area[i].count = count.toFixed(2)
                }
                that.list_item = data.list_item
                that.list_area = data.list_area
                that.totalCom(data.list_item, 1)
                that.totalCom(data.list_area, 2)
            })
            .catch(function (e) {
            })
            .finally(function () {
                that.tableLoading = false
            })


        },
        totalCom: function (data, type) {
            var sumTotal = 0
            var xTotal = []
            var arr = []
            for (var i in data) {
                arr.push(data[i].Value)
                for (var j in data[i].Value) {
                    sumTotal += isNaN(parseFloat(data[i].Value[j])) ? 0 : parseFloat(data[i].Value[j])
                }
            }
            var col = 0
            switch (this.dateType) {
                case 1:
                    col = 24
                    break
                case 2:
                    var temp = new Date(this.time)
                    temp = new Date(temp.getFullYear(), (temp.getMonth() + 1), 0)
                    col = temp.getDate()
                    break
                case 3:
                    col = 12
                    break
            }
            for (var h = 0; h < col; h++) {
                var count = 0
                for (var i in arr) {
                    for (var j in arr[i]) {
                        if (h == j) {
                            count += isNaN(parseFloat(arr[i][j])) ? 0 : parseFloat(arr[i][j])
                        }
                    }
                }
                xTotal.push({
                    "index": h,
                    "val": count.toFixed(2)
                })
            }


            if (type == 1) {
                this.itemHJ = xTotal
                this.itemTotal = sumTotal.toFixed(2)
            } else {
                this.areaHJ = xTotal
                this.areaTotal = sumTotal.toFixed(2)
            }


        },
        radioChange: function (e) {
            this.lineLoading=true
            this.pie1Loading=true
            this.bar1Loading=true
            this.initPowerQualityData()

        },
        dateRangeChange: function () {
            this.initPowerQualityData()
        },
        formaterDate: function () {
            var date = new Date(this.time)
            this.titleMonth = date.getFullYear() + "年" + (date.getMonth() + 1) + "月"
            var month = date.getMonth() + 1
            var day = date.getDate()
            if (month < 10) {
                month = "0"+month
            }
            if (day < 10) {
                day ="0"+ady
            }
            if (this.dateType == 1) {
                
                date = date.getFullYear()+"-"+month+"-"+day
            } else if (this.dateType == 2) {
                date = date.getFullYear() + "-" + month
            } else {
                date = date.getFullYear()
            }

            return date
        },
        //打印  or 导出
        openOrPrint: function () {
            this.getHtmlTemp()
        },
        getHtmlTemp: function () {
            this.modalVisable = true
            var html = '<div class="noprint reportCon " id="printCon">'

                + ' <div class="row"><div class="module"><div class="module-title "><img src="/Content/images/energyDifficiency/fx.png" class="icon" /><span>' + this.titleMonth + '能源总费用(万元)</span>'
            + '</div>'
            + '<div class="con"><div class="item"><img src="' + pie2Chart.getDataURL() + '" /></div>'
            + '<div class="item rightItem"><div><b>20.5332</b><p>已用费用(万)</p></div>'
            + '<div><b>12%</b><p>同期对比</p></div></div></div></div>'
            + ' <div class="module"><div class="module-title "><img src="/Content/images/energyDifficiency/fx.png" class="icon" /><span>' + this.titleMonth + '能源总费用比例(万元)</span></div>'
            + ' <div class="con"><div class="item"><img src="' + pie3Chart.getDataURL() + '" /></div>'
            + ' <div class="item rightItem"><div><b>0.65</b><p>平米能耗(元/㎡)</p></div>'
           + '<div><b>5%</b><p>同期对比</p></div></div></div></div></div>'

           + '<div class="lineChartView">'
                + '<div class="module-title "><img src="/Content/images/energyDifficiency/fx.png" class="icon" /><span>总用电趋势</span>'
               + '</div>'
               + '<div class="chart noprint">'
               + '<img src="' + lineChart.getDataURL() + '" style="width:100%"/>'
                + '</div>'
           + '</div>'
           + '<div class="row">'
            + '<div class="module">'
           + '<div class="module-title "><img src="/Content/images/energyDifficiency/fx.png" class="icon" /><span>' + this.moduleTitle + '</span>'
           + ' </div>'
           + '<div class="con">'
            + '<img src="' + pie1Chart.getDataURL() + '" class="firstPieImg"/>'
                          + ' </div>'
                      + ' </div>'
                    + '  <div class="module">'
                          + '<div class="module-title "><img src="/Content/images/energyDifficiency/fx.png" class="icon" /><span>' + this.moduleTitle + '能耗排名</span></div>'
           + '<div class="con">'
            + '<img src="' + barChart.getDataURL() + '" />'

                     + '</div>'
                     + ' </div>'
                 + ' </div>'

            + '</div>'
            html += $("#buildReport").html()

            var div = document.createElement("div")
            var id = document.createAttribute('id')
            id.value = 'tempView'
            div.setAttributeNode(id)
            div.innerHTML = html
            $("#printModal").html(div.innerHTML)

        },
        ok: function () {
            $("#printModal").jqprint({
                debug: false,  //是否显示iframe查看效果
                importCSS: true,
                printContainer: true,
                operaSupport: false
            })
        },
        dateTypeChange: function (e) {
           
            switch (parseInt(e)) {
                case 1:
                    vm.bindDateType = 'date'
                    break;
                case 2:
                    vm.bindDateType = 'month'
                    break
                case 3:
                    vm.bindDateType = 'year'
                    break;
            }
            //this.getTableData()
        },
        dateChange: function (e) {
        },
        getUserBtn: function () {
            getUserBtnAPI(window.location.pathname)
            .then(function (res) {
                var data = res.data
                for (var i in data) {
                    switch (data[i].ModuleName) {
                        case '查 询':
                            data[i].icon = "ios-search"
                            break
                        case '打 印':
                            data[i].icon = "ios-print-outline"
                            break
                        case '导出':
                            data[i].icon = "ios-download-outline"
                            break
                    }
                }
                vm.userBtn = res.data
            })
        },
        userBtnClick:function(location) {
            switch (location) {
                case "dosearch()":
                    this.curTimeStr = this.formaterDate()
                    this.lineLoading = true
                    this.pie1Loading = true
                    this.pie2Loading = true
                    this.pie3Loading = true
                    this.bar1Loading = true
                    this.tableLoading = true
                    
                    this.initPowerQualityData()
                    break
                case "printer()":
                    this.openOrPrint()
                    break
                case "export1()":
                    this.ExcelPort()
                    break

            }
        },
        ExcelPort: function () {
            var time =
                window.open('/ReportForms/GetExtItemFrom?uid=' + this.UID + "&time=" + this.formaterDate() + "&type=" + this.dateType + "&itemids=" + [...this.isUnitElecSubSelect].join(',') + "&areaids=" + [...this.isUnitAreaSelect].join(',') + '&lables=' + [...this.label].join(','), '_blank');
        },
        initPowerQualityData: function () {
            this.getPowerQualityData('pie')
            this.getPowerQualityData('bar')
            this.getPowerQualityData('line')
            
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
        this.getUserBtn()
        this.time = new Date()
        this.curTimeStr = this.formaterDate()
       
        this.getTreeData(1)
        this.getTreeData(2)
        this.getLabelData()
        this.getCollectDevTypeList()
        this.getTimes()
        

    },
    mounted: function () {
    }
})
