//pmt

//竖井
function RealTempMap() {
    var url = "/PDRInfo/RealTempMap";
    top.openDialog(url, "RealTempMap", "竖井", 1450, 700, 50, 50);
}
//打开视频监控信息
function ShowMeVideo(V) {
    var url = "/PDRInfo/RealTimeVideo?pid=" + pid + "&drv=" + V; //V为视频的通道号
    top.openDialog(url, 'RealTimeVideo', '实时视频监控', 1450, 770, 50, 50)
}
//左上角的最高温度监测点
$.post("/PDRInfo/GetMaxTempInfo", { "pid": pid }, function (data) {
    //添加最高温度的提示
    if (pid == 105) {
        var revalue = data.split('$');
        $("#contentmain").html(revalue[0]);
        $("#d" + revalue[1]).html("<i class=\"tmax_location defaultcursor\"></i>");
    }
    else
        $("#contentmain").html(data);
});
showAlarmInfo();
//实时报警更新
var timeTicket;
function showAlarmInfo() {
    clearInterval(timeTicket);
    timeTicket = setInterval(function () {
        /*
        if (alarmid != "") {
            var arrid = alarmid.split(',');
            for (var i = 0; i < arrid.length; i++) {
                $("#d" + arrid[i]).css("background-image", "url(/Content/pingmiantu/" + arrid[i] + ".png)");
            }
        }*/
        alarmState();
        doorStatus();
    }, 2000);
}
//查看设备详情
function deviceinfo(did) {
    var fullurl = "/DeviceManage/Index?did=" + did + "&pid=" + pid + "&sid=0";
    myWindow = window.open(fullurl, '', 'width=1200,height=1000,toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
    myWindow.focus();
}

//查看视频
function video(srcId) {
    var url = "/DeviceManage/Video?srcId=" + srcId;
    //window.open(url);
    myWindow = window.open(url, '', 'width=1200,height=800,location=no');
    myWindow.focus();
    //top.openDialog(url, 'Video', '实时视频监控', 1200, 800, 50, 50)
    console.log("video=" + srcId)
}

function changeDoor(doorId) {
    var x;
    var r = confirm("是否开门？");
    if (r == true) {
        changeDoorStatus(doorId);
    }
    else {
        console.log("cancel")
    }
}

function changeDoorStatus(doorId) {
    var postData = {
        doorId: doorId
    };
    $.post("/DeviceManage/changeDoorStatus", postData, function (data) {
        console.log(data)
    });
}

var alarmJson = "", alarmid = "", taglist = "";
function doorStatus() {
    $.get("/DeviceManage/getDoorsStatus", null, function (data) {
        //console.log(data)
        var oo = $.parseJSON(data)
        for (var i = 0; i < oo.listDoors.length; i++) {
            if (oo.listDoors[i].DoorStatus == 0) {
                $("#door" + oo.listDoors[i].DoorId).css("background-image", "url(/Content/pingmiantu/关门_.png)");
            } else {

                console.log('door' + oo.listDoors[i].DoorId + "," + oo.listDoors[i].DoorStatus)
                $("#door" + oo.listDoors[i].DoorId).css("background-image", "url(/Content/pingmiantu/开门_.png)");
            }
        }
        //console.log(oo)
    })
   // console.log("doorStatus")
}
function alarmState() {
    $.ajaxSettings.async = false;  //同步才能获取数据
    $.post("/SysInfo/getDAlarmState", { "pid": pid }, function (data) {
        alarmid = "";
        alarmJson = eval("(" + data + ")");
        if ("null" === data)
            return;
        $.each(alarmJson, function (i) {
            var jsonlist = alarmJson[i];
            var adid, astate;
            for (var jcount = 0; jcount < jsonlist.length; jcount++) {
                adid = jsonlist[jcount].DID;
                astate = jsonlist[jcount].AlarmState;
                if (jcount == 0)
                    alarmid = alarmid + adid;
                else
                    alarmid = alarmid + "," + adid;
               // $("#d" + adid).css("background-image", "url(/Content/pingmiantu/" + adid + "_" + astate + ".png)");
                var imgurl = $("#d" + adid).css("background-image"); //获取背景图
                if (astate != "0" && astate != "")//更改背景图片
                {
                    //防止重复刷新
                    if (imgurl!=undefined&&imgurl.indexOf("_1") < 0 && imgurl.indexOf("_2") < 0 && imgurl.indexOf("_3") < 0) {
                        //获取程序识别的ImageUrl
                        imgurl = imgurl.replace("http://" + window.location.host, "").replace(".png", "_" + astate + ".png");
                        $("#d" + adid).css("background-image", imgurl); //赋值
                    }
                }
            }
        });
    });
}
//开关量显示
if (pid == 105) {
    $.post("/PDRInfo/getSwitchInfo", { "pid": pid }, function (data) {
        var arrswitch = eval("(" + data + ")");
        $.each(arrswitch, function (i) {
            $("#d" + arrswitch[i]).css("background-image", "url(/Content/pingmiantu/p105/" + arrswitch[i] + "_1.gif)");
            if (arrswitch[i] == 478) {
                $(".tb_pfj").css("background-image", "url(/Content/pingmiantu/p105/pfj_1.gif)");
            }
        });
    });
}
//分辨率小于1920缩放
if (window.screen.availWidth < 1920) {
    var mul = document.body.offsetWidth / window.screen.availWidth;
    mul = mul * 0.75;

    var topMul = mul * 100;
    var leftMul = mul * 200;
    
    $("body").css({ "-webkit-transform": "scale(" + mul + ")", "margin-top": "-7em", "width": "auto" });
    $("#contentmain").css({ "left": "-217px", "top": "70px" });
    $(".pmmain").css({ "left": "-" + leftMul + "px", "top": "" + topMul + "px" });
}