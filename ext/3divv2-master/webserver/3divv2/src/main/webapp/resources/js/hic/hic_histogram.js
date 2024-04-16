var HicHistogram = function( config ) {
    this.config = JSON.parse( JSON.stringify(config) );
    
    if( this.config.LINE_CHART_HEIGHT === undefined )				this.config.LINE_CHART_HEIGHT = 300;
//    if( this.config.AVE_HIC_SUM_CHART_HEIGHT === undefined )		this.config.AVE_HIC_SUM_CHART_HEIGHT = 60;
    if( this.config.THRESHOLD === undefined )						this.config.THRESHOLD = 0;
    if( this.config.peakDrawingType === undefined )					this.config.peakDrawingType = 'bar';
    if( this.config.SMOOTHNING_LAYER_HEIGHT === undefined )			this.config.SMOOTHNING_LAYER_HEIGHT = 5;
    if( this.config.REMAINDER === undefined )						this.config.REMAINDER = 40;
    if( this.config.ARC_TRACK_HEIGHT === undefined )				this.config.ARC_TRACK_HEIGHT = 120;
    if( this.config.DEFAULT_FOLDCHANGE_THRESHOLD === undefined )	this.config.DEFAULT_FOLDCHANGE_THRESHOLD = 2;
};
var heatmap_resolution="5000";
var dragBoundaryHeight = 20;

HicHistogram.prototype.makeSubFramesInMainFrame = function( frame ) {
	var obj = this;

	var frameArccordion = $("<div id='graph-frame-arccordion-" + this.config.dataOrder + "' class='packaged-frame-arccordion' style='height:40px;'></div>");
	var frameTitle = $("<div id='graph-frame-title-" + this.config.dataOrder + "' class='packaged-frame-title'>"+this.config.sampleName+"</div>");
	var frameHeatmap = $("<div id='graph-frame-heatmap-" + this.config.dataOrder + "' class='packaged-frame-heatmap' style='height:490px;'></div>");
	var frameGraph = $("<div id='graph-frame-graph-" + this.config.dataOrder + "' style='position:relative;' class='packaged-frame-graph'></div>");
	
	var frameArc = $("<div id='graph-frame-arc-" + this.config.dataOrder + "' class='packaged-frame-arc' style='position:relative;'></div>");
	var frameEnhancer = $("<div id='graph-frame-enhancer-" + this.config.dataOrder + "' class='packaged-frame-enhancer'></div>");
	var frameGene = $("<div id='graph-frame-gene-" + this.config.dataOrder + "' class='packaged-frame-gene'></div>");
	var frameGencode = $("<div id='graph-frame-gencode-" + this.config.dataOrder + "' class='packaged-frame-gencode'></div>");
	var frameTargetGeneList = $("<div id='graph-frame-targetlist-" + this.config.dataOrder + "' class='packaged-frame-targetlist'></div>");
	
	var heatmapAccordion = $("<button id='heatmap-accordion-" + this.config.dataOrder + "' class='button onOffButton expaned' style='margin-top:5px; margin-right:10px; float: right;'>Heatmap close</button>");
	var graphAccordion = $("<button id='graph-accordion-" + this.config.dataOrder + "' class='button onOffButton expaned' style='margin-top:5px; margin-right:10px; float: right;'>Graph close</button>");
	var arcAccordion = $("<button id='arc-accordion-" + this.config.dataOrder + "' class='button onOffButton expaned' style='margin-top:5px; margin-right:10px; float: right;'>Arc close</button>");
	var geneAccordion = $("<button id='gene-accordion-" + this.config.dataOrder + "' class='button onOffButton expaned' style='margin-top:5px; margin-right:10px; float: right;'>Gene close</button>");

	var saveAsImagesArccordion = $("<div id='saveAsImage-frame-"+ this.config.dataOrder+ "' style='display:flex;'><button id='saveAsImages-accordion-" + this.config.dataOrder + "' class='button expaned save-image-btn' style='margin-top:5px; margin-left:10px; float: left;'>save as Images</button><div id='download-sel-btn-"+this.config.dataOrder+"' class='hidden' style='padding:10px; background-color:#fff; margin:5px 0px 0px 5px; border-radius:5px;'><span class='selectType-"+this.config.dataOrder+"' id='SVG' style='border:2px solid lightgray; padding:5px; font-weight:bold; margin-right:5px; background-color:#ececec; border-radius:5px; cursor:pointer; font-size:11px;'>SVG</span><span class='selectType-"+this.config.dataOrder+"' id='PNG' style='border:2px solid lightgray; padding:5px; font-weight:bold; margin-right:5px; background-color:#ececec; border-radius:5px; cursor:pointer; font-size:11px;'>PNG</span><span class='selectType-"+this.config.dataOrder+"' id='PDF' style='border:2px solid lightgray; padding:5px; font-weight:bold; background-color:#ececec; border-radius:5px; cursor:pointer; font-size:11px;'>PDF</span></div></div>");
//	var saveAsImagesArccordion2 = $("<button id='saveAsImages2-accordion-" + this.config.dataOrder + "' class='button expaned save-image2-btn' style='margin-top:5px; margin-left:10px; float: left;'>save as Images2</button>");

	var frameZoom = $("<div id='frame-zoom-" + this.config.dataOrder + "' class='zoom-frame' style=''></div>");
	var zoom_in = $("<span>Zoom in </span><button id='zoom-in-" + this.config.dataOrder + "' class='zoom-btn' style=''>1.5X</button>");
	var zoom_in_3x = $("<button id='zoom-in-3x-" + this.config.dataOrder + "' class='zoom-btn' style=''>3X</button>");

	var zoom_out = $("<span style='margin-left:30px;'>Zoom out </span><button id='zoom-out-" + this.config.dataOrder + "' class='zoom-btn' style=''>1.5X</button>");
	var zoom_out_3x = $("<button id='zoom-out-3x-" + this.config.dataOrder + "' class='zoom-btn' style=''>3X</button>");
	
//	var startPoint = $("<input type='hidden' id='statPt-"+ this.config.dataOrder +"'/>");
//	var endPoint = $("<input type='hidden' id='endPt-"+ this.config.dataOrder +"'/>");
	
	frameArccordion.append(geneAccordion);
	frameArccordion.append(arcAccordion);
	frameArccordion.append(graphAccordion);
	frameArccordion.append(heatmapAccordion);
	
//	frameArccordion.append(startPoint);
//	frameArccordion.append(endPoint);
		
	frameArccordion.append(saveAsImagesArccordion);
//	frameArccordion.append(saveAsImagesArccordion2);

	frameZoom.append(zoom_in);
	frameZoom.append(zoom_in_3x);
	frameZoom.append(zoom_out);
	frameZoom.append(zoom_out_3x);
	

	
	
	$(saveAsImagesArccordion).on('mouseover', function(){
		var id = $($(this)[0]).attr("id");
		var order = id.split("saveAsImage-frame-")[1];
		
		$(".selectType-"+ order).off("click").click( function() {
			selectType(this.id , obj.config);
		})

		$("#download-sel-btn-"+order).removeClass("hidden");
		
	}).on('mouseout', function(){
		var id = $($(this)[0]).attr("id");
		var order = id.split("saveAsImage-frame-")[1];
		
		$("#download-sel-btn-"+order).addClass("hidden");
	})


	$(heatmapAccordion).on("click", function(){
		if( $(this).hasClass('expaned') ) {
			$(this).removeClass("expaned");
			$(this).addClass("btnCloseColor");
			$(frameHeatmap).hide();
			$(heatmapAccordion).text("Heatmap open");
		}else {
			$(this).addClass("expaned");
			$(this).removeClass("btnCloseColor");
			$(frameHeatmap).show();
			$(heatmapAccordion).text("Heatmap close");
		}
	});
	
	$(graphAccordion).on("click", function(){
		if( $(this).hasClass('expaned') ) {
			$(this).removeClass("expaned");
			$(this).addClass("btnCloseColor");
			$(frameGraph).hide();
			$(graphAccordion).text("Graph open");
		}else {
			$(this).addClass("expaned");
			$(this).removeClass("btnCloseColor");
			$(frameGraph).show();
			$(graphAccordion).text("Graph close");
		}
	});
	
	$(arcAccordion).on("click", function(){
		if( $(this).hasClass('expaned') ) {
			$(this).removeClass("expaned");
			$(this).addClass("btnCloseColor");
			$(frameArc).hide();
			$(arcAccordion).text("Arc open");
		}else {
			$(this).addClass("expaned");
			$(this).removeClass("btnCloseColor");
			$(frameArc).show();
			$(arcAccordion).text("Arc close");
		}
	});
	
	$(geneAccordion).on("click", function(){
		if( $(this).hasClass('expaned') ) {
			$(this).removeClass("expaned");
			$(this).addClass("btnCloseColor");
			$(frameEnhancer).hide();
			$(frameGene).hide();
			$(frameGencode).hide();
			$(geneAccordion).text("Gene open");
		}else {
			$(this).addClass("expaned");
			$(this).removeClass("btnCloseColor");
			$(frameEnhancer).show();
			$(frameGene).show();
			$(frameGencode).show();
			$(geneAccordion).text("Gene close");
		}
	});
	
	var targetListTable = "<table id='target-gene-list-"+obj.config.dataOrder+"' class='targetGeneList'><tr><th>No.</th><th>Chromosome</th><th>Start</th><th>End</th><th>Gene Name</th><th>Locus</th></tr><tr class='targetGene-"+obj.config.dataOrder+"'><td colspan='6'>If you want to see the results, click on the arc.</td></tr></table>";
	
	frameTargetGeneList.append(targetListTable);
	
	frame.append(frameTitle);
	frame.append(frameArccordion);
	frame.append(frameZoom);
	frame.append(frameHeatmap);
	frame.append(frameGraph);
	frame.append(frameArc);
	frame.append(frameEnhancer);
	frame.append(frameGene);
	frame.append(frameGencode);
	frame.append(frameTargetGeneList);
	
	return frame;
};

HicHistogram.prototype.settingCanvas = function(div) {
	var canvas = d3.select("#graph-frame-graph-" + this.config.dataOrder)
	.append("svg")
	.attr("id", "canvas-" + this.config.dataOrder)
	.attr("width", 1022)
	.attr("height", 294)
	.style("display", "block")
	.attr("viewBox","0 0 " + div.width() +" " + 294 )
	.style("background-color","white")
	;

    this.HEIGHT = $("#canvas-" + this.config.dataOrder).height();
    this.WIDTH = $("#canvas-" + this.config.dataOrder).width();
    this.PADDING = 50;
    this.LEFT_OFFSET = 100;
};

HicHistogram.prototype.init = function( frame ) {
	var div = $("#graph");

	if( frame === undefined ) {
		// 최초로 화면에 그려줄 경우는 frame을 생성해야 함
		var frame = $("<div id='graph-frame-" + this.config.dataOrder + "' class='packaged-frame'></div>");
		div.append( this.makeSubFramesInMainFrame( frame ) );
	}else {
		// 이미지 그려진 데이터는 Refresh만 처리하면 되므로 기존 frame을 이용한다
		this.makeSubFramesInMainFrame( frame );
	}

	this.settingCanvas( div );
	
	var data = this.config.rawData.aveHic;
};

HicHistogram.prototype.validateInteractionPairs = function(data, startPt, endPt) {
	var aa = [];
	for(var i=0; i<data.length; i++){
		if( data[i].bin2 >= startPt && data[i].bin2 <= endPt ) {
			aa.push( data[i] );
		}
	}
	return aa;
};

HicHistogram.prototype.makeMarkers = function(canvas) {
	var defs = canvas.append("svg:defs").attr("id", "defs-" + this.config.dataOrder);

	defs.append("marker")
	.attr({
		"id":"right_arrow",
		"viewBox":"0 -5 10 10",
		"refX":10,
		"refY":0,
		"markerWidth":6,
		"markerHeight":6,
		"orient":"auto"
	})
	.append("path")
	.attr("d", "M0,-5L10,0L0,5")
	.attr("class","arrowHead");
	
	defs.append("marker")
	.attr({
		"id":"left_arrow",
		"viewBox":"0 -5 10 10",
		"refX":0,
		"refY":0,
		"markerWidth":6,
		"markerHeight":6,
		"orient":"auto"
	})
	.append("path")
	.attr("d", "M0,0L10,-5L10,5")
	.attr("class","arrowHead");
};

