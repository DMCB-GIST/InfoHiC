var smx = -1;
var smy = -1;
var emx = -1;
var selMx = -1;
var bin1 = null;
var isUserDefining = false;
var isSelectSpecificRegion = false;

function rotate(cx, cy, x, y, angle) {
	var radians = (Math.PI / 180) * angle,
	cos = Math.cos(radians),
	sin = Math.sin(radians),
	nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
	ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
	return [nx, ny];
}

function mouseCanvasDownEventHandler(obj, e) {
	if(isUserDefining !== true && e.buttons === 1) { //dragged with left mouse button
		obj.guideLineClear();

		smx = e.offsetX;
		smy = e.offsetY;

		if( smx < 0 )						smx = 0;
		if( smx > chromosomeCanvas.width )	smx = chromosomeCanvas.width;
		
		if( smy < 0 )						smy = 0;
		if( smy > chromosomeCanvas.width )	smy = chromosomeCanvas.width;
		
		isSelectSpecificRegion = true;
	}
}

function mouseCanvasMoveEventHandler(obj, e) {
	if( isUserDefining !== true ) { //dragged with left mouse button
		if( isSelectSpecificRegion ) {
			var mX = e.offsetX;
			var mY = e.offsetY;
	
			if( mX < 0 )						mX = 0;
			if( mX > chromosomeCanvas.width )	mX = chromosomeCanvas.width;
			
			if( mY < 0 )						mY = 0;
			if( mY > chromosomeCanvas.width )	mY = chromosomeCanvas.width;
	
			obj._pureCapturedAreaOnCanvas( smx, smy, mX, mY );
		}
	}
}

function mouseCanvasUpEventHandler(obj, e) {
	if(isUserDefining !== true) { //dragged with left mouse button
		obj.guideLineClear();

		var mX = e.offsetX;
		var mY = e.offsetY;
		
		var x1 = smx;
		var x2 = mX;
		var y1 = smy;
		var y2 = mY;
		var diffX = (x1 + (y2-y1) - x2) / 2 ;
		var x11 = Math.min(x1, x1-diffX);
		var x12 = Math.max(x1, x1-diffX);
		
		var x21 = Math.min(x2, x2 + diffX);
		var x22 = Math.max(x2, x2 + diffX);

		var region1Point = rotate(0, obj.resolution/2, smx, smy, -45);
		region1Point[1] -= (obj.resolution/2);

		var region2Point = rotate(0, obj.resolution/2, mX, mY, -45);
		region2Point[1] -= (obj.resolution/2);
		
		region1Point[0] /= obj.drawRate;
		region1Point[1] /= obj.drawRate;
		
		region2Point[0] /= obj.drawRate;
		region2Point[1] /= obj.drawRate;
		
		region1Start = region1Point[1];
		region1End = region2Point[1];
		
		region2Start = region2Point[0];
		region2End = region1Point[0];

		var binStart = 0;
		for(var i=0; i<obj.chromosomeBands.length; i++) {
			var binEnd = binStart + obj.chromosomeBands[i].binSize - 1;

			var chrom = obj.chromosomeBands[i].chrom;
			var chromStart = obj.chromosomeBands[i].chromStart;
			var chromEnd = obj.chromosomeBands[i].chromEnd;

			if( region1Start >= binStart ) {
				
			} 
			parseInt(obj.config.resolution)
			
			binStart = binEnd + 1;
		}

		isSelectSpecificRegion = false;
	}
}

function mouseMoveEventHandler(obj, e) {
	if(e.buttons == 1) { //dragged with left mouse button
		if( obj.selectedSvType !== null && isUserDefining ) {
			var svType = obj.selectedSvType;
			if( svType !== 'TRA' && svType !== 'DUP' && svType !== 'INVDUP' ) {
				// Case 1: Deletion Or Inversion
				emx = e.offsetX;
				
				if( emx < 0 )						emx = 0;
				if( emx > chromosomeCanvas.width )	emx = chromosomeCanvas.width;
				
				obj.drawChrBands( true, Math.min(smx, emx), Math.max(smx, emx) );
			}else {
				// Case 2: Translocation Or Duplication
				if( obj.hasSelectedRegion === false ) {
					// Select a region to move to another region
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

						var nBin1 = obj.getTargetBinInfo( obj.selectedRegion.x1, obj.chromosomeBands, 1 );
						var nBin2 = obj.getTargetBinInfo( obj.selectedRegion.x2, obj.chromosomeBands, 1 );
						
						var bin2 = obj.getTargetBinInfo( emx, obj.chromosomeBands, 1 );
						obj.guideLineBothDraw( obj.bin1, bin2, nBin1, nBin2, 1 );
					}
				}
			}
		}
	}

	if( obj.layerContainer !== undefined ){
		var emxMove = e.offsetX;
		if( obj.samples !== undefined && obj.samples !== null && (obj.bin1 === undefined || obj.bin1 === null)  ) {
			var bin1 = obj.getTargetBinInfo( emxMove, obj.chromosomeBands, 1 );
			obj.guideLineDraw( bin1, null, 1 );
		}else if( obj.samples !== undefined && obj.samples !== null && obj.bin1 !== null && obj.hasSelectedRegion === false ) {
			var bin1 = jsonCopy(obj.bin1);
			var bin2 = obj.getTargetBinInfo( emxMove, obj.chromosomeBands, 1 );
			if( bin2.bin < bin1.bin ) {
				var tmp = jsonCopy(bin2);
				bin2 = bin1;
				bin1 = tmp;
			}

			obj.guideLineDraw( bin1, bin2, 1 );
		}
	}
}

