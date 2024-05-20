
heatmap_slider = function(i){
	
	var sliderStart = $("<input type='hidden' id='sliderStart-"+ i +"'/>");
	var sliderEnd = $("<input type='hidden' id='sliderEnd-"+ i +"'/>");
	
	$("#contents").append(sliderStart);
	$("#contents").append(sliderEnd);
	
};

heatmap = function(data, i, boundary) {	

//	console.log(data);
	
	$("#svg_legend-"+i).remove();
	$("#heatmap-canvas-"+i).remove();
	$("#heatmap-tadFrame-"+i).remove();
	$("#heatmap-svg-frame-"+i).removeClass('rotated');

	var graph_frame_heatmap = $("#graph-frame-heatmap-"+i);
	
	var heatmapTotalFrame = $("#heatmap-total-"+i);
	var heatmapFrame = $("#heatmap-"+i);
	
	heatmapTotalFrame.append(heatmapFrame);
	
	var width = parseInt(d3.select("#peakBaseRect-0").attr("width"))/Math.sqrt(2);

	var opacity = 0;
	var legend_max = 0;

	foldChangeMax = data.max;	// all_capture_res 최대값
	opacity = 1 / (foldChangeMax*0.8);	// 범례의 80% 이상인 경우 red(#ff0000)로 칠함 
	legend_max = foldChangeMax;

	$("#heatmap-svg-frame-"+i).css('width',width).css('height',width);
	
	if(!($("#sliderStart-"+i).val() && $("#sliderEnd-"+i).val())){
		$("#sliderStart-"+i).val(0);
		$("#sliderEnd-"+i).val(legend_max.toFixed(2));

	}
	else{
		if($("#sliderEnd-"+i).val() > legend_max) opacity = 1 / legend_max;
		else opacity = 1 / ($("#sliderEnd-"+i).val()*0.8);
	}

	var isIntChk = isInt((boundary*2 )/ $("#heatmap-resolution-"+i).val());

	if(isIntChk) {
		var cellSize = width / ((((boundary*2 )/ $("#heatmap-resolution-"+i).val()))+1) ;
	}
	else { 
		var cellSize = width / Math.ceil(((boundary*2 )/ $("#heatmap-resolution-"+i).val())) ;
	}

	$("#heatmap-canvas-"+i).remove();
	
	var appendCanvas = "<canvas id='heatmap-canvas-"+i+"' height='1000' width='1000' style='margin-top:-480px;'>This browser doesn't support canvas</canvas>";
	var tadFrame = "<svg id='heatmap-tadFrame-"+i+"' style='margin-top:30px; height:"+width+"px; width:"+width+"px; position:relative; overflow:hidden;'></svg>";
	
	$("#graph-frame-heatmap-"+i).append(appendCanvas);
	$("#heatmap-svg-frame-"+i).append(tadFrame);
	
	var canvas = document.getElementById('heatmap-canvas-'+i);
	
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		
		ctx.scale(-1,1);
	    ctx.rotate(135 * Math.PI / 180);
	    
	    var rotate_x = 408;
	    var rotate_y = 190;
	    
		ctx.beginPath();
		ctx.moveTo(0+rotate_x, 0-rotate_y);
		ctx.lineTo(0+rotate_x, width-rotate_y);
		ctx.lineTo(width+rotate_x, width-rotate_y);
		ctx.closePath();

		ctx.strokeStyle = 'lightgray'
		ctx.lineWidth = 2;
	    ctx.stroke();
		
	    if(data.links != null ){
			for(var k=0; k<data.links.length; k++){
				ctx.fillStyle = 'rgba(255,0,0,'+(data.links[k].value)*opacity+')';
				if(data.links[k].value < $("#sliderStart-"+i).val()) ctx.fillStyle = "rgb(255,255,255)";
				ctx.fillRect( ((data.links[k].source)*cellSize)+rotate_x, ((data.links[k].target)*cellSize)-rotate_y, cellSize, cellSize);		    	
			}
	    }
	}

	var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("z-index","10")
	.style("opacity", 0);
	
	var svg = d3.select("#heatmap-tadFrame-"+i);
