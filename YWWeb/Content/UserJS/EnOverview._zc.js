var pid = 1, did = 1, cid = 1, totaltype = 1, datatypeid = 12, datestart, dateend, canAdd = 0, gradeType = 6;
var userType = "", areaType = "", itemType = "", titlePie = "", titleBar = "", t1 = "", t2 = "";

var myChart1 = echarts.init(document.getElementById('userCharts1'));
var myChart2 = echarts.init(document.getElementById('userCharts2'));
var myChart3 = echarts.init(document.getElementById('userCharts3'));
//前一天用电量排名   //
function getPowerQualityData_PM() {
    myChart3.clear();
    totaltype = $("input[name='GraphType']:checked").val();

    //console.log(totaltype)
    var num = 0;
    switch (parseInt(totaltype)) {
        case 0:
            num = 2;
            titleBar = "昨天用电分项排名";
            t1 = '昨天';
            t2 = '上月同期';
            break;
        case 1:
            num = 14;
            titleBar = "上周用电分项排名";
            t1 = '上周';
            t2 = '上月同期';
            break;
        case 2:
            num = 13;
            titleBar = "上月用电分项排名";
            t1 = '上月';
            t2 = '去年同期';
            break;
    }

    $.post("/PowerQuality/getPowerQualityData_PM", {
        "pid": pid,
        "did": 0,
        "cid": 0,
        "totaltype": num,//小时用电量
        "datatypeid": 12,
        "datestart": "0",
        "dateend": "0",
        "aline": "0",
        "eline": "0",
        "userType": userType,
        "areaType": areaType,
        "itemType": itemType,
        "gradeType": gradeType,
        "startTime": $("#startTime").datebox("getValue"),
        "endTime": $("#endTime").datebox("getValue")

    }, function (data) {
        var DataJson = JSON.parse(data);
        PowerQualityData_PM(DataJson);
    });
}
function PowerQualityData_PM(DataJson) {
    var option3 = {
        title: {
            text: titleBar,
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
            data: [t1, t2]
        },
        grid: {
            left: '3%',
            right: '14%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            name: 'KW‧H',
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: DataJson.yAxis.split(',')
        },
        series: [
            {
                name: t1,
                type: 'bar',
                data: DataJson.series1.split(',')
            },
            {
                name: t2,
                type: 'bar',
                data: DataJson.series2.split(',')
            }
        ]
    };

    myChart3.clear();
    myChart3.setOption(option3);
}






//前一天按项用电量对比   //饼图
function getPowerQualityData_FX() {
    myChart2.clear();
    totaltype = $("input[name='GraphType']:checked").val();
    //console.log(totaltype)
    var num = 0;
    switch (parseInt(totaltype)) {
        case 0:
            num = 3;//昨天总用电 饼图；
            titlePie = "昨天总用电";
            break;
        case 1:
            num = 14;
            titlePie = "上周总用电";
            break;
        case 2:
            num = 13;//上月总用电 饼图；
            titlePie = "上月总用电";
            break;
    }
    //console.log("num=" + num)
    $.post("/PowerQuality/getPowerQualityData_FX", {
        "pid": pid,
        "did": 0,
        "cid": 0,
        "totaltype": num,//小时用电量
        "datatypeid": 12,
        "datestart": "0",
        "dateend": "0",
        "aline": "0",
        "eline": "0",
        "userType": userType,
        "areaType": areaType,
        "itemType": itemType,
        "gradeType": gradeType,
        "startTime": $("#startTime").datebox("getValue"),
        "endTime": $("#endTime").datebox("getValue")

    }, function (data) {
        var DataJson = JSON.parse(data);


        PowerQualityData_FX(DataJson);
    });
}
function PowerQualityData_FX(DataJson) {
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
            name: "昨天用电分项统计 KW‧H",
            type: "pie",
            radius: ['50%', '70%'],
            data: DataJson.series1,//[{value: 10,name: "照明"}, {value: 10,name: "空调"}, {value: 30,name: "电梯"}, {value: 50,name: "其他"}],
            tooltip: {
                trigger: "item"
            }
        }],
        title: {
            text: titlePie,
            subtext: DataJson.total + "KW‧H",
            x: 'center',
            y: 'center'
        },
        legend: {
            data: DataJson.yAxis.split(','),//['照明', '空调', '电梯', '其他']
        },
        calculable: true
    };
    myChart2.clear();
    myChart2.setOption(option2);
}

