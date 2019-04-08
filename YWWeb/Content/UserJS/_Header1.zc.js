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
getNavMenus();
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
            $("#alarmDetail").attr("href", "/PerationMaintenance/Index?mid=437")
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
        sArarmTem = sArarmTem + alarmInf;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/alarm.mp3")//报警

        $("#alarmDetail").attr("href", "/AlarmManage/Index?pid=0")
    } else {
        sArarmMp3Name += "0";
    }
    if (alarmInfOrder.length > 0) {
        sArarmTem = sArarmTem + alarmInfOrder;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/apply.mp3")//工单
        $("#alarmDetail").attr("href", "/Orderinfo/OrderList")
    } else {
        sArarmMp3Name += "0";
    }
    if (alarmInfBug.length > 0) {
        sArarmTem = sArarmTem + alarmInfBug;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/bug.mp3")//隐患

        $("#alarmDetail").attr("href", "/PerationMaintenance/HazardMan")
    } else {
        sArarmMp3Name += "0";
    }
    if (timesInfos.length > 0) {
        sArarmTem = sArarmTem + timesInfos;
        sArarmMp3Name += "1";
        playList.push("/Content/wav/constract.mp3")//合同

        $("#alarmDetail").attr("href", "/PerationMaintenance/Index?mid=437")
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



    var cookiDate = $.cookie("hintDate")
    if (cookiDate != null || cookiDate != undefined) {
        var hintDate = new Date(cookiDate)

        //console.log("cookieDate:" + hintDate.getFullYear() + "-" + (hintDate.getMonth() + 1) + "-" + hintDate.getDate() + " " + hintDate.getHours() + ":" + hintDate.getMinutes() + ":" + hintDate.getSeconds())
        var curDate = new Date()
        // console.log("curDate:" + curDate.getFullYear() + "-" + (curDate.getMonth() + 1) + "-" + curDate.getDate() + " " + curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds())
        var time = curDate.getTime() - hintDate.getTime()
        time = Math.floor(time / (60 * 1000))
        if (time > 120) {
            if (playList.length > 1) {
                play(audio, playList)
            } else {
                audio.pause();
                $(".alarm_popups_box").fadeOut();
                return
            }
        }
    } else {
        if (playList.length > 1) {
            play(audio, playList)
        } else {
            audio.pause();
            $(".alarm_popups_box").fadeOut();
            return
        }
    }



    $("#alarm_content").html($(sArarmTem));
}
var i = -1
function play(audio) {
    $("#setHint").attr("checked", false)
    $(".alarm_popups_box").fadeIn();
    playm(audio)
}

function playm(audio) {
    i++
    if (i >= playList.length) i = 0
    if (undefined == playList[i]) {
        console.log('nudefined == audio.src');
        return;
    }
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
            //console.log(alarmInf)
            var count = alarmInf
            var str =  "id=\"alarmNum\">"
            count = parseInt(count.substring(count.indexOf(str) + str.length, count.indexOf("</span>条【监测报警】")))
           
                if (alarmInf == data)
                    return;
                
                alarmInf = data;
                var sf = "id=\"alarmNum\">";
                var is = data.indexOf(sf);
                var ie = data.indexOf("</span>条【监测报警】");
                var val = data.substring(is + sf.length, ie);
            //console.log("count=" + count + ",val=" + val)
                //console.log("val==count:" + parseInt(val) == count)
                //console.log("val=" + parseInt(val)+",count="+count)
                if (parseInt(val) < count || parseInt(val) == count) {
                    alarmInf = ''
                    $("#alarm_popups").hide();
                    return
                }
                var text = "<span class=\"am-badge am-badge-warning am-round item-feed-badge\" id=\"alarmNum\">" + val + "</span>";
                $("#alarmNum").remove();//移除历史
                $("#alarmIcon").append(text);
           
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
        $("#orderIcon").parent().attr("href", "/Orderinfo/OrderList");
        if (objs.length > 0) {
            text = objs[0];
            $("#orderIcon").append(text);
            $("#orderIcon").parent().attr("href", "/Orderinfo/OrderList?type=new");
            var sTemOrder = "<a href=\"/Orderinfo/OrderList?type=new\" target=\"main_frame\" >有" + text + "条【工单申请】请立即处理...</a>";
            if (alarmInfOrder == sTemOrder)
                return;
            alarmInfOrder = sTemOrder;

        } else {
            alarmInfOrder = "";
        }


        objs = null;
    }, "text");
}
function getNavMenus() {
    $.post("/Home/GetNavMenuList", function (data) {
        var ht = '<li class="am-text-sm tpl-header-navbar-welcome">'
            + '<dl>'
            + '<dt>'
            + '<a>欢迎您, <span> ' + UserName+'</span><i class="am-icon-chevron-down" style="transform:rotate(0deg);font-size:18px;font-weight: bold;"></i> </a>'
            + '</dt>'
            + '<dd>'
            + '<p class="tb" style=""></p>'
            + '<p onclick="chgPwd()" style="margin-top:-10px">修改密码</p>'
            + '<p onclick="LoginOut()">退出</p>'
            + '</dd>'
            + '</dl >'
            + '</li>';
        $.each(data, function (i, v) {
            if (v.ModuleName.indexOf("工单")!=-1  ) {
                ht += '<li class="am-dropdown tpl-dropdown" data-am-dropdown>'
                    + '<a href = "' + v.Location + '" target = "main_frame" >'
                    + '<span class="am-badge am-radius textBadge">' + v.ModuleName + '</span>'
                    + '<i class="iconfont icon-order" id="orderIcon"></i>'
                    + '</a>'
                    + '</li>';
            } else if (v.ModuleName.indexOf("隐患") != -1) {
                ht += '<li class="am-dropdown tpl-dropdown" data-am-dropdown>'
                    + '<a href = "' + v.Location + '" target = "main_frame" >'
                    + '<span class="am-badge am-radius textBadge">' + v.ModuleName + '</span>'
                    + '<i class="iconfont icon-yinhuandianwei" id="orderIcon"></i>'
                    + '</a>'
                    + '</li>';
            } else if (v.ModuleName.indexOf("报警") != -1) {
                ht += '<li class="am-text-sm">'
                    + '<a href = "' + v.Location + '" target="main_frame">'
                    + '<span class="am-badge am-radius textBadge">' + v.ModuleName + '</span>'
                    + '<i class="iconfont icon-real-time-alarm" id="alarmIcon"></i>'
                    + '</a>'
                    + '</li>';
            }
        })
        ht += '<li class="am-text-sm" style="display: inline">'
            + '<p style = "text-align:left; color:#fff;padding:12px 10px 10px 20px;opacity:0.8;margin:0;font-size:10px;line-height:33px;width:140px" id = "curTIme" >'
            + '<time class="curTIme">00.00  00:00</time>'
            + '</p>'
            + '</li>';
        $("#navs").html(ht);
        $(".theme-black .am-fr a").on("click", function () {
            $("#collapase-nav-1 li").find("a").attr("style", "background-color:#262a35;border: #262a35;")
            $(".theme-black .am-fr a").css("background", "none");
            $(this).css("background", "#40ae95").css("color", "#fff");
        })
        $(" .tpl-header-navbar-welcome dl").hover(function () {
            $(this).find("dd").fadeIn()
        }, function () {
            $(this).find("dd").fadeOut()
        })
    })
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


