
$(document).ready(function(){

	//一进来，主动刷新页面
	$(function(){		
		RfParamCall(Call, $("#NormalCloStoFtp_info").text(), "NormalFtp", 100, "Get");  	
	});
	
	$("#NormalCloStoFtpExit").click(function(){
		showConfigChild("NormalClo_Sto");  
	});
	
	$("#NormalCloStoFtpSV").click(function(){		
		var xml = "<a>";
			xml += ("<FtpIpAddr>" + $("#Normal_FtpIpAddr").val() + "</FtpIpAddr>");
			xml += ("<FtpPort>" + $("#Normal_FtpPort").val() + "</FtpPort>");
			xml += ("<FtpLoginName>" + $("#Normal_FtpLoginName").val() + "</FtpLoginName>");
			xml += ("<FtpLoginPwd>" + $(".Normal_FtpLoginPwd").val() + "</FtpLoginPwd>");
			xml += ("<FilePath>" + $("#Normal_FilePath").val() + "</FilePath>");			
		xml += "</a>";		
		RfParamCall(Call, $("#NormalCloStoFtp_info").text(), "NormalFtp", 300, "Set", xml);  //保存"无通道"数据		
	});	
	
	function Call(xml){
		$("#Normal_FtpIpAddr").val(findNode("FtpIpAddr", xml));
		$("#Normal_FtpPort").val(findNode("FtpPort", xml));
		$("#Normal_FtpLoginName").val(findNode("FtpLoginName", xml));
		$(".Normal_FtpLoginPwd").val(findNode("FtpLoginPwd", xml));
		$("#Normal_FilePath").val(findNode("FilePath", xml));
	}
	
	$("#NormalCloStoFtpRf").click(function(){		
		RfParamCall(Call, $("#NormalCloStoFtp_info").text(), "NormalFtp", 100, "Get");	//获取"所有"数据		
	});	
	
	//测试按钮
	$("#NormalFtpTest").click(function(){		
			//判断IP地址、端口号
		if($("#Normal_FtpIpAddr").val() == ""){
			ShowPaop($("#NormalCloStoFtp_info").text(),lg.get("IDS_IP_EMPTY"));    
			return;
		}
		if($("#Normal_FtpPort").val() == ""){
			ShowPaop($("#NormalCloStoFtp_info").text(),lg.get("IDS_PORT_EMPTY"));
			return;
		}		
			//判断用户名、密码
		if($("#Normal_FtpLoginName").val() == ""){
			ShowPaop($("#NormalCloStoFtp_info").text(),lg.get("IDS_USERNAME_EMPTY"));  
			return;
		}
		if($(".Normal_FtpLoginPwd").val() == ""){
			ShowPaop($("#NormalCloStoFtp_info").text(),lg.get("IDS_NO_PASSWORD")); 
			return;
		}
		
		$("#NormalFtpTest").prop("disabled",true);
		
		var xml="<a>";
			xml += "<Key>323</Key>";		
			xml += ("<FtpIpAddr>" + ($("#Normal_FtpIpAddr").val()) + "</FtpIpAddr>"); //IP地址、端口号
			xml += ("<FtpPort>" + ($("#Normal_FtpPort").val()) + "</FtpPort>");
			
			xml += ("<FtpLoginName>" + ($("#Normal_FtpLoginName").val()) + "</FtpLoginName>");	// 用户名、密码	
			xml += ("<FtpLoginPwd>" + ($(".Normal_FtpLoginPwd").val()) + "</FtpLoginPwd>");
			
			xml += ("<CloudSGFtpTestFlag>" + 1 + "</CloudSGFtpTestFlag>");					
		xml += "</a>";
		
		var ftp_ret;
		setTimeout(function(){
			ftp_ret =  gDvr.RemoteTest(xml);
		},0);
		
		if(-1 == ftp_ret){	
			ShowPaop($("#NormalCloStoFtp_info").text(),lg.get("IDS_SEND_FAILED"));  //Send command failed! 发送命令失败
			$("#NormalFtpTest").prop("disabled",false);
		}
		else if(-2 == ftp_ret){
			ShowPaop($("#NormalCloStoFtp_info").text(),lg.get("IDS_PLAYBACK_RIGHT1"));  //you have no permission to process the operation
			$("#NormalFtpTest").prop("disabled",false);
		}
	});
});
