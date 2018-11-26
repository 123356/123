
var ordersRC = []
var ordersSY = []

$('#cs_xj_time').datebox({
});

$('#cs_xj_time2').datebox({
});
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

$("#persons").combobox({
    url: "/UserInfo/getUserInfo",
    valueField: 'UserID',
    textField: 'UserName',
    multiple: true,
    onLoadSuccess: function () {

    }
});



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
$("#CtrPType").combobox({
    valueField: 'value',
    textField: 'text',
    editable: false,
    width: 200,
    data: [
         {
             value: '1',
             text: '承包'
         }, {
             value: '2',
             text: '售电'
         },
         {
             value: '3',
             text: '设计'
         }, {
             value: '4',
             text: '运维'
         }

    ],
    onChange: function (n, o) {
    }
});
function loadUserInfo() {
    $.post("/Constract/LoadConstractInfo", { "id": id }, function (data) {
        console.log(data);
        $("#ProjectName").val(data.listPDRinfo.ProjectName);
        $("#CtrName").val(data.listPDRinfo.CtrName);
        $('#start_time').datebox('setValue', data.listPDRinfo.start_time);
        $('#end_time').datebox('setValue', data.listPDRinfo.end_time);
        $("#dayCount").val(data.listPDRinfo.dateFixCount);
        $("#testCount").val(data.listPDRinfo.testFixCount);
        try {
            $("#person").combobox('select', data.listPDRinfo.personid);
        } catch (e) { }
        try {
            $("#persons").combobox('setValues', data.listPDRinfo.personids.split(','));
        } catch (e) { }
        $("#CtrInfo").val(data.listPDRinfo.CtrInfo);
        $("#LinkMan").val(data.listPDRinfo.LinkMan);
        $("#Tel").val(data.listPDRinfo.Tel);
        $("#CtrPName").combobox('setValue', data.listPDRinfo.UID);
        $("#ConNo").val(data.listPDRinfo.ConNo);
        $("#CtrPType").combobox("setValue", data.listPDRinfo.Type);
        loadProvince(data.listPDRinfo.UnitProvince, data.listPDRinfo.UnitCity);
        var html = "";
        $.each(data.result, function (index, val) {
            // html += "<p onclick='download(this)' style='cursor:pointer;color:blue;' data-name=" + val.SaveName + " data-path=" + val.FilePath + ">" + val.Name + "</p>";
            html += "<tr>"
            html += "<td>" + data.listPDRinfo.ConNo + "_" + (index + 1) + "</td>"
            html += "<td onclick='download(this)' style='cursor:pointer;color:blue;' data-name=" + val.SaveName + " data-path=" + val.FilePath + ">" + val.Name + "</td>"
            html += "<td>" + val.ConTempName + "</td>"
            html += "<td>"+val.UserName+"</td>"
            html += "<td>" + formatDate(val.CreatTime) + "</td>"
            html += "</tr>"
        })
        $("#content").html(html);
        $("#dgTemplateNameList").datagrid("loadData", data.contemp);  //动态取数据
        var matters = [];
        for (var i = 0; i < data.contemp.length; i++) {
            var val = data.contemp[i];
            var item = document.createElement('div');
            switch (val.IsOk) {
                case 0:
                    item.innerHTML = '<button  onclick="OpenDetali(' + val.ID + ')" style="color: #ff0100"> ' + val.Name + '</button>';
                    break;
                default://OpenDetali(rowData.ID)
                    item.innerHTML = '<button  onclick="OpenDetali(' + val.ID + ')" style="color: #006600"> ' + val.Name + '</button>';
                    break;
            }   
            matters.push({ id: val.ID, content: item, start: formatDate(val.StartTime), end: formatDate(val.EndTime) })
        }
        var container = document.getElementById('visualization');
        var items = new vis.DataSet(matters);
        var options = {};
        var timeline = new vis.Timeline(container, items, options);
    })
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
                $.post("/Constract/UpdateContrc?Rnum=" + Math.random(), { "id": ids.join(',') }, function (data) {
                    if (data == "OK") {
                        $.messager.alert("提示", "操作成功", "info");

                        $.post("/Constract/LoadConstractInfo", { "id": id }, function (data) {
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


//下载
function download(obj) {
    var filePath = $(obj).attr("data-path");
    $.post("/Constract/IsExistFilePath?filePathName=" + filePath, function (data) {
        if (data == "success") {
            window.open($(obj).attr("data-path").replace(/~/, "../.."));
            //window.location.reload();
        }
        else {
            $.messager.alert("提示", "所下载资源不存在！", "info");
        }
    });
}

function OpenDetali(id) {
    $('#detailwin').window({
        title: "事项详细信息",
        modal: true,
        top: ($(window).height() - 600) * 0.5,
        left: ($(window).width() - 800) * 0.5,
        href: '/Constract/YunYingDetaliView?id=' + id,
        onClose: function () { }
    });
    $('#detailwin').window('open');
}
function setRemarks(val, row, r) {
    if (val == null) {
        return "";
    }
    if (val.length <= 20) {
        return val;
    }
    else if (val.length > 20) {
        return val.substring(0, 18) + "...";
    } else {
        return "未完成";
    }
}
function setState(val, row, r) {
    if (val == 1) {
        return "已完成";
    }
    else if (val == 2) {
        return "未完成";
    } else {
        return "未完成";
    }
}

function loadProvince(proid, cityid) {

    $('#UnitProvince').combobox({
        url: "/BaseInfo/BindPromary?rom=" + Math.random(),
        valueField: 'proID',
        textField: 'proName',
        editable: true,
        onSelect: function () {
            loadCity(cityid);
        },
        onLoadSuccess: function () { //数据加载完毕事件
            if (cityid != "0") {
                $("#UnitProvince").combobox('select', proid);
            }
            else {
                loadCity("0");
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
        },
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#UnitCity').combobox('getData');
            $.each(data, function (index, val) {
                if (val.cityID == cityid) {
                    $("#UnitCity").combobox('setValue', cityid);
                }
            })
        }
    });
}
function DownLoadTemp(type) {
    //var row = $('#list_data').datagrid('getSelected');
    $.post("/Constract/GetTempMoBan?Rum=" + Math.random(), { "ConNo": $("#ConNoNov").val(), "type": type }, function (data) {
        window.open(data.replace(/~/, "../.."));
    })

}


function addhanjian(type) {
    clearForm7();
   
    $("#ConNamev").val($("#CtrName").val());
    $("#ConNoNov").val($("#ConNo").val());
    $("#idv").val(id);
    $("#typev").val(type);
        //GetConTemp(row.id);
       // upload7('file');
        $("#editwin7").dialog({
            closed: false,
            top: ($(window).height() - 500) * 0.5,
            left: ($(window).width() - 700) * 0.5,
            minimizable: false, //最小化，默认false  
            maximizable: false, //最大化，默认false  
            collapsible: false, //可折叠，默认false  
            draggable: true, //可拖动，默认false  
            resizable: false//可缩放，即可以通脱拖拉改变大小，默认false 
        });
   
}


//function upload7(cname) {
//    var fileType = '*.doc;*.docx;';
//    $('#' + cname + "_upload9").uploadifive({
//        'auto': false,
//        'buttonText': '浏  览',                    //按钮文本
//        'buttonClass': 'uploadifive-button',
//        'uploadScript': '/Constract/Upload7',          //处理文件上传Action
//        'queueID': cname + 'Queue9',                //队列的ID
//        'queueSizeLimit': 1,                      //队列最多可上传文件数量，默认为999
//        'auto': true,                              //选择文件后是否自动上传，默认为true
//        'multi': true,                             //是否为多选，默认为true
//        'removeCompleted': false,                  //是否完成后移除序列，默认为true
//        'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
//        'fileType': false,
//        'formData': { 'folder': 'file', 'ctype': cname, "conid": $("#idv").val()},
//        'onUploadComplete': function (file, data) {
//            var dataJson = JSON.parse(data);
//            //console.log(dataJson);
//            //$.messager.alert("提示", "上传成功！", "info");
//            $("#upload").val(dataJson.ID);
//            $.messager.alert("提示", "上传成功！", "info");
//        }
//    });
//}
function Tijiao() {

    var postData = {

        //uploadid:   $("#upload").val(),
        Name: $("#Namev").val(),
        StartTime: $("#StartTimeV").datebox("getValue"),
        ConNo: $("#ConNo").val(),
        conid: $("#idv").val(),
        type:$("#typev").val()
    };
    console.log(postData);
    $.post("/Constract/addhanjian", postData, function (data) {
        window.open(data.replace(/~/, "../.."));
        //if (data == "OK") {
        //    $.messager.alert("提示", "保存成功！", "info");
        //    $.post("/Constract/LoadConstractInfo", { "id": id }, function (data) {
        //        $("#dgTemplateNameList").datagrid("loadData", data.contemp);  //动态取数据
        //        //$('#dgTemplateNameList').datagrid('uncheckAll');
        //    })
        //    $('#editwin7').window('close');
        //}
        //else {
          
        //}
    });
}


function clearForm7() {
    $(':input', editwin7).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase();
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden') {
            this.value = "";
        }
    });
}
