// JavaScript Document
$(function(){	//回放页面事件处理	
	//搜索按钮事件处理
	if((gDvr.nAlarmIn <= 0) || (gDvr.nAlarmIn > 16)){
		$("#alarm_io").css("display","none");
	}
	
	if(lgCls.version == "OWL"){//是否显示默认按钮
		g_bDefaultShow = 1;
	}
	if(lgCls.version == "OWL"){
		$("#sub_stream_set2").css("display","block");//副本
		$("#mobile_stream_set2").css("display","none");//owl 隐藏手机码流
		$("#sub_stream_set").css("display","none");//原位置
		$("#mobile_stream_set").css("display","none");
	}else{
		$("#sub_stream_set2").css("display","none");//副本
		$("#mobile_stream_set2").css("display","none");
		$("#sub_stream_set").css("display","block");//原位置
		$("#mobile_stream_set").css("display","block");
	}
	
	//Owl客户添加IO、Motion搜索类型，先在Owl客户上做
	//合并到中性
	if(1/*lgCls.version == "OWL"*/){
		if(gDvr.nAlarmOut == 0){
			$("#pbRcType option[value='3']").remove();//去掉IO
		}	
		
		if(gDvr.nAlarmOut == 0 && gDvr.IntelligentAnalysis*1 == 0){
			$("#pbRcType option[value='1']").remove();//去掉Alarm
		}
	}
	if(gDvr.nPlatFormShowTag*1 == 1){
		$("#plat_set").css("display","block");
	}
	
	if(gDvr.sgPlatformFlag*1 == 1){
		$("#SG_platform").css("display","block");
	}
	//$("#plat_set").css("display","block");
	//lgCls.version = "HONEYWELL";
	switch(lgCls.version){
		case "SWANN":{
			$("#net_mobile").css("display","none");
			break;
		}	
		case "PANDA":{
			$("#netinf_3G").css("display","block");
			$("#net_mobile").css("display","block");
			//$("#FTP_Set").css("display","block");
			break;
		}
		/*
		case "KGUARD":{
			$("#daysearch").css("margin-left","-25px");
			$("#net_mobile").css("display","block");
			$("#Cloud_Storage").css("display","block");
			break;
		}*/
		case "OWL":{
			if(gDvr.bAdmin == true && gDvr.FtpPageFlag == 1){
				$("#auto_upgrade").css("display","block");
			}
			break;
		}
		case "HONEYWELL":{
			$("#main_stream_set").css("display","none");
			$("#sub_stream_set").css("display","none");
			$("#mobile_stream_set").css("display","none");
			$("#streamset_advanced").css("display","block");
			
			$("#pbRcType").css("border", "1px solid white");
		}
		default:{
			//$("#net_mobile").css("display","block");
			break;	
		}	
	}
	if(gDvr.HidePhonePage){
		$("#net_mobile").css("display","none");
	}
	if(gDvr.nMainType == 0x52530101 && gDvr.nSubType == 0x10100){
		$("#vehicle_mgr").css("display","block");
		$("#netinf_3G").css("display","block");
		$("#net_mobile").css("display","block");
	}
	if((gDvr.nMainType == 0x52530005 && gDvr.nSubType == 0x70101) || (gDvr.nMainType == 0x52530005 && gDvr.nSubType == 0x50201) || (gDvr.nMainType == 0x52530005 && gDvr.nSubType == 0x50301)){
		$("#chn_sp").css("display","none");
	}
	if(gDvr.nMainType == 0x52530002){
		$("#chn_yt").css("display","none");
	}
	/*if(gDvr.PtzHiddenFlag == 1){
		$("#chn_yt").css("display","none");
	}*///DVR这样控制
	if(gDvr.PtzSupported == 1){//NVR 这样控制
		$("#chn_yt").css("display","block");
	}
	if(!bHuaweiPlat){
		$("#Huawei_Plat").css("display","none");
	}
	if(gDvr.RtspPageEnable == 1){
		$("#RTSP_Set").css("display","block");
	}
	/*
	if(gDvr.KguardP2pUidFlag == 1 && lgCls.version != "URMET"){
		$("#Cloud_Storage").css("display","block");
	}
	*/
	/*
	if(lgCls.version == "KGUARD"){
		//$("#Cloud_Storage").css("display","block");
		$("#NewCloud_Storage").css("display","block");
	}
	*/
	
	//1旧KG 的云存储页面
	if(gDvr.CloudSGSerSwitch == 1){
		if(gDvr.CloudStorageFlag == 1){
			$("#Cloud_Storage").css("display","block");  
		}
	}
	// 2新KG 的云存储页面 
	if(gDvr.CloudSGSerSwitch == 2){
		if(gDvr.CloudStorageFlag == 1){
			$("#NewCloud_Storage").css("display","block");  
		}
	}
	//3 raysharp	安联的云存储页面
	if(gDvr.CloudSGSerSwitch == 3){
		if(gDvr.CloudStorageFlag == 1){
			$("#NormalClo_Sto").css("display","block"); 
		}
	}
	
	if(gDvr.DevType == 3){
		$("#IPCan_set").css("display","block");
		//$(".liveBtnBt10").css("display","block");
		$("#net_mobile").css("display","none");
		//$("#sub_stream_set").css("display","block");
		$("#chn_subbm").css("display","none");
				
		//$("#main_stream_set").css("display","block");
		$("#stream_set").css("display","none");
		//$("#RTSP_Set").css("display","block");
	}else if(gDvr.DevType == 4){
		$("#net_base").css("display","block");
		$("#router_lan").css("display","none");
		$("#router_wan").css("display","none");
		$(".liveBtnBt9").css("display","none");
		if(gDvr.WifiStatus == 1)
		{
			$("#IPC_wifiset").css("display","block");
		}
		$("#net_mobile,#chn_yt,#alarm_yc").css("display","none");
		//$(".liveBtnBt10").css("display","block");
		$("#chn_bm,#chn_subbm").css("display","none");
		$("#stream_set").css("display","block");
		$("#IP_Filter").css("display","block");
		$("#RTSP_Set").css("display","block");
		$("#FTP_Set").css("display","block");
	}
	if(gDvr.PageControl == -1 || (gDvr.PageControl & 0x01<<0) == 0){//bit0 == 0,有image control
		$("#Img_Ctrl").css("display","block");
	}
	if(gDvr.DevType == 3 || gDvr.DevType == 4){
		if(gDvr.RouterShowTag == 1){
			
			$("#IPC_wifiset").css("display","none");
			$("#net_base").css("display","none");
			$("#router_lan").css("display","block");
			$("#router_wan").css("display","block");
		}else{
			$("#net_base").css("display","block");
			$("#router_lan").css("display","none");
			$("#router_wan").css("display","none");
		}
	}
	/*	
	if(gDvr.PtzHiddenFlag == 1){		
		$("#chn_yt").css("display","none");
		$("#live_ptz_show").css("display","none");
	}*/
	//$("#chn_yt").css("display","block");
	
	$("#live_ptz_show").css("display","block");
	
	UI.Button(".searchBtn",127, null, function(e,p){
		if (e.type == "mousedown"){
			var $p = $(p);
			var strTime = $("#calday").val();
			strTime +=	strTime.substring(4, strTime.length);
			if ($p.attr("id") == "rss"){
				var selchid = 0;
				$("div[id^='pbCheck']").each(function(){
					if( $(this).css("background-image").indexOf("cbox_on.png") >= 0 ){
						selchid |= 0x01 << ($(this).attr("id").split("pbCheck")[1]*1-1);
					}						
				});
				if (selchid == 0 && gDvr.DevType == 4){
					selchid = 1;
				}
				if (selchid == 0){
					ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_NO_SEL_SEARCHCH"))
				}else{
					if( $("#bPbTBCheck").css("background-image").indexOf("cbox_on.png") >= 0 ){
						bPbTBCheckValue = 1;
					}else{
						bPbTBCheckValue = 0;
					}
					var ret = gDvr.PlayBackByDay(selchid, $("#pbRcType").val()*1 + 1, bPbTBCheckValue, 0, strTime);
					if(ret == 5) {
						ShowPaop("playback", lg.get("IDS_PLAYBACK_PALYING"));
					}
				}
			}else if ($p.attr("id") == "yss"){
				for (var i=0; i< gDvr.nChannel; i++){	//搜索所有通道
					if( $("#bPbTBCheck").css("background-image").indexOf("cbox_on.png") >= 0 ){
						bPbTBCheckValue = 1;
					}else{
						bPbTBCheckValue = 0;
					}	
					var ret = gDvr.PlayBackByMon(i,$("#pbRcType").val()*1 + 1, bPbTBCheckValue, strTime);
					if(ret == 5) {
						break;
					}
				}
			}
		}else if (e.type == "mouseover"){
			$(p).css("background-position", "-127px 0px");
			return(false);
		}
		return(true);
	});

	//最多只能选择四个通道
	$(".playBack_chks").click(function(){
		var count=0;
		$(".playBack_chks").each(function(){
			if($(this).css("background-image").indexOf("cbox_on.png") >= 0){
				count++;
			}
		});
		
		
		if( count<4 && $(this).css("background-image").indexOf("cbox.png") >= 0 ){
			$(this).css("background-image","url('images/cbox_on.png')");
			//$(this).css("checked", "checked");
			//$(this).val(1);
		}else{
			$(this).css("background-image","url('images/cbox.png')");
			//$(this).css("checked", "");
			//$(this).val(0);
		}		
	})
})

