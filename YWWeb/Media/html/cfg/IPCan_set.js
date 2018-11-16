
$(document).ready(function(){
//初始操作
	if(gDvr.customProtolFlag == 1){
		$("#IPCProtocolManagement").css("display","block");
	}
	if(lgCls.version == "KGUARD" && gDvr.nMainType == 0x52530302 && gDvr.nSubType == 0x80101){
		$("#QuickAdd").css("display","none");
	}else if(lgCls.version == "URMET"){
		$("#IPCAutoAdd").css("display","block");
	}
	
	var curMode; //0=蓝色铅笔编辑图标, 1=绿色添加图标
	var listData = [];
	var searchData = [];
	var sel=-1;//rowindex
	var protocolType = [];
	protocolType[0] = lg.get("IDS_PROTOCOL_PRIVATE");//私有协议
	protocolType[1] = lg.get("IDS_PROTOCOL_RSSZ");//私有协议2
	protocolType[2] = lg.get("IDS_PROTOCOL_SAMSUNG");//三星
	protocolType[3] = lg.get("IDS_PROTOCOL_ZXNH");//中西霓虹
	//protocolType[3] = lg.get("IDS_PROTOCOL_QHTF");//清华同方
	protocolType[4] = lg.get("IDS_PROTOCOL_ONVIF");//Onvif
	protocolType[5] = lg.get("IDS_PROTOCOL_URMET");//Urmet
	protocolType[6] = lg.get("IDS_PROTOCOL_AMTK");//Amtk
	protocolType[7] = lg.get("IDS_PROTOCOL_SHANY");//Shany
	protocolType[8] = lg.get("IDS_PROTOCOL_ZHUOWEI");//卓威
	protocolType[9] = lg.get("IDS_PROTOCOL_MINGJING");//明景
	protocolType[10] = lg.get("IDS_PROTOCOL_FSAN");//Fsan
	protocolType[11] = lg.get("IDS_PROTOCOL_QIHAN");//qihan
	protocolType[12] = lg.get("IDS_PROTOCOL_GRANDMEDIA");//GRANDMEDIA
	protocolType[13] = lg.get("IDS_PROTOCOL_SONIX");//SONIX
	protocolType[14] = lg.get("IDS_PROTOCOL_YCX");//yanchuangxing
	var customProtocolType = [];
	getCustomProtoName();//获取自定义协议名称
	
	//IP Address列
	function IpRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.ip;
		else
			return "";
	}
	
	//Port列
	function PortRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.port;
		else
			return "";
	}
	
	//Protocol列
	function ProtocolRenderFun(rowdata, rowindex, value){
		if(rowdata.enable){
			if(rowdata.protocol >= 32){
				return customProtocolType[rowdata.protocol - 32];
			}else{
				return protocolType[rowdata.protocol];
			}
		}else{
			return "";
		}
	}
	
	//无
	function CHNMAXRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.chnmax;
		else
			return "";
	}
	
	//Subnet Mask列
	function NetmaskRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.netmask;
		else
			return "";
	}
	
	//State列
	function StateRenderFun(rowdata, rowindex, value){
		if(rowdata.enable == 1){//显示图片
			if(rowdata.state == 2){//on.png
				return '<div><image src="images/on.png" style="width:20px; height:20px;" /></div>';
			}else{//off.png
				return '<div><image src="images/off.png" style="width:20px; height:20px;" onclick="stateBtnCallBack('+rowdata.state+')"/></div>';
			}
		}
	}
	
	//蓝色铅笔编辑列
	function EditRenderFun(rowdata, rowindex, value){
		if(rowdata.enable == 1){
			return '<image src="images/edit.png" style="width:20px; height:20px;" onclick="editBtnCallBack('+rowindex+')"/>' ;
		}else{
			return "";
		}
	}
	
	//绿色添加、红色删除列
	function OperationRenderFun(rowdata, rowindex, value){
		if(!(rowdata.enable)){//未添加,add.png，绿色添加图标
			return '<image src="images/add.png" style="width:20px; height:20px;" onclick="addBtnCallBack('+rowindex+')"/>' ;
		}else{//已添加,delete.png,红色删除图标
			return '<image src="images/delete.png" style="width:20px; height:20px;" onclick="deleteBtnCallBack('+rowindex+')"/>' ;
		}
	}
	
	//Software Version列
	function SoftVersionRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.softversion;
		else
			return "";
	}
	
	function P2puidRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.P2pUID;
		else
			return "";
	}
	
	//Manufacturer列
	function ManufacturerRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.manufacturer;
		else
			return "";
	}
	
	//Device type列
	function DevTypeRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.devtype;
		else
			return "";
	}
	
	//MAC Address列
	function MacRenderFun(rowdata, rowindex, value){
		if(rowdata.enable)
			return rowdata.mac;
		else
			return "";
	}
	
	//刷新
	function listDataCall(xml){
		listData = JSON.parse(xml);
		for(var i=0; i<listData.length; i++){
			if(gDvr.hybirdDVRFlag){
				listData[i].channel = "IP CH" + (i+1-gDvr.AnalogChNum);
			}else{
				listData[i].channel = lg.get("IDS_CH") + (i+1);
			}
			listData[i].index = i;
			if(listData[i].protocol == 13){//sonix
				listData[i].ip += "_CH" + (listData[i].FrontEndChnnal+1);
			}
		}
		var gridData = [];
		gridData.Rows = listData;
		gridData.Total = listData.length;
		$("#listDataGrid").ligerGrid().loadData(gridData);
		//ShowPaop(gVar.errTitle, lg.get("IDS_REFRESH_SUCCESS"));
		
		MasklayerHide();
	}
	
	function IpcSaveCall(){
		//RfParamCall(listDataCall, $("#ipcan_info").text(), "ipc_Set", 150, "Get");
		var str = gDvr.obj.GetAndSetNetParam("ipc_Set",0,150,"");
		listDataCall(str);
	}
	
	function IpcRefreshCall(){
		//RfParamCall(listDataCall, $("#ipcan_info").text(), "ipc_Set", 150, "Get");
		var str = gDvr.obj.GetAndSetNetParam("ipc_Set",0,150,"");
		listDataCall(str);
	}
	
	function searchDataCall(xml){
		searchData = JSON.parse(xml);
		for(var i=0; i<searchData.length; i++){
			searchData[i].enable = 1;
			searchData[i].username = "admin";
			searchData[i].password = "";
			if(searchData[i].protocol == 13){//sonix
				searchData[i].ip += "_CH" + (searchData[i].FrontEndChnnal+1);
			}
		}
		var gridData = [];
		gridData.Rows = searchData;
		gridData.Total = searchData.length;
		/*for(var i = 0;i < searchData.length; ++i){
			//console.log(searchData[i].ip);
		}*/
		$("#searchDataGrid").ligerGrid().loadData(gridData);
		MasklayerHide();
	}
	
	function checkIsAdd(obj){
		listData.forEach(function(e){  
    		if(e.ip == obj.ip && e.port == obj.port)
				return true;  
		})
		return false;
	}
	
	//click 绿色添加图标
	function addBtnClick(rowindex){		
		//console.log(rowindex+" "+gDvr.MaxPOENum+" "+listData[rowindex].switchmode+" "+IpcAbility[rowindex].ProtocolType);
		if(gDvr.MaxPOENum != 0){
			if((rowindex < gDvr.MaxPOENum) && (listData[rowindex].switchmode == 0)){
				ShowPaop($("#ipcan_info").text(),lg.get("IDS_LIMIT_ADD"));//POE 通道禁止添加摄像头！
				return;
			}
		}
		sel = rowindex;
		curMode = 1;
		changeSetTableState(rowindex,1);
		$("#IPCProtocol").prop("disabled",false);
		$("#ipc_frontboundTable").css("display","none");
		$("#list_table").css("display","none");
		$("#IPC_SET").css("display","block");
		$("#IPCProtocol").empty();
		for(var i=0; i<32; i++){
			if(((gDvr.ProtocolType>>i)&1) == 1){	
				$("#IPCProtocol").append('<option class="option" value="'+i+'">'+protocolType[i]+'</option>');
			}
		}
		if(gDvr.customProtolFlag == 1){
			for(var i = 0;i < 16; ++i){
				$("#IPCProtocol").append('<option class="option" value="'+(i+32)+'">'+customProtocolType[i]+'</option>');
			}
		}
	}
	
	$("#IPCProtocol").change(function(){
		if($("#IPCProtocol").val() == 13){
			$("#ipc_frontboundTable").css("display","block");
		}else{
			$("#ipc_frontboundTable").css("display","none");
		}
	});
	
	//click State图标
	function stateBtnClick(state){
		if(state == 0){
			ShowPaop($("#ipcan_info").text(),lg.get("IDS_CONNECT_FAILED"));//无法连接到摄像头，请检查网络连接！
		}else if(state == 1){
			ShowPaop($("#ipcan_info").text(),lg.get("IDS_UNAUTHER"));//用户名或密码错误！
		}else if(state == 3){
			ShowPaop($("#ipcan_info").text(),lg.get("IDS_CONNECTING"));//正在连接，请稍候...
		}else if(state == 4){
			ShowPaop($("#ipcan_info").text(),lg.get("IDS_BANDWIDTH_LIMITED"));//没有足够的带宽供该摄像头使用！
		}
	}
	
	//click 蓝色铅笔编辑图标
	function editBtnClick(rowindex){
		if(listData[rowindex].protocol == 13){
			$("#IPCProtocol").prop("disabled",true);
			$("#ipc_frontboundTable").css("display","block");
		}else{
			$("#IPCProtocol").prop("disabled",false);
			$("#ipc_frontboundTable").css("display","none");
		}
		if(gDvr.MaxPOENum != 0){
			if((rowindex < gDvr.MaxPOENum) && (listData[rowindex].switchmode == 0)){
				/*
				ShowPaop($("#ipcan_info").text(),lg.get("IDS_LIMIT_EDIT"));//POE 通道禁止修改！
				return;
				*/
				$("#IPCChlName").prop("disabled",true);
				$("#IPCAddress").prop("disabled",true);
				$("#IPCNetmask").prop("disabled",true);
				$("#IPCPort").prop("disabled",true);
				$("#IPCProtocol").prop("disabled",true);
			}
		}
		sel = rowindex;
		curMode = 0;
		changeSetTableState(rowindex);
		$("#list_table").css("display","none");
		$("#IPC_SET").css("display","block");
		$("#IPCProtocol").empty();
		for(var i=0; i<32; i++){
			if(((gDvr.ProtocolType>>i)&1) == 1){	
				$("#IPCProtocol").append('<option class="option" value="'+i+'">'+protocolType[i]+'</option>');
			}
		}
		if(gDvr.customProtolFlag == 1){
			for(var i = 0;i < 16; ++i){
				$("#IPCProtocol").append('<option class="option" value="'+(i+32)+'">'+customProtocolType[i]+'</option>');
			}
		}
		$("#IPCProtocol").val(listData[rowindex].protocol);
	}
	
	//红色删除图标
	function deleteBtnClick(rowindex){
		if(gDvr.MaxPOENum != 0){
			if((rowindex < gDvr.MaxPOENum) && (listData[rowindex].switchmode == 0)){
				ShowPaop($("#ipcan_info").text(),lg.get("IDS_LIMIT_DELETE"));//POE 通道禁止删除！
				return;
			}
		}
		$.ligerMessageBox.confirm(lg.get("IDS_WARNING"), lg.get("IDS_DELETE_IPC"), function (r){//你确定要删除摄像头?
			if(r){
				var paramData = {};
				paramData.type = 2;//0:add,1:set,2:delete
				paramData.data = [{"deleteindex":rowindex}];
				RfParamCall(IpcSaveCall, $("#ipcan_info").text(), "ipc_Set", 300, "Set", JSON.stringify(paramData));
			}
		});
		
	}
	
	//Refresh按钮
	$("#IPCRefresh").click(function(){
		RfParamCall(listDataCall, $("#ipcan_info").text(), "ipc_Set", 100, "Get");//获取通道状态列表
	});
	
	//QuickAdd按钮
	$("#QuickAdd").click(function(){
		$("#list_table").css("display","none");
		$("#quickadd_table").css("display","block");
		$(".IPCUserPassword").prop("value","");
		$("#IPCUserName").val("admin");
		RfParamCall(searchDataCall, $("#ipcan_info").text(), "ipc_Set", 600, "Get");
	});
	
	//Auto Assign Channels按钮
	$("#IPCAutoAdd").click(function(){
		MasklayerShow();
		var xml = "<a>";
		xml += "<Key>333</Key>";
		xml += "</a>";
		gDvr.RemoteTest(xml);
	});
	
	//Delete按钮
	$("#IPCDelete").click(function(){
		var selectRows = $("#listDataGrid").ligerGrid().getSelectedRows();
		if(selectRows.length == 0){
			ShowPaop($("#ipcan_info").text(),lg.get("IDS_IPC_SELECT"));
			return; 
		}
		$.ligerMessageBox.confirm(lg.get("IDS_WARNING"), lg.get("IDS_DELETE_IPC"), function (r){//你确定要删除摄像头?
			if(r){
				var paramData = {};
				paramData.type = 2;//0:add,1:set,2:delete
				paramData.data = [];
				var flag = 0;
				var num = 0;
				for(var i=0; i<selectRows.length; i++){
					if(selectRows[i].enable*1 == 0)
						continue;
					//console.log(gDvr.MaxPOENum+" "+listData[i].switchmode+" "+listData[i].protocol);
					if(gDvr.MaxPOENum != 0){
						if((i < gDvr.MaxPOENum) && (listData[i].switchmode == 0) && (listData[i].protocol == 0)){	
							if(flag == 0){
								ShowPaop($("#ipcan_info").text(),lg.get("IDS_LIMIT_DELETE"));
								flag = 1;
							}
							//console.log("1 "+i);
							continue;
						}
					}
					//console.log(i);
					var obj = {"deleteindex":selectRows[i].index};
					paramData.data.push(obj);
					num++;
				}
				if(num != 0){
					RfParamCall(IpcSaveCall, $("#ipcan_info").text(), "ipc_Set", 300, "Set", JSON.stringify(paramData));
				}
			}
        });
	});
	
	//协议管理按钮
	$("#IPCProtocolManagement").click(function(){
		showConfigChild("ProManage");
	});
	//end
	
	//快速添加页面的Add按钮
	$("#quickadd_ok").click(function(){
		var selectRows = $("#searchDataGrid").ligerGrid().getSelectedRows();
		if(selectRows.length == 0){
			ShowPaop($("#ipcan_info").text(),lg.get("IDS_IPC_SELECT"));
			return; 
		}
		
		var paramData = {};
		paramData.type = 0;//0:add,1:set,2:delete
		paramData.data = [];
		var indexPos = gDvr.MaxPOENum;
		//console.log((selectRows[0].switchmode*1));
		if((listData[0].switchmode*1) == 1){
			indexPos = 0;
		}
		
		//console.log(gDvr.MaxPOENum+" "+indexPos);
		for(var i=0; i<selectRows.length && indexPos<listData.length; i++){
			var obj = {};
			var flag = true;
			if(gDvr.hybirdDVRFlag==1){
				//
			}else{
				if(gDvr.MaxPOENum != 0){
					if(((selectRows[i].switchflag*1) == 1) && ((listData[0].switchmode*1) == 0)){
						obj.boundchannel = selectRows[i].portnum*1;
						flag = false;
					}
				}
			}
			if(flag == true){
				var bHasEmptyCh = false;
				for(var j = indexPos; j<listData.length; j++){
					if(listData[j].enable == 0){
						indexPos = j + 1;
						bHasEmptyCh = true;
						break;
					}
				}
				if(!bHasEmptyCh){
					ShowPaop($("#ipcan_info").text(),lg.get("IDS_NO_CHN_FOR_ADDING"));
					break;
				}
				obj.boundchannel = indexPos -1;
			}
			
			if(selectRows[i].protocol == 13){//sonix
				var sonixch = selectRows[i].ip.split("_CH");
				obj.ip = sonixch[0];
				obj.FrontEndChnnal = sonixch[1]*1-1;
			}else{
				obj.ip = selectRows[i].ip;
				obj.FrontEndChnnal = 0;
			}
			obj.port = selectRows[i].port*1;
			obj.protocol = selectRows[i].protocol*1;
			if($("#IPCUserName").val() == ""){
				obj.username = selectRows[i].username;
			}else{
				obj.username = $("#IPCUserName").val();
			}
			if($(".IPCUserPassword").prop("value") == ""){
				obj.password = selectRows[i].password;
			}else{
				obj.password = $(".IPCUserPassword").prop("value");
			}
			obj.manufacturer = selectRows[i].manufacturer;
			obj.mac = selectRows[i].mac;
			
			obj.softversion = selectRows[i].softversion;
			obj.devtype = selectRows[i].devtype;
			obj.chnmax = selectRows[i].chnmax;
			obj.WebPort = selectRows[i].WebPort*1;
			obj.DevTypeULLlo = selectRows[i].DevTypeULLlo;
			obj.DevTypeULLhi = selectRows[i].DevTypeULLhi;
			obj.Dns1 = selectRows[i].Dns1;
			obj.Dns2 = selectRows[i].Dns2;
			obj.Netmask = selectRows[i].Netmask;
			obj.GateWay = selectRows[i].GateWay;
			obj.Version = selectRows[i].Version;
			//obj.hardware = selectRows[i].hardware;
			obj.switchflag = selectRows[i].switchflag*1;
			obj.portnum = selectRows[i].portnum*1;
			paramData.data.push(obj);
		}
		
		if(paramData.data.length == 0)
			return;
		RfParamCall(IpcRefreshCall, $("#ipcan_info").text(), "ipc_Set", 300, "Set", JSON.stringify(paramData));
		$("#list_table").css("display","block");
		$("#quickadd_table").css("display","none");
	});
	
	//快速添加页面，Cancel按钮
	$("#quickadd_cancel").click(function(){
		$("#list_table").css("display","block");
		$("#quickadd_table").css("display","none");
	});
	
	//快速添加页面，Refresh按钮
	$("#quickadd_refresh").click(function(){
		RfParamCall(searchDataCall, $("#ipcan_info").text(), "ipc_Set", 600, "Get");
	});
	//end
	
	//手动添加、修改页面的Ok按钮
	$("#IPCSet_Ok").click(function(){
		if(curMode == 0){//蓝色铅笔编辑图标
			var paramData = {};
			paramData.type = 1;
			paramData.data = {};
			
			paramData.data.type = 1; //0:add,1:set,2:delete
			paramData.data.boundchannel = sel;
			paramData.data.devalias = $("#IPCChlName").val();
			paramData.data.aliaspos = $("#IPCChlNamePosition").val()*1;
			var temp = $("#IPCAddress").val();
			var reExp = /^0*(\d+\.)0*(\d+\.)0*(\d+\.)0*(\d+)$/; 
			var ip;
			var domainExp = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|(io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp))$/;
			var ipExp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
			if( temp != "" ){
				ip = temp.replace(reExp, '$1$2$3$4');
				if(ip.match(ipExp) == null){	
					ip = temp;	
					//ShowPaop($("#ipcan_info").text(),lg.get("IDS_IPADD_ADDERR"));
					//return; 
				}
			}
			else{
				ShowPaop($("#ipcan_info").text(),lg.get("IDS_IPADD_ADDERR"));
				return; 
			}
			if($("#IPCProtocol").val()*1 == 13){//sonix
				ip += "_CH" + ($("#IPCFrontBound").val()*1+1);
			}
			for(var i=0; i<listData.length; i++){
				if( listData[i].enable && (ip == listData[i].ip && listData[i].FrontEndChnnal==$("#IPCFrontBound").val()*1) && i!=sel){
					ShowPaop($("#ipcan_info").text(),lg.get("IDS_IP_ADDED"));
					return; 
				}
			}
			if($("#IPCProtocol").val()*1 == 13){//sonix
				paramData.data.ip = ip.split("_CH")[0];
			}else{
				paramData.data.ip = ip;
			}
			paramData.data.netmask = $("#IPCNetmask").val();
			paramData.data.port = $("#IPCPort").val()*1;
			paramData.data.protocol = $("#IPCProtocol").val()*1;
			paramData.data.username = $("#IPCuser").val();
			paramData.data.password = $(".IPCpw").val();
			paramData.data.FrontEndChnnal = $("#IPCFrontBound").val()*1;
			
			RfParamCall(IpcRefreshCall, $("#ipcan_info").text(), "ipc_Set", 300, "Set", JSON.stringify(paramData));
		}else if(curMode == 1){//绿色添加图标
			var paramData = {};
			paramData.type = 0;
			paramData.data = [];
			var obj = {};
			obj.type = 1; //0:add,1:set,2:delete
			obj.boundchannel = sel;
			var temp = $("#IPCAddress").val();
			var reExp = /^0*(\d+\.)0*(\d+\.)0*(\d+\.)0*(\d+)$/; 
			var ip;
			var domainExp = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|(io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp))$/;
			var ipExp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
			if( temp.match(domainExp) == null ){
				ip = temp.replace(reExp, '$1$2$3$4');
				if(ip.match(ipExp) == null){		
					ShowPaop($("#ipcan_info").text(),lg.get("IDS_IPADD_ADDERR"));
					return; 
				}
			}
			else{
				ip = temp;
			}
			if($("#IPCProtocol").val()*1 == 13){//sonix
				ip += "_CH" + ($("#IPCFrontBound").val()*1+1);
			}
			for(var i=0; i<listData.length; i++){
				if( listData[i].enable && (ip == listData[i].ip && listData[i].FrontEndChnnal==$("#IPCFrontBound").val()*1) && i!=sel){
					ShowPaop($("#ipcan_info").text(),lg.get("IDS_IP_ADDED"));
					return; 
				}
			}
			if($("#IPCProtocol").val()*1 == 13){//sonix
				obj.ip = ip.split("_CH")[0];
			}else{
				obj.ip = ip;
			}
			obj.port = $("#IPCPort").val()*1;
			obj.protocol = $("#IPCProtocol").val()*1;
			obj.username = $("#IPCuser").val();
			obj.password = $(".IPCpw").val();
			obj.FrontEndChnnal = $("#IPCFrontBound").val()*1;
			
			paramData.data.push(obj);
			RfParamCall(IpcRefreshCall, $("#ipcan_info").text(), "ipc_Set", 300, "Set", JSON.stringify(paramData));
		}
		$("#list_table").css("display","block");
		$("#IPC_SET").css("display","none");
	});
	
	//手动添加、修改页面的Cancel按钮
	$("#IPCSet_Cancel").click(function(){
		$("#list_table").css("display","block");
		$("#IPC_SET").css("display","none");
	});
	//end
	
	function changeSetTableState(index){
		if(curMode == 0){//蓝色铅笔编辑图标
			$("#ipc_indexTable").css("display", "block");//Channel行
			//$("#IPCChannelIndex").val(listData[index].Channel);
			IPCChannelIndex.innerHTML=listData[index].channel;//Channel赋值
			
			$("#ipc_nameTable").css("display", "none");//Name行
			$("#IPCChlName").val(listData[index].devalias)//Name赋值
			
			$("#ipc_positionTable").css("display", "none");//Position行
			$("#IPCChlNamePosition").val(listData[index].aliaspos)//Position赋值
			
			if(listData[index].protocol == 13){//sonix
				var sonixch = listData[index].ip.split("_CH");
				$("#IPCAddress").val(sonixch[0]);
				$("#IPCFrontBound").val(sonixch[1]*1-1);
			}else{
				$("#IPCAddress").val(selectRows[i].ip);
				$("#IPCFrontBound").val(0);
			}
			//$("#IPCAddress").val(listData[index].ip);//IP Address赋值
			
			$("#ipc_netmaskTable").css("display", "block");//Subnet Mask行
			$("#IPCNetmask").val(listData[index].netmask);//Subnet Mask赋值
			
			$("#IPCPort").val(listData[index].port);//ClientPort赋值
			$("#IPCProtocol").val(listData[index].protocol);//Protocol赋值
			$("#IPCuser").val(listData[index].username);//UserName赋值
			$(".IPCpw").val(listData[index].password);//Password赋值
			//$("#IPCFrontBound").val(listData[index].FrontEndChnnal);
		}else if(curMode == 1){//绿色添加图标
			$("#ipc_indexTable").css("display", "none");//Channel行
			$("#ipc_nameTable").css("display", "none");//Name行
			$("#ipc_positionTable").css("display", "none");//Position行
			
			$("#IPCAddress").val("");//IP Address赋值
			$("#ipc_netmaskTable").css("display", "none");//Subnet Mask行
			$("#ipc_protocolTable").val(0);//Protocol行
			$("#IPCuser").val("");//UserName赋值
			$(".IPCpw").val("");//Password赋值
			$("#IPCFrontBound").val(0);
		}
	}
	
	function filterFun(data){
		alert(data);
		var gridData = [];
		gridData.Rows = data;
		gridData.Total = data.length;
		return gridData;
	}
	function PMCall(xml){
		for(var i = 0;i < 16; ++i){
			customProtocolType[i] = findChildNode(i+"Struct", "ProtocolName", xml);
		}
		//g_bClickDefBtn = false;
		initGrid();
	}
	function getCustomProtoName(){
		//g_bClickDefBtn = true;
		if(gDvr.customProtolFlag == 1){
			RfParamCall(PMCall,$("#ipcan_info").text(), "ProManage", 100, "Get");
		}else{
			initGrid();
		}
	}
	
	function initGrid(){
		$(function(){
			stateBtnCallBack = stateBtnClick;//State图标
			editBtnCallBack = editBtnClick;//蓝色铅笔编辑图标
			addBtnCallBack = addBtnClick;//绿色添加图标
			deleteBtnCallBack = deleteBtnClick;//红色删除图标
			
			if(lgCls.version == "URMET"){//显示IPC p2pid
				$("#listDataGrid").ligerGrid({
					enabledSort :false,
					checkbox: true,
					usePager:false,
					isScroll:true,
					async :false,
					resizable :false,
					alternatingRow :false,
					frozenCheckbox :false,
					frozen:false,
					width: '700px',
					height:'400px',
					columns: [
						{ display: lg.get('IDS_MOTION_CH'), name: 'channel', align: 'center', width: 60, frozen:false},//Channel
						{ display: '', isSort: false, width: 40, frozen:false, render:OperationRenderFun},//绿色添加、红色删除列
						{ display: '', isSort: false, width: 40, frozen:false, render:EditRenderFun},//蓝色铅笔编辑列
						{ display: lg.get('IDS_STATE'), name: 'state', minWidth: 60, algin:'center', frozen:false, render:StateRenderFun},//State列
						{ display: lg.get('IDS_IPADDRESS'), name: 'ip', minWidth: 120, render:IpRenderFun},//IP Adderss列
						{ display: lg.get('IDS_NET_MASK'), name: 'netmask', minWidth: 100, render:NetmaskRenderFun},//Subnet Mask列
						{ display: lg.get('IDS_FTP_PORT'), name: 'port', minWidth: 60, render:PortRenderFun},//Port列
						{ display: lg.get('IDS_MANUFACTURER'), name: 'manufacturer', minWidth: 120, render:ManufacturerRenderFun},//Manufacturer列
						{ display: lg.get('IDS_BASE_TYPE'), name: 'devtype', minWidth:120, render:DevTypeRenderFun},//Device type列
						{ display: lg.get('IDS_PTZ_PROTOCOL'), name: 'protocol', minWidth:60, render:ProtocolRenderFun},//Protocol列
						//{ display: lg.get('IDS_IPC_NUM'), name: 'chnmax', minWidth:120, render:CHNMAXRenderFun},
						{ display: lg.get('IDS_BASE_MAC'), name: 'mac', minWidth:160, render:MacRenderFun},//MAC Address列
						{ display: lg.get('IDS_BASE_SOFTVER'), name: 'softversion', minWidth:120, render:SoftVersionRenderFun},//Software Version列
						{ display: "P2PID", name: 'p2puid', minWidth:250, render:P2puidRenderFun}
					]	
				});
	
			}else{
				$("#listDataGrid").ligerGrid({
					enabledSort :false,
					checkbox: true,
					usePager:false,
					isScroll:true,
					async :false,
					resizable :false,
					alternatingRow :false,
					frozenCheckbox :false,
					frozen:false,
					width: '700px',
					height:'400px',
					columns: [
						{ display: lg.get('IDS_MOTION_CH'), name: 'channel', align: 'center', width: 60, frozen:false},//Channel
						{ display: '', isSort: false, width: 40, frozen:false, render:OperationRenderFun},//绿色添加、红色删除列
						{ display: '', isSort: false, width: 40, frozen:false, render:EditRenderFun},//蓝色铅笔编辑列
						{ display: lg.get('IDS_STATE'), name: 'state', minWidth: 60, algin:'center', frozen:false, render:StateRenderFun},//State列
						{ display: lg.get('IDS_IPADDRESS'), name: 'ip', minWidth: 100, render:IpRenderFun},//IP Adderss列
						{ display: lg.get('IDS_NET_MASK'), name: 'netmask', minWidth: 100, render:NetmaskRenderFun},//Subnet Mask列
						{ display: lg.get('IDS_FTP_PORT'), name: 'port', minWidth: 60, render:PortRenderFun},//Port列
						{ display: lg.get('IDS_MANUFACTURER'), name: 'manufacturer', minWidth: 120, render:ManufacturerRenderFun},//Manufacturer列
						{ display: lg.get('IDS_BASE_TYPE'), name: 'devtype', minWidth:120, render:DevTypeRenderFun},//Device type列
						{ display: lg.get('IDS_PTZ_PROTOCOL'), name: 'protocol', minWidth:100, render:ProtocolRenderFun},//Protocol列
						//{ display: lg.get('IDS_IPC_NUM'), name: 'chnmax', minWidth:120, render:CHNMAXRenderFun},
						{ display: lg.get('IDS_BASE_MAC'), name: 'mac', minWidth:160, render:MacRenderFun},//MAC Address列
						{ display: lg.get('IDS_BASE_SOFTVER'), name: 'softversion', minWidth:120, render:SoftVersionRenderFun}//Software Version列
					]	
				});
			}
			$("#searchDataGrid").ligerGrid({
				enabledSort :false,
				checkbox: true,
				usePager:false,
				isScroll:true,
				async :false,
				resizable :false,
				alternatingRow :false,
				frozenCheckbox :false,
				rownumbers : true,
				frozenRownumbers : false,
				frozen:false,
				width: '700px',
				height:'400px',
				columns: [
					{ display: lg.get('IDS_IPADDRESS'), name: 'ip', minWidth: 120, frozen:false},
					{ display: lg.get('IDS_FTP_PORT'), name: 'port', minWidth: 60, frozen:false},
					{ display: lg.get('IDS_MANUFACTURER'), name: 'manufacturer', minWidth: 120},
					{ display: lg.get('IDS_BASE_TYPE'), name: 'devtype', minWidth:120},
					{ display: lg.get('IDS_PTZ_PROTOCOL'), name: 'protocol', minWidth:100, render:ProtocolRenderFun},//Protocol列
					//{ display: lg.get('IDS_IPC_NUM'), name: 'chnmax', minWidth:120 },
					{ display: lg.get('IDS_BASE_MAC'), name: 'mac', minWidth:160 },
					{ display: lg.get('IDS_BASE_SOFTVER'), name: 'softversion', minWidth:120}
				]	
			});
			
			RfParamCall(listDataCall, $("#ipcan_info").text(), "ipc_Set", 100, "Get");//获取通道状态列表
		});
	}
	
	function IPCAutoAddCall(){
		$("#IPCRefresh").click();
	}
	IPCAutoAddCallBack = IPCAutoAddCall;
});

function IPCAutoAddCallBack(){
}