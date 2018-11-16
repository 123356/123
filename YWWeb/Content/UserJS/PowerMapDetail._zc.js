var Request = new Object();
Request = GetRequest();
var pid = 1, sid = 0;
if (Request['pid'] != null)
    pid = Request['pid'];


getRealTimeData();
function getRealTimeData() {
    //$('#tim').html("最新更新时间: " + top.$('#SJ').html());
    //表格
    var oTable = $('#datalist').dataTable({
        "oLanguage": {
            //国际化
            "sProcessing": "<div class='align-center'><img src='/Content/Images/loading.gif'>  加载数据中...</div>",
            "sLengthMenu": "每页显示&nbsp;_MENU_ &nbsp;条结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",
            "infoEmpty": "0条记录", //筛选为空时左下角的显示"
            "sInfoEmpty": "没有数据",
            "sInfoFiltered": "(从_MAX_条数据中检索)", //筛选之后的左下角筛选提示，
            "sZeroRecords": "没有检索到数据"
            //"sSearch": '<span class="label label-success">&nbsp;搜索&nbsp;</span>'
        },
        "bProcessing": true, //DataTables载入数据时，是否显示‘进度’提示  
        "bServerSide": true, //是否启动服务器端数据导入  
        "bStateSave": false, //是否打开客户端状态记录功能,此功能在ajax刷新纪录的时候不会将个性化设定回复为初始化状态  
        "bJQueryUI": true, //是否使用 jQury的UI theme         
        "aLengthMenu": [10, 20, 40, 60], //更改显示记录数选项
        "bLengthChange": false,
        "iDisplayLength": 50, //默认显示的记录数  
        "bAutoWidth": true, //是否自适应宽度  
        //"bScrollInfinite" : false, //是否启动初始化滚动条  
        "bScrollCollapse": true, //是否开启DataTables的高度自适应，当数据条数不够分页数据条数的时候，插件高度是否随数据条数而改变  
        "bPaginate": true, //是否显示（应用）分页器  
        "bInfo": true, //是否显示页脚信息，DataTables插件左下角显示记录数  
        "sPaginationType": "full_numbers", //详细分页组，可以支持直接跳转到某页  
        "bSort": false, //是否启动各个字段的排序功能
        "bFilter": false, //是否启动过滤、搜索功能  
        "sAjaxSource": "/DataInfo/GetTaskJson",
        "aoColumns": [
             {
                 "data": "DeviceTypeName",
                 "className": "gs01"
             },
             {
                 "data": "DeviceName",
                 "className": "gs02"
             },
             {
                 "data": "CName",
                 "className": "gs02"
             },
             {
                 "data": "Position",
                 "className": "gs02"
             },
             {
                 "data": "PV",
                 "mRender": function (data, type, row) {
                     if ("undefined" == typeof (data) || null == data)
                         return "--";
                     return data.toFixed(2);
                 },
                 "className": "gs05"
             }, {
                 "data": "Units",

                 "className": "gs02"
             },
             {
                 "data": "RecTime",
                 "mRender": function (data, type, row) {
                     if ("" == data || "undefined" == typeof (data) || null == data)
                         return "--";
                     var d = eval('new ' + data.substr(1, data.length - 2)); //new Date()
                     return crtTimeFtt(d);
                 },
                 "className": "gs05"
             }
        ],
        "aoColumnDefs": [
            {
                //报错：DataTables warning : Requested unknown parameter '1' from the data source for row 0
                //加上这段定义就不出错了。
                sDefaultContent: '',
                aTargets: ['_all']
            }
        ],
        "fnServerParams": function (aoData) {  //查询条件
            aoData.push(
                { "name": "pid", "value": pid }
                );
            aoData.push(
              { "name": "tdid", "value": 1 }
              );
            aoData.push(
             { "name": "did", "value":0}
             );
            aoData.push(
             { "name": "cid", "value": 0 }
             );

        }
    });
}


