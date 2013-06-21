$(document).ready(function(){

function initialize() {
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}

function validateLogin() {
  var currentUser = Parse.User.current();
  if (currentUser)
  {
    goToNuggetPage();
  }
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function goToNuggetPage()
{
  window.location.replace('nuggets.html');
}

initialize();

$('#login-button').click(function()
{
  $('#login-button').disabled = true;
  if ($('#login-email').val() == "" || $('#login-password').val() == "")
  {
    $('#login-error-1').css('display','block');
    $('#login-error-2').css('display','none');
    $('#login-email').focus();
  }
  else
  {
    $('#login-error-1').css('display','none');
    $('#login-error-2').css('display','none');
    Parse.User.logIn($('#login-email').val(), $('#login-password').val(), {
      success: function(user) {
        goToNuggetPage();
      },
      error: function(user, error) {
        $('#login-error-2').css('display','block');
        $('#login-email').focus();
      }
    });
  }
  $('#login-button').disabled = false;
});

});
