//表单验证
$.extend($.fn.validatebox.defaults.rules, {
    phoneNum: { //验证手机号  
        validator: function (value, param) {
            if (value != "") {
                return /^1[3-8]+\d{9}$/.test(value);
            }
            return true
        },
        message: '请输入正确的手机号码。'
    }, 

    telNum: { //既验证手机号，又验证座机号
        validator: function (value, param) {
            if (value != "") {
                return /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\d3)|(\d{3}\-))?(1[358]\d{9})$)/.test(value);
            }
            return true
        },
        message: '请输入正确的电话号码。'
    }
})

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
    if (!$("#editForm").form('validate')) {
        $.messager.alert("提示", "输入数据格式有误或超出范围！", "info");
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
        Remarks: $("#Remarks").val(),
        PID: $.cookie('cookiepid') 
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