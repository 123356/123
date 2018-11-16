// JavaScript Document
var gVar;	//全局变量
var gDvr;	//设备信息类对象
var UI;		//UI包对象
var lg;		//语言包对象
var lgCls;
var timeout;
var tabkey = 1;
var ColorSet = "#7EA264";
var ColorDefault = "#3b4554";
var gIELogin;
var gIDLogin = false; //控制id登录还是ip登录
var gTimerID = 0;
var gHttp = "";
var gDevID = "";
var clearOnResizeTime;
var ColorSetMax = 256;
var ColorSetCube = 2;
var IPCRows = 0;
var DrvNo = 0;//视频频道编号，在注册按钮时就开始跳转
//var DrvNo16b = 0;//经过转换后的视频频道编号，具体作用在1426行
//var sliderback = 0;
var sliderback = new Array();
sliderback[0]=0;
sliderback[1]=0;
sliderback[2]=0;
sliderback[3]=0;
sliderback[4]=0;
sliderback[5]=0;
sliderback[6]=0;
sliderback[7]=0;

var bHuaweiPlat = false;
var gStreamSet = 0;
var gReboot = 0;
var bOcxInit = false;
var Cam_FlickerCtrl = 0; //闪烁类型
var IpcAbility = [];
var curChid = 0;	//当前选中的通道ID
var curWinid = 0;	//当前选中的窗口ID
var gCurConfigPage;
var alarm_mvShowExitButton = 0; 
var g_bClickDefBtn = false;
var g_bDefaultShow = false;
//var isH265 = false;//H265包打开

//回放界面针对进度条的鼠标滚轮事件进行单独处理
var scrollFunc=function(e){  
	e=e || window.event;  
	if(e.wheelDelta){
		var id = document.elementFromPoint(e.clientX, e.clientY);
		if(!$.browser.safari && id.id == "dvrocx" && gVar.sPage=="playback"){
			var ret = gDvr.IsInProgress();
			if(ret*1){
				if (e&&e.preventDefault){
					e.preventDefault();
					e.stopPropagation();
				}else{ 
					e.returnvalue=false;  
					return false;     
				} 
			}
		} 
	}else if(e.detail){//FF   ±3
		var id = document.elementFromPoint(e.clientX, e.clientY);
		if(id.id == "dvrocx" && gVar.sPage=="playback"){
			var ret = gDvr.IsInProgress();
			if(ret*1){
				if (e&&e.preventDefault){
					e.preventDefault();
					e.stopPropagation();
				}else{ 
					e.returnvalue=false;  
					return false;     
				} 
			}
		} 
	}
};  

//注册事件
if(document.addEventListener){
	//adding the event listerner for Mozilla 
	document.addEventListener('DOMMouseScroll',scrollFunc,false);
}//W3C
window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari

function InitWeb(){	//站点初始化
//////////////////////////////////////初始化全局数据////////////////////////////////////////////////////
	//初始化数据
	lgCls = new LgClass();
	gDvr = new DvrInfo();	//创建设备对象	
	gVar = new GlobarVar();	//初始化全局类对象
	lg = new HashmapCom();	//创建语言包哈希表
	gHttp = window.location.href;
	
	//gHttp = "http://172.18.12.103";
	
	if(gHttp.split("?")[1] == "NetViewerLogin"){
		gIELogin = false;
	}else{
		gIELogin = true;
	}
	gVar.ip = gHttp.split("//")[1].split("/")[0];	
	if (gVar.ip.indexOf(":") != -1){
		gVar.port = gVar.ip.split(":")[1];
		gVar.ip = gVar.ip.split(":")[0];
	}
	
	UI = new UIReg();
	
	gIELogin = false;
	//isH265 = true;//H265包打开
	
	if(gIELogin == false){
		gVar.mediaport = "";
		lgCls.version = "NORMAL"; //NORMAL  HONEYWELL  KGUARD  TONGFANG URMET VIDEOTECNOLOGIE GTC OWL RAYSHARP COP VC DEFENDER EZ_WATCHING XVISION BRIGHT VOLTA RCI
		lgCls.logo = "NORMAL";  //NORMAL GTC DEFENDER LOREX SECURA
		lgCls.langues =  "ENU CHS";
		lgCls.defaultLg = "CHS";
		InitOcx();
		setTimeout(function(){LanguageCall(gVar.lg);},0);
	}else if(gIELogin && gIDLogin) {
		gVar.mediaport = "";
		lgCls.version = "URMET";
		lgCls.logo = "URMET";
		lgCls.langues =  "ENU ELL PLK ESN DEU FRA ITA";
		lgCls.defaultLg = "ENU";
		InitOcx();
		setTimeout(function(){LanguageCall(gVar.lg);},0);
	}
	else{
		$("#loading").css("display","block");
		MasklayerShow();
		AnalyzeIPAndPort();	
	}

	//语言处理
	LanguageCall = function LoadLanguage(lag){
		var xml = gDvr.GetLanguage(lag);
		if($.browser.msie && (lag=="KOR" || lag=="CHT")){
			xml = "err";
		}
		if(xml == "err"){
			gVar.Ajax({type:"GET",url:"lg/"+lag+".xml", 
				suc:function success(data, state){
					gVar.XmlParsing(lg, data, "StringTable");
					if (!gVar.bWebInit){
						WebProc();
						LoadLoginPage();
					}else{
						lan("login");
					}
				}
			})
		}else{
			if($.browser.msie){
				var xmlData = JSON.parse(xml);
				gVar.XmlParsing(lg, xmlData, "StringTable");
			}else{
				gVar.XmlParsing(lg, xml, "StringTable");
			}
			if (!gVar.bWebInit){
				WebProc();
				LoadLoginPage();
			}else{
				lan("login");
			}
		}
	}
	if($.browser.msie && $.browser.version.indexOf("11") == 0){
		$("#configPage").css("z-index","102");
	}
}

function  SetClientLogin(){
	gIELogin = false;
}

function  InitOcx(){
	bOcxInit = true;
	gDvr.SetClientName(lgCls.version);
	gDvr.DvrCtrlInit();		//初始化控件
	gVar.nWeekStart = gDvr.getDayOfWeek()*1;
	if(gVar.nWeekStart<0 || gVar.nWeekStart>6){
		gVar.nWeekStart = 0;
	}
	//gDvr.IsIELogin(1/*gIELogin*/);
	if(lgCls.version == "LOREX"){
		ColorSet = "rgb(25,135,222)";
		$("html,body").css({"filter":"progid:DXImageTransform.microsoft.gradient(enabled=bEnabled,startColorStr=#262626,endColorStr=#262626)"});
	}else if(0/*lgCls.version == "KGUARD"*/){
		ColorDefault = "#FFFFFF";
		ColorSet = "#007CB2";
		$(".datepicker select").css("background","#808080");
		if($.browser.safari){
			$("body").css({"background":"-webkit-gradient(linear, 100% 100%, 100% 0%, from(#194550), to(#031c27), color-stop(1, #194550))"});
			$("html,body").css({"background-image":"-webkit-gradient(linear, 100% 100%, 100% 100%, from(#194550), to(#031c27), color-stop(1, #194550))"});
		}else{
			$("html,body").css({"filter":"progid:DXImageTransform.microsoft.gradient(enabled=bEnabled,startColorStr=#ff031c27,endColorStr=#FF194550)"});
		}
	}//else if(lgCls.version == "URMET"){
		//gDvr.SetEncription(1);
	//}
	else{
		$("html,body").css({"background":"#262626"});
	}
	//加密
	gDvr.SetEncription(1);
	var lanTemp = lgCls.langues.split(" ");
	for(var i=0; i<lanTemp.length; i++){
		lgCls.mul[i] = new Array;
		for(var j =0; j<LanguageArray.length; j++){
			if(lanTemp[i] == LanguageArray[j][0]){
				lgCls.mul[i][0] = LanguageArray[j][0];
				lgCls.mul[i][1] = LanguageArray[j][1];
				break;
			}
		}
	}
	//初始化语言
	gVar.lg = $.cookie("language");	
	if(gVar.lg == null){
		gVar.lg = lgCls.defaultLg;
	}else{
		var i;
		for(i =0; i<lgCls.mul.length; i++){
		  if(lgCls.mul[i][0] == gVar.lg)
				  break;
		}
		if(i >= lgCls.mul.length){
		  gVar.lg = lgCls.defaultLg;
		}
	}
}

function WebProc(){
	//初始化主界面
	UI.Button(".Menu1,.Menu3,.Menu4", 44);
	UI.Button(".Menu2", 39);
	UI.Button(".Menu5", 37);
	UI.Button(".liveBtnBt6", 32);
	
	function SPcontrol(e, p, tag, cmd){	//视频全开全关处理
		var $p = $(p);
		if(e.type == "mousedown"){
			var $x = $(tag);
			if(tag == ".liveBtnBt2"){
				$x.css("background-position", "0px -32px");
			}else{
				$x.css("background-position", "0px 0px");
			}
			
			//点击全开、全关，图标都要变到off状态
			if($(".liveBtnBt11").attr("name") == "active"){
				$(".liveBtnBt11").css("background-position", "32px 0px").attr("name", "");
			}
			if($p.attr("name") != "active"){
				$x.attr("name", "");
				$p.attr("name", "active");
			
				gDvr.PreViewFunCtrl(cmd, 0, gVar.nStreamType);
				if(cmd == 3){
					if($(".liveBtnBt9").attr("name") == "active"){
						$(".liveBtnBt9").mousedown();
					}
				}
			}	
			ShowRight(-1);	
			curChid = curWinid;
			return(true);
		}else{
			return (($p.attr("name") != "active")?true:false);
		}
	}
	
	//------live页面Button注册------
	UI.Button(".liveBtnBt1", 32, null, function(e, p){	//视频全开
		return SPcontrol(e, p, ".liveBtnBt2", 3);
	});
	
	UI.Button(".liveBtnBt2", 32, null, function(e, p){	//视频全关
		return SPcontrol(e, p, ".liveBtnBt1", 4);
	});
	
	UI.Button(".liveBtnBt3,.liveBtnBt4,.liveBtnBt5", 32, null, function(e, p){	//上一页，下一页，全屏按钮
		var $p = $(p);
		if(e.type == "mousedown"){
			switch($p.attr("class").split("liveBtnBt")[1]*1){
				case 3:
					gDvr.PreViewFunCtrl(7, 0, gVar.nStreamType);
					break;
				case 4:
					gDvr.PreViewFunCtrl(8, 0, gVar.nStreamType);
					break;
				case 5:
					gDvr.PreViewFunCtrl(9, 0, gVar.nStreamType);
					break;
			}
		}
		return(true);
	});
		UI.Button("div[class^='liveBtnSbt']", 25,null, function(e, p){	//分屏按钮
			var $p = $(p);
			if(e.type == "mousedown"){
				if($p.attr("name") != "active"){
					var $x = $("div[class^='liveBtnSbt']");
					$x.css("background-position-x", "0px");
					$x.attr("name", "");
					$x.mouseover();
					$p.attr("name", "active");
				}else{
					return false;
				}  

				gDvr.PreViewFunCtrl(6, $p.attr("flag").split("_")[0]*1, $p.attr("flag").split("_")[1]*1);

				return(true);
			}else{
				return (($p.attr("name") != "active")?true:false);
			}
		});
	
	
	$(".liveBtnBt6").click(function(){	//live页面底部收起栏
		var $p = $(".liveSSBtn");
		if ($(this).attr("tag") == 'open'){
			$p.animate({width:"0px"}, 200);
			$(this).attr("tag", "close");
		}else{
			$(this).attr("tag", "open");
			$p.animate({width:$p.attr("widthR")}, $p.attr("widthR")*1);
		}
	});
	
	UI.Button(".liveBtnBt8", 32, null, function(e, p){	//屏幕云台开关
		var $p = $(p)
		if(e.type == "mousedown"){
			var res = 0;
			if($p.attr("name") != "on"){
				res = gDvr.PTZcontrol(97, $("#gsliderCov").attr("speed")|0, 0, 0, 0, 0);
				if(res == 0) {$p.attr("name","on");}
			}else {
				res = gDvr.PTZcontrol(98, $("#gsliderCov").attr("speed")|0, 0, 0, 0, 0);
				if(res == 0) {$p.attr("name","off");}
			}
			if(res == 2) { ShowPaop(lg.get("IDS_PTZ_CTRL"), lg.get("IDS_PLAYBACK_RIGHT1")); }
		}else if(e.type == "mouseover")
		{
			if($p.attr("name") != "on"){ 
				$p.attr("title",lg.get("IDS_SCREEN_PTZ_ENABLE"))
			}else {
				$p.attr("title",lg.get("IDS_SCREEN_PTZ_DISABLE"))
			}
		}
		return true;
	});
	//------live页面Button注册完毕------

//////////////////////////////////控制//////////////////////////////////////////////////////////////////	
	//页面切换
	var clickState = 1;   //clickState的值  1:点击LiveMenu  2:点击playBackMenu  3:点击ConfigMenu  4:点击PathMenu  5:点击LogoutMenu
	$(function(){
//1、 liveMenu
		$("#LiveMenu").mouseover(function(){
			if(clickState == 1){          
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});   //点击时的图片
			}else{ 
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});     //鼠标经过时的图片				
			}			
		});			
			
		$(".Menu1").click(function(){	//live			
			gVar.ChangPage("live");
			tabkey = 0;
			
			if( gDvr.obj.IsCurrentPlay() != 2){  //如果不是"正在回放",变成LiveMenu
				clickState = 1;				
			}else{
				clickState = 2;  //正在回放，还是PalyBackMenu
			}			
		});		
		
		$("#LiveMenu").mouseout(function(){
			if(clickState == 1){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});  				
			}			
		});		
		
