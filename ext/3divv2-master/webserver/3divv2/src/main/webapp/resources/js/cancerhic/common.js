var int00;

var params = {
		container:'cancerHiCcanvas'
		, chrContainer:'chromosomeCanvas'
		, rullerContainer:'rullerCanvas'
		, layerContainer:'cancerHiCLayercanvas'
		, svListContainer:'svContainer'
		, chrBandHeight:30
		, resolution:500000
		, isRaw:false
		, type:3
		, sliderContainer:'cancerColorRangeSlider'
		, sliderLegendMin:'cancer_legendMin'
		, sliderLegendMiddle:'cancer_legendMiddle'
		, sliderLegendMax:'cancer_legendMax'
		, gencodeGenesDisplayType:'dense'
		, refseqGenesDisplayType:'dense'
};

// raw cancer
var originParams = {
		container:'cancerHiCoriginCanvas'
		, chrContainer:'chromosomeOriginCanvas'
		, rullerContainer:'rullerOriginCanvas'
		, chrBandHeight:30
		, resolution:500000
		, isRaw:true
		, type:2
		, sliderContainer:'cancerOriginColorRangeSlider'
		, sliderLegendMin:'cancerOrigin_legendMin'
		, sliderLegendMiddle:'cancerOrigin_legendMiddle'
		, sliderLegendMax:'cancerOrigin_legendMax'
		, gencodeGenesDisplayType:'dense'
		, refseqGenesDisplayType:'dense'
};

var normalParams = {
		container:'normalHiCcanvas'
		, chrContainer:'chromosomeNormalCanvas'
		, rullerContainer:'rullerNormalCanvas'
		, chrBandHeight:30
		, resolution:500000
		, isRaw:true
		, type:1
		, sliderContainer:'normalColorRangeSlider'
		, sliderLegendMin:'normal_legendMin'
		, sliderLegendMiddle:'normal_legendMiddle'
		, sliderLegendMax:'normal_legendMax'
		, gencodeGenesDisplayType:'dense'
		, refseqGenesDisplayType:'dense'
};

var REARRANGED_COLOR = "rgba(172, 0, 250, 0.1)";


var chromColorMap = {
	'chr1':'#d9ffde'
	, 'chr2':'#ff0501'
	, 'chr3':'#0bc901'
	, 'chr4':'#0265cb'
	, 'chr5':'#ffff00'
	, 'chr6':'#81007f'
	, 'chr7':'#01fffe'
	, 'chr8':'#810000'
	, 'chr9':'#028100'
	, 'chr10':'#010080'
	, 'chr11':'#7e7f03'
	, 'chr12':'#c0c0c0'
	, 'chr13':'#807f83'
	, 'chr14':'#9a99ff'
	, 'chr15':'#993365'
	, 'chr16':'#fdfecc'
	, 'chr17':'#ccffff'
	, 'chr18':'#680065'
	, 'chr19':'#a98381'
	, 'chr20':'#cbcbff'
	, 'chr21':'#010080'
	, 'chr22':'#ffcc00'
	, 'chrX':'#ff6501'
	, 'chrY':'#9acefe'
};

class CancerHiC{
	constructor( params ){
		this.config = params;

//		var card_width = $(".rearrange-contact-map-card-body").width();
		var card_width = $( '#' + this.config.chrContainer ).width();

		this.controller = null;
		this.resolution = $( '#' + this.config.chrContainer ).width();

//		this.resolution = card_width;
		this.margin = 0;
		this.hasSelectedRegion = false;
		this.chromosomeBands = [];

		this.layerContainer = document.getElementById( this.config.layerContainer );

		this.canvas = document.getElementById( this.config.container );
		this.canvas.width = this.resolution;
		this.canvas.height = this.canvas.width/2;
		this.canvas.style='height:' + this.canvas.height + 'px;width:' + card_width + 'px;background:#fefefe;';

		this.chromosomeCanvas = document.getElementById( this.config.chrContainer );
		this.chromosomeCanvas.width = this.resolution;
		this.chromosomeCanvas.height = this.config.chrBandHeight * 1;
		this.chromosomeCanvas.style='height:' + this.chromosomeCanvas.height + 'px;width:' + this.chromosomeCanvas.width + 'px;background:#f8f8f8;';

		this.rullerCanvas = document.getElementById( this.config.rullerContainer );
		this.rullerCanvas.width = this.resolution;
		this.rullerCanvas.height = this.config.chrBandHeight * 2;
		this.rullerCanvas.style='height:' + this.rullerCanvas.height + 'px;width:' + this.rullerCanvas.width + 'px;background:#f8f8f8;';
		
		
		this.svCreatedRegion = null;

		this.initSlider();
	}
	initSlider() {
		var obj = this;
		this.colorScaleValues = this.getColorScaleValues();

		$( "#" + this.config.sliderContainer ).slider({
			min: 0,
			max: 100,
			values: obj.colorScaleValues,
			slide: function( event, ui ) {
				var pos = $.extend({}, $(ui.handle).offset(), 
				          { width: $(ui.handle).get(0).offsetWidth, 
				            height: $(ui.handle).get(0).offsetHeight});
				var actualWidth = $(".ColorRangeSliderTooltip").get(0).offsetWidth; 
				var maxValue = $("#" + obj.config.sliderLegendMax ).text().replace("\|", "");

				$(".ColorRangeSliderTooltip").removeClass("d-none");
				$(".ColorRangeSliderTooltip").css("left", pos.left + pos.width / 2 - actualWidth / 2).css("top", pos.top - 35);
				$(".ColorRangeSliderTooltip").text( Math.ceil( maxValue * ( ui.value / 100 ) ) );

				if( $("#color_palette").val() == "WtoR" ){
					$(this).css("background", "linear-gradient(to right, white 0%, white "+ui.values[0]+"%, red "+ui.values[ 1 ]+"%, red 100%)" );
				}else if( $("#color_palette").val() == "BtoYtoR" ){
					$(this).css("background", "linear-gradient(to right, blue 0%, blue "+ui.values[0]+"%, yellow "+ui.values[ 1 ]+"%, red "+ui.values[ 2 ]+"%, red 100%)" );
				}
			},
			stop: function( event, ui ){
				$(".ColorRangeSliderTooltip").addClass("d-none");

				obj.drawContactMap();

				if( obj instanceof UserDefineCancerHiC ) {
					var item = obj.controller.viewer.undoStack[obj.controller.viewer.undoStack.length-1];
					if( item !== undefined && item !== null ){
						obj.drawSv( item.bin1, item.bin2, item.tarPos, item.svType );
					}
				}else if( obj instanceof PrecalledCancerHiC ) {
					if( obj.controller.prevSvItem !== undefined && obj.controller.prevSvItem !== null ) {
						var item = obj.controller.prevSvItem;
						obj.drawSv( item.bin1, item.bin2, null, item.svtype );
					}
				}
			}
		});
		
		if( this.config.weightScoreSliderContainer !== undefined ) {
			var point = "|<br/>";
			$("#" + this.config.weightScoreLegendMin ).html(point + 0);
			$("#" + this.config.weightScoreLegendMiddle ).html( point + 15 );
			$("#" + this.config.weightScoreLegendMax ).html( point + 30 );

			$( "#" + this.config.weightScoreSliderContainer ).slider({
				min: 0,
				max: 30,
				values: [10],
				slide: function( event, ui ) {
					var pos = $.extend({}, $(ui.handle).offset(), 
					          { width: $(ui.handle).get(0).offsetWidth, 
					            height: $(ui.handle).get(0).offsetHeight});
					var actualWidth = $(".ColorRangeSliderTooltip").get(0).offsetWidth; 
					var currentValue = $("#" + obj.config.weightScoreSliderValue ).text().replace("\|", "");

					$(".ColorRangeSliderTooltip").removeClass("d-none");
					$(".ColorRangeSliderTooltip").css("left", pos.left + pos.width / 2 - actualWidth / 2).css("top", pos.top - 35);
					$(".ColorRangeSliderTooltip").text( ui.value );
					
					$("#new_contact_value").val( ui.value );
				},
				stop: function( event, ui ){
					$(".ColorRangeSliderTooltip").addClass("d-none");

					obj.initRearrangeChrs( obj.config.filters.tadMap );
					obj.drawContactMap();
				}
			});
		}
	}
	init(config){
		this.config.colorPalette = config.colorPalette;
//		this.config.colorscale = config.colorscale;
//		this.colorScaleValues = config.colorScaleValues;

		this.config.data = config.data;
		this.config.raw_data = config.raw_data;
		this.samples = Object.keys(config.data);
		this.config.chromOrder = config.chromOrder;
		this.config.userRegions = config.userRegions;
//		this.config.svCreatedRegsion = config.userRegions;
		this.config.resolution = config.resolution;
		this.drawRate = (this.resolution - (2*this.margin)) / ( this.config.data[ this.samples[0] ].nRow * Math.sqrt(2) );	// 각 bin별 상대적인 넓이 비율 계산 (각 사각형 픽셀의 대각선 길이를 곱함)
	}
	initSuperEnhancer(data){
		this.config.superenhancer = data;
	}
	initGencodeGenes(data){
		this.config.gencode = data;
	}
	initRefseqGenes(data){
		this.config.refseq = data;
	}
	reInitRuller( svType, bin1, bin2, tarBin ) {
		var regions =  this.config.userRegions;
		var chromOrder = this.chromosomeBands;
		
		var diff = 0;
		var binStart = 0;
		for(var i=0; i<chromOrder.length; i++) {
			var binEnd = binStart + chromOrder[i].binSize - 1;

			chromOrder[i]['binStart'] = binStart;
			chromOrder[i]['binEnd'] = binEnd;

			var nScale = d3.scaleLinear()
			.domain([binStart, binEnd])
			.range([chromOrder[i].chromStart, chromOrder[i].chromEnd]);
			
			if( (bin1.bin >= binStart && bin1.bin <= binEnd) && ( bin2.bin >= binStart && bin2.bin <= binEnd ) ) { 
				var x1 = nScale( bin1.bin );
				var x2 = nScale( bin2.bin );
				var localDiff = x2 - x1;

				if( svType === 'DEL' || svType === 'TRA' )			{
					chromOrder[i].chromEnd -= parseInt(localDiff);
					diff += parseInt(localDiff);
				}
			}

			this.config.userRegions[i] = this.config.userRegions[i].split(":")[0] + ":"+ chromOrder[i].chromStart + "-" + chromOrder[i].chromEnd;

			binStart = binEnd + 1;
		}
		
		if( svType === 'TRA' ) {
			for(var i=0; i<chromOrder.length; i++) {
				var binStart = chromOrder[i]['binStart'];
				var binEnd = chromOrder[i]['binEnd'];

				var nScale = d3.scaleLinear()
				.domain([binStart, binEnd])
				.range([chromOrder[i].chromStart, chromOrder[i].chromEnd]);
				
				if( (tarBin.bin >= binStart && tarBin.bin <= binEnd) ) {
					chromOrder[i].chromEnd += parseInt(diff);
				}

				this.config.userRegions[i] = this.config.userRegions[i].split(":")[0] + ":"+ chromOrder[i].chromStart + "-" + chromOrder[i].chromEnd;
			}
		}
	}
	reInitChromosomeBands( svType, bin1, bin2, tarBin ){
		if( svType === 'INS' ) {
			var x = 0;
			var n = {};
			for(var i=0; i<this.chromosomeBands.length; i++) {
				var chrom = this.chromosomeBands[i].chrom;

//				Here have to check chromosome is equal
				var chromBandX1 = parseInt( this.chromosomeBands[i].scale( this.chromosomeBands[i].x ) );
				var chromBandX2 = parseInt( this.chromosomeBands[i].scale( this.chromosomeBands[i].x + this.chromosomeBands[i].width ) );
				var overlap = getOverlap( chromBandX1, chromBandX2, bin1.bin, bin2.bin );

				x += this.config.data[this.samples[0]].genomeSize[ chrom + "-" + i ];

				n[chrom + "-" +i] = overlap;
			}

			for(var i=0; i< Object.keys(n).length; i++){
				this.config.data[this.samples[0]].genomeSize[ Object.keys(n)[i] ] += n[Object.keys(n)[i]];
			}
		}else if( svType === 'DEL' ) {
			var tmpUserRegions = [];
			var tmpGenomeSize = {};
			
			var bin1ChrBandIdx = -1;
			if( bin1.chromIdx !== undefined && bin1.chrBandIdx === undefined )	bin1ChrBandIdx = parseInt( bin1.chromIdx );
			else																bin1ChrBandIdx = parseInt( bin1.chrBandIdx );
			
			var bin2ChrBandIdx = -1;
			if( bin2.chromIdx !== undefined && bin2.chrBandIdx === undefined )	bin2ChrBandIdx = parseInt( bin2.chromIdx );
			else																bin2ChrBandIdx = parseInt( bin2.chrBandIdx );

			if( bin1.chr === bin2.chr && bin1ChrBandIdx === bin2ChrBandIdx ) {
				var idx = 0;
				for(var i=0; i<this.chromosomeBands.length; i++) {
					var chromBand = this.chromosomeBands[i];
	
					var chrBandIdx = -1;
					if( bin1.chromIdx !== undefined && bin1.chrBandIdx === undefined )	chrBandIdx = parseInt( bin1.chromIdx );
					else																chrBandIdx = parseInt( bin1.chrBandIdx );
					//console.log( "chrBandIdx", chrBandIdx );
	
					if( i < chrBandIdx ) {
						tmpUserRegions.push( chromBand.chrom + ":" + chromBand.chromStart + "-" + chromBand.chromEnd );
						tmpGenomeSize[ chromBand.chrom + "-" + idx++ ] = chromBand.binSize;
					}else if( i === chrBandIdx ) {
						var sBand = this.chromosomeBands[ chrBandIdx ];
	 
						var region1 = sBand.chrom + ":" + parseInt(sBand.chromStart) + "-" + parseInt(bin1.chromPos);
						var region2 = sBand.chrom + ":" + parseInt(bin2.chromPos) + "-" + parseInt(sBand.chromEnd);
	
						tmpUserRegions.push( region1 );
						tmpUserRegions.push( region2 );
						
						tmpGenomeSize[ sBand.chrom + "-" + idx++ ] = (bin1.bin-1 - sBand.binStart + 1);
						tmpGenomeSize[ sBand.chrom + "-" + idx++ ] = (sBand.binEnd - (bin2.bin+1) + 1);
	//
	//					console.log( "sBand", sBand );
	//					console.log( "kkk0", this.chromosomeBands);
	//					console.log( "kkk1", bin1 );
	//					console.log( "kkk2", bin2 );
	//					console.log( "kkk3", sBand );
	//					console.log( tmpGenomeSize );
	//					console.log( tmpUserRegions );
					}else {
						tmpUserRegions.push( chromBand.chrom + ":" + chromBand.chromStart + "-" + chromBand.chromEnd );
	
						tmpGenomeSize[ chromBand.chrom + "-" + idx++ ] = chromBand.binSize;
					}
				}
	
	/*				console.log( "bf regions", this.config.userRegions );
					console.log( "af regions", tmpUserRegions );
					console.log( "bf genome", this.config.data[this.samples[0]].genomeSize );
					console.log( "af_genome", tmpGenomeSize );*/
	//				console.log(tmpUserRegions);
			}else if( bin1.chr === bin2.chr && bin1ChrBandIdx !== bin2ChrBandIdx ) {
				var chromWithIdx = Object.keys( this.config.data[this.samples[0]].genomeSize );

				var idx = 0;
				for(var i=0; i<this.chromosomeBands.length; i++) {
					var sBand = this.chromosomeBands[i];

					if( i < bin1ChrBandIdx ) {
						tmpUserRegions.push( sBand.chrom + ":" + parseInt(sBand.chromStart) + "-" + parseInt(sBand.chromEnd) );
						tmpGenomeSize[ sBand.chrom + '-' + idx++ ] = this.config.data[this.samples[0]].genomeSize[ chromWithIdx[i] ];
					}else if( i === bin1ChrBandIdx ) {
						tmpUserRegions.push( sBand.chrom + ":" + parseInt(sBand.chromStart) + "-" + parseInt(bin1.chromPos) );
						tmpGenomeSize[ sBand.chrom + '-' + idx++ ] = this.config.data[this.samples[0]].genomeSize[ chromWithIdx[i] ] - (sBand.binEnd - bin1.bin + 1);
					}else if( i === bin2ChrBandIdx ) {
						tmpUserRegions.push( sBand.chrom + ":" + parseInt(bin2.chromPos) + "-" + parseInt(sBand.chromEnd) );
						tmpGenomeSize[ sBand.chrom + '-' + idx++ ] = this.config.data[this.samples[0]].genomeSize[ chromWithIdx[i] ] - (bin2.bin - sBand.binStart + 1);
					}else if( i > bin2ChrBandIdx ) {
						tmpUserRegions.push( sBand.chrom + ":" + parseInt(sBand.chromStart) + "-" + parseInt(sBand.chromEnd) );
						tmpGenomeSize[ sBand.chrom + '-' + idx++ ] = this.config.data[this.samples[0]].genomeSize[ chromWithIdx[i] ];
					}
				}
			}
			
			this.config.userRegions = tmpUserRegions;
			this.config.data[this.samples[0]].genomeSize = tmpGenomeSize;
		
			var nChromOrder = [];
			for(var i=0; i<this.config.userRegions.length; i++) {
				var chrom = this.config.userRegions[i].split(":")[0];
				
				nChromOrder.push( chrom + "-" + i );
			}
			this.config.chromOrder = nChromOrder;	
			
			var nSuperenhancer = this.recalibrateGeneArea( this.config.superenhancer, tmpGenomeSize, nChromOrder );
			var nGencode = this.recalibrateGeneArea( this.config.gencode, tmpGenomeSize, nChromOrder );
			var nRefseq = this.recalibrateGeneArea( this.config.refseq, tmpGenomeSize, nChromOrder );

			this.config.superenhancer = nSuperenhancer;
			this.config.gencode = nGencode;
			this.config.refseq = nRefseq;
		}else if( svType === 'TRA' ) {
//			console.log("bin1", bin1);
//			console.log("bin2", bin2);
//			console.log("tarBin", tarBin);

			// 바꾸거나 추가해야 할것 리스트
			// this.config.chromOrder {'chr6-1', 'chr7-2'}
			// this.config.data.genomeSize {'chr6-0':34, 'chr7-2':34}
			var srcChrIndex = -1;
			var tarChrIndex = -1;
		
			var maxChromEnd = 0;
			var maxX2 = 0;
			var coordJson = {};
			for(var i=0; i<this.chromosomeBands.length; i++) {
				var chrom = this.chromosomeBands[i].chrom;
				var x1 = parseInt( this.chromosomeBands[i].scale( this.chromosomeBands[i].x ) );
				var x2 = parseInt( this.chromosomeBands[i].scale( this.chromosomeBands[i].x + this.chromosomeBands[i].width ) );

// 화면확대시 좌/우로 움직일때 영역을 넘어가면 오류남 해결해야함
				if( bin1.bin >= x1 && bin1.bin <= x2 )		coordJson['src'] = {idx : i, originBinStart:x1, originBinEnd:x2};
				if( tarBin.bin >= x1 && tarBin.bin <= x2 )	coordJson['tar'] = {idx : i, originBinStart:x1, originBinEnd:x2};
				
				if( x2 > maxX2 ) maxX2 = x2;
				if( this.chromosomeBands[i].chromEnd > maxChromEnd ) maxChromEnd = this.chromosomeBands[i].chromEnd; 
			}
			
			if( coordJson['src'] === undefined ){
				if( bin1.bin < x1 )			coordJson['src'] = {idx : 0, originBinStart:x1, originBinEnd:x2};
				else if( bin1.bin > maxX2 )	coordJson['src'] = {idx : (this.chromosomeBands.length-1), originBinStart:x1, originBinEnd:x2};
			}

			if( coordJson['tar'] === undefined ){	
				if( tarBin.bin < x1 )			coordJson['tar'] = {idx : 0, originBinStart:x1, originBinEnd:x2};
				else if( tarBin.bin > maxX2 )	coordJson['tar'] = {idx : (this.chromosomeBands.length-1), originBinStart:x1, originBinEnd:x2};
			}

			var binStart = 0;
			var scaleArray = [];
			for(var i=0; i<this.config.chromOrder.length; i++) {
				var binEnd = binStart + this.config.data[this.samples[0]].genomeSize[this.config.chromOrder[i]] - 1;
				
				var nScale = d3.scaleLinear()
				.domain([binStart, binEnd])
				.range([this.chromosomeBands[i].chromStart, this.chromosomeBands[i].chromEnd]);
				
				var revScale = d3.scaleLinear()
				.domain([this.chromosomeBands[i].chromStart, this.chromosomeBands[i].chromEnd])
				.range([binStart, binEnd]);
				
				var chr = this.config.chromOrder[i].split("-")[0];

				scaleArray.push( {binStart:binStart, binEnd:binEnd, scale:nScale, revScale:revScale, chrom:chr} );

				binStart = binEnd + 1;
			}

			var tmpOrder = [];
			for(var i=0; i<this.config.chromOrder.length; i++) {
				if( i === coordJson['src'].idx ){
					var chrName = this.config.chromOrder[i]
					var size = this.config.data[this.samples[0]].genomeSize[chrName] - (bin2.bin - bin1.bin + 1);

					var chromStart = this.chromosomeBands[i].chromStart;
					var chromEnd = scaleArray[i].scale( scaleArray[i].binEnd - (bin2.bin - bin1.bin + 1) );

					tmpOrder.push( {chr:chrName.split("-")[0], size:size, type:'old', status:'remove', chromStart:chromStart, chromEnd:chromEnd} );
//					tmpOrder.push( {chr:chrName.split("-")[0], size:(bin1.bin-1 - this.chromosomeBands[i].binStart+1), type:'old', status:'remove', chromStart:chromStart, chromEnd:scaleArray[i].scale(bin1.bin-1)} );
//					tmpOrder.push( {chr:chrName.split("-")[0], size:(this.chromosomeBands[i].binEnd - bin2.bin + 1 + 1), type:'old', status:'remove', chromStart:scaleArray[i].scale(bin2.bin+1), chromEnd:this.chromosomeBands[i].chromEnd} );
//console.log("case 1");
				}else if( i === coordJson['tar'].idx ){
					var tarChrName = this.config.chromOrder[coordJson['tar'].idx].split("-")[0];
					var srcChrName = this.config.chromOrder[coordJson['src'].idx].split("-")[0];

					var srcMap = scaleArray[coordJson['src'].idx];
					var tarMap = scaleArray[coordJson['tar'].idx];

					var srcChromStart = srcMap.scale( bin1.bin );
					var srcChromEnd = srcMap.scale( bin2.bin );
										
					var tarChromStart = tarMap.scale( tarMap.binStart );
					var tarChromSplit = tarMap.scale( tarBin.bin );
					var tarChromEnd = tarMap.scale( tarMap.binEnd );

					tmpOrder.push( {chr:tarChrName, size:(tarBin.bin - coordJson['tar'].originBinStart + 1), type:'old', status:'split', chromStart:tarChromStart, chromEnd:Math.floor(tarChromSplit)} );
					tmpOrder.push( {chr:srcChrName, size:(bin2.bin - bin1.bin + 1), type:'new', status:'add', chromStart:parseInt(srcChromStart), chromEnd:parseInt(srcChromEnd)} );
					tmpOrder.push( {chr:tarChrName, size:(coordJson['tar'].originBinEnd - (tarBin.bin+1) + 1), type:'old', status:'split', chromStart:Math.ceil(tarChromSplit), chromEnd:tarChromEnd} );
//console.log("case 2");
				}else{
					var chrName = this.config.chromOrder[i].split("-")[0];
					var size = this.config.data[this.samples[0]].genomeSize[this.config.chromOrder[i]];

					var chr = this.config.userRegions[i].split(":")[0];
					var pos = this.config.userRegions[i].split(":")[1].split("-");

					var srcMap = scaleArray[coordJson['src'].idx];
					var tarMap = scaleArray[coordJson['tar'].idx];
					var tarChromSplit = tarMap.scale( tarBin.bin );

					var diffChrom = srcMap.scale( bin2.bin ) - srcMap.scale( bin1.bin );

					if( pos[0] > tarChromSplit )
						tmpOrder.push( {chr:chrName, size:size, type:'old', status:'stain', chromStart:pos[0] + diffChrom, chromEnd:pos[1] + diffChrom} );
					else
						tmpOrder.push( {chr:chrName, size:size, type:'old', status:'stain', chromStart:pos[0], chromEnd:pos[1]} );
//console.log("case 3");
				}
			}

			var tmpChrOrder = [];
			var tmpUserRegions = [];
			var tmpGenomeSize = {};
			
			for( var i=0; i<tmpOrder.length; i++ ) {
				tmpChrOrder.push( tmpOrder[i].chr + "-" + i );
				tmpUserRegions.push( tmpOrder[i].chr + ":" + tmpOrder[i].chromStart + "-" + tmpOrder[i].chromEnd );
				tmpGenomeSize[tmpOrder[i].chr + "-" + i] = tmpOrder[i].size;
			}

/*			console.log( this );
			console.log( tmpUserRegions );
			console.log( tmpChrOrder );
			console.log( tmpGenomeSize );*/
			this.config.userRegions = tmpUserRegions;
			this.config.chromOrder = tmpChrOrder;
			this.config.data[this.samples[0]].genomeSize = tmpGenomeSize;
			
			
			var nSuperenhancer = this.recalibrateGeneArea( this.config.superenhancer, tmpGenomeSize, tmpChrOrder )
			var nGencode = this.recalibrateGeneArea( this.config.gencode, tmpGenomeSize, tmpChrOrder )
			var nRefseq = this.recalibrateGeneArea( this.config.refseq, tmpGenomeSize, tmpChrOrder )

			this.config.superenhancer = nSuperenhancer;
			this.config.gencode = nGencode;
			this.config.refseq = nRefseq;
		}else if( svType === 'DUP' || svType === 'INVDUP' ) {
			// DUP or INDUP는 Chromosome의 변화가 없음
			// 따라서 아무 처리 하지 않아도 됨 
			
			
//			var expandingChrom = null;
//			for(var i=0; i<this.chromosomeBands.length; i++) {
//				var chrom = this.chromosomeBands[i].chrom;
//				var x1 = parseInt( this.chromosomeBands[i].scale( this.chromosomeBands[i].x ) );
//				var x2 = parseInt( this.chromosomeBands[i].scale( this.chromosomeBands[i].x + this.chromosomeBands[i].width ) );
//				
//				var localOverlap = getOverlap( x1, x2, bin1.bin, bin2.bin );
//
//				if( tarBin.bin >= x1 && tarBin.bin <= x2 ){
//					expandingChrom = chrom + "-" + i;
//					
//					this.config.data[this.samples[0]].genomeSize[ expandingChrom ] += localOverlap;
//				}
//			}
		}else if( svType === 'CUT' ) {
			var obj = this.controller;
			var chromosomeBands = this.chromosomeBands;

			var regions = [];

			var flag = false;
			if( chromosomeBands.length > 1) {
				if( obj.cutRegionStartObj.index !== obj.cutRegionEndObj.index ) {
					for( var i=obj.cutRegionStartObj.index; i<=obj.cutRegionEndObj.index; i++) {
						var band = chromosomeBands[i];

						if( i === obj.cutRegionStartObj.index ) {
							if( band.chrom == obj.cutRegionStartObj.chrom && band.chromStart <= obj.cutRegionStartObj.genomicCoordinate && obj.cutRegionStartObj.genomicCoordinate <= band.chromEnd ){
								var region = band.chrom + ":" + obj.cutRegionStartObj.genomicCoordinate + "-" + band.chromEnd;
								regions.push( region );
								
								this.config.data[this.samples[0]].genomeSize[this.config.chromOrder[ obj.cutRegionStartObj.index ]] = (band.binEnd - bin1.bin + 1);
							}
						}else if( i > obj.cutRegionStartObj.index && i < obj.cutRegionEndObj.index ) {
							var region  = band.chrom + ":" + band.chromStart + "-" + band.chromEnd;
							regions.push( region );
						}else if( i === obj.cutRegionEndObj.index ) {
							if( band.chrom == obj.cutRegionEndObj.chrom && band.chromStart <= obj.cutRegionEndObj.genomicCoordinate && obj.cutRegionEndObj.genomicCoordinate <= band.chromEnd ){
								var region = band.chrom + ":" + band.chromStart + "-" + obj.cutRegionEndObj.genomicCoordinate;
								regions.push( region );
								
								this.config.data[this.samples[0]].genomeSize[this.config.chromOrder[ obj.cutRegionEndObj.index ]] = (bin2.bin - band.binStart + 1);
							}
						}
					}
				}else {
					var band = chromosomeBands[ obj.cutRegionStartObj.index ];
					var region = band.chrom + ":" + obj.cutRegionStartObj.genomicCoordinate + "-" + obj.cutRegionEndObj.genomicCoordinate;
					regions.push( region );

					this.config.data[this.samples[0]].genomeSize[this.config.chromOrder[ obj.cutRegionStartObj.index ]] = (bin2.bin - bin1.bin + 1); 					
				}
			}else if( chromosomeBands.length === 1 ) {
				var region = obj.cutRegionStartObj.chrom + ":" + obj.cutRegionStartObj.genomicCoordinate + "-" + obj.cutRegionEndObj.genomicCoordinate;
				regions.push(region);

				this.config.data[this.samples[0]].genomeSize[ this.config.chromOrder[0] ] = (bin2.bin - bin1.bin + 1);
			}

			this.config.userRegions = regions;
		}
	}
	recalibrateGeneArea( features, genomeSize, chromOrder ) {
		if( features !== undefined && features !== null ) {
			var obj = {};

			var binStart = 0;
			for( var i=0; i<chromOrder.length; i++) {
				var binEnd = binStart + genomeSize[chromOrder[i]]-1;
//				console.log( binStart + "-" + binEnd );
			
				var parts = [];
				
				var keys = Object.keys( features );
				for( var j=0; j<keys.length; j++) {
					var array = features[keys[j]];
					
					for( var k=0; k<array.length; k++) {
						if( array[k].startBin >= binStart && array[k].endBin <= binEnd ) {
							parts.push( array[k] );
						}
					}
				}

				obj[chromOrder[i]] = parts;

				binStart = binEnd + 1;
			}
			
			return obj;
		}
		
		return null;
	}
	loadingData( filters ) {
		var obj = this;

		if( $('#preloader2').length == 0 ) {
			$('#footer').after('<div id="preloader2"></div>');
		}		
		
		var regions = JSON.parse(filters.regions);
		
		var strRegions = JSON.stringify(regions);

		$.ajax({
			type : 'post'
			,url : 'getContactMapDataFromBedFormats'
			,async:true
			,data:{'bed_data':strRegions, 'samples':filters.samples, 'threshold':filters.threshold, 'get_data_type':'part', 'resolution':obj.config.resolution}
			,success: function( result, status, xhr ) {
				var decodedString = decode(result);
				var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
 
				let decodedText3 = new TextDecoder().decode(un);

				var compressed_result = decodedText3;
				var data = JSON.parse(compressed_result);

				var params = {
					data: data
					, raw_data : JSON.parse(JSON.stringify(data))
					, chromOrder:filters.chromOrder
					, userRegions:JSON.parse(filters.regions)
					, colorPalette: filters.colorPalette
//					, colorScaleValues: obj.colorScaleValues
					, resolution: data[Object.keys(data)[0]].resolution
				};

				if( obj.superEnhancerContainer !== undefined ) {
					$.ajax({
						type : 'post'
						,url : 'getSuperEnhancer'
						,async:false
						,data:{'samples':filters.samples, 'bed_data':filters.regions, 'resolution':data[Object.keys(data)[0]].resolution}
						,success: function( result ) {
							var decodedString = decode(result);
							var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
			 
							let compressed_result = new TextDecoder().decode(un);

//							var compressed_result = LZString.decompressFromBase64(result);
							var data = JSON.parse(compressed_result);

							obj.initSuperEnhancer( data );
						}
					});
				}
				if( obj.gencodeGenesCanvas !== undefined ) {
					$.ajax({
						type : 'post'
						,url : 'getGencodeV34Genes'
						,async:false
						,data:{ 'bed_data':filters.regions, 'resolution':data[Object.keys(data)[0]].resolution, 'optionGene': filters.optionGene }
						,success: function( result ) {
							var decodedString = decode(result);
							var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
			 
							let compressed_result = new TextDecoder().decode(un);

//							var compressed_result = LZString.decompressFromBase64(result);
							var data = JSON.parse(compressed_result);

							obj.initGencodeGenes( data );
						}
					});
				}
				if( obj.refseqGenesCanvas !== undefined ) {
					$.ajax({
						type : 'post'
						,url : 'getRefseqHG38Genes'
						,async:false
						,data:{ 'bed_data':filters.regions, 'resolution':data[Object.keys(data)[0]].resolution, 'optionGene': filters.optionGene }
						,success: function( result ) {
							var decodedString = decode(result);
							var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
			 
							let compressed_result = new TextDecoder().decode(un);

//							var compressed_result = LZString.decompressFromBase64(result);
							var data = JSON.parse(compressed_result);

							obj.initRefseqGenes( data );
						}
					});
				}

				obj.init( params );

				// Initialized slider
				var alpha  = data[ Object.keys(data)[0] ].median / data[ Object.keys(data)[0] ].maxValue * 100;
				
				if( obj.config.colorPalette === 'BtoYtoR' )	$( "#" + obj.config.sliderContainer ).slider("values", [0, alpha * (1/3), 100] );
				else 										$( "#" + obj.config.sliderContainer ).slider("values", [0, alpha] );

//				obj.draw();

				// When all panel(cancer, original, rearrange) has done, this callback function should fire
				obj.controller.callbackAllPanelDone();
				
				if( 1 == 1 ){
					if( obj instanceof RearrangeGenomeCancerHiC && obj.config.container === 'cancerHiCcanvas' ) {
						obj.config.filters = filters;
	
						// Ex) chr6:1-123456이 아니라 chr6:123456-1 이렇게 입력한 경우는
						// Inversion으로 처리 한다
						var samples = JSON.parse(filters.samples);
						var regions = JSON.parse(filters.oldRegions);
	
						var genomeSize = data[samples[0].sample].genomeSize;
						var genomeSizeKey = Object.keys(genomeSize);

						//console.log( data );

//						obj.initRearrangeChrs( filters.tadMap );

						var bin1Pos = 0;
						if( genomeSizeKey.length == regions.length ) {
							var stack = [];

							for(var i=0; i<genomeSizeKey.length; i++) {
								var parts = regions[i].split(':');
								var chrom = parts[0];
								var pos = parts[1].split("-");

								var bin2Pos = bin1Pos + genomeSize[genomeSizeKey[i]] - 1;

								if( parseInt(pos[0]) > parseInt(pos[1]) ) {
									var start = parseInt(pos[1]);
									var end = parseInt(pos[0]);
	 
									var bin1 = { 'chr': chrom, 'bin':bin1Pos, 'x':-1, chrBandIdx:-1};
									var bin2 = { 'chr': chrom, 'bin':bin2Pos, 'x':-1, chrBandIdx:-1 };
//									obj.controller.doGenomicVariations( bin1, bin2, null, 'INV', true );
									
									stack.push( { bin1:bin1, bin2:bin2, tarPos:null, svType:'INV', gapDiff:(bin2Pos-bin1Pos) } );
								}
	
//								bin1Pos += genomeSize[genomeSizeKey[i]];
								bin1Pos = bin2Pos + 1;
							}

							if( stack.length > 0 )	obj.serialWorks( stack );
							else					obj.initRearrangeChrs( filters.tadMap );
						}
					}else {
						obj.draw();
					}

					if( obj instanceof UserDefineCancerHiC && obj.undoStack !== 'undefined' && obj.config.container === 'cancerHiCcanvas' ) {
						if( obj.undoStack !== null && obj.undoStack.length > 0 ){
							var chromBands = obj.getChromosomeBands();

							// Case for Zoom or Pan
							for(var i=0; i<obj.undoStack.length; i++){
								var band = chromBands[ obj.undoStack[0].bin1.chrBandIdx ];
	
								//if( obj.undoStack[i].svType !== 'DEL' ) {
								var nScale = d3.scaleLinear()
								.domain([band.chromStart, band.chromEnd])
								.range([band.binStart, band.binEnd]);
	
								var xScale = d3.scaleLinear()
								.domain([band.chromStart, band.chromEnd])
								.range([band.x, band.x+band.width]);

								obj.undoStack[i].bin1.x = xScale( obj.undoStack[i].bin1.chromPos );
								obj.undoStack[i].bin1.bin = nScale( obj.undoStack[i].bin1.chromPos );
								obj.undoStack[i].bin2.x = xScale( obj.undoStack[i].bin2.chromPos );
								obj.undoStack[i].bin2.bin = nScale( obj.undoStack[i].bin2.chromPos );
								
								if( band.binEnd < obj.undoStack[i].bin1.bin &&  band.binEnd < obj.undoStack[i].bin2.bin ){
									obj.undoStack[i].bin1.bin = band.binEnd;
									obj.undoStack[i].bin2.bin = band.binEnd;
 
									console.log("case 1");
								}else if( band.binStart <= obj.undoStack[i].bin1.bin && band.binEnd >= obj.undoStack[i].bin1.bin &&  band.binEnd < obj.undoStack[i].bin2.bin ){
									obj.undoStack[i].bin2.bin = band.binEnd;
									console.log("case 2");
								}else if( band.binStart > obj.undoStack[i].bin1.bin && band.binStart <= obj.undoStack[i].bin2.bin &&  band.binEnd >= obj.undoStack[i].bin2.bin ){
									obj.undoStack[i].bin1.bin = band.binStart;
									console.log("case 3");
								}else if( band.binStart > obj.undoStack[i].bin1.bin && band.binStart > obj.undoStack[i].bin2.bin ){
									obj.undoStack[i].bin1.bin = band.binStart;
									obj.undoStack[i].bin2.bin = band.binStart;
									console.log("case 4");
								}else if( band.binStart > obj.undoStack[i].bin1.bin &&  band.binEnd < obj.undoStack[i].bin2.bin ){
									obj.undoStack[i].bin1.bin = band.binStart;
									obj.undoStack[i].bin2.bin = band.binEnd;
									console.log("case 5");
								}else {
									console.log("case 6");
								}
								
								console.log( band.binStart + " vs " + band.binEnd + "   ==>  " + obj.undoStack[i].bin1.bin + " vs " + obj.undoStack[i].bin2.bin );

								obj.undoStack[i].gapDiff = (obj.undoStack[i].bin2.bin - obj.undoStack[i].bin1.bin + 1);
							}

							obj.controller.doSerialUndoOrRedoInWorker( obj.undoStack );
						}
					}
				}

				obj.config.scaleMaxValue = data[Object.keys(data)[0]].maxValue;

				obj.settingOnlyMeColorScaleLegend();
				
				
				var label = obj.config.data[Object.keys(obj.config.data)[0]].sampleId;
				if( obj.config.type === 3 ) {
					$(".rearrange-badge-sample-label").html( label );
				}else if( obj.config.type == 2 ) {
					$(".tumor-badge-sample-label").html( label );
				}else{
					$(".normal-badge-sample-label").html( label );
				}
				
				if ($('#preloader2').length) {
					$('#preloader2').fadeOut('slow', function() {
						$(this).remove();
					});
				}
			}
		});
	}
				
