// JavaScript Document
$(document).ready(function(){
	var szIP = "";
	var sPOEIP = "";
	var status = 0;
	var strMode = 0;
	var TimerID = 0;
	var timecount = 0;
	var bHave3G = false;
	if(g_bDefaultShow == true)
	{
		$("#NBDf").css("display","block");
	}
	var BandwidtArr = ["128k","192k","256k","384k","512k","784k","1024k","2048k"];
	for(var i=0; i<BandwidtArr.length; i++){
		$("#NBbandwidth").append('<option class="option" value="'+i+'">' + BandwidtArr[i] + '</option>');
	}
	
	if(gDvr.bVideoActivate && gVar.nStreamType == 1){
		$("#net_bandwidth").css("display","block");
	}
	if( gDvr.DevType == 4)
	{
		$("#NBNetworkMode option[value='1']").remove();
	}
	
	if(gDvr.hybirdDVRFlag == 1){
		$("#NBDialCode").attr("maxlength","32");
		if(lgCls.version == "URMET"){
			$("#net_encryption").css("display","block");
		}
	}
	 /*
	 if(lgCls.version == "KGUARD" && lg.get("IDS_NET_UPNP") == "Auto Port Forwarding(UPNP)"){
	 	$("#pnp").css("width","170px");
		$("#pnp").css("border-right","none");
		$("#NBUseUPNP").css("margin-left","43px");
	 }
	 */
	 
	switch(lgCls.version){
		case "FLIR":
		case "LOREX":{
			$("#NBPort,#NBWebPort").prop("readonly",true).fadeTo("fast", 0.5);
			$("#net_MobilePort").css("display","none");
			$("#NBNetworkMode option[value='1']").remove();
			break;
		}
		case "SWANN":{
				$("#net_MobilePort").css("display","block");
			break;
		}
		/*case "URMET":*/
		case "ELKRON":{
			$("#net_encryption").css("display","block");
			break;
		}
		case "HONEYWELL":{
			$("#net_IpKBPort").css("display","block");
			break;
		}
		default:{
			if(gDvr.DevType == 3 || gDvr.DevType == 4)
			{
				$("#net_MobilePort").css("display","none");
			}
			else
			{
			  $("#net_MobilePort").css("display","none");
			}
			$("#net_IpKBPort").css("display","none");
			break;
		}
	}
	
	if(gDvr.HidePhonePage){
		if(lgCls.version != "FLIR" && gDvr.FtpPageFlag != 1/* && lgCls.version != "KGUARD"*/){
			$("#net_MobilePort").css("display","none");
		}
	}
	if(gDvr.c3GFlagSwitch == 1){
		if(gDvr.c3GFlag == 1){
			bHave3G = true;
		}else{
			bHave3G = false;
		}
	}
	if(gDvr.DevType == 3){
		bHave3G = false;
	}
	if(bHave3G){
		$("#NBNetworkMode").append('<option class="option" value="3">' + lg.get("IDS_NET_MODE04") + '</option>');
	}
	$("#NBNetworkMode").change(function(){
			if($(this).val()==1){
				$("#pppoeName").css("display","block");
				$(".PPPOEpw").css("display","block");
				$("#net_mediaport").css("display","block");
				$("#net_webport").css("display","block");
				$("#net_mask").css("display","block");
				$("#net_gateway").css("display","block");
				$("#NBipAddress,#NBNetMask,#NBGateWay").prop("disabled",true).fadeTo("fast", 0.5);
				$("#NBdns1").prop("disabled",false).fadeTo("fast", 1);
				$("#net_Apn").css("display","none");
				$("#net_DialCode").css("display","none");
				$("#net_WirelessUser").css("display","none");
				$("#net_WirelessPwd").css("display","none");
				if(bHuaweiPlat){
					if(timecount != 0)
						$("#net_pppoe_tipshow").css("display","block");
			
					if(strMode == 1){	
				  		if(status == 0){
					  		$("#NBipAddress").val(lg.get("IDS_PPPOE_DIALSTATUS"));
				  		}else if(status == 1){
					  		$("#NBipAddress").val(sPOEIP);
				  		}else if(status == 2){
					  		$("#NBipAddress").val(lg.get("IDS_PPPOE_DIAL"));
				  		}
					}
				}
			}else if($(this).val()==3){
				$("#net_mediaport").css("display","none");
				$("#net_webport").css("display","none");
				$("#pppoeName").css("display","none");
				$(".PPPOEpw").css("display","none");
				$("#net_mask").css("display","none");
				$("#net_gateway").css("display","none");
				$("#net_Apn").css("display","block");
				$("#net_DialCode").css("display","block");
				$("#net_WirelessUser").css("display","block");
				$("#net_WirelessPwd").css("display","block");
				$("#NBipAddress").prop("disabled",true).fadeTo("fast", 0.5);
				$("#NBdns1").prop("disabled",false).fadeTo("fast", 0.5);
				if(bHuaweiPlat){
					$("#NBipAddress").val(szIP);
					$("#net_pppoe_tipshow").css("display","none");
				}
			}else{
				$("#net_mediaport").css("display","block");
				$("#net_webport").css("display","block");
				$("#net_mask").css("display","block");
				$("#net_gateway").css("display","block");
				$("#pppoeName").css("display","none");
				$(".PPPOEpw").css("display","none");
				$("#net_Apn").css("display","none");
				$("#net_DialCode").css("display","none");
				$("#net_WirelessUser").css("display","none");
				$("#net_WirelessPwd").css("display","none");
				if(bHuaweiPlat){
					$("#NBipAddress").val(szIP);
					$("#net_pppoe_tipshow").css("display","none");
				}
				if(0==$(this).val()){
					//$("#nbe_show_hide").hide("normal");
					$("#NBipAddress,#NBNetMask,#NBGateWay,#NBdns1").prop("disabled",true).fadeTo("fast", 0.5);
				//DivBox(0, "#nbe_show_hide");
				}
				else if(2==$(this).val()){
					//$("#nbe_show_hide").show("normal");
					$("#NBipAddress,#NBNetMask,#NBGateWay,#NBdns1").prop("disabled",false).fadeTo("fast", 1);
				}
			}
	});
	
	$(function(){
		RfParamCall(Call, $("#nbe_base_config").text(), "NetBase", 100, "Get");	//初始时获取页面数据
	});
	
	function Call(xml){
			$("#NBNetMask").val(findNode("NetMask", xml));
			$("#NBGateWay").val(findNode("GateWay", xml));
			$("#NBdns1").val(findNode("dns1", xml));
			$("#NBdns2").val(findNode("dns2", xml));
			$("#NBPort").val(findNode("Port", xml));
			$("#NBWebPort").val(findNode("WebPort", xml));
			$("#NBMobilePort_base").val(findNode("MobilePort",xml));
			$("#NBNetworkMode").val(findNode("NetworkMode", xml)*1);
			$("#NBUseUPNP").val(findNode("UseUPNP", xml)*1);
			$("#NBUseEncryption").val(findNode("EncodeFlag",xml)*1);
			$("#PPPOEuser").val(findNode("PPPOEuser", xml));
			$(".PPPOEpw").val(findNode("Password", xml));
			if(bHuaweiPlat){
				sPOEIP = findNode("PPPOEIP", xml);
				szIP = findNode("IPAddr", xml);
            			status = findNode("PPPSTATUS", xml)*1;
            			strMode = findNode("NetworkMode", xml)*1;
			}else{
				$("#NBipAddress").val(findNode("IPAddr", xml));
			}
           
			//3G网络
			$("#NBApn").val(findNode("Apn", xml));
			$("#NBDialCode").val(findNode("DialCode", xml));
			$("#NBWirelessUser").val(findNode("WirelessUser", xml));
			$(".NBWirelessPwd").val(findNode("WirelessPwd", xml));
			
		    $("#NBbandwidth").val(findNode("BandWidth",xml)*1);
			$("#NBNetworkMode").change();
			if(lgCls.version == "LOREX" || lgCls.version == "FLIR")
			{
				$("#NBNetMask").val(LorexIPFormat(findNode("NetMask", xml)));
				$("#NBGateWay").val(LorexIPFormat(findNode("GateWay", xml)));
				$("#NBdns1").val(LorexIPFormat(findNode("dns1", xml)));
				$("#NBdns2").val(LorexIPFormat(findNode("dns2", xml)));
				$("#NBipAddress").val(LorexIPFormat(findNode("IPAddr", xml)));
				$("#NBPort").val(LorexPortFormat(findNode("Port", xml)));
				$("#NBWebPort").val(LorexPortFormat(findNode("WebPort", xml)));
			}
			if(lgCls.version == "HONEYWELL"){
				$("#NBIpKBPort").val(findNode("IpKBPort", xml));
			}
	}
	
	function NBSaveSel(){
		var xml = "<a>";
		strMode = $("#NBNetworkMode").val();
		if($("#NBNetworkMode").val()==1){
			xml += ("<PPPOEuser>" + ($("#PPPOEuser").val()) + "</PPPOEuser>");
			xml += ("<Password>" + ($(".PPPOEpw").val()) + "</Password>");	
		}
		else
		{
			szIP = $("#NBipAddress").val();
		}
		if(bHuaweiPlat){
		xml += ("<IPAddr>" + szIP + "</IPAddr>");
		}else{
			xml += ("<IPAddr>" + $("#NBipAddress").val() + "</IPAddr>");
		}
		xml += ("<NetMask>" + $("#NBNetMask").val() + "</NetMask>");
		xml += ("<GateWay>" + $("#NBGateWay").val() + "</GateWay>");
		xml += ("<dns1>" + $("#NBdns1").val() + "</dns1>");
		xml += ("<dns2>" + $("#NBdns2").val() + "</dns2>");
		xml += ("<Port>" + $("#NBPort").val() + "</Port>");
		xml += ("<WebPort>" + $("#NBWebPort").val() + "</WebPort>");
		xml += ("<NetworkMode>" + $("#NBNetworkMode").val() + "</NetworkMode>");
		xml += ("<UseUPNP>" + $("#NBUseUPNP").val() + "</UseUPNP>");
		xml += ("<MobilePort>" + $("#NBMobilePort_base").val() + "</MobilePort>");
		
		//3G网络
		xml += ("<Apn>" + $("#NBApn").val() + "</Apn>");
		xml += ("<DialCode>" + $("#NBDialCode").val() + "</DialCode>");
		xml += ("<WirelessUser>" + $("#NBWirelessUser").val() + "</WirelessUser>");
		xml += ("<WirelessPwd>" + $(".NBWirelessPwd").val() + "</WirelessPwd>");
		
		//加密
		xml += ("<EncodeFlag>" + $("#NBUseEncryption").val() + "</EncodeFlag>");
		xml += ("<BandWidth>" + $("#NBbandwidth").val() + "</BandWidth>");
		
		xml += ("<IpKBPort>" + $("#NBIpKBPort").val() + "</IpKBPort>");
		xml += "</a>";	
		return xml;
	}
	
	$("#NBSV").click(function(){
	    
		//判断ip
		var ipRegEx = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/;
		if(bHuaweiPlat){
			if($("#NBNetworkMode").val()==1)
			{
				$("#NBipAddress").val(szIP);
			}
		}
		if( !(ipRegEx.test($("#NBipAddress").val()) && ipRegEx.test($("#NBNetMask").val()) && ipRegEx.test($("#NBGateWay").val()) && ipRegEx.test($("#NBdns1").val()) && ipRegEx.test($("#NBdns2").val())) )
		{
			ShowPaop($("#nbe_base_config").text(),lg.get("IDS_IP_FORMAT"));
			return(false);
		}
		
		if($("#NBPort").val() == $("#NBWebPort").val()){
			ShowPaop($("#nbe_base_config").text(),lg.get("IDS_DIFF_PORT"));
			return;
		}
		if(lgCls.version == "HONEYWELL")
		{
			if($("#NBPort").val() == $("#NBIpKBPort").val()){
				ShowPaop($("#nbe_base_config").text(),lg.get("IDS_DIFF_PORT1"));
				return;
			}
			if($("#NBWebPort").val() == $("#NBIpKBPort").val()){
				ShowPaop($("#nbe_base_config").text(),lg.get("IDS_DIFF_PORT2"));
				return;
			}
		}

		NBSaveSel();
		if(bHuaweiPlat){
	    	if($("#NBNetworkMode").val()==1){
				timecount = 13;
			    $("#NBipAddress").val(lg.get("IDS_PPPOE_DIALSTATUS"));
				$("#net_pppoe_tipshow").css("display","block");
				$("#NBSV").prop("disabled",true);
				TimerID = setInterval(RefreshTime,1000);  
	    	}
		}
		RfParamCall(Call, $("#nbe_base_config").text(), "NetBase", 300, "Set", NBSaveSel());	//保存
	});
	
	$("#NBRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#nbe_base_config").text(), "NetBase", 100, "Get");
	});
	
	$("#NBDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#nbe_base_config").text(), "NetBase", 850, "Get");
	});
    
	function RefreshTime()
	{
	  $("#net_pppoe_tip").val(lg.get("IDS_PPPOE_TIPSHOW")+timecount+lg.get("IDS_SECOND")+"  "+lg.get("IDS_REFRESH"));
	  if(timecount == 0)
	  {
		  $("#NBSV").prop("disabled",false);
		  $("#net_pppoe_tip").val(lg.get("IDS_PPPOE_TIPSHOW01"));
		  clearInterval(TimerID); 
		  timecount = 1;
	  }
	  timecount--;
	}
	function LorexIPFormat(str)
	{
		var temparr = new Array;
		for(var i=0;i<4;i++)
		{
			temparr[i] = str.split(".")[i];
			if(str.split(".")[i]*1 < 10){
				temparr[i] = "00" + temparr[i];
			}else if(str.split(".")[i]*1 < 100){
				temparr[i] = "0" + temparr[i];
			}
		}
		return temparr[0] +"." + temparr[1] + "."+ temparr[2] + "."+ temparr[3];
	}
	function LorexPortFormat(str)
	{
		if(str*1 < 10){
			str = "0000" + str;
		}else if(str*1 < 100){
			str = "000" + str;
		}else if(str*1 < 1000){
			str = "00" + str;
		}else if(str*1 < 10000){
			str = "0" + str;
		}
		return str;
	}

});