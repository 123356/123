$(document).ready(function(){
	
	switch(lgCls.version){
		case "OWL":{
			$("#RTSPDf").css("display","block");
			break;
		}
		default:{
			break;
		}
	}
	
	if(gDvr.hybirdDVRFlag == 1){
		$("#RTSPUserNameInput").attr("maxlength","31");
		$("#RTSPPasswordInput").attr("maxlength","31");
	}
	
	if(gDvr.hybirdDVRFlag == 1){
		var str = lg.get("IDS_RTSP_INSTRUCTION");//Instruction : rtsp://IP:Port/chA/B
		var pos = str.indexOf(":");
		var part1 = str.substring(0,pos+1);//Instruction :
		RTSPInstruction.innerHTML = part1;
		var part2 = str.substr(pos+1);// rtsp://IP:Port/chA/B
		RTSP_MN.innerHTML = lg.get("IDS_ANALOG_CHN") + ": " + part2;//Analog Channel + : + 
		$("#RTSP_MN").css("display","block");
		RTSP_IP.innerHTML = lg.get("IDS_RTSP_IP");
		$("#RTSP_IP").css("display","block");
	}else{
		RTSPInstruction.innerHTML = lg.get("IDS_RTSP_INSTRUCTION");
	}
	
	RTSPmsstream.innerHTML = lg.get("IDS_RTSP_MSSTREAM");
	//RTSPstream.innerHTML = lg.get("IDS_RTSP_STREAM");
	RTSPChannel.innerHTML = lg.get("IDS_RTSP_CHANNEL");
	$(function(){
		RfParamCall(Call, $("#RTSP_Title").text(), "RTSP", 100, "Get");	//初始时获取页面数据
	});
	function Call(xml){
		
		$("#RtspPortSwitch").val(findNode("RtspPort", xml)); 
		$("#RTSPModeSwitch").val(findNode("enAuthMode", xml)); 
		$("#RtspEnableSwitch").val(findNode("RtspEnable", xml)); 
		$("#RTSPUserNameInput").val(findNode("RtspUserName", xml));
		$(".RTSPPasswordInput").val(findNode("RtspPassword", xml));
	}
	function RTSPSaveSel(){
		var xml = "<a>";
		xml += ("<RtspPort>" + $("#RtspPortSwitch").val() + "</RtspPort>");
		xml += ("<enAuthMode>" + $("#RTSPModeSwitch").val() + "</enAuthMode>");
		xml += ("<RtspEnable>" + $("#RtspEnableSwitch").val() + "</RtspEnable>");
		xml += ("<RtspUserName>" + $("#RTSPUserNameInput").val() + "</RtspUserName>");
		xml += ("<RtspPassword>" + $(".RTSPPasswordInput").val() + "</RtspPassword>");
		xml += "</a>";
		return xml;
	}
	
	$("#RTSPRf").click(function(){
		RfParamCall(Call, $("#RTSP_Title").text(), "RTSP", 100, "Get");
	});
	
	$("#RTSPDf").click(function(){
		RfParamCall(Call, $("#RTSP_Title").text(), "RTSP", 850, "Get");
	});
	$("#RTSPSV").click(function(){
		//用户名不能为空		
		var NameInput = $("#RTSPUserNameInput").val();
		NameInput = NameInput.replace(/\s/g, "");  //去掉所有空格后，再判断是否为空
		if(NameInput == ""){
			ShowPaop($("#RTSP_Title").text(),lg.get("IDS_NO_USERNAEM"));
			return;
		}
		/*	
		if($("#RTSPUserNameInput").val().replace(/\s/g, "") == ""){
			ShowPaop($("#RTSP_Title").text(),lg.get("IDS_NO_USERNAEM"));
			return;
		}*/	
		
		if($(".RTSPPasswordInput").val() == ""){
			ShowPaop($("#RTSP_Title").text(),lg.get("IDS_PASSWORD_EMPTY"));
			return;
		}
		if($(".RTSPPasswordInput").prop("value").length<6 || $(".RTSPPasswordInput").prop("value").length>31){
			ShowPaop($("#RTSP_Title").text(), lg.get("IDS_RTSP_CHECKPWD"));	
			return;
		}
		RfParamCall(Call, $("#RTSP_Title").text(), "RTSP", 300, "Set",RTSPSaveSel());	//保存
	});
});
