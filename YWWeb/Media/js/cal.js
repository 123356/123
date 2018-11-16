(function($) {
	var ISOPENHUILI = 0;
	if(lgCls.version == "BRIGHT"){//客户专用，所有语言启用波斯历
		ISOPENHUILI = 1;
	}
	
	var today = new Date(); 
    var months = "1,2,3,4,5,6,7,8,9,10,11,12".split(',');
	var monthlengths = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
  	var dateRegEx = /^\d{1,2}\/\d{1,2}\/\d{2}|\d{4}$/;
	var yearRegEx = /^\d{4,4}$/;
	var GLtoHLyear,GLtoHLmonth,GLtoHLday;
	this.a = 0;
	this.b = 0;
	_self = this;
	var Xq = [
				  ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"],                       //中文
				  ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],         //英语
				  ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],    //俄语
				  ["Domenica","Lunedi","Martedì","Mercoledì","Giovedi","Venerdì","Sabato"],         //意大利语
				  ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"],//葡萄牙语
				  ["יום ראשון","יום שני","יום שלישי","יום רביעי","יום חמישי","יום שישי","יום שבת"],          //希伯来语
				  ["Κυριακή","Δευτέρα","Τρίτη","Τετάρτη","Πέμπτη","Παρασκευή","Σάββατο"],            //希腊语
				  ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], //德语
				  ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],        //西班牙语
				  ["Dimanche", "Lundi", "mardi", "mercredi", "Jeudi", "Vendredi", "samedi"],         //法语
				  ["Niedziela", "Poniedziałek", "Wtorek", "środa", "czwartek", "piątek", "sobota"],   //波兰语
				  ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],                         //繁体中文
				  ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],                          //日语
				  ["วันอาทิตย์","วันจันทร์","วันอังคาร","วันพุธ","วันพฤหัสบดี","วันศุกร์","วันเสาร์"],                     //泰语
				  ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],              //土耳其语
				  ["Maa","Din","Woe","Don","Vrij","Zat","Zon"],                                        //荷兰语
				  ["Vas.","Hét.","Ked.","Sze.","Csü.","Pén.","Szo."],                                   //匈牙利语
				  ["Søn.","Man.","Tir.","Ons.","Tor.","Fre.","Lør."],                                  //丹麦语
				  ["sun.","Mån","tis","ons","tor","fre","lör"],                                   	   //瑞典语
				  ["일요일","월요일","화요일","수요일","목요일","금요일","토요일에"],                       //韩语
				  ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"],//葡萄牙语
			 ];
	var XqS = [
				  ["日","一","二","三","四","五","六"],                       //中文
				  ["S","M","T","W","T","F","S"],                            //英语		  									
				  ["В","П","В","С","Ч","П","С"],                            //俄语
				  ["D","L","M","M","G","V","S"],                            //意大利语
				  ["D","S","T","Q","Q","S","S"],                            //葡萄牙语  
				  ["ש","א","ב","ג","ד","ח","ו"],                            //希伯来语
				  ["K","Δ","Τ","Τ","Π","Π","Σ"],                            //希腊语
				  ["S","M","D","M","D","F","S"],                            //德语
				  ["D","L","M","M","J","V","S"],                            //西班牙语
				  ["D","L","M","M","J","V","S"],                            //法语
				  ["N","P","W","ś","C","P","S"],                            //波兰语
				  ["日","一","二","三","四","五","六"],                       //繁体中文
				  ["日","月","火","水","木","金","土"],                      //日语
				  ["วัน","หนึ่ง","สอง","สาม","สี่","ห้า","หก"],                   //泰语
				  ["P","P","S","Ç","P","C","C"],                            //土耳其语
				  ["M","D","W","D","V","Z","Z"],                            //荷兰语
				  ["V","H","K","S","C","P","S"],                            //匈牙利语
				  ["S","M","T","O","T","F","L"],                            //丹麦语
				  ["S","M","T","O","T","F","L"],                            //瑞典语
				  ["일","월","화","수","목","금","토"],                      //韩语
				  ["D","S","T","Q","Q","S","S"],                            //葡萄牙语
			  ];
	var Xtd = ["今天", "today","сегодня","Oggi","Hoje","today","σήμερα","сегодня","hoy","aujourd'hui","dzisiaj","今日","今日は","วันนี้","bugün","vandaag","ma"];
    $.fn.simpleDatepicker = function(options) {
		var opts = jQuery.extend({}, jQuery.fn.simpleDatepicker.defaults, options);
		setupYearRange();
		function setupYearRange () {
			var tempNowDate = new Date();
			opts.startyear = tempNowDate.getFullYear() - 10; 
			opts.endyear = tempNowDate.getFullYear() + 10;
		}
		
		function newDatepickerHTML () {
			var years = [];
			for (var i = 0; i <= opts.endyear - opts.startyear; i ++) years[i] = opts.startyear + i;
	
			// 表单
			var table = jQuery('<table class="datepicker" cellpadding="0" cellspacing="0" style="top:-5px; margin-top:0px; marker-offset:0px;"  ></table>');
			table.append('<thead></thead>');
			table.append('<tfoot></tfoot>');
			table.append('<tbody class="tbody"></tbody>');
			
			// 月份下拉框
			var selectMonth = "";
			selectMonth = '<div id="selectMonth" class="selectMonth"><select class="calendar_ctrl" id="' + opts.name + '_month" name="month">';
			for (var i in months) selectMonth += ('<b>'+'<option value="'+i+'">'+months[i]+'</option>'+'</b>');
			selectMonth += '</select></div>';
			
			// 年 下拉框
			var yearselect = "";
			yearselect = '<div id="yearselect" class="yearselect"><select class="calendar_ctrl" id="' + opts.name + '_year" name="year">';
			for (var i in years) yearselect += ('<option>'+'<b>'+years[i]+'</b>'+'</option>'); //<b></b> //for (var i in years) yearselect += ('<option>'+years[i]+'</option>');
			yearselect += '</select></div>';
			
			jQuery("thead",table).append('<tr class="controls">  \
										  		<th style="display:block;"><div class="prevMonth"></div></th>  \
												<th colspan="5" style="text-align:center; height: 20px; padding-left:20px;">'+'<div style="float:left">&nbsp;&nbsp;&nbsp;</div>'+yearselect+'<div style="float:left">&nbsp;&nbsp;&nbsp;</div>'+selectMonth+'</th>  \
												<th style="display:block; "><div class="nextMonth"></div></th>  \
											</tr>');
		    			
			//日-星期
			var dSt = gVar.nWeekStart;
			jQuery("thead",table).append('<tr class="days">  \
												<th>'+XqS[opts.Laguage][dSt]+'</th>  \
												<th>'+XqS[opts.Laguage][dSt+1>6?dSt+1-7:dSt+1]+'</th>  \
												<th>'+XqS[opts.Laguage][dSt+2>6?dSt+2-7:dSt+2]+'</th>  \
												<th>'+XqS[opts.Laguage][dSt+3>6?dSt+3-7:dSt+3]+'</th>  \
												<th>'+XqS[opts.Laguage][dSt+4>6?dSt+4-7:dSt+4]+'</th>  \
												<th>'+XqS[opts.Laguage][dSt+5>6?dSt+5-7:dSt+5]+'</th>  \
												<th fdfs>'+XqS[opts.Laguage][dSt+6>6?dSt+6-7:dSt+6]+'</th>  \
										 </tr>');
			
			//tbody第一行
			jQuery("tbody",table).append('<tr>\
												<th class="CALMAXDAY_old" colspan="6" rowspan="7" style="display: none;"></th>  \
												<td></td>  \
												<td></td>  \
												<td></td>  \
												<td></td>  \
												<td></td>  \
												<td></td>  \
												<td></td>  \
										 </tr>');
			//tbody第二到第六行
			for (var i = 1; i < 6; i++) jQuery("tbody",table).append('<tr>  \
																			<td></td>  \
																			<td></td>  \
																			<td></td>  \
																			<td></td>  \
																			<td></td>  \
																			<td></td>  \
																			<td></td>  \
																		</tr>');	
			
			//tbody第7行
			jQuery("tbody",table).append('<tr>\
											<th class="CALMAXDAY" colspan="7" rowspan="1" style="display:block; background: #262626;"></th> \
										</tr>');
			
			jQuery(".CALMAXDAY",table).append(' <div class="ToData" style="display:none;"></div>\
												<div class="ToDayS" style="display:none;"></div>\
												<div style="position:absolute;top:159px;left:8px;">\
													<span class="ToDay" style="display:none;"></span><br>\
													<span class="ToDayHuili" style="font-size:15px; display:block;"></span>\
												</div>'
											 );
			if(ISOPENHUILI){
				$(".calendarDiv").css("height", "199px");//显示波斯历的年月日，需要24px
				//默认显示波斯历的年月日
			}else{
				//默认高175px
				$(".CALMAXDAY").css("display", "none");//不显示波斯历的年月日
			}
			
			//tobody第七到第九行	
			//for (var i = 0; i < 3; i++) jQuery("tbody",table).append('<tr><td></td><td></td></tr>');
			return table;
		}
		
		function CreateTip(){
			var div = jQuery('<div id="CalTip" style="width:123px;height:109px;position:absolute;display:none; z-index:10000"><p style="color:#F00;font-size:12px;margin:30px 20px;"></p></div>');
			return div;
		}
		
		function loadMonth (e, el, datepicker, chosendate, tip) {
			
			var mo = jQuery("select[name=month]", datepicker).get(0).selectedIndex;
			var yr = jQuery("select[name=year]", datepicker).get(0).selectedIndex;
			var yrs = jQuery("select[name=year] option", datepicker).get().length;
			
			if (e && jQuery(e.target).hasClass('prevMonth')) {				
				if (0 == mo && yr) {
					yr -= 1; mo = 11;
					jQuery("select[name=month]", datepicker).get(0).selectedIndex = 11;
					jQuery("select[name=year]", datepicker).get(0).selectedIndex = yr;
				} else {
					mo -= 1;
					jQuery("select[name=month]", datepicker).get(0).selectedIndex = mo;
				}
			} else if (e && jQuery(e.target).hasClass('nextMonth')) {
				if (11 == mo && yr + 1 < yrs) {
					yr += 1; mo = 0;
					jQuery("select[name=month]", datepicker).get(0).selectedIndex = 0;
					jQuery("select[name=year]", datepicker).get(0).selectedIndex = yr;
				} else { 
					mo += 1;
					jQuery("select[name=month]", datepicker).get(0).selectedIndex = mo;
				}
			}

			if(_self.a != mo || _self.b != yr)
			{
				_self.a = mo;
				_self.b = yr;
				
				if( $("#bPbTBCheck").css("background-image").indexOf("cbox_on.png") >= 0 ){
						bPbTBCheckValue = 1;
				}else{
						bPbTBCheckValue = 0;
				}
				var tempDt = new Date();
				gDvr.PlayBackByMon(0xFFFF,$("#pbRcType").val()*1 + 1, bPbTBCheckValue, (tempDt.getFullYear() - 10+yr*1)+"-" + (mo * 1+1)+ "-1-"+ (mo * 1+1)+ "-1",gDvr.nChannel);	
			}
			
			if (0 == mo && !yr) jQuery("div.prevMonth", datepicker).hide(); 
			else jQuery("div.prevMonth", datepicker).show(); 
			if (yr + 1 == yrs && 11 == mo) jQuery("div.nextMonth", datepicker).hide(); 
			else jQuery("div.nextMonth", datepicker).show(); 
			
			var cells = jQuery("tbody td", datepicker).unbind().empty().removeClass('date');
			
			var m = jQuery("select[name=month]", datepicker).val();
			var y = jQuery("select[name=year]", datepicker).val();
			var d = new Date(y, m, 1);
			var startindex = d.getDay();
			var numdays = monthlengths[m];
			
			if (1 == m && ((y%4 == 0 && y%100 != 0) || y%400 == 0)) numdays = 29;
			
			if (opts.startdate.constructor == Date) {
				var startMonth = opts.startdate.getMonth();
				var startDate = opts.startdate.getDate();
			}
			if (opts.enddate.constructor == Date) {
				var endMonth = opts.enddate.getMonth();
				var endDate = opts.enddate.getDate();
			}
			if(!opts.type)
			{
				$(".chosen").removeClass('chosen');
				$(".chosen2").removeClass('chosen2');
				$(".chosen3").removeClass('chosen3');
			}
			
			var tempIndex = startindex-gVar.nWeekStart<0 ? startindex-gVar.nWeekStart+7: startindex-gVar.nWeekStart;
			for (var i = 0; i < numdays; i++) {	
			
				var cell = jQuery(cells.get(i+tempIndex)).removeClass('chosen');
				if ( 
					(yr || ((!startDate && !startMonth) || ((i+1 >= startDate && mo == startMonth) || mo > startMonth))) &&
					(yr + 1 < yrs || ((!endDate && !endMonth) || ((i+1 <= endDate && mo == endMonth) || mo < endMonth)))) {
	
					cell
						.text(i+1)
						.addClass('date')
						.hover(
							function () { 
								jQuery(this).addClass('over');
								if ($.isFunction(opts.CallBack)){
									var dateObj = new Date(jQuery("select[name=year]", datepicker).val(), 
										jQuery("select[name=month]", datepicker).val(), jQuery(this).text());								
									opts.CallBack(tip, jQuery.fn.simpleDatepicker.formatOutputHL(dateObj, opts.UseZS), 
										$(this).offset().top+25, $(this).offset().left-85);
								}
							},
							function () { jQuery(this).removeClass('over'); jQuery(tip).hide();})
						.click(function () {
							var chosenDateObj = new Date(jQuery("select[name=year]", datepicker).val(), jQuery("select[name=month]", datepicker).val(), jQuery(this).text());
							
							if(!opts.type){
								$(".chosen3").addClass('chosen2').removeClass("chosen3");
								$(".chosen").removeClass('chosen');
								if ($(this).attr("class").indexOf("chosen2") != -1){
									$(this).addClass('chosen3');
								}else{
									$(this).addClass('chosen');
								}
							}
							
							if(ISOPENHUILI){
								GLtoHLyear = jQuery("select[name=year]", datepicker).val()*1;
								GLtoHLmonth = jQuery("select[name=month]", datepicker).val()*1+1;
								GLtoHLday = jQuery(this).text()*1;
								MiladiToShamsi(GLtoHLmonth,GLtoHLday,GLtoHLyear);
								if (jQuery.fn.simpleDatepicker.TimeType == 0){
									$(".ToDayHuili").prop("innerText",GLtoHLmonth+"/"+GLtoHLday+"/"+GLtoHLyear);
								}else if(jQuery.fn.simpleDatepicker.TimeType == 1){
									$(".ToDayHuili").prop("innerText",GLtoHLyear+"-"+GLtoHLmonth+"-"+GLtoHLday);
								}else if(jQuery.fn.simpleDatepicker.TimeType == 2){
									$(".ToDayHuili").prop("innerText",GLtoHLday+"/"+GLtoHLmonth+"/"+GLtoHLyear);
								}
							}
							closeIt(el, datepicker, chosenDateObj);
						});
					
					if (i+1 == opts.chosendate.getDate() && m == opts.chosendate.getMonth() && y == opts.chosendate.getFullYear()) 
					{
						//if (cell.attr("class").indexOf("chosen2") != -1){
							//cell.addClass('chosen3');
						//}else{
							cell.addClass('chosen');
						//}
					}
				}
				
				if (!opts.type){
					if($("#CalDayID")[0]){
						if ($("#CalDayID").attr("name") && $("#CalDayID").attr("name").indexOf(y+"-"+(Number(m)+1)+"-"+(i+1)+",") != -1 ){
							if (cell.attr("class").indexOf("chosen") != -1){
								cell.addClass('chosen3');
							}else{
								cell.addClass('chosen2');
							}
						}else {
							cell.removeClass('chosen2');
							cell.removeClass('chosen3');
						}
					}
				}
			}
			
			el.focus();
		}
		
		function closeIt (el, datepicker, dateObj) { 
			if (opts.type == 0)
			{
				if (dateObj && dateObj.constructor == Date)
				{
					opts.chosendate = dateObj;
					$("#calday").val(jQuery.fn.simpleDatepicker.formatOutput(dateObj, opts.UseZS));
				}
			}else{
				if (dateObj && dateObj.constructor == Date)
				{
					el.prop("glcal",dateObj);
					el.val(jQuery.fn.simpleDatepicker.formatOutputHL(dateObj, opts.UseZS));
				}
				datepicker.remove();
				$("#"+opts.nIframe).css({ position: 'absolute', width: 0, height: 0 });
				datepicker = null;
				jQuery.data(el.get(0), "simpleDatepicker", { hasDatepicker : false });
				el.attr("idname", "");
			}
			
		}
        return this.each(function() {
			if ( jQuery(this).is('input') && 'text' == $(this).attr("type")) {
				var datepicker, tip; 
				jQuery.data(jQuery(this).get(0), "simpleDatepicker", { hasDatepicker : false });
				if (opts.Laguage == "CHS"){
					opts.Laguage = 0;
				}else if (opts.Laguage == "ENU"){
					opts.Laguage = 1;
				}else if (opts.Laguage == "RUS"){
					opts.Laguage = 2;
				}else if (opts.Laguage == "ITA"){
					opts.Laguage = 3;
				}else if (opts.Laguage == "PTG"){
					opts.Laguage = 4;
				}else if (opts.Laguage == "HEB"){
					opts.Laguage = 5;
				}else if (opts.Laguage == "ELL"){
					opts.Laguage = 6;
				}else if (opts.Laguage == "DEU"){
					opts.Laguage = 7;
				}else if (opts.Laguage == "ESN"){
					opts.Laguage = 8;
				}else if (opts.Laguage == "FRA"){
					opts.Laguage = 9;
				}else if (opts.Laguage == "PLK"){
					opts.Laguage = 10;
				}else if (opts.Laguage == "CHT"){
					opts.Laguage = 11;
				}else if (opts.Laguage == "JPN"){
					opts.Laguage = 12;
				}else if (opts.Laguage == "THA"){
					opts.Laguage = 13;
				}else if (opts.Laguage == "TUR"){
					opts.Laguage = 14;
				}else if (opts.Laguage == "HOL"){
					opts.Laguage = 15;
				}else if (opts.Laguage == "HUN"){
					opts.Laguage = 16;
				}else if (opts.Laguage == "DAN"){
					opts.Laguage = 17;
				}else if (opts.Laguage == "SVE"){
					opts.Laguage = 18;
				}else if (opts.Laguage == "KOR"){
					opts.Laguage = 19;
				}else if (opts.Laguage == "PTB"){
					opts.Laguage = 20;
				}
				jQuery(this).click(function (ev) {
					var $this = jQuery(ev.target);
					if($(this).prop("black") == "true"){
						return ;
					}
					if (false == jQuery.data($this.get(0), "simpleDatepicker").hasDatepicker) {
						this.className="addTimeClick";
						jQuery.data($this.get(0), "simpleDatepicker", { hasDatepicker : true });
						
						var initialDate = $this.val();
						/*
						if (initialDate && dateRegEx.test(initialDate)) {
							var chosendate = new Date(initialDate);
						} else if (opts.chosendate.constructor == Date) {
							var chosendate = opts.chosendate;
						} else if (opts.chosendate) {
							var chosendate = new Date(opts.chosendate);
						} else {
							var chosendate = today;
						}
						*/
						var chosendate = opts.chosendate;
						datepicker = newDatepickerHTML();
						jQuery("#"+opts.name).html(datepicker);
						if ($.browser.safari){
							$(".yearselect").css("width","45px");
							$(".selectMonth").css("width","25px");
						}
						tip = CreateTip();
						jQuery("body").append(tip);
						opts.tip = tip;
						
						var elPos = [0,0];//findPosition($this.get(0));
						var x = (parseInt(opts.x) ? parseInt(opts.x) : 0) + elPos[0];
						var y = (parseInt(opts.y) ? parseInt(opts.y) : 0) + elPos[1];
						jQuery(datepicker).css({ position: 'absolute', left: x, top: y });
						
						if ($.browser.msie && $.browser.version.indexOf("6")!=-1){
							$("#"+opts.nIframe).css({ position: 'absolute', left: jQuery(datepicker).css("left"), top: jQuery(datepicker).css("top"), width:jQuery(datepicker).css("width"), height:jQuery(datepicker).css("height") });
						}
						
						jQuery("div", datepicker).css("cursor","pointer");
						jQuery("select", datepicker).bind('change', function () { $(this).blur();loadMonth (null, $this, datepicker, chosendate, tip); });
						jQuery("div.prevMonth", datepicker).click(function (e) { loadMonth (e, $this, datepicker, chosendate, tip); });
						jQuery("div.nextMonth", datepicker).click(function (e) { loadMonth (e, $this, datepicker, chosendate, tip); });
						if (opts.type == 0){
							jQuery("span.today,.ToData,.ToDayS,.ToDay", datepicker).click(function () {
								$(".chosen").removeClass('chosen');
								$(this).addClass('chosen');
								opts.chosendate = today;
								jQuery("select[name=month]", datepicker).get(0).selectedIndex = chosendate.getMonth();
								jQuery("select[name=year]", datepicker).get(0).selectedIndex = Math.max(0, chosendate.getFullYear() - opts.startyear);
								loadMonth(null, $this, datepicker, chosendate, tip);
								closeIt($this, datepicker, new Date()); 							
							});
							jQuery(document).click(function(){jQuery(opts.tip).hide();});
							jQuery("select[name=month]", datepicker).get(0).selectedIndex = chosendate.getMonth();
							jQuery("select[name=year]", datepicker).get(0).selectedIndex = Math.max(0, chosendate.getFullYear() - opts.startyear);
							loadMonth(null, $this, datepicker, chosendate, tip);
						}else{
							
							$this.blur(function(){
								if ($this.attr("idname") != "mouseover"){
									datepicker.fadeTo("slow",0,function(){
										closeIt($this, datepicker);
									});
									$this.attr("idname","");
									datepicker.fadeTo(100,1);
								}else{
									if(document.activeElement.id!= (opts.name + '_year') && document.activeElement.id!= (opts.name + '_month')){
										$this.focus();
									}
								}
								
							});
							
							$("#" + opts.name + "_year").blur(function(){
								$this.focus();
							});
							
							$("#" + opts.name + "_month").blur(function(){
								$this.focus();
							});
							
							
							datepicker.mouseover(function(){$this.attr("idname", "mouseover");});
							datepicker.mouseout(function(){$this.attr("idname", "");});
							jQuery("span.ToDay,div.ToData,div.ToDayS", datepicker).click(function () {closeIt($this, datepicker, new Date()); });
							//jQuery("span.close", datepicker).click(function () { closeIt($this, datepicker); });
							jQuery("select[name=month]", datepicker).get(0).selectedIndex = chosendate.getMonth();
							jQuery("select[name=year]", datepicker).get(0).selectedIndex = Math.max(0, chosendate.getFullYear() - opts.startyear);
							loadMonth(null, $this, datepicker, chosendate, tip);
						}
						$(".ToDay").prop("innerText",jQuery.fn.simpleDatepicker.formatOutput(new Date(), opts.UseZS));
						$(".ToData").prop("innerText",(new Date()).getDate());
						$(".ToDayS").prop("innerText",Xq[opts.Laguage*1][(new Date()).getDay()*1]);
						if(ISOPENHUILI){
							GLtoHLyear = jQuery("select[name=year]", datepicker).val()*1;
							/*GLtoHLyear = (new Date()).getYear();
							if(navigator.userAgent.indexOf("Safari")>=0 && navigator.userAgent.toLowerCase().indexOf("version") >= 0)//$.browser.safari
							{
								GLtoHLyear += 1900;
							}*/
							GLtoHLmonth = (new Date()).getMonth()*1+1;
							GLtoHLday = (new Date()).getDate();
							MiladiToShamsi(GLtoHLmonth*1,GLtoHLday*1,GLtoHLyear*1);
							if (jQuery.fn.simpleDatepicker.TimeType == 0){
									$(".ToDayHuili").prop("innerText",GLtoHLmonth+"/"+GLtoHLday+"/"+GLtoHLyear);
								}else if(jQuery.fn.simpleDatepicker.TimeType == 1){
									$(".ToDayHuili").prop("innerText",GLtoHLyear+"-"+GLtoHLmonth+"-"+GLtoHLday);
								}else if(jQuery.fn.simpleDatepicker.TimeType == 2){
									$(".ToDayHuili").prop("innerText",GLtoHLday+"/"+GLtoHLmonth+"/"+GLtoHLyear);
								}
						}
					}
					
				});
			}

        });

    };

	jQuery.fn.simpleDatepicker.formatOutput = function (dateObj, type) {
		if (typeof type != 'undefined' && type) {
			if (jQuery.fn.simpleDatepicker.TimeType == 0){
				return ((dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear());	
			}else if (jQuery.fn.simpleDatepicker.TimeType == 1){
				return (dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate());	
			}else if (jQuery.fn.simpleDatepicker.TimeType == 2){
				return (dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getFullYear());
			}
		}
		return (dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate());
	};
	
	jQuery.fn.simpleDatepicker.formatOutputHL = function (dateObj, type) {
		if(ISOPENHUILI){
			GLtoHLyear = dateObj.getFullYear();
			GLtoHLmonth = dateObj.getMonth()+1;
			GLtoHLday = dateObj.getDate();
			MiladiToShamsi(GLtoHLmonth*1,GLtoHLday*1,GLtoHLyear*1);
			dateObj = new Date(GLtoHLyear,GLtoHLmonth-1,GLtoHLday);
		}
		if (typeof type != 'undefined' && type) {
			if (jQuery.fn.simpleDatepicker.TimeType == 0){
				return ((dateObj.getMonth()*1+1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear());	
			}else if (jQuery.fn.simpleDatepicker.TimeType == 1){
				return (dateObj.getFullYear() + "-" + (dateObj.getMonth()*1+1) + "-" + dateObj.getDate());	
			}else if (jQuery.fn.simpleDatepicker.TimeType == 2){
				return (dateObj.getDate() + "/" + (dateObj.getMonth()*1+1) + "/" + dateObj.getFullYear());
			}
		}
		return (dateObj.getFullYear() + "-" + (dateObj.getMonth()*1+1) + "-" + dateObj.getDate());
	};
	
	jQuery.fn.simpleDatepicker.ShowInputTip = function (Tip, Tiptext, top, left) {
		jQuery(Tip).find("p").html(Tiptext);
		jQuery(Tip).slideDown("quit").css("left", left).css("top", top);
	};
	
	jQuery.fn.simpleDatepicker.TimeType = 0;
	
	jQuery.fn.simpleDatepicker.defaults = {
		chosendate : today,		
		startdate : today.getFullYear(), 
		enddate : today.getFullYear(),
		name: "calendar",
		nIframe:"nIframe",
		type: 0,
		x : 0,
		y : 0,
		tip: null,
		CallBack: null,
		Laguage: "CHS",
		UseZS:false
	};
	
   	function MiladiIsLeap(miladiYear)
	{
		if(((miladiYear % 100)!= 0 && (miladiYear % 4) == 0) || ((miladiYear % 100)== 0 && (miladiYear % 400) == 0))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

/**********************************************************
函数名称：MiladiToShamsi
函数说明：转换公历为波斯历
传入参数：miladiDate:需要进行转换的公历日期值
返回：转换后的日历值
***********************************************************/ 
	function MiladiToShamsi(Month,Day,Year)//公历向回历转换
	{
		var iMiladiMonth = Month;
		var iMiladiDay   = Day;
		var iMiladiYear  = Year;

		var shamsiDay, shamsiMonth, shamsiYear; 
		var dayCount,farvardinDayDiff,deyDayDiff ; 
		var sumDayMiladiMonth = [0,31,59,90,120,151,181,212,243,273,304,334];
		var sumDayMiladiMonthLeap= [0,31,60,91,121,152,182,213,244,274,305,335];
		//SHAMSIDATE shamsidate;
		farvardinDayDiff=79;
		if (MiladiIsLeap(iMiladiYear))	{
			dayCount = sumDayMiladiMonthLeap[iMiladiMonth-1] + iMiladiDay;
		}else{ 
			dayCount = sumDayMiladiMonth[iMiladiMonth-1] + iMiladiDay;
		}
 
		if((MiladiIsLeap(iMiladiYear - 1))){
			deyDayDiff = 11;
		}else{
			deyDayDiff = 10;
		}
		if (dayCount > farvardinDayDiff) { 
			dayCount = dayCount - farvardinDayDiff; 
			if (dayCount <= 186){ 
				switch (dayCount%31) { 
				case 0: 
					shamsiMonth = dayCount / 31;
					shamsiDay = 31;
					break;
				default:
					shamsiMonth = (dayCount / 31) + 1; 
					shamsiDay = (dayCount%31);
					break;
				}
				shamsiYear = iMiladiYear - 621;
			}else{
		    	dayCount = dayCount - 186;   
		    	switch (dayCount%30){
			    	case 0:    
						shamsiMonth = (dayCount / 30) + 6;
						shamsiDay = 30;
						break;
					default:            
						shamsiMonth = (dayCount / 30) + 7;
						shamsiDay = (dayCount%30);    
						break;
	    		}
	   			shamsiYear = iMiladiYear - 621;
	    	}    
		}else {            
			dayCount = dayCount + deyDayDiff;
			switch (dayCount%30){
			   case 0 :
				   shamsiMonth = (dayCount / 30) + 9; 
				   shamsiDay = 30;
				   break;
			   default:
				   shamsiMonth = (dayCount / 30) + 10;           
				   shamsiDay = (dayCount%30);
				   break;
			}
			shamsiYear = iMiladiYear - 622;            
    	}
		shamsiYear = parseInt(shamsiYear);
		shamsiMonth = parseInt(shamsiMonth);
		shamsiDay = parseInt(shamsiDay);
		GLtoHLyear = shamsiYear;
		GLtoHLmonth = shamsiMonth;
		GLtoHLday = shamsiDay;
		return 1 ;
	} 
 
})(jQuery);

