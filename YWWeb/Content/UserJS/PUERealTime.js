new Vue({
    el: "#app",
    data: {
        loading:true,
        pieChart: null,
        gaugeChart: null,
        lineChart: null,
        barChart: null,
        lineShow: true,
        gaugeSHow: true,
        barShow: true,
        pieShow: true,
        curPid: null,
        curPname: '',
        treeData:[],
        initSelectShow: true,
        isInitLine: true,
        isInitGauge: true,
        isInitBar: true,
        PID:null
    }, 
    methods: {
        openSelect: function (e) {
            if (e) {
                this.initSelectShow = false
            }
        },
        checkStation: function (e) {
            this.curPid = e
            $.cookie('cookiepid', this.curPid, { expires: 7, path: '/' });
            this.getRealTimePUEData()
        },
       
        //renderContent(h, { root, node, data }) {
        //    var disabled = false
        //    if (data.id == 0) {
        //        disabled=true
        //    }
        //    var that = this
        //    return h('Option', {
        //        style: {
        //            display: 'inline-block',
        //            margin: '5px'
        //        },
        //        attrs: {
        //            selected: data.id == that.curPid,
        //            //disabled: disabled
        //        },
        //        props: {
        //            value: data.id
        //        },
        //        on: {
        //            click: () => {
        //                alert("444444444")
                       
        //            }
        //        }
        //    }, data.text)
        //},
//下拉框
getSelectTree: function () {
    var that = this
    $("#leftmenuSpace").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding'><input data-options='lines:true' style='width: 250px; height: 30px;' id='StationID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
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
                that.getRealTimePUEData()
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
            that.getRealTimePUEData()
        }
    })
},
//获取站
//getStation: function () {
//    var that = this
//    this.$http({
//        url: '/Home/ComboTreeMenu?type=1',
//        method: 'post'
//    })
//        .then(function (res) {
//            var data = res.data
//            if ($.cookie('cookiepid') > 0) {
//                that.curPid = $.cookie('cookiepid')

