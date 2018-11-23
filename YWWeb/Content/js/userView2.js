var leftbottomHeight = null
var id = null
var xpid = 0;
var xdid = 0;
$(function () {
   
    console.log($(window).width())
    console.log($(window).height())
    var noPid = $.cookie("noPid")
    //var cookiPid = $.cookie("cookiepid")
    var unitId = $.cookie("unitId")
   
    if (unitId != null) {
        id = unitId
    } else {
        id = noPid
    }
    $.cookie('unitId', id, { expires: 7, path: '/' });
    $.post("/Home/UnitListData", function (data) {
        var selectOption = null;
        for (var i = 0; i < data.length; i++) {
            if (id == data[i].UnitID) {
                selectOption += '<option value="' + data[i].UnitID + '" selected>' + data[i].UnitName + '</option>'
            } else { 
                selectOption += '<option value="' + data[i].UnitID + '" >' + data[i].UnitName + '</option>'
            }
        }
        $(".comName .select").append(selectOption)
    });
    $(".comName .select").change(function () {
        var selectVal = $(this).val()
        $.cookie('unitId', selectVal, { expires: 7, path: '/' });
        location.href = "/Es/UserView?id=" + selectVal
    })
    
	//高度
    var winHeight = $(window).height();
    if (winHeight > 800) {
        var height = winHeight - 480;
        $(".left-bottom").height(winHeight - 265)//190
        
    } else {
        var height = winHeight - 355;
        $(".left-bottom").height(winHeight - 140)//190
    }
	$(".conFlex .right .right-bottom").height(height)
	leftbottomHeight = $(".left-bottom").height()
	$(".itemComStyle .edRoomInfo .edRoomInfoDetail").height(leftbottomHeight-90)
	$("#burthenChart").height($(".itemComStyle .edRoomInfo .edRoomInfoDetail").height() - 58)
	//轮播
	var swiper = new Swiper('.swiper1', {
		//spaceBetween: 3000,
		loop: true,
		autoplay: true,//可选选项，自动滑动
	    delay:5000,
		speed:1500,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	});
	burthenChart = echarts.init(document.getElementById("burthenChart"))
    //获取配电房
	getPDF()
    //消息通知
	getMessage()
    //项目信息
	getProjectInfo()
    //获取运行情况等
	GetStationStateByPid()
})


//消息通知
function getMessage() {
    $.post({
        url: '/Home/AlarmManager',
        data: {
            uid: id
        },
        success: function (data) {
            console.log(data)
            var html = '';
            if (data != null) {
                               
                for (var i = 0; i < data.Alarm.length; i++) {
                        if (i < 3) {
                            var createDate = data.Alarm[i].AlarmDateTime
                            createDate = GetDateFormat(createDate)
                            html += '<li class="newMsg" onclick="msgDetail(0)"><p><time>' + createDate + '</time>' + data.Alarm[i].Company + '&nbsp;&gt;</p></li>'
                           // html += '<li class="newMsg" onclick="msgDetail(0)"><p><time>' + createDate + '</time>' + data.Alarm[i].Company + '&nbsp;&gt;</p></li>'
                        }
                        
                    }
                    for (var i = 0; i < data.order.length; i++) {
                        if (i < 3) {
                            var createDate = data.order[i].CreateDate
                            createDate = GetDateFormat(createDate)
                            //createDate = createDate.substring(5, createDate.length)
                            html += '<li class="" onclick="msgDetail(1)"><p><time>' + createDate + '</time>' + data.order[i].OrderName + '&nbsp;&gt;</p></li>'
                        }

                    }
                
            } else {
                html += '<p style="text-align:center;margin-top:20px">--</p>'
            }
            $(".msgList ul").html(html)
        },
        error: function (error) {
            console.log(error.getMessage())
        }
    })
}
//消息详情
function msgDetail(data) {
    if (data == 0) {
        location.href = '/AlarmManage/Index?pid=0'
        
    } else {
        location.href = '/Orderinfo/OrderList'
        //$("#main_frame", parent.document.body).attr("src", "/PowerQuality/Index?mid=21");
    }
}

//日期转换
function GetDateFormat(str) {
    if (str != null) {
        return new Date(parseInt(str.substr(6, 13))).toLocaleDateString();
    } else {
        return null
    }
}


