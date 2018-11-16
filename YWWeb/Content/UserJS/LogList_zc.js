$("#currPosition", window.top.document).html("当前位置：设置 > 日志 ");
$('#datestart').datebox({
    onSelect: function () { //输入判断
        startdate = $('#datestart').datebox('getValue');
        enddate = $('#dateend').datebox('getValue');
        if (startdate > enddate && enddate != null && enddate != "") {
            $('#datestart').datebox('setValue', enddate);
        }
    }
});
$('#dateend').datebox({
    onSelect: function () { //输入判断
        startdate = $('#datestart').datebox('getValue');
        enddate = $('#dateend').datebox('getValue');
        if (startdate > enddate && startdate != null && startdate != "") {
            $('#dateend').datebox('setValue', startdate);
        }
    }
});

$('#datestart').datebox('calendar').calendar({
    validator: function (date) {
        var now = new Date();
        return date <= now;
    }
});
$('#dateend').datebox('calendar').calendar({
    validator: function (date) {
        var now = new Date();
        return date <= now;
    }
});

$('#list_data').datagrid({
    url: '/SysInfo/LogInfo?rom=' + Math.random()
});
function LogDateFormart(d) {
    alert(d);
}
function dosearch() {
    var datestart = $('#datestart').datebox('getValue');
    var dateend = $('#dateend').datebox('getValue');
    var username = $("#uname").val();
    var contents = $("#contents").val();
    $('#list_data').datagrid('load', { "username": username, "contents": contents, "datestart": datestart, "dateend": dateend });
    $('#list_data').datagrid('uncheckAll');
}