	loadingData2( filters ) {
		var obj = this;

		if( $('#preloader2').length == 0 ) {
			$('#footer').after('<div id="preloader2"></div>');
		}

		
		
		
		
		
		
		
		var regions = JSON.parse(filters.regions);
		/*****************************************************************************************************************************
		 * Modified by insoo078
		 * 29 SEP 2020
		 * 
		 */
//		var needForPostProcess = false;
//		if( obj instanceof PrecalledCancerHiC && obj.controller.prevSvItem !== null && obj.config.container === 'cancerHiCcanvas' ) {
//			var leftBase_chrom = regions[0].split(":")[0];
//			var leftBase_pos = regions[0].split(":")[1].split("-");
//			
//			var rightBase_chrom = regions[ regions.length - 1 ].split(":")[0];
//			var rightBase_pos = regions[ regions.length - 1 ].split(":")[1].split("-");
//
//			if( parseInt(leftBase_pos[0]) > obj.controller.prevSvItem.bin1.chromPos && parseInt(leftBase_pos[1]) >= obj.controller.prevSvItem.bin2.chromPos ) {
//				var nChromStart = obj.controller.prevSvItem.bin1.chromPos;
//				regions[0] = leftBase_chrom + ":" + nChromStart + "-" + rightBase_pos[1];
//
//				needForPostProcess = true;
//			}else if( parseInt(rightBase_pos[0]) < obj.controller.prevSvItem.bin1.chromPos && parseInt(rightBase_pos[1]) <= obj.controller.prevSvItem.bin2.chromPos ) {
//				var nChromEnd = obj.controller.prevSvItem.bin2.chromPos;
//				regions[ regions.length - 1 ] = rightBase_chrom + ":" + rightBase_pos[0] + "-" + nChromEnd;
//				
//				needForPostProcess = true;
//			}
//		}
//		
//		if( obj instanceof UserDefineCancerHiC && obj.undoStack !== 'undefined' && obj.config.container === 'cancerHiCcanvas' ) {
//			for( var i=0; i<obj.undoStack.length; i++) {
//				obj.undoStack[i].bin1.chromPos;
//				obj.undoStack[i].bin2.chromPos;
//			}
//		}
		/*****************************************************************************************************************************/

		
		
		
		
		
		
		
		
		
		
		var strRegions = JSON.stringify(regions);
		
		$.ajax({
			type : 'post'
			,url : 'getContactMapDataFromBedFormats'
			,async:true
			,data:{'bed_data':strRegions, 'samples':filters.samples, 'threshold':filters.threshold, 'get_data_type':'part', 'resolution':obj.config.resolution}
			,success: function( result, status, xhr ) {
				var decodedString = decode(result);
				var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
 
				let decodedText3 = new TextDecoder().decode(un);

				var compressed_result = decodedText3;
				var data = JSON.parse(compressed_result);

				var params = {
					data: data
					, raw_data : JSON.parse(JSON.stringify(data))
					, chromOrder:filters.chromOrder
					, userRegions:JSON.parse(filters.regions)
					, colorPalette: filters.colorPalette
//					, colorScaleValues: obj.colorScaleValues
					, resolution: data[Object.keys(data)[0]].resolution
				};

				if( obj.superEnhancerContainer !== undefined ) {
					$.ajax({
						type : 'post'
						,url : 'getSuperEnhancer'
						,async:false
						,data:{'samples':filters.samples, 'bed_data':filters.regions, 'resolution':data[Object.keys(data)[0]].resolution}
						,success: function( result ) {
							var decodedString = decode(result);
							var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
			 
							let compressed_result = new TextDecoder().decode(un);

//							var compressed_result = LZString.decompressFromBase64(result);
							var data = JSON.parse(compressed_result);

							obj.initSuperEnhancer( data );
						}
					});
				}
				if( obj.gencodeGenesCanvas !== undefined ) {
					$.ajax({
						type : 'post'
						,url : 'getGencodeV34Genes'
						,async:false
						,data:{ 'bed_data':filters.regions, 'resolution':data[Object.keys(data)[0]].resolution, 'optionGene': filters.optionGene }
						,success: function( result ) {
							var decodedString = decode(result);
							var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
			 
							let compressed_result = new TextDecoder().decode(un);

//							var compressed_result = LZString.decompressFromBase64(result);
							var data = JSON.parse(compressed_result);

							obj.initGencodeGenes( data );
						}
					});
				}
				if( obj.refseqGenesCanvas !== undefined ) {
					$.ajax({
						type : 'post'
						,url : 'getRefseqHG38Genes'
						,async:false
						,data:{ 'bed_data':filters.regions, 'resolution':data[Object.keys(data)[0]].resolution, 'optionGene': filters.optionGene }
						,success: function( result ) {
							var decodedString = decode(result);
							var un = SnappyJS.uncompress( new Uint8Array(decodedString) );
			 
							let compressed_result = new TextDecoder().decode(un);

//							var compressed_result = LZString.decompressFromBase64(result);
							var data = JSON.parse(compressed_result);

							obj.initRefseqGenes( data );
						}
					});
				}

				obj.init( params );

				// Initialized slider
				var alpha  = data[ Object.keys(data)[0] ].median / data[ Object.keys(data)[0] ].maxValue * 100;
				
				if( obj.config.colorPalette === 'BtoYtoR' )	$( "#" + obj.config.sliderContainer ).slider("values", [0, alpha * (1/3), 100] );
				else 										$( "#" + obj.config.sliderContainer ).slider("values", [0, alpha] );

//				obj.config.colorScaleValues  = [0, alpha];

				obj.draw();

				if( obj instanceof RearrangeGenomeCancerHiC && obj.config.container === 'cancerHiCcanvas' ) {
					obj.config.filters = filters;

					obj.initRearrangeChrs( filters.tadMap );

					// Ex) chr6:1-123456이 아니라 chr6:123456-1 이렇게 입력한 경우는
					// Inversion으로 처리 한다
					var samples = JSON.parse(filters.samples);
					var regions = JSON.parse(filters.regions);

					var genomeSize = data[samples[0].sample].genomeSize;
					var genomeSizeKey = Object.keys(genomeSize);

					var bin1Pos = 0;
					if( genomeSizeKey.length == regions.length ) {
						for(var i=0; i<genomeSizeKey.length; i++) {
							var parts = regions[i].split(':');
							var chrom = parts[0];
							var pos = parts[1].split("-");

							if( parseInt(pos[0]) > parseInt(pos[1]) ) {
								var start = parseInt(pos[1]);
								var end = parseInt(pos[0]);
 
								var bin2Pos = bin1Pos + genomeSize[genomeSizeKey[i]] - 1;
								
								var bin1 = { 'chr': chrom, 'bin':bin1Pos, 'x':-1, chrBandIdx:-1};
								var bin2 = { 'chr': chrom, 'bin':bin2Pos, 'x':-1, chrBandIdx:-1 };
								obj.controller.doGenomicVariations( bin1, bin2, null, 'INV', true );
							}

							bin1Pos += genomeSize[genomeSizeKey[i]];
						}
					}
				}

				if( obj instanceof PrecalledCancerHiC && null2Empty($("#chosen_sv_type").val()) !== '' ) {
					obj.controller.callbackAutoPredefinedSvDisplay();
				}

				if( obj instanceof PrecalledCancerHiC && obj.controller.prevSvItem !== null && obj.config.container === 'cancerHiCcanvas' ) {
					var flag = 2;
					
					if( flag === 1 ) {
						// Before 1 Oct 2020
						// Predefined 패널의 경우 SV를 만들고 줌인 줌아웃 또는 패닝을 한경우 SV가 사라지는 경우가 있음 해결하기 위한 코드
						var chromBands = obj.getChromosomeBands();
						var binStart = 0;
	
						for(var i=0; i<chromBands.length; i++) {
							var binEnd = binStart + chromBands[i].binSize - 1;
							
							var nScale = d3.scaleLinear()
							.domain([chromBands[i].chromStart, chromBands[i].chromEnd])
							.range([binStart, binEnd]);
	
							if( obj.controller.prevSvItem.svtype !== 'TRA') {
								obj.controller.prevSvItem.bin1.bin = parseInt(nScale( obj.controller.prevSvItem.bin1.chromPos ));
								obj.controller.prevSvItem.bin2.bin = parseInt(nScale( obj.controller.prevSvItem.bin2.chromPos ));
								
							}else {
								if( obj.controller.prevSvItem.bin1.chromPos >= chromBands[i].chromStart && obj.controller.prevSvItem.bin1.chromPos <= chromBands[i].chromEnd ) {
									obj.controller.prevSvItem.bin1.bin = parseInt(nScale( obj.controller.prevSvItem.bin1.chromPos ));
								}
	
								if( obj.controller.prevSvItem.bin2.chromPos >= chromBands[i].chromStart && obj.controller.prevSvItem.bin2.chromPos <= chromBands[i].chromEnd ) {
									obj.controller.prevSvItem.bin2.bin = parseInt(nScale( obj.controller.prevSvItem.bin2.chromPos ));
								}
							}
	
							console.log( obj.controller.prevSvItem );
							console.log( binStart + " to " + binEnd  + "  and (" + chromBands[i].chromStart + "- " +chromBands[i].chromEnd+")    and " + obj.controller.prevSvItem.bin1.chromPos + " => " + obj.controller.prevSvItem.bin1.bin );
							console.log( binStart + " to " + binEnd  + "  and (" + chromBands[i].chromStart + "- " +chromBands[i].chromEnd+")    and " + obj.controller.prevSvItem.bin2.chromPos + " => " + obj.controller.prevSvItem.bin2.bin );
	
							binStart = binEnd + 1;
						}
	
						var svType = obj.controller.prevSvItem.svtype;
						if( svType !== 'DUP' && svType !== 'TRA' && svType !== 'INVDUP' )		obj.doGenomicVariations( obj.controller.prevSvItem.bin1, obj.controller.prevSvItem.bin2, obj.controller.prevSvItem.bin1, svType );
						else																	obj.drawSv( obj.controller.prevSvItem.bin1, obj.controller.prevSvItem.bin2, obj.controller.prevSvItem.bin1, svType );
					}else {
						// After 1 Oct 2020
						// New logic
						var chromBands = obj.getChromosomeBands();

						var binStart = 0;
						for(var i= obj.controller.prevSvItem.bin1.chromIdx; i<=obj.controller.prevSvItem.bin2.chromIdx; i++) {
							var binEnd = binStart + chromBands[i].binSize - 1;
							
							var nScale = d3.scaleLinear()
							.domain([chromBands[i].chromStart, chromBands[i].chromEnd])
							.range([binStart, binEnd]);
							
							if( i === obj.controller.prevSvItem.bin1.chromIdx ) {
								if( obj.controller.prevSvItem.bin1.chromPos >= chromBands[i].chromStart && obj.controller.prevSvItem.bin1.chromPos <= chromBands[i].chromEnd ) {
									obj.controller.prevSvItem.bin1.bin = parseInt(nScale( obj.controller.prevSvItem.bin1.chromPos ));
								}else if( obj.controller.prevSvItem.bin1.chromPos < chromBands[i].chromStart ) {
									obj.controller.prevSvItem.bin1.bin = binEnd;
								}else if( obj.controller.prevSvItem.bin1.chromPos > chromBands[i].chromEnd ) {
									obj.controller.prevSvItem.bin1.bin = binStart;
								}
								console.log( binStart + " to " + binEnd  + "  and (" + chromBands[i].chromStart + "- " +chromBands[i].chromEnd+")    and " + obj.controller.prevSvItem.bin1.chromPos + " => " + obj.controller.prevSvItem.bin1.bin );
							}else if( i === obj.controller.prevSvItem.bin2.chromIdx ) {
								if( obj.controller.prevSvItem.bin2.chromPos >= chromBands[i].chromStart && obj.controller.prevSvItem.bin2.chromPos <= chromBands[i].chromEnd ) {
									obj.controller.prevSvItem.bin2.bin = parseInt(nScale( obj.controller.prevSvItem.bin2.chromPos ));
								}else if( obj.controller.prevSvItem.bin2.chromPos < chromBands[i].chromStart ) {
									obj.controller.prevSvItem.bin2.bin = binStart;
								}else if( obj.controller.prevSvItem.bin2.chromPos > chromBands[i].chromEnd ) {
									obj.controller.prevSvItem.bin2.bin = binEnd;
								}
								console.log( binStart + " to " + binEnd  + "  and (" + chromBands[i].chromStart + "- " +chromBands[i].chromEnd+")    and " + obj.controller.prevSvItem.bin2.chromPos + " => " + obj.controller.prevSvItem.bin2.bin );
							}

							binStart = binEnd + 1;
						}
						
						var svType = obj.controller.prevSvItem.svtype;
						if( svType !== 'DUP' && svType !== 'TRA' && svType !== 'INVDUP' )		obj.doGenomicVariations( obj.controller.prevSvItem.bin1, obj.controller.prevSvItem.bin2, obj.controller.prevSvItem.bin1, svType );
						else																	obj.drawSv( obj.controller.prevSvItem.bin1, obj.controller.prevSvItem.bin2, obj.controller.prevSvItem.bin1, svType );
					}
				}else if(obj instanceof PrecalledCancerHiC && obj.controller.prevSvItem !== null && obj.config.container !== 'cancerHiCcanvas') {
					var svType = obj.controller.prevSvItem.svtype;
					if( !(svType !== 'DUP' && svType !== 'TRA' && svType !== 'INVDUP') )	obj.drawSv( obj.controller.prevSvItem.bin1, obj.controller.prevSvItem.bin2, obj.controller.prevSvItem.bin1, svType );
				}
				
				if( obj instanceof UserDefineCancerHiC && obj.undoStack !== 'undefined' && obj.config.container === 'cancerHiCcanvas' ) {
					if( obj.undoStack !== null && obj.undoStack.length > 0 ){
						var chromBands = obj.getChromosomeBands();

						for(var i=0; i<obj.undoStack.length; i++){
							var band = chromBands[ obj.undoStack[0].bin1.chrBandIdx ];

							//if( obj.undoStack[i].svType !== 'DEL' ) {
							var nScale = d3.scaleLinear()
							.domain([band.chromStart, band.chromEnd])
							.range([band.binStart, band.binEnd]);

							var xScale = d3.scaleLinear()
							.domain([band.chromStart, band.chromEnd])
							.range([band.x, band.x+band.width]);

							obj.undoStack[i].bin1.x = xScale( obj.undoStack[i].bin1.chromPos );
							obj.undoStack[i].bin1.bin = nScale( obj.undoStack[i].bin1.chromPos );
							obj.undoStack[i].bin2.x = xScale( obj.undoStack[i].bin2.chromPos );
							obj.undoStack[i].bin2.bin = nScale( obj.undoStack[i].bin2.chromPos );
							obj.undoStack[i].gapDiff = obj.undoStack[i].bin2.bin - obj.undoStack[i].bin1.bin + 1;
						}

						obj.controller.doSerialUndoOrRedoInWorker( obj.undoStack );
					}
				}

				obj.config.scaleMaxValue = data[Object.keys(data)[0]].maxValue;

				obj.settingOnlyMeColorScaleLegend();
				
				
				var label = obj.config.data[Object.keys(obj.config.data)[0]].sampleId;
				if( obj.config.type === 3 ) {
					$(".rearrange-badge-sample-label").html( label );
				}else if( obj.config.type == 2 ) {
					$(".tumor-badge-sample-label").html( label );
				}else{
					$(".normal-badge-sample-label").html( label );
				}
				
				if ($('#preloader2').length) {
					$('#preloader2').fadeOut('slow', function() {
						$(this).remove();
					});
				}
			}
		});
	}
	drawRuller() {
		var obj = this;
		
		var ctxRuller = obj.rullerCanvas.getContext('2d');
		ctxRuller.clearRect( 0, 0, obj.rullerCanvas.width, obj.rullerCanvas.height );
		
		var oldFont = ctxRuller.font;
		
		var regions = obj.config.userRegions;

		var UNIT_WIDTH = 10;

		for( var i=0; i<regions.length; i++) {
			var region = regions[i];
			
			var regionParts = region.split(":");
			var chrInUserRegion = regionParts[0];
			
			var pos = regionParts[1].split("-");
			var chrStartInUserRegion = parseInt(pos[0]);
			var chrEndtInUserRegion = parseInt(pos[1]);

			var matchedChromosome = this.chromosomeBands[i];

			if( matchedChromosome !== null ) {
				var cx = matchedChromosome.x + ( matchedChromosome.width/2 );
				var x2 = matchedChromosome.x + matchedChromosome.width;

				var scale = d3.scaleLinear()
				.domain([chrStartInUserRegion, chrEndtInUserRegion])
				.range([matchedChromosome.x, matchedChromosome.x + matchedChromosome.width]);

				var currentPinpointNt = chrStartInUserRegion;
				ctxRuller.font = "10px Arial";
				ctxRuller.textBaseline = 'top';
				ctxRuller.textAlign='center';

				var cntOfRulerUnit = 0;
				for( var k=matchedChromosome.x; k<=matchedChromosome.x + matchedChromosome.width; k+=UNIT_WIDTH) {
					var cy2 = 4;

					if( cntOfRulerUnit == 10 ) {
						cy2 = 7;
						
						var value = parseInt(scale.invert(k));

						value = Math.floor(value / obj.config.resolution) * obj.config.resolution;

						var strLabel = "";
						if( value > 1 & value / 1000 < 1000 )											strLabel = parseInt(value / 1000) + "Kb";
						else if( value / 1000 >= 1000 && value / 1000 / 1000 < 1000 )					strLabel = parseInt(value / 1000 / 1000) + "Mb";
						else if( value / 1000 / 1000 >= 1000 && value / 1000 / 1000 / 1000 < 1000 ) 	strLabel = parseInt(value / 1000 / 1000 / 1000) + "Gb";
						ctxRuller.fillText( strLabel, k, cy2 );
//						ctxRuller.fillText( numberWithCommas( value ), k, cy2 );

						cntOfRulerUnit = 0; 
					}

					ctxRuller.beginPath();
					ctxRuller.moveTo(k, 0);
					ctxRuller.lineTo(k, cy2);
					ctxRuller.stroke();
					
					cntOfRulerUnit++;
				}
				
				ctxRuller.font = "12px Arial";
				
				var DIFF_GAP = 10;
				
				var textWidth = ctxRuller.measureText(region).width;

				// Left vertical bar
				ctxRuller.beginPath();
				ctxRuller.moveTo(matchedChromosome.x, 0);
				ctxRuller.lineTo(matchedChromosome.x, obj.rullerCanvas.height);
				ctxRuller.moveTo(matchedChromosome.x, obj.rullerCanvas.height/2 + DIFF_GAP);

				
				ctxRuller.lineTo(matchedChromosome.x + 7, obj.rullerCanvas.height/2 + DIFF_GAP +  - 3);
				ctxRuller.lineTo(matchedChromosome.x + 7, obj.rullerCanvas.height/2 + DIFF_GAP + 3);
				ctxRuller.lineTo(matchedChromosome.x, obj.rullerCanvas.height/2 + DIFF_GAP);

				ctxRuller.lineTo(cx - (textWidth/2) - 10, obj.rullerCanvas.height/2 + DIFF_GAP);
				ctxRuller.moveTo(cx + (textWidth/2) + 10, obj.rullerCanvas.height/2 + DIFF_GAP);
				ctxRuller.lineTo(x2, obj.rullerCanvas.height/2 + DIFF_GAP);

				// Right vertical bar
				ctxRuller.lineTo(x2 - 7, obj.rullerCanvas.height/2 + DIFF_GAP - 3);
				ctxRuller.lineTo(x2 - 7, obj.rullerCanvas.height/2 + DIFF_GAP + 3);
				ctxRuller.lineTo(x2, obj.rullerCanvas.height/2 + DIFF_GAP );
				ctxRuller.moveTo(x2, 0);
				ctxRuller.lineTo(x2, obj.rullerCanvas.height);

				ctxRuller.stroke();
				ctxRuller.fill();

				ctxRuller.textAlign='center';
				if( matchedChromosome.width > 100 ){
					ctxRuller.textBaseline = 'bottom';
					ctxRuller.fillText( region, cx, obj.rullerCanvas.height/2 + 10 );

					ctxRuller.textBaseline = 'top';
					ctxRuller.fillText( "( " + genomeLength4Label( chrEndtInUserRegion - chrStartInUserRegion ) + " )", cx, obj.rullerCanvas.height/2 + 10);
				}else {
					ctxRuller.textBaseline = 'top';
					ctxRuller.fillText( genomeLength4Label( chrEndtInUserRegion - chrStartInUserRegion ), cx, obj.rullerCanvas.height/2 + 10);
				}
			}
		}

		ctxRuller.font = oldFont;
	}
/*	drawRullerBak20200924() {
		var obj = this;
		
		var ctxRuller = obj.rullerCanvas.getContext('2d');
		ctxRuller.clearRect( 0, 0, obj.rullerCanvas.width, obj.rullerCanvas.height );
		
		var oldFont = ctxRuller.font;
		
		var regions = obj.config.userRegions;

		var UNIT_WIDTH = 20;
		
		for( var i=0; i<regions.length; i++) {
			var region = regions[i];
			
			var regionParts = region.split(":");
			var chrInUserRegion = regionParts[0];
			
			var pos = regionParts[1].split("-");
			var chrStartInUserRegion = parseInt(pos[0]);
			var chrEndtInUserRegion = parseInt(pos[1]);

			var matchedChromosome = this.chromosomeBands[i];

			if( matchedChromosome !== null ) {
				var DIVIDE_SIZE = 10;
				var cx = matchedChromosome.x + ( matchedChromosome.width/2 );
				var x2 = matchedChromosome.x + matchedChromosome.width;
				
				var scrnWidthGap = parseInt(matchedChromosome.width/DIVIDE_SIZE);
				if(scrnWidthGap < 10)									DIVIDE_SIZE = 2;
				else if( scrnWidthGap >= 10 && scrnWidthGap < 30 )		DIVIDE_SIZE = 3;
				else if( scrnWidthGap >= 30 && scrnWidthGap < 50 )		DIVIDE_SIZE = 5;
				else if( scrnWidthGap >= 50 && scrnWidthGap < 70 )		DIVIDE_SIZE = 7;

				var ntUnitGap = parseInt( (chrEndtInUserRegion - chrStartInUserRegion + 1) / DIVIDE_SIZE );
				
				var scale = d3.scaleLinear()
				.domain([chrStartInUserRegion, chrEndtInUserRegion])
				.range([matchedChromosome.x, matchedChromosome.x + matchedChromosome.width]);

				var currentPinpointNt = chrStartInUserRegion;
				ctxRuller.font = "10px Arial";
				ctxRuller.textBaseline = 'top';
				ctxRuller.textAlign='center';
				for(var k=0; k<=DIVIDE_SIZE; k++) {
					var cy = 5;
					var cy2 = 8;

					var xCalibration = scale( currentPinpointNt );
//					var nextXCalibration = scale( currentPinpointNt + ntUnitGap );
//					
//					var sWUnit = parseInt((nextXCalibration - xCalibration) / 10);
//					for(var ivb=0; ivb<10; ivb++) {
//						ctxRuller.beginPath();
//						ctxRuller.moveTo(xCalibration + (ivb*sWUnit), 0);
//						ctxRuller.lineTo(xCalibration + (ivb*sWUnit), cy);
//						ctxRuller.stroke();
//					}
					
					ctxRuller.beginPath();
					ctxRuller.moveTo(xCalibration, 0);
					ctxRuller.lineTo(xCalibration, cy2);
					ctxRuller.stroke();

					if( k != 0 && k != DIVIDE_SIZE )
						ctxRuller.fillText( numberWithCommas(currentPinpointNt), xCalibration, cy2 );

					currentPinpointNt += ntUnitGap;
				}
				
				ctxRuller.font = "12px Arial";
				
				var DIFF_GAP = 10;
				
				var textWidth = ctxRuller.measureText(region).width;

				// Left vertical bar
				ctxRuller.beginPath();
				ctxRuller.moveTo(matchedChromosome.x, 0);
				ctxRuller.lineTo(matchedChromosome.x, obj.rullerCanvas.height);
				ctxRuller.moveTo(matchedChromosome.x, obj.rullerCanvas.height/2 + DIFF_GAP);

				
				ctxRuller.lineTo(matchedChromosome.x + 7, obj.rullerCanvas.height/2 + DIFF_GAP +  - 3);
				ctxRuller.lineTo(matchedChromosome.x + 7, obj.rullerCanvas.height/2 + DIFF_GAP + 3);
				ctxRuller.lineTo(matchedChromosome.x, obj.rullerCanvas.height/2 + DIFF_GAP);

				ctxRuller.lineTo(cx - (textWidth/2) - 10, obj.rullerCanvas.height/2 + DIFF_GAP);
				ctxRuller.moveTo(cx + (textWidth/2) + 10, obj.rullerCanvas.height/2 + DIFF_GAP);
				ctxRuller.lineTo(x2, obj.rullerCanvas.height/2 + DIFF_GAP);

				// Right vertical bar
				ctxRuller.lineTo(x2 - 7, obj.rullerCanvas.height/2 + DIFF_GAP - 3);
				ctxRuller.lineTo(x2 - 7, obj.rullerCanvas.height/2 + DIFF_GAP + 3);
				ctxRuller.lineTo(x2, obj.rullerCanvas.height/2 + DIFF_GAP );
				ctxRuller.moveTo(x2, 0);
				ctxRuller.lineTo(x2, obj.rullerCanvas.height);

				ctxRuller.stroke();
				ctxRuller.fill();

				ctxRuller.textAlign='center';
				if( matchedChromosome.width > 100 ){
					ctxRuller.textBaseline = 'bottom';
					ctxRuller.fillText( region, cx, obj.rullerCanvas.height/2 + 10 );

					ctxRuller.textBaseline = 'top';
					ctxRuller.fillText( "( " + genomeLength4Label( chrEndtInUserRegion - chrStartInUserRegion ) + " )", cx, obj.rullerCanvas.height/2 + 10);
				}else {
					ctxRuller.textBaseline = 'middle';
					ctxRuller.fillText( genomeLength4Label( chrEndtInUserRegion - chrStartInUserRegion ), cx, obj.rullerCanvas.height/2 + 10);
				}
			}
		}

		ctxRuller.font = oldFont;
	}*/
	doGenomicVariations( bin1, bin2, tarPos, svType ) {
		this.bin14Svg = bin1;
		this.bin24Svg = bin2;
		this.tarPos4Svg = tarPos;
		this.svType4Svg = svType;

		this.changeSVtypes( bin1, bin2, tarPos, svType );
	}
	recoveryGenomicVariations( src_chrom_start, tar_chrom_start, tarPos, svType ) {
		if( svType === 'DEL' )	{
			this.changeSVtypes( src_chrom_start, tar_chrom_start, tarPos, 'INS' );
		}else {
			this.changeSVtypes( src_chrom_start, tar_chrom_start, tarPos, svType );
		}
	}
	drawChrBands( dragFlag, sp, ep ){
		var obj = this;
		var ctxChr = obj.chromosomeCanvas.getContext('2d');
		ctxChr.clearRect( 0, 0, obj.chromosomeCanvas.width, obj.chromosomeCanvas.height );

		var oldFont = ctxChr.font;
		var oldFillStyle = ctxChr.fillStyle;
		var chromosomeBandY = 0;

		this.chromosomeBands = [];

//		console.log( this.config );
		ctxChr.globalAlpha = 0.4;
//		var colours = ["green", "blue", "yellow", "purple", "cyan", "orange", "gray", "magenta", "pink"];
		var sx = this.margin;
		var idx = 0;
		var height = this.config.chrBandHeight;
		
		var chromLabelMap = {};
		
		var binStart = 0;
		for( var i=0; i<Object.keys(this.config.data[this.samples[0]].genomeSize).length; i++){
			var chr = Object.keys(this.config.data[this.samples[0]].genomeSize)[i];
			var chrWithoutIdx = chr.split('-')[0];
			
			var chromosomeNoOfBin = this.config.data[this.samples[0]].genomeSize[chr];

			var width = (chromosomeNoOfBin * Math.sqrt(2)) * this.drawRate;

//			ctxChr.fillStyle = colours[i];
			ctxChr.fillStyle = chromColorMap[chrWithoutIdx];
			ctxChr.beginPath();
			ctxChr.rect(sx, chromosomeBandY, width, height);
			ctxChr.fill();

			ctxChr.fillStyle = oldFillStyle;
//			ctxChr.font = "bold 12px Arial";
//			ctxChr.textAlign='center';
//			ctxChr.textBaseline = 'middle';
//			ctxChr.fillText( chrWithoutIdx, sx + (width/2), chromosomeBandY + (height/2) );
			
			var scale = d3.scaleLinear()
			.range([idx, idx + chromosomeNoOfBin - 1])
			.domain([sx, sx + width]);
			
			var scaleBin2Xpos = d3.scaleLinear()
			.domain([idx, idx + chromosomeNoOfBin - 1])
			.range([sx, sx + width]);

			var binEnd = binStart + chromosomeNoOfBin - 1;
			if( this.config.userRegions[i] !== undefined ) {
				var genomicPos = getSplittedRegion( this.config.userRegions[i] );
				
				var genomicScale = d3.scaleLinear()
				.domain([ parseInt(genomicPos.chromStart), parseInt(genomicPos.chromEnd)])
				.range([sx, sx + width]);
	
				var chrBandObj = {
						x:sx
						, y:chromosomeBandY
						, width:width
						, height:height
						, scale:scale
						, chrom:chrWithoutIdx
						, chromStart:parseInt(genomicPos.chromStart)
						, chromEnd:parseInt(genomicPos.chromEnd)
						, binSize:chromosomeNoOfBin
						, genomicScale:genomicScale
						, scaleBin2Xpos:scaleBin2Xpos
						, binStart:binStart
						, binEnd:binEnd
				};
				// 각각의 입력된 region의 
				this.chromosomeBands.push( chrBandObj );

				sx += width;
				idx += chromosomeNoOfBin;
			}
//			console.log("drawChrBands", binStart + " - " + binEnd );
			binStart = binEnd + 1;
		}
		
		/***********************************************************************************
		 * Merging ajacent chrmosome bands to draw chromsome label text
		 * 
		 * Added by insoo078
		 * Date : 23 SEP 2020
		 * 
		 */
		var labelRectArr = [];
		var prevChrBandObj = this.chromosomeBands[0];
		var labelRectObj = {chrom:prevChrBandObj.chrom, x:prevChrBandObj.x, width:prevChrBandObj.width};
		for(var i=1; i<this.chromosomeBands.length; i++){
			var currentChrBandObj = this.chromosomeBands[i];

			if( prevChrBandObj.chrom == currentChrBandObj.chrom ) {
				labelRectObj.chrom = prevChrBandObj.chrom;
				labelRectObj.x = Math.min(prevChrBandObj.x, currentChrBandObj.x);
				var x2 = Math.max( (prevChrBandObj.x + prevChrBandObj.width), (currentChrBandObj.x + currentChrBandObj.width) );

				labelRectObj.width = x2 - labelRectObj.x;
			}else {
				labelRectArr.push( {chrom:labelRectObj.chrom, x:labelRectObj.x, width:labelRectObj.width} );

				prevChrBandObj = currentChrBandObj;
				labelRectObj = {chrom:prevChrBandObj.chrom, x:prevChrBandObj.x, width:prevChrBandObj.width};
			}
		}
		labelRectArr.push( {chrom:labelRectObj.chrom, x:labelRectObj.x, width:labelRectObj.width} );
		
		ctxChr.font = "bold 12px Arial";
		ctxChr.textAlign='center';
		ctxChr.textBaseline = 'middle';
		for(var i=0; i<labelRectArr.length; i++) {
			var vx = labelRectArr[i].x + (labelRectArr[i].width/2);
			var vy = chromosomeBandY + (height/2);

			ctxChr.fillText( labelRectArr[i].chrom, vx, vy );
		}
		/**********************************************************************************/

		ctxChr.font = oldFont;
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
		
		if( this.config.colorPalette == "WtoR" ) 			ctx.fillStyle = 'rgb(255, 255, 255)'; 
		else if( this.config.colorPalette == "BtoYtoR" )	ctx.fillStyle = 'rgb(50, 50, 150)';

		ctx.beginPath();
		ctx.rect(0, 0, this.canvas.width , this.canvas.height );
		ctx.fill()

		ctx.translate( 0, this.resolution  / 2);
		ctx.rotate(-45 * Math.PI / 180);
		
		ctx.scale(this.drawRate, this.drawRate);
		this.config.data[sample]
		var oldFillStyle = ctx.fillStyle;
		var oldStrokeStyle = ctx.strokeStyle;

		for(var i=0; i<this.samples.length; i++) {
			var sample = this.samples[i];
			
			var thres = 400;
			var thres2 = 20;

			var maxValue = this.config.data[sample].median  * ( this.colorScaleValues[1] / 100 );
			var minThres = thres * ( this.colorScaleValues[0] / 100 );
			
			var alpha = (maxValue / this.config.data[sample].maxValue) * 100;
			
			var sampleData = this.config.data[sample];

			if( this.config.colorPalette == "WtoR" ){
				for(var j=0; j<sampleData['data'].length; j++) {
					var point = sampleData['data'][j];

					var x = point.iRow;
					var y = point.iCol + this.margin;
					var value = point.intensity;

					var cv = value;

//					var nvl = (value/parseFloat(maxValue) * thres );
//					if(nvl > thres2)		cv = 0;
//					else					cv = 255 - (nvl/thres2 * 255);
//					ctx.fillStyle = 'rgb(255, '+cv+', '+cv+')';
//					
//					var nvl = (value/parseFloat(maxValue) * thres );
//					if(nvl > thres2)		cv = 0;
//					else					cv = 255 - (value/maxValue * 255);

					if( value > maxValue )		cv = 0;
					else						cv = 255 - (value/maxValue * 255);
					ctx.fillStyle = 'rgb(255, '+cv+', '+cv+')';
					
					if( this.colorScaleValues ){
						if( value < minThres ) ctx.fillStyle = 'rgb(255,255,255)';
					}

					ctx.beginPath();
					ctx.rect(x, y, 1, 1);
					ctx.fill();
				}
			}else if( this.config.colorPalette == "BtoYtoR" ){
//				var thres = 400;
//				var maxValue = this.config.data[sample].maxValue;
				var thres = this.config.data[sample].median;
				var thres2 = 20;

				var minThres = thres * ( this.colorScaleValues[0] / 100 );
				var middleThres = thres * ( this.colorScaleValues[1] / 100 );
				var maxThres = this.config.data[sample].maxValue * ( this.colorScaleValues[2] / 100 );

				for(var j=0; j<sampleData['data'].length; j++) {
					var point = sampleData['data'][j];

					var x = point.iRow;
					var y = point.iCol + this.margin;
					var value = point.intensity;

					var cv = value;

					if( value <= minThres ) ctx.fillStyle = 'rgb(50, 50, 150)';
					else if( value > minThres && value <= middleThres ){
						var blue = 150 * (value / (middleThres - minThres));
						var cv = 205 * (value / (middleThres - minThres)) + 50;
						ctx.fillStyle = 'rgb(' + cv + ', ' + cv + ', ' + (150 - blue) +')';
					}else if( value > middleThres && value <= maxThres ){
						var cv = 255 * ( (value - middleThres) / (middleThres - minThres));
						ctx.fillStyle = 'rgb(255, ' + (255 - cv) + ', 0)';
					}else if( value > maxThres ){
						ctx.fillStyle = 'rgb(255,0,0)';
					}
					
					ctx.beginPath();
					ctx.rect(x, y, 1, 1);
					ctx.fill();
				}
			}

			ctx.fillStyle = oldFillStyle;
//			
//			if( colorScaleMaxValue < this.config.data[sample].maxValue ){
//				colorScaleMaxValue = this.config.data[sample].maxValue;
//				
//				this.settingColorScaleLegend();
//			}
		}
		ctx.fillStyle = oldFillStyle;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		
		var unitHeight = 1;
		ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
		ctx.strokeStyle = 'gray';
		ctx.beginPath();
		ctx.rect( (this.canvas.width - 50), 10, unitHeight, unitHeight );
		ctx.fill();
		ctx.stroke();

		var val = unitHeight * parseInt(this.config.resolution);

		var strVal = "";
		if( val / 1000000 > 1 ) {
			strVal = parseInt(Math.ceil(val / 1000000)) + "Mb";
		}else if( val / 1000 > 1 ) {
			strVal = parseInt(Math.ceil(val / 1000)) + "Kb";
		}else{
			strVal = val + "b";
		}

		ctx.font = "13px Arial";
		ctx.textAlign='center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'rgb(0, 0, 0)'; 
		ctx.fillText( strVal, (this.canvas.width - 50) + (unitHeight/2), (15 + unitHeight) );
		
		ctx.fillStyle = oldFillStyle;
		ctx.strokeStyle = oldStrokeStyle;
	}
	drawSuperEnhancer() {
		var obj = this;

		if( obj.superEnhancerContainer !== undefined ) {
			var selector = obj.superEnhancerContainer;
			var ctx = selector.getContext('2d');
			ctx.clearRect( 0, 0, selector.width, selector.height );
	
			var oldFont = ctx.font;
			var oldFillStyle = ctx.fillStyle;
	
			ctx.strokeStyle = 'rgb(106, 168, 62)';
			var baseY = selector.height/2;
	//			baseY = 5;
			var subRegions = this.config.superenhancer;

			if( subRegions !== undefined && subRegions !== null ) {
				for(var i=0; i<Object.keys(subRegions).length; i++) {
					var pt = this.config.superenhancer[ Object.keys(subRegions)[i] ];
					
					var minBin = 0;
					var maxBin = obj.config.data[ Object.keys(obj.config.data)[0] ].nRow;

					var rScale2 = d3.scaleLinear()
					.domain([minBin, maxBin])
					.range([ 0, obj.resolution ]);
					
					for( var j = 0; j<pt.length; j++) {
//						var x1 = scale(pt[j].start);
//						var x2 = scale(pt[j].end);
//						
						var x1 = rScale2( pt[j].startBin );
						var x2 = rScale2( pt[j].endBin );
	
						ctx.beginPath();
						ctx.moveTo(x1, baseY - 4);
						ctx.lineTo(x1, baseY + 4 );
						ctx.moveTo(x1, baseY);
						ctx.lineTo(x2, baseY);
						ctx.moveTo(x2, baseY - 4);
						ctx.lineTo(x2, baseY + 4 );
						ctx.stroke();
					}
				}
			}

			ctx.fillStyle = oldFillStyle;
			ctx.font = oldFont;
		}
	}
	drawGencodeGenes() {
		var obj = this;

		if( this.gencodeGenesCanvas !== undefined ) {
			var selector = this.gencodeGenesCanvas;
			var ctx = selector.getContext('2d');
			ctx.clearRect( 0, 0, selector.width, selector.height );
	
			var oldFont = ctx.font;
			var oldFillStyle = ctx.fillStyle;
			var oldStrokeStyle = ctx.strokeStyle;
	
			var baseY = this.config.chrBandHeight/2;
	//			baseY = 5;
			var subRegions = this.config.gencode;
			
			if( subRegions !== undefined && subRegions !== null ) {
				var drawingObjs = {};

				if( obj.config.gencodeGenesDisplayType === 'dense' ) {
					this.gencodeGenesCanvas.width = this.resolution;
					this.gencodeGenesCanvas.height = (1 * baseY) + baseY;
					this.gencodeGenesCanvas.style='height:' + this.gencodeGenesCanvas.height + 'px;width:' + this.gencodeGenesCanvas.width + 'px;background:#fafafa;';
				}

				ctx.fillStyle = 'rgba(33, 45, 176, 0.7)';
				ctx.strokeStyle = 'rgba(33, 45, 176, 0.7)';

				var layer = 0;
				for(var i=0; i<Object.keys(subRegions).length; i++) {
					var pt = this.config.gencode[ Object.keys(subRegions)[i] ];
					
					var subRegionChr = Object.keys(subRegions)[i].split("-")[0];

					var band = this.chromosomeBands[i];
/*
					var scale = d3.scaleLinear()
					.domain([ band.chromStart, band.chromEnd])
					.range([band.x, band.x + band.width]);
*/
					var scale = d3.scaleLinear()
					.domain([ band.binStart, band.binEnd])
					.range([band.x, band.x + band.width]);
					
					//console.log( band.binStart + " - " + band.binEnd );

					for( var j = 0; j<pt.length; j++) {
						var x1 = scale( pt[j].startBin );
						var x2 = scale( pt[j].endBin );

						var gap = 0;
						if( (x2-x1) >= 10 ) 					gap = 3;
						else if( (x2-x1) < 10 && (x2-x1) >= 5 )	gap = 2;
						else if( (x2-x1) < 5 && (x2-x1) >= 3 )	gap = 1;
	
						if( obj.config.gencodeGenesDisplayType === 'dense' ) {
							// 화면에 그려질 유전자 수가 많은 경우에는 트랙 하나에 모든 유전자를 그린다
							ctx.beginPath();
							if( pt[j].strand === '+' ) {
								ctx.moveTo(x1, baseY - 4);
								ctx.lineTo(x2-gap, baseY - 4);
								ctx.lineTo(x2, baseY);
								ctx.lineTo(x2-gap, baseY + 4);
								ctx.lineTo(x1, baseY + 4);
								ctx.lineTo(x1, baseY - 4);
							}else {
								ctx.moveTo(x1+gap, baseY - 4);
								ctx.lineTo(x2, baseY - 4);
								ctx.lineTo(x2, baseY + 4);
								ctx.lineTo(x1+gap, baseY + 4);
								ctx.lineTo(x1, baseY);
							}
							ctx.fill();
							ctx.stroke();
						}else {
							// 화면에 그려질 유전자 수가 많지 않을 경우에는 유전자 영역과 유전자 명을 그려줄때, 겹치게 되는것을 방지하기 위해 track no를 만들어 그려준다

							var textMeasure = ctx.measureText(pt[j].name);
							
//							var minBin = 0;
//							var maxBin = obj.config.data[ Object.keys(obj.config.data)[0] ].nRow;
//							
//							var rScale2 = d3.scaleLinear()
//							.domain([minBin, maxBin])
//							.range([ 0, obj.resolution ]);
//							
//							var x1 = rScale2( pt[j].startBin );
//							var x2 = rScale2( pt[j].endBin );

							var item = {x1:x1, y1:baseY, x2:x2, textX:(x1-2), textWidth:(textMeasure.width + 10), y2:baseY, label:pt[j].name, strand:pt[j].strand, start:pt[j].start, end:pt[j].end};
							CancerHiC._putLayer( item, drawingObjs );
						}
					}
				}
				

				ctx.fillStyle = 'rgb(99, 99, 99)';
				ctx.strokeStyle = 'rgb(33, 45, 176)';
				
				if( obj.config.gencodeGenesDisplayType !== 'dense' ) {
					this.gencodeGenesCanvas.width = this.resolution;
					this.gencodeGenesCanvas.height = (Object.keys( drawingObjs ).length * baseY) + baseY;
					this.gencodeGenesCanvas.style='height:' + this.gencodeGenesCanvas.height + 'px;width:' + this.gencodeGenesCanvas.width + 'px;background:#fafafa;';

					ctx.textAlign='right';
					ctx.textBaseline = 'middle'; 
					
					ctx.fillStyle = 'rgb(99, 99, 99)';

					for(var i=0; i<Object.keys(drawingObjs).length; i++) {
						var layerNo = Object.keys(drawingObjs)[i];
	
						var items = drawingObjs[ layerNo ];
						for(var j=0; j<items.length; j++) {
							var item = items[j];
	
							var y = (item.y1) * i + baseY;

							ctx.strokeStyle = 'rgb(33, 45, 176)';
							ctx.beginPath();
							ctx.moveTo(item.x1, y - 4);
							ctx.lineTo(item.x1, y + 4 );
							ctx.moveTo(item.x1, y);
							ctx.lineTo(item.x2, y);
							ctx.moveTo(item.x2, y - 4);
							ctx.lineTo(item.x2, y + 4 );
							ctx.stroke();
							
							
							ctx.strokeStyle = 'rgb(21, 140, 0)';
							var geneWidth = item.x2 - item.x1;
							var dirUnitWidth = geneWidth / 3;
							if( item.strand === '+' ) {
								if( dirUnitWidth > 1 ) {
									var xGeneDirPos = item.x1;
									for( var k=0; k<3; k++) {
										ctx.beginPath();
										ctx.moveTo(xGeneDirPos - 5, y - 3);
										ctx.lineTo(xGeneDirPos, y );
										ctx.lineTo(xGeneDirPos - 5, y + 3);
										ctx.stroke();

										xGeneDirPos += dirUnitWidth;
									}
								}else {
									var xGeneDirPos = item.x1 + (geneWidth/2);
									
									ctx.beginPath();
									ctx.moveTo(xGeneDirPos - 5, y - 3);
									ctx.lineTo(xGeneDirPos, y );
									ctx.lineTo(xGeneDirPos - 5, y + 3);
									ctx.stroke();
								}
							}else {
								if( dirUnitWidth > 1 ) {
									var xGeneDirPos = item.x1;
									for( var k=0; k<3; k++) {
										ctx.beginPath();
										ctx.moveTo(xGeneDirPos + 5, y - 3);
										ctx.lineTo(xGeneDirPos, y );
										ctx.lineTo(xGeneDirPos + 5, y + 3);
										ctx.stroke();

										xGeneDirPos += dirUnitWidth;
									}
								}else {
									var xGeneDirPos = item.x1 + (geneWidth/2);
									ctx.beginPath();
									ctx.moveTo(xGeneDirPos + 5, y - 3);
									ctx.lineTo(xGeneDirPos, y );
									ctx.lineTo(xGeneDirPos + 5, y + 3);
									ctx.stroke();
								}
							}

							ctx.fillText( item.label, item.textX, y );
						}
					}
				}
			}

			ctx.fillStyle = oldFillStyle;
			ctx.strokeStyle = oldStrokeStyle;
			ctx.font = oldFont;
		}
	}
	drawRefseqGenes() {
		var obj = this;

		if( this.refseqGenesCanvas !== undefined ) {
			var selector = this.refseqGenesCanvas;
			var ctx = selector.getContext('2d');
			ctx.clearRect( 0, 0, selector.width, selector.height );
	
			var oldFont = ctx.font;
			var oldFillStyle = ctx.fillStyle;
			var oldStrokeStyle = ctx.strokeStyle;
	
			var baseY = this.config.chrBandHeight/2;
	//			baseY = 5;
			var subRegions = this.config.refseq;

			if( subRegions !== undefined && subRegions !== null ) {
				var drawingObjs = {};
				
				if( obj.config.refseqGenesDisplayType === 'dense' ) {
					this.refseqGenesCanvas.width = this.resolution;
					this.refseqGenesCanvas.height = (1 * baseY) + baseY;
					this.refseqGenesCanvas.style='height:' + this.refseqGenesCanvas.height + 'px;width:' + this.refseqGenesCanvas.width + 'px;background:#fafafa;';
				}
				
				ctx.fillStyle = 'rgba(33, 45, 176, 0.7)';
				ctx.strokeStyle = 'rgba(33, 45, 176, 0.7)';

				var layer = 0;
				for(var i=0; i<Object.keys(subRegions).length; i++) {
					var pt = this.config.refseq[ Object.keys(subRegions)[i] ];
					
					var subRegionChr = Object.keys(subRegions)[i].split("-")[0];

					var band = this.chromosomeBands[i];

					var scale = d3.scaleLinear()
					.domain([ band.binStart, band.binEnd])
					.range([band.x, band.x + band.width]);

					for( var j = 0; j<pt.length; j++) {
						var x1 = scale( pt[j].startBin );
						var x2 = scale( pt[j].endBin );

						var gap = 0;
						if( (x2-x1) >= 10 ) 					gap = 3;
						else if( (x2-x1) < 10 && (x2-x1) >= 5 )	gap = 2;
						else if( (x2-x1) < 5 && (x2-x1) >= 3 )	gap = 1;
						
						if( obj.config.refseqGenesDisplayType === 'dense' ) {
							// 화면에 그려질 유전자 수가 많은 경우에는 트랙 하나에 모든 유전자를 그린다
							ctx.beginPath();
							if( pt[j].strand === '+' ) {
								ctx.moveTo(x1, baseY - 4);
								ctx.lineTo(x2-gap, baseY - 4);
								ctx.lineTo(x2, baseY);
								ctx.lineTo(x2-gap, baseY + 4);
								ctx.lineTo(x1, baseY + 4);
								ctx.lineTo(x1, baseY - 4);
							}else {
								ctx.moveTo(x1+gap, baseY - 4);
								ctx.lineTo(x2, baseY - 4);
								ctx.lineTo(x2, baseY + 4);
								ctx.lineTo(x1+gap, baseY + 4);
								ctx.lineTo(x1, baseY);
							}
							ctx.fill();
							ctx.stroke();
						}else {
							// 화면에 그려질 유전자 수가 많지 않을 경우에는 유전자 영역과 유전자 명을 그려줄때, 겹치게 되는것을 방지하기 위해 track no를 만들어 그려준다
							var textMeasure = ctx.measureText(pt[j].name);
							
//							var minBin = 0;
//							var maxBin = obj.config.data[ Object.keys(obj.config.data)[0] ].nRow;
//							
//							var rScale2 = d3.scaleLinear()
//							.domain([minBin, maxBin])
//							.range([ 0, obj.resolution ]);
//							
//							var x1 = rScale2( pt[j].startBin );
//							var x2 = rScale2( pt[j].endBin );

							var item = {x1:x1, y1:baseY, x2:x2, textX:(x1-2), textWidth:(textMeasure.width + 10), y2:baseY, label:pt[j].name, strand:pt[j].strand, start:pt[j].start, end:pt[j].end};
							CancerHiC._putLayer( item, drawingObjs );
						}
					}
				}

				ctx.strokeStyle = 'rgb(33, 45, 176)';
				ctx.fillStyle = 'rgb(99, 99, 99)';
				if( obj.config.refseqGenesDisplayType !== 'dense' ) {
					this.refseqGenesCanvas.width = this.resolution;
					this.refseqGenesCanvas.height = (Object.keys( drawingObjs ).length * baseY) + baseY;
					this.refseqGenesCanvas.style='height:' + this.refseqGenesCanvas.height + 'px;width:' + this.refseqGenesCanvas.width + 'px;background:#fafafa;';

					ctx.textAlign='right';
					ctx.textBaseline = 'middle'; 
					
					ctx.fillStyle = 'rgb(99, 99, 99)';

					for(var i=0; i<Object.keys(drawingObjs).length; i++) {
						var layerNo = Object.keys(drawingObjs)[i];
	
						var items = drawingObjs[ layerNo ];
						for(var j=0; j<items.length; j++) {
							var item = items[j];
	
							var y = (item.y1) * i + baseY;

							ctx.strokeStyle = 'rgb(33, 45, 176)';
							ctx.beginPath();
							ctx.moveTo(item.x1, y - 4);
							ctx.lineTo(item.x1, y + 4 );
							ctx.moveTo(item.x1, y);
							ctx.lineTo(item.x2, y);
							ctx.moveTo(item.x2, y - 4);
							ctx.lineTo(item.x2, y + 4 );
							ctx.stroke();

							ctx.strokeStyle = 'rgb(21, 140, 0)';
							var geneWidth = item.x2 - item.x1;
							var dirUnitWidth = geneWidth / 3;
							if( item.strand === '+' ) {
								if( dirUnitWidth > 1 ) {
									var xGeneDirPos = item.x1;
									for( var k=0; k<3; k++) {
										ctx.beginPath();
										ctx.moveTo(xGeneDirPos - 5, y - 3);
										ctx.lineTo(xGeneDirPos, y );
										ctx.lineTo(xGeneDirPos - 5, y + 3);
										ctx.stroke();

										xGeneDirPos += dirUnitWidth;
									}
								}else {
									var xGeneDirPos = item.x1 + (geneWidth/2);
									
									ctx.beginPath();
									ctx.moveTo(xGeneDirPos - 5, y - 3);
									ctx.lineTo(xGeneDirPos, y );
									ctx.lineTo(xGeneDirPos - 5, y + 3);
									ctx.stroke();
								}
							}else {
								if( dirUnitWidth > 1 ) {
									var xGeneDirPos = item.x1;
									for( var k=0; k<3; k++) {
										ctx.beginPath();
										ctx.moveTo(xGeneDirPos + 5, y - 3);
										ctx.lineTo(xGeneDirPos, y );
										ctx.lineTo(xGeneDirPos + 5, y + 3);
										ctx.stroke();

										xGeneDirPos += dirUnitWidth;
									}
								}else {
									var xGeneDirPos = item.x1 + (geneWidth/2);
									ctx.beginPath();
									ctx.moveTo(xGeneDirPos + 5, y - 3);
									ctx.lineTo(xGeneDirPos, y );
									ctx.lineTo(xGeneDirPos + 5, y + 3);
									ctx.stroke();
								}
							}
							
							ctx.fillText( item.label, item.textX, y );
						}
					}
				}
			}

			ctx.fillStyle = oldFillStyle;
			ctx.strokeStyle = oldStrokeStyle;
			ctx.font = oldFont;
		}
	}
	draw(){
		var obj = this;

		obj.drawContactMap();
		obj.drawChrBands( false, -1, -1 );
		obj.drawRuller();
		obj.drawSuperEnhancer();
		obj.drawGencodeGenes();
		obj.drawRefseqGenes();
	}
	static _putLayer( data, dataset ) {
		var layerIdxs = Object.keys(dataset);
		if( layerIdxs.length == 0 ) {
			dataset[0] = [ data ];
		}else if( layerIdxs.length > 0 ) {
			var isOverlapped = false;

			for(var i=0; i<layerIdxs.length; i++) {
				var items = dataset[ layerIdxs[i] ];

				for(var j=0; j<items.length; j++) {
					if( getOverlap( (items[j].textX - items[j].textWidth), items[j].x2, (data.textX - data.textWidth), data.x2 ) > 0 ) {
						// overlapped
						isOverlapped = true;
						break;
					}
				}
				if( isOverlapped === false ) {
					items.push( data );
					isOverlapped = true;
					break;
				}
				isOverlapped = false;
			}
			if( isOverlapped === false ) {
				var currentMaxLayerNo = layerIdxs[layerIdxs.length-1];
				var newLayerNo = parseInt(currentMaxLayerNo) + 1;
				dataset[newLayerNo] = [data];
			}
		}
	}
	getChromosomeBands(){
		return this.chromosomeBands;
	}
	changeSVtypes( bin1, bin2, tarBin, svType ) {
		// Bin1은 반드시 Bin2보다 앞쪽이어야 함
//		if( bin1.bin > bin2.bin ) {
//			var temp = bin1;
//			bin1 = bin2;
//			bin2 = temp;
//		}

//		if( svType === 'DEL' || svType=== 'TRA' ) {
//			var newChromArray = this.svCreateRegion;
//
//			var gapDiff = 0;
//			var newItemArray = [];
//			if( svType === 'DEL' ) {
////				this.config.svCreatedRegsion = [];
//				//  나중에 binsize와 bin start - end 맞추기
////				console.log( newChromArray );
////				console.log( bin1.bin );
////				console.log( bin2.bin );
//
//				console.log( this.resolution );
//				for( var i=0; i<newChromArray.length; i++) {
//					if( bin1.chr == newChromArray[i].chrom && bin1.bin >= newChromArray[i].startBin && bin1.bin <= newChromArray[i].endBin ) {
//						var diffBin = bin2.bin - bin1.bin + 1;
//						
//						var x1 = newChromArray[i].x;
//						var x2 = newChromArray[i].x + newChromArray[i].width;
//						
//						var coordScale = d3.scaleLinear()
//						.domain([newChromArray[i].startBin, newChromArray[i].endBin])
//						.range([x1, x2]);
//						
//						var size1 = bin1.bin-1 - newChromArray[i].startBin;
//						var size2 = newChromArray[i].endBin - bin2.bin+1 + 1;
//						
//						var item1StartChrom = newChromArray[i].scale(newChromArray[i].startBin);
//						var item1EndChrom = newChromArray[i].scale(bin1.bin-1);
//						
//						var x11 = coordScale( newChromArray[i].startBin );
//						var x12 = coordScale( bin1.bin-1 );
//						
//						var item2StartChrom = newChromArray[i].scale(bin2.bin+1);
//						var item2EndChrom = newChromArray[i].scale(newChromArray[i].endBin);
//						
//						var x21 = coordScale( bin2.bin+1 );
//						var x22 = coordScale( newChromArray[i].endBin );
//						
////						var alpha = Math.min((x22-x21), (x12-x11)) / Math.max((x22-x21), (x12-x11));
//
//						var diff = (x21 - x12);
//						
//						var left = diff * ((x12-x11) / ((x12-x11) + (x22-x21)));
//						var right = diff * ((x22-x21) / ((x12-x11) + (x22-x21)));
//						
//						console.log( diff + " " + left + " -- " + right + " ==> " + bin1.bin + " --  " + bin2.bin + '   (' + newChromArray[i].startBin + ')' );
//						
//						var nScale1 = d3.scaleLinear()
//						.domain([newChromArray[i].startBin, bin1.bin-1])
//						.range([item1StartChrom, item1EndChrom]);
//						
//						var rScale1 = d3.scaleLinear()
//						.domain([newChromArray[i].startBin, bin1.bin-1])
//						.range([x11, x12 + left]);
//						
//						var nScale2 = d3.scaleLinear()
//						.domain([bin2.bin+1 - diffBin, newChromArray[i].endBin - diffBin])
//						.range([item2StartChrom, item2EndChrom]);
//
//						var rScale2 = d3.scaleLinear()
//						.domain([bin2.bin+1 - diffBin, newChromArray[i].endBin - diffBin])
//						.range([x21 - right, x22]);
//
//						var item1 = {
//								chrom:newChromArray[i].chrom
//								, startBin:newChromArray[i].startBin
//								, endBin:bin1.bin-1
//								, startChrom:item1StartChrom
//								, endChrom:item1EndChrom, binSize:size1
//								, scale:nScale1
//								, revScale:rScale1
//								, x:x11
//								, width:(x12 + left - x11)
//							};
//
//						var item2 = {
//								chrom:newChromArray[i].chrom
//								, startBin:bin2.bin+1 - diffBin
//								, endBin:newChromArray[i].endBin - diffBin
//								, startChrom:item2StartChrom
//								, endChrom:item2EndChrom
//								, binSize:size2
//								, scale:nScale2
//								, revScale:rScale2
//								, x:(x21 - right)
//								, width:(x22-x21)
//							};
//						
//						newItemArray.push(item1);
//						newItemArray.push(item2);
//						
//						gapDiff += diffBin;
//
////						this.config.svCreatedRegsion.push( newChromArray[i].chrom + ":" + item1StartChrom + "-" + item1EndChrom );
////						this.config.svCreatedRegsion.push( newChromArray[i].chrom + ":" + item2StartChrom + "-" + item2EndChrom );
//					}else {
////						var rScale = d3.scaleLinear()
////						.domain([newChromArray[i].startChrom, newChromArray[i].endChrom])
////						.range([newChromArray[i].startBin - gapDiff, newChromArray[i].endBin - gapDiff]);
//						
//						console.log("last test", newChromArray[i].startBin + " " + newChromArray[i].endBin + "  => " + gapDiff  );
//						
//						var rScale = d3.scaleLinear()
//						.domain([newChromArray[i].startBin - gapDiff, newChromArray[i].endBin - gapDiff])
//						.range([newChromArray[i].x, newChromArray[i].x + newChromArray[i].width]);
//                                                                                                                                                                                          
//						var item2 = {
//								chrom:newChromArray[i].chrom
//								, startBin:newChromArray[i].startBin - gapDiff
//								, endBin:newChromArray[i].endBin - gapDiff
//								, startChrom:newChromArray[i].startChrom
//								, endChrom:newChromArray[i].endChrom
//								, binSize:newChromArray[i].binSize
//								, scale:newChromArray[i].scale
//								, revScale:rScale
//								, x:newChromArray[i].x
//								, width:newChromArray[i].width
//							};
//						newItemArray.push( item2 );
//						
////						this.config.svCreatedRegsion.push( newChromArray[i].chrom + ":" + newChromArray[i].startChrom + "-" + newChromArray[i].endChrom );
//					}
//				}
//			}
//
////			this.testVariable = newItemArray;
//			this.svCreateRegion = newItemArray;
//			console.log( this.svCreateRegion );
//		}

		var obj = this;
		if(typeof(webworker) == "undefined") {
		    const worker = new Worker("resources/js/cancerhic/worker/procSvDataTypeWorker.js");

		   	worker.postMessage( [this.config, bin1, bin2, tarBin, svType, (bin2.bin-bin1.bin+1)] );
		    worker.addEventListener('message', function(e) {
		    	console.log('Worker said: ', e.data[1]);

		    	obj.config = e.data[0];

				// 바꾸거나 추가해야 할것 리스트
				// this.config.chromOrder {'chr6-1', 'chr7-1'}
				// this.config.data.genomeSize {'chr6-0':34, 'chr7-1':34}
		    	obj.drawRate = (obj.resolution - (2*obj.margin)) / ( obj.config.data[ obj.samples[0] ].nRow * Math.sqrt(2) );

		    	obj.reInitChromosomeBands( svType, bin1, bin2, tarBin );
		    	obj.drawChrBands(false, -1, -1);

		    	//obj.reInitRuller( svType, bin1, bin2, tarBin );
		    	obj.drawRuller();
		    	
		    	obj.drawContactMap();

		    	obj.drawSuperEnhancer();
		    	obj.drawGencodeGenes();
		    	obj.drawRefseqGenes();

		    	// 가이드 라인 수정해야함
		    	if( svType === 'DUP' || svType === 'INVDUP') {
		    		var diff = bin2.bin - bin1.bin -1;
		    		
//		    		var nTarBin = JSON.parse(JSON.stringify(tarBin));
//		    		var nBin1 = JSON.parse(JSON.stringify(bin1));
//		    		var nBin2 = JSON.parse(JSON.stringify(bin2));
//		    		if( bin1.bin > tarBin.bin ){
//		    			// 왼쪽으로 새로운 데이터가 추가되므로 기존 가이드는 오른쪽으로 이동시켜줘야 함
//		    			nBin1.bin += diff;
//		    			nBin2.bin += diff;
//		    		}
//	    			obj.drawSv(nBin1, nBin2, nTarBin, svType);

		    		if( bin1.bin < 0 )											bin1.bin = 0;
		    		if( bin1.bin > obj.config.data[obj.samples[0]].nRow )		bin1.bin = obj.config.data[obj.samples[0]].nRow;

		    		obj.drawSv(bin1, bin2, tarBin, svType);
		    		
//					if( obj instanceof UserDefineCancerHiC && obj.undoStack.length > 0 ) {
//			    		var stackItem = obj.undoStack[ obj.undoStack.length-1 ];
//			    		stackItem.bin1 = bin1;
//			    		stackItem.bin2 = bin2;
//			    		stackItem.tarPos = tarBin;
//		    		}
		    	}else {
		    		var diff = bin2.bin - bin1.bin -1;
		    		var nBin1 = JSON.parse(JSON.stringify(bin1));
		    		var nBin2 = JSON.parse(JSON.stringify(bin2));
		    		var nTarBin = tarBin;
		    		if( svType === 'TRA' ) {
			    		nTarBin = JSON.parse(JSON.stringify(tarBin));

		    			if( bin2.bin < tarBin.bin ){
			    			// 왼쪽으로 새로운 데이터가 추가되므로 기존 가이드는 오른쪽으로 이동시켜줘야 함
		    				nTarBin.bin -= diff;
			    		}else {
			    			nBin1.bin += diff;
			    			nBin2.bin += diff;
			    		}
		    		}

		    		if( nBin1.bin < 0 )											nBin1.bin = 0;
		    		if( nBin2.bin > obj.config.data[obj.samples[0]].nRow )		nBin2.bin = obj.config.data[obj.samples[0]].nRow; 

					// SV에 의해 변화가 일어나야 할것
			    	obj.drawSv(nBin1, nBin2, nTarBin, svType);
			    	
//			     	if( obj instanceof UserDefineCancerHiC && obj.undoStack.length > 0 ) {
//			    		var stackItem = obj.undoStack[ obj.undoStack.length-1 ];
//			    		stackItem.bin1 = nBin1;
//			    		stackItem.bin2 = nBin2;
//			    		stackItem.tarPos = nTarBin;
//			    	}
		    	}

		    	// SV in Raw data drawing
				// 4 raw original data
		    	obj.controller.redrawRawSv(bin1, bin2, tarBin, svType, e.data[0].data[ obj.samples[0] ].picked_points );

				// 4 normal data
		    	obj.controller.redrawNormalSv(bin1, bin2, tarBin, svType, e.data[0].data[ obj.samples[0] ].picked_points );

		    	worker.terminate();
	    	}, false);
		}

		if( this.isOff == true )	this.isOff = false;
		else						this.isOff = true;
	}
	getTargetBinInfo( point, chromosomeBands ) {
		var bin2 = null;
		for(var i=0; i<chromosomeBands.length; i++) {
			if( chromosomeBands[i].x <= point && (chromosomeBands[i].x + chromosomeBands[i].width) >= point ) {
				var hitObj = chromosomeBands[i];
				var bin = parseInt(hitObj.scale(point));

				var nScale = d3.scaleLinear()
				.domain([hitObj.x, (hitObj.x  + hitObj.width)])
				.range([this.chromosomeBands[i].chromStart, this.chromosomeBands[i].chromEnd]);

				bin2 = { 'chr':hitObj.chrom, 'bin':bin, 'x':point, chrBandIdx:i, 'chromPos':nScale(point) };

				break;
			}
		}
		return bin2;
	}
	addController( controller ) {
		this.controller = controller;
	}
	settingOnlyMeColorScaleLegend(){
		var point = "|<br/>";
		$("#" + this.config.sliderLegendMin ).html(point + 0);
		$("#" + this.config.sliderLegendMiddle ).html( point + Math.ceil( this.config.scaleMaxValue / 2 ) );
		$("#" + this.config.sliderLegendMax ).html( point + Math.ceil( this.config.scaleMaxValue ) );
	}
	getColorScaleValues() {
		var values;
		if( $("#color_palette").val() == "WtoR" ){
			$("#" + this.config.sliderContainer).css("background", "linear-gradient(to right, white 0%, red 100%)" );
			values = [0, 100];
		}else if( $("#color_palette").val() == "BtoYtoR" ){
			$("#" + this.config.sliderContainer).css("background", "linear-gradient(to right, blue 0%, yellow 50%, red 100%)" );
			values = [0, 50, 100];
		}
		return values;
	}
	getOriginalChrom( item, binMap ) {
		var chroms = Object.keys(binMap);
		
		var retArr = new Array(2);
		for(var i=0; i<chroms.length; i++) {
			if( item.iRow >= binMap[chroms[i]].startBin && item.iRow <= binMap[chroms[i]].endBin )	retArr[0] = chroms[i];
			if( item.iCol >= binMap[chroms[i]].startBin && item.iCol <= binMap[chroms[i]].endBin )	retArr[1] = chroms[i];
		}
		return retArr;
	}
	initRearrangeChrs( tadMap ) {
		var obj = this;

		if( obj instanceof RearrangeGenomeCancerHiC && obj.config.container === 'cancerHiCcanvas' ) {
			obj.config.data = null;
			obj.config.data = JSON.parse( JSON.stringify( obj.config.raw_data ) );

			var data = obj.config.data;

			var samples = Object.keys(data);
			
			var value1 = $("#departed_in_cis_value").val();
			var value2 = $("#new_contact_value").val();

			for( var i=0; i<samples.length; i++) {
				var contactMapData = data[samples[i]].data;

				var chromosomes = Object.keys( data[samples[i]].genomeSize );

				// to Crete bin map
				var pos = 0;
				var chromMap = {};
				for(var j=0; j<chromosomes.length; j++) {
					var startBin = pos;
					var endBin = startBin + data[samples[i]].genomeSize[ chromosomes[j] ] - 1;
					chromMap[chromosomes[j]] = {startBin:startBin, endBin:endBin};

					pos = endBin + 1;
				}

				for(var j=0; j<contactMapData.length; j++) {
					var item = contactMapData[j];
					var retArr = obj.getOriginalChrom( item, chromMap );

					if( retArr[0] !== undefined && retArr[1] !== undefined ) {
						/*
						 * 						case 1: first in-cis, but it is fragmented
						 * 								value => 0
						 */

						var chrom1 = retArr[0].split("-")[0];
						var chrom2 = retArr[1].split("-")[0];
						
						if( retArr[0] !== retArr[1] && chrom1 === chrom2 )												contactMapData[j].intensity = parseInt(value1);


						/*
						 * 						case 2: ajacent fragment interaction
						 * 								value => userdefined values
						 */
						var index1Chr = chromosomes.indexOf( retArr[0] );
						var index2Chr = chromosomes.indexOf( retArr[1] );

						var diff = Math.abs( index1Chr - index2Chr );

						try {
							if( diff == 1 && (chrom1 !== chrom2 && tadMap[retArr[0]] === tadMap[retArr[1]]) )				contactMapData[j].intensity *= parseInt(value2);
						}catch(err){
							console.log( err );
						}
					}
				}
			}
			obj.draw();
		}
	}