//项目信息
function getProjectInfo() {
    $.post({
        url: '/Home/GetProjectInfo',
        data: {
            uid:id
        },
        success: function (data) {
            isEmpty(data.LinkMan, ".linkName")
            isEmpty(data.LinkPhone, ".linkPhone")
            isEmpty(data.UnitName, ".UnitName")
            isEmpty(data.IndustryName, ".ndustryName")
            isEmpty(data.dianya, ".dianya")
            isEmpty(data.InstalledCapacitys, ".InstalledCapacitys")
            isEmpty(data.CSMMan, ".CSMMan")
            isEmpty(data.CSMPhone, ".CSMPhone")
            isEmpty(data.LinkAddress, ".LinkAddress")
            isEmpty(data.UnitName, ".ubitNme")
            isEmpty(data.UnitProjectTypeName, ".UnitProjectTypeName")
        },
        error: function (error) {
            console.log(error.getMessage())
        }
    })
}
//判断是否为空
function isEmpty(val,className) {
    if (val != null&&val!="") {
        $(className).text(val)
    } else {
        $(className).text("--")
    }
}
function isEmptyNumber(val, className) {
    if (val != null && val != "") {
        $(className).text(val.toFixed(2))
    } else {
        $(className).text("--")
    }
}
//获取配电房
function getPDF() {
    $.post({
        url: '/Home/GetPDF',
        data: {
            uid: id
        },
        success: function (data) {
            var html = ''
            for (var i = 0; i < data.length; i++) {
                var name = data[i].Name
                if (id == 18) {
                    name = name.substring(5,name.length)
                }
                if (i == 0) {
                    html += '<div class="list-item roomBtnActive" title="'+name+'" id="'+data[i].PID+'">'+name+'</div>'
                } else if (i == 1) {
                    html += '<div class="list-item roomBtnNextActive" title="' + name + '" id="' + data[i].PID + '">' + name + '</div>'
                } else {
                    html += '<div class="list-item " title="' + name + '" id="' + data[i].PID + '">' + name + '</div>'
                }
            }
            if (data.length > 0) {
                byqInfo(data[0].PID)
            }
            $(".btnList .list").append(html)
            var par = {
                pid: data[0].PID,
                did: null,
                cid: null
            }
        },
        error: function (error) {
            console.log(error.getMessage())
        }
    })
}
//负载曲线
function loadCurve(par,type) {
    
    $.post({
        url: '/Home/LoadCurve',
        data: par,
        success: function (res) {
            var data = res
            //变压器容量、当前功率、负载率
            isEmptyNumber((data.model.Capacity), ".burthenInfo .num:eq(0)")
            isEmptyNumber((data.model.gonglv), ".burthenInfo .num:eq(1)")
            isEmptyNumber((data.model.fuzailv), ".burthenInfo .num:eq(2)")
          
            
            if (data.result.CName.length > 0){
                //负荷统计图
                $(".noBurthenChart").hide()
                createBurthenChart(data)
                
            } else {
                burthenChart.clear()
                $(".noBurthenChart").show()
            }
        },
        error: function (error) {
            console.log(error.getMessage())
        }
    })
}



