if (type == 1) {
    $("#mingcheng").show();
    $("#inputName").show();
    $("#mingcheng1").hide();
    $("#inputName1").hide();
} else {
    $("#mingcheng").hide();
    $("#inputName").hide();
    $("#mingcheng1").show();
    $("#inputName1").show();
}
loadTemplateName();
var ordersRC=[];
var ordersSY=[];

$('#cs_xj_time').datebox({
});

$('#cs_xj_time2').datebox({
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
function clear_xj(){
    ordersRC.length=0
    setCOrderList(ordersRC,$("#listtimerc"))
}

function clear_xj2(){
    ordersSY.length=0
    setCOrderList(ordersSY,$("#listtimerc2"))
}

$("#person").combobox({
    url: "/UserInfo/getUserInfo",
    valueField: 'UserID',
    textField: 'UserName',
    multiple:false,
    onLoadSuccess: function () {

    }
});

$("#person1").combobox({
    url: "/UserInfo/getUserInfo",
    valueField: 'UserID',
    textField: 'UserName',
    multiple:false,
    onLoadSuccess: function () {

    }
});
function clickOrder(order){
    console.log("clickOrder")
    console.log(order)
    OpenFrameOrder(0);
};

function loadTemplateName() {
    $("#templateIds").combobox({
        url: "/UserInfo/GetOrderTemplates",
        valueField: 'templateId',
        textField: 'templateName',
        multiple: true,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#templateIds').combobox('getData');
            var text = $("#templateIds").combobox('getText')
            setDocList(text,$("#listrc"))
        },
        onSelect: function () {
            var text = $("#templateIds").combobox('getText')
            setDocList(text,$("#listrc"))
        },
        onUnselect: function () {
            var text = $("#templateIds").combobox('getText')
            setDocList(text,$("#listrc"))
        },
        onChange:function(newVal, oldVal){
            setDocList($("#templateIds").combobox('getText'),$("#listrc"))
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
            setDocList(text,$("#listrc2"))
        },
        onSelect: function () {
            var text = $("#templateIds2").combobox('getText')
            setDocList(text,$("#listrc2"))
        },
        onUnselect: function () {
            var text = $("#templateIds2").combobox('getText')
            setDocList(text,$("#listrc2"))
        },
        onChange:function(newVal, oldVal){
            setDocList($("#templateIds2").combobox('getText'),$("#listrc2"))
        }
    });
};

function setDocList(text,ida){
    if(text==null||text==undefined||text==''){
        result ="<td style=\"text-align:left\">"+"&nbsp;&nbsp;未选择"+"</td>"
        ida.html(result);
    }else{
        var result="未选择"
        var ss= text.split(',')
        if(ss.length>0){
            result=""
            var i=1;
            for(var t in ss){
                if(ss[t]!=""){
                    if(i>1)
                        result =result+"<br>"+i+"、"+ss[t]
                    else
                        result =i+"、"+ss[t]
                    i++;
                }
            }
        }
        result ="<td style=\"text-align:left\">"+result+"</td>"
        ida.html(result);
    }
};

function getTimeStrs(list){
    var  times = "";
    for(var j in list){
        var time=list[j].PlanDate;
        if (times.length>1)
            times = times + "," + time.substring(0,time.indexOf('T'));
        else
            times = time.substring(0, time.indexOf('T'));
    }
    console.log(times)
    return times;
};
function setOrderList(ss,ida){
    if(ss==null||ss.length<=0){
        result ="<td style=\"text-align:left\">"+"&nbsp;&nbsp;无"+"</td>"
        ida.html(result);
    }else{
        var result="无"
        if(ss.length>0){
            result=""
            var i=1;
            for(var t in ss){
                console.log(ss[t])
                if(ss[t].PlanDate!=""){
                    var orderName=ss[t].OrderName
                    var id=ss[t].OrderID
                    var s="bt1"
                    var sss=''
                    if(id>0){
                        s="bt0"
                        sss=" disabled=\"disabled\" ";
                    }
                    var str=JSON.stringify(ss[t]);
                    if(i>1){
                        result=result+"<tr><th onclick=\"OrderDetail("+id+")\">"+"<a>"+i+"、"+orderName+"</a>"+"</th></tr>"
                    }
                    else
                        result="<tr><th onclick=\"OrderDetail("+id+")\">"+"<a>"+i+"、"+orderName+"</a>"+"</th></tr>"
                    i++;
                }
            }
        }
        result ="<table style=\"text-align:left\">"+result+"</table>"
        ida.html(result);
    }
};
function setCOrderList(ss,ida){
    if(ss==null||ss.length<=0){
        result ="<td style=\"text-align:left\">"+"&nbsp;&nbsp;未选择"+"</td>"
        ida.html(result);
    }else{
        var result="未选择"
        if(ss.length>0){
            result=""
            var i=1;
            for(var t in ss){
                if(ss[t].PlanDate!=""){
                    var time=ss[t].PlanDate;
                    var id=ss[t].OrderId
                    var xx="未下发";
                    var s="bt1"
                    if(id>0){
                        var xx="已下发";
                        s="bt0"
                    }
                    if(i>1){
                        result=result+"<tr><th>"+i+"、"+time.substring(0, time.indexOf('T'))+"</th><td class=\""+s+"\">"+xx+"</td></tr>"
                    }
                    else
                        result="<tr><th>"+i+"、"+time.substring(0, time.indexOf('T'))+"</th><td class=\""+s+"\">"+xx+"</td></tr>"
                    i++;
                }
            }
        }
        result ="<table style=\"text-align:left\">"+result+"</table>"
        ida.html(result);
    }
};

function loadUserInfo() {
    $.post("/Es/LoadConstractInfo", { "id": id }, function (data) {
        console.log(data);
        $("#CtrName").val(data.listPDRinfo.CtrName);
        $('#start_time').datebox('setValue', GetTimeByFormate(data.listPDRinfo.start_time));
        $('#end_time').datebox('setValue', GetTimeByFormate(data.listPDRinfo.end_time));
        $("#dayCount").val(data.listPDRinfo.dateFixCount);
        $("#testCount").val(data.listPDRinfo.testFixCount);
        $("#person").combobox('select', data.listPDRinfo.person);
        $("#CtrInfo").val(data.listPDRinfo.CtrInfo);
        //$("#CtrPType").combobox("setValue",data.listPDRinfo.ConType);
        $("#LinkMan").val(data.listPDRinfo.LinkMan);
        $("#Tel").val(data.listPDRinfo.Tel);
        $("#ConNo").val(data.listPDRinfo.ConNo);
        if(data.listPDRinfo.ConType==1){
            $("#CtrPName").combobox('setValue',data.listPDRinfo.UID);
        }else{
            $("#CtrAdmin").val(data.listPDRinfo.CtrAdmin);
        }
        console.log( data.contemp)
        $("#dgTemplateNameList").datagrid("loadData", data.contemp);  //动态取数据
    })
};
$("#CtrPName").combobox({
    url: "/ES/UnitComboData?isall=" + "false",
    valueField: 'UnitID',
    textField: 'UnitName',
    editable: true,
    onLoadSuccess: function () { //数据加载完毕事件
    }
});
$("#CtrPType").combobox({
    valueField: 'value',
    textField: 'text',
    editable: false,
    width: 200,
    data: [
         {
             value: '1',
             text: '售电'
         }, {
             value: '2',
             text: '购电'
         }
    ],
    onChange:function(n,o){
        
    }
});
$(function () {
    loadUserInfo();
    $("#btnSave").click(function () {
                                
        if ($("#CtrName").val() == "") {
            $.messager.alert("提示", "请输入合同名称！", "info");
            return false;
        }
        if ($("#ConNo").val() == "") {
            $.messager.alert("提示", "请输入合同编号！", "info");
            return false;
        }
        if ($("#CtrName").val().indexOf("#")>=0) {
            $.messager.alert("提示", "不能包含特殊字符#！", "info");
            return false;
        }
        //if($("#CtrPType").combobox("getText") == ""){
        //    $.messager.alert("提示", "请输入类型！", "info");
        //    return false;
        //}else{
            if(type==1){
                if ($("#CtrPName").combobox("getValue") == "") {
                    $.messager.alert("提示", "请选择客户名称！", "info");
                    return false;
                }
                                        
            }
            else{
                if ($("#CtrAdmin").val() == "") {
                    $.messager.alert("提示", "请输入发电厂调度名称！", "info");
                    return false;
                }
            }
        //}

        if ($("#person").combobox("getText") == "") {
            $.messager.alert("提示", "请输入负责人员！", "info");
            return false;
        }
        else if ($("#LinkMan").val() == "") {
            $.messager.alert("提示", "请输入联系人！", "info");
            return false;
        }
        else if ($("#Tel").val() == "") {
            $.messager.alert("提示", "请输入联系电话！", "info");
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

        var xj_time=getTimeStrs(ordersRC);
        var xj_time2=getTimeStrs(ordersSY);




        //读取工单内容
        var str1 = "";
        var str2 = "";
        var str3="";
        var str4="";
        var str5="";
        var str6="";
        var rows = $('#dgTemplateNameList').datagrid('getRows');
        if (rows.length < 1) {
        }else{
            var sTemp1 = [];
            var sTemp2 = [];
            var sTemp3 = [];
            var sTemp4 = [];
            var sTemp5=[];
            var sTemp6=[];
            for (var i = 0; i < rows.length; i++) {
                sTemp1.push(rows[i].ID);
                sTemp2.push(rows[i].Name);
                sTemp3.push(formatDate(rows[i].StartTime));
                sTemp4.push(rows[i].PersonID);
                sTemp5.push(rows[i].BeforDay);
                sTemp6.push(rows[i].IsOk);
                str1 = sTemp1.join(',');
                str2 = sTemp2.join(',');
                str3=sTemp3.join(',');
                str4=sTemp4.join(',');
                str5=sTemp5.join(',');
                str6=sTemp6.join(',');
            }
                                   
        }

        var postData = {
            id:id,
            CtrName: $("#CtrName").val(),
            CtrAdmin: $("#CtrAdmin").val(),
            CtrInfo: $("#CtrInfo").val(),
            CtrPName: $("#CtrPName").combobox("getText"),
                                   
            UID:$("#CtrPName").combobox("getValue"),
            start_time: $("#start_time").datebox('getValue'),
            end_time: $("#end_time").datebox('getValue'),
            person: $("#person").combobox("getText"),
            dateFixCount: $("#dayCount").val(),
            testFixCount: $("#testCount").val(),
            LinkMan:$("#LinkMan").val(),
            Tel: $("#Tel").val(),
            ConNo:$("#ConNo").val(),
                                   
            timesrc:xj_time,

                                    
            timesjx:xj_time2,
            ConType:type,
            str1:str1,
            str2:str2,
            str3:str3,
            str4:str4,
            str5:str5,
            str6:str6
        };
        //发送异步请求，保存合同信息；
        $.post("/Es/saveConstract", postData, function (data) {
            if (data == "OK") {
                $.messager.alert("提示", "合同编辑成功！", "info");
                $('#editwin').window('close');
            }
            else {
                $.messager.alert("提示",data,"info");
                $('#editwin').window('close');
            }
        });
    });


    $('#btnAddTemplate').bind('click', function(){
        if ($('#shixiang').val() == "") {
            $.messager.alert("提示", "请输入项名称！", "info");
            return false;
        }
        if ($('#start_shixiang').datebox("getValue") == "") {
            $.messager.alert("提示", "请输入时间！", "info");
            return false;
        }
        if ($('#person1').combobox("getValue") == "") {
            $.messager.alert("提示", "请选择人员！", "info");
            return false;
        }
        if ($("#numTemplate").val() == "") {
            $.messager.alert("提示", "请输入提前天数！", "info");
            return false;
        }
        $('#dgTemplateNameList').datagrid('appendRow', { ID: 1,Name: $('#shixiang').val(),
            StartTime: $('#start_shixiang').datebox("getValue"),UserName:$('#person1').combobox("getText"),IsOk:"未完成",PersonID:$('#person1').combobox("getValue"),BeforDay:$("#numTemplate").val() });
    });

    $('#btnDelTemplate').bind('click', function(){
        var rows = $('#dgTemplateNameList').datagrid('getSelections');
        if (rows.length != 1) {
            $.messager.alert("提示", "请选择一行删除！", "info");
        }
        else
        {
            $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
                if (r) {
                    var row = $('#dgTemplateNameList').datagrid('getSelected');
                    if (row) {
                        var rowIndex = $('#dgTemplateNameList').datagrid('getRowIndex', row);
                        $('#dgTemplateNameList').datagrid('deleteRow', rowIndex);
                    }
                }
            })
        }
    });
});
//全取图标
function Get_Menu_Img(img) {
    $("#Img_Menu_Img").attr("src", '/Content/Images/Logo/' + img);
    $("#Menu_Img").val(img);
};
//获取指定格式的时间字符串
function GetTimeByFormate(time,row,r) {
    if (time.indexOf("/Date(") > -1)
        time = time.replace("/Date(", "").replace(")/", "");
    time = Number(time);
    var formate = arguments[1] ? arguments[1] : "all";//转换格式
    var date = new Date(time);
    var datetime = time;
    if (formate == "all") {
        datetime = date.getFullYear()
                   + "-"
                   + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1))
                   + "-"
                   + (date.getDate() < 10 ? "0" + date.getDate() : date
                           .getDate())
                   + " "
                   + (date.getHours() < 10 ? "0" + date.getHours() : date
                           .getHours())
                   + ":"
                   + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                           .getMinutes())
                   + ":"
                   + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                           .getSeconds());
    }
    else if (formate == "time") {
        datetime = (date.getHours() < 10 ? "0" + date.getHours() : date
                           .getHours())
                   + ":"
                   + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                           .getMinutes())
                   + ":"
                   + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                           .getSeconds());
    }
    else if (formate == "day") {
        datetime = date.getFullYear()
                  + "-"
                  + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1))
                  + "-"
                  + (date.getDate() < 10 ? "0" + date.getDate() : date
                          .getDate())
    }

    return datetime;
}


function formatDate(NewDtime,row,r) {
    if(NewDtime.indexOf("Date")!=-1){
        var dt = new Date(parseInt(NewDtime.slice(6, 19)));
        var year = dt.getFullYear();
        var month = dt.getMonth() + 1;
        var date = dt.getDate();
        var hour = dt.getHours();
        var minute = dt.getMinutes();
        var second = dt.getSeconds();
        return year + "-" + month + "-" + date ;
    }
    else{
        return NewDtime
    }
};