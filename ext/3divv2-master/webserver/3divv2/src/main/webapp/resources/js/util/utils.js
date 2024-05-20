function isEmpty(value) {
	return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function isNotEmpty(value) {
	return !(typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null);
}

function null2Empty(value) {
	if(value===null)				return '';
	else if( value === undefined )	return '';

	return value;
}

function testDecimals(currentVal) {
	var count;
	currentVal.match(/\./g) === null ? count = 0 : count = currentVal.match(/\./g);
	return count;
}

function replaceCommas(yourNumber) {
	var components = yourNumber.toString().split(".");
	if (components.length === 1)
		components[0] = yourNumber;
	components[0] = components[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	if (components.length === 2)
		components[1] = components[1].replace(/\D/g, "");
	return components.join(".");
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function comma(str) {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function getChromosomeOrder( regions ) {
	// 입력된 chromosome 순서 정하기
	var chromOrder = [];
	for(var i=0; i<regions.length; i++) {
		chromOrder.push( regions[i].split(":")[0] + "-" + i );
	}
	
	return chromOrder;
}

function genomeLength4Label(length) {
	var val = length;
	var type = "bases";
	if( length / 1000000000 > 1 )		{val = Number.parseFloat( Math.ceil(length / 1000000000) ).toFixed(0);	type = 'Gb';}
	else if( length / 1000000 > 1 )		{val = Number.parseFloat( Math.ceil(length / 1000000) ).toFixed(0);		type = 'Mb';}
	else if( length / 1000 > 1 )		{val = Number.parseFloat( Math.ceil(length / 1000) ).toFixed(0);			type = 'Kb';}

	return val + type;
}

function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}

function getSplittedRegion(region){
	var div = region.split(":");
	var chr = div[0];
	var pos = div[1].split("-");
	
	return {chrom:chr, chromStart:pos[0], chromEnd:pos[1]};
}

function getRegionObjectInList( regions, chr ) {
	console.log( regions );
	console.log( chr );
	for(var i=0; i<regions.length; i++) {
		var obj = getSplittedRegion( regions[i] );
		if( obj.chrom == chr ) {
			return obj;
		}
	}
	return null;
}

function getOverlap(x11, x12, x21, x22){
	var range1 = x12 - x11 + 1;
	var range2 = x22 - x21 + 1;
	
	var sumRange = range1 + range2;
	var diffMinMax = Math.max(x22, x12) - Math.min(x11, x21);
	
	var overlappedSize = sumRange - diffMinMax - 1;

//	console.log("===================================> " + (sumRange) + "  :   " + diffMinMax );
	
	return overlappedSize > 0?overlappedSize:0;
};

function getSvColour( svType ) {
	if( svType === 'INV' )			return 'rgba(0, 255, 0, 0.15)';
	else if( svType === 'TRA')		return 'rgba(135, 21, 255, 0.15)';
	else if( svType === 'DEL')		return 'rgba(0, 57, 201, 0.15)';
	
//	console.log( svType );
	
	return 'rgba(255, 0, 187, 0.15)';
}

function testLabel(){
	console.log("Hello ahahahahahahaha");
}

function setpixelated(context){
    context['imageSmoothingEnabled'] = false;       /* standard */
    context['mozImageSmoothingEnabled'] = false;    /* Firefox */
    context['oImageSmoothingEnabled'] = false;      /* Opera */
    context['webkitImageSmoothingEnabled'] = false; /* Safari */
    context['msImageSmoothingEnabled'] = false;     /* IE */
    
    return context;
}


function getTadFragments( string ) {
	var tadRegions = string.split("\n");
	
	var idx = 0;
	var tadMap = {};
	for(var i=0; i<tadRegions.length; i++){
		var segment = tadRegions[i].split(";");

//		tadMap[i] = [];
		for( var j=0; j<segment.length; j++) {
			if( !isEmpty( segment[j] ) ) {
//				tadMap[i].push( segment[j].split(":")[0] + "-" + idx );
				tadMap[segment[j].split(":")[0] + "-" + idx] = i;
				idx++;
			}
		}
	}
	return tadMap;
}

function detectBrowserType() { 
	if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ){
		return 1;
    }else if(navigator.userAgent.indexOf("Chrome") != -1 ){
    	return 2;
    }else if(navigator.userAgent.indexOf("Safari") != -1){
    	return 3;
    }else if(navigator.userAgent.indexOf("Firefox") != -1 ){
    	return 4;
    }else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
    	return 5; 
    }else{
    	return 0;
    }
}