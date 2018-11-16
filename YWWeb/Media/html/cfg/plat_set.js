// JavaScript Document
$(document).ready(function(){
	
	$(function(){
		RfParamCall(Call, $("#plat_config").text(), "Platform", 100, "Get");	//初始时获取页面数据
	});
	function Call(xml){
			$("#SLPlat_Enable").val(findNode("PlatEnable", xml));
			$("#TSPlat_Address").val(findNode("PlatAddr", xml));
			$("#TSPlat_Port").val(findNode("PlatPort", xml));
			$("#SLPlat_Select").val(findNode("PlatSelect", xml));
			$("#SLPlat_Protocol").val(findNode("PlatProtocol", xml));
			$("#TSPlat_Puid").val(findNode("PlatPuid", xml));
	}
	
	function PlatSaveSel(){
		var xml = "<a>";
		xml += ("<PlatEnable>" + $("#SLPlat_Enable").val() + "</PlatEnable>");
		xml += ("<PlatAddr>" + $("#TSPlat_Address").val() + "</PlatAddr>");
		xml += ("<PlatPort>" + $("#TSPlat_Port").val() + "</PlatPort>");
		xml += ("<PlatSelect>" + $("#SLPlat_Select").val() + "</PlatSelect>");
		xml += ("<PlatProtocol>" + $("#SLPlat_Protocol").val() + "</PlatProtocol>");
		xml += ("<PlatPuid>" + $("#TSPlat_Puid").val() + "</PlatPuid>");
		xml += "</a>";	
		return xml;
	}
	
	$("#PlatRF").click(function(){
		
		RfParamCall(Call, $("#plat_config").text(), "Platform", 100, "Get");
	});
	
	$("#PlatSV").click(function(){
			//判断ip
		var ipRegEx = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/;
		
		if( !(ipRegEx.test($("#TSPlat_Address").val())))
		{
			ShowPaop($("#plat_config").text(),"IP format error...!");
			return(false);
		}
	//	PlatSaveSel();
		RfParamCall(Call, $("#phone_set").text(), "Platform", 300, "Set", PlatSaveSel());	//保存
	
	});
	
});