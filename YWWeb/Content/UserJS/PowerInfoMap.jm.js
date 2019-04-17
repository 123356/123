var x, y;
var polyline = new BMap.Polygon([
    new BMap.Point(116.633085, 40.137482), //右上
    new BMap.Point(116.67103, 39.735616), //右下
    new BMap.Point(116.107612, 39.706313), //左下
    new BMap.Point(116.12371, 40.155131) //左上

], { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 }); //创建多边形

function getBoundary() {
    var bdary = new BMap.Boundary();
    bdary.get("北京", function(rs) { //获取行政区域

        var EN_JW = "180, 90;"; //东北角
        var NW_JW = "-180,  90;"; //西北角
        var WS_JW = "-180, -90;"; //西南角
        var SE_JW = "180, -90;"; //东南角

        var count = rs.boundaries.length; //行政区域的点有多少个
        var index = 0
        if (count > 1) {
            index = 1
        } else if (count == 1) {
            index = 0
        }

        //4.添加环形遮罩层
        var ply1 = new BMap.Polygon(rs.boundaries[index] + SE_JW + SE_JW + WS_JW + NW_JW + EN_JW + SE_JW, {
            strokeColor: "none",
            fillColor: "rgb(0,0,0)",
            fillOpacity: 0.5,
            strokeOpacity: 0.5
        }); //建立多边形覆盖物
        powerMap.addOverlay(ply1);


        var ply = new BMap.Polygon(rs.boundaries[index], {
            strokeWeight: 2,
            strokeColor: "red",
            fillColor: '',
        }); //建立多边形覆盖物
        powerMap.addOverlay(ply);
        console.log(powerMap.getOverlays()[0].getPosition())
        $.post("/PDRInfo/getStationInfo", function(data) {
            var arrdata = data.split('$');
            var arr = eval("(" + arrdata[0] + ")");
            for (var i = 0; i < arr.length; i++) {

                if (arr[i].title == '1号_移动电源箱') {
                    markerArr.push(arr[i])
                }
                if (arr[i].title == '1号_工程车') {
                    markerArr.push(arr[i])

                    var lng = arr[i].point.split("|")[0]
                    var lat = arr[i].point.split("|")[1]

                    var re = BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(lng, lat), ply);
                    if (!re) {
                        $("#hitnInfo").text("工程车超出范围")
                        $("#alarmDyx").show()
                    }

                }
            }
        });
    });
}


function createLine() {
    getBoundary()
        //powerMap.addOverlay(polyline);
}
try {
    var geo = new jQuery.AMUI.Geolocation({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000
    });
    geo.get().then(function(position) {
        // 成功回调，position 为返回的位置对象
        x = position.coords.longitude;
        y = position.coords.latitude;
    }, function(err) {
        // 不支持或者发生错误时回调，err 为错误提示信息

    });
} catch (err) {}



$.ajaxSettings.async = false; //同步才能获取数据
var markerArr = new Array();
$.post("/PDRInfo/getStationInfo", function(data) {
    var arrdata = data.split('$');
    var arr = eval("(" + arrdata[0] + ")");
    for (var i = 0; i < arr.length; i++) {

        if (arr[i].title == '1号_移动电源箱') {
            markerArr.push(arr[i])
        }
        if (arr[i].title == '1号_工程车') {
            markerArr.push(arr[i])

            //var lng = arr[i].point.split("|")[0]
            //var lat = arr[i].point.split("|")[1]

            //var re = BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(lng, lat), ply);
            //if (!re) {
            //    $("#hitnInfo").text("工程车超出范围")
            //    $("#alarmDyx").show()
            //}

        }
    }
});


if (x == undefined)
    x = 116.3;
if (y == undefined)
    y = 39.9;


