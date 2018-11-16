$(function () {
    getPdfData_PM();
})
//var myChart = echarts.init(document.getElementById('userCharts1'));
function getPdfData_PM() {
    //myChart.clear();


    $.post("/Home/GetPDFTypeCharts", {

    }, function (data) {
        //console.log(data);
        PdfData_PM(data.tubiao, data.count);
    });
}

function PdfData_PM(data,dataAlarm) {
    var can = [];
    var shuju = [];
    var sumCounts = 0;
    var html = "";
    $.each(data, function (index, val) {
        can.push(val.Name);
        var obj = { value: val.sums, name: val.Name }
        shuju.push(obj);
        sumCounts += val.sums;

       html+=" <div class='col col-lg-4'><p class='num'>"+val.sums+"</p><span>"+val.Name+"</span></div>"
    })
    $(".site").find("h1").html(sumCounts + "<span>个</span>");
    $(".site .row").html(html);
    $(".operation .row .col").eq(0).find("num").html(dataAlarm.alarmCount);
    $(".operation .row .col").eq(1).find("num").html(dataAlarm.communicationCount);
    $(".operation .row .col").eq(2).find("num").html(dataAlarm.bugCount);
    //var option = {
    //    tooltip: {
    //        trigger: "item",
    //        formatter: "{a} <br/>{b} : {c} ({d}%)",
    //        show: true,
    //        textStyle: {
    //            color: "#fff",
    //            fontSize: 12
    //        }
    //    },
    //    color: ['#4eab50', '#c2353a', '#b3b3b3'],
    //    legend: {
    //        orient: "vertical",
    //        x: "right",
    //        data: can,
    //        y: "top",
    //        textStyle: {
    //            color: "#ccc",
    //            fontSize: 12,
    //            fontStyle: "normal",
    //            fontWeight: "normal",
    //            align: "center",
    //            baseline: "middle"
    //        },
    //        padding: [30, 50, 0, 50],
    //        itemWidth: 20,
    //        itemHeight: 10,
    //        itemGap: 8
    //    },
    //    toolbox: {
    //        show: false,
    //        feature: {
    //            dataView: {
    //                readOnly: true
    //            }
    //        },
    //        showTitle: true,
    //        textStyle: {
    //            fontSize: 12,
    //            fontStyle: "normal",
    //            fontWeight: "normal"
    //        }
    //    },
    //    calculable: true,//饼图外边框
    //    series: [
    //        {
    //            name: "站情况",
    //            type: "pie",
    //            radius: ["45%", "60%"],
    //            itemStyle: {
    //                //普通样式
    //                normal: {
    //                    label: {
    //                        show: false
    //                    },
    //                    labelLine: {
    //                        show: false
    //                    },
    //                    borderWidth: 0,
    //                    borderColor: "rgba(0, 0, 0, 0)"
    //                },
    //                //强调样式
    //                emphasis: {
    //                    label: {
    //                        show: false,
    //                        position: 'inner',
    //                        textStyle: {
    //                            align: 'center',
    //                            fontSize: 14,
    //                            fontWeight: "bold",
    //                            fontStyle: "normal",
    //                            color: "rgb(255, 255, 255)"
    //                        }
    //                    },
    //                }
    //            },
    //            data: shuju,
    //            center: ["35%", "40%"]
    //            ,
    //            selectedOffset: 10,
    //            startAngle: 90
    //        }
    //    ],
    //    /*
    //    title: {
    //        text: "站点",
    //        textStyle: {
    //            fontSize: 14,
    //            color: "rgb(255, 255, 255)",
    //            fontWeight: "bolder",
    //            fontStyle: "normal"
    //        },
    //        padding: 15
    //    },
    //    */
    //    //backgroundColor: "rgb(0, 0, 0)",
    //    //color: ['#82b2ad', '#6d89be', '#99ded5'],

    //};
    //myChart.clear();
    //myChart.setOption(option);
}