//GetDataCall('{"type":0,"data":0}');
GetDataCallBack = GetDataCall;
function GetDataCall(xml){
	var data = JSON.parse(xml);
	var type = data.type;
	if(type == 0){		//获取当前点击的通道号
		curChid = data.data.chid;
		curWinid = data.data.winid;
		var isZoom = data.data.zoomStatus;
		ShowRight(curChid);
		//var ret = gDvr.GetZoomStatus(curChid);
		//console.log(curChid);
		
		//点击某个窗口，获取到该窗口的Zoom的状态
		if(isZoom == 1){
			$(".liveBtnBt11").css("background-position", "0px 0px").attr("name", "active");//on
		}else{
			$(".liveBtnBt11").css("background-position", "32px 0px").attr("name", "");//off
		}
		//console.log("curChid:"+curChid+" curWinid:"+curWinid);
	}else if(type == 1){		//获取设备能力
		var chid = data.chid;
		var ability = data.Abilities;
		IpcAbility[chid] = data.Abilities;//插件枚举：Net_ABILITY_TYPE_E
		//console.log("chid:"+(chid+1)+"  state:" +IpcAbility[chid].State + "  ability:" + IpcAbility[chid].Abilities);
		//if(IpcAbility[chid].StatusReasons == 1){
		//	ShowPaop($("#ipcan_info").text(),lg.get("IDS_CH")+(chid+1)+" "+lg.get("IDS_STREAMBEYONDLIMIT"));
		//}
		//if(chid == curChid){
		//	ShowRight(curChid);
		//}
} else if (type == 2) {
    $("#liveChn_Play_" + DrvNo).mousedown();
    for (i = 0; i < DrvNo-1; i++) {  //跳转到指定的视频频道
    $(".liveBtnBt4").mousedown();
    }
//		if (gVar.nOpenPreView == 1){
//			$(".liveBtnBt1").mousedown();
//			gVar.bliveOpen = true;
//			alert(gVar.nOpenPreView);
//		}else {
//			$(".liveBtnBt2").mousedown();
//			gVar.bliveOpen = false;
//		}
	}
}

