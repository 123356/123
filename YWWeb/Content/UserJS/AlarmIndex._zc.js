﻿
var pid = 0;

var Request = GetRequest();
if (Request['pid'] != null)
    pid = Request['pid'];
else
    pid = $.cookie('cookiepid');


var Startdate = new Date();
Startdate.setDate(Startdate.getDate() - 10);
var DS = Startdate.getFullYear() + "-" + (Startdate.getMonth() + 1) + "-" + Startdate.getDate();
$('#StartDate').datebox({
    value: DS,
    onSelect: function () { //输入判断
        startdate = $('#StartDate').datebox('getValue');
        enddate = $('#EndDate').datebox('getValue');
        if (startdate > enddate) {
            $('#EndDate').datebox('setValue', startdate);
        }
    }
});
//开关量显示设置
function ValueReset(value, row, index) {
    if (row.AlarmCate == "开关量") {
        if (value == 0)
            value = "分";
        else
            value = "合";
    }
    return value;
}
$('#EndDate').datebox({
    value: '24:00',
    onSelect: function () { //输入判断
        startdate = $('#StartDate').datebox('getValue');
        enddate = $('#EndDate').datebox('getValue');
        if (startdate > enddate) {
            $('#EndDate').datebox('setValue', startdate);
        }
    }
});
$("#currPosition", window.parent.document).html("当前位置：报警 > 数据报警");
$('#StartDate').datebox('calendar').calendar({
    validator: function (date) {
        var now = new Date();
        return date <= now;
    }
});
$('#EndDate').datebox('calendar').calendar({
    validator: function (date) {
        var now = new Date();
        return date <= now;
    }
});
//打印
function printer() {
    $(".datagrid-view").jqprint();
}

//生成报警报告
function alarmExport() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].AlarmID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "生成报警报告时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            var ajaxbg = top.$("#loading_background,#loading");
            ajaxbg.show();
            $.post("/AlarmManage/ExportAlarmDoc?Rnum=" + Math.random(), { "AlarmID": row.AlarmID }, function (data) {
                if (data != "生成报警报告异常！") {
                    ajaxbg.hide();
                    window.open('http://' + window.location.host + data);
                }
                else {
                    $.messager.alert("提示", data, "info");
                }
            });
        }
        else {
            $.messager.alert("提示", "请选择要生成报警报告的行！", "info");
        }
    }
}
//添加隐患
function addBug() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].AlarmID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "添加隐患时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            $.messager.confirm('提示', '你确定要添加隐患？', function (r) {
                if (r) {
                    $.post("/AlarmManage/AddBugInfo?Rnum=" + Math.random(), { "AlarmID": row.AlarmID }, function (data) {
                        if (data == "OKadd") {
                            $.messager.alert("提示", "添加隐患成功！", "info");
                        }
                        else {
                            $.messager.alert("提示", data, "info");
                        }
                    });
                }
            })
        }
        else {
            $.messager.alert("提示", "请选择要添加隐患的行！", "info");
        }
    }
}

$("#SPID").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=1",
    valueField: 'PID',
    editable: false,
    textField: 'Name',
    onLoadSuccess: function () { //数据加载完毕事件
        var data = $('#SPID').combobox('getData');
        if (data.length > 0 && pid == 0) {
            $("#SPID").combobox('select', 0);
        }
    },
    onSelect: function () {
        var selid = $("#SPID").combobox("getValue");
        loadDataTypeList(selid);

        if (selid > 0) {
            $.cookie('eadopid', selid, { expires: 7, path: '/' });
        }
    }
});
function loadDataTypeList(pid) {
    $("#cbType").combobox({
        url: "/BaseInfo/BindValueType?showall=1&pid=" + pid,
        valueField: 'DTID',
        textField: 'Name',
        editable: false,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#cbType').combobox('getData');
            if (data.length > 0) {
                $("#cbType").combobox('select', data[0].DTID);
            }
        },
        onSelect: function () {
            dosearch();
        }
    });
}
//报警确认
function recover() {
    //弹出处理报警的弹窗；

    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length != 1) {
        alert("请选取一条记录进行处理！")
        return;
    }
    console.log(rows)
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].AlarmID);
    }
    if (rows[0].AlarmID) {
        var str = JSON.stringify(rows[0]);
        var url = "/AlarmManage/Treatment?alarmObj=" + escape(str);
        console.log(str)
        $('#editwin').window({
            modal: true,
            top: ($(window).height() - 600) * 0.5,
            left: ($(window).width() - 800) * 0.5,
            href: url,
            onClose: function () { dosearch(); }
        });
        $('#editwin').window('open');
    }
    /*$.post("/AlarmManage/DelAllPAlarm", "", function (data) {
        $.messager.alert("提示", data, "info");
        //$("#icon_message").css('background-image', "url(/Content/Images/tipsico.png)");
        $("#icon_message", window.parent.document).css('background-image', "url(/Content/Images/tipsico.png)");
        dosearch();
    });*/
}
//导出
function export1() {
    var pid = $("#SPID").combobox('getValue');
    var startdate = $('#StartDate').datebox('getValue');
    var enddate = $('#EndDate').datebox('getValue') + ' 23:59:59';
    var typename = $("#cbType").combobox('getText');
    var ajaxbg = top.$("#loading_background,#loading");
    ajaxbg.show();
    $.post("/AlarmManage/ExportAlarmData", { "pid": pid, "startdate": startdate, "enddate": enddate, "typename": typename }, function (data) {
        ajaxbg.hide();
        window.open('http://' + window.location.host + data);
    });
}

