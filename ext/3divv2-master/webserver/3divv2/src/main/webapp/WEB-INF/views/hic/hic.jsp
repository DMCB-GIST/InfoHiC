<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>
 
<link rel="stylesheet" href="./resources/css/hicstyle.css"/>
<link rel="stylesheet" href="./resources/js/hic/assets/d3.slider.css" />
<link rel="stylesheet" href="./resources/js/hic/assets/jquery.dataTables.min.css" />

<script type="text/javascript" src="./resources/js/hic/assets/d3.v3.min.js"></script>
<script type="text/javascript" src="./resources/js/util.js"></script>
<script type="text/javascript" src="./resources/js/hic/main.js"></script>
<script type="text/javascript" src="./resources/js/hic/hic_histogram.js"></script>
<script type="text/javascript" src="./resources/js/hic/hic_histogram_comparison.js"></script>
<script type="text/javascript" src="./resources/js/hic/gene.js"></script>
<script type="text/javascript" src="./resources/js/hic/gencode.js"></script>
<script type="text/javascript" src="./resources/js/hic/heatmap.js"></script>
<script type="text/javascript" src="./resources/js/hic/heatmap_comparison.js"></script>
<script type="text/javascript" src="./resources/js/hic/heatmap_comparison_svg.js"></script>
<script type="text/javascript" src="./resources/js/hic/heatmap_svg.js"></script>
<script type="text/javascript" src="./resources/js/hic/arc.js"></script>
<script type="text/javascript" src="./resources/js/hic/enhancer.js"></script>
<script type="text/javascript" src="./resources/js/hic/assets/d3.slider.js"></script>
<script type="text/javascript" src="./resources/js/hic/assets/lz-string.js"></script>
<script type="text/javascript" src="./resources/js/util/base64.js"></script>
<script type="text/javascript" src="./resources/js/util/snappyjs.js"></script>
<script type="text/javascript" src="./resources/js/hic/assets/Canvas2Svg.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/5.10.3/math.min.js"></script>
<script type="text/javascript" src="./resources/js/hic/assets/FileSaver.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>


<style>

.subcon {
    margin: 0 auto;
    padding: 10px 1% 80px;
    line-height: 21px;
    min-height: 500px;
    clear: both;
    margin: 0 auto;
    width: 1024px;
    padding: 0px;
   /*  font-size: 14px; */
    color: #213d64;
    height: 100%;
    line-height: 18px;
}