//获取运行情况等
function GetStationStateByPid() {
    $.post({
        url: '/Home/GetStationStateByPid',
        data: {
            uid: id
        },
        success: function (data) {
            if (data != null) {
                var normalDays = data.NormalDays
                if (normalDays == null) {
                    normalDays = "--"
                }
                var checkDay = data.CheckDays
                var score = data.Score
                if (checkDay == null) {
                    checkDay = "--"
                }
                if (score == null) {
                    score = "--"
                }
                //轮播模块
                if (data.Name == "严重") {
                    $(".slide1-1").append('<p class="warningStat"><a href="/AlarmManage/Index?pid=0">严重</a></p><span class="littltInfo" style="margin-left:0">' + normalDays + '</span>')
                } else {
                    $(".slide1-1").append('<p class="normal">' + data.Name + '</p><span class="littltInfo">正常' + normalDays + '天</span>')
                }
                $(".slide2").append('<p class="normal">' + checkDay + '天</p><span class="littltInfo">距离下次检修</span>')
                $(".slide3").append('<p class="normal" onclick="score()" style="cursor: pointer;"> ' + score + '</p><span class="littltInfo">配电室平均评分</span>')
                //当日累计电量

                
                isEmpty(data.thisDayPower, ".thisDayPower")
                if (data.thisDayOccupation != null && data.thisDayOccupation != "" && data.thisDayOccupation != 0) {
                    
                    if ((data.thisDayOccupation * 100) > 1) {
                        $(".yearTQ").append('<span>上年同期对比 <span class="num thisDayOccupation">' + thisDayOccupation + '%</span><img src="~/Content/images/icon4/up.png" /></span>')
                    } else {
                        $(".yearTQ").append('<span>上年同期对比 <span class="num thisDayOccupation">' + thisDayOccupation + '%</span><img src="~/Content/images/icon4/down.png" /></span>')
                    }
                    
                } else {
                   
                    $(".yearTQ").append('<span>上年同期对比 <span class="num thisDayOccupation">--%</span></span>')
                }
               
                //上月用电
                isEmpty(data.thisMonthPower, ".thisMonthPower")
                console.log("(((((((((((((((((((((((((((((")
                console.log(data.thisMonthOccupation + "*******************")
                if (data.thisMonthOccupation != null && data.thisMonthOccupation != "" && data.thisMonthOccupation != 0) {
                    if ((data.thisMonthOccupation * 100) > 1) {
                        $(".yearMonTB").append('<span>上年同月对比 <span class="num thisMonthOccupation">' + data.thisMonthOccupation + '%</span><img src="~/Content/images/icon4/up.png" /></span>')
                    } else {
                        $(".yearMonTB").append('<span>上年同月对比 <span class="num thisMonthOccupation">' + data.thisMonthOccupation + '%</span><img src="~/Content/images/icon4/down.png" /></span>')
                    }
                    
                } else {
                    $(".yearMonTB").append('<span>上年同月对比 <span class="num thisMonthOccupation">--%</span></span>')
                }
                
                //占去年用电比例
                createMonELChart(data.thisPowerLastYear)
                //用电概况
                isEmpty(data.Sumload, ".Sumload")
              
                if (data.RatedCapacity != null) {
                    $(".RatedCapacity").text(data.RatedCapacity + "%");
                    $(".RatedCapacity").attr("title", data.RatedCapacity + "%")
                }
                
                //负载率比例图表
                if (data.fuzaiView.length > 0) {
                    var par = {
                        fuzaiView: data.fuzaiView,
                        RatedCapacity: data.RatedCapacity
                    }
                    $(".noElecUsageChart").hide()
                    createelecUsageChart(par)
                } else {
                    $(".noElecUsageChart").show()
                }
            }
        },
        error: function (error) {
            console.log(error.getMessage())
        }
    })
}

//弹出评分页面
function score() {
    window.open("/Es/Score", "_blank",
				"left=100px,top=50px,resizable=no, toolbar=no, location=no,fullscreen=no,channelmode=no, directories=no, status=no, menubar=no, scrollbars=yes, copyhistory=no, width=1000, height=500")
}


//变压器数据显示
function byqInfo(data) {
        $.post({
            url: '/Home/getBianyaqi',
            data:{
                pid:data
            },
            success: function (res) {
                
                var html = '';
                for (var i = 0 ; i < res.length; i++) {
                    if (i == 0) {
                        html += '<li class="tranListActive" title="' + res[i].DeviceName + '" id="' + res[i].C + '">' + res[i].DeviceName + '</li>'
                        $(".byq").text(res[0].DeviceName)
                    } else {
                        html += '<li  title="' + res[i].DeviceName + '" id="' + res[i].C + '">' + res[i].DeviceName + '</li>'
                    }

                }
                if (data.length == 0) {
                    $(".byq").text('')
                }
                $(".tranList ul").html(html);
                if (res.length > 0) {
                    var par = {
                        pid: data,
                        did: res[0].C,
                        cid: null
                    }
                    xpid = data;
                    xdid = res[0].C;
                } else {
                    var par = {
                        pid: data,
                        did: null,
                        cid: null
                    }
                    
                   $(".byq").text("")
                  
                }
                
                loadCurve(par,null)
            },
            error: function (error) {
                console.log(error.getMessage())
            }
        })
}

