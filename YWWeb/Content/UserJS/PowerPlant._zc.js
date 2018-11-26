$("#currPosition", window.top.document).html("当前位置：设置 > 基本设置 > 单位管理");

function LogoFormat(value, row, index) {
    if (value == null)
        return "";
    else
        return "<img width=\"50\" height=\"50\" alt=\"\" src=\"../.." + value + "\" />";
}



function loadSelectPDR(arr) {
    $("#pdflist").combobox({
        url: '/Es/PDRComboData', onlyLeafCheck: true, method: 'post', multiple: 'true',
        valueField: 'PID',
        textField: 'Name',
        editable: false,
        width: 600,
        formatter: function (row) {
            var opts = $(this).combobox('options');
            return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]
        },
        onLoadSuccess: function () {
            var opts = $(this).combobox('options');
            var target = this;
            var values = $(target).combobox('getValues');
            $.map(values, function (value) {
                var el = opts.finder.getEl(target, value);
                el.find('input.combobox-checkbox')._propAttr('checked', true);
            })
            if (arr != "" && arr != null) {
                $("#pdflist").combobox("setValues", arr.split(','));
                var opts = $(this).combobox('options');
                var target = this;
                var values = $(target).combobox('getValues');
                $.map(values, function (value) {
                    var el = opts.finder.getEl(target, value);
                    el.find('input.combobox-checkbox')._propAttr('checked', true);
                })
            }

        },
        onSelect: function (row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', true);
        },
        onUnselect: function (row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', false);
        }
    });
}


function add() {
    clearForm();
    //loadProvince();
    loadSelectPDR("");
    $("#editwin").dialog({
        closed: false,
        top: ($(window).height() - 400) * 0.5,
        left: ($(window).width() - 600) * 0.5,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
    });
}
function edit() {
    clearForm();
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].UnitID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            loadSelectPDR(row.PDRList)
            $("#UnitID").val(row.UnitID);
            $("#UnitName").val(row.UnitName);
            if (row.UnitLogo.length > 0)
                $("#Logo").html('<img width="60" height="60" alt="" src="../..' + row.UnitLogo + '"   />');
            $("#LinkMan").val(row.LinkMan);
            $("#LinkMobile").val(row.LinkMobile);
            $("#LinkAddress").val(row.LinkAddress);
            $("#InstalledCapacity").val(row.InstalledCapacity);
            $("#Coordination").val(row.Coordination);
            $("#companyName").val(row.companyName);
            $("#Nature").val(row.Nature);
            $("#editwin").dialog({
                closed: false,
                top: ($(window).height() - 400) * 0.5,
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
    var reg = /^1\d{10}$/;
    var regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if ($("#UnitName").val() == "" || $("#LinkMan").val() == "" || $("#InstalledCapacity").val() == ""  || $("#LinkAddress").val() == "" || $("#Coordination").val() == "") {
        $.messager.alert("提示", "请填写必填项目！", "info");
        return false;
    }
    else if (reg.test($("#LinkMobile").val()) == false) {
        $.messager.alert("提示", "请填写正确的联系手机！", "info");
        return false;
    }
    var pdrid = '';
    pdrid = $("#pdflist").combobox("getValues");
    var postData = {
        UnitID: $("#UnitID").val(),
        UnitName: $("#UnitName").val(),
        LinkMan: $("#LinkMan").val(),
        LinkMobile: $("#LinkMobile").val(),
        companyName: $("#companyName").val(),
        LinkAddress: $("#LinkAddress").val(),
        InstalledCapacity: $("#InstalledCapacity").val(),
        Coordination: $("#Coordination").val(),
        Nature:$("#Nature").val(),
        Type:2,
        PDRList: pdrid.join(',')
    };
    console.log(postData);
    $.post("/SysInfo/SaveUnit", postData, function (data) {
        if (data == "OKadd") {
            $("#UnitID").val("");
            $("#editwin").dialog("close");
            $.messager.alert("提示", "单位添加成功！", "info");
            window.location.reload();
        }
        else if (data == "OKedit") {
            $("#UnitID").val("");
            $("#editwin").dialog("close");
            $('#list_data').datagrid({
                url: '/SysInfo/UnitListData?rom=' + Math.random()
            });
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
                    ids.push(rows[i].UnitID);
                }
                $.post("/SysInfo/DeleteUnit?Rnum=" + Math.random(), { "uid": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        window.location.reload();
                    }
                    else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            }
        })
    }
}
function dosearch() {
    var uname = $("#unitname").val();
    var uman = $("#linkman").val();
    $('#list_data').datagrid('load', { "unitname": uname, "linkman": uman,"type":2 });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({
    url: '/SysInfo/UnitListData?rom=' + Math.random(),
    pagination: true,
    queryParams: { "type": 2 }
});
function clearForm() {
    $(':input', editwin).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
}