	/*****************************************************************************************
	This area was modified by insoo078
	26 SEP 2020
	
	*************************************************************************************** */
	_rulerMouseEventProc(){
		var obj = this;

		this.canvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});
		this.chromosomeCanvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});
		this.rullerCanvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});
		
		this.rullerCanvas.addEventListener('mousemove', function(e) {
			obj.rulerMouseMoveHandler(obj, e);
		});

		this.rullerCanvas.addEventListener("mousedown", function(e){
			obj.rulerMouseDownHandler(obj, e);
		});
 
		if( obj.gencodeGenesCanvas !== undefined && obj.gencodeGenesCanvas !== null ) {
			obj.gencodeGenesCanvas.addEventListener('mousedown', function(e) {
				obj.geneMouseDownHandler(obj, $(this), e);
			});
		};
		
		if( obj.refseqGenesCanvas !== undefined && obj.refseqGenesCanvas !== null ) {
				obj.refseqGenesCanvas.addEventListener('mousedown', function(e) {
				obj.geneMouseDownHandler(obj, $(this), e);
			});
		}

		if( obj.superEnhancerContainer !== undefined && obj.superEnhancerContainer !== null ) {
			obj.superEnhancerContainer.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});
		}
	}

	rulerMouseMoveHandler(obj, e) {
		var mx = e.offsetX;
		var my = e.offsetY;
		
		var selector = $('#' + $(obj.rullerCanvas).attr("id"));
	
		var isHover = -1;
		if( obj.controller.cutRegionEndObj !== undefined  && obj.controller.cutRegionStartObj !== undefined ) {
			if( obj.controller.cutRegionStartObj.x1 - 5 <= mx && obj.controller.cutRegionStartObj.x1 + 5 >= mx  && my >= 0 && my <= 20 )	selector.css("cursor", "pointer");
			else if( obj.controller.cutRegionEndObj.x2 - 5 <= mx && obj.controller.cutRegionEndObj.x2 + 5 >= mx  && my >= 0 && my <= 20 ) 	selector.css("cursor", "pointer");
			else																															selector.css("cursor", "default");
		}
	
		if( e.buttons == 1 ) {
			if( obj.controller.cutWhichHover !== undefined && obj.controller.cutWhichHover == 1 )		{
				var results = obj.getWchichChromsome( obj.chromosomeBands, mx );
	
				if( results !== null ) {
					var chromBand = results[1];
	
					var gPos1 = parseInt(chromBand.genomicScale.invert(mx));
			
					if( mx >= obj.controller.cutRegionEndObj.x2 ) {
						return;
					}
					
					obj.controller.cutRegionStartObj = {chrom:chromBand.chrom, x1:mx, x2:-1, index:results[0], genomicCoordinate:gPos1, viewer:obj};
		
					$("#cutStart").val( obj.controller.cutRegionStartObj.chrom + ":" + numberWithCommas(obj.controller.cutRegionStartObj.genomicCoordinate) );
				}
			}else if( obj.controller.cutWhichHover !== undefined && obj.controller.cutWhichHover == 2 ){
				var results = obj.getWchichChromsome( obj.chromosomeBands, mx );
	
				if( results !== null ) {
					var chromBand = results[1];
					var gPos2 = parseInt(chromBand.genomicScale.invert(mx));
					
					if( obj.controller.cutRegionStartObj.x1 >= mx ) {
						return;
					}
					obj.controller.cutRegionEndObj = {chrom:chromBand.chrom, x1:-1, x2:mx, index:results[0], genomicCoordinate:gPos2, viewer:obj};
					
					$("#cutEnd").val( obj.controller.cutRegionEndObj.chrom + ":" + numberWithCommas(obj.controller.cutRegionEndObj.genomicCoordinate) );
				}
			}
	
			obj.drawRuller();
			obj._drawCutArea();
		}
	}
	
	getWchichChromsome( chromosomeBands, x ) {
		for( var i=0; i<chromosomeBands.length; i++ ) {
			if( chromosomeBands[i].x <= x && (chromosomeBands[i].x + chromosomeBands[i].width) >= x ) {
				return [i, chromosomeBands[i]];
			}
		}
		return null;
	}
	
	rulerMouseDownHandler(obj, e) {
		if(e.buttons == 1 ) {
			var mx = e.offsetX;
			var my = e.offsetY;
	
			var isHover = -1;
			if( obj.controller.cutRegionEndObj !== undefined  && obj.controller.cutRegionStartObj !== undefined ) {
				if( obj.controller.cutRegionStartObj.x1 - 5 <= mx && obj.controller.cutRegionStartObj.x1 + 5 >= mx  && my >= 0 && my <= 20 )	obj.controller.cutWhichHover = 1;
				else if( obj.controller.cutRegionEndObj.x2 - 5 <= mx && obj.controller.cutRegionEndObj.x2 + 5 >= mx  && my >= 0 && my <= 20 )	obj.controller.cutWhichHover = 2;
				else 																															delete obj.controller.cutWhichHover;
			}
	
		}else if(e.buttons == 2 ){		
			$.contextMenu({
	            selector: '#' + $(obj.rullerCanvas).attr("id"),
	            callback: function(key, options) {
	            	if( key == 'cut' ) {
	            		var dialog = $(".cut-controller-panel");
	            		dialog.removeClass('d-none');
	
	            		var top = $(window).height() / 2;
	            		var left = $(window).width() / 2;
	            		
	            		var scrollTop = $(window).scrollTop();
	            		
	            		var dialogTop = e.pageY - 400;
	            		if( dialogTop - scrollTop < 50 ) dialogTop = e.pageY + 30;
	
	            		dialog.css("top", dialogTop);
	            		dialog.css("left", left - dialog.width()/2 );
	
	            		dialog.draggable();
	
	            		var regions = obj.config.userRegions;
	
	            		var GAP1 = (obj.chromosomeBands[0].width * 0.2);
	
	            		var chrom1 = obj.chromosomeBands[0].chrom;
	            		var x11 = obj.chromosomeBands[0].x + GAP1;
	            		var x12 = x11 + obj.chromosomeBands[0].width - (2*GAP1);
	            		
	            		var gPos1 = parseInt(obj.chromosomeBands[0].genomicScale.invert( x11 ));
	            		
	            		
	            		obj.controller.cutRegionStartObj = {chrom:chrom1, x1:x11, x2:x12, index:0, genomicCoordinate:gPos1, viewer:obj};
	
	            		var GAP2 = (obj.chromosomeBands[ regions.length - 1 ].width * 0.2);
	            		
	            		var chrom2 = obj.chromosomeBands[ regions.length - 1 ].chrom;
	            		var x21 = obj.chromosomeBands[ regions.length - 1 ].x + GAP2;
	            		var x22 = x21 + obj.chromosomeBands[ regions.length - 1 ].width - (2 * GAP2);
	            		
	            		var gPos2 = parseInt(obj.chromosomeBands[ regions.length - 1 ].genomicScale.invert( x22 ));
	
	            		obj.controller.cutRegionEndObj = {chrom:chrom2, x1:x21, x2:x22, index:regions.length-1, genomicCoordinate:gPos2, viewer:obj};
	
	            		obj.drawRuller();
	            		obj._drawCutArea();
	            		
	            		$("#cutStart").val( obj.controller.cutRegionStartObj.chrom + ":" + numberWithCommas(obj.controller.cutRegionStartObj.genomicCoordinate) );
	        			$("#cutEnd").val( obj.controller.cutRegionEndObj.chrom + ":" + numberWithCommas(obj.controller.cutRegionEndObj.genomicCoordinate) );

						var which_tab = 1;
						if(obj instanceof PrecalledCancerHiC )				which_tab = 1;
						else if(obj instanceof UserDefineCancerHiC )		which_tab = 2;
						else if( obj instanceof RearrangeGenomeCancerHiC )	which_tab = 3;

						$("#which_tab_cut_dialog").val( which_tab);
						$("#which_panel_cut_dialog").val( obj.config.container);
						//console.log( obj.config.container );
						//"cancerHiCcanvas"
						//"cancerHiCoriginCanvas"
						//""normalHiCcanvas""
	            	}
	            },
	            items: {
	                'cut': {
	                    name: " Cut",
	                    icon: "fa-cut"
	                },
	                "sep1": "---------",
//	                'gencode': {
//	                    name: function(){
//	                    	var code = "dense";
//	                    	if( obj.config.gencodeGenesDisplayType === 'dense' )	code = 'full';
//	                    	else													code = 'dense';
//	                    	
//	                    	console.log( code +  " vs " + obj.config.gencodeGenesDisplayType );
//	                    	
//	                    	return ' Gencode track : ' + code;
//	                    },
//	                    icon: function(){
//	                    	if( obj.config.gencodeGenesDisplayType === 'dense' )	return 'fa fa-cubes';
//	                    	else													return 'fa fa-cube';
//	                    }
//	                },
//	                'refseq': {
//	                    name: function(){
//	                    	var code = "dense";
//	                    	if( obj.config.refseqGenesDisplayType === 'dense' )		code = 'full';
//	                    	
//	                    	return ' Refseq track : ' + code;
//	                    },
//	                    icon: function(){
//	                    	if( obj.config.refseqGenesDisplayType === 'dense' )		return 'fa fa-cubes';
//	                    	else													return 'fa fa-cube';
//	                    }
//	                },
//	                "sep2": "---------",
	                "quit": {
	                    name: " Quit",
	                    icon: function() {
	                        return 'context-menu-icon context-menu-icon-quit';
	                    }
	                }
	            }
	        });
		}
	}
	
	geneMouseDownHandler(obj, currentGeneContainer, e) {
		if(e.buttons == 2 ){		
			$.contextMenu({
	            selector: '#' + $(currentGeneContainer).attr("id"),
	            callback: function(key, options) {
					var displayType = key;
					
					if( $(currentGeneContainer).attr("id").startsWith("gencode") ) {
						obj.config.gencodeGenesDisplayType = displayType;
						
						console.log( obj.config.gencodeGenesDisplayType );
						
						obj.drawGencodeGenes();
					}else if( $(currentGeneContainer).attr("id").startsWith("refseq") ) {
						obj.config.refseqGenesDisplayType = displayType;

						obj.drawRefseqGenes();
					}
	            },
	            items: {
	                'dense': {
	                    name: " Dense",
	                    icon: "fa-cube"
	                },
					'full': {
	                    name: " Full",
	                    icon: "fa-cubes"
	                }
	            }
	        });
		}
	}
	
	_drawCutArea() {
		var obj = this;
		var ctx = obj.rullerCanvas.getContext('2d');

		var oldFillStyle = ctx.fillStyle;
		var oldStrokeStyle = ctx.strokeStyle;
		
		var obj1 = obj.controller.cutRegionStartObj;
		var obj2 = obj.controller.cutRegionEndObj;

		if( obj1 !== undefined && obj2 !== undefined ) {
			ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
			ctx.fillRect(obj1.x1, 0, obj2.x2 - obj1.x1, 20);
		}

		if( obj1 !== undefined ) {
			ctx.strokeStyle = 'rgba(200, 200, 200, 1)';
			ctx.fillStyle = "rgba(255, 0, 0, 1)";
			ctx.beginPath();
			ctx.moveTo(obj1.x1, 0);
			ctx.lineTo(obj1.x1-5, 5 );
			ctx.lineTo(obj1.x1-5, 20 );
			ctx.lineTo(obj1.x1+5, 20 );
			ctx.lineTo(obj1.x1+5, 5 );
			ctx.lineTo(obj1.x1, 0 );
			ctx.fill();
			ctx.stroke();
		}
		
		if( obj2 !== undefined ) {
			ctx.fillStyle = "rgba(0, 86, 255, 1)";
			ctx.beginPath();
			ctx.moveTo(obj2.x2, 0);
			ctx.lineTo(obj2.x2-5, 5 );
			ctx.lineTo(obj2.x2-5, 20 );
			ctx.lineTo(obj2.x2+5, 20 );
			ctx.lineTo(obj2.x2+5, 5 );
			ctx.lineTo(obj2.x2, 0 );
			ctx.fill();
			ctx.stroke();
		}
		
		ctx.fillStyle = oldFillStyle;
		ctx.strokeStyle = oldStrokeStyle;
	}
	/*****************************************************************************************
	This area was modified by insoo078
	26 SEP 2020
	
	*************************************************************************************** */
}

