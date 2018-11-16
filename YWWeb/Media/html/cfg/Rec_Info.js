
$(document).ready(function(){
	$("#rec_info").prop("innerHTML",lg.get("IDS_REC_INFO"));
	
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
	
	//RecStatus 列
	function RecStatusRenderFun(rowdata, rowindex, value){
		if(rowdata.RecStatus==1){
			return lg.get("IDS_OPEN");
		}else{
			return lg.get("IDS_CLOSE");
		}
	}
	
	//RecType 列
	function RecTypeRenderFun(rowdata, rowindex, value){
		if(rowdata.RecType==1){
			return lg.get("IDS_COMPOUND_STREAM");//复合流
		}else{
			return lg.get("IDS_VIDEO_STREAM");//视频流
		}
	}
	//Fps 列
	function FpsRenderFun(rowdata, rowindex, value){
		return rowdata.Fps + "Fps";
	}
	
	//Bitrate 列
	function BitrateRenderFun(rowdata, rowindex, value){
		if(rowdata.Bitrate==0){
			return "0";
		}else{
			return rowdata.Bitrate + "Kbps";
		}
		
	}
	
	//Resolution 列
	function ResolutionRenderFun(rowdata, rowindex, value){
		return rowdata.Resolution;
	}
	
	//刷新
	function listDataCall(xml){
		rowsData = JSON.parse(xml);
		
		var gridData = [];
		gridData.Rows = rowsData;
		gridData.Total = rowsData.length;
		$("#RecInfo_ligerGrid").ligerGrid().loadData(gridData);
	}
	
	function initGrid(){
		$(function(){
			$("#RecInfo_ligerGrid").ligerGrid({
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
					{ display: lg.get('IDS_MOTION_CH'), 		name: 'ChnNo', align: 'center', width: 100, frozen:false, render:ChnNoRenderFun},//ChnNo 列
					{ display: lg.get('IDS_REC_STATE'), 		name: 'RecStatus', 	minWidth: 90, 	render:RecStatusRenderFun},//RecStatus //Record State 列
					{ display: lg.get('IDS_STREAM_TYPE'),  		name: 'RecType', 	minWidth: 120, 	render:RecTypeRenderFun},//RecType		//Stream Type 列
					{ display: lg.get('IDS_ENCODE_FPS'),  		name: 'Fps', 		minWidth: 50, 	render:FpsRenderFun},//Fps			//FPS 列
					{ display: lg.get('IDS_STREAM_BITRATE'), 	name: 'Bitrate', 	minWidth:60, 	render:BitrateRenderFun},//Bitrate 列
					{ display: lg.get('IDS_ENCODE_RESOLUTION'),	name: 'Resolution', minWidth:130, align: 'center',	render:ResolutionRenderFun}//Resolution 列
				]	
			});
			RfParamCall(listDataCall, $("#rec_info").text(), "Rec_Info", 100, "Get");//获取通道状态列表
		});
	}
});