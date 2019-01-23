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
        isInitBar:true
    },
    methods: {
        openSelect: function (e) {
            if (e) {
                this.initSelectShow = false
            }
        },
        checkStation: function (e) {
            console.log(e)

            if (e == 0) {
                this.$Message.warning('请选择站');
                return
            }
            this.curPid = e
            this.getRealTimePUEData()
        },
        renderContent(h, { root, node, data }) {
            var that = this
            return h('Option', {
                style: {
                    display: 'inline-block',
                    margin: '5px'
                },
                attrs: {
                    selected: data.id == that.curPid
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
                method: 'post'
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
                            expand: true,
                            children: arr
                        }
                    )
                    that.foreachTree(temp[0])
                    that.treeData = temp
                    that.getRealTimePUEData()
                    setInterval(function () {
                        that.getRealTimePUEData()
                    }, 60000)
                })
                .catch(function (e) {
                    throw new ReferenceError(e.message)
                })
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
        //获取数据
        getRealTimePUEData: function () {
            var that = this
            this.$http({
                url: '/Home/GetRealTimePUEData',
                method: 'POST',
                params: {
                    pid: this.curPid
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
                x.push(data[i].name)
                y.push(data[i].value)
            }
            lineChart = echarts.init(document.getElementById('lineChart'));
            var  option = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    textStyle: {
                        fontSize: 12
                    }
                },
                grid: {
                    top:40,
                    left: 35,
                    right: 35,
                    bottom: 25,
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
                    right:35,
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
                        type: 'inside',
                        realtime: true,
                    }],
                    visualMap: {
                        top: 10,
                        left: 'center',
                        orient:'horizontal',
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
                        formatter: "{b} : {c}%",
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
                    right: '5%',
                    bottom: '3%',
                    top:'5%',
                    containLabel: true
                },
                color: ['#576570', '#94c5af', '#769e86', '#c78338', '#bca39c'],
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLabel: {
                        
                        color: '#666',
                        fontSize: 12
                    },
                },
                yAxis: {
                    type: 'category',
                    axisLabel: {
                      //  rotate: 30,
                        color: '#666',
                        fontSize:12
                    },
                    data: x
                },
                series: [

                    {
                        //name: '2012年',
                        type: 'bar',
                        data: y
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
                     formatter: "{a} <br/>{b} : <br/>{c} ({d}%)",
                     textStyle: {
                         fontSize:12
                     }
                 },
                 color: ['#576570', '#94c5af', '#769e86', '#c78338', '#bca39c'],
                 series: [
                     {
                         name: '能耗效率',
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
        this.getStation()
      //  this.getRealTimePUEData()
        
        
       
       
    },
    mounted: function () {
       
        
    }
})

$(function () {


    
})
