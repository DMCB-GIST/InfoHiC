function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}

class SVObject {
	constructor(params) {
		this.config = params.config;
		this.bin1 = params.bin1;
		this.bin2 = params.bin2;
		this.tarPos = params.tarPos;
		this.svType = params.svType;
		this.gapDiff = params.gapDiff;

		this.samples = Object.keys( this.config.data );
		
		this.init();
	}

	init() {
		this.computePixels = this.samples.length * 
		(
				this.config.data[this.samples[0]]['data'].length 
				+ (this.bin1.bin * (this.bin2.bin - this.bin1.bin + 1)) 
				+ ((this.config.data[this.samples[0]].nRow - this.bin2.bin + 1) * (this.bin2.bin - this.bin1.bin + 1)) 
				+ (((this.bin2.bin-this.bin1.bin +1) * (this.bin2.bin-this.bin1.bin+1))/2)
		);
	}
	insertion(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			var diffBin = this.bin2.bin - this.bin1.bin + 1;

			var sampleData = this.config.data[sample];

			var newData = [];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];
				
				if( point.iRow < this.bin1.bin && point.iCol < this.bin1.bin ) {
					newData.push( point );
				}else if( point.iRow >= this.bin1.bin && point.iCol <= this.bin1.bin ) {
					point.iRow += diffBin;

					newData.push(point);
				}else if( point.iRow > this.bin1.bin && point.iCol > this.bin1.bin ) {
					point.iCol += diffBin;
					point.iRow += diffBin;

					newData.push(point);
				}
			}

			this.config.data[sample]['data'] = newData;
			this.config.data[sample]['nRow'] += diffBin;
			this.config.data[sample]['nCol'] += diffBin;
		}
	}
	duplication() {
		if( this.bin1.bin > this.tarPos.bin )	this.leftDuplication();
		else									this.rightDuplication();
	}
	leftDuplication(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			var diff = this.bin2.bin - this.bin1.bin + 1;

			var newData = [];
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];

				if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol < this.bin1.bin ) {
					point.intensity *= 2;
				}else if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.intensity *= 2;
				}else if( point.iRow > this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.intensity *= 2;
				}

				newData.push( point );
//				if( point.iRow < this.tarPos.bin && point.iCol < this.tarPos.bin ) {
//					newData.push( point );
//				}else if( point.iRow >= this.tarPos.bin && point.iCol < this.tarPos.bin ) {
//					if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol < this.bin1.bin ) {
//						var nPoint = jsonCopy( point );
//						nPoint.iRow = this.tarPos.bin + (nPoint.iRow - this.bin1.bin);
//
//						newData.push(nPoint);
//					}
//					point.iRow += diff;
//					newData.push( point );
//				}else if( point.iRow >= this.tarPos.bin && point.iCol >= this.tarPos.bin ) {
//					// 여기 문제
//					if( point.iRow >= this.bin1.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
//						var nPoint = jsonCopy( point );
//						nPoint.iRow += diff;
//						nPoint.iCol = this.tarPos.bin + (nPoint.iCol - this.bin1.bin);
//						newData.push(nPoint);
//					}
//					if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
//						var nPoint = jsonCopy( point );
//
//						nPoint.iRow = this.bin1.bin + (this.bin2.bin - nPoint.iRow) + diff;
//						nPoint.iCol = this.bin1.bin + (this.bin2.bin - nPoint.iCol) ;
//						
//						newData.push(nPoint);
//					}
//
//					if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol > this.tarPos.bin ) {
//						var nPoint = jsonCopy( point );
//
//						nPoint.iRow = this.tarPos.bin + (nPoint.iRow - this.bin1.bin);
//						nPoint.iCol = this.tarPos.bin + (nPoint.iCol - this.bin1.bin);
//						
//						newData.push(nPoint);
//					}
//					
//					point.iRow += diff;
//					point.iCol += diff;
//
//					newData.push( point );
//				}
			}

			this.config.data[sample]['data'] = newData;
