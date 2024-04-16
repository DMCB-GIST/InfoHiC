'use strict'
//var smx = -1;
//var emx = -1;

var ChimerArcViewer = function(config){
	this.config = config;
	
	if( this.config.MARGIN == undefined ) 							this.config.MARGIN = 0;
	if( this.config.X_MARGIN == undefined ) 						this.config.X_MARGIN = 150;
	if( this.config.RANGE_BAR_HEIGHT == undefined )					this.config.RANGE_BAR_HEIGHT = 30;
	if( this.config.GENOMIC_RULER_HEIGHT == undefined )				this.config.GENOMIC_RULER_HEIGHT = 40;
	if( this.config.INTERACTION_PEAK_CURVE_HEIGHT == undefined )	this.config.INTERACTION_PEAK_CURVE_HEIGHT = 50;
	if( this.config.INTERACTION_ARC_CURVE_HEIGHT == undefined )		this.config.INTERACTION_ARC_CURVE_HEIGHT = 100;
	if( this.config.data.currentStart == undefined )				this.config.data.currentStart = this.config.data.start;
	if( this.config.data.currentEnd == undefined )					this.config.data.currentEnd = this.config.data.end;
//	if( this.config.data.cutoff == undefined )						this.config.data.cutoff = 0.01;
	if( this.config.data.cutoff == undefined )						this.config.data.cutoff = 2;
	if( this.config.isDisplayPoInteraction == undefined )			this.config.isDisplayPoInteraction = true;
	if( this.config.barDataType == undefined )						this.config.barDataType = 'normalized';

	this.arcToggleIdx = -1;

	this.promoters = [];
	this.tracks = [];

	this.init();
};

