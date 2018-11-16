// JavaScript Document
$(document).ready(function(){
	
    //显示复制通道
	$("#CapSetCP").click(function(){
		$("#Capck").prop("checked",false);
		copyTD("#CapCopyTD","cap_ch","Cap_TDNum");
		
		if(gDvr.hybirdDVRFlag==1){
			//模拟通道
			for(var i=0; i<gDvr.AnalogChNum; i++){
				//console.log("Capture_Set.js i:" + i + " State:" + (IpcAbility[i].State));
				if(IpcAbility[i].State == 2){//在线显示
					//
				}else{
					$("#div_cap_ch"+(i+1)).css("display","none");//不在线隐藏
				}
			}
			//IP通道，全部显示
		}else{
			$.each($("input[id^='cap_ch']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("cap_ch")[1]*1 - 1;
				if(IpcAbility[index].State != 2){
					$(this).prop("disabled",true);
				}
			})
		}
	})
	
	
	//全选
	$("#Capck").click(function(){
		$.each($("input[id^='cap_ch']"),function(i){
			if(gDvr.hybirdDVRFlag==1){//混合DVR
				//console.log("i:" + i);
				if(i<gDvr.AnalogChNum){//模拟通道在线才勾选
					if(IpcAbility[i].State == 2){
						$(this).prop("checked",$("#Capck").prop("checked"));
					}
				}else{//IP通道全部勾选
					$(this).prop("checked",$("#Capck").prop("checked"));
				}
			}else{
				var thisId = $(this).attr("id");
				var index = thisId.split("cap_ch")[1]*1 - 1;
				if(IpcAbility[index].State == 2){
					$(this).prop("checked",$("#Capck").prop("checked"));
				}
			}
		})
	})
	
	$("#CapOk").click(function(){
		var CopyXml="";
		$("#CapCopyTD").css("display","none");	
		var spTdValue="";
		$.each($("input[id^='cap_ch']"),function(){
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
			CopyXml = "<a>";
			CopyXml += ("<CopyChid>" + copychid + "</CopyChid>");
			CopyXml += ("<ChnEnable>" + ($("#Cap_autocap").val()*1) + "</ChnEnable>");
			CopyXml += ("<ManualEnable>" + ($("#Cap_manualcap").val()*1) + "</ManualEnable>");
			CopyXml += ("<chid>" + sel + "</chid>");
			CopyXml += ("<StreamType>" + $("#cap_bitrate_switch").val() + "</StreamType>");
			CopyXml += ("<NormalCapInterv>" + ($("#N_CapSet").val()*1) + "</NormalCapInterv>");
			CopyXml += ("<AlarmCapInterv>" + ($("#M_CapSet").val()*1) + "</AlarmCapInterv>");
			
			CopyXml += "</a>";
			$("#CapChannelMask").change();
			RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", 400, "Set",CopyXml);	//保存复制通道
		}
	})
	
	//初始操作
	var sel = -1;
	$(function(){
		if(gDvr.hybirdDVRFlag==1){
			//模拟通道，在线才添加；
			//IP通道，全部添加
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				if(IpcAbility[i].State == 2){
					if(sel==-1){
						sel = i;
					}
					$("#CapChannelMask").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');//Channel列表
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				if(sel==-1){
					sel = i;//显示列表的第一项
				}
				$("#CapChannelMask").append('<option class="option" value="'+i+'">' + "IP " + lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');//Channel列表
			}
		}else{
			for(var i=0; i<gDvr.nChannel; i++){
				if(IpcAbility[i].State == 2){
					$("#CapChannelMask").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');//Channel列表
				}
			}
		}
		
		if(sel == -1){
			sel = 0;//显示列表的第一项
		}
		//MasklayerShow();
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", 100, "Get");//初始时获取页面数据
		$("#CapChannelMask").val(sel);
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", sel, "Get");
	});	
	
	function Call(xml){
		$("#Cap_autocap").val(findNode("ChnEnable", xml));
		$("#Cap_manualcap").val(findNode("ManualEnable", xml));
		$("#cap_bitrate_switch").val(findNode("StreamType", xml));
		$("#N_CapSet").val(findNode("NormalCapInterv", xml));
		$("#M_CapSet").val(findNode("AlarmCapInterv", xml));
		$("#Cap_autocap").val(findNode("ChnEnable", xml));
	}
	
	$("#CapChannelMask").change(function(){
		var chid = $("#CapChannelMask").val()*1;
		
		CHCAPSaveSel();
		sel = chid;
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", sel, "Get");
	});
	
	function CHCAPSaveSel(){
		var xml = "<a>";
		xml += ("<ChnEnable>" + ($("#Cap_autocap").val()*1) + "</ChnEnable>");
		xml += ("<ManualEnable>" + ($("#Cap_manualcap").val()*1) + "</ManualEnable>");
		xml += ("<chid>" + sel + "</chid>")
		xml += ("<StreamType>" + $("#cap_bitrate_switch").val() + "</StreamType>");
		xml += ("<NormalCapInterv>" + ($("#N_CapSet").val()*1) + "</NormalCapInterv>");
		
		xml += ("<AlarmCapInterv>" + ($("#M_CapSet").val()*1) + "</AlarmCapInterv>");         // lxj
		
		xml += "</a>";
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", sel, "Set", xml);
	}
	
	$("#CapSetRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", 100, "Get");	//刷新页面数据
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", sel, "Get");	//刷新页面数据
	});
	
	$("#CapSetSV").click(function(){
		CHCAPSaveSel();
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", 200, "Set");	//保存
	});
	
	$("#CapSetDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", 850, "Get");
		RfParamCall(Call, $("#Cap_Set").text(), "CaptureSet", sel, "Get");
	});
	
});