//			this.config.data[sample]['nRow'] = this.config.data[sample]['nRow'] + diff;
//			this.config.data[sample]['nCol'] = this.config.data[sample]['nCol'] + diff;
		}
	}
	rightDuplication(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			var diff = this.bin2.bin - this.bin1.bin + 1;

			var newData = [];
			var sampleData = this.config.data[sample];

			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];
				
				if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol < this.bin1.bin ) {
					point.intensity *= 2;
				}else if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.intensity *= 2;
				}else if( point.iRow > this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.intensity *= 2;
				}
				newData.push( point );

//				if( point.iRow < this.tarPos.bin && point.iCol < this.tarPos.bin ) {
//					newData.push( point );
//					
//					if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol < this.bin2.bin ) {
//						var nPoint = jsonCopy( point );
//						nPoint.iRow = this.tarPos.bin + (nPoint.iRow - this.bin1.bin);
//						newData.push( nPoint );
//					}
//					if( point.iRow >= this.bin1.bin && point.iRow <= this.tarPos.bin + diff && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
//						var nPoint = jsonCopy( point );
//						
//						var tmp = nPoint.iRow;
//						nPoint.iRow = this.bin2.bin + ((this.tarPos.bin + diff) -this.bin2.bin) + (nPoint.iCol - this.bin2.bin);
//						nPoint.iCol = this.bin2.bin + (tmp - this.bin2.bin );
//						
//						newData.push(nPoint);
//					}
//					if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
//						var nPoint = jsonCopy( point );
//
//						nPoint.iRow = this.bin2.bin + (nPoint.iRow - this.bin1.bin);
//						nPoint.iCol = this.bin2.bin + (nPoint.iCol - this.bin1.bin);
//
//						newData.push(nPoint);
//					}
//				}else if( point.iRow >= this.tarPos.bin && point.iCol <= this.bin1.bin ) {
//					point.iRow += diff;
//					newData.push( point );
//				}else if( point.iRow >= this.tarPos.bin && point.iCol >= this.bin1.bin && point.iCol < this.tarPos.bin ) {
//					point.iRow += diff;
//					newData.push( point );
//
//					if( point.iRow >= this.tarPos.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
//						var nPoint = jsonCopy(point);
//						nPoint.iCol += (this.tarPos.bin - this.bin1.bin);
//						newData.push( nPoint );
//					}
//				}else if( point.iRow > this.tarPos.bin && point.iCol > (this.tarPos.bin) ) {
//					point.iRow += diff;
//					point.iCol += diff;
//
//					newData.push( point );
//				}
				
			}
			
			this.config.data[sample]['data'] = newData;
