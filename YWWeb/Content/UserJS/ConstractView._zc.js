loadTemplateName()
var ordersRC = []
var ordersSY = []

$('#cs_xj_time').datebox({
});

$('#cs_xj_time2').datebox({
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
    onChange: function (n, o) {
        if (n == 1) {
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
    }
});
function OrderDetail(orderid) {
    console.log(orderid)
    if (orderid > 0) {
        $('#detailwin').window({
            modal: true,
            top: ($(window).height() - 600) * 0.5,
            left: ($(window).width() - 800) * 0.5,
            draggable: true, //可拖动，默认false
            resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false
            href: '/OrderInfo/OrderDetail?orderid=' + orderid,
            onClose: function () {
            }
        });
        $('#detailwin').window('open');
    }
    else {
        $.messager.alert("提示", "请选择要查看的工单！", "info");
    }
}

function OpenFrameOrder(order) {
    console.log(order.CtrInfoId)
    console.log(order.id1)
    $('#editwin2').window({
        modal: true,
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        draggable: true, //可拖动，默认false
        resizable: false, //可缩放，即可以通脱拖拉改变大小，默认false
        href: '/OrderInfo/OrderEditByConstract?CtrOrderId=' + order.id1,
        onClose: function () {
            loadUserInfo();
        }
    });
    $('#editwin2').window('open');
}

function setTable(text, ida) {
    console.log(text)
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
                        result = result + "<tr><th>" + i + "、" + ss[t] + "</th><td><button onclick=\"clickOrder('" + ss[t] + "')\">未下发</button></td></tr>"
                    else
                        result = "<tr><th>" + i + "、" + ss[t] + "</th><td><button onclick=\"clickOrder('" + ss[t] + "')\">未下发</button></td></tr>"
                    i++;
                }
            }
        }
        result = "<table style=\"text-align:left\">" + result + "</table>"
        ida.html(result);
    }
}

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
    console.log(order)
    console.log(order.id1)
    OpenFrameOrder(order);
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
//获取指定格式的时间字符串
function GetTimeByFormate(time, row, r) {
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
$("#CtrPName").combobox({
    url: "/ES/UnitComboData?isall=" + "false",
    valueField: 'UnitID',
    textField: 'UnitName',
    editable: true,
    onLoadSuccess: function () { //数据加载完毕事件
        var data = $('#CtrPName').combobox('getData');
        if (data.length > 0) {
            $("#CtrPName").combobox('select', data[0].UnitID);
        }
    },
    onSelect: function (data) {
        $.cookie('cookiepid', data.PID, { expires: 7, path: '/' });
    }
});
function loadUserInfo() {
    $.post("/Es/LoadConstractInfo", { "id": id }, function (data) {
        $("#CtrName").val(data.listPDRinfo.CtrName);
        $('#start_time').datebox('setValue', GetTimeByFormate(data.listPDRinfo.start_time));
        $('#end_time').datebox('setValue', GetTimeByFormate(data.listPDRinfo.end_time));
        $("#dayCount").val(data.listPDRinfo.dateFixCount);
        $("#testCount").val(data.listPDRinfo.testFixCount);
        $("#person").combobox('select', data.listPDRinfo.person);
        $("#CtrInfo").val(data.listPDRinfo.CtrInfo);
        $("#CtrPType").combobox("setValue", data.listPDRinfo.ConType);
        $("#LinkMan").val(data.listPDRinfo.LinkMan);
        $("#Tel").val(data.listPDRinfo.Tel);
        if (data.listPDRinfo.ConType == 1) {
            $("#CtrPName").combobox('setValue', data.listPDRinfo.UID);
        } else {
            $("#CtrAdmin").val(data.listPDRinfo.CtrAdmin);
        }
        var html = "";

        $.each(data.result, function (index, val) {
            var PriceSum = 0;
            var planSum = 0;
            html += '<table cellpadding="" cellspacing="" border="1" class="d_list">';
            html += ' <caption id="titleName">' + val[0].category_name + '</caption>';
            html += ' <thead>'
            html += '<tr>'
            html += '<th>月份</th>'
            html += '<th>交易电量(MW·H)</th>'
            html += '<th>交易电价(元/MW·H)</th>'
            html += '</tr>'
            html += ' </thead>'
            html += '<tbody>'
            $.each(val, function (index1, val1) {
                var p = (val1.price == null ? 0 : val1.price);
                var c = (val1.val == null ? 0 : val1.val);
                html += "<tr>";
                html += "<td>" + val1.month + "月</td>";
                html += "<td>" + val1.val + "</td>";
                html += "<td>" + (val1.price == null ? 0 : val1.price.toFixed(4)) + "</td>";
                html += "</tr>";
                PriceSum += p;
                planSum += c;
            })
            html += "<tr><td>总计</td><td>" + planSum + "</td><td>" + PriceSum.toFixed(4) + "</td></tr>";
            html += '</tbody>'
            html += '</table>'
        })
        $("#content").html(html);
        $("#dgTemplateNameList").datagrid("loadData", data.contemp);  //动态取数据
    })
}


function GetPlanByMonth() {
    $.post("/Es/GetPlanByMonth", { 'id': id }, function (data) {
        if (data == "OK") {
            $.messager.alert("提示", "合同编辑成功！", "info");
            $('#editwin').window('close');
        }
        else {
            alert(data);
            $('#editwin').window('close');
        }
    });
}
$(function () {
    loadUserInfo();
});
//全取图标
function Get_Menu_Img(img) {
    $("#Img_Menu_Img").attr("src", '/Content/Images/Logo/' + img);
    $("#Menu_Img").val(img);
}
function formatDate(NewDtime, row, r) {
    if (NewDtime == null) {
        return "";
    }
    if (NewDtime.indexOf("Date") != -1) {
        var dt = new Date(parseInt(NewDtime.slice(6, 19)));
        var year = dt.getFullYear();
        var month = dt.getMonth() + 1;
        var date = dt.getDate();
        var hour = dt.getHours();
        var minute = dt.getMinutes();
        var second = dt.getSeconds();
        return year + "-" + month + "-" + date;
    }
    else {
        return NewDtime
    }
}

function UpdateIsOk() {
    var rows = $('#dgTemplateNameList').datagrid('getSelections');
    if (rows.length < 1) {
        $.messager.alert("提示", "请选择要确认的行！", "info");
    }
    else {
        $.messager.confirm('提示', '你确定要完成所选项？', function (r) {
            if (r) {
                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].ID);
                }
                $.post("/ES/UpdateContrc?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        $.messager.alert("提示", "操作成功", "info");

                        $.post("/Es/LoadConstractInfo", { "id": id }, function (data) {
                            $("#dgTemplateNameList").datagrid("loadData", data.contemp);  //动态取数据
                            $('#dgTemplateNameList').datagrid('uncheckAll');
                        })

                    }
                    else {
                        $.messager.alert("提示", data, "info");
                    }
                });
            }
        })
    }
}