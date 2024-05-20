function savePcHicCanvasToSvg( obj, pWidth, pHeight ) {
	if( $('#preloader2').length == 0 ) {
		$('#footer').after('<div id="preloader2"></div>');
	}

	d3.select("body").append( "svg" ).attr("id", 'SvgExportViewerCanvas').attr('viewBox', [0, 0, pWidth, pHeight]).style("background-color", "white");

	var canvas = d3.select("#SvgExportViewerCanvas");
	
	defs = canvas.append("defs");
	defs.append("marker")
	.attr("id", "arrow")
	.attr("viewBox", "0 -5 10 10")
	.attr("refX", 5)
	.attr("refY", 0)
	.attr("markerWidth", 6)
	.attr("markerHeight", 6)
	.attr("orient", "auto")
	.append("path")
	.attr("d", "M0,-5L10,0L0,5")
	.attr("class", "arrowHead");
	
	var lineFunction = d3.line()
	.x(function(d) { return d.x; })
	.y(function(d) { return d.y; })
	;

	var yPos = 0;

	for( var i=0; i<obj.tracks.length; i++) {
		var nObj = obj.tracks[i];

		nObj.xScale = d3.scaleLinear()
		.domain([ parseInt(nObj.config.data.currentStart), parseInt(nObj.config.data.currentEnd)])
		.range([nObj.config.X_MARGIN, pWidth - nObj.config.X_MARGIN]);

		if( obj.tracks[i].config.type === 'header' ) {
			var x = nObj.xScale(nObj.config.data.currentStart);
			var y = nObj.config.MARGIN;
			
			yPos = y;

			var height = nObj.config.RANGE_BAR_HEIGHT;
			var width = nObj.xScale(nObj.config.data.currentEnd) - nObj.xScale(nObj.config.data.currentStart);

			nObj['range'] = {id:0, x:x, y:y, width:width, height:height};
			
			var gRuller = canvas.append("g").attr("class", "ruller");
			
			var label = "(" + nObj.config.data.chrom + " : " + comma(nObj.config.data.currentStart) + " - " + comma(nObj.config.data.currentEnd) + ")";

			var textLabelWidth = textSize(label).width;

			gRuller.append("text")
			.attr("x", x + width/2)
			.attr("y", y + height/2 )
			.attr("baseline-shift", "-24%")
			.attr("text-anchor", "middle")
			.attr("fill", "gray")
			.style("font", "12px Arial")
			.text( label );
			
			
			gRuller.append("line")
			.attr("marker-end", "url(#arrow)")
			.attr("x1", (x + (width/2) - ((textLabelWidth/2) + 20)))
			.attr("y1", height/2)
			.attr("x2", x + 5)
			.attr("y2", height/2)
			.style('stroke', 'gray')
			.style('stroke-width', 1)
			;

			gRuller.append("line")
			.attr("marker-end", "url(#arrow)")
			.attr("x1", x + (width/2) + ((textLabelWidth/2) + 20))
			.attr("y1", height/2)
			.attr("x2", x + width - 5 )
			.attr("y2", height/2)
			.style('stroke', 'gray')
			.style('stroke-width', 1)
			;
			

			
			var UNIT_LEN = 7;

			var w = obj.tracks[i]['range'].width;
			if( w >= 1600 ) 					UNIT_LEN = 12;
			else if( w < 1600 && w >= 1280 )	UNIT_LEN = 10;
			else if( w < 1280 && w >= 860 )		UNIT_LEN = 7;
			else if( w < 860 && w > 500 )		UNIT_LEN = 5;
			else								UNIT_LEN = 4;

			var diff = (nObj.config.data.end - nObj.config.data.start) / UNIT_LEN;

			var baseY = nObj.tracks['range'].y + nObj.tracks['range'].height;
			var height = nObj.config.GENOMIC_RULER_HEIGHT;

			obj.tracks[i].tracks['ruler'] = {id:1, x:nObj.xScale(nObj.config.data.currentStart), y:baseY, width:nObj.tracks['range'].width, height:height};
			
			gRuller.append("rect")
			.attr("x", nObj.tracks['ruler'].x)
			.attr('y', nObj.tracks['ruler'].y)
			.attr('width', nObj.tracks['ruler'].width)
			.attr('height', nObj.tracks['ruler'].height)
			.style('fill', 'rgb(255, 255, 255)')
			;
			
			
			var txtBaitLabel = (nObj.config.data.bait / 1000000).toFixed(1) +"MB";
			if( nObj.config.data.bait < 1000000 ) txtBaitLabel = (nObj.config.data.bait / 1000).toFixed(1) +"KB";

			var baitXpos = nObj.xScale( nObj.config.data.bait );

			var y1 = baseY + height - 10;
			var y2 = baseY + height;
			
			gRuller.append("text")
			.attr("x", baitXpos)
			.attr("y", y1 - 10 )
			.attr("baseline-shift", "-24%")
			.attr("text-anchor", "middle")
			.attr("fill", "gray")
			.style("font", "12px Arial")
			.text( txtBaitLabel );
			
			gRuller.append("line")
			.attr("x1", baitXpos)
			.attr("y1", y1)
			.attr("x2", baitXpos)
			.attr("y2", y2)
			.style('stroke', 'gray')
			;

			for( var j=1; j<UNIT_LEN; j++) {
				var x1GenomicPos = parseInt( (j * diff) + nObj.config.data.bait );
				var x2GenomicPos = parseInt( nObj.config.data.bait - (j * diff) );

				var x1 = nObj.xScale( x1GenomicPos );
				var x2 = nObj.xScale( x2GenomicPos );

				if( x1 <= nObj.xScale(nObj.config.data.currentEnd) ) {
					gRuller.append("line")
					.attr("x1", x1)
					.attr("y1", y1)
					.attr("x2", x1)
					.attr("y2", y2)
					.style('stroke', 'gray')
					;

					var txtLabel = (x1GenomicPos / 1000000).toFixed(1) +"MB";
					if( x1GenomicPos < 1000000 ) txtLabel = (x1GenomicPos / 1000).toFixed(1) +"KB";

					gRuller.append("text")
					.attr("x", x1)
					.attr("y", y1 - 10 )
					.attr("baseline-shift", "-24%")
					.attr("text-anchor", "middle")
					.attr("fill", "gray")
					.style("font", "12px Arial")
					.text( txtLabel );
				}
				
				if( x2 >= nObj.xScale(nObj.config.data.currentStart) ) {
					gRuller.append("line")
					.attr("x1", x2)
					.attr("y1", y1)
					.attr("x2", x2)
					.attr("y2", y2)
					.style('stroke', 'gray')
					;

					var txtLabel = (x2GenomicPos / 1000000).toFixed(1) +"MB";
					if( x2GenomicPos < 1000000 ) txtLabel = (x2GenomicPos / 1000).toFixed(1) +"KB";
					
					gRuller.append("text")
					.attr("x", x2)
					.attr("y", y1 - 10 )
					.attr("baseline-shift", "-24%")
					.attr("text-anchor", "middle")
					.attr("fill", "gray")
					.style("font", "12px Arial")
					.text( txtLabel );
				}
			}
			
			yPos = y2;
		}else if( nObj.config.type === 'data' ) {
			var x = nObj.xScale( nObj.config.data.currentStart );
			var y = yPos;
			var width = (nObj.xScale(nObj.config.data.currentEnd) - nObj.xScale(nObj.config.data.currentStart));
			var height = nObj.config.INTERACTION_PEAK_CURVE_HEIGHT + nObj.config.INTERACTION_ARC_CURVE_HEIGHT;

			var gTrack = canvas.append("g").attr("class", "track-" + i);
			
			gTrack.append("text")
			.attr("x", nObj.config.X_MARGIN-5)
			.attr("y", y + nObj.config.INTERACTION_PEAK_CURVE_HEIGHT )
			.attr("baseline-shift", "-24%")
			.attr("text-anchor", "end")
			.attr("fill", "gray")
			.style("font", "12px Arial")
			.text( nObj.config.title );

			
			var d2 = nObj.config.data.data;
			var maxVal = d3.max( d2.map(function(d){return d.all_capture_res;}) );
			var minVal = d3.min( d2.map(function(d){return d.all_capture_res;}) );
			
			var maxRawVal = d3.max( d2.map(function(d){return d.freq;}) );
			var minRawVal = d3.min( d2.map(function(d){return d.freq;}) );
			
			var maxDotVal = d3.max( d2.map(function(d){return d.dist_res;}) );
			var minDotVal = d3.min( d2.map(function(d){return d.dist_res;}) );
			
			var yScale = d3.scaleLinear()
		    .domain([minVal<0?minVal:0, maxVal])
		    .range([ y + nObj.config.INTERACTION_PEAK_CURVE_HEIGHT, y + 10 ]);
			
			var yScaleRaw = d3.scaleLinear()
		    .domain([minRawVal<0?minRawVal:0, maxRawVal])
		    .range([ y + nObj.config.INTERACTION_PEAK_CURVE_HEIGHT, y + 10 ]);

			var yScaleDot = d3.scaleLinear()
		    .domain([minDotVal<0?minDotVal:0, maxDotVal])
		    .range([ y + nObj.config.INTERACTION_PEAK_CURVE_HEIGHT, y + 10 ]);

			var zero = 0;

			var nY1 = yScale(0);
			var nY2 = yScale(maxVal);
			var nLabel = maxVal.toFixed(1);

			if( nObj.config.barDataType == "raw" ) {
				nY1 = yScaleRaw(0);
				nY2 = yScaleRaw(maxRawVal)
				nLabel = maxRawVal.toFixed(1);
			}
			
			var rangeBarPoints = [
			                      	{x:nObj.xScale(nObj.config.data.currentEnd) + 15, y:nY1}
			                      	, {x:nObj.xScale(nObj.config.data.currentEnd) + 10, y:nY1}
			                      	, {x:nObj.xScale(nObj.config.data.currentEnd) + 10, y:nY1}
			                      	, {x:nObj.xScale(nObj.config.data.currentEnd) + 10, y:nY2}
			                      	, {x:nObj.xScale(nObj.config.data.currentEnd) + 15, y:nY2}
			                      ];

			gTrack.append("path")
			.attr('class', 'line')
			.attr('d', lineFunction(rangeBarPoints))
			.style('stroke', 'gray')
			.style('stroke-width', 1)
			.style('fill', "none")
			;

			gTrack.append("text")
			.attr("x", nObj.xScale(nObj.config.data.currentEnd) + 17)
			.attr("y", nY1 )
			.attr("baseline-shift", "-24%")
			.attr("text-anchor", "start")
			.attr("fill", "gray")
			.style("font", "12px Arial")
			.text( zero.toFixed(1) );
			
			gTrack.append("text")
			.attr("x", nObj.xScale(nObj.config.data.currentEnd) + 17)
			.attr("y", nY2 )
			.attr("baseline-shift", "-24%")
			.attr("text-anchor", "start")
			.attr("fill", "gray")
			.style("font", "12px Arial")
			.text( nLabel );
			
			
			var lBound = nObj.xScale( nObj.config.data.currentStart );
			var rBound = nObj.xScale( nObj.config.data.currentEnd );
			
			for(var j=0; j<d2.length; j++) {
				var nX1 = nObj.xScale( d2[j].bin2_s );
				var nX2 = nObj.xScale( d2[j].bin2_e );

				// To fit in view rectangle
				if( nX1 - lBound < 0 ) nX1 = lBound;
				if( nX2 - lBound < 0 ) continue;
				
				if( rBound - nX1 < 0 ) continue;
				if( rBound - nX2 < 0 ) nX2 = rBound;

				var nY1 = yScale( d2[j].all_capture_res );
				var nY2 = yScale( 0 );

				if( nObj.config.barDataType == "raw" ) {
					nY1 = yScaleRaw( d2[j].freq );
					nY2 = yScaleRaw( 0 );
				}
				
				var barPoints = [
					{x:nX1, y:nY1}
					, {x:nX1, y:nY2}
					, {x:nX2, y:nY2}
					, {x:nX2, y:nY1}
				];
				
				gTrack.append("path")
				.attr('class', 'line')
				.attr('d', lineFunction(barPoints))
				.style('stroke', 'rgb(0, 0, 0)')
				.style('stroke-width', 1)
				.style('fill', "rgb(10, 10, 10)")
				;
				
				var xEllipse = nX1 + ((nX2-nX1)/2);
				var yEllipse = yScaleDot( d2[j].dist_res );

				gTrack.append("path")
				.attr("class", "circle")
				.attr("d", convertSvgCircleToPath( xEllipse, yEllipse, 1.5, 0))
				.style('fill', "rgb(255, 0, 124)")
				;
			}
			gRuller.append("line")
			.attr("x1", x)
			.attr("y1", y + nObj.config.INTERACTION_PEAK_CURVE_HEIGHT)
			.attr("x2", x + width)
			.attr("y2", y + nObj.config.INTERACTION_PEAK_CURVE_HEIGHT)
			.style('stroke', 'rgb(18, 18, 18)')
			;


			// Proc promoters
			{	
				var x1 = nObj.xScale( nObj.config.data.promoter_start );
				var x2 = nObj.xScale( nObj.config.data.promoter_end );
				var y1 = yPos;
				var y2 = y1 + nObj.config.INTERACTION_PEAK_CURVE_HEIGHT + nObj.config.INTERACTION_ARC_CURVE_HEIGHT;
				
				
				var lBound = nObj.xScale( nObj.config.data.currentStart );
				var rBound = nObj.xScale( nObj.config.data.currentEnd );
	
				if( x1 - lBound < 0 ) x1 = lBound;
				if( x2 - lBound < 0 ) return;
				if( rBound - x1 < 0 ) return;
				if( rBound - x2 < 0 ) x2 = rBound;
				
				
				var promoterPoints = [{x:x1, y:y1}, {x:x1, y:y2}, {x:x2, y:y2}, {x:x2, y:y1}];
				
				gTrack.append("path")
				.attr('class', 'line')
				.attr('d', lineFunction(promoterPoints))
				.style('stroke', 'gray')
				.style('stroke-width', 0)
				.style('fill', "rgb(105, 141, 209)")
				.style('opacity', 0.6)
				;
			}

			{
				var d2 = nObj.config.data.data;
				
				var y = yPos + nObj.config.INTERACTION_PEAK_CURVE_HEIGHT;

				var lBound = nObj.xScale( nObj.config.data.currentStart );
				var rBound = nObj.xScale( nObj.config.data.currentEnd );

				var srcX1 = nObj.xScale( nObj.config.data.bait );

				for(var j=0; j<d2.length; j++) {
					if( nObj.config.isDisplayPoInteraction != true ){
						if( d2[j].promoter_yn != 1 )	{
							continue;
						}
					}

					if( d2[j].pvalue < nObj.config.data.cutoff ) continue;

					var tarX1 = nObj.xScale( d2[j].bin2_s );
					var tarX2 = nObj.xScale( d2[j].bin2_e );
					
					var drawObj = nObj.getArcType( srcX1, tarX1, tarX2, lBound, rBound );

					if( drawObj != undefined && drawObj.canDraw == true ) {
						var arcGap = Math.abs( drawObj.x1 - drawObj.x2 );
						var OFFSET = Math.log2( arcGap );
				
						var alpha = OFFSET / Math.log2(rBound - lBound);
				
						var curvePoint = drawObj.x1 - ((arcGap/3) * (1-alpha));
						if( drawObj.arcType == 'rightArc' ) curvePoint = drawObj.x1 + ((arcGap/3) * (1-alpha));
						
						gTrack.append('path')
						.attr('class', 'arcBar')
						.attr('d', function(){
							var txt = 'M' + x1+ ' '+y+' Q' + curvePoint + ' ' + (y + ((nObj.config.INTERACTION_ARC_CURVE_HEIGHT * 1.5) * alpha)) +' ' + drawObj.x2 + ' ' + y;
							return txt;
						})
						.style('stroke', function(d){
							if( d2[j].promoter_yn == 1 )
								return 'rgb(186, 28, 147)';
							return 'rgb(186, 186, 186)';
						})
						.style('stroke-width', 1)
						.style("fill", "none")
						;
						
						// To fit in view rectangle
						if( tarX1 - lBound < 0 ) tarX1 = lBound;
						if( tarX2 - lBound < 0 ) continue;
						
						if( rBound - tarX1 < 0 ) continue;
						if( rBound - tarX2 < 0 ) tarX2 = rBound;

						gTrack.append("rect")
						.attr("x", tarX1)
						.attr("y", y)
						.attr("width", tarX2 - tarX1)
						.attr("height", 10)
						.style("fill", "rgb(255, 152, 84)")
						;
					}
				}
			}
			
			yPos += height;
		}else {
			if (nObj.canvas.getContext && nObj.config.data.genes != undefined ) {
				var gGeneTrack = canvas.append("g").attr("class", "gene-track");

				var layerMap = computeGeneStructures( nObj );

				var height = (nObj.config.GENE_TRACK_HEIGHT * Object.keys(layerMap).length) + 24 + 10;

				var y = yPos;

				var lBound = nObj.xScale( nObj.config.data.currentStart );
				var rBound = nObj.xScale( nObj.config.data.currentEnd );
				
				var layers = Object.keys(layerMap);
				
				for( var j=0; j<layers.length; j++) {
					var geneDrawObjs = layerMap[ layers[j] ];

					var yLocalPos = y + (parseInt(layers[j]) * nObj.config.GENE_TRACK_HEIGHT);

					for( var k=0; k<geneDrawObjs.length; k++) {
						var x1 = geneDrawObjs[k].x1;
						var x2 = geneDrawObjs[k].x2;
						
						// To fit in view rectangle
						if( x1 - lBound < 0 ) x1 = lBound;
						if( x2 - lBound < 0 ) continue;

						if( rBound - x1 < 0 ) continue;
						if( rBound - x2 < 0 ) x2 = rBound;
						
						
						gGeneTrack.append("line")
						.attr("x1", x1)
						.attr("y1", yLocalPos)
						.attr("x2", x2)
						.attr("y2", yLocalPos)
						.style('stroke', 'green')
						.style('stroke-width', 1);

						var cdsStart = geneDrawObjs[k].cdsStart;
						var cdsEnd = geneDrawObjs[k].cdsEnd;
						if( cdsStart < x1 )	cdsStart = x1;
						if( cdsStart > x2 )	cdsStart = x2;
						if( cdsEnd > x2 )	cdsEnd = x2;
						if( cdsStart < x1 )	cdsEnd = x1;
						
						
						var genePoints = [
						                  {x:cdsStart, y:yLocalPos-2},
						                  {x:cdsEnd, y:yLocalPos-2},
						                  {x:cdsEnd, y:yLocalPos+2},
						                  {x:cdsStart, y:yLocalPos+2}
						                  ];
						
						gGeneTrack.append("path")
						.attr("class", "path")
						.attr("d", lineFunction(genePoints))
						.style("fill", "rgb(173, 125, 21)")
						.style('stroke-width', 0)
						.style('opacity', 0.7)
						;

						
						gGeneTrack.append("line")
						.attr("x1", x1)
						.attr("y1", yLocalPos-5)
						.attr("x2", x1)
						.attr("y2", yLocalPos+5)
						.style('stroke', 'black')
						.style('stroke-width', 1);
					
						
						gGeneTrack.append("line")
						.attr("x1", x2)
						.attr("y1", yLocalPos-5)
						.attr("x2", x2)
						.attr("y2", yLocalPos+5)
						.style('stroke', 'black')
						.style('stroke-width', 1);

						gTrack.append("text")
						.attr("x", geneDrawObjs[k].label_x1)
						.attr("y", yLocalPos )
						.attr("baseline-shift", "-24%")
						.attr("text-anchor", "start")
						.attr("fill", "gray")
						.style("font", "12px Arial")
						.text( geneDrawObjs[k].label );
						
						
						
						
						var directionArrowInterval = parseInt((x2-x1) / 10);
						if(directionArrowInterval == 0)	directionArrowInterval = 1;
						
						for(var mx=(x1 + directionArrowInterval); mx<=x2; mx+=directionArrowInterval) {
							var dirPoints = [];
							if( geneDrawObjs[k].strand == '+' ) {
								dirPoints.push({x:mx-5, y:yLocalPos-3});
								dirPoints.push({x:mx, y:yLocalPos});
								dirPoints.push({x:mx-5, y:yLocalPos+3});
							}else {
								dirPoints.push({x:mx+5, y:yLocalPos-3});
								dirPoints.push({x:mx, y:yLocalPos});
								dirPoints.push({x:mx+5, y:yLocalPos+3});
							}
							
							gGeneTrack.append("path")
							.attr("class", "path")
							.attr("d", lineFunction(dirPoints))
							.style("stroke", "green")
							.style('stroke-width', 1)
							.style("fill", "none")
							;
						}
					}
				}
				
				yPos += height;
			}
		}
	}
	
	canvas.attr('viewBox', [0, 0, pWidth, yPos ]);
	
	var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(canvas.node());
	
    downloadSVG( xmlString, "pcHic.svg" );

    canvas.remove();

	if ($('#preloader2').length) {
		$('#preloader2').fadeOut('slow', function() {
			$(this).remove();
		});
	}
}

