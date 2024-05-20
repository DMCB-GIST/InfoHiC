//HicHistogram.prototype.findGeneAboutBait = function( loci, boundary_range, window_size ) {
//	var obj = this;
//	
//	$.ajax({
//		type: 'post',
//		url: 'get_gene',
//		data: {loci:loci, boundary_range:boundary_range, window_size:window_size},
//		dataType: 'json',
//		success:function(data) {
//			obj.gene(data, 'full');
//		}
//	});
//};

HicHistogram.prototype.drawGeneTracks = function( geneCanvas, data, dbType, drawingType, yPos, rectHeight ) {
	var obj = this;

	var marginBetweenLayers = 2;

	var geneTracks = data[ dbType ];
	
	var geneGroup = geneCanvas.append('g').attr('id', dbType+'-gene-group-' + obj.config.dataOrder);

	var yBase = yPos + (0 * rectHeight);

	for(layerIndex in geneTracks) {
		var genes = geneTracks[layerIndex];
		
		var geneGroupLine = geneGroup.append('g').attr('id', dbType+'-gene-line'+layerIndex + "-" + obj.config.dataOrder);

		for(geneIndexInEachLayer in genes) {
//			var geneRect= geneGroupLine.append('rect')
//			.attr('id', dbType+'-gene-rect'+layerIndex+'-data-'+geneIndexInEachLayer + "-" + obj.config.dataOrder)
//			.attr('class', dbType+'-geneRect')
//			.attr('x', function(d){ return obj.xScale(parseInt(genes[geneIndexInEachLayer].txStart));})
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
				.attr('id', dbType+'-gene-text'+layerIndex+'-data-'+geneIndexInEachLayer + "-" + obj.config.dataOrder)
				.attr('class', dbType+'_geneText')
				.attr('text-anchor', 'end')
				.attr("baseline-shift", "-75%")
				.attr('font-size', '10px')
				.attr('x', function(d){ return obj.xScale(parseInt(genes[geneIndexInEachLayer].txStart))-2;})
				.attr('y', yBase )
				.text(genes[geneIndexInEachLayer].name);
			}
		}

		if( drawingType === 'full' )		yBase += (rectHeight + marginBetweenLayers);
		else if( drawingType === 'dense' )	yBase = yBase;
	}
	
//	console.log("yBase : " + yBase + " " + "rectHeight : " + rectHeight);

//	if( drawingType === 'full' )
//		return ( Object.keys(geneTracks).length * parseInt(rectHeight) ) + ((Object.keys(geneTracks).length-1) * marginBetweenLayers);
//	
//	return ( 1 * parseInt(rectHeight) );
	
	return ( Object.keys(geneTracks).length * parseInt(rectHeight) ) + ((Object.keys(geneTracks).length-1) * marginBetweenLayers);
};

HicHistogram.prototype.geneSelect = function(data, drawingType) {
	var obj = this;
	
	var geneSelect = "";
	geneSelect += "<div id='gene-select-"+obj.config.dataOrder+"' class='gene-select'></div>";

	$("#graph-frame-gene-"+obj.config.dataOrder).append( geneSelect );
	
	var select = "";
	select += "<select id='collapseType-"+obj.config.dataOrder+"' class='collapseType'>";
	select += "<option value='full'>full</option>";
	select += "<option value='dense'>dense</option>";
	select += "</select>";
	
	$("#gene-select-"+obj.config.dataOrder).append($(select));
	
	$("#"+"collapseType-"+obj.config.dataOrder).change(function(){
//		alert($("#"+"collapseType-"+obj.config.dataOrder+" option:selected").val());
		obj.gene(  data, $("#"+"collapseType-"+obj.config.dataOrder+" option:selected").val() );
	});
	
	obj.gene(  data, $("#"+"collapseType-"+obj.config.dataOrder+" option:selected").val() );
};

