$(function () {

    myChart1 = echarts.init(document.getElementById('userCharts1'));
    loadSelectUnit();
})
//加载客户下拉框
function loadSelectUnit() {

    $("#unitselect").combobox({
        url: "/ES/UnitComboData?isall=" + "false",
        valueField: 'UnitID',
        textField: 'UnitName',
        editable: true,
        width: 300,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#unitselect').combobox('getData');
            if (data.length > 0) {
                $("#unitselect").combobox('setValue', data[0].UnitID);
            }
            loadSelectPZ();
        }
        , onSelect: function (n) {
            dosearch();
        }
    });

}
//加载品种下拉框
function loadSelectPZ() {

    $("#pzselect").combobox({
        url: "/ES/BindCategory?isall=" + "true",
        valueField: 'id',
        textField: 'category_name',
        editable: true,
        width: 300,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#pzselect').combobox('getData');
            if (data.length > 0) {
                $("#pzselect").combobox('select', data[0].id);
            }
        },
        onChange: function (n, o) {
            //console.log(o);
            dosearch();
        }
    });

}

function dosearch() {

    $.post("/Es/getPianCha", {
        "uid": $("#unitselect").combobox('getValue'),
        "pz": $("#pzselect").combobox('getValue'),
        "startTime": $("#startTime").datebox("getValue"),
        "endTime": $("#endTime").datebox("getValue")
    }, function (data) {
        var DataJson = JSON.parse(data);
        HourYdlGraph_SSQX(DataJson);
        
    });
}
function HourYdlGraph_SSQX(DataJson) {
    var Series = [];
    var max = 0; min = 0;
    if (DataJson.xAxis != '') {
        $('#Error').css('display', 'none');
        $('#cavans').css('display', '');
        for (i = 0; i < DataJson.yData.length; i++) {
            max = Math.max.apply(null, DataJson.yData[i].split(',')) * 1.23;
            min = Math.max.apply(null, DataJson.yData[i].split(',')) * 0.77;
            Series.push({
                name: DataJson.CName[i],
                type: "line",
                tiled: "总量",
                smooth: true,
                //itemStyle: {
                //    normal: {
                //        areaStyle: {
                //            type: "default"
                //        }
                //    }
                //},
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
                        yAxis: max
                    }, {
                        yAxis: min
                    }]
                }
            });
        }
        var option = {
            title: {
                show: true,
                text: "偏差率"
            },
            tooltip: {
                trigger: "axis",
                //axisPointer: {
                //    type: 'cross',
                //    label: {
                //        backgroundColor: '#6a7985'
                //    }
                //}
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
                axisLabel: {
                    show: true,
                    formatter: "{value}"
                }
            }],
            yAxis: [{
                //min: 173,
                //max: 287,
                name: "kV",
                type: "value",
                axisLabel: {
                    show: true,
                    formatter: "{value}%"
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