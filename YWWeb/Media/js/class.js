// JavaScript Document
//hashmap -- 
//刷新整个哈希表数据时请先调用refresh()
//跟新数据时请调用up()
//删除对象请调用clear()
//zdy-2011/7/9

function HashmapCom(){
	Init(this);	//构造函数
	function Init(p){
		p.map  = new Hashmap();
	}
	
	function Hashmap(){
		this.length = 0;
		this.set = function(key, value){
			this[key] = value;
			this[this.length] = key;
			this.length++;
		}
		
		this.up = function(key, value){
			(typeof this[key] != 'undefined')?(this[key] = value):alert("hashmap: key "+key+" undefined");
		}
		
		this.get = function(key){
			return((typeof this[key] == 'undefined')?null:this[key]);
		}
	}
	
	this.refresh = function(){
		this.map.length = 0;
	}
	
	this.clear = function(){
		delete this.map;
	}
	
	this.length = function(){
		return (this.map.length);
	}
	
	this.set = function(key, value){
		this.map.set(key, value);
	}
	
	this.get = function(key){
		return(this.map.get(key));
	}
	
	this.up = function(key, value){
		this.map.up(key, value);
	}
}

//UI类
function UIReg(){
	//Button按钮  
	//objStr:被注册按钮对象字符串
	//Width:被注册按钮对象事件响应向左偏移量
	//top:被注册按钮对象事件响应向上偏移量
	this.Button = function(objStr, left, top, callback){
		var MouseDown = false;
		if (typeof top == 'undefined'||top==null||top=="") top = false;
		if (!($.isFunction(callback))){
			callback = function(a, b){
				return (true);
			}
		}
		$p = $(objStr);
		$p.attr("name", "");
		$p.mouseover(function(e){
			$(this).css("cursor", "pointer");
			if (callback(e, this)){
				if($.browser.mozilla){
					var position = $(this).css("background-position");
					top = position.split(" ")[1];
					$(this).css("background-position", "-"+left+"px "+top);
				}else{
				  	if(top)
					  	$(this).css("background-position", "-"+left+"px "+top+"px");
				  	$(this).css("background-position-x", "-"+left+"px");
				}
			}
		}).mouseout(function(e){
			if (callback(e, this)){
				if($.browser.mozilla){
					var position = $(this).css("background-position");
					top = position.split(" ")[1];
					$(this).css("background-position", "0px "+top);
				}else{
					if(top)
						$(this).css("background-position", "0px "+top+"px");
					$(this).css("background-position-x", "0px");
				}
			}
		}).mousedown(function(e){
			if (callback(e, this)){
				if($.browser.mozilla){
					var position = $(this).css("background-position");
					top = position.split(" ")[1];
					$(this).css("background-position", "-"+left*2+"px "+top);
				}else{
					if(top)
						$(this).css("background-position", "-"+left*2+"px "+top+"px");
					$(this).css("background-position-x", "-"+left*2+"px");
				}
			}
		}).mouseup(function(e){
			if (callback(e, this)){
				if($.browser.mozilla){
					var position = $(this).css("background-position");
					top = position.split(" ")[1];
					$(this).css("background-position", "-"+left+"px "+top);
				}else{
					if(top)
						$(this).css("background-position", "-"+left+"px "+top+"px");
					$(this).css("background-position-x", "-"+left+"px");
				}
			}
		})
	}
	
	this.Slider = function(sliderCov, sliderBtn, slider){
		var sizemax = $("#"+sliderCov).css("width").split("px")[0] - 20;
		var down = false;
		var percent = 0;
		$("#"+sliderCov).attr("speed", 0);
		var left = $("#"+sliderCov).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtn+",#"+sliderCov).mouseover(function(){
			left = $("#"+sliderCov).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCov).mousedown(function(e){
			down = true;
			$("#"+sliderBtn).css("margin-left", e.clientX - left );
			var offset = $("#"+sliderBtn).css("margin-left").split("px")[0];
			$("#"+slider).css("width", offset+"px");
			$("#"+sliderCov).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
		});
		
		$("#"+sliderBtn).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtn).css("margin-left", e.clientX - left);
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtn).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtn).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtn).css("margin-left").split("px")[0];
				$("#"+slider).css("width", offset+"px");
				$("#"+sliderCov).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtn).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
		});
		
		$(function(){
			$("#"+slider).css("width", "50%");
			$("#"+sliderBtn).css("margin-left", 67);
			$("#"+sliderCov).attr("speed", 50);
		})
		
		
	}
	this.SliderCam = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback/36)*130;
		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");		
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));			
		}).mouseup(function(){
		});
		
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/3.575)*1;
				if(delay>36)
				{
					delay = 36;
				}else if(delay<1){
					delay = 1;
				}
				$("#Delay").val(Math.round(delay));
			
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/3.575)*1;
			if(delay>36)
			{
				delay = 36;
			}else if(delay<1){
				delay = 1;
			}
			$("#Delay").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
		
		
	}
	
	/////////////////////00000000000////////////
	this.SliderCam0 = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback[0]/36)*130;
		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
		});
		
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/3.575)*1;
				if(delay>36)
				{
					delay = 36;
				}else if(delay<1){
					delay = 1;
				}
				$("#Cam_IRCutDelay").val(Math.round(delay));
			
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/3.575)*1;
			if(delay>36)
			{
				delay = 36;
			}else if(delay<1){
				delay = 1;
			}
			$("#Cam_IRCutDelay").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
	}
//////////////////111111111////////////////////////////
	this.SliderCam1 = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback[1]/255)*130;//拖动占比例

		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
			if(1 == $("#Cam_R3dnrThreshTarget").val()*1)
			{
			    window.setTimeout("cam_fresh()", 200);
			}
		});
		
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
			window.setTimeout("cam_fresh()", 200);
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
				if(delay>255)
				{
					delay = 255;
				}else if(delay<1){
					delay = 1;
				}
				$("#Cam_R3dnrThreshTarget").val(Math.round(delay));
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
			if(delay>255)
			{
				delay = 255;
			}else if(delay<1){
				delay =1;
			}
			$("#Cam_R3dnrThreshTarget").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
	}
////////////////////////////////////2222222222///////////
	this.SliderCam2 = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback[2]/255)*130;
		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
		});
		
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
			window.setTimeout("cam_fresh()", 200);
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
				if(delay>255)
				{
					delay = 255;
				}else if(delay<1){
					delay = 1;
				}
				$("#Cam_DwdrStrength").val(Math.round(delay));
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
			if(delay>255)
			{
				delay = 255;
			}else if(delay<1){
				delay = 1;
			}
			$("#Cam_DwdrStrength").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
	}
