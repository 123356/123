$("#StartDate").val(getNowFormatDate());
var Request = new Object();
Request = GetRequest();
var pid = 1, sid = 0, p = 0, StartDate = "";
StartDate = Request['StartDate'];
//if (Request['pid'] != null)
//    pid = Request['pid'];
//else
    pid = $.cookie('cookiepid');
if (null === pid) {
    pid = 1;
}
console.log("pid=" + pid)
p = Request['p'];
if (p == 2) {
    document.getElementById("PDRName").disabled = true;
    document.getElementById("StartDate").disabled = true;
    $("#bt_print").hide();
}
if (StartDate != "" && StartDate != undefined) {
    $("#StartDate").val(StartDate);
}
$("#StartDate").datebox({
    required: true,
    onSelect: function (date) {
        console.log("onSelect=" + date)
        $("#StartDate").val(date);
        getReport($("#PDRName").combobox('getValue'))
    }
});


$("#PDRName").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=0",
    valueField: 'PID',
    textField: 'Name',
    onLoadSuccess: function () {
        var data = $('#PDRName').combobox('getData');
       
        if (data.length > 0 && pid > 0) {
            $("#PDRName").combobox('setValue', pid);
        }
        getReport($("#PDRName").combobox('getValue'));
    },
    onSelect: function (data) {
        $.cookie("cookiepid", $("#PDRName").val())
        getReport($("#PDRName").combobox('getValue'))
    }
});



//$("#CName").combobox({
//    url: "/BaseInfo/BindCircuits",
//    valueField: 'CID',
//    textField: 'CName',
//    onLoadSuccess: function () {
//        var data = $('#CName').combobox('getData');
//        if (data.length > 0 && cid > 0) {
//            $("#CName").combobox('setValue', cid);
//        }
//        getReport($("#PDRName").combobox('getValue'), $("#CName").combobox('getValue'));
//    },
//    onSelect: function (data) {
//        getReport($("#PDRName").combobox('getValue'), $("#CName").combobox('getValue'))
//    }
//});

function openOrPrint() {
    console.log("p=" + p)
    if (p == 0 || p == undefined) {
        window.open('/AutoReport/index?pid=' + $("#PDRName").combobox('getValue') + "&StartDate=" + $('#StartDate').datebox('getValue') + "&p=2", '_blank')
        //p = 2;
    } else {
        printreport();
    }
}
function printreport() {
    ajaxLoadEnd()
    window.print()
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
function formatTime(datetime) {
    if (datetime != undefined && datetime.length > 0) {
        if (datetime.indexOf('T') > 0) {
            return datetime.substring(datetime.indexOf("T") + 1, datetime.length);
        }
    }
    return datetime;
}
function formatValue(value) {
    if (value == -1 || value == "-1")
        return "";
    else
        return value;
}
function getReport(pid) {
    var startdate = $('#StartDate').datebox('getValue');
    console.log("getReport,pid=" + pid + "," + startdate)
    var result = "";
    var tcount = 0;

    $.ajax({
        url: "/AutoReport/getReport",
        type: 'post',
        data: {
            "pid": pid,
            "startdate": startdate
        },
        beforeSend: ajaxLoading,
        success: function (data) {
            //var list = eval("(" + data + ")");
            var list=data.list;
            var title = "";
            for (var i = 0; i < list.length; i++) {
                tcount++;
                if (tcount == 3) {
                    title += "</div>";
                    title += "<div class=\"col-md-12 column\">";
                    if (i < list.length - 1)
                        title += "<p style=\"page-break-after:always;\"></p>";
                    tcount = 1;
                }
                //if (tcount == 1) {
                title += "<div class=\"col-md-6 column\"><table class=\"table table-condensed table-hover table-bordered\">";
                //}

                title += "<tr>\n" +
                    "            <th rowspan='3'><br><h5 class=\"text-center\">时间\\参数</h5></th>\n" +
                    "            <th colspan='8'>" + list[i].DeviceName + list[i].CName + "</th>\n" +
                    "        </tr>\n" +
                    "        <tr>\n" +
                    "            <td colspan='3'>电压("+data.Unit+")</td>\n" +
                    "            <td colspan='3'>电流(A)</td>\n" +
                    "            <td rowspan='2'>用电量(kW·h)</td>\n" +
                    "            <td rowspan='2'>功率因数</td>\n" +
                    "        </tr>\n" +
                    "        <tr>\n" +
                    "            <td>Uab</td>\n" +
                    "            <td>Ubc</td>\n" +
                    "            <td>Uca</td>\n" +
                    "            <td>A</td>\n" +
                    "            <td>B</td>\n" +
                    "            <td>C</td>\n" +
                    "        </tr>";
                // result = result + title;

                //var m = 0;
                for (var j = 0; j < list[i].list.length; j++) {
                    if (j % 2 == 1)
                        continue
                    //m += formatValue(list[i].list[j].PowerConsumption);
                    var item = "<tr>\n" +
                        "            <td>" + formatTime(list[i].list[j].RecTime) + "</td>\n" +
                        "            <td>" + formatValue(list[i].list[j].VoltageA) + "</td>\n" +
                        "            <td>" + formatValue(list[i].list[j].VoltageB) + "</td>\n" +
                        "            <td>" + formatValue(list[i].list[j].VoltageC) + "</td>\n" +
                        "            <td>" + formatValue(list[i].list[j].CurrentA) + "</td>\n" +
                        "            <td>" + formatValue(list[i].list[j].CurrentB) + "</td>\n" +
                        "            <td>" + formatValue(list[i].list[j].CurrentC) + "</td>\n" +
                        "            <td>" + formatValue(list[i].list[j].PowerConsumption) + "</td>\n" +
                        "            <td>" + formatValue(list[i].list[j].PowerFactor) + "</td>\n" +
                        "        </tr>";
                    title = title + item;
                }
                title += "</table></div>";
            }
            //title += "<tr>\n" + "<td colspan='7' class=\"text-center\">总电量</td>\n" + "<td colspan='2'>" + m.toFixed(3) + "</td>\n" + "</tr>";
            title += "</div>";
            //console.log(title);
            //$("#reporttable").html(title)
            $("#realtempinfo1").html(title);
            if (p == 2) {
                printreport();
            }
            ajaxLoadEnd()
        },
        error: function (e) {
            ajaxLoadEnd()
        }
    })
        
        
}

function ajaxLoading() {
    $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
    $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候. . . ").appendTo("body").css({ display: "block",height:"auto", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
}
function ajaxLoadEnd() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}
