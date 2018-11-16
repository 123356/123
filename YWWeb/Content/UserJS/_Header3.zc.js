$(function () {
        getAlarmData_PM();
    })
var myChart2 = echarts.init(document.getElementById('userCharts2'));
function getAlarmData_PM() {
    myChart2.clear();


    $.post("/Home/GetAlarmCharts", {

    }, function (data) {
        //console.log(data);
        AlarmData_PM(data);
    });
}

function AlarmData_PM(data) {
    var can = [];
    var shuju = [];
    $.each(data, function (index, val) {
        can.push(val.Name+"月");
            
        shuju.push(val.sums);
    })
    var option2 = {
        title: {
            text: "报警",
            textStyle: {
                color: "rgb(255, 255, 255)",
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: "bolder",
                align: "left",
                baseline: "top"
            },
            padding: 15
        },
        tooltip: {
            trigger: "axis"
        },
        legend: {
            //data: ['故障', '报警'],
            x: "right",
            textStyle: {
                color: "rgb(255, 255, 255)",
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: "normal",
                align: "center",
                baseline: "middle"
            },
            y: "top",
            orient: "horizontal",
            itemGap: 10,
            itemHeight: 10,
            itemWidth: 20,
            padding: 15
        },
        toolbox: {
            show: false,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        calculable: false,
        xAxis:{
            type: 'category',
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: "rgb(255, 255, 255)",
                    width: 2
                },
                show: true
            },
            axisLabel: {
                textStyle: {
                    color: "rgb(255, 255, 255)"
                }
            },
            nameTextStyle: {
                color: "rgb(255, 255, 255)",
                fontSize: 12,
                fontStyle: "normal"
            },
            data:can
        },

        grid: {
            y: 50,
            x: 50,
            //坐标系的位置，可设置宽高
        },
        yAxis: {
            type: 'value',
            name: '',
            axisLine: {
                lineStyle: {
                    color: "rgb(252, 252, 252)",
                    width: 2
                },
                show: true
            },
            axisLabel: {
                textStyle: {
                    color: "rgb(255, 255, 255)"
                }
            },
            nameTextStyle: {
                color: "rgb(255, 255, 255)",
                fontSize: 12,
                fontStyle: "normal"
            },
            splitLine: {
                show: false
            },
            splitArea: {
                show: true
            }
        },
        series: 
            {
                name: '报警',
                type: 'line',
                data:shuju,
                symbol: "emptyRectangle",
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 3
                        }
                    }
                }
            },
        //backgroundColor: "rgb(0, 0, 0)",
        //color: ['#82b2ad', '#6d89be', '#99ded5'],
    };
    myChart2.clear();
    myChart2.setOption(option2);
}