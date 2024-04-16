var sliderStartPt;
var sliderEndPt;

comparison_heatmap = function(data, i, boundary) {

	$("#svg_legend-"+i).remove();
	$("#heatmap-canvas-"+i).remove();
	$("#heatmap-tadFrame-"+i).remove();
	
	var graph_frame_heatmap = $("#graph-frame-heatmap");
	
	graph_frame_heatmap.css("height", "457px");
	
	var heatmapTotalFrame = $("#heatmap-total-"+i);
	var heatmapFrame = $("#heatmap-"+i);
	
	heatmapTotalFrame.append(heatmapFrame);
	
	var width = parseInt(d3.select("#peakBaseRect-1").attr("width"))/Math.sqrt(2);
	var opacity, blue_opacity, red_opacity;
	
	legend_max = (data.max * 0.8).toFixed(2);
	legend_min = (data.min * 0.8).toFixed(2);

	var type = "normal";
	if(legend_max <= 0 ) type = "negative";
	else if(legend_min >= 0) type ="positive";
	

	pos_opacity = 1/legend_max;
	neg_opacity = 1/legend_min;
	

	if(!(sliderStartPt && sliderEndPt)){
		sliderStartPt = legend_min;
		sliderEndPt = legend_max;
	}

	var isIntChk = isInt((boundary*2 )/ $("#heatmap-resolution-"+i).val());

	if(isIntChk) {
		var cellSize = width / ((((boundary*2 )/ $("#heatmap-resolution-"+i).val()))+1) ;
	}
	else { 
		var cellSize = width / Math.ceil(((boundary*2 )/ $("#heatmap-resolution-"+i).val())) ;
	}

	$("#heatmap-canvas-"+i).remove();
	
	var appendCanvas = "<canvas id='heatmap-canvas-"+i+"' height='1000' width='1000' style='margin-top:60px;'>This browser doesn't support canvas</canvas>";

	graph_frame_heatmap.append(appendCanvas);

	/* legend */
	var legend_frame = d3.select("#heatmap_legend-"+i).append("div")
							.attr("id","svg_legend-"+i)
							;
	
	var legend_x = 0;
	
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

	    if(type == "normal"){
	    	if(Math.abs(legend_max) > Math.abs(legend_min)) opacity = 1/legend_max;
			else opacity = 1/Math.abs(legend_min);
	    	
	    	if(sliderStartPt && sliderEndPt) { blue_opacity = 1/Math.abs(sliderStartPt); red_opacity = 1/Math.abs(sliderEndPt);}
	    	
	    	for(var k=0; k<data.links.length; k++){
	    		if(!(blue_opacity && red_opacity)){
		    		if(data.links[k].value < 0)	ctx.fillStyle = 'rgba(0,0,255,'+(data.links[k].value)*(-1)*opacity+')';
		    		else ctx.fillStyle = 'rgba(255,0,0,'+(data.links[k].value)*opacity+')';
	    		}
	    		else{
	    			if(data.links[k].value < 0)	ctx.fillStyle = 'rgba(0,0,255,'+(data.links[k].value)*(-1)*blue_opacity+')';
		    		else ctx.fillStyle = 'rgba(255,0,0,'+(data.links[k].value)*red_opacity+')';
	    		}

				ctx.fillRect( ((data.links[k].source)*cellSize)+rotate_x, ((data.links[k].target)*cellSize)-rotate_y, cellSize, cellSize);
		    }
	    	
			legend_x = parseFloat(Math.abs(legend_min)* 100) / (parseFloat(legend_max) + parseFloat(Math.abs(legend_min)));
			$("#svg_legend-"+i).css('background',"linear-gradient(to right, #0000ff 0%, #fffdfd "+legend_x+"%, #ff0000 100%)");
		}
	    else if (type == "positive"){
	    	opacity = 1/legend_max;
	    	if(sliderStartPt && sliderEndPt) opacity = 1 / sliderEndPt;
	    	
	    	for(var k=0; k<data.links.length; k++){
	    		ctx.fillStyle = 'rgba(255,0,0,'+(data.links[k].value)*opacity+')';
	    		if(data.links[k].value < sliderStartPt) ctx.fillStyle = "rgb(255,255,255)";
				ctx.fillRect( ((data.links[k].source)*cellSize)+rotate_x, ((data.links[k].target)*cellSize)-rotate_y, cellSize, cellSize);
		    }
	    	$("#svg_legend-"+i).css('background',"linear-gradient(to right, #fffdfd 0%, #ff0000 100%)");
	    }
	    else{
	    	
	    	opacity = 1/Math.abs(legend_min); 
	    	if(sliderStartPt && sliderEndPt) opacity = 1/(Math.abs(sliderStartPt)-Math.abs(sliderEndPt));
	    	
	    	for(var k=0; k<data.links.length; k++){
	    		ctx.fillStyle = 'rgba(0,0,255,'+(data.links[k].value)*(-1)*opacity+')';
	    		if(data.links[k].value > sliderEndPt) ctx.fillStyle = "rgb(255,255,255)";
				ctx.fillRect( ((data.links[k].source)*cellSize)+rotate_x, ((data.links[k].target)*cellSize)-rotate_y, cellSize, cellSize);
		    }
	    	$("#svg_legend-"+i).css('background',"linear-gradient(to right, #0000ff 0%, #fffdfd 100%)");
	    }

	  }

	
	legend_frame.call(d3.slider().axis(true).value( [ sliderStartPt, sliderEndPt ] ).min(legend_min).max(legend_max).on("slide", function(evt, value) {
		sliderStartPt = value[0];
		sliderEndPt = value[1];
	}));
	
	var handle_one_left =  document.getElementById('handle-one').style.left.replace("%",'');
	var handle_two_left =  document.getElementById('handle-two').style.left.replace("%",'');
	

	if(handle_two_left > 100){
		document.getElementById('handle-two').style.left = "100%";	
	}
	if(handle_one_left < 0){
		document.getElementById('handle-one').style.left = "0%";
	}
	if(legend_x) {
		if(handle_one_left > legend_x) document.getElementById('handle-one').style.left = legend_x+"%";
		if(handle_two_left < legend_x) { document.getElementById('handle-two').style.left = legend_x+"%";}
	}

};