function computeGeneStructures( nObj ){
	var ctx = nObj.canvas.getContext('2d');
	var layerMap = {};
	if( nObj.config.data.genes != undefined ) {
		var x = nObj.xScale( nObj.config.data.currentStart );
		var y = nObj.config.MARGIN;
		var width = (nObj.xScale(nObj.config.data.currentEnd) - nObj.xScale(nObj.config.data.currentStart));

		for( var i=0; i<nObj.config.data.genes.length; i++) {
			var gene = nObj.config.data.genes[i];

			var geneLeftX1 = -1;
			var geneRightX2 = -1;
			if( gene.exons !== undefined && gene.exons !== null && gene.exons.length > 0 ) {
				geneLeftX1 = nObj.xScale( d3.min( gene.exons, d => d.start ) );
				geneRightX2 = nObj.xScale( d3.max( gene.exons, d => d.end ) );
			}
			
			if( geneLeftX1 < nObj.xScale(nObj.config.data.currentStart) )	geneLeftX1 = nObj.xScale(nObj.config.data.currentStart);
			if( geneRightX2 > nObj.xScale(nObj.config.data.currentEnd) )	geneRightX2 = nObj.xScale(nObj.config.data.currentEnd);

//			var textLabelWidth = textSize( gene.name ).width;
			var textLabelWidth = ctx.measureText( gene.name ).width;

			var geneDrawObj = {
					label:gene.name
					, x1:geneLeftX1
					, x2:geneRightX2
					, label_x1:(geneRightX2 + nObj.config.GENE_LABEL_MARGIN)
					, label_x2:(geneRightX2 + textLabelWidth + nObj.config.GENE_LABEL_MARGIN + 20)
					, exons:gene.exons
					, strand:gene.strand
					, cdsStart:nObj.xScale(gene.cdsStart)
					, cdsEnd:nObj.xScale(gene.cdsEnd)
			};

			if( Object.keys(layerMap).length == 0 ) {
				geneDrawObj.layer = 0;
				
				var arr = [];
				arr.push( geneDrawObj );
				layerMap = {'0':[geneDrawObj]};
			}else {
				var layers = Object.keys(layerMap);

				var isOverlapped = false;
				for( var j=0; j<layers.length; j++ ) {
					var layer = parseInt(layers[j]);
					var array = layerMap[ layer ];

					isOverlapped = false;
					for( var k=0; k<array.length; k++) {
						var sum = (array[k].label_x2 - array[k].x1) + (geneDrawObj.label_x2 - geneDrawObj.x1);
						var min = Math.min( Math.min( array[k].x1, array[k].label_x2 ), Math.min( geneDrawObj.x1, geneDrawObj.label_x2 ) );
						var max = Math.max( Math.max( array[k].x1, array[k].label_x2 ), Math.max( geneDrawObj.x1, geneDrawObj.label_x2 ) );
						var diff = max - min;

						if( diff < sum ) {
							isOverlapped = true;
							break;
						}
					}
					
					if( isOverlapped == false ) {
						geneDrawObj.layer = layer;
						layerMap[layer].push( geneDrawObj );

						break;
					}
				}
				if( isOverlapped == true ) {
					var nLayer = parseInt(d3.max( Object.keys(layerMap) )) + 1;
					geneDrawObj.layer = nLayer;
					layerMap[nLayer] = [geneDrawObj];
				}
			}
		}
	}

	return layerMap;
}

