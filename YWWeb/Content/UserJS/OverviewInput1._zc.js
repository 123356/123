//$("#pzselect1").combobox({
//        url: "/ES/BindCategory?isall=" + "true",
//        valueField: 'id',
//        textField: 'category_name',
//        editable: true,
//        width: 300,
//        onLoadSuccess: function () { //数据加载完毕事件
//            var data = $('#pzselect1').combobox('getData');
//            if (data.length > 0) {
//                $("#pzselect1").combobox('select', data[0].id);
//            }
//        },
//        onSelect: function (n, o) {
//            //console.log(o);
//            dosearch1();
//        }
//    });
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy/MM/dd hh:mm:ss');
    return lDate
}

//加载方法
function dosearch1() {
    //var pz1 = $("#pzselect1").combobox("getValue");
    var unit = $("#unitselect").combobox("getValue");
    var month = $("#monthselect").datebox("getValue");
    //var endTime = $("#endTime1").datebox("getValue");
    //if (pz1 == "") {
    //    pz1 = "0";
    //}
    if (unit == "") {
        unit = "0";
    }
    if (month == "") {
        month="0"
    }
    $('#list_data1').datagrid({
        url: '/ES/GetJueceView?Rnum=' + Math.random(),
        showFooter: true,
        queryParams: { "unit": unit, "month":month }
    });
}

function edit1() {
    var ids = [];
    var rows = $('#list_data1').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].RoleID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data1').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data1').datagrid('getSelected');
        console.log(row);
        if (row) {
            $("#SumUsePower").val(row.SumUsePower);
            $("#PlanUsePower").val(row.PlanUsePower);
            $("#id1").val(row.UUPID)
            $("#editwin5").dialog({
                closed: false,
                top: ($(window).height() - 300) * 0.5,
                left: ($(window).width() - 600) * 0.5,
                minimizable: false, //最小化，默认false  
                maximizable: false, //最大化，默认false  
                collapsible: false, //可折叠，默认false  
                draggable: true, //可拖动，默认false  
                resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
            });
            $('#list_data1').datagrid('uncheckAll');
        }
        else {
            $.messager.alert("提示", "请选择要编辑的行！", "info");
        }
    }
}
function save1() {
    if ($("#SumUsePower").val() == "") {
        $.messager.alert("提示", "请输入用电量！", "info");
        return false;
    }
    else if ($("#SumPlanUsePower").val() == "") {
        $.messager.alert("提示", "请输入计划用电量！", "info");
        return false;
    }
    var postData = {
        PlanUsePower: $("#PlanUsePower").val(),
        SumUsePower: $("#SumUsePower").val(),
        UUPID: $("#id1").val()
    };
    console.log(postData);
    $.post("/ES/SavePlanView", postData, function (data) {
        if (data == "OK") {
            $.messager.alert("提示", "操作成功！", "info");
            $("#editwin5").dialog("close");
            $("#list_data1").datagrid("reload");
            $('#list_data1').datagrid('uncheckAll');
        }
        else
            alert(data);
    });
}

function dayplan() {
    var unit = $("#unitselect").combobox("getValue");
    var year = $("#yearselect").combobox("getValue");
    var month = $("#monthselect").combobox("getValue");
    if (unit == 0) {
        $.messager.alert("提示", "请选择客户！", "info");
        return false;
    }
    if (year == 0) {
        $.messager.alert("提示", "请选择年份！", "info");
        return false;
    }
    if (month == 0) {
        $.messager.alert("提示", "请选择月份！", "info");
        return false;
    }
    $("#editwin6").dialog({
        closed: false,
        top: ($(window).height() - 400) * 0.5,
        left: ($(window).width() - 700) * 0.5,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
    });
    dosearch1();
}