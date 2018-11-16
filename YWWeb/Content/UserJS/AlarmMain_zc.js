$("#currPosition", window.parent.document).html("当前位置：报警管理");

var url = window.location.pathname;
$.post("/Home/GetChildMenuInfo", { "url": url }, function (data) {
    $("#menuInfo").html(data);
    $("#menuInfo li").eq(i).click();
});
function setIframeUrl(url, id) {
    if (url.indexOf("PlanInfo") != -1 || url.indexOf("OneGraph") != -1) {
        if (url.indexOf('SHOneGraph') < 0) {
            if (pid > 110 && pid < 122)
                url = url + 111;
            else
                url = url + pid;
        }
    }
    $("#menuInfo li").removeClass('current');
    $("#sysContent").attr('src', url);
    $("#m" + id).addClass('current');
}