var pageHeight, pageWidth;
if (typeof window.innerHeight != 'undefined') {
    //针对非IE8及其以下的浏览器
    pageHeight = window.innerHeight - 10;
    pageWidth = window.innerWidth - 10;
} else {
    if (document.compatMode == "CSS1Compat") {
        //判断是否处于混杂模式
        pageHeight = document.documentElement.clientHeight - 10;
        pageWidth = document.documentElement.clientWidth - 10;
    } else {
        pageHeight = document.body.clientHeight - 10;
        pageWidth = document.body.clientWidth - 10;
    }
}
pageWidth = window.screen.width;
//初始化地图
function initMap() {
    createMap(); //创建地图
    createLine() //绘画矩形
    setMapEvent(); //设置地图事件
    addMapControl(); //向地图添加控件
    addMarker();
    mqtt()

    //addMarker(); //向地图中添加marker
}
//创建地图
function createMap() {
    //console.log(x+"--"+y)
    var powerMap = new BMap.Map("powerMap"); //在百度地图容器中创建一个地图
    var point = new BMap.Point(116.545725, 39.779821); //定义一个中心点坐标
    powerMap.centerAndZoom(point, 10); //设定地图的中心点和坐标并将地图显示在地图容器中
    //map.setMapType(BMAP_HYBRID_MAP);

    // map.setMapStyle({ style: 'grayscale' });//grayscale
    powerMap.setMapStyle({
        styleJson: [

            { //整体风格
                "featureType": "all",
                "elementType": "all",
                "stylers": {
                    "lightness": 30,
                    "saturation": -100
                }
            },
            { //道路不显示文字
                "featureType": "highway",
                "elementType": "labels",
                "stylers": {
                    "lightness": 10,
                    "saturation": -100,
                    "visibility": "off"
                }
            },
            {
                "featureType": "poilabel",
                "elementType": "labels",
                "stylers": {
                    "lightness": 10,
                    "saturation": -100,
                    "visibility": "off"
                }
            },

            {
                "featureType": "scenicspotslabel",
                "elementType": "all",
                "stylers": {
                    "lightness": 10,
                    "saturation": -100,
                    "visibility": "on"
                }
            }
        ]
    })
    window.powerMap = powerMap; //将map变量存储在全局
}
//地图事件设置
function setMapEvent() {
    powerMap.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
    powerMap.enableScrollWheelZoom(); //启用地图滚轮放大缩小
    powerMap.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
    powerMap.enableKeyboard(); //启用键盘上下左右键移动地图
}
//地图控件添加函数：
function addMapControl() {
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
    powerMap.addControl(ctrl_nav);
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
    powerMap.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
    powerMap.addControl(ctrl_sca);
    //var mapType1 = new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] });
    //map.addControl(mapType1);   //添加地图类型控件
}



//*************************************************************
var iwa = new Array();
var g_showPDROk = 1;
var changeMarkerArr = new Array()

function addMarker() {
    for (var i = 0; i < markerArr.length; i++) {
        var a = markerArr[i];
        var b = a.point.split("|")[0];
        var c = a.point.split("|")[1];
        //var typeid = a.position;
        var point = new BMap.Point(b, c);

        //alert(a.content);		
        showControl_ClickPDR(a.title);
        if (g_showPDROk == 0) {
            typeid = 19; //限制点击
        }
        var d = createIcon({ w: 22, h: 32, l: 0, t: 0, x: 6, lb: 5 }, a.title);

        var marker = new BMap.Marker(point, { icon: d });
        marker.pid = markerArr[i].pid
        changeMarkerArr.push(marker)
        var f = new BMap.Label(a.title, { "offset": new BMap.Size(-10, 30) });
        f.setTitle(a.title);

        marker.setLabel(f);
        marker.setZIndex(10);


        powerMap.addOverlay(marker);

        f.setStyle({ border: "none", color: "#666", cursor: "pointer", background: "transparent", fontWeight: "bold", textShadow: "-1px 0px 1px #fff" });

        showinfomessage(marker, point, a);

    }

    /* setTimeout(function () {
         setInterval(function () {
             changeMarkerLocation()
         }, 5000)
     }, 1000)
     */

}





