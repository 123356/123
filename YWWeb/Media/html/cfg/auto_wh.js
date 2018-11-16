// JavaScript Document
$(document).ready(function(){
	if(g_bDefaultShow == true){
		$("#AUTOWHDF").css("display","block");
	}
	
	if(lgCls.version == "URMET"){
		$("#ipc_remotereboot_div").css("display","block");
		$("#RemoteRebootck_ipc").prop("checked",false);//全选未选中
		copyTD("#RemoteRebootTD_ipc","RemoteReboot_ch_ipc","RemoteReboot_TDNum_ipc");
		$.each($("input[id^='RemoteReboot_ch_ipc']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("RemoteReboot_ch_ipc")[1]*1 - 1;
			if((IpcAbility[index].State == 2) && (IpcAbility[index].ProtocolType == 5||IpcAbility[index].ProtocolType == 0||IpcAbility[index].ProtocolType == 8)){
				$(this).prop("disabled",false);
			}else{
				$(this).prop("disabled",true);
			}
		})
		
		
		//全选
		$("#RemoteRebootck_ipc").click(function(){
			$.each($("input[id^='RemoteReboot_ch_ipc']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("RemoteReboot_ch_ipc")[1]*1 - 1;
				if((IpcAbility[index].State == 2) && (IpcAbility[index].ProtocolType == 5||IpcAbility[index].ProtocolType == 0||IpcAbility[index].ProtocolType == 8)){
					$(this).prop("checked",$("#RemoteRebootck_ipc").prop("checked"));
				}
			})
		})
		
		$("#RemoteReboot_ipc").click(function(){
			var mask = GetChannelMask_ipc();
			if(mask == 0)
				return;
			var xml = "<a>";
			xml += "<Key>329</Key>";
			xml += "<ChannelMask>"+mask+"</ChannelMask>";
			xml += "</a>";
			var reboot_ret =  gDvr.RemoteTest(xml);
			ShowPaop($("#atuo_title").text(), lg.get("IDS_IPCREBOOT_LATER"));
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
			$.each($("input[id^='RemoteReboot_ch_ipc']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("RemoteReboot_ch_ipc")[1]*1 - 1;
				if((IpcAbility[index].State == 2) && (IpcAbility[index].ProtocolType == 5||IpcAbility[index].ProtocolType == 0||IpcAbility[index].ProtocolType == 8) && $(this).prop("checked")){
					channelMask |= 1<<index;//选中位 置1
				}
			})
			return channelMask;
		}
	}
	
	var EnabledUserList = 1;
	switch(lgCls.version){
		case "SWANN":{
			$("#RemoteReboot").css("display","block");
			break;
		}
		case "URMET":{
			$("#RemoteReboot").css("display","block");
			$("#ipc_remotereboot_div").css("display","block");
			break;
		}
		default:{
			$("#RemoteReboot").css("display","none");
			break;
		}	
	}
	
	if(lgCls.version == "HONEYWELL"){
		$("#SysInfmaintainperiod1").css("border", "1px solid white");
		$("#SysInfmaintainperiod2").css("border", "1px solid white");
	}
	
	var DayArray=lg.get("IDS_WEEK_ARRAY").split(",");
	//初始操作
	//scrollFun('sys_base_h_6',0,23);
	//scrollFun('sys_base_m_6',0,59);
	
	gVar.errTitle = $("#atuo_title").text();
	RfParamCall(Call, $("#atuo_title").text(), "sysMaintain", 100, "Get");	//初始时获取页面数据
	
	$("#auto_timer").timer({Type:1});
	function Call(xml){
		//console.log("call:" + xml);
		$("#auto_timer").timer.SetTimeIn24(findNode("time", xml)+":0", $("#auto_timer"));
		$("#SysInfautomaintain").val(findNode("automaintain", xml)*1);
		if(findNode("EnableUser",xml)*1 == 1)
		{
			$("#DefaultUser").css("display","block");
			EnabledUserList = findNode("EnabledUserList",xml)*1;
			$("#SysMainUserSwitch").empty();
			if(gDvr.hybirdDVRFlag==1){
				$("#SysMainUserSwitch").append('<option class="option" value="'+0+'">'+lg.get("IDS_OFF")+'</option>');//列表第0项固定是OFF
				$("#SysMainUserSwitch").append('<option class="option" value="'+1+'">' + findNode("UserName_0", xml) + '</option>');//列表第1项admin的翻译使用UserName[0]
				if(1){
					for(var i=1;i<7;i++){
						if((1&(EnabledUserList>>i)) == 1){
							$("#SysMainUserSwitch").append('<option class="option" value="'+(i+1)+'">'+  findNode("UserName_"+i, xml)  +'</option>');//列表2项user1的翻译使用UserName[1]
						}
					}
				}
			}else{
				$("#SysMainUserSwitch").append('<option class="option" value="'+0+'">'+lg.get("IDS_OFF")+'</option>');
				$("#SysMainUserSwitch").append('<option class="option" value="'+1+'">'+lg.get("IDS_ADMIN")+'</option>');
				if(1/*lgCls.version != "KGUARD" && lgCls.version != "URMET"*/){                                                                   
					for(var i=1;i<8;i++){
						if((1&(EnabledUserList>>i)) == 1){
							$("#SysMainUserSwitch").append('<option class="option" value="'+(i+1)+'">'+lg.get("IDS_USER")+i+'</option>');
						}
					}
				}
			}
		}
		
		setTimeout(function(){
			$("#SysMainUserSwitch").val(findNode("defaultuserid",xml)*1)
		},0);
		
		$("#SysInfmaintainperiod1").val(findNode("maintainperiod1", xml));
		$("#SysInfmaintainperiod2").attr("name", findNode("maintainperiod2", xml));
		
		setTimeout(function(){
			$("#SysInfmaintainperiod1").change();
			setTimeout(function(){
				$("#SysInfautomaintain").change();
			},1);
			
			$("#SysInfautomaintain").change();
		}, 1);
		
		if(gDvr.hybirdDVRFlag==1){
			TimeFormat = findNode("TimeFormat", xml)*1;//0:24小时制  1:12小时制
			if(TimeFormat==0){//不显示秒、24小时制不显示AMPM
				$("#auto_timer").timer.ChangeType( 2, $("#auto_timer") );
			}else if(TimeFormat==1){//不显示秒、12小时制显示AMPM
				$("#auto_timer").timer.ChangeType( 3, $("#auto_timer") );
			}
		}
	}
	
	$("#SysInfautomaintain").change(function(){
		$(this).prop("checked", $(this).val()*1);
		DivBox("#SysInfautomaintain", "#SysInfDivBox");
	})
	
	$("#SysInfmaintainperiod1").change(function(){
		if ($("#SysInfmaintainperiod1").val() == 1){
			$("#SysInfmaintainperiod2").empty();		
			for (var i=0; i<=6; i++){
				$("#SysInfmaintainperiod2").append('<option class="option" value="'+i+'">'+DayArray[i]+'</option>');
			}
			$("#SysInfmaintainperiod2").css("display", "");
			$("#WWWABC").css("display", "");
			$("#SysInfmaintainperiod2").prop("value", 0);
			if ($("#SysInfmaintainperiod2").attr("name")>=7){
				$("#SysInfmaintainperiod2").prop("value", 0);
				return;
			}
		}else if ($("#SysInfmaintainperiod1").val() == 2){
			$("#SysInfmaintainperiod2").empty();
			for (var i=1; i<32; i++){
				$("#SysInfmaintainperiod2").append('<option class="option" value="'+i+'">'+i+lg.get("IDS_DAY")+'</option>');
			}
			$("#SysInfmaintainperiod2").css("display", "");
			$("#WWWABC").css("display", "")

			if ($("#SysInfmaintainperiod2").attr("name")<1){
				$("#SysInfmaintainperiod2").prop("value", 1);
				return ;
			}
		}else {
			$("#SysInfmaintainperiod2").css("display", "none");
			$("#WWWABC").css("display", "none")
		}
		$("#SysInfmaintainperiod2").prop("value", $("#SysInfmaintainperiod2").attr("name"));
	});
	
	$("#AUTOWHRF").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#atuo_title").text(), "sysMaintain", 100, "Get");	//刷新页面数据
	});
	
	$("#AUTOWHDF").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#atuo_title").text(), "sysMaintain", 850, "Get");
	});
	
	$("#AUTOWHSV").click(function(){
		var xml = "<a>";
		xml += ("<time>" +$("#auto_timer").timer.GetTimeFor24($("#auto_timer")) +"</time>"); 
		xml += ("<maintainperiod1>" + ($("#SysInfmaintainperiod1").val()) + "</maintainperiod1>");
		xml += ("<maintainperiod2>" + ($("#SysInfmaintainperiod2").val()) + "</maintainperiod2>");
		xml += ("<automaintain>" + ($("#SysInfautomaintain").val()) + "</automaintain>");
		xml += ("<defaultuserid>" + ($("#SysMainUserSwitch").val()) + "</defaultuserid>");
		xml += "</a>";
		//console.log("save:" + xml);
		RfParamCall(Call, $("#atuo_title").text(), "sysMaintain", 300, "Set", xml);	//保存
	});
	
	function WhCheckPassword(){
		if(!confirm(lg.get("IDS_SUER_RESTART"))){
				return;
		}
		var xml = "<a>";
		xml += "<Key>303</Key>";
		xml += "</a>";
		$("#RemoteReboot").prop("disabled",true);
		var reboot_ret =  gDvr.RemoteTest(xml);
		if(-1 == reboot_ret){	
			ShowPaop($("#atuo_title").text(),lg.get("IDS_SEND_FAILED"));
			$("#RemoteReboot").prop("disabled",false);
		}else if(-2 == reboot_ret){
			ShowPaop($("#auto_title").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			$("#RemoteReboot").prop("disabled",false);
		}
		else{
			ShowPaop($("#auto_title").text(),lg.get("IDS_DVR_REBOOT"));
			$("#RemoteReboot").prop("disabled",false);
		}
	}
	
	$("#RemoteReboot").click(function(){
		if(gVar.passwd == ""){
			WhCheckPassword();
		}else{
			CheckPassword = WhCheckPassword;
			$("#reboot_prompt").css("display","block");
			$("#reboot_title").children("em").prop("innerHTML",lg.get("IDS_REBOOT_PWD"));//Please enter the password
			$("#reboot_input").val("");
			MasklayerShow();
		}
		
	});
});
