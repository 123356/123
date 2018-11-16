

$(function () {
    $('#dataSrc').combobox({
        required: true,
        multiple: false, //多选
        editable: false  //是否可编辑
    });

    $('#StationName').combobox({
        editable: false,  //是否可编辑
        required: true,
        url: '/BaseInfo/BindPDRInfo',
        valueField: 'PID',
        textField: 'Name',
        onLoadSuccess: function () { //默认选中第一条数据
            var data = $(this).combobox("getData");
            if (data.length > 0) {
                $('#StationName').combobox('select', data[0].PID);
            }
        }
    });

    initDateInf();
})

function initDateInf() {
    var pid;
    var startdate, enddate;
    var Startdate = new Date();
    //Startdate.setDate(Startdate.getDate() - 7);
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
}

var editIndex = undefined;
function endEditing() {
    if (editIndex == undefined) { return true }
    if ($('#list_data').datagrid('validateRow', editIndex)) {
        $('#list_data').datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    } else {
        return false;
    }
}
function onClickCell(index) {
    if (endEditing()) {
        $('#list_data').datagrid('selectRow', index);
        $('#list_data').datagrid('beginEdit', index);
        editIndex = index;
    } else {
        $('#list_data').datagrid('selectRow', editIndex);
    }
}
var dataSrc;
function dosearch() {
    pid = $("#StationName").combobox('getValue');
    if (undefined == pid||""==pid) {
        $.messager.alert("提示", "请选择站室！", "info");
        return;
    }
    //var PName = $("#StationName").combobox('getValue');
    dataSrc = $("#dataSrc").combobox('getValue');//.val();
    startdate = $('#StartDate').datebox('getValue');
    enddate = $('#EndDate').datebox('getValue');
    $('#list_data').datagrid({
        pageNumber:1,
        pageSize:20,
        url: '/EnergyEfficiency/getListData',
        queryParams: { PID: pid, dataSrc: dataSrc, dtStart: startdate, dtEnd: enddate },
        onLoadSuccess: function (data) {
            if (typeof(data)=="string"&&data.indexOf("!") == 5)
                $.messager.alert("提示", data, "Error");
        },
        onLoadError: function () {
            $.messager.alert("提示", "获取数据错误！", "info");
        }
    });
}

function edit() {
    if (endEditing()) {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            var index = $('#list_data').datagrid('getRowIndex', row);
            onClickCell(index);
        }
        else {
            $.messager.alert("提示", "请选择要编辑的行！", "info");
        }
    }
}


function SaveForm() {
    if (endEditing()) {
        $('#list_data').datagrid('acceptChanges');
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            var postData = {
                PID: pid,
                CID: row.CID,
                RecordTime: row.RecordTime,
                UsePower: row.UsePower,
                dataSrc: dataSrc
            };
            $.post("/EnergyEfficiency/saveData", postData, function (data) {
                var str1 = JSON.parse(data);

                if (str1.result== "OK") {
                    var arr = data.split(",");
                    var index = $('#list_data').datagrid('getRowIndex', row);
                    $('#list_data').datagrid('updateRow', { index: index, row: { ID: arr[1] } });
                }
                else {
                    $.messager.alert(data);
                    $('#list_data').datagrid('reload');
                }
            });
        }
    }
    else {
        $.messager.alert("请输入必填项！");
    }
}