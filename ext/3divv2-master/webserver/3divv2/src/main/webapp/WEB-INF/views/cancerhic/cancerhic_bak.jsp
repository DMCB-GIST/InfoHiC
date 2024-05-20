<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>

<script type="text/javascript" src="resources/js/util/utils.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/common.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/cancerhicForm.js"></script>

	<section id="subhero" class="d-flex align-items-center">
		<div class="container position-relative">
			<div class="row justify-content-center">
				<div class="col-xl-7 col-lg-9 text-center">
					<h1>Cancer Hi-C</h1>
				</div>
			</div>
		</div>
	</section>

	<main id="main">
		<input type='hidden' id='boundaySize' />
		<input type='hidden' id='tab' value='${tab}'>

		<form id='sendForm' method="post" action="cancerhicView">
			<input type='hidden' id='genomeSize' name='genomeSize' value='${genomeSize }'/>
			<input type='hidden' id='json_samples' name='json_samples'/>
			<input type='hidden' id='json_regions' name='json_regions' />
			<input type='hidden' id='json_extra_tracks' name='json_extra_tracks'/>
			<input type='hidden' id='json_option_gene' name='json_option_gene'/>
			<input type='hidden' id='color_palette' name='color_palette'/>
			<input type='hidden' id='type' name='type'/>
			<input type='hidden' id='which_tab' name='which_tab' value='1'/>
			<input type='hidden' id='resolution' name='resolution'/>
			<input type='hidden' id='study_id' name='study_id'/>
			<input type='hidden' id='control_study_id' name='control_study_id'/>
			<input type='hidden' id='param_textarea_bed_format' name='param_textarea_bed_format'/>
		</form>
		
	    <section id="hic" class="hic contactpage">
	     	<div class="container" data-aos="fade-up">
				<div class="card text-center ">
					<div class="card-header">
						<nav>
							<div class="nav nav-tabs card-header-tabs" id="nav-tab" role="tablist">
								<a class="nav-item nav-link cancerhic_tab active font-weight-bold" id="predefined-sv-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="predefined-sv" aria-selected="true">Pre-called SV and 3D genome</a>
								<a class="nav-item nav-link cancerhic_tab font-weight-bold" id="userdefined-sv-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="userdefined-sv" aria-selected="false">User defined 3D genome manipulation</a>
								<a class="nav-item nav-link cancerhic_tab font-weight-bold" id="user-rearrangement-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="user-rearrangement" aria-selected="false">Complex SV and 3D genome</a>
							</div>
						</nav>
					</div>
					<div class="card-body">
						<div class="tab-content p-2" id="myTabContent">
							<div class="tab-pane fade show active" id="predefined-sv" role="tabpanel" aria-labelledby="predefined-sv-tab" aria-labelledby="choose-by-all-tab">
								<div class='row w-100'>
									<div class='col-lg-12 col-sm-12'>
									
										<!-- CARD Area -->
										<div class="card">
											<div class="card-header text-left hic-menu">
												<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
												<span class="card-title-sample d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Choose a sample</span>
											</div>
											<div class="card-body">
												<ul class="nav nav-tabs border-0" id="myTab" role="tablist">
													<li class="nav-item choose-tab">
														<a class="nav-link active" id="choose-by-all-tab" data-toggle="tab" href="#choose-by-all" role="tab" aria-controls="choose-by-all" aria-selected="true">Choose sample(s)</a>
													</li>
													<li class="nav-item choose-tab">
														<a class="nav-link" id="choose-by-search-tab" data-toggle="tab" href="#choose-by-search" role="tab" aria-controls="choose-by-search" aria-selected="true">Choose sample(s) by search</a>
													</li>
													<li class="nav-item choose-tab">
														<a class="nav-link" id="choose-by-tree-tab" data-toggle="tab" href="#choose-by-tree" role="tab" aria-controls="choose-by-tree" aria-selected="false">Choose sample(s) by characteristics</a>
													</li>
												</ul>
												<div class="tab-content">
													<div class="tab-pane fade show active" id="choose-by-all" role="tabpanel" aria-labelledby="choose-by-all-tab">
														<div class="input-group input-group-sm border border-bottom-0 px-4 pt-4 pb-1 sample-group-class study-group-class">
															<div class='col-2'><label class="form-check-label" for="text_study">Study</label></div>
															<input id='text_study' type="text" class="form-control readb" placeholder="Ex) Colon_Adenocarcinoma(74)" aria-label="Colon_Adenocarcinoma" readonly>
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle study-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
														<div class="input-group input-group-sm pt-1 sample-group-class sample-entire-group-class d-none">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Sample</label></div>
															<input id='text_sample' type="text" class="form-control readb" placeholder="Ex) Colon and CF7L2" aria-label="Colon and CF7L2">
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle sample-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
														<div class="input-group input-group-sm border border-top-0 border-bottom-0 px-4 pt-1 pb-4 sample-group-class sample-control-group-class">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Case</label></div>
															<input id='text_cancer_sample' type="text" class="form-control" placeholder="Ex) Colorectal and SNU" aria-label="Colorectal and SNU">
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle cancer-sample-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
														
														<div class="input-group input-group-sm border border-top-0 border-bottom-0 px-4 pt-4 pb-1 sample-group-class study-group-class">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Study</label></div>
															<input id='text_control_study' type="text" class="form-control readb" placeholder="Ex) Colon_Adenocarcinoma(74)" aria-label="Colon_Adenocarcinoma" readonly>
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle control-study-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
														<div class="input-group input-group-sm border border-top-0 px-4 pt-1 pb-4 sample-group-class sample-case-group-class">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Control</label></div>
															<input id='text_normal_sample' type="text" class="form-control" placeholder="Ex) Colon and CF7L2" aria-label="Colon and CF7L2">
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle normal-sample-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
													</div>
													<div class="tab-pane fade" id="choose-by-search" role="tabpanel" aria-labelledby="choose-by-search-tab">
														<div class="input-group input-group-sm border border-bottom-0 px-4 pt-4 pb-1 sample-group-class sample-control-group-class">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Case</label></div>
															<input id='search_text_cancer_sample' type="text" class="form-control" placeholder="Ex) Colorectal and SNU" aria-label="Colorectal and SNU">
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle cancer-sample-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
														
														<div class="input-group input-group-sm border border-top-0 px-4 pt-1 pb-4 sample-group-class sample-control-group-class">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Control</label></div>
															<input id='search_text_normal_sample' type="text" class="form-control" placeholder="Ex) Colon and CF7L2" aria-label="Colon and CF7L2">
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle normal-sample-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
													</div>
													<div class="tab-pane fade" id="choose-by-tree" role="tabpanel" aria-labelledby="choose-by-tree-tab">
														<div class="border rounded p-4">
															<span>Characteristics tab contents</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<!-- CARD Area -->
								<!-- <div class='row w-100 pre-called-control-sample-chooser-panel'>
									<div class='col-lg-12 col-sm-12'>
										<div class="card h-100 mt-3">
											<div class="card-header text-left hic-menu">
												<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
												<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Choose a control sample</span>
											</div>
											<div class='card-body'>
												<ul class="nav nav-tabs border-0" id="controlSample-myTab" role="tablist">
													<li class="nav-item choose-tab">
														<a class="nav-link active" id="controlSample-choose-by-all-tab" data-toggle="tab" href="#controlSample-choose-by-all" role="tab" aria-controls="choose-by-all" aria-selected="true">Choose sample(s)</a>
													</li>
													<li class="nav-item choose-tab">
														<a class="nav-link" id="controlSample-choose-by-search-tab" data-toggle="tab" href="#controlSample-choose-by-search" role="tab" aria-controls="choose-by-search" aria-selected="true">Choose sample(s) by search</a>
													</li>
													<li class="nav-item choose-tab">
														<a class="nav-link" id="controlSample-choose-by-tree-tab" data-toggle="tab" href="#controlSample-choose-by-tree" role="tab" aria-controls="choose-by-tree" aria-selected="false">Choose sample(s) by characteristics</a>
													</li>
												</ul>
												<div class="tab-content">
													<div class="tab-pane fade show active" id="controlSample-choose-by-all" role="tabpanel" aria-labelledby="controlSample-choose-by-all-tab">
														<div class="input-group input-group-sm border border-bottom-0 rounded px-4 pt-4 pb-1 sample-group-class study-group-class">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Study</label></div>
															<input id='text_control_study' type="text" class="form-control readb" placeholder="Ex) Colon_Adenocarcinoma(74)" aria-label="Colon_Adenocarcinoma" readonly>
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle control-study-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
														<div class="input-group input-group-sm border border-top-0 rounded px-4 pt-1 pb-4 sample-group-class sample-case-group-class">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Control</label></div>
															<input id='text_normal_sample' type="text" class="form-control" placeholder="Ex) Colon and CF7L2" aria-label="Colon and CF7L2">
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle normal-sample-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
													</div>
													<div class="tab-pane fade" id="controlSample-choose-by-search" role="tabpanel" aria-labelledby="controlSample-choose-by-search-tab">
														<div class="input-group input-group-sm border rounded p-4 sample-group-class sample-control-group-class">
															<div class='col-2'><label class="form-check-label" for="gencode_chk">Control</label></div>
															<input id='search_text_normal_sample' type="text" class="form-control" placeholder="Ex) Colon and CF7L2" aria-label="Colon and CF7L2">
															<div class="input-group-append">
																<button class="btn btn-outline-secondary dropdown-toggle normal-sample-combobox" type="button" aria-haspopup="true" aria-expanded="false"></button>
															</div>
														</div>
													</div>
													<div class="tab-pane fade" id="controlSample-choose-by-tree" role="tabpanel" aria-labelledby="controlSample-choose-by-tree-tab">
														<div class="border rounded p-4">
															<span>Characteristics tab contents</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div> -->
								
								<!-- CARD Area -->
								<div class='row w-100 mt-3'>
									<div class='col-lg-12 col-sm-12'>
									
										<div class="card h-100 mt-3">
											<div class="card-header text-left hic-menu">
												<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
												<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Choose a genetic locus</span>
											</div>
											<div class="card-body">
												<div class='row w-100'>
													<div class='by_gene_pane col-lg-6 col-sm-6'>
														<div class="card h-100">
															<div class="card-header text-left">By gene</div>
															<div class="card-body">
																<div class="input-group input-group-sm">
																	<div class="input-group-prepend">
																		<span class="input-group-text">Gene</span>
																	</div>
																	<input id="text_gene_symbol" type="text" class="form-control" placeholder="Ex) BCR" aria-label="BCR" aria-describedby="text_gene_symbol">
																</div>
															</div>
														</div>
													</div>
													<div class='by_genetic_locus_pane col-lg-6 col-sm-6'>
														<div class="card h-100">
															<div class="card-header text-left">By genomic locus</div>
															<div class="card-body">
																<div class="form-row ml-0 w-100">
																	<div class="dropdown text-right">
																		<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="comboChr" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">chr1</button>
																		<div class="dropdown-menu input-chromosome-list-group" aria-labelledby="comboChr">
																			<c:forEach var='chromosomes' items='${chromosomeList }'>
																				<a class="dropdown-item chr-dropdown-item">${chromosomes }</a>
																			</c:forEach>
																		</div>
																	</div>
					 												<div class="form-group ml-2">
																		<input type="text" class="form-control form-control-sm text_genomic_locus w-10" id="chromStart" aria-describedby="chromStart" placeholder="Ex) 23,179,704" style="max-width: 150px;">
																	</div>
																	<div class="form-group mx-2">-</div>
																	<div class="form-group">
																		<input type="text" class="form-control form-control-sm text_genomic_locus w-10" id="chromEnd" aria-describedby="chromEnd" placeholder="Ex) 23,318,037" style="max-width: 150px;">
																	</div>
																</div>															
															</div>
														</div>
													</div>
													
													
													<div class='by_file_panel col-lg-12 col-sm-12 mt-3'>
														<div class="card h-100">
															<div class="card-header text-left">By file</div>
															<div class="card-body">
																<div class='row pb-3'>
																	<div class='col-12 text-left'>
																		Example)<br>chr19:1-11064109;chr17:7,858,769-83257441<br>chr20:1-17070762;chr19:14867959-58617616<br>chr17:1-6643610;chr20:18560020-64444167
																	</div>
																</div>
																<div class='form-row'>
																	<div class='col-12 mb-1'>
																		<div class="input-group"> 
																			<textarea id='textarea_bed_format' name='textarea_bed_format' class="form-control" aria-label="With textarea"></textarea>
																		</div>
																	</div>
																	<div class='col-12 mb-1 text-left'>
																		<input type='file' name='inputFile' id='inputFile' accept="text|.txt"/>
																	</div>
																</div>
															</div>
														</div>
													</div>
													
													<div class='col-lg-12 col-sm-12 mt-3'>
														<div class='form-row text-center d-inline-block'>
															<button id='btn_add_region' class='btn btn-sm btn-primary'>Add region(s)</button>
				     										<button id='btn_del_region' class='btn btn-sm btn-secondary ml-2'>Remove region(s)</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<div class='row w-100 mt-3'>
									<div class='col-12 mt-3'>
										<div id="accordion">
											<div class="card">
												<div class="card-header text-left collapsed hic-menu" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne" style="cursor: pointer;">
													<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
													<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Options for display</span>
												</div>
												<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
													<div class="card-body">
														<div class='row row-cols-1 row-cols-md-3'>
															<div class="col mb-1">
																<div class="card bg-light">
																	<div class="card-header text-left">Extra tracks</div>
																	<div class="card-body">
																		<div class='form-row'>
																			<div class="form-check form-check-inline w-100">
																				<input type="checkbox" class="form-check-input" id="superenhancer_chk">
																				<label class="form-check-label" for="superenhancer_chk">Superenhancer</label>
																			</div>
																			<div class="form-check form-check-inline w-100">
																				<input type="checkbox" class="form-check-input" id="gencode_chk">
																				<label class="form-check-label" for="gencode_chk">GENCODE v34</label>
																			</div>
																			<div class="form-check form-check-inline w-100">
																				<input type="checkbox" class="form-check-input" id="refseq_chk">
																				<label class="form-check-label" for="refseq_chk">Refseq</label>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
															<div class="col mb-1">
																<div class="card bg-light">
																	<div class="card-header text-left">Contact map color palette</div>
																	<div class="card-body">
																		<div class='form-row'>
																			<div class='form-row'>
																				<div class="form-check form-check-inline w-100">
																					<input class="form-check-input" type="radio" name="ColorRradioOptions" id="ColorRradioOptions" value="WtoR" checked>
																					<label class="form-check-label" for="WtoRradioOptions">White To Red</label>
																				</div>
																				<div class="form-check form-check-inline w-100">
																					<input class="form-check-input" type="radio" name="ColorRradioOptions" id="ColorRradioOptions" value="BtoYtoR">
																					<label class="form-check-label" for="BtoRradioOptions">Blue To Yellow To Red</label>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>

															<div class="col mb-1">
																<div class='row w-100 ml-2'>
																	<div class='card bg-light w-100'>
																		<div class='card-header text-left'>Resolution</div>
																		<div class='card-body'>
																			<div class="dropdown text-left">
																				<div class="dropdown text-left">
																					<button class="btn btn-secondary btn-sm dropdown-toggle w-100" type="button" id="comboResolution" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">500Kb</button>
																					<div class="dropdown-menu input-resolution-list-group" aria-labelledby="comboResolution">
																						<a class="dropdown-item resolution-dropdown-item">40Kb</a>
																						<a class="dropdown-item resolution-dropdown-item">500Kb</a>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>

																<div class='row w-100 ml-2 mt-2'>								
																	<div class="card bg-light w-100">
																		<div class="card-header text-left">Boundary</div>
																		<div class="card-body">
																			<div class="dropdown text-left">
																				<button class="btn btn-secondary btn-sm dropdown-toggle w-100" type="button" id="comboBoundary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">0Kb</button>
																				<div class="dropdown-menu input-chromosome-list-group" aria-labelledby="comboBoundary">
																					<a class="dropdown-item boundary-dropdown-item">0Kb</a>
