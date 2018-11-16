var pid = 1, did = 1, cid = 1, totaltype = 1, datatypeid = 12, datestart, dateend, canAdd = 0, gradeType = 6;
var userType = "", areaType = "", itemType = "", titlePie = "", titleBar = "", t1 = "", t2 = "";

var myChart1 = echarts.init(document.getElementById('userCharts1'));
var myChart2 = echarts.init(document.getElementById('userCharts2'));

$(function () {
    loadSelectUnit();
    GetUnitPlan();
})

//加载客户下拉框
function loadSelectUnit() {
    $("#unitselect").combobox({
        url: "/ES/UnitComboData?isall=" + "true",
        valueField: 'UnitID',
        textField: 'UnitName',
        editable: true,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#unitselect').combobox('getData');
            if (data.length > 0) {
                $("#unitselect").combobox('setValue', data[0].UnitID);
            }
            loadSelectPZ();
        }
        , onChange: function (n) {
            getMonthData_FX();
            getLastMonthData_FX();
        }
    });
}
////加载品种下拉框
//function loadSelectPZ() {
//    $("#pzselect").combobox({
//        url: "/ES/BindCategory?isall=" + "false",
//        valueField: 'id',
//        textField: 'category_name',
//        editable: false,
//        onLoadSuccess: function () { //数据加载完毕事件
//            var data = $('#pzselect').combobox('getData');
//            if (data.length > 0) {
//                $("#pzselect").combobox('select', data[0].id);
//            }
//        },
//        onChange: function (n, o) {
//            getMonthData_FX();
//            getLastMonthData_FX();
//        }
//    });
//}
//客户信息统计--按行业  //饼图
function getMonthData_FX() {
    myChart1.clear();

    $.post("/ES/getJueCeData_FX", {
        type: 1,
        uid: $('#unitselect').combobox('getValue'),
        //pz: $('#pzselect').combobox('getValue')
    }, function (data) {
        //console.log(data);
        //var DataJson = JSON.parse(data);
        PowerKehuIndustryData_FX(data.soure, data.month, data.goudian,data.table);
        //GetTable(data.table, 'tablist1');
    });
}
function formatDate(NewDtime, row, r) {
    var dt = new Date(parseInt(NewDtime.slice(6, 19)));
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var date = dt.getDate();
    var hour = dt.getHours();
    var minute = dt.getMinutes();
    var second = dt.getSeconds();
    return month + "-" + date;
}
function PowerKehuIndustryData_FX(DataJson, m, goudian,table) {
    var x = []
    var y1 = [];
    var y2 = [];
    var y3 = [];
    var y4 = [];
    $.each(DataJson, function (index, val) {
        x.push(formatDate(val.RecordTime));
        y1.push(val.SumUsePower);
        y2.push(val.SumPlanUsePower);
        y4.push(val.AllDeviationRate)
        if (goudian.length > 0) {
            y3.push(goudian[0].Sumplan.toFixed(2));
        }

    })
    var min = 0, max = 0;
    if (table != null) {
        min = table.SumPlanUsePower - 4;
        max = table.SumPlanUsePower + 8;
    }
    var option1 = {
        title: {
            text: '',
            subtext: m + '月份'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['实际用电量', '计划用电量','偏差率']
        },
        toolbox: {
            show: true,
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
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        }, {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            }
        },
        ],
        series: [
            {
                name: '实际用电量',
                type: 'line',
                data: y1,
                yAxisIndex:0,
                //markPoint: {
                //    data: [
                //        { type: 'max', name: '最大值' },
                //        { type: 'min', name: '最小值' }
                //    ]
                //}
            },
            {
                name: '计划用电量',
                type: 'line',
                data: y2,
                yAxisIndex: 0,
                //markLine: {
                //    lineStyle: {
                //        color: '#0000FF'
                //    },
                //    silent: true,
                //    data: [
                //          { yAxis: max }, { yAxis: min }
                //    ]
                //}
            }, {
                name: '偏差率',
                type: 'line',
                yAxisIndex: 1,
                data: y4,
                //markLine: {
                //    lineStyle: {
                //        color: '#0000FF'
                //    },
                //    silent: true,
                //    data: [
                //          { yAxis: max }, { yAxis: min }
                //    ]
                //}
            },
            //{
            //{
            //    name: '已购日均电量',
            //    type: 'line',
            //    data: y3
            //}
        ]
    };

    myChart1.clear();
    myChart1.setOption(option1);
}

