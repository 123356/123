var url = window.location.pathname;
var docount = 0;
//除首页以外，其他均显示“二级菜单”
//alert(url);
if (url.indexOf("MapPage") == -1) {
//    $("#left_sidebar", window.parent.document).css({ "display": "block", "width": "72px" });
//    //判断是否包含配电房或者设备树的显示
//    var mainwidth = window.screen.width - 72;
//    $("#main_frame", window.parent.document).css("left", "72px");
//    $("#main_frame", window.parent.document).css("width", mainwidth);
    //获取二级菜单列表
    $.post("/Home/GetChildMenuInfo", { "url": url }, function (data) {
        $("#left_sidebar", window.parent.document).html(data);
        //$("#SecondMenu li:first").click();
    });
}
else {
    $("#left_sidebar", window.parent.document).css({ "display": "none", "width": "0px" });
    var mainwidth = window.screen.width;
    $("#main_frame", window.parent.document).css({ "width": mainwidth, "left": "0px" });
}
