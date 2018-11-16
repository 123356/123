var count = 0,isSave = 0;
var ts = "00:00:00" ;te = "01:00:00";
if(msg.id == 0){
    savePlan();
    $('#JName').val("新建方案");
    loadconfig();
}
else{
    loadPlanInfo();
    loadconfig();
}

function savePlan(){
    var sn = "",ds="",es=""
    if(msg.id != 0){
        sn = $('#JName').val();
        ds = $('#StDate').datebox('getValue');
        es = $('#EnDate').datebox('getValue');
        if($('#JName').val() == ""){
            $.messager.alert("提示", "请输入方案名称！", "info");
            return false;
        }
        else if($('#StDate').datebox('getValue') == ""){
            $.messager.alert("提示", "请选择错峰周期的开始日期！", "info");
            return false;
        }
        else if($('#EnDate').datebox('getValue') == ""){
            $.messager.alert("提示", "请选择错峰周期的结束日期！", "info");
            return false;
        }
        if($('#dg').datagrid('getRows').length > 0 && CountRows() != 0){
            $.messager.alert("提示", "时间段应该覆盖24小时，请检查！", "info");
            return false;
        }
    }
    $.post('/EnergyEfficiency/EditPlan', {
        ID : msg.id,
        PID : msg.pid,
        StageName:sn,
        DateStart:ds,
        DateEnd:es
    }, function (data) {   
        if(msg.id == 0){
            msg.id = data;
        }    
        else{
            $.messager.alert("提示", "方案保存成功！", "info");
            $('#editwin').window('close');
        }     
    });
}

