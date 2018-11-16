//生成左边菜单
var Request = new Object();
Request = GetRequest();
var did = 0, pid = 0;
if (Request['did'] != null)
    did = Request['did'];
if (Request['pid'] != null)
    pid = Request['pid'];
if (mid == 21) {
    $("#leftmenu").css("display", "block");
    $(".tab_mainbox").css("margin-left", "210px");
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
                    //$("#maincontent", parent.document.body).attr("src", "/PowerQuality/Index?mid=21");
                    //$("#sysContent").attr("src", "/PowerQuality/Index?mid=21");
                    DST(pid, 0);
                }
            }
        },
        onLoadSuccess: function () {
            pid = $.cookie('cookiepid');
            DST(pid, did);
            if (pid != undefined) {
                $("#StationID").combotree("setValue", pid);
            }
        }
    });
}
//加载设备树
function DST(pid, did) {
    $.post("/Home/StationDeviceTree", { "pid": pid }, function (data) {
        $("#menuinfo").html(data);
        var startsubscript = data.indexOf('callAway(') + 9;
        var stopsubscript = data.indexOf(')');
        var arrid = data.substring(startsubscript, stopsubscript);
        pid = arrid.split(',')[0];
        if (did == 0)
            did = arrid.split(',')[1];
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
        callAway(pid, did);
    });
}

//设备树点击事件：站室ID,设备ID
function callAway(pid, did) {
    var fullurl ;
    //光纤站点跳转
    if (pid == 122 || pid == 123) {
        fullurl = "/OpticFiber/Transient?did=" + did + "&pid=" + pid;
        document.getElementById("sysContent").src = fullurl
        $('#menuInfo').html("<li onclick='callAway(" + pid + "," + did + ");' class='current'>暂态曲线</li>'");
    }
    //一般站点跳转
    else {
//        fullurl = "/DeviceManage/Index?did=" + did + "&pid=" + pid + "&sid=0";
//        $("#maincontent", parent.document.body).attr("src", fullurl)
//        fullurl = "/State/RunningState?pid=" + pid + "&did=" + did;
        $.post("/PDRInfo/DeviceDTID", { "did": did }, function (dtid) {  //获取设备DTID
            if (dtid == 1) {
                fullurl = "/State/RunningState?pid=" + pid + "&did=" + did;
                document.getElementById("sysContent").src = fullurl;
            }
            else {
                xdid = did;
                fullurl = "/State/DeviceState?pid=" + pid + "&did=" + did;
                document.getElementById("sysContent").src = fullurl;
            }
        });
        //加载三级菜单信息
        $('#menuInfo').html("<li id='m0' class='current' onclick='Go(0);'>运行状态</li><li id='m1' onclick='Go(1);'>设备台账</li>");


    }
}