'use strict'

var ArcViewerCntroller = function( config ){
	if( config != undefined )	this.config = JSON.parse( JSON.stringify(config) );

	this.smx = -1;	// mouse zoom in start
	this.emx = -1;	// mouse zoom in end
	this.my = -1;

	this.isZoominDrag = false;
	this.isPanningDrag = false;
	
	this.tracks = [];
	
	this.selPromoter = {x1:-1, x2:-1};
	
	this.init();
};

ArcViewerCntroller.prototype.zoomin = function( ratio ) {
	if( this.tracks.length > 0 )	{
		var start = this.tracks[0].config.data.currentStart;
		var end = this.tracks[0].config.data.currentEnd;
		var length = end - start + 1;

		start += parseInt( (length * ratio) );
		end -= parseInt( (length * ratio) );

		this.zoom(start, end);
	}
};

ArcViewerCntroller.prototype.zoomout = function( ratio ) {
	if( this.tracks.length > 0 )	{
		var start = this.tracks[0].config.data.currentStart;
		var end = this.tracks[0].config.data.currentEnd;
		var length = end - start + 1;

		start -= parseInt( (length * ratio) );
		end += parseInt( (length * ratio) );
		
		if( start < this.tracks[0].config.data.start )	start = this.tracks[0].config.data.start;
		if( end > this.tracks[0].config.data.end )		end = this.tracks[0].config.data.end;

		this.zoom(start, end);
	}
};

ArcViewerCntroller.prototype.controlsActionSettings = function() {
	var obj = this;

	$(".fit2Scrn").on('click', function(){
		if( obj.tracks.length > 0 )		obj.fit2scrn();
	});
	$('.zoomin_15').on('click', function(){
		obj.zoomin( 0.15 );
	});
	$('.zoomin_30').on('click', function(){
		obj.zoomin( 0.3 );
	});
	$('.zoomout_15').on('click', function(){
		obj.zoomout(0.15);
	});
	$('.zoomout_30').on('click', function(){
		obj.zoomout(0.3);
	});
	
	$(".btn-svg-download").on('click', function(){
		var width = 800;
		if( obj.tracks !== undefined && obj.tracks.length > 0 ) {
			width = obj.tracks[0].canvas.width;
		}

		savePcHicCanvasToSvg( obj, width, 1000 );
	});

	$("#pvalueRange").change(function(){
		var nPvalue = parseFloat( $("#pvalueRange").val() );

//		$("#txt_pvalue").val( nPvalue.toFixed(2) );
		$("#txt_pvalue").val( nPvalue.toFixed(0) );

		if( obj.tracks.length > 0 )	{
			for( var i=0; i<obj.tracks.length; i++) {
				if( obj.tracks[i].config.type=="data" ) {
					obj.tracks[i].config.data.cutoff = nPvalue;
					obj.tracks[i].clear();

					obj.tracks[i].draw();
				}
			}
		}
	});
	$("#pvalue_inc").on('click', function(){
//		var nPvalue = parseFloat($("#pvalueRange").val()) + 0.01;
		var nPvalue = parseFloat($("#pvalueRange").val()) + 1;
		if( nPvalue > 10 ) nPvalue = 10;

		$("#pvalueRange").val( nPvalue );

//		$("#txt_pvalue").val( nPvalue.toFixed(2) );
		$("#txt_pvalue").val( nPvalue.toFixed(0) );

		if( obj.tracks.length > 0 )	{
			for( var i=0; i<obj.tracks.length; i++) {
				if( obj.tracks[i].config.type=="data" ) {
					obj.tracks[i].config.data.cutoff = nPvalue;
					obj.tracks[i].clear();

					obj.tracks[i].draw();
				}
			}
		}
	});
	$("#pvalue_dec").on('click', function(){
//		var nPvalue = parseFloat($("#pvalueRange").val()) - 0.01;
		var nPvalue = parseFloat($("#pvalueRange").val()) - 1;
		if( nPvalue < 0 ) nPvalue = 0;
		
		$("#pvalueRange").val( nPvalue );

//		$("#txt_pvalue").val( nPvalue.toFixed(2) );
		$("#txt_pvalue").val( nPvalue.toFixed(0) );

		if( obj.tracks.length > 0 )	{
			for( var i=0; i<obj.tracks.length; i++) {
				if( obj.tracks[i].config.type=="data" ) {
					obj.tracks[i].config.data.cutoff = nPvalue;
					obj.tracks[i].clear();

					obj.tracks[i].draw();
				}
			}
		}
	});
	
	$("#chk_po_display").change(function(){
		var isChecked = $(this).is(':checked');
	
		if( obj.tracks.length > 0 )	{
			for( var i=0; i<obj.tracks.length; i++) {
				if( obj.tracks[i].config.type=="data" ) {
					obj.tracks[i].config.isDisplayPoInteraction = isChecked;
					obj.tracks[i].clear();

					obj.tracks[i].draw();
				}
			}
		}
	});
	$("#sel_val").change(function(){
		var sel = $(this).val();
		var barType = "normalized";
		if( sel == "Raw count" ) 				barType = 'raw';

		if( obj.tracks.length > 0 )	{
			for( var i=0; i<obj.tracks.length; i++) {
				if( obj.tracks[i].config.type=="data" ) {
					obj.tracks[i].config.barDataType = barType;
					console.log( obj.tracks[i].config.barDataType + " " + barType );
					obj.tracks[i].clear();

					obj.tracks[i].draw();
				}
			}
		}
	});
};

