// JavaScript Document
(function($){
	$.fn.divBox = function(options){
		
		var opts = jQuery.extend({},jQuery.fn.divBox.defaults, options);
		function initHTML(e){
			var strHTML = "";
			var nMax = opts.number - 1;
			var n=0;
			for (var i=0; i<nMax; i++,n++){//i用来循环，n用来显示
				if( (nMax == 31 && i == 15) || (nMax == 23 && i == 11 && !gDvr.hybirdDVRFlag) || (i==(gDvr.AnalogChNum-1) && gDvr.hybirdDVRFlag) ){
					strHTML += ("<div class='"+opts.nclass+"' style='height:"+opts.height+"px;float:left;overflow:hidden;width:"+opts.width+"px; border:1px solid "+opts.borderColor+";text-align:center'>"+(n+1)+"</div>");
					strHTML += ("<br/>");
					if(gDvr.hybirdDVRFlag){n=-1}
					continue;
				}
				strHTML += ("<div class='"+opts.nclass+"' style='height:"+opts.height+"px;float:left;overflow:hidden;width:"+opts.width+"px; border:1px solid "+opts.borderColor+";border-right:none;text-align:center ;-moz-user-select: none;'>"+(n+1)+"</div>");
			}
			strHTML += ("<div class='"+opts.nclass+"' style='height:"+opts.height+"px;float:left;overflow:hidden;width:"+opts.width+"px; border:1px solid "+opts.borderColor+";text-align:center; -moz-user-select: none;'>"+(n+1)+"</div>");
			if (!$("#"+opts.bDownID)[0]){
				strHTML +=("<div id='"+opts.bDownID+"' style='width:0px; height:0px; overflow:hidden; -moz-user-select: none;'></div>");
			}
			e.prop("innerHTML", strHTML);
		}
		
		return this.each(function() {
			initHTML($(this));
			opts.bDownID = "#"+opts.bDownID;
			$("#"+$(this).attr("id") + ">div").mouseover(function(){
				if (!opts.bEnable) return;
				$(this).css("cursor", "pointer");
				if ($(opts.bDownID).attr("name") == "down"){
					if (($(this).css("background-color")).replace(/[ ]/g,"") != (opts.bkColor).replace(/[ ]/g,"")){
						$(this).css("background-color", opts.bkColor);
					}else{
						$(this).css("background-color", opts.parentColor);
					}
					
				}
			}).mousedown(function(){
				if (!opts.bEnable) return;
				$(opts.bDownID).attr("name", "down");
				$(this).css("cursor", "pointer");
				if (($(this).css("background-color")).replace(/[ ]/g,"") != (opts.bkColor).replace(/[ ]/g,"")){
					$(this).css("background-color", opts.bkColor);
				}else{
					$(this).css("background-color", opts.parentColor);
				}
			}).mouseup(function(){
				$(opts.bDownID).attr("name", "")
			});
			$(document).mouseup(function(){
				$(opts.bDownID).attr("name", "")
			});
		});  
	};
	
	jQuery.fn.divBox.defaults = {
		borderColor: "#fff",
		parentColor: "transparent",
		bkColor:"#f00",
		height: 23,
		width: 30,
		number:24,
		nclass:"",
		bDownID:"bDownIDNew",
		bEnable:true
	};
})(jQuery);

