$(document).ready(function(){

function initialize() {
  chrome.tabs.getSelected(null, function(tab) {
    $('#nugget-source').val(tab.title);
  });
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function runQuery()
{
  chrome.tabs.getSelected(null, function(tab) {
    var Nugget = Parse.Object.extend("Nugget");
    var query = new Parse.Query(Nugget);
    query.equalTo("url", tab.url).descending("createdAt").limit(10);
    query.find({
      success: function(results) {
        if (results.length == 0)
        {
          $('#related-nuggets-table').html('<p>none</p>');
        }
        else
        {
          var related_nuggets = [];
          for(i=0;i<results.length;i++)
          {
            related_nuggets.push('<tr><td><p>' + results[i].get("text") + '<img class="follow-image" src="img/plus.png"/></p></td></tr>');
          }
          $('#related-nuggets-table').html(related_nuggets.join(''));
        }
      }
    });
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

$('#add-nugget-button').click(function()
{
  if ($('#nugget-text').val() != "")
  {
    chrome.tabs.getSelected(null, function(tab) {
      var Nugget = Parse.Object.extend("Nugget");
      var nugget = new Nugget();
      nugget.save({
        text: $('#nugget-text').val(),
        source: $('#nugget-source').val(),
        url: tab.url,
        tags: [$('#nugget-tags').val()],
        owner: Parse.User.current()
      }, {
        success: function(nugget)
        {
          // show some form of success here
          $('#nugget-text').val("");
          $('#nugget-tags').val("");
          runQuery();
        },
        error: function(object, error)
        {
          // show some form of error here
        }
      });
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