//2、 playBackMenu
		$("#PlayBackMenu").mouseover(function(){
			if(clickState == 2){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});
			}			
		});
		
		$(".Menu2").click(function(){	//playback			
			gVar.ChangPage("playback");
			tabkey = 1;
			clickState = 2;
		});		
		
		$("#PlayBackMenu").mouseout(function(){
			if(clickState == 2){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});				
			}			
		});
		
//3、 ConfigMenu		
		$("#ConfigMenu").mouseover(function(){
			if(clickState == 3){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});
			}			
		});		
		
		$(".Menu3").click(function(){	//ConfigMenu
			gVar.ChangPage("config");
			tabkey = 1;
			
			if( gDvr.obj.IsCurrentPlay() != 2){  //如果不是"正在回放",变成ConfigMenu
				clickState = 3;				
			}else{
				clickState = 2;  //正在回放，还是PalyBackMenu				
			}			
		})
		
		$("#ConfigMenu").mouseout(function(){
			if(clickState == 3){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});				
			}
		});	
		
//4、 PathMenu
		$("#PathMenu").mouseover(function(){
			if(clickState == 4){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});
			}
		});
		
		$(".Menu4").click(function(){	//PathMenu
			gVar.ChangPage("configPage");
			tabkey = 1;
			
			if( gDvr.obj.IsCurrentPlay() != 2){  //如果不是"正在回放",变成PathMenu
				clickState = 4;				 
			}else{
				clickState = 2;  //正在回放，还是PalyBackMenu
			}			
		})
		
		$("#PathMenu").mouseout(function(){			
			if(clickState == 4){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});				
			}
		});
		
//5、 LogoutMenu
		$("#LogoutMenu").mouseover(function(){			
			if(clickState == 5){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});
			}			
		});
				
		$("#LogoutMenu").mouseout(function(){			
			if(clickState == 5){
				$(this).css({"background":"#fff","color":"#0E2D5F","font-weight":"bold"});
			}else{
				$(this).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});				
			}			
		});		
		
		$(".Menu5").click(function(){	//LogoutMenu
			menutitle(5); 
			closewnd();
			if(gIELogin){
				window.location.href = "login.html";
			}else{
				window.location.href = "login.html?NetViewerLogin";
			}
			clickState = 5;
			
		});
		
		$(".paopao_close").click(function(){
			$("#MsgPaop").css("display","none").attr("name","out");
		}).mouseover(function(){
			$(this).css("background-position", "-15px").css("cursor", "pointer");
		}).mouseout(function(){
			$(this).css("background-position", "0px")
		})
	});
}

function LoadLoginPage(){	//载入页面
	$.get("html/login.html?t="+gVar.nDate,"",function(data){
		jQuery("head").append('<link href="css/login.css" rel=\"stylesheet\" type=\"text/css\" />');
		$("#login").prop("innerHTML", data).css("display", "block");
		lan("login");
		UI.Button(".loginBtn",80);
		//填充cookie
		gVar.user = $.cookie("userName");
		if ($.cookie("userName") == null){
			if(lgCls.version=="RCI"){
				gVar.user = "admin";
			}else{
				gVar.user = "admin";
			}
		}
		$("#username").val(gVar.user);
		//username界面处理
		if(lgCls.version=="RCI"){
			$("#login_username_text").css("display","none");
			$("#login_username_select").css("display","block");
			
			if(gVar.user == "admin"){
				$("#username_s").prop({"selectedIndex":0});
			}else if(gVar.user == "manager"){
				$("#username_s").prop({"selectedIndex":1});
			}else if(gVar.user == "viewer"){
				$("#username_s").prop({"selectedIndex":2});
			}else{
				$("#username_s").prop({"selectedIndex":0});
				$("#username").val("admin");
			}
		}
		//语言	
		$("#login_language").empty();
		for(var i=0; i<lgCls.mul.length; i++){
			$("#login_language").append('<option class="option" value="'+lgCls.mul[i][0]+'">'+lgCls.mul[i][1]+'</option>');
		}

		//IP Login
		if(gIELogin == false){
			$("#ipaddress_s").empty();
			var IpInfoXml = gDvr.GetIpPortInfo();//IP的接口
			
			var IpNum = findNode("Num", IpInfoXml)*1;
			for(var i=0; i<IpNum; i++){
				var str = findNode("IpPort"+i, IpInfoXml);//str的值:172.18.12.60 20220
				var temp = str.split(" ");			
				lgCls.IpPortInfo[i] = new Array;			
				lgCls.IpPortInfo[i][0] = temp[0];//IP
				lgCls.IpPortInfo[i][1] = temp[1];//Port
				$("#ipaddress_s").append('<option class="option" value="'+i+'">'+lgCls.IpPortInfo[i][0]+'</option>');//IP Address列表
			}
			if(IpNum != 0){
				$("#ipaddress_s").append('<option class="option" value="clear">---clear---</option>');
				$("#ipaddress_s").value="0";//IP Address赋值，显示第一个
				setTimeout(function(){InputIpadderss();},0);
			}
		}
			
		//ID Login
		if(gIELogin && gIDLogin)
		{
			$("#ipaddress_s").empty();
			var IdInfoXml = gDvr.GetDevIDXml();//ID的接口
			var IpNum = findNode("Num", IdInfoXml)*1;
			for(var i=0; i<IpNum; i++){
				var str = findNode("ID"+i, IdInfoXml);
				lgCls.DevID[i] = str;
				$("#ipaddress_s").append('<option class="option" value="'+i+'">'+str+'</option>');//DeviceID列表
			}
			if(IpNum != 0){
				$("#ipaddress_s").append('<option class="option" value="clear">---clear---</option>');
				$("#ipaddress_s").value="0";//DeviceID赋值，显示第一个
				setTimeout(function(){InputIpadderss();},0);
			}
			
			$("#ipadderss_div").css("display","block");
			$("#ipaddress").css("display","block");
			$("#loginType").css("display","block");
			$("#loginType_div").css("display","block");
			ipaddress.innerHTML="NVR " + lg.get("IDS_DEVID");
			loginType.innerHTML=lg.get("IDS_LOGIN_TYPE");
			$("#Web_false").css("margin-top","40px");
		}
		else 
		{
			$("#meatePort").css("display","block");
			$("#mediaPort_div").css("display","block");
		}
		
		if(lgCls.mul.length < 2){
			$("#login_language").prop("disabled",true);
		}
		else{
			$("#login_language").prop("disabled",false);
		}
		$("#login_language").val(gVar.lg)
		
		$("#login_language").change(function(){
			lg.refresh();
			gVar.lg = $(this).val();
			LanguageCall($(this).val());
		});
		
		if ($.cookie("remenber") == 1){
			if($.cookie("pwd") != null && $.cookie("pwd") != ""){
				$("#passwd").val(gDvr.Decode($.cookie("pwd")));
			}else{
				$("#passwd").val("");
			}
			$("#remenberText").prop("checked", 1);
		}
		if(gVar.mediaport == null){
			gVar.mediaport = 9000;
		}
		$("#mediaPort").val(gVar.mediaport);
		if(1/*0x9616 != gVar.nDevType*1*/){//9016
			$("#loginmlsel,#streamcode").css("display","block");
			$("#Web_false").css("margin-top","80px");	
		}
		
		if(gIELogin == false){
			$("#ipadderss_div").css("display","block");
			$("#ipaddress").css("display","block");
			$("#Web_false").css("margin-top","40px");
		}
		
		
		if(lgCls.version == "OWL"){
			$("#login_ml option[value='2']").remove();//去掉手机码流
		}
		//登录界面logo
		if(lgCls.logo == "RAYSHARP" || lgCls.logo == "URMET" || lgCls.logo == "GTC"
		|| lgCls.logo == "COP" || lgCls.logo == "VC" || lgCls.logo == "DEFENDER"
		|| lgCls.logo == "BRIGHT" || lgCls.logo == "VOLTA" || lgCls.logo == "SECURA"
		|| lgCls.logo == "BOLIDE" || lgCls.logo == "SECURITY" || lgCls.logo == "DIGITUS"
		|| lgCls.logo == "ALTE" || lgCls.logo == "RCI" || lgCls.logo == "ITEX"
		|| lgCls.logo == "TOP" || lgCls.logo == "VISIOET"){
			//setTimeout(function(){$("#login_ml").val("0")},0);
			$(".logo").css("background", "url(images/LOGO/LOGO_"+lgCls.logo+".png) no-repeat");
			//$(".logo").css("background", "url(images/Login_"+lgCls.logo+".gif) no-repeat");
			$("#LoginLOGO").css("display","block");
		}
		/*
		if(lgCls.version == "VIDEOTECNOLOGIE"){
			//setTimeout(function(){$("#login_ml").val("0")},0);
			$(".logo").css("background", "url(images/Login_"+lgCls.logo+".png) no-repeat");
			//$(".logo").css("background", "url(images/Login_"+lgCls.logo+".gif) no-repeat"); 
			$("#LoginLOGO").css("display","block");
		}*/
		if(lgCls.logo == "HONEYWELL" || lgCls.logo == "XVISION"){
			//setTimeout(function(){$("#login_ml").val("0")},0);
			//$(".logo").css("background", "url(images/Login_"+lgCls.logo+".png) no-repeat"); 
			$("#LoginLogo_HoneyWell").css("display","block");
			$("#LoginLogo_HoneyWell").css("background", "url(images/LOGO/Login_"+lgCls.logo+".png) no-repeat"); 
			$("#userlogin").css("margin-left","0px").css("width","200px");
		}
		if(lgCls.logo == "XVISION"){
			//setTimeout(function(){$("#login_ml").val("0")},0);
			//$(".logo").css("background", "url(images/Login_"+lgCls.logo+".png) no-repeat"); 
			$("#LoginLogo_HoneyWell").css("display","block").css("width","190").css("height","50")
			.css("margin-left","-25px");
			$("#LoginLogo_HoneyWell").css("background", "url(images/LOGO/LOGO_"+lgCls.logo+".png) no-repeat"); 
			$("#userlogin").css("margin-left","0px").css("width","110px").css("float","left");
			$("#login_userlogin").css("width","150px").css("margin-left","-15px");
		}
		
		if(lgCls.version=="RCI"){
			$("#passwd").attr("maxlength","8");
		}
		if(gIELogin == true){
			$("#username").select().focus();
		}else{
			$("#ipaddress_t").select().focus();
		}
		$("#ipaddress_t, #ipaddress_s, #username, #passwd, #login_language, #username, #mediaPort, #login_ml, #login_language").keydown(function(e){
			if (e.keyCode == 13){
				Login();
			}
		});
		if ($.browser.version.indexOf("6") >= 0&&$.browser.msie){
			$(window).scroll(function(){
				window.clearTimeout(timeout);
				timeout = setTimeout(function(){
					var $p = $("select :visible");
					$p.css("display", "none").css("display", "");
				}, 10);
				
			})
		}
	},"html");
	gVar.bWebInit = true;
	
}

