$(function() {
    var $window = $(window);
    var $header = $('#banner');
    var updateBackgroundPosition = function(e) {
        scrollPosition = $window.scrollTop();
        $header.css({'background-position': "0px -" + (scrollPosition - 100) + "px"});
    };
    $window.scroll(updateBackgroundPosition);
});

// CODE BELOW IS WORK-IN-PROGRESS TO GET RID OF JQUERY

// document.addEventListener('DOMContentLoaded', function() {
// 	var winEl = window;
// 	var header = document.getElementById('banner')

// 	    var updateBackgroundPosition = function(e) {
// 	    	var scrollPosition = winEl.scrollTop;
// 	    	header.style.backgroundPosition = "0px -" + (scrollPosition - 100) + "px";
// 	    };
// 	    // winEl.scroll(updateBackgroundPosition);
// });