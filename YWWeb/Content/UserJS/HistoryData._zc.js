
$("#currPosition", window.top.document).html("当前位置：状态 > 历史 > 历史数据 ");
var dname, cname, pid,cid, hpid, startdate, enddate, typename, docount = 0, Index = 1, Page = 10;
document.getElementById("Index").value = Index;
var Startdate = new Date();
//Startdate.setDate(Startdate.getDate() - 7);
var DS = Startdate.getFullYear() + "-" + (Startdate.getMonth() + 1) + "-" + Startdate.getDate();
$('#StartDate').datebox({
    value: DS,
    onSelect: function () { //输入判断
        startdate = $('#StartDate').datebox('getValue');
        enddate = $('#EndDate').datebox('getValue');
        if (startdate > enddate) {
            $('#EndDate').datebox('setValue', startdate);
        }
    }
});
$('#EndDate').datebox({
    value: '24:00',
    onSelect: function () { //输入判断
        startdate = $('#StartDate').datebox('getValue');
        enddate = $('#EndDate').datebox('getValue');
        if (startdate > enddate) {
            $('#EndDate').datebox('setValue', startdate);
        }
    }
});
$('#StartDate').datebox('calendar').calendar({
    validator: function (date) {
        var now = new Date();
        return date <= now;
    }
});
$('#EndDate').datebox('calendar').calendar({
    validator: function (date) {
        var now = new Date();
        return date <= now;
    }
});
function JumpPage(v) {
    Index += v;
    if (Index < 0) {
        Index = 1;
    }
    document.getElementById("Index").value = Index;
    dosearch();
}

function dosearch() {
    //dname = $("#selDID").combobox('getText');
    dname = $("#selDID").combobox('getValue');
    cname = $("#cname").val();
    pid = $("#SPID").combobox('getValue');
    startdate = $('#StartDate').datebox('getValue');
    enddate = $('#EndDate').datebox('getValue');
    //typename = $("#cbType").combobox('getText');
    //typename = $("#cbType").combobox('getValue');
    cid = $("#selCID").combobox('getValue');
    if ("" == cid) {
        $.messager.alert("提示", "请选择回路！", "info");
        return;
    }
    Page = $('.pagingnumber  option:selected').val();
    //Index = index || 1;
    //document.getElementById("Index").value = Index; // 更新dom结构数据
    $('#list_data').datagrid({
        url: '/DataReport/HisData?rom=' + Math.random(),
        //"rows": Page, "page": Index,
        queryParams: {  "pid": pid, "CID": cid, "dname": dname, "cname": cname, "startdate": startdate, "enddate": enddate, "typename": typename }
    });
}

$("#SPID").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=7",
    valueField: 'PID',
    textField: 'Name',
    editable: false,
    onLoadSuccess: function (data) { //数据加载完毕事件
        if (hpid == undefined) {
            if ($.cookie('cookiepid') != null)
                pid = $.cookie('cookiepid');
            else
                pid = data[0].PID;
        }
        else {
            pid = hpid;

        }
        $("#SPID").combobox('select', pid);
        if (docount == 0)
            loadDeviceList(pid);
        docount == 0;
        
    },
    onSelect: function (data) {
        pid = data.PID;
        loadDeviceList(pid);
        docount++;
        $.cookie('cookiepid', pid, { expires: 7, path: '/' });
    }
});
function loadDeviceList(pid) {
    $("#selDID").combobox({
        url: "/BaseInfo/BindDeviceInfo?pid=" + pid,
        valueField: 'DID',
        textField: 'DeviceName',
        editable: false,
        onLoadSuccess: function (data) { //数据加载完毕事件
            if (data.length > 0) {
                $("#selDID").combobox('select', data[0].DID);
                did = data[0].DID;
            }
        },
        onSelect: function (data) {
            did = data.DID;//0;
            dname = data.DeviceName;
            //loadDataType(data.DID);
            initCombCid(pid, did)
        }
    });
}
function loadDataType(did) {
    $("#cbType").combobox({
        url: "/BaseInfo/BindValueType?did=" + did,
        valueField: 'DataTypeID',
        textField: 'Name',
        editable: false,
        onLoadSuccess: function (data) { //数据加载完毕事件
            if (data.length > 0) {
                $("#cbType").combobox('select', data[0].DataTypeID);
            }
           
        }
    });
}
function initCombCid(pid, did) {
    $("#selCID").combobox({
        url: "/BaseInfo/getCidByPID?pid=" + pid + "&did=" + did + "&showAll=1",
        valueField: 'cid',
        textField: 'cname',
        editable: false,
        onSelect: function (data) {
            if (data.cid == 0) {
                cid = 0;
            } else {
                cid = data.cid;
            }
           
        },
        onLoadSuccess: function (data) {
           
            for (var item in data[0]) {
                if (item == 'cid') {
                    $("#selCID").combobox('select', data[0][item]);
                }
            }     
            dosearch()
        }
    });
}

$('#list_data').datagrid({
    url: ''
});

function export1() {

  var ajaxbg = top.$(".loding2");
    //dname = $("#selDID").combobox('getText');
     cname = $("#cname").val();
     pid = $("#SPID").combobox('getValue');
     startdate = $('#StartDate').datebox('getValue');
     enddate = $('#EndDate').datebox('getValue');
    //typename = $("#selCID").combobox('getText');
    var aDate, oDate1, oDate2, iDays
    aDate = startdate.split("-");
    oDate1 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]);     //转换为12-18-2002格式
    aDate = enddate.split("-");
    oDate2 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2]);
    iDays = parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
    ajaxbg.show();
    if (iDays > 1) {
        top.$("#loading_background,#loading").html("<img src='/Content/Images/loading.gif' style='vertical-align: middle;'>&nbsp<span>数据量较大，请耐心等待。点击取消提示</span>  ");
    }
    $.get("/DataReport/ExportHisData",
        { 'pid': pid, 'dname': dname, 'cname': cname, 'startdate': startdate, 'enddate': enddate, 'typename': typename },
        function (data, status) {
            ajaxbg.hide();

            if (data.code == 0) {
                $.messager.alert("提示", data.v, "info");
            } else {
                window.open('http://' + window.location.host + data.v);
                 ajaxbg.hide();
            }
        }
    );
}



$(document).ready(function () {
    $("#SPID").combobox({
        onChange: function () {
            console.log("load")
            //window.dosearch();
        }
    })
});