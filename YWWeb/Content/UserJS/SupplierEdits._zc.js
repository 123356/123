function loadInfo() {
    if (supplierid > 0) {
        $.post("/SupplierManage/SupplierInfoDetail", { "supplierid": supplierid }, function (data) {
            var row = eval("(" + data + ")");
            var sid = row.SupplierID;
            $("#SupplierID").val(sid);
            $("#SupplierCode").val(row.SupplierCode);
            $("#SupplierName").val(row.SupplierName);
            $("#Contacter").val(row.Contacter);
            $("#MobilePhone").val(row.MobilePhone);
            $("#Telephone").val(row.Telephone);
            $("#SupplierAddress").val(row.SupplierAddress);
            if (row.Remarks != null)
                $("#Remarks").val(row.Remarks.replace(/<br\s*\>/g, "\n"));
            else
                $("#Remarks").val(row.Remarks);

        });
    }
}

$(function () {
    loadInfo();
});

function save() {
    if ($("#SupplierCode").val() == "" || $("#SupplierName").val() == "") {
        $.messager.alert("提示", "请填写必填项目！", "info");
        return false;
    }

    var postData = {
        SupplierID: $("#SupplierID").val(),
        SupplierCode: $("#SupplierCode").val(),
        SupplierName: $("#SupplierName").val(),
        Contacter: $("#Contacter").val(),
        MobilePhone: $("#MobilePhone").val(),
        Telephone: $("#Telephone").val(),
        SupplierAddress: $("#SupplierAddress").val(),
        Remarks: $("#Remarks").val()
    };
    $.post("/SupplierManage/SaveSupplierInfo", postData, function (data) {
        if (data == "ok1") {
            $.messager.alert("提示", "供应商信息编辑成功！", "info");
            $("#SupplierID").val("");
            $("#list_data").datagrid("reload");
            $("#editwin").dialog("close");
            $('#list_data').datagrid('uncheckAll');
        } else if (data == "ok2") {
            $.messager.alert("提示", "供应商信息新增成功！", "info");
            $("#SupplierID").val("");
            $("#list_data").datagrid("reload");
            $("#editwin").dialog("close");
            $('#list_data').datagrid('uncheckAll');
        }
        else
            alert(data);
    });
}