ArcViewerCntroller.prototype.init = function() {
	var obj = this;

	$(".canvas-frame").empty();
	
	this.controlsActionSettings();

	$.ajax({
		type: 'post',
		url: 'getArcViewerData',
		dataType: 'json',
		data: { samples: obj.config.samples, bait: obj.config.bait, boundary: obj.config.range },
		success:function(jData) {
			var params = {
				type:'header'
				, data:jData
				, container:'canvas-top'
				, controller: obj
				, X_MARGIN:100
			};

			var header = new ChimerArcViewer( params );
			obj.tracks.push( header );

			var samples = Object.keys( jData.data );
			for( var i=0; i<samples.length; i++) {
				var params = {
					type:'data'
					, ord:i
					, n_samples:samples.length
					, data:{bait:jData.bait, promoter_start:jData.promoter_start, promoter_end:jData.promoter_end, start:jData.start, end:jData.end, chrom:jData.chrom, data:jData.data[samples[i]]}
					, title:samples[i]
					, container:'canvas-data-' + i
					, controller:obj
					, X_MARGIN:100
				};
				
				var arcData = new ChimerArcViewer( params );
				obj.tracks.push( arcData );
			}

			var params = {
				type:'gene'
				, data:{bait:jData.bait, promoter_start:jData.promoter_start, promoter_end:jData.promoter_end, start:jData.start, end:jData.end, chrom:jData.chrom}
				, title:'gene'
				, container:'canvas-gene'
				, boundary : obj.config.range
				, controller:obj
				, X_MARGIN:100
			};
			var gene = new GeneViewer( params );
			obj.tracks.push( gene );
			
			var params = {
				type:'gencode'
				, data:{bait:jData.bait, promoter_start:jData.promoter_start, promoter_end:jData.promoter_end, start:jData.start, end:jData.end, chrom:jData.chrom}
				, title:'gencode'
				, container:'canvas-gencode'
				, boundary : obj.config.range
				, controller:obj
				, X_MARGIN:100
			};
			var gencode = new GencodeViewer( params );
			obj.tracks.push( gencode );

			for( var i=0; i<obj.tracks.length; i++ )	obj.tracks[i].draw();

			$(window).resize(function(){
				for(var i=0; i<obj.tracks.length; i++)	obj.tracks[i].resize();
			});
		}
	});
};

ArcViewerCntroller.prototype.zoom = function(currentStart, currentEnd) {
	for( var i=0; i<this.tracks.length; i++ ){
		this.tracks[i].initXscaler( currentStart, currentEnd );
		this.tracks[i].clear();
		this.tracks[i].draw();
	}
};

ArcViewerCntroller.prototype.fit2scrn = function() {
	this.zoom( this.tracks[0].config.data.start, this.tracks[0].config.data.end );
};