// JavaScript Document
$(document).ready(function(){
	if(gDvr.nChannel==1){
		$("#table_channel").css("display","none");
	}
	if(lgCls.version == "OWL"){
		$("#MotionPush_div").css("display","block");
	}
	if(lgCls.version == "OWL" || lgCls.version == "URMET" || lgCls.version == "HONEYWELL" || gDvr.hybirdDVRFlag==1){
		$("#MotionCP").css("display","block");
	}
	
	if(g_bDefaultShow == true){
			$("#MotionDf").css("display","block");
	}
	if(gDvr.DevType == 4){
		$("#mvalarm_time_0,#mvalarm_out_0").css("display","none");
		$("#mv_buzzerTime").css("display","none");
	}
	if(gDvr.nMainType == 0x52530101 && gDvr.nSubType == 0x10100){
		$("#mv_buzzerTime").css("display","none");
	}
	if(gDvr.nAlarmOut == 4){
		$("#MotionAlarmOut").css("display","none");
	}else if(gDvr.nAlarmOut == 0){
		$("#alarm_blank_1").css("display","block");
		$("#alarm_blank_2").css("display","block");
	}
	switch(lgCls.version){
		/*case "URMET":*/
		case "ELKRON":{
			document.getElementById("MotionRecordDelayTime").options[0].innerHTML="10"+lg.get("IDS_SECOND");//10秒
			document.getElementById("MotionRecordDelayTime").options[1].innerHTML="30"+lg.get("IDS_SECOND");//30秒
			document.getElementById("MotionRecordDelayTime").options[2].innerHTML="1"+lg.get("IDS_MINUTE");//1分钟
			document.getElementById("MotionRecordDelayTime").options[3].innerHTML="2"+lg.get("IDS_MINUTE");//2分钟
			$("#MotionRecordDelayTime").append('<option class="option" value="4">5'+lg.get("IDS_MINUTE")+'</option>');//5分钟
			$("#urmetFullScreen").css("display","block");
			$("#MotionAlarmOutTime").empty();
			$("#MotionAlarmOutTime").append('<option class="option" value="0">10'+lg.get("IDS_SECOND")+'</option>');//10秒
			$("#MotionAlarmOutTime").append('<option class="option" value="4">30'+lg.get("IDS_SECOND")+'</option>');//30秒
			$("#MotionAlarmOutTime").append('<option class="option" value="5">1'+lg.get("IDS_MINUTE")+'</option>');//1分钟
			$("#MotionAlarmOutTime").append('<option class="option" value="6">2'+lg.get("IDS_MINUTE")+'</option>');//2分钟
			break;
		}
		/*
		case "KGUARD":{
			$("#MotionShowMessage").prop("disabled",true);
			$("#defaultFullScreen").css("display","block");
			document.getElementById("MotionRecordDelayTime").options[0].innerHTML="30"+lg.get("IDS_SECOND");//30秒
			document.getElementById("MotionRecordDelayTime").options[1].innerHTML="1"+lg.get("IDS_MINUTE");//1分钟
			document.getElementById("MotionRecordDelayTime").options[2].innerHTML="2"+lg.get("IDS_MINUTE");//2分钟
			document.getElementById("MotionRecordDelayTime").options[3].innerHTML="5"+lg.get("IDS_MINUTE");//5分钟
			break;
		}
		*/
		case "FLIR":
		case "LOREX":{
			document.getElementById("MotionRecordDelayTime").options[0].innerHTML="30"+lg.get("IDS_SECOND");//30Ãë
			document.getElementById("MotionRecordDelayTime").options[1].innerHTML="1"+lg.get("IDS_MINUTE");//1·ÖÖÓ
			document.getElementById("MotionRecordDelayTime").options[2].innerHTML="2"+lg.get("IDS_MINUTE");//2·ÖÖÓ
			document.getElementById("MotionRecordDelayTime").options[3].innerHTML="5"+lg.get("IDS_MINUTE");//5·ÖÖÓ
			$("#defaultFullScreen").css("display","block");
			break;
		}
		default:{
			document.getElementById("MotionRecordDelayTime").options[0].innerHTML="30"+lg.get("IDS_SECOND");//30秒
			document.getElementById("MotionRecordDelayTime").options[1].innerHTML="1"+lg.get("IDS_MINUTE");//1分钟
			document.getElementById("MotionRecordDelayTime").options[2].innerHTML="2"+lg.get("IDS_MINUTE");//2分钟
			document.getElementById("MotionRecordDelayTime").options[3].innerHTML="5"+lg.get("IDS_MINUTE");//5分钟
			$("#defaultFullScreen").css("display","block");
			break;
		}
	}
	
	if(gDvr.hybirdDVRFlag == 1){
		if(lgCls.version == "URMET"){
			$("#MotionAlarmOutTime").empty();
			$("#MotionAlarmOutTime").append('<option class="option" value="0">10'+lg.get("IDS_SECOND")+'</option>');//10s
			$("#MotionAlarmOutTime").append('<option class="option" value="1">30'+lg.get("IDS_SECOND")+'</option>');//30s
			$("#MotionAlarmOutTime").append('<option class="option" value="2">1'+lg.get("IDS_MINUTE")+'</option>');	//1min
			$("#MotionAlarmOutTime").append('<option class="option" value="3">2'+lg.get("IDS_MINUTE")+'</option>');	//2min
			$("#MotionAlarmOutTime").append('<option class="option" value="4">5'+lg.get("IDS_MINUTE")+'</option>');	//5min
			
			$("#MotionRecordDelayTime").empty();
			$("#MotionRecordDelayTime").append('<option class="option" value="0">10'+lg.get("IDS_SECOND")+'</option>');//10s
			$("#MotionRecordDelayTime").append('<option class="option" value="1">30'+lg.get("IDS_SECOND")+'</option>');//30s
			$("#MotionRecordDelayTime").append('<option class="option" value="2">1'+lg.get("IDS_MINUTE")+'</option>');	//1min
			$("#MotionRecordDelayTime").append('<option class="option" value="3">2'+lg.get("IDS_MINUTE")+'</option>');	//2min
			$("#MotionRecordDelayTime").append('<option class="option" value="4">5'+lg.get("IDS_MINUTE")+'</option>');	//5min
		}
	}
	
	if(gDvr.nAlarmOut <= 0){
			$("#mvalarm_time_0,#mvalarm_out_0").css("display","none");
		}
	
	//初始操作
	amv_move_sense.sel = -1;
	var comID = 4;
	var color = "rgb(0, 102, 0)";
	var flag = false;   //是否需要切换class
	var bClass = true;	//当前class状态

	//<!-- wh全选切换-->
	$("input[id='amv_all_checked']").click(function(){
		if($(this).prop("checked")){
			for(var j=1;j<=gDvr.nChannel;j++){
				$(".RecordCh"+j).prop("checked",true);
			}			
		}else{
			for(var j=1;j<=gDvr.nChannel;j++){
				$(".RecordCh"+j).prop("checked",false);	
			}
		}
		
		alarmCkAll_Check();
	});
	
	
	$("input[class^=RecordCh]").click(function(){
		var clsName = this.className;
		//alert(clsName);
		if($(this).prop("checked")){
			$("."+clsName).prop("checked",true);
		}else{
			$("."+clsName).prop("checked",false);
		}
		
		alarmCkAll_Check();
	});
	
	$(".mvCh_MN_CkAll").click(function(){
		if($(this).prop("checked")){
			for(var j=1;j<=gDvr.AnalogChNum;j++){
				$(".RecordCh"+j).prop("checked",true);
			}
		}else{
			for(var j=1;j<=gDvr.AnalogChNum;j++){
				$(".RecordCh"+j).prop("checked",false);
			}
		}
		
		alarmCkAll_Check();
	});
	
	$(".mvCh_IP_CkAll").click(function(){
		if($(this).prop("checked")){
			for(var j=(gDvr.AnalogChNum+1);j<=gDvr.nChannel;j++){
				$(".RecordCh"+j).prop("checked",true);
			}
		}else{
			for(var j=(gDvr.AnalogChNum+1);j<=gDvr.nChannel;j++){
				$(".RecordCh"+j).prop("checked",false);
			}
		}
		
		alarmCkAll_Check();
	});
	
	//<!-- wh全选切换  end-->
	
	$(function(){
		$("#MotionChid").empty();
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				if(IpcAbility[i].State == 2){
					if(amv_move_sense.sel==-1 && (((IpcAbility[i].Abilities>>7) & 1) == 1)){
						amv_move_sense.sel = i;
					}
					$("#MotionChid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				if(IpcAbility[i].State == 2){
					if(amv_move_sense.sel==-1){
						amv_move_sense.sel = i;
					}
					$("#MotionChid").append('<option class="option" value="'+i+'">'+ "IP " +lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');
				}
			}
		}else{
			for(var i=0; i<gDvr.nChannel; i++){
				if(IpcAbility[i].State == 2){	
					if(amv_move_sense.sel==-1 && (((IpcAbility[i].Abilities>>7) & 1) == 1))
						amv_move_sense.sel = i;
					$("#MotionChid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
			}
		}
		//for (var i=0; i<gDvr.nChannel; i++){
		//	$("#MotionChid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
		//}
		if(amv_move_sense.sel == -1)
			amv_move_sense.sel = 0;
		switch(gDvr.nChannel*1)
		{
			case 0:
				$("#motion_chn1").css("display", "none");
				$("#motion_chn2").css("display", "none");
				$("#motion_chn3").css("display", "none");
				$("#motion_chn4").css("display", "none");
				break;
			case 4:
				$("#motion_chn2").css("display", "none");
				$("#motion_chn3").css("display", "none");
				$("#motion_chn4").css("display", "none");
				for(var i=5;i<=16;i++){
					$("#mvch"+i).css("display","none");
				}
				break;
			case 8:
				$("#motion_chn2").css("display", "none");
				$("#motion_chn3").css("display", "none");
				$("#motion_chn4").css("display", "none");
				break;
			case 9:
				$("#motion_chn3").css("display", "none");
				$("#motion_chn4").css("display", "none");
				for(var i=10;i<=16;i++){
					$("#mvch"+i).css("display","none");
				}
				break;
			case 10:
				if(gDvr.hybirdDVRFlag){
					$("#motion_chn1").css("display", "none");
					$("#motion_chn2").css("display", "none");
					$("#motion_chn3").css("display", "none");
					$("#motion_chn4").css("display", "none");
					
					$("#motion_H12_1").css("display","block");
					$("#motion_H12_2").css("display","block");
					$("#idMv_div7,#idMv_div8").css("display","none");
					break;
				}
			case 12:
				if(gDvr.hybirdDVRFlag){
					$("#motion_chn1").css("display", "none");
					$("#motion_chn2").css("display", "none");
					$("#motion_chn3").css("display", "none");
					$("#motion_chn4").css("display", "none");
					$("#motion_H12_1").css("display","block");
					$("#motion_H12_2").css("display","block");
					break;
				}
			case 16:
				$("#motion_chn3").css("display", "none");
				$("#motion_chn4").css("display", "none");
				break;
			case 20:
				$("#motion_chn1").css("display", "none");
				$("#motion_chn2").css("display", "none");
				$("#motion_chn3").css("display", "none");
				$("#motion_chn4").css("display", "none");
				
				if(gDvr.hybirdDVRFlag==1){//混合DVR
					$("#motion_H24_1").css("display","block");
					$("#motion_H24_2").css("display","block");
					$("#almv_21,#almv_22,#almv_23,#almv_24").css("display","none");
					break;
				}
				break;
			case 24:
				$("#motion_chn1").css("display", "none");
				$("#motion_chn2").css("display", "none");
				$("#motion_chn3").css("display", "none");
				$("#motion_chn4").css("display", "none");
				
				if(gDvr.hybirdDVRFlag==1){//混合DVR
					if(gDvr.AnalogChNum==8){//8+16
						$("#motion_H24_1").css("display","block");
						$("#motion_H24_2").css("display","block");
					}else if(gDvr.AnalogChNum==16){//16+8 
						$("#motion_H168_1").css("display","block");
						$("#motion_H168_2").css("display","block");
					}
					break;
				}
				break;
			case 32:
				break;
		}
		
		var temp = 0;
		if(gDvr.nAlarmOut > 1)
		{
			$("#MotionAlarmChannelDiv").css("display","block");
		}else {
			$("#MotionAlarmChannelDiv").css("display","none");
		}
		if ($.browser.msie && $.browser.version.indexOf("9") == -1) color = color.replace(/\s/g, "");
		$("#MotionAlarmChannelDiv").divBox({number:gDvr.nAlarmOut,bkColor:color});
		
		//MasklayerShow();
		//dvr.ChangeWndSize(2, $("#MotionSP").css("width").split("px")[0], $("#MotionSP").css("height").split("px")[0]);
		flag = (((IpcAbility[amv_move_sense.sel].Abilities>>8)&1) == 0);
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", 100, "Get");	//初始时获取页面数据
		//amv_move_sense.sel = 0;
		$("#MotionChid").val(amv_move_sense.sel);
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", amv_move_sense.sel, "Get");
		////dvr.ChangeWndSize(2, 200<<16 | 200, 500<<16 | 500);
		////dvr.GetAndSetParameter("Motion", "", 0, 1);
	});
	
	function Call(xml){
		if(((IpcAbility[amv_move_sense.sel].Abilities>>8)&1) == 1)
		{
			if(flag){
				changeClass(0);
				gDvr.Sp_Mv("#MotionSP", ".mcmcmain", name);
			}
			gDvr.Motion("Motion",comID,amv_move_sense.sel);  
		}else{
			//$("#MotionSensitivity").prop("disabled",true);
			gDvr.HideObj(0);
			if(flag){	
				changeClass(1);
			}
		}
		var mbRow = findNode("MbRow", xml)*1;
		if(mbRow == 200){
			$("#MotionSense").css("display","none");
			$("#MotionSense1").css("display","block");
			$("#MotionSense2").css("display","block");
			$("#MotionSense3").css("display","block");
			$("#MotionSense4").css("display","block");
		}else{
			$("#MotionSense").css("display","block");
			$("#MotionSense1").css("display","none");
			$("#MotionSense2").css("display","none");
			$("#MotionSense3").css("display","none");
			$("#MotionSense4").css("display","none");
		}
		if(mbRow == 200 || mbRow == 201){
			ClearBtn.value=lg.get("IDS_MOTION_DELETE");
			SelectBtn.value=lg.get("IDS_MOTION_CLEAR");
		}else{
			ClearBtn.value=lg.get("IDS_MOTION_CLEAR");
			SelectBtn.value=lg.get("IDS_MOTION_SELECT");
		}
		$("#MotionSensitivity").prop("value",findNode("Sensitivity", xml));
		$("#MotionSensitivity1").prop("value",findNode("Sensitivities1", xml));
		$("#MotionSensitivity2").prop("value",findNode("Sensitivities2", xml));
		$("#MotionSensitivity3").prop("value",findNode("Sensitivities3", xml));
		$("#MotionSensitivity4").prop("value",findNode("Sensitivities4", xml));
		
		$("#MotionBuzzerMooTime").val(findNode("BuzzerMooTime", xml));
		$("#MotionRecordDelayTime").val(findNode("RecordDelayTime", xml));
		$("#MotionRecord").prop("checked", findNode("Record", xml)*1);
		$("#MotionAlarmOutTime").val(findNode("AlarmOutTime", xml));
		switch(lgCls.version){
			/*case "URMET":*/
			case "ELKRON":{
				$("#urmet_MotionFullScreen").val(findNode("FullScreen",xml));
				break;
			}
			default:{
				$("#MotionFullScreen").prop("checked", findNode("FullScreen", xml)*1);
				break;
			}
		}		
		$("#MotionAlarmOut").prop("checked", findNode("AlarmOut", xml)*1);
		$("#MotionSendEmail").prop("checked", findNode("SendEmail", xml)*1);
		$("#MotionChnSwitch").prop("checked", findNode("ChnSwitch", xml)*1);	
		$("#MotionShowMessage").prop("checked", findNode("ShowMessage", xml)*1);
		$("#MotionPush").prop("checked", findNode("PushSwitch", xml)*1);
		var RecordCh = findNode("RecordChannel", xml);
		for (var i=0; i<gDvr.nChannel; i++){
			$(".RecordCh"+(i+1)).prop("checked", (RecordCh>>i)&0x01);
		}
		
		if(gDvr.nAlarmOut>1){
			$("#MVRecord_Output_table").css("display","block");
			str =findNode("AlarmOutManager", xml);
			str = str.toLowerCase();
			str = "<a>" + str.split("item").join("p") + "</a>";
			var temArray = new Array();
			$(str).find("p").each(function(i){
				temArray[i] = $(this).text();
			});	
			
			$("#MotionAlarmChannelDiv > div").css("background-color", "transparent");	   
			$("#MotionAlarmChannelDiv > div").each(function(i){
				if (temArray[i] == 1){
					$(this).css("background-color", color)
				}
			});
		}
		setTimeout(function(){
		DivBox("#MotionChnSwitch", "#MotionDivBoxAll");},0);
		$("#ClearBtn").prop("disabled",1 - $("#MotionChnSwitch").prop("checked")*1);
		$("#SelectBtn").prop("disabled",1 - $("#MotionChnSwitch").prop("checked")*1);
		//DivBox("#MotionRecord", "#MotionDivBoxRecord");
		
		if(alarm_mvShowExitButton == 1){
			$(".item_R").css("width", "450px");
			$("#MotionExit").css("display","block");  //显示Exit按钮
		}else{
			$(".item_R").css("width", "350px");
			$("#MotionExit").css("display","none");  //隐藏Exit按钮
		}
		
		if(gDvr.hybirdDVRFlag==1){
			if(amv_move_sense.sel<gDvr.AnalogChNum){//模拟通道才运行Copy
				$("#MotionCP").css("display","block");
			}else{
				$("#MotionCP").css("display","none");
				$("#mvCopyTD").css("display","none");
			}
			
			//界面处理
			alarmCkAll_Check();
		}
	}
	
	$("#MotionExit").click(function(){		
		showConfigChild("Upload_Photo");  
	});
	
	function changeClass(flag){
		if(flag){
			$("#ClearBtn").css("display","none");
			$("#SelectBtn").css("display","none"); 
			$("#MotionSense").css("display","none"); 
			$("#MotionSP").css("display","none"); 
			
			$("#mv_buzzerTime").removeClass("mv");
			$("#buzzer_moo_time").removeClass("mv_L");
			$("#buzzer_moo_time_r").removeClass("mv_R");
			$("#MotionBuzzerMooTime").removeClass("sel_mv");
			$("#MotionBuzzerMooTime").addClass("select");
			
			$("#defaultFullScreen").removeClass("mv");
			
			$("#urmetFullScreen").removeClass("mv");
			$("#urmet_MVFullScreen").removeClass("mv_L");
			$("#urmet_MVFullScreen_r").removeClass("mv_R");
			$("#urmet_MotionFullScreen").removeClass("sel_mv");
			$("#urmet_MotionFullScreen").addClass("select");
			
			$("#mvalarm_out_0").removeClass("mv");
			
			$("#mvalarm_time_0").removeClass("mv");
			$("#MotionLatchTime").removeClass("mv_L");
			$("#MotionLatchTime_r").removeClass("mv_R");
			$("#MotionAlarmOutTime").removeClass("sel_mv");
			$("#MotionAlarmOutTime").addClass("select");
			
			$("#startTouchRecord").removeClass("mv");
			
			$("#recordDelayTime").removeClass("mv");
			$("#record_delay_time_1").removeClass("mv_L");
			$("#record_delay_time_1_r").removeClass("mv_R");
			$("#MotionRecordDelayTime").removeClass("sel_mv");
			$("#MotionRecordDelayTime").addClass("select");
			
			$("#motionShowMessage").removeClass("mv");
			
			$("#recordChannel_IPCHIDE").removeClass("mv");
			$("#linkage_record_channel").removeClass("mv_L");
			$("#record_delay_time_1_r").removeClass("mv_R");
			
			bClass = false;
		}else{
			$("#ClearBtn").css("display","block");
			$("#SelectBtn").css("display","block"); 
			$("#MotionSense").css("display","block"); 
			$("#MotionSP").css("display","block"); 
			
			$("#mv_buzzerTime").addClass("mv");
			$("#buzzer_moo_time").addClass("mv_L");
			$("#buzzer_moo_time_r").addClass("mv_R");
			$("#MotionBuzzerMooTime").removeClass("select");
			$("#MotionBuzzerMooTime").addClass("sel_mv");
			
			$("#defaultFullScreen").addClass("mv");
			
			$("#urmetFullScreen").addClass("mv");
			$("#urmet_MVFullScreen").addClass("mv_L");
			$("#urmet_MVFullScreen_r").addClass("mv_R");
			$("#urmet_MotionFullScreen").removeClass("select");
			$("#urmet_MotionFullScreen").addClass("sel_mv");
			
			$("#mvalarm_out_0").addClass("mv");
			
			$("#mvalarm_time_0").addClass("mv");
			$("#MotionLatchTime").addClass("mv_L");
			$("#MotionLatchTime_r").addClass("mv_R");
			$("#MotionAlarmOutTime").removeClass("select");
			$("#MotionAlarmOutTime").addClass("sel_mv");
			
			$("#startTouchRecord").addClass("mv");
			
			$("#recordDelayTime").addClass("mv");
			$("#record_delay_time_1").addClass("mv_L");
			$("#record_delay_time_1_r").addClass("mv_R");
			$("#MotionRecordDelayTime").removeClass("select");
			$("#MotionRecordDelayTime").addClass("sel_mv");
			
			$("#motionShowMessage").addClass("mv");
			
			$("#recordChannel_IPCHIDE").addClass("mv");
			$("#linkage_record_channel").addClass("mv_L");
			$("#record_delay_time_1_r").addClass("mv_R");
			
			bClass = true;
		}
	}
	
	//写一个函数  处理联动通道	/*Record Channel, 触发通道录像，按位记录*/	UINT RecordChannel;
	$("#MotionChid").change(function(){
		var chid = $("#MotionChid").val()*1;
		if(((IpcAbility[chid].Abilities>>7) & 1) == 0){
			$("#MotionChid").val(amv_move_sense.sel);
			ShowPaop($("#amv_move_sense").text(), lg.get("IDS_CH")+(chid+1)+" "+lg.get("IDS_CHN_FAILED"));//不支持此功能
			return;
		}
		CHOSDSaveSel();
		amv_move_sense.sel = chid;
		comID = 3; 
		if((((IpcAbility[amv_move_sense.sel].Abilities>>8)&1) == 1) == bClass){
			flag = false;
		}else{
			flag = true;
		}
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", amv_move_sense.sel, "Get");
	});
	
	function CHOSDSaveSel(){
		var xml = "<a>";
		xml += ("<chid>" + amv_move_sense.sel + "</chid>");
		xml += ("<Sensitivity>" + ($("#MotionSensitivity").val()) + "</Sensitivity>");
		xml += ("<Sensitivities1>" + ($("#MotionSensitivity1").val()) + "</Sensitivities1>");
		xml += ("<Sensitivities2>" + ($("#MotionSensitivity2").val()) + "</Sensitivities2>");
		xml += ("<Sensitivities3>" + ($("#MotionSensitivity3").val()) + "</Sensitivities3>");
		xml += ("<Sensitivities4>" + ($("#MotionSensitivity4").val()) + "</Sensitivities4>");
		
		xml += ("<BuzzerMooTime>" + ($("#MotionBuzzerMooTime").val()) + "</BuzzerMooTime>");
		xml += ("<RecordDelayTime>" + $("#MotionRecordDelayTime").val() + "</RecordDelayTime>");
		xml += ("<Record>" + $("#MotionRecord").prop("checked")*1 + "</Record>");
			
		xml += ("<AlarmOutTime>" + $("#MotionAlarmOutTime").val() + "</AlarmOutTime>");
		switch(lgCls.version){
			/*case "URMET":*/
			case "ELKRON":{
				xml += ("<FullScreen>" + $("#urmet_MotionFullScreen").val() + "</FullScreen>");
				break;
			}
			default:{
				xml += ("<FullScreen>" + ($("#MotionFullScreen").prop("checked")*1) + "</FullScreen>");
				break;
			}
		}
		xml += ("<AlarmOut>" + ($("#MotionAlarmOut").prop("checked")*1) + "</AlarmOut>");
		xml += ("<SendEmail>" + ($("#MotionSendEmail").prop("checked")*1) + "</SendEmail>");
		xml += ("<ChnSwitch>" + ($("#MotionChnSwitch").prop("checked")*1) + "</ChnSwitch>");
		xml += ("<ShowMessage>" +  ($("#MotionShowMessage").prop("checked")*1)  + "</ShowMessage>");
		xml += ("<PushSwitch>" +  ($("#MotionPush").prop("checked")*1)  + "</PushSwitch>");
		var RecordCh = 0;
		for(var i=0; i<gDvr.nChannel; i++){
			RecordCh |= (($(".RecordCh"+(i+1)).prop("checked")*1)<<i);
		}
		xml += ("<RecordChannel>" + RecordCh + "</RecordChannel>");
		
		if(gDvr.nAlarmOut>1){ 
		   xml += "<AlarmOutManager>";
		   $("#MotionAlarmChannelDiv > div").each(function(i){
		   	   var bCheckd = ($(this).css("background-color").replace(/\s/g, "").replace(/\s/g, "") == color.replace(/\s/g, ""))?1:0;
		   	   xml += "<item>"+bCheckd+"</item>";	
			});
			xml += "</AlarmOutManager>";
		}else{
			xml += "<AlarmOutManager>";
			$("#MotionAlarmChannelDiv > div").each(function(i){
				var bCheckd;
				if(i==0)
		   			bCheckd = $("#MotionAlarmOut").prop("checked")*1;
				else
					bCheckd = 0;
		   		xml += "<item>"+bCheckd+"</item>";	
			});
			xml += "</AlarmOutManager>";
		}
		
		xml += "</a>";
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", amv_move_sense.sel, "Set", xml);
	}
	
	$("#MotionRf").click(function(){
		//MasklayerShow();
		//dvr.MotionAndShelterEx("Motion",comID,0);
		comID = 4;
		g_bClickDefBtn = false;
		if((((IpcAbility[amv_move_sense.sel].Abilities>>8)&1) == 1) == bClass){
			flag = false;
		}else{
			flag = true;
		}
		if(lgCls.version == "URMET"){
			RfParamCall(Call, $("#amv_move_sense").text(), "Motion", 101 + amv_move_sense.sel, "Get");	//刷新页面数据
		}
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", 100, "Get");	//刷新页面数据 
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", amv_move_sense.sel, "Get");	//刷新页面数据  
	});
	
	$("#MotionDf").click(function(){
		comID = 4;
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", 850, "Get"); 
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", amv_move_sense.sel, "Get");	//刷新页面数据
	});
	
	$("#MotionSave").click(function(){
		//MasklayerShow();
		CHOSDSaveSel();
		RfParamCall(Call, $("#amv_move_sense").text(), "Motion", 200, "Set");	
	});
	
	
	//界面处理	
	$("#MotionChnSwitch").click(function(){	//启用移动侦测 
	setTimeout(function(){
		DivBox("#MotionChnSwitch", "#MotionDivBoxAll");},0);
	$("#ClearBtn").prop("disabled",1 - $("#MotionChnSwitch").prop("checked")*1);
	$("#SelectBtn").prop("disabled",1 - $("#MotionChnSwitch").prop("checked")*1);
	});
	
	/*$("#MotionRecord").click(function(){	//启用触发录像
		DivBox("#MotionRecord", "#MotionDivBoxRecord");
	});*/
	
	/*$("#MotionAlarmOut").click(function(){	//启用触发录像  
		DivBox("#MotionAlarmOut", "#MotionDivBoxAlarmOut");
	}); */
	
	$("#ClearBtn").click(function() {
		comID = 1;
        gDvr.Motion("Motion",comID,$("#MotionChid").val());								  
								  });
	$("#SelectBtn").click(function() {
		comID = 5;
        gDvr.Motion("Motion",comID,$("#MotionChid").val());								  
	});
	
	
	//显示复制通道
	$("#MotionCP").click(function(){
		$("#mvck").prop("checked",false);
		
		if(gDvr.hybirdDVRFlag==1){//模拟通道才可以Copy
			copyTD("#mvCopyTD","mv_ch","mv_TDNum",gDvr.AnalogChNum);
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				//console.log(IpcAbility[i].State);
				if(IpcAbility[i].State == 2){//在线
					//
				}else{
					//mv_ch1_div
					$("#div_mv_ch"+(i+1)).css("display","none");
					//不在线-隐藏
				}
			}
		}else{
			copyTD("#mvCopyTD","mv_ch","mv_TDNum");
			$.each($("input[id^='mv_ch']"),function(){
				var thisId = $(this).attr("id");//mv_ch1
				var index = thisId.split("mv_ch")[1]*1 - 1;//0
				if((IpcAbility[index].State != 2) || (((IpcAbility[index].Abilities>>7) & 1) == 0)){
					$(this).prop("disabled",true);
				}
			})
		}
	})
	
	//全选
	$("#mvck").click(function(){
		$.each($("input[id^='mv_ch']"),function(){
			var thisId = $(this).attr("id");//mv_ch1
			var index = thisId.split("mv_ch")[1]*1 - 1;//0
			if((IpcAbility[index].State == 2) && (((IpcAbility[index].Abilities>>7) & 1) == 1)){
				$(this).prop("checked",$("#mvck").prop("checked"));
			}
		})
		//$("input[id^='mv_ch']").prop("checked",$(this).prop("checked"));
	})	
	
	
	$("#mvOk").click(function(){
		var mvCopyXml="";
		$("#mvCopyTD").css("display","none");	
		var spTdValue="";
		$.each($("input[id^='mv_ch']"),function(){
			if($(this).prop("checked"))
				spTdValue+=$(this).prop('value')+",";
		})
		if(spTdValue!=""){
			spTdValue=spTdValue.substring(0,spTdValue.length-1);
			var spArr=spTdValue.split(',');
			var copychid = 0;
			for(var i=0;i<spArr.length;i++){
				copychid |= 0x01<< spArr[i];
			}
			mvCopyXml = "<a>";
			mvCopyXml += ("<CopyChid>" + copychid + "</CopyChid>");
			mvCopyXml += ("<chid>" + amv_move_sense.sel + "</chid>");
			mvCopyXml += ("<Sensitivity>" + ($("#MotionSensitivity").val()) + "</Sensitivity>");
			mvCopyXml += ("<Sensitivities1>" + ($("#MotionSensitivity1").val()) + "</Sensitivities1>");
			mvCopyXml += ("<Sensitivities2>" + ($("#MotionSensitivity2").val()) + "</Sensitivities2>");
			mvCopyXml += ("<Sensitivities3>" + ($("#MotionSensitivity3").val()) + "</Sensitivities3>");
			mvCopyXml += ("<Sensitivities4>" + ($("#MotionSensitivity4").val()) + "</Sensitivities4>");
			mvCopyXml += ("<BuzzerMooTime>" + ($("#MotionBuzzerMooTime").val()) + "</BuzzerMooTime>");
			mvCopyXml += ("<RecordDelayTime>" + $("#MotionRecordDelayTime").val() + "</RecordDelayTime>");
			mvCopyXml += ("<Record>" + $("#MotionRecord").prop("checked")*1 + "</Record>");
			mvCopyXml += ("<AlarmOut>" + ($("#MotionAlarmOut").prop("checked")*1) + "</AlarmOut>");
			mvCopyXml += ("<SendEmail>" + ($("#MotionSendEmail").prop("checked")*1) + "</SendEmail>");
			mvCopyXml += ("<ChnSwitch>" + ($("#MotionChnSwitch").prop("checked")*1) + "</ChnSwitch>");
			mvCopyXml += ("<ShowMessage>" +  ($("#MotionShowMessage").prop("checked")*1)  + "</ShowMessage>");
			mvCopyXml += ("<PushSwitch>" +  ($("#MotionPush").prop("checked")*1)  + "</PushSwitch>");
			mvCopyXml += ("<AlarmOutTime>" + $("#MotionAlarmOutTime").val() + "</AlarmOutTime>");
			switch(lgCls.version){
				/*case "URMET":*/
				case "ELKRON":{
			  		mvCopyXml += ("<FullScreen>" + $("#urmet_MotionFullScreen").val() + "</FullScreen>");
					break;
				}
				default:{
					 mvCopyXml += ("<FullScreen>" + ($("#MotionFullScreen").prop("checked")*1) + "</FullScreen>");
					break;
				}
			}		   	
			var RecordCh = 0;
			for(var i=0; i<gDvr.nChannel; i++){
				RecordCh |= (($(".RecordCh"+(i+1)).prop("checked")*1)<<i);
			}
			mvCopyXml += ("<RecordChannel>" + RecordCh + "</RecordChannel>");
			
			if(gDvr.nAlarmOut>1){ 
		  		 mvCopyXml += "<AlarmOutManager>";  
		  		 $("#MotionAlarmChannelDiv > div").each(function(i){
					 var bCheckd = ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, ""))?1:0;
					 mvCopyXml += "<item>"+bCheckd+"</item>";	
				});
				mvCopyXml += "</AlarmOutManager>";
			}else{
				mvCopyXml += "<AlarmOutManager>";
				$("#MotionAlarmChannelDiv > div").each(function(i){
					var bCheckd;
					if(i==0)
						bCheckd = $("#MotionAlarmOut").prop("checked")*1;
					else
						bCheckd = 0;
					mvCopyXml += "<item>"+bCheckd+"</item>";	
				});
				mvCopyXml += "</AlarmOutManager>";
			}
			
			mvCopyXml += "</a>";
			RfParamCall(Call, $("#amv_move_sense").text(), "Motion", 400, "Set",mvCopyXml);	
		}
	})
	
	function alarmCkAll_Check(){
		if(gDvr.hybirdDVRFlag==1){
			var mnCk = true;
			var ipCk = true;
		
			for(var i=1; i<=gDvr.AnalogChNum; i++){//模拟通道数
				if( $(".RecordCh"+i).prop("checked") ){
					//
				}else{
					mnCk = false;//只要有一个不勾选，则false
					break;
				}
			}
		
			for(var i=(gDvr.AnalogChNum+1); i<=gDvr.nChannel; i++){//IP通道数
				if( $(".RecordCh"+i).prop("checked") ){
					//
				}else{
					ipCk = false;//只要有一个不勾选，则false
					break;
				}
			}
		
			if(mnCk){
				$(".mvCh_MN_CkAll").prop("checked",true);
			}else{
				$(".mvCh_MN_CkAll").prop("checked",false);
			}
		
			if(ipCk){
				$(".mvCh_IP_CkAll").prop("checked",true);
			}else{
				$(".mvCh_IP_CkAll").prop("checked",false);
			}
		
			if( mnCk && ipCk ){
				$("#amv_all_checked").prop("checked",true);
			}else{
				$("#amv_all_checked").prop("checked",false);
			}
		}
	}
});