HicHistogram.prototype.gene = function( data, drawingType ) {
	var obj = this;
	
	$("#geneCanvas-" + obj.config.dataOrder).remove();
	
	var geneDiv = $("#graph-frame-gene-"+obj.config.dataOrder);
	
	var graphDiv = $("#graph-frame-graph-"+obj.config.dataOrder);
	var arcDiv = $("#graph-frame-arc-"+obj.config.dataOrder);
	var enhancerDiv = $("#graph-frame-enhancer-"+obj.config.dataOrder);
	
    var geneCanvas = d3.select("#graph-frame-gene-"+obj.config.dataOrder)
    .append("svg")
    .attr("id", "geneCanvas-" + obj.config.dataOrder)
    .attr("y", graphDiv.height() + arcDiv.height() + enhancerDiv.height())
	.style("width" , geneDiv.width())
    .style("display", "block")///////////////////////////////////////////////////////
    .attr("viewBox","0 0 " + geneDiv.width() +" " + geneDiv.height() );
    
//	var dbNameLine = geneCanvas.append('line');
    
    var innerSvg = geneCanvas.append("svg")
    .attr("id", "geneDrawingCanvas")
    .attr("x", $("#peakBaseRect-"+obj.config.dataOrder).attr("x"))
    .attr("y", 0)
//    .attr("width", $("#peakBaseRect-"+obj.config.dataOrder).attr("width"))
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
//		dbNameLine.append('text')
//		.attr('text-anchor', 'end')
//		.attr("baseline-shift", "-75%")
//		.attr('font-size', '10px')
//		.attr('x', 150)
//		.attr('y', y )
//		.text(Object.keys(data)[dbTypeIndex]);
		
		dbName.text(Object.keys(data)[dbTypeIndex]);
		
		var height = this.drawGeneTracks( innerSvg, data, Object.keys(data)[dbTypeIndex], drawingType, y, rectHeight );

		if( dbTypeIndex == Object.keys(data).length-1 )		y += height;
		else {
			y += (height + prevGeneGroup_height);
			innerY += height;
		}
	}
	
	var totalHeight = y + geneGroup_bottomMargin;
	var InnertotalHeight = innerY + geneGroup_bottomMargin;

//	dbNameLine.attr('id', 'dbNameLine-' + obj.config.dataOrder)
//	.attr('x1', obj.xScale(data.Refseq[0][0].startPt))//150
//	.attr('y1', 0)
//	.attr('x2', obj.xScale(data.Refseq[0][0].startPt))//150
//	.attr('y2', totalHeight);

	if(drawingType=='full') {
		geneCanvas.attr("viewBox","0 0 " + geneDiv.width() +" " + totalHeight );
		geneCanvas.attr("height", totalHeight );
		innerSvg.attr("viewBox", $("#peakBaseRect-"+obj.config.dataOrder).attr("x") + " 0 " + geneDiv.width() +" " + totalHeight );
		innerSvg.attr("height", totalHeight );
	} else {
		geneCanvas.attr("viewBox","0 0 " + geneDiv.width() +" " + InnertotalHeight );
		geneCanvas.attr("height", InnertotalHeight );
		innerSvg.attr("viewBox", $("#peakBaseRect-"+obj.config.dataOrder).attr("x") + " 0 " + geneDiv.width() +" " + InnertotalHeight );
	}
	
};






