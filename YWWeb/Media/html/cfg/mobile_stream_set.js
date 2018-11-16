// JavaScript Document

var maxBitrate = 0;
var minBitrate = 0;
$(document).ready(function(){
	//显示复制通道
	if(lgCls.version == "URMET"){
		g_bDefaultShow = true;
	}
	
	if(lgCls.version == "OWL" || lgCls.version == "URMET" || lgCls.version == "HONEYWELL"){
		$("#NVR_CHNMOBILEBMCP").css("display","block");
	}
	
	if(g_bDefaultShow == true){
			$("#NVR_CHNMOBILEBMDf").css("display","block");
	}
	
	if(gDvr.nChannel==1)
	{
		$("#NVR_mob_CHN_TABLE").css("display","none");
		$("#NVR_CHNMOBILEBMCP").css("display","none");
	}
	
	//第1行的copy按钮
	$("#NVR_CHNMOBILEBMCP").click(function(){
		$("#NVR_mobck").prop("checked",false);
		copyTD("#NVR_mobCopyTD","mob_ch","NVR_mob_TDNum");
		$.each($("input[id^='mob_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("mob_ch")[1]*1 - 1;
			if((IpcAbility[index].State != 2) || (((IpcAbility[index].Abilities>>2) & 1) == 0)){
				$(this).prop("disabled",true);
			}
		})
	})
	
	//Copy时的 All checkobx
	$("#NVR_mobck").click(function(){
		$.each($("input[id^='mob_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("mob_ch")[1]*1 - 1;
			if((IpcAbility[index].State == 2) && (((IpcAbility[index].Abilities>>2) & 1) == 1)){
				$(this).prop("checked",$("#NVR_mobck").prop("checked"));
			}
		})
		//$("input[id^='mob_ch']").prop("checked",$(this).prop("checked"));
	})	
	
	var TvSystem = gDvr.nVideoFormat;	//制式 PAL(0) -- 400  NTSC(1) -- 480 
	//var bSave = false;
  
	var mobile;	//手机码流数组
	var TotalCif = 0;	//总帧率
	var SyCif = 0;		//剩余帧率	
	var sel = -1;		//当前选择通道
	mobValue = [8,16,24,32,48,64,80,96,128,160,192,224,256,320,384,448,512,768,1024,1536,2048,3072,4096,5120];
	/*
	if(lgCls.version == "URMET"){
		suggested = [24,48,64,96,128,160,160,192,192,224,256,256,256,320,320,320,384,384,384,448,448,448,512,512,512];
	}
	*/
	
	function mobile(BitRateMode, CustomBitrate, Bitrate, VideoQuality, Fps, AudioSwitch, ResolutionsetIndex, Num, HaveAudio, VideoSwitch, BitrateType, VideoEncType){	//结构体格式定义 
		this.BitRateMode = Number(BitRateMode);
		this.CustomBitrate = Number(CustomBitrate);
		this.Bitrate = Number(Bitrate);
		this.VideoQuality = Number(VideoQuality);
		this.Fps = Number(Fps);
		this.AudioSwitch = Number(AudioSwitch);
		this.ResolutionsetIndex = Number(ResolutionsetIndex);
		this.Num = Number(Num);
		this.HaveAudio = Number(HaveAudio);
		this.BitrateType = Number(BitrateType);
		this.VideoEncType = Number(VideoEncType);
		this.VideoSwitch = Number(VideoSwitch);
		this.BitrateRange = new Array(8);
		this.FrameRateMin = new Array(8);
		this.FrameRateMax = new Array(8);
		this.ResolutionWidth = new Array(8);
		this.ResolutionHight = new Array(8);
	}

	//获取字符串中数组值
	function RateFun(Bitrate){
		return[Bitrate[0], Bitrate[1]];
	}
	
	for (var i=0; i<gDvr.nChannel; i++){
		mobile[i] = new mobile(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
	
	function InitArray(xml){	//初始化数组 --xml ->  
		for (var i=0; i<gDvr.nChannel; i++){
			mobile[i].BitRateMode = findChildNode(i+"Struct", "BitRateMode", xml)*1;
			mobile[i].CustomBitrate = findChildNode(i+"Struct", "CustomBitrate", xml)*1;
			mobile[i].Bitrate = findChildNode(i+"Struct", "Bitrate", xml)*1;
			mobile[i].VideoQuality = findChildNode(i+"Struct", "VideoQuality", xml)*1;
			mobile[i].Fps = findChildNode(i+"Struct", "Fps", xml)*1;
			mobile[i].AudioSwitch = findChildNode(i+"Struct", "AudioSwitch", xml)*1;
			mobile[i].ResolutionsetIndex = findChildNode(i+"Struct", "ResolutionsetIndex", xml)*1;
			mobile[i].Num = findChildNode(i+"Struct", "Num", xml)*1;
			mobile[i].HaveAudio = findChildNode(i+"Struct", "HaveAudio", xml)*1;
			mobile[i].BitrateType = findChildNode(i+"Struct", "BitrateType", xml)*1;
			mobile[i].VideoEncType = findChildNode(i+"Struct", "VideoEncType", xml)*1;
			mobile[i].VideoSwitch = findChildNode(i+"Struct", "VideoSwitch", xml)*1;
			for(var n=0; n<8; n++){
				mobile[i].BitrateRange[n] = findChildNode(i+"Struct", "BitrateRange"+n, xml)*1;
			}
			for(var l=0; l<8; l++){
				mobile[i].FrameRateMin[l] = findChildNode(i+"Struct", "FrameRateMin"+l, xml)*1;
			}
			for(var m=0; m<8; m++){
				mobile[i].FrameRateMax[m] = findChildNode(i+"Struct", "FrameRateMax"+m, xml)*1;
			}
			for(var j=0; j<8; j++){
				mobile[i].ResolutionWidth[j] = findChildNode(i+"Struct", "ResolutionWidth"+j, xml)*1;
			}
			for(var k=0; k<8; k++){
				mobile[i].ResolutionHight[k] = findChildNode(i+"Struct", "ResolutionHight"+k, xml)*1;
			}
			
		}
	}
	
	function SaveArray(){	//获取xml  ---  struct ->  xml
		var xml = "<a>";
		xml += ("<chnnum>"+gDvr.nChannel+"</chnnum>");
		for (var i=0; i<gDvr.nChannel; i++){
			if(mobile[i].BitRateMode==0 && mobile[i].CustomBitrate != mobValue[mobile[i].BitRateMode]){
				mobile[i].CustomBitrate = mobValue[mobile[i].BitRateMode]
			}
			xml += ("<Struct"+i+">\
					<BitRateMode>"+mobile[i].BitRateMode+"</BitRateMode>"+
					"<CustomBitrate>"+mobile[i].CustomBitrate+"</CustomBitrate>"+
					"<Bitrate>"+mobile[i].Bitrate+"</Bitrate>"+
					"<VideoQuality>"+mobile[i].VideoQuality+"</VideoQuality>"+
					"<Fps>"+mobile[i].Fps+"</Fps>"+
					"<AudioSwitch>"+mobile[i].AudioSwitch+"</AudioSwitch>"+
					"<BitrateType>"+mobile[i].BitrateType+"</BitrateType>"+
					"<VideoEncType>"+mobile[i].VideoEncType+"</VideoEncType>"+
					"<VideoSwitch>"+mobile[i].VideoSwitch+"</VideoSwitch>"+
					"<ResolutionsetIndex>"+mobile[i].ResolutionsetIndex+"</ResolutionsetIndex>\
			</Struct"+i+">");
		}
		xml += "</a>";
		return xml;
	}
	
	$(function(){	//初始化时填充界面元素
		$("#NVR_CHNmobchn").empty();
		
		
		for(var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2){	
				if(sel==-1 && ((((IpcAbility[i].Abilities>>2) & 1) == 1&&IpcAbility[i].NewDevAbilityModeFlag != 1) || (IpcAbility[i].NewDevAbilityModeFlag == 1&&((IpcAbility[i].Abilities>>15) & 1) == 0))){
					sel = i;
				}
				$("#NVR_CHNmobchn").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
		}
		
		//$("#NVR_CHNmobchn").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
		if(sel == -1)
			sel = 0;
		
		RfParamCall(Call, $("#NVR_config_mobilestream").text(), "MobNEncode", 100, "Get");	//初始时获取页面数据
	});
	
	function Call(xml){			
			MasklayerHide();
			$("#NVR_CHNMobStreamMode option[value='2']").remove();
			if(IpcAbility[sel].ProtocolType == 5){//Urmet协议
				$("#NVR_CHNMobStreamMode").append('<option class="option" value="2">'+lg.get("IDS_SUGGESTED_VAL")+'</option>');
			}
			TvSystem = findNode("TvSystem", xml)*1;
			if (TvSystem != 0 && TvSystem != 1){
				//PaopSuccess($("#code_config").text(), g_ffail);
				MasklayerHide();
				return;
			}
			InitArray(xml);
			if(IpcAbility[sel].ProtocolType == 2){//三星IPC Bitrate 为输入框
				mobile[sel].BitRateMode = 1;
			}
			//界面响应 
			//BitrateMode --> Bitrate
			if( mobile[sel].BitRateMode == 0)//Preset
			{
				//共用同一位置
				$("#NVR_mob_UserDefineBitrate").css("display","none");
				$("#NVR_mob_PresetBitrate").css("display","block");
			}
			else//User Define
			{
				//共用同一位置
				$("#NVR_mob_PresetBitrate").css("display","none");
				$("#NVR_mob_UserDefineBitrate").css("display","block");
				for(var i=0; i< mobValue.length; i++){
					if((mobile[sel].BitrateRange[mobile[sel].ResolutionsetIndex]>>i)&1 == 1){
						if(minBitrate == 0){
							minBitrate = mobValue[i];
							maxBitrate = mobValue[i];
						}
						if(mobValue[i] > maxBitrate){
							maxBitrate = mobValue[i];
						}
					}
				}
				document.getElementById('NVR_mob_UserDefine_BitrateRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
			}
			
			$("#NVR_CHNmobchn").val(sel);
			
			//Resolution获取列表，赋值
			if(mobile[sel].Num == 0){
				$("#NVR_mobResolutionSel").empty();
			}else{
				var j = 0;
				$("#NVR_mobResolutionSel").empty();
				for (j; j<mobile[sel].Num; j++){//Num是Resolution的个数
					$("#NVR_mobResolutionSel").append('<option class="option" value="'+j+'">'+mobile[sel].ResolutionWidth[j]+"x"+mobile[sel].ResolutionHight[j]+'</option>');
				}
				$("#NVR_mobResolutionSel").val(mobile[sel].ResolutionsetIndex);
			}			

			//FPS获取列表，赋值
			var MaxFps = mobile[sel].FrameRateMax[mobile[sel].ResolutionsetIndex];//某个通道&&某个Resolution下的FPS最大值
			$("#NVR_mobFPS_Sel").empty();
			for (var i=mobile[sel].FrameRateMin[mobile[sel].ResolutionsetIndex]; i<=MaxFps; i++){//某个通道&&某个Resolution下的FPS最小值
				$("#NVR_mobFPS_Sel").append('<option class="option" value='+i+' >'+i+'</option>');
			}
			$("#NVR_mobFPS_Sel").val(mobile[sel].Fps);
			
			//Preset下的Bitrate，获取列表，赋值
			$("#NVR_mobPresetBitrate").empty();//Preset下的Bitrate
			for(var i=0; i< mobValue.length; i++){
				if((mobile[sel].BitrateRange[mobile[sel].ResolutionsetIndex]>>i)&1 == 1)//某个通道&&某个Resolution下的Bitrate范围
					$("#NVR_mobPresetBitrate").append('<option class="option" value="'+i+'">'+mobValue[i]+'</option>');
			}
			$("#NVR_mobPresetBitrate").val(mobile[sel].Bitrate);
			
			//通道改变
			setTimeout(function(){$("#NVR_CHNmobchn").change()}, 1);
			$("#MobileChnSwitch").prop("checked", mobile[sel].VideoSwitch);	
		setTimeout(function(){
			DivBox("#MobileChnSwitch", "#MobileDivBoxAll");},0);
	}
	
	//通道改变
	$("#NVR_CHNmobchn").change(function(){
		var chid = $("#NVR_CHNmobchn").val()*1;
		$("#NVR_CHNMobStreamMode option[value='2']").remove();
		if(IpcAbility[chid].ProtocolType == 5){//Urmet协议
			$("#NVR_CHNMobStreamMode").append('<option class="option" value="2">'+lg.get("IDS_SUGGESTED_VAL")+'</option>');
		}
		if(((IpcAbility[chid].Abilities>>2) & 1) == 0){
			$("#NVR_CHNmobchn").val(sel);
			ShowPaop($("#NVR_config_mobilestream").text(), lg.get("IDS_CH")+(chid+1)+" "+lg.get("IDS_CHN_FAILED"));//不支持此功能
			return;
		}
		sel = chid;
		
		$("#NVR_CHNMobStreamMode").val(mobile[sel].BitRateMode);//BitrateMode
		if($("#NVR_CHNMobStreamMode").val()*1 == 0)//Preset
		{
			//共用同一位置
			$("#NVR_mob_UserDefineBitrate").css("display","none");
			$("#NVR_mob_PresetBitrate").css("display","block");
			
			//Preset下的Bitrate，获取列表，赋值
			$("#NVR_mobPresetBitrate").empty();//Preset下的Bitrate
			for(var i=0; i< mobValue.length; i++){
				if((mobile[sel].BitrateRange[mobile[sel].ResolutionsetIndex]>>i)&1 == 1)//某个通道&&某个Resolution下的Bitrate范围
					$("#NVR_mobPresetBitrate").append('<option class="option" value="'+i+'">'+mobValue[i]+'</option>');
			}
			$("#NVR_mobPresetBitrate").val(mobile[sel].Bitrate);
			$("#NVR_mobUserDefineBitrate").val(mobile[sel].CustomBitrate);
		}
		else
		{
			//共用同一位置
			$("#NVR_mob_PresetBitrate").css("display","none");
			$("#NVR_mob_UserDefineBitrate").css("display","block");
			
			//UserDefine下的Bitrate赋值，加后缀
			$("#NVR_mobUserDefineBitrate").val(mobile[sel].CustomBitrate);
			for(var i=0; i< mobValue.length; i++){
				if((mobile[sel].BitrateRange[mobile[sel].ResolutionsetIndex]>>i)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
					if(minBitrate == 0){
						minBitrate = mobValue[i];
						maxBitrate = mobValue[i];
					}
					if(mobValue[i] > maxBitrate){
						maxBitrate = mobValue[i];
					}
				}
			}
			document.getElementById('NVR_mob_UserDefine_BitrateRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
		}

		//Audio
		if(mobile[sel].HaveAudio == 1){//显示
			$("#NVR_mobAudio").css("display","block");
			$("#NVR_mobAudioSel").val(mobile[sel].AudioSwitch);//Audio赋值		
		}else{//隐藏
			$("#NVR_mobAudio").css("display","none");
		}
		//$("#NVR_mobFPS_Sel").val(mobile[sel].Fps - 1);
		//$("#NVR_mobResolutionSel").val(mobile[sel].VideoQuality);
		
		//Resolution获取列表，赋值
		if(mobile[sel].Num == 0){
			$("#NVR_mobResolutionSel").empty();//Resolution
		}else{
			var j = 0;
			$("#NVR_mobResolutionSel").empty();
			for (j; j<mobile[sel].Num; j++){
				$("#NVR_mobResolutionSel").append('<option class="option" value="'+j+'">'+mobile[sel].ResolutionWidth[j]+"x"+mobile[sel].ResolutionHight[j]+'</option>');
			}
			$("#NVR_mobResolutionSel").val(mobile[sel].ResolutionsetIndex);
		}
		
		//FPS获取列表，赋值
		var MaxFps = mobile[sel].FrameRateMax[mobile[sel].ResolutionsetIndex];//某个通道&&某个Resolution下的FPS最大值
		$("#NVR_mobFPS_Sel").empty();
		for (var k=mobile[sel].FrameRateMin[mobile[sel].ResolutionsetIndex]; k<=MaxFps; k++){//某个通道&&某个Resolution下的FPS最小值
			$("#NVR_mobFPS_Sel").append('<option class="option" value='+k+' >'+k+'</option>');
		}
		$("#NVR_mobFPS_Sel").val(mobile[sel].Fps);
		if($("#NVR_CHNMobStreamMode").val()*1 == 2){
				$("#NVR_mobFPS_Sel").change();
			}
		
		//前面的(gDvr.nAudio)个通道，才显示Audio
		if (sel >= gDvr.nAudio){
			$("#NVR_mobAudio").css("display", "none");
		}
		
		$("#MobileChnSwitch").prop("checked", mobile[sel].VideoSwitch);	
		if(IpcAbility[sel].ProtocolType == 2){//三星IPC隐藏 Bitrate Mode
			$("#MobBitrateModeDiv").css("display","none");
		}else{
			$("#MobBitrateModeDiv").css("display","block");
		}
		
		//判断是否显示H.265选项  2015/06/16 ly
		if(1){//之前只有H265打开，现在全部打开
			if(IpcAbility[sel].IPCDevTypeFlag == 1 || IpcAbility[sel].IPCDevTypeFlag == 2){
				//$("#NVR_codetype_div").css("display","block");
				$("#NVR_bit_ctrl_mobile").css("display","block");
				if(mobile[sel].BitrateType == 1){
					$("#NVR_bit_quality_mobile").css("display","block");
				}else{
					$("#NVR_bit_quality_mobile").css("display","none");
				}
			}else{
				//$("#NVR_codetype_div").css("display","none");
				$("#NVR_bit_ctrl_mobile").css("display","none");
				$("#NVR_bit_quality_mobile").css("display","none");
			}
			
			if(IpcAbility[sel].IPCDevTypeFlag == 2 || IpcAbility[sel].IPCDevTypeFlag == 4){
				$("#NVR_codetype_div_mobile").css("display","block");
			}else{
				$("#NVR_codetype_div_mobile").css("display","none");
			}
			
			$("#NVR_CHNBMcodetype_mobile").val(mobile[sel].VideoEncType);
			$("#NVR_CHNBMbitctrl_mobile").val(mobile[sel].BitrateType);
			$("#NVR_CHNBMbitquality_mobile").val(mobile[sel].VideoQuality);
			
		}
		setTimeout(function(){
			DivBox("#MobileChnSwitch", "#MobileDivBoxAll");},0);
	});
	
	//Resolution改变 
	$("#NVR_mobResolutionSel").change(function(){
	    var chid = $("#NVR_CHNmobchn").val()*1;//Channel
		mobile[chid].ResolutionsetIndex = $("#NVR_mobResolutionSel").val()*1;//Resolution
		var MaxFps = mobile[chid].FrameRateMax[mobile[chid].ResolutionsetIndex];//某个通道&&某个Resolution下的FPS最大值
		$("#NVR_mobFPS_Sel").empty();
		for (var i=mobile[chid].FrameRateMin[mobile[chid].ResolutionsetIndex]; i<=MaxFps; i++){//某个通道&&某个Resolution下的FPS最小值
			$("#NVR_mobFPS_Sel").append('<option class="option" value='+i+' >'+i+'</option>');
		}
		$("#NVR_mobFPS_Sel").val(mobile[chid].Fps);
		/*
		//Preset下的Bitrate，获取列表，赋值
		$("#NVR_mobPresetBitrate").empty();
		for(var i=0; i< mobValue.length; i++){
			if((mobile[chid].BitrateRange[mobile[chid].ResolutionsetIndex]>>i)&1 == 1)//某个通道&&某个Resolution下的Bitrate范围
				$("#NVR_mobPresetBitrate").append('<option class="option" value="'+i+'">'+mobValue[i]+'</option>');
		}
		$("#NVR_mobPresetBitrate").val(mobile[sel].Bitrate);
		*/
		//Preset下的Bitrate，获取列表，赋值
		if($("#NVR_CHNMobStreamMode").val()*1 == 0)//Preset
		{
			$("#NVR_mobPresetBitrate").empty();
			var itemCount = 0;
			var curBitrateIndexMin;
			var curBitrateIndexMax;
			for(var i=0; i< mobValue.length; i++){
				if((mobile[chid].BitrateRange[mobile[chid].ResolutionsetIndex]>>i)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
					$("#NVR_mobPresetBitrate").append('<option class="option" value="'+i+'">'+mobValue[i]+'</option>');
					//
					itemCount++;
					if(itemCount==1){
						curBitrateIndexMin = i;
					}
					curBitrateIndexMax = i;
					//
				}
			}
			if(mobile[chid].Bitrate >= curBitrateIndexMin && mobile[chid].Bitrate<= curBitrateIndexMax){
				$("#NVR_mobPresetBitrate").val(mobile[chid].Bitrate);
			}else{
				mobile[chid].Bitrate = curBitrateIndexMin;
				$("#NVR_mobPresetBitrate").val(curBitrateIndexMin);
			}
		}else{
			//UserDefine下的Bitrate赋值，加后缀
			minBitrate = 0;
			maxBitrate = 0;
			$("#NVR_mob_UserDefineBitrate").val(mobile[chid].CustomBitrate);
			for(var i=0; i< mobValue.length; i++){
				if((mobile[chid].BitrateRange[mobile[chid].ResolutionsetIndex]>>i)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
					if(minBitrate == 0){
						minBitrate = mobValue[i];//32
						maxBitrate = mobValue[i];//8192
					}
					if(mobValue[i] > maxBitrate){
						maxBitrate = mobValue[i];
					}
				}
			}
			document.getElementById('NVR_mob_UserDefine_BitrateRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
			checkDefineDMaliuRange();
			mobile[chid].CustomBitrate = $("#NVR_mob_UserDefineBitrate").val();
		}
		if(lgCls.version == "URMET"){
			AutoChangeBitrate();
		}
	});
	
	//FPS 改变
	$("#NVR_mobFPS_Sel").change(function(){
		var chid = $("#NVR_CHNmobchn").val()*1;
		/*
		if(mobile[chid].FrameRateMin==0 && mobile[chid].FrameRateMax==0){
			mobile[chid].Fps = $("#NVR_mobFPS_Sel").val()*1 + 1;
		}else{
			mobile[chid].Fps = $("#NVR_mobFPS_Sel").val()*1;
		}*/
		mobile[chid].Fps = $("#NVR_mobFPS_Sel").val()*1;
		if(lgCls.version == "URMET"){
			if(IpcAbility[chid].ProtocolType == 5 && $("#NVR_CHNMobStreamMode").val()*1 == 2){// Urmet协议 2015.04.22
				$("#NVR_mobUserDefineBitrate").val(suggested[$("#NVR_mobFPS_Sel").val()*1 - 1]);
			}else{
				AutoChangeBitrate();
			}
		}
	});
	
	//BitrateMode 改变
	$("#NVR_CHNMobStreamMode").change(function(){
		var chid = $("#NVR_CHNmobchn").val()*1;
		mobile[chid].BitRateMode = $("#NVR_CHNMobStreamMode").val()*1;
		if( mobile[chid].BitRateMode == 0)//Preset
		{
			//共用同一位置
			$("#NVR_mob_UserDefineBitrate").css("display", "none");
			$("#NVR_mob_PresetBitrate").css("display", "block");
			
			//Preset下的Bitrate，获取列表，赋值
			$("#NVR_mobPresetBitrate").empty();
			var itemCount = 0;
			var curBitrateIndexMin;
			var curBitrateIndexMax;
			for(var i=0; i< mobValue.length; i++){
				if((mobile[chid].BitrateRange[mobile[chid].ResolutionsetIndex]>>i)&1 == 1){
					$("#NVR_mobPresetBitrate").append('<option class="option" value="'+i+'">'+mobValue[i]+'</option>');
					//
					itemCount++;
					if(itemCount==1){
						curBitrateIndexMin = i;
					}
					curBitrateIndexMax = i;
					//
				}
			}
			if(mobile[chid].Bitrate >= curBitrateIndexMin && mobile[chid].Bitrate <= curBitrateIndexMax){//索引比较
				$("#NVR_mobPresetBitrate").val(mobile[chid].Bitrate);
			}else{
				mobile[chid].Bitrate = curBitrateIndexMin;
				$("#NVR_mobPresetBitrate").val(curBitrateIndexMin);
			}
		}else//User Define
		{
			//共用同一位置
			$("#NVR_mob_PresetBitrate").css("display", "none");
			$("#NVR_mob_UserDefineBitrate").css("display", "block");
			minBitrate = 0;
			maxBitrate = 0;
			//UserDefine下的Bitrate赋值，加后缀
			$("#NVR_mobUserDefineBitrate").val(mobValue[mobile[chid].Bitrate]);
			mobile[chid].CustomBitrate = mobValue[mobile[chid].Bitrate];
			for(var i=0; i< mobValue.length; i++){
				if((mobile[chid].BitrateRange[mobile[chid].ResolutionsetIndex]>>i)&1 == 1){
					if(minBitrate == 0){
						minBitrate = mobValue[i];//32
						maxBitrate = mobValue[i];//8192
					}
					if(mobValue[i] > maxBitrate){
						maxBitrate = mobValue[i];
					}
				}
			}
			document.getElementById('NVR_mob_UserDefine_BitrateRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
			if($("#NVR_CHNMobStreamMode").val()*1 == 2){
				$("#NVR_mobFPS_Sel").change();
			}
		}
	});
	
	//Preset下的Bitrate 改变
	$("#NVR_mobPresetBitrate").change(function(){
		var chid = $("#NVR_CHNmobchn").val()*1;//Channel
		switch(lgCls.version){
			case "LOREX":{
				if(gDvr.DevType == 3 || gDvr.DevType == 4)
					break;		
				return;
			}
			default:{
				break;
			}
		}
		
		mobile[chid].Bitrate = $("#NVR_mobPresetBitrate").val()*1;//Preset下的Bitrate //22（4096）
		//mobile[chid].CustomBitrate = mobValue[mobile[chid].Bitrate];
		//为了不让UserDefine下Bitrate的值为空
		$("#NVR_mobUserDefineBitrate").val(mobValue[mobile[chid].Bitrate]);//mainValue[22] == 4096 //UserDefine时Bitrate的值
	});
	
	//Audio 改变
	$("#NVR_CHNBMma").change(function(){
		var chid = $("#NVR_CHNmobchn").val()*1;//Channel
		mobile[chid].AudioSwitch = $("#NVR_CHNBMma").val()*1;//Audio
	});	
	
	
	//刷新 按钮
	$("#NVR_CHNMOBILEBMRf").click(function(){
		//MasklayerShow();
		g_bClickDefBtn = false;
		if(lgCls.version == "URMET"){//通知板端更新当前通道数据
			RfParamCall(Call, $("#NVR_config_mobilestream").text(), "MobNEncode", 101 + sel, "Get");
		}
		RfParamCall(Call, $("#NVR_config_mobilestream").text(), "MobNEncode", 100, "Get");
	});
	
	//默认 按钮
	$("#NVR_CHNMOBILEBMDf").click(function(){
		//MasklayerShow();
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#NVR_config_mobilestream").text(), "MobNEncode", 850, "Get");
	});
	
	//保存 按钮
	$("#NVR_CHNMOBILEBMSV").click(function(){
		//MasklayerShow();
		if(mobile[sel].BitRateMode == 0){
			mobile[sel].CustomBitrate = mobValue[mobile[sel].Bitrate];
		}else{
			mobile[sel].CustomBitrate = document.getElementById("NVR_mobUserDefineBitrate").value;//4096 //UserDefine下Bitrate的值
		}
		RfParamCall(Call, $("#NVR_config_mobilestream").text(), "MobNEncode", 300, "Set", SaveArray());	
	});
	
	//废弃
	$("#NVR_CHNmobUseXML").click(function(){
		DivBox("#NVR_CHNmobUseXML", "#NVR_CHNmobDivBoxXML");
	});
			   
	//废弃
	$("#NVR_mob_subtag_0").mouseover(function(){
		$(this).css("color","#936");
	}).mouseout(function(){
		$(this).css("color","#FFF");
	}).click(function(){
		gStreamSet = 1;		
		showConfigChild($("#NVR_mob_stream_set").attr("id"));
	});
	
	//废弃	
	$("#NVR_mob_smalltag_0").mouseover(function(){
		$(this).css("color","#936");
	}).mouseout(function(){
		$(this).css("color","#FFF");
	}).click(function(){
		gStreamSet = 2;
		showConfigChild($("#NVR_mob_stream_set").attr("id"));
	});   
	
	var bmCopyXml="";
	//下面的Copy按钮
	$("#NVR_mobOk").click(function(){
		if(IpcAbility[sel].ProtocolType!=0 && IpcAbility[sel].ProtocolType!=5){
			return;
		}
		var num = 0;
		$("#NVR_mobCopyTD").css("display", "none");
		
		$("input[id^='mob_ch']").each(function(i){
			//$.each($("input[id^='mob_ch']"),function(i){
			var index = IsCopy(i);
			if($(this).prop("checked") && (IpcAbility[i].ProtocolType==IpcAbility[sel].ProtocolType)){
				mobile[i].VideoQuality = mobile[sel].VideoQuality;
				if(mobile[i].HaveAudio == mobile[sel].HaveAudio){
					mobile[i].AudioSwitch = mobile[sel].AudioSwitch;
				}
				mobile[i].VideoSwitch = mobile[sel].VideoSwitch;
				if(index != -1){
					mobile[i].ResolutionsetIndex = index;
					mobile[i].BitRateMode = mobile[sel].BitRateMode;
					if(mobile[i].BitRateMode == 0){
						mobile[i].CustomBitrate = mobValue[mobile[sel].Bitrate];
					}else{
						mobile[i].CustomBitrate = document.getElementById("NVR_mobUserDefineBitrate").value;
					}
					mobile[i].Fps = mobile[sel].Fps;
					mobile[i].Bitrate = mobile[sel].Bitrate;
					mobile[i].BitrateType = mobile[sel].BitrateType;
					mobile[i].VideoEncType = mobile[sel].VideoEncType;
				}
				num++;
			}
		});
		
		
		if (num != 0){
			ShowPaop($("#NVR_config_mobilestream").text(), lg.get("IDS_COPY_SUC"));
		}
	})
	
	
	
	//cal the copy data
	function CalCopyData(count){
		var tempCif = 0;
		if(gDvr.nMainType == 0x52530000) //9216H device 
		{
		var i = $("#NVR_mobResolutionSel").val()*1;
		switch(i){
			case 0:	//D1
				tempCif = ($("#NVR_mobFPS_Sel").val()*1 + 1) * 4;
				break;
			case 1:	//HD1
				tempCif = ($("#NVR_mobFPS_Sel").val()*1 + 1) * 2;
				break;
			case 2: //CIF
				tempCif = $("#NVR_mobFPS_Sel").val()*1 + 1;
				break;
		}
		
		var remainCif = TotalCif - tempCif*count; 
		var msg = "err";
		if(remainCif <0)
		{
			msg = lg.get("IDS_COPY_FAILED");
		   //PaopSuccess($("#code_config").text(),msg+remainCif);
		   return 0;
		}
		   msg = lg.get("IDS_COPY_SUC");
		  //PaopSuccess($("#code_config").text(), msg+remainCif);
		return 1;
	}
	     msg = lg.get("IDS_COPY_SUC");
		  //PaopSuccess($("#code_config").text(), msg);
		return 1;
	}
	
	function IsCopy(chid){
		if(chid == sel)
			return -1;
		var curBitrate = 0;
		if(mobile[sel].BitRateMode == 0){
			curBitrate = mobValue[mobile[sel].Bitrate];
		}else{
			curBitrate = document.getElementById("NVR_mobUserDefineBitrate").value;
		}
		var curWidth = mobile[sel].ResolutionWidth[$("#NVR_mobResolutionSel").val()*1];
		var curHight = mobile[sel].ResolutionHight[$("#NVR_mobResolutionSel").val()*1];
		var curFps = mobile[sel].Fps;
		for(var i=0; i<mobile[chid].Num; i++){
			if( (curWidth!= mobile[chid].ResolutionWidth[i]) || (curHight!= mobile[chid].ResolutionHight[i]) ){
				continue;
			}
			if( (curFps<mobile[chid].FrameRateMin[i]) || (curFps>mobile[chid].FrameRateMax[i]) ){
				continue;
			}
			var minTemp = 0;
			var maxTemp = 0;
			for(var j=0; j< mobValue.length; j++){
				var temp = mobile[chid].i;
				if((mobile[chid].BitrateRange[i]>>j)&1 == 1){
					if(minTemp == 0){
						minTemp = mobValue[j];
						maxTemp = mobValue[j];
					}
					if(mobValue[j] > maxTemp){
						maxTemp = mobValue[j];
					}
				}
			}
			if( (curBitrate<minTemp) || (curBitrate>maxTemp) ){
				continue;
			}else{
				return i;
			}
		}
		return -1;
	}

	//界面处理	
	$("#MobileChnSwitch").click(function(){	//启用移动侦测 
		mobile[sel].VideoSwitch = $("#MobileChnSwitch").prop("checked")*1;
		setTimeout(function(){
			DivBox("#MobileChnSwitch", "#MobileDivBoxAll");},0);
	});
	$("#NVR_mobAudioSel").change(function(){
		var chid = $("#NVR_CHNmobchn").val()*1;//Channel
		mobile[chid].AudioSwitch = $("#NVR_mobAudioSel").val()*1;//Audio
	});
	$("#NVR_CHNBMcodetype_mobile").change(function(){
		mobile[sel].VideoEncType = $("#NVR_CHNBMcodetype_mobile").val();
	});
	
	$("#NVR_CHNBMbitctrl_mobile").change(function(){
		mobile[sel].BitrateType = $("#NVR_CHNBMbitctrl_mobile").val();
		if(mobile[sel].BitrateType == 1){
			$("#NVR_bit_quality_mobile").css("display","block");
		}else{
			$("#NVR_bit_quality_mobile").css("display","none");
		}
	});
	
	$("#NVR_CHNBMbitquality_mobile").change(function(){
		mobile[sel].VideoQuality = $("#NVR_CHNBMbitquality_mobile").val();
	});
	
	function AutoChangeBitrate(){//Urmet 自动切换比特率
		$("#NVR_CHNMobStreamMode").val(1);
		$("#NVR_CHNMobStreamMode").change();
		var suggestBit;
		var curRes = document.all.NVR_mobResolutionSel[document.all.NVR_mobResolutionSel.selectedIndex].text;
		var curFps = $("#NVR_mobFPS_Sel").val();
		if (curRes == "1920x1080"){
			if (curFps >= 24) suggestBit = 4096;
			else if (curFps >= 20) suggestBit = 3584;
			else if (curFps >= 16) suggestBit = 3072;
			else if (curFps >= 12) suggestBit = 2560;
			else if (curFps >= 9) suggestBit = 2048;
			else if (curFps >= 6) suggestBit = 1536;
			else if (curFps >= 4) suggestBit = 1024;
			else if (curFps >= 1) suggestBit = 512;
		}else if((curRes == "1280x720") || (curRes == "1280x960")){
			if (curFps >= 24) suggestBit = 3072;
			else if (curFps >= 20) suggestBit = 2688;
			else if (curFps >= 16) suggestBit = 2304;
			else if (curFps >= 12) suggestBit = 1920;
			else if (curFps >= 9) suggestBit = 1536;
			else if (curFps >= 6) suggestBit = 1152;
			else if (curFps >= 4) suggestBit = 768;
			else if (curFps >= 1) suggestBit = 384;
		}else if ((curRes == "704x576") || (curRes == "640x480")
				 || (curRes == "640x360")){
			if (curFps >= 24) suggestBit = 2048;
			else if (curFps >= 20) suggestBit = 1792;
			else if (curFps >= 16) suggestBit = 1536;
			else if (curFps >= 12) suggestBit = 1280;
			else if (curFps >= 9) suggestBit = 1024;
			else if (curFps >= 6) suggestBit = 768;
			else if (curFps >= 4) suggestBit = 512;
			else if (curFps >= 1) suggestBit = 256;
		}else if ((curRes == "352x288") || (curRes == "320x240")){
			if (curFps >= 24) suggestBit = 1024;
			else if (curFps >= 20) suggestBit = 896;
			else if (curFps >= 16) suggestBit = 768;
			else if (curFps >= 12) suggestBit = 640;
			else if (curFps >= 9) suggestBit = 512;
			else if (curFps >= 6) suggestBit = 384;
			else if (curFps >= 4) suggestBit = 256;
			else if (curFps >= 1) suggestBit = 128;
		}
		$("#NVR_mobUserDefineBitrate").val(suggestBit);
	}
});

function checkDefineDMaliuRule(){
	document.getElementById("NVR_mobUserDefineBitrate").value = document.getElementById("NVR_mobUserDefineBitrate").value.replace(/[^\d]/g,'');
}

function checkDefineDMaliuRange(){
	//document.getElementById("NVR_mobUserDefineBitrate").value = document.getElementById("NVR_mobUserDefineBitrate").value.replace(/[^\d]/g,'');
	if(document.getElementById("NVR_mobUserDefineBitrate").value > maxBitrate)
		document.getElementById("NVR_mobUserDefineBitrate").value= maxBitrate;
	if(document.getElementById("NVR_mobUserDefineBitrate").value < minBitrate)
		document.getElementById("NVR_mobUserDefineBitrate").value= minBitrate;
}