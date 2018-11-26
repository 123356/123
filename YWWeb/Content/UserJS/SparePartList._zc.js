$("#currPosition", window.top.document).html("当前位置：运维 > 备件管理 > 设备备件 ");
$('#list_data').datagrid({
    url: '/SparePartManage/SparePartInfoData?rom=' + Math.random()
})

//查询
function dosearch() {
    var sparepartname = $("#sparepartname").val();
    $('#list_data').datagrid('load', { "SparePartName": sparepartname });
    $('#list_data').datagrid('uncheckAll');
}

function UseState(isuse) {
    if (isuse == "0")
        return "正在使用";
    else
        return "暂停使用";
}

//新增
function add() {
    editFrame(0);
}

//编辑
function edit() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].SparePartID);
    }

    if (ids.length == 0) {
        $.messager.alert("提示", "请选择要编辑的行！", "info");
    }
    else if (ids.length == 1) {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            editFrame(row.SparePartID);
        }
    }
    else {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
}

function editFrame(sparepartid) {
    $('#editwin').window({
        modal: true,
        draggable: true, //可拖动，默认false  
        resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false 
        href: '/SparePartManage/SparePartEdits?sparepartid=' + sparepartid,
        onClose: function () {
            $('#list_data').datagrid('reload');
            $('#list_data').datagrid('uncheckAll');
        }
    });
    $('#editwin').window('open');
}

// 删除
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
                    ids.push(rows[i].SparePartID);
                }
                $.post("/SparePartManage/DeleteSparePartInfo?Rnum=" + Math.random(), { "sparepartid": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        dosearch();
                    }
                    else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            }
        })
    }
}