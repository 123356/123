$("#currPosition", window.top.document).html("当前位置：设置 > 角色 ");
$('#list_data').datagrid({
    url: '/UserInfo/LoadRoleInfo?Rnum=' + Math.random()
});
//保存权限
function saveallot() {
    var item = CheckboxValue();
    var disenableitem = DisenableCheckboxValue();
    $.post("/UserInfo/SaveRoleRight", { "ModuleID": item, "disenbaleID": disenableitem, "roleid": $("#allotid").val() }, function (data) {
        if (data == "OK") {
            $.messager.alert("提示", "角色权限分配成功！", "info");
            $("#allptpurview").dialog("close");
            $('#list_data').datagrid('uncheckAll');
        }
        else
            $.messager.alert("提示", data, "info");
    });
}
function allotAuthority() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].RoleID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "分配权限时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            $("#allotid").val(row.RoleID);
            $.post("/UserInfo/LoadAllPurview", { "roleid": row.RoleID }, function (data) {
                var obj = eval("(" + data + ")");
                $("#purview").html(obj);
                $("#dnd-example").treeTable({
                    initialState: "expanded" //collapsed 收缩 expanded展开的
                });
                $("#allptpurview").dialog({
                    closed: false,
                    top: ($(window).height() - 500) * 0.5,
                    left: ($(window).width() - 1000) * 0.5,
                    draggable: true, //可拖动，默认false   
                    minimizable: false, //最小化，默认false  
                    maximizable: false, //最大化，默认false  
                    collapsible: false, //可折叠，默认false  
                    resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
                });
            });
        }
        else {
            $.messager.alert("提示", "请选择要分配权限的角色！", "info");
        }
    }
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
            $("#RoleID").val(row.RoleID);
            $("#RoleName").val(row.RoleName);
            $("#Remarks").val(row.Remarks);
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
    var postData = {
        RoleName: $("#RoleName").val(),
        Remarks: $("#Remarks").val(),
        RoleID: $("#RoleID").val()
    };
    $.post("/UserInfo/SaveRoleInfo", postData, function (data) {
        if (data == "OK") {
            $("#RoleID").val("");
            $.messager.alert("提示", "角色信息编辑成功！", "info");
            $("#editwin").dialog("close");
            $('#list_data').datagrid({
                url: '/UserInfo/LoadRoleInfo?Rnum=' + Math.random()
            });
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
                    ids.push(rows[i].RoleID);
                }
                $.post("/UserInfo/DeleteRoleInfo?Rnum=" + Math.random(), { "roleid": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        $('#list_data').datagrid({
                            url: '/UserInfo/LoadRoleInfo?Rnum=' + Math.random()
                        });
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