class CancerViewerController{
	constructor( params ){
		this.viewer = null;
		this.originDataViewer = null;
		this.donePanelCnt = 0;
		
		this.initHg38ChromosomeMap();
		this.initControlls();
	}
	
	initTooltips() {
		$('[data-toggle="tooltip"]').tooltip();
		
		$('[data-toggle="tooltip"]').on('show.bs.tooltip', function(){
			if( $(this).hasClass('ruler-tooltip') ) {
				$(this).attr('data-original-title', "Right-click on the track to crop the region of interest");
			}else if( $(this).hasClass('gencode-tooltip') ) {
				$(this).attr('data-original-title', "Right-click on the track to expand or collapse it");
			}else if( $(this).hasClass('refseq-tooltip') ) {
				$(this).attr('data-original-title', "Right-click on the track to expand or collapse it");
			}
		});
	}
	
	initControlls() {
		var obj = this;

		$("#predefined-sv-tab").click(function(){
			location.href = "cancer_hic?tab=1";
		});
		$("#userdefined-sv-tab").click(function(){
			location.href = "cancer_hic?tab=2";
		});
		$("#user-rearrangement-tab").click(function(){
			location.href = "cancer_hic?tab=3";
		});
		
		$("button.btn-zoom").click(function(){
			var filters = obj.getFilterSettings();
//			var regions = JSON.parse( filters.regions );
			var regions = obj.originDataViewer.config.userRegions;

			var alpha = 1;
			var dir = 1;
			if( $(this).hasClass('btn-zoom-in-x2') ) {
				alpha = 0.15;
				dir = 1;
			}else if( $(this).hasClass('btn-zoom-in-x1') ) {
				alpha = 0.05;
				dir = 1;
			}else if( $(this).hasClass('btn-zoom-out-x1') ) {
				alpha = 0.05;
				dir = -1;
			}else{
				alpha = 0.15;
				dir = -1;
			}

			var minDiff = Number.MAX_SAFE_INTEGER;
			for(var i=0; i<regions.length; i++) {
				var fields = regions[i].split(":");
				var pos = fields[1].split("-");
				var chromStart = parseInt(pos[0]);
				var chromEnd = parseInt(pos[1]);
				
				var subDiff = (chromEnd - chromStart + 1);
				if( minDiff > subDiff ) minDiff = subDiff;
			}

			var regionMap = [];
			var cntSuccess = 0;
			for(var i=0; i<regions.length; i++) {
				var fields = regions[i].split(":");
				var pos = fields[1].split("-");
				var chromStart = parseInt(pos[0]);
				var chromEnd = parseInt(pos[1]);
				
//				var diff = (chromEnd - chromStart +1) * alpha;
				var diff = minDiff * alpha;

				chromStart += (diff * dir);
				chromEnd -= (diff * dir);
				
				var minLen = 1;
				var maxLen = obj.chromosomeMap[fields[0]].length;

				if( chromStart < minLen )	chromStart = minLen;
				if( chromEnd > maxLen )		chromEnd = maxLen;

				regionMap.push( {chrom:fields[0], chromStart:chromStart, chromEnd:chromEnd} );
			}

			if( obj instanceof PrecalledSvViewerController ) {
				if( obj.prevSvItem !== null ) {
/*
					var chrom1 = obj.prevSvItem.bin1.chr;
					var bin1 = obj.prevSvItem.bin1.chromPos;
					
					var chrom2 = obj.prevSvItem.bin2.chr;
					var bin2 = obj.prevSvItem.bin2.chromPos;

					var cnt = 0;
					for(var i=0; i<regionMap.length; i++) {
						if( bin1 >= regionMap[i].chromStart && bin1 <= regionMap[i].chromEnd && chrom1 == regionMap[i].chrom )
							cnt+=1;
						if( bin2 >= regionMap[i].chromStart && bin2 <= regionMap[i].chromEnd && chrom2 == regionMap[i].chrom )
							cnt+=1;
					}

					// SV 좌표가 현재 영역을 벗어나는 경우
					if( cnt !== 2 ) {
						var r = confirm("Are you sure? If you choose 'YES' SV you have chosen may not displayed");
	
						if( r == true)	obj.prevSvItem = null;
						else			return;
					}
*/
				}
			}else if( obj instanceof UserDefineDynamicSvViewerController ) {
/*				if( obj.viewer.undoStack !== undefined ) {
					for( var i=0; i<obj.viewer.undoStack.length; i++ ) {
						var item = obj.viewer.undoStack[i];

						if( item.svType !== 'TRA') {
							var chromosome1 = regionMap[item.bin1.chrBandIdx];
							var chromosome2 = regionMap[item.bin2.chrBandIdx];
	
							var cnt = 0;
							if( chromosome1.chrom === item.bin1.chr && chromosome1.chromStart <= item.bin1.chromPos && chromosome1.chromEnd >= item.bin1.chromPos )
								cnt += 1;
							if( chromosome2.chrom === item.bin2.chr && chromosome2.chromStart <= item.bin2.chromPos && chromosome2.chromEnd >= item.bin2.chromPos )
								cnt += 1;
							
//							if( item.tarPos != undefined ) {
//								var chromosome3 = regionMap[item.bin1.chrBandIdx];
//	
//								if( chromosome3.chrom == item.tarPos.chr && chromosome3.chromStart <= item.tarPos.chromPos && chromosome3.chromEnd >= item.tarPos.chromPos )
//									cnt += 1;
//
//								if( cnt !== 3 ) {
//									var r = confirm("Are you sure? If you choose 'YES' SV you have chosen may not displayed : type3 " + cnt );
//									if( r == true )	obj.viewer.undoStack = [];
//									else			return;
//								}
//							}else {
							if( cnt !== 2 ) {
								var r = confirm("Are you sure? If you choose 'YES' SV you have chosen may not displayed" );
								if( r == true )	{
									obj.viewer.undoStack = [];
									obj.viewer.redoStack = [];
									obj.resetRedoUndoButton();
								}else	return;
							}
//							}
						}else {
							// TRA case
							var cnt = 0;
							for(var j=0; j<regionMap.length; j++) {
								var chromosome1 = regionMap[j];
								
								if( chromosome1.chrom === item.bin1.chr && chromosome1.chromStart <= item.bin1.chromPos && chromosome1.chromEnd >= item.bin1.chromPos )
									cnt += 1;
								if( chromosome1.chrom === item.bin2.chr && chromosome1.chromStart <= item.bin2.chromPos && chromosome1.chromEnd >= item.bin2.chromPos )
									cnt += 1;
								if( chromosome1.chrom === item.tarPos.chr && chromosome1.chromStart <= item.tarPos.chromPos && chromosome1.chromEnd >= item.tarPos.chromPos )
									cnt += 1;
							}
							if( cnt < 3 ) {
								var r = confirm("Are you sure? If you choose 'YES' SV you have chosen may not displayed : type2 " + cnt);
								if( r == true )	obj.viewer.undoStack = [];
								else			return;
							}
						}
					}
				}*/
			}else if( obj instanceof RearrangeGenomeViewerController ) {
				var tadMap = getTadFragments( $("#textarea_bed_format").val() );
				filters['tadMap'] = tadMap;
			}

			for(var i=0; i<regionMap.length; i++) {
				regions[i] = regionMap[i].chrom + ":" + parseInt( regionMap[i].chromStart) + "-" + parseInt(regionMap[i].chromEnd);
			}
			
			if( obj instanceof PrecalledSvViewerController ) {
				obj.reloadPrecalledSVList();
			}

			filters.regions = JSON.stringify(regions);
//			$("#json_regions").val( filters.regions );

			obj.loadingData( filters );
		});
		
		$("button.btn-pan").click(function(){
			var filters = obj.getFilterSettings();
//			var regions = JSON.parse( filters.regions );
			var regions = obj.originDataViewer.config.userRegions;

			var alpha = 1;
			var dir = -1;
			if( $(this).hasClass('btn-pan-down-x2') ) {
				alpha = 0.15;
				dir = -1;
			}else if( $(this).hasClass('btn-pan-down-x1') ) {
				alpha = 0.05;
				dir = -1;
			}else if( $(this).hasClass('btn-pan-up-x1') ) {
				alpha = 0.05;
				dir = 1;
			}else{
				alpha = 0.15;
				dir = 1;
			}

			for(var i=0; i<regions.length; i++) {
				var fields = regions[i].split(":");
				var pos = fields[1].split("-");
				var chromStart = parseInt(pos[0]);
				var chromEnd = parseInt(pos[1]);
				
				var diffLen = chromEnd - chromStart + 1;
				var diff = Math.floor(diffLen * alpha);

				chromStart += (diff * dir);
				chromEnd += (diff * dir);
				
				var minLen = 1;
				var maxLen = obj.chromosomeMap[fields[0]].length;

				if( chromStart < minLen )	{
					chromStart = minLen;
					chromEnd = chromStart + diffLen - 1;
				}

				if( chromEnd > maxLen ){
					chromStart = maxLen - diffLen + 1;
					chromEnd = maxLen;
				}

				var nRegion = fields[0] + ":" + parseInt(chromStart) + "-" + parseInt(chromEnd);
				regions[i] = nRegion;
			}
			filters.regions = JSON.stringify(regions);

			$("#json_regions").val( filters.regions );

			if( obj instanceof RearrangeGenomeViewerController ) {
				var tadMap = getTadFragments( $("#textarea_bed_format").val() );
				filters['tadMap'] = tadMap;
			}

			obj.loadingData( filters );
			
			if( obj instanceof PrecalledSvViewerController ) {
				obj.reloadPrecalledSVList();
			}

//			if( obj instanceof UserDefineDynamicSvViewerController ) {
//				obj.doSerialUndoOrRedoInWorker( obj.viewer.undoStack );
//			}
		});

		if ( localStorage.length > 0 ) {
			var simpleManual = localStorage.getItem('simpleManual');
			
			if( simpleManual == "up" ) {
				$('#simpleManualBtn').children().addClass('fa-caret-square-o-down');
				$('#simpleManualBtn').children().removeClass('fa-caret-square-o-up');
				
				$('#collapseOne').removeClass('show');
				$('#simpleManualBtn').addClass('collapsed');
			} else {
				$('#simpleManualBtn').children().addClass('fa-caret-square-o-up');
				$('#simpleManualBtn').children().removeClass('fa-caret-square-o-down');
			}
		}

		// Added at 2020 SEP 21
		
		var windowWidth = $(window).width();
		$(".flex-controller-panel").css("left", windowWidth - $(".flex-controller-panel").width() - 50);

		$(window).scroll(function () {
			var baseTop = 400;
			var scrollTop = $(this).scrollTop();

			var panel = $(".flex-controller-panel");
			panel.css("top", scrollTop + 110);

			if( scrollTop >= baseTop ) {
				panel.removeClass("d-none");
			}else {
				panel.addClass("d-none");
			}
		});
		
//		$( ".flex-controller-panel" ).draggable({
//			  handle: "div.flex-controller-panel-title"
//		});
		
		$( ".flex-controller-panel" ).draggable();

		$('#flex_controller_btn').click(function (e) {
			e.preventDefault();
			
			if( $(this).hasClass('collapsed') ) {
				$(this).children().addClass('fa-toggle-up');
				$(this).children().removeClass('fa-toggle-down');
			} else {
				$(this).children().addClass('fa-toggle-down');
				$(this).children().removeClass('fa-toggle-up');
			}
		});
		///////////////////////////////////////////////////////////////////
		
		// Added at 2020 SEP 25
		$(".btn-cut-dialog-close").on("click", function(){
			obj.resetCutDialogSettings();
		});

		$(".btn-cut-dialog-apply").on("click", function(){
			var chromosomeBands = obj.cutRegionStartObj.viewer.getChromosomeBands();
			
			if( obj.cutRegionStartObj.x1 > obj.cutRegionEndObj.x2 ) {
				alert("cutStart must be less than cutEnd position");
				return;
			}
			
			var bandStart = chromosomeBands[ obj.cutRegionStartObj.index ];
			var bandEnd = chromosomeBands[ obj.cutRegionEndObj.index ];

			var binStart = parseInt(bandStart.scale( obj.cutRegionStartObj.x1 ));
			var binEnd = parseInt(bandEnd.scale( obj.cutRegionEndObj.x2 ));

			var bin1 = {chrom:bandStart.chrom, bin:binStart, x:obj.cutRegionStartObj.x1, chrBandIdx:obj.cutRegionStartObj.index};
			var bin2 = {chrom:bandEnd.chrom, bin:binEnd, x:obj.cutRegionEndObj.x2, chrBandIdx:obj.cutRegionEndObj.index};
			var tarBin = null;
			
			var viewer = obj.cutRegionStartObj.viewer;
			
			var svType = "CUT";

			if(typeof(webworker) == "undefined") {
			    const worker = new Worker("resources/js/cancerhic/worker/procSvDataTypeWorker.js");

			   	worker.postMessage( [ viewer.config, bin1, bin2, tarBin, svType, (bin2.bin-bin1.bin+1)] );
			    worker.addEventListener('message', function(e) {
			    	console.log('Worker said: ', e.data[1]);

			    	viewer.config = e.data[0];

					// 바꾸거나 추가해야 할것 리스트
					// this.config.chromOrder {'chr6-1', 'chr7-1'}
					// this.config.data.genomeSize {'chr6-0':34, 'chr7-1':34}
			    	viewer.drawRate = (viewer.resolution - (2*viewer.margin)) / ( viewer.config.data[ viewer.samples[0] ].nRow * Math.sqrt(2) );

			    	viewer.reInitChromosomeBands( svType, bin1, bin2, tarBin );
			    	viewer.drawChrBands(false, -1, -1);

//			    	viewer.reInitRuller( svType, bin1, bin2, tarBin );
			    	viewer.drawRuller();

			    	viewer.drawContactMap();

			    	viewer.drawSuperEnhancer();
			    	viewer.drawGencodeGenes();
			    	viewer.drawRefseqGenes();

			    	if( obj.cutRegionStartObj.viewer instanceof PrecalledCancerHiC ) {
			    		if( obj.prevSvItem !== undefined && obj.prevSvItem !== null ) {
				    		obj.prevSvItem.bin1.bin -= bin1.bin;
				    		obj.prevSvItem.bin2.bin -= bin1.bin;
				    		if( obj.prevSvItem.tarPos !== undefined && obj.prevSvItem.tarPos ) obj.prevSvItem.tarPos.bin -= bin1.bin; 
	
				    		viewer.drawSv( obj.prevSvItem.bin1, obj.prevSvItem.bin2, obj.prevSvItem.tarPos, obj.prevSvItem.svtype );
			    		}
			    	}else if( obj.cutRegionStartObj.viewer instanceof UserDefineCancerHiC ) {
			    		if( viewer.undoStack.length > 0 ) {
				    		var prevSvItem = viewer.undoStack[ viewer.undoStack.length - 1 ];
	
				    		prevSvItem.bin1.bin -= bin1.bin;
				    		prevSvItem.bin2.bin -= bin1.bin;
				    		if( prevSvItem.tarPos !== undefined && prevSvItem.tarPos ) prevSvItem.tarPos.bin -= bin1.bin; 

				    		viewer.drawSv( prevSvItem.bin1, prevSvItem.bin2, prevSvItem.tarPos, prevSvItem.svType );
			    		}
			    	}

			    	worker.terminate();
		    	}, false);
			}
			
			
/*
			var filters = obj.getFilterSettings();
			var regions = [];

			//var chromosomeBands = obj.originDataViewer.chromosomeBands;
			var chromosomeBands = obj.getChromosomeBands();

			if( $("#which_tab_cut_dialog").val() === '3' && $("#which_panel_cut_dialog").val() === 'cancerHiCcanvas' )				chromosomeBands = obj.viewer.chromosomeBands;
			else if( $("#which_tab_cut_dialog").val() === '3' && $("#which_panel_cut_dialog").val() === 'cancerHiCoriginCanvas' )	chromosomeBands = obj.originDataViewer.chromosomeBands;

			var flag = false;
			if( chromosomeBands.length > 1) {
				if( obj.cutRegionStartObj.index !== obj.cutRegionEndObj.index ) {
					for( var i=obj.cutRegionStartObj.index; i<=obj.cutRegionEndObj.index; i++) {
						var band = chromosomeBands[i];

						if( i === obj.cutRegionStartObj.index ) {
							if( band.chrom == obj.cutRegionStartObj.chrom && band.chromStart <= obj.cutRegionStartObj.genomicCoordinate && obj.cutRegionEndObj.genomicCoordinate <= band.chromEnd ){
								var region = band.chrom + ":" + obj.cutRegionStartObj.genomicCoordinate + "-" + band.chromEnd;
								regions.push( region );
							}
						}else if( i > obj.cutRegionStartObj.index && i < obj.cutRegionEndObj.index ) {
							var region  = band.chrom + ":" + band.chromStart + "-" + band.chromEnd;
							regions.push( region );
						}else if( i === obj.cutRegionEndObj.index ) {
							if( band.chrom == obj.cutRegionEndObj.chrom && band.chromStart <= obj.cutRegionEndObj.genomicCoordinate && obj.cutRegionEndObj.genomicCoordinate <= band.chromEnd ){
								var region = band.chrom + ":" + band.chromStart + "-" + obj.cutRegionEndObj.genomicCoordinate;
								regions.push( region );
							}
						}
					}
				}else {
					var band = chromosomeBands[ obj.cutRegionStartObj.index ];
					var region = band.chrom + ":" + obj.cutRegionStartObj.genomicCoordinate + "-" + obj.cutRegionEndObj.genomicCoordinate;
					regions.push( region );
				}
			}else if( chromosomeBands.length === 1 ) {
				var region = obj.cutRegionStartObj.chrom + ":" + obj.cutRegionStartObj.genomicCoordinate + "-" + obj.cutRegionEndObj.genomicCoordinate;
				regions.push(region);
			}
			console.log( obj.cutRegionStartObj );
			console.log( obj.cutRegionEndObj );
			console.log( regions );

			filters.regions = JSON.stringify(regions);
			obj.loadingData( filters );
*/

			var dialog = $(".cut-controller-panel");
            dialog.addClass('d-none');
		});
		
		$(".cutStartMinus").mousedown(function(){
			int00 = setInterval(function() {
				obj.doChangeMinusButton( obj.cutRegionStartObj, obj.cutRegionEndObj, 1 );
			}
			, 50);
		}).mouseup(function() {
			clearInterval(int00);
		});
		
		$(".cutStartPlus").mousedown(function(){
			int00 = setInterval(function() {
				obj.doChangePlusButton( obj.cutRegionStartObj, obj.cutRegionEndObj, 1 );
			}
			, 50);
		}).mouseup(function() {
			clearInterval(int00);
		});

		$(".cutEndMinus").mousedown(function(){
			int00 = setInterval(function() {
				 obj.doChangeMinusButton( obj.cutRegionEndObj, obj.cutRegionStartObj, 2 );
			}
			, 50);
		}).mouseup(function() {
			clearInterval(int00);
		});
		
		$(".cutEndPlus").mousedown(function(){
			int00 = setInterval(function() {
				obj.doChangePlusButton( obj.cutRegionEndObj, obj.cutRegionStartObj, 2 );
			}
			, 50);
		}).mouseup(function() {
			clearInterval(int00);
		});
		
		$(".cutStartSet").click(function(){
			var query = $("#cutStart").val();

			var msgRetObj = CancerViewerController.isCorrectCutPosition(query);

			if( msgRetObj.msg_code === '000' ) {
				var divs = query.split(":");

				var chrom = divs[0];
				var pos = parseInt(divs[1].replace(/,/gi, ""));

				var newIndex = -1;
				for( var i = obj.cutRegionStartObj.index; i<=obj.cutRegionEndObj.index; i++ ) {
					var chrBand = obj.cutRegionStartObj.viewer.chromosomeBands[i];
					if( chrBand.chrom === chrom && chrBand.chromStart <= pos && chrBand.chromEnd >= pos ) {
						newIndex = i;

						break;
					}
				}

				if( newIndex !== -1 ) {
					var chrBand = obj.cutRegionStartObj.viewer.chromosomeBands[newIndex];
					var mx = chrBand.genomicScale(pos);
	
					if( mx <= obj.cutRegionEndObj.x2 ){
						obj.cutRegionStartObj = {chrom:chrBand.chrom, x1:mx, x2:-1, index:newIndex, genomicCoordinate:pos, viewer:obj.cutRegionStartObj.viewer};
	
						obj.cutRegionStartObj.viewer.drawRuller();
						obj.cutRegionStartObj.viewer._drawCutArea();
					}else {
						alert("chrStart position is must less than chrEnd");
					}
				}else {
					alert("Sorry, there is not matched region");
				}
			}else {
				alert( msgRetObj.msg_text );
			}
		});

		$(".cutEndSet").click(function(){
			var query = $("#cutEnd").val();

			var msgRetObj = CancerViewerController.isCorrectCutPosition(query);

			if( msgRetObj.msg_code === '000' ) {
				var divs = query.split(":");

				var chrom = divs[0];
				var pos = parseInt(divs[1].replace(/,/gi, ""));
				
				var newIndex = -1;
				for( var i = obj.cutRegionStartObj.index; i<=obj.cutRegionEndObj.index; i++ ) {
					var chrBand = obj.cutRegionStartObj.viewer.chromosomeBands[i];
					if( chrBand.chrom === chrom && chrBand.chromStart <= pos && chrBand.chromEnd >= pos ) {
						newIndex = i;

						break;
					}
				}
				
				if( newIndex !== -1 ) {
					var chrBand = obj.cutRegionEndObj.viewer.chromosomeBands[newIndex];
					var mx = chrBand.genomicScale(pos);
					
					if( mx >= obj.cutRegionStartObj.x1 ) {
						obj.cutRegionEndObj = {chrom:chrBand.chrom, x1:-1, x2:mx, index:newIndex, genomicCoordinate:pos, viewer:obj.cutRegionEndObj.viewer};
						
						obj.cutRegionEndObj.viewer.drawRuller();
						obj.cutRegionEndObj.viewer._drawCutArea();
					}else {
						alert("chrEnd position is must grater than chrStart");
					}
				}else {
					alert("Sorry, there is not matched region");
				}
			}else {
				alert( msgRetObj.msg_text );
			}
		});
		
		///////////////////////////////////////////////////////////////////
		
		$('#simpleManualBtn').click(function (e) {
			e.preventDefault();
			
			localStorage.clear();

			if( $(this).hasClass('collapsed') ) {
				$(this).children().addClass('fa-caret-square-o-up');
				$(this).children().removeClass('fa-caret-square-o-down');
				
				localStorage.setItem("simpleManual", "down");
			} else {
				$(this).children().addClass('fa-caret-square-o-down');
				$(this).children().removeClass('fa-caret-square-o-up');
				
				localStorage.setItem("simpleManual", "up");
			}
		});
	}
	