//////////////////////////////33333333333333///////////////
	this.SliderCam3 = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback[3]/255)*130;
		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
		});
		
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
			window.setTimeout("cam_fresh()", 200);
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
				if(delay>255)
				{
					delay = 255;
				}else if(delay<1){
					delay = 1;
				}
				$("#Cam_Rgain").val(Math.round(delay));
			
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
			if(delay>255)
			{
				delay = 255;
			}else if(delay<1){
				delay = 1;
			}
			$("#Cam_Rgain").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
	}
////////////////////////////4/////////////////////
	this.SliderCam4 = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback[4]/255)*130;
		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
		});
		
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
			window.setTimeout("cam_fresh()", 200);
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
				if(delay>255)
				{
					delay = 255;
				}else if(delay<1){
					delay = 1;
				}
				$("#Cam_Ggain").val(Math.round(delay));
			
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
			if(delay>255)
			{
				delay = 255;
			}else if(delay<1){
				delay = 1;
			}
			$("#Cam_Ggain").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
	}
///////////////////////////5555555555555////////////////////
	this.SliderCam5 = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback[5]/255)*130;
		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
		});
 
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
			window.setTimeout("cam_fresh()", 200);
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
				if(delay>255)
				{
					delay = 255;
				}else if(delay<1){
					delay = 1;
				}
				$("#Cam_Bgain").val(Math.round(delay));
			
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
			if(delay>255)
			{
				delay = 255;
			}else if(delay<1){
				delay = 1;
			}
			$("#Cam_Bgain").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
	}