<!-- 																					<a class="dropdown-item boundary-dropdown-item">500Kb</a>
																					<a class="dropdown-item boundary-dropdown-item">1Mb</a> -->
																					<a class="dropdown-item boundary-dropdown-item">5Mb</a>
																					<a class="dropdown-item boundary-dropdown-item">10Mb</a>
																					<a class="dropdown-item boundary-dropdown-item">20Mb</a>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>

															</div>
														</div>
														<div class='row mt-3' id='option_gene'>
															<div class='col mb-1'>
																<div class="card bg-light">
																	<div class="card-header text-left">Genes</div>
																	<div class="card-body">
																		<textarea class='form-control' id='textarea_option_gene' placeholder='Enter gene.' style='height: 150px;' disabled></textarea>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
									
								<div class='row w-100 mt-3'>
									<div class='col-12'>
										<div class="card">
											<div class="card-header text-left hic-menu">
												<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
												<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Selected region(s)</span>
											</div>
											<div class="card-body">
												<div class='col-12 table-responsive'>
										     		<table id="chooseInfo" class="table table-sm table-bordered d-none">
										     			<thead class="thead-light">
															<tr>
																<th scope="col"><input id='chk_samples_all' type='checkbox'/></th>
<!-- 																<th class="d-none" scope="col">sample_table</th> -->
																<th class='font-weight-normal' scope="col">Sample</th>
																<th class='font-weight-normal' scope="col">Region</th>
																<th class='font-weight-normal' scope="col">Boundary</th>
															</tr>
														</thead>
														<tbody>
														</tbody>
													</table>
													
													<table id="chooseInfoPreCalled" class="table table-sm table-bordered">
										     			<thead class="thead-light">
															<tr>
																<th scope="col"><input id='chk_samples_all1' type='checkbox'/></th>
