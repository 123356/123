var x, y;
var polyline = null
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

//获取站点数据
var markerArr = new Array();
/*$.post("/PDRInfo/getStationInfo", function(data) {
    var arrdata = data.split('$');
    var arr = eval("(" + arrdata[0] + ")");
    markerArr = arr;
});
console.log(markerArr)
$.post("/Home/GetShopTruck", function(data) {
    console.log(data);
    for (var a = 0; a < data.length; a++) {
        data[a].type = 'car';
        markerArr.push(data[a]);
    }
});*/
$.post("/Home/LoadConstract", function (data) {
    console.log(data);
    for (var a = 0; a < data.length; a++) {
        data[a].type = 'car';
        markerArr.push(data[a]);
    }
});

if (x == undefined)
    x = 116.3;
if (y == undefined)
    y = 39.9;
console.log()

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
    //createLine()//绘画矩形
    setMapEvent(); //设置地图事件
    addMapControl(); //向地图添加控件
    addMarker();
    //mqtt()

    //addMarker(); //向地图中添加marker
}
//创建地图
function createMap() {
    //console.log(x+"--"+y)
    var powerMap = new BMap.Map("powerMap"); //在百度地图容器中创建一个地图
    var point = new BMap.Point(116.545725, 39.779821); //定义一个中心点坐标
    powerMap.centerAndZoom(point, 12); //设定地图的中心点和坐标并将地图显示在地图容器中
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
      
        var b = a.Coordination.split("|")[0];
        var c = a.Coordination.split("|")[1];
       
        //var typeid = a.position;
        var point = new BMap.Point(b, c);

        //alert(a.content);		
        showControl_ClickPDR(a.title);
        if (g_showPDROk == 0) {
            typeid = 19; //限制点击
        }
        var d = createIcon({ w: 22, h: 32, l: 0, t: 0, x: 6, lb: 5 }, a.type);

        var marker = new BMap.Marker(point, { icon: d });
        marker.pid = markerArr[i].pid
        changeMarkerArr.push(marker)
        
        var f = new BMap.Label(a.ProjectName, { "offset": new BMap.Size(-10, 30) });
       
        f.setTitle(a.ProjectName);

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

    //console.log(changeMarkerArr)
}





function showinfomessage(marker, point, data) {
    // console.log(data);
    var opts = {
        width: 320,
        height: 130,
    }

    var html = "<table class='mapTable'>";
    var proType = ''
    switch (data.Type) {
        case 1:
            proType = "工程施工"
            break;
        case 2:
            proType = "电力设计"
            break;
        case 3:
            proType = "设备产品"
            break;
        case 4:
            proType = "运维实验"
            break;
        case 5:
            proType = "管理"
            break;
        case 6:
            proType = "系统开发"
            break;
        case 7:
            proType = "设计管理"
            break;
        case 8:
            proType = "测绘"
            break;
    }
    
    html += '<tr style=""><td style="padding-top:5px;"><i class="iconfont icon-lvyouchengshijianzhucity-dalouxiezilou"></i><span style="font-weight:bold">' + data.ProjectName + '</span><a href="JavaScript:toDetail(' + data.ID + ')">详情</a><a href="/Content/baiduMap/hawkEye/manager.html">轨迹查询</a></td></tr>'
        html += '<tr style="font-size:11px"><td ><i class="iconfont icon-location"></i>' + data.Adress + '</td></tr>'
        html += '<tr style=""><td style="padding-top:5px;padding-bottom:5px"><hr/ style="margin-bottom:0px"></td></tr>'
        html += '<tr style="font-size:11px"><td >项目类型：' + proType + '</td></tr>'
        html += '<tr style="font-size:11px"><td style="padding-top:5px;">项目联系人：' + data.ProjectManager + '<span style="margin-left:40px">电话：' + data.Tel + '</span></td></tr>'
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
    $.cookie('proId', data, { expires: 7, path: '/' });
    location.href = "/Constract/ProjectOverview?id=" + data;

}

function ShowPID(i) {
    var a = markerArr[i];
    alert(a.content);
}

//
function createIcon(a, type) {
    if (type == "car") {
        aUrl = "https://lbsyun.baidu.com/jsdemo/img/car.png";
        return new BMap.Icon(aUrl, new BMap.Size(52, 26),
            {
                anchor: new BMap.Size(27, 13)
            }
        );
    } else{
        return new BMap.Icon(aUrl, new BMap.Size(22, 32), {
            anchor: new BMap.Size(22 / 2, 32)
        });
        aUrl = "../../Content/images/location_icon/2.png";
    }
        
        
    
}

initMap();

function setLocation(x, y, z) {
    var a = new BMap.Point(x, y);
    powerMap.centerAndZoom(a, z);
}
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

function setPanoramaControl(i) {
    powerMap.addTileLayer(new BMap.PanoramaCoverageLayer());
    var a = new BMap.PanoramaControl();
    a.setOffset(new BMap.Size(20, 20));
    powerMap.addControl(a);
}
var myLocalSearch = new BMap.LocalSearch(powerMap, { renderOptions: { powerMap: powerMap } });

function localSearch(sVal) { myLocalSearch.search(sVal); }

function clearLocalSearch() { myLocalSearch.clearResults(); }
var mBMTC = new BMapLib.TrafficControl({ showPanel: false });

function setTrafficControl(i) {
    if ("0" == i) { mBMTC.remove(); }
    if ("1" == i) {
        powerMap.addControl(mBMTC);
        mBMTC.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);
        mBMTC.showTraffic();
    }
}

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

function createLine() {
    polyline = new BMap.Polygon([
        new BMap.Point(116.545649, 39.780209), //右上
        new BMap.Point(116.546026, 39.77971), //右下
        new BMap.Point(116.544167, 39.778873), //左下
        new BMap.Point(116.543781, 39.779337) //左上

    ], { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 }); //创建多边形
    powerMap.addOverlay(polyline);
}


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
    //console.log(changeMarkerArr)

    for (var i = 0; i < changeMarkerArr.length; i++) {
        // var lng = getRound(changeMarkerArr[i].point.lng);
        //var lat = getRound(changeMarkerArr[i].point.lat);
        //var point = new BMap.Point(lng, lat)
        if (changeMarkerArr[i].pid == data.pid) {
            changeMarkerArr[i].setPosition(data.point);
            if (data.pid == "167") {
                var re = BMapLib.GeoUtils.isPointInPolygon(data.point, polyline);
                if (!re) {
                    $("#alarmDyx").show()
                }
            }

        }
    }
}

//连接mqtt
function mqtt() {

    var wsbroker = "59.110.153.200";
    location.hostname; //mqtt websocket enabled broker ip
    var wsport = 15675; // 端口号
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

        if (responseObject.errorCode !== 0) {
            console.log("异常掉线，掉线信息为:" + responseObject.errorMessage);
            client = new Paho.MQTT.Client(wsbroker, wsport, "/ws", "myclientid_" + guid());
        }
    };
    client.onMessageArrived = function(message) {
        var msg = message.payloadString
        msg = JSON.parse(msg)
        var lng = msg.location.split("|")[0]
        var lat = msg.location.split("|")[1]
        var point = new BMap.Point(lng, lat)

        var data = {
            pid: msg.pid,
            point: point
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