function LoadLeftPage(func){
	tabkey = 0;
	$.get("html/left.html?"+gVar.nDate,"",function(data){
		jQuery("head").append('<link href="css/left.css" rel=\"stylesheet\" type=\"text/css\" />');
		$(".mclcontainer").prop("innerHTML", data).attr("name", "isDown");
		setTimeout(function(){lan("left");},10);
		CreateLiveBtn();//创建左边栏按钮,注册左边栏按钮事件
		$.getScript("js/left.js",function(){
			func();
			$.getScript("js/cal.js",function(){
					$('#next_touch_date').simpleDatepicker({type:0,x:0,y:0,Laguage:gVar.lg,CallBack:pbCalCall});
					$('#next_touch_date').click();
					$("#calday").val($('#next_touch_date').simpleDatepicker.formatOutput(new Date()));
					$("#left").focus();
					$("#left").keydown(function(){
						return false;		
					})
			});
			
			if ($.browser.version.indexOf("6") >= 0&&$.browser.msie){
				$("#configMl").css("margin-left", "-7px");
				$("#rss").css("margin-left", "27px")
			}
		});
		
		if(gDvr.DevType == 4)
		{
			$("#bPbTBCheck_hide").css("display","none");
		}
		//同步回放事件注册
		$("#bPbTBCheck").click(function(){
			//$(".liveBtnBt10").css("background", "url(images/Full_Ratio.gif)");
			
			if( $(this).css("background-image").indexOf("cbox.png") >= 0 ){
				//$(this).css("background-image","url('images/cbox_on.png')");
				var ret = gDvr.SetPlayBackMode(1);
				if(ret == -1){
					ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"));
				}else{
					$(this).css("background-image","url('images/cbox_on.png')");
				}
				//bPbTBCheckValue = 1;				
			}else{
				//$(this).css("background-image","url('images/cbox.png')");
				var ret= gDvr.SetPlayBackMode(0);
				if(ret == -1){
					ShowPaop(lg.get("IDS_BTN_PLAYBACK"), lg.get("IDS_CUR_PLAY"));
				}else{
					$(this).css("background-image","url('images/cbox.png')");
				}
				//bPbTBCheckValue = 0;				
			}
			
			//$(this).css("background", "url(images/cbox_on.png)");
			//gDvr.SetPlayBackMode($(this).prop("checked")*1);
		})
	},"html");
	
	//$(".liveChannelRow").mouseover(function(){$(this).css("background", "#0f2c47");}).mouseout(function(){$(this).css("background", "url(images/content_bg.png)");});

}

