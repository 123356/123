//yct
//did:设备id；mid:模块id，用户记录返回目标；pid:站室id
function deviceinfo(sid, did) {
    var fullurl = "/DeviceManage/Index?did=" + did + "&pid=" + pid + "&sid=" + sid;
    myWindow = window.open(fullurl, '', 'width=1200,height=1000,toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
    myWindow.focus();
}
//yct
//did:设备id；mid:模块id，用户记录返回目标；pid:站室id
function circuitInfo(sid, cid) {
    var fullurl = "/DeviceManage/Index?cid=" + cid + "&pid=" + pid + "&sid=" + sid;
}
//返回主页调用
function showMain(pid) {
    $(".page_content").css('background-image', "url(/Content/yicitu/p" + pid + ".png)");
    $(".alertmenu").hide();
    $("#p" + pid).show();
}
//开关状态监测
function loadPointsInfo_kg() {
    $.post("/PDRInfo/getSwitchInfo_kg", { "pid": pid }, function(data) {
        var arrswitch = eval("(" + data + ")");
        $.each(arrswitch, function(i) {
            var sImg = "off";
            if (arrswitch[i].PV == 0)
                sImg = "off";
            else
                sImg = "on";
            if (arrswitch[i].TagID == 245)
                var ww = "url(/Content/yicitu/switch_" + sImg + "_2.png)";
            $("#t" + arrswitch[i].TagID).css("background-image", "url(/Content/yicitu/switch_" + sImg + "_2.png)");
        });
    });
}

function loadPointsInfo(dids) {
    $.post("/PDRInfo/GetMaxTemp", { "pid": pid, "dids": dids }, function(data) {
        atable = null;
        var pointsjson = eval("(" + data + ")");
        var listarr = pointsjson.split('$');
        var jsonlist = listarr[0].split(',');
        var formheight = document.documentElement.clientHeight;
        var formWidth = document.documentElement.clientWidth;
        var divtop = 0,
            divheight = 0,
            divleft = 0,
            divWidth = 0;
        var alarmcolor = ['33cc33', 'ffff00', 'ff6633', 'ff0000'];

        for (var rcount = 0; rcount < jsonlist.length; rcount++) {
            var countjsoin = jsonlist[rcount];
            var pointinfo = countjsoin.split('|');
            var adid = pointinfo[0],
                amaxtemp = pointinfo[1],
                atable = pointinfo[2];
            //$("#d" + adid).html(amaxtemp);
            var imgurl = $(".w" + adid).css("background-image"); //获取背景图
            if (typeof(imgurl) == "undefined") {
                continue;
            }

            var dstate = pointinfo[3]; //获取设备状态
            if (dstate != "0" && dstate != "") //更改背景图片
            {
                //防止重复刷新
                if (imgurl.indexOf("_1") < 0 && imgurl.indexOf("_2") < 0 && imgurl.indexOf("_3") < 0) {
                    //获取程序识别的ImageUrl
                    imgurl = imgurl.replace("http://" + window.location.host, "").replace(".png", "_" + pointinfo[3] + ".png");
                    $(".w" + adid).css("background-image", imgurl); //赋值
                    $(".w" + adid + "_1").css("background-image", imgurl); //赋值
                }
                //获取程序识别的ImageUrl
                //                imgurl = imgurl.replace("http://" + window.location.host, "").replace(".", "_" + pointinfo[3] + ".");
                //                $(".w" + adid).css("background-image", imgurl); //赋值
            }
            console.log(atable)
            $("#t" + adid).html(atable);
            //弹窗自动定位

            divheight = $("#t" + adid).height();
            divtop = formheight - $(".w" + adid).position().top - 50;
            if (divtop < divheight) {
                $("#t" + adid).css("top", "-292px");
            }

            divWidth = $("#t" + adid).width();
            divleft = $(".w" + adid).position().left;
        }
        var alarmarr = listarr[1].split(',');
        for (var acount = 0; acount < alarmarr.length; acount++) {
            var alarmjson = alarmarr[acount];
            var alarminfo = alarmjson.split(':');
            var tid = alarminfo[0],
                stateid = alarminfo[1];
            $("#page" + tid).css("background-color", "#" + alarmcolor[stateid]);
            $("#cpage" + tid).css("background-color", "#" + alarmcolor[stateid]);
        }
    });
}

function loadPointsInfoByCid(dids) {
    $.post("/PDRInfo/GetMaxTempByCID", { "pid": pid, "cids": dids }, function(data) {
        var pointsjson = eval("(" + data + ")");
        var listarr = pointsjson.split('$');
        var jsonlist = listarr[0].split(',');
        var formheight = document.documentElement.clientHeight;
        var formWidth = document.documentElement.clientWidth;
        var divtop = 0,
            divheight = 0,
            divleft = 0,
            divWidth = 0;
        var alarmcolor = ['33cc33', 'ffff00', 'ff6633', 'ff0000'];

        for (var rcount = 0; rcount < jsonlist.length; rcount++) {
            var countjsoin = jsonlist[rcount];
            var pointinfo = countjsoin.split('|');
            var adid = pointinfo[0],
                amaxtemp = pointinfo[1],
                atable = pointinfo[2];

            var imgurl = $(".w" + adid).css("background-image"); //获取背景图
            if (typeof(imgurl) == "undefined") {
                continue;
            }

            var dstate = pointinfo[3]; //获取设备状态
            if (dstate != "0" && dstate != "") //更改背景图片
            {
                //防止重复刷新
                if (imgurl.indexOf("_1") < 0 && imgurl.indexOf("_2") < 0 && imgurl.indexOf("_3") < 0) {
                    //获取程序识别的ImageUrl
                    imgurl = imgurl.replace("http://" + window.location.host, "").replace(".png", "_" + pointinfo[3] + ".png");
                    $(".w" + adid).css("background-image", imgurl); //赋值
                    $(".w" + adid + "_1").css("background-image", imgurl); //赋值
                }
            }
            $("#t" + adid).html(atable);
            //弹窗自动定位

            divheight = $("#t" + adid).height();
            divtop = formheight - $(".w" + adid).position().top - 50;
            if (divtop < divheight) {
                $("#t" + adid).css("top", "-292px");
            }

            divWidth = $("#t" + adid).width();
            divleft = $(".w" + adid).position().left;
            if (divleft < divWidth) {
                // $("#t" + adid).css("left", divleft + "px");
            } else {
                // $("#t" + adid).css("left", "-200px");
            }

        }
        var alarmarr = listarr[1].split(',');
        for (var acount = 0; acount < alarmarr.length; acount++) {
            var alarmjson = alarmarr[acount];
            var alarminfo = alarmjson.split(':');
            var tid = alarminfo[0],
                stateid = alarminfo[1];
            $("#page" + tid).css("background-color", "#" + alarmcolor[stateid]);
            $("#cpage" + tid).css("background-color", "#" + alarmcolor[stateid]);
        }
    });
}

function loadHighOrLowPoint() {
    if (typeof(graphType) == "undefined") {
        loadPointsInfo(OGdid);
    } else if (graphType == "low") {
        loadPointsInfoByCid(OGdid);
    }
}



loadHighOrLowPoint();
loadPointsInfo_kg();
//实时更新一次图数据
var timeTicket;
clearInterval(timeTicket);
timeTicket = setInterval(function() {
    //loadHighOrLowPoint();
    loadPointsInfo_kg();
}, 5000);

var timeTicket_Val;
clearInterval(timeTicket_Val);
timeTicket_Val = setInterval(function() {
    loadHighOrLowPoint();
    //loadPointsInfo_kg();
}, 10000);

//一次图翻页
function chgPage(pid, page) {
    $(".alertmenu").hide();
    $(".page_content").css('background-image', "url(/Content/yicitu/p" + pid + "_" + page + ".png)");
    $("#p" + pid + "_" + page).show();
}

//分辨率小于1920缩放
if (window.screen.availWidth < 1920) {
    var mul = document.body.offsetWidth / window.screen.availWidth;
    mul = mul * 0.85;

    var leftMul = mul * 300;
    $("body").css({ "-webkit-transform": "scale(" + mul + ")", "margin-top": "-7em", "width": "auto" });
    $(".ycmain").css({ "left": "-" + leftMul + "px" });
}