function mouseUpHandler(obj, e) {
	if( obj.selectedSvType !== null & isUserDefining ) {
		// sv 타입을 선택하고, Chromosome band에서 마우스 클릭을 한 경우 아래 isUserDefining 을 만족함
		var svType = obj.selectedSvType;

		if( svType !== 'TRA' && svType !== 'DUP' && svType !== 'INVDUP' ) {
			// Case 1 : Deletion Or Inversion
			var bin1 = obj.bin1;
			var bin2 = obj.getTargetBinInfo( emx, obj.chromosomeBands );
			
			if( bin1 != null && bin2 !== null ) {
				if( bin1.chr != bin2.chr ) {
					alert("Warning: The 'DEL' and 'DUP' range should bound within a chromosome");
				}else {
					var baseChrom = bin1.chr;

					var canGo = true;
					for(var i=Math.min(bin1.chrBandIdx, bin2.chrBandIdx); i<=Math.max(bin1.chrBandIdx, bin2.chrBandIdx); i++) {
						console.log( baseChrom + ' vs ' + obj.chromosomeBands[i].chrom );
						if( baseChrom !== obj.chromosomeBands[i].chrom ) {
							alert("Warning: The 'DEL' and 'DUP' range should bound within a chromosome");
							canGo = false;
							break;
						}
					}

					if( canGo ) {
						if( bin1.bin > bin2.bin ) {
							var tmp = bin1;
							bin1 = bin2;
							bin2 = tmp;
						}

						obj.addUndo( {bin1:bin1, bin2:bin2, tarPos:tarPos, svType:svType, gapDiff:(bin2.bin-bin1.bin+1)} );

						if( obj.config.chromOrder.indexOf( bin1.chr ) <= obj.config.chromOrder.indexOf( bin2.chr ) ) {
							if( bin1.bin < bin2.bin )	obj.controller.doGenomicVariations( bin1, bin2, tarPos, svType, true );
							else 						obj.controller.doGenomicVariations( bin2, bin1, tarPos, svType, true );
						}else							obj.controller.doGenomicVariations( bin2, bin1, tarPos, svType, true );
					}
				}
			}

			obj.bin1 = null;
			smx = -1;
			emx = -1;

			obj.drawChrBands(false, -1, -1);
		}else {
			// Case 2 : Translocation Or Duplication
			if( obj.hasSelectedRegion === false ) {
				// Area setting complete
				obj.hasSelectedRegion = true;
			}else {
				var mx = e.offsetX;

				if( obj.selectedRegion !== undefined && obj.selectedRegion !== null ) {
					if( obj.selectedRegion.x1 < mx && obj.selectedRegion.x2 > mx ){
						var bin1 = obj.bin1;

						var bin2 = obj.getTargetBinInfo( emx, obj.chromosomeBands );
						
						// 4 Translocation to destination
						// Center of selected region
						var transPos = obj.selectedRegion.x1 + (obj.selectedRegion.x2 - obj.selectedRegion.x1)/2;

						// 데이터가 옮겨지기전의 좌표이므로 실제 이동이 된 후의 좌표로 변환해줌
//						if( transPos > bin1.x )	transPos -= (bin2.x - bin1.x);

						var dir = 1;		// Right
						if( mx - selMx < 0 ) {
							dir = -1;		// Left
						}

						var tarPos = obj.getTargetBinInfo( transPos, obj.chromosomeBands );

						if( bin1 != null && bin2 !== null ) {
							if( bin1.chr != bin2.chr ) {
								alert("Warning: 3Div is not supporting this in inter-chromosomes");
							}else {
								if( svType !== 'TRA' && ((bin1.chr !== bin2.chr) || (bin1.chr !== tarPos.chr) || (bin2.chr !== tarPos.chr)) ) {
									alert("Warning: User can only make a " + svType + " type variation in cis-chromosome");
								}else if( svType === 'TRA' && ((bin1.chr === tarPos.chr) || (bin2.chr === tarPos.chr)) ) {
									alert("Warning: User can only make a " + svType + " type variation in trans-chromosome");
								}else {
									if( bin1.bin > bin2.bin ) {
										var tmp = bin1;
										bin1 = bin2;
										bin2 = tmp;
									}

									if( svType === 'DUP' || svType === 'INVDUP' ) {
										if( dir == -1 )	tarPos.bin = bin1.bin - 1;
										else			tarPos.bin = bin2.bin + 1;
									}

									obj.addUndo( { bin1:bin1, bin2:bin2, tarPos:tarPos, svType:svType, gapDiff:(bin2.bin-bin1.bin+1) } );

									obj.controller.doGenomicVariations( bin1, bin2, tarPos, svType, true );
								}
							}
						}
	
						obj.drawChrBands(false, -1, -1);
						
						obj.hasSelectedRegion = false;
						obj.selectedRegion = null;
						obj.bin1 = null;
						smx = -1;
						emx = -1
						selMx = -1;
					}
				}else {
					obj.hasSelectedRegion = false;
					obj.selectedRegion = null;
					obj.bin1 = null;
					smx = -1;
					emx = -1
					selMx = -1;
				}
			}
		}
		
//		console.log( obj.undoStack );

		this.checkSv = null;
		isUserDefining = false;
	}
}

