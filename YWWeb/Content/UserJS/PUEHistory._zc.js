new Vue({
    el: "#app",
    data: {
        loading:true,
        treeData: [],
        typeList: [
            { id: 1, name: '近一日' }, { id: 2, name: '近一月' }, { id: 3, name: '近一年' }, { id: 4, name: '自定义' },
        ],
        curType:1,
        lineChart: null,
        curPid: null,
        curPname:'',
        selectDate: [],
        initSelectShow: true,
        chartShow: true,
        isInit: true,
        PID:null
    },
    methods: {
        renderContent(h, { root, node, data }) {
            var disabled = false
            if (data.id == 0) {
                disabled = true
            }
            var that = this
            return h('Option', {
                style: {
                    display: 'inline-block',
                    margin: '5px'
                },
                attrs: {
                    selected: data.id == that.curPid,
                    disabled: disabled
                },
                props: {
                    value: data.id
                }
            }, data.text)
        },
        //获取站
        //getStation: function () {
        //    var that = this
        //    this.$http({
        //        url: '/Home/ComboTreeMenu?type=1',
        //        method:'post'
        //    })
        //        .then(function (res) {
        //            var data = res.data
        //            var arr = new Array()
        //            if ($.cookie('cookiepid') > 0) {
        //                that.curPid = $.cookie('cookiepid')

        //            }
        //            for (var i = 1; i < data.length; i++) {
        //                arr.push(data[i])
        //            }
        //            var temp = new Array()
        //            temp.push(
        //                {
        //                    id: -1,
        //                    text: '全部',
        //                    expand:true,
        //                    children: arr
        //                }
        //            )

        //            that.foreachTree(temp[0])
        //            that.treeData = temp
        //            that.getPUEDataByTime()
        //    })
        //    .catch(function (e) {
        //        throw new ReferenceError(e.message)
        //    })
        //},
       
        //下拉框
        getSelectTree: function () {
            var that = this
            $("#leftmenuSpace").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding'><input data-options='lines:true' style='width: 200px; height: 30px;' id='StationID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
            $('#StationID').combotree({
                url: '/Home/ComboTreeMenu',
                multiple: false,
                editable: true,
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
                        console.log(node)
                        that.PID = node.id
                        $.cookie('cookiepid', that.PID, { expires: 7, path: '/' });
                        that.getPUEDataByTime()
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
                    that.getPUEDataByTime()
                }
            })
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
                    pid: parseInt(this.PID)
                }
            })
                .then(function (res) {
                    
                    if (res.data.length > 0) {
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
            if (this.curType != 4) {
                return null
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
        checkStation: function (e) {
            this.curPid = e
            $.cookie('cookiepid', this.curPid, { expires: 7, path: '/' });
            this.getPUEDataByTime()
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
            this.getPUEDataByTime()
        },
        createLine: function (data) {
            this.chartShow = true
            var x = new Array()
            var y = new Array()
          
                for (var i = 0; i < data.length; i++) {
                    x.push(data[i].name)
                    y.push(data[i].value)
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
                    data: x
                },
                yAxis: {
                    splitLine: {
                        show: false
                    }
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
                        dataView: { readOnly: false },
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                dataZoom: [{
                    //startValue: '01-06 14:00'
                }, {
                    type: 'inside'
                }],
                visualMap: {
                    top: 10,
                    left: 'center',
                    precision: 1,
                    orient: 'horizontal',
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
                    name: '历史PUE',
                    type: 'line',
                    data: y,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    smooth: true,
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
            lineChart.setOption(option,true)
            window.addEventListener("resize", () => {
                lineChart.resize();
            });

        },
    },
    beforeMount: function () {
        

        //this.getStation()
    },
    mounted: function () {
        this.getSelectTree()
    }
})

$(function () {


    
})
