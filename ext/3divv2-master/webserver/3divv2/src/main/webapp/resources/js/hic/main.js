	$(document).mouseup(function (e) {
		var container = $("#more_img");
		if (!container.is(e.target) && container.has(e.target).length === 0){
			$("#more_contents").attr("class","hidden");
		}	
	});
	
var selectedCharacteristicItem = [];

$(document).ready(function () {
	$("#sliderexpand").hide();
	$("#resolution").hide();

	open_accordion_section();
//	characteristicSearchInit();
	characteristicSearchInit();
	
	$('#direct_input_frame').css('display', 'none');

	$(".menu-item").click(function(){
//		$('.menu-item').removeClass('selected-menu');
//		$(this).addClass('selected-menu');
	});
	
	$("#main_logo").click(function(){
//		$('.menu-item').removeClass('selected-menu');
	});
	
	$(".hic_tab").click(function(){
		if( $(this).attr("id") === 'multiple_samples' ){
			$("#graph").empty();
			$("#tad-th").removeClass("hidden");
			
			$("#bait-selector").removeClass("col-lg-6");
			$("#bait-selector").addClass("col-lg-4");
			
			$("#boundary-selector").removeClass("col-lg-6");
			$("#boundary-selector").addClass("col-lg-4");
			
			$("#tad-selector").removeClass("hidden");
			
		}else {
			$("#graph").empty();
			$("#tad-th").addClass("hidden");
			
			$("#bait-selector").addClass("col-lg-6");
			$("#bait-selector").removeClass("col-lg-4");
			
			$("#boundary-selector").addClass("col-lg-6");
			$("#boundary-selector").removeClass("col-lg-4");
			
			$("#tad-selector").addClass("hidden");
		}
		
		initFormControls();
		
		$("#input").val('');
		$("#chooseInfo > tbody").empty();
	})

	
	$("#upload_data_run").click(function(){
		$("#upload_dialog").dialog({
			resizable: false,
			height: "auto",
			width: 600,
			modal: true,
			buttons:{
				"Close":function() {
					$(this).dialog('close');
					$("#more_contents").attr("class","hidden");
				}
			}
		});
	});
	
	$("#upload_user_file").click(function(){
		$("#upload_user_file_dialog").dialog({
			resizable: false,
			height: "auto",
			width: 600,
			modal: true,
			buttons:{
				"Close":function() {
					$(this).dialog('close');
					$("#more_contents").attr("class","hidden");
				}
			}
		});
	});
	
	$("#more_img").click(function(){
		if($("#more_contents").attr('class')=='hidden')
			$("#more_contents").attr("class","show");
		else
			$("#more_contents").attr("class","hidden");
	});

	$("#save_data_run").click(function(){
		$("#more_contents").attr("class","hidden");
		
		if( $(".nav-tabs > .active").attr("id") === "multiple_samples" ) {
			var samples = [];
			var dataOrder = 0;
			
			var sel_tad = $("#sel_tad").val();
//			console.log(sel_tad);
			
			$("#chooseInfo tr.appendTr").each(function(){
				var sampleId = $(this).find('td:eq(1)').text();
				var bait = $(this).find('td:eq(3)').text();
				var sampleName = $(this).find('td:eq(2)').text();
				
				var bait_split = bait.split(":");
				var bait_correction = parseInt(bait_split[1] / 1000) * 1000;
				bait = bait_split[0] + ":" + bait_correction;

				samples.push( dataOrder + ";" + sampleId + ";" + sampleName + ";" + bait + ";" + sel_tad);
				dataOrder++;
			});
			
			var boundary_range = $("#boundary_range").val();
			var window_size = $("#window_size").val();
			var window_size2 = $("#window_size2").val();

			if( boundary_range == 1 ){
				var direct_input = $("#direct_input").val();
				var inputSplit = direct_input.split('-');

				var a = inputSplit[0].split(':');
				var startPt = a[1];
				var endPt = inputSplit[1];

//				boundary_range =  (endPt - startPt) / 2 ;
			}

			$.ajax({
				type: 'post',
				url: "saveSetting",
				dataType: "json",
				data: {loci:samples.join("&"), boundary_range:boundary_range, window_size:window_size, window_size2:window_size2, startPt : startPt, endPt : endPt
					, tab:$(".nav-tabs > .active").attr("id")},
				success: function(data) {
					var createDownloadFile = data;
					var url = "downloads?name="+createDownloadFile;
					$(location).attr('href', url);
				}
			});
			
		} else if( $(".nav-tabs > .active").attr("id") === "search_samples" ){
			var samples = [];
			var dataOrder = 0;
			$("#chooseInfo tr.appendTr").each(function(){
				var sampleId = $(this).find('td:eq(1)').text();
				var bait = $(this).find('td:eq(3)').text();
				var sampleName = $(this).find('td:eq(2)').text();
				
				var bait_split = bait.split(":");
				var bait_correction = parseInt(bait_split[1] / 1000) * 1000;
				bait = bait_split[0] + ":" + bait_correction;

				samples.push( dataOrder + ";" + sampleId + ";" + sampleName + ";" + bait );
				dataOrder++;
			});
			
			var boundary_range = $("#boundary_range").val();
			var window_size = $("#window_size").val();
			var window_size2 = $("#window_size2").val();
			
			if( boundary_range == 1 ){
				var direct_input = $("#direct_input").val();
				var inputSplit = direct_input.split('-');

				var a = inputSplit[0].split(':');
				var startPt = a[1];
				var endPt = inputSplit[1];

//				boundary_range =  (endPt - startPt) / 2 ;
			}
			
			$.ajax({
				type: 'post',
				url: "saveSetting",
				dataType: "json",
				data: {loci:samples.join("&"), boundary_range:boundary_range, window_size:window_size, window_size2:window_size2, startPt : startPt, endPt : endPt
					, tab:$(".nav-tabs > .active").attr("id")},
				success: function(data) {
					var createDownloadFile = data;
					var url = "downloads?name="+createDownloadFile;
					$(location).attr('href', url);
				}
			});
		} else {
			var samples = [];

			var basicBait = "";
			var flag = false;
			var dataOrder = 0;
			$("#chooseInfo tr.appendTr").each(function(){
				var sampleId = $(this).find('td:eq(1)').text();
				var bait = $(this).find('td:eq(3)').text();
				var sampleName = $(this).find('td:eq(2)').text();
				
				var bait_split = bait.split(":");
				var bait_correction = parseInt(bait_split[1] / 1000) * 1000;
				bait = bait_split[0] + ":" + bait_correction;

				if( basicBait === '' ) basicBait = bait;
				else {
					if( bait !== basicBait ) {
						flag = true;
						return;
					}
				}

				samples.push( dataOrder + ";" + sampleId + ";" + sampleName + ";" + bait );
				dataOrder++;
			});
			
			var boundary_range = $("#boundary_range").val();
			var window_size = $("#window_size").val();
			var window_size2 = $("#window_size2").val();
			
			if( boundary_range == 1 ){
				var direct_input = $("#direct_input").val();
				var inputSplit = direct_input.split('-');

				var a = inputSplit[0].split(':');
				var startPt = a[1];
				var endPt = inputSplit[1];

//				boundary_range =  (endPt - startPt) / 2 ;
			}
			
			$.ajax({
				type: 'post',
				url: "saveSetting",
				dataType: "json",
				data: {loci1:samples[0], loci2:samples[1], boundary_range:boundary_range, window_size:window_size, window_size2:window_size2, startPt : startPt, endPt : endPt
					, heatmap_windowsize:heatmap_resolution, tab:$(".nav-tabs > .active").attr("id")},
				success: function(data) {
					var createDownloadFile = data;
					var url = "downloads?name="+createDownloadFile;
					$(location).attr('href', url);
				}
			});
		}
	});
	
	$("#example_run").click(function(){
//		console.log( $(".nav-tabs > .active").attr("id") );
		if($(".nav-tabs > .active").attr("id") === 'multiple_samples'){
			$(".appendTr").remove();
			$("#input").val('');
			
//			$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>2</td><td>H1 ESC replicate 1, HindIII-GSM1267196</td><td>chr22:27141000</td></tr>");
			$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>267</td><td>H1_Mesenchymal_SCs</td><td>chr10:4000000</td><td>DI (window size = 2Mb)</td></tr>");
			$("#input").val('chr10:4000000');
			
//			$("#btn_run").trigger('click');
			$("#btn_run").click();
		}
		else if($(".nav-tabs > .active").attr("id") === 'pairwise_samples'){
			$(".appendTr").remove();
			$("#input").val('');
			
//			$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>2</td><td>H1 ESC replicate 1, HindIII-GSM1267196</td><td>chr22:27141000</td></tr>");
//			$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>4</td><td> H1 ESC derived mesendoderm replicate 1 , HindIII-GSM1267198</td><td>chr22:27141000</td></tr>");
			
			$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>266</td><td>H1_ESCs</td><td>chr14:56805667</td></tr>");
			$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>267</td><td>H1_Mesenchymal_SCs</td><td>chr14:56805667</td></tr>");
			$("#input").val('chr14:56805667');
			
//			$("#btn_run").trigger('click');
			$("#btn_run").click();
		}
		else{
			$(".appendTr").remove();
			$("#input").val('');
			
			$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>267</td><td>H1_Mesenchymal_SCs</td><td>chr10:4000000</td></tr>");
			$("#input").val('chr10:4000000');
			
//			$("#btn_run").trigger('click');
			$("#btn_run").click();
		}
	});

	$("#submitbtn").click(function(){
		var bait = $("#input").val();

		if( isEmpty(bait) ) {
			alert("You have to input a gene symbol or loci in the bait field.");
			$("#input").focus();
		}
		else
			checkParam(bait);
	});

	$("#samplebtn").on("click", function(){	
		if( $(this).hasClass('expaned') ) {
			$(this).removeClass("expaned");
			$("#sliderexpand").hide();
			
			$('.chooseMatrix').css('overflow', 'hidden');
			$('.chooseMatrix').css('height', '');
		}else {
			$(this).addClass("expaned");
			$("#sliderexpand").show();
			
//			 style="overflow: scroll;"
			$('.chooseMatrix').css('overflow', 'scroll');
			$('.chooseMatrix').css('overflow-X', 'hidden');
			$('.chooseMatrix').css('height', $('#sliderdefault').children().children().height() * 10);
		}
	});

	$("#chk_samples_all").click(function(){
		var isChecked = $(this).is(":checked");
		
		if( isChecked ) {
			$("input[type='checkbox'].sample-chk").prop("checked", true);
		}else {
			$("input[type='checkbox'].sample-chk").prop("checked", false);
		}
	});
	
	$("#remove_samples").click(function(){
		$("input[type='checkbox'].sample-chk").each(function(){
			if( $(this).is(":checked") ) {
				$(this).parent().parent().remove();
			}
		});
	});
	
	$("#input").autocomplete({
        source : function( request, response ) {
            $.ajax({
                   type: 'post',
                   url: "autocomplete",
                   dataType: "json",
                   data: { value : request.term },
                   success: function(data) {

                	   // 30개 이상의 SNP id가 나올 경우를 대비해
                	   // 최대 30까지만 조회가 되며
                	   if( data.length > 30 ) {
                		   data = data.slice(0, 29);
                		   data.push( "... more" );
                	   }
                       //서버에서 json 데이터 response 후 목록에 뿌려주기 위함
                       response( 
                           $.map(data, function(item) {
                               return {
                                   label: item,
                                   value: item
                               };
                           })
                       );
                   }
              });
           },
       //조회를 위한 최소글자수
       minLength: 2,
       select: function( event, ui ) {
           // 만약 검색리스트에서 선택하였을때 선택한 데이터에 의한 이벤트발생
       }
   });
	
	$('.accordion-section-title').click(function(e) {
	    // Grab current anchor value
	    var currentAttrValue = $(this).attr('href');

	    if($(e.target).is('.active')) {	// 닫기
	        close_accordion_section();
	    }else {							// 열기
	        close_accordion_section();

	        // Add active class to section title
	        $(this).addClass('active');
	        // Open up the hidden content panel
	        $('.accordion ' + currentAttrValue).slideDown(300).addClass('open');
	    }
	    e.preventDefault();
	});
	
/* 	  $( function() {
		    $( "#heatmap_legend" ).slider({
		    	range:""
		    });
		  } ); */
	
//	minseo
//	var sampleList = JSON.parse( $("#sampleList").val() );
//	let sampleMap = new Map();
//	
//	for( var i=0; i<sampleList.length; i++ ){
//		sampleMap.set(sampleList[i].celline_name, sampleList[i] );
//	}
	
	$('#chooseSamplesBySearchSelectBox').multipleSelect({
		placeholder: "Here is the placeholder",
		filter: true,
		selectAll: false,
		minimumCountSelected: 8,
		// custom filter function
		customFilter:function customFilter(label, text) {
			// originalLabel, originalText
			
			if( ( text.includes(" and ") ) && ( text.includes(" or ") ) ) {
//				console.log( "and" );
				var str = text.split(" or ");
				
				for( var i=0; i<str.length; i++ ) {
					var retStr = new Array;
					if( str[i].includes(" and ") ) {
						var tmp = str[i].split(" and ");
						for( var j=0; j<tmp.length; j++ ) {
							retStr.push( tmp[j] ); 
						}
					} else {
						retStr.push( str[i] );
					}
					
					var retBool = false;
					for( var k=0; k<retStr.length; k++ ) {
						var bool = false;
						if( label.includes( retStr[k] ) ) {
							bool = true;
							retBool = true;
						} 
						
						if( bool == false ) {
							retBool = false;
							break;
						}
					}
					
					if( retBool == true ) {
						return true;
					}
				}
				
				"blood or ne and 25";
				"ne and cell and 7 or a";
				
				return false;
			} else if( ( text.includes(" and ") ) || ( text.includes(" or ") ) ) {
//				console.log( "or" );
				if( text.includes(" and ") ) {
					var str = text.split(" and ");
					
					for( var i=0; i<str.length; i++ ) {
						var bool = false;
						if( label.includes( str[i] ) ) {
							bool = true;
						} 
						
						if( bool == false ){
							return label.includes(text);
						}
					}
					
					return true;
				} else if( text.includes(" or ") ) {
					var str = text.split(" or ");
					
					for( var i=0; i<str.length; i++ ) {
						if( label.includes( str[i] ) ) {
							return true;
						} 
					}
					
					return false;
				}
			} else {
//				console.log( "one" );
				return label.includes(text);
			}
			
//			return label.includes(text);
		},
	});

//	$("#text_hic_sample").autocomplete({
//		source: function( request, response ) {
//			$.ajax({
//				url: "get_autocomplete_hic_samples",
//				type: "POST",
//				dataType: "json",
//				data: { keyword : request.term },
//				success: function( data ) {
//					
//					var combobox = $("#sample_combobox");
//					combobox.empty();
//
//					for(var i=0; i<data.length; i++) {
//						combobox.append("<a class='dropdown-item'>" + data[i]+ "</a>")
//					}
//
//					response( $.map(data, function(obj, key) {
//						return {label : obj};
//					}) );
//				}
//			});
//		},
//		minLength: 1,
//		focus: function(event, ui) {
//			event.preventDefault();
//		}
//		,
//		select: function( event, ui ) {
//			return true;
//		}
//		
//	}).autocomplete( "instance" )._renderItem = function( ul, item ) {
//		return $( "<li>" )
//		.append("<div><input type='checkbox' name='sss'/>"+item.label+"</div>")
//		.appendTo( ul );
//	};

});

