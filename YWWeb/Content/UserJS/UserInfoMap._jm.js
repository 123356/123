var iwa = new Array();
var g_showPDROk = 1;
function addMarker() {
    for (var i = 0; i < markerArr.length; i++) {
        var a = markerArr[i];
        //console.log(a);
        var b = a.Coordination.split("|")[0];
        var c = a.Coordination.split("|")[1];
        //var typeid = a.position;
        var point = new BMap.Point(b, c);

        //alert(a.content);		
        showControl_ClickPDR(a.UnitName);
        if (g_showPDROk == 0) {
            typeid = 19; //限制点击
        }

        //var d = createIcon({ w: 27, h: 40, l: 0, t: 0, x: 6, lb: 5 }, a.Type);
        var d = createIcon({ w: 22, h: 32, l: 0, t: 0, x: 6, lb: 5 }, a);
        var e = new BMap.Marker(point, { icon: d });
        // var f = new BMap.Label(a.UnitName, { "offset": new BMap.Size(5 - 6 + 10, -20) });
        var f = new BMap.Label(a.UnitName, { "offset": new BMap.Size(-10, 30) });
        f.setTitle(a.UnitID);

        e.setLabel(f);
        e.setZIndex(10);
        map.addOverlay(e);
        f.setStyle({ border: "none", color: "#666", cursor: "pointer", background: "transparent",fontWeight:"bold",textShadow:"-1px 0px 1px #fff" });

        showinfomessage(e, point, a);
        /*
        (function (x) {
            var index = i;
            var d = e;
            d.addEventListener("click", function (e) {
                var tmp_MLable = d.getLabel();
                var tmp_LTitle = tmp_MLable.getTitle();
                //取无权限站标识
                var tmp_dIcon = d.getIcon();
                var tmp_imageUrl = tmp_dIcon.imageUrl;
                if (tmp_imageUrl == "../../Content/images/location_icon/0.png") {
                    alert("此站无权限!");
                } else {
                    ShowInfoPage(tmp_LTitle);
                }
            });

        })()
        */

    }

}

