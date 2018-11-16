var pid, did;
var TagName = "";
var Position = "";
$("#SDID").combotree({
    url: "/BaseInfo/PdrTraComboTreeMenu?ShowAll=" + 1,
    onBeforeSelect: function (node) {
        if (!$(this).tree('isLeaf', node.target)) {
            $('#SDID').combotree('tree').tree("expand", node.target); //展开
            return false;
        }
    },
    onClick: function (node) {
        if (!$(this).tree('isLeaf', node.target)) {
            $('#SDID').combo('showPanel');
        }
        else {
            pid = node.id.split('_')[0];
            did = node.id.split('_')[2];
            $.cookie('cookiepid', pid, { expires: 7, path: '/' });
            $.cookie('eadodid', did, { expires: 7, path: '/' });
        }
    },
    onLoadSuccess: function (data) {
        $('#SDID').combotree('tree').tree("collapseAll");
        var roots = $('#SDID').combotree('tree').tree('getRoots');
        var Lastpid = $.cookie('cookiepid'), Index = 0;
        for (i = 0; i < roots.length; i++) {
            if (roots[i].id == Lastpid) {
                Index = i
            }
        }
        var child = $('#SDID').combotree('tree').tree('getChildren', roots[Index].target);
        pid = child[0].id.split('_')[0];
        did = child[0].id.split('_')[2];
        $('#SDID').combotree('setValue', child[0].text);
        $('#SDID').combotree('tree').tree("expand", roots[Index].target); //展开
        dosearch();
    }
});

function dosearch() {
    // TagName = $("#TagName").val();
    TagName = "";
    Position = $("#Poison").val();

    $('#list_data').datagrid({
        url: '/PointsInfo/ShownSensorInfo?rom=' + Math.random(),
        queryParams: { "did": did, "SType": TagName, "CPositin": Position },
        pagination: true
    });
    // $('#list_data').datagrid('load', { "did": did, "SType": TagName, "CPositin": Position });
    $('#list_data').datagrid('uncheckAll');
}


//日期转换
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy-MM-dd hh:mm:ss');
    return lDate
}
function DeviceUseState(isuse) {
    if (isuse == "true") {
        return "正在使用";
    }
    else if (isuse == "false") {
        return "暂停使用";
    }
    else {
        return "";
    }
}

$("#currPosition", window.top.document).html("当前位置：设置 > 基本设置 > 传感器管理");