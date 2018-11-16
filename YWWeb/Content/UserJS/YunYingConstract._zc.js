$("#currPosition", window.top.document).html("当前位置：运维 > 项目管理 ");
$(function () {
})



function OpenFrame(id) {
    $('#editwin').window({
        title: "编辑合同信息",
        modal: true,
        top: ($(window).height() - 820) * 0.5,
        left: ($(window).width() - 1000) * 0.5,
        href: '/Constract/YunYingConstractEdit?id=' + id,
        onClose: function () { dosearch(); }
    });
    $('#editwin').window('open');
}
function OpenFrameView(id) {
    $('#editwin').window({
        modal: true,
        title: "查看合同信息",
        top: ($(window).height() - 820) * 0.5,
        left: ($(window).width() - 1000) * 0.5,
        href: '/Constract/YunYingConstractView?id=' + id,
        onClose: function () { dosearch(); }
    });
    $('#editwin').window('open');
}
function dosearch() {
    var name = $("#cname").val();
    $('#list_data').datagrid('load', { "CtrName": name });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({
    url: '/Constract/LoadConstractDatas?rom=' + Math.random(),
    pagination: true,
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
function LookDetail() {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length == 1) {
        OpenFrameView(rows[0].id);
    }
    else {
        $.messager.alert("提示", "请选择要查看的行！", "info");
    }
}
function delect() {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length >= 1) {
        $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
            if (r) {
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                $.post("/Constract/DeleteConstract?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
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



function addfujian() {
    clearForm();
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length > 1) {
        $.messager.alert("提示", "只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    } else {
        if (rows.length == 1) {
            var row = $('#list_data').datagrid('getSelected');
            $("#ConName").val(row.CtrName);
            $("#ConNoNo").val(row.ConNo);
            $("#id").val(row.id);
            GetConTemp(row.id);
            upload5('file');
            $("#editwin1").dialog({
                closed: false,
                top: ($(window).height() - 500) * 0.5,
                left: ($(window).width() - 700) * 0.5,
                minimizable: false, //最小化，默认false  
                maximizable: false, //最大化，默认false  
                collapsible: false, //可折叠，默认false  
                draggable: false, //可拖动，默认false  
                resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
            });
        }
        else {
            $.messager.alert("提示", "请选择合同！", "info");
        }
    }
}

function clearForm() {
    $(':input', editwin1).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
}

function setType(val, row, r) {
    if (val == "1") {
        return "工程总承包";
    } else if (val == "2") {
        return "电力设计";
    } else if (val == "3") {
        return "设备产品";
    } else if (val == "4") {
        return "运维实验";
    } else if(val=="5"){
        return "管理";
    } else if (val == "6") {
        return "系统开发"
    }else if (val == "7") {
        return "设计管理";
    }

}







function upload5(cname) {
    var fileType = '*.doc;*.docx;';
    $('#' + cname + "_upload").uploadifive({
        'auto': false,
        'buttonText': '浏  览',                    //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/Constract/Upload',          //处理文件上传Action
        'queueID': cname + 'Queue',                //队列的ID
        'queueSizeLimit': 1,                      //队列最多可上传文件数量，默认为999
        'auto': true,                              //选择文件后是否自动上传，默认为true
        'multi': true,                             //是否为多选，默认为true
        'removeCompleted': false,                  //是否完成后移除序列，默认为true
        'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': false,
        'formData': { 'folder': 'file', 'ctype': cname, "conid": $("#id").val(), "ConTempID": $("#ConTemp").combobox("getValue"), "tRemark": $("#TempRemark").val() },
        'onUploadComplete': function (file, data) {
            $.messager.alert("提示", "上传成功！", "info");
            window.location.reload();
        }
    });
}

function GetConTemp(id) {
    $("#ConTemp").combobox({
        url: "/Constract/GetTempByconid?id=" + id,
        valueField: 'ID',
        textField: 'Name',
        editable: true,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#ConTemp').combobox('getData');
            if (data.length > 0) {
                $("#ConTemp").combobox('select', data[0].ID);
            }
        }
    });
}

