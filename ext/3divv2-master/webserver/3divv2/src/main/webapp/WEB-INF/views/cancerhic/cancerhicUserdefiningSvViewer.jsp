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
<script type="text/javascript" src="resources/js/cancerhic/userdefine_tab/userdefineForm.js"></script>
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

	<main id="main">
		<section id="contact" class="contact contactpage">
			<div class="container" data-aos="fade-up">
				<div class="card text-center ">
					<div class="card-header">
						<nav>
							<div class="nav nav-tabs card-header-tabs" id="nav-tab" role="tablist">
								<a class="nav-item nav-link cancerhic_tab font-weight-bold" id="predefined-sv-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="predefined-sv" aria-selected="true">Pre-called SV and 3D genome</a>
								<a class="nav-item nav-link cancerhic_tab active font-weight-bold" id="userdefined-sv-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="userdefined-sv" aria-selected="false">Interactive 3D genome manipulation</a>
								<a class="nav-item nav-link cancerhic_tab font-weight-bold" id="user-rearrangement-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="user-rearrangement" aria-selected="false">Complex SV and 3D genome</a>
							</div>
						</nav>
					</div>
					<div class="card-body">
						<div class='row p-2 border rounded bg-light'>
							<div class='col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12 py-1 m-auto'>
								<div class="btn-group btn-group-toggle" data-toggle="buttons">
									<label class="btn btn-sm btn-secondary"><i class='fa fa-gear'></i>
										<input type="radio" name="svOptions" id="svOptions" checked value='DEL'>DEL
									</label>
									<label class="btn btn-sm btn-secondary"><i class='fa fa-gear'></i>
										<input type="radio" name="svOptions" id="svOptions" value='INV'> INV
									</label>
									<label class="btn btn-sm btn-secondary"><i class='fa fa-gear'></i>
										<input type="radio" name="svOptions" id="svOptions" value='TRA'>TRA
									</label>
									<label class="btn btn-sm btn-secondary"><i class='fa fa-gear'></i>
										<input type="radio" name="svOptions" id="svOptions" value='DUP'>TanDUP
									</label>
		 							<label class="btn btn-sm btn-secondary"><i class='fa fa-gear'></i>
										<input type="radio" name="svOptions" id="svOptions" value='INVDUP'>InvDUP
									</label>
								</div>
								<button type='button' class='btn btn-sm btn-outline-secondary refreshScreen bg-light'><i class="fa fa-refresh" aria-hidden="true"></i></button>
							</div>
							<div class='col py-1 m-auto'>
								<div class="btn-group">
									<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-in-x2"><i class='fa fa-search-plus'> X2</i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-in-x1 px-3"><i class='fa fa-search-plus'></i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-out-x1 px-3"><i class='fa fa-search-minus'></i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary bg-light btn-zoom btn-zoom-out-x2"><i class='fa fa-search-minus'> X2</i></button>
								</div>
								<div class='btn-group ml-1'>
									<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-down-x2 bg-light"><i class='fa fa-angle-double-left'> X2</i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-down-x1 bg-light px-3"><i class='fa fa-angle-double-left'></i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-up-x1 bg-light px-3"><i class='fa fa-angle-double-right'></i></button>
									<button type="button" class="btn btn-sm btn-outline-secondary btn-pan btn-pan-up-x2 bg-light"><i class='fa fa-angle-double-right'> X2</i></button>
								</div>
								<div class='btn-group ml-1'>
									<button type="button" class="btnUndo historyBtn btn btn-sm btn-outline-secondary bg-light disabled" data-toggle="tooltip" data-placement="top" title="Undo"><i class='fa fa-mail-reply'></i></button>
									<button type="button" class="btnRedo historyBtn btn btn-sm btn-outline-secondary bg-light disabled" data-toggle="tooltip" data-placement="top" title="Redo"><i class='fa fa-mail-forward'></i></button>
								</div>
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
											<img class="w-100 simple-manual-image" src="resources/images/sv_del.png">
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
												<h4><span class='badge noselect'>Rearranged contact map</span></h4>
											</div>
											<div class='col-3'>
												<label for="colourScaleRangeCls" class='noselect'>Color scale</label>
												<div id="cancerColorRangeSlider" class='colourScaleRangeCls'></div>
												<div class="colorScaleLegend">
													<div class="text-left noselect"		id="cancer_legendMin"></div>
													<div class="text-center noselect"	id="cancer_legendMiddle"></div>
													<div class="text-right noselect"	id="cancer_legendMax"></div>
												</div>
											</div>
										</div>
									</div>
									<div class='card-body contact-map-3'>
										<%-- <div class='w-100 rearrange-contact-map-card-body'>
											<canvas id='cancerHiCcanvas'>
											</canvas>
	 										<canvas id='cancerHiCLayercanvas' style='z-index:99999!default;'>
											</canvas>
										</div>
										<div class='w-100 rearrange-contact-map-chromosome-card-body'>
											<canvas id='chromosomeCanvas'>
											</canvas>
										</div>
										<div class='w-100 rearrange-contact-map-ruller-card-body'>
											<canvas id='rullerCanvas'>
											</canvas>
										</div> --%>
										<div class="row pb-3">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-light border noselect'>Sample</span>
											</div>
											<div class="col-10">
												<span class='rearrange-badge-sample-label badge badge-pill noselect'></span>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-primary noselect'>Heatmap</span>
											</div>
											<div class="col-10 w-100 rearrange-contact-map-card-body">
												<canvas id='cancerHiCcanvas'></canvas>
												<canvas id='cancerHiCLayercanvas' style='z-index:99999!default;'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-warning noselect'>Chromosome (hg38)</span>
											</div>
											<div class="col-10 w-100 rearrange-contact-map-chromosome-card-body">
												<canvas id='chromosomeCanvas'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<i class="fa fa-info-circle fa-fw ruler-tooltip" aria-hidden="true" data-toggle="tooltip" title="Tooltip"></i><span class='badge badge-pill badge-secondary noselect'>Ruler</span>
											</div>
											<div class="col-10 w-100 rearrange-contact-map-ruller-card-body">
												<canvas id='rullerCanvas' class='rulerCanvasClass'></canvas>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class='row p-4'>
							<div class='col-12 viewer-frame'>
								<div class="card text-center">
									<div class="card-header">
										<div class='row'>
											<div class='col-3 pt-3'>
												<button type="button" class="btn download-btn" id="raw-png-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>PNG</button>
												<button type="button" class="btn download-btn" id="raw-pdf-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>PDF</button>
												<button type="button" class="btn download-btn" id="raw-svg-btn"><i class="fa fa-download pr-1" aria-hidden="true"></i>SVG</button>
											</div>
											<div class='col-6 text-ceeter pt-3'>
												<h4><span class='badge noselect'>Raw contact map</span></h4>
											</div>
											<div class='col-3'>
												<label for="colourScaleRangeCls" class='noselect'>Color scale</label>
												<div id="cancerOriginColorRangeSlider" class='colourScaleRangeCls'></div>
												<div class="colorScaleLegend">
													<div class="text-left noselect"		id="cancerOrigin_legendMin"></div>
													<div class="text-center noselect"	id="cancerOrigin_legendMiddle"></div>
													<div class="text-right noselect"		id="cancerOrigin_legendMax"></div>
												</div>
											</div>
										</div>
									</div>
									<div class='card-body contact-map-2'>
										<%-- <canvas id='cancerHiCoriginCanvas' class='w-100'>
										</canvas>
										<canvas id='chromosomeOriginCanvas' class='w-100'>
										</canvas>
										<canvas id='rullerOriginCanvas' class='w-100'>
										</canvas> --%>
										<div class="row pb-3">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-light border noselect'>Sample</span>
											</div>
											<div class="col-10">
												<span class='tumor-badge-sample-label badge badge-pill noselect'></span>
											</div>
										</div>
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-primary noselect'>Heatmap</span>
											</div>
											<div class="col-10">
												<canvas id='cancerHiCoriginCanvas' class='w-100'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<span class='badge badge-pill badge-warning noselect'>Chromosome (hg38)</span>
											</div>
											<div class="col-10">
												<canvas id='chromosomeOriginCanvas' class='w-100'></canvas>
											</div>
										</div>
										
										<div class="row">
											<div class="col-2 m-auto text-right">
												<i class="fa fa-info-circle fa-fw ruler-tooltip" aria-hidden="true" data-toggle="tooltip" title="Tooltip"></i><span class='badge badge-pill badge-secondary noselect'>Ruler</span>
											</div>
											<div class="col-10">
												<canvas id='rullerOriginCanvas' class='rulerCanvasClass w-100'></canvas>
											</div>
										</div>
										