pairwise_refresh_heatmap = function (i){
	// refresh_heatmap (get_pairwise_heatmap)
	var samples = [];
	var dataOrder = 0;
	$("#chooseInfo tr.appendTr").each(function(){
		var sampleId = $(this).find('td:eq(1)').text();
		var bait = $(this).find('td:eq(3)').text();
		var sampleName = $(this).find('td:eq(2)').text();
		
		samples.push( dataOrder + ";" + sampleId + ";" + sampleName +";"+ bait);
		dataOrder++;

	});
	var windowSize = $("#window_size").val();
	var windowSize2 = $("#window_size2").val();
	var heatmapWindowSize = $("#heatmap-resolution-"+i).val();

	var startPt=$("#startPt").val();
	var endPt=$("#endPt").val();

	$.ajax({
		type:'post',
		url:'get_pairwise_heatmap',
		dataType:'json',
		data:{loci1:samples[0], loci2:samples[1], windowSize:windowSize, windowSize2:windowSize2, heatmapWindowSize:heatmapWindowSize, startPt:startPt, endPt:endPt },
		success:function(data){
			comparison_heatmap(data, i, data.boundary);
		}
	});

};


comparison_heatmap_header = function (i, parent, resolution){

	var heatmapTotalFrame = $("<div id='heatmap-total-"+i+"'></div>");
	var heatmapFrame = $("<div id='heatmap-"+i+"' style='margin-bottom:-80px;'></div>");
	var heatmapController = $("<div id='heatmap-control-"+i+"' class='heatmap-controller' style='padding:10px;background:none;text-align:right;'></div>");
	var heatmapSvgFrame = $("<div id='heatmap-svg-frame-"+i+"' style='overflow:hidden'></div>");
	var heatmapSelector = "Heatmap resolution <select id='heatmap-resolution-"+i+"' style='width:100px;'>";
		heatmapSelector += "<option value='5000'>5,000</option>";
		heatmapSelector += "<option value='10000'>10,000</option>";
		heatmapSelector += "<option value='20000'>20,000</option>";
		heatmapSelector += "<option value='25000'>25,000</option>";
		heatmapSelector += "<option value='30000'>30,000</option>";
		heatmapSelector += "<option value='40000'>40,000</option>";
		heatmapSelector += "</select>&nbsp;bp&emsp; ";

	var heatmapLegend = $("<div id='heatmap_legend-"+i+"' style='text-align: center; margin-left:650px;'></div>");
	var heatmapRefresh = $("<button id='heatmap-refresh-"+i+"' onclick='javascript:pairwise_refresh_heatmap("+i+");'>Refresh</button>");

	heatmapController.append(heatmapSelector);
	heatmapController.append(heatmapRefresh);
	
	heatmapFrame.append(heatmapSvgFrame);
	heatmapTotalFrame.append(heatmapController);
	heatmapTotalFrame.append(heatmapLegend);
	
	heatmapTotalFrame.append(heatmapFrame);
	
	parent.append( heatmapTotalFrame );
	$("#heatmap-resolution-"+i).val(resolution).attr("selected","selected");
};

function isInt(n) {
	   return n % 1 === 0;
}