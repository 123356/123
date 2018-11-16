
$(function () {

    loadStationName();

})
//getPDRInfoById(pId);

function loadStationName() {
    //查询站室名称
    $('#StationName').combotree({
        url: '/Home/ComboTreeMenu',
        multiple: false,
        onBeforeSelect: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationName').combotree('tree').tree("expand", node.target); //展开
                return false;
            }
        },
        onClick: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#StationName').combo('showPanel');
            }
            else {
                //返回树对象
                if (node.id != 0) {
                    $("#SPID").val(node.id);
                    $.cookie('cookiepid', node.id, { expires: 7, path: '/' });
                    pid = node.id;
                    getPDRInfoById(pid);
                }
            }
        },
        onLoadSuccess: function (node, data) {
            var gpid = $.cookie('cookiepid');
            pid = gpid;
            if (gpid != undefined) {
                $("#StationName").combotree("setValue", gpid);
            }
            getPDRInfoById(pid);
        }
    });
}


function getPDRInfoById(pId) {

    $.post("/PDRInfo/getPDRInfoById?PID=" + pId + "", function (data) {
        var row = eval("(" + data + ")");

        if (row == null)
            return;

        if (row.pdrInfo != null)
            $("#pName").html(row.pdrInfo.Name);
        if (row.Mobilephone != null)
            $("#ywmantel").html(row.Mobilephone);

        if (row.vmodel != null)
            $("#Vlevel").html(row.vmodel.VoltageName);
        if (row.pdrInfo != null)
            $("#EleCalWay").html(row.pdrInfo.EleCalWay);
        if (row.unit != null)
            $("#InstalledCapacity").html(row.unit.InstalledCapacity);
        if (row.unit != null)
            $("#EleCalWay").html(row.unit.EleCalWay);
        if (row.unit != null)
            $("#GovEleLevel").html(row.unit.GovEleLevel);
        if (row.unit != null)
            $("#DeviationMode").html(row.unit.DeviationMode);
        if (row.ind != null)
            $("#hangye").html(row.ind.IndustryName);
        if (row.pdrInfo != null)
            $("#pCompanyName").html(row.pdrInfo.pCompanyName == "" ? "<br>" : row.pdrInfo.CompanyName);
        if (row.pdrInfo != null)
            $("#pPosition").html(row.pdrInfo.Position == "" ? "<br>" : row.pdrInfo.Position);

        if (row.pdrInfo != null)
            $("#pLinkMan").html(row.pdrInfo.LinkMan == "" ? "<br>" : row.pdrInfo.LinkMan);
        if (row.pdrInfo != null)
            $("#pMobile").html(row.pdrInfo.Mobile == "" ? "<br>" : row.pdrInfo.Mobile);
        if (row.area != null)
            $("#pAreaID").html(row.area.AreaName);

        if (row.pdrInfo.Remarks != null)
            $("#pRemarks").html(row.pdrInfo.Remarks.replace(/<br\s*\>/g, "\n"));
        else
            $("#pRemarks").html("<br>");

        $("#imgCarousel_1").attr('src', "/Content/images/PDRPhoto/pdr" + pid + "_1.jpg");
        $("#imgCarousel_2").attr('src', "/Content/images/PDRPhoto/pdr" + pid + "_2.jpg");
        $("#imgCarousel_3").attr('src', "/Content/images/PDRPhoto/pdr" + pid + "_3.jpg");

        var date = new Date()
        var timeStr = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
        $("#time").html(timeStr)
        if (row.pdrInfo.OperationDate && row.pdrInfo.OperationDate.indexOf('T') > 0)
            $("#OperationDate").html(row.pdrInfo.OperationDate.replace('T', ' '))

        if (row.constract) {
            $("#ywman").html(row.constract.person);
            var start = row.constract.start_time;
            var end = row.constract.end_time;
            $("#duration").html(start.substring(0, start.indexOf("T")) + "~" + end.substring(0, end.indexOf("T")))
            startDate = new Date(start.replace('T', ' '))
            var days = Date.daysBetween(startDate, date);
            if (days) {
                $("#days").html(days)
                document.getElementById('daysinfo').style.display = '';
            } else {
                document.getElementById('daysinfo').style.display = 'none';
            }
        }
    });
}

Date.daysBetween = function (date1, date2) {   //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;        // Convert back to days and return
    return Math.round(difference_ms / one_day);
}