function showinfomessage(marker, point, data) {
    var opts = {
        width: 320,
        height: 130,
    }

    var html = "<table class='mapTable'>";
    var isAlarm = data.isAlarm
    switch (isAlarm) {
        case 0:
            isAlarm = '<span class="status" >正常运行</span>'
            break
        case 1:
            isAlarm = '<span class="status" style="color:#e0d21d">一般</span>'
            break
        case 2:
            isAlarm = '<span class="status" style="color:#ef7200">严重</span>'
            break
        case 3:
            isAlarm = '<span class="status" style="color:#cc0d0d">危急</span>'
            break

    }
    var time = data.CoordinationTime
    if (time == null || time == "") {
        time = "--"
    }
    /*if (data.Type == 1) {*/

    if (data.title == '1号_移动电源箱') {

        html += '<tr style=""><td style="padding-top:5px;"><i class="iconfont icon-lvyouchengshijianzhucity-dalouxiezilou"></i><span style="font-weight:bold">' + data.title + '</span><a href="JavaScript:toDetail(' + data.pid + ')">详情&gt;</a><span class="status" >正常运行</span></td></tr>'
        html += '<tr style="font-size:11px"><td ><i class="iconfont icon-location"></i>' + data.adress + '</td></tr>'
        html += '<tr style=""><td style="padding-top:5px;padding-bottom:5px"><hr/ style="margin-bottom:0px"></td></tr>'
        html += '<tr style="font-size:11px"><td >电压等级：' + data.VName + '</td></tr>'

        html += '<tr style="font-size:11px"><td style="padding-top:5px;">联系人：张工<span style="margin-left:40px">电话：13681345687</span></td></tr>'
        html += '<tr style="font-size:11px"><td style="padding-top:5px;" id="dwtime1">定位时间：' + time + '</td></tr>'
    } else {
        html += '<tr style=""><td style="padding-top:5px;"><i class="iconfont icon-lvyouchengshijianzhucity-dalouxiezilou"></i><span style="font-weight:bold">' + data.title + '</span><a href="JavaScript:toDetail(' + data.pid + ')"></a></td></tr>'
        html += '<tr style="font-size:11px"><td ><i class="iconfont icon-location"></i>' + data.adress + '</td></tr>'
        html += '<tr style=""><td style="padding-top:5px;padding-bottom:5px"><hr/ style="margin-bottom:0px"></td></tr>'
        html += '<tr style="font-size:11px"><td >车牌：京GH4348</td></tr>'

        html += '<tr style="font-size:11px"><td style="padding-top:5px;">驾驶员：白唐光<span style="margin-left:40px">电话：13681226520</span></td></tr>'
        html += '<tr style="font-size:11px"><td style="padding-top:5px;" id="dwtime2">定位时间：' + time + '</td></tr>'
    }

    html += '</table>';
    var infoWindow = new BMap.InfoWindow(html, opts); // 创建信息窗口对象
    var infoBox = new BMapLib.InfoBox(powerMap, html, {
        boxStyle: {
            width: '400px',
            height: '200px',
            background: 'rgba(0,0,0,0.6)'
        }
    })


    //添加鼠标滑过时打开自定义信息窗口事件
    /* marker.addEventListener("click", function () {
         marker_id = point;
         powerMap.openInfoWindow(infoWindow, point);
         
         //infoBox.open(marker)
     });*/
    marker.addEventListener("mouseover", function() {

        powerMap.closeInfoWindow();
        marker_id = point;

        var lng = marker.point.lng
        var lat = marker.point.lat

        var point2 = new BMap.Point(lng, lat);
        powerMap.openInfoWindow(infoWindow, point2);
    });

}

function toDetail(data) {
    var url = "/Home/PowerMapDetail?pid=" + data;
    myWindow = window.open(url, '', 'width=1300,height=800,location=no');
    myWindow.focus();

}