	doChangeMinusButton( target, alternate, type ){
		if( target !== undefined ) {
			var strVal = $("#cutStart").val();
			if( type === 2 ) strVal = $("#cutEnd").val();

			var divs = strVal.split(":");
			var chrom = divs[0];
			var pos = parseInt( divs[1].replace(/,/gi, "") );

			var cutDiffOffsetRadio = $('input[name=cutGapOptions]');
			var diff = parseInt(cutDiffOffsetRadio.filter(':checked').val());

			pos -= diff;

			if( pos < target.viewer.chromosomeBands[ target.index ].chromStart ) {
				if( target.index > 0 ) {
					var newIndex = target.index - 1;
					var chromBand = target.viewer.chromosomeBands[ newIndex ];

					var mx = chromBand.genomicScale(chromBand.chromEnd);
					var gPos1 = chromBand.chromEnd;

					if( type === 1 ) {
//						if( mx >= alternate.x2 )	return;

						target = {chrom:chromBand.chrom, x1:mx, x2:-1, index:newIndex, genomicCoordinate:gPos1, viewer:target.viewer};
						$("#cutStart").val( chromBand.chrom + ":" + numberWithCommas(gPos1) );
					}else {
						if( mx <= alternate.x1 )	return;
						
						target = {chrom:chromBand.chrom, x1:-1, x2:mx, index:newIndex, genomicCoordinate:gPos1, viewer:target.viewer};
						$("#cutEnd").val( chromBand.chrom + ":" + numberWithCommas(gPos1) );
					} 
				}
			}else {
				var chromBand = target.viewer.chromosomeBands[ target.index ];

				var mx = chromBand.genomicScale(pos);

				if( type === 1 ) {
//					if( mx >= alternate.x2 )	return;
					
					target.x1 = mx;
					target.genomicCoordinate = pos;
					
					$("#cutStart").val( chrom + ":" + numberWithCommas(pos) );
				}else {
					if( mx <= alternate.x1 )	return;

					target.x2 = mx;
					target.genomicCoordinate = pos;
					
					$("#cutEnd").val( chrom + ":" + numberWithCommas(pos) );
				}
			}
			
			target.viewer.drawRuller();
			target.viewer._drawCutArea();
		}
	}
	
