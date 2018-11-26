$("#currPosition", window.top.document).html("当前位置：运维 > 台账 > 站室档案 ");

$(function () {
    //查询站室名称
    $('#StationName').combotree({
        url: '/Home/ComboTreeMenu',
        multiple: false,
        onBeforeSelect: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationName').combotree('tree').tree("expand", node.target); //展开
                return false;
            }
        },
        onClick: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationName').combo('showPanel');
            }
            else {
                //返回树对象                
                if (node.id != 0) {
                    $("#SPID").val(node.id);
                    $.cookie('cookiepid', node.id, { expires: 7, path: '/' });
                }
            }
        }
    });
    var gpid = $.cookie('cookiepid');
    if (gpid != undefined || gpid != 6) {
        $("#StationName").combotree("setValue", gpid);
    }
    dosearch();
    upload();
});
//新增站室名称
function loadPDR() {
    $('#StationID').combotree({
        url: '/Home/ComboTreeMenu',
        multiple: false,
        onBeforeSelect: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationID').combotree('tree').tree("expand", node.target); //展开
                return false;
            }
        },
        onClick: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationID').combo('showPanel');
            }
            else {
                //返回树对象                
                if (node.id != 0) {
                    $("#PID").val(node.id);
                    upload5('file');
                }
            }
        },
        //加载
        onLoadSuccess: function (node) {
            var roots = $('#StationID').combotree('tree').tree('getRoots');
            $("#PID").val(roots[0].children[0].children[0].id);
            $('#StationID').combotree('setText', roots[0].children[0].children[0].text);
        }
    });
}

//日期转换
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy-MM-dd hh:mm:ss');
    return lDate
}
//显示文件类型图标
function loadImage(value, row, index) {
    var imgsrc = "drawingicon.png";
    var FileExtension = row.FileExtension;
    if (FileExtension == ".doc" || FileExtension == ".docx")
        imgsrc = "excelicon.png";
    else if (FileExtension == ".xls" || FileExtension == ".xlsx")
        imgsrc = "excelicon.png";
    else if (FileExtension == ".zip" || FileExtension == ".rar)")
        imgsrc = "raricon.png";
    else if (FileExtension == ".pdf")
        imgsrc = "pdficon.png";
    else if (FileExtension == ".mp4" || FileExtension == ".3gp" || FileExtension == ".rmvb)" || FileExtension == ".wav")
        imgsrc = "videoicon.png";

    return '<a href="' + row.FilePath.replace(/~/, "../..") + '" target="_blank"><img src="../content/images/' + imgsrc + '"  width="35px" height="35px"/></a>';
}

function upload() {
    clearForm();
    loadPDR();
    upload5('file');
    $("#editwin").dialog({
        closed: false,
        top: ($(window).height() - 450) * 0.5,
        left: ($(window).width() - 700) * 0.5,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
    });
}
function download() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].Fk_ID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "下载时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            window.open(row.FilePath.replace(/~/, "../.."));
        }
        else {
            $.messager.alert("提示", "请选择要下载的行！", "info");
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
                    ids.push(rows[i].ID);
                }
                $.post("/PerationMaintenance/DeleteFilePDRInfo?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
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
    $('#list_data').datagrid('load', { "PID": $.cookie('cookiepid') });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({
    url: '/PerationMaintenance/FileListData?rom=' + Math.random(),
    pagination: true
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

//    $(function () {
//        var explorer = navigator.userAgent;
//        if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") != "MSIE6.0" && navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") != "MSIE7.0" && navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") != "MSIE8.0" && navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") != "MSIE9.0") {
//            upload5('file');
//        }
//        else if ((explorer.toLowerCase().indexOf("trident") > -1 && explorer.indexOf("rv") > -1)) {
//            upload5('file');
//        }
//        else if (explorer.indexOf("Firefox") >= 0) {
//            upload5('file');
//        }
//        else {
//            uploadImg('file');
//        }
//    });

function uploadImg(cname) {
    //添加界面的附件管理  
    var fileType = '*.pdf;*.txt;*.doc;*.docx;*.xls;*.xlsx;*.zip;*.rar;*.mp4;*.wav;*.rmvb;';
    $('#' + cname + "_upload").uploadify({
        'swf': '/Content/uplaodfy/uploadify.swf',  //FLash文件路径
        'buttonText': '浏  览',                    //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploader': '/PerationMaintenance/Upload',          //处理文件上传Action
        'queueID': cname + 'Queue',                //队列的ID
        'queueSizeLimit': 10,                      //队列最多可上传文件数量，默认为999
        'auto': true,                              //选择文件后是否自动上传，默认为true
        'multi': true,                             //是否为多选，默认为true
        'removeCompleted': false,                  //是否完成后移除序列，默认为true
        'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileTypeDesc': 'Files',             //文件描述
        'fileTypeExts': fileType,  //上传的文件后缀过滤器                
        'onUploadStart': function (file) {
            $("#" + cname + "_upload").uploadify("settings", 'formData', { 'folder': 'file', 'ctype': cname, "pid": $("#PID").val() }); //动态传参数
        },
        'onUploadSuccess': function (file, fname, response) {
            $.messager.alert("提示", "上传成功！", "info");
            window.location.reload();
        }
    });
}
function upload5(cname) {
    //添加界面的附件管理   
    if ($("#PID").val() == "") {
        var roots = $('#StationID').combotree('tree').tree('getRoots');
        $("#PID").val(roots[0].children[0].children[0].id);
    }
    var fileType = '*.pdf;*.txt;*.doc;*.docx;*.xls;*.xlsx;*.zip;*.rar;*.mp4;*.wav;*.rmvb;';
    $('#' + cname + "_upload").uploadifive({
        'auto': false,
        'buttonText': '浏  览',                    //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/PerationMaintenance/Upload',          //处理文件上传Action
        'queueID': cname + 'Queue',                //队列的ID
        'queueSizeLimit': 1,                      //队列最多可上传文件数量，默认为999
        'auto': true,                              //选择文件后是否自动上传，默认为true
        'multi': true,                             //是否为多选，默认为true
        'removeCompleted': false,                  //是否完成后移除序列，默认为true
        'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': false,
        'formData': { 'folder': 'file', 'ctype': cname, "pid": $("#PID").val() },
        'onUploadComplete': function (file, data) {
            $.messager.alert("提示", "上传成功！", "info");
            window.location.reload();
        }
    });
}