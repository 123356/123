
var pid = 0;

var Request = GetRequest();
if (Request['type'] != "new") {
    if (Request['pid'] != null)
        pid = Request['pid'];
    else
        pid = $.cookie('cookiepid');

    if (pid == null || pid == "") {
        pid = 0;
    }
} else {
    pid = 0;
}
$("#currPosition", window.top.document).html("当前位置：运维 > 工单管理 ");
var mouseX;
var mouseY;
function show(event) {
    var infoDiv = document.getElementById('infoDiv');
    mouseOver(event);
    document.getElementById("a").innerHTML = mouseX + " " + mouseY;
    infoDiv.style.display = "block";
    infoDiv.innerHTML = mouseX + " " + mouseY;
    infoDiv.style.left = mouseX + 10 + "px";
    infoDiv.style.top = mouseY + 10 + "px";
}
function hide() {
    var infoDiv = document.getElementById('infoDiv').style.display = "none";;
}
function mouseOver(obj) {
    e = obj || window.event;
    // 此处记录鼠标停留在组建上的时候的位置, 可以自己通过加减常量来控制离鼠标的距离.
    mouseX = e.layerX || e.offsetX;
    mouseY = e.layerY || e.offsetY;
}

$(function () {
    $(document.body).mousemove(function () {
        var left = event.x + 10;
        var top = event.y + 10;
        $("#show").css({ "left": left, "top": top });
    });
});

$('#list_data').datagrid({
    url: 'empty.json',
    columns: [[
        { field: 'OrderID', title: 'Order ID', width: 30, checkbox: true },
        {
            field: 'CreateDate', title: '发布日期', width: 40, formatter: function (val) {
                if (val != "")
                    return new Date(val).Format("yyyy-MM-dd hh:mm");
                else
                    return "";
            }
        },
        { field: 'OrderName', title: '工单名称', width: 50 },
        { field: 'PName', title: '站室', width: 50 },
        { field: 'UserName', title: '检查人', width: 30 },
        {
            field: 'PlanDate', title: '执行日期', width: 50, sortable: true, formatter: function (val) {
                if (val != "")
                    return new Date(val).Format("yyyy-MM-dd");
                else
                    return "";
            }
        },
        {
            field: 'CheckDate', title: '完成日期', width: 50, formatter: function (val) {
                if (val != "")
                    return new Date(val).Format("yyyy-MM-dd hh:mm");
                else
                    return "";
            }
        },
        {
            field: 'Priority', title: '优先级', width: 30, formatter: function (val) {
                if (val == 1)
                    return "一般";
                else if (val == 2)
                    return "高";
                else if (val == 3)
                    return "很高";
            }
        },
        {
            field: 'OrderState', title: '状态', width: 30, sortable: true, formatter: function (val) {
                if (val == -1)
                    return "<b style='color:red;'>已拒绝进场</b>";
                else if (val == 0)
                    return "<b style='color:red;'>未接到工单</b>";
                else if (val == 1)
                    return "已接收到工单";
                else if (val == 2)
                    return "<b style='color:red;'>申请进场中</b>";
                else if (val == 3)
                    return "已批准进场";
                else if (val == 4)
                    return "已完成工单";
                else if (val == 5)
                    return "<b style='color:red;'>已拒绝</b>";
            }
        },
        {
            field: 'IsQualified', title: '是否完成', width: 40, formatter: function (val) {

                if (val == 0)
                    return "<b style='color:red;'>作业未完成</b>";
                else if (val == 1)
                    return "<b style='color:green;'>作业已完成</b>";
                else
                    return "";
            }
        },
        { field: 'CheckInfo', title: '检查情况', width: 100 },
        { field: 'Rectification', title: '整改措施', width: 100 }
    ]],
    onDblClickRow: function (rowIndex, rowData) {
        if (rowData) {
            $('#detailwin').window({
                modal: true,
                top: ($(window).height() - 600) * 0.5,
                left: ($(window).width() - 800) * 0.5,
                draggable: true, //可拖动，默认false  
                resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false    
                href: '/OrderInfo/OrderDetail?orderid=' + rowData.OrderID,
                onClose: function () {
                    //$('#list_data').datagrid('reload');
                    //$('#list_data').datagrid('uncheckAll');
                }
            });
            $('#detailwin').window('open');
        }
        else {
            $.messager.alert("提示", "请选择要查看的工单！", "info");
        }
    }
});
$('#uname').combobox({
    url: '/BaseInfo/BindUserInfo',
    valueField: 'UserID',
    textField: 'UserName'
});
var timer;
var timeTicket;
$("#PDRName").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=1", //added by zzz 2016年3月12日11:07:48
    valueField: 'PID',
    textField: 'Name',
    onLoadSuccess: function () { //数据加载完毕事件
        var data = $('#PDRName').combobox('getData');
        if (data.length > 0) {
            if (pid == 0)
                $("#PDRName").combobox('select', 0);
            else
                $("#PDRName").combobox('select', pid);
            getJson()
            clearInterval(timeTicket);
            timeTicket = setInterval(function () {
                getJson()
            }, 5000);
        }
    },
    onSelect: function (data) {
        $.cookie('cookiepid', data.PID, { expires: 7, path: '/' });
    }
});
var orderListJson = "";
function getJson() {
    var ocontent = $("#ocontent").val();
    var uname = $("#uname").combobox("getText");
    var pid = $('#PDRName').combobox('getValue');
    var otype = $("#otype").combobox('getValue');
    $.post('/OrderInfo/orderListJson', { "pid": pid }, function (data) {
        if (data != orderListJson) {
            dosearch();
            orderListJson = data;
        }
    });
}

