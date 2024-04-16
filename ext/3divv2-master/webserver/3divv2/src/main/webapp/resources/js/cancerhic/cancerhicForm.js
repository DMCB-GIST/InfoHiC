var noChr = 0;

function getBoundaryText2Number(value){
	if( value.endsWith("Kb") )		return parseInt(value.replace("Kb", "")) * 1000;
	else if( value.endsWith("Mb") )	return parseInt(value.replace("Mb", "")) * 1000000;

	return value;
}

function getTableName( sample_name, resolution ) {
	var sample_table = null;
	$.ajax({
		url: "getSampleTableName",
		async:false,
		dataType: "json",
		data: {sample: sample_name, resolution:resolution },
		success: function( data ) {
			sample_table = data.table_name;
		},
		error: function(request, status, error){
			sample_table = null;
		}
	});

	return sample_table;
}

$(document).ready(function () {
	var samples = {};
	var regions = [];

	if( $("#which_tab").val() == "" || $("#which_tab").val() == "1" )	settingTab( 1 );
	else if( $("#which_tab").val() == "2" )								settingTab( 2 );
	else if( $("#which_tab").val() == "3" )								settingTab( 3 );

	characteristicSearchInit( $(".cancerhic_tab.active").attr("id"));

	$(".cancerhic_tab").click(function(){
		settingTab( $(this).attr('id') );
		characteristicSearchInit( $(this).attr('id') );
		
		initInputForm();
	});
	
	$(".choose-tab").off().click(function(){
		initInputForm();
	})

	var genomeObj = JSON.parse($("#genomeSize").val());
	
	$("#text_control_study").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "getAutocompleteStudy",
				dataType: "json",
				data: {q: request.term, type: 'case'},
				success: function( data ) {
					var combobox = $("#control-study-combobox");
					combobox.empty();

					response( $.map(data, function(obj, key) {
						return {label: obj.study_name + " ("+obj.count+")", value: obj.study_id, count:obj.count};
					}) );
				}
			});
		},
		minLength: 0,
		select: function( event, ui ) {
			$("#text_sample").val('');
			$("#text_normal_sample").val('');
			
			$(this).val( ui.item.label );
			$("#control_study_id").val( ui.item.value );

			return false;
		}
	});
	
	$("#text_study").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "getAutocompleteStudy",
				dataType: "json",
				data: {q: request.term, type: 'case'},
				success: function( data ) {
					var combobox = $("#study-combobox");
					combobox.empty();

//					for(var i=0; i<data.length; i++) {
//						combobox.append("<a class='dropdown-item'>" + data[i].study_name+ "("+data[i].count+")</a>");
//						console.log( "<a class='dropdown-item'>" + data[i].study_name+ "("+data[i].count+")</a>" );
//					}

					response( $.map(data, function(obj, key) {
						return {label: obj.study_name + " ("+obj.count+")", value: obj.study_id, count:obj.count};
					}) );
				}
			});
		},
		minLength: 0,
		select: function( event, ui ) {
//			var prevStudyId = $("#study_id").val();
//
//			var txt_sample = $("#text_sample").val();
//			var txt_cancer_sample = $("#text_cancer_sample").val();
//			var txt_normal_sample = $("#text_normal_sample").val();
//
//			if( isEmpty(txt_sample) && isEmpty(txt_cancer_sample) && isEmpty(txt_normal_sample) ) {
//				$(this).val( ui.item.label );
//				$("#study_id").val( ui.item.value );				
//			}else {
//				var r = confirm("Are you sure? When you change the study, previously samples user picked  will be canceled");
//
//				if( r == true) {
					$("#text_sample").val('');
					$("#text_cancer_sample").val('');
//					$("#text_normal_sample").val('');
					
					$(this).val( ui.item.label );
					$("#study_id").val( ui.item.value );
//				}
//			}

			return false;
		}
	});
	
	$("#text_sample").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "getAutocompleteSamples",
				dataType: "json",
				data: {q: request.term, type: 'entire', study:$("#study_id").val()},
				success: function( data ) {
					var combobox = $("#sample_combobox");
					combobox.empty();

					response( $.map(data, function(obj, key) {
						return {label: (obj.sample + " (" + obj.desc + ")"), value: obj.table_name, desc:obj.sample};
					}) );
				}
			});
		},
		minLength: 0,
		focus: function(event, ui) {
//			$(this).val(ui.item.desc);
			event.preventDefault();
//			return false;
		},
		select: function( event, ui ) {
			$(this).val( ui.item.desc );

			this.samples = {desc:ui.item.desc, table_name:ui.item.value};
			return false;
		}
	});

	$("#text_cancer_sample").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "getAutocompleteSamples",
				dataType: "json",
				data: {q: request.term, type: 'case', study:$("#study_id").val()},
				success: function( data ) {
					var combobox = $("#sample_combobox");
					combobox.empty();

					for(var i=0; i<data.length; i++) {
						combobox.append("<a class='dropdown-item'>" + data[i].desc+ "</a>")
					}

					response( $.map(data, function(obj, key) {
						return {label: (obj.sample + " (" + obj.desc + ")"), value: obj.table_name, desc:obj.sample};
					}) );
				}
			});
		},
		minLength: 0,
		focus: function(event, ui) {
			event.preventDefault();
//			$(this).val( ui.item.desc );
//			return false;
		},
		select: function( event, ui ) {
			$(this).val( ui.item.desc );

			this.samples = {desc:ui.item.desc, table_name:ui.item.value};
			return false;
		}
	});
	
	$("#text_normal_sample").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "getAutocompleteSamples",
				dataType: "json",
				data: {q: request.term, type: 'control', study:$("#control_study_id").val()},
				success: function( data ) {
					var combobox = $("#sample_combobox");
					combobox.empty();

					for(var i=0; i<data.length; i++) {
						combobox.append("<a class='dropdown-item'>" + data[i].desc+ "</a>")
					}

					response( $.map(data, function(obj, key) {
						return {label: (obj.sample + " (" + obj.desc + ")"), value: obj.table_name, desc:obj.sample};
					}) );
				}
			});
		},
		minLength: 0,
		focus: function(event, ui) {
			event.preventDefault();
//			$(this).val(ui.item.desc);
//			return false;
		},
		select: function( event, ui ) {
			$(this).val( ui.item.desc );

			this.samples = {desc:ui.item.desc, table_name:ui.item.value};
			return false;
		}
	});
	
	
	
	$("#search_text_cancer_sample").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "getAutocompleteSamples",
				dataType: "json",
				data: {q: request.term, type: 'case', study: ""},
				success: function( data ) {
					var combobox = $("#sample_combobox");
					combobox.empty();

					for(var i=0; i<data.length; i++) {
						combobox.append("<a class='dropdown-item'>" + data[i].desc+ "</a>")
					}

					response( $.map(data, function(obj, key) {
						return {label: (obj.sample + " (" + obj.desc + ")"), value: obj.table_name, desc:obj.sample};
					}) );
				}
			});
		},
		minLength: 0,
		focus: function(event, ui) {
			event.preventDefault();
//			$(this).val( ui.item.desc );
//			return false;
		},
		select: function( event, ui ) {
			$(this).val( ui.item.desc );
			
			this.samples = {desc:ui.item.desc, table_name:ui.item.value};
			return false;
		}
	});
	
	$("#search_text_normal_sample").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "getAutocompleteSamples",
				dataType: "json",
				data: {q: request.term, type: 'control', study:  ""},
				success: function( data ) {
					var combobox = $("#sample_combobox");
					combobox.empty();

					for(var i=0; i<data.length; i++) {
						combobox.append("<a class='dropdown-item'>" + data[i].desc+ "</a>")
					}

					response( $.map(data, function(obj, key) {
						return {label: (obj.sample + " (" + obj.desc + ")"), value: obj.table_name, desc:obj.sample};
					}) );
				}
			});
		},
		minLength: 0,
		focus: function(event, ui) {
			event.preventDefault();
//			$(this).val(ui.item.desc);
//			return false;
		},
		select: function( event, ui ) {
			$(this).val( ui.item.desc );

			this.samples = {desc:ui.item.desc, table_name:ui.item.value};
			return false;
		}
	});
	
	$("#search_text_sample").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "getAutocompleteSamples",
				dataType: "json",
				data: {q: request.term, type: 'control', study:  ""},
				success: function( data ) {
					var combobox = $("#sample_combobox");
					combobox.empty();

					for(var i=0; i<data.length; i++) {
						combobox.append("<a class='dropdown-item'>" + data[i].desc+ "</a>")
					}

					response( $.map(data, function(obj, key) {
						return {label: (obj.sample + " (" + obj.desc + ")"), value: obj.table_name, desc:obj.sample};
					}) );
				}
			});
		},
		minLength: 0,
		focus: function(event, ui) {
			event.preventDefault();
//			$(this).val(ui.item.desc);
//			return false;
		},
		select: function( event, ui ) {
			$(this).val( ui.item.desc );

			this.samples = {desc:ui.item.desc, table_name:ui.item.value};
			return false;
		}
	});
	
	$("#text_gene_symbol").autocomplete({
		source : function( request, response ) {
			$.ajax({
				url: "getAutocompleteGenes",
				dataType: "json",
				data: {q: request.term },
				success: function( data ) {
					response( $.map(data, function(obj, key) {
						return {label: obj.name, value: obj.name, chr:obj.chr, start:obj.start, end:obj.end, strand:obj.strand, db:obj.db};
					}) );
				}
			});
		},
		minLength:3,
		scroll:true,
		focus: function(event, ui) {
			event.preventDefault();
		},
		select: function( event, ui ) {
			$("#text_gene_symbol").val( ui.item.value );
			$(this).val( ui.item.label );
			
			$("#comboChr").text( ui.item.chr );
			$("#chromStart").val( numberWithCommas(ui.item.start) );
			$("#chromEnd").val( numberWithCommas(ui.item.end) );

			return false;
		}
	})
	.autocomplete( "instance" )._renderItem = function( ul, item ) {
		return $( "<li>" )
		.append("<div style='display:flex;'><div style='width:23%; float:left;'><span class='keyword-type keyword-"+item.db+" p-1'>"+item.db+"</span></div><div style='width:77%; float:left;'>'"+item.label+"'<span style='font-size:11.5px; padding-left: 10px;'>"+ item.chr + ":" + item.start + "-" + item.end + "(" + item.strand + ")" +"</span></div></div>")
		.appendTo( ul );
	};
	
	$("#textarea_option_gene").autocomplete({
		source : function( request, response ) {
			var term = request.term;
			
			var terms = term.split(",");
			var newTerm = terms[0].trim();
			
			var dbArray = new Array;
			if( $("input:checkbox[id='gencode_chk']").is(":checked") )	dbArray.push("Gencodev34");
			if( $("input:checkbox[id='refseq_chk']").is(":checked") )	dbArray.push("RefSeq");
//			if( isEmpty( dbArray ) ) {
//				alert("Please select one or more of the two checkboxes 'GENCODE v34' or 'Refseq' in the Extra tracks");
//				$("#textarea_option_gene").val('');
//				return;
//			}
			
			if( terms.length > 0 )	newTerm = (terms[terms.length-1]).trim();
			if( newTerm.length > 1 ) {
				if( newTerm != "" ) {
					$.ajax({
						url: "getOptionGeneAutoComplete",
						dataType: "json",
						data: { q: newTerm, dbArray: JSON.stringify(dbArray) },
						success: function( data ) {
							response( $.map(data, function(obj, key) {
								return {label: obj.name, value: obj.name};
							}) );
						}
					});
				}
			}
		},
		minLength:1,
		focus: function(event, ui){
			return false;
        },
		scroll:true,
		select: function( event, ui ) {
			var term = $(this).val();
			var delimiter = ",";
			var terms = term.split(delimiter);
			
			var result = "";
			var array = new Array();
			for( var i=0; i<terms.length-1; i++ ) {
				result += terms[i] + delimiter;
				array.push( terms[i] );
			}
			
			var newGene = ui.item.value;
			result += newGene;
			array.push( newGene );
			
			$(this).val( result );

			return false;
		}
	})
	.autocomplete( "instance" )._renderItem = function( ul, item ) {
		return $( "<li>" )
		.append("<div style='display:flex;'><div style='width:90%; float:left;'>"+item.label+"</div></div>")
		.appendTo( ul );
	};
	
