new Vue({
    el: "#app",
    data: {
        loading:true,
        treeData: [],
        typeList: [
           { id: 1, name: '近一日' }, { id: 2, name: '近一月' }, { id: 3, name: '近一年' }, { id: 4, name: '自定义' },
            //{ id: 1, name: '15分钟PUE' }, { id: 2, name: '小时PUE' }, { id: 3, name: '天PUE' }, { id: 4, name: '月PUE' },
        ],
        curType: '4',
        lineChart: null,
        curPid: null,
        curPname:'',
        selectDate: [],
        initSelectShow: true,
        chartShow: true,
        isInit: true,
        PID: null,
        pueList: [],
        pueid: null,
    },
    methods: {
        //renderContent(h, { root, node, data }) {
        //    var disabled = false
        //    if (data.id == 0) {
        //        disabled = true
        //    }
        //    var that = this
        //    return h('Option', {
        //        style: {
        //            display: 'inline-block',
        //            margin: '5px'
        //        },
        //        attrs: {
        //            selected: data.id == that.curPid,
        //            disabled: disabled
        //        },
        //        props: {
        //            value: data.id
        //        }
        //    }, data.text)
        //},
        //下拉框
        getSelectTree: function () {
            var that = this
            $("#leftmenuSpace").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding'><input data-options='lines:true' style='width: 200px; height: 30px;' id='StationID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
            $('#StationID').combotree({
                url: '/Home/ComboTreeMenu',
                multiple: false,
                editable: false,
                panelMinHeight: 400,
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
                        that.PID = node.id
                        $.cookie('cookiepid', that.PID, { expires: 7, path: '/' });
                        that.getComboxPueName()
                    }
                },
                onLoadSuccess: function (node, data) {
                    that.PID = $.cookie('cookiepid');
                    // DST(pid);
                    if (that.PID != undefined && null != that.PID) {
                        $("#StationID").combotree("setValue", that.PID);
                    }
                    else {
                        if (null != data && data.length > 0) {
                            var bfound = false;
                            for (var i = 0; i < data[0].children.length && false == bfound; i++) {
                                for (var j = 0; j < data[0].children[i].children.length && false == bfound; j++) {
                                    that.PID = data[0].children[i].children[j].id;
                                    $("#StationID").combotree("setValue", that.PID);
                                    $.cookie('cookiepid', that.PID, { expires: 7, path: '/' });
                                    bfound = true;
                                }
                            }
                        }
                    }
                    that.getComboxPueName()
                }
            })
        },
        //pue下拉框
        getComboxPueName: function () {
            var that = this
            this.$http({
                url: '/Home/GetComboxPueName',
                method: 'post',
                body: {
                    pid: this.PID
                }
            })
            .then(function (res) {
                that.pueList = res.data
                if (res.data) {
                    that.pueid = res.data[0].ID
                    that.getPUEDataByTime()
                    //setTimeout(function () {
                    //    that.interval()
                    //}, 5000)
                } else {
                    that.loading = false
                    that.pueid = null
                    that.$Message.error('请求失败');
                }

            })
            .catch(function () {
            })
        },
        pueChange: function () {
            this.getPUEDataByTime()
        },
        interval: function () {
            this.getPUEDataByTime()
            setTimeout(this.interval, 5000)
        },
        //获取数据
        getPUEDataByTime: function () {
            var that = this;
            this.$http({
                url: '/Home/GetPUEDataByTime',
                method: 'POST',
                body: {
                    totaltype: this.curType,
                    datestart: this.fromatDate(this.selectDate[0]),
                    dateend: this.fromatDate(this.selectDate[1]),
                    pid: parseInt(this.PID),
                    pueid:this.pueid
                }
            })
                .then(function (res) {
                    
                    if (res.data.data.length > 0) {
                        that.chartShow = true
                        that.createLine(res.data)
                        that.isInit = false
                    } else {
                        that.chartShow = false
                        if (!that.isInit) {
                            lineChart.clear()
                            that.isInit = true
                        }
                        
                    }
                    that.loading = false
            })
            .catch(function (e) {
                that.loading = false
                throw new ReferenceError(e.message)
            })
        },
        fromatDate: function (date) {
            if (date == null) {
                return null
            }
            var time = new Date(date)
            var y = time.getFullYear()
            var m = time.getMonth() + 1
            var d = time.getDate()
            if (this.curType ==3) {
                return y + "-" + m
            }
            return y + "-" + m + "-" + d
        },
        //遍历树
        foreachTree: function (node) {
            if (!node) {
                return;
            }
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    if (!node.children[i].children) {
                        if (this.curPid == null) {
                            node.expand = true
                            this.curPid = node.children[i].id;
                            this.curPname = node.children[i].text
                            node.children[i].selected = true
                        } else {
                            if (this.curPid == node.children[i].id) {
                                this.curPname = node.children[i].text
                            }
                            
                           
                        }
                    }
                    this.foreachTree(node.children[i]);


                }
            } 
           
        },
        
        radioChange:function(e){
            if (e == 4) {
                this.initDate()
            } else if(e==1) {
                var end = new Date()
                //end = end.setDate(end.getDate())
               // end = new Date(end)
                var start = new Date()
                start = start.setDate(start.getDate() - 6)
                this.selectDate = [new Date(start), end]
            }
            this.search()
        },
        dateChange:function(e){
            this.search()
            
            
        },
        //计算相差时间
        datedifference:function(){
            var start = new Date(this.selectDate[0])
            var end = new Date(this.selectDate[1])
            var diff = Math.abs(end.getTime() - start.getTime())
            var day = parseInt(diff / (1000 * 60 * 60 * 24))
            return day+1
        },
        openSelect: function (e) {
            if (e) {
                this.initSelectShow = false
            }
        },
        dateTypeChange: function (e) {
            if (e != 4) {
                this.getPUEDataByTime()
            }
           
        },
        search: function () {
            if (this.curType == 4) {

                if (this.datedifference() > 30) {
                    this.$Message.warning('15分钟PUE,时间范围请在30天内！');
                    return
                }
            } 
            this.getPUEDataByTime()
        },
        setSatrtTime: function (type) {
            var time = new Date()
            var curTime = ''
            switch (parseInt(type)) {
                case 1:
                    time.setDate(time.getDate() - 2)
                    time = new Date(time)
                    curTime = time.toLocaleDateString() + " 0:00:00"
                    break
                case 2:
                    time.setDate(time.getDate() - 6)
                    time = new Date(time)
                    curTime = time.toLocaleDateString() + " 0:00:00"
                    break
                case 4:
                    curTime = time.toLocaleDateString()+" 0:00:00"
                    break

            }
            return curTime
        },
        createLine: function (zData) {
            var data = zData.data

            var obj = {}
            var starVal = this.setSatrtTime(this.curType)
            
            if (parseInt(this.curType) == 1) {
                obj = {
                    show: true,
                    interval: 11
                }
            } else if (parseInt(this.curType) == 2) {
                obj = {
                    show: true,
                    interval: 0
                }
            } else if (parseInt(this.curType) == 4) {
                obj = {
                    show: true,
                    interval: 3
                }
            }
            this.chartShow = true
            var x = new Array()
            var y = new Array()
          
            for (var i = 0; i < data.length; i++) {
                
                
                if (parseInt(this.curType) == 2 || parseInt(this.curType) == 3) {
                    x.push(data[i].name.split(' ')[0])
                } else {
                    x.push(data[i].name)
                }
                y.push(parseFloat(data[i].value))
            }
                var maxYData = y.reduce(function (a, b) {
                    return b > a ? b : a;
                });
                if (maxYData < 5) {
                    maxYData = 5
                }
                var time = new Date()
                time = time.toLocaleDateString() + " 0:00:00"
                if (this.curType == 3) {
                    starVal = x[0]
                }
                var endVal = null
                
                var dataZoom = {
                    type: 'inside',
                    
                }
                if (data.length > 1) {
                    dataZoom = {
                        type: 'inside',
                        startValue: starVal,
                        endValue: x[x.length - 1]
                    }
                }

                var levelData = zData.levList

                var level = []
                var color = ['#54ab88', '#ca9a5c', '#cd574b']
                var markLine = []
                for (var i = 0; i < levelData.length; i++) {
                    if (i == 0) {
                        var temp = {
                            gt: 0,
                            lte: levelData[i],
                            color: color[i]
                        }
                    } else {
                        var temp = {
                            gt: levelData[i - 1],
                            lte: levelData[i],
                            color: color[i]
                        }
                    }

                    var templine = {
                        yAxis: levelData[i],
                        lineStyle: {
                            color: color[i]
                        }
                    }
                    level.push(temp)
                  
                }

                lineChart = echarts.init(document.getElementById('lineChart'));
                
            var option = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: 35,
                    right: 50,
                },
                xAxis: {
                    boundaryGap: false,
                    data: x,
                    splitArea: obj

                },
                yAxis: {
                    name:'PUE趋势图',
                    splitLine: {
                        show: false
                    },
                    max: maxYData
                    
                },
                toolbox: {
                    right: 35,
                    show: true,
                    itemSize: 12,
                    itemGap: 5,
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
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                //dataZoom: [{
                //    type: 'inside',
                //    realtime: true,
                //}],
                dataZoom: [dataZoom, {
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                visualMap: {
                    top: 10,
                    left: 'center',
                    precision: 1,
                    orient: 'horizontal',
                    pieces: level,
                    outOfRange: {
                        color: '#cd574b'
                    }
                },
                series: {
                    name: '历史PUE',
                    type: 'line',
                    data: y,
                    areaStyle: {},
                   
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    smooth: false,
                    symbol: 'none',
                    markLine: {
                        silent: true,
                        data: [
                            {
                                type: 'average', name: '平均值',
                                lineStyle: {
                                    type: 'solid'
                                },
                                label: {
                                    show: true,
                                    position: 'end',
                                    formatter: '{b}\n{c}'
                                }
                            },
                            {
                                lineStyle: {
                                    color: "#54ab88"
                                },
                                yAxis: levelData[0]
                            },
                            {
                                lineStyle: {
                                    color: "#ca9a5c"
                                },
                                yAxis: levelData[1]
                            },
                            {
                                lineStyle: {
                                    color: "#cd574b"
                                },
                                yAxis: levelData[2]
                            },
                        ]
                    }
                }
            };

            lineChart.clear()
            lineChart.setOption(option, true)
            window.addEventListener("resize", () => {
                lineChart.resize();
            });

        },
        initDate: function () {
            var end = new Date()
            end = end.setDate(end.getDate())
            end = new Date(end)
            var start = new Date()
            start = start.setDate(start.getDate() - 29)
            this.selectDate = [new Date(start), new Date(end)]
        }
    },
    beforeMount: function () {
        this.initDate()

        //this.getStation()
    },
    mounted: function () {
        this.getSelectTree()
    }
})

$(function () {


    
})
