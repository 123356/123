$(document).ready(function(){
	if($.browser.safari){
		$("#filetype").css("display","none");
		$("#filetype_select").css("display","none");		
		$("#Path_fileType option[value='2']").remove();
		$("#Original").css("display","none");
		
	}
	if(gDvr.hybirdDVRFlag==1){
		if($.browser.safari){
			$("#MacDisplay").css("display","none");
		}
	}
	UI.Button("#PathBtn_3,#PathBtn_2,#PathBtn_1", 20);
	UI.Button(".pathSave", 128);
	$("div[id ^= 'PathBtn_']").click(function(){
		var i = $(this).attr("id").split("PathBtn_")[1]*1;
		var name = gDvr.OpenLocalFile(i);
		if (name != "")
			$("#Path_"+i).val(name);
	});
	
	if(lgCls.version == "HONEYWELL"){
		$(".browerBtn").css("border", "1px solid white");
		$("#Path_1").css("border", "1px solid white");
		$("#Path_2").css("border", "1px solid white");
		$("#Path_3").css("border", "1px solid white");
		$("#minuteTime").css("border", "1px solid white");
		$("#Path_fileType").css("border", "1px solid white");
	}
	
	initPath();
	function initPath(){
		var str = gDvr.GetAndSetRecFileParams(0,0,0);	
		if (str == "err"){
			PaopSuccess("Path", "err");
			return;
		}
		document.getElementById("Path_1").value=findNode("PictureFile", str);
		document.getElementById("Path_2").value=findNode("RecFile", str);
		
		document.getElementById("Path_3").value=findNode("DownFile", str);
		document.getElementById("minuteTime").value=findNode("FileTime", str);
		document.getElementById("Path_fileType").value=findNode("FileType", str);
		var val = findNode("OriginalVideo", str)*1;
		if(val == 0){
			$("#FullVideoSwitch").checked = true;
			$("#OriginalVideoSwitch").checked = false;
		}else if(val == 1){
			$("#FullVideoSwitch").checked = false;
			$("#OriginalVideoSwitch").checked = true;
		}
	}
	
	$(".pathSave").click(function(){
		gDvr.SetMacPath($("#Path_1").val(),$("#Path_2").val(),$("#Path_3").val());
		if(!$.browser.safari){	
			if(!isNaN($("#minuteTime").val())){
				if( $("#minuteTime").val()<10||$("#minuteTime").val()>60)
				{
					$("#minuteTime").select();
					ShowPaop($("#configPath123").text(),lg.get("IDS_SHURU_ERROR"));
					initPath();
					return;
				}
			}else{
				$("#minuteTime").select();
				//warn(lg.get("IDS_SHURU_ERROR"));
				return;
			}
		}
		  
		var radioVal = 0;
		if($("#FullVideoSwitch").checked == true){	
			radioVal = 0;
		}else if($("#OriginalVideoSwitch").checked == true){
			radioVal = 1;
		}
		
		gDvr.SetOriginalVideo(radioVal);
		var str = gDvr.GetAndSetRecFileParams(1,$("#Path_fileType").val(),$("#minuteTime").val());
		if(str == "suc") { ShowPaop($("#configPath123").text(),lg.get("IDS_SAVE_SUCCESS"));
		}else { ShowPaop($("#configPath123").text(),lg.get("IDS_SAVE_FAILED"));}
	});
});
