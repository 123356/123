// JavaScript Document
$(document).ready(function(){
	
	//隐藏、显示下面的按钮
	$("#NormalCloStoEm_EmailSwitch").change(function(){		
		if(gDvr.hybirdDVRFlag==1){
			//混合DVR不显示EmailTest按钮
			$("#NormalCloStoEm_EmailTestDiv").css("display","none");
		}else{
			if ( $(this).val() == 0 ){			
				$("#NormalCloStoEm_EmailTestDiv").css("display","none");
			}else{			
				$("#NormalCloStoEm_EmailTestDiv").css("display","block");
			}
		}
		setTimeout(function(){
		showDiv(1-$("#NormalCloStoEm_EmailSwitch").val(), "#NormalCloStoEm_divdisplay");},0);
	})
	
	//一进来，主动刷新页面
	$(function(){		
		RfParamCall(Call, $("#NormalCloStoEm_config").text(), "NormalCloEm", 100, "Get");  	
	});
	
	$("#NormalCloStoEmExit").click(function(){
		showConfigChild("NormalClo_Sto");  
	});
	
	//点击保存按钮
	$("#NormalCloStoEmSave").click(function(){
		var xml = "<a>";			
			xml += ("<EmailSwitch>" + ($("#NormalCloStoEm_EmailSwitch").val()) + "</EmailSwitch>");
			xml += ("<SSLSwitch>" + ($("#NormalCloStoEm_SSLSwitch").val()) + "</SSLSwitch>");
			xml += ("<Port>" + ($("#NormalCloStoEm_Port").val()) + "</Port>");
			
			xml += ("<SMTP>" + ($("#NormalCloStoEm_SMTP").val())+ "</SMTP>");
			
			xml += ("<SendEmail>" + ($("#NormalCloStoEm_SendEmail").val()) + "</SendEmail>");
			xml += ("<SendEmailPW>" + ($(".NormalCloStoEm_SendEmailPW").val()) + "</SendEmailPW>");
			xml += ("<RecvEmail>" + ($("#NormalCloStoEm_RecvEmail").val()) + "</RecvEmail>");
		xml += "</a>";
		RfParamCall(Call, $("#NormalCloStoEm_config").text(), "NormalCloEm", 300, "Set", xml);	//保存
	});
			
	function Call(xml){
		$("#NormalCloStoEm_EmailSwitch").val(findNode("EmailSwitch", xml));
			$("#NormalCloStoEm_EmailSwitch").change();     
		$("#NormalCloStoEm_SSLSwitch").val(findNode("SSLSwitch", xml));			
		$("#NormalCloStoEm_Port").val(findNode("Port", xml));			
		$("#NormalCloStoEm_SMTP").val(findNode("SMTP", xml));
		
		$("#NormalCloStoEm_SendEmail").val(findNode("SendEmail", xml));
		$(".NormalCloStoEm_SendEmailPW").val(findNode("SendEmailPW", xml));
		$("#NormalCloStoEm_RecvEmail").val(findNode("RecvEmail", xml));	
	}
	
	$("#NormalCloStoEmRf").click(function(){
		RfParamCall(Call, $("#NormalCloStoEm_config").text(), "NormalCloEm", 100, "Get");	//刷新页面数据
	});
	
	//点击按钮
	$("#NormalCloStoEm_EmailTest").click(function(){		
		//端口不能为空
		if($("#NormalCloStoEm_Port").val() == ""){
			ShowPaop($("#NormalCloStoEm_config").text(),lg.get("IDS_PORT_EMPTY"));
			return;
		}
		
		//服务器不能为空
		if($("#NormalCloStoEm_SMTP").val() == ""){
			ShowPaop($("#NormalCloStoEm_config").text(),lg.get("IDS_SMTP_EMPTY"));
			return;
		}
		
		//发送邮件不能为空		
		if($("#NormalCloStoEm_SendEmail").val() == ""){
			ShowPaop($("#NormalCloStoEm_config").text(),lg.get("IDS_SENDER_EMPTY"));
			return;
		}
		
		//接收邮件不能为空
		if($("#NormalCloStoEm_RecvEmail").val() == ""){
			ShowPaop($("#NormalCloStoEm_config").text(),lg.get("IDS_RECEIVER_EMPTY"));
			return;
		}	
		
		var xml="<a>";
			xml += "<Key>301</Key>";
			
			xml += ("<SSLSwitch>" + ($("#NormalCloStoEm_SSLSwitch").val()) + "</SSLSwitch>");
			xml += ("<Port>" + ($("#NormalCloStoEm_Port").val()) + "</Port>");
			xml += ("<SMTP>" + ($("#NormalCloStoEm_SMTP").val()) + "</SMTP>");			
			
			xml += ("<SendEmail>" + ($("#NormalCloStoEm_SendEmail").val()) + "</SendEmail>");
			xml += ("<SendEmailPW>" + ($(".NormalCloStoEm_SendEmailPW").val()) + "</SendEmailPW>");
			xml += ("<RecvEmail>" + ($("#NormalCloStoEm_RecvEmail").val()) + "</RecvEmail>");
		xml += "</a>";
		
		$("#NormalCloStoEm_EmailTest").prop("disabled",true); 
		var normalClo_ret =  gDvr.RemoteTest(xml);
		if(-1 == normalClo_ret){	
			ShowPaop($("#NormalCloStoEm_config").text(),lg.get("IDS_SEND_FAILED"));
			$("#NormalCloStoEm_EmailTest").prop("disabled",false);
		}else if(-2 == normalClo_ret){
			ShowPaop($("#NormalCloStoEm_config").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			$("#NormalCloStoEm_EmailTest").prop("disabled",false);
		}else{
			if (navigator.userAgent.indexOf("Safari")>=0 && navigator.userAgent.toLowerCase().indexOf("version") >= 0){//$.browser.safari
				return;
			}
			$("#NormalCloStoEm_EmailTest").prop("disabled",false);
		}		
	});	
});