ChimerArcViewer.prototype.init = function() {
	$(".ArcInfoDialog").draggable();
	$(".ArcInfoDialog > div.toast-header > button.close").on('click', function(){
		$(".ArcInfoDialog").addClass("invisible");
	});

	$(".canvas-frame").append("<div class='row w-100'><canvas id='"+this.config.container+"'></div>");

	this.canvas = document.getElementById( this.config.container );

	this.canvas.width = $(".canvas-frame").width();
	if( this.config.type == "header" ) 		this.canvas.height = this.config.RANGE_BAR_HEIGHT + this.config.GENOMIC_RULER_HEIGHT;
	else if( this.config.type == "data")	this.canvas.height = this.config.INTERACTION_PEAK_CURVE_HEIGHT + this.config.INTERACTION_ARC_CURVE_HEIGHT;

	this.xScale = d3.scaleLinear()
    .domain([this.config.data.currentStart, this.config.data.currentEnd])
    .range([ this.config.X_MARGIN, this.canvas.width - this.config.X_MARGIN ]);
	
	var obj = this;
	this.canvas.onmousedown = function(e) {
		obj.config.controller.smx = e.offsetX;
		obj.config.controller.my = e.offsetY;

		if( obj.config.type == "header" ) {
//			if( obj.config.controller.my >= obj.tracks['ruler'].y && obj.config.controller.my <= obj.tracks['ruler'].y + obj.tracks['ruler'].height ) 	obj.config.controller.smx = e.offsetX;
//			else 																																		obj.config.controller.smx = -1;
			
			obj.config.controller.isZoominDrag = true;
			obj.config.controller.isPanningDrag = false;
		}else if( obj.config.type == "data" ) {
			obj.config.controller.isZoominDrag = false;
			obj.config.controller.isPanningDrag = true;
			
			var mX = e.offsetX;
			var mY = e.offsetY;
			
			obj.arcToggleIdx = -1;
			for(var i=0; i<obj.promoters.length; i++) {
				if( obj.promoters[i].x1 <= mX && obj.promoters[i].x2 >= mX && obj.promoters[i].y1 <= mY && obj.promoters[i].y2 >= mY ) {
					obj.arcToggleIdx = i;
					break;
				}
			}
		}
	};
	this.canvas.onmousemove = function(e) {
		obj.config.controller.emx = e.offsetX;
	
		if( obj.config.controller.smx < obj.xScale(obj.config.data.currentStart) )			obj.config.controller.smx = obj.xScale(obj.config.data.currentStart);
		else if( obj.config.controller.smx > obj.xScale(obj.config.data.currentEnd) )		obj.config.controller.smx = obj.xScale(obj.config.data.currentEnd);
		
		if( obj.config.controller.emx > obj.xScale(obj.config.data.currentEnd) )			obj.config.controller.emx = obj.xScale(obj.config.data.currentEnd);
		else if( obj.config.controller.emx < obj.xScale(obj.config.data.currentStart) )		obj.config.controller.emx = obj.xScale(obj.config.data.currentStart);
	
		if( e.buttons == 1 ) {
			var ctx = obj.canvas.getContext('2d');
			if( obj.config.controller.isZoominDrag == true ) { //dragged with left mouse button
				obj.clear();
				obj.draw();
	
				if( obj.config.type == "header" ) {
					ctx.fillStyle = 'rgba(183, 255, 0, 0.5)';
					ctx.beginPath();
					ctx.fillRect(obj.config.controller.smx, obj.tracks['ruler'].y, (obj.config.controller.emx-obj.config.controller.smx), obj.tracks['ruler'].height);
					ctx.fill();
				}
		    }else if( obj.config.controller.isPanningDrag == true ) {
		    	obj.clear();
				obj.draw();

				var nCurrentStart = parseInt( obj.xScale.invert( obj.config.controller.smx ) );
				var nCurrentEnd = parseInt( obj.xScale.invert( obj.config.controller.emx ) );
				
				var diff = parseInt( Math.max(nCurrentStart, nCurrentEnd) - Math.min(nCurrentStart, nCurrentEnd) + 1 );

				ctx.fillStyle='black';
				ctx.strokeStyle='black';
				ctx.textBaseline = "middle";
				ctx.beginPath();
				ctx.moveTo(obj.config.controller.smx, obj.config.controller.my);
				ctx.lineTo(obj.config.controller.emx, obj.config.controller.my);
				if( obj.config.controller.smx < obj.config.controller.emx )	{
					ctx.lineTo(obj.config.controller.emx-7, obj.config.controller.my-2)
					ctx.lineTo(obj.config.controller.emx-7, obj.config.controller.my+2)
					ctx.lineTo(obj.config.controller.emx, obj.config.controller.my);
					
					ctx.textAlign = "left";
					ctx.fillText( comma(diff.toFixed(0)) + "bp", obj.config.controller.emx, obj.config.controller.my + 2 );
				} else {
					ctx.lineTo(obj.config.controller.emx+7, obj.config.controller.my-2)
					ctx.lineTo(obj.config.controller.emx+7, obj.config.controller.my+2)
					ctx.lineTo(obj.config.controller.emx, obj.config.controller.my);

					ctx.textAlign = "right";
					ctx.fillText( comma(diff.toFixed(0)) + "bp", obj.config.controller.emx, obj.config.controller.my - 2 );
				}
				ctx.stroke();
				ctx.fill();
			}
		}else {
			var mX = e.offsetX;
			var mY = e.offsetY;

			if( obj.config.type == "header" ) {
				$(obj.canvas).css("cursor", "pointer");
			}else if( obj.config.type == "data" ) {
				var isHover = false;
				for(var i=0; i<obj.promoters.length; i++) {
					if( obj.promoters[i].x1 <= mX && obj.promoters[i].x2 >= mX && obj.promoters[i].y1 <= mY && obj.promoters[i].y2 >= mY ) {
						isHover = true;
						break;
					}
				}
	
				if( isHover ) {
					$(obj.canvas).css("cursor", "pointer");
				}else {
					$(obj.canvas).css("cursor", "auto");
				}
			}
		}
	}

	this.canvas.onmouseup = function(e) {
		if( obj.config.controller.isZoominDrag == true ) {
			var nCurrentStart = parseInt( obj.xScale.invert( obj.config.controller.smx ) );
			var nCurrentEnd = parseInt( obj.xScale.invert( obj.config.controller.emx ) );

			var OFFSET = 5;
			if( (Math.max(nCurrentStart, nCurrentEnd) - Math.min(nCurrentStart, nCurrentEnd)) > OFFSET ) {
				obj.redraw( Math.min(nCurrentStart, nCurrentEnd), Math.max(nCurrentStart, nCurrentEnd) );
			}else {
				alert("Too small area! please drag widely");
			}
		}else if( obj.config.controller.isPanningDrag == true ) {
			var nCurrentStart = parseInt( obj.xScale.invert( obj.config.controller.smx ) );
			var nCurrentEnd = parseInt( obj.xScale.invert( obj.config.controller.emx ) );
			
			var direction = obj.config.controller.smx > obj.config.controller.emx?'upstream':'downstream';
			var diff = Math.max(nCurrentStart, nCurrentEnd) - Math.min(nCurrentStart, nCurrentEnd) + 1;
			var range = obj.config.data.currentEnd - obj.config.data.currentStart;
	
			var nLBoundary = obj.config.data.currentStart + diff;
			var nRBoundary = obj.config.data.currentEnd + diff;
			if( direction == "downstream" ) {
				nLBoundary = obj.config.data.currentStart - diff;
				nRBoundary = obj.config.data.currentEnd - diff;
			}

			obj.clear();
			obj.draw();

			if( nLBoundary < obj.config.data.start ) {
				nLBoundary = obj.config.data.start;
				nRBoundary = obj.config.data.start + range;
			}else if( nRBoundary > obj.config.data.end ) {
				nLBoundary = obj.config.data.end - range;
				nRBoundary = obj.config.data.end;
			}

			obj.redraw( nLBoundary, nRBoundary  );
		}
		
		if( obj.arcToggleIdx != -1 ) {
			var mX = e.pageX;
			var mY = e.pageY;

			obj.config.controller.selPromoter = {x1:obj.promoters[obj.arcToggleIdx].x1, x2:obj.promoters[obj.arcToggleIdx].x2};
			
			$.ajax({
				type:'post',
				url:'get_gene_hg19',
				data:{chrom:obj.promoters[obj.arcToggleIdx].chrom, startPt:obj.promoters[obj.arcToggleIdx].frag_pos1, endPt: obj.promoters[obj.arcToggleIdx].frag_pos2},
				success:function(data){
					$("#target-gene-list tbody").empty();

					var TargetGeneList = JSON.parse(data);

					if(TargetGeneList.length != 0){
						for(var j=0; j<TargetGeneList.length; j++){
							var tableContents = "<tr class='targetGene-"+j+"'><td scope='row'>"+TargetGeneList[j].num+"</td><td>"+TargetGeneList[j].chrom+"</td><td>"+comma(TargetGeneList[j].txStart)+"</td><td>"+comma(TargetGeneList[j].txEnd)+"</td><td>"+TargetGeneList[j].name+"</td><td>"+TargetGeneList[j].locus+"</td></tr>";
							$("#target-gene-list tbody").append(tableContents);
						}
					}
					else{
						var tableContents = "<tr class='targetGene-0'><td scope='row' colspan='6'>There are no genes in this area.</td></tr>";
						$("#target-gene-list tbody").append(tableContents);
					}	
				}
			});

			var nX = (mX - $(".ArcInfoDialog").width()/2);
			$(".ArcInfoDialog").css("top", mY);
			$(".ArcInfoDialog").css("left", nX);
			$(".ArcInfoDialog").removeClass("invisible");
		}else {
			$(".ArcInfoDialog").addClass("invisible");
			
			obj.config.controller.selPromoter = {x1:-1, x2:-1};
		}

		obj.config.controller.smx = -1;
		obj.config.controller.emx = -1;
		obj.config.controller.my = -1;
		obj.config.controller.isZoominDrag = false;
		obj.config.controller.isPanningDrag = false;
	};
};