function mouseDownHandler(obj, e) {
	var svRadio = $('input[name=svOptions]');
	obj.selectedSvType = svRadio.filter(':checked').val();

	var svType = obj.selectedSvType;

	if(e.buttons ==1 ) {
		isUserDefining = true;

		if( svType !== 'TRA' && svType !== 'DUP' && svType !== 'INVDUP' ) {
			// DEL & INV 인 경우
			var my = e.offsetY;
			smx = e.offsetX;

			if( smx < 0 )						smx = 0;
			if( smx > chromosomeCanvas.width )	smx = chromosomeCanvas.width;

			obj.bin1 = obj.getTargetBinInfo( smx, obj.chromosomeBands );
		}else {
			// TRA && INV 인경우
			if( obj.hasSelectedRegion == false ) {
				// DEL & INV 의 경우 처럼 처음 영역 설정만 한다
				var my = e.offsetY;
				smx = e.offsetX;

				if( smx < 0 ) smx = 0;
				if( smx > chromosomeCanvas.width ) smx = chromosomeCanvas.width;

				obj.bin1 = obj.getTargetBinInfo( smx, obj.chromosomeBands );
			}else {
				var my = e.offsetY;
				var mx = e.offsetX;
				
				if( obj.selectedRegion !== undefined && obj.selectedRegion !== null ) {
					if( obj.selectedRegion.x1 < mx && obj.selectedRegion.x2 > mx ) {
						selMx = mx;
					}
				}
			}
		}
	}
}

