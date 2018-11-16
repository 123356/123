var iwa = new Array();
var g_showPDROk = 1;
function addMarker() {
    for (var i = 0; i < markerArr.length; i++) {
        var a = markerArr[i];
        console.log(a);
        var b = a.point.split("|")[0];
        var c = a.point.split("|")[1];
        var typeid = a.position;
        var point = new BMap.Point(b, c);
		
		//alert(a.content);		
		showControl_ClickPDR(a.title);
		if(g_showPDROk==0){
			typeid = 19; //限制点击
		}
		
        var d = createIcon(a.icon, typeid);
        var e = new BMap.Marker(point, { icon: d });
       var f = new BMap.Label(a.title, { "offset": new BMap.Size(a.icon.lb - a.icon.x + 10, -20) });
        //var f = new BMap.Label(a.title, { "offset": new BMap.Size(-100, 100) });
        f.setTitle(a.content);

        e.setLabel(f);
        e.setZIndex(10);

        map.addOverlay(e);
        f.setStyle({ borderColor: "#808080", color: "#06f", cursor: "pointer" });
        
        showinfomessage(e, point,a);
        (function (x) {
            var index = i;
            var d = e;
            d.addEventListener("click", function (e) {
		
                var tmp_MLable = d.getLabel();
                var tmp_LTitle = tmp_MLable.getTitle();
				 
				//取无权限站标识
				var tmp_dIcon  = d.getIcon();
				var tmp_imageUrl = tmp_dIcon.imageUrl;
				if(tmp_imageUrl == "../../Content/images/location_icon/0.png"){
					alert("此站无权限!");
				}else{
					ShowInfoPage(tmp_LTitle);
				}				
            });

        })()

    }
    
}

function showinfomessage(marker, point, data) {
    console.log(data);
    var opts = {
        width: 100,    
        height: 230,     
        title: "<div style='height:30px;background-color:#4c8bf1;margin-top:6px;'><span style='vertical-align:middle;text-align:center;color:#fff;'>站点信息</span></div>"
    }
    var infoWindow = new BMap.InfoWindow("<table><tr style='border-bottom: solid 1px #000;'><td style='padding-top:6px;'>客户名称:" + data.title + "</td></tr><tr style='border-bottom: solid 1px #000;'><td style='padding-top:6px;'>用电地址:" + data.adress + "</td></tr><tr style='border-bottom: solid 1px #000;'><td style='padding-top:6px;'>电压等级:" + data.VName + "</td></tr><tr style='border-bottom: solid 1px #000;'><td style='padding-top:6px;'>用电类别:" + data.BigIndTypeName + "</td></tr><tr style='border-bottom: solid 1px #000;'><td style='padding-top:6px;'>装机容量：" + data.InstalledCapacity + "</td></tr></table>", opts);  // 创建信息窗口对象	
    //添加鼠标滑过时打开自定义信息窗口事件
    marker.addEventListener("mouseover", function () {
        marker_id = point;
        map.openInfoWindow(infoWindow, point); 
    });
    //添加鼠标离开时关闭自定义信息窗口事件
    marker.addEventListener("mouseout", function () {
        map.closeInfoWindow();
    }
    );
}

function ShowPID(i) {
    var a = markerArr[i];
    alert(a.content);
}

//
function createIcon(a, typeid) {
	var aUrl ;
    if (typeid == 19){ //辨别无权限站点
		aUrl = "../../Content/images/location_icon/" + typeid + ".png";
	}else{
		if (typeid > 11){	
			typeid = 1;
		}		
		aUrl = "../../Content/images/location_icon/" + typeid + ".png";
	}
    //alert(a.w+""+a.h);
	var b = new BMap.Icon(aUrl, new BMap.Size(a.w, a.h),
		{	anchor: new BMap.Size(a.w/2, a.h)
		}
	); 
	return b;
} 

initMap();

