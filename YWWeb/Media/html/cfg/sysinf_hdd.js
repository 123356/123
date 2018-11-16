// JavaScript Document
$(document).ready(function(){
	var proPos = 0;
	var proHTML = "";
	if(g_bDefaultShow == true){
			$("#SysInfoHddDf").css("display","block");
	}
	for(var i=0; i<gDvr.nChannel; i++)
		$("#ipc_sel").append('<option class="option" value="'+(1<<i)+'">'+gDvr.chname[i]+'</option>');
		
	CreateProcessTool();	
	
	if(gDvr.DevType == 3){
		$("#disk_format").css("display","none");
		if(lgCls.version=="RCI"){
			$("#disk_format").css("display","block");
		}
		//$("#type_table,#IPC_Table").css("display","block");
	}else if(gDvr.DevType == 4){
		$("#NVR_Table").css("display","block");
	}else{
		if(!bHuaweiPlat){
			$("#disk_format").css("display","none");
		}
		$("#NVR_Table").css("display","block");
	}
	
	if(bHuaweiPlat)
		$("#RecordStatue_show").css("display","block");
	
	if(gDvr.eSATAEnabled == 1){//暂时打开ESata
		$("#ESataRec_div").css("display","block");
	}
	
	switch(lgCls.version){
		/*case "URMET":*/
		case "ELKRON":{
			$("#HddOverWrite").empty();
			for(var i=0; i<8; i++){
				$("#HddOverWrite").append('<option class="option" value="'+i+'">'+'</option>');
			}
			document.getElementById("HddOverWrite").options[0].innerHTML=lg.get("IDS_OVERWRITE_CLOSE");//Disable
			document.getElementById("HddOverWrite").options[1].innerHTML=lg.get("IDS_OVERWRITE_AUTO");//Auto
			document.getElementById("HddOverWrite").options[2].innerHTML=lg.get("IDS_OVERWRITE_1DAY");//1 Day
			document.getElementById("HddOverWrite").options[3].innerHTML=lg.get("IDS_OVERWRITE_2DAYS");//2 Day
			document.getElementById("HddOverWrite").options[4].innerHTML=lg.get("IDS_OVERWRITE_3DAYS");//7 Days
			document.getElementById("HddOverWrite").options[5].innerHTML=lg.get("IDS_OVERWRITE_7DAYS");//30 Days
			document.getElementById("HddOverWrite").options[6].innerHTML=lg.get("IDS_OVERWRITE_30DAYS");//90 Days
			document.getElementById("HddOverWrite").options[7].innerHTML=lg.get("IDS_WEEKENDMODE");//周末覆写
			break;
		}
		default:{
			$("#HddOverWrite").empty();
			for(var i=0; i<8; i++){
				$("#HddOverWrite").append('<option class="option" value="'+i+'">'+'</option>');
			}
			if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
				document.getElementById("HddOverWrite").options[0].innerHTML=lg.get("IDS_OTHER_OFF");//Disable
			}else{
				document.getElementById("HddOverWrite").options[0].innerHTML=lg.get("IDS_OVERWRITE_CLOSE");//Disable
			}
			document.getElementById("HddOverWrite").options[1].innerHTML=lg.get("IDS_OVERWRITE_AUTO");//Auto
			document.getElementById("HddOverWrite").options[2].innerHTML=lg.get("IDS_OVERWRITE_1HOUR");//1 Hour
			document.getElementById("HddOverWrite").options[3].innerHTML=lg.get("IDS_OVERWRITE_3HOURS");//3 Hours
			document.getElementById("HddOverWrite").options[4].innerHTML=lg.get("IDS_OVERWRITE_1DAY");//1 Day
			document.getElementById("HddOverWrite").options[5].innerHTML=lg.get("IDS_OVERWRITE_7DAYS");//7 Days
			document.getElementById("HddOverWrite").options[6].innerHTML=lg.get("IDS_OVERWRITE_30DAYS");//30 Days
			document.getElementById("HddOverWrite").options[7].innerHTML=lg.get("IDS_OVERWRITE_90DAYS");//90 Days
			break;
		}
	}
	
	if(gDvr.FileSystemFlag == 1 /*&& lgCls.version != "URMET" */&& lgCls.version != "ELKRON"){
		$("#HddOverWrite").empty();
		for(var i=0; i<8; i++){
			$("#HddOverWrite").append('<option class="option" value="'+i+'">'+'</option>');
		}
		document.getElementById("HddOverWrite").options[0].innerHTML=lg.get("IDS_OVERWRITE_CLOSE");//Disable
		document.getElementById("HddOverWrite").options[1].innerHTML=lg.get("IDS_OVERWRITE_AUTO");//Auto
		document.getElementById("HddOverWrite").options[2].innerHTML=lg.get("IDS_OVERWRITE_1DAY");//1 Day
		document.getElementById("HddOverWrite").options[3].innerHTML=lg.get("IDS_OVERWRITE_3DAYS");//3 Day
		document.getElementById("HddOverWrite").options[4].innerHTML=lg.get("IDS_OVERWRITE_7DAYS");//7 Days
		document.getElementById("HddOverWrite").options[5].innerHTML=lg.get("IDS_OVERWRITE_14DAYS");//14 Days
		document.getElementById("HddOverWrite").options[6].innerHTML=lg.get("IDS_OVERWRITE_30DAYS");//30 Days
		document.getElementById("HddOverWrite").options[7].innerHTML=lg.get("IDS_OVERWRITE_90DAYS");//90 Days
	}
	
	if(gDvr.hybirdDVRFlag == 1){
		if(lgCls.version == "URMET"){
			$("#HddOverWrite").empty();
			for(var i=0; i<8; i++){
				$("#HddOverWrite").append('<option class="option" value="'+i+'">'+'</option>');
			}
			document.getElementById("HddOverWrite").options[0].innerHTML=lg.get("IDS_OFF");				//OFF
			document.getElementById("HddOverWrite").options[1].innerHTML=lg.get("IDS_OVERWRITE_AUTO");	//Auto
			document.getElementById("HddOverWrite").options[2].innerHTML=lg.get("IDS_OVERWRITE_1DAY");	//1 Day
			document.getElementById("HddOverWrite").options[3].innerHTML=lg.get("IDS_OVERWRITE_2DAYS");	//2 Day
			document.getElementById("HddOverWrite").options[4].innerHTML=lg.get("IDS_OVERWRITE_3DAYS");	//3 Days
			document.getElementById("HddOverWrite").options[5].innerHTML=lg.get("IDS_OVERWRITE_7DAYS");//7 Days
			document.getElementById("HddOverWrite").options[6].innerHTML=lg.get("IDS_OVERWRITE_30DAYS");//30 Days
			document.getElementById("HddOverWrite").options[7].innerHTML=lg.get("IDS_WEEKENDMODE");//周末覆写
		}
	}
	
	RfParamCall(Call,  $("#hdd_message").text(), "SysHdd", 100, "Get");	//初始时获取页面数据
	// var xml = gDvr.obj.GetAndSetNetParam("SysHdd",0,100,"aa");	
	// Call(xml);
	$("#SysInfoHddRf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call,  $("#hdd_message").text(), "SysHdd", 100, "Get");	//刷新页面数据
		//  var xml = gDvr.obj.GetAndSetNetParam("SysHdd",0,100,"aa");
	});
	
	$("#SysInfoHddDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call,  $("#hdd_message").text(), "SysHdd", 850, "Get");
		 // Call(xml);
	});
	
	$("#SysInfoHddSV").click(function(){
		var xml = "<a>";
		xml += ("<OverWrite>" + ($("#HddOverWrite").val()) + "</OverWrite>");
		xml += ("<ESataRecEnable>" + ($("#ESataRecEnable").val()) + "</ESataRecEnable>");
		xml += "</a>";
		RfParamCall(Call,  $("#hdd_message").text(), "SysHdd", 300, "Set", xml);	//保存
		//setTimeout(function(){g_bClickDefBtn = false;
		//RfParamCall(Call,  $("#hdd_message").text(), "SysHdd", 100, "Get");	},2000);
	});
	


	function Call(xml){
			//console.log("hdd:" + xml);
			var n = xml.indexOf(":");
			var length = xml.substring(0, n);	
			xml = xml.substring(n+1, xml.length);
			var valideNum = 0;
			$("#HddOverWrite").val(findNode("OverWrite", xml));
			var strRS;
			if(findNode("RecordState",xml)*1==1){
				strRS = lg.get("IDS_HDDRECSTAUSING");
			}else{	
				strRS = lg.get("IDS_HDDRECSTANOTUSING");
			}
			$("#HddRecordState").val(strRS);
			var ESataenable = findNode("ESataRecEnable", xml)*1;
			if(ESataenable != -1){
				$("#ESataRecEnable").val(ESataenable);
			}
			var HTML = "";
			var str = "";
			$("#nvr_sel").empty();
			for (var i=0; i<length; i++){
				str = findNode((i)+"list", xml).toUpperCase();
				if (findNode("HDDSTATE", str) == "0") continue;
				if(gDvr.eSATAEnabled == 0){//兼容以前的
					valideNum++;
					$("#nvr_sel").append('<option class="option" value="'+(1<<i)+'">'+(i+1)+'</option>');
					HTML += '<div class="table"><div class="table_range_hdd_1" >'+(i+1)+'</div><div class="table_range_hdd_2">'+GetString(findNode("HDDSTATE", str))+'</div><div class="table_range_hdd_3">'+findNode("FREESIZE", str)+' / '+findNode("TOTALSIZE", str)+'</div><div class="table_range_hdd_4">'+findNode("TIME", str)+lg.get("IDS_HOUR")+'</div></div>';
				}else{
					var hddno = findNode("HDDNO", str)*1;
					valideNum++;
					if(findNode("HDDTYPE", str) == "0"){//SATA
						HTML += '<div class="table"><div class="table_range_hdd_1" >'+(hddno+1)+'</div><div class="table_range_hdd_2">'+GetString(findNode("HDDSTATE", str))+'</div><div class="table_range_hdd_3">'+findNode("FREESIZE", str)+' / '+findNode("TOTALSIZE", str)+'</div><div class="table_range_hdd_4">'+findNode("TIME", str)+lg.get("IDS_HOUR")+'</div></div>';
					}else{
						HTML += '<div class="table" id="ESHdd_'+hddno+'" style="display:none;"><div class="table_range_hdd_1" >'+'ES'+(hddno+1)+'</div><div class="table_range_hdd_2">'+GetString(findNode("HDDSTATE", str))+'</div><div class="table_range_hdd_3">'+findNode("FREESIZE", str)+' / '+findNode("TOTALSIZE", str)+'</div><div class="table_range_hdd_4">'+findNode("TIME", str)+lg.get("IDS_HOUR")+'</div></div>';
					}
				}
			}
			$("#HDDlist").prop("innerHTML", HTML);
			$("#ESataRecEnable").change();
			if($("#HDDlist").prop("innerHTML")!=""){
				document.getElementById("HDDlist").style.display="block";
			}
			if(valideNum == 0){
				$("#nvr_r").css("display","none");
				$("#nvr_nodisk").css("display","block");
			}else{
				/*$("#nvr_sel").empty();
				for(var i=0; i<valideNum; i++){
					$("#nvr_sel").append('<option class="option" value="'+(1<<i)+'">'+(i+1)+'</option>');
				}*/
				$("#nvr_r").css("display","block");
				$("#nvr_nodisk").css("display","none");
			}
	}
	
	function GetString(index)
	{
		var str = "";
		switch(index)
		{
			case "0":
			str = lg.get("IDS_HDDS_NONE");
			break;
			case "1":
			str = lg.get("IDS_HDDS_UNFORMAT");
			break;
			case "2":
			str = lg.get("IDS_HDDS_OK");
			break;
			case "3":
			str = lg.get("IDS_HDDS_FULL");
			break;
			case "5":
			str = lg.get("IDS_HDDS_BAD");
			break;
			case "4":
			str = lg.get("IDS_HDDS_RONLR");
			break;
			//case "5":
			//str = lg.get("IDS_HDDS_BACKUP");
			//case "6":
			//str = lg.get("IDS_HDDS_INVALID");
			//break; 
			default:
			str = lg.get("IDS_HDDS_NONE");
			break;
		}
		return str;
	}
	function CreateProcessTool(){
		for(var iPro=0; iPro<33; iPro++){
			proHTML += '<div class="format_pro" id="pro_'+iPro+'"></div>';	
		}
		proHTML += '<div class="format_pro" id="pro_'+iPro+'" style="border-right-color:#fff; border-right-width:1px; border-right-style:solid;"></div>';
		proHTML += '<div id="formatTip" style="float:left; margin-left:10px; font-size:18px;" ></div>';
		$("#FormatStatue").prop("innerHTML",proHTML);
		$("#pro_0").css("margin-left","20px");
	}
	
	$("#IPCbtn,#NVRbtn").click(function(){
		proPos = 0;
		$("[id^='pro_']").css("background","#666");
		$("#formatTip").prop("innerText","");
		var chbitmap = 0;
		var hddbitmap = 0;
		if ($(this).attr("id") == "IPCbtn"){
			chbitmap = $("#ipc_sel").val();
			hddbitmap = 1;
		}else{
			hddbitmap = $("#nvr_sel").val();
		}
		var xml = "<a>";
		xml += ("<Key>309</Key>");
		xml += ("<ChBitmap>"+chbitmap+"</ChBitmap>");
		xml += ("<HddBitmap>"+hddbitmap+"</HddBitmap>");
		xml += "</a>";
		
	   $(this).prop("disabled",true);
	   $("#Format_IPC, #Format_NVR").prop("disabled",true);
       var hddformat_ret = gDvr.RemoteTest(xml);
		if(-1 == hddformat_ret){	
			ShowPaop($("#ddns_config").text(),lg.get("IDS_SEND_FAILED"));
			$("#IPCbtn,#NVRbtn").prop("disabled",false);
			$("#Format_IPC, #Format_NVR").prop("disabled",false);
		}else if(-2 == hddformat_ret){
			ShowPaop($("#ddns_config").text(),lg.get("IDS_PLAYBACK_RIGHT1"));
			$("#IPCbtn,#NVRbtn").prop("disabled",false);
			$("#Format_IPC, #Format_NVR").prop("disabled",false);
		}
	});
	
	function HddFormat(Statue,Process)
	{
		if(Statue == 0){
			$("[id^='pro_']").css("background","#f00");
			$("#formatTip").prop("innerText","100%");
			ShowPaop($("#hdd_message").text(),lg.get("IDS_HDDFORMAT_SUC"));
			$("#IPCbtn,#NVRbtn").prop("disabled",false);
			$("#Format_IPC, #Format_NVR").prop("disabled",false);
		}else if(Statue == 1){
			for(var i=proPos; i<Process/3; i++){
				var str = "#pro_" + i;
				$(str).css("background","#f00");
			}
			$("#formatTip").prop("innerText",Process+"%");
			proPos = Process/3;
		}else if(Statue == 2){
			ShowPaop($("#hdd_message").text(),lg.get("IDS_HDDFORMAT_FAL"));			
			$("#IPCbtn,#NVRbtn").prop("disabled",false);
			$("#Format_IPC, #Format_NVR").prop("disabled",false);
		}	
	};
	
	$("#Format_IPC, #Format_NVR").click(function(){
		if ($(this).attr("id") == "Format_IPC"){
			$("#IPC_Table").css("display", "block");
			$("#NVR_Table").css("display", "none");
		}else{
			$("#IPC_Table").css("display", "block");
			$("#NVR_Table").css("display", "block");
		}
	})
	
	HddFormatRet = HddFormat;
	
	$("#ESataRecEnable").change(function(){
		if($("#ESataRecEnable").val()*1){
			$("div[id^='ESHdd_']").each(function(){
				$(this).css("display","block");
			});
		}else{
			$("div[id^='ESHdd_']").each(function(){
				$(this).css("display","none");
			});
		}
	});
});

function HddFormatRet(Statue,Process){};