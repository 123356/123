loadSelectMonth();
loadSelectYear();
GetView();
function GetView() {
    $.post('/Es/GetPlanView', { "month": $("#month").combobox("getValue"), "year": $("#year").combobox("getValue") }, function (data) {
        var pzhtml = "";
        var pzname = "";
        var hhtml = "";
        var x = "";
        OBJpz = data.pzlist;
        var s = data.pzlist.length;
        hhtml += '<tr><td rowspan="2">序号</td><td  rowspan="2"></td>'
        hhtml += '<td rowspan="2">用户当月计划电量（兆瓦时）</td>'
        hhtml += '<td colspan=' + s + '>用户分品种计划电量（兆瓦时）</td>'
        //hhtml += '<td>实际用电量与计划电量偏差</td>'
        //hhtml += '<td colspan=' + s + '>调偏后的计划交易电量（兆瓦时）</td>'
        //hhtml += '<td colspan=' + s + '>已购电电量（兆瓦时)</td>'
        //hhtml += '<td colspan=' + s + '>本次应购电量（兆瓦时</td></tr>'
        pzhtml = "<tr>"
        for (var i = 0; i < data.pzlist.length; i++) {
            pzhtml += "<td>" + data.pzlist[i].category_name + "</td>";

        }

        //pzhtml += "<td></td>";
        //for (var i = 0; i < data.pzlist.length; i++) {
        //    pzhtml += "<td>" + data.pzlist[i].category_name + "</td>";

        //}
        //for (var i = 0; i < data.pzlist.length; i++) {
        //    pzhtml += "<td>" + data.pzlist[i].category_name + "</td>";

        //}
        //for (var i = 0; i < data.pzlist.length; i++) {
        //    pzhtml += "<td>" + data.pzlist[i].category_name + "</td>";

        //}
        pzhtml += "</tr>"

        //pzhtml += x;
        hhtml += pzhtml;
        var sumplan = 0;
        var sumpianchalv = 0;
        var pzSumplan = [];
        var tiaopianPlan = [];
        //var html = "";
        $.each(data.list, function (index, val) {
            sumplan += val.MonthPlan;
            sumpianchalv += val.pianchalv;
            if (val.MonthPlan == 0) {
                hhtml += "<tr onClick='AddColor(this)' style='background-color:#e7baba;' data-uid=" + val.uid + ">"
            } else {
                hhtml += "<tr onClick='AddColor(this)' data-uid=" + val.uid + ">"
            }

            hhtml += '<td>' + (index + 1) + '</td>'
            hhtml += '<td>' + val.UnitName + '</td>';
            hhtml += " <td>" + val.MonthPlan + "</td>";
            $.each(val.list, function (i, v) {

                hhtml += "<td   data-uid=" + val.uid + " data-pzid=" + v.categoryID + " style='cursor:text;' data-val=" + v.plan + ">" + v.plan + "</td>";

            })
            //hhtml += "<td>" + val.pianchalv + "</td>"
            //$.each(val.tiaopian, function (i, v) {

            //    hhtml += "<td>" + v.plan + "</td>";

            //})
            //$.each(val.goudian, function (i, v) {

            //    hhtml += "<td>" + v.quantity + "</td>";

            //})

            //$.each(val.yinggou, function (i, v) {

            //    hhtml += "<td>" + v.quantity + "</td>";

            //})
            hhtml += "</tr>";
        })
        //console.log(data);




        //alert(hhtml);
        $("#pzhtml").html(hhtml);
        var xhhtml = '<tr><td></td><td>售电公司合计</td>'
        xhhtml += '<td rowspan="2">' + sumplan + '</td>'
        var m = 3;
        for (m; m < s + 3; m++) {
            xhhtml += '<td rowspan="2">' + getTdValue(3, m) + '</td>'
        }
        //m += 1;
        //xhhtml += '<td rowspan="2">' + sumpianchalv + '</td>'
        //for (m; m < s*2+3; m++) {
        //    xhhtml += '<td rowspan="2">' + getTdValue(2, m) + '</td>'
        //}
        ////m+=6
        //for (m; m < s*3+3; m++) {
        //    xhhtml += '<td rowspan="2">' + getTdValue(2, m) + '</td>'
        //}
        ////m += 6;
        //for (m; m < s*4+3; m++) {
        //    xhhtml += '<td rowspan="2">'+ getTdValue(2, m) + '</td>'
        //}
        xhhtml += "<tr>"

        $("#pzhtml").append(xhhtml);
        //getTdValue();
    })
}
function getTdValue(ii,x) {
    var tableId = document.getElementById("pzhtml");
    var str = 0;
    for (var i = ii; i < tableId.rows.length; i++) {
        //alert(tableId.rows[i].cells[x].innerHTML);
        str +=parseFloat( tableId.rows[i].cells[x].innerHTML);
    }
    return str.toFixed(3);
}
function Add(obj) {
    var u = $(obj).attr("data-uid");
    var p = $(obj).attr("data-pzid");
    var v = $(obj).attr("data-val");
    //$("#uid").val(u);
    //$("#pzid").val(p);
    $(obj).html("<input type='text' id=" + u + p + " data-uid=" + u + " data-pzid=" + p + " onBlur='tijiao(this);' />");
    $("#" + u + p).val(v);
    $("#"+u+p).focus();
     
}
function tijiao(obj) {

    $.messager.confirm('提示', '你确定要保存计划吗？', function (r) {
        if (r) {
            $(obj).parent().attr("data-val", $(obj).val());
            $(obj).parent().html("<td>" + $(obj).val() + "</td>")
            var data = {
                'plan': $(obj).val(),
                'unid': $(obj).attr("data-uid"),
                'categoryID': $(obj).attr("data-pzid")
            }
            $.post('/Es/SaveV', data, function () {

            })
        } else {
            $(obj).parent().html("<td>" + $(obj).val() + "</td>")
        }
    })
}
function AddColor(obj) {
    $(obj).siblings().removeClass("bgcolor");
    if ($(obj).hasClass("bgcolor")) {
        $(obj).removeClass("bgcolor");
    } else {
        $(obj).addClass("bgcolor");
    }
       
}

