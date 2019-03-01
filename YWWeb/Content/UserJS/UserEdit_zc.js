function loadSelectUnit(arr) {
    $("#unitlist").combobox({
        url: '/SysInfo/UnitComboData', onlyLeafCheck: true, method: 'post', multiple: 'true',
        valueField: 'UnitID',
        textField: 'UnitName',
        editable: true,
        width: 600,
        formatter: function (row) {
            var opts = $(this).combobox('options');
            return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]
        },
        onLoadSuccess: function () {
            var opts = $(this).combobox('options');
            var target = this;
            var values = $(target).combobox('getValues');
            $.map(values, function (value) {
                var el = opts.finder.getEl(target, value);
                el.find('input.combobox-checkbox')._propAttr('checked', true);
            })
            if (arr != ""&&arr!=null) {
                $("#unitlist").combobox("setValues", arr.split(','));
                var opts = $(this).combobox('options');
                var target = this;
                var values = $(target).combobox('getValues');
                $.map(values, function (value) {
                    var el = opts.finder.getEl(target, value);
                    el.find('input.combobox-checkbox')._propAttr('checked', true);
                })
            }
                    
        },
        onSelect: function (row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', true);
        },
        onUnselect: function (row) {
            var opts = $(this).combobox('options');
            var el = opts.finder.getEl(this, row[opts.valueField]);
            el.find('input.combobox-checkbox')._propAttr('checked', false);
        }
    });
}
//加载公司名称
function loadCompany(){
    $("#Company").combobox({
        url: "/BaseInfo/BindUnitName",
        valueField: 'UnitID',
        textField: 'UnitName',
        editable: false,
        onLoadSuccess: function () { //数据加载完毕事件
            var data = $('#Company').combobox('getData');
            if (data.length > 0) {
                $("#Company").combobox('select', data[0].UnitID);
                if(userid > 0)
                    loadUserInfo();
            }
        }
    });
}
function loadUserInfo() {
    $.post("/UserInfo/LoadUserInfo", { "userid": userid }, function (data) {
        var user = eval("(" + data + ")");
        //console.log(user);
        loadSelectUnit(user.UNITList);
        $("#UserName").val(user.UserName);
        $("#Company").combobox("setValue",user.UID);
        $("#Post").val(user.Post);
        $("#Telephone").val(user.Telephone);
        $("#Mobilephone").val(user.Mobilephone);
        $("#UserID").val(user.UserID);
        $("#Email").val(user.Email);
        $("#GroupName").val(user.GroupName);
        if (user.LogUrl != '' && user.LogUrl != null)
        {
            $("#Menu_Img").val(user.LogUrl);
            $("#Img_Menu_Img").attr("src", '/Content/Images/Logo/' + user.LogUrl);
        }
               
        if (user.OpenAlarmMsg == 1)
            $("#cbkAlarmMsg").attr("checked", "checked");
        var pdrlist = user.PDRList;
        if (pdrlist != '' && pdrlist != null) {
            $("#pdrlist").combotree("setValues", user.PDRList);
        }
    })
}
//选择logo
function OpenIconList() {
    $.post("/SysInfo/UserLogList", "", function (data) {
        var iconlist = eval("(" + data + ")");
        $("#icon_data").html(iconlist);
        $(".divicons").click(function () {
            $(".divicons").css("background-color","none");
            $(this).css("background-color","#2288cc");
            Get_Menu_Img($(this).attr('title'));
        });
    });
    $('#editWin').dialog({
        //title: title,
        closed: false,
        minimizable: false, //最小化，默认false  
        maximizable: false, //最大化，默认false  
        collapsible: false, //可折叠，默认false  
        resizable: true//可缩放，即可以通脱拖拉改变大小，默认false  
    });
}
function loadallot() {
    if (userid == null)
        userid = 0;
    $.post("/UserInfo/UserRole", { "userid": userid }, function (data) {
        var userrole = eval("(" + data + ")");
        $("#allot").html(userrole);

        $("input[name='checkbox']").click(function(){
            $(this).attr('checked','checked').siblings().removeAttr('checked');
        });

    });
}
//表单验证
$.extend($.fn.validatebox.defaults.rules, {
    phoneNum: { //验证手机号  
        validator: function (value, param) {
            if (value != "") {
                return /^1[3-8]+\d{9}$/.test(value);
            }
            return true
        },
        message: '请输入正确的手机号码。'
    },

    telNum: { //既验证手机号，又验证座机号
        validator: function (value, param) {
            if (value != "") {
                return /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\d3)|(\d{3}\-))?(1[358]\d{9})$)/.test(value);
            }
            return true
        },
        message: '请输入正确的电话号码。'
    }
})

$(function () {
    $.ajaxSettings.async = false;
    loadSelectUnit("");
    loadCompany();
    loadallot();
    $("#btnSave").click(function () {
        if ($("#UserName").val() == "") {
            $.messager.alert("提示", "请输入用户名！", "info");
            return false;
        }
        
        else if ($("#Company").combobox("getText") == "") {
            $.messager.alert("提示", "请输入公司名称！", "info");
            return false;
        }
        else if ($("#Telephone").val() == "") {
            $.messager.alert("提示", "请输入固定电话！", "info");
            return false;
        }
        else if ($("#Email").val() == "") {
            $.messager.alert("提示", "请输入Email！", "info");
            return false;
        }
       
        else if ($("#Mobilephone").val() == "") {
            $.messager.alert("提示", "请输入移动电话！", "info");
            return false;
        }
        if (!$("#editUserform").form('validate')) {
            $.messager.alert("提示", "数据格式有误！", "info");
            return false;
        }
        var unitid = '';
        unitid = $("#unitlist").combobox("getValues");
        var OpenAlarmMsg = 0, OpenAlarmEmail = 0;
        var rolelist = CheckboxValue();
        if ($('#cbkAlarmMsg').is(':checked'))
            OpenAlarmMsg = 1;               
        var postData = {
            UserName: $("#UserName").val(),
            Company: $("#Company").combobox("getText"),
            UID: $("#Company").combobox("getValue"),
            Post: $("#Post").val(),
            Telephone: $("#Telephone").val(),
            Mobilephone: $("#Mobilephone").val(),
            UserID: $("#UserID").val(),
            UNITList: unitid.join(','),
            RoleList: rolelist,
            Email: $("#Email").val(),
            OpenAlarmMsg: OpenAlarmMsg,
            OpenAlarmEmail: OpenAlarmEmail,
            LogUrl: $("#Menu_Img").val(),
            GroupName: $("#GroupName").val()
        };
       // 发送异步请求，添加用户
        $.post("/UserInfo/SaveUserInfo", postData, function (data) {
            if (data == "OK") {
                $.messager.alert("提示", "用户编辑成功！", "info");
                $('#editwin').window('close');
            }
            else {
                alert(data);
            }
        });
    });
});
//全取图标
function Get_Menu_Img(img) {
    $("#Img_Menu_Img").attr("src", '/Content/Images/Logo/' + img);
    $("#Menu_Img").val(img);
}