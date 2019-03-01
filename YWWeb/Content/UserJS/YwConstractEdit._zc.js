loadTemplateName()
//var xj_time="";
//var xj_time2="";
var ordersRC = []
var ordersSY = []

$('#cs_xj_time').datebox({
    onSelect: function (date) {
        time1 = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()) + "T00:00:00"
        if (ordersRC.length == 0) {
            //xj_time=(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())
            ordersRC[0] = { "CtrId": id, "PlanDate": time1, "TemplateIds": $("#templateIds").combobox('getValues') + "", "orderType": "日常巡检" };
        }
        else
            ordersRC.push({ "CtrId": id, "PlanDate": time1, "TemplateIds": $("#templateIds").combobox('getValues') + "", "orderType": "日常巡检" })
        //xj_time=xj_time+","+(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())
        console.log(time1)
        console.log(ordersRC)
        setCOrderList(ordersRC, $("#listtimerc"))
    }
});

$('#cs_xj_time2').datebox({
    onSelect: function (date) {
        time1 = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()) + "T00:00:00"
        if (ordersSY.length == 0) {
            ordersSY[0] = { "CtrId": id, "PlanDate": time1, "TemplateIds": $("#templateIds2").combobox('getValues') + "", "orderType": "检修试验" };
        }
        else
            ordersSY.push({ "CtrId": id, "PlanDate": time1, "TemplateIds": $("#templateIds2").combobox('getValues') + "", "orderType": "检修试验" })
        console.log("time1=====" + time1)
        console.log(ordersRC)
        setCOrderList(ordersSY, $("#listtimerc2"))
    }
});

function OpenFrameOrder(id) {
    $('#editwin2').window({
        modal: true,
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        draggable: true, //可拖动，默认false  
        resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false    
        href: '/OrderInfo/OrderEdit?orderid=' + id,
        onClose: function () {
            loadUserInfo();
        }
    });
    $('#editwin2').window('open');
}

//function setTable(text,ida){
//    console.log(text)
//    if(text==null||text==undefined||text==''){
//        result ="<td style=\"text-align:left\">"+"&nbsp;&nbsp;未选择"+"</td>"
//        ida.html(result);
//    }else{
//        var result="未选择"
//        var ss= text.split(',')
//        if(ss.length>0){
//            result=""
//            var i=1;
//            for(var t in ss){
//                if(ss[t]!=""){
//                    if(i>1)
//                        result =result+"<tr><th>"+i+":"+ss[t]+"</th><td><button onclick=\"clickOrder('"+ss[t]+"')\">未下发</button></td></tr>"
//                    else
//                        result="<tr><th>"+i+":"+ss[t]+"</th><td><button onclick=\"clickOrder('"+ss[t]+"')\">未下发</button></td></tr>"
//                    i++;
//                }
//            }   
//        } 
//        result ="<table style=\"text-align:left\">"+result+"</table>"
//        ida.html(result);
//    }
//}

function clear_xj() {
    ordersRC.length = 0
    setCOrderList(ordersRC, $("#listtimerc"))
}

function clear_xj2() {
    ordersSY.length = 0
    setCOrderList(ordersSY, $("#listtimerc2"))
}

$("#person").combobox({
    url: "/UserInfo/getUserInfo",
    valueField: 'UserID',
    textField: 'UserName',
    multiple: false,
    onLoadSuccess: function () {

    }
});

function clickOrder(order) {
    console.log("clickOrder")
    console.log(order)
    OpenFrameOrder(0);
}

function loadTemplateName() {
    $("#templateIds").combobox({
        url: "/UserInfo/GetOrderTemplates",
        valueField: 'templateId',
        textField: 'templateName',
        multiple: true,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#templateIds').combobox('getData');
            var text = $("#templateIds").combobox('getText')
            setDocList(text, $("#listrc"))
        },
        onSelect: function () {
            var text = $("#templateIds").combobox('getText')
            setDocList(text, $("#listrc"))
        },
        onUnselect: function () {
            var text = $("#templateIds").combobox('getText')
            setDocList(text, $("#listrc"))
        },
        onChange: function (newVal, oldVal) {
            setDocList($("#templateIds").combobox('getText'), $("#listrc"))
        }
    });
    $("#templateIds2").combobox({
        url: "/UserInfo/GetOrderTemplates",
        valueField: 'templateId',
        textField: 'templateName',
        multiple: true,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#templateIds2').combobox('getData');
            var text = $("#templateIds2").combobox('getText')
            setDocList(text, $("#listrc2"))
        },
        onSelect: function () {
            var text = $("#templateIds2").combobox('getText')
            setDocList(text, $("#listrc2"))
        },
        onUnselect: function () {
            var text = $("#templateIds2").combobox('getText')
            setDocList(text, $("#listrc2"))
        },
        onChange: function (newVal, oldVal) {
            setDocList($("#templateIds2").combobox('getText'), $("#listrc2"))
        }
    });
}

