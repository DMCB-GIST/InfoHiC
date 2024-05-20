$(document).ready(function () {
//	var samples = JSON.parse($("#json_samples").val());
//	var regions = JSON.parse($("#json_regions").val());
	var resolution = $("#resolution").val();
//	var type = $("#type");
//	var colorPalette = $("#color_palette").val();

//
//	var data = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
//		data += data
//		// LZ4 can only work on Buffers
//		var input = Buffer.from(data)
//		// Initialize the output buffer to its maximum length based on the input data
//		var output = Buffer.alloc( LZ4.encodeBound(input.length) )
//
//		// block compression (no archive format)
//		var compressedSize = LZ4.encodeBlock(input, output)
//		// remove unnecessary bytes
//		output = output.slice(0, compressedSize)
//
//		console.log( "compressed data", output )
//
//		// block decompression (no archive format)
//		var uncompressed = Buffer.alloc(input.length)
//		var uncompressedSize = LZ4.decodeBlock(output, uncompressed)
//		uncompressed = uncompressed.slice(0, uncompressedSize)
//
//		console.log( "uncompressed data", uncompressed )
	
	params.resolution = resolution;
	originParams.resolution = resolution;
	normalParams.resolution = resolution;
//	$("#cancerHiCcanvas").height(300);
//	$("#chromosomeCanvas").height(50);

	$('#precalled_sv_table').on('click', 'tbody tr', function () {
		var data = $('#precalled_sv_table').DataTable().row( $(this) ).data();
		

		// Data initialization
		controller.init2RawData();

		controller.displaySvFeature( data );

		$("#precalled_sv_table tbody tr").each(function(){
			$(this).css("background", "black");
			if( $(this).hasClass('odd') )	$(this).css("background", "#eeeeee");	
			else							$(this).css("background", "#ffffff");
		});
		
		$(this).css("background", "rgb(15, 171, 255)");

//		var bin1 = null;
//		var bin2 = null;
//		if( data.sv_type === 'DEL' || data.sv_type === 'INV' || data.sv_type === 'DUP' || data.sv_type === 'TRA' ) {
//			var chromosomeBands = controller.getChromosomeBands();
//
//			for(var i=0; i<chromosomeBands.length; i++) {
//				if( data.src_chrom === chromosomeBands[i].chrom && chromosomeBands[i].chromStart <= parseInt(data.src_chrom_start) && chromosomeBands[i].chromEnd >= parseInt(data.src_chrom_start) ) {
//					var hitObj = chromosomeBands[i];
//					var xPos = hitObj.genomicScale( parseInt(data.src_chrom_start) );
//					var bin = parseInt(hitObj.scale(xPos));
//					
////					var diff = parseInt(data.src_chrom.replace('chr', '')); // 추후 반드시 삭제
//					var diff = 0;
//
//					bin1 = { chr:hitObj.chrom, bin:bin - diff, x:xPos, chromPos:data.src_chrom_start, chromIdx:i };
//				}
//
////				console.log( chromosomeBands[i].chrom + " vs " + data.tar_chrom + "    and   " + chromosomeBands[i].chromStart + "   " + data.tar_chrom_start + "    " + chromosomeBands[i].chromEnd + " " + data.tar_chrom_start);
//				if( data.tar_chrom === chromosomeBands[i].chrom && chromosomeBands[i].chromStart <= parseInt(data.tar_chrom_start) && chromosomeBands[i].chromEnd >= parseInt(data.tar_chrom_start) ) {
//					var hitObj = chromosomeBands[i];
//
//					var xPos = hitObj.genomicScale( parseInt(data.tar_chrom_start) );
//					var bin = parseInt(hitObj.scale(xPos));
//					
////					var diff = parseInt(data.tar_chrom.replace('chr', '')); // 추후 반드시 삭제
//					var diff = 0;
//
//					bin2 = { chr:hitObj.chrom, bin:bin - diff, x:xPos, chromPos:data.tar_chrom_start, chromIdx:i };
//				}
//			}
//
//			if( bin1 != null && bin2 != null ){
//				if( bin1.bin > bin2.bin ) {
//					var tmp = jsonCopy(bin1);
//					bin1 = bin2;
//					bin2 = tmp;
//				}
//
//				controller.prevSvItem = { bin1:bin1, bin2:bin2, svtype:data.sv_type };
//
//				if( data.sv_type === 'DEL' || data.sv_type === 'INV' )
//					controller.doGenomicVariations( bin1, bin2, bin1, data.sv_type, false );
//				else{
//					controller.doGenomicVariationsInPredefined( bin1, bin1, bin2, data.sv_type, false );
//				}
//			}
//		}
	} );
	
	$(".rulerCanvasClass").hover(function(){
		$(this).css("cursor", 'pointer');
	});

	$("#normal-png-btn").click(function(){
		saveCanvasToFile( getCanvases('normal', controller), 'normal-contactmap', 'png' );
	});
	
	$("#normal-pdf-btn").click(function(){
		saveCanvasToFile( getCanvases('normal', controller), 'normal-contactmap', 'pdf' );
	});
	
	$("#normal-svg-btn").click(function(){
		saveCanvsToSvg( 'predefined', 'normal', controller, 'normal.svg', 600, 800, 'svg' );
	});

	$("#tumor-png-btn").click(function(){
		saveCanvasToFile( getCanvases('tumor', controller), 'tumor-contactmap', 'png' );
	});

	$("#tumor-pdf-btn").click(function(){
		saveCanvasToFile( getCanvases('tumor', controller), 'tumor-contactmap', 'pdf' );
	});
	
	$("#tumor-svg-btn").click(function(){
		saveCanvsToSvg( 'predefined', 'tumor', controller, 'tumor.svg', 600, 800, 'svg' );
	});
	
	$("#rearrange-png-btn").click(function(){
		saveCanvasToFile( getCanvases('rearrange', controller), 'rearrange-contactmap', 'png' );
	});

	$("#rearrange-pdf-btn").click(function(){
		saveCanvasToFile( getCanvases('rearrange', controller), 'rearrange-contactmap', 'pdf' );
	});
	
	$("#rearrange-svg-btn").click(function(){
		saveCanvsToSvg( 'predefined', 'rearrange', controller, 'rearrange.svg', 600, 800, 'svg' );
	});
	
	$(".refreshScreen").click(function(){
		// Refresh 후 화면 깨짐 문제 해결
		controller.init2RawData();

		controller.prevSvItem = null;
//		controller.viewer.refreshInit();
	});

	var extraTracks = $("#json_extra_tracks").val();
	if( isEmpty(extraTracks) === false ) {
		var tracks = JSON.parse(extraTracks);
		params.extra_tracks = tracks;
	}
	
	var optionGene = $("#json_option_gene").val();
	if( isEmpty(optionGene) === false ) {
		var optionGene = JSON.parse(optionGene);
		params.input_option_gene = optionGene;
	}

	params.tab_menu = 'precalled';

	var controller = new PrecalledSvViewerController( params );
	controller.initTooltips();
	
	var filters = controller.getFilterSettings();

	var svTable = controller.loadPrecalledSVList();

	controller.loadingData( filters );
});

function getCanvases(type, controller) {
	var canvases = [];

	if( type === 'normal' ) {
		canvases.push("normalHiCcanvas");
		canvases.push("chromosomeNormalCanvas");
		canvases.push("rullerNormalCanvas");
	
		if( controller.normalDataViewer.superEnhancerContainer !== undefined )	canvases.push( $(controller.normalDataViewer.superEnhancerContainer).attr('id') );
		if( controller.normalDataViewer.gencodeGenesCanvas !== undefined )		canvases.push( $(controller.normalDataViewer.gencodeGenesCanvas).attr('id') );
		if( controller.normalDataViewer.refseqGenesCanvas  !== undefined )		canvases.push( $(controller.normalDataViewer.refseqGenesCanvas).attr('id') );
	}else if( type === 'tumor' ) {
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