function ShowPID(i) {
    var a = markerArr[i];
    alert(a.content);
}

//
function createIcon(a, title) {
    var aUrl;
    if (title == '1号_移动电源箱') {
        aUrl = "../../Content/images/location_icon/2.png";
        return new BMap.Icon(aUrl, new BMap.Size(22, 32), {
            anchor: new BMap.Size(22 / 2, 32)
        });
    } else {

        aUrl = "https://lbsyun.baidu.com/jsdemo/img/car.png";
        return new BMap.Icon(aUrl, new BMap.Size(52, 26), {
            anchor: new BMap.Size(27, 13)
        });
    }
}

initMap();

function setLocation(x, y, z) { var a = new BMap.Point(x, y);
    powerMap.centerAndZoom(a, z); }
//
function SetMapPointState(a, b, c) {
    var g = powerMap.getOverlays();
    for (var i = 0; i < g.length; i++) {
        if ("[object Marker]" === g[i].toString() && g[i].getLabel().content == a) {
            var d = g[i];
            if (b == 0) {
                d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + ".png", new BMap.Size(22, 32)));
            } else {
                d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + "_" + b + ".png", new BMap.Size(22, 32)));
                d.setTop(true);
            }
        }
    }
}

function SetAlarmStateNew(jsonlist) {
    var g = powerMap.getOverlays();
    for (var i = 0; i < g.length; i++) {
        if ("[object Marker]" === g[i].toString()) {
            var d = g[i];
            var blSet = 0;
            for (var jcount = 0; jcount < jsonlist.length; jcount++) {
                if (d.getLabel().content == jsonlist[jcount].name) {
                    var c = 2
                    var b = jsonlist[jcount].state;
                    if (c > 11)
                        c = 1;
                    if (b == 0) {
                        d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + ".png", new BMap.Size(22, 32)));
                    } else {
                        d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + "_" + b + ".png", new BMap.Size(22, 32)));
                        d.setTop(true);
                    }
                    blSet = 1;
                }
            }
            if (blSet == 0) {
                //取无权限站标识
                var tmp_dIcon = d.getIcon();
                var tmp_imageUrl = tmp_dIcon.imageUrl;
                tmp_imageUrl = tmp_imageUrl.replace("_1.gif", ".png");
                tmp_imageUrl = tmp_imageUrl.replace("_2.gif", ".png");
                tmp_imageUrl = tmp_imageUrl.replace("_3.gif", ".png");

                d.setIcon(new BMap.Icon(tmp_imageUrl, new BMap.Size(22, 32)));
            }
        }
    }
}

function setMapType(a) { if ("BMAP_NORMAL_MAP" == a) { powerMap.setMapType(BMAP_NORMAL_MAP); } if ("BMAP_SATELLITE_MAP" == a) { powerMap.setMapType(BMAP_SATELLITE_MAP); } if ("BMAP_HYBRID_MAP" == a) { powerMap.setMapType(BMAP_HYBRID_MAP); } }

function setPanoramaControl(i) { powerMap.addTileLayer(new BMap.PanoramaCoverageLayer()); var a = new BMap.PanoramaControl();
    a.setOffset(new BMap.Size(20, 20));
    powerMap.addControl(a); }
var myLocalSearch = new BMap.LocalSearch(powerMap, { renderOptions: { powerMap: powerMap } });

function localSearch(sVal) { myLocalSearch.search(sVal); }

function clearLocalSearch() { myLocalSearch.clearResults(); }
var mBMTC = new BMapLib.TrafficControl({ showPanel: false });

function setTrafficControl(i) { if ("0" == i) { mBMTC.remove(); } if ("1" == i) { powerMap.addControl(mBMTC);
        mBMTC.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);
        mBMTC.showTraffic(); } }