function saveCanvsToSvg( tabId, map, controller, name, width, height, type ) {
	if( $('#preloader2').length == 0 ) {
		$('#footer').after('<div id="preloader2"></div>');
	}

	var LABEL_WIDTH = 0;
	var MARGIN = 10;
	
	var lineFunction = d3.line()
	.x(function(d) { return d.x; })
	.y(function(d) { return d.y; })
	;
	
	var contactMap = null;
	var svInfo = controller.viewer;
	
	var currentViewer = controller.viewer;
	if( tabId === 'predefined' ) {
		if( map === "normal" )		{
			contactMap = controller.normalDataViewer.config;
			currentViewer = controller.normalDataViewer;
		}else if( map === 'tumor'){
			contactMap = controller.originDataViewer.config;
			currentViewer = controller.originDataViewer;
		}else{
			svInfo.bin2 = svInfo.bin1;

			contactMap = controller.viewer.config;
		}
	}else if( tabId !== 'predefined' ) {
		if( map === "raw" ){
			contactMap = controller.originDataViewer.config;
			currentViewer = controller.originDataViewer;
		}else{
			contactMap = controller.viewer.config;
		}
	}
	
	height = $(currentViewer.canvas).parent().parent().parent().height();
	width = 800;

	d3.select("body").append( "svg" ).attr("id", 'SvgExportViewerCanvas').attr('viewBox', [0, 0, width, height]).style("background-color", "none");

	var canvas = d3.select("#SvgExportViewerCanvas");

	defs = canvas.append("defs");
	defs.append("marker")
	.attr("id", "vbar")
	.attr("viewBox", "0 -5 1 10")
	.attr("refX", 0)
	.attr("refY", 0)
	.attr("markerWidth", 1)
	.attr("markerHeight", 10)
	.attr("orient", "auto")
	.append("path")
	.style("stroke", "rgb(0, 0, 0)")
	.attr("d", "M0,-5L1,-5L1,10L0,10")
	.attr("class", "barEnd");
	
	defs = canvas.append("defs");
	defs.append("marker")
	.attr("id", "se_vbar")
	.attr("viewBox", "0 -5 1 10")
	.attr("refX", 0)
	.attr("refY", 0)
	.attr("markerWidth", 1)
	.attr("markerHeight", 10)
	.attr("orient", "auto")
	.append("path")
	.style("stroke", "rgb(106, 168, 62)")
	.attr("d", "M0,-5L1,-5L1,10L0,10")
	.attr("class", "barEnd");
	
	defs = canvas.append("defs");
	defs.append("marker")
	.attr("id", "arrow")
	.attr("viewBox", "0 -5 10 10")
	.attr("refX", 5)
	.attr("refY", 0)
	.attr("markerWidth", 6)
	.attr("markerHeight", 6)
	.attr("orient", "auto")
	.append("path")
	.attr("d", "M0,-5L10,0L0,5")
	.attr("class", "arrowHead");
	
	

	var samples = Object.keys(contactMap.data);
	
	
	
	var unitHeight = 1;
	
	var val = unitHeight * parseInt(contactMap.resolution);
	

	var strVal = "";
	if( val / 1000000 > 1 ) 		strVal = parseInt(Math.ceil(val / 1000000)) + "Mb";
	else if( val / 1000 > 1 ) 		strVal = parseInt(Math.ceil(val / 1000)) + "Kb";
	else							strVal = val + "b";
	
	var resBox = {x:width - 60, y:40, width:10, height:10, text:strVal};

	var resolutionGrp = canvas.append("g").attr("class", "heatmap-resolution");
	
	resolutionGrp.selectAll("rect")
	.data( [resBox] )
	.enter()
	.append("rect")
	.attr("x", function(d, i){
		return d.x;
	})
	.attr("y", function(d, i){
		return d.y;
	})
	.attr("width", function(d, i){
		return d.width;
	})
	.attr("height", function(d, i){
		return d.height;
	})
	.style('fill', function(d, i){
		return "rgb(255, 0, 0)";
	})
	.style('fill-opacity', 0.4);
	
	
	resolutionGrp.selectAll("text")
	.data( [resBox] )
	.enter()
	.append("text")
	.text(function(d, i){
		return d.text;
	})
	.attr("x", function(d, i){
		return d.x;
	})
	.attr("y", function(d, i){
		return d.y - 10;
	})
	.attr("alignment-baseline", "ideographic")
	.attr("text-anchor", "middle")
	.attr("fill", "gray")
	.style("font", "12px Arial")
	.style('fill-opacity', 1);
	

	for(var i=0; i<samples.length; i++) {
		var sampleData = contactMap.data[ samples[i] ].data;

		var scale = d3.scaleLinear()
		.domain([0, contactMap.data[ samples[i] ].nRow ])
		.range( [0, (width-LABEL_WIDTH) /Math.sqrt(2)] );
		
		var scaleCoord = d3.scaleLinear()
		.domain([0, contactMap.data[ samples[i] ].nRow ])
		.range( [0, (width-LABEL_WIDTH)] );

		var gContactMap = canvas.append("g").attr("class", "heatmap");
		
		var triangleMap = gContactMap.append("g").attr("class", "triangle");
		
		var thres = 400;
		var thres2 = 20;

		var middleThres = thres * ( currentViewer.colorScaleValues[1] / 100 );
		var minThres = thres * ( currentViewer.colorScaleValues[0] / 100 );
		var maxThres = thres * ( currentViewer.colorScaleValues[2] / 100 );
		
		if( contactMap.colorPalette == "WtoR" ){
			maxValue =  contactMap.data[ samples[i] ].maxValue * ( currentViewer.colorScaleValues[1] / 100 );
			minThres = thres * ( currentViewer.colorScaleValues[0] / 100 );
		}

		triangleMap.selectAll("rect")
		.data( sampleData )
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return LABEL_WIDTH + scale(d.iRow);
		})
		.attr("y", function(d, i){
			return scale(d.iCol);
		})
		.attr("width", function(d, i){
			return scale(2) - scale(1);
		})
		.attr("height", function(d, i){
			return scale(2) - scale(1);
		})
		.style('fill', function(d, i){
			var cv = d.intensity;
			if( contactMap.colorPalette == "WtoR" ){
				var nvl = (d.intensity/parseFloat(maxValue) * thres );
				if( nvl > thres2 )		cv = 0;
				else					cv = 255 - (nvl/thres2 * 255);
				
				if( currentViewer.colorScaleValues ){
					if( d.intensity < minThres )
						return 'rgb(255,255,255)';
				}
				return 'rgb(255, '+cv+', '+cv+')';
			}else {
				var cv = d.intensity;

				if( d.intensity < minThres ) return 'rgb(50, 50, 150)';
				else if( d.intensity >= minThres && d.intensity <= middleThres ){
					var blue = 150 * (d.intensity / (middleThres - minThres));
					var cv = 205 * (d.intensity / (middleThres - minThres)) + 50;
					return 'rgb(' + cv + ', ' + cv + ', ' + (150 - blue) +')';
				}else if( d.intensity > middleThres && d.intensity <= maxThres ){
					var cv = 255 * ( (d.intensity - middleThres) / (middleThres - minThres));
					return 'rgb(255, ' + (255 - cv) + ', 0)';
				}else if( d.intensity > maxThres ){
					return 'rgb(255,0,0)';
				}
			}
		});

		gContactMap.attr("transform", "translate(0, "+(width/2)+") rotate(-45)");
		
		
		
		
		var posX = 0;
		var posBin = 0;
		var regionsArray = [];
		var regionChrs = Object.keys(contactMap.data[ samples[i] ].genomeSize);
		for(var j=0; j<regionChrs.length; j++) {
			var record = {};

			var key = regionChrs[j];
			var chr = regionChrs[j].split('-')[0];
		
			var startBin = posBin;
			var endBin = posBin + contactMap.data[ samples[i] ].genomeSize[key];
			var posEndX = posX + (contactMap.data[ samples[i] ].genomeSize[key] * Math.sqrt(2));
			
//			if( startBin > endBin ) {
//				var tmp = startBin;
//				startBin = endBin;
//				endBin = startBin;
//			}

			var localScale = d3.scaleLinear()
			.domain([ startBin, endBin ])
			.range( [ posX, posEndX] );

			var leftX = scaleCoord(startBin);
			var rightX = scaleCoord(endBin);
			var centerX = leftX + (rightX-leftX)/2;
			
			var binsize = contactMap.data[ samples[i] ].genomeSize[key];
			var resolution = parseInt(contactMap.resolution);

			var textSizeObj = textSize( contactMap.userRegions[j] );

			record['key'] = key;
			record['chr'] = chr;
			record['startBin'] = startBin;
			record['endBin'] = endBin;
			record['leftX'] = leftX;
			record['centerX'] = centerX;
			record['rightX'] = rightX;
			record['rullerLabelObj'] = textSizeObj;
			record['coorinate'] = contactMap.userRegions[j];
			record['genomic_location'] = {chr:contactMap.userRegions[j].split(":")[0], start:parseInt(contactMap.userRegions[j].split(":")[1].split("-")[0]), end:parseInt(contactMap.userRegions[j].split(":")[1].split("-")[1])};
			record['resolution'] = resolution;
			record['scale'] = localScale;
			
			var chrStartInUserRegion = parseInt(contactMap.userRegions[j].split(":")[1].split("-")[0]);
			var chrEndtInUserRegion = parseInt(contactMap.userRegions[j].split(":")[1].split("-")[1]);			
			
			record['rangeLabel'] = genomeLength4Label( chrEndtInUserRegion - chrStartInUserRegion );

			for(var k=0; k<contactMap.extra_tracks.length; k++) {
				if( contactMap.hasOwnProperty( contactMap.extra_tracks[k] ) ){
					record[contactMap.extra_tracks[k]] = contactMap[contactMap.extra_tracks[k]][ key ];
				}
			}
			regionsArray.push( record );

			posBin = endBin;
			posX = posEndX;
		}
		