//当年累计电量统计图表
function createMonELChart(data) {
    var chart = echarts.init(document.getElementById('monElChart'));
    var x = '20'
    if (data != 0) {
        x = '5'
    }
	var option = {
	    title : {
	        text: '占去年用电'+data+'%',
	        x:x,
	        y: '65',
	         textStyle:{  //标题文字设置
	            fontSize: '11',
	            fontWeight: 'normal',
	            color: '#666'
	        }
	        
	    },
	   tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c}%"
	    },
	    color: ['#3ab094', '#f3f2f0'],
	    series : [
	        {
	            name: '累计电量',
	            type: 'pie',
	            radius : '55%',
	            center: ['50%', '28%'],
	            hoverAnimation: false,
	            data:[
	                {value:data, name:'当年累计'},
	                {value:(100-data).toFixed(2), name:'去年累计'}
	                
	            ],
	            itemStyle: {
	                normal : {
	                    label : {
	                        show : false   //隐藏标示文字
	                    },
	                    labelLine : {
	                        show : false   //隐藏标示线
	                    }
	                }
	            }
	        }
	    ]
	};
	chart.setOption(option)
}
//负载率比例
function createelecUsageChart(data){
    var chart = echarts.init(document.getElementById('elecUsageChart'));
    var seriesData = new Array()
    var syzb = 0.0
    console.log("负载率")
    console.log(data)
    for (var i = 0; i < data.fuzaiView.length; i++) {
        var color = ''

        if (data.fuzaiView[i].zhanbiEvery < 75) {
            color = '#3ab094'
        } else if (data.fuzaiView[i].zhanbiEvery >= 75 && data.fuzaiView[i].zhanbiEvery < 80) {
            color = '#e0d21f'
        } else if (data.fuzaiView[i].zhanbiEvery >= 80 && data.fuzaiView[i].zhanbiEvery < 85) {
            color = '#ef7200'
        } else {
            color = '#cc0d0d'
        }
        var temp = {
            value: (data.fuzaiView[i].zhanbiEvery).toFixed(2),
            name: data.fuzaiView[i].CName,
            itemStyle: {
                color: color
            }
        }
        syzb += parseFloat(data.fuzaiView[i].zhanbiEvery)
        seriesData.push(temp)
    }
    seriesData.push({
        value: (100 - syzb).toFixed(2),
        name: '可用容量',
        itemStyle: {
            color: '#f5f5f5'
        }
    })
    var x = '';
    var center = []
    if ($(window).width() < 1500) {
        x = '-2%'
        center= ['30%', '35%']
    } else {
        x = '20%'
        center = ['50%', '35%']
    }
	var option = {
	    title : {
	        text: '负载率比例',
	        x:x,
	        y: '75',
	         textStyle:{  //标题文字设置
	            fontSize: '11',
	            fontWeight: 'normal',
	            color: '#666'
	        }
	        
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b} :<br/> {c}%",
	    },
	    color: ['#45a790','#f3763c','#f3f2f0'],
	    series : [
	        {
	            name: '负载率比例',
	            type: 'pie',
	            radius : '55%',
	            center: center,
	            data: seriesData,
	            hoverAnimation: false,
	            itemStyle: {
	                normal : {
	                    label : {
	                        show : false   //隐藏标示文字
	                    },
	                    labelLine : {
	                        show : false   //隐藏标示线
	                    }
	                }
	            }
	        }
	    ]
	};
	chart.setOption(option)
}
//负载曲线图
function createBurthenChart(data) {
    var tooboxTop = ''
    var gridTop = ''
    if ($(window).width() < 1500) {
        tooboxTop = '8%'
        gridTop = '35%'
    } else {
        tooboxTop = '15%'
        gridTop = '15%'
    }
    //x轴数据
    var xAxis = data.result.xAxis
    for (var i = 0; i < xAxis.length; i++) {
        xAxis[i] = xAxis[i].split(" ")[1]
    }
    var series = new Array();
    for (var i = 0; i < data.result.CName.length; i++) {
        var yData = data.result.yData[i].y
        var item = {
            name: data.result.CName[i],
            type: 'line',
            stack: '总量',
            areaStyle: {},
            symbol: 'none',  //这句就是去掉点的  
            smooth: true,  //这句就是让曲线变平滑的
            data: yData,//[0, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 0],
            markPoint: {
                data: [
                    { type: 'max', name: '最大值' },
                ]
            },
        }
        series.push(item)
    }
    var option = {
        
	        tooltip: {
	            trigger: 'axis',
	            axisPointer: {
	                type: 'cross',
	                label: {
	                    backgroundColor: '#6a7985'
	                }
	            },
	            posoition:['50%','50%'],

	            extraCssText: 'width:400px;'
	        },
	        color: ["#3ab094", "#c3a7cd", "#88a5cf"],
	        legend: {
	            data: data.result.CName,//['最大负荷', '最小负荷', '平均负荷'],
	            y: '5%',
	            textStyle: {
	                color: '#a3a3a3',
	            }
	        },
	        toolbox: {
	            show: true,
	            feature: {
	                dataZoom: {
	                    yAxisIndex: 'none'
	                },
	                dataView: { readOnly: false },
	                magicType: { type: ['line', 'bar'] },
	                restore: {},
	                saveAsImage: {}
	            },
	            right: '-3px',
	            itemSize: [10],
	            top: tooboxTop,
	            orient: 'vertical'
	        },
	        grid: {
	            top: gridTop,
	            left: '1%',
	            right: '26px',
	            bottom: '5%',
	            containLabel: true
	        },
	        xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxis,//['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#706d6e',
                            fontSize: '10'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e9e9e9',

                        }
                    }
                }
	        ],
	        yAxis: [
                {
                    name: 'kW',
                    type: 'value',
                    splitNumber: 5,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#706d6e',
                            fontSize: '10'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e9e9e9',

                        }
                    }
                }
	        ],
	        series: series
	};

	burthenChart.clear()
	burthenChart.setOption(option)
}
$(".btnList .list").on("click", ".list-item", function () {
        $(".btnList .list .list-item").removeClass("roomBtnActive");
        $(".btnList .list .list-item").removeClass("roomBtnNextActive");
        $(this).addClass("roomBtnActive")
        $(this).next().addClass("roomBtnNextActive")
        byqInfo(parseInt($(this).attr("id")))
})
$(".tranList ul").on("click","li",function () {
    $(".tranList ul li").removeClass("tranListActive");
    $(this).addClass("tranListActive")
    $(".byq").text($(this).text())
    var did = $(this).attr("id")
    var pid = parseInt($(".roomBtnActive").attr("id"))
    var data = {
        pid: pid,
        did: did,
        cid: null
    }
    xpid = pid;
    xdid = did;
    loadCurve(data, 0)
})
function pdsDetail() {
    var pid = parseInt($(".roomBtnActive").attr("id"))
    $.cookie('cookiepid', pid, { expires: 7, path: '/' });
    $("#main_frame", parent.document.body).attr("src", "/PowerQuality/Index?mid=21");
}