//-----回调----
//////////////////////live回调处理///////////////////////////////////////
LiveCallBack = LiveCall;//设置回调函数
function LiveCall(msgID, chID){
	var id = ( chID & 0xFFFF0000 ) >> 16;
	var cp = ( chID & 0xFFFF);
	switch(msgID){
		case 204://RSNetMsgPreviewCloseStream
			$("#liveChn_Play_"+(id+1)).css("background-position", "0px 0px").attr("name", "");//灰色，在线不播放
			$("#liveChn_Rec_"+(id+1)).css("background-position", "0px -25px").attr("name", "");
			break;
		case 202:	//成功	RSNetMsgPreviewOpenStreamSuccess
			$("#liveChn_Play_"+(id+1)).css("background-position", "-31px 0px").attr("name", "active");//蓝色，在线播放中
			break;
		case 205:
			$("#liveChn_Play_"+(id+1)).css("background-position", "-62px 0px").attr("name", "disable");//红色，不在线
			//IpcOffline(id);
			break;
		case 206:
			$("#liveChn_Play_"+(id+1)).css("background-position", "0px 0px").attr("name", "");
			//updateIpcAbility(id);
			break;
	}
	
	var playChn = 0;
	$("div[id^='liveChn_Play_']").each(function(){
		if ($(this).attr("name") == "active"){
			playChn++;
		}
	});
	
	//console.log("curChid: "+curChid+" curWinid:"+curWinid+" id:"+id+" IpcAbility:"+isShowYT(id)+" msgID:"+msgID);
	if(id == curChid || (id == curWinid && curChid == -1)){
		//console.log("curChid: "+curChid+" curWinid:"+curWinid+" id:"+id+" IpcAbility:"+isShowYT(id)+" msgID:"+msgID);
		if(msgID == 202){//打开视频后当前频道id重新设置
			ShowRight(id);
			curChid = id;
		}else{
			ShowRight(-1);
		}
		if(msgID == 204)	//关闭视频后当前频道id重置为-1
			curChid = -1;
	}
	
	if (playChn == gDvr.nChannel){
		$(".liveBtnBt1").attr("name", "active").css("background-position", "-64px 0px");
		$(".liveBtnBt2").attr("name", "").css("background-position", "0px -32px");
	}else if (playChn == 0){
		$(".liveBtnBt1").attr("name", "").css("background-position", "0px 0px");
		$(".liveBtnBt2").attr("name", "active").css("background-position", "-64px -32px");
	}else{
		$(".liveBtnBt1").attr("name", "").css("background-position", "0px 0px");
		$(".liveBtnBt2").attr("name", "").css("background-position", "0px -32px");
	}
}


