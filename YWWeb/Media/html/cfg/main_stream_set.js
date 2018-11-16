// JavaScript Document

var maxBitrate = 0;
var minBitrate = 0;
$(document).ready(function(){
	//显示复制通道
	if(lgCls.version == "OWL" || lgCls.version == "URMET" || lgCls.version == "HONEYWELL" || gDvr.hybirdDVRFlag==1){
		$("#NVR_CHNBMCP").css("display","block");
	}
	if(lgCls.version == "URMET"){
		g_bDefaultShow = true;
	}
	if(g_bDefaultShow == true){
		$("#NVR_CHNBMDf").css("display","block");
	}
	
	if(gDvr.nChannel==1)
	{
		$("#NVR_BM_CHN_TABLE").css("display","none");
		$("#NVR_CHNBMCP").css("display","none");
	}
	
	//第1行的copy按钮
	$("#NVR_CHNBMCP").click(function(){
		$("#NVR_bmck").prop("checked",false);
		if(gDvr.hybirdDVRFlag==1){
			copyTD("#NVR_bmCopyTD","mian_ch","NVR_bm_TDNum",gDvr.AnalogChNum);
		}else{
			copyTD("#NVR_bmCopyTD","mian_ch","NVR_bm_TDNum");
			$.each($("input[id^='mian_ch']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("mian_ch")[1]*1 - 1;
				if((IpcAbility[index].State != 2) || (((IpcAbility[index].Abilities>>0) & 1) == 0)){
					$(this).prop("disabled",true);
				}
			})
		}
	})
	
	//Copy时的 All checkobx
	$("#NVR_bmck").click(function(){
		$.each($("input[id^='mian_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("mian_ch")[1]*1 - 1;
			if((IpcAbility[index].State == 2) && (((IpcAbility[index].Abilities>>0) & 1) == 1)){
				$(this).prop("checked",$("#NVR_bmck").prop("checked"));
			}
		})
		//$("input[id^='mian_ch']").prop("checked",$(this).prop("checked"));
	})	
	
	var TvSystem = gDvr.nVideoFormat;	//制式 PAL(0) -- 400  NTSC(1) -- 480 
	//var bSave = false;
  
	var main;	//主码流数组
	var TotalCif = 0;	//总帧率
	var SyCif = 0;		//剩余帧率	
	var sel = -1;		//当前选择通道
		       //                                                               1M                  2M   4M   5M   6M   8M   10M   12M   3M
		       //0  1  2  3  4  5   6   7   8   9   10  11  12  13  14  15  16  17   18   19   20   21   22   23   24   25   26    27    28
	mainValue = [32,48,64,80,96,128,160,192,224,256,320,384,448,512,640,768,896,1024,1280,1536,1792,2048,4096,5120,6144,8192,10240,12288,3072];
	/*
	if(lgCls.version == "URMET"){
		bitRate_1080 = [8192,6144,5120,5120,4096,4096,4096,3072,3072,2048,1792,1024];
		bitRate_720 = [6144,3072,2048,2048,1792,1792,1536,1536,1536,1280,768,512];
		bitRate_960 = [6144,3072,3072,3072,2048,2048,2048,1792,1536,1280,896,512];
		bitRate_D1 = [2048,1536,1280,1280,1024,896,768,640,640,512,320,160];
		suggested = [96,192,256,384,512,640,640,768,768,896,1024,1024,1024,1280,1280,1280,1563,1563,1563,1792,1792,1792,2048,2048,2048];
	}*/
	
	function main(BitRateMode, CustomBitrate, Bitrate, VideoQuality, Fps, AudioSwitch, ResolutionsetIndex, Num, HaveAudio, BitrateType, VideoEncType){	//结构体格式定义 
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

	//获取字符串中数组值
	function RateFun(Bitrate){
		return[Bitrate[0], Bitrate[1]];
	}
	
	for (var i=0; i<gDvr.nChannel; i++){
		main[i] = new main(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
	
	function InitArray(xml){	//初始化数组 --xml ->  struct
		for (var i=0; i<gDvr.nChannel; i++){
			main[i].BitRateMode = findChildNode(i+"Struct", "BitRateMode", xml)*1;
			main[i].CustomBitrate = findChildNode(i+"Struct", "CustomBitrate", xml)*1;
			main[i].Bitrate = findChildNode(i+"Struct", "Bitrate", xml)*1;
			main[i].VideoQuality = findChildNode(i+"Struct", "VideoQuality", xml)*1;
			main[i].Fps = findChildNode(i+"Struct", "Fps", xml)*1;
			main[i].AudioSwitch = findChildNode(i+"Struct", "AudioSwitch", xml)*1;
			main[i].ResolutionsetIndex = findChildNode(i+"Struct", "ResolutionsetIndex", xml)*1;
			main[i].Num = findChildNode(i+"Struct", "Num", xml)*1;
			main[i].HaveAudio = findChildNode(i+"Struct", "HaveAudio", xml)*1;
			main[i].BitrateType = findChildNode(i+"Struct", "BitrateType", xml)*1;
			main[i].VideoEncType = findChildNode(i+"Struct", "VideoEncType", xml)*1;
			for(var n=0; n<8; n++){
				main[i].BitrateRange[n] = findChildNode(i+"Struct", "BitrateRange"+n, xml)*1;
			}
			for(var l=0; l<8; l++){
				main[i].FrameRateMin[l] = findChildNode(i+"Struct", "FrameRateMin"+l, xml)*1;
			}
			for(var m=0; m<8; m++){
				main[i].FrameRateMax[m] = findChildNode(i+"Struct", "FrameRateMax"+m, xml)*1;
			}
			for(var j=0; j<8; j++){
				main[i].ResolutionWidth[j] = findChildNode(i+"Struct", "ResolutionWidth"+j, xml)*1;
			}
			for(var k=0; k<8; k++){
				main[i].ResolutionHight[k] = findChildNode(i+"Struct", "ResolutionHight"+k, xml)*1;
			}
			
		}
	}
	
	function SaveArray(){	//获取xml  ---  struct ->  xml
		var xml = "<a>";
		
		xml += ("<chnnum>"+gDvr.nChannel+"</chnnum>");
		for (var i=0; i<gDvr.nChannel; i++){
			if(main[i].BitRateMode==0 && main[i].CustomBitrate != mainValue[main[i].BitRateMode]){
				main[i].CustomBitrate = mainValue[main[i].BitRateMode]
			}
			xml += ("<Struct"+i+">\
					<BitRateMode>"+main[i].BitRateMode+"</BitRateMode>"+
					"<CustomBitrate>"+main[i].CustomBitrate+"</CustomBitrate>"+
					"<Bitrate>"+main[i].Bitrate+"</Bitrate>"+
					"<VideoQuality>"+main[i].VideoQuality+"</VideoQuality>"+
					"<Fps>"+main[i].Fps+"</Fps>"+
					"<AudioSwitch>"+main[i].AudioSwitch+"</AudioSwitch>"+
					"<BitrateType>"+main[i].BitrateType+"</BitrateType>"+
					"<VideoEncType>"+main[i].VideoEncType+"</VideoEncType>"+
					"<ResolutionsetIndex>"+main[i].ResolutionsetIndex+"</ResolutionsetIndex>\
			</Struct"+i+">");
		}
		xml += "</a>";
		return xml;
	}
	
	$(function(){	//初始化时填充界面元素
		$("#NVR_CHNBMchn").empty();//Channel
		
		for(var i=0; i<gDvr.nChannel; i++){
			if(IpcAbility[i].State == 2){	
				if(sel==-1 && ((((IpcAbility[i].Abilities>>0) & 1) == 1 &&IpcAbility[i].NewDevAbilityModeFlag != 1) ||(IpcAbility[i].NewDevAbilityModeFlag == 1&&((IpcAbility[i].Abilities>>13) & 1) == 0))){
					sel = i;
				}
				$("#NVR_CHNBMchn").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
		}
			
		if(sel == -1){
			sel = 0;
		}
		
		RfParamCall(Call, $("#NVR_code_config").text(), "MainNEnco", 100, "Get");	//初始时获取页面数据
	});
	
	function Call(xml){
			//console.log("call:" + xml);
			MasklayerHide();
			$("#NVR_CHNStreamMode option[value='2']").remove();
			if(IpcAbility[sel].ProtocolType == 5){//Urmet协议
				$("#NVR_CHNStreamMode").append('<option class="option" value="2">'+lg.get("IDS_SUGGESTED_VAL")+'</option>');
			}
			TvSystem = findNode("TvSystem", xml)*1;
			if (TvSystem != 0 && TvSystem != 1){
				//PaopSuccess($("#code_config").text(), g_ffail);
				MasklayerHide();
				return;
			}
			InitArray(xml);
			if(IpcAbility[sel].ProtocolType == 2){//三星IPC Bitrate 为输入框
				main[sel].BitRateMode = 1;
			}
			//界面响应
			//BitrateMode --> Bitrate
			if( main[sel].BitRateMode == 0)//Preset
			{
				//共用同一位置
				$("#NVR_DefineStream").css("display","none");
				$("#NVR_Stream").css("display","block");
			}
			else//User Define
			{
				//共用同一位置
				$("#NVR_Stream").css("display","none");
				$("#NVR_DefineStream").css("display","block");
				minBitrate = 0;
				maxBitrate = 0;
				for(var i=0; i< mainValue.length; i++){
					if(i == 28){
						break;
					}
					if(i == 22){
						if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>28)&1 == 1){
							if(minBitrate == 0){
								minBitrate = mainValue[28];//32
								maxBitrate = mainValue[28];//8192
							}
							if(mainValue[28] > maxBitrate){
								maxBitrate = mainValue[28];
							}
						}	
					}
					if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>i)&1 == 1){
						if(minBitrate == 0){
							minBitrate = mainValue[i];//32
							maxBitrate = mainValue[i];//8192
						}
						if(mainValue[i] > maxBitrate){
							maxBitrate = mainValue[i];
						}
					}
				}
				document.getElementById('NVR_DefineMaLiuRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
			}
			
			$("#NVR_CHNBMchn").val(sel);//Channel

			//Resolution获取列表，赋值
			if(main[sel].Num == 0){
				$("#NVR_CHNBMmSl").empty();//Resolution
			}else{
				var j = 0;
				$("#NVR_CHNBMmSl").empty();
				for (j; j<main[sel].Num; j++){//Num是Resolution的个数
					$("#NVR_CHNBMmSl").append('<option class="option" value="'+j+'">'+main[sel].ResolutionWidth[j]+"x"+main[sel].ResolutionHight[j]+'</option>');
				}
				$("#NVR_CHNBMmSl").val(main[sel].ResolutionsetIndex);
			}

			//FPS获取列表，赋值
			var MaxFps = main[sel].FrameRateMax[main[sel].ResolutionsetIndex];//某个通道&&某个Resolution下的FPS最大值
			$("#NVR_CHNBMdzl").empty();//FPS
			for (var i=main[sel].FrameRateMin[main[sel].ResolutionsetIndex]; i<=MaxFps; i++){//某个通道&&某个Resolution下的FPS最小值
				$("#NVR_CHNBMdzl").append('<option class="option" value='+i+' >'+i+'</option>');
			}
			$("#NVR_CHNBMdzl").val(main[sel].Fps);
			
			//Preset下的Bitrate，获取列表，赋值
			$("#NVR_DMaLiu").empty();//Preset下的Bitrate
			for(var i=0; i< mainValue.length; i++){
				if(i == 28)
					break;
				if(i == 22){
					if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>28)&1 == 1){
						$("#NVR_DMaLiu").append('<option class="option" value="'+28+'">'+mainValue[28]+'</option>');
					}
				}
				if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>i)&1 == 1)//某个通道&&某个Resolution下的Bitrate范围
					$("#NVR_DMaLiu").append('<option class="option" value="'+i+'">'+mainValue[i]+'</option>');
			}
			$("#NVR_DMaLiu").val(main[sel].Bitrate);
			
			//通道改变
			setTimeout(function(){$("#NVR_CHNBMchn").change()}, 1);
	}
	
	//通道改变
	$("#NVR_CHNBMchn").change(function(){
		var chid = $("#NVR_CHNBMchn").val()*1;
		$("#NVR_CHNStreamMode option[value='2']").remove();
		if(IpcAbility[chid].ProtocolType == 5){//Urmet协议
			$("#NVR_CHNStreamMode").append('<option class="option" value="2">'+lg.get("IDS_SUGGESTED_VAL")+'</option>');
		}
		if(((IpcAbility[chid].Abilities>>0) & 1) == 0){
			$("#NVR_CHNBMchn").val(sel);
			ShowPaop($("#NVR_code_config").text(), lg.get("IDS_CH")+(chid+1)+" "+lg.get("IDS_CHN_FAILED"));//不支持此功能
			return;
		}
		sel = chid;

		$("#NVR_CHNStreamMode").val(main[sel].BitRateMode);//BitrateMode
		if($("#NVR_CHNStreamMode").val()*1 == 0)//Preset
		{
			//共用同一位置
			$("#NVR_DefineStream").css("display","none");
			$("#NVR_Stream").css("display","block");
			
			//Preset下的Bitrate，获取列表，赋值
			$("#NVR_DMaLiu").empty();//Preset下的Bitrate
			for(var i=0; i< mainValue.length; i++){
				if(i == 28)
					break;
				if(i == 22){
					if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>28)&1 == 1){
						$("#NVR_DMaLiu").append('<option class="option" value="'+28+'">'+mainValue[28]+'</option>');
					}
				}
				if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>i)&1 == 1)//某个通道&&某个Resolution下的Bitrate范围
					$("#NVR_DMaLiu").append('<option class="option" value="'+i+'">'+mainValue[i]+'</option>');
			}
			$("#NVR_DMaLiu").val(main[sel].Bitrate);
			//随便为UserDefine下的Bitrate赋值
			$("#NVR_DefineMaLiu").val(main[sel].CustomBitrate);
		}
		else//User Define
		{
			//共用同一位置
			$("#NVR_Stream").css("display","none");
			$("#NVR_DefineStream").css("display","block");
			minBitrate = 0;
			maxBitrate = 0;
			//UserDefine下的Bitrate赋值，加后缀
			$("#NVR_DefineMaLiu").val(main[sel].CustomBitrate);
			for(var i=0; i< mainValue.length; i++){
				if(i == 28){
					break;
				}
				if(i == 22){
					if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>28)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
						if(minBitrate == 0){
							minBitrate = mainValue[28];//32
							maxBitrate = mainValue[28];//8192
						}
						if(mainValue[28] > maxBitrate){
							maxBitrate = mainValue[28];
						}
					}
				}
				if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>i)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
					if(minBitrate == 0){
						minBitrate = mainValue[i];//32
						maxBitrate = mainValue[i];//8192
					}
					if(mainValue[i] > maxBitrate){
						maxBitrate = mainValue[i];
					}
				}
			}
			document.getElementById('NVR_DefineMaLiuRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
		}

		//Audio
		if(main[sel].HaveAudio == 1){//显示
			$("#NVR_BMAudio").css("display","block");
			$("#NVR_CHNBMma").val(main[sel].AudioSwitch);//Audio赋值		
		}else{//隐藏
			$("#NVR_BMAudio").css("display","none");
		}
		//$("#NVR_CHNBMdzl").val(main[sel].Fps - 1);
		//$("#NVR_CHNBMmSl").val(main[sel].VideoQuality);
		
		//Resolution获取列表，赋值
		if(main[sel].Num == 0){
			$("#NVR_CHNBMmSl").empty();//Resolution
		}else{
			var j = 0;
			$("#NVR_CHNBMmSl").empty();
			for (j; j<main[sel].Num; j++){
				$("#NVR_CHNBMmSl").append('<option class="option" value="'+j+'">'+main[sel].ResolutionWidth[j]+"x"+main[sel].ResolutionHight[j]+'</option>');
			}
			$("#NVR_CHNBMmSl").val(main[sel].ResolutionsetIndex);
		}
		
		//FPS获取列表，赋值
		var MaxFps = main[sel].FrameRateMax[main[sel].ResolutionsetIndex];//某个通道&&某个Resolution下的FPS最大值
		$("#NVR_CHNBMdzl").empty();
		for (var k=main[sel].FrameRateMin[main[sel].ResolutionsetIndex]; k<=MaxFps; k++){//某个通道&&某个Resolution下的FPS最小值
			$("#NVR_CHNBMdzl").append('<option class="option" value='+k+' >'+k+'</option>');
		}
		$("#NVR_CHNBMdzl").val(main[sel].Fps);
		if($("#NVR_CHNStreamMode").val()*1 == 2){
				$("#NVR_CHNBMdzl").change();
			}
		
		//前面的(gDvr.nAudio)个通道，才显示Audio
		if (sel >= gDvr.nAudio){
			$("#NVR_BMAudio").css("display", "none");
		}
		
		if(IpcAbility[sel].ProtocolType == 2){//三星IPC隐藏 Bitrate Mode
			$("#MainBitrateModeDiv").css("display","none");
		}else{
			$("#MainBitrateModeDiv").css("display","block");
		}
		
		//判断是否显示H.265选项  2015/06/18 ly
		if(1){//之前只有H265打开，现在全部打开
			if(IpcAbility[sel].IPCDevTypeFlag == 1 || IpcAbility[sel].IPCDevTypeFlag == 2){
				//$("#NVR_codetype_div").css("display","block");
				$("#NVR_bit_ctrl").css("display","block");
				if(main[sel].BitrateType == 1){
					$("#NVR_bit_quality").css("display","block");
				}else{
					$("#NVR_bit_quality").css("display","none");
				}
			}else{
				//$("#NVR_codetype_div").css("display","none");
				$("#NVR_bit_ctrl").css("display","none");
				$("#NVR_bit_quality").css("display","none");
			}
			
			if(IpcAbility[sel].IPCDevTypeFlag == 2 || IpcAbility[sel].IPCDevTypeFlag == 4){
				$("#NVR_codetype_div").css("display","block");
			}else{
				$("#NVR_codetype_div").css("display","none");
			}
			
			$("#NVR_CHNBMcodetype").val(main[sel].VideoEncType);
			$("#NVR_CHNBMbitctrl").val(main[sel].BitrateType);
			$("#NVR_CHNBMbitquality").val(main[sel].VideoQuality);
			
		}
		
		//隐藏Copy按钮
		if(gDvr.hybirdDVRFlag){
			if(sel<gDvr.AnalogChNum){//模拟通道才运行Copy
				$("#NVR_CHNBMCP").css("display","block");
			}else{
				$("#NVR_CHNBMCP").css("display","none");
				$("#NVR_bmCopyTD").css("display","none");
			}
		}
		
		//自定义协议，隐藏码流设置
		setTimeout(function(){
			showDiv((IpcAbility[sel].ProtocolType >= 32), "#MainDivBoxAll");},0);
	});
	
	//Resolution改变
	$("#NVR_CHNBMmSl").change(function(){
			var chid = $("#NVR_CHNBMchn").val()*1;//Channel
			main[chid].ResolutionsetIndex = $("#NVR_CHNBMmSl").val()*1;//Resolution
		var MaxFps = main[chid].FrameRateMax[main[chid].ResolutionsetIndex];//某个Resolution下的FPS最大值
		
		//FPS获取列表，赋值
		$("#NVR_CHNBMdzl").empty();//FPS
		for (var i=main[chid].FrameRateMin[main[chid].ResolutionsetIndex]; i<=MaxFps; i++){//某个Resolution下的FPS最小值
			$("#NVR_CHNBMdzl").append('<option class="option" value='+i+' >'+i+'</option>');
		}
		$("#NVR_CHNBMdzl").val(main[chid].Fps);
		
		//Preset下的Bitrate，获取列表，赋值
		if($("#NVR_CHNStreamMode").val()*1 == 0)//Preset
		{
			$("#NVR_DMaLiu").empty();
			var itemCount = 0;
			var curBitrateIndexMin;
			var curBitrateIndexMax;
			for(var i=0; i< mainValue.length; i++){
				if(i == 28)
					break;
				if(i == 22){
					if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>28)&1 == 1){
						$("#NVR_DMaLiu").append('<option class="option" value="'+28+'">'+mainValue[28]+'</option>');
						itemCount++;
						if(itemCount==1){
							curBitrateIndexMin = 28;
						}
						curBitrateIndexMax = 28;
						
					}
				}
				if((main[chid].BitrateRange[main[chid].ResolutionsetIndex]>>i)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
					$("#NVR_DMaLiu").append('<option class="option" value="'+i+'">'+mainValue[i]+'</option>');
					//
					itemCount++;
					if(itemCount==1){
						curBitrateIndexMin = i;
					}
					curBitrateIndexMax = i;
					//
				}
			}
			if(main[chid].Bitrate >= curBitrateIndexMin && main[chid].Bitrate<= curBitrateIndexMax){
				$("#NVR_DMaLiu").val(main[chid].Bitrate);
			}else{
				main[chid].Bitrate = curBitrateIndexMin;
				$("#NVR_DMaLiu").val(curBitrateIndexMin);
			}
		}else{
			//UserDefine下的Bitrate赋值，加后缀
			minBitrate = 0;
			maxBitrate = 0;
			$("#NVR_DefineMaLiu").val(main[chid].CustomBitrate);
			for(var i=0; i< mainValue.length; i++){
				if(i == 28){
					break;
				}
				if(i == 22){
					if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>28)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
						if(minBitrate == 0){
							minBitrate = mainValue[28];//32
							maxBitrate = mainValue[28];//8192
						}
						if(mainValue[28] > maxBitrate){
							maxBitrate = mainValue[28];
						}
					}
				}
				if((main[chid].BitrateRange[main[chid].ResolutionsetIndex]>>i)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
					if(minBitrate == 0){
						minBitrate = mainValue[i];//32
						maxBitrate = mainValue[i];//8192
					}
					if(mainValue[i] > maxBitrate){
						maxBitrate = mainValue[i];
					}
				}
			}
			document.getElementById('NVR_DefineMaLiuRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
			checkDefineDMaliuRange();
			main[chid].CustomBitrate = $("#NVR_DefineMaLiu").val();
		}
		//2014.11.25
		if(lgCls.version == "URMET"){
			AutoChangeBitrate();
		}
	});
	
	//FPS 改变
	$("#NVR_CHNBMdzl").change(function(){
		var chid = $("#NVR_CHNBMchn").val()*1;//Channel
		/*
		if(main[chid].FrameRateMin==0 && main[chid].FrameRateMax==0){
			main[chid].Fps = $("#NVR_CHNBMdzl").val()*1 + 1;
		}else{
			main[chid].Fps = $("#NVR_CHNBMdzl").val()*1;
		}*/
		main[chid].Fps = $("#NVR_CHNBMdzl").val()*1;//FPS
		
		//2014.11.25
		if(lgCls.version == "URMET"){
			if(IpcAbility[chid].ProtocolType == 5 && $("#NVR_CHNStreamMode").val()*1 == 2)// Urmet协议 2015.04.22
			{
				$("#NVR_DefineMaLiu").val(suggested[$("#NVR_CHNBMdzl").val()*1 - 1]);
			}else{
				AutoChangeBitrate();
			}
		}
	});
	
	//BitrateMode 改变
	$("#NVR_CHNStreamMode").change(function(){
		var chid = $("#NVR_CHNBMchn").val()*1;//Channel
		main[chid].BitRateMode = $("#NVR_CHNStreamMode").val()*1;//BitrateMode
		if(main[chid].BitRateMode == 0)//Preset
		{
			//共用同一位置
			$("#NVR_DefineStream").css("display", "none");
			$("#NVR_Stream").css("display", "block");
			
			//Preset下的Bitrate，获取列表，赋值
			$("#NVR_DMaLiu").empty();
			var itemCount = 0;
			var curBitrateIndexMin;
			var curBitrateIndexMax;
			for(var i=0; i< mainValue.length; i++){
				if(i == 28)
					break;
				if(i == 22){
					if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>28)&1 == 1){
						$("#NVR_DMaLiu").append('<option class="option" value="'+28+'">'+mainValue[28]+'</option>');
						//
					itemCount++;
					if(itemCount==1){
						curBitrateIndexMin = 28;
					}
					curBitrateIndexMax = 28;
					}
				}
				if((main[chid].BitrateRange[main[chid].ResolutionsetIndex]>>i)&1 == 1){
					$("#NVR_DMaLiu").append('<option class="option" value="'+i+'">'+mainValue[i]+'</option>');
					//
					itemCount++;
					if(itemCount==1){
						curBitrateIndexMin = i;
					}
					curBitrateIndexMax = i;
					//
				}
			}
			if(main[chid].Bitrate >= curBitrateIndexMin && main[chid].Bitrate <= curBitrateIndexMax){//索引比较
				$("#NVR_DMaLiu").val(main[chid].Bitrate);
			}else{
				main[chid].Bitrate = curBitrateIndexMin;
				$("#NVR_DMaLiu").val(curBitrateIndexMin);
			}
		}else//User Define
		{
			//共用同一位置
			$("#NVR_Stream").css("display", "none");
			$("#NVR_DefineStream").css("display", "block");
			minBitrate = 0;
			maxBitrate = 0;
			//UserDefine下的Bitrate赋值，加后缀
			$("#NVR_DefineMaLiu").val(mainValue[main[chid].Bitrate]);
			main[chid].CustomBitrate = mainValue[main[chid].Bitrate];
			for(var i=0; i< mainValue.length; i++){
				if(i == 28){
					break;
				}
				if(i == 22){
					if((main[sel].BitrateRange[main[sel].ResolutionsetIndex]>>28)&1 == 1){//某个通道&&某个Resolution下的Bitrate范围
						if(minBitrate == 0){
							minBitrate = mainValue[28];//32
							maxBitrate = mainValue[28];//8192
						}
						if(mainValue[28] > maxBitrate){
							maxBitrate = mainValue[28];
						}
					}
				}
				if((main[chid].BitrateRange[main[chid].ResolutionsetIndex]>>i)&1 == 1){
					if(minBitrate == 0){
						minBitrate = mainValue[i];//32
						maxBitrate = mainValue[i];//8192
					}
					if(mainValue[i] > maxBitrate){
						maxBitrate = mainValue[i];
					}
				}
			}
			document.getElementById('NVR_DefineMaLiuRange').innerText= "("+minBitrate+"~"+maxBitrate+")"+"Kbps";
			if($("#NVR_CHNStreamMode").val()*1 == 2){
				$("#NVR_CHNBMdzl").change();
			}
		}
	});
	
	//Preset下的Bitrate 改变
	$("#NVR_DMaLiu").change(function(){
		var chid = $("#NVR_CHNBMchn").val()*1;//Channel
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

		main[chid].Bitrate = $("#NVR_DMaLiu").val()*1;//Preset下的Bitrate //22（4096）
		//main[chid].CustomBitrate = mainValue[main[chid].Bitrate];
		//为了不让UserDefine下Bitrate的值为空
		$("#NVR_DefineMaLiu").val(mainValue[main[chid].Bitrate]);//mainValue[22] == 4096 //UserDefine时Bitrate的值
	});
	
	//Audio 改变
	$("#NVR_CHNBMma").change(function(){
		var chid = $("#NVR_CHNBMchn").val()*1;//Channel
		main[chid].AudioSwitch = $("#NVR_CHNBMma").val()*1;//Audio
	});	
	
	
	//刷新 按钮
	$("#NVR_CHNBMRf").click(function(){
		//MasklayerShow();
		g_bClickDefBtn = false;
		if(lgCls.version == "URMET"){//通知板端更新当前通道数据
			RfParamCall(Call, $("#NVR_code_config").text(), "MainNEnco", 101 + sel, "Get");
		}
		RfParamCall(Call, $("#NVR_code_config").text(), "MainNEnco", 100, "Get");
	});
	
	//默认 按钮
	$("#NVR_CHNBMDf").click(function(){
		//MasklayerShow();
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#NVR_code_config").text(), "MainNEnco", 850, "Get");
	});
	
	//保存 按钮
	$("#NVR_CHNBMSV").click(function(){
		//MasklayerShow();
		if(main[sel].BitRateMode == 0){
			main[sel].CustomBitrate = mainValue[main[sel].Bitrate];;
		}else{
			main[sel].CustomBitrate = document.getElementById("NVR_DefineMaLiu").value;//4096 //UserDefine下Bitrate的值
		}
		RfParamCall(Call, $("#NVR_code_config").text(), "MainNEnco", 300, "Set", SaveArray());	
	});
	
	//废弃
	$("#NVR_CHNBMUseXML").click(function(){
		DivBox("#NVR_CHNBMUseXML", "#NVR_CHNBMDivBoxXML");
	});
			   
	//废弃
	$("#NVR_subtag_0").mouseover(function(){
		$(this).css("color","#936");
	}).mouseout(function(){
		$(this).css("color","#FFF");
	}).click(function(){
		gStreamSet = 1;		
		showConfigChild($("#NVR_stream_set").attr("id"));
	});
	
	//废弃
	$("#NVR_smalltag_0").mouseover(function(){
		$(this).css("color","#936");
	}).mouseout(function(){
		$(this).css("color","#FFF");
	}).click(function(){
		gStreamSet = 2;
		showConfigChild($("#NVR_stream_set").attr("id"));
	});   
	
	var bmCopyXml="";
	//下面的Copy按钮
	$("#NVR_bmOk").click(function(){
		if(gDvr.hybirdDVRFlag==1){
			//混合DVR，只拷贝模拟通道，直接拷贝，不用考虑能力
			//混DVR，全部拷贝，需要拷贝(CBR、VBR)
		}else{
			if(IpcAbility[sel].ProtocolType!=0 && IpcAbility[sel].ProtocolType!=5){
				return;
			}
		}
		
		var num = 0;
		$("#NVR_bmCopyTD").css("display", "none");
		
		$("input[id^='mian_ch']").each(function(i){
			//$.each($("input[id^='mian_ch']"),function(i){
			var index = IsCopy(i);
			if(IpcAbility[sel].IPCDevTypeFlag==IpcAbility[i].IPCDevTypeFlag){
				if($(this).prop("checked") && (IpcAbility[i].ProtocolType==IpcAbility[sel].ProtocolType)){
					main[i].VideoQuality = main[sel].VideoQuality;
					if(main[i].HaveAudio == main[sel].HaveAudio){
						main[i].AudioSwitch = main[sel].AudioSwitch;
					}
					if(index != -1){
						main[i].ResolutionsetIndex = index;
						main[i].BitRateMode = main[sel].BitRateMode;
						if(main[i].BitRateMode == 0){
							main[i].CustomBitrate = mainValue[main[sel].Bitrate];
						}else{
							main[i].CustomBitrate = document.getElementById("NVR_DefineMaLiu").value;
						}
						main[i].Fps = main[sel].Fps;
						main[i].Bitrate = main[sel].Bitrate;
						main[i].BitrateType = main[sel].BitrateType;
						main[i].VideoEncType = main[sel].VideoEncType;
					}
					num++;
				}
			}
		});
		
		
		if (num != 0){
			ShowPaop($("#NVR_code_config").text(), lg.get("IDS_COPY_SUC"));
		}
	})
	
	
	
	//cal the copy data
	function CalCopyData(count){
		var tempCif = 0;
		if(gDvr.nMainType == 0x52530000) //9216H device 
		{
		var i = $("#NVR_CHNBMmSl").val()*1;
		switch(i){
			case 0:	//D1
				tempCif = ($("#NVR_CHNBMdzl").val()*1 + 1) * 4;
				break;
			case 1:	//HD1
				tempCif = ($("#NVR_CHNBMdzl").val()*1 + 1) * 2;
				break;
			case 2: //CIF
				tempCif = $("#NVR_CHNBMdzl").val()*1 + 1;
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
	
	//当前是1通道 ---copy--> 勾选3通道
	//1通道(当前显示)的Resolution、FPS、Bitrate(8种option中的一种)
	//3通道8种option中,如果有一种option等于1通道的option，则返回option的下标
	function IsCopy(chid){
		if(chid == sel)
			return -1;
		var curBitrate = 0;
		if(main[sel].BitRateMode == 0){
			curBitrate = mainValue[main[sel].Bitrate];
		}else{
			curBitrate = document.getElementById("NVR_DefineMaLiu").value;
		}
		var curWidth = main[sel].ResolutionWidth[$("#NVR_CHNBMmSl").val()*1];
		var curHight = main[sel].ResolutionHight[$("#NVR_CHNBMmSl").val()*1];
		var curFps = main[sel].Fps;
		for(var i=0; i<main[chid].Num; i++){
			if( (curWidth!= main[chid].ResolutionWidth[i]) || (curHight!= main[chid].ResolutionHight[i]) ){
				continue;
			}
			if( (curFps<main[chid].FrameRateMin[i]) || (curFps>main[chid].FrameRateMax[i]) ){
				continue;
			}
			var minTemp = 0;
			var maxTemp = 0;
			for(var j=0; j< mainValue.length; j++){
				var temp = main[chid].i;
				if((main[chid].BitrateRange[i]>>j)&1 == 1){
					if(minTemp == 0){
						minTemp = mainValue[j];
						maxTemp = mainValue[j];
					}
					if(mainValue[j] > maxTemp){
						maxTemp = mainValue[j];
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
	
	//2014.11.25
	/*
	function AutoSetBitrate(bitRate){
		
		var tempfps = $("#NVR_CHNBMdzl").val();
		if(tempfps == 1){
			$("#NVR_DefineMaLiu").val(bitRate[11]);
		}else if(tempfps < 4){
			$("#NVR_DefineMaLiu").val(bitRate[10]);
		}else if(tempfps < 6){
			$("#NVR_DefineMaLiu").val(bitRate[9]);
		}else if(tempfps < 8){
			$("#NVR_DefineMaLiu").val(bitRate[8]);
		}else if(tempfps < 10){
			$("#NVR_DefineMaLiu").val(bitRate[7]);
		}else if(tempfps < 12){
			$("#NVR_DefineMaLiu").val(bitRate[6]);
		}else if(tempfps < 15){
			$("#NVR_DefineMaLiu").val(bitRate[5]);
		}else if(tempfps < 18){
			$("#NVR_DefineMaLiu").val(bitRate[4]);
		}else if(tempfps < 20){
			$("#NVR_DefineMaLiu").val(bitRate[3]);
		}else if(tempfps < 22){
			$("#NVR_DefineMaLiu").val(bitRate[2]);
		}else if(tempfps < 25){
			$("#NVR_DefineMaLiu").val(bitRate[1]);
		}else if(tempfps >= 25){
			$("#NVR_DefineMaLiu").val(bitRate[0]);
		}
		checkDefineDMaliuRange();
	}
	*/
	
	function AutoChangeBitrate(){//Urmet 自动切换比特率
		$("#NVR_CHNStreamMode").val(1);
		$("#NVR_CHNStreamMode").change();
		var suggestBit;
		var curRes = document.all.NVR_CHNBMmSl[document.all.NVR_CHNBMmSl.selectedIndex].text;
		var curFps = $("#NVR_CHNBMdzl").val();
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
		$("#NVR_DefineMaLiu").val(suggestBit);
		/*switch(document.all.NVR_CHNBMmSl[document.all.NVR_CHNBMmSl.selectedIndex].text){
			case "1920x1080":
			{
				$("#NVR_CHNStreamMode").val(1);
				$("#NVR_CHNStreamMode").change();
				AutoSetBitrate(bitRate_1080);
			}
			break;
			case "1280x960":
			{
				$("#NVR_CHNStreamMode").val(1);
				$("#NVR_CHNStreamMode").change();
				AutoSetBitrate(bitRate_960);
			}
			break;
			case "1280x720":
			{
				$("#NVR_CHNStreamMode").val(1);
				$("#NVR_CHNStreamMode").change();
				AutoSetBitrate(bitRate_720);
			}
			break;
			case "720x576":
			{
				$("#NVR_CHNStreamMode").val(1);
				$("#NVR_CHNStreamMode").change();
				AutoSetBitrate(bitRate_D1);
			}
			break;
			default:
			break;
		}*/
	}
	
	$("#NVR_CHNBMcodetype").change(function(){
		main[sel].VideoEncType = $("#NVR_CHNBMcodetype").val();
	});
	
	$("#NVR_CHNBMbitctrl").change(function(){
		main[sel].BitrateType = $("#NVR_CHNBMbitctrl").val();
		if(main[sel].BitrateType == 1){
			$("#NVR_bit_quality").css("display","block");
		}else{
			$("#NVR_bit_quality").css("display","none");
		}
	});
	
	$("#NVR_CHNBMbitquality").change(function(){
		main[sel].VideoQuality = $("#NVR_CHNBMbitquality").val();
	});
});

function checkDefineDMaliuRule(){
	document.getElementById("NVR_DefineMaLiu").value = document.getElementById("NVR_DefineMaLiu").value.replace(/[^\d]/g,'');
}

function checkDefineDMaliuRange(){
	//document.getElementById("NVR_DefineMaLiu").value = document.getElementById("NVR_DefineMaLiu").value.replace(/[^\d]/g,'');
	if(document.getElementById("NVR_DefineMaLiu").value > maxBitrate)
		document.getElementById("NVR_DefineMaLiu").value= maxBitrate;
	if(document.getElementById("NVR_DefineMaLiu").value < minBitrate)
		document.getElementById("NVR_DefineMaLiu").value= minBitrate;
}