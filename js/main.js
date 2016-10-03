(function() {
  $('a[href*="#"]').click(function(event) {
    event.preventDefault();
    var link = $(this).attr("href");
    $('html, body').animate({
      scrollTop: $(link).offset().top - 50
    }, 600);
  });
})();
