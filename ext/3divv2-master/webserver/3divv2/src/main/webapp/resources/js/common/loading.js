$(document).ready(function () {
	$( document ).ajaxStart(function() {
		$( "#preloader" ).show();
	});

//	$( document ).ajaxEnd(function() {
//		$( "#preloader" ).hide();
//	});
});