	resetCutDialogSettings() {
		var obj = this;

		if( obj.cutRegionStartObj !== undefined )	delete obj.cutRegionStartObj;
		if( obj.cutRegionEndObj !== undefined )		delete obj.cutRegionEndObj
		if( obj.cutWhichHover !== undefined )		delete obj.cutWhichHover;
		
		if( obj.viewer !== undefined && obj.viewer != null )						obj.viewer.drawRuller();
		if( obj.originDataViewer !== undefined && obj.originDataViewer != null )	obj.originDataViewer.drawRuller();
		if( obj.normalDataViewer !== undefined && obj.normalDataViewer != null )	obj.normalDataViewer.drawRuller ();
		
		var dialog = $(".cut-controller-panel");
        dialog.addClass('d-none');
	}

	doChangePlusButton( target, alternate, type ) {
		if( target !== undefined ) {
			var strVal = $("#cutStart").val();
			if( type === 2 ) strVal = $("#cutEnd").val();

			var divs = strVal.split(":");
			var chrom = divs[0];
			var pos = parseInt( divs[1].replace(/,/gi, "") );

			var cutDiffOffsetRadio = $('input[name=cutGapOptions]');
			var diff = parseInt(cutDiffOffsetRadio.filter(':checked').val());
			
			pos += diff;
			
			if( pos > target.viewer.chromosomeBands[ target.index ].chromEnd ) {
				if( target.index + 1 < target.viewer.chromosomeBands.length ) {
					var newIndex = target.index + 1;
					var chromBand = target.viewer.chromosomeBands[ newIndex ];

					var mx = chromBand.genomicScale(chromBand.chromStart);
					var gPos1 = chromBand.chromStart;
					
					if( type === 1 ) {
						if( mx >= alternate.x2 )
							return;
						
						// target = objCutStartObj
						// alternative = objCutEndObj
						target = {chrom:chromBand.chrom, x1:mx, x2:-1, index:newIndex, genomicCoordinate:gPos1, viewer:target.viewer};
						
						$("#cutStart").val( chromBand.chrom + ":" + numberWithCommas(gPos1) );
					}else {
//						if( mx >= target.x1 )
//							return;
						target = {chrom:chromBand.chrom, x1:-1, x2:mx, index:newIndex, genomicCoordinate:gPos1, viewer:target.viewer};
	
						$("#cutEnd").val( chromBand.chrom + ":" + numberWithCommas(gPos1) );
					} 
				}
			}else {
				var chromBand = target.viewer.chromosomeBands[ target.index ];
				var mx = chromBand.genomicScale(pos);

				if( type === 1 ) {
					// target = objCutStartObj
					// alternative = objCutEndObj

					if( mx >= alternate.x2 )
						return;

					target.x1 = mx;
					target.genomicCoordinate = pos;
					
					$("#cutStart").val( chrom + ":" + numberWithCommas(pos) );
				}else {
//					if( mx >= target.x1 )
//						return;
					
					target.x2 = mx;
					target.genomicCoordinate = pos;
					
					$("#cutEnd").val( chrom + ":" + numberWithCommas(pos) );
				}
			}
			
			target.viewer.drawRuller();
			target.viewer._drawCutArea();
		}		
	}

