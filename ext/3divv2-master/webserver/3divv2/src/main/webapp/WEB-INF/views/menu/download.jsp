<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>

<script type="text/javascript" src="resources/js/jquery/jquery.rowspanizer.js"></script>
<script type="text/javascript" src="resources/js/download.js"></script>

<script>
	$(document).ready(function(){
		$(".nav-menu > ul > li").removeClass("active");
		$("#nav-download").addClass("active");
	})
</script>

<style>
	.table thead th { vertical-align: middle; }
	.table tbody tr td { vertical-align: middle; }
</style>

	<section id="subhero" class="d-flex align-items-center">
		<div class="container position-relative">
			<div class="row justify-content-center">
				<div class="col-xl-7 col-lg-9 text-center">
					<h1>DOWNLOAD</h1>
				</div>
			</div>
		</div>
	</section>
	
	<main id="main">
		<section id="download" class="download downloadpage">
			<div class="container" data-aos="fade-up">

				<div style="font-weight: bold;">The 3DIV release files can be found in our <a href="ftp://ftp_3div:3div@ftp.kobic.re.kr" target="_blank" style="color:#3636ca">FTP sites</a>( ID: ftp_3div, Password : 3div ).</div>
<!--
 				<ul class="nav nav-tabs">
					<li class="nav-item">
						<a class="nav-link active" data-toggle="tab" href="#download-hic">Hi-C</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" data-toggle="tab" href="#download-capturehic">Capture Hi-C</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" data-toggle="tab" href="#download-cancerhic">Cancer Hi-C</a>
					</li>
				</ul>
			
				<div class="tab-content">
					<div class="pt-5 table-responsive tab-pane fade show active" id="download-hic">
						<div style="font-weight: bold;">The 3DIV release files can be found in this website(<a href="http://kobic.kr/3div/download" style="color:#3636ca">http://kobic.kr/3div/download</a>) or directly in our <a href="ftp://ftp_3div:3div@ftp.kobic.re.kr" target="_blank" style="color:#3636ca">FTP sites</a>( ID: ftp_3div, Password : 3div ).</div>
						<div class="text-right"><input type="text" id="download-search" style="width:200px; margin-bottom: 10px;"></div>
						
						<table class="table table-sm table-bordered text-center" id="download-list" class='statistics' style="border-top:2px solid #777777; line-height:28px;">
					 		<colgroup>
								<col style="width: 30%" />
								<col style="width: 20%" />
								<col style="width: 20%;" />
								<col style="width: 13%;" />
								<col style="width: 7%" />
								<col style="width: 10%" />
							</colgroup>
							<thead class="table-secondary" style="font-size:13px; border:0;">
						 		<tr>
									<th>Sample Name</th>
									<th>Reference</th>
									<th>Exp List</th>
									<th>Cut-off</th>
									<th>File Size</th>
									<th>Download</th>
									<th>Super Enhancer</th>
								</tr>
							</thead>
							<tbody style="font-size:11px;">
								<c:forEach var="result" items="${list}" varStatus="status">
									<tr>
										<td>${result.celline_name}</td>
										<td><span class="hidden">${result.id}</span> ${result.reference}</td>
										<td>${result.geo_accession}</td>
										<td>${result.cutoff}</td>
										<td>${result.file_size}</td>
										<td><a class="sampleDownloadImg download-img" id="${result.file_path}"></a></td>
										<td><span class="hidden">${result.id}</span><c:if test="${result.super_enhancer_path != null}"><a class="sampleDownloadImg download-img" id="${result.super_enhancer_path}"></a></c:if></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</div>
					
					<div class="pt-5 table-responsive tab-pane fade" id="download-capturehic">
						<p>To be updated.</p>
					</div>
					
					<div class="pt-5 table-responsive tab-pane fade" id="download-cancerhic">
						<p>To be updated.</p>
					</div>
				</div>
-->


			</div>
		</section>
	</main>

<jsp:include page="../common/footer.jsp" flush="false"/>