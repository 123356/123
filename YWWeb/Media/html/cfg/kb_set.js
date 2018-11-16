// JavaScript Document
$(document).ready(function(){
	//初始操作
		//MasklayerShow();
		RfParamCall(Call, $("#kb_config").text(), "SysSer", 100, "Get");	//初始时获取页面数据
	
	function Call(xml){
			$("#kb_Protocol").val(findNode("Protocol", xml));
			$("#kb_Baudrate").val(findNode("Baudrate", xml));
			$("#kb_DataBit").val(findNode("DataBit", xml));
			$("#kb_StopBit").val(findNode("StopBit", xml));
			$("#kb_Check").val(findNode("Check", xml));
	}
	
	$("#kb_refresh").click(function(){
		//MasklayerShow();
		RfParamCall(Call, $("#kb_config").text(), "SysSer", 100, "Get");	//刷新页面数据
	});
	
	$("#kb_save").click(function(){
		//MasklayerShow();
		var xml = "<a>";
		xml += ("<Protocol>" + ($("#kb_Protocol").val()) + "</Protocol>");
		xml += ("<Baudrate>" + ($("#kb_Baudrate").val()) + "</Baudrate>");
		xml += ("<DataBit>" + $("#kb_DataBit").val() + "</DataBit>");
		xml += ("<StopBit>" + ($("#kb_StopBit").val()) + "</StopBit>");
		xml += ("<Check>" + $("#kb_Check").val() + "</Check>");
		xml += "</a>";
		RfParamCall(Call, $("#kb_config").text(), "SysSer", 300, "Set", xml);	//保存
	});
});