function isShowYT(chid){
	if(IpcAbility[chid].State == 2){
		if(IpcAbility[chid].ProtocolType >= 32){//自定义协议，隐藏云台
			return 0;
		}
		//console.log("1-*-%d--%d--%d", chid, IpcAbility[chid].State, IpcAbility[chid].Abilities);
		/*
		if(((IpcAbility[chid].Abilities>>10) & 1) == 1){
			return 1;
		}else{
			return 0;
		}*/
		return 1;
	}else{
		//console.log("0-*-%d--%d--%d", chid, IpcAbility[chid].State, IpcAbility[chid].Abilities);
		return 0;
	}
}

function isShowColor(chid){
	if(IpcAbility[chid].State == 2){
		if(IpcAbility[chid].ProtocolType >= 32){//自定义协议，隐藏颜色设置
			return 0;
		}
		//console.log("1-*-%d--%d--%d", chid, IpcAbility[chid].State, IpcAbility[chid].Abilities);
		/*
		if(((IpcAbility[chid].Abilities>>4) & 1) == 1){
			return 1;
		}else{
			return 0;
		}*/
		return 1;
	}else{
		//console.log("0-*-%d--%d--%d", chid, IpcAbility[chid].State, IpcAbility[chid].Abilities);
		return 0;
	}
}

//是否有设备支持进入该页面
function IsShow(name){
	if(name == "chn_osd"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if(((IpcAbility[i].Abilities>>3) & 1) == 1){
					return 1;
				}
		}
		return 0;
	}else if(name == "chn_sp"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if(((IpcAbility[i].Abilities>>6) & 1) == 1){
					return 1;
				}
		}
		return 0;
	}else if(name == "main_stream_set"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if((((IpcAbility[i].Abilities>>0) & 1) == 1 &&IpcAbility[i].NewDevAbilityModeFlag != 1) ||(IpcAbility[i].NewDevAbilityModeFlag == 1&&((IpcAbility[i].Abilities>>13) & 1) == 0)){
					return 1;
				}
		}
		return 0;
	}else if(name == "sub_stream_set"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if((((IpcAbility[i].Abilities>>1) & 1) == 1&&IpcAbility[i].NewDevAbilityModeFlag != 1) || (IpcAbility[i].NewDevAbilityModeFlag == 1&&((IpcAbility[i].Abilities>>14) & 1) == 0)){
					return 1;
				}
		}
		return 0;
	}else if(name == "mobile_stream_set"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if((((IpcAbility[i].Abilities>>2) & 1) == 1&&IpcAbility[i].NewDevAbilityModeFlag != 1) || (IpcAbility[i].NewDevAbilityModeFlag == 1&&((IpcAbility[i].Abilities>>15) & 1) == 0)){
					return 1;
				}
		}
		return 0;
	}else if(name == "sub_stream_set2"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if((((IpcAbility[i].Abilities>>1) & 1) == 1&&IpcAbility[i].NewDevAbilityModeFlag != 1) || (IpcAbility[i].NewDevAbilityModeFlag == 1&&((IpcAbility[i].Abilities>>14) & 1) == 0)){
					return 1;
				}
		}
		return 0;
	}else if(name == "mobile_stream_set2"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if((((IpcAbility[i].Abilities>>2) & 1) == 1&&IpcAbility[i].NewDevAbilityModeFlag != 1) || (IpcAbility[i].NewDevAbilityModeFlag == 1&&((IpcAbility[i].Abilities>>15) & 1) == 0)){
					return 1;
				}
		}
		return 0;
	}else if(name == "chn_yt"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if(((IpcAbility[i].Abilities>>10) & 1) == 1){
					return 1;
				}
		}
		return 0;
	}else if(name == "alarm_mv"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if((IpcAbility[i].Abilities>>7) & 1){
					return 1;
				}
		}
		return 0;
	}else if(name == "streamset_advanced"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if(IpcAbility[i].ProtocolType == 1){
					return 1;
				}
		}
		return 0;
	}else if(name == "Img_Ctrl"){
		for (var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2)	
				if(IpcAbility[i].Abilities>>11&1){
					return 1;
				}
		}
		return 0;
	}
	
	return 1; 

}

