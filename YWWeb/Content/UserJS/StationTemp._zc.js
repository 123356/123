
$(function () {
    //$("#currPosition", window.top.document).html("当前位置：电力交易 > 总览信息录入 ");
    //loadSelectPDF(0);
    //loadSelectPDFTemp();
    //GetData();
    GetUnit();
})


function GetUnit() {
    $("#unit").combobox({
        url: "/ES/UnitComboData?isall=" + "false",
        valueField: 'UnitID',
        textField: 'UnitName',
        editable: true,
        width: 200,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#unit').combobox('getData');
            if (data.length > 0) {
                $("#unit").combobox('setValue', data[0].UnitID);
            }
        },
        onChange: function (n) {
            dosearch();
        }
    });
}

//////加载配电房下拉框
//function loadSelectPDF(pid) {
//    if (pid != "0") {
//        $("#PDF").combobox({
//            url: "/ES/PDRComboData?isall=" + "false",
//            valueField: 'PID',
//            textField: 'Name',
//            editable: true,
//            width: 260,
//            onLoadSuccess: function () { //数据加载完毕事件
//                var data = $('#PDF').combobox('getData');
//                if (data.length > 0) {
//                    $("#PDF").combobox('select', pid);
//                }
//            }
//        });
//    } else {
//        $("#pdfselect").combobox({
//            url: "/ES/PDRComboData?isall=" + "false",
//            valueField: 'PID',
//            textField: 'Name',
//            editable: true,
//            width: 260,
//            onLoadSuccess: function () { //数据加载完毕事件
//                var data = $('#pdfselect').combobox('getData');
//                if (data.length > 0) {
//                    $("#pdfselect").combobox('select', data[0].PID);
//                }
//            },
//            onChange: function (n, o) {
//                dosearch();
//            }
//        });
//    }
//}


//////加载配电房下拉框
//function loadSelectPDFTemp() {

//    $("#TempName").combobox({
//        url: "/ES/PDFtempComboData?isall=" + "false",
//        valueField: 'id',
//        textField: 'TypeName',
//        editable: true,
//        width: 200,
//        onLoadSuccess: function () { //数据加载完毕事件
//        }
//    });

//}

////加载方法
//function dosearch() {

//    var pdf = $("#pdfselect").combobox("getValue");

//    if (pdf == "") {
//        pdf = "0";
//    }

//    $('#list_data').datagrid({
//        url: '/ES/GetStationTemp?Rnum=' + Math.random(),
//        queryParams: { "pdf": pdf }
//    });
//    $('#list_data').datagrid('uncheckAll');
//}
//function add() {
//    clearForm();
//    $("#editwin").dialog({
//        closed: false,
//        top: ($(window).height() - 300) * 0.5,
//        left: ($(window).width() - 600) * 0.5,
//        minimizable: false, //最小化，默认false
//        maximizable: false, //最大化，默认false
//        collapsible: false, //可折叠，默认false
//        draggable: true, //可拖动，默认false
//        resizable: false//可缩放，即可以通脱拖拉改变大小，默认false
//    });
//    //添加时默认选择客户
//    var pid = $("#pdfselect").combobox("getValue");
//    loadSelectPDF(pid)
//}
//function edit() {
//    var ids = [];
//    var rows = $('#list_data').datagrid('getSelections');
//    for (var i = 0; i < rows.length; i++) {
//        ids.push(rows[i].RoleID);
//    }
//    if (ids.length > 1) {
//        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
//        $('#list_data').datagrid('uncheckAll');
//    }
//    else {
//        var row = $('#list_data').datagrid('getSelected');
//        if (row) {
//            loadSelectPDF(row.pid);
//            //$("#PDF").combobox("setValue", row.pid);
//            $("#TempName").combobox("setValue", row.TypeName);
//            $("#id").val(row.id)
//            $("#editwin").dialog({
//                closed: false,
//                top: ($(window).height() - 300) * 0.5,
//                left: ($(window).width() - 600) * 0.5,
//                minimizable: false, //最小化，默认false
//                maximizable: false, //最大化，默认false
//                collapsible: false, //可折叠，默认false
//                draggable: true, //可拖动，默认false
//                resizable: false//可缩放，即可以通脱拖拉改变大小，默认false
//            });
//            $('#list_data').datagrid('uncheckAll');
//        }
//        else {
//            $.messager.alert("提示", "请选择要编辑的行！", "info");
//        }
//    }
//}
//function save() {
//    if ($("#PDF").combobox("getValue") == "") {
//        $.messager.alert("提示", "请选择站！", "info");
//        return false;
//    }
//    else if ($("#TempName").combobox("getValue") == "") {
//        $.messager.alert("提示", "请选择项！", "info");
//        return false;
//    }
//    var postData = {
//        pid: $("#PDF").combobox("getValue"),
//        contentId: $("#TempName").combobox("getValue"),
//        id: $("#id").val()
//    };
//    console.log(postData);
//    $.post("/ES/SaveStation", postData, function (data) {
//        if (data == "OK") {
//            $.messager.alert("提示", "操作成功！", "info");
//            $("#editwin").dialog("close");
//            $("#list_data").datagrid("reload");
//            $('#list_data').datagrid('uncheckAll');
//        }
//        else
//            alert(data);
//    });
//}
//function Delete() {
//    var rows = $('#list_data').datagrid('getSelections');
//    if (rows.length < 1) {
//        $.messager.alert("提示", "请选择要删除的行！", "info");
//    }
//    else {
//        $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
//            if (r) {
//                var ids = [];
//                for (var i = 0; i < rows.length; i++) {
//                    ids.push(rows[i].id);
//                }
//                $.post("/ES/DeleteStation?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
//                    if (data == "OK") {
//                        $.messager.alert("提示", "操作成功", "info");
//                        $("#list_data").datagrid("reload");
//                        $('#list_data').datagrid('uncheckAll');
//                    }
//                    else {
//                        $.messager.alert("提示", data, "info");
//                    }
//                });
//            }
//        })
//    }
//}


