comparison_heatmap_svg = function(data, i) {
	$("#graph-frame-heatmapSVG" ).empty();	

	var heatmapTotalFrame = $("<div id='graph-frame-heatmapSVG'></div>");
	
	$("#graph-frame").append( heatmapTotalFrame );
	
	var margin = {top: 0, right: 0, bottom: 0, left: d3.select("#peakBaseRect-1").attr("x")},
		width = parseInt(d3.select("#peakBaseRect-1").attr("width")),
		height = parseInt(d3.select("#peakBaseRect-1").attr("width"))/2;
	
	var incline = height*Math.sqrt(2);

	var n = Math.ceil( ( data.boundary * 2) / $("#heatmap-resolution-1").val()) + 1;
	
	var pos_opacity, neg_opacity, legend_max, legend_min, total_opacity, max = 0;
	var blue_opacity, red_opacity, blue_neg_opacity, red_pos_opactity;

	if(data.links != null){

		legend_max = (data.max * 0.8).toFixed(2);
		legend_min = (data.min * 0.8).toFixed(2);

		pos_opacity = 1/legend_max;
		neg_opacity = 1/legend_min;


		if(parseFloat(sliderStartPt) < legend_min || parseFloat(sliderEndPt) > legend_max ){
			sliderEndPt = legend_max;
			sliderStartPt = legend_min;
		}
		
		if(sliderStartPt && sliderEndPt){
			
			if(legend_max <= 0){
				blue_neg_opacity = 1/(Math.abs(sliderStartPt)-Math.abs(sliderEndPt));
			}
			else if( legend_min >= 0 ){
				
			}else{
				blue_opacity = 1/Math.abs(sliderStartPt);
				red_opacity = 1/Math.abs(sliderEndPt);
			}
		}else{
			if(Math.abs(legend_max) > Math.abs(legend_min))
				total_opacity = 1/legend_max;
			else
				total_opacity = 1/Math.abs(legend_min);
			
			sliderEndPt = legend_max;
			sliderStartPt = legend_min;
		}
	}

	var svg = d3.select("#graph-frame-heatmapSVG").append("svg")
				.attr("id","heatmap_svg_"+i)
				.attr("width", width)
				.attr("height", height + 20)
				.style("margin-left", margin.left)
				;

	var cellInclineSize = incline / n;
	
	var mvSize = cellInclineSize / Math.sqrt(2);
	
	svg.append("polygon")
		.attr("class","background")
		.style("stroke-width", "3")
		.style("stroke", "lightgray")
		.attr("points", "0,"+height+" "+(width/2)+",0"+" "+width+","+height);  // x,y points

	
	var cdata = data.links;
	
	var filtered_data = cdata
	.map(function(d, idx) {
//		if(d.value*opacity <= 0.01 || d.value< $("#sliderStart-"+i).val() ) return null;
//		else 
			return d;
	})
    .filter(function(d) { return d != null })
    ;
	
	var grp = svg.append("g");
	
	grp.selectAll(".heatmapCell")
			.data( filtered_data )
			.enter()
			.append("polygon")
			.attr("fill", function(d) { if(d.value<0) return "blue"; else return "red";})
			.attr("fill-opacity", function(d, i) { if(legend_min >= 0) {return d.value*pos_opacity;} else if(legend_max<=0){  if(blue_neg_opacity) return Math.abs(d.value)*blue_neg_opacity; else return d.value*neg_opacity;} else {if(blue_opacity && red_opacity){if(d.value<0) return Math.abs(d.value)*blue_opacity; else return Math.abs(d.value)*red_opacity;} else return Math.abs(d.value)*total_opacity; } })
			.attr("points", function(d, i){ 
				return getPointsCell( getPositionMatrix(mvSize, height, d.target, d.source ), mvSize ); 
				})
			;
	
//	
//	
//	var row = svg.selectAll(".row")
//		.data(matrix)
//		.enter()
//		.append("g")
//		.attr("class", "row")
//		.attr("transform", function(d, i) { return "translate(0," + x(i)+ ")"; })
//		.each(row);
//
//	var column = svg.selectAll(".column")
//		.data(matrix)
//		.enter()
//		.append("g")
//		.attr("class", "column")
//		.attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
//
//	function row(row) {
//		d3.select(this).selectAll(".cell")
//			.data(row.filter(function(d) {return d.z; }))
//			.enter().append("rect")
//			.attr("class", function(d){return "cell row-"+d.y+" col-"+d.x;})
//		    .attr("x",function(d) {return x(d.x); })
//		    .attr("width", x.rangeBand())
//		    .attr("height", x.rangeBand())
//		    .style("fill-opacity", function(d) {if(legend_min >= 0) {return d.z*pos_opacity;} else if(legend_max<=0){  if(blue_neg_opacity) return Math.abs(d.z)*blue_neg_opacity; else return d.z*neg_opacity;} else {if(blue_opacity && red_opacity){if(d.z<0) return Math.abs(d.z)*blue_opacity; else return Math.abs(d.z)*red_opacity;} else return Math.abs(d.z)*total_opacity; } })
//		    .style("fill", function(d) { if(d.z<0) return "blue"; else return "red";});
//	}
//
//	function order(value) {
//		x.domain(orders[value]);
//	}
};


//cell center position
function getPositionMatrix( mvSize, height, x, y ){

	return (mvSize *( x + y + 1 )) +"," + (height - (mvSize * ( x - y )));
}

//tad polygon points
function getTadPosition ( mvSize, height, startIdx, endIdx ){
	var result =  ((mvSize*(startIdx*2)) +","+ height + " "+ 
			(Number(mvSize*(startIdx*2)) + Number(( (mvSize*((endIdx*2))) - (mvSize*(startIdx*2)) )/2)) +","+ (Number(height) - (( Number(mvSize*((endIdx*2))) - Number(mvSize*(startIdx*2)) )/2)) +" "+
			(mvSize*((endIdx*2))) +","+ height);

	return result;
}

//cell polygon points
function getPointsCell ( point, mvSize ){
	var x = point.split(",")[0];
	var y = point.split(",")[1];
	
	var result = (Number(x) - Number(mvSize)) +","+ y +" "+ x +","+ (Number(y) - Number(mvSize)) +" "+ (Number(x) + Number(mvSize)) +","+ y +" "+ x +","+ (Number(y) + Number(mvSize));
	
	return  result;
}



