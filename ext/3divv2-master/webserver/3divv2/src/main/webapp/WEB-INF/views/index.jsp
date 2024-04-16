<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<script type="text/javascript" src="resources/js/util/utils.js"></script>

<jsp:include page="./common/header.jsp" flush="false"/>
	<script>
		$(document).ready(function(){
			$(".nav-menu > ul > li").removeClass("active");
			$("#nav-home").addClass("active");

			var browserType = detectBrowserType();
			if( !(browserType == 2 || browserType == 3) ) {
				$("#modal").modal();
			}
			
			$(".sub-section-box").click(function(){
				if( $(this).hasClass("main-section-hic") ) {
					window.location.href="hic";
				}else if($(this).hasClass("main-section-pc-hic")){
					window.location.href="capture_hic"
				}else {
					window.location.href="cancer_hic"
				}
			});
		});
	</script>
	
	<style>
		.noselect {
			-webkit-touch-callout: none; /* iOS Safari */
			-webkit-user-select: none; /* Safari */
			-khtml-user-select: none; /* Konqueror HTML */
			-moz-user-select: none; /* Old versions of Firefox */
			-ms-user-select: none; /* Internet Explorer/Edge */
			user-select: none; /* Non-prefixed version, currently
			supported by Chrome, Edge, Opera and Firefox */
			cursor:pointer;
		}
	</style>

	<!-- ======= Hero Section ======= -->
	<section id="hero" class="d-flex align-items-center">
		<div class="container position-relative" data-aos="fade-up" data-aos-delay="100">
			<div class="row justify-content-center">
				<div class="col-xl-7 col-lg-9 text-center">
					<h1>3D-Genome Interaction Viewer & database</h1>
					<h2>Easy-to-use database about 3D-genome</h2>
				</div>
			</div>
			<!-- <div class="text-center">
			<a href="#about" class="btn-outline-white scrollto mt-4">Get Started</a>
			</div> -->
		</div>
	</section><!-- End Hero -->

	<main id="main">
		<!-- ======= About Section ======= -->
		<section id="about" class="about">
			<div class="container" data-aos="fade-up">
				<div class="section-title">
					<h2>About 3DIV</h2>
					<p>
						3D genome organization is tightly coupled with gene regulation in various biological processes and diseases.
						3D Interaction Viewer and Database (3DIV) is a database providing chromatin interaction visualization in a variety of options from one-to-all chromatin interaction with epigenetic annotation to unique dynamic browsing tools allowing examination of large-scale genomic rearrangement mediated impacts in cancer 3D genome.
						3DIV will be the most comprehensive resource to explore gene regulatory effects of both normal and cancer 3D genome.
					</p>
				</div>
				
				<div class="row icon-boxes">
					<div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0" data-aos="zoom-in" data-aos-delay="200">
						<div class="icon-box sub-section-box main-section-hic noselect">
							<!-- <div class="icon"><i class="ri-stack-line"></i></div> -->
							<h4 class="title"><a href="<c:url value="hic"/>">Hi-C</a></h4>
							<p class="description">3DIV provides querying list of significant interacting partner locus, visualization, and comparative analysis of 3D chromatin interaction across about 400 samples.</p>
						</div>
					</div>
					
					<div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0" data-aos="zoom-in" data-aos-delay="300">
						<div class="icon-box sub-section-box main-section-pc-hic noselect">
							<!-- <div class="icon"><i class="ri-palette-line"></i></div> -->
							<h4 class="title"><a href="<c:url value="capture_hic"/>">Capture Hi-C</a></h4>
							<p class="description">3DIV provides promoter capture Hi-C (pcHi-C) results across 28 normal human cell/tissue types, a great resource in identifying target genes of disease-associated genetic variants.</p>
						</div>
					</div>
					
					<div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0" data-aos="zoom-in" data-aos-delay="400">
						<div class="icon-box sub-section-box main-section-cancer-hic noselect">
							<!-- <div class="icon"><i class="ri-command-line"></i></div> -->
							<a href="<c:url value="cancer_hic"/>"><h4 class="title">Cancer Hi-C</a></h4>
							<p class="description">3DIV provides unique visualization and manipulation tools that allows user to generate rearranged 3D genome by selecting listed SVs, creating own SVs, and providing order of rearranged chromosomes.</p>
						</div>
					</div>
				</div>
			</div>
		</section><!-- End About Section -->
	
		<!-- ======= Counts Section ======= -->
		<section id="counts" class="counts section-bg">
			<div class="container">
				<div class="row justify-content-end">
					<div class="col-lg-4 col-md-3 col-6 d-md-flex align-items-md-stretch">
						<div class="count-box">
 						<span class="d-inline-block"> ~ </span>
						<span class="d-inline-block" data-toggle="counter-up">400</span>
						<p>Samples</p>
						</div>
					</div>
					
					<div class="col-lg-4 col-md-3 col-6 d-md-flex align-items-md-stretch">
						<div class="count-box">
							<span class="d-inline-block"> > </span>
							<span class="d-inline-block" data-toggle="counter-up">19</span>
							<p>Cancer types</p>
						</div>
					</div>
					
					<div class="col-lg-4 col-md-6 col-12 d-md-flex align-items-md-stretch">
						<div class="count-box">
							<span data-toggle="counter-up">2,603</span>
							<p>Colon cancer specific Structural Variations</p>
						</div>
					</div>
				</div>
			</div>
		</section><!-- End Counts Section -->
		
    <section id="clients" class="border">
      <div class="container">
        <div class="row">
        	<div class='col text-center' id='piechart_container'>
        		<img  class='border w-100' src='./resources/images/piechart.png'>
        	</div>
        </div>
      </div>
    </section><!-- End Clients Section -->
	
		<!-- ======= About Video Section ======= -->
		<section id="about-video" class="about-video">
			<div class="container" data-aos="fade-up">
				<div class="row">
					<div class="col-12 pt-3 pt-lg-0 content" data-aos="fade-left" data-aos-delay="100">
						<h3>References</h3>
						<ul>
							<li class="mb-3">
								<i class="bx bx-check-double"></i>
								<h5 style="color:#124265;">3DIV Update for 2021: a comprehensive resource of 3D genome and 3D cancer genome</h5>
								<p>
									Kyukwang Kim, Insu Jang, Mooyoung Kim, Jinhyuk Choi, Min-Seo Kim, Byungwook Lee, and Inkyung Jung
								</p>
								<p class="font-italic">
									Submitted to Nucleic Acids Res.
								</p>
							</li>
							<li class="mb-3">
								<i class="bx bx-check-double"></i>
								<h5 style="color:#124265;"><a href="<c:url value="https://academic.oup.com/nar/article/46/D1/D52/4584622"/>" target="_blank">3DIV: A 3D-genome Interaction Viewer and database</a></h5>
								<p>
									Dongchan Yang, Insu Jang, Jinhyuk Choi, Min-Seo Kim, Andrew J Lee, Hyunwoong Kim, Junghyun Eom, Dongsup Kim, Inkyung Jung and Byungwook Lee
								</p>
								<p class="font-italic">
									Nucleic Acids Res. 2018 Jan; Vol 46, Issue D1 (Database issue):D52-57.
								</p>
							</li>
							<li>
								<i class="bx bx-check-double"></i>
								<h5 style="color:#124265;"><a href="<c:url value="https://www.nature.com/articles/s41588-019-0494-8"/>" target="_blank">A compendium of promoter-centered long-range chromatin interactions in the human genome</a></h5>
								<p>
									Inkyung Jung, Anthony Schmitt, Yarui Diao, Andrew J. Lee, Tristin Liu, Dongchan Yang, Catherine Tan, Junghyun Eom, Marilynn Chan, Sora Chee, Zachary Chiang, Changyoun Kim, Eliezer Masliah, Cathy L. Barr, Bin Li, Samantha Kuan, Dongsup Kim & Bing Ren
								</p>
								<p class="font-italic">
									Nature Genetics volume 51, pages 1442–1449(2019).
								</p>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section><!-- End About Video Section -->
	</main><!-- End #main -->
	
	
	<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Notice</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div>MS Internet Explorer(IE) browser is not supported by 3DIV database. <br/>We highly recommend that you use the current version of Chrome and Safari browser.</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
	
	
<jsp:include page="./common/footer.jsp" flush="false"/>