function edit() {
    //clearForm();
    if ($(".bgcolor").length > 0) {
        $("#editwin2").dialog({
            closed: false,
            top: ($(window).height() - 300) * 0.5,
            left: ($(window).width() - 600) * 0.5,
            minimizable: false, //最小化，默认false  
            maximizable: false, //最大化，默认false  
            collapsible: false, //可折叠，默认false  
            draggable: true, //可拖动，默认false  
            resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
        });
        //$.post('/Es/BindCategory', { "isall": "false" }, function (data) {
        //var dataJson = JSON.parse(data);
        var html = "";
        var sumV=0;
        $.each(OBJpz, function (index, val) {
        
            var v=$(".bgcolor td").eq(index+3).html();
            if (index % 2 == 0) {
                html += '<tr>';
            }
            html += '<td class="d_l_t">' + val.category_name + ''

            html += '</td>';
            html += '<td class="d_l_d">'
            html += '<input runat="server" name="pzPlan" data-id=' + val.id + ' value='+v+' onKeyUp="value = value.replace(/[^\.\d]/g,"")" class="easyui-validatebox" style="width: 195px;" /><b class="RStar">&nbsp*</b>';
            html += '</td>'

            if (index % 2 != 0) {
                html += "</tr>"
            }
            sumV+=parseFloat(v);
            // })
          
        })
        var s= $(".bgcolor").attr("data-uid");
        html += "<tr><td class='d_l_t'>" + $("#month").datebox("getValue") + "月计划总电量</td><td class='d_l_d'>"
        html += '<input runat="server" id='+ s + '  value=' + sumV + ' onKeyUp="value = value.replace(/[^\.\d]/g,"")" class="easyui-validatebox" style="width: 195px;" /><b class="RStar">&nbsp*</b>';
          html+="  </td></tr>";
        $("#edit2pz").html(html);
        var ht = $("#pzselect").combobox("getText");
        $("#pzName").html(ht + "：");
    } else {
        $.messager.alert("提示", "请选择要编辑的行！", "info");
    }
}
function cfm() {
    var vv = 0;
    var planArr = $("input[name='pzPlan']", $("#editwin2"));
    //alert(planArr);
    for (var i = 0; i < planArr.length; i++) {
        //console.log($(planArr[i]).val());
        if ($(planArr[i]).val() != "" && $(planArr[i]).val() != null) {
            //planStr += $(planArr[i]).val() + ",";
            //pzid += $(planArr[i]).attr("data-id") + ",";
            vv += parseFloat($(planArr[i]).val());
        }
    }
    //alert(vv)
    //alert($(".bgcolor td").eq(1).html())
    //$(".bgcolor").eq(1).html()
    if ($("#" + $(".bgcolor").attr("data-uid")).val() != vv) {
        $.messager.alert("提示", "分品种电量和总电量不符，无法保存！", "info");
        return false;
    } else {
        //alert(22)
        replyConfirm();
    }
}
function replyConfirm() {
    //var fuyu = $("#fuyu").val();
    //if ($("#changgui").val() == "") {
    //    $.messager.alert("提示", "请输入常规计划！", "info");
    //    return false;
    //}
    //else if ($("#fuyu").val() == "") {
    //    fuyu = 0;

    //}
    var date = new Date;
    var year = $("#year").combobox("getValue");
    var month = $("#month").combobox("getValue");
    //var row = $('#list_data').datagrid('getSelected');
    var planStr = "";
    var pzid = "";
    var planArr = $("input[name='pzPlan']", $("#editwin2"));
    //alert(planArr);
    for (var i = 0; i < planArr.length; i++) {
        //console.log($(planArr[i]).val());
        if ($(planArr[i]).val() != "" && $(planArr[i]).val() != null) {
            planStr += $(planArr[i]).val() + ",";
            pzid += $(planArr[i]).attr("data-id") + ",";
        }
    }
    planStr = planStr.substring(0, planStr.length - 1);
    pzid = pzid.substring(0, pzid.length - 1);
    //alert(pzid);
    var postData = {
        UnitID: $(".bgcolor").attr("data-uid"),
        year: year,
        month: month,
        confirm_web: 1,
        id: 0,
        planStr: planStr,
        pzid: pzid
        //changgui: $("#changgui").val(),
        //fuyu: fuyu
    };
    console.log(postData);
    $.post("/ES/UpdatePlanView", postData, function (data) {
        //var obj = eval('(' + data + ')');
        if (data == "ok") {
            $.messager.alert("提示", "修改成功", "info");
            $("#editwin2").dialog("close");
            $("#pzhtml").html(" <tr style='height:800px; border:hidden;'><td style='text-align:center;'><p><img src='~/Content/images/logining.gif' /></p><p>正在加载...</p></td> </tr>");
            GetView();
        }
          
    });
}

