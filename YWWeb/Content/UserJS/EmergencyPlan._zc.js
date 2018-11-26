$("#currPosition", window.top.document).html("当前位置：应急抢修 > 应急预案 ");
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
        imgsrc = "wordicon.png";
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
//上传
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
//下载
function download() {
    var rows = $('#list_data').datagrid('getSelections');
    if (rows.length < 1) {
        $.messager.alert("提示", "请选择要下载的行！", "info");
    }
    else if (rows.length == 1) {
        var filePath = rows[0].FilePath;

        $.post("/EmergencyRepair/IsExistFilePath?filePathName=" + filePath, function (data) {
            if (data == "success") {
                window.open(rows[0].FilePath.replace(/~/, "../.."));
            }
            else {
                $.messager.alert("提示", "所下载资源不存在！", "info");
            }
        });
    }
    else {
        $.messager.alert("提示", "请选择单行下载！", "info");
    }
}

//查询
function dosearch() {
    var pid = $("#StationName").combobox('getValue');
    OnSearch(pid);
}
$('#list_data').datagrid({
    url: '/EmergencyRepair/FileListData?rom=' + Math.random(),
    pagination: true
});
//查询处理函数
function OnSearch(pid) {
    $('#list_data').datagrid('load', { "pid": pid, "epid": 0 });
    $('#list_data').datagrid('uncheckAll');
}

