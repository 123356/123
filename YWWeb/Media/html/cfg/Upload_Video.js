// JavaScript Document
MasklayerHide();
$(function(){
	$("#UploadVideoExit").click(function(){
		showConfigChild("NewCloud_Storage");  
	});
	
	//获取通道列表
	var sel = 0;
	var ch = 0;
	var color1 = "rgb(0, 102, 0)";
	
	function CreateDiv(id){
		var strHTML = "";
		for (var i=0; i<47; i++){
			strHTML += "<div class='divBox' id='"+id+i+"' style='height:17px;line-height:17px;float:left;width:14px; border:1px solid #FFF;border-right:none;'></div>";
		}
		strHTML += "<div class='divBoxr' id='"+id+"47' style='height:17px;line-height:17px;float:left;width:14px; border:1px solid #FFF;'></div>";
		return strHTML;
	}
	
	$(function(){
		if ($.browser.msie && $.browser.version.indexOf("9") == -1){
			color1 = color1.replace(/\s/g, "");
		}
		
		var strHTML = "";
		
		var mLeft = 0;
		for (var i=0; i<49; i++){
			if(i%4 == 0){ 
				strHTML += "<div class='divBox' style='height:10px;margin-left:"+mLeft+";width:1px; background-color:white;'></div>";
			}else{
				strHTML += "<div class='divBox' style=' margin-left:"+mLeft+"; width:1px;'><div style='height:5px;width:1px;'></div><div style='height:3px;width:1px; background-color:white;'></div></div>";
			}
			mLeft = "13px";
		}
		$("#video_Header_div").css("height","10px");
		$("#SCSP_Header").prop("innerHTML", strHTML);
		
		var textHTML = "";
		mLeft = 0;
		for (var i=0; i<49; i++){
			if(i%4 == 0){ 
				var text = i/2%24;
				textHTML += "<div class='divBox' style='height:20px;margin-left:"+mLeft+";width:20px; text-align=center; border:none;'>"+(text<10?('0'+text):text)+"</div>";
			}
			mLeft = "40px";
		}
		$("#SCSP_HeaderText").prop("innerHTML", textHTML);
		//$("#video_headTitle_div").css("display","block");
		
		$("#SCSP_motion").prop("innerHTML", CreateDiv('Mm_div_'));
		
		$("#SCSP_motion>div").mouseup(function(){
			$("#SCSP_Header").attr("name", "");
		});
		
		$(document).mouseup(function(){
			$("#SCSP_Header").attr("name", "");
		});
		
		$("#SCSP_motion>div").prop("innerText", "").mouseover(function(){
			if ($("#SCSP_Header").attr("name") == "down"){
				if ($(this).css("background-color").replace(/\s/g, "") != color1.replace(/\s/g, "")){
					$(this).css("background-color", color1);	
				}else{
					$(this).css("background-color", "transparent");
				}
			}
		}).mousedown(function(){
			$("#SCSP_Header").attr("name", "down");
			if ($(this).css("background-color").replace(/\s/g, "") != color1.replace(/\s/g, "")){
				$(this).css("background-color", color1);
			}else{
				$(this).css("background-color", "transparent");
			}
			
		})
		
		$("#SCSP_motion>div").prop("innerText", "");	
		
		var str = lg.get("IDS_PATH_ALL");
		$("#SCSP_CPHTD").append('<option class="option" value="'+gDvr.nChannel+'">'+str+'</option>')
		for (var i=0; i<gDvr.nChannel; i++){
			$("#UploadVideoMotionVideoChannel, #SCSP_CPQTD, #SCSP_CPHTD").append('<option class="option" value="'+i+'">'+lg.get("IDS_CH")+(i+1)+'</option>');
		}
		
		RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", 100, "Get");  //获取所有通道信息	
		ch = 0;	
		sel = 0;	
		//RfParamCall(Call_getChnNum, $("#UploadVideo_Title").text(), "UpVideo", ch, "Get");  //获取要显示的通道号
		//一定要使用setTimeout
		setTimeout(function(){
			RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", ch, "Get");  //获取单个通道信息	
		},0);		
	});
	
	function tx(p,color, type){
		if (type == 0){
			$(p).css("background-color", "transparent");
		}else{
			$(p).css("background-color", color);
		}
	}
	
	function gx(p){
		var n = $(p).css("background-color");
		n = n.replace(/[ ]/g,"");
		if (n != "transparent" && n != "rgba(0,0,0,0)"){
			return 1;
		}
		return 0;
	}
	
	var motion = new Array();
	var motionHi = new Array();
	
	function Call(xml){
		sel = 0;  //选择的星期
		
		$("#SCSP_CPQXQ,#VIDEOQX").val(sel);
		$("#SCSP_CPHXQ").val(7);
		
		if ($.browser.msie && $.browser.version*1 >= 9){
			xml = "<a>" + xml + "</a>";
		}else if($.browser.msie){
			xml = "<a>"+xml+"</a>";
			var ajaxfxml = new ActiveXObject("Microsoft.XMLDOM");
			ajaxfxml.async = false;
			ajaxfxml.loadXML(xml);
			xml = ajaxfxml;
		}else {
			xml = "<xml><a>"+xml+"</a></xml>";
		}
		
		
		$(xml).find("motion lo").each(function(i){
			motion[i] = $(this).text()*1;
		})
		$(xml).find("motion hi").each(function(i){
			motionHi[i] = $(this).text()*1;
		})
		
		$("#SCSP_motion>div").each(function(i){
			if(i<32){
				tx(this,color1,(motion[sel] >> i & 0x01));
			}else{
				tx(this,color1,(motionHi[sel] >> i & 0x01));
			}
		})                                                    	
	}
	
	function SaveSel(){  //保存通道1		
		var c = 0;
		var d = 0;
		$("#SCSP_motion>div").each(function(i){
			if(i<32){
				c |= (gx(this)<<i);
			}else{
				d |= (gx(this)<<(i-32));
			}
		})
		motion[sel] = c;
		motionHi[sel] = d;
			
		//RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", ch, "Set", xml);  //保存单个通道
	}
	
	$("#SCSP_CPQXQ, #VIDEOQX").change(function(){
		SaveSel();
		
		sel = $(this).val()*1;
		$("#SCSP_CPQXQ, #VIDEOQX").val(sel);
		
		$("#SCSP_motion>div").each(function(i){
			if(i<32){
				tx(this,color1,(motion[sel] >> i & 0x01));
			}else{
				tx(this,color1,(motionHi[sel] >> i & 0x01));
			}
		})
	});
	
	$("#SCSP_CPXQQD").click(function(){
		$("#SCSP_CPQXQ").change();
		var q = $("#SCSP_CPQXQ").val()*1;
		var h = $("#SCSP_CPHXQ").val()*1;
		
		if (h == 7){
			for (var i=0; i<7; i++){
				motion[i] = motion[q];
				motionHi[i] = motionHi[q];
			}
		}else{
			motion[h] = motion[q];
			motionHi[h] = motionHi[q];
		}
		ShowPaop($("#UploadVideo_Title").text(), lg.get("IDS_COPY_SUC"));
	});
	
	$("#SCSP_CPTDQD").click(function(){
		$("#SCSP_CPQXQ").change();
		var q = $("#SCSP_CPQTD").val()*1;
		var h = $("#SCSP_CPHTD").val()*1;
		if (q == h) return;
		var jhCopyXml = "<a>";
		if (h == gDvr.nChannel){
			var copyChid = 0;
			for(var i=0;i<gDvr.nChannel;i++){
				copyChid |= 0x01<< i;
			}
			jhCopyXml += ("<CopyChid>" + copyChid + "</CopyChid>");	
		}else{
			jhCopyXml += ("<CopyChid>" + (1<<h) + "</CopyChid>");
		}	
		jhCopyXml += ("<chid>" + ch + "</chid>");
		
		for (var i=0; i<7; i++){
			jhCopyXml += ("<motion>" + "<lo>" + motion[i] + "</lo>" + "<hi>" + motionHi[i] + "</hi>" + "</motion>");
	    }
		jhCopyXml += "</a>";	
		
		RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", 400, "Set",jhCopyXml);
	});
	
	$("#UploadVideoRf").click(function(){
		RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", 100, "Get");
		RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", ch, "Get");
	});
	
	$("#SCSP_CPQTD, #UploadVideoMotionVideoChannel").change(function(){
		ChannelChange($(this).val()*1);
		$("#SCSP_CPQTD, #UploadVideoMotionVideoChannel").val($(this).val());
	});
	
	function ChannelChange(a)
	{
		UploadVideoSaveSel();
		ch = a;
		//$("#LXJH_CPQTD").val(ch*1);
		RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", ch, "Get");
	}
	
	function UploadVideoSaveSel(){
		$("#SCSP_CPQXQ").change();
		var xml = "<a>";
		xml += ("<chid>" + ch + "</chid>");
		
		for (var i=0; i<7; i++){
			xml += ("<motion>" + "<lo>" + motion[i] + "</lo>" + "<hi>" + motionHi[i] + "</hi>" + "</motion>");
		}
		
		xml += "</a>";	
		RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", ch, "Set", xml);
	}
	
	$("#UploadVideoSave").click(function(){
		UploadVideoSaveSel();
		RfParamCall(Call, $("#UploadVideo_Title").text(), "UpVideo", 200, "Set");
	});
	
});