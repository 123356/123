$(document).ready(function(){
	if(lgCls.version == "URMET"){
		$("#default_ipc_div").css("display","block");
		$("#default_NVR_tail").css("display","block");
		$("#default_parmck_ipc").prop("checked",false);//全选未选中
		copyTD("#default_parmTD_ipc","default_parm_ch_ipc","default_parm_TDNum_ipc");
		$.each($("input[id^='default_parm_ch_ipc']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("default_parm_ch_ipc")[1]*1 - 1;
			if((IpcAbility[index].State == 2) && (IpcAbility[index].ProtocolType == 5||IpcAbility[index].ProtocolType == 0||IpcAbility[index].ProtocolType == 8)){
				$(this).prop("disabled",false);
			}else{
				$(this).prop("disabled",true);
			}
		})
		
		
		//全选
		$("#default_parmck_ipc").click(function(){
			$.each($("input[id^='default_parm_ch_ipc']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("default_parm_ch_ipc")[1]*1 - 1;
				if((IpcAbility[index].State == 2) && (IpcAbility[index].ProtocolType == 5||IpcAbility[index].ProtocolType == 0||IpcAbility[index].ProtocolType == 8)){
					$(this).prop("checked",$("#default_parmck_ipc").prop("checked"));
				}
			})
		})
		
		$("#DefaultSave_ipc").click(function(){
			var mask = GetChannelMask_ipc();
			if(mask == 0)
				return;
			var xml = "<a>";
			xml += "<Key>330</Key>";
			xml += "<ChannelMask>"+mask+"</ChannelMask>";
			xml += "</a>";
			var reboot_ret =  gDvr.RemoteTest(xml);
			ShowPaop($("#default_parm").text(), lg.get("IDS_IPCREBOOT_LATER"));
			/*if(-1 == reboot_ret){	
				ShowPaop($("#atuo_title").text(),lg.get("IDS_SEND_FAILED"));
				$("#RemoteReboot").prop("disabled",false);
			}else if(-2 == reboot_ret){
				ShowPaop($("#auto_title").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
				$("#RemoteReboot").prop("disabled",false);
			}
			else{
				ShowPaop($("#auto_title").text(),lg.get("IDS_DVR_REBOOT"));
				$("#RemoteReboot").prop("disabled",false);
			}*/
		})
		
		function GetChannelMask_ipc(){//获取 选中通道掩码
			var channelMask = 0;
			$.each($("input[id^='default_parm_ch_ipc']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("default_parm_ch_ipc")[1]*1 - 1;
				if((IpcAbility[index].State == 2) && (IpcAbility[index].ProtocolType == 5||IpcAbility[index].ProtocolType == 0||IpcAbility[index].ProtocolType == 8) && $(this).prop("checked")){
					channelMask |= 1<<index;//选中位 置1
				}
			})
			return channelMask;
		}
	}
	MasklayerHide();
	function Call(xml){
	}	
	$("#DefaultSave").click(function(){
		//MasklayerShow();
		var xml = "<a>";
		xml += ("<DisplaySet_flag>" + ($("#MR_Display").prop("checked")*1) + "</DisplaySet_flag>");
		xml += ("<RecordSet_flag>" + ($("#MR_Record").prop("checked")*1) + "</RecordSet_flag>");
		xml += ("<NetworkSet_flag>" + ($("#MR_Network").prop("checked")*1) + "</NetworkSet_flag>");
		xml += ("<AlarmSet_flag>" + ($("#MR_Alarm").prop("checked")*1) + "</AlarmSet_flag>");
		xml += ("<SystemSet_flag>" + ($("#MR_System").prop("checked")*1) + "</SystemSet_flag>");
		xml += ("<DeviceSet_flag>" + ($("#MR_Device").prop("checked")*1) + "</DeviceSet_flag>");
		xml += ("<AdvanceSet_flag>" + ($("#MR_Advance").prop("checked")*1) + "</AdvanceSet_flag>");
		xml += "</a>";
		RfParamCall(Call, $("#default_parm").text(), "Default", 300, "Set", xml);
	});
	//是否全选
	$("#all_mr").click(function(){
		$("input[id$='Set_flag']").prop("checked",$(this).prop("checked"));
	})
});