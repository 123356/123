// JavaScript Document
var data = [];
$(document).ready(function(){
	//显示复制通道
	
	
	if(gDvr.nChannel==1)
	{
		$("#NVR_CHN_TABLE").css("display","none");
		$("#NVR_CHNCP").css("display","none");
	}
	
	$("#NVR_CHNCP").click(function(){
		$("#NVR_ck").prop("checked",false);
		copyTD("#NVR_CopyTD","streamset_ch","NVR_TDNum");
		$.each($("input[id^='streamset_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("streamset_ch")[1]*1 - 1;
			if((IpcAbility[index].State != 2) || (data[index].TIFlag == 0)){
				$(this).prop("disabled",true);
			}
		})
		//$("#NVR_ck").prop("checked",false);
		//copyTD("#NVR_CopyTD","streamset_ch","NVR_TDNum");
	})
	
	//全选
	$("#NVR_ck").click(function(){
		$.each($("input[id^='streamset_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("streamset_ch")[1]*1 - 1;
			if((IpcAbility[index].State == 2) && (data[index].TIFlag == 1)){
				$(this).prop("checked",$("#NVR_ck").prop("checked"));
			}
		})
		//$("input[id^='streamset_ch']").prop("checked",$(this).prop("checked"));
	})	
	
	var sel = -1;		//当前选择通道
	var frameValue = [4,5,8,10,12,15,20,25,30];

	
	function SaveArray(){	
		var root = {};
		root.chnnum = gDvr.nChannel;
		root.data = [];
		
		for (var i=0; i<gDvr.nChannel; i++){
			var  obj = {};
			obj.StreamMode = data[i].StreamMode;
			obj.RefreshRate = data[i].RefreshRate;
			obj.Resolution = data[i].Resolution;
			obj.MainFps = data[i].MainFps;
			obj.SubFps = data[i].SubFps;
			obj.MainBit = data[i].MainBit;
			obj.SubBit = data[i].SubBit;	
			root.data.push(obj);
		}

		return JSON.stringify(root);
	}
	
	$(function(){	//初始化时填充界面元素
		RfParamCall(Call, $("#NVR_stream_config").text(), "IPCStream", 100, "Get");	//初始时获取页面数据
	});
	
	function Call(xml){
			data = JSON.parse(xml);
			MasklayerHide();
			//界面响应 
			if(sel == -1){   //初始化时
				$("#NVR_CHNchn").empty();
				for(var i=0; i<gDvr.nChannel; i++){
					if((IpcAbility[i].State == 2) && (data[i].TIFlag == 1)){	
						if(sel == -1){
							sel = i;
						}
						$("#NVR_CHNchn").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
					}
				}
				if(sel == -1)
					sel = 0;
			}
			
			$("#NVR_CHNchn").val(sel);

			setTimeout(function(){$("#NVR_CHNchn").change()}, 1);
	}
	
	$("#NVR_CHNchn").change(function(){	//通道改变
		sel = $("#NVR_CHNchn").val()*1;
		
		//console.log("sel: "+sel);
		$("#NVR_CHNchn").val(sel);
		$("#NVR_StreamMode").val(data[sel].StreamMode);
		$("#NVR_RefreshRate").val(data[sel].RefreshRate);
		
		$("#NVR_CHNmSl").empty();
		var mode = data[sel].StreamMode;
		if( mode == 0 ){
			for(var i=0; i<data[sel].singleResNum; i++){
				$("#NVR_CHNmSl").append('<option class="option" value="'+i+'">'+"H264:"+data[sel].sr[i].w+"x"+data[sel].sr[i].h+'</option>');
			}
		}else if(mode == 1){
			for(var i=0; i<data[sel].doubleResNum; i++){
				$("#NVR_CHNmSl").append('<option class="option" value="'+i+'">'+"H264:"+data[sel].dr[i].w1+"x"+data[sel].dr[i].h1+",H264:"+data[sel].dr[i].w2+"x"+data[sel].dr[i].h2+'</option>');
			}
		}else if(mode == 2){
			for(var i=0; i<data[sel].triResNum; i++){
				$("#NVR_CHNmSl").append('<option class="option" value="'+i+'">'+"H264:"+data[sel].tr[i].w1+"x"+data[sel].tr[i].h1+",H264:"+data[sel].tr[i].w2+"x"+data[sel].tr[i].h2+",JPEG:"+data[sel].tr[i].w3+"x"+data[sel].tr[i].h3+'</option>');
			}
		}
		$("#NVR_CHNmSl").val(data[sel].Resolution);
		
		if(data[sel].StreamMode == 0){
			$("#NVR_sub").css("display", "none");
		}else{
			$("#NVR_sub").css("display", "block");
		}
		
		$("#NVR_main_CHNdzl").empty();
		for(var i=0; i<9;i++){
			if(((data[sel].FrameRange[0].frame>>i)&1) == 1)
				$("#NVR_main_CHNdzl").append('<option class="option" value="'+i+'">'+frameValue[i]+'</option>');
		}
		$("#NVR_main_CHNdzl").val(data[sel].MainFps);
		
		$("#NVR_sub_CHNdzl").empty();
		var count = 0;
		var minSubFps = 0;
		var maxSubFps = 0;
		for(var i=0; i<9;i++){
			if(((data[sel].FrameRange[1].frame>>i)&1) == 1){
				if(count == 0){
					minSubFps = i;
				}
				maxSubFps = i;
				++count;
				$("#NVR_sub_CHNdzl").append('<option class="option" value="'+i+'">'+frameValue[i]+'</option>');
			}
		}
		if(data[sel].SubFps > maxSubFps || data[sel].SubFps < minSubFps){
			data[sel].SubFps = minSubFps;
		}
		$("#NVR_sub_CHNdzl").val(data[sel].SubFps);
		
		$("#NVR_main_DefineBitrate").val(data[sel].MainBit);
		$("#NVR_sub_DefineBitrate").val(data[sel].SubBit);
	});
	
	$("#NVR_RefreshRate").change(function(){	//刷新频率改变
		var chid = $("#NVR_CHNchn").val()*1;
		data[chid].RefreshRate = $("#NVR_RefreshRate").val()*1;
	});
	
	$("#NVR_StreamMode").change(function(){
		var chid = $("#NVR_CHNchn").val()*1;
		var mode = $("#NVR_StreamMode").val()*1;
		if(mode == 0){
			$("#NVR_sub").css("display", "none");
		}else{
			$("#NVR_sub").css("display", "block");
		}
		data[chid].StreamMode = mode;
		$("#NVR_CHNmSl").empty();
		if( mode == 0 ){
			for(var i=0; i<data[sel].singleResNum; i++){
				$("#NVR_CHNmSl").append('<option class="option" value="'+i+'">'+"H264:"+data[sel].sr[i].w+"x"+data[sel].sr[i].h+'</option>');
			}
		}else if(mode == 1){
			for(var i=0; i<data[sel].doubleResNum; i++){
				$("#NVR_CHNmSl").append('<option class="option" value="'+i+'">'+"H264:"+data[sel].dr[i].w1+"x"+data[sel].dr[i].h1+",H264:"+data[sel].dr[i].w2+"x"+data[sel].dr[i].h2+'</option>');
			}
			/*
			var count = 0;
			for(var i=0; i<9;i++){
				if(((data[sel].FrameRange[0].frame>>i)&1) == 1){
					if(count == 0){
						data[sel].SubFps = i
					}
					++count;
				}
			}
			$("#NVR_sub_CHNdzl").val(data[sel].SubFps);
			*/
		}else if(mode == 2){
			for(var i=0; i<data[sel].triResNum; i++){
				$("#NVR_CHNmSl").append('<option class="option" value="'+i+'">'+"H264:"+data[sel].tr[i].w1+"x"+data[sel].tr[i].h1+",H264:"+data[sel].tr[i].w2+"x"+data[sel].tr[i].h2+",JPEG:"+data[sel].tr[i].w3+"x"+data[sel].tr[i].h3+'</option>');
			}
		}
		$("#NVR_CHNmSl").val(data[sel].Resolution);
	});
	
	$("#NVR_CHNmSl").change(function(){	//分辨率改变
		var chid = $("#NVR_CHNchn").val()*1;
		data[chid].Resolution = $("#NVR_CHNmSl").val()*1;
	});
	
	
	$("#NVR_main_CHNdzl").change(function(){	//主帧率改变
		var chid = $("#NVR_CHNchn").val()*1;
		data[chid].MainFps = $("#NVR_main_CHNdzl").val()*1;
	});
	
	$("#NVR_sub_CHNdzl").change(function(){	//子帧率改变
		var chid = $("#NVR_CHNchn").val()*1;
		data[chid].SubFps = $("#NVR_sub_CHNdzl").val()*1;
	});
	
	
	//界面操作  
	$("#NVR_CHNRf").click(function(){
		//MasklayerShow();
		RfParamCall(Call, $("#NVR_stream_config").text(), "IPCStream", 100, "Get");
	});
	
	$("#NVR_CHNSV").click(function(){
		//MasklayerShow();
		data[sel].MainBit = document.getElementById("NVR_main_DefineBitrate").value*1;
		data[sel].SubBit = document.getElementById("NVR_sub_DefineBitrate").value*1;
		RfParamCall(Call, $("#NVR_stream_config").text(), "IPCStream", 300, "Set", SaveArray());	
	});
			   
		 
	
	var bmCopyXml="";
	$("#NVR_Ok").click(function(){
		var num = 0;
		$("#NVR_CopyTD").css("display", "none");
		
		$("input[id^='streamset_ch']").each(function(i){
			var index = IsCopyResolution(i);
			if($(this).prop("checked")){
				data[i].RefreshRate = data[sel].RefreshRate;
				data[i].MainBit = document.getElementById("NVR_main_DefineBitrate").value*1;
				data[i].SubBit = document.getElementById("NVR_sub_DefineBitrate").value*1;
				data[i].StreamMode = data[sel].StreamMode;
				if(index != -1){
					data[i].Resolution = index;
				}
				if((data[i].FrameRange[0].frame>>(data[sel].MainFps))&1 == 1){
					data[i].MainFps = data[sel].MainFps;
				}
				if((data[i].FrameRange[1].frame>>(data[sel].SubFPS))&1 == 1){
					data[i].SubFps = data[sel].SubFps;
				}
				num++;
			}
		});
		
		
		if (num != 0){
			ShowPaop($("#NVR_stream_config").text(), lg.get("IDS_COPY_SUC"));
		}
	})
	
	function IsCopyResolution(chid){
		if(chid == sel)
			return -1;
		var curStreamMode = data[sel].StreamMode;
		if(curStreamMode == 0){
			var w = data[sel].sr[data[sel].Resolution].w;
			var h = data[sel].sr[data[sel].Resolution].h;
			for(var i=0; i<data[chid].singleResNum; i++){
				if(data[chid].RefreshRate == data[sel].RefreshRate)
				{
					if((data[chid].sr[i].w==w) && (data[chid].sr[i].h==h))
						return i;
				}else{
					if((data[chid].sr[i].w==w))
						return i;
				}
			}
			return -1;
		}else if(curStreamMode == 1){
			var w1 = data[sel].dr[data[sel].Resolution].w1;
			var h1 = data[sel].dr[data[sel].Resolution].h1;
			var w2 = data[sel].dr[data[sel].Resolution].w2;
			var h2 = data[sel].dr[data[sel].Resolution].h2;
			for(var i=0; i<data[chid].doubleResNum; i++){
				if(data[chid].RefreshRate == data[sel].RefreshRate){
					if((data[chid].dr[i].w1==w1) && (data[chid].dr[i].h1==h1) && (data[chid].dr[i].w2==w2) && (data[chid].dr[i].h2==h2))
						return i;
				}else{
					if((data[chid].dr[i].w1==w1) && (data[chid].dr[i].w2==w2))
						return i;
				}
			}
			return -1;
		}
		return -1;
	}
	
});


