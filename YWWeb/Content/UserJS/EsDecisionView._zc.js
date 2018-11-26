$(function () {
    $("#currPosition", window.top.document).html("当前位置：电力交易 > 总览信息录入 ");
    loadSelectUnit();
})
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy/MM/dd hh:mm:ss');
    return lDate
}




//加载客户下拉框
function loadSelectUnit() {
  
        $("#unitselect").combobox({
            url: "/ES/UnitComboData?isall=" + "false",
            valueField: 'UnitID',
            textField: 'UnitName',
            editable: true,
            width: 300,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#unitselect').combobox('getData');
                if (data.length > 0) {
                    $("#unitselect").combobox('setValue', data[0].UnitID);
                }
                loadSelectPZ();
            }
            , onSelect: function (n) {
                dosearch();
            }
        });
    
}
//加载品种下拉框
function loadSelectPZ() {
  
        $("#pzselect").combobox({
            url: "/ES/BindCategory?isall=" + "true",
            valueField: 'id',
            textField: 'category_name',
            editable: true,
            width: 300,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#pzselect').combobox('getData');
                if (data.length > 0) {
                    $("#pzselect").combobox('select', data[0].id);
                }
            },
            onSelect: function (n, o) {
                //console.log(o);
                dosearch();
            }
        });
    
}

//加载方法
function dosearch() {
    var pz = $("#pzselect").combobox("getValue");
    var unit = $("#unitselect").combobox("getValue");
    var startTime = $("#startTime").datebox("getValue");
    var endTime = $("#endTime").datebox("getValue");
    if (pz == "") {
        pz = "0";
    }
    if (unit == "") {
        unit = "0";
    }
    $('#list_data').datagrid({
        url: '/ES/GetJueceView?Rnum=' + Math.random(),
        showFooter: true,
        queryParams: { "pz": pz, "unit": unit, "startTime": startTime, "endTime": endTime,"month":0 }
    });
}

function edit() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].RoleID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        console.log(row);
        if (row) {
            $("#SumUsePower").val(row.SumUsePower);
            $("#PlanUsePower").val(row.PlanUsePower);
            $("#id").val(row.UUPID)
            $("#editwin").dialog({
                closed: false,
                top: ($(window).height() - 300) * 0.5,
                left: ($(window).width() - 600) * 0.5,
                minimizable: false, //最小化，默认false  
                maximizable: false, //最大化，默认false  
                collapsible: false, //可折叠，默认false  
                draggable: true, //可拖动，默认false  
                resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
            });
            $('#list_data').datagrid('uncheckAll');
        }
        else {
            $.messager.alert("提示", "请选择要编辑的行！", "info");
        }
    }
}
function save() {
    if ($("#SumUsePower").val() == "") {
        $.messager.alert("提示", "请输入用电量！", "info");
        return false;
    }
    else if ($("#PlanUsePower").val() == "") {
        $.messager.alert("提示", "请输入计划用电量！", "info");
        return false;
    }
    var postData = {
        PlanUsePower: $("#PlanUsePower").val(),
        SumUsePower: $("#SumUsePower").val(),
        UUPID: $("#id").val()
    };
    console.log(postData);
    $.post("/ES/SavePlanView", postData, function (data) {
        if (data == "OK") {
            $.messager.alert("提示", "操作成功！", "info");
            $("#editwin").dialog("close");
            $("#list_data").datagrid("reload");
            $('#list_data').datagrid('uncheckAll');
        }
        else
            alert(data);
    });
}