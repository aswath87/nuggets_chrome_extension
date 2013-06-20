$(document).ready(function(){

function initialize() {
  chrome.tabs.getSelected(null, function(tab) {
    $(".prepopulate").val(tab.title);
  });
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
  var emailElement = document.getElementById("login-email");
  var passwordElement = document.getElementById("login-password");
  var error1Element = document.getElementById("login-error-1");
  var error2Element = document.getElementById("login-error-2");
  var loginButton = document.getElementById("login-button");
  loginButton.disabled = true;
  if (emailElement.value == "" || passwordElement.value == "")
  {
    error1Element.style.display = "block";
    error2Element.style.display = "none";
    emailElement.focus();
  }
  else
  {
    error1Element.style.display = "none";
    error2Element.style.display = "none";
    Parse.User.logIn(emailElement.value, passwordElement.value, {
      success: function(user) {
        goToNuggetPage();
      },
      error: function(user, error) {
        error2Element.style.display = "block";
        emailElement.focus();
      }
    });
  }
  loginButton.disabled = false;
});

});
