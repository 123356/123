﻿

var pid = 1, did = 1, cid = 1, totaltype = 1, datatypeid = 10, datestart, dateend, canAdd = 0, gradeType = 6;
var userType = "", areaType = "", itemType = "";

var myChart1 = echarts.init(document.getElementById('userCharts1'));
//用电量实时曲线
function getPowerQualityData_SSQX() {
    totaltype = $("input[name='GraphType']:checked").val();

    $.post("/PowerQuality/getPowerQualityData_SSQX", {
        "pid": pid,
        "did": 0,
        "cid": 0,
        "totaltype": totaltype,//天用电量实时曲线
        "datatypeid": datatypeid,
        "datestart": "0",
        "dateend": "0",
        "aline": "0",
        "eline": "0",
        "userType": userType,
        "areaType": areaType,
        "itemType": itemType,
        "gradeType": gradeType

    }, function (data) {
        //console.log("data==== %o", data);
        var DataJson = JSON.parse(data);
        //console.log("DataJson==== %o", DataJson);
        if (DataJson.CName.length == 0) {
            HourYdlGraph_SSQX(DataJson);
        } else {
            HourYdlGraph_SSQX(DataJson);
        }
    });
}

function getPowerQualityData_SSQXS() {
    $('#list_data').datagrid({
        url: '/PowerQuality/getPowerQualityData_SSQXS',
        pagination: true,
        queryParams:
        {
            "pid": pid,
            "did": 0,
            "cid": 0,
            "totaltype": totaltype,//天用电量实时曲线
            "datatypeid": datatypeid,
            "datestart": "0",
            "dateend": "0",
            "aline": "0",
            "eline": "0",
            "userType": userType,
            "areaType": areaType,
            "itemType": itemType,
            "gradeType": gradeType
        }
    });

}


function HourYdlGraph_SSQX(DataJson) {
    var Series = [];
    var obj = {}
    if (totaltype == 2) {
        obj = {
            show: true,
            interval: 0
        }
    } else if (totaltype == 1) {
        obj = {
            show: true,
            interval: 11
        }
    } else if (totaltype == 0) {
        obj = {
            show: true,
            interval: 5
        }
    }
    if (DataJson.xAxis != '') {
        $('#Error').css('display', 'none');
        $('#cavans').css('display', '');
        for (i = 0; i < DataJson.yData.length; i++) {
            Series.push({
                name: DataJson.CName[i],
                type: "line",
                barGap: 0,
                stack: DataJson.CName[i],
                smooth: true,
                data: DataJson.yData[i].split(','),
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            });
        }
        var option = {
            title: {
                show: true,
                text: "负荷曲线",
                x: 'center',
                align: 'right'
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: DataJson.CName,
                textStyle: {
                    color: "rgb(0, 0, 0)"
                },
                padding: 30,
                borderColor: "#ccc"
            },
            grid: {
                x: 54,
                y: 50,
                x2: 60,
                y2: 60,
                borderWidth: 0
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                        title: { back: '' },
                        icon: { back: 'image://' }
                    },
                    restore: {
                        show: true
                    },
                    mark: {
                        show: true
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
                    magicType: {
                        show: true,
                        type: ["line", "bar", "stack", "tiled"]
                    },

                    saveAsImage: {
                        show: true
                    }

                },
                top: "50",
                right: "10",
                orient: "vertical",
                showTitle: true
            },
            calculable: true,
            xAxis: [{
                name: "h",
                type: "category",
                boundaryGap: false,
                data: DataJson.xAxis.split(','),
                axisLabel: {
                    //interval: 0,
                    rotate: 50
                },
               // splitArea:obj

            }],
            yAxis: [{
                name: "kW",
                type: "value",
                axisLabel: {
                    show: true,
                    formatter: "{value}"
                }
            },],
            dataZoom: [{
                type: 'inside',
                filterMode: 'filter'
            }],

            series: Series
        };
        myChart1.clear();
        myChart1.setOption(option);
    }
    else {
        $('#cavans').css('display', 'none');
        $('#Error').fadeIn();
    }
}

$('.GraphType').click(function () {
    //lock();
    startdate = "";
    enddate = "";
    canAdd = 0;
    getPowerQualityData_SSQX();
    getPowerQualityData_SSQXS();
});
function lock() {
    startdate = "";
    enddate = "";
    canAdd = 0;
    getPowerQualityData_SSQX();
    getPowerQualityData_SSQXS();
}

function loadStationName() {
    //查询站室名称
    $('#StationName').combotree({
        url: '/Home/ComboTreeMenu',
        multiple: false,
        onBeforeSelect: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationName').combotree('tree').tree("expand", node.target); //展开
                return false;
            }
        },
        onClick: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationName').combo('showPanel');
            }
            else {
                //返回树对象
                if (node.id != 0) {
                    $("#SPID").val(node.id);
                    $.cookie('cookiepid', node.id, { expires: 7, path: '/' });
                    pid = node.id;
                    loadCircuitType(pid);
                    lock();
                }
            }
        },
        onLoadSuccess: function (data) {
            var gpid = $.cookie('cookiepid');
            pid = gpid;
            if (gpid != undefined) {
                //console.log("gpid==== %o", gpid);
                $("#StationName").combotree("setValue", gpid);
            }
            loadCircuitType(pid);
            lock();
        }
    });
}

function loadCircuitType(pid) {
    var iType = 0;
    $("#CircuitUserType").combobox({
        url: "/BaseInfo/BindCircuitTypeByPID?PID=" + pid + "&iType=" + iType,
        valueField: 'id',
        textField: 'name',
        editable: false,
        onLoadSuccess: function (data) { //数据加载完毕事件
            // sCIteamName = parseInt(data[0].name);
            //// cid == 0 ? cid : 0;
            // $("#CircuitUserType").combobox('select', sCIteamName);
            // //$('#obj').html(data[0].CName);
        },
        onSelect: function (data) {
            if (data.id == 0) {
                userType = "";
            } else {
                userType = data.name;
            }
            lock();
        }
    });

    //
    iType = 1;
    $("#CircuitAreaType").combobox({
        url: "/BaseInfo/BindCircuitTypeByPID?PID=" + pid + "&iType=" + iType,
        valueField: 'id',
        textField: 'name',
        editable: false,
        onLoadSuccess: function (data) { //数据加载完毕事件
            // sCIteamName = parseInt(data[0].name);
            //// cid == 0 ? cid : 0;
            // $("#CircuitUserType").combobox('select', sCIteamName);
            // //$('#obj').html(data[0].CName);
        },
        onSelect: function (data) {
            if (data.id == 0) {
                areaType = "";
            } else {
                areaType = data.name;
            }
            lock();
        }
    });
    //
    iType = 2;
    $("#CircuitItemType").combobox({
        url: "/BaseInfo/BindCircuitTypeByPID?PID=" + pid + "&iType=" + iType,
        valueField: 'id',
        textField: 'name',
        editable: false,
        onLoadSuccess: function (data) { //数据加载完毕事件
            // sCIteamName = parseInt(data[0].name);
            //// cid == 0 ? cid : 0;
            // $("#CircuitUserType").combobox('select', sCIteamName);
            // //$('#obj').html(data[0].CName);
        },
        onSelect: function (data) {
            if (data.id == 0) {
                itemType = "";
            } else {
                itemType = data.name;
            }
            lock();
        }
    });


}

loadStationName();
