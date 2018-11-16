// JavaScript Document
$(document).ready(function(){	

	if(lgCls.version == "KGUARD"){
		$("#NewCloStoEnable").css("width","150px");
		$("#CloudCheck").css("display","block");
	}
	
	MasklayerHide();
	
	$(function(){		
		RfParamCall(Call, $("#NewCloSto_Title").text(), "NewCloud", 100, "Get");  //一进来，先刷新页面	
	});
	
	if(gDvr.CloudeSGType == 0){
		$("#NewCloStoServerType").empty();
		$("#NewCloStoServerType").append('<option class="option" value="0">Dropbox</option>');
		$("#NewCloStoServerType").append('<option class="option" value="1">Google Drive</option>');
	}else if(gDvr.CloudeSGType == 1){
		$("#NewCloStoServerType").empty();
		$("#NewCloStoServerType").append('<option class="option" value="0">Dropbox</option>');		
	}else if(gDvr.CloudeSGType == 2){
		$("#NewCloStoServerType").empty();		
		$("#NewCloStoServerType").append('<option class="option" value="1">Google Drive</option>');	
	}
	
	//CloudStorage总的:Disable Enable 
	$("#NewCloStoEnable").change(function(){		
		if( $(this).val() == 0 ){			
			$("#NewCloSto_divdisplay").css("display","none");
			$("#CloudCheck").prop("disabled",true);
		}else{			
			$("#NewCloSto_divdisplay").css("display","block");
			$("#CloudCheck").prop("disabled",false);
		}
	})
	
	//gotoUploadPhoto按钮  0:隐藏  1:显示 
	$("#NewCloStoSnapEnable").change(function(){		
		if( $(this).val() == 0 ){			
			$("#gotoUploadPhoto").css("display","none");
		}else{			
			$("#gotoUploadPhoto").css("display","block");
		}
	})
	
	
	//gotoUploadVideo按钮  0:隐藏  1:显示
	$("#NewCloStoVideoEnable").change(function(){		
		if( $(this).val() == 0 ){			
			$("#gotoUploadVideo").css("display","none");
		}else{			
			$("#gotoUploadVideo").css("display","block");
		}
	})
	
	//ServerType的值  0:Dropbox  1:GoogleDrive
	$("#NewCloStoServerType").change(function(){		
		if( $(this).val() == 0 ){  			
			$("#DropboxDiv").css("display","block");
			$("#GoogleDiv").css("display","none");
			
			$("#NewClo_ButtonDiv").css("display","block");  //显示下面两个按钮			
		}else{   		
			$("#DropboxDiv").css("display","none");
			$("#GoogleDiv").css("display","block");
			
			$("#NewClo_ButtonDiv").css("display","none");  //隐藏下面两个按钮
		}
	})
	
	$("#gotoUploadPhoto").click(function(){
		showConfigChild("Upload_Photo");  
	});
		
	$("#gotoUploadVideo").click(function(){
		showConfigChild("Upload_Video");  
	});
		
	$("#NewCloStoSV").click(function(){		
		var xml = "<a>";		
			xml += ("<Enable>" + ($("#NewCloStoEnable").val()*1) + "</Enable>");		
			xml += ("<ServerType>" + $("#NewCloStoServerType").val() + "</ServerType>");  //Dropbox  GoogleDrive
			xml += ("<DriveName>" + $("#NewCloStoDriveName").val() + "</DriveName>");
			
			xml += ("<SnapEnable>" + ($("#NewCloStoSnapEnable").val()*1) + "</SnapEnable>");  //Upload Photo			
			xml += ("<VideoEnable>" + ($("#NewCloStoVideoEnable").val()*1) + "</VideoEnable>");  //Upload Video
			xml += ("<RecvEmail>" + $("#NewCloStoRecvEmail").val() + "</RecvEmail>");  //Receiver Email
			
			xml += ("<Account>" + $("#NewCloStoAccount").val() + "</Account>");  //Gmail Account
			xml += ("<AccountPW>" + $(".NewCloStoAccountPW").val() + "</AccountPW>");  //Gmail Password	
		xml += "</a>";		
				
		RfParamCall(Call, $("#NewCloSto_Title").text(), "NewCloud", 300, "Set", xml);  //保存"无通道"数据		
	});
	
	function Call(xml){					
			$("#NewCloStoEnable").val(findNode("Enable", xml)*1 );
				$("#NewCloStoEnable").change();
				
			$("#NewCloStoServerType").val(findNode("ServerType", xml));  //Dropbox  GoogleDrive
				$("#NewCloStoServerType").change();
				
			$("#NewCloStoDriveName").val(findNode("DriveName", xml) );
			
			$("#NewCloStoSnapEnable").val(findNode("SnapEnable", xml)*1);  //Upload Photo
				$("#NewCloStoSnapEnable").change(); 
				
			$("#NewCloStoVideoEnable").val(findNode("VideoEnable", xml)*1);  //Upload Video
				$("#NewCloStoVideoEnable").change(); 
			
			$("#NewCloStoRecvEmail").val(findNode("RecvEmail", xml));  //Receiver Email
			$("#NewCloStoAccount").val(findNode("Account", xml));  //Gmail Account
			$(".NewCloStoAccountPW").val(findNode("AccountPW", xml));  //Gmail Password			
	}
	
	$("#NewCloStoRf").click(function(){		
		RfParamCall(Call, $("#NewCloSto_Title").text(), "NewCloud", 100, "Get");	//获取"所有"数据		
	});
	
	//按钮	
	$("#NewCloSto_Test_Email").click(function() {
		var xml = "<a>";
		xml += "<Key>321</Key>";
		xml += "</a>";
		
		$("#NewCloSto_Test_Email").prop("disabled",true);
		document.getElementById("NewCloSto_Test_Email").value = lg.get("IDS_ACTIVATING_CLOUDS");
		setTimeout(function(){
			var ActivateCloud = gDvr.RemoteTest(xml);
			if(-1 == ActivateCloud){
				$("#NewCloSto_Test_Email").prop("disabled",false);	
				document.getElementById("NewCloSto_Test_Email").value = lg.get("IDS_TEST_CLOUDEMAIL");
				ShowPaop($("#NewCloSto_Title").text(),lg.get("IDS_SEND_FAILED"));
			}else if(-2 == ActivateCloud){
				$("#NewCloSto_Test_Email").prop("disabled",false);
				document.getElementById("NewCloSto_Test_Email").value = lg.get("IDS_TEST_CLOUDEMAIL");
				ShowPaop($("#NewCloSto_Title").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			}
		},0);
	});
	
	//按钮
	$("#gotoCloud_email").click(function(){
		showConfigChild("Cloud_email");
	});	
	
	$("#CloudCheck").click(function(){   
		var xml="<a>";
		xml += "<Key>327</Key>";
		xml += "</a>";
		document.getElementById("CloudCheck").value = lg.get("IDS_CLOUD_CHECKING");
		$("#CloudCheck").prop("disabled",true); 
		var cloudcheck_ret =  gDvr.RemoteTest(xml);
		if(-1 == cloudcheck_ret){	
			ShowPaop($("#NormalCloSto_Title").text(),lg.get("IDS_SEND_FAILED"));
			$("#CloudCheck").prop("disabled",false);
		}else if(-2 == cloudcheck_ret){
			ShowPaop($("#NormalCloSto_Title").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			$("#CloudCheck").prop("disabled",false);
		}
		else{
			//if ($.browser.safari){
				return;
			//}
			//$("#DDNSTest").prop("disabled",false);
		}
		
	});
});