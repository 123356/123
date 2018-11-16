// JavaScript Document
$(document).ready(function(){
	if(lgCls.version == "KGUARD"){
		$("#UploadPhotoTimeTrigger option[value='1']").remove();
	}
	MasklayerHide();
	var ChnNoChoice = 0;  // 按位取对应通道标志
	
	$(function(){		
		RfParamCall(Call, $("#UploadPhoto_Title").text(), "UploadPhoto", 100, "Get");  //一进来，先刷新页面		
	});
	
	var color = "rgb(0, 102, 0)";
	$("#UploadPhotoChannelBox").divBox({number:gDvr.nChannel,bkColor:color});
		
	$("#UploadPhotoExit").click(function(){		
		showConfigChild("NewCloud_Storage");  
	});
		
	$("#gotoalarm_mv").click(function(){		
		showConfigChild("alarm_mv");  
	});
	
	//MotionDetection  0:隐藏按钮  1:显示按钮
	$("#UploadPhotoMotionSnapEnable").change(function(){		
		if ( $(this).val() == 0 ){  
			$("#gotoalarm_mv").css("display","none");
		}else{  
			$("#gotoalarm_mv").css("display","block");
			$("#UploadPhotoTimeTrigger").val(0);
		}
	})	
	
	$("#UploadPhotoTimeTrigger").change(function(){		
		if ( $(this).val() != 0 ){
			$("#UploadPhotoMotionSnapEnable").val(0);
		}
	})
	
	$("#UploadPhotoSV").click(function(){
		var xml = "<a>";
		//获取ChnNoChoice的值(绿色格子的组合)  // 按位取对应通道标志位
		ChnNoChoice = 0;
		var num = 0;				
		var count = 0;
		
		$("#UploadPhotoChannelBox > div").each(function(i){
			count++;					
			if ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, "")){  //如果是绿色
				//循环次数，超过通道数时，不计数
				if(count <= gDvr.nChannel){  //8通道，循环8次；循环第9次时，不计数
					ChnNoChoice |= (1<<i);  //保存所选择的组合
					num++;							
				}	
			}
		});				
				
		/*	
		if(num>4 && $("#UploadPhotoTimeTrigger").val()==1){  //1分钟时，如果超过4个绿格
			ShowPaop($("#UploadPhoto_Title").text(), lg.get("IDS_NUM_OUTRANGE"));
			return;
		}
		*/	
		
		if(num>4 && (lgCls.version == "KGUARD" && $("#UploadPhotoTimeTrigger").val()*1 == 2)
		){
			ShowPaop($("#UploadPhoto_Title").text(), lg.get("IDS_NUM_OUTRANGEKG"));
			return;
		}
		xml += ("<ChnNoChoice>" + ChnNoChoice + "</ChnNoChoice>");  //通道组合					
		xml += ("<TimeTrigger>" + ($("#UploadPhotoTimeTrigger").val()*1) + "</TimeTrigger>");  //TimeTrigger
		xml += ("<MotionSnapEnable>" + $("#UploadPhotoMotionSnapEnable").val() + "</MotionSnapEnable>");  //MotionSnapEnable	
		xml += "</a>";	
		
		RfParamCall(Call, $("#UploadPhoto_Title").text(), "UploadPhoto", 300, "Set", xml);  //保存"无通道"数据
	});
	
	function Call(xml){		
		ChnNoChoice = findNode("ChnNoChoice",xml);  //显示格子颜色
				$("#UploadPhotoChannelBox > div").css("background-color", "transparent");  //全部透明
				$("#UploadPhotoChannelBox > div").each(function(i){
					if ((ChnNoChoice>>i)&1 == 1){
						$(this).css("background-color", color)
					}
				});				
		$("#UploadPhotoTimeTrigger").val(findNode("TimeTrigger", xml)*1 );			
		$("#UploadPhotoMotionSnapEnable").val(findNode("MotionSnapEnable", xml));
			$("#UploadPhotoMotionSnapEnable").change();
	}
	
	$("#UploadPhotoRf").click(function(){		
		RfParamCall(Call, $("#UploadPhoto_Title").text(), "UploadPhoto", 100, "Get");
	});	
});