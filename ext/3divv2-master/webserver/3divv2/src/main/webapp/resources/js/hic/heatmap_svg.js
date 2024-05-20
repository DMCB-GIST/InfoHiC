//heatmap_svg = function(data, i) {
//	var heatmapTotalFrame = $("<div id='graph-frame-heatmapSVG-"+i+"'></div>");
//	
//	$("#graph-frame-" + i).append( heatmapTotalFrame );
//
//	var margin = {top: 0, right: 0, bottom: 0, left: 0},
//	width = parseInt(d3.select("#peakBaseRect-0").attr("width"))/Math.sqrt(2),
//	height = parseInt(d3.select("#peakBaseRect-0").attr("width"))/Math.sqrt(2);
//	
//	var x = d3.scale.ordinal().rangeBands([0, width]);
//
//	var matrix = [],
//	  nodes = data.nodes,
//	  n = nodes.length;
//	
//	var opacity = 0;
//	var legend_max = 0;
//
//	nodes.forEach(function(node, i) {
//		node.index = i;
//		node.count = 0;
//		matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
//	});
//	
//	if(data.links != null){
//		data.links.forEach(function(link) {
//			matrix[link.source][link.target].z += link.value;
//		});
//
//		foldChangeMax = data.max;			// all_capture_res 최대값
//		opacity = 1 / (foldChangeMax*0.8);	// 범례의 80% 이상인 경우 red(#ff0000)로 칠함 
//		legend_max = foldChangeMax;
//	}
//
//	var node_cnt = nodes.length;
//	
//	var orders = {
//			name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); })	// name으로 정렬
//	};
//	
//	// The default sort order.
//	x.domain(orders.name);
//	
//	var cellSize=x.rangeBand();
//
//	var svg = d3.select("#graph-frame-heatmapSVG-"+i).append("svg")
//	.attr("id","heatmapSVGCanvas-"+i)
//	.attr("width", width)
//	.attr("height", height)
//	.style("margin-top", 131 +"px")
//	.style("margin-left","263px")
//	.style("overflow", "hidden")
//	
//	svg.attr('transform',function(){
//        var me = svg.node()
//        var x1 = me.getBBox().x + me.getBBox().width/2;//the center x about which you want to rotate
//        var y1 = me.getBBox().y + me.getBBox().height/2;//the center y about which you want to rotate
//
//        return `rotate(-45, ${x1}, ${y1})`;//rotate -45 degrees about x and y
//    }).append("g")
//	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
//
////	$("#heatmapSVGCanvas-"+i).toggleClass('rotated');
//	
//	svg.append("polygon")
//	.attr("class","background")
//	.style("stroke-width", "3")
//	.style("stroke", "lightgray")
//	.attr("points", "0,0, "+width+",0"+" "+width+","+height);  // x,y points
//	
//	var sliderEnd = $("#sliderEnd-"+i).val();
//	
//	if(parseFloat(sliderEnd) > parseFloat(legend_max.toFixed(2)) ) {
//		$("#sliderEnd-"+i).val(legend_max.toFixed(2));
//	}
//
//	// slider 안움직였을 때 (맨 처음)
//	if(!($("#sliderStart-"+i).val() && $("#sliderEnd-"+i).val())){
//		$("#sliderStart-"+i).val(0);
//		$("#sliderEnd-"+i).val(legend_max.toFixed(2));
//	}else{
//		opacity = 1 / ($("#sliderEnd-"+i).val()*0.8);
//	}
//	
//	var row = svg.selectAll(".row")
//	.data(matrix)
//	.enter()
//	.append("g")
//	.attr("class", "row")
//	.attr("transform", function(d, i) { return "translate(0," + x(i)+ ")"; })
//	.each(row);
//
//	var column = svg.selectAll(".column")
//	.data(matrix)
//	.enter()
//	.append("g")
//	.attr("class", "column")
//	.attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; })
//	;
//
//	function row(row) {
//		d3.select(this).selectAll(".cell")
//		.data(row.filter(function(d) { if(d.z*opacity <= 0.01 || d.z< $("#sliderStart-"+i).val() ) return 0; else return d.z; }))
//		.enter().append("rect")
//	    .attr("x",function(d) {return x(d.x); })
//	    .attr("width", x.rangeBand())
//	    .attr("height", x.rangeBand())
//	    .style("fill-opacity", function(d) { if(d.z >= $("#sliderEnd-"+i).val()) return 1; else return d.z * opacity; })
//	    .style("fill", "red");
//	}
//
//	function order(value) {
//		x.domain(orders[value]);
//	}
//
//	/* TAD */
//	if(data.tad != null ){
//		for(var j=1; j<data.tad.length+1; j++){
//			svg.append("polygon")
//			.attr("id", j )
//			.style("fill-opacity", "0")
//			.style("stroke-width", "4")
//			.style("stroke", "blue")
//			.style("opacity" , 0.7)
//			.attr("points", data.tad[j-1].tadStartIdx*cellSize +","+data.tad[j-1].tadStartIdx*cellSize +" " + data.tad[j-1].tadEndIdx*cellSize +","+data.tad[j-1].tadStartIdx*cellSize +" "+  data.tad[j-1].tadEndIdx*cellSize +","+ data.tad[j-1].tadEndIdx*cellSize)
//		}
//	}
//};