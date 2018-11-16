loadMenuList();

function checkDidenable(ModuleID, obj) {
    var disenalble = "";
    for (var n = 0; n < obj.disenableModule.length; n++) {
        var right = obj.disenableModule[n];
        if (right.ModuleID === ModuleID && right.Disenable) {
            disenalble = " am-btn am-btn-default am-disabled ";
            break;
        }
    }
    return disenalble;
}
//分配按钮
function loadMenuList() {
    ///Home/MapPageBaidu 站室地图
    $.post("/Home/GetMenuInfoJson", null, function (data) {
        var obj = eval("(" + data + ")");
       

        var content = "<li class=\"sidebar-nav-link am-panel \"  style=\"background-color:transparent;border:1px solid #36414e;border-width:1px 0\">\
    <a class=\"\"  href=\"/Home/UserInfoMap\" target=\"main_frame\">\
        <i class=\"am-icon-map sidebar-nav-link-logo\"></i>监控地图\
    </a>\
    </li>";
        var disenalble = "";
        var sTarget = "main_frame";
        for (var i = 0; i < obj.length; i++) {
            var item = obj[i].moduleParent;
            if (item.Target === "IFrame") {
                sTarget = "main_frame";
            }
            else {
                sTarget = item.Target;
            }
            disenalble = checkDidenable(item.ModuleID, obj[i]);


            if (obj[i].childern.length > 0) {
                content += "<li class=\"sidebar-nav-link am-panel\" style=\"background-color:transparent; \">\
                    <a data-am-collapse=\"{parent: '#collapase-nav-1', target: '#"+ item.ModuleID + "'}\" href=\"javascript:;\" class=\"sidebar-nav-sub-title\">\
            <i class=\"sidebar-nav-link-logo\" ><img src=\"../Content/images/menu/"+ item.Icon + "\" alt=\"\" width=\"20\"  height=\"20\"></i>" + item.ModuleName + "\
            <span class=\"am-icon-angle-down am-fr am-margin-right-sm sidebar-nav-sub-ico\"></span></a>\
        <ul class=\"sidebar-nav sidebar-nav-sub am-list am-collapse \" id=\""+ item.ModuleID + "\">";

                for (var j = 0; j < obj[i].childern.length; j++) {
                    var item2 = obj[i].childern[j];
                    if (item2.Target === "IFrame") {
                        sTarget = "main_frame";
                    } else {
                        sTarget = item2.Target;
                    }
                    disenalble = checkDidenable(item2.ModuleID, obj[i]);

                    content += "<li class=\"sidebar-nav-link\" style=\"background-color:transparent;\">\
                    <a class=\" "+ disenalble + "\" style=\"text-align:left\" href=\"" + item2.Location + "\" target=\"" + sTarget + "\">\
                        <span class=\"am-icon-angle-right sidebar-nav-link-logo\"></span>"+ item2.ModuleName + "\
                    </a>\
                </li>";
                }
                content += " </ul> </li>";
            }
            else {

                content += "<li class=\"sidebar-nav-link am-panel\" style=\"background-color:transparent;\">\
                            <a class=\" " + disenalble + "\" style=\"text-align:left\" href=\"" + item.Location + "\" target=\"" + sTarget + "\">\
            <i class=\" sidebar-nav-link-logo\"><img src=\"../Content/images/menu/"+ item.Icon + "\" alt=\"\" width=\"20\" height=\"20\"></i>" + item.ModuleName + "\
        </a>\
    </li>";
            }

        }
        $("#collapase-nav-1").html(content);
      
        ClickColor();
    });

}
function ClickColor() {
  
  /*  $("#collapase-nav-1 li a").on('click', function () {
        
        $("#collapase-nav-1 li").find("a").attr("style", "background-color:#36414e;border: #36414e;")
        $(this).attr("style", "background-color:#40af94; border: #40af94;color:#fff")
       
    })
    */
}