//datagrid宽度高度自动调整的函数
$.fn.extend({
    resizeDataGrid: function (pageHeight, pageWidth, heightMargin, widthMargin, minHeight, minWidth) {
        var height = pageHeight - heightMargin;
        var width = pageWidth - widthMargin;
        height = height < minHeight ? minHeight : height;
        width = width < minWidth ? minWidth : width;
        $(this).datagrid('resize', {
            height: height,
            width: width
        });
    }
});
var pageHeight, pageWidth;
if (typeof window.innerHeight != 'undefined') {
    //针对非IE8及其以下的浏览器
    pageHeight = window.innerHeight;
    pageWidth = window.innerWidth;
    var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
//    if (!isChrome) {
//        pageHeight = pageHeight - 10;
//    }
}
$('#list_data').resizeDataGrid(pageHeight, pageWidth, 2,10, 0, 0);
$(window).resize(function () {
    var pageHeight, pageWidth;
    if (typeof window.innerHeight != 'undefined') {
        //针对非IE8及其以下的浏览器
        pageHeight = window.innerHeight;
        pageWidth = window.innerWidth;
        var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
//        if (!isChrome) {
//            pageHeight = pageHeight - 10;
//        }
    }
    $('#list_data').resizeDataGrid(pageHeight, pageWidth, 2, 10, 0, 0);
});