function showinfomessage(marker, point, data) {
    var tit = "";
    if (data.Type == 1) {
        tit = "<div style='height:30px;background-color:#4c8bf1;margin-top:6px; text-align:center;'><span style='vertical-align:middle;color:#fff;'>客户信息</span></div>";
    } else if (data.Type == 2) {
        tit = "<div style='height:30px;background-color:#4c8bf1;margin-top:6px; text-align:center;'><span style='vertical-align:middle;color:#fff;'>电厂信息</span></div>"
    }
    var opts = {
        width: 320,
        height: 150,
        title: ''
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
    var par = {
        uid: data.UnitID,
        name: data.UnitName
    }
    if (data.Type == 1) {

        html += '<tr style=""><td style="padding-top:5px;"><i class="iconfont icon-lvyouchengshijianzhucity-dalouxiezilou"></i><span style="font-weight:bold">' + data.UnitName + '</span><a href="JavaScript:toDetail(' + data.UnitID + ')">详情&gt;</a>' + isAlarm + '</td></tr>'
        html += '<tr style="font-size:11px"><td ><i class="iconfont icon-location"></i>' + data.LinkAddress + '</td></tr>'
        html += '<tr style=""><td style="padding-top:5px;padding-bottom:5px"><hr/ style="margin-bottom:0px"></td></tr>'
        //html += '<tr style="border-bottom: solid 1px #000;"><td style="padding-top:6px;">装机容量：' + data.InstalledCapacity + '</td></tr>'
        //html += '<tr style="border-bottom: solid 1px #000;"><td style="padding-top:6px;">容需计价方式：' + data.EleCalWay + '</td></tr>'
        //html += '<tr style="border-bottom: solid 1px #000;"><td style="padding-top:6px;">政府目录电价：' + data.GovEleLevel + '</td></tr>'
        //html += '<tr style="border-bottom: solid 1px #000;"><td style="padding-top:6px;">偏差承担方式：' + data.DeviationMode + '</td></tr>'
        //html += '<tr style="border-bottom: solid 1px #000;"><td style="padding-top:6px;">用电类别：' + data.DType + '</td></tr>'
        html += '<tr style="font-size:11px"><td >电压等级：' + data.dianya + '</td></tr>'
        html += '<tr style="font-size:11px"><td >联系人：' + data.LinkMan + '</td></tr>'
        html += '<tr style="font-size:11px"><td >联系电话：' + data.LinkMobile + '</td></tr>'
        html += '<tr style="font-size:11px"><td style="padding-top:5px;">客户经理：' + data.CSMMan + '<span style="margin-left:40px">电话：</span>' + data.CSMPhone + '</td></tr>'
        //html += '<tr style="float:rihgt"><td style="padding-top:6px;">客服电话：' + data.CSMPhone + '</td></tr>'

        //html += "<tr><table cellpadding='' cellspacing='' border='1' class='d_list'>";
        //html += ' <caption id="titleName">年交易计划用电</caption>';
        //html += ' <thead>'
        //html += '<tr>'
        //html += '<th style="width:200px;">品种</th>'
        //html += '<th style="width:200px;">计划用电</th>'
        //html += '</tr>'
        //html += ' </thead>'
        //for (var i = 0; i < data.listPlan.length; i++) {

        //    html += "<tr>";
        //    html += "<td>" + data.listPlan[i].CName + "</td>";
        //    html += "<td>" + data.listPlan[i].SumPlan + "</td>";
        //    html += "</tr>"
        //    //html += '<tr style="border-bottom: solid 1px #000;"><td style="padding-top:6px;">' + data.listPlan[i].CName + '：' + data.listPlan[i].SumPlan + '</td></tr>'
        //}
        //html+="</table></tr>"
    } else if (data.Type == 2) {
        html += '<tr style=""><td style="padding-top:5px;"><i class="iconfont icon-lvyouchengshijianzhucity-dalouxiezilou"></i>' + data.UnitName + '<a href="JavaScript:toDetail(' + data.UnitID + ')">详情&gt;</a>' + isAlarm + '</td></tr>'
        html += '<tr style=""><td style="padding-top:5px"><i class="iconfont icon-location"></i>' + data.LinkAddress + '</td></tr>'
        html += '<tr style=""><td style="padding-top:12px"><hr></td></tr>'
        html += '<tr ><td style="padding-top:5px;">所属公司名称：' + data.companyName + '</td></tr>'
        html += '<tr ><td style="padding-top:5px;">装机容量：' + data.InstalledCapacity + '</td></tr>'
        html += '<tr ><td style="padding-top:5px;">电厂性质：' + data.Nature + '</td></tr>'
        html += '<tr style=""><td style="padding-top:12px;">联系人：' + data.LinkMan + '<span style="margin-left:40px">电话：</span>' + data.LinkMobile + '</td></tr>'
    }
    html += '</table>';
    var infoWindow = new BMap.InfoWindow(html, opts);  // 创建信息窗口对象
    var infoBox = new BMapLib.InfoBox(map, html, {
            boxStyle:{
                width: '400px',
                height: '320px',
                background:'rgba(0,0,0,0.6)'
            }
        }
    )
    
    
    //添加鼠标滑过时打开自定义信息窗口事件
    marker.addEventListener("mouseover", function () {
        map.closeInfoWindow();
        marker_id = point;
        map.openInfoWindow(infoWindow, point);
    });
    /*marker.addEventListener("click", function () {
        marker_id = point;
        map.openInfoWindow(infoWindow, point);
        //infoBox.open(marker)
    });*/
    //添加鼠标离开时关闭自定义信息窗口事件
  /*  marker.addEventListener("mouseout", function () {
        map.closeInfoWindow();
    }
    );
    */
}
function toDetail(uid) {
    
    localStorage.setItem('UnitData', JSON.stringify({ enUID: uid, enName: null }))
    location.href = "/Es/UserView2?unitId=" +uid

}

    function ShowPID(i) {
        var a = markerArr[i];
        alert(a.content);
    }

    //
    function createIcon(a, data) {
        var aUrl;
        if (data.Type == 1) {
            /* 
            if (data.isAlarm == 0) {
                aUrl = "../../Content/images/location_icon/2.png";
            } else if (data.isAlarm == 1) {
                aUrl = "../../Content/images/location_icon/2-1.png";
            } else if (data.isAlarm == 2) {
                aUrl = "../../Content/images/location_icon/2-2.png";
            } else if (data.isAlarm == 3) {
                aUrl = "../../Content/images/location_icon/2-3.png";
            }
            */

            aUrl = "../../Content/images/location_icon/2.png";
        } else if (data.Type == 2) {
            aUrl = "../../Content/images/location_icon/6.png";
        } else {
            aUrl = "../../Content/images/location_icon/2.png";
            /*
            if (data.isAlarm == 0) {
                aUrl = "../../Content/images/location_icon/2.png";
            } else if (data.isAlarm == 1) {
                aUrl = "../../Content/images/location_icon/2-1.png";
            } else if (data.isAlarm == 2) {
                aUrl = "../../Content/images/location_icon/2-2.png";
            } else if (data.isAlarm == 3) {
                aUrl = "../../Content/images/location_icon/2-3.png";
            }
            */
        }
        //if (typeid == 19) { //辨别无权限站点
        //    aUrl = "../../Content/images/location_icon/" + typeid + ".png";
        //} else {
        //    if (typeid > 11) {
        //        typeid = 1;
        //    }
        //    aUrl = "../../Content/images/location_icon/" + typeid + ".png";
        //}
        //alert(a.w+""+a.h);
        var b = new BMap.Icon(aUrl, new BMap.Size(27, 37),
            {
                anchor: new BMap.Size(27 / 2, 37)
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
                    d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + ".png", new BMap.Size(22, 32)));
                }
                else {
                    d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + "_" + b + ".png", new BMap.Size(22, 32)));
                    d.setTop(true);
                }
            }
        }
    }

    function SetAlarmStateNew(jsonlist) {
        var g = map.getOverlays();
        for (var i = 0; i < g.length; i++) {
            if ("[object Marker]" === g[i].toString()) {
                var d = g[i];
                var blSet = 0;
                //console.log(d.getLabel().content + "--" + jsonlist[0].UnitName)
                for (var jcount = 0; jcount < jsonlist.length; jcount++) {

                    if (d.getLabel().content == jsonlist[jcount].UnitName) {
                        var c = jsonlist[jcount].Type
                        var b = jsonlist[jcount].isAlarm;
                        if (c == 1) {
                            if (b == 0) {
                                d.setIcon(new BMap.Icon("../../Content/images/location_icon/2.png", new BMap.Size(22, 32)));
                            } else {
                                d.setIcon(new BMap.Icon("../../Content/images/location_icon/2_" + b + ".png", new BMap.Size(22, 32)));
                                d.setTop(true);
                            }
                        } else if (c == 2) {
                            d.setIcon(new BMap.Icon("../../Content/images/location_icon/6.png", new BMap.Size(27, 37)));
                            d.setTop(true);
                        } else {
                            if (b == 0) {
                                d.setIcon(new BMap.Icon("../../Content/images/location_icon/2.png", new BMap.Size(22, 32)));
                            } else {
                                d.setIcon(new BMap.Icon("../../Content/images/location_icon/2_" + b + ".png", new BMap.Size(22, 32)));
                                d.setTop(true);
                            }
                        }
                       /* if (c > 11)
                            c = 1;
                        if (b == 0) {
                            console.log("C:"+c)
                            d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + ".png", new BMap.Size(22, 32)));
                        }
                        else {
                            console.log(c+"_"+b)
                            d.setIcon(new BMap.Icon("../../Content/images/location_icon/" + c + "_" + b + ".png", new BMap.Size(22, 32)));
                            d.setTop(true);
                        }*/
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

    function setMapType(a) { if ("BMAP_NORMAL_MAP" == a) { map.setMapType(BMAP_NORMAL_MAP); } if ("BMAP_SATELLITE_MAP" == a) { map.setMapType(BMAP_SATELLITE_MAP); } if ("BMAP_HYBRID_MAP" == a) { map.setMapType(BMAP_HYBRID_MAP); } } function setPanoramaControl(i) { map.addTileLayer(new BMap.PanoramaCoverageLayer()); var a = new BMap.PanoramaControl(); a.setOffset(new BMap.Size(20, 20)); map.addControl(a); } var myLocalSearch = new BMap.LocalSearch(map, { renderOptions: { map: map } }); function localSearch(sVal) { myLocalSearch.search(sVal); } function clearLocalSearch() { myLocalSearch.clearResults(); } var mBMTC = new BMapLib.TrafficControl({ showPanel: false }); function setTrafficControl(i) { if ("0" == i) { mBMTC.remove(); } if ("1" == i) { map.addControl(mBMTC); mBMTC.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT); mBMTC.showTraffic(); } }
    function setMapIndexViewport() {
        var a = []; var g = map.getOverlays();
        for (var i = 0; i < g.length; i++) {
            if ("[object Label]" != g[i].toString()) {
                var d = g[i];
                a.push(d.getPosition());
            }
        }
        map.setViewport(a);
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


    var myDis = new BMapLib.DistanceTool(map);
    function setMyDistanceTool(i) { if (1 == i) { myDis.open(); } if (0 == i) { myDis.close(); } }
    function killErrors() { return true; } window.onerror = killErrors;



