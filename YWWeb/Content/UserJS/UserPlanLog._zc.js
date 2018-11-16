$(function () {
    $("#currPosition", window.top.document).html("当前位置：电力交易 > 总览信息录入 ");
    loadSelectYear(0);
    loadSelectMonth(0);
    loadSelectUnit(0);
    GetYear();
})
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy/MM/dd hh:mm:ss');
    return lDate
}
function getConfirmWeb(value, row, index) {
    return getStr(value)
}
function getConfirmWx(value, row, index) {
    return getStr(value)
}
function getStr(value) {
    switch (value) {
        case 0:
            return "未确认";
        case 1:
            return "已确认";
        default:
            return "无";
    }
}
//加载年份
function loadSelectYear(id) {
    if (id != "0") {
        $('#year').combobox({
            valueField: 'value',
            textField: 'text',
            editable: false,
            width: 200,
            data: GetYear(),
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#year').combobox('getData');
                if (data.length > 0) {
                    $("#year").combobox('select', id);
                }
            }
        });
    } else {
        $('#yearselect').combobox({
            valueField: 'value',
            textField: 'text',
            editable: false,
            width: document.body.clientWidth * 0.1,
            data: GetYear(),
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#yearselect').combobox('getData');
                if (data.length > 0) {
                    $("#yearselect").combobox('select', data[0].value);
                }
            }
        });
    }
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
function loadSelectMonth(id) {
    if (id != "0") {
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
            ], onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#month').combobox('getData');
                if (data.length > 0) {
                    $("#month").combobox('select', id);
                }
            }
        });
    } else {
        $('#monthselect').combobox({
            valueField: 'value',
            textField: 'text',
            editable: false,
            width: 200,
            data: [
                {
                    value: '0',
                    text: '全部'
                },
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
            ],
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#monthselect').combobox('getData');
                if (data.length > 0) {
                    $("#monthselect").combobox('select', data[0].value);
                }
            }
        });
    }

}




//加载客户下拉框
function loadSelectUnit(uid) {
    if (uid != "0") {
        $("#unit").combobox({
            url: "/ES/UnitComboData?isall=" + "false",
            valueField: 'UnitID',
            textField: 'UnitName',
            editable: true,
            width: 200,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#unit').combobox('getData');
                if (data.length > 0) {
                    $("#unit").combobox('select', uid);
                }
            }
        });
    } else {
        $("#unitselect").combobox({
            url: "/ES/UnitComboData?isall=" + "true",
            valueField: 'UnitID',
            textField: 'UnitName',
            editable: true,
            width: 300,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#unitselect').combobox('getData');
                if (data.length > 0) {
                    $("#unitselect").combobox('setValue', data[0].UnitID);
                }
                loadSelectPZ(0);
            }
            , onSelect: function (n) {
                dosearch();
            }
        });
    }
}
//加载品种下拉框
function loadSelectPZ(id) {
    if (id != 0) {
        $("#PZ").combobox({
            url: "/ES/BindCategory?isall=" + "false",
            valueField: 'id',
            textField: 'category_name',
            editable: false,
            width: 200,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#PZ').combobox('getData');
                if (data.length > 0) {
                    $("#PZ").combobox('select', id);
                }
            }
        });
    } else {
        $("#pzselect").combobox({
            url: "/ES/BindCategory?isall=" + "true",
            valueField: 'id',
            textField: 'category_name',
            editable: true,
            width: 300,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#pzselect').combobox('getData');
                if (data.length > 0) {
                    $("#pzselect").combobox('select', data[0].id);
                }
            },
            onSelect: function (n, o) {
                //console.log(o);
                dosearch();
            }
        });
    }
}

