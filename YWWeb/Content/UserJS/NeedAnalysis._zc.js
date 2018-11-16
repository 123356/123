
//装机容量负载率
var nums = 0;

//加载显示需量表格
function Show() {
    $('#list_data').datagrid({
        url: '/ES/GetNeedPowerList?Rnum=' + Math.random(),
        queryParams: { "UnitID": $("#UnitID").combobox("getValue") }
    });
    $('#list_data').datagrid('uncheckAll');
}

function xuxian(ids)
{
    
    $.ajax({
        url: '/ES/UnitComboDatas2',
        data:{
            id:ids
        },
        datatype:"json",
        type: "get",
        success: function (data) {
            nums = 0;
            var DataJson = JSON.parse(data);
            var dd= getHsonLength(DataJson)
            for (var i = 1; i < dd; i++) {
                if (DataJson[i].InstalledCapacitys != "")
                {
                    nums += parseInt( DataJson[i].InstalledCapacitys);
                }
            }
            
            
        }
    })
}

function getHsonLength(json) {
    var jsonLength = 0;
    for (var i in json) {
        jsonLength++;
    }
    return jsonLength;
}
$(function () {
    $.ajax({
        url: "/ES/UnitComboDatas?isall=" + "true",
        dataType: "json",
        success: function (objs) {
             
            $("#UnitID").combobox({
                // url: "/ES/UnitComboDatas?isall=" + "false",
                data:objs,
                valueField: 'UnitID',
                textField: 'UnitName',
                //panelHeight: 'auto',
                editable: true,
                onLoadSuccess: function () { //数据加载完毕事件

                    var data = $('#UnitID').combobox('getData');

                    //for (var i = 0; i < data.length; i++) {

                    //}

                    if (data.length > 0) {
                        $("#UnitID").combobox('select', data[0].UnitID);

                    }
                  
                    // $("#UnitID").append("<option value=''>全部</option>")
                },
                onChange: function (n, o) {
                   
                    xuxian(n)
                    getNeedPowerData_XLMonthly();
                    Show();
                }
            });
        }
    })
  
     
})

$('.GraphType').click(function () {
    var totaltype = $("input[name='GraphType']:checked").val();
    getNeedPowerData_XLMonthly();

});


var myChart1 = echarts.init(document.getElementById('userCharts1'));

//用电需量折线图

function getNeedPowerData_XLMonthly() {
    var totaltype = $("input[name='GraphType']:checked").val();
    myChart1.clear();
    $.post("/Es/GetNeedPowerDataMonthly", {
        "cid": 0,
        "totaltype": totaltype,
        "datestart": "0",
        "dateend": "0",
        "unit": $("#UnitID").combobox("getValue")

    }, function (data) {
        var DataJson = JSON.parse(data);
        NeedPower_XLMonthly(DataJson);
    });
}

function NeedPower_XLMonthly(DataJson) {
     
    var Series = [];
    if (DataJson.xAxis != '') {
        for (i = 0; i < DataJson.yData.length; i++) {
            var max = nums * 0.67;
            var min = nums * 0.40;
            var needs = DataJson.yData[i].split(',');
             
            Series.push({
                name: DataJson.CName[i],
                type: "line",
                stack: "总量",
                areaStyle: { normal: {} },
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: "default"
                        }
                    }
                },
                markLine: {
                    silent: true,
                    data: [{ name: '负载率', yAxis: max }, { name: '负载率', yAxis: min }]
                },
                data: needs,
               

            });
        }
        var option = {
            title: {
                text: '折线图堆叠',
                textStyle: {
                    //fontWeight: 'normal',              //标题颜色  
                    color: '#fff'
                },
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: DataJson.CName,
                textStyle: {    //图例文字的样式
                    fontSize: 12
                }
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                        title: { back: '' },
                        icon: { back: 'image://' }//区域缩放
                    },
                    restore: {
                        show: true// 还原
                    },
                    mark: {
                        show: true// 辅助线标志
                    },
                    dataView: {
                        show: true,
                        readOnly: true,// 数据视图
                    },
                    magicType: {
                        show: true,
                        type: ["line", "bar", "stack", "tiled"]
                    },
                    saveAsImage: {
                        show: true// 保存为图片
                    }

                },
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
                            tdBodys += '<td>' + series[j].data[i] + '</td>';
                        }
                        table += '<tr><td style="padding: 0 10px">' + axisData[i] + '</td>' + tdBodys + '</tr>';
                        tdBodys = '';
                    }
                    table += '</tbody></table></div>';
                    return table;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    color: '#fff',
                    data: DataJson.xAxis.split(','),
                    axisLabel: {
                        color: "#fff"  //刻度线标签颜色
                    }
                },

            ],
            yAxis: [
                {
                    name: 'KW',
                    type: 'value',
                    axisLabel: {
                        color: "#fff"  //刻度线标签颜色
                    }
                }
            ],
            series: Series
        };
        if (option && typeof option === "object") {
            myChart1.setOption(option, true);
        }
    }
    nums = 0;
}