function isEmpty(val) {
	if(val == null || val == undefined || val == 'null' || val == 'undefined' || val == '' )	return true;
	
	return false;
}

function close_accordion_section() {
    $('.accordion .accordion-section-title').removeClass('active');
    $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
}

function open_accordion_section() {
    $('.accordion .accordion-section-title').addClass('active');
    $('.accordion .accordion-section-content').slideDown(300).addClass('open');
}

function isContainedSamples(pno, pbait, ptad) {
	var flag = false;
	$("#chooseInfo tr.appendTr").each(function(){
		var sampleId = $(this).find('td:eq(1)').text();
		var bait = $(this).find('td:eq(3)').text();
		var sampleName = $(this).find('td:eq(2)').text();
		var tad = $(this).find('td:eq(4)').text();

		if( pno===sampleId && pbait===bait && ptad===tad )	{
			alert(sampleName + " : This samples has already chosen");
			flag = true;
			return false;
		}
	});
	
	return flag;
}

function checkParam ( param ){
	
	if (!String.prototype.startsWith) {
	    String.prototype.startsWith = function(searchString, position){
	      position = position || 0;
	      return this.substr(position, searchString.length) === searchString;
	  };
	}
	if( param.startsWith('chr') && param.indexOf(":") ) {	
		var activeMyTab = $("#myTab .active").attr("id");
		var array = new Array();
		
		if( activeMyTab == "choose-by-all-tab" ) {
			$("input.sample-choose-chk[type='checkbox']:checked").each( function() {
				console.log( $(this).val() )
				array.push( $(this).val() );
			})
		} else if( activeMyTab == "choose-by-search-tab" ) {
			array = $('#chooseSamplesBySearchSelectBox').multipleSelect('getSelects');
		} else if( activeMyTab == "choose-by-tree-tab" ) {
//			console.log("RRRR");
			array.push( $("#inputSample").val() );
		}
		
		for( var i=0; i<array.length; i++ ) {
			var input = array[i];
			var split = input.split("&");
			var no = split[0];
			var sample = split[1];
			var tad = $("#sel_tad").val();

			if( isContainedSamples(no, $("#input").val(), tad) === false ) {
				if( $(".nav-tabs > .active").attr("id") === "multiple_samples" )
					$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>"+ no +"</td><td>"+sample+"</td><td>"+ $("#input").val() +"</td><td>"+ tad +"</td></tr>");
				else
					$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>"+ no +"</td><td>"+sample+"</td><td>"+ $("#input").val() +"</td></tr>");
				
				$("input[type='checkbox']").prop("checked", false);
				$('#chooseSamplesBySearchSelectBox').multipleSelect('uncheckAll');
			} else {
				return false;
			}
		}
		
//		$("input.sample-choose-chk[type='checkbox']:checked").each(function(){
//			var input = $(this).val();
//			var split = input.split("&");
//			var no = split[0];
//			var sample = split[1];
//			var tad = $("#sel_tad").val();
//
//			if( isContainedSamples(no, $("#input").val(), tad) === false ) {
//				if($(".nav-tabs > .active").attr("id") === "multiple_samples")
//					$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>"+ no +"</td><td>"+sample+"</td><td>"+ $("#input").val() +"</td><td>"+ tad +"</td></tr>");
//				else $("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>"+ no +"</td><td>"+sample+"</td><td>"+ $("#input").val() +"</td></tr>");
//				$("input[type='checkbox']").prop("checked",false);
//			} else {
//				return false;
//			}
//		});
		
	}else {;
		// gene symbol
		checkHowManyGenesAreThere( param );
	}
};

