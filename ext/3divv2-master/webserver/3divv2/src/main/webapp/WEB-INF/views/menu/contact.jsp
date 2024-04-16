<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page buffer="16kb" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="../common/header.jsp" flush="false"/>
  
  <section id="subhero" class="d-flex align-items-center">
    <div class="container position-relative">
      <div class="row justify-content-center">
        <div class="col-xl-7 col-lg-9 text-center">
          <h1>CONTACT US</h1>
        </div>
      </div>
    </div>
  </section>
  
  <main id="main">
    <section id="contact" class="contact contactpage">
     	<div class="container" data-aos="fade-up">
     		<p class="mb-4">
     			Please send us all questions, suggestions, and requests.
     		</p>
     		
     		<div class="info">
              <div class="mb-3">
                <i class="icofont-user"></i>
                <h4>Inkyung Jung <span><a href="mailto:ijungkaist@gmail.com">ijungkaist@gmail.com</a></span></h4>
              </div>
			  <div class="mb-5">
                <i class="icofont-user"></i>
                <h4>Insu Jang <span><a href="mailto:insoo078@kribb.re.kr">insoo078@kribb.re.kr</a></span></h4>
              </div>
            </div>
     		
     		<p>
     			We welcome any questions, advices, and suggestions about 3D-Genome Interaction Viewer & database.<br/>
     			Thank you.
     		</p>
     	</div>
    </section>

  </main>

<script>
	$(document).ready(function(){
		$(".nav-menu > ul > li").removeClass("active");
		$("#nav-contact").addClass("active");
	})
</script>
<jsp:include page="../common/footer.jsp" flush="false"/>