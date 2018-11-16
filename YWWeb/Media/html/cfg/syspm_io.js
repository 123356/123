// JavaScript Document
$(document).ready(function(){
	//初始操作
		//MasklayerShow();
		RfParamCall(Call, $("#serial_port_config").text(), "SysSer", 100, "Get");	//初始时获取页面数据
	
	function Call(xml){
			$("#Protocol").val(findNode("Protocol", xml));
			$("#Baudrate").val(findNode("Baudrate", xml));
			$("#DataBit").val(findNode("DataBit", xml));
			$("#StopBit").val(findNode("StopBit", xml));
			$("#Check").val(findNode("Check", xml));
	}
	
	$("#si_refresh").click(function(){
		//MasklayerShow();
		RfParamCall(Call, $("#serial_port_config").text(), "SysSer", 100, "Get");	//刷新页面数据
	});
	
	$("#si_save").click(function(){
		//MasklayerShow();
		var xml = "<a>";
		xml += ("<Protocol>" + ($("#Protocol").val()) + "</Protocol>");
		xml += ("<Baudrate>" + ($("#Baudrate").val()) + "</Baudrate>");
		xml += ("<DataBit>" + $("#DataBit").val() + "</DataBit>");
		xml += ("<StopBit>" + ($("#StopBit").val()) + "</StopBit>");
		xml += ("<Check>" + $("#Check").val() + "</Check>");
		xml += "</a>";
		RfParamCall(Call, $("#serial_port_config").text(), "SysSer", 300, "Set", xml);	//保存
	});
});