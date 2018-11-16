﻿$("#currPosition", window.top.document).html("当前位置：运维 > 台账 > 设备台账 ");
function popwindow() {
    var pop_contentwidth = $(".pop_window").width() / 2;
    var pop_contentheight = $(".pop_window").height() / 2;
    $('.pop_window h3').mousedown(
function (event) {
    var isMove = true;
    var abs_x = event.pageX - $('div.pop_window').offset().left - pop_contentwidth;
    var abs_y = event.pageY - $('div.pop_window').offset().top - pop_contentheight;
    $(document).mousemove(function (event) {
        if (isMove) {
            var obj = $('div.pop_window');
            obj.css({ 'left': event.pageX - abs_x, 'top': event.pageY - abs_y });
        }
    }
).mouseup(
function () {
    isMove = false;
}
);
}
);
    $(".pop_window").css({ "margin-left": -pop_contentwidth, "margin-top": -pop_contentheight });
    $(".pop_window").fadeIn();
    $(".pop_windowbg").fadeIn();
}
function popclose() {
    $(".pop_window").fadeOut();
    $(".pop_windowbg").fadeOut();
}
$(document).ready(function () {
    $(".el_content").width($(document).width() - $(".el_sidebar").width());
});

var did = 5;
var select = 0;
//日期转换
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy-MM-dd hh:mm:ss');
    return lDate
}
//查看详情
function loadDetail(bugid) {
    return '<button class="page_table_but2" style="color:White" onclick="lookDetail(' + bugid + ');"><img src="../Content/Images/detailedicon.png"/>详情</button>';
}
function lookDetail(bugid) {
    var url = "/PerationMaintenance/HazardManDetail?bugid=" + bugid;
    top.openDialog(url, 'HazardManDetail_Form', '隐患详情', 1000, 700, 50, 50);
}
BuildLeftMenu();
function callAway(tpid, tdid) {
    did = tdid;
    loadDeviceInfo();
    if (select == 0)
        loadBugData();
    else if (select == 1)
        loadOrderData();
    else if (select == 3)
        loadExperimentData();
    else if (select == 4)
        loadSensorData();
}
$('.BugState').click(function () {
    loadBugData();
});
loadDeviceInfo();
loadBugData();
function loadDeviceInfo() {
    $.post("/DeviceManage/DeviceDetail", { "did": did }, function (data) {
        var info = eval("(" + data + ")");
        $("#tDeviceCode").html(info.DeviceCode);
        $("#tDeviceName").html(info.DeviceName);
        $("#tTitleDeviceName").html(info.DeviceName);
        $("#tPName").html(info.PName);
        $("#tDeviceModel").html(info.DeviceModel);
        $("#tDTID").html(info.DeviceType);
        $("#tDSTID").html(info.DeviceStructureType);
        $("#tMLID").html(info.MajorLevel);
        $("#tMFactory").html(info.MFactory);
        $("#tFactoryNumber").html(info.FactoryNumber);
        $("#tUseDate").html(info.UseDate.split('T')[0]);
        $("#tBuyTime").html(info.BuyTime.split('T')[0]);
        $("#tLastMtcDate").html(info.LastMtcDate.split('T')[0]);
        $("#tBuildDate").html(info.BuildDate.split('T')[0]);
        $("#tInstallAddr").html(info.InstallAddr);
        $("#tA").html(info.L + " A");
        $("#tN").html(info.K);
        $("#tV").html(info.J);
        var UseState, DT;
        if (info.DTID == 1)
            DT = "低压柜";
        else if (info.DTID == 2)
            DT = "高压柜";
        else if (info.DTID == 3)
            DT = "变压器";
        else if (info.DTID == 4)
            DT = "电缆沟";
        else if (info.DTID == 5)
            DT = "环境";
        else if (info.DTID == 6)
            DT = "光纤";
        $("#tDT").html(DT);
        if (info.UseState == 0)
            UseState = "正常使用";
        else
            UseState = "暂停使用";
        $("#tUseState").html(UseState);
        $("#tCompany").html(info.Company);
        $("#tRemarks").html(info.Remarks);
    });
}