//	$("input:checkbox[id='gencode_chk']").prop("checked", false);
	$("#gencode_chk").click( function() {
		if( $("#textarea_option_gene").is(":disabled") )
			$("#textarea_option_gene").attr("disabled", false);
		
		if( !$("input:checkbox[id='gencode_chk']").is(":checked") && !$("input:checkbox[id='refseq_chk']").is(":checked") ) {
			if( !$("#textarea_option_gene").is(":disabled") ) {
				$("#textarea_option_gene").val('');
				$("#textarea_option_gene").attr("disabled", true);
			}
		}
	})
	
//	$("input:checkbox[id='refseq_chk']").prop("checked", false);
	$("#refseq_chk").click( function() {
		if( $("#textarea_option_gene").is(":disabled") )
			$("#textarea_option_gene").attr("disabled", false);
		
		if( !$("input:checkbox[id='gencode_chk']").is(":checked") && !$("input:checkbox[id='refseq_chk']").is(":checked") ) {
			if( !$("#textarea_option_gene").is(":disabled") ) {
				$("#textarea_option_gene").val('');
				$("#textarea_option_gene").attr("disabled", true);
			}
		}
	})
	
	$(".text_genomic_locus").on('keyup', function (event) {
		if (event.which >= 37 && event.which <= 40) {
	        event.preventDefault();
	    }

	    var currentVal = $(this).val();
	    var testDecimal = testDecimals(currentVal);
	    if (testDecimal.length > 1) {
	        console.log("You cannot enter more than one decimal point");
	        currentVal = currentVal.slice(0, -1);
	    }
	    $(this).val(replaceCommas(currentVal));
	});

	
	$('#text_study').click(function(){
		$(".study-combobox").click();
	});
	
	$('#text_control_study').click(function(){
		$(".control-study-combobox").click();
	});
	
	$(".study-combobox").click(function(){
		$('#text_study').autocomplete('option', 'minLength', 0);
	    $('#text_study').autocomplete('search', '');
	});
	
	$(".control-study-combobox").click(function(){
		$('#text_control_study').autocomplete('option', 'minLength', 0);
	    $('#text_control_study').autocomplete('search', '');
	});
	
	$('#text_sample').click(function(){
		$(".sample-combobox").click();
	});
	$("#text_cancer_sample").click(function(){
		$(".cancer-sample-combobox").click();
	});
	$("#text_normal_sample").click(function(){
		$(".normal-sample-combobox").click();
	});
	$("#search_text_cancer_sample").click(function(){
		$(".cancer-sample-combobox").click();
	});
	$("#search_text_normal_sample").click(function(){
		$(".normal-sample-combobox").click();
	});
	$("#search_text_sample").click(function(){
		$(".sample-combobox").click();
	});

	$(".sample-combobox").click(function(){
		var study_id = $("#study_id").val();
		
		if( $("#choose-by-all-tab").hasClass("active") ) {
			if( isEmpty(study_id) !== true ) {
				$('#text_sample').autocomplete('option', 'minLength', 0);
			    $('#text_sample').autocomplete('search', '');
			}
		} else if ( $("#choose-by-search-tab").hasClass("active") ) {
			// choose samples(s) by search
			
			$('#search_text_sample').autocomplete('option', 'minLength', 0);
		    $('#search_text_sample').autocomplete('search', '');
		} else {
			// choose samples(s) by characteristics
		}
	});
	
	$(".cancer-sample-combobox").click(function(){
		var study_id = $("#study_id").val();
		
		if( $("#choose-by-all-tab").hasClass("active") ) {
			if( isEmpty(study_id) !== true ) {
				$('#text_cancer_sample').autocomplete('option', 'minLength', 0);
			    $('#text_cancer_sample').autocomplete('search', '');
			}
		} else if ( $("#choose-by-search-tab").hasClass("active") ) {
			// choose samples(s) by search
			
			$('#search_text_cancer_sample').autocomplete('option', 'minLength', 0);
		    $('#search_text_cancer_sample').autocomplete('search', '');
		} else {
			// choose samples(s) by characteristics
		}
	});
	
	$(".normal-sample-combobox").click(function(){
		var study_id = $("#control_study_id").val();
		
		if( $("#choose-by-all-tab").hasClass("active") ) {
			if( isEmpty(study_id) !== true ) {
				$('#text_normal_sample').autocomplete('option', 'minLength', 0);
			    $('#text_normal_sample').autocomplete('search', '');
			}
		} else if ( $("#choose-by-search-tab").hasClass("active") ) {
			// choose samples(s) by search
			
			$('#search_text_normal_sample').autocomplete('option', 'minLength', 0);
		    $('#search_text_normal_sample').autocomplete('search', '');
		} else {
			// choose samples(s) by characteristics
		}
	});
	
	$(".chr-dropdown-item").click(function(){
		$("#comboChr").html( $(this).html() );
	});
	
	$(".resolution-dropdown-item").click(function(){
		$("#comboResolution").html( $(this).html() );
	})
	
	$(".boundary-dropdown-item").click(function(){
		$("#comboBoundary").html( $(this).html() );

		var value = getBoundaryText2Number( $(this).html() );

		$("#boundaySize").val( value );
	});
	
	$("#chk_samples_all").change(function(){
		var tr = $("#chooseInfo tbody tr");
		if( $(this).prop("checked") ) {
			tr.each(function(index){
				var checkbox = $(this).find('td:nth-child(1)').find("input.selected-sample-chk");
				
				$(checkbox).prop("checked", true);
			});
		}else {
			tr.each(function(index){
				var checkbox = $(this).find('td:nth-child(1)').find("input.selected-sample-chk");
				$(checkbox).prop("checked", false);
			})
		}
	});
	
	$("#chk_samples_all1").change(function(){
		var tr = $("#chooseInfoPreCalled tbody tr");
		if( $(this).prop("checked") ) {
			tr.each(function(index){
				var checkbox = $(this).find('td:nth-child(1)').find("input.selected-sample-chk");
				
				$(checkbox).prop("checked", true);
			});
		}else {
			tr.each(function(index){
				var checkbox = $(this).find('td:nth-child(1)').find("input.selected-sample-chk");
				$(checkbox).prop("checked", false);
			})
		}
	});

	$("#btn_add_region").click(function(){
		var tabId = $("#which_tab").val();
		
		var activeChooseSampleTab = $("li.choose-tab > a.active").text();

		if( tabId == '1' ){
			
			if( activeChooseSampleTab == "Choose sample(s)"){
				var sample1 = $("#text_cancer_sample").val();
				if( sample1 === '' ) {
					alert("You have to choose a case sample");
					return;
				}
				var sample2 = $("#text_normal_sample").val();
				if( sample2 === '' ) {
					alert("You have to choose a control sample");
					return;
				}
			}
			else if(activeChooseSampleTab == "Choose sample(s) by search"){
				var sample1 = $("#search_text_cancer_sample").val();
				if( sample1 === '' ) {
					alert("You have to choose a case sample");
					return;
				}
				var sample2 = $("#search_text_normal_sample").val();
				if( sample2 === '' ) {
					alert("You have to choose a control sample");
					return;
				}
								
			}else{
				
				var sample1 = $("#case-inputSample").val();
				if( sample1 === '' || sample1 == null) {
					alert("You have to choose a case sample");
					return;
				}
				var sample2 = $("#control-inputSample").val();
				if( sample2 === '' || sample2 == null) {
					alert("You have to choose a control sample");
					return;
				}
			}
			
		}else{
			
			if( activeChooseSampleTab == "Choose sample(s)"){
				var sample = $("#text_sample").val();
				if( sample === '' ) {
					alert("You have to choose a sample");
					return;
				}
			}
			else if(activeChooseSampleTab == "Choose sample(s) by search"){
				var sample = $("#search_text_sample").val();
				if( sample === '' ) {
					alert("You have to choose a sample");
					return;
				}			
			}
			else{
				var sample = $("#sample-inputSample").val();
				if( sample === '' || sample == null) {
					alert("You have to choose a sample");
					return;
				}	
			}
		}

		var type = 2;

		if( tabId === '3'){
			// 3번 tab의 rearrangement의 경우는 파일로 부터 얻어온 text를
			// region으로 처리하는 프로세스가 필요함, 따라서 아래 부분이 text string을 table형태의 region으로 변경
			var format_string = $("#textarea_bed_format").val().replace(/\t/gi, '').replace(/ /gi, '');
			if( !isEmpty(format_string) ) {
				var sample_name = $("#sample-inputSample").val();
				
				var activeChooseSampleTab = $("li.choose-tab > a.active").text();
				
				if( activeChooseSampleTab === "Choose sample(s) by search" )	sample_name= $("#search_text_sample").val();

				var resolution = parseInt($("#comboResolution").text().replace('Kb', '')) * 1000;
				var sample_table = getTableName( sample_name, resolution );

				var boundaryValue = getBoundaryText2Number( $("#comboBoundary").html() );
				$("#boundaySize").val( boundaryValue );
				
				var tbody = $("#chooseInfo tbody");
	
				if( !isEmpty(sample_table) ) {
					var retObj = CancerViewerController.isCorrectQuery( format_string );
	
					if( retObj.msg_code === '000' ) {
						for(var i=0; i<retObj.data.length; i++) {
							var newRegion = retObj.data[i].chrom + ":" + numberWithCommas(retObj.data[i].chromStart) + "-" + numberWithCommas(retObj.data[i].chromEnd);
	
							var html = "<tr>";
							html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
							html += "<td>"+sample_name+"</td>";
							html += "<td>"+newRegion+"</td>";
							html += "<td>"+numberWithCommas(boundaryValue)+"</td>";
							html += "</tr>";
	
							tbody.append( html );
						}
					}else {
						alert( retObj.msg_text );
					}
				}
			}else {
				alert("You have to input regions");
				$("#textarea_bed_format").focus();
				return;
			}
		}else {
			var chrom = $("#comboChr").text();
			var chromStart = $("#chromStart").val().replace(/\,/gi, '');
			var chromEnd = $("#chromEnd").val().replace(/\,/gi, '');
			var boundary = 0;
	
			if( chrom !== '' && chromStart === '' && chromEnd === '' ) {
				// 문구 수정 요청
				alert("Genomic range not entered. Please enter the genomic range.");
				return;

//				var r = confirm("Do you want to choose the "+ chrom +" entire chromosome?");
//				if (r == true) {
//					chromStart = 1;
//					chromEnd = genomeObj[chrom].length;
//					type = 1;
//				} else {
//					console.log( "User has canceled" );
//	
//					return;
//				}
			}else if( chrom !== '' && ((chromStart === '' && chromEnd !== '') || (chromStart !== '' && chromEnd === '') ) ) {
				alert("To add a region, you have to input both start and end position of genomic region");
				return;
			}
			
			if( parseInt(chromStart) > parseInt(chromEnd) ) {
				alert("You must input greater chromEnd than chromStart");
				return;
			}
	
			if( (chromEnd - chromStart + 1) < 1000000 ) {
				if( $("#comboBoundary").html() === "0Kb" ) {
					$("#comboBoundary").html("20Mb");
				}
			}

			// Boundary value initialization
			var boundaryValue = getBoundaryText2Number( $("#comboBoundary").html() );
			$("#boundaySize").val( boundaryValue );
			
			var region = chrom + ":" + numberWithCommas(chromStart) + "-" + numberWithCommas(chromEnd);
	
			if( tabId == '1' ){
//				var sample_name1 = $("#text_cancer_sample").val();
//				var sample_name2 = $("#text_normal_sample").val();
				
				var activeChooseSampleTab = $("li.choose-tab > a.active").text();
				
				if( activeChooseSampleTab == "Choose sample(s)"){
					var sample_name1 = $("#text_cancer_sample").val();
					var sample_name2 = $("#text_normal_sample").val();
				}
				else if(activeChooseSampleTab == "Choose sample(s) by search"){
					var sample_name1 = $("#search_text_cancer_sample").val();
					var sample_name2 = $("#search_text_normal_sample").val();
									
				}else{
					var sample_name1 = $("#case-inputSample").val();
					var sample_name2 = $("#control-inputSample").val();
				}
	
				var tbody = $("#chooseInfoPreCalled tbody");
				
				var canGo = true;
				var tr = $("#chooseInfoPreCalled tbody tr");
				tr.each(function(index){
					var before_sample1 = $($(this).find('td:nth-child(2)')).html();
					var before_sample2 = $($(this).find('td:nth-child(3)')).html();
					var before_region = $($(this).find('td:nth-child(4)')).html();
									
					if( before_sample1 !== sample_name1 || before_sample2 !== sample_name2 ) {
						canGo = false;
						alert("You must choose the same sample with that you have chosen before");
	
						return;
					}
					
					if( before_region ===  region ) {
						var r = confirm("Have you chosen the identical region before. Do you want to add the region again?");
						if (r == false) {
							console.log( "User has canceled" );
							canGo = false;
	
							return;
						}
					}
				});
	
				if( canGo === true ) {
					var boundary = (type == 1? 0:boundaryValue);
			
					var html = "<tr>";
					html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
					html += "<td>"+sample_name1+"</td>";
					html += "<td>"+sample_name2+"</td>";
					html += "<td>"+region+"</td>";
					html += "<td>"+numberWithCommas(boundary)+"</td>";
					html += "</tr>";
					
					tbody.append( html );
				}
			}else{
//				var sample_name = $("#text_sample").val();
				var activeChooseSampleTab = $("li.choose-tab > a.active").text();
				
				if( activeChooseSampleTab == "Choose sample(s)"){
					var sample_name = $("#text_sample").val();
				}
				else if(activeChooseSampleTab == "Choose sample(s) by search"){
					var sample_name = $("#search_text_sample").val();
									
				}else{
					var sample_name = $("#sample-inputSample").val();
				}
	
				var tbody = $("#chooseInfo tbody");
				
				var canGo = true;
				var tr = $("#chooseInfo tbody tr");
				tr.each(function(index){
					var before_sample = $($(this).find('td:nth-child(2)')).html();
					var before_region = $($(this).find('td:nth-child(3)')).html();
					
					if( before_sample !== sample_name ) {
						canGo = false;
						alert("You must choose the same sample with that you have chosen before");
	
						return;
					}
					
					if( before_region ===  region ) {
						var r = confirm("Have you chosen the identical region before. Do you want to add the region again?");
						if (r == false) {
							console.log( "User has canceled" );
							canGo = false;
	
							return;
						}
					}
				});
	
				if( canGo === true ) {
					var boundary = (type == 1? 0:boundaryValue);
			
					var html = "<tr>";
					html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
					html += "<td>"+sample_name+"</td>";
					html += "<td>"+region+"</td>";
					html += "<td>"+numberWithCommas(boundary)+"</td>";
					html += "</tr>";
					
					tbody.append( html );
				}
			}
		}
	});
	
	
	$("#btn_del_region").click(function() {
		var tabId = $("#which_tab").val();
		
		if( tabId == '1' ){
			var tr = $("#chooseInfoPreCalled tbody tr");
		}else{
			var tr = $("#chooseInfo tbody tr");
		}
		tr.each(function(index){
			var firstColumn = $(this).find("td:first").children();

			if( $(firstColumn).prop('checked') ) {
				$(this).remove();
			}
		});
		if( $("#chk_samples_all").prop("checked") )		$("#chk_samples_all").prop("checked", false);
		if( $("#chk_samples_all1").prop("checked") )	$("#chk_samples_all1").prop("checked", false);
	});
	
	$("a.cancerhic_tab").click(function(){
		var id = $(this).attr("id");

		if( id === 'predefined-sv-tab' )		$("#which_tab").val( 1 );
		else if( id === 'userdefined-sv-tab')	$("#which_tab").val( 2 );
		else									$("#which_tab").val( 3 );
	})
	
	$("#btn_run").click(function(){
		var choosedSamples = [];
		var choosedRegions = [];
		
		var resolution = parseInt($("#comboResolution").text().replace('Kb', '')) * 1000;

		if( $("#which_tab").val() === '2' || $("#which_tab").val() === '3'){
			var tbody = $("#chooseInfo tbody");

//			if( $("#which_tab").val() === '3' ) {
//				// 3번 tab의 rearrangement의 경우는 파일로 부터 얻어온 text를
//				// region으로 처리하는 프로세스가 필요함, 따라서 아래 부분이 text string을 table형태의 region으로 변경
//				var format_string = $("#textarea_bed_format").val().replace(/\t/gi, '').replace(/ /gi, '');
//
//				if( !isEmpty(format_string) ) {
//					var sample_name = $("#text_sample").val();
//					
//					var sample_table = getTableName( sample_name, resolution );
//					
//					var boundaryValue = getBoundaryText2Number( $("#comboBoundary").html() );
//					$("#boundaySize").val( boundaryValue );
//	
//					if( !isEmpty(sample_table) ) {
//						var retObj = CancerViewerController.isCorrectQuery( format_string );
//		
//						if( retObj.msg_code === '000' ) {
//							for(var i=0; i<retObj.data.length; i++) {
//								var newRegion = retObj.data[i].chrom + ":" + numberWithCommas(retObj.data[i].chromStart) + "-" + numberWithCommas(retObj.data[i].chromEnd);
//	
//								var html = "<tr>";
//								html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
//								html += "<td>"+sample_name+"</td>";
//								html += "<td>"+newRegion+"</td>";
//								html += "<td>"+numberWithCommas(boundaryValue)+"</td>";
//								html += "</tr>";
//	
//								tbody.append( html );
//							}
//						}else {
//							alert( retObj.msg_text );
//						}
//					}else {
//						alert("You have to choose a sample");
//						return;
//					}
//				}
//			}
	
			var tr = $("#chooseInfo tbody tr");
			
			if( tr.length == 0 ){
				alert("You have to choose at least one sample");
				return false;
			}
			tr.each(function(index){
				var sample = $(this).find("td:eq(1)").text();
				var region = $(this).find("td:eq(2)").text();
				var boundary = $(this).find("td:eq(3)").text().replace(/\,/gi, '');
				var sample_table = getTableName( sample, resolution );
				
				if( sample_table == null ) {
					alert("Sorry! 3DIV is not providing " + parseInt(resolution/1000) + "Kb resolution [" + sample + "] data\nPlease choose another resolution data");

					return false;
				};
	
				var div = region.replace(/\,/gi, '').split(':');
				var chrom = div[0];
				var pos = div[1].split('-');
				var chromStart = parseInt(pos[0]) - parseInt(boundary);
				var chromEnd = parseInt(pos[1]) + parseInt(boundary);
				
				if( genomeObj[chrom].length < chromEnd )
					chromEnd = genomeObj[chrom].length;
				
				if( chromStart < 0 ) chromStart = 1;

				var newRegion = chrom + ":" + chromStart + "-" + chromEnd;

//				if( choosedSamples.indexOf(table) < 0 ) choosedSamples.push( {sample:sample, table:table} );
				choosedSamples.push( {sample:sample, table:sample_table} );
				choosedRegions.push( newRegion );
			});
		}else{
			var tbody = $("#chooseInfoPreCalled tbody");
			
			var tr = $("#chooseInfoPreCalled tbody tr");
			
			if( tr.length == 0 ){
				alert("You have to choose at least one sample");
				return false;
			}
			tr.each(function(index){
				var sample1 = $(this).find("td:eq(1)").text();
				var sample2 = $(this).find("td:eq(2)").text();
				var region = $(this).find("td:eq(3)").text();
				var boundary = $(this).find("td:eq(4)").text().replace(/\,/gi, '');
				
				var sample_table1 = getTableName( sample1, resolution );
				var sample_table2 = getTableName( sample2, resolution )

				if( sample_table1 == null ) {
					alert("Sorry! 3DIV is not providing " + parseInt(resolution/1000) + "Kb resolution [" + sample1 + "] data\nPlease choose another resolution data");

					return false;
				};
				
				if( sample_table2 == null ) {
					alert("Sorry! 3DIV is not providing " + parseInt(resolution/1000) + "Kb resolution [" + sample2 + "] data\nPlease choose another resolution data");

					return false;
				};
				
				var div = region.replace(/\,/gi, '').split(':');
				var chrom = div[0];
				var pos = div[1].split('-');
				var chromStart = parseInt(pos[0]) - parseInt(boundary);
				var chromEnd = parseInt(pos[1]) + parseInt(boundary);
				
				if( genomeObj[chrom].length < chromEnd )
					chromEnd = genomeObj[chrom].length;
				
				if( chromStart < 0 ) chromStart = 1;
	
				var newRegion = chrom + ":" + chromStart + "-" + chromEnd;
	
//				if( choosedSamples.indexOf(table1) < 0 ) choosedSamples.push( {sample1:sample1, table1:table1, sample2:sample2, table2:table2} );
				choosedSamples.push( {sample1:sample1, table1:sample_table1, sample2:sample2, table2:sample_table2} );
				choosedRegions.push( newRegion );
			});
		}
		
		var extra_tracks = [];

		var color_palette = $("input[name='ColorRradioOptions']:checked").val();
		if( $("#superenhancer_chk").is(':checked') ) extra_tracks.push('superenhancer');
		if( $("#gencode_chk").is(':checked') ) extra_tracks.push('gencode');
		if( $("#refseq_chk").is(':checked') ) extra_tracks.push('refseq');
		
		var option_gene = $("#textarea_option_gene").val();
		var option_gene_terms = option_gene.split(",");
		var option_gene_array = new Array();
		for( var i=0; i<option_gene_terms.length; i++ ) {
			option_gene_array.push( option_gene_terms[i].trim() );
		}
		
		var result_option_gene = [];
		$.ajax({
			url: "getOptionGene",
			dataType: "json",
			async: false,
			data: { array: JSON.stringify(option_gene_array) },
			success: function( data ) {
				for( var i=0; i<data.length; i++ ) {
					result_option_gene.push( data[i].name );
				}
			}
		});

// 어느 Tab에서 실행했는지 확인하기 위한 인데스
//		$("#which_tab").val( tabId );
		$("#json_samples").val(JSON.stringify(choosedSamples));
		$("#json_regions").val(JSON.stringify(choosedRegions));
		$("#json_extra_tracks").val(JSON.stringify(extra_tracks));
		$("#json_option_gene").val(JSON.stringify(result_option_gene));
		$("#color_palette").val(color_palette);
		$("#type").val( type );
		$("#resolution").val( resolution );
		$("#param_textarea_bed_format").val( $("#textarea_bed_format").val() );

		$("#sendForm").submit();
	})

	$("#btn_example_run").click(function(){
		var tbody = $("#chooseInfo tbody");
		tbody.empty();

		var tabId = $("#which_tab").val();
		if( tabId == '1' ){
			var tbody = $("#chooseInfoPreCalled tbody");
			tbody.empty();
			
			var html = "<tr>";
			html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html += "<td>SNUCRC_14-442T</td>";
			html += "<td>SNUCRC_11-51N</td>";
			html += "<td>chr6:60,000,000-150,000,000</td>";
			html += "<td>0</td>";
			html += "</tr>";
			
			var html2 = "<tr>";
			html2 += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html2 += "<td>SNUCRC_14-442T</td>";
			html2 += "<td>SNUCRC_11-51N</td>";
			html2 += "<td>chr6:60,000,000-150,000,000</td>";
			html2 += "<td>0</td>";
			html2 += "</tr>";

//			tbody.append( html );
			tbody.append( html2 );
		}
		else if( tabId == '2' ) {
			var html = "<tr>";
			html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html += "<td>SNUCRC_11-51T</td>";
			html += "<td>chr22:23,179,704-23,318,037</td>";
			html += "<td>5,000,000</td>";
			html += "</tr>";
			
			var html2 = "<tr>";
			html2 += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html2 += "<td>SNUCRC_11-51T</td>";
			html2 += "<td>chr9:130,713,016-130,887,675</td>";
			html2 += "<td>5,000,000</td>";
			html2 += "</tr>";
			
			var html3 = "<tr>";
			html3 += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html3 += "<td>SNUCRC_11-51T</td>";
			html3 += "<td>chr6:1-91,864,040</td>";
			html3 += "<td>0</td>";
			html3 += "</tr>";
			
			var html4 = "<tr>";
			html4 += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html4 += "<td>SNUCRC_11-51T</td>";
			html4 += "<td>chr11:1-80,342,014</td>";
			html4 += "<td>0</td>";
			html4 += "</tr>";
			
			
			var html5 = "<tr>";
			html5 += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html5 += "<td>SNUCRC_11-51T</td>";
			html5 += "<td>chr6:1-170,805,979</td>";
			html5 += "<td>0</td>";
			html5 += "</tr>";
			
			var html6 = "<tr>";
			html6 += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html6 += "<td>SNUCRC_11-51T</td>";
			html6 += "<td>chr11:1-135,086,622</td>";
			html6 += "<td>0</td>";
			html6 += "</tr>";
			
			var html7 = "<tr>";
			html7 += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html7 += "<td>SNUCRC_14-442T</td>";
			html7 += "<td>chr6:60,000,000-150,000,000</td>";
			html7 += "<td>10,000,000</td>";
			html7 += "</tr>";
			
			
			
			var html8 = "<tr>";
			html8 += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
			html8 += "<td>SNUCRC_14-442T</td>";
			html8 += "<td>chr6:60,000,000-150,000,000</td>";
			html8 += "<td>0</td>";
			html8 += "</tr>";

	//		tbody.append( html );
	//		tbody.append( html2 );
	//		tbody.append( html3 );
	//		tbody.append( html4 );
//			tbody.append( html5 );
//			tbody.append( html6 );
//			tbody.append( html7 );
			
			tbody.append( html8 );
		}else {
			var example_string = "chr19:1-11064109;chr17:7,858,769-83257441\nchr20:1-17070762;chr19:14867959-58617616\nchr17:1-6643610;chr20:18560020-64444167";
//			$("#text_sample").val( "11-51T" );
//			$("#text_sample_table").val("Data500k");
			
//			var example_string = "chr17:1-83,257,441;chr19:1-58,617,616;\nchr20:1-64,444,167;";
			
			$("#text_sample").val( "SNUCRC_11-927T" );
//			$("#text_sample_table").val("Data500k");
			$("#textarea_bed_format").val( example_string );

			var sample_name = $("#text_sample").val();

			var resolution = parseInt($("#comboResolution").text().replace('Kb', '')) * 1000;
			var sample_table = getTableName( sample_name, resolution );

			var boundaryValue = getBoundaryText2Number( $("#comboBoundary").html() );
			$("#boundaySize").val( boundaryValue );
			
			var tbody = $("#chooseInfo tbody");

			if( !isEmpty(sample_table) ) {
				var retObj = CancerViewerController.isCorrectQuery( example_string );

				if( retObj.msg_code === '000' ) {
					for(var i=0; i<retObj.data.length; i++) {
						var newRegion = retObj.data[i].chrom + ":" + numberWithCommas(retObj.data[i].chromStart) + "-" + numberWithCommas(retObj.data[i].chromEnd);

						var html = "<tr>";
						html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
						html += "<td>"+sample_name+"</td>";
						html += "<td>"+newRegion+"</td>";
						html += "<td>"+numberWithCommas(boundaryValue)+"</td>";
						html += "</tr>";

						tbody.append( html );
					}
				}else {
					alert( retObj.msg_text );
				}
			}
		}

		$("input:checkbox[id='gencode_chk']").prop("checked", true);
		$("input:checkbox[id='refseq_chk']").prop("checked", true);
		
//		var chr6_gene = "RBBP4P3, LGSN, ADH5P4, SMAP1, H3P27, CYB5R4, DUTP5, HTR1E, CGA, RNGTT, RRAGD, MDN1, FHL5, COQ3, ASCC3, GRIK2, SOBP, MARCKS, CBX3P9, ZUP1, ROS1, TRDN, SAMD3, EPM2A";
//		var chr17_gene = "C20orf78, LOC112268266, RAB22A, CTCFL, SOX18";
//		var chr19_gene = "SHC2, OAZ1, TLE6, F2RL3, SYCN, PTGIR, MYBPC2, KIR3DL1, CHMP2A";
//		var chr20_gene = "KCNAB3, ALOXE3, PEX12, HEATR9, FMNL1, OMG, GAS2L2, MED1, HOXB9, MIR633, ACTG1, METRNL";
//		$("#textarea_option_gene").val( chr6_gene + "," + chr17_gene + "," + chr19_gene + "," + chr20_gene );

		$("#btn_run").click();
	});

	document.getElementById("inputFile").addEventListener('change', function() { 
		var fr = new FileReader(); 
		fr.onload=function(){
			document.getElementById("textarea_bed_format").value = fr.result;
		}
		fr.readAsText(this.files[0]); 
	});
});