//加载月份
function loadSelectMonth() {
    $('#month').combobox({
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
             }
        ], onLoadSuccess: function () { //数据加载完毕事件

            var v = getUrlParam("month");
            var data = $('#month').combobox('getData');
          
                var time = new Date();
            var m = time.getMonth() + 1;
            var m = time.getMonth() + 1;
            if (m == 12) {
                m = "1";
            }

                if (v != null) {
                    m = v;
                }
            if (data.length > 0) {
                $("#month").combobox('setValue', m);
            }
        },
        onSelect: function () {
            GetView();
        }
    });

}
function GetYear() {
    var data = [];
    var count = new Date().getFullYear();
    for (var i = 1; i <= 1; i++) {
        data.push({
            value: count - i,
            text: count - i
        })
    }
    for (var i = 0; i < 10; i++) {
        data.push({
            value: count + i,
            text: count + i
        })
    }
    return data;
}
function loadSelectYear() {
    $('#year').combobox({
        valueField: 'value',
        textField: 'text',
        editable: false,
        width: document.body.clientWidth * 0.1,
        data: GetYear(),
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#year').combobox('getData');
            var v = getUrlParam("year");
            var time = new Date();
            var m = time.getMonth() + 1;
            if (v != null) {
                $("#year").combobox('setValue', v);
            } else {
                if (m == 12) {
                    m = m + 1;
                    x = m;
                    y = time.getFullYear() + 1;
                    //console.log(y);
                    $("#year").combobox('setValue', y);
                } else {
                    y = time.getFullYear();
                    if (data.length > 0) {
                        $("#year").combobox('setValue', y);
                    }
                }
            }
        }, onSelect: function (obj) {
            GetView();
        }
    });
}

