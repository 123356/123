$("#currPosition", window.top.document).html("当前位置：设置 > 基本设置 > 设备管理");

var pid = 0;

var Request = GetRequest();
if (Request['pid'] != null)
    pid = Request['pid'];
else {

}

pid = $.cookie('cookiepid');
if (pid == null) {
    pid = 0;
}



$("#SPID").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=1",
    valueField: 'PID',
    textField: 'Name',
    editable: true,
    onLoadSuccess: function() { //数据加载完毕事件
        var data = $('#SPID').combobox('getData');
        if ($.cookie('cookiepid') > 0) {
            $("#SPID").combobox('select', $.cookie('cookiepid'));
            return
        }
        if (data.length > 0) {
            $("#SPID").combobox('select', data[0].PID);
        }
    }
});

$(document).ready(function() {
    $("#SPID").combobox({
        onChange: function() {
            $('#list_data').datagrid('load', { "DeviceName": "", "MFactory": "", "pid": $("#SPID").combobox('getValue') });
            $('#list_data').datagrid('uncheckAll');
        }
    })
});

function dosearch() {
    var dname = $("#dname").val();
    var mname = $("#mname").val();
    var pid = $("#SPID").combobox('getValue');
    $('#list_data').datagrid('load', { "DeviceName": dname, "MFactory": mname, "pid": pid });
    $('#list_data').datagrid('uncheckAll');
}

if (pid != 0) {
    $("#SPID").combobox('select', pid);
}
$('#list_data').datagrid({
    url: '/DeviceManage/DeviceInfoData?rom=' + Math.random() + "&&pid=" + $.cookie('cookiepid'),
    onDblClickRow: function(rowIndex, rowData) {
        if (rowData) {
            var did = rowData.DID;
            $('#detailwin').window({
                modal: true,
                href: '/DeviceManage/DeviceInfo?did=' + did,
                onClose: function() {
                    //$('#list_data').datagrid('reload');
                    //$('#list_data').datagrid('uncheckAll');
                }
            });
            $('#detailwin').window('open');
        } else {
            $.messager.alert("提示", "请选择要查看的设备！", "info");
        }
        //$('#list_data').datagrid('unselectAll'); 
    }
})

function DeviceUseState(isuse) {
    if (isuse == "0")
        return "正在使用";
    else
        return "暂停使用";
}

function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy/MM/dd');
    return lDate
}

function add() {
    editFrame();
}

function edit() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].DID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    } else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            editFrame(row.DID);
            //$('#list_data').datagrid('uncheckAll');
        } else {
            $.messager.alert("提示", "请选择要编辑的行！", "info");
        }
    }
}

function Delete() {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length < 1) {
        $.messager.alert("提示", "请选择要删除的行！", "info");
    } else {
        $.messager.confirm('提示', '你确定要删除选中的行？', function(r) {
            if (r) {
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].DID);
                }
                $.post("/DeviceManage/DeleteDeviceInfo?Rnum=" + Math.random(), { "did": ids.join(',') }, function(data) {
                    if (data == "OK") {
                        dosearch();
                    } else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            }
        })
    }
}


function clearForm() {
    $(':input', editwin).each(function() {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
    $(".easyui-datebox").datebox('setValue', "");
    $('.easyui-combobox').combobox('setValue', "");
}

function detail() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].DID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "查看详细时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    } else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            var did = row.DID;
            $('#detailwin').window({
                modal: true,
                href: '/DeviceManage/DeviceInfo?did=' + did,
                onClose: function() {
                    $('#list_data').datagrid('reload');
                    $('#list_data').datagrid('uncheckAll');
                }
            });
            $('#detailwin').window('open');
        } else {
            $.messager.alert("提示", "请选择要查看的设备！", "info");
        }
    }
}

function editFrame(did) {
    $('#editwin').window({
        modal: true,
        top: ($(window).height() - 400) * 0.25,
        left: ($(window).width() - 800) * 0.5,
        height: ($(window).height() - 0) * 0.8,
        draggable: true, //可拖动，默认false  
        resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false 
        href: '/DeviceManage/DeviceEdits?did=' + did + "&pid=" + $("#SPID").combobox('getValue'),
        onClose: function() {
            $.post("/FileUpload/DeleteTempFile?Rnum=" + Math.random(), { "uid": uid }, function(data) {
                //删除临时数据
            });
            $('#list_data').datagrid('reload');
            $('#list_data').datagrid('uncheckAll');
        }
    });
    $('#editwin').window('open');
}