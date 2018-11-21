$("#currPosition", window.top.document).html("当前位置：设置 > 基本设置 > 站室");
function loadPName(pid) {
    var pname = '';
    $.ajaxSettings.async = false;
    $.post("/PDRInfo/GetPName", { "pid": pid }, function (data) {
        if (data != '')
            pname = data;
    });
    return pname;
}
//获取区域名称
function loadAreaName(AreaID) {
    var AreaName = '';
    $.ajaxSettings.async = false;
    $.post("/BaseInfo/GetAreaName", { "AreaID": AreaID }, function (data) {
        if (data != '')
            AreaName = data;
    });
    return AreaName;
}
//获取站室分类名称
function loadTypeName(TypeID) {
    var TypeName = '';
    $.ajaxSettings.async = false;
    $.post("/BaseInfo/GetTypeName", { "TypeID": TypeID }, function (data) {
        if (data != '')
            TypeName = data;
    });
    return TypeName;
}
var nUploadPID = -1;
function uploadImage(cname) {
    var i = 1;
    
    $('#' + cname + "_upload").uploadifive({
        'auto': false,
        'removeCompleted': true,
        'buttonText': '浏  览',                    //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/PDRInfo/Upload2',          //处理文件上传Action
       'queueID': cname + 'Queue',                //队列的ID
        'multi': true,                             //是否为多选，默认为true
        'fileSizeLimit': 1024,                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': 'image/*',
        //'uploadLimit':3,
        'queueSizeLimit': 3,
        'simUploadLimit': 1,
        //int fk_id, string ctype = "file", string modules = "matter",/UploadFiles/PDR/pdr1_1.jpg)
        'formData': { "fk_id": 1,'i':-1,'pid':-1},
        'onUploadComplete': function (file, data) {
            //alert("i=" + i + "" + data)
            //$.messager.alert("提示", "上传成功！","info");
            i++;
            if (i > 3) i = 1;
            $('#file_upload').data('uploadifive').settings.formData = { "fk_id": 1, 'i': i, 'pid': nUploadPID };
        },
        'onUpload': function (file) {
            i = 1;
            $('#file_upload').data('uploadifive').settings.formData = { "fk_id": 1, 'i': i, 'pid': nUploadPID };
           
        },
        'onUploadFile': function (file) {
            //$('#file_upload').data('uploadifive').settings.formData = { "fk_id": 1, 'i': i, 'pid': nUploadPID };
        },
        'onQueueComplete': function () {
            //alert("上传成功!");
            $.messager.alert("提示", "图片上传成功！", "info");
        },
        onFallback: function () {
            alert("该浏览器无法使用!");
        },
        'onError': function (errorType) {
            if(errorType!='QUEUE_LIMIT_EXCEEDED')
                alert('图片上传失败。The error was: ' + errorType);
        },
         'onUploadStart' : function(file) {
        alert('Starting to upload ' + file.name);
    }
    });
}

//获取使用状态
function loadUseState(UseState) {
    var UseStateName = '';
    if (UseState == 0) {
        UseStateName = "正常使用";
    }
    else {
        UseStateName = "暂停使用";
    }
    return UseStateName;
}
//
function loadPDRList(selid) {
    $("#SPID").combobox({
        url: "/BaseInfo/BindPDRInfo?showall=6",
        valueField: 'PID',
        textField: 'Name',
        editable: false,
        onLoadSuccess: function () { //数据加载完毕事件
            if (selid > 0) {
                $("#SPID").combobox('select', selid);
            }
            else {
                var data = $('#SPID').combobox('getData');
                if (data.length > 0) {
                    $("#SPID").combobox('select', data[0].PID);
                }
            }
        }
    });
}
//公司名称
$("#CompanyName").combobox({
    url: "/BaseInfo/BindUnitName",
    valueField: 'UnitID',
    textField: 'UnitName',
    editable: false,
    onLoadSuccess: function () { //数据加载完毕事件
        var data = $('#CompanyName').combobox('getData');
        if (data.length > 0) {
            $("#CompanyName").combobox('select', data[0].UnitID);
        }
    }
});

//电价行业类型编码
$("#IndID").combobox({
    url: "/BaseInfo/BindElecIndustryName",
    valueField: 'IndID',
    textField: 'IndName',
    editable: false,
    onLoadSuccess: function () {
        var data = $('#IndID').combobox('getData');
        console.log(data[0].IndName);
        if (data.length > 0) {
            $("#IndID").combobox('select', data[0].IndID);
        }
    }
});

//获取电价行业类型编码
function loadElecIndustryName(IndID) {
    var IndName = '';
    $.ajaxSettings.async = false;
    $.post("/BaseInfo/GetElecIndustryName", { "IndID": IndID }, function (data) {
        if (data != '')
            IndName = data;
    });
    return IndName;
}



//电价电压等级编码
$("#VID").combobox({
    url: "/BaseInfo/BindElecVoltageName",
    valueField: 'VID',
    textField: 'VName',
    editable: false,
    onLoadSuccess: function () {
        var data = $('#VID').combobox('getData');
        console.log(data[0].VName);
        if (data.length > 0) {
            $("#VID").combobox('select', data[0].VID);
        }
    }
});

//获取电价电压等级编码
function loadElecVoltageName(VID) {
    var VName = '';
    $.ajaxSettings.async = false;
    $.post("/BaseInfo/GetElecVoltageName", { "VID": VID }, function (data) {
        if (data != '')
            VName = data;
    });
    return VName;
}

//电压等级编码
$("#VoltageID").combobox({
    url: "/BaseInfo/BindElecVoltagesName",
    valueField: 'VoltageID',
    textField: 'VoltageName',
    editable: false,
    onLoadSuccess: function () {
        var data = $('#VoltageID').combobox('getData');
        console.log(data[0].VoltageName);
        if (data.length > 0) {
            $("#VoltageID").combobox('select', data[0].VoltageID);
        }
    }
});

//获取电压等级编码
function loadElecVoltagesName(VoltageID) {
    var VoltageName = '';
    $.ajaxSettings.async = false;
    $.post("/BaseInfo/GetElecVoltagesName", { "VoltageID": VoltageID }, function (data) {
        if (data != '')
            VoltageName = data;
    });
    return VoltageName;
}


$(function () {
    loadSelectMont();
    uploadImage('file');
})

//加载月份
function loadSelectMont() {
    $('#CBPeriodBegin').combobox({
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
             }, {
                 value: '13',
                 text: '13'
             }, {
                 value: '14',
                 text: '14'
             }, {
                 value: '15',
                 text: '15'
             }, {
                 value: '16',
                 text: '16'
             }, {
                 value: '17',
                 text: '17'
             }, {
                 value: '18',
                 text: '18'
             }, {
                 value: '19',
                 text: '19'
             }, {
                 value: '20',
                 text: '20'
             }, {
                 value: '21',
                 text: '21'
             }, {
                 value: '22',
                 text: '22'
             }, {
                 value: '23',
                 text: '23'
             }, {
                 value: '24',
                 text: '24'
             }, {
                 value: '25',
                 text: '25'
             }, {
                 value: '26',
                 text: '26'
             }, {
                 value: '27',
                 text: '27'
             }, {
                 value: '28',
                 text: '28'
             }, {
                 value: '29',
                 text: '29'
             }, {
                 value: '30',
                 text: '30'
             }, {
                 value: '31',
                 text: '31'
             }
        ]
    });
}



//所属区域
$('#AreaID').combotree({
    url: '/BaseInfo/AreaComboTreeMenu',
    required: true,
    onSelect: function (node) {
        //返回树对象  
        var tree = $(this).tree;
        //选中的节点是否为叶子节点,如果不是叶子节点,清除选中  
        var isLeaf = tree('isLeaf', node.target);
        if (!isLeaf) {
            $('#AreaID').combotree('tree').tree("expand", node.target); //展开
            $('#AreaID').combotree('tree').tree("select", node.target); //选中
        }

    }
});
//站室分类
function loadPDRTypeList(selid) {
    $("#TypeID").combobox({
        url: "/BaseInfo/BindPDRTypeInfo?showall=6",
        valueField: 'TypeID',
        textField: 'TypeName',
        editable: false,
        onLoadSuccess: function () { //数据加载完毕事件
            if (selid > 0) {
                $("#TypeID").combobox('select', selid);
            }
            else {
                var data = $('#TypeID').combobox('getData');
                if (data.length > 0) {
                    $("#TypeID").combobox('select', data[0].TypeID);
                }
            }
        },
        onSelect: function (n) {
            if (n.TypeName == "水电厂") {
                $("#one").hide();
                $("#two").hide();
                $("#three").hide();
            } else {
                $("#one").show();
                $("#two").show();
                $("#three").show();
            }
            //console.log(n);
        }
    });
}

// 采用坐标
//$("#btn").click(function () {
//    if ($("#AppCoordination").val() != "") {
//        $("#Coordination").val($("#AppCoordination").val());
//    }
//});

function add() {
    clearForm();
    loadPDRTypeList(0);
    $("#CompanyName").combotree("setText", "");

    $("#editwin").dialog({
        closed: false,
        top: ($(window).height() - 400) * 0.5,
        left: ($(window).width() - 600) * 0.5,
        height: ($(window).height() - 0) * 0.7,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: true//可缩放，即可以通脱拖拉改变大小，默认false 
    });
    
}
function edit() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].PID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            console.log(row);
            $("#PID").val(row.PID);
            $("#EadoCode").html(row.EadoCode);
            $("#Name").val(row.Name);
            $("#CompanyName").combobox("setValue", row.UnitID);
            $("#LinkMan").val(row.LinkMan);
            $("#FamilyID").val(row.FamilyID);
            $("#Mobile").val(row.Mobile);
            $("#OperationMan").val(row.OperationMan);
            $("#OperationTel").val(row.OperationTel);
            $("#Position").val(row.Position);
            $("#UseState").val(row.UseState);
            if (row.Remarks != null)
                $("#Remarks").val(row.Remarks.replace(/<br\s*\>/g, "\n"));
            else
                $("#Remarks").val(row.Remarks);
            $("#Coordination").val(row.Coordination);
            loadPDRTypeList(row.TypeID);
            $("#AreaID").combotree("setValue", row.AreaID);
            $("#IndID").combobox("setValue", row.IndID);
            $("#VID").combobox("setValue", row.VID);
            $("#VoltageID").combobox("setValue", row.VoltageID);
            //$("#BigIndTypeID").combobox("setValue", row.BigIndTypeID);
            $("#CBPeriodBegin").combobox("setValue", row.CBPeriodBegin);
            var DD  = formatDate(row.ApplcationTime, 'yyyy-MM-dd');
            $("#ApplcationTime").datebox("setValue",DD);
            $("#editwin").dialog({
                closed: false,
                top: ($(window).height() - 400) * 0.5,
                left: ($(window).width() - 600) * 0.5,
                height: ($(window).height() - 0) * 0.7,
                minimizable: false, //最小化，默认false  
                maximizable: false, //最大化，默认false  
                collapsible: false, //可折叠，默认false  
                draggable: true, //可拖动，默认false  
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
    
    if ($("#Name").val() == "" || $("#CompanyName").combotree("getText") == "" || $("#VoltageID").combotree("getText") == "" || $("#LinkMan").val() == "" || $("#Mobile").val() == "" || $("#OperationMan").val() == "" || $("#OperationTel").val() == "" || $("#Position").val() == "" || $("#Coordination").val() == "" || $("#AreaID").combotree("getValue") == "0" || $("#TypeID").combobox("getValue") == "0" || $("#AreaID").combobox("getValue") == "0") {
        $.messager.alert("提示", "请填写必填项目！", "info");
        return false;
    }
    var postData = {
        Name: $("#Name").val(),
        CompanyName: $("#CompanyName").combotree("getText"),
        LinkMan: $("#LinkMan").val(),
        FamilyID: $("#FamilyID").val(),
        InstalledCapacity: $("#InstalledCapacity").val(),
        EleCalWay: $("#EleCalWay").val(),
        GovEleLevel: $("#GovEleLevel").val(),
        DeviationMode: $("#DeviationMode").val(),
        Mobile: $("#Mobile").val(),
        OperationMan: $("#OperationMan").val(),
        OperationTel: $("#OperationTel").val(),
        Position: $("#Position").val(),
        UseState: $("#UseState").val(),
        Remarks: $("#Remarks").val().replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        Coordination: $("#Coordination").val(),
        PID: $("#PID").val(),
        AreaID: $("#AreaID").combotree("getValue"),
        TypeID: $("#TypeID").combobox("getValue"),
        IndID: $("#IndID").combobox("getValue"),
        VID: $("#VID").combobox("getValue"),
        VoltageID: $("#VoltageID").combobox("getValue"),
        //BigIndTypeID: $("#BigIndTypeID").combobox("getValue"),
        CBPeriodBegin: $("#CBPeriodBegin").combobox("getValue"),
        UnitID: $("#CompanyName").combobox("getValue"),
        ApplcationTime: $("#ApplcationTime").datebox("getValue")
    };
    $.post("/PDRInfo/SavePDRInfo", postData, function (data_r) {
        var str1 = JSON.parse(data_r);
        nUploadPID = str1.PID;
        var data = str1.result;
        if (data == "OKadd") {
            $('#file_upload').uploadifive('upload');
            $("#PID").val("");
            $("#editwin").dialog("close");
            $.messager.alert("提示", "站室添加成功！", "info");
            //window.location.reload();
            $('#list_data').datagrid({
                url: '/PDRInfo/PDRListData?rom=' + Math.random()
            });
        }
        else if (data == "OKedit") {
            $('#file_upload').uploadifive('upload');
            $("#PID").val("");
            $("#editwin").dialog("close");
            $('#list_data').datagrid({
                url: '/PDRInfo/PDRListData?rom=' + Math.random(),
                cache:false
            });
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
                    ids.push(rows[i].PID);
                }
                $.post("/PDRInfo/DeletePDRInfo?Rnum=" + Math.random(), { "pid": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        window.location.reload();
                    }
                    else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            }
        });
    }
}
function dosearch() {
    var pname = $("#pname").val();
    var cname = $("#cname").val();
    $('#list_data').datagrid('load', { "prdname": pname, "companyname": cname });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({
    url: '/PDRInfo/PDRListData?rom=' + Math.random(),
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