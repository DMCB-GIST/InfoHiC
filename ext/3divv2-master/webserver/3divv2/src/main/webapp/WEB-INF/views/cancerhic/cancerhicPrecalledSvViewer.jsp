<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>

<script type="text/javascript" src="resources/js/util/utils.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/common.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/worker/procSvDataTypeWorker.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/precalled_tab/PrecalledClass.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/userdefine_tab/UserDefineClass.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/rearrange_tab/RearrangeGenomeClass.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/precalled_tab/precalledForm.js"></script>
<script type="text/javascript" src="resources/js/util/snappyjs.js"></script>
<script type="text/javascript" src="resources/js/util/base64.js"></script>
<script type="text/javascript" src="resources/js/util/exportFile.js"></script>
<script type="text/javascript" src="resources/js/hic/assets/FileSaver.js"></script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<section id="subhero" class="d-flex align-items-center">
		<div class="container position-relative">
			<div class="row justify-content-center">
				<div class="col-xl-7 col-lg-9 text-center">
					<h1>Cancer Hi-C</h1>
				</div>
			</div>
		</div>
	</section>

	<input type='hidden' id='json_samples' value='${json_samples }'/>
	<input type='hidden' id='json_regions' value='${json_regions }'/>
	<input type='hidden' id='json_extra_tracks' value='${json_extra_tracks }'/>
	<input type='hidden' id='json_option_gene' value='${json_option_gene }'/>
	<input type='hidden' id='color_palette' value='${color_palette }'/>
	<input type='hidden' id='resolution' value='${resolution }'/>
	<input type='hidden' id='type' value='${type }'/>
	<input type='hidden' id='chosen_sv_type' value='${chosen_sv_type }'/>

	<main id="main">
		<section id="contact" class="contact contactpage">
			<div class="container" data-aos="fade-up">
				<div class="card text-center ">
					<div class="card-header">
						<nav>
							<div class="nav nav-tabs card-header-tabs" id="nav-tab" role="tablist">
								<a class="nav-item nav-link cancerhic_tab active font-weight-bold" id="predefined-sv-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="predefined-sv" aria-selected="true">Pre-called SV and 3D genome</a>
								<a class="nav-item nav-link cancerhic_tab font-weight-bold" id="userdefined-sv-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="userdefined-sv" aria-selected="false">Interactive 3D genome manipulation</a>
								<a class="nav-item nav-link cancerhic_tab font-weight-bold" id="user-rearrangement-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="user-rearrangement" aria-selected="false">Complex SV and 3D genome</a>
							</div>
						</nav>
					</div>
					<div class="card-body">
						<div class='controller-panel row p-2 border rounded bg-light'>
							<div class='col py-1 m-auto'>
								<div class="btn-group">
									<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-in-x2"><i class='fa fa-search-plus'> X2</i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-in-x1 px-3"><i class='fa fa-search-plus'></i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-out-x1 px-3"><i class='fa fa-search-minus'></i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-out-x2"><i class='fa fa-search-minus'> X2</i></button>
								</div>

								<div class='btn-group ml-2'>
									<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-down-x2 bg-light"><i class='fa fa-angle-double-left'> X2</i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-down-x1 bg-light px-3"><i class='fa fa-angle-double-left'></i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-up-x1 bg-light px-3"><i class='fa fa-angle-double-right'></i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-up-x2 bg-light"><i class='fa fa-angle-double-right'> X2</i></button>
								</div>

								<button type='button' class='ml-2 btn btn-sm btn-outline-secondary refreshScreen bg-light'><i class="fa fa-refresh" aria-hidden="true"></i></button>
							</div>
						</div>
						<div class='row p-4'>
							<div class='col-12 viewer-frame accordion' id="accordionExample">
								<div class="card text-center">
									<div class="card-header" id="headingOne">
										<h2 class="mb-0">
											<button class="btn btn-link btn-block text-center p-0" id="simpleManualBtn" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
												Simple manual<i class="ml-2 fa fa-caret-square-o-up" aria-hidden="true"></i>
											</button>
										</h2>
									</div>
									
									<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
										<div class="card-body">
											<img class="w-100" src="resources/images/search_info_1.png">
										</div>
									</div>
								</div>
							</div>
						</div>
		 				<div class='row p-4'>
							<div class='col-12 viewer-frame'>
								<div class="card text-center ">
									<div class="card-header">
										<div class='row'>
											<div class='col-3 pt-3'>
												<button type="button" class="btn download-btn" id="normal-png-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>PNG</button>
												<button type="button" class="btn download-btn" id="normal-pdf-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>PDF</button>
												<button type="button" class="btn download-btn" id="normal-svg-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>SVG</button>
											</div>
											<div class='col-6 text-ceeter pt-3'>
												<h4><span class='badge'>Normal(control) contact map</span></h4>
											</div>
											<div class='col-3'>
												<label for="colourScaleRangeCls">Color scale</label>
												<div id="normalColorRangeSlider" class='colourScaleRangeCls'></div>
												<div class="colorScaleLegend">
													<div class="text-left"		id="normal_legendMin"></div>
													<div class="text-center"	id="normal_legendMiddle"></div>
													<div class="text-right"		id="normal_legendMax"></div>
												</div>
											</div>
										</div>
									</div>
									<div class='card-body contact-map-1'>
										<div class="row pb-3">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-light border'>Sample</span>
											</div>
											<div class="col-10">
												<span class='normal-badge-sample-label badge badge-pill'></span>
											</div>
										</div>
										<div class='row'>
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-primary'>Heatmap</span>
											</div>
											<div class="col-10">
												<canvas id='normalHiCcanvas' class='w-100'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-warning'>Chromosome (hg38)</span>
											</div>
											<div class="col-10">
												<canvas id='chromosomeNormalCanvas' class='w-100'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<i class="fa fa-info-circle fa-fw ruler-tooltip" aria-hidden="true" data-toggle="tooltip" title="Tooltip"></i><span class='badge badge-pill badge-secondary'>Ruler</span>
											</div>
											<div class="col-10">
												<canvas id='rullerNormalCanvas' class='w-100'></canvas>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
		 				<div class='row p-4'>
							<div class='col-12 viewer-frame'>
								<div class="card text-center ">
									<div class="card-header">
										<div class='row'>
											<div class='col-3 pt-3'>
												<button type="button" class="btn download-btn" id="tumor-png-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>PNG</button>
												<button type="button" class="btn download-btn" id="tumor-pdf-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>PDF</button>
												<button type="button" class="btn download-btn" id="tumor-svg-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>SVG</button>
											</div>
											<div class='col-6 text-ceeter pt-3'>
												<h4><span class='badge'>Tumor(case) contact map</span></h4>
											</div>
											<div class='col-3'>
												<label for="colourScaleRangeCls">Color scale</label>
												<div id="cancerOriginColorRangeSlider" class='colourScaleRangeCls'></div>
												<div class="colorScaleLegend">
													<div class="text-left"		id="cancerOrigin_legendMin"></div>
													<div class="text-center"	id="cancerOrigin_legendMiddle"></div>
													<div class="text-right"		id="cancerOrigin_legendMax"></div>
												</div>
											</div>
										</div>
									</div>
									<div class='card-body contact-map-2'>
										<div class="row pb-3">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-light border'>Sample</span>
											</div>
											<div class="col-10">
												<span class='tumor-badge-sample-label badge badge-pill'></span>
											</div>
										</div>
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-primary'>Heatmap</span>
											</div>
											<div class="col-10">
												<canvas id='cancerHiCoriginCanvas' class='w-100'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-warning'>Chromosome (hg38)</span>
											</div>
											<div class="col-10">
												<canvas id='chromosomeOriginCanvas' class='w-100'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<i class="fa fa-info-circle fa-fw ruler-tooltip" aria-hidden="true" data-toggle="tooltip" title="Tooltip"></i><span class='badge badge-pill badge-secondary'>Ruler</span>
											</div>
											<div class="col-10">
												<canvas id='rullerOriginCanvas' class='w-100'></canvas>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class='row p-4'>
							<div class='col-12 viewer-frame'>
								<div class="card text-center ">
									<div class="card-header">
										<div class='row'>
											<div class='col-3 pt-3'>
												<button type="button" class="btn download-btn" id="rearrange-png-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>PNG</button>
												<button type="button" class="btn download-btn" id="rearrange-pdf-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>PDF</button>
												<button type="button" class="btn download-btn" id="rearrange-svg-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>SVG</button>
											</div>
											<div class='col-6 text-ceeter pt-3'>
												<h4><span class='badge'>Tumor rearranged contact map</span></h4>
											</div>
											<div class='col-3'>
												<label for="colourScaleRangeCls">Color scale</label>
												<div id="cancerColorRangeSlider" class='colourScaleRangeCls'></div>
												<div class="colorScaleLegend">
													<div class="text-left"		id="cancer_legendMin"></div>
													<div class="text-center"	id="cancer_legendMiddle"></div>
													<div class="text-right"		id="cancer_legendMax"></div>
												</div>
											</div>
										</div>
									</div>
									<div class='card-body  contact-map-3'>
										<div class="row pb-3">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-light border'>Sample</span>
											</div>
											<div class="col-10">
												<span class='rearrange-badge-sample-label badge badge-pill'></span>
											</div>
										</div>
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-primary'>Heatmap</span>
											</div>
											<div class="col-10">
												<canvas id='cancerHiCcanvas' class='w-100'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-warning'>Chromosome (hg38)</span>
											</div>
											<div class="col-10">
												<canvas id='chromosomeCanvas' class='w-100'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<i class="fa fa-info-circle fa-fw ruler-tooltip" aria-hidden="true" data-toggle="tooltip" title="Tooltip"></i><span class='badge badge-pill badge-secondary'>Ruler</span>
											</div>
											<div class="col-10">
												<canvas id='rullerCanvas' class='w-100'></canvas>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class='row p-4'>
							<div class='col-12'>
								<div class="card">
									<h5 class="card-header">Pre-called Structural Variations</h5>
									<div class="card-body">
										<div class='col-12 table-responsive'>
								     		<table id="precalled_sv_table" class="table table-sm table-striped table-bordered table-hover">
								     			<thead class="thead-light">
													<tr>
														<th class='font-weight-normal' scope="col">Sample</th>
														<th class='font-weight-normal' scope="col">Chrom1</th>
														<th class='font-weight-normal' scope="col">Breakpoint1</th>
														<th class='font-weight-normal' scope="col">Chrom2</th>
														<th class='font-weight-normal' scope="col">Breakpoint2</th>
														<th class='font-weight-normal' scope="col">SV type</th>
