var filedata;
if (bugid > 0) {
    $.post("/PerationMaintenance/GetHazardManDetail", { "bugid": bugid }, function (data) {
        var row = eval("(" + data + ")");
        if (row.DID > 0) {
            $.post("/DeviceManage/DeviceDetail", { "did": row.DID }, function (data) {
                var row = eval("(" + data + ")");
                $("#DeviceName").html(row.DeviceName);
                $("#DeviceModel").html(row.DeviceModel);
                $("#voltageGrade").html(row.J);
                $("#InstallAddr").html(row.InstallAddr);
            });
        }

        $("#ReportDate").html(formatDate(row.ReportDate, 'yyyy-MM-dd hh:mm:ss'));
        $("#ReportWay").html(row.ReportWay);
        $("#HandleDate").html(formatDate(row.HandleDate, 'yyyy-MM-dd hh:mm:ss'));
        $("#UserName").html(row.UserName);
        $("#BugLocation").html(row.BugLocation);
        $("#BugDesc").html(row.BugDesc);
        $("#ReportUser").html(row.ReportUser);
        $("#Situation").html(row.HandeSituation);
    });
    //检查信息
    $("#sel_checktime").combobox({
        url: "/PerationMaintenance/GetOrders?Bid=" + bugid,
        valueField: 'id',
        textField: 'text',
        width: 200,
        onSelect: function (node) {
            if (node == "")
                return false;
            $("#roll").html("");
            $("#divVideo").html("");
            $("#divVideoX").html("");
            $.post("/PerationMaintenance/GetFile", { "FKid": node.id, "FKtype": "order" }, function (data) {
                filedata = eval("(" + data + ")");
                for (var i = 0; i < filedata.length; i++) {
                    if (filedata[i].FileType == "image") {
                        $("#roll").append("<a onclick='ShowImage(\"" + filedata[i].FilePath + "\")' href='#'><img src='" + filedata[i].FilePath + "'  height='50px' width='50px'/></a>");
                    }
                    else if (filedata[i].FileType == "voice") {
                        $("#divVideo").append("<div id='content" + i + "' style='float: left;'></div>");
                        showVideo('content' + i, filedata[i].FilePath, 200, 30, '3gp', i);
                    }
                    else if (filedata[i].FileType == "infrared") {
                        $("#divVideoX").append("<div id='content" + i + "' style='float: left;'></div>");
                        showVideo('content' + i, filedata[i].FilePath, 200, 30, 'mp4', i);
                    }
                }
            });
        },
        onLoadSuccess: function () {
            var data = $('#sel_checktime').combobox('getData');
            if (data != "")
                $("#sel_checktime").combobox('select', data[0].id);
        }
    });
}

//视频播放
function showVideo(o, s, w, h, t, i) { //t文件格式
    var _html = '';
    if ($.inArray(t, ['ogg', 'mp4', 'webm']) >= 0) { //html5 surport
        _html = '<img src=\"../content/images/videoicon.png\" width=\"25px\" height=\"25px\" onclick = Full("' + s + '")>';
        $('#' + o).html(_html);
    } else { //other like 3gp
        _html += '<audio src=' + s + ' controls=\"controls\"></audio>';
        $(o).css({ "width": w + 'px', 'height': h + 'px', 'cursor': 'default' });
        $(o).html(_html);
        $("#content" + i).html(_html);
    }
}
function Full(src) {

    $('#videowin').window({
        width: document.body.clientWidth * 0.4,
        height: document.body.clientHeight * 0.6,
        top: 10,
        onBeforeOpen: function () {
            var myVideo = document.getElementById("vedio1");
            myVideo.src = src;
        }
    });
    $('#videowin').window('open');
}
//图片查看
function ShowImage(src) {
    $('#imgwin').window({
        width: document.body.clientWidth * 0.4,
        height: document.body.clientHeight * 0.6,
        top: 10,
        onBeforeOpen: function () {
            var myVideo = document.getElementById("img1");
            myVideo.src = src;
        }
    });
    $('#imgwin').window('open');

}


//缺陷处理情况等级
$('#HandeS').combobox({
    valueField: 'value',
    textField: 'text',
    editable: false,

    data: [{
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

function save() {
    if ($("#HandeS").combotree("getValue") == "") {
        $.messager.alert("提示", "请选择处理情况！", "info");
        return false;
    }
    var postData = {
        BugID: bugid,
        HandeSituation: $("#HandeS").combotree("getValue")
    }
    $.post("/PerationMaintenance/SaveBugInfo", postData, function (data) {
        if (data == "OKedit") {
            $.messager.alert("提示", "缺陷确认成功！", "info");
            window.location.reload();
        }
        else
            alert(data);
    });
}