
    $('#list_data').datagrid({
        url: '/UserInfo/IndustryData?rom=' + Math.random(),
        pagination: true
    });


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
        ids.push(rows[i].IndustryID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            $("#IndustryID").val(row.IndustryID);
            $("#IndustryName").val(row.IndustryName);
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
        IndustryName: $("#IndustryName").val(),
        IndustryID: $("#IndustryID").val()
    };
    $.post("/UserInfo/saveIndustryInfo", postData, function (data) {
        $("#IndustryID").val("");
        $.messager.alert("提示", "行业信息编辑成功！", "info");
        $("#editwin").dialog("close");
        $("#list_data").datagrid("reload");
        $('#list_data').datagrid('uncheckAll');
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
                    ids.push(rows[i].IndustryID);
                }
                $.post("/UserInfo/DeleteIndustryInfo?Rnum=" + Math.random(), { "IndustryID": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        $('#list_data').datagrid({
                            url: '/UserInfo/IndustryData?Rnum=' + Math.random()
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