function LoadOtherPage(){	
	if ($(".header").attr("name") != "isDown"){
		$(".header").attr("name", "isDown");		
		$.get("html/right.html?"+gVar.nDate,"",function(data){
			jQuery("head").append('<link href="css/right.css" rel=\"stylesheet\" type=\"text/css\" />');
			$(".mcrcmain").prop("innerHTML",data);
			lan("right");
			UI.Slider("gsliderCov", "gsliderBtn", "gslider");
			//$("#gsliderBtn").css("margin-left","75");
			
			if(/*gDvr.HkDomeFlag*/0){//xian
			
				
				$("#cruise_modeDiv_xian").css("display","block");
				$("#cruise_mode").empty();
				$("#cruise_mode").append('<option class="option" value="0">'+"默认巡航"+'</option>');
				$("#cruise_mode").append('<option class="option" value="1">'+"预置点巡航"+'</option>');
				$("#cruise_mode").append('<option class="option" value="2">'+"守望点"+'</option>');
				$("#cruise_mode").append('<option class="option" value="3">'+"区域巡航"+'</option>');
				$("#cruise_mode").val(1);
				$("#cruise_mode").change(function(){
					if($(this).val() *1 == 0){
						$("#ptz_cruise").css("display", "block");
						$("#ptz_preset").css("display", "none");
						$("#pre_pos").css("display", "none");
						$("#ytpreset").css("display", "none");
						$("#pre_add").css("display", "none");
						$("#pre_sub").css("display", "none");
						$("#pre_goto").css("display", "none");
						$("#cruise_path").css("display", "block");
						$("#ytcruise").css("display", "none");
						$("#cruise_start").css("display", "block");
						$("#cruise_stop").css("display", "block");
						$("#PTZ_interval_div").css("display","none");
						$("#PTZ_Scan_div").css("display","none");
						$("#PTZ_Speed_div").css("display","none");
					}else if($(this).val() *1 == 1){
						$("#ptz_cruise").css("display", "block");
						$("#ptz_preset").css("display","block");
						$("#pre_pos").css("display", "block");
						$("#ytpreset").css("display", "block");
						$("#pre_add").css("display", "block");
						$("#pre_sub").css("display", "block");
						$("#pre_goto").css("display", "block");
						$("#cruise_path").css("display", "block");
						$("#ytcruise").css("display", "none");
						$("#cruise_start").css("display", "block");
						$("#cruise_stop").css("display", "block");
						$("#PTZ_interval_div").css("display","block");
						$("#PTZ_Scan_div").css("display","none");
						$("#PTZ_Speed_div").css("display","none");
					}else if($(this).val() *1 == 2){
						$("#ptz_cruise").css("display", "none");
						$("#ptz_preset").css("display", "block");
						$("#pre_pos").css("display", "block");
						$("#ytpreset").css("display", "block");
						$("#pre_add").css("display", "block");
						$("#pre_sub").css("display", "none");
						$("#pre_goto").css("display", "none");
						$("#cruise_path").css("display", "none");
						$("#ytcruise").css("display", "none");
						$("#cruise_start").css("display", "none");
						$("#cruise_stop").css("display", "none");
						$("#PTZ_interval_div").css("display","none");
						$("#PTZ_Scan_div").css("display","none");
						$("#PTZ_Speed_div").css("display","none");
					}else if($(this).val() *1 == 3){
						$("#ptz_cruise").css("display", "block");
						$("#ptz_preset").css("display", "none");
						$("#pre_pos").css("display", "none");
						$("#ytpreset").css("display", "none");
						$("#pre_add").css("display", "none");
						$("#pre_sub").css("display", "none");
						$("#pre_goto").css("display", "none");
						$("#cruise_path").css("display", "block");
						$("#ytcruise").css("display", "none");
						$("#cruise_start").css("display", "block");
						$("#cruise_stop").css("display", "block");
						$("#PTZ_interval_div").css("display","none");
						$("#PTZ_Scan_div").css("display","block");
						$("#PTZ_Speed_div").css("display","block");
					}
				});
				
				$("#cruise_mode").change();
			}else{
				$("#ptz_cruise").css("display", "block");
				$("#ptz_preset").css("display", "block");
				$("#pre_pos").css("display", "block");
				$("#ytpreset").css("display", "block");
				$("#pre_add").css("display", "block");
				$("#pre_sub").css("display", "block");
				$("#pre_goto").css("display", "block");
				$("#cruise_path").css("display", "block");
				$("#ytcruise").css("display", "block");
				$("#cruise_start").css("display", "block");
				$("#cruise_stop").css("display", "block");
			}
			
			if(lgCls.version == "HONEYWELL"){
				$("#ytpreset").css("border", "1px solid white");
				$("#ytcruise").css("border", "1px solid white");
				//$("#ptz_default").css("display", "block");
			}
			UI.Button(".jjjiao,.jjjian,.gqjiao,.bjjiao,.gqjian,.bjjian", 30, null, function(e, p){
				PTZPro(e,p);
				return true;
			});
			
			UI.Button(".rtstyle1", 28,0,function(e,p){
				if(e.type == "mousedown"){
				var $p = $(p);
				var res = 0;
				var pos = $("#preset").val() *1;
				var cruise = $("#cruise").val()*1;
				if(/*gDvr.HkDomeFlag*/0){//xian
					cruise = $("#cruise_mode").val()*1;
				}
				var interval = $("#PTZ_interval_sel").val()*1;
				var speed = $("#PTZ_Speed_sel").val()*1;
				if($p.attr("id") == "pre_goto" ){ 
				 res = gDvr.PTZcontrol(93, 0, 0, pos, 0, 0); //goto the presetpos
 				}else if($p.attr("id") == "pre_add") {
					if(cruise == 2){
						res = gDvr.PTZcontrol(90, 0, 0, pos, 0, 0); //add the presetpos
					}else{
				 		res = gDvr.PTZcontrol(91, 0, 0, pos, 0, 0); //add the presetpos
					}
					if(res == 0){ var value = (pos +1)>255 ? 1: pos+1;
						$("#preset").val(value);
					}	
				}else if($p.attr("id") == "pre_sub") {
				 res = gDvr.PTZcontrol(92, 0, 0, pos, 0, 0); //clear the presetpos
				  if(res == 0){ var value = (pos -1) <= 0 ? 255: pos-1;
				  $("#preset").val(value);
				 }			
				}else if($p.attr("id") == "Scan_start"){
					res = gDvr.PTZcontrol(98,0,0,0, 0, 0);
				}else if($p.attr("id") == "Scan_stop"){
					res = gDvr.PTZcontrol(99,0,0,0, 0, 0);
				}else if($p.attr("id") == "cruise_start"){
					res = gDvr.PTZcontrol(51,0,0,cruise,interval,speed);
				}else if($p.attr("id") == "cruise_stop"){
				   res = gDvr.PTZcontrol(51,0,1,cruise,interval,speed);
				}}
				
				if(res == 2){ShowPaop(lg.get("IDS_PTZ_CTRL"), lg.get("IDS_PLAYBACK_RIGHT1"));}
				 return true;
			},"html");
			UI.Button(".rtstyle1", 28, 0, function(e, p){
				var $p = $(p);
				return true;
			});
			
			
			UI.Button(".rtstyle1_1", 43,0,function(e,p){
				/*if($("#cruise_start").prop("disabled") == true){
					return false;
				}
				if($("#cruise_stop").prop("disabled") == true){
					return false;
				}*/
				if(e.type == "mousedown"){
					var $p = $(p);
					var res = 0;
					var pos = $("#preset").val() *1;
					var cruise = $("#cruise").val()*1;
					if(/*gDvr.HkDomeFlag*/0){//xian
						cruise = $("#cruise_mode").val()*1;
					}
					var interval = $("#PTZ_interval_sel").val()*1;
					var speed = $("#PTZ_Speed_sel").val()*1;
					if($p.attr("id") == "pre_goto" ){ 
						res = gDvr.PTZcontrol(93, 0, 0, pos, 0, 0); //goto the presetpos
 					}else if($p.attr("id") == "pre_add") {
						if(cruise == 2){
							res = gDvr.PTZcontrol(90, 0, 0, pos, 0, 0); //add the presetpos
						}else{
							res = gDvr.PTZcontrol(91, 0, 0, pos, 0, 0); //add the presetpos
						}
						if(res == 0){ var value = (pos +1)>255 ? 1: pos+1;
				 			$("#preset").val(value);
						}	
					}else if($p.attr("id") == "pre_sub") {
						res = gDvr.PTZcontrol(92, 0, 0, pos, 0, 0); //clear the presetpos
				 		if(res == 0){ var value = (pos -1) <= 0 ? 255: pos-1;
				 			$("#preset").val(value);
						}			
					}else if($p.attr("id") == "Scan_start"){
						res = gDvr.PTZcontrol(98,0,0,0, 0, 0);
					}else if($p.attr("id") == "Scan_stop"){
						res = gDvr.PTZcontrol(99,0,0,0, 0, 0);
					}else if($p.attr("id") == "cruise_start"){
						res = gDvr.PTZcontrol(51,0,0,cruise,interval,speed);
					}else if($p.attr("id") == "cruise_stop"){
					   res = gDvr.PTZcontrol(51,0,1,cruise,interval,speed);
					}
				}
				
				if(res == 2){ShowPaop(lg.get("IDS_PTZ_CTRL"), lg.get("IDS_PLAYBACK_RIGHT1"));}
				 		return true;
			});
			UI.Button(".rtstyle1_1", 43, 0, function(e, p){
				/*if($("#cruise_start").prop("disabled") == true){
					return false;
				}
				if($("#cruise_stop").prop("disabled") == true){
					return false;
				}*/
				var $p = $(p);
				return true;
			});
			UI.Button(".rtstyle5", 95, 0, function(e,p){
				if($("#color_default").prop("disabled") == true){
					return false;
				}
				if (e.type == "mousedown"){
					//还原控制云台
					//gDvr.GetAndSetVideoInfo("VideoSet", 1, "6,31,36,30,31");//设置默认值
					gDvr.GetAndSetVideoInfo("VideoSet", 1, "6,255,255,255,255");//设置默认值
					gDvr.GetAndSetVideoInfo("VideoSet", 0, "");//获取最新信息
				}
				return true;
			});
			
			$(".liveBtnBt9").mouseover(function(){
				$(this).css("cursor", "pointer");
				if ($(this).attr("name") != "active"){
					$(this).attr("title",lg.get("IDS_SOUND_OFF"));
				}else{
					$(this).attr("title",lg.get("IDS_SOUND_OPEN"));
				}
			}).mousedown(function(){
				if ($(this).attr("name") != "active"){
					gDvr.PreViewSound(0);				//预览声音按钮是全局的，和通道无关
					//if (0 != gDvr.PreViewSound(0)) return;
					$(this).css("background-position", "32px 0px").attr("name", "active");
				}else{
					gDvr.PreViewSound(1);
					//if (0 != gDvr.PreViewSound(1)) return;
					$(this).css("background-position", "0px 0px").attr("name", "");
				}
			})
			
			//点击Zoom图标，调用插件接口
			$(".liveBtnBt11").mouseover(function(){
				$(this).css("cursor", "pointer");
				if ($(this).attr("name") != "active"){
					$(this).attr("title",lg.get("IDS_ELEC_AMPLIFICATION"));
				}else{
					$(this).attr("title","");
				}
			}).mousedown(function(){
				//curChid,通知插件，要Zoom的窗口
				if (0 != gDvr.Zoom(curChid)) return;
				if ($(this).attr("name") != "active"){
					$(this).css("background-position", "0px 0px").attr("name", "active");//off-->on
				}else{
					$(this).css("background-position", "32px 0px").attr("name", "");//on-->off
				}
			})
			/*
			$(".liveBtnBt10").mouseover(function(){
				$(this).css("cursor", "pointer").css("background-position","-30px");
				$(this).attr("title","Video Set");
				
			}).mousedown(function(){
				$(this).css("background-position","-60px");
				gDvr.ShowVideoSet();
			}).mouseleave(function(){
				$(this).css("background-position","0px");
			})
			*/
			
			var p = $(".liveBtnBt10");
			$(p).mouseover(function(e){
					$(p).css("cursor", "pointer");
					if(gVar.nVideoSize == 1){
						$(p).css("background-position", "-32px -160px");
					}else{
						$(p).css("background-position", "-96px -160px");
					}
			}).mouseout(function(e){
				if(gVar.nVideoSize == 1){
					$(p).css("background-position", "-0px -160px");
				}else{
					$(p).css("background-position", "-64px -160px");
				}
			}).mousedown(function(e){
				if (gVar.nVideoSize == 1){
					$(p).css("background-position", "-64px -160px");
				}else{
					$(p).css("background-position", "-0px -160px");
				}
			}).mouseup(function(e){
				gVar.nVideoSize = (!gVar.nVideoSize) & 1;
				gDvr.SetOriginalVideo(gVar.nVideoSize);
				
				if (gVar.nVideoSize == 1){
					//$(p).css("background-position", "-0px -160px");
					$(".liveBtnBt10").attr("title",lg.get("IDS_BESPREAD"))
				}else{
					//$(p).css("background-position", "-64px -160px");
					$(".liveBtnBt10").attr("title",lg.get("IDS_PREVIEW_MENUSIZE"))
				}
			})
			
			function PTZPro(e,p){
				var res = 0;
				if (e.type == "mousedown"){
					p.mousedown = true;
					var cmd = $(p).attr("id").split("_")[2]*1;
					res = gDvr.PTZcontrol(cmd, $("#gsliderCov").attr("speed")|0, 0, 0, 0, 0);
					if(res == 2) { ShowPaop(lg.get("IDS_PTZ_CTRL"), lg.get("IDS_PLAYBACK_RIGHT1")); }
				}else if (e.type == "mouseup"){
					p.mousedown = false;
					var cmd = $(p).attr("id").split("_")[2]*1;
					res = gDvr.PTZcontrol(cmd, $("#gsliderCov").attr("speed")|0, 1, 0, 0, 0);
				}else if(e.type == "mouseout"){
					if (p.mousedown){
						p.mousedown = false;
						var cmd = $(p).attr("id").split("_")[2]*1;
						res = gDvr.PTZcontrol(cmd, $("#gsliderCov").attr("speed")|0, 1, 0, 0, 0);
					}
				}
			}
			//云台
			$("#live_yt1_1").mouseover(function(){$("#LIVE_YT").css("background-position", "-160px 0px"); }).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});		
			$("#live_yt2_5").mouseover(function(){$("#LIVE_YT").css("background-position", "-640px -160px");}).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});
			$("#live_yt3_6").mouseover(function(){$("#LIVE_YT").css("background-position", "-320px 0px");}).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});
			$("#live_yt5_3").mouseover(function(){$("#LIVE_YT").css("background-position", "-480px -160px");}).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});
			$("#live_yt6_21").mouseover(function(){$("#LIVE_YT").css("background-position", "0px -160px");}).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});
			$("#live_yt4_4").mouseover(function(){$("#LIVE_YT").css("background-position", "-480px 0px");}).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});
			$("#live_yt2_7").mouseover(function(){$("#LIVE_YT").css("background-position", "-320px -160px");}).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});
			$("#live_yt3_8").mouseover(function(){$("#LIVE_YT").css("background-position", "-640px 0px");}).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});
			$("#live_yt1_2").mouseover(function(){$("#LIVE_YT").css("background-position", "-160px -160px");}).mouseout(function(){$("#LIVE_YT").css("background-position", "0px 0px");});
			
			//云台
			UI.Button("div[id ^= 'live_yt1_']", 0, null, function(e,p){				
				PTZPro(e,p);
				return true;
			});
	
			UI.Button("div[id ^= 'live_yt2_']", 0, null, function(e,p){				
				PTZPro(e,p);
				return true;
			});
			
			UI.Button("div[id ^= 'live_yt3_']", 0, null, function(e,p){				
				PTZPro(e,p);
				return true;
			});
			
			UI.Button("div[id ^= 'live_yt4_']", 0, null, function(e,p){
				PTZPro(e,p);
				return true;
			});
			
			UI.Button("div[id ^= 'live_yt5_']", 0, null, function(e,p){
				PTZPro(e,p);
				return true;
			});
			
			UI.Button("div[id ^= 'live_yt6_']", 0, null, function(e,p){
				if (e.type == "mousedown"){
					PTZPro(e,p);
				}
				return true;
			});
			//预置点
			for (var i=1; i<256; i++){
			$("#preset").append('<option class="option" value="'+i+'">'+i+'</option>');}
			
			$("#PTZ_Speed_sel").append('<option class="option" value="'+1+'">'+lg.get("IDS_CAM_HIGHT")+'</option>');
			$("#PTZ_Speed_sel").append('<option class="option" value="'+2+'">'+lg.get("IDS_CAM_MIDD")+'</option>');
			$("#PTZ_Speed_sel").append('<option class="option" value="'+3+'">'+lg.get("IDS_CAM_LOW")+'</option>');
			
			$("#PTZ_interval_sel").append('<option class="option" value="'+0+'">'+"5S"+'</option>');
			$("#PTZ_interval_sel").append('<option class="option" value="'+1+'">'+"10S"+'</option>');
			$("#PTZ_interval_sel").append('<option class="option" value="'+2+'">'+"15S"+'</option>');
			
			//提示语
	$(".liveBtnBt1").attr("title",lg.get("IDS_OPEN_ALL_CHANNEL"))
	$(".liveBtnBt2").attr("title",lg.get("IDS_CLOSE_ALL_CHANNEL"))
	$(".liveBtnBt3").attr("title",lg.get("IDS_TIP_PRE"))
	$(".liveBtnBt4").attr("title",lg.get("IDS_TIP_NEXT"))
	$(".liveBtnBt5").attr("title",lg.get("IDS_FULLSCREEN"))
	$(".liveBtnBt6").attr("title",lg.get("IDS_TIP_SPLITER"))
	//$(".liveBtnBt12").attr("title",lg.get("IDS_REC_CUT"))
	if(gVar.nVideoSize == 1){
		$(".liveBtnBt10").attr("title",lg.get("IDS_BESPREAD"));
		$(p).css("background-position", "-0px -160px");
	}else{
		$(".liveBtnBt10").attr("title",lg.get("IDS_PREVIEW_MENUSIZE"));
		$(p).css("background-position", "-64px -160px");
	}
	
	$("#live_yt_11").attr("title",lg.get("IDS_PTZ_ZOOMUP"))
	$("#live_yt_12").attr("title",lg.get("IDS_PTZ_ZOOMDOWN"))
	$("#live_yt_13").attr("title",lg.get("IDS_PTZ_FOCUSUP"))
	$("#live_yt_14").attr("title",lg.get("IDS_PTZ_FOCUSDOWN"))
	$("#live_yt_15").attr("title",lg.get("IDS_PTZ_IRIUP"))
	$("#live_yt_16").attr("title",lg.get("IDS_PTZ_IRIDOWN"))
	$("#ytctrl_5").attr("title",lg.get("IDS_PTZ_AUTO"))
	$("#live_yt2_5").attr("title",lg.get("IDS_PTZ_LEFTUP"))
	$("#live_yt1_1").attr("title",lg.get("IDS_PTZ_UP"))
	$("#live_yt3_6").attr("title",lg.get("IDS_PTZ_RIGHTUP"))
	$("#live_yt5_3").attr("title",lg.get("IDS_PTZ_LEFT"))
	$("#live_yt6_21").attr("title",lg.get("IDS_PTZ_AUTO"))
	$("#live_yt4_4").attr("title",lg.get("IDS_PTZ_RIGHT"))
	$("#live_yt2_7").attr("title",lg.get("IDS_PTZ_LEFTDOWN"))
	$("#live_yt1_2").attr("title",lg.get("IDS_PTZ_DOWN"))
	$("#live_yt3_8").attr("title",lg.get("IDS_PTZ_RIGHTDOWN"))
	
	$("#live_wd_ld1").attr("title",lg.get("IDS_CONSTRAST")).mouseover(function(){$(this).css("cursor", "pointer")})
	$("#live_wd_dbd1").attr("title",lg.get("IDS_LIGHT")).mouseover(function(){$(this).css("cursor", "pointer")})
	$("#live_wd_bhd1").attr("title",lg.get("IDS_SATURATION")).mouseover(function(){$(this).css("cursor", "pointer")})
	if(lgCls.version == "HONEYWELL"){
		$("#live_wd_sj1").attr("title",lg.get("IDS_ACUTANCE")).mouseover(function(){$(this).css("cursor", "pointer")})
	}else{
		$("#live_wd_sj1").attr("title",lg.get("IDS_HUE")).mouseover(function(){$(this).css("cursor", "pointer")})
	}
	$("#live_wd_sd1").attr("title",lg.get("IDS_SOUND")).mouseover(function(){$(this).css("cursor", "pointer")})
	
		//contrast.innerHTML=lg.get("IDS_CONSTRAST");//对比度
		//saturation.innerHTML=lg.get("IDS_SATURATION");//饱和度
		//levels.innerHTML=lg.get("IDS_HUE");//色阶
		//sound.innerHTML=lg.get("IDS_SOUND");//声音
	
	
	$("#pre_sub").attr("title",lg.get("IDS_DEl_PRESET"))
	$("#pre_add").attr("title",lg.get("IDS_BTN_ADD_PRESET"))
	$("#pre_goto").attr("title",lg.get("IDS_CALL_PRESET"))
	
	$("#cruise_stop").attr("title",lg.get("IDS_STOP_CURISE"))
	$("#cruise_start").attr("title",lg.get("IDS_CALL_CURISE"))
	
		},"html");
	}
}

