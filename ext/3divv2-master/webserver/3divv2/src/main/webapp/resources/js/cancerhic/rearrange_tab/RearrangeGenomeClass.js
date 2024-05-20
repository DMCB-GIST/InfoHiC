class RearrangeGenomeCancerHiC extends CancerHiC{
	constructor(config){
		super(config);

		if( this.config.extra_tracks !== undefined ) {
			for(var i=0; i<this.config.extra_tracks.length; i++) {
				if( this.config.extra_tracks[i] === 'superenhancer' ) {
					var selector = "superenhancer-"+this.config.type;
					
					var canvas = "";
					canvas += "<div class='row'>";
					canvas += 	"<div class='col-2 m-auto text-right'>";
					canvas += 		"<span class='badge badge-pill badge-success'>Superenhancer</span>";
					canvas += 	"</div>";
					canvas += 	"<div class='col-10'>";
					canvas += 		"<canvas id='"+selector+"' class='w-100'></canvas>";
					canvas += 	"</div>";
					canvas += "</div>";
					
//					$(".contact-map-" + this.config.type).append("<canvas id='"+selector+"'></canvas>");
					$(".contact-map-" + this.config.type).append(canvas);
					this.superEnhancerContainer = document.getElementById( selector );
					this.superEnhancerContainer.width = this.resolution;
					this.superEnhancerContainer.height = this.config.chrBandHeight * 1;
					this.superEnhancerContainer.style='height:' + this.superEnhancerContainer.height + 'px;width:' + this.superEnhancerContainer.width + 'px;background:#fdfdfd;';
				}else if( this.config.extra_tracks[i] === 'gencode' ) {
					var selector = "gencode-"+this.config.type;
					
					var canvas = "";
					canvas += "<div class='row'>";
					canvas += 	"<div class='col-2 m-auto text-right'>";
					canvas += 		"<i class='fa fa-info-circle fa-fw gencode-tooltip' aria-hidden='true' data-toggle='tooltip' title='Tooltip'></i><span class='badge badge-pill badge-info'>Gencode</span>";
					canvas += 	"</div>";
					canvas += 	"<div class='col-10'>";
					canvas += 		"<canvas id='"+selector+"' class='w-100'></canvas>";
					canvas += 	"</div>";
					canvas += "</div>";

//					$(".contact-map-" + this.config.type).append("<canvas id='"+selector+"'></canvas>");
					$(".contact-map-" + this.config.type).append(canvas);
					this.gencodeGenesCanvas = document.getElementById( selector );
					this.gencodeGenesCanvas.width = this.resolution;
					this.gencodeGenesCanvas.height = this.config.chrBandHeight * 1;
					this.gencodeGenesCanvas.style='height:' + this.gencodeGenesCanvas.height + 'px;width:' + this.gencodeGenesCanvas.width + 'px;background:#fafafa;';
				}else if( this.config.extra_tracks[i] === 'refseq' ) {
					var selector = "refseq-"+this.config.type;
					
					var canvas = "";
					canvas += "<div class='row'>";
					canvas += 	"<div class='col-2 m-auto text-right'>";
					canvas += 		"<i class='fa fa-info-circle fa-fw refseq-tooltip' aria-hidden='true' data-toggle='tooltip' title='Tooltip'></i><span class='badge badge-pill badge-danger'>Refseq</span>";
					canvas += 	"</div>";
					canvas += 	"<div class='col-10'>";
					canvas += 		"<canvas id='"+selector+"' class='w-100'></canvas>";
					canvas += 	"</div>";
					canvas += "</div>";

//					$(".contact-map-" + this.config.type).append("<canvas id='"+selector+"'></canvas>");
					$(".contact-map-" + this.config.type).append(canvas);
					this.refseqGenesCanvas = document.getElementById( selector );
					this.refseqGenesCanvas.width = this.resolution;
					this.refseqGenesCanvas.height = this.config.chrBandHeight * 1;
					this.refseqGenesCanvas.style='height:' + this.refseqGenesCanvas.height + 'px;width:' + this.refseqGenesCanvas.width + 'px;background:#f8f8f8;';
				}
			}
		}
		
		this._rulerMouseEventProc();

		this.isOff = true;
		this.selectedSvType = null;	// 현재 화면에서 사용자가 지정한 SV 타입
	}
	drawSv( bin1, bin2, tarPos, svtype ) {
//		var obj = this;
//		var ctx = obj.canvas.getContext('2d');
//
//		ctx.translate( 0, this.resolution  / 2);
//		ctx.rotate(-45 * Math.PI / 180);
//
//		ctx.scale(this.drawRate, this.drawRate);
//
//		var oldFillStyle = ctx.fillStyle;
//		var oldStrokeStyle = ctx.strokeStyle;
//		var oldStrokeWidth = ctx.strokeWidth;
//		var x1 = bin1.bin;
////		var x2 = bin2.bin + (bin2.bin - bin1.bin+1) - 1;
//		var x2 = bin2.bin + 1;
//
////		if( !(svtype === 'TRA' && this.config.isRaw == false ) ) {
//			if( (obj.config.isRaw == true || svtype !== 'DEL') ) {
////				ctx.strokeStyle = 'black';
//				ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
//				ctx.strokeWidth=1;
//				ctx.fillStyle = getSvColour( svtype );
//				ctx.beginPath();
//				ctx.moveTo( x1, 0);
//				ctx.lineTo( x1, x1 );
//				ctx.lineTo( x2, x2);
//				ctx.lineTo( x2, 0);
//				ctx.lineTo( x1, 0 );
//				ctx.fill();
//		
//				ctx.beginPath();
//				ctx.moveTo( x1, x1);
//				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1 );
//				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x2);
//				ctx.lineTo( x2, x2);
//				ctx.lineTo( x1, x1 );
//				ctx.fill();
//				
////				console.log("Call here1  " + obj.config.isRaw + "  " + ctx.fillStyle );
////				ctx.beginPath();
////				ctx.moveTo( x1, 0);
////				ctx.lineTo( x1, x1 );
////				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1);
////				ctx.moveTo( obj.config.data[ obj.samples[0] ].nRow, x2);
////				ctx.lineTo( x2, x2 );
////				ctx.lineTo( x2, 0);
////				ctx.stroke();
//				ctx.beginPath();
//				ctx.moveTo( x1 + 0.5, 0);
//				ctx.lineTo( x1 + 0.5, x1 + 0.5 );
//				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1 + 0.5);
//				ctx.moveTo( obj.config.data[ obj.samples[0] ].nRow, x2 + 0.5);
//				ctx.lineTo( x2 + 0.5, x2 + 0.5 );
//				ctx.lineTo( x2 + 0.5, 0);
//				
//				ctx.fillStyle = oldFillStyle;
//				ctx.strokeStyle = oldStrokeStyle;
//				ctx.strokeWidth = oldStrokeWidth;
//			}else {
////				ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
////				ctx.strokeWidth=1;
////				ctx.beginPath();
////				ctx.moveTo( x1, 0);
////				ctx.lineTo( x1, x1 );
////				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1);
////				ctx.stroke();
//	
//				ctx.fillStyle = oldFillStyle;
//				ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
//				ctx.beginPath();
//				ctx.moveTo( x1 + 0.5, 0);
//				ctx.lineTo( x1 + 0.5, x1 + 0.5 );
//				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1 + 0.5 );
//				ctx.stroke();
//
//				ctx.fillStyle = oldFillStyle;
//				ctx.strokeStyle = oldStrokeStyle;
//				ctx.strokeWidth = oldStrokeWidth;
//			}
////		}
//
////		if( (svtype === 'TRA' && this.config.isRaw == false ) || svtype === 'DUP'  ) {
//		if( svtype === 'TRA'|| svtype === 'DUP' || svtype === 'INVDUP'  ) {
//			var x3 = tarPos.bin;
//			
////			console.log("Call here2  " + obj.config.isRaw + "  " + ctx.fillStyle + "   x1=" + x1 + " vs x3=" + x3 );
//
//			ctx.strokeWidth = 1;
//			ctx.strokeStyle = REARRANGED_COLOR;
////			ctx.strokeStyle = 'orange';
//			ctx.beginPath();
//			ctx.moveTo( x3, 0);
//			ctx.lineTo( x3, x3 );
//			ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x3);
//			ctx.stroke();
//
////			console.log( (bin2.bin) + " " + bin1.bin + "  => " + this.config.isRaw );
//			ctx.beginPath();
//			ctx.moveTo( x3 + (bin2.bin - bin1.bin), 0);
//			ctx.lineTo( x3 + (bin2.bin - bin1.bin), x3 + (bin2.bin - bin1.bin) );
//			ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x3 + (bin2.bin - bin1.bin));
//			ctx.stroke();
//
//			ctx.strokeStyle = oldStrokeStyle;
//			ctx.strokeWidth = oldStrokeWidth; 
//		}
//
//		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	draw(){
		super.draw();
		
		var obj = this;
	}
	serialWorks( works ) {
		var obj = this;
		console.log( "bf nRow ", obj.config.data[ obj.samples[0] ].nRow );

		if(typeof(webworker) == "undefined") {
		    const worker = new Worker("resources/js/cancerhic/worker/procSvDataTypeWorker.js");

		    worker.postMessage( [obj.config, works] );

		    worker.addEventListener('message', function(e) {
		    	console.log('Serial Worker said: ', e.data[1]);

		    	obj.config = e.data[0];
		    	obj.config.raw_data = JSON.parse(JSON.stringify(obj.config.data));

//				console.log( "af nRow ", obj.config.data[ obj.samples[0] ].nRow );
//		    	obj.drawRate = (obj.resolution - (2*obj.margin)) / ( obj.config.data[ obj.samples[0] ].nRow * Math.sqrt(2) );
//		    	for(var i=0; i<works.length; i++) {
//		    		obj.reInitChromosomeBands( works[i].svType, works[i].bin1, works[i].bin2, works[i].tarPos );
//		    	}
//
//		    	obj.drawChrBands(false, -1, -1);
//		    	obj.drawRuller();
//		    	obj.drawContactMap();
//
//		    	if( obj.config.superenhancer !== undefined )	obj.drawSuperEnhancer();
//		    	if( obj.config.gencode !== undefined )			obj.drawGencodeGenes();
//		    	if( obj.config.refseq !== undefined )			obj.drawRefseqGenes();

		    	worker.terminate();

		    	obj.initRearrangeChrs( obj.config.filters.tadMap );

	    	}, false);
		}
	}
}