//用电量实时曲线
function getPowerQualityData_SSQX() {
    myChart1.clear();
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
        "startTime": $("#startTime").datebox("getValue"),
        "endTime": $("#endTime").datebox("getValue")

    }, function (data) {
        var DataJson = JSON.parse(data);
        //if (DataJson.CName.length == 0) {
        //    $("#userCharts1").html("暂无数据");
        //} else {

        HourYdlGraph_SSQX(DataJson);
        //}
    });
}
function HourYdlGraph_SSQX(DataJson) {

    var Series = [];

    if (DataJson.xAxis != '') {
        $('#Error').hide();
        $("#userCharts1").show();
        //$('#Error').css('display', 'none');
        //$('#cavans').css('display', '');

        for (i = 0; i < DataJson.yData.length; i++) {
            var temp = DataJson.yData[i].split(",")
            var arr = []
            for (var j = 0; j < temp.length; j++) {
                arr.push(parseFloat(temp[j]).toFixed(2))

            }
            Series.push({
                name: DataJson.CName[i],
                type: "line",
                stack: DataJson.CName[i],                    
                smooth: true,
                areaStyle: {},
                //itemStyle: {
                //    normal: {
                //        areaStyle: {
                //            type: "default"
                //        }
                //    }
                //},
                data: arr,
                markPoint: {
                    data: [
                        {
                            type: 'max', name: '最大值'

                        },
                        {
                            type: 'min', name: '最小值'

                        }
                    ]
                },
            });
        }
        var option = {
            title: {
                show: false,
                text: "总用电趋势"
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
                showTitle: true,
                optionToContent: function (opt) {
                    let axisData = opt.xAxis[0].data; //坐标数据
                    let series = opt.series; //折线图数据
                    let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                    let tdBodys = ''; //数据
                    series.forEach(function (item) {
                        //组装表头
                        tdHeads += '<td style="padding: 0 10px">' + item.name + '</td>';
                    });
                    let table = '<div style="  display: block; width: 100%; overflow: auto; height: 270px;"><table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>' + tdHeads + ' </tr>';
                    for (let i = 0, l = axisData.length; i < l; i++) {
                        for (let j = 0; j < series.length; j++) {
                            //组装表数据
                            tdBodys += '<td>'+series[j].data[i]+'</td>';
                        }
                        table += '<tr><td style="padding: 0 10px">'+axisData[i]+'</td>'+tdBodys+'</tr>';
                        tdBodys = '';
                    }
                    table += '</tbody></table></div>';
                    return table;
                }
            },
            //calculable: true,
            xAxis: [{
                name: "Time",
                type: "category",
                boundaryGap: false,
                data: DataJson.xAxis.split(','),
                //axisLabel: {
                //    show: true,
                //    formatter: "{value}"
                //    //interval: 0 0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                //}
            }],
            yAxis: [{
                name: "KW‧H",
                type: "value",
                //axisLabel: {
                //    show: true,
                //    formatter: "{value}"
                //}
            }, ],
            dataZoom: [{
                type: 'inside',
                filterMode: 'filter'
            }],
            series: Series,
        };
        myChart1.clear();
        myChart1.setOption(option);
    }
    else {
        //alert(1);
        $("#userCharts1").hide();
        $('#Error').fadeIn();
    }
}


$('.GraphType').click(function () {
    $('#scroll').fadeOut();
    startdate = "";
    enddate = "";
    canAdd = 0;

    totaltype = $("input[name='GraphType']:checked").val();
    getPowerQualityData_SSQX();
    getPowerQualityData_PM();
    getPowerQualityData_FX();
});
function lock() {

    totaltype = $("input[name='GraphType']:checked").val();
    startdate = "";
    enddate = "";
    canAdd = 0;
    getPowerQualityData_SSQX();
    getPowerQualityData_PM();
    getPowerQualityData_FX();
}

function loadStationName() {
    //查询站室名称
    $('#StationName').combotree({
        url: '/Home/ComboTreeMenu?type=1',
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
                    if (node.id != -1) {
                        $.cookie('cookiepid', node.id, { expires: 7, path: '/' });
                    }
                    pid = node.id;
                    //

                    loadCircuitType(pid);
                    lock();
                }
            }
        },
        onLoadSuccess: function (data) {
            var gpid = $.cookie('cookiepid');
            //演示
            if (null != gpid)
                pid = gpid;
            else
                pid = gpid = 1;
            if (gpid != undefined) {
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
        onLoadSuccess: function (data) {
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
        onLoadSuccess: function (data) {
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
        onLoadSuccess: function (data) {
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




function unlock() {
    $('#StartDate').datebox({
        onSelect: function () { //输入判断
            datestart = $('#StartDate').datebox('getValue');
            dateend = $('#EndDate').datebox('getValue');
            if (datestart > dateend) {
                $('#EndDate').datebox('setValue', datestart);
                dateend = datestart;
            }
        }
    });
    $('#EndDate').datebox({
        onSelect: function () { //输入判断
            datestart = $('#StartDate').datebox('getValue');
            dateend = $('#EndDate').datebox('getValue');
            if (datestart > dateend) {
                $('#EndDate').datebox('setValue', datestart);
                dateend = datestart;
            }
        }
    });
    $('#scroll').fadeIn();
}