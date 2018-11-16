// JavaScript Document
//协议管理
$(document).ready(function(){
	var proManagement;
	var backUp;
	var sel=-1;
	typeValue=["RTSP"];
	transmissonValue=["AUTO","UDP","RTP"];
	function MainStream(Port, Type, Transmisson){	//结构体格式定义 
		this.Port = Number(Port);
		this.Type = Number(Type);
		this.Transmisson = Number(Transmisson);
		this.SourcePath = "";
	}
	function SubStream(Port, Type, Transmisson){	//结构体格式定义 
		this.Port = Number(Port);
		this.Type = Number(Type);
		this.Transmisson = Number(Transmisson);
		this.SourcePath = "";
	}
	
	function proManagement(ProtocolMask,EnableSubStream)
	{
		this.ProtocolName= "";
		this.ProtocolMask=Number(ProtocolMask);
		this.EnableSubStream=Number(EnableSubStream);
		this.MainStream=new MainStream(0);
		this.SubStream=new SubStream(0);
	}
	function backUp(ProtocolMask,EnableSubStream)
	{
		this.ProtocolName= "";
		this.ProtocolMask=Number(ProtocolMask);
		this.EnableSubStream=Number(EnableSubStream);
		this.MainStream=new MainStream(0);
		this.SubStream=new SubStream(0);
	}
	for (var i=0; i<16; i++){
		proManagement[i] = new proManagement(0,0);
		backUp[i] = new proManagement(0,0);
	}
	function InitArray(xml){	//初始化数组 --xml ->  struct
		for (var i=0; i<16; i++){
			proManagement[i].ProtocolName = findChildNode(i+"Struct", "ProtocolName", xml);
			proManagement[i].ProtocolMask = findChildNode(i+"Struct", "ProtocolMask", xml)*1;
			proManagement[i].EnableSubStream = findChildNode(i+"Struct", "EnableSubStream", xml)*1;
			//主码流
			proManagement[i].MainStream.Port = findChildNode(i+"Struct", "MainPort", xml)*1;
			proManagement[i].MainStream.Type = findChildNode(i+"Struct", "MainType", xml)*1;
			proManagement[i].MainStream.Transmisson = findChildNode(i+"Struct", "MainTransmisson", xml)*1;
			proManagement[i].MainStream.SourcePath = findChildNode(i+"Struct", "MainSourcePath", xml);
			//子码流
			proManagement[i].SubStream.Port = findChildNode(i+"Struct", "SubPort", xml)*1;
			proManagement[i].SubStream.Type = findChildNode(i+"Struct", "SubType", xml)*1;
			proManagement[i].SubStream.Transmisson = findChildNode(i+"Struct", "SubTransmisson", xml)*1;
			proManagement[i].SubStream.SourcePath = findChildNode(i+"Struct", "SubSourcePath", xml);
			
			backUp[i].ProtocolName = findChildNode(i+"Struct", "ProtocolName", xml);
			backUp[i].ProtocolMask = findChildNode(i+"Struct", "ProtocolMask", xml)*1;
			backUp[i].EnableSubStream = findChildNode(i+"Struct", "EnableSubStream", xml)*1;
			//主码流
			backUp[i].MainStream.Port = findChildNode(i+"Struct", "MainPort", xml)*1;
			backUp[i].MainStream.Type = findChildNode(i+"Struct", "MainType", xml)*1;
			backUp[i].MainStream.Transmisson = findChildNode(i+"Struct", "MainTransmisson", xml)*1;
			backUp[i].MainStream.SourcePath = findChildNode(i+"Struct", "MainSourcePath", xml);
			//子码流
			backUp[i].SubStream.Port = findChildNode(i+"Struct", "SubPort", xml)*1;
			backUp[i].SubStream.Type = findChildNode(i+"Struct", "SubType", xml)*1;
			backUp[i].SubStream.Transmisson = findChildNode(i+"Struct", "SubTransmisson", xml)*1;
			backUp[i].SubStream.SourcePath = findChildNode(i+"Struct", "SubSourcePath", xml);
		}
	}
	function SaveArray(){	//获取xml  ---  struct ->  xml
		if(CheckChange() == 1){
			if(confirm(lg.get("IDS_CONFIRM_SAVE_PRO"))){
				var xml = "<a>";
				for (var i=0; i<16; i++){
					 xml += ("<Struct"+i+">\
							<ProtocolName>"+proManagement[i].ProtocolName+"</ProtocolName>\
							<ProtocolMask>"+proManagement[i].ProtocolMask+"</ProtocolMask>\
							<EnableSubStream>"+proManagement[i].EnableSubStream+"</EnableSubStream>\
							<MainType>"+proManagement[i].MainStream.Type+"</MainType>\
							<MainTransmisson>"+proManagement[i].MainStream.Transmisson+"</MainTransmisson>\
							<MainPort>"+proManagement[i].MainStream.Port+"</MainPort>\
							<MainSourcePath>"+proManagement[i].MainStream.SourcePath+"</MainSourcePath>\
							<SubType>"+proManagement[i].SubStream.Type+"</SubType>\
							<SubTransmisson>"+proManagement[i].SubStream.Transmisson+"</SubTransmisson>\
							<SubPort>"+proManagement[i].SubStream.Port+"</SubPort>\
							<SubSourcePath>"+proManagement[i].SubStream.SourcePath+"</SubSourcePath>\
							</Struct"+i+">");
					backUp[i].ProtocolName = proManagement[i].ProtocolName;
					backUp[i].ProtocolMask = proManagement[i].ProtocolMask;
					backUp[i].EnableSubStream = proManagement[i].EnableSubStream;
					//主码流
					backUp[i].MainStream.Port = proManagement[i].MainStream.Port;
					backUp[i].MainStream.Type = proManagement[i].MainStream.Type;
					backUp[i].MainStream.Transmisson = proManagement[i].MainStream.Transmisson;
					backUp[i].MainStream.SourcePath = proManagement[i].MainStream.SourcePath;
					//子码流
					backUp[i].SubStream.Port = proManagement[i].SubStream.Port;
					backUp[i].SubStream.Type = proManagement[i].SubStream.Type;
					backUp[i].SubStream.Transmisson = proManagement[i].SubStream.Transmisson;
					backUp[i].SubStream.SourcePath = proManagement[i].SubStream.SourcePath;
				}
				xml += "</a>";
				return xml;
			}else{
				return ;
			}
		}else{
			var xml = "<a>";
			for (var i=0; i<16; i++){
				 xml += ("<Struct"+i+">\
						<ProtocolName>"+proManagement[i].ProtocolName+"</ProtocolName>\
						<ProtocolMask>"+proManagement[i].ProtocolMask+"</ProtocolMask>\
						<EnableSubStream>"+proManagement[i].EnableSubStream+"</EnableSubStream>\
						<MainType>"+proManagement[i].MainStream.Type+"</MainType>\
						<MainTransmisson>"+proManagement[i].MainStream.Transmisson+"</MainTransmisson>\
						<MainPort>"+proManagement[i].MainStream.Port+"</MainPort>\
						<MainSourcePath>"+proManagement[i].MainStream.SourcePath+"</MainSourcePath>\
						<SubType>"+proManagement[i].SubStream.Type+"</SubType>\
						<SubTransmisson>"+proManagement[i].SubStream.Transmisson+"</SubTransmisson>\
						<SubPort>"+proManagement[i].SubStream.Port+"</SubPort>\
						<SubSourcePath>"+proManagement[i].SubStream.SourcePath+"</SubSourcePath>\
						</Struct"+i+">");
				backUp[i].ProtocolName = proManagement[i].ProtocolName;
				backUp[i].ProtocolMask = proManagement[i].ProtocolMask;
				backUp[i].EnableSubStream = proManagement[i].EnableSubStream;
				//主码流
				backUp[i].MainStream.Port = proManagement[i].MainStream.Port;
				backUp[i].MainStream.Type = proManagement[i].MainStream.Type;
				backUp[i].MainStream.Transmisson = proManagement[i].MainStream.Transmisson;
				backUp[i].MainStream.SourcePath = proManagement[i].MainStream.SourcePath;
				//子码流
				backUp[i].SubStream.Port = proManagement[i].SubStream.Port;
				backUp[i].SubStream.Type = proManagement[i].SubStream.Type;
				backUp[i].SubStream.Transmisson = proManagement[i].SubStream.Transmisson;
				backUp[i].SubStream.SourcePath = proManagement[i].SubStream.SourcePath;
			}
			xml += "</a>";
			return xml;
		}
	}
	$(function(){	//初始化时填充界面元素
		$("#promanagent_select").empty();//Channel
		for(var i=0; i<16; i++){
			if(sel==-1)
				sel = i;
			$("#promanagent_select").append('<option class="option" value="'+i+'">'+lg.get("IDS_CUSTOM_PROTOCOL")+(i+1)+'</option>');	
		}	
		if(sel == -1)
			sel = 0;
		for(var i=0;i<typeValue.length; i++){
			$("#prom_type0_select").append('<option class="option" value="'+i+'">'+typeValue[i]+'</option>');
			$("#prom_type1_select").append('<option class="option" value="'+i+'">'+typeValue[i]+'</option>');
			}
		for(var i=0;i<transmissonValue.length; i++){
			$("#prom_pro0_select").append('<option class="option" value="'+i+'">'+transmissonValue[i]+'</option>');
			$("#prom_pro1_select").append('<option class="option" value="'+i+'">'+transmissonValue[i]+'</option>');
			}

		RfParamCall(PMCall, $("#proManage").text(), "ProManage", 100, "Get");//初始时获取页面数据
	});
	function PMCall(xml){
			InitArray(xml);
			//ProtocolName获取列表，赋值
			if(proManagement[sel].ProtocolName == ""){
				$("#promanagent_name").empty();
			}else{
				$("#promanagent_name").empty();
				$("#promanagent_name").val(proManagement[sel].ProtocolName);
			}

			//EnableSubStream获取列表，赋
			$("#subStreamVS").prop("checked", proManagement[sel].EnableSubStream);
			
			//type获取列表，赋值
			$("#prom_type0_select").empty();
			for(var i=0; i< typeValue.length; i++){
					$("#prom_type0_select").append('<option class="option" value="'+i+'">'+typeValue[i]+'</option>');
			}
			$("#prom_type0_select").val(proManagement[sel].MainStream.Type);
			
			//type1获取列表，赋值
			$("#prom_type1_select").empty();
			for(var i=0; i< typeValue.length; i++){
					$("#prom_type1_select").append('<option class="option" value="'+i+'">'+typeValue[i]+'</option>');
			}
			$("#prom_type1_select").val(proManagement[sel].SubStream.Type);
			
			//Transmisson获取列表，赋值
			$("#prom_pro0_select").empty();//Preset下的Bitrate
			for(var i=0; i< transmissonValue.length; i++){
					$("#prom_pro0_select").append('<option class="option" value="'+i+'">'+transmissonValue[i]+'</option>');
			}
			$("#prom_pro0_select").val(proManagement[sel].MainStream.Transmisson);
			
			//Transmisson1获取列表，赋值
			$("#prom_pro1_select").empty();//Preset下的Bitrate
			for(var i=0; i< transmissonValue.length; i++){
					$("#prom_pro1_select").append('<option class="option" value="'+i+'">'+transmissonValue[i]+'</option>');
			}
			$("#prom_pro1_select").val(proManagement[sel].SubStream.Transmisson);
			
			//Port获取列表，赋值
			$("#prom_port0").empty();
			$("#prom_port0").val(proManagement[sel].MainStream.Port);
			
			//Port1获取列表，赋值
			$("#prom_port1").empty();
			$("#prom_port1").val(proManagement[sel].SubStream.Port);
			
			//路径
			if(proManagement[sel].MainStream.SourcePath == ""){
				$("#prom_root0").empty();
			}else{
				$("#prom_root0").empty();
				$("#prom_root0").val(proManagement[sel].MainStream.SourcePath);
			}
			//路径1
			if(proManagement[sel].SubStream.SourcePath == ""){
				$("#prom_root1").empty();
			}else{
				$("#prom_root1").empty();
				$("#prom_root1").val(proManagement[sel].SubStream.SourcePath);
			}
			
			if(proManagement[sel].EnableSubStream==0){
				$("#prom_type1_select").css("opacity",0.5).attr("disabled","disabled");
				$("#prom_pro1_select").css("opacity",0.5).attr("disabled","disabled");
				$("#prom_port1").css("opacity",0.5).attr("readonly","readonly");
				$("#prom_root1").css("opacity",0.5).attr("readonly","readonly");
				}else{
				$("#prom_type1_select").css("opacity",1).removeAttr("disabled");
				$("#prom_pro1_select").css("opacity",1).removeAttr("disabled");
				$("#prom_port1").css("opacity",1).removeAttr("readonly");
				$("#prom_root1").css("opacity",1).removeAttr("readonly");
					}
	}
	
	//自定义协议改变
	$("#promanagent_select").change(function(){
		var chid = $("#promanagent_select").val()*1;
		if(saveSelPro(sel) == 0){
			$("#promanagent_select").val(sel);
			return ;
		}
		sel = chid;
		//ProtocolName获取列表，赋值
		$("#promanagent_name").empty();
		$("#promanagent_name").val(proManagement[sel].ProtocolName);

		//EnableSubStream获取列表，赋值
		$("#subStreamVS").empty();
		$("#subStreamVS").prop("checked", proManagement[sel].EnableSubStream);
		
		//type获取列表，赋值
		$("#prom_type0_select").empty();
		for(var i=0; i< typeValue.length; i++){
				$("#prom_type0_select").append('<option class="option" value="'+i+'">'+typeValue[i]+'</option>');
		}
		$("#prom_type0_select").val(proManagement[sel].MainStream.Type);
		
		//type1获取列表，赋值
		$("#prom_type1_select").empty();
		for(var i=0; i< typeValue.length; i++){
				$("#prom_type1_select").append('<option class="option" value="'+i+'">'+typeValue[i]+'</option>');
		}
		$("#prom_type1_select").val(proManagement[sel].SubStream.Type);
		
		//Transmisson获取列表，赋值
		$("#prom_pro0_select").empty();//Preset下的Bitrate
		for(var i=0; i< transmissonValue.length; i++){
				$("#prom_pro0_select").append('<option class="option" value="'+i+'">'+transmissonValue[i]+'</option>');
		}
		$("#prom_pro0_select").val(proManagement[sel].MainStream.Transmisson);
		
		//Transmisson1获取列表，赋值
		$("#prom_pro1_select").empty();//Preset下的Bitrate
		for(var i=0; i< transmissonValue.length; i++){
				$("#prom_pro1_select").append('<option class="option" value="'+i+'">'+transmissonValue[i]+'</option>');
		}
		$("#prom_pro1_select").val(proManagement[sel].SubStream.Transmisson);
		
		//Port获取列表，赋值
		$("#prom_port0").empty();
		$("#prom_port0").val(proManagement[sel].MainStream.Port);
		
		//Port1获取列表，赋值
		$("#prom_port1").empty();
		$("#prom_port1").val(proManagement[sel].SubStream.Port);
		
		//路径
		$("#prom_root0").empty();
		$("#prom_root0").val(proManagement[sel].MainStream.SourcePath);
		
		//路径1
		$("#prom_root1").empty();
		$("#prom_root1").val(proManagement[sel].SubStream.SourcePath);
		
		//子码流数据
		if(proManagement[sel].EnableSubStream==0){
			$("#prom_type1_select").css("opacity",0.5).attr("disabled","disabled");
			$("#prom_pro1_select").css("opacity",0.5).attr("disabled","disabled");
			$("#prom_port1").css("opacity",0.5).attr("readonly","readonly");
			$("#prom_root1").css("opacity",0.5).attr("readonly","readonly");
			}else{
			$("#prom_type1_select").css("opacity",1).removeAttr("disabled");
			$("#prom_pro1_select").css("opacity",1).removeAttr("disabled");
			$("#prom_port1").css("opacity",1).removeAttr("readonly");
			$("#prom_root1").css("opacity",1).removeAttr("readonly");
					}
		});

     //子码流改变
	$("#subStreamVS").change(function(){
		var chid = $("#promanagent_select").val()*1;
		sel = chid;
		if($(this).is(':checked')) {
			$("#prom_type1_select").css("opacity",1).removeAttr("disabled");
			$("#prom_pro1_select").css("opacity",1).removeAttr("disabled");
			$("#prom_port1").css("opacity",1).removeAttr("readonly");
			$("#prom_root1").css("opacity",1).removeAttr("readonly");
			proManagement[sel].EnableSubStream=1;
			}else{
			$("#prom_type1_select").css("opacity",0.5).attr("disabled","disabled");
			$("#prom_pro1_select").css("opacity",0.5).attr("disabled","disabled");
			$("#prom_port1").css("opacity",0.5).attr("readonly","readonly");
			$("#prom_root1").css("opacity",0.5).attr("readonly","readonly");
			proManagement[sel].EnableSubStream=0;
          }
		});
	//Refresh
	$("#ProMRf").click(function(){
		RfParamCall(PMCall, $("#proManage").text(), "ProManage", 100, "Get");
		});
	//Save
	$("#ProMSV").click(function(){
		//获取数据
		var chid = $("#promanagent_select").val()*1;
		sel = chid;
		if(saveSelPro(sel) == 0){
			return ;
		}
		
		RfParamCall(PMCall, $("#proManage").text(), "ProManage", 300, "Set", SaveArray());
		});
	//Exit
	$("#ProMEx").click(function(){showConfigChild("IPCan_set");});
	
	function CheckChange(){
		for(var i = 0;i < gDvr.nChannel; ++i){
			if(IpcAbility[i].State != -1 && IpcAbility[i].ProtocolType >= 32){//检查已使用自定义协议是否被修改
				var protoType = IpcAbility[i].ProtocolType - 32;
				if((backUp[protoType].EnableSubStream != proManagement[protoType].EnableSubStream)
				|| (backUp[protoType].MainStream.Type != proManagement[protoType].MainStream.Type)
				|| (backUp[protoType].MainStream.Transmisson != proManagement[protoType].MainStream.Transmisson)
				|| (backUp[protoType].MainStream.Port != proManagement[protoType].MainStream.Port)
				|| (backUp[protoType].MainStream.SourcePath != proManagement[protoType].MainStream.SourcePath)
				|| (backUp[protoType].SubStream.Type != proManagement[protoType].SubStream.Type)
				|| (backUp[protoType].SubStream.Transmisson != proManagement[protoType].SubStream.Transmisson)
				|| (backUp[protoType].SubStream.Port != proManagement[protoType].SubStream.Port)
				|| (backUp[protoType].SubStream.SourcePath != proManagement[protoType].SubStream.SourcePath)){
					return 1;//修改
				}
			}
		}
		return 0;//未修改
	}
	
	
	function saveSelPro(sel){
		
		proManagement[sel].ProtocolName = $("#promanagent_name").val();//协议名称
		proManagement[sel].EnableSubStream = $("#subStreamVS").prop("checked")*1;//启用子码流
		//主码流
		proManagement[sel].MainStream.Type = document.getElementById("prom_type0_select").value;
		proManagement[sel].MainStream.Transmisson = document.getElementById("prom_pro0_select").value;
		proManagement[sel].MainStream.Port = $("#prom_port0").val();
		proManagement[sel].MainStream.SourcePath =$("#prom_root0").val();
		
		//子码流
		proManagement[sel].SubStream.Type = document.getElementById("prom_type1_select").value;
		proManagement[sel].SubStream.Transmisson = document.getElementById("prom_pro1_select").value;
		proManagement[sel].SubStream.Port = $("#prom_port1").val();
		proManagement[sel].SubStream.SourcePath =$("#prom_root1").val();
		
		if(proManagement[sel].MainStream.SourcePath == ""){
			ShowPaop($("#proManage").text(), lg.get("IDS_MAINSOURCEPATH_EMPTY"));
			$("#prom_root0").focus().select();
			return 0;
		}
		
		if(proManagement[sel].EnableSubStream == 1 && proManagement[sel].SubStream.SourcePath == ""){
			ShowPaop($("#proManage").text(), lg.get("IDS_SUBSOURCEPATH_EMPTY"));
			$("#prom_root1").focus().select();
			return 0;
		}
		return 1;
	}
	
	
});