ChimerArcViewer.prototype.resize = function() {
	this.canvas.width = $(".canvas-frame").width();

	this.xScale = d3.scaleLinear()
    .domain([this.config.data.currentStart, this.config.data.currentEnd])
    .range([ this.config.X_MARGIN, this.canvas.width - this.config.X_MARGIN ]);

	this.draw();
};

ChimerArcViewer.prototype.draw = function() {
	if (this.canvas.getContext) {
		var ctx = this.canvas.getContext('2d');
		ctx.imageSmoothingEnabled = true;

		ctx.font = "12px Arial";

		var x = this.xScale( this.config.data.currentStart );
		var y = this.config.MARGIN;
		var width = (this.xScale(this.config.data.currentEnd) - this.xScale(this.config.data.currentStart));
		var height = this.config.INTERACTION_PEAK_CURVE_HEIGHT + this.config.INTERACTION_ARC_CURVE_HEIGHT;

		ctx.strokeStyle='rgba(10, 10, 10, 0.5)';
		if( this.config.type == "data") {
			ctx.beginPath();
			if( this.config.ord==0 ) {
				ctx.moveTo(x, y+height);
				ctx.lineTo(x, y);
				ctx.lineTo(x+width, y);
				ctx.lineTo(x+width, y+height);
			}else if( this.config.ord == this.config.n_samples-1 ) {
				ctx.moveTo(x, y);
				ctx.lineTo(x, y+height-1);
				ctx.lineTo(x+width, y+height-1);
				ctx.lineTo(x+width, y);
			}else if( this.config.ord > 0 && this.config.ord < this.config.n_samples ){
				ctx.moveTo(x, y);
				ctx.lineTo(x, y+height);
				ctx.moveTo(x+width, y);
				ctx.lineTo(x+width, y+height);
			}
			ctx.stroke();
		}
		
		if( this.config.type == "header" ) {
			this.drawGenomicRange( ctx );
			this.drawGenomicRuler( ctx );
		}else {
			this.promoters = [];

			this.drawInteractionCurve( ctx );
			this.drawSrcPromoterSite(ctx);
			this.drawArcs(ctx);
		}
	}
};