function saveConfig(){
    $.post('/EnergyEfficiency/EditPlanConfig', {
        ID : row.ID,
        TypeName : row.TypeName,
        StartDate : row.StartDate,
        EndDate : row.EndDate,
        Price : row.Price
    }, function (data) {              
    });
}
function loadPlanInfo(){
    $.post('/EnergyEfficiency/PlanInfoDetail', {
        id :  msg.id
    }, function (data) {  
        var data = JSON.parse(data);
        $('#JName').val(data.StageName);
        $('#StDate').datebox('setValue',data.DateStart);
        $('#EnDate').datebox('setValue',data.DateEnd);
    });
}
function loadconfig(){
    $('#dg').datagrid({
        url: '/EnergyEfficiency/ConfigData?rom=' + Math.random() + "&PlanID=" + msg.id,
        pagination: true,
        onLoadSuccess:function(data){
            var index = $('#dg').datagrid('getRows').length;
            if(index > 0){
                te =  $('#dg').datagrid('getRows')[index-1].TimeEnd;
                ts = te;
            }
        }
    });
}
var editIndex = undefined,endEdit = true
function endEditing(){
    if ($('#dg').datagrid('validateRow', editIndex)){
        var ed = $('#dg').datagrid('getEditor', {index:editIndex,field:'StageType'});
        var TypeName = $(ed.target).combobox('getText');
        $('#dg').datagrid('getRows')[editIndex]['StageType'] = TypeName;

        ed = $('#dg').datagrid('getEditor', {index:editIndex,field:'TimeStart'});
        var StartDate = $(ed.target).timespinner('getValue');
        $('#dg').datagrid('getRows')[editIndex]['TimeStart'] = StartDate;

        ed = $('#dg').datagrid('getEditor', {index:editIndex,field:'TimeEnd'});
        var EndDate = $(ed.target).timespinner('getValue');
        $('#dg').datagrid('getRows')[editIndex]['TimeEnd'] = EndDate;

        ed = $('#dg').datagrid('getEditor', {index:editIndex,field:'ElePrice'});
        var Price = $(ed.target).textbox('getText');
        $('#dg').datagrid('getRows')[editIndex]['ElePrice'] = Price;

        var row = $('#dg').datagrid('getSelected');
        if(row.StageType == ""){
            $.messager.alert("提示", "请选择类型！", "info");
            return false;
        }
        else if(row.TimeStart == ""){
            $.messager.alert("提示", "请选择起始时间！", "info");
            return false;
        }
        else if(row.TimeEnd == ""){
            $.messager.alert("提示", "请选择结束时间！", "info");
            return false;
        }
        else if(CompareTime(row.TimeStart,row.TimeEnd)  < 0 && row.TimeEnd != "00:00:00" ){
            $.messager.alert("提示", "起始时间必须小于结束时间！", "info");
            return false;
        }
        else if(row.ElePrice == ""){
            $.messager.alert("提示", "请输入电价！", "info");
            return false;
        }
        else{
            $.post('/EnergyEfficiency/EditPlanConfig', {
                ID : row.ID,
                PlanID : msg.id,
                StageType : row.StageType,
                TimeStart : row.TimeStart,
                TimeEnd : row.TimeEnd,
                ElePrice : row.ElePrice
            }, function (data) {   
                $('#dg').datagrid('getRows')[editIndex]['ID'] = data;    
                $('#dg').datagrid('endEdit', editIndex);
                editIndex = undefined;
                endEdit = true;  
            });
            te = row.TimeEnd; 
            ts = te;
        }
        return true;
    } else {
        return false;
    }
}
function Butten(value, row, index){
    return "<img style= 'float:right;'  onclick = 'endEditing()' src = '/Content/images/examine.png'/>";
}
function onClickRow(index){
    if (editIndex != index){
        if (endEdit == true){
            $('#dg').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
            editIndex = index;
            endEdit = false;
        }
        else {
            $('#dg').datagrid('selectRow', editIndex);
        }
    }
}
function append(){
    if (editIndex == undefined){
        $('#dg').datagrid('appendRow',{ID:'0',TimeStart:ts,TimeEnd:te});
        editIndex = $('#dg').datagrid('getRows').length-1;
        $('#dg').datagrid('selectRow', editIndex)
                .datagrid('beginEdit', editIndex);
    }
    else
    {
        $.messager.alert("提示", "请先完成当前编辑！", "info");
    }
}
function removeit(){
    var row = $('#dg').datagrid('getSelected');
    if (row.ID > 0){
        $.post('/EnergyEfficiency/DeleteConfig', {
            did :  row.ID
        }, function (data) {  
            $('#dg').datagrid('cancelEdit', editIndex)
                    .datagrid('deleteRow', editIndex);
            editIndex = undefined;
            endEdit = true;
        });
    }
    else{
        $('#dg').datagrid('cancelEdit', editIndex)
                .datagrid('deleteRow', editIndex);     
        editIndex = undefined;
        endEdit = true;        
    }
}
function CountRows(){
    var rowcount = $('#dg').datagrid('getRows').length,hourTotal = 0;
    for(i = 0;i < rowcount;i++){
        var a=$('#dg').datagrid('getRows')[i].TimeStart,b= $('#dg').datagrid('getRows')[i].TimeEnd;
        var cp = CompareTime(a,b);
        hourTotal += cp;
    }
    return hourTotal;
}
//对比开始和结束时间
function CompareTime(start,end){
    var result = 0;
    var a=start,b= end;
    s=a.split(":");
    e=b.split(":");
    var daya = new Date();
    var dayb = new Date();
    daya.setHours(s[0]);
    dayb.setHours(e[0]);
    daya.setMinutes(s[1]);
    dayb.setMinutes(e[1]);
    result = (dayb-daya)/1000/60;
    return result;
}
var docount = 0;
//关闭窗口
function Close(){
    var rowcount = $('#dg').datagrid('getRows').length;
    if(rowcount > 0 && CountRows() != 0){
        $.messager.confirm('提示', '设置未完成，是否退出？', function (r) {
            if(r){
                $('#editwin').window('close');
            }
        });
    }
    else if(rowcount > 0 && CountRows() == 0){
        $('#editwin').window('close');
    }
    else if(rowcount == 0 ){
        $.post('/EnergyEfficiency/DeletePlan', {
            did:msg.id
        }, function (data) {
            if (data == 'OK')
                $('#editwin').window('close');
        });
    }
    $('#list_data').datagrid('unselectAll');    
}