// JavaScript Document
$(document).ready(function(){
	
	if(g_bDefaultShow == true){
			$("#IODf").css("display","block");
	}
	
	if(gDvr.nChannel==1)
	{
		$("#IO_CHN_TABLE").css("display","none");
	}
	if(gDvr.nMainType == 0x52530101 && gDvr.nSubType == 0x10100){
		$("#io_buzzerTime").css("display","none");
	}
	if(gDvr.nAlarmOut == 4){
		$("#IoAlarmOut").css("display","none");
	}
	switch(lgCls.version){
		/*case "URMET":*/
		case "ELKRON":{
			document.getElementById("IoRecordDelayTime").options[0].innerHTML="10"+lg.get("IDS_SECOND");//10秒
			document.getElementById("IoRecordDelayTime").options[1].innerHTML="30"+lg.get("IDS_SECOND");//30秒
			document.getElementById("IoRecordDelayTime").options[2].innerHTML="1"+lg.get("IDS_MINUTE");//1分钟
			document.getElementById("IoRecordDelayTime").options[3].innerHTML="2"+lg.get("IDS_MINUTE");//2分钟
			$("#IoRecordDelayTime").append('<option class="option" value="4">5'+lg.get("IDS_MINUTE")+'</option>');//5分钟
			$("#IOAlarmOutTime").empty();
			$("#IOAlarmOutTime").append('<option class="option" value="0">10'+lg.get("IDS_SECOND")+'</option>');
			$("#IOAlarmOutTime").append('<option class="option" value="4">30'+lg.get("IDS_SECOND")+'</option>');
			$("#IOAlarmOutTime").append('<option class="option" value="5">1'+lg.get("IDS_MINUTE")+'</option>');
			$("#IOAlarmOutTime").append('<option class="option" value="6">2'+lg.get("IDS_MINUTE")+'</option>');
			$("#urmet_IOFS").css("display","block");
			break;
		}
		/*
		case "KGUARD":{
			$("#IoShowMessage").prop("disabled",true);
			$("#default_IOFullScreen").css("display","block");
			break;
		}
		*/
		default:{
			document.getElementById("IoRecordDelayTime").options[0].innerHTML="30"+lg.get("IDS_SECOND");//30秒
			document.getElementById("IoRecordDelayTime").options[1].innerHTML="1"+lg.get("IDS_MINUTE");//1分钟
			document.getElementById("IoRecordDelayTime").options[2].innerHTML="2"+lg.get("IDS_MINUTE");//2分钟
			document.getElementById("IoRecordDelayTime").options[3].innerHTML="5"+lg.get("IDS_MINUTE");//5分钟
			$("#default_IOFullScreen").css("display","block");
			break;
		}
	}
	
	if(gDvr.hybirdDVRFlag == 1){
		if(lgCls.version == "URMET"){
			$("#IOAlarmOutTime").empty();
			$("#IOAlarmOutTime").append('<option class="option" value="0">10'+lg.get("IDS_SECOND")+'</option>');//10s
			$("#IOAlarmOutTime").append('<option class="option" value="1">30'+lg.get("IDS_SECOND")+'</option>');//30s
			$("#IOAlarmOutTime").append('<option class="option" value="2">1'+lg.get("IDS_MINUTE")+'</option>');	//1min
			$("#IOAlarmOutTime").append('<option class="option" value="3">2'+lg.get("IDS_MINUTE")+'</option>');	//2min
			$("#IOAlarmOutTime").append('<option class="option" value="4">5'+lg.get("IDS_MINUTE")+'</option>');	//5min
			
			$("#IoRecordDelayTime").empty();
			$("#IoRecordDelayTime").append('<option class="option" value="0">10'+lg.get("IDS_SECOND")+'</option>');//10s
			$("#IoRecordDelayTime").append('<option class="option" value="1">30'+lg.get("IDS_SECOND")+'</option>');//30s
			$("#IoRecordDelayTime").append('<option class="option" value="2">1'+lg.get("IDS_MINUTE")+'</option>');	//1min
			$("#IoRecordDelayTime").append('<option class="option" value="3">2'+lg.get("IDS_MINUTE")+'</option>');	//2min
			$("#IoRecordDelayTime").append('<option class="option" value="4">5'+lg.get("IDS_MINUTE")+'</option>');	//5min
		}
	}
	
	var selEmail = 1;
	var color = "rgb(0, 102, 0)";
	var str_Alarmtype = "AlarmIO";
	/*
	if(gDvr.DevType == 3)
	{
		str_Alarmtype = "IpcAlarm";
		if(lgCls.version == "KGUARD" || lgCls.version == "NORMAL"){
			$("#TABLE_IOALARMTYPE").css("display","none");
		}else{
			$("#TABLE_IOALARMTYPE").css("display","block");
		}
	}
	*/
	
	//显示复制通道
	$("#IOCP").click(function(){
		$("#iock").prop("checked",false);
		copyTD("#ioCopyTD","io_ch","io_TDNum", gDvr.nAlarmIn);
	})
	
	//全选
	$("#iock").click(function(){
		$("input[id^='io_ch']").prop("checked",$(this).prop("checked"));
	})	
	//初始操作
	IO_warn.sel=0;
	//<!-- wh全选切换-->
	$("input[id='all_checked']").click(function(){
		if($(this).prop("checked")){
			for(var j=1;j<=gDvr.nChannel;j++){
				$(".IORecordCh"+j).prop("checked",true);
			}
		}else{
			for(var j=1;j<=gDvr.nChannel;j++)
				$(".IORecordCh"+j).removeAttr("checked");
		}
		
		ioCkAll_Check();
	});
	
	$("input[class^=IORecordCh]").click(function(){
		var clsName = this.className;
		//alert(clsName);
		if($(this).prop("checked")){
			$("."+clsName).prop("checked",true);
		}else{
			$("."+clsName).prop("checked",false);
		}
		
		ioCkAll_Check();
	});
	
	$(".IOCh_MN_CkAll").click(function(){
		if($(this).prop("checked")){
			for(var j=1;j<=gDvr.AnalogChNum;j++){
				$(".IORecordCh"+j).prop("checked",true);
			}
		}else{
			for(var j=1;j<=gDvr.AnalogChNum;j++){
				$(".IORecordCh"+j).prop("checked",false);
			}
		}
		
		ioCkAll_Check();
	});
	
	$(".IOCh_IP_CkAll").click(function(){
		if($(this).prop("checked")){
			for(var j=(gDvr.AnalogChNum+1);j<=gDvr.nChannel;j++){
				$(".IORecordCh"+j).prop("checked",true);
			}
		}else{
			for(var j=(gDvr.AnalogChNum+1);j<=gDvr.nChannel;j++){
				$(".IORecordCh"+j).prop("checked",false);
			}
		}
		
		ioCkAll_Check();
	});
	
	//<!-- wh全选切换  end-->
	$(function(){
		//隐藏所有的 checkbox
		$("input[class^='IORecordCh']").css("display", "none");
		
		var tmp;
		if(gDvr.hybirdDVRFlag==1){
			tmp = 'IO-';
		}else{
			tmp = lg.get("IDS_CH");
		}
		
		for (var i=0; i<gDvr.nAlarmIn; i++){
			$("#IOChid").append('<option class="option" value="'+i+'">'+ tmp +(i+1)+'</option>');
			
		}
		if(gDvr.nChannel<=8){
			$("#IO_rec_table2").css("display","none");
			$("#IO_rec_table3").css("display","none");
			$("#IO_rec_table4").css("display","none");
		}else if(gDvr.nChannel<=10){
			if(gDvr.hybirdDVRFlag==1){//混合DVR
				$("#IO_rec_table1").css("display","none");
				$("#IO_rec_table2").css("display","none");
				$("#IO_rec_table3").css("display","none");
				$("#IO_rec_table4").css("display","none");
				
				$("#IOrec_H12_1").css("display","block");
				$("#IOrec_H12_2").css("display","block");
				$("#idIO_div7,#idIO_div8").css("display","none");
			}
		}else if(gDvr.nChannel<=12){
			$("#IO_rec_table1").css("display","none");
			$("#IO_rec_table2").css("display","none");
			$("#IO_rec_table3").css("display","none");
			$("#IO_rec_table4").css("display","none");
			$("#IOrec_H12_1").css("display","block");
			$("#IOrec_H12_2").css("display","block");
		}else if(gDvr.nChannel<=16){
			$("#IO_rec_table3").css("display","none");
			$("#IO_rec_table4").css("display","none");
		}else if(gDvr.nChannel<=20){
			$("#IO_rec_table1").css("display","none");
			$("#IO_rec_table2").css("display","none");
			$("#IO_rec_table3").css("display","none");
			$("#IO_rec_table4").css("display","none");
			
			if(gDvr.hybirdDVRFlag==1){//混合DVR
				$("#IOrec_H24_1").css("display","block");
				$("#IOrec_H24_2").css("display","block");
				$("#alio_21,#alio_22,#alio_23,#alio_24").css("display","none");
			}
		}else if(gDvr.nChannel<=24){
			$("#IO_rec_table1").css("display","none");
			$("#IO_rec_table2").css("display","none");
			$("#IO_rec_table3").css("display","none");
			$("#IO_rec_table4").css("display","none");
			
			if(gDvr.hybirdDVRFlag==1){//混合DVR
				if(gDvr.AnalogChNum==8){//8+16
					$("#IOrec_H24_1").css("display","block");
					$("#IOrec_H24_2").css("display","block");
				}else if(gDvr.AnalogChNum==16){//16+8 
					$("#IOrec_H168_1").css("display","block");
					$("#IOrec_H168_2").css("display","block");
				}
			}
		}
		
		//显示的 checkbox
		for(var i=0; i<gDvr.nChannel; ++i){ 
			$(".IORecordCh"+(i+1)).css("display", "");//功能是block，但是不能改成block?
		}
		
		for(var i=gDvr.nChannel;i<32;i++){  
			$("#IORecord_"+(i*1+1)).css("display", "none");
		}
		
		if(gDvr.nAlarmOut > 1)
		{
			$("#IOAlarmChannelDiv").css("display","block");
		}else {
			$("#IOAlarmChannelDiv").css("display","none");
		}
		if ($.browser.msie && $.browser.version.indexOf("9") == -1) color = color.replace(/\s/g, "");
		$("#IOAlarmChannelDiv").divBox({number:gDvr.nAlarmOut,bkColor:color});
		
		RfParamCall(Call,$("#IO_warn").text(), str_Alarmtype, 100, "Get");	//初始时获取页面数据
		/*/
		if(gDvr.DevType == 3)
		{
		  RfParamCall(Call, $("#IO_warn").text(), "AlarmIO", 100, "Get");	//刷新页面数据
		}
		*/
		IO_warn.sel = 0;
		RfParamCall(Call, $("#IO_warn").text(), str_Alarmtype, IO_warn.sel, "Get");
	});
	
	
	function Call(xml){
			$("#IoAlarmSet").val(findNode("IoAlarmSet", xml));
			$("#IoBuzzerMooTime").val(findNode("BuzzerMooTime", xml));
			$("#IoShowMessage").prop("checked", findNode("ShowMessage", xml)*1);
			$("#IoRecordDelayTime").val(findNode("RecordDelayTime", xml));
			$("#IoSendEmail").prop("checked", findNode("SendEmail", xml)*1);
			$("#IoRec_Record").prop("checked", findNode("Record", xml)*1);
			$("#IOAlarmOutTime").prop("value",findNode("AlarmOutTime", xml)*1);
			$("#IoAlarmOut").prop("checked", (findNode("AlarmOut", xml)*1));
			
			switch(lgCls.version){
				/*case "URMET":*/
				case "ELKRON":{
					$("#urmet_IoFullScreen").val(findNode("FullScreen",xml));
					break;
				}
				default:{
					$("#IoFullScreen").prop("checked", findNode("FullScreen", xml)*1);
					break;
				}
			}
			
			var IORecordCh = findNode("RecordChannel", xml);
			for (var i=0; i<gDvr.nChannel; i++){
				$(".IORecordCh"+(i+1)).prop("checked", (IORecordCh>>i)&0x01);
			}	
			
			if(gDvr.nAlarmOut>1){
				str =findNode("AlarmOutManager", xml);	
				str = str.toLowerCase();
				str = "<a>" + str.split("item").join("p") + "</a>";
				
				var temArray = new Array();
				$(str).find("p").each(function(i){
					temArray[i] = $(this).text();
				});	
				
				$("#IOAlarmChannelDiv > div").css("background-color", "transparent");	   
				$("#IOAlarmChannelDiv > div").each(function(i){
					if (temArray[i] == 1){
						$(this).css("background-color", color)
					}
				});
			}
			
			DivBox("#IoRec_Record", "#IoDivBoxRecord");
			DivBox("#IoAlarmOut", "#IoDivBoxAlarmOut");
			
			//界面处理
			ioCkAll_Check();
	}
	
	//写一个函数  处理联动通道	/*Record Channel, 触发通道录像，按位记录*/	UINT RecordChannel;
	$("#IOChid").change(function(){
		CHOSDSaveSel();
		IO_warn.sel = $("#IOChid").val();
		RfParamCall(Call, $("#IO_warn").text(), str_Alarmtype, IO_warn.sel, "Get");
	});
	
	$("#IOAlarm_Type").change(function(){
		CHOSDSaveSel();
		var type = $("#IOAlarm_Type").val();
		if(type == 1) //板载
		{
			str_Alarmtype = "AlarmIO";
			$("#ai_send_email").prop("disabled",true);
			$("#IoSendEmail").prop("disabled",true);		
		}
		else
		{
	       str_Alarmtype = "IpcAlarm";
		   $("#ai_send_email").prop("disabled",false);
		   $("#IoSendEmail").prop("disabled",false);
		}
		
		
		IO_warn.sel = $("#IOChid").val();
		RfParamCall(Call, $("#IO_warn").text(), str_Alarmtype, IO_warn.sel, "Get");
	});
	
	function CHOSDSaveSel(){
		var xml = "<a>";
		xml += ("<IoAlarmSet>" + ($("#IoAlarmSet").val()) + "</IoAlarmSet>");
		xml += ("<AlarmSet>" + ($("#IoAlarmSet").val()) + "</AlarmSet>");
		xml += ("<chid>" + IO_warn.sel + "</chid>");
		xml += ("<AlarmOutTime>" + $("#IOAlarmOutTime").val() + "</AlarmOutTime>");
		xml += ("<BuzzerMooTime>" + $("#IoBuzzerMooTime").val() + "</BuzzerMooTime>");
		xml += ("<ShowMessage>" + ($("#IoShowMessage").prop("checked")*1) + "</ShowMessage>");
		xml += ("<SendEmail>" + $("#IoSendEmail").prop("checked")*1 + "</SendEmail>");
		xml += ("<Record>" + $("#IoRec_Record").prop("checked")*1 + "</Record>");
		xml += ("<RecordDelayTime>" + $("#IoRecordDelayTime").val() + "</RecordDelayTime>");
		xml += ("<AlarmOut>" +  $("#IoAlarmOut").prop("checked")*1  + "</AlarmOut>");
		if(gDvr.DevType == 3)
			{
				if(str_Alarmtype == "AlarmIO")
				{
				  xml += ("<AlarmIO>" +  1 + "</AlarmIO>");
				}
				/*
				else 
				{
				   xml += ("<AlarmIO>" +  0 + "</AlarmIO>");
				}
				*/
			}
		switch(lgCls.version){
				/*case "URMET":*/
				case "ELKRON":{
					xml += ("<FullScreen>" +  $("#urmet_IoFullScreen").val()  + "</FullScreen>");
					break;
				}
				default:{
					xml += ("<FullScreen>" +  $("#IoFullScreen").prop("checked")*1  + "</FullScreen>");
					break;
				}
		}
		
		var IORecordCh = 0;
		
		for(var i=0; i<gDvr.nChannel; i++){
			IORecordCh|= (($(".IORecordCh"+(i+1)).prop("checked")*1)<<i);
		}
		
		xml += ("<RecordChannel>" + IORecordCh + "</RecordChannel>");

		if(gDvr.nAlarmOut>1){ 
		   xml += "<AlarmOutManager>";  
		   $("#IOAlarmChannelDiv > div").each(function(i){
				var bCheckd = ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, ""))?1:0;
				xml += "<item>"+bCheckd+"</item>";	
			});
			xml += "</AlarmOutManager>";
		}else{
			xml += "<AlarmOutManager>";
			$("#IOAlarmChannelDiv > div").each(function(i){
				var bCheckd;
				if(i==0)
		   			bCheckd = $("#IoAlarmOut").prop("checked")*1;
				else
					bCheckd = 0;
		   		xml += "<item>"+bCheckd+"</item>";
			});
			xml += "</AlarmOutManager>";
		}
		
		xml += "</a>";	
		RfParamCall(Call, $("#IO_warn").text(), str_Alarmtype, IO_warn.sel, "Set", xml);
		
	}
	
	$("#IORf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#IO_warn").text(), str_Alarmtype, 100, "Get");	//刷新页面数据
		RfParamCall(Call,$("#IO_warn").text(), str_Alarmtype, IO_warn.sel, "Get");	//刷新页面数据
	});
	
	$("#IODf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#IO_warn").text(), str_Alarmtype, 850, "Get");
		RfParamCall(Call,$("#IO_warn").text(), str_Alarmtype, IO_warn.sel, "Get");
	});
	
	$("#IOSave").click(function(){
		CHOSDSaveSel();
		RfParamCall(Call, $("#IO_warn").text(), str_Alarmtype, 200, "Set");
	});
	
	//界面响应
	$("#IoRec_Record").click(function(){
		DivBox("#IoRec_Record", "#IoDivBoxRecord");
	});
	
	/*$("#IoAlarmOut").click(function(){
		DivBox("#IoAlarmOut", "#IoDivBoxAlarmOut");
	});
	*/
	
	
	
	
	var ioCopyXml="";
	$("#ioOk").click(function(){
		$("#ioCopyTD").css("display","none");
		var spTdValue="";
		$.each($("input[id^='io_ch']"),function(){
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
		
			ioCopyXml = "<a>";
			ioCopyXml += ("<CopyChid>" + copychid + "</CopyChid>");	
			ioCopyXml += ("<IoAlarmSet>" + ($("#IoAlarmSet").val()) + "</IoAlarmSet>");
			ioCopyXml += ("<AlarmSet>" + ($("#IoAlarmSet").val()) + "</AlarmSet>");
			ioCopyXml += ("<chid>" + IO_warn.sel + "</chid>");
			ioCopyXml += ("<AlarmOutTime>" + $("#IOAlarmOutTime").val() + "</AlarmOutTime>");
			ioCopyXml += ("<BuzzerMooTime>" + $("#IoBuzzerMooTime").val() + "</BuzzerMooTime>");
			ioCopyXml += ("<ShowMessage>" + ($("#IoShowMessage").prop("checked")*1) + "</ShowMessage>");
			ioCopyXml += ("<SendEmail>" + $("#IoSendEmail").prop("checked")*1 + "</SendEmail>");
			ioCopyXml += ("<Record>" + $("#IoRec_Record").prop("checked")*1 + "</Record>");
			ioCopyXml += ("<RecordDelayTime>" + $("#IoRecordDelayTime").val() + "</RecordDelayTime>");
			ioCopyXml += ("<AlarmOut>" +  $("#IoAlarmOut").prop("checked")*1  + "</AlarmOut>");
			switch(lgCls.version){
				/*case "URMET":*/
				case "ELKRON":{
					ioCopyXml += ("<FullScreen>" +  $("#urmet_IoFullScreen").val()  + "</FullScreen>");
					break;
				}
				default:{
					ioCopyXml += ("<FullScreen>" +  $("#IoFullScreen").prop("checked")*1  + "</FullScreen>");
					break;
				}
			}
	
			var IORecordCh = 0;
			for(var i=0; i<gDvr.nChannel; i++){
				IORecordCh|= (($(".IORecordCh"+(i+1)).prop("checked")*1)<<i);
			}
			ioCopyXml += ("<RecordChannel>" + IORecordCh + "</RecordChannel>");
		
			if(gDvr.nAlarmOut>1){ 
		  		 ioCopyXml += "<AlarmOutManager>";  
		  		 $("#IOAlarmChannelDiv > div").each(function(i){
					 var bCheckd = ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, ""))?1:0;
					 ioCopyXml += "<item>"+bCheckd+"</item>";	
				});
				ioCopyXml += "</AlarmOutManager>";
			}else{
				ioCopyXml += "<AlarmOutManager>";
				$("#IOAlarmChannelDiv > div").each(function(i){
					var bCheckd;
					if(i==0)
						bCheckd = $("#IoAlarmOut").prop("checked")*1;
					else
						bCheckd = 0;
					ioCopyXml += "<item>"+bCheckd+"</item>";
				});
				ioCopyXml += "</AlarmOutManager>";
			}
		
		ioCopyXml += "</a>";
		RfParamCall(Call, $("#IO_warn").text(), str_Alarmtype, 400, "Set",ioCopyXml);
		}
	})
	
	function ioCkAll_Check(){
		if(gDvr.hybirdDVRFlag==1){
			var mnCk = true;
			var ipCk = true;
		
			for(var i=1; i<=gDvr.AnalogChNum; i++){//模拟通道数
				if( $(".IORecordCh"+i).prop("checked") ){
					//
				}else{
					mnCk = false;//只要有一个不勾选，则false
					break;
				}
			}
		
			for(var i=(gDvr.AnalogChNum+1); i<=gDvr.nChannel; i++){//IP通道数
				if( $(".IORecordCh"+i).prop("checked") ){
					//
				}else{
					ipCk = false;//只要有一个不勾选，则false
					break;
				}
			}
		
			if(mnCk){
				$(".IOCh_MN_CkAll").prop("checked",true);
			}else{
				$(".IOCh_MN_CkAll").prop("checked",false);
			}
		
			if(ipCk){
				$(".IOCh_IP_CkAll").prop("checked",true);
			}else{
				$(".IOCh_IP_CkAll").prop("checked",false);
			}
		
			if( mnCk && ipCk ){
				$("#all_checked").prop("checked",true);
			}else{
				$("#all_checked").prop("checked",false);
			}
		}
	}
});


