loadTemplateName();
var ordersRC = [];
var ordersSY = [];

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

$("#person1").combobox({
    url: "/UserInfo/getUserInfo",
    valueField: 'UserID',
    textField: 'UserName',
    multiple: false,
    onLoadSuccess: function () {

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
             text: '工程总承包'
         }, {
             value: '2',
             text: '电力设计'
         },
         {
             value: '3',
             text: '设备产品'
         }, {
             value: '4',
             text: '运维实验'
         },
        {
            value: '5',
            text: '管理'
        },
         {
             value: '6',
             text: '系统开发'
         },
       {
           value: '7',
           text: '设计管理'
       }

    ],
    onChange: function (n, o) {
        //if (n == 1) {
        //    $("#mingcheng").show();
        //    $("#inputName").show();
        //    $("#mingcheng1").hide();
        //    $("#inputName1").hide();
        //} else {
        //    $("#mingcheng").hide();
        //    $("#inputName").hide();
        //    $("#mingcheng1").show();
        //    $("#inputName1").show();
        //}
    }
});
$("#defTemp").combobox({
    url: "/Constract/GetDefaultTemp",
    valueField: 'ID',
    textField: 'Name',
    multiple: false,
    onLoadSuccess: function () {

    }, onChange: function (n, o) {
        if ($('#defTemp').combobox('getText').indexOf("其他") != -1) {
            $("#shixiang").prop("disabled", false);
        } else {
            $("#shixiang").val("");
            $("#shixiang").prop("disabled", true);
        }
    }
});
function clickOrder(order) {
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
};




