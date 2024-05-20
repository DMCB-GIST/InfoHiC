var t;

$(document).ready(function () {
	var samples = JSON.parse($("#json_samples").val());
	var regions = JSON.parse($("#json_regions").val());
	var type = $("#type");
	var colorPalette = $("#color_palette").val();
	var resolution = $("#resolution").val();
	
	params.resolution = resolution;
	originParams.resolution = resolution;
	normalParams.resolution = resolution;

//	$("#cancerHiCcanvas").height(300);
//	$("#chromosomeCanvas").height(50);

	$(".refreshScreen").click(function(){
		// Refresh 후 화면 깨짐 문제 해결
		controller.init2RawData();

		console.log("refresh call");
//		controller.viewer.refreshInit();
	});
	
	$(".btnUndo").click(function(){
		if( !$(this).hasClass("disabled") )	controller.doUndo();
	});
	
	$(".btnRedo").click(function(){
		if( !$(this).hasClass("disabled") )	controller.doRedo();
	});

	$("#chromosomeCanvas").hover(function(){
		$(this).css("cursor", 'pointer');
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
		saveCanvsToSvg( 'userdefine', 'raw', controller, 'raw.svg', 600, 800, 'svg' );
	});
	
	$("#rearrange-png-btn").click(function(){
		saveCanvasToFile( getCanvases('rearrange', controller), 'rearrange-contactmap', 'png' );
	});

	$("#rearrange-pdf-btn").click(function(){
		saveCanvasToFile( getCanvases('rearrange', controller), 'rearrange-contactmap', 'pdf' );
	});
	
	$("#rearrange-svg-btn").click(function(){
		saveCanvsToSvg( 'userdefine', 'rearrange', controller, 'rearrange-contactmap.svg', 600, 800, 'svg' );
	});
	
	$("input[name=svOptions]:radio").change(function(){
		var svtype = $(this).val();
		if( svtype === 'DEL' ) {
			$(".simple-manual-image").attr('src', 'resources/images/sv_del.png');
		}else if( svtype === 'INV' ) {
			$(".simple-manual-image").attr('src', 'resources/images/sv_inv.png');
		}else if( svtype === 'TRA' ) {
			$(".simple-manual-image").attr('src', 'resources/images/sv_tra.png');
		}else if( svtype === 'DUP' ) {
			$(".simple-manual-image").attr('src', 'resources/images/sv_tandup.png');
		}else {
			$(".simple-manual-image").attr('src', 'resources/images/sv_invdup.png');
		}
	});
	
	$(window).resize( function(){
//	    resizing(this, this.innerWidth, this.innerHeight) //1
//	    if (typeof t == 'undefined') resStarted() //2
	    clearTimeout(t); t = setTimeout(() => { t = undefined; controller.resized() }, 500) //3
	});
	
	var extraTracks = $("#json_extra_tracks").val();
	if( isEmpty(extraTracks) === false ) {
		var tracks = JSON.parse(extraTracks);
		
		params.extra_tracks = tracks;
	}

	params.tab_menu = 'userdefine';

	var controller = new UserDefineDynamicSvViewerController( params );
	controller.initTooltips();
	var filters = controller.getFilterSettings();
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


//function resizing(target, w, h) {
//    console.log(`Youre resizing: width ${w} height ${h}`)
//}    
//function resStarted() { 
//    console.log('Resize Started') 
//}