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

		console.log( this.computePixels  );
	}
	duplication(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			console.log( "tarPos = " + this.tarPos.bin );
			var diff = this.bin2.bin - this.bin1.bin + 1;

			var pt1 = [];
			var pt2 = [];
			var pt3 = []
			var newData = [];
			var sampleData = this.config.data[sample];

			if( this.tarPos.bin < this.bin1.bin ) {
				for(var j=0; j<sampleData['data'].length; j++) {
					var point = sampleData['data'][j];
					
					if( point.iRow < this.tarPos.bin && point.iCol < this.tarPos.bin ) {
//						Case 1
						newData.push(point);
					}else if( point.iRow >= this.tarPos.bin && point.iCol <= this.tarPos.bin ) {
						if( (point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin) && point.iCol < this.bin1.bin ) {
//							Case 5
							var nPoint = jsonCopy(point);
							nPoint.iRow = this.tarPos.bin + (point.iRow - this.bin1.bin);

							newData.push( nPoint );
						}

//						Case 2
						point.iRow += diff;
						newData.push(point);
					}else if( point.iRow >= this.tarPos.bin && point.iCol >= this.tarPos.bin ) {
						if( (point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin) && (point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) ) {
//							Case 4
							var nPoint = jsonCopy(point);
							nPoint.iRow = this.tarPos.bin + (point.iRow - this.bin1.bin);
							nPoint.iCol = this.tarPos.bin + (point.iCol - this.bin1.bin);
							
							newData.push( nPoint );
						}else if( (point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin) && point.iCol < this.bin1.bin ) {
//							Case 5
							var nPoint = jsonCopy(point);
							nPoint.iRow = this.tarPos.bin + (point.iRow - this.bin1.bin);
							
							newData.push( nPoint );
						}else if( point.iRow > this.bin2.bin && (point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin ) ) {
							var nPoint = jsonCopy(point);
							nPoint.iCol = this.tarPos.bin + (point.iCol - this.bin1.bin);
							nPoint.iRow += diff;
							
							newData.push( nPoint );
						}

//							Case 3
						point.iCol += diff;
						point.iRow += diff;
						newData.push(point);
					}
				}
			}else {
				console.log("Right");
				for(var j=0; j<sampleData['data'].length; j++) {
					var point = sampleData['data'][j];
			
					if( point.iRow < this.bin1.bin && point.iCol < this.bin1.bin ) {
	//					Case 1
						newData.push(point);
					}else if( (point.iRow > this.bin2.bin && point.iRow <= this.tarPos.bin) && (point.iCol <= this.bin1.bin)) {
	//					Case 2
						newData.push( point );
					}else if( (point.iRow > this.tarPos.bin && point.iCol <= this.bin1.bin ) ) {
	//					Case 3
						point.iRow += diff;
						newData.push(point);
					}else if( (point.iRow > this.bin2.bin && point.iRow <= this.tarPos.bin) && (point.iCol >= this.bin2.bin)) {
	//					Case 4
						newData.push(point);
					}else if( (point.iRow > this.tarPos.bin) && (point.iCol > this.bin2.bin) && (point.iCol <= this.tarPos.bin) ){
	//					Case 5
						point.iRow += diff;
						newData.push(point)
					}else if( (point.iRow > this.tarPos.bin) && (point.iCol > this.tarPos.bin) ){
	//					Case 6
						point.iRow += diff;
						point.iCol += diff;
						newData.push(point);
					}else if( (point.iRow >= this.bin1.bin) && (point.iRow <= this.bin2.bin) && (point.iCol <= this.bin1.bin) ){
	//					Case 7
						newData.push(point);
	//					
						pt1.push( jsonCopy(point) );
					}else if( (point.iRow >= this.bin1.bin) && (point.iRow <= this.bin2.bin) && (point.iCol >= this.bin1.bin) && (point.iCol <= this.bin2.bin) ) {
	//					Case 8
						newData.push(point);
	
						pt2.push( jsonCopy(point) );
					}else if( ((point.iRow >= this.bin2.bin) && (point.iRow <= this.tarPos.bin)) && ((point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin))) {
	//					Case 9
	
						newData.push(point);
	//
						pt3.push( jsonCopy(point) );
					}else if( (point.iRow >= this.tarPos.bin) && ((point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin))) {
	//					Case 10
	
						point.iRow += diff;
						newData.push(point);
						
						pt3.push( jsonCopy(point) );
					}
				}
	
//				console.log( pt1.length + "  vs  " + pt2.length );
					
				for(var i=0; i<pt1.length; i++) {
					pt1[i].iRow = this.tarPos.bin + (pt1[i].iRow - this.bin1.bin);

					newData.push(pt1[i]);
				}

				for(var i=0; i<pt2.length; i++) {
//					console.log( pt2[i].iCol + " " + pt2[i].iRow );
					pt2[i].iCol = this.tarPos.bin + (pt2[i].iCol - this.bin1.bin);
					pt2[i].iRow = this.tarPos.bin + (pt2[i].iRow - this.bin1.bin);
					
					newData.push(pt2[i]);
				}

				for(var i=0; i<pt3.length; i++) {
					pt3[i].iCol = this.tarPos.bin + (pt3[i].iCol - this.bin1.bin);
					
					newData.push(pt3[i]);
				}
			}

			this.config.data[sample]['data'] = newData;
			this.config.data[sample]['nRow'] = this.config.data[sample]['nRow'] + diff;
			this.config.data[sample]['nCol'] = this.config.data[sample]['nCol'] + diff;
		}
	}
	translocation(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];

			console.log( "tarPos = " + this.tarPos.bin );
			var diff = this.bin2.bin - this.bin1.bin + 1;

			var pt1 = [];
			var pt2 = [];
			var newData = [];
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];

				if( point.iRow < this.bin1.bin && point.iCol < this.bin1.bin ) {
//					Case 1
					newData.push(point);
				}else if( (point.iRow > this.bin2.bin && point.iRow <= this.tarPos.bin) && (point.iCol <= this.bin1.bin)) {
//					Case 2
					point.iRow -= diff;
					newData.push( point );
				}else if( (point.iRow > this.tarPos.bin && point.iCol <= this.bin1.bin ) ) {
//					Case 3
					newData.push(point);
				}else if( (point.iRow > this.bin2.bin && point.iRow <= this.tarPos.bin) && (point.iCol >= this.bin2.bin)) {
//					Case 4
					point.iRow -= diff;
					point.iCol -= diff;
					newData.push(point);
				}else if( (point.iRow > this.tarPos.bin) && (point.iCol > this.bin2.bin) ){
//					Case 5
					newData.push(point)
				}else if( (point.iRow >= this.bin1.bin) && (point.iRow <= this.bin2.bin) && (point.iCol <= this.bin1.bin) ){
//					Case 6

					pt1.push(point);
				}else if( (point.iRow >= this.bin1.bin) && (point.iRow <= this.bin2.bin) && (point.iCol >= this.bin1.bin) && (point.iCol <= this.bin2.bin) ) {
//					Case 7
					point.iRow += diff;
					point.iCol += diff;

					newData.push(point);
				}else if( (point.iRow >= this.bin2.bin) && ((point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin))) {
//					Case 8

					pt2.push(point);
				}
			}

			if( diff > 0 ) {
				console.log( pt1.length + "  vs  " + pt2.length );
				for(var i=0; i<parseInt(diff); i++) {
					var element = pt2.shift();
					var tmp = element.iRow;
					element.iCol = element.iRow;
					element.iRow = tmp;

					pt1.push( element );
				}
				console.log( pt1.length + "  vs  " + pt2.length );
				
				for(var i=0; i<pt1.length; i++) {
					pt1[i].iRow += diff;

					newData.push(pt1[i]);
				}
				
				for(var i=0; i<pt2.length; i++) {
					pt2[i].iCol += diff;
					
					newData.push(pt2[i]);
				}
			}else {
				for(var i=pt1.length-1; i>=pt1.length; i--){
					var element = pt1.pop();
					var tmp = element.iRow;
					element.iCol = element.iRow;
					element.iRow = tmp;

					pt2.unshift(element);
				}
				
				for(var i=0; i<pt1.length; i++) {
					pt1[i].iRow += diff;
					
					newData.push(pt1[i]);
				}
				
				for(var i=0; i<pt2.length; i++) {
					pt2[i].iCol += diff;
					
					newData.push(pt2[i]);
				}
			}
			this.config.data[sample]['data'] = newData;
		}
	}
	deletion(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];
			
			var diff = this.bin2.bin - this.bin1.bin + 1;

			var newData = [];
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];
				
				if( (point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin) || (point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin) ) {
					continue;
				}else if( point.iRow > this.bin2.bin && point.iCol < this.bin1.bin ){
					point.iRow -= diff;

					newData.push( point );
				}else if( point.iRow > this.bin2.bin && point.iCol > this.bin2.bin){
					point.iCol -= diff;
					point.iRow -= diff;

					newData.push( point );
				}else {
					newData.push( point );
				}
			}

			this.config.data[sample]['data'] = newData;
			this.config.data[sample]['nRow'] = this.config.data[sample]['nRow'] - diff;
			this.config.data[sample]['nCol'] = this.config.data[sample]['nCol'] - diff;
			
			console.log( this.config.data[sample] );
		}
	}
	inverse(){
		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];
		
			var ts1 = {};
			var ts2 = {};
			var ts3 = {};
			var sampleData = this.config.data[sample];
			for(var j=0; j<sampleData['data'].length; j++) {
				var point = sampleData['data'][j];
				
		//			if( point.iRow < bin1.bin || point.iCol < bin1.bin ) continue;
		//			else if( point.iRow > bin2.bin ) break;
		
				if( (point.iCol < this.bin1.bin) && (point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin) ) {
					ts1[point.iRow + "-" + point.iCol] = point;
				}else if( (point.iRow >= this.bin1.bin && point.iRow <= this.bin2.bin) && (point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin) ) {
					ts2[point.iRow + "-" + point.iCol] = point;
				}else if( (point.iCol >= this.bin1.bin && point.iCol <= this.bin2.bin) && (point.iRow > this.bin2.bin ) ) {
					ts3[point.iRow + "-" + point.iCol] = point;
				}
			}
			
			// Left
			var ts1Keys = Object.keys(ts1);
			for(var iRow=0; iRow<=this.bin1.bin; iRow++) {
				for(var iCol=this.bin1.bin; iCol<=this.bin2.bin; iCol++) {
					var fp = iCol;
					var ep = this.bin1.bin + (this.bin2.bin - iCol);
					
					if( fp > ep || fp == ep ) break;
					
					if( ts1Keys.indexOf( fp + "-" + iRow ) >= 0 && ts1Keys.indexOf( ep + "-" + iRow ) >= 0 ) {
						var obj1 = ts1[fp + "-" + iRow];
						var obj2 = ts1[ep + "-" + iRow];
		
						var tmpIrow = obj1.iRow;
						var tmpIcol = obj1.iCol;
						obj1.iRow = obj2.iRow;
						obj1.iCol = obj2.iCol;
						obj2.iRow = tmpIrow;
						obj2.iCol = tmpIcol;
					}else if(ts1Keys.indexOf( fp + "-" + iRow ) < 0 && ts1Keys.indexOf( ep + "-" + iRow ) >= 0) {
						var obj2 = ts1[ep + "-" + iRow];
		
						obj2.iRow = iRow;
						obj2.iCol = fp;
					}else if(ts1Keys.indexOf( fp + "-" + iRow ) >= 0 && ts1Keys.indexOf( ep + "-" + iRow ) < 0){
						var obj1 = ts1[fp + "-" + iRow];
		
						obj1.iRow = iRow;
						obj1.iCol = ep;
					}
				}
			}
			
			// Right
			var ts3Keys = Object.keys(ts3);
			for(var iCol=this.bin2.bin; iCol<=this.config.data[this.samples[0]].nRow; iCol++) {
				for(var iRow=this.bin1.bin; iRow<=this.bin2.bin; iRow++) {
					var fp = iRow;
					var ep = this.bin1.bin + (this.bin2.bin - iRow);
		
					if( fp > ep || fp == ep ) break;
					
					if( ts3Keys.indexOf( iCol + "-" + fp ) >= 0 && ts3Keys.indexOf( iCol + "-" + ep ) >= 0 ) {
						var obj1 = ts3[iCol + "-" + fp];
						var obj2 = ts3[iCol + "-" + ep];
		
						var tmpIrow = obj1.iRow;
						var tmpIcol = obj1.iCol;
						obj1.iRow = obj2.iRow;
						obj1.iCol = obj2.iCol;
						obj2.iRow = tmpIrow;
						obj2.iCol = tmpIcol;
					}else if(ts3Keys.indexOf( iCol + "-" + fp ) < 0 && ts3Keys.indexOf( iCol + "-" + ep ) >= 0) {
						var obj2 = ts3[iCol + "-" + ep];
		
						obj2.iRow = iRow;
						obj2.iCol = fp;
					}else if(ts3Keys.indexOf( iCol + "-" + fp ) >= 0 && ts3Keys.indexOf( iCol + "-" + ep ) < 0){
						var obj1 = ts3[iCol + "-" + fp];
		
						obj1.iRow = iRow;
						obj1.iCol = ep;
					}
				}
			}
			
			// center
			var ts2Keys = Object.keys(ts2);
			for(var i=this.bin1.bin; i<=this.bin2.bin; i++) {
				for(var j=i; j<=this.bin2.bin; j++) {
					if( ts2Keys.indexOf(j + "-" + i) > -1 ) {
						var obj = ts2[j + "-" + i];
		
						obj.iRow = this.bin1.bin + (this.bin2.bin - i);
						obj.iCol = this.bin1.bin + (this.bin2.bin - j);
					}
				}
			}
		}
	}
}


self.addEventListener('message', function(e) {
	var config = e.data[0];
	var bin1 = e.data[1];
	var bin2 = e.data[2];
	var tarBin = e.data[3];
	var svType = e.data[4];
	
	console.log("SV background prcess: Start");
	
	var params = {
			config : config
			, bin1 : bin1
			, bin2 : bin2
			, tarPos : tarBin
			, svType : svType
	};
	
	const svObject = new SVObject( params );

	if( svType === 'inv' ) {
		svObject.inverse();
	}else if( svType === 'del' ) {
		svObject.deletion();
	}else if( svType === 'trl' ) {
		svObject.translocation();
	}else if( svType === 'dup' ) {
		svObject.duplication();
	}

	self.postMessage( [config, 'Done'] );
}, false);