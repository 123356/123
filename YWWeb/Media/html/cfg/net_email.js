// JavaScript Document
$(document).ready(function(){
	if(g_bDefaultShow == true){
			$("#EmailDf").css("display","block");
	}
	//初始操作
	switch(lgCls.version){
		case "LOREX":{
			break;
		}
		case "FLIR":{
			$("#EmEmailSwitch option[value='2']").remove();	
			break;
		}
		/*case "URMET":*/
		case "ELKRON":{
			$("#EmEmailSwitch").css("width","150px");
			$("#EmailSetup").css("display","block");		
			$("#EmEmailSwitch option[value='2']").remove();
			$("#EMAIL_DISPLAY").css("display","block");
			break;
		}
		case "SVAT":
		case "DEFENDER":
		//case "KGUARD":
		case "NORMAL":
		case "ALPHATECH":
		case "LEGRAND":{
			$("#EmEmailSwitch option[value='2']").remove();
			$("#EMAIL_DISPLAY").css("display","block");
			if(gDvr.nMainType==0x52530002 || (gDvr.nMainType==0x52530005) || gDvr.nMainType==0x52530003 || (gDvr.nMainType==0x52530000 && gDvr.nSubType == 0x60300) || gDvr.nSubType == 0x90100 || (gDvr.nMainType == 0x52530001 && gDvr.nSubType == 0x80200) || (gDvr.nMainType==0x52530000 && gDvr.nSubType == 0x70500)){
				$("#EmEmailSwitch").css("width","150px");
				$("#EmailSetup").css("display","block");						
			}
			break;
		}
		default:{
			$("#EmEmailSwitch option[value='2']").remove();		
			$("#EMAIL_DISPLAY").css("display","block");
			break;
		}
	}
	if(gDvr.EmailFlagSwitch == 1){
		if(gDvr.EmailScheduleFlag == 1){
			$("#EmEmailSwitch").css("width","150px");
			$("#EmailSetup").css("display","block");
		}else{
			$("#EmailSetup").css("display","none");
			$("#EmEmailSwitch").css("width","300px");			
		}
	}
		//MasklayerShow();
		RfParamCall(Call, $("#email_config").text(), "NetEmail", 100, "Get");	//初始时获取页面数据
		
	function Call(xml){
			$("#EmEmailSwitch").val(findNode("EmailSwitch", xml)*1).prop("checked", findNode("EmailSwitch", xml)*1);
			$("#EmSMTP").val(findNode("SMTP", xml));
			$("#EmSendEmail").val(findNode("SendEmail", xml));
			$(".EmSendEmailPW").val(findNode("SendEmailPW", xml));
			$("#EmRecvEmail").val(findNode("RecvEmail", xml));
			$("#EmPort").val(findNode("Port", xml));
			$("#EmSSLSwitch").val(findNode("SSLSwitch", xml));
			$("#Emintervaltime").val(findNode("intervaltime", xml));
			$("#EmEmailSwitch").change();     
	}
	
	$("#EmailRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#email_config").text(), "NetEmail", 100, "Get");	//刷新页面数据
	});
	
	$("#EmailDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#email_config").text(), "NetEmail", 850, "Get");	//刷新页面数据
	});
	
	$("#EmailTest").click(function(){
		//var path = $("#filepath").val();
	
        if($("#EmEmailSwitch").val()*1!=2){
			if($("#EmPort").val() == ""){
				ShowPaop($("#email_config").text(),lg.get("IDS_PORT_EMPTY"));
				return;
			}
			if($("#EmSMTP").val() == ""){
			ShowPaop($("#email_config").text(),lg.get("IDS_SMTP_EMPTY"));
			return;
			}
		}
		
		if($("#EmSendEmail").val() == ""){
			ShowPaop($("#email_config").text(),lg.get("IDS_SENDER_EMPTY"));
			return;
		}
		else{
			var email=document.getElementById("EmSendEmail").value;
			var isemail=/^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
			if (!isemail.test(email)){
				ShowPaop($("#email_config").text(),lg.get("IDS_ERR_SENDEREMAILFORMAT"));
    			return;
			}
		}
		if($("#EmRecvEmail").val() == ""){
			ShowPaop($("#email_config").text(),lg.get("IDS_RECEIVER_EMPTY"));
			return;
		}	
		else{
			var email=document.getElementById("EmRecvEmail").value;
			var isemail=/^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
			if (!isemail.test(email)){
				ShowPaop($("#email_config").text(),lg.get("IDS_ERR_RECEIVEREMAILFORMAT"));
    			return;
			}
		}
		
		var xml="<a>";
		xml += "<Key>301</Key>";
		if ($("#EmEmailSwitch").val()*1 == 2){
			xml += ("<SSLSwitch>0</SSLSwitch>");
			xml += ("<SMTP>mysmtp.lorexddns.net</SMTP>");
			xml += ("<Port>2525</Port>");
		}else{
			xml += ("<SSLSwitch>" + ($("#EmSSLSwitch").val()) + "</SSLSwitch>");
			xml += ("<SMTP>" + ($("#EmSMTP").val()) + "</SMTP>");
			xml += ("<Port>" + ($("#EmPort").val()) + "</Port>");
		}
		xml += ("<SendEmail>" + ($("#EmSendEmail").val()) + "</SendEmail>");
		xml += ("<SendEmailPW>" + ($(".EmSendEmailPW").val()) + "</SendEmailPW>");
		xml += ("<RecvEmail>" + ($("#EmRecvEmail").val()) + "</RecvEmail>");
		xml += ("<TestType>" + 0 + "</TestType>");
		xml += "</a>";
		//$("#EmailTest").fadeTo("fast", 0.2);
		document.getElementById("EmailTest").value = lg.get("IDS_EMAILTESTING");
		$("#EmailTest").prop("disabled",true); 
		var email_ret =  gDvr.RemoteTest(xml);
		if(-1 == email_ret){	
			ShowPaop($("#email_config").text(),lg.get("IDS_SEND_FAILED"));
			$("#EmailTest").prop("disabled",false);
		}else if(-2 == email_ret){
			ShowPaop($("#email_config").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			$("#EmailTest").prop("disabled",false);
		}
		else{
			//if ($.browser.safari){
				return;
			//}
			//$("#EmailTest").prop("disabled",false);
		}
		
	});
	
	$("#EmailSetup").click(function(){
		showConfigChild("email_jh");
	})
	
	$("#EmEmailSwitch").change(function(){
		if ($(this).val()*1 ==2 ){
			
			$("#EmSSLSwitch,#EmPort,#EmSMTP,.EmSendEmailPW").css("display", "none")
			$("#defaultoff,#defaultport,#defaultserver").css("display", "block")
			$(this).prop("checked", 1);
			DivBox("#EmEmailSwitch", "#EmDivBox");
		}else{
				
			$(this).prop("checked", $(this).val()*1);
			$("#EmailTest").prop("disabled",1 - $("#EmEmailSwitch").val());
			DivBox("#EmEmailSwitch", "#EmDivBox");
			$("#EmSSLSwitch,#EmPort,#EmSMTP,.EmSendEmailPW").css("display", "block")
			$("#defaultoff,#defaultport,#defaultserver").css("display", "none")
			switch(lgCls.version){
				/*case "URMET":*/
				case "ELKRON":{
					if ($("#EmEmailSwitch").prop("checked")*1 != 1){
						$("#EmailSetup").prop("disabled",true);
						$("#EmailSetup").fadeTo("slow", 0.2);
					}else{
						$("#EmailSetup").prop("disabled",false);
						$("#EmailSetup").fadeTo("slow", 1);
					}
					break;
				}
				default:
					break;	
			}
		}
	})
	
	$("#EmailSave").click(function(){
		var xml = "<a>";
		if ($("#EmEmailSwitch").val()*1 == 2){
			xml += ("<SSLSwitch>0</SSLSwitch>");
			xml += ("<SMTP>mysmtp.lorexddns.net</SMTP>");
			xml += ("<Port>2525</Port>");
		}else{
			xml += ("<SSLSwitch>" + ($("#EmSSLSwitch").val()) + "</SSLSwitch>");
			xml += ("<SMTP>" + ($("#EmSMTP").val()) + "</SMTP>");
			xml += ("<Port>" + ($("#EmPort").val()) + "</Port>");
		}
		xml += ("<EmailSwitch>" + ($("#EmEmailSwitch").val())+ "</EmailSwitch>");
		
		xml += ("<SendEmail>" + ($("#EmSendEmail").val()) + "</SendEmail>");
		xml += ("<SendEmailPW>" + ($(".EmSendEmailPW").val()) + "</SendEmailPW>");
		xml += ("<RecvEmail>" + ($("#EmRecvEmail").val()) + "</RecvEmail>");
		
		
		xml += ("<intervaltime>" + ($("#Emintervaltime").val()) + "</intervaltime>");
		xml += "</a>";
		RfParamCall(Call, $("#email_config").text(), "NetEmail", 300, "Set", xml);	//保存
	});
	
	//界面处理
	$("#EmEmailSwitch").click(function(){
		DivBox("#EmEmailSwitch", "#EmDivBox");
		switch(lgCls.version){
				/*case "URMET":*/
				case "ELKRON":{
					if ($("#EmEmailSwitch").prop("checked")*1 != 1){
						$("#EmailSetup").prop("disabled",true);
						$("#EmailSetup").fadeTo("slow", 0.2);
					}else{
						$("#EmailSetup").prop("disabled",false);
						$("#EmailSetup").fadeTo("slow", 1);
					}
					break;
				}
				default:
					break;	
			}
	});
});