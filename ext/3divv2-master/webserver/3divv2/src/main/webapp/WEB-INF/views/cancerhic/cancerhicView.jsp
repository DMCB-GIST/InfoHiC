<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>

<script type="text/javascript" src="resources/js/util/utils.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/cancerhicView.js"></script>
<script type="text/javascript" src="resources/js/cancerhic/viewerController.js"></script>
<script type="text/javascript" src="resources/js/util/lz-string.js"></script>
  
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
		<section id="contact" class="contact contactpage">
			<div class="container" data-aos="fade-up">
				<div class="card text-center ">
					<div class="card-header">
						<nav>
							<div class="nav nav-tabs card-header-tabs" id="nav-tab" role="tablist">
								<a class="nav-item nav-link cancerhic_tab active font-weight-bold" id="predefined-sv-tab" data-toggle="tab" href="#predefined-sv" role="tab" aria-controls="predefined-sv" aria-selected="true">Pre-called SV and 3D genome</a>
								<a class="nav-item nav-link cancerhic_tab font-weight-bold" id="userdefined-sv-tab" data-toggle="tab" href="#userdefined-sv" role="tab" aria-controls="userdefined-sv" aria-selected="false">User defined 3D genome manipulation</a>
								<a class="nav-item nav-link cancerhic_tab font-weight-bold" id="user-rearrangement-tab" data-toggle="tab" href="#user-rearrangement" role="tab" aria-controls="user-rearrangement" aria-selected="false">Complex SV and 3D genome</a>
							</div>
						</nav>
					</div>
					<div class="card-body">
						<div class="tab-content p-2" id="myTabContent"></div>
						<div class="tab-pane fade" id="userdefined-sv" role="tabpanel" aria-labelledby="userdefined-sv-tab">...</div>
						<div class="tab-pane fade" id="user-rearrangement" role="tabpanel" aria-labelledby="user-rearrangement-tab">...</div>
					</div>
				</div>
			
			
				<div class='row p-4 border rounded'>
					<div class='row w-100'>
						<div class='col-6'>
								<input type='hidden' id='json_samples' value='${json_samples }'/>
								<input type='hidden' id='json_regions' value='${json_regions }'/>
								<input type='hidden' id='type' value='${type }'/>
							<div class="input-group">
								<div class="input-group-prepend text-truncate">
									<label class="input-group-text" for="inputGroupSelect01">Actions</label>
								</div>
								<select class="custom-select " id="inputSvType">
									<option value="inv">Inversion</option>
									<option value="del">Deletion</option>
									<option value="trl">Translocation</option>
									<option value='dup' selected>Duplication</option>
									<option value="zom">Zoom in</option>
								</select>
							</div>
						</div>
						<div class='col-6'>
							<label for="customRange1">Color sale</label>
							<input type="range" class="custom-range" min="10" max="1000" value="0" id="colourScaleRange">
						</div>
					</div>
					<div class='row w-100'>
						<div class='col-12'>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text">Segments to assemble</span>
								</div>
								<textarea id='textarea_bed_format' class="form-control" aria-label="With textarea"></textarea>
							</div>
						</div>
					</div>
					<div class='row w-100'>
						<div class='col-12'>
							<button id='btn_example' class='btn btn-sm btn-success my-3'>Example</button>
							<button id='btn_apply' class='btn btn-sm btn-primary my-3 ml-2'>Apply</button>
						</div>
					</div>
				</div>
				<div class='row p-4'>
					<div class='col-12'>
						<canvas id='cancerHiCcanvas' class='w-100'>
						</canvas>
						<canvas id='chromosomeCanvas' class='w-100'>
						</canvas>
					</div>
				</div>
				<div class='row p-4'>
					<div class='col-12' id='error_message'>
					</div>
				</div>
			</div>
		</section>
	</main>

<jsp:include page="../common/footer.jsp" flush="false"/>