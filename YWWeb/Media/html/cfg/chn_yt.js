// JavaScript Document
$(document).ready(function(){//
	//初始操作
	if(g_bDefaultShow == true){
		$("#ChnPTZDF").css("display","block");
	}
	if(gDvr.nChannel==1){
		$("#YT_CHN_TABLE").css("display","none");
	}
	if(gDvr.hybirdDVRFlag==1){
		$("#YTCruise_div").css("display","block");
		$("#YTSignal_div").css("display","none");
	}
	
	if(gDvr.CoaxialFlag==1){
		$("#YTProtocol").append('<option value="3"> COAX </option>');
	}
	
	var sel = -1;
	$(function(){
		$("#YTchid").empty();
		
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				//console.log("state:" + IpcAbility[i].State);
				if(IpcAbility[i].State == 2){
					if(sel==-1 && (((IpcAbility[i].Abilities>>10) & 1) == 1))
						sel = i;
					$("#YTchid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
			}
		}else{
			for (var i=0; i<gDvr.nChannel ; i++){
				if(IpcAbility[i].State == 2){	
					if(sel==-1 && (((IpcAbility[i].Abilities>>10) & 1) == 1))
						sel = i;
					$("#YTchid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
				//$("#YTchid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
		}
		if(sel == -1)
			sel = 0;
		for(var j = 0;j<255;j++){
			$("#YTNumber").append('<option class="option" value="'+j+'">'+(j+1)+'</option>');
		}
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", 100, "Get");	//初始时获取页面数据
		$("#YTchid").val(sel);
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", sel, "Get");
	});
	
	function Call(xml){
			$("#YTProtocol").val(findNode("Protocol", xml));
			$("#YTBaudrate").val(findNode("Baudrate", xml));
			$("#YTDataBit").val(findNode("DataBit", xml));
			$("#YTStopBit").val(findNode("StopBit", xml));
			$("#YTCheck").val(findNode("Check", xml));
			$("#YTCruise").val(findNode("Cruise", xml))
			$("#YTNumber").val((findNode("Number", xml)*1-1));
			$("#YTSignal").val(findNode("SignalType", xml));
			showDiv($("#YTSignal").val()*1,$("#SIGNAL_CHANGE"));
	}
	
	$("#YTchid").change(function(){
		var chid = $("#YTchid").val()*1;
		if(((IpcAbility[chid].Abilities>>10) & 1) == 0){
			$("#YTchid").val(sel);
			ShowPaop($("#cyt_cloud_config").text(), lg.get("IDS_CH")+(chid+1)+" "+lg.get("IDS_CHN_FAILED"));
			return;
		}
		CHOSDSaveSel();
		sel = $("#YTchid").val();
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", sel, "Get");
	});
	
	$("#YTSignal").change(function(){
		showDiv($("#YTSignal").val()*1,$("#SIGNAL_CHANGE"));
	});
	
	function CHOSDSaveSel(){
		var xml = "<a>";
		xml += ("<Protocol>" + ($("#YTProtocol").val()) + "</Protocol>");
		xml += ("<Baudrate>" + ($("#YTBaudrate").val()) + "</Baudrate>");
		xml += ("<chid>" + sel + "</chid>")
		xml += ("<DataBit>" + $("#YTDataBit").val() + "</DataBit>");
		xml += ("<StopBit>" + ($("#YTStopBit").val()) + "</StopBit>");
		xml += ("<Check>" + $("#YTCheck").val() + "</Check>");
		xml += ("<Number>" + ($("#YTNumber").val()*1+1) + "</Number>");
		xml += ("<SignalType>" + $("#YTSignal").val() + "</SignalType>");
		xml += ("<Cruise>" + ($("#YTCruise").val()) + "</Cruise>");
		xml += "</a>";
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", sel, "Set", xml);
	}
	
	$("#ChnPTZRF").click(function(){
		/*var xml = "<a>";
		xml += ("<Protocol>" + ($("#YTProtocol").val()) + "</Protocol>");
		xml += ("<Baudrate>" + ($("#YTBaudrate").val()) + "</Baudrate>");
		xml += ("<chid>" + sel + "</chid>")
		xml += ("<DataBit>" + $("#YTDataBit").val() + "</DataBit>");
		xml += ("<StopBit>" + ($("#YTStopBit").val()) + "</StopBit>");
		xml += ("<Check>" + $("#YTCheck").val() + "</Check>");
		xml += ("<Number>" + ($("#YTNumber").val()*1+1) + "</Number>");
		xml += ("<Cruise>" + ($("#YTCruise").val()) + "</Cruise>");
		xml += "</a>";*/
		g_bClickDefBtn = false;
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", 100, "Get");	//初始时获取页面数据
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", sel, "Get");	//初始时获取页面数据
	});
	
	$("#ChnPTZDF").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", 850, "Get");
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", sel, "Get");	//初始时获取页面
	});
	
	$("#ChnPTZSV").click(function(){
		CHOSDSaveSel();
		RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", 200, "Set");
	});
	
	
	//显示复制通道
	$("#ChnPTZCP").click(function(){
		$("#ytck").prop("checked",false);
		copyTD("#ytCopyTD","yt_ch","yt_TDNum");
		
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				//console.log("state:" + IpcAbility[i].State);
				if(IpcAbility[i].State == 2){
					//显示
				}else{
					$("#div_yt_ch"+(i+1)).css("display","none");
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				$("#div_yt_ch"+(i+1)).css("display","none");
			}
		}else{
			$.each($("input[id^='yt_ch']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("yt_ch")[1]*1 - 1;
				if((IpcAbility[index].State != 2) || (((IpcAbility[index].Abilities>>10) & 1) == 0)){
					$(this).prop("disabled",true);
				}
			})
		}
	})
	
	//全选
	$("#ytck").click(function(){
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				//console.log("state:" + IpcAbility[i].State);
				if(IpcAbility[i].State == 2){
					//在线的才显示才勾选
					$("#yt_ch"+(i+1)).prop("checked",$("#ytck").prop("checked"));
				}
			}
		}else{
			$.each($("input[id^='yt_ch']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("yt_ch")[1]*1 - 1;
				if((IpcAbility[index].State == 2) && (((IpcAbility[index].Abilities>>10) & 1) == 1)){
					$(this).prop("checked",$("#ytck").prop("checked"));
				}
			})
			//$("input[id^='yt_ch']").prop("checked",$(this).prop("checked"));
		}
	})	
	
	
	$("#ytOk").click(function(){
		var ytCopyXml="";
		$("#ytCopyTD").css("display","none");	
		var spTdValue="";
		$.each($("input[id^='yt_ch']"),function(){
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
			ytCopyXml = "<a>";
			ytCopyXml += ("<CopyChid>" + copychid + "</CopyChid>");
			ytCopyXml += ("<Protocol>" + ($("#YTProtocol").val()) + "</Protocol>");
			ytCopyXml += ("<Baudrate>" + ($("#YTBaudrate").val()) + "</Baudrate>");
			ytCopyXml += ("<chid>" + sel + "</chid>")
			ytCopyXml += ("<DataBit>" + $("#YTDataBit").val() + "</DataBit>");
			ytCopyXml += ("<StopBit>" + ($("#YTStopBit").val()) + "</StopBit>");
			ytCopyXml += ("<Check>" + $("#YTCheck").val() + "</Check>");
			ytCopyXml += ("<Number>" + ($("#YTNumber").val()*1+1) + "</Number>");
			ytCopyXml += ("<SignalType>" + $("#YTSignal").val() + "</SignalType>");
			ytCopyXml += ("<Cruise>" + ($("#YTCruise").val()) + "</Cruise>");
			ytCopyXml += "</a>";
			RfParamCall(Call,  $("#cyt_cloud_config").text(), "ChPtz", 400, "Set",ytCopyXml);
		}
	})
});