<!-- 										<div class="row">
											<div class="col-12 pr-0 border-0" style='overflow:hidden;overflow-x:hidden !important;'>
												<iframe id='ucscFrame' class='w-100' style='position:relative;top:-140px;height:600px;'>
												</iframe>
											</div>
										</div> -->
										
										
										
										
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
				<div class='col-10 text-center card-text noselect'>Controller</div>
				<div class='col-2'>
					<button class="btn btn-block text-center p-0" id='flex_controller_btn' type="button" data-toggle="collapse" data-target="#collapseControllerBody" aria-expanded="true" aria-controls="collapseControllerBody">
						<i class='fa fa-toggle-up text-white' aria-hidden='true'></i>
					</button>
				</div>
		</div>
		<div id='collapseControllerBody' class='row collapse show p-2' aria-labelledby="headingOne" data-parent=".flex-controller-panel">
			<div class='col'>
				<div class='row'>
					<div class='col-3 py-1 text-right my-auto noselect'>SV types</div>
					<div class='col-9 py-1'>
						<div class="btn-group btn-group-toggle" data-toggle="buttons">
							<label class="btn btn-sm btn-secondary" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="svOptions" id="svOptions" checked value='DEL'>DEL
							</label>
							<label class="btn btn-sm btn-secondary ml-1" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="svOptions" id="svOptions" value='INV'> INV
							</label>
							<label class="btn btn-sm btn-secondary ml-1" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="svOptions" id="svOptions" value='TRA'>TRA
							</label>
						</div>
						<div class='btn-group btn-group-toggle mt-1' data-toggle='buttons'>
							<label class="btn btn-sm btn-secondary" style='width:106px;'><i class='fa fa-gear'></i>
								<input type="radio" name="svOptions" id="svOptions" value='DUP'>TanDUP
							</label>
 							<label class="btn btn-sm btn-secondary ml-1" style='width:106px;'><i class='fa fa-gear'></i>
								<input type="radio" name="svOptions" id="svOptions" value='INVDUP'>InvDUP
							</label>
						</div>
					</div>
				</div>
				<div class='row mt-1'>
					<div class='col-3 py-1 text-right noselect'>Zoom</div>
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
					<div class='col-3 py-1 text-right noselect'>Move</div>
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
					<div class='col-3 py-1 text-right noselect'>Un/Redo</div>
					<div class='col-3 py-1'>
						<div class='btn-group'>
							<button type="button" class="btnUndo historyBtn btn btn-sm btn-outline-secondary bg-light disabled" data-toggle="tooltip" data-placement="top" title="Undo" style='width:35px;'><i class='fa fa-mail-reply'></i></button>
							<button type="button" class="btnRedo historyBtn btn btn-sm btn-outline-secondary bg-light disabled" data-toggle="tooltip" data-placement="top" title="Redo" style='width:35px;'><i class='fa fa-mail-forward'></i></button>
						</div>
					</div>
					<div class='col-3 py-1 px-0 text-right noselect'>Refresh</div>
					<div class='col-3 py-1'>
						<button type='button' class='btn btn-sm btn-outline-secondary refreshScreen bg-light' style='width:45px;'><i class="fa fa-refresh" aria-hidden="true"></i></button>
					</div>
				</div><!-- 
				<div class='row mt-1'>
					<div class='col-3 py-1 text-right'>Refresh</div>
					<div class='col-9 py-1'>
						<button type='button' class='btn btn-sm btn-outline-secondary refreshScreen bg-light' style='width:55px;'><i class="fa fa-refresh" aria-hidden="true"></i></button>
					</div>
				</div> -->
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