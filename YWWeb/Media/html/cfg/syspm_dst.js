// JavaScript Document
//AddYear
Date.prototype.AddYear = function (Year) {
	if (typeof Year == 'number') {
		return new Date((this.getFullYear() + Year), this.getMonth(), this.getDate(), this.getHours(), this.					getMinutes(), this.getSeconds());
	};
	return "";
};
//AddSecond
Date.prototype.AddSecond = function (Second) {
	if (typeof Second == 'number') {
		return new Date(Date.parse(this) + (1000 * Second));
	};
	return "";
};
//AddMinute
Date.prototype.AddMinute = function (Minute) {
	if (typeof Minute == 'number') {
		return new Date(Date.parse(this) + (60000 * Minute));
	};
	return "";
};
//AddHour
Date.prototype.AddHour = function (Hour) {
	if (typeof Hour == 'number') {
		return new Date(Date.parse(this) + (3600000 * Hour));
	};
	return "";
};
$(document).ready(function(){
	//RCI客户
	var threeUsers = false
	if(lgCls.version=="RCI")
	{
		threeUsers = true;
		$("#chn_resolution_div").css("display","block");
		//$("#DSTVideoFormat").removeAttr("disabled");
	}
	if(lgCls.version == "BRIGHT"){
		$("#DSTDiv").css("display","none");
	}
	if(g_bDefaultShow == true){
		$("#SysDstDf").css("display","block");
	}
	
	if(gDvr.DevType==3){
		$("#DSTAutoLogout").append('<option value="0">OFF</option>');
		$("#DSTAutoLogout").append('<option value="1">30S</option>');
		$("#DSTAutoLogout").append('<option value="2">1 Min</option>');
		$("#DSTAutoLogout").append('<option value="3">2 Min</option>');
		$("#DSTAutoLogout").append('<option value="4">5 Min</option>');
		$("#DSTAutoLogout").append('<option value="5">10 Min</option>');
		
		//翻译
		document.getElementById("DSTAutoLogout").options[0].innerHTML=lg.get("IDS_OFF");//关闭
		temp=lg.get("IDS_SECOND");
		document.getElementById("DSTAutoLogout").options[1].innerHTML="30"+temp;//30秒
		temp=lg.get("IDS_MINUTE");
		document.getElementById("DSTAutoLogout").options[2].innerHTML="1"+temp;//1M
		document.getElementById("DSTAutoLogout").options[3].innerHTML="2"+temp;//2M
		document.getElementById("DSTAutoLogout").options[4].innerHTML="5"+temp;//5M
		document.getElementById("DSTAutoLogout").options[5].innerHTML="10"+temp;//10M
	}
	else if(gDvr.hybirdDVRFlag==1){
		$("#DSTAutoLogout").append('<option value="0">30S</option>');
		$("#DSTAutoLogout").append('<option value="1">1 Min</option>');
		$("#DSTAutoLogout").append('<option value="2">2 Min</option>');
		$("#DSTAutoLogout").append('<option value="3">5 Min</option>');
		$("#DSTAutoLogout").append('<option value="4">10 Min</option>');
		$("#DSTAutoLogout").append('<option value="5">OFF</option>');
		
		//翻译
		temp=lg.get("IDS_SECOND");
		document.getElementById("DSTAutoLogout").options[0].innerHTML="30"+temp;//30秒
		temp=lg.get("IDS_MINUTE");
		document.getElementById("DSTAutoLogout").options[1].innerHTML="1"+temp;//1M
		document.getElementById("DSTAutoLogout").options[2].innerHTML="2"+temp;//2M
		document.getElementById("DSTAutoLogout").options[3].innerHTML="5"+temp;//5M
		document.getElementById("DSTAutoLogout").options[4].innerHTML="10"+temp;//10M
		document.getElementById("DSTAutoLogout").options[5].innerHTML=lg.get("IDS_OFF");//关闭
	}
	
	/*
	if(gDvr.DevType==4){	
	}else if(gDvr.DevType==3){
		$("#table_autologout,#table_language").css("display","block");
		$("#table_videoformat").css("display","block");
	}else{
		$("#table_videoformat,#table_autologout,#table_language").css("display","block");
	}
	*/
	if(lgCls.version == "KGUARD"){
		document.getElementById("VIDEO_FORMAT").innerHTML = lg.get("IDS_BASE_FLICKER");
		$("#DSTVideoFormat").empty();
		$("#DSTVideoFormat").append('<option class="option" value="0">'+'50HZ'+'</option>');
		$("#DSTVideoFormat").append('<option class="option" value="1">'+'60HZ'+'</option>');
	}
	//初始操作
	var timeType;
	$(function(){
		$('#SysDstSysTime').simpleDatepicker({type:1,x:$('#SysDstSysTime').offset().left - $(".mcmain").offset().left,y:$('#SysDstSysTime').offset().top - $(".mcmain").offset().top + 20,Laguage:gVar.lg,name:"DstPiTimer1", nIframe:"iframe1", UseZS:true});
		
		$('#DstStartDate').simpleDatepicker({type:1,x:$('#DstStartDate').offset().left - $(".mcmain").offset().left,y:$('#DstStartDate').offset().top - $(".mcmain").offset().top - 40,Laguage:gVar.lg,name:"DstPiTimer2", nIframe:"iframe2"});
		$('#DstEndDate').simpleDatepicker({type:1,x:$('#DstEndDate').offset().left - $(".mcmain").offset().left,y:$('#DstEndDate').offset().top - $(".mcmain").offset().top - 40,Laguage:gVar.lg,name:"DstPiTimer3", nIframe:"iframe3"});
		
		$("#SysDstSysTimerObj").timer();
		$("#dstTimer1").timer({Type:1})
		$("#dstTimer2").timer({Type:1})
		$("#dstTimer3").timer({Type:1})
		$("#dstTimer4").timer({Type:1})
		
		//MasklayerShow();
		
		RfParamCall(Call, $("#sdt_base_config").text(), "SysDst", 100, "Get");	//初始时获取页面数据
	});

		
	function Call(xml){
			timeType = findNode("DateMode", xml)*1;
			$('#SysDstSysTime').simpleDatepicker.TimeType = timeType;
			
			var time = findNode("time", xml);
			$("#SysDstSysTimerObj").timer.SetTimeIn24(time.split(",")[1], $("#SysDstSysTimerObj"));
			
			time = time.split(",")[0];
			time = time.split('-')[0]+"/"+time.split('-')[1]+"/"+time.split('-')[2];
			$("#SysDstSysTime").prop("glcal",new Date(time));
			$("#SysDstSysTime").val($('#SysDstSysTime').simpleDatepicker.formatOutputHL(new Date(time), true));
			
			$("#SysDstTimeMode").val(findNode("TimeMode", xml));
			$("#SysDstMode").val(findNode("DstMode", xml));
			$("#SysDstDateMode").val(findNode("DateMode", xml));
			
			$("#SysDstOffset").val(findNode("Offset", xml));
			
			/*-------周模式-------*/
			$("#DstStartMonth").val(findNode("StartMonth", xml));
			$("#DstStartWeek").val(findNode("StartWeek", xml));
			$("#DstStartWeekDay").val(findNode("StartWeekDay", xml));
			$("#DstEndMonth").val(findNode("EndMonth", xml));
			$("#DstEndWeek").val(findNode("EndWeek", xml));
			$("#DstEndWeekDay").val(findNode("EndWeekDay", xml));
			
			$("#dstTimer1").timer.SetTimeIn24(findNode("StartTime", xml), $("#dstTimer1"));
			$("#dstTimer2").timer.SetTimeIn24(findNode("EndTime", xml), $("#dstTimer2"));
			/*-------日期模式----*/
			//年小于2010时会缺个零，如2009显示209，下面补0
			var tempdate = findNode("StartDate", xml);
			var length = tempdate.indexOf('-');
			var year = tempdate.substr(0,length);
			if(199<year && year< 210){
				year = 2000 + year%10;
				tempdate = year + tempdate.substr(length);
			}
			tempdate = tempdate.split('-')[0]+"/"+tempdate.split('-')[1]+"/"+tempdate.split('-')[2];
			$("#DstStartDate").prop("glcal",new Date(tempdate));
			$("#DstStartDate").val($("#DstStartDate").simpleDatepicker.formatOutputHL(new Date(tempdate), false));
			
			tempdate = findNode("EndDate", xml);
			length = tempdate.indexOf('-');
			year = tempdate.substr(0,length);
			if(199<year && year< 210){
				year = 2000 + year%10;
				tempdate = year + tempdate.substr(length);
			}
			tempdate = tempdate.split('-')[0]+"/"+tempdate.split('-')[1]+"/"+tempdate.split('-')[2];
			$("#DstEndDate").prop("glcal",new Date(tempdate));
			$("#DstEndDate").val($("#DstEndDate").simpleDatepicker.formatOutputHL(new Date(tempdate), false));
			//$("#DstEndDate").val(tempdate);
			
			$("#dstTimer3").timer.SetTimeIn24(findNode("StartTime", xml), $("#dstTimer3"));
			$("#dstTimer4").timer.SetTimeIn24(findNode("EndTime", xml), $("#dstTimer4"));
			
			$("#SysDstUseDST").prop("checked", (findNode("Dst", xml)*1));
			
			$("#SysDstMode").change();
			DivBox("#SysDstUseDST", "#DSTXLSEnable");
			setTimeout(function(){$("#SysDstTimeMode").change()}, 1);
			//NTP
			$("#NtpNtpIPAddr").empty();
			switch(lgCls.version){
				case "LOREX":{
					$("#NtpNtpIPAddr").append('<option class="option" value="'+1+'">time.nist.gov</option>');
					$("#NtpNtpIPAddr").append('<option class="option" value="'+2+'">pool.ntp.org</option>');
					$("#NtpNtpIPAddr").append('<option class="option" value="'+3+'">ntp.lorexddns.net</option>');
					break;
				}
				default:{
					$("#NtpNtpIPAddr").append('<option class="option" value="'+0+'">time.windows.com</option>');
					$("#NtpNtpIPAddr").append('<option class="option" value="'+1+'">time.nist.gov</option>');
					$("#NtpNtpIPAddr").append('<option class="option" value="'+2+'">pool.ntp.org</option>');
					break;
				}
			}
			
			$("#NtpUseNtp").prop("checked", findNode("UseNtp", xml)*1);
			$("#NtpNtpIPAddr").val(findNode("NtpIPAddr", xml));
			$("#NtpTimeZone").val(findNode("TimeZone", xml));
			DivBox("#NtpUseNtp", "#NtpDivBox");
			
			$("#DSTLanguage").val(findNode("Language", xml));
			$("#DSTVideoFormat").val(findNode("VideoFormat", xml));
			$("#DSTAutoLogout").val(findNode("AutoLogout", xml));
			$("#SysStartShowWizard").val(findNode("ShowWizard", xml));
			if(threeUsers){
				$("#chn_resolution").val(findNode("vgaresolution", xml)*1);
			}
	}
	
	//刷新
	$("#SysDstRf").click(function(){
		//MasklayerShow();
		g_bClickDefBtn = false;
		RfParamCall(Call, $("#sdt_base_config").text(), "SysDst", 100, "Get");	//刷新页面数据
	});
	
	$("#SysDstDf").click(function(){
		g_bClickDefBtn = true;
		RfParamCall(Call, $("#sdt_base_config").text(), "SysDst", 850, "Get");
	});
	
	//保存
	$("#SysDstSave").click(function(){
		//MasklayerShow();
/*		var bsunsta = $("#DstStartWeekDay").val();
		if(bsunsta == 0){
			bsunsta = 7;
		}
		var bsunend = $("#DstEndWeekDay").val();
		if(bsunend == 0){
			bsunend= 7;
		}
		var time1 = $("#dstTimer1").timer.GetTimeFor24($("#dstTimer1"));
		var time2 = $("#dstTimer2").timer.GetTimeFor24($("#dstTimer2"));
		var hour1 = time1.split(':')[0];
		var minute1 = time1.split(':')[1];
		var sec1 = time1.split(':')[2];
		var hour2 = time2.split(':')[0];
		var minute2 = time2.split(':')[1];
		var sec2 = time2.split(':')[2];
		var staTime = (new Date($("#DstStartMonth").val(),$("#DstStartWeek").val(),bsunsta, hour1, minute1, sec1, 0)).getTime()*1; //得到毫秒数
		var endTime = (new Date($("#DstEndMonth").val(),$("#DstEndWeek").val(),bsunend, hour2, minute2, sec2, 0)).getTime()*1; //得到毫秒数
*/
		var date1 = $("#DstStartDate").prop("glcal");
		var date2 = $("#DstEndDate").prop("glcal");
		var time3 = $("#dstTimer3").timer.GetTimeFor24($("#dstTimer3"));
		var time4 = $("#dstTimer4").timer.GetTimeFor24($("#dstTimer4"));
		var DstaTime = (new Date(date1.getFullYear(),date1.getMonth()*1+1,date1.getDate(), time3.split(':')[0], time3.split(':')[1], time3.split(':')[2], 0)).getTime()*1;
		var DendTime = (new Date(date2.getFullYear(),date2.getMonth()*1+1,date2.getDate(), time4.split(':')[0], time4.split(':')[1], time4.split(':')[2], 0)).getTime()*1;
		if($("#SysDstUseDST").prop("checked")==1){
			if(DstaTime>DendTime && $("#SysDstMode").val()*1 != 0)
			{
				ShowPaop($("#sdt_base_config").text(),lg.get("IDS_SAVE_FAILED"));
				return;	
			}
		}
		
		if ($("#SysDstMode").val()*1 == 0){//周模式
		/*
			//在"月、第几个星期、星期几"相同的前提下，"起止时间差"需要大于SysDstOffset的值(1小时或2小时)
			var startMonth = $("#DstStartMonth").val();//月
			var endMonth = $("#DstEndMonth").val();
			var startWeek = $("#DstStartWeek").val();//第几个星期
			var endWeek = $("#DstEndWeek").val();
			var startWeekDay = $("#DstStartWeekDay").val();//星期几
			var endWeekDay = $("#DstEndWeekDay").val();
			
			if(startMonth==endMonth && startWeek==endWeek && startWeekDay==endWeekDay){
				var startTime = $("#dstTimer1").timer.GetTimeFor24($("#dstTimer1"));//小 //timerHour+ ":" + timerMin + ":" + timerSec
				var startHour = startTime.split(":")[0]*1;
				var startMinute = startTime.split(":")[1]*1;
				var startSecond = startTime.split(":")[2]*1;
				var startTime = startHour*60*60 + startMinute*60 + startSecond;//以秒为单位
			
				var endTime = $("#dstTimer2").timer.GetTimeFor24($("#dstTimer2"));//大 //timerHour+ ":" + timerMin + ":" + timerSec
				var endHour = endTime.split(":")[0]*1;
				var endMinute = endTime.split(":")[1]*1;
				var endSecond = endTime.split(":")[2]*1;
				var endTime = endHour*60*60 + endMinute*60 + endSecond;//以秒为单位
				
				var nowOffsetTime = endTime - startTime;//起止时间差
				var minOffsetTime = ($("#SysDstOffset").val()*1 + 1)*60*60;//0:60分钟 1:120分钟 //允许的时间差
				
				if(nowOffsetTime < minOffsetTime){//如果起止时间差小，则弹出框
					if($("#SysDstOffset").val()*1==0){//1小时
						ShowPaop($("#sdt_base_config").text(),"End date must be greater than start date for 1 hours,please try again!");
					}else{//2小时
						ShowPaop($("#sdt_base_config").text(),"End date must be greater than start date for 2 hours,please try again!");
					}
					return;
				}
			}
			*/
		}else{//Date日期模式
			var startTime = $("#dstTimer3").timer.GetTimeFor24($("#dstTimer3"));//小 //timerHour+ ":" + timerMin + ":" + timerSec
			var startHour = startTime.split(":")[0]*1;
			var startMinute = startTime.split(":")[1]*1;
			var startSecond = startTime.split(":")[2]*1;
			
			var endTime = $("#dstTimer4").timer.GetTimeFor24($("#dstTimer4"));//大 //timerHour+ ":" + timerMin + ":" + timerSec
			var endHour = endTime.split(":")[0]*1;
			var endMinute = endTime.split(":")[1]*1;
			var endSecond = endTime.split(":")[2]*1;
			
			var tempStartDate = $("#DstStartDate").prop("glcal");
			tempStartDate = tempStartDate.AddHour(startHour).AddMinute(startMinute).AddSecond(startSecond);
			var tempEndDate = $("#DstEndDate").prop("glcal");
			tempEndDate = tempEndDate.AddHour(endHour).AddMinute(endMinute).AddSecond(endSecond);//单位毫秒
			//var userSetoffsetTime = (endHour*60+endMinute) - (startHour*60+startMinute);//大-小
			var userSetoffsetTime = tempEndDate.getTime() - tempStartDate.getTime();//单位毫秒
			var canOffsetTime = ($("#SysDstOffset").val()*1 + 1)*3600000;//0:3600000毫秒 1:7200000毫秒
			
			tempStartDate = tempStartDate.AddYear(1);//startDate和endDate相差不能超过1年
			
			if(userSetoffsetTime < canOffsetTime){//用户设置的时间差 必须要大于 允许的时间差(SysDstOffset.val)
				//ShowPaop($("#sdt_base_config").text(),lg.get("IDS_ENDTIME_BIG"));
				if($("#SysDstOffset").val()*1==0){//1小时
					ShowPaop($("#sdt_base_config").text(),lg.get("IDS_GREATER_THAN_1HOUR"));
				}else{//2小时
					ShowPaop($("#sdt_base_config").text(),lg.get("IDS_GREATER_THAN_2HOUR"));
				}
				return;
			}
			//时间相隔不能超过1年
			
			if(tempStartDate.getTime() < tempEndDate.getTime())
			{
				ShowPaop($("#sdt_base_config").text(),lg.get("IDS_LESS_THAN_1YEAR"));
				return ;
			}
			
		}
		
		var xml = "<a>";
		var tmode = $("#SysDstTimeMode").val();
		var dmode = $("#SysDstDateMode").val();
		var time=$("#SysDstSysTime").prop("glcal");
		var timestr = time.getFullYear()+"-"+(time.getMonth()*1+1)+"-"+time.getDate();
		/*if (timeType == 0){
			time = time.split('/')[2] +"-"+ time.split('/')[0] +"-"+ time.split('/')[1];
		}else if (timeType == 2){
			time = time.split('/')[2] +"-"+ time.split('/')[1] +"-"+ time.split('/')[0];
		}*/
		//$("#SysDstSysTime").val(year+'-'+month+'-'+day);
		xml += ("<time>" + timestr + "," + $("#SysDstSysTimerObj").timer.GetTimeFor24($("#SysDstSysTimerObj")) + "</time>");
		xml += ("<TimeMode>" + $("#SysDstTimeMode").val() + "</TimeMode>"); 
		xml += ("<DstMode>" + $("#SysDstMode").val() + "</DstMode>");
		xml += ("<DateMode>" + $("#SysDstDateMode").val() + "</DateMode>");	
		xml += ("<Offset>" + $("#SysDstOffset").val() + "</Offset>");
		/*-------周模式-------*/
		xml += ("<StartMonth>" + $("#DstStartMonth").val() + "</StartMonth>");
		xml += ("<StartWeek>" + $("#DstStartWeek").val() + "</StartWeek>");	
		xml += ("<StartWeekDay>" + $("#DstStartWeekDay").val() + "</StartWeekDay>");
	
		xml += ("<EndMonth>" + $("#DstEndMonth").val() + "</EndMonth>");
		xml += ("<EndWeek>" + $("#DstEndWeek").val() + "</EndWeek>");
		xml += ("<EndWeekDay>" + $("#DstEndWeekDay").val() + "</EndWeekDay>");
		time=$("#DstStartDate").prop("glcal");
		timestr = time.getFullYear()+"-"+(time.getMonth()*1+1)+"-"+time.getDate();
		xml += ("<StartDate>" + timestr + "</StartDate>");
		time=$("#DstEndDate").prop("glcal");
		timestr = time.getFullYear()+"-"+(time.getMonth()*1+1)+"-"+time.getDate();
		xml += ("<EndDate>" + timestr + "</EndDate>");
		
		//时间判断
		if ($("#SysDstMode").val()*1 == 0){	//周模式 
			xml += ("<StartTime>" + $("#dstTimer1").timer.GetTimeFor24($("#dstTimer1")) + "</StartTime>");
			xml += ("<EndTime>" +$("#dstTimer2").timer.GetTimeFor24($("#dstTimer2")) + "</EndTime>");
		}else{
			xml += ("<StartTime>" + $("#dstTimer3").timer.GetTimeFor24($("#dstTimer3")) + "</StartTime>");
			xml += ("<EndTime>" +$("#dstTimer4").timer.GetTimeFor24($("#dstTimer4")) + "</EndTime>");
		}
		xml += ("<Dst>" + ($("#SysDstUseDST").prop("checked")*1) + "</Dst>");
		
		//NTP
		xml += ("<UseNtp>" + ($("#NtpUseNtp").prop("checked")*1) + "</UseNtp>");
		xml += ("<NtpIPAddr>" + ($("#NtpNtpIPAddr").val()) + "</NtpIPAddr>");
		xml += ("<TimeZone>" + ($("#NtpTimeZone").val()) + "</TimeZone>");
		
		xml += ("<Language>"+ $("#DSTLanguage").val() + "</Language>");
		xml += ("<VideoFormat>"+ $("#DSTVideoFormat").val() + "</VideoFormat>");
		xml += ("<AutoLogout>"+ $("#DSTAutoLogout").val() + "</AutoLogout>");
		
		xml += ("<ShowWizard>"+ $("#SysStartShowWizard").val() + "</ShowWizard>");
		if(threeUsers){
			xml += ("<vgaresolution>" + ($("#chn_resolution").val()*1) + "</vgaresolution>");
		}
		xml += "</a>";
		RfParamCall(Call, $("#sdt_base_config").text(), "SysDst", 300, "Set", xml);	//保存
	});

	$("#SysDstUseDST").click(function(){
		DivBox("#SysDstUseDST", "#DSTXLSEnable");
	});
	
	$("#SysDstMode").change(function(){
		if ($("#SysDstMode").val() == 0){ //周模式
		
			$("#DstDate").css("display", "");
			$("#DstTime").css("display", "none");
		}else {
		
			$("#DstDate").css("display", "none");
			$("#DstTime").css("display", "");
		}
	});

	$("#SysDstTimeMode").change(function(){
		$("#SysDstSysTimerObj").timer.ChangeType(1-$(this).val()*1, $("#SysDstSysTimerObj"));
	})
	
	
	
	//根据日期格式修改系统时间
	
	$("#SysDstDateMode").change(function(){
		var type = $(this).val()*1;
		$('#SysDstSysTime').simpleDatepicker.TimeType = type;
		//var time = $("#SysDstSysTime").val()
		/*if (timeType == 0){
			time = time.split('/')[2]+"/"+time.split('/')[0]+"/"+time.split('/')[1];
		}else if (timeType == 1){
			time = time.split('-')[0]+"/"+time.split('-')[1]+"/"+time.split('-')[2];
		}else if (timeType == 2){
			time = time.split('/')[2]+"/"+time.split('/')[1]+"/"+time.split('/')[0];
		}*/
		timeType = type;
		$("#SysDstSysTime").val($('#SysDstSysTime').simpleDatepicker.formatOutputHL($("#SysDstSysTime").prop("glcal"), true));
	})
	
	$("#ChoseDST, #ChoseNTP").click(function(){
		if ($(this).attr("id") == "ChoseDST"){
			$("#ChoseNTPT").css("display", "none")
			$("#ChoseDstT").css("height", "auto").css("display", "block")
		}else{
			$("#ChoseNTPT").css("display", "block")
			$("#ChoseDstT").css("display", "none")
		}
	})
	
	$("#NtpUseNtp").click(function(){
		DivBox("#NtpUseNtp", "#NtpDivBox");
	});
});