//加载方法
function dosearch() {
    var pz = $("#pzselect").combobox("getValue");
    var unit = $("#unitselect").combobox("getValue");
    var year = $("#yearselect").combobox("getValue");
    var month = $("#monthselect").combobox("getValue");
    if (pz == "") {
        pz = "0";
    }
    if (unit == "") {
        unit = "0";
    }
    if (year == "") {
        year = "0";
    }
    if (month == "") {
        month = "0";
    }
    $('#list_data').datagrid({
        url: '/ES/GetUserPlanLogList?Rnum=' + Math.random(),
        showFooter: true,
        queryParams: { "pz": pz, "unit": unit, "year": year, "mon": month }
    });
    $('#list_data').datagrid('uncheckAll');
}
function changePlanList() {
    var unit = $("#unitselect").combobox("getValue");
    var year = $("#yearselect").combobox("getValue");
    var month = $("#monthselect").combobox("getValue");
    if (unit == 0) {
        $.messager.alert("提示", "请选择客户！", "info");
        return false;
    }
    if (year == 0) {
        $.messager.alert("提示", "请选择年份！", "info");
        return false;
    }
    if (month == 0) {
        $.messager.alert("提示", "请选择月份！", "info");
        return false;
    }
    $("#editwin_plan").dialog({
        closed: false,
        top: ($(window).height() - 300) * 0.2,
        left: ($(window).width() - 600) * 0.1,
        width: $(window).width() * 0.9,
        height: $(window).height() * 0.6,
        minimizable: true, //最小化，默认false  
        maximizable: true, //最大化，默认false  
        collapsible: true, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: true//可缩放，即可以通脱拖拉改变大小，默认false 
    });
    $('#list_change').datagrid({
        url: '/ES/GetPlanChangeList?Rnum=' + Math.random(),
        queryParams: { "year": year, "month": month, "UnitID": unit }
    });
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
        draggable: false, //可拖动，默认false  
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
    });
    //添加时默认选择客户
    var uid = $("#unitselect").combobox("getValue");
    if (uid == 0) {
        var data = $('#unitselect').combobox('getData');
        uid = data[1].UnitID;
    }
    loadSelectUnit(uid)
    var id = $("#pzselect").combobox("getValue");
    if (id == 0) {
        var datapz = $('#pzselect').combobox('getData');
        id = datapz[1].id;
    }
    loadSelectPZ(id);
    var mid = $("#monthselect").combobox("getValue");
    if (mid == 0) {
        var data = $('#monthselect').combobox('getData');
        mid = data[1].value;
    }
    loadSelectMonth(mid)
    var yid = $("#yearselect").combobox("getValue");
    if (yid == 0) {
        var data = $('#yearselect').combobox('getData');
        yid = data[1].value;
    }
    loadSelectYear(yid)
}


function QuRenPlan() {
    clearForm();
    $("#editwin2").dialog({
        closed: false,
        top: ($(window).height() - 300) * 0.5,
        left: ($(window).width() - 600) * 0.5,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
    });
    $.post('/Es/BindCategory', { "isall": "false" }, function (data) {
        var dataJson = JSON.parse(data);
        var html = "";
        $.each(dataJson, function (index, val) {
            if (index % 2 == 0) {
                html += '<tr>';
            }
            html += '<td class="d_l_t">' + val.category_name + ''

            html += '</td>';
            html += '<td class="d_l_d">'
            html += '<input runat="server" name="pzPlan" data-id=' + val.id + ' onKeyUp="value = value.replace(/[^\.\d]/g,"")" class="easyui-validatebox" style="width: 195px;" /><b class="RStar">&nbsp*</b>';
            html += '</td>'

            if (index % 2 != 0) {
                html += "</tr>"
            }

        })
        $("#edit2pz").html(html);
    })
    var ht = $("#pzselect").combobox("getText");
    $("#pzName").html(ht + "：");
}