var timeset;
clearInterval(timeset);
timeset = setInterval(function () {
    if (xdid != 0 && xpid != 0) {
        var data = {
            pid: xpid,
            did: xdid,
            cid: null
        }
        loadCurve(data, 0);
        Getxunhuan();
    }
}, 60000)



function Getxunhuan() {

    $.post({
        url: '/Home/ViewLoop',
        data: {
            uid: id
        },
        success: function (data) {
            if (data != null) {
                //当日累计电量


                isEmpty(data.thisDayPower, ".thisDayPower")
                $(".yearTQ").Empty();
                if (data.thisDayOccupation != null && data.thisDayOccupation != "" && data.thisDayOccupation != 0) {

                    if ((data.thisDayOccupation * 100) > 1) {
                        $(".yearTQ").append('<span>上年同期对比 <span class="num thisDayOccupation">' + thisDayOccupation + '%</span><img src="~/Content/images/icon4/up.png" /></span>')
                    } else {
                        $(".yearTQ").append('<span>上年同期对比 <span class="num thisDayOccupation">' + thisDayOccupation + '%</span><img src="~/Content/images/icon4/down.png" /></span>')
                    }

                } else {

                    $(".yearTQ").append('<span>上年同期对比 <span class="num thisDayOccupation">--%</span></span>')
                }
                //用电概况
                isEmpty(data.Sumload, ".Sumload")

                if (data.RatedCapacity != null) {
                    $(".RatedCapacity").text(data.RatedCapacity + "%");
                    $(".RatedCapacity").attr("title", data.RatedCapacity + "%")
                }

                //负载率比例图表
                if (data.fuzaiView.length > 0) {
                    var par = {
                        fuzaiView: data.fuzaiView,
                        RatedCapacity: data.RatedCapacity
                    }
                    $(".noElecUsageChart").hide()
                    createelecUsageChart(par)
                } else {
                    $(".noElecUsageChart").show()
                }
            }
        },
        error: function (error) {
            console.log(error.getMessage())
        }
    })
}