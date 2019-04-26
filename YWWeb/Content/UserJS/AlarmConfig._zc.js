$("#currPosition", window.top.document).html("当前位置：设置 > 基本设置 > 点表管理 ");

var pid = 0,
    did = 0,
    tagname = '',
    docount = 0,
    mode = 0;
$("#Cover").change(function() {
    if (mode == 0) {
        $.messager.alert("提示", "<a class = 'RStar'>*</a>注意！覆盖导入会覆盖已经存在的测点信息。", "info");
        mode = 1;
    } else mode = 0;
});
$("#SPID").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=7",
    valueField: 'PID',
    textField: 'Name',
    editable: false,
    onLoadSuccess: function(data) { //数据加载完毕事件
        if (data.length > 0) {
            pid = data[0].PID;
        }
        $("#SPID").combobox('select', pid);
        //dosearch();
    }
});

var editIndex = undefined;

function endEditing() {
    if (editIndex == undefined) {
        return true
    }
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

function dosearch() {
    pid = $("#SPID").combobox("getValue");
    $('#list_data').datagrid({
        url: "/SysInfo/GetPueAlarm",
        queryParams: {
            "pid": pid
        }
    });
}
function add() {
    if (endEditing()) {
        $('#list_data').datagrid('appendRow', {
            ID: -1,
            PID: pid,
            TypeName: "PUE报警",
            LimitH1:0.00,
            LimitH2: 0.00,
            LimitH3: 0.00,
            LimitL1: 0.00,
            LimitL2: 0.00,
            LimitL3: 0.00,
        });
        editIndex = $('#list_data').datagrid('getRows').length - 1;
        $('#list_data').datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
    }
}

function edit() {
    if (endEditing()) {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            var index = $('#list_data').datagrid('getRowIndex', row);
            onClickCell(index);
        } else {
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
                ID: row.ID,
                UID: row.UID,
                PID: row.PID,
                TypeName: row.TypeName,
                LimitH1: row.LimitH1,
                LimitH2: row.LimitH2,
                LimitH3: row.LimitH3,
                LimitL1: row.LimitL1,
                LimitL2: row.LimitL2,
                LimitL3: row.LimitL3
            }; 
            $.post("/SysInfo/SavePueError", postData,
                function (data) {
                    $('#list_data').datagrid('reload');
                    if (data.indexOf("OKadd") >= 0) {
                    
                    } else if (data == "OKedit") {
                      
                    } else {
                        $.messager.alert("提示",data);

                    }
                });
        }
    } else {
        $.messager.alert("请输入必填项！");
    }
}



function restore() {
    if (editIndex == undefined) { return }
    $('#list_data').datagrid('acceptChanges');
    var row = $('#list_data').datagrid('getSelected');
    if (row.TagID == undefined)
        $('#list_data').datagrid('cancelEdit', editIndex).datagrid('deleteRow', editIndex);
    else
        $('#list_data').datagrid('cancelEdit', editIndex);
    editIndex = undefined;
    $('#list_data').datagrid('reload');
}

function inport() {
    upload5('file');
    $("#uploadwin").dialog({
        closed: false,
        top: ($(window).height() - 450) * 0.5,
        left: ($(window).width() - 700) * 0.5,
        minimizable: false,
        //最小化，默认false  
        maximizable: false,
        //最大化，默认false  
        collapsible: false,
        //可折叠，默认false  
        draggable: true,
        //可拖动，默认false  
        resizable: false,
        //可缩放，即可以通脱拖拉改变大小，默认false 
        onClose: function() {
            location.reload();
        }
    });
}

function Delete() {
    var row = $('#list_data').datagrid('getSelected');
    if (!row) {
        $.messager.alert("提示", "请选择要删除的行！", "info");
    } else {
        $.messager.confirm('提示', '你确定要删除选中的行？',
            function(r) {
                if (r) {
                    $.post("/SysInfo/DeleteAlarm", {
                        "PID": row.PID,
                            "TypeId": row.TypeId
                        },
                        function(data) {
                            if (data == "OK") {
                                $('#list_data').datagrid('reload');
                            } else {
                                $.messager.alert("提示", data, "info");
                            }
                        });
                }
            });
    }
}




$(document).ready(function() {
    $("#SPID").combobox({
        onChange: function() {
            dosearch();
        }
    })
});