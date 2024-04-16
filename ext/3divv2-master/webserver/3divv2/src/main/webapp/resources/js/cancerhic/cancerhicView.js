var smx = -1;
var emx = -1;
var selMx = -1;
var bin1 = null;

function getOverlap(x11, x12, x21, x22){
	var range1 = x12 - x11 + 1;
	var range2 = x22 - x21 + 1;
	
	var sumRange = range1 + range2;
	var diffMinMax = Math.max(x22, x12) - Math.min(x11, x21);
	
	var overlappedSize = sumRange - diffMinMax;

//	console.log("===================================> " + (sumRange) + "  :   " + diffMinMax );
	
	return overlappedSize > 0?overlappedSize:0;
};

class CancerHiC{
	constructor( params ){
		this.config = params;
		
		this.resolution = $("#cancerHiCcanvas").width();
		this.margin = 0;
		this.hasSelectedRegion = false;
		this.chromosomeBands = [];

		this.canvas = document.getElementById( this.config.container );
		this.canvas.width = this.resolution;
		this.canvas.height = this.canvas.width/2;
		
		this.chromosomeCanvas = document.getElementById( this.config.chrContainer );
		this.chromosomeCanvas.width = this.resolution;
		this.chromosomeCanvas.height = this.config.chrBandHeight * 2;
		
		this.procActionListener();
	}
	init(config){
		this.config.data = config.data;
		this.samples = Object.keys(config.data);
		this.config.chromOrder = config.chromOrder;
		this.drawRate = (this.resolution - (2*this.margin)) / ( this.config.data[ this.samples[0] ].nRow * Math.sqrt(2) );
	}
	procActionListener() {
		var obj = this;

		this.chromosomeCanvas.addEventListener('mousedown', function(e) {
			var svType = $("#inputSvType").val();

			if(e.buttons ==1) {
				if( svType !== 'trl' && svType !== 'dup' ) {
					var my = e.offsetY;
					smx = e.offsetX;
	
					if( smx < 0 ) smx = 0;
					if( smx > chromosomeCanvas.width ) smx = chromosomeCanvas.width;
	
					for(var i=0; i<obj.chromosomeBands.length; i++) {
						if( obj.chromosomeBands[i]['x'] <= smx && (obj.chromosomeBands[i]['x'] + obj.chromosomeBands[i]['width']) >= smx ) {
							var hitObj = obj.chromosomeBands[i];
							var bin = parseInt(hitObj['scale'](smx));
	
							obj.bin1 = { 'chr':hitObj['chrom'], 'bin':bin, 'x':smx};

							break;
						}
					}
				}else {
					if( obj.hasSelectedRegion === false ) {
						var my = e.offsetY;
						smx = e.offsetX;
		
						if( smx < 0 ) smx = 0;
						if( smx > chromosomeCanvas.width ) smx = chromosomeCanvas.width;
		
						for(var i=0; i<obj.chromosomeBands.length; i++) {
							if( obj.chromosomeBands[i]['x'] <= smx && (obj.chromosomeBands[i]['x'] + obj.chromosomeBands[i]['width']) >= smx ) {
								var hitObj = obj.chromosomeBands[i];
								var bin = parseInt(hitObj['scale'](smx));
		
								obj.bin1 = { 'chr':hitObj['chrom'], 'bin':bin, 'x':smx};
		
								break;
							}
						}
					}else {
						var my = e.offsetY;
						var mx = e.offsetX;	
						
						if( obj.selectedRegion.x1 < mx && obj.selectedRegion.x2 > mx ) {
							selMx = mx;
						}
					}
				}
			}
		});

		this.chromosomeCanvas.addEventListener('mousemove', function(e) {
			var svType = $("#inputSvType").val();

			if(e.buttons == 1) { //dragged with left mouse button
				if( svType !== 'trl' && svType !== 'dup' ) {
					emx = e.offsetX;
					
					if( emx < 0 ) emx = 0;
					if( emx > chromosomeCanvas.width ) emx = chromosomeCanvas.width;
					
					obj.drawChrBands( true, Math.min(smx, emx), Math.max(smx, emx) );
				}else {
					if( obj.hasSelectedRegion === false ) {
						emx = e.offsetX;
						
						if( emx < 0 ) emx = 0;
						if( emx > chromosomeCanvas.width ) emx = chromosomeCanvas.width;
						
						obj.selectedRegion = {x1:Math.min(smx, emx), x2:Math.max(smx, emx)};

						obj.drawChrBands( true, smx, emx );
					}else {
						if( selMx != -1 ) {
							var mx = e.offsetX;
							var diff = mx - selMx;
							
							obj.selectedRegion = {x1: (Math.min(smx, emx) + diff), x2: (Math.max(smx, emx) + diff) };

							obj.drawChrBands( true, smx + diff, emx + diff );
						}
					}
				}
			}
		});

		this.chromosomeCanvas.addEventListener('mouseup', function(e) {
			var svType = $("#inputSvType").val();

			if( svType !== 'trl' && svType !== 'dup' ) {
				var bin1 = obj.bin1;
				var bin2 = obj.getTargetBinInfo( emx, obj.chromosomeBands );
				if( bin1 != null && bin2 != null ) {
					if( obj.config.chromOrder.indexOf( bin1['chr'] ) <= obj.config.chromOrder.indexOf( bin2['chr'] ) ) {
						if( bin1.bin < bin2.bin ) {
							obj.changeSVtypes( bin1, bin2, -1, svType );
						}else {
							obj.changeSVtypes( bin2, bin1, -1, svType );
						}
					}else {
						obj.changeSVtypes( bin2, bin1, -1, svType );
					}
				}

				obj.bin1 = null;
				smx = -1;
				emx = -1;

				obj.drawChrBands(false, -1, -1);
			}else {
				if( obj.hasSelectedRegion === false ) {
					// Area setting complete
					obj.hasSelectedRegion = true;
				}else {
					var mx = e.offsetX;
					
					if( obj.selectedRegion.x1 < mx && obj.selectedRegion.x2 > mx ) {
						var bin1 = obj.bin1;
						var bin2 = obj.getTargetBinInfo( emx, obj.chromosomeBands );
 
						var transPos = obj.selectedRegion.x1 + (obj.selectedRegion.x2 - obj.selectedRegion.x1)/2;
						var tarPos = obj.getTargetBinInfo( transPos, obj.chromosomeBands );

						obj.changeSVtypes( bin1, bin2, tarPos, svType );

						obj.selectedRegion = null;
						obj.hasSelectedRegion = false;
						
						obj.selectRegion = null;
						obj.bin1 = null;
						smx = -1;
						emx = -1
						selMx = -1;
						
						obj.drawChrBands(false, -1, -1);
					}
				}
			}
		});
	}
	getTargetBinInfo( point, chromosomeBands ) {
		var bin2 = null;
		for(var i=0; i<chromosomeBands.length; i++) {
			if( chromosomeBands[i]['x'] <= point && (chromosomeBands[i]['x'] + chromosomeBands[i]['width']) >= point ) {
				var hitObj = chromosomeBands[i];
				var bin = parseInt(hitObj['scale'](point));

				bin2 = { 'chr':hitObj['chrom'], 'bin':bin};
				
				break;
			}
		}
		return bin2;
	}
	reInitChromosomeBands( svType, bin1, bin2, tarBin ){
		var x = 0;
		
		if( svType === 'del' ) {
			var x = 0;
			var n = {};
			for(var i=0; i<this.chromosomeBands.length; i++) {
				var chrom = this.chromosomeBands[i].chrom;

				var chromBandX1 = parseInt(x);
				var chromBandX2 = parseInt(x + this.config.data[this.samples[0]].genomeSize[ chrom + "-" + i ] + 1 );
				var overlap = getOverlap( chromBandX1, chromBandX2, bin1.bin, bin2.bin );

				x += this.config.data[this.samples[0]].genomeSize[ chrom + "-" + i ];
				
				n[chrom + "-" +i] = overlap;
			}
			
			for(var i=0; i< Object.keys(n).length; i++){
				this.config.data[this.samples[0]].genomeSize[ Object.keys(n)[i] ] -= n[Object.keys(n)[i]];
			}
		}else if( svType === 'trl' ) {
			var overlap = 0;
			var expandingChrom = null;
			for(var i=0; i<this.chromosomeBands.length; i++) {
				var chrom = this.chromosomeBands[i].chrom;
				var x1 = parseInt( this.chromosomeBands[i].scale.invert( this.chromosomeBands[i].x ) );
				var x2 = parseInt( this.chromosomeBands[i].scale.invert( this.chromosomeBands[i].x + this.chromosomeBands[i].width ) );
				
				var localOverlap = getOverlap( x1, x2, bin1.bin, bin2.bin );
				
				this.config.data[this.samples[0]].genomeSize[ chrom + "-" + i ] -= localOverlap;

				if( tarBin.bin >= bin1.bin && tarBin.bin <= bin2.bin ) expandingChrom = chrom + "-" + i;
				
				overlap += localOverlap;
				
//				console.log("Overlap : " + localOverlap);
			}
			
//			console.log( "expanding : " + expandingChrom );
			this.config.data[this.samples[0]].genomeSize[ expandingChrom ] += overlap;
		}else if( svType === 'dup' ) {
			var overlap = 0;
			var expandingChrom = null;
			for(var i=0; i<this.chromosomeBands.length; i++) {
				var chrom = this.chromosomeBands[i].chrom;
				var x1 = parseInt( this.chromosomeBands[i].scale.invert( this.chromosomeBands[i].x ) );
				var x2 = parseInt( this.chromosomeBands[i].scale.invert( this.chromosomeBands[i].x + this.chromosomeBands[i].width ) );
				
				var localOverlap = getOverlap( x1, x2, bin1.bin, bin2.bin );

				if( tarBin.bin >= x1 && tarBin.bin <= x2 )	expandingChrom = chrom + "-" + i;
				
				overlap += localOverlap;
				
//				console.log("Overlap : " + localOverlap);
			}

			this.config.data[this.samples[0]].genomeSize[ expandingChrom ] += overlap;
		}
		
//		console.log( this.config.data[this.samples[0]].genomeSize );
	}
	changeSVtypes( bin1, bin2, tarBin, svType ) {
		// Bin1은 반드시 Bin2보다 앞쪽이어야 함
		if( bin1.bin > bin2.bin ) {
			var temp = bin1;
			bin1 = bin2;
			bin2 = temp;
		}

		var obj = this;
		if(typeof(webworker) == "undefined") {
		    const worker = new Worker("resources/js/cancerhic/procWorker.js");

		    worker.postMessage( [this.config, bin1, bin2, tarBin, svType] );

		    worker.addEventListener('message', function(e) {
		    	console.log('Worker said: ', e.data[1]);

		    	obj.config = e.data[0];
		    	obj.reInitChromosomeBands( svType, bin1, bin2, tarBin );

		    	obj.drawRate = (obj.resolution - (2*obj.margin)) / ( obj.config.data[ obj.samples[0] ].nRow * Math.sqrt(2) );

		    	obj.drawChrBands(false, -1, -1);
		    	obj.drawContactMap();
		    	
		    	worker.terminate();
	    	}, false);
		}
	}
	drawChrBands( dragFlag, sp, ep ){
		var obj = this;
		
		var ctxChr = obj.chromosomeCanvas.getContext('2d');
		ctxChr.clearRect( 0, 0, obj.chromosomeCanvas.width, obj.chromosomeCanvas.height );
		
		var oldFillStyle = ctxChr.fillStyle;
		var chromosomeBandY = 0;
		
		this.chromosomeBands = [];

		ctxChr.globalAlpha = 0.4;
		var colours = ["green", "blue", "yellow", "purple", "cyan", "orange", "gray", "magenta", "pink"];
		var sx = this.margin;
		var idx = 0;
		for( var i=0; i<Object.keys(this.config.data[this.samples[0]].genomeSize).length; i++){
			var chr = Object.keys(this.config.data[this.samples[0]].genomeSize)[i];
			
			var size = this.config.data[this.samples[0]].genomeSize[chr];
//			console.log( chr + " => " + size );

			var width = (size * Math.sqrt(2)) * this.drawRate;
			var height = 10;

			ctxChr.fillStyle = colours[i];
			ctxChr.beginPath();
			ctxChr.rect(sx, chromosomeBandY, width, this.config.chrBandHeight);
			ctxChr.fill();
			
			var scale = d3.scaleLinear()
			.range([idx, idx + size -1])
			.domain([sx, sx + width]);
			
			var nChr = chr.split('-')[0];

			this.chromosomeBands.push( {'x':sx, 'y':chromosomeBandY, 'width':width, 'height':height, 'scale':scale, 'chrom':nChr, 'binSize':size} );

			sx += width;
			idx += size;
		}

		ctxChr.globalAlpha = 1;
		if( obj.hasSelectedRegion === false ) {
			if( dragFlag == true ) {
				ctxChr.fillStyle = 'rgba(140, 140, 140, 0.8)';
				ctxChr.beginPath();
				ctxChr.rect(sp, 0, (ep-sp), this.config.chrBandHeight);
				ctxChr.fill();
			}
			
			if( sp > -1 ) {
				ctxChr.fillStyle = 'rgba(140, 140, 140, 1)';
				ctxChr.beginPath();
				ctxChr.moveTo( sp, this.config.chrBandHeight );
				ctxChr.lineTo( sp - 5, this.config.chrBandHeight + 7 );
				ctxChr.lineTo( sp + 5, this.config.chrBandHeight + 7 );
				ctxChr.fill();
			}
			
			if( ep > -1 ) {
				ctxChr.fillStyle = 'rgba(140, 140, 140, 1)';
				ctxChr.beginPath();
				ctxChr.moveTo( ep, this.config.chrBandHeight );
				ctxChr.lineTo( ep - 5, this.config.chrBandHeight + 7 );
				ctxChr.lineTo( ep + 5, this.config.chrBandHeight + 7 );
				ctxChr.fill();
			}
		}else {
			if( dragFlag == true ) {
				ctxChr.fillStyle = 'rgba(255, 101, 9936, 0.6)';
				ctxChr.beginPath();
				ctxChr.rect(sp, 10, (ep-sp), 10 + this.config.chrBandHeight);
				ctxChr.fill();
			
				var xp = sp + ((ep - sp) / 2);
//				console.log( ep + "  " + sp  + " = " + xp );
				ctxChr.fillStyle = 'rgba(255, 0, 0, 0.8)';
				ctxChr.beginPath();
				ctxChr.moveTo( xp,  0 );
				ctxChr.lineTo( xp - 5, 7);
				ctxChr.lineTo( xp + 5, 7 );
				ctxChr.fill();
			}
		}

		ctxChr.fillStyle = oldFillStyle;
	}
	drawContactMap(){
		var obj = this;
		var ctx = obj.canvas.getContext('2d');
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.translate( 0, this.resolution  / 2);
		ctx.rotate(-45 * Math.PI / 180);

		ctx.scale(this.drawRate, this.drawRate);
	
		var oldFillStyle = ctx.fillStyle;
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];

