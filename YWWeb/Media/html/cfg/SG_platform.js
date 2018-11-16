// JavaScript Document
$(document).ready(function(){
	var sel = 0;
	$("#SG_timer1").timer({Type:1})
	$("#SG_timer2").timer({Type:1})
	for(var i = 0; i < gDvr.nChannel; ++i){
		$("#SG_channel_switch").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');//Channel列表
	}
	$(function(){
		RfParamCall(Call, $("#SG_plat").text(), "SG_plat", 100, "Get");	//初始时获取页面数据
		RfParamCall(Call, $("#SG_plat").text(), "SG_plat", sel, "Get");
	});
	function Call(xml){
		$("#SG_hostname").val(findNode("HostName", xml).replace(/&amp;/g,"&"));
		$("#SG_port").val(findNode("Port", xml));
		$("#SG_ID").val(findNode("AgentId", xml).replace(/&amp;/g,"&"));
		$("#SG_platform_switch").val(findNode("Enabled", xml));
		$("#SG_before").val(findNode("BeforeTrigger", xml));
		$("#SG_after").val(findNode("AfterTrigger", xml));
		$("#SG_interval").val(findNode("ImgInterval", xml));
		$("#SG_timer1").timer.SetTimeIn24(findNode("UploadTime1", xml), $("#SG_timer1"));
		$("#SG_timer2").timer.SetTimeIn24(findNode("UploadTime2", xml), $("#SG_timer2"));
		$("#SG_time_switch1").prop("checked",findNode("Time1Enable", xml)*1);
		$("#SG_time_switch2").prop("checked",findNode("Time2Enable", xml)*1);
		
		$("#SG_timer1").prop("disabled",!$("#SG_time_switch1").prop("checked"));
		$("#SG_timer2").prop("disabled",!$("#SG_time_switch2").prop("checked"));
		
		$("#SG_platform_switch").change();
	}
	
	$("#SG_channel_switch").change(function (){
		PlatSaveSel();
		sel = $("#SG_channel_switch").val();
		RfParamCall(Call, $("#SG_plat").text(), "SG_plat", sel, "Get");
	});
	
	$("#SG_platform_switch").change(function (){
		showDiv(1 - $("#SG_platform_switch").val(), "#SG_PLAT_DIV");
	});
	
	function PlatSaveSel(){
		var xml = "<a>";
		xml += ("<chid>" + sel + "</chid>");
		xml += ("<HostName>" + ($("#SG_hostname").val()) + "</HostName>");
		xml += ("<Port>" + $("#SG_port").val() + "</Port>");
		xml += ("<AgentId>" + $("#SG_ID").val() + "</AgentId>");
		xml += ("<Enabled>" + $("#SG_platform_switch").val() + "</Enabled>");
		xml += ("<BeforeTrigger>" + $("#SG_before").val() + "</BeforeTrigger>");
		xml += ("<AfterTrigger>" + $("#SG_after").val() + "</AfterTrigger>");
		xml += ("<ImgInterval>" + $("#SG_interval").val() + "</ImgInterval>");
		xml += ("<UploadTime1>" + $("#SG_timer1").timer.GetTimeFor24($("#SG_timer1")) + "</UploadTime1>");
		xml += ("<UploadTime2>" + $("#SG_timer2").timer.GetTimeFor24($("#SG_timer2")) + "</UploadTime2>");
		xml += ("<Time1Enable>" + $("#SG_time_switch1").prop("checked")*1 + "</Time1Enable>");
		xml += ("<Time2Enable>" + $("#SG_time_switch2").prop("checked")*1 + "</Time2Enable>");
		xml += "</a>";
		RfParamCall(Call, $("#SG_plat").text(), "SG_plat", sel, "Set", xml);
	}
	
	$("#SGRf").click(function(){
		
		RfParamCall(Call, $("#SG_plat").text(), "SG_plat", 100, "Get");
		RfParamCall(Call, $("#SG_plat").text(), "SG_plat", sel, "Get");
	});
	
	$("#SGSV").click(function(){
		if($("#SG_ID").val().substr(0,4) != "SSJC"){
			ShowPaop($("#SG_plat").text(),lg.get("IDS_SGPLAT_ID_ERR"));
			return;
		}
		PlatSaveSel();
		RfParamCall(Call, $("#SG_plat").text(), "SG_plat", 200, "Set");	
	});
	
	$("#SG_time_switch1").click(function(){
		$("#SG_timer1").prop("disabled",!$("#SG_time_switch1").prop("checked"));
	});
	$("#SG_time_switch2").click(function(){
		$("#SG_timer2").prop("disabled",!$("#SG_time_switch2").prop("checked"));
	});
	
	
	$("#SG_repair").click(function(){
		$("#SG_main_div").css("display","none");
		$("#SG_repair_div").css("display","block");
		$("#SGRf").css("display","none");
		$("#SGSV").css("display","none");
		$("#SGEXIT").css("display","block");
		$("#SG_repair_upload").css("display","block");
		$("#SG_repair_switch").val(0);
		$("#SG_error_switch").val(0);
		$("#SG_explan_word").val(document.all.SG_error_switch[document.all.SG_error_switch.selectedIndex].text);
	});
	
	$("#SG_error_switch").change(function(){
		$("#SG_explan_word").val(document.all.SG_error_switch[document.all.SG_error_switch.selectedIndex].text);
	});
	
	$("#SG_repair_upload").click(function(){
		var xml = "<a>";
		xml += "<Key>334</Key>";
		xml += "<mode>0</mode>";
		xml += "<caption>"+$("#SG_explan_word").val()+"</caption>";
		xml += "<RepaireType>"+$("#SG_repair_switch").val()*1+"</RepaireType>";
		xml += "<ErrorType>"+$("#SG_error_switch").val()*1+"</ErrorType>";
		xml += "</a>";
		var ret =  gDvr.RemoteTest(xml);
		ShowPaop($("#SG_plat").text(), "上传成功！");
	});
	
	$("#SG_maintain").click(function(){
		$("#SG_main_div").css("display","none");
		$("#SG_maintain_div").css("display","block");
		$("#SGRf").css("display","none");
		$("#SGSV").css("display","none");
		$("#SGEXIT").css("display","block");
		$("#SG_maintain_upload").css("display","block");
		$("#SG_maintain_switch").val(0);
		$("#SG_maintain_result").val(0);
		$("#SG_maintain_word").val(document.all.SG_maintain_result[document.all.SG_maintain_result.selectedIndex].text);
	});
	
	$("#SG_maintain_result").change(function(){
		$("#SG_maintain_word").val(document.all.SG_maintain_result[document.all.SG_maintain_result.selectedIndex].text);
	});
	
	$("#SG_maintain_upload").click(function(){
		var xml = "<a>";
		xml += "<Key>334</Key>";
		xml += "<mode>1</mode>";
		xml += "<caption>"+$("#SG_maintain_word").val()+"</caption>";
		xml += "<EquipMaintain>"+$("#SG_maintain_switch").val()*1+"</EquipMaintain>";
		xml += "<MaintainRes>"+$("#SG_maintain_result").val()*1+"</MaintainRes>";
		xml += "</a>";
		var ret =  gDvr.RemoteTest(xml);
		ShowPaop($("#SG_plat").text(), "上传成功！");
	});
	
	$("#SG_manualupload").click(function(){
		$("#SG_main_div").css("display","none");
		$("#SG_image_div").css("display","block");
		$("#SGRf").css("display","none");
		$("#SGSV").css("display","none");
		$("#SGEXIT").css("display","block");
		$("#SG_image_switch").val(0);
		
		$("#NVR_SGck").prop("checked",false);
		copyTD("#NVR_SGCopyTD","SG_ch","NVR_SG_TDNum");
	});
	
	//全选
	$("#NVR_SGck").click(function(){
		$.each($("input[id^='SG_ch']"),function(){
			$(this).prop("checked",$("#NVR_SGck").prop("checked"));
		})
	})
	
	function GetChannelMask(){//获取 选中通道掩码
		var channelMask = 0;
		$.each($("input[id^='SG_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("SG_ch")[1]*1 - 1;
			if($(this).prop("checked"))
				channelMask |= 1<<index;//选中位 置1
		})
		return channelMask;
	}
	
	$("#SG_image_upload").click(function(){
		var xml = "<a>";
		xml += "<Key>334</Key>";
		xml += "<mode>2</mode>";
		xml += "<ChannelMask>"+ GetChannelMask() +"</ChannelMask>";
		xml += "<type>"+ $("#SG_image_switch").val() +"</type>";
		xml += "</a>";
		var ret =  gDvr.RemoteTest(xml);
		ShowPaop($("#SG_plat").text(), "上传成功！");
	});
	
	$("#SGEXIT").click(function(){
		$("#SG_main_div").css("display","block");
		$("#SG_repair_div").css("display","none");
		$("#SG_maintain_div").css("display","none");
		$("#SG_image_div").css("display","none");
		$("#SGRf").css("display","block");
		$("#SGSV").css("display","block");
		$("#SGEXIT").css("display","none");
	});
});