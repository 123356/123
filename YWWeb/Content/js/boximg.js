//		 var records = [

//		 				{ pic: '<a target="_blank" href="../Content/images/xct1.jpg" class="toolbox"><img src="../Content/images/xct1.jpg" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct2.jpg" class="toolbox"><img src="../Content/images/xct2.jpg" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct1.jpg" class="toolbox"><img src="../Content/images/xct1.jpg" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct2.jpg" class="toolbox"><img src="../Content/images/xct2.jpg" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct1.jpg" class="toolbox"><img src="../Content/images/xct1.jpg" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct2.jpg" class="toolbox"><img src="../Content/images/xct2.jpg" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct1.jpg" class="toolbox"><img src="../Content/images/dbgd.png" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct2.jpg" class="toolbox"><img src="../Content/images/xct2.jpg" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct1.jpg" class="toolbox"><img src="../Content/images/dbgd.png" /></a>' },
//						{ pic: '<a target="_blank" href="../Content/images/xct2.jpg" class="toolbox"><img src="../Content/images/xct2.jpg" /></a>' }
//		 				
//						
//						
//						];
var curPage = 1;
var pageCount = 0;
var pageSize = 6;

function GetPage(pageIndex) {
    //获取总页数
    GetPageCount();

    if (isNaN(pageIndex))
        curPage = 1;
    curPage = pageIndex;
    if (curPage < 0)
        curPage = 1;
    if (curPage > pageCount)
        curPage = pageCount;

    //设置分页内容
    ShowList(curPage);

    var strPage = "";

    // 设置分页页码
    for (var i = 1; i <= pageCount; i++) {
        if (i == curPage)
            strPage += "<a href='#' class='selected'>" + i + "</a>";
        else
            strPage += "<a href='javascript:GetPage(" + i + ");'>" + i + "</a>";
    }




    // 设置上一页，下一页
    GetPrePage();
    GetNextPage();


    var x = 10;
    var y = 200;


    $("a.toolbox").mouseover(function (e) {
        this.myTitle = this.href;
        //this.title = "";	
        //var imgTitle = this.myTitle? "<br/>" + this.myTitle : "";
        var toolbox = "<div id='toolbox'><img src='" + this.myTitle + "' height='360px' width='480px'/><div>"; //创建 div 元素
        $("body").append(toolbox); //把它追加到文档中						 
        $("#toolbox")
						.css({
						    "top": (e.pageY - y) + "px",
						    "left": (e.pageX + x) + "px"
						}).show(300);   //设置x坐标和y坐标，并且显示
    }).mouseout(function () {
        //this.title = this.myTitle;	
        $("#toolbox").remove();  //移除 
    }).mousemove(function (e) {
        $("#toolbox").css({
            "top": (e.pageY - y) + "px",
            "left": (e.pageX + x) + "px"
        });
    });
}

function ShowList(pageIndex) {
    var strList = "";
    var obj;

    for (var j = (pageIndex - 1) * pageSize; j < pageIndex * pageSize; j++) {
        if (j < records.length) {
            obj = records[j];
            strList += "<dl><dt>" + obj["pic"] + "</dt></dl>";
        }
        else {
            break;
        }
    }
    J$("list").innerHTML = strList;
}

function GetPageCount() {
    pageCount = parseInt(Math.ceil(records.length * 1.0 / pageSize), 10);
}

function GetPrePage() {
    if (curPage > 1)
        J$("prevPage").innerHTML = "<a href='javascript:GetPage(" + (curPage - 1) + ")' onfocus='this.blur()'><img src='../content/images/pageleft.png' border=0 /></a>";
    else
        J$("prevPage").innerHTML = "<img src='../content/images/pageleft.png' />";
}

function GetNextPage() {
    if (curPage < pageCount)
        J$("nextPage").innerHTML = "<a href='javascript:GetPage(" + (curPage + 1) + ")' onfocus='this.blur()'><img src='../content/images/pageright.png' border=0 /></a>";
    else
        J$("nextPage").innerHTML = "<img src='../content/images/pageright.png' />";
}



function J$(o) {
    if (typeof (o) == "object")
        return o;
    return document.getElementById(o);
}

window.onload = function () {
    GetPage(1);
}
//]]