$(function(){	//config页面事件处理
	//config左边菜单点击事件
	$("div[id^='cfgmune_']").mouseover(function(){
		$(this).css("cursor", "pointer");
	}).click(function(){
		var id = $(this).attr("id").split("cfgmune_")[1];
		$(".configpanel").removeClass("configpanel").fadeOut(200).slideUp(250, function(){
			$("#cfgpanel_"+id).slideDown(300, function(){
				$(this).addClass("configpanel");
			});
		});
	});	
	
	//子菜单下面样式事件
	$(".notselected").mouseover(function(){
		$(this).css("cursor", "pointer");
		$(this).addClass("selecteda");
	}).mouseout(function(){
		$(this).removeClass("selecteda");
	}).click(function(){
		if(IsShow($(this).attr("id")) == 1){
			$(".selectedb").removeClass("selectedb");
			$(this).addClass("selectedb");
			
			if($(this).attr("id") == "alarm_mv"){  //点击页面，标记为0，不显示Exit按钮
				alarm_mvShowExitButton = 0;
			}else if($(this).attr("id") == "NewCloud_Storage"){  //点击页面，标记为1，显示Exit按钮			
				alarm_mvShowExitButton = 1;
			}

			showConfigChild($(this).attr("id"));
		}else{
			ShowPaop($(this).text(), lg.get("IDS_PAGE_FAILED"));
		}
	});
	
	
});

//视频遮挡，移动侦测在此页面中做处理
function showConfigChild(name){	//显示子页面
	gCurConfigPage = name;
	MasklayerShow();
	gDvr.HideObj(2);
	var $p = $("#"+name.split("_").join(""));
	$(".cfgactive").removeClass("cfgactive");
	
	if(name == "stream_set"){
		$p.attr("name","");
		if(gStreamSet == 0){
			name = "chn_bm";
		}else if(gStreamSet == 1){
			name = "chn_subbm";
		}else{
			name = "mobile_stream";
		}		
	}
	if(name == "gotochn_bm"){
		$p.attr("name","");
		//name = "chn_bm";	
		name = "main_stream_set";
	}
	
	if(name == "chn_osd"){
		$p.attr("name","");
		//name = "chn_bm";	
		name = "chn_live";
	}

	if(name == "sub_stream_set2"){
		$p.attr("name","");
		name = "sub_stream_set";
	}
	if(name == "mobile_stream_set2"){
		$p.attr("name","");
		name = "mobile_stream_set";
	}
	//合并到中性
	if(/*lgCls.version=="OWL"&&*/  name == "syspm_user"){
		$p.attr("name","");
		name = "syspm_user_owl";
	}
	
	if (1/*$p.attr("name") != "isDown"*/){
		$.get("html/cfg/"+name+".html?"+gVar.nDate,"",function(data){
			$p.prop("innerHTML",data).attr("name", "isDown").addClass("cfgactive");
			$.getScript("html/cfg/"+name+".js", null);
			lan(name);
			/*
			if(lgCls.version == "URMET"){
				$(".logo_link").addClass("urmet");
			}*/
			
			if(gDvr.nMainType == 0x52530001 && gDvr.nSubType == 0x50300){
				$("#MotionDivBoxAll,#item_motion,#table_motion,#table_channel,#table_sense").css("width","718px");
				$(".bottomMac").css("height","443px");
				if(gDvr.nVideoFormat == 0){
					$("#MotionSP").css({height:"360px",width:"441px"});
				}else{
					$("#MotionSP").css({height:"300px",width:"441px"});
				}
			}else if(gDvr.DevType == 3 || gDvr.hybirdDVRFlag){
				$("#MotionSP").css({height:"240px",width:"321px"});
			}else if(gDvr.DevType == 4){
				$("#MotionSP").css({height:"240px",width:"320px"});
			}else{
				if(gDvr.nVideoFormat == 0){
					$("#MotionSP").css("height","252px");
				}else{
					$("#MotionSP").css("height","240px");
				}
			}
			
			
			if(name == "alarm_mv"){
				gDvr.Sp_Mv("#MotionSP", ".mcmcmain", name);
			}
			else if(name == "chn_sp"){
				gDvr.Sp_Mv("#Vidoeshelter", ".mcmain", name);
			}
			else if(name == "Img_Ctrl"){
				gDvr.Sp_Mv("#Vidoecamera", ".mcmain", name);
			}else if(name == "chn_live"){
				if(1){//20151015
					$("#NVR_chn_date_format").css("display","block");
					$("#NVR_chn_time_format").css("display","block");
					$("#Vidoeposition").css("display","block");
					gDvr.Sp_Mv("#Vidoeposition", ".mcmain", name);
				}
			}
			if(gDvr.DevType==4){
				$(".logo_link_cy").css("display","none");
			}
		},"html")
	}/*else {
		$p.addClass("cfgactive");
		if(name == "alarm_mv"){
			gDvr.Sp_Mv("#MotionSP", ".mcmain", name);
			$("#MotionRf").click();
		}
		else if(name == "chn_sp"){
			gDvr.Sp_Mv("#Vidoeshelter", ".mcmain", name);
			$("#ChnspRf").click();
		}
		else if(name == "Img_Ctrl"){
			gDvr.Sp_Mv("#Vidoecamera", ".mcmain", name);
			$("#ChncamRf").click();
		}
		MasklayerHide();
	}*/
}