class UserDefineCancerHiC extends CancerHiC{
	constructor(config){
		super(config);
		
		this.refreshInit();

		this.isOff = true;
		this.selectedSvType = null;	// 현재 화면에서 사용자가 지정한 SV 타입

		// isRaw 는 원본 데이터를 그리는 클래스인지 아닌지 여부
		if( this.config.isRaw == false ) {
			this.procActionListener();
		}
		this._rulerMouseEventProc();

//		// UCSC browser settings
//		$("#ucscFrame").attr('src', 'https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&hgt.labelWidth=24&pix=980&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr6%3A1%2D122000000&hgsid=857667983_ijHscKSZ60luJn4IwFTOu4dxa3ST');

		this.undoStack = [];
		this.redoStack = [];
	}
	refreshInit(){
		var card_width = $(".rearrange-contact-map-card-body").width();
		this.resolution = card_width;

		this.layerContainer = document.getElementById( this.config.layerContainer );

		this.canvas.width = this.resolution;
		this.canvas.height = this.resolution/2;
		this.canvas.style='height:' + this.canvas.height + 'px;width:' + card_width + 'px;background:#fefefe;';

		this.chromosomeCanvas.width = this.resolution;
		this.chromosomeCanvas.height = this.config.chrBandHeight * 1;
		this.chromosomeCanvas.style='height:' + this.chromosomeCanvas.height + 'px;width:' + this.canvas.width + 'px;background:#ffffff;';

		this.rullerCanvas.width = this.resolution;
		this.rullerCanvas.height = this.config.chrBandHeight * 2;
		this.rullerCanvas.style='height:' + this.rullerCanvas.height + 'px;width:' + this.canvas.width + 'px;background:#ffffff;';

		if( this.layerContainer !== undefined && this.layerContainer !== null ) {
//			// User defined rearragement of SV
//			var top = $(".rearrange-contact-map-card-body").position().top;
//			var left = $(".rearrange-contact-map-card-body").position().left;
			var top = $("#"+this.config.container).position().top;
			var left = $("#"+this.config.container).position().left;

			this.layerContainer.width = this.resolution;
			this.layerContainer.height = this.canvas.width/2;
			this.layerContainer.style='position:absolute;height:' + (this.canvas.width/2) + 'px;width:' + this.resolution + 'px;top:' + top + 'px;left:'+left+'px;z-index:9999999!default;background:none;opacity:1;';
		}
		
		if( this.config.extra_tracks !== undefined ) {
			for(var i=0; i<this.config.extra_tracks.length; i++) {
				if( this.config.extra_tracks[i] === 'superenhancer' ) {
					if( this.superEnhancerContainer === undefined || this.superEnhancerContainer === null ) {
						var selector = "superenhancer-"+this.config.type;
						
						var canvas = "";
						canvas += "<div class='row'>";
						canvas += 	"<div class='col-2 m-auto text-right'>";
						canvas += 		"<span class='badge badge-pill badge-success noselect'>Superenhancer</span>";
						canvas += 	"</div>";
						canvas += 	"<div class='col-10'>";
						canvas += 		"<canvas id='"+selector+"' class='w-100'></canvas>";
						canvas += 	"</div>";
						canvas += "</div>";

//						$(".contact-map-" + this.config.type).append("<canvas id='"+selector+"'></canvas>");
						$(".contact-map-" + this.config.type).append(canvas);
						this.superEnhancerContainer = document.getElementById( selector );
					}
					this.superEnhancerContainer.width = this.resolution;
					this.superEnhancerContainer.height = this.config.chrBandHeight * 1;
					this.superEnhancerContainer.style='height:' + this.superEnhancerContainer.height + 'px;width:' + this.superEnhancerContainer.width + 'px;background:#fdfdfd;';
				}else if( this.config.extra_tracks[i] === 'gencode' ) {
					if( this.gencodeGenesCanvas === undefined || this.gencodeGenesCanvas === null ) {
						var selector = "gencode-"+this.config.type;
						
						var canvas = "";
						canvas += "<div class='row'>";
						canvas += 	"<div class='col-2 m-auto text-right'>";
						canvas += 		"<i class='fa fa-info-circle fa-fw gencode-tooltip' aria-hidden='true' data-toggle='tooltip' title='Tooltip'></i><span class='badge badge-pill badge-info noselect'>Gencode</span>";
						canvas += 	"</div>";
						canvas += 	"<div class='col-10'>";
						canvas += 		"<canvas id='"+selector+"' class='w-100'></canvas>";
						canvas += 	"</div>";
						canvas += "</div>";

//						$(".contact-map-" + this.config.type).append("<canvas id='"+selector+"'></canvas>");
						$(".contact-map-" + this.config.type).append(canvas);
						this.gencodeGenesCanvas = document.getElementById( selector );
					}
					this.gencodeGenesCanvas.width = this.resolution;
					this.gencodeGenesCanvas.height = this.config.chrBandHeight * 1;
					this.gencodeGenesCanvas.style='height:' + this.gencodeGenesCanvas.height + 'px;width:' + this.gencodeGenesCanvas.width + 'px;background:#fafafa;';
				}else if( this.config.extra_tracks[i] === 'refseq' ) {
					if( this.refseqGenesCanvas == undefined && this.refseqGenesCanvas !== null ) {
						var selector = "refseq-"+this.config.type;
						
						var canvas = "";
						canvas += "<div class='row'>";
						canvas += 	"<div class='col-2 m-auto text-right'>";
						canvas += 		"<i class='fa fa-info-circle fa-fw refseq-tooltip' aria-hidden='true' data-toggle='tooltip' title='Tooltip' data-html='true'></i><span class='badge badge-pill badge-danger noselect'>Refseq</span>";
						canvas += 	"</div>";
						canvas += 	"<div class='col-10'>";
						canvas += 		"<canvas id='"+selector+"' class='w-100'></canvas>";
						canvas += 	"</div>";
						canvas += "</div>";

//						$(".contact-map-" + this.config.type).append("<canvas id='"+selector+"'></canvas>");
						$(".contact-map-" + this.config.type).append(canvas);
						this.refseqGenesCanvas = document.getElementById( selector );
					}
					this.refseqGenesCanvas.width = this.resolution;
					this.refseqGenesCanvas.height = this.config.chrBandHeight * 1;
					this.refseqGenesCanvas.style='height:' + this.refseqGenesCanvas.height + 'px;width:' + this.refseqGenesCanvas.width + 'px;background:#f8f8f8;';
				}
			}
		}
	}
	procActionListener() {
		var obj = this;

		this.layerContainer.addEventListener('mousemove', function(e) {
			mouseMoveEventHandler(obj, e);
//			mouseCanvasMoveEventHandler(obj, e);
		});

		this.layerContainer.addEventListener('mouseup', function(e) {
			mouseUpHandler(obj, e);
//			mouseCanvasUpEventHandler(obj, e);
		});
		this.layerContainer.addEventListener('mousedown', function(e) {
//			mouseCanvasDownEventHandler(obj, e);
		});
		
		this.layerContainer.addEventListener('contextmenu', function(e) {
			e.preventDefault();
		});

		this.chromosomeCanvas.addEventListener('mousemove', function(e) {
			mouseMoveEventHandler(obj, e);
		});

		this.chromosomeCanvas.addEventListener('mouseup', function(e) {
			mouseUpHandler(obj, e);
		});
		
		this.chromosomeCanvas.addEventListener('mousedown', function(e) {
			mouseDownHandler(obj, e);
		});
		
		this.chromosomeCanvas.addEventListener('mousemove', function(e) {
			mouseMoveEventHandler(obj, e);
		});

		this.chromosomeCanvas.addEventListener('mouseup', function(e) {
			mouseUpHandler(obj, e);
		});
		
		window.addEventListener('mouseup', function(e) {
			mouseUpHandler(obj, e);
		});
//		window.addEventListener('mousemove', function(e) {
//			mouseMoveEventHandler(obj, e);
//		});
	}
//	doGenomicVariations( bin1, bin2, tarPos, svType ) {
//		this.changeSVtypes( bin1, bin2, tarPos, svType );
//	}
//	recoveryGenomicVariations( bin1, bin2, tarPos, svType ) {
//		if( svType === 'DEL' )	{
//			this.changeSVtypes( bin1, bin2, tarPos, 'INS' );
//		}else {
//			this.changeSVtypes( bin1, bin2, tarPos, svType );
//		}
//	}
	_rulerMouseEventProc(){
		var obj = this;
		
		super._rulerMouseEventProc();

		this.rullerCanvas.addEventListener('mousemove', function(e) {
			if( obj.config.isRaw == false )	mouseMoveEventHandler(obj, e);
			obj.rulerMouseMoveHandler(obj, e);
		});

		this.rullerCanvas.addEventListener('mouseup', function(e) {
			if( obj.config.isRaw == false )	mouseUpHandler(obj, e);
		});
	}
	_pureCapturedAreaOnCanvas( x1, y1, x2, y2 ) {
		var obj = this;
		var ctx = this.layerContainer.getContext('2d');

		var oldFillStyle = ctx.fillStyle;
		var oldStrokeStyle = ctx.strokeStyle;
		// Guide line 그리기
		ctx.clearRect(0, 0, this.layerContainer.width, this.layerContainer.height);

		var diffX = (x1 + (y2-y1) - x2) / 2 ;
		ctx.strokeStyle = "orange";
		ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
		ctx.beginPath();
		ctx.moveTo( x1, y1);
		ctx.lineTo( x1-diffX, y1 + (diffX)); 
		ctx.lineTo( x2, y2 );
		ctx.lineTo( x2 + diffX, y2 - (diffX));
		ctx.lineTo(x1, y1);
		ctx.stroke();

//		ctx.fillStyle = 'green';
//		ctx.beginPath();
//		ctx.rect(0, 100, 10, 10);
//		ctx.fill();
//
//		var nCoord = rotate(0, 0, 0, 100, 45);
//		
//		ctx.fillStyle = 'pink';
//		ctx.beginPath();
//		ctx.rect(nCoord[0], nCoord[1], 10, 10);
//		ctx.fill();
//		
//		var nCoord2 = rotate(0, 0, 0, 100, 90);
//		
//		ctx.fillStyle = 'blue';
//		ctx.beginPath();
//		ctx.rect(nCoord2[0], nCoord2[1], 10, 10);
//		ctx.fill();
		
		ctx.strokeStyle = oldStrokeStyle;
		ctx.fillStyle = oldFillStyle;
	}
	_pureGuideLineDraw(bin1, bin2, type) {
		var obj = this;
		var ctx = this.layerContainer.getContext('2d');

		var oldFillStyle = ctx.fillStyle;
		var oldStrokeStyle = ctx.strokeStyle;
		// Guide line 그리기
		if( bin1 !== undefined && bin1 !== null ) {
			var x1 = bin1.bin + 0.5;
			var nRow = this.config.data[this.samples[0]].nRow;

			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(110, 255, 110, 1)';
			if( obj.config.colorPalette === 'BtoYtoR' ) ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
			ctx.beginPath();
			
			ctx.moveTo( x1, 0 );
			ctx.lineTo( x1, x1 );
			ctx.lineTo( nRow, x1 );
			ctx.stroke();
			ctx.lineWidth = 1;

//			ctx.fillText( bin1.chr + ":" + parseInt(bin1.chromPos), x1 - 5 , x1 - 5 );
		
			if( bin2 !== undefined && bin2 !== null ) {
				var x2 = bin2.bin + 0.5;

				ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
				ctx.beginPath();
				
				ctx.moveTo( x1, x1 );
				ctx.lineTo( x2, x1 );
				ctx.lineTo( x2, x2 );
				ctx.fill();
	
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgba(110, 255, 110, 1)';
				if( obj.config.colorPalette === 'BtoYtoR' ) ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
				ctx.beginPath();
				ctx.moveTo( x2, 0 );
				ctx.lineTo( x2, x2 );
				ctx.lineTo( nRow, x2 );
				ctx.stroke();
				ctx.lineWidth = 1;
			}
		}
		ctx.fillStyle = oldFillStyle;
		ctx.strokeStyle = oldStrokeStyle;
	}
	guideLineClear(){
		var obj = this;
		var ctx = this.layerContainer.getContext('2d');
		ctx.clearRect(0, 0, this.layerContainer.width, this.layerContainer.height);
	}
	guideLineDraw(bin1, bin2, type){
		var obj = this;
		var ctx = this.layerContainer.getContext('2d');
		ctx.clearRect(0, 0, this.layerContainer.width, this.layerContainer.height);

		ctx.translate( 0, this.resolution  / 2);
		ctx.rotate(-45 * Math.PI / 180);

		ctx.scale(this.drawRate, this.drawRate);
		
		this._pureGuideLineDraw(bin1, bin2, type);

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	guideLineBothDraw(bin1, bin2, nBin1, nBin2, type){
		var obj = this;
		var ctx = this.layerContainer.getContext('2d');
		ctx.clearRect(0, 0, this.layerContainer.width, this.layerContainer.height);

		ctx.translate( 0, this.resolution  / 2);
		ctx.rotate(-45 * Math.PI / 180);

		ctx.scale(this.drawRate, this.drawRate);
		
		this._pureGuideLineDraw(bin1, bin2, type);
		this._pureGuideLineDraw(nBin1, nBin2, type);

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		
//		console.log( bin1 );
//		console.log( bin2 );
//		console.log( nBin1 );
//		console.log( nBin2 );
	}
	drawSv( bin1, bin2, tarPos, svtype ) {
//		if( this.bin1 == undefined ) this.bin1 = bin1;
//		if( this.bin2 == undefined ) this.bin1 = bin1;
//		if( this.tarPos == undefined ) this.tarPos = tarPos;
//		if( this.svType == undefined ) this.svType = svtype;

		var obj = this;
		var ctx = obj.canvas.getContext('2d');

		ctx.translate( 0, this.resolution  / 2);
		ctx.rotate(-45 * Math.PI / 180);

		ctx.scale(this.drawRate, this.drawRate);

		var diff = bin2.bin - bin1.bin + 1;

		var bin1Bin = bin1.bin;
		var bin2Bin = bin2.bin;
		if( svtype === 'TRA'  && obj.config.container === 'cancerHiCcanvas' ) {
			bin2Bin = bin1Bin;
		}else if( svtype === 'TRA' && obj.config.container !== 'cancerHiCcanvas' ) {
			diff = 0;
		}else if( svtype === 'DUP' || svtype === 'INVDUP' && obj.config.container !== 'cancerHiCcanvas' ) {
			tarPos = bin1;
			diff = 0;
		}

		var oldFillStyle = ctx.fillStyle;
		var oldStrokeStyle = ctx.strokeStyle;
		var oldStrokeWidth = ctx.strokeWidth;
		var x1 = bin1Bin;
//		var x2 = bin2.bin + (bin2.bin - bin1.bin+1) - 1;
		var x2 = bin2Bin + 1;
		
		if( x1 < 0 ) 										x1 = 0;
		if( x2 > obj.config.data[ obj.samples[0] ].nRow )	x2 = obj.config.data[ obj.samples[0] ].nRow;

//		if( !(svtype === 'TRA' && this.config.isRaw == false ) ) {
			if( (obj.config.isRaw == true || svtype !== 'DEL') ) {
//				ctx.strokeStyle = 'black';
				ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
				ctx.strokeWidth=1;
				ctx.fillStyle = getSvColour( svtype );
				ctx.beginPath();
				ctx.moveTo( x1, 0);
				ctx.lineTo( x1, x1 );
				ctx.lineTo( x2, x2);
				ctx.lineTo( x2, 0);
				ctx.lineTo( x1, 0 );
				ctx.fill();

				ctx.beginPath();
				ctx.moveTo( x1, x1);
				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1 );
				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x2);
				ctx.lineTo( x2, x2);
				ctx.lineTo( x1, x1 );
				ctx.fill();
				
//				console.log("Call here1  " + obj.config.isRaw + "  " + ctx.fillStyle );
				ctx.beginPath();
				ctx.moveTo( x1 + 0.5, 0);
				ctx.lineTo( x1 + 0.5, x1 + 0.5 );
				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1 + 0.5);
				ctx.moveTo( obj.config.data[ obj.samples[0] ].nRow, x2 + 0.5);
				ctx.lineTo( x2 + 0.5, x2 + 0.5 );
				ctx.lineTo( x2 + 0.5, 0);
//				ctx.moveTo( x1, 0);
//				ctx.lineTo( x1, x1 );
//				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1);
//				ctx.moveTo( obj.config.data[ obj.samples[0] ].nRow, x2);
//				ctx.lineTo( x2, x2 );
//				ctx.lineTo( x2, 0);
				ctx.stroke();
				