//查询
function dosearch() {
    var pid = $("#SPID").combobox('getValue');
    var startdate = $('#StartDate').datebox('getValue');
    var enddate = $('#EndDate').datebox('getValue') + ' 23:59:59';
    var dtid = $("#cbType").combobox('getValue');
    console.log(dtid);
    //$('#list_data').datagrid({pageNumber:1});
    //$('#list_data').datagrid('reload', { "pid": pid,"dtid":dtid, "startdate": startdate, "enddate": enddate });
    //$('#list_data').datagrid('uncheckAll');
    $('#list_data').datagrid({
        url: '/AlarmManage/AlarmDate?rom=' + Math.random(),
        pageList: [10, 20, 30, 50],
        pageSize: 30,
        queryParams: { "pid": pid, "dtid": dtid, "startdate": startdate, "enddate": enddate },
        rowStyler: function (index, row) {
        if (row.AlarmState == "1") {
            return 'background-color:Yellow;color:#333;font-weight:bold;';
        }
        else if (row.AlarmState == "2") {
            return 'background-color:#ed9700;color:#fff;font-weight:bold;';
        }
        else if (row.AlarmState == "3") {
            return 'background-color:#b00000;color:#fff;font-weight:bold;';
        }
        },
        onDblClickRow: function (rowIndex, rowData) {
            if (rowData) {
                var str = JSON.stringify(rowData);
                var url = "/AlarmManage/Treatment?alarmObj=" + escape(str);
                console.log(str)
                $('#editwin').window({
                    modal: true,
                    top: ($(window).height() - 600) * 0.5,
                    left: ($(window).width() - 800) * 0.5,
                    href: url,
                    onClose: function () { dosearch(); }
                });
                $('#editwin').window('open');
            }
        }
    });
    $('#list_data').datagrid('uncheckAll');



}
//$('#list_data').datagrid({
//    url: '/AlarmManage/AlarmDate?rom=' + Math.random(),
//    pageList: [10, 20, 30, 50],
//    pageSize:30,
//    rowStyler: function (index, row) {
//        if (row.AlarmState == "1") {
//            return 'background-color:Yellow;color:#333;font-weight:bold;';
//        }
//        else if (row.AlarmState == "2") {
//            return 'background-color:#ed9700;color:#fff;font-weight:bold;';
//        }
//        else if (row.AlarmState == "3") {
//            return 'background-color:#b00000;color:#fff;font-weight:bold;';
//        }
//    },
//    onDblClickRow: function (rowIndex, rowData) {
//        if (rowData) {
//            var str = JSON.stringify(rowData);
//            var url = "/AlarmManage/Treatment?alarmObj=" + escape(str);
//            console.log(str)
//            $('#editwin').window({
//                modal: true,
//                top: ($(window).height() - 600) * 0.5,
//                left: ($(window).width() - 800) * 0.5,
//                href: url,
//                onClose: function () { dosearch(); }
//            });
//            $('#editwin').window('open');
//        }
//    }
//    //,onLoadSuccess:function(data)
//    //{
//    //   
//    //}
//});


//if (pid != 0) {
//    $("#SPID").combobox('select', pid);
//    dosearch();
//}