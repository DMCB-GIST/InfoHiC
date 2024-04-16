HicHistogram.prototype.enhancer = function(data, dataOrder){
		var obj = this;
		
		var enhancer_topMargin = 10;
		var enhancer_bottomMargin = 10;
		var rectHeight = 10;
		var y = enhancer_topMargin;
		
		var enhancerDiv = $("#graph-frame-enhancer-"+obj.config.dataOrder);
		
		var graphDiv = $("#graph-frame-graph-"+obj.config.dataOrder);
		var arcDiv = $("#graph-frame-arc-"+obj.config.dataOrder);
		
		var enhancerCanvas = d3.select("#graph-frame-enhancer-" + obj.config.dataOrder)
		.append("svg")
		.attr("id", "enhancerCanvas-" + obj.config.dataOrder)
		.attr("y", graphDiv.height() + arcDiv.height())
		.style("width" , enhancerDiv.width())
		.style("height", rectHeight + 30)
		.style("display", "block");
		
//		var innerSvg = enhancerCanvas.append("svg")
//		.attr("id", "enhancerDrawingCanvas-" + obj.config.dataOrder)
//		.attr("x", $("#peakBaseRect-"+obj.config.dataOrder).attr("x"))
//		.attr("y", 0);
		
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
		
		if(data) {
			if(data.length == 0){
				enhancerCanvas.append("text")
				.text("There are no super-enhancers in this area.")
				.attr('class', 'unit-label')
				.attr("x", 400)
				.attr("y", 10 + rectHeight)
				.style("font-size", "9pt");
				return;
			}
			
			for(var i=0; i<data.length; i++)
				this.drawEnhancerTracks(enhancerCanvas, data, rectHeight, i, dataOrder);
		} else {
			enhancerCanvas.append("text")
			.text("There are no super-enhancers in this area.")
			.attr('class', 'unit-label')
			.attr("x", 400)
			.attr("y", 10 + rectHeight)
			.style("font-size", "9pt");
		}
//		var viewBoxHeight = $("#enhancerCanvas-"+obj.config.dataOrder).height()-(rectHeight + 30);
//		var totalHeight = y + enhancer_bottomMargin;
//		innerSvg.attr("viewBox", $("#peakBaseRect-"+obj.config.dataOrder).attr("x") + " 0 " + enhancerDiv.width() +" " + (totalHeight+viewBoxHeight) );
};

HicHistogram.prototype.drawEnhancerTracks = function( enhancerCanvas, data, rectHeight, i, dataOrder) {
	var obj = this;

	enhancerCanvas.append('rect')
				.attr('class', 'enhancer-Rect')
				.attr('x', obj.xScale(parseInt(data[i].start)))
				.attr('y', '0')
				.attr('height', rectHeight)
				.attr('width', function(d){ return obj.xScale(parseInt(data[i].end)) - obj.xScale(parseInt(data[i].start) + 1);});
	
	enhancerCanvas.append('text')
				.attr('id', dataOrder + '-text-'+i)
				.attr('text-anchor', 'end')
				.attr("baseline-shift", "-75%")
				.attr('font-size', '10px')
				.attr('x', obj.xScale(parseInt(data[i].start))+50)
				.attr('y', '12' )
				.text(data[i].id);

	if(i > 0){
		var pre_id =  dataOrder + '-text-'+(i-1); 
		var id= dataOrder + '-text-'+i; 
		
		var pre = $("#"+pre_id);
		var cur = $("#"+id);

		var overlap = !( pre.attr('x') < (cur.attr('x')- cur.width()) );
		
		if(overlap){

			cur.attr('y',(parseInt(pre.attr('y'))+parseInt(13)));
			
			$("#enhancerCanvas-"+dataOrder).css('height', $("#enhancerCanvas-"+dataOrder).height() + 12);
		}
	}
	
};