	isSupportingWebWorker() {
		if( (typeof(Worker) === "undefined" ) ) {
			alert("Sorry! Your web browser can not displaying our data. <br>You should to use the Web browser which is supporting WebWorker functions such as current version of Chorme, Safari, Firefox and Edge");

		    // web worker를 지원하지 않는 브라우저를 위한 안내 부분
			console.log("Can not do worker");
			return false;
		}
		console.log("Can do worker");
		return true;
	}

	static isCorrectCutPosition( query ) {
		var chrCode = ["chr1", "chr2", "chr3", "chr4", "chr5", "chr6", "chr7", "chr8", "chr9", "chr10", "chr11", "chr12", "chr13", "chr14", "chr15", "chr16", "chr17", "chr18", "chr19", "chr20", "chr21", "chr22", "chrX", "chrY"];

		if( query.indexOf(":") < 0 )								return {msg_text:"Error : Your query is not the input query format, Please check it again(':') : " + query, msg_code:'001' };
		else {
			var divs = query.split(":");
			
			if( divs.length != 2 )									return {msg_text:"Error : Your query is not the input query format, Please check it again(':') : " + query, msg_code:'001' };
			else {
				if( chrCode.indexOf(divs[0].toLowerCase()) < 0 )	return {msg_text:"Error : chromsome character must started with 'chr' chracters, Please check it again('-') : " + divs[0], msg_code:'002' };
				
				var strValue = divs[1].replace(/\,/gi, '');
				if( !$.isNumeric(strValue) )						return {msg_text:"Error : Position must be numeric value, Please check it again('-') : " + divs[1], msg_code:'004' };
			}
		}

		return {msg_text:"ok", msg_code:'000' };
	}
	
	static isCorrectQuery( query ) {
		var frags = query.split('\n');

		var fragmentFormat = [];
		for(var i=0; i<frags.length; i++) {
			var subFrags = frags[i].split(";");
			for(var j=0; j<subFrags.length; j++)	fragmentFormat.push( subFrags[j] );
		}

		var retObj = {};

		var params = [];
		for(var i=0; i<fragmentFormat.length; i++) {
			var str = fragmentFormat[i].replace(/\,/gi, '');
			if( str == '' ) continue;

			var divs = str.split(':');

			if( divs.length != 2 ) {
				retObj = {msg_text:"Error : Your text is not the input query format, Please check it again(':') : " + str, msg_code:'001' };
				return retObj;
			}else {
				var chrom = divs[0];
				var pos = divs[1].split('-');

				if( !( $.isNumeric(pos[0]) && $.isNumeric(pos[1])) ) {
					retObj = {msg_text:"Error : Position must be numeric value, Please check it again('-') : " + divs[1], msg_code:'004' };
					return retObj;
				}
				if( !chrom.toUpperCase().startsWith("CHR") ) {
					retObj = {msg_text:"Error : chromsome character must started with 'chr' chracters, Please check it again('-') : " + chrom, msg_code:'002' };
					return retObj;
				}else if( pos.length != 2 ) {
					retObj = {msg_text:"Error : Your text is not the BED format, Please check it again('-') : " + str, msg_code:'002' };
					return retObj;
				}
				params.push( {chrom:chrom, chromStart:parseInt(pos[0]), chromEnd:parseInt(pos[1])} );
			}
		}
//		if( params.length > 0 ) retObj = {msg_text:'ok', data:JSON.stringify(params), msg_code:'000'};
		if( params.length > 0 ) retObj = {msg_text:'ok', data:params, msg_code:'000'};
		else					retObj = {msg_text:"Warning : There is no query", data:JSON.stringify(params), msg_code:'003'};

		return retObj;
	}

	loadingData( filters ) {
		if( this.viewer != null )				this.viewer.loadingData( filters );
		if( this.originDataViewer != null )		this.originDataViewer.loadingData( filters );
		if( this.normalDataViewer != null )		this.normalDataViewer.loadingData (filters );
	}

