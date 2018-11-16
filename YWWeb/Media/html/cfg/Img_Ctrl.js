
// JavaScript Document
$(document).ready(function(){
	if(g_bDefaultShow == true){
			$("#ChncamDf").css("display","block");
			$("#ChncamCp").css("display","block");
	}
	if(gDvr.nChannel==1){
		$("#CAM_CHN_TABLE").css("display","none");//Channel行
	}
	
	var com = 4;
	
	//初始操作
	var sel = -1;
	//Cam_FlickerCtrl = 0;	
	$("#Cam_Flip").prop("checked",false);//不勾选
	$("#Cam_Mirror").prop("checked",false);//不勾选
	
	$(function(){
		if(gDvr.hybirdDVRFlag==1){//混合DVR
			//模拟通道不显示
			for(var i=gDvr.AnalogChNum; i<gDvr.nChannel; i++){//IP通道
				//console.log(IpcAbility[i].State);
				if(IpcAbility[i].State == 2){
					if(sel==-1){
						sel = i;//显示列表的第一项
					}
					$("#ChncamChannelMask").append('<option class="option" value="'+i+'">'+ "IP " +lg.get("IDS_CH")+(i+1-gDvr.AnalogChNum)+'</option>');//Channel列表
				}
			}
			
			var len = document.getElementById("ChncamChannelMask").length;
			if(len==0){
				$("#ChncamChannelMask").append('<option class="option" selected="selected" value="'+'None'+'">'+ " None " +'</option>');//Channel列表
				//禁用
				disabledParam();
				MasklayerHide();
				return;
			}
		}else{
			for(var i=0; i<gDvr.nChannel; i++){
				if(IpcAbility[i].State == 2){//枚举IPChnStatus_e
					if(sel==-1 && (((IpcAbility[i].Abilities>>11) & 1) == 1)){//枚举Net_ABILITY_TYPE_E
						sel = i;//显示列表的第一项
					}
					$("#ChncamChannelMask").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');//Channel列表
				}
			}
		}
		if(sel == -1){
			sel = 0;//显示列表的第一项
		}
		//MasklayerShow();
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 100, "Get");//获取所有通道数据
		$("#ChncamChannelMask").val(sel);
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", sel, "Get");//获取单个通道数据
	});	
	
	//刷新
	function Call(xml){		
		if (xml == "<result>1</result>"){
			//保存参数到板端成功
			//PaopSuccess($("#chn_osd").text());
		}else if(xml == "<result>0</result>"){
			//保存参数到板端失败
			//PaopSuccess($("#chn_osd").text(), g_sfail );
		}else if(xml == "<result>2</result>"){
			//数据复制成功
			 msg = lg.get("IDS_COPY_SUC");
		  	 //PaopSuccess($("#chn_osd").text(), msg);
		}else if(xml == "<result>4</result>"){
			//用户没有权限保存
			//PaopSuccess($("#chn_osd").text(), n_popedom);
		}else if (xml != "err"){
			if (xml == ""){
				//PaopSuccess($("#chn_osd").text(), g_ffail);
				//MasklayerHide();
				return;
			}		
			$("#Cam_IRCutSensitive").val(findNode("IRCutSensitive", xml)*1);//2 隐藏
			$("#Cam_IRCutDelay").val(findNode("IRCutDelay",xml)*1);//3
			$("#Cam_Flip").prop("checked", findNode("Flip", xml)*1);//4
			$("#Cam_Mirror").prop("checked", findNode("Mirror", xml)*1);//5	
			$("#Cam_Angle_Trad").val(findNode("Rotate", xml)*1);
			
			$("#Cam_BackLightMode").val(findNode("BackLightMode", xml)*1);//6
				if($("#Cam_BackLightMode").val() == 1){
				   $("#backlight_lvl").css("display", "block");
				}else{
				   $("#backlight_lvl").css("display", "none");        
				}
			
			$("#Cam_BackLightLevel").val(findNode("BackLightLevel", xml)*1);//7
			
			$("#Cam_R3dnrMode").val( findNode("R3dnrMode", xml)*1);//8
				if($("#Cam_R3dnrMode").val() == 0){
					$("#3D_reduct").css("display", "none");    
				}else{
					$("#3D_reduct").css("display", "block");         
				}
			
			$("#Cam_R3dnrThreshTarget").val(findNode("R3dnrThreshTarget", xml)*1);//9
			
			$("#Cam_DwdrMode").val(findNode("DwdrMode",xml)*1);//10
				if($("#Cam_DwdrMode").val() == 1){
				   $("#digital_wide").css("display", "block");
				}else{
				   $("#digital_wide").css("display", "none");         
				}
			
			$("#Cam_DwdrStrength").val(findNode("DwdrStrength", xml)*1);//11			
			$("#Cam_GainControlMode").val(findNode("GainControlMode", xml)*1);//12
			
			$("#Cam_WBMode").val(findNode("WBMode", xml)*1);//13
				if($("#Cam_WBMode").val() == 0){
					$("#Cam_Rgain_div").css("display", "none");
					$("#Cam_Ggain_div").css("display", "none");
					$("#Cam_Bgain_div").css("display", "none");
				}else if($("#Cam_WBMode").val() == 2){
					$("#Cam_Rgain_div").css("display", "none");
					$("#Cam_Ggain_div").css("display", "none");
					$("#Cam_Bgain_div").css("display", "none");       
				}else if($("#Cam_WBMode").val() == 1){
					$("#Cam_Rgain_div").css("display", "block");
					$("#Cam_Ggain_div").css("display", "block");
					$("#Cam_Bgain_div").css("display", "block");         
				}
			
			$("#Cam_Rgain").val(findNode("Rgain",xml)*1);//14
			$("#Cam_Ggain").val(findNode("Ggain",xml)*1);//15
			$("#Cam_Bgain").val(findNode("Bgain", xml)*1);//16
			$("#Cam_DefogThreshTarget").val(findNode("DefogStrength",xml)*1);
			
			$("#Cam_ShutterMode").val(findNode("ShutterMode", xml)*1);//17
			
			Cam_FlickerCtrl = findNode("FlickerCtrl", xml)*1;
			
			//使用值，显示
				sliderback[0] = $("#Cam_IRCutDelay").val()*1;
				UI.SliderCam0("gsliderCovCam", "gsliderBtnCam", "gsliderCam");
				
				sliderback[1] = $("#Cam_R3dnrThreshTarget").val()*1;
				UI.SliderCam1("R3dnrThreshTarget_1", "R3dnrThreshTarget_3", "R3dnrThreshTarget_2");
				
				sliderback[2] = $("#Cam_DwdrStrength").val()*1;
				UI.SliderCam2("DwdrStrength_1", "DwdrStrength_3", "DwdrStrength_2");
				
				sliderback[3] = $("#Cam_Rgain").val()*1;
				UI.SliderCam3("Rgain_1", "Rgain_3", "Rgain_2");
				
				sliderback[4] = $("#Cam_Ggain").val()*1;
				UI.SliderCam4("Ggain_1", "Ggain_3", "Ggain_2");
				
				sliderback[5] = $("#Cam_Bgain").val()*1;
				UI.SliderCam5("Bgain_1", "Bgain_3", "Bgain_2");
				
				sliderback[7] = $("#Cam_DefogThreshTarget").val()*1;
				UI.SliderCam7("DefogThreshTarget_1", "DefogThreshTarget_3", "DefogThreshTarget_2");
			
			gDvr.Motion("ImgCtrl",com,sel);
		}else{
			 //PaopSuccess($("#chn_osd").text(), g_ffail);
		}
		
		//获取列表、赋值
		/*if(Cam_FlickerCtrl){
			$("#Cam_eShutterSpeed").empty();
			$("#Cam_eShutterSpeed").append('<option value="1">1/30</option>');
		}else{
			$("#Cam_eShutterSpeed").empty();
			$("#Cam_eShutterSpeed").append('<option value="0">1/25</option>');
		}	*/	
		$("#Cam_eShutterSpeed").empty();
		$("#Cam_eShutterSpeed").append('<option value="0">1/5</option>');
		$("#Cam_eShutterSpeed").append('<option value="1">1/8</option>');
		$("#Cam_eShutterSpeed").append('<option value="2">1/15</option>');
		$("#Cam_eShutterSpeed").append('<option value="3">1/25</option>');
		$("#Cam_eShutterSpeed").append('<option value="4">1/30</option>');
        $("#Cam_eShutterSpeed").append('<option value="5">1/50</option>');
        $("#Cam_eShutterSpeed").append('<option value="6">1/60</option>'); 
        $("#Cam_eShutterSpeed").append('<option value="7">1/100</option>');
        $("#Cam_eShutterSpeed").append('<option value="8">1/120</option>');
        $("#Cam_eShutterSpeed").append('<option value="9">1/150</option>');
        $("#Cam_eShutterSpeed").append('<option value="10">1/180</option>');
        $("#Cam_eShutterSpeed").append('<option value="11">1/200</option>');
        $("#Cam_eShutterSpeed").append('<option value="12">1/240</option>');
        $("#Cam_eShutterSpeed").append('<option value="13">1/250</option>');
        $("#Cam_eShutterSpeed").append('<option value="14">1/300</option>'); 
        $("#Cam_eShutterSpeed").append('<option value="15">1/360</option>');
        $("#Cam_eShutterSpeed").append('<option value="15">1/480</option>');
        $("#Cam_eShutterSpeed").append('<option value="17">1/500</option>');
        $("#Cam_eShutterSpeed").append('<option value="18">1/600</option>');
        $("#Cam_eShutterSpeed").append('<option value="19">1/700</option>');
        $("#Cam_eShutterSpeed").append('<option value="20">1/1000</option>');
        $("#Cam_eShutterSpeed").append('<option value="21">1/1500</option>');
        $("#Cam_eShutterSpeed").append('<option value="22">1/2500</option>');
        $("#Cam_eShutterSpeed").append('<option value="23">1/5000</option>');
        $("#Cam_eShutterSpeed").append('<option value="24">1/10000</option>');
        $("#Cam_eShutterSpeed").append('<option value="25">1/12000</option>');
        $("#Cam_eShutterSpeed").append('<option value="26">1/20000</option>');	
		$("#Cam_eShutterSpeed").val(findNode("eShutterSpeed",xml)*1);//18
		$("#Cam_DefogMode").val(findNode("DefogMode",xml)*1);
		
		
		if(1){//之前只有H265打开，现在全部打开
			if(IpcAbility[sel].IPCDevTypeFlag == 2){
				$("#Cam_IRCutMode option[value='3']").remove();
				$("#Defog_Mode_Div").css("display","block")
				$("#Cam_Trad_R").css("display","block");
				$("#Cam_Angle_Trad").css("display","block");
				if($("#Cam_DefogMode").val() == 2){
					$("#Defog_level").css("display","block");
				}else{
					$("#Defog_level").css("display","none");
				}
			}else{
				$("#Cam_IRCutMode option[value='3']").remove();
				$("#Cam_IRCutMode").append('<option value="3">'+lg.get("IDS_VID_MODE")+'</option>');
				$("#Defog_Mode_Div").css("display","none");
				$("#Defog_level").css("display","none");
				$("#Cam_Trad_R").css("display","none");
				$("#Cam_Angle_Trad").css("display","none");
			}
		}
		$("#Cam_IRCutMode").val(findNode("IRCutMode", xml)*1);//1
		if(gDvr.hybirdDVRFlag){
			if(IpcAbility[sel].State != 2){//IPC不在线，禁用
				disabledParam();
			}else{
				if(((IpcAbility[sel].Abilities>>11) & 1) == 0){//失败 //枚举Net_ABILITY_TYPE_E
					disabledParam();//在线，但不支持修改参数
				}else{
					enableParam();
				}
			}
		}
	}
	
	$("#Cam_BackLightMode").change(function(){
        if($("#Cam_BackLightMode").val() == 1){
            $("#backlight_lvl").css("display", "block");
        }else{
            $("#backlight_lvl").css("display", "none");         
        }
    });
    
    $("#Cam_R3dnrMode").change(function(){
        if($("#Cam_R3dnrMode").val() == 0){
			$("#3D_reduct").css("display", "none");      
        }else{
			$("#3D_reduct").css("display", "block");         
        }       
    });
    
	$("#Cam_DwdrMode").change(function(){
        if($("#Cam_DwdrMode").val() == 1){
            $("#digital_wide").css("display", "block");
        }else{
            $("#digital_wide").css("display", "none");         
        }
    });
    
    $("#Cam_WBMode").change(function(){
        if($("#Cam_WBMode").val() == 0){
            $("#Cam_Rgain_div").css("display", "none");
            $("#Cam_Ggain_div").css("display", "none");
            $("#Cam_Bgain_div").css("display", "none");
        }else if($("#Cam_WBMode").val() == 2){
            $("#Cam_Rgain_div").css("display", "none");
            $("#Cam_Ggain_div").css("display", "none");
            $("#Cam_Bgain_div").css("display", "none");      
        }else if($("#Cam_WBMode").val() == 1){
            $("#Cam_Rgain_div").css("display", "block");
            $("#Cam_Ggain_div").css("display", "block");
            $("#Cam_Bgain_div").css("display", "block");        
        }
    });
	
	$("#ChncamChannelMask").change(function(){
		var chid = $("#ChncamChannelMask").val()*1;
		if(((IpcAbility[chid].Abilities>>11) & 1) == 0){//失败 //枚举Net_ABILITY_TYPE_E
			if(gDvr.hybirdDVRFlag){
				//运行进入改通道。因为可以显示视频，但是不允许修改参数
			}else{
				$("#ChncamChannelMask").val(sel);
				ShowPaop($("#cam_config").text(), lg.get("IDS_CH")+(chid+1)+" "+lg.get("IDS_CHN_FAILED"));//不支持此功能
				return;
			}
		}
		
		CHOSDSaveSel();
		sel = chid;
		com = 4;
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", sel, "Get");
	});
	
	$("#Cam_DefogMode").change(function(){
		if($("#Cam_DefogMode").val() == 2){
			$("#Defog_level").css("display","block");
		}else{
			$("#Defog_level").css("display","none");
		}
		CHOSDSaveSel();
		sliderback[0] = $("#Cam_IRCutDelay").val()*1;
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 200, "Set");
	});
	
	$("#Cam_Angle_Trad").change(function(){
		CHOSDSaveSel();
		sliderback[0] = $("#Cam_IRCutDelay").val()*1;
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 200, "Set");
	});
	
	//保存数据到板端
	function CHOSDSaveSel(){
		if($("#3dnrThreshTarget").val()<0||$("#3dnrThreshTarget").val()>255)
		{
		    ShowPaop($("#cam_config").text(), lg.get("IDS_VALUE_ERROR")); 
		    return;
		}
		
		if($("#Cam_DwdrStrength").val()<0||$("#Cam_DwdrStrength").val()>255)
		{
		    ShowPaop($("#cam_config").text(), lg.get("IDS_VALUE_ERROR")); 
		    return;
		}
		
		if($("#Cam_Rgain").val()<0||$("#Cam_Rgain").val()>255)
		{
		    ShowPaop($("#cam_config").text(), lg.get("IDS_VALUE_ERROR")); 
		    return;
		}
		
		if($("#Cam_Ggain").val()<0||$("#Cam_Ggain").val()>255)
		{
		    ShowPaop($("#cam_config").text(), lg.get("IDS_VALUE_ERROR")); 
		    return;
		}
		
		if($("#Cam_Bgain").val()<0||$("#Cam_Bgain").val()>255)
		{
		    ShowPaop($("#cam_config").text(), lg.get("IDS_VALUE_ERROR")); 
		    return;
		}
		
		if($("#Cam_DefogThreshTarget").val()<0||$("#Cam_DefogThreshTarget").val()>255)
		{
		    ShowPaop($("#cam_config").text(), lg.get("IDS_VALUE_ERROR")); 
		    return;
		}
		
		var xml = "<a>";
			xml += ("<IRCutMode>" + ($("#Cam_IRCutMode").val()*1) + "</IRCutMode>");//1
			xml += ("<IRCutSensitive>" + ($("#Cam_IRCutSensitive").val()*1) + "</IRCutSensitive>");//2
			xml += ("<IRCutDelay>" + $("#Cam_IRCutDelay").val()*1 + "</IRCutDelay>");//3
			xml += ("<chid>" + sel + "</chid>")
			xml += ("<Flip>" + ($("#Cam_Flip").prop("checked")*1) + "</Flip>");//4
			xml += ("<Mirror>" + ($("#Cam_Mirror").prop("checked")*1) + "</Mirror>");//5
			xml += ("<Rotate>" + ($("#Cam_Angle_Trad").val()*1) + "</Rotate>");//5
			
			xml += ("<BackLightMode>" + $("#Cam_BackLightMode").val()*1 + "</BackLightMode>");//6
			xml += ("<BackLightLevel>" + $("#Cam_BackLightLevel").val()*1 + "</BackLightLevel>");//7
			xml += ("<R3dnrMode>" + $("#Cam_R3dnrMode").val()*1 + "</R3dnrMode>");//8
			xml += ("<R3dnrThreshTarget>" + $("#Cam_R3dnrThreshTarget").val()*1 + "</R3dnrThreshTarget>");//9
			xml += ("<DwdrMode>" + $("#Cam_DwdrMode").val()*1 + "</DwdrMode>");//10
			xml += ("<DwdrStrength>" + $("#Cam_DwdrStrength").val()*1 + "</DwdrStrength>");//11
			xml += ("<GainControlMode>" + $("#Cam_GainControlMode").val()*1 + "</GainControlMode>");//12
			xml += ("<WBMode>" + $("#Cam_WBMode").val()*1 + "</WBMode>");//13
			xml += ("<Rgain>" + $("#Cam_Rgain").val()*1 + "</Rgain>");//14
			xml += ("<Ggain>" + $("#Cam_Ggain").val()*1 + "</Ggain>");//15
			xml += ("<Bgain>" + $("#Cam_Bgain").val()*1 + "</Bgain>");//16
			xml += ("<ShutterMode>" + $("#Cam_ShutterMode").val()*1 + "</ShutterMode>");//17
			xml += ("<eShutterSpeed>" + $("#Cam_eShutterSpeed").val()*1 + "</eShutterSpeed>");//18	
			xml += ("<FlickerCtrl>"+ Cam_FlickerCtrl +"</FlickerCtrl>");	
			
			xml += ("<DefogMode>"+ $("#Cam_DefogMode").val()*1 +"</DefogMode>");	
			xml += ("<DefogStrength>"+ $("#Cam_DefogThreshTarget").val()*1 +"</DefogStrength>");	
		xml += "</a>";
		sliderback[0] = $("#Cam_IRCutDelay").val()*1;
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", sel, "Set", xml);//保存
	}
	
	//刷新
	$("#ChncamRf").click(function(){
		UI.SliderCam0("gsliderCovCam", "gsliderBtnCam", "gsliderCam");
		g_bClickDefBtn = false;
		com = 4;
		if(lgCls.version == "URMET"){
			RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 101 + sel, "Get");	//刷新页面数据
		}
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 100, "Get");	//刷新页面数据
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", sel, "Get");	//刷新页面数据
	});
	
	//默认
	$("#ChncamDf").click(function(){
		UI.SliderCam0("gsliderCovCam", "gsliderBtnCam", "gsliderCam");
		g_bClickDefBtn = true;
		com = 4;
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 850, "Get");	//刷新页面数据
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", sel, "Get");	//刷新页面数据
	});
	
	//保存
	$("#ChncamSV").click(function(){
		//MasklayerShow();
		CHOSDSaveSel();
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 200, "Set");	//保存
	});
	
	$("#Cam_Flip").click(function(){
		if(gDvr.hybirdDVRFlag==1){
			//混合DVR，需要点击Save后才生效
		}else{
			CHOSDSaveSel();
			sliderback[0] = $("#Cam_IRCutDelay").val()*1;
			RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 200, "Set");
		}
	});
	
	$("#Cam_Mirror").click(function(){
		if(gDvr.hybirdDVRFlag==1){
			//混合DVR，需要点击Save后才生效
		}else{
			CHOSDSaveSel();
			sliderback[0] = $("#Cam_IRCutDelay").val()*1;
			RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 200, "Set");
		}
	});
	
	$("#Cam_R3dnrMode").click(function(){
		if(gDvr.hybirdDVRFlag==1){
			//混合DVR，需要点击Save后才生效
		}else{
			CHOSDSaveSel();
			sliderback[0] = $("#Cam_IRCutDelay").val()*1;
			RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 200, "Set");
		}
	});
	
	$("#Cam_DwdrMode").click(function(){
		if(gDvr.hybirdDVRFlag==1){
			//混合DVR，需要点击Save后才生效
		}else{
			CHOSDSaveSel();
			sliderback[0] = $("#Cam_IRCutDelay").val()*1;
			RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 200, "Set");
		}
	});
	
	$("#Cam_WBMode").click(function(){
		if(gDvr.hybirdDVRFlag==1){
			//混合DVR，需要点击Save后才生效
		}else{
			CHOSDSaveSel();
			sliderback[0] = $("#Cam_IRCutDelay").val()*1;
			RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 200, "Set");
		}
	});
	
	 //显示复制通道
	$("#ChncamCp").click(function(){
		$("#NVR_imgctrlck").prop("checked",false);
		copyTD("#NVR_imgctrlCopyTD","imgctrl_ch","NVR_imgctrl_TDNum");
		$.each($("input[id^='imgctrl_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("imgctrl_ch")[1]*1 - 1;
			if((IpcAbility[index].State != 2) || (((IpcAbility[index].Abilities>>11) & 1) == 0)){
				$(this).prop("disabled",true);
			}
		})
	})	
	
    //全选
	$("#NVR_imgctrlck").click(function(){
		$.each($("input[id^='imgctrl_ch']"),function(){
			var thisId = $(this).attr("id");
			var index = thisId.split("imgctrl_ch")[1]*1 - 1;
			if((IpcAbility[index].State == 2) && (((IpcAbility[index].Abilities>>11) & 1) == 1)){
				$(this).prop("checked",$("#NVR_imgctrlck").prop("checked"));
			}
		})
	})

	$("#NVR_imgctrlOk").click(function(){
		var imgctrlCopyXml="";
		$("#NVR_imgctrlCopyTD").css("display","none");	
		var spTdValue="";
		$.each($("input[id^='imgctrl_ch']"),function(){
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
			
			var imgctrlCopyXml = "<a>";
			imgctrlCopyXml += ("<CopyChid>" + copychid + "</CopyChid>");
			imgctrlCopyXml += ("<IRCutMode>" + ($("#Cam_IRCutMode").val()*1) + "</IRCutMode>");//1
			imgctrlCopyXml += ("<IRCutSensitive>" + ($("#Cam_IRCutSensitive").val()*1) + "</IRCutSensitive>");//2
			imgctrlCopyXml += ("<IRCutDelay>" + $("#Cam_IRCutDelay").val()*1 + "</IRCutDelay>");//3
			imgctrlCopyXml += ("<chid>" + sel + "</chid>")
			imgctrlCopyXml += ("<Flip>" + ($("#Cam_Flip").prop("checked")*1) + "</Flip>");//4
			imgctrlCopyXml += ("<Mirror>" + ($("#Cam_Mirror").prop("checked")*1) + "</Mirror>");//5
			imgctrlCopyXml += ("<Rotate>" + ($("#Cam_Angle_Trad").val()*1) + "</Rotate>");//5
			
			imgctrlCopyXml += ("<BackLightMode>" + $("#Cam_BackLightMode").val()*1 + "</BackLightMode>");//6
			imgctrlCopyXml += ("<BackLightLevel>" + $("#Cam_BackLightLevel").val()*1 + "</BackLightLevel>");//7
			imgctrlCopyXml += ("<R3dnrMode>" + $("#Cam_R3dnrMode").val()*1 + "</R3dnrMode>");//8
			imgctrlCopyXml += ("<R3dnrThreshTarget>" + $("#Cam_R3dnrThreshTarget").val()*1 + "</R3dnrThreshTarget>");//9
			imgctrlCopyXml += ("<DwdrMode>" + $("#Cam_DwdrMode").val()*1 + "</DwdrMode>");//10
			imgctrlCopyXml += ("<DwdrStrength>" + $("#Cam_DwdrStrength").val()*1 + "</DwdrStrength>");//11
			imgctrlCopyXml += ("<GainControlMode>" + $("#Cam_GainControlMode").val()*1 + "</GainControlMode>");//12
			imgctrlCopyXml += ("<WBMode>" + $("#Cam_WBMode").val()*1 + "</WBMode>");//13
			imgctrlCopyXml += ("<Rgain>" + $("#Cam_Rgain").val()*1 + "</Rgain>");//14
			imgctrlCopyXml += ("<Ggain>" + $("#Cam_Ggain").val()*1 + "</Ggain>");//15
			imgctrlCopyXml += ("<Bgain>" + $("#Cam_Bgain").val()*1 + "</Bgain>");//16
			imgctrlCopyXml += ("<ShutterMode>" + $("#Cam_ShutterMode").val()*1 + "</ShutterMode>");//17
			imgctrlCopyXml += ("<eShutterSpeed>" + $("#Cam_eShutterSpeed").val()*1 + "</eShutterSpeed>");//18	
			imgctrlCopyXml += ("<FlickerCtrl>"+ Cam_FlickerCtrl +"</FlickerCtrl>");	
			imgctrlCopyXml += ("<DefogMode>"+ $("#Cam_DefogMode").val()*1 +"</DefogMode>");	
			imgctrlCopyXml += ("<DefogStrength>"+ $("#Cam_DefogThreshTarget").val()*1 +"</DefogStrength>");
		imgctrlCopyXml += "</a>";		
		//sliderback[0] = $("#Cam_IRCutDelay").val()*1;
		$("#ChncamChannelMask").change();//复制前把本通道OSD位置保存
		RfParamCall(Call, $("#cam_config").text(), "ImgCtrl", 400, "Set", imgctrlCopyXml);//保存
		}
	})
	
	function disabledParam(){
		//禁用
		$(".ImgCtrl_Hide_Delay").css("display","none");
		$("#Cam_IRCutMode").prop("disabled",true);
		$("#Cam_Flip").prop("disabled",true);
		$("#Cam_Mirror").prop("disabled",true);
		$("#Cam_BackLightMode").prop("disabled",true);
		$("#Cam_BackLightLevel").prop("disabled",true);
		$("#Cam_R3dnrMode").prop("disabled",true);
		$(".ImgCtrl_Hide_Level").css("display","none");
		$("#Cam_DwdrMode").prop("disabled",true);
		$("#Cam_GainControlMode").prop("disabled",true);
		$("#Cam_WBMode").prop("disabled",true);
		$("#Cam_ShutterMode").prop("disabled",true);
		$("#Cam_eShutterSpeed").prop("disabled",true);
	}
	
	function enableParam(){
		//启用
		$(".ImgCtrl_Hide_Delay").css("display","block");
		$("#Cam_IRCutMode").prop("disabled",false);
		$("#Cam_Flip").prop("disabled",false);
		$("#Cam_Mirror").prop("disabled",false);
		$("#Cam_BackLightMode").prop("disabled",false);
		$("#Cam_BackLightLevel").prop("disabled",false);
		$("#Cam_R3dnrMode").prop("disabled",false);
		$(".ImgCtrl_Hide_Level").css("display","block");
		$("#Cam_DwdrMode").prop("disabled",false);
		$("#Cam_GainControlMode").prop("disabled",false);
		$("#Cam_WBMode").prop("disabled",false);
		$("#Cam_ShutterMode").prop("disabled",false);
		$("#Cam_eShutterSpeed").prop("disabled",false);
	}
});