//////////////////////////////////////66666666666////////////////////////
	this.SliderCam6 = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback[6]/128)*130;
		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
		});
		
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/1.01)*1;
				if(delay>128)
				{
					delay = 128;
				}else if(delay<1){
					delay = 1;
				}
				$("#transparent").val(Math.round(delay));
			
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/1.01)*1;
			if(delay>128)
			{
				delay = 128;
			}else if(delay<1){
				delay = 1;
			}
			$("#transparent").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
	}
	
	///////////////////////////5555555555555////////////////////
	this.SliderCam7 = function(sliderCovCam, sliderBtnCam, sliderCam){
		var sizemax = $("#"+sliderCovCam).css("width").split("px")[0] - 10;
		var down = false;
		var precent = (sliderback[7]/255)*130;
		$("#"+sliderCovCam).attr("speed", 0);
		var left = $("#"+sliderCovCam).offset().left;//元素相当于窗口的左边的偏移量
		$("#"+sliderBtnCam+",#"+sliderCovCam).mouseover(function(){
			left = $("#"+sliderCovCam).offset().left - $(document).scrollLeft();
			$(this).css("cursor","pointer");
		}).mouseout(function(){
			$(this).css("cursor","default");
		});
		
		$("#"+sliderCovCam).mousedown(function(e){
			down = true;
			$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
			var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
			$("#"+sliderCam).css("width", offset+"px");
			$("#"+sliderCovCam).attr("speed", (offset / sizemax * 100));
		}).mouseup(function(){
		});
 
		$("#"+sliderBtnCam).mousedown(function(e){
			down = true;
		}).mouseup(function(e){
			down = false;
			window.setTimeout("cam_fresh()", 200);
		});
		
		$(document).mousemove(function(e){
			if (down)
			{
				if (e.clientX - left > 0 && e.clientX-left < sizemax)
				{
					$("#"+sliderBtnCam).css("margin-left", e.clientX - left);
					percent = e.clientX-left;
				}
				else if (e.clientX - left <= 0)
				{
					$("#"+sliderBtnCam).css("margin-left", 0);
				}
				else
				{
					$("#"+sliderBtnCam).css("margin-left", sizemax );
				}
				var offset = $("#"+sliderBtnCam).css("margin-left").split("px")[0];
				$("#"+sliderCam).css("width", offset+"px");
				$("#"+sliderCovCam).attr("speed", offset / sizemax * 100);
				//如果值为0或100，都让按钮调用mouseup事件
				delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
				if(delay>255)
				{
					delay = 255;
				}else if(delay<1){
					delay = 1;
				}
				$("#Cam_DefogThreshTarget").val(Math.round(delay));
			
				if (e.clientX - left < -20 || e.clientX-left > sizemax+20)
					$("#"+sliderBtnCam).mouseup();
			}
		}).mouseup(function(e){
			if (down)
			{
				down = false;
			}
			delay = ($("#"+sliderCam).css("width").split("px")[0]/0.5078)*1;
			if(delay>255)
			{
				delay = 255;
			}else if(delay<1){
				delay = 1;
			}
			$("#Cam_DefogThreshTarget").val(Math.round(delay));
		});
		
		$(function(){
			
			$("#"+sliderCam).css("width", precent+"px");
			$("#"+sliderBtnCam).css("margin-left", precent);
			$("#"+sliderCovCam).attr("speed", 0);
		})
	}

	this.Select = function(){
	}
	
	this.Input = function(){
	}
}
var pre_xml = "";
function cam_fresh() {        //设置数据      
    	var xml = "<a>";
		xml += ("<IRCutMode>" + ($("#Cam_IRCutMode").val()*1) + "</IRCutMode>");//1
		xml += ("<IRCutSensitive>" + ($("#Cam_IRCutSensitive").val()*1) + "</IRCutSensitive>");//2
		xml += ("<IRCutDelay>" + $("#Cam_IRCutDelay").val()*1 + "</IRCutDelay>");//3
		xml += ("<chid>1</chid>");
		xml += ("<Flip>" + ($("#Cam_Flip").prop("checked")*1) + "</Flip>");//4
		xml += ("<Mirror>" + ($("#Cam_Mirror").prop("checked")*1) + "</Mirror>");//5
		
		xml += ("<BackLightMode>" + $("#Cam_BackLightMode").val()*1 + "</BackLightMode>");//6
		xml += ("<BackLightLevel>" + $("#Cam_BackLightLevel").val()*1 + "</BackLightLevel>");//7
		xml += ("<R3dnrMode>" + $("#Cam_R3dnrMode").val()*1 + "</R3dnrMode>");//8
		xml += ("<R3dnrThreshTarget>" + $("#Cam_R3dnrThreshTarget").val()*1 + "</R3dnrThreshTarget>");//9
		xml += ("<DwdrMode>" + $("#Cam_DwdrMode").val()*1 + "</DwdrMode>");//10
		xml += ("<DwdrStrength>" + $("#Cam_DwdrStrength").val()*1 + "</DwdrStrength>");//11
		xml += ("<GainControlMode>" + $("#Cam_GainControlMode").val()*1 + "</GainControlMode>");//12
		xml += ("<WBMode>" + $("#Cam_WBMode").val()*1 + "</WBMode>");//13
		xml += ("<Rgain>" + $("#Cam_Rgain").val()*1 + "</Rgain>");//14
		xml += ("<Ggain>" + $("#Cam_Ggain").val()*1 + "</Ggain>");//15
		xml += ("<Bgain>" + $("#Cam_Bgain").val()*1 + "</Bgain>");//16
		xml += ("<ShutterMode>" + $("#Cam_ShutterMode").val()*1 + "</ShutterMode>");//17
		xml += ("<eShutterSpeed>" + $("#Cam_eShutterSpeed").val()*1 + "</eShutterSpeed>");//18
		xml += ("<FlickerCtrl>"+ Cam_FlickerCtrl  +"</FlickerCtrl>");
		xml += "</a>";
		if(pre_xml == xml)
		{
			return;
		}
    gDvr.GetAndSetParameter("Img_Ctrl", xml, 512, 1);
    pre_xml = xml;
}

	
//设备信息类
function DvrInfo(){
	this.obj = document.getElementById("dvrocx");	//控件对象
	
	//设备属性
	this.nMainType = 0;
	this.nSubType = 0;
	this.nMacAddr = 0;
	this.nChannel = 0;
	this.nAlarmIn = 0;
	this.nAlarmOut = 0;
	this.nTotalFPS = 0;
	this.nTotalFPS960 = 0;
	this.nUserRight = 0;
	this.bAdmin = false;
	this.nVideoFormat = 0;
	this.nAudio = 0;
	this.SubStreamMin = 0;
	this.SubStreamMax = 0;
	this.nPreviewChn = 0;
	this.nPlatSupport = 0;
	this.nSubStreamRestrict = 0;
	this.nPlatFormShowTag = 0;
	this.RouterShowTag = 0;
	this.paramSetRights = 0;
	this.bDevCif = false;
	this.nHuaweiPlat = 0;
	this.DevType = 0;
	this.bLANShowTag = 0;
	this.bVideoActivate = 0;
	this.MotionMode = 0;
	this.ResolutionMode = 0;
	this.HidePhonePage = 0;
	this.RtspPageEnable = 0;
	this.FtpPageFlag = 0;
	this.c32PasswordFlag = 0;
	this.FtpPageFlag = 0;
	this.FileSystemFlag = 0;
	this.WifiStatus = 0;
	this.KguardP2pUidFlag = 0;
	this.EmailFlagSwitch = 0;
	this.EmailScheduleFlag = 0;
	this.PtzHiddenFlag = 0;
	this.c3GFlagSwitch = 0;
	this.c3GFlag = 0;
	this.RecordTypeFlag = 0;
	this.CloudStorageFlag = 0;
	this.CloudSGSerSwitch = 0;
	this.IntelligentAnalysis = 0;
	this.RemoteFtpUpgradeSupport = 0;
	this.NewAapterQTParamFlag = 0;
	this.MaxPOENum = 0;
	this.ProtocolType = 0;
	this.CloudeSGType = 0;
	this.customProtolFlag = 0;
	this.sgPlatformFlag = 0;
	
	this.UrmetDevStatusFlag = 0;
	this.AnalogChNum = 0;
	this.PtzSupported = 0;
	this.hybirdDVRFlag = 0;
	this.CoaxialFlag = 0;
	this.ResolutionMode = 0;
	this.HkDomeFlag = 0;
	this.PageControl = 0;
	
	Init(this);//初始化
	function Init(p){
		//初始化设备方法	
		if ($.browser.safari){
			p.DvrCtrlInit = function(){return("true")}
			p.GetLanguage = function(lg, url){return("err")}
			p.GetDvrInfo = function(){return(p.obj.GetDvrInfo())};
			p.UserLogin = function(port, ip, name, passwd){return p.obj.InitPlugin(ip, port, name, passwd);};
			p.GetAndSetParameter = function(nPage, xml, type, nFlag){p.obj.GetAndSetParameter(nPage, xml, type*1, nFlag*1)}
			p.GetAndSetVideoInfo = function(a, b, c){p.obj.GetAndSetVideoInfo(a, b*1, c)}
			p.PreViewFunCtrl = function(msgId, chnId, type){return(gDvr.obj.PreViewFunCtrl(msgId*1, chnId*1, type*1))};
			p.Motion = function(motion,x,y){}
			p.GetVolume = function(){p.obj.GetVolume();}
			p.ChangeWndSize = function(wndType, width, height){return(p.obj.ChangePage(wndType*1))};
			p.PTZcontrol = function(cmd, speed, n, m,time,scan){return(p.obj.PTZControl(cmd*1, speed*1, n*1, m*1/*,time*1,scan*1*/))}
			p.Motion = function(motion,x,y){p.obj.MotionAndShelterEx(motion,x*1,y*1)}
			p.DvrCtrlRelease = function(){}
			p.OpenLocalFile =function(i){if (i >= 1 && i<= 3){
					return p.obj.OpenFileDialog(0,"");
				}else if (i == 0){
					return p.obj.OpenFileDialog(1,"sw");
				}
			};
			p.GetAndSetRecFileParams= function(a, b, c){
				if (a == 0){
				return("<RecFile>"+p.obj.GetPath("record")+"</RecFile>" + "<DownFile>"+p.obj.GetPath("download")+"</DownFile>" + "<PictureFile>" + p.obj.GetPath("capture") + "</PictureFile>" + "<FileTime>"+0+"</FileTime>"+"<FileType>"+1+"</FileType>")
				}else if (a == 1){
					return("suc");
				}
			};
			p.FileUpdate = function(a, b, c, d){return(p.obj.FileUpdate(a*1, b/*, c*1, d*1*/))};
			p.PreViewCap = function(n){return(p.obj.ChannelCapture(n*1))}
			p.PreViewRec = function(n){return(p.obj.StartRecord(n*1))}
			p.PreViewSound = function(){return(p.obj.MuteAll())}
			p.SetMacPath = function(a, b, c){p.obj.SetPath("capture", a);p.obj.SetPath("record", b);p.obj.SetPath("download", c);};
			p.GetCapImage = function(a){p.obj.OpenMyFile(a);}
			p.GetCapDir = function(a){a = a.substring(0, a.lastIndexOf("/"));p.obj.OpenMyFile(a);}
			p.PlayBackByMon = function(n, chid, a, strTime,nChannel){return p.obj.PlayBackByMon(nChannel*1,strTime)};
			p.RemoteTest = function(xml){return(p.obj.RemoteTest(xml));}
			p.SetPlayBackMode = function(n){return p.obj.SetPlayBackMode(n*1);}
			p.PlayStart = function(){  p.obj.PlayStart();}
			p.PlayStop = function(){  p.obj.PlayStop();}
			p.PlayBackByDay = function(chid, a, b, c, time){ return(p.obj.SearchFileList(chid, a, b, c, time))}
			p.RefreshDvrInfo = function(){return(p.obj.RefreshDvrInfo())};
			p.GetIpPortInfo = function(){return "<Num>0</Num>";};
			p.ClearIpAndPortInfo = function(){return;};
			p.SetStreamType = function(streamType){return(p.obj.SetStreamType(streamType*1))};
			p.SetOriginalVideo = function(OriginalVideo){return(p.obj.SetOriginalVideo(OriginalVideo))};
			p.SetIPAndPort = function(port, ip){return;};
			
			p.GetDevIDXml = function(){return;};
			p.ClearDevIDInfo = function(){return;};
			p.SetDevIDInfo = function(strID){return;};
			p.ShowVideoSet =  function(){p.obj.ShowVideoSet();};
			p.SetEncription = function(bEncription){return;};
			p.getDayOfWeek = function(){return(p.obj.GetWeekStart())};
			p.SetClientName = function(name){return;};
			p.IsIELogin = function(bIeLogin){return;};
			p.GetRatio = function(){return p.obj.GetRatio()};
			p.Encode = function(data){return(p.obj.Encode(data))};
			p.Decode = function(data){return(p.obj.Decode(data))};
			p.GetDevAllStatusReq = function(){p.obj.GetDevAllStatusReq()};
			p.FTPUpgrading = function(bPage){p.obj.FTPUpgrading(bPage)};
			p.openSafariByUrl = function(url){return(p.obj.openSafariByUrl(url))};
			p.Zoom = function(chid){return(p.obj.Zoom(chid))};
			//p.GetZoomStatus = function(chid){return(p.obj.GetZoomStatus(chid))};
			//p.GetIpcAbility = function(channelMask){return []};
		}else if ($.browser.msie || $.browser.firefox || $.browser.chrome){
			p.DvrCtrlInit = function(){return(p.obj.DvrCtrlInit())}
			if($.browser.msie){
				p.GetLanguage = function(lg, url){return(p.obj.SetLanguageEx(lg))}
				p.SetLanguage = function(lg, url){p.obj.SetLanguageEx(lg)}
			}else{
				p.GetLanguage = function(lg, url){return(p.obj.SetLanguage(lg))}
				p.SetLanguage = function(lg, url){p.obj.SetLanguage(lg)}
			}
			p.GetDvrInfo = function(){return(p.obj.GetDvrInfo())};
			p.UserLogin = function(port, ip, name, passwd){return(p.obj.UserLogin(port, ip, name, passwd))};
			p.PreViewFunCtrl = function(msgId, chnId, type){return(gDvr.obj.PreViewFunCtrl(msgId, chnId, type))};
			p.PlayBackVideo = function(chID, type, bsync, timetype, strtime){return(p.obj.PlayBackVideo(chID, type, bsync, timetype, strtime))};
			p.ChangeWndSize = function(wndType, width, height){return(p.obj.ChangeWndSize(wndType, width, height))};
			p.GetAndSetParameter = function(nPage, xml, type, nFlag){return(p.obj.GetAndSetParameter(nPage, xml, type, nFlag))}
			p.CloseNetConnect = function(n){return(p.obj.CloseNetConnect(n))}
			if($.browser.msie){
				p.PTZcontrol = function(cmd, speed, n, m,time,scan){return(p.obj.PTZcontrol(cmd, speed, n, m,time,scan))}
			}else{
				p.PTZcontrol = function(cmd, speed, n, m,time,scan){return(p.obj.PTZcontrol(cmd*1, speed*1, n*1, m*1/*,time*1,scan*1*/))}
			}
			p.PlayBackByDay = function(chid, a, b, c, time){return(p.obj.PlayBackByDay(chid, a, b, c, time))}
			p.PlayBackByMon = function(n, chid, a, strTime, nChannel){return(p.obj.PlayBackByMon(n, chid, a, strTime));};
			p.DvrCtrlRelease = function(){p.obj.DvrCtrlRelease()}
			p.Motion = function(motion,x,y){p.obj.MotionAndShelterEx(motion,x,y)}
			p.GetAndSetVideoInfo = function(a, b, c){p.obj.GetAndSetVideoInfo(a, b, c)}
			p.OpenLocalFile = function(a){return (p.obj.OpenLocalFile(a))}
			if($.browser.msie){
				p.FileUpdate = function(a,b,c,d){return (p.obj.FileUpdate(a,b,c,d))}
			}else{
				p.FileUpdate = function(a,b,c,d){return (p.obj.FileUpdate(a,b))}
			}
			p.GetVolume = function(){}
			p.SetPlayBackMode = function(n){return p.obj.SetPlayBackMode(n);}
			p.PreViewCap = function(n){return(p.obj.PreViewCap(n))}
			p.PreViewRec = function(n){return(p.obj.PreViewRec(n))}
			p.PreViewSound = function(n){return(p.obj.PreViewSound(n))}
			p.OpenLocalFile =function(i){return p.obj.OpenLocalFile(i)};
			p.GetAndSetRecFileParams= function(a, b, c){return p.obj.GetAndSetRecFileParams(a, b, c)};
			p.SetMacPath = function(a, b, c){return("")};
			p.GetCapImage = function(a){
				p.obj.BrowserPicture(a);
			}
			p.GetCapDir = function(a){
				a = a.substring(0, a.lastIndexOf("\\"));
				//在此处加入打开路径的代码 -- 我上传了一下你的代码。测试MAC
				p.obj.BrowserPicFile(a);
			}
			p.RemoteTest = function(xml){return(p.obj.RemoteTest(xml));}
			p.RefreshDvrInfo = function(){return(p.obj.RefreshDvrInfo())};
			p.GetIpPortInfo = function(){return(p.obj.GetIpPortInfo())};
			p.ClearIpAndPortInfo = function(){return(p.obj.ClearIpAndPortInfo())};
			p.SetStreamType = function(streamType){return(p.obj.SetStreamType(streamType))};
			p.SetOriginalVideo = function(OriginalVideo){return(p.obj.SetOriginalVideo(OriginalVideo))};
			p.SetIPAndPort = function(port, ip){return(p.obj.SetIPAndPort(port, ip))};
			
			p.GetDevIDXml = function(){return(p.obj.GetDevIDXml())};
			p.ClearDevIDInfo = function(){return(p.obj.ClearDevIDInfo())};
			p.SetDevIDInfo = function(strID){return(p.obj.SetDevIDInfo(strID))};
			p.ShowVideoSet =  function(){p.obj.ShowVideoSet();};
			p.SetEncription = function(bEncription){return(p.obj.SetEncription(bEncription))};
			p.getDayOfWeek = function(){return(p.obj.GetWeekStart())};
			p.SetClientName = function(name){return(p.obj.SetClientName(name))};
			p.IsIELogin = function(bIeLogin){return(p.obj.IsIELogin(bIeLogin))};
			p.GetRatio = function(){return;};
			p.Encode = function(data){return(p.obj.Encode(data))};
			p.Decode = function(data){return(p.obj.Decode(data))};	
			p.Zoom = function(chid){return(p.obj.Zoom(chid))};
			//p.GetZoomStatus = function(chid){return(p.obj.GetZoomStatus(chid))};
			//p.GetIpcAbility = function(channelMask){return p.obj.GetIpcAbility()};
			p.GetDevAllStatusReq = function(){p.obj.GetDevAllStatusReq()};
			p.FTPUpgrading = function(bPage){p.obj.FTPUpgrading(bPage)};
			p.IsInProgress = function(){return(p.obj.IsInProgress())};
		}
	}
	
	//类方法
	this.AnalyLogRes = function(xml){
		if(xml != "" && xml != null) {
			if(xml == "err") {return 0;}
			this.nMainType = findNode("HighType",xml);
			this.nSubType = findNode("LowType",xml);
			this.nMacAddr = findNode("MacAddr",xml);
			this.nChannel = findNode("ChannelNum",xml)*1;
			this.nAlarmIn = findNode("AlarmInNum",xml);
			this.nAlarmOut =  findNode("AlarmOutNum",xml);
			this.nTotalFPS = findNode("TotalFPS",xml);
			this.nTotalFPS960 = findNode("TotalFPS960",xml);
			this.nUserRight = findNode("UserSetRight",xml);
			this.bAdmin = findNode("Admin",xml);
			this.nVideoFormat = findNode("VideoFormat",xml); 
			this.nAudio = findNode("AudioNum",xml); 
			this.SubStreamMin = findNode("SubStreamMin",xml); 
			this.SubStreamMax = findNode("SubStreamMax",xml); 
			this.nPlatSupport = findNode("PlatSupport",xml)*1;	
			this.nSubStreamRestrict = findNode("SubStreamRestrict",xml)*1;
			this.nPlatFormShowTag = findNode("PlatFormShowTag",xml)*1;
			this.RouterShowTag = findNode("RouterShowTag",xml)*1;
			this.bLANShowTag = findNode("LANShowTag",xml)*1;
			this.paramSetRights = (findNode("UserSetRight",xml)*1) & 0x01;
			this.WifiStatus = findNode("WifiStatus",xml)*1;
			this.bVideoActivate = findNode("VideoActivate",xml)*1;
			this.MotionMode = findNode("MotionMode",xml)*1;
			this.ResolutionMode = findNode("ResolutionMode",xml)*1;
			this.HidePhonePage = findNode("HidePhonePage",xml)*1;
			this.RtspPageEnable = findNode("RtspPageEnable",xml)*1;
			this.FtpPageFlag = findNode("FtpPageFlag",xml)*1;
			this.c32PasswordFlag = findNode("c32PasswordFlag",xml)*1;
			this.FtpPageFlag = findNode("FtpPageFlag",xml)*1;
			this.FileSystemFlag = findNode("FileSystemFlag",xml)*1;
			this.KguardP2pUidFlag = findNode("KguardP2pUidFlag",xml)*1;
			this.EmailFlagSwitch = findNode("EmailFlagSwitch",xml)*1;
			this.EmailScheduleFlag = findNode("EmailScheduleFlag",xml)*1;
			this.PtzHiddenFlag = findNode("PtzHiddenFlag",xml)*1;
			this.c3GFlagSwitch = findNode("c3GFlagSwitch",xml)*1;
			this.c3GFlag = findNode("c3GFlag",xml)*1;
			this.RecordTypeFlag = findNode("RecordTypeFlag",xml)*1;
			this.NewAapterQTParamFlag = findNode("NewAapterQTParamFlag",xml)*1;
			
			this.UrmetDevStatusFlag = findNode("UrmetDevStatusFlag",xml)*1; 
			
			this.CloudStorageFlag = findNode("CloudStorageFlag",xml)*1;    
			this.CloudSGSerSwitch = findNode("CloudSGSerSwitch",xml)*1;
			this.IntelligentAnalysis = findNode("IntelligentAnalysis",xml)*1;
			this.RemoteFtpUpgradeSupport = 1;//findNode("RemoteFtpUpgradeSupport",xml)*1;//手动赋值1,相当于没用上这个变量
			this.MaxPOENum = findNode("MaxPOENum",xml)*1; 
			this.PtzSupported = findNode("PtzSupported",xml)*1; 
			this.eSATAEnabled = findNode("eSATAEnabled",xml)*1;
			if(this.MaxPOENum == -1){
				this.MaxPOENum = 0;
			}
			
			this.ProtocolType = findNode("ProtocolType",xml)*1;
			this.CloudeSGType = findNode("CloudeSGType",xml)*1; 
			this.customProtolFlag = findNode("customProtolFlag",xml)*1; 
			this.sgPlatformFlag = findNode("sgPlatformFlag",xml)*1;
			
			if(findNode("UserPreview",xml)){//判断是否有通道开启
				this.nPreviewChn = findNode("PreviewChannel",xml);
			}

			this.hybirdDVRFlag = findNode("hybirdDVRFlag",xml)*1;
			this.AnalogChNum = findNode("AnalogChNum",xml)*1;
			this.CoaxialFlag = findNode("CoaxialFlag",xml)*1;
			this.ResolutionMode = findNode("ResolutionMode",xml)*1;
			
			this.chname = new Array();
			this.DevType = this.nMainType >> 8 &0xf;
			this.HkDomeFlag = findNode("HkDomeFlag",xml)*1;
			this.PageControl = findNode("PageControl",xml)*1;
			//this.DevType = 3;
			/*if(this.DevType == 3){
				for(var i = 0; i< this.nChannel; ++i){
					this.chname[i] = findNode("CH"+i,xml);
				}
			}else*/{
				//补0
				if(gDvr.hybirdDVRFlag==1){
					for(var i=0; i<gDvr.AnalogChNum; i++){
						//模拟通道： CH01...
						var n =i+1;
						if( n<10 ){ n = "0" + n;}
						this.chname[i] = lg.get("IDS_CH")+(n);
					}
					for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){
						//IP通道： IP CH01...
						var n = i+1-gDvr.AnalogChNum;
						if( n<10 ){ n = "0" + n;}
						this.chname[i] = "IP " + lg.get("IDS_CH")+(n);
					}
				}else{
					for(var i = 0; i< this.nChannel; ++i){
						if( i < 9){
							this.chname[i] = lg.get("IDS_CH")+"0" + (i+1);
						}else{
							this.chname[i] = lg.get("IDS_CH")+ (i+1);
						}
					}
				}
			}
			return 1;
		}
		return 0;
	}
	
	this.Sp_Mv = function(Sp_Mv_Obj, offsetObj, name){
		var $p = $(Sp_Mv_Obj);
		var $b = $(offsetObj);
		if(gDvr.nChannel<=1){
			setTimeout(function(){
				$(gDvr.obj).css({"left": ($p.offset().left - $b.offset().left+1),
						 "top": ($p.offset().top - $b.offset().top+1),
						 "width": $p.css("width"), 
						 "height": $p.css("height")});
			},20);
		}
		else{
			$(gDvr.obj).css({"left": ($p.offset().left - $b.offset().left+1),
						 "top": ($p.offset().top - $b.offset().top+1),
						 "width": $p.css("width"), 
						 "height": $p.css("height")});
		}		 
		gDvr.ChangeWndSize(2, $p.css("width").split("px")[0] * 1, $p.css("height").split("px")[0] * 1);

	}
	
	this.HideObj = function(type){
		$(gDvr.obj).css({"width":0, "height":0});
		if(type == 0){
			gDvr.Motion("Motion", 2, 0);
		}else if(type == 1){
			gDvr.Motion("Shelter", 2, 0);
			gDvr.Motion("ImgCtrl", 2, 0);
			gDvr.Motion("ChLive", 2, 0);
		}else if(type == 2){
			gDvr.Motion("Motion", 2, 0);
			gDvr.Motion("Shelter", 2, 0);
			gDvr.Motion("ImgCtrl", 2, 0);
			gDvr.Motion("ChLive", 2, 0);
		}
		gDvr.ChangeWndSize(6,0,0);
	}
	
	this.Live_Playback = function(parentObj, type){
		$(gDvr.obj).css({"left": 0, "top": 0});
		$(gDvr.obj).css({"width":"100%","height":"100%"});
		gDvr.ChangeWndSize(type, gDvr.obj.offsetWidth, gDvr.obj.offsetHeight);	
	}
}

