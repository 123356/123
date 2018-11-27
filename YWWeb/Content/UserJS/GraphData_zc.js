$("#currPosition", window.top.document).html("当前位置：状态 > 历史 > 曲线报表 ");
var firstOpen = 0, canAdd = 0;
var pid = 0, did = 0, cid = 0;
var datestart, dateend;
var graphtype = 6, getPoinType = 0, IsZoom = 0;

var Request = new Object();
Request = GetRequest();
if (Request['pid'] != null)
    pid = Request['pid'];
else
    pid = $.cookie('cookiepid');

$('#time').removeClass('curve_switchactive');
$('#one').addClass('curve_switchactive');
//显示隐藏曲线表格
$(".curve_toggle").click(function () {
    $(".curve_table table").slideToggle("slow");
    $(this).toggleClass("curve_toggles");
});
$('.GraphType').click(function () {
    datestart = '';
    dateend = '';
    IsZoom = 0;
    graphtype = $("input[name='GraphType']:checked").val();
    if (graphtype == 144 || graphtype == 707) {
        getPoinType = 1;
    }
    else
        getPoinType = 0;
    lockaway();
});
$("#AlarmLine").change(function () {
    DoSearch();
});

//初始化回路
function initCombCid(pid, did) {
    $("#SCID").combobox({
        url: "/BaseInfo/getCidByPID?pid=" + pid + "&did=" + did,
        valueField: 'cid',
        textField: 'cname',
        editable: false,
        onSelect: function (data) {
            if (data.cid == 0) {
                cid = 0;
            } else {
                cid = data.cid;
            }
            loadpoint();
        },
        onLoadSuccess: function (data) {
            for (var item in data[0]) {
                if (item == 'cid') {
                    $("#SCID").combobox('select', data[0][item]);
                }
            }
            //loadpoint();
        }
    });
}

$("#SPID").combotree({
    url: "/BaseInfo/PdrDevComboTreeMenuByPID?pid=" + pid,
    onClick: function (node) {
        if (!$(this).tree('isLeaf', node.target)) {
            $('#SPID').combo('showPanel');
            $('#SPID').combotree('tree').tree("expand", node.target); //展开
        }
        else {
            pid = node.id.split('_')[0];
            did = node.id.split('_')[1];
            initCombCid(pid, did);
            $.cookie('cookiepid', pid, { expires: 7, path: '/' });
        }
    },
    onLoadSuccess: function (data) {
        $('#SPID').combotree('tree').tree("collapseAll");
        var roots = $('#SPID').combotree('tree').tree('getRoots');
        var Index = 0;
        for (i = 0; i < roots.length; i++) {
            if (roots[i].id == $.cookie('cookiepid'))
                Index = i;
        }
        var child = $('#SPID').combotree('tree').tree('getChildren', roots[Index].target);
        pid = child[0].id.split('_')[0];
        did = child[0].id.split('_')[1];
        $('#SPID').combotree('setValue', child[0].id);
        $('#SPID').combotree('tree').tree("expand", roots[Index].target);

        initCombCid(pid, did);
    }
});