<!-- 														<th class='font-weight-normal' scope="col">cluster</th> -->
														<th class='font-weight-normal' scope="col">Orientation</th>
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
					</div>
				</div>
			</div>
		</section>
	</main>


<!-- START : 2020 SEP 22 Flex controller panel Added by insoo078 -->
	<div class='flex-controller-panel container rounded shadow bg-light position-absolute d-none zindex-tooltip' style='top:110px;left:30px;width:360px;'>
		<div id='flex-controller-panel-title' class='row py-1 justify-content-center bg-dark text-white rounded-top'>
				<div class='col-10 text-center card-text'>Controller</div>
				<div class='col-2'>
					<button class="btn btn-block text-center p-0" id='flex_controller_btn' type="button" data-toggle="collapse" data-target="#collapseControllerBody" aria-expanded="true" aria-controls="collapseControllerBody">
						<i class='fa fa-toggle-up text-white' aria-hidden='true'></i>
					</button>
				</div>
		</div>
		<div id='collapseControllerBody' class='row collapse show p-2' aria-labelledby="headingOne" data-parent=".flex-controller-panel">
			<div class='col'>
				<div class='row'>
					<div class='col-3 py-1 text-right'>Zoom</div>
					<div class='col-9 py-1'>
						<div class="btn-group">
							<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-in-x2" style='width:55px;'><i class='fa fa-search-plus'> X2</i></button>
							<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-in-x1" style='width:55px;'><i class='fa fa-search-plus'></i></button>
							<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-out-x1" style='width:55px;'><i class='fa fa-search-minus'></i></button>
							<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-out-x2" style='width:55px;'><i class='fa fa-search-minus'> X2</i></button>
						</div>
					</div>
				</div>
				<div class='row mt-1'>
					<div class='col-3 py-1 text-right'>Move</div>
					<div class='col-9 py-1'>
						<div class='btn-group'>
							<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-down-x2 bg-light" style='width:55px;'><i class='fa fa-angle-double-left'> X2</i></button>
							<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-down-x1 bg-light" style='width:55px;'><i class='fa fa-angle-double-left'></i></button>
							<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-up-x1 bg-light" style='width:55px;'><i class='fa fa-angle-double-right'></i></button>
							<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-up-x2 bg-light" style='width:55px;'><i class='fa fa-angle-double-right'> X2</i></button>
						</div>
					</div>
				</div>
				<div class='row mt-1'>
					<div class='col-3 py-1 text-right'>Refresh</div>
					<div class='col-9 py-1'>
						<button type='button' class='btn btn-sm btn-outline-secondary refreshScreen bg-light' style='width:55px;'><i class="fa fa-refresh" aria-hidden="true"></i></button>
					</div>
				</div>
			</div>
		</div>
	</div>
<!-- END : 2020 SEP 22 Flex controller panel Added by insoo078 -->

	<div id="scaleTooltip" class="d-none"></div>
	<div class="ColorRangeSliderTooltip d-none"></div>
<script>
	$(document).ready(function(){
		$(".nav-menu > ul > li").removeClass("active");
		$("#nav-cancerhic").addClass("active");
	})
</script>
<jsp:include page="../common/footer.jsp" flush="false"/>