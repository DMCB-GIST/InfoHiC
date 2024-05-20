class PrecalledCancerHiC extends CancerHiC{
	constructor(config){
		super(config);
		
		var obj = this;
		
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
	}
//	loadingData( filters ) {
//		var obj = this;
//		
//		$.ajax({
//			type : 'post'
//			,url : filters.url
////			,dataType : 'json'
//			,data:{'bed_data':filters.regions, 'samples':filters.samples, 'threshold':filters.threshold, 'get_data_type':'part', 'resolution':obj.config.resolution}
//			,success: function( result ) {
//				var compressed_result = LZString.decompressFromBase64(result);
//				var data = JSON.parse(compressed_result);
//
//				var params = {
//					data: data
//					, raw_data : data
//					, chromOrder:filters.chromOrder
//					, userRegions:JSON.parse(filters.regions)
//				};
//				obj.init( params );
//				obj.draw();
//			}
//		});
//	}

//	doGenomicVariations( bin1, bin2, tarPos, svType ) {
//		console.log("Do");
//		if( svType !== 'DUP' && svType !== 'TRA' )	this.viewer.doGenomicVariations( bin1, bin2, tarPos, svType );
//		else										this.viewer.drawSv( bin1, bin2, tarPos, svType );
//
//		if( this.originDataViewer !== undefined ) {
//			this.originDataViewer.drawSv( bin1, bin2, tarPos, svType );
//		}
//	}
	
	
//	recoveryGenomicVariations( src_chrom_start, tar_chrom_start, tarPos, svType ) {
//		if( svType === 'DEL' )	{
//			this.changeSVtypes( src_chrom_start, tar_chrom_start, tarPos, 'INS' );
//		}else {
//			this.changeSVtypes( src_chrom_start, tar_chrom_start, tarPos, svType );
//		}
//	}
//	changeSVtypes( bin1, bin2, tarBin, svType ) {
//		// Bin1은 반드시 Bin2보다 앞쪽이어야 함
//		if( bin1.bin > bin2.bin ) {
//			var temp = bin1;
//			bin1 = bin2;
//			bin2 = temp;
//		}
//
//		var obj = this;
//		if(typeof(webworker) == "undefined") {
//		    const worker = new Worker("resources/js/cancerhic/worker/procSvDataTypeWorker.js");
//
//		    worker.postMessage( [this.config, bin1, bin2, tarBin, svType] );
//
//		    worker.addEventListener('message', function(e) {
//		    	console.log('Worker said: ', e.data[1]);
////
//		    	obj.config = e.data[0];
//		    	obj.reInitChromosomeBands( svType, bin1, bin2, tarBin );
//
//		    	obj.drawRate = (obj.resolution - (2*obj.margin)) / ( obj.config.data[ obj.samples[0] ].nRow * Math.sqrt(2) );
//
//		    	obj.drawChrBands(false, -1, -1);
//		    	obj.drawRuller();
//		    	obj.drawContactMap();
//
//		    	obj.drawSv(bin1, bin2, svType);
//
//		    	worker.terminate();
//	    	}, false);
//		}
//		
//		if( this.isOff == true )	this.isOff = false;
//		else						this.isOff = true;
//	}
	drawSv( bin1, bin2, tarPos, svtype ) {
		var obj = this;
		var ctx = obj.canvas.getContext('2d');

		ctx.translate( 0, this.resolution  / 2);
		ctx.rotate(-45 * Math.PI / 180);

		ctx.scale(this.drawRate, this.drawRate);

		var oldFillStyle = ctx.fillStyle;
		var x1 = bin1.bin;
		var x2 = bin2.bin + 1;
		
		try {
			var vx = obj.config.data[ obj.samples[0] ].nRow;

	//		if( (obj.config.isRaw == true && svtype !== 'DEL') == false ) {
			if( svtype !== 'DEL' || (svtype === 'DEL' && obj.config.isRaw == true) ) {
				ctx.fillStyle = getSvColour( svtype );
				ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
				ctx.beginPath();
				ctx.moveTo( x1, 0);
				ctx.lineTo( x1, x1 );
				ctx.lineTo( x2, x2);
				ctx.lineTo( x2, 0);
				ctx.lineTo( x1, 0 );
				ctx.fill();
	
				ctx.beginPath();
				ctx.moveTo( x1, x1);
				ctx.lineTo( vx, x1 );
				ctx.lineTo( vx, x2);
				ctx.lineTo( x2, x2);
				ctx.lineTo( x1, x1 );
				ctx.fill();
				
				ctx.fillStyle = oldFillStyle;
				ctx.beginPath();
				ctx.moveTo( x1 + 0.5, 0);
				ctx.lineTo( x1 + 0.5, x1 + 0.5 );
				ctx.lineTo( vx, x1 + 0.5);
				ctx.moveTo( vx, x2 + 0.5);
				ctx.lineTo( x2 + 0.5, x2 + 0.5 );
				ctx.lineTo( x2 + 0.5, 0);
				ctx.stroke();
			}else {
				ctx.fillStyle = oldFillStyle;
				ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
				ctx.beginPath();
				ctx.moveTo( x1 + 0.5, 0);
				ctx.lineTo( x1 + 0.5, x1 + 0.5 );
				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1 + 0.5 );
				ctx.stroke();
			}
		}catch(err){
			console.log( obj.config.data );
			console.log(err);
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	draw(){
		super.draw();
		
		var obj = this;
	}
	displaySv( isProcBackground ){
		var obj = this;

		if( obj.controller.prevSvItem === null ) {
			var chosenSvType = null2Empty($("#chosen_sv_type").val());
			
			if( chosenSvType !== '' ){
				var data = JSON.parse($("#chosen_sv_type").val());
	
				obj.controller.displaySvFeature( data );
			}
		}else if( obj.controller.prevSvItem !== null ) {
			// After 1 Oct 2020
			// New logic
			var chromBands = obj.getChromosomeBands();

			var svItem = obj.controller.prevSvItem;
			var binStart = 0;
			if( svItem.bin1.chromIdx !== svItem.bin2.chromIdx ) {
				for(var i= svItem.bin1.chromIdx; i<=svItem.bin2.chromIdx; i++) {
					var binEnd = binStart + chromBands[i].binSize - 1;
					
					var nScale = d3.scaleLinear()
					.domain([chromBands[i].chromStart, chromBands[i].chromEnd])
					.range([binStart, binEnd]);
					
					if( i === svItem.bin1.chromIdx ) {
						if( svItem.bin1.chromPos >= chromBands[i].chromStart && svItem.bin1.chromPos <= chromBands[i].chromEnd ) {
							svItem.bin1.bin = parseInt(nScale( svItem.bin1.chromPos ));
						}else if( svItem.bin1.chromPos < chromBands[i].chromStart ) {
							svItem.bin1.bin = binStart;
						}else if( svItem.bin1.chromPos > chromBands[i].chromEnd ) {
							svItem.bin1.bin = binEnd;
						}
						//console.log( binStart + " to " + binEnd  + "  and (" + chromBands[i].chromStart + "- " +chromBands[i].chromEnd+")    and " + svItem.bin1.chromPos + " => " + svItem.bin1.bin );
					}else if( i === svItem.bin2.chromIdx ) {
						if( svItem.bin2.chromPos >= chromBands[i].chromStart && svItem.bin2.chromPos <= chromBands[i].chromEnd ) {
							svItem.bin2.bin = parseInt(nScale( svItem.bin2.chromPos ));
						}else if( svItem.bin2.chromPos < chromBands[i].chromStart ) {
							svItem.bin2.bin = binStart;
						}else if( svItem.bin2.chromPos > chromBands[i].chromEnd ) {
							svItem.bin2.bin = binEnd;
						}
						//console.log( binStart + " to " + binEnd  + "  and (" + chromBands[i].chromStart + "- " +chromBands[i].chromEnd+")    and " + svItem.bin2.chromPos + " => " + svItem.bin2.bin );
					}
		
					binStart = binEnd + 1;
				}
			}else {
				var chromBand = chromBands[svItem.bin1.chromIdx];
				var binEnd = binStart + chromBand.binSize;
					
				var nScale = d3.scaleLinear()
				.domain([chromBand.chromStart, chromBand.chromEnd])
				.range([binStart, binEnd]);
				
				if( svItem.bin1.chromPos >= chromBand.chromStart && svItem.bin1.chromPos <= chromBand.chromEnd )	svItem.bin1.bin = parseInt(nScale( svItem.bin1.chromPos ));
				else if( svItem.bin1.chromPos < chromBand.chromStart ) 												svItem.bin1.bin = binStart;
				else if( svItem.bin1.chromPos > chromBand.chromEnd )												svItem.bin1.bin = binEnd;

//				console.log( binStart + " to " + binEnd  + "  and (" + chromBand.chromStart + "- " +chromBand.chromEnd+")    and " + svItem.bin1.chromPos + " => " + svItem.bin1.bin );
				if( svItem.bin2.chromPos >= chromBand.chromStart && svItem.bin2.chromPos <= chromBand.chromEnd ) 	svItem.bin2.bin = parseInt(nScale( svItem.bin2.chromPos ));
				else if( svItem.bin2.chromPos < chromBand.chromStart ) 												svItem.bin2.bin = binStart;
				else if( svItem.bin2.chromPos > chromBand.chromEnd ) 												svItem.bin2.bin = binEnd;

//				console.log( binStart + " to " + binEnd  + "  and (" + chromBand.chromStart + "- " +chromBand.chromEnd+")    and " + svItem.bin2.chromPos + " => " + svItem.bin2.bin );
			}
			
			var svType = svItem.svtype;
			if( svType !== 'DUP' && svType !== 'TRA' && svType !== 'INVDUP' && isProcBackground )	obj.doGenomicVariations( svItem.bin1, svItem.bin2, svItem.bin1, svType );
			else																					obj.drawSv( svItem.bin1, svItem.bin2, svItem.bin1, svType );
		}
	}
}