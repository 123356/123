// JavaScript Document
// JavaScript Document
$(document).ready(function(){
	//初始操作
	switch(lgCls.version){
		case "LOREX":{
			break;
		}
		case "FLIR":{
			$("#CloEmEmailSwitch option[value='2']").remove();	
			break;
		}
		/*case "URMET":*/
		case "ELKRON":{
			$("#CloEmEmailSwitch option[value='2']").remove();
			$("#CloEMAIL_DISPLAY").css("display","block");
			break;
		}
		case "SVAT":
		case "DEFENDER":
		//case "KGUARD":
		case "NORMAL":
		case "ALPHATECH":
		case "LEGRAND":{
			$("#CloEmEmailSwitch option[value='2']").remove();
			$("#CloEMAIL_DISPLAY").css("display","block");
			break;
		}
		default:{
			$("#CloEmEmailSwitch option[value='2']").remove();		
			$("#CloEMAIL_DISPLAY").css("display","block");
			break;
		}
	}
		//MasklayerShow();
		RfParamCall(Call, $("#Cloemail_config").text(), "CloNetEmail", 100, "Get");	//初始时获取页面数据
		
	function Call(xml){
			$("#CloEmEmailSwitch").val(findNode("EmailSwitch", xml)*1).prop("checked", findNode("EmailSwitch", xml)*1);
			$("#CloEmSMTP").val(findNode("SMTP", xml));
			$("#CloEmSendEmail").val(findNode("SendEmail", xml));
			$(".CloEmSendEmailPW").val(findNode("SendEmailPW", xml));
			$("#CloEmRecvEmail").val(findNode("RecvEmail", xml));
			$("#CloEmPort").val(findNode("Port", xml));
			$("#CloEmSSLSwitch").val(findNode("SSLSwitch", xml));
			$("#CloEmintervaltime").val(findNode("intervaltime", xml));
			$("#CloEmEmailSwitch").change();
	}
	
	$("#CloEmailRf").click(function(){
		
		RfParamCall(Call, $("#Cloemail_config").text(), "CloNetEmail", 100, "Get");	//刷新页面数据
	});
	
	$("#CloEmailTest").click(function(){
		
		//var path = $("#filepath").val();
        if($("#CloEmEmailSwitch").val()*1!=2){
			if($("#CloEmPort").val() == ""){
				ShowPaop($("#Cloemail_config").text(),lg.get("IDS_PORT_EMPTY"));
				return;
			}
			if($("#CloEmSMTP").val() == ""){
			ShowPaop($("#Cloemail_config").text(),lg.get("IDS_SMTP_EMPTY"));
			return;
			}
		}
		
		if($("#CloEmSendEmail").val() == ""){
			ShowPaop($("#Cloemail_config").text(),lg.get("IDS_SENDER_EMPTY"));
			return;
		}
		if($("#CloEmRecvEmail").val() == ""){
			ShowPaop($("#Cloemail_config").text(),lg.get("IDS_RECEIVER_EMPTY"));
			return;
		}	
		var xml="<a>";
		xml += "<Key>301</Key>";
		if ($("#CloEmEmailSwitch").val()*1 == 2){
			xml += ("<SSLSwitch>0</SSLSwitch>");
			xml += ("<SMTP>mysmtp.lorexddns.net</SMTP>");
			xml += ("<Port>2525</Port>");
		}else{
			xml += ("<SSLSwitch>" + ($("#CloEmSSLSwitch").val()) + "</SSLSwitch>");
			xml += ("<SMTP>" + ($("#CloEmSMTP").val()) + "</SMTP>");
			xml += ("<Port>" + ($("#CloEmPort").val()) + "</Port>");
		}
		xml += ("<SendEmail>" + ($("#CloEmSendEmail").val()) + "</SendEmail>");
		xml += ("<SendEmailPW>" + ($(".CloEmSendEmailPW").val()) + "</SendEmailPW>");
		xml += ("<RecvEmail>" + ($("#CloEmRecvEmail").val()) + "</RecvEmail>");
		xml += ("<TestType>" + 1 + "</TestType>");
		xml += "</a>";
		document.getElementById("CloEmailTest").value = lg.get("IDS_EMAILTESTING");
		$("#CloEmailTest").prop("disabled",true); 
		var email_ret =  gDvr.RemoteTest(xml);
		if(-1 == email_ret){	
			ShowPaop($("#Cloemail_config").text(),lg.get("IDS_SEND_FAILED"));
			$("#CloEmailTest").prop("disabled",false);
		}else if(-2 == email_ret){
			ShowPaop($("#Cloemail_config").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			$("#CloEmailTest").prop("disabled",false);
		}
		else{
			return;
			/*
			if (navigator.userAgent.indexOf("Safari")>=0 && navigator.userAgent.toLowerCase().indexOf("version") >= 0)//$.browser.safari
			{
				return;
			}
			$("#CloEmailTest").prop("disabled",false);
			*/
		}
		
	});
	
	$("#CloEmEmailSwitch").change(function(){
		if ($(this).val()*1 ==2 ){
			
			$("#CloEmSSLSwitch,#CloEmPort,#CloEmSMTP,.CloEmSendEmailPW").css("display", "none")
			$("#Clodefaultoff,#Clodefaultport,#Clodefaultserver").css("display", "block")
			$(this).prop("checked", 1);
			DivBox("#CloEmEmailSwitch", "#CloEmDivBox");
		}else{
				
			$(this).prop("checked", $(this).val()*1);

			DivBox("#CloEmEmailSwitch", "#CloEmDivBox");
			$("#CloEmSSLSwitch,#CloEmPort,#CloEmSMTP,.CloEmSendEmailPW").css("display", "block")
			$("#Clodefaultoff,#Clodefaultport,#Clodefaultserver").css("display", "none")
		}
	})
	
	$("#CloEmailSave").click(function(){
		var xml = "<a>";
		if ($("#CloEmEmailSwitch").val()*1 == 2){
			xml += ("<SSLSwitch>0</SSLSwitch>");
			xml += ("<SMTP>mysmtp.lorexddns.net</SMTP>");
			xml += ("<Port>2525</Port>");
		}else{
			xml += ("<SSLSwitch>" + ($("#CloEmSSLSwitch").val()) + "</SSLSwitch>");
			xml += ("<SMTP>" + ($("#CloEmSMTP").val()) + "</SMTP>");
			xml += ("<Port>" + ($("#CloEmPort").val()) + "</Port>");
		}
		xml += ("<EmailSwitch>" + ($("#CloEmEmailSwitch").val())+ "</EmailSwitch>");
		
		xml += ("<SendEmail>" + ($("#CloEmSendEmail").val()) + "</SendEmail>");
		xml += ("<SendEmailPW>" + ($(".CloEmSendEmailPW").val()) + "</SendEmailPW>");
		xml += ("<RecvEmail>" + ($("#CloEmRecvEmail").val()) + "</RecvEmail>");
		
		
		xml += ("<intervaltime>" + ($("#CloEmintervaltime").val()) + "</intervaltime>");
		xml += "</a>";
		RfParamCall(Call, $("#Cloemail_config").text(), "CloNetEmail", 300, "Set", xml);	//保存
	});
	
	//界面处理
	$("#CloEmEmailSwitch").click(function(){
		DivBox("#CloEmEmailSwitch", "#CloEmDivBox");
	});
	
	$("#CloEmailExit").click(function(){
		$("#NewCloud_Storage").click();
		/*
		if(lgCls.version == "KGUARD"){
			$("#NewCloud_Storage").click();
		}else{
			$("#Cloud_Storage").click();
		}
		*/		
	})
});