function checkHowManyGenesAreThere( param ) {
	$.ajax({
		type: 'post',
		url: 'get_gene_symbols',
		data: { symbol:param },
		dataType: 'json',
		success:function(data) {
			$('.gene-symbol-list').remove();
			
			if( data.length >= 1 ) {
				var content = $("#gene_list_dialog .dialog-content");
				for(var i in data ) {
					if(param.indexOf("rs")==0) {
						content.append(
							"<div class='gene-symbol-list'>"
							+ "<div class='gene-symbol-list-gene'>" + param + "</div>"
							+ "<div class='gene-symbol-list-chrom'>" + data[i].chrom + " : " + comma(data[i].txStart) + " ~ " + comma(data[i].txEnd) + "</div>"
							+ "<div class='gene-symbol-list-value'>" + data[i].chrom + ":" + data[i].txStart + "~" + data[i].txEnd + "</div>"
							+ "</div>"
						);
					} else {
						content.append(
							"<div class='gene-symbol-list'>"
							+ "<div class='gene-symbol-list-gene'>" + param + "</div>"
							+ "<div class='gene-symbol-list-chrom'>" + data[i].chrom + " : " + comma(data[i].txStart) + " ~ " + comma(data[i].txEnd) + " ( " + data[i].strand + " ) </div>"
							+ "<div class='gene-symbol-list-value'>" + data[i].chrom + ":" + data[i].txStart + "~" + data[i].txEnd + "(" + data[i].strand + "</div>"
							+ "</div>"
						);
					}
//					content.append("<div class='gene-symbol-list'><div class='gene-symbol-list-gene'>" + param + "</div><div class='gene-symbol-list-chrom'>" + data[i].chrom + " : " + comma(data[i].txStart) + " - " + comma(data[i].txEnd) + "</div><div class='gene-symbol-list-value' style='display:none'>"+data[i].chrom + ":" + data[i].txStart +"-" + data[i].txEnd +"</div></div>");
				}
	
				var geneDialog = $("#gene_list_dialog").dialog({
					resizable: false,
					height: "auto",
					width: 600,
					modal: true,
					buttons:{
						"Close":function() {
							$(this).dialog('close');
						}
					}
				});

				$(".gene-symbol-list").click(function(){
					var valObj = $(this).find(".gene-symbol-list-value");

					var breakedItems = valObj.text();
					
					if(breakedItems.split("(")[1] == "+") {
						breakedItems = breakedItems.split("~")[0];
					} else {
						var chr = breakedItems.split(":")[0];
						var bait = breakedItems.split("~")[1];
						bait = bait.split("(")[0];
						
						breakedItems = chr + ":" + bait;
					}
					
					var activeMyTab = $("#myTab .active").attr("id");
					var array = new Array();
					
					if( activeMyTab == "choose-by-all-tab" ) {
						$("input.sample-choose-chk[type='checkbox']:checked").each( function() {
							array.push( $(this).val() );
						})
					} else if( activeMyTab == "choose-by-search-tab" ) {
						array = $('#chooseSamplesBySearchSelectBox').multipleSelect('getSelects');
					} else if( activeMyTab == "choose-by-tree-tab" ) {
						array.push( $("#inputSample").val() );
					}
					
					for( var i=0; i<array.length; i++ ) {
						var input = array[i];
						var split = input.split("&");
						var no = split[0];
						var sample = split[1];
						var tad = $("#sel_tad").val();

						if( isContainedSamples(no, breakedItems) === false ) {
							if($(".nav-tabs > .active").attr("id") === "multiple_samples")
								$("#chooseInfo").append("<tr class='appendTr' style=' background-color:#fff;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>"+ no +"</td><td>"+sample+"</td><td>"+ breakedItems +"</td><td>"+ tad +"</td></tr>");
							else
								$("#chooseInfo").append("<tr class='appendTr' style=' background-color:#fff;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>"+ no +"</td><td>"+sample+"</td><td>"+ breakedItems +"</td></tr>");
							
							$("input[type='checkbox']").prop("checked",false);
							$('#chooseSamplesBySearchSelectBox').multipleSelect('uncheckAll');
						} else {
							return false;
						}
					}
					
//					$("input.sample-choose-chk[type='checkbox']:checked").each(function(){
//						var input = $(this).val();
//						var split = input.split("&");
//						var no = split[0];
//						var sample = split[1];
//						var tad = $("#sel_tad").val();
//						
////						console.log("input : " + input + " / " + "split : " + split + " / " + "no : " + no + " / " + "sample : " + sample);
//
//						if( isContainedSamples(no, breakedItems) === false ){
//							if($(".nav-tabs > .active").attr("id") === "multiple_samples")
//								$("#chooseInfo").append("<tr class='appendTr' style=' background-color:#fff;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>"+ no +"</td><td>"+sample+"</td><td>"+ breakedItems +"</td><td>"+ tad +"</td></tr>");
//							else
//								$("#chooseInfo").append("<tr class='appendTr' style=' background-color:#fff;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>"+ no +"</td><td>"+sample+"</td><td>"+ breakedItems +"</td></tr>");
//							$("input[type='checkbox']").prop("checked",false);
//						} else
//							return false;
//					});
					
					geneDialog.dialog('close');
				});
			}else {
				alert("We can not find any result : " + param);
			}
		}
	});
}

