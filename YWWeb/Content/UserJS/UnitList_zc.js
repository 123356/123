$("#currPosition", window.top.document).html("当前位置：设置 > 基本设置 > 单位管理");

function LogoFormat(value, row, index) {
    if (value == null)
        return "";
    else
        return "<img width=\"50\" height=\"50\" alt=\"\" src=\"../.." + value + "\" />";
}

////行业名称
//    $("#IndustryID").combobox({
//        url: "/BaseInfo/BindIndustryName",
//        valueField: 'IndustryID',
//        textField: 'IndustryName',
//        editable: false,
//        onLoadSuccess: function () {
//            console.log("测试")
//            var data = $('#IndustryID').combobox('getData');
//            if (data.length > 0) {
//                $("#IndustryID").combobox('setValue', data[0].IndustryID);
//            }
//        }
//    });
$("#ProjectType").combobox({
    url: "/SysInfo/UnitTypeComboxData",
    valueField: 'ID',
    textField: 'UnitProjectTypeName',
    editable: false,
    width: 200,
    onLoadSuccess: function () { //数据加载完毕事件
        var data = $('#ProjectType').combobox('getData');
        if (data.length > 0) {
            $("#ProjectType").combobox('select', data[0].value);
        }
    }
});


function getStr(value) {
    switch (value) {
        case "1":
            return "商业综合体";
        case "2":
            return "办公写字楼";
        case "3":
            return "购物中心";
        case "4":
            return "公共设施服务";
        default:
            return "无";
    }
}


//获取行业名称
function loadIndustryName(IndustryID) {
    var IndustryName = '';
    $.ajaxSettings.async = false;
    $.post("/BaseInfo/GetIndustryName", { "IndustryID": IndustryID }, function (data) {
        if (data != '')
            IndustryName = data;
    });
    return IndustryName;
}

