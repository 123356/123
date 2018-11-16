// JavaScript Document
$(document).ready(function(){ 

	if(lgCls.version == "KGUARD"){
		document.getElementById("camera_mode").innerHTML = lg.get("IDS_BASE_FLICKER");
		$("#INFORBASE_P2PSet").css("display","block");
		$("#Info_P2PSet").html("NVR ID");
	}
	switch(lgCls.version){
		case "FLIR":
			$("#INFORBASE_MobilePort").css("display","none");
			$("#INFORBASE_DevName").css("display","none");
			$("#INFORBASE_DevID").css("display","none");
			$("#INFORBASE_HDDVer").css("display","none");
			break;
		case "LOREX":{
			$("#INFORBASE_DevName").css("display","none");
			$("#INFORBASE_DevID").css("display","none");
			$("#INFORBASE_HDDVer").css("display","none");
			if(gDvr.FtpPageFlag == 1){
				$("#INFORBASE_MobilePort").css("display","none");
				$("#INFORBASE_DevID").css("display","block");
			}
			break;
		}
		default:{

			$("#INFORBASE_IPAdd").css("display","block");
			$("#INFORBASE_DDNSName").css("display","none");
			$("#INFORBASE_HDDCap").css("display","block");
			$("#INFORBASE_VIDEOMODE").css("display","block");
			$("#INFORBASE_ClientPort").css("display","block");
			$("#INFORBASE_WebPort").css("display","block");
			$("#INFORBASE_MobilePort").css("display","none");
			break;
		}		
	}
	var DayArray=lg.get("IDS_WEEK_ARRAY").split(",");
	RfParamCall(Call, $("#sf_base_config").text(), "SysBase", 100, "Get");	//初始时获取页面数据	
	function Call(xml){
		
		$("#SysInfBasePV").val(findNode("IEVer",xml));
		$("#SysInfBaseType").val(findNode("DeviceType", xml));
		$("#SysInfBaseDevName").val(findNode("DeviceName",xml));
		if(gDvr.FtpPageFlag == 1 && lgCls.version == "LOREX"){
			$("#SysInfBaseDevID").val(findNode("P2pKeyID",xml));
		}else{
			$("#SysInfBaseDevID").val(findNode("DeviceID",xml));
		}
		$("#SysInfBaseHDDVer").val(findNode("HardwareVer",xml));
		//$("#SysInfBaseType").val(findNode("DeviceType", xml));
		//$("#SysInfBaseID").val(findNode("DeviceID", xml));
		$("#SysInfBaseMAC").val(findNode("MacAddr", xml));
		$("#SysInfBaseSV").val(findNode("SoftwareVer", xml));
		//$("#SysInfBaseHV").val(findNode("HardwareVer", xml));
		
		
		var str = findNode("HddStatus", xml);
		if(str == "") { str = lg.get("IDS_NOHDD");}
		$("#SBHddStatus").val(str);
		
		str = findNode("DdnsHostStatus", xml);
		if(str == "") {str = lg.get("IDS_DDNSCLOSED");}
		$("#DdnsHostStatus").val(str);
		
		
		$("#NetClientPort").val(findNode("Port", xml));
		$("#SBWebPort").val(findNode("WebPort", xml));
		$("#SBMobilePort").val(findNode("MobilePort", xml))
		$("#sysInfIP").val(findNode("IPAddr", xml))
		str = findNode("P2pUID", xml);
		if((str.length <= 39) && (str.length > 0)){
			$("#INFORBASE_P2PSet").css("display", "block");
			$("#P2pUIDInput").val(findNode("P2pUID",xml));
			if(lgCls.version != "OWL"){//OWL 不显示二维码
				$("#QRCode").css("display", "block");
				p2pQRCode.innerHTML = "";//清空容器，避免多次绘制越界
				if ($.browser.safari || $.browser.chrome){
					jQuery('#p2pQRCode').qrcode({width:200,height:200,correctLevel:0,typeNumber:5,render:"canvas",text:str});
				}else{
					jQuery('#p2pQRCode').qrcode({width:200,height:200,correctLevel:0,typeNumber:5,render:"table",text:str});
				}
			}
		}else{
			$("#INFORBASE_P2PSet").css("display", "none");
			$("#QRCode").css("display", "none");
		}
		
		if(lgCls.version == "KGUARD"){
			if (findNode("TvSystem", xml)*1 == 0){
				$("#SysInfBaseTV").val("50HZ");
			}else{
				$("#SysInfBaseTV").val("60HZ");
			}		
		}else{
			if (findNode("TvSystem", xml)*1 == 0){
				$("#SysInfBaseTV").val("PAL");
			}else{
				$("#SysInfBaseTV").val("NTSC");
			}	
		}
		//sysbase_settime('sys_base_h_6','sys_base_m_6',findNode("time",xml));
		//$("#SysInfautomaintain").prop("checked", findNode("automaintain", xml)=='0'?false:true);

		//$("#SysInfmaintainperiod1").val(findNode("maintainperiod1", xml));
		//$("#SysInfmaintainperiod2").attr("name", findNode("maintainperiod2", xml));
		//$("#SysInfmaintainperiod1").change();
		
		//DivBox("#SysInfautomaintain", "#SysInfDivBox");
	}
	
	/*$("#SysInfmaintainperiod1").change(function(){
		if ($("#SysInfmaintainperiod1").val() == 1){
			$("#SysInfmaintainperiod2").empty();		
			for (var i=0; i<6; i++){
				$("#SysInfmaintainperiod2").append('<option class="option" value="'+i+'">'+DayArray[i+1]+'</option>');
			}
			$("#SysInfmaintainperiod2").append('<option class="option" value="'+6+'">'+DayArray[0]+'</option>');
			$("#SysInfmaintainperiod2").css("display", "");
		}else if ($("#SysInfmaintainperiod1").val() == 2){
			$("#SysInfmaintainperiod2").empty();
			for (var i=7; i<38; i++){
				$("#SysInfmaintainperiod2").append('<option class="option" value="'+i+'">'+(i-6)+lg.get("IDS_DAY")+'</option>');
			}
			$("#SysInfmaintainperiod2").css("display", "");
		}else {
			$("#SysInfmaintainperiod2").css("display", "none");
		}
		$("#SysInfmaintainperiod2").val($("#SysInfmaintainperiod2").attr("name"));
	});*/
	
	$("#SysInfBaseRf").click(function(){
		RfParamCall(Call, $("#sf_base_config").text(), "SysBase", 100, "Get");	//刷新页面数据
	});
	
});
