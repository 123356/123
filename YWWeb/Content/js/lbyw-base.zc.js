//获取参数值
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
/**
获取选中复选框值
值：1,2,3,4
**/
function CheckboxValue() {
    var spCodesTemp = "";
    $('input:checkbox[name=checkbox]:checked').each(function (i) {
        if (0 == i) {
            spCodesTemp = $(this).val();
        } else {
            spCodesTemp += ("," + $(this).val());
        }
    });
    return spCodesTemp;
}
function DisenableCheckboxValue() {
    var spCodesTemp = "";
    $('input:checkbox[name=desenabledcheckbox]:checked').each(function (i) {
        if (0 == i) {
            spCodesTemp = $(this).val();
        } else {
            spCodesTemp += ("," + $(this).val());
        }
    });
    return spCodesTemp;
}
function CheckboxValueInfo() {
    var spCodesTemp = "";
    $('input:checkbox[name=checkbox]:checked').each(function (i) {
        if (0 == i) {
            spCodesTemp = $(this).val();
        } else {
            spCodesTemp += ("$" + $(this).val());
        }
    });
    return spCodesTemp;
}
//复选框类型判断
function getSelectedType(sellist) {
    var tst = sellist + '';
    var arrlist = tst.split(',');

    var typecount = 0;
    var strtype = ",", cuutype = '';

    for (var i = 0; i < arrlist.length; i++) {
        cuutype = arrlist[i];
        if (cuutype.indexOf('_') >= 0) {
            if (strtype.indexOf(',' + cuutype.split('_')[0] + ',') < 0) {
                strtype = strtype + cuutype.split('_')[0] + ",";
                typecount = typecount + 1;
            }
        }
    }
    return typecount;
}
//日期格式转意
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//获取日期
function getMDate(MDate, txtMDate) {
    var usefulDate = new Date("2005/01/01").Format("yyyy-MM-dd");
    if (MDate != "") {
        var mdate = new Date(MDate).Format("yyyy-MM-dd");
        if (mdate > usefulDate)
            $('#' + txtMDate).datebox('setValue', mdate);
        else
            $('#' + txtMDate).datebox('setValue', "");
    }
}

