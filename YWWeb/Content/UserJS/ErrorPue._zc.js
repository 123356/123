$("#currPosition", window.top.document).html("当前位置：设置 > 基本设置 > 点表管理 ");

var pid = 0,
    did = 0,
    tagname = '',
    docount = 0,
    mode = 0;
$("#Cover").change(function() {
    if (mode == 0) {
        $.messager.alert("提示", "<a class = 'RStar'>*</a>注意！覆盖导入会覆盖已经存在的测点信息。", "info");
        mode = 1;
    } else mode = 0;
});
$("#SPID").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=7",
    valueField: 'PID',
    textField: 'Name',
    editable: false,
    onLoadSuccess: function(data) { //数据加载完毕事件
        if (data.length > 0) {
            pid = data[0].PID;
        }
        $("#SPID").combobox('select', pid);
        //dosearch();
    }
});

var editIndex = undefined;

function endEditing() {
    if (editIndex == undefined) {
        return true
    }
    if ($('#list_data').datagrid('validateRow', editIndex)) {
        $('#list_data').datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    } else {
        return false;
    }
}

function onClickCell(index) {
    if (endEditing()) {
        $('#list_data').datagrid('selectRow', index);
        $('#list_data').datagrid('beginEdit', index);
        editIndex = index;
    } else {
        $('#list_data').datagrid('selectRow', editIndex);
    }
}

function dosearch() {
    pid = $("#SPID").combobox("getValue");
    $('#list_data').datagrid({
        url: "/SysInfo/GetPueAlarm",
        queryParams: {
            "pid": pid
        }
    });
}

function add() {
    if (endEditing()) {
        $('#list_data').datagrid('appendRow', {
            PID: pid,
            数据类型: 'MQ',
            TagID: -1,
            工程下限: '-999000',
            工程上限: '999000',
            报警上限1: '65',
            报警上限2: '75',
            报警上限3: '85',


        });
        editIndex = $('#list_data').datagrid('getRows').length - 1;
        $('#list_data').datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
    }
}

function edit() {
    if (endEditing()) {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            var index = $('#list_data').datagrid('getRowIndex', row);
            onClickCell(index);
        } else {
            $.messager.alert("提示", "请选择要编辑的行！", "info");
        }
    }
}

function copy() {
    if (endEditing()) {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            if (row.TagID == undefined) {
                return
            }
            $('#list_data').datagrid('appendRow', {
                单位编号: row.UID,
                站室编号: row.PID,
                类型编号: row.TypeId,
                类型名称: row.TypeName,
                高报1: row.LimitH1,
                高报2: row.LimitH2,
                高报3: row.LimitH3,
                低报1: row.LimitL1,
                低报2: row.LimitL2,
                低报3: row.LimitL3
            });
            editIndex = $('#list_data').datagrid('getRows').length - 1;
            $('#list_data').datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
        } else {
            $.messager.alert("提示", "请选择要复制的行！", "info");
        }
    }
}

function SaveForm() {
    if (endEditing()) {
        $('#list_data').datagrid('acceptChanges');
        var row = $('#list_data').datagrid('getSelected');
        console.log(row)
        if (row) {
            var postData = {
                单位编号: row.UID,
                站室编号: row.PID,
                类型编号: row.TypeId,
                类型名称: row.TypeName,
                高报1: row.LimitH1,
                高报2: row.LimitH2,
                高报3: row.LimitH3,
                低报1: row.LimitL1,
                低报2: row.LimitL2,
                低报3: row.LimitL3
            };
            $.post("/PointsInfo/SavePointsInfo", postData,
                function(data) {
                    if (data.indexOf("OKadd") >= 0) {
                        var arr = data.split(",");
                        var index = $('#list_data').datagrid('getRowIndex', row);
                        $('#list_data').datagrid('updateRow', {
                            index: index,
                            row: {
                                TagID: arr[1],
                                实时库索引: arr[2]
                            }
                        });
                    } else if (data == "OKedit") {} else {
                        $.messager.alert(data);
                        $('#list_data').datagrid('reload');
                    }
                });
        }
    } else {
        $.messager.alert("请输入必填项！");
    }
}

function restore() {
    if (editIndex == undefined) {
        return
    }
    $('#list_data').datagrid('acceptChanges');
    var row = $('#list_data').datagrid('getSelected');
    if (row.TagID == undefined) $('#list_data').datagrid('cancelEdit', editIndex).datagrid('deleteRow', editIndex);
    else $('#list_data').datagrid('cancelEdit', editIndex);
    editIndex = undefined;
    $('#list_data').datagrid('reload');
}




