(function() {
  $('a[href*="#"]').click(function(event) {
    event.preventDefault();
    var link = $(this).attr("href");
    $('html, body').animate({
      scrollTop: $(link).offset().top - 50
    }, 600);
  });
})();

(function() {
  $('form').on('submit', function(event) {
    var message;
    var errorFlag = false;
    var formData = $('form').serializeArray();
    for (var i = 0; i < formData.length; i++) {
      if (formData[i].value === '') {
        errorFlag = true;
        message  = 'All fields are required.';
        $('#form-message').html('<h4>' + message + '</h3>').addClass('error');
      } else {
        message = 'Success! We\'ll be in touch soon!';
      }
    }
    if (!errorFlag) {
      $.ajax({
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSddQnCrt9H1EyDnB6fGUAPgh072WzlbP51BlJIToZhR12QCnQ/formResponse',
        type: 'POST',
        data: $('form').serialize(),
        dataType: 'jsonp',
      }).always(function() {
        $('#form-message').html('<h4>' + message + '</h3>').addClass('success');
      });
    }
    event.preventDefault();
  });
})();