//timer
(function($){
	$.fn.timer = function(options){		
		var opts = jQuery.extend({},jQuery.fn.timer.defaults, options);
		return this.each(function() {
			jQuery.fn.timer.InsertHtml($(this), opts.Type);
		});		
	};
	
	jQuery.fn.timer.InsertHtml = function(obj, type){
		var id = obj.attr("id");
		
		var strHTML1="",strHTML2="";
		
		for (var i=0; i<60; i++){
			strHTML1 += '<option value="'+i+'">'+((""+i).length<2?"0"+i:i)+'</option>';
		}
		
		if (type == 0 || type == 3){ //12小时制
			strHTML2 += '<option value="0">12</option>';
			for (var i=1; i<12; i++){
				strHTML2 += '<option value="'+i+'">'+((""+i).length<2?"0"+i:i)+'</option>';
			}
		}else{	//24
			for (var i=0; i<24; i++){
				strHTML2 += '<option value="'+i+'">'+((""+i).length<2?"0"+i:i)+'</option>';
			}
		}
		
		var strHTML = ("<table class='timer'><tr><td><div><select id='"+id+"_Hour' class='timerHour'>"+strHTML2+"</select></div><td>:</td></td><td><div><select id='"+id+"_Min' class='timerMin'>"+strHTML1+"</select></div><td id='"+id+"_Point'>:</td></td><td class='divBoxSec'><div><select id='"+id+"_Sec' class='timerSec'>"+strHTML1+"</select></div></td><th><div><select id='"+id+"_Type' class='timerType'><option value='0'>AM</option><option value='1'>PM</option></select></div></th></tr></table>");
		obj.prop("innerHTML", strHTML);
		if (type == 0){
			$("#"+id+"_Type").css("display", "block");
		}else if(type == 1){
			$("#"+id+"_Type").css("display", "none");
		}else if(type == 2){//type==2时,不显示秒,24小时制不显示AMPM
			$("#"+id+"_Type").css("display", "none");
			$("#"+id+"_Point").css("display", "none");
			$("#"+id+"_Sec").css("display", "none");
		}else if(type == 3){//type==3时,不显示秒,12小时制显示AMPM
			$("#"+id+"_Type").css("display", "block");
			$("#"+id+"_Point").css("display", "none");
			$("#"+id+"_Sec").css("display", "none");
			$(".divBoxSec").css("display","none");
		}
	}
	
	jQuery.fn.timer.GetTimeFor24 = function(obj){
		var id = obj.attr("id");
		var timerHour = $("#"+id+"_Hour").val()*1;
		var timerMin = $("#"+id+"_Min").val()*1;
		var timerSec = $("#"+id+"_Sec").val()*1;
		var zs = $("#"+id+"_Type").val()*1;
		if ($("#"+id+"_Type").css("display") != "none"){//12
			if (zs == 0){ //am
				return (timerHour+ ":" + timerMin + ":" + timerSec);
			}else{
				return ((timerHour+12)+ ":" + timerMin + ":" + timerSec);
			}
		}else{
			return (timerHour+ ":" + timerMin + ":" + timerSec);
		}
	}
	
	jQuery.fn.timer.SetTimeIn24 = function(time, obj){
		var id = obj.attr("id");
		var timerHour = time.split(":")[0]*1;
		var timerMin = time.split(":")[1]*1;
		var timerSec = time.split(":")[2]*1;
		$.fn.timer.InsertHtml(obj, 1);	
		$("#"+id+"_Hour").val(timerHour);
		$("#"+id+"_Min").val(timerMin);
		$("#"+id+"_Sec").val(timerSec);
	}
	
	jQuery.fn.timer.ChangeType = function (type, obj) {
		var id = obj.attr("id");
		var timerHour = $("#"+id+"_Hour").val()*1;
		var timerMin = $("#"+id+"_Min").val()*1;
		var timerSec = $("#"+id+"_Sec").val()*1;
		var zs = $("#"+id+"_Type").val()*1;
		//重绘timer
		$.fn.timer.InsertHtml(obj, type)
		
		//时间计算
		if (type == 1 || type == 2){	//24小时制
			$("#"+id+"_Type").css("display", "none");
			if (zs == 0){	//AM
				$("#"+id+"_Hour").val(timerHour);
			}else{	//PM
				$("#"+id+"_Hour").val(timerHour+12);
			}
		}else {	//24 -> 12小时制
			$("#"+id+"_Type").css("display", "block");
			if (timerHour < 12){	//AM
				$("#"+id+"_Type").val(0);
				$("#"+id+"_Hour").val(timerHour);
			}else {	//PM
				$("#"+id+"_Type").val(1);
				$("#"+id+"_Hour").val(timerHour-12);
			}
		}
		
		$("#"+id+"_Min").val(timerMin)
		$("#"+id+"_Sec").val(timerSec)
	};
	
	jQuery.fn.timer.defaults = {
		Type:0	//0--12小时制，1--24小时制
	};
})(jQuery);