function ShowRight(chid){
	/*
	if(chid>=0 && chid<gDvr.nChannel){
		if((IpcAbility[chid].ProtocolType == 1) || (IpcAbility[chid].ProtocolType == 0)){
			$("#ptz_default").css("display", "block");
		}else{
			$("#ptz_default").css("display", "none");
		}
	}else{
		$("#ptz_default").css("display", "none");
	}
	*/
	if(chid<gDvr.nChannel && chid!=-1){
		//console.log("ShowRight---chid:"+chid+" isShowYT:"+isShowYT(chid)+" isShowColor:"+isShowColor(chid));
		if((isShowYT(chid)) == 0){
			$("#live_ptz_show").fadeTo("fast", 0.2);
			$("#live_ptz_show").find("*").prop("disabled",true);
		}else{
			$("#live_ptz_show").fadeTo("fast", 1);
			$("#live_ptz_show").find("*").prop("disabled",false);
		}
		if((isShowColor(chid)) == 0){
			$("#color_pic_show").fadeTo("fast", 0.2);
			$("#color_pic_show").find("*").prop("disabled",true);
		}else{
			$("#color_pic_show").fadeTo("fast", 1);
			$("#color_pic_show").find("*").prop("disabled",false);
		}
	}else{
		$("#live_ptz_show").fadeTo("fast", 0.2);
		$("#live_ptz_show").find("*").prop("disabled",true);
		$("#color_pic_show").fadeTo("fast", 0.2);
		$("#color_pic_show").find("*").prop("disabled",true);
	}
}



SilderGetCall("<Chroma>31</Chroma><Brightness>36</Brightness><contrast>30</contrast><saturation>31</saturation><sound>50</sound>");
function SilderGetCall(strxml){
	if(strxml == "err") return ;
	strxml = "<a>" + strxml + "</a>";

	var flag = $(strxml.split("ColorMode").join("p")).find("p").text()*1;//0：64、1：256
	var hue = new cursor(flag);
	var Bright = new cursor(flag);
	var Contrast = new cursor(flag);
	var Saturation = new cursor(flag);
	hue.create("live_wd_sj");
	Bright.create("live_wd_ld");
	Contrast.create("live_wd_dbd");
	Saturation.create("live_wd_bhd");
	
	hue.Default(($(strxml.split("Chroma").join("p")).find("p").text()*1));
	
	Bright.Default($(strxml.split("Brightness").join("p")).find("p").text()*1);
	
	Contrast.Default($(strxml.split("contrast").join("p")).find("p").text()*1);
	
	Saturation.Default($(strxml.split("saturation").join("p")).find("p").text()*1);
	
	if(findNode("ShowDefault",strxml) == 0){
		$("#ptz_default").css("display","none");
	}else if(findNode("ShowDefault",strxml) == 1){
		$("#ptz_default").css("display","block");
	}
	if(findNode("DisplayRule",strxml) == 0){
		$("#live_wd_bhd1").attr("title",lg.get("IDS_SATURATION"));
		$("#live_wd_sj1").attr("title",lg.get("IDS_HUE"));
	}else if(findNode("DisplayRule",strxml) == 1){
		$("#live_wd_bhd1").attr("title",lg.get("IDS_SATURATION"));
		$("#live_wd_sj1").attr("title",lg.get("IDS_ACUTANCE"));
	}else if(findNode("DisplayRule",strxml) == 2){
		$("#live_wd_bhd1").attr("title",lg.get("IDS_ACUTANCE"));
		$("#live_wd_sj1").attr("title",lg.get("IDS_HUE"));
	}
}
/////////////////////////live回调完毕////////////////////////////////////////////////////

