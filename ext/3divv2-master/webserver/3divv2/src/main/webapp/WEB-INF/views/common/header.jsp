<!DOCTYPE html>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">

	<title>3DIV</title>
	<meta content="" name="descriptison">
	<meta content="" name="keywords">
	<meta http-equiv="Content-Security-Policy" content="default-src *; img-src * 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src  'self' 'unsafe-inline' *">

	<!-- Vendor JS Files -->
	<script src="resources/js/vendor/jquery/jquery.min.js"></script>
	
	<link rel="stylesheet" href="resources/js/vendor/jquery/jquery-ui.css">
	<script src="resources/js/vendor/jquery/jquery-ui.js"></script>
	
	<script src="resources/js/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="resources/js/vendor/jquery.easing/jquery.easing.min.js"></script>
	<script src="resources/js/vendor/php-email-form/validate.js"></script>
	<script src="resources/js/vendor/waypoints/jquery.waypoints.min.js"></script>
	<script src="resources/js/vendor/isotope-layout/isotope.pkgd.min.js"></script>
	<script src="resources/js/vendor/d3/d3.v5.min.js"></script>
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.6.4/jquery.contextMenu.min.js"></script>
	
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js"></script>

	<!-- <script src="//cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js"></script>
	<link href="//cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css"> -->
	
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/dt-1.10.21/datatables.min.css"/>
	<script type="text/javascript" src="https://cdn.datatables.net/v/bs4/dt-1.10.21/datatables.min.js"></script>

	<script src="resources/js/common/loading.js"></script>

	<!-- Google Fonts -->
	<link href="resources/css/font.css" rel="stylesheet">

	<!-- Vendor CSS Files -->
	<link href="resources/js/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link href="resources/js/vendor/icofont/icofont.min.css" rel="stylesheet">
	<link href="resources/js/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
	<link href="resources/js/vendor/remixicon/remixicon.css" rel="stylesheet">
	<link href="resources/js/vendor/owl.carousel/assets/owl.carousel.min.css" rel="stylesheet">
	<link href="resources/js/vendor/aos/aos.css" rel="stylesheet">

	<!-- Template Main CSS File -->
	<link href="resources/css/style.css" rel="stylesheet">
	<link href="resources/css/contents.css" rel="stylesheet">
	<link href="resources/css/hic.css" rel="stylesheet">
	<link href="resources/css/capturehic/capturehic.css" rel="stylesheet" >
	
	<!-- multiple-select CSS -->
	<link rel="stylesheet" href="https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.css">
	<!-- multiple-select JavaScript -->
	<script src="https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.js"></script>
	
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-171069841-1"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		
		gtag('config', 'UA-171069841-1');
	</script>
</head>

<body>
	<!-- ======= Header ======= -->
	<header id="header" class="fixed-top">
		<div class="container d-flex align-items-center">
			<%-- <h1 class="logo mr-auto"><a href="<c:url value='/'/>">3DIV</a></h1> --%>
			<h1 class="logo mr-auto"><a href="<c:url value="/"/>"><img id='main_logo' src="resources/images/logo.png" alt="" style='width:330px;'/></a></h1>
			
			<nav class="nav-menu d-none d-lg-block">
				<ul>
					<%-- <li id="nav-home"><a href="<c:url value="/"/>">Home</a></li> --%>
					<li id="nav-hic"><a href="<c:url value="hic"/>">Hi-C</a></li>
					<li id="nav-capturehic"><a href="<c:url value="capture_hic"/>">Capture Hi-C</a></li>
					<li id="nav-cancerhic"><a href="<c:url value="cancer_hic"/>">Cancer Hi-C</a></li>
					<li id="nav-statistics"><a href="<c:url value="statistics"/>">Statistics</a></li>
					<li id="nav-download"><a href="<c:url value="download"/>">Download</a></li>
					<li id="nav-tutorial"><a href="<c:url value="tutorial"/>">Tutorial</a></li>
					<li id="nav-contact"><a href="<c:url value='contact'/>">Contact Us</a></li>
				</ul>
			</nav><!-- .nav-menu -->
			<!-- <a href="#about" class="get-started-btn scrollto">Get Started</a> -->
		</div>
	</header><!-- End Header -->



