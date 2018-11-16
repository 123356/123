$("#currPosition", window.top.document).html("当前位置：设置 > 用户 ");
function OpenFrame(userid) {
    $('#editwin').window({
        modal: true,
        top: ($(window).height() - 450) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        height: ($(window).height() - 0) * 0.7,
        draggable: false, //可拖动，默认false  
        resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false    
        href: '/UserInfo/UserEdit?userid=' + userid,
        onClose: function () { dosearch(); }
    });
    $('#editwin').window('open');
}
function dosearch() {
    var name = $("#uname").val();
    $('#list_data').datagrid('load', { "username": name });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({
    url: '/UserInfo/LoadPageDatas?rom=' + Math.random(),
    pagination: true
});
function add() {
    OpenFrame();
}
function edit() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].UserID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            OpenFrame(row.UserID);
        }
        else {
            $.messager.alert("提示", "请选择要编辑的行！", "info");
        }
    }
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
                    ids.push(rows[i].UserID);
                }
                $.post("/UserInfo/DeleteUserInfo?Rnum=" + Math.random(), { "userid": ids.join(',') }, function (data) {
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
                    ids.push(rows[i].UserID);
                }
                $.post("/UserInfo/ResetPwd?Rnum=" + Math.random(), { "userid": ids.join(',') }, function (data) {
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
                    ids.push(rows[i].UserID);
                }
                $.post("/UserInfo/IsScreen?Rnum=" + Math.random(), { "userid": ids.join(','), "screen": iscreen }, function (data) {
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
            top: ($(window).height() - 450) * 0.5,
            left: ($(window).width() - 800) * 0.5,
            height: 400,
            draggable: false, //可拖动，默认false  
            resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false    
            href: '/PerationMaintenance/StaffManage?userid=' + userMob
        });
        $('#editwin').window('open');
    }
    else
        $.messager.alert("提示", "请选择短信接收人。", "info");
}

function IsAdmin() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].UserID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        $.messager.confirm('提示', '你确定要执行此操作吗？', function (r) {
            if (r) {
                $.post("/UserInfo/SetAdmin?Rnum=" + Math.random(), { "id": row.UserID }, function (data) {
                    if (data == "OK") {
                        dosearch();
                    }
                    else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            } else {
                $.messager.alert("提示", "请选择要编辑的行！", "info");
            }
        });
    }
}
function setAdmin(val) {
    switch (val) {
        case 'True':
            return "是";
            break;
        case 'False':
            return "否";
            break;
        default:
            return "否";
            break;
    }
}
function setAlarmMsg(val) {
    switch (val) {
        case "1":
            return "是";
            break;
        case "0":
            return "否";
            break;
        default:
            return "否";
            break;
    }
}