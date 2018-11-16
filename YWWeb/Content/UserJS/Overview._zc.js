var pid = 1, did = 1, cid = 1, totaltype = 1, datatypeid = 12, datestart, dateend, canAdd = 0, gradeType = 6;
var userType = "", areaType = "", itemType = "", titlePie = "", titleBar = "", t1 = "", t2 = "";

var myChart1 = echarts.init(document.getElementById('userCharts1'));
var myChart2 = echarts.init(document.getElementById('userCharts2'));
var myChart3 = echarts.init(document.getElementById('userCharts3'));
//var myChart4 = echarts.init(document.getElementById('userCharts4'));
var myChart5 = echarts.init(document.getElementById('userCharts5'));
var myChart6 = echarts.init(document.getElementById('userCharts6'));

$(function () {
    console.log("load执行");

    //按行业统计客户信息
    getKehuIndustryData_FX();
    //按地区统计客户信息
    getKehuAreaData_FX();
    getPlanData_FX();
    //getPowerQualityData_PM();
    //getshijiData_FX();
    getshengyuData_FX();
    initEcharts();
})

//客户信息统计--按行业  //饼图
function getKehuIndustryData_FX() {
    myChart1.clear();

    $.post("/ES/getKeHuData_FX", {
        type: 1
    }, function (data) {
        var DataJson = JSON.parse(data);
        PowerKehuIndustryData_FX(DataJson);
    });
}
function PowerKehuIndustryData_FX(DataJson) {
    var option1 = {
        tooltip: {
            trigger: "item",
            formatter: "{a} <br>{b} : {c} ({d}%)",
            show: true
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {
                    readOnly: true
                }
            }
        },
        series: [{
            name: "各地区客户量",
            type: "pie",
            radius: ['50%', '70%'],
            data: DataJson.series1,
            tooltip: {
                trigger: "item"
            }
        }],
        title: {
            text: "行业",
            subtext: DataJson.total + "个客户",
            x: 'center',
            y: 'center'
        },
        legend: {
            data: DataJson.yAxis.split(','),
        },
        calculable: true
    };
    myChart1.clear();
    myChart1.setOption(option1);
}

//客户信息统计 --按地区 //饼图
function getKehuAreaData_FX() {
    myChart2.clear();

    $.post("/ES/getKeHuData_FX", {
        type: 2
    }, function (data) {


        var DataJson = JSON.parse(data);
        PowerKehuAreaData_FX(DataJson);
    });
}
function PowerKehuAreaData_FX(DataJson) {
    console.log(DataJson);
    var option2 = {
        tooltip: {
            trigger: "item",
            formatter: "{a} <br>{b} : {c} ({d}%)",
            show: true
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {
                    readOnly: true
                }
            }
        },
        series: [{
            name: "各地区客户量",
            type: "pie",
            radius: ['50%', '70%'],
            data: DataJson.series1,
            tooltip: {
                trigger: "item"
            }
        }],
        title: {
            text: "地区",
            subtext: DataJson.total + "个客户",
            x: 'center',
            y: 'center'
        },
        legend: {
            data: DataJson.yAxis.split(','),
        },
        calculable: true
    };
    myChart2.clear();
    myChart2.setOption(option2);
}



//用电量统计 --计划用电
function getPlanData_FX() {
    myChart3.clear();

    $.post("/ES/getPlanData_FX", {
        type: 1
    }, function (data) {


        var DataJson = JSON.parse(data);
        PowerPlanData_FX(DataJson);
    });
}
function PowerPlanData_FX(DataJson) {
    var option3 = {
        tooltip: {
            trigger: "item",
            formatter: "{a} <br>{b} : {c} ({d}%)",
            show: true
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {
                    readOnly: true
                }
            }
        },
        series: [{
            name: "各行业计划用电量",
            type: "pie",
            radius: ['50%', '70%'],
            data: DataJson.series1,
            tooltip: {
                trigger: "item"
            }
        }],
        title: {
            text: "计划总用电",
            subtext: DataJson.total,
            x: 'center',
            y: 'center'
        },
        legend: {
            data: DataJson.yAxis.split(','),
        },
        calculable: true
    };
    myChart3.clear();
    myChart3.setOption(option3);
}


//用电量统计 --实际用电量
//function getshijiData_FX() {
//    myChart4.clear();

//    $.post("/ES/getPlanData_FX", {
//        type: 2
//    }, function (data) {


