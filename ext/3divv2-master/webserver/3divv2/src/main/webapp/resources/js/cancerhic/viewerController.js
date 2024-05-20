$(document).ready(function () {
//	var samples = ['Data'];
////	var regions = ['chr1', 'chr3', 'chr5', 'chr7', 'chr6', 'chr2', 'chr4', 'chrX', 'chrY', 'chr22'];
////	var regions = ['chr3', 'chr2', 'chr1', 'chr5'];
//	var regions = ['chr1', 'chr2', 'chr3'];
////	var regions = ['chr3', 'chr2'];
////	var regions = ['chr1'];
	
	var samples = JSON.parse($("#json_samples").val());
	var regions = JSON.parse($("#json_regions").val());
	var type = $("#type");
	var threshold = $("#colourScaleRange").val();
	
	var samplesJsonData = JSON.stringify(samples);
	var regionsJsonData = JSON.stringify(regions);

	var str = "";
	for(var i=0; i<regions.length; i++) 	str += regions[i] + ";\n";	
	$("#textarea_bed_format").val( str );

	var params = {
			container:'cancerHiCcanvas'
			, chrContainer:'chromosomeCanvas'
			, gencodeContainer:'gencodeContainer'
			, refseqContainer:'refseqContainer'
			, superenhancerContainer:'seContainer'
			, svListContainer:'svContainer'
			, chrBandHeight:15
	};

	var controller = new CHiC_CancerViewerController( params );

	if( controller.isSupportingWebWorker() ) {
	    // web worker를 위한 코드 부분 }
		console.log("Can do worker");

		$("#btn_apply").click(function(){
			var format_string = $("#textarea_bed_format").val().replace(/\n/gi, '').replace(/\t/gi, '').replace(/\s/gi, '');
			if( !isEmpty(format_string) ) {
				var retObj = controller.isCorrectQuery( format_string );
				
				if( retObj.msg_code === '000' ) {
					$("#json_regions").val( retObj.data );
					
					var samples = $("#json_samples").val();
					var regions = $("#json_regions").val();
					var threshold = $("#colourScaleRange").val();

					// 입력된 chromosome 순서 정하기
					var chromOrder = [];
					for(var i=0; i<regions.length; i++) {
						chromOrder.push( regions[i].split(":")[0] + "-" + i );
					}

					var filters = {
							samples: samples
							, regions: regions
							, threshold: threshold
							, chromOrder: chromOrder
					};

					controller.loadingData( filters );
				}else {
					alert( retObj.msg_text );
				}
			}
		});

		$("#btn_example").click(function(){
			var example_string = "chr5:253,287-2,295,162;\nchr17:11,196,312-51,277,500;\nchr2:9,415,640-22,144,477;\nchr3:30,396,490-62,559,688;\nchr7:15,086,725-65,275,031;";

			$("#textarea_bed_format").val( example_string );
			
			$("#btn_apply").click();
		});
		
		// 최초 실행
		$("#btn_apply").click();
	}else {
		alert("Sorry! Your can use our viewer on Web browser which is supporting WebWorker functions. current version of Chorme, Safari, Firefox and Edge");

	    // web worker를 지원하지 않는 브라우저를 위한 안내 부분
		console.log("Can not do worker");
	}
});