function settingTab( tabNum ){
	$(".card-title-sample").html('Choose a sample');
	$(".pre-called-control-sample-chooser-panel").addClass("d-none");
	
	
	if( tabNum == "1" || tabNum == "predefined-sv-tab" ){
		$(".nav-item").removeClass("active");
		$("#predefined-sv-tab").addClass("active");
		$("#which_tab").val( 1 );
		
		$("#study-group-2").removeClass("d-none");
		$(".sample-entire-group-class").addClass("d-none");
		$(".sample-control-group-class").removeClass("d-none");
		$(".sample-case-group-class").removeClass("d-none");
		
		$("#chooseInfo").addClass("d-none");
		$("#chooseInfoPreCalled").removeClass("d-none");
		$(".pre-called-control-sample-chooser-panel").removeClass("d-none");
		
//		$(".card-title-sample").html('Choose a case sample');
		$(".card-title-sample").html('Choose a sample');
		$(".by_file_panel").addClass("d-none");
		$(".by_gene_pane").removeClass("d-none");
		$(".by_genetic_locus_pane").removeClass("d-none");
		$(".by_predefined_sv_panel").removeClass('d-none');
		
		
	}else if(tabNum == "2" || tabNum == "userdefined-sv-tab"){
		$(".nav-item").removeClass("active");
		$("#userdefined-sv-tab").addClass("active");
		$("#which_tab").val( 2 );
		
		$("#study-group-2").addClass("d-none");
		$(".sample-entire-group-class").removeClass("d-none");
		$(".sample-control-group-class").addClass("d-none");
		$(".sample-case-group-class").addClass("d-none");

		$("#chooseInfoPreCalled").addClass("d-none");
		$("#chooseInfo").removeClass("d-none");
		$(".by_file_panel").addClass("d-none");		
		$(".by_gene_pane").removeClass("d-none");
		$(".by_genetic_locus_pane").removeClass("d-none");
		$(".by_predefined_sv_panel").addClass('d-none');
		
	}else if(tabNum == "3" || tabNum == "user-rearrangement-tab"){
		$(".nav-item").removeClass("active");
		$("#user-rearrangement-tab").addClass("active");
		$("#which_tab").val( 3 );
		
		$(".sample-entire-group-class").removeClass("d-none");
		$(".sample-control-group-class").addClass("d-none");
		$(".sample-case-group-class").addClass("d-none");
		
		$("#study-group-2").addClass("d-none");
		$("#chooseInfoPreCalled").addClass("d-none");
		$("#chooseInfo").removeClass("d-none");
		$(".by_file_panel").removeClass("d-none");
		$(".by_gene_pane").addClass("d-none");
		$(".by_genetic_locus_pane").addClass("d-none");
		$(".by_predefined_sv_panel").addClass('d-none');
	}
	clearSvTable();
}

