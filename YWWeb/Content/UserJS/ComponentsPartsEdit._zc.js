//展示下拉框
var pid = $.cookie("cookiepid")
function loadPID() {
    $("#PID").combobox({
        url: "/BaseInfo/BindPDRInfo?showall=7",
        valueField: 'PID',
        textField: 'Name',
        onLoadSuccess: function () {
            var data = $('#PID').combobox('getData');
            if (sparepartid == 0) {
                if (data.length > 0) {
                    $("#PID").combobox('select', data[0].PID);
                    // loadDevice(data[0].PID)
                }
            }
        },
        onSelect: function () {
            var pid = $("#PID").combobox("getValue")
            loadDevice(pid, 0)

        }
    });
}
//设备下拉框
function loadDevice(pid, type) {
    $("#DID").combobox({
        url: "/Home/StationDeviceTreeJson?pid=" + pid,
        valueField: 'DID',
        textField: 'DeviceName',
        onLoadSuccess: function () {
            var data = $('#DID').combobox('getData');
            if (sparepartid == 0) {
                if (data.length > 0) {

                    $("#DID").combobox('select', data[0].DID);
                }
            } else {
                if (type == 0) {
                    $("#DID").combobox('select', data[0].DID);
                }
            }

        },
        onSelect: function () {
            var did = $("#DID").combobox("getValue");

        }
    });
}



function loadInfo() {
    if (sparepartid > 0) {
        // 
        $.post("/Home/GetElementModel", { "id": sparepartid }, function (data) {
            loadDevice(data.PID, 1)
            $("#ID").val(sparepartid)
            $("#DeviceCode").val(data.DeviceCode);
            $("#SparePartCode").val(data.SparePartCode);
            $("#DeviceName").val(data.DeviceName);
            $("#DeviceModel").val(data.DeviceModel);

            $("#PID").combobox('setValue', data.PID);
            $("#DID").combobox('setValue', data.DID);

            $("#Manufactor").val(data.Manufactor);

        });
    }
}

$(function () {
    loadPID()
    // loadDevice()
    loadInfo();
});

function loadSupplierInfo() {
    $("#DID").combobox({
        url: "/SupplierManage/BindSupplierInfo",
        valueField: 'DID',
        textField: 'SupplierName',
        onLoadSuccess: function (data) {
            if (sparepartid == "undefined" || sparepartid == undefined)
                $('#DID').combobox('setValue', data[0].DID)
        }
    });
}

function save() {
    if ($("#DeviceCode").val() == "" || $("#DeviceName").val() == "" || $("#DeviceModel").val() == "" || $("#Manufactor").val() == "") {
        $.messager.alert("提示", "请填写必填项目！", "info");
        return false;
    }

    var ID = $("#ID").val()
    var postData = {
        DeviceCode: $("#DeviceCode").val(),
        DeviceName: $("#DeviceName").val(),
        DeviceModel: $("#DeviceModel").val(),
        DID: $("#DID").combobox('getValue'),
        Manufactor: $("#Manufactor").val(),
        PID: $("#PID").combobox('getValue')
    };
    if (ID) {
        postData.ID = ID
    }
    $.post("/Home/AddOrUpdateElement", postData, function (data) {

        if (data == "ok") {
            if (ID) {
                $.messager.alert("提示", "信息编辑成功！", "info");
                $("#DeviceCode").val("");
                $("#list_data").datagrid("reload");
                $("#editwin").dialog("close");
                $('#list_data').datagrid('uncheckAll');
            } else {
                $.messager.alert("提示", "信息新增成功！", "info");
                $("#DeviceCode").val("");
                $("#list_data").datagrid("reload");
                $("#editwin").dialog("close");
                $('#list_data').datagrid('uncheckAll');
            }

        }
        else
            alert(data);
    });
}