<!-- 																<th class="d-none" scope="col">sample1_table</th> -->
																<th class='font-weight-normal' scope="col">Case</th>
<!-- 																<th class="d-none" scope="col">sample2_table</th> -->
																<th class='font-weight-normal' scope="col">Control</th>
																<th class='font-weight-normal' scope="col">Region</th>
																<th class='font-weight-normal' scope="col">Boundary</th>
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
								
								<div class='row w-100 mt-3 text-center'>
									<div class='col-12 text-center' style='!important;'>
										<button id='btn_example_run' class='btn-success btn-sm border rounded mr-2'>Example Run</button>
										<!-- <button id='btn_example_test_run' class='btn-danger btn-sm border rounded mr-2'>Example Test Run</button> -->
					     				<button id='btn_run' class='btn-primary btn-sm border rounded'>Run</button>
					     			</div>
								</div>
							</div>
							<div class="tab-pane fade" id="userdefined-sv" role="tabpanel" aria-labelledby="userdefined-sv-tab">...</div>
							<div class="tab-pane fade" id="user-rearrangement" role="tabpanel" aria-labelledby="user-rearrangement-tab">...</div>
						</div>
					</div>
				</div>
	
	
	
	<%--      		<div class='col-12 border'>
	     			<div class='row mt-2'>
	     				<div class='col-12 font-weight-bold'>Choose sample(s)</div>
	     			</div>
	     			<div class='row mt-1'>
		     			<div class='col-12'>
		     				<div id="sliderdefault">
								<ul class='list-group'>
									<c:forEach var="sample" items="${sampleList}">
										<c:if test="${sample.id<4}">
											<li class='list-group-item'><input class='sample-choose-chk' type="checkbox" value="${sample.table_name}"/> ${sample.desc }</li>
										</c:if>
									</c:forEach>
								</ul>
							</div>
							<div id="sliderexpand">
								<ul>	
									<c:forEach var="sample" items="${sampleList}">
										<c:if test="${sample.id>=4}">
											<li class='list-group-item'><input class='sample-choose-chk' type="checkbox" value="${sample.table_name}"/> ${sample.desc }</li>
										</c:if>
									</c:forEach>
								</ul>
							</div>
		     			</div>
	     			</div>
	     			<div class='row mt-2'>
		     			<div class='col-12 font-weight-bold mt-1'>Choose interesting region(s)</div>
		     		</div>
		     		<div class='row mt-1'>
		     			<div class='col-3'>
		     				<ul class='list-group border' style='height:150px;overflow:auto;'>
		     					<c:forEach var='chromosomes' items='${chromosomeList }'>
		     						<li class='list-group-item list-group-item-action p-1 border-0 chromosome-li-item'>${chromosomes }</li>
		     					</c:forEach>
		     				</ul>
		     			</div>
		     			<div class='col-1 text-center align-middle  px-0 mx-0'>OR</div>
		     			<div class='col-8'>
		     				<div class='row'>
			     				<div class='col-8'>
		 	     					<div class='row mb-2'>
										<div class="input-group">
											<div class="input-group-prepend">
												<span class="input-group-text" id="basic-addon1">Gene name / SNP</span>
											</div>
											<input type="text" class="form-control" placeholder="BCR" aria-label="symbol" aria-describedby="basic-addon1">
										</div>
									</div>
			     					<div class='row mb-2'><div class='col-12 text-center'>OR</div></div>
			     					<div class='row'>
			     						<div class="input-group">
											<div class="input-group-prepend">
												<span class="input-group-text" id="basic-addon1">Genomic position</span>
											</div>
											<input type="text" class="form-control" placeholder="chr1:123,456,789" aria-label="locus" aria-describedby="basic-addon1">
										</div>
			     					</div>
			     				</div>
			     				<div class='col-4'>
									<div class="input-group">
										<div class="input-group-prepend text-truncate">
											<label class="input-group-text" for="sel_boundary">Boundary</label>
										</div>
										<select class="custom-select" id="sel_boundary">
											<option value='500000' selected>500Kb</option>
											<option value="1000000">1Mb</option>
											<option value="5000000">5Mb</option>
											<option value="10000000">10Mb</option>
											<option value="20000000">20Mb</option>
										</select>
									</div>
			     				</div>
			     			</div>
			     			<div class='row w-100 mt-3'>
			     				<div class='col-4'>
									<div class="form-group form-check">
										<input type="checkbox" class="form-check-input" id="gencode_chk" checked>
										<label class="form-check-label" for="gencode_chk">GENCODE v34</label>
									</div>
								</div>
								<div class='col-4'>
									<div class="form-group form-check">
										<input type="checkbox" class="form-check-input" id="refseq_chk">
										<label class="form-check-label" for="refseq_chk">Refseq</label>
									</div>
			     				</div>
			     				<div class='col-4'>
									<div class="form-group form-check">
										<input type="checkbox" class="form-check-input" id="superenhancer_chk" checked>
										<label class="form-check-label" for="superenhancer_chk">Superenhancer</label>
									</div>
			     				</div>
			     			</div>
		     			</div>
		     		</div>
		     		<div class='row mt-2'>
		     			<div class='col-12'>
			     			<button id='btn_add_sample' class='btn btn-sm btn-primary'>Add sample(s)</button>
			     			<button id='btn_del_sample' class='btn btn-sm btn-secondary ml-2'>Remove sample(s)</button>
			     		</div>
		     		</div>
	     			<div class='row mt-4'>
	     				<div class='col-12 font-weight-bold'>Selected item(s)</div>
	     			</div>
		     		<div class='row mt-1'>
		     			<div class='col-12 table-responsive'>
				     		<table id="chooseInfo" class="table table-sm border">
				     			<thead class="thead-dark">
									<tr>
										<th scope="col"><input id='chk_samples_all' type='checkbox'/></th>
										<th class="d-none" scope="col">sample_table</th>
										<th scope="col">Sample</th>
										<th scope="col">Region</th>
										<th scope="col">Boundary</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
		     		</div>
		     		
		     		<div class='row mt-2 mb-3'>
		     			<div class='col-12 text-center' style='!important;'>
		     				<form id='sendForm' method="post" action="cancerhicView">
		     					<input type='hidden' id='json_samples' name='json_samples'/>
		     					<input type='hidden' id='json_regions' name='json_regions' />
		     					<input type='hidden' id='type' name='type'/>
				     		</form>
							<button id='btn_example_run' class='btn btn-sm btn-primary'>Example Run</button>
				     		<button id='btn_run' class='btn btn-sm btn-secondary ml-2'>Run</button>
			     		</div>
		     		</div>
	     		</div> --%>
			</div>
		</section>
	</main>

<script>
	$(document).ready(function(){
		$(".nav-menu > ul > li").removeClass("active");
		$("#nav-cancerhic").addClass("active");
	})
</script>
<jsp:include page="../common/footer.jsp" flush="false"/>