function GetDeviceName(strID){
	var xmlRequest = null;
	var ret = false;
	try{
		xmlRequest = new XMLHttpRequest();
	}catch(e){
		try{
			xmlRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e){
			xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	if(xmlRequest == null) return false;
	
	var url = '/queryinfo.php?DevID=' + strID + '&t='+gVar.nDate;
	xmlRequest.onreadystatechange = queryCallback;
	xmlRequest.open("post",url,false);
	xmlRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xmlRequest.send(null); 
	
	function queryCallback(xml){
		if(xmlRequest.readyState==4 && xmlRequest.status==200){
			var infos = xmlRequest.responseXML.getElementsByTagName("response");
			gVar.devName = infos[0].getElementsByTagName('DevName')[0].firstChild.data;
			ret =  true;
		}
	}
	return ret;
}
function LoginSet(){
        $('#username').val('admin');
        $('#passwd').val('yw1234');
        $('#mediaPort').val('9000');
}
//登陆函数
function Login(OpenPreView,user,passwd,mediaport,nStreamType,ip){
	//MasklayerShow();
	LoadOtherPage();//载入其他页面
	gVar.nOpenPreView = OpenPreView;
	gVar.user = user;
	gVar.passwd = passwd;
	gVar.mediaport = mediaport;
	gVar.nStreamType = nStreamType;
	
	//ID登录时，把ID转换成IP、Port，再传到插件
	/*if(gIELogin && gIDLogin)
	{
		AnalyzeDevID($("#ipaddress_t").val());
		//AnalyzeIPAndPort();
	}*/
	
	//ID登录时，获取ID，直接传到插件
//	if(gIELogin && gIDLogin)
//	{
//		gVar.ip = $.trim(ip);
//		if(gVar.ip == ""){
//			Web_prompt(lg.get("IDS_ID_EMPTY"));
//			return;
//		}
//			//判断ID对应的设备是否为NVR
//		var ret = GetDeviceName(gVar.ip);
//		if(ret){
//			var name = gVar.devName.substr(0,3);
//			if(name == "NVR"){
//				//alert("类型正确");
//			}else{
//				Web_prompt(lg.get("IDS_ID_TYPEERROR"));
//				return;
//			}
//		}else{
//			Web_prompt(lg.get("IDS_ID_ERROR"));
//			return;
//		}
//	}
	
	//IP
	if(gIELogin == false){
		gVar.ip = ip; 
	}
	
	if (gVar.mediaport == ""){
		if(gIELogin && gIDLogin){
			gVar.mediaport = 9000;
		}else{
			Web_prompt(lg.get("IDS_ADDINFO_PORT"));
			MasklayerHide();
			return;
		}
	}
	
	if(gVar.user == ""){
		Web_prompt(lg.get("IDS_NO_USERNAME"));
		MasklayerHide();
		return;
	}

	var err = gDvr.UserLogin(gVar.mediaport, gVar.ip, gVar.user, gVar.passwd);

	if (err != 0){
		switch(err){
			case 6://初始化失败
				break;
			case 1:
				Web_prompt(lg.get("IDS_ADDINFO_PORT"));
				break;
			case 2://IP错误
				break;
			case 3:
				Web_prompt(lg.get("IDS_NO_USERNAME"));	
				break;
		}
		MasklayerHide();

	}
}

function InputIpadderss(){
	if(gIELogin && gIDLogin)
	{
		//输入ID
		InputDevID();
	}
	else
	{
		var sel = $("#ipaddress_s").val();
		if(sel != "clear"){
			document.getElementById("ipaddress_t").value = lgCls.IpPortInfo[sel][0];
			document.getElementById("mediaPort").value = lgCls.IpPortInfo[sel][1];
		}else{
			//clear IP
			gDvr.ClearIpAndPortInfo();
			$("#ipaddress_s").empty();
			document.getElementById("ipaddress_t").value = "";
			document.getElementById("mediaPort").value = "";
		}
	}
	
}

function AutoShutDown(){
	if(g_autoShutDownTimeID != 0){
		clearTimeout(g_autoShutDownTimeID);
	}
	g_autoShutDownTimeID = setTimeout(function(){
		if(g_bIsupgrading != true){
			//closewnd();
			if(gIELogin){
				window.location.href = "login.html";
			}else{
				window.location.href = "login.html?NetViewerLogin";
			}
		}
	},600000);
}

function InputDevID(){
	var sel = $("#ipaddress_s").val();
	if(sel != "clear"){
		document.getElementById("ipaddress_t").value = lgCls.DevID[sel];
	}else{
		gDvr.ClearDevIDInfo();
		$("#ipaddress_s").empty();
		document.getElementById("ipaddress_t").value = "";
	}
}

function InputUsername(){
	var index = $("#username_s").val();
	var txt = document.getElementById("username_s").options[index].innerText;
	//alert(txt);
	document.getElementById("username").value = txt;
}


function UserLoginEvent(msgID, chNumber, userPageRt, userPreviewRt, userRecRt){
	//console.log("msgID:" + msgID);
	switch(msgID){
		case 2:
		    Web_prompt(lg.get("IDS_WEBF_FALSE"));
			break;
		case 101: //登陆成功
		    try{
				//保存cookie
				var option = {expires: 10};
				$.cookie("userName", gVar.user,option);//设置用户名，保存到cookie中
				$.cookie("language", 1,option);//永远只能是中文
				if ($("#remenberText").prop("checked")*1){
					if($("#passwd").val() != null && $("#passwd").val() != ""){
						$.cookie("pwd", gDvr.Encode($("#passwd").val()),option);
					}else{
						$.cookie("pwd","",option);
					}
					$.cookie("remenber", 1,option);
				}else{
					$.cookie("remenber", 0,option);
					$.cookie("pwd", "",option);
					$("#passwd").val("")
					$("#remenberText").prop("checked", 0);
				}
				gDvr.SetStreamType(gVar.nStreamType);
				gDvr.AnalyLogRes(gDvr.GetDvrInfo());	//初始化控件，获取设备信息
				for(var i=0; i<gDvr.nChannel; i++){
					var obj = {};
					obj.ChannelMask = 1<<i;
					obj.ProtocolType = 0;
					obj.Abilities = 0;
					obj.State = 3;
					obj.IPCDevTypeFlag = 0;
					obj.NewDevAbilityModeFlag = 0;
					IpcAbility.push(obj);
				}
                //gDvr.PreViewFunCtrl(1, DrvNo16b, gVar.nStreamType);//初始化完成之后，打开指定的频道	
				if(gDvr.DevType !=4){
					$(".container").css("height","100%").css("min-height","768px").css("min-width","1024px");
				}
                                       <!-- 是否修改密码  判断 -->
				if(gDvr.bAdmin && gVar.passwd == "000000" && (0/*lgCls.version == "KGUARD"*/ && gDvr.DevType == 3 )){
					ToModifiPage();
					MasklayerHide();
					return;
				}
				
				if(gIELogin && gIDLogin){
					gDevID = $("#ipaddress_t").val();
					var ret = gDvr.SetDevIDInfo(gDevID);
				}
				//updateIpcAbility();
				
				//进入live页面
				LoadLeftPage(function(){
					LoadLiveTile();//load the head title
                  	$("#dvrocx").css({width:"100%", height:"100%"});
					$("#login").remove();
					$(".mheader").css("display", "block");
					
					$(".header").css("height", "54px");
					$(".main").css("width", "100%");
					$(".main").css("height","92%");
					
					$(".logo").css("background","");//去除登录界面logo
					//登录后logo
					if(lgCls.logo == "KGUARD" || lgCls.logo == "VIDEOTECNOLOGIE" || lgCls.logo == "VC"
					|| lgCls.logo == "COP" || lgCls.logo == "DEFENDER" || lgCls.logo == "XVISION" 
					|| lgCls.logo == "OWL"  || lgCls.logo == "BRIGHT"  || lgCls.logo == "THOMSON"
					|| lgCls.logo == "VOLTA" || lgCls.logo == "SECURA" || lgCls.logo == "BOLIDE"
					|| lgCls.logo == "SECURITY" || lgCls.logo == "DIGITUS" || lgCls.logo == "ALTE"
					|| lgCls.logo == "RCI" || lgCls.logo == "ITEX"|| lgCls.logo == "TOP" || lgCls.logo == "VISIOET"){
						//$(".logo").css("background", "url(images/LOGO/LOGO_KGUARD.png) no-repeat");
						$(".logo").css("background", "url(images/LOGO/LOGO_"+lgCls.logo+".png) no-repeat");
					}
					gDvr.PreViewFunCtrl(5, 0, gVar.nStreamType);
					setTimeout(function(){gDvr.GetAndSetVideoInfo("VideoSet", 0, "");},10);
					//隐藏色度条
							
					if(gDvr.DevType == 4) //IPC
					{
						$(".liveBtnBt3").css("display","none");
						$(".liveBtnBt4").css("display","none");
						$(".liveBtnBt6").css("display","none");
						$(".liveSSBtn").css("display","none");
						//$(".liveBtnBt12").css("display","inline");
					}
					//进入live页面
					//if(gDvr.DevType == 0 || gDvr.DevType == 1){
							$("#live_ptz_show").css("display","block");
					//}
				
					//界面显示处理
					switch(gDvr.nChannel*1){
						case 32:
							$(".liveSSBtn").attr("widthR", 325).css("width", 325);
							$(".liveBtnSbt14").mousedown();
							break;
						case 24:
							$(".liveSSBtn").attr("widthR", 300).css("width", 300);
							$(".liveBtnSbt13").mousedown();
							break;
						case 20:
							//只有20路，才显示"20分屏按钮"。其他路都不显示"20分屏按钮"
							$(".liveBtnSbt12_13").css("display","block");
							$(".liveSSBtn").attr("widthR", 300).css("width", 300);
							$(".liveBtnSbt12_13").mousedown();
							break;
						case 16:
							$(".liveSSBtn").attr("widthR", 275).css("width", 275);
							$(".liveBtnSbt12").mousedown();
							break;
						case 12:
						case 10:
							//只有12路，才显示"12分屏按钮"。其他路都不显示"12分屏按钮"
							$(".liveBtnSbt8").css("display","block");
							$(".liveSSBtn").attr("widthR", 200).css("width", 200);
							$(".liveBtnSbt8").mousedown();
							break;
						case 9:
                        	$(".liveBtnSbt1").mousedown();   //单通道显示
//							$(".liveBtnBt2").mousedown();    //关闭预览
                            break;                                     
						case 8:
							$(".liveSSBtn").attr("widthR", 125).css("width", 125);
                            $(".liveBtnSbt1").mousedown();
//							$(".liveBtnBt2").mousedown();    //关闭预览
							//$(".liveBtnSbt5").mousedown();
							break;
						case 4:
							$(".liveSSBtn").attr("widthR", 50).css("width", 50);
							$(".liveBtnSbt1").mousedown();
//							$(".liveBtnBt2").mousedown();    //关闭预览
							break;
						default:
							$(".liveSSBtn").attr("widthR", 275).css("width", 275);
							$(".liveBtnSbt12").mousedown();
							break;
					}
					
					if ($.browser.safari){
						if (gVar.nOpenPreView){
							$(".liveBtnBt1").mousedown();
							gVar.bliveOpen = true;
						}else {
							$(".liveBtnBt2").mousedown();
							gVar.bliveOpen = false;
						}
					}
					MasklayerHide();
				});	
				if(gIELogin == false && $.browser.msie && $.browser.version*1 >= 9){
					$(".mcright").css("height",$("body").height()*0.92+"px");
				}
			}catch(e){
			}
			
			//IE滚动重绘
			if ($.browser.msie){
				window.onscroll = function(){
               				gDvr.ChangeWndSize(9, 0, 0);
             			}
				//IE6Bug修复
				if ($.browser.version.indexOf("6") >= 0){
					window.onresize = function(){
						if (gVar.sPage == "live"){
							$(".mcmcmain").css("padding-right", "244px");
						}else if (gVar.sPage == "playback"){
							$(".mcmcontainer").removeClass("safariBug2").addClass("safariBug1")
						}
						if ($("html").height() <= 768){
							$(".main").css("height", "630px");
						}else{
							$(".main").css("height", "80%");
						}
						if ($("html").width() <= 1120){
							$(".style29").css("margin-left", "0px");
							$("body").css("width", "1200px");
						}else{
							$(".style29").css("margin-left", "10%");
							$("body").css("width", "100%");
						}
					}
					HidePaop = function(){
						$("#MsgPaop").css("display","none").fadeOut("slow").slideUp("slow").attr("name", "out");
					}
				}
			}
			//登录成功后，检测//1、点击Detect（CheckUpdate）按钮，消息到板子，查看是否要升级；返回消息，插件调用网页(显示Yes、No按钮)
			/*if(gDvr.bAdmin && gDvr.FtpPageFlag == 1 && lgCls.version == "LOREX" && gIELogin == false){
				if(gDvr.RemoteFtpUpgradeSupport == 1){
					setTimeout(function(){
						gDvr.GetDevAllStatusReq();
					},1000);
				}
			}*/
			break;
		case 102:
			Web_prompt(lg.get("IDS_NO_USERNAME"));
			break ;
		case 103:
			Web_prompt(lg.get("IDS_LOGINNOUSERNAME"));
			break ;
		case 104:
			Web_prompt(lg.get("IDS_LOGINPASSWORDERROR"))
			break ;
		case 105:
		   if(gVar.errCount > 1){
			 gVar.errCount = 0;  
			Web_prompt(lg.get("IDS_WEBF_FALSE"));
			if(!$.browser.safari)
 				gDvr.CloseNetConnect(1);
		   }
		    gVar.errCount++;
			break ;
		case 106:
		    Web_prompt(lg.get("IDS_LOGO_RIGHT"));
			break;
		case 107:
			Web_prompt(lg.get("IDS_IPBANNED"));
			break;
		case 108:
			Web_prompt(lg.get("IDS_STRVIDEO_USERFULL"));
			break;
		case -200:
			Web_prompt(lg.get("IDS_CONNECTCLOSED"));
			break;
		case -201:
			Web_prompt(lg.get("IDS_LOGO_RIGHT"));
			break;
		case -203:
			Web_prompt(lg.get("IDS_CONNECTCLOSED"));
			break;
	  }
}

function LoadLiveTile()
{
	LiveMenu_1.innerHTML = lg.get("IDS_OSD_INFO");
	PlayBackMenu_1.innerHTML = lg.get("IDS_REPLAY");
	ConfigMenu_1.innerHTML = lg.get("IDS_SYS_SET");
	PathMenu_1.innerHTML = lg.get("IDS_PATH_PATH");
	LogoutMenu_1.innerHTML = lg.get("IDS_SERVER_LOGOUT");
	menutitle(1);
}

/////////////////////////////////回调///////////////////////////////////////////////////////////////////
//live页面事件处理---------------------------------------///
function LiveCallBack(){};	//回调函数定义
function PreviewEvent(msgID, chID){
	LiveCallBack(msgID, chID);
}

function GetDataCallBack(){};//回调函数定义
function SetDataToWebEvent(data){
	GetDataCallBack(data);
}

///Playback页面事件处理-----------------------------------///
function PlayBackCallBack(){};	//回调函数定义
function PlayBackEvent(cmd,strMsg){
	PlayBackCallBack(cmd,strMsg);
}

//Config页面事件处理-------------------------------------///
function CfgCallBack(){};		//回调函数定义
function GetAndSetParamEvent(key, type, chid, strxml){
	CfgCallBack(strxml);
}

///fileupdate页面事件处理-----------------------------------///
function FileUpdateCallBack(){};	//回调函数定义
function FileUpdateEvent(pos,strMsg,type){
	FileUpdateCallBack(pos,strMsg,type);
}

///用户权限事件
function UserRightCallBack(){};   //回调函数定义
function UserRightEvent(cmID,strMsg){
	UserRightCallBack(cmID,strMsg);
}

///fileupdate页面事件处理-----------------------------------///
function ChangeCtrlPosCallBack(){};	//回调函数定义
function ChangeCtrlPosEvent(type,width,height){
	ChangeCtrlPosCallBack(type,width,height);
}

///fileupdate页面事件处理-----------------------------------///
function FtpUpdateCallBack(){};//回调函数定义
function FtpUpdateEvent(pos,status){
	FtpUpdateCallBack(pos,status);
}

////////////////ljz//////////////////////////////
function FtpIsUpdateCallBack(){}
function FtpIsUpdateEvent(){
	FtpIsUpdateCallBack(lUpdate,OldVer,NewVer,DevType);
}
function RemoteTestEvent(xml){
	var type = findNode("Key",xml)*1;
	if(type == 301){
		//var d=document.getElementById("EmailTest");
		var target_obj = jQuery('#EmailTest');
		var title;
		if(target_obj.length > 0){
			title = $("#email_config").text();;
			$("#EmailTest").prop("disabled",false);
			document.getElementById("EmailTest").value = lg.get("IDS_EMAILTEST");
		}
		target_obj = jQuery('#CloEmailTest');
		if(target_obj.length > 0){
			title = $("#Cloemail_config").text();
			$("#CloEmailTest").prop("disabled",false);
			document.getElementById("CloEmailTest").value = lg.get("IDS_EMAILTEST");
		}
		//NormalClo_StoEm页面
		target_obj = jQuery('#NormalCloStoEm_EmailTest');
		if(target_obj.length > 0){
			title = $("#NormalCloStoEm_config").text();
			$("#NormalCloStoEm_EmailTest").prop("disabled",false);
			document.getElementById("NormalCloStoEm_EmailTest").value = lg.get("IDS_EMAILTEST");
		}
		
		/*
		//if ($.browser.safari){
			$("#EmailTest").prop("disabled",false);
			document.getElementById("EmailTest").value = lg.get("IDS_EMAILTEST");
			$("#CloEmailTest").prop("disabled",false);
			document.getElementById("CloEmailTest").value = lg.get("IDS_EMAILTEST");
		//}
		*/
		var ret = findNode("RetVal",xml)*1;
		if(gDvr.NewAapterQTParamFlag == 0){
			ShowPaop(title,findNode("RetMsg",xml));
		}else{
			switch(ret){
				case 0:	ShowPaop(title,lg.get("IDS_EMAILTEST_OK"));
					break;
				case 1:	ShowPaop(title,lg.get("IDS_EMAILTEST_DNS"));
					break;
				case 3:	ShowPaop(title,lg.get("IDS_EMAILTEST_CONNECT"));
					break;
				case 4:	ShowPaop(title,lg.get("IDS_EMAILTEST_CONNECT_TIMEOUT"));
					break;
				case 8:	ShowPaop(title,lg.get("IDS_EMAILTEST_BADPORT"));
					break;
				case 10:	ShowPaop(title,lg.get("IDS_EMAILTEST_SEND_TIMEOUT"));
					break;
				case 11:	ShowPaop(title,lg.get("IDS_EMAILTEST_RECEIVE"));
					break;
				case 12:	ShowPaop(title,lg.get("IDS_EMAILTEST_RECEIVE_TIMEOUT"));
					break;
				case 13:	ShowPaop(title,lg.get("IDS_EMAILTEST_AUTH"));
					break;
				case 14:	ShowPaop(title,lg.get("IDS_EMAILTEST_SSL_RAND"));
					break;
				case 15:	ShowPaop(title,lg.get("IDS_EMAILTEST_SSL_METHOD"));
					break;
				case 16:	ShowPaop(title,lg.get("IDS_EMAILTEST_SSL_CTXNEW"));
					break;
				case 17:	ShowPaop(title,lg.get("IDS_EMAILTEST_SSL_CTXSET"));
					break;
				case 18:	ShowPaop(title,lg.get("IDS_EMAILTEST_SSL_NEW"));
					break;
				case 19:	ShowPaop(title,lg.get("IDS_EMAILTEST_SSL_SETFD"));
					break;
				case 20:	ShowPaop(title,lg.get("IDS_EMAILTEST_SSL_CONNECT"));
					break;
				case 21:	ShowPaop(title,lg.get("IDS_EMAILTEST_FOPEN"));
					break;
				default:	ShowPaop(title,lg.get("IDS_EMAILTEST_UNKNOWN"));	
					break;
			}
		}
	}else if(type == 302){
		if(gDvr.hybirdDVRFlag==1){
			//混合DVR，点击DDNSTest按钮，生产一个计时器(超时时间是2分钟)
			if(gVar.var_DDNSTest_isTimeOut==true){
				//2分钟后(已经超时)，才来消息
				return;
			}else{
				//2分钟内来消息，关掉计时器
				clearTimeout(gVar.timer_DDNSTest);
			}
		}
		
		//if ($.browser.safari){
			$("#DDNSTest").prop("disabled",false);	
			document.getElementById("DDNSTest").value = lg.get("IDS_DDNSTEST");	
		//}
		var ret = findNode("RetVal",xml)*1;
		if(gDvr.NewAapterQTParamFlag == 0){
			ShowPaop($("#ddns_config").text(),findNode("RetMsg",xml));
		}else{
			switch(ret){
				case 0:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_OK"));
					break;
				case 1:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_DNS"));
					break;
				case 4:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_CONNECT_TIMEOUT"));
					break;
				case 5:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_CONNECT_IP_TIMEOUT"));
					break;
				case 6:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_CONNECT_DDNS_TIMEOUT"));
					break;
				case 11:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_SEND_TIMEOUT"));
					break;
				case 12:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_RECEIVE"));
					break;
				case 13:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_RECEIVE_TIMEOUT"));
					break;
				case 14:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_HTTPGET"));
					break;
				case 15:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_BADAUTH"));
					break;
				case 16:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_NOHOST"));
					break;
				case 17:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_NOHOSTUSER"));
					break;
				case 18:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_ABUSE"));
					break;
				case 19:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_911"));
					break;
				case 22:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_NOT_DONATOR"));
					break;
				case 23:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_NOT_FQDN"));
					break;
				case 24:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_NOT_YOURS"));
					break;
				case 25:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_NUMHOST"));
					break;
				case 26:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_DNSERR"));
					break;
				case 27:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_IP_RESPONSE"));
					break;
				default:	ShowPaop($("#ddns_config").text(),lg.get("IDS_DDNSTEST_UNKNOWN"));	
					break;
			}
		}
	}else if(type == 309){
		var state = findNode("Statue",xml)*1;
		var Process = findNode("Process",xml)*1;
		HddFormatRet(state,Process);
	}else if(type == 337){
		var MainType = findNode("MainType",xml)*1;
		var SubType = findNode("SubType",xml)*1;
		var RetValue = findNode("RetValue",xml)*1;
		//console.log("mani.js  MainType:" + MainType + " SubType:" + SubType + " RetValue:" + RetValue);
		RemoteCloudCheck_CloudUpgradeRet(MainType,SubType,RetValue);
	}else if(type == 312){
		if($.browser.safari){
			MasklayerHide();
		}
		ShowPaop($("#ipcan_info").text(),lg.get("IDS_ADD_SUCCESS"));
	}else if(type == 321){
		var target_obj = jQuery('#NewCloSto_Test_Email');
		var title;
		if(target_obj.length > 0){
			title = $("#NewCloSto_Title").text();;
			$("#NewCloSto_Test_Email").prop("disabled",false);
			document.getElementById("NewCloSto_Test_Email").value = lg.get("IDS_TEST_CLOUDEMAIL");
		}
		target_obj = jQuery('#NormalCloSto_Test_Email');
		if(target_obj.length > 0){
			title = $("#NormalCloSto_Title").text();
			$("#NormalCloSto_Test_Email").prop("disabled",false);
			document.getElementById("NormalCloSto_Test_Email").value = lg.get("IDS_TEST_CLOUDEMAIL");
		}
		
		var err = findNode("ErrCode",xml);
		if(/*gDvr.hybirdDVRFlag==*/1){
			if(err == 0){
				if($.browser.safari){
					gDvr.openSafariByUrl(findNode("RetMsg",xml));
				}else{
					window.open(findNode("RetMsg",xml));
				}
				ShowPaop(title,lg.get("IDS_LINKSUCCESS"));//成功
			}else if(err == 1){
				ShowPaop(title,lg.get("IDS_CLOHAVE_ACTIVATED"));//已激活
			}else if(err == 3){
				ShowPaop(title,lg.get("IDS_ACTIVATE_TIMEOUT"));//激活超时
			}else if(err == 4){
				ShowPaop(title,lg.get("IDS_LINKFAIL"));//失败
			}
		}/*else{
			if(err == 0){
				if($.browser.safari){
					gDvr.openSafariByUrl(findNode("RetMsg",xml));
				}else{
					window.open(findNode("RetMsg",xml));
				}
				ShowPaop(title,lg.get("IDS_LINKSUCCESS"));
			}else if(err == -1){
				ShowPaop(title,lg.get("IDS_LINKFAIL"));
			}else if(err == -2){
				ShowPaop(title,lg.get("IDS_DROPBOX"));
			}else if(err == -101){
				ShowPaop(title,lg.get("IDS_LINK_CONTENT_FAIL"));
			}else if(err == -102){
				ShowPaop(title,lg.get("IDS_LINK_CONTECT_FAIL"));
			}else if(err == -103){
				ShowPaop(title,lg.get("IDS_LINK_SEND_FAIL"));
			}else if(err == -104){
				ShowPaop(title,lg.get("IDS_LINK_RECV_FAIL"));
			}else if(err == -3){
				ShowPaop(title,lg.get("IDS_SEND_FAILED"));
			}
		}*/
	}else if(type == 323){
		$("#FtpTest").prop("disabled",false);//启用按钮
		
		//ShowPaop($("#FTP_info").text(),findNode("RetMsg",xml));
		var RetVal_FTP =  findNode("RetVal",xml);
		if(RetVal_FTP == 0){  //写入文件成功
			ShowPaop($("#FTP_info").text(),lg.get("IDS_FTP_WRITE_SUC"));
		}else if(RetVal_FTP == 1){  //关闭Ftp服务失败
			ShowPaop($("#FTP_info").text(),lg.get("IDS_FTP_CLOSE_FAILED"));
		}else if(RetVal_FTP == 2){  //创建文件夹失败
			ShowPaop($("#FTP_info").text(),lg.get("IDS_FTP_CREATEFILE_FAILED"));
		}else if(RetVal_FTP == 3){  //写入文件失败
			ShowPaop($("#FTP_info").text(),lg.get("IDS_FTP_WRITEFILE_FAILED"));
		}else if(RetVal_FTP == 4){  //用户登录失败
			ShowPaop($("#FTP_info").text(),lg.get("IDS_FTP_USERLOGIN_FAILED"));
		}else if(RetVal_FTP == 5){  //连接Ftp失败
			ShowPaop($("#FTP_info").text(),lg.get("IDS_FTP_CONNECT_FAILED"));
		}else if(RetVal_FTP == 6){  //非法参数
			ShowPaop($("#FTP_info").text(),lg.get("IDS_FTP_ILLEGAL_PARAM"));
		}
	}else if(type == 327){
		var title = $("#NormalCloSto_Title").text();
		document.getElementById("CloudCheck").value = lg.get("IDS_CLOUD_CHECK");
		$("#CloudCheck").prop("disabled",false); 
		
		var err = findNode("RetVal",xml);
		if(err == 1){
			ShowPaop(title,lg.get("IDS_HDDS_NONE"));
		}else if(err == 2){
			ShowPaop(title,lg.get("IDS_CLOUD_STATE002"));
		}else if(err == -1){
			ShowPaop(title,lg.get("IDS_CLOUD_CHECK_TIMEOUT"));
		}
	}else if(type == 333){
		IPCAutoAddCallBack();
	}else if(type == 403){
		MasklayerHide();
		$("#DDNSGetID").prop("disabled",false)
		$("#DDNSServiceID").val(findNode("RetMsg",xml));
	}
}

//重连
function ReconnectPromptEvent(MsgID){
	//if(lgCls.version != "OWL")return;
	switch(MsgID){
		case 2:
			MasklayerShow();
			//$(".mcmcmain").css("right","2440px").css("height", "0%");
		    ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_WEBF_FALSE"));
			break;
		case 3: //网络断线
		   //在这里需要向设备查询IP地址跟媒体端口号有没有发生改变；
		   //如果发生了改变请调用SetIPAndPort函数，第一个参数传入媒体端口号
		   //第二个参数传入IP地址成功返回0，其他代表出错，错误值参考UserLogin
		   //的返回值  gDvr.SetIPAndPort(2040,"172.18.6.14");
		   //如果没有发生改变则不需要处理直接break;
		   /*if(gIDLogin && gIELogin) {
			   if(gTimerID == 0)
			   {
			   	gTimerID = setInterval(RequestID,1000);
			   }
		   }*/
			break;
		case 101: //登陆成功
		    gTimerID = 0;
			if(gReboot==1){
				$("#RebootTootipText").css("display","none");
				gReboot = 0;
			}
			var oldMacAddr = gDvr.nMacAddr;
			gDvr.AnalyLogRes(gDvr.RefreshDvrInfo());	//刷新设备信息
			//判断mac地址是否改变
			if(oldMacAddr != gDvr.nMacAddr){
				gDvr.PreViewFunCtrl(4, 0, gVar.nStreamType);
				gDvr.Motion("Motion", 2, 0);
				gDvr.Motion("Shelter", 2, 0);
				gDvr.Motion("ImgCtrl", 2, 0);
				gDvr.Motion("ChLive", 2, 0);
				gDvr.ChangeWndSize(6,0,0);
				ReconnectOtherDev();
				
				$("#devchange_prompt").css("display","block");
				$(gDvr.obj).css({"width":0, "height":0});
				MasklayerShow();
			}else{
				MasklayerHide();
				//if($(".cfgactive").attr("id") != "syspmuser"){
				//	$(".mcmcmain").css("right","244px").css("height", "auto");/*height-IE6兼容*/
				//}
			}
			break;
		case 102:
			ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_NO_USERNAME"));
			break ;
		case 103:
		case 104:
			if(gDvr.bAdmin == true){
				ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_ADMINCHANGED"));
			}else{
				ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_USERNAMECHANGED"));
			}
			break ;
		case 105: 
			MasklayerShow();
			ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_WEBF_FALSE"));
			break ;
		case 106:
		    ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_RIGHTCHANGED"));
			break;
		case 208:
			ShowPaop(lg.get("IDS_WARNING"),lg.get("IDS_STRVIDEO_USERFULL"));
			break;
		case -200:
			ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_CONNECTCLOSED"));
			break;
		case -201:
			ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_RIGHTCHANGED"));
			break;
		case -203:
			ShowPaop(lg.get("IDS_RECONNECT"),lg.get("IDS_CONNECTCLOSED"));
			break;
		case 306:
			ShowPaop(lg.get("IDS_WARNING"),lg.get("IDS_PREVIEW_MUTUAL"));
			break;
		case 308:
			ShowPaop(lg.get("IDS_WARNING"),lg.get("IDS_PREVIEW_NO_BANDWIDTH"));//设备带宽不足
			break;
	}
}

/////////////////////ljz//////////////////////////////
FtpIsUpdateCallBack = FtpIsUpdateEvent;
//////////////////////////////////////////////
function FtpIsUpdateEvent(lUpdate,OldVer,NewVer,DevType){
	//console.log("lUpdate:" + lUpdate);
	if(gVar.sPage == "config"){
		//var my_element = document.createElement("script");
		//my_element.setAttribute("type","text/javascript");
		//my_element.setAttribute("src","html/cfg/auto_upgrade.js");
		//document.body.appendChild(my_element);
		if(lUpdate*1 == 1){
			$("#UpgradeTip").prop("innerHTML","New firmware update is available ! Do you want to upgrade?");
			$("#UpgradeTip").css("display","block");
			$("#UpgradeBtn").css("display","block");
			$("#UpgradeBtnCancel").css("display","block");		
		}else if(lUpdate*1 == 2){
			$("#UpgradeTip").prop("innerHTML","Remote upgrading...");
			$("#UpgradeTip").css("display","block");
			$("#UpgradeBtn").css("display","none");
			$("#UpgradeBtnCancel").css("display","none");
		}else{
			$("#UpgradeTip").prop("innerHTML","The current version is the latest.");
			$("#UpgradeTip").css("display","block");
			$("#UpgradeBtn").css("display","none");
			$("#UpgradeBtnCancel").css("display","none");
		}
	}/*else{
		if(lUpdate*1 == 1){
			if(gDvr.showVersionFlag==1){
				//显示版本号
				ShowPaop("UPDATE", "The current device type is "+ DevType +"<br> \
				The current version is " + OldVer + "<br> \
				<div style='color:red'>Do you want to upgrade to version " + NewVer + " ?" + "</div>"+
				"<div style='text-align:center;margin:5px;margin-top:30px;'>"+
					"<input id='FTPUpgrading' onclick='showUpgradDialog()' color='#F00' type='button' value='Yes'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
					"<input id='UpgradeCancle' onclick='HideUpgradDialog()' color='#F00' type='button' value=' No '/>"+
				"</div>",864000000);
			}else{
				ShowPaop("UPDATE", "New firmware update is available !<br> \
				Do you want to upgrade?<br> \
				<div style='color:red'>Upgrade is required!</div>"+
				"<div style='text-align:center;margin:5px;margin-top:30px;'>"+
					"<input id='FTPUpgrading' onclick='showUpgradDialog()' color='#F00' type='button' value='Yes'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
					"<input id='UpgradeCancle' onclick='HideUpgradDialog()' color='#F00' type='button' value=' No '/>"+
				"</div>",864000000);
			}
		}else if(lUpdate*1 == 2){
			ShowPaop("UPDATE", "Remote upgrading...",864000000);
		}else if(lUpdate*1 == 5){
			//直接升级，不用用户点击Start按钮(网页的Start按钮、插件FTPUpdateDlg的Start按钮)
			setTimeout(function(){gDvr.FTPUpgrading(0)},100);
		}
	}*/
}

function showUpgradDialog(){
	$("#MsgPaop").css("display","none").attr("name","out");
	setTimeout(function(){gDvr.FTPUpgrading(0)},100);
}

function HideUpgradDialog(){
	HidePaop();
}

//用户权限可使用通道判断  leo
UserRightCallBack=UserRightCall;
function UserRightCall(cmID,strMsg){
	
	if(cmID == 8)
	{
		var vid= findNode("STATUS",strMsg);
		//ptz_pre_popedom=vid;
		if(vid=="1")
		{
			if(gDvr.DevType == 0 || gDvr.DevType == 1){
			$(".liveBtnBt8").css("display","block");}
			//$(".liveBtnBt3,.liveBtnBt4").css("display", "none");
		}
		else{
			$(".liveBtnBt8").css("display","none");
			//$(".liveBtnBt3,.liveBtnBt4").css("display", "block");
			if($(".liveBtnBt8").attr("name") != "off") { gDvr.PTZcontrol(98, $("#slider").attr("speed")|0, 0, 0, 0, 0);$(".liveBtnBt8").attr("name", "off")}
		}
	}
	else if(cmID==7){
		
		var vid= findNode("STATUS",strMsg);
		//ptz_pre_popedom=vid;
		/*if(vid=="1")
		{
			$(".liveBtnBt8").css("display","block");
		}
		else{
			$(".liveBtnBt8").css("display","none");
		}*/
		return;	
	}	 
}

function  menutitle(n){
	var arr=['LiveMenu','PlayBackMenu','ConfigMenu','PathMenu','LogoutMenu'];
	for(var i=0;i<5;i++){
		$("#"+arr[i]).css({"background":'#E0ECFF','color':'#0E2D5F','font-weight':'normal'});
	}	
	//$("#"+arr[n-1]).css("background-position-x","-135px").css('color','#000');
	$("#"+arr[n-1]).css({"background":'#fff','color':'#0E2D5F','font-weight':'bold'});
	
		
}

document.onkeydown = function(e){
	e = e || window.event;
	if(e.keyCode==9&&tabkey==0){
		e.keyCode=0;   
		e.returnValue=false;
		return false;
	}
}
//拖动条改变	
function cursor(flag){
	var $obj = "";
	
	ColorSetMax = 256;
	if(flag==2){
		ColorSetMax = 6;
	}
	
	var num = 128;//128格子
	ColorSetCube = ColorSetMax/num;//1个格子表示的数值
	
	var value = 0;
	var timeOut;
	this.val = function(){
		return 	value;
	}
	//set line number 
	this.num = function(i){
		num = i;
	}
	//create cube
	this.create = function(id){
		$obj = $("#"+id);
		if($obj.attr("create") == "down")
			return ;
		else
			$obj.attr("create","down");
			
		$obj.removeClass().addClass("cursorPar");
		$obj.empty();
		$obj.append("<em>10</em>");
		$obj.append("<ol></ol>")
		for(var i = 0; i<num; i++){
			$obj.children("ol").prepend("<li class='cursorCube' num='"+i+"'></li>");
		}
		// addlisten click
		var down =false;
		var thisClass = this;
		$obj.children("ol").children().each(function(i){
				var number = $(this).attr("num");
				$(this).mousedown(function(){
					down = true;
					var tempvalue = number/127*(ColorSetMax-1); 
					if(tempvalue < 0.5){//最大值为6时的点击精度问题
						value = 0;
					}else if(tempvalue > ColorSetMax - 1.5){
						value = ColorSetMax;
					}else{
						value = Math.ceil(number/127*(ColorSetMax-1));
					}
					thisClass.Default(value);
				}).mouseover(function(){
					if(down == true){
						var tempvalue = number/127*(ColorSetMax-1); 
						if(tempvalue < 0.5){//最大值为6时的点击精度问题
							value = 0;
						}else if(tempvalue > ColorSetMax - 1.5){
							value = ColorSetMax;
						}else{
							value = Math.ceil(number/127*(ColorSetMax-1));
						}
						thisClass.Default(value);
					}
				}).mouseup(function(){
					/*
					var xml = $obj.attr("flag") + "," + value;
					clearTimeout(timeOut);
					timeOut = setTimeout(function(){gDvr.GetAndSetVideoInfo("VideoSet", 1, xml);},10);
					down = false;
					return false;
					*/
				})
				$(document).mouseup(function(){
					if(down ==true){
						var xml = $obj.attr("flag") + "," + value;
						clearTimeout(timeOut);
						timeOut = setTimeout(function(){gDvr.GetAndSetVideoInfo("VideoSet", 1, xml);},10);
						down = false;
					}
				})
		})
	}
	// set default value
	this.Default = function(i){//选择的部分
		$obj.children("em").prop("innerHTML",i);
		i = parseInt((ColorSetMax-i*1)/ColorSetCube);
		$obj.children("ol").children().each(function(j){
			if(i <= j && $(this).attr("num") != 0)
				$(this).css("background","url(images/bar_cell.png)");//选择
			else{
				$(this).css("background","url(images/bar_bg.png)");//未选择
			}
		})
	}
}
	
function PlayCallBackMon(date, ym){
		
    var arr = ym.split("-");
	for(var i=0;i<32;i++){
		if(date*1>>i&1){
			var strMsg ="<CHffff>"+arr[0]+"-"+arr[1]+"-"+(i+1)+"</CHffff>";
			PlayBackCall(1,strMsg);
		}
    }
}
function ShowPreViewCap(str){
	if(str != "noplay"){
		str = str.split("\\").join("\\\\");
		ShowPaop(lg.get("IDS_IMAGE_SAVE_PATH"), str + "<div style='text-align:center;margin:5px;'><a color='#F00' href='javascript:gDvr.GetCapDir(\""+str+"\")'>Folder</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:gDvr.GetCapImage(\""+str+"\");'>Preview</a></div>");
	}
}

function AnalyzeIPAndPort(){
	$.ajax({
				type:'get',
				url:'http://'+gVar.ip+':'+gVar.port+'/cgi-bin/mediaport.cgi?'+gVar.nDate,
				async:true,
				timeout:20000,
				datatype:"xml",
				success:function(data){
					$("#loading").css("display","none");
					MasklayerHide();
					
					if ( (typeof data=='string')&&data.constructor==String){
						data = ("<xml>"+data+"</xml>");
					}
					$(data).find("Root").each(function(){
						gVar.mediaport = $(this).find("port").text();
					})
					$(data).find("Root").each(function(){
						gVar.nDevType = $(this).find("devtype").text()*1;
						switch(gVar.nDevType*1){
							case 0x9612:
							case 0x9613:
							case 0x9614:
							case 0x9616:
							case 0x9619:
								gDvr.bDevCif = true;
								break;
							default:
								gDvr.bDevCif = false;
								break;
						}
					})
					$(data).find("Root").each(function(){
						lgCls.version = $(this).find("custom").text();
					})
					$(data).find("Root").each(function(){
						lgCls.logo = $(this).find("logo").text();
					})
					
					$(data).find("Root").each(function(){
						lgCls.langues =  $(this).find("langstrs").text();
					})
					$(data).find("Root").each(function(){
						lgCls.defaultLg = $(this).find("curlang").text().split(" ")[0];
					})
					
					/*if(lgCls.version == "URMET")
						lgCls.version = "NORMAL";*/
					//lgCls.logo = "NORMAL";		
					
					InitOcx();
					LanguageCall(gVar.lg);
				},
				error:function(data, textstate){
					$("#loading").css("display","none");
					lgCls.version = "NORMAL";
					lgCls.logo = "NORMAL";
					lgCls.langues = "ENU"
					lgCls.defaultLg = "ENU";
					lgCls.prototype = 1;
					gVar.ip = "172.18.12.146";
					gVar.port = 9000;
					InitOcx();
					LanguageCall(gVar.lg);
					MasklayerHide();
				}
		});
}

function AnalyzeDevID(strID) {
		var getqueryinfo = '/queryinfo.php?DevID=' + strID+'&t='+gVar.nDate;
		//var getqueryinfo = gHttp+'/queryinfo.php?DevID=' + strID+'&t='+gVar.nDate;
			return $.ajax({
				type:'get',
				url:getqueryinfo,
				async:false,
				timeout:20000,
				datatype:"xml",
				success:function(data){
					$(data).find('response').each(function() {
						var get_remoteip = $(this).find('RemoteIP').text();
						var get_mediaport = $(this).find('MediaPort').text();
                        var get_webport = $(this).find('HttpPort').text();
						if (get_remoteip != "" && get_mediaport != "") {
							gVar.ip = get_remoteip;
							gVar.mediaport = get_mediaport;
							gVar.port = get_webport; 
							return true;	
						} 
						
						return false;
					});
				},
				error:function(data, textstate){
					alert(textstate);
					return false;
				}
			});
}

function RequestID() {
	 var temIP = gVar.ip;
	 var temPort = gVar.mediaport ;
	
	  if(AnalyzeDevID(gDevID))
	  {
		  if(temIP != gVar.ip || temPort != gVar.mediaport)
		      gDvr.SetIPAndPort(gVar.mediaport,gVar.ip);
			  
		 clearInterval(gTimerID);
	  }
}

function CheckPassword(){};
$(function(){
	$("#btn_reboot_ok").click(function(){
		var SuperPassword;
		if(lgCls.version == "SWANN"){
			SuperPassword = "479266";
		}else{
			SuperPassword = "519070";
		}
		if($("#reboot_input").val() == gVar.passwd || $("#reboot_input").val() == SuperPassword){
			MasklayerHide();
			$("#reboot_prompt").css("display","none");
			CheckPassword();
		}
		else{
			$("#reboot_title").children("em").prop("innerHTML",lg.get("IDS_REBOOT_ERR_PWD"));
		}
	})
		
	$("#btn_reboot_cancle").click(function(){
		MasklayerHide();
		$("#reboot_prompt").css("display","none");
	})
})

//获取元素纵坐标
function getTop(e){   
	var offset = e.offsetTop;   
	if(e.offsetParent != null) offset += getTop(e.offsetParent);   
	return offset;   
}

function getBottom(e){
	var bottom = ($(window).height()) - getTop(e) - e.offsetHeight + document.documentElement.scrollTop + 38;
	return bottom;
}   

//获取元素的横坐标   
function getLeft(e){   
	var offset = e.offsetLeft;   
	if(e.offsetParent != null) offset += getLeft(e.offsetParent);   
	return offset;   
}   

function ModifyCss(page){
	switch(page)
	{
		case "live":
			if(gDvr.DevType == 4){
				$(".mcmain").css({left:"0px"});
				$(".mcmain").css({right:"0px"});
				$(".mcleft").css("width","0px");
				$(".mcright").css("width","0px");
				$(".mcmcmain").css({width:($(".mcmain").width())+"px"});
			}
			
			$("#MsgPaop").css("display","none").attr("name","out");
			break;
		case "playback":
			if(gDvr.DevType == 4){
				$(".mcleft").css("width","214px");
				$(".mcmain").css({left:"214px"});
				$("#play_synch").css("display","none");
				$("#playBackChannal").css("display","none");
				$("#rss").css("margin","40px 0 0 20px");
			}
			$("#MsgPaop").css("display","none").attr("name","out");
			break;
			
		case "config":
			if(gDvr.DevType == 4){
				$(".mcleft").css("width","214px");
				$(".mcmain").css({left:"214px"});
				$("#Original").css("display","none");
			}
			break;
		case "configPage":
			if(gDvr.DevType == 4){
				$(".mcleft").css("width","214px");
				$(".mcmain").css({left:"214px"});	
				$("#Original").css("display","none");
			}
			break;
	}
}

function ToModifiPage(){
	$("#userlogin").css("display","none");
	$("#LoginInterface").css("display","none");
	$("#ModifiInterface").css("display","block");
	$("#usermodifi").css("display","block");
	$("#loginpic1").css("background-image","url(images/bgr_2.gif)");
	$("#loginpic2").css("background-image","url(images/bgCenter2.gif)");
	$("#loginpic3").css("background-image","url(images/bgr_2.gif)");
	
	$("#loginpic1").css("height",300);
	$("#loginpic2").css("height",300);	
	$("#loginpic3").css("height",300);
	$("#Web_false").css("margin-top","100px");
	$("#modifpasswd, #modifpasswd2").keydown(function(e){
			if (e.keyCode == 13){
				ModifyPwd();
			}
	});
}
/*
function updateIpcAbility(){
	if(gDvr.DevType == 3){
		 var data = JSON.parse(gDvr.GetIpcAbility());
		 if(data.length == 0)
		 	return;
		 IpcAbility = data;
	}
}*/

/*
function IpcOffline(chid){
	IpcAbility[chid].ProtocolType = 0;
	IpcAbility[chid].Abilities = 0;
	IpcAbility[chid].State = 3;
}
*/

function IpcAbilityDataByIndex(channelMask){
	for(var obj in IpcAbility){
		if(obj.channelMask == channelMask){
			return obj;
		}
	}
	return null;
}

function stateBtnCallBack(){};
function editBtnCallBack(){};
function addBtnCallBack(){};
function deleteBtnCallBack(){};

function devchangeclick(){
	window.location.reload(true);
};