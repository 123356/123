// JavaScript Document

//注意:由于此次都是字符串操作，请严格遵守字符串格式即: {n, m}   如果多个这个的格式和在一起用'；'隔开
	var XML_INDEX = [8,16,24,32,48,64,80,96,128,160,192,224,256,320,384,448,512,"Normal","Good","Better","Best"];
	var CIF_PAL_BITRATE = [[0, 0],[0, 1],[0, 2],[1, 3],[1, 4],[1, 5],[2, 6],[2, 7],[2, 7],[3, 7],[3, 8],[3, 9],[3, 9],[4, 9],[4, 10],[4, 10],[5, 11],[5, 12],[5, 12],[6, 12],[6, 13],[6, 13],[7, 14],[7, 15],[8, 15],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];
	
	var CIF_NTSC_BITRATE = [[0, 0],[0, 1],[0, 2],[1, 3],[1, 3],[1, 4],[1, 5],[2, 5],[2, 6],[2, 7],[2, 7],[3, 7],[3, 8],[3, 8],[3, 9],[3, 9],[4, 9],[4, 9],[4, 10],[4, 10],[5, 10],[5, 11],[5, 12],[6, 12],[6, 13],[6, 13],[7, 13],[7, 14],[7, 15],[8, 15]];

	var HD1_PAL_BITRATE = [[0, 0],[0, 3],[0, 5],[0, 6],[1, 8],[1, 9],[1, 10],[2, 10],[2, 11],[3, 12],[3, 12],[3, 13],[4, 13],[4, 14],[5, 14],[5, 14],[5, 15],[5, 15],[5, 15],[6, 16],[6, 16],[6, 16],[6, 16],[6, 17],[7, 17],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]]
	
	var HD1_NTSC_BITRATE= [[0, 0],[0, 3],[0, 5],[0, 6],[1, 8],[1, 8],[1, 9],[1, 9],[1, 10],[2, 10],[2, 11],[2, 11],[2, 11],[3, 12],[3, 12],[3, 12],[3, 13],[4, 13],[4, 14],[5, 14],[5, 14],[5, 15],[5, 15],[5, 15],[6, 16],[6, 16],[6, 16],[6, 16],[6, 17],[7, 17]]
	
	var D1_PAL_BITRATE = [[0, 6],[2, 10],[3, 13],[5, 14],[6, 16],[6, 17],[7, 18],[8, 18],[9, 19],[10, 20],[10, 20],[10, 21],[11, 21],[11, 21],[11, 21],[12, 21],[13, 21],[13, 21],[13, 21],[14, 21],[14, 21],[14, 21],[14, 21],[14, 21],[15, 21],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];

	var D1_NTSC_BITRATE = [[0, 6],[2, 10],[3, 13],[5, 14],[6, 16],[6, 17],[7, 18],[7, 18],[8, 18],[8, 18],[9, 19],[9, 19],[10, 20],[10, 20],[10, 21],[11, 21],[11, 21],[11, 21],[12, 21],[12, 21],[12, 21],[13, 21],[13, 21],[13, 21],[14, 21],[14, 21],[14, 21],[14, 21],[14, 21],[15, 21]];
	 
	var P720_BITRATE = [[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25],[22,25]];
	//在切换帧率或分辨率时所对应的默认码流
	//  0   1   2   3   4    5    6    7    8    9   10   11   12   13   14   15   16    17    18    19    20    21     下标
	// 32, 48, 64, 80, 96, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640, 768, 896, 1024, 1280, 1536, 1792, 2048     码率
	var D1_PAL_FPS_DEFAULTBITRATE = [[1, 2],[2, 5],[3, 5],[4, 8],[5, 8],[6, 10],[7, 10],[8, 12],[9, 12],[10,13],[11,13],[12,14],[13,14],[14,14],[15,15],[16,16],[17,16],[18,17],[19,17],[20,18],[21,18],[22,19],[23,19],[24,19],[25,21]];
	var D1_NTSC_FPS_DEFAULTBITRATE = [[1, 2],[2, 5],[3, 5],[4, 8],[5, 8],[6, 10],[7, 10],[8, 12],[9, 12],[10,13],[11,13],[12,14],[13,14],[14,14],[15,15],[16,16],[17,16],[18,17],[19,17],[20,18],[21,18],[22,19],[23,19],[24,19],[25,21],[26,21],[27,21],[28,21],[29,21],[30,21]];
	
	var HD1_PAL_FPS_DEFAULTBITRATE = [[1, 1],[2, 3],[3, 3],[4, 6],[5, 6],[6, 9],[7, 9],[8, 10],[9, 10],[10,12],[11,12],[12,13],[13,13],[14,13],[15,14],[16,14],[17,14],[18,15],[19,15],[20,16],[21,16],[22,16],[23,16],[24,16],[25,17]];
	var HD1_NTSC_FPS_DEFAULTBITRATE = [[1, 1],[2, 3],[3, 3],[4, 6],[5, 6],[6, 9],[7, 9],[8, 10],[9, 10],[10,12],[11,12],[12,13],[13,13],[14,13],[15,14],[16,14],[17,14],[18,15],[19,15],[20,16],[21,16],[22,16],[23,16],[24,16],[25,17],[26,17],[27,17],[28,17],[29,17],[30,17]];
	
	var CIF_PAL_FPS_DEFAULTBITRATE = [[1, 0],[2, 1],[3, 1],[4, 3],[5, 3],[6, 5],[7, 5],[8, 6],[9, 6],[10,8],[11,8],[12,9],[13,9],[14,9],[15,10],[16,10],[17,10],[18,11],[19,11],[20,12],[21,12],[22,12],[23,12],[24,12],[25,13]];
	var CIF_NTSC_FPS_DEFAULTBITRATE = [[1, 0],[2, 1],[3, 1],[4, 3],[5, 3],[6, 5],[7, 5],[8, 6],[9, 6],[10,8],[11,8],[12,9],[13,9],[14,9],[15,10],[16,10],[17,10],[18,11],[19,11],[20,12],[21,12],[22,12],[23,12],[24,12],[25,13],[26,13],[27,13],[28,13],[29,13],[30,13]];
	
	var LanguageArray  = [["CHS", "中文"],["CHT","繁體中文"],["CSY","Čeština"],["DAN","Dansk"],["ENU", "English"],
						  ["FIN","Finnish"],["FRA","Français"],["DEU","Deutsch"],["ELL","Ελληνικα"],["HEB","Hebrew"],
						  ["HUN","Magyar"],["ITA","Italiano"],["JPN","日本語"],["PLK","Polski"],["PTG","Português"],
						  ["RUS", "Pусский"],["ESN","Español"],["THA","ไทย"],["SLV","Slovenija"],["ROM","România"],
						  ["BRG","Български"],["ARA","العربية"],["HIN","HINDI"],["VIE","VIETNAM"],["HOL","Nederlands"],
						  ["TUR","Türk"],["SVE","Svenska"],["KOR","한국의"],["PTB","Português(Brasil)"]];
