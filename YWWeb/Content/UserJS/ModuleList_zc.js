$("#currPosition", window.top.document).html("当前位置：设置 > 模块");
function add() {
    OpenFrame(0);
}
function edit() {
    var row = $('#list_data').treegrid('getSelected');
    if (row) {
        OpenFrame(row.ModuleID);
    }
    else {
        $.messager.alert("提示", "请选择要编辑的模块！", "info");
    }
}
function Delete() {
    var row = $('#list_data').treegrid('getSelected');
    if (row) {
        $.messager.confirm('提示', '你确定要删除选中的模块？', function (r) {
            if (r) {
                $.post("/SysInfo/DeleteModule?rumn=" + Math.random(), { "ModuleID": row.ModuleID }, function (data) {
                    if (data == "OK")
                        location.reload();
                    else
                        alert(data);
                })
            }
        });
    }
    else {
        $.messager.alert("提示", "请选择要删除的模块！", "info");
    }
}
$('#list_data').treegrid({
    url: '/SysInfo/ModuleData?Rnum=' + Math.random()
});
function OpenFrame(moduleid) {
    $('#editwin').window({
        modal: true,
        draggable: true, //可拖动，默认false  
        resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false  
        href: '/SysInfo/ModuleEdit?moduleid=' + moduleid
    });
    $('#editwin').window('open');
}
function allotButton() {
    var row = $('#list_data').treegrid('getSelected');
    if (row) {
        allButton(row.ModuleID);
        selectButton(row.ModuleID);
        $("#Buttonlist").height(448);
        $(".div-overflow").height(408);
        $('#editButton').dialog({
            //title: title,
            closed: false,
            top: ($(window).height() - 400) * 0.5,
            left: ($(window).width() - 700) * 0.5,
            draggable: true, //可拖动，默认false  
            minimizable: false, //最小化，默认false  
            maximizable: false, //最大化，默认false  
            collapsible: false, //可折叠，默认false  
            resizable: false//可缩放，即可以通脱拖拉改变大小，默认false  
        });
    }
    else {
        $.messager.alert("提示", "请选择分配按钮的模块！", "info");
    }
}
function locdicon(value) {
    if (value != "")
        value = "<img width='16px' height='16px' src='/Content/Images/menu/" + value + "' />";
    return value;
}
function allButton(parentid) {
    $.post("/SysInfo/AllButtonList", "", function (data) {
        var obj = eval("(" + data + ")");
        $("#allButton").html(obj);
        $("#allButton div").dblclick(function () {
            var IsExist = true;
            var all = $(this).attr('title');
            $('#selectedButton div').each(function (i) {
                if ($(this).attr('title') == all) {
                    IsExist = false;
                    return false;
                }
            });
            if (IsExist == true) {
                $.post("/SysInfo/AddButton", { "ParentID": parentid, "ButtonID": $(this).attr('id') }, function (data) {
                    selectButton(parentid);
                });
            } else {
                $.messager.alert("提示", "【" + all + "】按钮已经存在！", "info");
            }
        });
    });
}
function selectButton(parentid) {
    $.post("/SysInfo/SelButtonList", { "ModuleID": parentid }, function (data) {
        var obj = eval("(" + data + ")");
        $("#selectedButton").html(obj);
    });
}
//移除按钮
function removeButton(id, parentid) {
    $.messager.confirm('提示', '你确定要移除此功能？', function (r) {
        if (r) {
            $.post("/SysInfo/DeleteModule?rumn=" + Math.random(), { "ModuleID": id }, function (data) {
                if (data == "OK")
                    selectButton(parentid);
                else
                    alert(data);
            })
        }
    });
}
function selectedButton(e) {
    $('.shortcuticons').removeClass("selected");
    $(e).addClass("selected"); //添加选中样式
}
//datagrid宽度高度自动调整的函数
$.fn.extend({
    resizeDataGrid: function (pageHeight, pageWidth, heightMargin, widthMargin, minHeight, minWidth) {
        var height = pageHeight - heightMargin;
        var width = pageWidth - widthMargin;
        height = height < minHeight ? minHeight : height;
        width = width < minWidth ? minWidth : width;
        $(this).datagrid('resize', {
            height: height,
            width: width
        });
    }
});
var pageHeight, pageWidth;
if (typeof window.innerHeight != 'undefined') {
    //针对非IE8及其以下的浏览器
    pageHeight = window.innerHeight;
    pageWidth = window.innerWidth;
    var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
    if (!isChrome) {
        pageHeight = pageHeight - 10;
    }
}
$('#list_data').resizeDataGrid(pageHeight, pageWidth, 15, 20, 0, 0);
$(window).resize(function () {
    var pageHeight, pageWidth;
    if (typeof window.innerHeight != 'undefined') {
        //针对非IE8及其以下的浏览器
        pageHeight = window.innerHeight;
        pageWidth = window.innerWidth;
        var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
        if (!isChrome) {
            pageHeight = pageHeight - 10;
        }
    };
    $('#list_data').resizeDataGrid(pageHeight, pageWidth, 15, 20, 0, 0);
});