ChimerArcViewer.prototype.getArcType = function( bait, tarX1, tarX2, lBound, rBound  ) {
	if( Math.max(tarX1, tarX2) < bait ) {
		if( bait >= lBound && bait <= rBound ) {
			if( Math.max(tarX1, tarX2) < lBound ) {
				return {type:1, x1:bait, x2:lBound, canDraw:true, arcType:'leftArc'};
			}else if( Math.min(tarX1, tarX2) > lBound ) {
				return {type:2, x1:bait, x2:Math.max(tarX1, tarX2), canDraw:true, arcType:'leftArc'};
			}else if( Math.min(tarX1, tarX2) < lBound && Math.max(tarX1, tarX2) > lBound ) {
				return {type:3, x1:bait, x2:Math.max(tarX1, tarX2), canDraw:true, arcType:'leftArc'};
			}else {
				console.log("What1 : " + bait + "  " + tarX1 + "-" + tarX2 + "  (" + lBound + ", " + rBound + ")");
			}
		}else if( bait < lBound ) {
			return {type:4, x1:-1, x2:-1, canDraw:false, arcType:'none'};
		}else if( bait > rBound ) {
			if( Math.min(tarX1, tarX2) > lBound && Math.max(tarX1, tarX2) < rBound ) {
				return {type:5, x1:rBound, x2:Math.max(tarX1, tarX2), canDraw:true, arcType:'leftArc'};
			}else if( Math.min(tarX1, tarX2) > lBound && Math.min(tarX1, tarX2) < rBound && Math.max(tarX1, tarX2) > rBound ) {
				return {type:6, x1:rBound, x2:Math.min(tarX1, tarX2), canDraw:true, arcType:'leftArc'};
			}else if( Math.min(tarX1, tarX2) > rBound && Math.max(tarX1, tarX2) > rBound ) {
				return {type:7, x1:-1, x2:-1, canDraw:false, arcType:'none'};
			}else if( Math.min(tarX1, tarX2) < lBound && Math.max(tarX1, tarX2) > lBound && Math.max(tarX1, tarX2) < rBound ) {
				return {type:8, x1:rBound, x2:Math.max(tarX1, tarX2), canDraw:true, arcType:'leftArc'};
			}else if( Math.min(tarX1, tarX2) < lBound && Math.max(tarX1, tarX2) < lBound ) {
				return {type:9, x1:lBound, x2:rBound, canDraw:true, arcType:'leftArc'};
			}else {
				console.log("What2 : " + bait + "  " + tarX1 + "-" + tarX2 + "  (" + lBound + ", " + rBound + ")");
			}
		}else {
			console.log("What3 : " + bait + "  " + tarX1 + "-" + tarX2 + "  (" + lBound + ", " + rBound + ")");
		}
	}else{
		if( bait >= lBound && bait <= rBound ) {
			if( Math.min(tarX1, tarX2) > rBound ) {
				return {type:10, x1:bait, x2:rBound, canDraw:true, arcType:'rightArc'};
			}else if( Math.max(tarX1, tarX2) < rBound ) {
				return {type:11, x1:bait, x2:Math.min(tarX1, tarX2), canDraw:true, arcType:'rightArc'};
			}else if( Math.min(tarX1, tarX2) < rBound && Math.max(tarX1, tarX2) > rBound ) {
				return {type:12, x1:bait, x2:Math.min(tarX1, tarX2), canDraw:true, arcType:'rightArc'};
			}else {
				console.log("What4 : " + bait + "  " + tarX1 + "-" + tarX2 + "  (" + lBound + ", " + rBound + ")");
			}
		}else if( bait > rBound ) {
			return {type:13, x1:-1, x2:-1, canDraw:false, arcType:'none'};
		}else if( bait < lBound ) {
			if( Math.min(tarX1, tarX2) > lBound && Math.max(tarX1, tarX2) < rBound ) {
				return {type:14, x1:lBound, x2:Math.min(tarX1, tarX2), canDraw:true, arcType:'rightArc'};
			}else if( Math.min(tarX1, tarX2) < lBound && Math.max(tarX1, tarX2) > lBound && Math.max(tarX1, tarX2) < rBound ) {
				return {type:15, x1:lBound, x2:Math.max(tarX1, tarX2), canDraw:true, arcType:'rightArc'};
			}else if( Math.max(tarX1, tarX2) < lBound ) {
				return {type:16, x1:-1, x2:-1, canDraw:false, arcType:'none'};
			}else if( Math.min(tarX1, tarX2) < rBound && Math.max(tarX1, tarX2) > rBound ) {
				return {type:17, x1:lBound, x2:Math.max(tarX1, tarX2), canDraw:false, arcType:'rightArc'};
			}else if( Math.min(tarX1, tarX2) > rBound ) {
				return {type:18, x1:lBound, x2:rBound, canDraw:false, arcType:'rightArc'};
			}else {
				console.log("What5 : " + bait + "  " + tarX1 + "-" + tarX2 + "  (" + lBound + ", " + rBound + ")");
			}
		}else {
			console.log("What6 : " + bait + "  " + tarX1 + "-" + tarX2 + "  (" + lBound + ", " + rBound + ")");
		}
	}
}