function initInputForm(){
	$("#text_study").val('');
	$("#text_sample").val('');
	$("#text_cancer_sample").val('');
	$("#text_control_study").val('');
	$("#text_normal_sample").val('');
	$("#text_gene_symbol").val('');
	$("#chromStart").val('');
	$("#chromEnd").val('');
	$("#textarea_bed_format").html('');
	
	$("#search_text_study").val('');
	$("#search_text_sample").val('');
	$("#search_text_cancer_sample").val('');
	$("#search_text_control_study").val('');
	$("#search_text_normal_sample").val('');
	
	$('#superenhancer_chk').prop('checked', true);
	$('#gencode_chk').prop('checked', true);
	$('#refseq_chk').prop('checked', true);

	//수정 필요
	$("input:radio[name='ColorRradioOptions']:input[value='WtoR']").attr("checked", true);
	
	$("#comboResolution").html("500Kb");
	$("#comboBoundary").html("0Kb");
	$("#textarea_option_gene").val("");
	$("#textarea_option_gene").attr("disabled", false);
	$("table#chooseInfo > tbody").empty();
	$("table#chooseInfoPreCalled > tbody").empty();
}

var isEmpty = function(value){
	if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length )) {
		return true
	} else {
		return false
	}
}

function characteristicSearchInit( id ){
	if( id == "predefined-sv-tab" ){
		
		$("#choose-tree-cont3").hide();
		$("#choose-tree-cont1").show();
		$("#choose-tree-cont2").show();

		$("#case-inputType").val("");
		$("#case-inputType > option.sample-select-opt").remove();
		$("#case-inputName").val("");
		$("#case-inputName > option.sample-select-opt").remove();
		$("#case-inputProperty").val("");
		$("#case-inputProperty > option.sample-select-opt").remove();
		$("#case-inputSample").val("");
		$("#case-inputSample > option.sample-select-opt").remove();
		
		
		$("#control-inputType").val("");
		$("#control-inputType > option.sample-select-opt").remove();
		$("#control-inputName").val("");
		$("#control-inputName > option.sample-select-opt").remove();
		$("#control-inputProperty").val("");
		$("#control-inputProperty > option.sample-select-opt").remove();
		$("#control-inputSample").val("");
		$("#control-inputSample > option.sample-select-opt").remove();
		
		$.ajax({
			type: 'post',
			url: "getCharacteristicsSample",
			data:{ 'colName' : 'type'},
			dataType: "json",
			success: function(data) {
				for( var i=0; i<data.length; i++ ){
					$("#case-inputType").append("<option class='sample-select-opt' value='"+ data[i].type +"'>"+ data[i].type +" ("+ data[i].cnt +")" +"</option>");
				}
				
				for( var i=0; i<data.length; i++ ){
					$("#control-inputType").append("<option class='sample-select-opt' value='"+ data[i].type +"'>"+ data[i].type +" ("+ data[i].cnt +")" +"</option>");
				}
			}
		});
		
		$("#case-inputType").off().change(function(){
			$("#case-inputName").val("");
			$("#case-inputName > option.sample-select-opt").remove();
			$("#case-inputProperty").val("");
			$("#case-inputProperty > option.sample-select-opt").remove();
			$("#case-inputSample").val("");
			$("#case-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#case-inputType").val(), 'colName' : 'name'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						$("#case-inputName").append("<option class='sample-select-opt' value='"+ data[i].name +"'>"+ data[i].name +" ("+ data[i].cnt +")" +"</option>");
					}
				}
			});
		})
		
		$("#control-inputType").off().change(function(){
			$("#control-inputName").val("");
			$("#control-inputName > option.sample-select-opt").remove();
			$("#control-inputProperty").val("");
			$("#control-inputProperty > option.sample-select-opt").remove();
			$("#control-inputSample").val("");
			$("#control-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#control-inputType").val(), 'colName' : 'name'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						$("#control-inputName").append("<option class='sample-select-opt' value='"+ data[i].name +"'>"+ data[i].name +" ("+ data[i].cnt +")" +"</option>");
					}
				}
			});
		})
		
		$("#case-inputName").off().change(function(){
			$("#case-inputProperty").val("");
			$("#case-inputProperty > option.sample-select-opt").remove();
			$("#case-inputSample").val("");
			$("#case-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#case-inputType").val(), 'name': $("#case-inputName").val(), 'colName' : 'property'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						$("#case-inputProperty").append("<option class='sample-select-opt' value='"+ data[i].property +"'>"+ data[i].property +" ("+ data[i].cnt +")" +"</option>");
					}
				}
			});
		})
		
		$("#control-inputName").off().change(function(){
			$("#control-inputProperty").val("");
			$("#control-inputProperty > option.sample-select-opt").remove();
			$("#control-inputSample").val("");
			$("#control-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#control-inputType").val(), 'name': $("#control-inputName").val(), 'colName' : 'property'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						$("#control-inputProperty").append("<option class='sample-select-opt' value='"+ data[i].property +"'>"+ data[i].property +" ("+ data[i].cnt +")" +"</option>");
					}
				}
			});
		})

		$("#case-inputProperty").off().change(function(){
			$("#case-inputSample").val("");
			$("#case-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#case-inputType").val(), 'name': $("#case-inputName").val(), 'property': $("#case-inputProperty").val(), 'colName' : 'sample_id'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						var isSelected = '';
						if( i == 0 ) isSelected = 'selected';

						$("#case-inputSample").append("<option class='sample-select-opt' value='"+ data[i].sample_id +"' "+isSelected+">"+ data[i].sample_id +"</option>");
						
						if( isSelected === 'selected' ) {
							if( null2Empty($("#control-inputSample").val()) !== '' && null2Empty($("#case-inputSample").val()) !== '' ) {
								var sampleIds = [ $("#case-inputSample").val(), $("#control-inputSample").val() ];

								reloadPrecalledSVList( sampleIds );
							}
						}
					}
				}
			});
		})
		
		$("#control-inputProperty").off().change(function(){
			$("#control-inputSample").val("");
			$("#control-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#control-inputType").val(), 'name': $("#control-inputName").val(), 'property': $("#control-inputProperty").val(), 'colName' : 'sample_id'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						var isSelected = '';
						if( i == 0 ) isSelected = 'selected';

						$("#control-inputSample").append("<option class='sample-select-opt' value='"+ data[i].sample_id +"' "+isSelected+">"+ data[i].sample_id +"</option>");
						
						if( isSelected === 'selected' ) {
							if( null2Empty($("#control-inputSample").val()) !== '' && null2Empty($("#case-inputSample").val()) !== '' ) {
								var sampleIds = [ $("#case-inputSample").val(), $("#control-inputSample").val() ];

								reloadPrecalledSVList( sampleIds );
							}
						}
					}
				}
			});
		})

		$("#case-inputSample").off().change(function(){
			var sample_id1 = $(this).val();
			var sample_id2 = $("#control-inputSample").val();
			
			if( null2Empty(sample_id1) !== '' && null2Empty(sample_id2) !== '' ) {
				var sampleIds = [sample_id1, sample_id2];
	
				reloadPrecalledSVList( sampleIds );
			}
		});
		
		$("#control-inputSample").off().change(function(){
			var sample_id1 = $("#case-inputSample").val();
			var sample_id2 = $(this).val();
			
			if( null2Empty(sample_id1) !== '' && null2Empty(sample_id2) !== '' ) {
				var sampleIds = [sample_id1, sample_id2];
	
				reloadPrecalledSVList( sampleIds );
			}
		});
	}
	
	else{

		$("#sample-inputType").val("");
		$("#sample-inputType > option.sample-select-opt").remove();		
		$("#sample-inputName").val("");
		$("#sample-inputName > option.sample-select-opt").remove();
		$("#sample-inputProperty").val("");
		$("#sample-inputProperty > option.sample-select-opt").remove();
		$("#sample-inputSample").val("");
		$("#sample-inputSample > option.sample-select-opt").remove();
		
		
		$("#choose-tree-cont3").show();
		$("#choose-tree-cont1").hide();
		$("#choose-tree-cont2").hide();
			
		$.ajax({
			type: 'post',
			url: "getCharacteristicsSample",
			data:{ 'colName' : 'type'},
			dataType: "json",
			success: function(data) {
				for( var i=0; i<data.length; i++ ){
					$("#sample-inputType").append("<option class='sample-select-opt' value='"+ data[i].type +"'>"+ data[i].type +" ("+ data[i].cnt +")" +"</option>");
				}
			}
		});

		$("#sample-inputType").off().change(function(){
			$("#sample-inputName").val("");
			$("#sample-inputName > option.sample-select-opt").remove();
			$("#sample-inputProperty").val("");
			$("#sample-inputProperty > option.sample-select-opt").remove();
			$("#sample-inputSample").val("");
			$("#sample-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#sample-inputType").val(), 'colName' : 'name'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						$("#sample-inputName").append("<option class='sample-select-opt' value='"+ data[i].name +"'>"+ data[i].name +" ("+ data[i].cnt +")" +"</option>");
					}
				}
			});
		})
		
		$("#sample-inputName").off().change(function(){
			$("#sample-inputProperty").val("");
			$("#sample-inputProperty > option.sample-select-opt").remove();
			$("#sample-inputSample").val("");
			$("#sample-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#sample-inputType").val(), 'name': $("#sample-inputName").val(), 'colName' : 'property'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						$("#sample-inputProperty").append("<option class='sample-select-opt' value='"+ data[i].property +"'>"+ data[i].property +" ("+ data[i].cnt +")" +"</option>");
					}
				}
			});
		})
		
		$("#sample-inputProperty").off().change(function(){
			$("#sample-inputSample").val("");
			$("#sample-inputSample > option.sample-select-opt").remove();
			
			$.ajax({
				type: 'post',
				url: "getCharacteristicsSample",
				data:{ 'type': $("#sample-inputType").val(), 'name': $("#sample-inputName").val(), 'property': $("#sample-inputProperty").val(), 'colName' : 'sample_id'},
				dataType: "json",
				success: function(data) {
					for( var i=0; i<data.length; i++ ){
						var isSelected = '';
						if( i == 0 ) isSelected = 'selected';

						$("#sample-inputSample").append("<option class='sample-select-opt' value='"+ data[i].sample_id +"' "+isSelected+">"+ data[i].sample_id +"</option>");

//						if( isSelected === 'selected' ) {
//							reloadPrecalledSVList( [data[i].sample_id] );
//						}
					}
				}
			});
		})
		
		$("#sample-inputSample").off().change(function(){
			var sample_id = $(this).val();
			reloadPrecalledSVList( sample_id );
		});
	}
}

