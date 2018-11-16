// JavaScript Document
//远程升级功能暂未实现，没有可用的结构体
var selCount = 0;
var ipcstatus = "";

$(document).ready(function(){
	//初始操作
	MasklayerHide();
	if(gDvr.bAdmin == true /*&& gDvr.DevType == 4*/)
	{
		for(var i=0; i<gDvr.nChannel; i++)
			$("#upgrade_file_IPCSel").append('<option class="option" value="'+i+'">'+gDvr.chname[i]+'</option>');
	}
	
	$("#btnSj").click(function(){
		var filePath = gDvr.OpenLocalFile(0);
		if(filePath!="err" && filePath!="IDCANCEL"){
			$("#txtFileName").val(filePath);
			$("#UPDATESTATE").css("display", "block")
			$("#UPDATESTATE1").css("border", "1px solid #FFF").css("border-top", "0px");
		}
	})
	
	function SjCheckPassword(){
		if(!confirm(lg.get("IDS_UPDATETIP"))){
					return;
		}
		var path = $("#txtFileName").val();	
		$("#UPStart").prop("disabled",true);
		gDvr.FileUpdate(1,path,0,0);
		if(gDvr.DevType == 4){
			$("#RebootTootip").css("display","block");
			$("#RebootTootipText").prop("innerHTML",lg.get("IDS_IPC_SENDFILE"));
		}
	}
	
	$("#UPStart").click(function(){
		var path = $("#txtFileName").val();
		if(path == null || path == ""){
			ShowPaop($("#l_upgrade").text(),lg.get("IDS_UPDATEFILEPATH"));
			return;
		}
		if(0/*lgCls.version == "OWL"*/){
			if(gVar.passwd == ""){
				SjCheckPassword();
			}else{
				CheckPassword = SjCheckPassword;
				$("#reboot_prompt").css("display","block");
				$("#reboot_title").children("em").prop("innerHTML",lg.get("IDS_REBOOT_PWD"));	
				$("#reboot_input").val("");
				MasklayerShow();
			}
		}else{
			showDiv(true,$("#IPC_Upgrade"));//disable
			$("#UPStart").prop("disabled",true);
			   gDvr.FileUpdate(1,path,0,0);
			   if(gDvr.DevType == 4){
					$("#RebootTootip").css("display","block");
					$("#RebootTootipText").prop("innerHTML",lg.get("IDS_IPC_SENDFILE"));
				}
		}
	});
	
	$("#UPStop").click(function(){
		//clearTimeout(tid);
		gDvr.FileUpdate(0,"",0,0);
		$("#UPStop,#UPStart").prop("disabled",false);
		showDiv(false,$("#IPC_Upgrade"));//enable
		if(gDvr.DevType == 4){
			$("#RebootTootip").css("display","none");
		}
	});
	
	//升级IPC liuyong 20150318
	
	if(lgCls.version == "URMET")//是否开启IPC 升级
	{
		var filetype_ipc = -1;//私有协议==0，URMET协议==5，未选中==-1
		var isIPC3516D = "";
		$("#NVR_tail").css("display","block");
		$("#IPC_Upgrade").css("display","block");
		$("#NVR_updateck_ipc").prop("checked",false);//全选未选中
		$("#NVR_updateck_ipc").prop("disabled",true);//默认disable，选中文件后enable
		copyTD("#NVR_updateTD_ipc","update_ch_ipc","NVR_update_TDNum_ipc");
		$.each($("input[id^='update_ch_ipc']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("update_ch_ipc")[1]*1 - 1;
			$(this).prop("disabled",true);//全部disable，选择文件后根据文件后缀判断是否enable
		})
		
		
		//全选
		$("#NVR_updateck_ipc").click(function(){
			$.each($("input[id^='update_ch_ipc']"),function(){
				var thisId = $(this).attr("id");
				var index = thisId.split("update_ch_ipc")[1]*1 - 1;
				if((IpcAbility[index].State == 2) && IpcAbility[index].ProtocolType == filetype_ipc){
					if(IpcAbility[index].IPCDevTypeFlag == 2){
						$(this).prop("checked",$("#NVR_updateck_ipc").prop("checked") && (isIPC3516D=="h265"));
					}else if(IpcAbility[index].IPCDevTypeFlag == 1){
						$(this).prop("checked",$("#NVR_updateck_ipc").prop("checked") && (isIPC3516D=="h264"));
					}else{
						$(this).prop("checked",$("#NVR_updateck_ipc").prop("checked") && (isIPC3516D==""));
					}
				}
			})
		})
		
		//选择IPC 升级文件
		$("#btnSj_ipc").click(function(){
			var filePath_ipc = gDvr.OpenLocalFile(0);
			if(filePath_ipc!="err" && filePath_ipc!="IDCANCEL"){
				$("#txtFileName_ipc").val(filePath_ipc);
				//根据文件后缀名判断协议类型
				if(filePath_ipc.substr(filePath_ipc.length - 3,3) == ".sw"){//私有协议
					filetype_ipc = 0;
					if(filePath_ipc.substr(filePath_ipc.lastIndexOf("\\") + 1,5) == "CH283"
						|| filePath_ipc.substr(filePath_ipc.lastIndexOf("\\") + 1,5) == "CH273"){
						isIPC3516D = "h264";
					}else if(filePath_ipc.substr(filePath_ipc.lastIndexOf("\\") + 1,5) == "CH293"
							||filePath_ipc.substr(filePath_ipc.lastIndexOf("\\") + 1,5) == "CH29X"){
						isIPC3516D = "h265";
					}else{
						isIPC3516D = "";
					}
				}else if(filePath_ipc.substr(filePath_ipc.length - 4,4) == ".img"){//Urmet协议
					filetype_ipc = 5;
				}else if(filePath_ipc.substr(filePath_ipc.length - 4,4) == ".bin"){//卓威协议
					filetype_ipc = 8;
				}else{
					filetype_ipc = -1;
					return ;
				}
				$("#UPDATESTATE_ipc").css("display", "block")
				$("#UPDATESTATE1_ipc").css("border", "1px solid #FFF").css("border-top", "0px");
				
				//根据协议类型改变各通道可选状态
				$("#NVR_updateck_ipc").prop("disabled",false);//默认disable，选中文件后enable
				$.each($("input[id^='update_ch_ipc']"),function(){
					var thisId = $(this).attr("id");
					var index = thisId.split("update_ch_ipc")[1]*1 - 1;
					$(this).prop("disabled",true);//选择其他类型文件，先把之前的通道disable
					$(this).prop("checked",false);
					$("#NVR_updateck_ipc").prop("checked",false);
					if((IpcAbility[index].State == 2) && IpcAbility[index].ProtocolType == filetype_ipc){//通道与升级文件协议类型相同时，enable
						$(this).prop("disabled",false);
						if(IpcAbility[index].IPCDevTypeFlag == 2){//h265
							$(this).prop("disabled",!(isIPC3516D=="h265"));
						}else if(IpcAbility[index].IPCDevTypeFlag == 1){//h264
							$(this).prop("disabled",!(isIPC3516D=="h264"));
						}else{
							$(this).prop("disabled",!(isIPC3516D==""));
						}
					}
				})
			}
		})
		
		$("#UPStart_ipc").click(function(){
			ipcstatus = "";
			var path = $("#txtFileName_ipc").val();
			if(path == null || path == ""){
				ShowPaop($("#l_upgrade").text(),lg.get("IDS_UPDATEFILEPATH"));
				return;
			}
			showDiv(true,$("#NVR_Upgrade"));//disable
			$("#UPStart_ipc").prop("disabled",true);
			var type_ipc = 0;
			if(filetype_ipc == 0){
				type_ipc = 5;
			}else if(filetype_ipc == 5 || filetype_ipc == 8){
				type_ipc = 4;
			}
			var mask = GetChannelMask_ipc()*1;
			if(mask == 0){
				$("#UPStop_ipc").click();
				ShowPaop(lg.get("IDS_SYS_UPDATE"), "Please select channels.");
				return ;
			}
			MasklayerShow();
		  	gDvr.FileUpdate(1,path,mask,type_ipc*1);
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_IPC_UPDATE"));
		});
		
		$("#UPStop_ipc").click(function(){
			gDvr.FileUpdate(0,"",0,0);
			ipcstatus = "";
			$("#txtFileName_ipc").val("");
			$("#UPStop_ipc,#UPStart_ipc").prop("disabled",false);
			showDiv(false,$("#NVR_Upgrade"));//enable
		});
		
		function GetChannelMask_ipc(){//获取 选中通道掩码
			selCount = 0;
			var channelMask = 0;
			$.each($("input[id^='update_ch_ipc']"),function(){
				if(selCount == 4){//最多同时升级4个IPC，取前四个
					ShowPaop(lg.get("IDS_SYS_UPDATE"), "Up to upgrade four IPC, now only upgrade the previous four.");
					return channelMask;
				}
				var thisId = $(this).attr("id");
				var index = thisId.split("update_ch_ipc")[1]*1 - 1;
				if((IpcAbility[index].State == 2) && IpcAbility[index].ProtocolType == filetype_ipc && $(this).prop("checked")){
					channelMask |= 1<<index;//选中位 置1
					++selCount;
				}
			})
			return channelMask;
		}
	}
	
	//升级IPC end liuyong 20150318
	
	

});


