// JavaScript Document
MasklayerHide();
$(function(){
	var isNVR = false;
	switch(lgCls.version){
		case "OWL":{
			$("#rec_copyDay").css("display","none");
			$("#rec_copyCh").css("display","none");
			break;
		}
		default:{
			break;
		}
	}
	if(g_bDefaultShow == true){
		$("#RecplanDf").css("display","block");
	}
	if(gDvr.nChannel==1)
	{
		$("#JH_CHN_TABLE").css("display","none");
	}
	if((gDvr.nAlarmIn <= 0) || (gDvr.nAlarmIn > 16)){
		$(".alarm_Bban").css("display","none");
		$(".tabel").css("height","153px");
	}
	
	if(gDvr.DevType == 3){//NVR
		isNVR = true;
	}
	if(gDvr.hybirdDVRFlag){//混合DVR,执行NVR的代码
		isNVR = true;
	}
	
	if(isNVR){
		 try{
		 $("#rd_item,#rd_table_content,#smart_show_1,#JH_CHN_TABLE,#rd_channel,#smart_show_0,#rd_copy_day,#rd_copy_ch").css("width","758px");
		 $("#Header_div,#Normal_div,#Normal_sub_div,#smart_show_7,#Normal_motion_div,#Alarm_div,#nvr_headTitle_div").css("width","740px");
		 }catch(e){
			 
		 alert("error");
		 }
	}
	
	if(lgCls.version == "HONEYWELL"){
		$("#LXJH_CPQXQ").css("border", "1px solid white");
		$("#LXJH_CPHXQ").css("border", "1px solid white");
		$("#LXJH_CPQTD").css("border", "1px solid white");
		$("#LXJH_CPHTD").css("border", "1px solid white");
	}
	
	
	$("#SMARTMODE").change(function(){
		if($(this).val() == 0)
		{
		   $("#LXJH_normal>div").each(function(i){
			tx(this,color3,(normal[sel] >> i & 0x01))
		    })
		   $("#LXJH_alarm>div").each(function(i){
			tx(this,color2,(alarm[sel] >> i & 0x01))
		    })
		   $("#LXJH_motion>div").each(function(i){
			tx(this,color1,(motion[sel] >> i & 0x01))
		    })
			
			$("#smart_tag").css({"height":"27px", "padding-top":"20px"});
			$("#LAB_CLEAL_ALL").css({"margin-top":"10px","width":"500px"});
			$("#smart_line").css("display","none");
			$("#smart_show_1").css("display","none");
	        $("#smart_show_2").css("display","none");
		    $("#smart_show_3").css("display","block");
	        $("#smart_show_5").css("display","none");
	        $("#smart_show_4").css("clear","none");
	        $("#smart_show_6").css("clear","none");
			$("#smart_show_7").css("display","block");
	        $("#smart_show_0").css("height","240px");
			if(lgCls.version == "SWANN"){
				$("#LXJH_SWANN_A").css("display","block");
				$("#LXJH_SWANN_M").text('M');
			}
			
		}
		else if($(this).val() == 1)
		{
			$("#LXJH_normal>div").each(function(i){
			 tx(this,color3,(sNormal[sel] >> i & 0x01))
			 })
			$("#LXJH_alarm>div").each(function(i){
			 tx(this,color2,(sAlarm[sel] >> i & 0x01))
			 })
		   
		    $("#smart_tag").css({"height":"85px", "padding-top":"5px"});
		    $("#LAB_CLEAL_ALL").css({"margin-top":"0px","width":"300px"});
		    $("#smart_line").css("display","block");
			$("#smart_show_1").css("display","block");
	        $("#smart_show_2").css("display","block");
			$("#smart_show_3").css("display","none");
	        $("#smart_show_5").css("display","block");
	        $("#smart_show_4").css("clear","left");
	        $("#smart_show_6").css("clear","left");
			$("#smart_show_7").css("display","none");
	        $("#smart_show_0").css("height","240px");
			if(lgCls.version == "SWANN"){
				$("#LXJH_SWANN_A").css("display","none");
				$("#LXJH_SWANN_M").text('A');
			}
			
		}
	});
	
	var sel = 0;//星期
	var ch = -1;//通道
	var color1 = "rgb(255, 255, 0)";
	var color2 = "rgb(255, 0, 0)";
	var color3 = "rgb(0, 102, 0)";
	
	switch(lgCls.version){
		/*case "URMET":{
			$("#LXJH_CHNEXT,#LXJH_WEEKNEXT").css("display","inline");
			break;
		}*/
		case "SWANN":{
			$("#LXJH_SWANN_N,#LXJH_SWANN_M").css("display","block");
			$("#LAB_CLEAL_ALL").css("display","block");
			if(gDvr.nAlarmIn > 0 ){
				$("#LXJH_SWANN_A").css("display","block");
				$(".tabel").css("height","215px");
			}else{
				$(".tabel").css("height","188px");
			}
			break;
		}
		/*
		case "OWL":{
			$("#LXJH_SWANN_N,#LXJH_SWANN_M").css("display","block");
			if(gDvr.nAlarmIn > 0 ){
				$("#LXJH_SWANN_A").css("display","block");
			}
			break;
		}*/
		case "KGUARD":{
			color3 = "rgb(0, 180, 250)";
			color1 = "rgb(0, 102, 0)";
			$("#rec_normal_hint").css("background",color3);
			$("#rec_motion_hint").css("background",color1);
			}
			break;
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
			$("#Header_div").css("height","10px");
			$("#LXJH_Header").prop("innerHTML", strHTML);
			
			var textHTML = "";
			mLeft = 0;
			for (var i=0; i<49; i++){
				if(i%4 == 0){ 
					var text = i/2%24;
					textHTML += "<div class='divBox' style='height:20px;margin-left:"+mLeft+";width:20px; text-align=center; border:none;'>"+(text<10?('0'+text):text)+"</div>";
				}
				mLeft = "40px";
			}
			$("#LXJH_HeaderText").prop("innerHTML", textHTML);
			$("#nvr_headTitle_div").css("display","block");
		}else{
			for (var i=0; i<23; i++){
				strHTML += "<div class='divBox' style='height:25px;line-height:25px;float:left;width:22px; border:1px solid #FFF;border-right:none;'>"+(i<10?('0'+i):i)+"</div>";
			}
			strHTML += "<div class='divBoxr' style='height:25px;line-height:25px;float:left;width:22px; border:1px solid #FFF;'>23</div>";
			$("#LXJH_Header").prop("innerHTML", strHTML);
		}
		
		$("#LXJH_normal").prop("innerHTML", CreateDiv('Nm_div_'));
		$("#LXJH_normal_sub").prop("innerHTML", CreateDiv('Ns_div_'));
		$("#LXJH_motion").prop("innerHTML", CreateDiv('Mm_div_'));
		$("#LXJH_motion_sub").prop("innerHTML", CreateDiv('Ms_div_'));
		$("#LXJH_alarm").prop("innerHTML", CreateDiv('Am_div_'));
		$("#LXJH_alarm > div").prop("innerText", "").mouseover(function(){
			if ($("#LXJH_Header").attr("name") == "down"){
				if ($(this).css("background-color").replace(/\s/g, "") != color2.replace(/\s/g, "")){
					$(this).css("background-color", color2);
				}else{
					$(this).css("background-color", "transparent");
				}
			}
		}).mousedown(function(){
			$("#LXJH_Header").attr("name", "down");
			
				if ($(this).css("background-color").replace(/\s/g, "") != color2.replace(/\s/g, "")){
					$(this).css("background-color", color2);
				}else{
					$(this).css("background-color", "transparent");
				}
			
		})
		
		$("#LXJH_alarm > div,#LXJH_motion>div,#LXJH_normal>div,#LXJH_normal_sub>div,#LXJH_motion_sub>div").mouseup(function(){
			$("#LXJH_Header").attr("name", "");
		});
		
		$(document).mouseup(function(){
			$("#LXJH_Header").attr("name", "");
		});
		
		$("#LXJH_motion>div,#LXJH_motion_sub>div").prop("innerText", "").mouseover(function(){
			if ($("#LXJH_Header").attr("name") == "down"){
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
			$("#LXJH_Header").attr("name", "down");
			
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
		
		$("#LXJH_normal>div,#LXJH_normal_sub>div").prop("innerText", "").mouseover(function(){
			if ($("#LXJH_Header").attr("name") == "down"){
				
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
			$("#LXJH_Header").attr("name", "down");
				
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
		$("#LXJH_motion > div,#LXJH_motion_sub>div").prop("innerText", "");
		$("#LXJH_normal > div,#LXJH_normal_sub>div").prop("innerText", "");
	
	    var str = lg.get("IDS_PATH_ALL");
		$("#LXJH_CPHTD").append('<option class="option" value="'+gDvr.nChannel+'">'+str+'</option>')
		
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				if(IpcAbility[i].State == 2){
					if(ch==-1){
						ch = i;//显示列表的第一项
					}
					$("#RECORDchn, #LXJH_CPQTD, #LXJH_CPHTD").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				if(ch==-1){
					ch = i;//显示列表的第一项
				}
				$("#RECORDchn, #LXJH_CPQTD, #LXJH_CPHTD").append('<option class="option" value="'+i+'">' + "IP " + lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');
			}
		}else{
			for (var i=0; i<gDvr.nChannel; i++){
				$("#RECORDchn, #LXJH_CPQTD, #LXJH_CPHTD").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
			ch = 0;
		}
		
		
		//MasklayerShow();
		RfParamCall(Call, lg.get("IDS_REC_PLAN"), "RecPlan", 100, "Get");
		sel = 0;
		RfParamCall(Call, lg.get("IDS_REC_PLAN"), "RecPlan", ch, "Get");
	});
	
	function tx(p,color, type){
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
	
	var normal = new Array();
	var normalHi = new Array();
	var subnormal = new Array();
	var alarm = new Array();
	var alarmHi = new Array();
	var subalarm = new Array();
	var motion = new Array();
	var motionHi = new Array();
	var submotion = new Array();
	var sNormal = new Array();
	var sAlarm = new Array();
	var sNRec = new Array();
	var sARec = new Array();
	var bNext = false;
	function Call(xml){
		if(xml == "suc")
		return ;
		if(bNext){
			sel = $("#LXJH_CPQXQ").val()*1;
			bNext = false;
		}else{
			sel = 0;
		}	
		$("#LXJH_CPQXQ,#RECORDQX").val(sel);
		$("#LXJH_CPHXQ").val(7);
		var bshow = findNode("SmartScheduleEnable",xml)*1;
		var bSmart = findNode("ScheduleMode",xml)*1;
		if(bshow != 1){
			bshow = 0;
		}
		if(bSmart != 1){
			bSmart = 0;
		}
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
		
		if(bshow)
		{
		  $("#smart_show_1").css("display","block");
		  
		  $(xml).find("SmartNormalResolution").each(function(i){
		  sNRec[i] = $(this).text()*1
		 })
		 
		 $(xml).find("SmartAlarmResolution").each(function(i){
		  sARec[i] = $(this).text()*1
		 })
		 
		  $(xml).find("SmartNormalHour").each(function(i){
		  sNormal[i] = $(this).text()*1
		  })
		  
		 $(xml).find("SmartAlarmHour").each(function(i){
		  sAlarm[i] = $(this).text()*1
		 })
	  
		
	  }else{
		  $("#smart_show_1").css("display","none");
	  }
		$("#SMARTMODE").val(bSmart);
		//console.log(xml);	
		if(isNVR){
			$(xml).find("normal hi").each(function(i){
				normalHi[i] = $(this).text()*1;
			})
			$(xml).find("normal lo").each(function(i){
				normal[i] = $(this).text()*1;
			})
			
			$(xml).find("motion lo").each(function(i){
				motion[i] = $(this).text()*1;
			})
			$(xml).find("motion hi").each(function(i){
				motionHi[i] = $(this).text()*1;
			})
			
			$(xml).find("alarm lo").each(function(i){
				alarm[i] = $(this).text()*1;
			})
			$(xml).find("alarm hi").each(function(i){
				alarmHi[i] = $(this).text()*1;
			})
		}else{
			$(xml).find("normal").each(function(i){
				normal[i] = $(this).text()*1
			})
			$(xml).find("motion").each(function(i){
				motion[i] = $(this).text()*1
			})
			$(xml).find("alarm").each(function(i){
				alarm[i] = $(this).text()*1
			})
		}
		
		$(xml).find("subnormal").each(function(i){
			subnormal[i] = $(this).text()*1;
		})
		
		$(xml).find("submotion").each(function(i){
			submotion[i] = $(this).text()*1;
		})
		
		//console.log(bshow);
		if(bshow)
		{
		   $("#SMARTREC_RESOLUTION").val(sNRec[sel]);
		   $("#SMARTREC_RESOLUTION_ALARM").val(sARec[sel]);	 
		   $("#SMARTMODE").change();
		}
		else
		{
			$("#LXJH_normal>div").each(function(i){
				if(isNVR){
					//var len = normal[sel].length;
					if(i<32){
						tx(this,color3,(normal[sel] >> i & 0x01));
					}else{
						tx(this,color3,(normalHi[sel] >> i & 0x01));
					}
				}else{
					tx(this,color3,(normal[sel] >> i & 0x01));
				}
		    })
			$("#LXJH_normal_sub>div").each(function(i){
				tx(this,color3,(subnormal[sel] >> i & 0x01))
		    })
		    $("#LXJH_alarm>div").each(function(i){
				if(isNVR){
					//var len = normal[sel].length;
					if(i<32){
						tx(this,color2,(alarm[sel] >> i & 0x01));
					}else{
						tx(this,color2,(alarmHi[sel] >> i & 0x01));
					}
				}else{
					tx(this,color2,(alarm[sel] >> i & 0x01));
				}
				//tx(this,color2,(alarm[sel] >> i & 0x01))
		    })
		    $("#LXJH_motion>div").each(function(i){
				if(isNVR){
					//var len = normal[sel].length;
					if(i<32){
						tx(this,color1,(motion[sel] >> i & 0x01));
					}else{
						tx(this,color1,(motionHi[sel] >> i & 0x01));
					}
				}else{
					tx(this,color1,(motion[sel] >> i & 0x01));
				}
				//tx(this,color1,(motion[sel] >> i & 0x01))
		    })
			$("#LXJH_motion_sub>div").each(function(i){
				tx(this,color1,(submotion[sel] >> i & 0x01))
		    })
		}
		
	}
	
	function CHOSDSaveSel(){
		var c = 0;
		var d = 0;
		if($("#SMARTMODE").val()*1 == 1) //smart
		{
			$("#LXJH_normal>div").each(function(i){
				c |= (gx(this)<<i);
			})
			sNormal[sel] = c;
		
			c = 0;
			$("#LXJH_alarm>div").each(function(i){
				c |= (gx(this)<<i);
			})
			sAlarm[sel] = c;
		
			sNRec[sel] = $("#SMARTREC_RESOLUTION").val()*1;
			sARec[sel] = $("#SMARTREC_RESOLUTION_ALARM").val()*1;	
		}
		else
		{
			$("#LXJH_normal>div").each(function(i){
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
			normal[sel] = c;
			normalHi[sel] = d;
			c = 0;
			d = 0;
			$("#LXJH_normal_sub>div").each(function(i){
				c |= (gx(this)<<i);
			})
			subnormal[sel] = c;
			c = 0;
			d = 0;
			$("#LXJH_motion>div").each(function(i){
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
			motion[sel] = c;
			motionHi[sel] = d;
			c = 0;
			d = 0;
			$("#LXJH_motion_sub>div").each(function(i){
				c |= (gx(this)<<i);
			})
			submotion[sel] = c;
			c = 0;
			d = 0;
			$("#LXJH_alarm>div").each(function(i){
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
			alarm[sel] = c;
			alarmHi[sel] = d;
		}
	}
	
	$("#LXJH_CPQXQ, #RECORDQX").change(function(){
		CHOSDSaveSel();
		
		sel = $(this).val()*1;
		$("#LXJH_CPQXQ, #RECORDQX").val(sel);
		
		if($("#SMARTMODE").val()*1 == 1) //smart
		{
			$("#LXJH_normal>div").each(function(i){
				tx(this,color3,(sNormal[sel] >> i & 0x01))
			})
			   $("#LXJH_alarm>div").each(function(i){
				tx(this,color2,(sAlarm[sel] >> i & 0x01))
			})
			 
			 $("#SMARTREC_RESOLUTION").val(sNRec[sel]);
			 $("#SMARTREC_RESOLUTION_ALARM").val(sARec[sel]);	  
		}
		else
		{
		   $("#LXJH_normal>div").each(function(i){
			   if(isNVR){
					//var len = normal[sel].length;
					if(i<32){
						tx(this,color3,(normal[sel] >> i & 0x01));
					}else{
						tx(this,color3,(normalHi[sel] >> i & 0x01));
					}
				}else{
					tx(this,color3,(normal[sel] >> i & 0x01));
				}
				//tx(this,color3,(normal[sel] >> i & 0x01))
			})
			$("#LXJH_normal_sub>div").each(function(i){
				tx(this,color3,(subnormal[sel] >> i & 0x01))
			})
		   $("#LXJH_alarm>div").each(function(i){
			   if(isNVR){
					//var len = normal[sel].length;
					if(i<32){
						tx(this,color2,(alarm[sel] >> i & 0x01));
					}else{
						tx(this,color2,(alarmHi[sel] >> i & 0x01));
					}
				}else{
					tx(this,color2,(alarm[sel] >> i & 0x01));
				}
				//tx(this,color2,(alarm[sel] >> i & 0x01))
			})
		   $("#LXJH_motion>div").each(function(i){
			   if(isNVR){
					//var len = normal[sel].length;
					if(i<32){
						tx(this,color1,(motion[sel] >> i & 0x01));
					}else{
						tx(this,color1,(motionHi[sel] >> i & 0x01));
					}
				}else{
					tx(this,color1,(motion[sel] >> i & 0x01));
				}
				//tx(this,color1,(motion[sel] >> i & 0x01))
			})
			$("#LXJH_motion_sub>div").each(function(i){
				tx(this,color1,(submotion[sel] >> i & 0x01))
			})
		}
	});
	
	$("#LXJH_CPXQQD").click(function(){
		$("#LXJH_CPQXQ").change();
		var q = $("#LXJH_CPQXQ").val()*1;
		var h = $("#LXJH_CPHXQ").val()*1;
		if($("#SMARTMODE").val()*1 == 1) //smart
		{
			if (h == 7){
				for (var i=0; i<7; i++){
					sNormal[i] = sNormal[q];
					sAlarm[i] = sAlarm[q];
					sNRec[i] = sNRec[q];
					sARec[i] = sARec[q];
			}
			}else{
				sNormal[h] = sNormal[q];
				sAlarm[h] = sAlarm[q];
			}
		}
		else
		{
			if (h == 7){
				for (var i=0; i<7; i++){
					normal[i] = normal[q];
					normalHi[i] = normalHi[q];
					alarm[i] = alarm[q];
					alarmHi[i] = alarmHi[q];
					motion[i] = motion[q];
					motionHi[i] = motionHi[q];
					subnormal[i] = subnormal[q];
					submotion[i] = submotion[q];
				}
			}else{
				normal[h] = normal[q];
				alarm[h] = alarm[q];
				motion[h] = motion[q];
				normalHi[h] = normalHi[q];
				alarmHi[h] = alarmHi[q];
				motionHi[h] = motionHi[q];
				subnormal[h] = subnormal[q];
				submotion[h] = submotion[q];
			}
		}
		ShowPaop(lg.get("IDS_REC_PLAN"), lg.get("IDS_COPY_SUC"));
	})
	
	$("#LXJH_CPTDQD").click(function(){
		$("#LXJH_CPQXQ").change();
		var q = $("#LXJH_CPQTD").val()*1;
		var h = $("#LXJH_CPHTD").val()*1;
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
		
		if($("#SMARTMODE").val()*1 == 1) //smart
		{
		  for (var i=0; i<7; i++){
			  jhCopyXml += ("<SmartNormalHour>" + sNormal[i] + "</SmartNormalHour>");
		  }
		  for (var i=0; i<7; i++){
			  jhCopyXml += ("<SmartAlarmHour>" + sAlarm[i] + "</SmartAlarmHour>");
		  }
		  
		  for (var i=0; i<7; i++){
			  jhCopyXml += ("<SmartNormalResolution>" + sNRec[i] + "</SmartNormalResolution>");
		  }
		  for (var i=0; i<7; i++){
			  jhCopyXml += ("<SmartAlarmResolution>" + sARec[i] + "</SmartAlarmResolution>");
		  }
		  
		  jhCopyXml += ("<ScheduleMode>" + $("#SMARTMODE").val()+"</ScheduleMode>");
		  
		}
		else
		{
		  for (var i=0; i<7; i++){
			  if(isNVR){
			  	jhCopyXml += ("<normal>" + "<lo>" + normal[i] + "</lo>" + "<hi>" + normalHi[i] + "</hi>" + "</normal>");
			  }else{
			  	jhCopyXml += ("<normal>" + normal[i] + "</normal>");
			  }
		  }
		  for (var i=0; i<7; i++){
			  if(isNVR){
			  	jhCopyXml += ("<alarm>" + "<lo>" + alarm[i] + "</lo>" + "<hi>" + alarmHi[i] + "</hi>" + "</alarm>");
			  }else{
				jhCopyXml += ("<alarm>" + alarm[i] + "</alarm>");
			  }
		  }
		  for (var i=0; i<7; i++){
			  if(isNVR){
			  	jhCopyXml += ("<motion>" + "<lo>" + motion[i] + "</lo>" + "<hi>" + motionHi[i] + "</hi>" + "</motion>");
			  }else{
				jhCopyXml += ("<motion>" + motion[i] + "</motion>");
			  }
			  //jhCopyXml += ("<motion>" + motion[i] + "</motion>");
		  }
		  for (var i=0; i<7; i++){
			  jhCopyXml += ("<subnormal>" + subnormal[i] + "</subnormal>");
		  }
		  for (var i=0; i<7; i++){
			  jhCopyXml += ("<submotion>" + submotion[i] + "</submotion>");
		  }
		}
		jhCopyXml += "</a>";	
		
		RfParamCall(Call, lg.get("IDS_REC_PLAN"), "RecPlan", 400, "Set",jhCopyXml);
	})
	
	$("#RecplanRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#rjh_sch").text(), "RecPlan", 100, "Get");
		RfParamCall(Call, $("#rjh_sch").text(), "RecPlan", ch, "Get");
	});
	
	$("#RecplanDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#rjh_sch").text(), "RecPlan", 850, "Get");
		RfParamCall(Call, $("#rjh_sch").text(), "RecPlan", ch, "Get");
	});
	
	$("#RECORDchn,#LXJH_CPQTD").change(function(){
		ChannelChange($(this).val());
		$("#RECORDchn,#LXJH_CPQTD").val($(this).val());
	});
	
	
	function ChannelChange(a)
	{
		CHOSDSave();
		ch = a;
		//$("#LXJH_CPQTD").val(ch*1);
		RfParamCall(Call, lg.get("IDS_REC_PLAN"), "RecPlan", ch, "Get");
	}
	
	function CHOSDSave(){
		$("#LXJH_CPQXQ").change();
		var xml = "<a>";
		xml += ("<chid>" + ch + "</chid>");
		xml += ("<ScheduleMode>"+ $("#SMARTMODE").val()+ "</ScheduleMode>");
		if($("#SMARTMODE").val()*1 == 1) //smart
		{
			for (var i=0; i<7; i++){
				xml += ("<SmartNormalHour>" + sNormal[i] + "</SmartNormalHour>");
			}
			for (var i=0; i<7; i++){
				xml += ("<SmartAlarmHour>" + sAlarm[i] + "</SmartAlarmHour>");
			}
			for (var i=0; i<7; i++){
				xml += ("<SmartNormalResolution>" + sNRec[i] + "</SmartNormalResolution>");
			}
			for (var i=0; i<7; i++){
				xml += ("<SmartAlarmResolution>" + sARec[i] + "</SmartAlarmResolution>");
			}
		}
		else
		{
			for (var i=0; i<7; i++){
			  if(isNVR){
			  	xml += ("<normal>" + "<lo>" + normal[i] + "</lo>" + "<hi>" + normalHi[i] + "</hi>" + "</normal>");
			  }else{
			  	xml += ("<normal>" + normal[i] + "</normal>");
			  }
		  	}
		 	for (var i=0; i<7; i++){
			  if(isNVR){
			  	xml += ("<alarm>" + "<lo>" + alarm[i] + "</lo>" + "<hi>" + alarmHi[i] + "</hi>" + "</alarm>");
			  }else{
				xml += ("<alarm>" + alarm[i] + "</alarm>");
			  }
		 	}
		  	for (var i=0; i<7; i++){
			  if(isNVR){
			  	xml += ("<motion>" + "<lo>" + motion[i] + "</lo>" + "<hi>" + motionHi[i] + "</hi>" + "</motion>");
			  }else{
				xml += ("<motion>" + motion[i] + "</motion>");
			  }
			  //jhCopyXml += ("<motion>" + motion[i] + "</motion>");
		  	}
			for (var i=0; i<7; i++){
				xml += ("<subnormal>" + subnormal[i] + "</subnormal>");
			}
			for (var i=0; i<7; i++){
				xml += ("<submotion>" + submotion[i] + "</submotion>");
			}
		}
		xml += "</a>";	
		RfParamCall(Call, lg.get("IDS_REC_PLAN"), "RecPlan", ch, "Set", xml);
	}
	$("#RecplanSave").click(function(){
		CHOSDSave();
		RfParamCall(Call, lg.get("IDS_REC_PLAN"), "RecPlan", 200, "Set");
	});
	
	$("#LXJH_CHNEXT").click(function(){
		var tempSel = $("#RECORDchn").val();
		if( tempSel == gDvr.nChannel - 1){
			tempSel = 0;
		}else{
			tempSel++;
		}
		bNext = true;
		$("#RECORDchn").val(tempSel);
		$("#RECORDchn").change();
	})
	
	$("#LXJH_WEEKNEXT").click(function(){
		var weekSel = $("#RECORDQX").val();
		if( weekSel == 7-1){
			weekSel = 0;
		}else{
			weekSel++;
		}
		$("#RECORDQX").val(weekSel);
		$("#RECORDQX").change();
	})
	$("#LXJH_CLEANALL").click(function(){
		for(var i=0; i<normal.length; i++){
			normal[i] = 0;
			alarm[i] = 0;
	 		motion[i] = 0;
			normalHi[i] = 0;
			alarmHi[i] = 0;
	 		motionHi[i] = 0;
		}
		var tempSel = $("#LXJH_CPQXQ").val();
		$("#LXJH_normal>div").each(function(i){
			tx(this,color3,(normal[tempSel] >> i & 0x01))
		})
		$("#LXJH_alarm>div").each(function(i){
			tx(this,color2,(alarm[tempSel] >> i & 0x01))
		})
		$("#LXJH_motion>div").each(function(i){
			tx(this,color1,(motion[tempSel] >> i & 0x01))
		})
		RfParamCall(Call, lg.get("IDS_REC_PLAN"), "RecPlan", 500, "Set","set");		
	})
	
});