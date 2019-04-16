function isOnline() {
    if (!navigator.onLine) {
        return;
    }
}
isOnline()
//用百度地图API获得当前所在城市
	var map = new BMap.Map('map');
	var myCity = new BMap.LocalCity();
	var cityName;
	myCity.get(myFun); //异步获得当前城市
	function myFun(result){
		cityName = result.name.replace('市', '');
	}

	//动态创建script标签
function jsonp(url) {
    if (url == undefined)
        return;
	    var script = document.createElement('script');
	    script.src = url;
	    document.body.append(script);
	    document.body.removeChild(script);
	}

	//设置延时，因为获得当前城市所在地是异步的
	setTimeout(function(){
		var urls = []; 
        urls[0] = 'https://sapi.k780.com/?app=weather.future&weaid=' + cityName + '&&appkey=39089&sign=6e957038e2c4e3836e9a2c5621e9361d&format=json&jsoncallback=getWeather_week&weaid=' + encodeURI(cityName);

	    //urls[1] = 'https://www.sojson.com/open/api/weather/json.shtml?city=' + encodeURI(cityName);
		jsonp(urls[0]);  //jsonp跨域请求
		jsonp(urls[1]);
	}, 1000);
 
 	//获得这一周的天气， 解析json数据，写入DOM
	function getWeather_week(response) {
		var result = response.result;
		createChart(result)
	}

	//获得今天的天气， 解析json数据，写入DOM
	function getTodayWeather(response){
		console.log("$$$$$$$$$$$$$$")
		var result = response.result
		
	}
	
	//七天天气图表
function createChart(data) {
    
    if (!data || data.length < 1 || data == undefined) {
        $(".weather").hide()
        return
    } else {
        $(".weather").show()
    }
	    var chart = echarts.init(document.getElementById('weatherChart'));
			var weeks = new Array();
			var high = new Array();
			var low = new Array();
			var weather = new Array();
			var icon = new Array();
			var bot_icon = new Array()
			for(var i= 0 ;i < data.length; i++){
			    weeks.push((data[i].days).substring(5))
				high.push(data[i].temp_high)
				low.push(data[i].temp_low)
				weather.push(data[i].weather)
				var icondata = {
					value: '---',
					textStyle: {
					    color: 'transparent',
						backgroundColor: {
							image: data[i].weather_icon
						}
					}
				}
				icon.push(icondata)
				var bot_icondata = {
					value: '---',
					textStyle: {
					    color: 'transparent',
						backgroundColor: {
							image: data[i].weather_icon1
						}
					}
				}
				bot_icon.push(bot_icondata)
			}
			
			var option = {
			      xAxis: [
			      
			     {//底部星期
			        type: 'category',
			        data: weeks,
			        position: 'bottom',
			        offset:25,
			       // show:false,
			       axisLine: {
			       	show: false
			       },
			       axisTick: {
			       	show: false
			       },
			       axisLabel: { //调整x轴的lable  
			          textStyle: {
			            fontSize: 8,// 让字体变大
			            color: '#fff',
                         
			          }
			        },
			     },
			 /*    {//顶部天气说明
			        type: 'category',
			        data: weather,
			        position: 'top',
			       // show:false,
			       //offset:100,
			       axisLine: {
			       	show: false
			       },
			       axisTick: {
			       	show: false
			       },
			       offset:'5',
			       axisLabel: { //调整x轴的lable  
			          textStyle: {
			            fontSize: 8,// 让字体变大
			            color: '#fff',
			            
			          },
			          padding: [20,0,5,0]
			        },
			      },*/
			      {//顶部天气图标
			        type: 'category',
			        position: 'top',
			        data: icon,
			        offset:15,
			       // show:false,
			       axisLine: {
			       	show: false
			       },
			       axisTick: {
			       	show: false
			       },
			       axisLabel: { //调整x轴的lable  
			          textStyle: {
			            fontSize: 14,// 让字体变大
			            color: 'transparent'
			          }
			        },
			     },
			     {//底部天气图标
			        type: 'category',
			        position: 'bottom',
			        data: bot_icon,
			       // show:false,
			       axisLine: {
			       	show: false
			       },
			       axisTick: {
			       	show: false
			       },
			       axisLabel: { //调整x轴的lable  
			          textStyle: {
			            fontSize: 14,// 让字体变大
			            color: 'transparent'
			          }
			        },
			     },
			     
			     
			      ],
			      grid:{
			        top:'30%',
			        bottom: '40%',
			        left: '0',
			        right: '0'
			      },
			      yAxis: {
			
			        type: 'value',
			        show:false,
			        //网格
			        splitLine: {
			          show: true,
			          lineStyle: {
			            color: '#f2efef'
			          }
			        },
			        axisLine: { show: false },//y轴不显示
			        axisTick: { 
			          show: false,//y轴刻度不显示
			           },
			        //y轴数据不显示
			        axisLabel: {
			          formatter: function () {
			            return "";
			          }
			        },
			        
			      },
			      series: [{
			        data: high,
			        type: 'line',
			        itemStyle: {
			          normal:
			            {
			              label: { show: true },//节点是否显示数据
			              color: "#fff",//显示数据颜色
			              lineStyle: {
			                color: "#f3bd3c",//折线颜色
			                width: '1'
			              }
			
			            }
			
			        }
			      },
			      {
			        data: low,
			        type: 'line',
			        itemStyle: {
			          normal:
			            {
			              label: { show: true },//节点是否显示数据
			              color: "#fff",//显示数据颜色
			              lineStyle: {
			                color: "#1591e0",//折线颜色
			                width: '1'
			              }
			
			            }
			
			        }
			      }
			      ],
			      /*dataZoom: [
			        {
			          show: false,
			          relatime: true,
			          start: 0,
			          end: 70
			
			        },
			        {
			          type: 'inside',
			          relatime: 0,
			          end: 70
			        }
			
			      ]*/
			
			    };
			chart.setOption(option)
	
		}