//			this.config.data[sample]['nRow'] = this.config.data[sample]['nRow'] + diff;
//			this.config.data[sample]['nCol'] = this.config.data[sample]['nCol'] + diff;
		}
	}
	translocation() {
		if( this.bin1.bin > this.tarPos.bin )	this.leftTranslocation();
		else									this.rightTranslocation();
	}
	leftTranslocation(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			var diff = this.bin2.bin - this.bin1.bin + 1;

			var newData = [];
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];
				
				if( point.iRow < this.tarPos.bin && point.iCol < this.tarPos.bin ) {
					newData.push( point );
				}else if( point.iRow > this.tarPos.bin && point.iRow < this.bin1.bin && point.iCol < this.tarPos.bin ) {
					point.iRow += diff;
					newData.push( point );
				}else if( point.iRow > this.bin2.bin && point.iCol < this.tarPos.bin ) {
					newData.push( point );
				}else if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol <= this.tarPos.bin ) {
					point.iRow = point.iRow - (this.bin1.bin - this.tarPos.bin);
					newData.push( point );
				}else if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.iRow = point.iRow - (this.bin1.bin - this.tarPos.bin);
					point.iCol = point.iCol - (this.bin1.bin - this.tarPos.bin);
					
					newData.push(point);
				}else if( point.iRow > this.tarPos.bin && point.iRow < this.bin1.bin && point.iCol > this.tarPos.bin && point.iCol < this.bin1.bin ) {
					point.iRow += diff;
					point.iCol += diff;
					newData.push(point);
				}else if( point.iRow > this.bin2.bin && point.iCol > this.tarPos.bin && point.iCol < this.bin1.bin ) {
					point.iCol += diff;
					newData.push(point);
				}else if( point.iRow > this.bin2.bin && point.iCol > this.bin2.bin ) {
					newData.push( point );
				}else if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol >= (this.tarPos.bin) && point.iCol <= this.bin1.bin ) {
					point.iRow = point.iRow - (this.bin1.bin - this.tarPos.bin);
					point.iCol = point.iCol - (this.bin1.bin - this.tarPos.bin);

					var tmp = point.iRow;
					point.iRow = point.iCol + (this.bin1.bin - this.tarPos.bin) + diff;
					point.iCol = tmp;

					newData.push( point );
				}else if( point.iRow >= this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.iCol = point.iCol - (this.bin1.bin - this.tarPos.bin);
					
					newData.push( point );
				}
			}

			this.config.data[sample]['data'] = newData;
		}
	}
	rightTranslocation(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			var diff = this.bin2.bin - this.bin1.bin + 1;

			var newData = [];
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];

				if( point.iRow < this.bin1.bin && point.iCol < this.bin1.bin ) {
					newData.push( point );
				}else if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol <= this.bin1.bin ) {
					var gap = (this.tarPos.bin - diff) - this.bin1.bin;

					point.iRow = (this.tarPos.bin - diff) + (point.iRow - this.bin1.bin);
					newData.push( point );
				}else if( point.iRow > this.bin2.bin && point.iRow < (this.tarPos.bin + diff) && point.iCol <= this.bin1.bin ) {
					var gap = this.tarPos.bin - this.bin1.bin;
					
					point.iRow -= diff;
					newData.push( point );
				}else if( point.iRow > (this.tarPos.bin + diff) && point.iCol <= this.bin1.bin ) {
					newData.push( point );
				}else if( point.iRow > this.bin2.bin && point.iRow <= (this.tarPos.bin) && point.iCol > this.bin2.bin && point.iCol <= (this.tarPos.bin) ) {
					point.iRow -= diff;
					point.iCol -= diff;
					newData.push( point );
				}else if( point.iRow > (this.tarPos.bin) && point.iCol > this.bin2.bin && point.iCol <= this.tarPos.bin ) {
					point.iCol -= diff;
					newData.push( point );
				}else if( point.iRow > (this.tarPos.bin) && point.iCol > (this.tarPos.bin) ) {
					newData.push( point );
				}else if( point.iRow >= this.bin2.bin && point.iRow <= (this.tarPos.bin + diff) && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					var tmp = point.iCol;
					point.iCol = point.iRow - diff;
					point.iRow = (this.tarPos.bin - diff) + (tmp - this.bin1.bin);

					newData.push( point );
				}else if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.iRow = (this.tarPos.bin - diff) + (point.iRow - this.bin1.bin);
					point.iCol = (this.tarPos.bin - diff) + (point.iCol - this.bin1.bin);
					newData.push( point );
				}else if( point.iRow > this.tarPos.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ){
					point.iCol = this.tarPos.bin + (point.iCol - this.bin1.bin);

					newData.push( point );
				}
			}
			
			this.config.data[sample]['data'] = newData;
		}
	}
	deletion(){
//		console.log("gapDiff", this.gapDiff);
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			//var diff = this.bin2.bin - this.bin1.bin + 1;
			var diff = this.gapDiff;

			var nDimRow = this.config.data[sample]['nRow'] - diff;
			var nDimCol = this.config.data[sample]['nCol'] - diff;

			var newData = [];
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];
				
				if( (point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin) || (point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin) ) {
					continue;
				}else if( point.iRow > this.bin2.bin && point.iCol < this.bin1.bin ){
					point.iRow -= diff;

					if( point.iRow >= 0 && point.iRow < nDimRow )														newData.push( point );
				}else if( point.iRow > this.bin2.bin && point.iCol > this.bin2.bin){
					point.iCol -= diff;
					point.iRow -= diff;

					if( point.iRow >= 0 && point.iRow < nDimRow && point.iCol >= 0 && point.iCol < nDimCol )			newData.push( point );
				}else {
					if( point.iRow >= 0 && point.iRow < nDimRow && point.iCol >= 0 && point.iCol < nDimCol )			newData.push( point );
				}
			}

			this.config.data[sample]['data'] = newData;
			this.config.data[sample]['nRow'] = nDimRow;
			this.config.data[sample]['nCol'] = nDimCol;
		}
	}
	inversion() {
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			var nPoints = [];
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];

				if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol < this.bin1.bin ) {
					point.iRow = (this.bin2.bin - point.iRow) + this.bin1.bin;

					if( point.iRow >= 0 && point.iRow < sampleData.nRow )														nPoints.push( point );
				}else if( point.iRow > this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.iCol = (this.bin2.bin - point.iCol) + this.bin1.bin;
					
					if( point.iCol >= 0 && point.iCol < sampleData.nCol )														nPoints.push( point );
				}else if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					var nx = (this.bin2.bin - point.iRow) + this.bin1.bin;
					var ny = (this.bin2.bin - point.iCol) + this.bin1.bin;