////获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}



function changePlanList() {
    var time = new Date();
    var y = time.getFullYear();

  
    //if (unit == 0) {
    //    $.messager.alert("提示", "请选择客户！", "info");
    //    return false;
    //}
    //if (year == 0) {
    //    $.messager.alert("提示", "请选择年份！", "info");
    //    return false;
    //}
    //if (month == 0) {
    //    $.messager.alert("提示", "请选择月份！", "info");
    //    return false;
    //}
    //var ss = { "year": y, "month": $("#month").datebox("getValue"), "UnitID": $(".bgcolor").attr("data-uid") };

    
    $("#editwin_plan").dialog({
        closed: false,
        top: ($(window).height() - 300) * 0.2,
        left: ($(window).width() - 600) * 0.1,
        width: $(window).width() * 0.9,
        height: $(window).height() * 0.6,
        minimizable: true, //最小化，默认false  
        maximizable: true, //最大化，默认false  
        collapsible: true, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: true//可缩放，即可以通脱拖拉改变大小，默认false 
    });
    $('#list_change').datagrid({
        url: '/ES/GetPlanChangeList?Rnum=' + Math.random(),
        queryParams: { "year": y, "month": $("#month").datebox("getValue"), "UnitID": $(".bgcolor").attr("data-uid") }
    });
}


function QuRenPlan() {
    var time = new Date();
    var y = time.getFullYear();
    $.post('/ES/GetPlanChangeList?Rnum=' + Math.random(), { "year": y, "month": $("#month").datebox("getValue"), "UnitID": $(".bgcolor").attr("data-uid") }, function (data) {
        var json = JSON.parse(data);
        var changePlan = 0;
        //alert(data.length);
        if (json.length != 0) {
            changePlan = json[0].change_plan;
            //alert(changePlan);
            if (changePlan != undefined) {
                $("#" + $(".bgcolor").attr("data-uid")).val(changePlan);
            }
        }
     
     
       $("#editwin_plan").dialog("close");
    })

 
    //var ht = $("#pzselect").combobox("getText");
    //$("#pzName").html(ht + "：");
}
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy/MM/dd hh:mm:ss');
    return lDate
}
function getConfirmWeb(value, row, index) {
    return getStr(value)
}
function getConfirmWx(value, row, index) {
    return getStr(value)
}
function getStr(value) {
    switch (value) {
        case 0:
            return "未确认";
        case 1:
            return "已确认";
        default:
            return "无";
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




//加载方法
function dosearch1() {
    //var pz1 = $("#pzselect1").combobox("getValue");
    var unit = $(".bgcolor").attr("data-uid");
    var month = $("#month").datebox("getValue");

    var year = $("#year").datebox("getValue");
    //var endTime = $("#endTime1").datebox("getValue");
    //if (pz1 == "") {
    //    pz1 = "0";
    //}
    if (unit == "") {
        unit = "0";
    }
    if (month == "") {
        month = "0"
    }
    $('#list_data1').datagrid({
        url: '/ES/GetJueceView?Rnum=' + Math.random(),
        showFooter: true,
        queryParams: { "unit": unit, "month": month,"year":year }
    });
}

function edit1() {
    var ids = [];
    var rows = $('#list_data1').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].RoleID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data1').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data1').datagrid('getSelected');
        console.log(row);
        if (row) {
            $("#SumUsePower").val(row.SumUsePower);
            $("#PlanUsePower").val(row.PlanUsePower);
            $("#id1").val(row.UUPID)
            $("#editwin5").dialog({
                closed: false,
                top: ($(window).height() - 300) * 0.5,
                left: ($(window).width() - 600) * 0.5,
                minimizable: false, //最小化，默认false  
                maximizable: false, //最大化，默认false  
                collapsible: false, //可折叠，默认false  
                draggable: false, //可拖动，默认false  
                resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
            });
            $('#list_data1').datagrid('uncheckAll');
        }
        else {
            $.messager.alert("提示", "请选择要编辑的行！", "info");
        }
    }
}
function save1() {
    if ($("#SumUsePower").val() == "") {
        $.messager.alert("提示", "请输入用电量！", "info");
        return false;
    }
    else if ($("#SumPlanUsePower").val() == "") {
        $.messager.alert("提示", "请输入计划用电量！", "info");
        return false;
    }
    var postData = {
        PlanUsePower: $("#PlanUsePower").val(),
        SumUsePower: $("#SumUsePower").val(),
        UUPID: $("#id1").val()
    };
    console.log(postData);
    $.post("/ES/SavePlanView", postData, function (data) {
        if (data == "OK") {
            $.messager.alert("提示", "操作成功！", "info");
            $("#editwin5").dialog("close");
            $("#list_data1").datagrid("reload");
            $('#list_data1').datagrid('uncheckAll');
        }
        else
            alert(data);
    });
}

