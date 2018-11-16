function loadSparePartName() {
    $('#SparePartName').combobox({
        url: '/BaseInfo/BindSparePart?row=' + Math.random(),
        valueField: 'SparePartID',
        multiple: true,
        textField: 'SparePartName',
        editable: false,
        onLoadSuccess: function (data) {
            if (did == "undefined" || did == undefined)
                $('#SparePartName').combobox('setText', data[0].SparePartName)
        }
    });
}
function loadDeviceInfo() {
    if (did > 0) {
        $.post("/DeviceManage/DeviceInfoDetail", { "did": did }, function (data) {
            var row = eval("(" + data + ")");
            var did = row.DID;
            $("#DID").val(did);
            $("#EadoCode").html(row.EadoCode);
            $("#DeviceCode").val(row.DeviceCode);
            $("#DeviceName").val(row.DeviceName);
            $("#DeviceModel").val(row.DeviceModel);
            //在加载时会不能打开页面
            $("#SparePartName").combobox('setText', row.E);
            $("#DTID").combobox('setValue', row.DTID);
            $("#DSTID").combobox('setValue', row.DSTID);
            $("#MLID").combobox('setValue', row.MLID);
            $("#PID").combobox('setValue', row.PID);
            getMDate(row.BuyTime, 'BuyTime');
            getMDate(row.UseDate, 'UseDate');
            getMDate(row.LastMtcDate, 'LastMtcDate');
            getMDate(row.BuildDate, 'BuildDate');
            $("#MFactory").val(row.MFactory);
            $("#FactoryNumber").val(row.FactoryNumber);
            $("#InstallAddr").val(row.InstallAddr);
            $("#UseState").val(row.UseState);
            $("#Company").val(row.Company);
            $("#OrderBy").val(row.OrderBy)
            loadDevice(row.PID, row.B, row.C);
            $("#DeviceCapTotal").val(row.Z);
            if (row.Remarks != null)
                $("#Remarks").val(row.Remarks.replace(/<br\s*\>/g, "\n"));
            else
                $("#Remarks").val(row.Remarks);

        });
    }
}