function getSelectText() {
	if($('#boundary_range option:selected').val()=='1') {
		$('#direct_input_frame').css('display', 'inline');
		$('#direct_input').css('width', '200');
		
//		$("#direct_input").focus(function(){
//			$(this).val('');
//		});

		$("#direct_input").blur(function(){
			if( $(this).val() === '' ) {
				$(this).val('chr22:26641000-27641000');
			};
		});
	} else
		$('#direct_input_frame').css('display', 'none');
}



//Below are the function that handle actual exporting:
//getSVGString (svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString( svgNode ) {
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	var cssStyleText = getCSSStyles( svgNode );
	appendCSS( cssStyleText, svgNode )

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=') // Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href') // Safari NS namespace fix

	return svgString;

	function getCSSStyles( parentElement ) {
		var selectorTextArr = [];

		// Add Parent element Id and Classes to the list
		selectorTextArr.push( '#'+parentElement.id );
		for (var c = 0; c < parentElement.classList.length; c++)
				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
					selectorTextArr.push( '.'+parentElement.classList[c] );

		// Add Children element Ids and Classes to the list
		var nodes = parentElement.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; i++) {
			var id = nodes[i].id;
			if ( !contains('#'+id, selectorTextArr) )
				selectorTextArr.push( '#'+id );

			var classes = nodes[i].classList;
			for (var c = 0; c < classes.length; c++)
				if ( !contains('.'+classes[c], selectorTextArr) )
					selectorTextArr.push( '.'+classes[c] );
		}

		// Extract CSS Rules
		var extractedCSSText = "";
		for (var i = 0; i < document.styleSheets.length; i++) {
			var s = document.styleSheets[i];
			
			try {
			    if(!s.cssRules) continue;
			} catch( e ) {
		    		if(e.name !== 'SecurityError') throw e; // for Firefox
		    		continue;
		    	}

			var cssRules = s.cssRules;
			for (var r = 0; r < cssRules.length; r++) {
				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
					extractedCSSText += cssRules[r].cssText;
			}
		}
		

		return extractedCSSText

		function contains(str,arr) {
			return arr.indexOf( str ) === -1 ? false : true;
		}

	}

	function appendCSS( cssText, element ) {
		var styleElement = document.createElement("style");
		styleElement.setAttribute("type","text/css"); 
		styleElement.innerHTML = cssText;
		var refNode = element.hasChildNodes() ? element.children[0] : null;
		element.insertBefore( styleElement, refNode );
	}
}

