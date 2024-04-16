HicHistogram.prototype.gencodeSelect = function(data, drawingType) {
	var obj = this;
	
	var gencodeSelect = "";
	gencodeSelect += "<div id='gencode-select-"+obj.config.dataOrder+"' class='gene-select'></div>";

	$("#graph-frame-gencode-"+obj.config.dataOrder).append( gencodeSelect );
	
	var select = "";
	select += "<select id='gencode-collapseType-"+obj.config.dataOrder+"' class='collapseType'>";
	select += 	"<option value='full'>full</option>";
	select += 	"<option value='dense'>dense</option>";
	select += "</select>";
	
	$("#gencode-select-"+obj.config.dataOrder).append( select );
	
	$("#"+"gencode-collapseType-"+obj.config.dataOrder).change(function(){
		obj.gencode( data, $("#"+"gencode-collapseType-"+obj.config.dataOrder+" option:selected").val() );
	});
	
	obj.gencode( data, $("#"+"gencode-collapseType-"+obj.config.dataOrder+" option:selected").val() );
};

HicHistogram.prototype.gencode = function( data, drawingType ) {
	var obj = this;
	
	$("#gencodeCanvas-" + obj.config.dataOrder).remove();
	
	var graphDiv = $("#graph-frame-graph-"+obj.config.dataOrder);
	var arcDiv = $("#graph-frame-arc-"+obj.config.dataOrder);
	var enhancerDiv = $("#graph-frame-enhancer-"+obj.config.dataOrder);
	var geneDiv = $("#graph-frame-gene-"+obj.config.dataOrder);
	var gencodeDiv = $("#graph-frame-gencode-"+obj.config.dataOrder);
	
	var gencodeCanvas = d3.select("#graph-frame-gencode-"+obj.config.dataOrder).append("svg")
	.attr("id", "gencodeCanvas-" + obj.config.dataOrder)
	.attr("y", graphDiv.height() + arcDiv.height() + enhancerDiv.height() + geneDiv.height())
	.style("width" , gencodeDiv.width())
	.style("display", "block")
	.attr("viewBox","0 0 " + gencodeDiv.width() +" " + gencodeDiv.height())
	;
	
	var innerSvg = gencodeCanvas.append("svg")
	.attr("id", "gencodeDrawingCanvas-" + obj.config.dataOrder)
	.attr("x", $("#peakBaseRect-" + obj.config.dataOrder).attr("x"))
	.attr("y", 0)
	.attr("width" , gencodeDiv.width())
	;
	
	var gencodeGroup_topMargin = 10;
	var gencodeGroup_bottomMargin = 10;
	var prevGencodeGroup_height = 15;
	
	var rectHeight = 10;
	
	var y = gencodeGroup_topMargin;
	var innerY = gencodeGroup_topMargin;
	
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
		dbName.text( Object.keys(data)[dbTypeIndex] );
		
		var height = this.drawGencodeGeneTracks( innerSvg, data, Object.keys(data)[dbTypeIndex], drawingType, y, rectHeight );

		if( dbTypeIndex == Object.keys(data).length-1 )		y += height;
		else {
			y += (height + prevGeneGroup_height);
			innerY += height;
		}
	}
	
	var totalHeight = y + gencodeGroup_bottomMargin;
	var InnertotalHeight = innerY + gencodeGroup_bottomMargin;

	if(drawingType=='full') {
		gencodeCanvas.attr("viewBox","0 0 " + gencodeDiv.width() +" " + totalHeight );
		gencodeCanvas.attr("height", totalHeight );
		innerSvg.attr("viewBox", $("#peakBaseRect-"+obj.config.dataOrder).attr("x") + " 0 " + gencodeDiv.width() +" " + totalHeight );
		innerSvg.attr("height", totalHeight );
	} else {
		gencodeCanvas.attr("viewBox","0 0 " + gencodeDiv.width() +" " + InnertotalHeight );
		gencodeCanvas.attr("height", InnertotalHeight );
		innerSvg.attr("viewBox", $("#peakBaseRect-"+obj.config.dataOrder).attr("x") + " 0 " + gencodeDiv.width() +" " + InnertotalHeight );
	}
};

HicHistogram.prototype.drawGencodeGeneTracks = function( gencodeCanvas, data, dbType, drawingType, yPos, rectHeight ) {
	var obj = this;

	var marginBetweenLayers = 2;

	var gencodeGeneTracks = data[ dbType ];
	
	var gencodeGeneGroup = gencodeCanvas.append('g').attr('id', dbType+'-gencode-gene-group-' + obj.config.dataOrder);

	var yBase = yPos + (0 * rectHeight);

	for(layerIndex in gencodeGeneTracks) {
		var gencodeGenes = gencodeGeneTracks[layerIndex];
		
		var gencodeGeneGroupLine = gencodeGeneGroup.append('g').attr('id', dbType+'-gencode-gene-line'+layerIndex + "-" + obj.config.dataOrder);

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
				.attr('id', dbType+'-gencode-gene-text'+layerIndex+'-data-'+gencodeGeneIndexInEachLayer + "-" + obj.config.dataOrder)
				.attr('class', dbType+'_gencode_geneText')
				.attr('text-anchor', 'end')
				.attr("baseline-shift", "-75%")
				.attr('font-size', '10px')
				.attr('x', function(d){ return obj.xScale(parseInt(gencodeGenes[gencodeGeneIndexInEachLayer].txStart))-2;})
				.attr('y', yBase )
				.text(gencodeGenes[gencodeGeneIndexInEachLayer].name);
			}
		}

		if( drawingType === 'full' )		yBase += (rectHeight + marginBetweenLayers);
		else if( drawingType === 'dense' )	yBase = yBase;
	}
	
	return ( Object.keys(gencodeGeneTracks).length * parseInt(rectHeight) ) + ((Object.keys(gencodeGeneTracks).length-1) * marginBetweenLayers);
};