$(function () {
    $("#MainID").val("");
    loadDeviceType();
    loadDeviceStructureType();
    loadMajorLevel();
    loadPDRInfo();
    uploadImg('image');
    uploadImg('file');
    uploadImg('video');
    loadDeviceInfo();
    loadSparePartName();
});
function loadDeviceType() {
    $('#DTID').combobox({
        url: '/BaseInfo/BindDeviceType',
        valueField: 'DTID',
        textField: 'Name',
        editable: false,
        onLoadSuccess: function (data) {
            if (did == "undefined" || did == undefined)
                $('#DTID').combobox('setValue', data[0].DTID)
        }
    });
}
function loadDeviceStructureType() {
    $('#DSTID').combobox({
        url: '/BaseInfo/BindDeviceStructureType',
        valueField: 'DSTID',
        textField: 'Name',
        editable: false,
        onLoadSuccess: function (data) {
            if (did == "undefined" || did == undefined)
                $('#DSTID').combobox('setValue', data[0].DSTID)
        }
    });
}
function loadMajorLevel() {
    $('#MLID').combobox({
        url: '/BaseInfo/BindMajorLevel',
        valueField: 'MLID',
        textField: 'Name',
        editable: false,
        onLoadSuccess: function (data) {
            if (did == "undefined" || did == undefined)
                $('#MLID').combobox('setValue', data[0].MLID)
        }
    });
}
function loadPDRInfo() {
    $("#PID").combobox({
        url: "/BaseInfo/BindPDRInfo",
        valueField: 'PID',
        textField: 'Name',
        editable: false,
        onLoadSuccess: function (data) {
            if (did == "undefined" || did == undefined) {
                if (pid == 0) {
                    $('#PID').combobox('setValue', data[0].PID);
                } else {
                    $('#PID').combobox('setValue', pid)
                }
                loadDevice(data[0].PID, "", "");
            }
            
        }
    });
}
function loadDevice(pid, b, c) {
    $.post("/BaseInfo/BindDeviceInfo", { "ShowAll": 0, "pid": pid }, function (data) {
        $("#DeviceIn").combobox({
            valueField: 'DID',
            textField: 'DeviceName',
            data: data
        });
        $("#DeviceOut").combobox({
            valueField: 'DID',
            textField: 'DeviceName',
            data: data
        });
        $("#DeviceIn").combobox('setValue', b);
        $("#DeviceOut").combobox('setValue', c);
    });
    return true;
}
function uploadImg(cname) {
    //添加界面的附件管理
    var fileType = '';
    if (cname == 'image') {
        fileType = '*.gif; *.jpg; *.png; *.bmp;';
    }
    else if (cname == 'file') {
        fileType = '*.tif;*.txt;*.doc;*.docx;*.xls;*.zip';
    }
    else if (cname == 'video') {
        fileType = '*.mp4;*.flv;*.rmvb;*.ogg;';
    }
    $('#' + cname + "_upload").uploadify({
        'swf': '/Content/uplaodfy/uploadify.swf',  //FLash文件路径
        'buttonText': '浏  览',                    //按钮文本
        'uploader': '/FileUpload/Upload',          //处理文件上传Action
        'queueID': cname + 'Queue',                //队列的ID
        'queueSizeLimit': 10,                      //队列最多可上传文件数量，默认为999
        'auto': true,                              //选择文件后是否自动上传，默认为true
        'multi': true,                             //是否为多选，默认为true
        'removeCompleted': false,                  //是否完成后移除序列，默认为true
        'fileSizeLimit': '10MB',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileTypeDesc': 'Image Files',             //文件描述
        'fileTypeExts': fileType,  //上传的文件后缀过滤器                
        'onUploadStart': function (file) {
            $("#" + cname + "_upload").uploadify("settings", 'formData', { 'folder': 'Image', 'ctype': cname, "uid": uid }); //动态传参数
        },
        'onUploadSuccess': function (file, fname, response) {
            var cancel = $('#' + cname + 'Queue .uploadify-queue-item[id="' + file.id + '"]').find(".cancel a");
            if (cancel) {
                cancel.click(function () {
                    DeleteFile(fname, cname);
                });
            }
        }
    });
}
function setDateVale(dkey, dvalue) {
    var LastMtcDate = dvalue;
    if (LastMtcDate != null)
        LastMtcDate = new Date(LastMtcDate).Format("yyyy-MM-dd");
    $("#" + dkey).html(LastMtcDate);
}
function save() {
    if ($("#DeviceCode").val() == "" || $("#DeviceName").val() == "" || $("#DeviceModel").val() == "" || $("#MFactory").val() == "" || $("#MFactory").val() == "" || $("#FactoryNumber").val() == "" || $("#InstallAddr").val() == "" || $("#Company").val() == "") {
        $.messager.alert("提示", "请填写必填项目！", "info");
        return false;
    }
    else if ($("#DTID").combobox('getValue') == 3) {
        if ($("#DeviceIn").combobox('getValue') == "") { $.messager.alert("提示", "请选择进线柜！", "info"); return false; }
        else if ($("#DeviceOut").combobox('getValue') == "") { $.messager.alert("提示", "请选择出线柜！", "info"); return false; }
    }
    var postData = {
        DID: $("#DID").val(),
        DeviceCode: $("#DeviceCode").val(),
        DeviceName: $("#DeviceName").val(),
        DeviceModel: $("#DeviceModel").val(),
        DTID: $("#DTID").combobox('getValue'),
        DSTID: $("#DSTID").combobox('getValue'),
        MLID: $("#MLID").combobox('getValue'),
        PID: $("#PID").combobox('getValue'),
        PName: $("#PID").combobox('getText'),
        MFactory: $("#MFactory").val(),
        FactoryNumber: $("#FactoryNumber").val(),
        InstallAddr: $("#InstallAddr").val(),
        UseState: $("#UseState").val(),
        Company: $("#Company").val(),
        BuyTime: $('#BuyTime').datebox('getValue'),
        UseDate: $('#UseDate').datebox('getValue'),
        LastMtcDate: $('#LastMtcDate').datebox('getValue'),
        BuildDate: $('#BuildDate').datebox('getValue'),
        B: $("#DeviceIn").combobox('getValue'),
        C: $("#DeviceOut").combobox('getValue'),
        E: $("#SparePartName").combobox('getText'),
        Z: $("#DeviceCapTotal").val(),
        OrderBy:$("#OrderBy").val(),
        Remarks: $("#Remarks").val()
    };
    $.post("/DeviceManage/SaveDeviceInfo", postData, function (data) {
        if (data == "ok") {
            $.messager.alert("提示", "设备信息编辑成功！", "info");
            $("#DID").val("");
            $("#list_data").datagrid("reload");
            $("#editwin").dialog("close");
            $('#list_data').datagrid('uncheckAll');
        }
        else
            alert(data);
    });
}
function loadDeviceImage(did, ctype) {
    $.post("/DeviceManage/LoadDeviceFile", { "DID": did, "type": ctype }, function (data) {
        var obj = eval("(" + data + ")");
        $("#" + ctype + "Queue").html(obj);
    });
}
function DeleteFile(fname, cname) {
    $.post("/FileUpload/DeleteFile?Rnum=" + Math.random(), { "filename": fname, "ctype": cname }, function (data) {
    });
}