				var x = point.iRow;
				var y = point.iCol + this.margin;
				var value = point.intensity;
				
				var cv = value;
				if( value > 100) cv = 0;
				else			 cv = 255 - value;
				ctx.fillStyle = 'rgb(255, '+cv+', '+cv+')';
				ctx.beginPath();
				ctx.rect(x, y, 1, 1);
				ctx.fill();
			}
		}
		ctx.fillStyle = oldFillStyle;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	draw(){
		var obj = this;

		obj.drawContactMap();
		obj.drawChrBands( false, -1, -1 );
	}
	loadingData( filters ) {
		var obj = this;

		$.ajax({
			type : 'post'
			,url : 'getContactMapDataFromBedFormats'
			,dataType : 'json'
			,data:{'bed_data':filters.regions, 'samples':filters.samples, 'threshold':filters.threshold, 'get_data_type':'part'}
			,success: function( result ) {
				console.log( result );
				var params = {
						'data': result
						, 'chromOrder':filters.chromOrder
				};
				obj.init( params );
				obj.draw();
			}
		});
	}
}

class CHiC_CancerViewerController{
	constructor( params ){
		this.viewer = null;

		if( this.isSupportingWebWorker() ) {
			this.viewer = new CancerHiC( params );
		}
	}
	
	isSupportingWebWorker(){
		if (typeof(Worker) !== "undefined") return true;
		return false;
	}