function loadpoint() {
    var ids = '', tid = '';
    //绑定树
    //$('#DataTypeParams').combobox("clear");
    $('#DataTypeParams').combotree
    ({
        url: '/BaseInfo/DataTypeParamsByCircuit?pid=' + pid + '&did=' + did + '&cid=' + cid,
        multiple: true,
        onBeforeSelect: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#DataTypeParams').combotree('tree').tree("expand", node.target); //展开
                return false;
            }
        },
        onClick: function (node) {
            if (!$(this).tree('isLeaf', node.target)) {
                $('#DataTypeParams').combo('showPanel');
            }
        },
        onCheck: function (node, checked) {
            var typecount = getSelectedType($("#DataTypeParams").combotree("getValues"));
            //至少选择一个测点
            if (typecount == 0) {
                var t = $('#DataTypeParams').combotree('tree'); //得到树对象
                $.messager.show({
                    title: '提示',
                    msg: '至少选择一个测点',
                    timeout: 2000
                });
                t.tree('check', node.target);
                //不选中当前的节点
            }
            if (typecount > 2) {
                var t = $('#DataTypeParams').combotree('tree'); //得到树对象
                $.messager.show({
                    title: '提示',
                    msg: '只能选择两类参数',
                    timeout: 2000
                });
                t.tree('uncheck', node.target);
                //不选中当前的节点
            }
        },
        onLoadSuccess: function (data) {
            $.post("/BaseInfo/SelectPoints", { "pid": pid, "did": did, "cid": cid }, function (data) {
                $('#DataTypeParams').combotree('tree').tree("collapseAll");
                $("#DataTypeParams").combotree("setValues", data);
                DoSearch();
            });
        },
        onLoadError: function (data) {
            $('#canvas').html("<div id='HisCharts' style = 'color: White;text-align: center;font-size: 20px; padding:200px;'>未查到数据！</div>");
        }
    });
}
function lockaway() {
    $('#scroll').fadeOut();
    totaltype = $("input[name='GraphType']:checked").val();
    startdate = "";
    enddate = "";
    canAdd = 0;
    if (totaltype == 6 || totaltype == 72) {
        $('#time').removeClass('curve_switchactive');
        $('#one').addClass('curve_switchactive');
    }
    else {
        $('#one').removeClass('curve_switchactive');
        $('#time').addClass('curve_switchactive');
    }
    GetGraphData();
}
function unlock() {
    //            $('#StartDate').datebox().datebox('calendar').calendar({
    //                validator: function (date) {
    //                    var now = new Date();
    //                    var s1 = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    //                    var el = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //                    return s1 <= date && date <= el;
    //                }
    //            });
    //            $('#EndDate').datebox().datebox('calendar').calendar({
    //                validator: function (date) {
    //                    var now = new Date();
    //                    var s1 = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    //                    var el = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //                    return s1 <= date && date <= el;
    //                }
    //            });
    $('#StartDate').datebox({
        onSelect: function () { //输入判断
            datestart = $('#StartDate').datebox('getValue');
            dateend = $('#EndDate').datebox('getValue');
            if (datestart > dateend) {
                $('#EndDate').datebox('setValue', datestart);
                dateend = datestart;
            }
        }
    });
    $('#EndDate').datebox({
        onSelect: function () { //输入判断
            datestart = $('#StartDate').datebox('getValue');
            dateend = $('#EndDate').datebox('getValue');
            if (datestart > dateend) {
                $('#EndDate').datebox('setValue', datestart);
                dateend = datestart;
            }
        }
    });
    $('#scroll').fadeIn();
    $('#one').removeClass('curve_switchactive');
    $('#time').addClass('curve_switchactive');
    canAdd = 1;
}
function DoSearch() {
    datestart = $('#StartDate').datebox('getValue');
    dateend = $('#EndDate').datebox('getValue');
    if (datestart == "" && canAdd == 1) {
        $.messager.alert("提示", "请选择开始日期！", "info");
    }
    else if (dateend == "" && canAdd == 1) {
        $.messager.alert("提示", "请选择结束日期！", "info");
    }
    else if (CompareTime(datestart, dateend) > 90) {
        $.messager.alert("提示", "时间请选择小于90天！", "info");
    }
    else if (canAdd == 1) {
        var aDate, oDate1, oDate2, iDays
        aDate = datestart.split("-");
        oDate1 = new Date(datestart);     //转换为12-18-2002格式
        aDate = dateend.split("-");
        oDate2 = new Date(dateend);
        iDays = parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
        if (iDays < 8) {
            $('#time').removeClass('curve_switchactive');
            $('#one').addClass('curve_switchactive');
            getPoinType = 0;
            IsZoom = 1;
        }
        else {
            $('#one').removeClass('curve_switchactive');
            $('#time').addClass('curve_switchactive');
            getPoinType = 1;
        }
        GetGraphData();
    }
    else
        GetGraphData();
}
//对比开始和结束时间
function CompareTime(start, end) {
    var result = 0;
    var a = start, b = end;
    s = a.split("-");
    e = b.split("-");
    var daya = new Date();
    var dayb = new Date();
    daya.setFullYear(s[0]);
    dayb.setFullYear(e[0]);
    daya.setMonth(s[1]);
    dayb.setMonth(e[1]);
    daya.setDate(s[2]);
    dayb.setDate(e[2]);
    result = (dayb - daya) / 86400000;
    return result;
}