//		console.log( contactMap );
//		console.log( regionsArray );
//		
//		return;
		// Chromosome band
		var gChrBand = canvas.append("g").attr("class", "chromosomeBand");

		var chrBandY = width/2;
		var BAND_HEIGHT = 25;
		gChrBand.selectAll("rect")
		.data( regionsArray )
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return d.leftX;
		})
		.attr("y", chrBandY)
		.attr("width", function(d, i) {
			return d.rightX - d.leftX;
		})
		.attr("height", BAND_HEIGHT)
		.style("fill", function(d, i){
			return chromColorMap[d.chr];
		})
		.style('fill-opacity', 0.4);

		gChrBand.selectAll("text")
		.data( regionsArray )
		.enter()
		.append("text")
		.text(function(d, i){
			return d.chr;
		})
		.attr("x", function(d, i){
			return d.centerX;
		})
		.attr("y", (width/2) + (BAND_HEIGHT/2))
		.attr("baseline-shift", "-24%")
		.attr("text-anchor", "middle")
		.attr("fill", "gray")
		.style("font", "12px Arial")
		.style('fill-opacity', 1);

		var rullerY = (width/2) + BAND_HEIGHT;
		// Ruller
		for(var j=0; j< regionsArray.length; j++) {
			var obj = regionsArray[j];

			var rullerLines = [];
			rullerLines.push( {x1:obj.leftX, y1:rullerY, x2:obj.leftX, y2:(rullerY + (BAND_HEIGHT*3)), type:'left'} );
//			rullerLines.push( {x1:obj.centerX, y1:rullerY, x2:obj.centerX, y2:(rullerY + 5), type:'center'} );
			rullerLines.push( {x1:obj.rightX, y1:rullerY, x2:obj.rightX, y2:(rullerY + (BAND_HEIGHT*3)), type:'right'} );

			var labelWidth = obj.rullerLabelObj.width;

			var x11 = obj.centerX - (labelWidth/2);
			if( x11 < obj.leftX )	x11 = obj.leftX;
			
			var x21 = obj.centerX + (labelWidth/2);
			if( x21 > obj.rightX )	x21 = obj.rightX;
			
			rullerLines.push( {x1:x11, y1:(rullerY + ((3*BAND_HEIGHT)/2)) + 15, x2:obj.leftX + 5, y2:(rullerY + ((3*BAND_HEIGHT)/2)) + 15, type:'vast'} );
			rullerLines.push( {x1:x21, y1:(rullerY + ((3*BAND_HEIGHT)/2)) + 15, x2:obj.rightX -5, y2:(rullerY + ((3*BAND_HEIGHT)/2)) + 15, type:'vast'} );

			obj['rullerLines'] = rullerLines;
		}

		var gRuller = canvas.append("g").attr("class", "ruller");

		// Ruler rectangle
		gRuller.selectAll("rect")
		.data( regionsArray )
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return d.leftX;
		})
		.attr("y", rullerY)
		.attr("width", function(d, i) {
			return d.rightX - d.leftX;
		})
		.attr("height", BAND_HEIGHT * 3)
		.style("fill", "rgb(230, 230, 230)")
		.style('fill-opacity', 1);

		
		// Ruler description
		gRuller.append("g").attr("id", "ruler-label")
		.append("text")
		.text("Ruler")
		.attr("x", function(d){
			return -5;
		})
		.attr("y", function(d){
			return rullerY + ((BAND_HEIGHT * 3)/2);
		})
		.style("font", "12px Arial bold")
		.style('fill', 'rgb(99, 99, 99)')
		.attr("baseline-shift", "-24%")
		.attr("text-anchor", "end")
		;
		
		var UNIT_WIDTH = 10;

		for(var j=0; j<regionsArray.length; j++) {
			var centerY = (rullerY + ((3*BAND_HEIGHT)/2)) + 15;

			gRuller.append("g").attr("class", "ruller-label-" + regionsArray[j].key)
			.selectAll("text")
			.data( [regionsArray[j]] )
			.enter()
			.append("text")
			.text(function(d){
				return "(" + d.rangeLabel + ")";
			})
			.attr("x", function(d){
				return d.centerX;
			})
			.attr("y", centerY + 5)
			.attr("alignment-baseline", "hanging")
			.attr("text-anchor", "middle")
			.attr("fill", "gray")
			.style("font", "12px Arial")
			.style("background-color", "white")
			.style('fill-opacity', 1);
			
			
			if( regionsArray[j].rightX - regionsArray[j].leftX > 100 ) {
				gRuller.append("g").attr("class", "ruller-label-coordinate-" + regionsArray[j].key)
				.selectAll("text")
				.data( [regionsArray[j]] )
				.enter()
				.append("text")
				.text(function(d){
					return d.coorinate;
				})
				.attr("x", function(d){
					return d.centerX;
				})
				.attr("y", centerY - 5)
				.attr("alignment-baseline", "ideographic")
				.attr("text-anchor", "middle")
				.attr("fill", "gray")
				.style("font", "12px Arial")
				.style("background-color", "white")
				.style('fill-opacity', 1);
			}
	
			gRuller.append("g").attr("class", "ruller-vertical-" + regionsArray[j].key )
			.selectAll("line")
			.data( regionsArray[j].rullerLines.filter(function(d){return d.type !== 'vast'}) )
			.enter()
			.append("line")
			.attr("x1", function(d, i){
				return d.x1;
			})
			.attr("y1", function(d, i){
				return d.y1;
			})
			.attr("x2", function(d, i){
				return d.x2;
			})
			.attr("y2", function(d, i){
				return d.y2;
			})
			.style('stroke-width', 1)
			.style('stroke', 'black')
			;
			
	
			gRuller.append("g").attr("class", "ruller-horizontal-"  + regionsArray[j].key )
			.selectAll("line")
			.data( regionsArray[j].rullerLines.filter(function(d){return d.type === 'vast'}) )
			.enter()
			.append("line")
			.attr("marker-end", "url(#arrow)")
			.attr("x1", function(d, i){
				return d.x1;
			})
			.attr("y1", function(d, i){
				return d.y1;
			})
			.attr("x2", function(d, i){
				return d.x2;
			})
			.attr("y2", function(d, i){
				return d.y2;
			})
			.style('stroke-width', 1)
			.style('stroke', 'black')
			;

			var cntOfRulerUnit = 0;
			var scaleXX = d3.scaleLinear()
			.domain([regionsArray[j].leftX, regionsArray[j].rightX])
			.range([regionsArray[j].genomic_location.start, regionsArray[j].genomic_location.end]);

			var rulerMeters = [];
			for( var k=regionsArray[j].leftX; k<=regionsArray[j].rightX; k+=UNIT_WIDTH) {
				var cy2 = 4;
				var value = null;

				if( cntOfRulerUnit == 10 ) {
					cy2 = 7;
					value = Math.floor(scaleXX(k) / contactMap.resolution) * contactMap.resolution;

					var strLabel = "";
					var strLabel = "";
					if( value > 1 & value / 1000 < 1000 )											strLabel = parseInt(value / 1000) + "Kb";
					else if( value / 1000 >= 1000 && value / 1000 / 1000 < 1000 )					strLabel = parseInt(value / 1000 / 1000) + "Mb";
					else if( value / 1000 / 1000 >= 1000 && value / 1000 / 1000 / 1000 < 1000 ) 	strLabel = parseInt(value / 1000 / 1000 / 1000) + "Gb";
										
					value = strLabel;
					
					cntOfRulerUnit = 0;
				}

				rulerMeters.push( {x:k, y1:rullerY, y2:rullerY + cy2, label:value}) ;

				cntOfRulerUnit++;
			}
			
			gRuller.append("g").attr("class", "ruler-meter-"  + regionsArray[j].key )
			.selectAll("line")
			.data( rulerMeters )
			.enter()
			.append("line")
			.attr("x1", function(d, i){
				return d.x;
			})
			.attr("y1", function(d, i){
				return d.y1;
			})
			.attr("x2", function(d, i){
				return d.x;
			})
			.attr("y2", function(d, i){
				return d.y2;
			})
			.style('stroke-width', 1)
			.style('stroke', 'black')
			;
			
			
			gRuller.append("g").attr("class", "ruller-meter-label-" + regionsArray[j].key)
			.selectAll("text")
			.data( rulerMeters.filter(function(d){return d.label !== null}) )
			.enter()
			.append("text")
			.text(function(d){
				return d.label;
			})
			.attr("x", function(d){
				return d.x;
			})
			.attr("y", rullerY + 10)
			.attr("alignment-baseline", "hanging")
			.attr("text-anchor", "middle")
			.attr("fill", "gray")
			.style("font", "12px Arial")
			.style("background-color", "white")
			.style('fill-opacity', 1);
		}
		
		
		var nextTrackY = rullerY + (3*BAND_HEIGHT) + 5;

		// track To display
		for(var j=0; j<contactMap.extra_tracks.length; j++) {
			var flag = false;
			if( contactMap.extra_tracks[j] ==='gencode' && contactMap.gencodeGenesDisplayType === 'dense' )			flag = true;
			else if( contactMap.extra_tracks[j] ==='gencode' && contactMap.gencodeGenesDisplayType !== 'dense' )	flag = false;
			else if( contactMap.extra_tracks[j] ==='refseq' && contactMap.refseqGenesDisplayType === 'dense' )		flag = true;
			else if( contactMap.extra_tracks[j] ==='refseq' && contactMap.refseqGenesDisplayType !== 'dense' )		flag = false;

			if( flag === false ) {
				if( contactMap.hasOwnProperty( contactMap.extra_tracks[j] ) ){
				//if( contactMap.gencodeGenesDisplayType !== 'dense' ){}
					var maxLayer = 0;
	
					var drawingLayerObjs = {};
					for(var k=0; k<regionsArray.length; k++) {
						var data = regionsArray[k][contactMap.extra_tracks[j]];

						var baseY = nextTrackY;

						for(var idx=0; idx<data.length; idx++){
							var x1 = scale(data[idx].startBin) * Math.sqrt(2);
							var x2 = scale(data[idx].endBin) * Math.sqrt(2);
	
							var textWidth =  0;
							if(  data[idx].name !== undefined ){						
								var textMeasure = textSize( data[idx].name );
								textWidth = (textMeasure.width + 10);
							}
	
							var item = {x1:x1, y1:baseY, x2:x2, textX:(x1-2), textWidth:textWidth, y2:baseY, label:data[idx].name, strand:data[idx].strand, start:data[idx].startBin, end:data[idx].endBin};
	
							if( "superenhancer" === contactMap.extra_tracks[j] )	{
								if( drawingLayerObjs[0] === undefined )	drawingLayerObjs[0] = [item];
								else									drawingLayerObjs[0].push( item );	
							}
							else										CancerHiC._putLayer( item, drawingLayerObjs );
						}
	
						if( maxLayer < Object.keys(drawingLayerObjs).length ) maxLayer = Object.keys(drawingLayerObjs).length; 
					}
					
					var featureArray = [];
					for(var idx=0; idx<Object.keys(drawingLayerObjs).length; idx++) {
						var layerNo = Object.keys(drawingLayerObjs)[idx];
	
						var items = drawingLayerObjs[ layerNo ];
						for(var jdx=0; jdx<items.length; jdx++) {
							items[jdx]['layer'] = parseInt(layerNo);
							
							featureArray.push( items[jdx] );
						}
					}
					
					var gFeature = canvas.append("g").attr("class", "feature-" + contactMap.extra_tracks[k] );
	
					
					// Genecode or superenhancer or Refseq gene 과 같은 내용 background
					gFeature
					.append("rect")
					.attr("x", function(d){
						return 0;
					})
					.attr("y", nextTrackY)
					.attr("width", function(d){
						return (width-LABEL_WIDTH);
					})
					.attr("height", ((maxLayer * BAND_HEIGHT)))
					.style("fill", "rgb(230, 230, 230)")
					.style('opacity', 0.4)
					;

					var color = "rgb(0, 0, 0)";
					var mk = 'url(#vbar)';
					if( contactMap.extra_tracks[j] === 'superenhancer' ){
						mk = 'url(#se_vbar)';
						color = "rgb(106, 168, 62)";
					}

					gFeature.selectAll("line")
					.data( featureArray )
					.enter()
					.append("line")
					.attr("marker-end", mk)
					.attr("marker-start", mk)
					.attr("x1", function(d){
						return d.x1;
					})
					.attr("y1", function(d){
						return (d.layer * BAND_HEIGHT) + d.y1 + (BAND_HEIGHT/2);
					})
					.attr("x2", function(d){
						return d.x2;
					})
					.attr("y2", function(d){
						return (d.layer * BAND_HEIGHT) + d.y1 + (BAND_HEIGHT/2);
					})
					.style('stroke', color)
					.style('stroke-width', 1)
					.style("fill", "none");
					
					
					for(var idx =0; idx<featureArray.length; idx++) {
						var item = featureArray[idx];
						
						var yLine = (item.layer * BAND_HEIGHT) + item.y1 + (BAND_HEIGHT/2);
	
						var geneWidth = item.x2 - item.x1;
						var dirUnitWidth = geneWidth / 3;
	
						if( item.strand === '+' ) {
							if( dirUnitWidth > 1 ) {
								var xGeneDirPos = item.x1;
								for( var kdx=0; kdx<3; kdx++) {
									var points = [{x:xGeneDirPos - 5, y:yLine - 3}, {x:xGeneDirPos, y:yLine}, {x:xGeneDirPos - 5, y:yLine + 3}]
									
									gFeature.append("path")
									.attr("class", "direction")
									.attr("d", lineFunction(points))
									.style('stroke', 'rgb(21, 140, 0)')
									.style('stroke-width', 1)
									.style("fill", "none")
									;
		
									xGeneDirPos += dirUnitWidth;
								}
							}else {
								var xGeneDirPos = item.x1 + (geneWidth/2);
								
								var points = [{x:xGeneDirPos - 5, y:yLine - 3}, {x:xGeneDirPos, y:yLine}, {x:xGeneDirPos - 5, y:yLine + 3}]
								
								gFeature.append("path")
								.attr("class", "direction")
								.attr("d", lineFunction(points))
								.style('stroke', 'rgb(21, 140, 0)')
								.style('stroke-width', 1)
								.style("fill", "none")
								;
							}
						}else if( item.strand === '-' ) {
							if( dirUnitWidth > 1 ) {
								var xGeneDirPos = item.x1;
								for( var kdx=0; kdx<3; kdx++) {
									var points = [{x:xGeneDirPos + 5, y:yLine - 3}, {x:xGeneDirPos, y:yLine}, {x:xGeneDirPos + 5, y:yLine + 3}]
									
									gFeature.append("path")
									.attr("class", "direction")
									.attr("d", lineFunction(points))
									.style('stroke', 'rgb(21, 140, 0)')
									.style('stroke-width', 1)
									.style("fill", "none")
									;
		
									xGeneDirPos += dirUnitWidth;
								}
							}else {
								var xGeneDirPos = item.x1 + (geneWidth/2);
								var points = [{x:xGeneDirPos + 5, y:yLine - 3}, {x:xGeneDirPos, y:yLine}, {x:xGeneDirPos + 5, y:yLine + 3}]
								
								gFeature.append("path")
								.attr("class", "direction")
								.attr("d", lineFunction(points))
								.style('stroke', 'rgb(21, 140, 0)')
								.style('stroke-width', 1)
								.style("fill", "none")
								;
							}
						}
					}
					
					
	
					
					gFeature.selectAll("text")
					.data( featureArray )
					.enter()
					.append("text")
					.text(function(d){
						return d.label;
					})
					.attr("x", function(d){
						return d.x1 - 2;
					})
					.attr("y", function(d){
						return (d.layer * BAND_HEIGHT) + d.y1 + (BAND_HEIGHT/2);
					})
					.style("font", "10px Arial")
					.style('fill', 'rgb(99, 99, 99)')
					.attr("baseline-shift", "-24%")
					.attr("text-anchor", "end")
					;
	
					nextTrackY += (maxLayer * BAND_HEIGHT) + 5 + 10;
					
					
					var titleLabel = contactMap.extra_tracks[j]; 

					gFeature
					.append("text")
					.text(titleLabel.charAt(0).toUpperCase() + titleLabel.slice(1))
					.attr("x", function(d){
						return -5;
					})
					.attr("y", function(d){
						return (rullerY + (3*BAND_HEIGHT) + 5) + ((maxLayer * BAND_HEIGHT)/2);
					})
					.style("font", "12px Arial bold")
					.style('fill', 'rgb(99, 99, 99)')
					.attr("baseline-shift", "-24%")
					.attr("text-anchor", "end")
					;
				}
			}else {
				gFeature
				.append("rect")
				.attr("x", function(d){
					return 0;
				})
				.attr("y", nextTrackY)
				.attr("width", function(d){
					return (width-LABEL_WIDTH);
				})
				.attr("height", BAND_HEIGHT)
				.style("fill", "white")
				.style('opacity', 0.4)
				;

				for(var k=0; k<regionsArray.length; k++) {
					var data = regionsArray[k][contactMap.extra_tracks[j]];

					var baseY = nextTrackY;
					
					var scaleXX22 = d3.scaleLinear()
					.domain([ regionsArray[k].startBin, regionsArray[k].endBin])
					.range([regionsArray[k].leftX, regionsArray[k].rightX]);

//					console.log( contactMap.extra_tracks[j] + " - " + regionsArray[k].rangeLabel +  " : " + data.length + "  sBin:" +  regionsArray[k].startBin + "   eBin: " + regionsArray[k].endBin + "  leftX:" + regionsArray[k].leftX + "   rightX:" + regionsArray[k].rightX );
					var featureArray = [];
					for(var idx=0; idx<data.length; idx++){
						var x1 = scaleXX22(data[idx].startBin);
						var x2 = scaleXX22(data[idx].endBin);

						var item = {x:x1, y:baseY + (BAND_HEIGHT/3), width:(x2-x1+1), height:(BAND_HEIGHT/3)};
						
						if( x1 >= regionsArray[k].leftX && x2 <= regionsArray[k].rightX )	featureArray.push( item );
					}

					gFeature.append("g").selectAll("rect")
					.data( featureArray )
					.enter()
					.append("rect")
					.attr("x", function(d){
						return d.x;
					})
					.attr("y", function(d){
						return d.y;
					})
					.attr("width", function(d){
						return d.width;
					})
					.attr("height", function(d){
						return d.height;
					})
					.style('fill', 'rgb(33, 45, 176)')
					.style('opacity', 0.5);
				}
				
				var titleLabel = contactMap.extra_tracks[j]; 
				gFeature
				.append("text")
				.text(titleLabel.charAt(0).toUpperCase() + titleLabel.slice(1))
				.attr("x", function(d){
					return -5;
				})
				.attr("y", function(d){
					return nextTrackY + ((BAND_HEIGHT)/2);
				})
				.style("font", "12px Arial bold")
				.style('fill', 'rgb(99, 99, 99)')
				.attr("baseline-shift", "-24%")
				.attr("text-anchor", "end")
				;

				nextTrackY += (BAND_HEIGHT + 5 + 10);
			}
		}
		
		if( svInfo !== null ){
			if( svInfo.bin14Svg !== undefined && svInfo.bin24Svg !== undefined && svInfo.svType4Svg !== undefined ) {
				var lineFunction = d3.line()
					.x(function(d) { return d.x; })
					.y(function(d) { return d.y; })
					;
				
				if( svInfo.svType4Svg === 'DEL' ) svInfo.bin24Svg = svInfo.bin14Svg;

				var lineData = [
					{x:scale(svInfo.bin14Svg.bin), y:scale(0), type:'row'}
					, {x:scale(svInfo.bin14Svg.bin), y:scale(svInfo.bin14Svg.bin), type:'row'}
					, {x:scale(svInfo.bin24Svg.bin), y:scale(svInfo.bin24Svg.bin), type:'row'}
					, {x:scale(svInfo.bin24Svg.bin), y:scale(0), type:'row'}
					, {x:scale(svInfo.bin14Svg.bin), y:scale(0), type:'row'}
					
					, {x:scale(svInfo.bin14Svg.bin), y:scale(svInfo.bin14Svg.bin), type:'col'}
					, {x:scale(svInfo.bin24Svg.bin), y:scale(svInfo.bin24Svg.bin), type:'col'}
					, {x:scale(contactMap.data[ samples[i] ].nRow), y:scale(svInfo.bin24Svg.bin), type:'col'}
					, {x:scale(contactMap.data[ samples[i] ].nRow), y:scale(svInfo.bin14Svg.bin), type:'col'}
					, {x:scale(svInfo.bin14Svg.bin), y:scale(svInfo.bin14Svg.bin), type:'col'}
				];

				gContactMap.append("g").attr("class", "tmp-test")
				.append("path")
				.attr('class', 'line')
				.attr('d', lineFunction(lineData.filter(function(d){return d.type === 'row'})))
				.style('stroke', 'blue')
				.style('stroke-width', 2)
				.style('fill', "rgb(0, 0, 255)")
				.style('opacity', 0.2)
				;
				
				gContactMap.append("g").attr("class", "tmp-test")
				.append("path")
				.attr('class', 'line')
				.attr('d', lineFunction(lineData.filter(function(d){return d.type === 'col'})))
				.style('stroke', 'blue')
				.style('stroke-width', 2)
				.style('fill', "rgb(0, 0, 255)")
				.style('opacity', 0.2)
				;
			}
		}
		
		if( contactMap.colorPalette == "WtoR" ) 			canvas.style("background-color", 'rgb(255, 255, 255)'); 
		else if( contactMap.colorPalette == "BtoYtoR" )		canvas.style("background-color", 'rgb(50, 50, 150)');	
	}
	
	var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(canvas.node());
    
    downloadSVG( xmlString, name );
    
    canvas.remove();

	if ($('#preloader2').length) {
		$('#preloader2').fadeOut('slow', function() {
			$(this).remove();
		});
	}
}