function setMapIndexViewport() {
    var a = [];
    var g = powerMap.getOverlays();
    for (var i = 0; i < g.length; i++) {
        if ("[object Label]" != g[i].toString()) {
            var d = g[i];
            a.push(d.getPosition());
        }
    }
    powerMap.setViewport(a);
}


//设置站点进入权限
function showControl_ClickPDR(a) {
    //需要提示的站名称
    g_showPDROk = 1;

    var str1 = [
        { "name": "1-" },
        { "name": "2-" }
    ];

    for (var i = 0; i < str1.length; i++) {
        if (a == str1[i].name) {
            g_showPDROk = 0;
            break;
        }
    }
}


var myDis = new BMapLib.DistanceTool(powerMap);

function setMyDistanceTool(i) { if (1 == i) { myDis.open(); } if (0 == i) { myDis.close(); } }

function killErrors() { return true; }
window.onerror = killErrors;

//创建多边形区域




//生产随机坐标
function getRound(temp) {
    var i = Math.round(Math.random() * 9 + 1);
    if (i % 2 == 0) {
        return temp + i * 0.00001;
    } else {
        return temp - i * 0.00001;
    }
}

function isInsidePolygon() {
    var pt = new BMap.Point(116.545725, 39.779821)
    var re = BMapLib.GeoUtils.isPointInPolygon(pt, polyline);
}
//改变marker值
function changeMarkerLocation(data) {

    for (var i = 0; i < changeMarkerArr.length; i++) {
        // var lng = getRound(changeMarkerArr[i].point.lng);
        //var lat = getRound(changeMarkerArr[i].point.lat);
        //var point = new BMap.Point(lng, lat)

        if (changeMarkerArr[i].pid == data.pid) {
            changeMarkerArr[i].setPosition(data.point);
            markerArr[i].CoordinationTime = data.time

            if (data.pid == "169") {
                var re = BMapLib.GeoUtils.isPointInPolygon(data.point, polyline);
                if (!re) {
                    $("#hitnInfo").text("工程车超出范围")
                    $("#alarmDyx").show()
                }
            }
            showinfomessage(changeMarkerArr[i], data.point, markerArr[i])

        }
    }
}

//连接mqtt
function mqtt() {

    var wsbroker = location.host; //  59.110.153.200
    location.hostname; //mqtt websocket enabled broker ip
    var wsport = 15673; // 端口号
    //连接选项
    var options = {
        timeout: 30,
        userName: "test",
        password: "123",
        keepAliveInterval: 10,
        onSuccess: function() {
            console.log(("连接成功"))
            client.subscribe('gps/ny/167', { qos: 2 }); //订阅主题
        },

        onFailure: function(message) {
            console.log("连接失败 " + message.errorMessage)
        }
    };
    if (location.protocol == "https:") {
        options.useSSL = true;
    }
    client = new Paho.MQTT.Client(wsbroker, wsport, "/ws", "myclientid_" + guid());
    //创建连接
    client.connect(options);
    client.onConnectionLost = function(responseObject) {

        if (responseObject.errorCode !== 0) { console.log("异常掉线，掉线信息为:" + responseObject.errorMessage);
            client = new Paho.MQTT.Client(wsbroker, wsport, "/ws", "myclientid_" + guid()); }
    };
    client.onMessageArrived = function(message) {
        console.log(message)
        var msg = message.payloadString
        msg = JSON.parse(msg)
        var lng = msg.location.split("|")[0]
        var lat = msg.location.split("|")[1]
        var point = new BMap.Point(lng, lat)

        var data = {
            pid: msg.pid,
            point: point,
            time: msg.time
        }
        changeMarkerLocation(data);
        $("#dwtime1").html("定位时间：" + (new Date().Format("yyyy-MM-dd hh:mm:ss")) + "");
        $("#dwtime2").html("定位时间：" + (new Date().Format("yyyy-MM-dd hh:mm:ss")) + "");
        console.log("接收消息")
        console.log(message.payloadString)
    };
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}