function setLocation(x, y, z) { var a = new BMap.Point(x, y); map.centerAndZoom(a, z); }
//
function SetMapPointState(a, b, c) {
    var g = map.getOverlays();
    for (var i = 0; i < g.length; i++) {
        if ("[object Marker]" === g[i].toString() && g[i].getLabel().content == a) {
            var d = g[i];
            if (b == 0) {
                d.setIcon(new BMap.Icon("../../Content/images/location_icon/"+c+".png", new BMap.Size(27, 40)));
			}
            else{
                d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + "_" + b + ".png", new BMap.Size(27, 40)));
				d.setTop(true);
			}				
        }
    }
}

function SetAlarmStateNew(jsonlist) {
    var g = map.getOverlays();
    for (var i = 0; i < g.length; i++) {
        if ("[object Marker]" === g[i].toString() ) {
            var d = g[i];
            var blSet = 0;
            for (var jcount = 0; jcount < jsonlist.length; jcount++) {
                if (d.getLabel().content == jsonlist[jcount].name) {
                    var c = jsonlist[jcount].typeid
                    var b = jsonlist[jcount].state;
                    if (c > 11)
                       c = 1;
                    if (b == 0) {
                        d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + ".png", new BMap.Size(27, 40)));
                    }
                    else {
                        d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + "_" + b + ".png", new BMap.Size(27, 40)));
                        d.setTop(true);
                    }
                blSet = 1;
                }
            }
            if (blSet == 0) {
                //取无权限站标识
				var tmp_dIcon  = d.getIcon();
				var tmp_imageUrl = tmp_dIcon.imageUrl;
				tmp_imageUrl = tmp_imageUrl.replace("_1.gif", ".png");
				tmp_imageUrl = tmp_imageUrl.replace("_2.gif", ".png");
				tmp_imageUrl = tmp_imageUrl.replace("_3.gif", ".png");

				d.setIcon(new BMap.Icon(tmp_imageUrl, new BMap.Size(27, 40)));
            }               
        }
    }
}

function setMapType(a) { if ("BMAP_NORMAL_MAP" == a) { map.setMapType(BMAP_NORMAL_MAP); } if ("BMAP_SATELLITE_MAP" == a) { map.setMapType(BMAP_SATELLITE_MAP); } if ("BMAP_HYBRID_MAP" == a) { map.setMapType(BMAP_HYBRID_MAP); } } function setPanoramaControl(i) { map.addTileLayer(new BMap.PanoramaCoverageLayer()); var a = new BMap.PanoramaControl(); a.setOffset(new BMap.Size(20, 20)); map.addControl(a); } var myLocalSearch = new BMap.LocalSearch(map, { renderOptions: { map: map} }); function localSearch(sVal) { myLocalSearch.search(sVal); } function clearLocalSearch() { myLocalSearch.clearResults(); } var mBMTC = new BMapLib.TrafficControl({ showPanel: false }); function setTrafficControl(i) { if ("0" == i) { mBMTC.remove(); } if ("1" == i) { map.addControl(mBMTC); mBMTC.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT); mBMTC.showTraffic(); } }
function setMapIndexViewport() {
    var a = []; var g = map.getOverlays();
    for (var i = 0; i < g.length; i++)
    {
        if ("[object Label]" != g[i].toString()) {
            var d = g[i];
            a.push(d.getPosition());
        }        
    }
    map.setViewport(a);
}


//设置站点进入权限
function showControl_ClickPDR(a)
{
	//需要提示的站名称
	g_showPDROk = 1;
		 
	var str1 = [				
				{"name":"1-"},
				{"name":"2-"}
				];
	
	for (var i = 0; i < str1.length; i++) {		
		if(a == str1[i].name){
			g_showPDROk  = 0;
			break;
		}
	}	
}


var myDis = new BMapLib.DistanceTool(map); 
function setMyDistanceTool(i) { if (1 == i) { myDis.open(); } if (0 == i) { myDis.close(); } }
 function killErrors() { return true; } window.onerror = killErrors;



