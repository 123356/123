$("#currPosition", window.top.document).html("当前位置：运维 > 合同管理 ");
function OpenFrame(id) {
    $('#editwin').window({
        title:"编辑合同信息",
        modal: true,
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        href: '/UserInfo/ConstractEdit?id=' + id,
        onClose: function () { dosearch(); }
    });
    $('#editwin').window('open');
}
function OpenFrameView(id) {
    $('#editwin').window({
        modal: true,
        title: "查看合同信息",
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        href: '/UserInfo/ConstractView?id=' + id,
        onClose: function () { dosearch(); }
    });
    $('#editwin').window('open');
}
function dosearch() {
    var name = $("#cname").val();
    $('#list_data').datagrid('load', { "CtrName": name });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({
    url: '/UserInfo/LoadConstractDatas?rom=' + Math.random(),
    pagination: true,
    onDblClickRow: function (rowIndex, rowData) {
        if (rowData) {
            OpenFrameView(rowData.id);
        }
        else {
            $.messager.alert("提示", "请选择要查看详细的行！", "info");
        }
    }
});
function add() {
    OpenFrame();
}
function edit() {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length == 1) {
        OpenFrame(rows[0].id);
    } 
    else {
        $.messager.alert("提示", "请选择要编辑的行！", "info");
    }
}
function delect() {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length == 1) {
        $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
            if (r) {
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                //href: '/UserInfo/ConstractEdit?id=' + id,
                $.post("/UserInfo/DeleteConstract?Rnum=" + Math.random(), { "id": rows[0].id }, function (data) {
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
    else {
        $.messager.alert("提示", "请选择要编辑的行！", "info");
    }
}
function lock() {
    updatescreen(1);
}
function accredit() {
    updatescreen(0);
}
function reset() {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length < 1) {
        $.messager.alert("提示", "请选择要操作的行！", "info");
    }
    else {
        $.messager.confirm('提示', '你确定要执行此操作吗？', function (r) {
            if (r) {
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                $.post("/UserInfo/ResetPwd?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        dosearch();
                    }
                    else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            }
        });
    }
}
function updatescreen(iscreen) {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length < 1) {
        $.messager.alert("提示", "请选择要操作的行！", "info");
    }
    else {
        $.messager.confirm('提示', '你确定要执行此操作吗？', function (r) {
            if (r) {
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                $.post("/UserInfo/IsScreen?Rnum=" + Math.random(), { "id": ids.join(','), "screen": iscreen }, function (data) {
                    if (data == "OK") {
                        dosearch();
                    }
                    else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            }
        });
    }
}
function isScreen(value) {
    if (value == "0")
        value = "<div style='color:green;'>启用</div>";
    else if (value == "2")
        value = "<div style='color:red;'>申请</div>";
    else
        value = "<div style='color:red;'>屏蔽</div>";
    return value;
}
function send() {
    var row = $('#list_data').datagrid('getSelections');

    if (row.length > 0) {
        var kq = "";
        var sn = "";
        for (var i = 0; i < row.length; i++) {
            kq += row[i].Mobilephone + ",";
            sn += "'" + row[i].UserName + "'" + ",";
        }

        var userMob = "{'Mob':[" + kq + "],'Nam':[" + sn + "]}";
        $('#editwin').window({
            title: "编辑短信",
            modal: true,
            top: ($(window).height() - 600) * 0.1,
            left: ($(window).width() - 800) * 0.5,
            width: document.body.clientWidth * 0.4,
            height: document.body.clientHeight * 0.5,
            href: '/PerationMaintenance/StaffManage?id=' + userMob
        });
        $('#editwin').window('open');
    }
    else
        $.messager.alert("提示", "请选择短信接收人。", "info");
}