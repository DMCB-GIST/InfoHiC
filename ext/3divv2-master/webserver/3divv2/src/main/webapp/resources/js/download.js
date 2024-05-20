$(function() {
    $("#download-list").rowspanizer({
        cols : [0,1,2,6],
        vertical_align: "middle"
    });
    
    $("#download-search").on("change keyup paste", function(){
    	var keyword = $("#download-search").val();
    	
    	$.ajax({
    		type:'post',
    		url: 'search_download_list',
    		dataType: 'json',
    		data:{keyword : keyword },
    		success:function(data){
    			$("tbody").empty();
    			
    			var table_contents = "";
    			
    			for(var i=0; i<data.length; i++){
    				if(i % 2 != 0){
	    				table_contents += "<tr>" +
		    									"<td>"+data[i].cutoff+"</td>"+
		    									"<td>"+data[i].file_size+"</td>"+
		    									"<td><a class='sampleDownloadImg download-img' id='"+data[i].file_path+"'></a></td>"+
		    								"</tr>";
    				}
    				else{
	    				table_contents += "<tr>" +
												"<td rowspan='2'>"+data[i].celline_name+"</td>"+
												"<td rowspan='2'>"+data[i].reference+"</td>"+
												"<td rowspan='2'>"+data[i].geo_accession+"</td>"+
												"<td>"+data[i].cutoff+"</td>"+
												"<td>"+data[i].file_size+"</td>"+
												"<td><a class='sampleDownloadImg download-img' id='"+data[i].file_path+"'></a></td>"+
											"</tr>";
    				}
    			}
    			
    			$("tbody").append(table_contents);
    			
    			$("#download-list").on("click", ".sampleDownloadImg", function() {
    				var sampleDownloadPath = $(this).attr("id");
    				
    				var url = "downloads?name=" + sampleDownloadPath;
    							
    				$(location).attr('href', url);
    			})
    		}
    	});
    });
});

$(document).ready( function() {
	$(".sampleDownloadImg").click( function() {
		var sampleDownloadPath = $(this).attr("id");
		
		var url = "downloads?name=" + sampleDownloadPath;
					
		$(location).attr('href', url);
	})
})
