function chgPwd() {
    var url = "/UserInfo/ChangePwd";
    top.openDialog(url, 'ChangePassword_Form', '修改密码', 400, 280, 50, 50);
}

function LoginOut() {
    var url = "/Home/ExitSystem";
    top.openDialog(url, 'ChangePassword_Form', '注销用户', 350, 150, 50, 50);
}

/*实时报警*/
var audio = document.createElement("audio");
var timeTicket;
var playList = ["/Content/wav/have.mp3"]//有
var alarmInf = "";
var alarmInfOrder = "";
var alarmInfBug = "";
var alarmAllInfo = "";
var timesInfos = "";
var contep = "";
var timeTicket1;

clearInterval(timeTicket);
timeTicket = setInterval(function () {
    alarmState();
    //alarmSysState();
   
    getOrderState();
    showAlarmWindow();
    //getOrderTimes();
    //ConTep();

}, 5000);
clearInterval(timeTicket1);
timeTicket1 = setInterval(function () {
    getOrderTimes();
    ConTep();
    getBugState();
}, 10000);
getOrderTimes();
alarmState();
getBugState();
getOrderState();
showAlarmWindow();
ConTep();

function ConTep() {
    $.post("/SysInfo/GetConTep", function (data) {
        var objs = JSON.parse(data);
        //console.log(objs);
        if (objs) {
            var sTemBug = "<a href=\"/Es/EnergyContract\" target=\"main_frame\" >有能源合同项即将到期，请立即处理...</a>";
            if (contep == sTemBug)
                return;
            contep = sTemBug;
            objs = null;
        } else {
            contep = "";
        }
    }, "text");
}
function showAlarmWindow() {
    playList.length = 1;
    var sArarmTem = "", sArarmMp3Name = "";

    if (alarmInf.length > 0) {
        sArarmTem = sArarmTem  + alarmInf;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/alarm.mp3")//报警
        $("#alarmDetail").attr("onclick","location.href='/AlarmManage/Index?pid=0'")
    } else {
        sArarmMp3Name += "0";
    }
    if (alarmInfOrder.length > 0) {
        sArarmTem = sArarmTem + alarmInfOrder;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/apply.mp3")//工单
        $("#alarmDetail").attr("onclick", "location.href='/Orderinfo/OrderList'")
    } else {
        sArarmMp3Name += "0";
    }
    if (alarmInfBug.length > 0) {
        sArarmTem = sArarmTem  + alarmInfBug;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/bug.mp3")//隐患
        $("#alarmDetail").attr("onclick", "location.href='/PerationMaintenance/HazardMan'")
    } else {
        sArarmMp3Name += "0";
    }
    if (timesInfos.length > 0) {
        sArarmTem = sArarmTem  + timesInfos;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/constract.mp3")//合同
        $("#alarmDetail").attr("onclick", "location.href='/PerationMaintenance/Index?mid=437'")
    } else {
        sArarmMp3Name += "0";
    }

    if (playList.length > 1) {
        playList.push("/Content/wav/now.mp3")//请立即处理
    }

    if (contep.length > 0) {
        sArarmTem = sArarmTem + contep;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/nengyuan.mp3")//合同
        $("#alarmDetail").attr("onclick", "location.href='/Es/EnergyContract'")
    } else {
        sArarmMp3Name += "0";
    }


    if (sArarmTem == alarmAllInfo)
        return;
    alarmAllInfo = sArarmTem;
    if (playList.length > 1) {
        play(audio, playList)
    } else {
        audio.pause();
        $(".alarm_popups_box").fadeOut();
        return
    }
    $("#alarm_content").html($(sArarmTem));
}
var i = -1
function play(audio) {
    $(".alarm_popups_box").fadeIn();
    playm(audio)
}

