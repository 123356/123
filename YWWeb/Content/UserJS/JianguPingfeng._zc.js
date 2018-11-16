$("#currPosition", window.top.document).html("当前位置：电能 > 尖谷平峰"); 
var myChart = echarts.init(document.getElementById('userCharts1'));
var myChart2 = echarts.init(document.getElementById('userCharts2'));
var myChart3 = echarts.init(document.getElementById('userCharts3'));
var DataJson = "", pid = 0, did = 0, type = 144, sd = "", ed = "";
function test() {
    var img = new Image();
    img.src = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#000'
    });
    $('#test').html(img.src);
    $.post("/FileUpload/SaveImage", { "IS": img.src ,"did":1,"index":1}, function (data) { });
}
$("#SPID").combotree({
    url: "/BaseInfo/PdrDevComboTreeMenu",
    onClick: function (node) {
        if (!$(this).tree('isLeaf', node.target)) {
            //                $('#SPID').combo('showPanel');
            //                $('#SPID').combotree('tree').tree("expand", node.target); //展开
            pid = node.id;
            did = 0;
            DoSearch();
            $.cookie('cookiepid', pid, { expires: 7, path: '/' });
        }
        else {
            pid = node.id.split('_')[0];
            did = node.id.split('_')[1];
            $('#cob').html("当前对象：" + child[0].text);
            DoSearch();
            $.cookie('cookiepid', pid, { expires: 7, path: '/' });
        }
    },
    onLoadSuccess: function (data) {
        $('#SPID').combotree('tree').tree("collapseAll");
        var roots = $('#SPID').combotree('tree').tree('getRoots');
        var Index = 0;
        for (i = 0; i < roots.length; i++) {
            if (roots[i].id == $.cookie('cookiepid'))
                Index = i;
        }
        var child = $('#SPID').combotree('tree').tree('getChildren', roots[Index].target);
        pid = child[0].id.split('_')[0];
        did = child[0].id.split('_')[1];
        $('#cob').html("当前对象：" + child[0].text);
        $('#SPID').combotree('setValue', child[0].id);
        $('#SPID').combotree('tree').tree("expand", roots[Index].target);
        DoSearch();
    }
});
function DoSearch() {
    type = $("input[name='GraphType']:checked").val();
    sd = $('#StartDate').datebox('getValue');
    ed = $('#EndDate').datebox('getValue');
    if (type != 707) {
        $('#scroll').fadeOut();
    }
    else {
        if (sd == "") {
            $.messager.alert("提示", "请选择开始日期！", "info");
            return false;
        }
        else if (ed == "") {
            $.messager.alert("提示", "请选择结束日期！", "info");
            return false;
        }
    }
    LoadView();
    Contrast();
}
function FadeIn() { $('#scroll').fadeIn(); }
function LoadView() {
    $.post("/EnergyEfficiency/JGPFData", { "pid": pid, "did": did, "Graphtype": type, "startdate": sd, "enddate": ed }, function (data) {
        DataJson = JSON.parse(data);
        var option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow"
                }
            },
            legend: {
                data: ["平", "峰", "尖", "谷"],
                padding: 20,
                borderColor: "#ccc",
                textStyle: {
                    color: "rgb(255, 255, 255)"
                },
                x: "center",
                y: "top",
                orient: "horizontal"
            },
            toolbox: {
                show: false,
                orient: "vertical",
                x: "right",
                y: "center",
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: true
                    },
                    magicType: {
                        show: false,
                        type: ["line", "bar", "stack", "tiled"]
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: true,
            xAxis: [
    {
        type: "category",
        data: DataJson.Date.split(','),
        splitLine: {
            lineStyle: {
                color: "rgb(51, 51, 51)"
            },
            show: false
        },
        axisLabel: {
            textStyle: {
                color: "rgb(255, 255, 255)"
            }
        },
        axisLine: {
            lineStyle: {
                color: "rgb(255, 255, 255)",
                width: 1
            }
        }
    }
            ],
            yAxis: [
    {
        type: "value",
        axisLine: {
            lineStyle: {
                color: "rgb(255, 255, 255)",
                width: 1
            }
        },
        axisLabel: {
            textStyle: {
                color: "rgb(255, 255, 255)"
            }
        },
        splitLine: {
            lineStyle: {
                color: "rgb(51, 51, 51)",
                width: 1,
                type: "dashed"
            },
            show: true
        },
        name: "能耗(kWh)",
        nameTextStyle: {
            color: "rgb(255, 255, 255)"
        },
        axisTick: {
            show: false
        }
    }
            ],
            series: [
    {
        name: "平",
        type: "bar",
        data: DataJson.Ping.split(','),
        itemStyle: {
            normal: {
                label: {
                    show: false
                }
            }
        },
        barWidth: 80,
        stack: "平峰尖谷"
    },
    {
        name: "峰",
        type: "bar",
        stack: "平峰尖谷",
        data: DataJson.Feng.split(',')
    },
    {
        type: "bar",
        name: "尖",
        data: DataJson.Jian.split(','),
        stack: "平峰尖谷"
    },
    {
        type: "bar",
        name: "谷",
        data: DataJson.Gu.split(','),
        stack: "平峰尖谷"
    }
            ],
            color: ["rgb(51, 103, 153)", "rgb(50, 203, 51)", "rgb(255, 152, 49)", "rgb(254, 101, 7)"],
            backgroundColor: "#17689d",
            grid: {
                x: 60,
                y: 50,
                x2: 40,
                y2: 40
            }
        };
        myChart.setOption(option);

        var option2 = {
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}({d}%)"
            },
            legend: {
                orient: "vertical",
                x: "30%",
                data: ["平：" + DataJson.Total[2] + "kWh", "峰：" + DataJson.Total[3] + "kWh", "尖：" + DataJson.Total[0] + "kWh", "谷：" + DataJson.Total[1] + "kWh"],
                textStyle: {
                    color: "rgb(255, 255, 255)"
                },
                padding: 15,
                y: "center"
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: true
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: true,
            series: [
    {
        name: "能耗总量",
        type: "pie",
        radius: ["50%", "70%"],
        itemStyle: {
            normal: {
                label: {
                    show: false,
                    formatter: "{a}",
                    position: "left"
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                label: {
                    show: true,
                    position: "center",
                    textStyle: {
                        fontSize: "30",
                        fontWeight: "bold"
                    }
                }
            }
        },
        data: [
            {
                value: DataJson.Total[2],
                name: "平：" + DataJson.Total[2] + "kWh"
            },
            {
                value: DataJson.Total[3],
                name: "峰：" + DataJson.Total[3] + "kWh"
            },
            {
                value: DataJson.Total[0],
                name: "尖：" + DataJson.Total[0] + "kWh"
            },
            {
                value: DataJson.Total[1],
                name: "谷：" + DataJson.Total[1] + "kWh"
            }
        ],
        center: ["60%", "50%"]
    }
            ],
            backgroundColor: "#17689d",
            title: {
                text: "能耗总量",
                textStyle: {
                    color: "rgb(255, 255, 255)"
                },
                padding: 15
            },
            color: ["rgb(51, 103, 153)", "rgb(50, 205, 52)", "rgb(249, 152, 71)", "rgb(255, 102, 0)"]
        };
        myChart2.setOption(option2);

        DataGird();
    });
}
function DataGird() {
    var DOM = "";
    var ZH = 0;
    var jian = DataJson.Jian.split(','), gu = DataJson.Gu.split(','), ping = DataJson.Ping.split(','), feng = DataJson.Feng.split(','), date = DataJson.Date.split(',');
    for (i = 0; i < DataJson.Count; i++) {
        var zh = parseFloat(jian[i]) + parseFloat(gu[i]) + parseFloat(ping[i]) + parseFloat(feng[i]);
        ZH += zh;
        DOM += "<tr><td align='center'>" + date[i] + "</td><td align='center'>" + zh + "</td><td align='center'>" + jian[i] + "</td><td align='center'>" + feng[i] + "</td><td align='center'>" + ping[i] + "</td><td align='center'>" + gu[i] + "</td></tr>";
    }
    DOM += "<tr><td align='center'>总计</td><td align='center'>" + ZH + "</td><td align='center'>" + DataJson.Total[0] + "</td><td align='center'>" + DataJson.Total[3] + "</td><td align='center'>" + DataJson.Total[2] + "</td><td align='center'>" + DataJson.Total[1] + "</td></tr>";
    $('#list').html(DOM);
}
function Contrast() {
    $.post("/EnergyEfficiency/JGPFContrast", { "pid": pid, "did": did, "Graphtype": type, "startdate": "", "enddate": "" }, function (data) {
        DataJson = JSON.parse(data);
        var option3 = {
            title: {
                text: "能耗对比",
                textStyle: {
                    color: "rgb(255, 255, 255)"
                },
                padding: 15
            },
            tooltip: {
                trigger: "axis",
                show: true
            },
            legend: {
                data: ["去年同期", "上月同期", "本期"],
                textStyle: {
                    color: "rgb(255, 255, 255)"
                },
                x: "center",
                y: "top",
                orient: "horizontal",
                padding: 30
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: true
                    },
                    magicType: {
                        show: false,
                        type: ["line", "bar"]
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
            xAxis: [
    {
        type: "category",
        data: ["尖", "峰", "平", "谷"],
        axisLabel: {
            textStyle: {
                color: "rgb(255, 255, 255)"
            },
            show: true
        },
        splitLine: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: "rgb(255, 255, 255)",
                width: 1
            }
        },
        axisTick: {
            show: false
        }
    }
            ],
            yAxis: [
    {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLabel: {
            textStyle: {
                color: "rgb(255, 255, 255)"
            },
            show: true,
            formatter: "{value}"
        },
        splitLine: {
            show: false
        },
        nameTextStyle: {
            color: "rgb(255, 255, 255)",
            fontSize: 14
        },
        axisLine: {
            show: true,
            lineStyle: {
                width: 1,
                color: "rgb(255, 255, 255)"
            }
        },
        axisTick: {
            show: false
        },
        nameLocation: "end"
    }
            ],
            series: [
    {
        type: "bar",
        name: "去年同期",
        data: DataJson.lastYear,
        itemStyle: {
            normal: {
                label: {
                    show: false,
                    position: "right",
                    formatter: "{c} kW",
                    textStyle: {
                        color: "rgb(255, 255, 255)"
                    }
                }
            }
        }
    },
    {
        type: "bar",
        name: "上月同期",
        data: DataJson.lastMonth
    },
    {
        type: "bar",
        name: "本期",
        data: DataJson.thisTime
    }
            ],
            backgroundColor: "#17689d",
            color: ["rgb(51, 103, 153)", "rgb(51, 204, 51)", "rgb(252, 155, 50)"],
            grid: {
                x: 74,
                y: 76,
                x2: 33,
                y2: 60,
                borderWidth: 0
            }
        };
        myChart3.setOption(option3);

    });
}