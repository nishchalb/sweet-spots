//@author Nishchal Bhandari
$(document).ready(function() {
  // Make the error message
  var errorMsg = $("<div></div>");
  errorMsg.hide();
  errorMsg.addClass("alert");
  errorMsg.addClass("alert-danger");
  errorMsg.addClass("fade");
  errorMsg.addClass("in");
  $("form").append(errorMsg);
  // Handle post request
  $('body').on('click', 'button.post-button', function(e) {
    $.post("/users/login/", $('form#login-form').serialize(), function(data) {
      console.log(data);
      window.location = '/';
    }, 'json')
    .fail(function(e) {
      // Update error and show
      errorMsg.text("Error: " + e.responseJSON.err);
      errorMsg.show();
    });
    e.preventDefault();
  });
});
