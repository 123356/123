$(document).ready(function(){
	if(g_bDefaultShow == true){
		$("#analog_Df").css("display","block");
	}
	
	//我只写了 16行、16个checkbox
	for(var i=0; i<16; i++){
		if(i<gDvr.AnalogChNum){
			//模拟通道显示
		}else{
			//IP通道隐藏
			$("#ana_div_row"+i).css("display","none");
			$("#div_anaCk"+i).css("display","none");
		}
	}
	
	if(gDvr.AnalogChNum<=4){
		//隐藏5-8行边框
		$("#ana_box2").css("border","none");
		$("#ana_box3").css("border","none");
		$("#ana_box4").css("border","none");
		$("#ana_rows_div").css("height","124px");
	}else if(gDvr.AnalogChNum<=8){
		$("#ana_box3").css("border","none");
		$("#ana_box4").css("border","none");
		$("#ana_rows_div").css("height","248px");
	}else if(gDvr.AnalogChNum<=12){
		$("#ana_box4").css("border","none");
	}else if(gDvr.AnalogChNum<=16){
		//
	}
	
	$("#anaCkAll1").click(function(){
		if($(this).prop("checked")){
			for(var j=0; j<gDvr.AnalogChNum; j++){
				//先让它勾选，如果大于(总通道数-模拟通道数)，再去掉勾选
				$("#anaCk"+j).prop("checked",true);
				if( checkTotalNum() ){
					$("#anaCk"+j).prop("checked",false);
					return;
				}
			}			
		}else{
			for(var j=0; j<gDvr.AnalogChNum; j++){
				$("#anaCk"+j).prop("checked",false);
			}
		}
	});
	
	//$("#anaCk0,#anaCk1,#anaCk2,#anaCk3,#anaCk4,#anaCk5,#anaCk6,#anaCk7").click(function(){
	$("input[id^='anaCk']").click(function(){
		//checkbox一点击，就已经操作了(勾选、去掉勾选)
		//先让它勾选(系统做的)，如果>8，再去掉勾选
		if( checkTotalNum() ){
			$(this).prop("checked",false);
			return;
		}
		
		anaCkAll1_Check();
	});
	
	function checkTotalNum(){
		var mnCh = 0;
		for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道中
			if( $("#anaCk"+i).prop("checked") ){
				mnCh++;
			}
		}
		//console.log("模拟通道 mnCh:" + mnCh + " IPCRows:" + IPCRows);
		
		//勾选之前，先查看当前的通道总数，不能大于(12-4)(24-8)
		if( (mnCh+IPCRows) > (gDvr.nChannel-gDvr.AnalogChNum) ){
			ShowPaop($("#analog_message").text(),lg.get("IDS_HYBRID_LIMIT_ADD"));
			return true;
		}else{
			return false;
		}
	}
	
	RfParamCall(Call,  $("#analog_message").text(), "AnalogCh", 100, "Get");	//初始时获取页面数据
	
	$("#analog_Rf").click(function(){
		g_bClickDefBtn = false;
		RfParamCall(Call,  $("#analog_message").text(), "AnalogCh", 100, "Get");	//刷新页面数据
	});
	
	$("#analog_Df").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call,  $("#analog_message").text(), "AnalogCh", 850, "Get");
	});
	
	$("#analog_SV").click(function(){
		var xml = "<a>";
		
		for(var i=0; i<gDvr.AnalogChNum; i++){
			xml += ("<Status>" + $("#anaCk"+i).prop("checked")*1 + "</Status>");
		}
		//xml += ("<Status>" + $("#anaCk0").prop("checked")*1 + "</Status>");
		//xml += ("<Status>" + $("#anaCk1").prop("checked")*1 + "</Status>");
		//xml += ("<Status>" + $("#anaCk2").prop("checked")*1 + "</Status>");
		//xml += ("<Status>" + $("#anaCk3").prop("checked")*1 + "</Status>");
		
		xml += "</a>";
		RfParamCall(Call,  $("#analog_message").text(), "AnalogCh", 300, "Set", xml);	//保存
	});

	function Call(xml){
		//console.log("Analog:" + xml);
		
		for(var i=0; i<gDvr.AnalogChNum; i++){
			//<0list><ChnName>Li1</ChnName><Status>1</Status></0list>
			//<1list><ChnName>Li2</ChnName><Status>1</Status></1list>
			//<2list><ChnName>CH3</ChnName><Status>0</Status></2list>
			//<3list><ChnName>CH4</ChnName><Status>0</Status></3list>
			
			//console.log("11:" + (findChildNode(i+"list", "ChnName", xml)));
			$("#analog_ChnName"+i).text( findChildNode(i+"list", "ChnName", xml) );
			
			//console.log("22:" + (findChildNode(i+"list", "Status", xml)*1));
			if( findChildNode(i+"list", "Status", xml)*1 == 1 ){
				$("#analog_Status"+i).text( lg.get("IDS_ANALOG_STATUS_VALUE1") );//打开
				$("#anaCk"+i).prop("checked",true);
			}else{
				$("#analog_Status"+i).text( lg.get("IDS_ANALOG_STATUS_VALUE2") );//关闭
				$("#anaCk"+i).prop("checked",false);				
			}			
		}
		
		anaCkAll1_Check();
	}
	
	function anaCkAll1_Check(){
		var mnCk = true;
		for(var i=0; i<gDvr.AnalogChNum; i++){//模拟通道中
			if( $("#anaCk"+i).prop("checked") ){
				//
			}else{
				mnCk = false;//只要有一个不勾选，则false
				break;
			}
		}
		
		if(mnCk){
			$("#anaCkAll1").prop("checked",true);
		}else{
			$("#anaCkAll1").prop("checked",false);
		}
	}
});