function dosearch() {
    var ocontent = $("#ocontent").val();
    var uname = $("#uname").combobox("getText");
    var pid = $('#PDRName').combobox('getValue');
    var otype = $("#otype").combobox('getValue');
    $('#list_data').datagrid({
        url: '/OrderInfo/OrderInfoList?rom=' + Math.random(),
        queryParams: { "ocontent": ocontent, "uname": uname, "otype": otype, "pid": pid }
    });
}
function add() {
    OpenFrame(0);
}
function edit() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].OrderID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').treegrid('getSelected');
        if (row) {
            OpenFrame(row.OrderID);
        }
        else {
            $.messager.alert("提示", "请选择要编辑的工单！", "info");
        }
    } s
}
function OpenFrame(id) {
    $('#editwin').window({
        modal: true,
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        draggable: true, //可拖动，默认false  
        resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false    
        href: '/OrderInfo/OrderEdit?orderid=' + id,
        onClose: function () {
            $('#list_data').datagrid('reload');
            $('#list_data').datagrid('uncheckAll');
        }
    });
    $('#editwin').window('open');
}

function detail() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].OrderID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "查看详细时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            $('#detailwin').window({
                modal: true,
                top: ($(window).height() - 600) * 0.5,
                left: ($(window).width() - 800) * 0.5,
                draggable: true, //可拖动，默认false  
                resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false    
                href: '/OrderInfo/OrderDetail?orderid=' + row.OrderID,
                onClose: function () {
                    $('#list_data').datagrid('reload');
                    $('#list_data').datagrid('uncheckAll');
                }
            });
            $('#detailwin').window('open');
        }
        else {
            $.messager.alert("提示", "请选择要查看的工单！", "info");
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
                    ids.push(rows[i].OrderID);
                }
                $.post("/OrderInfo/DeleteOrderInfo?Rnum=" + Math.random(), { "orderid": ids.join(',') }, function (data) {
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
function clearForm() {
    $(':input', editwin).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || tag == 'hidden') {
            this.value = "";
        }
    });
    $(".easyui-datebox").datebox('setValue', "");
    $('.easyui-combobox').combobox('setValue', "");
}