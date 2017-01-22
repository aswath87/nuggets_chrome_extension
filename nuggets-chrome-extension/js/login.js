$(document).ready(function(){

var CURRENT_NUGGET_USER = 'currentNuggetUser';

function initialize() {
  $("span[data-toggle=tooltip]").tooltip();
  validateLogin();
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function getCurrentUser() {
    JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER));
}

function saveCurrentUserInLocalStorage(user) {
    localStorage.setItem(CURRENT_NUGGET_USER, JSON.stringify(user))
}

function validateLogin() {
  var currentUser = getCurrentUser();
  if (currentUser)
  {
    goToNuggetPage();
  }
  else
  {
    $('#login-email').focus();
  }
}

function goToNuggetPage()
{
  window.location.replace('nuggets.html');
}

function goToWelcomePage()
{
  window.location.replace('welcome.html');
}

initialize();

function attemptLogin()
{
  $('#login-button').prop('disabled', true);
  if ($('#login-email').val() == "" || $('#login-password').val() == "")
  {
    $('#login-error-1').css('display','block');
    $('#login-error-2').css('display','none');
    $('#login-password-message').css('display','none');
    $('#login-email').focus();
  }
  else
  {
    $('#login-error-1').css('display','none');
    $('#login-error-2').css('display','none');
    $('#login-password-message').css('display','none');
    $.post("https://nuggets-django.herokuapp.com/api-token-auth/",
      {
          username: $('#login-email').val(),
          password: $('#login-password').val()
      },
      function(response, status){
          saveCurrentUserInLocalStorage(response);
          goToNuggetPage();
      },
      function(user, error) {
        $('#login-error-2').css('display','block');
        $('#login-email').focus();
      });
  }
  $('#login-button').prop('disabled', false);
}

$('#login-button').click(function()
{
  attemptLogin();
});

$('#login-password').keyup(function(e)
{
  if (e.which == 13)
  {
    attemptLogin();
  }
});

$('#login-forgot-password-icon').click(function()
{
  $('#login-error-1').css('display','none');
  $('#login-error-2').css('display','none');
  var email = $('#login-email').val();
  if (validateEmail(email))
  {
    Parse.User.requestPasswordReset(email, {
    success: function() {
      $('#login-password-message').css('color','green');
      $('#login-password-message').html("Instructions to reset your password were sent to " + email);
      $('#login-password-message').css('display','block');
    },
    error: function(error) {
      $('#login-password-message').css('color','red');
      $('#login-password-message').html(error.message);
      $('#login-password-message').css('display','block');
      $('#login-email').focus();
    }
    });
  }
  else
  {
    $('#login-error-2').css('display','block');
    $('#login-email').focus();
  }
});

function attemptRegister()
{
  $('#register-button').prop('disabled', true);
  if ($('#register-name').val() == "")
  {
    $('#register-error-1').css('display','block');
    $('#register-error-2').css('display','none');
    $('#register-error-3').css('display','none');
    $('#register-error-4').css('display','none');
    $('#register-name').focus();
  }
  else if (!validateEmail($('#register-email').val()))
  {
    $('#register-error-1').css('display','none');
    $('#register-error-2').css('display','block');
    $('#register-error-3').css('display','none');
    $('#register-error-4').css('display','none');
    $('#register-email').focus();
  }
  else if ($('#register-password').val().length < 6)
  {
    $('#register-error-1').css('display','none');
    $('#register-error-2').css('display','none');
    $('#register-error-3').css('display','block');
    $('#register-error-4').css('display','none');
    $('#register-password').focus();
  }
  else
  {
    $('#register-error-1').css('display','none');
    $('#register-error-2').css('display','none');
    $('#register-error-3').css('display','none');
    $('#register-error-4').css('display','none');
    var user = new Parse.User();
    user.set("displayname", $('#register-name').val());
    user.set("username", $('#register-email').val());
    user.set("password", $('#register-password').val());
    user.set("email", $('#register-email').val());
    user.signUp(null, {
      success: function(user) {
        goToWelcomePage();
      },
      error: function(user, error) {
        $('#register-error-4').html(error.message);
        $('#register-error-4').css('display','block');
        $('#register-email').focus();
      }
    });
  }
  $('#register-button').prop('disabled', false);
}

$('#register-button').click(function()
{
  attemptRegister();
});

$('#register-password').keyup(function(e)
{
  if (e.which == 13)
  {
    attemptRegister();
  }
});

$('#go-to-register').click(function()
{
  $('#login-div').css('display','none');
  $('#register-div').css('display','block');
  $('#register-name').focus();
});

$('#go-to-login').click(function()
{
  $('#register-div').css('display','none');
  $('#login-div').css('display','block');
  $('#login-email').focus();
});

});
