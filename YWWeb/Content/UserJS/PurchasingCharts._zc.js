/// <reference path="RealtimeDataInfo2._zc.js" />
var pid = 1, did = 1, cid = 1, totaltype = 1, datatypeid = 12, datestart, dateend, canAdd = 0, gradeType = 6;
var userType = "", areaType = "", itemType = "", titlePie = "", titleBar = "", t1 = "", t2 = "";

var myChart1 = echarts.init(document.getElementById('userCharts1'));
var myChart2 = echarts.init(document.getElementById('userCharts2'));
var myChart3 = echarts.init(document.getElementById('userCharts3'));
var myChart4 = echarts.init(document.getElementById('userCharts4'));
$(function () {
    GetPz();
    getPowerQualityData_PM();
    GetPianChaCharts();
})
function GetPz() {
    $("#pzselect").combobox({
        url: "/ES/BindCategory?isall=" + "true",
        valueField: 'id',
        textField: 'category_name',
        editable: false,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#pzselect').combobox('getData');
            if (data.length > 0) {
                $("#pzselect").combobox('select', data[0].id);
            }
        },
        onChange: function () {
            getPowerQualityDataYear_PM();
        }
    });
}
   
//购电量
function getPowerQualityData_PM() {
    myChart1.clear();


    $.post("/ES/getPurchaseData_FX", {

    }, function (data) {
        PowerQualityData_PM(data);
    });
}
function PowerQualityData_PM(DataJson) {
    var x = [];
    var shuju = [];
    var can = []
    var sums = [];
    var v = 0
    $.each(DataJson, function (index, val) {

        var person = {  data: [], type: 'bar', stack: '总量' }
        $.each(val, function (index1, val1) {
            if (can.indexOf(val1.name) == -1) {
                can.push(val1.name);
            }
            if (x.indexOf(val1.yAxis) == -1) {
                x.push(val1.yAxis);
            }
            person.name = val1.name;
            $.each(val1.data, function (index2, val2) {
                person.data.push(val2.val);
                v += parseFloat(val2.val);
            })

        });
        shuju.push(person);

    });
    $.each(DataJson, function (index, val) {

        $.each(val, function (index1, val1) {
            $.each(val1.data, function (index2, val2) {
                sums.push(v.toFixed(2));
            })

        });
    });
    can.push("总购电量");
    var mo = {
        name: '总购电量',
        type: 'line',
        symbol: "none",
        data: sums,
    }
    shuju.push(mo);
    var option1 = {
        title: {
            text: "全年购电量",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: can
        },
        grid: {
            left: '3%',
            right: '14%',
            bottom: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: x,
            boundaryGap: [0, 0.01],
            axisLabel: {
                interval: 0,
                rotate:-30,
            }
        },
        yAxis: {
            name: 'MW·H',
            type: 'value',
        },
        series: shuju

    };
    myChart1.clear();
    myChart1.setOption(option1);
}