//            }
//            var arr = new Array()
//            for (var i = 1; i < data.length; i++) {
//                arr.push(data[i])
//            }
//            var temp = new Array()
//            temp.push(
//                {
//                    id: -1,
//                    text: '全部',
//                    expand: true,
//                    children: arr
//                }
//            )
//            that.foreachTree(temp[0])
//            that.treeData = temp
//            that.getRealTimePUEData()
//            setInterval(function () {
//                that.getRealTimePUEData()
//            }, 60000)
//        })
//        .catch(function (e) {
//            throw new ReferenceError(e.message)
//        })
//},
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
//获取数据
getRealTimePUEData: function () {
    var that = this
    this.$http({
        url: '/Home/GetRealTimePUEData',
        method: 'POST',
        body: {
            pid: this.PID
        }
                
    })
     .then(function (res) {
                 
         if (res.data) {
             if (res.data.list_top && res.data.list_top.length > 0) {
                 that.lineShow = true
                 that.isInitLine = false
                 that.createLine(res.data.list_top)
                         
             } else {
                 that.lineShow = false
                 if (!that.isInitLine) {
                     lineChart.clear()
                 }
             }
             if (res.data.RealValue) {
                 that.gaugeSHow = true
                 that.isInitGauge = false
                 this.createGauge(res.data.RealValue)
                        
             } else {
                 that.gaugeSHow = false
                 if (!that.isInitGauge) {
                     gaugeChart.clear()
                 }
             }
             if (res.data.list_le && res.data.list_le.length > 0) {
                 that.barShow = true
                 that.pieShow = true
                 that.isInitBar = false
                 this.createBar(res.data.list_le)
                 this.createPie(res.data.list_le)
             } else {
                 that.barShow = false
                 that.pieShow = false
                 if (!that.isInitBar) {
                     barChart.clear()
                     pieChart.clear()
                 }
             }
         }
         that.loading = false
     })
    .catch(function (e) {
        throw new ReferenceError(e.message)
        that.loading = false
    })
},
//实时趋势
createLine: function (data) {
    var x = new Array()
    var y = new Array()
    for (var i = 0; i < data.length; i++) {
        x.push(data[i].name.split(" ")[1])
        y.push(data[i].value)
    }
    var time ="";
    if(data.length>0){
        time = data[0].name.split(" ")[0]
    }
    lineChart = echarts.init(document.getElementById('lineChart'));
    var  option = {
        title: {
            text:time +'  实时PUE',
            x: 'center',
            top:0,
            textStyle:{
                fontSize:15,
                color:'#333'
            }
        },
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis',
            textStyle: {
                fontSize: 12
            }
        },
        grid: {
            top:60,
            left: 35,
            right: 40,
            bottom: 25,
        },
        xAxis: {
            boundaryGap: false,
            data: x
        },
        yAxis: {
            splitLine: {
                show: false
            },
           // boundaryGap:[0,0.01]
        },
                    
        toolbox: {
            right:35,
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
        dataZoom: [{
            type: 'inside',
            realtime: true,
        }],
        visualMap: {
            top: 25,
            left: 'center',
            orient: 'horizontal',
            precision: 1,
            pieces: [{
                gt: 0,
                lte: 1.8,
                color: '#54ab88'
            }, {
                gt: 1.8,
                lte: 2.6,
                color: '#ca9a5c'
            }, {
                gt: 2.6,
                lte: 5,
                color: '#cd574b'
            }],
            outOfRange: {
                color: '#cd574b'
            }
        },
        series: {
            name: 'PUE统计',
            type: 'line',
            data: y,
            areaStyle: {},
            smooth: false,
            symbol: 'none',
            markPoint: {
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                ],
                //symbolOffset:[0,'10']
            },
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
                        yAxis: 1.8,
                        lineStyle: {
                            color: '#54ab88'
                        }
                    }, {
                        yAxis: 2.6,
                        lineStyle: {
                            color: '#ca9a5c'
                        }
                    }, {
                        yAxis: 5,
                        lineStyle: {
                            color: '#ce584c'
                        }
                    }]
            }
        }
    };
    lineChart.clear()
    lineChart.setOption(option)
    window.addEventListener("resize", () => {
        lineChart.resize();
    });
},
//仪表盘
createGauge: function (data) {
    gaugeChart = echarts.init(document.getElementById('gaugeChart'));
    var option ={
        backgroundColor: '#fff',
        tooltip: {
            formatter: "{b} : {c}",
            textStyle: {
                fontSize: 12
            }
        },
               
        color: ['#32b194'],
        series: [
            {
                radius: '95%',
                type: 'gauge',
                min: 1,
                max: 5,
                splitNumber: 5,
                detail: {
                    formatter: '{value}',
                    textStyle: {
                        fontSize: 30,
                        color: '#32b194'
                    }
                },
                           
                title: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 20,
                    color: '#32b195'
                },
                axisLine: {
                    lineStyle: {
                        color: [[0.2, '#32b194'], [0.4, '#cc9c50'], [1, '#d15642']],
                        width: 18
                    }
                },
                splitLine: {
                    length: 18
                },
                data: [
                    {
                        value: data,
                        name: 'PUE',
                        fontSize: 30,
                    },

                ]
            }
        ]
    };

    gaugeChart.clear()
    gaugeChart.setOption(option)
    window.addEventListener("resize", () => {
        gaugeChart.resize();
    });

},
//柱状图排名
createBar: function (data) {
    var x = new Array()
    var y = new Array()
    for (var i = 0; i < data.length; i++) {
        x.push(data[i].name)
        y.push(data[i].value)
    }
    barChart = echarts.init(document.getElementById('barChart'));
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            textStyle: {
                fontSize: 12
            }
        },

        grid: {
            left: '1%',
            right: '10%',
            bottom: '25',
            top:'16%',
            containLabel: true
        },

        color: ['#576570', '#94c5af', '#769e86', '#c78338', '#bca39c'],
        xAxis: {
            name:'kW·h',
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {
                        
                color: '#666',
                fontSize: 12
            },
        },
        yAxis: {
            name:'回路',
            type: 'category',
            //inverse:true,
            axisLabel: {
                //  rotate: 30,
                color: '#666',
                fontSize: 12,
                
            },
            data: x
        },
        series: [

            {
                //name: '2012年',
                type: 'bar',
                data: y,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = ['#576570', '#94c5af', '#769e86', '#c78338', '#bca39c', '#d15642', '#cc9c50', '#32b194', '#88c5ac', '#dc8a81'];
                            return colorList[params.dataIndex]
                        }
                    }
                }
            }
        ]
    };


    barChart.clear()
    barChart.setOption(option)
    window.addEventListener("resize", () => {
        barChart.resize();
    });

},
//饼图
createPie: function (data) {
    pieChart = echarts.init(document.getElementById('pieChart'));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : <br/>{c} ({d}%)",
            textStyle: {
                fontSize:12
            }
        },
        color: ['#576570', '#94c5af', '#769e86', '#c78338', '#bca39c', '#d15642', '#cc9c50', '#32b194', '#88c5ac', '#dc8a81'],
        series: [
            {
               
                type: 'pie',
                radius: '68%',
                center: ['50%', '50%'],
                data:data,
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


    pieChart.clear()
    pieChart.setOption(option)
    window.addEventListener("resize", () => {
        pieChart.resize()
    });

},
},
beforeMount: function () {
       
    // this.getStation()
},
mounted: function () {
    this.getSelectTree()
}
})

