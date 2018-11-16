$(function () {

    loadDeviceInfo();
    loadFile();
});
function loadDeviceInfo() {
    $.post("/DeviceManage/DeviceDetail", { "did": did }, function (data) {
        var info = eval("(" + data + ")");
        $("#tDeviceCode").html(info.DeviceCode);
        $("#tDeviceName").html(info.DeviceName);
        $("#tPName").html(info.PName);
        $("#tDeviceModel").html(info.DeviceModel);
        $("#tDTID").html(info.DeviceType);
        $("#tDSTID").html(info.DeviceStructureType);
        $("#tMLID").html(info.MajorLevel);
        $("#tMFactory").html(info.MFactory);
        $("#tFactoryNumber").html(info.FactoryNumber);
        setDateVale("tUseDate", info.UseDate);
        setDateVale("tBuyTime", info.BuyTime);
        setDateVale("tLastMtcDate", info.LastMtcDate);
        setDateVale("tBuildDate", info.BuildDate);
        $("#tInstallAddr").html(info.InstallAddr);
        var UseState
        if (info.UseState == 0)
            UseState = "正常使用";
        else
            UseState = "暂停使用";
        $("#tUseState").html(UseState);
        $("#tCompany").html(info.Company);
        $("#tRemarks").html(info.Remarks);
    });
}

function setDateVale(dkey, dvalue) {
    var LastMtcDate = dvalue;
    if (LastMtcDate != null)
        LastMtcDate = new Date(LastMtcDate).Format("yyyy-MM-dd");
    $("#" + dkey).html(LastMtcDate);
}
function loadFile() {
    $.post("/DeviceManage/DeviceFiles", { "did": did }, function (data) {
        $("#flies").html(data);
    });
}
function ShowImage(id, did) {
    var src = $("#img" + id).attr("src");
    $('#ShowImage').dialog({
    });
    $("#bigImg").attr("src", src);
    $('#ShowImage').window('open');
}

//引用tabs
$(function () {
    $("img[original]").lazyload({ placeholder: "images/color3.gif" });

    //$('.demo1').Tabs();
    $('.demo2').Tabs({
        event: 'click'
    });
    $('.demo3').Tabs({
        event: 'click'
    });
    //$('.demo3').Tabs({
    //timeout:300
    //});
    //$('.demo4').Tabs({
    //auto:3000
    //});
    //$('.demo5').Tabs({
    //event:'click',
    //callback:lazyloadForPart
    //});
    //部分区域图片延迟加载
    function lazyloadForPart(container) {
        container.find('img').each(function () {
            var original = $(this).attr("original");
            if (original) {
                $(this).attr('src', original).removeAttr('original');
            }
        });
    }

});