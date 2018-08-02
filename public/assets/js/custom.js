var windowSize;
$(document).ready(function(){
  var $window = $(window);
  checkWidth();

  function checkWidth() {
    windowSize = $(window).width();
  }

  if(windowSize > 900){

    $(".info-item .btn").click(function(){
      $(".container").toggleClass("log-in");
      $(".homepage_label").toggleClass("homepage_label_left");
    });
      $(".container-form .btn").click(function(){
      $(".container").addClass("active");

    });
  }else{
    
  }

$(window).resize(checkWidth);
});
