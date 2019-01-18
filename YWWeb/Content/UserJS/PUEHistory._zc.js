new Vue({
    el: "#app",
    data: {
       
        treeData: [],
        typeList: [
            { id: 0, name: '近一日' }, { id: 1, name: '近一周' }, { id: 2, name: '近一月' }, { id: 3, name: '自定义' },
        ],
        curType:0,
        lineChart: null,
    },
    methods: {
        selectChange: function () {

        },
        
      
        renderContent(h, { root, node, data }) {
            console.log(data.id + "--" + data.title)
            return h('Option', {
                style: {
                    display: 'inline-block',
                    margin: '0'
                },
                props: {
                    value: data.id
                }
            }, data.title)
        },
        createLine: function () {
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
                    data: ['01-06 12:00', '01-06 13:00', '01-06 14:00', '01-06 15:00', '01-06 16:00', '01-06 17:00', '01-06 18:00', '01-06 19:00', '01-06 20:00', '01-06 21:00', '01-06 22:00', '01-06 23:00', '01-06 24:00', '01-07 01:00', '01-07 02:00', '01-07 03:00', '01-07 04:00', '01-07 05:00',]
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
                    startValue: '01-06 14:00'
                }, {
                    type: 'inside'
                }],
                visualMap: {
                    top: 10,
                    left: 'center',
                    orient: 'horizontal',
                    pieces: [{
                        gt: 0,
                        lte: 2,
                        color: '#54ab88'
                    }, {
                        gt: 2,
                        lte: 5,
                        color: '#ca9a5c'
                    }, {
                        gt: 5,
                        lte: 6,
                        color: '#cd574b'
                    }],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: {
                    name: 'Beijing AQI',
                    type: 'line',
                    data: [1, 2, 3, 4, 5, 3, 6, 5, 4, 5, 3, 6, 5, 4, 2, 3, 4, 1],
                    areaStyle: {},
                    smooth: true,
                    symbol: 'none',
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: 2,
                            lineStyle: {
                                color: '#54ab88'
                            }
                        }, {
                            yAxis: 5,
                            lineStyle: {
                                color: '#ca9a5c'
                            }
                        }, {
                            yAxis: 6,
                            lineStyle: {
                                color: '#ce584c'
                            }
                        }]
                    }
                }
            };


            lineChart.clear()
            lineChart.setOption(option)

        },
    },
    beforeMount: function () {
       
    },
    mounted: function () {
       this.createLine()
        window.addEventListener("resize", () => {
            lineChart.resize();
        });
    }
})

$(function () {


    
})