//var bLOREX = false;
var autoCloseTime = 10;

function closewnd() 
{
	if(bOcxInit){
		gDvr.DvrCtrlRelease();
		bOcxInit = false;
	}
}

function ReSetMaskLayer()
{
	$("#MaskLayout").css("width",document.body.clientWidth);
	$("#MaskLayout").css("height",document.body.clientHeight);
}

function DivBox(objMain, obj){
	var $obj = $(obj);
	if ($(objMain).prop("checked")*1 != 1){
		$obj.find("select").prop("disabled",true);
		$obj.children().prop("disabled",true);
		if($.browser.chrome){
			$obj.find(":text").each(function(){
				$(this).attr("readonly","true");
			});
			$obj.find(":password").each(function(){
				$(this).attr("readonly","true");
			});
			$obj.find(".addTimeClick").each(function(){
				$(this).attr("black","true");
			});
		}else{
			$obj.find(":text").each(function(){
				$(this).prop("readonly","true");
			});
			$obj.find(":password").each(function(){
				$(this).prop("readonly","true");
			});
			$obj.find(".addTimeClick").each(function(){
				$(this).prop("black","true");
			});
		}
		if($obj.css("display") != "none")$obj.fadeTo("slow", 0.2);
	}else{
		$obj.find("select").prop("disabled",false);
		if($obj.css("display") != "none"){
			$obj.fadeTo("slow", 1,function(){
				//兼容safari处理
				$obj.css("filter","");
			});
		}
		$obj.children().prop("disabled",false);
		if($.browser.chrome){
			$obj.find(":text").each(function(){
				$(this).removeAttr("readonly");
			});
			$obj.find(":password").each(function(){
				$(this).removeAttr("readonly");
			});
			$obj.find(".addTimeClick").each(function(){
				$(this).attr("black","false");
			});
		}else{
			$obj.find(":text").each(function(){
				$(this).removeProp("readonly");
			});
			$obj.find(":password").each(function(){
				$(this).removeProp("readonly");
			});
			$obj.find(".addTimeClick").each(function(){
				$(this).prop("black","false");
			});
		}
	}
}