function downloadSVG( svgStringArray, filename ) {
	var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
	
	window.URL = (window.URL || window.webkitURL);
	
	var body = document.body;

	download(svgStringArray);
	
	function download(source) {
		if( isEmpty(filename) )	filename = "download";
		
		var url = window.URL.createObjectURL(new Blob([source], { "type" : "text\/xml" }));
		
		var a = document.createElement("a");
		body.appendChild(a);
		a.setAttribute("class", "svg-crowbar");
		a.setAttribute("download", filename);
		a.setAttribute("href", url);
		a.style["display"] = "none";
		a.click();
		
		setTimeout(function() {
			window.URL.revokeObjectURL(url);
		}, 10);
	}
}

var convertSvgCircleToPath = function(cx, cy, r, deg) {
	var theta = deg * Math.PI / 180,
	dx = r * Math.cos(theta),
	dy = -r * Math.sin(theta);

	return "M " + cx + " " + cy + "m " + dx + "," + dy + "a " + r + "," + r + " 0 1,0 " + -2 * dx + "," + -2 * dy + "a " + r + "," + r + " 0 1,0 " + 2 * dx + "," + 2 * dy;
}

function saveCanvasToFile( canvases, name, type ){
	var innerCanvas = document.getElementById( canvases[0] );
	
	var width = innerCanvas.width + 150;
	var height = 0;
	
	for(var i=0; i<canvases.length; i++) {
		var innerCanvas2 = document.getElementById( canvases[i] );
		height += innerCanvas2.height;
	}

	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	var ctx = canvas.getContext('2d');

	ctx.drawImage( innerCanvas, 0, 0 );
	
	var innerHeight = innerCanvas.height;

	for(var i=1; i<canvases.length; i++) {
		var innerCanvas2 = document.getElementById( canvases[i] );
		ctx.drawImage( innerCanvas2, 0, innerHeight );

		innerHeight += innerCanvas2.height;
	}

	saveCanvas2Image( canvas.toDataURL(), width, height, type, name, saveAs );
}

function saveCanvas2Image( canvasString, width, height, format, name, callback ) {
	var format = format ? format : 'png';

	var imgsrc = canvasString; // Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var image = new Image();
	
	(image).onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image, 0, 0, width, height);

		canvas.toBlob( function(blob) {
			if( format === 'png' ) {
				var filesize = Math.round( blob.size/1024 ) + ' KB';
				if ( callback ) callback( blob, name + '.png' );
			}else if( format === 'pdf' ) {
				var imgData = canvas.toDataURL('image/png', wid = canvas.width, hgt = canvas.height);
				var hratio = hgt/wid;

				var pdf = new jsPDF('p', 'px', [height, width]);
				
				var imgWidth = pdf.internal.pageSize.width;
				var imgHeight = imgWidth * hratio;
				
				pdf.addImage(imgData, 10, 20, imgWidth - 20, imgHeight);
				pdf.save(name + '.pdf');
			}
		});
	};

	image.src = imgsrc;
}

function textSize(text) {
    if (!d3) return;
    var container = d3.select('body').append('svg');
    container.append("text").attr("x", -99999).attr("y", -999999).text(text);
    var size = container.node().getBBox();
    container.remove();

    return { width: size.width, height: size.height };
}