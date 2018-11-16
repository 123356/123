// JavaScript Document
$(document).ready(function(){
	//初始操作
		//MasklayerShow();
		
	if(g_bDefaultShow == true){
		$("#au_default").css("display","block");
	}
	if(gDvr.showVersionFlag==1){
		$("#au_DeviceType_div").css("display","block");
		$("#au_SoftwareVer_div").css("display","block");
	}
	
	RfParamCall(Call, $("#auto_upgrade").text(), "AutoUpgrade", 100, "Get");	//初始时获取页面数据
	
	function Call(xml){
			$("#au_switch").val(findNode("AutoUpgradeEnable", xml));
			$("#au_tip_switch").prop("checked",findNode("AutoUpgradePrompt",xml)*1);
			if($("#au_switch").val()==0){
				$("#au_check").css("display","none");
			}else{
				$("#au_check").css("display","block");
			}
			
			if(gDvr.showVersionFlag==1){
				$("#au_DeviceType").val(findNode("DeviceType", xml));
				$("#au_SoftwareVer").val(findNode("SoftwareVer", xml));
			}
	}
	
	$("#au_switch").change(function(){
		if($("#au_switch").val()==0){
			$("#au_check").css("display","none");
			$("#CheckUpdate").prop("disabled",true);
		}else{
			$("#au_check").css("display","block");
			$("#CheckUpdate").prop("disabled",false);
		}
	});
	
	$("#au_refresh").click(function(){
		//MasklayerShow();
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#serial_port_config").text(), "AutoUpgrade", 100, "Get");	//刷新页面数据
	});
	
	$("#au_default").click(function(){
		//MasklayerShow();
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#serial_port_config").text(), "AutoUpgrade", 850, "Get");	//刷新页面数据
	});
	
	$("#au_save").click(function(){
		//MasklayerShow();
		var xml = "<a>";
		xml += ("<AutoUpgradeEnable>" + ($("#au_switch").val()) + "</AutoUpgradeEnable>");
		xml += ("<AutoUpgradePrompt>" + ($("#au_tip_switch").prop("checked")*1) + "</AutoUpgradePrompt>");
		xml += "</a>";
		RfParamCall(Call, $("#auto_upgrade").text(), "AutoUpgrade", 300, "Set", xml);	//保存
	});
	
	//1、点击Detect按钮，发消息到板子，查看是否要升级；返回消息，插件调用网页(FtpIsUpdateEvent)
	$("#CheckUpdate").click(function(){
		if(gDvr.RemoteFtpUpgradeSupport == 1){
			gDvr.GetDevAllStatusReq();//1是否要升级？  //2升级中...  //else已最新
		}		
	});
	
	//2、点击Yes按钮 要升级
	$("#UpgradeBtn").click(function(){
		g_bIsupgrading = true;
		$("#FTPUPDATESTATE").css("display","block");
		$("#UpgradeBtn").css("display","none");
		$("#UpgradeBtnCancel").css("display","none");
		gDvr.FTPUpgrading(1);
	});
	
	//3、点击Yes按钮后，升级进度条(FtpUpdateEvent)
	FtpUpdateCallBack = FtpUpdateCall;
	function FtpUpdateCall(pos,status)
	{
		//console.log("pos:" + pos + " status:" + status);
		if(status == 1){
			$("#FTPaa").css("display","block");
			$("#FTPaa").css("width",pos+"%");
			$("#FTPupdateMsg").html(pos+"%");		
		}else if(status == 0 || status == 2){
			$("#FTPaa").css("width","100%");
			$("#FTPupdateMsg").html("100%");
			$("#FTPUPDATESTATE1").css("display","none");
			$("#UpgradeTip").prop("innerHTML",lg.get("IDS_REMOTEUPGRADE_OK")+", waiting for reboot.");
			/*g_bIsupgrading = false;
			if(g_bAutoShutdown == true){
				AutoShutDown();
			}*/
		}else if(status == 3){
			$("#UpgradeTip").prop("innerHTML","Upgrade failed, waiting for reboot.");
			/*g_bIsupgrading = false;
			if(g_bAutoShutdown == true){
				AutoShutDown();
			}*/
		}
	}
	
	//No 不升级
	$("#UpgradeBtnCancel").click(function(){
		$("#UpgradeBtn").css("display","none");
		$("#UpgradeBtnCancel").css("display","none");
		$("#UpgradeTip").css("display","none");
	});
	
});