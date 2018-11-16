
$(document).ready(function(){
	
	switch(lgCls.version){
		case "OWL":{
			$("#FTPDf").css("display","block");
			break;
		}
		default:{
			break;
		}
	}
	
	if(gDvr.hybirdDVRFlag == 1){
		$("#FtpIpAddrInput").attr("maxlength","15");
		$("#FtpNameInput").attr("maxlength","32");
		$("#FtpPwdInput").attr("maxlength","32");
		$("#FtpDirNameInput").attr("maxlength","95");
	}
	
	$(function(){
		RfParamCall(Call, $("#FTP_info").text(), "FTP", 100, "Get");
	});
	
	function Call(xml){
		var judge = findNode("Judge",xml)*1;		
		if(judge == 0){
			$("#FTP_Switch").val(findNode("FTPSwitch", xml)*1 );
			$("#FtpNameInput").val(findNode("FtpLoginName", xml));
			$(".FtpPwdInput").val(findNode("FtpLoginPwd", xml));
			$("#FtpIpAddrInput").val(findNode("FtpIpAddr", xml));
			$("#FtpPortInput").val(findNode("FtpPort", xml));
			
			$("#FtpLengthInput").val(findNode("SendFileSize", xml));
			$("#FtpDirNameInput").val(findNode("FilePath", xml));
		}
		DivBoxFtp("#FTP_Switch", "#FtpDivBox");  		
	}
	
	function DivBoxFtp(objMain, obj){
		var $obj = $(obj);
		
		//Disable
		if ($(objMain).val()*1 == 0){  
			$obj.find("select").prop("disabled",true);  //设为Disable
			$obj.children().prop("disabled",true);  //设为Disable
			if($obj.css("display") != "none")$obj.fadeTo("slow", 0.2);
		}
		//Enable
		else{
			$obj.find("select").prop("disabled",false);  //不设为Disable
			if($obj.css("display") != "none"){
				$obj.fadeTo("slow", 1,function(){
					//兼容safari处理
					$obj.css("filter","");
				});
			}
			$obj.children().prop("disabled",false);  //不设为Disable
		}
	}

	//界面处理
	$("#FTP_Switch").click(function(){
		$(this).prop("checked", $(this).val());
		DivBoxFtp("#FTP_Switch", "#FtpDivBox");
	});
	
	$("#FTPSV").click(function(){
		var ipRegEx = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/;
		if( !(ipRegEx.test($("#FtpIpAddrInput").val())))
		{
			ShowPaop($("#FTP_info").text(),lg.get("IDS_IP_FORMAT"));			
			return(false);
		}
		RfParamCall(Call, $("#FTP_info").text(), "FTP", 300, "Set", FTPSave());	//保存
	});
	
	function FTPSave(){
		var xml = "<a>";
			xml += ("<FTPSwitch>" + ($("#FTP_Switch").val()*1) + "</FTPSwitch>");
			xml += ("<FtpLoginName>" + $("#FtpNameInput").val() + "</FtpLoginName>");
			xml += ("<FtpLoginPwd>" + $(".FtpPwdInput").val() + "</FtpLoginPwd>");
			xml += ("<FtpIpAddr>" + $("#FtpIpAddrInput").val() + "</FtpIpAddr>");
			xml += ("<FtpPort>" + $("#FtpPortInput").val() + "</FtpPort>");
			
			xml += ("<SendFileSize>" + $("#FtpLengthInput").val() + "</SendFileSize>");
			xml += ("<FilePath>" + $("#FtpDirNameInput").val() + "</FilePath>");
			//xml += ("<chid>" + sel + "</chid>")
			//xml += ("<ReqTypeMask>" + ReqTypeMask + "</ReqTypeMask>");
		xml += "</a>";
		return xml;
	}
	
	$("#FTPRf").click(function(){
		RfParamCall(Call, $("#FTP_info").text(), "FTP", 100, "Get");	//刷新页面数据
	});	
	
	$("#FTPDf").click(function(){
		RfParamCall(Call, $("#FTP_info").text(), "FTP", 850, "Get");
	});	
	
	$("#FtpTest").click(function(){		
			//判断IP地址、端口号
		if($("#FtpIpAddrInput").val() == ""){
			ShowPaop($("#FTP_info").text(),lg.get("IDS_IP_EMPTY"));    
			return;
		}
		if($("#FtpPortInput").val() == ""){
			ShowPaop($("#FTP_info").text(),lg.get("IDS_PORT_EMPTY"));
			return;
		}		
			//判断用户名、密码
		if($("#FtpNameInput").val() == ""){
			ShowPaop($("#FTP_info").text(),lg.get("IDS_USERNAME_EMPTY"));  
			return;
		}
		if($(".FtpPwdInput").val() == ""){
			ShowPaop($("#FTP_info").text(),lg.get("IDS_NO_PASSWORD")); 
			return;
		}
		
		$("#FtpTest").prop("disabled",true);
		
		var xml="<a>";
		xml += "<Key>323</Key>";		
		xml += ("<FtpIpAddr>" + ($("#FtpIpAddrInput").val()) + "</FtpIpAddr>"); //IP地址、端口号
		xml += ("<FtpPort>" + ($("#FtpPortInput").val()) + "</FtpPort>");
		
		xml += ("<FtpLoginName>" + ($("#FtpNameInput").val()) + "</FtpLoginName>");	// 用户名、密码	
		xml += ("<FtpLoginPwd>" + ($(".FtpPwdInput").val()) + "</FtpLoginPwd>");		
		xml += "</a>";
		
		var ftp_ret;
		setTimeout(function(){
			ftp_ret =  gDvr.RemoteTest(xml);},0);
		
		if(-1 == ftp_ret){	
			ShowPaop($("#FTP_info").text(),lg.get("IDS_SEND_FAILED"));  //Send command failed! 发送命令失败
			$("#FtpTest").prop("disabled",false);
		}
		else if(-2 == ftp_ret){
			ShowPaop($("#FTP_info").text(),lg.get("IDS_PLAYBACK_RIGHT1"));  //you have no permission to process the operation
			$("#FtpTest").prop("disabled",false);
		}
	});

});