/**
格式化时间显示方式、用法:format="yyyy-MM-dd hh:mm:ss";
*/
formatDate = function (v, format) {
    if (!v) return "";
    v = v.replace("星期一", "").replace("星期二", "").replace("星期三", "").replace("星期四", "").replace("星期五", "").replace("星期六", "").replace("星期日", "");
    var d = v;
    if (typeof v === 'string') {
        if (v.indexOf("/Date(") > -1)
            d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
        else
            d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0])); //.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
    }
    var o = {
        "M+": d.getMonth() + 1,  //month
        "d+": d.getDate(),       //day
        "h+": d.getHours(),      //hour
        "m+": d.getMinutes(),    //minute
        "s+": d.getSeconds(),    //second
        "q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
        "S": d.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
/*弹出网页
/*url:          表示请求路径
/*_id:          ID
/*_title:       标题名称
/*width:        宽度
/*height:       高度
---------------------------------------------------*/
function openDialog(url, _id, _title, _width, _height, left, top) {
    art.dialog.open(url, {
        id: _id,
        title: _title,
        width: _width,
        height: _height,
        left: left + '%',
        top: top + '%',
        background: '#000000',
        opacity: 0.1,
        lock: true,
        resize: false,
        close: function () { }
    }, false);
}
//窗口关闭
function OpenClose() {
    art.dialog.close();
}

/*
表格视图列名
*/
function columnModelData(jgrid) {
    AjaxJson("/Utility/LoadViewColumn", {}, function (data) {
        $.each(data, function (i) {
            $(jgrid).hideCol(data[i].FieldName);
        });
    });
}

//分配按钮
function loadButtonList() {
    var url = window.location.pathname;
    $.post("/SysInfo/UserButtonList", { "CurrUrl": url }, function (data) {
        var obj = eval("(" + data + ")");
        $("#userbutton").html(obj);
    });
}

$(function () {
    loadButtonList();
});


/**
初始化样式
**/
function publicobjcss() {
    /*****************普通表格********************************/
    $('.grid tr').hover(function () {
        $(this).addClass("trhover");
    }, function () {
        $(this).removeClass("trhover");
    });
    $('.grid tbody tr:odd').addClass('alt');
    if ($('.grid').attr('singleselect') == 'true') {
        $('.grid tr td').click(function (e) {
            if ($(this).parents('tr').find("td").hasClass('selected')) {
                $('.grid tr td').parents('tr').find("td").removeClass('selected');
                $('.grid tr td').parents('tr').find('input[type="checkbox"]').removeAttr('checked');
            } else {
                $('.grid tr td').parents('tr').find("td").removeClass('selected');
                $('.grid tr td').parents('tr').find('input[type="checkbox"]').removeAttr('checked');
                $(this).parents('tr').find("td").addClass('selected');
                $(this).parents('tr').find('input[type="checkbox"]').attr('checked', 'checked');
            }
        });
    } else {
        $('.grid tr td').click(function (e) {
            if (!$(this).hasClass('oper')) {
                if ($(this).parents('tr').find("td").hasClass('selected')) {
                    $(this).parents('tr').find("td").removeClass('selected');
                    $(this).parents('tr').find('input[type="checkbox"]').removeAttr('checked');
                } else {
                    $(this).parents('tr').find("td").addClass('selected');
                    $(this).parents('tr').find('input[type="checkbox"]').attr('checked', 'checked');
                }
            }
        });
    }
    /*****************树表格********************************/
    $('#dnd-example tbody tr:odd').addClass('alt');
    $("#dnd-example tr").click(function () {
        $('#dnd-example tr').removeClass("selected");
        $(this).addClass("selected"); //添加选中样式   
    })
    /*****************按钮********************************/
    $(".l-btn").hover(function () {
        $(this).addClass("l-btnhover");
        $(this).find('span').addClass("l-btn-lefthover");
    }, function () {
        $(this).removeClass("l-btnhover");
        $(this).find('span').removeClass("l-btn-lefthover");
    });
}
/**********复选框 全选/反选**************/
var CheckAllLinestatus = 0;
function CheckAllLine() {
    if (CheckAllLinestatus == 0) {
        CheckAllLinestatus = 1;
        $("#checkAllOff").attr('title', '反选');
        $("#checkAllOff").attr('id', 'checkAllOn');
        $(".grid :checkbox").attr("checked", true);
        $('.grid tr').find('td').addClass('selected');
        //$("#dnd-example :checkbox").attr("checked", true);
        $('#dnd-example tr').find('td').addClass('selected');

        $("#dnd-example").find("input[type='checkbox']").prop("checked", true);



    } else {
        CheckAllLinestatus = 0;
        $("#checkAllOn").attr('title', '全选');
        $("#checkAllOn").attr('id', 'checkAllOff');
        $(".grid :checkbox").attr("checked", false);
        $('.grid tr').find('td').removeClass('selected');
        //$("#dnd-example :checkbox").attr("checked", false);

        $("#dnd-example").find("input[type='checkbox']").removeAttr("checked");

        $('#dnd-example tr').find('td').removeClass('selected');
    }
}
//树表格复选框，点击子，把父也打勾
function ckbValueObj(e) {
    var item_id = '';
    var arry = new Array();
    arry = e.split('-');
    for (var i = 0; i < arry.length - 1; i++) {
        item_id += arry[i] + '-';
    }
    //$("#dnd-example").find("input[id='" + e + "']").prop("checked", true);

    item_id = item_id.substr(0, item_id.length - 1);
    if (item_id != "") {
        //$("#dnd-example").find("input[id='" + item_id + "']").prop("checked", true);
        //$("#" + item_id).attr("checked", true);
        $("#dnd-example").find("input[id='" + item_id + "']").prop("checked", true);
        ckbValueObj(item_id);
    }
}
/*
中间加载对话窗
*/
function Loading(bool, text) {
    var ajaxbg = top.$("#loading_background,#loading");
    if (!!text) {
        top.$("#loading").css("left", (top.$('body').width() - top.$("#loading").width()) / 2);
        top.$("#loading span").html(text);
    } else {
        top.$("#loading").css("left", "42%");
        top.$("#loading span").html("正在加载，点击取消");
    }
    if (bool) {
        ajaxbg.show();
    } else {
        ajaxbg.hide();
    }
}
/*重置图片大小，等比例缩放*/
function DrawImage(ImgD, FitWidth, FitHeight) {

    var image = new Image();

    image.src = ImgD.src;

    if (image.width > 0 && image.height > 0) {

        if (image.width / image.height >= FitWidth / FitHeight) {

            if (image.width > FitWidth) {

                ImgD.width = FitWidth;

                ImgD.height = (image.height * FitWidth) / image.width;

            } else {

                ImgD.width = image.width;

                ImgD.height = image.height;

            }

        } else {

            if (image.height > FitHeight) {

                ImgD.height = FitHeight;

                ImgD.width = (image.width * FitHeight) / image.height;

            } else {

                ImgD.width = image.width;

                ImgD.height = image.height;

            }

        }
    }
}

//生成时间轴
//数量，时间间隔（min）,结束时间
function BuildxAxis(count, diff, ed) {
    var dategg = new Date();
    var xAixs = [];
    for (i = count; i > 0; i--) {
        dategg.setMinutes(dategg.getMinutes() - diff * i);
        xAixs.push(dategg.toLocaleDateString() + " " + dategg.getHours() + ":" + dategg.getMinutes() + ":" + dategg.getSeconds());
    }
    return xAixs;
}

//生成随机数列
//基数，数量，偏差
function RandomValue(base, count, diff) {
    var yAixs = [];
    for (i = count; i > 0; i--) {
        yAixs.push(parseInt(base + Math.random() * diff));
    }
    return yAixs;
}