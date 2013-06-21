$(document).ready(function(){

var tabURL = "";

function initialize() {
  chrome.tabs.getSelected(null, function(tab) {
    $('#nugget-source').val(tab.title);
    tabURL = tab.url;
  });
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function validateLogin() {
  var currentUser = Parse.User.current();
  if (!currentUser)
  {
    goToLoginPage();
  }
  else
  {
    $('#extension-container').css('display','block');
  }
}

initialize();

$('#add-nugget-button').click(function()
{
  if ($('#nugget-text').val() != "")
  {
    var Nugget = Parse.Object.extend("Nugget");
    var nugget = new Nugget();
    nugget.save({
      text: $('#nugget-text').val(),
      source: $('#nugget-source').val(),
      url: tabURL,
      tags: [$('#nugget-tags').val()],
      owner: Parse.User.current()
    }, {
      success: function(nugget)
      {
        // show some form of success here
        $('#nugget-text').val("");
        $('#nugget-tags').val("");
      },
      error: function(object, error)
      {
        // show some form of error here
      }
    });
  }
  else
  {
    // show error to provide nugget!
  }
});

$('#logout-button').click(function()
{
  Parse.User.logOut();
  goToLoginPage();
});

});
