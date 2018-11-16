// JavaScript Document
$(document).ready(function(){	
	$("#btn_cloud_ok").unbind();
	$("#btn_cloud_ok2").unbind();
	$("#btn_cloud_cancle").unbind();
	
	MasklayerHide();
	if(g_bDefaultShow == true){
		$("#NormalCloStoDf").css("display","block");
	}else if(lgCls.version == "URMET"){
		$("#NormalCloStoDf").css("display","block");
	}
	var Channel = 0;  // 按位取对应通道标志
	
	var key0 = "";
	var secret0 = "";
	var key1 = "";
	var secret1 = "";	
	
	var color = "rgb(0, 102, 0)";
	$("#NormalCloStoChannelBox").divBox({number:gDvr.nChannel,bkColor:color});
	
	if(lgCls.version == "SECURITY"){
		$("#NormalCloSto_Tips1").css("display","block");
		$("#NormalCloSto_Tips2").css("display","block");
	}
	$("#NormalCloSto_Upgrade_div").css("display","block");//云升级
	
	//一进来，主动刷新页面
	$(function(){		
		RfParamCall(Call, $("#NormalCloSto_Title").text(), "NormalClo", 100, "Get");  	
	});	
	
	if(gDvr.CloudeSGType == 0){
		$("#NormalCloStoCloudType").empty();
		$("#NormalCloStoCloudType").append('<option class="option" value="0">Dropbox</option>');
		$("#NormalCloStoCloudType").append('<option class="option" value="1">Google Drive</option>');
	}else if(gDvr.CloudeSGType == 1){
		$("#NormalCloStoCloudType").empty();
		$("#NormalCloStoCloudType").append('<option class="option" value="0">Dropbox</option>');		
	}else if(gDvr.CloudeSGType == 2){
		$("#NormalCloStoCloudType").empty();		
		$("#NormalCloStoCloudType").append('<option class="option" value="1">Google Drive</option>');	
	}
	
	//NormalCloudStorage总的:Disable Enable 
	$("#NormalCloStoEnable").change(function(){		
		if ( $(this).val() == 0 ){			
			$("#NormalCloSto_divdisplay").css("display","none");
		}else{			
			$("#NormalCloSto_divdisplay").css("display","block");
		}
	})
	
	//CloudType的值  0:Dropbox  1:GoogleDrive 
	$("#NormalCloStoCloudType").change(function(){		
		if ( $(this).val() == 0 ){  		
			$("#NormalCloStokey").val(key0);
			$("#NormalCloStosecret").val(secret0);
		}else{  	
			$("#NormalCloStokey").val(key1);
			$("#NormalCloStosecret").val(secret1);
		}
	})
	
	$("#gotoNormalClo_StoFtp").click(function(){
		showConfigChild("NormalClo_StoFtp");  
	});
	
	$("#gotoNormalClo_StoEm").click(function(){
		showConfigChild("NormalClo_StoEm");  
	});
	
	//保存	
	$("#NormalCloStoSV").click(function(){		
		var xml = "<a>";		
			xml += ("<Enable>" + ($("#NormalCloStoEnable").val()) + "</Enable>");			
			xml += ("<CloudType>" + $("#NormalCloStoCloudType").val() + "</CloudType>");
			
				//获取值
				if( $("#NormalCloStoCloudType").val() == 0 ){
					key0 = $("#NormalCloStokey").val();
					secret0 = $("#NormalCloStosecret").val();
				}else{  
					key1 = $("#NormalCloStokey").val();
					secret1 = $("#NormalCloStosecret").val();
				}			
			xml += ("<key0>" + key0 + "</key0>");
			xml += ("<secret0>" + secret0 + "</secret0>");			
			xml += ("<key1>" + key1 + "</key1>");
			xml += ("<secret1>" + secret1 + "</secret1>");
			
			xml += ("<FTPPATH>" + $("#NormalCloStoFTPPATH").val() + "</FTPPATH>");
			
					//获取Channel的值(绿色格子的组合)  // 按位取对应通道标志位
					Channel = 0;
					var count = 0;
					$("#NormalCloStoChannelBox > div").each(function(i){
						if ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, "")){  //如果是绿色
							Channel |= (1<<i);  //保存所选择的组合
							count++;
						}
					});
					
					if(gDvr.hybirdDVRFlag){
						//混合DVR不做限制
					}else{
						if(count>4 && $("#NormalCloStoTimeTrigger").val()==0){  //1分钟时，如果超过4个绿格
							ShowPaop($("#NormalCloSto_Title").text(), lg.get("IDS_NUM_OUTRANGE"));
							return;
						}
					}
			xml += ("<Channel>" + Channel + "</Channel>");  //通道组合			
			
			xml += ("<TimeTrigger>" + ($("#NormalCloStoTimeTrigger").val()) + "</TimeTrigger>");  //TimeTrigger
			xml += ("<MotionEnable>" + ($("#NormalCloStoMotionEnable").val()) + "</MotionEnable>");  //Motion Detection
			xml += ("<DriveName>" + $("#NormalCloStoDriveName").val() + "</DriveName>");  //Drive Name			
		xml += "</a>";	
				
		RfParamCall(Call, $("#NormalCloSto_Title").text(), "NormalClo", 300, "Set", xml);  //保存"无通道"数据		
	});
	
	//刷新
	function Call(xml){
		$("#NormalCloStoEnable").val(findNode("Enable", xml));
			$("#NormalCloStoEnable").change();			
		$("#NormalCloStoCloudType").val(findNode("CloudType", xml));
		
		//赋值
		if( $("#NormalCloStoCloudType").val() == 0 ){  //Dropbox
			$("#NormalCloStokey").val(findNode("key0", xml) );
			$("#NormalCloStosecret").val(findNode("secret0", xml));
		}else{  //GoogleDrive
			$("#NormalCloStokey").val(findNode("key1", xml) );
			$("#NormalCloStosecret").val(findNode("secret1", xml));
		}
		
		//保存值
		key0 = findNode("key0", xml);
		secret0 = findNode("secret0", xml);
		key1 = findNode("key1", xml);
		secret1 = findNode("secret1", xml);
		
		$("#NormalCloStoFTPPATH").val(findNode("FTPPATH", xml));
		
		//Channel赋值
		Channel = findNode("Channel",xml);  //显示格子颜色
			$("#NormalCloStoChannelBox > div").css("background-color", "transparent");  //全部透明
			$("#NormalCloStoChannelBox > div").each(function(i){
				if ((Channel>>i)&1 == 1){
					$(this).css("background-color", color)
				}
			});
		$("#NormalCloStoTimeTrigger").val(findNode("TimeTrigger", xml) );
		$("#NormalCloStoMotionEnable").val(findNode("MotionEnable", xml));
		$("#NormalCloStoDriveName").val(findNode("DriveName", xml));	
	}
	
	$("#NormalCloStoRf").click(function(){		
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#NormalCloSto_Title").text(), "NormalClo", 100, "Get");	//获取"所有"数据		
	});
	
	$("#NormalCloStoDf").click(function(){		
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#NormalCloSto_Title").text(), "NormalClo", 850, "Get");	
	});
	
	//按钮	
	$("#NormalCloSto_Test_Email").click(function() {
		var xml = "<a>";
		xml += "<Key>321</Key>";
		xml += "</a>";
		
		$("#NormalCloSto_Test_Email").prop("disabled",true);
		document.getElementById("NormalCloSto_Test_Email").value = lg.get("IDS_ACTIVATING_CLOUDS");
		setTimeout(function(){
			var ActivateCloud = gDvr.RemoteTest(xml);			
			
			if(-1 == ActivateCloud){  
				$("#NormalCloSto_Test_Email").prop("disabled",false);	
				document.getElementById("NormalCloSto_Test_Email").value = lg.get("IDS_EMAILTEST");
				ShowPaop($("#NormalCloSto_Title").text(),lg.get("IDS_SEND_FAILED"));  
			}else if(-2 == ActivateCloud){  
				$("#NormalCloSto_Test_Email").prop("disabled",false);
				document.getElementById("NormalCloSto_Test_Email").value = lg.get("IDS_EMAILTEST");
				ShowPaop($("#NormalCloSto_Title").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			}
		},0);
	});
	
	//点击 云升级按钮，弹框，提问是否要检测(check)
	$("#NormalCloSto_Upgrade").click(function() {
		$("#cloud_prompt").css("display","block");
		
		$("#btn_cloud_ok").css("display","block");
		$("#btn_cloud_ok2").css("display","none");
		btn_cloud_cancle.value = "Cancle";
		$("#btn_cloud_cancle").css("display","block");
		
		$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_CHECK"));
		$("#cloud_input").val("");
		MasklayerShow();
	});
	
	//Yes 要检测(check)
	$("#btn_cloud_ok").click(function(){
		//BYTE ReqType;   /*请求主类型,0:云存储(默认).1:设备升级(扩展)*/
		//BYTE ReqSubType;/*请求子类型,0:云测试(默认).1:云存储升级检测.2:云存储升级*/
		//WORD ReqMsgSize;/*请求携带的数据大小*/
		
		//ReqType=1		云升级
		//ReqSubType=1		升级检测

		var xml = "<a>";
		xml += "<Key>337</Key>";
		xml += "<ReqType>1</ReqType>";
		xml += "<ReqSubType>1</ReqSubType>";
		xml += "</a>";
		
		$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_CHECKING"));//检测中
		$("#btn_cloud_ok").css("display","none");
		$("#btn_cloud_cancle").css("display","none");
		
		setTimeout(function(){
			//console.log("检测:" + xml);
			var UpgradeCloud = gDvr.RemoteTest(xml);
			
			if(-1 == UpgradeCloud){
				$("#NormalCloSto_Upgrade").prop("disabled",false);
				ShowPaop($("#NormalCloSto_Title").text(),lg.get("IDS_SEND_FAILED"));
			}else if(-2 == UpgradeCloud){
				$("#NormalCloSto_Upgrade").prop("disabled",false);
				ShowPaop($("#NormalCloSto_Title").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			}
		},0);
	})
	
	//NO 不检测(check) //NO 不升级
	$("#btn_cloud_cancle").click(function(){
		$("#cloud_prompt").css("display","none");
		MasklayerHide();
	})
	
	//检测结果 //升级结果
	function RemoteCloudCheck_CloudUpgrade(MainType,SubType,RetValue){
		//console.log("NormalClo_Sto.js  MainType:" + MainType + " SubType:" + SubType + " RetValue:" + RetValue);
		if(SubType==1){//检测结果
			if(RetValue==2){//有新版本，提示是否要升级
				$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_TOUP"));
				$("#btn_cloud_ok2").css("display","block");
				$("#btn_cloud_cancle").css("display","block");
			}else if(RetValue==3){//没有新版本，有一个确认按钮
				$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_NONEW"));
				btn_cloud_cancle.value = "OK";
				$("#btn_cloud_cancle").css("display","block");
			}else if(RetValue==4){//网络不通，有一个确认按钮
				$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_NETERR"));
				btn_cloud_cancle.value = "OK";
				$("#btn_cloud_cancle").css("display","block");
			}
		}else if(SubType==2){//升级结果
			if(RetValue==6){//升级成功，有一个确认按钮
				$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_UPSUCC"));
				btn_cloud_cancle.value = "OK";
				$("#btn_cloud_cancle").css("display","block");
			}else if(RetValue==7){//升级失败，有一个确认按钮
				$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_UPFAILED"));
				btn_cloud_cancle.value = "OK";
				$("#btn_cloud_cancle").css("display","block");
			}else if(RetValue==4){//网络不通，有一个确认按钮
				$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_NETERR"));
				btn_cloud_cancle.value = "OK";
				$("#btn_cloud_cancle").css("display","block");
			}
		}
	}
	
	//Yes 要升级
	$("#btn_cloud_ok2").click(function(){
		//BYTE ReqType;   /*请求主类型,0:云存储(默认).1:设备升级(扩展)*/
		//BYTE ReqSubType;/*请求子类型,0:云测试(默认).1:云存储升级检测.2:云存储升级*/
		//WORD ReqMsgSize;/*请求携带的数据大小*/
		
		//ReqType=1		云升级
		//ReqSubType=2	升级检测-->云升级

		var xml = "<a>";
		xml += "<Key>337</Key>";
		xml += "<ReqType>1</ReqType>";
		xml += "<ReqSubType>2</ReqSubType>";
		xml += "</a>";
		
		$("#cloud_title").children("em").prop("innerHTML",lg.get("IDS_CLOUD_UPGRADE_UPING"));//升级中
		$("#btn_cloud_ok2").css("display","none");
		$("#btn_cloud_cancle").css("display","none");
		
		setTimeout(function(){
			//console.log("升级:" + xml);
			var UpgradeCloud = gDvr.RemoteTest(xml);
			
			if(-1 == UpgradeCloud){  
				$("#NormalCloSto_Upgrade").prop("disabled",false);
				ShowPaop($("#NormalCloSto_Title").text(),lg.get("IDS_SEND_FAILED"));
			}else if(-2 == UpgradeCloud){  
				$("#NormalCloSto_Upgrade").prop("disabled",false);
				ShowPaop($("#NormalCloSto_Title").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			}
		},0);
	})
	
	RemoteCloudCheck_CloudUpgradeRet = RemoteCloudCheck_CloudUpgrade;
});

function RemoteCloudCheck_CloudUpgradeRet(MainType,SubType,RetValue){}