//定义历史曲线变量值
var ajaxbg = top.$("#loading_background,#loading");
//top.$("#loading_background,#loading").html("<img src='/Content/Images/loading.gif' style='vertical-align: middle;'>&nbsp<span>数据量较大，请耐心等待。点击取消提示</span>  ");
var Json = "", xAxisFormat = [], yAxisFormat = [], LegendData = [], SeriesData = [], Colors = [];
function GetGraphData() {
    //请求前先清空
    Json = [], xAxisFormat = [], yAxisFormat = [], LegendData = [], SeriesData = [], Histagid = "";
    graphtype = $("input[name='GraphType']:checked").val();

    ajaxbg.show();
    Histagid = '';
    Hisrolelist = $("#DataTypeParams").combotree("getValues") + '';
    if (Hisrolelist == "") {
        Hisiserror = 1;
        return false;
    }
    var arrtagid = Hisrolelist.split(','); //获取TagID list
    len = arrtagid.length;
    for (var j = 0; j < len; j++) {
        if (arrtagid[j].indexOf('_') > 0) {
            tagid = arrtagid[j].split('_')[1];        //曲线TagID
            Histagid += tagid + ',';                    //曲线TagID,数组
        }
    }
    $.post("/Graphs/GetGraphs2", { "pid": pid, "Graphtype": graphtype, "PoinType": getPoinType, "TagIDs": Histagid, "startdatetime": datestart, "enddatetime": dateend }, function (data) {
        var dataJson = eval("(" + data + ")");
        Json = dataJson;
        if (dataJson.xLength < 1) {
            ajaxbg.hide();
            $('#canvas').html("<div id='HisGraphCharts' style = 'color:#fff;text-align: center;font-size: 20px; padding:200px;'>未查到数据！</div>");
            return false;
        }
        else {
            $('#canvas').html("<div id='HisGraphCharts' style='height: 500px; z-index: 10; padding: 5px; background-color: #333 !important;'>");
            SetGraphOption();
        }
    });

}
function SetGraphOption() {
   // console.log(Json);
    var Xarr = Json.xAxis.split(',');

    for (i = 0; i < Xarr.length; i++) {
        var ym = Xarr[i].split(' ')[0].split('/');
        var hm = Xarr[i].split(' ')[1].split(':');
        if (hm[0].length == 1 && graphtype == 6)
            xAxisFormat.push('0' + hm[0] + ':' + hm[1]);
        else if (hm[0].length == 1 && graphtype != 6)
            xAxisFormat.push(ym[1] + '-' + ym[2] + ' 0' + hm[0] + ':' + hm[1]);
        else if (hm[0].length != 1 && graphtype == 6)
            xAxisFormat.push(hm[0] + ':' + hm[1]);
        else
            xAxisFormat.push(ym[1] + '-' + ym[2] + ' ' + hm[0] + ':' + hm[1]);
    }
    var exDataTypeID = 0, index = 0, yMax = Json.Max[0], yMin = Json.Min[0], aValue = 0, yMax1 = Json.Max[1], yMin1 = Json.Min[1], aValue1 = 0;
    if (Json.AlarmValue.length > 1) {
        aValue = Json.AlarmValue[0];
        aValue1 = Json.AlarmValue[1];
    }
    else
        aValue = Json.AlarmValue[0];

    if ($("#AlarmLine").attr("checked") == 'checked' && aValue > yMax && aValue < 2000) {
        yMax = aValue;
    }
    if ($("#AlarmLine").attr("checked") == 'checked' && aValue < yMin && aValue > -2000) {
        yMin = aValue;
    }
    if ($("#AlarmLine").attr("checked") == 'checked' && aValue1 > yMax1 && aValue1 < 2000) {
        yMax1 = aValue1;
    }
    if ($("#AlarmLine").attr("checked") == 'checked' && aValue1 < yMin1 && aValue1 > -2000) {
        yMin1 = aValue1;
    }

    for (j = 0; j < Json.Count; j++) {
        if (Json.Graph[j].DataTypeID != exDataTypeID && index == 0) {
            yAxisFormat.push({
                name: Json.Graph[j].Position + '(' + Json.Graph[j].单位 + ')',
                type: 'value',
                index: 0,
                axisLabel: {
                    formatter: function (v) { return parseInt(v) },
                    textStyle: { color: '#fff' }
                },
                splitLine: { show: true, lineStyle: { color: 'rgb(255,255,255)', type: 'dashed' } },
                axisLine: { lineStyle: { color: '#fff', type: 'solid', width: 5 } },
                max: yMax * 1.1,
                min: yMin * 0.9
            });
            exDataTypeID = Json.Graph[j].DataTypeID;
            index++;
        }
        else if (Json.Graph[j].DataTypeID != exDataTypeID && Json.Graph[j].DataTypeID != 24 && index != 0) {
            yAxisFormat.push({
                name: Json.Graph[j].Position + '(' + Json.Graph[j].单位 + ')',
                type: 'value',
                index: 1,
                axisLabel: {
                    formatter: function (v) { return parseInt(v) },
                    textStyle: { color: '#fff' }
                },
                splitLine: { show: true, lineStyle: { color: 'rgb(255,255,255)', type: 'dashed' } },
                axisLine: { lineStyle: { color: '#fff', type: 'solid', width: 5 } },
                max: yMax1 * 1.2,
                min: yMin1 * 0.8
            });
            exDataTypeID = Json.Graph[j].DataTypeID;
            index++;
        }
        var Graphcolor = "";
        if (Json.Graph[j].Remarks == Json.Graph[0].Remarks) {
            Colors = "yellow";
        }
        else if (Json.Graph[j].Remarks == Json.Graph[1].Remarks) {
            Colors = "#90EE90";
        }
        else if (Json.Graph[j].Remarks == Json.Graph[2].Remarks) {
            Colors = "#F08080";
        }
        else if (Json.Graph[j].Remarks == Json.Graph[3].Remarks) {
            Colors = "yellow";
        }
        else if (Json.Graph[j].Remarks == Json.Graph[4].Remarks) {
            Colors = "#90EE90";
        }
        else if (Json.Graph[j].Remarks == Json.Graph[5].Remarks) {
            Colors = "#F08080";
        }
        else {
            Colors = "#ffa500", "#40e0d0", "#ee90ff", "#ff6347", "#7b68ee", "#7b68ee", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0";
        }
        var Datas = eval("[" + Json.Graph[j].置1说明 + "]");
        SeriesData.push({
            name: Json.Graph[j].Remarks,
            type: 'line',
            smooth: true,
            yAxisIndex: index - 1,
            symbolSize: 2,
            itemStyle: {
                normal: {
                    color: Colors,
                    lineStyle: {
                        color: Colors
                    }
                }
            },
            data: Datas,
            markPoint: {
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            color: '#000000',//气泡中字体颜色
                        }
                    }
                },
                data: [{ type: 'max', name: '最大值' },
                         { type: 'min', name: '最小值' }]
            },

        });
        LegendData.push(Json.Graph[j].Remarks);
    }
    //曲线着色

    //Colors = ["#cd5c5c", "#ffa500", "#40e0d0", "#ee90ff", "#ff6347", "#7b68ee", "#7b68ee", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0"]
    Colors[Json.Count] = "rgb(255,0,0)";
    ajaxbg.hide();
    //console.log(SeriesData);
    BuildGraphVeiw();

}
function BuildGraphVeiw() {
    var currSeriesData = "";
    currSeriesData = SeriesData;
    //报警线
    if ($("#AlarmLine").attr("checked") == 'checked') {
        for (b = 0; b < Json.AlarmValue.length; b++) {
            var AlarmLine = [];
            var Ac = [255, 210];
            for (a = 0; a < Json.xLength; a++)
                AlarmLine.push(Json.AlarmValue[b]);
            currSeriesData.push({
                name: Json.DataType[b] + "报警值",
                type: "line",
                yAxisIndex: b,
                lineStyle: { normal: { color: 'rgb(' + Ac[b] + ', 0, 0)' } },
                data: AlarmLine,
                symbol: "emptyCircle",
                smooth: true
            });
        }
    }
    var myHisChart = echarts.init(document.getElementById('HisGraphCharts'), 'macarons');
    var option = {
        title: {
            text: '历史趋势图',
            textStyle: { color: '#fff' }
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none',
                    title: { back: '' },
                    icon: { back: 'image://' }
                },
                restore: {}
            },
            iconStyle: { normal: { textPosition: 'top', borderColor: '#66ccff' }, emphasis: { textPosition: 'top', borderColor: '#ff33ee' } },
            top: '0%',
            right: '0%',
            itemSize: '21'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: LegendData,
            textStyle: { color: '#fff' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLabel: { textStyle: { color: '#fff' } },
            splitLine: { show: true, lineStyle: { color: 'rgb(255,255,255)', type: 'dashed' } },
            axisLine: { lineStyle: { color: '#fff', type: 'solid', width: 5 } },
            data: xAxisFormat
        }],
        yAxis: yAxisFormat,
        color: Colors,
        series: currSeriesData
    };

    // 为echarts对象加载数据 
    myHisChart.setOption(option);
    myHisChart.on('datazoom', CheckZoom);
    function CheckZoom(param) {
        var s = param.batch[0].startValue;
        var e = param.batch[0].endValue;
        var axis = Json.xAxis.split(',');
        var graphtype = $("input[name='GraphType']:checked").val();
        startdate = axis[s].split(' ')[0].split('/');
        enddate = axis[e].split(' ')[0].split('/');
        datestart = startdate[0] + '-' + startdate[1] + '-' + startdate[2];
        dateend = enddate[0] + '-' + enddate[1] + '-' + enddate[2];

        var aDate, oDate1, oDate2, iDays
        aDate = datestart.split("-");
        oDate1 = new Date(datestart);     //转换为12-18-2002格式
        aDate = dateend.split("-");
        oDate2 = new Date(dateend);
        iDays = parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数

        if (iDays < 8 && IsZoom == 0 && (graphtype == 144 || graphtype == 707)) {
            $('#GraphTypezdy').attr('checked', 'checked');
            getPoinType = 0;

            unlock();
            $('#time').removeClass('curve_switchactive');
            $('#one').addClass('curve_switchactive');
            $('#EndDate').datebox('setValue', dateend);
            $('#StartDate').datebox('setValue', datestart);
            GetGraphData()
            IsZoom = 1;
            getPoinType = 1;
        }
    }
}