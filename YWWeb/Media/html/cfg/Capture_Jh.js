// JavaScript Document
MasklayerHide();
$(function(){
	var isNVR = false;
	switch(lgCls.version){
		case "OWL":{
			$("#CapJh_WeekCopy_cp").css("display","none");
			$("#CapJh_ChCopy_cp").css("display","none");
			break;
		}
		default:{
			break;
		}
	}
	if(g_bDefaultShow == true){
		$("#CapJh_Df").css("display","block");
	}
	if(gDvr.nChannel==1)
	{
		$("#CapJh_CHN_div").css("display","none");
	}
	if((gDvr.nAlarmIn <= 0) || (gDvr.nAlarmIn > 16)){
		$(".CapJh_alarm_Bban").css("display","none");
		$(".CapJh_tabel").css("height","153px");
	}
	
	if(gDvr.DevType == 3){//NVR
		isNVR = true;
	}
	if(gDvr.hybirdDVRFlag){//混合DVR,执行NVR的代码
		isNVR = true;
	}
	
	if(isNVR){
		try{
			$("#CapJh_item,#CapJh_table_content,#CapJh_CHN_div,#CapJh_WeekTop_div,#CapJh_html_div,#CapJh_WeekCopy_div,#CapJh_ChCopy_div").css("width","758px");
			$("#CapJh_Rule_kedu1,#CapJh_Normal1,#Normal_sub_div,#CapJh_M1,#Normal_motion_div,#CapJh_Alarm1,#CapJh_Rule_Num1").css("width","740px");
		}catch(e){			 
			alert("error");
		}
	}
	
	if(lgCls.version == "HONEYWELL"){
		$("#CapJh_WeekCopy_src").css("border", "1px solid white");
		$("#CapJh_WeekCopy_dest").css("border", "1px solid white");
		$("#CapJh_ChCopy_src").css("border", "1px solid white");
		$("#CapJh_ChCopy_dest").css("border", "1px solid white");
	}
	
	var nXQ = 0;//星期
	var ch = -1;//通道
	var color1 = "rgb(255, 255, 0)";
	var color2 = "rgb(255, 0, 0)";
	var color3 = "rgb(0, 102, 0)";
	
	switch(lgCls.version){
		case "SWANN":{
			$("#CapJh_SWANN_N,#CapJh_SWANN_M").css("display","block");
			if(gDvr.nAlarmIn > 0 ){
				$("#CapJh_SWANN_A").css("display","block");
				$(".CapJh_tabel").css("height","215px");
			}else{
				$(".CapJh_tabel").css("height","188px");
			}
			break;
		}
		/*
		case "OWL":{
			$("#CapJh_SWANN_N,#CapJh_SWANN_M").css("display","block");
			if(gDvr.nAlarmIn > 0 ){
				$("#CapJh_SWANN_A").css("display","block");
			}
			break;
		}*/
		case "KGUARD":{
			color3 = "rgb(0, 180, 250)";
			color1 = "rgb(0, 102, 0)";
			$("#CapJh_normal_hint").css("background",color3);
			$("#CapJh_MotionTag2").css("background",color1);
			break;
		}			
		default:
			break;
	}
	
	function CreateDiv(id){
		var strHTML = "";
		if(isNVR){
			for (var i=0; i<47; i++){
				strHTML += "<div class='divBox' id='"+id+i+"' style='height:17px;line-height:17px;float:left;width:14px; border:1px solid #FFF;border-right:none;'></div>";
			}
			strHTML += "<div class='divBoxr' id='"+id+"47' style='height:17px;line-height:17px;float:left;width:14px; border:1px solid #FFF;'></div>";
		}else{
			for (var i=0; i<23; i++){
				strHTML += "<div class='divBox' id='"+id+i+"' style='height:25px;line-height:25px;float:left;width:22px; border:1px solid #FFF;border-right:none;'></div>";
			}
			strHTML += "<div class='divBoxr' id='"+id+"23' style='height:25px;line-height:25px;float:left;width:22px; border:1px solid #FFF;'></div>";
		}
		return strHTML;
	}
	$(function(){
		if ($.browser.msie && $.browser.version.indexOf("9") == -1){
			color1 = color1.replace(/\s/g, "");
			color2 = color2.replace(/\s/g, "");
			color3 = color3.replace(/\s/g, "");
		}
		var strHTML = "";
		if(isNVR){
			var mLeft = 0;
			for (var i=0; i<49; i++){
				if(i%4 == 0){ 
					strHTML += "<div class='divBox' style='height:10px;margin-left:"+mLeft+";width:1px; background-color:white;'></div>";
				}else{
					strHTML += "<div class='divBox' style=' margin-left:"+mLeft+"; width:1px;'><div style='height:5px;width:1px;'></div><div style='height:3px;width:1px; background-color:white;'></div></div>";
				}
				mLeft = "13px";
			}
			$("#CapJh_Rule_kedu1").css("height","10px");
			$("#CapJh_Rule_kedu2").prop("innerHTML", strHTML);
			
			var textHTML = "";
			mLeft = 0;
			for (var i=0; i<49; i++){
				if(i%4 == 0){ 
					var text = i/2%24;
					textHTML += "<div class='divBox' style='height:20px;margin-left:"+mLeft+";width:20px; text-align=center; border:none;'>"+(text<10?('0'+text):text)+"</div>";
				}
				mLeft = "40px";
			}
			$("#CapJh_Rule_Num2").prop("innerHTML", textHTML);
			$("#CapJh_Rule_Num1").css("display","block");
		}
		
		$("#CapJh_Normal2").prop("innerHTML", CreateDiv('Nm_div_'));
		$("#CapJh_M2").prop("innerHTML", CreateDiv('Mm_div_'));
		$("#CapJh_Alarm2").prop("innerHTML", CreateDiv('Am_div_'));
		
		$("#CapJh_Alarm2 > div").prop("innerText", "").mouseover(function(){
			if ($("#CapJh_Rule_kedu2").attr("name") == "down"){
				if ($(this).css("background-color").replace(/\s/g, "") != color2.replace(/\s/g, "")){
					$(this).css("background-color", color2);
				}else{
					$(this).css("background-color", "transparent");
				}
			}
		}).mousedown(function(){
			$("#CapJh_Rule_kedu2").attr("name", "down");			
			if ($(this).css("background-color").replace(/\s/g, "") != color2.replace(/\s/g, "")){
				$(this).css("background-color", color2);
			}else{
				$(this).css("background-color", "transparent");
			}
		})
		
		$("#CapJh_Alarm2 > div,#CapJh_M2>div,#CapJh_Normal2>div").mouseup(function(){
			$("#CapJh_Rule_kedu2").attr("name", "");
		});
		
		$(document).mouseup(function(){
			$("#CapJh_Rule_kedu2").attr("name", "");
		});
		
		$("#CapJh_M2>div").prop("innerText", "").mouseover(function(){
			if ($("#CapJh_Rule_kedu2").attr("name") == "down"){
				if ($(this).css("background-color").replace(/\s/g, "") != color1.replace(/\s/g, "")){
					$(this).css("background-color", color1);
				}else{
					$(this).css("background-color", "transparent");
				}
			}
		}).mousedown(function(){
			$("#CapJh_Rule_kedu2").attr("name", "down");			
			if ($(this).css("background-color").replace(/\s/g, "") != color1.replace(/\s/g, "")){
				$(this).css("background-color", color1);
			}else{
				$(this).css("background-color", "transparent");
			}
		})
		
		$("#CapJh_Normal2>div").prop("innerText", "").mouseover(function(){
			if ($("#CapJh_Rule_kedu2").attr("name") == "down"){				
				if ($(this).css("background-color").replace(/\s/g, "") != color3.replace(/\s/g, "")){
					$(this).css("background-color", color3);
				}else{
					$(this).css("background-color", "transparent");
				}
			}
		}).mousedown(function(){
			$("#CapJh_Rule_kedu2").attr("name", "down");				
			if ($(this).css("background-color").replace(/\s/g, "") != color3.replace(/\s/g, "")){
				$(this).css("background-color", color3);
			}else{
				$(this).css("background-color", "transparent");
			}
		});
		
		$("#CapJh_M2 > div").prop("innerText", "");
		$("#CapJh_Normal2 > div").prop("innerText", "");
	
	    var str = lg.get("IDS_PATH_ALL");
		$("#CapJh_ChCopy_dest").append('<option class="option" value="'+gDvr.nChannel+'">'+str+'</option>')
		
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			//模拟通道，在线才添加；
			//IP通道，全部添加
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				if(IpcAbility[i].State == 2){
					if(ch==-1){
						ch = i;//显示列表的第一项
					}
					$("#CapJh_CHN_Value, #CapJh_ChCopy_src, #CapJh_ChCopy_dest").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				if(ch==-1){
					ch = i;//显示列表的第一项
				}
				$("#CapJh_CHN_Value, #CapJh_ChCopy_src, #CapJh_ChCopy_dest").append('<option class="option" value="'+i+'">' + "IP " + lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');
			}
		}else{
			for (var i=0; i<gDvr.nChannel; i++){
				$("#CapJh_CHN_Value, #CapJh_ChCopy_src, #CapJh_ChCopy_dest").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
			ch = 0;
		}
		
		//MasklayerShow();
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", 100, "Get");			
		nXQ = 0;
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", ch, "Get");
	});
	
	//填写
	function tx(p,color, type){
		if (type == 0){
			$(p).css("background-color", "transparent");
		}else{
			$(p).css("background-color", color);
		}
	}
	
	//勾选
	function gx(p){
		var n = $(p).css("background-color");
		n = n.replace(/[ ]/g,"");
		if (n != "transparent" && n != "rgba(0,0,0,0)"){
			return 1;
		}
		return 0;
	}
	
	var normal = new Array();
	var normalHi = new Array();
	
	var alarm = new Array();
	var alarmHi = new Array();
	
	var motion = new Array();
	var motionHi = new Array();
	
	function Call(xml){
		//console.log("call:" + xml);
		if(xml == "suc")
		return ;
		nXQ = 0;
		$("#CapJh_WeekCopy_src,#CapJh_WeekTop_Value").val(nXQ);//星期源
		$("#CapJh_WeekCopy_dest").val(7);//星期目标
		
		if ($.browser.msie && $.browser.version*1 >= 9){
			xml = "<a>" + xml + "</a>";
		}else if($.browser.msie){
			xml = "<a>"+xml+"</a>";
			var ajaxfxml = new ActiveXObject("Microsoft.XMLDOM");
			ajaxfxml.async = false;
			ajaxfxml.loadXML(xml);
			xml = ajaxfxml;
		}else{
			xml = "<xml><a>"+xml+"</a></xml>";
		}
		
		//获取数据，保存到Array中
		if(isNVR){
			//Normal
			$(xml).find("normal hi").each(function(i){
				normalHi[i] = $(this).text()*1;
			})
			$(xml).find("normal lo").each(function(i){
				normal[i] = $(this).text()*1;
			})
			
			//Motion
			$(xml).find("motion lo").each(function(i){
				motion[i] = $(this).text()*1;
			})
			$(xml).find("motion hi").each(function(i){
				motionHi[i] = $(this).text()*1;
			})
			
			//Alarm
			$(xml).find("alarm lo").each(function(i){
				alarm[i] = $(this).text()*1;
			})
			$(xml).find("alarm hi").each(function(i){
				alarmHi[i] = $(this).text()*1;
			})
		}
		
		//使用Array里的数据，填写
		$("#CapJh_Normal2>div").each(function(i){
			if(isNVR){
				if(i<32){
					tx(this,color3,(normal[nXQ] >> i & 0x01));
				}else{
					tx(this,color3,(normalHi[nXQ] >> i & 0x01));
				}
			}
		})
		
		$("#CapJh_Alarm2>div").each(function(i){
			if(isNVR){
				if(i<32){
					tx(this,color2,(alarm[nXQ] >> i & 0x01));
				}else{
					tx(this,color2,(alarmHi[nXQ] >> i & 0x01));
				}
			}
		})
		
		$("#CapJh_M2>div").each(function(i){
			if(isNVR){
				if(i<32){
					tx(this,color1,(motion[nXQ] >> i & 0x01));
				}else{
					tx(this,color1,(motionHi[nXQ] >> i & 0x01));
				}
			}
		})
	}
	
	function CHOSDSaveSel(){
		var c = 0;
		var d = 0;
		
		$("#CapJh_Normal2>div").each(function(i){
			if(isNVR){
				if(i<32){
					c |= (gx(this)<<i);
				}else{
					d |= (gx(this)<<(i-32));
				}
			}
		})
		normal[nXQ] = c;
		normalHi[nXQ] = d;
				
		c = 0;
		d = 0;
		$("#CapJh_M2>div").each(function(i){
			if(isNVR){
				if(i<32){
					c |= (gx(this)<<i);
				}else{
					d |= (gx(this)<<(i-32));
				}
			}
		})
		motion[nXQ] = c;
		motionHi[nXQ] = d;
				
		c = 0;
		d = 0;
		$("#CapJh_Alarm2>div").each(function(i){
			if(isNVR){
				if(i<32){
					c |= (gx(this)<<i);
				}else{
					d |= (gx(this)<<(i-32));
				}
			}
		})
		alarm[nXQ] = c;
		alarmHi[nXQ] = d;
	}
	
	//星期
	$("#CapJh_WeekCopy_src, #CapJh_WeekTop_Value").change(function(){
		//星期1 ---> 星期2
		
		CHOSDSaveSel();//先保存星期1的数据
		
		nXQ = $(this).val()*1;//再显示星期2的数据
		$("#CapJh_WeekCopy_src, #CapJh_WeekTop_Value").val(nXQ);
	
		//使用Array里的数据，填写
		$("#CapJh_Normal2>div").each(function(i){
			if(isNVR){
				if(i<32){
					tx(this,color3,(normal[nXQ] >> i & 0x01));
				}else{
					tx(this,color3,(normalHi[nXQ] >> i & 0x01));
				}
			}
		})
		
		$("#CapJh_Alarm2>div").each(function(i){
			if(isNVR){
				if(i<32){
					tx(this,color2,(alarm[nXQ] >> i & 0x01));
				}else{
					tx(this,color2,(alarmHi[nXQ] >> i & 0x01));
				}
			}
		})
	    $("#CapJh_M2>div").each(function(i){
		   if(isNVR){
				if(i<32){
					tx(this,color1,(motion[nXQ] >> i & 0x01));
				}else{
					tx(this,color1,(motionHi[nXQ] >> i & 0x01));
				}
			}
		})
	});
	
	//星期Copy按钮
	$("#CapJh_WeekCopy_btn").click(function(){
		$("#CapJh_WeekCopy_src").change();
		var q = $("#CapJh_WeekCopy_src").val()*1;//源
		var h = $("#CapJh_WeekCopy_dest").val()*1;//目标
		
		if (h == 7){//目标All
			for (var i=0; i<7; i++){
				normal[i] = normal[q];
				normalHi[i] = normalHi[q];
				
				alarm[i] = alarm[q];
				alarmHi[i] = alarmHi[q];
				
				motion[i] = motion[q];
				motionHi[i] = motionHi[q];
			}
		}else{//单个目标
			normal[h] = normal[q];
			alarm[h] = alarm[q];
			
			motion[h] = motion[q];
			normalHi[h] = normalHi[q];
			
			alarmHi[h] = alarmHi[q];
			motionHi[h] = motionHi[q];
		}
		ShowPaop($("#CapJh_sch").text(), lg.get("IDS_COPY_SUC"));
	})
	
	//通道Copy按钮
	$("#CapJh_ChCopy_btn").click(function(){
		$("#CapJh_WeekCopy_src").change();
		var q = $("#CapJh_ChCopy_src").val()*1;//源
		var h = $("#CapJh_ChCopy_dest").val()*1;//目标
		if (q == h) return;
		var jhCopyXml = "<a>";
		if (h == gDvr.nChannel){//目标All
			var copyChid = 0;
			for(var i=0;i<gDvr.nChannel;i++){
				copyChid |= 0x01<< i;
			}
			jhCopyXml += ("<CopyChid>" + copyChid + "</CopyChid>");	
		}else{//单个目标
			jhCopyXml += ("<CopyChid>" + (1<<h) + "</CopyChid>");
		}	
		jhCopyXml += ("<chid>" + ch + "</chid>");
		
		for (var i=0; i<7; i++){
			if(isNVR){
				jhCopyXml += ("<normal>" + "<lo>" + normal[i] + "</lo>" + "<hi>" + normalHi[i] + "</hi>" + "</normal>");
			}
		}
		for (var i=0; i<7; i++){
			if(isNVR){
				jhCopyXml += ("<alarm>" + "<lo>" + alarm[i] + "</lo>" + "<hi>" + alarmHi[i] + "</hi>" + "</alarm>");
			}
		}
		for (var i=0; i<7; i++){
			if(isNVR){
				jhCopyXml += ("<motion>" + "<lo>" + motion[i] + "</lo>" + "<hi>" + motionHi[i] + "</hi>" + "</motion>");
			}
		}
		
		jhCopyXml += "</a>";	
		
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", 400, "Set",jhCopyXml);
	})
	
	//刷新按钮
	$("#CapJh_Rf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", 100, "Get");
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", ch, "Get");
	});
	
	//Defalut按钮
	$("#CapJh_Df").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", 850, "Get");
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", ch, "Get");
	});
	
	//通道
	$("#CapJh_CHN_Value,#CapJh_ChCopy_src").change(function(){
		ChannelChange($(this).val());
		$("#CapJh_CHN_Value,#CapJh_ChCopy_src").val($(this).val());
	});
	
	
	function ChannelChange(a)
	{
		CHOSDSave();
		ch = a;
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", ch, "Get");
	}
	
	function CHOSDSave(){
		$("#CapJh_WeekCopy_src").change();
		var xml = "<a>";
		xml += ("<chid>" + ch + "</chid>");
		
		for (var i=0; i<7; i++){
			if(isNVR){
				xml += ("<normal>" + "<lo>" + normal[i] + "</lo>" + "<hi>" + normalHi[i] + "</hi>" + "</normal>");
			}
		}
		for (var i=0; i<7; i++){
			if(isNVR){
				xml += ("<alarm>" + "<lo>" + alarm[i] + "</lo>" + "<hi>" + alarmHi[i] + "</hi>" + "</alarm>");
			}
		}
		for (var i=0; i<7; i++){
			if(isNVR){
				xml += ("<motion>" + "<lo>" + motion[i] + "</lo>" + "<hi>" + motionHi[i] + "</hi>" + "</motion>");
			}
		}
		xml += "</a>";	
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", ch, "Set", xml);
	}
	
	//保存按钮
	$("#CapJh_Save").click(function(){
		CHOSDSave();
		RfParamCall(Call, $("#CapJh_sch").text(), "CaptureJh", 200, "Set");
	});
});