// JavaScript Document
$(document).ready(function(){
	
	//初始操作 
	var sel = 1;
	var lastSel = 1;
	var recCh =0; //录像通道
	var preCh =0;//预览通道
	var backCh=0; //备份通道
	var ptzCh =0; //云台通道
	var ManualRecCh=0; //手动录像通道 
	var userSetRight=0;  //用户权限
	var recRight =0;// 录像权限
	var preRight = 0; //预览权限
	var backRight=0;  //备份权限
	var ptzRight=0;  //云台权限
	var passwordLen=8;
	var pwdTemp="";
	var pwd1 = new Array();
	var pwdUsed = 0;//密码是否使用
	var curPwd = "";//记录admin输入的当前密码
	if(/*lgCls.version == "URMET" || */lgCls.version == "ELKRON"){
		$(".USPassword,.USPassword2").attr("maxlength","8");
		passwordLen = 8;
	}
	/*
	if( gDvr.bAdmin == 1){//所有客户都显示原密码
		$("#USOldPassword_div").css("display","block");
	}else{
		$("#USOldPassword_div").css("display","none");
	}*/
	/*
	if(gDvr.KguardP2pUidFlag == 1 && lgCls.version == "KGUARD"){
		$("#USPwsEnable").prop("disabled",true);	
	}
	*/
	if(gDvr.PtzHiddenFlag == 1){
		$("#user_ptz").css("display","none");
		$("#User_Seq_show").css("display","none");
	}
	//var ManualRecRight=0; //手动录像权限
	var color = "rgb(0, 102, 0)";
	if(lgCls.version == "LOREX"){
		color = "rgb(25, 135, 222)";
	}else if(lgCls.version == "KGUARD"){
		//color = "rgb(72, 155, 185)";
	}else if(lgCls.version == "FLIR"){
		color = "rgb(142, 12, 58)";
	}
	if(lgCls.UIversion == 1){
		color = "rgb(18, 112, 255)";
	}
	
	if(gDvr.DevType == 3){
		$("#User_Ptz_show").css("display","none");
		$("#User_PtzCH_show").css("display","none");
		$("#User_Seq_show").css("display","none");
	}else if(gDvr.DevType == 4){
		$("#User_Ptz_show").css("display","none");
		$("#User_PtzCH_show").css("display","none");
		$("#User_Seq_show").css("display","none");
		$("#User_Log_show").css("display","none");
		$("#User_Wh_show").css("display","none");
		$("#User_Login_show").css("display","none");
	}
	
	if(gDvr.PtzHiddenFlag == 1){
		$("#user_ptz").css("display","none");
		$("#User_Seq_show").css("display","none");
	}	       
	
	var threeUsers = false;
	if(lgCls.version=="RCI"){
		threeUsers = true;
		$("#USPwsEnable").prop("disabled",true);
		$("#USUserName").prop("readonly","true");//不允许修改user name
	}
	
	$(function(){
		if ($.browser.msie && $.browser.version.indexOf("9") == -1) color = color.replace(/\s/g, "");
		if(gDvr.nChannel<=16){
			if(gDvr.hybirdDVRFlag==1){
				//
			}else{
				$("#BackupChannelDiv").css("margin-top","30px");
				$("#PreviewChannelDiv").css("margin-top","30px");
				$("#PlayBackChannelDiv").css("margin-top","30px");
				$("#PtzControlChannelDiv").css("margin-top","30px");
			}
		}
		$("#BackupChannelDiv").divBox({number:gDvr.nChannel,bkColor:color});
		$("#PreviewChannelDiv").divBox({number:gDvr.nChannel,bkColor:color});
		$("#PlayBackChannelDiv").divBox({number:gDvr.nChannel,bkColor:color});
		$("#PtzControlChannelDiv").divBox({number:gDvr.nChannel,bkColor:color});
		
		if(gDvr.bAdmin == true){//是管理员
			$(".syspm_user_specialty_R").css("display","block");//右上角5行
			$(".onlytop").css("display","block");//上下部分间的空行
			$("#USUsSV").css("display","block");//保存按钮
			$(".syspm_user_specialty").css("width","399px");//左边的行宽
			$(".syspm_use_range_1").css("width","50px");//NO.的宽
			$(".syspm_use_range_2").css("width","110px");//UserName的宽
			$(".syspm_use_range_3").css("width","100px");//Password的宽
			$(".syspm_use_range_4").css("width","100px");//Active的宽
		}else{//普通用户
			if(/*lgCls.version == "URMET" || */lgCls.version == "ELKRON"){
				$(".syspm_user_specialty_R").css("display","block");//右上角5行
				$(".onlytop").css("display","block");//上下部分间的空行
				$("#USUsSV").css("display","block");//保存按钮
				$(".syspm_user_specialty").css("width","399px");//左边的行宽
				$(".syspm_use_range_1").css("width","50px");//NO.的宽
				$(".syspm_use_range_2").css("width","110px");//UserName的宽
				$(".syspm_use_range_3").css("width","100px");//Password的宽
				$(".syspm_use_range_4").css("width","100px");//Active的宽
				$(".syspm_user_specialty_R").find("select").prop("disabled",true);
				$(".syspm_user_specialty_R").children().prop("disabled",true);
				$(".syspm_user_specialty_R").fadeTo("slow", 0.2);
			}else{
				$(".syspm_user_specialty_R").css("display","block");//右上角5行
				$(".onlytop").css("display","block");//上下部分间的空行
				$("#USUsSV").css("display","block");//保存按钮
				$(".syspm_user_specialty").css("width","399px");//左边的行宽  
				$(".syspm_use_range_1").css("width","50px");//NO.的宽
				$(".syspm_use_range_2").css("width","110px");//UserName的宽
				$(".syspm_use_range_3").css("width","110px");//Password的宽
				$(".syspm_use_range_4").css("width","100px");//Active的宽
			}
		}
			
		RfParamCall(Call, $("#user_info").text(), "SysUser", 100, "Get");	//初始时获取页面数据 
	})
	
	//7行(admin、user1-user6)
	$("div[id^='SUS_item_']").mouseover(function(){
		$(".UserList").removeClass("UserList");
		$(this).css("cursor", "pointer");
		$(this).addClass("UserList");	
	}).mouseout(function(){
		if ($(this).attr("name") == "active"){
			$(".UserList").removeClass("UserList");
		}
		$(this).removeClass("UserList")
		
		//普通用户时，只有自己一行 //7行(admin、user1-user6)，mouseout时的css
		if(gDvr.bAdmin != true){
			if(lgCls.UIversion == 1){
				$(".UserList6").removeClass("UserList6");
				//$(this).addClass("UserList6");
			}else{
				if(lgCls.version == "LOREX"){
					$(".UserList3").removeClass("UserList3");
				}else if(0/*lgCls.version == "KGUARD"*/){
					$(".UserList4").removeClass("UserList4");
				}else if(lgCls.version == "FLIR"){
					$(".UserList5").removeClass("UserList5");
				}else{
					$(".UserList2").removeClass("UserList2");
				}
			}
		}
	}).click(function(){
		if(threeUsers){
			var nLine = $(this).attr("id").split("SUS_item_")[1]*1;//选择第几行
			if(nLine>3)return;
		}
		if($("#USUserName").val()==""){
			ShowPaop($("#user_info").text(), lg.get("IDS_NO_USERNAME"));//用户名不能为空
		    $("#USUserName").focus().select();
			return;
		}	
		for(var i=1;i<=7;i++){
			if(i!=sel){
				if($("#USUserName").val()==$("#SUS_item_"+i).attr("UserName")){
					ShowPaop($("#user_info").text(), lg.get("IDS_USERNAME_USE"));//用户名已被使用
					$("#USUserName").focus().select();	
					return;
				}
			}
		}
		
			
		if($("#USPwsEnable").prop("value")=="1" && lgCls.version!="LEGRAND")//启用密码时
		{
			if($(".USPassword").prop("value")=="" || $(".USPassword2").prop("value")==""){
				ShowPaop($("#user_info").text(), lg.get("IDS_NO_PASSWORD"));//密码不能为空
				 $(".USPassword").focus().select();
				return;
			}else if($(".USPassword").prop("value").length<passwordLen || $(".USPassword2").prop("value").length<passwordLen){
				ShowPaop($("#user_info").text(), lg.get("IDS_CHECKPW_TOOLONG"));//密码长度不足
				$(".USPassword").focus().select();
				return;
			}else if($(".USPassword").prop("value")!=$(".USPassword2").prop("value")){
				ShowPaop($("#user_info").text(), lg.get("IDS_PSW_DIFFRENT"));//密码不一致
				$(".USPassword").focus().select();
				return;
			}
		}
		
		lastSel = sel;
		//如果点击的是第1行，admin
		if($(this).attr("id")=="SUS_item_1"){
			if((/*lgCls.version == "URMET" || */lgCls.version == "ELKRON") && gDvr.bAdmin != true){//不是管理员
				$(".syspm_user_specialty_R").find("select").prop("disabled",true);
				$(".syspm_user_specialty_R").children().prop("disabled",true);
				$(".syspm_user_specialty_R").fadeTo("slow", 0.2);	
			}
			/*
			if(gDvr.KguardP2pUidFlag == 1 && lgCls.version == "KGUARD"){
				$("#USPwsEnable").prop("disabled",true);	
			}
			*/
			if(threeUsers){
				$("#USPwsEnable").prop("disabled",true);//admin不给关掉密码
				$("#USUserName").prop("readonly","true");//不允许修改user name
			}
			if(gDvr.bAdmin){
				if(curPwd != "" && sel != 1){
					$(".USOldPassword").val(curPwd);
				}
				if(sel == 1){
					curPwd = $(".USOldPassword").val();
				}
			}
			$("input[id^='USERLIM_']").prop("disabled",true);
			$("#USused").prop("disabled",true);
			$("#user_info_divdisplay").css("display","none");
		}else{//点击的是user1--user6,这6行
			/*
			if(gDvr.KguardP2pUidFlag == 1 && lgCls.version == "KGUARD"){
				$("#USPwsEnable").prop("disabled",false);	
			}
			*/
			if(threeUsers){
				$("#USPwsEnable").prop("disabled",false);//client可以关掉密码
				$("#USUserName").prop("readonly","true");//不允许修改user name
			}
			$("input[id^='USERLIM_']").prop("disabled",false);
			if(gDvr.bAdmin == true){//是管理员
				if(lastSel == 1){
					curPwd = $(".USOldPassword").val();
					$(".USOldPassword").val("");
				}
				$("#user_info_divdisplay").css("display","block");
				if(threeUsers){
					$("#USused").prop("disabled",true);
				}else{
					$("#USused").prop("disabled",false);
				}
			}else{//普通用户
				if(/*lgCls.version == "URMET" || */lgCls.version == "ELKRON"){
					if(gVar.user != $(this).attr("UserName")){
						$(".syspm_user_specialty_R").find("select").prop("disabled",true);
						$(".syspm_user_specialty_R").children().prop("disabled",true);
						$(".syspm_user_specialty_R").fadeTo("slow", 0.2);
					}else{
						$(".syspm_user_specialty_R").find("select").prop("disabled",false);
						$(".syspm_user_specialty_R").fadeTo("slow", 1,function(){
							//兼容safari处理
							$(".syspm_user_specialty_R").css("filter","");
						});
						$(".syspm_user_specialty_R").children().prop("disabled",false);
						$("#USUserName").prop("disabled",false);
						$(".USPassword").prop("disabled",false);
						$(".USPassword2").prop("disabled",false);
						$(".USOldPassword").prop("disabled",false);
						$("#USPwsEnable").prop("disabled",false);
						$("#USused").prop("disabled",true);
					}
						
				}
				$("#user_info_divdisplay").css("display","none");
			}
			if(/*lgCls.version != "URMET" || */lgCls.version == "ELKRON"){
				$("#USused").prop("disabled",false);	
			}
		}
		
		//7行(admin、user1-user6)，click时的css
		if(lgCls.UIversion == 1){
			$(".UserList6").removeClass("UserList6");
			//this:当前行
			$(this).attr("name", "active");
			$(this).addClass("UserList6");
		}else{
			if(lgCls.version == "LOREX"){
				$(".UserList3").removeClass("UserList3");
				$(this).attr("name", "active");
				$(this).addClass("UserList3");
			}else if(0/*lgCls.version == "KGUARD"*/){
				$(".UserList4").removeClass("UserList4");
				$(this).attr("name", "active");
				$(this).addClass("UserList4");
			}else if(lgCls.version == "FLIR"){
				$(".UserList5").removeClass("UserList5");
				$(this).attr("name", "active");
				$(this).addClass("UserList5");
			}else{
				$(".UserList2").removeClass("UserList2");
				//this:当前行
				$(this).attr("name", "active");
				$(this).addClass("UserList2");
			}
		}
		
		CHSaveSel();//存放数据在attr属性里(右上角5个、下面9个)
		
		//使用attr里的数据，进行赋值操作(右上角5个)
		sel = $(this).attr("id").split("SUS_item_")[1]*1;//sel 为选择第几行
		$("#USUserName").val($("#SUS_item_"+sel).attr("UserName"));
		$(".USPassword").val($("#SUS_item_"+sel).attr("Password"));//密码赋值
		$(".USPassword2").val($("#SUS_item_"+sel).attr("Password2"));
		$("#USused").val($("#SUS_item_"+sel).attr("HaveUser"));
		$("#USPwsEnable").val($("#SUS_item_"+sel).attr("HaveSwitch"));
		if($("#USPwsEnable").val()==0){
			$(".USPassword").prop("disabled",true);//禁用
			$(".USPassword2").prop("disabled",true);
		}else{
			$(".USPassword").prop("disabled",false);//启用
			$(".USPassword2").prop("disabled",false);
		}
		if(gDvr.bAdmin == true && sel != 1){//管理员去管理普通用户时，不需要输入密码，变灰掉
			$(".USOldPassword").prop("disabled",true);
		}else{
			$(".USOldPassword").prop("disabled",false);
		}
		
		//attr属性里的数据，保存到变量里
		userSetRight = $("#SUS_item_"+sel).attr("UserSetRight");
		preCh  = $("#SUS_item_"+sel).attr("PreviewChannel");
		recCh  = $("#SUS_item_"+sel).attr("PlayBackChannel");
		backCh = $("#SUS_item_"+sel).attr("BackupChannel");
		ptzCh  = $("#SUS_item_"+sel).attr("PtzControlChannel");
		preRight  = $("#SUS_item_"+sel).attr("UserPreview");
		recRight  = $("#SUS_item_"+sel).attr("UserPlayBack");
		backRight = $("#SUS_item_"+sel).attr("UserBackup");
		ptzRight = $("#SUS_item_"+sel).attr("UserPtzControl");
		GetAndSetQXValue(1);//设置权限值，使用变量
		$("#USused").change();
	});
	
	//存放数据在attr属性里(右上角5个、下面9个)
	function CHSaveSel(){
		//输入数据 --> 赋值显示
		$("#SUS_item"+sel+"_2").prop("innerText", $("#USUserName").val());
		$("#SUS_item"+sel+"_3").prop("innerText", $("#USPwsEnable").val()*1 == 0 ? lg.get("IDS_DISABLE"):lg.get("IDS_ENABLE"));
		$("#SUS_item"+sel+"_4").prop("innerText", $("#USused").val()*1 == 0 ? lg.get("IDS_DISABLE"):lg.get("IDS_ENABLE"));
		
		//(右上角5个)存放数据在attr属性里
		$("#SUS_item_"+sel).attr("UserName", $("#USUserName").val());
		$("#SUS_item_"+sel).attr("Password", $(".USPassword").val());
		$("#SUS_item_"+sel).attr("Password2", $(".USPassword2").val());
		$("#SUS_item_"+sel).attr("HaveSwitch", $("#USPwsEnable").val()*1);
		$("#SUS_item_"+sel).attr("HaveUser", $("#USused").val()*1);

		GetAndSetQXValue(0);//(下面9+3个)获取权限值，然后
		//存放数据在attr属性里(9+3个)
		$("#SUS_item_"+sel).attr("UserSetRight", userSetRight);
		$("#SUS_item_"+sel).attr("PreviewChannel", preCh);
		$("#SUS_item_"+sel).attr("PlayBackChannel", recCh);
		$("#SUS_item_"+sel).attr("BackupChannel", backCh);
		$("#SUS_item_"+sel).attr("PtzControlChannel", ptzCh);
		$("#SUS_item_"+sel).attr("UserPreview", preRight);
		$("#SUS_item_"+sel).attr("UserPlayBack", recRight);
		$("#SUS_item_"+sel).attr("UserBackup", backRight);
		$("#SUS_item_"+sel).attr("UserPtzControl", ptzRight);
	}
	
	//Active是否激活用户
	$("#USused").change(function(){
		if(sel == 1)
			return;
		if ($(this).val()*1 == 1){//下面变亮
			$(this).prop("checked", 1);
			DivBox("#USused", "#user_info_divdisplay")
		}else{//下面变灰
			$(this).prop("checked", 0);
			DivBox("#USused", "#user_info_divdisplay")
		}
	})
	
	//是否启用密码
	$("#USPwsEnable").change(function(){
		if($("#USPwsEnable").val()==0){//Enable --> Disable	
			//普通用户时，如果有密码，需要输入原密码
			//管理员用户时，如果自己有密码，也要输入原密码(管理普通用户，都不用密码)
			/*
			if( (gDvr.bAdmin != true && $("#SUS_item_"+sel).attr("Password") != "")
				|| (gDvr.bAdmin == true && $("#SUS_item_"+sel).attr("Password") != "" && sel == 1) 
			){
				if($(".USOldPassword").prop("value")==""){
					ShowPaop($("#user_info").text(), lg.get("IDS_NO_OLDPSW"));
					$(".USOldPassword").focus().select();
					$("#USPwsEnable").val(1);
					return;
				}else if($(".USOldPassword").prop("value") != ($("#SUS_item_"+sel).attr("Password"))){
					ShowPaop($("#user_info").text(), lg.get("IDS_OLDPSWERR"));
					$(".USOldPassword").focus().select();
					$("#USPwsEnable").val(1);
					return;
				}else{//原密码正确

				}
			}
			*/

			$(".USPassword").prop("disabled",true);
			$(".USPassword2").prop("disabled",true)
		}else{//Disable --> Enable
			//普通用户时，如果有密码，需要输入原密码
			//管理员用户时，如果自己有密码，也要输入原密码(管理普通用户，都不用密码)
			/*
			if( (gDvr.bAdmin != true && $("#SUS_item_"+sel).attr("Password") != "")
				|| (gDvr.bAdmin == true && $("#SUS_item_"+sel).attr("Password") != "" && sel == 1) 
			){
				if($(".USPassword").prop("value")==""){
					ShowPaop($(".USOldPassword").text(), lg.get("IDS_NO_OLDPSW"));
					$(".USOldPassword").focus().select();
					$("#USPwsEnable").val(0);
					return;
				}else if($(".USOldPassword").prop("value") != ($("#SUS_item_"+sel).attr("Password"))){
					ShowPaop($(".USOldPassword").text(), lg.get("IDS_OLDPSWERR"));
					$(".USOldPassword").focus().select();
					$("#USPwsEnable").val(0);
					return;
				}else{//原密码正确
					
				}
			}
			*/
			$(".USPassword").prop("disabled",false);
			$(".USPassword2").prop("disabled",false);
		}
		//$("#USPwsEnable").val($("#USPwsEnable").val() ^ 1);
	});
	
	function Call(xml){
			$(".USOldPassword").val("");
			curPwd = "";
			var str="";
			var HaveUser = 0;
			var HaveSwitch = 0;
			var n = 7;
			if(threeUsers){
				n=3
			}
			//PaopSuccess("AlarmMotion", lg.get("IDS_REFRESH_SUCCESS"));
			for (var i=0; i<n; i++){
				HaveUser =  findChildNode(i+"Struct", "HaveUser", xml);//是否启用用户
				HaveSwitch = findChildNode(i+"Struct", "HaveSwitch", xml)*1;//登录是，是否需要密码
				
				//对左边的UserName、Password、Active，进行赋值显示
				$("#SUS_item"+(i+1)+"_2").prop("innerText", findChildNode(i+"Struct", "UserName", xml));
				$("#SUS_item"+(i+1)+"_3").prop("innerText", HaveSwitch == 0 ? lg.get("IDS_DISABLE"):lg.get("IDS_ENABLE"));
				$("#SUS_item"+(i+1)+"_4").prop("innerText", HaveUser == 0 ? lg.get("IDS_DISABLE"):lg.get("IDS_ENABLE"));
				//$("#SUS_item"+(i+1)+"_3").prop("innerText", HaveSwitch);
				//$("#SUS_item"+(i+1)+"_4").prop("innerText", HaveUser);
				
				if(gDvr.c32PasswordFlag == 1){
					pwd1[i] = findChildNode(i+"Struct", "c32Password", xml);
					pwdTemp = "";					
				}else{
					pwd1[i] = findChildNode(i+"Struct", "Password", xml);
					pwdTemp = "";
				}
						
				//存放数据在attr属性里(右上角5个、下面9+3个)
				$("#SUS_item_"+(i+1)).attr("UserName", $("#SUS_item"+(i+1)+"_2").prop("innerText"))
									.attr("Password", pwd1[i])
									.attr("Password2", pwd1[i])
									.attr("HaveSwitch", HaveSwitch)
									.attr("HaveUser",HaveUser)
									.attr("UserStatus", $("#SUS_item"+(i+1)+"_3").prop("innerText"))
									.attr("UserSetRight", findChildNode(i+"Struct", "UserSetRight", xml))
									.attr("PreviewChannel", findChildNode(i+"Struct", "PreviewChannel", xml))
									.attr("PlayBackChannel", findChildNode(i+"Struct", "PlayBackChannel", xml))
									.attr("BackupChannel", findChildNode(i+"Struct", "BackupChannel", xml))
									.attr("PtzControlChannel", findChildNode(i+"Struct", "PtzControlChannel", xml))
									.attr("UserPreview", findChildNode(i+"Struct", "UserPreview", xml))
									.attr("UserPlayBack", findChildNode(i+"Struct", "UserPlayBack", xml))
									.attr("UserBackup", findChildNode(i+"Struct", "UserBackup", xml))
									.attr("UserPtzControl", findChildNode(i+"Struct", "UserPtzControl", xml));
				if(gVar.user == findChildNode(i+"Struct", "UserName", xml)){
					pwdUsed = HaveSwitch;
				}
			}
			
			
			if(gDvr.bAdmin == true){//管理员用户
				
				for(var i=1; i<=n; i++){
					$("#SUS_item_"+i).css("display","block");
				}
				sel = 1;//选择第一行
			}else{//普通用户
				
				for(var i=1; i<=n; i++){
					if(gVar.user == ($("#SUS_item_"+i).attr("UserName"))){
						$("#SUS_item_"+i).css("display","block");
						sel = i;//sel为选择第i行
					}
				}
				$("#SUS_item"+sel+"_1").prop("innerText", "1");
				
				//css效果
				$(".onlytop").css("border","none");
				$(".syspm_user_specialty_R").css("border","1px solid #FFF");
			}
			//获取到数据之后，再显示
			//显示用户
			/*
			*/
			
			//使用第sel行数据，为右上角5行赋值
			$("#USUserName").val($("#SUS_item_"+sel).attr("UserName"));
			$(".USPassword").val($("#SUS_item_"+sel).attr("Password"));
			$(".USPassword2").val($("#SUS_item_"+sel).attr("Password2"));
			$("#USused").val($("#SUS_item_"+sel).attr("HaveUser"));
			$("#USPwsEnable").val($("#SUS_item_"+sel).attr("HaveSwitch"));
			if($("#USPwsEnable").val() == 0){
				$(".USPassword").prop("disabled",true);
				$(".USPassword2").prop("disabled",true);
				$(".USOldPassword").prop("disabled",false);
			}else{
				$(".USPassword").prop("disabled",false);
				$(".USPassword2").prop("disabled",false);
				$(".USOldPassword").prop("disabled",false);
			}
			
			//保存attr属性到变量里(下面9+3个)
			userSetRight = $("#SUS_item_"+sel).attr("UserSetRight");
			preCh  = $("#SUS_item_"+sel).attr("PreviewChannel");
			recCh  = $("#SUS_item_"+sel).attr("PlayBackChannel");
			backCh = $("#SUS_item_"+sel).attr("BackupChannel");
			ptzCh  = $("#SUS_item_"+sel).attr("PtzControlChannel");
			preRight  = $("#SUS_item_"+sel).attr("UserPreview");
			recRight  = $("#SUS_item_"+sel).attr("UserPlayBack");
			backRight = $("#SUS_item_"+sel).attr("UserBackup");
			ptzRight = $("#SUS_item_"+sel).attr("UserPtzControl");
			GetAndSetQXValue(1);//设置权限值，使用变量
			
			//css效果
			if(lgCls.UIversion == 1){
				$(".UserList6").removeClass("UserList6");
				$("#SUS_item_1").addClass("UserList6");
			}else{
				if(lgCls.version == "LOREX"){
					$(".UserList3").removeClass("UserList3");
					$("#SUS_item_1").addClass("UserList3");
				}else if(0/*lgCls.version == "KGUARD"*/){
					$(".UserList4").removeClass("UserList4");
					$("#SUS_item_1").addClass("UserList4");
				}else if(lgCls.version == "FLIR"){
					$(".UserList5").removeClass("UserList5");
					$("#SUS_item_1").addClass("UserList5");
				}else{
					$(".UserList2").removeClass("UserList2");
					$("#SUS_item_1").addClass("UserList2");
				}
			}
			
			//默认不让admin改变checkbox信息
			$("input[id^='USERLIM_']").prop("disabled",true);
			$("#user_info_divdisplay").css("display","none");
			$("#USused").prop("disabled",true);	
	}
	
	$("#USUsSV").click(function(){
		if($("#USUserName").val()==""){
			ShowPaop($("#user_info").text(), lg.get("IDS_NO_USERNAME"));//用户名不能为空
			$("#USUserName").focus().select();		
			return;
		}
		
		for(var i=1;i<=7;i++){
			if(i!=sel){
				if($("#USUserName").val()==$("#SUS_item_"+i).attr("UserName")){
					ShowPaop($("#user_info").text(), lg.get("IDS_USERNAME_USE"));//用户名已被使用
					$("#USUserName").focus().select();		
					return;
				}
			}
		}
		
		CHSaveSel();//存放数据在attr属性里(右上角5个、下面9+3个)
		
		if($("#USPwsEnable").prop("value")=="1" && lgCls.version!="LEGRAND")
		{
			if($(".USPassword").prop("value")=="" || $(".USPassword2").prop("value")==""){
				ShowPaop($("#user_info").text(), lg.get("IDS_NO_PASSWORD"));//密码不能为空
				$(".USPassword").focus().select();
			}else if($(".USPassword").prop("value").length<passwordLen || $(".USPassword2").prop("value").length<passwordLen){
				ShowPaop($("#user_info").text(), lg.get("IDS_CHECKPW_TOOLONG"));//密码长度不足
				$(".USPassword").focus().select();
			}else if($(".USPassword").prop("value")!=$(".USPassword2").prop("value")){
				ShowPaop($("#user_info").text(), lg.get("IDS_PSW_DIFFRENT"));//密码不一致
				$(".USPassword").focus().select();
			}else{
				var tempCurPwd = "";
				if(gDvr.bAdmin == 1 && sel != 1){
					tempCurPwd = curPwd;
				}else{
					tempCurPwd = $(".USOldPassword").prop("value");
				}
				var tempPwd = "";
				var tempPwdUsed = 0;
				if(gDvr.bAdmin == 1){
					tempPwd = $("#SUS_item_1").attr("Password");
					tempPwdUsed = $("#SUS_item_1").attr("HaveSwitch");
				}else{
					tempPwd = $(".USPassword").prop("value");
					tempPwdUsed = $("#USPwsEnable").val()*1;
				}
				if(((tempPwd!= gVar.passwd) || (tempPwdUsed != pwdUsed)) && tempCurPwd!= gVar.passwd){
					if(tempCurPwd==""){
						ShowPaop($(".USOldPassword").text(), lg.get("IDS_NO_OLDPSW"))
					}else if(tempCurPwd != gVar.passwd){
						ShowPaop($(".USOldPassword").text(), lg.get("IDS_OLDPSWERR"))
					}
					if(gDvr.bAdmin == 1){
						$("#SUS_item_1").click();
					}
					$(".USOldPassword").focus().select();
					return;
				}
				//MasklayerShow();
				$("#SUS_item_"+sel).click();
				var xml = "<a>";
				for(var i=0; i<8; i++){
					xml += "<Struct"+i+">"
					xml += ("<UserName>"+$("#SUS_item_"+(i+1)).attr("UserName")+"</UserName>");
					if(gDvr.c32PasswordFlag == 1){
						xml += ("<Password>"+pwdTemp+"</Password>");
						xml += ("<Password2>"+pwdTemp+"</Password2>");
						if($("#SUS_item_"+(i+1)).attr("HaveSwitch")==0){
							xml += ("<c32Password>"+pwd1[i]+"</c32Password>");
							xml += ("<c32Password2>"+pwd1[i]+"</c32Password2>");	
						}else{
							xml += ("<c32Password>"+$("#SUS_item_"+(i+1)).attr("Password")+"</c32Password>");
							xml += ("<c32Password2>"+$("#SUS_item_"+(i+1)).attr("Password2")+"</c32Password2>");	
						}
					}else{
						if($("#SUS_item_"+(i+1)).attr("HaveSwitch")==0){
							xml += ("<Password>"+pwd1[i]+"</Password>");
							xml += ("<Password2>"+pwd1[i]+"</Password2>");
						}else{
							xml += ("<Password>"+$("#SUS_item_"+(i+1)).attr("Password")+"</Password>");
							xml += ("<Password2>"+$("#SUS_item_"+(i+1)).attr("Password2")+"</Password2>");
						}
						xml += ("<c32PasswordFlag>"+pwdTemp+"</Password>");
						xml += ("<c32PasswordFlag>"+pwdTemp+"</Password2>");
					}
					xml += ("<HaveSwitch>"+$("#SUS_item_"+(i+1)).attr("HaveSwitch")+"</HaveSwitch>");
					xml += ("<HaveUser>"+$("#SUS_item_"+(i+1)).attr("HaveUser")+"</HaveUser>");
					//xml += ("<au8UserRights>"+$("#SUS_item_"+(i+1)).attr("au8UserRights").toLowerCase()+"</au8UserRights>");
					xml += ("<UserSetRight>"+$("#SUS_item_"+(i+1)).attr("UserSetRight")+"</UserSetRight>");
					xml += ("<PreviewChannel>"+$("#SUS_item_"+(i+1)).attr("PreviewChannel")+"</PreviewChannel>");
					xml += ("<PlayBackChannel>"+$("#SUS_item_"+(i+1)).attr("PlayBackChannel")+"</PlayBackChannel>");
					xml += ("<BackupChannel>"+$("#SUS_item_"+(i+1)).attr("BackupChannel")+"</BackupChannel>");
					xml += ("<PtzControlChannel>"+$("#SUS_item_"+(i+1)).attr("PtzControlChannel")+"</PtzControlChannel>");
					xml += ("<UserPreview>"+$("#SUS_item_"+(i+1)).attr("UserPreview")+"</UserPreview>");
					xml += ("<UserPlayBack>"+$("#SUS_item_"+(i+1)).attr("UserPlayBack")+"</UserPlayBack>");
					xml += ("<UserBackup>"+$("#SUS_item_"+(i+1)).attr("UserBackup")+"</UserBackup>");
					xml += ("<UserPtzControl>"+$("#SUS_item_"+(i+1)).attr("UserPtzControl")+"</UserPtzControl>");
					xml += "</Struct"+i+">"
				}
				xml += "</a>"
				RfParamCall(Call, $("#user_info").text(), "SysUser", 300, "Set", xml);	//初始时获取页面数据 	
			}
		}else{
			//MasklayerShow();
			if(lgCls.version=="LEGRAND"){
				if($(".USPassword").prop("value")!=$(".USPassword2").prop("value")){
					ShowPaop($("#user_info").text(), lg.get("IDS_PSW_DIFFRENT"));//密码不一致
					$(".USPassword").focus().select();
					return;
				}
			}
			var tempCurPwd = "";
			if(gDvr.bAdmin == 1 && sel != 1){
				tempCurPwd = curPwd;
			}else{
				tempCurPwd = $(".USOldPassword").prop("value");
			}
			var tempPwd = "";
			var tempPwdUsed = 0;
			if(gDvr.bAdmin == 1){
				tempPwd = $("#SUS_item_1").attr("Password");
				tempPwdUsed = $("#SUS_item_1").attr("HaveSwitch");
			}else{
				tempPwd = $(".USPassword").prop("value");
				tempPwdUsed = $("#USPwsEnable").val()*1;
			}
			if(((tempPwd!= gVar.passwd) || (tempPwdUsed != pwdUsed)) && tempCurPwd!= gVar.passwd){
				if(tempCurPwd==""){
					ShowPaop($(".USOldPassword").text(), lg.get("IDS_NO_OLDPSW"));
				}else if(tempCurPwd != gVar.passwd){
					ShowPaop($(".USOldPassword").text(), lg.get("IDS_OLDPSWERR"));
				}
				if(gDvr.bAdmin == 1){
					$("#SUS_item_1").click();
				}
				$(".USOldPassword").focus().select();
				return;
			}
			$("#SUS_item_"+sel).click();
			var xml = "<a>";
			for(var i=0; i<8; i++){
				xml += "<Struct"+i+">"
				xml += ("<UserName>"+$("#SUS_item_"+(i+1)).attr("UserName")+"</UserName>");
				if(gDvr.c32PasswordFlag == 1){
					xml += ("<Password>"+pwdTemp+"</Password>");
					xml += ("<Password2>"+pwdTemp+"</Password2>");
					if($("#SUS_item_"+(i+1)).attr("HaveSwitch")==0){
						xml += ("<c32Password>"+pwd1[i]+"</c32Password>");
						xml += ("<c32Password2>"+pwd1[i]+"</c32Password2>");
					}else{
						xml += ("<c32Password>"+$("#SUS_item_"+(i+1)).attr("Password")+"</c32Password>");
						xml += ("<c32Password2>"+$("#SUS_item_"+(i+1)).attr("Password2")+"</c32Password2>");	
					}
				}else{
					if($("#SUS_item_"+(i+1)).attr("HaveSwitch")==0){
						xml += ("<Password>"+pwd1[i]+"</Password>");
						xml += ("<Password2>"+pwd1[i]+"</Password2>");
					}else{
						xml += ("<Password>"+$("#SUS_item_"+(i+1)).attr("Password")+"</Password>");
						xml += ("<Password2>"+$("#SUS_item_"+(i+1)).attr("Password2")+"</Password2>");
					}
					xml += ("<c32PasswordFlag>"+pwdTemp+"</Password>");
					xml += ("<c32PasswordFlag>"+pwdTemp+"</Password2>");
				}
				xml += ("<HaveSwitch>"+$("#SUS_item_"+(i+1)).attr("HaveSwitch")+"</HaveSwitch>");
				xml += ("<HaveUser>"+$("#SUS_item_"+(i+1)).attr("HaveUser")+"</HaveUser>");
				//xml += ("<au8UserRights>"+$("#SUS_item_"+(i+1)).attr("au8UserRights").toLowerCase()+"</au8UserRights>");
				xml += ("<UserSetRight>"+$("#SUS_item_"+(i+1)).attr("UserSetRight")+"</UserSetRight>");
				xml += ("<PreviewChannel>"+$("#SUS_item_"+(i+1)).attr("PreviewChannel")+"</PreviewChannel>");
				xml += ("<PlayBackChannel>"+$("#SUS_item_"+(i+1)).attr("PlayBackChannel")+"</PlayBackChannel>");
				xml += ("<BackupChannel>"+$("#SUS_item_"+(i+1)).attr("BackupChannel")+"</BackupChannel>");
				xml += ("<PtzControlChannel>"+$("#SUS_item_"+(i+1)).attr("PtzControlChannel")+"</PtzControlChannel>");
				xml += ("<UserPreview>"+$("#SUS_item_"+(i+1)).attr("UserPreview")+"</UserPreview>");
				xml += ("<UserPlayBack>"+$("#SUS_item_"+(i+1)).attr("UserPlayBack")+"</UserPlayBack>");
				xml += ("<UserBackup>"+$("#SUS_item_"+(i+1)).attr("UserBackup")+"</UserBackup>");
				xml += ("<UserPtzControl>"+$("#SUS_item_"+(i+1)).attr("UserPtzControl")+"</UserPtzControl>");
				xml += "</Struct"+i+">"
			}
			xml += "</a>"
			RfParamCall(Call, $("#user_info").text(), "SysUser", 300, "Set", xml);	//初始时获取页面数据
		}
	});
	
	$("#USUsRf").click(function(){
		RfParamCall(Call, $("#user_info").text(), "SysUser", 100, "Get");	//初始时获取页面数据 
		$("div[id^='SUS_item_']").each(function(){
			if(lgCls.version == "LOREX"){
				$(this).removeClass("UserList3");
			}else if(0/*lgCls.version == "KGUARD"*/){
				$(this).removeClass("UserList4");
			}else if(lgCls.version == "FLIR"){
				$(this).removeClass("UserList5");
			}else{
				$(this).removeClass("UserList2");
			}
			
		})
	});
	
	//获取、设置权限值
	function GetAndSetQXValue(flag){
		if (flag == 0){//获取权限值(9个)
			preCh  = 0;
			recCh  = 0;
			backCh = 0;
			ptzCh  = 0;
			userSetRight = 0;
			$("#BackupChannelDiv > div").each(function(i){
				if ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, "")){
					backCh |= (1<<i)
				}
			});
			$("#PreviewChannelDiv > div").each(function(i){
				if ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, "")){
					preCh |= (1<<i)
				}
			});
			$("#PlayBackChannelDiv > div").each(function(i){
				if ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, "")){
					recCh |= (1<<i)
				}
			});
			$("#PtzControlChannelDiv > div").each(function(i){
				if ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, "")){
					ptzCh |= (1<<i)
				}
			});
			
			$.each($("input[id^='user_ck_']"),function(i){
				if($(this).prop("checked")){
					userSetRight |= (1<<($(this).prop("value")*1))
				}
			})
			
			backRight = $("#UserBackup").prop("checked")*1;
			preRight = $("#UserPreview").prop("checked")*1;
			recRight = $("#UserPlayBack").prop("checked")*1;
			ptzRight = $("#UserPtzControl").prop("checked")*1;
		}else{//设置权限值
			$("#BackupChannelDiv > div,#PreviewChannelDiv > div,#PlayBackChannelDiv > div,#PtzControlChannelDiv > div").css("background-color", "transparent")//先全部清空
			$("#BackupChannelDiv > div").each(function(i){
				if ((backCh>>i)&1 == 1){
					$(this).css("background-color", color)
				}
			});
			$("#PreviewChannelDiv > div").each(function(i){
				if ((preCh>>i)&1 == 1){
					$(this).css("background-color", color)
				}
			});
			$("#PlayBackChannelDiv > div").each(function(i){
				if ((recCh>>i)&1 == 1){
					$(this).css("background-color", color)
				}
			});
			$("#PtzControlChannelDiv > div").each(function(i){
				if ((ptzCh>>i)&1 == 1){
					$(this).css("background-color", color)
				}
			});
			
			$("input[id^='user_ck_']").prop("checked", false);//先全部不勾选
			$.each($("input[id^='user_ck_']"),function(i){
				if ((userSetRight>>($(this).prop("value")*1))&1 == 1){
					$(this).prop("checked", true);
				}
			})
			
			$("#UserBackup").prop("checked", backRight*1);
			$("#UserPreview").prop("checked", preRight*1);
			$("#UserPlayBack").prop("checked", recRight*1);
			$("#UserPtzControl").prop("checked", ptzRight*1);
		}
	}
});