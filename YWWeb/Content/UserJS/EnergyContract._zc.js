$("#currPosition", window.top.document).html("当前位置：运维 > 合同管理 ");
$(function () {
    loadSelectYear();
    loadSelectPZ();
    loadSelectPZ1();
    loadSelectYear1();
})



function OpenFrame(id) {
    $('#editwin').window({
        title:"编辑合同信息",
        modal: true,
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        href: '/ES/ConstractEdit?id=' + id+"&type=1",
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
        href: '/ES/ConstractView?id=' + id,
        onClose: function () { dosearch(); }
    });
    $('#editwin').window('open');
}
function dosearch() {
    var name = $("#cname").val();
    $('#list_data').datagrid('load', { "CtrName": name, "contype": 1 });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({
    url: '/ES/LoadConstractDatas?rom=' + Math.random(),
    pagination: true,
    queryParams: { "contype": 1, },
    rowStyler: function (index, row) {
        if (row.IsAlarm == "true") {
            return 'background-color:red;';
        }
    },
    onDblClickRow: function (rowIndex, rowData) {
        if (rowData) {
            OpenFrameView(rowData.id);
        }
        else {
            $.messager.alert("提示", "请选择要查看详细的行！", "info");
        }
    }, onLoadSuccess: function (data) {
        console.log(data);
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
    if (rows.length >=1) {
        $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
            if (r) {
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                $.post("/Es/DeleteConstract?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        $.messager.alert("提示", "操作成功", "info");
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



function addjihua() {
    clearForm();
    //clearForm1();
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length > 1) {
        $.messager.alert("提示", "只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    } else {
        if (rows.length == 1) {

            var row = $('#list_data').datagrid('getSelected');
            //if (row.ConType == "1") {
                $("#editwin3").dialog({
                    closed: false,
                    top: ($(window).height() - 600) * 0.5,
                    left: ($(window).width() - 1150) * 0.5,
                    minimizable: false, //最小化，默认false  
                    maximizable: false, //最大化，默认false  
                    collapsible: false, //可折叠，默认false  
                    draggable: false, //可拖动，默认false  
                    resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
                });
                loadSelectUnit(row.UID);
            //}
            //else {
            //    $("#editwin4").dialog({
            //        closed: false,
            //        top: ($(window).height() - 600) * 0.5,
            //        left: ($(window).width() - 1150) * 0.5,
            //        minimizable: false, //最小化，默认false  
            //        maximizable: false, //最大化，默认false  
            //        collapsible: false, //可折叠，默认false  
            //        draggable: false, //可拖动，默认false  
            //        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
            //    });
                       
            //}
        }
        else {
            $.messager.alert("提示", "请选择合同！", "info");
        }
    }
}



function save() {
    if ($("#year").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择年份！", "info");
        return false;
    }
    else if ($("#PZ").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择品种！", "info");
        return false;
    }

    var PlanStr = "";
    var PlanArr = $("input[name='BugLocation']", $("#editwin3"));
    for (var i = 0; i < PlanArr.length; i++) {
        console.log(PlanArr[i]);
        PlanStr += $(PlanArr[i]).val() + ",";
    }
    PlanStr = PlanStr.substring(0, PlanStr.length - 1);

    var dianjiaStr = "";
    var dianjiaArr = $("input[name='dianjia']", $("#editwin3"));
    for (var i = 0; i < dianjiaArr.length; i++) {
        console.log(dianjiaArr[i]);
        dianjiaStr += $(dianjiaArr[i]).val() + ",";
    }
    dianjiaStr = dianjiaStr.substring(0, dianjiaStr.length - 1);
    var wdianjiaStr = "";
    var wdianjiaArr = $("input[name='wdianjia']", $("#editwin3"));
    for (var i = 0; i < wdianjiaArr.length; i++) {
        wdianjiaStr += $(wdianjiaArr[i]).val() + ",";
    }
    wdianjiaStr = wdianjiaStr.substring(0, wdianjiaStr.length - 1);
    var row = $('#list_data').datagrid('getSelected');
    var postData = {
        year: $("#year").combobox("getValue"),
        categoryID: $("#PZ").combobox("getValue"),
        unid: $("#unit").combobox("getValue"),
        remark: $("#remark").val(),
        id: $("#id").val(),
        planstr: PlanStr,
        dianjiastr: dianjiaStr,
        wdianjiaStr:wdianjiaStr,
        conid:row.id
    };
    $.messager.confirm('提示框', '您确定保存计划吗?', function (r) {
        if (r) {
            $.post("/ES/Save1", postData, function (data) {
                if (data == "OK") {
                    $.messager.alert("提示", "操作成功！", "info");
                    $("#editwin3").dialog("close");
                    $("#list_data").datagrid("reload");
                    $('#list_data').datagrid('uncheckAll');
                }
                else
                    alert(data);
            });
        }
    })
          
}



//加载年份
function loadSelectYear() {
    $('#year').combobox({
        valueField: 'value',
        textField: 'text',
        editable: false,
        width: 200,
        data: GetYear()
    });
}

function GetYear() {
    var data = [];
    var count = new Date().getFullYear();
    for (var i = 0; i < 10; i++) {
        data.push({
            value: count + i,
            text: count + i
        })
    }
    return data;
}
//加载月份
function loadSelectMonth() {
    $('#month').combobox({
        valueField: 'value',
        textField: 'text',
        editable: false,
        width: 200,
        data: [
             {
                 value: '1',
                 text: '01'
             }, {
                 value: '2',
                 text: '02'
             }, {
                 value: '3',
                 text: '03'
             }, {
                 value: '4',
                 text: '04'
             }, {
                 value: '5',
                 text: '05'
             }, {
                 value: '6',
                 text: '06'
             }, {
                 value: '7',
                 text: '07'
             }, {
                 value: '8',
                 text: '08'
             }, {
                 value: '9',
                 text: '09'
             }, {
                 value: '10',
                 text: '10'
             }, {
                 value: '11',
                 text: '11'
             }, {
                 value: '12',
                 text: '12'
             }
        ]
    });
}

//加载品种下拉框
function loadSelectPZ() {
    $("#PZ").combobox({
        url: "/ES/BindCategory?isall=" + "false",
        valueField: 'id',
        textField: 'category_name',
        editable: false,
        width: 200
    });
}

//加载客户下拉框
function loadSelectUnit(uid) {
    $("#unit").combobox({
        url: "/ES/UnitComboData?isall=" + "false",
        valueField: 'UnitID',
        textField: 'UnitName',
        editable: true,
        width: 200,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#unit').combobox('getData');
            if (data.length > 0 && uid != null && uid != "") {
                $("#unit").combobox('select', uid);
            }
        }
    });
}
function clearForm() {
    $(':input', editwin3).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
}

function setType(val, row, r) {
    if (val == "1") {
        return "售电";
    }
    else if (val == "2") {
        return "购电";
    } else {
        return "购电";
    }
}

function save1() {
    if ($("#year1").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择年份！", "info");
        return false;
    }
    else if ($("#PZ1").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择品种！", "info");
        return false;
    }
    else if ($("#company").val() == "") {
        $.messager.alert("提示", "请输入售电方名称！", "info");
        return false;
    }

    var PlanStr = "";
    var PlanArr = $("input[name='BugLocation']", $("#editwin4"));
    for (var i = 0; i < PlanArr.length; i++) {
        PlanStr += $(PlanArr[i]).val() + ",";
    }
    PlanStr = PlanStr.substring(0, PlanStr.length - 1);

    var dianjiaStr = "";
    var dianjiaArr = $("input[name='dianjia']", $("#editwin4"));
    for (var i = 0; i < dianjiaArr.length; i++) {
        dianjiaStr += $(dianjiaArr[i]).val() + ",";
    }
    dianjiaStr = dianjiaStr.substring(0, dianjiaStr.length - 1);
    var row = $('#list_data').datagrid('getSelected');
    var postData = {
        quantity: $("#quantity").val(),
        company: $("#company").val(),
        categoryID: $("#PZ1").combobox("getValue"),
        id: $("#id").val(),
        planstr: PlanStr,
        year: $("#year1").combobox("getValue"),
        dianjiastr: dianjiaStr,
        conid: row.id

    };
    console.log(postData);

    $.messager.confirm('提示框', '您确定保存计划吗?', function (r) {

        if (r) {
            $.post("/ES/SavePurchase1", postData, function (data) {
                if (data == "OK") {
                    $.messager.alert("提示", "操作成功！", "info");
                    $("#editwin4").dialog("close");
                    $("#list_data").datagrid("reload");
                    $('#list_data').datagrid('uncheckAll');
                }
                else
                    alert(data);
            });
        }
    })

}
//加载品种下拉框
function loadSelectPZ1() {
    $("#PZ1").combobox({
        url: "/ES/BindCategory?isall=" + "false",
        valueField: 'id',
        textField: 'category_name',
        editable: false,
        width: 200,
    });
}

//加载年份
function loadSelectYear1() {
    $('#year1').combobox({
        valueField: 'value',
        textField: 'text',
        editable: false,
        width: 200,
        data: GetYear()
    });
}

function clearForm1() {
    $(':input', editwin4).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
}