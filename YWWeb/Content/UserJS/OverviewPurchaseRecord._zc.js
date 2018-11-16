

$('#ly').combobox({
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
             text: '年度双边交易'
         }, {
             value: '2',
             text: '年度集中交易'
         }, {
             value: '3',
             text: '月度交易'
         }
    ], onLoadSuccess: function () { //数据加载完毕事件
        var data = $('#ly').combobox('getData');
        if (data.length > 0) {
            $("#ly").combobox('select', data[0].value);
        }
    }
});
$(function () {
    $("#currPosition", window.top.document).html("当前位置：电力交易 > 购电记录录入 ");
    loadSelectYear();
    loadSelectMonth();
    loadSelectPZ(0);
    loadSelectWeek();
    loadSelectSource();
})

function setSourceText(val) {
    var text = "";
    switch (val) {
        case "1":
            text = "年度双边交易";
            break;
        case "2":
            text = "年度集中交易";
            break;
        case "3":
            text = "月度交易";
            break;
        default:
            text = ""
    }
    return text;
}

function loadSelectSource() {
    $('#cbxSource').combobox({
        valueField: 'value',
        textField: 'text',
        editable: false,
        width: 200,
        data: [
             {
                 value: '1',
                 text: '年度双边交易'
             }, {
                 value: '2',
                 text: '年度集中交易'
             }, {
                 value: '3',
                 text: '月度交易'
             }
        ]
    });
}

function setWeekText(val) {
    var text = "第一周";
    switch (val) {
        case "1":
            text = "第一周";
            break;
        case "2":
            text = "第二周";
            break;
        case "3":
            text = "第三周";
            break;
        case "4":
            text = "第四周";
            break;
        default:
            text = "第一周"
    }
    return text;
}

function loadSelectWeek() {
    $('#Indexweek').combobox({
        valueField: 'value',
        textField: 'text',
        editable: false,
        width: 200,
        data: [
             {
                 value: '1',
                 text: '第一周'
             }, {
                 value: '2',
                 text: '第二周'
             }, {
                 value: '3',
                 text: '第三周'
             }, {
                 value: '4',
                 text: '第四周'
             }
        ]
    });
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

//加载品种下拉框
function loadSelectPZ(pzid) {
    if (pzid != "0") {
        $("#PZ").combobox({
            url: "/ES/BindCategory?isall=" + "false",
            valueField: 'id',
            textField: 'category_name',
            editable: false,
            width: 200,
            onLoadSuccess: function () { //数据加载完毕事件
                var data = $('#PZ').combobox('getData');
                if (data.length > 0) {
                    $("#PZ").combobox('select', pzid);
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
                dosearch();
            }
        });
    }
}

//加载方法
function dosearch() {
    var pz = $("#pzselect").combobox("getValue");
    var ly = $("#ly").combobox("getValue");
    var month = $("#monthselect").combobox("getValue");
    if (pz == "") {
        pz = "0";
    }
    if (ly == "") {
        ly = 0;
    }
    if (month == "") {
        month = "0";
    }
    $('#list_data').datagrid({
        url: '/ES/GetPurchaseList?Rnum=' + Math.random(),
        showFooter: true,
        queryParams: { "pz": pz, "ly": ly, "month": month },

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
        draggable: false, //可拖动，默认false
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false
    });
    //添加时默认选择配电室
    var pzid = $("#pzselect").combobox("getValue");
    if (pzid == 0) {
        var datapz = $('#pzselect').combobox('getData');
        pzid = datapz[1].id;
    }
    loadSelectPZ(pzid)

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
            console.log(row);
            loadSelectPZ(row.categoryID);
            $("#quantity").val(row.quantity);
            $("#company").val(row.company);
            $("#id").val(row.id)
            $("#jiaoyi").val(row.trade_price);
            $("#year").combobox("setValue", row.year);
            $("#month").combobox("setValue", row.month);
            $("#Indexweek").combobox("setValue", row.Indexweek),
            $("#TradeTime").datebox("setValue", row.TradeTime),
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
    else if ($("#quantity").val() == "") {
        $.messager.alert("提示", "请输入购电量！", "info");
        return false;
    }
    else if ($("#company").val() == "") {
        $.messager.alert("提示", "请输入售电方名称！", "info");
        return false;
    }
    else if ($("#PZ").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择品种！", "info");
        return false;
    }
    else if ($("#jiaoyi").val() == "") {
        $.messager.alert("提示", "请输入交易电价！", "info");
        return false;
    }
        //else if ($("#Indexweek").combobox("getValue") == "") {
        //    $.messager.alert("提示", "请选择周！", "info");
        //    return false;
        //}
    else if ($("#TradeTime").datebox("getValue") == "") {
        $.messager.alert("提示", "请选择交易时间！", "info");
        return false;
    }
    else if ($("#cbxSource").datebox("getValue") == "") {
        $.messager.alert("提示", "请选择电量来源！", "info");
        return false;
    }
    var postData = {
        Indexweek: $("#Indexweek").combobox("getValue"),
        TradeTime: $("#TradeTime").datebox("getValue"),
        year: $("#year").combobox("getValue"),
        month: $("#month").combobox("getValue"),
        quantity: $("#quantity").val(),
        company: $("#company").val(),
        categoryID: $("#PZ").combobox("getValue"),
        trade_price: $("#jiaoyi").val(),
        TradeSourceID: $("#cbxSource").combobox("getValue"),
        id: $("#id").val()
    };
    console.log(postData);
    $.post("/ES/SavePurchase", postData, function (data) {
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
                $.post("/ES/DeletePurchase?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
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