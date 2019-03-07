var pid = 1, did = 1, cid = 1, totaltype = 1, datatypeid = 4, datestart, dateend, canAdd = 0, gradeType = 0;
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
        "gradeType": gradeType,
        "cidsType": 8

    }, function (data) {
        //console.log("data==== %o", data);
        var DataJson = JSON.parse(data);
        HourYdlGraph_SSQX(DataJson);
    });
}
function HourYdlGraph_SSQX(DataJson) {
    var Series = [];
    if (DataJson.xAxis != '') {
        $('#Error').css('display', 'none');
        $('#cavans').css('display', '');
        for (i = 0; i < DataJson.yData.length; i++) {
            Series.push({
                name: DataJson.CName[i],
                type: "line",
                tiled: "总量",
                smooth: false,
                data: DataJson.yData[i].split(','),
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    silent: true,
                    data: [{
                        yAxis: 0.3
                    }]
                }
            });
        }
        var option = {
            title: {
                show: true,
                text: "电流不平衡"
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: DataJson.CName,
                textStyle: {
                    color: "rgb(0, 0, 0)"
                },
                padding: 20,
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
                        readOnly: true
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
                name: "Time",
                type: "category",
                boundaryGap: false,
                data: DataJson.xAxis.split(','),
            }],
            yAxis: [{
                type: "value",
                axisLabel: {
                    show: true,
                    formatter: "{value}"
                }
            }, ],
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

function getPowerQualityData_SSQX_U() {
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
    });
}

$('.GraphType').click(function () {
    lock();
});
function lock() {
    startdate = "";
    enddate = "";
    canAdd = 0;

    datatypeid = 4
    getPowerQualityData_SSQX();
    datatypeid = 5
    getPowerQualityData_SSQX_U();
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