function checkDefineMainBitrateRange(){
	document.getElementById("NVR_main_DefineBitrate").value = document.getElementById("NVR_main_DefineBitrate").value.replace(/[^\d]/g,'');
	if(document.getElementById("NVR_main_DefineBitrate").value > 16000)
		document.getElementById("NVR_main_DefineBitrate").value= "16000";
	if(document.getElementById("NVR_main_DefineBitrate").value < 0)
		document.getElementById("NVR_main_DefineBitrate").value= "0";
	var chid = $("#NVR_CHNchn").val()*1;
	data[chid].MainBit = $("#NVR_main_DefineBitrate").val();
}

function checkDefineSubBitrateRange(){
	document.getElementById("NVR_sub_DefineBitrate").value = document.getElementById("NVR_sub_DefineBitrate").value.replace(/[^\d]/g,'');
	if(document.getElementById("NVR_sub_DefineBitrate").value > 2048)
		document.getElementById("NVR_sub_DefineBitrate").value= "2048";
	if(document.getElementById("NVR_sub_DefineBitrate").value < 0)
		document.getElementById("NVR_sub_DefineBitrate").value= "0";
	var chid = $("#NVR_CHNchn").val()*1;
	data[chid].SubBit = $("#NVR_sub_DefineBitrate").val();
}