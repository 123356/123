
$(document).ready(function(){

	if(g_bDefaultShow == true){
		$("#ChnspDf").css("display","block");
	}
	
	if(lgCls.version == "OWL" || lgCls.version == "URMET" || lgCls.version == "HONEYWELL" || gDvr.hybirdDVRFlag==1){
		$("#ChnspCP").css("display","block");
	}
	
	if(gDvr.nChannel==1)
	{
		$("#SP_CHN_TABLE").css("display","none");
	}
    var com =4;
	video_keep_out.sel =-1;
	$("#ChnspCP").click(function(){
		$("#spck").prop("checked",false);
		if(gDvr.hybirdDVRFlag==1){
			copyTD("#spCopyTD","sp_ch","sp_TDNum",gDvr.AnalogChNum);
		}else{
			copyTD("#spCopyTD","sp_ch","sp_TDNum");
			$.each($("input[id^='sp_ch']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("sp_ch")[1]*1 - 1;
				if((IpcAbility[index].State != 2) || (((IpcAbility[index].Abilities>>6) & 1) == 0)){
					$(this).prop("disabled",true);
				}
			})
		}
	})
	
	 
	//全选
	$("#spck").click(function(){
		$.each($("input[id^='sp_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("sp_ch")[1]*1 - 1;
			if((IpcAbility[index].State == 2) && ((IpcAbility[index].Abilities & (1<<6)) != 0)){
				$(this).prop("checked",$("#spck").prop("checked"));
			}
		})
		//$("input[id^='sp_ch']").prop("checked",$(this).prop("checked"));
	})	
	
	$(function(){
		if(gDvr.hybirdDVRFlag==1){
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				//console.log(IpcAbility[i].State);
				if(IpcAbility[i].State == 2){
					if(video_keep_out.sel==-1 && (((IpcAbility[i].Abilities>>6) & 1) == 1)){
						//console.log("i:" + i + " " + ((IpcAbility[i].Abilities>>6) & 1));
						video_keep_out.sel = i;
					}
					$("#CHVCchid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				//console.log(IpcAbility[i].State);
				if(IpcAbility[i].State == 2){
					if(video_keep_out.sel==-1 && (((IpcAbility[i].Abilities>>6) & 1) == 1)){
						video_keep_out.sel = i;
					}
					$("#CHVCchid").append('<option class="option" value="'+i+'">' + "IP " + lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');
				}
				//$("#CHVCchid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
		}else{
			for (var i=0; i<gDvr.nChannel; i++){
				if(IpcAbility[i].State == 2){	
					if(video_keep_out.sel==-1 && (((IpcAbility[i].Abilities>>6) & 1) == 1)){
						video_keep_out.sel = i;
					}
					$("#CHVCchid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
				//$("#CHVCchid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
		}
		
		if(video_keep_out.sel == -1){
			video_keep_out.sel = 0;
		}
		
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", 100, "Get");
		$("#CHVCchid").val(video_keep_out.sel);
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", video_keep_out.sel, "Get");
	});
	
	
	function Call(xml){
		gDvr.Motion("Shelter",com,video_keep_out.sel);  //打开任意通道视频 
		
		if(gDvr.hybirdDVRFlag==1){
			if(video_keep_out.sel<gDvr.AnalogChNum){//模拟通道
				//全都启用
				$("#VideoCoverSwitch_div").prop("disabled",false);
			}
			
			//隐藏Copy按钮
			if(video_keep_out.sel<gDvr.AnalogChNum){//模拟通道才运行Copy
				$("#ChnspCP").css("display","block");
			}else{
				$("#ChnspCP").css("display","none");
				$("#spCopyTD").css("display","none");
			}
		}else{
			if(IpcAbility[video_keep_out.sel].State != 2){//IPC不在线，禁用
				$("#VideoCoverSwitch_div").prop("disabled",true);
			}else{
				//全都启用
				$("#VideoCoverSwitch_div").prop("disabled",false);
			}
		}
		
		$("#VideoCoverSwitch").prop("checked", findNode("VideoCoverSwitch", xml)*1);
	}
	
	
	$("#CHVCchid").change(function(){
		var chid = $("#CHVCchid").val()*1;
		
		if(((IpcAbility[chid].Abilities>>6) & 1) == 0){
			$("#CHVCchid").val(video_keep_out.sel);
			
			var str = lg.get("IDS_CH")+(chid+1);
			if(gDvr.hybirdDVRFlag==1){//混合DVR
				if(chid<gDvr.AnalogChNum){
					//
				}else{
					str = "IP " + lg.get("IDS_CH")+(chid+1-gDvr.AnalogChNum);
				}
			}
			ShowPaop($("#video_keep_out").text(), str + " "+lg.get("IDS_CHN_FAILED"));
			return;
		}
		
		CHOSDSaveSel();
		video_keep_out.sel = $("#CHVCchid").val();
		com = 3;
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", video_keep_out.sel, "Get");
	});
	
	function CHOSDSaveSel(){
		var xml = "<a>";
		xml += ("<VideoCoverSwitch>" + ($("#VideoCoverSwitch").prop("checked")*1) + "</VideoCoverSwitch>");
		xml += ("<chid>" + video_keep_out.sel + "</chid>")
		xml += "</a>";	
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", video_keep_out.sel, "Set", xml);
	}
	
	$("#ChnspRf").click(function(){
	//	com = 2;
	//	gDvr.Motion("Shelter",com,0);
		com = 4;
		g_bClickDefBtn = false;
		if(lgCls.version == "URMET"){
			RfParamCall(Call, $("#video_keep_out").text(), "Shelter",101 + video_keep_out.sel, "Get");	
		}
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", 100, "Get");	
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", video_keep_out.sel, "Get");	
	});
	
	$("#ChnspDf").click(function(){
		com = 4;
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", 850, "Get");	
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", video_keep_out.sel, "Get");	
	});
	$("#ChnSave").click(function(){
		CHOSDSaveSel();
		RfParamCall(Call, $("#video_keep_out").text(), "Shelter", 200, "Set");	
	});
	
	$("#ClearShelter").click(function() {
		com = 1;
        gDvr.Motion("Shelter",com,0);								  
	});
	
	
	
	$("#spOk").click(function(){
		var spCopyXml="";
		$("#spCopyTD").css("display","none");
		var spTdValue="";
		$.each($("input[id^='sp_ch']"),function(){
			if($(this).prop("checked"))
				spTdValue+=$(this).prop('value')+",";
		})
		if(spTdValue!="")
		{
			spTdValue=spTdValue.substring(0,spTdValue.length-1);
			var spArr=spTdValue.split(',');
			var copychid = 0;
			for(var i=0;i<spArr.length;i++){
				copychid |= 0x01<< spArr[i];
			}
			spCopyXml = "<a>";
			spCopyXml += ("<CopyChid>" + copychid + "</CopyChid>");
			spCopyXml += ("<VideoCoverSwitch>" + ($("#VideoCoverSwitch").prop("checked")*1) + "</VideoCoverSwitch>");
			spCopyXml += ("<chid>" + video_keep_out.sel + "</chid>")
			spCopyXml += "</a>";
			RfParamCall(Call, $("#video_keep_out").text(), "Shelter", 400, "Set",spCopyXml);		
		}
	})

});