//客户信息统计 --按地区 //饼图
function getLastMonthData_FX() {
    myChart2.clear();

    $.post("/ES/getJueCeData_FX", {
        type: 2,
        uid: $('#unitselect').combobox('getValue'),
        //pz: $('#pzselect').combobox('getValue')
    }, function (data) {
        PowerKehuAreaData_FX(data.soure, data.month, data.goudian,data.table);
        //GetTable(data.table, 'tablist2')
    });
}
function PowerKehuAreaData_FX(DataJson, m, goudian,table) {
    var x = []
    var y1 = [];
    var y2 = [];
    var y3 = [];
    var y4 = [];
    $.each(DataJson, function (index, val) {
        x.push(formatDate(val.RecordTime));
        y1.push(val.SumUsePower);
        y2.push(val.SumPlanUsePower);
        y4.push(val.AllDeviationRate)
        if (goudian.length > 0) {
            y3.push(goudian[0].Sumplan.toFixed(2));
        }

    })
    var min = 0, max = 0;
    if (table != null) {
        min = table.SumPlanUsePower - 4;
        max = table.SumPlanUsePower + 8;
    }
    var option2 = {
        title: {
            text: '',
            subtext: m + '月份'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['实际用电量', '计划用电量', '偏差率']
        },
        toolbox: {
            show: true,
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
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        }, {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            }
        },],
        series: [
            {
                name: '实际用电量',
                type: 'line',
                yAxisIndex: 0,
                data: y1,
                //markPoint: {
                //    data: [
                //        { type: 'max', name: '最大值' },
                //        { type: 'min', name: '最小值' }
                //    ]
                //}
            },
            {
                name: '计划用电量',
                type: 'line',
                yAxisIndex: 0,
                data: y2,
                //markLine: {
                //    lineStyle: {
                //        color: '#0000FF'
                //    },
                //    silent: true,
                //    data: [
                //            { yAxis: max}, { yAxis: min }
                //    ]
                //}
            },
            {
                name: '偏差率',
                type: 'line',
                yAxisIndex: 1,
                data: y4,
                //markLine: {
                //    lineStyle: {
                //        color: '#0000FF'
                //    },
                //    silent: true,
                //    data: [
                //          { yAxis: max }, { yAxis: min }
                //    ]
                //}
            },
            //{
            //    name: '已购日均电量',
            //    type: 'line',
            //    data: y3
            //}
        ]
    };

    myChart2.clear();
    myChart2.setOption(option2);
}


//function GetTable(data, tabid) {
//    var html = '';
//    if (data != null) {


//        html = '<tr>';
//        html += '<td>当日大工业电量</td>'
//        html += '<td>' + data.UsePower + '</td>'
//        html += '</tr>'
//        html += '<tr>'
//        html += '<td>当日大工业电量偏差率</td>'
//        html += '<td>' + data.DeviationRate + '</td>'
//        html += '</tr>'
//        html += '<tr>'
//        html += '<td>当月累计大工业电量</td>'
//        html += '<td>' + data.SumUsePower + '</td>'
//        html += '</tr>'
//        html += '<tr>'
//        html += '<td>当月计划电量</td>'
//        html += '<td>' + data.SumPlanUsePower + '</td>'
//        html += '</tr>'
//        html += '<tr>'
//        html += '<td>当月累计偏差率</td>'
//        html += '<td>' + data.AllDeviationRate + '</td>'
//        html += '</tr>'
//        html += '<tr>'
//        html += '<td>大工业电量完成率</td>'
//        html += '<td>' + data.CompletionRate + '</td>'
//        html += '</tr>'
//    }
//    $("#" + tabid).html(html);
//}
//function GetUnitPlan() {
//    $.post('/Es/GetUnitPlan', {}, function (data) {
//        $("#SumUnit").html(data.length);
//        var html = "";
//        $.each(data, function (index, val) {
//            if (index == 0) {

//                html += "<h4><span>单位名称：</span>" + val[0].UnitName + "</h4>";
//            } else {
//                "<h4>" + val[0].UnitName + "</h4>";
//            }
//            $.each(val, function (i, v) {
                    
//                if (v.change_remark != null && v.change_remark != "")
//                    if (i == 0) {
//                        html += "<h5><span style='font-size:18px;'>说明：</span>" + v.change_remark + "</h5>"
//                    } else {
//                        html += "<h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + v.change_remark + "</h5>"
//                    }
//            })
//        })
//        $("#contentUnit").html(html);
//    })
//}



//function showRemrk() {
//    $("#editwin4").dialog({
//        closed: false,
//        top: ($(window).height() - 600) * 0.5,
//        left: ($(window).width() - 800) * 0.5,
//        minimizable: false, //最小化，默认false
//        maximizable: false, //最大化，默认false
//        collapsible: false, //可折叠，默认false
//        draggable: false, //可拖动，默认false
//        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false
//    });

//}