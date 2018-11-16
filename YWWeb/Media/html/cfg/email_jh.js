// JavaScript Document
MasklayerHide();
$(function(){
	var isNVR = false;
	if(gDvr.DevType == 3){
		isNVR = true;
	}
	if(gDvr.hybirdDVRFlag==1){//混合DVR,执行NVR的代码
		isNVR = true;
	}
	
	if(g_bDefaultShow == true){
		$("#EmailplanDf").css("display","block");
	}
	if(gDvr.nChannel==1)
	{
		$("#JH_CHN_TABLE").css("display","none");
	}
	if((gDvr.nAlarmIn <= 0) || (gDvr.nAlarmIn > 16)){
		$(".alarm_Bban").css("display","none");
		$("#email_show_0").css("height","163px");
	}
	if(isNVR){
		 try{
		 $("#email_item,#email_table_content,#email_show_1,#EJH_CHN_TABLE,#email_channel,#email_show_0,#email_copy_day,#email_copy_ch").css("width","758px");
		 $("#email_Header_div,#Email_Alarm_div,#email_show_7,#Email_Motion_div,#Email_Event_div,#nvr_email_headTitle_div").css("width","740px");
		 }catch(e){
			 
		 alert("error");
		 }
	}
	
	var sel = 0;//星期
	var ch = -1;//通道
	var color1 = "rgb(255, 255, 0)";//黄
	var color2 = "rgb(255, 0, 0)";//红
	var color3 = "rgb(0, 102, 0)";//绿
	
	if(lgCls.version == "HONEYWELL"){
		$("#YJJH_CPQXQ").css("border", "1px solid white");
		$("#YJJH_CPHXQ").css("border", "1px solid white");
		$("#YJJH_CPQTD").css("border", "1px solid white");
		$("#YJJH_CPHTD").css("border", "1px solid white");
	}
	
	if(lgCls.version == "KGUARD"){
		color1 = "rgb(0, 102, 0)";
		color3 = "rgb(0, 180, 250)"
		$("#email_motion_hint").css("background",color3);
		$("#email_alarm_hint").css("background",color1);
	}
			
	$("#email_tag").css({"height":"27px", "padding-top":"20px"});
	$("#LAB_CLEAN_ALL").css({"margin-top":"10px","width":"500px"});
	//$("#email_line").css("display","none");
	//$("#email_show_2").css("display","none");
	$("#email_show_3").css("clear","none");
	//$("#email_show_5").css("display","none");
	$("#email_show_4").css("clear","none");
	$("#email_show_6").css("clear","none");
	$("#email_show_7").css("clear","none");
	//$("#email_show_0").css("height","200px");
	
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
		}return strHTML;
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
			$("#email_Header_div").css("height","10px");
			$("#YJJH_Header").prop("innerHTML", strHTML);
			
			var textHTML = "";
			mLeft = 0;
			for (var i=0; i<49; i++){
				if(i%4 == 0){ 
					var text = i/2%24;
					textHTML += "<div class='divBox' style='height:20px;margin-left:"+mLeft+";width:20px; text-align=center; border:none;'>"+(text<10?('0'+text):text)+"</div>";
				}
				mLeft = "40px";
			}
			$("#YJJH_HeaderText").prop("innerHTML", textHTML);
			$("#nvr_email_headTitle_div").css("display","block");
		}else{
			for (var i=0; i<23; i++){
				strHTML += "<div class='divBox' style='height:25px;line-height:25px;float:left;width:22px; border:1px solid #FFF;border-right:none;'>"+(i<10?('0'+i):i)+"</div>";
			}
			strHTML += "<div class='divBoxr' style='height:25px;line-height:25px;float:left;width:22px; border:1px solid #FFF;'>23</div>";
			$("#YJJH_Header").prop("innerHTML", strHTML);
		}
		
		$("#YJJH_alarm").prop("innerHTML", CreateDiv('Mm_div_'));
		//$("#YJJH_alarm_sub").prop("innerHTML", CreateDiv('Ns_div_'));
		$("#YJJH_motion").prop("innerHTML", CreateDiv('Nm_div_'));
		//$("#YJJH_motion_sub").prop("innerHTML", CreateDiv('Ms_div_'));
		$("#YJJH_event").prop("innerHTML", CreateDiv('Am_div_'));
		$("#YJJH_event > div").prop("innerText", "").mouseover(function(){
			if ($("#YJJH_Header").attr("name") == "down"){
				if ($(this).css("background-color").replace(/\s/g, "") != color2.replace(/\s/g, "")){
					$(this).css("background-color", color2);
				}else{
					$(this).css("background-color", "transparent");
				}
			}
		}).mousedown(function(){
			$("#YJJH_Header").attr("name", "down");
			
				if ($(this).css("background-color").replace(/\s/g, "") != color2.replace(/\s/g, "")){
					$(this).css("background-color", color2);
				}else{
					$(this).css("background-color", "transparent");
				}
			
		})
		
		$("#YJJH_motion>div,#YJJH_alarm>div,#YJJH_event > div").mouseup(function(){
			$("#YJJH_Header").attr("name", "");
		});
		
		$(document).mouseup(function(){
			$("#YJJH_Header").attr("name", "");
		});
		
		$("#YJJH_alarm>div").prop("innerText", "").mouseover(function(){
			if ($("#YJJH_Header").attr("name") == "down"){
				if ($(this).css("background-color").replace(/\s/g, "") != color1.replace(/\s/g, "")){
					$(this).css("background-color", color1);
					var numid = $(this).attr("id").split("_")[2]*1;
					if($(this).attr("id").split("_")[0] == "Mm")
					{
						$("#Ms_div_"+numid).css("background-color", "transparent");
					}else{
						$("#Mm_div_"+numid).css("background-color", "transparent");
					}				
				}else{
					$(this).css("background-color", "transparent");
				}
			}
		}).mousedown(function(){
			$("#YJJH_Header").attr("name", "down");
			
				if ($(this).css("background-color").replace(/\s/g, "") != color1.replace(/\s/g, "")){
					$(this).css("background-color", color1);
					var numid = $(this).attr("id").split("_")[2]*1;
					if($(this).attr("id").split("_")[0] == "Mm")
					{
						$("#Ms_div_"+numid).css("background-color", "transparent");
					}else{
						$("#Mm_div_"+numid).css("background-color", "transparent");
					}
				}else{
					$(this).css("background-color", "transparent");
				}
			
		})
		
		$("#YJJH_motion>div").prop("innerText", "").mouseover(function(){
			if ($("#YJJH_Header").attr("name") == "down"){
				
				if ($(this).css("background-color").replace(/\s/g, "") != color3.replace(/\s/g, "")){
					$(this).css("background-color", color3);
					var numid = $(this).attr("id").split("_")[2]*1;
					if($(this).attr("id").split("_")[0] == "Nm")
					{
						$("#Ns_div_"+numid).css("background-color", "transparent");
					}else{
						$("#Nm_div_"+numid).css("background-color", "transparent");
					}
				}else{
					$(this).css("background-color", "transparent");
				}
			}
		}).mousedown(function(){
			$("#YJJH_Header").attr("name", "down");
				
				if ($(this).css("background-color").replace(/\s/g, "") != color3.replace(/\s/g, "")){
					$(this).css("background-color", color3);
					var numid = $(this).attr("id").split("_")[2]*1;
					if($(this).attr("id").split("_")[0] == "Nm")
					{
						$("#Ns_div_"+numid).css("background-color", "transparent");
					}else{
						$("#Nm_div_"+numid).css("background-color", "transparent");
					}
				}else{
					$(this).css("background-color", "transparent");
				}
			
		});
		$("#YJJH_alarm > div").prop("innerText", "");
		$("#YJJH_motion > div").prop("innerText", "");
	
	     var str = lg.get("IDS_PATH_ALL");
		$("#YJJH_CPHTD").append('<option class="option" value="'+gDvr.nChannel+'">'+str+'</option>')
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				if(IpcAbility[i].State == 2){
					if(ch==-1){
						ch = i;//显示列表的第一项
					}
					$("#EmailORDchn, #YJJH_CPQTD, #YJJH_CPHTD").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				if(ch==-1){
					ch = i;//显示列表的第一项
				}
				$("#EmailORDchn, #YJJH_CPQTD, #YJJH_CPHTD").append('<option class="option" value="'+i+'">' + "IP " + lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');
			}
		}else{
			for (var i=0; i<gDvr.nChannel; i++){
				$("#EmailORDchn, #YJJH_CPQTD, #YJJH_CPHTD").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
			ch = 0;
		}
		
		
		//MasklayerShow();
		RfParamCall(Call, lg.get("IDS_EMAIL_INFO"), "EmailPlan", 100, "Get");	
		sel = 0;
		RfParamCall(Call, lg.get("IDS_EMAIL_INFO"), "EmailPlan", ch, "Get");
	});
	
	function tx(p,color, type){
		//console.log(type);
		if (type == 0){
			$(p).css("background-color", "transparent");
		}else{
			$(p).css("background-color", color);
		}
	}
	
	function gx(p){
		var n = $(p).css("background-color");
		n = n.replace(/[ ]/g,"");
		if (n != "transparent" && n != "rgba(0,0,0,0)"){
			return 1;
		}
		return 0;
	}
	
	var alarm = new Array();
	var alarmHi = new Array();
	var event = new Array();
	var eventHi = new Array();
	var motion = new Array();
	var motionHi = new Array();
	var sNormal = new Array();
	var sAlarm = new Array();
	var sNRec = new Array();
	var sARec = new Array();
	var bNext = false;
	function Call(xml){
		if(bNext){
			sel = $("#YJJH_CPQXQ").val();
			bNext = false;
		}else{
			sel = 0;
		}	
		$("#YJJH_CPQXQ,#EMAILORDQX").val(sel);
		$("#YJJH_CPHXQ").val(7);
		//var bshow = findNode("SmartScheduleEnable",xml)*1;
		//var bSmart = findNode("ScheduleMode",xml)*1;
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

		//$("#SMARTMODE").val(bSmart);
		//console.log(xml);	
		if(isNVR){
			$(xml).find("motion lo").each(function(i){
				motion[i] = $(this).text()*1;
			})
			$(xml).find("motion hi").each(function(i){
				motionHi[i] = $(this).text()*1;
			})
			
			$(xml).find("alarm hi").each(function(i){
				alarmHi[i] = $(this).text()*1;
			})
			$(xml).find("alarm lo").each(function(i){
				alarm[i] = $(this).text()*1;
			})
			
			$(xml).find("event lo").each(function(i){
				event[i] = $(this).text()*1;
			})
			$(xml).find("event hi").each(function(i){
				eventHi[i] = $(this).text()*1;
			})
		}
		$("#YJJH_motion>div").each(function(i){
			if(isNVR){
				if(i<32){
					tx(this,color3,(motion[sel] >> i & 0x01));
				}else{
					tx(this,color3,(motionHi[sel] >> i & 0x01));
				}
			}
		})
		$("#YJJH_event>div").each(function(i){
			if(isNVR){
				if(i<32){
					tx(this,color2,(event[sel] >> i & 0x01));
				}else{
					tx(this,color2,(eventHi[sel] >> i & 0x01));
				}
			}
		})
		$("#YJJH_alarm>div").each(function(i){
			if(isNVR){
				//var len = normal[sel].length;
				if(i<32){
					tx(this,color1,(alarm[sel] >> i & 0x01));
				}else{
					tx(this,color1,(alarmHi[sel] >> i & 0x01));
				}
			}
		})	
	}
	
	$("#EmailplanExit").click(function(){
		showConfigChild("net_email");
	})
	
	function CHOSDSaveSel(){
		var c = 0;
		var d = 0;
		$("#YJJH_alarm>div").each(function(i){
				if(isNVR){
					if(i<32){
						c |= (gx(this)<<i);
					}else{
						d |= (gx(this)<<(i-32));
					}
				}
			})
			alarm[sel] = c;
			alarmHi[sel] = d;
			c = 0;
			d = 0;
			$("#YJJH_motion>div").each(function(i){
				if(isNVR){
					if(i<32){
						c |= (gx(this)<<i);
					}else{
						d |= (gx(this)<<(i-32));
					}
				}
			})
			motion[sel] = c;
			motionHi[sel] = d;
			c = 0;
			d = 0;
			$("#YJJH_event>div").each(function(i){
				if(isNVR){
					if(i<32){
						c |= (gx(this)<<i);
					}else{
						d |= (gx(this)<<(i-32));
					}
				}else{
					c |= (gx(this)<<i);
				}
			})
			event[sel] = c;
			eventHi[sel] = d;
		}
	
	$("#YJJH_CPQXQ, #EMAILORDQX").change(function(){
		CHOSDSaveSel();
		
		sel = $(this).val();
		$("#YJJH_CPQXQ, #EMAILORDQX").val(sel);
		
		$("#YJJH_motion>div").each(function(i){
			if(isNVR){
				if(i<32){
					tx(this,color3,(motion[sel] >> i & 0x01));
				}else{
					tx(this,color3,(motionHi[sel] >> i & 0x01));
				}
			}
		})
		$("#YJJH_event>div").each(function(i){
			if(isNVR){
				//var len = normal[sel].length;
				if(i<32){
					tx(this,color2,(event[sel] >> i & 0x01));
				}else{
					tx(this,color2,(eventHi[sel] >> i & 0x01));
				}
			}
		})
		$("#YJJH_alarm>div").each(function(i){
		   if(isNVR){
				//var len = normal[sel].length;
				if(i<32){
					tx(this,color1,(alarm[sel] >> i & 0x01));
				}else{
					tx(this,color1,(alarmHi[sel] >> i & 0x01));
				}
			}
		})
	});
	
	$("#YJJH_CPXQQD").click(function(){
		$("#YJJH_CPQXQ").change();
		var q = $("#YJJH_CPQXQ").val()*1;
		var h = $("#YJJH_CPHXQ").val()*1;
		if (h == 7){
			for (var i=0; i<7; i++){
				event[i] = event[q];
				eventHi[i] = eventHi[q];
				alarm[i] = alarm[q];
				alarmHi[i] = alarmHi[q];
				motion[i] = motion[q];
				motionHi[i] = motionHi[q];
			}
		}else{
			event[h] = event[q];
			alarm[h] = alarm[q];
			motion[h] = motion[q];
			eventHi[h] = eventHi[q];
			alarmHi[h] = alarmHi[q];
			motionHi[h] = motionHi[q];
		}
		ShowPaop(lg.get("IDS_EMAIL_INFO"), lg.get("IDS_COPY_SUC"));
	})
	
	$("#YJJH_CPTDQD").click(function(){
		$("#YJJH_CPQXQ").change();
		var q = $("#YJJH_CPQTD").val()*1;
		var h = $("#YJJH_CPHTD").val()*1;
		if (q == h) return;
		var jhCopyXml = "<a>";
		if (h == gDvr.nChannel){
			var copyChid = 0;
			for(var i=0;i<gDvr.nChannel;i++){
				copyChid |= 0x01<< i;
			}
			jhCopyXml += ("<CopyChid>" + copyChid + "</CopyChid>");	
		}else{
			jhCopyXml += ("<CopyChid>" + (1<<h) + "</CopyChid>");
		}	
		jhCopyXml += ("<chid>" + ch + "</chid>");
		
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
		for (var i=0; i<7; i++){
			if(isNVR){
				jhCopyXml += ("<event>" + "<lo>" + event[i] + "</lo>" + "<hi>" + eventHi[i] + "</hi>" + "</event>");
			}
		}
		jhCopyXml += "</a>";	
		
		RfParamCall(Call, lg.get("IDS_EMAIL_INFO"), "EmailPlan", 400, "Set",jhCopyXml);
	})
	
	$("#EmailplanRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#emailjh_sch").text(), "EmailPlan", 100, "Get");
		RfParamCall(Call, $("#emailjh_sch").text(), "EmailPlan", ch, "Get");
	});
	
	$("#EmailplanDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#emailjh_sch").text(), "EmailPlan", 850, "Get"); //获取所有通道数据
		RfParamCall(Call, $("#emailjh_sch").text(), "EmailPlan", ch, "Get"); //获取单个通道数据
	});
	$("#EmailORDchn,#YJJH_CPQTD").change(function(){
		ChannelChange($(this).val());
		$("#EmailORDchn,#YJJH_CPQTD").val($(this).val());
	});
	
	
	function ChannelChange(a)
	{
		CHOSDSave();
		ch = a;
		//$("#YJJH_CPQTD").val(ch*1);
		RfParamCall(Call, lg.get("IDS_EMAIL_INFO"), "EmailPlan", ch, "Get");
	}
	
	function CHOSDSave(){
		$("#YJJH_CPQXQ").change();
		var xml = "<a>";
		xml += ("<chid>" + ch + "</chid>");
		for (var i=0; i<7; i++){
			if(isNVR){
				xml += ("<motion>" + "<lo>" + motion[i] + "</lo>" + "<hi>" + motionHi[i] + "</hi>" + "</motion>");
			}
		}
		//console.log("motion:"+ motion+" "+motionHi);
		for (var i=0; i<7; i++){
			if(isNVR){
			  	xml += ("<alarm>" + "<lo>" + alarm[i] + "</lo>" + "<hi>" + alarmHi[i] + "</hi>" + "</alarm>");
			}
		}
		//console.log("alarm:"+ alarm+" "+alarmHi);
		for (var i=0; i<7; i++){
			if(isNVR){
			  	xml += ("<event>" + "<lo>" + event[i] + "</lo>" + "<hi>" + eventHi[i] + "</hi>" + "</event>");
			}
		}
		//console.log("event:"+ event+" "+eventHi);
		xml += "</a>";	
		RfParamCall(Call, lg.get("IDS_EMAIL_INFO"), "EmailPlan", ch, "Set", xml);
	}
	$("#EmailplanSave").click(function(){
		CHOSDSave();
		RfParamCall(Call, lg.get("IDS_EMAIL_INFO"), "EmailPlan", 200, "Set");
	});
	
	$("#YJJH_CHNEXT").click(function(){
		var tempSel = $("#EmailORDchn").val();
		if( tempSel == gDvr.nChannel - 1){
			tempSel = 0;
		}else{
			tempSel++;
		}
		bNext = true;
		$("#EmailORDchn").val(tempSel);
		$("#EmailORDchn").change();
	})
	
	/*
	$("#YJJH_WEEKNEXT").click(function(){
		var weekSel = $("#EMAILORDQX").val();
		if( weekSel == 7-1){
			weekSel = 0;
		}else{
			weekSel++;
		}
		$("#EMAILORDQX").val(weekSel);
		$("#EMAILORDQX").change();
	})
	$("#YJJH_CLEANALL").click(function(){
		for(var i=0; i<normal.length; i++){
			event[i] = 0;
			alarm[i] = 0;
	 		motion[i] = 0;
			eventHi[i] = 0;
			alarmHi[i] = 0;
	 		motionHi[i] = 0;
		}
		var tempSel = $("#YJJH_CPQXQ").val();
		$("#YJJH_event>div").each(function(i){
			tx(this,color3,(normal[tempSel] >> i & 0x01))
		})
		$("#YJJH_alarm>div").each(function(i){
			tx(this,color2,(alarm[tempSel] >> i & 0x01))
		})
		$("#YJJH_motion>div").each(function(i){
			tx(this,color1,(motion[tempSel] >> i & 0x01))
		})
		RfParamCall(Call, lg.get("IDS_EMAIL_INFO"), "EmailPlan", 500, "Set","set");		
	})
	*/
});