function loadSelectPDR(arr) {
    $("#pdflist").combobox({
        url: '/Es/PDRComboData', onlyLeafCheck: true, method: 'post', multiple: 'true',
        valueField: 'PID',
        textField: 'Name',
        editable: false,
        width: 600,
        formatter: function (row) {
            var opts = $(this).combobox('options');
            return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]
        },
        onLoadSuccess: function () {
            var opts = $(this).combobox('options');
            var target = this;
            var values = $(target).combobox('getValues');
            $.map(values, function (value) {
                var el = opts.finder.getEl(target, value);
                el.find('input.combobox-checkbox')._propAttr('checked', true);
            })
            if (arr != "" && arr != null) {
                $("#pdflist").combobox("setValues", arr.split(','));
                var opts = $(this).combobox('options');
                var target = this;
                var values = $(target).combobox('getValues');
                $.map(values, function (value) {
                    var el = opts.finder.getEl(target, value);
                    el.find('input.combobox-checkbox')._propAttr('checked', true);
                })
            }

        },
        onSelect: function (row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', true);
        },
        onUnselect: function (row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', false);
        }
    });
}
function loadProvince(proid, cityid) {
   
    $('#UnitProvince').combobox({
        url: "/BaseInfo/BindPromary?rom=" + Math.random(),
        valueField: 'proID',
        textField: 'proName',
        editable: true,
        onSelect: function () {
            loadCity(0);
            $('#LinkAddress').val($('#UnitProvince').combobox('getText'));
        },
        onLoadSuccess: function () { //数据加载完毕事件
            if (proid > 0) {
                $("#UnitProvince").combobox('select', proid);
                loadCity(cityid);
            } else {
                var data = $("#UnitProvince").combobox('getData');
                if (data.length > 0) {
                    $("#UnitProvince").combobox('select', data[0].proID);
                }
                //loadCity(cityid)
               
                
            }
        }
    });
}
function loadCity(cityid) {
    var fproID = $("#UnitProvince").combobox('getValue');
    $('#UnitCity').combobox({
        url: '/BaseInfo/BindCity?row=' + Math.random() + '&proID=' + fproID,
        valueField: 'cityID',
        textField: 'cityName',
        editable: true,
        onSelect: function () {
            $('#LinkAddress').val($('#LinkAddress').val() + $('#UnitCity').combobox('getText'));
        },
        onLoadSuccess: function () { //数据加载完毕事件
            if (cityid > 0) {
                $("#UnitCity").combobox('select', cityid);
            } else {
                
                var citydata = $("#UnitCity").combobox('getData');
                if (citydata.length > 0) {
                    $("#UnitCity").combobox('select', citydata[0].cityID);
                }

            }
        }
    });
}
function add() {
    clearForm();
    loadProvince();
    loadSelectPDR("");
    //行业名称
    $("#IndustryID").combobox({
        url: "/BaseInfo/BindIndustryName",
        valueField: 'IndustryID',
        textField: 'IndustryName',
        editable: false,
        onLoadSuccess: function () {
            console.log("测试")
            var data = $('#IndustryID').combobox('getData');
            if (data.length > 0) {
                $("#IndustryID").combobox('setValue', data[0].IndustryID);
            }
        }
    });
    

    $("#editwin").dialog({
        closed: false,
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 600) * 0.5,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
    });
}
function edit() {
    //行业名称
    $("#IndustryID").combobox({
        url: "/BaseInfo/BindIndustryName",
        valueField: 'IndustryID',
        textField: 'IndustryName',
        editable: false,
        onLoadSuccess: function () {
            console.log("测试")
            var data = $('#IndustryID').combobox('getData');
            if (data.length > 0) {
                $("#IndustryID").combobox('setValue', data[0].IndustryID);
            }
        }
    });
    clearForm();
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].UnitID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            //console.log(row);
            loadSelectPDR(row.PDRList)
            $("#UnitID").val(row.UnitID);
            $("#UnitName").val(row.UnitName);
            if (row.UnitLogo.length > 0)
                $("#Logo").html('<img width="60" height="60" alt="" src="../..' + row.UnitLogo + '"   />');
            $("#UnitLogo").val(row.UnitLogo);
            $("#LinkMan").val(row.LinkMan);
            $("#LinkMobile").val(row.LinkMobile);
            $("#LinkPhone").val(row.LinkPhone);
            $("#Email").val(row.Email);
            loadProvince(row.UnitProvince, row.UnitCity);
            $("#LinkAddress").val(row.LinkAddress);
            $("#EleCalWay").numberbox('setValue', row.EleCalWay);
            $("#GovEleLevel").numberbox('setValue', row.GovEleLevel);
            $("#DeviationMode").val(row.DeviationMode);
            $("#InstalledCapacity").val(row.InstalledCapacity);
            $("#InstalledCapacitys").numberbox('setValue', row.InstalledCapacitys)
            $("#IndustryID").combobox("setValue", row.IndustryID);
            $("#Loss").val(row.Loss),
                $("#LossAdd").val(row.LossAdd),
                $("#CSMMan").val(row.CSMMan),
                $("#CSMPhone").val(row.CSMPhone),
                //$("#SpareBase").val(row.SpareBase)
                $("#Coordination").val(row.Coordination);
            $("#ArchitectureArea").numberbox('setValue', row.ArchitectureArea)

            $("#LastYearPower").numberbox('setValue', row.LastYearPower);
            $("#ProjectType").combobox("setValue", row.ProjectType);
            $("#editwin").dialog({
                closed: false,
                top: ($(window).height() - 600) * 0.5,
                left: ($(window).width() - 600) * 0.5,
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
function check(id, msg) {
    if ($("#" + id).val() == "") {
        $.messager.alert("提示", msg, "info");
        $(".tabs li:eq(0) a").addClass("tabsBk")
        return false
    }
    return true
}

function valiate() {
    var reg = /^1\d{10}$/;
    var regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!check("UnitName", "请填写单位名称！")) {
        return
    }
    if (!check("LinkMan", "请填写联系人！")) {
        return
    }
    if (!check("LinkMobile", "请填写联系手机号！")) {
        return
    } else {
        if (reg.test($("#LinkMobile").val()) == false) {
            $.messager.alert("提示", "请填写正确的联系手机！", "info");
            return false;
        }
        
    }


    if (!check("LinkPhone", "请填写座机电话！")) {
        return
    }

    
    if ($("#Email").val()!=""&& regex.test($("#Email").val()) == false ) {
        $.messager.alert("提示", "请填写正确的邮箱格式！", "info");
        return false;
    }


    if (!check("CSMMan", "请填写客服经理！")) {
        return
    }
    if (!check("CSMPhone", "请填写客服电话！")) {
        return
    } else {
        if (reg.test($("#CSMPhone").val()) == false) {
            $.messager.alert("提示", "请填写正确的客服电话！", "info");
            return false;
        }
    }
    if (!check("LinkAddress", "请填写联系地址！")) {
        return 
    }



    console.log($("#UnitProvince").combobox("getValue"))
    console.log($("#UnitCity").combobox("getValue") )
    console.log($("#IndustryID").combotree("getText") )
    if ($("#UnitProvince").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择所属省份", "info");
        $(".tabs li:eq(0) a").addClass("tabsBk")
        return false
    }
    if ($("#UnitCity").combobox("getValue") == "") {
        $.messager.alert("提示", "请选择所属区域", "info");
        $(".tabs li:eq(0) a").addClass("tabsBk")
        return false
    }
    

    if (!check("Coordination", "请填写地图坐标！")) {
        return 
    }


    return true
}



function save() {
    var reg = /^1\d{10}$/;
    var regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!valiate()) {
        return
    }
    var pdrid = '';
    pdrid = $("#pdflist").combobox("getValues");
    var postData = {
        UnitID: $("#UnitID").val(),
        UnitName: $("#UnitName").val(),
        UnitLogo: $("#UnitLogo").val(),
        LinkMan: $("#LinkMan").val(),
        LinkMobile: $("#LinkMobile").val(),
        LinkPhone: $("#LinkPhone").val(),
        Email: $("#Email").val(),
        UnitProvince: $("#UnitProvince").combotree("getValue"),
        UnitCity: $("#UnitCity").combobox("getValue"),
        LinkAddress: $("#LinkAddress").val(),
        InstalledCapacity: $("#InstalledCapacity").val(),
        InstalledCapacitys: $("#InstalledCapacitys").numberbox("getValue"),
        EleCalWay: $("#EleCalWay").val(),
        GovEleLevel: $("#GovEleLevel").val(),
        DeviationMode: $("#DeviationMode").val(),
        IndustryID: $("#IndustryID").combobox("getValue"),
        Loss: $("#Loss").val(),
        LossAdd: $("#LossAdd").val(),
        CSMMan: $("#CSMMan").val(),
        CSMPhone: $("#CSMPhone").val(),
        //SpareBase: $("#SpareBase").val(),
        Coordination: $("#Coordination").val(),
        Type: 1,
        PDRList: pdrid.join(','),
        ProjectType: $("#ProjectType").combobox("getValue"),
        LastYearPower: $("#LastYearPower").val(),
        ArchitectureArea: $("#ArchitectureArea").val(),
    };
    $.post("/SysInfo/SaveUnit", postData, function (data) {
        if (data == "OKadd") {
            $("#UnitID").val("");
            $("#editwin").dialog("close");
            $.messager.alert("提示", "单位添加成功！", "info");
            window.location.reload();
        }
        else if (data == "OKedit") {
            $("#UnitID").val("");
            $("#editwin").dialog("close");
            $('#list_data').datagrid({
                url: '/SysInfo/UnitListData?rom=' + Math.random()
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
                    ids.push(rows[i].UnitID);
                }
                $.post("/SysInfo/DeleteUnit?Rnum=" + Math.random(), { "uid": ids.join(',') }, function (data) {
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
    var uname = $("#unitname").val();
    var uman = $("#linkman").val();
    $('#list_data').datagrid('load', { "unitname": uname, "linkman": uman, "type": 1 });
    $('#list_data').datagrid('uncheckAll');
}
$('#list_data').datagrid({
    url: '/SysInfo/UnitListData?rom=' + Math.random(),
    pagination: true,
    queryParams: { "type": 1 }
});
function clearForm() {
    $("#Logo").html("");
    $('#UnitLogo').val("");
    $(':input', editwin).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
}

$(function () {
    upload5('image');
});
function upload5(cname) {
    $('#' + cname + "_upload").uploadifive({
        'auto': false,
        'buttonText': '浏  览',                                //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/SysInfo/Upload',          //处理文件上传Action
        'queueID': cname + 'Queue',                //队列的ID
        'queueSizeLimit': 1,                   //队列最多可上传文件数量，默认为999
        'auto': true,                              //选择文件后是否自动上传，默认为true
        'multi': true,                             //是否为多选，默认为true
        'removeCompleted': false,       //是否完成后移除序列，默认为true
        'fileSizeLimit': '0',                    //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': 'image/*',
        'formData': { 'folder': 'image', 'ctype': cname, "uid": 0 },
        'onUploadComplete': function (file, data) {
            console.log(data);
            $("#Logo").html('<img width="60" height="60" alt="" src="../..' + data + '"   />');
            $('#UnitLogo').val(data);
        }
    });
}