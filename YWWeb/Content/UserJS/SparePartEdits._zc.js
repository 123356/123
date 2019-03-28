
function loadInfo() {
    if (sparepartid > 0) {
        $.post("/SparePartManage/SparePartInfoDetail", { "sparepartid": sparepartid }, function (data) {
            var row = eval("(" + data + ")");
            var sid = row.SparePartID;
            $("#SparePartID").val(sid);
            $("#SparePartCode").val(row.SparePartCode);
            $("#SparePartName").val(row.SparePartName);
            $("#StockCount").numberbox('setValue',row.StockCount);
            $("#SupplierID").combobox('setValue', row.SupplierID);

            $("#EadoCode").val(row.EadoCode);
            if (row.Remarks != null)
                $("#Remarks").val(row.Remarks.replace(/<br\s*\>/g, "\n"));
            else
                $("#Remarks").val(row.Remarks);

        });
    }
}

$(function () {
    loadSupplierInfo();
    loadInfo();
});

function loadSupplierInfo() {
    $("#SupplierID").combobox({
        url: "/SupplierManage/BindSupplierInfo",
        valueField: 'SupplierID',
        textField: 'SupplierName',
        onLoadSuccess: function (data) {
            if (sparepartid == "undefined" || sparepartid == undefined)
                $('#SupplierID').combobox('setValue', data[0].SupplierID)
        }
    });
}

function save() {
    if ($("#SparePartCode").val() == "" || $("#SparePartName").val() == "") {
        $.messager.alert("提示", "请填写必填项目！", "info");
        return false;
    }
    var postData = {
        SparePartID: $("#SparePartID").val(),
        SparePartCode: $("#SparePartCode").val(),
        SparePartName: $("#SparePartName").val(),
        StockCount: $("#StockCount").val(),
        SupplierID: $("#SupplierID").combobox('getValue'),

        EadoCode: $("#EadoCode").val(),
        Remarks: $("#Remarks").val(),
        pid: $.cookie('cookiepid')
    };
    $.post("/SparePartManage/SaveSparePartInfo", postData, function (data) {
        if (data == "ok1") {
            $.messager.alert("提示", "备件信息编辑成功！", "info");
            $("#SparePartID").val("");
            $("#list_data").datagrid("reload");
            $("#editwin").dialog("close");
            $('#list_data').datagrid('uncheckAll');
        } else if (data == "ok2") {
            $.messager.alert("提示", "备件信息新增成功！", "info");
            $("#SparePartID").val("");
            $("#list_data").datagrid("reload");
            $("#editwin").dialog("close");
            $('#list_data').datagrid('uncheckAll');
        }
        else
            alert(data);
    });
}