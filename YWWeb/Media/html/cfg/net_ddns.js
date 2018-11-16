// JavaScript Document
$(document).ready(function(){

	if(g_bDefaultShow == true){
			$("#DDNSDf").css("display","block");
	}
	//初始操作
	RfParamCall(Call, $("#ddns_config").text(), "NetDNS", 100, "Get");	//初始时获取页面数据
	
	function Call(xml){
			$("#DDNSUseDDNS").prop("checked", findNode("UseDDNS", xml)*1).val(findNode("UseDDNS", xml)*1);
			//$("#DDNSServerAddr").val(findNode("ServerAddr", xml)-3);  // 只显示通用DDNS
			$("#DDNSHostName").val(findNode("HostName", xml).replace(/&amp;/g,"&"));
			$("#DDNSUserName").val(findNode("UserName", xml).replace(/&amp;/g,"&"));
			$(".DDNSUserPW").val(findNode("UserPW", xml).replace(/&amp;/g,"&"));
			$("#DDNSServiceID").val(findNode("ServiceID",xml));
			var flag = findNode("DDNSUseFlag", xml);
			CheckDDnsBit(flag);
			var extendFlag = findNode("extendDDNS", xml);
			CheckDDnsBitEx(extendFlag);
			setTimeout(function(){
				$("#DDNSServerAddr").val(findNode("ServerAddr", xml));
				$("#DDNSServerAddr").change();
			},1)
			
			$("#DDNSTest").prop("disabled",1 - $("#DDNSUseDDNS").val());
			DivBox("#DDNSUseDDNS", "#DDNSDivBox");                                        
	}
	
	$("#DDNSServerAddr").change(function(){
		$("#DDNS_DISPLAY_GETID").css("display","none");
		if ($(this).val()*1 == 7){
			if(lgCls.version != "LOREX" && lgCls.version != "FLIR"){
				$("#DDNS_DISPLAY").css("display","block");
			}
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","block");
			$("#TABLE_SERVICEID").css("display","none");
			$("#DDNSHostName").css("width", "293px");
			$("#HOST_NAME_TEXT").prop("innerText", "");
		}else if ($(this).val()*1 == 8){
			if(lgCls.version != "LOREX" && lgCls.version != "FLIR"){
				$("#DDNS_DISPLAY").css("display","block");
			}
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","block");
			$("#TABLE_SERVICEID").css("display","none");
			$("#DDNSHostName").css("width", "150px");
			$("#HOST_NAME_TEXT").prop("innerText", " .lorexddns.net");
		}else if($(this).val()*1 == 17){
			if(lgCls.version != "LOREX"){
				$("#DDNS_DISPLAY").css("display","block");
			}
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","block");
			$("#TABLE_SERVICEID").css("display","none");
			$("#DDNSHostName").css("width", "150px");
			$("#HOST_NAME_TEXT").prop("innerText", " .swanndvr.net");
		}else if($(this).val()*1 == 18){
			if(lgCls.version != "LOREX" && lgCls.version != "FLIR"){
				$("#DDNS_DISPLAY").css("display","none");
			}
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","none");
			$("#TABLE_SERVICEID").css("display","block");
			$("#DDNSHostName").css("width", "293px");
			$("#HOST_NAME_TEXT").prop("innerText", "");
		}else if($(this).val()*1 == 21){
			if(lgCls.version != "LOREX" && lgCls.version != "FLIR"){
				$("#DDNS_DISPLAY").css("display","block");
			}
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","block");
			$("#TABLE_SERVICEID").css("display","none");
			$("#DDNSHostName").css("width", "150px");
			$("#HOST_NAME_TEXT").prop("innerText", " .lookddns.com");
		}else if($(this).val()*1 == 22){
			if(lgCls.version != "LOREX" && lgCls.version != "FLIR"){
				$("#DDNS_DISPLAY").css("display","block");
			}
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","block");
			$("#TABLE_SERVICEID").css("display","none");
			$("#DDNSHostName").css("width", "150px");
			$("#HOST_NAME_TEXT").prop("innerText", " .myddns-flir.com");
		}else if($(this).val()*1 == 23){
			if(lgCls.version != "LOREX" && lgCls.version != "FLIR"){
				$("#DDNS_DISPLAY").css("display","none");
			}
			$("#DDNS_DISPLAY_GETID").css("display","block");
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","none");
			$("#TABLE_SERVICEID").css("display","block");
			$("#DDNSHostName").css("width", "293px");
			$("#HOST_NAME_TEXT").prop("innerText", "");
		}else if($(this).val()*1 == 31){
			if(lgCls.version != "LOREX" && lgCls.version != "FLIR"){
				$("#DDNS_DISPLAY").css("display","none");
			}
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","none");
			$("#TABLE_SERVICEID").css("display","block");
			$("#DDNSHostName").css("width", "293px");
			$("#HOST_NAME_TEXT").prop("innerText", "");
		}else{
			if(lgCls.version != "LOREX" && lgCls.version != "FLIR"){
				$("#DDNS_DISPLAY").css("display","block");
			}
			$("#TABLE_HOSTNAME,#TABLE_USERNAME,#TABLE_PASSWORD").css("display","block");
			$("#TABLE_SERVICEID").css("display","none");
			$("#DDNSHostName").css("width", "293px");
			$("#HOST_NAME_TEXT").prop("innerText", "");
		}
	})
	
	$("#DDNSRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#ddns_config").text(), "NetDNS", 100, "Get");	//刷新页面数据
	});
	
	$("#DDNSDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#ddns_config").text(), "NetDNS", 850, "Get");	//刷新页面数据
	});
	
	$("#DDNSSave").click(function(){
		var xml = "<a>";
		xml += ("<UseDDNS>" + ($("#DDNSUseDDNS").val()*1) + "</UseDDNS>");
		//xml += ("<ServerAddr>" + ($("#DDNSServerAddr").val()+3) + "</ServerAddr>");
		xml += ("<ServerAddr>" + ($("#DDNSServerAddr").val()) + "</ServerAddr>");
		xml += ("<HostName>" + $("#DDNSHostName").val() + "</HostName>");
		xml += ("<UserName>" + ($("#DDNSUserName").val()) + "</UserName>");
		xml += ("<UserPW>" + $(".DDNSUserPW").val() + "</UserPW>");
		xml += ("<ServiceID>" + $("#DDNSServiceID").val() + "</ServiceID>");
		xml += "</a>";
		RfParamCall(Call, $("#ddns_config").text(), "NetDNS", 300, "Set", xml);	//保存
	});
	
	$("#DDNSTest").click(function(){   
		if($("#DDNSHostName").val() == ""){
			ShowPaop($("#ddns_config").text(),lg.get("IDS_HOSTNAME_EMPTY"));
			return;
		}
		if($("#DDNSUserName").val() == ""){
			ShowPaop($("#ddns_config").text(),lg.get("IDS_USERNAME_EMPTY"));
			return;
		}
		if($(".DDNSUserPW").val() == ""){
			ShowPaop($("#ddns_config").text(),lg.get("IDS_PASSWORD_EMPTY"));
			return;
		}	
		var xml="<a>";
		xml += "<Key>302</Key>";
		xml += ("<ServerAddr>" + ($("#DDNSServerAddr").val()) + "</ServerAddr>");
		var tempHostName = $("#DDNSHostName").val();
		if($("#DDNSServerAddr").val()*1 == 8){//LOREXDDNS
			tempHostName += ".lorexddns.net";
		}else if($("#DDNSServerAddr").val()*1 == 17){//SWANNDVR
			tempHostName += ".swanndvr.net";
		}else if($("#DDNSServerAddr").val()*1 == 21){
			tempHostName += ".lookddns.com";
		}else if($("#DDNSServerAddr").val()*1 == 22){
			tempHostName += ".myddns-flir.com";
		}else if($("#DDNSServerAddr").val()*1 == 7){
			//tempHostName += ".nightowldvr.com";
		}
		xml += ("<HostName>" + tempHostName + "</HostName>");
		xml += ("<UserName>" + ($("#DDNSUserName").val()) + "</UserName>");
		xml += ("<UserPW>" + ($(".DDNSUserPW").val()) + "</UserPW>");
		xml += "</a>";
		document.getElementById("DDNSTest").value = lg.get("IDS_EMAILTESTING");
		$("#DDNSTest").prop("disabled",true); 
		var ddns_ret =  gDvr.RemoteTest(xml);
		
		if(gDvr.hybirdDVRFlag==1){
			gVar.var_DDNSTest_isTimeOut = false;
			fnDDNSTest_TimeOut();
		}
		
		if(-1 == ddns_ret){	
			ShowPaop($("#ddns_config").text(),lg.get("IDS_SEND_FAILED"));
			$("#DDNSTest").prop("disabled",false);
		}else if(-2 == ddns_ret){
			ShowPaop($("#ddns_config").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			$("#DDNSTest").prop("disabled",false);
		}
		else{
			//if ($.browser.safari){
				return;
			//}
			//$("#DDNSTest").prop("disabled",false);
		}
		
	});
	
	$("#DDNSGetID").click(function(){
		MasklayerShow()
		var xml="<a>";
		xml += "<Key>403</Key>";
		xml += "</a>";
		$("#DDNSGetID").prop("disabled",true);
		var ddns_ret =  gDvr.RemoteTest(xml);
	});
	
	//界面处理
	$("#DDNSUseDDNS").click(function(){
		$(this).prop("checked", $(this).val());
		$("#DDNSTest").prop("disabled",1 - $(this).val());
		DivBox("#DDNSUseDDNS", "#DDNSDivBox");
	});
	
	//ddns process
	var DDNSarray;
	if(gDvr.DevType == 3){
		DDNSarray = ["MYQ_SEE","LTSCCTV","SystemPort","DDNS_3322","DYNDNS","EASTERNDNS","NEWDDNS","NIGHT OWL","LOREXDDNS","SMARTCONTROLDNS","KGUARD_ORG","ZSH","NO-IP","FREEDNS","CHANGEIP","DNSEXIT","ddns.com.br","SWANNDVR","anlian.co","Hi-View","BOLIDEDDNS","LOOKDDNS","FLIR","URMETDDNS","PROTECTRON","copbr.ddns","winco.ddns","iu-eye","anguatech.ddns","2DVR","PDVR.CO","DVRDDNS","ONEDVR","INOXDVR" , "CAMKEEPER","SIS DDNS","IMAGEVOX-DDNS","LEGRAND","EYE-GTC.CO","EURODDNS"];
	}else{
		DDNSarray = ["MYQSEE","LTSCCTV","SYSTEMPORT","DDNS_3322","DYNDNS",
					"EASTERNDNS","NEWDDNS","NIGHTOWL","LOREXDDNS","SMARTCONTROLDNS",
					"KGUARD_ORG","ZSH","NO_IP","FREEDNS","CHANGEIP",
					"DNSEXIT","GREATEKDDNS","SWANNDVR","ANLIAN","HI_VIEW",
					"BOLIDEDDNS","LOOKMAN","FLIRDDNS","URMETDDNS","PROTECTRONDDNS",
					"COPBR","WINCO","IUEYE","WINCO2","SKYDDNS",
					"PDVRDDNS","DVRDDNS",
					"ONEDVR","INOXDVR","CAMKEEPER","SIS DDNS","IMAGEVOX-DDNS",
					"LEGRAND","EYE-GTC.CO","EURODDNS"];
	}
	
	function CheckDDnsBit(bit){
		$("#DDNSServerAddr").empty();
		for(var i=0;i<32;++i){
			if(bit>>i & 0x01){
				$("#DDNSServerAddr").append('<option class="option" value="'+i+'">'+DDNSarray[i]+'</option>');
			}
		}
	}	
	
	function CheckDDnsBitEx(bit){
		//$("#DDNSServerAddr").empty();
		for(var i=32;i<DDNSarray.length;++i){
			if((bit>>(i - 32)) & 0x01){
				$("#DDNSServerAddr").append('<option class="option" value="'+i+'">'+DDNSarray[i]+'</option>');
			}
		}
	}	
});