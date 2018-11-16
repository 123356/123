// JavaScript Document
var upper = 0;
$(document).ready(function(){
	if(lgCls.version == "OWL"){
		$("#NVR_pre_OSD").css("display","block");
	}
	
	if(gDvr.hybirdDVRFlag==1){
		$("#NVR_pre_OSD").css("display","block");
		$("#NVROSd_RecTimeFlag_div").css("display","block");
	}
	
	if(lgCls.version == "OWL" || lgCls.version == "URMET" || lgCls.version == "HONEYWELL" || gDvr.hybirdDVRFlag==1){
		$("#NVR_ChnOSDCP").css("display","block");
	}
	
	
	if(g_bDefaultShow == true){
		$("#ChnOSDDf").css("display","block");
	}
	if(gDvr.nChannel==1)
	{
		$("#NVR_OSD_CHN_TABLE").css("display","none");
	}
	var com = 4;
	
    //Copy按钮
	$("#NVR_ChnOSDCP").click(function(){
		$("#NVR_osdck").prop("checked",false);
		if(gDvr.hybirdDVRFlag==1){
			copyTD("#NVR_osdCopyTD","osd_ch","NVR_osd_TDNum",gDvr.AnalogChNum);
		}else{
			copyTD("#NVR_osdCopyTD","osd_ch","NVR_osd_TDNum");
			$.each($("input[id^='osd_ch']"),function(){
				var thisId = $(this).attr("id");//osd_ch1
				var index = thisId.split("osd_ch")[1]*1 - 1;//0
				if((IpcAbility[index].State != 2) || (((IpcAbility[index].Abilities>>3) & 1) == 0)){
					$(this).prop("disabled",true);
				}
			})
		}
	})
	
	
	//全选
	$("#NVR_osdck").click(function(){
		$.each($("input[id^='osd_ch']"),function(){
			var thisId = $(this).attr("id");//osd_ch1
			var index = thisId.split("osd_ch")[1]*1 - 1;//0
			//DevChnInfo.CurChnState && DevChnInfo.Abilities
			if((IpcAbility[index].State == 2) && (((IpcAbility[index].Abilities>>3) & 1) == 1)){
				$(this).prop("checked",$("#NVR_osdck").prop("checked"));
			}
		})
	})
	
	if(gDvr.DevType == 3 || gDvr.DevType == 4)
	{
		$("#NVR_chn_show_time").css("display","block");
		$("#NVR_chn_show_name").css("display","block");
		//$("#NVR_chn_date_format").css("display","block");
		//$("#NVR_chn_time_format").css("display","block");
	}
	
	if(gDvr.DevType == 3 || gDvr.DevType == 4) 
	{
		$("#NVR_chn_flicker_ctrl").css("display","none");		
	}
	
	/*
	if(lgCls.version != "HONEYWELL"){
		$("#NVR_chn_date_format").css("display","block");	
		$("#NVR_chn_time_format").css("display","block");
		//gDvr.HideObj(2);	
		$("#Vidoeposition").css("display","block");
	}
	*/
	
	$("#NVR_osdOk").click(function(){
		var osdCopyXml="";
		$("#NVR_osdCopyTD").css("display","none");	
		var spTdValue="";
		$.each($("input[id^='osd_ch']"),function(){
			if($(this).prop("checked"))
				spTdValue+=$(this).prop('value')+",";
		})
		if(spTdValue!=""){
			spTdValue=spTdValue.substring(0,spTdValue.length-1);
			var spArr=spTdValue.split(',');
			var copychid = 0;
			for(var i=0;i<spArr.length;i++){
				copychid |= 0x01<< spArr[i];
			}
			//console.log("CopyChid:"+copychid);
			osdCopyXml = "<a>";
			osdCopyXml += ("<CopyChid>" + copychid + "</CopyChid>");
			osdCopyXml += ("<ShowChnNameFlag>" + ($("#NVR_ChnOSDShowName").val()*1) + "</ShowChnNameFlag>");
			osdCopyXml += ("<ShowDateTimeFlag>" + ($("#NVR_ChnOSDShowTime").val()*1) + "</ShowDateTimeFlag>");
			osdCopyXml += ("<chid>" + sel + "</chid>")
			//osdCopyXml += ("<ChnName>" + $("#NVR_ChnOSDChnName").val() + "</ChnName>");
			
			osdCopyXml += ("<DateMode>" + ($("#NVR_ChnOSDDateFormat").val()*1) + "</DateMode>");
			osdCopyXml += ("<TimeMode>" + ($("#NVR_ChnOSDTimeFormat").val()*1) + "</TimeMode>");
			
			osdCopyXml += ("<FlickerCtrl>" + ($("#ChnOSDFlickerCtrl").val()*1) + "</FlickerCtrl>");
			osdCopyXml += ("<RecTimeFlag>" + ($("#NVROSd_RecTimeFlag").val()*1) + "</RecTimeFlag>");
			osdCopyXml += ("<Covert>" + ($("#ChnOSDPreview").val()*1) + "</Covert>");
			
			osdCopyXml += "</a>";
			$("#NVR_ChnOSDChannelMask").change();//复制前把本通道OSD位置保存
			RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", 400, "Set",osdCopyXml);	//保存复制通道
		}
	})
	
	//初始操作
	var sel = -1;
	$(function(){
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				//console.log("i:" + i + " State:" + IpcAbility[i].State);
				if(IpcAbility[i].State == 2){
					if(sel==-1 && (((IpcAbility[i].Abilities>>3) & 1) == 1)){
						sel = i;//显示列表的第一项
					}
					$("#NVR_ChnOSDChannelMask").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');//Channel列表
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				//console.log("i:" + i + " state:" + IpcAbility[i].State);
				if(IpcAbility[i].State == 2){
					if(sel==-1){
						sel = i;//显示列表的第一项
					}
					$("#NVR_ChnOSDChannelMask").append('<option class="option" value="'+i+'">'+ 'IP ' +lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');//Channel列表
				}
			}
		}else{
			for(var i=0; i<gDvr.nChannel; i++){
				if(IpcAbility[i].State == 2){
					if(sel==-1 && (((IpcAbility[i].Abilities>>3) & 1) == 1)){
						sel = i;//显示列表的第一项
					}
					$("#NVR_ChnOSDChannelMask").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');//Channel列表
				}
			}
		}
		if(sel == -1){
			sel = 0;//显示列表的第一项
		}
		//MasklayerShow();
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", 100, "Get");//初始时获取页面数据
		$("#NVR_ChnOSDChannelMask").val(sel);
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", sel, "Get");
	});	
	
	function Call(xml){
		
		if (xml == "<result>1</result>"){
			//保存参数到板端成功
			//PaopSuccess($("#chn_osd").text());
		}else if(xml == "<result>0</result>"){
			//保存参数到板端失败
			//PaopSuccess($("#chn_osd").text(), g_sfail );
		}else if(xml == "<result>2</result>"){
			//数据复制成功
			 msg = lg.get("IDS_COPY_SUC");
		  	 //PaopSuccess($("#chn_osd").text(), msg);
		}else if(xml == "<result>4</result>"){
			//用户没有权限保存
			//PaopSuccess($("#chn_osd").text(), n_popedom);
		}else if (xml != "err"){
			if (xml == ""){
				//PaopSuccess($("#chn_osd").text(), g_ffail);
				//MasklayerHide();
				return;
			}
			if(lgCls.version != "HONEYWELL" || (lgCls.version == "HONEYWELL" && IpcAbility[sel].ProtocolType == 0)){//20151015
				gDvr.Motion("ChLive",com,sel); 
				$("#NVR_chn_date_format").css("display","block");
				$("#NVR_chn_time_format").css("display","block");
				$("#Vidoeposition").css("display","block");
			}else{
				gDvr.HideObj(2);	//隐藏Motion and alarm_mv控件
				$("#NVR_chn_date_format").css("display","none");
				$("#NVR_chn_time_format").css("display","none");
				$("#Vidoeposition").css("display","none");
				//gDvr.Sp_Mv("#Vidoeposition", ".mcmain", name);
			}
			//PaopSuccess($("#chn_osd").text(), lg.get("IDS_REFRESH_SUCCESS"));
			var displayRule = findNode("DisplayRule", xml);
			if(displayRule&1 == 1){
				$("#NVR_LIVE_REFRESH_RATE").css("display", "none");
			}else{
				$("#NVR_LIVE_REFRESH_RATE").css("display", "block");
			}
			if(displayRule>>1&1 == 1){
				$("#NVR_chn_date_format").css("display", "none");
				$("#NVR_chn_time_format").css("display", "none");
			}else{
				$("#NVR_chn_date_format").css("display", "block");
				$("#NVR_chn_time_format").css("display", "block");
				if(/*IpcAbility[sel].ProtocolType == 8*/0){//卓威IPC
					$("#NVR_ChnOSDDateFormat").empty();
					$("#NVR_ChnOSDDateFormat").append("<option value='0'>YYYY-MM-DD W hh:mm:ss</option>");
					$("#NVR_ChnOSDDateFormat").append("<option value='1'>YYYY-MM-DD hh:mm:ss</option>");
					$("#NVR_ChnOSDDateFormat").append("<option value='2'>MM-DD-YYYY W hh:mm:ss</option>");
					$("#NVR_ChnOSDDateFormat").append("<option value='3'>MM-DD-YYYY hh:mm:ss</option>");
				}else{
					$("#NVR_ChnOSDDateFormat").empty();
					$("#NVR_ChnOSDDateFormat").append("<option value='0'>"+lg.get("IDS_DST_TIMEMODE01")+"</option>");
					$("#NVR_ChnOSDDateFormat").append("<option value='1'>"+lg.get("IDS_DST_TIMEMODE02")+"</option>");
					$("#NVR_ChnOSDDateFormat").append("<option value='2'>"+lg.get("IDS_DST_TIMEMODE03")+"</option>");
				}
			}
			if(displayRule>>3&1 == 1){
				$("#NVR_chn_show_name").css("display", "none");
			}else{
				$("#NVR_chn_show_name").css("display", "block");
			}
			if(displayRule>>4&1 == 1){
				$("#NVR_chn_show_time").css("display", "none");
			}else{
				$("#NVR_chn_show_time").css("display", "block");
			}
			upper = displayRule>>5&1;
			
			liveCheckLen(-1, -1, sel);
			if(lgCls.version == "KGUARD"){
				$("#NVR_LIVE_REFRESH_RATE").css("display", "none");
			}
			if(lgCls.version != "HONEYWELL" || (lgCls.version == "HONEYWELL" && IpcAbility[sel].ProtocolType == 0)){//20151015
			$(gDvr.obj).css({"left": ($("#Vidoeposition").offset().left - $(".mcmain").offset().left+1),
					"top": ($("#Vidoeposition").offset().top - $(".mcmain").offset().top+1),
					"width": $("#Vidoeposition").css("width"), 
					"height": $("#Vidoeposition").css("height")});	
			}
			$("#NVR_ChnOSDShowName").val(findNode("ShowChnNameFlag", xml)*1 );
			$("#NVR_ChnOSDShowTime").val(findNode("ShowDateTimeFlag", xml)*1 );
			$("#NVR_ChnOSDChnName").val(findNode("ChnName", xml).replace(/&amp;/g,"&"));
			$("#ChnOSDPreview").val(findNode("Covert", xml)*1);
			$("#NVR_ChnOSDDateFormat").val(findNode("DateMode", xml)*1 );
			$("#NVR_ChnOSDTimeFormat").val(findNode("TimeMode", xml)*1 );
			
			var flickerCtrl = findNode("FlickerCtrl", xml)*1;
			if((flickerCtrl==0) || (flickerCtrl==1)){
				$("#ChnOSDFlickerCtrl").val(findNode("FlickerCtrl", xml)*1);
			}/*else{
				//$("#ChnOSDFlickerCtrl").prop("disabled", "true");
				$("#NVR_LIVE_REFRESH_RATE").css("display", "none");
			}*/
			
			$("#NVROSd_RecTimeFlag").val(findNode("RecTimeFlag", xml)*1);
			//$("#ChnOSDFlickerCtrl").prop("disabled", "true");
			//$("#NVR_LIVE_REFRESH_RATE").css("display", "none");
			
			
		}else {
			 //PaopSuccess($("#chn_osd").text(), g_ffail);
		}
		//MasklayerHide();
		//console.log("chid:"+sel+" IpcAbility[sel].ProtocolType:"+IpcAbility[sel].ProtocolType);
	}
	
	$("#NVR_ChnOSDChannelMask").change(function(){
		var chid = $("#NVR_ChnOSDChannelMask").val()*1;
		if(((IpcAbility[chid].Abilities>>3) & 1) == 0){
			$("#NVR_ChnOSDChannelMask").val(sel);
			
			var str = lg.get("IDS_CH")+(chid+1);
			if(gDvr.hybirdDVRFlag==1){//混合DVR
				if(chid<gDvr.AnalogChNum){
					//
				}else{
					str = "IP " + lg.get("IDS_CH")+(chid+1-gDvr.AnalogChNum);
				}
			}
			ShowPaop($("#NVR_osd_config").text(), str + " "+lg.get("IDS_CHN_FAILED"));//不支持此功能
			return;
		}
		
		CHOSDSaveSel();
		sel = chid;
		com = 3;
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", sel, "Get");
	});
	
	function CHOSDSaveSel(){
		var xml = "<a>";
		xml += ("<ShowChnNameFlag>" + ($("#NVR_ChnOSDShowName").val()*1) + "</ShowChnNameFlag>");
		xml += ("<ShowDateTimeFlag>" + ($("#NVR_ChnOSDShowTime").val()*1) + "</ShowDateTimeFlag>");
		xml += ("<chid>" + sel + "</chid>")
		xml += ("<ChnName>" + $("#NVR_ChnOSDChnName").val() + "</ChnName>");
		xml += ("<Covert>" + ($("#ChnOSDPreview").val()*1) + "</Covert>");
		
		xml += ("<FlickerCtrl>" + ($("#ChnOSDFlickerCtrl").val()*1) + "</FlickerCtrl>");
		xml += ("<RecTimeFlag>" + ($("#NVROSd_RecTimeFlag").val()*1) + "</RecTimeFlag>");
		xml += ("<DateMode>" + ($("#NVR_ChnOSDDateFormat").val()*1) + "</DateMode>");			
		xml += ("<TimeMode>" + ($("#NVR_ChnOSDTimeFormat").val()*1) + "</TimeMode>");
		
		xml += "</a>";
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", sel, "Set", xml);
	}
	
	$("#NVR_ChnOSDRf").click(function(){
		//MasklayerShow();
		//$("#ChnOSDChannelMask").val(0);
		g_bClickDefBtn = false;
		//com = 2;
		//gDvr.Motion("ChLive",com,sel);
		com = 4;
		if(lgCls.version == "URMET"){
			RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", 101 + sel, "Get");	//刷新页面数据}
		}
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", 100, "Get");	//刷新页面数据
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", sel, "Get");	//刷新页面数据
	});
	
	$("#NVR_ChnOSDSV").click(function(){
		//MasklayerShow();
		CHOSDSaveSel();
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", 200, "Set");	//保存
	});
	
	$("#ChnOSDDf").click(function(){
		//MasklayerShow();
		//$("#ChnOSDChannelMask").val(0);
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", 850, "Get");
		RfParamCall(Call, $("#NVR_osd_config").text(), "ChLive", sel, "Get");
	});
	
});

function toUpper(){
	if(upper == 1)
	{
		document.getElementById("NVR_ChnOSDChnName").value = document.getElementById("NVR_ChnOSDChnName").value.toUpperCase();   
	}
}

var nSel;
function liveCheckLen(value, id, sel){
	
	//获取当前选择的通道
	if(id==-1){
		nSel = sel;
		if(IpcAbility[nSel].ProtocolType == 13){//sonix
			$("#NVR_ChnOSDChnName").attr("maxlength","8");
			$("#NVR_ChnOSDChnName").css("ime-mode","disabled");
		}else{//IP通道35个长度
			$("#NVR_ChnOSDChnName").attr("maxlength","35");
			$("#NVR_ChnOSDChnName").css("ime-mode","auto");
		}
		return;
	}
	
	/*if(nSel<gDvr.AnalogChNum){//模拟通道
		//value,字母不能超过8个，汉字不能超过4个
		//匹配双字节字符(包括汉字在内)：[^\x00-\xff]
		var nameStr = value.replace(/[^\x00-\xff]/g,"**");//8个"*"
		var nameLen = nameStr.length;//8
		if(nameLen>8){
			value = value.substring(0,4);
		}
		document.getElementById(id).value = value;
	}*/
}