function loadUserInfo() {
    $.post("/Constract/LoadConstractInfo", { "id": id }, function (data) {
        console.log(data);
        $("#ProjectName").val(data.listPDRinfo.ProjectName);
        $("#CtrName").val(data.listPDRinfo.CtrName);
        $('#start_time').datebox('setValue', data.listPDRinfo.start_time);
        $('#end_time').datebox('setValue', data.listPDRinfo.end_time);
        $("#dayCount").val(data.listPDRinfo.dateFixCount);
        $("#testCount").val(data.listPDRinfo.testFixCount);
        try{
            $("#person").combobox('select', data.listPDRinfo.personid);
        } catch (e) { }
        try {
            $("#persons").combobox('setValues', data.listPDRinfo.personids.split(','));
        } catch (e) { }
        $("#CtrInfo").val(data.listPDRinfo.CtrInfo);

        $("#CtrPType").combobox("setValue", data.listPDRinfo.Type);
        $("#LinkMan").val(data.listPDRinfo.LinkMan);
        $("#Tel").val(data.listPDRinfo.Tel);
        $("#ConNo").val(data.listPDRinfo.ConNo);
        //if (data.listPDRinfo.ConType == 1) {
        $("#CtrPName").combobox('setValue', data.listPDRinfo.UID);
        //} else {
        //    $("#CtrAdmin").val(data.listPDRinfo.CtrAdmin);
        //}
        loadProvince(data.listPDRinfo.UnitProvince, data.listPDRinfo.UnitCity);
        // console.log(data.contemp)
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
};
$(function () {
    if (typeof (id) != "undefined") {
        conid = id;
        loadUserInfo();
        $("#Okbtn").show();
        //$("#upFile").hide();
        //$("#DownConTemp").show();
    } else {
        $("#Okbtn").hide();
        //$("#upFile").show();
        //upload6("file", 1);
        //upload6("file", 2);
        //upload6("file", 3);
        //$("#DownConTemp").hide();
    }
    loadProvince("0", "0");
    $("#btnSave").click(function () {
        if ($("#ProjectName").val() == "") {
            $.messager.alert("提示", "请输入项目名称！", "info");
            return false;
        }
        if ($("#CtrPType").combobox("getValue") == "") {
            $.messager.alert("提示", "请选择合同类型！", "info");
            return false;
        }
        if ($("#CtrName").val() == "") {
            $.messager.alert("提示", "请输入合同名称！", "info");
            return false;
        }
        //if ($("#ConNo").val() == "") {
        //    $.messager.alert("提示", "请输入合同编号！", "info");
        //    return false;
        //}
        if ($("#CtrName").val().indexOf("#") >= 0) {
            $.messager.alert("提示", "不能包含特殊字符#！", "info");
            return false;
        }

        if ($("#CtrPName").combobox("getValue") == "") {
            $.messager.alert("提示", "请选择客户名称！", "info");
            return false;
        }
        if ($("#person").combobox("getText") == "") {
            $.messager.alert("提示", "请输入负责人员！", "info");
            return false;
        }

        else if ($("#LinkMan").val() == "") {
            $.messager.alert("提示", "请输入客户联系人！", "info");
            return false;
        }
        else if ($("#Tel").val() == "") {
            $.messager.alert("提示", "请输入客户联系电话！", "info");
            return false;
        }
        else if ($("#UnitProvince").combobox("getValue") == "") {
            $.messager.alert("提示", "请选择省份！", "info");
            return false;
        }
        else if ($("#UnitCity").combobox("getValue") == "") {
            $.messager.alert("提示", "请选择地区！", "info");
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

        var xj_time = getTimeStrs(ordersRC);
        var xj_time2 = getTimeStrs(ordersSY);




        //读取工单内容
        var str1 = "";
        var str2 = "";
        var str3 = "";
        var str4 = "";
        var str5 = "";
        var str6 = "";
        var str7 = "";
        var str8 = "";
        var rows = $('#dgTemplateNameList').datagrid('getRows');
        if (rows.length < 1) {
        } else {
            var sTemp1 = [];
            var sTemp2 = [];
            var sTemp3 = [];
            var sTemp4 = [];
            var sTemp5 = [];
            var sTemp6 = [];
            var sTemp7 = [];
            var sTemp8 = [];
            for (var i = 0; i < rows.length; i++) {
                sTemp1.push(rows[i].ID);
                sTemp2.push(rows[i].Name);
                sTemp3.push(formatDate(rows[i].StartTime));
                sTemp4.push(rows[i].PersonID);
                sTemp5.push(rows[i].BeforDay);
                sTemp6.push(rows[i].IsOk);
                sTemp7.push(rows[i].EndTime)
                sTemp8.push(rows[i].DefID)
                str1 = sTemp1.join(',');
                str2 = sTemp2.join(',');
                str3 = sTemp3.join(',');
                str4 = sTemp4.join(',');
                str5 = sTemp5.join(',');
                str6 = sTemp6.join(',');
                str7 = sTemp7.join(',');
                str8 = sTemp8.join(',');
            }

        }
        //var uploadid = "";
        
        //for (var i = 1; i <= 3; i++) {
        //    if ($("#upload"+i).val() != "" && $("#upload"+i).val() != null && typeof ($("#upload"+i).val()) != "undefined") {
        //        uploadid += $("#upload" + i).val()+","
        //    }        }
        //if (uploadid != "") {
        //    uploadid = uploadid.substring(0, uploadid.length - 1);
        //}
        var personid = $("#person").combobox("getValue");
        var personids = $("#persons").combobox("getValues") + "";
        var postData = {

            id: id,
            CtrName: $("#CtrName").val(),
            // CtrAdmin: $("#CtrAdmin").val(),
            CtrInfo: $("#CtrInfo").val(),
            CtrPName: $("#CtrPName").combobox("getText"),

            UID: $("#CtrPName").combobox("getValue"),
            start_time: $("#start_time").datebox('getValue'),
            end_time: $("#end_time").datebox('getValue'),
            personid: personid,
            personids: personids,
            dateFixCount: $("#dayCount").val(),
            testFixCount: $("#testCount").val(),
            LinkMan: $("#LinkMan").val(),
            Tel: $("#Tel").val(),
            ConNo: $("#ConNo").val(),

            timesrc: xj_time,


            timesjx: xj_time2,
            ProjectName: $("#ProjectName").val(),
            UnitProvince: $("#UnitProvince").combotree("getValue"),
            UnitCity: $("#UnitCity").combobox("getValue"),
            Type: $("#CtrPType").combobox("getValue"),
            str1: str1,
            str2: str2,
            str3: str3,
            str4: str4,
            str5: str5,
            str6: str6,
            str7: str7,
            str8: str8,
            //uploadid: uploadid
        };
        console.log(postData);
        //发送异步请求，保存合同信息；
        $.post("/Constract/saveConstract", postData, function (data) {
            if (data == "OK") {
                $.messager.alert("提示", "合同编辑成功！", "info");
                $('#editwin').window('close');
            }
            else {
                $.messager.alert("提示", data, "info");
                $('#editwin').window('close');
            }
        });
    });


    $('#btnAddTemplate').bind('click', function () {
        var Name;
        if ($('#defTemp').combobox('getText') == "其他") {
            if ($('#shixiang').val() == "") {
                $.messager.alert("提示", "请输入其他事项名称！", "info");
                return false;
            } else {
                Name = $('#shixiang').val();
            }
        } else {
            if ($('#defTemp').combobox('getText') == "") {
                $.messager.alert("提示", "请选择合同项！", "info");
                return false;
            } else {
                $("#shixiang").val("");
                Name = $('#defTemp').combobox('getText');
            }
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
        $('#dgTemplateNameList').datagrid('appendRow', {
            ID: 0, Name: Name, DefID: $('#defTemp').combobox('getValue'),
            StartTime: $('#start_shixiang').datebox("getValue"), UserName: $('#person1').combobox("getText"), IsOk: 0, PersonID: $('#person1').combobox("getValue"), BeforDay: $("#numTemplate").val(),
            EndTime: $('#end_shixiang').datebox("getValue"), Remark:""
        });
    });

    $('#btnDelTemplate').bind('click', function () {
        var rows = $('#dgTemplateNameList').datagrid('getSelections');
        if (rows.length != 1) {
            $.messager.alert("提示", "请选择一行删除！", "info");
        }
        else {
            $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
                if (r) {
                    var row = $('#dgTemplateNameList').datagrid('getSelected');
                    if (row) {
                        if (row["IsDel"]) {
                            var rowIndex = $('#dgTemplateNameList').datagrid('getRowIndex', row);
                            $('#dgTemplateNameList').datagrid('deleteRow', rowIndex);
                        } else {
                            $.messager.alert("提示", "已经有反馈或者附件,无法删除！", "info");
                        }
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


function formatDate(NewDtime, row, r) {
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
};

function loadProvince(proid, cityid) {

    $('#UnitProvince').combobox({
        url: "/BaseInfo/BindPromary?rom=" + Math.random(),
        valueField: 'proID',
        textField: 'proName',
        editable: true,
        onSelect: function () {
            loadCity(cityid)
           
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


function setRemarks(val, row, r) {
    if (val == null) {
        return "";
    }
    if (val.length <= 20) {
        return val;
    }
    else if (val.length>20) {
        return val.substring(0,18)+"...";
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



function UpdateIsOk() {
    var rows = $('#dgTemplateNameList').datagrid('getSelections');
    if (rows.length != 1) {
        $.messager.alert("提示", "请选择要确认的行！", "info");
    }
    else {

        upload5('file', rows[0].ID);
        upload8('file', rows[0].ID);
        $("#editwin2").dialog({
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
}

function upload5(cname,id) {
    var fileType = '*.doc;*.docx;';
    $('#' + cname + "_upload7").uploadifive({
        'auto': false,
        'removeCompleted': true,
        'buttonText': '浏  览',                    //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/Constract/Upload2',          //处理文件上传Action
        'queueID': cname + 'Queue7',                //队列的ID
        'queueSizeLimit': 5,                      //队列最多可上传文件数量，默认为999
        'uploadLimit' : 5,
        'multi': true,                             //是否为多选，默认为true
        'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': false,
       // int fk_id,string tRemark, string ctype = "file"
        'formData': { "fk_id": id, "tRemark": ""},
        'onUploadComplete': function (file, data) {
            //$.messager.alert("提示", "上传成功！", "info");
            $.post("/Constract/UpdateContrc?Rnum=" + Math.random(), { "id": id }, function (data) {
                if (data == "OK") {
                    //$.messager.alert("提示", "操作成功", "info");

                    $.post("/Constract/LoadConstractInfo", { "id": conid }, function (data) {
                        $("#dgTemplateNameList").datagrid("loadData", data.contemp);  //动态取数据
                       // $('#dgTemplateNameList').datagrid('uncheckAll');
                    })

                }
                else {
                    $.messager.alert("提示", data, "info");
                }
            });
        }
    });
}

//function DownLoadTemp(type) {
//    var row = $('#list_data').datagrid('getSelected');
//    $.post("/Constract/GetTempMoBan?Rum=" + Math.random(), { "ConNo": row.ConNo, "type": type }, function (data) {
//        window.open(data.replace(/~/, "../.."));
//    })

//}


function upload6(cname,type) {
    var fileType = '*.doc;*.docx;';
    $('#' + cname + "_upload"+type).uploadifive({
        'auto': false,
        'buttonText': '浏  览',                    //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/Constract/Upload6',          //处理文件上传Action
        'queueID': cname + 'Queue'+type,                //队列的ID
        'queueSizeLimit': 1,                      //队列最多可上传文件数量，默认为999
        'auto': true,                              //选择文件后是否自动上传，默认为true
        'multi': true,                             //是否为多选，默认为true
        'removeCompleted': false,                  //是否完成后移除序列，默认为true
        'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': false,
        'formData': { 'folder': 'file', 'ctype': cname },
        'onUploadComplete': function (file, data) {
            var dataJson = JSON.parse(data);
            //console.log(dataJson);
            //$.messager.alert("提示", "上传成功！", "info");
            $("#upload" + type).val(dataJson.ID);
        }
    });
}




function upload8(cname, id) {
    //alert(cname);
    //alert(id);
    var fileType = '*.doc;*.docx;';
    $('#' + cname + "_upload8").uploadifive({
        'auto': false,
        'removeCompleted': true,
        'buttonText': '浏  览',                    //按钮文本
        'buttonClass': 'uploadifive-button',
        'uploadScript': '/Constract/Upload2',          //处理文件上传Action
        'queueID': cname + 'Queue8',                //队列的ID
        'queueSizeLimit': 5,                      //队列最多可上传文件数量，默认为999
        'uploadLimit': 5,
        'multi': true,                             //是否为多选，默认为true
        'fileSizeLimit': '0',                   //单个文件大小，0为无限制，可接受KB,MB,GB等单位的字符串值
        'fileType': false,
        // int fk_id,string tRemark, string ctype = "file"
        'formData': { "fk_id": id, "tRemark": "" },
        'onUploadComplete': function (file, data) {
            //$.messager.alert("提示", "上传成功！", "info");
            $.post("/Constract/UpdateContrc?Rnum=" + Math.random(), { "id": id }, function (data) {
                if (data == "OK") {
                    $('#editwin2').window('close');
                    $.messager.alert("提示", "确认事项成功", "info");

                    $.post("/Constract/LoadConstractInfo", { "id": conid }, function (data) {
                        $("#dgTemplateNameList").datagrid("loadData", data.contemp);  //动态取数据
                        //$('#dgTemplateNameList').datagrid('uncheckAll');
                    })

                }
                else {
                    $.messager.alert("提示", data, "info");
                }
            });
        }
    });
}

