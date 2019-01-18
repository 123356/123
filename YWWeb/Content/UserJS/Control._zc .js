new Vue({
    el: "#EnergyControl",
    data: {
        pieChart: null,
        achievementsData: [
            { name: '停车场LED灯节能改进', endTIme: '2018-10-23', jn: 1375.3, jnl: 10 },
            { name: '房东方停车场LED灯2', endTIme: '2018-10-23', jn: 1375.3, jnl: 20 },
            { name: '东方的2节能改进', endTIme: '2018-10-23', jn: 1345.3, jnl: 19 },
            { name: 'ferLED灯节pp能', endTIme: '2018-10-23', jn: 1235.3, jnl: 18 },
        ],
        achDataSelect: null,
        page: {
            cur: 1,
            total:0
        },
        legendStyle: null,
        map: null,
        searchVal: '',
       
        loadViewHeight: 0,
        isShowList: true,
        isShowLeft: 0,
        listViewHeight: 0,
        comList:[]
    },
    methods: {
       
        changeCurPage: function (type) {
            switch (type) {
                case 'prev':
                    if (this.page.cur != 1) {
                        this.page.cur -= 1
                        this.achDataSelect = this.achievementsData[this.page.cur-1]
                    }
                    break;
                case 'next':
                    if (this.page.cur != this.page.total) {
                        this.page.cur += 1
                        this.achDataSelect = this.achievementsData[this.page.cur - 1]
                    }
                    break
            }
        },
        //统计图表
        createpieChart: function () {
            var width = $(window).width()
            legendStyle = {
                left: '40%',
                itemWidth:25

            }
            if (width < 1400) {
                legendStyle = {
                    left: '30%',
                    itemWidth: 6

                }
            }
            pieChart = echarts.init(document.getElementById('pieChart'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: <br/>{c} ({d}%)"
                },
                legend: {
                    
                    orient: 'vertical',
                    left: legendStyle.left,
                    top: '15%',
                    bottom: '50%',
                    align:'left',
                    data: ['照明用电  32.4%', '2照明用电 23.5%', '3照明用电  32.4%', '4照明用电  32.4%', '5照明用电  32.4%', '6照明用电  32.4%', '7照明用电  32.4%', '8照明用电  32.4%', '9照明用电  32.4%', '10照明用电  32.4%'],
                    itemWidth: legendStyle.itemWidth,
                    itemGap: 10,
                    textStyle: {
                        color: '#777',
                        fontSize:'12px'
                    }
                },
                color: ['#f9b88c', '#58b9a3', '#d0737b'],
                series: [
                    {
                        name: '电量',
                        type: 'pie',
                        center: ['15%', '52%'],
                        radius: ['90%', '63%'],
                        avoidLabelOverlap: false,
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'center',
                                formatter: [
                                    '{a|724}',
                                    '{b|总费用}'
                                ].join('\n'),
                                rich: {
                                    a: {
                                        color: '#525252',
                                        lineHeight: 20,
                                        fontSize: 20,
                                    },
                                    b: {
                                        color: '#525252',
                                        lineHeight: 30,
                                        fontSize: 12,
                                    }
                                },

                            },


                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            { value: 335, name: '照明用电  32.4%' },
                            { value: 310, name: '2照明用电 23.5%' },
                            { value: 234, name: '3照明用电  32.4%' },
                            { value: 135, name: '4照明用电  32.4%' },
                            { value: 1548, name: '5照明用电  32.4%' },
                            { value: 335, name: '6照明用电  32.4%' },
                            { value: 310, name: '7照明用电  32.4%' },
                            { value: 234, name: '8照明用电  32.4%' },
                            { value: 135, name: '9照明用电  32.4%' },
                            { value: 1548, name: '10照明用电  32.4%' }
                        ]
                    }
                ]
            };
            pieChart.setOption(option)
            
        },

        initMap: function () {
            map = new BMap.Map("map");    // 创建Map实例
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);  // 初始化地图,设置中心点坐标和地图级别
            //添加地图类型控件
            map.addControl(new BMap.MapTypeControl({
                mapTypes: [
                    BMAP_NORMAL_MAP,
                    BMAP_HYBRID_MAP
                ]
            }));
            map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);
            this.setMapStyle()
            this.initLocation()

        },
        //获取当前位置(调取高德地图api获取当前经纬度)
        initLocation: function () {
            var that = this
            AMap.plugin('AMap.Geolocation', function () {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                buttonPosition: 'RB',    //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

            });
            geolocation.getCurrentPosition(function (status, result) {
                if (status == 'complete') {
                    var pos = result.position
                    //定位有偏差，转换坐标
                    that.convertor(new BMap.Point(pos.lng, pos.lat))
                } else {
                    onError(result)
                }
                });
            });
        },
        showMessage: function (data,marker,point) {
            var that = this
            var opts = {
                width: 250,
                height: 0,
                title: '',
                enableAutoPan: true,
              
            }
            var html = '<div class="mapMsgBox">'
            html +='<div class="imgView item"><img src="/Content/images/energyDifficiency/heat.png"/></div>'
            html += '<div class="nameView item"><span class="dec">当前位置测试</span><p><span class="numText">36.2</span>kW·h</p></div>'
            html += '<div class="typeView item"><p>商业广场</p><button class="btn">进入</button></div>'
            html += '</div>'

            var infoWindow = new BMap.InfoWindow(html, opts);  // 创建信息窗口对象
            
            //添加鼠标滑过时打开自定义信息窗口事件
            marker.addEventListener("mouseover", function () {
                map.closeInfoWindow();
                //marker_id = point;
                map.openInfoWindow(infoWindow, point);
            });


        },
        //转换坐标
        convertor: function (point) {
            var that = this
            //坐标转换完之后的回调函数
            translateCallback = function (data) {
                console.log(data)
                var marker = new BMap.Marker(data.points[0], { icon: that.createMarkerIcon() });
                var label = new BMap.Label('当前位置', { "offset": new BMap.Size(-10, 30) });
                label.setStyle({ border: "none", color: "#666", cursor: "pointer", background: "transparent", fontWeight: "bold", textShadow: "-1px 0px 1px #fff" });
                marker.setLabel(label); //label
                    map.addOverlay(marker);
                map.setCenter(data.points[0]);
                that.showMessage(null, marker, data.points[0])
            }

            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(point);
            convertor.translate(pointArr, 1, 5, translateCallback)
        },
        //marker图标
        createMarkerIcon: function () {
            var url = "../../Content/images/location_icon/2.png"
            var icon = new BMap.Icon(url, new BMap.Size(22, 32),
                {
                    anchor: new BMap.Size(22 / 2, 32)
                }
            );
            return icon;
        },
        //设置地图风格
        setMapStyle: function () {
            map.setMapStyle({
                styleJson: [

                    {   //整体风格
                        "featureType": "all",
                        "elementType": "all",
                        "stylers": {
                            "lightness": 30,
                            "saturation": -100
                        }
                    },
                   
                ]
            })
        },
       
        setHeight: function () {
            var mapHeight = $(".mapView").height() - 15
            var headerH = $(".mapView .header").height()
            var form = $(".mapView .searchForm").height()
            if (this.isShowList) {
                this.loadViewHeight = mapHeight
                this.listViewHeight = mapHeight - headerH - form - 50
            }
            

        },
        isShowListChange: function () {
            console.log($(".loadListView").width())
            this.isShowList = !this.isShowList
            this.isShowLeft = -13
            if (this.isShowList) {
                $(".mapView .con").slideDown("slow")
                
            } else {
                $(".mapView .con").slideUp("slow")
                this.loadViewHeight = 34
            }
            

        }
       

    },
    beforeMount: function () {
        var that = this
        this.achDataSelect = this.achievementsData[0]
        console.log(this.achievementsData.length)
        this.page.total = this.achievementsData.length
        this.setHeight()
        setInterval(this.setHeight,100)
        window.onresize = function () {
            that.setHeight()
        };
        
        
    },
    mounted: function () {
        this.createpieChart()
        
        window.addEventListener("resize", () => {
            pieChart.resize();
            console.log("放大")
        });
        this.initMap()
    }
})












function setScroll() {
    if ($(".left .list .ivu-table").scrollTop() != 1) {
        $(".left .list .ivu-table").scrollTop(1)
    } else {
        $(".left .list .ivu-table").scrollTop(0)
    }

    $(".left .list .ivu-table").scroll(function () {
        var width = $(".left .list").width()
        $(this).width(width + 32)
        $(".left .list .ivu-table").css("margin-right", "15px")
    })
}
$(function () {


    
})