function export1() {
    pid = $("#SPID").combobox('getValue');
    var ajaxbg = top.$("#loading_background,#loading");
    ajaxbg.show();
    $.post("/PointsInfo/ExportPointsInfoData", {
            "pid": pid
        },
        function(data) {
            ajaxbg.hide();
            window.open('http://' + window.location.host + data);
        });
}

function inport() {
    upload5('file');
    $("#uploadwin").dialog({
        closed: false,
        top: ($(window).height() - 450) * 0.5,
        left: ($(window).width() - 700) * 0.5,
        minimizable: false,
        //最小化，默认false  
        maximizable: false,
        //最大化，默认false  
        collapsible: false,
        //可折叠，默认false  
        draggable: true,
        //可拖动，默认false  
        resizable: false,
        //可缩放，即可以通脱拖拉改变大小，默认false 
        onClose: function() {
            location.reload();
        }
    });
}

function upload5(cname) {
    //添加界面的附件管理   
    var fileType = '*.pdf;*.txt;*.doc;*.docx;*.xls;*.xlsx;*.zip;*.rar;*.mp4;*.wav;*.rmvb;';
    $('#' + cname + "_upload").uploadifive({
        'auto': false,
        'buttonText': '浏  览',
        //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/PerationMaintenance/Upload',
        //处理文件上传Action
        'queueID': cname + 'Queue',
        //队列的ID
        'queueSizeLimit': 1,
        //队列最多可上传文件数量，默认为999
        'auto': true,
        //选择文件后是否自动上传，默认为true
        'multi': true,
        //是否为多选，默认为true
        'removeCompleted': false,
        //是否完成后移除序列，默认为true
        'fileSizeLimit': '0',
        //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': '.xls,.xlsx',
        'formData': {
            'folder': 'file',
            'ctype': cname,
            "pid": $("#PID").val()
        },
        'onUploadComplete': function(file, data) {
            $('#kill').html(data);
        }
    });
}

function ImportFile() {
    var file = $('#kill').html();
    //判断控件中是否存在文件内容，如果不存在，弹出提示信息，阻止进一步操作
    if (file == "114514") {
        $.messager.alert("错误", "请选择文件！", "info");
        return;
    } else {
        //获取文件名称
        var fileName = file.split('.')[0];
        //获取文件类型名称
        var file_typename = file.split('.')[1];
        //这里限定上传文件文件类型必须为.xls，如果文件类型不符，提示错误信息
        if (file_typename == 'xls' || file_typename == 'xlsx') {
            var post;
            if (file_typename == 'xls') {
                post = {
                    "FilePath": "~/UploadFiles/PDR/" + file,
                    "ExcelVer": "xls"
                }
            } else {
                post = {
                    "FilePath": "~/UploadFiles/PDR/" + file,
                    "ExcelVer": "xlsx",
                    "Mode": mode
                }
            }
            $.post("/PointsInfo/PostExcelData?rumn=" + Math.random(), post,
                function(data) {
                    if (data == "OK") {
                        $('#ImportExcel').window('close');
                        $('#list_data').datagrid('reload');
                        $.messager.alert("提示", "导入完成！", "info",
                            function(r) {
                                location.reload();
                            });
                    } else {
                        $.messager.alert("提示", data);
                    }
                });
        } else $.messager.alert("提示", "目前仅支持导入.xls和.xlsx格式文件，请检查文件格式。");
    }
}

function Delete() {
    var rows = $('#list_data').datagrid('getSelected');
    if (rows.length < 1) {
        $.messager.alert("提示", "请选择要删除的行！", "info");
    } else {
        $.messager.confirm('提示', '你确定要删除选中的行？',
            function(r) {
                if (r) {
                    var ids = [];
                    if (undefined == rows.length) {
                        ids.push(rows.TagID);
                    } else {
                        for (var i = 0; i < rows.length; i++) {
                            ids.push(rows[i].TagID);
                        }
                    }
                    $.post("/PointsInfo/DeletePoints", {
                            "PID": rows.PID,
                            "tagIDS": ids.join(',')
                        },
                        function(data) {
                            if (data == "OK") {
                                $('#list_data').datagrid('reload');
                            } else {
                                $.messager.alert("提示", data, "info");
                            }
                        });
                }
            });
    }
}






$(document).ready(function () {
    $("#SPID").combobox({
        onChange: function () {
            dosearch();
        }
    })
});