function playm(audio) {
    i++
    if (i == playList.length) i = 0
    audio.src = playList[i];
    audio.play();
    audio.onended = function () {
        playm(audio)
    };
}
var dd = ''
function getOrderTimes() {
    $.post("/Home/getConstractOrdersByUser", function (data) {
        if (data != "no") {
            if (dd == '' || dd != data) {
                dd = data;
                list = JSON.parse(data);
                timesInfos = "";
                show(list)
            }
        }
    });
}

function show(array) {
    if (array.length > 0) {
        var info = "<a href=\"/PerationMaintenance/Index?mid=437\" target=\"main_frame\" >有<span class=\"am-badge am-badge-success am-round item-feed-badge\" id=\"orderConstractNum\">" + array.length + "</span>条【合同工单】7天内需要下发...</a>";
        timesInfos = timesInfos + info
        showAlarmWindow()
    }
}

function alarmState() {
    $.post("/Home/getPtAlarmInfo", "", function (data) {
        if (1 == data.indexOf("<")) {
            {
                if (alarmInf == data)
                    return;

                alarmInf = data;
                var sf = "id=\"alarmNum\">";
                var is = data.indexOf(sf);
                var ie = data.indexOf("</span>条【监测报警】");
                var val = data.substring(is + sf.length, ie);
                var text = "<span class=\"am-badge am-badge-warning am-round item-feed-badge\" id=\"alarmNum\">" + val + "</span>";
                $("#alarmNum").remove();//移除历史
                $("#alarmIcon").append(text);
            }
        }
        else if (data == "error") {
            alarmInf = "";
            window.location.href = "/Home/Login";
        }
        else {
            $("#alarmNum").remove();
            alarmInf = "";
        }
    }, "text");
}
function alarmSysState() {
    $.post("/Home/GetSysAlarmInfo", "", function (data) {
        $("#m_normal").html(data);
    }, "text");
}
function getBugState() {
    $.post("/PerationMaintenance/GetBugListData", { HandeSituation: '未审核' }, function (data) {
        var objs = JSON.parse(data);
        var text = "";
        $("#bugNum").remove();//移除历史
        if (objs.length > 0) {
            text = objs[0];
            $("#bugIcon").append(text);

            var sTemBug = "<a href=\"/PerationMaintenance/HazardMan\" target=\"main_frame\" >有" + text + "条【隐患上报】请立即处理...</a>";
            if (alarmInfBug == sTemBug)
                return;
            alarmInfBug = sTemBug;
        } else {
            alarmInfBug = "";
        }

        objs = null;
    }, "text");
}
function getOrderState() {
    $.post("/OrderInfo/GetOrderListData", "", function (data) {
        var objs = JSON.parse(data);
        var text = "";
        $("#orderNum").remove();//移除历史
        if (objs.length > 0) {
            text = objs[0];
            $("#orderIcon").append(text);

            var sTemOrder = "<a href=\"/Orderinfo/OrderList\" target=\"main_frame\" >有" + text + "条【工单申请】请立即处理...</a>";
            if (alarmInfOrder == sTemOrder)
                return;
            alarmInfOrder = sTemOrder;

        } else {
            alarmInfOrder = "";
        }


        objs = null;
    }, "text");
}
$(document).ready(function () {
    //报警窗           
    $(".alarm_popups_btn input").click(function () {
        $(".alarm_popups_box").fadeOut();
        audio.pause();
    });
    $('.alarm_popups_box h3').mousedown(
    function (event) {
        var isMove = true;
        var dlgLeft = $('div.alarm_popups_box').offset().left;
        var dlgTop = $('div.alarm_popups_box').offset().top;
        var downX = event.pageX;
        var downY = event.pageY;
        $(document).mousemove(function (event) {
            var moveX = event.pageX;
            var moveY = event.pageY;
            if (isMove) {
                var obj = $('div.alarm_popups_box');
                $('div.alarm_popups_box').offset({ left: dlgLeft + (moveX - downX), top: dlgTop + (moveY - downY) });
            }
        }
    ).mouseup(
    function () {
        isMove = false;
    }
    );
    }
    );

});