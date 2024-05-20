'use strict'

var GeneViewer = function(config){
	this.config = config;

	if( this.config.MARGIN == undefined ) 				this.config.MARGIN = 0;
	if( this.config.X_MARGIN == undefined ) 			this.config.X_MARGIN = 150;
	if( this.config.GENE_LABEL_MARGIN == undefined )	this.config.GENE_LABEL_MARGIN = 5;
	if( this.config.GENE_TRACK_HEIGHT == undefined )	this.config.GENE_TRACK_HEIGHT = 25;
	if( this.config.data.currentStart == undefined )	this.config.data.currentStart = this.config.data.start;
	if( this.config.data.currentEnd == undefined )		this.config.data.currentEnd = this.config.data.end;
	
	this.tracks = [];
	
	this.init();
};

GeneViewer.prototype.init = function() {
	var obj = this;

	$(".canvas-frame").append("<div class='row w-100'><canvas id='"+this.config.container+"'></canvas></div>");

	this.canvas = document.getElementById( this.config.container );

	this.canvas.width = $(".canvas-frame").width();

	this.xScale = d3.scaleLinear()
    .domain([this.config.data.currentStart, this.config.data.currentEnd])
    .range([ this.config.X_MARGIN, this.canvas.width - this.config.X_MARGIN ]);

	$.ajax({
		type: 'post',
		url: 'getArcViewerGeneData',
		dataType: 'json',
		data: {bait : obj.config.data.bait, chrom: obj.config.data.chrom, boundary: obj.config.boundary},
		success:function(jData) {
			obj.config.data.genes = jData;
			
			obj.draw();
			
//			var ctx = obj.canvas.getContext('2d');
//			
//			ctx.font = "13px Arial";
//			ctx.fillText('Gene', obj.config.X_MARGIN/2 , obj.canvas.height/2);

		}
	});
};

GeneViewer.prototype.resize = function() {
	this.canvas.width = $(".canvas-frame").width();

	this.xScale = d3.scaleLinear()
    .domain([this.config.data.currentStart, this.config.data.currentEnd])
    .range([ this.config.X_MARGIN, this.canvas.width - this.config.X_MARGIN ]);

	this.draw();
};