function GetDrawingAsString(canvasId) {
	var canvas = document.getElementById(canvasId);
//	var context = canvas.getContext('2d');
	
	//serialize your SVG
//	var mySerializedSVG = context.getSerializedSvg(); //true here, if you need to convert named to numbered entities.
//	
//	return mySerializedSVG;
	
	var canvasSVGContext = new CanvasSVG.Deferred();
	canvasSVGContext.wrapCanvas(canvas);
	var context = canvas.getContext('2d');
	
	var mytoSVG = context.getSVG();
	return mytoSVG;
	
//	let pngUrl = canvas.toDataURL(); // PNG is the default
//	// or as jpeg for eg
//	// var jpegUrl = canvas.toDataURL("image/jpeg");
//	return pngUrl;
}

function ReuseCanvasString(url, width, height, callback) {
	let img = new Image();
	img.onload = function() {
		// Note: here img.naturalHeight & img.naturalWidth will be your original canvas size
		var canvas = document.createElement("canvas");
		let context = canvas.getContext('2d');
		
		context.clearRect ( 0, 0, width, height );
		context.drawImage(img, 0, 0, width, height);
		
		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
		});
	}
	img.src = url;
}


/* Canvas Donwload */
function canvasDownload(canvas, filename) {
	/// create an "off-screen" anchor tag
	var lnk = document.createElement('a'), e;
	/// the key here is to set the download attribute of the a tag
	lnk.download = filename;
	
	/// convert canvas content to data-uri for link. When download
	/// attribute is set the content pointed to by link will be
	/// pushed as "download" in HTML5 capable browsers
	lnk.href = canvas.toDataURL("image/png;base64");
	
	/// create a "fake" click-event to trigger the download
	if (document.createEvent) {
		e = document.createEvent("MouseEvents");
		e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		
		lnk.dispatchEvent(e);
	} else if (lnk.fireEvent) {
		lnk.fireEvent("onclick");
	}
}