//					console.log( "bin1=" + this.bin1.bin + ", bin2=" + this.bin2.bin + " (" + point.iRow + ", " + point.iCol + ") ===> (" + nx + ", " + ny + ") : " + point.intensity );
					point.iCol = nx;
					point.iRow = ny;
					
					if( point.iRow >= 0 && point.iRow < sampleData.nRow && point.iCol >= 0 && point.iCol < sampleData.nCol ) 	nPoints.push( point );
				}else {
					if( point.iRow >= 0 && point.iRow < sampleData.nRow && point.iCol >= 0 && point.iCol < sampleData.nCol )	nPoints.push( point );
				}
			}
			this.config.data[sample]['data'] = nPoints;
		}
	}
	trimming() {
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];
			
			var nRow = this.config.data[sample]['nRow'];

			var nPoints = [];
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];
				
				if( point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin && point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) {
					point.iRow -= this.bin1.bin;
					point.iCol -= this.bin1.bin;

					nPoints.push( point );
				}
			}

			this.config.data[sample]['data'] = nPoints;
			this.config.data[sample]['nRow'] = this.gapDiff;
			this.config.data[sample]['nCol'] = this.gapDiff;
		}
	}
	setClickedPoint() {
		var b1p = null;
		var b2p = null;
		var trp = null;
		
		var bool1 = false;
		var bool2 = false;
		var bool3 = false;

		var sample = this.samples[0];

		var sampleData = this.config.data[sample];
		for(var j=0; j<sampleData['data'].length; j++) {
			var point = sampleData['data'][j];
			
			// 일치하는 데이터가 없는 경우도 있을 수 있다. 이경우 처리 해야 함
			if( point.iRow == this.bin1.bin )	{ b1p = point;	bool1 = true; };
			if( point.iRow == this.bin2.bin )	{ b2p = point;	bool2 = true; };
			if( this.tarPos !== undefined && this.tarPos !== null ){
				if( point.iRow == this.tarPos.bin )	{ trp = point;	bool3 = true; };
			}else {
				bool3 = true;
			}

			if( bool1 && bool2 && bool3 ){
				break;
			}
		}

		this.config.data[sample]['picked_points'] = {b1p:b1p, b2p:b2p, trp:trp};
	}
	
	procDeletionFeaturesInExtrTracks( dataset ) {
		var diff = this.bin2.bin - this.bin1.bin + 1;

		var regions = Object.keys(dataset);
		for(var i=0; i<regions.length; i++) {
			var features = dataset[ regions[i] ];

			var newFeatures = [];
			for(var j=0; j<features.length; j++) {
				if( features[j].endBin < this.bin1.bin ) {
					newFeatures.push( features[j] );
				}else if( features[j].startBin > this.bin2.bin ) {
					features[j].startBin -= diff;
					features[j].endBin -= diff;

					newFeatures.push( features[j] );
				}
			}

//			console.log(regions[i] + " result","  => " + newFeatures.length + " vs " + features.length + " " + this.bin1.bin + " vs " + this.bin2.bin );
			dataset[ regions[i] ] = newFeatures;
		}
	}
	
	procInversionFeaturesInExtrTracks( dataset ) {
		var diff = this.bin2.bin - this.bin1.bin + 1;

		var regions = Object.keys(dataset);
		for(var i=0; i<regions.length; i++) {
			var features = dataset[ regions[i] ];

			var newFeatures = [];
			for(var j=0; j<features.length; j++) {
				if( features[j].endBin < this.bin1.bin ) {
					newFeatures.push( features[j] );
				}else if( features[j].startBin > this.bin2.bin ) {
					newFeatures.push( features[j] );
				}else {
					features[j].startBin = this.bin2.bin - features[j].startBin + this.bin1.bin;
					features[j].endBin = this.bin2.bin - features[j].endBin + this.bin1.bin;
					
					if( features[j].strand === '+' )	features[j].strand = '-';
					else								features[j].strand = '+';

					newFeatures.push( features[j] );
				}
			}
			dataset[ regions[i] ] = newFeatures;
		}
	}
	
	procTranslocationFeaturesInExtrTracks( dataset ) {
		var diff = this.bin2.bin - this.bin1.bin + 1;

		var regions = Object.keys(dataset);
		for(var i=0; i<regions.length; i++) {
			var features = dataset[ regions[i] ];

			var newFeatures = [];
			for(var j=0; j<features.length; j++) {
				if( this.bin1.bin > this.tarPos.bin ) {
					// Left translocation
					if( features[j].endBin < this.tarPos.bin ) {
						newFeatures.push( features[j] );
					}else if( features[j].startBin >= this.bin1.bin && features[j].endBin <= this.bin2.bin ) {
//						console.log( (this.tarPos.bin - this.bin1.bin + 1) + "    " + this.tarPos.bin + " vs " + this.bin1.bin );
//						var v1 = features[j].startBin;
//						var v2 = features[j].endBin;
						features[j].startBin -= (this.bin1.bin - this.tarPos.bin + 1);
						features[j].endBin -= (this.bin1.bin - this.tarPos.bin + 1);

//						console.log( features[j].startBin + "("+v1+")" + " vs " + features[j].endBin+"("+v2+")      diff=" + (this.bin1.bin - this.tarPos.bin + 1) );
						newFeatures.push( features[j] );
					}else if( features[j].startBin > this.tarPos.bin && features[j].endBin < this.bin1.bin ) {
						features[j].startBin += diff;
						features[j].endBin += diff;

						newFeatures.push( features[j] );						
					}else if( features[j].startBin > this.bin2.bin ) {
						newFeatures.push( features[j] );
					}
				}else if( this.bin2.bin < this.tarPos.bin ) {
					// Right translocation
					if( features[j].endBin < this.bin1.bin ) {
						newFeatures.push( features[j] );
					}else if( features[j].startBin >= this.bin1.bin && features[j].endBin <= this.bin2.bin ) {
						features[j].startBin += (this.tarPos.bin - this.bin1.bin + 1) - diff;
						features[j].endBin += (this.tarPos.bin - this.bin1.bin + 1) - diff;

						newFeatures.push( features[j] );
					}else if( features[j].startBin > this.bin1.bin && features[j].endBin < this.tarPos.bin ) {
						features[j].startBin -= diff;
						features[j].endBin -= diff;

						newFeatures.push( features[j] );
					}else if( features[j].startBin > this.tarPos.bin ) {
						newFeatures.push( features[j] );
					}
				}
			}
			dataset[ regions[i] ] = newFeatures;
		}
	}
	
	procDuplicationFeaturesInExtrTracks( dataset ) {
		var diff = this.bin2.bin - this.bin1.bin + 1;
		var regions = Object.keys(dataset);
		for(var i=0; i<regions.length; i++) {
			var features = dataset[ regions[i] ];

			var newFeatures = [];
			for(var j=0; j<features.length; j++) {
				if( this.bin1.bin > this.tarPos.bin ) {
					if( features[j].endBin < this.tarPos.bin ) {
						newFeatures.push( features[j] );
					}else if( features[j].startBin >= this.tarPos.bin ) {
						if( features[j].startBin >= this.bin1.bin && features[j].endBin <= this.bin2.bin ) {
							var newFeature = jsonCopy( features[j] );
							newFeature.startBin = this.tarPos.bin + (newFeature.startBin - this.bin1.bin);
							newFeature.endBin = this.tarPos.bin + (newFeature.endBin - this.bin1.bin);
							
							newFeatures.push( newFeature );
						}

						features[j].startBin += diff;
						features[j].endBin += diff;
						newFeatures.push( features[j] );
					}
				}else if( this.bin2.bin < this.tarPos.bin ) {
					if( features[j].endBin < this.tarPos.bin ) {
						newFeatures.push( features[j] );
						
						if( features[j].startBin >= this.bin1.bin && features[j].endBin <= this.bin2.bin ) {
							var newFeature = jsonCopy( features[j] );
							newFeature.startBin = this.tarPos.bin + (newFeature.startBin - this.bin1.bin);
							newFeature.endBin = this.tarPos.bin + (newFeature.endBin - this.bin1.bin);
							
							newFeatures.push( newFeature );
						}
					}else if( features[j].startBin > this.tarPos.bin ) {
						features[j].startBin += diff;
						features[j].endBin += diff;

						newFeatures.push( features[j] );
					}
				}
			}
			dataset[ regions[i] ] = newFeatures;
		}
	}

	procTrimmingFeaturesInExtrTracks( dataset ) {
		var diff = this.bin2.bin - this.bin1.bin + 1;
		var regions = Object.keys(dataset);
		for(var i=0; i<regions.length; i++) {
			var features = dataset[ regions[i] ];

			var newFeatures = [];
			for(var j=0; j<features.length; j++) {
				if( features[j].startBin >= this.bin1.bin && features[j].endBin <= this.bin2.bin ) {
					features[j].startBin -= this.bin1.bin;
					features[j].endBin -= this.bin1.bin;

					newFeatures.push( features[j].startBin );
				}
			}
		}
	}
}