//HicHistogram.prototype.gene_bak20161221 = function( data, drawingType ) {
//	var obj = this;
//	
//	$(".select").remove();
//	
////	var button = $("<input type='button' id='geneButton' value='dense' style='float:right;'>");
//	
//	var dropDown = "";
//	dropDown += "<div class='select' style='float:right;'>";
//	dropDown += "<a href='#'>full</a>";
//	dropDown += "<ul>";
//	dropDown += "<li>full</li>";
////	dropDown += "<li>packing</li>";
//	dropDown += "<li>dense</li>";
//	dropDown += "</ul>";
//	dropDown += "</div>";
//	
//	$('.geneTitleFrame').append($(dropDown));
//	
//	var geneCanvas = d3.select("#geneCanvas");
//	
//	var dbNameLine = geneCanvas.append('line');
//	
//	var geneGroup_topMargin = 10;
//	var geneGroup_bottomMargin = 10;
//	var prevGeneGroup_height = 15;
//
//	var rectHeight = 10;
//
//	var y = geneGroup_topMargin;
//	for( var dbTypeIndex=0; dbTypeIndex < Object.keys(data).length; dbTypeIndex++ ) {
//		dbNameLine.append('text')
//		.attr('text-anchor', 'end')
//		.attr("baseline-shift", "-75%")
//		.attr('font-size', '10px')
//		.attr('x', 150)
//		.attr('y', y )
//		.text(Object.keys(data)[dbTypeIndex]);
//		
//		var height = this.drawGeneTracks( geneCanvas, data, Object.keys(data)[dbTypeIndex], drawingType, y, rectHeight );
//
//		if( dbTypeIndex == Object.keys(data).length-1 ) y += height;
//		else											y += (height + prevGeneGroup_height);
//	}
//	
//	var totalHeight = y + geneGroup_bottomMargin;
//
//	dbNameLine.attr('id', 'dbNameLine')
//	.attr('x1', obj.xScale(data.Refseq[0][0].startPt))//150
//	.attr('y1', 0)
//	.attr('x2', obj.xScale(data.Refseq[0][0].startPt))//150
//	.attr('y2', totalHeight);
//	
////	console.log(obj.xScale(data.Refseq[0][0].startPt));
//
//	geneCanvas.attr("viewBox","0 0 " + $("#gene").width() +" " + totalHeight );
//	
////	$('#geneButton').on('click', function() {
////		$("#Refseq-gene-group").remove();
////		obj.gene(data, 'dense');
////	});
//	
//	$("div.select > a").click(function() {
//	    $(this).next("ul").toggle();
//	    return false;
//	});
//	 
//	$("div.select > ul > li").click(function() {
//	    $(this).parent().hide().parent("div.select").children("a").text($(this).text());
//	    $(this).prependTo($(this).parent());
//	    
//	    console.log($(this).text());
//		$("#Refseq-gene-group").remove();
//		obj.gene(data, $(this).text());
//	});
//};
//
//$(document).ready(function () {
//	$('.accordion-gene').slideDown(300);
//	
//	function gene_close_accordion_section() {
//		$('#geneAccordionTitle').removeClass('active');
//		$('#accordion-gene').slideUp(300).removeClass('open');
//	}
//	
//	$('.geneAccordionTitle').click(function(e) {
//	    // Grab current anchor value
//		var currentAttrValue = $(this).attr('href');
//	
//		if($(e.target).is('.active')) {	// 닫기
//			gene_close_accordion_section();
//		}else {							// 열기
//			gene_close_accordion_section();
//	
//			// Add active class to section title
//			$(this).addClass('active');
//			// Open up the hidden content panel
//			$('#accordion-gene').slideDown(300).addClass('open');
//		}
//		e.preventDefault();
//	});
//});
//
//
//
//
//HicHistogram.prototype.gene20161215 = function( data) {
//	var obj = this;
//	
//	var geneCanvas = d3.select("#geneCanvas");
//	
//	var geneGroup_topMargin = 10;
//	var geneGroup_bottomMargin = 10;
//	var y = 0;
//	var prevGeneGroup_height = 0;
//	
//	var geneLine_height = 10;
//	var geneLine_bottomMargin = 2;
//	
//	var rectHeight = 10;
//	
//	var idx = 0;
//
//	for( t in data ) {
//		y = y + geneGroup_topMargin + prevGeneGroup_height + geneGroup_bottomMargin;
//
//		this.drawGeneTracks( geneCanvas, data, t, 'dense', y );
//		
//		var geneGroup = geneCanvas.append('g').attr('id', t+'-gene-group');
//		
//		var denseButton = geneCanvas.append('rect')
//		.attr('id', t + 'button')
//		.attr('class', 'button')
//		.attr('x', 100)
//		.attr('y', y)
//		.attr('height', rectHeight)
//		.attr('width', 40)
//		.style('fill', 'gray')
//        .attr('stroke', 'black')
//        .style("cursor", "pointer");
//
//		for(i in data[t]) {
//			var geneGroupLine = geneGroup.append('g')
//			.attr('id', t+'-gene-line'+i);
//			
//			for(var k=0; k<data[t][i].length; k++) {
//				var geneRect= geneGroupLine.append('rect')
//				.attr('id', t+'-gene-rect'+i+'-data-'+k)
//				.attr('class', t+'_geneRect')
//				.attr('x', function(d){ return obj.xScale(parseInt(data[t][i][k].txStart));})
//				.attr('y', y + ((parseInt(i) * 12) + 10))
//				.attr('height', rectHeight)
//				.attr('width', function(d){ return obj.xScale(parseInt(data[t][i][k].txEnd)) - obj.xScale(parseInt(data[t][i][k].txStart));});
//				
//				var geneRectDense = geneGroupLine.append('rect')
//				.attr('id', t+'-gene-rect'+i+'-data-'+k)
//				.attr('class', t+'_geneRectDense')
//				.attr('x', function(d){ return obj.xScale(parseInt(data[t][i][k].txStart));})
//				.attr('y', y)
//				.attr('height', rectHeight)
//				.attr('width', function(d){ return obj.xScale(parseInt(data[t][i][k].txEnd)) - obj.xScale(parseInt(data[t][i][k].txStart));});
//				
//				if(obj.xScale(parseInt(data[t][i][k].txStart - data[t][i][k].scaledNameLength)) > 150) {
//					geneGroupLine.append('text') 
//					.attr('id', t+'-gene-text'+i+'-data-'+k)
//					.attr('class', t+'_geneText')
//					.text(data[t][i][k].name)
//					.attr('x', function(d){ return obj.xScale(parseInt(data[t][i][k].txStart))-2;})
//					.attr('y', y  + ((parseInt(i) * 12) + 10) + 9)
//					.attr('text-anchor', 'end')
//					.attr('font-size', '10px');
//				}
//				
//				$('.'+t+'_geneText').hide();
//				$('.'+t+'_geneRect').hide();
//				
//				if(t=="Refseq") {
//					geneRect.style('fill', 'red')
//	                .attr('stroke', 'black');
//					
//					geneRectDense.style('fill', 'red')
//	                .attr('stroke', 'black')
//	                ;
//				} else if(t=="Ensembl") {
//					geneRect.style('fill', 'green')
//	                .attr('stroke', 'black');
//					
//					geneRectDense.style('fill', 'green')
//	                .attr('stroke', 'black');
//				} else {
//					geneRect.style('fill', 'orange')
//	                .attr('stroke', 'black');
//					
//					geneRectDense.style('fill', 'orange')
//	                .attr('stroke', 'black');
//				}
//			}
//			var currentGeneGroup_height = geneLine_height + geneLine_bottomMargin;
//			prevGeneGroup_height = prevGeneGroup_height + currentGeneGroup_height;
////			console.log(prevGeneGroup_height);
//		}
//		
//		idx++;
//	}
//	
////	var viewBoxHeight = parseInt(geneGroup_topMargin + );
//	var viewBoxHeight = 80;
//	geneCanvas.attr("viewBox","0 0 " + $("#gene").width() +" " + viewBoxHeight );
//	
//	$('#Refseqbutton').on('click', function() {
//		if($('#Refseq-gene-group').hasClass('expaned')) {
//			$('#Refseq-gene-group').removeClass("expaned");
//			$('.Refseq_geneText').hide();
//			$('.Refseq_geneRect').hide();
//			$('.Refseq_geneRectDense').show();
//		} else {
//			$('#Refseq-gene-group').addClass("expaned");
//			$('.Refseq_geneText').show();
//			$('.Refseq_geneRect').show();
//			$('.Refseq_geneRectDense').hide();
//			
////			geneCanvas.attr("viewBox","0 0 " + $("#gene").width() +" " + $('#Refseq-gene-group').height() );
//		}
//	});
//	
//	$('#UCSCbutton').on('click', function() {
//		if($('#UCSC-gene-group').hasClass('expaned')) {
//			$('#UCSC-gene-group').removeClass("expaned");
//			$('.UCSC_geneText').hide();
//			$('.UCSC_geneRect').hide();
//			$('.UCSC_geneRectDense').show();
//			
////			$('#Refseqbutton').attr('y', )
//		} else {
//			$('#UCSC-gene-group').addClass("expaned");
//			$('.UCSC_geneText').show();
//			$('.UCSC_geneRect').show();
//			$('.UCSC_geneRectDense').hide();
//		}
//	});
//	
//	$('#Ensemblbutton').on('click', function() {
//		if($('#Ensembl-gene-group').hasClass('expaned')) {
//			$('#Ensembl-gene-group').removeClass("expaned");
//			$('.Ensembl_geneText').hide();
//			$('.Ensembl_geneRect').hide();
//			$('.Ensembl_geneRectDense').show();
//		} else {
//			$('#Ensembl-gene-group').addClass("expaned");
//			$('.Ensembl_geneText').show();
//			$('.Ensembl_geneRect').show();
//			$('.Ensembl_geneRectDense').hide();
//		}
//	});
//	
//	
//	
//	geneCanvas.append('line')
//	.attr('x1', 150)
//	.attr('y1', 0)
//	.attr('x2', 150)
//	.attr('y2', viewBoxHeight)
//	.attr('stroke', 'black');
//};
//
//HicHistogram.prototype.geneDense = function(data) {
//	
//}
//
//// HTML5로 그림
//HicHistogram.prototype.gene2 = function( data) {
//	var obj = this;
//	
//	var canvas = null;
//	for(t in data) {
//		if(t=="Refseq") {
//			canvas = document.getElementById("refseqCanvas");
//			canvas.height = parseInt(Object.keys(data.Refseq).length) * (10 + 1);
//		} else if(t=="Ensembl") {
//			canvas = document.getElementById("ensemblCanvas");
//			canvas.height = parseInt(Object.keys(data.Ensembl).length) * (10 + 1);
//		} else {
//			canvas = document.getElementById("ucscCanvas");
//			canvas.height = parseInt(Object.keys(data.UCSC).length) * (10 + 1);
//		}
//		
//		if (canvas.getContext) {
//			
//			var ctx = canvas.getContext('2d');
//			ctx.clearRect(0, 0, canvas.width, canvas.height);
//			
//				for(i in data[t]) {
//					for(var k=0; k<data[t][i].length; k++) {
//						var start = obj.xScale(parseInt(data[t][i][k].txStart));
//						var end = obj.xScale(parseInt(data[t][i][k].txEnd));
//						
//						var width = end-start;
//		//				console.log(start + " " + end + " " + width);
//						var y = (i+1)*2;
//						
//						var textStart = obj.xScale(parseInt(data[t][i][k].txStart) - parseInt(data[t][i][k].scaledNameLength));
//		//				var textStart = parseInt(data[i][k].nameLength) * 2;
//						
//						ctx.fillStyle = "rgb(0, 0, 0)";
//						ctx.font="10px";
//		//				ctx.font="10px Georgia";
////						ctx.fillText(data[t][i][k].name, textStart, y+10);
//						//context.fillText(text,x,y,maxWidth);
//						
//						// 빨간 사각형
//						if(t=="Refseq")			ctx.fillStyle = "red";
//						else if(t=="Ensembl")	ctx.fillStyle = "green";
//						else					ctx.fillStyle = "orange";
//						ctx.strokeStyle = "rgb(255, 0, 0)";
//						ctx.fillRect(start, y, width, 10);
//						// 채우기 없는, 선만 있는 사각형
//						
//		//				ctx.strokeRect(start, y, width, 10);
//						//context.fillRect(x,y,width,height);
//						
//						//중복라인 처리!!
//					}
//				}
//		}
//		else alert('canvas를 지원하지 않는 브라우저입니다.');
//	}
//};