function setDocList(text, ida) {
    if (text == null || text == undefined || text == '') {
        result = "<td style=\"text-align:left\">" + "&nbsp;&nbsp;未选择" + "</td>"
        ida.html(result);
    } else {
        var result = "未选择"
        var ss = text.split(',')
        if (ss.length > 0) {
            result = ""
            var i = 1;
            for (var t in ss) {
                if (ss[t] != "") {
                    if (i > 1)
                        result = result + "<br>" + i + "、" + ss[t]
                    else
                        result = i + "、" + ss[t]
                    i++;
                }
            }
        }
        result = "<td style=\"text-align:left\">" + result + "</td>"
        ida.html(result);
    }
}

function getTimeStrs(list) {
    var times = "";
    for (var j in list) {
        var time = list[j].PlanDate;
        if (times.length > 1)
            times = times + "," + time.substring(0, time.indexOf('T'));
        else
            times = time.substring(0, time.indexOf('T'));
    }
    console.log(times)
    return times;
}
function setOrderList(ss, ida) {
    if (ss == null || ss.length <= 0) {
        result = "<td style=\"text-align:left\">" + "&nbsp;&nbsp;无" + "</td>"
        ida.html(result);
    } else {
        var result = "无"
        if (ss.length > 0) {
            result = ""
            var i = 1;
            for (var t in ss) {
                console.log(ss[t])
                if (ss[t].PlanDate != "") {
                    var orderName = ss[t].OrderName
                    var id = ss[t].OrderID
                    var s = "bt1"
                    var sss = ''
                    if (id > 0) {
                        s = "bt0"
                        sss = " disabled=\"disabled\" ";
                    }
                    var str = JSON.stringify(ss[t]);
                    if (i > 1) {
                        result = result + "<tr><th onclick=\"OrderDetail(" + id + ")\">" + "<a>" + i + "、" + orderName + "</a>" + "</th></tr>"
                    }
                    else
                        result = "<tr><th onclick=\"OrderDetail(" + id + ")\">" + "<a>" + i + "、" + orderName + "</a>" + "</th></tr>"
                    i++;
                }
            }
        }
        result = "<table style=\"text-align:left\">" + result + "</table>"
        ida.html(result);
    }
}
function setCOrderList(ss, ida) {
    if (ss == null || ss.length <= 0) {
        result = "<td style=\"text-align:left\">" + "&nbsp;&nbsp;未选择" + "</td>"
        ida.html(result);
    } else {
        var result = "未选择"
        if (ss.length > 0) {
            result = ""
            var i = 1;
            for (var t in ss) {
                if (ss[t].PlanDate != "") {
                    var time = ss[t].PlanDate;
                    var id = ss[t].OrderId
                    var xx = "未下发";
                    var s = "bt1"
                    if (id > 0) {
                        var xx = "已下发";
                        s = "bt0"
                    }
                    if (i > 1) {
                        result = result + "<tr><th>" + i + "、" + time.substring(0, time.indexOf('T')) + "</th><td class=\"" + s + "\">" + xx + "</td></tr>"
                    }
                    else
                        result = "<tr><th>" + i + "、" + time.substring(0, time.indexOf('T')) + "</th><td class=\"" + s + "\">" + xx + "</td></tr>"
                    i++;
                }
            }
        }
        result = "<table style=\"text-align:left\">" + result + "</table>"
        ida.html(result);
    }
}

