$(document).ready(function(){

$('#my-nuggets-table').on('click', 'a.nugget-source-link', function(event) {
  chrome.tabs.create({url: $(this).attr('href')});
  return false;
});

function initialize() {
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function runQuery()
{
  var Nugget = Parse.Object.extend("Nugget");
  var query = new Parse.Query(Nugget);
  query.equalTo("owner", Parse.User.current()).descending("createdAt");
  query.find({
    success: function(results) {
      if (results.length == 0)
      {
        $('#my-nuggets-table').html('<p>none</p>');
      }
      else
      {
        var my_nuggets = [];
        for(i=0;i<results.length;i++)
        {
          var markup_to_push = '<tr><td><p>' + results[i].get("text") + '</p>';
          if (results[i].get("url") != "")
          {
            markup_to_push += '<a href="' + results[i].get("url") + '" class="nugget-source-link">' + results[i].get("source") + '</a>';
          }
          markup_to_push += '</td></tr>';

          my_nuggets.push(markup_to_push);
        }
        $('#my-nuggets-table').html(my_nuggets.join(''));
      }
    }
  });
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
    runQuery();
  }
}

initialize();

$('#logout-button').click(function()
{
  Parse.User.logOut();
  goToLoginPage();
});

});
