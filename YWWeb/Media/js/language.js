// JavaScript Document
function lan(pageName){
	var temp=null;
	if(pageName =="right"){
		focuss.innerHTML=lg.get("IDS_PTZ_FOCUS");//聚焦
		zoom.innerHTML=lg.get("IDS_PTZ_ZOOM");//变焦
		aperture.innerHTML=lg.get("IDS_PTZ_APERTURE");//光圈
		pre_pos.innerHTML=lg.get("IDS_TIP_PRESET");
		cruise_path.innerHTML=lg.get("IDS_TIP_CRUISE");
		color_default.innerHTML=lg.get("IDS_DEFAULT");
	}else if(pageName =="net_mobile"){
		phone_set.innerHTML=lg.get("IDS_NET_MOBILE");//手机设置
		nbe_usename.innerHTML=lg.get("IDS_LOGIN_NAME");//用户名
		nbe_passwd.innerHTML=lg.get("IDS_SERVERINFO_PSW");//密码
		NET_port.innerHTML=lg.get("IDS_NET_PORT_MOB");//端口
		MBRf.innerHTML=lg.get("IDS_REFRESH");
		MBSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
	}else if(pageName =="left"){
		all_record.innerHTML=lg.get("IDS_RECTYPE_01");//普通录像
		//合并到中性
		if(gDvr.nAlarmOut == 0 && gDvr.IntelligentAnalysis*1 == 0  /*&& lgCls.version == "OWL"*/){
			//被移除了
		}else{
			common_record.innerHTML=lg.get("IDS_RECTYPE_ALARM");//告警录像
		}
		if(gDvr.nAlarmOut == 0){
		}else{
			io_record.innerHTML=lg.get("IDS_RECTYPE_IO");//I/O报警
		}
		motion_record.innerHTML=lg.get("IDS_MOTION_ALARM");//移动侦测
		warn_record.innerHTML=lg.get("IDS_RECTYPE_03");//所有录像
		synchroBack.innerHTML=lg.get("IDS_PLAYBACK_SYS");//同步回放
		daysearch.innerHTML=lg.get("IDS_SEARCH_DAY");//日搜索
		//monthsearch.innerHTML=lg.get("IDS_SEARCH_MONTH");//月搜索
		
		cfgmune_1.innerHTML=lg.get("IDS_DISPLAY_PARAM");//Display
		if(lgCls.version == "OWL"){
			chn_osd.innerHTML=lg.get("IDS_LIVE_PAGE");//live
		}else{
			chn_osd.innerHTML=lg.get("IDS_OSD_INFO");//live
		}
		if(gDvr.hybirdDVRFlag){
			Analog_Ch.innerHTML=lg.get("IDS_ANALOG_TITLE");//模拟通道
			Capture_Jh.innerHTML=lg.get("IDS_CAPTURE_JH");
			Capture_Set.innerHTML=lg.get("IDS_CAPTURE_SET");
		}
		chn_sp.innerHTML=lg.get("IDS_SHELTER_PARAM");//privacy zone
		Img_Ctrl.innerHTML=lg.get("IDS_CAMERA_PARAM");//image control  // Lens parameters
		cfgmune_2.innerHTML=lg.get("IDS_CHINFO_RECORD");//record
		record_pz.innerHTML=lg.get("IDS_REC_PARAM");//录像参数
		record_jh.innerHTML=lg.get("IDS_REC_PLAN");//录像计划
		if(0/*lgCls.version == "KGUARD"*/){
			chn_bm.innerHTML=lg.get("IDS_RECORD_SETUP"); //mainstream
			main_stream_set.innerHTML=lg.get("IDS_RECORD_SETUP");
		}else{
			chn_bm.innerHTML=lg.get("IDS_ENCODE_INFO"); //mainstream
			main_stream_set.innerHTML=lg.get("IDS_ENCODE_INFO");
		}
		gotochn_bm.innerHTML=lg.get("IDS_ENCODE_INFO"); //mainstream
		
		recordtype.innerHTML = lg.get("IDS_TYPE");
		
		//gsliderCov.title=lg.get("IDS_PTZ_SPEED");
		
		streamset_advanced.innerHTML=lg.get("IDS_STREAMSET_ADVANCED");
		
		cfgmune_3.innerHTML=lg.get("IDS_NET_PARAM");//network
		if(lgCls.version == "OWL"){
			net_base.innerHTML=lg.get("IDS_NET_MAIN");//main
		}else{
			net_base.innerHTML=lg.get("IDS_NET_PARAM");//network
		}
		if(0/*lgCls.version == "KGUARD"*/){
			chn_subbm.innerHTML=lg.get("IDS_SUBSTREAM_CIF"); //substream
			sub_stream_set.innerHTML=lg.get("IDS_SUBSTREAM_CIF");
		}else{
			chn_subbm.innerHTML=lg.get("IDS_SUBSTREAM"); //substream
			if(lgCls.version == "OWL"){
				//sub_stream_set.innerHTML=lg.get("IDS_SD_SETTING");
				sub_stream_set2.innerHTML=lg.get("IDS_SD_SETTING");
			}else{
				sub_stream_set.innerHTML=lg.get("IDS_SUBSTREAM");
			}
		}
		mobile_stream_set.innerHTML=lg.get("IDS_LOW_DIF");//手机码流
		mobile_stream_set2.innerHTML=lg.get("IDS_LOW_DIF");//手机码流
		stream_set.innerHTML=lg.get("IDS_STREAM_SET");
		router_lan.innerHTML=lg.get("IDS_ROUTER_LAN");
		router_wan.innerHTML=lg.get("IDS_ROUTER_WAN");
		IPC_wifiset.innerHTML=lg.get("IDS_WIFI_SET");
		IPCan_set.innerHTML=lg.get("IDS_IPCALARM");
		net_ddns.innerHTML=lg.get("IDS_DDNS");//DDNS配置
		net_email.innerHTML=lg.get("IDS_EMAIL_INFO");//Email配置
		net_mobile.innerHTML=lg.get("IDS_NET_MOBILE");//手机设置
		plat_set.innerHTML=lg.get("IDS_TITLE_PLATFORM");//平台设置
		SG_platform.innerHTML=lg.get("IDS_SGPLAT");//深广平台设置
		email_jh.innerHTML=lg.get("IDS_EMAIL_PLAN");
		
		cfgmune_4.innerHTML=lg.get("IDS_ALARM_PARAM");//alarm
		alarm_mv.innerHTML=lg.get("IDS_MOTION_ALARM");//motion
		alarm_io.innerHTML=lg.get("IDS_ALARM_IO");//I/O alarm
		
		cfgmune_5.innerHTML=lg.get("IDS_DEVICE");//device
		if(gDvr.DevType == 4)
		{
			sysinf_hdd.innerHTML=lg.get("IDS_HDD_IPCINFO");
		}else{
			sysinf_hdd.innerHTML=lg.get("IDS_HDD_INFO");//hdd info
		}
		chn_yt.innerHTML=lg.get("IDS_PTZ_PARAM");//PTZ
		NewCloud_Storage.innerHTML=lg.get("IDS_CLOUDSTORAGE");	
		
		cfgmune_6.innerHTML=lg.get("IDS_SYS_PARAM");//system
		syspm_dst.innerHTML=lg.get("IDS_BASE_INFO");//general
		syspm_user.innerHTML=lg.get("IDS_USER_INFO");//users
		sysinf_base.innerHTML=lg.get("IDS_INFO");//info
		Chn_Info.innerHTML=lg.get("IDS_CHN_INFO");
		Rec_Info.innerHTML=lg.get("IDS_REC_INFO");
		netinf_3G.innerHTML=lg.get("IDS_3GINFO");//3gInfo
		
		cfgmune_7.innerHTML=lg.get("IDS_ADVANCE");//advance
		cfgmune_8.innerHTML=lg.get("IDS_CAPTURE_CAP");
		syswh_sj.innerHTML=lg.get("IDS_SYS_UPDATE");//系统升级
		syswh_mr.innerHTML=lg.get("IDS_DEFAULT_PARAM");//default
		alarm_yc.innerHTML=lg.get("IDS_ABNORMITY_ALARM");//异常告警
		auto_wh.innerHTML=lg.get("IDS_SYS_MAINTE");//maintain
		IP_Filter.innerHTML=lg.get("IDS_IPFILTER");//IP过滤
		RTSP_Set.innerHTML=lg.get("IDS_RTSP_SET");//RTSP设置
		
		Perimeter_Line.innerHTML=lg.get("IDS_PERIMETER_LINE");//周界伴线
		//Video_Diagnostics.innerHTML
		//GoodsLost_Legacy.innerHTML
		NormalClo_Sto.innerHTML=lg.get("IDS_CLOUDSTORAGE");
	}else if(pageName =="login"){
		//raysee.innerHTML=lg.get("IDS_RAYSEE");//Ray See
		//versions.innerHTML=lg.get("IDS_IE_VERSION");//IE端V1.1版
		login_reset.innerHTML = lg.get("IDS_LOGIN_RESET");
		userlogin.innerHTML=lg.get("IDS_USER_LOGIN");//用户登录
	//	document.getElementById("login_language").options[0].innerHTML=lg.get("IDS_NORMAL_OPEN");//中文
	//	document.getElementById("login_language").options[1].innerHTML=lg.get("IDS_NORMAL_CLOSE");//English
	    language.innerHTML=lg.get("IDS_LANGUAGE");
		//ipaddress.innerHTML=lg.get("IDS_IPADDRESS");
		usernames.innerHTML=lg.get("IDS_LOGIN_NAME");//用户名
		//ipaddress.innerHTML=lg.get("IDS_NET_IPADDR");
		password.innerHTML=lg.get("IDS_LOGIN_PSW");//密码
		meatePort.innerHTML=lg.get("IDS_NEW_MEDIAPORT");//媒体端口
		if(gIELogin && gIDLogin){
			ipaddress.innerHTML="NVR "+lg.get("IDS_DEVID");
		}else{
			ipaddress.innerHTML=lg.get("IDS_NET_IPADDR");
		}
		loginType.innerHTML=lg.get("IDS_LOGIN_TYPE");
		document.getElementById("login_type").options[0].innerHTML=lg.get("IDS_IPC_LOGIN");
		document.getElementById("login_type").options[1].innerHTML=lg.get("IDS_DVR_LOGIN");
		document.getElementById("login_type").options[2].innerHTML=lg.get("IDS_NVR_LOGIN");
		/*
		if(lgCls.version == "KGUARD"){
			streamcode.innerHTML=lg.get("IDS_BITRATE_CIF");//码流
			document.getElementById("login_ml").options[0].innerHTML=lg.get("IDS_MAINSTREAM_CIF");//主码流
			document.getElementById("login_ml").options[1].innerHTML=lg.get("IDS_SUBSTREAM_CIF");//子码流
		}else{
			streamcode.innerHTML=lg.get("IDS_LOGIN_BITRATE");//码流
			document.getElementById("login_ml").options[0].innerHTML=lg.get("IDS_CODE_STREAM_01");//主码流
			document.getElementById("login_ml").options[1].innerHTML=lg.get("IDS_CODE_STREAM_02");//子码流
		}*/
		streamcode.innerHTML=lg.get("IDS_LOGIN_BITRATE");//码流
		document.getElementById("login_ml").options[0].innerHTML=lg.get("IDS_CODE_STREAM_01");//主码流
		document.getElementById("login_ml").options[1].innerHTML=lg.get("IDS_CODE_STREAM_02");//子码流
		if(lgCls.version == "OWL")
		{
			document.getElementById("login_ml").options[2].innerHTML=lg.get("IDS_CODE_STREAM_03");//手机码流
		}else{
			document.getElementById("login_ml").options[2].innerHTML=lg.get("IDS_LOW_DIF");//手机码流
		}
		
		rememberPS.innerHTML=lg.get("IDS_REM_PASSWORD");//记住密码
		openpiew.innerHTML=lg.get("IDS_PREVIEWOPENSTREAM");//打开预览
		login_ok.innerHTML=lg.get("IDS_SERVER_LOGIN");//登录
		}else if(pageName=="pathConfig"){
		recordfile.innerHTML=lg.get("IDS_STATIC_ALARM");//录像文件
		longfiledown.innerHTML=lg.get("IDS_STATIC_RECDOWN");//远程文件下载
		getimg.innerHTML=lg.get("IDS_STATIC_CAPTURE");//图片抓拍文件
		filetype.innerHTML=lg.get("IDS_FILE_TYPE");//文件类型
		OriginalVideoSwitch.innerHTML=lg.get("IDS_PREVIEW_ORIGINAL");//原始比例显示
		OriginalVideo.innerHTML=lg.get("IDS_VIDEOSIZE");//视频显示
		FullVideoSwitch.innerHTML=lg.get("IDS_BESPREAD");
		if(gDvr.nMainType == 0x52530306){
			document.getElementById("Path_fileType").options[0].innerHTML="rf";//h265
		}else{
			document.getElementById("Path_fileType").options[0].innerHTML=lg.get("IDS_TYPE_H264");//h264
		}
		document.getElementById("Path_fileType").options[1].innerHTML=lg.get("IDS_TYPE_AVI");//avi
		recordtime.innerHTML=lg.get("IDS_MINUTE_TIME");//minuteTime
		minute.innerHTML=lg.get("IDS_MINUTE");//分钟
		setSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//保存
		//recordPathConfig.innerHTML = lg.get("IDS_REC_CONFIG")
		configPath123.innerHTML = lg.get("IDS_PATH_PATH")
		
		}else if(pageName=="alarm_io"){
		<!--alarm_io page  -->
		IORf.innerHTML=lg.get("IDS_REFRESH");
		IODf.innerHTML=lg.get("IDS_DEFAULT");
		IOSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		IOCP.innerHTML=lg.get("IDS_Copy");//Copy
		IO_warn.innerHTML=lg.get("IDS_ALARM_IO");//IO报警
		Changle_num.innerHTML=lg.get("IDS_ALARM_INPUTNUM");//通道号
		IO_warn_state.innerHTML=lg.get("IDS_IO_STATE");//IO报警状态
		IOFullScreen.innerHTML=lg.get("IDS_FULLSCREEN");
		IOAlarmOut.innerHTML=lg.get("IDS_IO_ENABLEOUT");
		if(0/*lgCls.version == "KGUARD"*/){
			IOAlarmLatchTime.innerHTML=lg.get("IDS_LATCHTIME_CIF");
		}else{
			IOAlarmLatchTime.innerHTML=lg.get("IDS_IO_OUTTIME");
		}
		IOAlarmType.innerHTML=lg.get("IDS_ALARM_IOIPC");
		document.getElementById("IOAlarm_Type").options[0].innerHTML=lg.get("IDS_IPCALARM");//IPC
		document.getElementById("IOAlarm_Type").options[1].innerHTML=lg.get("IDS_BOARDALARM");//板载IO
		document.getElementById("IoAlarmSet").options[0].innerHTML=lg.get("IDS_NORMAL_OPEN");//打开
		document.getElementById("IoAlarmSet").options[1].innerHTML=lg.get("IDS_NORMAL_CLOSE");//关闭
		document.getElementById("IoAlarmSet").options[2].innerHTML=lg.get("IDS_OFF");//关闭
		buzzer_time.innerHTML=lg.get("IDS_IO_BUZZERTIME");//蜂鸣器鸣叫时间
		document.getElementById("IoBuzzerMooTime").options[0].innerHTML=lg.get("IDS_OFF");//关闭
		temp=lg.get("IDS_SECOND");
		document.getElementById("IoBuzzerMooTime").options[1].innerHTML="10"+temp;//10秒
		document.getElementById("IoBuzzerMooTime").options[2].innerHTML="20"+temp;//20秒
		document.getElementById("IoBuzzerMooTime").options[3].innerHTML="40"+temp;//40秒
		document.getElementById("IoBuzzerMooTime").options[4].innerHTML="60"+temp;//60秒
		
		urmet_IOFullScreen_1.innerHTML=lg.get("IDS_FULLSCREEN");
		//全屏时间设置
		document.getElementById("urmet_IoFullScreen").options[0].innerHTML=lg.get("IDS_OFF");//关闭
		document.getElementById("urmet_IoFullScreen").options[1].innerHTML="1"+temp;//1秒
		document.getElementById("urmet_IoFullScreen").options[2].innerHTML="2"+temp;//2秒
		document.getElementById("urmet_IoFullScreen").options[3].innerHTML="3"+temp;//3秒
		document.getElementById("urmet_IoFullScreen").options[4].innerHTML="5"+temp;//5秒
		document.getElementById("urmet_IoFullScreen").options[5].innerHTML="7"+temp;//7秒
		document.getElementById("urmet_IoFullScreen").options[6].innerHTML="10"+temp;//10秒
		document.getElementById("urmet_IoFullScreen").options[7].innerHTML="20"+temp;//20秒
		document.getElementById("urmet_IoFullScreen").options[8].innerHTML="30"+temp;//30秒
		
		ai_show_message.innerHTML=lg.get("IDS_IO_MESSAGE");
		ai_send_email.innerHTML=lg.get("IDS_IO_EMAIL");	
		//ai_send_email.innerHTML=lg.get("IDS_IO_EMAIL");//启用邮件发送
		record_delay_time.innerHTML=lg.get("IDS_IO_RECDELAYTIME");//录像延迟时间
		document.getElementById("IoRecordDelayTime").options[0].innerHTML="30"+lg.get("IDS_SECOND");//30秒
		temp=lg.get("IDS_MINUTE");
		document.getElementById("IoRecordDelayTime").options[1].innerHTML="1"+temp;//1分
		document.getElementById("IoRecordDelayTime").options[2].innerHTML="2"+temp;//2分
		document.getElementById("IoRecordDelayTime").options[3].innerHTML="5"+temp;//5分
		record_channel.innerHTML=lg.get("IDS_IO_LINK");//联动录像通道
		all_full.innerHTML=lg.get("IDS_PATH_ALL");//全选
		temp=lg.get("IDS_CH");
		IORecord_1.innerHTML=temp+"01"; //通道1
		IORecord_2.innerHTML=temp+"02"; //通道2
		IORecord_3.innerHTML=temp+"03"; //通道3
		IORecord_4.innerHTML=temp+"04"; //通道4
		IORecord_5.innerHTML=temp+"05"; //通道5
		IORecord_6.innerHTML=temp+"06"; //通道6
		IORecord_7.innerHTML=temp+"07"; //通道7
		IORecord_8.innerHTML=temp+"08"; //通道8
		IORecord_9.innerHTML=temp+"09"; //通道9
		IORecord_10.innerHTML=temp+"10"; //通道10
		IORecord_11.innerHTML=temp+"11"; //通道11
		IORecord_12.innerHTML=temp+"12"; //通道12
		IORecord_13.innerHTML=temp+"13"; //通道13
		IORecord_14.innerHTML=temp+"14"; //通道14
		IORecord_15.innerHTML=temp+"15"; //通道15
		IORecord_16.innerHTML=temp+"16"; //通道16
		IORecord_17.innerHTML=temp+"17"; //通道17
		IORecord_18.innerHTML=temp+"18"; //通道18
		IORecord_19.innerHTML=temp+"19"; //通道19
		IORecord_20.innerHTML=temp+"20"; //通道20
		IORecord_21.innerHTML=temp+"21"; //通道21
		IORecord_22.innerHTML=temp+"22"; //通道22
		IORecord_23.innerHTML=temp+"23"; //通道23
		IORecord_24.innerHTML=temp+"24"; //通道24
		IORecord_25.innerHTML=temp+"25"; //通道25
		IORecord_26.innerHTML=temp+"26"; //通道26
		IORecord_27.innerHTML=temp+"27"; //通道27
		IORecord_28.innerHTML=temp+"28"; //通道28
		IORecord_29.innerHTML=temp+"29"; //通道29
		IORecord_30.innerHTML=temp+"30"; //通道30
		IORecord_31.innerHTML=temp+"31"; //通道31
		IORecord_32.innerHTML=temp+"32"; //通道32
		start_touch_record.innerHTML=lg.get("IDS_IO_REC");//启用触发录像
		//warn_export_time.innerHTML=lg.get("IDS_IO_OUTTIME");//报警输出时间
		IOCh_MNCkAll.innerHTML=IOCh_MNCkAll2.innerHTML=IOCh_MNCkAll3.innerHTML=lg.get("IDS_ANALOG_TITLE");
		IOCh_IPCkAll.innerHTML=IOCh_IPCkAll2.innerHTML=IOCh_IPCkAll3.innerHTML=lg.get("IDS_IO_IPCKALL");
		
		temp=lg.get("IDS_SECOND");
		ioSelectCopy.innerHTML=lg.get("IDS_SEL_CHID");
		ioOk.value=lg.get("IDS_Copy");
		ioSelectAll.innerHTML=lg.get("IDS_PATH_ALL");
		document.getElementById("IOAlarmOutTime").options[0].innerHTML="10"+temp;//10秒
		document.getElementById("IOAlarmOutTime").options[1].innerHTML="20"+temp;//20秒
		document.getElementById("IOAlarmOutTime").options[2].innerHTML="40"+temp;//40秒
		document.getElementById("IOAlarmOutTime").options[3].innerHTML="60"+temp;//60秒
		/*ToFullScreen_1.innerHTML=lg.get("IDS_IO_FULL");//启用报警全屏
		IoAlarmOut_1.innerHTML=lg.get("IDS_IO_ENABLEOUT");//启用报警输出
		IO_warn_set.innerHTML=lg.get("IDS_IO_PARAM");//IO报警设置
		*/
		<!--alarm_io page  end -->
	}else if(pageName=="alarm_mv"){
		<!--alarm_mv page  -->
		MotionSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		MotionRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		MotionDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		MotionCP.innerHTML=lg.get("IDS_Copy");//Copy
		MotionExit.innerHTML=lg.get("IDS_EXIT");//Copy
		amv_move_sense.innerHTML=lg.get("IDS_MOTION_ALARM");//移动侦测
		channels_num_1.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		sense_grade.innerHTML=lg.get("IDS_MOTION_SENSITIVITY");//侦测等级
		sense_grade1.innerHTML=lg.get("IDS_MOTION_SENSITIVITY")+"1";//侦测等级
		sense_grade2.innerHTML=lg.get("IDS_MOTION_SENSITIVITY")+"2";//侦测等级
		sense_grade3.innerHTML=lg.get("IDS_MOTION_SENSITIVITY")+"3";//侦测等级
		sense_grade4.innerHTML=lg.get("IDS_MOTION_SENSITIVITY")+"4";//侦测等级
		MVFullScreen.innerHTML=lg.get("IDS_FULLSCREEN");
		urmet_MVFullScreen.innerHTML=lg.get("IDS_FULLSCREEN");
		MOTIONALARMOUTPUT.innerText = lg.get("IDS_NEW_ALARM_OUT");
		if(0/*lgCls.version == "KGUARD"*/){
			MotionLatchTime.innerHTML=lg.get("IDS_LATCHTIME_CIF");
		}else{
			MotionLatchTime.innerHTML=lg.get("IDS_IO_OUTTIME");
		}	
		document.getElementById("MotionSensitivity").options[0].innerHTML=lg.get("IDS_IO_LEVER8");//8级
		document.getElementById("MotionSensitivity").options[1].innerHTML=lg.get("IDS_IO_LEVER7");//7级
		document.getElementById("MotionSensitivity").options[2].innerHTML=lg.get("IDS_IO_LEVER6");//6级
		document.getElementById("MotionSensitivity").options[3].innerHTML=lg.get("IDS_IO_LEVER5");//5级
		document.getElementById("MotionSensitivity").options[4].innerHTML=lg.get("IDS_IO_LEVER4");//4级
		document.getElementById("MotionSensitivity").options[5].innerHTML=lg.get("IDS_IO_LEVER3");//3级
		document.getElementById("MotionSensitivity").options[6].innerHTML=lg.get("IDS_IO_LEVER2");//2级
		document.getElementById("MotionSensitivity").options[7].innerHTML=lg.get("IDS_IO_LEVER1");//1级
		
		document.getElementById("MotionSensitivity1").options[0].innerHTML=lg.get("IDS_IO_LEVER10");//8级
		document.getElementById("MotionSensitivity1").options[1].innerHTML=lg.get("IDS_IO_LEVER9");//7级
		document.getElementById("MotionSensitivity1").options[2].innerHTML=lg.get("IDS_IO_LEVER8");//6级
		document.getElementById("MotionSensitivity1").options[3].innerHTML=lg.get("IDS_IO_LEVER7");//5级
		document.getElementById("MotionSensitivity1").options[4].innerHTML=lg.get("IDS_IO_LEVER6");//4级
		document.getElementById("MotionSensitivity1").options[5].innerHTML=lg.get("IDS_IO_LEVER5");//3级
		document.getElementById("MotionSensitivity1").options[6].innerHTML=lg.get("IDS_IO_LEVER4");//2级
		document.getElementById("MotionSensitivity1").options[7].innerHTML=lg.get("IDS_IO_LEVER3");//1级
		document.getElementById("MotionSensitivity1").options[8].innerHTML=lg.get("IDS_IO_LEVER2");//1级
		document.getElementById("MotionSensitivity1").options[9].innerHTML=lg.get("IDS_IO_LEVER1");//1级
		
		document.getElementById("MotionSensitivity2").options[0].innerHTML=lg.get("IDS_IO_LEVER10");//8级
		document.getElementById("MotionSensitivity2").options[1].innerHTML=lg.get("IDS_IO_LEVER9");//7级
		document.getElementById("MotionSensitivity2").options[2].innerHTML=lg.get("IDS_IO_LEVER8");//6级
		document.getElementById("MotionSensitivity2").options[3].innerHTML=lg.get("IDS_IO_LEVER7");//5级
		document.getElementById("MotionSensitivity2").options[4].innerHTML=lg.get("IDS_IO_LEVER6");//4级
		document.getElementById("MotionSensitivity2").options[5].innerHTML=lg.get("IDS_IO_LEVER5");//3级
		document.getElementById("MotionSensitivity2").options[6].innerHTML=lg.get("IDS_IO_LEVER4");//2级
		document.getElementById("MotionSensitivity2").options[7].innerHTML=lg.get("IDS_IO_LEVER3");//1级
		document.getElementById("MotionSensitivity2").options[8].innerHTML=lg.get("IDS_IO_LEVER2");//1级
		document.getElementById("MotionSensitivity2").options[9].innerHTML=lg.get("IDS_IO_LEVER1");//1级
		
		document.getElementById("MotionSensitivity3").options[0].innerHTML=lg.get("IDS_IO_LEVER10");//8级
		document.getElementById("MotionSensitivity3").options[1].innerHTML=lg.get("IDS_IO_LEVER9");//7级
		document.getElementById("MotionSensitivity3").options[2].innerHTML=lg.get("IDS_IO_LEVER8");//6级
		document.getElementById("MotionSensitivity3").options[3].innerHTML=lg.get("IDS_IO_LEVER7");//5级
		document.getElementById("MotionSensitivity3").options[4].innerHTML=lg.get("IDS_IO_LEVER6");//4级
		document.getElementById("MotionSensitivity3").options[5].innerHTML=lg.get("IDS_IO_LEVER5");//3级
		document.getElementById("MotionSensitivity3").options[6].innerHTML=lg.get("IDS_IO_LEVER4");//2级
		document.getElementById("MotionSensitivity3").options[7].innerHTML=lg.get("IDS_IO_LEVER3");//1级
		document.getElementById("MotionSensitivity3").options[8].innerHTML=lg.get("IDS_IO_LEVER2");//1级
		document.getElementById("MotionSensitivity3").options[9].innerHTML=lg.get("IDS_IO_LEVER1");//1级
		
		document.getElementById("MotionSensitivity4").options[0].innerHTML=lg.get("IDS_IO_LEVER10");//8级
		document.getElementById("MotionSensitivity4").options[1].innerHTML=lg.get("IDS_IO_LEVER9");//7级
		document.getElementById("MotionSensitivity4").options[2].innerHTML=lg.get("IDS_IO_LEVER8");//6级
		document.getElementById("MotionSensitivity4").options[3].innerHTML=lg.get("IDS_IO_LEVER7");//5级
		document.getElementById("MotionSensitivity4").options[4].innerHTML=lg.get("IDS_IO_LEVER6");//4级
		document.getElementById("MotionSensitivity4").options[5].innerHTML=lg.get("IDS_IO_LEVER5");//3级
		document.getElementById("MotionSensitivity4").options[6].innerHTML=lg.get("IDS_IO_LEVER4");//2级
		document.getElementById("MotionSensitivity4").options[7].innerHTML=lg.get("IDS_IO_LEVER3");//1级
		document.getElementById("MotionSensitivity4").options[8].innerHTML=lg.get("IDS_IO_LEVER2");//1级
		document.getElementById("MotionSensitivity4").options[9].innerHTML=lg.get("IDS_IO_LEVER1");//1级
		buzzer_moo_time.innerHTML=lg.get("IDS_IO_BUZZERTIME");//蜂鸣器鸣叫时间
		document.getElementById("MotionBuzzerMooTime").options[0].innerHTML=lg.get("IDS_OFF");//关闭
		temp=lg.get("IDS_SECOND");
		document.getElementById("MotionBuzzerMooTime").options[1].innerHTML="10"+temp;//10秒
		document.getElementById("MotionBuzzerMooTime").options[2].innerHTML="20"+temp;//20秒
		document.getElementById("MotionBuzzerMooTime").options[3].innerHTML="40"+temp;//40秒
		document.getElementById("MotionBuzzerMooTime").options[4].innerHTML="60"+temp;//60秒
		record_delay_time_1.innerHTML=lg.get("IDS_IO_RECDELAYTIME");//录像延迟时间
		
		//全屏时间设置
		document.getElementById("urmet_MotionFullScreen").options[0].innerHTML=lg.get("IDS_OFF");//关闭
		document.getElementById("urmet_MotionFullScreen").options[1].innerHTML="1"+temp;//1秒
		document.getElementById("urmet_MotionFullScreen").options[2].innerHTML="2"+temp;//2秒
		document.getElementById("urmet_MotionFullScreen").options[3].innerHTML="3"+temp;//3秒
		document.getElementById("urmet_MotionFullScreen").options[4].innerHTML="5"+temp;//5秒
		document.getElementById("urmet_MotionFullScreen").options[5].innerHTML="7"+temp;//7秒
		document.getElementById("urmet_MotionFullScreen").options[6].innerHTML="10"+temp;//10秒
		document.getElementById("urmet_MotionFullScreen").options[7].innerHTML="20"+temp;//20秒
		document.getElementById("urmet_MotionFullScreen").options[8].innerHTML="30"+temp;//30秒
		
		temp=lg.get("IDS_MINUTE");	
		linkage_record_channel.innerHTML=lg.get("IDS_IO_LINK");//联动录像通道
		amv_all.innerHTML=lg.get("IDS_PATH_ALL");
		temp=lg.get("IDS_CH");
		RecordCh1_1_1.innerHTML=temp+"01"; //通道1
		RecordCh1_1_2.innerHTML=temp+"02"; //通道2
		RecordCh1_1_3.innerHTML=temp+"03"; //通道3
		RecordCh1_1_4.innerHTML=temp+"04"; //通道4
		RecordCh1_1_5.innerHTML=temp+"05"; //通道5
		RecordCh1_1_6.innerHTML=temp+"06"; //通道6
		RecordCh1_1_7.innerHTML=temp+"07"; //通道7
		RecordCh1_1_8.innerHTML=temp+"08"; //通道8
		RecordCh1_1_9.innerHTML=temp+"09"; //通道9
		RecordCh1_1_10.innerHTML=temp+"10"; //通道10
		RecordCh1_1_11.innerHTML=temp+"11"; //通道11
		RecordCh1_1_12.innerHTML=temp+"12"; //通道12
		RecordCh1_1_13.innerHTML=temp+"13"; //通道13
		RecordCh1_1_14.innerHTML=temp+"14"; //通道14
		RecordCh1_1_15.innerHTML=temp+"15"; //通道15
		RecordCh1_1_16.innerHTML=temp+"16"; //通道16
		RecordCh1_1_17.innerHTML=temp+"17"; //通道17
		RecordCh1_1_18.innerHTML=temp+"18"; //通道18
		RecordCh1_1_19.innerHTML=temp+"19"; //通道19
		RecordCh1_1_20.innerHTML=temp+"20"; //通道20
		RecordCh1_1_21.innerHTML=temp+"21"; //通道21
		RecordCh1_1_22.innerHTML=temp+"22"; //通道22
		RecordCh1_1_23.innerHTML=temp+"23"; //通道23
		RecordCh1_1_24.innerHTML=temp+"24"; //通道24
		RecordCh1_1_25.innerHTML=temp+"25"; //通道25
		RecordCh1_1_26.innerHTML=temp+"26"; //通道26
		RecordCh1_1_27.innerHTML=temp+"27"; //通道27
		RecordCh1_1_28.innerHTML=temp+"28"; //通道28
		RecordCh1_1_29.innerHTML=temp+"29"; //通道29
		RecordCh1_1_30.innerHTML=temp+"30"; //通道30
		RecordCh1_1_31.innerHTML=temp+"31"; //通道31
		RecordCh1_1_32.innerHTML=temp+"32"; //通道32
		start_touch_record_1.innerHTML=lg.get("IDS_IO_REC");//启用触发录像
		//warn_export_time_1.innerHTML=lg.get("IDS_IO_OUTTIME");//报警输出时间
		RecCh_MNCkAll.innerHTML=RecCh_MNCkAll2.innerHTML=RecCh_MNCkAll3.innerHTML=lg.get("IDS_ANALOG_TITLE");
		RecCh_IPCkAll.innerHTML=RecCh_IPCkAll2.innerHTML=RecCh_IPCkAll3.innerHTML=lg.get("IDS_IO_IPCKALL");
		
		temp=lg.get("IDS_SECOND");
		document.getElementById("MotionAlarmOutTime").options[0].innerHTML="10"+temp;//10秒
		document.getElementById("MotionAlarmOutTime").options[1].innerHTML="20"+temp;//20秒
		document.getElementById("MotionAlarmOutTime").options[2].innerHTML="40"+temp;//40秒
		document.getElementById("MotionAlarmOutTime").options[3].innerHTML="60"+temp;//60秒
		
		show_message.innerHTML=lg.get("IDS_IO_MESSAGE");//显示消息
		start_sendEmail.innerHTML=lg.get("IDS_IO_EMAIL");//启用邮件发送
		ClearBtn.value=lg.get("IDS_MOTION_CLEAR");
		//document.getElementById("ClearBtn").innerHTML=lg.get("IDS_MOTION_CLEAR"); //清除
		SelectBtn.value=lg.get("IDS_MOTION_SELECT");
		//document.getElementById("SelectBtn").innerHTML=lg.get("IDS_MOTION_SELECT"); //全选
		start_move_sense.innerHTML=lg.get("IDS_MOTION_ENABLE");//启用移动侦测
		mvSelectCopy.innerHTML=lg.get("IDS_SEL_CHID");
		mvOk.value=lg.get("IDS_Copy");
		mvSelectedAll.innerHTML=lg.get("IDS_PATH_ALL");  //请选择需要复制的通道
		<!--alarm_mv page  end -->
	}else if(pageName=="alarm_yc"){
		<!--alarm_yc page  -->
		ABSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		ABRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		ABDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		ab_report.innerHTML=lg.get("IDS_ABNORMITY_ALARM");//异常告警
		ab_type.innerHTML=lg.get("IDS_MOTION_TYPE");//异常类型
		document.getElementById("AbnormalType").options[0].innerHTML=lg.get("IDS_HDD_NOT_CONTENT");//硬盘空间不足
		document.getElementById("AbnormalType").options[1].innerHTML=lg.get("IDS_ALARM_HDDINVALIDALARM");//没有硬盘
		document.getElementById("AbnormalType").options[2].innerHTML=lg.get("IDS_ALARM_VIDEOLOSS");//视频丢失
		ay_start_ab_warn.innerHTML=lg.get("IDS_ABNORMITY_ENABLE");//启用异常报警
		ay_buzzer_moo_time.innerHTML=lg.get("IDS_IO_BUZZERTIME");//蜂鸣器鸣叫时间
		document.getElementById("ABBuzzerMooTime").options[0].innerHTML=lg.get("IDS_OFF");//关闭
		temp=lg.get("IDS_SECOND");
		document.getElementById("ABBuzzerMooTime").options[1].innerHTML="10"+temp;//10秒
		document.getElementById("ABBuzzerMooTime").options[2].innerHTML="20"+temp;//20秒
		document.getElementById("ABBuzzerMooTime").options[3].innerHTML="40"+temp;//40秒
		document.getElementById("ABBuzzerMooTime").options[4].innerHTML="60"+temp;//60秒
		ay_show_message.innerHTML=lg.get("IDS_IO_MESSAGE");//显示消息
		ay_start_sendEmail.innerHTML=lg.get("IDS_IO_EMAIL");//启用邮件发送
		ay_start_warn_export.innerHTML=lg.get("IDS_IO_ENABLEOUT");//启用报警输出
		if(0/*lgCls.version == "KGUARD"*/){
			ay_warn_time_out.innerHTML=lg.get("IDS_LATCHTIME_CIF");//报警输出时间
		}else{
			ay_warn_time_out.innerHTML=lg.get("IDS_IO_OUTTIME");//报警输出时间
		}
		document.getElementById("ABAlarmOutTime").options[0].innerHTML="10"+temp;//10秒
		document.getElementById("ABAlarmOutTime").options[1].innerHTML="20"+temp;//20秒
		document.getElementById("ABAlarmOutTime").options[2].innerHTML="40"+temp;//40秒
		document.getElementById("ABAlarmOutTime").options[3].innerHTML="60"+temp;//60秒
		//start_fullScreen_warn.innerHTML=lg.get("IDS_IO_FULL");//启用报警全屏
		<!--alarm_yc page  end -->
	}else if(pageName=="streamset_advanced"){
		<!--streamset_advanced page  -->
		
		NVR_CHNSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		NVR_CHNRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		NVR_CHNCP.innerHTML=lg.get("IDS_Copy");//Refresh
		NVR_stream_config.innerHTML=lg.get("IDS_STREAMSET_ADVANCED");//码流设置
		
		 
		NVR_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		NVR_refresh_rate.innerHTML=lg.get("IDS_REFRESH_RATE");  //刷新频率
		NVR_stream_f_b_l.innerHTML=lg.get("IDS_ENCODE_RESOLUTION");//分辨率
		NVR_main_stream_frame_ratio.innerHTML=lg.get("IDS_ENCODE_FPS");//帧率
		NVR_sub_stream_frame_ratio.innerHTML=lg.get("IDS_ENCODE_FPS");//帧率
		NVR_main_bit_rate.innerHTML=lg.get("IDS_STREAM_BITRATE");//比特率
		NVR_sub_bit_rate.innerHTML=lg.get("IDS_STREAM_BITRATE");//比特率
		NVR_stream_mode.innerHTML=lg.get("IDS_STREAMMODE");//码流模式
		Main.innerHTML=lg.get("IDS_MAINSTREAM");//主码流
		Sub.innerHTML=lg.get("IDS_SUBSTREAM");//子码流
		
		
		document.getElementById("NVR_StreamMode").options[0].innerHTML=lg.get("IDS_SINGLE_STREAM");//单码流
		document.getElementById("NVR_StreamMode").options[1].innerHTML=lg.get("IDS_DUAL_STREAM");//双码流
		
		NVR_Ok.value =lg.get("IDS_Copy");
		NVR_selectID.innerHTML =lg.get("IDS_SEL_CHID");
		NVR_ck.value =lg.get("IDS_PATH_ALL");
		NVR_selectedAll.innerHTML=lg.get("IDS_PATH_ALL");
		<!--streamset_advanced page  end -->
	}else if(pageName=="chn_bm"){
		<!--chn_bm page  -->
		CHNBMSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		CHNBMRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		CHNBMCP.innerHTML=lg.get("IDS_Copy");//Refresh
		if(0/*lgCls.version == "KGUARD"*/){
			code_config.innerHTML=lg.get("IDS_RECORD_SETUP"); //编码配置
			codestream.innerHTML=lg.get("IDS_BITRATE_CIF");//bitrate
			codestream2.innerHTML=lg.get("IDS_BITRATE_CIF");//quality
		}else{
			code_config.innerHTML=lg.get("IDS_ENCODE_INFO"); //编码配置
			codestream.innerHTML=lg.get("IDS_ENCODE_BITRATE");//bitrate
			codestream2.innerHTML=lg.get("IDS_QUALITY");//quality
		}
		if(gDvr.DevType==3 || gDvr.DevType==4){
			code_config.innerHTML = lg.get("IDS_HIGH_DIF");
		}
		maintag_0.innerHTML = lg.get("IDS_HIGH_DIF");
		subtag_0.innerHTML = lg.get("IDS_SD_SDI"); 
		smalltag_0.innerHTML = lg.get("IDS_LOW_DIF");
		 
		cbm_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		f_b_l.innerHTML=lg.get("IDS_ENCODE_RESOLUTION");//分辨率
		document.getElementById("CHNBMmSl").options[0].innerHTML=lg.get("IDS_ENCODE_D1");//精细
		document.getElementById("CHNBMmSl").options[1].innerHTML=lg.get("IDS_ENCODE_HD1");//丰富
		document.getElementById("CHNBMmSl").options[2].innerHTML=lg.get("IDS_ENCODE_CIF");//普通
		frame_ratio.innerHTML=lg.get("IDS_ENCODE_FPS");//帧率
		record_tape.innerHTML=lg.get("IDS_ENCODE_AUDIO");//录音
		if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
			document.getElementById("CHNBMma").options[0].innerHTML=lg.get("IDS_OTHER_OFF");//
			document.getElementById("CHNBMma").options[1].innerHTML=lg.get("IDS_OTHER_ON");//打开
		}else{
			document.getElementById("CHNBMma").options[0].innerHTML=lg.get("IDS_CLOSE");//
			document.getElementById("CHNBMma").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		}
		bmOk.value =lg.get("IDS_Copy");
		main_selectID.innerHTML =lg.get("IDS_SEL_CHID");
		bmck.value =lg.get("IDS_PATH_ALL");
		bm_selectedAll.innerHTML=lg.get("IDS_PATH_ALL");
		<!--chn_bm page  end -->
	}else if(pageName=="main_stream_set"){
		<!--main_stream_set page  -->
		NVR_CHNBMSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		NVR_CHNBMRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		NVR_CHNBMDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		NVR_CHNBMCP.innerHTML=lg.get("IDS_Copy");//Refresh
		if(0/*lgCls.version == "KGUARD"*/){
			NVR_code_config.innerHTML=lg.get("IDS_RECORD_SETUP"); //编码配置
			NVR_codestream.innerHTML=lg.get("IDS_BITRATE_CIF");//bitrate
			NVR_codestream2.innerHTML=lg.get("IDS_BITRATE_CIF");//quality
		}else{
			NVR_code_config.innerHTML=lg.get("IDS_ENCODE_INFO"); //编码配置
			NVR_codestream.innerHTML=lg.get("IDS_ENCODE_BITRATE");//bitrate
			NVR_codestream2.innerHTML=lg.get("IDS_QUALITY");//quality
		}
		if(gDvr.DevType==3 || gDvr.DevType==4){
			if(lgCls.version == "OWL"){
				NVR_code_config.innerHTML = lg.get("IDS_ENCODE_INFO");
			}else{
				NVR_code_config.innerHTML = lg.get("IDS_HIGH_DIF");
			}
		}
		//NVR_maintag_0.innerHTML = lg.get("IDS_HIGH_DIF");
		//NVR_subtag_0.innerHTML = lg.get("IDS_SD_SDI"); 
		//NVR_smalltag_0.innerHTML = lg.get("IDS_LOW_DIF");
		 
		NVR_cbm_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		NVR_f_b_l.innerHTML=lg.get("IDS_ENCODE_RESOLUTION");//分辨率
		//document.getElementById("NVR_CHNBMmSl").options[0].innerHTML=lg.get("IDS_ENCODE_D1");//精细
		//document.getElementById("NVR_CHNBMmSl").options[1].innerHTML=lg.get("IDS_ENCODE_HD1");//丰富
		//document.getElementById("NVR_CHNBMmSl").options[2].innerHTML=lg.get("IDS_ENCODE_CIF");//普通
		NVR_frame_ratio.innerHTML=lg.get("IDS_ENCODE_FPS");//帧率
		NVR_code_type.innerHTML=lg.get("IDS_CODE_TYPE");
		NVR_bitrate_ctrl.innerHTML=lg.get("IDS_BITRATE_CTRL");
		NVR_stream_mode.innerHTML=lg.get("IDS_STREAMMODE");//码流模式
		
		if(gDvr.hybirdDVRFlag==1){
			document.getElementById("NVR_CHNStreamMode").options[0].innerHTML=lg.get("IDS_PRESET_2");//预置
			document.getElementById("NVR_CHNStreamMode").options[1].innerHTML=lg.get("IDS_USER_DEFINE_2");//自定义
		}else{
			document.getElementById("NVR_CHNStreamMode").options[0].innerHTML=lg.get("IDS_PRESET");//预置
			document.getElementById("NVR_CHNStreamMode").options[1].innerHTML=lg.get("IDS_USER_DEFINE");//自定义
		}
		
		NVR_record_tape.innerHTML=lg.get("IDS_ENCODE_AUDIO");//音频
		if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
			document.getElementById("NVR_CHNBMma").options[0].innerHTML=lg.get("IDS_OTHER_OFF");//
			document.getElementById("NVR_CHNBMma").options[1].innerHTML=lg.get("IDS_OTHER_ON");//打开
		}else{
			document.getElementById("NVR_CHNBMma").options[0].innerHTML=lg.get("IDS_CLOSE");//
			document.getElementById("NVR_CHNBMma").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		}
		NVR_bmOk.value =lg.get("IDS_Copy");
		NVR_main_selectID.innerHTML =lg.get("IDS_SEL_CHID");
		NVR_bmck.value =lg.get("IDS_PATH_ALL");
		NVR_bm_selectedAll.innerHTML=lg.get("IDS_PATH_ALL");
		<!--main_stream_set page  end -->
	}else if(pageName =="chn_subbm"){
		<!--chn_bm page  -->
		CHNSUBBMSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		CHNSUBBMRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		CHNSUBBMCP.innerHTML=lg.get("IDS_Copy");//Refresh
		//code_config.innerHTML=lg.get("IDS_ENCODE_INFO");//编码配置
		csubm_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		if(0/*lgCls.version == "KGUARD"*/){
			second.innerHTML=lg.get("IDS_SUBSTREAM_CIF"); //子码流
			codestream_1.innerHTML=lg.get("IDS_BITRATE_CIF");//码流
		}else{
			second.innerHTML=lg.get("IDS_SUBSTREAM");//子码流
			codestream_1.innerHTML=lg.get("IDS_ENCODE_BITRATE");//码流
		}
		if(gDvr.DevType==3 || gDvr.DevType==4){
			second.innerHTML = lg.get("IDS_SD_SDI");
		}
		maintag_1.innerHTML = lg.get("IDS_HIGH_DIF");
		subtag_1.innerHTML = lg.get("IDS_SD_SDI"); 
		smalltag_1.innerHTML = lg.get("IDS_LOW_DIF"); 
		
		f_b_l_1.innerHTML=lg.get("IDS_ENCODE_RESOLUTION");//分辨率
		//document.getElementById("CHNBMsSl").options[0].innerHTML=lg.get("IDS_ENCODE_D1");//精细
		//document.getElementById("CHNBMsSl").options[1].innerHTML=lg.get("IDS_ENCODE_HD1");//丰富
		//document.getElementById("CHNBMsSl").options[2].innerHTML=lg.get("IDS_ENCODE_CIF");//普通
		document.getElementById("CHNBMVideo").options[0].innerHTML=lg.get("IDS_CLOSE");//关闭
		document.getElementById("CHNBMVideo").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		frame_radio_1.innerHTML=lg.get("IDS_ENCODE_FPS");//帧率
		sub_video.innerHTML=lg.get("IDS_TAB_VIDEO");//帧率
		record_tape_1.innerHTML=lg.get("IDS_ENCODE_AUDIO");//录音
		if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
			document.getElementById("CHNBMsa").options[0].innerHTML=lg.get("IDS_OTHER_OFF");//关闭
			document.getElementById("CHNBMsa").options[1].innerHTML=lg.get("IDS_OTHER_ON");//打开
		}else{
			document.getElementById("CHNBMsa").options[0].innerHTML=lg.get("IDS_CLOSE");//关闭
			document.getElementById("CHNBMsa").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		}
		subOk.value =lg.get("IDS_Copy");
		sub_selectID.innerHTML =lg.get("IDS_SEL_CHID");
		//bmck.value =lg.get("IDS_PATH_ALL");
		sub_SelectAll.innerHTML=lg.get("IDS_PATH_ALL");
		<!--chn_bm page  end -->
	}else if(pageName =="sub_stream_set"){
		<!--sub_stream_set page  -->
		NVR_CHNSUBBMSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		NVR_CHNSUBBMRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		NVR_CHNSUBBMDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		NVR_CHNSUBBMCP.innerHTML=lg.get("IDS_Copy");//Refresh
		//code_config.innerHTML=lg.get("IDS_ENCODE_INFO");//编码配置
		NVR_csubm_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		if(0/*lgCls.version == "KGUARD"*/){
			NVR_second.innerHTML=lg.get("IDS_SUBSTREAM_CIF"); //子码流
			NVR_codestream_1.innerHTML=lg.get("IDS_BITRATE_CIF");//码流
		}else{
			if(lgCls.version == "OWL"){
				NVR_second.innerHTML=lg.get("IDS_SD_SETTING");//子码流
			}else{
				NVR_second.innerHTML=lg.get("IDS_SUBSTREAM");//子码流
			}
			NVR_codestream_1.innerHTML=lg.get("IDS_ENCODE_BITRATE");//码流
		}
		if(gDvr.DevType==3 || gDvr.DevType==4){
			if(lgCls.version == "OWL"){
				NVR_second.innerHTML=lg.get("IDS_SD_SETTING");//子码流
			}else{
				NVR_second.innerHTML = lg.get("IDS_SD_SDI");
			}
		}
		//NVR_maintag_1.innerHTML = lg.get("IDS_HIGH_DIF");
		//NVR_subtag_1.innerHTML = lg.get("IDS_SD_SDI"); 
		//NVR_smalltag_1.innerHTML = lg.get("IDS_LOW_DIF"); 
		
		NVR_f_b_l_1.innerHTML=lg.get("IDS_ENCODE_RESOLUTION");//分辨率
		//document.getElementById("CHNBMsSl").options[0].innerHTML=lg.get("IDS_ENCODE_D1");//精细
		//document.getElementById("CHNBMsSl").options[1].innerHTML=lg.get("IDS_ENCODE_HD1");//丰富
		//document.getElementById("CHNBMsSl").options[2].innerHTML=lg.get("IDS_ENCODE_CIF");//普通
		document.getElementById("NVR_CHNBMVideo").options[0].innerHTML=lg.get("IDS_CLOSE");//关闭
		document.getElementById("NVR_CHNBMVideo").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		NVR_frame_radio_1.innerHTML=lg.get("IDS_ENCODE_FPS");//帧率
		NVR_code_type_sub.innerHTML=lg.get("IDS_CODE_TYPE");
		NVR_bitrate_ctrl_sub.innerHTML=lg.get("IDS_BITRATE_CTRL");
		NVR_sub_video.innerHTML=lg.get("IDS_TAB_VIDEO");//帧率
		NVR_sub_stream_mode.innerHTML=lg.get("IDS_STREAMMODE");//码流模式
		if(gDvr.hybirdDVRFlag==1){
			document.getElementById("NVR_CHNSubStreamMode").options[0].innerHTML=lg.get("IDS_PRESET_2");//预置
			document.getElementById("NVR_CHNSubStreamMode").options[1].innerHTML=lg.get("IDS_USER_DEFINE_2");//自定义
		}else{
			document.getElementById("NVR_CHNSubStreamMode").options[0].innerHTML=lg.get("IDS_PRESET");//预置
			document.getElementById("NVR_CHNSubStreamMode").options[1].innerHTML=lg.get("IDS_USER_DEFINE");//自定义
		}
		NVR_record_tape_1.innerHTML=lg.get("IDS_ENCODE_AUDIO");//音频
		if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
			document.getElementById("NVR_CHNBMsa").options[0].innerHTML=lg.get("IDS_OTHER_OFF");//关闭
			document.getElementById("NVR_CHNBMsa").options[1].innerHTML=lg.get("IDS_OTHER_ON");//打开
		}else{
			document.getElementById("NVR_CHNBMsa").options[0].innerHTML=lg.get("IDS_CLOSE");//关闭
			document.getElementById("NVR_CHNBMsa").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		}
		NVR_subOk.value =lg.get("IDS_Copy");
		NVR_sub_selectID.innerHTML =lg.get("IDS_SEL_CHID");
		//bmck.value =lg.get("IDS_PATH_ALL");
		NVR_sub_SelectAll.innerHTML=lg.get("IDS_PATH_ALL");
		<!--sub_stream_set page  end -->
	}else if(pageName=="mobile_stream"){
		<!--chn_bm page  -->
		CHNMOBILEBMSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		CHNMOBILEBMRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		CHNMOBILEBMCP.innerHTML=lg.get("IDS_Copy");//Refresh
		csumob_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		
		
		if(gDvr.DevType==3 || gDvr.DevType==4){
			config_mobilestream.innerHTML = lg.get("IDS_LOW_DIF");
		}
		maintag_2.innerHTML = lg.get("IDS_HIGH_DIF");
		subtag_2.innerHTML = lg.get("IDS_SD_SDI"); 
		smalltag_2.innerHTML = lg.get("IDS_LOW_DIF"); 
        
		mobstream_1.innerHTML=lg.get("IDS_ENCODE_BITRATE");//码流
		
		f_b_l_mob.innerHTML=lg.get("IDS_ENCODE_RESOLUTION");//分辨率

		document.getElementById("CHNMOBBMVideo").options[0].innerHTML=lg.get("IDS_CLOSE");//关闭
		document.getElementById("CHNMOBBMVideo").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		frame_radio_mob.innerHTML=lg.get("IDS_ENCODE_FPS");//帧率
		mob_video.innerHTML=lg.get("IDS_TAB_VIDEO");//帧率
		record_mob_1.innerHTML=lg.get("IDS_ENCODE_AUDIO");//录音
		
		if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
			document.getElementById("CHNMOBBMsa").options[0].innerHTML=lg.get("IDS_OTHER_OFF");//关闭
			document.getElementById("CHNMOBBMsa").options[1].innerHTML=lg.get("IDS_OTHER_ON");//打开
		}else{
			document.getElementById("CHNMOBBMsa").options[0].innerHTML=lg.get("IDS_CLOSE");//关闭
			document.getElementById("CHNMOBBMsa").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		}
		
		mobOk.value =lg.get("IDS_Copy");
		mob_selectID.innerHTML =lg.get("IDS_SEL_CHID");
		//bmck.value =lg.get("IDS_PATH_ALL");
		mob_SelectAll.innerHTML=lg.get("IDS_PATH_ALL");
		<!--chn_bm page  end -->
	}else if(pageName=="mobile_stream_set"){
		<!--mobile_stream_set page  -->
		NVR_CHNMOBILEBMSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		NVR_CHNMOBILEBMRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		NVR_CHNMOBILEBMDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		NVR_CHNMOBILEBMCP.innerHTML=lg.get("IDS_Copy");//Refresh
		NVR_csumob_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		start_mob_sense.innerHTML=lg.get("IDS_OSD_ENABLE");//启用手机码流
		
		
		if(gDvr.DevType==3 || gDvr.DevType==4){
			NVR_config_mobilestream.innerHTML = lg.get("IDS_LOW_DIF");//MobileStream
		}
		//NVR_maintag_2.innerHTML = lg.get("IDS_HIGH_DIF");
		//NVR_subtag_2.innerHTML = lg.get("IDS_SD_SDI"); 
		//NVR_smalltag_2.innerHTML = lg.get("IDS_LOW_DIF"); 
        
		NVR_mobstream_1.innerHTML=lg.get("IDS_ENCODE_BITRATE");//Bitrate
		
		NVR_f_b_l_mob.innerHTML=lg.get("IDS_ENCODE_RESOLUTION");//Resolution

		document.getElementById("NVR_mobAudioSel").options[0].innerHTML=lg.get("IDS_CLOSE");//关闭
		document.getElementById("NVR_mobAudioSel").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		NVR_frame_radio_mob.innerHTML=lg.get("IDS_ENCODE_FPS");//FPS
		NVR_code_type_mobile.innerHTML=lg.get("IDS_CODE_TYPE");
		NVR_bitrate_ctrl_mobile.innerHTML=lg.get("IDS_BITRATE_CTRL");
		//NVR_mob_video.innerHTML=lg.get("IDS_TAB_VIDEO");//Video
		NVR_mob_stream_mode.innerHTML=lg.get("IDS_STREAMMODE");//Bitrate Mode
		if(gDvr.hybirdDVRFlag==1){
			document.getElementById("NVR_CHNMobStreamMode").options[0].innerHTML=lg.get("IDS_PRESET_2");//预置
			document.getElementById("NVR_CHNMobStreamMode").options[1].innerHTML=lg.get("IDS_USER_DEFINE_2");//自定义
		}else{
			document.getElementById("NVR_CHNMobStreamMode").options[0].innerHTML=lg.get("IDS_PRESET");//预置
			document.getElementById("NVR_CHNMobStreamMode").options[1].innerHTML=lg.get("IDS_USER_DEFINE");//自定义
		}
		NVR_record_mob_1.innerHTML=lg.get("IDS_ENCODE_AUDIO");//Audio
		
		//if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
			//document.getElementById("NVR_CHNMOBBMsa").options[0].innerHTML=lg.get("IDS_OTHER_OFF");//关闭
			//document.getElementById("NVR_CHNMOBBMsa").options[1].innerHTML=lg.get("IDS_OTHER_ON");//打开
		//}else{
			//document.getElementById("NVR_CHNMOBBMsa").options[0].innerHTML=lg.get("IDS_CLOSE");//关闭
			//document.getElementById("NVR_CHNMOBBMsa").options[1].innerHTML=lg.get("IDS_OPEN");//打开
		//}
		
		NVR_mobOk.value =lg.get("IDS_Copy");//Copy
		NVR_mob_selectID.innerHTML =lg.get("IDS_SEL_CHID");//请选择需要复制的通道
		//bmck.value =lg.get("IDS_PATH_ALL");
		NVR_mob_SelectAll.innerHTML=lg.get("IDS_PATH_ALL");//全选
		<!--mobile_stream_set page  end -->
	}else if(pageName=="chn_osd"){
		<!--chn_osd page  -->
		ChnOSDSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		ChnOSDRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		ChnOSDCP.innerHTML=lg.get("IDS_Copy");//Copy
		osd_config.innerHTML=lg.get("IDS_OSD_INFO");//osd
		local_time.innerHTML=lg.get("IDS_OSD_PRE");//现场时间
		document.getElementById("ChnOSDPreviewTimeSet").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");//关闭
		document.getElementById("ChnOSDPreviewTimeSet").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");//打开
		record_time.innerHTML=lg.get("IDS_OSD_REC");//录像时间
		document.getElementById("ChnOSDRecordTimeSet").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");//关闭
		document.getElementById("ChnOSDRecordTimeSet").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");//打开
		cod_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		channel_name.innerHTML=lg.get("IDS_OSD_NAME");//通道名称
		pre_OSD.innerHTML=lg.get("IDS_OSD_CHPRE");//预览OSD
		
		//flicker_ctrl.innerHTML=lg.get("IDS_FLICKERCTRL");//闪烁控制
		//document.getElementById("ChnOSDFlickerCtrl").options[0].innerHTML=lg.get("IDS_FLICKERCTRL_50");
		//document.getElementById("ChnOSDFlickerCtrl").options[1].innerHTML=lg.get("IDS_FLICKERCTRL_60");
		
		switch(lgCls.version){
			/*case "URMET":{
				document.getElementById("ChnOSDPreview").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");//打开
				document.getElementById("ChnOSDPreview").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");//关闭
				break;
			}*/
			default:{
				document.getElementById("ChnOSDPreview").options[1].innerHTML=lg.get("IDS_OSD_DISABLE");//打开
				document.getElementById("ChnOSDPreview").options[0].innerHTML=lg.get("IDS_OSD_ENABLE");//关闭
				break;
			}
		}
		cod_location.innerHTML=lg.get("IDS_OSD_POS");//位置
		document.getElementById("ChnOSDPosition").options[0].innerHTML=lg.get("IDS_LEFTUP");//左上
		document.getElementById("ChnOSDPosition").options[1].innerHTML=lg.get("IDS_LEFTDOWN");//左下
		document.getElementById("ChnOSDPosition").options[2].innerHTML=lg.get("IDS_RIGHTUP");//右上
		document.getElementById("ChnOSDPosition").options[3].innerHTML=lg.get("IDS_RIGHTDOWN");//右下
		document.getElementById("ChnOSDPosition").options[4].innerHTML=lg.get("IDS_OVERWRITE_CLOSE");//关闭
		osdSelectCopy.innerHTML=lg.get("IDS_SEL_CHID");
		osdOk.value=lg.get("IDS_Copy");
		osdSeletedAll.innerHTML=lg.get("IDS_PATH_ALL"); 
		<!--chn_osd page  end -->
	}else if(pageName=="chn_live"){
		<!--chn_live page  -->
		NVR_ChnOSDSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		NVR_ChnOSDRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		NVR_ChnOSDCP.innerHTML=lg.get("IDS_Copy");//Copy
		NVR_osd_config.innerHTML=lg.get("IDS_LIVE_PAGE");//osd
		NVR_show_name.innerHTML=lg.get("IDS_SHOWNAME");//显示名称
		document.getElementById("NVR_ChnOSDShowName").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");//关闭
		document.getElementById("NVR_ChnOSDShowName").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");//打开
		document.getElementById("NVROSd_RecTimeFlag").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");//关闭
		document.getElementById("NVROSd_RecTimeFlag").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");//打开
		
		NVR_show_time.innerHTML=lg.get("IDS_SHOWTIME");//显示时间
		document.getElementById("NVR_ChnOSDShowTime").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");//关闭
		document.getElementById("NVR_ChnOSDShowTime").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");//打开
		NVR_cod_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		NVR_date_format.innerHTML=lg.get("IDS_DST_DATEMODE");//日期格式
		document.getElementById("NVR_ChnOSDDateFormat").options[0].innerHTML=lg.get("IDS_DST_TIMEMODE01");//月/日/年
		document.getElementById("NVR_ChnOSDDateFormat").options[1].innerHTML=lg.get("IDS_DST_TIMEMODE02");//年/月/日
		document.getElementById("NVR_ChnOSDDateFormat").options[2].innerHTML=lg.get("IDS_DST_TIMEMODE03");//日/月/年
		NVR_time_format.innerHTML=lg.get("IDS_DST_TIMEMODE");//时间格式
		document.getElementById("NVR_ChnOSDTimeFormat").options[0].innerHTML=lg.get("IDS_DST_DATEMODE01");//24小时
		document.getElementById("NVR_ChnOSDTimeFormat").options[1].innerHTML=lg.get("IDS_DST_DATEMODE02");//12小时
		if(gDvr.hybirdDVRFlag){
			NVR_channel_name.innerHTML=lg.get("IDS_ANALOG_NAME");//Channel Name
			NVROSd_RecTimeFlag_L.innerHTML=lg.get("IDS_ANALOG_RECTIME");//Record Time
		}else{
			NVR_channel_name.innerHTML=lg.get("IDS_OSD_NAME");//Name
		}
		//NVR_osd_position.innerHTML=lg.get("IDS_DST_POSITIONSET");
		//NVR_OSDPositionSetBtn.value = lg.get("IDS_SETUP"); 
		pre_OSD.innerHTML=lg.get("IDS_OSD_CHPRE");//预览OSD
		
		flicker_ctrl.innerHTML=lg.get("IDS_REFRESH_RATE");//闪烁控制
		document.getElementById("ChnOSDFlickerCtrl").options[0].innerHTML=lg.get("IDS_FLICKERCTRL_50");
		document.getElementById("ChnOSDFlickerCtrl").options[1].innerHTML=lg.get("IDS_FLICKERCTRL_60");
		
		//switch(lgCls.version){
			//case "URMET":{
				//document.getElementById("ChnOSDPreview").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");//打开
				//document.getElementById("ChnOSDPreview").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");//关闭
			//	break;
	//		}
			//default:{
				document.getElementById("ChnOSDPreview").options[1].innerHTML=lg.get("IDS_OSD_DISABLE");//打开
				document.getElementById("ChnOSDPreview").options[0].innerHTML=lg.get("IDS_OSD_ENABLE");//关闭
	//			break;
			//}
	//	}
		//cod_location.innerHTML=lg.get("IDS_OSD_POS");//位置
		//document.getElementById("ChnOSDPosition").options[0].innerHTML=lg.get("IDS_LEFTUP");//左上
		//document.getElementById("ChnOSDPosition").options[1].innerHTML=lg.get("IDS_LEFTDOWN");//左下
		//document.getElementById("ChnOSDPosition").options[2].innerHTML=lg.get("IDS_RIGHTUP");//右上
		//document.getElementById("ChnOSDPosition").options[3].innerHTML=lg.get("IDS_RIGHTDOWN");//右下
		//document.getElementById("ChnOSDPosition").options[4].innerHTML=lg.get("IDS_OVERWRITE_CLOSE");//关闭
		NVR_osdSelectCopy.innerHTML=lg.get("IDS_SEL_CHID");
		NVR_osdOk.value=lg.get("IDS_Copy");
		NVR_osdSeletedAll.innerHTML=lg.get("IDS_PATH_ALL"); 
		<!--chn_live page  end -->
	}else if(pageName=="Img_Ctrl"){
		<!--Img_Ctrl page  -->
		ChncamSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		ChncamRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		ChncamDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		cam_config.innerHTML=lg.get("IDS_CAMERA_PARAM");//图像控制  //镜头参数
		cam_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		Cam_IRCutMode_L.innerHTML=lg.get("IDS_CUTMODE");//镜头模式
		Cam_IRCutSensitive_L.innerHTML=lg.get("IDS_SENSITIVE");//灵敏度
		Cam_IRCutDelay_L.innerHTML=lg.get("IDS_DELAY");//延迟
		Cam_Flip_R.innerHTML=lg.get("IDS_MIRRORFLIP");//镜头翻转
		Cam_Mirror_R.innerHTML=lg.get("IDS_ANGLEFLIP");//角度翻转
		Backlight_com.innerHTML=lg.get("IDS_ANGLEFLIP");//角度翻转
		NVR_imgctrlSelectCopy.innerHTML=lg.get("IDS_SEL_CHID");
		NVR_imgctrlSeletedAll.innerHTML=lg.get("IDS_PATH_ALL");
		NVR_imgctrlOk.value=lg.get("IDS_Copy");
		document.getElementById("Cam_IRCutMode").options[0].innerHTML=lg.get("IDS_CAM_AUTO");
		document.getElementById("Cam_IRCutMode").options[1].innerHTML=lg.get("IDS_CAM_DAY");
		document.getElementById("Cam_IRCutMode").options[2].innerHTML=lg.get("IDS_CAM_NIGHT");
		document.getElementById("Cam_IRCutSensitive").options[0].innerHTML=lg.get("IDS_CAM_HIGHT");
		document.getElementById("Cam_IRCutSensitive").options[1].innerHTML=lg.get("IDS_CAM_MIDD");
		document.getElementById("Cam_IRCutSensitive").options[2].innerHTML=lg.get("IDS_CAM_LOW");
		
		Backlight_com.innerHTML = lg.get("IDS_BLIGHT_COM");	
		SDno_reduct.innerHTML = lg.get("IDS_3D_REDUCT");
		Digital_dynamic.innerHTML = lg.get("IDS_DIG_DYN");
		Gain_control.innerHTML = lg.get("IDS_GAIN_CON");
		White_balance.innerHTML = lg.get("IDS_WIHTE_BLAN");
		shutter.innerHTML = lg.get("IDS_SHUTTER");	
		give_lvl.innerHTML = lg.get("IDS_LIGHT_LVL");
		reduct_value.innerHTML = lg.get("IDS_REDUCT_V");
		wide_value.innerHTML = lg.get("IDS_REDUCT_V");
		red_value.innerHTML = lg.get("IDS_RED_V");
		green_value.innerHTML = lg.get("IDS_GREEN_V");
		black_value.innerHTML = lg.get("IDS_BLCAK_V");	
		shutter_value.innerHTML = lg.get("IDS_EXP_TIME");
		Defog_Mode.innerHTML = lg.get("IDS_DEFOG_MODE");	
		level_value.innerHTML = lg.get("IDS_3GLEVEL");
		Cam_Trad_R.innerHTML = lg.get("IDS_ANGLE_ROTATION");
		    
		document.getElementById("Cam_BackLightMode").options[0] = new Option(lg.get("IDS_DISABLE"), "0");
		document.getElementById("Cam_BackLightMode").options[1] = new Option(lg.get("IDS_ENABLE"), "1");
		
		document.getElementById("Cam_BackLightLevel").options[0] = new Option(lg.get("IDS_CAM_LOW"), "0");
		if(gDvr.hybirdDVRFlag==1){
			document.getElementById("Cam_BackLightLevel").options[1] = new Option(lg.get("IDS_CAM_MIDD2"), "1");
			document.getElementById("Cam_BackLightLevel").options[2] = new Option(lg.get("IDS_CAM_HIGHT2"), "2");
		}else{
			document.getElementById("Cam_BackLightLevel").options[1] = new Option(lg.get("IDS_CAM_MIDD"), "1");
			document.getElementById("Cam_BackLightLevel").options[2] = new Option(lg.get("IDS_CAM_HIGHT"), "2");
		}
    		
    	document.getElementById("Cam_R3dnrMode").options[0] = new Option(lg.get("IDS_DISABLE"), "0");
		document.getElementById("Cam_R3dnrMode").options[1] = new Option(lg.get("IDS_OVERWRITE_AUTO"), "1");
		document.getElementById("Cam_R3dnrMode").options[2] = new Option(lg.get("IDS_MANUAL"), "2");
		    
		document.getElementById("Cam_DwdrMode").options[0] = new Option(lg.get("IDS_DISABLE"), "0");
		document.getElementById("Cam_DwdrMode").options[1] = new Option(lg.get("IDS_ENABLE"), "1");
		    
		document.getElementById("Cam_GainControlMode").options[0] = new Option(lg.get("IDS_OFF"), "0");
		document.getElementById("Cam_GainControlMode").options[1] = new Option(lg.get("IDS_CAM_LOW"), "1");
		if(gDvr.hybirdDVRFlag==1){
			document.getElementById("Cam_GainControlMode").options[2] = new Option(lg.get("IDS_CAM_MIDD2"), "2");
			document.getElementById("Cam_GainControlMode").options[3] = new Option(lg.get("IDS_CAM_HIGHT2"), "3");
		}else{
			document.getElementById("Cam_GainControlMode").options[2] = new Option(lg.get("IDS_CAM_MIDD"), "2");
			document.getElementById("Cam_GainControlMode").options[3] = new Option(lg.get("IDS_CAM_HIGHT"), "3");
		}
		    
		document.getElementById("Cam_WBMode").options[0] = new Option(lg.get("IDS_OVERWRITE_AUTO"), "0");
		document.getElementById("Cam_WBMode").options[1] = new Option(lg.get("IDS_MANUAL"), "1");
		document.getElementById("Cam_WBMode").options[2] = new Option(lg.get("IDS_INDOOR"), "2");
		    
		document.getElementById("Cam_ShutterMode").options[0] = new Option(lg.get("IDS_OVERWRITE_AUTO"), "0");
		document.getElementById("Cam_ShutterMode").options[1] = new Option(lg.get("IDS_MANUAL"), "1");	
		
		document.getElementById("Cam_DefogMode").options[0] = new Option(lg.get("IDS_DISABLE"), "0");
		document.getElementById("Cam_DefogMode").options[1] = new Option(lg.get("IDS_OVERWRITE_AUTO"), "1");
		document.getElementById("Cam_DefogMode").options[2] = new Option(lg.get("IDS_MANUAL"), "2");
		
		<!--Img_Ctrl page  end-->
	}else if(pageName=="chn_sp"){
		<!--chn_sp page  -->
		ChnSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		ChnspRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		ChnspCP.innerHTML=lg.get("IDS_Copy");//Copy
		video_keep_out.innerHTML=lg.get("IDS_SHELTER_PARAM");//视频遮挡
		csp_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		start_video_keep_out.innerHTML=lg.get("IDS_SHELTER_ENABLE");//启用视频遮挡
		ClearShelter.value=lg.get("IDS_MOTION_DELETE");
		//document.getElementById("ClearShelter").innerHTML=lg.get("IDS_MOTION_DELETE"); //清除
		sp_selectID.innerHTML=lg.get("IDS_SEL_CHID");
		spOk.value=lg.get("IDS_Copy");
		sp_selectedAll.innerHTML=lg.get("IDS_PATH_ALL");
	}else if(pageName=="chn_yt"){
		<!--chn_yt page  -->
		ChnPTZSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		ChnPTZRF.innerHTML=lg.get("IDS_REFRESH");//Refresh
		ChnPTZCP.innerHTML=lg.get("IDS_Copy");
		cyt_cloud_config.innerHTML=lg.get("IDS_PTZ_PARAM");//云台配置
		cyt_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		cyt_signal_type.innerHTML=lg.get("IDS_SIGNAL_TYPE");// 信号类型
		cyt_agreement_type.innerHTML=lg.get("IDS_PTZ_PROTOCOL");//协议类型
		baud_ratio_1.innerHTML=lg.get("IDS_PTZ_BAUDRATE");//波特率
		document.getElementById("YTProtocol").options[0].innerHTML="Pelco-D";//lg.get("");//Pelco_D
		document.getElementById("YTProtocol").options[1].innerHTML="Pelco-P";//lg.get("");//Pelco_P
		
		document.getElementById("YTSignal").options[0].innerHTML=lg.get("IDS_ANALOG");//模拟
		document.getElementById("YTSignal").options[1].innerHTML=lg.get("IDS_DIGITAL");//数字
		
		
		document.getElementById("YTBaudrate").options[0].innerHTML="1200";//lg.get("");//1200
		document.getElementById("YTBaudrate").options[1].innerHTML="2400";//lg.get("");//2400
		document.getElementById("YTBaudrate").options[2].innerHTML="4800";//lg.get("");//4800
		document.getElementById("YTBaudrate").options[3].innerHTML="9600";//lg.get("");//9600
		chn_data_bit.innerHTML=lg.get("IDS_PTZ_DATABIT");//数据位
		temp=lg.get("IDS_SERIAL_BIT");
		document.getElementById("YTDataBit").options[0].innerHTML="8";//8位
		document.getElementById("YTDataBit").options[1].innerHTML="7";//7位
		document.getElementById("YTDataBit").options[2].innerHTML="6";//6位
		document.getElementById("YTDataBit").options[3].innerHTML="5";//5位
		cyt_stop_bit.innerHTML=lg.get("IDS_PTZ_STOPBIT");//停止位
		document.getElementById("YTStopBit").options[0].innerHTML="1";//1位
		document.getElementById("YTStopBit").options[1].innerHTML="2";//2位
		cyt_check_1.innerHTML=lg.get("IDS_PTZ_CHECK");//校验
		document.getElementById("YTCheck").options[0].innerHTML=lg.get("IDS_CHECKBIT_NONE");//无校验
		document.getElementById("YTCheck").options[1].innerHTML=lg.get("IDS_CHECKBIT_ODD");//奇校验
		document.getElementById("YTCheck").options[2].innerHTML=lg.get("IDS_CHECKBIT_EVEN");//偶校验
		document.getElementById("YTCheck").options[3].innerHTML=lg.get("IDS_CHECKBIT_MARK");//Mark校验
		document.getElementById("YTCheck").options[4].innerHTML=lg.get("IDS_CHECKBIT_SPACE");//Space校验
		Cruise.innerHTML=lg.get("IDS_TIP_CRUISE");
		document.getElementById("YTCruise").options[0].innerHTML=lg.get("IDS_CLOSE");
		document.getElementById("YTCruise").options[1].innerHTML=lg.get("IDS_OPEN");
		address.innerHTML=lg.get("IDS_ADDRESS");//地址
		ytselectCopy.innerHTML=lg.get("IDS_SEL_CHID");
		ytOk.value=lg.get("IDS_Copy");
		ytselectedAll.innerHTML=lg.get("IDS_PATH_ALL");
		<!--chn_yt page  end -->
	}else if(pageName=="net_base"){
		<!--net_base page  -->
		NBRf.innerHTML=lg.get("IDS_REFRESH");//Refresh 
		NBDf.innerHTML=lg.get("IDS_DEFAULT");//Default 
		NBSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		if(lgCls.version == "OWL")
		{
			nbe_base_config.innerHTML=lg.get("IDS_NET_MAIN");//基本配置
		}else{
			nbe_base_config.innerHTML=lg.get("IDS_NET_PARAM");//基本配置
		}
		online_mode.innerHTML=lg.get("IDS_ONLINE_MODE");//联网方式
		document.getElementById("NBNetworkMode").options[0].innerHTML=lg.get("IDS_NET_MODE01");//DHCP
		document.getElementById("NBNetworkMode").options[1].innerHTML=lg.get("IDS_NET_MODE02");//PPPoE
		document.getElementById("NBNetworkMode").options[2].innerHTML=lg.get("IDS_NET_MODE03");//Static
		pnp.innerHTML=lg.get("IDS_NET_UPNP");//PNP
		document.getElementById("NBUseUPNP").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("NBUseUPNP").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		
		name_encryption.innerHTML=lg.get("IDS_ENCRYPTION");//加密
		document.getElementById("NBUseEncryption").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("NBUseEncryption").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		
		
		ip_address.innerHTML=lg.get("IDS_NET_IPADDR");//ip地址
		subnet_mask.innerHTML=lg.get("IDS_NET_MASK");//子网掩码
		nbe_default_gateway.innerHTML=lg.get("IDS_NET_GATEWAY");//默认网关
		first_DNS.innerHTML=lg.get("IDS_FIRST_DNS");//首选DNS
		standy_DNS.innerHTML=lg.get("IDS_SECOND_DNS");//备用DNS
		nbe_media_port.innerHTML=lg.get("IDS_NEW_MEDIAPORT");//媒体端口
		nbe_web_port.innerHTML=lg.get("IDS_NET_WEBPORT");//web端口
		nbe_Mobile_port.innerHTML=lg.get("IDS_NET_PORT_MOB");//手机端口
		nbe_IpKB_port.innerHTML=lg.get("IDS_IPKB_PORT");//IP键盘端口
		
		nbe_Apn.innerHTML=lg.get("IDS_APN");
		nbe_DialCode.innerHTML=lg.get("IDS_DIALCODE");
		nbe_WirelessUser.innerHTML=lg.get("IDS_LOGIN_NAME");
		nbe_WirelessPwd.innerHTML=lg.get("IDS_SERVERINFO_PSW");
		
		npe_usename.innerHTML=lg.get("IDS_LOGIN_NAME");//用户名
		npe_passwd.innerHTML=lg.get("IDS_SERVERINFO_PSW");//密　码
		<!--net_base page  end -->
	}else if(pageName=="net_ddns"){
		<!--net_ddns page  -->
		DDNSSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		DDNSRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		DDNSDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		ddns_config.innerHTML=lg.get("IDS_DDNS");//ddns
		nd_DDNS_startup.innerHTML=lg.get("IDS_DDNS_ENABLE");//启用DDNS
		nds_server_address.innerHTML=lg.get("IDS_DDNS_ADDRESS");//服务器地址
		host_name.innerHTML=lg.get("IDS_DDNS_HOSTNAME");//主机名称
		service_id.innerHTML=lg.get("IDS_SERVICEID");//服务ID
		nd_usename.innerHTML=lg.get("IDS_LOGIN_NAME");//用户名
		nd_passwd.innerHTML=lg.get("IDS_SERVERINFO_PSW");//密码
		DDNSTest.value=lg.get("IDS_DDNSTEST");
		//document.getElementById("DDNSTest").innerHTML=lg.get("IDS_DDNSTEST");//DDNS 测试
		document.getElementById("DDNSUseDDNS").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("DDNSUseDDNS").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		DDNSGetID.value=lg.get("IDS_DDNSGETID");
		<!--net_ddns page  end -->
	}else if(pageName=="net_email"){
		<!--net_email page  -->
		EmailSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		EmailRf.innerHTML=lg.get("IDS_REFRESH");//Refresh	
		EmailDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		email_config.innerHTML=lg.get("IDS_EMAIL_INFO"); //email
		EmailSetup.value=lg.get("IDS_EMAIL_SCHEDULE");
		Email_startup.innerHTML=lg.get("IDS_EMAIL_ENABLE");//启用Email
		SMTP_server.innerHTML=lg.get("IDS_EMAIL_SERVER");//SMTP服务器
		addresser_address.innerHTML=lg.get("IDS_EMAIL_SENDADDRESS");//发件人地址
		addresser_passwd.innerHTML=lg.get("IDS_EMAIL_SENDPSW");//发件人密码
		addressee_adress.innerHTML=lg.get("IDS_EMAIL_RECEIVEADDRESS");//收件人地址
		port_num.innerHTML=lg.get("IDS_EMAIL_PORT");//端口号
		SSL_switch.innerHTML=lg.get("IDS_EMAIL_SSL");//SSL开关
		EmailTest.value=lg.get("IDS_EMAILTEST");
		//document.getElementById("EmailTest").innerHTML=lg.get("IDS_EMAILTEST");//Email 测试
		defaultoff.innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("EmSSLSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("EmSSLSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		document.getElementById("EmEmailSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("EmEmailSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		document.getElementById("EmEmailSwitch").options[2].innerHTML=lg.get("IDS_DEFAULT");//Lorex专用 Default
		sendEmail_alternate.innerHTML=lg.get("IDS_EMAIL_TIME");//邮件发送间隔
		temp=lg.get("IDS_MINUTE");
		document.getElementById("Emintervaltime").options[0].innerHTML="1"+temp;//1分钟
		document.getElementById("Emintervaltime").options[1].innerHTML="3"+temp;//3分钟
		document.getElementById("Emintervaltime").options[2].innerHTML="5"+temp;//5分钟
		document.getElementById("Emintervaltime").options[3].innerHTML="10"+temp;//10分钟
		<!--net_email page  end -->
	}else if(pageName=="email_jh"){
		<!--email plan -->
		emailjh_sch.innerHTML=lg.get("IDS_EMAIL_INFO");
		EmailplanRf.innerHTML=lg.get("IDS_REFRESH");
		EmailplanSave.innerHTML=lg.get("IDS_CRUISE_SAVE");
		EmailplanExit.innerHTML=lg.get("IDS_EXIT");
		emailjh_channel.innerHTML=lg.get("IDS_MOTION_CH");
		emailjh_qx.innerHTML=lg.get("IDS_DST_DSTMODE01");
		document.getElementById("EMAILORDQX").options[0].innerHTML = lg.get("IDS_WEEKDAY_01");
		document.getElementById("EMAILORDQX").options[1].innerHTML = lg.get("IDS_WEEKDAY_02");
		document.getElementById("EMAILORDQX").options[2].innerHTML = lg.get("IDS_WEEKDAY_03");
		document.getElementById("EMAILORDQX").options[3].innerHTML = lg.get("IDS_WEEKDAY_04");
		document.getElementById("EMAILORDQX").options[4].innerHTML = lg.get("IDS_WEEKDAY_05");
		document.getElementById("EMAILORDQX").options[5].innerHTML = lg.get("IDS_WEEKDAY_06");
		document.getElementById("EMAILORDQX").options[6].innerHTML = lg.get("IDS_WEEKDAY_07");
		email_motion.innerHTML=lg.get("IDS_DEFAULT_MOTION");
		email_alarm.innerHTML=lg.get("IDS_RECPLAN_TYPE03");
		email_event.innerHTML=lg.get("IDS_ABNORMITY_ALARM");
		email_norecord.innerHTML=lg.get("IDS_NOSEND");
		email_copyDay.innerHTML=lg.get("IDS_RECPLAN_COPYDAY");
		document.getElementById("YJJH_CPQXQ").options[0].innerHTML = lg.get("IDS_WEEKDAY_01");
		document.getElementById("YJJH_CPQXQ").options[1].innerHTML = lg.get("IDS_WEEKDAY_02");
		document.getElementById("YJJH_CPQXQ").options[2].innerHTML = lg.get("IDS_WEEKDAY_03");
		document.getElementById("YJJH_CPQXQ").options[3].innerHTML = lg.get("IDS_WEEKDAY_04");
		document.getElementById("YJJH_CPQXQ").options[4].innerHTML = lg.get("IDS_WEEKDAY_05");
		document.getElementById("YJJH_CPQXQ").options[5].innerHTML = lg.get("IDS_WEEKDAY_06");
		document.getElementById("YJJH_CPQXQ").options[6].innerHTML = lg.get("IDS_WEEKDAY_07");
		EMAIL_COPY_WEEK_TO.innerHTML=lg.get("IDS_COPY_TO");
		document.getElementById("YJJH_CPHXQ").options[0].innerHTML = lg.get("IDS_PATH_ALL");
		document.getElementById("YJJH_CPHXQ").options[1].innerHTML = lg.get("IDS_WEEKDAY_01");
		document.getElementById("YJJH_CPHXQ").options[2].innerHTML = lg.get("IDS_WEEKDAY_02");
		document.getElementById("YJJH_CPHXQ").options[3].innerHTML = lg.get("IDS_WEEKDAY_03");
		document.getElementById("YJJH_CPHXQ").options[4].innerHTML = lg.get("IDS_WEEKDAY_04");
		document.getElementById("YJJH_CPHXQ").options[5].innerHTML = lg.get("IDS_WEEKDAY_05");
		document.getElementById("YJJH_CPHXQ").options[6].innerHTML = lg.get("IDS_WEEKDAY_06");
		document.getElementById("YJJH_CPHXQ").options[7].innerHTML = lg.get("IDS_WEEKDAY_07");
		//EMAILJH_CPXQQD.value=lg.get("IDS_Copy");
		email_copyCh.innerHTML=lg.get("IDS_REC_COPYCH");
		EMAIL_COPY_CH_TO.innerHTML=lg.get("IDS_COPY_TO");
		YJJH_CPXQQD.value=lg.get("IDS_Copy");
		YJJH_CPTDQD.value=lg.get("IDS_Copy");
		<!-- email plan end-->
	}else if(pageName=="record_jh"){
		//ss_TimeMode.innerHTML=lg.get("IDS_RECORD_TYPE");//录像类型
		
		LXJH_CPTDQD.value=lg.get("IDS_Copy");
		LXJH_CPXQQD.value=lg.get("IDS_Copy");
		
		document.getElementById("LXJH_CPHXQ").options[0].innerHTML=lg.get("IDS_PATH_ALL");//sun
		document.getElementById("LXJH_CPHXQ").options[1].innerHTML=lg.get("IDS_WEEKDAY_01");//sun
		document.getElementById("LXJH_CPHXQ").options[2].innerHTML=lg.get("IDS_WEEKDAY_02");//sun
		document.getElementById("LXJH_CPHXQ").options[3].innerHTML=lg.get("IDS_WEEKDAY_03");//sun
		document.getElementById("LXJH_CPHXQ").options[4].innerHTML=lg.get("IDS_WEEKDAY_04");//sun
		document.getElementById("LXJH_CPHXQ").options[5].innerHTML=lg.get("IDS_WEEKDAY_05");//sun
		document.getElementById("LXJH_CPHXQ").options[6].innerHTML=lg.get("IDS_WEEKDAY_06");//sun
		document.getElementById("LXJH_CPHXQ").options[7].innerHTML=lg.get("IDS_WEEKDAY_07");//sun
		
		if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
			rec_alarm.innerHTML="A-"+lg.get("IDS_RECPLAN_TYPE03");//Alarm
			rec_normal.innerHTML="N-"+lg.get("IDS_RECPLAN_TYPE02");//Normal
			rec_motion.innerHTML="M-"+lg.get("IDS_DEFAULT_MOTION");//Motion
			rec_norecord.innerHTML=lg.get("IDS_RECPLAN_TYPE01");//No Record
		}else{
			rec_alarm.innerHTML=lg.get("IDS_RECPLAN_TYPE03");//Alarm
			rec_normal.innerHTML=lg.get("IDS_RECPLAN_TYPE02");//Normal
			rec_motion.innerHTML=lg.get("IDS_DEFAULT_MOTION");//Motion
			rec_norecord.innerHTML=lg.get("IDS_RECPLAN_TYPE01");//No Record
		}
		
		rec_copyCh.innerHTML=lg.get("IDS_REC_COPYCH");
		rec_copyDay.innerHTML=lg.get("IDS_RECPLAN_COPYDAY");
		document.getElementById("LAB_CLEAL_ALL").innerHTML=lg.get("IDS_CLEANALL");
		
		COPY_WEEK_TO.innerHTML=lg.get("IDS_COPY_TO");
		COPY_CH_TO.innerHTML=lg.get("IDS_COPY_TO");
		
		if(gDvr.DevType == 3){
			rjh_sch.innerHTML=lg.get("IDS_REC_PLAN");//Schedule
			rjh_channel.innerHTML=lg.get("IDS_MOTION_CH");
			RecplanSave.innerHTML=lg.get("IDS_CRUISE_SAVE");
			RecplanRf.innerHTML=lg.get("IDS_REFRESH");
			RecplanDf.innerHTML=lg.get("IDS_DEFAULT");
			$("#rjh_qx").text(lg.get("IDS_DST_DSTMODE01"));
			//rjh_qx.text(lg.get("IDS_DST_DSTMODE01"));
			document.getElementById("RECORDQX").options[0].innerHTML = document.getElementById("LXJH_CPQXQ").options[0].innerHTML=lg.get("IDS_WEEKDAY_01");//sun
			document.getElementById("RECORDQX").options[1].innerHTML = document.getElementById("LXJH_CPQXQ").options[1].innerHTML=lg.get("IDS_WEEKDAY_02");//sun
			document.getElementById("RECORDQX").options[2].innerHTML = document.getElementById("LXJH_CPQXQ").options[2].innerHTML=lg.get("IDS_WEEKDAY_03");//sun
			document.getElementById("RECORDQX").options[3].innerHTML = document.getElementById("LXJH_CPQXQ").options[3].innerHTML=lg.get("IDS_WEEKDAY_04");//sun
			document.getElementById("RECORDQX").options[4].innerHTML = document.getElementById("LXJH_CPQXQ").options[4].innerHTML=lg.get("IDS_WEEKDAY_05");//sun
			document.getElementById("RECORDQX").options[5].innerHTML = document.getElementById("LXJH_CPQXQ").options[5].innerHTML=lg.get("IDS_WEEKDAY_06");//sun
			document.getElementById("RECORDQX").options[6].innerHTML = document.getElementById("LXJH_CPQXQ").options[6].innerHTML=lg.get("IDS_WEEKDAY_07");//sun
		}else{
			rjh_sch.innerHTML=lg.get("IDS_REC_PLAN");//Schedule
			RecplanSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
			RecplanRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
			RecplanDf.innerHTML=lg.get("IDS_DEFAULT");
			rjh_channel.innerHTML=lg.get("IDS_MOTION_CH");//Channel
			LXJH_CHNEXT.value=lg.get("IDS_NEXT");
			LXJH_WEEKNEXT.value=lg.get("IDS_NEXT");
			$("#rjh_qx").text(lg.get("IDS_DST_DSTMODE01"));
			document.getElementById("RECORDQX").options[0].innerHTML = document.getElementById("LXJH_CPQXQ").options[0].innerHTML=lg.get("IDS_WEEKDAY_01");//sun
			document.getElementById("RECORDQX").options[1].innerHTML = document.getElementById("LXJH_CPQXQ").options[1].innerHTML=lg.get("IDS_WEEKDAY_02");//sun
			document.getElementById("RECORDQX").options[2].innerHTML = document.getElementById("LXJH_CPQXQ").options[2].innerHTML=lg.get("IDS_WEEKDAY_03");//sun
			document.getElementById("RECORDQX").options[3].innerHTML = document.getElementById("LXJH_CPQXQ").options[3].innerHTML=lg.get("IDS_WEEKDAY_04");//sun
			document.getElementById("RECORDQX").options[4].innerHTML = document.getElementById("LXJH_CPQXQ").options[4].innerHTML=lg.get("IDS_WEEKDAY_05");//sun
			document.getElementById("RECORDQX").options[5].innerHTML = document.getElementById("LXJH_CPQXQ").options[5].innerHTML=lg.get("IDS_WEEKDAY_06");//sun
			document.getElementById("RECORDQX").options[6].innerHTML = document.getElementById("LXJH_CPQXQ").options[6].innerHTML=lg.get("IDS_WEEKDAY_07");//sun
		}
		smart_mode.innerHTML=lg.get("IDS_IPC_RECMODE");//rec mode
		document.getElementById("SMARTMODE").options[0].innerHTML=lg.get("IDS_RECTYPE_01");//normal
		document.getElementById("SMARTMODE").options[1].innerHTML=lg.get("IDS_IPC_RECSMART");//smart
		rec_norRes.innerHTML=lg.get("IDS_IPC_RECRESLUTION");
		rec_alamRes.innerHTML=lg.get("IDS_IPC_RECRESLUTION");   
	}else if(pageName=="record_pz"){
		<!--record_pz page  -->
	
		RECconfigSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		RECconfigRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		RECconfigDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		RECconfigCP.innerHTML=lg.get("IDS_Copy");//Copy
		record_config.innerHTML=lg.get("IDS_REC_PARAM");//录像参数
		record_mode.innerHTML=lg.get("IDS_RECCONFIG_MODE");//录像模式
		document.getElementById("RECRecordMode").options[0].innerHTML=lg.get("IDS_RECCONFIG_MODE01");//定时录像
		document.getElementById("RECRecordMode").options[1].innerHTML=lg.get("IDS_RECCONFIG_MODE02");//开机录像
		//document.getElementById("RECRecordMode").options[2].innerHTML=lg.get("IDS_RECCONFIG_MODE03");//手动录像
		record_pack_time.innerHTML=lg.get("IDS_RECCONFIG_PACKTIME");//录像打包时间
		temp=lg.get("IDS_MINUTE");
		if(lgCls.version == "GREATEK"){
			document.getElementById("RECPackTime").options[0].innerHTML="5"+temp;//5分钟
			document.getElementById("RECPackTime").options[1].innerHTML="10"+temp;//10分钟
			document.getElementById("RECPackTime").options[2].innerHTML="15"+temp;//15分钟
			document.getElementById("RECPackTime").options[3].innerHTML="30"+temp;//30分钟
		}else{
			document.getElementById("RECPackTime").options[0].innerHTML="15"+temp;//15分钟
			document.getElementById("RECPackTime").options[1].innerHTML="30"+temp;//30分钟
			document.getElementById("RECPackTime").options[2].innerHTML="45"+temp;//45分钟
			document.getElementById("RECPackTime").options[3].innerHTML="60"+temp;//60分钟
		}
		pre_record_time.innerHTML=lg.get("IDS_PRE_RECTIME");//录像开关
		temp=lg.get("IDS_SECOND");
		document.getElementById("RECPreRecordTime").options[0].innerHTML=lg.get("IDS_DISABLE");//0秒
		document.getElementById("RECPreRecordTime").options[1].innerHTML=lg.get("IDS_ENABLE");//10秒
		
		document.getElementById("ChnCloseOrOpen").options[0].innerHTML=lg.get("IDS_DISABLE");//0秒
        document.getElementById("ChnCloseOrOpen").options[1].innerHTML=lg.get("IDS_ENABLE");//0秒
		rpz_channel_num.innerHTML=lg.get("IDS_MOTION_CH");//通道号
		record_startup.innerHTML=lg.get("IDS_CHINFO_RECORD");//record
		
		record_stream_mode.innerHTML=lg.get("IDS_DST_STREAMMODE");
		document.getElementById("RecStreamMode").options[0].innerHTML=lg.get("IDS_MAINSTREAM");
		document.getElementById("RecStreamMode").options[1].innerHTML=lg.get("IDS_SUBSTREAM");
		
		pzSelectCopy.innerHTML=lg.get("IDS_SEL_CHID");
		pzOk.value=lg.get("IDS_Copy");
		pzSelectAll.innerHTML=lg.get("IDS_PATH_ALL");
	}else if(pageName=="sysinf_base"){
		<!--sysinf_base page  -->
		SysInfBaseRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		sf_base_config.innerHTML=lg.get("IDS_INFO");//基本配置
		equipment_type.innerHTML=lg.get("IDS_SERVERINFO_DEVTYPE");//设备类型
		equipment_DevID.innerHTML=lg.get("IDS_BASE_ID");//设备ID
		equipment_DevName.innerHTML=lg.get("IDS_BASE_DEVNAME");
		
		software_ver.innerHTML=lg.get("IDS_BASE_SOFTVER");//软件版本
		panel_model_HDDVer.innerHTML=lg.get("IDS_BASE_HARDVER");//硬件版本
		panel_model_control.innerHTML=lg.get("IDS_BASE_PANELVER");//控制面板型号
		info_IP.innerHTML=lg.get("IDS_NET_IPADDR");
		camera_mode.innerHTML=lg.get("IDS_BASE_TVSYSTEM");//摄像头制式
		Info_Media.innerHTML=lg.get("IDS_CLIENTPORT");
		Info_Web.innerHTML=lg.get("IDS_NET_WEBPORT");
		Info_Mobile.innerHTML=lg.get("IDS_NET_PORT_MOB");
		info_HDDCAPACITY.innerHTML=lg.get("IDS_HDDCAPACITY");
		info_DDNSNAME.innerHTML=lg.get("IDS_DDNSNAME");
		info_MAC.innerHTML=lg.get("IDS_BASE_MAC");
		<!--sysinf_base page  end -->
	}else if(pageName=="sysinf_hdd"){
		<!--sysinf_hdd page  -->
		SysInfoHddSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		SysInfoHddRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		SysInfoHddDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		if(gDvr.DevType == 4){
			hdd_message.innerHTML=lg.get("IDS_HDD_IPCINFO");//硬盘信息
		}else{
			hdd_message.innerHTML=lg.get("IDS_HDD_INFO");//硬盘信息
		}
		//hdd_message_list.innerHTML=lg.get("IDS_HARD_M_LIST");//硬盘信息列表
		serial_number_hdd.innerHTML=lg.get("IDS_HDDS_INDEX");//序号
		state.innerHTML=lg.get("IDS_STATE");//状态
		content_GB.innerHTML=lg.get("IDS_CONTENT_GB");//容量/剩余(GB)
		ramain_time.innerHTML=lg.get("IDS_REMAIN_TIME");//剩余可用时间
		shd_over.innerHTML=lg.get("IDS_OVERWRIETE");//Overwrite
		FormatTitle.innerHTML=lg.get("IDS_FORMAT_DISK");
		
		//document.getElementById("IPCbtn").innerHTML=lg.get("IDS_HDDFORMAT");
		//document.getElementById("NVRbtn").innerHTML=lg.get("IDS_HDDFORMAT");
		IPCbtn.value=lg.get("IDS_HDDFORMAT");
		NVRbtn.value=lg.get("IDS_HDDFORMAT");
		
		ipc_chid.innerHTML=lg.get("IDS_OSD_NAME");
		disk_no.innerHTML=lg.get("IDS_HDDS_INDEX");
		nvr_nodisk.innerHTML=lg.get("IDS_NO_HDD");
		//HddOverWrite
	}else if(pageName=="syspm_dst"){
		SysDstSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		SysDstRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		SysDstDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		sdt_base_config.innerHTML=lg.get("IDS_BASE_INFO");//dst set
		system_time.innerHTML=lg.get("IDS_DST_TIME");//系统时间
		//document.getElementById("synchronization_1").innerHTML=lg.get("IDS_IN_PHASE");//同步
		show_wizard.innerHTML=lg.get("IDS_DST_SHOWWIZARD");
		document.getElementById("SysStartShowWizard").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");
		document.getElementById("SysStartShowWizard").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");
		sys_date_format.innerHTML=lg.get("IDS_DST_DATEMODE");//时间格式
		document.getElementById("SysDstDateMode").options[0].innerHTML=lg.get("IDS_DST_TIMEMODE01");//月/日/年
		document.getElementById("SysDstDateMode").options[1].innerHTML=lg.get("IDS_DST_TIMEMODE02");//年/月/日
		document.getElementById("SysDstDateMode").options[2].innerHTML=lg.get("IDS_DST_TIMEMODE03");//日/月/年
		sys_time_format.innerHTML=lg.get("IDS_DST_TIMEMODE");//日期格式
		document.getElementById("SysDstTimeMode").options[0].innerHTML=lg.get("IDS_DST_DATEMODE01");//24小时
		document.getElementById("SysDstTimeMode").options[1].innerHTML=lg.get("IDS_DST_DATEMODE02");//12小时
		Dst.innerHTML=lg.get("IDS_DST_DST");
		daylight_saving_time.innerHTML=lg.get("IDS_DST_DSTMODE");//夏令时模式
		document.getElementById("SysDstMode").options[0].innerHTML=lg.get("IDS_DST_DSTMODE01");//周模式
		document.getElementById("SysDstMode").options[1].innerHTML=lg.get("IDS_DST_DSTMODE02");//日期模式
		py_zc_time_value.innerHTML=lg.get("IDS_DST_OFFSET");//偏移正常时间值
		document.getElementById("SysDstOffset").options[0].innerHTML=lg.get("IDS_DST_OFFSET01");//0-1小时
		document.getElementById("SysDstOffset").options[1].innerHTML=lg.get("IDS_DST_OFFSET02");//1-2小时
		starup_time.innerHTML=lg.get("IDS_DST_STARTWEEKDAY");//开始于
		document.getElementById("DstStartMonth").options[0].innerHTML=lg.get("IDS_DST_MONTH01");//1月
		document.getElementById("DstStartMonth").options[1].innerHTML=lg.get("IDS_DST_MONTH02");//2月
		document.getElementById("DstStartMonth").options[2].innerHTML=lg.get("IDS_DST_MONTH03");//3月
		document.getElementById("DstStartMonth").options[3].innerHTML=lg.get("IDS_DST_MONTH04");//4月
		document.getElementById("DstStartMonth").options[4].innerHTML=lg.get("IDS_DST_MONTH05");//5月
		document.getElementById("DstStartMonth").options[5].innerHTML=lg.get("IDS_DST_MONTH06");//6月
		document.getElementById("DstStartMonth").options[6].innerHTML=lg.get("IDS_DST_MONTH07");//7月
		document.getElementById("DstStartMonth").options[7].innerHTML=lg.get("IDS_DST_MONTH08");//8月
		document.getElementById("DstStartMonth").options[8].innerHTML=lg.get("IDS_DST_MONTH09");//9月
		document.getElementById("DstStartMonth").options[9].innerHTML=lg.get("IDS_DST_MONTH10");//10月
		document.getElementById("DstStartMonth").options[10].innerHTML=lg.get("IDS_DST_MONTH11");//11月
		document.getElementById("DstStartMonth").options[11].innerHTML=lg.get("IDS_DST_MONTH12");//12月
		document.getElementById("DstStartWeek").options[0].innerHTML=lg.get("IDS_DST_WEEK01");//第一周
		document.getElementById("DstStartWeek").options[1].innerHTML=lg.get("IDS_DST_WEEK02");//第二周
		document.getElementById("DstStartWeek").options[2].innerHTML=lg.get("IDS_DST_WEEK03");//第三周
		document.getElementById("DstStartWeek").options[3].innerHTML=lg.get("IDS_DST_WEEK04");//第四周
		document.getElementById("DstStartWeek").options[4].innerHTML=lg.get("IDS_DST_WEEK05");//第五周
		document.getElementById("DstStartWeekDay").options[0].innerHTML=lg.get("IDS_WEEKDAY_01");//星期日
		document.getElementById("DstStartWeekDay").options[1].innerHTML=lg.get("IDS_WEEKDAY_02");//星期一
		document.getElementById("DstStartWeekDay").options[2].innerHTML=lg.get("IDS_WEEKDAY_03");//星期二
		document.getElementById("DstStartWeekDay").options[3].innerHTML=lg.get("IDS_WEEKDAY_04");//星期三
		document.getElementById("DstStartWeekDay").options[4].innerHTML=lg.get("IDS_WEEKDAY_05");//星期四
		document.getElementById("DstStartWeekDay").options[5].innerHTML=lg.get("IDS_WEEKDAY_06");//星期五
		document.getElementById("DstStartWeekDay").options[6].innerHTML=lg.get("IDS_WEEKDAY_07");//星期六
		sdt_stop_time.innerHTML=lg.get("IDS_DST_ENDWEEKDAY");//结束于
		document.getElementById("DstEndMonth").options[0].innerHTML=lg.get("IDS_DST_MONTH01");//1月
		document.getElementById("DstEndMonth").options[1].innerHTML=lg.get("IDS_DST_MONTH02");//2月
		document.getElementById("DstEndMonth").options[2].innerHTML=lg.get("IDS_DST_MONTH03");//3月
		document.getElementById("DstEndMonth").options[3].innerHTML=lg.get("IDS_DST_MONTH04");//4月
		document.getElementById("DstEndMonth").options[4].innerHTML=lg.get("IDS_DST_MONTH05");//5月
		document.getElementById("DstEndMonth").options[5].innerHTML=lg.get("IDS_DST_MONTH06");//6月
		document.getElementById("DstEndMonth").options[6].innerHTML=lg.get("IDS_DST_MONTH07");//7月
		document.getElementById("DstEndMonth").options[7].innerHTML=lg.get("IDS_DST_MONTH08");//8月
		document.getElementById("DstEndMonth").options[8].innerHTML=lg.get("IDS_DST_MONTH09");//9月
		document.getElementById("DstEndMonth").options[9].innerHTML=lg.get("IDS_DST_MONTH10");//10月
		document.getElementById("DstEndMonth").options[10].innerHTML=lg.get("IDS_DST_MONTH11");//11月
		document.getElementById("DstEndMonth").options[11].innerHTML=lg.get("IDS_DST_MONTH12");//12月
		document.getElementById("DstEndWeek").options[0].innerHTML=lg.get("IDS_DST_WEEK01");//第一周
		document.getElementById("DstEndWeek").options[1].innerHTML=lg.get("IDS_DST_WEEK02");//第二周
		document.getElementById("DstEndWeek").options[2].innerHTML=lg.get("IDS_DST_WEEK03");//第三周
		document.getElementById("DstEndWeek").options[3].innerHTML=lg.get("IDS_DST_WEEK04");//第四周
		document.getElementById("DstEndWeek").options[4].innerHTML=lg.get("IDS_DST_WEEK05");//第五周
		document.getElementById("DstEndWeekDay").options[0].innerHTML=lg.get("IDS_WEEKDAY_01");//星期日
		document.getElementById("DstEndWeekDay").options[1].innerHTML=lg.get("IDS_WEEKDAY_02");//星期一
		document.getElementById("DstEndWeekDay").options[2].innerHTML=lg.get("IDS_WEEKDAY_03");//星期二
		document.getElementById("DstEndWeekDay").options[3].innerHTML=lg.get("IDS_WEEKDAY_04");//星期三
		document.getElementById("DstEndWeekDay").options[4].innerHTML=lg.get("IDS_WEEKDAY_05");//星期四
		document.getElementById("DstEndWeekDay").options[5].innerHTML=lg.get("IDS_WEEKDAY_06");//星期五
		document.getElementById("DstEndWeekDay").options[6].innerHTML=lg.get("IDS_WEEKDAY_07");//星期六
		startup_time_1.innerHTML=lg.get("IDS_DST_BEGINTIME");//起始时间
		End_time_1.innerHTML=lg.get("IDS_DST_ENDTIME");//结束时间
		
		SYS_LANGUAGE.innerHTML=lg.get("IDS_LANGUAGE");
		VIDEO_FORMAT.innerHTML=lg.get("IDS_VIDEOFORMAT");
		AUTOLOGOUT.innerHTML=lg.get("IDS_AUTOLOGOUT");
		
		NTP_startup.innerHTML=lg.get("IDS_NTP_ENABLE");//启用NTP
		nnp_server_address.innerHTML=lg.get("IDS_NTP_ADDRESS");//服务器地址
		nnp_GMT.innerHTML=lg.get("IDS_NTP_TIMEZONE");//时区
		chn_resolution_lang.innerHTML=lg.get("IDS_RESOLUTION");//时区
		<!--syspm_dst page  end -->
	}else if(pageName=="syspm_io"){
		<!--syspm_io page  -->
		si_save.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		si_refresh.innerHTML=lg.get("IDS_REFRESH");//Refresh
		serial_port_config.innerHTML=lg.get("IDS_DEFAULT_KB");//串口配置
		agreement_type.innerHTML=lg.get("IDS_PTZ_PROTOCOL");//协议类型
		document.getElementById("Protocol").options[0].innerHTML="Pelco_D"//lg.get("");//Pelco_D
		document.getElementById("Protocol").options[1].innerHTML="Pelco_P"//lg.get("");//Pelco_P
		baud_ratio.innerHTML=lg.get("IDS_PTZ_BAUDRATE");//波特率
	
		data_bit.innerHTML=lg.get("IDS_PTZ_DATABIT");//数据位
		
		temp=lg.get("IDS_SERIAL_BIT");
		document.getElementById("DataBit").options[0].innerHTML="8"+temp;//8位
		document.getElementById("DataBit").options[1].innerHTML="7"+temp;//7位
		document.getElementById("DataBit").options[2].innerHTML="6"+temp;//6位
		document.getElementById("DataBit").options[3].innerHTML="5"+temp;//5位
		stop_bit.innerHTML=lg.get("IDS_PTZ_STOPBIT");//停止位
		document.getElementById("StopBit").options[0].innerHTML="1"+temp;//1位
		document.getElementById("StopBit").options[1].innerHTML="2"+temp;//2位
		sio_check_1.innerHTML=lg.get("IDS_PTZ_CHECK");//校验
		document.getElementById("Check").options[0].innerHTML=lg.get("IDS_CHECKBIT_NONE");//无校验
		document.getElementById("Check").options[1].innerHTML=lg.get("IDS_CHECKBIT_ODD");//奇校验
		document.getElementById("Check").options[2].innerHTML=lg.get("IDS_CHECKBIT_EVEN");//偶校验
		document.getElementById("Check").options[3].innerHTML=lg.get("IDS_CHECKBIT_MARK");//Mark校验
		document.getElementById("Check").options[4].innerHTML=lg.get("IDS_CHECKBIT_SPACE");//Space校验
		<!--syspm_io page  end -->
	}else if(pageName=="kb_set"){
		<!--syspm_io page  -->
		kb_save.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		kb_refresh.innerHTML=lg.get("IDS_REFRESH");//Refresh
		kb_config.innerHTML=lg.get("IDS_DEFAULT_KB");//串口配置
		kb_agreement_type.innerHTML=lg.get("IDS_PTZ_PROTOCOL");//协议类型
		document.getElementById("kb_Protocol").options[0].innerHTML="Pelco_D"//lg.get("");//Pelco_D
		document.getElementById("kb_Protocol").options[1].innerHTML="Pelco_P"//lg.get("");//Pelco_P
		kb_baud_ratio.innerHTML=lg.get("IDS_PTZ_BAUDRATE");//波特率
	
		kb_data_bit.innerHTML=lg.get("IDS_PTZ_DATABIT");//数据位
		
		temp=lg.get("IDS_SERIAL_BIT");
		document.getElementById("kb_DataBit").options[0].innerHTML="8"+temp;//8位
		document.getElementById("kb_DataBit").options[1].innerHTML="7"+temp;//7位
		document.getElementById("kb_DataBit").options[2].innerHTML="6"+temp;//6位
		document.getElementById("kb_DataBit").options[3].innerHTML="5"+temp;//5位
		kb_stop_bit.innerHTML=lg.get("IDS_PTZ_STOPBIT");//停止位
		document.getElementById("kb_StopBit").options[0].innerHTML="1"+temp;//1位
		document.getElementById("kb_StopBit").options[1].innerHTML="2"+temp;//2位
		kb_sio_check_1.innerHTML=lg.get("IDS_PTZ_CHECK");//校验
		document.getElementById("kb_Check").options[0].innerHTML=lg.get("IDS_CHECKBIT_NONE");//无校验
		document.getElementById("kb_Check").options[1].innerHTML=lg.get("IDS_CHECKBIT_ODD");//奇校验
		document.getElementById("kb_Check").options[2].innerHTML=lg.get("IDS_CHECKBIT_EVEN");//偶校验
		document.getElementById("kb_Check").options[3].innerHTML=lg.get("IDS_CHECKBIT_MARK");//Mark校验
		document.getElementById("kb_Check").options[4].innerHTML=lg.get("IDS_CHECKBIT_SPACE");//Space校验
		<!--syspm_io page  end -->
	}else if(pageName=="syspm_user" || pageName=="syspm_user_owl"){
		<!--syspm_user page  -->
		user_info.innerHTML=lg.get("IDS_USER_INFO");//User Info
		USUsSV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		USUsRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		if(pageName=="syspm_user_owl"){
			USUsDf.innerHTML=lg.get("IDS_DEFAULT");//Default
		}
		NO.innerHTML=lg.get("IDS_PRESET_INDEX");//NO.
		user_name.innerHTML=lg.get("IDS_LOGIN_NAME");//User Name
		type.innerHTML=lg.get("IDS_LOGIN_PSW");//Type
		//temp=lg.get("IDS_USER_USE");
		active_2.innerHTML=lg.get("IDS_ENABLE");//ACTIVE
		uesr_name_1.innerHTML=lg.get("IDS_USERNAME");//User Name:
		if(pageName=="syspm_user"){
			oldpasswd.innerHTML=lg.get("IDS_OLDPSW");//oldPassword
		}
		passwd.innerHTML=lg.get("IDS_NEW_PSW");//Password
		confirm_1.innerHTML=lg.get("IDS_CONFIRM");//Confirm
		active_1_1.innerHTML=lg.get("IDS_USER_USE");//ACTIVE;
		user_ck1_0.innerHTML = lg.get("IDS_LOOKUP_LOG");//日志搜索
		user_ck1_1.innerHTML = lg.get("IDS_USER_SET");
		user_ck1_2.innerHTML = lg.get("IDS_SYS_MAINTE");
		//user_ck1_3.innerHTML = lg.get("IDS_CRUIS_CTRL");
		user_ck1_4.innerHTML = lg.get("IDS_HDD_MANGUAGE");
		user_ck1_5.innerHTML = lg.get("IDS_LOGIN");
		user_ck1_6.innerHTML = lg.get("IDS_POLL_CTRL");
		user_ck1_7.innerHTML = lg.get("IDS_RECCONFIG_MODE03");
		user_ck1_8.innerHTML = lg.get("IDS_MANUAL_CAPTURE");
		UserBackup_1.innerHTML = lg.get("IDS_BACKUP");
		UserPreview_1.innerHTML = lg.get("IDS_LIVE_PAGE");
		UserPlayBack_1.innerHTML = lg.get("IDS_REPLAY");
		UserPtzControl_1.innerHTML = lg.get("IDS_PTZ_CTRL");
		document.getElementById("USused").options[0].innerHTML=lg.get("IDS_DISABLE");//Disable
		document.getElementById("USused").options[1].innerHTML=lg.get("IDS_ENABLE");//Enable
		pws_enable.innerHTML=lg.get("IDS_USER_USEPSE"); //lg.get("");//Pws Enable
		document.getElementById("USPwsEnable").options[0].innerHTML=lg.get("IDS_DISABLE");//Disable
		document.getElementById("USPwsEnable").options[1].innerHTML=lg.get("IDS_ENABLE");//Enable
	}else if(pageName=="syswh_mr"){
		default_parm.innerHTML=lg.get("IDS_DEFAULT_PARAM");//默认参数
        DefaultDisplay.innerHTML=lg.get("IDS_DISPLAY_PARAM");
		DefaultRecord.innerHTML=lg.get("IDS_CHINFO_RECORD");
		DefaultNetwork.innerHTML=lg.get("IDS_DEFAULT_NETWORK");
		DefaultAlarm.innerHTML=lg.get("IDS_ALARM_PARAM");
		DefaultDevice.innerHTML=lg.get("IDS_DEVICE");
		DefaultSystem.innerHTML=lg.get("IDS_SYS_PARAM");
		DefaultAdvance.innerHTML=lg.get("IDS_ADVANCE");
		DefaultSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		if(lgCls.version == "URMET"){
			default_parm_ipc.innerHTML=lg.get("IDS_DEFAULT_PARAM");//默认参数
			default_parmSeletedAll_ipc.innerHTML=lg.get("IDS_PATH_ALL");
			DefaultSave_ipc.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		}
		<!--syswh_mr page  end -->
	}else if(pageName=="syswh_sj"){
		<!--syswh_sj page  -->
		l_upgrade.innerHTML=lg.get("IDS_SYS_UPDATE");//远程升级
		upgrade_file_path.innerHTML=lg.get("IDS_UPDATE_PATH");//升级文件路径
		//upgrade_state.innerHTML=lg.get("IDS_UPDATE_UPDATE");//升级状态
		UPStart.value=lg.get("IDS_UPDATE_START");
		UPStop.value=lg.get("IDS_UPDATE_STOP");
		
		//ipc 
		l_upgrade_ipc.innerHTML=lg.get("IDS_SYS_UPDATE");//远程升级
		upgrade_file_path_ipc.innerHTML=lg.get("IDS_UPDATE_PATH");//升级文件路径
		UPStart_ipc.value=lg.get("IDS_UPDATE_START");
		//UPStop_ipc.value=lg.get("IDS_UPDATE_STOP");
		NVR_updateSeletedAll_ipc.innerHTML=lg.get("IDS_PATH_ALL");
		//document.getElementById("UPStart").innerHTML=lg.get("IDS_UPDATE_START"); //开始升级
		//document.getElementById("UPStop").innerHTML=lg.get("IDS_UPDATE_STOP"); //停止升级
		<!--syswh_sj page  end -->
	}else if(pageName=="auto_wh"){
		AUTOWHRF.innerHTML=lg.get("IDS_REFRESH");
		AUTOWHDF.innerHTML=lg.get("IDS_DEFAULT");
		AUTOWHSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		atuo_title.innerHTML=lg.get("IDS_BASE_MAINTI");//自动维护
		auto_vindicate.innerHTML=lg.get("IDS_BASE_AUTOREBOOT");//自动重启
		
		SysMainRbUser.innerHTML=lg.get("IDS_AUTO_LOGIN");
		document.getElementById("SysMainUserSwitch").options[0].innerHTML=lg.get("IDS_OFF");      //OFF
		document.getElementById("SysMainUserSwitch").options[1].innerHTML=lg.get("IDS_ADMIN");    //admin
		
		SysMainReboot.innerHTML=lg.get("IDS_REBOOT");//自动重启
		btn_reboot_ok.value = lg.get("IDS_REBOOT_OK");
		btn_reboot_cancle.value = lg.get("IDS_REBOOT_CANCLE");
		if(lgCls.version == "URMET"){
			RemoteReboot.value = lg.get("IDS_REBOOT") + " NVR";
			RemoteReboot_ipc.value = lg.get("IDS_REBOOT") + " IPC";
			RemoteRebootSeletedAll_ipc.innerHTML=lg.get("IDS_PATH_ALL");
			IPCSelectReboot.innerHTML=lg.get("IDS_IPCREBOOT");
		}else{
			RemoteReboot.value = lg.get("IDS_SETUP");
		}
		//document.getElementById("btn_reboot_ok").innerHTML=lg.get("IDS_REBOOT_OK");
		//document.getElementById("btn_reboot_cancle").innerHTML=lg.get("IDS_REBOOT_CANCLE");
		//document.getElementById("RemoteReboot").innerHTML=lg.get("IDS_REBOOT");//远程重启
		document.getElementById("SysInfautomaintain").options[0].innerHTML=lg.get("IDS_DISABLE");//Disable
		document.getElementById("SysInfautomaintain").options[1].innerHTML=lg.get("IDS_ENABLE");//Enable
		//vindicate_time.innerHTML=lg.get("IDS_BASE_MAINTITIME");//维护时间
		document.getElementById("SysInfmaintainperiod1").options[0].innerHTML=lg.get("IDS_EVERY_DAY");//每一天
		document.getElementById("SysInfmaintainperiod1").options[1].innerHTML=lg.get("IDS_EVERY_WEEK");//每一周
		document.getElementById("SysInfmaintainperiod1").options[2].innerHTML=lg.get("IDS_EVERY_MONTH");//每个月
	}else if(pageName=="plat_set"){
		plat_config.innerHTML=lg.get("IDS_TITLE_PLATFORM");
		PlatRF.innerHTML=lg.get("IDS_REFRESH");
		PlatSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		NMPlat_Enable.innerHTML=lg.get("IDS_ENABLE_PLATFORM");
		document.getElementById("SLPlat_Enable").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("SLPlat_Enable").options[1].innerHTML=lg.get("IDS_ENABLE");
		NMPlat_Address.innerHTML=lg.get("IDS_PLATFORM_IP");
		NMPlat_Port.innerHTML=lg.get("IDS_PLATFORM_PORT");
		NMPlat_Select.innerHTML=lg.get("IDS_PLATFORM_SEL");
		document.getElementById("SLPlat_Select").options[0].innerHTML=lg.get("IDS_PLATFORM_TYPE_1");
		NMPlat_Protocol.innerHTML=lg.get("IDS_PLATFORM_PROTOCOL");
		document.getElementById("SLPlat_Protocol").options[0].innerHTML=lg.get("IDS_PLATFORM_UDP");
		document.getElementById("SLPlat_Protocol").options[1].innerHTML=lg.get("IDS_PLATFORM_TCP");
		NMPlat_Puid.innerHTML=lg.get("IDS_PLATFORM_PUID");
	}else if(pageName=="netinf_3G"){
		NetInf3G_config.innerHTML=lg.get("IDS_3GINFO");
		NetInf3GRf.innerHTML=lg.get("IDS_REFRESH");
		NetInf3G_ID_Level.innerHTML=lg.get("IDS_3GLEVEL");
		NetInf3G_ID_Type.innerHTML=lg.get("IDS_3GTYPE");
		NetInf3G_ID_IPAddress.innerHTML=lg.get("IDS_3GIPADDRESS");
	}else if(pageName == "router_lan"){
		LanRf.innerHTML=lg.get("IDS_REFRESH");
		LanSave.innerHTML=lg.get("IDS_CRUISE_SAVE");
		
		Lan_option.innerHTML = lg.get("IDS_OPTION");//option
		rounter_lanconfig.innerHTML=lg.get("IDS_ROUTER_LAN");//Lan
		document.getElementById("lan_mode_select").options[0].innerHTML=lg.get("IDS_ROUTER_NVR");//nvr
		document.getElementById("lan_mode_select").options[1].innerHTML=lg.get("IDS_ROUTER_ROUTER");//router
		lan_ip_address.innerHTML=lg.get("IDS_NET_IPADDR");//ip地址
		lan_subnet_mask.innerHTML=lg.get("IDS_NET_MASK");//子网掩码
		Wifi_type.innerHTML = lg.get("IDS_WIFI_TYPE");//TYPE
		document.getElementById("wifi_type_select").options[0].innerHTML=lg.get("IDS_DISABLE");//DISABLE
		document.getElementById("wifi_type_select").options[1].innerHTML=lg.get("IDS_WIFI_NET");//wpa2-psk
		lan_ssid.innerHTML = lg.get("IDS_WIFI_SSID");//ssid
		lan_psd.innerHTML = lg.get("IDS_WIFI_PSD");//PSD
		
		nvrnet_mode.innerHTML=lg.get("IDS_ONLINE_MODE");//联网方式
		document.getElementById("NVRNetworkMode").options[0].innerHTML=lg.get("IDS_NET_MODE01");//DHCP
		document.getElementById("NVRNetworkMode").options[1].innerHTML=lg.get("IDS_NET_MODE03");//static
		
		nvr_pnp.innerHTML=lg.get("IDS_NET_UPNP");//PNP
		document.getElementById("nvr_UseUPNP").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("nvr_UseUPNP").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
	
		Wifi_Channel.innerHTML=lg.get("IDS_LAN_CHNNEL");//ip地址
		nvr_ip_address.innerHTML=lg.get("IDS_NET_IPADDR");//ip地址
		nvr_subnet_mask.innerHTML=lg.get("IDS_NET_MASK");//子网掩码
		nvr_nbe_default_gateway.innerHTML=lg.get("IDS_NET_GATEWAY");//默认网关
		nvr_first_DNS.innerHTML=lg.get("IDS_FIRST_DNS");//首选DNS
		nvr_standy_DNS.innerHTML=lg.get("IDS_SECOND_DNS");//备用DNS
		nvr_media_port.innerHTML=lg.get("IDS_NEW_MEDIAPORT");//媒体端口
		nvr_nbe_web_port.innerHTML=lg.get("IDS_NET_WEBPORT");//web端口
		nvr_nbe_Mobile_port.innerHTML=lg.get("IDS_NET_PORT_MOB");//手机端口
		
		
		
	}else if(pageName == "router_wan"){
		WanRf.innerHTML=lg.get("IDS_REFRESH");
		WanSave.innerHTML=lg.get("IDS_CRUISE_SAVE");
		rounter_wanconfig.innerHTML=lg.get("IDS_ROUTER_WAN");
		
		Wan_mode.innerHTML=lg.get("IDS_ONLINE_MODE");//联网方式
		document.getElementById("Wan_mode_select").options[0].innerHTML=lg.get("IDS_NET_MODE02");//PPPoE
		document.getElementById("Wan_mode_select").options[1].innerHTML=lg.get("IDS_NET_MODE03");//Static
		document.getElementById("Wan_mode_select").options[2].innerHTML=lg.get("IDS_NET_MODE01");//DHCP
		
		wan_usename.innerHTML=lg.get("IDS_LOGIN_NAME");//用户名
		wan_passwd.innerHTML=lg.get("IDS_SERVERINFO_PSW");//密　码
		wan_ip_address.innerHTML=lg.get("IDS_NET_IPADDR");//ip地址
		wan_subnet_mask.innerHTML=lg.get("IDS_NET_MASK");//子网掩码
		wan_default_gateway.innerHTML=lg.get("IDS_NET_GATEWAY");//默认网关
		wan_first_DNS.innerHTML=lg.get("IDS_FIRST_DNS");//首选DNS
		wan_standy_DNS.innerHTML=lg.get("IDS_SECOND_DNS");//备用DNS
	}
	else if(pageName == "IPC_wifiset"){
		
		wifiRf.innerHTML=lg.get("IDS_REFRESH");
		wifiSave.innerHTML=lg.get("IDS_CRUISE_SAVE");
		IPC_wifisetconfig.innerHTML=lg.get("IDS_WIFI_SET");
		
		wifi_Enable.innerHTML=lg.get("IDS_WIFI_WIFI");//wifi
		document.getElementById("wifi_Enable_select").options[0].innerHTML=lg.get("IDS_DISABLE");//Disable
		document.getElementById("wifi_Enable_select").options[1].innerHTML=lg.get("IDS_ENABLE");//Enable
		
		WiFi_Encryption_type.innerHTML = lg.get("IDS_WIFI_KEYMODE");
		wifi_ssid.innerHTML = lg.get("IDS_WIFI_SSID");//ssid
		WiFi_Key_type.innerHTML = lg.get("IDS_WIFI_PSD");//PSD
		WiFi_Security_type.innerHTML=lg.get("IDS_WIFI_TYPE");//认证模式
								
	}
	else if(pageName == "IPCan_set"){
		ipcan_info.innerHTML=lg.get("IDS_IPC_SET");
		IPCDelete.innerHTML=lg.get("IDS_MOTION_DELETE");
		QuickAdd.innerHTML=lg.get("IDS_QUICKADD");
		IPCRefresh.innerHTML=lg.get("IDS_REFRESH");
		IPCProtocolManagement.innerHTML=lg.get("IDS_PRO_MANAGE");
		IPCAutoAdd.innerHTML=lg.get("IDS_AUTO_ADDIPC");
		
		quickadd_ok.innerHTML=lg.get("IDS_ADD");
		quickadd_cancel.innerHTML=lg.get("IDS_CANCLE");
		quickadd_refresh.innerHTML=lg.get("IDS_REFRESH");
		
		IPCSet_Ok.innerHTML=lg.get("IDS_OK");
		IPCSet_Cancel.innerHTML=lg.get("IDS_CANCLE");
		
		ipc_chlIndex.innerHTML=lg.get("IDS_MOTION_CH");
		ipc_name.innerHTML=lg.get("IDS_OSD_NAME");
		ipc_chlPosition.innerHTML=lg.get("IDS_OSD_POS");
		ipc_address.innerHTML =lg.get("IDS_IPADDRESS");
		ipc_netmask.innerHTML=lg.get("IDS_NET_MASK");
		ipc_media_port.innerHTML=lg.get("IDS_NEW_MEDIAPORT");//媒体端口
		ipc_protocol.innerHTML=lg.get("IDS_PTZ_PROTOCOL");
		ipc_usename.innerHTML=lg.get("IDS_USERNAME");//用户名
		ipc_passwd.innerHTML=lg.get("IDS_SERVERINFO_PSW"); //密码
		
		ipc_user_name.innerHTML=lg.get("IDS_USERNAME")+":";//用户名
		ipc_user_password.innerHTML=lg.get("IDS_SERVERINFO_PSW")+":"; //密码
		//document.getElementById("IPCProtocol").options[0].innerHTML=lg.get("IDS_PROTOCOL_PRIVATE");
		//document.getElementById("IPCProtocol").options[1].innerHTML=lg.get("IDS_PROTOCOL_RSSZ");
		//document.getElementById("IPCProtocol").options[2].innerHTML=lg.get("IDS_PROTOCOL_ONVIF");
	}else if(pageName == "IP_Filter"){
		IPFilterRf.innerHTML=lg.get("IDS_REFRESH");
		IPFilterSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		IPFilter_set.innerHTML = lg.get("IDS_IPFILTER");
		FilterSwitch.innerHTML = lg.get("IDS_FILTER_SWITCH");
		document.getElementById("IPFilterAdd").innerHTML=lg.get("IDS_IPC_ADD");
		document.getElementById("IPFilterDel").innerHTML=lg.get("IDS_DEl_IP");
		IPFilterNO.innnerHTML = lg.get("IDS_HDDS_INDEX");
		IPFilterAddr.innerHTML = lg.get("IDS_NET_IPADDR");
		IPFilterEnable.innerHTML = lg.get("IDS_ENABLE");
		document.getElementById("IPFilterSwitch").options[0].innerHTML=lg.get("IDS_IGNORE_IP");
		document.getElementById("IPFilterSwitch").options[1].innerHTML=lg.get("IDS_SET_IP");
		document.getElementById("IPFilterSwitch").options[2].innerHTML=lg.get("IDS_BAN_SETIP");
	}else if(pageName == "RTSP_Set"){
		RTSPRf.innerHTML=lg.get("IDS_REFRESH");
		RTSPSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		RTSP_Title.innerHTML=lg.get("IDS_RTSP_SET");
		Rtsp_Enable.innerHTML=lg.get("IDS_RTSP_ENABLE");
		Rtsp_Port.innerHTML=lg.get("IDS_RTSP_PORT");
		RTSPMode.innerHTML=lg.get("IDS_RTSP_MODE");
		RTSPUserName.innerHTML=lg.get("IDS_LOGIN_NAME");
		RTSPPassword.innerHTML=lg.get("IDS_SERVERINFO_PSW");
		document.getElementById("RtspEnableSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("RtspEnableSwitch").options[1].innerHTML=lg.get("IDS_OPEN");
		document.getElementById("RTSPModeSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("RTSPModeSwitch").options[1].innerHTML=lg.get("IDS_OPEN");
	}else if(pageName == "Cloud_Storage"){
		CloSto_Title.innerHTML=lg.get("IDS_CLOUDSTORAGE");
		CloStoRf.innerHTML=lg.get("IDS_REFRESH");
		CloStoSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		CloSto_Enable.innerHTML=lg.get("IDS_CLOUDSTORAGE");
		CloSto_Channel.innerHTML=lg.get("IDS_MOTION_CH");
		CloSto_Trigger.innerHTML=lg.get("IDS_TRIGGER");
		CloSto_Motion.innerHTML=lg.get("IDS_MOTION_DETECTION");
		CloSto_Name.innerHTML=lg.get("IDS_BASE_DEVNAME");
		CloSto_Email.innerHTML=lg.get("IDS_EMAIL_RECEIVEADDRESS");
		document.getElementById("CloSto_Test_Email").innerHTML=lg.get("IDS_TEST_CLOUDEMAIL");
		document.getElementById("CloSto_Email_Setup").innerHTML=lg.get("IDS_EMAIL_SETUP");
		document.getElementById("CloStoEnableSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("CloStoEnableSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");
		document.getElementById("CloStoMotionSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("CloStoMotionSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");
		temp=lg.get("IDS_MINUTE");
		document.getElementById("CloStoTimeSwitch").options[0].innerHTML="1"+temp;//1M
		document.getElementById("CloStoTimeSwitch").options[1].innerHTML="3"+temp;//3M
		document.getElementById("CloStoTimeSwitch").options[2].innerHTML="5"+temp;//5M
		document.getElementById("CloStoTimeSwitch").options[3].innerHTML="10"+temp;//10M
		document.getElementById("CloStoTimeSwitch").options[4].innerHTML="20"+temp;//20M
		document.getElementById("CloStoTimeSwitch").options[5].innerHTML="30"+temp;//30M
	}else if(pageName == "NewCloud_Storage"){                                
		NewCloSto_Title.innerHTML=lg.get("IDS_CLOUDSTORAGE");		
		NewCloStoRf.innerHTML=lg.get("IDS_REFRESH");
		NewCloStoSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		
		NewCloSto_Enable.innerHTML=lg.get("IDS_CLOUDSTORAGE");  
		document.getElementById("NewCloStoEnable").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("NewCloStoEnable").options[1].innerHTML=lg.get("IDS_ENABLE");		
		NewCloSto_ServerType.innerHTML=lg.get("IDS_SERVER_TYPE");  
		document.getElementById("NewCloStoServerType").options[0].innerHTML=lg.get("IDS_NewCloSto_DROPBOX");   //Dropbox
		document.getElementById("NewCloStoServerType").options[1].innerHTML=lg.get("IDS_GOOGLEDRIVE");  //Google Drive		
		NewCloSto_DriveName.innerHTML=lg.get("IDS_BASE_DEVNAME"); 		

		NewCloSto_SnapEnable.innerHTML=lg.get("IDS_UPLOAD_PHOTO");  //Upload Photo  
		document.getElementById("NewCloStoSnapEnable").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("NewCloStoSnapEnable").options[1].innerHTML=lg.get("IDS_ENABLE");
		gotoUploadPhoto.value=lg.get("IDS_SETUP");		
		NewCloSto_VideoEnable.innerHTML=lg.get("IDS_UPLOAD_VIDEO");  //Upload Video  
		document.getElementById("NewCloStoVideoEnable").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("NewCloStoVideoEnable").options[1].innerHTML=lg.get("IDS_ENABLE");
		gotoUploadVideo.value=lg.get("IDS_SETUP");
		
		NewCloSto_RecvEmail.innerHTML=lg.get("IDS_EMAIL_RECEIVEADDRESS");		
		NewCloSto_Account.innerHTML=lg.get("IDS_GMAIL_ACCOUNT");  //Gmail Account		
		NewCloSto_AccountPW.innerHTML=lg.get("IDS_GEMAIL_PASSWORD");  //Gmail Password	
		NewCloSto_Test_Email.value=lg.get("IDS_TEST_CLOUDEMAIL");
		gotoCloud_email.value=lg.get("IDS_EMAIL_SETUP");	
		//document.getElementById("NewCloSto_Test_Email").value=lg.get("IDS_TEST_CLOUDEMAIL");
		//document.getElementById("gotoCloud_email").value=lg.get("IDS_EMAIL_SETUP");
		document.getElementById("CloudCheck").value=lg.get("IDS_CLOUD_CHECK");
	}else if(pageName == "Upload_Photo"){
		UploadPhoto_Title.innerHTML=lg.get("IDS_UPLOAD_PHOTO");
		UploadPhotoRf.innerHTML=lg.get("IDS_REFRESH");
		UploadPhotoSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		UploadPhotoExit.innerHTML=lg.get("IDS_EXIT");
		
		UploadPhoto_Channel.innerHTML=lg.get("IDS_MOTION_CH");
		UploadPhoto_TimeTrigger.innerHTML=lg.get("IDS_TRIGGER");		
		temp=lg.get("IDS_MINUTE");
		document.getElementById("UploadPhotoTimeTrigger").options[0].innerHTML=lg.get("IDS_OFF");//OFF
		document.getElementById("UploadPhotoTimeTrigger").options[1].innerHTML="1"+temp;//1M
		document.getElementById("UploadPhotoTimeTrigger").options[2].innerHTML="3"+temp;//3M
		document.getElementById("UploadPhotoTimeTrigger").options[3].innerHTML="5"+temp;//5M
		document.getElementById("UploadPhotoTimeTrigger").options[4].innerHTML="10"+temp;//10M
		document.getElementById("UploadPhotoTimeTrigger").options[5].innerHTML="20"+temp;//20M
		document.getElementById("UploadPhotoTimeTrigger").options[6].innerHTML="30"+temp;//30M
		document.getElementById("UploadPhotoTimeTrigger").options[7].innerHTML="60"+temp;//60M
		
		UploadPhoto_MotionSnapEnable.innerHTML=lg.get("IDS_MOTION_DETECTION");  
		document.getElementById("UploadPhotoMotionSnapEnable").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("UploadPhotoMotionSnapEnable").options[1].innerHTML=lg.get("IDS_ENABLE");		
		gotoalarm_mv.value=lg.get("IDS_MOTION_SETUP");
	}else if(pageName == "Upload_Video"){
		UploadVideo_Title.innerHTML=lg.get("IDS_UPLOAD_VIDEO");
		UploadVideoRf.innerHTML=lg.get("IDS_REFRESH");
		UploadVideoSave.innerHTML=lg.get("IDS_CRUISE_SAVE");
		UploadVideoExit.innerHTML=lg.get("IDS_EXIT");
		
		SCSP_CPTDQD.value=lg.get("IDS_Copy");
		SCSP_CPXQQD.value=lg.get("IDS_Copy");
		$("#video_qx").text(lg.get("IDS_DST_DSTMODE01"));
		
		VIDEO_COPY_WEEK_TO.innerHTML=lg.get("IDS_COPY_TO");
		VIDEO_COPY_CH_TO.innerHTML=lg.get("IDS_COPY_TO");
		
		document.getElementById("SCSP_CPHXQ").options[0].innerHTML=lg.get("IDS_PATH_ALL");//sun
		document.getElementById("SCSP_CPHXQ").options[1].innerHTML=lg.get("IDS_WEEKDAY_01");//sun
		document.getElementById("SCSP_CPHXQ").options[2].innerHTML=lg.get("IDS_WEEKDAY_02");//sun
		document.getElementById("SCSP_CPHXQ").options[3].innerHTML=lg.get("IDS_WEEKDAY_03");//sun
		document.getElementById("SCSP_CPHXQ").options[4].innerHTML=lg.get("IDS_WEEKDAY_04");//sun
		document.getElementById("SCSP_CPHXQ").options[5].innerHTML=lg.get("IDS_WEEKDAY_05");//sun
		document.getElementById("SCSP_CPHXQ").options[6].innerHTML=lg.get("IDS_WEEKDAY_06");//sun
		document.getElementById("SCSP_CPHXQ").options[7].innerHTML=lg.get("IDS_WEEKDAY_07");//sun
		
		video_copyCh.innerHTML=lg.get("IDS_REC_COPYCH");
		video_copyDay.innerHTML=lg.get("IDS_RECPLAN_COPYDAY");
		
		document.getElementById("VIDEOQX").options[0].innerHTML = document.getElementById("SCSP_CPQXQ").options[0].innerHTML=lg.get("IDS_WEEKDAY_01");//sun
		document.getElementById("VIDEOQX").options[1].innerHTML = document.getElementById("SCSP_CPQXQ").options[1].innerHTML=lg.get("IDS_WEEKDAY_02");//sun
		document.getElementById("VIDEOQX").options[2].innerHTML = document.getElementById("SCSP_CPQXQ").options[2].innerHTML=lg.get("IDS_WEEKDAY_03");//sun
		document.getElementById("VIDEOQX").options[3].innerHTML = document.getElementById("SCSP_CPQXQ").options[3].innerHTML=lg.get("IDS_WEEKDAY_04");//sun
		document.getElementById("VIDEOQX").options[4].innerHTML = document.getElementById("SCSP_CPQXQ").options[4].innerHTML=lg.get("IDS_WEEKDAY_05");//sun
		document.getElementById("VIDEOQX").options[5].innerHTML = document.getElementById("SCSP_CPQXQ").options[5].innerHTML=lg.get("IDS_WEEKDAY_06");//sun
		document.getElementById("VIDEOQX").options[6].innerHTML = document.getElementById("SCSP_CPQXQ").options[6].innerHTML=lg.get("IDS_WEEKDAY_07");//sun
		
		UploadVideo_MotionVideoChannel.innerHTML=lg.get("IDS_MOTION_CH");		
		video_upload.innerHTML=lg.get("IDS_DEFAULT_UPLOAD");
		video_noupload.innerHTML=lg.get("IDS_VIDEO_NOUPLOAD");	
	}else if(pageName == "NormalClo_Sto"){                                                                    
		NormalCloSto_Title.innerHTML=lg.get("IDS_CLOUDSTORAGE");		
		NormalCloStoRf.innerHTML=lg.get("IDS_REFRESH");
		NormalCloStoSV.innerHTML=lg.get("IDS_CRUISE_SAVE");  
		
		NormalCloSto_Enable.innerHTML=lg.get("IDS_CLOUDSTORAGE");  
		document.getElementById("NormalCloStoEnable").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("NormalCloStoEnable").options[1].innerHTML=lg.get("IDS_ENABLE");		
		NormalCloSto_CloudType.innerHTML=lg.get("IDS_CLOUD_TYPE");  
		document.getElementById("NormalCloStoCloudType").options[0].innerHTML=lg.get("IDS_NewCloSto_DROPBOX");   
		document.getElementById("NormalCloStoCloudType").options[1].innerHTML=lg.get("IDS_GOOGLEDRIVE");  
			
		//NormalCloSto_key.innerHTML=lg.get("IDS_NORMALCLO_KEY");
		//NormalCloSto_secret.innerHTML=lg.get("IDS_NORMALCLO_SECRET");
		//NormalCloSto_FTPPATH.innerHTML=lg.get("IDS_NORMALCLO_FTPPATH"); 
		//document.getElementById("gotoNormalClo_StoFtp").value=lg.get("IDS_NORMAL_FTPSETUP");
		if(gDvr.hybirdDVRFlag){
			NormalCloSto_Channel.innerHTML=lg.get("IDS_ANALOG_TITLE");  //Analog Channels	
			NormalCloSto_IP.innerHTML=lg.get("IDS_IO_IPCKALL");  //IP Channels
		}else{
			NormalCloSto_Channel.innerHTML=lg.get("IDS_MOTION_CH");  //Channel
		}
			
		NormalCloSto_TimeTrigger.innerHTML=lg.get("IDS_NORMA_TRIGGER");
		temp=lg.get("IDS_MINUTE");
		document.getElementById("NormalCloStoTimeTrigger").options[0].innerHTML="1"+temp;//1M
		document.getElementById("NormalCloStoTimeTrigger").options[1].innerHTML="3"+temp;//3M
		document.getElementById("NormalCloStoTimeTrigger").options[2].innerHTML="5"+temp;//5M
		document.getElementById("NormalCloStoTimeTrigger").options[3].innerHTML="10"+temp;//10M
		document.getElementById("NormalCloStoTimeTrigger").options[4].innerHTML="20"+temp;//20M
		document.getElementById("NormalCloStoTimeTrigger").options[5].innerHTML="30"+temp;//30M
		document.getElementById("NormalCloStoTimeTrigger").options[6].innerHTML="60"+temp;//60M 		
		
		NormalCloSto_MotionEnable.innerHTML=lg.get("IDS_MOTION_DETECTION");  
		document.getElementById("NormalCloStoMotionEnable").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("NormalCloStoMotionEnable").options[1].innerHTML=lg.get("IDS_ENABLE");		
		NormalCloSto_DriveName.innerHTML=lg.get("IDS_BASE_DEVNAME");		
		document.getElementById("NormalCloSto_Test_Email").value=lg.get("IDS_TEST_CLOUDEMAIL");
		document.getElementById("gotoNormalClo_StoEm").value=lg.get("IDS_EMAIL_SETUP");
		NormalCloSto_Tips1_1.innerHTML=lg.get("IDS_CLOUS_TIPS0");
		NormalCloSto_Tips1_2.innerHTML=lg.get("IDS_CLOUS_TIPS1");
		NormalCloSto_Tips2.innerHTML=lg.get("IDS_CLOUS_TIPS2");
		document.getElementById("NormalCloSto_Upgrade").value=lg.get("IDS_CLOUS_UPGRADE");
	}else if(pageName=="NormalClo_StoEm"){                                                   
		NormalCloStoEm_config.innerHTML=lg.get("IDS_EMAIL_INFO"); //email
		NormalCloStoEmRf.innerHTML=lg.get("IDS_REFRESH");//Refresh
		NormalCloStoEmSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		NormalCloStoEmExit.innerHTML=lg.get("IDS_EXIT");//Exit		

		NormalCloStoEmEmailSwitch.innerHTML=lg.get("IDS_EMAIL_INFO"); //email	
		document.getElementById("NormalCloStoEm_EmailSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("NormalCloStoEm_EmailSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");		
		NormalCloStoEmSSLSwitch.innerHTML=lg.get("IDS_EMAIL_SSL");//SSL开关
		document.getElementById("NormalCloStoEm_SSLSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("NormalCloStoEm_SSLSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");
		
		NormalCloStoEmPort.innerHTML=lg.get("IDS_EMAIL_PORT");//端口号
		NormalCloStoEmSMTP.innerHTML=lg.get("IDS_EMAIL_SERVER");//SMTP服务器		
		NormalCloStoEmSendEmail.innerHTML=lg.get("IDS_EMAIL_SENDADDRESS");//发件人地址		
		NormalCloStoEmSendEmailPW.innerHTML=lg.get("IDS_EMAIL_SENDPSW");//发件人密码		
		NormalCloStoEmRecvEmail.innerHTML=lg.get("IDS_EMAIL_RECEIVEADDRESS");//收件人地址		
		document.getElementById("NormalCloStoEm_EmailTest").value=lg.get("IDS_EMAILTEST");//Email 测试		
	}else if(pageName == "NormalClo_StoFtp"){
		NormalCloStoFtpRf.innerHTML=lg.get("IDS_REFRESH");
		NormalCloStoFtpSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		NormalCloStoFtpExit.innerHTML=lg.get("IDS_EXIT");//Exit		
		NormalFtpIpAddr.innerHTML=lg.get("IDS_DDNS_ADDRESS");	
		NormalFtpPort.innerHTML=lg.get("IDS_NET_PORT_MOB");	
		NormalFtpLoginName.innerHTML=lg.get("IDS_LOGIN_NAME");
		NormalFtpLoginPwd.innerHTML=lg.get("IDS_SERVERINFO_PSW");		
		NormalFilePath.innerHTML=lg.get("IDS_FTP_DIRNAME");	
		document.getElementById("NormalFtpTest").value=lg.get("IDS_FTPTEST");//Ftp 测试			
	}else if(pageName=="Cloud_email"){
		<!--net_email page  -->
		CloEmailSave.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		CloEmailRf.innerHTML=lg.get("IDS_REFRESH");//Refresh	
		CloEmailExit.innerHTML=lg.get("IDS_EXIT");
		Cloemail_config.innerHTML=lg.get("IDS_EMAIL_INFO"); //email
		CloEmail_startup.innerHTML=lg.get("IDS_EMAIL_ENABLE");//启用Email
		CloSMTP_server.innerHTML=lg.get("IDS_EMAIL_SERVER");//SMTP服务器
		Cloaddresser_address.innerHTML=lg.get("IDS_EMAIL_SENDADDRESS");//发件人地址
		Cloaddresser_passwd.innerHTML=lg.get("IDS_EMAIL_SENDPSW");//发件人密码
		Cloport_num.innerHTML=lg.get("IDS_EMAIL_PORT");//端口号
		CloSSL_switch.innerHTML=lg.get("IDS_EMAIL_SSL");//SSL开关
		CloEmailTest.value=lg.get("IDS_EMAILTEST");
		//document.getElementById("CloEmailTest").innerHTML=lg.get("IDS_EMAILTEST");//Email 测试
		Clodefaultoff.innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("CloEmSSLSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("CloEmSSLSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		document.getElementById("CloEmEmailSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("CloEmEmailSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		document.getElementById("CloEmEmailSwitch").options[2].innerHTML=lg.get("IDS_DEFAULT");//Lorex专用 Default
		<!--net_email page  end -->
	}else if(pageName == "FTP_Set"){
		FTPRf.innerHTML=lg.get("IDS_REFRESH");
		FTPDf.innerHTML=lg.get("IDS_DEFAULT");
		FTPSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		
		FTP_Startup.innerHTML=lg.get("IDS_FTP_ENABLE");
		document.getElementById("FTP_Switch").options[0].innerHTML=lg.get("IDS_DISABLE");
		document.getElementById("FTP_Switch").options[1].innerHTML=lg.get("IDS_ENABLE");	
			
		FtpIpAddr.innerHTML=lg.get("IDS_DDNS_ADDRESS");
		FtpLoginName.innerHTML=lg.get("IDS_LOGIN_NAME");
		FtpLoginPwd.innerHTML=lg.get("IDS_SERVERINFO_PSW");
		
		if(lgCls.version=="OWL"){
			FtpPort.innerHTML=lg.get("IDS_PORT_PORT");
		}else{
			FtpPort.innerHTML=lg.get("IDS_NET_PORT");
		}
		FtpFileLength.innerHTML=lg.get("IDS_FTP_LENGTH");
		FtpDirName.innerHTML=lg.get("IDS_FTP_DIRNAME");
		document.getElementById("FtpTest").value=lg.get("IDS_FTPTEST");//Ftp 测试
	}else if(pageName == "Perimeter_Line"){
		//PL_config.innerHTML=lg.get("IDS_FTP_REQSTREAM");	
		PL_CP.innerHTML=lg.get("IDS_Copy");
		PL_Rf.innerHTML=lg.get("IDS_REFRESH");
		PL_SV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		PL_ChnSwitch.innerHTML=lg.get("IDS_CHN_SWITCH");
		document.getElementById("PLChnSwitch").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("PLChnSwitch").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		PL_Channel_Num.innerHTML=lg.get("IDS_MOTION_CH");
		PL_AlarmBtn.innerHTML=lg.get("IDS_ALARM_PARAM");
		PL_Alarm_Btn.innerHTML=lg.get("IDS_SAFARI_SET");
		PL_BuzzerMooTime.innerHTML=lg.get("IDS_BUZZER");
		document.getElementById("PLBuzzerMooTime").options[0].innerHTML=lg.get("IDS_OFF");//关闭
		second=lg.get("IDS_SECOND");
		document.getElementById("PLBuzzerMooTime").options[1].innerHTML="10"+second;//10秒
		document.getElementById("PLBuzzerMooTime").options[2].innerHTML="20"+second;//20秒
		document.getElementById("PLBuzzerMooTime").options[3].innerHTML="40"+second;//40秒
		document.getElementById("PLBuzzerMooTime").options[4].innerHTML="60"+second;//60秒
		PL_AlarmOutTime.innerHTML=lg.get("IDS_ALARM_OUTTIME");
		document.getElementById("PLAlarmOutTime").options[1].innerHTML="10"+second;//10秒
		document.getElementById("PLAlarmOutTime").options[2].innerHTML="20"+second;//20秒
		document.getElementById("PLAlarmOutTime").options[3].innerHTML="40"+second;//40秒
		document.getElementById("PLAlarmOutTime").options[4].innerHTML="60"+second;//60秒
		PL_RecordDelayTime.innerHTML=lg.get("IDS_RECORD_DELAYTIME");
		minute = lg.get("IDS_MINUTE");
		document.getElementById("PLRecordDelayTime").options[0].innerHTML="30"+second;//30秒
		document.getElementById("PLRecordDelayTime").options[1].innerHTML="1"+minute;//1分钟
		document.getElementById("PLRecordDelayTime").options[2].innerHTML="2"+minute;//2分钟
		document.getElementById("PLRecordDelayTime").options[3].innerHTML="5"+minute;//5分钟
		PL_AlarmOutManager.innerHTML=lg.get("IDS_ALARM_OUT");
		//PL_AlarmOutManager.innerHTML=lg.get("IDS_ALARM_OUT");
	}
	else if(pageName=="ProManage"){
		proManage.innerHTML=lg.get("IDS_PRO_MANAGE");//协议管理
		ProMEx.innerHTML=lg.get("IDS_EXIT");
		ProMRf.innerHTML=lg.get("IDS_REFRESH");
		ProMSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		prom_select.innerHTML=lg.get("IDS_CUSTOM_PROTOCOL");//自定义协议
		prom_name.innerHTML=lg.get("IDS_PROTOCOL_NAME");//协议名字
		prom_Streamtype.innerHTML=lg.get("IDS_STREAM_TYPE");//码流类型
		mainStream.innerHTML=lg.get("IDS_MAINSTREAM");//主码流
		subStream.innerHTML=lg.get("IDS_SUBSTREAM");//子码流
		prom_type.innerHTML=lg.get("IDS_TYPE");//类型
		prom_pro.innerHTML=lg.get("IDS_TRANS_PROTOCOL");//传输协议
		prom_port.innerHTML=lg.get("IDS_FTP_PORT");//端口
		prom_root.innerHTML=lg.get("IDS_RESOURCE_PATH");//资源路径
		example.innerHTML=lg.get("IDS_EXAMPLE")//示例
			+"：</br>["+lg.get("IDS_TYPE")//类型
			+"]://["+lg.get("IDS_NET_IPADDR")//IP地址
			+"]:["+lg.get("IDS_FTP_PORT")//端口
			+"]/["+lg.get("IDS_RESOURCE_PATH")//资源路径
			+"]</br>rtsp://192.168.0.1:554/0";
		//示例：</br>[类型]://[IP地址]/[资源路径]</br>rtsp://192.168.0.1:554/resourcePath
		
	}else if(pageName=="SG_platform"){
		SG_plat.innerHTML=lg.get("IDS_SGPLAT");
		SGRf.innerHTML=lg.get("IDS_REFRESH");
		SGSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		SGEXIT.innerHTML=lg.get("IDS_EXIT");
		SG_platform_enbale.innerHTML=lg.get("IDS_SGPLAT_ENABLE");
		document.getElementById("SG_platform_switch").options[0].innerHTML=lg.get("IDS_DISABLE");//关闭
		document.getElementById("SG_platform_switch").options[1].innerHTML=lg.get("IDS_ENABLE");//打开
		SG_platform_id.innerHTML=lg.get("IDS_SGPLAT_ID");
		SG_Hostname_Text.innerHTML=lg.get("IDS_SGPLAT_IP");
		SG_platform_port.innerHTML=lg.get("IDS_SGPLAT_PORT");
		
		SG_before_trigger.innerHTML=lg.get("IDS_SGPLAT_BEFORETRIGGER");
		beforesec.innerHTML=lg.get("IDS_SECOND");
		SG_after_trigger.innerHTML=lg.get("IDS_SGPLAT_AFTERTRIGGER");
		aftersec.innerHTML=lg.get("IDS_SECOND");
		SG_img_interval.innerHTML=lg.get("IDS_IMG_INTERVAL");
		intervalsec.innerHTML=lg.get("IDS_SECOND");
		SG_chn_num.innerHTML=lg.get("IDS_SGPLAT_CHANNEL");
		SG_upload_time1.innerHTML=lg.get("IDS_SGPLAT_UPLOADTIME1");
		SG_upload_time2.innerHTML=lg.get("IDS_SGPLAT_UPLOADTIME2");
		SG_repair.innerHTML=lg.get("IDS_SGPLAT_REPAIRE");
		SG_maintain.innerHTML=lg.get("IDS_SGPLAT_MAINTAIN");
		SG_manualupload.innerHTML=lg.get("IDS_SGPLAT_MANUALUPLOAD");
		SG_repair_type.innerHTML=lg.get("IDS_SGPLAT_REPAIRTYPE");
		
		document.getElementById("SG_repair_switch").options[0].innerHTML=lg.get("IDS_SGPLAT_REPAIR0");
		document.getElementById("SG_repair_switch").options[1].innerHTML=lg.get("IDS_SGPLAT_REPAIR1");
		document.getElementById("SG_repair_switch").options[2].innerHTML=lg.get("IDS_SGPLAT_REPAIR2");
		document.getElementById("SG_repair_switch").options[3].innerHTML=lg.get("IDS_SGPLAT_REPAIR3");
		document.getElementById("SG_repair_switch").options[4].innerHTML=lg.get("IDS_SGPLAT_REPAIR4");
		document.getElementById("SG_repair_switch").options[5].innerHTML=lg.get("IDS_SGPLAT_REPAIR5");
		document.getElementById("SG_repair_switch").options[6].innerHTML=lg.get("IDS_SGPLAT_REPAIR6");
		document.getElementById("SG_repair_switch").options[7].innerHTML=lg.get("IDS_SGPLAT_REPAIR7");
		
		SG_error_type.innerHTML=lg.get("IDS_SGPLAT_ERRORTYPE");
		
		document.getElementById("SG_error_switch").options[0].innerHTML=lg.get("IDS_SGPLAT_ERROR0");
		document.getElementById("SG_error_switch").options[1].innerHTML=lg.get("IDS_SGPLAT_ERROR1");
		document.getElementById("SG_error_switch").options[2].innerHTML=lg.get("IDS_SGPLAT_ERROR2");
		document.getElementById("SG_error_switch").options[3].innerHTML=lg.get("IDS_SGPLAT_ERROR3");
		document.getElementById("SG_error_switch").options[4].innerHTML=lg.get("IDS_SGPLAT_ERROR4");
		document.getElementById("SG_error_switch").options[5].innerHTML=lg.get("IDS_SGPLAT_ERROR5");
		document.getElementById("SG_error_switch").options[6].innerHTML=lg.get("IDS_SGPLAT_ERROR6");
		document.getElementById("SG_error_switch").options[7].innerHTML=lg.get("IDS_SGPLAT_ERROR7");
		document.getElementById("SG_error_switch").options[8].innerHTML=lg.get("IDS_SGPLAT_ERROR8");
		document.getElementById("SG_error_switch").options[9].innerHTML=lg.get("IDS_SGPLAT_ERROR9");
		document.getElementById("SG_error_switch").options[10].innerHTML=lg.get("IDS_SGPLAT_ERROR10");
		document.getElementById("SG_error_switch").options[11].innerHTML=lg.get("IDS_SGPLAT_ERROR11");
		
		SG_explanation_repair.innerHTML=lg.get("IDS_SGPLAT_EXPLANATION");
		SG_repair_upload.value=lg.get("IDS_SGPLAT_UPLOAD");
		SG_maintain_type.innerHTML=lg.get("IDS_SGPLAT_MAINTAINTYPE");
		
		document.getElementById("SG_maintain_switch").options[0].innerHTML=lg.get("IDS_SGPLAT_MAINTAIN0");
		document.getElementById("SG_maintain_switch").options[1].innerHTML=lg.get("IDS_SGPLAT_MAINTAIN1");
		
		SG_repair_result.innerHTML=lg.get("IDS_SGPLAT_REPAIRRESULT");
		
		document.getElementById("SG_maintain_result").options[0].innerHTML=lg.get("IDS_SGPLAT_RESULT0");
		document.getElementById("SG_maintain_result").options[1].innerHTML=lg.get("IDS_SGPLAT_RESULT1");
		document.getElementById("SG_maintain_result").options[2].innerHTML=lg.get("IDS_SGPLAT_RESULT2");
		
		SG_explanation_maintain.innerHTML=lg.get("IDS_SGPLAT_EXPLANATION");
		SG_maintain_upload.value=lg.get("IDS_SGPLAT_UPLOAD");
		SG_image_type.innerHTML=lg.get("IDS_TYPE");
		
		document.getElementById("SG_image_switch").options[0].innerHTML=lg.get("IDS_SGPLAT_IMAGE0");
		document.getElementById("SG_image_switch").options[1].innerHTML=lg.get("IDS_SGPLAT_IMAGE1");
		document.getElementById("SG_image_switch").options[2].innerHTML=lg.get("IDS_SGPLAT_IMAGE2");
		
		NVR_SGSeletedAll.innerHTML=lg.get("IDS_PATH_ALL"); 
		SG_image_upload.value=lg.get("IDS_SGPLAT_UPLOAD");
	}else if(pageName=="Analog_Ch"){
		analog_message.innerHTML=lg.get("IDS_ANALOG_TITLE");
		lg_anaCkAll1.innerHTML=lg.get("IDS_ANALOG_TITLE");
		analog_Rf.innerHTML=lg.get("IDS_REFRESH");
		analog_Df.innerHTML=lg.get("IDS_DEFAULT");
		analog_SV.innerHTML=lg.get("IDS_CRUISE_SAVE");//Save
		//IOCP.innerHTML=lg.get("IDS_Copy");//Copy
		analog_index.innerHTML=lg.get("IDS_ANALOG_INDEX");
		analog_ChnName.innerHTML=lg.get("IDS_ANALOG_NAME");
		analog_Status.innerHTML=lg.get("IDS_ANALOG_STATUS");
	}else if(pageName=="Capture_Jh"){
		CapJh_sch.innerHTML=lg.get("IDS_CAPTURE_JH");
		CapJh_Rf.innerHTML=lg.get("IDS_REFRESH");
		CapJh_Df.innerHTML=lg.get("IDS_DEFAULT");
		CapJh_Save.innerHTML=lg.get("IDS_CRUISE_SAVE");
		
		CapJh_CHN_L.innerHTML=lg.get("IDS_MOTION_CH");//Channel
		$("#CapJh_WeekTop_L").text(lg.get("IDS_DST_DSTMODE01"));//Week
		document.getElementById("CapJh_WeekTop_Value").options[0].innerHTML = document.getElementById("CapJh_WeekCopy_src").options[0].innerHTML=lg.get("IDS_WEEKDAY_01");
		document.getElementById("CapJh_WeekTop_Value").options[1].innerHTML = document.getElementById("CapJh_WeekCopy_src").options[1].innerHTML=lg.get("IDS_WEEKDAY_02");
		document.getElementById("CapJh_WeekTop_Value").options[2].innerHTML = document.getElementById("CapJh_WeekCopy_src").options[2].innerHTML=lg.get("IDS_WEEKDAY_03");
		document.getElementById("CapJh_WeekTop_Value").options[3].innerHTML = document.getElementById("CapJh_WeekCopy_src").options[3].innerHTML=lg.get("IDS_WEEKDAY_04");
		document.getElementById("CapJh_WeekTop_Value").options[4].innerHTML = document.getElementById("CapJh_WeekCopy_src").options[4].innerHTML=lg.get("IDS_WEEKDAY_05");
		document.getElementById("CapJh_WeekTop_Value").options[5].innerHTML = document.getElementById("CapJh_WeekCopy_src").options[5].innerHTML=lg.get("IDS_WEEKDAY_06");
		document.getElementById("CapJh_WeekTop_Value").options[6].innerHTML = document.getElementById("CapJh_WeekCopy_src").options[6].innerHTML=lg.get("IDS_WEEKDAY_07");
		
		if(lgCls.version == "SWANN"/* || lgCls.version == "OWL"*/){
			CapJh_AlarmTag2.innerHTML="A-"+lg.get("IDS_RECPLAN_TYPE03");//Alarm
			CapJh_normal_hin2.innerHTML="N-"+lg.get("IDS_RECPLAN_TYPE02");//Normal
			CapJh_MotionTag3.innerHTML="M-"+lg.get("IDS_DEFAULT_MOTION");//Motion
			CapJh_NullTag2.innerHTML=lg.get("IDS_RECPLAN_TYPE01");//No Record
		}else{
			CapJh_AlarmTag2.innerHTML=lg.get("IDS_RECPLAN_TYPE03");//Alarm
			CapJh_normal_hin2.innerHTML=lg.get("IDS_RECPLAN_TYPE02");//Normal
			CapJh_MotionTag3.innerHTML=lg.get("IDS_DEFAULT_MOTION");//Motion
			CapJh_NullTag2.innerHTML=lg.get("IDS_RECPLAN_TYPE01");//No Record
		}
		
		CapJh_ChCopy_cp.innerHTML=lg.get("IDS_REC_COPYCH");
		CapJh_WeekCopy_cp.innerHTML=lg.get("IDS_RECPLAN_COPYDAY");
		
		CapJh_ChCopy_btn.value=lg.get("IDS_Copy");
		CapJh_WeekCopy_btn.value=lg.get("IDS_Copy");
		
		CapJh_WeekCopy_to.innerHTML=lg.get("IDS_COPY_TO");
		CapJh_ChCopy_to.innerHTML=lg.get("IDS_COPY_TO");
		
		document.getElementById("CapJh_WeekCopy_dest").options[0].innerHTML=lg.get("IDS_PATH_ALL");//sun
		document.getElementById("CapJh_WeekCopy_dest").options[1].innerHTML=lg.get("IDS_WEEKDAY_01");//sun
		document.getElementById("CapJh_WeekCopy_dest").options[2].innerHTML=lg.get("IDS_WEEKDAY_02");//sun
		document.getElementById("CapJh_WeekCopy_dest").options[3].innerHTML=lg.get("IDS_WEEKDAY_03");//sun
		document.getElementById("CapJh_WeekCopy_dest").options[4].innerHTML=lg.get("IDS_WEEKDAY_04");//sun
		document.getElementById("CapJh_WeekCopy_dest").options[5].innerHTML=lg.get("IDS_WEEKDAY_05");//sun
		document.getElementById("CapJh_WeekCopy_dest").options[6].innerHTML=lg.get("IDS_WEEKDAY_06");//sun
		document.getElementById("CapJh_WeekCopy_dest").options[7].innerHTML=lg.get("IDS_WEEKDAY_07");//sun
	}else if(pageName=="Capture_Set"){
		Cap_Set.innerHTML=lg.get("IDS_CAPTURE_SET");//抓图设置
		CapSetCP.value=lg.get("IDS_Copy");
		CapSetRf.innerHTML=lg.get("IDS_REFRESH");
		CapSetDf.innerHTML=lg.get("IDS_DEFAULT");
		CapSetSV.innerHTML=lg.get("IDS_CRUISE_SAVE");
		
		cap_channel_num.innerHTML=lg.get("IDS_MOTION_CH");
		auto_cap.innerHTML=lg.get("IDS_CAP_AUTO");//自动抓图
		manual_cap.innerHTML=lg.get("IDS_CAP_MANUAL");//手动抓图
		document.getElementById("Cap_autocap").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");
		document.getElementById("Cap_autocap").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");
		document.getElementById("Cap_manualcap").options[0].innerHTML=lg.get("IDS_OSD_DISABLE");
		document.getElementById("Cap_manualcap").options[1].innerHTML=lg.get("IDS_OSD_ENABLE");
		
		cap_bitrate_mode.innerHTML=lg.get("IDS_CAP_BITMODE");//码流模式
		document.getElementById("cap_bitrate_switch").options[0].innerHTML=lg.get("IDS_CODE_STREAM_01");
		document.getElementById("cap_bitrate_switch").options[1].innerHTML=lg.get("IDS_CODE_STREAM_02");
	
		normal_interval.innerHTML=lg.get("IDS_CAP_N");//常规间隔
		motion_interval.innerHTML=lg.get("IDS_CAP_M");//动检间隔
		temp=lg.get("IDS_SECOND");
		document.getElementById("N_CapSet").options[0].innerHTML=document.getElementById("M_CapSet").options[0].innerHTML="5"+temp;//5秒
		document.getElementById("N_CapSet").options[1].innerHTML=document.getElementById("M_CapSet").options[1].innerHTML="10"+temp;
		document.getElementById("N_CapSet").options[2].innerHTML=document.getElementById("M_CapSet").options[2].innerHTML="30"+temp;
		temp=lg.get("IDS_MINUTE");
		document.getElementById("N_CapSet").options[3].innerHTML=document.getElementById("M_CapSet").options[3].innerHTML="1"+temp;//1分
		document.getElementById("N_CapSet").options[4].innerHTML=document.getElementById("M_CapSet").options[4].innerHTML="10"+temp;
		document.getElementById("N_CapSet").options[5].innerHTML=document.getElementById("M_CapSet").options[5].innerHTML="30"+temp;
		temp=lg.get("IDS_HOUR");
		document.getElementById("N_CapSet").options[6].innerHTML=document.getElementById("M_CapSet").options[6].innerHTML="1"+temp;//1小时
		
		CapSeletedAll.innerHTML=lg.get("IDS_PATH_ALL");
		CapOk.value=lg.get("IDS_Copy");
		CapSelectCopy.innerHTML=lg.get("IDS_SEL_CHID");
	}
}
