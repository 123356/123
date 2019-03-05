
        $(function () {
            $("#currPosition", window.top.document).html("当前位置：电力交易 > 录入交易电价 ");
            loadSelectUnit(0);
        })

       

//加载客户下拉框
function loadSelectUnit(uid) {
    if (uid != "0") {
        $("#unit").combobox({
            url: "/ES/UnitComboData?isall=" + "false",
            valueField: 'UnitID',
            textField: 'UnitName',
            editable: true,
            width: 200,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#unit').combobox('getData');
                if (data.length > 0) {
                    $("#unit").combobox('select', uid);
                }
            }
        });
    } else {
        $("#unitselect").combobox({
            url: "/ES/UnitComboData?isall=" + "true",
            valueField: 'UnitID',
            textField: 'UnitName',
            editable: true,
            width:300,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#unitselect').combobox('getData');
                if (data.length > 0) {
                    $("#unitselect").combobox('select', data[0].UnitID);
                }
            },
            onSelect: function (n, o) {
                dosearch();
            }
        });
    }
}
    
//加载方法
function dosearch() {
    var unit = $("#unitselect").combobox("getValue");
    var startTime = $("#startTime").combobox("getValue");
    var endTime = $("#endTime").combobox("getValue");
    if (unit == "") {
        unit = "0";
    }
    if (startTime == "") {
        startTime = null;
    }
    if (endTime == "") {
        endTime = null;
    }
    $('#list_data').datagrid({
        url: '/ES/GetTradePriceList?Rnum=' + Math.random(),
        queryParams: { "startTime": startTime, "unit": unit, "endTime": endTime }
    });
    // $('#list_data').datagrid('load', { "pz": pz,"pdf":pdf,"year":year });
    $('#list_data').datagrid('uncheckAll');
}
function add() {
    clearForm();
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
    //添加时默认选择配电室
    var uid = $("#unitselect").combobox("getValue");
    if (uid == 0) {
        var data = $('#unitselect').combobox('getData');
        uid = data[1].UnitID;
    }
    loadSelectUnit(uid)
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
        if (row) {
            loadSelectUnit(row.unid);
            $("#trade_price").numberbox('setValue',row.trade_price),
            $("#trade_num").numberbox('setValue', row.trade_num),
            $("#catalog_price").numberbox('setValue', row.catalog_price),
            getMDate(row.trade_time, 'trade_time'),
                $("#id").val(row.id)
            $("#pc_save_cost").numberbox('setValue', row.pc_save_cost),
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
    if ($("#trade_price").val() == "") {
        $.messager.alert("提示", "请输入交易电价！", "info");
        return false;
    }

    else if ($("#trade_num").val() == "") {
        $.messager.alert("提示", "请输入实际交易量！", "info");
        return false;
    }
    else if ($("#trade_time").datebox("getValue") == "") {
        $.messager.alert("提示", "请选择年月！", "info");
        return false;
    }
    else if ($("#unit").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择客户！", "info");
        return false;
    }
    var postData = {
        trade_price: $("#trade_price").val(),
        trade_num: $("#trade_num").val(),
        trade_time: $("#trade_time").datebox("getValue"),
        unid: $("#unit").combobox("getValue"),
        catalog_price: $("#catalog_price").val(),
        pc_save_cost:$("#pc_save_cost").val(),
        id: $("#id").val()
    };
    $.post("/ES/SaveTradePrice", postData, function (data) {
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
function Delete() {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length < 1) {
        $.messager.alert("提示", "请选择要删除的行！", "info");
    }
    else {
        $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
            if (r) {
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                $.post("/ES/DeleteTradePrice?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        $.messager.alert("提示", "操作成功", "info");
                        $("#list_data").datagrid("reload");
                        $('#list_data').datagrid('uncheckAll');
                    }
                    else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            }
        })
    }
}


function clearForm() {
    $(':input', editwin).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
}


function ShowDianjia() {
          
    $("#editwin4").dialog({
        closed: false,
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
    });
    $.post("/ES/GetMuDianjia?Rnum=" + Math.random(), function (data) {
        html="";
        $.each(data.r, function (index, val) {
                                
            html+='  <td colspan="3" style="text-align:center;">'+val.FDRName+'</td>'
                              
        })
                           
    });  
             
}
function setTime(val, row, r) {
    var v = "";
    if (val != null && val != "" && val.length > 10) {
        v = val.substring(0, 7)
    }
    return v;
}