ChimerArcViewer.prototype.drawArcs = function( ctx ) {
	var d2 = this.config.data.data;
	
	var y = this.config.MARGIN + this.config.INTERACTION_PEAK_CURVE_HEIGHT;
	
	ctx.strokeStyle='rgba(0, 0, 255, 0.2)';

	var lBound = this.xScale( this.config.data.currentStart );
	var rBound = this.xScale( this.config.data.currentEnd );

	var srcX1 = this.xScale( this.config.data.bait );

	for(var i=0; i<d2.length; i++) {
		if( this.config.isDisplayPoInteraction != true ){
			if( d2[i].promoter_yn != 1 )	{
				continue;
			}
		}

//		if( d2[i].pvalue < -Math.log10(this.config.data.cutoff) ) continue;
		if( d2[i].pvalue < this.config.data.cutoff ) continue;

		var tarX1 = this.xScale( d2[i].bin2_s );
		var tarX2 = this.xScale( d2[i].bin2_e );
		
		var drawObj = this.getArcType( srcX1, tarX1, tarX2, lBound, rBound );

		if( drawObj != undefined && drawObj.canDraw == true ) {
			if( d2[i].promoter_yn == 1 ) 	ctx.strokeStyle='rgba(186, 28, 147, 0.8)';			// Promoter area interaction
			else							ctx.strokeStyle='rgba(186, 186, 186, 0.8)';		// Non-promoter area interaction

			var arcGap = Math.abs( drawObj.x1 - drawObj.x2 );
			var OFFSET = Math.log2( arcGap );
	
			var alpha = OFFSET / Math.log2(rBound - lBound);
	
			var curvePoint = drawObj.x1 - ((arcGap/3) * (1-alpha));
			if( drawObj.arcType == 'rightArc' ) curvePoint = drawObj.x1 + ((arcGap/3) * (1-alpha));
			
			ctx.beginPath();
			ctx.moveTo( drawObj.x1, y);
			ctx.quadraticCurveTo( curvePoint, y + ((this.config.INTERACTION_ARC_CURVE_HEIGHT * 1.5) * alpha), drawObj.x2, y);
			ctx.stroke();

			ctx.fillStyle='rgba(255, 102, 0, 0.5)';
			
			// To fit in view rectangle
			if( tarX1 - lBound < 0 ) tarX1 = lBound;
			if( tarX2 - lBound < 0 ) continue;
			
			if( rBound - tarX1 < 0 ) continue;
			if( rBound - tarX2 < 0 ) tarX2 = rBound;
			this.promoters.push( {x1:tarX1, y1:y, x2:tarX2, y2:y+10, frag_pos1:d2[i].bin2_s, frag_pos2:d2[i].bin2_e, chrom:this.config.data.chrom, sample:this.config.title} );
			ctx.fillRect( tarX1, y, tarX2 - tarX1, 10 );
		}
	}
};

