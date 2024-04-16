//HicHistogram.prototype.arc_init = function() {
//	var obj = this;
//	
//	var arcDiv = $("#graph-frame-arc-" + obj.config.dataOrder);
//	
////	var top = obj.PADDING + 20;
//	var x = obj.PADDING + obj.LEFT_OFFSET;
////	var width = obj.WIDTH - (2*obj.PADDING) - obj.LEFT_OFFSET;
//	var height = obj.config.ARC_TRACK_HEIGHT;
////	var rectHeight = obj.config.LINE_CHART_HEIGHT - (2*obj.PADDING);
////	var bottom = (top + rectHeight + (Object.keys(obj.config.rawData.windowData).length  * obj.config.SMOOTHNING_LAYER_HEIGHT));
//	
//	var arcCanvas = d3.select("#graph-frame-arc-" + obj.config.dataOrder);
//	
//	arcCanvas.append("svg")
//	.attr("id", "arcCanvas-" + obj.config.dataOrder)
////	.attr("viewBox","100 0 " + arcDiv.width() +" " + (arcDiv.height() - 50) )
//	.append('text')
//	.attr('class', 'unit-label')
//	.attr("text-anchor", function(d){
//			return "middle";
//	})
//	.attr("baseline-shift", "-24%")
//	.attr("id", "noSelectArcText-" + obj.config.dataOrder)
////	.attr('x', function(d){ return (obj.WIDTH - (2*obj.PADDING) - obj.LEFT_OFFSET)/2; })
////	.attr('y', function(d){ return arcDiv.height()/2; })
//	.text(function(d){ return 'There are no interaction arcs with bait.';})
////	.attr('x', x)
////	.attr("y",bottom)
////	.attr("width", width)
////	.attr("height", height)
////	.style('margin-left', x)
//	;
//};

HicHistogram.prototype.arc = function( summarizedOriginData, ratio, base, foldChangeRatio, i) {
	var obj = this;
	
	var arcDiv = $("#graph-frame-arc-" + obj.config.dataOrder);
	
	var arcCanvas = d3.select("#arcCanvas-" + obj.config.dataOrder);

//	console.log(summarizedOriginData);
	
//	var startX = d3.select("#peakBaseRect-0").attr("x");
	var startX = 0;
	
	var x1 = obj.xScale(summarizedOriginData.bin1) - d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("x");
	var x2 = obj.xScale(summarizedOriginData.bin2) - d3.select("#peakBaseRect-" + obj.config.dataOrder).attr("x");

	var depth = (150 * ratio) + 50;
	
	var diffBetween2Points = (x1 - x2);
	var alpha = (parseFloat(Math.abs(diffBetween2Points))/Math.abs(x1-startX) );
	
	if( alpha > 1 ) alpha = 1;
	
	var alpha2 = 1 - alpha;

	var diff = x1 - (( (diffBetween2Points)/2 ) * alpha2);
	
//	console.log( x1 + " " + x2 + " " + alpha  + "   " + startX);

	
    arcCanvas.append('path')
	.attr('id', 'arc-data-' + obj.config.dataOrder+"-"+i)
	.attr('class', 'arcBar arcBar-' + obj.config.dataOrder)
//	.attr('y1', function(){
//		return obj.yScale(summarizedOriginData.count);
//	})
	.attr('d', function(){
//		return 'M' + x1+ ' '+base+' Q' + parseInt((x1 + x2)/2) + ' ' + (base+depth) +' ' + x2 + ' ' + base;
//		console.log('M' + x1+ ' '+base+' Q' + diff + ' ' + (base+depth) +' ' + x2 + ' ' + base);
		return 'M' + x1+ ' '+base+' Q' + diff + ' ' + (base+depth) +' ' + x2 + ' ' + base;
	})
	.style('stroke', function(d){
		return d3.rgb(255 - (255*foldChangeRatio), 255 - (255*foldChangeRatio), 255);
	})
	.on('mouseover', function(){
		$("#"+this.id).css('stroke','red');
		$("#"+this.id).css('stroke-width','3px');

	})
	.on('mouseout', function(){
		$("#"+this.id).css('stroke', function(d){
			return d3.rgb(255 - (255*foldChangeRatio), 255 - (255*foldChangeRatio), 255);
		});
		$("#"+this.id).css('stroke-width','1px');
	})
	.on('click', function(){
		$(".targetGene-"+obj.config.dataOrder ).remove();
		$.ajax({
			type:'post',
			url:'get_gene',
			data:{chrom:obj.config.rawData.aveHic.chrom, startPt:summarizedOriginData.bin2, endPt: summarizedOriginData.bin2+5000},
			success:function(data){
				var TargetGeneList = JSON.parse(data);

				if(TargetGeneList.length != 0){
					for(var j=0; j<TargetGeneList.length; j++){
						var tableContents = "<tr class='targetGene-"+obj.config.dataOrder+"'><td>"+TargetGeneList[j].num+"</td><td>"+TargetGeneList[j].chrom+"</td><td>"+TargetGeneList[j].txStart+"</td><td>"+TargetGeneList[j].txEnd+"</td><td>"+TargetGeneList[j].name+"</td><td>"+TargetGeneList[j].locus+"</td></tr>";
						$("#target-gene-list-"+obj.config.dataOrder).append(tableContents);
					}
				}
				else{
					var tableContents = "<tr class='targetGene-"+obj.config.dataOrder+"'><td colspan='6'>There are no genes in this area.</td></tr>";
					$("#target-gene-list-"+obj.config.dataOrder).append(tableContents);
				}	
			}
		});
	})
	;
	
	
//	var canvas = document.getElementById("canvasCurve");
//	
//	if (canvas.getContext) {
//		
//		var ctx = canvas.getContext('2d');
//		ctx.clearRect(0, 0, canvas.width, canvas.height);//canvas clear
//		
//		for(var i=0; i<data.interactionPairs.length; i++) {
//			var bait = obj.xScale(parseInt(data.interactionPairs[i].bin1));
//			var interact = obj.xScale(parseInt(data.interactionPairs[i].bin2));
//	        
//			var controlPoint = parseInt(bait+interact);
//
//	        ctx.beginPath();//컨텍스트 리셋
//	        ctx.moveTo(bait, 50);
//	        ctx.quadraticCurveTo(controlPoint/2, 450, interact, 50);
////	        context.quadraticCurveTo(cpx,cpy,x,y); 
//	         // 좌표이동
//	        ctx.strokeStyle="black";
//	        ctx.stroke();
//		}
//	}
//	else alert('canvas를 지원하지 않는 브라우저입니다.');
};