<!-- START : 2020 SEP 25 Cut panel Added by insoo078 -->
	<div class='cut-controller-panel dialog-title container rounded shadow bg-light position-absolute d-none' style='top:110px;left:30px;width:530px;z-index:9999!important'>
		<input type='hidden' id='which_tab_cut_dialog'/>
		<input type='hidden' id='which_panel_cut_dialog'/>

		<div id='cut-controller-panel-title' class='row py-1 justify-content-center bg-secondary text-light rounded-top'>
			<div class='col-12 text-center card-text noselect'>Dialog</div>
		</div>
		<div class='row p-2'>
			<div class='col'>
				<h5>User can designate cutting region by dragging or precise genomic coordinates</h5>
			</div>
		</div>

		<div class='row p-2'>
			<div class='col-12'>
				<div class='row py-2'>
					<div class='col m-auto'>
						<div class="btn-group btn-group-toggle" data-toggle="buttons">
							<label class="btn btn-sm btn-warning" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="cutGapOptions" id="cutGapOptions" value='1'>1b
							</label>
							<label class="btn btn-sm btn-warning" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="cutGapOptions" id="cutGapOptions" value='10'>10b
							</label>
							<label class="btn btn-sm btn-warning" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="cutGapOptions" id="cutGapOptions" value='100'>100b
							</label>
							<label class="btn btn-sm btn-warning" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="cutGapOptions" id="cutGapOptions" checked value='1000'>1Kb
							</label>
							<label class="btn btn-sm btn-warning" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="cutGapOptions" id="cutGapOptions" value='5000'>5Kb
							</label>
							<label class="btn btn-sm btn-warning" style='width:70px;'><i class='fa fa-gear'></i>
								<input type="radio" name="cutGapOptions" id="cutGapOptions" value='40000'>40Kb
							</label>
							<label class="btn btn-sm btn-warning" style='width:75px;'><i class='fa fa-gear'></i>
								<input type="radio" name="cutGapOptions" id="cutGapOptions" value='500000'>500Kb
							</label>
						</div>
					</div>
				</div>
				<div class='row py-2'>
					<div class='col-2'>
						cutStart
					</div>
					<div class='col-10'>
						<div class='input-group'>
							<div class='btn btn-sm bg-light cutStartMinus border' style='width:40px;'><i class='fa fa-minus'></i></div>
							<input type='text' class="form-control" id='cutStart'></input>
							<div class='btn btn-sm bg-light cutStartPlus border' style='width:40px;'><i class='fa fa-plus'></i></div>
							<div class='btn btn-sm bg-secondary cutStartSet ml-1 text-white'>Set</div>
						</div>
					</div>
				</div>
				<div class='row py-2'>
					<div class='col-2'>
						cutEnd
					</div>
					<div class='col-10'>
						<div class='input-group'>
							<div class='btn btn-sm bg-light cutEndMinus border' style='width:40px;'><i class='fa fa-minus'></i></div>
							<input type='text' class="form-control" id='cutEnd'></input>
							<div class='btn btn-sm bg-light cutEndPlus border' style='width:40px;'><i class='fa fa-plus'></i></div>
							<div class='btn btn-sm bg-secondary cutEndSet ml-1 text-white'>Set</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class='row px-2 pb-3 pt-4 rounded-bottom'>
			<div class='col'>
				<div class='row'>
					<div class='col'>
						<div class='btn-cut-dialog-close btn btn-sm btn-secondary ml-2 float-right'>Close</div>
						<div class='btn-cut-dialog-apply btn btn-sm btn-primary float-right'>Apply</div>
					</div>
				</div>
			</div>
		</div>
	</div>
<!-- END : 2020 SEP 25 Cut panel Added by insoo078 -->