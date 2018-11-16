// JavaScript Document
$(document).ready(function(){
	
	if(g_bDefaultShow == true){
		$("#RECconfigDf").css("display","block");
	}
	//显示复制通道
	if(gDvr.nChannel==1)
	{
		$("#REC_CHN_TABLE").css("display","none");
	}
	$("#RECconfigCP").click(function(){
		$("#pzck").prop("checked",false);
		copyTD("#pzCopyTD","pz_ch","pz_TDNum");
	})
	if(gDvr.FileSystemFlag == 1){
		$("#rec_pack_table").css("display","none");
	}
	//全选
	$("#pzck").click(function(){
		$("input[id^='pz_ch']").prop("checked",$(this).prop("checked"));
	})
	
	var sel = 0;
	$(function(){
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道
				if(IpcAbility[i].State == 2){
					if(sel==-1){
						sel = i;//显示列表的第一项
					}
					$("#RECConfigChid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
				}
			}
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				$("#RECConfigChid").append('<option class="option" value="'+i+'">'+ "IP " +lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');//Channel列表
			}
		}else{
			for (var i=0; i<gDvr.nChannel; i++){
				$("#RECConfigChid").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
			}
		}
		
		RfParamCall(Call, $("#record_config").text(), "RecConfig", 100, "Get");	
		sel = 0;
		RfParamCall(Call, $("#record_config").text(), "RecConfig", sel, "Get");
	});
	
	function Call(xml){
		
			$("#RECRecordMode").val(findNode("RecordMode", xml));
			$("#RECPackTime").val(findNode("PackTime", xml));
			$("#RECPreRecordTime").val(findNode("PreRecSwitch", xml));
			$("#ChnCloseOrOpen").val(findNode("ChnCloseOrOpen", xml)*1);
			$("#RecStreamMode").val(findNode("StreamMode", xml)*1);
	}
	
	$("#RECConfigChid").change(function(){
		CHOSDSaveSel();
		sel = $("#RECConfigChid").val();
		RfParamCall(Call, $("#record_config").text(), "RecConfig", sel, "Get");
	});
	
	function CHOSDSaveSel(){
	
		var xml = "<a>";
		xml += ("<ChnCloseOrOpen>" + ($("#ChnCloseOrOpen").val()*1) + "</ChnCloseOrOpen>");
		xml += ("<RecordMode>" + ($("#RECRecordMode").val()) + "</RecordMode>");
		xml += ("<PackTime>" + ($("#RECPackTime").val()) + "</PackTime>");
		xml += ("<chid>" + sel + "</chid>")
		xml += ("<PreRecSwitch>" + $("#RECPreRecordTime").val() + "</PreRecSwitch>");
		xml += ("<StreamMode>" + $("#RecStreamMode").val() + "</StreamMode>");
		xml += "</a>";	
		
		RfParamCall(Call, $("#record_config").text(), "RecConfig", sel, "Set", xml);
	}
	
	$("#RECconfigRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#record_config").text(), "RecConfig", 100, "Get");
		RfParamCall(Call, $("#record_config").text(), "RecConfig", sel, "Get");
		
	});
	
	$("#RECconfigDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#record_config").text(), "RecConfig", 850, "Get");
		RfParamCall(Call, $("#record_config").text(), "RecConfig", sel, "Get");
		
	});
	
	$("#RECconfigSave").click(function(){
		
		CHOSDSaveSel();
		RfParamCall(Call, $("#record_config").text(), "RecConfig", 200, "Set");	
	});
	
	
	
	
	$("#pzOk").click(function(){
		var pzCopyXml="";
		$("#pzCopyTD").css("display","none");		
		var spTdValue="";
		$.each($("input[id^='pz_ch']"),function(){
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
			
			pzCopyXml = "<a>";
			pzCopyXml += ("<CopyChid>" + copychid + "</CopyChid>");
			pzCopyXml += ("<ChnCloseOrOpen>" + ($("#ChnCloseOrOpen").val()*1) + "</ChnCloseOrOpen>");
			pzCopyXml += ("<RecordMode>" + ($("#RECRecordMode").val()) + "</RecordMode>");
			pzCopyXml += ("<PackTime>" + ($("#RECPackTime").val()) + "</PackTime>");
			pzCopyXml += ("<chid>" + sel + "</chid>")
			pzCopyXml += ("<PreRecSwitch>" + $("#RECPreRecordTime").val() + "</PreRecSwitch>");
			pzCopyXml += ("<StreamMode>" + $("#RecStreamMode").val() + "</StreamMode>");
			pzCopyXml += "</a>";
			RfParamCall(Call, $("#record_config").text(), "RecConfig", 400, "Set",pzCopyXml);	
		}
	})
});