function svgString2Image( svgHeatmapString, svgString, width, height, format, callback, heatmapHeight, graphHeight ) {

	var format = format ? format : 'png';

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( svgString ); // Convert SVG string to data URL
	var imgsrc_heatmap = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgHeatmapString ) ) );
	
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	
//	height = 1363.98388671875;
	
	canvas.width = width;
	canvas.height = height;

	var image_heatmap = new Image();
	var image = new Image();
	
	(image).onload = function() {
//		(image_heatmap).onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image_heatmap, 0, 0, width, height);
		context.drawImage(image, 0, heatmapHeight, width, height);

		canvas.toBlob( function(blob) {
			if( format === 'png' ) {
				var filesize = Math.round( blob.length/1024 ) + ' KB';
				if ( callback ) callback( blob, filesize );
			} else if( format === 'pdf' ) {
				var imgData = canvas.toDataURL('image/png', wid = canvas.width, hgt = canvas.height);
				var hratio = hgt/wid;
				
				var pdf = new jsPDF('p', 'px', [height, width]);
				
				var imgWidth = pdf.internal.pageSize.width;
				var imgHeight = imgWidth * hratio;
				
				pdf.addImage(imgData, 10, 20, imgWidth - 20, imgHeight);
				pdf.save('3div_image.pdf');
			}
		});
	};
	
	image_heatmap.src = imgsrc_heatmap;
	image.src = imgsrc;
}

function characteristicSearchInit(){
	
	$.ajax({
		type: 'post',
		url: "get_characteristic",
		data:{ 'colName' : 'type'},
		dataType: "json",
		success: function(data) {
			for( var i=0; i<data.length; i++ ){
				$("#inputType").append("<option class='sample-select-opt' value='"+ data[i].type +"'>"+ data[i].type +" ("+ data[i].cnt +")" +"</option>");
			}
		}
	});
	
	$("#inputType").change(function(){
		$("#inputName").val("");
		$("#inputName > option.sample-select-opt").remove();
		$("#inputProperty").val("");
		$("#inputProperty > option.sample-select-opt").remove();
		$("#inputSample").val("");
		$("#inputSample > option.sample-select-opt").remove();
		
		$.ajax({
			type: 'post',
			url: "get_characteristic",
			data:{ 'type': $("#inputType").val(), 'colName' : 'name'},
			dataType: "json",
			success: function(data) {
				for( var i=0; i<data.length; i++ ){
					$("#inputName").append("<option class='sample-select-opt' value='"+ data[i].name +"'>"+ data[i].name +" ("+ data[i].cnt +")"+"</option>");
				}
			}
		});
	})
	
	$("#inputName").change(function(){
		$("#inputProperty").val("");
		$("#inputProperty > option.sample-select-opt").remove();
		$("#inputSample").val("");
		$("#inputSample > option.sample-select-opt").remove();
		
		$.ajax({
			type: 'post',
			url: "get_characteristic",
			data:{ 'type': $("#inputType").val(), 'name': $("#inputName").val(), 'colName' : 'property'},
			dataType: "json",
			success: function(data) {
				for( var i=0; i<data.length; i++ ){
					$("#inputProperty").append("<option class='sample-select-opt' value='"+ data[i].property +"'>"+ data[i].property +" ("+ data[i].cnt +")" +"</option>");
				}
			}
		});
	})
	
	$("#inputProperty").change(function(){
		$("#inputSample").val("");
		$("#inputSample > option.sample-select-opt").remove();
		
		$.ajax({
			type: 'post',
			url: "get_characteristic",
			data:{ 'type': $("#inputType").val(), 'name': $("#inputName").val(), 'property': $("#inputProperty").val(), 'colName' : 'sample_id'},
			dataType: "json",
			success: function(data) {
				for( var i=0; i<data.length; i++ ){
					var isSelected = '';
					if( i == 0 ) isSelected = 'selected';
					
					$("#inputSample").append("<option class='sample-select-opt' value='" + data[i].id + "&" + data[i].sample_id + "'>" + data[i].sample_id + "</option>");
					
					if( isSelected === 'selected' ) {
						if( isEmpty($("#inputSample").val()) ) {
							$('#inputSample option:eq(1)').prop('selected', true);
						}
					}
				}
			}
		});
	})
	
//	$.ajax({
//		type: 'post',
//		url: "get_characteristic",
//		data:{ 'colName' : 'type'},
//		dataType: "json",
//		success: function(data) {
//			console.log(data);
//			for( var i=0; i<data.length; i++ ){
//				$("#inputType").append("<option value='"+ data[i].type +"'>"+ data[i].type +"</option>");
//			}
//		}
//	});
}
function setCharTable( col, row, dataMap ){

	var appendFrame = "chooseCharContents";
	$("#"+appendFrame).empty();
	
	var thead = "";
	for( var i=0; i<col.length; i++){
		 thead += "<th>" + col[i] + "</th>";
	}
	thead += "<th></th>";
	
	$("#"+appendFrame).append($("<table id='characteristic-table'>").append($("<thead>").append($("<tr>").append(thead))));
	
	
	$("#"+appendFrame+" > table").append($("<tbody>"));
	
	var contents = "";
	for( var i=0; i<row.length; i++ ){
		contents += "<tr>";
		for( var j=0; j<col.length; j++ ){
			var cnt = "<span class='na'>n/a</span>";
			if( dataMap[ col[j] +"||" + row[i] ] )
				cnt =  "<span class='cnt-num'>"+dataMap[ col[j] +"||" + row[i] ].cnt +"</span>";
			
			contents += "<td>"+ cnt +"</td>";
		}
		
		contents += "<th><i class='fa fa-plus-square-o pr-1' aria-hidden='true'></i>"+ row[i] +"</th>";
		
		contents += "</tr>";
	}
	
	$("#"+appendFrame+" > table > tbody").append(contents);
	
	expandTableChar( appendFrame, col, dataMap );
	
}