function loadBugData() {
    select = 0;
    var type = $("input[name='BugState']:checked").val();
    var HS = "";
    if (type == 0)
        HS = "";
    else if (type == 1)
        HS = "隐患已排除";
    else if (type == 2)
        HS = "2";
    $('#list_data').datagrid({
        url: '/PerationMaintenance/BugListData?rom=' + Math.random() + "&did=" + did + "&HandeSituation=" + HS,
        columns: [[
            { field: 'PName', title: '站室名称', width: 200 },
            { field: 'ReportDate', title: '报告时间', width: 150, formatter: function (value, row, index) { var lDate = formatDate(value, 'yyyy-MM-dd hh:mm:ss'); return lDate } },
            { field: 'ReportWay', title: '报告方式', width: 100 },
            { field: 'BugLocation', title: '缺陷部位', width: 300 },
            { field: 'BugDesc', title: '缺陷描述', width: 200 },
            { field: 'HandeSituation', title: '处理情况', width: 200 },
            { field: 'HandleDate', title: '处理时间', width: 200, formatter: function (value, row, index) { var lDate = formatDate(value, 'yyyy-MM-dd hh:mm:ss'); return lDate } },
            { field: 'BugID', field: 'BugID', width: 150, formatter: function (value, row, index) { return '<button class="page_table_but2" style="color:White" onclick="lookDetail(' + value + ');"><img src="../Content/Images/detailedicon.png" />详情</button>' } }
        ]],
        rownumbers: true,
        pageSize: 15,
        pageList: [10, 15, 20, 30, 50],
        toolbar: '#tb',
        method: 'get',
        striped: true,
        fitcolumns: true,
        fit: true,
        pagination: true
    });
}
function loadOrderData() {
    select = 1;
    $('#list_data').datagrid({
        url: '/OrderInfo/OrderInfoList?rom=' + Math.random() + "&pid=" + pid,
        columns: [[
            { field: 'CreateDate', title: '发布日期', width: 150, formatter: function (val) {
                if (val != "")
                    return new Date(val).Format("yyyy-MM-dd hh:mm");
                else
                    return "";
            }
            },
            { field: 'OrderNO', title: '工单编号', width: 200 },
            { field: 'PName', title: '站室', width: 100 },
            { field: 'UserName', title: '检查人', width: 100 },
            {
                field: 'PlanDate', title: '执行日期', width: 150, sortable: true, formatter: function (val) {
                    if (val != "")
                        return new Date(val).Format("yyyy-MM-dd");
                    else
                        return "";
                }
            },
            {
                field: 'CheckDate', title: '完成日期', width: 150, formatter: function (val) {
                    if (val != "")
                        return new Date(val).Format("yyyy-MM-dd hh:mm");
                    else
                        return "";
                }
            },
            { field: 'Priority', title: '优先级', width: 100, formatter: function (val) {
                if (val == 1)
                    return "一般";
                else if (val == 2)
                    return "高";
                else if (val == 3)
                    return "很高";
            }
            },
            { field: 'OrderState', title: '状态', width: 100, formatter: function (val) {
                if (val == 0)
                    return "待接收";
                else if (val == 1)
                    return "已受理";
                else if (val == 2)
                    return "已完成";
            }
            },
            { field: 'IsQualified', title: '是否合格', width: 100, formatter: function (val) {

                if (val == 0)
                    return "<b style='color:red;'>不合格</b>";
                else if (val == 1)
                    return "<b style='color:green;'>合格</b>";
                else
                    return "";
            }
            },
            { field: 'CheckInfo', title: '检查情况', width: 200 },
            { field: 'Rectification', title: '整改措施', width: 200 }
        ]]
    });
}
function loadSensorData() {
    select = 4;
    $('#list_data').datagrid({
        url: '/State/PointsInfoData?rom=' + Math.random() + "&did=" + did,
        columns: [[
            { field: 'DataTypeID', title: '传感器类型', width: 100 },
            { field: '设备点名', title: '传感器型号', width: 300 },
            { field: '版本号', title: '版本号', width: 150 },
            { field: '通信地址', title: '信道', width: 150 },
            { field: 'cname', title: '生产厂家', width: 200 },
            { field: 'Remarks', title: '监测位置', width: 300 },
            { field: '置0说明', title: '安装日期', width: 300 }
        ]],
        queryParams: { "did": did, "tagname": "", "Position": "" },
        rownumbers: true,
        pageSize: 15,
        pageList: [10, 15, 20, 30, 50],
        toolbar: '#tb',
        method: 'get',
        striped: true,
        fitcolumns: true,
        fit: true,
        pagination: true
    });
}
function loadExperimentData() {
    select = 3;
    $('#list_data').datagrid({
        url: '/OrderInfo/OrderInfoList?rom=' + Math.random() + "&pid=" + pid,
        columns: [[
            { field: 'OrderID', title: '序号', width: 50},
            { field: 'OrderNO', title: '工单编号', width: 200 },
            { field: 'OrderContent', title: '实验内容', width: 1100 },
            { field: 'PlanDate', title: '实验日期', width: 200}
        ]],
        pageSize: 10
    });
}

    var Request = new Object();
Request = GetRequest();
var pid = 6, sid = 0;
if (Request['pid'] != null)
    pid = Request['pid'];
if (Request['sid'] != null)
    sid = Request['sid'];
//    if (pid > 0)
//        $.cookie('cookiepid', pid, { expires: 7, path: '/' });
pid = $.cookie('cookiepid');
//$.cookie('cookiepid', pid, { expires: 7, path: '/' });
//var ajaxbg = top.$("#loading_background,#loading");
//    var timeTicket;
//    clearInterval(timeTicket);
//    timeTicket = setInterval(function () {
//        initRealTemp();
//    }, 300000);
//    initRealTemp(); //获取实时数据
//    function initRealTemp() {
//        //ajaxbg.show();
//        $.ajaxSettings.async = true;  //同步才能获取数据
//        $.post("/PDRInfo/RealTimeTemp", { "pid": pid }, function (data) {
//            var pointslist = eval("(" + data + ")");
//            //ajaxbg.hide();
//            $("#realtempinfo").html(pointslist);
//        });
//    }

// $("#onecontent").attr('src', '/PDRInfo/OneGraph?pid=23');
//$("#currPosition", window.parent.document).html("当前位置:"); 设置当前位置
$.post("/Home/GetCurrentNav", { "pid": pid }, function (data) {
    var currnav = data.split('|');
    $("#currPosition", window.parent.document).html(currnav[0]);
    //$.cookie('eadonav', currnav[0], { expires: 7, path: '/' });
});