	isCorrectQuery( query ) {
		var fragmentFormat = query.split(';');
		
		var retObj = {};

		var params = [];
		for(var i=0; i<fragmentFormat.length; i++) {
			var str = fragmentFormat[i].replace(/\,/gi, '');
			if( str == '' ) continue;

			var divs = str.split(':');

			if( divs.length != 2 ) {
				retObj = {msg_text:"Error : Your text is not the out input query format, Please check it again(':') : " + str, msg_code:'001' };
				return retObj;
			}else {
				var chrom = divs[0];
				var pos = divs[1].split('-');

				if( !chrom.toUpperCase().startsWith("CHR") ) {
					retObj = {msg_text:"Error : chromsome character must started with 'chr' chracters, Please check it again('-') : " + chrom, msg_code:'002' };
					return retObj;
				}else if( pos.length != 2 ) {
					retObj = {msg_text:"Error : Your text is not the BED format, Please check it again('-') : " + str, msg_code:'002' };
					return retObj;
				}

				params.push(chrom + ":" + pos[0] + "-" + pos[1]);
			}
		}
		if( params.length > 0 ) retObj = {msg_text:'ok', data:JSON.stringify(params), msg_code:'000'};
		else					retObj = {msg_text:"Warning : There is no query", data:JSON.stringify(params), msg_code:'003'};
		
		return retObj;
	}

	loadingData( filters ) {
		if( this.viewer != null ) {
			this.viewer.loadingData( filters );
		}
	}
}