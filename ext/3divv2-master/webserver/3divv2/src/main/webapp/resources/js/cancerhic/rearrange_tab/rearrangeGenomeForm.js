$(document).ready(function () {
	var samples = JSON.parse($("#json_samples").val());
	var regions = JSON.parse($("#json_regions").val());
	var type = $("#type");
	var colorPalette = $("#color_palette").val();
	var resolution = $("#resolution").val();

//	var textarea_bed_format = $("#textarea_bed_format").val();
	
	params.resolution = resolution;
	originParams.resolution = resolution;
	normalParams.resolution = resolution;

//	var input_query = regions;
//	for(var i=0; i<regions.length; i++) {
//		input_query += regions[i] + ";\n";
//	}
//	$("#textarea_bed_format").val( input_query );

	
//	Output 화면에서 다시 집어 넣고 검색할 경우 처리하는 example
	$("#btn_example").click(function(){
		var example_string = "chr19:1-11064109;chr17:7,858,769-83257441\nchr20:1-17070762;chr19:14867959-58617616\nchr17:1-6643610;chr20:18560020-64444167";
		$("#textarea_bed_format").val( example_string );
	})
	
	$("#btn_apply").click(function(){
		var choosedRegions = [];
		var choosedSamples = [];

		var onePicedSample = samples[0];

//		var format_string = $("#textarea_bed_format").val().replace(/\n/gi, '').replace(/\t/gi, '').replace(/\s/gi, '');
		var format_string = $("#textarea_bed_format").val().replace(/\t/gi, '').replace(/ /gi, '');
		
		var tadMap = getTadFragments( $("#textarea_bed_format").val() );
		filters['tadMap'] = tadMap;
		
		var value1 = $("#departed_in_cis_value").val();
		var value2 = $("#new_contact_value").val();

		if( !isEmpty( format_string ) ) {
			if( isEmpty(value1) ) {
				alert("You have to input a value");
				$("#departed_in_cis_value").focus();
				return;
			}
			if( isEmpty(value2) ){
				alert("You have to input a value");
				$("#new_contact_value").focus();
				return;
			}

			var retObj = CancerViewerController.isCorrectQuery( format_string );
			
			var genomeObj = JSON.parse($("#genomeSize").val());

			if( retObj.msg_code === '000' ) {
				for(var i=0; i<retObj.data.length; i++) {
					var nChrom = retObj.data[i].chrom;
					var nChromStart = retObj.data[i].chromStart;
					var nChromEnd = retObj.data[i].chromEnd;

					if( genomeObj[nChrom].length < nChromEnd )
						nChromEnd = genomeObj[nChrom].length;
					
					if( nChromStart < 0 ) nChromStart = 1;
					
					var newRegion = nChrom + ":" + nChromStart + "-" + nChromEnd;

					 choosedRegions.push( newRegion );
					choosedSamples.push( onePicedSample );
				}
				
				filters.regions = JSON.stringify(choosedRegions);

				controller.loadingData( filters );
			}
		}else {
			alert("You have to input a query");
			return;
		}
	});
	
	$(".rulerCanvasClass").hover(function(){
		$(this).css("cursor", 'pointer');
	});
	
	$("#raw-png-btn").click(function(){
		saveCanvasToFile( getCanvases('raw', controller), 'raw-contactmap', 'png' );
	});
	
	$("#raw-pdf-btn").click(function(){
		saveCanvasToFile( getCanvases('raw', controller), 'raw-contactmap', 'pdf' );
	});
	
	$("#raw-svg-btn").click(function(){
		saveCanvsToSvg( 'rearrange', 'raw', controller, 'raw.svg', 600, 800, 'svg' );
	});
	
	$("#rearrange-png-btn").click(function(){
		saveCanvasToFile( getCanvases('rearrange', controller), 'rearrange-contactmap', 'png' );
	});

	$("#rearrange-pdf-btn").click(function(){
		saveCanvasToFile( getCanvases('rearrange', controller), 'rearrange-contactmap', 'pdf' );
	});
	
	$("#rearrange-svg-btn").click(function(){
		saveCanvsToSvg( 'rearrange', 'rearrange', controller, 'rearrange-contactmap.svg', 600, 800, 'svg' );
	});
	
	$(".rearrange-new-contact-change-form").on('keyup', function (event) {
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

	var extraTracks = $("#json_extra_tracks").val();
	if( isEmpty(extraTracks) === false ) {
		var tracks = JSON.parse(extraTracks);
		
		params.extra_tracks = tracks;
	}

	params.tab_menu = 'rearrangement';
	
	var tadMap = getTadFragments( $("#textarea_bed_format").val() );
	var controller = new RearrangeGenomeViewerController( params );
	controller.initTooltips();
	
	
	var regions = JSON.parse($("#json_regions").val());

	var filters = controller.getFilterSettings();

	filters['tadMap'] = tadMap;

	controller.loadingData( filters );
});

function getCanvases(type, controller) {
	var canvases = [];

	if( type === 'raw' ) {
		canvases.push("cancerHiCoriginCanvas");
		canvases.push("chromosomeOriginCanvas");
		canvases.push("rullerOriginCanvas");
	
		if( controller.originDataViewer.superEnhancerContainer !== undefined )	canvases.push( $(controller.originDataViewer.superEnhancerContainer).attr('id') );
		if( controller.originDataViewer.gencodeGenesCanvas !== undefined )		canvases.push( $(controller.originDataViewer.gencodeGenesCanvas).attr('id') );
		if( controller.originDataViewer.refseqGenesCanvas  !== undefined )		canvases.push( $(controller.originDataViewer.refseqGenesCanvas).attr('id') );
	}else {
		canvases.push("cancerHiCcanvas");
		canvases.push("chromosomeCanvas");
		canvases.push("rullerCanvas");
	
		if( controller.viewer.superEnhancerContainer !== undefined )	canvases.push( $(controller.viewer.superEnhancerContainer).attr('id') );
		if( controller.viewer.gencodeGenesCanvas !== undefined )		canvases.push( $(controller.viewer.gencodeGenesCanvas).attr('id') );
		if( controller.viewer.refseqGenesCanvas  !== undefined )		canvases.push( $(controller.viewer.refseqGenesCanvas).attr('id') );
	}
	return canvases;
}