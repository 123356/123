$("#currPosition", window.top.document).html("当前位置：电能 > 尖谷平峰 > 谷峰设置 ");

$("#SPID").combobox({
    url: "/BaseInfo/BindPDRInfo?showall=1",
    valueField: 'PID',
    textField: 'Name',
    onLoadSuccess: function () { //数据加载完毕事件
        var data = $('#SPID').combobox('getData');
        if (data.length > 0) {
            var ui = $.cookie('cookiepid')
            $("#SPID").combobox('setValue', ui);
        }
    },
    onSelect: function (data) {
        $.cookie('cookiepid', data.PID, { expires: 7, path: '/' });
    }
});
//日期转换
function DateFormat(value, row, index) {
    var lDate = formatDate(value, 'yyyy-MM-dd hh:mm:ss');
    return lDate
}
//查看详情
function loadDetail(value, row, index) {
    return "<a href='" + row.FilePath.replace(/~/, "../..") + "'  target='_blank'><button class='page_table_but3 radius5'><img src='../content/images/download.png' />下载</button></a><button class='page_table_but3 radius5' onclick='DoDelete(" + row.ID + ");'><img src='../content/images/delete_new.png' />删除</button>"
}
//显示文件类型图标
function loadImage(FileExtension) {
    if (FileExtension == ".doc" || FileExtension == ".docx")
        return '<img src="../content/images/wordicon.png"  width="35px" height="35px"/>';
    else if (FileExtension == ".xls" || FileExtension == ".xlsx")
        return '<img src="../content/images/excelicon.png"  width="35px" height="35px"/>';
    else if (FileExtension == ".zip" || FileExtension == ".rar)")
        return '<img src="../content/images/raricon.png"  width="35px" height="35px"/>';
    else if (FileExtension == ".pdf")
        return '<img src="../content/images/pdficon.png"  width="35px" height="35px"/>';
    else if (FileExtension == ".mp4" || FileExtension == ".rmvb)" || FileExtension == ".wav")
        return '<img src="../content/images/videoicon.png"  width="35px" height="35px"/>';
    else
        return '<img src="../content/images/drawingicon.png"  width="35px" height="35px"/>';
}
function popwindow() {
    var pop_contentwidth = $(".pop_window").width() / 2;
    var pop_contentheight = $(".pop_window").height() / 2;
    $('.pop_window h3').mousedown(
function (event) {
    var isMove = true;
    var abs_x = event.pageX - $('div.pop_window').offset().left - pop_contentwidth;
    var abs_y = event.pageY - $('div.pop_window').offset().top - pop_contentheight;
    $(document).mousemove(function (event) {
        if (isMove) {
            var obj = $('div.pop_window');
            obj.css({ 'left': event.pageX - abs_x, 'top': event.pageY - abs_y });
        }
    }
    ).mouseup(
    function () {
        isMove = false;
    }
    );
}
    );
    $(".pop_window").css({ "margin-left": -pop_contentwidth, "margin-top": -pop_contentheight });
    $(".pop_window").fadeIn();
    $(".pop_windowbg").fadeIn();
}
function popclose() {
    $(".pop_window").fadeOut();
    $(".pop_windowbg").fadeOut();
}

$('#list_data').datagrid({
    url: '/EnergyEfficiency/PlanData?rom=' + Math.random() + "&pid=" + $.cookie('cookiepid') + "&stagename=",
    pagination: true
});

function dosearch() {
    var pid = $("#SPID").combobox("getValue");
    $('#list_data').datagrid('load', { "pid": pid, "stagename": "" })
}
function add() {
    var post = "{ 'id': 0, 'pid':" + $("#SPID").combobox('getValue') + " }";
    $('#editwin').window({
        modal: true,
        width: document.body.clientWidth * 0.8,
        height: document.body.clientHeight * 0.8,
        top: 10,
        href: '/EnergyEfficiency/JianguPingfengEdit?JID=' + post,
        onClose: function () {
            $('#list_data').datagrid('reload');
        }
    });
    $('#editwin').window('open');
}
function edit() {
    var ids = [];
    var rows = $('#list_data').datagrid('getSelections');
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].ID);
    }
    if (ids.length > 1) {
        $.messager.alert("提示", "编辑时只能选择一行数据！", "info");
        $('#list_data').datagrid('uncheckAll');
    }
    else {
        var row = $('#list_data').datagrid('getSelected');
        if (row) {
            var post = "{ 'id': " + row.ID + ", 'pid':" + $("#SPID").combobox('getValue') + " }";
            $('#editwin').window({
                modal: true,
                width: document.body.clientWidth * 0.8,
                height: document.body.clientHeight * 0.8,
                top: 10,
                href: '/EnergyEfficiency/JianguPingfengEdit?JID=' + post,
                onClose: function () {
                    $('#list_data').datagrid('reload');
                    $('#list_data').datagrid('uncheckAll');
                }
            });
            $('#editwin').window('open');
        }
        else {
            alert("请选择要编辑的行。");
        }
    }
}
function delect() {
    var row = $('#list_data').datagrid('getSelections');
    var ids = [];
    for (var i = 0; i < row.length; i++) {
        ids.push(row[i].ID);
    }
    if (row) {
        $.messager.confirm('提示', '你确定要删除选中的行？', function (r) {
            if (r) {
                $.post('/EnergyEfficiency/DeletePlan', { did: ids.join(',') }, function (data) {
                    if (data == 'OK')
                        $.messager.alert("提示", "方案删除成功！", "info");
                    $('#list_data').datagrid('reload');
                    $('#list_data').datagrid('unselectAll');
                });
            }
        });
    }
    else {
        alert("请选择要删除的行。");
    }
}
var rowCount = 1;  //行数默认1行 	
//添加行  
function addRow() {
    rowCount++;
    var newRow = '<tr id="option' + rowCount + '"><td align="center"><select class="radius5"><option>平时时段</option><option>高峰时段</option></select></td><td align="center"><input type="text" class="easyui-datetimebox" data-options="required:true,showSeconds:false" style="width:150px;" /></td><td align="center"><input type="text" class="easyui-datetimebox" data-options="required:true,showSeconds:false" style="width:150px;" /></td><td align="center"><input type="text" style="width:100px;" /></td><td align="center"><button onclick=delRow(' + rowCount + ')><img src="../Content/images/Icon16/cancel.png"></button></td></tr>';
    $('#optionContainer tbody').prepend(newRow);
}
//删除行  
function delRow(rowIndex) {
    $("#option" + rowIndex).remove();
    rowCount--;
}