//        var DataJson = JSON.parse(data);
//        PowershijiData_FX(DataJson);
//    });
//}
//function PowershijiData_FX(DataJson) {
//    var option4 = {
//        tooltip: {
//            trigger: "item",
//            formatter: "{a} <br>{b} : {c} ({d}%)",
//            show: true
//        },
//        toolbox: {
//            show: false,
//            feature: {
//                dataView: {
//                    readOnly: true
//                }
//            }
//        },
//        series: [{
//            name: "实际用电量",
//            type: "pie",
//            radius: ['50%', '70%'],
//            data: DataJson.series1,
//            tooltip: {
//                trigger: "item"
//            }
//        }],
//        title: {
//            text: "实际总用电",
//            subtext: DataJson.total,
//            x: 'center',
//            y: 'center'
//        },
//        legend: {
//            data: DataJson.yAxis.split(','),
//        },
//        calculable: true
//    };
//    myChart4.clear();
//    myChart4.setOption(option4);
//}

//客户信息统计 --按地区 //饼图
function getshengyuData_FX() {
    myChart5.clear();

    $.post("/ES/getPlanData_FX", {
        type: 3
    }, function (data) {


        var DataJson = JSON.parse(data);
        PowershenyuData_FX(DataJson);
    });
}
function PowershenyuData_FX(DataJson) {
    var option5 = {
        tooltip: {
            trigger: "item",
            formatter: "{a} <br>{b} : {c} ({d}%)",
            show: true
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {
                    readOnly: true
                }
            }
        },
        series: [{
            name: "各行业剩余电量",
            type: "pie",
            radius: ['50%', '70%'],
            data: DataJson.series1,
            tooltip: {
                trigger: "item"
            }
        }],
        title: {
            text: "剩余电量",
            subtext: DataJson.total,
            x: 'center',
            y: 'center'
        },
        legend: {
            data: DataJson.yAxis.split(','),
        },
        calculable: true
    };
    myChart5.clear();
    myChart5.setOption(option5);
}

function initEcharts() {
    $.post("/ES/getPurchaseData_FXS", {

    }, function (response) {
        console.log({ response: response });
        var option6 = {
            title: {
                text: "购电量",
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
                data: response.yz
            },
            grid: {
                left: '3%',
                right: '14%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: response.xz,
                boundaryGap: [0, 0.01],
                axisLabel: {
                    interval: 0,
                },
                axisLabel: {
                    interval: 0,
                    rotate: -30
                },
            },
            grid: {
                left: '10%',
                bottom: '35%'
            },
            yAxis: {
                name: 'KW-h',
                type: 'value',
            },

            series: response.data,
            lable: {
                show: true,
                position: "top",
            }

        };
        myChart6.clear();
        myChart6.setOption(option6);
    });
}
//购电量
//function getPowerQualityData_PM() {
//    myChart6.clear();


//    $.post("/ES/getPurchaseData_FX", {

//    }, function (data) {
//        PowerQualityData_PM(data);
//    });
//}
//function PowerQualityData_PM(DataJson) {
//    var x = [];
//    var shuju = [];
//    var can = [];
//    var sums = [];
//    var v = 0
//    $.each(DataJson, function (index, val) {

//        var person = { data: [], type: 'bar', stack: '总量' }
//        $.each(val, function (index1, val1) {
//            if (can.indexOf(val1.name) == -1) {
//                can.push(val1.name);
//            }
//            if (x.indexOf(val1.yAxis) == -1) {
//                x.push(val1.yAxis);
//            }
//            person.name = val1.name;
//            $.each(val1.data, function (index2, val2) {
//                person.data.push(val2.val);
//                v += parseFloat(val2.val);
//            })

//        });
//        shuju.push(person);

//    });
//    $.each(DataJson, function (index, val) {

//        $.each(val, function (index1, val1) {
//            $.each(val1.data, function (index2, val2) {
//                sums.push(v.toFixed(2));
//            })

//        });
//    });
//    can.push("总购电量");
//    var mo = {
//        name: '总购电量',
//        type: 'line',
//        symbol: "none",
//        data: sums,
//    }
//    shuju.push(mo);
//    var option6 = {
//        title: {
//            text: "购电量",
//        },
//        tooltip: {
//            trigger: 'axis',
//            axisPointer: {
//                type: 'shadow',
//                label: {
//                    backgroundColor: '#6a7985'
//                }
//            }
//        },
//        legend: {
//            data: can
//        },
//        grid: {
//            left: '3%',
//            right: '14%',
//            bottom: '3%',
//            containLabel: true
//        },
//        xAxis: {
//            type: 'category',
//            data: xz,
//            boundaryGap: [0, 0.01],
//            axisLabel: {
//                interval: 0,
//            },
//            axisLabel: {
//                interval: 0,
//                rotate: -30
//            },
//        },
//        grid: {
//            left: '10%',
//            bottom: '35%'
//        },
//        yAxis: {
//            name: 'KW-h',
//            type: 'value',
//        },

//        series: shuju

//    };
//    myChart6.clear();
//    myChart6.setOption(option6);
//}