//	svg.attr("transform", "translate(267,148),rotate(-45)");

	if(data.tad != null ){
		for(var j=1; j<data.tad.length+1; j++){
			svg.append("polygon")
			.attr("id", j )
			.style("fill-opacity", "0")
			.style("stroke-width", "4")
			.style("stroke", "blue")
			.style("opacity" , 0.7)
			.attr("points", data.tad[j-1].tadStartIdx*cellSize +","+data.tad[j-1].tadStartIdx*cellSize +" " + data.tad[j-1].tadEndIdx*cellSize +","+data.tad[j-1].tadStartIdx*cellSize +" "+  data.tad[j-1].tadEndIdx*cellSize +","+ data.tad[j-1].tadEndIdx*cellSize)
			.on("mouseover", function(){
				var num = this.id;
				tooltip.transition()
						.duration(1000)
						.style("opacity", 1);

				tooltip.html("<table style='background-color:#fff'><tr><td colspan='2'>TAD"+num+"</td></tr><tr><td>Chromosome</td><td>"+ data.tad[num-1].chr +"</td></tr><tr><td>Start</td><td>"+ comma(data.tad[num-1].tadStart) +"</td></tr><tr><td>End</td><td>"+ comma(data.tad[num-1].tadEnd) +"</td></tr></table>")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY) + "px");

			})
			.on("mouseout", function(){
				tooltip.transition()
						.duration(500)
						.style("opacity", 0);
			});
			///이 부분을 canvas로 새로 그리면 됩니다.
		}
	}

	$("#heatmap-svg-frame-"+i).toggleClass('rotated');
	$("#heatmap-tadFrame-"+i).css('left','93px').css('top','255px');
	

	/* legend  start */
	var legend_frame = d3.select("#heatmap_legend-"+i).append("div")
							.attr("id","svg_legend-"+i)
							;

	legend_frame.call(d3.slider().axis(true).value( [ $("#sliderStart-"+i).val(), $("#sliderEnd-"+i).val() ] ).min(0).max(legend_max.toFixed(2)).on("slide", function(evt, value) {
			sliderStart = value[ 0 ];
			sliderEnd = value[ 1 ];
			$("#sliderStart-"+i).val(sliderStart);
			$("#sliderEnd-"+i).val(sliderEnd);
			
	}));

	var handle = document.getElementsByClassName('d3-slider-handle');

	for(var k=0; k<handle.length; k++){
		if(handle[k].style.left.replace("%",'') < 0) {$("#sliderStart-"+i).val(0); handle[k].style.left="0%"; }
		else if(handle[k].style.left.replace("%",'') > 100) {$("#sliderEnd-"+i).val(legend_max.toFixed(2)); handle[k].style.left="100%";}
	}
	/* legend  end */


};


//refresh_heatmap (get_heatmap)
refresh_heatmap = function (i){
	var dataOrder = 0;
	$("#chooseInfo tr.appendTr").each(function(){
		if(dataOrder==i) {
			sampleId = $(this).find('td:eq(1)').text();
			loci = $(this).find('td:eq(3)').text();
			tad = $(this).find('td:eq(4)').text();
		}
		dataOrder ++;
	});
	var sampleName = $("#graph-frame-title-"+i).text();

	var windowSize = $("#window_size").val();
	var windowSize2 = $("#window_size2").val();
	var heatmapWindowSize = $("#heatmap-resolution-"+i).val();

	var startPt=$("#startPt-"+i).val();
	var endPt=$("#endPt-"+i).val();

	$.ajax({
		type:'get',
		url: 'get_heatmap',
		dataType: 'json',
		data:{loci:loci, windowSize: windowSize, windowSize2:windowSize2, heatmapWindowSize:heatmapWindowSize, startPt:startPt, endPt:endPt, sampleId:sampleId, sampleName:sampleName, tad:tad },
		success:function(data){
			heatmap(data, i, data.boundary);
		}
	});
};

heatmap_header = function (i, parent, resolution){
	
	var heatmapTotalFrame = $("<div id='heatmap-total-"+i+"'></div>");
	var heatmapFrame = $("<div id='heatmap-"+i+"' style='margin-bottom:-80px;'></div>");
	var heatmapController = $("<div id='heatmap-control-"+i+"' class='heatmap-controller' style='padding:10px;background:none;text-align:right; position:relative;'></div>");
	var heatmapSvgFrame = $("<div id='heatmap-svg-frame-"+i+"' style='margin-top:25px;'></div>");
	var heatmapSelector = "Heatmap resolution <select id='heatmap-resolution-"+i+"' style='width:100px;'>";
		heatmapSelector += "<option value='5000'>5,000</option>";
		heatmapSelector += "<option value='10000'>10,000</option>";
		heatmapSelector += "<option value='20000'>20,000</option>";
		heatmapSelector += "<option value='25000'>25,000</option>";
		heatmapSelector += "<option value='30000'>30,000</option>";
		heatmapSelector += "<option value='40000'>40,000</option>";
		heatmapSelector += "</select>&nbsp;bp&emsp; ";
	var heatmapRefresh = $("<button id='heatmap-refresh-"+i+"' onclick='javascript:refresh_heatmap("+i+");'>Refresh</button>");
	
	var heatmapLegend = $("<div id='heatmap_legend-"+i+"' style='text-align: center; margin-left:650px;'></div>");

	heatmapController.append(heatmapSelector);
	heatmapController.append(heatmapRefresh);
	heatmapFrame.append(heatmapSvgFrame);
	heatmapTotalFrame.append(heatmapController);
	heatmapTotalFrame.append(heatmapLegend);
	
	heatmapTotalFrame.append(heatmapFrame);
	
	parent.append( heatmapTotalFrame );
	
	$("#heatmap-resolution-"+i).val(resolution).attr("selected","selected");
};

heatmap_default_resolution = function (boundary_range){

	if(boundary_range < 1000000) heatmap_resolution = 5000;
	else if(boundary_range < 2000000) heatmap_resolution = 10000;
	else if(boundary_range < 3000000) heatmap_resolution = 20000;
	else if(boundary_range < 4000000) heatmap_resolution = 30000;
	else heatmap_resolution = 40000;
};

function isInt(n) {
	   return n % 1 === 0;
}
