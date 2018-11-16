//通讯状态
function AlarmStateReset(value, row, index) {
    if (row.AlarmState == "0")
        value = "通讯正常";
    else
        value = "通讯断开";
    return value;
}
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
$("#currPosition", window.parent.document).html("当前位置：报警 > 通讯报警");
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
$("#SPID").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=1",
    valueField: 'PID',
    editable: false,
    textField: 'Name',
    onLoadSuccess: function () { //数据加载完毕事件
        // var data = $('#SPID').combobox('getData');
        //if (data.length > 0) {
        //    $("#SPID").combobox('select', $.cookie('cookiepid'));
        $("#SPID").combobox('select', 0);
        // }
    },
    onSelect: function (data) {
        //var selid = $("#SPID").combobox("getValue");
        // if (selid > 0)
        //     $.cookie('cookiepid', selid, { expires: 7, path: '/' });
    }
});

//导出
function export1() {
    var pid = $("#SPID").combobox('getValue');
    var alarmstate = -1; //  $("#AlarmState").combobox('getValue');
    var startdate = $('#StartDate').datebox('getValue');
    var enddate = $('#EndDate').datebox('getValue') + ' 23:59:59';
    var ajaxbg = top.$("#loading_background,#loading");
    ajaxbg.show();
    $.post("/AlarmManage/ExportAlarmSysTableData", { "pid": pid, "startdate": startdate, "enddate": enddate }, function (data) {
        ajaxbg.hide();
        window.open('http://' + window.location.host + data);
    });
}
//查询
function dosearch() {
    var pid = $("#SPID").combobox('getValue');
    var alarmstate = -1; //  $("#AlarmState").combobox('getValue');
    var startdate = $('#StartDate').datebox('getValue');
    var enddate = $('#EndDate').datebox('getValue') + ' 23:59:59';
    $('#list_data').datagrid('load', { "pid": pid, "startdate": startdate, "enddate": enddate });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({ url: '/AlarmManage/AlarmSysTableDate?rom=' + Math.random() });