// JavaScript Document

var maxBitrate = 0;
var minBitrate = 0;
$(document).ready(function(){
	if(lgCls.version == "URMET"){
		g_bDefaultShow = true;
	}
	
	if(lgCls.version == "OWL" || lgCls.version == "URMET" || lgCls.version == "HONEYWELL" || gDvr.hybirdDVRFlag==1){
		$("#NVR_CHNSUBBMCP").css("display","block");
	}
	
	if(g_bDefaultShow == true){
			$("#NVR_CHNSUBBMDf").css("display","block");
	}
	
	if(gDvr.nChannel==1)
	{
		$("#NVR_SUB_CHN_TABLE").css("display","none");
		$("#NVR_CHNSUBBMCP").css("display","none");
	}
	
	var sel = -1;
	var subb;
	//var defaultSubFps = 5;
	//var tempSubfps = 5;
	//var totalSubFps = 60;
	//          0 1  2  3  4  5  6  7  8   9   10  11  12  13  14  15  16  17  18   19   20   21   22   23
	subValue = [8,16,24,32,48,64,80,96,128,160,192,224,256,320,384,448,512,768,1024,1536,2048,3072,4096,5120];
	
	$("#NVR_table_subvideo").css("display","none");
	
	//显示复制通道
	$("#NVR_CHNSUBBMCP").click(function(){
		$("#NVR_submck").prop("checked",false);
		if(gDvr.hybirdDVRFlag==1){
			copyTD("#NVR_subSubCopyTD","sub_ch","NVR_subSub_TDNum",gDvr.AnalogChNum);
		}else{
			copyTD("#NVR_subSubCopyTD","sub_ch","NVR_subSub_TDNum");
			$.each($("input[id^='sub_ch']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("sub_ch")[1]*1 - 1;
				if((IpcAbility[index].State != 2) || (((IpcAbility[index].Abilities>>1) & 1) == 0)){
					$(this).prop("disabled",true);
				}
			})
		}
	})
	
	//全选
	$("#NVR_submck").click(function(){
		$.each($("input[id^='sub_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("sub_ch")[1]*1 - 1;
			if((IpcAbility[index].State == 2) && (((IpcAbility[index].Abilities>>1) & 1) == 1)){
				$(this).prop("checked",$("#NVR_submck").prop("checked"));
			}
		})
		//$("input[id^='sub_ch']").prop("checked",$(this).prop("checked"));
	})	
	
	var TvSystem = gDvr.nVideoFormat;	//制式 PAL(0) -- 400  NTSC(1) -- 480 
	
	/*
	if(lgCls.version == "URMET"){
		suggested = [48,96,128,192,256,320,320,384,384,448,512,512,512,640,640,640,768,768,768,896,896,896,1024,1024,1024];
	}
	*/
	
	function subb(BitRateMode, CustomBitrate, Bitrate, VideoQuality, Fps, AudioSwitch, ResolutionsetIndex, Num, HaveAudio, BitrateType, VideoEncType){	//结构体格式定义 
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
		this.BitrateRange = new Array(8);
		this.FrameRateMin = new Array(8);
		this.FrameRateMax = new Array(8);
		this.ResolutionWidth = new Array(8);
		this.ResolutionHight = new Array(8);
	}
	
	for (var i=0; i<gDvr.nChannel; i++){
		subb[i] = new subb(0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
	
	function InitArray(xml){	//初始化数组 --xml ->  struct
		for (var i=0; i<gDvr.nChannel; i++){
			subb[i].BitRateMode = findChildNode(i+"Struct", "BitRateMode", xml)*1;
			subb[i].CustomBitrate = findChildNode(i+"Struct", "CustomBitrate", xml)*1;
			subb[i].Bitrate = findChildNode(i+"Struct", "Bitrate", xml)*1;
			subb[i].VideoQuality = findChildNode(i+"Struct", "VideoQuality", xml)*1;
			subb[i].Fps = findChildNode(i+"Struct", "Fps", xml)*1;
			subb[i].AudioSwitch = findChildNode(i+"Struct", "AudioSwitch", xml)*1;
			subb[i].ResolutionsetIndex = findChildNode(i+"Struct", "ResolutionsetIndex", xml)*1;
			subb[i].Num = findChildNode(i+"Struct", "Num", xml)*1;
			subb[i].HaveAudio = findChildNode(i+"Struct", "HaveAudio", xml)*1;
			subb[i].BitrateType = findChildNode(i+"Struct", "BitrateType", xml)*1;
			subb[i].VideoEncType = findChildNode(i+"Struct", "VideoEncType", xml)*1;
			for(var n=0; n<8; n++){
				subb[i].BitrateRange[n] = findChildNode(i+"Struct", "BitrateRange"+n, xml)*1;
			}
			for(var l=0; l<8; l++){
				subb[i].FrameRateMin[l] = findChildNode(i+"Struct", "FrameRateMin"+l, xml)*1;
			}
			for(var m=0; m<8; m++){
				subb[i].FrameRateMax[m] = findChildNode(i+"Struct", "FrameRateMax"+m, xml)*1;
			}
			for(var j=0; j<8; j++){
				subb[i].ResolutionWidth[j] = findChildNode(i+"Struct", "ResolutionWidth"+j, xml)*1;
			}
			for(var k=0; k<8; k++){
				subb[i].ResolutionHight[k] = findChildNode(i+"Struct", "ResolutionHight"+k, xml)*1;
			}
		}
	}
	
	function SaveArray(){	//获取xml  ---  struct ->  xml
		var xml = "<a>";
		
		xml += ("<chnnum>"+gDvr.nChannel+"</chnnum>");
		for (var i=0; i<gDvr.nChannel; i++){
			if(subb[i].BitRateMode==0 &&subb[i].CustomBitrate != subValue[subb[i].BitRateMode]){
				subb[i].CustomBitrate = subValue[subb[i].BitRateMode]
			}
			xml += ("<Struct"+i+">\
					<BitRateMode>"+subb[i].BitRateMode+"</BitRateMode>"+
					"<CustomBitrate>"+subb[i].CustomBitrate+"</CustomBitrate>"+
					"<Bitrate>"+subb[i].Bitrate+"</Bitrate>"+
					"<VideoQuality>"+subb[i].VideoQuality+"</VideoQuality>"+
					"<Fps>"+subb[i].Fps+"</Fps>"+
					"<AudioSwitch>"+subb[i].AudioSwitch+"</AudioSwitch>"+
					"<BitrateType>"+subb[i].BitrateType+"</BitrateType>"+
					"<VideoEncType>"+subb[i].VideoEncType+"</VideoEncType>"+
					"<ResolutionsetIndex>"+subb[i].ResolutionsetIndex+"</ResolutionsetIndex>\
			</Struct"+i+">");
		}

		xml += "</a>";
		return xml;
	}
	
	$(function(){	//初始化时填充界面元素
		$("#NVR_CHNSUBBMchn").empty();
		
		
		for(var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2){	
				if(sel==-1 && ((((IpcAbility[i].Abilities>>1) & 1) == 1&&IpcAbility[i].NewDevAbilityModeFlag != 1) || (IpcAbility[i].NewDevAbilityModeFlag == 1&&((IpcAbility[i].Abilities>>14) & 1) == 0))){
					sel = i;
				}
				$("#NVR_CHNSUBBMchn").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
		}
		
		//$("#NVR_CHNSUBBMchn").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
		if(sel == -1){
			sel = 0;
		}
		
		RfParamCall(Call, $("#NVR_second").text(), "SubNEncode", 100, "Get");	//初始时获取页面数据
	});
	
	function Call(xml){
			$("#NVR_CHNSubStreamMode option[value='2']").remove();
			if(IpcAbility[sel].ProtocolType == 5){//Urmet协议
				$("#NVR_CHNSubStreamMode").append('<option class="option" value="2">'+lg.get("IDS_SUGGESTED_VAL")+'</option>');
			}
			InitArray(xml);
			if(IpcAbility[sel].ProtocolType == 2){//三星IPC Bitrate 为输入框
				subb[sel].BitRateMode = 1;
			}
			
			if( subb[sel].BitRateMode == 0)
			{
				$("#NVR_DefineSubStream").css("display","none");
				$("#NVR_SubStream").css("display","block");
			}
			else
			{
				$("#NVR_SubStream").css("display","none");
				$("#NVR_DefineSubStream").css("display","block");
				minBitrate = 0;
				maxBitrate = 0;
				for(var i=0; i< subValue.length; i++){
					if((subb[sel].BitrateRange[subb[sel].ResolutionsetIndex]>>i)&1 == 1){
						if(minBitrate == 0){
							minBitrate = subValue[i];
							maxBitrate = subValue[i];
						}
						if(subValue[i] > maxBitrate){
							maxBitrate = subValue[i];
						}
					}
				}
				document.getElementById('NVR_DefineXMaLiuRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
			}
			
			$("#NVR_CHNSUBBMchn").val(sel);
			
			if(subb[sel].Num == 0){
				$("#NVR_CHNBMsSl").empty();
			}else{
				var j = 0;
				$("#NVR_CHNBMsSl").empty();
				for (j; j<subb[sel].Num; j++){
					$("#NVR_CHNBMsSl").append('<option class="option" value="'+j+'">'+subb[sel].ResolutionWidth[j]+"x"+subb[sel].ResolutionHight[j]+'</option>');
				}
				$("#NVR_CHNBMsSl").val(subb[sel].ResolutionsetIndex);
			}

			var MaxFps = subb[sel].FrameRateMax[subb[sel].ResolutionsetIndex];
			$("#NVR_CHNBMxzl").empty();
			for (var i=subb[sel].FrameRateMin[subb[sel].ResolutionsetIndex]; i<=MaxFps; i++){
				$("#NVR_CHNBMxzl").append('<option class="option" value='+i+' >'+i+'</option>');
			}
			$("#NVR_CHNBMxzl").val(subb[sel].Fps);
			
			$("#NVR_XMaLiu").empty();
			for(var i=0; i< subValue.length; i++){
				if((subb[sel].BitrateRange[subb[sel].ResolutionsetIndex]>>i)&1 == 1)
					$("#NVR_XMaLiu").append('<option class="option" value="'+i+'">'+subValue[i]+'</option>');
			}
			$("#NVR_XMaLiu").val(subb[sel].Bitrate);
			
			
			setTimeout(function(){
				$("#NVR_CHNSUBBMchn").change();
			},1);
	}
	//$("#NVR_CHNBMVideo").change(function(){
	//	subb[sel].video = $(this).val()*1;
	//})
	$("#NVR_CHNSUBBMchn").change(function(){	//通道改变
		var chid = $("#NVR_CHNSUBBMchn").val()*1;
		$("#NVR_CHNSubStreamMode option[value='2']").remove();
		if(IpcAbility[chid].ProtocolType == 5){//Urmet协议
			$("#NVR_CHNSubStreamMode").append('<option class="option" value="2">'+lg.get("IDS_SUGGESTED_VAL")+'</option>');
		}
		if(((IpcAbility[chid].Abilities>>1) & 1) == 0){
			$("#NVR_CHNSUBBMchn").val(sel);
			ShowPaop($("#NVR_second").text(), lg.get("IDS_CH")+(chid+1)+" "+lg.get("IDS_CHN_FAILED"));
			return;
		}
		sel = chid;
		
		$("#NVR_CHNSubStreamMode").val(subb[sel].BitRateMode);
		if($("#NVR_CHNSubStreamMode").val()*1 == 0)
		{
			$("#NVR_DefineSubStream").css("display","none");
			$("#NVR_SubStream").css("display","block");
			$("#NVR_XMaLiu").empty();
			for(var i=0; i< subValue.length; i++){
				if((subb[sel].BitrateRange[subb[sel].ResolutionsetIndex]>>i)&1 == 1)
					$("#NVR_XMaLiu").append('<option class="option" value="'+i+'">'+subValue[i]+'</option>');
			}
			$("#NVR_XMaLiu").val(subb[sel].Bitrate);
			$("#NVR_DefineXMaLiu").val(subb[sel].CustomBitrate);
		}
		else
		{
			$("#NVR_SubStream").css("display","none");
			$("#NVR_DefineSubStream").css("display","block");
			minBitrate = 0;
			maxBitrate = 0;
			$("#NVR_DefineXMaLiu").val(subb[sel].CustomBitrate);
			for(var i=0; i< subValue.length; i++){
				if((subb[sel].BitrateRange[subb[sel].ResolutionsetIndex]>>i)&1 == 1){
					if(minBitrate == 0){
						minBitrate = subValue[i];
						maxBitrate = subValue[i];
					}
					if(subValue[i] > maxBitrate){
						maxBitrate = subValue[i];
					}
				}
			}
			document.getElementById('NVR_DefineXMaLiuRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
		}
		//$("#NVR_CHNBMsSl").val(subb[sel].VideoQuality);
		//$("#NVR_CHNBMxzl").val(subb[sel].Fps-1);
		if(subb[sel].HaveAudio == 1){
			$("#NVR_SUBBJSDS").css("display","block");
			$("#NVR_CHNBMsa").val(subb[sel].AudioSwitch);		
		}else{
			$("#NVR_SUBBJSDS").css("display","none");
		}
		
		if(subb[sel].Num == 0){
			$("#NVR_CHNBMsSl").empty();
		}else{
			var j = 0;
			$("#NVR_CHNBMsSl").empty();
			for (j; j<subb[sel].Num; j++){
				$("#NVR_CHNBMsSl").append('<option class="option" value="'+j+'">'+subb[sel].ResolutionWidth[j]+"x"+subb[sel].ResolutionHight[j]+'</option>');
			}
			$("#NVR_CHNBMsSl").val(subb[sel].ResolutionsetIndex);
		}

		var MaxFps = subb[sel].FrameRateMax[subb[sel].ResolutionsetIndex];
		var MinFps = subb[sel].FrameRateMin[subb[sel].ResolutionsetIndex];
		$("#NVR_CHNBMxzl").empty();
		for (var i=MinFps; i<=MaxFps; i++){
			$("#NVR_CHNBMxzl").append('<option class="option" value='+i+' >'+i+'</option>');
		}
		if(subb[sel].Fps < MinFps || subb[sel].Fps > MaxFps){
			subb[sel].Fps = MinFps;
		}
		$("#NVR_CHNBMxzl").val(subb[sel].Fps);
		if($("#NVR_CHNSubStreamMode").val()*1 == 2){
				$("#NVR_CHNBMxzl").change();
			}
		
		if (sel >= gDvr.nAudio){
			$("#NVR_SUBBJSDS").css("display", "none")
		}
		if(gDvr.DevType == 4)
		{
			$("#NVR_SUBBJSDS").css("display", "none");
		}
		
		if(IpcAbility[sel].ProtocolType == 2){//三星IPC隐藏 Bitrate Mode
			$("#SubBitrateModeDiv").css("display","none");
		}else{
			$("#SubBitrateModeDiv").css("display","block");
		}
		
		//判断是否显示H.265选项  2015/06/16 ly
		if(1){//之前只有H265打开，现在全部打开
			if(IpcAbility[sel].IPCDevTypeFlag == 1 || IpcAbility[sel].IPCDevTypeFlag == 2){
				//$("#NVR_codetype_div").css("display","block");
				$("#NVR_bit_ctrl_sub").css("display","block");
				if(subb[sel].BitrateType == 1){
					$("#NVR_bit_quality_sub").css("display","block");
				}else{
					$("#NVR_bit_quality_sub").css("display","none");
				}
			}else{
				//$("#NVR_codetype_div").css("display","none");
				$("#NVR_bit_ctrl_sub").css("display","none");
				$("#NVR_bit_quality_sub").css("display","none");
			}
			
			if(IpcAbility[sel].IPCDevTypeFlag == 2 || IpcAbility[sel].IPCDevTypeFlag == 4){
				$("#NVR_codetype_div_sub").css("display","block");
			}else{
				$("#NVR_codetype_div_sub").css("display","none");
			}
			
			$("#NVR_CHNBMcodetype_sub").val(subb[sel].VideoEncType);
			$("#NVR_CHNBMbitctrl_sub").val(subb[sel].BitrateType);
			$("#NVR_CHNBMbitquality_sub").val(subb[sel].VideoQuality);
		}
		
		//隐藏Copy按钮
		if(gDvr.hybirdDVRFlag){
			if(sel<gDvr.AnalogChNum){//模拟通道才运行Copy
				$("#NVR_CHNSUBBMCP").css("display","block");
			}else{
				$("#NVR_CHNSUBBMCP").css("display","none");
				$("#NVR_subSubCopyTD").css("display","none");
			}
		}
		
		//自定义协议，隐藏码流设置
		setTimeout(function(){
			showDiv((IpcAbility[sel].ProtocolType >= 32), "#SubDivBoxAll");},0);
	});
	
	//子码流------------------------------------ 
	$("#NVR_CHNBMsSl").change(function(){	//分辨率改变 
	    var chid = $("#NVR_CHNSUBBMchn").val()*1;
		subb[chid].ResolutionsetIndex = $("#NVR_CHNBMsSl").val()*1;
		var MaxFps = subb[chid].FrameRateMax[subb[chid].ResolutionsetIndex];
		$("#NVR_CHNBMxzl").empty();
		for (var i=subb[chid].FrameRateMin[subb[chid].ResolutionsetIndex]; i<=MaxFps; i++){
			$("#NVR_CHNBMxzl").append('<option class="option" value='+i+' >'+i+'</option>');
		}
		$("#NVR_CHNBMxzl").val(subb[chid].Fps);
		if($("#NVR_CHNSubStreamMode").val()*1 == 0)
		{
			$("#NVR_XMaLiu").empty();
			var itemCount = 0;
			var curBitrateIndexMin;
			var curBitrateIndexMax;
			for(var i=0; i< subValue.length; i++){
				if((subb[chid].BitrateRange[subb[chid].ResolutionsetIndex]>>i)&1 == 1){
					$("#NVR_XMaLiu").append('<option class="option" value="'+i+'">'+subValue[i]+'</option>');
					//
					itemCount++;
					if(itemCount==1){
						curBitrateIndexMin = i;
					}
					curBitrateIndexMax = i;
					//
				}
			}
			if(subb[chid].Bitrate >= curBitrateIndexMin && subb[chid].Bitrate<= curBitrateIndexMax){
				$("#NVR_XMaLiu").val(subb[chid].Bitrate);
			}else{
				$("#NVR_XMaLiu").val(curBitrateIndexMin);
				subb[chid].Bitrate = curBitrateIndexMin;
			}
		}else{
			//UserDefine下的Bitrate赋值，加后缀
				minBitrate = 0;
				maxBitrate = 0;
				$("#NVR_DefineXMaLiu").val(subb[chid].CustomBitrate);
				for(var i=0; i< subValue.length; i++){
					if((subb[chid].BitrateRange[subb[chid].ResolutionsetIndex]>>i)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
						if(minBitrate == 0){
							minBitrate = subValue[i];//32
							maxBitrate = subValue[i];//8192
						}
						if(subValue[i] > maxBitrate){
							maxBitrate = subValue[i];
						}
					}
				}
				document.getElementById('NVR_DefineXMaLiuRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
				checkDefineXMaliuRange();
				subb[chid].CustomBitrate = $("#NVR_DefineXMaLiu").val();
		}
		if(lgCls.version == "URMET"){
			AutoChangeBitrate();
		}
	});
	
	
	$("#NVR_CHNBMxzl").change(function(){	//帧率改变
		var chid = $("#NVR_CHNSUBBMchn").val()*1;
		/*
		if(subb[chid].FrameRateMin==0 && subb[chid].FrameRateMax==0){
			subb[chid].Fps = $("#NVR_CHNBMxzl").val()*1 + 1;
		}else{
			subb[chid].Fps = $("#NVR_CHNBMxzl").val()*1;
		}*/
		subb[chid].Fps = $("#NVR_CHNBMxzl").val()*1;
		if(lgCls.version == "URMET"){
			if(IpcAbility[chid].ProtocolType == 5 && $("#NVR_CHNSubStreamMode").val()*1 == 2){// Urmet协议 2015.04.22
				$("#NVR_DefineXMaLiu").val(suggested[$("#NVR_CHNBMxzl").val()*1 - 1]);
			}else{
				AutoChangeBitrate();
			}
		}
	});
	
	$("#NVR_CHNSubStreamMode").change(function(){		//码流模式
		var chid = $("#NVR_CHNSUBBMchn").val()*1;
		subb[chid].BitRateMode = $("#NVR_CHNSubStreamMode").val()*1;
		if( subb[chid].BitRateMode == 0)//Preset
		{
			$("#NVR_DefineSubStream").css("display", "none");
			$("#NVR_SubStream").css("display", "block");
			$("#NVR_XMaLiu").empty();
			var itemCount = 0;
			var curBitrateIndexMin;
			var curBitrateIndexMax;
			for(var i=0; i< subValue.length; i++){
				if((subb[chid].BitrateRange[subb[chid].ResolutionsetIndex]>>i)&1 == 1){
					$("#NVR_XMaLiu").append('<option class="option" value="'+i+'">'+subValue[i]+'</option>');
					itemCount++;
					if(itemCount==1){
						curBitrateIndexMin = i;
					}
					curBitrateIndexMax = i;
				}
			}
			if(subb[chid].Bitrate >= curBitrateIndexMin && subb[chid].Bitrate <= curBitrateIndexMax){//索引比较
				$("#NVR_XMaLiu").val(subb[chid].Bitrate);
			}else{
				subb[chid].Bitrate = curBitrateIndexMin;
				$("#NVR_XMaLiu").val(curBitrateIndexMin);
			}
		}else{//User Define
			$("#NVR_SubStream").css("display", "none");
			$("#NVR_DefineSubStream").css("display", "block");
			minBitrate = 0;
			maxBitrate = 0;
			$("#NVR_DefineXMaLiu").val(subValue[subb[chid].Bitrate]);
			subb[chid].CustomBitrate = subValue[subb[chid].Bitrate];
			for(var i=0; i< subValue.length; i++){
				if((subb[chid].BitrateRange[subb[chid].ResolutionsetIndex]>>i)&1 == 1){
					if(minBitrate == 0){
						minBitrate = subValue[i];
						maxBitrate = subValue[i];
					}
					if(subValue[i] > maxBitrate){
						maxBitrate = subValue[i];
					}
				}
			}
			document.getElementById('NVR_DefineXMaLiuRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
			if($("#NVR_CHNSubStreamMode").val()*1 == 2){
				$("#NVR_CHNBMxzl").change();
			}
		}
	});
	
	$("#NVR_XMaLiu").change(function(){		//码流
		var chid = $("#NVR_CHNSUBBMchn").val()*1;
		subb[chid].Bitrate = $("#NVR_XMaLiu").val()*1;
		$("#NVR_DefineXMaLiu").val(subValue[subb[chid].Bitrate]);
	});
	
	$("#NVR_CHNBMsa").change(function(){		//录音
		var chid = $("#NVR_CHNSUBBMchn").val()*1;
		subb[chid].AudioSwitch = $("#NVR_CHNBMsa").val()*1;
	});	
	
	
	//界面操作  
	$("#NVR_CHNSUBBMRf").click(function(){
		//MasklayerShow();
		g_bClickDefBtn = false;
		if(lgCls.version == "URMET"){//通知板端更新当前通道数据
			RfParamCall(Call, $("#NVR_second").text(), "SubNEncode", 101 + sel, "Get");
		}
		RfParamCall(Call, $("#NVR_second").text(), "SubNEncode", 100, "Get");	//初始时获取页面数据 
	});
	  
	$("#NVR_CHNSUBBMDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#NVR_second").text(), "SubNEncode", 850, "Get");	//获取页面默认数据 
	});
	
	$("#NVR_CHNSUBBMSV").click(function(){
		//MasklayerShow();
		if(subb[sel].BitRateMode == 0){
			subb[sel].CustomBitrate = subValue[subb[sel].Bitrate];;
		}else{
			subb[sel].CustomBitrate = document.getElementById("NVR_DefineXMaLiu").value;
		}
		RfParamCall(Call, $("#NVR_second").text(), "SubNEncode", 300, "Set", SaveArray());	  
	});
	
	$("#NVR_maintag_1").mouseover(function(){
		$(this).css("color","#936");
	}).mouseout(function(){
		$(this).css("color","#FFF");
	}).click(function(){
		gStreamSet = 0;
		showConfigChild($("#NVR_stream_set").attr("id"));
	});
	
	$("#NVR_subtag_1").click(function(){
		return;
	});
		   
	$("#NVR_smalltag_1").mouseover(function(){
		$(this).css("color","#936");
	}).mouseout(function(){
		$(this).css("color","#FFF");
	}).click(function(){
		gStreamSet = 2;
		showConfigChild($("#NVR_stream_set").attr("id"));
	});   
	
	
	var bmCopyXml="";
	$("#NVR_subOk").click(function(){
		if(gDvr.hybirdDVRFlag==1){
			//
		}else{
			if(IpcAbility[sel].ProtocolType!=0 && IpcAbility[sel].ProtocolType!=5){
				return;
			}
		}
		
		var num = 0;
		$("input[id^='sub_ch']").each(function(i){
			var index = IsCopy(i);
			if(gDvr.hybirdDVRFlag==1){
				if($(this).prop("checked") /*&& (IpcAbility[i].ProtocolType==IpcAbility[sel].ProtocolType)*/){
					subb[i].VideoQuality = subb[sel].VideoQuality;
					subb[i].BitrateType = subb[sel].BitrateType;//混合DVR
					if(subb[i].HaveAudio == subb[sel].HaveAudio){
						subb[i].AudioSwitch = subb[sel].AudioSwitch;
					}
					if(index != -1){
						subb[i].ResolutionsetIndex = index;
						subb[i].BitRateMode = subb[sel].BitRateMode;
						if(subb[i].BitRateMode == 0){
							subb[i].CustomBitrate = subValue[subb[sel].Bitrate];
						}else{
							subb[i].CustomBitrate = document.getElementById("NVR_DefineXMaLiu").value;
						}
						subb[i].Fps = subb[sel].Fps;
						subb[i].Bitrate = subb[sel].Bitrate;
					}
					num++;
				}
			}else{
				if($(this).prop("checked") && (IpcAbility[i].ProtocolType==IpcAbility[sel].ProtocolType)){
					subb[i].VideoQuality = subb[sel].VideoQuality;
					if(subb[i].HaveAudio == subb[sel].HaveAudio){
						subb[i].AudioSwitch = subb[sel].AudioSwitch;
					}
					if(index != -1){
						subb[i].ResolutionsetIndex = index;
						subb[i].BitRateMode = subb[sel].BitRateMode;
						if(subb[i].BitRateMode == 0){
							subb[i].CustomBitrate = subValue[subb[sel].Bitrate];
						}else{
							subb[i].CustomBitrate = document.getElementById("NVR_DefineXMaLiu").value;
						}
						subb[i].Fps = subb[sel].Fps;
						subb[i].Bitrate = subb[sel].Bitrate;
						subb[i].BitrateType = subb[sel].BitrateType;
						subb[i].VideoEncType = subb[sel].VideoEncType;
					}
					num++;
				}
			}
		});	
			
		$("#NVR_subSubCopyTD").css("display", "none");
		if (num != 0){
			ShowPaop($("#NVR_second").text(), lg.get("IDS_COPY_SUC"));
		}
		
	})
	
	function IsCopy(chid){
		if(chid == sel)
			return -1;
		var curBitrate = 0;
		if(subb[sel].BitRateMode == 0){
			curBitrate = subValue[subb[sel].Bitrate];
		}else{
			curBitrate = document.getElementById("NVR_DefineXMaLiu").value;
		}
		var curWidth = subb[sel].ResolutionWidth[$("#NVR_CHNBMsSl").val()*1];
		var curHight = subb[sel].ResolutionHight[$("#NVR_CHNBMsSl").val()*1];
		var curFps = subb[sel].Fps;
		for(var i=0; i<subb[chid].Num; i++){
			if( (curWidth!= subb[chid].ResolutionWidth[i]) || (curHight!= subb[chid].ResolutionHight[i]) ){
				continue;
			}
			if( (curFps<subb[chid].FrameRateMin[i]) || (curFps>subb[chid].FrameRateMax[i]) ){
				continue;
			}
			var minTemp = 0;
			var maxTemp = 0;
			for(var j=0; j< subValue.length; j++){
				var temp = subb[chid].i;
				if((subb[chid].BitrateRange[i]>>j)&1 == 1){
					if(minTemp == 0){
						minTemp = subValue[j];
						maxTemp = subValue[j];
					}
					if(subValue[j] > maxTemp){
						maxTemp = subValue[j];
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
	$("#NVR_CHNBMcodetype_sub").change(function(){
		subb[sel].VideoEncType = $("#NVR_CHNBMcodetype_sub").val();
	});
	
	$("#NVR_CHNBMbitctrl_sub").change(function(){
		subb[sel].BitrateType = $("#NVR_CHNBMbitctrl_sub").val();
		if(subb[sel].BitrateType == 1){
			$("#NVR_bit_quality_sub").css("display","block");
		}else{
			$("#NVR_bit_quality_sub").css("display","none");
		}
	});
	
	$("#NVR_CHNBMbitquality_sub").change(function(){
		subb[sel].VideoQuality = $("#NVR_CHNBMbitquality_sub").val();
	});
	
	function AutoChangeBitrate(){//Urmet 自动切换比特率
		$("#NVR_CHNSubStreamMode").val(1);
		$("#NVR_CHNSubStreamMode").change();
		var suggestBit;
		var curRes = document.all.NVR_CHNBMsSl[document.all.NVR_CHNBMsSl.selectedIndex].text;
		var curFps = $("#NVR_CHNBMxzl").val();
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
		$("#NVR_DefineXMaLiu").val(suggestBit);
	}
});

function checkDefineXMaliuRule(){
	document.getElementById("NVR_DefineXMaLiu").value = document.getElementById("NVR_DefineXMaLiu").value.replace(/[^\d]/g,'');
}

function checkDefineXMaliuRange(){
	//document.getElementById("NVR_DefineXMaLiu").value = document.getElementById("NVR_DefineXMaLiu").value.replace(/[^\d]/g,'');
	if(document.getElementById("NVR_DefineXMaLiu").value > maxBitrate)
			document.getElementById("NVR_DefineXMaLiu").value= maxBitrate;
	if(document.getElementById("NVR_DefineXMaLiu").value < minBitrate)
			document.getElementById("NVR_DefineXMaLiu").value= minBitrate;
}