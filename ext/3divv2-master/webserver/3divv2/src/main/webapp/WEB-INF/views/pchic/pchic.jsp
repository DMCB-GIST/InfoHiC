<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>

<script type="text/javascript" src="./resources/js/util.js"></script>
<script type="text/javascript" src="./resources/js/capturehic/capture.js"></script>
<script type="text/javascript" src="./resources/js/capturehic/arcViewer_controller.js"></script>
<script type="text/javascript" src="./resources/js/capturehic/arcViewer.js"></script>
<script type="text/javascript" src="./resources/js/capturehic/geneViewer.js"></script>
<script type="text/javascript" src="./resources/js/capturehic/gencodeViewer.js"></script>
<script type="text/javascript" src="./resources/js/util/exportFile.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>

<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.1/bootstrap3-typeahead.min.js"></script>

<style>
	
</style>
  
	<section id="subhero" class="d-flex align-items-center">
		<div class="container position-relative">
			<div class="row justify-content-center">
				<div class="col-xl-7 col-lg-9 text-center">
					<h1>Capture Hi-C</h1>
				</div>
			</div>
		</div>
	</section>
  
	<main id="main">
		<section id="hic" class="hic contactpage">
			<!-- Modal -->
			<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h6 class="modal-title" id="exampleModalLabel">Find genomic location from Gene Symbol</h6>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						
						<div class="modal-body"></div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			
     		<div class="container" data-aos="fade-up">
				<div class="card text-center ">
					<div class="card-header"></div>
					<div class="card-body">
						<div class='row mb-3'>
							<div class='col-lg-12 col-sm-12'>
								<div class="card">
									<div class="card-header text-left hic-menu">
										<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
										<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Choose Sample(s)</span>
									</div>
									<div class="card-body">
										<div class="border rounded px-3 overflow-auto" style="height:200px;">
											<div class="text-left" id="sliderdefault">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div class='row mb-3'>
							<div class='col-lg-6 col-sm-12'>
								<div class="card">
									<div class="card-header text-left hic-menu">
										<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
										<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Input Bait</span>
									</div>
									
									<div class="card-body">
										<div class="input-group input-group-sm">
											<div class="input-group-prepend">
												<span class="input-group-text" id="basic-addon1">Bait : </span>
											</div>
											<input type="text" class="form-control typeahead" id="input_bait" aria-describedby="basic-addon1" autocomplete="off" data-provide="typeahead" />
										</div>
									</div>
								</div>
							</div>
							<div class='col-lg-6 col-sm-12'>
								<div class="card">
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
												<option value='1000000' selected>1Mb</option>
												<option value='2000000'>2Mb</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div class='row mb-3'>
							<div class='col-lg-12 col-sm-12'>
								<div class="card">
									<div class="card-header text-left hic-menu">
										<i class="bx bx-chevron-right pr-1" style="color:#2487ce; font-size:16px;"></i>
										<span class="d-inline-block" style="color:#124265; font-size:1.15rem; font-weight:bold;">Items selected</span>
										
										<button id="hidden-btn" class="hidden" data-toggle="modal" data-target="#exampleModal" style="display: none;"></button>
										
										<button class="btn-sm-sm btn-primary border rounded" id='add_samples' type="button">
											<i class="fa fa-plus-circle" aria-hidden="true"></i>
										</button>
										<button class="btn-sm-sm btn-secondary button border rounded" id='remove_samples'>
											<i class="fa fa-minus-circle" aria-hidden="true"></i>
										</button>
									</div>
									<div class="card-body">
										<table class="table table-sm table-hover table-bordered" id="chooseInfo">
											<thead class="thead-light">
												<tr>
													<td class="text-center bg-light font-weight-bold" scope="col" style="width:50px;">
														<input type='checkbox' id='chk_samples_all' />
													</td>
													<td class="text-center bg-light font-weight-bold d-none" scope="col">No.</td>
													<td class="text-center bg-light font-weight-bold" scope="col" style="width:450px;">Sample</td>
													<td class="text-center bg-light font-weight-bold" scope="col" style="width:450px;">Bait</td>
												</tr>
											</thead>
											<tbody></tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						
						<div class="row text-center d-block">
							<button type="button" class="btn-success btn-sm border rounded mr-2" id="example_run">Example Run</button>
							<button type="button" class="btn-primary btn-sm border rounded" id="btn_run" onclick="this.disable=true">Run</button>
						</div>
						
						<div class='row mt-5'>
							<div class='col-12 pl-3 pr-3'>
								<div class='border rounded bg-light'>
									<div class='row py-2 mt-2'>
										<div class='viewer-controller text-center d-block w-100'>
											<div class="row mx-0 mb-3">
												<div class="col-12 w-100">
													<span class='mr-1  mt-1'>Zoom in</span>
													<button class='zoomin_15 btn btn-sm btn-secondary mr-1 mt-1'>1.5X</button>
													<button class='zoomin_30 btn btn-sm btn-secondary mt-1'>3X</button>
													<span class='mr-1 ml-3  mt-1'>Zoom out</span>
													<button class='zoomout_15 btn btn-sm btn-secondary mr-1 mt-1'>1.5X</button>
													<button class='zoomout_30 btn btn-sm btn-secondary mr-1 mt-1'>3X</button>
													<button class='fit2Scrn btn btn-sm btn-secondary ml-3 mt-1'>Fit2Screen</button>
													<button class='btn-svg-download btn btn-sm btn-secondary ml-5 mt-1'><i class="fa fa-download pr-1" aria-hidden="true"></i>SVG</button>
												</div>
											</div>

											<div class="row mx-0 d-flex justify-content-center">
												<div class="mt-4 mb-2 mr-4 w-25">
													<div class="input-group input-group-sm mb-2">
														<div class="input-group-prepend">
															<label class="input-group-text" for="sel_val">Interaction peak</label>
														</div>
														
														<select class="custom-select bg-light" id="sel_val">
															<option selected>Normalized count</option>
															<option>Raw count</option>
														</select>
													</div>
													
													<div class="form-check">
														<input class="form-check-input" type="checkbox" value="" id="chk_po_display" checked>
														<label class="form-check-label" for="chk_po_display">Display P/O interaction</label>
													</div>
												</div>
												<div class="row mx-0 my-0 form-group d-block">
													<label for="formControlRange">-log10(P-value)</label>
													
													<div class="d-flex text-center">
														<span class="mr-2">0</span>
														<input type="range" class="form-control-range" id="pvalueRange" min='0' max='10' value='2' step='1'>
														<span class="ml-2">10</span>
													</div>
													
													<div class="input-group mt-2">
														<div class="col text-right px-0">
															<a class="btn btn-outline-primary btn-sm w-10 mr-1 text-center cursor-pointer" id="pvalue_dec" role="button">-</a>
														</div>
														
														<div class="col-8 px-0">
															<input type="text" class="form-control form-control-sm text-center" id="txt_pvalue" value='2' name="txt_pvalue" readonly >
														</div>
														
														<div class="col text-left px-0">
															<a class="btn btn-outline-primary btn-sm w-10 ml-1 text-center cursor-pointer" id="pvalue_inc" role="button">+</a>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class='row'>
										<div id='canvas-frame' class='canvas-frame col-12 py-3'></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
		
				<!-- <div class="row mb-3">
					<div class="col">
						<h6>Choose Sample(s)</h6>
						
						<div class="border rounded px-3 overflow-auto" style="height:300px;">
							<div id="sliderdefault">
							</div>
						</div>
					</div>
					
					<div class="col">
						<div class="row mb-3">
							<div class="col-8">
								<h6>Input Bait</h6>
								
								<div class="input-group input-group-sm">
									<div class="input-group-prepend">
										<span class="input-group-text" id="basic-addon1">Bait : </span>
									</div>
									<input type="text" class="form-control typeahead" id="input_bait" aria-describedby="basic-addon1" autocomplete="off" data-provide="typeahead" />
								</div>
							</div>
							
							<div class="col">
								<h6>Interaction range</h6>
								
								<select class="form-control form-control-sm" id='boundary_range' onChange="getSelectText();">
									<option value='50000'>50Kb</option>
									<option value='100000'>100Kb</option>
									<option value='500000'>500Kb</option>
									<option value='1000000' selected>1Mb</option>
									<option value='2000000'>2Mb</option>
								</select>
							</div>
						</div>
						
						<div class="row mb-3">
							<div class="col">
								<div class="row">
									<div class="col-3">
										<h6>Items selected</h6>
									</div>
									
									<div class="col">
										<button id="hidden-btn" class="hidden" data-toggle="modal" data-target="#exampleModal" style="display: none;"></button>
										
										<button class="btn-sm-sm btn-primary border rounded" id='add_samples' type="button">
											<i class="material-icons md-18 align-text-top" style="font-size:18px;">add_circle_outline</i>
											<i class="fa fa-plus-circle" aria-hidden="true"></i>
										</button>
										<button class="btn-sm-sm btn-secondary button border rounded" id='remove_samples'>
											<i class="material-icons md-18 align-text-top" style="font-size:18px;">remove_circle_outline</i>
											<i class="fa fa-minus-circle" aria-hidden="true"></i>
										</button>
									</div>
								</div>
		
								<table class="table table-sm table-hover table-bordered" id="chooseInfo">
									<thead class="thead-light">
										<tr>
											<td class="text-center bg-light font-weight-bold" scope="col" style="width:50px;">
												<input type='checkbox' id='chk_samples_all' />
											</td>
											<td class="text-center bg-light font-weight-bold d-none" scope="col">No.</td>
											<td class="text-center bg-light font-weight-bold" scope="col" style="width:450px;">Sample</td>
											<td class="text-center bg-light font-weight-bold" scope="col" style="width:450px;">Bait</td>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				
				<div class="row text-center d-block">
					<button type="button" class="btn-success btn-sm border rounded mr-2" id="example_run">Example</button>
					<button type="button" class="btn-primary btn-sm border rounded" id="btn_run" onclick="this.disable=true">Run</button>
				</div>
		
				<div class='row mt-5'>
					<div class='col-12 pl-3 pr-3'>
						<div class='border rounded bg-light'>
							<div class='row py-2 mt-2'>
								<div class='viewer-controller text-center d-block w-100'>
									<div class="row mx-0 mb-3">
										<div class="col-12 w-100">
											<span class='mr-1  mt-1'>Zoom in</span>
											<button class='zoomin_15 btn btn-sm btn-secondary mr-1 mt-1'>1.5X</button>
											<button class='zoomin_30 btn btn-sm btn-secondary mt-1'>3X</button>
											<span class='mr-1 ml-3  mt-1'>Zoom out</span>
											<button class='zoomout_15 btn btn-sm btn-secondary mr-1 mt-1'>1.5X</button>
											<button class='zoomout_30 btn btn-sm btn-secondary mr-1 mt-1'>3X</button>
											<button class='fit2Scrn btn btn-sm btn-secondary ml-3 mt-1'>Fit2Screen</button>
										</div>
									</div>
									
									<div class="row mx-0 d-flex justify-content-center">
										<div class="mt-4 mb-2 mr-4 w-25">
											<div class="input-group input-group-sm mb-2">
												<div class="input-group-prepend">
													<label class="input-group-text" for="sel_val">Interaction peak</label>
												</div>
												
												<select class="custom-select bg-light" id="sel_val">
													<option selected>Normalized count</option>
													<option>Raw count</option>
												</select>
											</div>
											
											<div class="form-check">
												<input class="form-check-input" type="checkbox" value="" id="chk_po_display" checked>
												<label class="form-check-label" for="chk_po_display">Display P/O interaction</label>
											</div>
										</div>
										<div class="row mx-0 my-0 form-group d-block">
											<label for="formControlRange">-log10(P-value)</label>
											
											<div class="d-flex text-center">
												<span class="mr-2">0</span>
												<input type="range" class="form-control-range" id="pvalueRange" min='0' max='350' value='2' step='1'>
												<span class="ml-2">350</span>
											</div>
											
											<div class="input-group mt-2">
												<div class="col text-right px-0">
													<a class="btn btn-outline-primary btn-sm w-10 mr-1 text-center cursor-pointer" id="pvalue_dec" role="button">-</a>
												</div>
												
												<div class="col-8 px-0">
													<input type="text" class="form-control form-control-sm text-center" id="txt_pvalue" value='2' name="txt_pvalue" readonly >
												</div>
												
												<div class="col text-left px-0">
													<a class="btn btn-outline-primary btn-sm w-10 ml-1 text-center cursor-pointer" id="pvalue_inc" role="button">+</a>
												</div>
											</div>
										</div>
			
									</div>
								</div>
							</div>
							<div class='row'>
								<div id='canvas-frame' class='canvas-frame col-12 py-3'></div>
							</div>
						</div>
					</div>
				</div> -->
			</div>
		</section>
	</main>


<div role="alert" aria-live="assertive" aria-atomic="true" class="ArcInfoDialog border rounded position-absolute invisible" data-autohide="false">
	<div class="toast-header">
		<strong class="mr-auto">Contact information</strong>
		<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<div class="toast-body bg-white">
		<table id='target-gene-list' class='table table-striped table-bordered table-sm text-center'>
			<colgroup>
				<col style="width:10%">
				<col style="width:15%">
				<col style="width:10%">
				<col style="width:10%">
				<col style="width:15%">
				<col style="width:20%">
				<col style="width:20%">
			</colgroup>
			<thead class='thead-light'>
				<tr>
					<th scope="col">No</th>
					<th scope="col">Chromosome</th>
					<th scope="col">Start</th>
					<th scope="col">End</th>
					<th scope="col">Gene name</th>
					<th scope="col">Locus</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table> 
	</div>
</div>

<script>
	$(document).ready(function(){
		$(".nav-menu > ul > li").removeClass("active");
		$("#nav-capturehic").addClass("active");
	})
</script>
<jsp:include page="../common/footer.jsp" flush="false"/>