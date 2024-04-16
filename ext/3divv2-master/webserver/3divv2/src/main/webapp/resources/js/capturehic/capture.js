
$(document).ready(function () {
//	var arcViewerController = new ArcViewerCntroller();
	
	$.ajax({
	 	type: "POST",
	 	url: "getSampleList", //Relative or absolute path to response.php file
	 	dataType: "json",
	 	data: {  },
	 	async: false,
	 	success: function(data) {
	 		var sampleList = "";
	 		for(var i=0; i<data.length; i++) {
		 		sampleList += "<div class='custom-control custom-checkbox'>";
		 		sampleList += "	<input type='checkbox' class='custom-control-input sampleCheck' id='customCheck"+data[i].id+"' value='"+data[i].id+"&"+data[i].sample+"'>";
		 		sampleList += "	<label class='custom-control-label' for='customCheck"+data[i].id+"'>"+data[i].desc+"</label>";
		 		sampleList += "</div>";
	 		}

	 		$("#sliderdefault").append(sampleList);
	 	},
		error: function(request, status, error){
			request.status = 500;
			alert("code:"+request.status+"\n"+"message:"+request.responseText.substr(0, 10)+"...\n"+"error:"+error);
		}
	});

	$('input.typeahead').typeahead({
		hint: true,
        highlight: true, /* Enable substring highlighting */
        minLength: 1, /* Specify minimum characters required for showing result */
		source: function( query, process ) {
			return $.ajax({
				type: 'post',
				url: "autocomplete19Genes",
				dataType: "json",
				data: { value : query },
				success: function(data) {
					return typeof data == 'undefined' ? false : process(data);
				}
			});
		}
	});
	
//	$("#samplebtn").on("click", function(){	
//		if( $(this).hasClass('expaned') ) {
//			$(this).removeClass("expaned");
//			
//			$("#sliderexpand").addClass("d-none");
//			$("#sliderexpand").removeClass("d-block");
//			
//			$('#chooseMatrix').css('height', '');
//		}else {
//			$(this).addClass("expaned");
//			
//			$("#sliderexpand").removeClass("d-none");
//			$("#sliderexpand").addClass("d-block");
//			
//			$('#chooseMatrix').css('height', $('#sliderdefault').height() * 3);
//		}
//	});
	
	$("#add_samples").click(function(){
		var bait = $("#input_bait").val();
		var sample_exists = $("input[type='checkbox'].sampleCheck:checked").length;
		
		if( sample_exists < 1 ) {
			alert("You have to choose at least one sample.");
		} else if ( isEmpty(bait) ) {
			alert("You have to input a gene symbol or loci in the bait field.");
			$("#input").focus();
		} else {
			checkParam(bait);
		}
	});
	
	$("#chk_samples_all").click(function(){
		var isChecked = $(this).is(":checked");
		
		if( isChecked ) {
			$("input[type='checkbox'].sample-chk").prop("checked", true);
		} else {
			$("input[type='checkbox'].sample-chk").prop("checked", false);
		}
	});
	
	$("#remove_samples").click(function(){
		$("input[type='checkbox'].sample-chk").each(function(){
			if( $(this).is(":checked") ) {
				$(this).parent().parent().remove();
			}
		});
		
		if( $("#chk_samples_all").is(":checked") ) {
			$(this).prop("checked", false);
		}
	});
	
	$("#example_run").click(function(){
		$(".appendTr").remove();
		$("#input_bait").val('');
		
		getItem('8', 'GM', 'chr21:28217728');
		getItem('9', 'H1', 'chr21:28217728');
		getItem('10', 'HCmerge', 'chr21:28217728');
		getItem('11', 'IMR90', 'chr21:28217728');
		getItem('14', 'LV', 'chr21:28217728');
		getItem('15', 'ME', 'chr21:28217728');
		getItem('16', 'MSC', 'chr21:28217728');
		getItem('25', 'SX', 'chr21:28217728');
		getItem('26', 'TH1', 'chr21:28217728');
		getItem('27', 'X5628FC', 'chr21:28217728');
		
		$("#input_bait").val('chr21:28217728');
		
//		$("#btn_run").trigger('click');
		$("#btn_run").click();
		
	});
	
	$("#btn_run").click(function(){
		var samples = [];
		var dataOrder = 0;
		var bait = 0;
		var samplelist = "";

		$("#chooseInfo tr.appendTr").each(function() {
			var sampleId = $(this).find('td:eq(1)').text();
			bait = $(this).find('td:eq(3)').text();
			var sampleName = $(this).find('td:eq(2)').text();
			var tad = $(this).find('td:eq(4)').text();
			
			var bait_split = bait.split(":");
			var bait_correction = parseInt(bait_split[1]);
			bait = bait_split[0] + ":" + bait_correction;

			samples.push( dataOrder + ";" + sampleId + ";" + sampleName + ";" + bait + ";" + tad );
			samplelist += sampleName +"|"
			dataOrder++;
		});
		
		if( samples.length == 0 ) {
			alert("You have to choose at least one sample");
			return;
		}

		samplelist = samplelist.substr(0, samplelist.length -1);
		
		var range = $("#boundary_range option:selected").val() ;
		
		var config = {
			samples : samplelist
			,bait : bait
			,range : range
		};

		var arcViewerController = new ArcViewerCntroller(config);
	});

});