function expandTableChar( appendFrame, col, dataMap ){
	
	$("#"+appendFrame +" > table > tbody > tr > td ").off().click(function(e){
		if( $(this).text() != 'n/a' ){
			var obj = $(this);
			var tr = $(this).parent();
			var child = tr.children();
			
			var type = $("#"+appendFrame +" > table > thead > tr > th:eq("+ this.cellIndex +") ").text();
			var name = "";
			var proper = "";
			
			if( tr.hasClass("prop-tr") ){
				var name_tr = $(this).closest("tr");
				var index = name_tr.index();
				
				while( name_tr.hasClass("prop-tr") ){
					name_tr = $("#"+appendFrame +" > table > tbody > tr:eq("+ (index-1) +")");
					
					index--;
				}
				
				name = name_tr.text();
				proper = $(child[child.length - 1]).text();
				
			}else{
				name = $(child[child.length - 1]).text();
				
			}
			
			$.ajax({
				type: 'post',
				url: "get_characteristic_sample_list",
				data:{ 'type' : type, 'name' : name, 'property' : proper },
				dataType: "json",
				success: function(data) {
					$("#sampleListFrame").empty();
										
					for( var n=0; n<data.length; n++ ){
						$("#sampleListFrame").append( "<div class='sample-info'>"+ data[n].sample_name +"</div>" );
					}
					
					$("#sampleListTotalFrame").css("top", e.clientY +"px").css("left", e.clientX+"px");
					$("#sampleListTotalFrame").show();
					
					$(".sample-info").off().click(function(){
						if( $(this).hasClass("selected") ){
							$(this).removeClass("selected");
						}else{
							$(this).addClass("selected");
						}
						
					})
					
					$("#char-add-btn").off().click(function(){
						var selectedItem = $(".sample-info.selected");
						
						
//						$('#chooseCharModal').modal('hide');
						
						for( var j=0; j<selectedItem.length; j++ ){
//							var endOperator = ", ";
							if( j == selectedItem.length - 1 ){
//								endOperator = "";
							}
//							var startOperator = ", ";
							if( selectedCharacteristicItem.length == 0 ){
//								startOperator = "";
							}
							$("#selectedItems").append( $(selectedItem[j]).text() ); 
							selectedCharacteristicItem.push( $(selectedItem[j]).text() );
						}
//						console.log( selectedCharacteristicItem );
//						alert(selected);
					})
				}
				
			});
			
		}
	})
	
	$("#"+appendFrame +" > table > tbody > tr > th ").off().click(function(){
		var tr = $(this).parent();
		var nameTerm = $(this).text();
		
		if( $(this).children().hasClass('fa-plus-square-o') ){
		
			$.ajax({
				type: 'post',
				url: "get_characteristic_property",
				data:{ 'name' : nameTerm },
				dataType: "json",
				success: function(data) {
					
					var property = data.property;
					var propertyMap = data.typePropertyInfo;
					
					tr.empty();
					tr.append("<td class='expand-tr' colspan='"+ col.length +"'></td>");
					tr.append("<th><i class='fa fa-minus-square-o pr-1' aria-hidden='true'></i>"+ nameTerm +"</th>");
					
					var contents = "";
					for( var i=0; i<property.length; i++ ){
						contents += "<tr class='prop-tr "+ removeWhiteSpace(nameTerm) +"-tr" +"'>";
		
						for( var j=0; j<col.length; j++ ){
							var cnt = "<span class='na'>n/a</span>";
							
							if( propertyMap[ col[j] +"||" + property[i] ] ){
								cnt =  "<span class='cnt-num'>"+propertyMap[ col[j] +"||" + property[i] ].cnt +"</span>";
								
							}
							
							contents += "<td>"+ cnt +"</td>";
						}
						contents += "<th><i class='fa fa-angle-right pr-1' aria-hidden='true'></i>"+ property[i] +"</th>";
						contents += "</tr>";
					}
					
					tr.after( contents );
					
					expandTableChar( appendFrame, col, dataMap );
				}
				
			});
		}
		else{
			tr.empty();
			$("."+removeWhiteSpace(nameTerm)+"-tr").remove();
			
			var contents = "";
			for( var j=0; j<col.length; j++ ){
				var cnt = "<span class='na'>n/a</span>";
				if( dataMap[ col[j] +"||" + nameTerm ] )
					cnt =  "<span class='cnt-num'>"+dataMap[ col[j] +"||" + nameTerm ].cnt +"</span>";
				
				contents += "<td>"+ cnt +"</td>";
			}
			contents += "<th><i class='fa fa-plus-square-o pr-1' aria-hidden='true'></i>"+ nameTerm +"</th>";
			
			tr.append(contents);
			
			expandTableChar( appendFrame, col, dataMap );
			
		}
	})
}

