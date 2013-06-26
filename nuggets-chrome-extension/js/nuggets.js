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
            related_nuggets.push('<tr><td><p>' + results[i].get("text") + '</p></td></tr>');
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

var maxNuggetCharLength = 140;

$('#nugget-text').bind('input', function() {
  var charsLeft = maxNuggetCharLength - $(this).val().length;
  $('#nugget-text-count').html(charsLeft);
  if (charsLeft < 0)
  {
    $('#nugget-text-count').css('color','red');
    $('#add-nugget-button').prop('disabled', true);
  }
  else
  {
    $('#nugget-text-count').css('color','gray');
    $('#add-nugget-button').prop('disabled', false);
  }
  $('#nugget-message').css('display','none');
});

$('#add-nugget-button').click(function()
{
  $('#add-nugget-button').prop('disabled', true);
  if ($('#nugget-text').val() == "")
  {
    $('#nugget-message').css('color','red');
    $('#nugget-message').html("Enter a nugget!");
    $('#nugget-message').css('display','block');
    $('#nugget-text').focus();
    $('#add-nugget-button').prop('disabled', false);
  }
  else if ($('#nugget-text').val().length > maxNuggetCharLength) // textarea bind to input should prevent this, but putting this in as backup to verify nugget text is not over maxNuggetCharLength characters.
  {
    $('#nugget-message').css('color','red');
    $('#nugget-message').html("Nugget can't be more than " + maxNuggetCharLength + " characters!");
    $('#nugget-message').css('display','block');
    $('#nugget-text').focus();
    $('#add-nugget-button').prop('disabled', false);
  }
  else
  {
    chrome.tabs.getSelected(null, function(tab) {
      var Nugget = Parse.Object.extend("Nugget");
      var nugget = new Nugget();
      var tabURL = "";
      if ($('#nugget-source').val() == tab.title) // only save url if nugget-source field is still tab's title - ie. user didn't change it
      {
        tabURL = tab.url;
      }
      var tagsToSave = [];
      var tagsText = $('#nugget-tags').attr("value"); // .val() AND .prop("value") returns "" after submitting the first time.  Should be checking for the HTML markup attribute instead.
      if (tagsText != null)
      {
        tagsToSave = tagsText.split(',');
      }
      nugget.save({
        text: $('#nugget-text').val(),
        source: $('#nugget-source').val(),
        url: tabURL,
        tags: tagsToSave,
        owner: Parse.User.current()
      }, {
        success: function(nugget)
        {
          $('#nugget-message').css('color','green');
          $('#nugget-message').html("Saved!");
          $('#nugget-message').css('display','block');
          $('#nugget-text').val("");
          $('#nugget-tags').val("");
          runQuery();
          $('.icon-remove').each(function() {
            $(this).click();
          });
          $('#nugget-text').focus();
          $('#add-nugget-button').prop('disabled', false);
        },
        error: function(object, error)
        {
          $('#nugget-message').css('color','red');
          $('#nugget-message').html(error.message);
          $('#nugget-message').css('display','block');
          $('#nugget-text').focus();
          $('#add-nugget-button').prop('disabled', false);
        }
      });
    });
  }
});

$('#logout-button').click(function()
{
  Parse.User.logOut();
  goToLoginPage();
});

});
