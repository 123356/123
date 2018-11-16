// JavaScript Document
$(document).ready(function(){
	
	if(g_bDefaultShow == true){
		$("#ABDf").css("display","block");
	}
	if(gDvr.nMainType == 0x52530101 && gDvr.nSubType == 0x10100){
		$("#yc_buzzerTime").css("display","none");
	}
	if(gDvr.nAlarmOut == 4){
		$("#ABAlarmOut").css("display","none");
		$("#ABAlarmOut").prop("checked",true);
	}
	switch(lgCls.version){
		/*
		case "KGUARD":{
			$("#ABShowMessage").prop("disabled",true);
			break;
		}
		*/
		case "FLIR":
		case "LOREX":{
			if(gDvr.nAlarmOut <=0){
				$("#ycalarm_out_0,#ycalarm_time_0").css("display","none");
			}
			break;
		}
		/*case "URMET":*/
		case "ELKRON":{
			$("#ABAlarmOutTime").empty();
			$("#ABAlarmOutTime").append('<option class="option" value="0">10'+lg.get("IDS_SECOND")+'</option>');
			$("#ABAlarmOutTime").append('<option class="option" value="4">30'+lg.get("IDS_SECOND")+'</option>');
			$("#ABAlarmOutTime").append('<option class="option" value="5">1'+lg.get("IDS_MINUTE")+'</option>');
			$("#ABAlarmOutTime").append('<option class="option" value="6">2'+lg.get("IDS_MINUTE")+'</option>');
		}
		default:
			break;
	}
	
	if(gDvr.hybirdDVRFlag == 1){
		if(lgCls.version == "URMET"){
			$("#ABAlarmOutTime").empty();
			$("#ABAlarmOutTime").append('<option class="option" value="0">10'+lg.get("IDS_SECOND")+'</option>');//10s
			$("#ABAlarmOutTime").append('<option class="option" value="1">30'+lg.get("IDS_SECOND")+'</option>');//30s
			$("#ABAlarmOutTime").append('<option class="option" value="2">1'+lg.get("IDS_MINUTE")+'</option>');	//1min
			$("#ABAlarmOutTime").append('<option class="option" value="3">2'+lg.get("IDS_MINUTE")+'</option>');	//2min
			$("#ABAlarmOutTime").append('<option class="option" value="4">5'+lg.get("IDS_MINUTE")+'</option>');	//5min
		}
	}
	
	if(gDvr.nAlarmOut <= 0){
			$("#ycalarm_out_0,#ycalarm_time_0").css("display","none");
	}
	//初始操作
	ab_report.sel=0;
	var color = "rgb(0, 102, 0)";
	$(function(){
		if(gDvr.nAlarmOut > 1)
		{
			$("#ABAlarmChannelDiv").css("display","block");
		}else {
			$("#ABAlarmChannelDiv").css("display","none");
		}
		if ($.browser.msie && $.browser.version.indexOf("9") == -1) color = color.replace(/\s/g, "");
		$("#ABAlarmChannelDiv").divBox({number:gDvr.nAlarmOut,bkColor:color});
		
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", 100, "Get");	//初始时获取页面数据
		ab_report.sel = 0;
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", ab_report.sel, "Get");
	});
	
	function Call(xml){
		$("#ABEnable").prop("checked", findNode("Enable", xml)*1);
		$("#ABBuzzerMooTime").val(findNode("BuzzerMooTime", xml));
		$("#ABShowMessage").prop("checked", findNode("ShowMessage", xml)*1);
		$("#ABSendEmail").prop("checked", findNode("SendEmail", xml)*1);
		$("#ABAlarmOut").prop("checked", findNode("AlarmOut", xml)*1);
		$("#ABAlarmOutTime").val(findNode("AlarmOutTime", xml));
			if(gDvr.nAlarmOut>1){
				str =findNode("AlarmOutManager", xml);	
				str = str.toLowerCase();
				str = "<a>" + str.split("item").join("p") + "</a>";

				var temArray = new Array();
				$(str).find("p").each(function(i){
					temArray[i] = $(this).text();
				});	
				
				$("#ABAlarmChannelDiv > div").css("background-color", "transparent");	   
				$("#ABAlarmChannelDiv > div").each(function(i){
					if (temArray[i] == 1){
						$(this).css("background-color", color)
					}
				});
			}
			
		DivBox("#ABEnable", "#ABDivBoxEnable");
		if(gDvr.nAlarmOut != 4){
			DivBox("#ABAlarmOut", "#ABDivBoxAlarmOut");
		}
	}
	
	$("#AbnormalType").change(function(){
		CHOSDSaveSel();
		ab_report.sel = $("#AbnormalType").val();
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", ab_report.sel, "Get");
	});
	
	function CHOSDSaveSel(){
		var xml = "<a>";
		xml += ("<Enable>" + ($("#ABEnable").prop("checked")*1) + "</Enable>");
		xml += ("<BuzzerMooTime>" + ($("#ABBuzzerMooTime").val()) + "</BuzzerMooTime>");
		xml += ("<ShowMessage>" + ($("#ABShowMessage").prop("checked")*1) + "</ShowMessage>");
		xml += ("<SendEmail>" + ($("#ABSendEmail").prop("checked")*1) + "</SendEmail>");
		xml += ("<AlarmOut>" + ($("#ABAlarmOut").prop("checked")*1) + "</AlarmOut>");
		xml += ("<chid>" + ab_report.sel + "</chid>");
		xml += ("<AlarmOutTime>" + $("#ABAlarmOutTime").val() + "</AlarmOutTime>");		
		if(gDvr.nAlarmOut>1){ 
		   xml += "<AlarmOutManager>";
		   $("#ABAlarmChannelDiv > div").each(function(i){
			   var bCheckd = ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, ""))?1:0;
			   xml += "<item>"+bCheckd+"</item>";	
		   });
			xml += "</AlarmOutManager>";
		}
	
		xml += "</a>";
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", ab_report.sel, "Set", xml);
	}
	
	$("#ABRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", 100, "Get");	//刷新页面数据
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", ab_report.sel, "Get");	//刷新页面数据
		$("#YTchid").val(0);
	});
	
	$("#ABDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", 850, "Get");
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", ab_report.sel, "Get");	//刷新页面数据
	});
	
	$("#ABSave").click(function(){
		CHOSDSaveSel();
		RfParamCall(Call, $("#ab_report").text(), "AlarmAb", 200, "Set");
	});
	
	$("#ABEnable").click(function(){	//启用异常报警  
		DivBox("#ABEnable", "#ABDivBoxEnable");
	}); 
	
	$("#ABAlarmOut").click(function(){	//启用报警输出  
		DivBox("#ABAlarmOut", "#ABDivBoxAlarmOut");
	}); 
	
});