function showDiv(objMain, obj){//0显示，1隐藏
	var $obj = $(obj);
	if (objMain == 1){
		$obj.find("select").prop("disabled",true);
		$obj.children().prop("disabled",true);
		$obj.find(":text").each(function(){
			$(this).attr("disabled", true);
		});
		$obj.find(":password").each(function(){
			$(this).attr("disabled", true);
		});
		if($obj.css("display") != "none")$obj.fadeTo("slow", 0.2);
	}else{
		$obj.find("select").prop("disabled",false);
		if($obj.css("display") != "none"){
			$obj.fadeTo("slow", 1,function(){
				//兼容safari处理
				$obj.css("filter","");
			});
		}
		$obj.children().prop("disabled",false);
		$obj.find(":text").each(function(){
			$(this).attr("disabled", false);
		});
		$obj.find(":password").each(function(){
			$(this).attr("disabled", false);
		});
	}
}

Date.prototype.Format = function(fmt)   
{  
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

//显示遮罩层
function MasklayerShow() 
{
	//HidePaop();
	//clearTimeout(gVar.nTimer);
	var bgObj=document.getElementById("MaskLayout");
	bgObj.style.width = document.body.offsetWidth + "px";
	bgObj.style.height = screen.height + "px";
	bgObj.style.display = "block";

}

//隐藏遮罩层
function MasklayerHide()
{
	var bgObj=document.getElementById("MaskLayout");
	bgObj.style.width = document.body.offsetWidth + "px";
	bgObj.style.height = screen.height + "px";
	bgObj.style.display = "none";
}

//显示遮罩层
function MasklayerShowEx(obj) 
{
	//HidePaop();
	//clearTimeout(gVar.nTimer);
	var bgObj=document.getElementById("MaskLayout");
	bgObj.style.width = obj.style.width;
	bgObj.style.height = obj.style.height;
	bgObj.style.display = "block";
}

//隐藏遮罩层
function MasklayerHideEx()
{
	var bgObj=document.getElementById("MaskLayout");
	bgObj.style.display = "none";
}

function ShowPaop(title, contant){
	if(gDvr.DevType == 4 && gVar.sPage == "live"){
		if (typeof contant != 'undefined'){
			clearTimeout(gVar.nTimer);
			if ($("#IPCTooltip").attr("name") != "in"){
				$("#IPCTooltip").css("display", "").slideDown("slow").attr("name", "in");
			}
			$("#IPCTooltip").prop("innerHTML", contant);
			
			setTimeout(function(){
				$("#IPCTooltip").css("background-position", "0 0")
				setTimeout(function(){
					$("#IPCTooltip").css("background-position", "0 -62px")
					setTimeout(function(){$("#IPCTooltip").css("background-position", "0 -31px")}, 200);
				}, 200);
			}, 200);
			
			gVar.nTimer = setTimeout(function(){
				HidePaop();
			}, 5000);
		}
	}else{
		if (typeof title != 'undefined' && typeof contant != 'undefined'){
			clearTimeout(gVar.nTimer);
			if ($("#MsgPaop").attr("name") != "in"){
				$("#MsgPaop").css("display", "").slideDown("slow").attr("name", "in");
			}
			$("#Paoptitle").prop("innerHTML", "<left>"+title+"</left>");
			$("#PaopContant").prop("innerHTML", contant);
			setTimeout(function(){
				$("#PaopBg").css("background-position", "0 -38px")
				setTimeout(function(){
					$("#PaopBg").css("background-position", "0px -76px")
					setTimeout(function(){$("#PaopBg").css("background-position", "0 0")}, 200);
				}, 200);
			}, 200);
			gVar.nTimer = setTimeout(function(){
				HidePaop();
			}, 5000);
		}
	}
}
	
function HidePaop(){
	if(gDvr.DevType == 4 && gVar.sPage == "live"){
		$("#IPCTooltip").fadeOut("slow").slideUp("slow", function(){
		$(this).css("display", "none");
		}).attr("name", "out");
	}else{
		$("#MsgPaop").fadeOut("slow").slideUp("slow", function(){
			$(this).css("display", "none");
		}).attr("name", "out");
	}
}

function Web_prompt(str){
	if(!$.browser.safari){
 		gDvr.CloseNetConnect(1);
	}
  	MasklayerHide();
	if(str == "" || str == null) { str = "can't find the language !";}
	$("#loginLgBtn_1").get(0).onclick = 1;
	$("#Web_false").text(str).css("color","red");
	setTimeout('$("#Web_false").fadeIn("slow")',500);
	setTimeout('$("#Web_false").fadeOut("slow")',5000);
}

function Web_promptEx(str){
  	MasklayerHide();
	if(str == "" || str == null) { str = "can't find the language !";}
	$("#loginLgBtn_1").get(0).onclick = Login;
	$("#Web_false").text(str).css("color","red");
	setTimeout('$("#Web_false").fadeIn("slow")',500);
	setTimeout('$("#Web_false").fadeOut("slow")',5000);
}

//IE下
function findNode(name, xml){
	xml = '<a>' + xml + '</a>';
	xml = xml.split(name).join("p");
	xml = $(xml).find("p").html();
	return xml == null? -1: xml;
}

function findChildNode(name, child, xml){
	var s = xml.indexOf(name);
	if (s == -1) {alert(lg.get("IDS_REFRESH_NONODE"));return;}
	s = s + name.length + 1;
	xml = xml.substring(s, xml.length);
	var e = xml.indexOf(name);
	if (e == -1)	{alert(lg.get("IDS_REFRESH_NONODE"));return;}
	e = e - 2;
	xml = xml.substring(0, e);
	xml = '<a>' + xml + '</a>';
//	xml = xml.split(child).join("p");
	xml = xml.split("<"+child+">")[1].split("</"+child+">")[0];
//	xml.replace(/(^\s*)|(\s*$)/g, "&nbsp"); 
//	xml = $(xml).find("p").html();
	return xml == null? "": xml;
}

//让文本框、文本域和密码框可以选择
function fbd()
{
	var the = event.srcElement ;
 	//通过body的onselectstart属性，控制叶面内容的可选状态。
 	//标签是 input text 以及 文本域textarea 的，均为可以选择项目。
 	if( !( ( the.tagName== "INPUT" && the.type.toLowerCase() == "password" ) ||( the.tagName== "INPUT" && the.type.toLowerCase() == "text" ) || the.tagName== "TEXTAREA" )){
 		return false;
 	}
 	return true;
}

//复制通道公共方法
function copyTD(displayDiv,checkboxIds,joinDiv, num){
	if (typeof num == 'undefined')	num = gDvr.nChannel;
	$(displayDiv).css("display","block");	
	var tempstr = "";
	var tempstr1 = "";
	var tempstr2 = "";
	var tempstr3 = "";
	if(num<=8){
		$('#'+joinDiv+'_2_2').css("display","none");
		$('#'+joinDiv+'_3_3').css("display","none");
		$('#'+joinDiv+'_4_4').css("display","none");
	}else if(num<=16){
		$('#'+joinDiv+'_3_3').css("display","none");
		$('#'+joinDiv+'_4_4').css("display","none");
	}else if(num<=24){
		$('#'+joinDiv+'_4_4').css("display","none");
	}	
	var chnName = '';
	for(var i=0;i<num;i++)
	{
		var inner = "";
		if((i+1).toString().length==1){
			
			if(gDvr.hybirdDVRFlag==1){
				if(i<gDvr.AnalogChNum){
					//模拟通道： CH01...
					chnName = lg.get("IDS_CH")+'0'+(i+1);
				}else{
					//IP通道： IP CH01...
					chnName = "IP " + lg.get("IDS_CH")+'0'+(i+1-gDvr.AnalogChNum);
				}
			}else{
				chnName = lg.get("IDS_CH")+'0'+(i+1);
			}
			
			inner += '<div id="div_'+checkboxIds+(i+1)+'" style="float:left;margin-left:10px;"><input type="checkbox" id="'+checkboxIds+''+(i+1)+'" value="'+i+'"/>'+ chnName +'</div>';
			if(i<8){
				tempstr += inner;
			}
			else{
				tempstr1 += inner;
			}
		}
		else{
			
			chnName = lg.get("IDS_CH")+(i+1);
			
			if(i<16){
				tempstr1+='<div id="div_'+checkboxIds+(i+1)+'" style="float:left;margin-left:10px;"><input type="checkbox" id="'+checkboxIds+''+(i+1)+'" value="'+i+'"/>'+ chnName +'</div>';
			}else if(i<24){
				tempstr2+='<div id="div_'+checkboxIds+(i+1)+'" style="float:left;margin-left:10px;"><input type="checkbox" id="'+checkboxIds+''+(i+1)+'" value="'+i+'"/>'+ chnName +'</div>';
			}else{
				tempstr3+='<div id="div_'+checkboxIds+(i+1)+'" style="float:left;margin-left:10px;"><input type="checkbox" id="'+checkboxIds+''+(i+1)+'" value="'+i+'"/>'+ chnName +'</div>';
			}
		}
	}
	document.getElementById(joinDiv+"_1").innerHTML=tempstr;
	document.getElementById(joinDiv+"_2").innerHTML=tempstr1;
	if(gDvr.nChannel>16 && gDvr.nChannel<=24){
		document.getElementById(joinDiv+"_3").innerHTML=tempstr2;
	}
	if(gDvr.nChannel>24){
		document.getElementById(joinDiv+"_3").innerHTML=tempstr2;
		document.getElementById(joinDiv+"_4").innerHTML=tempstr3;
	}
}

function CreateLiveBtn(){
	//live页面根据通道号生成通道
	if ($(".mclcontainer").attr("name") != "isDown"){return;}
	var liveHtml="<div style='margin-top:0px;'></div>";
	for(var i=1;i<=gDvr.nChannel;i++){
		liveHtml+='<div class="liveChannelRow" style="width:204px; height:25px; margin-left:-2px; margin-top:10px; ">\
						<div class="live_td" style="float:left; color:#fff;margin-top:6px; font-size:12px; width:70px; text-align:right;" >'+gDvr.chname[i-1]+'</div>\
						<div id="liveChn_Play_'+i+'" class="live_td" style="font-size:12px; width:31px; float:left; background-image:url(images/chanel_icon.png); background-position:0px 0px; background-repeat:no-repeat; height:25px;margin-top:1px; margin-left:0px; cursor:pointer" title='+lg.get("IDS_PLAY_ONOFF")+'></div>\
						<div id="liveChn_Rec_'+i+'" class="live_td" style="font-size:12px; width:31px; float:left; background-image:url(images/chanel_icon.png); background-position:0px -25px; background-repeat:no-repeat; height:25px;margin-top:1px; margin-left:0px; cursor:pointer" title='+lg.get("IDS_RECORD_ONOFF")+'></div>\
						<div id="liveChn_Cap_'+i+'" class="live_td" style="font-size:12px; width:31px; float:left; background-image:url(images/chanel_icon.png); background-position:0px -50px; background-repeat: no-repeat; height:25px;margin-top:1px; margin-left:0px; cursor:pointer" title='+lg.get("IDS_BTN_CAP")+'></div>\
				</div>';
	}
	$("#liveleft").html(liveHtml);
	
	//回放页面根据通道生成通道号
	var playHtml="";
	if(gDvr.nChannel==32){
		$("#playBackChannal").css("height","385px");		
		$("#rss").css("margin-top","5px");		
		for(var i=1;(i<=gDvr.nChannel) && (i<=16);i++){
			playHtml+=("<div style='text-align:left; margin-left:30px; color:white; width:120px;'> \
						     <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td1").prop("innerHTML", playHtml);
		playHtml="";		
		for(var i=17;(i<=gDvr.nChannel) && (i<=32);i++){
			playHtml+=("<div style='text-align:left; margin-left:22px; color:white; width:120px;'> \
						     <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td2").prop("innerHTML", playHtml);
	}else if(gDvr.nChannel==24){
		$("#playBackChannal").css("height","290px");		
		$("#rss").css("margin-top","5px");		
		for(var i=1;(i<=gDvr.nChannel) && (i<=12);i++){
			playHtml+=("<div style='text-align:left; margin-left:30px; color:white; width:120px;'> \
					         <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td1").prop("innerHTML", playHtml);
		playHtml="";		
		for(var i=13;i<=gDvr.nChannel;i++){
			playHtml+=("<div style='text-align:left; margin-left:22px; color:white; width:120px;'> \
			 			     <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td2").prop("innerHTML", playHtml);
	}else if(gDvr.nChannel==20){
		$("#playBackChannal").css("height","290px");
		$("#rss").css("margin-top","5px");
		for(var i=1;(i<=gDvr.nChannel) && (i<=8);i++){
			playHtml+=("<div style='text-align:left; margin-left:30px; color:white; width:120px;'> \
					         <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td1").prop("innerHTML", playHtml);
		playHtml="";		
		for(var i=9;i<=gDvr.nChannel;i++){
			playHtml+=("<div style='text-align:left; margin-left:22px; color:white; width:120px;'> \
			 			     <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td2").prop("innerHTML", playHtml);
	}else if(gDvr.nChannel==10 || gDvr.nChannel==12){
		$("#playBackChannal").css("height","230px");
		$("#rss").css("margin-top","5px");
		for(var i=1;(i<=gDvr.nChannel) && (i<=4);i++){
			playHtml+=("<div style='text-align:left; margin-left:30px; color:white; width:120px;'> \
					         <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td1").prop("innerHTML", playHtml);
		playHtml="";		
		for(var i=5;i<=gDvr.nChannel;i++){
			playHtml+=("<div style='text-align:left; margin-left:22px; color:white; width:120px;'> \
			 			     <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td2").prop("innerHTML", playHtml);
	}else{
		for(var i=1;(i<=gDvr.nChannel) && (i<=8);i++){
			playHtml+=("<div style='text-align:left; margin-left:30px; color:white; width:120px;'> \
							 <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+ 
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
					    "</div>");			
			}
		$("#playBack_td1").prop("innerHTML", playHtml);
		playHtml="";		
		for(var i=9;(i<=gDvr.nChannel) && (i<=16);i++){
			playHtml+=("<div style='text-align:left; margin-left:22px; color:white; width:120px;'> \
							 <div id='pbCheck" + i + "'class='playBack_chks' style='color:white; width:24px; height:24px; background:url(images/cbox.png) no-repeat;'></div>"+
							 "<div style='float:left; margin-left:30px; margin-top:-20px;'>" +gDvr.chname[i-1]+"</div>"+
						"</div>");
		}
		$("#playBack_td2").prop("innerHTML", playHtml);
	}
	
	UI.Button("div[id^='liveChn_Play_']", 31, null, function(e, p){	//live页面左边栏按钮注册 
		var $p = $(p);
		var str = $p.attr("id");
		if (e.type == "mousedown"){
			if ($p.attr("name") == "disable" ){
				return false; 
			}else if($p.attr("name") != "active" ){
				var cmd = (str.split("_")[2]*1-1) << 16;
				cmd |= (str.split("_")[2]*1-1);
				gDvr.PreViewFunCtrl(1, cmd, gVar.nStreamType);	
			}
			else{
				gDvr.PreViewFunCtrl(2, (str.split("_")[2]*1-1), gVar.nStreamType);
				//点击left页面的play图标，关掉任何一个视频，Zoom图标都切到off状态
				if($(".liveBtnBt11").attr("name") == "active"){
					$(".liveBtnBt11").css("background-position", "32px 0px").attr("name", "");
				}
			}
			return false;
		}else if(e.type == "mouseover"){
			if($p.attr("name")=="disable")
				return false;
				}
		else if(e.type == "mouseout"){
			if($p.attr("name")=="disable")
				return false;}
		else if(e.type == "mouseup"){
			if($p.attr("name")=="disable")
				return false;}
	    
		if ($p.attr("name") != "active"){
			return true;
		}
		return false;
	})
	
	UI.Button("div[id^='liveChn_Rec_']", 31, null, function(e, p){	//Rec页面左边栏按钮注册
		var $p = $(p);
		if (e.type == "mousedown"){
			var cmd = ($p.attr("id").split("_")[2]*1-1);
			if (0 == gDvr.PreViewRec(cmd)){
				if ($p.attr("name") != "active" ){
					$p.attr("name", "active");
					return false;
				}else{
					$p.attr("name", "")
					return true;
				}
			}
		}else{
			if ($p.attr("name") == "active" ){
				return false;
			}else{
				return true;
			}
		}
	})
	
	UI.Button("div[id^='liveChn_Cap_']", 31, null, function(e, p){	//CAP页面左边栏按钮注册
		var $p = $(p);
		var cmd = ($p.attr("id").split("_")[2]*1-1);
		if (e.type == "mousedown"){
			var str = gDvr.PreViewCap(cmd);
			if(str != "noplay"){
				var strTemp = str;
				str = str.split("\\").join("\\\\");	
				ShowPaop(lg.get("IDS_IMAGE_SAVE_PATH"), strTemp + "<div style='text-align:center;margin:5px;'><a color=red href='javascript:gDvr.GetCapDir(\""+str+"\")'>Folder</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:gDvr.GetCapImage(\""+str+"\");'>Preview</a></div>");
			}
		}
		return true;
	});
	$(".liveChannelRow").mouseover(function(){$(this).css("background", "#0f2c47");}).mouseout(function(){$(this).css("background", "url(images/content_bg.png)");});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
function cfgXmlParsing(obj, array, xml){
	if ($.browser.msie && $.browser.version*1 > 9){
		$('<?xml version="1.0" encoding="utf-8"?><xml>"+xml+"</xml>').find("xml").children().each(function(){
			obj.set($(this).get(0).nodeName, $(this).text());
		});
	}else{
		$("<xml><item>" + xml + "</item></xml>").find("item").children().each(function(){
			obj.set($(this).get(0).nodeName, $(this).text());
		})
	}
	//填充数据元素
	var length = array.length;
	for (var i=0; i<length; i++){
		$("#"+array[i][0]).attr(array[i][2], obj.get(array[i][1]));
	}
}

function cfgXmlPack(obj, length){
	var xml = "";
	var node = "";
	for (var i=0; i<length; i++){
		node = obj.get(i);
		xml += ("<" + node + ">" + obj.get(node) + "</" + node + ">")
	}
	return xml;
}

function cfgXmlSing(node, value){
	return("<"+node+">"+value+"</"+node+">");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////
function LanguageCall(){}	//载入语言回调函数

	
//过滤方向键 
function keyboardFilter(e){
	e = e || window.event;
	if(!e.srcElement)
		e.srcElement = e.target;
	if ((e.keyCode >= 37 && e.keyCode <= 40) /*|| (e.keyCode == 8)*/ || (e.keyCode == 9)){//取消 退格键 过滤
		return false;
	}
	return true; 
}
	  //对端口进行限制
function NumberRangeLimt(ctrId,minVal,maxVal){
//var str =$("#"+ctrId.id).get(0).value.replace(/\D/g,'');
	var str = ($("#"+ctrId.id).val()).replace(/\D/g,'');
	if(minVal != maxVal)
	{
	  if(str != "" && str < minVal) {return minVal;}
	  if(str > maxVal) {return maxVal;}
	}
	return str;
}
		 
function Reset(){
	$("#username").val("");
	$("#passwd").val("");
	$("#login_language").val(gVar.lg);
	$("#login_language").change();
	$("#username").focus();
}

//检查字符串
function CheckStringValue(str,bpswd){
	
	if(bpswd != 1)
	{
	if(str == "" || str == null) 
	   return 1;
	}
	
	 ss = str.split(" ");  
	 if(ss.length != 1)
	    return 2;
		
	return 0;	
}
 
             <!-- 修改密码 函数 -->
function ModifyPwd(){
	if($("#modifpasswd").prop("value")=="" || $("#modifpasswd2").prop("value")==""){
		Web_promptEx(lg.get("IDS_NO_PASSWORD"));
		$("#modifpasswd").focus().select();
		return;
	}else if($("#modifpasswd").prop("value").length<6 || $("#modifpasswd2").prop("value").length<6){
		Web_promptEx(lg.get("IDS_CHECKPW_LENGTH_SIX"));
		if($("#modifpasswd").prop("value").length<6){
			$("#modifpasswd").focus().select();
		}else{
			$("#modifpasswd2").focus().select();
		}
		return;
	}else if($("#modifpasswd").prop("value")!=$("#modifpasswd2").prop("value")){
		Web_promptEx(lg.get("IDS_PSW_DIFFRENT"));
		$("#modifpasswd2").focus().select();
		return;
	}
	var strRet = gDvr.obj.GetAndSetNetParam("SysUser",1,800,$("#modifpasswd").val());
	strRet = findNode("result",strRet)*1;
	if(strRet){
		Web_prompt("Password changed successfully!");
		$("#modifiBtn").prop("disabled",true);
		$("#modifiBtn2").prop("disabled",true);
	}else{
		Web_prompt("Password change failed!");
		$("#modifiBtn").prop("disabled",true);
		$("#modifiBtn2").prop("disabled",true);
	}
	setTimeout(function(){
		closewnd();
		if(gIELogin){
			window.location.href = "login.html";
		}else{
			window.location.href = "login.html?NetViewerLogin";
		}	
	},5000);
}

         <!-- 修改界面界面  点击“Cancel”的响应函数 -->
function ModifyCancel(){
	closewnd();
	if(gIELogin){
		window.location.href = "login.html";
	}else{
		window.location.href = "login.html?NetViewerLogin";
	}	
}

function AutoClose(title)
{
	autoCloseTime--;
	if(autoCloseTime <= 0)
	{
		if($.browser.msie){
			window.opener=null;
			window.open('', '_self', ''); 
			window.close(); 
		}else{
			window.location.reload(true);
		}
	}
	if($.browser.msie){
		ShowPaop(title, lg.get("IDS_DVR_REBOOT")+" "+autoCloseTime.toString()+" "+lg.get("IDS_SECOND"));
	}else{
		ShowPaop(title, lg.get("IDS_DVR_REBOOT")+" "+autoCloseTime.toString()+" "+lg.get("IDS_SECOND"));
	}
	window.setTimeout(function(){AutoClose(title);}, 1000);
}
function ReconnectOtherDev(){
	autoCloseTime--;
	if(autoCloseTime <= 0)
	{
		window.location.reload(true);
	}
	$("#devchange_title").children("em").prop("innerHTML",lg.get("IDS_RECONNECT"));
	devchange_text.innerHTML = "The device has been replaced, please re-login."+autoCloseTime.toString()+" "+lg.get("IDS_SECOND")+".";
		//ShowPaop(title, lg.get("IDS_DVR_REBOOT")+" "+autoCloseTime.toString()+" "+lg.get("IDS_SECOND"));
	window.setTimeout(function(){ReconnectOtherDev();}, 1000);
}

function fnDDNSTest_TimeOut()
{
	var time = 1*60*1000;//2分钟
	gVar.timer_DDNSTest = window.setTimeout(function(){
		gVar.var_DDNSTest_isTimeOut = true;
		
		ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_RECEIVE_TIMEOUT"));
		$("#DDNSTest").prop("disabled",false);
		document.getElementById("DDNSTest").value = lg.get("IDS_DDNSTEST");
	}, time);
}

