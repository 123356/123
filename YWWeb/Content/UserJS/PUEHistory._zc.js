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
        isInit:true
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
        getStation: function () {
            var that = this
            this.$http({
                url: '/Home/ComboTreeMenu?type=1',
                method:'post'
            })
                .then(function (res) {
                    var data = res.data
                    var arr = new Array()
                    for (var i = 1; i < data.length; i++) {
                        arr.push(data[i])
                    }
                    var temp = new Array()
                    temp.push(
                        {
                            id: -1,
                            text: '全部',
                            expand:true,
                            children: arr
                        }
                    )

                    that.foreachTree(temp[0])
                    that.treeData = temp
                    that.getPUEDataByTime()
            })
            .catch(function (e) {
                throw new ReferenceError(e.message)
            })
        },
        selectChange: function (e) {
            console.log(e)
            /*this.curPid = e
            console.log("调用方法")
            this.getPUEDataByTime()*/
        },

        //获取数据
        getPUEDataByTime: function () {
            var that = this
            this.$http({
                url: '/Home/GetPUEDataByTime',
                type: 'POST',
                params: {
                    totaltype: this.curType,
                    datestart: this.fromatDate(this.selectDate[0]),
                    dateend: this.fromatDate(this.selectDate[1]),
                    pid: this.curPid
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
                //throw new ReferenceError(e.message)
                that.loading = false
                console.log(e)
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
                        }
                    }
                    this.foreachTree(node.children[i]);


                }
            } 
           
        },
        checkStation: function (e) {
            console.log(e)
            
            if (e == 0) {
                this.$Message.warning('请选择站');
                return
            }
            this.curPid = e
            console.log("调用方法")
            this.getPUEDataByTime()
        },
        openSelect: function (e) {
            if (e) {
                this.initSelectShow = false
            }
        },
        dateTypeChange: function (e) {
            console.log(e)
            if (e != 4) {
                this.getPUEDataByTime()
            }
           
        },
        search: function () {
            console.log(this.selectDate)
            this.getPUEDataByTime()
        },
        createLine: function (data) {
            console.log(data)
            this.chartShow = true
            var x = new Array()
            var y = new Array()
          
                for (var i = 0; i < data.length; i++) {
                    x.push(data[i].name)
                    y.push(data[i].value)
                }

            console.log(x)
            console.log(y)
            lineChart = echarts.init(document.getElementById('lineChart'));
            var option = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: 35,
                    right: 35,
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
                    //areaStyle: {},
                    smooth: true,
                    symbol: 'none',
                    markLine: {
                        silent: true,
                        data: [{
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
            console.log(option)

            lineChart.clear()
            lineChart.setOption(option,true)
            window.addEventListener("resize", () => {
                lineChart.resize();
            });

        },
    },
    beforeMount: function () {
        this.getStation()
    },
    mounted: function () {
       
        
    }
})

$(function () {


    
})
