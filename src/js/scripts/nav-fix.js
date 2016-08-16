// Nav Fix
// =====================
(function() {

  var screenSize = $(window).width();

  // Make parent nav item w/ children clickable on desktop
  $('.dropdown-toggle').on('click', function() {
    if (screenSize >= 768) {
      $(location).attr('href', $(this).attr('href'));
    }
  });

  // Make parent nav item w/ children open on first tap, propagate on second for mobile
  $('li.dropdown').on('click', function() {
    if (screenSize <= 767 && $(this).hasClass('open')) {
      var link = $(this).children('a.dropdown-toggle');
      $(location).attr('href', $(link).attr('href'));
    }
  });

})();
