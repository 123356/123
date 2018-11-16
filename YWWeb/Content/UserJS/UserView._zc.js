$(function () {
    IsUn();
})
function IsUn(){
    $.post('/Home/GetUnitByUID', { 'id': id }, function (data) {
        if (data.Type == 1) {
            Getshuju();
            getKehuIndustryData_FX();
            $("#contid").show();
        } else {
            $("#contid").html("<p style='font-size: 43px;width: 1170px;text-align: center;'>暂无数据<p>");
            $("#contid").show();
        }
    })
}
function Getshuju() {
    $.post('/Home/GetPdfListByUID', { 'id': id }, function (data) {
        var html = "";
        $.each(data.list, function (index, val) {
            html += "<div class='col-md-3 column' onClick='SetPID(" + val.PID + ")' style='cursor:pointer; font-weight:bold;'>" + val.Name + "</div>";
        });
        $("#pCompanyName").html(data.unit.UnitName);
        $("#pPosition").html(data.unit.IndustryName);
        $("#pLinkMan").html(data.unit.InstalledCapacity);
        $("#pMobile").html(data.unit.EleCalWay);
        $("#pAreaID").html(data.unit.GovEleLevel);
        $("#hangye").html(data.unit.DeviationMode);
        $("#InstalledCapacity").html(data.unit.LinkMan);
        $("#EleCalWay").html(data.unit.LinkMobile);
        $("#GovEleLevel").html(data.unit.LinkPhone);
        $("#dizhi").html(data.unit.LinkAddress);
        $("#dianya").html(data.unit.dianya);
        $("#leibie").html(data.unit.DType);
        $("#content").html(html);
    })
}
function SetPID(a) {
    console.log(a+"+++++++++++++++++")
    $.cookie('cookiepid', a, { expires: 7, path: '/' });
    $("#main_frame", parent.document.body).attr("src", "/PowerQuality/Index?mid=21");
}


//客户信息统计--按行业  //饼图
function getKehuIndustryData_FX() {
    $.post("/Wx/getPowerRatePeak", {
        uid: id
    }, function (data) {
        var DataJson = JSON.parse(data);
        PowerKehuIndustryData_FX(DataJson.data);
        //PowerKehuAreaData_FX(DataJson.data);
        SetS(DataJson.data);
    });
}
function PowerKehuIndustryData_FX(DataJson) {
    var myChart1 = echarts.init(document.getElementById('userCharts1'));
    var v = [];
    var z = 0;
    if (DataJson.thisMonthC != null) {
        if (DataJson.thisMonthC.peak != 0) {
            v.push({ 'value': DataJson.thisMonthC.peak, 'name': '峰' });
        }
        if (DataJson.thisMonthC.valley != 0) {
            v.push({ 'value': DataJson.thisMonthC.valley, 'name': '谷' });
        }
        if (DataJson.thisMonthC.flat != 0) {
            v.push({ 'value': DataJson.thisMonthC.flat, 'name': '平' });
        }
        if (DataJson.thisMonthC.peakPeak != 0) {
            v.push({ 'value': DataJson.thisMonthC.peakPeak, 'name': '尖' })
        }
        z = (DataJson.thisMonthC.peak + DataJson.thisMonthC.valley + DataJson.thisMonthC.flat + DataJson.thisMonthC.peakPeak).toFixed(5);
    }
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
            name: "本月电量",
            type: "pie",
            radius: ['50%', '70%'],
            data: v,
            tooltip: {
                trigger: "item"
            }, itemStyle: {
                normal: {
                    label: {
                        show: false
                    }
                },

            },
        }],
        title: {
            text: z,
            textStyle: {
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'normal',
            },
            x: 'center',
            y: 'center'
        },
        legend: {
            data: ['峰', '谷', '平', '尖'],
        },
        calculable: true
    };
    myChart1.clear();
    myChart1.setOption(option1);
}
//function PowerKehuAreaData_FX(DataJson) {
//    var myChart2 = echarts.init(document.getElementById('userCharts2'));
//    var v = [];
//    var z = 0;
//    var can = [];
//    if (DataJson.thisMonthC != null) {
//        if (DataJson.thisMonthC.peakRate != 0) {
//            v.push({ 'value': DataJson.thisMonthC.peakRate, 'name': '峰' });
//        }
//        if (DataJson.thisMonthC.valleyRate != 0) {
//            v.push({ 'value': DataJson.thisMonthC.valleyRate, 'name': '谷' });
//        } if (DataJson.thisMonthC.flatRate != 0) {
//            v.push({ 'value': DataJson.thisMonthC.flatRate, 'name': '平' });
//        }
//        if (DataJson.thisMonthC.peakPeakRate != 0) {
//            v.push({ 'value': DataJson.thisMonthC.peakPeakRate, 'name': '尖' });
//        }
//        z = (DataJson.thisMonthC.peakRate + DataJson.thisMonthC.flatRate + DataJson.thisMonthC.valleyRate + DataJson.thisMonthC.peakPeakRate).toFixed(5);
//    }
//    var option2 = {
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
//            name: "本月电费",
//            type: "pie",
//            radius: ['50%', '70%'],
//            data: v,
//            tooltip: {
//                trigger: "item"
//            },
//            itemStyle: {
//                normal: {
//                    label: {
//                        show: false
//                    }
//                },

//            },
//        }],
//        title: {
//            text: z,
//            textStyle: {
//                fontFamily: 'Arial, Verdana, sans...',
//                fontSize: 12,
//                fontStyle: 'normal',
//                fontWeight: 'normal',
//            },
//            x: 'center',
//            y: 'center'
//        },
//        legend: {
//            data: ['峰', '谷', '平', '尖'],
//        },
//        calculable: true
//    };
//    myChart2.clear();
//    myChart2.setOption(option2);
//}
function SetS(data) {
    var Tdianliang = 0;
    //var Tdianfei = 0;
    var Ldianliang = 0;
    var Ydianliang = 0;
    if (data.thisMonthC != null) {
        Tdianliang = data.thisMonthC.peak + data.thisMonthC.valley + data.thisMonthC.flat + data.thisMonthC.peakPeak;
        //Tdianfei = data.thisMonthC.peakRate + data.thisMonthC.flatRate + data.thisMonthC.valleyRate + data.thisMonthC.peakPeakRate;
    }
    if (data.lastMonthC != null) {
        Ldianliang = data.lastMonthC.peak + data.lastMonthC.valley + data.lastMonthC.flat + data.lastMonthC.peakPeak;
    }
    if (data.thisYearC != null) {
        Ydianliang = data.thisYearC.peak + data.thisYearC.valley + data.thisYearC.flat + data.thisYearC.peakPeak;
    }
    //html = '<tr>';
    //html += '<td rowspan="4" style="text-align:center;vertical-align:middle;"><i style="font-size:40px;font-weight:bold">' + Tdianfei.toFixed(5) + '</i><br />本月电费 元</td>';
    //html += '</tr>'
    html = '<tr>'
    html += '<td>本月电量：' + Tdianliang.toFixed(5) + 'MW·H</td>'
    html += '</tr>'
    html += '<tr><td>上月电量：' + Ldianliang.toFixed(5) + 'MW·H</td></tr>'
    html += '<tr><td>今年电量：' + Ydianliang.toFixed(5) + 'MW·H</td></tr>'
    $("#conS").html(html);
}