				ctx.fillStyle = oldFillStyle;
				ctx.strokeStyle = oldStrokeStyle;
				ctx.strokeWidth = oldStrokeWidth;
			}else {
//				ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
//				ctx.strokeWidth=1;
//				ctx.beginPath();
//				ctx.moveTo( x1, 0);
//				ctx.lineTo( x1, x1 );
//				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1);
//				ctx.stroke();
				ctx.fillStyle = oldFillStyle;
				ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
				ctx.beginPath();
				ctx.moveTo( x1 + 0.5, 0);
				ctx.lineTo( x1 + 0.5, x1 + 0.5 );
				ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x1 + 0.5 );
				ctx.stroke();
				
				ctx.fillStyle = oldFillStyle;
				ctx.strokeStyle = oldStrokeStyle;
				ctx.strokeWidth = oldStrokeWidth;
			}
//		}

//		if( (svtype === 'TRA' && this.config.isRaw == false ) || svtype === 'DUP'  ) {
		if( svtype === 'TRA'|| svtype === 'DUP'  || svtype === 'INVDUP' ) {
			var x3 = tarPos.bin;
			
//			console.log("Call here2  " + obj.config.isRaw + "  " + ctx.fillStyle + "   x1=" + x1 + " vs x3=" + x3 );

			ctx.strokeWidth = 1;
			ctx.strokeStyle = REARRANGED_COLOR
//			ctx.strokeStyle = 'orange';
			ctx.beginPath();
			ctx.moveTo( x3, 0);
			ctx.lineTo( x3, x3 );
			ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x3);
			ctx.stroke();