ul{
	list-style:none;
	margin-bottom: 0px;
	padding-left: 0px;
}
ul li{
	padding: 3px 0px;
}
.choose-tab{ padding: 0px !important; }
.choose-tab > a{ padding: 10px 30px; background-color: #f2f2f2; border-bottom: 1px solid #dee2e6; color:gray; border-top-left-radius: 0.7rem !important; border-top-right-radius: 0.7rem !important; }
.choose-tab > a.active{ color: #2487ce !important; }
#myTabContent{ padding: 30px; text-align: left; }

#characteristic-table{ font-size: 11px; color: #000;}
#characteristic-table tr th{ font-weight: lighter; text-align:left; }
.na{ color: #bcbcbc; }
.cnt-num{ color: #5454a9; font-weight: bold; }
.expand-tr{ background-color: #eee; }
.prop-tr td{ background-color: #e9eae1; }

.prop-tr th{ padding-left: 30px; background-color: #ddded1; }
#sampleListTotalFrame{ position: absolute; background: #fff; border: 1px solid gray; padding: 20px; font-size: 12px;}
#sampleListTotalFrame div.button { background: #02517b; color: #fff; float: right; margin-top:15px;}
.sample-info{ background-color: #d9d9cc; margin-bottom: 5px; border: 1px solid #b3b399; border-radius: 5px; padding: 0px 5px; cursor: pointer;}
.sample-info.selected{ background-color: #78785a; color: #fff; }
#selectedItems{ font-size: 12px; }
</style>

<input type='hidden' id='hidden_locus'/>
<input type='hidden' id='hidden_range'/>
<input type='hidden' id='hidden_drag_range'/>
<input type='hidden' id='hidden_pointx'/>
<input type='hidden' id='window_size' value='5000'/>
<input type='hidden' id='window_size2' value='20000'/>
<input type='hidden' id='startPt'/>
<input type='hidden' id='endPt'/>
<input type='hidden' id='sampleList' value='${sampleList}'/>
  
  <section id="subhero" class="d-flex align-items-center">
    <div class="container position-relative">
      <div class="row justify-content-center">
        <div class="col-xl-7 col-lg-9 text-center">
          <h1>Hi-C</h1>
        </div>
      </div>
    </div>
  </section>
  
  <main id="main">
    <section id="contents" class="hic contact contactpage">
     	<div class="subcon" data-aos="fade-up">
     	
     		<div class="card text-center ">
				<div class="card-header">
					<nav>
						<div class="nav nav-tabs card-header-tabs" id="nav-tab" role="tablist">
							<a class="nav-item nav-link hic_tab active font-weight-bold" id="search_samples" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="predefined-sv" aria-selected="true">Interaction table</a>
							<a class="nav-item nav-link hic_tab font-weight-bold" id="multiple_samples" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="userdefined-sv" aria-selected="false">Interaction visualization</a>
							<a class="nav-item nav-link hic_tab font-weight-bold" id="pairwise_samples" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="user-rearrangement" aria-selected="false">Comparative interaction visualization</a>
						</div>
					</nav>
				</div>
				<div class="card-body">
					<div class="tab-content p-2" id="myTabContent">
						<div class="tab-pane fade show active" id="interaction-table-tab" role="tabpanel" aria-labelledby="interaction-table-tab">
							<div class='row mb-3'>
								<div class='col-lg-12 col-sm-12'>
									<div class="card">
										<div class="card-header text-left hic-menu">
											<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
											<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Choose sample(s)</span>
										</div>
										<div class="card-body">
											<ul class="nav nav-tabs border-0" id="myTab" role="tablist">
												<li class="nav-item choose-tab">
													<a class="nav-link active" id="choose-by-tree-tab" data-toggle="tab" href="#choose-by-tree" role="tab" aria-controls="choose-by-tree" aria-selected="false">Choose sample(s) by characteristics</a>
													<!-- <a class="nav-link" id="choose-by-tree-tab" data-toggle="modal" data-target="#chooseCharModal">Choose sample(s) by characteristics</a> -->
												
												</li>
												<li class="nav-item choose-tab">
													<a class="nav-link" id="choose-by-search-tab" data-toggle="tab" href="#choose-by-search" role="tab" aria-controls="choose-by-search" aria-selected="true">Choose sample(s) by search</a>
												</li>
												<li class="nav-item choose-tab">
													<a class="nav-link" id="choose-by-all-tab" data-toggle="tab" href="#choose-by-all" role="tab" aria-controls="choose-by-all" aria-selected="true">Choose sample(s)</a>
												</li>
											</ul>
											<div class="tab-content">
												<div class="tab-pane fade" id="choose-by-all" role="tabpanel" aria-labelledby="choose-by-all-tab">
													<div class="border rounded px-3 overflow-auto" style="height:300px;">
														<div class="text-left" id="sliderdefault">
															<ul>
																<c:forEach var="sample" items="${sampleList}">
																	<li><input class='sample-choose-chk' type="checkbox" value="${sample.id}&${sample.celline_name }"/> ${sample.celline_name }</li>
																</c:forEach>
															</ul>
														</div>
													</div>
												</div>
												<div class="tab-pane fade" id="choose-by-search" role="tabpanel" aria-labelledby="choose-by-search-tab">
													<div class="input-group input-group-sm border rounded p-4 sample-group-class sample-control-group-class">
														<div class="col-2"><label class="form-check-label" for="gencode_chk">Sample</label></div>
														<!-- <input id="text_hic_sample" type="text" class="form-control ui-autocomplete-input" placeholder="Ex) Adrenal gland" aria-label="Adrenal gland" autocomplete="off">
														<div class="input-group-append">
															<button class="btn btn-outline-secondary dropdown-toggle hic-sample-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
														</div> -->
														
														<div class="col-10">
															<select class="w-100" id="chooseSamplesBySearchSelectBox" multiple="multiple">
																<c:forEach var="sample" items="${sampleList}">
																	<option value="${sample.id}&${sample.celline_name }">${sample.celline_name }</option>
																</c:forEach>
															</select>
														</div>
													</div>
												</div>
												<div class="tab-pane fade show active" id="choose-by-tree" role="tabpanel" aria-labelledby="choose-by-tree-tab">
													<div class="border rounded px-3 overflow-auto">
														<div class="row py-4">
														<!-- <div id="characteristics-frame" style="overflow-x:auto; max-height: 500px; overflow-y: auto;"> -->
															<div class="form-group col-md-3">
														      <label for="inputType"><i class="fa fa-chevron-right pr-2" aria-hidden="true"></i>Type</label>
														      <select id="inputType" class="form-control form-control-sm">
														        <option value="" disabled selected hidden>Choose...</option>
														      </select>
														    </div>
														    
														    <div class="form-group col-md-3">
														      <label for="inputName"><i class="fa fa-chevron-right pr-2" aria-hidden="true"></i>Sample property</label>
														      <select id="inputName" class="form-control form-control-sm">
														        <option value="" disabled selected hidden>Choose...</option>
														      </select>
														    </div>
														    
														    <div class="form-group col-md-3">
														      <label for="inputProperty"><i class="fa fa-chevron-right pr-2" aria-hidden="true"></i>Condition</label>
														      <select id="inputProperty" class="form-control form-control-sm">
														        <option value="" disabled selected hidden>Choose...</option>
														      </select>
														    </div>
														    
														     <div class="form-group col-md-3">
														      <label for="inputSample"><i class="fa fa-chevron-right pr-2" aria-hidden="true"></i>Sample</label>
														      <select id="inputSample" class="form-control form-control-sm">
														        <option value="" disabled selected hidden>Choose...</option>
														      </select>
														    </div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class='row mb-3'>
								<div id="bait-selector" class='col-lg-6 col-sm-12'>
									<div class="card h-100">
										<div class="card-header text-left hic-menu">
											<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
											<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Input bait</span>
										</div>
										
										<div class="card-body">
											<div class="input-group input-group-sm">
												<div class="input-group-prepend">
													<span class="input-group-text" id="basic-addon1">Bait : </span>
												</div>
												<input type="text" class="form-control typeahead" id="input" aria-describedby="basic-addon1" autocomplete="off" data-provide="typeahead" />
											</div>
											<small class="float-left">(Ex. CROCCP2, chr22:27141000, rs42)</small>
										</div>
									</div>
								</div>
								<div id="boundary-selector" class='col-lg-6 col-sm-12'>
									<div class="card h-100">
										<div class="card-header text-left hic-menu">
											<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
											<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Interaction range</span>
										</div>
										<div class="card-body">
											<div class="input-group input-group-sm">
												<select class="form-control form-control-sm" id='boundary_range' onChange="getSelectText();">
													<option value='50000'>50Kb</option>
													<option value='100000'>100Kb</option>
													<option value='500000'>500Kb</option>
													<option value='1000000'>1Mb</option>
													<option value='2000000' selected>2Mb</option>
													<option value='1'>Genomic position</option>
												</select>
												
												<div id="direct_input_frame" style="display:inline" class="w-100 mt-3">
													<input type="text" id="direct_input" name="direct_input" placeholder="chr22:26641000-27641000" class="form-control w-100"/>
													<small class="float-left">(Ex.chr22:26641000-27641000)</small>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div id="tad-selector" class='col-lg-4 col-sm-12 hidden'>
									<div class="card h-100">
										<div class="card-header text-left hic-menu">
											<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
											<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">TAD</span>
										</div>
										<div class="card-body">
											<div class="input-group input-group-sm">
												<select id='sel_tad' class="form-control form-control-sm">
													<option value='TopDom (w=20)'>TopDom (w=20)</option>
													<option value='DI (window size = 2Mb)' selected>DI (window size = 2Mb)</option>
													<option value='TopDom (w=5)'>TopDom (w=5)</option>
													<option value='DI (window size = 500kb)'>DI (window size = 500kb)</option>
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						
							<div class="row mt-3">
								<div class='col-12 text-center'>
									<button id='submitbtn' class='btn btn-sm btn-primary'>Add sample(s)</button>
   									<button id='remove_samples' class='btn btn-sm btn-secondary ml-2'>Remove sample(s)</button>
								</div>
							</div>
							
							<div class='row mt-3'>
								<div class='col-12'>
									<div class="card">
										<div class="card-header text-left hic-menu">
											<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
											<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Selected region(s)</span>
										</div>
										<div class="card-body">
											<div class="col-12 table-responsive">
									     		<table id="chooseInfo" class="table table-sm table-bordered">
									     			<thead class="thead-light">
														<tr>
															<th scope="col"><input id="chk_samples_all" type="checkbox"></th>
															<th class="d-none" scope="col">No.</th>
															<th class="font-weight-normal" scope="col">Sample</th>
															<th class="font-weight-normal" scope="col">Bait</th>
															<th id="tad-th" class="hidden font-weight-normal">TAD</th>
														</tr>
													</thead>
													<tbody>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="row mt-3">
								<div class='col-12 text-center'>
									<button id='example_run' class='btn-success btn-sm border mr-2'>Example Run</button>
   									<button id='btn_run' class='btn-primary btn-sm border'>Run</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			
			<div id='graph'></div>
		</div>
		
		
		<div id="gene_list_dialog" title="Find genomic location from Gene Symbol or SNP id" >
			<div class='dialog-title' style="height:25px;line-height:25px;background:none;">Gene symbols</div>
			<div class='dialog-content'>
			</div>
		</div>
		<div id="upload_dialog" class="hidden"  title="Upload Setting">
			<form id='fileForm'>
				<input type="file" id="file" name='jsonFile' style="width:400px; height: 25px; margin: 15px 0px;">
				<input type="submit" id="submit_btn" value="submit" class="button" style="margin: 15px 0px;">
			</form>
		</div>
		<div id="upload_user_file_dialog" class="hidden"  title="Use Your Own Data">
			<div style="margin:15px 0px;">
				<p style="width: 120px; float:left;">IP address :</p>
				<input id="user_url" type="text" style="width: 360px;" value="http://192.168.150.65:8080/3div/data/Data_AD.ktm"><br/>
				<div style="margin-left: 120px;">(Ex. http://biodb.kaist.ac.kr/hic_db/Data_AD.ktm )</div>
			</div>
			
			<div style="margin:15px 0px;">
				<p style="width: 120px; float:left;">Bait : </p>
				<input id="user_bait" type="text" style="width: 360px;" value="chr10:4000000"><br/>
				<div style="margin-left: 120px;">(Ex. chr10:4000000)</div>
			</div>
			
			<div>
				<p style="width: 120px; float:left;">Interaction range : </p>
				<select id='user_boundary_range'>
					<option value='50000'>50Kb</option>
					<option value='100000'>100Kb</option>
					<option value='500000'>500Kb</option>
					<option value='1000000'>1Mb</option>
					<option value='2000000' selected>2Mb</option>
					<option value='1'>Genomic position</option>
				</select>
			</div>
			<div style="text-align: center;">
				<input type="submit" id="submit_user_btn" value="submit" class="button" style="margin: 15px 0px;">
			</div>
		</div>

		<!-- Modal -->
		<div class="modal fade" id="chooseCharModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-lg" role="document" style="max-width: 80% !important;">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h5 class="modal-title" id="exampleModalLabel">Choose sample(s) by characteristics</h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body" style="overflow-x: auto; overflow-y: auto; max-height: 500px;">
		      	<div id="selectedItems"></div>
		      	<div id="chooseCharContents"></div>
		      	
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		      </div>
		    </div>
		  </div>
		  <div id="sampleListTotalFrame" style="display: none;">
		  	<div id="sampleListFrame"></div>
		  	<div class="button" id="char-add-btn">Add sample(s)</div>
		  </div>
		</div>
		
    </section>
    

  </main>
  
<div class='loading'><img alt='loading' src='./resources/images/hic/ajax-loader.gif'></div>

<script>
	$(document).ready(function(){
		$(".nav-menu > ul > li").removeClass("active");
		$("#nav-hic").addClass("active");
	})
</script>
<jsp:include page="../common/footer.jsp" flush="false"/>