var HicHistogram4Comparison = function( config, config1, config2, controller ) {
	this.controller = controller;
	this.config = JSON.parse( JSON.stringify(config) );
    this.config1 = JSON.parse( JSON.stringify(config1) );
    this.config2 = JSON.parse( JSON.stringify(config2) );

    this.initConfig(this.config);
};

var dragBoundaryHeight = 20;

HicHistogram4Comparison.prototype.initConfig = function( config ) {
    if( config.LINE_CHART_HEIGHT === undefined )			config.LINE_CHART_HEIGHT = 200;
    if( config.AVE_HIC_SUM_CHART_HEIGHT === undefined )		config.AVE_HIC_SUM_CHART_HEIGHT = 60;
    if( config.THRESHOLD === undefined )					config.THRESHOLD = 0;
    if( config.peakDrawingType === undefined )				config.peakDrawingType = 'bar';
    if( config.SMOOTHNING_LAYER_HEIGHT === undefined )		config.SMOOTHNING_LAYER_HEIGHT = 5;
    if( config.ARC_TRACK_HEIGHT === undefined )				config.ARC_TRACK_HEIGHT = 120;
    if( config.DEFAULT_FOLDCHANGE_THRESHOLD === undefined )	config.DEFAULT_FOLDCHANGE_THRESHOLD = 2;
};

HicHistogram4Comparison.prototype.makeSubFramesInMainFrame = function( frame ) {
	var obj = this;
	
	var frameTitle = $("<div id='graph-frame-title' class='packaged-frame-title'><div class='compare-sample-a compare-sample'>"+(this.config1.sampleName) + "</div>  <div class='versus-class'>vs.</div>  <div class='compare-sample-b compare-sample'>" + (this.config2.sampleName)+"</div></div>");
	var frameArccordion = $("<div id='graph-frame-arccordion-" + this.config.dataOrder + "' class='packaged-frame-arccordion'></div>");

	var frameHeatmap = $("<div id='graph-frame-heatmap' class='packaged-frame-heatmap'></div>");
	var frameGraph = $("<div id='graph-frame-graph' class='packaged-frame-graph'></div>");
	var frameEnhancer = $("<div id='graph-frame-enhancer' class='packaged-frame-enhancer'></div>");
	var frameGene = $("<div id='graph-frame-gene' class='packaged-frame-gene'></div>");
	var frameGencode = $("<div id='graph-frame-gencode' class='packaged-frame-gene'></div>");
	var frameTargetGeneList = $("<div id='graph-frame-targetlist' class='packaged-frame-targetlist'></div>");
	
	
	var heatmapAccordion = $("<button id='heatmap-accordion" + "' class='button onOffButton expaned' style='margin-top:5px; margin-right:10px; float: right;'>Heatmap close</button>");
	var graphAccordion = $("<button id='graph-accordion" + "' class='button onOffButton expaned' style='margin-top:5px; margin-right:10px; float: right;'>Graph close</button>");
	var geneAccordion = $("<button id='gene-accordion" + "' class='button onOffButton expaned' style='margin-top:5px; margin-right:10px; float: right;'>Gene close</button>");
	
//	var saveAsImagesArccordion = $("<button id='saveAsImages-accordion-" + this.config.dataOrder + "' class='button expaned save-image-btn' style='margin-top:5px; margin-left:10px; float: left;'>save as Images</button>");
	var saveAsImagesArccordion = $("<div id='saveAsImage-frame' style='display:flex;'><button id='saveAsImages-accordion' class='button expaned save-image-btn' style='margin-top:5px; margin-left:10px; float: left;'>save as Images</button><div id='download-sel-btn' class='hidden' style='padding:10px; background-color:#fff; margin:5px 0px 0px 5px; border-radius:5px;'><span class='selectType' id='SVG' style='border:2px solid lightgray; padding:5px; font-weight:bold; margin-right:5px; background-color:#ececec; border-radius:5px; cursor:pointer; font-size:11px;'>SVG</span><span class='selectType' id='PNG' style='border:2px solid lightgray; padding:5px; font-weight:bold; background-color:#ececec; border-radius:5px; cursor:pointer; font-size:11px;'>PNG</span></div></div>");
	
	var frameZoom = $("<div id='frame-zoom' class='zoom-frame' style=''></div>");
	var zoom_in = $("<span>Zoom in </span><button id='zoom-in' class='zoom-btn' style=''>1.5X</button>");
	var zoom_in_3x = $("<button id='zoom-in-3x' class='zoom-btn' style=''>3X</button>");
	
	var zoom_out = $("<span style='margin-left:30px;'>Zoom out </span><button id='zoom-out' class='zoom-btn' style=''>1.5X</button>");
	var zoom_out_3x = $("<button id='zoom-out-3x' class='zoom-btn' style=''>3X</button>");
	
	
	frameArccordion.append(geneAccordion);
	frameArccordion.append(graphAccordion);
	frameArccordion.append(heatmapAccordion);
	
	frameArccordion.append(saveAsImagesArccordion);
	
	frameZoom.append(zoom_in);
	frameZoom.append(zoom_in_3x);
	frameZoom.append(zoom_out);
	frameZoom.append(zoom_out_3x);
	
	$(saveAsImagesArccordion).on('mouseover', function(){
		$(".selectType").off("click").click( function() {
			selectType4Comparison(this.id , obj);
		})

		$("#download-sel-btn").removeClass("hidden");
		
	}).on('mouseout', function(){
		$("#download-sel-btn").addClass("hidden");
	})
	
//	$(saveAsImagesArccordion).on('click', function(){
//		var serializer = new XMLSerializer();
//		
//		var svgString = serializer.serializeToString(d3.select("svg#heatmap_svg_1").node());
//
//		var oParser = new DOMParser();
//		var heatmapClone = d3.select(oParser.parseFromString(svgString, "text/xml").childNodes[0])
//
//		heatmapClone.style("margin-top", 400).style("margin-left", 150).style("margin-bottom", -550);		
//		
//		var svgCanvasString = getSVGString( d3.select("svg#canvas").node() );
//		var svgHeatmapString = getSVGString( heatmapClone.node() );
//		var svgEnhancerString = getSVGString( d3.select("svg#enhancerCanvas").node() );
//		var svgGeneString = getSVGString( d3.select("svg#geneCanvas").node() );
//
//		var aa = "<svg>"+svgHeatmapString+""+svgCanvasString+""+svgEnhancerString+""+svgGeneString+"</svg>";
//
//		downloadSVG( aa );
//	});
	
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
	
	var targetListTable = "<table id='target-gene-list' class='targetGeneList'><tr><th>No.</th><th>Chromosome</th><th>Start</th><th>End</th><th>Gene Name</th><th>Locus</th></tr><tr class='targetGene'><td colspan='6'>If you want to see the results, click on the arc.</td></tr></table>";
	
	frameTargetGeneList.append(targetListTable);

	frame.append(frameTitle);
	frame.append(frameArccordion);
	frame.append(frameZoom);
	frame.append(frameHeatmap);
	frame.append(frameGraph);
	frame.append(frameEnhancer);
	frame.append(frameGene);
	frame.append(frameGencode);
	frame.append(frameTargetGeneList);

	return frame;
};

HicHistogram4Comparison.prototype.settingCanvas = function(div) {
	var canvas = d3.select("#graph-frame-graph")
	.append("svg")
	.attr("id", "canvas")
	.attr("width", 1024)/////////////////////////////////////////////////////
	.attr("height", 284)/////////////////////////////////////////////////////
	.style("display", "block")/////////////////////////////////////////////////////
	.attr("viewBox","0 0 " + div.width() +" " + div.height() );

    this.HEIGHT = $("#canvas").height();
    this.WIDTH = $("#canvas").width();
    this.PADDING = 50;
    this.LEFT_OFFSET = 100;
};

HicHistogram4Comparison.prototype.init = function( frame ) {
	var div = $("#graph");

	if( frame === undefined ) {
		// 최초로 화면에 그려줄 경우는 frame을 생성해야 함
		var frame = $("<div id='graph-frame' class='packaged-frame'></div>");
//		var frameTitle = $("<div id='graph-frame-title' class='packaged-frame-title'><span class='compare-sample-a'>"+(this.config1.sampleName) + "</span>  vs.  <span class='compare-sample-b'>" + (this.config2.sampleName)+"</span></div>");
//		frame.append(frameTitle);
		div.append( this.makeSubFramesInMainFrame( frame ) );
	}else {
		// 이미지 그려진 데이터는 Refresh만 처리하면 되므로 기존 frame을 이용한다
		this.makeSubFramesInMainFrame( frame );
	}

	this.settingCanvas( div );
};


HicHistogram4Comparison.prototype.validateInteractionPairs = function(data, startPt, endPt) {
	var aa = [];
	for(var i=0; i<data.length; i++){
		if( data[i].bin2 >= startPt && data[i].bin2 <= endPt ) {
			aa.push( data[i] );
		}
	}
	return aa;
};

HicHistogram4Comparison.prototype.makeMarkers = function(canvas) {
	var defs = canvas.append("svg:defs").attr("id", "defs");

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
}

HicHistogram4Comparison.prototype.heatmapdraw = function(data, resolution, boundary_range) {
	var heatmapParent = $("#graph-frame-heatmap");

	comparison_heatmap_header(1, heatmapParent, resolution);
	comparison_heatmap(data, 1, boundary_range);
	
//	comparison_heatmap(JSON.parse(data), 1);
};

HicHistogram4Comparison.prototype.arc = function( canvas, summarizedOriginData, base, ratio, order, foldChangeRatio, i ) {
	var obj = this;

	var x1 = obj.xScale(summarizedOriginData.bin1) - d3.select("#arc-sub-canvas-" + order).attr("x");
	var x2 = obj.xScale(summarizedOriginData.bin2) - d3.select("#arc-sub-canvas-" + order).attr("x");
//	var startX = d3.select("#peakBaseRect-1").attr("x");
	var startX = 0;

	var depth = (150 * ratio) + 50;

	var diffBetween2Points = (x1 - x2);
	var alpha = (parseFloat(Math.abs(diffBetween2Points))/(x1-startX) );
	if( alpha > 1 ) alpha = 1;
	
	var alpha2 = 1 - alpha;

	var diff = x1 - (( (diffBetween2Points)/2 ) * alpha2);

	d3.select("#arc-sub-canvas-" + order)
	.append('path')
	.attr('id', 'arc-data-'+order+'-'+i)
	.attr('class', 'arcBar arcBar-' + order)
	.attr('d', function(){
//		return 'M' + x1 + ' ' + base + ' Q' + parseInt((x1 + x2)/2) + ' ' + (base+depth) + ' ' + x2 + ' ' + base;
		return 'M' + x1 + ' ' + base + ' Q' + diff + ' ' + (base+depth) + ' ' + x2 + ' ' + base;
	})
	.style('stroke', function(d){
		return d3.rgb(255 - (255*foldChangeRatio), 255 - (255*foldChangeRatio), 255);
	})
	.on('mouseover',function(){
		$("#"+this.id).css('stroke','red');
		$("#"+this.id).css('stroke-width','3px');
	})
	.on('mouseout', function(){
		$("#"+this.id).css('stroke', function(d){
			return d3.rgb(255 - (255*foldChangeRatio), 255 - (255*foldChangeRatio), 255);
		});
		$("#"+this.id).css('stroke-width','1px');
	})
	.on('click', function(){
		$(".targetGene").remove();
		$.ajax({
			type:'post',
			url:'get_gene',
			data:{chrom:obj.config.chr, startPt:summarizedOriginData.bin2, endPt: summarizedOriginData.bin2+5000},
			success:function(data){
				var TargetGeneList = JSON.parse(data);

				if(TargetGeneList.length != 0){
					for(var j=0; j<TargetGeneList.length; j++){
						var tableContents = "<tr class='targetGene'><td>"+TargetGeneList[j].num+"</td><td>"+TargetGeneList[j].chrom+"</td><td>"+TargetGeneList[j].txStart+"</td><td>"+TargetGeneList[j].txEnd+"</td><td>"+TargetGeneList[j].name+"</td><td>"+TargetGeneList[j].locus+"</td></tr>";
						$("#target-gene-list").append(tableContents);
					}
				}
				else{
					var tableContents = "<tr class='targetGene'><td colspan='5'>There are no genes in this area.</td></tr>";
					$("#target-gene-list").append(tableContents);
				}	
			}
		});
	});
};