//			console.log( (bin2.bin) + " " + bin1.bin + "  => " + this.config.isRaw );
			ctx.beginPath();
			ctx.moveTo( x3 + diff, 0);
			ctx.lineTo( x3 + diff, x3 + diff );
			ctx.lineTo( obj.config.data[ obj.samples[0] ].nRow, x3 + diff);
			ctx.stroke();

			ctx.strokeStyle = oldStrokeStyle;
			ctx.strokeWidth = oldStrokeWidth; 
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	draw(){
		super.draw();
		
		var obj = this;
	}
	serialWorks( works ) {
		var obj = this;
//		console.log( "bf nRow ", obj.config.data[ obj.samples[0] ].nRow );

//		console.log("af", obj.undoStack);
		
		$(".historyBtn").addClass("disabled");
		if(typeof(webworker) == "undefined") {
		    const worker = new Worker("resources/js/cancerhic/worker/procSvDataTypeWorker.js");

		    worker.postMessage( [obj.config, works] );

		    worker.addEventListener('message', function(e) {
		    	console.log('Serial Worker said: ', e.data[1]);

		    	obj.config = e.data[0];

				//console.log( "af nRow ", obj.config.data[ obj.samples[0] ].nRow );
		    	obj.drawRate = (obj.resolution - (2*obj.margin)) / ( obj.config.data[ obj.samples[0] ].nRow * Math.sqrt(2) );
		    	for(var i=0; i<works.length; i++) {
		    		obj.reInitChromosomeBands( works[i].svType, works[i].bin1, works[i].bin2, works[i].tarPos );
			    	obj.drawChrBands(false, -1, -1);

			    	//obj.reInitRuller( works[i].svType, works[i].bin1, works[i].bin2, works[i].tarPos );
		    	}

		    	obj.drawRuller();
		    	obj.drawContactMap();

		    	if( obj.config.superenhancer !== undefined )	obj.drawSuperEnhancer();
		    	if( obj.config.gencode !== undefined )			obj.drawGencodeGenes();
		    	if( obj.config.refseq !== undefined )			obj.drawRefseqGenes();

		    	if( works.length > 0 ){
			    	var lastWorkItem = works[works.length - 1];

		    		var diff = lastWorkItem.bin2.bin - lastWorkItem.bin1.bin - 1;
		    		var nBin1 = JSON.parse(JSON.stringify(lastWorkItem.bin1));
		    		var nBin2 = JSON.parse(JSON.stringify(lastWorkItem.bin2));
		    		var nTarBin = lastWorkItem.tarPos !== undefined && lastWorkItem.tarPos != null ? JSON.parse(JSON.stringify(lastWorkItem.tarPos)) : null;
		    		if( lastWorkItem.svType === 'TRA' ) {
			    		nTarBin = JSON.parse(JSON.stringify(lastWorkItem.tarPos));

		    			if( lastWorkItem.bin2.bin < lastWorkItem.tarPos.bin ){
			    			// 왼쪽으로 새로운 데이터가 추가되므로 기존 가이드는 오른쪽으로 이동시켜줘야 함
		    				nTarBin.bin -= diff;
			    		}else {
			    			nBin1.bin += diff;
			    			nBin2.bin += diff;
			    		}
		    		}

			    	if( obj.controller.viewer !== undefined )
			    		obj.drawSv( nBin1, nBin2, nTarBin, lastWorkItem.svType );
			    	
			    	if( obj.controller.originDataViewer !== undefined ){
			    		obj.controller.redrawRawSv( lastWorkItem.bin1, lastWorkItem.bin2, lastWorkItem.tarPos, lastWorkItem.svType, e.data[0].data[ obj.samples[0] ].picked_points );
			    	}
//					obj.controller.originDataViewer.drawSv( lastWorkItem.bin1, lastWorkItem.bin2, lastWorkItem.tarPos, lastWorkItem.svType );
		    	}
		    	
		    	obj.changeUndoAndRedoStatus();

		    	worker.terminate();
	    	}, false);
		}
	}
	changeUndoAndRedoStatus() {
		if( this.undoStack.length > 0 )	$(".btnUndo").removeClass("disabled");
		else							$(".btnUndo").addClass("disabled");
		
		if( this.redoStack.length > 0 )	$(".btnRedo").removeClass("disabled");
		else							$(".btnRedo").addClass("disabled")
	}
	addUndo( obj ) {
//		if( this.undoStack.length > 5 ) {
//			this.undoStack.shift();
//			this.undoStack.push(obj);
//		}else {
//			this.undoStack.push(obj);
//		}
		this.undoStack.push(obj);

//		console.log( this.undoStack.length );

		this.changeUndoAndRedoStatus();
	}
	popUndo() {
		var item = this.undoStack.pop();
		this.changeUndoAndRedoStatus();
		
		return item;
	}
	addRedo( obj ){
//		if( this.redoStack.length > 5 ) {
//			this.redoStack.pop();
//			this.redoStack.unshift(obj);
//		}else {
//			this.redoStack.unshift(obj);
//		}
		this.redoStack.unshift(obj);
		this.changeUndoAndRedoStatus();
	}
	popRedo(){
		var item = this.redoStack.shift();
		this.changeUndoAndRedoStatus();

		return item;
	}
