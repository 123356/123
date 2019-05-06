$(function() {
    $("#currPosition", window.top.document).html("当前位置：电力交易 > 公式编辑 ");

    loadSelectPDF(0);
})
//加载配电房下拉框
function loadSelectPDF(pid, arr, arr1) {
    if (pid != "0") {
        $("#pdf").combobox({
            url: "/ES/PDRComboData?isall=" + "false",
            valueField: 'PID',
            textField: 'Name',
            editable: true,
            width: 200,
            onLoadSuccess: function() { //数据加载完毕事件
                var data = $('#pdf').combobox('getData');
                if (data.length > 0) {
                    $("#pdf").combobox('select', pid);
                }
            },
            onChange: function() {
                loadSelectGsId($("#pdf").combobox('getValue'), arr, arr1);
            }
        });
    } else {
        $("#pdfselect").combobox({
            url: "/ES/PDRComboData?isall=" + "false",
            valueField: 'PID',
            textField: 'Name',
            editable: true,
            onLoadSuccess: function() { //数据加载完毕事件
                var data = $('#pdfselect').combobox('getData');
                if (data.length > 0) {
                    $("#pdfselect").combobox('select', data[0].PID);
                }
            },
            onChange: function(n, o) {
                dosearch();
            }
        });
    }
}
function loadSelectGsId(pid, arr, arr1) {
    $("#jiashu").combobox({
        url: '/Es/CIDComboData?pid=' + pid,
        onlyLeafCheck: true,
        method: 'get',
        multiple: 'true',
        valueField: 'CID',
        textField: 'CName',
        editable: true,
        width: 600,
        formatter: function(row) {
            var opts = $(this).combobox('options');
            return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]
        },
        onLoadSuccess: function() {
            var opts = $(this).combobox('options');
            var target = this;
            var values = $(target).combobox('getValues');
            $.map(values, function(value) {
                var el = opts.finder.getEl(target, value);
                el.find('input.combobox-checkbox')._propAttr('checked', true);
            })
            if (arr != "") {
                $("#jiashu").combobox("setValues", arr.split(','));
                var opts = $(this).combobox('options');
                var target = this;
                var values = $(target).combobox('getValues');
                $.map(values, function(value) {
                    var el = opts.finder.getEl(target, value);
                    el.find('input.combobox-checkbox')._propAttr('checked', true);
                })
            }
        },
        onSelect: function(row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', true);
        },
        onUnselect: function(row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', false);
        }
    });
    $("#jianshu").combobox({
        url: '/Es/CIDComboData?pid=' + pid,
        onlyLeafCheck: true,
        method: 'get',
        multiple: 'true',
        valueField: 'CID',
        textField: 'CName',
        editable: true,
        width: 600,
        formatter: function(row) {
            var opts = $(this).combobox('options');
            return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]
        },
        onLoadSuccess: function() {
            var opts = $(this).combobox('options');
            var target = this;
            var values = $(target).combobox('getValues');
            $.map(values, function(value) {
                var el = opts.finder.getEl(target, value);
                el.find('input.combobox-checkbox')._propAttr('checked', true);
            })
            if (arr1 != "") {
                $("#jianshu").combobox('setValues', arr1.split(','));
                var opts = $(this).combobox('options');
                var target = this;
                var values = $(target).combobox('getValues');
                $.map(values, function(value) {
                    var el = opts.finder.getEl(target, value);
                    el.find('input.combobox-checkbox')._propAttr('checked', true);
                })
            }

        },
        onSelect: function(row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', true);
        },
        onUnselect: function(row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', false);
        }
    });

}


//加载方法
function dosearch() {
    var pdf = $("#pdfselect").combobox("getValue");
    $('#list_data').datagrid({
        url: '/Home/GetGs?Rnum=' + Math.random(),
        queryParams: { "pdf": pdf }
    });
    $('#list_data').datagrid('uncheckAll');
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
        resizable: false //可缩放，即可以通脱拖拉改变大小，默认false
    });
    //添加时默认选择客户
    var pid = $("#pdfselect").combobox("getValue");
    loadSelectPDF(pid, "", "")
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
    } else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            loadSelectPDF(row.PID, row.UserPowerCID, row.ITPowerCID);
            $("#pdf").val(row.PID);
            $("#Name").val(row.Name);
            $("#id").val(row.ID);
            $("#editwin").dialog({
                closed: false,
                top: ($(window).height() - 300) * 0.5,
                left: ($(window).width() - 600) * 0.5,
                minimizable: false, //最小化，默认false
                maximizable: false, //最大化，默认false
                collapsible: false, //可折叠，默认false
                draggable: true, //可拖动，默认false
                resizable: false //可缩放，即可以通脱拖拉改变大小，默认false
            });
            $('#list_data').datagrid('uncheckAll');
        } else {
            $.messager.alert("提示", "请选择要编辑的行！", "info");
        }
    }
}

function save() {
    if ($("#Name").val() == "") {
        $.messager.alert("提示", "请选择公式名称！", "info");
        return false;
    } else if ($("#jiashu").combobox("getValues").length == 0) {
        $.messager.alert("提示", "请选择加数！", "info");
        return false;
    }
    var jiashu = $("#jiashu").combobox("getValues");
    var jianshu = $("#jianshu").combobox("getValues");     
    var postData = {
        PID: $("#pdf").combobox("getValue"),
        UserPowerCID: jiashu.join(','),
        Name: $("#Name").val(),
        ITPowerCID: jianshu.join(','),
        ID: $("#id").val(),
    };
    $.post("/Home/SaveGs", postData, function(data) {
        if (data == "OK") {
            $.messager.alert("提示", "操作成功！", "info");
            $("#editwin").dialog("close");
            $("#list_data").datagrid("reload");
            $('#list_data').datagrid('uncheckAll');
        } else
            alert(data);
    });
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
                    ids.push(rows[i].ID);
                }
                $.post("/Home/DeleteGs?Rnum=" + Math.random(), { "id": ids.join(',') }, function(data) {
                    if (data == "OK") {
                        $.messager.alert("提示", "操作成功", "info");
                        $("#list_data").datagrid("reload");
                        $('#list_data').datagrid('uncheckAll');
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
}


$(document).ready(function() {
    $("#pdf").combobox({
        onChange: function() {
            window.dosearch();
        }
    })
});