//购电量
function getPowerQualityDataYear_PM() {
    myChart2.clear();
    myChart3.clear();

    $.post("/ES/getPurchaseDataYear_FX", {
        "pz": $("#pzselect").combobox("getValue")

    }, function (data) {
        PowerQualityDataYear_PM(data); userCharts2
        PowerQualityDataYears_PM(data); userCharts3
    });
}
function PowerQualityDataYear_PM(DataJson) {
    var x = [];
    var shuju = [];
    var can = []
    var sumPlan = 0;
    var sumDianFei = 0;
    $.each(DataJson, function (index, val) {
        x.push(val.keyName+"月");
        shuju.push(val.SumCount);
        can.push(val.trade_price);
        sumPlan = sumPlan + val.SumCount;
        sumDianFei=sumDianFei+ (val.SumCount*val.trade_price);

    });
    var marline = (sumDianFei / sumPlan);
    $("#SumPlan").html("总购电量：" + sumPlan + "MW·H")
    var option2 = {
        title: {
            text: "每月购电量",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ["购电量","交易均价","总购电量"]
        },
        grid: {
            left: '3%',
            right: '14%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: x,
            boundaryGap: [0, 0.01],
            axisLabel: {
                interval: 0,
            }
        },
        yAxis:[ {
            name: 'MW·H',
            type: 'value',
        }, {
            type: 'value',
            name: '元',
            position: 'right',
            offset: 80,
            axisLine: {
                lineStyle: {
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
        }],
        series: [{
            data:shuju,
            type: 'bar',
            name:'购电量',
        },
           {
               name: '交易均价',
               type: 'line',
               yAxisIndex: 1,
               data: can,
               markLine: {
                   itemStyle: {
                       normal: {
                           color: '#FA8565',
                           label: {

                               formatter: '{c}'
                           },
                       }
                   },
                   data: [
                       {
                           name: '购电年均价',
                           yAxis: marline
                       }
                   ]
               },
           }]
    };
    myChart2.clear();
    myChart2.setOption(option2);

}

function PowerQualityDataYear_PM(DataJson) {
    var x = [];
    var shuju = [];
    var can = []
    var sumPlan = 0;
    var sumDianFei = 0;
    $.each(DataJson, function (index, val) {
        x.push(val.keyName + "月");
        shuju.push(val.SumCount);
        can.push(val.trade_price);
        sumPlan = sumPlan + val.SumCount;
        sumDianFei = sumDianFei + (val.SumCount * val.trade_price);

    });
    var marline = (sumDianFei / sumPlan);
    //$("#SumPlan").html("总购电量：" + sumPlan + "MW·H")
    var option2 = {
        title: {
            text: "每月购电量",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ["购电量", "交易均价"]
        },
        grid: {
            left: '3%',
            right: '14%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: x,
            boundaryGap: [0, 0.01],
            axisLabel: {
                interval: 0,
            }
        },
        yAxis: [{
            name: 'MW·H',
            type: 'value',
        }, {
            type: 'value',
            name: '元',
            position: 'right',
            offset: 80,
            axisLine: {
                lineStyle: {
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
        }],
        series: [{
            data: shuju,
            type: 'bar',
            name: '购电量',
        },
           {
               name: '交易均价',
               type: 'line',
               yAxisIndex: 1,
               data: can,
               markLine: {
                   itemStyle: {
                       normal: {
                           color: '#FA8565',
                           label: {

                               formatter: '{c}'
                           },
                       }
                   },
                   data: [
                       {
                           name: '购电年均价',
                           yAxis: marline
                       }
                   ]
               },
           }]
    };
    myChart2.clear();
    myChart2.setOption(option2);

}

function PowerQualityDataYears_PM(DataJson) {
    var x = [];
    var shuju = [];
    var can = []
    var sumPlan = 0;
    var sumDianFei = 0;
    $.each(DataJson, function (index, val) {
        x.push(val.keyName + "月");
        shuju.push(val.SumCount);
        can.push(val.trade_price);
        sumPlan = sumPlan + val.SumCount;
        sumDianFei = sumDianFei + (val.SumCount * val.trade_price);

    });
    var marline = (sumDianFei / sumPlan);
    
    var option3 = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['总购电量']
        },
        series: [
            {
                name:'总购电量',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    sumPlan,
                ]
            }
        ],
        title: {
            text: "总购电量",
            subtext: sumPlan + "MW·H",
            x: 'center',
            y: 'center'
        },
    };
    myChart3.clear();
    myChart3.setOption(option3);

}





function GetPianChaCharts() {

    $.post("/Es/getPianChaFenPz", {
        //"uid": $("#unitselect").combobox('getValue'),
        //"pz": $("#pzselect").combobox('getValue'),
        //"startTime": $("#startTime").datebox("getValue"),
        //"endTime": $("#endTime").datebox("getValue")
    }, function (data) {
        //var DataJson = JSON.parse(data);
        PowerQualityData_piancha(data);

    });
}
function PowerQualityData_piancha(DataJson) {
    var x = [];
    var shuju = [];
    var can = []
    $.each(DataJson, function (index, val) {

        var person = { data: [], type: 'line', }
        $.each(val, function (index1, val1) {
            if (can.indexOf(val1.name) == -1) {
                can.push(val1.name);
            }
            if (x.indexOf(val1.yAxis) == -1) {
                x.push(val1.yAxis);
            }
            person.name = val1.name;
            $.each(val1.data, function (index2, val2) {
                person.data.push(val2.val);
            })

        });
        shuju.push(person);

    });

    var option4 = {
        title: {
            text: "偏差率",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: can
        },
        grid: {
            left: '3%',
            right: '14%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: x,
            boundaryGap: [0, 0.01],
            axisLabel: {
                interval: 0,
            },
            axisLabel: {
                interval: 0,
                //rotate: -30
            },
        },
        grid: {
            left: '10%',
            bottom: '35%'
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            }
        },

        series: shuju

    };
    myChart4.clear();
    myChart4.setOption(option4);
}