//////////////////参数配置回调处理///////////////////////////////////////////////////
//错误处理
function XmlParm(){}
function ErrPro(xml){
	var res = findNode("result",xml);
	//console.log(gVar.errTitle);
	if(res != -1) { var r = res & 0xffff;
	   switch(r)
		{
			case 0:
				/*if(gVar.errTitle == lg.get("IDS_IPC_SET")){
					IPCRsp(r);
				}*/
				ShowPaop(gVar.errTitle, lg.get("IDS_SAVE_FAILED"));//Save Failed!
				break;
			case 1:
				if(gVar.errTitle == lg.get("IDS_BASE_INFO"))//基本信息
				{
					var str = gDvr.obj.GetAndSetNetParam("SysDst",0,100,"");
					XmlParm(str);
				}
				else if(gVar.errTitle == lg.get("IDS_IPC_SET")){//摄像头设置
					XmlParm();
				}else if(gVar.errTitle == lg.get("IDS_USER_INFO") && lgCls.version != "URMET"){
					MasklayerShow();
					ShowPaop(gVar.errTitle, lg.get("IDS_SAVE_SUCCESS"));//Saved!
					return;
				}
				ShowPaop(gVar.errTitle, lg.get("IDS_SAVE_SUCCESS"));//Saved!
				break;
			case 2:
				ShowPaop(gVar.errTitle, lg.get("IDS_COPY_SUC"));//通道数据拷贝成功
				break;
			case 3:
				ShowPaop(gVar.errTitle, lg.get("IDS_COPY_CHNNELFAILED"));//通道数据拷贝失败
				break;
			case 4:
				ShowPaop(gVar.errTitle, lg.get("IDS_PLAYBACK_RIGHT1"));//没有权限操作此项功能
				break;
			case 5:
				var ch = res >> 16 & 0xffff;
				var str ='';
				for(var i=0; i<gDvr.nChannel; ++i)
				{
					if((ch>>i)&0x1 == 1) { str += (lg.get("IDS_CH")+(i+1)+",");}
				}
				ShowPaop(gVar.errTitle, str.substring(0,str.length-1)+","+lg.get("IDS_CRUISE_VALUE"));
				break;
			case 6:
				break;
			default:
				break;  
		}
	}else{
		if(g_bClickDefBtn == true){		//点击default按钮不能弹出提示
			if(xml != "err"){
				XmlParm(xml);
			}
			MasklayerHide();
			return ;
		}
		if (xml == "" || xml == "err"){
			ShowPaop(gVar.errTitle, lg.get("IDS_REFRESH_FAILED"));//Refresh Failed!
			if($(".cfgactive").attr("id") == "IPCanset"){
				MasklayerHide();
			}
		}else if(xml == "suc"){
		}else if(xml != "err"){
			XmlParm(xml)	//xml解析
			ShowPaop(gVar.errTitle, lg.get("IDS_REFRESH_SUCCESS"));//Refresh Success!
		}
	}
		
	/*if (xml == "<result>0</result>"){
		//保存参数到板端成功
		ShowPaop(gVar.errTitle, lg.get("IDS_SAVE_FAILED"));
	}else if(xml == "<result>1</result>"){
		//保存参数到板端失败
		ShowPaop(gVar.errTitle, lg.get("IDS_SAVE_SUCCESS"));
	}else if(xml == "<result>2</result>"){
		//用户没有权限保存
		ShowPaop(gVar.errTitle, lg.get("IDS_COPY_SUC"));
	}else if(xml == "<result>3</result>"){
		ShowPaop(gVar.errTitle, lg.get("IDS_COPY_CHNNELFAILED"));
	}else if(xml == "<result>4</result>"){
		ShowPaop(gVar.errTitle, lg.get("IDS_PLAYBACK_RIGHT1"));
	}else if (xml == "" || xml == "err"){
		ShowPaop(gVar.errTitle, lg.get("IDS_REFRESH_FAILED"));
	}else if(xml == "suc"){
		
	}else if(xml != "err"){
		
		XmlParm(xml)	//xml解析
		//ShowPaop(gVar.errTitle, lg.get("IDS_REFRESH_SUCCESS"));
	}*/
	if($(".cfgactive").attr("id") != "IPCanset"){
		MasklayerHide();
	}
}
CfgCallBack = ErrPro;	//将参数先面回调给错误错处理