//function clearForm() {
//    $(':input', editwin).each(function () {
//        var type = this.type;
//        var tag = this.tagName.toLowerCase();
//        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
//            this.value = "";
//        }
//    });
//}

function dosearch() {
    $.post("/Home/GetScoreByUID", { uid: $("#unit").combobox("getValue") }, function (data) {
        console.log(data);
        var html = "";
        var inn = 1;
        $.each(data, function (index, val) {
            var ind = 0;
         
            $.each(val.Ldata, function (i, v) {
                if(val.key!=4){
                    html += "<tr onClick='ClickTr(this)' data-typeid=" + v.ID + ">"}
                else
                    html += "<tr data-typeid=" + v.ID + ">"
                html += "<td>" + inn + "</td>";
                if (ind == 0) {
                    html += "<td rowspan=" + val.Ldata.length + ">" + val.keyName + "</td>"
                } else {
                    html += "<td style='display:none;'></td>"
                }
                var vv = (v.Score == null || v.Score == "") ? 0 : v.Score;
                var result = (v.Result == null || v.Result == "") ? "无" : v.Result;
                html += "<td>" + v.Name + "</td>"
                html += "<td>" + v.Remarks + "</td>"
                html += "<td>" + v.Fullmarks + "</td>"
                if (val.key != 4) {
                    html += "<td onClick='Add(this)' data-typeid=" + v.ID + " data-val=" + vv + " data-zongfen=" + v.Fullmarks + ">" + vv + "</td>"
                    html += "<td onClick='Add(this)' data-typeid=" + v.ID + " data-val=" + vv + " data-zongfen=" + v.Fullmarks + " data-r="+result+">" + result + "</td>"
                }
                else {
                    html += "<td data-typeid=" + v.ID + " data-val=" + vv + " data-zongfen=" + v.Fullmarks + ">" + vv + "</td>"
                    html += "<td data-typeid=" + v.ID + " data-val=" + vv + " data-zongfen=" + v.Fullmarks + ">" + result + "</td>"
                }
                html += "</tr>"
                ind++;
                inn++
            })
        })
        $("#lst").html(html);
    })
}



function ClickTr(obj) {

    var val5 = $(obj).find("td").eq(5).attr("data-val");
    var val6 = $(obj).find("td").eq(6).attr("data-r");
   
    $(obj).siblings().removeClass("bgcolor");
    if ($(obj).hasClass("bgcolor")) {
        $(obj).removeClass("bgcolor");
        $(obj).find("td").eq(5).html(val5);
        $(obj).find("td").eq(6).html(val6);
    } else {
        var u = $("#unit").combobox("getValue")
        var t = $(obj).attr("data-typeid");
        $(obj).addClass("bgcolor");
        $(obj).find("td").eq(5).html("<input type='text' id=" + u + t + '5' + " value=" + val5 + " />");
        $(obj).find("td").eq(6).html("<input type='text' id=" + u + t + '6' + " value=" + val6 + " />");
        $("#"+u+t+"5").click(function (event) {
            event.stopPropagation();

        });
        $("#" + u + t + "6").click(function (event) {
            event.stopPropagation();

        });
    }
}

//function Add(obj) {
   
//    var v = $(obj).attr("data-val");
//    var z = $(obj).attr("data-zongfen");
//    //alert(u);
//    //alert(t);
//    //var v = $(obj).attr("data-val");
//    //$("#uid").val(u);
//    //$("#pzid").val(p);
//    $(obj).html("<input type='text' id=" + u + t + " data-uid=" + u + " data-typeid=" + t + " data-zongfen=" + z + " onBlur='tijiao(this);' />");
//    $("#" + u + t).val(v);
  
//    //alert($("#" + u + t).val());
//    $("#" + u + t).focus();
//}
function SaveForm() {
    var u = $("#unit").combobox("getValue")
    var t = $(".bgcolor").attr("data-typeid");

    var val=$("#"+u+t+"5").val();
    var result=$("#"+u+t+"6").val();
    var z = $(".bgcolor").find("td").eq(4).html();
    if (val <= z) {
        $.messager.confirm('提示', '你确定要保存吗？', function (r) {
            if (r) {
                //$(obj).parent().attr("data-val", $(obj).val());
                //$(obj).parent().html("<td>" + $(obj).val() + "</td>")
                var data = {
                    'val': val,
                    'uid':  u,
                    'typeid': t,
                    'remarks': result
                }
                $.post('/Home/SaveUnitScore', data, function (mes) {
                    $.messager.alert("提示", mes, "info");
                    $("#" + u + t + "5").parent().html(val);
                    $("#" + u + t + "6").parent().html(result);
                })
            } else {
                //$(obj).parent().html("<td>" + $(obj).val() + "</td>")
            }
        })
    } else {
        $.messager.alert("提示", "该项最多" + z + "分！", "info");
        $("#" + u + t).focus();
    }
}