function cfm() {
    $.messager.confirm('提示', '你确定要完成所选项？', function (r) {
        if (r == true) {
            replyConfirm();
        }

    });
}
function replyConfirm() {
    var fuyu = $("#fuyu").val();
    if ($("#changgui").val() == "") {
        $.messager.alert("提示", "请输入常规计划！", "info");
        return false;
    }
    else if ($("#fuyu").val() == "") {
        fuyu = 0;

    }
    var row = $('#list_data').datagrid('getSelected');
    var planStr = "";
    var pzid = "";
    var planArr = $("input[name='pzPlan']", $("#editwin2"));
    alert(planArr);
    for (var i = 0; i < planArr.length; i++) {
        console.log($(planArr[i]).val());
        if ($(planArr[i]).val() != "" && $(planArr[i]).val() != null) {
            planStr += $(planArr[i]).val() + ",";
            pzid += $(planArr[i]).attr("data-id") + ",";
        }
    }
    planStr = planStr.substring(0, planStr.length - 1);
    pzid = pzid.substring(0, pzid.length - 1);
    alert(pzid);
    var postData = {
        UnitID: $("#unitselect").combobox("getValue"),
        year: $("#yearselect").datebox("getValue"),
        month: $("#monthselect").datebox("getValue"),
        confirm_web: 1,
        id: 0,
        planStr: planStr,
        pzid: pzid
        //changgui: $("#changgui").val(),
        //fuyu: fuyu
    };
    $.post("/ES/getLastConfirm", postData, function (data) {
        var obj = eval('(' + data + ')');
        if (obj.code == 0) {
            $.messager.alert("提示", "确认成功", "info");
            $("#editwin_plan").dialog("close");
            $("#editwin2").dialog("close");
            $('#list_data').datagrid('reload');
            $('#list_data').datagrid('uncheckAll');
            clearForm1();


        }
        else
            alert(obj.data);
    });
}
function confirm_reply() {
    var suggest_plan = $("#suggest_plan").val();
    var suggest_first = $("#suggest_first").val();
    var suggest_second = $("#suggest_second").val();
    var suggest_third = $("#suggest_third").val();
    var suggest_fourth = $("#suggest_fourth").val();
    var suggest_remark = $("#suggest_remark").val();
    var row = $('#list_data').datagrid('getSelected');
    var postData = {
        UnitID: row.unid,
        year: row.year,
        month: row.month,
        change_plan: suggest_plan,
        first_week: suggest_first,
        second_week: suggest_second,
        third_week: suggest_third,
        fourth_week: suggest_fourth,
        web_remark: suggest_remark,
        confirm_web: 1,
        confirm_wx: 0
    };
    $.post("/ES/savePlanChangeRecord", postData, function (data) {
        var obj = eval('(' + data + ')');
        if (obj.code == 0) {
            $.messager.alert("提示", obj.data, "info");
            $("#editwin_reply").dialog("close");
            $("#list_change").datagrid("reload");
            $('#list_change').datagrid('uncheckAll');
        }
        else
            alert(obj.data);
    });
}
function reply() {
    $(':input', $("#editwin_reply")).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
    $("#editwin_reply").dialog({
        closed: false,
        top: ($(window).height() - 300) * 0.5,
        left: ($(window).width() - 600) * 0.5,
        minimizable: true, //最小化，默认false  
        maximizable: true, //最大化，默认false  
        collapsible: true, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: true//可缩放，即可以通脱拖拉改变大小，默认false 
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
        console.log(row);
        if (row) {
            loadSelectUnit(row.unid);

            loadSelectPZ(row.categoryID);
            $("#year").combobox("setValue", row.year);
            $("#month").combobox("setValue", row.month);
            $("#PZ").combobox("setValue", row.categoryID);
            $("#plan").val(row.plan);
            $("#remark").val(row.remark);
            $("#id").val(row.id)
            $("#jiaoyi").val(row.trade_price);
            $("#extraTradePrice").val(row.extraTradePrice)
            $("#editwin").dialog({
                closed: false,
                top: ($(window).height() - 300) * 0.5,
                left: ($(window).width() - 600) * 0.5,
                minimizable: false, //最小化，默认false  
                maximizable: false, //最大化，默认false  
                collapsible: false, //可折叠，默认false  
                draggable: false, //可拖动，默认false  
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
    if ($("#year").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择年份！", "info");
        return false;
    }
    else if ($("#month").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择月份！", "info");
        return false;
    }
    else if ($("#PZ").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择品种！", "info");
        return false;
    }
    else if ($("#unit").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择客户！", "info");
        return false;
    }
    else if ($("#plan").val() == "") {
        $.messager.alert("提示", "请输入计划用电！", "info");
        return false;
    }
    else if ($("#jiaoyi").val() == "") {
        $.messager.alert("提示", "请输入交易电价！", "info");
        return false;
    }
    var postData = {
        year: $("#year").combobox("getValue"),
        month: $("#month").combobox("getValue"),
        plan: $("#plan").val(),
        categoryID: $("#PZ").combobox("getValue"),
        unid: $("#unit").combobox("getValue"),
        remark: $("#remark").val(),
        trade_price: $("#jiaoyi").val(),
        id: $("#id").val(),
        extraTradePrice: $("#extraTradePrice").val()
    };
    console.log(postData);
    $.post("/ES/SaveLOG", postData, function (data) {
        if (data == "OK") {
            $.messager.alert("提示", "操作成功！", "info");
            $("#editwin").dialog("close");
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
                    ids.push(rows[i].id);
                }
                $.post("/ES/DeleteUserPlanLog?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        $.messager.alert("提示", "操作成功", "info");
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
function clearForm1() {
    $(':input', editwin2).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
}