	redrawRawSv( bin1, bin2, tarPos, svType, objects ) {
		var nBin1 = JSON.parse(JSON.stringify(bin1));
		var nBin2 = JSON.parse(JSON.stringify(bin2));
		var nTarBin = tarPos !== undefined && tarPos !== null ? JSON.parse(JSON.stringify(tarPos)) : null;

		if( this.originDataViewer !== undefined ) {
			if( objects.b1p !== null  )						nBin1.bin = objects.b1p.rawIrow;
			else											nBin1.bin = 0;

			var sample = Object.keys(this.originDataViewer.config.data);
			if( objects.b2p !== null  )						nBin2.bin = objects.b2p.rawIrow;
			else											nBin2.bin = this.originDataViewer.config.data[ sample[0] ].nRow;
			
			if( nTarBin !== null ) {
				if( objects.trp !== null  )						nTarBin.bin = objects.trp.rawIrow;
				else											nTarBin.bin = 0;
			}

			this.originDataViewer.drawSv( nBin1, nBin2, nTarBin, svType );
		}
	}

	redrawNormalSv( bin1, bin2, tarPos, svType, objects ) {
		var obj = this;
		
		var nBin1 = JSON.parse(JSON.stringify(bin1));
		var nBin2 = JSON.parse(JSON.stringify(bin2));
		var nTarBin = tarPos !== undefined && tarPos !== null ? JSON.parse(JSON.stringify(tarPos)) : null;

		if( this.normalDataViewer !== undefined ) {
			if( objects.b1p !== null  )						nBin1.bin = objects.b1p.rawIrow;
			else											nBin1.bin = 0;

			var sample = Object.keys(this.normalDataViewer.config.data);
			if( objects.b2p !== null  )						nBin2.bin = objects.b2p.rawIrow;
			else											nBin2.bin = this.normalDataViewer.config.data[ sample[0] ].nRow;
			
			if( nTarBin !== null ) {
				if( objects.trp !== null  )						nTarBin.bin = objects.trp.rawIrow;
				else											nTarBin.bin = 0;
			}

			this.normalDataViewer.drawSv( nBin1, nBin2, nTarBin, svType );
		}
	}
	
	recoveryGenomicVariations( bin1, bin2, tarPos, svType ) {
		// DUP의 경우는 Raw 및 Pre-sv 모두 변화 없이 위치만 그려준다
		if( svType !== 'DUP' )	this.viewer.recoveryGenomicVariations( bin1, bin2, tarPos, svType );
		else					this.viewer.drawSv( bin1, bin2, tarPos, svType );
	}
	
	doGenomicVariations( bin1, bin2, tarPos, svType, isApplingAll ) {
		if( isApplingAll ) {
			this.viewer.doGenomicVariations( bin1, bin2, tarPos, svType );
//			this.viewer.drawSv( bin1, bin2, tarPos, svType );
		}else {
			if( svType !== 'DUP' && svType !== 'TRA' && svType !== 'INVDUP' )	this.viewer.doGenomicVariations( bin1, bin2, tarPos, svType );
			else												 				this.viewer.drawSv( bin1, bin2, tarPos, svType );
		}
	}
	
	doGenomicVariationsInPredefined( bin1, bin2, tarPos, svType, isApplingAll ) {
		this.viewer.drawSv( bin1, bin2, tarPos, svType );
		this.originDataViewer.drawSv( bin1, bin2, tarPos, svType );
		this.normalDataViewer.drawSv( bin1, bin2, tarPos, svType );
	}

	doSerialUndoOrRedoInWorker( works ) {
		this.viewer.serialWorks( works );
	}

	getChromosomeBands(){
		return this.viewer.chromosomeBands;
	}

	init2RawData() {
		if( this.viewer != null && this.originDataViewer != null ) {
			this.viewer.chromosomeBands = jsonCopy(this.originDataViewer.chromosomeBands);
			var nConfig = jsonCopy(this.originDataViewer.config);
			this.viewer.drawRate = this.originDataViewer.drawRate;
			this.viewer.hasSelectedRegion = this.originDataViewer.hasSelectedRegion;
			this.viewer.isOff = this.originDataViewer.isOff;

			nConfig.layerContainer = this.viewer.config.layerContainer;
			nConfig.container = this.viewer.config.container;
			nConfig.chrContainer = this.viewer.config.chrContainer;
			nConfig.rullerContainer = this.viewer.config.rullerContainer;
//			nConfig.colorscale = this.viewer.config.colorscale;
//			nConfig.colorScaleValues = this.viewer.colorScaleValues;

//			if( this.viewer.layerContainer !== undefined )			nConfig.layerContainer			= this.viewer.layerContainer;
//			if( this.viewer.superEnhancerContainer !== undefined )	nConfig.superEnhancerContainer	= this.viewer.superEnhancerContainer;
//			if( this.viewer.gencodeGenesCanvas !== undefined )		nConfig.gencodeGenesCanvas		= this.viewer.gencodeGenesCanvas;
//			if( this.viewer.refseqGenesCanvas !== undefined )		nConfig.refseqGenesCanvas		= this.viewer.refseqGenesCanvas;

			nConfig.isRaw = false;

			if( this.viewer.redoStack !== undefined ) {
				this.viewer.redoStack = [];
				$(".btnRedo").addClass("disabled");
			}
			if( this.viewer.undoStack !== undefined ) {
				this.viewer.undoStack = [];
				$(".btnUndo").addClass("disabled");
			}

			this.viewer.config = nConfig;

			this.originDataViewer.draw();
			this.viewer.draw();

			console.log("initialization");
		}
	}
	redrawContactMap(){
		if( this.viewer !== undefined )				this.viewer.drawContactMap();
		if( this.originDataViewer !== undefined )	this.originDataViewer.drawContactMap();
		if( this.normalDataViewer !== undefined )	this.normalDataViewer.drawContactMap();
	}
	getFilterSettings() {
		var samples = JSON.parse($("#json_samples").val());
		var regions = JSON.parse($("#json_regions").val());
		var resolution = $("#resolution").val();
		var type = $("#type");
		var colorPalette = $("#color_palette").val();
		
		var chromOrder = getChromosomeOrder( regions );
		
		var optionGene = JSON.parse($("#json_option_gene").val());

		var filters = {
				samples: JSON.stringify(samples)
				, regions: JSON.stringify(regions)
				, chromOrder: chromOrder
				, colorPalette: colorPalette
				, optionGene : JSON.stringify(optionGene)
		};
		
		return filters;
	}
	initHg38ChromosomeMap(){
		var obj = this;

		$.ajax({
			type : 'post'
			,url : 'getHg38GenomeInfo'
			,async:false
			,success: function( result ) {
				obj.chromosomeMap = JSON.parse(result);
			}
		});
	}
	callbackAllPanelDone(){
		this.donePanelCnt += 1;
		
		if( this.donePanelCnt === 3 ) {
			console.log("Complete");
			this.donePanelCnt = 0;

			if( this instanceof PrecalledSvViewerController ) {
				this.viewer.displaySv( true );
				if( this.prevSvItem !== null ){
					this.originDataViewer.drawSv( this.prevSvItem.bin1, this.prevSvItem.bin2, this.prevSvItem.tarPos, this.prevSvItem.svtype );
					this.normalDataViewer.drawSv( this.prevSvItem.bin1, this.prevSvItem.bin2, this.prevSvItem.tarPos, this.prevSvItem.svtype );
				}
			}else if( this instanceof UserDefineDynamicSvViewerController ) {
				// this.viewer.displaySv( true );
			}else {
			}
		}
	}
}

class PrecalledSvViewerController extends CancerViewerController{
	constructor(params){
		super(params);

		this.prevSvItem = null;
		this.tmpPreSvCompListCnt = 0;

		if( this.isSupportingWebWorker() ) {
			this.isSupportBrowser = true;

			if( params.extra_tracks !== undefined ) {
				originParams.extra_tracks = params.extra_tracks;
				normalParams.extra_tracks = params.extra_tracks;
			}
			
			this.viewer				= new PrecalledCancerHiC( params );			// rearranged tumor contact map
			this.originDataViewer	= new PrecalledCancerHiC( originParams );	// tumor contact map
			this.normalDataViewer	= new PrecalledCancerHiC( normalParams );

			this.viewer.addController( this );
			this.originDataViewer.addController( this );
			this.normalDataViewer.addController( this );
		}
	}
	loadingData( filters ) {
		var samples = JSON.parse( filters.samples );
		var cancer_samples = [];
		var normal_samples = [];
		for(var i=0; i<samples.length; i++) {
			cancer_samples.push( {sample: samples[i].sample1, table: samples[i].table1, region:samples[i].region} );
			normal_samples.push( {sample: samples[i].sample2, table: samples[i].table2, region:samples[i].region} );
		}
		
		filters.samples = JSON.stringify(cancer_samples);
		filters.url = "getContactMapDataFromBedFormats";
		if( this.viewer != null ) {
			this.viewer.loadingData( filters );
		}
		if( this.originDataViewer != null ) {
			this.originDataViewer.loadingData( filters );
		}
		if( this.normalDataViewer != null ) {
			filters.samples = JSON.stringify(normal_samples);
			filters.url = "getContactMapDataFromBedFormats";

			this.normalDataViewer.loadingData (filters );
		}
	}
/*	doGenomicVariations( bin1, bin2, tarPos, svType, isApplingAll ) {
		super.doGenomicVariations( bin1, bin2, tarPos, svType, isApplingAll );

		if( this.normalDataViewer !== undefined ) {
			this.normalDataViewer.drawSv( bin1, bin2, tarPos, svType );
		}
	}*/
	doGenomicVariations( bin1, bin2, tarPos, svType, isApplingAll ) {
		if( svType !== 'DUP' && svType !== 'TRA' && svType !== 'INVDUP' )	this.viewer.doGenomicVariations( bin1, bin2, tarPos, svType );
		else												 				{
			this.viewer.drawSv( bin1, bin2, tarPos, svType );
		}
	}
	init2RawData() {
		super.init2RawData();

		if( this.normalDataViewer != null ) {
			this.normalDataViewer.draw();

			console.log("initialization");
		}
	}
	reloadPrecalledSVList(){
		 this.svTable.clear().destroy();

		 this.loadPrecalledSVList();
	}
	loadPrecalledSVList(){
		console.log("Datatables reload");

		var samples = JSON.parse($("#json_samples").val());
		var regions = this.viewer.config.userRegions;
		if( regions === undefined ) {
			regions = JSON.parse($("#json_regions").val());
		}

		var samplesParam = [];
		for( var i=0; i<samples.length; i++ ){
			samplesParam.push( { sample: samples[i].sample1, table: samples[i].table1 } );
			samplesParam.push( { sample: samples[i].sample2, table: samples[i].table2 } );
		}

		this.svTable = $("#precalled_sv_table").DataTable({
			"processing": true,
			"serverSide": false,
			"ajax": {
				type     : "POST",
				cache    : false,
				dataType : 'json',
				url      : "getPrefoundedSV",
				data     : {samples:JSON.stringify(samplesParam), regions:JSON.stringify(regions)},
//				dataSrc:function(data){
//					return data;
//				}
			},
			"bSort" : false,
			"columns": [
		            { "data": "sample" },
		            { "data": "src_chrom" },
		            { "data": "src_chrom_start" },
		            { "data": "tar_chrom" },
		            { "data": "tar_chrom_start" },
		            { "data": "sv_type" },
//		            { "data": "cluter" },
		            { "data": "orientation" }
		        ]
		});

		return this.svTable;
	}
	displaySvFeature( data ) {
		this.prevSvItem = this.innerProcDisplaySvFeature( data );

		if( this.prevSvItem !== undefined && this.prevSvItem !== null ) {
			if( data.sv_type === 'DEL' || data.sv_type === 'INV' )	this.doGenomicVariations( this.prevSvItem.bin1, this.prevSvItem.bin2, this.prevSvItem.bin1, data.sv_type, false );
			else													this.doGenomicVariationsInPredefined( this.prevSvItem.bin1, this.prevSvItem.bin2, this.prevSvItem.bin2, data.sv_type, false );
		}
	}
	innerProcDisplaySvFeature( data ){
		var bin1 = null;
		var bin2 = null;
		if( data.sv_type === 'DEL' || data.sv_type === 'INV' || data.sv_type === 'DUP' || data.sv_type === 'TRA' ) {
			var chromosomeBands = this.getChromosomeBands();

			for(var i=0; i<chromosomeBands.length; i++) {
				if( data.src_chrom === chromosomeBands[i].chrom && chromosomeBands[i].chromStart <= parseInt(data.src_chrom_start) && chromosomeBands[i].chromEnd >= parseInt(data.src_chrom_start) ) {
					var hitObj = chromosomeBands[i];
					var xPos = hitObj.genomicScale( parseInt(data.src_chrom_start) );
					var bin = parseInt(hitObj.scale(xPos));

					var diff = 0;

					bin1 = { chr:hitObj.chrom, bin:bin - diff, x:xPos, chromPos:data.src_chrom_start, chromIdx:i };
				}

				if( data.tar_chrom === chromosomeBands[i].chrom && chromosomeBands[i].chromStart <= parseInt(data.tar_chrom_start) && chromosomeBands[i].chromEnd >= parseInt(data.tar_chrom_start) ) {
					var hitObj = chromosomeBands[i];

					var xPos = hitObj.genomicScale( parseInt(data.tar_chrom_start) );
					var bin = parseInt(hitObj.scale(xPos));

					var diff = 0;

					bin2 = { chr:hitObj.chrom, bin:bin - diff, x:xPos, chromPos:data.tar_chrom_start, chromIdx:i };
				}
			}

			if( bin1 != null && bin2 != null ){
				if( bin1.bin > bin2.bin ) {
					var tmp = jsonCopy(bin1);
					bin1 = bin2;
					bin2 = tmp;
				}

				var prevSvItem = { bin1:bin1, bin2:bin2, svtype:data.sv_type };
				
				return prevSvItem;
			}
		}
		
		return null;
	}
	callbackAutoPredefinedSvDisplay(){
		this.tmpPreSvCompListCnt += 1;
		
		if( this.tmpPreSvCompListCnt === 3 ) {
			var data = JSON.parse($("#chosen_sv_type").val());

			this.displaySvFeature( data );

			this.tmpPreSvCompListCnt = 0;
			$("#chosen_sv_type").val('');

			console.log("Complete");
		}
	}
}

class UserDefineDynamicSvViewerController extends CancerViewerController{
	constructor(params){
		super(params);

		if( this.isSupportingWebWorker() ) {
			this.isSupportBrowser = true;
			
			if( params.extra_tracks !== undefined ) {
				originParams.extra_tracks = params.extra_tracks;
			}
			
			this.viewer				= new UserDefineCancerHiC( params );
			this.originDataViewer	= new UserDefineCancerHiC( originParams );

			this.viewer.addController( this );
			this.originDataViewer.addController( this );
		}
	}
	init2RawData() {
		super.init2RawData();
		
		this.viewer.initMouse();
	}
	init2RawDataWitoutInitStacks() {
		if( this.viewer != null && this.originDataViewer != null ) {
			this.viewer.chromosomeBands = jsonCopy(this.originDataViewer.chromosomeBands);

			var nConfig = jsonCopy(this.originDataViewer.config);
			this.viewer.drawRate = this.originDataViewer.drawRate;
			this.viewer.hasSelectedRegion = this.originDataViewer.hasSelectedRegion;
			this.viewer.isOff = this.originDataViewer.isOff;

			nConfig.layerContainer = this.viewer.config.layerContainer;
			nConfig.container = this.viewer.config.container;
			nConfig.chrContainer = this.viewer.config.chrContainer;
			nConfig.rullerContainer = this.viewer.config.rullerContainer;
//			nConfig.colorscale = this.viewer.config.colorscale;
//
//			if( this.viewer.layerContainer !== undefined )			nConfig.layerContainer			= this.viewer.layerContainer;
//			if( this.viewer.superEnhancerContainer !== undefined )	nConfig.superEnhancerContainer	= this.viewer.superEnhancerContainer;
//			if( this.viewer.gencodeGenesCanvas !== undefined )		nConfig.gencodeGenesCanvas		= this.viewer.gencodeGenesCanvas;
//			if( this.viewer.refseqGenesCanvas !== undefined )		nConfig.refseqGenesCanvas		= this.viewer.refseqGenesCanvas;

			nConfig.isRaw = false;
			
			this.viewer.config = nConfig;

			this.originDataViewer.draw();
			this.viewer.draw();

			console.log("initialization");
		}
	}
	doUndo(){
		if( this.viewer.undoStack !== undefined ) {
			this.init2RawDataWitoutInitStacks();

			var undoAction = this.viewer.popUndo();
			this.viewer.addRedo( undoAction );

//			console.log( "current", this.viewer.undoStack.length );

			this.doSerialUndoOrRedoInWorker( this.viewer.undoStack );
		}
	}
	doRedo() {
		if( this.viewer.redoStack !== undefined ) {
			this.init2RawDataWitoutInitStacks();

			var redoAction = this.viewer.popRedo();
			this.viewer.addUndo( redoAction );
			
			this.doSerialUndoOrRedoInWorker( this.viewer.undoStack );
		}
		return 0;
	}
	resized() {
		if( this.viewer !== undefined && this.viewer !== null ) {
			this.viewer.refreshInit();
			this.viewer.init( this.viewer.config );
			this.viewer.draw();
		}

		if( this.originDataViewer !== undefined && this.originDataViewer !== null ) {
			this.originDataViewer.refreshInit();
			this.originDataViewer.init( this.originDataViewer.config );
			this.originDataViewer.draw();
		}
	}
	resetRedoUndoButton(){
		$(".btnUndo").addClass("disabled");
		$(".btnRedo").addClass("disabled");
	}
}

class RearrangeGenomeViewerController extends CancerViewerController{
	constructor(params){
		super(params);

		if( this.isSupportingWebWorker() ) {
			this.isSupportBrowser = true;
			
			if( params.extra_tracks !== undefined ) {
				originParams.extra_tracks = params.extra_tracks;
			}
			
			params.weightScoreSliderContainer = "weightScoreRangeSlider";
			params.weightScoreLegendMin = "weightScoreLegendMin";
			params.weightScoreLegendMiddle = "weightScoreLegendMiddle";
			params.weightScoreLegendMax = "weightScoreLegendMax";

			this.viewer = new RearrangeGenomeCancerHiC( params );

			this.originDataViewer = new RearrangeGenomeCancerHiC( originParams );

			this.viewer.addController( this );
			this.originDataViewer.addController( this );
		}
	}
	loadingData( filters ) {
		var obj = this;
		var regions = JSON.parse( filters.regions );
		var samples = JSON.parse( filters.samples );

		// chr17:42312-13123;chr18:3434-342342;chr17:3234-4342 
		// 이런경우 chr17:1-xxxx;chr18:1-xxxx 이렇게 변경하기 위함
		var newChromOrder = [];
		var chromosomeRegions = [];
		var newSamples = [];
		var idx = 0;
		for(var i=0; i<regions.length; i++) {
			var chrom = regions[i].split(":")[0];
			var pos = regions[i].split(":")[1].split("-");

/***
 * 20200923 Modified by insoo078
 * 
 * 
 * var region = chrom + ":1-" + this.chromosomeMap[chrom].length 
 */
			var region = chrom + ":1-" + this.chromosomeMap[chrom].length;
			if( chromosomeRegions.indexOf(region) < 0 ) {
				chromosomeRegions.push( region );
				newSamples.push( samples[idx] );
				
				newChromOrder.push( chrom + "-" + idx );
				idx++;
			}
			
			
			if( parseInt(pos[0]) > parseInt(pos[1]) )	regions[i] = chrom + ":" + pos[1] + "-" + pos[0];

/************************************************************
 * 04 OCT 2020 Modified by insoo078
 *
			var region = regions[i];
			if( chromosomeRegions.indexOf(region) < 0 ) {
				chromosomeRegions.push( region );

				newSamples.push( samples[idx] );
				
				newChromOrder.push( chrom + "-" + idx );
				idx++;
			}
**************************************************************/
		}
		
		var oldRegions = filters.regions; 
		filters.regions = JSON.stringify( regions );
		filters.oldRegions = oldRegions;
		
//		console.log("regions", filters.regions );
//		console.log("oldRegions", filters.oldRegions );

		if( obj.viewer != null ) {
			obj.viewer.loadingData( filters );
		}
		if( obj.originDataViewer != null ) {
			var nFilters = jsonCopy(filters);
			nFilters.chromOrder = newChromOrder;
			nFilters.regions = JSON.stringify(chromosomeRegions.sort(function(a, b){
				var tmpA = a.replace('chrX:', 'chr23:').replace('chrY:', 'chr24:');
				var tmpB = b.replace('chrX:', 'chr23:').replace('chrY:', 'chr24:');
				tmpA = tmpA.replace("chr", "");
				tmpB = tmpB.replace("chr", "");

				var chr1 = tmpA.split(':')[0];
				var chromStart1 = tmpA.split(':')[1].split("-")[0];
				var chromEnd1 = tmpA.split(':')[1].split("-")[1];

				var chr2 = tmpB.split(':')[0];
				var chromStart2 = tmpB.split(':')[1].split("-")[0];
				var chromEnd2 = tmpA.split(':')[1].split("-")[1];
				
				if( parseInt(chr1) < parseInt(chr2) )					return -1;
				else if( parseInt(chr1) > parseInt(chr2) )				return 1;
				else {
					if( parseInt(chromStart1) < parseInt(chromStart2) )	return -1;
					else if( parseInt(chromStart1) == parseInt(chromStart2) )	{
						if( parseInt(chromEnd1) < parseInt(chromEnd2) ) return -1;
						return 1;
					}else{
						return 1;
					}
				}
			}));

			nFilters.samples = JSON.stringify(newSamples);

			obj.originDataViewer.loadingData( nFilters );
		}
	}
	doGenomicVariations( bin1, bin2, tarPos, svType, isApplingAll ) {
		super.doGenomicVariations( bin1, bin2, tarPos, svType, isApplingAll );

		if( this.originDataViewer !== undefined ) {
			this.originDataViewer.drawSv( bin1, bin2, tarPos, svType );
		}
	}
	init2RawData() {
		super.init2RawData();

		if( this.originDataViewer != null ) {
			this.originDataViewer.draw();

			console.log("initialization");
		}
	}
}