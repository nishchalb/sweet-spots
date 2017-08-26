//@author Nishchal Bhandari
$(document).ready(function() {
  // Construct error msg
  var errorMsg = $("<div></div>");
  errorMsg.hide();
  errorMsg.addClass("alert");
  errorMsg.addClass("alert-danger");
  errorMsg.addClass("fade");
  errorMsg.addClass("in");
  $("form").append(errorMsg);
  // Handle post
  $('body').on('click', 'button.post-button', function(e) {
    $.post("/users/", $('form#register-form').serialize(), function(data) {
      window.location = '/login';
    }, 'json')
    .fail(function(e) {
      // Show error on fail
      errorMsg.text("Error: " + e.responseJSON.err);
      errorMsg.show();
    });
    e.preventDefault();
  });
});