GeneViewer.prototype.computeGeneStructures = function( ctx ){
	var layerMap = {};
	if( this.config.data.genes != undefined ) {
		var x = this.xScale( this.config.data.currentStart );
		var y = this.config.MARGIN;
		var width = (this.xScale(this.config.data.currentEnd) - this.xScale(this.config.data.currentStart));

		for( var i=0; i<this.config.data.genes.length; i++) {
			var gene = this.config.data.genes[i];
			
			var geneLeftX1 = this.xScale( d3.min( gene.exons.map(function(d){ return d.start; }) ) );
			var geneRightX2 = this.xScale( d3.max( gene.exons.map(function(d){ return d.end;}) ) );
			
			if( geneLeftX1 < this.xScale(this.config.data.currentStart) )	geneLeftX1 = this.xScale(this.config.data.currentStart);
			if( geneRightX2 > this.xScale(this.config.data.currentEnd) )	geneRightX2 = this.xScale(this.config.data.currentEnd);

			var textLabelWidth = ctx.measureText( gene.name ).width;

			var geneDrawObj = {
					label:gene.name
					, x1:geneLeftX1
					, x2:geneRightX2
					, label_x1:(geneRightX2 + this.config.GENE_LABEL_MARGIN)
					, label_x2:(geneRightX2 + textLabelWidth + this.config.GENE_LABEL_MARGIN + 20)
					, exons:gene.exons
					, strand:gene.strand
					, cdsStart:this.xScale(gene.cdsStart)
					, cdsEnd:this.xScale(gene.cdsEnd)
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

GeneViewer.prototype.draw = function() {
	if (this.canvas.getContext && this.config.data.genes != undefined ) {
		var ctx = this.canvas.getContext('2d');
				
		ctx.imageSmoothingEnabled = true;

		var layerMap = this.computeGeneStructures( ctx );
		
		var height = (this.config.GENE_TRACK_HEIGHT * Object.keys(layerMap).length) + 24 + 10;

		this.canvas.height = height;

		var y = 24;
		
		var lBound = this.xScale( this.config.data.currentStart );
		var rBound = this.xScale( this.config.data.currentEnd );
		
		
		// track title
		ctx.roundRect( 30, this.canvas.height/2 , 55, 20, 20);
		ctx.fillStyle = 'rgb(220, 53, 69)';
		ctx.fill();
		ctx.fillStyle = "#fff";
		ctx.font = '12px Arial';
		ctx.fillText('Refseq', 38, this.canvas.height/2 + 13);
		ctx.font = "9px Arial";
		
		var layers = Object.keys(layerMap);
		for( var i=0; i<layers.length; i++) {
			var geneDrawObjs = layerMap[ layers[i] ];
			
			var yPos = y + (parseInt(layers[i]) * this.config.GENE_TRACK_HEIGHT);

			for( var j=0; j<geneDrawObjs.length; j++) {
				var x1 = geneDrawObjs[j].x1;
				var x2 = geneDrawObjs[j].x2;
				
				// To fit in view rectangle
				if( x1 - lBound < 0 ) x1 = lBound;
				if( x2 - lBound < 0 ) continue;

				if( rBound - x1 < 0 ) continue;
				if( rBound - x2 < 0 ) x2 = rBound;

				ctx.strokeStyle='green';
				ctx.beginPath();
				ctx.moveTo(x1, yPos, x1, yPos);
				ctx.lineTo(x2, yPos, x2, yPos);
				ctx.stroke();

				var cdsStart = geneDrawObjs[j].cdsStart;
				var cdsEnd = geneDrawObjs[j].cdsEnd;
				if( cdsStart < x1 )	cdsStart = x1;
				if( cdsStart > x2 )	cdsStart = x2;
				if( cdsEnd > x2 )	cdsEnd = x2;
				if( cdsStart < x1 )	cdsEnd = x1;
				
				ctx.fillStyle='rgba(173, 125, 21, 0.7)';
				ctx.beginPath();
				ctx.moveTo(cdsStart,	yPos-2, cdsStart,	yPos-2);
				ctx.lineTo(cdsEnd,		yPos-2, cdsEnd,		yPos-2);
				ctx.lineTo(cdsEnd,		yPos+2, cdsEnd,		yPos+2);
				ctx.lineTo(cdsStart,	yPos+2, cdsStart,	yPos+2);
				ctx.fill();

				
				ctx.fillStyle='black';
				ctx.beginPath();
				ctx.moveTo(x1, yPos-5, x1, yPos-5);
				ctx.lineTo(x1, yPos+5, x1, yPos+5);
				ctx.stroke();
			
				
				ctx.beginPath();
				ctx.moveTo(x2, yPos-5, x2, yPos-5);
				ctx.lineTo(x2, yPos+5, x2, yPos+5);
				ctx.stroke();
				
				ctx.textAlign = "left";
				ctx.textBaseline = "middle";
				ctx.fillText( geneDrawObjs[j].label, geneDrawObjs[j].label_x1, yPos );
				
				var directionArrowInterval = parseInt((x2-x1) / 10);
				if(directionArrowInterval == 0)	directionArrowInterval = 1;
				
				for(var k=(x1 + directionArrowInterval); k<=x2; k+=directionArrowInterval) {
					ctx.beginPath()
					if( geneDrawObjs[j].strand == '+' ) {
						ctx.moveTo(k-5, yPos-3);
						ctx.lineTo(k, yPos);
						ctx.lineTo(k-5, yPos+3);
					}else {
						ctx.moveTo(k+5, yPos-3);
						ctx.lineTo(k, yPos);
						ctx.lineTo(k+5, yPos+3);
					}
					ctx.stroke();
				}
			}
		}
	}
};

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  
  return this;
}

GeneViewer.prototype.clear = function() {
	var ctx = this.canvas.getContext('2d');
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

GeneViewer.prototype.initXscaler = function(currentStart, currentEnd) {
	this.config.data.currentStart = currentStart;
	this.config.data.currentEnd = currentEnd;

	this.xScale = d3.scaleLinear()
    .domain([this.config.data.currentStart, this.config.data.currentEnd])
    .range([ this.config.X_MARGIN, this.canvas.width - this.config.X_MARGIN ]);
}