//	initChromosomeBands( drawRate ){
//		var chromosomeBandY = 0;
//		this.chromosomeBands = [];
//		var sx = this.margin;
//		var idx = 0;
//		var height = this.config.chrBandHeight;
//		for( var i=0; i<Object.keys(this.config.data[this.samples[0]].genomeSize).length; i++){
//			var chr = Object.keys(this.config.data[this.samples[0]].genomeSize)[i];
//			var chrWithoutIdx = chr.split('-')[0];
//			
//			var chromosomeNoOfBin = this.config.data[this.samples[0]].genomeSize[chr];
//
//			var width = (chromosomeNoOfBin * Math.sqrt(2)) * drawRate;
//			
//			var scale = d3.scaleLinear()
//			.range([idx, idx + chromosomeNoOfBin - 1])
//			.domain([sx, sx + width]);
//
//			if( this.config.userRegions[i] !== undefined ) {
//				var genomicPos = getSplittedRegion( this.config.userRegions[i] );
//				
//				var genomicScale = d3.scaleLinear()
//				.domain([ parseInt(genomicPos.chromStart), parseInt(genomicPos.chromEnd)])
//				.range([sx, sx + width]);
//	
//				// 각각의 입력된 region의 
//				this.chromosomeBands.push( 
//					{
//						x:sx
//						, y:chromosomeBandY
//						, width:width
//						, height:height
//						, scale:scale
//						, chrom:chrWithoutIdx
//						, chromStart:parseInt(genomicPos.chromStart)
//						, chromEnd:parseInt(genomicPos.chromEnd)
//						, binSize:chromosomeNoOfBin
//						, genomicScale:genomicScale
//					} 
//				);
//	
//				sx += width;
//				idx += chromosomeNoOfBin;
//			}
//		}
//	}
	initMouse(){
		console.log("Initialized mouse configuration");

		smx = -1;
		smy = -1;
		emx = -1;
		selMx = -1;
		bin1 = null;
		isUserDefining = false;
		
		this.hasSelectedRegion = false;
		this.selectedRegion = null;
	}
}