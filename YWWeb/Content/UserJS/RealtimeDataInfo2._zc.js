var ajaxbg = top.$("#loading_background,#loading");
var Request = new Object();
Request = GetRequest();
var pid = 1, sid = 0;

if (Request['pid'] != null)
    pid = Request['pid'];
else
    pid = $.cookie('cookiepid');

showAlarmInfo();
function showAlarmInfo() {

    $.post("/PDRInfo/getRealTimeSwitchDate", { "pid": pid, "sDeviceTypeID": 1 }, function (data) {
        var pointslist = eval("(" + data + ")");
        ajaxbg.hide();
        $("#realtempinfo1").html(pointslist);
    });
}
var timeTicket;
clearInterval(timeTicket);
timeTicket = setInterval(function () {
}, 20000);     