
function onclick_month() {

    var myDate = new Date();

    var thisyear = myDate.getFullYear();

    var thismonth = myDate.getMonth() + 1;

    var startdate = formatDate(thisyear + "-" + thismonth + "-01", 'yyyy-MM-dd');

    var enddate = formatDate(myDate.toDateString(), 'yyyy-MM-dd');

    $("#StartDate").datebox('setValue', startdate);
    $("#EndDate").datebox('setValue', enddate);
}

function onclick_year() {

    var myDate = new Date();

    var thisyear = myDate.getFullYear();

    var startdate = formatDate(thisyear + "-01-01", 'yyyy-MM-dd');

    var enddate = formatDate(myDate.toDateString(), 'yyyy-MM-dd');

    $("#StartDate").datebox('setValue', startdate);
    $("#EndDate").datebox('setValue', enddate);
}
$(function () {
    //查询站室名称
    $('#StationName').combotree({
        url: '/Home/ComboTreeMenu?type=1',
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
});
//新增站室名称
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
                $("#PName").val(node.text);
                loadDeviceList(node.id);
            }
        }
    }
});

function loadDeviceList(pid) {
    $("#DID").combobox({
        url: "/BaseInfo/BindDeviceInfo?showall=1&pid=" + pid,
        valueField: 'DID',
        textField: 'DeviceName',
        editable: false
    });
}

$("#currPosition", window.top.document).html("当前位置：运维 > 隐患管理 ");

//缺陷处理情况等级
$('#HandeSituation').combobox({
    valueField: 'value',
    textField: 'text',
    editable: false,

    data: [{
        value: '',
        text: '全部'
    }, {
        value: '未审核',
        text: '未审核'
    }, {
        value: '日常巡检',
        text: '日常巡检'
    }, {
        value: '应急抢修',
        text: '应急抢修'
    }, {
        value: '隐患已排除',
        text: '隐患已排除'
    }, {
        value: '非隐患',
        text: '非隐患'
    }]
});

//缺陷等级
$('#BugLevel').combobox({
    valueField: 'value',
    textField: 'text',
    editable: false,
    width: document.body.clientWidth * 0.1,
    data: [{
        value: '一般',
        text: '一般'
    }, {
        value: '重大',
        text: '重大'
    }, {
        value: '紧急',
        text: '紧急'
    }]
});

//报告方式
function loadReportWay() {
    $('#ReportWay').combobox({
        valueField: 'value',
        textField: 'text',
        editable: false,
        width: document.body.clientWidth * 0.1,
        data: [{
            value: '在线监测',
            text: '在线监测'
        }],
        onLoadSuccess: function () {
            var data = $('#ReportWay').combobox('getData');
            $("#ReportWay").combobox('select', data[0].text);
        }
    });
}

//日期转换
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy-MM-dd hh:mm:ss');
    return lDate
}

//查看详情
function lookDetail(bugid) {
    var url = "/PerationMaintenance/HazardManDetail?bugid=" + bugid;
    top.openDialog(url, 'HazardManDetail_Form', '隐患详情', 900, 600, 50, 50);
}
function add() {
    clearForm();
    loadReportWay();
    $("#editwin").dialog({
        closed: false,
        top: ($(window).height() - 450) * 0.5,
        left: ($(window).width() - 700) * 0.5,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        resizable: true//可缩放，即可以通脱拖拉改变大小，默认false 
    });
}
function edit() {
    var row = $('#list_data').datagrid('getSelected');
    if (row) {
        $("#PID").val(row.PID);
        $("#Name").val(row.Name);
        $("#CompanyName").val(row.CompanyName);
        $("#Position").val(row.Position);
        $("#UseState").val(row.UseState);
        $("#Coordination").val(row.Coordination);
        loadBugTypeList(row.TypeID);
        $("#AreaID").combotree("setValue", row.AreaID);
        $("#editwin").dialog({
            closed: false,
            top: ($(window).height() - 400) * 0.5,
            left: ($(window).width() - 600) * 0.5,
            minimizable: false, //最小化，默认false  
            maximizable: false, //最大化，默认false  
            collapsible: false, //可折叠，默认false  
            draggable: true, //可拖动，默认false  
            resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
        });
    }
    else {
        $.messager.alert("提示", "请选择要编辑的行！", "info");
    }
}
function save() {
    if ($("#PID").val() == "" || $("#BugLevel").combotree("getValue") == "" || $("#ReportWay").combotree("getValue") == "" || $("#BugLocation").val() == "" || $("#DID").combotree("getValue") == "") {
        $.messager.alert("提示", "请填写必填项目！", "info");
        return false;
    }
    
    var postData = {
        PID: $("#PID").val(),
        PName: $("#PName").val(),
        DID: $("#DID").combotree("getValue"),
        DeviceName: $("#DID").combotree("getText"),
        BugLevel: $("#BugLevel").combotree("getValue"),
        ReportWay: $("#ReportWay").combotree("getValue"),
        BugLocation: $("#BugLocation").val(),
        BugDesc: $("#BugDesc").val()

    }

    $.post("/PerationMaintenance/SaveBugInfo", postData, function (data) {
        if (data == "OKadd") {
            $("#PID").val("");
            $("#editwin").dialog("close");
            $.messager.alert("提示", "隐患添加成功！", "info");
            window.location.reload();
        }
        else if (data == "OKedit") {
            $("#PID").val("");
            $("#editwin").dialog("close");
            $('#list_data').datagrid({
                url: '/PerationMaintenance/BugListData?rom=' + Math.random()
            })
        }
        else
            alert(data);
    });
}
function detail() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].BugID);
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
                top: ($(window).height() - 500) * 0.5,
                left: ($(window).width() - 800) * 0.5,
                draggable: true, //可拖动，默认false  
                resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false    
                href: '/PerationMaintenance/HazardManDetail?bugid=' + row.BugID,
                onClose: function () {
                    $('#list_data').datagrid('reload');
                    $('#list_data').datagrid('uncheckAll');
                }
            });
            $('#detailwin').window('open');

            //                    lookDetail(row.BugID);
        }
        else {
            $.messager.alert("提示", "请选择要查看详细的行！", "info");
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
                    ids.push(rows[i].BugID);
                }
                $.post("/PerationMaintenance/DeleteBugInfo?Rnum=" + Math.random(), { "bid": ids.join(',') }, function (data) {
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
    var PID = $.cookie('cookiepid');
    var HandeSituation = $("#HandeSituation").combotree("getValue");
    var StartReportDate = $("#StartDate").datebox('getValue');
    var EndReportDate = $("#EndDate").datebox('getValue');
    $('#list_data').datagrid({
        url: '/PerationMaintenance/BugListData?rom=',
        queryParams: { "PID": PID, "HandeSituation": HandeSituation, "StartReportDate": StartReportDate, "EndReportDate": EndReportDate },
        pagination: true,
        onDblClickRow: function (rowIndex, rowData) {
            if (rowData) {
                $('#detailwin').window({
                    modal: true,
                    top: ($(window).height() - 500) * 0.5,
                    left: ($(window).width() - 800) * 0.5,
                    draggable: true, //可拖动，默认false  
                    resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false    
                    href: '/PerationMaintenance/HazardManDetail?bugid=' + rowData.BugID
                });
                $('#detailwin').window('open');

                //                    lookDetail(row.BugID);
            }
            else {
                $.messager.alert("提示", "请选择要查看详细的行！", "info");
            }
        }
    });
    $('#list_data').datagrid('uncheckAll');
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