function clearSvTable(){
	var table = $("#precalled_sv_table").DataTable();

	table.clear().destroy();
}

function reloadPrecalledSVList( sampleId ){
	clearSvTable();

	loadPrecalledSVList( sampleId );
}

function loadPrecalledSVList( sampleIds ){
	$("#precalled_sv_table").DataTable({
		"processing": true,
		"serverSide": false,
		"ajax": {
			type     : "POST",
			cache    : false,
			dataType : 'json',
			url      : "getPrefoundedSVByOnlySampleId",
			data     : {sampleId:JSON.stringify(sampleIds)},
		},
		"bSort" : false,
		"columns": [
	            { "data": "sample" },
	            { "data": "src_chrom" },
	            { "data": "src_chrom_start" },
	            { "data": "tar_chrom" },
	            { "data": "tar_chrom_start" },
	            { "data": "sv_type" },
	            { "data": "orientation" }
	        ]
	});

	$('#precalled_sv_table').on('click', 'tbody tr', function () {
		var data = $('#precalled_sv_table').DataTable().row( $(this) ).data();

		// Boundary value initialization
		var boundaryValue = getBoundaryText2Number( $("#comboBoundary").html() );
		$("#boundaySize").val( boundaryValue );
		if (boundaryValue === 0 ) boundaryValue = 5000000;

		
		if( $("#which_tab").val() === '1' ) {
			var sample1 = $("#case-inputSample").val();
			var sample2 = $("#control-inputSample").val();

			var tbody = $("#chooseInfoPreCalled tbody");
			tbody.empty();

			if( data.sv_type !== 'TRA' ) {
				var html = "<tr>";
				html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
				html += "<td>"+sample1+"</td>";
				html += "<td>"+sample2+"</td>";
				html += "<td>"+data.src_chrom+":"+data.src_chrom_start+"-"+data.tar_chrom_start+"</td>";
				html += "<td>"+boundaryValue+"</td>";
				html += "</tr>";
				
				tbody.append(html);
			}else {
				var html = "<tr>";
				html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
				html += "<td>"+sample1+"</td>";
				html += "<td>"+sample2+"</td>";
				html += "<td>"+data.src_chrom+":"+data.src_chrom_start+"-"+data.src_chrom_start+"</td>";
				html += "<td>"+boundaryValue+"</td>";
				html += "</tr>";
				
				html += "<tr>";
				html += "<td><input type='checkbox' class='selected-sample-chk'/></td>";
				html += "<td>"+sample1+"</td>";
				html += "<td>"+sample2+"</td>";
				html += "<td>"+data.tar_chrom+":"+data.tar_chrom_start+"-"+data.tar_chrom_start+"</td>";
				html += "<td>"+boundaryValue+"</td>";
				html += "</tr>";
				
				tbody.append( html );
			}
			
			$("#chosen_sv_type").val( JSON.stringify(data) );
		}
	});
}