function doInBackground( config, bin1, bin2, tarBin, svType, gapDiff ){
	var params = {
			config : config
			, bin1 : bin1
			, bin2 : bin2
			, tarPos : tarBin
			, svType : svType
			, gapDiff : gapDiff
	};
	
	const svObject = new SVObject( params );

	var areaPoints = svObject.setClickedPoint();
	
//	console.log( "gapDiff", gapDiff );
	// Processing contact map data
	if( svType === 'INV' )			svObject.inversion();
	else if( svType === 'DEL' )		svObject.deletion();
	else if( svType === 'TRA' )		svObject.translocation();
	else if( svType === 'DUP' )		svObject.duplication();
	else if( svType === 'INS' )		svObject.insertion();
	else if( svType === 'INVDUP')	{
		svObject.duplication();

		//var diff = bin2.bin - bin1.bin + 1;
		var diff = gapDiff;
		var nBin1 = bin2.bin + 1;
		var nBin2 = bin2.bin + diff;
		if( bin1.bin > tarBin.bin )	{
			// Left Duplicatoin
			nBin1 = bin1.bin - diff;
			nBin2 = bin1.bin - 1;
		}

		svObject.inversion();
	}else if( svType === 'CUT' )	svObject.trimming();
	
	// Processing 4 SuperEnhancers
	if( config.superenhancer !== undefined ) {
		if( svType === 'INV' )			svObject.procInversionFeaturesInExtrTracks( config.superenhancer );
		else if( svType === 'DEL' )		svObject.procDeletionFeaturesInExtrTracks( config.superenhancer );
		else if( svType === 'TRA' )		svObject.procTranslocationFeaturesInExtrTracks( config.superenhancer );
		else if( svType === 'CUT' )		svObject.procTrimmingFeaturesInExtrTracks( config.superenhancer );
//		else if( svType === 'DUP' )		svObject.procDuplicationFeaturesInExtrTracks( config.superenhancer );
//		else if( svType === 'INVDUP')	{
//			svObject.procDuplicationFeaturesInExtrTracks( config.superenhancer );
//
//			if( bin1.bin > tarBin.bin )	{
//				var diff = bin2.bin - bin1.bin + 1;
//				bin2.bin = bin1.bin - 1;
//				bin1.bin = bin2.bin - diff;
//			}else{
//				var diff = bin2.bin - bin1.bin + 1;
//				bin1.bin = bin2.bin;
//				bin2.bin = bin1.bin + diff;			
//			}
//			svObject.bin1 = bin1;
//			svObject.bin2 = bin2;
//
//			svObject.procInversionFeaturesInExtrTracks( config.superenhancer );
//		}else if( svType === 'INS' ) {
//		}
	}

	if( config.gencode !== undefined ) {
		if( svType === 'INV' )			svObject.procInversionFeaturesInExtrTracks( config.gencode );
		else if( svType === 'DEL' )		svObject.procDeletionFeaturesInExtrTracks( config.gencode );
		else if( svType === 'TRA' )		svObject.procTranslocationFeaturesInExtrTracks( config.gencode );
		else if( svType === 'CUT' )		svObject.procTrimmingFeaturesInExtrTracks( config.gencode );
//		else if( svType === 'DUP' )		svObject.procDuplicationFeaturesInExtrTracks( config.gencode );
//		else if( svType === 'INVDUP')	{
//			svObject.procDuplicationFeaturesInExtrTracks( config.gencode );
//
//			if( bin1.bin > tarBin.bin )	{
//				var diff = bin2.bin - bin1.bin + 1;
//				bin2.bin = bin1.bin - 1;
//				bin1.bin = bin2.bin - diff;
//			}else{
//				var diff = bin2.bin - bin1.bin + 1;
//				bin1.bin = bin2.bin;
//				bin2.bin = bin1.bin + diff;			
//			}
//			svObject.bin1 = bin1;
//			svObject.bin2 = bin2;
//
//			svObject.procInversionFeaturesInExtrTracks( config.gencode );
//		}else if( svType === 'INS' ) {
//		}
	}

	if( config.refseq !== undefined ) {
		if( svType === 'INV' )			svObject.procInversionFeaturesInExtrTracks( config.refseq );
		else if( svType === 'DEL' )		svObject.procDeletionFeaturesInExtrTracks( config.refseq );
		else if( svType === 'TRA' )		svObject.procTranslocationFeaturesInExtrTracks( config.refseq );
		else if( svType === 'CUT' )		svObject.procTrimmingFeaturesInExtrTracks( config.refseq );
//		else if( svType === 'DUP' )		svObject.procDuplicationFeaturesInExtrTracks( config.refseq );
//		else if( svType === 'INVDUP')	{
//			svObject.procDuplicationFeaturesInExtrTracks( config.refseq );
//
//			if( bin1.bin > tarBin.bin )	{
//				var diff = bin2.bin - bin1.bin + 1;
//				bin2.bin = bin1.bin - 1;
//				bin1.bin = bin2.bin - diff;
//			}else{
//				var diff = bin2.bin - bin1.bin + 1;
//				bin1.bin = bin2.bin;
//				bin2.bin = bin1.bin + diff;			
//			}
//			svObject.bin1 = bin1;
//			svObject.bin2 = bin2;
//
//			svObject.procInversionFeaturesInExtrTracks( config.refseq );
//		}else if( svType === 'INS' ) {
//		}
	}
}

// Worker에서 파라미터를 받는 부분
self.addEventListener('message', function(e) {
	if( e.data.length === 6 ) {
		var config = e.data[0];
		var bin1 = e.data[1];
		var bin2 = e.data[2];
		var tarBin = e.data[3];
		var svType = e.data[4];
		var gapDiff = e.data[5]; 

//		TRA & DUP Has problems
	
		console.log("SV background prcess: Start");
	
		doInBackground( config, bin1, bin2, tarBin, svType, gapDiff );
	}else if( e.data.length === 2 ) {
		console.log("Serial works background process: Start");
		var config = e.data[0];
		var works = e.data[1];

		for(var i=0; i<works.length; i++) {
			doInBackground( config, works[i].bin1, works[i].bin2, works[i].tarPos, works[i].svType, works[i].gapDiff );
		}
	}

	self.postMessage( [config, 'Done'] );
}, false);