//删除
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
                    ids.push(rows[i].Fk_ID);
                }
                $.post("/EmergencyRepair/DeleteFileListInfo?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
                    if (data == "success") {
                        window.location.reload();
                        dosearch();
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

function upload5(cname) {
    //添加界面的附件管理   
    if ($("#PID").val() == "") {
        var roots = $('#StationID').combotree('tree').tree('getRoots');
        $("#PID").val(roots[0].children[0].children[0].id);
    }
    var fileType = '*.doc;*.docx;';
    $('#' + cname + "_upload").uploadifive({
        'auto': false,
        'buttonText': '浏  览',                    //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/EmergencyRepair/Upload',          //处理文件上传Action
        'queueID': cname + 'Queue',                //队列的ID
        'queueSizeLimit': 1,                      //队列最多可上传文件数量，默认为999
        'auto': true,                              //选择文件后是否自动上传，默认为true
        'multi': true,                             //是否为多选，默认为true
        'removeCompleted': false,                  //是否完成后移除序列，默认为true
        'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': false,
        'formData': { 'folder': 'file', 'uid': uid, 'ctype': cname, "pid": $("#PID").val() },
        'onUploadComplete': function (file, data) {
            $.messager.alert("提示", "上传成功！", "info");
            window.location.reload();
        }
    });
}

/*   
//        function uploadImg(cname) {
//         //添加界面的附件管理  
//         var fileType = '*.doc;*.docx;';
//         $('#' + cname + "_upload").uploadify({
//             'swf': '/Content/uplaodfy/uploadify.swf',  //FLash文件路径
//             'buttonText': '浏  览',                    //按钮文本
//             'buttonClass': 'uploadifive-button',
//             'uploader': '/EmergencyRepair/Upload',          //处理文件上传Action
//             'queueID': cname + 'Queue',                //队列的ID
//             'queueSizeLimit': 1,                      //队列最多可上传文件数量，默认为999
//             'auto': true,                              //选择文件后是否自动上传，默认为true
//             'multi': true,                             //是否为多选，默认为true
//             'removeCompleted': false,                  //是否完成后移除序列，默认为true
//             'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
//             'fileTypeDesc': 'Image Files',             //文件描述
//             'fileTypeExts': fileType,  //上传的文件后缀过滤器                
//             'onUploadStart': function (file) {
//                 var pid = $("#PID").val();
//                 //                if (pid == "") {
//                 //                    $.messager.alert("提示", "请选择站室名称！", "info");
//                 //                    return false;
//                 //                }
//                 //                else
//                 $("#" + cname + "_upload").uploadify("settings", 'formData', { 'folder': 'Image', 'uid': uid, 'ctype': "file", "pid": pid }); //动态传参数
//             },
//             'onUploadSuccess': function (file, fname, response) {
//                 $.messager.alert("提示", "上传成功！", "info");      
//                  window.location.reload();  
//             }
//         });
//     }
//    //上传资料时，选择站室名称
//    $('#StationID').combotree({
//        url: '/Home/ComboTreeMenu',
//        multiple: false,
//        onBeforeSelect: function (node) {
//            if (!$(this).tree('isLeaf', node.target)) {
//                $('#StationID').combotree('tree').tree("expand", node.target); //展开
//                return false;
//            }
//        },
//        onClick: function (node) {
//            if (!$(this).tree('isLeaf', node.target)) {
//                $('#StationID').combo('showPanel');
//            }
//            else {
//                //返回树对象                
//                if (node.id != 0) {
//                    $("#PID").val(node.id);
//                    $("#PName").val(node.text);
//                   loadDeviceList(node.id);
//                }
//            }
//        }
//    });
//    
//    //刷新应急预案名称列表
//    function EmergencyPlanNameList(pid) {
//        // alert(pid),
//        $("#EmergencyPlanName").combobox({
//            url: "/EmergencyRepair/EmergencyPlanInfo?showall=1&pid=" + pid,
//            valueField: 'EPID',
//            textField: 'Name',
//            editable: false,
//            //初始化
//            onLoadSuccess: function () { //数据加载完毕事件  
//                var data = $('#EmergencyPlanName').combobox('getData');
//                if (data.length > 0) {
//                    $("#EmergencyPlanName").combobox('select', data[0].EPID);
//                }
//            },
//            //选择事件
//            onSelect: function () {
//                dosearch(); 
//            }
//        });
//    }
//    //上传
//    function upload() {
//        clearForm();
//        $("#editwin").dialog({
//            closed: false,
//            top: ($(window).height() - 450) * 0.5,
//            left: ($(window).width() - 700) * 0.5,
//            minimizable: false, //最小化，默认false  
//            maximizable: false, //最大化，默认false  
//            collapsible: false, //可折叠，默认false  
//            resizable: true//可缩放，即可以通脱拖拉改变大小，默认false 
//        });
//    }
//     //上传
//     function upload() {
//        clearForm();
//        upload5('file');
//        $("#editwin").dialog({
//            closed: false,
//            top: ($(window).height() - 450) * 0.5,
//            left: ($(window).width() - 700) * 0.5,
//            minimizable: false, //最小化，默认false  
//            maximizable: false, //最大化，默认false  
//            collapsible: false, //可折叠，默认false  
//            resizable: true//可缩放，即可以通脱拖拉改变大小，默认false 
//        });
//    }
//    //下载
//    function download() {
//        var rows = $('#list_data').datagrid('getSelections');
//        if (rows.length < 1) {
//            $.messager.alert("提示", "请选择要下载的行！", "info");
//        }
//        else {
//            window.open(rows[0].FilePath.replace(/~/, "../.."));
//        }
//    }
//    //查询
//    function dosearch() {
//        var pid = $("#StationName").combobox('getValue');
//        // alert(pid);
//        //var epid = $("#EmergencyPlanName").combobox('getValue');
//        //$('#list_data').datagrid('load', { "pid": pid, "epid": 0 });
//        //$('#list_data').datagrid('uncheckAll');
//         OnSearch(pid);
//    }
//    $('#list_data').datagrid({
//        url: '/EmergencyRepair/FileListData?rom=' + Math.random(),
//        pagination: true
//    });
//    //查询处理函数
//    function OnSearch(pid)
//    {
//         $('#list_data').datagrid('load', { "pid": pid, "epid": 0 });
//         $('#list_data').datagrid('uncheckAll'); 
//    }
//    //删除
//    function Delete() {
//        var rows = $('#list_data').datagrid('getSelections');
//        if (rows.length < 1) {
//            $.messager.alert("提示", "请选择要删除的行！", "info");
//        }
//        else {
//            $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
//                if (r) {
//                    var ids = [];
//                    for (var i = 0; i < rows.length; i++) {
//                        ids.push(rows[i].Fk_ID);
//                    }
//                    $.post("/EmergencyRepair/DeleteFileListInfo?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
//                        if (data == "success") {
//                        //   window.location.reload();
//                        dosearch();
//                        }
//                        else {
//                            $.messager.alert("提示", data, "info");
//                        }
//                    });
//                }
//            })
//        }
//    }
//     //日期转换
//     function DateFormat(value, row, index) {
//         var lDate = formatDate(value, 'yyyy-MM-dd hh:mm:ss');
//         return lDate
//     }
//     //查看详情
//     function loadDetail(value, row, index) {
//         return "<a href='" + row.FilePath.replace(/~/, "../..") + "'  target='_blank'><button class='page_table_but3 radius5'><img src='../content/images/download.png' />下载</button></a><button class='page_table_but3 radius5' onclick='DoDelete(" + row.ID + ");'><img src='../content/images/delete_new.png' />删除</button>"
//     }
//     //显示文件类型图标
//     function loadImage(FileExtension) {
//         if (FileExtension == ".doc" || FileExtension == ".docx")
//             return '<img src="../content/images/wordicon.png"  width="35px" height="35px"/>';
//         else if (FileExtension == ".xls" || FileExtension == ".xlsx")
//             return '<img src="../content/images/excelicon.png"  width="35px" height="35px"/>';
//         else if (FileExtension == ".zip" || FileExtension == ".rar)")
//             return '<img src="../content/images/raricon.png"  width="35px" height="35px"/>';
//         else if (FileExtension == ".pdf")
//             return '<img src="../content/images/pdficon.png"  width="35px" height="35px"/>';
//         else if (FileExtension == ".mp4" || FileExtension == ".rmvb)" || FileExtension == ".wav")
//             return '<img src="../content/images/videoicon.png"  width="35px" height="35px"/>';
//         else
//             return '<img src="../content/images/drawingicon.png"  width="35px" height="35px"/>';
//     }
//     function clearForm() {
//         $(':input', editwin).each(function () {
//             var type = this.type;
//             var tag = this.tagName.toLowerCase();
//             if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
//                 this.value = "";
//             }
//         });
//     }
//     $(function () {
//        // uploadImg('image');
//         upload5('file');
//     });
//     function uploadImg(cname) {
//         //添加界面的附件管理  
//         var fileType = '*.doc;*.docx;';
//         $('#' + cname + "_upload").uploadify({
//             'swf': '/Content/uplaodfy/uploadify.swf',  //FLash文件路径
//             'buttonText': '浏  览',                    //按钮文本
//             'buttonClass': 'uploadifive-button',
//             'uploader': '/EmergencyRepair/Upload',          //处理文件上传Action
//             'queueID': cname + 'Queue',                //队列的ID
//             'queueSizeLimit': 1,                      //队列最多可上传文件数量，默认为999
//             'auto': true,                              //选择文件后是否自动上传，默认为true
//             'multi': true,                             //是否为多选，默认为true
//             'removeCompleted': false,                  //是否完成后移除序列，默认为true
//             'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
//             'fileTypeDesc': 'Image Files',             //文件描述
//             'fileTypeExts': fileType,  //上传的文件后缀过滤器                
//             'onUploadStart': function (file) {
//                 var pid = $("#PID").val();
//                 //                if (pid == "") {
//                 //                    $.messager.alert("提示", "请选择站室名称！", "info");
//                 //                    return false;
//                 //                }
//                 //                else
//                 $("#" + cname + "_upload").uploadify("settings", 'formData', { 'folder': 'Image', 'uid': uid, 'ctype': "file", "pid": pid }); //动态传参数
//             },
//             'onUploadSuccess': function (file, fname, response) {
//                 $.messager.alert("提示", "上传成功！", "info");      
//                  window.location.reload();  
//             }
//         });
//     }

//      function upload5(cname) {
//        //添加界面的附件管理   
//        if ($("#PID").val() == "") {
//            var roots = $('#StationID').combotree('tree').tree('getRoots');
//            $("#PID").val(roots[0].children[0].children[0].id);
//        }
//        var fileType = '*.doc;*.docx;';
//        $('#' + cname + "_upload").uploadifive({
//            'auto': false,
//            'buttonText': '浏  览',                    //按钮文本
//            'buttonClass': 'uploadifive-button',
//            'uploadScript': '/PerationMaintenance/Upload',          //处理文件上传Action
//            'queueID': cname + 'Queue',                //队列的ID
//            'queueSizeLimit': 1,                      //队列最多可上传文件数量，默认为999
//            'auto': true,                              //选择文件后是否自动上传，默认为true
//            'multi': true,                             //是否为多选，默认为true
//            'removeCompleted': false,                  //是否完成后移除序列，默认为true
//            'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
//            'fileType': false,
//            'formData': { 'folder': 'file', 'ctype': cname, "pid": $("#PID").val() },
//            'onUploadComplete': function (file, data) {
//                $.messager.alert("提示", "上传成功！", "info");
//                window.location.reload();
//            }
//        });
//    }
//    //删除
//     function DoDelete(epid)
//      {
//       $.messager.confirm('提示', '你确定要删除选中的项？', function (r) 
//       {
//           if (r) 
//           {
//               //alert("确定删除！");
//               $.post("/EmergencyRepair/OnDelete", { "epid": epid }, function (data) 
//               {
//                   if (data == "success")
//                   {
//                              dosearch();
//                   }
//                   else
//                   {
//                             $.messager.alert("提示", data, "info");
//                   }
//               })               
//          }  
//          else {
//             //alert("取消删除！");
//             dosearch();
//          }  
//       })
// }
 //查询
 //    function dosearch() {
 //             var pid = $("#StationName").combobox('getValue');
 //             var epid = $("#EmergencyPlanName").combobox('getValue');
 //             $.post("/EmergencyRepair/OnSearch", { "epid": epid, "pid":pid }, function (data) {
 //             $("#content").html(data);
 //              })
 //     }
//    //下载
//     function DoDownload(str) {
//        // alert("下载");
//        // alert(str);
//         window.location.href = str;      
//     }
//    //上传
//    function upload() {
//        var pid = $("#StationName").combobox('getValue');
//        var epid = $("#EmergencyPlanName").combobox('getValue');
//        var url = "/EmergencyRepair/UploadPage?pid=" + pid + "&epid=" + epid;
//        top.openDialog(url, 'UploadResources_Form', '上传资源', 400, 280, 50, 50); 
//   }
*/