ChimerArcViewer.prototype.drawSrcPromoterSite = function( ctx ) {
	var x1 = this.xScale( this.config.data.promoter_start );
	var x2 = this.xScale( this.config.data.promoter_end );
	var y1 = this.config.MARGIN;
	var y2 = y1 + this.config.INTERACTION_PEAK_CURVE_HEIGHT + this.config.INTERACTION_ARC_CURVE_HEIGHT;
	
	var lBound = this.xScale( this.config.data.currentStart );
	var rBound = this.xScale( this.config.data.currentEnd );

	if( x1 - lBound < 0 ) x1 = lBound;
	if( x2 - lBound < 0 ) return;
	if( rBound - x1 < 0 ) return;
	if( rBound - x2 < 0 ) x2 = rBound;
	
//	ctx.fillStyle='rgba(255, 0, 0, 0.4)';
	ctx.fillStyle='rgba(105, 141, 209, 0.6)';
	ctx.beginPath()
	ctx.moveTo(x1, y1);
	ctx.lineTo(x1, y2);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x2, y1);
	ctx.fill();
};

ChimerArcViewer.prototype.drawBait = function( ctx ) {
	var x = this.xScale( this.config.data.bait );
	var y1 = this.config.MARGIN;
	var y2 = y1 + this.config.INTERACTION_PEAK_CURVE_HEIGHT;

	ctx.fillStyle='rgba(255, 0, 0, 0.4)';
	ctx.beginPath()
	ctx.moveTo(x, y1);
	ctx.lineTo(x-2, y1+5);
	ctx.lineTo(x-2, y2-5);
	ctx.lineTo(x, y2);
	ctx.lineTo(x+2, y2-5);
	ctx.lineTo(x+2, y1+5);
	ctx.moveTo(x, y1);
	ctx.fill();
};

