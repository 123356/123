//生成左边菜单
var did = 0, pid = 0;
if (mid == 21 ||mid ==211) { //mid=211 :生命周期
    //$("#leftmenu").css("display", "block");
   // $(".tab_menu").css("margin-left", "210px");
    $(".tab_mainbox").css("margin-left", "0px");
    BuildLeftMenu();
    pid = $.cookie('cookiepid');
}
else {
    $("#leftmenu").css("display", "none");
    $(".tab_mainbox").css("margin-left", "0px");
    $("#leftmenuSpace").html("");
}
//绑定设备树
function BuildLeftMenu() {
    $("#leftmenuSpace").html("<div class='leftmenu' id='leftmenu'><div class='leftmenu_content'><div class='leftmenu_search leftmenu_search_padding'><input data-options='lines:true' style='width: 200px; height: 30px;' id='StationID' /></div><div><ul class='one' id='menuinfo'></ul></div></div></div>");
    $('#StationID').combotree({
        url: '/Home/ComboTreeMenu',
        multiple: false,
        editable: true,
        panelMinHeight: 400,
        onBeforeSelect: function (node) {
           
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationID').combotree('tree').tree("expand", node.target); //展开
                 return false;
            }
             
        },
        onClick: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationID').combo('showPanel');
            }
            else {
                //返回树对象                
                if (node.id != 0) {
                    pid = node.id;
                    $.cookie('cookiepid', pid, { expires: 7, path: '/' });
                    //DST(pid);
                    var fullurl = $("#sysContent").attr("src");
                    console.log("fullurl == "+fullurl);
                    if (fullurl.indexOf("PlanInfo") > 0) {
                        if ((pid > 150 && pid < 157) || (pid > 34 && pid < 74) || pid == 158 || pid == 14)
                            fullurl = "/Home/PermissionError";
                        else
                            fullurl = "/PDRInfo/PlanInfo?id=" + pid;
                        document.getElementById("sysContent").src = fullurl;
                    }
                    else if (fullurl.indexOf("OneGraphLow") > 0) {
                        fullurl = "/PDRInfo/OneGraphLow?id=" + pid;
                        document.getElementById("sysContent").src = fullurl;
                    }//
                    else if (fullurl.indexOf("OneGraph") > 0) {
                        fullurl = "/PDRInfo/OneGraph?id=" + pid;
                        document.getElementById("sysContent").src = fullurl;
                    }
                    else if (fullurl.indexOf("PermissionError") > 0) {
                        if ((pid > 150 && pid < 157) || (pid > 34 && pid < 74) || pid == 158 || pid == 14)
                            fullurl = "/Home/PermissionError";
                        else
                            fullurl = "/PDRInfo/PlanInfo?id=" + pid;
                        document.getElementById("sysContent").src = fullurl;
                    }
                    else {

                        var leng = fullurl.split('?').length;
                        if (leng == 2)
                            fullurl = fullurl.substring(0, fullurl.lastIndexOf('?'));
                        fullurl = fullurl + "?pid=" + pid;
                        document.getElementById("sysContent").src = fullurl;
                    }
                    $.post("/Home/GetCurrentNav", { "pid": pid, "url": fullurl }, function (data) {
                        var currnav = data.split('|');
                        $("#currPosition", window.parent.document).html(currnav[0]);
                    });
                }
            }
        },
        onLoadSuccess: function (node, data) {

            $("#StationID").combotree('tree').tree('expandAll');//展开所有节点 

            pid = $.cookie('cookiepid');
           // DST(pid);
            if (pid != undefined &&null!=pid) {
                $("#StationID").combotree("setValue", pid);
            }
            else
            {
                if(null!=data&&data.length>0)
                {
                    var bfound = false;
                    for (var i = 0; i < data[0].children.length&&false==bfound; i++)
                    {
                        for(var j=0;j<data[0].children[i].children.length&&false==bfound;j++)
                        {
                            pid = data[0].children[i].children[j].id;
                            $("#StationID").combotree("setValue", pid);
                            $.cookie('cookiepid', pid, { expires: 7, path: '/' });
                            bfound = true;
                        }                        
                    }
                }
            }
        }
    });
}
//加载设备树
function DST(pid) {
    $.post("/Home/StationDeviceTree", { "pid": pid }, function (data) {
        $("#menuinfo").html(data);

        $(".one > li > a").click(function () {
            $(this).addClass("xz").parents().siblings().find("a").removeClass("xz");
            //$(".one > li > a > i").toggleClass("one_open").parents().siblings().find("a").removeClass("one_open");
            $(this).children(":first").toggleClass("one_open").parents().siblings().find("i").removeClass("one_open");
            $(this).parents().siblings().find(".two").hide(300);
            $(this).siblings(".two").toggle(300);
            $(this).parents().siblings().find(".two > li > .thr").hide().parents().siblings().find(".thr_nr").hide();
        });
        $(".two > li > a").click(function () {
            $(this).addClass("sen_x").parents().siblings().find("a").removeClass("sen_x");
        });
        var pageHeight = document.documentElement.clientHeight - 50; //iframe
        var accordionheight = ($(".one").children("ul li").length * 39);
        $('.two').height(pageHeight - accordionheight);
    });
}

//加载三级菜单信息
$.post("/Home/GetThirdMenuInfo", { "mid": mid }, function (data) {
    $("#menuInfo").html(data);
    $("#menuInfo li:first").click();
});
//三级菜单连接地址
function setIframeUrl(url, id) {
    if (url.indexOf("PlanInfo") != -1 || url.indexOf("OneGraph") != -1) {
        url = url + "?id=" + pid;
    }
    else
        url = url + "?pid=" + pid;
    $("#menuInfo li").removeClass('current');
    $("#sysContent").attr('src', url);
    $("#m" + id).addClass('current');
    if (mid == 21) {
        $.post("/Home/GetCurrentNav", { "pid": pid, "url": url }, function (data) {
            var currnav = data.split('|');
            $("#currPosition", window.parent.document).html(currnav[0]);
        });
    }
}
//设备树点击事件：站室ID,设备ID
function callAway(pid, did) {
    var fullurl = "/DeviceManage/Index?did=" + did + "&pid=" + pid + "&sid=0";
    //光纤站点跳转
    if (pid == 122 || pid == 123) {
        fullurl = "/OpticFiber/Transient?did=" + did + "&pid=" + pid;
        document.getElementById("sysContent").src = fullurl
        $('#menuInfo').html("<li onclick='callAway(" + pid + "," + did + ");' class='current'>暂态曲线</li>'");
    }
        //一般站点跳转
    else {
        fullurl = "/DeviceManage/Index?did=" + did + "&pid=" + pid + "&sid=0";
        //$("#maincontent", parent.document.body).attr("src", fullurl)
        $("#main_frame", parent.document.body).attr("src", fullurl)
        
    }
    //    if (mid == 21) {
    //        fullurl = "/DeviceManage/Index?did=" + did + "&pid=" + pid + "&sid=0";
    //        document.getElementById("sysContent").src = fullurl;
    //    }
    //    else {
    //        fullurl = $("#sysContent").attr("src");
    //        fullurl = fullurl.substring(0, fullurl.indexOf('?'));
    //        fullurl = fullurl + "?pid=" + pid + "&did=" + did;
    //        document.getElementById("sysContent").src = fullurl;
    //    }
    //    if (mid == 21) {
    //        fullurl = "/PowerQuality/Index" + "?mid=" + 21000;
    //        document.getElementById("sysContent").src = fullurl;
    //    }
}