HicHistogram4Comparison.prototype.draw = function() {
	var obj = this;

	var summarizedOriginData1 = this.config1.rawData;
	var summarizedOriginData2 = this.config2.rawData;

	var canvas = d3.select("#canvas");

//	var originData1 = summarizedOriginData1.windowData;
//	var originData2 = summarizedOriginData2.windowData;

	var data1 = summarizedOriginData1.aveHic;
	var data2 = summarizedOriginData2.aveHic;

	var rectWidth = this.WIDTH - (2*this.PADDING) -this.LEFT_OFFSET -this.PADDING;
	var rectHeight = this.config.LINE_CHART_HEIGHT - (2*this.PADDING);

	var top = this.PADDING + 20;
//	var top2 = top + rectHeight + (Object.keys(originData1).length * this.config.SMOOTHNING_LAYER_HEIGHT) + 20 + this.config.ARC_TRACK_HEIGHT;
	var top2 = top + rectHeight +  this.config.SMOOTHNING_LAYER_HEIGHT + 30 + this.config.ARC_TRACK_HEIGHT;
	var offset = 30;

	var choosenPeakValue = Math.max(data1.peakValue, data2.peakValue);
	var choosenFcPeakValue = Math.max(data1.fcPeakValue, data2.fcPeakValue);

	this.config.THRESHOLD = this.config.THRESHOLD <= 0 ? obj.config.DEFAULT_FOLDCHANGE_THRESHOLD : this.config.THRESHOLD;
//	this.config.THRESHOLD = choosenFcPeakValue >= obj.config.DEFAULT_FOLDCHANGE_THRESHOLD ? obj.config.DEFAULT_FOLDCHANGE_THRESHOLD : choosenFcPeakValue;
	
	this.yScale1 = d3.scale.linear()
	.domain( [0, choosenPeakValue] )
	.range([ top + rectHeight + dragBoundaryHeight, top + offset + dragBoundaryHeight]);

	this.fcYscale1 = d3.scale.linear()
	.domain( [0, choosenFcPeakValue] )
	.range([ top + rectHeight + dragBoundaryHeight, top + offset + dragBoundaryHeight]);

	this.xScale = d3.scale.linear()
	.domain( [data1.startPt, data1.endPt] )
	.range([this.PADDING + this.LEFT_OFFSET, (this.WIDTH-this.PADDING-this.PADDING)]);

	this.yScale2 = d3.scale.linear()
	.domain( [0, choosenPeakValue] )
	.range([top2 + rectHeight + dragBoundaryHeight, top2 + offset + dragBoundaryHeight]);

	this.fcYscale2 = d3.scale.linear()
	.domain( [0, choosenFcPeakValue] )
	.range([top2 + rectHeight + dragBoundaryHeight, top2 + offset + dragBoundaryHeight]);

	var baseRectGrp = canvas.append("g")
	.attr('id', 'base-rect-group');

	baseRectGrp.append("rect")
	.attr('id', 'dragBoundary-1')
	.attr('class','dragboundary')
	.attr('x', this.xScale(data2.startPt))
	.attr('y', top)
	.attr('width', rectWidth)
	.attr('height', 20)
	.attr('fill','ivory')
	;
	
	baseRectGrp.append("rect")
	.attr('id', 'peakBaseRect-1')
	.attr('class', 'boundary')
	.attr('x', this.xScale(data2.startPt))
	.attr('y', top + dragBoundaryHeight)
	.attr('width', rectWidth)
	.attr('height', rectHeight)
	;
	
	baseRectGrp.append("rect")
	.attr('id', 'dragBoundary-2')
	.attr('class','dragboundary')
	.attr('x', this.xScale(data1.startPt))
	.attr('y', top2)
	.attr('width', rectWidth)
	.attr('height', 20)
	.attr('fill','ivory')
	;

	baseRectGrp.append("rect")
	.attr('id', 'peakBaseRect-2')
	.attr('class', 'boundary')
	.attr('x', this.xScale(data1.startPt))
	.attr('y', top2 + dragBoundaryHeight)
	.attr('width', rectWidth)
	.attr('height', rectHeight)
	;
	
	baseRectGrp.append("text")
	.attr("class", "sample-name-on-graph")
	.attr("text-anchor", "end")
	.attr("baseline-shift", "-24%")
	.attr("x", this.xScale(obj.config.startPt) + rectWidth - 10)
	.attr("y", top + 30)
	.text(obj.config1.sampleName);
	
	baseRectGrp.append("text")
	.attr("class", "sample-name-on-graph")
	.attr("text-anchor", "end")
	.attr("baseline-shift", "-24%")
	.attr("x", this.xScale(obj.config.startPt) + rectWidth - 10)
	.attr("y", top2 + 30)
	.text(obj.config2.sampleName);

//	var bottom1 = (top + rectHeight + (Object.keys(originData1).length  * this.config.SMOOTHNING_LAYER_HEIGHT));
	var bottom1 = (top + rectHeight +  this.config.SMOOTHNING_LAYER_HEIGHT);
//	var bottom2 = (top2 + rectHeight + (Object.keys(originData2).length * this.config.SMOOTHNING_LAYER_HEIGHT));
	var bottom2 = (top2 + rectHeight +  this.config.SMOOTHNING_LAYER_HEIGHT);
	
	this.drawRangePanel( canvas, data1 );
	this.drawTopUnit(canvas, data1, top, 0);
	this.drawingDataPoints(canvas, data1, 0);
	this.drawLeftUnit(canvas, data1, choosenPeakValue, top, bottom1, bottom2, 0);
	this.drawRightUnit(canvas, data1, choosenFcPeakValue, top, bottom1, bottom2, 0, rectWidth);
	this.drawThresholdBar(canvas, data1, this.config.THRESHOLD, 0);
	this.drawVerticalScrollBar(canvas, data1, top, top2, bottom1, bottom2, this.config.THRESHOLD, 0, rectWidth);
//	this.stackedEachWindowData( canvas, originData1, summarizedOriginData1.aveHic, 0 );

	this.drawBaitBar(canvas, data1, top, top + rectHeight, top2, top2 + rectHeight, 0);

	this.drawingDataPoints(canvas, data2, 1);
	this.drawLeftUnit(canvas, data2, choosenPeakValue, top2, bottom1, bottom2, 1);
	this.drawRightUnit(canvas, data2, choosenFcPeakValue, top2, bottom1, bottom2, 1, rectWidth);
	this.drawThresholdBar(canvas, data2, this.config.THRESHOLD, 1);
	this.drawVerticalScrollBar(canvas, data2, top, top2, bottom1, bottom2, this.config.THRESHOLD, 1, rectWidth);
//	this.stackedEachWindowData( canvas, originData2, summarizedOriginData2.aveHic, 1 );

	this.drawBaitBar(canvas, data2, top, top + rectHeight, top2, top2 + rectHeight, 1);

	this.processDrawingArc(bottom1, bottom2, choosenFcPeakValue);

//	var height = top2 + rectHeight + (Object.keys(originData2).length * this.config.SMOOTHNING_LAYER_HEIGHT) + 20 + this.config.ARC_TRACK_HEIGHT; 
	var height = top2 + rectHeight + this.config.SMOOTHNING_LAYER_HEIGHT + 20 + this.config.ARC_TRACK_HEIGHT; 

	canvas.attr("viewBox", "0 0 " + this.WIDTH + " " + height);
	canvas.attr("width", this.WIDTH).attr("height", height);

	var changeBoundaryDrag = d3.behavior.drag()
	.on("dragstart", function(d){
		var pointX = d3.mouse(this)[0];
		var pointY = d3.mouse(this)[1];
		
		baseRectGrp.append("line")
		.attr("id", "moving_area_line")
		.attr("class", "guide-line")
		.attr("x1", pointX)
		.attr("y1", pointY)
		.attr("x2", pointX)
		.attr("y2", pointY)
		;
		
		baseRectGrp.append("text")
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

		var leftLimit = parseInt($("#peakBaseRect-1").attr("x")); 
		var rightLimit = (parseInt($("#peakBaseRect-1").attr("x")) + parseInt($("#peakBaseRect-1").attr("width")));
		if( leftLimit > relativeX )			relativeX = leftLimit;
		else if( rightLimit < relativeX )	relativeX = rightLimit;		
		
		d3.select("#moving_area_line")
		.attr("x2", relativeX)
		.attr("marker-end", "url(#right_arrow)");
		

		var a = parseInt(obj.xScale.invert( relativeX ) / 5000) * 5000;
		var b = parseInt(obj.xScale.invert( d3.select("#moving_area_line").attr("x1") ) / 5000) * 5000;

		var offset = b - a;

		var startPt = parseInt(obj.config.startPt) + parseInt(offset);
		var endPt = parseInt(obj.config.endPt) + parseInt(offset);

		var textX = parseInt(d3.select("#moving_area_text").attr("x"));

		d3.select("#moving_area_text")
		.attr("class", "unit-label")
		.attr("x", textX)
		.text( comma(offset) + "bp");
		
		$("#hidden_range").val( startPt + "," + endPt );
	})
	.on("dragend", function(d){
		d3.select("#moving_area_line").remove();
		d3.select("#moving_area_text").remove();
		
		var boundary_range = parseInt(obj.config.boundary_range);
		var window_size = obj.config.window_size;
		var window_size2 = obj.config.window_size2;
		
		var loci1 = 0 + ";" + obj.config1.sampleId  + ";" + obj.config1.sampleName + ";" + obj.config.chr + ":" + obj.config.bait;
		var loci2 = 1 + ";" + obj.config2.sampleId  + ";" + obj.config2.sampleName + ";" + obj.config.chr + ":" + obj.config.bait;
		var heatmap_window_size = $("#heatmap-resolution-1").val();
		var bothPt = $("#hidden_range").val();
		
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
			url: 'get_change_range_4_comparison',
			dataType: 'json',
			data: {loci1:loci1, loci2:loci2, boundary_range:boundary_range, startEndPt:bothPt, window_size:window_size, window_size2:window_size2, heatmap_window_size:heatmap_window_size, threshold:obj.config.THRESHOLD},
			success:function(data) {
				$("#startPt").val(data.startPt);
				$("#endPt").val(data.endPt);
				
				var heatmapArccordionOnOff = $("#heatmap-accordion").hasClass('expaned');
				var graphAccordionOnOff = $("#graph-accordion").hasClass('expaned');
				var geneAccordionOnOff = $("#gene-accordion").hasClass('expaned');
				
				d3.select("#graph-frame").remove();

				if( Object.keys(data.data).length == 2 ) {	
					var baseTop = 0;

					var obj1 = data.data[Object.keys(data.data)[0]];
					var obj2 = data.data[Object.keys(data.data)[1]];
					
					var config = {
							LINE_CHART_HEIGHT : 300,
						    THRESHOLD : data.threshold,
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
					comparison.heatmapdraw(data.diffHeatMap, heatmap_window_size, config.boundary_range);
					comparison.enhancer(data.enhancer);
					comparison.geneSelect(  data.gene, 'full' );
					
					$(window).scrollTop( scrollTop );
					
					if(heatmapArccordionOnOff==false) {
						$("#heatmap-accordion").removeClass("expaned");
						$("#heatmap-accordion").addClass("btnCloseColor");
						$('#graph-frame-heatmap').hide();
						$("#heatmap-accordion").text("Heatmap open");
					} else {
						$("#heatmap-accordion").addClass("expaned");
						$("#heatmap-accordion").removeClass("btnCloseColor");
						$('#graph-frame-heatmap').show();
						$("#heatmap-accordion").text("Heatmap close");
					}
					
					if(graphAccordionOnOff==false) {
						$("#graph-accordion").removeClass("expaned");
						$("#graph-accordion").addClass("btnCloseColor");
						$('#graph-frame-graph').hide();
						$("#graph-accordion").text("Graph open");
					} else {
						$("#graph-accordion").addClass("expaned");
						$("#graph-accordion").removeClass("btnCloseColor");
						$('#graph-frame-graph').show();
						$("#graph-accordion").text("Graph close");
					}
					
					if(geneAccordionOnOff==false) {
						$("#gene-accordion").removeClass("expaned");
						$("#gene-accordion").addClass("btnCloseColor");
						$('#graph-frame-gene').hide();
						$("#gene-accordion").text("Gene open");
					} else {
						$("#gene-accordion").addClass("expaned");
						$("#gene-accordion").removeClass("btnCloseColor");
						$('#graph-frame-gene').show();
						$("#gene-accordion").text("Gene close");
					}
				}
			}
		});
	});

	var changeBoundaryDragRect = d3.behavior.drag()
	.on("dragstart", function(d){
		var pointX = d3.mouse(this)[0];

		$("#hidden_pointx").val(pointX);

		baseRectGrp.append("polygon")
		.attr("id", "moving_area_rect")
		.attr("class", "guide-rect")
		.attr("points", pointX+","+$("#dragBoundary-1").attr("y")+" "+pointX+","+parseInt($("#dragBoundary-1").attr("y"))+parseInt(20))
		;
		
		baseRectGrp.append("polygon")
		.attr("id", "moving_area_rect1")
		.attr("class", "guide-rect")
		.attr("points", pointX+","+$("#dragBoundary-2").attr("y")+" "+pointX+","+parseInt($("#dragBoundary-2").attr("y"))+parseInt(20))
		;
	})
	.on("drag", function(d) {
		var relativeX = d3.mouse(this)[0];

		var leftLimit = parseInt($("#dragBoundary-1").attr("x")); 
		var rightLimit = (parseInt($("#dragBoundary-1").attr("x")) + parseInt($("#dragBoundary-1").attr("width")));	
		
		if( leftLimit > relativeX )			relativeX = leftLimit;
		else if( rightLimit < relativeX )	relativeX = rightLimit;
		
		var a = parseInt(obj.xScale.invert( relativeX ) / 5000) * 5000;		// drag end point
		var b = parseInt(obj.xScale.invert( $("#hidden_pointx").val() ) / 5000) * 5000;		// drag start point

		if(a < b){
			var temp = b;
			b = a;
			a = temp; 
		}

		var y = parseInt($("#dragBoundary-1").attr("y"))+parseInt(20-1);
		var y2 = parseInt($("#dragBoundary-2").attr("y"))+parseInt(20-1);

		d3.select("#moving_area_rect")
		.attr("points", $("#hidden_pointx").val()+","+$("#dragBoundary-1").attr("y")+" "+$("#hidden_pointx").val()+","+y+" "+ relativeX +","+y+" "+relativeX+","+$("#dragBoundary-1").attr("y"));

		d3.select("#moving_area_rect1")
		.attr("points", $("#hidden_pointx").val()+","+$("#dragBoundary-2").attr("y")+" "+$("#hidden_pointx").val()+","+y2+" "+ relativeX +","+y2+" "+relativeX+","+$("#dragBoundary-2").attr("y"));
		
		$("#hidden_drag_range").val( b + "," + a );
	})
	.on("dragend", function(d){
		var window_size = obj.config.window_size;
		var window_size2 = obj.config.window_size2;	
		var heatmap_window_size = $("#heatmap-resolution-1").val();
		var loci1 = 0 + ";" + obj.config1.sampleId  + ";" + obj.config1.sampleName + ";" + obj.config.chr + ":" + obj.config.bait;
		var loci2 = 1 + ";" + obj.config2.sampleId  + ";" + obj.config2.sampleName + ";" + obj.config.chr + ":" + obj.config.bait;
		var bothPt = $("#hidden_drag_range").val();

		$("#hidden_range").val('');
		
		var loading = $(".loading");
		
		var scrollTop = $(window).scrollTop();
		
		var splitbothPt = bothPt.split(',');
		var boundary_range = parseInt(splitbothPt[1])-parseInt(splitbothPt[0]);
		
		if(boundary_range < 100000) { alert("The minimum range is 50kb."); d3.select('#moving_area_rect').remove(); d3.select('#moving_area_rect1').remove(); return; }
		
		var loading = $(".loading");
		
		var scrollTop = $(window).scrollTop();
		

		$(document).ajaxStart(function(){
			loading.show();
		});
		$.ajax({
			type: 'post',
			url: 'get_change_range_4_comparison',
			dataType: 'json',
			data: {loci1:loci1, loci2:loci2, boundary_range:boundary_range, startEndPt:bothPt, window_size:window_size, window_size2:window_size2, heatmap_window_size:heatmap_window_size, threshold:obj.config.THRESHOLD},
			success:function(data) {
				$("#startPt").val(data.startPt);
				$("#endPt").val(data.endPt);
				
				var heatmapArccordionOnOff = $("#heatmap-accordion").hasClass('expaned');
				var graphAccordionOnOff = $("#graph-accordion").hasClass('expaned');
				var geneAccordionOnOff = $("#gene-accordion").hasClass('expaned');
				
				d3.select("#graph-frame").remove();

				if( Object.keys(data.data).length == 2 ) {	
					var baseTop = 0;

					var obj1 = data.data[Object.keys(data.data)[0]];
					var obj2 = data.data[Object.keys(data.data)[1]];
					
					var config = {
							LINE_CHART_HEIGHT : 300,
						    THRESHOLD : data.threshold,
						    peakDrawingType : 'bar',
						    chr : obj2.aveHic.chrom,
						    window_size : data.windowSize,
						    window_size2 : data.windowSize2,
						    boundary_range : data.boundaryRange/2,
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
					comparison.heatmapdraw(data.diffHeatMap, heatmap_window_size, config.boundary_range);
					comparison.enhancer(data.enhancer);
					comparison.geneSelect(  data.gene, 'full' );
					
					$(window).scrollTop( scrollTop );
					
					if(heatmapArccordionOnOff==false) {
						$("#heatmap-accordion").removeClass("expaned");
						$("#heatmap-accordion").addClass("btnCloseColor");
						$('#graph-frame-heatmap').hide();
						$("#heatmap-accordion").text("Heatmap open");
					} else {
						$("#heatmap-accordion").addClass("expaned");
						$("#heatmap-accordion").removeClass("btnCloseColor");
						$('#graph-frame-heatmap').show();
						$("#heatmap-accordion").text("Heatmap close");
					}
					
					if(graphAccordionOnOff==false) {
						$("#graph-accordion").removeClass("expaned");
						$("#graph-accordion").addClass("btnCloseColor");
						$('#graph-frame-graph').hide();
						$("#graph-accordion").text("Graph open");
					} else {
						$("#graph-accordion").addClass("expaned");
						$("#graph-accordion").removeClass("btnCloseColor");
						$('#graph-frame-graph').show();
						$("#graph-accordion").text("Graph close");
					}
					
					if(geneAccordionOnOff==false) {
						$("#gene-accordion").removeClass("expaned");
						$("#gene-accordion").addClass("btnCloseColor");
						$('#graph-frame-gene').hide();
						$("#gene-accordion").text("Gene open");
					} else {
						$("#gene-accordion").addClass("expaned");
						$("#gene-accordion").removeClass("btnCloseColor");
						$('#graph-frame-gene').show();
						$("#gene-accordion").text("Gene close");
					}
				}
			}
		});

	})
	;
	
	$(".zoom-btn").click(function(){
		var zoom_boundary = 0;
		var id = this.id;
		var split = id.split("-");
		
		if(split[1] == 'in'){
			if(split[2] == '3x'){ zoom_boundary = Math.ceil(((obj.config.boundary_range * 0.3)/2)/1000 * 1000);}
			else{zoom_boundary = Math.ceil(((obj.config.boundary_range * 0.15)/2)/1000 * 1000);}
			
			if ( (obj.config1.rawData.aveHic.endPt - obj.config1.rawData.aveHic.startPt > 100000) && ((obj.config1.rawData.aveHic.endPt-zoom_boundary)- (parseInt(obj.config1.rawData.aveHic.startPt) + parseInt(zoom_boundary)) < 100000)){
				var min50kb = Math.ceil((((obj.config1.rawData.aveHic.endPt - obj.config1.rawData.aveHic.startPt) - 100000 )/2)/1000 * 1000) ;
				$("#hidden_drag_range").val( (parseInt(obj.config1.rawData.aveHic.startPt) + min50kb) + "," + (obj.config1.rawData.aveHic.endPt-min50kb) );
			}
			else if( (obj.config1.rawData.aveHic.endPt - obj.config1.rawData.aveHic.startPt <= 100000 ) && ((obj.config1.rawData.aveHic.endPt-zoom_boundary) - (parseInt(obj.config1.rawData.aveHic.startPt) + parseInt(zoom_boundary)) < 100000)){
				alert("The minimum range is 50Kb.");
				return;
			}
			else{
				$("#hidden_drag_range").val( (parseInt(obj.config1.rawData.aveHic.startPt) + parseInt(zoom_boundary)) + "," + (obj.config1.rawData.aveHic.endPt-zoom_boundary) );
			}
		}
		else{
			if(split[2] == '3x'){ zoom_boundary = Math.ceil(((obj.config.boundary_range * 0.3)/2)/1000 * 1000);}
			else{zoom_boundary = Math.ceil(((obj.config.boundary_range * 0.15)/2)/1000 * 1000);}
			
			if( obj.config1.rawData.aveHic.endPt - obj.config1.rawData.aveHic.startPt < 4000000 && (parseInt(obj.config1.rawData.aveHic.endPt) + parseInt(zoom_boundary)) - (obj.config1.rawData.aveHic.startPt-zoom_boundary)  > 4000000){
				var max2mb = Math.ceil((( 4000000 - (obj.config1.rawData.aveHic.endPt - obj.config1.rawData.aveHic.startPt) )/2)/1000 * 1000) ;
				$("#hidden_drag_range").val( (obj.config1.rawData.aveHic.startPt-max2mb) + "," + (parseInt(obj.config1.rawData.aveHic.endPt) + parseInt(max2mb)) );	
			}
			else if( obj.config1.rawData.aveHic.endPt - obj.config1.rawData.aveHic.startPt >= 4000000 && (parseInt(obj.config1.rawData.aveHic.endPt) + parseInt(zoom_boundary)) - (obj.config1.rawData.aveHic.startPt-zoom_boundary)  > 4000000 ){
				alert("The maximum range is 2Mb.");
				return;
			}
			else{
				$("#hidden_drag_range").val( (obj.config1.rawData.aveHic.startPt-zoom_boundary) + "," + (parseInt(obj.config1.rawData.aveHic.endPt) + parseInt(zoom_boundary)) );	
			}	
		}
		
		var window_size = obj.config.window_size;
		var window_size2 = obj.config.window_size2;	
		var heatmap_window_size = $("#heatmap-resolution-1").val();
		var loci1 = 0 + ";" + obj.config1.sampleId  + ";" + obj.config1.sampleName + ";" + obj.config.chr + ":" + obj.config.bait;
		var loci2 = 1 + ";" + obj.config2.sampleId  + ";" + obj.config2.sampleName + ";" + obj.config.chr + ":" + obj.config.bait;
		var bothPt = $("#hidden_drag_range").val();

		$("#hidden_range").val('');
		
		var loading = $(".loading");
		
		var scrollTop = $(window).scrollTop();
		
		var splitbothPt = bothPt.split(',');
		var boundary_range = parseInt(splitbothPt[1])-parseInt(splitbothPt[0]);
		
		var loading = $(".loading");
		
		var scrollTop = $(window).scrollTop();
		

		$(document).ajaxStart(function(){
			loading.show();
		});
		$.ajax({
			type: 'post',
			url: 'get_change_range_4_comparison',
			dataType: 'json',
			data: {loci1:loci1, loci2:loci2, boundary_range:boundary_range, startEndPt:bothPt, window_size:window_size, window_size2:window_size2, heatmap_window_size:heatmap_window_size, threshold:obj.config.THRESHOLD},
			success:function(data) {
				$("#startPt").val(data.startPt);
				$("#endPt").val(data.endPt);
				
				var heatmapArccordionOnOff = $("#heatmap-accordion").hasClass('expaned');
				var graphAccordionOnOff = $("#graph-accordion").hasClass('expaned');
				var geneAccordionOnOff = $("#gene-accordion").hasClass('expaned');
				
				d3.select("#graph-frame").remove();

				if( Object.keys(data.data).length == 2 ) {	
					var baseTop = 0;

					var obj1 = data.data[Object.keys(data.data)[0]];
					var obj2 = data.data[Object.keys(data.data)[1]];
					
					var config = {
							LINE_CHART_HEIGHT : 300,
						    THRESHOLD : data.threshold,
						    peakDrawingType : 'bar',
						    chr : obj2.aveHic.chrom,
						    window_size : data.windowSize,
						    window_size2 : data.windowSize2,
						    boundary_range : data.boundaryRange/2,
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
					comparison.heatmapdraw(data.diffHeatMap, heatmap_window_size, config.boundary_range);
					comparison.enhancer(data.enhancer);
					comparison.geneSelect(  data.gene, 'full' );
					
					$(window).scrollTop( scrollTop );
					
					if(heatmapArccordionOnOff==false) {
						$("#heatmap-accordion").removeClass("expaned");
						$("#heatmap-accordion").addClass("btnCloseColor");
						$('#graph-frame-heatmap').hide();
						$("#heatmap-accordion").text("Heatmap open");
					} else {
						$("#heatmap-accordion").addClass("expaned");
						$("#heatmap-accordion").removeClass("btnCloseColor");
						$('#graph-frame-heatmap').show();
						$("#heatmap-accordion").text("Heatmap close");
					}
					
					if(graphAccordionOnOff==false) {
						$("#graph-accordion").removeClass("expaned");
						$("#graph-accordion").addClass("btnCloseColor");
						$('#graph-frame-graph').hide();
						$("#graph-accordion").text("Graph open");
					} else {
						$("#graph-accordion").addClass("expaned");
						$("#graph-accordion").removeClass("btnCloseColor");
						$('#graph-frame-graph').show();
						$("#graph-accordion").text("Graph close");
					}
					
					if(geneAccordionOnOff==false) {
						$("#gene-accordion").removeClass("expaned");
						$("#gene-accordion").addClass("btnCloseColor");
						$('#graph-frame-gene').hide();
						$("#gene-accordion").text("Gene open");
					} else {
						$("#gene-accordion").addClass("expaned");
						$("#gene-accordion").removeClass("btnCloseColor");
						$('#graph-frame-gene').show();
						$("#gene-accordion").text("Gene close");
					}
				}
			}
		});
	});

	d3.select("#dragBoundary-1").call(changeBoundaryDragRect);
	d3.select("#dragBoundary-2").call(changeBoundaryDragRect);
	d3.select("#peakBaseRect-1").call(changeBoundaryDrag);
	d3.select("#peakBaseRect-2").call(changeBoundaryDrag);
};

HicHistogram4Comparison.prototype.drawRangePanel = function(canvas, data) {
	var obj = this;
	this.makeMarkers( canvas );
	
	var rangeGroup = canvas.append("g").attr('id', 'range-group');
	
	var rangeText = rangeGroup.append("text")
	.attr('id', 'range_text')
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
	.attr('id', 'range-line-left')
	.attr('class', 'range-boundary')
	.attr('x1', this.PADDING + this.LEFT_OFFSET)
	.attr('y1', (this.PADDING/3))
	.attr('x2', ((this.WIDTH - obj.LEFT_OFFSET)/2 + obj.LEFT_OFFSET) - offset - this.PADDING)
	.attr('y2', (this.PADDING/3))
	.attr("marker-start", "url(#left_arrow)");
	;

	rangeGroup.append("line")
	.attr('id', 'range-line-right')
	.attr('class', 'range-boundary')
	.attr('x1', ((this.WIDTH - obj.LEFT_OFFSET)/2 + obj.LEFT_OFFSET) + offset)
	.attr('y1', (this.PADDING/3))
	.attr('x2', this.WIDTH - this.PADDING - this.PADDING)
	.attr('y2', (this.PADDING/3))
	.attr("marker-end", "url(#right_arrow)");
	;
}

HicHistogram4Comparison.prototype.drawLeftUnit = function(canvas, data, choosenPeakValue, top, bottom1, bottom2, order) {
	var obj = this;

	var topLimit = 0;
	if( order === 0 )	topLimit = obj.yScale1.invert(top);
	else				topLimit = obj.yScale2.invert(top);
	
	var increment = parseInt(Math.ceil(choosenPeakValue));
	
	if( increment < 1 ) increment = (choosenPeakValue / 5);
	else if(increment < 5)		increment = 1;
	else if(increment < 15)		increment = 5;
	else increment = 10;

	if( increment > 0 ) {
		var units = canvas.append('g');
		
		units.append('text')
		.attr('class', 'unit-label')
		.attr("text-anchor", "end")
		.attr("baseline-shift", "-25%")
		.attr('x', function(d){return obj.PADDING + obj.LEFT_OFFSET + obj.LEFT_OFFSET;})
		.attr('y', function(d){
			if( order === 0 )	return bottom1 + 30;
			return bottom2 + 30;
		})
		.text( "(Bias-removed Interaction frequency)");
		
		for(var i=0; i<=topLimit; i+=increment) {
			var val = 0;
			if( increment < 1 )	val = i;
			else				val = parseInt(i);
	
			units.append('line')
			.attr('class', 'unit')
			.attr('x1', obj.PADDING + obj.LEFT_OFFSET - 15)
			.attr('y1', function(d){
				if( order === 0 )	return obj.yScale1(val);
				return obj.yScale2(val);
			})
			.attr('x2', obj.PADDING + obj.LEFT_OFFSET)
			.attr('y2', function(d){
				if( order === 0 )	return obj.yScale1(val);
				return obj.yScale2(val);	
			});
			
			units.append("text")
			.attr('class', 'unit-label')
			.attr("text-anchor", "end")
			.attr("baseline-shift", "-25%")
			.attr('x', function(d){return obj.PADDING + obj.LEFT_OFFSET - 17;})
			.attr('y', function(d){
				if( order === 0 )	return obj.yScale1(val);
				return obj.yScale2(val);
			})
			.text( val.toFixed(1) );
		}
	}
}

HicHistogram4Comparison.prototype.drawRightUnit = function(canvas, data, choosenFcPeakValue, top, bottom1, bottom2, order, rectWidth) {
	var obj = this;

	var topLimit = 0;
	if( order === 0 )	topLimit = obj.fcYscale1.invert(top);
	else				topLimit = obj.fcYscale2.invert(top);
	
	var increment = parseInt(choosenFcPeakValue);
	if( increment < 1 ) increment = (choosenFcPeakValue / 5);
	else if(increment < 5)		increment = 1;
	else if(increment < 15)		increment = 5;
	else increment = 10;

	if( increment > 0 ) {
		var units = canvas.append('g');
		
		units.append('text')
		.attr('class', 'unit-label')
		.attr("text-anchor", "start")
		.attr("baseline-shift", "-25%")
		.attr('x', function(d){return rectWidth;})
		.attr('y', function(d){
			if( order === 0 )	return bottom1 + 30;
			return bottom2 + 30;
		})
		.text( "(Distance normalized Interaction frequency)");
		
		for(var i=0; i<=topLimit; i+=increment) {
			var val = 0;
			if( increment < 1 )	val = i;
			else				val = parseInt(i);
	
			units.append('line')
			.attr('class', 'unit')
			.attr('x1', obj.PADDING + obj.LEFT_OFFSET + rectWidth)
			.attr('y1', function(d){
				if( order === 0 )	return obj.fcYscale1(val);
				return obj.fcYscale2(val);
			})
			.attr('x2', obj.PADDING + obj.LEFT_OFFSET + 15 + rectWidth)
			.attr('y2', function(d){
				if( order === 0 )	return obj.fcYscale1(val);
				return obj.fcYscale2(val);	
			});
			
			units.append("text")
			.attr('class', 'unit-label')
			.attr("text-anchor", "start")
			.attr("baseline-shift", "-25%")
			.attr('x', function(d){return obj.PADDING + obj.LEFT_OFFSET + 17  + rectWidth;})
			.attr('y', function(d){
				if( order === 0 )	return obj.fcYscale1(val);
				return obj.fcYscale2(val);
			})
			.text( val.toFixed(1) );
		}
	}
}


HicHistogram4Comparison.prototype.drawTopUnit = function(canvas, data, baseYpos, order) {
	var obj = this;

	var horizontalUnitGroup = canvas.append('g').attr('id', 'horizontal-unit-group' + order);
	
	var divUnit = parseInt(parseInt(data.boundaryRange) * 2) / 10;

	var base = data.startPt;
	for(var i=0; i<=10; i++) {
		var variableFactor = (i) * divUnit;
		var txtLeft = parseInt(parseInt(base) + variableFactor);
		var left = obj.xScale( txtLeft );

		horizontalUnitGroup.append('line')
		.attr('class', 'unit')
		.attr('x1', left)
		.attr('y1', baseYpos - 10)
		.attr('x2', left)
		.attr('y2', baseYpos)
		;
		
		horizontalUnitGroup.append("text")
		.attr('class', 'unit-label')
		.attr("text-anchor", "middle")
		.attr("baseline-shift", "30%")
		.attr('x', left)
		.attr('y', baseYpos-10)
		.text( comma(txtLeft) );
	}
}

HicHistogram4Comparison.prototype.drawThresholdBar = function(canvas, data, choosenFcValue, order) {
	var obj = this;

	var grp = canvas.append('g')
	.attr('id', 'threashold-bar-group-'+order);
	
	grp.append('line')
	.attr('id', 'threshold-bar-'+order)
	.attr('class', 'threshold-bar')
	.attr('x1', this.PADDING+this.LEFT_OFFSET)
	.attr('y1', function(d) {
		if( order === 0 )
			return obj.fcYscale1(choosenFcValue);
		return obj.fcYscale2(choosenFcValue);
	})
	.attr('x2', this.WIDTH - this.PADDING)
	.attr('y2', function(d) {
		if( order === 0 )
			return obj.fcYscale1(choosenFcValue);
		return obj.fcYscale2(choosenFcValue);
	})
	;

	grp.append('text')
	.attr('id', 'fold-change-label-' + order)
	.attr("class", "unit-label")
	.attr("text-anchor", "end")
	.attr("baseline-shift", "-24%")
	.attr('x', this.WIDTH - this.PADDING - 10 - this.PADDING)
	.attr('y', function(d) {
		if( order === 0 )
			return obj.fcYscale1(choosenFcValue) - 10;
		return obj.fcYscale2(choosenFcValue) - 10;
	})
	.text( "Distance normalized Interaction frequency : " + parseFloat(choosenFcValue).toFixed(2) );
}

HicHistogram4Comparison.prototype.drawingDataPoints = function( canvas, data, order ) {
	var obj = this;

	var offset = parseFloat(data.windowSize) / 2;
	var width = data.windowSize;

	var unitWidth = obj.xScale( data.startPt + 1000) - obj.xScale(data.startPt);

	if( this.config.peakDrawingType==='bar') {
//		var defs = d3.select("#defs");
//		var gradient = defs.append("linearGradient")
//	    .attr("id", "gradient-" + order)
//	    .attr("x1", "0")
//	    .attr("x2", "0")
//	    .attr("y1", function(d){
//	    	if( order === 0)
//	    		return obj.fcYscale1(0);
//	    	return obj.fcYscale2(0);
//	    })
//	    .attr("y2", function(d){
//	    	if( order === 0 )
//	    		return obj.fcYscale1(data.fcPeakValue);
//	    	return obj.fcYscale2(data.fcPeakValue);
//	    })
//	    .attr("spreadMethod", "pad")
//	    .attr("gradientUnits", "userSpaceOnUse");
//
//		gradient.append("stop")
//	    .attr("offset", "0")
//	    .attr("stop-color", "#ff0")
//	    .attr("stop-opacity", 1);
//
//		gradient.append("stop")
//	    .attr("offset", "0.5")
//	    .attr("stop-color", "#f00")
//	    .attr("stop-opacity", 1);
//
//		canvas.append('g')
//		.attr('id', 'bar-data-'+order)
//		.selectAll('rect')
//		.data(data.interactionPairs)
//		.enter()
//		.append('rect')
//		.attr('class', 'bar bar-'+order)
//		.attr('x', function(d, i) {
//			return obj.xScale(d.bin2);
//		})
//		.attr('y', function(d, i){
//			if( order === 0 )
//				return obj.yScale1(d.count);
//			return obj.yScale2(d.count);
//		})
//		.attr('width', function(d, i) {
//			return unitWidth;
//		})
//		.attr('height', function(d, i){
//			if(order === 0 )
//				return obj.yScale1(0) - obj.yScale1(d.count);
//			return obj.yScale2(0) - obj.yScale2(d.count);
//		})
//		.style('stroke-width', function(d, i) {
//			return 0;
//		})
//		.style("fill", function(d) {
//			if( order === 0 )
//				return "url('#gradient-0')";
//			return "url('#gradient-1')";
//		});
		
		var barGroup = canvas.append('g')
		.attr('id', 'bar-data-'+order);
		
		if( data.peakValue > 0 ) {
			barGroup.selectAll('line')
			.data(
					data.interactionPairs
					.map(function(v, idx) { 
						return v.count == 0? null : { bin1: v.bin1, bin2: v.bin2, foldChange: v.foldChange, count: v.count }
					})
				    .filter(function(v) { return v != null })
			)
			.enter()
			.append('line')
			.attr('class', 'bar bar-'+order)
			.attr('x1', function(d, i) {
				return obj.xScale(d.bin2 - offset);
			})
			.attr('y1', function(d, i){
				if( order === 0 )
					return obj.yScale1(d.count);
				return obj.yScale2(d.count);
			})
			.attr('x2', function(d, i) {
				return obj.xScale(d.bin2 - offset);
			})
			.attr('y2', function(d, i){
				if( order === 0 )
					return obj.yScale1(0);
				return obj.yScale2(0);
			});

//			var line = d3.svg.line()
//			.x(function(d,i) {
//				return obj.xScale(d.bin2 - offset); 
//			})
//			.y(function(d) {
//				if( order === 0 )
//					return obj.yScale1(d.count);
//				return obj.yScale2(d.count);
//			});
//			
//			barGroup.append('g')
//			.append("path")
//			.attr('id', 'bar-data-'+obj.config.dataOrder)
//			.attr('class', 'bar bar-'+obj.config.dataOrder)
//			.attr('d', line(data.interactionPairs));
		}

		if( data.peakValue === 0 ) {
			var x = parseInt($('#peakBaseRect-2').attr("x")) + parseInt($('#peakBaseRect-2').attr("width")/2);
			var y = parseInt($('#peakBaseRect-2').attr("y")) + parseInt($('#peakBaseRect-2').attr("height")/2);
			if( order === 0 )	{
				x = parseInt($('#peakBaseRect-1').attr("x")) + parseInt($('#peakBaseRect-1').attr("width")/2);
				y = parseInt($('#peakBaseRect-1').attr("y")) + parseInt($('#peakBaseRect-1').attr("height")/2);
			}
			d3.select("#bar-data-" + order)
			.append('text')
			.attr('id', 'bar-data-no-data-' + order)
			.attr("text-anchor", "middel")
			.attr("baseline-shift", "-24%")
			.attr('x', x)
			.attr('y', y)
			.text('[ No Data ]')
			;
			
			$("#bar-data-no-data-0").attr('x', x - $("#bar-data-no-data-0").width()/2);
			$("#bar-data-no-data-1").attr('x', x - $("#bar-data-no-data-1").width()/2);
		}else {
			d3.select('#bar-data-no-data-'+order).remove();
		}
	}
	
	if( this.config.isDrawingDataPoint === undefined ) {
		var fcGroup = canvas.append('g')
		.attr('id', 'circle-data-'+order);
		
		var dt = JSON.parse(JSON.stringify(data.interactionPairs));

		if( data.peakValue > 0 ) {
			fcGroup.selectAll('circle')
			.data(
//					data.interactionPairs
//					.map(function(v, idx) {
////						if( !(((idx) % 5 == 0) ) ){
////							return null;
////						}
//						return v.count == 0? null : { bin1: v.bin1, bin2: v.bin2, foldChange: v.foldChange }
//					})
//				    .filter(function(v) { return v != null })
					dt
			)
			.enter()
			.append('circle')
			.attr('class', 'foldchange-point data-point-' + order)
			.attr('cx', function(d, i) {
				return obj.xScale(d.bin2 - offset);
			})
			.attr('cy', function(d, i){
				if( order === 0 ) {
					return obj.fcYscale1(d.foldChange);
				}
				return obj.fcYscale2(d.foldChange);
			})
			.attr('r', 1)
			;
		}
	}
}

HicHistogram4Comparison.prototype.stackedEachWindowData = function(canvas, data, aveHic, order) {
	var obj = this;

	var totalGroup = canvas.append('g')
	.attr('id', 'windowsize-total-group-' + order)
	;

	var yBase = obj.yScale2( 0 ) + 2;
	if( order === 0 )
		yBase = obj.yScale1(0) + 2;

	for(var i=0; i<Object.keys(data).length; i++) {
		var windowSize = Object.keys(data)[i];
		var windowData = data[windowSize];

		var group = canvas.append('g')
		.attr('id', 'windowsize-'+windowSize+'-group-' + order);

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
}

HicHistogram4Comparison.prototype.drawBaitBar = function(canvas, data, top1, base1, top2, base2, order) {
	var obj = this;

	var baitBarGroup = canvas.append("g").attr("id", "bait-lable-group-" + order);

	var OFFSET = 5;
	var OFFSET_V = 5;
	var OFFSET_W = 20;

	var p11 =  [
	           {x:(obj.xScale(data.bait)), y:top1+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)-OFFSET), y:(top1 + OFFSET_V)+dragBoundaryHeight}, 
	           {x:(obj.xScale(data.bait)-OFFSET), y: (base1 - OFFSET_V)+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)), y:base1+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)+OFFSET), y: (base1 - OFFSET_V)+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)+OFFSET), y:(top1 + OFFSET_V)+dragBoundaryHeight}
	           ];

	var p12 =  [
	           {x:(obj.xScale(data.bait)), y:top1+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)-OFFSET_W), y:(top1 + OFFSET_V)+dragBoundaryHeight}, 
	           {x:(obj.xScale(data.bait)-OFFSET_W), y: (base1 - OFFSET_V)+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)), y:base1+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)+OFFSET_W), y: (base1 - OFFSET_V)+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)+OFFSET_W), y:(top1 + OFFSET_V)+dragBoundaryHeight}
	           ];

	var p21 =  [
	           {x:(obj.xScale(data.bait)), y:top2+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)-OFFSET), y:(top2 + OFFSET_V)+dragBoundaryHeight}, 
	           {x:(obj.xScale(data.bait)-OFFSET), y: (base2 - OFFSET_V)+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)), y:base2+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)+OFFSET), y: (base2 - OFFSET_V)+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)+OFFSET), y:(top2 + OFFSET_V)+dragBoundaryHeight}
	           ];

	var p22 =  [
	           {x:(obj.xScale(data.bait)), y:top2+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)-OFFSET_W), y:(top2 + OFFSET_V)+dragBoundaryHeight}, 
	           {x:(obj.xScale(data.bait)-OFFSET_W), y: (base2 - OFFSET_V)+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)), y:base2+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)+OFFSET_W), y: (base2 - OFFSET_V)+dragBoundaryHeight},
	           {x:(obj.xScale(data.bait)+OFFSET_W), y:(top2 + OFFSET_V)+dragBoundaryHeight}
	           ];
	
	var changeBaitDrag = d3.behavior.drag()
	.on("dragstart", function(d){
		d3.select("#bait-bar-0")
		.attr("d", function(d){
			return line2(p12);
		});
		
		d3.select("#bait-bar-1")
		.attr("d", function(d){
			return line2(p22);
		});
	})
	.on("drag", function(d) {
		// 드래그 할때와 화면에 있는 기준 위치와 다른 문제가 있음
		// 향후 해결해야 할 문제임
		var LEFT_BOUNDARY = parseInt(d3.select("#peakBaseRect-1").attr("x"));
		var RIGHT_BOUNDARY = parseInt(d3.select("#peakBaseRect-1").attr("x")) + parseInt(d3.select("#peakBaseRect-1").attr("width"));

		var relativeX = d3.mouse(this)[0];	

		if( relativeX < LEFT_BOUNDARY )		relativeX = LEFT_BOUNDARY;
		if( relativeX > RIGHT_BOUNDARY )	relativeX = RIGHT_BOUNDARY;

		obj.config.bait = (parseInt(Math.ceil(obj.xScale.invert(relativeX)/1000))*1000);

		var diffX = d3.event.dx;
		
		if( (p21[0].x + diffX) < LEFT_BOUNDARY || (p21[0].x + diffX) > RIGHT_BOUNDARY ){
			diffX = 0;
		}

		d3.select("#bait-bar-0")
		.attr("d", function(d){
			for(var i=0; i<p11.length; i++)	p11[i].x += diffX;
			for(var i=0; i<p12.length; i++)	p12[i].x += diffX;

			return line2(p12);
		});
		
		d3.select("#bait-bar-1")
		.attr("d", function(d){
			for(var i=0; i<p21.length; i++)	p21[i].x += diffX;
			for(var i=0; i<p22.length; i++)	p22[i].x += diffX;

			return line2(p22);
		});

		var baitLabel = d3.select("#bait-label-0")
		.attr("class", "unit-label")
		.attr("x", relativeX )
		.attr("text-anchor", function(d) {
			if( relativeX + this.getBBox().width > RIGHT_BOUNDARY )
				return "end";

			return "start";
		})
		.text( "  ( " + comma(obj.config.bait) + " )" );

		var baitLabel = d3.select("#bait-label-1")
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
		d3.select("#bait-bar-0")
		.attr("d", function(d){
			return line2(p11);
		});
		
		d3.select("#bait-bar-1")
		.attr("d", function(d){
			return line2(p21);
		});

		var boundary_range = parseInt(obj.config.boundary_range);
		var window_size = obj.config.window_size;
		var window_size2 = obj.config.window_size2;
		
		var loci1 = 0 + ";" + obj.config1.sampleId  + ";" + obj.config1.sampleName + ";" + obj.config.chr + ":" + obj.config.bait;
		var loci2 = 1 + ";" + obj.config2.sampleId  + ";" + obj.config2.sampleName + ";" + obj.config.chr + ":" + obj.config.bait;
		var heatmap_windowsize = $("#heatmap-resolution-1").val();
		var loading = $(".loading");
		
		var scrollTop = $(window).scrollTop();

		$(document).ajaxStart(function(){
			loading.show();
		});
		$("#hidden_range").val('');
		$.ajax({
			type: 'post',
			url: 'get_data_4_comparison',
//			dataType: 'json',
			data: {loci1:loci1, loci2:loci2, boundary_range:boundary_range, window_size:window_size, window_size2:window_size2, heatmap_windowsize:heatmap_windowsize, threshold:obj.config.THRESHOLD},
			success:function(result) {
//				var compressed_result = LZString.decompressFromBase64(result);
				
				var decodedString = decode(result);
				var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
 
				let decodedText3 = new TextDecoder().decode(un);

				var compressed_result = decodedText3;
				
				var data = JSON.parse(compressed_result);
				
				$("#startPt").val(data.startPt);
				$("#endPt").val(data.endPt);
				
				var heatmapArccordionOnOff = $("#heatmap-accordion").hasClass('expaned');
				var graphAccordionOnOff = $("#graph-accordion").hasClass('expaned');
				var geneAccordionOnOff = $("#gene-accordion").hasClass('expaned');
				
				d3.select("#graph-frame").remove();

				if( Object.keys(data.data).length == 2 ) {	
					var baseTop = 0;

					var obj1 = data.data[Object.keys(data.data)[0]];
					var obj2 = data.data[Object.keys(data.data)[1]];

					var config = {
							LINE_CHART_HEIGHT : 300,
						    THRESHOLD : data.threshold,
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
					comparison.heatmapdraw(data.diffHeatMap, heatmap_windowsize, config.boundary_range);
					comparison.enhancer(data.enhancer);
					comparison.geneSelect(  data.gene, 'full' );
					
					$(window).scrollTop( scrollTop );
					
					if(heatmapArccordionOnOff==false) {
						$("#heatmap-accordion").removeClass("expaned");
						$("#heatmap-accordion").addClass("btnCloseColor");
						$('#graph-frame-heatmap').hide();
						$("#heatmap-accordion").text("Heatmap open");
					} else {
						$("#heatmap-accordion").addClass("expaned");
						$("#heatmap-accordion").removeClass("btnCloseColor");
						$('#graph-frame-heatmap').show();
						$("#heatmap-accordion").text("Heatmap close");
					}
					
					if(graphAccordionOnOff==false) {
						$("#graph-accordion").removeClass("expaned");
						$("#graph-accordion").addClass("btnCloseColor");
						$('#graph-frame-graph').hide();
						$("#graph-accordion").text("Graph open");
					} else {
						$("#graph-accordion").addClass("expaned");
						$("#graph-accordion").removeClass("btnCloseColor");
						$('#graph-frame-graph').show();
						$("#graph-accordion").text("Graph close");
					}
					
					if(geneAccordionOnOff==false) {
						$("#gene-accordion").removeClass("expaned");
						$("#gene-accordion").addClass("btnCloseColor");
						$('#graph-frame-gene').hide();
						$("#gene-accordion").text("Gene open");
					} else {
						$("#gene-accordion").addClass("expaned");
						$("#gene-accordion").removeClass("btnCloseColor");
						$('#graph-frame-gene').show();
						$("#gene-accordion").text("Gene close");
					}
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

	var baitBar2 = baitBarGroup.append("path")
	.attr('id', 'bait-bar-' + order)
	.attr('class', 'bait')
	.attr("d", function(d){
		if( order === 0 )
			return line2(p11);
		return line2(p21);
	})
	.on("mouseover", function(d){
		d3.selectAll(".bait").style('fill', 'green');
	})
	.on("mouseout", function(d){
		d3.selectAll(".bait").style("fill", "red");
	})
	.style('visibility', function(d){
		if( d3.select("#peakBaseRect-1").attr("x") > obj.xScale(data.bait) )
			return 'hidden';
		
		if( parseInt(d3.select("#peakBaseRect-1").attr("x")) + parseInt(d3.select("#peakBaseRect-1").attr("width")) < obj.xScale(data.bait) )
			return 'hidden';

		return 'visible';
	})
	.call( changeBaitDrag );

	baitBarGroup.append("text")
	.attr('id', 'bait-label-'+order)
	.attr('class', 'bait-label unit-label')
	.attr("text-anchor", function(d){
		return "start";
	})
	.attr("baseline-shift", "-24%")
	.attr('x', obj.xScale(data.bait))
	.attr('y', function(d) {
		if( order === 0 ) 
			return top1 + 50;
		return top2 + 50;
	})
	.style('visibility', function(d){
		if( d3.select("#peakBaseRect-1").attr("x") > obj.xScale(data.bait) )
			return 'hidden';
		
		if( parseInt(d3.select("#peakBaseRect-1").attr("x")) + parseInt(d3.select("#peakBaseRect-1").attr("width")) < obj.xScale(data.bait) )
			return 'hidden';

		return 'visible';
	})
	.text( "  ( " + comma(obj.config.bait) + " )");
}

HicHistogram4Comparison.prototype.printInteractionPairInfo = function( origin, idx, d, windowSize ) {
	var endPt = parseInt(d.bin2)+parseInt(windowSize);

	var str = "<div style='width:10%;height:25px;line-height:25px;float:left;text-align:center;'>" + idx + "</div>";
	str += "<div style='width:30%;height:25px;line-height:25px;float:left;text-align:center;'>" + d.bin1 + "</div>";
	str += "<div style='width:50%;height:25px;line-height:25px;float:left;text-align:center;'>" + d.chr + ":" + d.bin2 + "-" + endPt + "</div>";
	str += "<div style='width:10%;height:25px;line-height:25px;float:left;text-align:center;'>" + d.count + "</div>";
	origin.append( str );
};

HicHistogram4Comparison.prototype.processDrawingArc = function(bottom1, bottom2, globalFcPeakValue) {
	var obj = this;
	
	d3.selectAll(".arcBar-0").remove();
	d3.selectAll(".arcBar-1").remove();
	d3.selectAll(".no-result-arc-0").remove();
	d3.selectAll(".no-result-arc-1").remove();

	var idx1 = 0;
	d3.selectAll('.data-point-0').each(function(d,i) {
		if( obj.fcYscale1.invert($(this).attr('cy')) >= obj.config.THRESHOLD ) {
			var upper = (1 * Math.abs(obj.config.bait - obj.xScale.invert($(this).attr('cx'))));
			var lower = Math.max( Math.abs(obj.config.bait - obj.config.startPt), Math.abs(obj.config.endPt - obj.config.bait));
			var ratio = upper / lower;

			obj.arc(canvas, d, dragBoundaryHeight, ratio, 0, (d.foldChange/globalFcPeakValue), idx1);
			idx1++;
		}
	});

	var idx2 = 0;
	d3.selectAll('.data-point-1').each(function(d,i) {
		if( obj.fcYscale2.invert($(this).attr('cy')) >= obj.config.THRESHOLD ) {
			var upper = (1 * Math.abs(obj.config.bait - obj.xScale.invert($(this).attr('cx'))));
			var lower = Math.max( Math.abs(obj.config.bait - obj.config.startPt), Math.abs(obj.config.endPt - obj.config.bait));
			var ratio = upper / lower;

			obj.arc(canvas, d, dragBoundaryHeight, ratio, 1, (d.foldChange/globalFcPeakValue), idx2);
			idx2++;
		}
	});

	var labelCenterX = parseInt(d3.select("#peakBaseRect-1").attr("x")) + parseInt(d3.select("#peakBaseRect-1").attr("width")/2);

	if(idx1==0) {
		var arcCanvas = d3.select("#arc-group-0");
		arcCanvas.append('text')
		.attr("class", "no-result-arc-0 no-data-label")
		.attr("text-anchor", function(d){
			return "middle";
		})
		.attr("baseline-shift", "-24%")
		.attr('x', function(d){ return labelCenterX; })
		.attr('y', function(d){ return bottom1 + (obj.config.ARC_TRACK_HEIGHT/2); })
		.text(function(d){ return 'There are no interaction arcs with bait.';})
		;
	}
	
	if(idx2==0) {
		var arcCanvas = d3.select("#arc-group-1");
		arcCanvas.append('text')
		.attr("class", "no-result-arc-1  no-data-label")
		.attr("text-anchor", function(d){
			return "middle";
		})
		.attr('x', function(d){ return labelCenterX; })
		.attr('y', function(d){ return bottom2 + (obj.config.ARC_TRACK_HEIGHT/2); })
		.text(function(d){ return 'There are no interaction arcs with bait.';})
		;
	}
}

HicHistogram4Comparison.prototype.drawVerticalScrollBar = function( canvas, data, top, top2, bottom1, bottom2, choosenFcValue, order, rectWidth ) {
	var obj = this;
	
	var arcBottomPadding = 20;
	
	var vScrollBarGroup = canvas.append("g")
	.attr('id', 'vertical-scrollbar-group-'+order);

	var grp = canvas.append("g")
	.attr('id', 'arc-group-'+order);
	
	var x = this.PADDING + this.LEFT_OFFSET;
//	var width = this.WIDTH - (2*this.PADDING) - this.LEFT_OFFSET;
	var height = obj.config.ARC_TRACK_HEIGHT;

	if( order === 0 )	grp.append("svg").attr("id", "arc-sub-canvas-" + order).attr("y",bottom1+arcBottomPadding).attr('x', x).attr("width", rectWidth).attr("height", height + dragBoundaryHeight);
	else				grp.append("svg").attr("id", "arc-sub-canvas-" + order).attr("y",bottom2+arcBottomPadding).attr('x', x).attr("width", rectWidth).attr("height", height + dragBoundaryHeight);

	vScrollBarGroup.append("rect")
	.attr('id', 'vertical_scrollbar-'+order)
	.attr('class', 'scrollbar')
	.attr('x', this.WIDTH - this.PADDING)
	.attr('y', function(d){
		if( order === 0 )
			return top + dragBoundaryHeight;
		return top2 + + dragBoundaryHeight;
	})
	.attr('width', 20)
	.attr('height', this.config.LINE_CHART_HEIGHT - (2*obj.PADDING) )
	.on({
		'mousedown':function(){
			if (d3.event.defaultPrevented) return; // click suppressed

			var value = d3.mouse(this)[1];
			if( $(this).attr("id") === "vertical_scrollbar-0" )	{
				obj.config.THRESHOLD = obj.fcYscale1.invert( value );
			}else{
				obj.config.THRESHOLD = obj.fcYscale2.invert( value );
			}

			var y1 = obj.fcYscale1(obj.config.THRESHOLD);
			var y2 = obj.fcYscale2(obj.config.THRESHOLD);

			d3.select("#threshold-bar-0").attr('y1', y1).attr('y2', y1);
			d3.select("#threshold-bar-1").attr('y1', y2).attr('y2', y2);

			d3.select('#fold-change-label-0').attr('y', y1 - 10 ).text( "Distance normalized Interaction frequency : " + obj.config.THRESHOLD.toFixed(2) );
			d3.select('#fold-change-label-1').attr('y', y2 - 10 ).text( "Distance normalized Interaction frequency : " + obj.config.THRESHOLD.toFixed(2) );
			
			obj.processDrawingArc(bottom1, bottom2, choosenFcValue);
			
			d3.select("#vertical_scrollunit-0").attr('y', y1-10);
			d3.select("#vertical_scrollunit-1").attr('y', y2-10);
			
//			d3.select("#vertical_scrollunit-0")
//			.attr("d", function(d){
//				for(var i=0; i<poly.length; i++) poly[i].y = poly[i].y - (poly[poly.length-1].y - y1 - $("#vertical_scrollunit-0").attr("height")/2);
//				return line2(poly);
//			})
//			;
//			
//			d3.select("#vertical_scrollunit-1")
//			.attr("d", function(d){
//				for(var i=0; i<poly2.length; i++) poly2[i].y = poly2[i].y - (poly2[poly2.length-1].y - y2 - $("#vertical_scrollunit-1").attr("height")/2);
//				return line2(poly2);
//			})
//			;
		}
	})
	;

	var vScrollBarUnit = vScrollBarGroup.append("rect")
	.attr('id', 'vertical_scrollunit-'+order)
	.attr('class', 'scrollUnit vertical')
	.attr('x', this.WIDTH - this.PADDING)
	.attr('y', function(d){
		if( order === 0 )
			return obj.fcYscale1(choosenFcValue) - 10;
		return obj.fcYscale2(choosenFcValue) - 10;
	})
	.attr('width', 20)
	.attr('height', 20)
	;
	
//	if(order==0) {
//		poly = [{"x": parseInt(this.WIDTH - this.PADDING - 10), "y": obj.fcYscale1(choosenFcValue) - 10 + 20/2},
//		        {"x": this.WIDTH - this.PADDING, "y": obj.fcYscale1(choosenFcValue) - 10 + 0},
//		        {"x": this.WIDTH - this.PADDING +20, "y": obj.fcYscale1(choosenFcValue) - 10 + 0},
//		        {"x": this.WIDTH - this.PADDING +20, "y": obj.fcYscale1(choosenFcValue) - 10 + 20},
//		        {"x": this.WIDTH - this.PADDING, "y": obj.fcYscale1(choosenFcValue) - 10 + 20}];
//	} else {
//		poly2 = [{"x": parseInt(this.WIDTH - this.PADDING - 10), "y": obj.fcYscale2(choosenFcValue) - 10 + 20/2},
//		        {"x": this.WIDTH - this.PADDING, "y": obj.fcYscale2(choosenFcValue) - 10 + 0},
//		        {"x": this.WIDTH - this.PADDING +20, "y": obj.fcYscale2(choosenFcValue) - 10 + 0},
//		        {"x": this.WIDTH - this.PADDING +20, "y": obj.fcYscale2(choosenFcValue) - 10 + 20},
//		        {"x": this.WIDTH - this.PADDING, "y": obj.fcYscale2(choosenFcValue) - 10 + 20}];
//	}
//	
//	var line2 = d3.svg.line()
//	.x(function(d) { return d.x; })
//	.y(function(d) { return d.y; });
//	
//	var vScrollBarUnit = vScrollBarGroup
//	.selectAll("path")
//	.data([poly])
//	.enter()
//	.append("path")
//	.attr('id', 'vertical_scrollunit-'+order)
//	.attr('class', 'scrollUnit vertical')
//	.attr("d",  function(d) {
//		if( order === 0 )	return line2(poly);
//		else				return line2(poly2);
//	})
//	.attr("x", this.WIDTH - this.PADDING)
//	.attr("y", function(d){
//		if( order === 0 )
//			return obj.fcYscale1(choosenFcValue) - 10;
//		return obj.fcYscale2(choosenFcValue) - 10;
//	})
//	.attr("width", 20)
//	.attr("height", 20)
//	;
	
	var drag = d3.behavior.drag()
	.on("dragstart", function(d){
		var value = d3.mouse(this)[1];
		if( $(this).attr("id") === "vertical_scrollunit-0" )	{
			obj.config.THRESHOLD = obj.fcYscale1.invert( value );
		}else{
			obj.config.THRESHOLD = obj.fcYscale2.invert( value );
		}
	})
	.on("drag", function(d) {
		var av = d3.event.dy;

		var y1 = obj.fcYscale1(obj.config.THRESHOLD);
		var y2 = obj.fcYscale2(obj.config.THRESHOLD);
		
		if( $(this).attr("id") === "vertical_scrollunit-0" )	{
			var currentY = y1 + av;
	
			if( (currentY) < top ) av = 0;
			else if( (currentY) > (top + obj.config.LINE_CHART_HEIGHT - (2*obj.PADDING)) ) av = 0;
		}else {
			var currentY = y2 + av;
	
			if( (currentY) < top2 ) av = 0;
			else if( (currentY) > (top2 + obj.config.LINE_CHART_HEIGHT - (2*obj.PADDING)) ) av = 0;
		}
		
		obj.config.THRESHOLD = obj.fcYscale1.invert( y1 + av );

		d3.select('#fold-change-label-0').attr('y', y1 - 10 ).text( "Distance normalized Interaction frequency : " + obj.config.THRESHOLD.toFixed(2) );
		d3.select('#fold-change-label-1').attr('y', y2 - 10 ).text( "Distance normalized Interaction frequency : " + obj.config.THRESHOLD.toFixed(2) );
		
		d3.select("#threshold-bar-0").attr('y1', y1).attr('y2', y1);
		d3.select("#threshold-bar-1").attr('y1', y2).attr('y2', y2);

		obj.processDrawingArc(bottom1, bottom2, choosenFcValue);
		
		d3.select("#vertical_scrollunit-0").attr('y', y1-10);
		d3.select("#vertical_scrollunit-1").attr('y', y2-10);
		
//		d3.select("#vertical_scrollunit-0")
//		.attr("d", function(d){
//			for(var i=0; i<poly.length; i++) poly[i].y = poly[i].y - (poly[poly.length-1].y - y1 - $("#vertical_scrollunit-0").attr("height")/2);
//			return line2(poly);
//		})
//		;
//		
//		d3.select("#vertical_scrollunit-1")
//		.attr("d", function(d){
//			for(var i=0; i<poly2.length; i++) poly2[i].y = poly2[i].y - (poly2[poly2.length-1].y - y2 - $("#vertical_scrollunit-1").attr("height")/2);
//			return line2(poly2);
//		})
//		;
	});
	
	
	vScrollBarUnit.call(drag);
}



HicHistogram4Comparison.prototype.drawGencodeGeneTracks = function( gencodeCanvas, data, dbType, drawingType, yPos, rectHeight, diffOffset ) {
	var obj = this;

	var marginBetweenLayers = 2;

	var gencodeGeneTracks = data[ dbType ];
	
	var gencodeGeneGroup = gencodeCanvas.append('g').attr('id', dbType+'-gencode-gene-group');

	var yBase = yPos + (0 * rectHeight);

	for(layerIndex in gencodeGeneTracks) {
		var gencodeGenes = gencodeGeneTracks[layerIndex];
		
		var gencodeGeneGroupLine = gencodeGeneGroup.append('g').attr('id', dbType+'-gene-line'+layerIndex);

		for(gencodeGeneIndexInEachLayer in gencodeGenes) {
			var lineFunction = d3.svg.line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });
			
			var startPoint = obj.xScale(parseInt(gencodeGenes[gencodeGeneIndexInEachLayer].txStart));
			var endPoint = obj.xScale(parseInt(gencodeGenes[gencodeGeneIndexInEachLayer].txEnd));
			
			var startLine = [{x:startPoint, y:yBase}, {x:startPoint, y:yBase+rectHeight}];
			
			gencodeGeneGroupLine.append("path")
			.attr("class", "gencode-gene-startLine")
			.attr("d", lineFunction(startLine))
			.attr("stroke", "blue")
			.attr("stroke-width", 1);
			
			var endLine = [{x:endPoint, y:yBase}, {x:endPoint, y:yBase+rectHeight}];
			
			gencodeGeneGroupLine.append("path")
			.attr("class", "gencode-gene-endLine")
			.attr("d", lineFunction(endLine))
			.attr("stroke", "blue")
			.attr("stroke-width", 1);
			
			var geneBody = [{x:startPoint, y:yBase+rectHeight/2}, {x:endPoint, y:yBase+rectHeight/2}];
			
			gencodeGeneGroupLine.append("path")
			.attr("class", "gencode-gene-geneBody")
			.attr("d", lineFunction(geneBody))
			.attr("stroke", "blue")
			.attr("stroke-width", 1);
			
			var standardLineLength = endPoint - startPoint;
			var k = parseInt(standardLineLength / 10);
			if(k == 0)	k = 1;
			
			for(var i=1; i<k+1; i++) {
				var points = [];
				
				var arrowPos = startPoint + (endPoint - startPoint)/(k+1) * i;

				var baseY = yBase+rectHeight/2;
				
				if( gencodeGenes[gencodeGeneIndexInEachLayer].strand == '+' ) {
					points = [{x:arrowPos-3, y:baseY-3}, {x:arrowPos, y:baseY}, {x:arrowPos-3, y:baseY+3}];
				} else {
					points = [{x:arrowPos+3, y:baseY-3}, {x:arrowPos, y:baseY}, {x:arrowPos+3, y:baseY+3}];
				}
	
				gencodeGeneGroupLine.append("path")
				.attr("class", "gencode-gene-strand")
				.attr("d", lineFunction(points))
				.attr("fill", "none")
				.attr("stroke", "blue")
				.attr("stroke-width", 1);
			}
			
			if( drawingType === 'full' ) {
				gencodeGeneGroupLine.append('text')
				.attr('id', dbType+'-gencode-gene-text'+layerIndex+'-data-'+gencodeGeneIndexInEachLayer)
				.attr('class', dbType+'_gencode_geneText')
				.attr('text-anchor', 'end')
				.attr("baseline-shift", "-75%")
				.attr('font-size', '10px')
				.attr('x', function(d){ return obj.xScale(parseInt(gencodeGenes[gencodeGeneIndexInEachLayer].txStart)) - diffOffset -2;})
				.attr('y', yBase )
				.text(gencodeGenes[gencodeGeneIndexInEachLayer].name);
			}
		}

		if( drawingType === 'full' )		yBase += (rectHeight + marginBetweenLayers);
		else if( drawingType === 'dense' )	yBase = yBase;
	}
	
	return ( Object.keys(gencodeGeneTracks).length * parseInt(rectHeight) ) + ((Object.keys(gencodeGeneTracks).length-1) * marginBetweenLayers);
};

HicHistogram4Comparison.prototype.gencodeSelect = function( data, drawingType ) {
	var obj = this;

	var gencodeSelect = "";
	gencodeSelect += "<div id='gencode-select' class='gene-select'></div>";

	$("#graph-frame-gencode").append( gencodeSelect );

	var select = "";
	select += "<select id='collapseType' class='collapseType'>";
	select += 	"<option value='full' selected>full</option>";
	select += 	"<option value='dense'>dense</option>";
	select += "</select>";

	$("#gencode-select").append( select );

	$("#collapseType").change(function(){
		obj.gencode(  data, $("#collapseType option:selected").val() );
	});

	obj.gencode( data, $("#collapseType option:selected").val() );
};


HicHistogram4Comparison.prototype.gencode = function( data, drawingType ) {
	var obj = this;
	
	$("#gencodeCanvas").remove();
	
	var graphDiv = $("#graph-frame-graph");
	var enhancerDiv = $("#graph-frame-enhancer");
	var geneDiv = $("#graph-frame-gene");
	var gencodeDiv = $("#graph-frame-gencode");
	
    var gencodeCanvas = d3.select("#graph-frame-gencode")
    .append("svg")
    .attr("id", "gencodeCanvas")
    .attr("y", graphDiv.height() + enhancerDiv.height() + geneDiv.height())
    .style("width" , gencodeDiv.width())
    .style("display", "block")
    .attr("viewBox","0 0 " + gencodeDiv.width() +" " + gencodeDiv.height() )
    ;

    var diffOffset = $("#peakBaseRect-1").attr("x");
    diffOffset = 0;

    var innerSvg = gencodeCanvas.append("svg")
    .attr("id", "gencodeDrawingCanvas")
    .attr("x", $("#peakBaseRect-1").attr("x"))
    .attr("y", 0)
    .attr("width", gencodeDiv.width())
    ;

	var gencodeGroup_topMargin = 10;
	var gencodeGroup_bottomMargin = 10;
	var prevGencodeGroup_height = 15;

	var rectHeight = 10;

	var y = gencodeGroup_topMargin;
	var innerY = gencodeGroup_topMargin;
	
//	var dbName = gencodeCanvas.append('text')
//	.attr('class', 'unit-label')
//	.attr('x', 25)
//	.attr('y', y + rectHeight);
	
	var dbgroup = gencodeCanvas.append('g');
	
	var dbNameBackground = dbgroup.append('rect')
	.attr('class', 'svg-name-background')
	.attr('font-size', '15px')
	.attr('x', 33)
	.attr('y', 6)
	.attr('rx', 10)
	.attr('ry', 10)
	.attr('width', 75)
	.attr('height', 20)
	.style('fill', '#17a2b8')
	;
	
	var dbName = dbgroup.append('text')
	.attr('class', 'svg-name')
	.attr('font-size', '15px')
	.attr('x', 45)
	.attr('y', y + rectHeight);

	for( var dbTypeIndex=0; dbTypeIndex < Object.keys(data).length; dbTypeIndex++ ) {		
		dbName.text(Object.keys(data)[dbTypeIndex]);
		
		var height = this.drawGencodeGeneTracks( innerSvg, data, Object.keys(data)[dbTypeIndex], drawingType, y, rectHeight, diffOffset );

		if( dbTypeIndex == Object.keys(data).length-1 )		y += height;
		else												y += (height + prevGeneGroup_height);
	}
	
	var totalHeight = y + gencodeGroup_bottomMargin;
	var InnertotalHeight = innerY + gencodeGroup_bottomMargin;

	if(drawingType=='full') {
		gencodeCanvas.attr("viewBox","0 0 " + gencodeDiv.width() +" " + totalHeight );
		gencodeCanvas.attr("height", totalHeight );
		innerSvg.attr("viewBox", $("#peakBaseRect-1").attr("x") + " 0 " + gencodeDiv.width() +" " + totalHeight );
	} else {
		gencodeCanvas.attr("viewBox","0 0 " + geneDiv.width() +" " + InnertotalHeight );
		gencodeCanvas.attr("height", InnertotalHeight );
		innerSvg.attr("viewBox", $("#peakBaseRect-1").attr("x") + " 0 " + gencodeDiv.width() +" " + InnertotalHeight );
	}
};


HicHistogram4Comparison.prototype.drawGeneTracks = function( geneCanvas, data, dbType, drawingType, yPos, rectHeight, diffOffset ) {
	var obj = this;

	var marginBetweenLayers = 2;

	var geneTracks = data[ dbType ];
	
	var geneGroup = geneCanvas.append('g').attr('id', dbType+'-gene-group');

	var yBase = yPos + (0 * rectHeight);

	for(layerIndex in geneTracks) {
		var genes = geneTracks[layerIndex];
		
		var geneGroupLine = geneGroup.append('g').attr('id', dbType+'-gene-line'+layerIndex);

		for(geneIndexInEachLayer in genes) {
//			var geneRect= geneGroupLine.append('rect')
//			.attr('id', dbType+'-gene-rect'+layerIndex+'-data-'+geneIndexInEachLayer)
//			.attr('class', dbType+'-geneRect')
//			.attr('x', function(d){ return obj.xScale(parseInt(genes[geneIndexInEachLayer].txStart)) - diffOffset;})
//			.attr('y', yBase )
//			.attr('height', rectHeight)
//			.attr('width', function(d){ return obj.xScale(parseInt(genes[geneIndexInEachLayer].txEnd)) - obj.xScale(parseInt(genes[geneIndexInEachLayer].txStart) + 1);});

			var lineFunction = d3.svg.line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; });
//			.interpolate("linear");
			
			var startLine = [];
			var startPoint = obj.xScale(parseInt(genes[geneIndexInEachLayer].txStart));
			
			startLine = [{x:startPoint, y:yBase}, {x:startPoint, y:yBase+rectHeight}];
			
			geneGroupLine.append("path")
			.attr("class", "gene-startLine")
			.attr("d", lineFunction(startLine))
			.attr("stroke", "blue")
			.attr("stroke-width", 1);
			
			var endLine = [];
			var endPoint = obj.xScale(parseInt(genes[geneIndexInEachLayer].txEnd));
			
			endLine = [{x:endPoint, y:yBase}, {x:endPoint, y:yBase+rectHeight}];
			
			geneGroupLine.append("path")
			.attr("class", "gene-endLine")
			.attr("d", lineFunction(endLine))
			.attr("stroke", "blue")
			.attr("stroke-width", 1);
			
			var geneBody = [];
			var endPoint = obj.xScale(parseInt(genes[geneIndexInEachLayer].txEnd));
			
			geneBody = [{x:startPoint, y:yBase+rectHeight/2}, {x:endPoint, y:yBase+rectHeight/2}];
			
			geneGroupLine.append("path")
			.attr("class", "gene-geneBody")
			.attr("d", lineFunction(geneBody))
			.attr("stroke", "blue")
			.attr("stroke-width", 1);
			
			var standardLineLength = endPoint - startPoint;
			
			var k = parseInt(standardLineLength / 10);
			if(k == 0)	k = 1;
			
			for(var i=1; i<k+1; i++) {
				var points = [];
				
				var arrowPos = startPoint + (endPoint - startPoint)/(k+1) * i;

				var baseY = yBase+rectHeight/2;
				
				if( genes[geneIndexInEachLayer].strand == '+' ) {
//					var arrowPos = startPoint + (endPoint - startPoint)/(k) * i;
					
					points = [{x:arrowPos-3, y:baseY-3}, {x:arrowPos, y:baseY}, {x:arrowPos-3, y:baseY+3}];
				} else {
//					if(i==1){
//						var arrowPos = startPoint;
//					} else {
//						var arrowPos = startPoint - (endPoint - startPoint)/k + (endPoint - startPoint)/k * i;
//					}
					
					points = [{x:arrowPos+3, y:baseY-3}, {x:arrowPos, y:baseY}, {x:arrowPos+3, y:baseY+3}];
				}
	
				geneGroupLine.append("path")
				.attr("class", "gene-strand")
				.attr("d", lineFunction(points))
				.attr("fill", "none")
				.attr("stroke", "blue")
				.attr("stroke-width", 1);
			}
			
			if( drawingType === 'full' ) {
				geneGroupLine.append('text')
				.attr('id', dbType+'-gene-text'+layerIndex+'-data-'+geneIndexInEachLayer)
				.attr('class', dbType+'_geneText')
				.attr('text-anchor', 'end')
				.attr("baseline-shift", "-75%")
				.attr('font-size', '10px')
				.attr('x', function(d){ return obj.xScale(parseInt(genes[geneIndexInEachLayer].txStart)) - diffOffset -2;})
				.attr('y', yBase )
				.text(genes[geneIndexInEachLayer].name);
			}
		}

		if( drawingType === 'full' )		yBase += (rectHeight + marginBetweenLayers);
		else if( drawingType === 'dense' )	yBase = yBase;
	}

//	if( drawingType === 'full' )
//		return ( Object.keys(geneTracks).length * parseInt(rectHeight) ) + ((Object.keys(geneTracks).length-1) * marginBetweenLayers);
//	
//	return ( 1 * parseInt(rectHeight) );
	return ( Object.keys(geneTracks).length * parseInt(rectHeight) ) + ((Object.keys(geneTracks).length-1) * marginBetweenLayers);
};

HicHistogram4Comparison.prototype.geneSelect = function( data, drawingType ) {
	var obj = this;

	var geneSelect = "";
	geneSelect += "<div id='gene-select' class='gene-select'></div>";

	$("#graph-frame-gene").append( geneSelect );

	var select = "";
	select += "<select id='collapseType"+"' class='collapseType'>";
	select += "<option value='full' selected>full</option>";
	select += "<option value='dense'>dense</option>";
	select += "</select>";

	$("#gene-select").append($(select));

	$("#collapseType").change(function(){
		obj.gene(  data, $("#collapseType option:selected").val() );
	});

	obj.gene(  data, $("#collapseType option:selected").val() );
};

HicHistogram4Comparison.prototype.gene = function( data, drawingType ) {
	var obj = this;
	
	$("#geneCanvas").remove();
	
	var geneDiv = $("#graph-frame-gene");
	
//	var geneDivHeight = geneDiv.height();
	
	var graphDiv = $("#graph-frame-graph");
	var enhancerDiv = $("#graph-frame-enhancer");
	
    var geneCanvas = d3.select("#graph-frame-gene")
    .append("svg")
    .attr("id", "geneCanvas")
    .attr("y", graphDiv.height() + enhancerDiv.height())
    .style("width" , geneDiv.width())
//    .attr("viewBox","0 0 " + geneDiv.width() +" " + geneDiv.height() )
    .style("display", "block")
    .attr("viewBox","0 0 " + geneDiv.width() +" " + geneDiv.height() )
    ;

    var diffOffset = $("#peakBaseRect-1").attr("x");
    diffOffset = 0;

    var innerSvg = geneCanvas.append("svg")
    .attr("id", "geneDrawingCanvas")
    .attr("x", $("#peakBaseRect-1").attr("x"))
    .attr("y", 0)
//    .attr("width", $("#peakBaseRect-1").attr("width"))
//    .attr("height", geneDiv.height())
    .attr("width" , geneDiv.width())
//    .attr("height", geneDiv.height() )
    ;

	var geneGroup_topMargin = 10;
	var geneGroup_bottomMargin = 10;
	var prevGeneGroup_height = 15;

	var rectHeight = 10;

	var y = geneGroup_topMargin;
	var innerY = geneGroup_topMargin;
	
	var dbgroup = geneCanvas.append('g');
	
	var dbNameBackground = dbgroup.append('rect')
	.attr('class', 'svg-name-background')
	.attr('font-size', '15px')
	.attr('x', 38)
	.attr('y', 6)
	.attr('rx', 10)
	.attr('ry', 10)
	.attr('width', 65)
	.attr('height', 20)
	.style('fill', '#dc3545')
	;
	
	var dbName = dbgroup.append('text')
	.attr('class', 'svg-name')
	.attr('font-size', '15px')
	.attr('x', 50)
	.attr('y', y + rectHeight)
	;

	for( var dbTypeIndex=0; dbTypeIndex < Object.keys(data).length; dbTypeIndex++ ) {		
		dbName.text(Object.keys(data)[dbTypeIndex]);
		
		var height = this.drawGeneTracks( innerSvg, data, Object.keys(data)[dbTypeIndex], drawingType, y, rectHeight, diffOffset );

		if( dbTypeIndex == Object.keys(data).length-1 )		y += height;
		else												y += (height + prevGeneGroup_height);
	}
	
	var totalHeight = y + geneGroup_bottomMargin;
	var InnertotalHeight = innerY + geneGroup_bottomMargin;

	if(drawingType=='full') {
		geneCanvas.attr("viewBox","0 0 " + geneDiv.width() +" " + totalHeight );
		geneCanvas.attr("height", totalHeight );
		innerSvg.attr("viewBox", $("#peakBaseRect-1").attr("x") + " 0 " + geneDiv.width() +" " + totalHeight );
	} else {
		geneCanvas.attr("viewBox","0 0 " + geneDiv.width() +" " + InnertotalHeight );
		geneCanvas.attr("height", InnertotalHeight );
		innerSvg.attr("viewBox", $("#peakBaseRect-1").attr("x") + " 0 " + geneDiv.width() +" " + InnertotalHeight );
	}
};

HicHistogram4Comparison.prototype.enhancer = function(data){
	var enhancer_topMargin = 10;
	var enhancer_bottomMargin = 10;
	var rectHeight = 10;
	var y = enhancer_topMargin;
	
	var enhancerDiv = $("#graph-frame-enhancer");
	
	var graphDiv = $("#graph-frame-graph");
	
	var enhancerCanvas = d3.select("#graph-frame-enhancer")
	.append("svg")
	.attr("id", "enhancerCanvas")
	.attr("y", graphDiv.height())
	.style("width" , enhancerDiv.width())
	.style("height", rectHeight + 30)
	.style("display", "block");
	
	var innerSvg = enhancerCanvas.append("svg")
	.attr("id", "enhancerDrawingCanvas")
	.attr("x", $("#peakBaseRect-1").attr("x"));

	var dbgroup = enhancerCanvas.append('g');
	
	var dbNameBackground = dbgroup.append('rect')
	.attr('class', 'svg-name-background')
	.attr('font-size', '15px')
	.attr('x', 18)
	.attr('y', 6)
	.attr('rx', 10)
	.attr('ry', 10)
	.attr('width', 117)
	.attr('height', 20)
	.style('fill', '#28a745')
	;
	
	var dbName = dbgroup.append('text')
	.attr('class', 'svg-name')
	.attr('font-size', '15px')
	.attr('x', 30)
	.attr('y', y + rectHeight)
	;
	
	dbName.text("Super-enhancer");

	if(data){
		if(data.length == 0){
			enhancerCanvas.append("text")
			.text("There are no super-enhancers in this area.")
			.attr('class', 'unit-label')
			.attr("x", 450)
			.attr("y", 25)
			.style("font-size", "9pt");
			return;
		}
	
		for(var i=0; i<data.length; i++)
			this.drawEnhancerTracks(innerSvg, data, rectHeight, i);
	} else {
		enhancerCanvas.append("text")
		.text("There are no super-enhancers in this area.")
		.attr('class', 'unit-label')
		.attr("x", 450)
		.attr("y", 25)
		.style("font-size", "9pt");
	}
//	var viewBoxHeight = $("#enhancerCanvas").height()-(rectHeight + 30);
//	var totalHeight = y + enhancer_bottomMargin;
//	innerSvg.attr("viewBox", $("#peakBaseRect-1").attr("x") + " 0 " + enhancerDiv.width() +" " + (totalHeight+viewBoxHeight) );
};

HicHistogram4Comparison.prototype.drawEnhancerTracks = function( enhancerCanvas, data, rectHeight, i) {
	var obj = this;

	enhancerCanvas.append('rect')
				.attr('class', 'enhancer-Rect')
				.attr('x', obj.xScale(parseInt(data[i].start)))
				.attr('y', '0')
				.attr('height', rectHeight)
				.attr('width', function(d){ return obj.xScale(parseInt(data[i].end)) - obj.xScale(parseInt(data[i].start) + 1);});
	
	enhancerCanvas.append('text')
				.attr('id','text-'+i)
				.attr('text-anchor', 'end')
				.attr("baseline-shift", "-75%")
				.attr('font-size', '10px')
				.attr('x', obj.xScale(parseInt(data[i].start))+50)
				.attr('y', '12' )
				.text(data[i].id);

	if(i > 0){
		var pre_id = 'text-'+(i-1); 
		var id= 'text-'+i; 
		
		var pre = $("#"+pre_id);
		var cur = $("#"+id);

		var overlap = !( pre.attr('x') < (cur.attr('x')- cur.width()) );
		
		if(overlap){

			cur.attr('y',(parseInt(pre.attr('y'))+parseInt(13)));
			
			$("#enhancerCanvas").css('height', $("#enhancerCanvas").height() + 12);
		}
	}

};

function selectType4Comparison( type, obj ){
	if(type == "SVG"){
		saveAsSvg4Comparison( obj );
	}else if(type == "PNG"){
		saveAsPng4Comparison ( obj );
	}
}

function saveAsSvg4Comparison ( obj ){
	comparison_heatmap_svg( obj.config.rawData.diffHeatMap, 1 );
	
	var serializer = new XMLSerializer();
	
	var svgString = serializer.serializeToString(d3.select("svg#heatmap_svg_1").node());

	var oParser = new DOMParser();
	var heatmapClone = d3.select(oParser.parseFromString(svgString, "text/xml").childNodes[0])

//	heatmapClone.style("margin","150px 0px -250px 260px");	
	
	var svgCanvasString = getSVGString( d3.select("svg#canvas").node() );
	var svgHeatmapString = getSVGString( heatmapClone.node() );
	var svgEnhancerString = getSVGString( d3.select("svg#enhancerCanvas").node() );
	var svgGeneString = getSVGString( d3.select("svg#geneCanvas").node() );

	var aa = "<svg>"+svgHeatmapString+""+svgCanvasString+""+svgEnhancerString+""+svgGeneString+"</svg>";
	
	downloadSVG( aa );
	
	$("#graph-frame-heatmapSVG").remove();
}

function saveAsPng4Comparison ( obj ){
	/** Save as PNG process **/
	
	comparison_heatmap_svg( obj.config.rawData.diffHeatMap, 1 );
	
	var svgHeatmapTadFrameString = getSVGString( d3.select("svg#heatmap_svg_1").node() );
	var svgCanvasString = getSVGString( d3.select("svg#canvas").node() );
	var svgEnhancerString = getSVGString( d3.select("svg#enhancerCanvas").node() );
	var svgGeneString = getSVGString( d3.select("svg#geneCanvas").node() );
	
	var svgCAEGHeight = $("svg#canvas").height();
	
	var svgEGHeight = $("svg#enhancerCanvas").height() + $("svg#geneCanvas").height();
	
	var heatmap_marginLeft = svgCAEGHeight - 0.37 * svgEGHeight;
	
	var svgHeight = 
		$("svg#heatmap_svg_1").height()
		+ $("svg#canvas").height()
		+ $("svg#enhancerCanvas").height() + $("svg#geneCanvas").height();
		
	var svgWidth = $("svg#canvas").width();
	
	var svgHeatMapString = 
	"<svg style=\"display: block; background-color: white; margin-left:"+ d3.select("#peakBaseRect-1" ).attr("x") +"px;\"  xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\""+ svgWidth +"\" height=\""+ svgHeight +"\">"
	+ svgHeatmapTadFrameString
	+ "</svg>";
	
	var svgString = 
	"<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block; background-color: white;\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\""+ svgWidth +"\" height=\""+ svgHeight +"\">"
	+ svgCanvasString
	+ "" + svgEnhancerString + "" + svgGeneString
	+ "</svg>";
		
	svgString2Image( svgHeatMapString, svgString, svgWidth, svgHeight, 'png', save, $("svg#heatmap_svg_1").height(), 10  ); // passes Blob and filesize String to the callback
	
	function save( dataBlob, filesize ){
		saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
	}
	
	$("#graph-frame-heatmapSVG").remove();
}