//参数配置
//CallBack -- 回调函数
//Paop -- 消息框提示标题
//nPage -- 设置或者获取页面表示
//nFlag -- 设置或者页面附加参数 -- 传递通道号 外加两个值： 100 - 获取时 ，通知ocx从板端重新更新数据。 200 - 设置时，通知ocx把数据保存到板端；
//type -- 操作标志， Get -- 获取， Set -- 设置 . 默认值为 Get
//xml -- 设置操作时用到的参数，向ocx传递要设置的xml, 查询操作时不需要该值(该值为"");
function RfParamCall(CallBack, Paop, nPage, nFlag, type, xml){	
	//参数合法性检查
	MasklayerShow();
	gVar.errTitle = Paop;
	if (nFlag == null || typeof nFlag == 'undefined'){
		MasklayerHide();
		return(null);
	}
	
	if (xml == null || typeof xml == 'undefined'){
		xml = "";
		if (nFlag == 200 && type == "Set"){
			xml = "ALL";
		}
	}
	
	if (type == null || typeof type == 'undefined'){
		type = 0;
	}else if (type == "Get"){
		type = 0;
	}else if (type == "Set"){
		type = 1;
	}
		
	if (!jQuery.isFunction(CallBack)){
		MasklayerHide();
		return(null);
	}
	gVar.errTitle = Paop;
	XmlParm = CallBack;//设置回调
	var xml = gDvr.GetAndSetParameter(nPage, xml, type, nFlag);
	if (xml != 0 && !($.browser.safari && $(".cfgactive").attr("id") == "IPCanset")){
		MasklayerHide();
	}
}
/////////////////////////参数配置回调完毕////////////////////////////////////////////////////

/////////////////////////playback回调////////////////////////////////////////////////////
PlayBackCallBack = PlayBackCall;
function PlayBackCall(cmd,strMsg){
	if(cmd == 0)
	{
		var tds = findNode("Total", strMsg);
		var tdmsg=[];
		for(var i=0;i<tds;i++){
			var chNo = parseFloat(findNode("CH"+i,strMsg));
			if(gDvr.hybirdDVRFlag==1 && chNo>=gDvr.AnalogChNum){//混合DVR
				tdmsg[tdmsg.length]="IP-CH"+(chNo+1-gDvr.AnalogChNum);
			}else{
				tdmsg[tdmsg.length]="CH"+(chNo+1);
			}
		}
		if(tdmsg == ""){
		    ShowPaop(lg.get("IDS_REPLAY"),lg.get("IDS_PLAYBACK_RIGHT1"));	
		}else{	
			ShowPaop(lg.get("IDS_REPLAY"),lg.get("IDS_SEARCH_NOFILE")+" "+tdmsg);	
		}
		
	}else if(cmd == 1){
		var i = strMsg.indexOf(">");
		var j = strMsg.indexOf("</");
		var ch = (strMsg.substring(3, i)*1)+1 + "";
		strMsg = strMsg.substring(i+1, j);
		var days = $("#CalDayID").attr("name");
		if ( typeof $("#calTip").find("#"+strMsg).attr("id") == "undefined"){
			$("#calTip").append('<div id="'+strMsg+'"></div>');
			$("#"+strMsg).attr("name", ","+ch + ",");
			days += (strMsg + ",");
			$("#CalDayID").attr("name", days);
			//重新加载日历 
			$('#calendar').find("select").change();
		}else {
			if ((i = ($("<a>" + $("#"+strMsg).attr("name") + "</a>").text()).indexOf(","+ch+",")) == -1){
				if ($("#"+strMsg).attr("name").split(",").length == 8 || $("#"+strMsg).attr("name").split(",").length == 13){
					$("#"+strMsg).attr("name", $("#"+strMsg).attr("name")+"</br>");
				}
				$("#"+strMsg).attr("name", $("#"+strMsg).attr("name")+ch + ",");
			}
		}
	 }else if(cmd == 3){
		ShowPaop(lg.get("IDS_WARNING"), lg.get("IDS_PLAYBACK_MUTUAL")); 
	 }else if(cmd == 325){
		//console.log(325);
		ShowPaop(lg.get("IDS_WARNING"), lg.get("IDS_PLAYBACK_FORMATHDD"));
	 }else if(cmd == 308){
		//console.log(308);
		ShowPaop(lg.get("IDS_WARNING"), lg.get("IDS_PREVIEW_NO_BANDWIDTH"));//设备带宽不足
	 }
}

function pbCalCall(tip, data, top, left){	//日历回调 

/*
	if ( typeof $("#"+data).attr("id") != "undefined"){
		var str = $("#"+data).attr("name");
		$('#next_touch_date').simpleDatepicker.ShowInputTip(tip, "CH:"+str.substring(1, str.length-1), top, left);
		
	}
*/	
	
}
/////////////////////////playback回调完毕////////////////////////////////////////////////////



//此语句最后
CfgCallBack = SilderGetCall; 	//设置live页面回调