function isEmpty(val) {
	if(val == null || val == undefined || val == 'null' || val == 'undefined' || val == '' )	return true;
	
	return false;
}

function checkParam ( param ){
	if(!String.prototype.startsWith) {
		String.prototype.startsWith = function(searchString, position){
	    	position = position || 0;
			return this.substr(position, searchString.length) === searchString;
		};
	}
	
	if( param.startsWith('chr') && param.indexOf(":") ) {	
		$("input.sampleCheck[type='checkbox']:checked").each(function(){
			var input = $(this).val();
			var split = input.split("&");
			
			var id = split[0];
			var sample = split[1];
			
			getItem(id, sample, param);
			
			$("input[type='checkbox'].sampleCheck").prop("checked", false);
		});
	} else {
		// gene symbol
		checkHowManyGenesAreThere(param);
	}
};

function getItem(id, sample, bait) {
	var item = "";
	item += "<tr class='appendTr'>";
	item += "	<td class='text-center'>";
	item += "		<input type='checkbox' class='sample-chk'/>";
	item += "	</td>";
	item += "	<td class='text-center d-none'>"+id+"</td>";
	item += "	<td class='text-center'>"+sample+"</td>";
	item += "	<td class='text-center'>"+bait+"</td>";
	item += "</tr>";
	
	$("#chooseInfo").append(item);
}

function checkHowManyGenesAreThere( param ) {
	$.ajax({
		type: 'post',
		url: 'get_gene_symbols_hg19',
		data: {symbol:param},
		dataType: 'json',
		success:function(data) {
			$('.gene-symbol-list').remove();
		
			if( data.length >= 1 ) {
				
				$("#hidden-btn").click();
				
				var content = $(".modal-body");
				
				for(var i in data ) {
					if(param.indexOf("rs")==0) {
						content.append(
							"<div class='gene-symbol-list'>"
							+ "<div class='gene-symbol-list-gene'>" + param + "</div>"
							+ "<div class='gene-symbol-list-chrom'>" + data[i].chrom + " : " + comma(data[i].txStart) + " ~ " + comma(data[i].txEnd) + "</div>"
							+ "<div class='gene-symbol-list-value hidden'>" + data[i].chrom + ":" + data[i].txStart + "~" + data[i].txEnd + "</div>"
							+ "</div>"
						);
					} else {
						content.append(
							"<div class='gene-symbol-list'>"
							+ "<div class='gene-symbol-list-gene'>" + param + "</div>"
							+ "<div class='gene-symbol-list-chrom'>" + data[i].chrom + " : " + comma(data[i].txStart) + " ~ " + comma(data[i].txEnd) + " ( " + data[i].strand + " ) </div>"
							+ "<div class='gene-symbol-list-value hidden'>" + data[i].chrom + ":" + data[i].txStart + "~" + data[i].txEnd + "(" + data[i].strand + "</div>"
							+ "</div>"
						);
					}
				}

				$(".gene-symbol-list").click(function(){
					var valObj = $(this).find(".gene-symbol-list-value");
					
					var breakedItems = valObj.text();
					
					if( breakedItems.split("(")[1] == "+" ) {
						breakedItems = breakedItems.split("~")[0];
					} else {
						var chr = breakedItems.split(":")[0];
						var bait = breakedItems.split("~")[1];
						bait = bait.split("(")[0];
						
						breakedItems = chr + ":" + bait;
					}
					
					$("input.sampleCheck[type='checkbox']:checked").each(function(){
						var input = $(this).val();
						var split = input.split("&");
						
						var id = split[0];
						var sample = split[1];
						
						getItem(id, sample, breakedItems);
						
						$("input.sampleCheck[type='checkbox']").prop("checked", false);
					});
					
					$("#exampleModal .close").click();
				});
			} else {
				alert("We can not find any result : " + param);
			}
		}
	});
}