//全局变量类
function GlobarVar(){	
	this.nDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
	this.nStreamType = 0;
	this.ip = "";
	this.port = 80;
	this.mediaport = "";
	this.user = "admin";
	this.passwd = "";
	this.nOpenPrivew = false;
	this.lg = 0;
	this.bWebInit = false;
	this.nTimer = 0;
	this.errTitle = "";
	this.errCount = 0;
	this.nDevType = 0;
	this.ipc = 0;
	this.nVideoRatio = 1.383;
	this.nLRWidth = 452;
	
	this.sPage = "login";
	this.MacPlayReg = false;
	this.nWeekStart = 0;  //"0"代表从星期天开始，"1"代表从星期一开始，后面依次类推。。。
	this.nVideoSize = 0;
	
	this.devName = "";
	this.timer_DDNSTest = 0;
	this.var_DDNSTest_isTimeOut = false;
	
	//类方法
	this.ChangPage;
	init(this);
	function init(p){	//构造函数
		if ($.browser.safari){
			p.ChangPage = function(page){
				if ("live" == page){
					if (p.sPage == "playback" && 2 == gDvr.obj.IsCurrentPlay()){
						ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"))
						return false;
					}
					if(gVar.sPage == page)
						return false;
					gVar.sPage = page;
					menutitle(1);
					gDvr.HideObj(2);	//隐藏Motion and alarm_mv控件
					CfgCallBack = SilderGetCall; 	//设置live页面回调
					$(".mcrcontainer").css("display", "");
					$("#configPage").css("display", "none");
					$("#pathConfigPage").css("display", "none");
					$(".mcright").css("width", "244px");
					$(".mcmcmain").css("right","244px").css("height", "auto");/*height-IE6兼容*/
					$(".mcmbottom").css("display", "");
					$("#playback_slider").css("display", "none");
					$(".mcmcmain").css("bottom", "57px").css("padding-right", "0px");
					$("#live_right").css("display","block")
					$(".mcmcontainer").removeClass("safariBug2").addClass("safariBug1")
					$("#IEmcmbottom").css("display", "");
					$(".mcrborder").css("display","block");
					$("#playback_slider").css("display", "none");				
					
					gDvr.Live_Playback(".mcmcmain", 0);
					$("#left").animate({marginLeft: "0px"}, 200).focus();	
				}else if("playback" == page){
					if (p.sPage == "playback" && 2 == gDvr.obj.IsCurrentPlay()){
						ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"))
						return false;
					}
					
					if(gVar.sPage == page)
						return false;
					p.sPage = page;
					menutitle(2);
					gDvr.HideObj(2);	//隐藏Motion and alarm_mv控件
					
					$(".mcrcontainer").css("display", "none");
					$("#configPage").css("display", "none");
					$(".mcright").css("width", "18px");
					$(".mcmcmain").css("right","18px").css("height", "100%")/*height-IE6兼容*/
					$(".mcmbottom").css("display", "none");//show right border//2011.10.10
					$(".mcrborder").css("display", "block");
					$("#pathConfigPage").css("display", "none");
					$(".mcmcmain").css("bottom", "0px").css("padding-right", "0px");
					$(".mcmcontainer").removeClass("safariBug2").addClass("safariBug1")
					
					gDvr.Live_Playback(".mcmcmain", 1);
					$("#left").animate({marginLeft: "-226px"}, 200);
				}else if ("config" == page){
					if (p.sPage == "playback" && 2 == gDvr.obj.IsCurrentPlay()){
						ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"));
						return false;
					}
					if(gVar.sPage == page)
						return false;
					gVar.sPage = page;
					CfgCallBack = ErrPro;	//将参数先面回调给错误错处理
					gDvr.ChangeWndSize(6,0,0);	//隐藏控件
					menutitle(3);
					if ($(this).attr("name") != "isDown"){
						jQuery("head").append('<link href="html/cfg/css.css" rel=\"stylesheet\" type=\"text/css\" />');
						$(this).attr("name", "isDown");
						
						if( gDvr.hybirdDVRFlag && (gDvr.nChannel-gDvr.AnalogChNum)==0 ){//IPC通道数为0，纯DVR
							$("#chn_osd").click();
						}else{
							$("#IPCan_set").click();
						}
						
						$.getScript("js/divBox.js", null);
					}
					
					$("#left").animate({marginLeft: "-452px"}, 200);
					$(".mcrcontainer").css("display", "none");
					$("#pathConfigPage").css("display", "none");
					$("#configPage").css("display", "block");
					$(".mcright").css("width", "18px");
					$(".mcmcmain").css("right","18px").css("height", "0%")/*height-IE6兼容*/
					$(".mcmbottom").css("display", "none");
					$("#playback_slider").css("display", "none");
					$(".mcrborder").css("display","block");
					$(".mcmcmain").css("bottom", "0px");
					$(".mcmcontainer").addClass("safariBug2").removeClass("safariBug1")
					//转入Motion and alarm_mv 时，显示控件
					if($(".cfgactive").attr("id") == "alarmmv"){
						showConfigChild("alarm_mv");
					}else if($(".cfgactive").attr("id") == "chnsp"){
						showConfigChild("chn_sp");
					}else if($(".cfgactive").attr("id") == "sysinfhdd"){
						showConfigChild("sysinf_hdd");
					}else if($(".cfgactive").attr("id") == "autowh"){
						showConfigChild("auto_wh");
					}else if($(".cfgactive").attr("id") == "ImgCtrl"){
						showConfigChild("Img_Ctrl");
					}else if($(".cfgactive").attr("id") == "chnosd"){
						showConfigChild("chn_osd");
					}else if($(".cfgactive").attr("id") == "streamsetadvanced"){
						showConfigChild("streamset_advanced");
					}else if($(".cfgactive").attr("id") == "NewCloudStorage"){
						showConfigChild("NewCloud_Storage");
					}
					
				}else if ("configPage" == page){
					if (p.sPage == "playback" && 2 == gDvr.obj.IsCurrentPlay()){
						ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"))
						return false;
					}
					if(gVar.sPage == page)
						return false;
					gVar.sPage = page;
					//gDvr.ChangeWndSize(6,0,0);	//隐藏所有控件
					gDvr.HideObj();
					menutitle(4);
					$("#left").animate({marginLeft: "-703px"}, 200);
					$("#configPage").css("display", "none");
					$("#pathConfigPage").css("display", "block");
					$(".mcrcontainer").css("display", "none");
					$(".mcright").css("width", "18px");
					$(".mcmcmain").css("right","18px").css("height", "0%")/*height-IE6兼容*/
					$(".mcmbottom,.mcrborder,#playback_slider").css("display", "none");
					$(".mcmcontainer").addClass("safariBug2").removeClass("safariBug1")
					$(".mcmcmain").css("bottom", "0px");
					//加载PathConfig
					if ($("#pathConfigPage").attr("name") != "isDown"){
						$.get("html/pathConfig.html?"+gVar.nDate,"",function(data){
							$("#pathConfigPage").prop("innerHTML",data).attr("name", "isDown");
							$.getScript("js/pathConfig.js", null);	
							lan("pathConfig");
						},"html");
					}
					
				}
			}
		}else if($.browser.msie || $.browser.firefox || $.browser.chrome){
			p.ChangPage = function(page){
				if ("live" == page){
					//$(".liveBtnBt12").attr("name","");
					//$(".liveBtnBt12").css("background-position", "0px 0px");
					if (p.sPage == "playback" && 2 == gDvr.obj.IsCurrentPlay()){
						ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"))
						return false;
					}
					if(gVar.sPage == page)
						return false;
			
					p.sPage = page;
					menutitle(1);	
					gDvr.HideObj(2);	//隐藏Motion and alarm_mv控件
					CfgCallBack = SilderGetCall; 	//设置live页面回调			
					$(".mcmcmain").css("bottom", "0px").css("padding-right", "0px");
					$(".mcrcontainer").css("display", "");
					$("#configPage").css("display", "none");
					$(".mcright").css("width", "244px");
					
					$(".mcmcmain").css("right","244px").css("height", "auto");/*height-IE6兼容*/
					$(".mcmbottom").css("display", "");
					$(".mcmcmain").css("bottom", "57px").css("_padding-right", "244px");
					$(".mcmcontainer").removeClass("safariBug2").addClass("safariBug1");
					
					$(".mclcontainer").css("width", "226px");		 
					$(".leftCenter").css("display", "block");
					//$(".mcmain").css("left", "244px").css("height", "681px");					
					
					gDvr.Live_Playback(".mcmcmain", 0);		
					$("#left").animate({marginLeft: "0px"}, 200).focus();		
				}else if("playback" == page){
					if(gVar.sPage == page)
						return false;
					p.sPage = page;
					menutitle(2);
					gDvr.HideObj(2);	//隐藏Motion and alarm_mv控件
					$(".mcrcontainer").css("display", "none");
					$("#configPage").css("display", "none");
					$(".mcright").css("width", "18px");
					$(".mcmcmain").css("right","18px").css("height", "100%")/*height-IE6兼容*/
					$(".mcmbottom").css("display", "none");
					$(".mcmcmain").css("bottom", "0px").css("padding-right", "0px");
					$(".mcmcontainer").removeClass("safariBug2").addClass("safariBug1")
					$(".mclcontainer").css("width", "226px");		 
					$(".leftCenter").css("display", "block");
					//$(".mcmain").css("left", "244px").css("height", "681px");
					
					gDvr.Live_Playback(".mcmcmain", 1);
					
					$("#left").animate({marginLeft: "-226px"}, 200);
				}else if("config" == page){
					if (p.sPage == "playback" && 2 == gDvr.obj.IsCurrentPlay()){
						ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"))
						return false;
					}
					if(gVar.sPage == page)
						return false;
					p.sPage = page;
					menutitle(3);
					CfgCallBack = ErrPro;	//将参数先面回调给错误错处理
					gDvr.ChangeWndSize(6,0,0);	//隐藏控件
					$("#left").animate({marginLeft: "-452px"}, 10);
					if ($(this).attr("name") != "isDown"){
						jQuery("head").append('<link href="html/cfg/css.css" rel=\"stylesheet\" type=\"text/css\" />');
						$(this).attr("name", "isDown");
						
						if( gDvr.hybirdDVRFlag && (gDvr.nChannel-gDvr.AnalogChNum)==0 ){//IPC通道数为0，纯DVR
							$("#chn_osd").click();
						}else{
							$("#IPCan_set").click();
							//gCurConfigPage = "IPCan_set";
						}
						$.getScript("js/divBox.js", null);	
					}else{
						if(IsShow(gCurConfigPage)){
							showConfigChild(gCurConfigPage);
							//$("#"+gCurConfigPage).click();
						}else{
							if( gDvr.hybirdDVRFlag && (gDvr.nChannel-gDvr.AnalogChNum)==0 ){//IPC通道数为0，纯DVR
								$("#chn_osd").click();
							}else{
								$("#IPCan_set").click();
							}
						}
					}
					
					
					$(".mcrcontainer").css("display", "none");
					$("#pathConfigPage").css("display", "none");
					$("#configPage").css("display", "block");
					$(".mcright").css("width", "18px");
					$(".mcmcmain").css("right","18px").css("height", "0%")/*height-IE6兼容*/
					$(".mcmbottom").css("display", "none");
					$(".mcmcmain").css("bottom", "0px");
					$(".mcmcontainer").addClass("safariBug2").removeClass("safariBug1")
					
					$(".mclcontainer").css("width", "250px");		 
					$(".leftCenter").css("display", "block");
					//$(".mcmain").css("left", "250px").css("height", "672px");
							
							/*			
					//转入Motion and alarm_mv 时，显示控件
					if($(".cfgactive").attr("id") == "alarmmv"){
						showConfigChild("alarm_mv");
					}else if($(".cfgactive").attr("id") == "chnsp"){
						showConfigChild("chn_sp");
					}else if($(".cfgactive").attr("id") == "sysinfhdd"){
						showConfigChild("sysinf_hdd");
					}else if($(".cfgactive").attr("id") == "ImgCtrl"){
						showConfigChild("Img_Ctrl");
					}else if($(".cfgactive").attr("id") == "chnosd"){
						showConfigChild("chn_osd");
					}else if($(".cfgactive").attr("id") == "streamsetadvanced"){
						showConfigChild("streamset_advanced");
					}
					*/
				}else if("configPage" == page){
					if (p.sPage == "playback" && 2 == gDvr.obj.IsCurrentPlay()){
						ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"))
						return false;
					}
					if(gVar.sPage == page)
						return false;
					p.sPage = page;
					menutitle(4);
					gDvr.ChangeWndSize(6,0,0);	//隐藏所有控件
					gDvr.HideObj();
					
					$("#left").animate({marginLeft: "-678px"}, 200);
					$("#configPage").css("display", "none");
					$("#pathConfigPage").css("display", "block");
					$(".mcrcontainer").css("display", "none");
					$(".mcright").css("width", "18px");
					$(".mcmcmain").css("right","18px").css("height", "0%")/*height-IE6兼容*/
					$(".mcmbottom").css("display", "none");
					$(".mcmcmain").css("bottom", "0px");
					
					$(".mclcontainer").css("width", "226px");		
					$(".leftCenter").css("display", "none");
					//$(".mcmain").css("left", "244px").css("height", "681px").css("width", "1157px");
												
					//加载PathConfig
					if ($("#pathConfigPage").attr("name") != "isDown"){
						$.get("html/pathConfig.html?"+gVar.nDate,"",function(data){
							$("#pathConfigPage").prop("innerHTML",data).attr("name", "isDown");
							$.getScript("js/pathConfig.js", null);	
							lan("pathConfig");
						},"html");
					}
					
				}
			}
		}
	}
	
	this.XmlParsing = function(obj, xml, parent){
		var $p;
		obj.refresh();
		if ($.browser.msie && gVar.lg!="KOR" && gVar.lg!="CHT"){
			for(var i=0;i<xml.length;i++){
				obj.set(xml[i].id,xml[i].value);
			}
		}else{
			if ( (typeof xml=='string')&&xml.constructor==String){
				xml = ("<xml>"+xml+"</xml>");
			}
			if($.browser.msie && $.browser.version.indexOf("10") == 0){//IE10有bug
				var child = xml.getElementsByTagName(parent)[0].ownerDocument.getElementsByTagName("string");
		
				for(var i = 0;i < child.length; ++i){
					//obj.set(child[i].attributes.getNamedItem("id").text, child[i].text);
					obj.set(child[i].attributes[0].nodeValue, child[i].textContent);
				}
			}else{
				$(xml).find(parent).children().each(function(){
					$p = $(this);
					obj.set($p.attr("id"), $p.text());
				});
			}
		}
	}
	
	this.Ajax = function(option){
		var opts = $.extend({
			type: "POST",
			url: "",
			contentType: "text/xml",
			processData: false,
			datatype: "xml",
			timeout:10000,
			async:false,
			suc:null,
			err:function(data, state){
			}
		},option);
		
		$.ajax({
			type: opts.type,
			url: opts.url,
			contentType: opts.contentType,
			processData: opts.processData,
			datatype: opts.datatype,
			timeout:opts.timeout,
			async:opts.async,
			success:function(data, state){
				if ($.isFunction(opts.suc)){
					opts.suc(data, state)
				}else {
					alert("Globar Ajax Error");
				}
			},
			error:function(data, state){
				opts.err(data, state);
			}
		});
	}
}

function LgClass(){
	//多国语言
	this.mul = new Array;
	this.IpPortInfo = new Array;  
	this.DevID = new Array;
	this.langues = "";
	this.UIversion = 1;
	//默认语言
	this.defaultLg = "";
	//版本
	this.version =  "";
	this.logo = "";
}