ChimerArcViewer.prototype.drawInteractionCurve = function( ctx ) {
	var x = this.xScale( this.config.data.currentStart );
	var y = this.config.MARGIN;
	var width = (this.xScale(this.config.data.currentEnd) - this.xScale(this.config.data.currentStart));
	var height = this.config.INTERACTION_PEAK_CURVE_HEIGHT + this.config.INTERACTION_ARC_CURVE_HEIGHT;

	ctx.fillStyle='black';
	ctx.strokeStyle='black';
	ctx.textBaseline = "middle";
	ctx.textAlign = "right";
	ctx.fillText( this.config.title, this.config.X_MARGIN-5, y + this.config.INTERACTION_PEAK_CURVE_HEIGHT );

	var d2 = this.config.data.data;
	var maxVal = d3.max( d2.map(function(d){return d.all_capture_res;}) );
	var minVal = d3.min( d2.map(function(d){return d.all_capture_res;}) );
	
	var maxRawVal = d3.max( d2.map(function(d){return d.freq;}) );
	var minRawVal = d3.min( d2.map(function(d){return d.freq;}) );
	
//	var maxVal = d3.max( d2.map(function(d){return d.smoothed_all_capture_res;}) );
//	var minVal = d3.min( d2.map(function(d){return d.smoothed_all_capture_res;}) );
//	
//	var maxRawVal = d3.max( d2.map(function(d){return d.smoothed_freq;}) );
//	var minRawVal = d3.min( d2.map(function(d){return d.smoothed_freq;}) );
	
	var maxDotVal = d3.max( d2.map(function(d){return d.dist_res;}) );
	var minDotVal = d3.min( d2.map(function(d){return d.dist_res;}) );
	
	var yScale = d3.scaleLinear()
    .domain([minVal<0?minVal:0, maxVal])
    .range([ y + this.config.INTERACTION_PEAK_CURVE_HEIGHT, y + 10 ]);
	
	var yScaleRaw = d3.scaleLinear()
    .domain([minRawVal<0?minRawVal:0, maxRawVal])
    .range([ y + this.config.INTERACTION_PEAK_CURVE_HEIGHT, y + 10 ]);

	var yScaleDot = d3.scaleLinear()
    .domain([minDotVal<0?minDotVal:0, maxDotVal])
    .range([ y + this.config.INTERACTION_PEAK_CURVE_HEIGHT, y + 10 ]);

	// Right Count Y-Axis
	ctx.fillStyle = "black";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";

	var zero = 0;
	ctx.beginPath();
	
	var nY1 = yScale(0);
	var nY2 = yScale(maxVal);
	var nLabel = maxVal.toFixed(1);

	if( this.config.barDataType == "raw" ) {
		nY1 = yScaleRaw(0);
		nY2 = yScaleRaw(maxRawVal)
		nLabel = maxRawVal.toFixed(1);
	}
	ctx.moveTo(this.xScale(this.config.data.currentEnd) + 15, nY1);
	ctx.lineTo(this.xScale(this.config.data.currentEnd) + 10, nY1);
	ctx.lineTo(this.xScale(this.config.data.currentEnd) + 10, nY1);
	ctx.lineTo(this.xScale(this.config.data.currentEnd) + 10, nY2);
	ctx.lineTo(this.xScale(this.config.data.currentEnd) + 15, nY2);
	ctx.stroke();

	ctx.fillText( zero.toFixed(1), this.xScale(this.config.data.currentEnd) + 17,  nY1 );
	ctx.fillText( nLabel, this.xScale(this.config.data.currentEnd) + 17, nY2 );
	
	var lBound = this.xScale( this.config.data.currentStart );
	var rBound = this.xScale( this.config.data.currentEnd );

	for(var i=0; i<d2.length; i++) {
		var nX1 = this.xScale( d2[i].bin2_s );
		var nX2 = this.xScale( d2[i].bin2_e );

		// To fit in view rectangle
		if( nX1 - lBound < 0 ) nX1 = lBound;
		if( nX2 - lBound < 0 ) continue;
		
		if( rBound - nX1 < 0 ) continue;
		if( rBound - nX2 < 0 ) nX2 = rBound;

		var nY1 = yScale( d2[i].all_capture_res );
//		var nY1 = yScale( d2[i].smoothed_all_capture_res );
		var nY2 = yScale( 0 );

		if( this.config.barDataType == "raw" ) {
			nY1 = yScaleRaw( d2[i].freq );
//			nY1 = yScaleRaw( d2[i].smoothed_freq );
			nY2 = yScaleRaw( 0 );
		}

		ctx.strokeStyle='rgba(0, 0, 0, 0.7)';
		ctx.fillStyle='rgba(10, 10, 10, 0.9)';
		ctx.beginPath();
		ctx.moveTo(nX1, nY1);
		ctx.lineTo(nX1, nY2);
		ctx.lineTo(nX2, nY2);
		ctx.lineTo(nX2, nY1);
		ctx.fill();
		ctx.stroke();
		
		var xEllipse = nX1 + ((nX2-nX1)/2);
		var yEllipse = yScaleDot( d2[i].dist_res );
		
		ctx.fillStyle='rgba(255, 0, 124, 1)';
		ctx.beginPath();
		ctx.moveTo(xEllipse, yEllipse);
		ctx.arc( xEllipse, yEllipse, 1, 0, Math.PI*2, true );
		ctx.fill();
	}

	ctx.strokeStyle='rgba(23, 23, 23, 0.5)';
	ctx.lineWidth = 0.5;
	ctx.beginPath()
	ctx.moveTo(x, y + this.config.INTERACTION_PEAK_CURVE_HEIGHT);
	ctx.lineTo(x + width, y + this.config.INTERACTION_PEAK_CURVE_HEIGHT);
	ctx.stroke();
	
	ctx.lineWidth = 1;
};