function removeWhiteSpace( str ){
	return str.replace(/ /g, "").replace(/\(/g,"").replace(/\)/g,"").replace(/"/g,"");
}

//function characteristicSearchInit(){
//	
//	$.ajax({
//		type: 'post',
//		url: "get_characteristic",
//		dataType: "json",
//		success: function(data) {
//			
//			var col = data.type;
//			var colMap = [];
//			var colDataMap = new Map();
//			for( var i=0; i<col.length; i++ ){
//				colMap.push( col[i].type );
//				
//				colDataMap.set( col[i].type, col[i] );
//			}
//			
//			var row = data.name;
//			var rowMap = [];
//			var rowDataMap = new Map();
//			let countMap = new Map();
//			for( var j=0; j<row.length; j++ ){
//				if( rowMap.indexOf( row[j].name ) == -1 )
//					rowMap.push( row[j].name );
//				rowDataMap.set( row[j].name, row[j] );
//				countMap.set( row[j].type+"||"+row[j].name, row[j] );
//					
//			}
//					
//			setCharTable( colMap, rowMap, colDataMap, rowDataMap, countMap );
//			
//		}
//	});
//}
//
//function setCharTable( col, row, colData, rowData, countMap ){
//	var appendFrame = "choose-by-tree";
//	$("#"+appendFrame).empty();
//	
//	var thead = "";
//	for( var i=0; i<col.length; i++){
//		 thead += "<th>" + characteristicExpandIcon( col[i], colData.get( col[i] ).expand ) + "</th>";
//	}
//	thead += "<th></th>";
//	
//	$("#"+appendFrame).append($("<table id='characteristic-table'>").append($("<thead>").append($("<tr>").append(thead))));
//	
//	
//	
//	
//	$("#"+appendFrame+" > table").append($("<tbody>"));
//	
//	
//	var contents = "";
//	for( var i=0; i<row.length; i++ ){
//		contents += "<tr>";
//		for( var j=0; j<col.length; j++ ){
//			var cnt = "n/a";
//			if( countMap.get( col[j] +"||" + row[i] ) )
//				cnt = countMap.get( col[j] +"||" + row[i] ).cnt;
//			
//			contents += "<td>"+ cnt +"</td>";
//		}
//		
//		contents += "<th>"+ characteristicExpandIcon( row[i], rowData.get( row[i] ).expand ) +"</th>";
//		
//		contents += "</tr>";
//	}
//	
//	$("#"+appendFrame+" > table > tbody").append(contents);
//	
//	
//	expandTable( col );
//	
//}
//
//function expandTable( col ){
//	var appendFrame = "choose-by-tree";
//	
//	$("#"+appendFrame +" > table > thead > tr > th ").click(function(){
//		console.log($(this));
//		
//		
//	})
//	
//	
//	$("#"+appendFrame +" > table > tbody > tr > th ").click(function(){
//		var tr = $(this).parent();
//		
//		console.log(tr);
//		$.ajax({
//			type: 'post',
//			url: "get_characteristic_property",
//			data:{ 'name' : $(this).text() },
//			dataType: "json",
//			success: function(data) {
//				
////				var contents = "";
////				for( var i=0; i<data.length; i++ ){
////					contents += "<tr>";
////					
////					
////					
////					contents += "</tr>";
////				}
//			}
//		});
//		
//	})
//	
//}
//
//function characteristicExpandIcon( data, expand ){
//	if( expand == "true" )
//		return "<span><span>" + data;
//	
//	else return data;
//}

function downloadSVG( svgStringArray ) {
	var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
	
	window.URL = (window.URL || window.webkitURL);
	
	var body = document.body;
	
//	var svgString = "";
//	for(var i=0; i<svgStringArray; i++) {
//		svgString += svgStringArray[i];
//	}
	
	download(svgStringArray);
	
	function download(source) {
		var filename = "download";
		
		var url = window.URL.createObjectURL(new Blob([source], { "type" : "text\/xml" }));
		
		var a = document.createElement("a");
		body.appendChild(a);
		a.setAttribute("class", "svg-crowbar");
		a.setAttribute("download", filename + ".svg");
		a.setAttribute("href", url);
		a.style["display"] = "none";
		a.click();
		
		setTimeout(function() {
			window.URL.revokeObjectURL(url);
		}, 10);
	}
}

function initFormControls() {
	$("#inputType").val('');
	
	$("#inputName").val('');
	$("#inputName > option.sample-select-opt").remove();
	
	$("#inputProperty").val('');
	$("#inputProperty > option.sample-select-opt").remove();
	
	$("#inputSample").val('');
	$("#inputSample > option.sample-select-opt").remove();
	
	$("#input").val('');
	$("#boundary_range").val(2000000);
	
	$("#direct_input").val('');
	$("#sel_tad").val('DI (window size = 2Mb)');
	
	$("input[type='checkbox']").prop("checked", false);
	$('#chooseSamplesBySearchSelectBox').multipleSelect('uncheckAll');
}