function dayplan() {
    var unit = $(".bgcolor").attr("data-uid");
    var month = $("#month").datebox("getValue");
    var time = new Date();
  
    var year = time.getFullYear();
    //var month = $("#monthselect").combobox("getValue");
   
    if (unit == undefined) {
        $.messager.alert("提示", "请选择客户！", "info");
        return false;
    }
    if (year == 0) {
        $.messager.alert("提示", "请选择年份！", "info");
        return false;
    }
    if (month == 0) {
        $.messager.alert("提示", "请选择月份！", "info");
        return false;
    }
    $("#editwin6").dialog({
        closed: false,
        top: ($(window).height() - 400) * 0.5,
        left: ($(window).width() - 700) * 0.5,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
    });
    dosearch1();
}



function reply() {
    $(':input', $("#editwin_reply")).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
    $("#editwin_reply").dialog({
        closed: false,
        top: ($(window).height() - 300) * 0.5,
        left: ($(window).width() - 600) * 0.5,
        minimizable: true, //最小化，默认false  
        maximizable: true, //最大化，默认false  
        collapsible: true, //可折叠，默认false  
        draggable: true, //可拖动，默认false  
        resizable: true//可缩放，即可以通脱拖拉改变大小，默认false 
    });
}


function confirm_reply() {
    var suggest_plan = $("#suggest_plan").val();
    var suggest_first = $("#suggest_first").val();
    var suggest_second = $("#suggest_second").val();
    var suggest_third = $("#suggest_third").val();
    var suggest_fourth = $("#suggest_fourth").val();
    var suggest_remark = $("#suggest_remark").val();
   // var row = $('#list_data').datagrid('getSelected');

    var unit = $(".bgcolor").attr("data-uid");
    var month = $("#month").datebox("getValue");
    //var endTime = $("#endTime1").datebox("getValue");
    //if (pz1 == "") {
    //    pz1 = "0";
    //}
    if (unit == "") {
        unit = "0";
    }
    if (month == "") {
        month = "0"
    }
    var time=new Date();
    var year=time.getFullYear();
    var postData = {
        UnitID: unit,
        year:year,
        month: month,
        change_plan: suggest_plan,
        first_week: suggest_first,
        second_week: suggest_second,
        third_week: suggest_third,
        fourth_week: suggest_fourth,
        web_remark: suggest_remark,
        confirm_web: 1,
        confirm_wx: 0
    };
    $.post("/ES/savePlanChangeRecord", postData, function (data) {
        var obj = eval('(' + data + ')');
        if (obj.code == 0) {
            $.messager.alert("提示", obj.data, "info");
            $("#editwin_reply").dialog("close");
            $("#list_change").datagrid("reload");
            $('#list_change').datagrid('uncheckAll');
        }
        else
            alert(obj.data);
    });
}