ChimerArcViewer.prototype.drawGenomicRuler = function( ctx ) {
	var UNIT_LEN = 7

	var w = this.tracks['range'].width;
	if( w >= 1600 ) 					UNIT_LEN = 12;
	else if( w < 1600 && w >= 1280 )	UNIT_LEN = 10;
	else if( w < 1280 && w >= 860 )		UNIT_LEN = 7;
	else if( w < 860 && w > 500 )		UNIT_LEN = 5;
	else								UNIT_LEN = 4;

	var diff = (this.config.data.end - this.config.data.start) / UNIT_LEN;

	var baseY = this.tracks['range'].y + this.tracks['range'].height;
	var height = this.config.GENOMIC_RULER_HEIGHT;

	this.tracks['ruler'] = {id:1, x:this.xScale(this.config.data.currentStart), y:baseY, width:this.tracks['range'].width, height:height};

	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillRect(this.tracks['ruler'].x, this.tracks['ruler'].y, this.tracks['ruler'].width, this.tracks['ruler'].height);

	var baitXpos = this.xScale( this.config.data.bait );

	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	
	var y1 = baseY + height - 10;
	var y2 = baseY + height;

	ctx.strokeStyle = "gray";
	ctx.beginPath()
	ctx.moveTo(baitXpos, y1);
	ctx.lineTo(baitXpos, y2);
	ctx.stroke();
	
	var txtBaitLabel = (this.config.data.bait / 1000000).toFixed(1) +"MB";
	if( this.config.data.bait < 1000000 ) txtBaitLabel = (this.config.data.bait / 1000).toFixed(1) +"KB";

	ctx.fillText( txtBaitLabel, baitXpos, y1 - 10 );
	
	for( var i=1; i<UNIT_LEN; i++) {
		var x1GenomicPos = parseInt( (i * diff) + this.config.data.bait );
		var x2GenomicPos = parseInt( this.config.data.bait - (i * diff) );

		var x1 = this.xScale( x1GenomicPos );
		var x2 = this.xScale( x2GenomicPos );

		if( x1 <= this.xScale(this.config.data.currentEnd) ) {
			ctx.beginPath()
			ctx.moveTo(x1, y1);
			ctx.lineTo(x1, y2);
			ctx.stroke();

			var txtLabel = (x1GenomicPos / 1000000).toFixed(1) +"MB";
			if( x1GenomicPos < 1000000 ) txtLabel = (x1GenomicPos / 1000).toFixed(1) +"KB";

			ctx.fillStyle='black';
			ctx.fillText( txtLabel, x1, y1 - 10 );
		}
		
		if( x2 >= this.xScale(this.config.data.currentStart) ) {
			ctx.beginPath()
			ctx.moveTo(x2, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();

			var txtLabel = (x2GenomicPos / 1000000).toFixed(1) +"MB";
			if( x2GenomicPos < 1000000 ) txtLabel = (x2GenomicPos / 1000).toFixed(1) +"KB";
			
			ctx.fillStyle='black';
			ctx.fillText( txtLabel, x2, y1 - 10 );
		}
	}
};

ChimerArcViewer.prototype.clear = function() {
	var ctx = this.canvas.getContext('2d');
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

ChimerArcViewer.prototype.initXscaler = function(currentStart, currentEnd) {
	this.config.data.currentStart = currentStart;
	this.config.data.currentEnd = currentEnd;

	this.xScale = d3.scaleLinear()
    .domain([this.config.data.currentStart, this.config.data.currentEnd])
    .range([ this.config.X_MARGIN, this.canvas.width - this.config.X_MARGIN ]);
}

ChimerArcViewer.prototype.redraw = function(currentStart, currentEnd) {
	this.config.controller.zoom(currentStart, currentEnd);
}

ChimerArcViewer.prototype.drawGenomicRange = function( ctx ) {
	var x = this.xScale(this.config.data.currentStart);
	var y = this.config.MARGIN;
	var height = this.config.RANGE_BAR_HEIGHT;
	var width = this.xScale(this.config.data.currentEnd) - this.xScale(this.config.data.currentStart);

	this.tracks['range'] = {id:0, x:x, y:y, width:width, height:height};

	ctx.fillStyle = 'rgba(225, 225, 225, 0.1)';
	ctx.fillRect(x, y, width, height);

	var label = "hg19 : (" + this.config.data.chrom + " : " + comma(this.config.data.currentStart) + " - " + comma(this.config.data.currentEnd) + ")";

	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	var textLabelWidth = ctx.measureText(label).width;

	ctx.fillText( label, x + width/2, y + height/2 );

	ctx.lineWidth = 1;
	ctx.strokeStyle='gray';
	ctx.fillStyle='gray';

	// Left-Right arrow
	ctx.beginPath();
	ctx.moveTo(x + 7, height/2 - 3);
	ctx.lineTo(x, height/2);
	ctx.lineTo(x + 7, height/2 + 3);
	ctx.lineTo(x + 7, height/2);
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x, height/2);
	ctx.lineTo( x + (width/2) - ((textLabelWidth/2) + 20), height/2);
	ctx.stroke()

	ctx.beginPath();
	ctx.moveTo( x + (width/2) + ((textLabelWidth/2) + 20), height/2);
	ctx.lineTo( x + width, height/2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.lineTo( x + width - 7, height/2);
	ctx.lineTo( x + width - 7, height/2 - 3);
	ctx.lineTo( x + width, height/2);
	ctx.lineTo( x + width - 7, height/2 + 3);
	ctx.lineTo( x + width - 7, height/2);
	ctx.fill();
};