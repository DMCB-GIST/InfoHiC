<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>

<script>
	$(document).ready(function(){
		$(".nav-menu > ul > li").removeClass("active");
		$("#nav-tutorial").addClass("active");
	})
</script>

<script>
	$(function() {
		$(".tutorial_btn").click(function() {
			var tab = $("#contact").find("a.active").attr("href");
			
			var tmp = "";
			if( tab === "#hic" ) {
				tmp = "tutorial";
			} else if( tab === "#capturehic" ) {
				tmp = "capturehic-tutorial";
			} else if( tab === "#cancerhic" ) {
				tmp = "cancerhic-tutorial";
			}
			
			var id = $(this).attr('id');
			var split = id.split(tmp + '_btn');
			
			$('html, body').animate({
				scrollTop: $("#" + tmp + split[1]).offset().top - 120
			}, 400);        
		});
	});
</script>
  
	<section id="subhero" class="d-flex align-items-center">
		<div class="container position-relative">
			<div class="row justify-content-center">
				<div class="col-xl-7 col-lg-9 text-center">
					<h1>TUTORIAL</h1>
				</div>
			</div>
		</div>
	</section>

	<main id="main">
		<section id="contact" class="contact contactpage">
			<div class="container" data-aos="fade-up">
				<div class="panel with-nav-tabs panel-info">
	                <div class="panel-heading p-0">
						<ul class="nav nav-tabs">
							<li class="nav-item">
								<a class="nav-link active" data-toggle="tab" href="#hic">Hi-C</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#capturehic">Capture Hi-C</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#cancerhic">Cancer Hi-C</a>
							</li>
						</ul>
					</div>

					<div class="panel-body">
						<div class="tab-content">
							<div class="table-responsive tab-pane fade in show active" id="hic">
									<div class="tutorial">
										<ul class="p-0 m-0" style="list-style:none;">
											<li class='tutorial_btn' id='tutorial_btn1'>1. Identification and Annotation of significant interaction</li>
											<li class='tutorial_btn' id='tutorial_btn1-1'><span style="margin-left:50px;">1.1 Input parameters</span></li>
											<li class='tutorial_btn' id='tutorial_btn1-2'><span style="margin-left:50px;">1.2 Output</span></li>
											<li class='tutorial_btn' id='tutorial_btn1-3'><span style="margin-left:50px;">1.3 Result Adjustment</span></li>
											<li class='tutorial_btn' id='tutorial_btn1-4'><span style="margin-left:50px;">1.4 Result Interpretation</span></li>
											
											<li class='tutorial_btn' id='tutorial_btn2' style='margin-top:10px;'>2. Visualization of chromatin interaction</li>
											<li class='tutorial_btn' id='tutorial_btn2-1'><span style="margin-left:50px;">2.1 Input parameters</span></li>
											<li class='tutorial_btn' id='tutorial_btn2-2'><span style="margin-left:50px;">2.2 Output</span></li>
											<li class='tutorial_btn' id='tutorial_btn2-3'><span style="margin-left:50px;">2.3 Result Adjustment</span></li>
											
											<li class='tutorial_btn' id='tutorial_btn3' style='margin-top:10px;'>3. Comparative visualization of chromatin interaction</li>
											<li class='tutorial_btn' id='tutorial_btn3-1'><span style="margin-left:50px;">3.1 Input parameters</span></li>
											<li class='tutorial_btn' id='tutorial_btn3-2'><span style="margin-left:50px;">3.2 Output</span></li>
											<li class='tutorial_btn' id='tutorial_btn3-3'><span style="margin-left:50px;">3.3 Result Adjustment</span></li>
											<li class='tutorial_btn' id='tutorial_btn3-4'><span style="margin-left:50px;">3.4 Result Interpretation</span></li>
											
											<li class='tutorial_btn' id='tutorial_btn4' style='margin-top:10px;'>4. Session Save/Load and Visualization Export</li>
											<li class='tutorial_btn' id='tutorial_btn4-1'><span style="margin-left:50px;">4.1 Save session as a file</span></li>
											<li class='tutorial_btn' id='tutorial_btn4-2'><span style="margin-left:50px;">4.2 Load session from a file</span></li>
											<li class='tutorial_btn' id='tutorial_btn4-3'><span style="margin-left:50px;">4.3 Export Figures</span></li>
										</ul>
									</div>
									<div class='mt-5 tutorial-contens'>
										 	<h3 id='tutorial1'>● Session 1 : Identification and Annotation of significant interaction</h3>

										 	&nbsp;Hi-C, high-throughput chromatin conformation capture (3C), is a most-widely used genome-wide molecular assay that identify long-range chromatin interactions. Genomic and epigenomic contexts may assist functional interpretation of the identified interactions. In this regard, 3DIV provides a list of interaction partners of queried loci together genomic/epigenomic annotations. In this tutorial, we provide an example with rs1421085 SNPs in H1-derived mesenchymal stem cell since this SNP is well characterized by significant interactions with IRX3 and IRX5 gene promoters.<br/><br/>
									
										<h4 id='tutorial1-1'> - Input parameters</h4>
											1) Click “more experiment” button to load the full list of samples.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_1.png" style='width:600px; '/></div><br/>
											
											2) Select H1-derived Mesenchymal Stem Cell by clicking the checkbox.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_2.png" style='width:600px; '/></div><br/>
											
											3) 3DIV allows users to pass the gene names or SNP ID, as well as genomic coordinates as the query. Type rs1421085 and click “Add Sample(s)” button.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_3.png" style='width:600px; '/></div><br/>
											
											4) Click “rs1421085” to pass rs1421085 variant as the query.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_4.png" style='width:600px; '/></div><br/>

											5) Then, click “Run” button.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_5.png" style='width:600px; '/></div><br/>
									
										<h4 id='tutorial1-2'> - Output</h4>
											&nbsp;The output table contains following information; experimental bias-removed interaction frequency, distance-normalized interaction frequency, annotation of enhancers or super-enhancers, disease associated SNPs, and corresponding gene name for a promoter. Fold changes between FPKM of multiple histone ChIP-seq and input are also provided.
											<br/><br/>&nbsp;Bias-removed interaction frequency indicates experimental bias-removed interaction frequencies from raw Hi-C data, defined as the ratio between observed interaction frequency and expected interaction frequency. We also provide distance-normalized interaction frequencies to identify biologically meaningful interactions with LOESS regression model.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_6.png" style='width:800px; '/></div>
										
										<h4 id='tutorial1-3'> - Result Adjustment</h4>
											1)	By dragging the scroll bar for the cutoff value of distance ligation frequency at the top of the page and click “Filter Run” button, you can change the value of cutoff to be listed in the result table. In this tutorial, we used the criteria 2.0, in other word only interactions whose bias-remove interaction frequency is greater than two-fold of background will be listed.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_7.png" style='width:600px; '/></div><br/>
											2)	The number of entries per page can be adjusted by clicking on the drop-down button located above the interaction table. In this tutorial, we applied 25 entries per page.<br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_8.png" style='width:600px; '/></div><br/>
											3)	If you want to order interaction partners by a certain feature, click the header of the column. In this tutorial, interaction partners will be ordered by their bias-removed interaction frequency.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_9.png" style='width:600px; '/></div><br/>
											
										<h4 id='tutorial1-4'> - Result Interpretation</h4>
											These adjustments identified interactions between rs1421085 and promoters of IRX3 and IRX5.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/1_10.png" style='width:600px; '/></div><br/>
											
										<h3 id='tutorial2'>● Session 2 : Visualization of chromatin interaction</h3>
											&nbsp;3DIV visualize the identified interactions around queried loci, which helps users to intuitively understand the interaction patterns. In this tutorial we provide an example of chr1:60,000,000 at LNCaP prostate cancer cell line and PrEC normal prostate epithelial cells. This region is well-known example of cancer-specific genome disorganization.
										
										<h4 id='tutorial2-1'> - Input parameters</h4>
											1)	Click “more experiment” button to load the full list of samples.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_1.png" style='width:600px; '/></div><br/>
											2)	Select LNCaP prostate cancer cell line and PrEC normal prostate epithelial cell by clicking the checkboxes.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_2.png" style='width:600px; '/></div><br/>
											3)	3DIV allows users to query gene names and SNP ID, as well as genomic coordinates. Type chr1:60000000 and click “Add Sample(s)” Button.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_3.png" style='width:600px; '/></div><br/>
											4)	Then, click “Run” button to visualize chromatin interactions around queried loci.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_4.png" style='width:600px; '/></div><br/>
											
										<h4 id='tutorial2-2'> - Output</h4>
											&nbsp;Interaction visualization result have two panels which visualize chromatin interaction of LNCaP and PrEC respectively (Ⅰ, Ⅱ). Each panel consists of five figures. First figure (a) is the interaction heat map, in which topologically associating domains (TAD), basic unit of genome 3D structure are indicated as the blue triangle. Second figure (b) is the one-to-all interaction frequency graph. Blue bar graph represents bias-removed chromatin interaction frequency, and magenta dots represent distance-normalized interaction frequency. Third figure (c) is the arc-diagram of the identified interactions, which are defined by the threshold displayed as the green line in figure (b). Fourth figure (d) annotates super-enhancers and RefSeq Genes. Last figure (e) describes an interaction partner of the queried loci upon clicking an interaction of interested shown in figure (c).<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_5.png" style='width:600px; '/></div><br/> 
										
										<h4 id='tutorial2-3'> - Result Adjustment</h4>
											1)	To adjust the color range of heat map, drag the scroll bar for color range above the heatmap.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_6.png" style='width:600px; '/></div><br/>
											2)	To shift visualization range without changing the queried loci, click on white space of the graph and drag horizontally towards the desired direction.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_7.png" style='width:600px; '/></div><br/>
											3)	To select other loci as the query, click the red bait indicator and drag to the loci of interest.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_8.png" style='width:600px; '/></div><br/>
											4)	To zoom-in or zoom-out visualization range, either click zoom-in/zoom-out button above the heatmap, or select the visualization range by dragging the yellow area at the top of the graph.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_9.png" style='width:600px; '/></div><br/>
											5)	By Dragging the scroll bar at the right site of interaction frequency graph, you can change significance criteria for the interactions.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_10.png" style='width:600px; '/></div><br/>
											6)	User can hide and show any subfigures by clicking “heatmap open/open”, “Graph open/close”, “arc open/close”, or “Gene open/close” button. Each button show and hide interaction frequency heat map, one-to-all interaction frequency graph, arc-representation of identified interactions, and annotations of gene body and super-enhancer respectively.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/2_11.png" style='width:600px; '/></div><br/>
											
										<h3 id='tutorial3'>● Session 3 : Comparative visualization of chromatin interaction</h3>
											&nbsp;3DIV also enables us to perform comparative analysis of gain or loss of interactions between too samples by generating a comparative heatmap with automatic scale synchronization. In this tutorial, we provide an example of chr1:60,000,000 at H1 embryonic stemcell and H1-derived mesenchymal stem cell (MSC). This region is well-known example of TAD-wise loss or gain of interaction during differentiation.
										
										<h4 id='tutorial3-1'> - Input parameters</h4>
											1)	First, choose a pair of samples by clicking the checkboxes. Click “more experiment” button to load the full list of samples.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/3_1.png" style='width:600px; '/></div><br/>
											2)	Select H1 embryonic stem cell and H1-derived Mesenchymal Stem Cell by clicking checkboxes.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/3_2.png" style='width:600px; '/></div><br/>
											3)	3DIV allows users to query gene names and SNP ID, as well as genomic coordinates. Type chr1:60000000 and click “Add Sample(s)” Button.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/3_3.png" style='width:600px; '/></div><br/>
											4)	Then, click “run” button to compare the chromatin interactions near the queried loci.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/3_4.png" style='width:600px; '/></div><br/>
											
										<h4 id='tutorial3-2'> - Output</h4>
											The comparative interaction visualization result consists of five figures. First figure (a) is the comparative interaction heat map. Second figure (b) is the one-to-all chromatin interactions for a given query with a synchronized scale. Blue bar graph represents bias-removed chromatin interaction frequency, and magenta dots represent distance-normalized interaction frequency. Third figure (c) is the arc-diagram of identified interactions, which are defined by the threshold displayed as the green line in figure (b). Fourth figure (d) annotates super-enhancers and RefSeq Genes. Last figure (e) explains an interaction partner of the queried loci upon clicking an interaction arc of interest in figure (c).<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/3_5.png" style='width:600px; '/></div><br/>
											
										<h4 id='tutorial3-3'> - Result Adjustment</h4>	
											1)	To adjust the color range of heat map, drag the scroll bar for color range above the heatmap.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/3_6.png" style='width:600px; '/></div><br/>
											
										<h4 id='tutorial3-4'> - Result Interpretation</h4>	
											The comparative interaction heatmap reflects loss or gain of interactions between samples. The blue color indicates higher interaction frequencies in mesenchymal stem cell specific. In line with the heatmap, the arc-diagram of identified interactions also presents additional number of long-range chromatin interactions in MSC. <br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/3_7.png" style='width:600px; '/></div><br/>
											
										<h3 id='tutorial4'>● Session Save/Load and Visualization Export</h3>
											3DIV allows users to save and load the result, which do not require any login or registration. 3DIV makes session file which describe samples and queried locus in JSON format. User can reproduce analysis result from other computer, or share the result with collaborator by transferring the session file. Moreover, 3DIV exports figures in SVG format, which can be imported by other drawing software for building publish-ready scientific figures.<br/>
											
										<h4 id='tutorial4-1'> - Save session as a file </h4>
											1)	When user performed the analysis, click menu button, which is located at upper-right side of the panel.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/4_1.png" style='width:600px; '/></div><br/>
											2)	Then, click save setting button. 3DIV generate the session file, and web browser will download the session file.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/4_2.png" style='width:600px; '/></div><br/>
										
										<h4 id='tutorial4-2'> - Load session from a file </h4>
											1)	Click menu button, which is located at upper-right side of the panel.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/4_3.png" style='width:600px; '/></div><br/>
											2)	Then, click “upload setting” button<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/4_4.png" style='width:600px; '/></div><br/>
											3)	The dialogue box askes the location of file. Click “choose file” button and assign the location of the session file.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/4_5.png" style='width:600px; '/></div><br/>
											
										<h4 id='tutorial4-3'> - Export Figures</h4>	
											1)	After visualization of chromatin interactions, click “save as images” button. Then 3DIV generate figures in SVG format, and web browser will download the figure.<br/><br/>
											<div style="text-align: center;"><img src="./resources/images/tutorial/4_6.png" style='width:600px; '/></div><br/>
									</div>
							</div>
							
							<div class="table-responsive tab-pane fade in show" id="capturehic">
								<div class="tutorial">
									<ul class="p-0 m-0" style="list-style:none;">
										<li class='tutorial_btn' id='capturehic-tutorial_btn1'>1. visualization of the promoter-centered interactions of bait region in multiple samples.</li>
										<li class='tutorial_btn ml-4' id='capturehic-tutorial_btn1-1'><span>1.1 Input parameters</span></li>
										<li class='tutorial_btn ml-4' id='capturehic-tutorial_btn1-2'><span>1.2 Output</span></li>
									</ul>
								</div>
								
								<div class="mt-5 tutorial-contents">
									<h5 id='capturehic-tutorial1'>1. visualization of the promoter-centered interactions of bait region in multiple samples.</h5>
									<span class="mb-3">In this tutorial, we provide an example of visualization of the promoter-centered interactions of bait region in multiple samples.</span>
									
									<h6 id='capturehic-tutorial1-1'>- Input parameters</h6>
									<span>1) In “Choose Sample(s)” tab, click “GM”, “H1”, “HCmerge”, “IMR90”, and “LV”. Short description about the sample is given.</span>
									<span>2) In “Input Bait” tab, type “ADAMTS1” gene and select corresponding gene in the list.</span>
									<span>3) Set visualization range in “Interaction range” tab. Default is 1Mb.</span>
									<span>4) Clicking blue “+” icon next to the “Items selected” tab will pop-up "Find genomic location from Gene Symbol" tab. Click bait genomic coordinates will list up visualization samples to the “Items selected” tab.</span>
									<span>5) Click “Run” button to visualize bait promoter-centered interactions at given samples.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/capturehic/1-1-1.png" class="w-75"/></div>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/capturehic/1-1-2.png" class="w-75"/></div>
									
									<h6 id='capturehic-tutorial1-2'>- Output</h6>
									<span>Refseq and Gencode gene tracks (hg19) will be provided with normalized count tracks. Arcs indicates significant interactions at given P-value threshold.</span>
									<span>1) To adjust zoom range, click “1.5X” or “3X” buttons next to the “Zoom in” and “Zoom out”.</span>
									<span>2) Unclicking “Display P/O” interactions will remove Promoter-Other interactions, leaving purple arcs (Promoter-Promoter interactions) only.</span>
									<span>3) Adjusting –log10(P-values) will change threshold for displaying significant interactions.</span>
									<span>4) Clicking and drag on the figure will show genomic distance of dragged regions with an arrow.</span>
									<span>5) Clicking orange boxes of the significant interaction will show contact information.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/capturehic/1-2-1.png" class="w-75"/></div>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/capturehic/1-2-2.png" class="w-75"/></div>
								</div>
							</div>
							
							<div class="table-responsive tab-pane fade in show" id="cancerhic">
								<div class="tutorial">
									<ul class="p-0 m-0" style="list-style:none;">
										<li class='tutorial_btn' id='cancerhic-tutorial_btn1'>1. Simulation of disorganized 3D chromatin structure based on WGS-identified structural variation.</li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn1-1'><span>1.1 Input parameters</span></li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn1-2'><span>1.2 Simulation of the SV effect on Hi-C contact map</span></li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn1-3'><span>1.3 Output</span></li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn1-4'><span>1.4 Adjustment of Hi-C contact maps</span></li>
										
										<li class='tutorial_btn' id='cancerhic-tutorial_btn2' style='margin-top:10px;'>2. Interactive manipulation of Hi-C contact map to simulate disorganized 3D genome.</li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn2-1'><span>2.1 Input parameters</span></li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn2-2'><span>2.2 Contact map manipulation</span></li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn2-3'><span>2.3 Output</span></li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn2-4'><span>2.4 Sequential manipulation of the Hi-C contact map</span></li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn2-5'><span>2.5 Output</span></li>
										
										<li class='tutorial_btn' id='cancerhic-tutorial_btn3' style='margin-top:10px;'>3. Visualization of complex SV effect on 3D genome by uploading user-defined chromosome order</li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn3-1'><span>3.1 Input parameters</span></li>
										<li class='tutorial_btn ml-4' id='cancerhic-tutorial_btn3-2'><span>3.2 Output</span></li>
									</ul>
								</div>
				
								<div class="mt-5 tutorial-contents">
									<h5 id='cancerhic-tutorial1'>1. Simulation of disorganized 3D chromatin structure based on WGS-identified structural variation.</h5>
									<span class="mb-3">In this tutorial, we provide an example of visualization of the Hi-C contact matrix, check list of pre-called WGS-based structural variations, and predict the impact of identified structural variations on 3D genome.</span>
									
									<h6 id='cancerhic-tutorial1-1'>- Input parameters</h6>
									<span>1) Click “Pre-called SV and 3D genome” tab.</span>
									<span>2-1) 3DIV provides two types of sample searching function. In “Choose sample(s) by characteristics” tab, sample of interest can be browsed by sequentially selecting sample characteristics and narrowing down candidate samples. In this tutorial, selecting “Colorectal cancer” and “Colorectal tissue” will list up multiple samples and “SNUCRC 14-442T” will be used. Use same procedure and select “Control”, “Colorectal paired normal tissue”, and “SNUCRC 11-51N” to load a control sample</span>
									<div class="text-center"><img src="./resources/images/tutorial/cancerhic/1-1-2-1.png" class="w-75"/></div>
									<span>2-2) In “Choose sample(s) by search” tab, typing properties of the sample will list up samples with matching keywords. For example, typing ‘Colorectal’ will list up multiple colorectal cancer related samples. Linking multiple keyword with ‘and’ helps reducing candidates. Typing ‘Colorectal and SNUCRC’ will reduce lists small enough to easily find Case/Control sampled mentioned above.</span>
									<div class="text-center"><img src="./resources/images/tutorial/cancerhic/1-1-2-2.png" class="w-75"/></div>
									<span>3-1) 3DIV cancer allows user to select region of interest by genomic coordinates or gene name. In this tutorial, type “chr6:60000000-150000000” to “By genomic locus” box in “Choose genomic locus” tab. Click “Add regions(s)” button to add region in the “Selected region(s)” list.</span>
									<span>3-2) In Module I, ‘By predefined SV’ tab activated when the sample is selected which provides list of SVs of the selected sample. Selecting the SV on the list will use breakpoints regions as the input coordinates</span>
									<span>4) Click “Options for display” tab to change “visualization range”, adding extra tracks, change contact map color palette, or other options.</span>
									<div class="text-center"><img src="./resources/images/tutorial/cancerhic/1-1-4.png" class="w-75"/></div>
									<span class="mb-3">5) Click “Run” button to visualize 3D chromatin interactions of selected region(s).</span>
									
									<h6 id='cancerhic-tutorial1-2'>- Simulation of the SV effect on Hi-C contact map</h6>
									<span>The table of pre-called structural variation (> 1Mb) is at the bottom of the page. Column 2 and 4 indicates the two chromosomes of the structure variation breakpoints, column 3 and 5 shows their genomic coordinates, and column 6 and 7 indicates the direction of the SV identifying WGS reads and type of the SV based on the read direction. In this tutorial, clicking “chr6 75343990 chr6 125216780 DEL 3to5” on the 3rd row of the table shows deletion event on the Hi-C contact map.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/cancerhic/1-2-1.png" class="w-75"/></div>
									
									<h6 id='cancerhic-tutorial1-3'>- Output</h6>
									<span>The output image shows following information: First figure (a) is the Hi-C contact map showing original interactions of input regions from selected sample. The color bar and ruler indicate linear representation of genomic loci. Area of the Hi-C contact map covered by the SV breakpoints selected at the previous step is marked with translucent boxes. (b) Hi-C contact map showing simulated effect of the selected SV event. (c) Annotated RefSeq/GENCODE genes and super-enhancers. User can select options to visualize genes in ‘dense’ format, all genes, and selected genes defined by the user.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/cancerhic/1-3-1.png" class="w-75"/></div>
									
									<h6 id='cancerhic-tutorial1-4'>- Adjustment of Hi-C contact maps</h6>
									<span>Panel for result adjustment tools are located at the top of the result page. It also follows user in a form of side bar when scrolls down.</span>
									<span>1) To adjust zoom range, click magnifier buttons (a).</span>
									<span>2) To adjust visualization region, click arrow buttons (b).</span>
									<span>3) Redo/Undo buttons can revert the manipulations done to the Hi-C contact map (c).</span>
									<span>Dragging buttons in the color bar can change the color scale (d). Clicking information icons next to the tracks also provides tooltips to use track functions.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/cancerhic/1-4-1.png" class="w-75"/></div>
									
									
									<h5 id='cancerhic-tutorial2'>2. Interactive manipulation of Hi-C contact map to simulate disorganized 3D genome.</h5>
									<span class="mb-3">At previous section, visualizing reconstructed Hi-C contact map by the pre-defined structural variation was demonstrated. However, not all genomic rearrangements are detectable by the WGS, list of SVs might not be provided, or user might want to test the effect of imaginary structural variation event. The 3DIV cancer provides the method to designate the loci to be manipulated which will be demonstrated in this tutorial.</span>
									
									<h6 id='cancerhic-tutorial2-1'>- Input parameters</h6>
									<span>1) Click “Interactive 3D genome manipulation” tab to use recombination mode.</span>
									<span>2) Load “SNUCRC 14-442T” Colorectal cancer sample’s “chr6:60000000-150000000” region like previous tutorial. Module II do not use control sample.</span>
									<span class="mb-3">3) Click “Add regions(s)” button to add region in the “Selected region(s)” list and click “Run” button.</span>
									
									<h6 id='cancerhic-tutorial2-2'>- Contact map manipulation</h6>
									<span>1) At the top of the result panel, click “DEL” button. Each SV type button corresponds to the SV types to be simulated. TanDUP and InvDUP indicates tandem duplication and duplication with inverted genomic fragments.</span>
									<span>2) Drag the genomic region to be deleted on the chromosome track.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/cancerhic/2-2-1.png" class="w-75"/></div>
									
									<h6 id='cancerhic-tutorial2-3'>- Output</h6>
									<span class="mb-3">The output is similar to the previous tutorial session, but the highlighted region corresponds to the user-defined coordinates instead of pre-defined SVs.</span>
									
									<h6 id='cancerhic-tutorial2-4'>- Sequential manipulation of the Hi-C contact map</h6>
									<span class="mb-3">1) Click “INV” button of the control panel. 3DIV allows multiple application of SV effect to the Hi-C contact map. Drag a region of the Hi-C contact map after deletion.</span>
									
									<h6 id='cancerhic-tutorial2-5'>- Output</h6>
									<span>The output will show inverted region of the Hi-C contact map after deletion. Multiple impact of the SVs can be sequentially simulated to the Hi-C contact map using the 3DIV. Un/Redo and Refresh of the sequence can be controlled by the Controller. Raw contact map at the bottom shows the SV-affected regions at the raw Hi-C contact map, where color indicates the different SV types.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/cancerhic/2-5-1-1.png" class="w-75"/></div>
									<div class="text-center mb-5"><img src="./resources/images/tutorial/cancerhic/2-5-1-2.png" class="w-75"/></div>
									
									
									<h5 id='cancerhic-tutorial3'>3. Visualization of complex SV effect on 3D genome by uploading user-defined chromosome order</h5>
									<span class="mb-3">In cancer, complex rearrangement involving more than two events frequently happens. For example, chromoplexy is a phenomenon that occurs when several chromosomes are shattered by single catastrophic event and then connected to different chromosomes. In this case, 3DIV cancer allows multiple manipulation of the Hi-C contact maps by uploading the order of the rearranged chromosomal fragments. This tutorial demonstrates an example of estimating the changed 3D genome in patients under chromoplexy.</span>
									
									<h6 id='cancerhic-tutorial3-1'>- Input parameters</h6>
									<span>1) Click “Complex SV and 3D genome” tab to use recombination mode</span>
									<span>2) Select “SNUCRC 11-927T” Colorectal cancer sample.</span>
									<span>3) Upload formatted files to give order of rearranged chromosomal fragments. Each row indicates full order of one rearranged chromosome. Fragments originated from different chromosomes should be segregated by semi colon (‘;’) Regions not included in the list will be considered as deleted fragments. The chromoplexy example will be formatted like following example.</span>
									<span class="ml-3">chr19:1-11064109;chr17:7,858,769-83257441</span>
									<span class="ml-3">chr20:1-17070762;chr19:14867959-58617616</span>
									<span class="ml-3">chr17:1-6643610;chr20:18560020-64444167</span>
									<span>4) Click run button to visualize 3D chromatin interactions.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/cancerhic/3-1-1.png" class="w-75"/></div>
									
									<h6 id='cancerhic-tutorial3-2'>- Output</h6>
									<span>Raw contact map indicates original Hi-C contact map based on the reference genome (hg38). Rearranged contact map shows rearranged Hi-C contact map based on the rearranged genome. Translocation interactions are relocated like a cis- interaction as genome order changed. By changing ‘Weight score’ using the slidebar, user can enhance relocated interactions or identify rearranged contact map regions. ‘Normal’ cis- interactions were downscaled.</span>
									<div class="text-center mb-3"><img src="./resources/images/tutorial/cancerhic/3-2-1.png" class="w-75"/></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
	
<jsp:include page="../common/footer.jsp" flush="false"/>