function loadUserInfo() {
    $.post("/UserInfo/LoadConstractInfo", { "id": id }, function (data) {
        var datas = eval("(" + data + ")");
        console.log(datas)
        $("#CtrName").val(datas.constract.CtrName);
        $("#CtrAdmin").val(datas.constract.CtrAdmin);
        $("#CtrPName").combobox('setValue', datas.constract.CtrPid);
        $("#CtrPName").combobox('setText', datas.constract.CtrPName);
        $('#start_time').datebox('setValue', datas.constract.start_time);
        $('#end_time').datebox('setValue', datas.constract.end_time);
        $("#dayCount").val(datas.constract.dateFixCount);
        $("#testCount").val(datas.constract.testFixCount);
        $("#person").combobox('select', datas.constract.person);
        $("#templateIds").combobox('setValues', datas.constract.rcTemplateIds);
        $("#templateIds2").combobox('setValues', datas.constract.syTemplateIds);
        $("#CtrInfo").val(datas.constract.CtrInfo);
        ordersRC = datas.ordersRC
        ordersSY = datas.ordersSY
        setCOrderList(ordersRC, $("#listtimerc"))
        setCOrderList(ordersSY, $("#listtimerc2"))

        setOrderList(datas.ordersDays, $("#listOrdersDays"))
        setOrderList(datas.ordersTests, $("#listOrdersTests"))
        setOrderList(datas.others, $("#listOthers"))
        //console.log(xj_time)
        //console.log(xj_time2)
        //setDocList(xj_time,$("#listtimerc"))
        //setDocList(xj_time2,$("#listtimerc2"))
    })
}
$("#CtrPName").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=0",
    valueField: 'PID',
    textField: 'Name',
    onLoadSuccess: function () {
        var data = $('#PDRName').combobox('getData');
        if (data.length > 0) {
            $("#PDRName").combobox('select', $.cookie('cookiepid'));
            dosearch();
        }
    },
    onSelect: function (data) {
        $.cookie('cookiepid', data.PID, { expires: 7, path: '/' });
    }
});

$(function () {
    loadUserInfo();
    $("#btnSave").click(function () {
        if ($("#CtrName").val() == "") {
            $.messager.alert("提示", "请输入合同名称！", "info");
            return false;
        }
       
        if ($("#CtrName").val().indexOf("#") >= 0) {
            $.messager.alert("提示", "不能包含特殊字符#！", "info");
            return false;
        }
        else if ($("#CtrAdmin").val() == "") {
            $.messager.alert("提示", "请输入运维客户！", "info");
            return false;
        }
        
        else if ($("#CtrPName").val() == "") {
            $.messager.alert("提示", "请输入站名称！", "info");
            return false;
        }
        else if ($("#start_time").datebox('getValue') == "") {
            $.messager.alert("提示", "请输入开始日期！", "info");
            return false;
        }
        else if ($("#end_time").datebox('getValue') == "") {
            $.messager.alert("提示", "请输入结束日期！", "info");
            return false;
        }
        else if ($("#person").combobox("getText") == "") {
            $.messager.alert("提示", "请输入负责人员！", "info");
            return false;
        }
        
        //else if (parseInt($("#dayCount").val())=="NaN") {
        //    $.messager.alert("提示", "请输入日常检修次数！", "info");
        //    return false;
        //}
        //else if (parseInt($("#testCount").val())=="NaN") {
        //    $.messager.alert("提示", "请输入检修试验次数！", "info");
        //    return false;
        //}

        var array = $("#templateIds").combobox("getValues");
        var Dids = "";
        for (var i in array) {
            if (Dids != "")
                Dids += ("," + array[i]);
            else
                Dids += array[i];
        }

        var templateIdsrc = $("#templateIds").combobox('getValues') + "";
        var templateIdsjx = $("#templateIds2").combobox('getValues') + ""


        var xj_time = getTimeStrs(ordersRC);
        var xj_time2 = getTimeStrs(ordersSY);

        var postData = {
            id: id,
            CtrName: $("#CtrName").val(),
            CtrAdmin: $("#CtrAdmin").val(),
            CtrInfo: $("#CtrInfo").val(),
            CtrPName: $("#CtrPName").combobox("getText"),
            CtrPid: $("#CtrPName").combobox("getValue"),
            start_time: $("#start_time").datebox('getValue'),
            end_time: $("#end_time").datebox('getValue'),
            person: $("#person").combobox("getText"),
            dateFixCount: $("#dayCount").val(),
            testFixCount: $("#testCount").val(),

            constractInfo1: $("#templateIds").combobox("getText"),
            templateIdsrc: templateIdsrc,
            timesrc: xj_time,

            constractInfo2: $("#templateIds2").combobox("getText"),
            templateIdsjx: templateIdsjx,
            timesjx: xj_time2,
        };
        //发送异步请求，保存合同信息；
        $.post("/UserInfo/saveConstract", postData, function (data) {
            if (data == "OK") {
                $.messager.alert("提示", "合同编辑成功！", "info");
                $('#editwin').window('close');
            }
            else {
                alert(data);
                $('#editwin').window('close');
            }
        });
    });
});
//全取图标
function Get_Menu_Img(img) {
    $("#Img_Menu_Img").attr("src", '/Content/Images/Logo/' + img);
    $("#Menu_Img").val(img);
}