
$(document).ready(function(){
	$("#chn_info").prop("innerHTML",lg.get("IDS_CHN_INFO"));
	
	var rowsData = [];	
	
	initGrid();
	
	//ChnNo 列
	function ChnNoRenderFun(rowdata, rowindex, value){
		var i = rowdata.ChnNo;
		if(i<gDvr.AnalogChNum){
			return lg.get("IDS_CH") + (i+1);
		}else{
			return "IP " + lg.get("IDS_CH") + (i+1-gDvr.AnalogChNum);
		}
	}
	
	//ChnAlias 列
	function ChnAliasRenderFun(rowdata, rowindex, value){
		return rowdata.ChnAlias;
	}
	
	//ChnStatus 列
	function ChnStatusRenderFun(rowdata, rowindex, value){
		//console.log("rowdata.ChnStatus:" + (rowdata.ChnStatus));
		var i = rowdata.ChnNo;
		if(i<gDvr.AnalogChNum){//模拟通道
			if(rowdata.ChnStatus==2){
				return lg.get('IDS_OPEN');//Enable//打开
			}else{
				//
			}
		}else{//IP通道
			if(rowdata.ChnStatus==2){//在线
				return lg.get('IDS_INFO_ONLIEN');
			}else{
				return lg.get('IDS_INFO_OFFLIEN');
			}
		}
	}
	
	function bIpcOffline(rowdata){
		var i = rowdata.ChnNo;
		if(i<gDvr.AnalogChNum){//模拟通道
			//
		}else{//IP通道
			if(rowdata.ChnStatus==2){//在线
				return false;
			}else{
				return true;
			}
		}
	}
	
	//Mainstream 列
	function MainstreamRenderFun(rowdata, rowindex, value){
		if( bIpcOffline(rowdata) ) { return " ";}
		
		//console.log("rowdata.Mainstream:" + (rowdata.Mainstream));
		if(rowdata.Mainstream == "0"){
			return lg.get('IDS_INFO_NO_SUPPORT');
		}else{
			return rowdata.Mainstream;
		}
	}
	
	//Substream 列
	function SubstreamRenderFun(rowdata, rowindex, value){
		if( bIpcOffline(rowdata) ) { return " ";}
		
		//console.log("rowdata.Substream:" + (rowdata.Substream));
		if(rowdata.Substream == "0"){
			return lg.get('IDS_INFO_NO_SUPPORT');
		}else{
			return rowdata.Substream;
		}
	}
	
	//Mobilestream 列
	function MobilestreamRenderFun(rowdata, rowindex, value){
		if( bIpcOffline(rowdata) ) { return " ";}
		
		if(rowdata.Mobilestream == "0"){
			return lg.get('IDS_INFO_NO_SUPPORT');
		}else{
			return rowdata.Mobilestream;
		}
	}
	
	//MotionDetection 列
	function MotionDetectionRenderFun(rowdata, rowindex, value){
		//console.log("rowdata.MotionDetection:" + (rowdata.MotionDetection));
		if( bIpcOffline(rowdata) ) { return " ";}
		
		if(rowdata.MotionDetection==1){
			return lg.get('IDS_INFO_SUPPORT');
		}else{
			return lg.get('IDS_INFO_NO_SUPPORT');
		}
	}
	
	//PrivacyZone 列
	function PrivacyZoneRenderFun(rowdata, rowindex, value){
		if( bIpcOffline(rowdata) ) { return " ";}
		
		if(rowdata.PrivacyZone==1){
			return lg.get('IDS_INFO_SUPPORT');
		}else{
			return lg.get('IDS_INFO_NO_SUPPORT');
		}
	}
	
	//刷新
	function listDataCall(xml){
		rowsData = JSON.parse(xml);
		
		var gridData = [];
		gridData.Rows = rowsData;
		gridData.Total = rowsData.length;
		$("#ChnInfo_ligerGrid").ligerGrid().loadData(gridData);
	}
	
	function initGrid(){
		$(function(){
			$("#ChnInfo_ligerGrid").ligerGrid({
				enabledSort :false,
				checkbox: false,
				usePager:false,
				isScroll:true,
				async :false,
				resizable :false,
				alternatingRow :false,
				frozenCheckbox :false,
				frozen:false,
				width: '700px',
				height:'400px',
				columns: [
					{ display: lg.get('IDS_MOTION_CH'),		name: 'ChnNo', align: 'center', width: 70, frozen:false, render:ChnNoRenderFun},//ChnNo 列
					{ display: lg.get('IDS_INFO_ALIAS'), 	name: 'ChnAlias', 	minWidth: 70, 	render:ChnAliasRenderFun},//ChnAlias 列
					{ display: lg.get('IDS_STATE'),  		name: 'ChnStatus', 	minWidth: 70, 	render:ChnStatusRenderFun},//ChnStatus 列
					{ display: lg.get('IDS_INFO_MAIN'),  	name: 'Mainstream', minWidth: 190, 	render:MainstreamRenderFun},//Mainstream 列
					{ display: lg.get('IDS_INFO_SUB'), 		name: 'Substream', 	minWidth:190,	render:SubstreamRenderFun},//Substream 列
					{ display: lg.get('IDS_INFO_MOBILE'),	name: 'Mobilestream', minWidth:190,	render:MobilestreamRenderFun},//Mobilestream 列
					{ display: lg.get('IDS_INFO_MOTIONDETE'),name: 'MotionDetection',minWidth:60,render:MotionDetectionRenderFun},//MotionDetection 列
					{ display: lg.get('IDS_INFO_PRIVACYZ'), name: 'PrivacyZone',minWidth:60, 	render:PrivacyZoneRenderFun}//PrivacyZone 列
				]	
			});
			RfParamCall(listDataCall, $("#chn_info").text(), "Chn_Info", 100, "Get");//获取通道状态列表
		});
	}
});