HicHistogram.prototype.draw = function() {
	var obj = this;
	
	var summarizedOriginData = this.config.rawData;

	var canvas = d3.select("#canvas-" + obj.config.dataOrder);
	var dragboundary = d3.select("#dragBoundary-"+ obj.config.dataOrder);
	
	var data = summarizedOriginData.aveHic;
	
	this.config.bait = data.bait;

	var rectWidth = this.WIDTH - (2*this.PADDING) -this.LEFT_OFFSET -this.PADDING;
	var rectHeight = this.config.LINE_CHART_HEIGHT - (2*this.PADDING);
	
	var top = this.PADDING + 20;
	
	var choosenPeakValue =data.peakValue;
	var choosenFcPeakValue = data.fcPeakValue;
	
	if(data.fcPeakValue.toFixed(2) >= 2) {// fold change의 최대 값이 2 이상인 경우
		this.config.THRESHOLD = this.config.THRESHOLD <= 0 ? obj.config.DEFAULT_FOLDCHANGE_THRESHOLD : this.config.THRESHOLD;
	} else {// fold change의 최대 값이 2 미만인 경우
		this.config.THRESHOLD = (this.config.THRESHOLD > choosenFcPeakValue || this.config.THRESHOLD == 0) ? choosenFcPeakValue : this.config.THRESHOLD;
	}

	this.yScale = d3.scale.linear()
	.domain( [0, data.peakValue] )
	.range([this.config.LINE_CHART_HEIGHT - (this.PADDING) + dragBoundaryHeight, this.PADDING + 20 + dragBoundaryHeight]);

	this.fcYscale = d3.scale.linear()
	.domain( [0, data.fcPeakValue] )
	.range([this.config.LINE_CHART_HEIGHT - (this.PADDING) + dragBoundaryHeight, this.PADDING + 20 + dragBoundaryHeight ]);

	this.xScale = d3.scale.linear()
	.domain( [data.startPt, data.endPt] )
	.range([this.PADDING + this.LEFT_OFFSET, (this.WIDTH-this.PADDING-this.PADDING)]);

	var baseRect = canvas.append("g")
	.attr('id', 'base-rect-group-'+this.config.dataOrder);
	
	baseRect.append("rect")
	.attr('id', 'dragBoundary-'+this.config.dataOrder)
	.attr('class','dragboundary')
	.attr('x', this.xScale(data.startPt))
	.attr('y', this.PADDING)
	.attr('width', rectWidth)
	.attr('height', 20)
	.attr('fill','ivory')
	;
	
	baseRect.append("rect")
	.attr('id', 'peakBaseRect-'+this.config.dataOrder)
	.attr('class', 'boundary')
	.attr('x', this.xScale(data.startPt))
	.attr('y', this.PADDING + dragBoundaryHeight)
	.attr('width', rectWidth)
	.attr('height', rectHeight)
	;
	
	var bottom = (top + rectHeight);
	
	var graphHeight = $("#canvas-"+this.config.dataOrder).height();
	
	this.drawRangePanel( canvas, data );
	this.drawVerticalScrollBar(canvas, bottom, data, this.config.THRESHOLD, rectWidth, graphHeight);
	this.drawingDataPoints(canvas, data);
	this.drawLeftUnit(canvas, data, choosenPeakValue, top, bottom);
	this.drawRightUnit(canvas, data, choosenFcPeakValue, top, bottom, rectWidth);
	this.drawThresholdBar(canvas, data, this.config.THRESHOLD);
	
	this.drawTopUnit(canvas, data, top);
	
	this.drawBaitBar(canvas, data);
	
	this.processDrawingArc(bottom, choosenFcPeakValue);

	var changeBaitDrag = d3.behavior.drag()
	.on("dragstart", function(d){
		var pointX = d3.mouse(this)[0];
		var pointY = d3.mouse(this)[1];
		
		baseRect.append("line")
		.attr("id", "moving_area_line")
		.attr("class", "guide-line")
		.attr("x1", pointX)
		.attr("y1", pointY)
		.attr("x2", pointX)
		.attr("y2", pointY)
		;
		
		baseRect.append("text")
		.attr("id", "moving_area_text")
		.attr("class", "guide-line")
		.attr("text-anchor", "middle")
		.attr("baseline-shift", "-24%")
		.attr("x", pointX)
		.attr("y", pointY - 10)
		;
	})
	.on("drag", function(d) {
		// 드래그 할때와 화면에 있는 기준 위치와 다른 문제가 있음
		// 향후 해결해야 할 문제임

		var relativeX = d3.mouse(this)[0];

		var leftLimit = parseInt($("#peakBaseRect-" + obj.config.dataOrder).attr("x")); 
		var rightLimit = (parseInt($("#peakBaseRect-"+obj.config.dataOrder).attr("x")) + parseInt($("#peakBaseRect-"+obj.config.dataOrder).attr("width")));
		if( leftLimit > relativeX )			relativeX = leftLimit;
		else if( rightLimit < relativeX )	relativeX = rightLimit;
		
		d3.select("#moving_area_line")
		.attr("x2", relativeX)
		.attr("marker-end", "url(#right_arrow)");
		

		var a = parseInt(obj.xScale.invert( relativeX ) / 5000) * 5000;
		var b = parseInt(obj.xScale.invert( d3.select("#moving_area_line").attr("x1") ) / 5000) * 5000;

		var offset = b - a;

		var startPt = parseInt(obj.config.rawData.aveHic.startPt) + parseInt(offset);
		var endPt = parseInt(obj.config.rawData.aveHic.endPt) + parseInt(offset);

		var textX = parseInt(d3.select("#moving_area_text").attr("x"));

		d3.select("#moving_area_text")
		.attr("class", "unit-label")
		.attr("x", textX)
		.text( comma(offset) + "bp" );
		
		$("#hidden_range").val( startPt + "," + endPt );
	})
	.on("dragend", function(d){
		d3.select("#moving_area_line").remove();
		d3.select("#moving_area_text").remove();

		var boundary_range = parseInt(obj.config.boundary_range);
		var window_size = obj.config.window_size;
		var window_size2 = obj.config.window_size2;	
		var heatmap_window_size = $("#heatmap-resolution-" + obj.config.dataOrder).val();
		var loci = obj.config.dataOrder + ";" + obj.config.sampleId  + ";" + obj.config.sampleName + ";" + obj.config.chr + ":" + obj.config.bait +";" + obj.config.rawData.selTad;
		var bothPt = $("#hidden_range").val();
		$("#hidden_drag_range").val('');

		var loading = $(".loading");
		
		var scrollTop = $(window).scrollTop();
		
		var startEndPt = bothPt.split(',');
		var startPt = startEndPt[0];
		var endPt = startEndPt[1];
		
		if(startPt < 1) {
			bothPt = "1," + (boundary_range*2 +1);
		}
		
		$(document).ajaxStart(function(){
			loading.show();
		});
		$.ajax({
			type: 'post',
			url: 'get_change_range',
			dataType: 'json',
			data: {loci:loci, boundary_range:boundary_range, startEndPt:bothPt, window_size:window_size, window_size2:window_size2, heatmap_window_size:heatmap_window_size, threshold:obj.config.THRESHOLD},
			success:function(data) {
				$("#startPt-"+data.aveHic.dataOrder).val(data.aveHic.startPt);
				$("#endPt-"+data.aveHic.dataOrder).val(data.aveHic.endPt);

				var frame = $("#graph-frame-" + data.aveHic.dataOrder);
				
				var heatmapArccordionOnOff = $("#heatmap-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var graphAccordionOnOff = $("#graph-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var arcAccordionOnOff = $("#arc-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var geneAccordionOnOff = $("#gene-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				
				frame.empty();
				
				var config = {
						LINE_CHART_HEIGHT : 300,
					    THRESHOLD : data.threshold,
					    peakDrawingType : 'bar',
					    rawData : data,
					    dataOrder : data.aveHic.dataOrder,
					    chr : data.aveHic.chrom,
					    sampleName : data.aveHic.sampleName,
					    sampleId : data.aveHic.sampleId,
					    window_size : data.aveHic.windowSize,
					    window_size2 : data.aveHic.windowSize2,
					    boundary_range : data.aveHic.boundaryRange
				};

				var histogram = new HicHistogram(config);
				histogram.init( frame );
				histogram.draw();
				
				var heatmapParent = $("#graph-frame-heatmap-" + data.aveHic.dataOrder);
				heatmap_slider(data.aveHic.dataOrder);
				heatmap_header(config.dataOrder, heatmapParent, heatmap_window_size);
				heatmap( data.heatmap, config.dataOrder, config.boundary_range);
				
				histogram.enhancer(data.enhancer, config.dataOrder);
				histogram.geneSelect(  data.gene, 'full' );
				histogram.gencodeSelect(  data.gencode, 'full' );
				
				$(window).scrollTop( scrollTop );
				
				if(heatmapArccordionOnOff==false) {
					$("#heatmap-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#heatmap-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-heatmap-' + data.aveHic.dataOrder).hide();
					$("#heatmap-accordion-" + data.aveHic.dataOrder).text("Heatmap open");
				} else {
					$("#heatmap-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#heatmap-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-heatmap-' + data.aveHic.dataOrder).show();
					$("#heatmap-accordion-" + data.aveHic.dataOrder).text("Heatmap close");
				}
				
				if(graphAccordionOnOff==false) {
					$("#graph-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#graph-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-graph-' + data.aveHic.dataOrder).hide();
					$("#graph-accordion-" + data.aveHic.dataOrder).text("Graph open");
				} else {
					$("#graph-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#graph-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-graph-' + data.aveHic.dataOrder).show();
					$("#graph-accordion-" + data.aveHic.dataOrder).text("Graph close");
				}
				
				if(arcAccordionOnOff==false) {
					$("#arc-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#arc-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-arc-' + data.aveHic.dataOrder).hide();
					$("#arc-accordion-" + data.aveHic.dataOrder).text("Arc open");
				} else {
					$("#arc-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#arc-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-arc-' + data.aveHic.dataOrder).show();
					$("#arc-accordion-" + data.aveHic.dataOrder).text("Arc close");
				}
				
				if(geneAccordionOnOff==false) {
					$("#gene-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#gene-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-gene-' + data.aveHic.dataOrder).hide();
					$("#gene-accordion-" + data.aveHic.dataOrder).text("Gene open");
				} else {
					$("#gene-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#gene-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-gene-' + data.aveHic.dataOrder).show();
					$("#gene-accordion-" + data.aveHic.dataOrder).text("Gene close");
				}
				
				$(document).ajaxStop(function(){
					loading.hide();
				});
			}
		});
	});

	//드래그로 줌인 하는 부분(줌아웃은 안됨)
	var changeBoundaryDrag = d3.behavior.drag()
	.on("dragstart", function(d){
		var pointX = d3.mouse(this)[0];

		$("#hidden_pointx").val(pointX);

		baseRect.append("polygon")
		.attr("id", "moving_area_rect")
		.attr("class", "guide-rect")
		.attr("points", pointX+","+$("#dragBoundary-" + obj.config.dataOrder).attr("y")+" "+pointX+","+parseInt($("#dragBoundary-" + obj.config.dataOrder).attr("y"))+parseInt(20))
		;
	})
	.on("drag", function(d) {
		var relativeX = d3.mouse(this)[0];

		var leftLimit = parseInt($("#dragBoundary-" + obj.config.dataOrder).attr("x")); 
		var rightLimit = (parseInt($("#dragBoundary-"+obj.config.dataOrder).attr("x")) + parseInt($("#dragBoundary-"+obj.config.dataOrder).attr("width")));	
		
		if( leftLimit > relativeX )			relativeX = leftLimit;
		else if( rightLimit < relativeX )	relativeX = rightLimit;
		
		var a = parseInt(obj.xScale.invert( relativeX ) / 5000) * 5000;		// drag end point
		var b = parseInt(obj.xScale.invert( $("#hidden_pointx").val() ) / 5000) * 5000;		// drag start point

		if(a < b){
			var temp = b;
			b = a;
			a = temp; 
		}

		var y = parseInt($("#dragBoundary-" + obj.config.dataOrder).attr("y"))+parseInt(20-1);

		d3.select("#moving_area_rect")
		.attr("points", $("#hidden_pointx").val()+","+$("#dragBoundary-" + obj.config.dataOrder).attr("y")+" "+$("#hidden_pointx").val()+","+y+" "+ relativeX +","+y+" "+relativeX+","+$("#dragBoundary-" + obj.config.dataOrder).attr("y"));
		
		$("#hidden_drag_range").val( b + "," + a );

	})
	.on("dragend", function(d){
		var window_size = obj.config.window_size;
		var window_size2 = obj.config.window_size2;	
		var heatmap_window_size = $("#heatmap-resolution-" + obj.config.dataOrder).val();
		var loci = obj.config.dataOrder + ";" + obj.config.sampleId  + ";" + obj.config.sampleName + ";" + obj.config.chr + ":" + obj.config.bait +";"+ obj.config.rawData.selTad;
		var bothPt = $("#hidden_drag_range").val();

		$("#hidden_range").val('');
		
		var loading = $(".loading");
		
		var scrollTop = $(window).scrollTop();

		$(document).ajaxStart(function(){
			loading.show();
		});
		var splitbothPt = bothPt.split(',');
		var boundary_range = (parseInt(splitbothPt[1])-parseInt(splitbothPt[0]))/2;
		
		if(boundary_range < 50000) { alert("The minimum range is 50kb."); d3.select('#moving_area_rect').remove(); return; }
		
		$.ajax({
			type: 'post',
			url: 'get_change_range',
			dataType: 'json',
			data: {loci:loci, boundary_range:boundary_range, startEndPt:bothPt, window_size:window_size, window_size2:window_size2, heatmap_window_size:heatmap_window_size, threshold:obj.config.THRESHOLD},
			success:function(data) {
				$("#startPt-"+ data.aveHic.dataOrder).val(data.aveHic.startPt);
				$("#endPt-"+ data.aveHic.dataOrder).val(data.aveHic.endPt);
				
				var frame = $("#graph-frame-" + data.aveHic.dataOrder);
				
				var heatmapArccordionOnOff = $("#heatmap-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var graphAccordionOnOff = $("#graph-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var arcAccordionOnOff = $("#arc-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var geneAccordionOnOff = $("#gene-accordion-" + data.aveHic.dataOrder).hasClass('expaned');

				frame.empty();

				var config = {
					LINE_CHART_HEIGHT : 300,
				    THRESHOLD : data.threshold,
				    peakDrawingType : 'bar',
				    rawData : data,
				    dataOrder : data.aveHic.dataOrder,
				    chr : data.aveHic.chrom,
				    sampleName : data.aveHic.sampleName,
				    sampleId : data.aveHic.sampleId,
				    window_size : data.aveHic.windowSize,
				    window_size2 : data.aveHic.windowSize2,
				    boundary_range : data.aveHic.boundaryRange
				};

				var histogram = new HicHistogram(config);
				histogram.init( frame );
				histogram.draw();

				var heatmapParent = $("#graph-frame-heatmap-" + data.aveHic.dataOrder);
				heatmap_slider(data.aveHic.dataOrder);
				heatmap_header(config.dataOrder, heatmapParent, heatmap_window_size);
				heatmap( data.heatmap, config.dataOrder, config.boundary_range);

				histogram.enhancer(data.enhancer, config.dataOrder);
				histogram.geneSelect(  data.gene, 'full' );
				histogram.gencodeSelect(  data.gencode, 'full' );
				
				$(window).scrollTop( scrollTop );
				
				if(heatmapArccordionOnOff==false) {
					$("#heatmap-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#heatmap-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-heatmap-' + data.aveHic.dataOrder).hide();
					$("#heatmap-accordion-" + data.aveHic.dataOrder).text("Heatmap open");
				} else {
					$("#heatmap-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#heatmap-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-heatmap-' + data.aveHic.dataOrder).show();
					$("#heatmap-accordion-" + data.aveHic.dataOrder).text("Heatmap close");
				}
				
				if(graphAccordionOnOff==false) {
					$("#graph-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#graph-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-graph-' + data.aveHic.dataOrder).hide();
					$("#graph-accordion-" + data.aveHic.dataOrder).text("Graph open");
				} else {
					$("#graph-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#graph-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-graph-' + data.aveHic.dataOrder).show();
					$("#graph-accordion-" + data.aveHic.dataOrder).text("Graph close");
				}
				
				if(arcAccordionOnOff==false) {
					$("#arc-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#arc-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-arc-' + data.aveHic.dataOrder).hide();
					$("#arc-accordion-" + data.aveHic.dataOrder).text("Arc open");
				} else {
					$("#arc-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#arc-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-arc-' + data.aveHic.dataOrder).show();
					$("#arc-accordion-" + data.aveHic.dataOrder).text("Arc close");
				}
				
				if(geneAccordionOnOff==false) {
					$("#gene-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#gene-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-gene-' + data.aveHic.dataOrder).hide();
					$("#gene-accordion-" + data.aveHic.dataOrder).text("Gene open");
				} else {
					$("#gene-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#gene-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-gene-' + data.aveHic.dataOrder).show();
					$("#gene-accordion-" + data.aveHic.dataOrder).text("Gene close");
				}
				
				$(document).ajaxStop(function(){
					loading.hide();
				});
			}
		});
	});

	$("#zoom-in-"+obj.config.dataOrder +",#zoom-in-3x-"+obj.config.dataOrder +",#zoom-out-"+obj.config.dataOrder+",#zoom-out-3x-"+obj.config.dataOrder).click(function(){
		var zoom_boundary = 0;
		var id = this.id;
		var split = id.split("-");
	
		if(split[1] == 'in'){
			if(split[2] == '3x'){ zoom_boundary = Math.ceil(((obj.config.boundary_range * 0.3)/2)/5000) * 5000;}
			else{zoom_boundary = Math.ceil(((obj.config.boundary_range * 0.15)/2)/5000) * 5000;}
			
			if ( (obj.config.rawData.aveHic.endPt - obj.config.rawData.aveHic.startPt > 100000) && ((obj.config.rawData.aveHic.endPt-zoom_boundary)- (parseInt(obj.config.rawData.aveHic.startPt) + parseInt(zoom_boundary)) < 100000)){
				var min50kb = Math.ceil((((obj.config.rawData.aveHic.endPt - obj.config.rawData.aveHic.startPt) - 100000 )/2)/5000 * 5000) ;
				$("#hidden_drag_range").val( (parseInt(obj.config.rawData.aveHic.startPt) + min50kb) + "," + (obj.config.rawData.aveHic.endPt-min50kb) );
			}
			else if( (obj.config.rawData.aveHic.endPt - obj.config.rawData.aveHic.startPt <= 100000 ) && ((obj.config.rawData.aveHic.endPt-zoom_boundary) - (parseInt(obj.config.rawData.aveHic.startPt) + parseInt(zoom_boundary)) < 100000)){
				alert("The minimum range is 50Kb.");
				return;
			}
			else{
				$("#hidden_drag_range").val( (parseInt(obj.config.rawData.aveHic.startPt) + parseInt(zoom_boundary)) + "," + (obj.config.rawData.aveHic.endPt-zoom_boundary) );
			}
		}
		else{
			if(split[2] == '3x'){ zoom_boundary = Math.ceil(((obj.config.boundary_range * 0.3)/2)/5000) * 5000;}
			else{zoom_boundary = Math.ceil(((obj.config.boundary_range * 0.15)/2)/5000) * 5000;}
			
			if( obj.config.rawData.aveHic.endPt - obj.config.rawData.aveHic.startPt < 4000000 && (parseInt(obj.config.rawData.aveHic.endPt) + parseInt(zoom_boundary)) - (obj.config.rawData.aveHic.startPt-zoom_boundary)  > 4000000){
				var max2mb = Math.ceil((( 4000000 - (obj.config.rawData.aveHic.endPt - obj.config.rawData.aveHic.startPt) )/2)/5000 * 5000) ;
				$("#hidden_drag_range").val( (obj.config.rawData.aveHic.startPt-max2mb) + "," + (parseInt(obj.config.rawData.aveHic.endPt) + parseInt(max2mb)) );	
			}
			else if( obj.config.rawData.aveHic.endPt - obj.config.rawData.aveHic.startPt >= 4000000 && (parseInt(obj.config.rawData.aveHic.endPt) + parseInt(zoom_boundary)) - (obj.config.rawData.aveHic.startPt-zoom_boundary)  > 4000000 ){
				alert("The maximum range is 2Mb.");
				return;
			}
			else{
				$("#hidden_drag_range").val( (obj.config.rawData.aveHic.startPt-zoom_boundary) + "," + (parseInt(obj.config.rawData.aveHic.endPt) + parseInt(zoom_boundary)) );	
			}
		}
		
		var window_size = obj.config.window_size;
		var window_size2 = obj.config.window_size2;	
		var heatmap_window_size = $("#heatmap-resolution-" + obj.config.dataOrder).val();
		var loci = obj.config.dataOrder + ";" + obj.config.sampleId  + ";" + obj.config.sampleName + ";" + obj.config.chr + ":" + obj.config.bait +";" + obj.config.rawData.selTad;
		var bothPt = $("#hidden_drag_range").val();
	
		$("#hidden_range").val('');
		
		var loading = $(".loading");
		
		var scrollTop = $(window).scrollTop();
	
		$(document).ajaxStart(function(){
			loading.show();
		});
		var splitbothPt = bothPt.split(',');
		var boundary_range = Math.ceil((parseInt(splitbothPt[1])-parseInt(splitbothPt[0]))/2);
		
		$.ajax({
			type: 'post',
			url: 'get_change_range',
			dataType: 'json',
			data: {loci:loci, boundary_range:boundary_range, startEndPt:bothPt, window_size:window_size, window_size2:window_size2, heatmap_window_size:heatmap_window_size, threshold:obj.config.THRESHOLD},
			success:function(data) {
				$("#startPt-"+data.aveHic.dataOrder).val(data.aveHic.startPt);
				$("#endPt-"+data.aveHic.dataOrder).val(data.aveHic.endPt);
				
				var frame = $("#graph-frame-" + data.aveHic.dataOrder);
				
				var heatmapArccordionOnOff = $("#heatmap-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var graphAccordionOnOff = $("#graph-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var arcAccordionOnOff = $("#arc-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
				var geneAccordionOnOff = $("#gene-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
	
				frame.empty();
	
				var config = {
					LINE_CHART_HEIGHT : 300,
				    THRESHOLD : data.threshold,
				    peakDrawingType : 'bar',
				    rawData : data,
				    dataOrder : data.aveHic.dataOrder,
				    chr : data.aveHic.chrom,
				    sampleName : data.aveHic.sampleName,
				    sampleId : data.aveHic.sampleId,
				    window_size : data.aveHic.windowSize,
				    window_size2 : data.aveHic.windowSize2,
				    boundary_range : data.aveHic.boundaryRange
				};
	
				var histogram = new HicHistogram(config);
				histogram.init( frame );
				histogram.draw();
				
				var heatmapParent = $("#graph-frame-heatmap-" + data.aveHic.dataOrder);
				heatmap_slider(data.aveHic.dataOrder);
				heatmap_header(config.dataOrder, heatmapParent, heatmap_window_size);
				heatmap( data.heatmap, config.dataOrder, config.boundary_range);
				
				histogram.enhancer(data.enhancer, config.dataOrder);
				histogram.geneSelect(  data.gene, 'full' );
				histogram.gencodeSelect(  data.gencode, 'full' );
				
				$(window).scrollTop( scrollTop );
				
				if(heatmapArccordionOnOff==false) {
					$("#heatmap-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#heatmap-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-heatmap-' + data.aveHic.dataOrder).hide();
					$("#heatmap-accordion-" + data.aveHic.dataOrder).text("Heatmap open");
				} else {
					$("#heatmap-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#heatmap-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-heatmap-' + data.aveHic.dataOrder).show();
					$("#heatmap-accordion-" + data.aveHic.dataOrder).text("Heatmap close");
				}
				
				if(graphAccordionOnOff==false) {
					$("#graph-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#graph-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-graph-' + data.aveHic.dataOrder).hide();
					$("#graph-accordion-" + data.aveHic.dataOrder).text("Graph open");
				} else {
					$("#graph-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#graph-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-graph-' + data.aveHic.dataOrder).show();
					$("#graph-accordion-" + data.aveHic.dataOrder).text("Graph close");
				}
				
				if(arcAccordionOnOff==false) {
					$("#arc-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#arc-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-arc-' + data.aveHic.dataOrder).hide();
					$("#arc-accordion-" + data.aveHic.dataOrder).text("Arc open");
				} else {
					$("#arc-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#arc-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-arc-' + data.aveHic.dataOrder).show();
					$("#arc-accordion-" + data.aveHic.dataOrder).text("Arc close");
				}
				
				if(geneAccordionOnOff==false) {
					$("#gene-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
					$("#gene-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
					$('#graph-frame-gene-' + data.aveHic.dataOrder).hide();
					$("#gene-accordion-" + data.aveHic.dataOrder).text("Gene open");
				} else {
					$("#gene-accordion-" + data.aveHic.dataOrder).addClass("expaned");
					$("#gene-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
					$('#graph-frame-gene-' + data.aveHic.dataOrder).show();
					$("#gene-accordion-" + data.aveHic.dataOrder).text("Gene close");
				}
				
				$(document).ajaxStop(function(){
					loading.hide();
				});
			}
		});
	});

	d3.select("#dragBoundary-" + obj.config.dataOrder).call(changeBoundaryDrag);
	d3.select("#peakBaseRect-" + obj.config.dataOrder).call(changeBaitDrag);
};

HicHistogram.prototype.drawRangePanel = function(canvas, data) {
	var obj = this;
	this.makeMarkers( canvas );
	
	var rangeGroup = canvas.append("g").attr('id', 'range-group');
	
	var rangeText = rangeGroup.append("text")
	.attr('id', 'range_text-'+obj.config.dataOrder)
	.attr('class', 'unit-label')
	.attr("text-anchor", "middle")
	.attr("baseline-shift", "-24%")
	.attr('x', function(d){return (obj.WIDTH - obj.LEFT_OFFSET)/2 + obj.LEFT_OFFSET - obj.PADDING/2;})
	.attr('y', function(d){
		return (obj.PADDING/3);
	})
	.text( "hg38 : ( " + this.config.chr + ":" + comma(data.startPt) + "-" + comma(data.endPt) + " )");

	var offset = (rangeText.node().getComputedTextLength() / 2) + 10;

	rangeGroup.append("line")
	.attr('id', 'range-line-left-'+obj.config.dataOrder)
	.attr('class', 'range-boundary')
	.attr('x1', this.PADDING + this.LEFT_OFFSET)
	.attr('y1', (this.PADDING/3))
	.attr('x2', ((this.WIDTH - obj.LEFT_OFFSET)/2 + obj.LEFT_OFFSET) - offset - this.PADDING)
	.attr('y2', (this.PADDING/3))
	.attr("marker-start", "url(#left_arrow)");
	;

	rangeGroup.append("line")
	.attr('id', 'range-line-right-'+obj.config.dataOrder)
	.attr('class', 'range-boundary')
	.attr('x1', ((this.WIDTH - obj.LEFT_OFFSET)/2 + obj.LEFT_OFFSET) + offset)
	.attr('y1', (this.PADDING/3))
	.attr('x2', this.WIDTH - this.PADDING - this.PADDING)
	.attr('y2', (this.PADDING/3))
	.attr("marker-end", "url(#right_arrow)");
	;
};

HicHistogram.prototype.drawLeftUnit = function(canvas, data, choosenPeakValue, top, bottom) {
	var obj = this;
	
	var topLimit = 0;
	topLimit = obj.yScale.invert(top);
	
	var units = canvas.append('g');
	
	units.append('text')
	.attr('class', 'unit-label')
	.attr("text-anchor", "end")
	.attr("baseline-shift", "-25%")
	.attr('x', function(d){return obj.PADDING + obj.LEFT_OFFSET + obj.LEFT_OFFSET;})
	.attr('y', function(d){return bottom + 15;})
	.text( "(Bias-removed Interaction frequency)" );

	var inc = 10;
	if( topLimit < 10 )	inc = topLimit;

	for(var i=0; i<=topLimit; i+=inc) {
		var val = parseInt(i);

		units.append('line')
		.attr('class', 'unit')
		.attr('x1', obj.PADDING + obj.LEFT_OFFSET - 15)
		.attr('y1', obj.yScale(val))
		.attr('x2', obj.PADDING + obj.LEFT_OFFSET)
		.attr('y2', obj.yScale(val));		
		
		units.append("text")
		.attr('class', 'unit-label')
		.attr("text-anchor", "end")
		.attr("baseline-shift", "-25%")
		.attr('x', function(d){return obj.PADDING + obj.LEFT_OFFSET - 17;})
		.attr('y', function(d){return obj.yScale(val);})
		.text( val.toFixed(1) );
	}
};

HicHistogram.prototype.drawRightUnit = function(canvas, data, choosenFcPeakValue, top, bottom, rectWidth) {
	var obj = this;
	
	var topLimit = 0;
	topLimit = obj.fcYscale.invert(top);
	
	var units = canvas.append('g');
	
	units.append('text')
	.attr('class', 'unit-label')
	.attr("text-anchor", "start")
	.attr("baseline-shift", "-25%")
	.attr('x', function(d){return rectWidth;})
	.attr('y', function(d){return bottom + 15;})
	.text( "(Distance normalized Interaction frequency)");
	
	for(var i=0; i<=topLimit; i++) {
		var val = parseInt(i);
		
		units.append('line')
		.attr('class', 'unit')
		.attr('x1', obj.PADDING + obj.LEFT_OFFSET + rectWidth)
		.attr('y1', obj.fcYscale(val))
		.attr('x2', obj.PADDING + obj.LEFT_OFFSET + 15 + rectWidth)
		.attr('y2', obj.fcYscale(val));		
		
		units.append("text")
		.attr('class', 'unit-label')
		.attr("text-anchor", "start")
		.attr("baseline-shift", "-25%")
		.attr('x', function(d){return obj.PADDING + obj.LEFT_OFFSET + 17 + rectWidth;})
		.attr('y', function(d){return obj.fcYscale(val);})
		.text( val.toFixed(1) );
	}
};


HicHistogram.prototype.drawTopUnit = function(canvas, data, baseYpos) {
	var obj = this;

	var horizontalUnitGroup = canvas.append('g').attr('id', 'horizontal-unit-group-' + obj.config.dataOrder);
	
	var divUnit = parseInt(parseInt(data.boundaryRange) * 2) / 10;

	var base = data.startPt;
	for(var i=0; i<=10; i++) {
		var variableFactor = (i) * divUnit;
		var txtLeft = parseInt(parseInt(base) + variableFactor);
		var left = obj.xScale( txtLeft );

		horizontalUnitGroup.append('line')
		.attr('class', 'unit')
		.attr('x1', left)
		.attr('y1', this.PADDING - 10)
		.attr('x2', left)
		.attr('y2', this.PADDING)
		;
		
		horizontalUnitGroup.append("text")
		.attr('class', 'unit-label')
		.attr("text-anchor", "middle")
		.attr("baseline-shift", "30%")
		.attr('x', left)
		.attr('y', this.PADDING-10)
		.text( comma(txtLeft) );
	}
};

HicHistogram.prototype.drawThresholdBar = function(canvas, data, choosenFcValue) {
	var obj = this;

	var grp = canvas.append('g')
	.attr('id', 'threashold-bar-group-'+obj.config.dataOrder);
	
	grp.append('line')
	.attr('id', 'threshold-bar-'+obj.config.dataOrder)
	.attr('class', 'threshold-bar')
	.attr('x1', this.PADDING+this.LEFT_OFFSET)
	.attr('y1', function(d){
		return obj.fcYscale(choosenFcValue);
	})
	.attr('x2', this.WIDTH - this.PADDING)
	.attr('y2', function(d){
		return obj.fcYscale(choosenFcValue);
	});
	
	grp.append('text')
	.attr('id', 'fold-change-label-' + obj.config.dataOrder)
	.attr("class", "unit-label")
	.attr("text-anchor", "end")
	.attr("baseline-shift", "-24%")
	.attr('x', this.WIDTH - this.PADDING - 10  - this.PADDING)
	.attr('y', function(d){
		return obj.fcYscale(choosenFcValue) -10;
	})
	.text( "Distance normalized Interaction frequency : " + parseFloat(choosenFcValue).toFixed(2) );
};

HicHistogram.prototype.drawingDataPoints = function( canvas, data ) {
	var obj = this;

	var offset = parseFloat(data.windowSize) / 2;
	var width = data.windowSize;

	var line = d3.svg.line()
	.x(function(d,i) {
		return obj.xScale(d.bin2 - offset); 
	})
	.y(function(d) {
		return obj.yScale(d.count);
	});

	var unitWidth = obj.xScale( data.startPt + 1000) - obj.xScale(data.startPt);
	
	var barDataGroup = canvas.append('g')
	.attr('id', 'bar-data-'+obj.config.dataOrder);
	
	if( this.config.peakDrawingType === 'bar') {
		barDataGroup.selectAll('line').data(
			data.interactionPairs
			.map(function(v, idx) { 
				return v.count == 0? null : { bin1: v.bin1, bin2: v.bin2, foldChange: v.foldChange, count: v.count }
			})
		    .filter(function(v) { return v != null })
		)
		.enter()
		.append('line')
		.attr('class', 'bar bar-'+obj.config.dataOrder)
		.attr('x1', function(d, i) {
			return obj.xScale(d.bin2 /*- offset*/);
		})
		.attr('y1', function(d, i){
			return obj.yScale(d.count);
		})
		.attr('x2', function(d, i) {
			return obj.xScale(d.bin2 /*- offset*/);
		})
		.attr('y2', function(d, i){
			return obj.yScale(0);
		});
	} else {
		barDataGroup.append('g')
		.append("path")
		.attr('id', 'bar-data-'+obj.config.dataOrder)
		.attr('class', 'bar bar-'+obj.config.dataOrder)
		.attr('d', line(data.interactionPairs));
	}
	
	if( this.config.isDrawingDataPoint === undefined ) {
		var dt = JSON.parse(JSON.stringify(data.interactionPairs));
		canvas.append('g')
		.attr('id', 'circle-data-'+obj.config.dataOrder)
		.selectAll('circle')
		.data(
//			data.interactionPairs
//			.map(function(v, idx) { 
////				if( !(((idx) % 5 == 0) ) ){
////					return null;
////				}
//				return v.count == 0? null : { bin1: v.bin1, bin2: v.bin2, foldChange: v.foldChange, count: v.count };
//			})
//		    .filter(function(v) { return v != null; })
				dt
		)
		.enter()
		.append('circle')
		.attr('class', 'foldchange-point data-point-'+obj.config.dataOrder)
		.attr('cx', function(d, i) {
			return obj.xScale(d.bin2);
		})
		.attr('cy', function(d, i){
			return obj.fcYscale(d.foldChange);
		})
		.attr('r', 1)
		;
	}
	
	if( data.peakValue === 0 ) {
		var x = parseInt($('#peakBaseRect-'+obj.config.dataOrder).attr("x")) + parseInt($('#peakBaseRect-'+obj.config.dataOrder).attr("width")/2);
		var y = parseInt($('#peakBaseRect-'+obj.config.dataOrder).attr("y")) + parseInt($('#peakBaseRect-'+obj.config.dataOrder).attr("height")/2);

		d3.select("#bar-data-" + obj.config.dataOrder)
		.append('text')
		.attr('id', 'bar-data-no-data-' + obj.config.dataOrder)
		.attr("text-anchor", "middel")
		.attr("baseline-shift", "-24%")
		.attr('x', x)
		.attr('y', y)
		.text('[ No Data ]')
		;
		
		$("#bar-data-no-data-" + obj.config.dataOrder).attr('x', x - $("#bar-data-no-data-" + obj.config.dataOrder).width()/2);
	}else {
		d3.select('#bar-data-no-data-'+obj.config.dataOrder).remove();
	}
};

HicHistogram.prototype.stackedEachWindowData = function(canvas, data, aveHic) {
	var obj = this;

	var totalGroup = canvas.append('g')
	.attr('id', 'windowsize-total-group')
	;
	
	var yBase = obj.yScale( 0 ) + 2;
	
	for(var i=0; i<Object.keys(data).length; i++) {
		var windowSize = Object.keys(data)[i];
		var windowData = data[windowSize];

		var group = canvas.append('g')
		.attr('id', 'windowsize-'+windowSize+'-group');

		for(var j=0; j<windowData.interactionPairs.length; j++) {
			var window = windowData.interactionPairs[j];

			var x1 = obj.xScale(window.bin2);
			var x2 = obj.xScale(parseInt(window.bin2) + parseInt(windowSize));

			if( x1 < obj.xScale(windowData.startPt) )	x1 = obj.xScale(windowData.startPt);
			if( x2 > obj.xScale(windowData.endPt) )		x2 = obj.xScale(windowData.endPt);

			var width = x2 - x1;
			var count = window.count;
			
			var rvalue = ((parseFloat(count) * 255) / aveHic.globalPeakValue) + 0;
			if( rvalue > 255 ) rvalue = 255;
			
			var color = d3.rgb(255, 255 - parseFloat(rvalue), 255 - parseFloat(rvalue));

			if( width > 0 ) {
				group.append("rect")
				.attr('class', 'wndbox')
				.attr("x", x1)
				.attr("y", yBase)
				.attr("width", width)
				.attr("height", this.config.SMOOTHNING_LAYER_HEIGHT)
				.attr("fill", color);
				;
			}
		}
		yBase += (parseInt(this.config.SMOOTHNING_LAYER_HEIGHT) );
	}
	
	this.rawWindowTrack(canvas, data[ Object.keys(data)[0] ], yBase, group);

	// resize SVG object and div area
	this.HEIGHT = this.config.LINE_CHART_HEIGHT + ( this.config.SMOOTHNING_LAYER_HEIGHT * Object.keys(data).length ) - this.config.REMAINDER;

	canvas.attr("viewBox", "0 0 " + this.WIDTH + " " + this.HEIGHT);
	canvas.attr("width", this.WIDTH).attr("height", this.HEIGHT);
};

HicHistogram.prototype.aveHicWindowTrack = function(canvas, aveHicOrigin, yBase, group) {
	var obj = this;

	var aveHic = aveHicOrigin.interactionPairs;
	var peakValue = aveHicOrigin.peakValue;

	var newYscale = d3.scale.linear()
	.domain( [0, peakValue] )
	.range([yBase+this.config.AVE_HIC_SUM_CHART_HEIGHT, yBase+10]);
	
	var line2 = d3.svg.line()
	.x(function(d,i) { 
		return obj.xScale(d.bin2); 
	})
	.y(function(d) {
		return newYscale(d.count); 
	});
};

HicHistogram.prototype.rawWindowTrack = function(canvas, rawData, yBase, group) {
	var obj = this;

	var aveHic = rawData.interactionPairs;
	var peakValue = rawData.peakValue;

	var newYscale = d3.scale.linear()
	.domain( [0, peakValue] )
	.range([yBase+this.config.AVE_HIC_SUM_CHART_HEIGHT, yBase+10]);
	
	var line2 = d3.svg.line()
	.x(function(d,i) { 
		return obj.xScale(d.bin2); 
	})
	.y(function(d) {
		return newYscale(d.count); 
	});
};

HicHistogram.prototype.drawBaitBar = function(canvas, data) {
	var obj = this;

	var baitBarGroup = canvas.append("g").attr("id", "bait-lable-group");
	
	if( obj.config.drawingBaitType === 'line' ) {
		baitBarGroup.append('line')
		.attr('id', 'bait-bar-'+obj.config.dataOrder)
		.attr('class', 'bait')
		.attr('x1', obj.xScale(data.bait))
		.attr('y1', this.PADDING)
		.attr('x2', obj.xScale(data.bait))
		.attr('y2', this.config.LINE_CHART_HEIGHT - this.PADDING)
		;
	} else {
		var OFFSET = 5;
		var OFFSET_V = 5;
		var OFFSET_W = 20;
		
		var p1 =  [
			{x:(obj.xScale(data.bait)), y:this.PADDING+dragBoundaryHeight},
			{x:(obj.xScale(data.bait)-OFFSET), y:(this.PADDING + OFFSET_V)+dragBoundaryHeight}, 
			{x:(obj.xScale(data.bait)-OFFSET), y: (this.config.LINE_CHART_HEIGHT - this.PADDING-OFFSET_V)+dragBoundaryHeight},
			{x:(obj.xScale(data.bait)), y:(this.config.LINE_CHART_HEIGHT - this.PADDING)+dragBoundaryHeight},
			{x:(obj.xScale(data.bait)+OFFSET), y: (this.config.LINE_CHART_HEIGHT - this.PADDING-OFFSET_V)+dragBoundaryHeight},
			{x:(obj.xScale(data.bait)+OFFSET), y:(this.PADDING + OFFSET_V)+dragBoundaryHeight}
		];

		var p2 =  [
			{x:(obj.xScale(data.bait)), y:this.PADDING+dragBoundaryHeight},
			{x:(obj.xScale(data.bait)-OFFSET_W), y:(this.PADDING + OFFSET_V)+dragBoundaryHeight}, 
			{x:(obj.xScale(data.bait)-OFFSET_W), y: (this.config.LINE_CHART_HEIGHT - this.PADDING-OFFSET_V)+dragBoundaryHeight},
			{x:(obj.xScale(data.bait)), y:(this.config.LINE_CHART_HEIGHT - this.PADDING)+dragBoundaryHeight},
			{x:(obj.xScale(data.bait)+OFFSET_W), y: (this.config.LINE_CHART_HEIGHT - this.PADDING-OFFSET_V)+dragBoundaryHeight},
			{x:(obj.xScale(data.bait)+OFFSET_W), y:(this.PADDING + OFFSET_V)+dragBoundaryHeight}
		];
		
		var changeBaitDrag = d3.behavior.drag()
		.on("dragstart", function(d){
			d3.select("#bait-bar-" + obj.config.dataOrder)
			.attr("d", function(d){
				return line2(p2);
			});
		})
		.on("drag", function(d) {
			// 드래그 할때와 화면에 있는 기준 위치와 다른 문제가 있음
			// 향후 해결해야 할 문제임
			var LEFT_BOUNDARY = parseInt(d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("x"));
			var RIGHT_BOUNDARY = parseInt(d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("x")) + parseInt(d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("width"));
			
			var relativeX = d3.mouse(this)[0];
			
			if( relativeX < LEFT_BOUNDARY )		relativeX = LEFT_BOUNDARY;
			if( relativeX > RIGHT_BOUNDARY )	relativeX = RIGHT_BOUNDARY;
			
			obj.config.bait = (parseInt(Math.ceil(obj.xScale.invert(relativeX)/1000))*1000);
			
			var diffX = d3.event.dx;
			
			if( (p1[0].x + diffX) < LEFT_BOUNDARY || (p1[0].x + diffX) > RIGHT_BOUNDARY ){
				diffX = 0;
			}

			d3.select("#bait-bar-" + obj.config.dataOrder)
			.attr("d", function(d){
				for(var i=0; i<p1.length; i++)	p1[i].x += diffX;
				for(var i=0; i<p2.length; i++)	p2[i].x += diffX;

				return line2(p2);
			});
			
			var baitLabel = d3.select("#bait-label-" + obj.config.dataOrder)
			.attr("class", "unit-label")
			.attr("x", relativeX )
			.attr("text-anchor", function(d) {
				if( relativeX + this.getBBox().width > RIGHT_BOUNDARY )
					return "end";

				return "start";
			})
			.text( "  ( " + comma(obj.config.bait) + " )" );
			
			$("#hidden_locus").val( obj.config.chr + ":" + obj.config.bait );
		})
		.on("dragend", function(d){
			d3.select("#bait-bar-" + obj.config.dataOrder)
			.attr("d", function(d){
				return line2(p1);
			});
			
			var boundary_range;

			if($("#hidden_drag_range").val() != '') {
				var bothPt = $("#hidden_drag_range").val();
				var splitbothPt = bothPt.split(',');
				boundary_range = (parseInt(splitbothPt[1])-parseInt(splitbothPt[0]))/2;
			} else {
				boundary_range = parseInt(obj.config.boundary_range);
			}
			
			var window_size = obj.config.window_size;
			var window_size2 = obj.config.window_size2;
			var loci = obj.config.dataOrder + ";" + obj.config.sampleId  + ";" + obj.config.sampleName + ";" + obj.config.chr + ":" + obj.config.bait +";"+ obj.config.rawData.selTad;
			var heatmap_window_size = $("#heatmap-resolution-" + obj.config.dataOrder).val();
			
			var loading = $(".loading");

			$(document).ajaxStart(function(){
				loading.show();
			});
			
			var scrollTop = $(window).scrollTop();
			
			$.ajax({
				type: 'post',
				url: 'get_single_data',
				dataType: 'json',
				data: {loci:loci, boundary_range:boundary_range, window_size:window_size, window_size2:window_size2, heatmap_window_size:heatmap_window_size},
				success:function(data) {
					$("#startPt-"+ data.aveHic.dataOrder).val(data.aveHic.startPt);
					$("#endPt-"+ data.aveHic.dataOrder).val(data.aveHic.endPt);
					var frame = $("#graph-frame-" + data.aveHic.dataOrder);
					
					var heatmapArccordionOnOff = $("#heatmap-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
					var graphAccordionOnOff = $("#graph-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
					var arcAccordionOnOff = $("#arc-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
					var geneAccordionOnOff = $("#gene-accordion-" + data.aveHic.dataOrder).hasClass('expaned');
					
					frame.empty();

					var config = {
						LINE_CHART_HEIGHT : 300,
					    THRESHOLD : 0,
					    peakDrawingType : 'bar',
					    rawData : data,
					    dataOrder : data.aveHic.dataOrder,
					    chr : data.aveHic.chrom,
					    sampleName : data.aveHic.sampleName,
					    sampleId : data.aveHic.sampleId,
					    window_size : data.aveHic.windowSize,
					    window_size2 : data.aveHic.windowSize2,
					    boundary_range : data.aveHic.boundaryRange
					};

					var histogram = new HicHistogram(config);
					histogram.init( frame );
					histogram.draw();
					
					var heatmapParent = $("#graph-frame-heatmap-" + data.aveHic.dataOrder);
					heatmap_slider(data.aveHic.dataOrder);
					heatmap_header(config.dataOrder, heatmapParent, heatmap_window_size);
					heatmap( data.heatmap, config.dataOrder, config.boundary_range );
					
					histogram.enhancer(data.enhancer, config.dataOrder);
					histogram.geneSelect(  data.gene, 'full' );
					histogram.gencodeSelect(  data.gencode, 'full' );
					
					$(window).scrollTop( scrollTop );
					
					if(heatmapArccordionOnOff==false) {
						$("#heatmap-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
						$("#heatmap-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
						$('#graph-frame-heatmap-' + data.aveHic.dataOrder).hide();
						$("#heatmap-accordion-" + data.aveHic.dataOrder).text("Heatmap open");
					} else {
						$("#heatmap-accordion-" + data.aveHic.dataOrder).addClass("expaned");
						$("#heatmap-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
						$('#graph-frame-heatmap-' + data.aveHic.dataOrder).show();
						$("#heatmap-accordion-" + data.aveHic.dataOrder).text("Heatmap close");
					}
					
					if(graphAccordionOnOff==false) {
						$("#graph-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
						$("#graph-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
						$('#graph-frame-graph-' + data.aveHic.dataOrder).hide();
						$("#graph-accordion-" + data.aveHic.dataOrder).text("Graph open");
					} else {
						$("#graph-accordion-" + data.aveHic.dataOrder).addClass("expaned");
						$("#graph-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
						$('#graph-frame-graph-' + data.aveHic.dataOrder).show();
						$("#graph-accordion-" + data.aveHic.dataOrder).text("Graph close");
					}
					
					if(arcAccordionOnOff==false) {
						$("#arc-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
						$("#arc-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
						$('#graph-frame-arc-' + data.aveHic.dataOrder).hide();
						$("#arc-accordion-" + data.aveHic.dataOrder).text("Arc open");
					} else {
						$("#arc-accordion-" + data.aveHic.dataOrder).addClass("expaned");
						$("#arc-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
						$('#graph-frame-arc-' + data.aveHic.dataOrder).show();
						$("#arc-accordion-" + data.aveHic.dataOrder).text("Arc close");
					}
					
					if(geneAccordionOnOff==false) {
						$("#gene-accordion-" + data.aveHic.dataOrder).removeClass("expaned");
						$("#gene-accordion-" + data.aveHic.dataOrder).addClass("btnCloseColor");
						$('#graph-frame-gene-' + data.aveHic.dataOrder).hide();
						$("#gene-accordion-" + data.aveHic.dataOrder).text("Gene open");
					} else {
						$("#gene-accordion-" + data.aveHic.dataOrder).addClass("expaned");
						$("#gene-accordion-" + data.aveHic.dataOrder).removeClass("btnCloseColor");
						$('#graph-frame-gene-' + data.aveHic.dataOrder).show();
						$("#gene-accordion-" + data.aveHic.dataOrder).text("Gene close");
					}
					
					$(document).ajaxStop(function(){
						loading.hide();
					});
				}
			});
		});
		
		var line2 = d3.svg.line()
		.x(function(d,i) {  return d.x; })
		.y(function(d) { return d.y; });
		
		var baitBar = baitBarGroup.append("path")
		.attr('id', 'bait-bar-'+obj.config.dataOrder)
		.attr('class', 'bait')
		.attr("d", line2(p1))
		.on("mouseover", function(d){
			d3.select(this).style('fill', 'green');
			var hilightIndex = parseInt(data.bait / 5000);
		})
		.on("mouseout", function(d){
			d3.select(this).style("fill", "red");
		})
		.style('visibility', function(d){
			if( d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("x") > obj.xScale(data.bait) )
				return 'hidden';
			
			if( parseInt(d3.select("#peakBaseRect-"+ obj.config.dataOrder).attr("x")) + parseInt(d3.select("#peakBaseRect-"+ obj.config.dataOrder).attr("width") ) < obj.xScale(data.bait) )
				return 'hidden';
			
			return 'visible';
		})
		.call( changeBaitDrag );
	}
	
	baitBarGroup.append("text")
	.attr('id', 'bait-label-'+obj.config.dataOrder)
	.attr('class', 'unit-label')
	.attr("text-anchor", function(d){
		return "start";
	})
	.attr("baseline-shift", "-24%")
	.attr('x', obj.xScale(data.bait))
	.attr('y', obj.PADDING + 50 )
	.text( "  ( " + comma(obj.config.bait) + " )")
	.style('visibility', function(d){
		if( d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("x") > obj.xScale(data.bait) )
			return 'hidden';
		
		if( parseInt(d3.select("#peakBaseRect-"+ obj.config.dataOrder).attr("x")) + parseInt(d3.select("#peakBaseRect-"+ obj.config.dataOrder).attr("width") ) < obj.xScale(data.bait) )
			return 'hidden';
		
		return 'visible';
	});
}

HicHistogram.prototype.printInteractionPairInfo = function( origin, idx, d, windowSize ) {
	var endPt = parseInt(d.bin2)+parseInt(windowSize);

	var str = "<div style='width:10%;height:25px;line-height:25px;float:left;text-align:center;'>" + idx + "</div>";
	str += "<div style='width:30%;height:25px;line-height:25px;float:left;text-align:center;'>" + d.bin1 + "</div>";
	str += "<div style='width:50%;height:25px;line-height:25px;float:left;text-align:center;'>" + d.chr + ":" + d.bin2 + "-" + endPt + "</div>";
	str += "<div style='width:10%;height:25px;line-height:25px;float:left;text-align:center;'>" + d.count + "</div>";
	origin.append( str );
};

HicHistogram.prototype.processDrawingArc = function(bottom, fcPeakValue) {
	var obj = this;
	
	d3.selectAll(".arcBar-"+obj.config.dataOrder).remove();
	d3.selectAll(".no-result-arc-"+obj.config.dataOrder).remove();

	var idx = 0;

	var circle = d3.selectAll('.data-point-'+obj.config.dataOrder);
	circle.each(function(d,i) {
		if( obj.fcYscale.invert($(this).attr('cy')) >= obj.config.THRESHOLD ) {
			var upper = (1 * Math.abs(obj.config.bait - obj.xScale.invert($(this).attr('cx'))));
			var lower = Math.max( Math.abs(obj.config.bait - obj.config.rawData.aveHic.startPt), Math.abs(obj.config.rawData.aveHic.endPt - obj.config.rawData.aveHic.bait));
			var ratio = upper / lower;

			obj.arc(d, ratio, 0, (d.foldChange/fcPeakValue), i);
			idx++;
		}
	});
	
	if(idx==0) {
		var arcCanvas = d3.select("#arcCanvas-" + obj.config.dataOrder);
		arcCanvas.append('text')
		.attr("class", "no-result-arc-" + obj.config.dataOrder + " no-data-label")
		.attr("text-anchor", function(d){
			return "middle";
		})
		.attr("baseline-shift", "-24%")
		.attr('x', function(d){ return (obj.WIDTH - (2*obj.PADDING) - obj.LEFT_OFFSET)/2; })
		.attr('y', function(d){ return $("#graph-frame-arc-" + obj.config.dataOrder).height()/2; })
		.text(function(d){ return 'There are no interaction arcs with bait.';})
		;
	}
};

HicHistogram.prototype.drawVerticalScrollBar = function( canvas, bottom, data, choosenFcValue, rectWidth, graphHeight ) {
	var obj = this;
	
	var vScrollBarGroup = canvas.append("g")
	.attr('id', 'vertical-scrollbar-group-'+obj.config.dataOrder);
	
	var arcCanvas = d3.select("#graph-frame-arc-" + obj.config.dataOrder);
	
	var x = this.PADDING + this.LEFT_OFFSET;
	var height = obj.config.ARC_TRACK_HEIGHT;
	
	arcCanvas.append("svg")
	.attr("id", "arcCanvas-" + obj.config.dataOrder)
	.attr("class", "arcCanvas")
	;

	$('#arcCanvas-' + obj.config.dataOrder)
	.attr("y", graphHeight)
	.attr('x', x)
	.attr("width", rectWidth)
	.attr("height", height);
	
	vScrollBarGroup.append("rect")
	.attr('id', 'vertical_scrollbar-'+obj.config.dataOrder)
	.attr('class', 'scrollbar')
	.attr('x', this.WIDTH - this.PADDING)
	.attr('y', this.PADDING + dragBoundaryHeight)
	.attr('width', 20)
	.attr('height', this.config.LINE_CHART_HEIGHT - (2*this.PADDING))
	.on({
		'mousedown':function(){
			if (d3.event.defaultPrevented) return; // click suppressed

			var value = d3.mouse(this)[1];
			obj.config.THRESHOLD = obj.fcYscale.invert( value );
			
			var y = obj.fcYscale(obj.config.THRESHOLD);

			d3.select("#threshold-bar-"+obj.config.dataOrder).attr('y1', y).attr('y2', y);
			
			d3.select('#fold-change-label-' + obj.config.dataOrder).attr('y', y - 10 )
			.text( "Distance normalized Interaction frequency : " + obj.config.THRESHOLD.toFixed(2) );// .toFixed(2) : 소수점 두자리까지 표시
			
			obj.processDrawingArc(bottom, obj.config.rawData.aveHic.fcPeakValue);
			
			d3.select("#vertical_scrollunit-"+obj.config.dataOrder).attr('y', y-10);
		}
	});
	
	var vScrollBarUnit = vScrollBarGroup.append("rect")
	.attr('id', 'vertical_scrollunit-'+obj.config.dataOrder)
	.attr('class', 'scrollUnit vertical')
	.attr('x', this.WIDTH - this.PADDING)
	.attr('y', function(d){
		if(data.fcPeakValue.toFixed(2) >= 2) {
			return obj.fcYscale(choosenFcValue) - 10;
		} else {
			if(obj.config.THRESHOLD == data.fcPeakValue) {
				return obj.fcYscale(data.fcPeakValue) - 10;
			} else {
				return obj.fcYscale(choosenFcValue) - 10;
			}
		}
	})
	.attr('width', 20)
	.attr('height', 20)
	;
	
	var top = d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("y");
	var limitBottom = parseInt(top) + parseInt(d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("height"));
	
	var drag = d3.behavior.drag()
	.on("dragstart", function(d){
		var value = d3.mouse(this)[1];
		obj.config.THRESHOLD = obj.fcYscale.invert( value );
	})
	.on("drag", function(d) {
		var av = d3.event.dy;

		var value = obj.fcYscale( obj.config.THRESHOLD );

		if( $(this).attr("id") === "vertical_scrollunit-" + obj.config.dataOrder )	{
			var currentY = value + av;

			if( (currentY) < top )				av = 0;
			else if( (currentY) > limitBottom ) av = 0;
		}
		
		obj.config.THRESHOLD = obj.fcYscale.invert( value + av );
		
		d3.select('#fold-change-label-' + obj.config.dataOrder).attr('y', value - 10 )
		.text( "Distance normalized Interaction frequency : " + obj.config.THRESHOLD.toFixed(2) );
		
		$("#threshold-bar-"+obj.config.dataOrder).attr('y1', value);
		$("#threshold-bar-"+obj.config.dataOrder).attr('y2', value);
		
		obj.processDrawingArc(bottom, obj.config.rawData.aveHic.fcPeakValue);
		
		d3.select("#vertical_scrollunit-"+obj.config.dataOrder).attr('y', value-10);
	});
	
	vScrollBarUnit.call(drag);
};

HicHistogram.prototype.highlightHittedPoints = function( d, windowSize ) {

};

HicHistogram.prototype.checkParam = function( param ) {
	if( param.startsWith('chr') && param.indexOf(":") ) {
		this.findInteractionPairs( param );
	} else {
		// gene symbol
		this.checkHowManyGenesAreThere( param );
	}
};

HicHistogram.prototype.findInteractionPairs = function( param ) {
	var data = param.split(":");
	var chr = data[0];
	var pos = data[1].split("-")[0];
	
	this.config.chr = chr;

	$("#gene_list_dialog").hide();
	
	var boundary_range = $("#boundary_range").val();
	var window_size = $("#window_size").val();
	var window_size2 = $("#window_size2").val();
	var loci = chr + ":" + pos;
	
	this.findInteractionsAboutBait( loci, boundary_range, window_size, window_size2 );
};

HicHistogram.prototype.checkHowManyGenesAreThere = function( param ) {
	var obj = this;
	
	$.ajax({
		type: 'post',
		url: 'get_gene_symbols',
		data: {symbol:param},
		dataType: 'json',
		success:function(data) {
			if( data.length >= 1 ) {
				var content = $("#gene_list_dialog .dialog-content");
				for(var i in data ) {
					content.append("<div class='gene-symbol-list'>" + param + " " + data[i].chrom + ":" + data[i].txStart + "-" + data[i].txEnd + "</div>");
				}
				
				var geneDialog = $("#gene_list_dialog").dialog({
					resizable: false,
					height: "auto",
					width: 480,
					modal: true,
					buttons:{
						"Close":function() {
							$(this).dialog('close');
						}
					}
				});
				
				$(".gene-symbol-list").click(function(){
					var item = $(this).text();
					var breakedItems = item.split(" ")[1];
					
					obj.findInteractionPairs( breakedItems );
					
					geneDialog.dialog('close');
				});
			} else {
				alert("We can not find any result : " + param);
			}
		}
	});
};

var Controller = function( ) {
    
};

Controller.prototype.init = function( ) {
	var obj = this;
	
	$("#gene_list_dialog").hide();
	$(".loading").hide();
	
	$("#inc").click(function(){
		if( $("#inc_value").val() >= 10 ) {
			alert("User can only add 10 samples on this panel");
			return;
		}
		$("#inc_value").val( parseInt($("#inc_value").val()) + 1 );
	});
	
	$("#dec").click(function(){
		if( $("#inc_value").val() <= 1 ) {
			alert("User have to choose a one sample at least");
			return;
		}
		$("#inc_value").val( parseInt($("#inc_value").val()) - 1 );
	});
	
	$("#btn_run").click(function(){
		if( $(".nav-tabs > .active").attr("id") === "multiple_samples" ) {
			var samples = [];
			var dataOrder = 0;
			$("#chooseInfo tr.appendTr").each(function(){
				var sampleId = $(this).find('td:eq(1)').text();
				var bait = $(this).find('td:eq(3)').text();
				var sampleName = $(this).find('td:eq(2)').text();
				var tad = $(this).find('td:eq(4)').text();
				
				var bait_split = bait.split(":");
				var bait_correction = parseInt(bait_split[1]);
				bait = bait_split[0] + ":" + bait_correction;
				
				samples.push( dataOrder + ";" + sampleId + ";" + sampleName + ";" + bait + ";" + tad );
				dataOrder++;
			});
			
			if( samples.length == 0 ) {
				alert("You have to choose at least one sample");
				return;
			}
			
			var div = $("#graph");
			
			div.empty();
			
			obj.findInteractionPairs( samples );
		}else if( $(".nav-tabs > .active").attr("id") === "pairwise_samples" ){
			var nOfSamples = $('#chooseInfo tr.appendTr').length;
			
			if( nOfSamples != 2 ) {
				alert("You have to choose two samples for pairwise comparison");
				return;
			}
			
			var samples = [];
			
			var basicBait = "";
			var flag = false;
			var dataOrder = 0;
			$("#chooseInfo tr.appendTr").each(function(){
				var sampleId = $(this).find('td:eq(1)').text();
				var bait = $(this).find('td:eq(3)').text();
				var sampleName = $(this).find('td:eq(2)').text();
				
				var bait_split = bait.split(":");
				var bait_correction = parseInt(bait_split[1]);
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
			
			if( flag ) {
				alert("The bait is different between two samples you have chosen");
				return;
			}
			
			var div = $("#graph");
			
			div.empty();
			
			obj.findInteractionPairs4Comparison( samples[0], samples[1] );
		} else {
			var div = $("#graph");

			div.empty();
			
			var samples = [];
			var dataOrder = 0;
			$("#chooseInfo tr.appendTr").each(function(){
				var sampleId = $(this).find('td:eq(1)').text();
				var bait = $(this).find('td:eq(3)').text();
				var sampleName = $(this).find('td:eq(2)').text();
				
				var bait_split = bait.split(":");
				var bait_correction = parseInt(bait_split[1] / 5000) * 5000;
				bait = bait_split[0] + ":" + bait_correction;

				samples.push( dataOrder + ";" + sampleId + ";" + sampleName + ";" + bait );
				dataOrder++;
			});
			
			if( samples.length == 0 ) {
				alert("You have to choose at least one sample");
				return;
			}
			
			obj.findEpigenomics( samples );
		}
	});
	
	$("#submit_btn").click(function(){
		$("#upload_dialog").dialog('close');
		
		$("#more_contents").attr("class","hidden");
		
		if($('#file').val()=='' || $('#file').val()==null) {
			alert("file is not selected");
		} else {
			var div = $("#graph");
			
			div.empty();
			
			var loading = $(".loading");
	
			$(document).ajaxStart(function(){
				loading.show();
			});
			
			$('#fileForm').ajaxForm({
				url: "uploadSetting",
				enctype: "multipart/form-data", // 여기에 url과 enctype은 꼭 지정해주어야 하는 부분이며 multipart로 지정해주지 않으면 controller로 파일을 보낼 수 없음
				type: 'POST',
				dataType: 'json',
				success: function(data){				
					$(".appendTr").remove();
					
					if(data.tab=="multiple_samples") {
						$("#tad_td").removeClass("hidden");
						
						for(var i=0; i< Object.keys(data.items).length; i++) {
							var contents = "";
							contents += "<tr class='appendTr' style='background-color:white;'>";
							contents +=		"<td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td>";
							contents += 	"<td style='width:50px;display:none;'>"+ data.items[i].no +"</td>";
							contents += 	"<td>"+ data.items[i].sample +"</td>";
							contents += 	"<td>"+ data.items[i].bait +"</td>";
							contents += 	"<td>"+ data.items[i].tad +"</td>";
							contents += "</tr>";
							$("#chooseInfo").append( contents );
						}
						
						$("#multiple_samples").addClass("active-tab");
						$("#pairwise_samples").removeClass("active-tab");
						$("#search_samples").removeClass("active-tab");
						
						$("#sel_tad_frame").removeClass("hidden");
						
						obj.drawMultiplePanels(data.data);
					} else if(data.tab=="search_samples"){
						$("#tad_td").addClass("hidden");
						
						for(var i=0; i< Object.keys(data.items).length; i++) {
							var contents = "";
							contents += "<tr class='appendTr' style='background-color:white;'>";
							contents +=		"<td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td>";
							contents += 	"<td style='width:50px;display:none;'>"+ data.items[i].no +"</td>";
							contents += 	"<td>"+ data.items[i].sample +"</td>";
							contents += 	"<td>"+ data.items[i].bait +"</td>";
							contents += "</tr>";
							$("#chooseInfo").append( contents );
						}
						
						$("#multiple_samples").removeClass("active-tab");
						$("#pairwise_samples").removeClass("active-tab");
						$("#search_samples").addClass("active-tab");
						
						$("#sel_tad_frame").addClass("hidden");
						
						var samples = [];
						for(var i=0; i<Object.keys(data.items).length; i++){
							var bait_split = data.items[i].bait.split(":");
							var bait_correction = parseInt(bait_split[1] / 5000) * 5000;
							bait = bait_split[0] + ":" + bait_correction;
							
							samples.push( i + ";" + data.items[i].no + ";" + data.items[i].sample + ";" + bait );
						}
						
						obj.findEpigenomics( samples );
					} else {
						$("#tad_td").addClass("hidden");
						
						for(var i=0; i< Object.keys(data.items).length; i++) {
							var contents = "";
							contents += "<tr class='appendTr' style='background-color:white;'>";
							contents +=		"<td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td>";
							contents += 	"<td style='width:50px;display:none;'>"+ data.items[i].no +"</td>";
							contents += 	"<td>"+ data.items[i].sample +"</td>";
							contents += 	"<td>"+ data.items[i].bait +"</td>";
							contents += "</tr>";
							$("#chooseInfo").append( contents );
						}
						
						$("#multiple_samples").removeClass("active-tab");
						$("#pairwise_samples").addClass("active-tab");
						$("#search_samples").removeClass("active-tab");
						
						$("#sel_tad_frame").addClass("hidden");
						
						var heatmap_resolution = 0;
						
						if(data.data.boundaryRange < 1000000) heatmap_resolution = 5000;
						else if(data.data.boundaryRange < 2000000) heatmap_resolution = 10000;
						else if(data.data.boundaryRange < 3000000) heatmap_resolution = 20000;
						else if(data.data.boundaryRange < 4000000) heatmap_resolution = 30000;
						else heatmap_resolution = 40000;
						
						obj.drawComparisonPanels(data.data, heatmap_resolution);
					}
					
					$(document).ajaxStop(function(){
						loading.hide();
					});
				},
				error : function(request, status, error) {
            		alert("error code : " + request.status +"\n" + "message :"+ request.responseText);
            		
            		$(document).ajaxStop(function(){
						loading.hide();
					});
				}
			});
		}
	});
	
	$("#submit_user_btn").click(function() {
		if($("#user_url").val() == '') {
			alert("Please enter url.");
		} else if ($("#user_bait").val() == '') {
			alert("Please enter a bait.");
		} else {
			$("#upload_user_file_dialog").dialog('close');
			$("#more_contents").attr("class","hidden");
			
			var div = $("#graph");
			div.empty();
			
			var loading = $(".loading");
			$(document).ajaxStart(function(){
				loading.show();
			});
			
			$.ajax({
				type:'post',
				url:'get_own_data',
				dataType : 'json',
				data : {url : $("#user_url").val(), loci : "0;-1;"+$("#user_url").val()+";" + $("#user_bait").val(), window_size: $("#window_size").val()
					, window_size2: $("#window_size2").val(), boundary_range : $("#user_boundary_range").val()},
				success: function(data) {
					$(".appendTr").remove();
					$("#chooseInfo").append("<tr class='appendTr' style='background-color:white;'><td style='width:50px;text-align:center;'><input type='checkbox' class='sample-chk'/></td><td style='width:50px;display:none;'>-1</td><td>User Data</td><td>"+$("#user_bait").val()+"</td></tr>");
					$("#boundary_range").val($("#user_boundary_range").val());
					
					$("#startPt").val(data[0].aveHic.startPt);
					$("#endPt").val(data[0].aveHic.endPt);
					obj.drawMultiplePanels(data);

					$(document).ajaxStop(function(){
						loading.hide();
					});
				}
			});
		}
	});
};

Controller.prototype.drawMultiplePanels = function( originData ) {
	var baseTop = 0;

	for(var i=0; i<Object.keys(originData).length; i++) {
		var config = {
				LINE_CHART_HEIGHT : 300,
			    THRESHOLD : 0,
			    peakDrawingType : 'bar',
			    rawData : originData[ Object.keys(originData)[i] ],
			    dataOrder : originData[ Object.keys(originData)[i] ].aveHic.dataOrder,
			    chr : originData[ Object.keys(originData)[i] ].aveHic.chrom,
			    sampleName : originData[ Object.keys(originData)[i] ].aveHic.sampleName,
			    sampleId : originData[ Object.keys(originData)[i] ].aveHic.sampleId,
			    window_size : originData[ Object.keys(originData)[i] ].aveHic.windowSize,
			    window_size2 : originData[ Object.keys(originData)[i] ].aveHic.windowSize2,
			    boundary_range : originData[ Object.keys(originData)[i] ].aveHic.boundaryRange
		};

		var histogram = new HicHistogram(config);
		histogram.init();

		var startPoint = $("<input type='hidden' id='startPt-"+ config.dataOrder +"'/>");
		var endPoint = $("<input type='hidden' id='endPt-"+ config.dataOrder +"'/>");
		
		$("#contents").append(startPoint);
		$("#contents").append(endPoint);
		
		$("#startPt-"+ config.dataOrder).val(config.rawData.aveHic.startPt);
		$("#endPt-"+ config.dataOrder).val(config.rawData.aveHic.endPt);

		histogram.draw();

		baseTop += histogram.HEIGHT;

		heatmap_default_resolution(config.boundary_range);

		var heatmapParent = $("#graph-frame-heatmap-" + i);
		heatmap_slider(i);
		heatmap_header(config.dataOrder, heatmapParent, heatmap_resolution);
		heatmap( originData[ Object.keys(originData)[i] ].heatmap, config.dataOrder, config.boundary_range);

		histogram.enhancer(originData[ Object.keys(originData)[i] ].enhancer, config.dataOrder);
		histogram.geneSelect(  originData[ Object.keys(originData)[i] ].gene, 'full' );
		histogram.gencodeSelect(  originData[ Object.keys(originData)[i] ].gencode, 'full' );
	}
};

Controller.prototype.drawComparisonPanels = function( data , resolution ) {
	var baseTop = 0;

	var obj1 = data.data[Object.keys(data.data)[0]];
	var obj2 = data.data[Object.keys(data.data)[1]];

	var config = {
		LINE_CHART_HEIGHT : 300,
	    THRESHOLD : 0,
	    peakDrawingType : 'bar',
	    chr : obj2.aveHic.chrom,
	    window_size : data.windowSize,
	    window_size2 : data.windowSize2,
	    boundary_range : data.boundaryRange,
	    bait : obj2.aveHic.bait,
	    startPt : data.startPt,
	    endPt : data.endPt,
	    rawData : data
	};

	var config1 = {
	    rawData : obj1,
	    sampleName : obj1.aveHic.sampleName,
	    sampleId : obj1.aveHic.sampleId
	};
	
	var config2 = {
	    rawData : obj2,
	    sampleName : obj2.aveHic.sampleName,
	    sampleId : obj2.aveHic.sampleId
	};
	
	var comparison = new HicHistogram4Comparison(config, config1, config2, this);
	comparison.init();
	comparison.draw();
	comparison.heatmapdraw(data.diffHeatMap, resolution, config.boundary_range);
	comparison.enhancer(data.enhancer);
	comparison.geneSelect( data.gene, 'full' );
	comparison.gencodeSelect( data.gencode, 'full' );
};

Controller.prototype.findInteractionPairs = function( param ) {
	$("#gene_list_dialog").hide();
	
	var boundary_range = $("#boundary_range").val();
	var window_size = $("#window_size").val();
	var window_size2 = $("#window_size2").val();
	
	if(boundary_range == 1) {
		var boundary_input = $("#direct_input").val();
		var boundary_input_split = boundary_input.split(':');
		var boundary = boundary_input_split[1].split('-');
		var boundary_start = boundary[0];
		var boundary_end = boundary[1];
		
		boundary_range = Math.floor((boundary_end - boundary_start)/2);
		
		if( ((boundary_end - boundary_start) < 100000) ){
			alert("The minimum range is 50kb.");
		} else if ( ((boundary_end - boundary_start) > 4000000) ){
			alert("The maximum range is 2Mb.");
		} else { 
			// Interaction range를 Genomic position From - To로 입력할 경우 실행됨
			this.findInteractionsAboutPosition( param, boundary_range, boundary_start, boundary_end, window_size, window_size2 );
		}
	} else {
		this.findInteractionsAboutBait( param, boundary_range, window_size, window_size2 );
	}
};

Controller.prototype.findEpigenomics = function( param ) {
	$("#gene_list_dialog").hide();
	
	var boundary_range = $("#boundary_range").val();
	var window_size = $("#window_size").val();
	var window_size2 = $("#window_size2").val();
	
	if(boundary_range == 1) {
		var boundary_input = $("#direct_input").val();
		var boundary_input_split = boundary_input.split(':');
		var boundary = boundary_input_split[1].split('-');
		var boundary_start = boundary[0];
		var boundary_end = boundary[1];

		if( ((boundary_end - boundary_start) < 100000) ){
			alert("The minimum range is 50kb.");
		} else if ( ((boundary_end - boundary_start) > 4000000) ){
			alert("The maximum range is 2Mb.");
		} else { 
			this.findEpigenomicsAboutBait( param, boundary_range, window_size, window_size2, boundary_start, boundary_end );
		}
	} else {  
		this.findEpigenomicsAboutBait( param, boundary_range, window_size, window_size2 );
	}
};

Controller.prototype.findInteractionPairs4Comparison = function( loci1, loci2 ) {
	$("#gene_list_dialog").hide();
	
	var boundary_range = $("#boundary_range").val();
	var window_size = $("#window_size").val();
	var window_size2 = $("#window_size2").val();
	
	if(boundary_range == 1) {
		var boundary_input = $("#direct_input").val();
		var boundary_input_split = boundary_input.split(':');
		var boundary = boundary_input_split[1].split('-');
		var boundary_start = boundary[0];
		var boundary_end = boundary[1];
		
		boundary_range = Math.floor((boundary_end - boundary_start)/2);
		
		this.findInteractionsAboutPosition4Comparison( loci1, loci2, boundary_range, boundary_start, boundary_end, window_size, window_size2 );
	} else {
		this.findInteractionsAboutBait4Comparison( loci1, loci2, boundary_range, window_size, window_size2 );
	}
};

Controller.prototype.findInteractionsAboutPosition = function( loci, boundary_range, boundary_start, boundary_end, window_size, window_size2 ) {
	var obj = this;
	
	var loading = $(".loading");
	$(document).ajaxStart(function(){
		loading.show();
	});

	$.ajax({
		type: 'post',
		url: 'get_data_position',
//		dataType: 'json',
		data: {loci:loci.join("&"), boundary_range:boundary_range, boundary_start:boundary_start, boundary_end:boundary_end, window_size:window_size, window_size2:window_size2},
		success:function(data) {
//			var compressed_result = LZString.decompressFromBase64(data);
			var decodedString = decode(data);
			var un = SnappyJS.uncompress( new Uint8Array(decodedString) );

			let decodedText3 = new TextDecoder().decode(un);

			var compressed_result = decodedText3;
			

			
			var jsonData = JSON.parse(compressed_result);
			obj.drawMultiplePanels(jsonData);

			$(document).ajaxStop(function(){
				loading.hide();
			});
		}
	});
};

Controller.prototype.findInteractionsAboutBait = function( loci, boundary_range, window_size, window_size2 ) {
	var obj = this;
	
	var loading = $(".loading");
	$(document).ajaxStart(function(){
		loading.show();
	});
	
	$.ajax({
		type: 'post',
		url: 'get_data',
//		dataType: 'json',
		data: {loci:loci.join("&"), boundary_range:boundary_range, window_size:window_size, window_size2:window_size2},
		beforesend : function() {
			loading.show();
		},
		success:function(data, textStatus, jqXHR) {
			//var compressed_result = LZString.decompressFromBase64(data);
			var decodedString = decodeBase64T( data );
			var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
			 
			let compressed_result = new TextDecoder().decode(un);
			
			var jsonData = JSON.parse(compressed_result);
			obj.drawMultiplePanels(jsonData);

			$(document).ajaxStop(function(){
				loading.hide();
			});
		}
	});
};

function isContainedFilter(column) {
	var flag = false;
	$("#add_tb tr.append_filter_tr").each(function(){
		var sel_column = $(this).find('td:eq(0)').text();

		if( column===sel_column )	{
			alert("The same filter exists.");
			flag = true;
			return false;
		}
	});
	
	return flag;
}

Controller.prototype.findEpigenomicsAboutBait = function( loci, boundary_range, window_size, window_size2, startPt, endPt ) {
	var obj = this;
	
	var contents = "";
	contents += "<div class='packaged-frame-title' style='margin-top:10px;'>Epigenomics</div>";
	contents += "<div style='border:1px solid gray; padding:20px;'>";
	contents += 	"<div style='padding:10px;'>";
	contents += 		"<span><strong>Filter</strong><br/></span>";
	contents += 		"<div id='filter_slider_frame' style='margin:20px 0px'>";
	contents += 			"<span style='float:left; margin-right: 20px;'>Distance normalized Interaction frequency : </span>";
	contents += 			"<div id='filter_slider' style='float:left;'></div>";
	contents += 		"</div>";
	contents += 		"<input id='sliderStart' type='text' style='margin:0px 5px 0px 20px; width:50px; background-color:white;' value='0.00' disabled/> - <input id='sliderEnd' type='text' style='margin-left:5px; width:50px; background-color:white;' value='' disabled/>";
	contents += 		"<br/>";
	contents += 		"<div style='text-align:center; margin-top:15px;'>";
	contents += 			"<button id='filter_btn' class='run_button' style='margin:10px 0px 10px 0px;'>Filter Run</button>";
	contents += 		"</div>";
	contents += 	"</div>";
	contents += 	"<div style='height: 750px; overflow-x:scroll; overflow-y:scroll;'>";
	contents += 		"<table id='epigenomics' style='width:1510px;table-layout:fixed; word-break:break-word;'>";
	contents += 			"<thead>";
	contents += 				"<tr>";
	contents += 					"<th style='width:100px;'>Sample</th>";
	contents += 					"<th style='width:70px;'>Bin</th>";
	contents += 					"<th style='width:70px;'>Distance</th>";
	contents += 					"<th style='width:100px;'>Bias-removed Interaction frequency</th>";
	contents += 					"<th style='width:100px;'>Distance normalized Interaction frequency</th>";
	contents += 					"<th style='width:70px;'>Enhancer</th>";
	contents += 					"<th>GWAS<br/> SNP ID</th>";
	contents += 					"<th style='width:80px;'>Gene Name</th>";
	contents += 					"<th>H3K27ac</th>";
	contents += 					"<th>H3K27me3</th>";
	contents += 					"<th>H3K4me1</th>";
	contents += 					"<th>H3K4me3</th>";
	contents += 					"<th>H3K9me3</th>";
	contents += 					"<th>CTCF</th>";
	contents += 				"</tr>";
	contents += 			"</thead>";
	contents += 		"</table>";
	contents += 	"</div>";
	contents += "</div>";
	$("#graph").append( contents );
	
	$("#add_btn").click(function(){
		if($("#input_val").val() == ''){
			alert("Enter filter value.");
		} else {
			var column = $("#sel_column").val();
			if( isContainedFilter(column) === false ){
				$("#add_tb").append("<tr class='append_filter_tr' id='"+$("#sel_column").val()+"'><td>"+$("#sel_column").val()+"</td><td>"+$("#sign").val()+"</td><td>"+$("#input_val").val()+"</td><td><button class='del_btn' onclick=deleteFilter('"+$("#sel_column").val()+"');>x</button></td></tr>");
			} else {
				return false;
			}
		}
	});
	
	var sliderStartPt = 0;
	var sliderEndPt;
	var sliderMax;
	
	$("#epigenomics").DataTable().clear();
	var table = $("#epigenomics").DataTable({
		"destroy": true,
		"processing": true,
		"pagingType": "full_numbers",
		"ajax":{
			"type": 'post',
			"url": 'get_epigenomics',
			"dataType": 'json',
			"data": {loci:loci.join("&"), boundary_range:boundary_range, window_size:window_size, window_size2:window_size2, startPt: startPt, endPt: endPt},
			"dataSrc": function(json){
				if(json.data){
					sliderMax = json.max;
					sliderEndPt = sliderMax;
					$("#sliderEnd").val(sliderEndPt);

					filter_slider.call(d3.slider().axis(true).value( [ 0, sliderMax ] ).min(0).max(sliderMax).on("slide", function(evt, value) {
						sliderStartPt = value[0].toFixed(2);
						sliderEndPt = value[1].toFixed(2);
						$("#sliderStart").val(sliderStartPt);
						$("#sliderEnd").val(sliderEndPt);
					}));
					
					return json.data;
				} else {
					return [];
				}		
			}
		},
		"columns":[
		    {data: 'sample'},
//		   	{data: 'chr'},
		    {data: 'bin'},
		    {data: 'distance'},
		    {data: 'intensity'},
		    {data: 'significance'},
		    {data: 'enhancer'},
		    {data: 'snps',
		    	"render": function(data, type, row, meta) {
		    		var result = '';
		    		var data1 = data.split(';');
		    		
		    		for(var i=0; i<data1.length; i++){
		    			var d = data1[i].split('rs');
		    			if(d[1]){
		    				if(i != 0)
		    					result += '<a href="https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs='+d[1]+'" target="_blank" style="color:blue; text-decoration:underline;" >;'+ data1[i] +'</a>';
		    				else{
		    					result += '<a href="https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs='+d[1]+'" target="_blank" style="color:blue; text-decoration:underline;" >'+ data1[i] +'</a>';
		    				}
			    		}
		    		}
		    		
		    		if(result) {
		    			return result;
		    		} else {
		    			return data;
		    		}
		    	}
			 },
			{data: 'geneName'},
		    {data: 'h3k27ac'},
		    {data: 'h3k27me3'},
		    {data: 'h3k4me1'},
		    {data: 'h3k4me3'},
		    {data: 'h3k9ac'},
		    {data: 'h3k36me3'}	    
	    ]
	});

	var filter_slider = d3.select("#filter_slider");
	
	$("#epigenomics_filter").hide();

	$('#filter_btn').click( function() {
		$.fn.dataTable.ext.search.push (
			function( settings, data, dataIndex ) {
				var significance = parseFloat( data[4] ) || 0;
				if(significance >= sliderStartPt && significance <= sliderEndPt) {
					return true;
				} else {
					return false;
				}
			}
		);
		table.draw();
	});
};

Controller.prototype.findInteractionsAboutPosition4Comparison = function( loci1, loci2, boundary_range, boundary_start, boundary_end, window_size, window_size2 ) {
	var obj = this;
	
	var loading = $(".loading");
	$(document).ajaxStart(function(){
		loading.show();
	});
	
	heatmap_default_resolution(boundary_range);
	
	$.ajax({
		type: 'post',
		url: 'get_data_position_4_comparison',
//		dataType: 'json',
		data: {loci1:loci1, loci2:loci2, boundary_range:boundary_range, boundary_start:boundary_start, boundary_end:boundary_end, window_size:window_size, window_size2:window_size2,heatmap_windowsize:heatmap_resolution},
		success:function(result) {
//			var compressed_result = LZString.decompressFromBase64(result);
			var decodedString = decode(result);
			var un = SnappyJS.uncompress( new Uint8Array(decodedString) );

			let decodedText3 = new TextDecoder().decode(un);

			var compressed_result = decodedText3;
			
			var data = JSON.parse(compressed_result);
			
			$("#startPt").val(data.startPt);
			$("#endPt").val(data.endPt);
			
			if( Object.keys(data.data).length == 2 ) {	
				obj.drawComparisonPanels(data, heatmap_resolution);
			}

			$(document).ajaxStop(function(){
				loading.hide();
			});
		}
	});
};

Controller.prototype.findInteractionsAboutBait4Comparison = function( loci1, loci2, boundary_range, window_size, window_size2 ) {
	var obj = this;
	
	var loading = $(".loading");
	$(document).ajaxStart(function(){
		loading.show();
	});
	
	heatmap_default_resolution(boundary_range);

	$.ajax({
		type: 'post',
		url: 'get_data_4_comparison',
//		dataType: 'json',
		data: {loci1:loci1, loci2:loci2, boundary_range:boundary_range, window_size:window_size, window_size2:window_size2, heatmap_windowsize:heatmap_resolution},
		success:function(result) {
//			var compressed_result = LZString.decompressFromBase64(result);
			
			var decodedString = decode(result);
			var un = SnappyJS.uncompress( new Uint8Array(decodedString) );

			let decodedText3 = new TextDecoder().decode(un);

			var compressed_result = decodedText3;
			
			var data = JSON.parse(compressed_result);
			
			$("#startPt").val(data.startPt);
			$("#endPt").val(data.endPt);
			
			if( Object.keys(data.data).length == 2 ) {	
				obj.drawComparisonPanels(data, heatmap_resolution);
			}

			$(document).ajaxStop(function(){
				loading.hide();
			});
		}
	});
};

$(document).ready(function () {
	var controller = new Controller();
	controller.init();
});

function getBoundingBoxCenter(selection) {
    var element = selection.node(), bbox = element.getBBox();
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}

function deleteFilter( type ){
	$("#"+type).remove();
}

function selectType( type, obj ){
	if(type == "SVG"){
		saveAsSvg( obj );
	} else if(type == "PNG"){
		saveAsPng ( obj );
	} else if(type == "PDF") {
		fnSaveAsPdf( obj );
	}
}

function saveAsSvg ( obj ){
	var dataOrder = obj.dataOrder;
	
	var serializer = new XMLSerializer();

	var oParser = new DOMParser();
	
	var svgCanvasString = getSVGString( d3.select("svg#canvas-" + dataOrder).node() );
	
//	canvas로 그린 heatmap을 svgString으로 변환
	var width = parseInt(d3.select("#peakBaseRect-0").attr("width"))/Math.sqrt(2);
	
	var opacity = 0;
	var legend_max = 0;
	
	foldChangeMax = obj.rawData.heatmap.max;	// all_capture_res 최대값
	opacity = 1 / (foldChangeMax*0.8);	// 범례의 80% 이상인 경우 red(#ff0000)로 칠함
	
	var isIntChk = isInt((obj.boundary_range*2 )/ $("#heatmap-resolution-"+dataOrder).val());

	if(isIntChk) {
		var cellSize = width / ((((obj.boundary_range*2 )/ $("#heatmap-resolution-"+dataOrder).val()))+1) ;
	} else { 
		var cellSize = width / Math.ceil(((obj.boundary_range*2 )/ $("#heatmap-resolution-"+dataOrder).val())) ;
	}
	
	var canvasWidth = 1024;
	var canvasHeight = 400;
	var ctx = new C2S( canvasWidth, canvasHeight );
	
	ctx.translate(canvasWidth/2, canvasHeight/2);
	ctx.rotate(-45 * Math.PI / 180);
	ctx.translate(-canvasWidth/2, -canvasHeight/2);
	
	var p11 = [width/2, 0];
	var p12 = [width, width];
	
	var p21 = [0, 0];
	var p22 = [width, width/2];
	
	var center = math.intersect(p11, p12, p21, p22);
	
	var rotate_x = canvasWidth/2 - center[0] - 47 + 20;
	var rotate_y = canvasHeight/2 - center[1] + 47 + 20;
	
	ctx.beginPath();
	ctx.moveTo(0+rotate_x, 0+rotate_y);
	ctx.lineTo(width+rotate_x, 0+rotate_y);		
	ctx.lineTo(width+rotate_x, width+rotate_y);
	ctx.closePath();
	
	ctx.strokeStyle = 'lightgray'
	ctx.lineWidth = 2;
	ctx.stroke();
    
	var data = obj.rawData.heatmap;
	var i = 0;
    
    if(data.links != null ){
		for(var k=0; k<data.links.length; k++){
			ctx.fillStyle = 'rgba(255,0,0,'+(data.links[k].value)*opacity+')';
			if(data.links[k].value < $("#sliderStart-"+dataOrder).val())
				ctx.fillStyle = "rgb(255,255,255)";
			
			ctx.fillRect( ((data.links[k].target)*cellSize)+rotate_x, ((data.links[k].source)*cellSize)+rotate_y, cellSize, cellSize);		    	
		}
    }
    
    if(data.tad != null ){
		for(var j=1; j<data.tad.length+1; j++){
			ctx.beginPath();

			ctx.moveTo(data.tad[j-1].tadStartIdx*cellSize + rotate_x, data.tad[j-1].tadStartIdx*cellSize + rotate_y);
			ctx.lineTo(data.tad[j-1].tadEndIdx*cellSize + rotate_x,  data.tad[j-1].tadStartIdx*cellSize + rotate_y);
			ctx.lineTo(data.tad[j-1].tadEndIdx*cellSize + rotate_x, data.tad[j-1].tadEndIdx*cellSize + rotate_y);
			ctx.closePath();

			ctx.globalAlpha = 0.7;
			ctx.strokeStyle = 'blue'
			ctx.lineWidth = 4;
		    ctx.stroke();
		}
    }

    var myRectangle = ctx.getSerializedSvg(true);

	var svgHeatmapString = myRectangle;

	var svgArcString = getSVGString( d3.select("svg#arcCanvas-" + dataOrder).node() );
	var svgEnhancerString = getSVGString( d3.select("svg#enhancerCanvas-" + dataOrder).node() );
	var svgGeneString = getSVGString( d3.select("svg#geneCanvas-" + dataOrder).node() );
	var svgGencodeString = getSVGString( d3.select("svg#gencodeCanvas-" + dataOrder).node() );

	var aa = "<svg>"+svgHeatmapString+""+svgCanvasString+""+svgArcString+""+svgEnhancerString+""+svgGeneString+""+svgGencodeString+"</svg>";

	downloadSVG( aa );
	
	$("#graph-frame-heatmapSVG-"+obj.dataOrder).remove();
}

function saveAsPng ( obj ){
	/** Save as PNG process **/
	
	var dataOrder = obj.dataOrder;
	
	heatmap_svg( obj.rawData.heatmap, obj.dataOrder );
	
	var svgHeatmapTadFrameString = getSVGString( d3.select("svg#heatmapSVGCanvas-" + dataOrder).node() );
	var svgCanvasString = getSVGString( d3.select("svg#canvas-" + dataOrder).node() );
	var svgArcString = getSVGString( d3.select("svg#arcCanvas-" + dataOrder).node() );
	var svgEnhancerString = getSVGString( d3.select("svg#enhancerCanvas-" + dataOrder).node() );
	var svgGeneString = getSVGString( d3.select("svg#geneCanvas-" + dataOrder).node() );
	
	var svgCAEGHeight = $("svg#canvas-" + dataOrder).height() + $("svg#arcCanvas-" + dataOrder).height();
	
	var svgEGHeight = $("svg#enhancerCanvas-" + dataOrder).height() + $("svg#geneCanvas-" + dataOrder).height();
	
	var heatmap_marginLeft = 0.37 * svgEGHeight + svgCAEGHeight;
	
	var svgHeight = 
		$("svg#heatmapSVGCanvas-" + dataOrder).height()
//		$("#graph-frame-heatmapSVG-"+obj.dataOrder).height()
		+ $("svg#canvas-" + dataOrder).height() + $("svg#arcCanvas-" + dataOrder).height()
		+ $("svg#enhancerCanvas-" + dataOrder).height() + $("svg#geneCanvas-" + dataOrder).height();
	
	var svgWidth = $("svg#canvas-" + dataOrder).width();
	
	var svgHeatMapString = 
	"<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block; background-color: white; margin-left: "+ d3.select("#peakBaseRect-" + dataOrder ).attr("x") +"px;\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\""+ svgWidth +"\" height=\""+ svgHeight +"\">"
	+ svgHeatmapTadFrameString
	+ "</svg>";
	
	var svgString = 
	"<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block; background-color: white;\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\""+ svgWidth +"\" height=\""+ svgHeight +"\">"
	+ svgCanvasString + "" + svgArcString + "" + svgEnhancerString + "" + svgGeneString
	+ "</svg>";
		
//	console.log(svgWidth + " " + svgHeight + " " + $("svg#heatmapSVGCanvas-" + dataOrder).height() + " " + heatmap_marginLeft/2);
	
	svgString2Image( svgHeatMapString, svgString, svgWidth, svgHeight, 'png', save, $("svg#heatmapSVGCanvas-" + dataOrder).height(), heatmap_marginLeft/2 ); // passes Blob and filesize String to the callback

	function save( dataBlob, filesize ){
		saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
	}
	
	$("#graph-frame-heatmapSVG-"+obj.dataOrder).remove();
}

function fnSaveAsPdf( obj ) {
	/** Save as PDF process **/
	
	var dataOrder = obj.dataOrder;
	
	heatmap_svg( obj.rawData.heatmap, obj.dataOrder );
	
	var svgHeatmapTadFrameString = getSVGString( d3.select("svg#heatmapSVGCanvas-" + dataOrder).node() );
	var svgCanvasString = getSVGString( d3.select("svg#canvas-" + dataOrder).node() );
	var svgArcString = getSVGString( d3.select("svg#arcCanvas-" + dataOrder).node() );
	var svgEnhancerString = getSVGString( d3.select("svg#enhancerCanvas-" + dataOrder).node() );
	var svgGeneString = getSVGString( d3.select("svg#geneCanvas-" + dataOrder).node() );
	
	var svgCAEGHeight = $("svg#canvas-" + dataOrder).height() + $("svg#arcCanvas-" + dataOrder).height();
	
	var svgEGHeight = $("svg#enhancerCanvas-" + dataOrder).height() + $("svg#geneCanvas-" + dataOrder).height();
	
	var heatmap_marginLeft = 0.37 * svgEGHeight + svgCAEGHeight;
	
	var svgHeight = 
		$("svg#heatmapSVGCanvas-" + dataOrder).height()
//		$("#graph-frame-heatmapSVG-"+obj.dataOrder).height()
		+ $("svg#canvas-" + dataOrder).height() + $("svg#arcCanvas-" + dataOrder).height()
		+ $("svg#enhancerCanvas-" + dataOrder).height() + $("svg#geneCanvas-" + dataOrder).height();
	
	var svgWidth = $("svg#canvas-" + dataOrder).width();
	
	var svgHeatMapString = 
	"<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block; background-color: white; margin-left: "+ d3.select("#peakBaseRect-" + dataOrder ).attr("x") +"px;\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\""+ svgWidth +"\" height=\""+ svgHeight +"\">"
	+ svgHeatmapTadFrameString
	+ "</svg>";
	
	var svgString = 
	"<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block; background-color: white;\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\""+ svgWidth +"\" height=\""+ svgHeight +"\">"
	+ svgCanvasString + "" + svgArcString + "" + svgEnhancerString + "" + svgGeneString
	+ "</svg>";
	
//	console.log(svgWidth + " " + svgHeight + " " + $("svg#heatmapSVGCanvas-" + dataOrder).height() + " " + heatmap_marginLeft/2);

	svgString2Image( svgHeatMapString, svgString, svgWidth, svgHeight, 'pdf', '', $("svg#heatmapSVGCanvas-" + dataOrder).height(), heatmap_marginLeft/2 ); // passes Blob and filesize String to the callback
	
	$("#graph-frame-heatmapSVG-"+obj.dataOrder).remove();
}

heatmap_svg = function(data, i) {
	$("#graph-frame-heatmapSVG-"+ i ).empty();
	var heatmapTotalFrame = $("<div id='graph-frame-heatmapSVG-"+i+"'></div>");
	
	$("#graph-frame-" + i).append( heatmapTotalFrame );

	var margin = {top: 0, right: 0, bottom: 0, left: d3.select("#peakBaseRect-0").attr("x")},
		width = parseInt(d3.select("#peakBaseRect-0").attr("width")),
		height = parseInt(d3.select("#peakBaseRect-0").attr("width"))/2;
	
	var incline = height*Math.sqrt(2);

	var n = Math.ceil( ( data.boundary * 2) / $("#heatmap-resolution-"+i).val()) + 1;
		
	var opacity = 0;
	var legend_max = 0;

	if(data.links != null){
		foldChangeMax = data.max;			// all_capture_res 최대값
		opacity = 1 / (foldChangeMax*0.8);	// 범례의 80% 이상인 경우 red(#ff0000)로 칠함 
		legend_max = foldChangeMax;
	}

	var svg = d3.select("#graph-frame-heatmapSVG-"+i).append("svg")
				.attr("id","heatmapSVGCanvas-"+i)
				.attr("width", width)
				.attr("height", height + 20)
				.style("margin-left", margin.left)
				;
	
	var cellInclineSize = incline / n;
	
	var mvSize = cellInclineSize / Math.sqrt(2);
	
	svg.append("polygon")
		.attr("class","background")
		.style("stroke-width", "3")
		.style("stroke", "lightgray")
		.attr("points", "0,"+height+" "+(width/2)+",0"+" "+width+","+height);  // x,y points
	
	
	var sliderEnd = $("#sliderEnd-"+i).val();
	
	if(parseFloat(sliderEnd) > parseFloat(legend_max.toFixed(2)) ) {
		$("#sliderEnd-"+i).val(legend_max.toFixed(2));
	}

	// slider 안움직였을 때 (맨 처음)
	if(!($("#sliderStart-"+i).val() && $("#sliderEnd-"+i).val())){
		$("#sliderStart-"+i).val(0);
		$("#sliderEnd-"+i).val(legend_max.toFixed(2));
	}else{
		opacity = 1 / ($("#sliderEnd-"+i).val()*0.8);
	}
	
	var cdata = data.links;
	
	var filtered_data = cdata
	.map(function(d, idx) {
		if(d.value*opacity <= 0.01 || d.value< $("#sliderStart-"+i).val() ) return null;
		else return d;
	})
    .filter(function(d) { return d != null })
    ;
	
	var grp = svg.append("g");
	
	grp.selectAll(".heatmapCell")
		.data( filtered_data )
		.enter()
		.append("polygon")
		.attr("fill", "red")
		.attr("fill-opacity", function(d, i){ if(d.value >= $("#sliderEnd-"+i).val()) return 1; else return d.value * opacity;})
		.attr("points", function(d, i){ 
			return getPointsCell( getPositionMatrix(mvSize, height, d.target, d.source ), mvSize ); 
			})
		;

	
	// TAD
	if(data.tad != null ){
		for(var j=1; j<data.tad.length+1; j++){
			svg.append("polygon")
			.attr("id", j )
			.style("fill-opacity", "0")
			.style("stroke-width", "4")
			.style("stroke", "blue")
			.style("opacity" , 0.7)
			.attr("points", function(d,i){ return getTadPosition(mvSize, height, data.tad[j-1].tadStartIdx, data.tad[j-1].tadEndIdx) })
		}
	}
	

};

// cell center position
function getPositionMatrix( mvSize, height, x, y ){

	return (mvSize *( x + y + 1 )) +"," + (height - (mvSize * ( x - y )));
}

// tad polygon points
function getTadPosition ( mvSize, height, startIdx, endIdx ){
	var result =  ((mvSize*(startIdx*2)) +","+ height + " "+ 
			(Number(mvSize*(startIdx*2)) + Number(( (mvSize*((endIdx*2))) - (mvSize*(startIdx*2)) )/2)) +","+ (Number(height) - (( Number(mvSize*((endIdx*2))) - Number(mvSize*(startIdx*2)) )/2)) +" "+
			(mvSize*((endIdx*2))) +","+ height);

	return result;
}

// cell polygon points
function getPointsCell ( point, mvSize ){
	var x = point.split(",")[0];
	var y = point.split(",")[1];
	
	var result = (Number(x) - Number(mvSize)) +","+ y +" "+ x +","+ (Number(y) - Number(mvSize)) +" "+ (Number(x) + Number(mvSize)) +","+ y +" "+ x +","+ (Number(y) + Number(mvSize));
	
	return  result;
}