FileUpdateCallBack = FileUpdateCall;
function FileUpdateCall(pos,strMsg,type)
{
	//console.log("pos,strMsg,type:"+pos+","+strMsg+","+type);
	if(type == 1){//IPC  升级
		var channelNo = pos&0xFFFF;
		var status = pos>>16;
		//console.log("pos"+pos+" channelNo:"+channelNo+" status"+status);
		/*if(selCount <= 0){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), ipcstatus);
			return ;
			
		}*/
		if(status == -1){//升级失败
			ipcstatus += "CH" + (channelNo+1) +　" upgrade failed!<br>";
		}else if(status == 1){//升级成功
			ipcstatus += "CH " + (channelNo+1) +　lg.get("IDS_IPC_UPDATE_SUC") + "<br>";
		}else if(status == -2){//校验错误 
			ipcstatus += "CH" + (channelNo+1) +　" check failes!<br>";
		}else if(status == -3){//版本错误 
			ipcstatus += "CH" + (channelNo+1) +　" 's version is lastest!<br>";
		}else{//升级中
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_IPC_UPDATE"));
			return; 
		}
		if(--selCount <= 0){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), ipcstatus);
			$("#UPStop_ipc").click();
			MasklayerHide();
		}
		
	}else{//NVR 升级
		if(pos<=100 && pos >= 0){
			$("#aa").css("display","block");
			$("#aa").css("width",pos+"%");
			$("#updateMsg").html(pos+"%");
		}else if(pos == 390){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_REMOTEUPGRADE_CLOSED"));
		}else if(pos == 391){
			$("#aa").css("display","block");
			$("#aa").css("width", "100%");
			$("#updateMsg").html("100%");
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_REMOTEUPGRADE_OK"));	
			var title = $("#l_upgrade").text();
			window.setTimeout(function(){AutoClose(title);}, 1000);  
		}else if(pos == 392){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_REMOTEUPGRADE_READFILEFAIL"));
		}else if(pos == 393){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_REMOTEUPGRADE_INVALIDFILE"));
		}else if(pos == 395){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_REMOTEUPGRADE_VERERROR"));
		}else if(pos == 396){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_REMOTEUPGRAD_ING"));
		}else if(pos == 397){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_REMOTEUPGRAD_SAME"));
		}else if(pos == 399){
			ShowPaop(lg.get("IDS_SYS_UPDATE"), lg.get("IDS_INUSERINTERFACE"));//Local user is operating , cannot be upgraded!
		}else if(pos == 764){
		}
		if(pos>=390 && pos<=397){
			if(type == 0){
				$("#UPStop,#UPStart").prop("disabled",false);
			}else{
				$("#UPStop_ipc,#UPStart_ipc").prop("disabled",false);
			}
			$("#RebootTootip").css("display","none");
		}
	}
}
